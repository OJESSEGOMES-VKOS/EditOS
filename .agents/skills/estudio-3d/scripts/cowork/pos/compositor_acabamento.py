# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (nós, menus e render na nuvem) | fonte: https://docs.blender.org/manual/en/latest/compositing/index.html , https://developer.blender.org/docs/release_notes/5.0/compositor/
"""
Compositor de acabamento comercial para Blender 5.2.
Cadeia: Render Layers > Glare (Bloom) > Lens Distortion (dispersão sutil) > Color Balance
        > Vinheta (Ellipse Mask + Blur + Map Range, multiplica) > Filter (Box Sharpen, fator baixo)
        > Grão (White Noise animado, multiplica) > Group Output.
Uso:  import compositor_acabamento as ca; ca.montar(bpy.context.scene, ca.PRESET_SUTIL)
"""
import bpy

PRESET_SUTIL = dict(
    bloom_threshold=1.0,   # só o que passa de 1,0 em luz de cena (reflexo, tela, filete) acende
    bloom_smooth=0.1,
    bloom_strength=0.35,   # 0,2 a 0,5; acima de 0,8 o produto ganha "névoa"
    bloom_size=0.5,        # 0,4 a 0,6 (fração da imagem no 5.x)
    distorcao=0.008,       # 0,005 a 0,015; POSITIVO = barril (sonda 5.2.2), Fit liga o zoom que esconde a quina preta
    dispersao=0.012,       # 0,01 a 0,02 (aberração cromática)
    lift=0.0, gamma=1.0, gain=1.0,
    vinheta=0.18,          # 0,12 a 0,25 de escurecimento na quina
    vinheta_tam=(1.15, 1.15),
    vinheta_blur=0.25,     # fração da maior dimensão
    grao=0.025,            # amplitude multiplicativa (2,5%); 0,015 a 0,04
    nitidez=0.06,          # fator do Box Sharpen; 0,04 a 0,10 (0,12 já fez anel escuro em filete emissivo a 360 px)
)

def _novo_grupo(nome="Acabamento"):
    ng = bpy.data.node_groups.get(nome)
    if ng:
        bpy.data.node_groups.remove(ng)
    ng = bpy.data.node_groups.new(nome, "CompositorNodeTree")
    ng.interface.new_socket("Image", in_out="OUTPUT", socket_type="NodeSocketColor")
    return ng

def montar(scene, p=PRESET_SUTIL, nome="Acabamento"):
    ng = _novo_grupo(nome)
    N, L = ng.nodes, ng.links
    rl = N.new("CompositorNodeRLayers"); rl.location = (-1400, 0)
    rl.scene = scene

    # 1. Glare tipo Bloom (substituto do Bloom do EEVEE Legacy)
    gl = N.new("CompositorNodeGlare"); gl.location = (-1150, 0)
    gl.inputs["Type"].default_value = "Bloom"
    gl.inputs["Quality"].default_value = "High"
    gl.inputs["Threshold"].default_value = p["bloom_threshold"]
    gl.inputs["Smoothness"].default_value = p["bloom_smooth"]
    gl.inputs["Strength"].default_value = p["bloom_strength"]
    gl.inputs["Size"].default_value = p["bloom_size"]
    L.new(rl.outputs["Image"], gl.inputs["Image"])

    # 2. Distorção de lente + aberração cromática
    ld = N.new("CompositorNodeLensdist"); ld.location = (-950, 0)
    ld.inputs["Type"].default_value = "Radial"
    ld.inputs["Distortion"].default_value = p["distorcao"]
    ld.inputs["Dispersion"].default_value = p["dispersao"]
    ld.inputs["Fit"].default_value = True      # positivo = barril e abre quina preta; Fit amplia e esconde (só age no positivo)
    L.new(gl.outputs["Image"], ld.inputs["Image"])

    # 3. Color Balance (Lift/Gamma/Gain)
    cb = N.new("CompositorNodeColorBalance"); cb.location = (-750, 0)
    cb.inputs["Type"].default_value = "Lift/Gamma/Gain"
    cb.inputs["Factor"].default_value = 1.0
    # sockets com nome repetido (valor e cor): pegamos o primeiro VALUE pelo índice
    def _val(nome):
        for s in cb.inputs:
            if s.name == nome and s.type == "VALUE":
                return s
    _val("Lift").default_value = p["lift"]
    _val("Gamma").default_value = p["gamma"]
    _val("Gain").default_value = p["gain"]
    L.new(ld.outputs["Image"], cb.inputs["Image"])

    # 4. Vinheta: elipse > blur > map range (0..1 -> 1-forca..1) > multiplica
    el = N.new("CompositorNodeEllipseMask"); el.location = (-950, -350)
    el.inputs["Size"].default_value = p["vinheta_tam"]
    rp = N.new("CompositorNodeRelativeToPixel"); rp.location = (-950, -550)
    rp.data_type = "FLOAT"; rp.reference_dimension = "Greater"
    _in = [s for s in rp.inputs if s.type == "VALUE"][0]; _in.default_value = p["vinheta_blur"]
    L.new(rl.outputs["Image"], rp.inputs["Image"])
    bl = N.new("CompositorNodeBlur"); bl.location = (-750, -350)
    bl.inputs["Type"].default_value = "Gaussian"
    bl.inputs["Extend Bounds"].default_value = False
    L.new(el.outputs["Mask"], bl.inputs["Image"])
    comb = N.new("ShaderNodeCombineXYZ"); comb.location = (-850, -550)
    _out = [o for o in rp.outputs if o.type == "VALUE"][0]
    L.new(_out, comb.inputs["X"]); L.new(_out, comb.inputs["Y"])
    L.new(comb.outputs["Vector"], bl.inputs["Size"])
    mr = N.new("ShaderNodeMapRange"); mr.location = (-550, -350)
    mr.inputs["To Min"].default_value = 1.0 - p["vinheta"]
    mr.inputs["To Max"].default_value = 1.0
    L.new(bl.outputs["Image"], mr.inputs["Value"])
    mv = N.new("ShaderNodeMix"); mv.location = (-350, 0)
    mv.data_type = "RGBA"; mv.blend_type = "MULTIPLY"
    mv.inputs["Factor"].default_value = 1.0
    L.new(cb.outputs["Image"], mv.inputs[6])        # A (cor)
    L.new(mr.outputs["Result"], mv.inputs[7])       # B (cor)

    # 5. Grão: ruído branco por pixel, muda a cada quadro, multiplicativo
    ic = N.new("CompositorNodeImageCoordinates"); ic.location = (-750, -750)
    L.new(rl.outputs["Image"], ic.inputs["Image"])
    st = N.new("CompositorNodeSceneTime"); st.location = (-750, -950)
    wn = N.new("ShaderNodeTexWhiteNoise"); wn.location = (-550, -750)
    wn.noise_dimensions = "4D"
    L.new(ic.outputs["Pixel"], wn.inputs["Vector"])
    L.new(st.outputs["Frame"], wn.inputs["W"])
    m1 = N.new("ShaderNodeMapRange"); m1.location = (-350, -750)
    m1.inputs["To Min"].default_value = 1.0 - p["grao"]
    m1.inputs["To Max"].default_value = 1.0 + p["grao"]
    L.new(wn.outputs["Value"], m1.inputs["Value"])
    mg = N.new("ShaderNodeMix"); mg.location = (-150, 0)
    mg.data_type = "RGBA"; mg.blend_type = "MULTIPLY"
    mg.inputs["Factor"].default_value = 1.0
    # 6. Nitidez leve ANTES do grão (se vier depois, o sharpen amplifica o grão e vira "areia preta")
    sh = N.new("CompositorNodeFilter"); sh.location = (-250, 200)
    sh.inputs["Type"].default_value = "Box Sharpen"
    sh.inputs["Factor"].default_value = p["nitidez"]
    L.new(mv.outputs[2], sh.inputs["Image"])
    L.new(sh.outputs["Image"], mg.inputs[6])
    L.new(m1.outputs["Result"], mg.inputs[7])

    out = N.new("NodeGroupOutput"); out.location = (250, 0)
    L.new(mg.outputs[2], out.inputs[0])
    vw = N.new("CompositorNodeViewer"); vw.location = (250, -200)
    L.new(mg.outputs[2], vw.inputs["Image"])

    scene.compositing_node_group = ng
    scene.render.use_compositing = True
    return ng

if __name__ == "__main__":
    montar(bpy.context.scene)
    print("compositor montado:", bpy.context.scene.compositing_node_group.name)
