"""Splash de produto que funciona no Blender 5.2 (testado na RTX 3050, 2026-10-02): uma porção de
líquido (FLOW geometria) cai sobre o produto (EFFECTOR) dentro do domínio. Sem jato contínuo: o
inflow animado (receita antiga) não desliga e inunda o domínio.
Tempos: res 48 = 8,5 s de bake; res 96 = 75 s; res 128 = 120 s (40-45 quadros). Comercial: res 192-256
e câmera lenta no impacto (time scale 0,2). O impacto acontece por volta de 0,25 s: renderize ali.
Uso: blender -b --factory-startup -P splash_produto.py -- 96"""
import sys, os, time
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import bpy
from estudio3d import nucleo, mundos, materiais as M, anima, qa, geo
AQUI = os.getcwd()
res = int(sys.argv[-1])
nucleo.cena_nova('9:16', segundos=2, motor_nome='cycles', qualidade='revisao')
ficha = mundos.aplicar('luxo_escuro', alvo=(0, 0, 0.08), escala=0.6)
sc = bpy.context.scene
# produto: lata (efetor)
lata = geo.cilindro('lata', 0.033, 0.12, M.metal('aluminio', 'acetinado'), chanfro=0.002)
ef = lata.modifiers.new('Fluid', 'FLUID'); ef.fluid_type = 'EFFECTOR'
ef.effector_settings.effector_type = 'COLLISION'
# porção de líquido acima, com velocidade pra baixo
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.035, location=(0.005, 0, 0.24))
gota = bpy.context.object; gota.name = 'gota'
f = gota.modifiers.new('Fluid', 'FLUID'); f.fluid_type = 'FLOW'
s = f.flow_settings; s.flow_type = 'LIQUID'; s.flow_behavior = 'GEOMETRY'
s.use_initial_velocity = True; s.velocity_coord = (0, 0, -1.2)
gota.hide_render = True
# domínio
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.15))
dom = bpy.context.object; dom.name = 'dominio'; dom.scale = (0.32, 0.32, 0.3)
bpy.ops.object.transform_apply(scale=True)
m = dom.modifiers.new('Fluid', 'FLUID'); m.fluid_type = 'DOMAIN'
d = m.domain_settings
d.domain_type = 'LIQUID'; d.resolution_max = res; d.use_mesh = True; d.mesh_scale = 2
d.cache_type = 'ALL'; d.cache_frame_start, d.cache_frame_end = 1, 45
d.cache_directory = os.path.join(AQUI, f'cache_prod{res}')
d.use_collision_border_bottom = True
dom.data.materials.append(M.liquido('#FFB23E', ior=1.34))
t0 = time.time()
with bpy.context.temp_override(object=dom, active_object=dom, scene=sc):
    bpy.ops.fluid.bake_all()
print('BAKE', res, f'{time.time()-t0:.1f}s')
cam = anima.Camera(alvo=(0, 0, 0.1), distancia=0.75, angulo=-10, inclinacao=6, lente=85, fstop=8)
qa.render_quadros([0.2, 0.27, 0.35, 0.5], AQUI, prefixo=f'prod_r{res}', escala=50, amostras=128, intencao='escuro')
