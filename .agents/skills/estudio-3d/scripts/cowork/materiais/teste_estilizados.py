# Blender 5.2 | status: testado no bpy 5.2.2 (EEVEE e Cycles CPU), nuvem | fonte: capítulo 06-materiais.md
"""Shaders estilizados lado a lado no motor pedido.
Rodar: /home/claude/bvenv/bin/python teste_estilizados.py eevee|cycles"""
import sys, os
import bpy, mathutils
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import materiais as M

motor = sys.argv[1] if len(sys.argv) > 1 else "eevee"
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
if motor == "eevee":
    sc.render.engine = "BLENDER_EEVEE"
    sc.eevee.taa_render_samples = 32
else:
    sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"; sc.cycles.samples = 32
    sc.cycles.use_denoising = True
sc.render.resolution_x, sc.render.resolution_y = 640, 240
sc.view_settings.view_transform = "AgX"
sc.view_settings.look = "AgX - Medium High Contrast"

w = bpy.data.worlds.new("W"); sc.world = w
bg = w.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = M.hex_para_linear("#EDE6F2")
bg.inputs["Strength"].default_value = 0.6

bpy.ops.mesh.primitive_plane_add(size=4)
chao = bpy.context.object
mc = M.novo_material("Chao"); M.ajustar(mc, Base_Color="#E9DDF0", Roughness=0.8)
chao.data.materials.append(mc)

l = bpy.data.lights.new("Key", "AREA"); l.energy = 25; l.size = 0.6
l.use_temperature = True; l.temperature = 5600
o = bpy.data.objects.new("Key", l); sc.collection.objects.link(o)
o.location = (-0.5, -0.5, 0.6)
o.rotation_euler = (mathutils.Vector((0, 0, 0.03)) - o.location).to_track_quat("-Z", "Y").to_euler()

cam = bpy.data.cameras.new("Cam"); cam.lens = 70
co = bpy.data.objects.new("Cam", cam); sc.collection.objects.link(co)
co.location = (0, -0.9, 0.25)
co.rotation_euler = (mathutils.Vector((0, 0, 0.03)) - co.location).to_track_quat("-Z", "Y").to_euler()
sc.camera = co

mats = [M.toon("#FF6A3D"), M.argila(), M.pastel("#F6C6D0"), M.gradiente(altura=0.06),
        M.holografico(), M.bolha_sabao()]
for i, m in enumerate(mats):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.03, location=(-0.175 + i * 0.07, 0, 0.03),
                                         segments=64, ring_count=32)
    s = bpy.context.object; bpy.ops.object.shade_smooth(); s.data.materials.append(m)

out = "/home/claude/provas/estilizados_%s.png" % motor
sc.render.filepath = out
bpy.ops.render.render(write_still=True)
print("SALVO", out)
