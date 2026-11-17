# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (nós existem e a malha é gerada) | fonte: API bpy 5.2.2 (GeometryNodePointsToSDFGrid, GeometryNodeGridToMesh)
# Meio-termo de splash: pontos animados (partículas, keyframes ou um "spline de gotas") viram superfície líquida
# por campo de distância (SDF), como metaballs modernos. Direção de arte total, zero simulação.
import bpy
from _util import gn_grupo

def splash_sdf(ob, raio=0.006, voxel=0.0015, limiar=0.0, mat=None):
    ng, gi, go = gn_grupo("Splash_SDF")
    n = ng.nodes
    m2p = n.new('GeometryNodeMeshToPoints')            # cada vértice do objeto vira uma gota
    sdf = n.new('GeometryNodePointsToSDFGrid')
    sdf.inputs["Radius"].default_value = raio           # raio da gota (m): 4 a 8 mm em produto de 15 cm
    sdf.inputs["Voxel Size"].default_value = voxel      # 1/4 do raio = liso; 1/2 = rápido e facetado
    g2m = n.new('GeometryNodeGridToMesh')
    g2m.inputs["Threshold"].default_value = limiar      # >0 encolhe e separa gotas; <0 engorda e funde
    sm = n.new('GeometryNodeSetShadeSmooth')
    ng.links.new(gi.outputs[0], m2p.inputs["Mesh"])
    ng.links.new(m2p.outputs["Points"], sdf.inputs["Points"])
    ng.links.new(sdf.outputs[0], g2m.inputs["Grid"])
    last = sm
    ng.links.new(g2m.outputs[0], sm.inputs["Mesh"])
    if mat:
        sm2 = n.new('GeometryNodeSetMaterial'); sm2.inputs["Material"].default_value = mat
        ng.links.new(sm.outputs[0], sm2.inputs["Geometry"]); last = sm2
    ng.links.new(last.outputs[0], go.inputs[0])
    mod = ob.modifiers.new("Splash_SDF", 'NODES'); mod.node_group = ng
    return mod

if __name__ == "__main__":
    import random
    me = bpy.data.meshes.new("gotas")
    random.seed(3)
    pts = [(random.gauss(0, 0.02), random.gauss(0, 0.02), abs(random.gauss(0.03, 0.02))) for _ in range(120)]
    me.from_pydata(pts, [], []); ob = bpy.data.objects.new("Gotas", me); bpy.context.collection.objects.link(ob)
    splash_sdf(ob)
    dg = bpy.context.evaluated_depsgraph_get(); ev = ob.evaluated_get(dg)
    print("OK splash SDF vertices:", len(ev.to_mesh().vertices))
