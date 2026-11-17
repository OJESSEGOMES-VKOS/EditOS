# Blender 5.2 | status: testado no bpy 5.2.2 Cycles CPU, nuvem | fonte: capítulo 06-materiais.md
"""Mede como o hex da marca sai no PNG final em cada transformação de visualização.
Plano com emissão (cor plana, sem luz) e câmera ortográfica; lê o pixel central do PNG salvo."""
import sys, os
import bpy
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import materiais as M

CORES = ["#E8432F", "#2F6FE8", "#FFC300", "#7B2FF7", "#00C2A8", "#1C1C1E", "#F4F1EA"]
VIEWS = [("Standard", "None"), ("AgX", "None"), ("AgX", "AgX - Punchy"), ("Khronos PBR Neutral", "None")]
FORCAS = [1.0]
tmp = "/tmp/claude-0/-home-claude/7b776b49-e979-58e8-90b8-7c18ad6d2d5c/scratchpad/cor.png"

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"; sc.cycles.samples = 1
sc.cycles.use_denoising = False
sc.render.resolution_x = sc.render.resolution_y = 8
sc.render.image_settings.file_format = "PNG"
w = bpy.data.worlds.new("W"); sc.world = w
w.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.0
bpy.ops.mesh.primitive_plane_add(size=2)
pl = bpy.context.object
cam = bpy.data.cameras.new("C"); cam.type = "ORTHO"; cam.ortho_scale = 1.0
co = bpy.data.objects.new("C", cam); sc.collection.objects.link(co); co.location = (0, 0, 1)
sc.camera = co

def ler():
    im = bpy.data.images.load(tmp); im.reload()
    px = list(im.pixels[:]); i = (4 * 8 + 4) * 4
    r, g, b = px[i:i + 3]; bpy.data.images.remove(im)
    return "#%02X%02X%02X" % (round(r * 255), round(g * 255), round(b * 255))

def hexdist(a, b):
    a = [int(a[i:i + 2], 16) for i in (1, 3, 5)]; b = [int(b[i:i + 2], 16) for i in (1, 3, 5)]
    return max(abs(x - y) for x, y in zip(a, b))

for forca in [0.6, 1.0, 1.3, 2.0]:
    mat = M.cor_plana("#E8432F", nome="Teste"); M.ajustar(mat, Emission_Strength=forca)
    pl.data.materials.clear(); pl.data.materials.append(mat)
    for vt, lk in VIEWS:
        sc.view_settings.view_transform = vt; sc.view_settings.look = lk
        sc.render.filepath = tmp; bpy.ops.render.render(write_still=True)
        print("FORCA %.1f %-22s %-14s -> %s" % (forca, vt, lk, ler()))

for cor in CORES:
    mat = M.cor_plana(cor, nome="Teste")
    pl.data.materials.clear(); pl.data.materials.append(mat)
    linha = []
    for vt, lk in VIEWS:
        sc.view_settings.view_transform = vt; sc.view_settings.look = lk
        sc.render.filepath = tmp; bpy.ops.render.render(write_still=True)
        o = ler(); linha.append("%s(d%d)" % (o, hexdist(cor, o)))
    print("COR", cor, " | ".join(linha))
