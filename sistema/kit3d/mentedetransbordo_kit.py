"""Kit fixo da página mentedetransbordo: LOW POLY CHAPADO COM CONTORNO (teste de 2026-11-04).

A ideia: a página roda vídeo com frequência, então o lugar e a pessoa não são refeitos a cada vídeo. Este módulo
monta, por código e sempre igual (semente fixa):
- estilo(sc, 'workbench' | 'toon'): o motor e o look (V1 Workbench chapado; V2 EEVEE toon em degraus).
- floresta(sc): a REGIÃO da página, a mata na borda da cidadezinha. A clareira fica no (0, 0); a trilha vem de -Y
  (de onde fica a cidade); o tronco grande em TR e o toco em ST são pontos fixos que todo vídeo pode usar.
- pessoa_padrao(): a pessoa da página (adventurer CC0 do kit3d-assets, mochila incluída) em low poly e com a paleta.
- celular(), toco(), relogio(): os objetos do trecho, já no look.
Tudo CC0 do kit3d-assets passa por lowpoly(): decimate + sombreamento chapado + cor lisa da PALETA.
Só o que o teste usa: a cidade em si ainda não tem peça (entra quando um vídeo pedir).

Uso (dentro do Blender, depois de importar o kit3d como K):
    import mentedetransbordo_kit as MT
    MT.K = K
    MT.estilo(sc, 'toon'); mundo = MT.floresta(sc); A = MT.pessoa_padrao('voce', (0, 0, 0), 180)
"""
import math
import random
from pathlib import Path

import bpy
from mathutils import Vector

K = None  # o kit3d (posto por quem importa: MT.K = K)

# ---------------------------------------------------------------- paleta da página (cor lisa forte, fim de tarde)
PALETA = {
    'chao': '#C9773A', 'chao2': '#B5652F', 'trilha': '#E8B472', 'folha_chao': ['#E0702C', '#C9481F', '#F2A23A', '#8E3B1C'],
    'copa': ['#3E8E3A', '#2F7A3C', '#5BA33B'], 'pinho': ['#1F6B46', '#2A7F4F'], 'tronco': '#7A4A2A', 'tronco2': '#5E3820',
    'samambaia': '#4FA046', 'arbusto': '#3B8C3E', 'pedra': '#8C8A96', 'musgo': '#7DB33A', 'madeira_toco': '#8A5632',
    'camisa': '#3F7F3A', 'camisa2': '#78B04A', 'calca': '#6B4A2E', 'calca2': '#4E3522', 'pele': '#F0A878', 'cabelo': '#3A2416',
    'bota': '#2A2A2E', 'bota2': '#5A5A60', 'olho': '#1A1A1A', 'mochila': '#8A5A2E', 'ouro': '#F2C14A',
    'cel_corpo': '#2B2D33', 'cel_tela': '#2F5BD8', 'cel_barra': '#A9B4DA', 'cel_x': '#FF3B3B',
    'relogio_aro': '#F4EFE4', 'relogio_borda': '#2E3440', 'relogio_marca': '#2E3440', 'relogio_fatia': '#FF8A1F',
    'contorno': '#1A1220',
    # céu de fim de tarde em faixas (de baixo pra cima) e a névoa da distância (V2)
    'ceu': ['#FFB15C', '#F58A5A', '#D9667A', '#8E5A9E', '#5A4A8E'], 'nevoa': '#E89A6A',
}

_MATS = {}
ESTILO = {'modo': 'toon', 'contorno': 0.012, 'clima': 'tarde'}
# os 3 degraus do toon e a névoa por clima: 'tarde' (a mata, o teste aprovado) e 'noite' (dentro de casa: luz quente da
# lâmpada, sombra azul-roxa da noite, sem névoa)
CLIMAS = {
    'tarde': {'degraus': ((0.30, 0.24, 0.42), (0.70, 0.60, 0.66), (1.12, 0.96, 0.80)), 'nevoa': (20.0, 75.0, 0.6),
              'amb': ('#8C7AB0', 0.35), 'sol': ((1.0, 0.86, 0.68), 3.3, (58, 0, -145))},
    'noite': {'degraus': ((0.26, 0.26, 0.50), (0.68, 0.64, 0.80), (1.10, 0.97, 0.84)), 'nevoa': (400.0, 900.0, 0.0),
              'amb': ('#5A6AA8', 0.30), 'sol': ((1.0, 0.88, 0.72), 3.4, (44, 0, -30)),
              'ceu': ['#1E2A5A', '#26346E', '#2E3F80', '#384A90', '#42559E']},
}


def _lin(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1.0,)


def mat(cor, nome=None, unico=False):
    """`unico=True`: material só desta peça (fora do cache), pra animar a cor com `cor_em`. material chapado: a cor serve aos dois motores. Workbench lê a cor de exibição (diffuse_color); o EEVEE toon lê
    os nós: luz difusa -> Shader to RGB -> degraus (sombra roxa, meio-tom, luz quente) x cor -> névoa pela distância."""
    if cor in _MATS and not unico:
        return _MATS[cor]
    m = bpy.data.materials.new(nome or f'mt_{cor.strip("#")}')
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
    cr.elements[0].position = 0.0
    d0, d1, d2 = CLIMAS[ESTILO['clima']]['degraus']
    cr.elements[0].color = (*d0, 1)                   # sombra: roxa (fim de tarde) ou azul (noite)
    cr.elements[1].position = 0.18
    cr.elements[1].color = (*d1, 1)                   # meio-tom
    e3 = cr.elements.new(0.55)
    e3.color = (*d2, 1)                               # luz: quente
    mul = nt.nodes.new('ShaderNodeMix')
    mul.data_type = 'RGBA'
    mul.blend_type = 'MULTIPLY'
    mul.inputs['Factor'].default_value = 1.0
    mul.inputs['B'].default_value = _lin(cor)
    camd = nt.nodes.new('ShaderNodeCameraData')
    mr = nt.nodes.new('ShaderNodeMapRange')
    n0, n1, nmax = CLIMAS[ESTILO['clima']]['nevoa']
    mr.inputs['From Min'].default_value = n0
    mr.inputs['From Max'].default_value = n1
    mr.inputs['To Min'].default_value = 0.0
    mr.inputs['To Max'].default_value = nmax
    nev = nt.nodes.new('ShaderNodeMix')
    nev.data_type = 'RGBA'
    nev.inputs['B'].default_value = _lin(PALETA['nevoa'])
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
    mul.name = 'cor'
    if not unico:
        _MATS[cor] = m
    return m


def cor_em(m, pontos):
    """anima a cor de um material `mat(..., unico=True)`: pontos = [(t, '#hex'), ...], transição linear entre eles."""
    sock = m.node_tree.nodes['cor'].inputs['B']
    for t, c in pontos:
        sock.default_value = _lin(c)
        sock.keyframe_insert('default_value', frame=K.q(t))


def mat_luz(cor, forca=1.0):
    """cor que brilha sozinha (fogo, vidro da janela à noite, brilho de tensão): não passa pelos degraus nem pela névoa."""
    chave = f'luz{cor}{forca}'
    if chave in _MATS:
        return _MATS[chave]
    m = bpy.data.materials.new(f'mt_luz_{cor.strip("#")}')
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


def mat_contorno():
    """casco invertido (V2): preto-roxo, só a face de trás aparece (backface culling)."""
    if 'contorno' in _MATS:
        return _MATS['contorno']
    m = bpy.data.materials.new('mt_contorno')
    m.diffuse_color = _lin(PALETA['contorno'])
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    em = nt.nodes.new('ShaderNodeEmission')
    em.inputs['Color'].default_value = _lin(PALETA['contorno'])
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    nt.links.new(em.outputs[0], out.inputs['Surface'])
    m.use_backface_culling = True
    for k_ in ('use_backface_culling_shadow',):     # o casco não faz sombra: sem riscos soltos por dentro
        if hasattr(m, k_):
            setattr(m, k_, True)
    _MATS['contorno'] = m
    return m


# ---------------------------------------------------------------- motor e look
def estilo(sc, modo, clima='tarde'):
    """modo 'workbench' (V1) ou 'toon' (V2, o MOTOR PADRÃO desde 2026-11-04). Os dois: sem motion blur, sem DOF,
    contorno, sombra dura. Todos os quadros a 30 qps (o 'de dois em dois' só como efeito pedido). clima: 'tarde' (a mata)
    ou 'noite' (cozinha/casa à noite). Chame ANTES de criar qualquer material."""
    ESTILO['modo'] = modo
    ESTILO['clima'] = clima
    sc.eevee.taa_render_samples = 4
    sc.render.use_motion_blur = False
    sc.view_settings.view_transform = 'Standard'
    sc.view_settings.look = 'None'
    sc.view_settings.exposure = 0.0
    if modo == 'workbench':
        sc.render.engine = 'BLENDER_WORKBENCH'
        sh = sc.display.shading
        sh.light = 'STUDIO'
        sh.color_type = 'MATERIAL'
        sh.show_shadows = True
        sh.shadow_intensity = 0.3
        sh.show_cavity = True
        sh.cavity_type = 'WORLD'
        sh.cavity_ridge_factor = 1.0
        sh.cavity_valley_factor = 1.0
        sh.show_object_outline = True
        sh.show_backface_culling = True    # o casco invertido (contorno) precisa disso no Workbench
        sc.view_settings.exposure = 0.85
        sh.object_outline_color = _lin(PALETA['contorno'])[:3]
        sh.show_specular_highlight = False
        sc.display.light_direction = (0.45, -0.30, 0.84)
        sc.display.shadow_focus = 0.0
        sc.display.shadow_shift = 0.05
        sc.display.render_aa = '8'
        sc.world.color = _lin(PALETA['ceu'][0])[:3]
    else:
        sc.render.engine = 'BLENDER_EEVEE'
        ee = sc.eevee
        ee.taa_render_samples = 4
        for k, v in (('use_raytracing', False), ('use_shadows', True), ('shadow_ray_count', 1), ('shadow_step_count', 1),
                     ('use_volumetric_shadows', False), ('use_gtao', False), ('use_bloom', False), ('use_ssr', False),
                     ('volumetric_tile_size', '16'), ('use_shadow_jitter_viewport', False), ('fast_gi_method', 'GLOBAL_ILLUMINATION')):
            try:
                setattr(ee, k, v)
            except (AttributeError, TypeError):
                pass
        _mundo_toon(sc)
    return sc


def _mundo_toon(sc):
    w = sc.world
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes.clear()
    co = nt.nodes.new('ShaderNodeTexCoord')
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    rampa = nt.nodes.new('ShaderNodeValToRGB')
    cr = rampa.color_ramp
    cr.interpolation = 'CONSTANT'
    cores = CLIMAS[ESTILO['clima']].get('ceu', PALETA['ceu'])
    cr.elements[0].position = 0.0
    cr.elements[0].color = _lin(cores[0])
    cr.elements[1].position = 0.55
    cr.elements[1].color = _lin(cores[1])
    for k, c in enumerate(cores[2:]):
        e = cr.elements.new(0.68 + 0.11 * k)
        e.color = _lin(c)
    bg_ceu = nt.nodes.new('ShaderNodeBackground')
    bg_luz = nt.nodes.new('ShaderNodeBackground')
    amb, amb_f = CLIMAS[ESTILO['clima']]['amb']
    bg_luz.inputs['Color'].default_value = _lin(amb)     # luz ambiente fraca (roxa à tarde, azul à noite)
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
    ld = bpy.data.lights.new('Sol', 'SUN')
    cor_sol, forca_sol, (rx, ry, rz) = CLIMAS[ESTILO['clima']]['sol']
    ld.energy = forca_sol
    ld.angle = 0.0                       # sombra dura
    ld.color = cor_sol
    sol = bpy.data.objects.new('Sol', ld)
    sc.collection.objects.link(sol)
    sol.rotation_euler = (math.radians(rx), math.radians(ry), math.radians(rz))


def ceu_workbench(cam):
    """V1: o Workbench não tem céu em degradê. Um cartão de faixas preso na câmera, bem longe, sem sombra."""
    import bmesh
    cores = PALETA['ceu']
    me = bpy.data.meshes.new('ceu_cartao')
    bm = bmesh.new()
    hs = [-0.9, 0.05, 0.22, 0.42, 0.65, 1.2]
    for k in range(len(cores)):
        y0, y1 = hs[k], hs[k + 1]
        vs = [bm.verts.new((x, y, 0)) for x, y in ((-1, y0), (1, y0), (1, y1), (-1, y1))]
        f = bm.faces.new(vs)
        f.material_index = k
    bm.to_mesh(me)
    bm.free()
    for c in cores:
        me.materials.append(mat(c))
    o = bpy.data.objects.new('ceu_cartao', me)
    bpy.context.scene.collection.objects.link(o)
    o.parent = cam
    o.location = (0, 0, -900)
    o.scale = (900, 900, 1)
    o.display.show_shadows = False
    o.visible_shadow = False
    return o


# ---------------------------------------------------------------- low poly: decimate + chapado + paleta
def _assa_decimate(me, razao):
    if razao >= 0.999 or len(me.polygons) < 60:
        return me
    tmp = bpy.data.objects.new('_dec', me)
    bpy.context.scene.collection.objects.link(tmp)
    md = tmp.modifiers.new('dec', 'DECIMATE')
    md.ratio = razao
    md.use_collapse_triangulate = True
    dg = bpy.context.evaluated_depsgraph_get()
    novo = bpy.data.meshes.new_from_object(tmp.evaluated_get(dg))
    bpy.data.objects.remove(tmp, do_unlink=True)
    novo.name = me.name + '_lp'
    return novo


def chapado(me):
    me.polygons.foreach_set('use_smooth', [False] * len(me.polygons))
    if hasattr(me, 'shade_flat'):
        try:
            me.shade_flat()
        except Exception:
            pass


def contorno(objs, esp=None, ref=None, d0=8.0):
    """V2: casco invertido barato (Solidify com normais viradas e o material de contorno). No Workbench o contorno é o
    'object outline' do próprio motor: aqui não faz nada.
    `ref` (ponto onde a câmera trabalha): longe dele o contorno engrossa na proporção da distância (a partir de `d0` m),
    pra continuar com a mesma espessura NA TELA. Sem isso o contorno de espessura fixa sumia nas árvores longe
    (pendência do teste de 2026-11-04)."""
    esp0 = esp or ESTILO['contorno']
    mc = mat_contorno()
    feitos = set()
    for o in objs:
        if o.type != 'MESH':
            continue
        me = o.data
        if mc.name not in [m.name for m in me.materials if m]:
            me.materials.append(mc)
        esp = esp0
        if ref is not None:
            esp = esp0 * max(1.0, (o.matrix_world.translation - Vector(ref)).length / d0)
        md = o.modifiers.new('contorno', 'SOLIDIFY')
        md.thickness = esp / max(1e-6, max(o.matrix_world.to_scale()))
        md.offset = 1.0
        md.use_flip_normals = True
        md.use_rim = False
        # o material de contorno é o último slot: o deslocamento estoura e o Blender prende no último
        md.material_offset = 99
        feitos.add(o.name)


# ---------------------------------------------------------------- moldes CC0: importa uma vez, decimate, cópias leves
def molde(arquivo, tamanho, medida='altura', razao=0.4, regra=None):
    import bmesh
    g = K.asset('molde_' + Path(arquivo).stem, arquivo, (0, 0, 0), tamanho, medida)
    bpy.context.view_layer.update()
    malhas = [o for o in g.children_recursive if o.type == 'MESH' and K.vai_pro_quadro(o) and o.data.materials]
    saida = []
    for o in malhas:
        me = o.data.copy()
        me.transform(o.matrix_world)
        me = _assa_decimate(me, razao)
        mats = list(me.materials)
        bm = bmesh.new()
        bm.from_mesh(me)
        for idx, mt in enumerate(mats):
            faces = [f for f in bm.faces if f.material_index == idx]
            if not faces:
                continue
            bm2 = bmesh.new()
            mapa = {}
            for f in faces:
                vs = []
                for v in f.verts:
                    if v.index not in mapa:
                        mapa[v.index] = bm2.verts.new(v.co)
                    vs.append(mapa[v.index])
                try:
                    bm2.faces.new(vs)
                except ValueError:
                    pass
            me2 = bpy.data.meshes.new(f'{Path(arquivo).stem}_{idx}')
            bm2.to_mesh(me2)
            bm2.free()
            chapado(me2)
            nome_m = (mt.name if mt else '').lower()
            me2.materials.append(regra(nome_m) if regra else mat('#888888'))
            saida.append(me2)
        bm.free()
    for x in [g] + list(g.children_recursive):
        bpy.data.objects.remove(x, do_unlink=True)
    return saida


def copia(malhas, nome, loc, rz=0.0, s=1.0, sc=None):
    sc = sc or bpy.context.scene
    out = []
    for k, me in enumerate(malhas):
        o = bpy.data.objects.new(f'{nome}_{k}', me)
        sc.collection.objects.link(o)
        o.location = loc
        o.rotation_euler = (0, 0, rz)
        o.scale = (s, s, s)
        out.append(o)
    return out


# ---------------------------------------------------------------- a região: mata na borda da cidadezinha
P0 = Vector((0.0, 0.0, 0.0))      # a clareira (onde a pessoa padrão começa)
TR = Vector((1.9, 0.7, 0.0))      # o tronco grande
ST = Vector((-1.55, 1.35, 0.0))   # o toco com musgo
TRILHA = ((0.0, -11.0), (0.0, 0.6), 0.9)   # a trilha que vem da cidade (-Y): ponta, ponta, largura
SEMENTE = 31


def _dist_seg(p, a, b):
    ab = b - a
    u = max(0.0, min(1.0, (p - a).dot(ab) / max(1e-9, ab.length_squared)))
    return (p - (a + ab * u)).length


def livre(x, y, folga=0.0, extras=()):
    p = Vector((x, y, 0))
    if (p - Vector((0.3, 0.4, 0))).length < 3.6 + folga:
        return False
    a, b, lg = TRILHA
    if _dist_seg(p, Vector((*a, 0)), Vector((*b, 0))) < lg + 0.6 + folga:
        return False
    for (ax, ay), (bx, by), lg2 in extras:
        if _dist_seg(p, Vector((ax, ay, 0)), Vector((bx, by, 0))) < lg2 + folga:
            return False
    return True


def h_chao(x, y):
    """chão plano na área da ação (r < 22 m), ondulado em facetas longe."""
    r = math.hypot(x + 6, y + 6)
    if r < 22:
        return 0.0
    u = min(1.0, (r - 22) / 30)
    return u * (1.6 * math.sin(x * 0.11 + 1.3) * math.cos(y * 0.09) + 0.8 * math.sin(0.23 * x - 0.17 * y))


def _chao(sc):
    import bmesh
    rnd = random.Random(SEMENTE + 1)
    bm = bmesh.new()
    n, lado = 70, 200.0
    vs = {}
    for i in range(n + 1):
        for j in range(n + 1):
            x = -6 + (i / n - 0.5) * lado
            y = -6 + (j / n - 0.5) * lado
            jx, jy = (rnd.uniform(-0.9, 0.9), rnd.uniform(-0.9, 0.9)) if 0 < i < n and 0 < j < n else (0, 0)
            vs[i, j] = bm.verts.new((x + jx, y + jy, h_chao(x, y) - 0.002))
    me = bpy.data.meshes.new('chao')
    for i in range(n):
        for j in range(n):
            a, b, c, d = vs[i, j], vs[i + 1, j], vs[i + 1, j + 1], vs[i, j + 1]
            f1 = bm.faces.new((a, b, c))
            f2 = bm.faces.new((a, c, d))
            f1.material_index = rnd.random() < 0.35
            f2.material_index = rnd.random() < 0.35
    bm.to_mesh(me)
    bm.free()
    me.materials.append(mat(PALETA['chao']))
    me.materials.append(mat(PALETA['chao2']))
    chapado(me)
    o = bpy.data.objects.new('chao', me)
    sc.collection.objects.link(o)
    return o


def _trilha(sc):
    """a faixa clara da trilha (4 cm de terra batida, cantos chanfrados)."""
    import bmesh
    (ax, ay), (bx, by), lg = TRILHA
    bm = bmesh.new()
    rnd = random.Random(SEMENTE + 2)
    n = 14
    esq, dir_ = [], []
    for k in range(n + 1):
        y = ay + (by - ay) * k / n
        w = lg / 2 * (0.75 if k in (0, n) else rnd.uniform(0.85, 1.1))
        esq.append(bm.verts.new((ax - w, y, 0.006)))
        dir_.append(bm.verts.new((ax + w, y, 0.006)))
    for k in range(n):
        bm.faces.new((esq[k], dir_[k], dir_[k + 1], esq[k + 1]))
    me = bpy.data.meshes.new('trilha')
    bm.to_mesh(me)
    bm.free()
    me.materials.append(mat(PALETA['trilha']))
    o = bpy.data.objects.new('trilha', me)
    sc.collection.objects.link(o)
    return o


def _regra_arvore(paleta_copa):
    def r(nome):
        if any(k in nome for k in ('green', 'leave', 'leaf')):
            return mat(paleta_copa)
        return mat(PALETA['tronco'] if 'brown' in nome or 'wood' in nome else PALETA['tronco2'])
    return r


def floresta(sc, n_arv=110, n_fundo=60, extras=()):
    """a região inteira. Devolve um dicionário com os objetos que cada vídeo pode querer esconder ou usar."""
    rnd = random.Random(SEMENTE)
    mundo = {'chao': _chao(sc), 'trilha': _trilha(sc), 'arvores': [], 'miudos': []}
    ARV_G = molde('tree/tree-9nvGuZlbpE.glb', 14.0, razao=0.35, regra=_regra_arvore(PALETA['copa'][0]))
    ARV_C = molde('tree/tree-i4QMw4L64D.glb', 11.0, razao=0.35, regra=_regra_arvore(PALETA['copa'][2]))
    ARV_P = molde('tree/pine-79gmlLnweB.glb', 15.0, razao=0.3, regra=_regra_arvore(PALETA['pinho'][0]))
    SAMAMB = molde('fern/fern-jqcanvH7D6.glb', 1.4, 'maior', razao=0.6, regra=lambda n: mat(PALETA['samambaia']))
    ARBUSTO = molde('bush/bush-EoTERLq3z2.glb', 1.0, razao=0.35, regra=lambda n: mat(PALETA['arbusto']))
    PEDRA = molde('rock/rock-medium-s1OJ3bBzqc.glb', 0.6, razao=0.3, regra=lambda n: mat(PALETA['pedra']))
    mundo['tronco'] = copia(ARV_G, 'tronco', TR, 0.4)
    mundo['arvores'] += mundo['tronco']
    tipos = [(ARV_C, 1.0), (ARV_P, 1.0), (ARV_G, 0.85), (ARV_C, 0.8), (ARV_P, 0.8)]
    pos = []
    tent = 0
    while len(pos) < n_arv and tent < 20000:
        tent += 1
        x, y = rnd.uniform(-40, 26), rnd.uniform(-40, 24)
        if not livre(x, y, 1.6, extras) or any(math.hypot(x - a, y - b) < 4.2 for a, b in pos):
            continue
        pos.append((x, y))
    for k, (x, y) in enumerate(pos):
        ms, s0 = tipos[k % len(tipos)]
        mundo['arvores'] += copia(ms, f'arv{k}', (x, y, h_chao(x, y) - 0.05), rnd.uniform(0, 6.28), s0 * rnd.uniform(0.85, 1.2))
    for k in range(n_fundo):
        a, r = rnd.uniform(0, 6.28), rnd.uniform(48, 85)
        x, y = -6 + r * math.cos(a), -6 + r * math.sin(a)
        mundo['arvores'] += copia(ARV_P if k % 2 else ARV_C, f'fundo{k}', (x, y, h_chao(x, y) - 0.1), rnd.uniform(0, 6.28), rnd.uniform(1.0, 1.4))
    for ms, n, nome, smin, smax, folga in ((SAMAMB, 60, 'samamb', 0.7, 1.3, 1.1), (ARBUSTO, 22, 'arbusto', 0.7, 1.2, 1.4),
                                           (PEDRA, 18, 'pedra', 0.6, 1.4, 0.3)):
        feitos = tent = 0
        while feitos < n and tent < 5000:
            tent += 1
            x, y = rnd.uniform(-36, 24), rnd.uniform(-36, 24)
            if not livre(x, y, folga, extras):
                continue
            mundo['miudos'] += copia(ms, f'{nome}{feitos}', (x, y, h_chao(x, y) - 0.01), rnd.uniform(0, 6.28), rnd.uniform(smin, smax))
            feitos += 1
    bpy.context.view_layer.update()
    contorno(mundo['arvores'] + mundo['miudos'], 0.05, ref=P0, d0=10.0)
    for o in mundo['arvores']:      # sem as manchas grandes das copas no chão: só o tronco faz sombra (de contato)
        if o.data.materials and any(m.name == mat(PALETA['copa'][0]).name or m.diffuse_color[1] > m.diffuse_color[0] * 1.3
                                    for m in o.data.materials if m and not m.name.startswith('mt_contorno')):
            o.visible_shadow = False
    return mundo


# ---------------------------------------------------------------- a pessoa padrão da página
ARQ_PESSOA = 'man/adventurer-5EGWBMpuXq.glb'
_COR_PESSOA = {'lightgreen': 'camisa2', 'green': 'camisa', 'skin': 'pele', 'brown2': 'calca', 'brown': 'mochila',
               'black': 'bota', 'grey': 'bota2', 'eyebrows': 'cabelo', 'eye': 'olho', 'hair': 'cabelo', 'gold': 'ouro'}


def pessoa_padrao(nome, loc=(0, 0, 0), rot_z=0.0, razao=1.0, altura=1.72, mochila=True):
    """a pessoa da página: adventurer CC0 (mochila junto), 1,72 m, decimate ANTES do esqueleto (topologia fixa: nada
    tremendo entre quadros), facetas chapadas e a cor da paleta. As pernas (Brown) usam a cor da calça."""
    g = K.pessoa(nome, ARQ_PESSOA, loc, altura=altura, rot_z=rot_z, acao='Idle')
    for x in [x for x in g.children_recursive if x.type == 'EMPTY' and '_end' in x.name]:
        bpy.data.objects.remove(x, do_unlink=True)
    malhas = [o for o in g.children_recursive if o.type == 'MESH' and K.vai_pro_quadro(o) and o.data.materials]
    for o in malhas:
        chapado(o.data)
        legs = 'legs' in o.name.lower()
        for i, m in enumerate(o.data.materials):
            n = (m.name if m else '').lower().split('.')[0]
            chave = _COR_PESSOA.get(n, None)
            if legs and n == 'brown':
                chave = 'calca2'
            o.data.materials[i] = mat(PALETA[chave]) if chave else mat('#888888')
        if razao < 0.999:   # o adventurer já é low poly: decimar a mão faz cacos (teste 2026-11-04); fica 1,0
            md = o.modifiers.new('lowpoly', 'DECIMATE')
            md.ratio = razao
            o.modifiers.move(len(o.modifiers) - 1, 0)   # antes do esqueleto
    if not mochila:      # em casa: sem a mochila de trilha (malha da mochila + rolo, cor 'mochila')
        for o in list(malhas):
            nomes = [(m.name if m else '') for m in o.data.materials]
            if 'backpack' in o.name.lower() or 'bag' in o.name.lower() or (nomes and all(n == mat(PALETA['mochila']).name for n in nomes)):
                o.hide_render = o.hide_viewport = True
                malhas.remove(o)
    for o in malhas:
        o.visible_shadow = True
    contorno(malhas, 0.006)
    for o in malhas:     # o casco do contorno da pessoa não faz sombra (riscos internos na camisa e no rosto)
        md = o.modifiers.get('contorno')
        if md:
            md.use_rim = False
    return g


# ---------------------------------------------------------------- objetos do trecho
def celular(nome='celular'):
    """o celular CC0 (smartphone/phone) em low poly, com a tela 'sem sinal': fundo azul, barrinhas apagadas e um X
    vermelho. Devolve (grupo, malha). A tela é feita em coordenadas da malha (antes da escala do asset)."""
    g = K.asset(nome, 'smartphone/phone-k2kgBepoMU.glb', (0, 0, 0), 0.15, 'maior')
    me_o = next(o for o in g.children_recursive if o.type == 'MESH' and o.data.materials)
    me = me_o.data
    chapado(me)
    for i, m in enumerate(me.materials):
        me.materials[i] = mat(PALETA['cel_corpo'])
    # a tela: a face plana maior em +Z (medida nos vértices)
    zs = [v.co.z for v in me.vertices]
    xs = [v.co.x for v in me.vertices]
    ys = [v.co.y for v in me.vertices]
    zt = max(zs)
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    lx, ly, lz = (max(xs) - min(xs)), (max(ys) - min(ys)), (max(zs) - min(zs))   # unidades da malha (o glb vem minúsculo, escala 30x)
    pecas = []

    def placa(n, sx, sy, x, y, z, cor, rz=0.0):
        o = K.bloco(f'{nome}_{n}', (sx, sy, lz * 0.08), (x, y, z), '#000000', pai=me_o)
        o.data.materials.clear()
        o.data.materials.append(mat(cor))
        o.rotation_euler.z = rz
        chapado(o.data)
        pecas.append(o)
        return o
    # o ícone de sinal grande no meio da tela: 4 barrinhas apagadas e um X vermelho do lado (lê no celular)
    placa('tela', lx * 0.84, ly * 0.88, cx, cy, zt + lz * 0.02, PALETA['cel_tela'])
    base = cy - ly * 0.06
    for k in range(4):
        h = ly * (0.06 + 0.05 * k)
        placa(f'barra{k}', lx * 0.11, h, cx - lx * 0.30 + k * lx * 0.15, base + h / 2, zt + lz * 0.10, PALETA['cel_barra'])
    for k, a in enumerate((0.785, -0.785)):
        placa(f'x{k}', lx * 0.09, ly * 0.22, cx + lx * 0.24, base + ly * 0.10, zt + lz * 0.18, PALETA['cel_x'], a)
    return g, me_o, pecas


def toco(sc, loc=None):
    loc = loc or ST
    ms = molde('stump/tree-stump-with-moss-nFvEbUX6LE.glb', 0.55, razao=0.6,
               regra=lambda n: mat(PALETA['musgo'] if 'green' in n else PALETA['madeira_toco']))
    objs = copia(ms, 'toco', loc, 2.2)
    contorno(objs, 0.02)
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    hit, pt, *_ = sc.ray_cast(dg, Vector((loc.x, loc.y, 5.0)), Vector((0, 0, -1)))
    topo = pt.z if hit else 0.55
    return objs, topo


def relogio(loc, nome='relogio'):
    """relógio de maquete (código: só o mecanismo que se explica), facetado: aro de 12 lados, 12 marcas, ponteiro, a
    fatia laranja de 1 hora (30 graus) que cresce, dois pés. Devolve (grupo, fatia)."""
    import bmesh
    g = K.grupo(nome, tuple(loc))
    zc = 0.20

    def pinta(o, cor):
        o.data.materials.clear()
        o.data.materials.append(mat(cor))
        chapado(o.data)
        return o
    borda = pinta(K.cilindro(f'{nome}_borda', 0.155, 0.045, (0, 0.006, zc), '#000000', rot=(math.pi / 2, 0, 0), pai=g, segs=12), PALETA['relogio_borda'])
    aro = pinta(K.cilindro(f'{nome}_aro', 0.138, 0.05, (0, 0, zc), '#000000', rot=(math.pi / 2, 0, 0), pai=g, segs=12), PALETA['relogio_aro'])
    pecas = [borda, aro]
    for k in range(12):
        a = k * math.pi / 6
        mk = pinta(K.bloco(f'{nome}_marca{k}', (0.008, 0.004, 0.024 if k % 3 else 0.036),
                           (0.112 * math.sin(a), -0.027, zc + 0.112 * math.cos(a)), '#000000', pai=g), PALETA['relogio_marca'])
        mk.rotation_euler.y = a
        pecas.append(mk)
    for s_ in (-1, 1):
        pecas.append(pinta(K.bloco(f'{nome}_pe{s_}', (0.05, 0.06, 0.05), (s_ * 0.085, 0.0, 0.025), '#000000', pai=g), PALETA['relogio_borda']))
    # a fatia de 1 hora: do 12 ao 1, na frente do mostrador
    bm = bmesh.new()
    c = bm.verts.new((0, 0, 0))
    arco = [bm.verts.new((0.105 * math.sin(math.radians(a)), 0, 0.105 * math.cos(math.radians(a)))) for a in range(0, 31, 10)]
    for a, b in zip(arco, arco[1:]):
        bm.faces.new((c, b, a))
    me = bpy.data.meshes.new(f'{nome}_fatia')
    bm.to_mesh(me)
    bm.free()
    fatia = bpy.data.objects.new(f'{nome}_fatia', me)
    bpy.context.scene.collection.objects.link(fatia)
    fatia.parent = g
    fatia.location = (0, -0.0265, zc)
    pinta(fatia, PALETA['relogio_fatia'])
    pont = pinta(K.bloco(f'{nome}_ponteiro', (0.010, 0.004, 0.10), (0, -0.031, zc + 0.045), '#000000', pai=g), PALETA['relogio_borda'])
    pecas += [fatia, pont]
    contorno([borda, aro] + pecas[-4:-2], 0.006)
    return g, fatia


# ================================================================ a pessoa padrão em pose (camadas por cima do Idle)
# Vieram do perdido-na-floresta (2026-10-31) e entraram no kit no 1º vídeo do motor novo (pipoca, 2026-11-04).
# A pose é escrita osso a osso no espaço da armadura (Pose), e cada sequência de poses vira uma faixa NLA REPLACE por
# cima do clipe (camada). O pé deste esqueleto é filho do Root, não da canela: a pose sentada põe o pé no tornozelo à mão.
from mathutils import Matrix  # noqa: E402

OSSOS_PERNA = ['Body', 'UpperLeg.L', 'LowerLeg.L', 'Foot.L', 'UpperLeg.R', 'LowerLeg.R', 'Foot.R']
OSSOS_TRONCO = ['Abdomen', 'Torso', 'Chest', 'Neck', 'Head']
OSSOS_BRACO = ['Shoulder.L', 'UpperArm.L', 'LowerArm.L', 'Wrist.L', 'Shoulder.R', 'UpperArm.R', 'LowerArm.R', 'Wrist.R']
DEDOS = ('Index', 'Middle', 'Ring', 'Pinky')
OSSOS_DEDOS = [f'{d}{k}.{s}' for s in ('L', 'R') for d in DEDOS for k in (1, 2, 3)] + \
              [f'Thumb{k}.{s}' for s in ('L', 'R') for k in (1, 2)]


def armadura(g):
    return next(o for o in g.children_recursive if o.type == 'ARMATURE')


class Pose:
    """a pose do esqueleto (espaço da armadura). JUNTA diz onde fica a "ponta" de cada osso (a cabeça do filho, ou o
    tornozelo guardado no espaço da canela: os ossos do glTF têm 8 mm de comprimento)."""
    JUNTA = {}

    def __init__(self, arm, Mw=None):
        self.arm = arm
        self.P = {pb.name: pb.matrix.copy() for pb in arm.pose.bones}
        self.Mw = (Mw if Mw is not None else arm.matrix_world).copy()
        self.Mi = self.Mw.inverted()

    def copia(self, Mw=None):
        c = Pose.__new__(Pose)
        c.arm = self.arm
        c.Mw = (Mw if Mw is not None else self.Mw).copy()
        c.Mi = c.Mw.inverted()
        c.P = {k: v.copy() for k, v in self.P.items()}
        return c

    def sub(self, n):
        b = self.arm.data.bones[n]
        return [n] + [c.name for c in b.children_recursive]

    def aplica(self, n, Tm):
        for x in self.sub(n):
            self.P[x] = Tm @ self.P[x]

    def cabeca(self, n):
        return self.P[n].translation.copy()

    def ponta(self, n):
        j = self.JUNTA[(self.arm.name, n)]
        return self.cabeca(j) if isinstance(j, str) else self.P[n] @ j

    def gira(self, n, d):
        h = self.cabeca(n)
        cur = (self.ponta(n) - h).normalized()
        R = cur.rotation_difference(d.normalized()).to_matrix().to_4x4()
        self.aplica(n, Matrix.Translation(h) @ R @ Matrix.Translation(-h))

    def gira_eixo(self, n, eixo, ang):
        """gira o osso n (e os filhos) em volta de um eixo NO MUNDO, em radianos."""
        h = self.cabeca(n)
        e = (self.Mi.to_3x3() @ Vector(eixo)).normalized()
        self.aplica(n, Matrix.Translation(h) @ Matrix.Rotation(ang, 4, e) @ Matrix.Translation(-h))

    def move(self, n, d):
        """move o osso n (e os filhos) d metros NO MUNDO."""
        self.aplica(n, Matrix.Translation(self.Mi.to_3x3() @ Vector(d)))

    def w2a(self, p):
        return self.Mi @ Vector(p)

    def a2w(self, p):
        return self.Mw @ p

    def ik(self, up, lo, alvo, pole):
        """IK de 2 ossos analítico (alvo e polo no espaço da armadura)."""
        H = self.cabeca(up)
        L1 = (self.ponta(up) - H).length
        L2 = (self.ponta(lo) - self.cabeca(lo)).length
        d = alvo - H
        dist = max(0.02, min(d.length, (L1 + L2) * 0.999))
        u = d.normalized()
        w_ = pole - u * pole.dot(u)
        w_.normalize()
        a = (L1 * L1 - L2 * L2 + dist * dist) / (2 * dist)
        h = math.sqrt(max(0.0, L1 * L1 - a * a))
        joelho = H + u * a + w_ * h
        self.gira(up, joelho - H)
        self.gira(lo, H + u * dist - self.cabeca(lo))

    def base(self, n):
        b = self.arm.data.bones[n]
        if b.parent:
            rel = b.parent.matrix_local.inverted() @ b.matrix_local
            B = rel.inverted() @ self.P[b.parent.name].inverted() @ self.P[n]
        else:
            B = b.matrix_local.inverted() @ self.P[n]
        loc, q, _ = B.decompose()
        return loc, q


def pose_em(g, f):
    """a pose do clipe no quadro f (a base pra montar as poses da camada)."""
    sc = bpy.context.scene
    sc.frame_set(f)
    bpy.context.view_layer.update()
    arm = armadura(g)
    P = Pose(arm)
    for s in ('L', 'R'):
        Pose.JUNTA[(arm.name, 'UpperLeg.' + s)] = 'LowerLeg.' + s
        Pose.JUNTA[(arm.name, 'LowerLeg.' + s)] = P.P['LowerLeg.' + s].inverted() @ P.P['Foot.' + s].translation
        Pose.JUNTA[(arm.name, 'UpperArm.' + s)] = 'LowerArm.' + s
        Pose.JUNTA[(arm.name, 'LowerArm.' + s)] = 'Wrist.' + s
    return P


def frente_de(rz):
    """a frente da pessoa padrão girada rz (radianos) no mundo: com rz = pi ela olha pra +Y."""
    return Vector((math.cos(rz - math.pi / 2), math.sin(rz - math.pi / 2), 0.0))


def senta(Pb, Mw, rz, chao_z, alt_q, pe_dist, pe_alt=0.07, incl=0.0, pole_up=0.25, abre=0.06):
    """sentada no chão (ou num banco): quadril a `alt_q` do chão, tornozelos `pe_dist` à frente, tronco inclinado `incl`
    graus pra trás (negativo = pra frente). Mw = matriz de mundo da armadura no lugar onde ela está sentada."""
    P = Pb.copia(Mw)
    fr = frente_de(rz)
    lado = fr.cross(Vector((0, 0, 1)))
    hz = (P.a2w(P.cabeca('UpperLeg.L')).z + P.a2w(P.cabeca('UpperLeg.R')).z) / 2
    P.move('Body', (0, 0, chao_z + alt_q - hz))
    if incl:
        P.gira_eixo('Abdomen', lado, math.radians(incl))
    cq = (P.a2w(P.cabeca('UpperLeg.L')) + P.a2w(P.cabeca('UpperLeg.R'))) / 2
    for s in ('L', 'R'):
        H = P.a2w(P.cabeca('UpperLeg.' + s))
        sl = 1 if (H - cq).dot(lado) > 0 else -1
        alvo = Vector((H.x, H.y, 0.0)) + fr * pe_dist + lado * sl * abre
        alvo.z = chao_z + pe_alt
        P.ik('UpperLeg.' + s, 'LowerLeg.' + s, P.w2a(alvo), P.Mi.to_3x3() @ (fr + Vector((0, 0, pole_up))))
        Tm = P.P['LowerLeg.' + s] @ Pb.P['LowerLeg.' + s].inverted()
        P.P['Foot.' + s] = Tm @ Pb.P['Foot.' + s]
    return P


def bracos(P, alvo_L=None, alvo_R=None, pole_L=(-1, 0, -1), pole_R=(1, 0, -1)):
    """os punhos nos alvos (mundo); cotovelos pros polos (direções no mundo)."""
    for s, alvo, pole in (('L', alvo_L, pole_L), ('R', alvo_R, pole_R)):
        if alvo is None:
            continue
        P.ik('UpperArm.' + s, 'LowerArm.' + s, P.w2a(alvo), (P.Mi.to_3x3() @ Vector(pole)).normalized())
    return P


def dedos(P, lado, fecha, polegar=None):
    """DEDOS FECHANDO no que a mão segura (pendência do teste de 2026-11-04: a mão ficava aberta em volta do celular).
    fecha = 0 (como no clipe) a 1 (punho fechado): cada falange dobra em volta do eixo das juntas dos dedos (do
    indicador pro mindinho), pro lado da palma. `polegar` (0 a 1, padrão = fecha * 0,7) dobra o polegar por cima."""
    s = lado
    if f'Index1.{s}' not in P.P:
        return P
    junta = (P.cabeca(f'Pinky1.{s}') - P.cabeca(f'Index1.{s}')).normalized()      # eixo das juntas
    dedo = (P.cabeca(f'Middle2.{s}') - P.cabeca(f'Middle1.{s}')).normalized()     # pra onde o dedo aponta
    palma = junta.cross(dedo).normalized()
    # o sentido de giro que leva a ponta do dedo pra palma
    teste = Matrix.Rotation(0.3, 3, junta) @ dedo
    sinal = 1.0 if teste.dot(palma if s == 'L' else palma) > dedo.dot(palma) else -1.0
    if s == 'R':
        teste_r = Matrix.Rotation(0.3, 3, junta) @ dedo
        sinal = 1.0 if teste_r.dot(-palma) > dedo.dot(-palma) else -1.0
    for d in DEDOS:
        for k in (1, 2, 3):
            n = f'{d}{k}.{s}'
            if n not in P.P:
                continue
            a = P.cabeca(n)
            ang = math.radians(70 if k > 1 else 55) * fecha * sinal
            P.aplica(n, Matrix.Translation(a) @ Matrix.Rotation(ang, 4, junta) @ Matrix.Translation(-a))
    pol = fecha * 0.7 if polegar is None else polegar
    for k in (1, 2):
        n = f'Thumb{k}.{s}'
        if n in P.P:
            a = P.cabeca(n)
            P.aplica(n, Matrix.Translation(a) @ Matrix.Rotation(math.radians(35) * pol * sinal, 4, dedo) @ Matrix.Translation(-a))
    return P


def camada(g, nome, chaves, ossos, interp='LINEAR'):
    """faixa NLA REPLACE no topo do esqueleto: chaves = [(t, Pose, influência)], só nos `ossos` dados (os outros
    continuam no clipe). Entre duas chaves a pose passa em linha reta; a influência também tem chave (0 = o clipe manda)."""
    from bpy_extras import anim_utils
    arm = armadura(g)
    ad = arm.animation_data
    acao_ant, slot_ant = ad.action, ad.action_slot
    act = bpy.data.actions.new(nome)
    ad.action = act
    ossos = [o for o in ossos if o in arm.pose.bones]
    quadros = [K.q(t) for t, _, _ in chaves]
    for osso in ossos:
        pb = arm.pose.bones[osso]
        pb.rotation_mode = 'QUATERNION'
        vals = [P.base(osso) for _, P, _ in chaves]
        qs, ant = [], None
        for _, qv in vals:
            qv = qv.copy()
            if ant is not None and qv.dot(ant) < 0:
                qv.negate()
            qs.append(tuple(qv))
            ant = qv
        for prop, valores in (('location', [tuple(v[0]) for v in vals]), ('rotation_quaternion', qs)):
            setattr(pb, prop, valores[0])
            path = f'pose.bones["{osso}"].{prop}'
            arm.keyframe_insert(data_path=path, frame=quadros[0])
            cb = anim_utils.action_get_channelbag_for_slot(act, ad.action_slot)
            for fc in cb.fcurves:
                if fc.data_path != path:
                    continue
                kp = fc.keyframe_points
                kp.add(len(valores) - 1)
                co = []
                for k, v in enumerate(valores):
                    co += (quadros[k], v[fc.array_index])
                kp.foreach_set('co', co)
                for p in kp:
                    p.interpolation = interp
                fc.update()
    slot = ad.action_slot
    ad.action = acao_ant
    if acao_ant is not None and slot_ant is not None:
        ad.action_slot = slot_ant
    tr = ad.nla_tracks.new()
    tr.name = nome
    st = tr.strips.new(nome, int(quadros[0]), act)
    if hasattr(st, 'action_slot') and slot is not None:
        st.action_slot = slot
    st.blend_type = 'REPLACE'
    st.extrapolation = 'HOLD'
    st.influence = 1.0
    st.use_animated_influence = True
    fc = st.fcurves.find('influence') or st.fcurves.new('influence')
    for f, (_, _, inf) in zip(quadros, chaves):
        fc.keyframe_points.insert(f, inf).interpolation = interp
    return tr


# ================================================================ a cozinha da página (2026-11-04, pipoca)
# A casa da cidadezinha: cozinha à noite, vista em maquete (sem teto). O fogão fica no (0, FOGAO_Y) com a frente pra -Y
# (quem cozinha fica em y < 0 olhando pra +Y). Tudo CC0 do kit3d-assets (Kenney / Quaternius / Kay Lousberg), na paleta.
PALETA.update({
    'piso': ['#E9D8B8', '#C99E6E'], 'parede': '#F2B880', 'azulejo': ['#8FD0CC', '#6FB8B6'],
    'armario': '#D98A4E', 'armario2': '#9E5530', 'tampo': '#F1ECE2', 'metal': '#BFC8D2', 'metal_esc': '#3B3F4A',
    'vidro_noite': '#3D63C9', 'geladeira': '#E9EFF4', 'geladeira2': '#3A3D45',
    'panela': '#3A3542', 'oleo': '#E8A23A', 'fogo': '#FF7A1F', 'fogo2': '#FFC93D', 'fogo_azul': '#4D8CFF',
})
FOGAO_Y = 0.43
ALT_BANCADA = 0.86


def _regra_cozinha(nome):
    n = nome.lower()
    if 'glass' in n:
        return mat_luz(PALETA['vidro_noite'], 1.0)
    if 'carpet' in n or n.startswith('white') or 'default' in n or 'metallight' in n:
        return mat(PALETA['tampo'])
    if 'metaldark' in n or n.startswith('black'):
        return mat(PALETA['metal_esc'])
    if 'metal' in n or 'grey' in n:
        return mat(PALETA['metal'])
    if 'wooddark' in n:
        return mat(PALETA['armario2'])
    if 'wood' in n:
        return mat(PALETA['armario'])
    return mat('#B0A89C')


def cozinha(sc):
    """a cozinha à noite: piso de lajota, parede do fundo com azulejo, bancada (armários Kenney) com o fogão no meio,
    pia, geladeira e a janela azul da noite. Devolve dict com os objetos e o topo do fogão medido."""
    import bmesh
    c = {'objs': []}
    bm = bmesh.new()
    lj = 0.40
    for i in range(-10, 10):
        for j in range(-12, 3):
            vs = [bm.verts.new((x * lj, y * lj, 0.0)) for x, y in ((i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1))]
            f = bm.faces.new(vs)
            f.material_index = (i + j) % 2
    me = bpy.data.meshes.new('piso')
    bm.to_mesh(me)
    bm.free()
    me.materials.append(mat(PALETA['piso'][0]))
    me.materials.append(mat(PALETA['piso'][1]))
    piso = bpy.data.objects.new('piso', me)
    sc.collection.objects.link(piso)
    c['piso'] = piso

    def bloco(nome, dims, loc, cor):
        o = K.bloco(nome, dims, loc, '#000000')
        o.data.materials.clear()
        o.data.materials.append(mat(cor))
        chapado(o.data)
        c['objs'].append(o)
        return o
    c['parede'] = bloco('parede_fundo', (8.0, 0.12, 2.7), (0.0, 1.0, 1.35), PALETA['parede'])
    c['parede_lado'] = bloco('parede_lado', (0.12, 4.6, 2.69), (3.3, -1.36, 1.345), PALETA['parede'])
    c['azulejos'] = []
    for k in range(-9, 8):          # faixa de azulejo atrás da bancada: placas de 30 x 20 cm, 1 cm na frente da parede
        if -2.2 < k * 0.30 + 0.15 < -1.05:
            continue                 # a janela fica aqui
        for z in range(3):
            c['azulejos'].append(bloco(f'azulejo{k}_{z}', (0.28, 0.02, 0.18), (k * 0.30 + 0.15, 0.93, 0.98 + z * 0.20),
                                       PALETA['azulejo'][(k + z) % 2]))
    esc_pecas = [('kitchen/kitchen-cabinet-drawer-rGZG7vK3fd.glb', -0.82), ('kitchen/kitchen-sink-nNGtcp9qK2.glb', -1.64),
                 ('kitchen/kitchen-cabinet-tWyOLYYHPw.glb', -2.46), ('kitchen/kitchen-stove-kTJU2y4R15.glb', 0.0),
                 ('kitchen/kitchen-cabinet-drawer-rGZG7vK3fd.glb', 0.82), ('kitchen/kitchen-cabinet-tWyOLYYHPw.glb', 1.64)]
    cache = {}
    for arq, x in esc_pecas:
        if arq not in cache:
            cache[arq] = molde(arq, ALT_BANCADA, razao=1.0, regra=_regra_cozinha)
        objs = [juntar(copia(cache[arq], Path(arq).stem.split('-')[1] + f'_{x:+.2f}', (x * 1.03, FOGAO_Y, 0.0), 0.0))]
        c['objs'] += objs
        if 'stove' in arq:
            c['fogao'] = objs
    gel = molde('kitchen/kitchen-fridge-8sjRm8fnHh.glb', 1.85, razao=1.0,
                regra=lambda n: mat(PALETA['geladeira2'] if 'black' in n else PALETA['geladeira']))
    c['geladeira'] = [juntar(copia(gel, 'geladeira', (2.62, 0.52, 0.0), 0.0))]
    c['objs'] += c['geladeira']
    jan = molde('window/window-small-n88WAcjzTv.glb', 1.0, razao=1.0, regra=_regra_cozinha)
    c['janela'] = [juntar(copia(jan, 'janela', (-1.64, 0.88, 1.10), 0.0))]
    c['objs'] += c['janela']
    bpy.context.view_layer.update()
    contorno(c['objs'], 0.008)
    dg = bpy.context.evaluated_depsgraph_get()
    hit, pt, *_ = sc.ray_cast(dg, Vector((0.0, FOGAO_Y, 3.0)), Vector((0, 0, -1)))
    c['topo_fogao'] = pt.z if hit else ALT_BANCADA
    return c


def juntar(objs):
    """as cópias de um molde (uma malha por cor) viram UM objeto com vários materiais: as faces coladas de dentro do
    próprio modelo (Kenney) deixam de ser 'duas peças no mesmo plano'."""
    import bmesh
    o0 = objs[0]
    bm = bmesh.new()
    mats = []
    for o in objs:
        me = o.data.copy()
        me.transform(o.matrix_basis)
        base = len(mats)
        mats += list(me.materials)
        for p in me.polygons:
            p.material_index += base
        bm.from_mesh(me)
        bpy.data.meshes.remove(me)
    me = bpy.data.meshes.new(o0.name.rsplit('_', 1)[0])
    bm.to_mesh(me)
    bm.free()
    for m in mats:
        me.materials.append(m)
    chapado(me)
    o = bpy.data.objects.new(me.name, me)
    bpy.context.scene.collection.objects.link(o)
    for x in objs:
        bpy.data.objects.remove(x, do_unlink=True)
    return o


def panela(nome, loc, diametro=0.24, altura=0.12):
    """a panela de ferro (Kay Lousberg, CC0), na paleta. loc = o meio do fundo. Reescala pelo corpo (a maior medida do
    glb inclui o cabo) e estica a altura até `altura`. Devolve os objetos."""
    ms = molde('pan/pan-2ShlDi3R6e.glb', diametro, 'maior', razao=1.0, regra=lambda n: mat(PALETA['panela']))
    objs = copia(ms, nome, (0, 0, 0), 0.0)
    bpy.context.view_layer.update()
    xs = [(o.matrix_world @ v.co).x for o in objs for v in o.data.vertices]
    ys = [(o.matrix_world @ v.co).y for o in objs for v in o.data.vertices]
    zs = [(o.matrix_world @ v.co).z for o in objs for v in o.data.vertices]
    k = diametro / max(1e-6, max(xs) - min(xs))
    kz = altura / max(1e-6, (max(zs) - min(zs)) * k)
    cx = (max(xs) + min(xs)) / 2
    cy = max(ys) - (max(xs) - min(xs)) / 2         # o meio do CORPO (o cabo fica pro -Y, fora da conta)
    for o in objs:
        o.scale = (k, k, k * kz)
        o.location = (loc[0] - cx * k, loc[1] - cy * k, loc[2] - min(zs) * k * kz)
    bpy.context.view_layer.update()
    contorno(objs, 0.003)
    return objs


def fogo(nome, loc, raio=0.07, n=12):
    """a chama da boca do fogão: anel de línguas azuis e laranja (luz própria). Efeito sem corpo."""
    import bmesh
    g = K.grupo(nome, tuple(loc))
    linguas = []
    for k in range(n):
        a = 2 * math.pi * k / n
        bm = bmesh.new()
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=True, segments=5, radius1=0.012, radius2=0.0, depth=0.035)
        me = bpy.data.meshes.new(f'{nome}_{k}')
        bm.to_mesh(me)
        bm.free()
        me.materials.append(mat_luz(PALETA['fogo_azul'] if k % 2 else PALETA['fogo'], 1.2))
        o = bpy.data.objects.new(f'{nome}_{k}', me)
        bpy.context.scene.collection.objects.link(o)
        o.parent = g
        o.location = (raio * math.cos(a), raio * math.sin(a), 0.017)
        linguas.append(o)
    K.sem_corpo(g)
    return g, linguas


# ================================================================ o portão do motor novo
def rodar(pasta, cena_py, eventos=None):
    """K.rodar ligado ao estilo novo (pendência do teste de 2026-11-04, que renderizou por fora): a prévia sai no
    próprio look (toon, 4 amostras, 40%) em vez das 16 amostras do kit3d, e o render passa pelo mesmo portão
    (checagem LIMPA com SELO desta versão da cena + kit da página). Todos os quadros, 30 qps."""
    import hashlib
    selo_kit3d = K._selo
    if not getattr(selo_kit3d, '_com_kit_da_pagina', False):
        def selo(c):
            h = hashlib.sha1(selo_kit3d(c).encode())
            h.update(Path(__file__).read_bytes())       # o selo também cobre este kit: mexeu no kit, checa de novo
            return h.hexdigest()[:16]
        selo._com_kit_da_pagina = True
        K._selo = selo
    K.rodar(pasta, cena_py, eventos=eventos, amostras_previa=4, pct_previa=40)
