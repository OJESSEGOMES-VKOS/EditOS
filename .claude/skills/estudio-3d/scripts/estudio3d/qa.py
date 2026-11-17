"""Controle de qualidade: render de quadros-chave, folha de contato e o medidor de "vida".

O medidor lê o PNG final (já com AgX/look aplicados, como o público vê) e devolve números e
vereditos. Ele não substitui o olho do diretor: ele impede que a IA diga "ficou bom" de um quadro
lavado, estourado ou chapado. Rode em todo quadro de revisão.

Uso dentro do Blender:   qa.render_quadros([0.5, 2.0, 4.5], 'conferencia', escala=50)
                         print(qa.relatorio(qa.analisar('conferencia/q_0.50.png')))
Uso por linha de comando: blender -b --factory-startup -P qa_cli.py -- imagem1.png imagem2.png
"""
import json
import math
import os

import bpy
import numpy as np

# limites calibrados em quadros reais (ver laboratorio/calibracao.md)
LIMITES = {
    'estourado': 0.02,      # > 2% dos pixels no branco puro = brilho estourado
    'afundado': 0.20,       # > 20% dos pixels no preto puro = sombra esmagada
    'lavado_contraste': 0.13,   # desvio de luminância abaixo disso + piso alto = lavado
    'lavado_piso': 0.10,
    'escuro_media': 0.16,   # média abaixo disso (sem ser intencional) = subexposto
    'sem_cor': 12.0,        # colorfulness (Hasler-Süsstrunk, 0-255) abaixo disso = cinza morto
    'chapado_detalhe': 0.0035,
    'borrado_nitidez': 0.42,    # nativo nítido ~0,52-0,55; ampliado de 50% ~0,32 (medido 2026-10-03)
    'ruido_max': 0.006,         # render limpo ~0,002-0,004; com grão de pós forte ~0,015  # energia de borda média (medida a 540 px de largura) abaixo disso = sem forma
}


def _pixels(caminho):
    img = bpy.data.images.load(os.path.abspath(caminho), check_existing=False)
    img.colorspace_settings.name = 'Non-Color'  # lê o valor gravado, sem converter
    w, h = img.size
    a = np.array(img.pixels[:], dtype=np.float32).reshape(h, w, 4)[::-1, :, :3]
    bpy.data.images.remove(img)
    return a


def _reduzir(a, largura=540):
    """leva a imagem a uma largura fixa (média por blocos) pra métrica não depender da resolução."""
    h, w, _ = a.shape
    k = max(1, round(w / largura))
    if k == 1:
        return a
    h2, w2 = h // k, w // k
    return a[:h2 * k, :w2 * k].reshape(h2, k, w2, k, 3).mean(axis=(1, 3))


def analisar(caminho, intencao=None):
    """intencao: None | 'escuro' (low key de propósito: luxo, neon) | 'claro' (high key)."""
    a = _reduzir(_pixels(caminho))
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    p = np.percentile(y, [2, 50, 98])
    rg = (r - g) * 255
    yb = (0.5 * (r + g) - b) * 255
    colorido = float(math.sqrt(rg.std() ** 2 + yb.std() ** 2) + 0.3 * math.sqrt(rg.mean() ** 2 + yb.mean() ** 2))
    gx = np.abs(np.diff(y, axis=1)).mean()
    gy = np.abs(np.diff(y, axis=0)).mean()
    # terços: onde está o peso visual (centro de massa do contraste)
    e = np.abs(np.diff(y, axis=1))[:-1, :] + np.abs(np.diff(y, axis=0))[:, :-1]
    hh, ww = e.shape
    tot = e.sum() + 1e-9
    cx = float((e.sum(axis=0) * np.arange(ww)).sum() / tot / ww)
    cy = float((e.sum(axis=1) * np.arange(hh)).sum() / tot / hh)
    m = {
        'arquivo': os.path.basename(caminho),
        'media': float(y.mean()),
        'p2': float(p[0]), 'p50': float(p[1]), 'p98': float(p[2]),
        'contraste': float(y.std()),
        'faixa': float(p[2] - p[0]),
        'estourado': float((y > 0.985).mean()),
        'afundado': float((y < 0.015).mean()),
        'colorido': colorido,
        'saturacao': float((a.max(axis=2) - a.min(axis=2)).mean()),
        'detalhe': float((gx + gy) / 2),
        'peso_x': cx, 'peso_y': cy,
    }
    m.update(nitidez_ruido(caminho))
    m['intencao'] = intencao
    m['vereditos'] = vereditos(m, intencao)
    return m


def nitidez_ruido(caminho):
    """mede na resolução cheia (o _reduzir esconderia os dois defeitos):
    nitidez = percentil 99,5 do |laplaciano| da luma (as bordas mais duras do quadro);
    ruido = desvio do resíduo de alta frequência só nas áreas lisas (onde não há borda).
    Imagem ampliada ou desfocada derruba a nitidez; poucas amostras ou grão sobem o ruído."""
    a = _pixels(caminho)
    y = 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]
    lap = np.abs(4 * y[1:-1, 1:-1] - y[:-2, 1:-1] - y[2:, 1:-1] - y[1:-1, :-2] - y[1:-1, 2:])
    k = 4
    h, w = (y.shape[0] // k) * k, (y.shape[1] // k) * k
    bl = y[:h, :w].reshape(h // k, k, w // k, k).mean(axis=(1, 3))
    up = np.repeat(np.repeat(bl, k, 0), k, 1)
    res = y[:h, :w] - up
    gb = np.abs(np.diff(bl, axis=0))[:, :-1] + np.abs(np.diff(bl, axis=1))[:-1, :]
    liso = np.repeat(np.repeat(gb < 0.01, k, 0), k, 1)
    liso = liso[:res.shape[0] - k, :res.shape[1] - k]
    r = res[:liso.shape[0], :liso.shape[1]][liso]
    # nitidez relativa: energia de borda na escala fina / na escala 2x. Imagem nativa nítida fica
    # perto de 1; ampliada (prévia a 50% subida pra 1080p) ou desfocada cai pra ~0,3-0,5.
    h2, w2 = (y.shape[0] // 2) * 2, (y.shape[1] // 2) * 2
    y2 = y[:h2, :w2].reshape(h2 // 2, 2, w2 // 2, 2).mean(axis=(1, 3))
    lap2 = np.abs(4 * y2[1:-1, 1:-1] - y2[:-2, 1:-1] - y2[2:, 1:-1] - y2[1:-1, :-2] - y2[1:-1, 2:])
    rel = float(np.percentile(lap, 99.5) / (np.percentile(lap2, 99.5) + 1e-6))
    return {'nitidez': rel, 'ruido': float(r.std()) if r.size > 1000 else 0.0,
            'largura': int(a.shape[1])}


def vereditos(m, intencao=None):
    """intencao: None, 'escuro' (low key de propósito) ou 'claro' (high key de propósito)."""
    L = LIMITES
    v = []
    if m['estourado'] > L['estourado'] and intencao != 'claro':
        v.append(f"ESTOURADO: {m['estourado']:.1%} no branco puro (baixe a chave, a emissão ou a exposição)")
    if m['afundado'] > L['afundado'] and intencao != 'escuro':
        v.append(f"AFUNDADO: {m['afundado']:.1%} no preto puro (suba preenchimento/ambiente ou use look de menos contraste)")
    lim = 0.08 if intencao == 'claro' else L['lavado_contraste']  # high-key: fundo claro uniforme derruba o desvio global
    if m['contraste'] < lim and m['p2'] > L['lavado_piso']:
        v.append(f"LAVADO: contraste {m['contraste']:.3f} com piso {m['p2']:.2f} (falta sombra: tire luz de preenchimento, escureça o fundo, look de mais contraste)")
    if intencao == 'escuro' and m['p98'] < 0.6:
        v.append(f"ESCURO DEMAIS ATÉ PRA LOW KEY: o ponto mais claro é {m['p98']:.2f} (o herói precisa de um brilho que chegue perto de 0,8-0,95)")
    if m['media'] < L['escuro_media'] and intencao != 'escuro':
        v.append(f"ESCURO: média {m['media']:.2f} (suba exposição em +0,5 a +1 ou a chave)")
    if m['colorido'] < L['sem_cor']:
        v.append(f"SEM COR: colorido {m['colorido']:.1f} (falta um acento de cor da paleta ou contraste quente/frio na luz)")
    if m['detalhe'] < L['chapado_detalhe'] and intencao != 'escuro':
        v.append(f"CHAPADO: detalhe {m['detalhe']:.4f} (falta forma: luz de contorno, chanfro, textura)")
    if m.get('nitidez', 1) < L['borrado_nitidez']:
        v.append(f"BORRADO: nitidez {m['nitidez']:.2f} (quadro ampliado, desfoque demais ou motion blur longo: renderize a 100% e feche o diafragma)")
    if m.get('ruido', 0) > L['ruido_max']:
        v.append(f"RUIDOSO: ruído {m['ruido']:.4f} nas áreas lisas (poucas amostras ou grão de pós forte demais)")
    if m.get('largura', 1920) < 1920:
        v.append(f"PRÉVIA: {m['largura']} px de largura. Prévia não aprova nada: aprovação só com quadro a 100%")
    if not v:
        v.append('OK nos números. Agora o olho: herói claro? luz com direção? material crível?')
    return v


def relatorio(m):
    linhas = [f"{m['arquivo']}: média {m['media']:.2f} | p2-p98 {m['p2']:.2f}-{m['p98']:.2f} | contraste {m['contraste']:.3f}"
              f" | estourado {m['estourado']:.1%} | afundado {m['afundado']:.1%} | colorido {m['colorido']:.0f}"
              f" | detalhe {m['detalhe']:.4f} | nitidez {m.get('nitidez', 0):.3f} | ruido {m.get('ruido', 0):.4f}"]
    linhas += ['   - ' + x for x in m['vereditos']]
    return '\n'.join(linhas)


def render_quadros(tempos, pasta, prefixo='q', escala=None, amostras=None, analisar_tambem=True, intencao=None):
    """renderiza os instantes (em segundos) como PNG e devolve as métricas de cada um."""
    sc = bpy.context.scene
    os.makedirs(pasta, exist_ok=True)
    esc0 = sc.render.resolution_percentage
    if escala:
        sc.render.resolution_percentage = escala
    if amostras:
        if sc.render.engine == 'CYCLES':
            sc.cycles.samples = amostras
        else:
            sc.eevee.taa_render_samples = amostras
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGB'
    saidas = []
    for t in tempos:
        sc.frame_set(1 + round(t * sc.render.fps))
        caminho = os.path.abspath(os.path.join(pasta, f'{prefixo}_{t:05.2f}.png'))
        sc.render.filepath = caminho
        bpy.ops.render.render(write_still=True)
        saidas.append(caminho)
    sc.render.resolution_percentage = esc0
    if not analisar_tambem:
        return saidas
    res = [analisar(c, intencao) for c in saidas]
    for m in res:
        print(relatorio(m))
    return res


def fotometro(intencao=None, escala=20, amostras=16, max_iter=5, pasta=None, verbose=True):
    """o fotômetro do estúdio: renderiza um quadro pequeno, mede e ajusta a exposição até o ponto
    mais claro (p98) ficar entre 0,85 e 0,96 e o estourado abaixo de 1,5%. Low key ('escuro') mira o
    herói em 0,8-0,95 e aceita preto. Mexe só em `view_settings.exposure` (máx. ±2 EV).
    Use depois de montar luz e câmera, antes do lookdev. Devolve a exposição final."""
    import tempfile
    sc = bpy.context.scene
    pasta = pasta or tempfile.mkdtemp(prefix='fotometro_')
    exp0 = sc.view_settings.exposure
    for i in range(max_iter):
        m = render_quadros([tempo_atual()], pasta, prefixo=f'fot{i}', escala=escala, amostras=amostras,
                           analisar_tambem=False)
        a = analisar(m[0], intencao)
        e = sc.view_settings.exposure
        passo = 0.0
        if a['estourado'] > 0.015:
            passo = -0.5 if a['estourado'] < 0.08 else -1.0
        elif a['p98'] < 0.85:
            passo = 0.5 if a['p98'] > 0.6 else 1.0
        elif a['p98'] > 0.965:
            passo = -0.25
        if verbose:
            print(f'[fotômetro] exp {e:+.2f}: p98 {a["p98"]:.2f}, estourado {a["estourado"]:.1%} -> passo {passo:+.2f}')
        if passo == 0.0:
            break
        sc.view_settings.exposure = max(exp0 - 2, min(exp0 + 2, e + passo))
    return sc.view_settings.exposure


def tempo_atual():
    sc = bpy.context.scene
    return (sc.frame_current - 1) / sc.render.fps


def folha(pngs, saida, colunas=4, margem=8, fundo=0.08):
    """folha de contato: junta os quadros numa grade (para olhar a sequência de uma vez)."""
    ims = [_pixels(p) for p in pngs]
    h = max(i.shape[0] for i in ims)
    w = max(i.shape[1] for i in ims)
    linhas = math.ceil(len(ims) / colunas)
    H = linhas * h + (linhas + 1) * margem
    Wt = colunas * w + (colunas + 1) * margem
    tela = np.full((H, Wt, 3), fundo, dtype=np.float32)
    for k, im in enumerate(ims):
        li, co = divmod(k, colunas)
        y0 = margem + li * (h + margem)
        x0 = margem + co * (w + margem)
        tela[y0:y0 + im.shape[0], x0:x0 + im.shape[1]] = im
    img = bpy.data.images.new('folha', Wt, H, alpha=False)
    img.colorspace_settings.name = 'Non-Color'
    rgba = np.concatenate([tela[::-1], np.ones((H, Wt, 1), dtype=np.float32)], axis=2)
    img.pixels[:] = rgba.ravel()
    img.filepath_raw = os.path.abspath(saida)
    img.file_format = 'PNG'
    img.save()
    bpy.data.images.remove(img)
    return saida


def salvar_json(metricas, caminho):
    with open(caminho, 'w', encoding='utf-8') as f:
        json.dump(metricas, f, indent=1, ensure_ascii=False)
