# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (saida registrada no capitulo 09) | fonte: sonda propria
import bpy, sys
from bpy_extras import anim_utils
print("VER", bpy.app.version_string)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.mesh.primitive_cube_add()
o=bpy.context.active_object
o.location=(0,0,0); o.keyframe_insert("location",frame=1)
o.location=(0,0,2); o.keyframe_insert("location",frame=30)
act=o.animation_data.action
print("action",act.name, "slots",[ (s.identifier,s.name_display if hasattr(s,'name_display') else '', s.target_id_type) for s in act.slots])
print("anim slot", o.animation_data.action_slot)
cb=anim_utils.action_get_channelbag_for_slot(act, o.animation_data.action_slot)
print("fcurves",[(f.data_path,f.array_index) for f in cb.fcurves])
print("has action.fcurves", hasattr(act,'fcurves'))
print("layers",[l.name for l in act.layers], [s.type for s in act.layers[0].strips])
# interp
fc=cb.fcurves.find("location",index=2)
for k in fc.keyframe_points:
    k.interpolation='EXPO'; k.easing='EASE_OUT'
k=fc.keyframe_points[0]; k.interpolation='BACK'; k.back=1.7; k.easing='EASE_OUT'
print("kp props", k.interpolation, k.easing, k.back, k.handle_left_type)
k.handle_left_type='AUTO_CLAMPED'
m=fc.modifiers.new('NOISE'); m.strength=0.2; m.scale=10; m.phase=3
print("noise", m.type, m.strength, m.scale, [p for p in ('blend_in','blend_out','use_restricted_range','depth','offset') if hasattr(m,p)])
fx=cb.fcurves.find("location",index=0)
c=fx.modifiers.new('CYCLES'); print("cycles",c.mode_before,c.mode_after)
bpy.context.scene.frame_set(15); print("z@15",o.location.z)
# from scratch
o2=bpy.data.objects.new("Vazio",None); bpy.context.scene.collection.objects.link(o2)
a=bpy.data.actions.new("Acao_Manual")
print("slots.new sig", a.slots.new.__doc__)
s=a.slots.new(id_type='OBJECT', name="Vazio")
print("slot", s.identifier, s.target_id_type)
L=a.layers.new("Base")
st=L.strips.new(type='KEYFRAME')
cb2=st.channelbag(s, ensure=True)
f=cb2.fcurves.new("rotation_euler", index=2)
f.keyframe_points.insert(1,0.0); f.keyframe_points.insert(30,3.14)
o2.animation_data_create(); o2.animation_data.action=a; o2.animation_data.action_slot=s
bpy.context.scene.frame_set(30); print("rot", o2.rotation_euler.z)
print("ensure helper", hasattr(cb2.fcurves,'ensure'))
try:
    f3=cb2.fcurves.ensure("scale",index=0); print("ensure ok")
except Exception as e: print("ensure err",e)
print("action_ensure_channelbag_for_slot", hasattr(anim_utils,'action_ensure_channelbag_for_slot'))
# keyframe_insert options
print(o.keyframe_insert.__doc__)
# driver
d=o2.driver_add("location",0)
d.driver.type='SCRIPTED'
v=d.driver.variables.new(); v.name='z'; v.type='SINGLE_PROP'
v.targets[0].id=o; v.targets[0].data_path='location.z'
d.driver.expression='z*2'
bpy.context.scene.frame_set(30); bpy.context.view_layer.update()
print("driver x", o2.location.x, "valid", d.driver.is_valid)
d2=o2.driver_add("scale",0); d2.driver.expression="1+0.1*sin(frame/5)"
bpy.context.scene.frame_set(10); print("scale", o2.scale.x, "py exprs", bpy.app.driver_namespace is not None)
# shape key
print("action_slot_handle", o.animation_data.action_slot_handle if hasattr(o.animation_data,'action_slot_handle') else None)
print("suitable", [x for x in dir(o.animation_data) if 'slot' in x])
