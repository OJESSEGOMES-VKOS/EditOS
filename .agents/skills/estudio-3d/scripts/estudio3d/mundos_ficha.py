"""Construtor genérico de mundo a partir das fichas de `mundos.json` (os 19 mundos do capítulo 02
da base do Cowork). Os 7 mundos calibrados à mão em `mundos.py` têm prioridade; este módulo monta
os outros direto da ficha: cor, fundo, luzes (azimute, elevação, tamanho, energia relativa,
temperatura, grade), névoa, gobo e o material do apoio.

Convenção da ficha: azimute 0 = câmera, +90 = direita, 180 = atrás do herói.
Energia: a principal vale 6,3 W a 0,60 m (padrão da casa, cap 05 §4.1), escalada pelo inverso do
quadrado da distância; as demais seguem `energia_rel`. Sol: Strength 3 × energia_rel.
"""
import json
import math
import os
import re

import bpy
from mathutils import Vector

from . import aviso
from . import luz as L
from . import materiais as M
from .geo import ciclorama
from .nucleo import cor as aplicar_cor, hex_emissao, hex_lin, ligar

ARQ = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mundos.json')
W_PRINCIPAL = 6.3     # W a 0,60 m
D_REF = 0.60
SOL_BASE = 4.0  # ficha: sol entre 2 e 4; 3 lavou o diorama (calibrado no laboratório)


def carregar():
    with open(ARQ, encoding='utf-8') as f:
        return {m['id']: m for m in json.load(f)}


def _num(txt, padrao):
    m = re.search(r'(\d+(?:[.,]\d+)?)', txt or '')
    return float(m.group(1).replace(',', '.')) if m else padrao


def _dims(tipo):
    m = re.search(r'(\d+(?:[.,]\d+)?)\s*x\s*(\d+(?:[.,]\d+)?)', tipo)
    if not m:
        return None
    return float(m.group(1).replace(',', '.')), float(m.group(2).replace(',', '.'))


def _cor(tipo):
    m = re.search(r'#([0-9A-Fa-f]{6})', tipo)
    if m:
        return '#' + m.group(1)
    m = re.search(r'\((\d[.,]?\d*)\s*,\s*(\d[.,]?\d*)\s*,\s*(\d[.,]?\d*)\)', tipo)
    if m:
        r, g, b = (min(1.0, float(x.replace(',', '.'))) for x in m.groups())
        return '#%02X%02X%02X' % (round(r * 255), round(g * 255), round(b * 255))
    return None


def _forca_world(tipo, padrao=0.2):
    m = re.search(r'for[çc]a\s*(\d+(?:[.,]\d+)?)', tipo)
    return float(m.group(1).replace(',', '.')) if m else padrao


def _luminancia(hexcor):
    r, g, b = hex_lin(hexcor, seguro=False)[:3]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def _sol(nome, az, el, forca, kelvin, angulo):
    sd = bpy.data.lights.new(nome, 'SUN')
    sd.energy = forca
    sd.angle = math.radians(angulo)
    if kelvin:
        sd.use_temperature = True
        sd.temperature = kelvin
    o = ligar(bpy.data.objects.new(nome, sd))
    # a luz do sol vem DE (az, el): o objeto aponta pro alvo, ou seja, -Z na direção oposta
    d = -Vector(L.ponto_esferico((0, 0, 0), 1.0, az, el))
    o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    return o


def _spot(nome, loc, alvo, energia, angulo, kelvin, cor=None, borda=0.3):
    sd = bpy.data.lights.new(nome, 'SPOT')
    sd.energy = energia
    sd.spot_size = math.radians(angulo)
    sd.spot_blend = borda
    sd.shadow_soft_size = 0.05
    if cor:
        sd.color = hex_emissao(cor)[:3]
    elif kelvin:
        sd.use_temperature = True
        sd.temperature = kelvin
    o = ligar(bpy.data.objects.new(nome, sd))
    o.location = loc
    L.mira(o, alvo)
    return o


def janela_gobo(alvo, sol, escala=1.0, largura=0.12, altura=0.2, distancia=0.5):
    """parede com abertura retangular entre o sol e o produto: desenha um retângulo de luz."""
    bpy.context.view_layer.update()
    d_sol = (sol.matrix_world.to_quaternion() @ Vector((0, 0, 1))).normalized()
    centro = Vector(alvo) + d_sol * distancia * escala
    w, h = 1.2 * escala, 1.2 * escala
    a, b = largura * escala / 2, altura * escala / 2
    pecas = [(-w, -h, -a, h), (a, -h, w, h), (-a, b, a, h), (-a, -h, a, -b)]
    objs = []
    for i, (x0, y0, x1, y1) in enumerate(pecas):
        me = bpy.data.meshes.new('parede')
        me.from_pydata([(x0, 0, y0), (x1, 0, y0), (x1, 0, y1), (x0, 0, y1)], [], [(0, 1, 2, 3)])
        o = ligar(bpy.data.objects.new(f'parede_{i}', me))
        o.location = centro
        o.rotation_euler = d_sol.to_track_quat('-Y', 'Z').to_euler()
        o.visible_camera = False
        o.visible_glossy = False
        objs.append(o)
    return objs


def material_da_ficha(m):
    """Principled a partir da linha de material da ficha, com imperfeição."""
    mat = bpy.data.materials.new(m['nome'])
    mat.use_nodes = True
    nt = mat.node_tree
    b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = hex_lin(m['base_color'])
    b.inputs['Metallic'].default_value = m.get('metallic', 0.0)
    b.inputs['Coat Weight'].default_value = m.get('coat_weight', 0.0)
    b.inputs['Transmission Weight'].default_value = m.get('transmission_weight', 0.0)
    b.inputs['IOR'].default_value = m.get('ior', 1.5)
    outros = (m.get('outros') or '').lower()
    if 'sheen' in outros:
        b.inputs['Sheen Weight'].default_value = 0.8
    if 'subsurface' in outros or 'sss' in outros:
        b.inputs['Subsurface Weight'].default_value = 0.2
    M.imperfeicao(nt, b, max(0.02, m.get('roughness', 0.5)), 0.25, 14)
    return mat


def aplicar_ficha(ficha, alvo=(0, 0, 0), escala=1.0):
    """monta o mundo descrito pela ficha. Devolve um dict no formato de `mundos.aplicar`."""
    c = ficha['cor']
    look = c.get('look') or 'None'
    look = 'None' if look in ('None', 'AgX - Base Contrast') else look
    try:
        aplicar_cor(look=look, exposicao=c.get('exposicao', 0.0))
    except Exception as e:  # noqa: BLE001
        aviso(f'look {look}: {e}')
    sc = bpy.context.scene
    sc.view_settings.view_transform = c.get('view_transform', 'AgX')

    pal = ficha['paleta']
    fundo_hex = pal['fundo']
    escuro = _luminancia(fundo_hex) < 0.05  # petróleo e marinho contam como low key
    criados = {'luzes': {}, 'bandeiras': [], 'cartoes': [], 'gobo': []}

    # céu: cor do World pela ficha (linha "World ... força x") ou pelo fundo
    ceu = [l for l in ficha['luz'] if l['tipo'].lower().startswith('world')]
    if ceu:
        cores = re.findall(r'#[0-9A-Fa-f]{6}', ceu[0]['tipo'])
        fw = _forca_world(ceu[0]['tipo'], 0.2)
        if len(cores) >= 2:  # gradiente de céu (ex.: retrofuturo): o céu é luz principal e cenário
            topo, base = cores[0], cores[-1]
            meio = cores[1] if len(cores) >= 3 else None
            L.mundo_gradiente(topo, base, forca=1.0, luz_ambiente=min(1.0, max(fw, ceu[0].get('energia_rel', 0.3))), meio=meio)
        else:
            L.mundo_gradiente(cores[0] if cores else fundo_hex, fundo_hex, forca=1.0, luz_ambiente=min(0.3, fw * 0.5))
    else:
        L.mundo_gradiente(fundo_hex, fundo_hex, forca=0.7 if not escuro else 1.0, luz_ambiente=0.2)

    # fundo: escuro vira piso espelhado; claro vira ciclorama afastado
    mat_fundo = M.piso_espelhado(fundo_hex, 0.25) if escuro else M.fundo(fundo_hex, 0.6)
    ceu_e_cenario = bool(ceu) and len(re.findall(r'#[0-9A-Fa-f]{6}', ceu[0]['tipo'])) >= 2
    if ceu_e_cenario:  # só o piso: o horizonte do céu fica visível atrás do herói
        criados['fundo'] = ciclorama(largura=40 * escala, profundidade=20 * escala, altura=0.002,
                                     raio=0.001, mat=M.piso_espelhado(fundo_hex, 0.2))
        criados['fundo'].location.y = alvo[1] + 20 * escala
    else:
        criados['fundo'] = ciclorama(largura=10 * escala, profundidade=6 * escala, altura=6 * escala,
                                     raio=1.2 * escala, mat=mat_fundo)
        criados['fundo'].location.y = alvo[1] + 1.3 * escala

    d = 1.2 * escala  # distância das luzes ao herói (0,6 m com escala 0,5)
    sol = None
    for i, l in enumerate(ficha['luz']):
        tipo = l['tipo']
        t = tipo.lower()
        nome = re.sub(r'[^a-z0-9]+', '_', l['nome'].lower())[:24] or f'luz{i}'
        az, el = l['azimute_graus'], l['elevacao_graus']
        rel = l.get('energia_rel', 1.0)
        kelvin = l.get('temperatura_k') or 0
        corl = _cor(tipo) if 'cor' in t or '#' in tipo or '(' in tipo else None
        if t.startswith('world'):
            continue
        if 'sun' in t:
            sol = _sol(nome, az, el, SOL_BASE * rel, kelvin, _num(t.split('ngulo')[-1], 1.5) if 'ngulo' in t else 1.5)
            criados['luzes'][nome] = sol
        elif 'planos pretos' in t or 'bandeira' in t:
            for s in (-1, 1):
                ang = abs(az) or 90
                pos = L.ponto_esferico(alvo, 0.55 * d, s * ang, 0)
                criados['bandeiras'].append(L.bandeira(f'bandeira_{s}', pos, alvo, 0.5 * escala, 1.0 * escala))
        elif 'gobo' in t or 'recortados' in t or 'abertura' in t or 'persiana' in t:
            pass  # montado depois do sol
        elif 'volume' in t or 'névoa' in t or 'nevoa' in t:
            dens = _num(t.split('densidade')[-1], 0.3) if 'densidade' in t else 0.3
            criados['nevoa'] = L.nevoa(dens, tamanho=1.6 * escala * 2, centro=(alvo[0], alvo[1] + 0.3 * escala, alvo[2] + 0.4 * escala))
        elif 'spot' in t:
            ang = _num(t.split('spot')[-1], l.get('spread_graus') or 40)
            dist = d * 1.2
            e = W_PRINCIPAL * (dist / D_REF) ** 2 * rel * 2.0
            criados['luzes'][nome] = _spot(nome, L.ponto_esferico(alvo, dist, az, el), alvo, e, ang, kelvin, corl)
        else:  # AREA
            tam = max(0.05, l.get('tamanho_m') or 0.6) * escala  # ficha em m pra produto de ~15 cm (escala 0,5 = metade)
            dims = _dims(tipo)
            dist = max(d, tam * 0.8)
            e = W_PRINCIPAL * (dist / D_REF) ** 2 * rel
            kw = {}
            if dims:
                tam, kw['tamanho_y'] = dims[0] * escala, dims[1] * escala
            if 'disco' in t:
                kw['forma'] = 'DISK'
            spread = l.get('spread_graus') or None
            o = L.area(nome, L.ponto_esferico(alvo, dist, az, el), alvo, e, tam,
                       temperatura=kelvin or 5600, cor=corl if (corl and not kelvin) else None,
                       espalhamento=spread if spread and spread < 180 else None, **kw)
            criados['luzes'][nome] = o
    gobo = [l for l in ficha['luz'] if any(k in l['tipo'].lower() for k in ('gobo', 'recortados', 'abertura', 'persiana'))]
    if gobo and sol is not None:
        if 'abertura' in gobo[0]['tipo'].lower() or 'parede' in gobo[0]['tipo'].lower():
            criados['gobo'] = janela_gobo(alvo, sol, escala)
        else:
            criados['gobo'] = L.persiana(alvo, sol, escala)

    lentes = ficha['camera'].get('lentes_mm') or [85]
    ret = dict(ficha)
    ret.update({
        'nome': ficha['id'],
        'paleta': {'fundo': fundo_hex, 'primaria': pal.get('apoio', fundo_hex), 'secundaria': pal.get('apoio', fundo_hex),
                   'acento': pal.get('acento', '#FFFFFF')},
        'camera': {'lente': lentes[0], 'fstop': max(2.8, ficha['camera'].get('fstop') or 4.0), 'inclinacao': 8, 'distancia': 0.75},
        'curvas': {'entra': 'pousa', 'sai': 'decola', 'camera': 'camera', 'ui': 'firme'},
        'intencao': 'escuro' if escuro else ('claro' if _luminancia(fundo_hex) > 0.35 else None),
        'criados': criados,
        'materiais_ficha': [material_da_ficha(m) for m in ficha.get('materiais', [])],
    })
    return ret
