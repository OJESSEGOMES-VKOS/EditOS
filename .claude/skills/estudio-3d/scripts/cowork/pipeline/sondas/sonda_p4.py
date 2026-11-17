# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (saida registrada no capitulo 09) | fonte: sonda propria
import bpy
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene
print("comp group", sc.compositing_node_group)
ng=bpy.data.node_groups.new("Comp",'CompositorNodeTree')
print("iface", [ (i.name,i.in_out) for i in ng.interface.items_tree])
ng.interface.new_socket("Image",in_out='OUTPUT',socket_type='NodeSocketColor')
rl=ng.nodes.new('CompositorNodeRLayers')
for t in ['CompositorNodeGlare','CompositorNodeLensdist','CompositorNodeEllipseMask','CompositorNodeComposite','CompositorNodeViewer','NodeGroupOutput','CompositorNodeBrightContrast','CompositorNodeColorBalance','CompositorNodeMixRGB','ShaderNodeMix','CompositorNodeFilmGrain' ,'CompositorNodeDefocus','CompositorNodeBlur','CompositorNodeVignette']:
    try: n=ng.nodes.new(t); print("NODE OK",t, [i.name for i in n.inputs][:12])
    except Exception as e: print("NODE ERR",t,str(e)[:80])
sc.compositing_node_group=ng
print("rl outs",[o.name for o in rl.outputs][:6])
r=sc.render
print("engines", [e.identifier for e in r.bl_rna.properties['engine'].enum_items])
ims=r.image_settings
print("ims props",[p.identifier for p in ims.bl_rna.properties][:60])
print("media_type", getattr(ims,'media_type',None), "file_format", ims.file_format)
for mt in [e.identifier for e in ims.bl_rna.properties['media_type'].enum_items] if hasattr(ims,'media_type') else []:
    print("MT", mt)
print("formats", [e.identifier for e in ims.bl_rna.properties['file_format'].enum_items])
