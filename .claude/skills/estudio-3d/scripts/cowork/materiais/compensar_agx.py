# Blender 5.2 | status: testado no bpy 5.2.2 Cycles CPU, nuvem | fonte: capítulo 06-materiais.md
"""Acha a cor de EMISSÃO (linear) que, depois do AgX, sai no PNG com o hex da marca.
Iteração simples: compara saída e alvo em linear e corrige a entrada por razão, canal a canal.
Serve para elementos de cor plana (logo, tela, letreiro). Não serve para material iluminado."""
import sys, os
import bpy
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import materiais as M
tmp = "/tmp/claude-0/-home-claude/7b776b49-e979-58e8-90b8-7c18ad6d2d5c/scratchpad/cor2.png"

def cena(view="AgX", look="None"):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"; sc.cycles.samples = 1
    sc.cycles.use_denoising = False
    sc.render.resolution_x = sc.render.resolution_y = 8
    sc.view_settings.view_transform = view; sc.view_settings.look = look
    w = bpy.data.worlds.new("W"); sc.world = w
    w.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.0
    bpy.ops.mesh.primitive_plane_add(size=2)
    cam = bpy.data.cameras.new("C"); cam.type = "ORTHO"; cam.ortho_scale = 1.0
    co = bpy.data.objects.new("C", cam); sc.collection.objects.link(co); co.location = (0, 0, 1)
    sc.camera = co
    return sc, bpy.context.object

def medir(sc, pl, cor_lin):
    mat = M.cor_plana("#000000", nome="T"); M.ajustar(mat, Emission_Color=cor_lin + (1,))
    pl.data.materials.clear(); pl.data.materials.append(mat)
    sc.render.filepath = tmp; bpy.ops.render.render(write_still=True)
    im = bpy.data.images.load(tmp); px = im.pixels[:]; i = (4 * 8 + 4) * 4
    rgb = px[i:i + 3]; bpy.data.images.remove(im)
    return rgb  # valores do PNG (sRGB 0..1)

def lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def compensar(hexcor, view="AgX", look="None", passos=8):
    sc, pl = cena(view, look)
    alvo = M.hex_para_linear(hexcor)[:3]
    entrada = list(alvo)
    for _ in range(passos):
        out = [lin(c) for c in medir(sc, pl, tuple(entrada))]
        entrada = [max(1e-5, e * (a + 1e-4) / (o + 1e-4)) for e, a, o in zip(entrada, alvo, out)]
    out = medir(sc, pl, tuple(entrada))
    hexout = "#%02X%02X%02X" % tuple(round(c * 255) for c in out)
    return tuple(round(e, 4) for e in entrada), hexout

if __name__ == "__main__":
    for h in ["#E8432F", "#2F6FE8", "#FFC300", "#7B2FF7", "#00C2A8", "#F4F1EA"]:
        e, o = compensar(h)
        print("AGX", h, "-> emissao linear", e, "sai", o)
