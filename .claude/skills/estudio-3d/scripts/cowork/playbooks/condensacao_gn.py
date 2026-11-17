# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 | fonte: API bpy 5.2.2; método análogo ao de Joey Carlino (BlenderNation 2022) e à prática de estúdio (glicerina 1:1)
# Condensação em lata/garrafa: gotas meia-esfera distribuídas por Poisson, achatadas e alinhadas à normal.
import bpy
from _util import gn_grupo

def mat_agua():
    m = bpy.data.materials.new("Gota_Agua")
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Transmission Weight"].default_value = 1.0
    p.inputs["Roughness"].default_value = 0.0
    p.inputs["IOR"].default_value = 1.33
    return m

def condensacao(ob, densidade=60000, dist_min=0.0012, r_min=0.0004, r_max=0.0016, achatar=0.45, semente=7):
    """densidade em pontos/m² (60 mil = ~6 por cm²). Raios em metros (0,4 a 1,6 mm numa lata de 66 mm)."""
    ng, gi, go = gn_grupo("Condensacao")
    n = ng.nodes; L = ng.links.new
    dist = n.new('GeometryNodeDistributePointsOnFaces'); dist.distribute_method = 'POISSON'
    dist.inputs["Distance Min"].default_value = dist_min
    dist.inputs["Density Max"].default_value = densidade
    dist.inputs["Seed"].default_value = semente
    ico = n.new('GeometryNodeMeshIcoSphere'); ico.inputs["Radius"].default_value = 1.0; ico.inputs["Subdivisions"].default_value = 2
    rnd = n.new('FunctionNodeRandomValue'); rnd.data_type = 'FLOAT'
    rnd.inputs["Min"].default_value = r_min; rnd.inputs["Max"].default_value = r_max
    # escala não uniforme: Z (normal) achatado => gota "deitada" na superfície
    comb = n.new('ShaderNodeCombineXYZ')
    mz = n.new('ShaderNodeMath'); mz.operation = 'MULTIPLY'; mz.inputs[1].default_value = achatar
    L(rnd.outputs["Value"], comb.inputs[0]); L(rnd.outputs["Value"], comb.inputs[1])
    L(rnd.outputs["Value"], mz.inputs[0]); L(mz.outputs[0], comb.inputs[2])
    inst = n.new('GeometryNodeInstanceOnPoints')
    L(gi.outputs[0], dist.inputs["Mesh"])
    L(dist.outputs["Points"], inst.inputs["Points"])
    L(ico.outputs["Mesh"], inst.inputs["Instance"])
    L(dist.outputs["Rotation"], inst.inputs["Rotation"])   # Z da gota = normal da lata
    L(comb.outputs[0], inst.inputs["Scale"])
    sm = n.new('GeometryNodeSetMaterial'); sm.inputs["Material"].default_value = mat_agua()
    L(inst.outputs[0], sm.inputs["Geometry"])
    j = n.new('GeometryNodeJoinGeometry')
    L(sm.outputs[0], j.inputs[0]); L(gi.outputs[0], j.inputs[0])
    L(j.outputs[0], go.inputs[0])
    mod = ob.modifiers.new("Condensacao", 'NODES'); mod.node_group = ng
    return mod

if __name__ == "__main__":
    # lata 350 ml: 66 mm de diâmetro x 122 mm [medida aproximada, não verificado]
    bpy.ops.mesh.primitive_cylinder_add(radius=0.033, depth=0.122, vertices=64)
    lata = bpy.context.object
    condensacao(lata)
    dg = bpy.context.evaluated_depsgraph_get()
    n = sum(1 for i in dg.object_instances if i.is_instance)
    print("OK condensacao gotas instanciadas:", n)
