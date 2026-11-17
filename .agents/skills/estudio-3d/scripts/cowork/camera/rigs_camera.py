# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (teste_rigs.py mede cada rig) | fonte: API https://docs.blender.org/api/current/bpy.types.CameraDOFSettings.html ; constraints https://docs.blender.org/api/current/bpy.types.TrackToConstraint.html ; manual câmeras https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cameras.rst
"""
Rigs de câmera do estúdio (unidade: metro; ângulos em graus na interface das funções).

  camera_produto(nome, lente, sensor_fit)            câmera com sensor 36 mm, clip curto para objeto pequeno
  distancia_enquadrar(h_m, lente, formato, fracao)   distância para o objeto ocupar 'fracao' da altura
  dof(cam, foco, fstop, laminas)                     profundidade de campo com objeto de foco
  rack_focus(foco_empty, de, para, q0, dur)          puxada de foco animando o empty de foco
  rig_orbita(alvo, raio, elev, azim, lente)          pivô (órbita/grua) + braço (dolly) + câmera
  mirar_com(cam, alvo, tipo)                         Track To ou Damped Track
  rig_caminho(pontos, alvo, lente)                   câmera em Follow Path com mira
  peso(seguidor, lider, q0, q1, tau_q)               atraso (peso) assado em chaves: a mira segue o líder com inércia
  na_mao(cam, amp_graus, periodo_q, amp_mm)          tremor sutil por modificador NOISE calibrado
"""
import math
import os
import sys

import bpy
from mathutils import Vector

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "movimento"))
import curvas  # noqa: E402

ALTURA_SENSOR = {"9:16": 36.0, "16:9": 20.25, "1:1": 36.0, "4:5": 36.0}  # AUTO, sensor 36 mm (maior lado)


def camera_produto(nome="Cam", lente=85, sensor_fit="AUTO", sensor_mm=36.0, ativa=True):
    d = bpy.data.cameras.new(nome)
    d.lens = lente
    d.sensor_fit = sensor_fit          # AUTO: os 36 mm valem para o MAIOR lado da imagem
    d.sensor_width = sensor_mm
    d.sensor_height = sensor_mm * 2 / 3
    d.clip_start = 0.01                # 1 cm: objeto de 12 cm a 20 cm da lente não é cortado
    d.clip_end = 50.0
    cam = bpy.data.objects.new(nome, d)
    bpy.context.scene.collection.objects.link(cam)
    if ativa:
        bpy.context.scene.camera = cam
    return cam


def distancia_enquadrar(h_m, lente, formato="9:16", fracao=0.6):
    """d = h * f / (fracao * altura_do_sensor). Câmera pinhole: exato no Blender (conferido por projeção)."""
    return h_m * lente / (fracao * ALTURA_SENSOR[formato])


def dof(cam, foco=None, fstop=5.6, laminas=7, rotacao_graus=0.0, distancia=None):
    c = cam.data.dof
    c.use_dof = True
    c.aperture_fstop = fstop
    c.aperture_blades = laminas          # 0 = bokeh redondo; 6 a 9 = poligonal de lente real
    c.aperture_rotation = math.radians(rotacao_graus)
    if foco is not None:
        c.focus_object = foco            # com objeto de foco a distância é ignorada
    elif distancia is not None:
        c.focus_distance = distancia
    return c


def rack_focus(foco_empty, de, para, q0, dur=18, estilo="premium"):
    """Anima o empty de foco entre dois pontos (tuplas). O foco segue o empty quadro a quadro."""
    for i in range(3):
        curvas.mover(foco_empty, "location", i, q0, q0 + dur, de[i], para[i], estilo=estilo)


def _empty(nome, tipo="PLAIN_AXES", tam=0.03):
    e = bpy.data.objects.new(nome, None)
    e.empty_display_type = tipo
    e.empty_display_size = tam
    bpy.context.scene.collection.objects.link(e)
    return e


def rig_orbita(alvo=(0, 0, 0), raio=0.6, elev=10.0, azim=0.0, lente=85, nome="Cam"):
    """Pivô no produto: rotation_euler.z = órbita (azimute), rotation_euler.x = -elevação (grua em arco).
    Braço filho do pivô em (0, -raio, 0): animar braco.location.y é dolly/push-in (mais perto = menos negativo).
    Câmera filha do braço olhando +Y (rotação 90° em X): mira sempre o pivô, sem constraint.
    Devolve dict com pivo, braco, cam."""
    pivo = _empty(nome + "_Pivo", "SPHERE", 0.02)
    pivo.location = alvo
    pivo.rotation_euler = (math.radians(-elev), 0.0, math.radians(azim))
    braco = _empty(nome + "_Braco", "CUBE", 0.01)
    braco.parent = pivo
    braco.location = (0.0, -raio, 0.0)
    cam = camera_produto(nome, lente)
    cam.parent = braco
    cam.location = (0, 0, 0)
    cam.rotation_euler = (math.radians(90), 0, 0)
    return {"pivo": pivo, "braco": braco, "cam": cam}


def mirar_com(cam, alvo, tipo="TRACK_TO"):
    """TRACK_TO mantém o horizonte (up_axis Y); DAMPED_TRACK gira pelo menor caminho e pode inclinar (roll)."""
    c = cam.constraints.new(tipo)
    c.target = alvo
    c.track_axis = "TRACK_NEGATIVE_Z"
    if tipo == "TRACK_TO":
        c.up_axis = "UP_Y"
    return c


def rig_caminho(pontos, alvo, lente=50, nome="CamCaminho", q0=1, q1=90, estilo="sine_in_out"):
    """Câmera presa a uma curva Bézier por Follow Path (use_fixed_location + offset_factor animado 0 -> 1)
    e mirando 'alvo' por Track To. pontos: lista de tuplas em metro."""
    cd = bpy.data.curves.new(nome + "_Trilho", "CURVE")
    cd.dimensions = "3D"
    sp = cd.splines.new("BEZIER")
    sp.bezier_points.add(len(pontos) - 1)
    for bp, p in zip(sp.bezier_points, pontos):
        bp.co = p
        bp.handle_left_type = bp.handle_right_type = "AUTO"
    trilho = bpy.data.objects.new(nome + "_Trilho", cd)
    bpy.context.scene.collection.objects.link(trilho)
    cam = camera_produto(nome, lente)
    fp = cam.constraints.new("FOLLOW_PATH")
    fp.target = trilho
    fp.use_fixed_location = True       # posição pelo offset_factor (0 a 1), independe da duração da curva
    fp.use_curve_follow = False        # quem mira é o Track To
    mirar_com(cam, alvo, "TRACK_TO")
    fp.offset_factor = 0.0
    fp.keyframe_insert("offset_factor", frame=q0)
    fp.offset_factor = 1.0
    fp.keyframe_insert("offset_factor", frame=q1)
    fc = curvas.fcurve(cam, f'constraints["{fp.name}"].offset_factor', 0)
    k0 = fc.keyframe_points[0]
    k0.interpolation, k0.easing = curvas.ESTILOS[estilo]
    return {"cam": cam, "trilho": trilho, "follow": fp}


def peso(seguidor, lider, q0, q1, tau_q=4.0, offset=(0, 0, 0)):
    """Câmera com peso: o seguidor (ex.: empty de mira da câmera) persegue a posição de mundo do líder
    com atraso exponencial de constante tau_q quadros, assado em chaves LINEAR (uma por quadro).
    tau 3 a 6 quadros = peso de câmera de estúdio; > 8 parece câmera atrasada demais."""
    cena = bpy.context.scene
    alfa = 1.0 - math.exp(-1.0 / tau_q)
    cena.frame_set(q0)
    p = lider.matrix_world.translation.copy()
    pos = []
    for f in range(q0, q1 + 1):
        cena.frame_set(f)
        alvo = lider.matrix_world.translation
        p = p + (alvo - p) * alfa
        pos.append((f, p.copy()))
    seguidor.animation_data_clear()
    for f, v in pos:
        seguidor.location = v + Vector(offset)
        seguidor.keyframe_insert("location", frame=f)
    for i in range(3):
        fc = curvas.fcurve(seguidor, "location", i)
        for k in fc.keyframe_points:
            k.interpolation = "LINEAR"
    return pos


def na_mao(cam, amp_graus=0.15, periodo_q=36.0, amp_mm=0.0, fino=True):
    """Tremor de câmera na mão sutil. amp_graus = pico de rotação (0,1 a 0,3° para produto).
    periodo_q 30 a 45 quadros a 30 fps (~0,7 a 1 Hz, respiração de operador).
    fino=True soma camada de 1/4 da amplitude com período de 8 quadros (~4 Hz, micro tremor de mão)."""
    for i, peso_eixo in ((0, 1.0), (1, 0.6), (2, 0.35)):   # tilt > pan > roll
        a = math.radians(amp_graus) * peso_eixo
        curvas.tremor(cam, "rotation_euler", i, a, periodo_q, fase=3.0,
                      rapido=(a * 0.25, 8.0) if fino else None)
    if amp_mm > 0:
        for i in range(3):
            curvas.tremor(cam, "location", i, amp_mm / 1000.0, periodo_q * 1.3, fase=11.0)
