# Blender 5.2 | status: executado no bpy 5.2.2 (EEVEE e Cycles CPU, nuvem) | fonte: manual motion blur https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cycles/render_settings/motion_blur.rst
"""Celular atravessa o quadro (0,30 m em 6 quadros = 1,5 m/s) e é renderizado no quadro do meio com shutter 0 (sem), 0,5 e 1,0.
Uso: /home/claude/bvenv/bin/python teste_motion_blur.py /tmp/mb"""
import sys, os, math, time
import bpy
out = [a for a in sys.argv[1:] if not a.endswith(".py")]
out = out[0] if out else "/tmp/mb"
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; r = sc.render
r.resolution_x, r.resolution_y = 320, 180; r.fps = 30
sc.view_settings.view_transform = "AgX"; sc.view_settings.look = "AgX - Medium High Contrast"
w = bpy.data.worlds.new("W"); sc.world = w; w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.05, 0.05, 0.06, 1)
bpy.ops.mesh.primitive_cube_add(size=1); o = bpy.context.active_object
o.scale = (0.0715, 0.0078, 0.147); o.rotation_euler = (0, 0, 0)
m = bpy.data.materials.new("M"); b = m.node_tree.nodes["Principled BSDF"]
b.inputs["Base Color"].default_value = (0.9, 0.4, 0.1, 1); o.data.materials.append(m)
o.location = (-0.15, 0, 0); o.keyframe_insert("location", frame=1)
o.location = (0.15, 0, 0); o.keyframe_insert("location", frame=7)
from bpy_extras import anim_utils
for fc in anim_utils.action_get_channelbag_for_slot(o.animation_data.action, o.animation_data.action_slot).fcurves:
    for k in fc.keyframe_points: k.interpolation = "LINEAR"
cd = bpy.data.cameras.new("C"); cd.lens = 50; cam = bpy.data.objects.new("C", cd); sc.collection.objects.link(cam)
cam.location = (0, -0.75, 0); cam.rotation_euler = (math.radians(90), 0, 0); sc.camera = cam
ld = bpy.data.lights.new("L", "AREA"); ld.energy = 20; ld.size = 0.5
l = bpy.data.objects.new("L", ld); sc.collection.objects.link(l); l.location = (0.3, -0.5, 0.4); l.rotation_euler = (math.radians(50), 0, math.radians(30))
sc.frame_set(4)
for motor in ("BLENDER_EEVEE", "CYCLES"):
    r.engine = motor
    if motor == "CYCLES": sc.cycles.samples = 32; sc.cycles.device = "CPU"
    else: sc.eevee.taa_render_samples = 16; sc.eevee.motion_blur_steps = 1
    for sh in (0.0, 0.5, 1.0):
        r.use_motion_blur = sh > 0
        if sh: r.motion_blur_shutter = sh
        r.motion_blur_position = "CENTER"
        r.filepath = os.path.join(out, f"mb_{motor}_{sh}.png"); t = time.time()
        bpy.ops.render.render(write_still=True)
        print(f"{motor} shutter={sh} {time.time()-t:.1f}s")
print("eevee.motion_blur_steps", sc.eevee.motion_blur_steps, "max", sc.eevee.motion_blur_max, "pos enum ok", r.motion_blur_position)
