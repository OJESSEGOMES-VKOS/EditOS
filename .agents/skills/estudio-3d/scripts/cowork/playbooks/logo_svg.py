# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (import, extrusão e chanfro rodaram) | fonte: manual 5.x "Import SVG as Curves" (só geometria de path; ignora preenchimento, texto, imagem); API bpy 5.2.2 (bpy.ops.import_curve.svg)
# Logo do SVG pra 3D: importa curvas, normaliza tamanho, extrude, chanfra e anima a revelação.
import bpy, math
from mathutils import Vector
from _util import interpolar

def importar_logo(caminho, largura_m=0.20, espessura_m=0.012, chanfro_m=0.0012):
    antes = set(bpy.data.objects)
    bpy.ops.import_curve.svg(filepath=caminho)
    novos = [o for o in bpy.data.objects if o not in antes and o.type == 'CURVE']
    # junta tudo num objeto e normaliza a largura (SVG vem em unidades do documento, minúsculo)
    for o in novos:
        o.data.extrude = 0; o.data.dimensions = '3D'   # 3D só pra poder mexer na origem; volta pra 2D no fim
    bpy.ops.object.select_all(action='DESELECT')
    for o in novos: o.select_set(True)
    bpy.context.view_layer.objects.active = novos[0]
    bpy.ops.object.join()
    logo = bpy.context.object; logo.name = "Logo"
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
    logo.location = (0, 0, 0)
    f = largura_m / max(logo.dimensions.x, 1e-9)
    # escala direto nos pontos (no teste, transform_apply não aplicou a escala no objeto de curva unido,
    # e aí extrude/chanfro saíam multiplicados pelo fator)
    for sp in logo.data.splines:
        for b in sp.bezier_points:
            b.co *= f; b.handle_left *= f; b.handle_right *= f
        for pt in sp.points:
            pt.co = (pt.co.x * f, pt.co.y * f, pt.co.z * f, pt.co.w)
    logo.scale = (1, 1, 1)
    cu = logo.data
    cu.dimensions = '2D'; cu.fill_mode = 'BOTH'   # 2D = preenche os furos (o "miolo" do O, do A) corretamente
    cu.extrude = espessura_m / 2           # extrude é pra cada lado: 6 mm => 12 mm total
    cu.bevel_depth = chanfro_m             # chanfro de 1,2 mm pega luz na quina (sem ele: recorte de papel)
    cu.bevel_resolution = 3
    cu.resolution_u = 24
    logo.rotation_euler.x = math.radians(90)  # em pé, de frente pra câmera em -Y
    return logo

def revelar(logo, q0=20, dur=24):
    """Revelação: sobe 8 mm, gira 18° em Z e sai da escala 0,92 pra 1,0. Assenta sem ultrapassar."""
    logo.location.z -= 0.008; logo.rotation_euler.z = math.radians(-18); logo.scale = (0.92,) * 3
    for p in ("location", "rotation_euler", "scale"): logo.keyframe_insert(p, frame=q0)
    logo.location.z += 0.008; logo.rotation_euler.z = 0; logo.scale = (1, 1, 1)
    for p in ("location", "rotation_euler", "scale"): logo.keyframe_insert(p, frame=q0 + dur)
    interpolar(logo, 'BEZIER')

if __name__ == "__main__":
    import sys
    for o in list(bpy.data.objects): bpy.data.objects.remove(o)
    svg = sys.argv[-1] if sys.argv[-1].endswith(".svg") else "/tmp/claude-0/-home-claude/7b776b49-e979-58e8-90b8-7c18ad6d2d5c/scratchpad/svg/logo.svg"
    lg = importar_logo(svg); revelar(lg); bpy.context.view_layer.update()
    print("OK logo dims (m):", [round(d, 4) for d in lg.dimensions], "splines:", len(lg.data.splines))
