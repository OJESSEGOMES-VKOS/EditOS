"""Luz: rigs de estúdio com nome, cartões de reflexo, mundo em gradiente e HDRI.

Valores calibrados em escala real (produto a ~0,5-1 m da luz), AgX, exposição 0.
A regra de ouro: luz tem DIREÇÃO e CONTRASTE. Chave 3 a 4x o preenchimento; contorno separa o
produto do fundo; temperatura da chave e do contorno diferentes (quente x frio) dá volume.
"""
import math

import bpy
from mathutils import Vector

from .nucleo import hex_emissao, ligar, mira


def area(nome, loc, alvo, energia=100.0, tamanho=0.6, tamanho_y=None, temperatura=5600, cor=None,
         forma=None, espalhamento=None, sombra_suave=True):
    """luz de área (softbox). energia em W. forma: SQUARE, RECTANGLE, DISK, ELLIPSE.
    espalhamento (graus) < 180 vira grade/colmeia: luz mais dirigida, menos derramamento."""
    ld = bpy.data.lights.new(nome, 'AREA')
    ld.energy = energia
    if tamanho_y is not None:
        ld.shape = forma or 'RECTANGLE'
        ld.size, ld.size_y = tamanho, tamanho_y
    else:
        ld.shape = forma or 'SQUARE'
        ld.size = tamanho
    if cor is not None:
        ld.color = hex_emissao(cor)[:3]
    else:
        ld.use_temperature = True
        ld.temperature = temperatura
    if espalhamento is not None:
        ld.spread = math.radians(espalhamento)
    o = ligar(bpy.data.objects.new(nome, ld))
    o.location = loc
    mira(o, alvo)
    return o


def ponto_esferico(alvo, distancia, azimute, elevacao):
    """posição em volta do alvo. azimute 0 = frente (lado da câmera, -Y), 90 = direita."""
    az, el = math.radians(azimute), math.radians(elevacao)
    a = Vector(alvo)
    return tuple(a + Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el))) * distancia)


def rig(nome, alvo=(0, 0, 0), escala=1.0, forca=1.0, quente=4800, frio=7000, **kw):
    """rigs nomeados. escala = distância relativa (1 = produto de ~15-30 cm). forca multiplica tudo."""
    d = escala
    # inverso do quadrado: mais longe, mais forte. 0,15 calibrado por varredura de exposição
    # (laboratorio/calibracao.md): com AgX e exposição 0, o produto fica na faixa certa.
    W = 0.15 * forca * escala ** 2
    L = {}
    if nome == 'produto':  # os três pontos de produto + topo
        L['chave'] = area('chave', ponto_esferico(alvo, 0.9 * d, -45, 30), alvo, 120 * W, 0.8 * d, temperatura=quente, espalhamento=70)
        L['preench'] = area('preench', ponto_esferico(alvo, 1.1 * d, 60, 10), alvo, 30 * W, 1.0 * d, temperatura=5600)
        L['contorno_e'] = area('contorno_e', ponto_esferico(alvo, 0.8 * d, -150, 20), alvo, 160 * W, 0.15 * d, 1.0 * d, temperatura=frio)
        L['contorno_d'] = area('contorno_d', ponto_esferico(alvo, 0.8 * d, 150, 20), alvo, 140 * W, 0.15 * d, 1.0 * d, temperatura=frio)
        L['topo'] = area('topo', ponto_esferico(alvo, 1.0 * d, 0, 85), alvo, 25 * W, 1.2 * d, temperatura=5600, espalhamento=45)
    elif nome == 'softbox_topo':  # luz de cima grande e macia: cosmético, comida, clay
        L['topo'] = area('topo', ponto_esferico(alvo, 0.9 * d, -25, 65), alvo, 200 * W, 1.2 * d, temperatura=5200, espalhamento=60)
        L['rebate'] = area('rebate', ponto_esferico(alvo, 1.0 * d, 40, 5), alvo, 8 * W, 1.0 * d, temperatura=5600)
        L['contorno'] = area('contorno', ponto_esferico(alvo, 0.9 * d, 170, 25), alvo, 90 * W, 0.2 * d, 1.0 * d, temperatura=frio)
    elif nome == 'contorno_duplo':  # luxo escuro: só os contornos desenham o objeto
        L['contorno_e'] = area('contorno_e', ponto_esferico(alvo, 0.7 * d, -120, 10), alvo, 220 * W, 0.06 * d, 1.4 * d, temperatura=kw.get('t_contorno', 3800), espalhamento=40)
        L['contorno_d'] = area('contorno_d', ponto_esferico(alvo, 0.7 * d, 120, 10), alvo, 220 * W, 0.06 * d, 1.4 * d, temperatura=kw.get('t_contorno', 3800), espalhamento=40)
        L['beijo'] = area('beijo', ponto_esferico(alvo, 1.2 * d, -20, 45), alvo, 15 * W, 0.4 * d, temperatura=5600, espalhamento=30)
    elif nome == 'dramatico':  # luz dura de um lado, sombra recortada
        L['chave'] = area('chave', ponto_esferico(alvo, 1.2 * d, -70, 35), alvo, 300 * W, 0.12 * d, temperatura=quente, espalhamento=25)
        L['contorno'] = area('contorno', ponto_esferico(alvo, 0.9 * d, 150, 15), alvo, 120 * W, 0.1 * d, 0.8 * d, temperatura=frio)
    elif nome == 'janela':  # sol de fim de tarde por uma janela
        sd = bpy.data.lights.new('sol', 'SUN')
        sd.energy = 6.0 * forca
        sd.angle = math.radians(1.2)
        sd.use_temperature = True
        sd.temperature = 3900
        so = ligar(bpy.data.objects.new('sol', sd))
        so.rotation_euler = (math.radians(58), 0, math.radians(-60))
        L['sol'] = so
        L['ceu'] = area('ceu', ponto_esferico(alvo, 1.5 * d, 70, 40), alvo, 10 * W, 2.0 * d, temperatura=9000)
    elif nome == 'neon':  # duas réguas coloridas opostas + névoa opcional
        L['neon_a'] = area('neon_a', ponto_esferico(alvo, 0.6 * d, -110, 5), alvo, 90 * W, 0.04 * d, 1.2 * d, cor=kw.get('cor_a', '#FF2E88'))
        L['neon_b'] = area('neon_b', ponto_esferico(alvo, 0.6 * d, 110, 5), alvo, 90 * W, 0.04 * d, 1.2 * d, cor=kw.get('cor_b', '#2EE6FF'))
        L['frente'] = area('frente', ponto_esferico(alvo, 1.0 * d, -15, 25), alvo, 12 * W, 0.6 * d, temperatura=6500)
    else:
        raise ValueError(f'rig desconhecido: {nome}')
    return L


def persiana(alvo, sol, escala=1.0, laminas=9, abertura=0.55, distancia=0.6):
    """gobo de persiana: lâminas entre o sol e o produto que projetam faixas de luz e sombra.
    A assinatura da luz natural de fim de tarde. Fica fora de quadro (invisível pra câmera)."""
    from mathutils import Vector as V
    bpy.context.view_layer.update()  # sem isto a matriz do sol ainda é a identidade
    dir_sol = sol.matrix_world.to_quaternion() @ V((0, 0, 1))
    centro = V(alvo) + dir_sol.normalized() * distancia * escala
    passo = 0.05 * escala
    alt = passo * (1 - abertura)
    objs = []
    for i in range(laminas):
        me = bpy.data.meshes.new('lamina')
        w, h = 0.6 * escala, alt / 2
        me.from_pydata([(-w, 0, -h), (w, 0, -h), (w, 0, h), (-w, 0, h)], [], [(0, 1, 2, 3)])
        o = ligar(bpy.data.objects.new(f'lamina_{i}', me))
        o.location = centro + V((0, 0, (i - laminas / 2) * passo))
        o.rotation_euler = dir_sol.to_track_quat('-Y', 'Z').to_euler()
        o.visible_camera = False
        o.visible_glossy = False
        objs.append(o)
    return objs


def cartao_reflexo(nome, loc, alvo, largura=0.5, altura=0.25, forca=6.0, cor='#FFFFFF'):
    """o segredo da foto de produto brilhante: um painel que brilha e o produto reflete, mas a
    câmera não vê. Desenha a linha de luz em vidro, cromo e laca. Coloque perto e de lado."""
    me = bpy.data.meshes.new(nome)
    w, h = largura / 2, altura / 2
    me.from_pydata([(-w, 0, -h), (w, 0, -h), (w, 0, h), (-w, 0, h)], [], [(0, 1, 2, 3)])
    o = ligar(bpy.data.objects.new(nome, me))
    o.location = loc
    d = Vector(alvo) - Vector(loc)
    o.rotation_euler = d.to_track_quat('-Y', 'Z').to_euler()
    m = bpy.data.materials.new(nome)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    em = nt.nodes.new('ShaderNodeEmission')
    em.inputs['Color'].default_value = hex_emissao(cor)
    em.inputs['Strength'].default_value = forca
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    nt.links.new(em.outputs[0], out.inputs['Surface'])
    me.materials.append(m)
    o.visible_camera = False
    o.visible_shadow = False
    o.visible_diffuse = False  # só aparece no reflexo
    return o


def bandeira(nome, loc, alvo, largura=0.5, altura=0.6, cor='#050505'):
    """bandeira preta (flag/negative fill): painel escuro que o vidro e o metal refletem e a câmera
    não vê. É o que DESENHA o contorno de vidro (linha escura na borda) e dá profundidade ao cromo.
    Par do cartao_reflexo: o cartão põe a linha clara, a bandeira põe a linha escura."""
    me = bpy.data.meshes.new(nome)
    w, h = largura / 2, altura / 2
    me.from_pydata([(-w, 0, -h), (w, 0, -h), (w, 0, h), (-w, 0, h)], [], [(0, 1, 2, 3)])
    o = ligar(bpy.data.objects.new(nome, me))
    o.location = loc
    d = Vector(alvo) - Vector(loc)
    o.rotation_euler = d.to_track_quat('-Y', 'Z').to_euler()
    m = bpy.data.materials.new(nome)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = hex_emissao(cor)
    b.inputs['Roughness'].default_value = 1.0
    me.materials.append(m)
    o.visible_camera = False
    o.visible_shadow = False
    return o


def mundo_gradiente(topo='#2A2D33', base='#0E0F12', forca=1.0, luz_ambiente=0.35, meio=None):
    """fundo de céu em gradiente vertical. luz_ambiente < 1 deixa o fundo visível mas ilumina pouco
    (o fundo não deve achatar a luz do rig)."""
    w = bpy.context.scene.world
    w.use_nodes = True
    nt = w.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    co = nt.nodes.new('ShaderNodeTexCoord')
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    rp = nt.nodes.new('ShaderNodeValToRGB')
    rp.color_ramp.elements[0].position = 0.35
    rp.color_ramp.elements[0].color = hex_emissao(base)
    rp.color_ramp.elements[1].position = 0.75
    rp.color_ramp.elements[1].color = hex_emissao(topo)
    if meio:  # céu de 3 cores (pôr do sol): horizonte = base, meio, alto = topo
        rp.color_ramp.elements[0].position = 0.5
        rp.color_ramp.elements[1].position = 0.62
        e = rp.color_ramp.elements.new(0.54)
        e.color = hex_emissao(meio)
    mr = nt.nodes.new('ShaderNodeMapRange')
    mr.inputs['From Min'].default_value = -1
    mr.inputs['From Max'].default_value = 1
    nt.links.new(co.outputs['Generated'], sep.inputs[0])
    nt.links.new(sep.outputs['Z'], mr.inputs['Value'])
    nt.links.new(mr.outputs['Result'], rp.inputs['Fac'])
    bg_cam = nt.nodes.new('ShaderNodeBackground')
    bg_cam.inputs['Strength'].default_value = forca
    nt.links.new(rp.outputs['Color'], bg_cam.inputs['Color'])
    bg_luz = nt.nodes.new('ShaderNodeBackground')
    bg_luz.inputs['Strength'].default_value = forca * luz_ambiente
    nt.links.new(rp.outputs['Color'], bg_luz.inputs['Color'])
    lp = nt.nodes.new('ShaderNodeLightPath')
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(lp.outputs['Is Camera Ray'], mix.inputs['Fac'])
    nt.links.new(bg_luz.outputs[0], mix.inputs[1])
    nt.links.new(bg_cam.outputs[0], mix.inputs[2])
    out = nt.nodes.new('ShaderNodeOutputWorld')
    nt.links.new(mix.outputs[0], out.inputs['Surface'])
    return w


def mundo_hdri(caminho, forca=1.0, rotacao=0.0, visivel=True, fundo='#101114'):
    """HDRI ilumina e reflete. visivel=False mostra uma cor lisa pra câmera (o HDRI só no reflexo)."""
    w = bpy.context.scene.world
    w.use_nodes = True
    nt = w.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    co = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Rotation'].default_value[2] = math.radians(rotacao)
    env = nt.nodes.new('ShaderNodeTexEnvironment')
    env.image = bpy.data.images.load(str(caminho), check_existing=True)
    bg = nt.nodes.new('ShaderNodeBackground')
    bg.inputs['Strength'].default_value = forca
    nt.links.new(co.outputs['Generated'], mp.inputs['Vector'])
    nt.links.new(mp.outputs[0], env.inputs['Vector'])
    nt.links.new(env.outputs['Color'], bg.inputs['Color'])
    out = nt.nodes.new('ShaderNodeOutputWorld')
    if visivel:
        nt.links.new(bg.outputs[0], out.inputs['Surface'])
    else:
        liso = nt.nodes.new('ShaderNodeBackground')
        liso.inputs['Color'].default_value = hex_emissao(fundo)
        lp = nt.nodes.new('ShaderNodeLightPath')
        mix = nt.nodes.new('ShaderNodeMixShader')
        nt.links.new(lp.outputs['Is Camera Ray'], mix.inputs['Fac'])
        nt.links.new(bg.outputs[0], mix.inputs[1])
        nt.links.new(liso.outputs[0], mix.inputs[2])
        nt.links.new(mix.outputs[0], out.inputs['Surface'])
    return w


def nevoa(densidade=0.02, cor='#C9D4E0', anisotropia=0.3, tamanho=6.0, centro=(0, 0, 1)):
    """névoa volumétrica num cubo (feixe de luz visível). Densidade 0,01-0,05 em escala real.
    Cara no Cycles: prefira EEVEE pra volumétrico em animação."""
    bpy.ops.mesh.primitive_cube_add(size=tamanho, location=centro)
    o = bpy.context.object
    o.name = 'nevoa'
    m = bpy.data.materials.new('nevoa')
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    v = nt.nodes.new('ShaderNodeVolumePrincipled')
    v.inputs['Density'].default_value = densidade
    v.inputs['Color'].default_value = hex_emissao(cor)
    v.inputs['Anisotropy'].default_value = anisotropia
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    nt.links.new(v.outputs[0], out.inputs['Volume'])
    o.data.materials.append(m)
    o.visible_shadow = False
    return o


def ligar_luz(luz, objetos, nome=None):
    """light linking: a luz só ilumina estes objetos (ex.: contorno só no produto, não no fundo)."""
    col = bpy.data.collections.new(nome or f'{luz.name}.recebe')
    for o in objetos:
        col.objects.link(o)
    luz.light_linking.receiver_collection = col
    return col
