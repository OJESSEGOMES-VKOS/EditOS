# Blender 5.2 | status: executado no bpy 5.2.2 Cycles CPU (nuvem, 2 núcleos Xeon 2,1 GHz) | fonte: cena do frasco do cap. 05 (rigs_luz.py)
"""Mesma cena (frasco de vidro 12 cm + tampa metálica + rig de 3 pontos) em Cycles CPU com 16, 64 e 256 amostras,
com e sem denoise (OIDN, albedo+normal). Amostragem adaptativa DESLIGADA para comparar amostras fixas.
Uso: /home/claude/bvenv/bin/python teste_amostras.py /tmp/amostras   (acrescente "ref" para a referência de 1024 amostras com denoise)"""
import sys, os, math, time
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, "..", "luz"))
import bpy
from mathutils import Vector
import rigs_luz as R

out = [a for a in sys.argv[1:] if not a.endswith(".py") and a != "ref"]
out = out[0] if out else "/tmp/amostras"
os.makedirs(out, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
cena = bpy.context.scene
cena.render.engine = "CYCLES"
c = cena.cycles
c.device = "CPU"
cena.render.resolution_x, cena.render.resolution_y = 256, 320
cena.view_settings.view_transform = "AgX"; cena.view_settings.look = "AgX - Medium High Contrast"
c.transmission_bounces = 12; c.glossy_bounces = 6; c.use_adaptive_sampling = False
c.caustics_reflective = c.caustics_refractive = False
c.sample_clamp_indirect = 10.0
c.seed = 0

ALT = 0.12; alvo = Vector((0, 0, ALT / 2))
def principled(nome, **kw):
    m = bpy.data.materials.new(nome); p = m.node_tree.nodes["Principled BSDF"]
    for k, v in kw.items(): p.inputs[k].default_value = v
    return m
bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.095, vertices=96, location=(0, 0, 0.0475))
corpo = bpy.context.active_object; b = corpo.modifiers.new("Chanfro", "BEVEL"); b.width = 0.003; b.segments = 4
bpy.ops.object.shade_smooth()
bpy.ops.mesh.primitive_cylinder_add(radius=0.026, depth=0.025, vertices=96, location=(0, 0, 0.1075))
tampa = bpy.context.active_object; b = tampa.modifiers.new("Chanfro", "BEVEL"); b.width = 0.0015; b.segments = 3
bpy.ops.object.shade_smooth()
bpy.ops.mesh.primitive_cylinder_add(radius=0.0265, depth=0.07, vertices=96, location=(0, 0, 0.04))
liq = bpy.context.active_object; bpy.ops.object.shade_smooth()
corpo.data.materials.append(principled("Vidro", **{"Base Color": (0.92, 0.95, 0.96, 1), "Roughness": 0.02, "Transmission Weight": 1.0, "IOR": 1.5}))
tampa.data.materials.append(principled("Metal", **{"Base Color": (0.80, 0.62, 0.38, 1), "Metallic": 1.0, "Roughness": 0.22}))
liq.data.materials.append(principled("Liquido", **{"Base Color": (0.95, 0.55, 0.18, 1), "Roughness": 0.0, "Transmission Weight": 1.0, "IOR": 1.36}))
cd = bpy.data.cameras.new("Cam"); cd.lens = 85
cam = bpy.data.objects.new("Cam", cd); cena.collection.objects.link(cam)
cam.location = R.pos_orbital(alvo, 0, 8, 0.62); R.mirar(cam, alvo + Vector((0, 0, -0.004))); cena.camera = cam
w = bpy.data.worlds.new("W"); cena.world = w; w.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.0
R.fundo_infinito(alvo, ALT, cor=(0.035, 0.036, 0.04))
R.rig_tres_pontos(alvo, ALT); R.rig_contorno_duplo(alvo, ALT); R.rig_fundo_gradiente(alvo, ALT)
R.cartoes_reflexo(alvo, ALT, forca=12.0)

LISTA = (1024,) if "ref" in sys.argv else (16, 64, 256)
for spp in LISTA:
    for dn in ((True,) if spp == 1024 else (False, True)):
        c.samples = spp; c.use_denoising = dn
        c.denoiser = "OPENIMAGEDENOISE"; c.denoising_input_passes = "RGB_ALBEDO_NORMAL"; c.denoising_quality = "HIGH"
        cena.render.filepath = os.path.join(out, f"a{spp:04d}_{'dn' if dn else 'cru'}.png")
        t = time.time(); bpy.ops.render.render(write_still=True)
        print(f"RESULT spp={spp} denoise={dn} tempo={time.time()-t:.1f}s", flush=True)
