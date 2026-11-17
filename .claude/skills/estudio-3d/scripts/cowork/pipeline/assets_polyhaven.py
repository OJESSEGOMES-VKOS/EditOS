# Blender 5.2 | status: importacao confirmada por sonda no bpy 5.2.2 com arquivo local; download a testar (rede da nuvem bloqueia api.polyhaven.com) | fonte: https://github.com/Poly-Haven/Public-API , https://api.polyhaven.com/files/brown_photostudio_02
"""Baixa HDRI e textura do Poly Haven e monta no Blender.

Termos da API (ToS): uso livre inclusive comercial, MAS toda chamada precisa
de User-Agent/Referer unico com o nome da sua ferramenta, e software que
mostra conteudo da API ao usuario precisa dizer de onde vem ("Powered by
Poly Haven"). Os assets em si sao CC0 (sem atribuicao obrigatoria).

Uso:
  blender -b -P assets_polyhaven.py -- --hdri brown_photostudio_02 --res 2k
  blender -b -P assets_polyhaven.py -- --textura rusty_metal_02 --res 1k
"""
import json
import os
import sys
import urllib.request

import bpy

API = "https://api.polyhaven.com"
UA = {"User-Agent": "EditOS-Estudio3D/1.0 (pipeline Blender; contato: estudio)"}
CACHE = os.path.expanduser("~/.cache/estudio_assets/polyhaven")


def _get_json(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())


def _baixar(url, destino):
    if os.path.exists(destino) and os.path.getsize(destino) > 0:
        return destino  # cache local: nunca baixar duas vezes
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=120) as r, open(destino, "wb") as f:
        f.write(r.read())
    return destino


def listar(tipo="hdris", categoria=None):
    """tipo: hdris, textures, models. Devolve dict id -> info."""
    url = f"{API}/assets?t={tipo}" + (f"&c={categoria}" if categoria else "")
    return _get_json(url)


def baixar_hdri(asset_id, res="2k", fmt="exr"):
    arq = _get_json(f"{API}/files/{asset_id}")
    url = arq["hdri"][res][fmt]["url"]
    return _baixar(url, os.path.join(CACHE, "hdri", os.path.basename(url)))


def baixar_textura(asset_id, res="1k"):
    """Baixa cor (jpg), aspereza (jpg) e normal OpenGL (exr)."""
    arq = _get_json(f"{API}/files/{asset_id}")
    mapas = {"cor": ("Diffuse", "jpg"), "aspereza": ("Rough", "jpg"),
             "normal": ("nor_gl", "exr")}
    saida = {}
    for chave, (mapa, fmt) in mapas.items():
        if mapa in arq and res in arq[mapa] and fmt in arq[mapa][res]:
            url = arq[mapa][res][fmt]["url"]
            saida[chave] = _baixar(url, os.path.join(CACHE, "tex", asset_id, os.path.basename(url)))
    return saida


# ---------------------------------------------------------------------------
# Montagem no Blender (esta parte foi confirmada com arquivos locais)
# ---------------------------------------------------------------------------
def mundo_hdri(caminho, forca=1.0, rotacao_z_graus=0.0, mostrar_na_camera=False,
               cor_fundo=(0.02, 0.02, 0.025)):
    """HDRI como luz de ambiente. Por padrao NAO aparece no fundo da camera
    (o fundo do filme e desenhado, o HDRI so ilumina e reflete)."""
    import math
    cena = bpy.context.scene
    w = cena.world or bpy.data.worlds.new("Mundo")
    cena.world = w
    nt = w.node_tree
    nt.nodes.clear()
    coord = nt.nodes.new("ShaderNodeTexCoord")
    mapa = nt.nodes.new("ShaderNodeMapping")
    mapa.inputs["Rotation"].default_value[2] = math.radians(rotacao_z_graus)
    env = nt.nodes.new("ShaderNodeTexEnvironment")
    env.image = bpy.data.images.load(caminho, check_existing=True)
    bg = nt.nodes.new("ShaderNodeBackground")
    bg.inputs["Strength"].default_value = forca
    out = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(coord.outputs["Generated"], mapa.inputs["Vector"])
    nt.links.new(mapa.outputs["Vector"], env.inputs["Vector"])
    nt.links.new(env.outputs["Color"], bg.inputs["Color"])
    if mostrar_na_camera:
        nt.links.new(bg.outputs["Background"], out.inputs["Surface"])
        return w
    # Light Path > Is Camera Ray: a camera ve cor solida, o resto ve o HDRI.
    # Funciona em EEVEE e Cycles (World.visibility nao existe no 5.2).
    lp = nt.nodes.new("ShaderNodeLightPath")
    solido = nt.nodes.new("ShaderNodeBackground")
    solido.inputs["Color"].default_value = (*cor_fundo, 1)
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(lp.outputs["Is Camera Ray"], mix.inputs["Fac"])
    nt.links.new(bg.outputs["Background"], mix.inputs[1])
    nt.links.new(solido.outputs["Background"], mix.inputs[2])
    nt.links.new(mix.outputs["Shader"], out.inputs["Surface"])
    return w


def material_pbr(nome, mapas, escala_uv=1.0):
    mat = bpy.data.materials.new(nome)
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    coord = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (escala_uv, escala_uv, escala_uv)
    nt.links.new(coord.outputs["UV"], mp.inputs["Vector"])

    def tex(caminho, nao_cor):
        t = nt.nodes.new("ShaderNodeTexImage")
        t.image = bpy.data.images.load(caminho, check_existing=True)
        if nao_cor:
            t.image.colorspace_settings.name = "Non-Color"
        nt.links.new(mp.outputs["Vector"], t.inputs["Vector"])
        return t

    if "cor" in mapas:
        nt.links.new(tex(mapas["cor"], False).outputs["Color"], bsdf.inputs["Base Color"])
    if "aspereza" in mapas:
        nt.links.new(tex(mapas["aspereza"], True).outputs["Color"], bsdf.inputs["Roughness"])
    if "normal" in mapas:
        nm = nt.nodes.new("ShaderNodeNormalMap")
        nt.links.new(tex(mapas["normal"], True).outputs["Color"], nm.inputs["Color"])
        nt.links.new(nm.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


if __name__ == "__main__":
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--hdri")
    p.add_argument("--textura")
    p.add_argument("--res", default="1k")
    p.add_argument("--local", help="testa so a montagem com um arquivo local")
    a = p.parse_args(argv)
    if a.local:
        mundo_hdri(a.local, 1.0, 30)
        print("mundo HDRI local ok:", bpy.context.scene.world.node_tree.nodes.keys())
        m = material_pbr("M_Teste", {"cor": a.local, "aspereza": a.local, "normal": a.local}, 2.0)
        print("material ok:", [n.bl_idname for n in m.node_tree.nodes])
    if a.hdri:
        print("HDRI em", baixar_hdri(a.hdri, a.res))
    if a.textura:
        print("textura em", baixar_textura(a.textura, a.res))
