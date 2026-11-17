# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (marcador com câmera troca scene.camera no frame_set; distâncias por projeção) | fonte: API https://docs.blender.org/api/current/bpy.types.TimelineMarker.html
"""
Transições 3D sem corte seco (cap. 04, seção 10).

  trocar_camera(cena, cam, quadro, nome)          corte invisível: marcador com câmera ligada (match cut, wipe)
  distancia_tela_cheia(h_tela, lente, formato)    distância em que a tela do celular enche a altura do quadro
  zoom_pela_tela(braco, rig_raio, h_tela, lente, q0, dur, formato)  push-in até a tela encher o quadro (expo in)
  wipe_objeto(obj, de, para, q0, dur)             objeto de primeiro plano atravessa a lente (cobre o corte)
  escala_continua(obj, q0, dur, fator)            mudança de escala: produto cresce até virar cenário
"""
import os
import sys

import bpy

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import curvas  # noqa: E402

ALTURA_SENSOR = {"9:16": 36.0, "16:9": 20.25, "1:1": 36.0, "4:5": 36.0}


def trocar_camera(cena, cam, quadro, nome=None):
    m = cena.timeline_markers.new(nome or f"cam_{cam.name}_{quadro}", frame=quadro)
    m.camera = cam
    return m


def distancia_tela_cheia(h_tela, lente, formato="9:16", margem=1.0):
    """Distância (m) em que um objeto de altura h_tela ocupa 100% x margem da altura do quadro."""
    return h_tela * lente / (margem * ALTURA_SENSOR[formato])


def zoom_pela_tela(braco, raio_ini, h_tela, lente, q0, dur=24, formato="9:16", passar=0.85):
    """Push-in que termina com a tela ocupando 1/passar da altura (0,85 -> 118%, borda some).
    Curva EXPO EASE_IN: começa calmo e acelera para dentro (a velocidade esconde o corte no quadro final)."""
    d_fim = distancia_tela_cheia(h_tela, lente, formato) * passar
    fc = curvas.mover(braco, "location", 1, q0, q0 + dur, -raio_ini, -d_fim, estilo="linear")
    k0 = fc.keyframe_points[0]
    k0.interpolation, k0.easing = "EXPO", "EASE_IN"
    return d_fim


def wipe_objeto(obj, de, para, q0, dur=8):
    """O objeto passa a ~5 a 15 cm da lente; o corte vai no quadro em que ele cobre 100% do quadro."""
    for i in range(3):
        curvas.mover(obj, "location", i, q0, q0 + dur, de[i], para[i], estilo="linear")


def escala_continua(obj, q0, dur, fator=40.0):
    for i in range(3):
        v0 = obj.scale[i]
        fc = curvas.mover(obj, "scale", i, q0, q0 + dur, v0, v0 * fator, estilo="linear")
        k0 = fc.keyframe_points[0]
        k0.interpolation, k0.easing = "EXPO", "EASE_IN"


if __name__ == "__main__":
    cena = bpy.context.scene
    cams = []
    for n in ("A", "B"):
        d = bpy.data.cameras.new(n)
        o = bpy.data.objects.new(n, d)
        cena.collection.objects.link(o)
        cams.append(o)
    trocar_camera(cena, cams[0], 1)
    trocar_camera(cena, cams[1], 46)
    for q in (1, 45, 46, 90):
        cena.frame_set(q)
        print("quadro", q, "camera ativa", cena.camera.name)
    print("tela 141 mm, 85 mm, 9:16 -> tela cheia a %.1f cm" % (distancia_tela_cheia(0.141, 85) * 100))
    print("tela 141 mm, 50 mm, 9:16 -> tela cheia a %.1f cm" % (distancia_tela_cheia(0.141, 50) * 100))
