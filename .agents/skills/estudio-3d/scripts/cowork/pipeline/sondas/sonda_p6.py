# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (saida registrada no capitulo 09) | fonte: sonda propria
import bpy, os, time
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene; r=sc.render
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.5)
bpy.ops.object.light_add(type='AREA', location=(2,-2,3)); bpy.context.active_object.data.energy=300
bpy.ops.object.camera_add(location=(0,-4,0.5), rotation=(1.47,0,0)); sc.camera=bpy.context.active_object
r.resolution_x=320; r.resolution_y=320
r.engine='CYCLES'; sc.cycles.samples=16; sc.cycles.device='CPU'
print("cycles props", [p for p in ('use_denoising','denoiser','adaptive_threshold','use_adaptive_sampling','time_limit') if hasattr(sc.cycles,p)], sc.cycles.denoiser)
sc.frame_start=1; sc.frame_end=12
r.image_settings.media_type='VIDEO'
r.ffmpeg.format='MPEG4'; r.ffmpeg.codec='H264'; r.ffmpeg.constant_rate_factor='HIGH'; r.ffmpeg.ffmpeg_preset='GOOD'
print("formats", [e.identifier for e in r.ffmpeg.bl_rna.properties['format'].enum_items])
print("crf", [e.identifier for e in r.ffmpeg.bl_rna.properties['constant_rate_factor'].enum_items])
r.filepath='/home/claude/probe/out/video_'
t=time.time(); bpy.ops.render.render(animation=True); print("vid", time.time()-t, [f for f in os.listdir('/home/claude/probe/out') if f.startswith('video')])
r.image_settings.media_type='IMAGE'
try: r.image_settings.file_format='FFMPEG'; print("direct ffmpeg ok", r.image_settings.media_type)
except Exception as e: print("direct ffmpeg err", e)
r.image_settings.media_type='IMAGE'; r.image_settings.file_format='PNG'
r.engine='BLENDER_WORKBENCH'; r.filepath='/home/claude/probe/out/wb.png'
t=time.time(); bpy.ops.render.render(write_still=True); print("workbench", time.time()-t)
print("cm", sc.view_settings.view_transform, sc.view_settings.look)
sc.view_settings.look='AgX - Punchy'; print('look ok', sc.view_settings.look)
print("display", sc.display_settings.display_device)
print("units", sc.unit_settings.system, sc.unit_settings.length_unit, sc.unit_settings.scale_length)
