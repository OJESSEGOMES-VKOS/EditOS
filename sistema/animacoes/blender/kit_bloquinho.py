"""Kit do 3D de bloquinho: cenas "low poly toon" (tudo feito de blocos, cor lisa, sombra em degraus e contorno escuro)
montadas por código no Blender 5.x, com EEVEE e 30 quadros por segundo.

Tudo é feito por código: nenhum modelo 3D de fora, nenhuma imagem baixada.

Uso (num script que o Blender roda):
    import sys, pathlib
    sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
    import kit_bloquinho as K

    sc = K.nova_cena(segundos=10)                # vertical 1080x1920, 30 qps, céu e sol
    K.chao(sc, 'grama')
    caixa = K.bloco('caixa', (1, 1, 1), (0, 0, 0.5), K.COR['madeira'])
    K.contorno([caixa])
    K.chaves(caixa, 'location', [(0, (0, 0, 0.5)), (2, (2, 0, 0.5))])   # anda 2 m em 2 segundos
    K.camera(sc, (0, -14, 6), alvo=(0, 0, 2))
    K.renderizar(sc, 'fundo3d', pasta=...)      # grava <pasta>/fundo3d.mp4 (ou um quadro de teste)

Tempo sempre em SEGUNDOS (a conta de quadro é do kit). Medidas em metros.
"""
import math
import os
import sys
from pathlib import Path

import bpy
import bmesh
from mathutils import Vector

FPS = 30
RAIZ = Path(__file__).resolve().parent.parent          # sistema/animacoes (o motor de animações do EditOS)
PRONTOS = RAIZ / 'estilos' / 'exemplos'               # só o exemplo do estilo vai pra cá; vídeo de verdade usa `pasta`
TMP = RAIZ.parent / '.tmp'                             # o .tmp do estúdio (sistema/.tmp)

# ---------------------------------------------------------------- as cores (cor lisa e forte)
COR = {
    'grama': '#5DB848', 'grama2': '#4CA03E', 'terra': '#B9773E', 'terra2': '#9A5F30', 'areia': '#EBC983',
    'agua': '#2F8FE0', 'agua2': '#57B2F0', 'pedra': '#8C8A96', 'madeira': '#A8683A', 'madeira2': '#7A4A2A',
    'folha': '#3E9E3A', 'folha2': '#6CC24A', 'flor': '#FF6FA8', 'miolo': '#FFD23F',
    'sol': '#FFC93D', 'sol2': '#FF9E2C', 'nuvem': '#F4F7FB', 'nuvem_chuva': '#8C97A8', 'gota': '#3D9BFF',
    'pele': '#F0B48A', 'camisa': '#E5533C', 'calca': '#3A4E8C', 'cabelo': '#3A2416', 'sapato': '#2A2A2E',
    'olho': '#1A1A1A', 'branco': '#FFFFFF', 'texto': '#1B2A4A', 'contorno': '#1A1220',
}

# o clima muda a sombra, a névoa da distância, o céu e o sol
CLIMAS = {
    'dia': {'degraus': ((0.46, 0.50, 0.72), (0.80, 0.82, 0.92), (1.06, 1.03, 0.97)), 'nevoa': (30.0, 120.0, 0.5),
            'cor_nevoa': '#BFE3FF', 'amb': ('#9DB8E8', 0.40), 'sol': ((1.0, 0.96, 0.88), 3.2, (55, 0, -35)),
            'ceu': ['#CFEFFF', '#A9DDFB', '#86CBF5', '#63B6EE', '#4B9FE3']},
    'tarde': {'degraus': ((0.30, 0.24, 0.42), (0.70, 0.60, 0.66), (1.12, 0.96, 0.80)), 'nevoa': (20.0, 75.0, 0.6),
              'cor_nevoa': '#E89A6A', 'amb': ('#8C7AB0', 0.35), 'sol': ((1.0, 0.86, 0.68), 3.3, (58, 0, -145)),
              'ceu': ['#FFB15C', '#F58A5A', '#D9667A', '#8E5A9E', '#5A4A8E']},
    'noite': {'degraus': ((0.26, 0.26, 0.50), (0.68, 0.64, 0.80), (1.10, 0.97, 0.84)), 'nevoa': (400.0, 900.0, 0.0),
              'cor_nevoa': '#26346E', 'amb': ('#5A6AA8', 0.30), 'sol': ((1.0, 0.88, 0.72), 3.4, (44, 0, -30)),
              'ceu': ['#1E2A5A', '#26346E', '#2E3F80', '#384A90', '#42559E']},
}
ESTILO = {'clima': 'dia', 'contorno': 0.03}
_MATS = {}


def q(t):
    """o quadro do segundo t (o quadro 1 é o segundo 0)."""
    return round(t * FPS) + 1


def _lin(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1.0,)


# ---------------------------------------------------------------- materiais
def mat(cor, unico=False):
    """a cor toon: a luz vira 3 degraus (sombra, meio-tom, luz) vezes a cor, e some na névoa ao longe.
    `unico=True` cria um material só desta peça, pra mudar a cor com o tempo (`cor_em`)."""
    if cor in _MATS and not unico:
        return _MATS[cor]
    cl = CLIMAS[ESTILO['clima']]
    m = bpy.data.materials.new(f'cor_{cor.strip("#")}')
    m.diffuse_color = _lin(cor)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    dif = nt.nodes.new('ShaderNodeBsdfDiffuse')
    dif.inputs['Color'].default_value = (1, 1, 1, 1)
    s2r = nt.nodes.new('ShaderNodeShaderToRGB')
    bw = nt.nodes.new('ShaderNodeRGBToBW')
    rampa = nt.nodes.new('ShaderNodeValToRGB')
    cr = rampa.color_ramp
    cr.interpolation = 'CONSTANT'
    d0, d1, d2 = cl['degraus']
    cr.elements[0].position = 0.0
    cr.elements[0].color = (*d0, 1)
    cr.elements[1].position = 0.18
    cr.elements[1].color = (*d1, 1)
    cr.elements.new(0.55).color = (*d2, 1)
    mul = nt.nodes.new('ShaderNodeMix')
    mul.data_type = 'RGBA'
    mul.blend_type = 'MULTIPLY'
    mul.inputs['Factor'].default_value = 1.0
    mul.inputs['B'].default_value = _lin(cor)
    mul.name = 'cor'
    camd = nt.nodes.new('ShaderNodeCameraData')
    mr = nt.nodes.new('ShaderNodeMapRange')
    n0, n1, nmax = cl['nevoa']
    mr.inputs['From Min'].default_value = n0
    mr.inputs['From Max'].default_value = n1
    mr.inputs['To Min'].default_value = 0.0
    mr.inputs['To Max'].default_value = nmax
    nev = nt.nodes.new('ShaderNodeMix')
    nev.data_type = 'RGBA'
    nev.inputs['B'].default_value = _lin(cl['cor_nevoa'])
    em = nt.nodes.new('ShaderNodeEmission')
    L = nt.links.new
    L(dif.outputs[0], s2r.inputs[0])
    L(s2r.outputs['Color'], bw.inputs[0])
    L(bw.outputs[0], rampa.inputs['Fac'])
    L(rampa.outputs['Color'], mul.inputs['A'])
    L(camd.outputs['View Z Depth'], mr.inputs['Value'])
    L(mr.outputs['Result'], nev.inputs['Factor'])
    L(mul.outputs['Result'], nev.inputs['A'])
    L(nev.outputs['Result'], em.inputs['Color'])
    L(em.outputs[0], out.inputs['Surface'])
    if not unico:
        _MATS[cor] = m
    return m


def cor_em(m, pontos):
    """muda a cor de um material `mat(..., unico=True)` com o tempo: pontos = [(segundo, '#cor'), ...]."""
    sock = m.node_tree.nodes['cor'].inputs['B']
    for t, c in pontos:
        sock.default_value = _lin(c)
        sock.keyframe_insert('default_value', frame=q(t))


def mat_luz(cor, forca=1.0):
    """cor que brilha sozinha e não tem sombra (sol, fogo, tela acesa, texto)."""
    chave = f'luz{cor}{forca}'
    if chave in _MATS:
        return _MATS[chave]
    m = bpy.data.materials.new(f'luz_{cor.strip("#")}')
    m.diffuse_color = _lin(cor)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    em = nt.nodes.new('ShaderNodeEmission')
    em.inputs['Color'].default_value = _lin(cor)
    em.inputs['Strength'].default_value = forca
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    nt.links.new(em.outputs[0], out.inputs['Surface'])
    _MATS[chave] = m
    return m


def _mat_contorno():
    if 'contorno' in _MATS:
        return _MATS['contorno']
    m = bpy.data.materials.new('contorno')
    m.diffuse_color = _lin(COR['contorno'])
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    em = nt.nodes.new('ShaderNodeEmission')
    em.inputs['Color'].default_value = _lin(COR['contorno'])
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    nt.links.new(em.outputs[0], out.inputs['Surface'])
    m.use_backface_culling = True
    if hasattr(m, 'use_backface_culling_shadow'):
        m.use_backface_culling_shadow = True       # o contorno não faz sombra
    _MATS['contorno'] = m
    return m


def contorno(objs, esp=None):
    """o contorno escuro em volta das peças (uma casca virada pra dentro). `esp` em metros."""
    esp = esp or ESTILO['contorno']
    mc = _mat_contorno()
    for o in objs:
        if o.type != 'MESH' or o.modifiers.get('contorno'):
            continue
        if mc.name not in [m.name for m in o.data.materials if m]:
            o.data.materials.append(mc)
        md = o.modifiers.new('contorno', 'SOLIDIFY')
        md.thickness = esp / max(1e-6, max(o.matrix_world.to_scale()))
        md.offset = 1.0
        md.use_flip_normals = True
        md.use_rim = False
        md.material_offset = 99              # cai no último material, o do contorno


def chapado(me):
    """faces chapadas: cada face uma cor só (a cara low poly)."""
    me.polygons.foreach_set('use_smooth', [False] * len(me.polygons))


# ---------------------------------------------------------------- a cena: tamanho, céu e sol
def nova_cena(segundos, formato='vertical', clima='dia'):
    """limpa tudo e prepara: 1080x1920 (vertical) ou 1920x1080 (horizontal), 30 qps, EEVEE toon, céu em faixas e sol."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    _MATS.clear()
    ESTILO['clima'] = clima
    sc = bpy.context.scene
    sc.render.fps = FPS
    sc.frame_start = 1
    sc.frame_end = q(segundos) - 1
    sc.render.resolution_x, sc.render.resolution_y = (1080, 1920) if formato == 'vertical' else (1920, 1080)
    sc.render.resolution_percentage = 100
    sc.render.engine = 'BLENDER_EEVEE'
    sc.render.use_motion_blur = False
    sc.view_settings.view_transform = 'Standard'
    sc.view_settings.look = 'None'
    ee = sc.eevee
    for k, v in (('taa_render_samples', 8), ('use_raytracing', False), ('use_shadows', True), ('shadow_ray_count', 1),
                 ('shadow_step_count', 1), ('use_gtao', False), ('use_bloom', False), ('use_ssr', False)):
        try:
            setattr(ee, k, v)
        except (AttributeError, TypeError):
            pass
    TMP.mkdir(exist_ok=True)
    try:
        bpy.context.preferences.filepaths.temporary_directory = str(TMP)
    except Exception:
        pass
    if sc.world is None:
        sc.world = bpy.data.worlds.new('mundo')
    _ceu_e_sol(sc)
    return sc


def _ceu_e_sol(sc):
    cl = CLIMAS[ESTILO['clima']]
    w = sc.world
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes.clear()
    co = nt.nodes.new('ShaderNodeTexCoord')
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    rampa = nt.nodes.new('ShaderNodeValToRGB')
    cr = rampa.color_ramp
    cr.interpolation = 'CONSTANT'
    cores = cl['ceu']
    cr.elements[0].position = 0.0
    cr.elements[0].color = _lin(cores[0])
    cr.elements[1].position = 0.55
    cr.elements[1].color = _lin(cores[1])
    for k, c in enumerate(cores[2:]):
        cr.elements.new(0.68 + 0.11 * k).color = _lin(c)
    bg_ceu = nt.nodes.new('ShaderNodeBackground')
    bg_luz = nt.nodes.new('ShaderNodeBackground')
    amb, amb_f = cl['amb']
    bg_luz.inputs['Color'].default_value = _lin(amb)
    bg_luz.inputs['Strength'].default_value = amb_f
    lp = nt.nodes.new('ShaderNodeLightPath')
    mix = nt.nodes.new('ShaderNodeMixShader')
    out = nt.nodes.new('ShaderNodeOutputWorld')
    L = nt.links.new
    L(co.outputs['Window'], sep.inputs[0])
    L(sep.outputs['Y'], rampa.inputs['Fac'])
    L(rampa.outputs['Color'], bg_ceu.inputs['Color'])
    L(lp.outputs['Is Camera Ray'], mix.inputs['Fac'])
    L(bg_luz.outputs[0], mix.inputs[1])
    L(bg_ceu.outputs[0], mix.inputs[2])
    L(mix.outputs[0], out.inputs['Surface'])
    cor_sol, forca, (rx, ry, rz) = cl['sol']
    ld = bpy.data.lights.new('luz_sol', 'SUN')
    ld.energy = forca
    ld.angle = 0.0                      # sombra dura
    ld.color = cor_sol
    o = bpy.data.objects.new('luz_sol', ld)
    sc.collection.objects.link(o)
    o.rotation_euler = (math.radians(rx), math.radians(ry), math.radians(rz))


# ---------------------------------------------------------------- as formas
def _objeto(nome, bm, cor, loc, pai, brilha=False):
    me = bpy.data.meshes.new(nome)
    bm.to_mesh(me)
    bm.free()
    chapado(me)
    me.materials.append(mat_luz(cor) if brilha else mat(cor))
    o = bpy.data.objects.new(nome, me)
    bpy.context.scene.collection.objects.link(o)
    if pai is not None:
        o.parent = pai
    o.location = loc
    return o


def _ancora(bm, altura, ancora):
    """muda o ponto de giro: 'centro', 'base' (cresce do chão) ou 'topo' (pendura, ex.: perna no quadril)."""
    dz = {'centro': 0.0, 'base': altura / 2, 'topo': -altura / 2}[ancora]
    if dz:
        bmesh.ops.translate(bm, verts=bm.verts, vec=(0, 0, dz))


def bloco(nome, medidas, loc, cor, pai=None, ancora='centro', brilha=False):
    """caixa de medidas (x, y, z) em metros."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=medidas, verts=bm.verts)
    _ancora(bm, medidas[2], ancora)
    return _objeto(nome, bm, cor, loc, pai, brilha)


def cilindro(nome, raio, altura, loc, cor, pai=None, lados=8, ancora='centro', brilha=False):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=lados, radius1=raio, radius2=raio, depth=altura)
    _ancora(bm, altura, ancora)
    return _objeto(nome, bm, cor, loc, pai, brilha)


def cone(nome, raio, altura, loc, cor, pai=None, lados=8, ancora='centro', brilha=False):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=lados, radius1=raio, radius2=0.0, depth=altura)
    _ancora(bm, altura, ancora)
    return _objeto(nome, bm, cor, loc, pai, brilha)


def bola(nome, raio, loc, cor, pai=None, detalhe=1, brilha=False):
    """bola facetada (detalhe 1 = bem low poly, 2 = mais redonda)."""
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=detalhe, radius=raio)
    return _objeto(nome, bm, cor, loc, pai, brilha)


def grupo(nome, loc=(0, 0, 0), pai=None):
    """um ponto vazio que segura várias peças: mexeu nele, mexe em todas."""
    g = bpy.data.objects.new(nome, None)
    bpy.context.scene.collection.objects.link(g)
    g.location = loc
    if pai is not None:
        g.parent = pai
    return g


def pecas(g):
    """todas as peças de malha dentro de um grupo."""
    return [o for o in g.children_recursive if o.type == 'MESH']


def texto(nome, frase, loc, tamanho=1.2, cor=None, pai=None, espessura=0.06):
    """letreiro 3D de frente pra câmera (que olha pra +Y). Use poucas palavras e tamanho grande."""
    cu = bpy.data.curves.new(nome, 'FONT')
    cu.body = frase
    cu.size = tamanho
    cu.extrude = espessura
    cu.align_x = 'CENTER'
    cu.align_y = 'CENTER'
    o = bpy.data.objects.new(nome, cu)
    bpy.context.scene.collection.objects.link(o)
    o.data.materials.append(mat_luz(cor or COR['texto']))
    o.location = loc
    o.rotation_euler = (math.radians(90), 0, 0)
    if pai is not None:
        o.parent = pai
    return o


# ---------------------------------------------------------------- cenários prontos
def chao(sc, cor='grama', tamanho=60.0, loc=(0, 0, 0)):
    """um chão plano grande em duas cores misturadas, pra não ficar liso demais."""
    import random
    rnd = random.Random(7)
    bm = bmesh.new()
    n = 30
    passo = tamanho / n
    for i in range(n):
        for j in range(n):
            x, y = -tamanho / 2 + i * passo, -tamanho / 2 + j * passo
            vs = [bm.verts.new((x + a, y + b, 0)) for a, b in ((0, 0), (passo, 0), (passo, passo), (0, passo))]
            bm.faces.new(vs).material_index = 1 if rnd.random() < 0.3 else 0
    me = bpy.data.meshes.new('chao')
    bm.to_mesh(me)
    bm.free()
    me.materials.append(mat(COR.get(cor, cor)))
    me.materials.append(mat(COR.get(cor + '2', COR.get(cor, cor))))
    o = bpy.data.objects.new('chao', me)
    sc.collection.objects.link(o)
    o.location = loc
    return o


def arvore(nome, loc, altura=2.4, pai=None):
    """árvore de bloquinho: tronco de 6 lados e copa de 2 cones."""
    g = grupo(nome, loc, pai)
    cilindro(f'{nome}_tronco', altura * 0.07, altura * 0.45, (0, 0, 0), COR['madeira'], g, lados=6, ancora='base')
    cone(f'{nome}_copa1', altura * 0.30, altura * 0.45, (0, 0, altura * 0.35), COR['folha'], g, lados=7, ancora='base')
    cone(f'{nome}_copa2', altura * 0.22, altura * 0.38, (0, 0, altura * 0.60), COR['folha2'], g, lados=7, ancora='base')
    contorno(pecas(g))
    return g


def nuvem(nome, loc, tamanho=1.0, cor=None, pai=None):
    """nuvem de 5 bolas facetadas. Devolve (grupo, material) — o material é só dela, pra escurecer com `cor_em`."""
    g = grupo(nome, loc, pai)
    m = mat(cor or COR['nuvem'], unico=True)
    for k, (x, z, r) in enumerate(((-1.1, 0, 0.75), (0, 0.25, 1.0), (1.1, 0, 0.8), (-0.5, -0.25, 0.7), (0.6, -0.25, 0.7))):
        b = bola(f'{nome}_{k}', r * tamanho, (x * tamanho, 0, z * tamanho), '#FFFFFF', g)
        b.data.materials[0] = m
    contorno(pecas(g), 0.04)
    return g, m


# ---------------------------------------------------------------- o boneco de blocos
def boneco(nome, loc=(0, 0, 0), camisa=None, calca=None, pele=None, altura=1.7, pai=None):
    """pessoa de blocos, de frente pra câmera (frente = -Y). Pernas e braços giram no quadril e no ombro.
    Devolve o grupo; as partes ficam em g['partes'] (nomes: perna_e, perna_d, braco_e, braco_d, cabeca)."""
    s = altura / 1.7
    g = grupo(nome, loc, pai)
    pele = pele or COR['pele']
    perna = 0.75 * s
    partes = {}
    for lado, x in (('e', -0.11 * s), ('d', 0.11 * s)):
        pv = grupo(f'{nome}_quadril_{lado}', (x, 0, perna), g)
        bloco(f'{nome}_perna_{lado}', (0.16 * s, 0.18 * s, perna - 0.08 * s), (0, 0, 0), calca or COR['calca'], pv, ancora='topo')
        bloco(f'{nome}_sapato_{lado}', (0.17 * s, 0.26 * s, 0.08 * s), (0, -0.04 * s, -perna + 0.04 * s), COR['sapato'], pv)
        partes[f'perna_{lado}'] = pv
    bloco(f'{nome}_tronco', (0.42 * s, 0.24 * s, 0.55 * s), (0, 0, perna + 0.275 * s), camisa or COR['camisa'], g)
    ombro = perna + 0.50 * s
    for lado, x in (('e', -0.28 * s), ('d', 0.28 * s)):
        pv = grupo(f'{nome}_ombro_{lado}', (x, 0, ombro), g)
        bloco(f'{nome}_braco_{lado}', (0.12 * s, 0.14 * s, 0.42 * s), (0, 0, 0), camisa or COR['camisa'], pv, ancora='topo')
        bloco(f'{nome}_mao_{lado}', (0.12 * s, 0.13 * s, 0.12 * s), (0, 0, -0.48 * s), pele, pv)
        partes[f'braco_{lado}'] = pv
    cab = grupo(f'{nome}_pescoco', (0, 0, perna + 0.57 * s), g)
    bloco(f'{nome}_cabeca', (0.34 * s, 0.32 * s, 0.34 * s), (0, 0, 0.19 * s), pele, cab)
    bloco(f'{nome}_cabelo', (0.36 * s, 0.34 * s, 0.10 * s), (0, 0.01 * s, 0.38 * s), COR['cabelo'], cab)
    for x in (-0.07 * s, 0.07 * s):
        bloco(f'{nome}_olho{x:+.2f}', (0.05 * s, 0.02 * s, 0.06 * s), (x, -0.165 * s, 0.21 * s), COR['olho'], cab)
    partes['cabeca'] = cab
    contorno(pecas(g), 0.012 * s)
    g['partes'] = list(partes)          # só pra consulta
    g['_s'] = s
    for k, v in partes.items():
        v['_parte'] = k
    return g


def parte(g, nome):
    """uma parte do boneco: parte(b, 'braco_d')."""
    return next(o for o in g.children_recursive if o.get('_parte') == nome)


def virar_para(dx, dy):
    """o giro (em radianos) pra o boneco olhar na direção (dx, dy). Assim ele nunca anda de costas."""
    return math.atan2(dx, -dy)


def andar(g, t0, t1, de, para, passos_por_s=2.0):
    """o boneco anda em linha reta de `de` até `para` (x, y), olhando pra onde vai, balançando pernas e braços.
    Antes de t0 e depois de t1 fica parado, de pé."""
    rz = virar_para(para[0] - de[0], para[1] - de[1])
    z = g.location.z
    chaves(g, 'rotation_euler', [(t0, (0, 0, rz)), (t1, (0, 0, rz))])
    chaves(g, 'location', [(t0, (de[0], de[1], z)), (t1, (para[0], para[1], z))], suave=False)
    n = max(1, round((t1 - t0) * passos_por_s))
    amp = math.radians(28)
    pe, pd, be, bd = (parte(g, k) for k in ('perna_e', 'perna_d', 'braco_e', 'braco_d'))
    for k in range(n + 1):
        t = t0 + (t1 - t0) * k / n
        a = 0.0 if k in (0, n) else (amp if k % 2 else -amp)
        for o, sinal in ((pe, 1), (pd, -1), (be, -1), (bd, 1)):
            chaves(o, 'rotation_euler', [(t, (a * sinal, 0, 0))])


def acenar(g, t0, t1, lado='d'):
    """levanta o braço e acena entre t0 e t1."""
    b = parte(g, f'braco_{lado}')
    s = 1 if lado == 'd' else -1
    pts = [(t0, (0, 0, 0)), (t0 + 0.3, (0, s * math.radians(150), 0))]
    t = t0 + 0.3
    k = 0
    while t + 0.25 < t1 - 0.3:
        t += 0.25
        k += 1
        pts.append((t, (0, s * math.radians(150 + (15 if k % 2 else -15)), 0)))
    pts.append((t1, (0, 0, 0)))
    chaves(b, 'rotation_euler', pts)


# ---------------------------------------------------------------- movimento
def chaves(obj, prop, pontos, suave=True):
    """anima uma propriedade: pontos = [(segundo, valor), ...]. `suave` = começa e para devagar (o padrão);
    `suave=False` = velocidade constante (bom pra andar, cair, girar sem parar)."""
    for t, v in pontos:
        setattr(obj, prop, v)
        obj.keyframe_insert(prop, frame=q(t))
    ad = obj.animation_data
    if ad and ad.action:
        for fc in _curvas(ad):
            if fc.data_path == prop:
                for p in fc.keyframe_points:
                    p.interpolation = 'BEZIER' if suave else 'LINEAR'


def _curvas(ad):
    """as curvas de animação (no Blender 5 elas moram dentro do 'slot' da ação)."""
    try:
        from bpy_extras import anim_utils
        cb = anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot)
        return list(cb.fcurves) if cb else []
    except Exception:
        return list(getattr(ad.action, 'fcurves', []))


def aparecer(obj, t, dur=0.4, escala=1.0):
    """cresce do zero até o tamanho (nada surge do nada: ele cresce)."""
    chaves(obj, 'scale', [(t, (0.001,) * 3), (t + dur, (escala,) * 3)])


def sumir(obj, t, dur=0.4, escala=1.0):
    """encolhe até sumir."""
    chaves(obj, 'scale', [(t, (escala,) * 3), (t + dur, (0.001,) * 3)])


def balancar(obj, t0, t1, prop='location', eixo=2, amp=0.1, periodo=1.2):
    """vai e volta suave (respirar, boiar, folha ao vento) entre t0 e t1, em volta do valor atual."""
    base = list(getattr(obj, prop))
    pts = []
    t = t0
    k = 0
    while t <= t1 + 1e-6:
        v = base[:]
        v[eixo] = base[eixo] + (amp if k % 2 else -amp) * (0 if k == 0 else 1)
        pts.append((t, tuple(v)))
        t += periodo / 2
        k += 1
    chaves(obj, prop, pts)


# ---------------------------------------------------------------- câmera
def camera(sc, loc, alvo=(0, 0, 0), lente=35):
    """a câmera, sempre olhando pro `alvo` (um ponto vazio que você pode animar com `chaves`). Devolve (câmera, alvo)."""
    cd = bpy.data.cameras.new('camera')
    cd.lens = lente
    cam = bpy.data.objects.new('camera', cd)
    sc.collection.objects.link(cam)
    cam.location = loc
    a = grupo('alvo_camera', alvo)
    c = cam.constraints.new('TRACK_TO')
    c.target = a
    c.track_axis = 'TRACK_NEGATIVE_Z'
    c.up_axis = 'UP_Y'
    sc.camera = cam
    return cam, a


# ---------------------------------------------------------------- render
def _args():
    """lê o que vem depois de `--` na linha do Blender: --quadro 4.5 (um quadro de teste no segundo 4,5)."""
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    op = {}
    for i, x in enumerate(a):
        if x.startswith('--'):
            op[x[2:]] = a[i + 1] if i + 1 < len(a) and not a[i + 1].startswith('--') else True
    return op


def ler_fala(caminho):
    """lê o fala.json de um vídeo (escrito por animacoes/ferramentas/voz.mjs): devolve (duração, [(início, fim, texto), ...]).
    Use os tempos das frases pra cada coisa acontecer quando é dita."""
    import json
    f = json.loads(Path(caminho).read_text(encoding='utf-8'))
    return f['duracao'], [(fr['s'], fr['e'], fr.get('texto', '')) for fr in f['frases']]


def renderizar(sc, nome, pasta=None):
    """sem nada: grava o vídeo em animacoes/estilos/exemplos/<nome>-vN.mp4 (versão nova, nunca apaga a anterior).
    Com `pasta`: grava em <pasta>/<nome>.mp4 (substitui), pra ser usado como fundo de um vídeo com legenda.
    Com `-- --quadro 4.5`: grava só o quadro do segundo 4,5 em sistema/.tmp/<nome>-quadro-4.5.png, pra conferir antes."""
    op = _args()
    im = sc.render.image_settings
    if 'quadro' in op:
        t = float(op['quadro'])
        sc.frame_set(q(t))
        if hasattr(im, 'media_type'):
            im.media_type = 'IMAGE'
        im.file_format = 'PNG'
        destino = TMP / f'{nome}-quadro-{t}.png'
        sc.render.filepath = str(destino)
        bpy.ops.render.render(write_still=True)
        print(f'\nOK quadro de teste: {destino}')
        return destino
    if pasta:
        Path(pasta).mkdir(parents=True, exist_ok=True)
        destino = Path(pasta) / f'{nome}.mp4'
    else:
        PRONTOS.mkdir(exist_ok=True)
        n = 1
        while (PRONTOS / f'{nome}-v{n}.mp4').exists():
            n += 1
        destino = PRONTOS / f'{nome}-v{n}.mp4'
    if hasattr(im, 'media_type'):
        im.media_type = 'VIDEO'
    im.file_format = 'FFMPEG'
    ff = sc.render.ffmpeg
    ff.format = 'MPEG4'
    ff.codec = 'H264'
    ff.constant_rate_factor = 'HIGH'
    ff.ffmpeg_preset = 'GOOD'
    ff.audio_codec = 'NONE'
    sc.render.filepath = str(destino)
    sc.render.use_file_extension = False
    bpy.ops.render.render(animation=True)
    print(f'\nOK video: {destino}')
    return destino
