# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 | fonte: API bpy 5.2.2 (ShaderNodeVolumePrincipled, ShaderNodeTexNoise 4D)
# Vapor de comida/café sem simulação: cubo com volume, densidade = ruído 4D x gradiente vertical, W animado.
import bpy

def vapor(ob, densidade=2.0, escala_ruido=18.0, sobe_m_por_seg=0.04, fps=30, quadros=150):
    m = bpy.data.materials.new("Vapor")
    nt = m.node_tree; N = nt.nodes; L = nt.links.new
    N.remove(N["Principled BSDF"])
    out = N["Material Output"]
    vol = N.new('ShaderNodeVolumePrincipled')
    vol.inputs["Color"].default_value = (0.95, 0.95, 0.95, 1)
    vol.inputs["Anisotropy"].default_value = 0.6   # espalha pra frente: brilha com contraluz (como na foto real)
    tc = N.new('ShaderNodeTexCoord')
    mp = N.new('ShaderNodeMapping')                 # desloca o ruído pra cima com o tempo
    nz = N.new('ShaderNodeTexNoise'); nz.noise_dimensions = '4D'
    nz.inputs["Scale"].default_value = escala_ruido; nz.inputs["Detail"].default_value = 4; nz.inputs["Distortion"].default_value = 0.6
    cr = N.new('ShaderNodeValToRGB')               # corta o ruído em fiapos
    cr.color_ramp.elements[0].position = 0.52; cr.color_ramp.elements[1].position = 0.75
    sep = N.new('ShaderNodeSeparateXYZ')
    fade = N.new('ShaderNodeMapRange')               # some no topo (Z gerado 0..1): 1 embaixo, 0 em cima
    fade.inputs["From Min"].default_value = 0.0; fade.inputs["From Max"].default_value = 1.0
    fade.inputs["To Min"].default_value = 1.0; fade.inputs["To Max"].default_value = 0.0
    mul = N.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'
    mul2 = N.new('ShaderNodeMath'); mul2.operation = 'MULTIPLY'; mul2.inputs[1].default_value = densidade
    L(tc.outputs["Object"], mp.inputs["Vector"]); L(mp.outputs[0], nz.inputs["Vector"])
    L(nz.outputs["Factor"] if "Factor" in nz.outputs else nz.outputs[0], cr.inputs[0])
    L(tc.outputs["Generated"], sep.inputs[0]); L(sep.outputs["Z"], fade.inputs["Value"])
    L(cr.outputs[0], mul.inputs[0]); L(fade.outputs[0], mul.inputs[1])
    L(mul.outputs[0], mul2.inputs[0]); L(mul2.outputs[0], vol.inputs["Density"])
    L(vol.outputs[0], out.inputs["Volume"])
    # animação: o ruído desce no mapeamento (= vapor sobe) e W muda a forma
    loc = mp.inputs["Location"]
    loc.default_value[2] = 0; loc.keyframe_insert("default_value", index=2, frame=1)
    loc.default_value[2] = -sobe_m_por_seg * quadros / fps; loc.keyframe_insert("default_value", index=2, frame=quadros)
    w = nz.inputs["W"]; w.default_value = 0; w.keyframe_insert("default_value", frame=1)
    w.default_value = 1.5; w.keyframe_insert("default_value", frame=quadros)
    from bpy_extras import anim_utils
    ad = nt.animation_data
    for fc in anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot).fcurves:
        for k in fc.keyframe_points: k.interpolation = 'LINEAR'
    ob.data.materials.append(m)
    return m

if __name__ == "__main__":
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.12)); c = bpy.context.object
    c.scale = (0.06, 0.06, 0.12)   # caixa de vapor acima da xícara (12 x 12 x 24 cm)
    vapor(c); print("OK vapor", [n.bl_idname for n in c.data.materials[0].node_tree.nodes][:4])
