# Blender 5.2 | status: testado no bpy 5.2.2 Cycles CPU, nuvem | fonte: capitulo 05-luz.md
# Uso: /home/claude/bvenv/bin/python teste_antes_depois.py antes|depois
import sys, math, os
import bpy
from mathutils import Vector
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import rigs_luz as R

modo = sys.argv[-1]
R.FATOR_ENERGIA = float(os.environ.get("FE", "1.0"))
FORCA_CARTAO = float(os.environ.get("FC", "12.0"))
bpy.ops.wm.read_factory_settings(use_empty=True)
cena = bpy.context.scene
cena.render.engine = 'CYCLES'
cena.cycles.device = 'CPU'
cena.cycles.samples = int(os.environ.get("SPP","64"))
cena.cycles.use_denoising = True
cena.render.resolution_x, cena.render.resolution_y = 320, 400
cena.view_settings.view_transform = 'AgX'
cena.view_settings.look = 'AgX - Medium High Contrast' if modo == 'depois' else 'None'
cena.cycles.transmission_bounces = 12
cena.cycles.glossy_bounces = 6

ALT = 0.12
alvo = Vector((0, 0, ALT / 2))

# ---- produto: corpo de vidro chanfrado + tampa de metal escovado
bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.095, vertices=96, location=(0, 0, 0.0475))
corpo = bpy.context.active_object
bv = corpo.modifiers.new('Chanfro', 'BEVEL'); bv.width = 0.003; bv.segments = 4
bpy.ops.object.shade_smooth()
corpo.modifiers.new('WN', 'WEIGHTED_NORMAL')
bpy.ops.mesh.primitive_cylinder_add(radius=0.026, depth=0.025, vertices=96, location=(0, 0, 0.1075))
tampa = bpy.context.active_object
bv = tampa.modifiers.new('Chanfro', 'BEVEL'); bv.width = 0.0015; bv.segments = 3
bpy.ops.object.shade_smooth()

def principled(nome, **kw):
    m = bpy.data.materials.new(nome)
    if m.node_tree is None:
        m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    for k, v in kw.items():
        p.inputs[k].default_value = v
    return m

vidro = principled('Vidro', **{'Base Color': (0.92, 0.95, 0.96, 1), 'Roughness': 0.02,
                              'Transmission Weight': 1.0, 'IOR': 1.5})
metal = principled('Metal', **{'Base Color': (0.80, 0.62, 0.38, 1), 'Metallic': 1.0, 'Roughness': 0.22})
corpo.data.materials.append(vidro)
tampa.data.materials.append(metal)
# liquido interno (ambar) para o vidro ter algo a refratar
bpy.ops.mesh.primitive_cylinder_add(radius=0.0265, depth=0.07, vertices=96, location=(0, 0, 0.04))
liq = bpy.context.active_object
bpy.ops.object.shade_smooth()
liq.data.materials.append(principled('Liquido', **{'Base Color': (0.95, 0.55, 0.18, 1), 'Roughness': 0.0,
                                                    'Transmission Weight': 1.0, 'IOR': 1.36}))

# ---- camera 85 mm equivalente, levemente acima
cam_d = bpy.data.cameras.new('Cam'); cam_d.lens = 85
cam = bpy.data.objects.new('Cam', cam_d); cena.collection.objects.link(cam)
cam.location = R.pos_orbital(alvo, 0, 8, 0.62)
R.mirar(cam, alvo + Vector((0, 0, -0.004)))
cena.camera = cam

world = bpy.data.worlds.new('W'); cena.world = world
if world.node_tree is None:
    world.use_nodes = True
bg = world.node_tree.nodes.get('Background')

if modo == 'antes':
    # o "padrao" de quem nao pensou na luz: chao e fundo cinza claro, mundo cinza 1.0, um ponto de luz 1000 W
    bpy.ops.mesh.primitive_plane_add(size=4, location=(0, 0, 0))
    chao = bpy.context.active_object
    chao.data.materials.append(principled('Chao', **{'Base Color': (0.6, 0.6, 0.6, 1), 'Roughness': 0.5}))
    bg.inputs['Color'].default_value = (0.5, 0.5, 0.5, 1)
    bg.inputs['Strength'].default_value = 1.0
    d = bpy.data.lights.new('Ponto', 'POINT'); d.energy = 30
    p = bpy.data.objects.new('Ponto', d); cena.collection.objects.link(p)
    p.location = cam.location + Vector((0.05, 0, 0.15))
else:
    # fundo infinito escuro e afastado + rigs
    R.fundo_infinito(alvo, ALT, cor=(0.035, 0.036, 0.04))
    bg.inputs['Color'].default_value = (0.0, 0.0, 0.0, 1)
    bg.inputs['Strength'].default_value = 0.0
    chave_l, preench_l, contorno_l = R.rig_tres_pontos(alvo, ALT)
    if os.environ.get("LL", "1") == "1":
        # light linking: chave e preenchimento so no produto; o chao fica com a luz do fundo
        for luz in (chave_l, preench_l, contorno_l):
            R.contorno_so_no_produto(luz, [corpo, tampa, liq], nome='Produto')
    rims = R.rig_contorno_duplo(alvo, ALT)
    if os.environ.get("LL", "1") == "1":
        for luz in rims:
            R.contorno_so_no_produto(luz, [corpo, tampa, liq], nome='Produto')
    R.cartoes_reflexo(alvo, ALT, forca=FORCA_CARTAO)
    R.bandeiras_pretas(alvo, ALT)
    R.cartao_transluz(alvo, ALT, forca=float(os.environ.get('FT','2.0')))
    R.rig_fundo_gradiente(alvo, ALT)

cena.render.filepath = f'/home/claude/provas/luz_{modo}.png'
bpy.ops.render.render(write_still=True)

# ---- medidor simples (equivalente ao qa.py do Laboratorio)
import numpy as np
img = bpy.data.images.load(cena.render.filepath)
px = np.array(img.pixels[:]).reshape(-1, 4)[:, :3]
lum = 0.2126 * px[:, 0] + 0.7152 * px[:, 1] + 0.0722 * px[:, 2]
print('RESULT', modo, 'media=%.3f' % lum.mean(), 'contraste(std)=%.3f' % lum.std(),
      'estourado=%.2f%%' % (100 * (lum > 0.98).mean()), 'afundado=%.2f%%' % (100 * (lum < 0.02).mean()))
