"""Prepara a montagem de um vídeo do 3d-como-funciona: junta os quadros do Blender, a fala, os nomes técnicos, os sons
e a trilha num props.json que o Remotion desenha.
uso: ../../.venv/Scripts/python.exe montar.py <pasta-do-video> [--sem-filme]
lê    <pasta>/palavras.json, eventos.json, voz.wav, trilha.mp3, quadros/q*.png
grava <pasta>/public/ (filme.mp4, voz.wav, trilha.mp3, sons/) e <pasta>/props.json
"""
import json
import re
import shutil
import subprocess
import sys
import unicodedata
from pathlib import Path

pasta = Path(sys.argv[1]).resolve()
MOLDE = Path(__file__).resolve().parents[1]
RAIZ = MOLDE.parents[1]
FF = RAIZ / 'node_modules' / '@remotion' / 'compositor-win32-x64-msvc' / 'ffmpeg.exe'
pub = pasta / 'public'
pub.mkdir(exist_ok=True)
norm = lambda s: re.sub(r'[^\w]', '', unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower())

pal = json.loads((pasta / 'palavras.json').read_text(encoding='utf-8'))
duracao = pal[-1]['e'] + 1.4

# ---------------------------------------------------------------- nomes técnicos
# "Esse é o X." / "Esses são os X." / "Essa é a X." / "Esse tubo é o X.": o nome vai do artigo até o ponto final;
# o rótulo amarelo fica do nome até o próximo "Mas" (ou "Parabéns")
termos = []
n = [norm(p['w']) for p in pal]
for i in range(len(pal) - 3):
    if n[i] not in ('esse', 'esses', 'essa', 'essas'):
        continue
    j = i + 1
    if n[j] not in ('e', 'sao'):  # "Esse tubo é o"
        j += 1
    if j >= len(pal) or n[j] not in ('e', 'sao') or n[j + 1] not in ('o', 'os', 'a', 'as'):
        continue
    k0 = j + 2
    k1 = k0
    while k1 < len(pal) and not re.search(r'[.!?]$', pal[k1]['w']):
        k1 += 1
    # o rótulo sai quando começa o próximo elo: frase que abre com "Mas", "E", "Então" ou "Parabéns", ou o fecho
    # "Agora você tem" (regra de 2026-10-27; "Agora" solto no meio de um elo não conta)
    inicio_frase = lambda m: m > 0 and re.search(r'[.!?]$', pal[m - 1]['w'])
    fecho = lambda m: n[m:m + 3] == ['agora', 'voce', 'tem']
    fim = next((pal[m]['s'] for m in range(k1 + 1, len(pal)) if inicio_frase(m) and (n[m] in ('mas', 'e', 'entao', 'parabens') or fecho(m))), duracao)
    texto = ' '.join(re.sub(r'[.!?,]$', '', pal[m]['w']) for m in range(k0, k1 + 1))
    de = pal[i]['s']  # entra no "Esse é", fica no mínimo o tempo de ler (1 s + 3 palavras/s, nunca menos de 2 s)
    leitura = max(2.0, 1.0 + (k1 - k0 + 1) / 3)
    termos.append({'texto': texto.upper(), 'de': de, 'ate': max(fim, de + leitura), 'indices': list(range(k0, k1 + 1)),
                   'com_nome': j == i + 2, 'fim_elo': fim})
# "Esse chiado é a panela respirando. Essa é a válvula de pressão." (panela de pressão, 2026-10-23): a forma com
# substantivo ("Esse tubo é o X") só vale se nenhum "Esse/Essa é" direto vier antes da próxima virada de elo
termos = [a for a in termos if not (a['com_nome'] and any(not b['com_nome'] and a['de'] < b['de'] < a['fim_elo'] for b in termos))]
for t in termos:
    del t['com_nome'], t['fim_elo']
for a, b in zip(termos, termos[1:]):  # nunca dois rótulos ao mesmo tempo
    a['ate'] = min(a['ate'], b['de'] - 0.05)
# oficina/<pasta>/termos.json (opcional, 2026-11-12, helicóptero v3): a fala nomeia peças sem "Esse é o" ("uma alavanca,
# o coletivo"); a lista dada substitui a detecção. Cada item: {"texto", "de", "ate", "indices"}. Sem o arquivo, nada muda.
if (pasta / 'termos.json').exists():
    termos = json.loads((pasta / 'termos.json').read_text(encoding='utf-8'))
marcadas = {m for tm in termos for m in tm['indices']}

# ---------------------------------------------------------------- uma palavra por vez
palavras = []
for i, p in enumerate(pal):
    prox = pal[i + 1]['s'] if i + 1 < len(pal) else p['e'] + 0.6
    ate = min(prox, p['e'] + 0.55) if prox - p['e'] > 0.55 else prox  # em pausa longa a palavra sai
    palavras.append({'w': re.sub(r'[,;:]$', '', p['w']), 'de': round(p['s'], 3), 'ate': round(max(ate, p['s'] + 0.12), 3), 'termo': i in marcadas})

# ---------------------------------------------------------------- sons
VOL = {'pop': 0.55, 'brilho': 0.55, 'eco': 0.5, 'sonar': 0.6, 'forca': 0.6, 'esforco': 0.45, 'estalo': 0.7, 'baque': 0.75,
       'trava': 0.6, 'mola': 0.6, 'splash': 0.7, 'bolhas': 0.55, 'amassa': 0.75, 'parabens': 0.6, 'chiado': 0.5, 'whoosh': 0.35}
sons = []
eventos = json.loads((pasta / 'eventos.json').read_text(encoding='utf-8')) if (pasta / 'eventos.json').exists() else []
# só toca som de evento físico anotado pela cena (correção do dono, 2026-10-21: o sopro automático em todo "Então"
# era um swish alto e sem motivo na tela). Palavra do roteiro nunca dispara som sozinha.
for e in eventos:
    if e['tipo'] in VOL:
        sons.append({'arquivo': f"sons/{e['tipo']}.{'mp3' if e['tipo'] == 'whoosh' else 'wav'}", 'em': e['t'], 'volume': VOL[e['tipo']]})
sons.sort(key=lambda s: s['em'])
if (pub / 'sons').exists():
    shutil.rmtree(pub / 'sons')
shutil.copytree(MOLDE / 'public' / 'sons', pub / 'sons')

# ---------------------------------------------------------------- mídia
shutil.copy2(pasta / 'voz.wav', pub / 'voz.wav')
shutil.copy2(pasta / 'trilha.mp3', pub / 'trilha.mp3')
if '--sem-filme' not in sys.argv:
    quadros = sorted((pasta / 'quadros').glob('q*.png'))
    print(f'{len(quadros)} quadros -> filme.mp4')
    subprocess.run([str(FF), '-hide_banner', '-loglevel', 'error', '-y', '-framerate', '30', '-start_number', quadros[0].stem[1:].lstrip('0') or '0',
                    '-i', str(pasta / 'quadros' / 'q%04d.png'), '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p',
                    str(pub / 'filme.mp4')], check=True)

props = {'duracao': round(duracao, 3), 'fps': 30, 'palavras': palavras, 'termos': [{k: v for k, v in t.items() if k != 'indices'} for t in termos],
         'sons': sons, 'trilha': {'arquivo': 'trilha.mp3', 'volume': 0.16}, 'voz': 'voz.wav', 'filme': 'filme.mp4'}
# ---------------------------------------------------------------- estilo da legenda (FASE 2, 2026-10-24)
# oficina/<pasta>/legenda.txt com 'desembaca', 'tabuleiro' ou 'letreiro' troca o estilo; sem o arquivo (ou 'padrao') o
# props.json sai igual ao de antes, sem campo novo: os vídeos aprovados não mudam
estilo = (pasta / 'legenda.txt').read_text(encoding='utf-8').strip() if (pasta / 'legenda.txt').exists() else 'padrao'
assert estilo in ('padrao', 'desembaca', 'tabuleiro', 'letreiro'), f'legenda.txt: estilo desconhecido {estilo!r}'
if estilo != 'padrao':
    props['legenda'] = estilo
if estilo == 'tabuleiro':
    # frases: quebra na pontuação. Frase longa vira blocos de até 4 palavras, cortados onde a fala pausa e nunca
    # depois de palavra que pede a seguinte (artigo, preposição, conjunção): "uma tábua | de uma margem", não "tábua de uma |"
    FRACA = {'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas', 'de', 'da', 'do', 'das', 'dos', 'em', 'no', 'na', 'nos', 'nas',
             'para', 'pra', 'por', 'pelo', 'pela', 'com', 'e', 'que', 'ate', 'ao', 'aos', 'se', 'sem', 'mais', 'muito', 'seu',
             'sua', 'esse', 'essa', 'esses', 'essas', 'este', 'esta', 'num', 'numa', 'cada', 'entre', 'sobre', 'quando', 'como'}
    frases, atual = [], []
    for i, p in enumerate(pal):
        if atual and re.search(r'[.!?;:,]$', pal[i - 1]['w']):
            frases.append(atual)
            atual = []
        atual.append(i)
    frases.append(atual)
    CUSTO = {1: 3.0, 2: 0.8, 3: 0.0, 4: 0.4}
    blocos = []
    for fr in frases:
        melhor = {0: (0.0, [])}  # melhor[j]: custo e cortes das primeiras j palavras da frase
        for j in range(1, len(fr) + 1):
            opcoes = []
            for s in range(1, min(4, j) + 1):
                c, cortes = melhor[j - s]
                ult = fr[j - 1]
                c += CUSTO[s]
                if j < len(fr):
                    c += 5.0 if n[ult] in FRACA else 0.0
                    c -= 1.0 if pal[ult + 1]['s'] - pal[ult]['e'] >= 0.2 else 0.0
                opcoes.append((c, cortes + [s]))
            melhor[j] = min(opcoes, key=lambda x: x[0])
        o = 0
        for s in melhor[len(fr)][1]:
            blocos.append({'i0': fr[o], 'i1': fr[o + s - 1]})
            o += s
    for b in blocos:
        b['de'] = palavras[b['i0']]['de']
        b['ate'] = palavras[b['i1']]['ate']
    props['blocos'] = blocos
(pasta / 'props.json').write_text(json.dumps(props, ensure_ascii=False, indent=1), encoding='utf-8')
print(f'{pasta.name}: {len(palavras)} palavras, {len(termos)} nomes ({", ".join(t["texto"] for t in termos)}), {len(sons)} sons, {duracao:.1f} s')
