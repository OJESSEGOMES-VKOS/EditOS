# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (saida registrada no capitulo 09) | fonte: sonda propria
import bpy, addon_utils
bpy.ops.wm.read_factory_settings(use_empty=True)
# GN
ng=bpy.data.node_groups.new("GN_Grade",'GeometryNodeTree')
ng.interface.new_socket("Geometry",in_out='INPUT',socket_type='NodeSocketGeometry')
ng.interface.new_socket("Geometry",in_out='OUTPUT',socket_type='NodeSocketGeometry')
s=ng.interface.new_socket("Contagem",in_out='INPUT',socket_type='NodeSocketInt'); s.default_value=5; s.min_value=1
n=ng.nodes
gi=n.new('NodeGroupInput'); go=n.new('NodeGroupOutput')
grid=n.new('GeometryNodeMeshGrid'); print("grid inputs",[i.name for i in grid.inputs])
pts=n.new('GeometryNodeMeshToPoints')
inst=n.new('GeometryNodeInstanceOnPoints')
cube=n.new('GeometryNodeMeshCube'); cube.inputs['Size'].default_value=(0.2,0.2,0.2)
real=n.new('GeometryNodeRealizeInstances')
join=n.new('GeometryNodeJoinGeometry')
L=ng.links.new
L(gi.outputs['Contagem'],grid.inputs['Vertices X']); L(gi.outputs['Contagem'],grid.inputs['Vertices Y'])
L(grid.outputs['Mesh'],pts.inputs['Mesh']); L(pts.outputs['Points'],inst.inputs['Points'])
L(cube.outputs['Mesh'],inst.inputs['Instance']); L(inst.outputs['Instances'],real.inputs['Geometry'])
L(real.outputs['Geometry'],join.inputs['Geometry']); L(gi.outputs['Geometry'],join.inputs['Geometry'])
L(join.outputs['Geometry'],go.inputs['Geometry'])
bpy.ops.mesh.primitive_plane_add(size=0.1); o=bpy.context.active_object
mod=o.modifiers.new("GN",'NODES'); mod.node_group=ng
print("ident",[ (it.name,it.identifier) for it in ng.interface.items_tree])
sid=[it.identifier for it in ng.interface.items_tree if it.name=='Contagem'][0]
getattr(mod.properties.inputs, sid).value=4
dg=bpy.context.evaluated_depsgraph_get(); ev=o.evaluated_get(dg)
print("verts GN", len(ev.data.vertices))
# text
c=bpy.data.curves.new("Titulo",type='FONT'); c.body="VK 5.2"; c.extrude=0.02; c.bevel_depth=0.004; c.bevel_resolution=3
c.align_x='CENTER'; c.align_y='CENTER'; c.size=0.3
print("font default", c.font.name, c.font.filepath)
import glob
fs=['/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf']
print("ttf found", fs[:3])
if fs:
    f=bpy.data.fonts.load(fs[0], check_existing=True); c.font=f; print("loaded",f.name)
t=bpy.data.objects.new("Titulo",c); bpy.context.scene.collection.objects.link(t)
print("text attrs", [a for a in ('offset','space_character','space_word','space_line','body_format','resolution_u','use_fill_deform','fill_mode') if hasattr(c,a)])
bpy.context.view_layer.objects.active=t; t.select_set(True)
me=bpy.data.meshes.new_from_object(t.evaluated_get(bpy.context.evaluated_depsgraph_get()))
print("text mesh verts", len(me.vertices))
try:
    bpy.ops.object.convert(target='MESH'); print("convert ok", t.type)
except Exception as e: print("convert err", e)
# operators existence
for op in ['import_curve.svg','wm.grease_pencil_import_svg','wm.svg_import','import_scene.gltf','export_scene.gltf','import_scene.fbx','export_scene.fbx','wm.obj_import','wm.stl_import','wm.usd_import','wm.ply_import','wm.alembic_import']:
    mod_,name=op.split('.')
    try:
        ok=hasattr(getattr(bpy.ops,mod_),name) and getattr(getattr(bpy.ops,mod_),name).get_rna_type() is not None
    except Exception as e: ok=f"ERR {e}"
    print("OP",op,ok)
print("addons enabled", sorted(bpy.context.preferences.addons.keys()))
print("addons avail", sorted(m.__name__ for m in addon_utils.modules())[:60])
