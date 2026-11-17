# Blender 5.2 | status: testado no bpy 5.2.2 Cycles CPU, nuvem | fonte: capítulo 06-materiais.md
"""Antes/depois: 'plástico de CG' (aspereza uniforme, aresta viva) vs imperfeição + chanfro.
Rodar: /home/claude/bvenv/bin/python teste_imperfeicao.py antes|depois [amostras]"""
import sys, os, math
import bpy, mathutils
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import materiais as M

modo = sys.argv[1] if len(sys.argv) > 1 else "depois"
amostras = int(sys.argv[2]) if len(sys.argv) > 2 else 48
depois = modo == "depois"

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"
sc.cycles.samples = amostras; sc.cycles.use_denoising = True
sc.render.resolution_x, sc.render.resolution_y = 640, 480
sc.view_settings.view_transform = "AgX"
sc.view_settings.look = "AgX - Medium High Contrast"

w = bpy.data.worlds.new("Mundo"); sc.world = w
w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.02, 0.022, 0.026, 1)
w.node_tree.nodes["Background"].inputs["Strength"].default_value = 1.0

bpy.ops.mesh.primitive_plane_add(size=3)
chao = bpy.context.object
mc = M.novo_material("Chao"); M.ajustar(mc, Base_Color="#1B1C1F", Roughness=0.45)
chao.data.materials.append(mc)

def luz(nome, energia, tam, loc, alvo, temp):
    l = bpy.data.lights.new(nome, "AREA"); l.energy = energia; l.size = tam
    l.use_temperature = True; l.temperature = temp
    o = bpy.data.objects.new(nome, l); sc.collection.objects.link(o); o.location = loc
    o.rotation_euler = (mathutils.Vector(alvo) - mathutils.Vector(loc)).to_track_quat("-Z", "Y").to_euler()

# Principal grande atrás e acima: o reflexo dela cai no topo e na lateral (onde a imperfeição aparece)
luz("Principal", 12, 0.5, (-0.25, 0.35, 0.45), (0, 0, 0.03), 5200)
luz("Contorno", 12, 0.3, (0.4, 0.25, 0.15), (0, 0, 0.03), 6500)
luz("Frente", 1.5, 0.8, (0.2, -0.6, 0.3), (0, 0, 0.03), 5600)

cam = bpy.data.cameras.new("Cam"); cam.lens = 100
co = bpy.data.objects.new("Cam", cam); sc.collection.objects.link(co)
co.location = (0.32, -0.42, 0.26)
co.rotation_euler = (mathutils.Vector((0.0, 0.0, 0.035)) - co.location).to_track_quat("-Z", "Y").to_euler()
sc.camera = co

# Produto: estojo 60 x 60 x 40 mm (plástico preto brilhante) + tampa cilíndrica cromada
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.02))
caixa = bpy.context.object; caixa.scale = (0.06, 0.06, 0.04)
bpy.ops.object.transform_apply(scale=True)
bpy.ops.mesh.primitive_cylinder_add(radius=0.018, depth=0.02, location=(0, 0, 0.05), vertices=96)
tampa = bpy.context.object

mp = M.plastico_brilhante("#141416", nome="Plastico_Preto")
M.ajustar(mp, Roughness=0.22)
mt = M.metal("aluminio", 0.12, "Tampa")

if depois:
    M.chanfrar(caixa, largura_mm=3.0, segmentos=5)       # caixa: 2 a 4 mm
    M.chanfrar(tampa, largura_mm=1.0, segmentos=4)       # peça pequena: ~1 mm
    M.imperfeicao(mp, amplitude=0.12, escala_mm=10, relevo=0.015)
    M.imperfeicao(mt, amplitude=0.08, escala_mm=6, relevo=0.0)

for o in (caixa, tampa):
    bpy.ops.object.select_all(action="DESELECT"); o.select_set(True)
    bpy.context.view_layer.objects.active = o
    bpy.ops.object.shade_smooth() if depois else bpy.ops.object.shade_flat()
caixa.data.materials.append(mp); tampa.data.materials.append(mt)

out = "/home/claude/provas/imperfeicao_%s.png" % modo
sc.render.filepath = out
bpy.ops.render.render(write_still=True)
print("SALVO", out)
