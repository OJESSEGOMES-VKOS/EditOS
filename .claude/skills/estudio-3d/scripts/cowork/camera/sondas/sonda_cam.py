# Blender 5.2 | status: sonda executada no bpy 5.2.2 (nuvem); saída citada nos capítulos 04 e 07 | fonte: API https://docs.blender.org/api/current/
import bpy
sc=bpy.context.scene
print("VER", bpy.app.version_string)
cam=bpy.data.cameras.new("C")
print("CAM props", [p.identifier for p in cam.bl_rna.properties])
print("DOF props", [p.identifier for p in cam.dof.bl_rna.properties])
print("defaults lens",cam.lens,"sensor",cam.sensor_width,cam.sensor_height,cam.sensor_fit,"fstop",cam.dof.aperture_fstop,"use_dof",cam.dof.use_dof,"blades",cam.dof.aperture_blades,"clip",cam.clip_start,cam.clip_end)
print("sensor_fit enum",[e.identifier for e in cam.bl_rna.properties['sensor_fit'].enum_items])
print("lens_unit enum",[e.identifier for e in cam.bl_rna.properties['lens_unit'].enum_items])
print("type enum",[e.identifier for e in cam.bl_rna.properties['type'].enum_items])
r=sc.render
print("RENDER mb", r.use_motion_blur, r.motion_blur_shutter, [p.identifier for p in r.bl_rna.properties if 'motion' in p.identifier or 'shutter' in p.identifier])
print("mb pos enum", [e.identifier for e in r.bl_rna.properties['motion_blur_position'].enum_items] if 'motion_blur_position' in r.bl_rna.properties else None)
ee=sc.eevee
print("EEVEE props", [p.identifier for p in ee.bl_rna.properties])
cy=sc.cycles
print("CYCLES props", [p.identifier for p in cy.bl_rna.properties])
print("cycles defaults samples",cy.samples,"adapt",cy.use_adaptive_sampling,cy.adaptive_threshold,"min",cy.adaptive_min_samples,"denoise",cy.use_denoising,cy.denoiser,"maxb",cy.max_bounces,"diff",cy.diffuse_bounces,"gloss",cy.glossy_bounces,"trans",cy.transmission_bounces,"vol",cy.volume_bounces,"tr",cy.transparent_max_bounces,"clampd",cy.sample_clamp_direct,"clampi",cy.sample_clamp_indirect,"caus",cy.caustics_reflective,cy.caustics_refractive,"blurg",cy.blur_glossy)
for k in ['denoiser','device','denoising_input_passes','denoising_prefilter','denoising_quality','preview_denoiser']:
    if k in cy.bl_rna.properties:
        p=cy.bl_rna.properties[k]
        print("ENUM",k,[e.identifier for e in p.enum_items] if p.type=='ENUM' else p.type, getattr(cy,k))
print("persistent", r.use_persistent_data)
print("RENDER props", [p.identifier for p in r.bl_rna.properties])
