# Blender 5.2 | status: testado no bpy 5.2.2 Cycles CPU, nuvem (exposicao de cada rig) | fonte: 05-luz.md
# Uso: /home/claude/bvenv/bin/python teste_rigs.py <rig>
import sys, os, math
import bpy
from mathutils import Vector
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import rigs_luz as R
rig = sys.argv[-1]
R.FATOR_ENERGIA = float(os.environ.get("FE", "1.0"))
bpy.ops.wm.read_factory_settings(use_empty=True)
c = bpy.context.scene
c.render.engine = 'CYCLES'; c.cycles.device = 'CPU'; c.cycles.samples = 24; c.cycles.use_denoising = True
c.render.resolution_x, c.render.resolution_y = 200, 250
c.view_settings.view_transform = 'AgX'; c.view_settings.look = 'AgX - Medium High Contrast'
ALT = 0.12; alvo = Vector((0, 0, ALT / 2))
def pr(nome, **kw):
    m = bpy.data.materials.new(nome)
    if m.node_tree is None: m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    for k, v in kw.items(): p.inputs[k].default_value = v
    return m
bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.095, vertices=64, location=(0, 0, 0.0475))
corpo = bpy.context.active_object; b = corpo.modifiers.new('B', 'BEVEL'); b.width = 0.003; b.segments = 3
bpy.ops.object.shade_smooth()
corpo.data.materials.append(pr('Metal', **{'Base Color': (0.8, 0.8, 0.82, 1), 'Metallic': 1.0, 'Roughness': 0.15})
                            if rig in ('faixas',) else pr('Plast', **{'Base Color': (0.7, 0.25, 0.2, 1), 'Roughness': 0.35}))
bpy.ops.mesh.primitive_cylinder_add(radius=0.026, depth=0.025, vertices=64, location=(0, 0, 0.1075))
t = bpy.context.active_object; bpy.ops.object.shade_smooth(); t.data.materials.append(pr('M', **{'Metallic': 1.0, 'Roughness': 0.25}))
cd = bpy.data.cameras.new('C'); cd.lens = 85; cam = bpy.data.objects.new('C', cd); c.collection.objects.link(cam)
cam.location = R.pos_orbital(alvo, 0, 8, 0.62); R.mirar(cam, alvo); c.camera = cam
w = bpy.data.worlds.new('W'); c.world = w
if w.node_tree is None: w.use_nodes = True
w.node_tree.nodes.get('Background').inputs['Strength'].default_value = 0.0
R.fundo_infinito(alvo, ALT, cor=(0.05, 0.05, 0.055) if rig != 'cyc' else (0.5, 0.5, 0.5))
{'tres': lambda: R.rig_tres_pontos(alvo, ALT), 'top': lambda: R.rig_top_light(alvo, ALT),
 'rim': lambda: R.rig_contorno_duplo(alvo, ALT), 'fundo': lambda: (R.rig_fundo_gradiente(alvo, ALT), R.rig_tres_pontos(alvo, ALT)),
 'cyc': lambda: R.rig_cyc(alvo, ALT), 'dura': lambda: R.rig_luz_dura(alvo, ALT),
 'janela': lambda: R.rig_janela(alvo, ALT), 'neon': lambda: R.rig_neon(alvo, ALT),
 'faixas': lambda: R.rig_faixas(alvo, ALT)}[rig]()
c.render.filepath = f'/home/claude/provas/rig_{rig}.png'
bpy.ops.render.render(write_still=True)
import numpy as np
px = np.array(bpy.data.images.load(c.render.filepath).pixels[:]).reshape(-1, 4)[:, :3]
lum = px @ np.array([0.2126, 0.7152, 0.0722])
print('RESULT', rig, 'media=%.3f std=%.3f estourado=%.2f%% afundado=%.2f%%' % (lum.mean(), lum.std(), 100*(lum>0.98).mean(), 100*(lum<0.02).mean()))
