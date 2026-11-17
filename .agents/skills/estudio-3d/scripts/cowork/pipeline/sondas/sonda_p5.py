# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (saida registrada no capitulo 09) | fonte: sonda propria
import bpy, os, time
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene; r=sc.render
for e in ('CYCLES','BLENDER_WORKBENCH','BLENDER_EEVEE'):
    try: r.engine=e; print("engine ok",e)
    except Exception as x: print("engine err",e,x)
r.engine='BLENDER_EEVEE'
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.5)
m=bpy.data.materials.new("Em"); 
nt=m.node_tree if m.node_tree else None
print("mat node_tree on new", nt is not None)
bpy.ops.object.light_add(type='AREA', location=(2,-2,3)); L=bpy.context.active_object; L.data.energy=300
bpy.ops.object.camera_add(location=(0,-4,0.5), rotation=(1.47,0,0)); sc.camera=bpy.context.active_object
r.resolution_x=320; r.resolution_y=320; r.resolution_percentage=100
print("eevee props", [p for p in ('taa_render_samples','use_raytracing','use_shadows','use_gtao','fast_gi_method') if hasattr(sc.eevee,p)])
sc.eevee.taa_render_samples=16
# compositor
ng=bpy.data.node_groups.new("Comp",'CompositorNodeTree')
ng.interface.new_socket("Image",in_out='OUTPUT',socket_type='NodeSocketColor')
rl=ng.nodes.new('CompositorNodeRLayers'); gl=ng.nodes.new('CompositorNodeGlare'); out=ng.nodes.new('NodeGroupOutput')
print("glare Type socket", gl.inputs['Type'].bl_idname, getattr(gl.inputs['Type'],'default_value',None))
try: gl.inputs['Type'].default_value='Bloom'; print("set glare type", gl.inputs['Type'].default_value)
except Exception as e: print("glare type err", e)
gl.inputs['Threshold'].default_value=0.8; gl.inputs['Strength'].default_value=0.5
ng.links.new(rl.outputs['Image'],gl.inputs['Image']); ng.links.new(gl.outputs['Image'],out.inputs['Image'])
sc.compositing_node_group=ng
print("use compositing", r.use_compositing)
# png
r.image_settings.file_format='PNG'; r.image_settings.color_mode='RGBA'; r.image_settings.color_depth='16'
r.filepath='/home/claude/probe/out/q_'; sc.frame_set(1)
t=time.time(); r.filepath='/home/claude/probe/out/still.png'; bpy.ops.render.render(write_still=True); print("still", time.time()-t, os.path.exists('/home/claude/probe/out/still.png'))
# exr
r.image_settings.file_format='OPEN_EXR'; r.image_settings.color_depth='16'; r.image_settings.exr_codec='DWAA'
r.filepath='/home/claude/probe/out/still.exr'; bpy.ops.render.render(write_still=True); print("exr", os.path.exists('/home/claude/probe/out/still.exr'))
# multilayer
try:
    r.image_settings.media_type='MULTI_LAYER_IMAGE'; print("ml fmt", r.image_settings.file_format)
except Exception as e: print("ml err",e)
# sequence png
r.image_settings.media_type='IMAGE'; r.image_settings.file_format='PNG'; r.image_settings.color_depth='8'
sc.frame_start=1; sc.frame_end=3; r.filepath='/home/claude/probe/out/seq_####'
bpy.ops.render.render(animation=True); print("seq", sorted(os.listdir('/home/claude/probe/out')))
# ffmpeg
try:
    r.image_settings.media_type='VIDEO'; print("fmt after VIDEO", r.image_settings.file_format)
    ff=r.ffmpeg; print("ff props",[p.identifier for p in ff.bl_rna.properties][:30])
    ff.format='MPEG4'; ff.codec='H264'; ff.constant_rate_factor='HIGH'; ff.ffmpeg_preset='GOOD'
    print("codecs",[e.identifier for e in ff.bl_rna.properties['codec'].enum_items])
    r.filepath='/home/claude/probe/out/video_'; bpy.ops.render.render(animation=True); print("vid", [f for f in os.listdir('/home/claude/probe/out') if f.startswith('video')])
except Exception as e: print("ff err", e)
# setting file_format FFMPEG directly
r.image_settings.media_type='IMAGE'
try: r.image_settings.file_format='FFMPEG'; print("direct ffmpeg ok", r.image_settings.media_type)
except Exception as e: print("direct ffmpeg err", e)
print("cm", sc.view_settings.view_transform, [e.identifier for e in sc.view_settings.bl_rna.properties['look'].enum_items][:3])
try: sc.view_settings.look='AgX - Punchy'; print('look ok')
except Exception as e: print('look err', e)
print("color mgmt display", sc.display_settings.display_device)
