# Blender 5.2 | status: sonda executada no bpy 5.2.2 (nuvem); saída citada nos capítulos 04 e 07 | fonte: API https://docs.blender.org/api/current/
import bpy, math
from bpy_extras import anim_utils
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector
sc=bpy.context.scene
for o in list(bpy.data.objects): bpy.data.objects.remove(o)
# 1) enquadramento: 15 cm a 34,7 cm, 50 mm, 9:16
for (rx,ry,d,lab) in [(1080,1920,347.0,'9:16 50mm'),(1920,1080,617.0,'16:9 50mm'),(1080,1920,167.0,'9:16 24mm')]:
    sc.render.resolution_x, sc.render.resolution_y = rx, ry
    cd=bpy.data.cameras.new("c"); cd.lens= 24 if '24' in lab else 50
    cam=bpy.data.objects.new("cam",cd); sc.collection.objects.link(cam)
    cam.location=(0,-d/1000,0); cam.rotation_euler=(math.radians(90),0,0)
    bpy.context.view_layer.update()
    top=world_to_camera_view(sc,cam,Vector((0,0,0.075))); bot=world_to_camera_view(sc,cam,Vector((0,0,-0.075)))
    print("ENQ",lab,"fracao altura=%.4f"%(top.y-bot.y), "angle_y=%.2f"%math.degrees(cd.angle_y), "angle_x=%.2f"%math.degrees(cd.angle_x))
    bpy.data.objects.remove(cam)
# 2) BACK -> overshoot
e=bpy.data.objects.new("e",None); sc.collection.objects.link(e)
for b in [0.5,0.8,1.0,1.2,1.4,1.7,2.0]:
    e.animation_data_clear(); e.location=(0,0,0)
    e.keyframe_insert("location",index=0,frame=1); e.location.x=1; e.keyframe_insert("location",index=0,frame=31)
    cb=anim_utils.action_get_channelbag_for_slot(e.animation_data.action,e.animation_data.action_slot)
    fc=cb.fcurves.find("location",index=0); k=fc.keyframe_points[0]
    k.interpolation='BACK'; k.easing='EASE_OUT'; k.back=b
    vals=[fc.evaluate(1+i*0.1) for i in range(301)]
    mx=max(vals); fpk=1+vals.index(mx)*0.1
    print("BACK back=%.1f overshoot=%.1f%% pico no quadro %.1f (de 1 a 31)"%(b,(mx-1)*100,fpk))
# ELASTIC defaults
k.interpolation='ELASTIC'; print("ELASTIC amp/period", k.amplitude, k.period)
# 3) NOISE amplitude calibration
e.animation_data_clear(); e.rotation_euler=(0,0,0)
e.keyframe_insert("rotation_euler",index=0,frame=1)
cb=anim_utils.action_get_channelbag_for_slot(e.animation_data.action,e.animation_data.action_slot)
fc=cb.fcurves.find("rotation_euler",index=0)
for blend in ['REPLACE','ADD']:
  for scale in [10,30]:
    while fc.modifiers: fc.modifiers.remove(fc.modifiers[0])
    m=fc.modifiers.new('NOISE'); m.strength=1.0; m.scale=scale; m.blend_type=blend
    v=[fc.evaluate(f) for f in range(1,2001)]
    mean=sum(v)/len(v); sd=(sum((x-mean)**2 for x in v)/len(v))**.5
    # zero crossings around mean -> frequency
    zc=sum(1 for i in range(1,len(v)) if (v[i-1]-mean)*(v[i]-mean)<0)
    print("NOISE blend=%s scale=%d strength=1: min=%.3f max=%.3f media=%.3f desvio=%.3f cruzamentos/1000q=%.1f"%(blend,scale,min(v),max(v),mean,sd,zc/2))
# 4) DOF props + focus object
cd=bpy.data.cameras.new("c2"); cd.dof.use_dof=True; cd.dof.focus_object=e; cd.dof.aperture_fstop=5.6; cd.dof.aperture_blades=7; cd.dof.aperture_ratio=1.0
print("DOF ok", cd.dof.use_dof, cd.dof.focus_object.name, cd.dof.aperture_fstop, cd.dof.aperture_blades)
cd.dof.keyframe_insert("aperture_fstop", frame=1); cd.keyframe_insert("dof.focus_distance",frame=1)
print("anim cam data", [ (fc.data_path) for fc in anim_utils.action_get_channelbag_for_slot(cd.animation_data.action, cd.animation_data.action_slot).fcurves])
print("lens anim", cd.keyframe_insert("lens", frame=1))
print("shift", cd.shift_x, cd.shift_y)
