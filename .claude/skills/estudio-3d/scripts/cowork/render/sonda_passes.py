# Blender 5.2 | status: sonda executada no bpy 5.2.2 (nuvem); saída citada nos capítulos 04 e 07 | fonte: API https://docs.blender.org/api/current/
import bpy
sc=bpy.context.scene; ee=sc.eevee
ro=ee.ray_tracing_options
print("rt res enum",[e.identifier for e in ro.bl_rna.properties['resolution_scale'].enum_items])
print("fast_gi_method",[e.identifier for e in ee.bl_rna.properties['fast_gi_method'].enum_items], ee.fast_gi_method)
print("shadow_resolution_scale", ee.shadow_resolution_scale, "pool", ee.shadow_pool_size, [e.identifier for e in ee.bl_rna.properties['shadow_pool_size'].enum_items])
print("compositor_device",[e.identifier for e in sc.render.bl_rna.properties['compositor_device'].enum_items])
print("vol tile",[e.identifier for e in ee.bl_rna.properties['volumetric_tile_size'].enum_items], ee.volumetric_tile_size, ee.volumetric_samples)
vl=sc.view_layers[0]
vl.use_pass_z=True; vl.use_pass_normal=True; vl.use_pass_vector=True; vl.use_pass_mist=True
vl.use_pass_cryptomatte_object=True; vl.use_pass_cryptomatte_material=True
vl.use_pass_diffuse_direct=True; vl.use_pass_glossy_direct=True; vl.use_pass_emit=True; vl.use_pass_ambient_occlusion=True
vl.use_pass_shadow=True
vl.cycles.denoising_store_passes=True
a=vl.aovs.add(); a.name="mascara_tela"; a.type='VALUE'
for eng in ['CYCLES','BLENDER_EEVEE']:
    sc.render.engine=eng
    ng=bpy.data.node_groups.new("cmp"+eng,'CompositorNodeTree')
    rl=ng.nodes.new('CompositorNodeRLayers')
    print(eng,"RL outputs:",[o.name for o in rl.outputs if o.enabled])
print("aov valid",a.is_valid)
n=bpy.data.materials.new("m").node_tree.nodes.new('ShaderNodeOutputAOV'); print("AOV node props",[p.identifier for p in n.bl_rna.properties if p.identifier in('aov_name','name')], [i.name for i in n.inputs])
print("crypto depth", vl.pass_cryptomatte_depth, vl.use_pass_cryptomatte_accurate if hasattr(vl,'use_pass_cryptomatte_accurate') else None)
print("cycles layer props", vl.cycles.denoising_store_passes)
print("film_transparent", sc.render.film_transparent, "transp glass", sc.cycles.film_transparent_glass)
print("guiding default", sc.cycles.use_guiding, "light tree", sc.cycles.use_light_tree)
print("texture_limit", sc.cycles.texture_limit_render, "simplify", sc.render.use_simplify)
