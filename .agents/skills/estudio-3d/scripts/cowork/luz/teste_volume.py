# Blender 5.2 | status: testado no bpy 5.2.2 Cycles CPU e EEVEE, nuvem | fonte: 05-luz.md
# Uso: python teste_volume.py <CYCLES|BLENDER_EEVEE> <densidade>
import sys, os, time, bpy, numpy as np
from mathutils import Vector
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import rigs_luz as R
eng, dens = sys.argv[-2], float(sys.argv[-1])
bpy.ops.wm.read_factory_settings(use_empty=True)
c = bpy.context.scene; c.render.engine = eng
c.render.resolution_x, c.render.resolution_y = 200, 250
if eng == 'CYCLES': c.cycles.device = 'CPU'; c.cycles.samples = 24; c.cycles.use_denoising = True
else: c.eevee.taa_render_samples = 16; R.eevee_volumetrico(c, tile=8, amostras=64, sombras=True)
c.view_settings.look = 'AgX - Medium High Contrast'
ALT = 0.12; alvo = Vector((0, 0, ALT / 2))
bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.12, vertices=64, location=alvo); bpy.ops.object.shade_smooth()
cd = bpy.data.cameras.new('C'); cd.lens = 50; cam = bpy.data.objects.new('C', cd); c.collection.objects.link(cam)
cam.location = R.pos_orbital(alvo, 0, 8, 0.7); R.mirar(cam, alvo); c.camera = cam
w = bpy.data.worlds.new('W'); c.world = w
if w.node_tree is None: w.use_nodes = True
w.node_tree.nodes.get('Background').inputs['Strength'].default_value = 0
R.fundo_infinito(alvo, ALT, cor=(0.04, 0.04, 0.045))
R.luz_spot('Feixe', alvo, 150, 55, 0.6, 60, raio=0.005, abertura_graus=20, suavidade=0.2, kelvin=4500)
R.luz_area('Chave', alvo, -45, 25, 0.6, 3, 0.4, 0.5, kelvin=5200, spread_graus=70)
if dens > 0:
    R.nevoa_no_cubo(alvo, ALT, densidade=dens, anisotropia=0.6, tamanho=1.2)
c.render.filepath = f'/home/claude/provas/vol_{eng}_{dens}.png'
t = time.time(); bpy.ops.render.render(write_still=True); dt = time.time() - t
px = np.array(bpy.data.images.load(c.render.filepath).pixels[:]).reshape(-1, 4)[:, :3]
print('VOL', eng, dens, 'tempo=%.1fs media=%.3f' % (dt, px.mean()))
