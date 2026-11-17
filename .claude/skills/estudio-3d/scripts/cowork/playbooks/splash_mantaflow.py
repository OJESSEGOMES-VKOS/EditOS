# Blender 5.2 | status: nomes confirmados por sonda no bpy 5.2.2; BAKE FALHOU no bpy-módulo da nuvem (erro interno Manta 'LevelsetGrid has no setConst'), a testar no Blender 5.2 completo | fonte: API bpy 5.2.2 FluidDomainSettings; manual Fluid Domain Settings
# Splash de líquido com Mantaflow (FLIP). Mantaflow existe no 5.2.2, mas sem desenvolvedor ativo desde 2021 (wiki FLIP Fluids). Use pra splash curto.
import bpy, os

def splash(dominio_tam=(0.3, 0.3, 0.4), res=128, cache="//cache_splash", q_ini=1, q_fim=60, vel=(0, 0, 2.5)):
    sc = bpy.context.scene
    # Domínio: caixa que contém TODO o splash, um pouco maior que ele. Escala real em metros.
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, dominio_tam[2] / 2))
    dom = bpy.context.object; dom.name = "Dominio"; dom.scale = dominio_tam
    bpy.ops.object.transform_apply(scale=True)
    m = dom.modifiers.new("Fluid", 'FLUID'); m.fluid_type = 'DOMAIN'
    d = m.domain_settings
    d.domain_type = 'LIQUID'
    d.resolution_max = res            # 32 = teste; 128 a 192 = prévia; 256+ = final (custo cresce ~ res^3)
    d.use_mesh = True                 # gera malha da superfície
    d.mesh_scale = 2                  # upres da malha
    d.use_adaptive_timesteps = True
    d.cfl_condition = 2.0             # padrão; baixe pra 1,0 em respingo rápido (mais passos, menos "salto")
    d.timesteps_max = 4
    d.flip_ratio = 0.97               # padrão; perto de 1 = mais energético (respingo), menor = mais viscoso/calmo
    d.cache_type = 'ALL'              # 'ALL' assa tudo de uma vez (bom pra script); 'MODULAR' assa por etapa
    d.cache_frame_start, d.cache_frame_end = q_ini, q_fim
    d.cache_directory = cache
    d.use_spray_particles = False     # ligue spray/espuma só no final; multiplica o custo
    # Fluxo: esfera que injeta líquido com velocidade inicial (o "golpe" do splash)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.03, location=(0, 0, 0.05))
    fl = bpy.context.object; fl.name = "Fluxo"
    f = fl.modifiers.new("Fluid", 'FLUID'); f.fluid_type = 'FLOW'
    s = f.flow_settings
    s.flow_type = 'LIQUID'
    s.flow_behavior = 'INFLOW'
    s.use_initial_velocity = True
    s.velocity_coord = vel            # m/s; 2 a 3 m/s numa escala de 30 cm dá coroa de splash
    s.use_plane_init = False
    # desliga o fluxo depois de 10 quadros (pulso, não torneira)
    s.use_inflow = True
    s.keyframe_insert("use_inflow", frame=q_ini + 9)
    s.use_inflow = False
    s.keyframe_insert("use_inflow", frame=q_ini + 10)
    return dom, fl

if __name__ == "__main__":
    for o in list(bpy.data.objects): bpy.data.objects.remove(o)
    cache = "/tmp/claude-0/-home-claude/7b776b49-e979-58e8-90b8-7c18ad6d2d5c/scratchpad/cache_splash"
    dom, fl = splash(res=32, cache=cache, q_fim=6)
    bpy.context.view_layer.objects.active = dom
    with bpy.context.temp_override(object=dom, active_object=dom):
        r = bpy.ops.fluid.bake_all()
    print("OK bake", r, os.listdir(cache) if os.path.exists(cache) else "sem cache")
