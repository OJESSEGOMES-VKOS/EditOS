# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 | fonte: API bpy 5.2.2 (ShaderNodeMapping, ShaderNodeTexImage.extension)
# Rolagem de tela por deslocamento de UV: um PNG alto (a página inteira do Figma) desliza dentro da tela.
import bpy
from _util import interpolar

def montar_rolagem(mat, img, altura_pagina_px, altura_tela_px, quadros):
    """quadros = lista de (quadro, rolagem_em_px_do_Figma). Ex.: [(1,0),(30,0),(54,620),(84,620)]"""
    nt = mat.node_tree
    p = nt.nodes["Principled BSDF"]
    uv = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping"); mp.name = "Rolagem"
    tex = nt.nodes.new("ShaderNodeTexImage"); tex.image = img
    tex.extension = 'CLIP'          # fora da página fica transparente/preto, sem repetir
    tex.interpolation = 'Cubic'
    # A tela mostra só uma "janela" da página: escala Y = altura_tela / altura_pagina
    janela = altura_tela_px / altura_pagina_px
    mp.inputs["Scale"].default_value = (1, janela, 1)
    nt.links.new(uv.outputs["UV"], mp.inputs["Vector"])
    nt.links.new(mp.outputs["Vector"], tex.inputs["Vector"])
    nt.links.new(tex.outputs["Color"], p.inputs["Emission Color"])
    nt.links.new(tex.outputs["Color"], p.inputs["Base Color"])
    p.inputs["Emission Strength"].default_value = 1.0
    sock = mp.inputs["Location"]
    for q, px in quadros:
        # topo da página = 1 - janela; rolar px desce a janela
        sock.default_value[1] = (1 - janela) - px / altura_pagina_px
        sock.keyframe_insert("default_value", index=1, frame=q)
    # easing nas chaves do material
    ad = nt.animation_data
    from bpy_extras import anim_utils
    for fc in anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot).fcurves:
        for k in fc.keyframe_points:
            k.interpolation = 'BEZIER'; k.handle_left_type = k.handle_right_type = 'AUTO_CLAMPED'
    return mp

if __name__ == "__main__":
    img = bpy.data.images.new("pagina", 1170, 7500)   # página de 2500 pt de altura exportada em 3x
    m = bpy.data.materials.new("Tela")
    montar_rolagem(m, img, 7500, 2532, [(1, 0), (30, 0), (54, 1800), (66, 1800), (84, 3600)])
    print("OK rolagem", m.node_tree.nodes["Rolagem"].inputs["Location"].default_value[:])
