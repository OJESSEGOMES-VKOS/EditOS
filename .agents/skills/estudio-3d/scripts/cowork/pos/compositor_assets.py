# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (assets do compositing_nodes_essentials.blend; render na nuvem) | fonte: https://blog.cgcookie.com/posts/everything-new-in-blender-5-0/ , https://www.blender.org/download/releases/5-0/
"""
Variante do acabamento usando os ASSETS ESSENCIAIS do compositor (Blender 5.x):
'Vignette', 'Film Grain', 'Chromatic Aberration', 'Unsharp Mask' vêm em
<blender>/5.2/datafiles/assets/nodes/compositing_nodes_essentials.blend
e aparecem na interface no Asset Shelf / Add > (Essentials). Aqui são anexados (append) por script.
Cadeia: Render Layers > Glare Bloom > Chromatic Aberration > Color Balance > Vignette > Unsharp Mask > Film Grain > Group Output
"""
import bpy, os

def caminho_essentials():
    cands = [os.path.join(p, "datafiles", "assets", "nodes", "compositing_nodes_essentials.blend")
             for p in (bpy.utils.resource_path("LOCAL"), bpy.utils.resource_path("SYSTEM"))]
    for c in cands:
        if os.path.exists(c):
            return c
    raise FileNotFoundError("compositing_nodes_essentials.blend não encontrado: " + str(cands))

def anexar(nomes):
    falt = [n for n in nomes if n not in bpy.data.node_groups]
    if falt:
        with bpy.data.libraries.load(caminho_essentials(), link=False) as (src, dst):
            dst.node_groups = [n for n in src.node_groups if n in falt]
    return {n: bpy.data.node_groups[n] for n in nomes}

PRESET = dict(
    bloom_threshold=1.0, bloom_strength=0.35, bloom_size=0.5,
    ca_tipo="Lens Dispersion", ca_fator=0.05,          # [testar no Blender] escala própria do asset
    vin_fator=0.35, vin_feather=0.6, vin_escala=(0.95, 0.95), vin_round=1.0,
    usm_raio=2.0, usm_fator=0.25, usm_limiar=0.02,
    grao_preset="35 mm Portra 400", grao_fator=0.35, grao_animado=True,
)

def grupo(N, ng, loc):
    n = N.new("CompositorNodeGroup"); n.node_tree = ng; n.location = loc
    return n

def montar(scene, p=PRESET, nome="Acabamento Assets"):
    g = anexar(["Vignette", "Film Grain", "Chromatic Aberration", "Unsharp Mask"])
    old = bpy.data.node_groups.get(nome)
    if old: bpy.data.node_groups.remove(old)
    ng = bpy.data.node_groups.new(nome, "CompositorNodeTree")
    ng.interface.new_socket("Image", in_out="OUTPUT", socket_type="NodeSocketColor")
    N, L = ng.nodes, ng.links
    rl = N.new("CompositorNodeRLayers"); rl.location = (-1400, 0); rl.scene = scene
    gl = N.new("CompositorNodeGlare"); gl.location = (-1200, 0)
    gl.inputs["Type"].default_value = "Bloom"; gl.inputs["Quality"].default_value = "High"
    gl.inputs["Threshold"].default_value = p["bloom_threshold"]
    gl.inputs["Strength"].default_value = p["bloom_strength"]
    gl.inputs["Size"].default_value = p["bloom_size"]
    L.new(rl.outputs["Image"], gl.inputs["Image"])
    ca = grupo(N, g["Chromatic Aberration"], (-1000, 0))
    ca.inputs["Type"].default_value = p["ca_tipo"]; ca.inputs["Factor"].default_value = p["ca_fator"]
    ca.inputs["Fit"].default_value = True
    L.new(gl.outputs["Image"], ca.inputs["Image"])
    cb = N.new("CompositorNodeColorBalance"); cb.location = (-800, 0)
    cb.inputs["Type"].default_value = "Lift/Gamma/Gain"
    L.new(ca.outputs["Image"], cb.inputs["Image"])
    vi = grupo(N, g["Vignette"], (-600, 0))
    vi.inputs["Factor"].default_value = p["vin_fator"]; vi.inputs["Feather"].default_value = p["vin_feather"]
    vi.inputs["Scale"].default_value = p["vin_escala"]; vi.inputs["Corner Roundness"].default_value = p["vin_round"]
    L.new(cb.outputs["Image"], vi.inputs["Image"])
    us = grupo(N, g["Unsharp Mask"], (-400, 0))
    us.inputs["Radius"].default_value = p["usm_raio"]; us.inputs["Factor"].default_value = p["usm_fator"]
    us.inputs["Threshold"].default_value = p["usm_limiar"]
    L.new(vi.outputs["Image"], us.inputs["Image"])
    fg = grupo(N, g["Film Grain"], (-200, 0))
    fg.inputs["Preset"].default_value = p["grao_preset"]; fg.inputs["Factor"].default_value = p["grao_fator"]
    fg.inputs["Animated"].default_value = p["grao_animado"]
    L.new(us.outputs["Result"], fg.inputs["Input"])
    out = N.new("NodeGroupOutput"); out.location = (0, 0)
    L.new(fg.outputs["Result"], out.inputs[0])
    scene.compositing_node_group = ng
    scene.render.use_compositing = True
    return ng

if __name__ == "__main__":
    montar(bpy.context.scene)
