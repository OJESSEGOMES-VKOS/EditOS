# Blender 5.2 | status: nomes de propriedade confirmados por sonda no bpy 5.2.2; os 9 rigs, cartoes, bandeiras, transluz, light linking, nevoa e animacao testados no bpy 5.2.2 Cycles CPU (nuvem); mundo_hdri_reflexo a testar
# fonte: capitulo /home/claude/base/05-luz.md | manual https://docs.blender.org/manual/en/latest/render/lights/light_object.html
#
# Biblioteca de rigs de luz para produto. Convencao de angulos:
#   azimute 0 = do lado da camera (frente do produto), 90 = direita do quadro,
#   180 = atras do produto, 270 (ou -90) = esquerda do quadro.
#   elevacao 0 = altura do centro do produto, 90 = em cima.
# Distancias em metros, energia em W (normalize=True, padrao), temperatura em K.
# A camera deve olhar para +Y (fica em -Y). Todas as funcoes recebem `alvo` (Vector) e `escala`
# (altura do produto em m; 0.12 frasco, 0.15 celular, 0.30 notebook).

import math
import bpy
from mathutils import Vector


# ---------------------------------------------------------------- utilidades

def pos_orbital(alvo, az_graus, el_graus, dist):
    """Posicao em volta do alvo. Camera em -Y; az 90 = +X (direita do quadro)."""
    az, el = math.radians(az_graus), math.radians(el_graus)
    d = Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))
    return alvo + d * dist


def mirar(obj, alvo):
    """Aponta o eixo -Z do objeto (frente da luz/plano) para o alvo."""
    direcao = (alvo - obj.location).normalized()
    obj.rotation_euler = direcao.to_track_quat('-Z', 'Y').to_euler()


def colecao(nome):
    col = bpy.data.collections.get(nome) or bpy.data.collections.new(nome)
    if col.name not in bpy.context.scene.collection.children:
        bpy.context.scene.collection.children.link(col)
    return col


def luz_area(nome, alvo, az, el, dist, energia, tamanho, tamanho_y=None,
             forma='RECTANGLE', kelvin=5600, spread_graus=180.0,
             ver_camera=False, col='LUZES'):
    """Luz de area mirada no alvo. Propriedades confirmadas por sonda no bpy 5.2.2:
    shape (SQUARE, RECTANGLE, DISK, ELLIPSE), size, size_y, spread (radianos, padrao pi),
    energy, use_temperature, temperature, normalize, exposure."""
    dado = bpy.data.lights.new(nome, 'AREA')
    dado.shape = forma
    dado.size = tamanho
    dado.size_y = tamanho_y if tamanho_y else tamanho
    dado.energy = energia * FATOR_ENERGIA
    dado.use_temperature = True
    dado.temperature = kelvin
    dado.spread = math.radians(spread_graus)
    ob = bpy.data.objects.new(nome, dado)
    colecao(col).objects.link(ob)
    ob.location = pos_orbital(alvo, az, el, dist)
    mirar(ob, alvo)
    ob.visible_camera = ver_camera  # a forma da luz aparece em reflexos, nao no quadro direto
    return ob


def luz_spot(nome, alvo, az, el, dist, energia, raio=0.01, abertura_graus=30,
             suavidade=0.15, kelvin=5600, col='LUZES'):
    dado = bpy.data.lights.new(nome, 'SPOT')
    dado.energy = energia * FATOR_ENERGIA
    dado.shadow_soft_size = raio
    dado.spot_size = math.radians(abertura_graus)
    dado.spot_blend = suavidade
    dado.use_temperature = True
    dado.temperature = kelvin
    ob = bpy.data.objects.new(nome, dado)
    colecao(col).objects.link(ob)
    ob.location = pos_orbital(alvo, az, el, dist)
    mirar(ob, alvo)
    return ob


def material_emissivo(nome, cor=(1, 1, 1), forca=1.0, gradiente=False, modo='X'):
    """Emissao pura. Com gradiente=True a forca cai de 100% no centro a 0% na borda.
    modo='X': degrade so na largura (cartao em faixa, igual strip box com difusor).
    modo='RADIAL': degrade circular (softbox redonda / brilho de transluz).
    Coordenadas Object do plano padrao vao de -0,5 a 0,5, por isso From Max = 0,5."""
    m = bpy.data.materials.new(nome)
    if m.node_tree is None:
        m.use_nodes = True  # DeprecationWarning no 5.2, ainda funciona
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    em = nt.nodes.new('ShaderNodeEmission')
    em.inputs['Color'].default_value = (*cor, 1)
    em.inputs['Strength'].default_value = forca
    nt.links.new(em.outputs['Emission'], out.inputs['Surface'])
    if gradiente:
        tc = nt.nodes.new('ShaderNodeTexCoord')
        if modo == 'RADIAL':
            dist = nt.nodes.new('ShaderNodeVectorMath'); dist.operation = 'LENGTH'
            nt.links.new(tc.outputs['Object'], dist.inputs[0])
            sinal = dist.outputs['Value']
        else:
            sep = nt.nodes.new('ShaderNodeSeparateXYZ')
            ab = nt.nodes.new('ShaderNodeMath'); ab.operation = 'ABSOLUTE'
            nt.links.new(tc.outputs['Object'], sep.inputs[0])
            nt.links.new(sep.outputs['X'], ab.inputs[0])
            sinal = ab.outputs[0]
        mr = nt.nodes.new('ShaderNodeMapRange')  # 0..0,5 vira 1..0 (com clamp)
        mr.inputs['From Min'].default_value = 0.0
        mr.inputs['From Max'].default_value = 0.5
        mr.inputs['To Min'].default_value = 1.0
        mr.inputs['To Max'].default_value = 0.0
        curva = nt.nodes.new('ShaderNodeMath'); curva.operation = 'POWER'
        curva.inputs[1].default_value = 1.5
        mult = nt.nodes.new('ShaderNodeMath'); mult.operation = 'MULTIPLY'
        mult.inputs[1].default_value = forca
        nt.links.new(sinal, mr.inputs['Value'])
        nt.links.new(mr.outputs['Result'], curva.inputs[0])
        nt.links.new(curva.outputs[0], mult.inputs[0])
        nt.links.new(mult.outputs[0], em.inputs['Strength'])
    return m


def material_preto(nome='BandeiraPreta'):
    m = bpy.data.materials.new(nome)
    if m.node_tree is None:
        m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (0.002, 0.002, 0.002, 1)
    p.inputs['Roughness'].default_value = 1.0
    p.inputs['Specular IOR Level'].default_value = 0.0
    return m


def plano(nome, alvo, az, el, dist, larg, alt, material, col='CARTOES'):
    """Plano de larg x alt metros, de frente para o alvo, invisivel para a camera
    (visible_camera=False) mas visivel em reflexo (visible_glossy) e refracao."""
    bpy.ops.mesh.primitive_plane_add(size=1)
    ob = bpy.context.active_object
    ob.name = nome
    ob.scale = (larg, alt, 1)
    for c in ob.users_collection:
        c.objects.unlink(ob)
    colecao(col).objects.link(ob)
    ob.location = pos_orbital(alvo, az, el, dist)
    mirar(ob, alvo)
    ob.data.materials.append(material)
    ob.visible_camera = False
    ob.visible_shadow = False   # cartao nao projeta sombra no produto
    return ob


# ---------------------------------------------------------------- tabela de escala
# fator k: multiplica distancias e tamanhos; energia cresce com k^2 (lei do inverso do quadrado)
# multiplicador global de energia (calibracao: o primeiro chute costuma estourar)
FATOR_ENERGIA = 1.0  # os valores abaixo ja estao calibrados (chute inicial x 0,35)

ESCALAS = {'frasco': 0.12, 'celular': 0.15, 'notebook': 0.30}


def _k(escala):
    return escala / 0.12


# ---------------------------------------------------------------- RIG 1: tres pontos de produto

def rig_tres_pontos(alvo, escala=0.12, kelvin_chave=5200):
    """Chave 45 graus/30 graus, preenchimento oposto 4:1, contorno 150 graus mais frio.
    Valores [testado no bpy 5.2.2 Cycles CPU, nuvem] para frasco 12 cm."""
    k = _k(escala)
    chave = luz_area('Chave', alvo, -45, 30, 0.60 * k, 6.3 * k * k, 0.40 * k, 0.55 * k,
                     kelvin=kelvin_chave, spread_graus=70)
    preench = luz_area('Preenchimento', alvo, 60, 10, 0.80 * k, 2.8 * k * k, 0.60 * k, 0.60 * k,
                       kelvin=kelvin_chave + 300, spread_graus=120)
    contorno = luz_area('Contorno', alvo, 150, 25, 0.55 * k, 8.75 * k * k, 0.08 * k, 0.60 * k,
                        kelvin=kelvin_chave + 1300, spread_graus=60)
    return chave, preench, contorno


# ---------------------------------------------------------------- RIG 2: softbox de cima

def rig_top_light(alvo, escala=0.12, kelvin=5600):
    k = _k(escala)
    topo = luz_area('Topo', alvo, 0, 85, 0.55 * k, 10.5 * k * k, 0.60 * k, 0.60 * k,
                    kelvin=kelvin, spread_graus=75)
    frente = luz_area('FrenteBaixa', alvo, 0, 5, 1.0 * k, 1.05 * k * k, 0.50 * k, 0.30 * k,
                      kelvin=kelvin, spread_graus=120)
    return topo, frente


# ---------------------------------------------------------------- RIG 3: contorno duplo (dual rim / kicker)

def rig_contorno_duplo(alvo, escala=0.12, kelvin=7000):
    k = _k(escala)
    esq = luz_area('RimEsq', alvo, -140, 20, 0.50 * k, 7.7 * k * k, 0.06 * k, 0.60 * k,
                   kelvin=kelvin, spread_graus=50)
    dir_ = luz_area('RimDir', alvo, 140, 20, 0.50 * k, 7.7 * k * k, 0.06 * k, 0.60 * k,
                    kelvin=kelvin, spread_graus=50)
    return esq, dir_


# ---------------------------------------------------------------- RIG 4: fundo em gradiente

def rig_fundo_gradiente(alvo, escala=0.12, cor_kelvin=4500, dist_fundo=None):
    """Luz de area mirada no fundo, atras do produto, de baixo para cima: o fundo
    fica claro atras do produto e escurece nas bordas (vinheta natural)."""
    k = _k(escala)
    dist_fundo = dist_fundo or 0.45 * k
    ponto_fundo = alvo + Vector((0, dist_fundo, 0))
    dado = bpy.data.lights.new('LuzFundo', 'AREA')
    dado.shape = 'DISK'; dado.size = 0.25 * k
    dado.energy = 2.1 * k * k * FATOR_ENERGIA
    dado.use_temperature = True; dado.temperature = cor_kelvin
    dado.spread = math.radians(90)
    ob = bpy.data.objects.new('LuzFundo', dado)
    colecao('LUZES').objects.link(ob)
    ob.location = alvo + Vector((0, dist_fundo * 0.55, -escala * 0.45))  # escondida atras do produto
    mirar(ob, ponto_fundo + Vector((0, 0, escala * 0.6)))
    ob.visible_camera = False
    return ob


# ---------------------------------------------------------------- RIG 5: estudio infinito (cyc)

def fundo_infinito(alvo, escala=0.12, cor=(0.18, 0.18, 0.19), raio_curva=None):
    """Chao + parede com curva (sem quina). Fundo afastado 1,2 a 1,4x... aqui medido
    em multiplos da escala: parede a ~3,5x a altura do produto."""
    k = _k(escala)
    raio_curva = raio_curva or 0.15 * k
    larg, prof, alt = 2.0 * k, 0.45 * k, 0.9 * k
    verts, faces = [], []
    perfil = [(-0.5 * k, 0)]
    perfil.append((prof - raio_curva, 0))
    for i in range(1, 9):
        a = math.radians(90 * i / 8)
        perfil.append((prof - raio_curva + math.sin(a) * raio_curva, raio_curva - math.cos(a) * raio_curva))
    perfil.append((prof, alt))
    for y, z in perfil:
        verts.append((-larg / 2, y, z)); verts.append((larg / 2, y, z))
    for i in range(len(perfil) - 1):
        a = i * 2
        faces.append((a, a + 1, a + 3, a + 2))
    me = bpy.data.meshes.new('Cyc'); me.from_pydata(verts, [], faces); me.update()
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new('FundoInfinito', me)
    colecao('CENARIO').objects.link(ob)
    ob.location = Vector((alvo.x, alvo.y, alvo.z - escala / 2))
    m = bpy.data.materials.new('Cyc')
    if m.node_tree is None:
        m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*cor, 1)
    p.inputs['Roughness'].default_value = 0.6
    me.materials.append(m)
    return ob


def rig_cyc(alvo, escala=0.12, kelvin=5600):
    k = _k(escala)
    teto = luz_area('CycTeto', alvo, 0, 70, 0.9 * k, 14 * k * k, 1.2 * k, 0.6 * k,
                    kelvin=kelvin, spread_graus=100)
    lat = luz_area('CycLateral', alvo, -60, 25, 0.8 * k, 4.9 * k * k, 0.6 * k, 0.8 * k,
                   kelvin=kelvin - 400, spread_graus=75)
    return teto, lat


# ---------------------------------------------------------------- RIG 6: luz dura dramatica

def rig_luz_dura(alvo, escala=0.12, kelvin=4300):
    k = _k(escala)
    dura = luz_spot('Dura', alvo, -70, 35, 1.2 * k, 120 * k * k, raio=0.005 * k,
                    abertura_graus=25, suavidade=0.25, kelvin=kelvin)
    rim = luz_area('DuraRim', alvo, 160, 15, 0.6 * k, 3.5 * k * k, 0.05 * k, 0.5 * k,
                   kelvin=kelvin + 2200, spread_graus=40)
    return dura, rim


# ---------------------------------------------------------------- RIG 7: janela com persiana (gobo)

def rig_janela(alvo, escala=0.12, kelvin_sol=4800, kelvin_ceu=8000, lamelas=8):
    """Sol duro + grade de lamelas (persiana) entre o sol e o produto, gerando faixas.
    Uma area azulada de ceu entra pelo outro lado como preenchimento."""
    k = _k(escala)
    sol_d = bpy.data.lights.new('Sol', 'SUN')
    sol_d.energy = 4.0
    sol_d.angle = math.radians(1.5)
    sol_d.use_temperature = True; sol_d.temperature = kelvin_sol
    sol = bpy.data.objects.new('Sol', sol_d)
    colecao('LUZES').objects.link(sol)
    sol.location = pos_orbital(alvo, -60, 35, 2.0 * k)
    mirar(sol, alvo)
    # persiana: lamelas paralelas a 0,35 m do produto, no caminho do sol
    centro = pos_orbital(alvo, -60, 35, 0.35 * k)
    preto = material_preto('Persiana')
    passo = 0.035 * k
    for i in range(lamelas):
        bpy.ops.mesh.primitive_cube_add(size=1)
        lam = bpy.context.active_object
        lam.name = f'Lamela{i}'
        lam.scale = (0.5 * k, 0.003 * k, passo * 0.5)
        lam.location = centro + Vector((0, 0, (i - lamelas / 2) * passo))
        mirar(lam, alvo)
        lam.data.materials.append(preto)
        lam.visible_camera = False
        for c in lam.users_collection:
            c.objects.unlink(lam)
        colecao('GOBO').objects.link(lam)
    ceu = luz_area('Ceu', alvo, 70, 20, 0.9 * k, 2.1 * k * k, 0.8 * k, 0.8 * k,
                   kelvin=kelvin_ceu, spread_graus=150)
    return sol, ceu


# ---------------------------------------------------------------- RIG 8: neon

def rig_neon(alvo, escala=0.12, cor_a=(1.0, 0.05, 0.45), cor_b=(0.05, 0.4, 1.0)):
    """Dois tubos emissivos visiveis no quadro + duas areas coloridas que fazem
    o trabalho real de iluminar (o tubo sozinho ilumina pouco e com ruido)."""
    k = _k(escala)
    for nome, cor, az in (('NeonA', cor_a, -120), ('NeonB', cor_b, 120)):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.004 * k, depth=0.5 * k, vertices=16)
        t = bpy.context.active_object
        t.name = nome
        t.location = pos_orbital(alvo, az, 5, 0.35 * k)
        t.data.materials.append(material_emissivo(nome + 'Mat', cor, 8.0))
        for c in t.users_collection:
            c.objects.unlink(t)
        colecao('NEON').objects.link(t)
        a = luz_area(nome + 'Luz', alvo, az, 5, 0.33 * k, 4.2 * k * k, 0.02 * k, 0.5 * k,
                     spread_graus=120)
        a.data.use_temperature = False
        a.data.color = cor
    return True


# ---------------------------------------------------------------- RIG 9: faixas (strip lights)

def rig_faixas(alvo, escala=0.12, kelvin=6000):
    """Duas faixas altas e finas atras-lateral (az +-110) fazem duas linhas brancas
    verticais nas bordas de cilindros brilhantes; uma faixa frontal estreita desenha o
    'brilho de assinatura' no meio do corpo."""
    k = _k(escala)
    e = luz_area('FaixaEsq', alvo, -110, 5, 0.40 * k, 4.2 * k * k, 0.04 * k, 0.70 * k,
                 kelvin=kelvin, spread_graus=60)
    d = luz_area('FaixaDir', alvo, 110, 5, 0.40 * k, 4.2 * k * k, 0.04 * k, 0.70 * k,
                 kelvin=kelvin, spread_graus=60)
    f = luz_area('FaixaFrente', alvo, -25, 10, 0.70 * k, 1.4 * k * k, 0.03 * k, 0.70 * k,
                 kelvin=kelvin, spread_graus=60)
    return e, d, f


# ---------------------------------------------------------------- cartoes de reflexo e bandeiras

def cartoes_reflexo(alvo, escala=0.12, forca=12.0, gradiente=True):
    """Dois cartoes brancos (emissivos com degrade) nas laterais traseiras: viram as
    linhas de brilho das bordas no vidro/metal. Invisiveis para a camera."""
    k = _k(escala)
    mat = material_emissivo('CartaoMat', (1, 1, 1), forca, gradiente=gradiente)
    a = plano('CartaoEsq', alvo, -100, 5, 0.30 * k, 0.10 * k, 0.60 * k, mat)
    b = plano('CartaoDir', alvo, 100, 5, 0.30 * k, 0.10 * k, 0.60 * k, mat)
    return a, b


def bandeiras_pretas(alvo, escala=0.12, az=(-55, 55), dist=0.28):
    """Negative fill: planos pretos que viram faixas escuras no vidro e definem a borda."""
    k = _k(escala)
    preto = material_preto()
    return [plano(f'Bandeira{i}', alvo, a, 5, dist * k, 0.12 * k, 0.60 * k, preto, col='BANDEIRAS')
            for i, a in enumerate(az)]


# ---------------------------------------------------------------- HDRI so para reflexo

def mundo_hdri_reflexo(caminho_hdri, forca_reflexo=0.6, forca_luz=0.15, rot_graus=0,
                        cor_fundo=(0.02, 0.02, 0.022)):
    """World com HDRI, mas: camera ve cor solida escura; raios de brilho (glossy)
    veem o HDRI forte; difuso recebe pouco. Light Path: saidas confirmadas por sonda."""
    w = bpy.context.scene.world or bpy.data.worlds.new('World')
    bpy.context.scene.world = w
    if w.node_tree is None:
        w.use_nodes = True
    nt = w.node_tree; nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputWorld')
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Rotation'].default_value[2] = math.radians(rot_graus)
    env = nt.nodes.new('ShaderNodeTexEnvironment')
    env.image = bpy.data.images.load(caminho_hdri, check_existing=True)
    lp = nt.nodes.new('ShaderNodeLightPath')
    bg_hdri_luz = nt.nodes.new('ShaderNodeBackground'); bg_hdri_luz.inputs['Strength'].default_value = forca_luz
    bg_hdri_ref = nt.nodes.new('ShaderNodeBackground'); bg_hdri_ref.inputs['Strength'].default_value = forca_reflexo
    bg_cam = nt.nodes.new('ShaderNodeBackground'); bg_cam.inputs['Color'].default_value = (*cor_fundo, 1)
    mix_ref = nt.nodes.new('ShaderNodeMixShader')
    mix_cam = nt.nodes.new('ShaderNodeMixShader')
    L = nt.links.new
    L(tc.outputs['Generated'], mp.inputs['Vector']); L(mp.outputs['Vector'], env.inputs['Vector'])
    L(env.outputs['Color'], bg_hdri_luz.inputs['Color']); L(env.outputs['Color'], bg_hdri_ref.inputs['Color'])
    L(lp.outputs['Is Glossy Ray'], mix_ref.inputs['Fac'])
    L(bg_hdri_luz.outputs[0], mix_ref.inputs[1]); L(bg_hdri_ref.outputs[0], mix_ref.inputs[2])
    L(lp.outputs['Is Camera Ray'], mix_cam.inputs['Fac'])
    L(mix_ref.outputs[0], mix_cam.inputs[1]); L(bg_cam.outputs[0], mix_cam.inputs[2])
    L(mix_cam.outputs[0], out.inputs['Surface'])
    return w


def mundo_visibilidade_cycles(camera=True, difuso=True, brilho=True, transmissao=True):
    """Alternativa sem nos: World > Ray Visibility (Cycles). Confirmado por sonda:
    world.cycles_visibility.camera / diffuse / glossy / transmission / scatter."""
    v = bpy.context.scene.world.cycles_visibility
    v.camera, v.diffuse, v.glossy, v.transmission = camera, difuso, brilho, transmissao


# ---------------------------------------------------------------- light linking

def contorno_so_no_produto(luz_obj, objetos_produto, nome='SoProduto'):
    """Light linking (Cycles 4.0+, EEVEE 4.3+): a luz so ilumina a colecao receptora.
    Propriedades confirmadas por sonda: obj.light_linking.receiver_collection / blocker_collection."""
    col = bpy.data.collections.get(nome) or bpy.data.collections.new(nome)
    for o in objetos_produto:
        if o.name not in col.objects:
            col.objects.link(o)  # colecao sem link na cena: so serve de lista
    luz_obj.light_linking.receiver_collection = col
    return col


def sombra_sem_bloqueio(luz_obj, objetos_que_nao_bloqueiam, nome='NaoBloqueia'):
    """Shadow linking: so os objetos da colecao bloqueadora projetam sombra dessa luz.
    Para EXCLUIR objetos, inverta o estado do item na colecao (link_state 'EXCLUDE')."""
    col = bpy.data.collections.get(nome) or bpy.data.collections.new(nome)
    for o in objetos_que_nao_bloqueiam:
        if o.name not in col.objects:
            col.objects.link(o)
    luz_obj.light_linking.blocker_collection = col
    return col


# ---------------------------------------------------------------- volumetrico

def nevoa_no_cubo(alvo, escala=0.12, densidade=0.3, anisotropia=0.6, tamanho=None):
    """Cubo com Principled Volume (mais barato e controlado que no World).
    Entradas confirmadas por sonda: Density, Anisotropy, Color."""
    k = _k(escala)
    tamanho = tamanho or 2.0 * k
    bpy.ops.mesh.primitive_cube_add(size=tamanho, location=alvo)
    cubo = bpy.context.active_object; cubo.name = 'Nevoa'
    m = bpy.data.materials.new('NevoaMat')
    if m.node_tree is None:
        m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    v = nt.nodes.new('ShaderNodeVolumePrincipled')
    v.inputs['Density'].default_value = densidade
    v.inputs['Anisotropy'].default_value = anisotropia
    nt.links.new(v.outputs[0], out.inputs['Volume'])
    cubo.data.materials.append(m)
    # densidade e por metro: um cubo de 0,24 m com 0,03 quase nao aparece.
    # Em cena de mesa (0,2 a 0,5 m de profundidade) comece em 0,3 a 1,0 [testar no Blender].
    return cubo


def eevee_volumetrico(cena, tile=8, amostras=64, sombras=True, distribuicao=0.8):
    """Nomes confirmados por sonda no 5.2.2: volumetric_tile_size, volumetric_samples,
    use_volumetric_shadows, volumetric_sample_distribution, volumetric_start/end."""
    e = cena.eevee
    e.volumetric_tile_size = str(tile)
    e.volumetric_samples = amostras
    e.use_volumetric_shadows = sombras
    e.volumetric_sample_distribution = distribuicao


# ---------------------------------------------------------------- luz contando a historia

def chave(dado, prop, quadro, valor, interp='BEZIER'):
    setattr(dado, prop, valor)
    dado.keyframe_insert(data_path=prop, frame=quadro)


def acender_na_revelacao(luz_chave, luz_contorno, q_inicio=1, q_revela=45, q_fim=90):
    """30 fps: 0 a 1,5 s produto no escuro so com contorno; em 15 quadros a chave
    sobe de 5% para 100% e esfria de 3200 K para 5200 K."""
    L, R = luz_chave.data, luz_contorno.data
    e_chave, e_rim = L.energy, R.energy
    chave(L, 'energy', q_inicio, e_chave * 0.05)
    chave(L, 'energy', q_revela, e_chave * 0.05)
    chave(L, 'energy', q_revela + 15, e_chave)
    chave(L, 'temperature', q_revela, 3200)
    chave(L, 'temperature', q_revela + 15, 5200)
    chave(R, 'energy', q_inicio, e_rim * 1.4)
    chave(R, 'energy', q_revela + 15, e_rim)
    chave(R, 'energy', q_fim, e_rim)


def cartao_transluz(alvo, escala=0.12, forca=3.0, kelvin_cor=(1.0, 0.92, 0.80)):
    """Cartao emissivo atras do produto (az 180), invisivel para a camera: e o que o
    vidro e o liquido refratam. Sem ele, liquido em fundo escuro vira mancha preta.
    [testado no bpy 5.2.2 Cycles CPU, nuvem]"""
    k = _k(escala)
    mat = material_emissivo('TransluzMat', kelvin_cor, forca, gradiente=True, modo='RADIAL')
    c = plano('CartaoTransluz', alvo, 180, 0, 0.35 * k, 0.55 * k, 0.55 * k, mat)
    c.visible_diffuse = False   # nao acende o chao atras: so aparece atraves do vidro
    return c
