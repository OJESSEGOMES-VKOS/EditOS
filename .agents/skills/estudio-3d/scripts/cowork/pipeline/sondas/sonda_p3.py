# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (saida registrada no capitulo 09) | fonte: sonda propria
import bpy, os
bpy.ops.wm.read_factory_settings(use_empty=True)
before=set(bpy.data.objects)
r=bpy.ops.import_curve.svg(filepath='/home/claude/codigo/pipeline/sondas/logo.svg'); print("svg",r)
new=[o for o in bpy.data.objects if o not in before]
print("new objs",[(o.name,o.type,tuple(round(d,4) for d in o.dimensions)) for o in new], [c.name for c in bpy.data.collections])
for o in new:
    o.data.extrude=0.002; o.data.bevel_depth=0.0005
bpy.ops.object.select_all(action='DESELECT')
for o in new: o.select_set(True)
bpy.context.view_layer.objects.active=new[0]
bpy.ops.object.convert(target='MESH'); bpy.ops.object.join()
lg=bpy.context.active_object; print("joined",lg.name,lg.type,len(lg.data.vertices), tuple(round(d,4) for d in lg.dimensions))
bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS'); lg.location=(0,0,0)
b=lg.modifiers.new("Chanfro",'BEVEL'); b.width=0.0003; b.segments=3; b.limit_method='ANGLE'
print("bevel props", b.affect if hasattr(b,'affect') else None, b.harden_normals)
# GP svg
try:
    r=bpy.ops.wm.grease_pencil_import_svg(filepath='/home/claude/codigo/pipeline/sondas/logo.svg'); print("gp svg",r,[o.type for o in bpy.data.objects])
except Exception as e: print("gp err",e)
# gltf roundtrip
bpy.ops.mesh.primitive_monkey_add()
r=bpy.ops.export_scene.gltf(filepath='/home/claude/probe/t.glb', export_format='GLB'); print("gltf exp",r, os.path.getsize('/home/claude/probe/t.glb'))
r=bpy.ops.import_scene.gltf(filepath='/home/claude/probe/t.glb'); print("gltf imp",r)
r=bpy.ops.export_scene.fbx(filepath='/home/claude/probe/t.fbx'); print("fbx exp",r)
r=bpy.ops.import_scene.fbx(filepath='/home/claude/probe/t.fbx'); print("fbx imp",r)
