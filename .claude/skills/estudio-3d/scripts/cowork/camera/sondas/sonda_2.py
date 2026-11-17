# Blender 5.2 | status: sonda executada no bpy 5.2.2 (nuvem); saída citada nos capítulos 04 e 07 | fonte: API https://docs.blender.org/api/current/
import bpy
sc=bpy.context.scene; cy=sc.cycles
for v in ['OPTIX','OPENIMAGEDENOISE']:
    try: cy.denoiser=v; print("denoiser set",v,"ok ->",cy.denoiser)
    except Exception as e: print("denoiser",v,"ERR",e)
vl=sc.view_layers[0]
print("VL props",[p.identifier for p in vl.bl_rna.properties if p.identifier.startswith('use_pass') or 'crypto' in p.identifier or 'aov' in p.identifier or 'denois' in p.identifier])
print("VL cycles props",[p.identifier for p in vl.cycles.bl_rna.properties])
print("VL eevee props",[p.identifier for p in vl.eevee.bl_rna.properties])
a=vl.aovs.add(); print("AOV props",[p.identifier for p in a.bl_rna.properties], [e.identifier for e in a.bl_rna.properties['type'].enum_items])
print("texture_limit_render enum",[e.identifier for e in cy.bl_rna.properties['texture_limit_render'].enum_items], cy.texture_limit_render)
print("use_texture_cache", sc.render.use_texture_cache, sc.render.use_auto_generate_texture_cache)
print("pixel filter",[e.identifier for e in cy.bl_rna.properties['pixel_filter_type'].enum_items], cy.pixel_filter_type, cy.filter_width)
print("rolling", [e.identifier for e in cy.bl_rna.properties['rolling_shutter_type'].enum_items])
print("eevee defaults taa_render",sc.eevee.taa_render_samples,"mb_steps",sc.eevee.motion_blur_steps,"mb_max",sc.eevee.motion_blur_max,"raytracing",sc.eevee.use_raytracing,"method",sc.eevee.ray_tracing_method,"shadow_ray",sc.eevee.shadow_ray_count,sc.eevee.shadow_step_count,"res scale",sc.eevee.shadow_resolution_scale,"fastgi",sc.eevee.use_fast_gi,"bokeh",sc.eevee.bokeh_max_size,"clamp",sc.eevee.clamp_surface_indirect, "overscan", sc.eevee.use_overscan)
ro=sc.eevee.ray_tracing_options
print("RT opts",[(p.identifier, getattr(ro,p.identifier)) for p in ro.bl_rna.properties if p.identifier!='rna_type'])
print("rt method enum",[e.identifier for e in sc.eevee.bl_rna.properties['ray_tracing_method'].enum_items])
ff=sc.render.ffmpeg
print("FFMPEG props",[(p.identifier, getattr(ff,p.identifier)) for p in ff.bl_rna.properties if p.identifier!='rna_type'])
for k in ['audio_codec','audio_channels','ffmpeg_preset','video_profile' ]:
    if k in ff.bl_rna.properties: print("ENUM",k,[e.identifier for e in ff.bl_rna.properties[k].enum_items])
ims=sc.render.image_settings
print("ims props",[p.identifier for p in ims.bl_rna.properties])
print("exr codecs",[e.identifier for e in ims.bl_rna.properties['exr_codec'].enum_items])
# constraints
o=bpy.data.objects.new("e",None)
for t in ['TRACK_TO','DAMPED_TRACK','FOLLOW_PATH','CHILD_OF','COPY_LOCATION','LIMIT_DISTANCE','PIVOT','LOCKED_TRACK']:
    c=o.constraints.new(t); print("CON",t,[p.identifier for p in c.bl_rna.properties if p.identifier not in ('rna_type',)])
# prefs
try:
    pr=bpy.context.preferences.addons['cycles'].preferences
    print("compute_device_type enum",[e.identifier for e in pr.bl_rna.properties['compute_device_type'].enum_items])
except Exception as e: print("prefs ERR",e)
# keyframe props
bpy.ops.mesh.primitive_cube_add(); c=bpy.context.active_object
c.keyframe_insert("location",frame=1)
from bpy_extras import anim_utils
cb=anim_utils.action_get_channelbag_for_slot(c.animation_data.action,c.animation_data.action_slot)
k=cb.fcurves[0].keyframe_points[0]
print("KF props",[p.identifier for p in k.bl_rna.properties])
print("interp",[e.identifier for e in k.bl_rna.properties['interpolation'].enum_items])
print("easing",[e.identifier for e in k.bl_rna.properties['easing'].enum_items])
print("handle",[e.identifier for e in k.bl_rna.properties['handle_left_type'].enum_items])
fc=cb.fcurves[0]
print("FC props",[p.identifier for p in fc.bl_rna.properties])
m=fc.modifiers.new('NOISE'); print("NOISE", [(p.identifier,getattr(m,p.identifier)) for p in m.bl_rna.properties if p.identifier not in('rna_type',)])
print("mod types",[e.identifier for e in bpy.types.FModifier.bl_rna.properties['type'].enum_items])
print("prefs keyframe default", bpy.context.preferences.edit.keyframe_new_interpolation_type, bpy.context.preferences.edit.keyframe_new_handle_type)
