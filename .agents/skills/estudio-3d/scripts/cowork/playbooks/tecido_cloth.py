# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (simulação avança quadro a quadro no bpy-módulo) | fonte: API bpy 5.2.2 ClothSettings/ClothCollisionSettings; manual Cloth Settings
# Tecido caindo sobre o produto (revelação por pano). Valores de partida por tipo de tecido.
import bpy

TECIDOS = {
    # mass kg/vértice-ish (padrão 0,3), tensão/compressão, cisalhamento, flexão, amortecimento do ar
    "seda":   dict(mass=0.15, tension=5,  shear=5,  bending=0.05, air=1.0),
    "algodao": dict(mass=0.30, tension=15, shear=5,  bending=0.5,  air=1.0),   # = padrão do 5.2.2
    "veludo": dict(mass=0.45, tension=20, shear=15, bending=2.0,  air=1.0),
    "couro":  dict(mass=0.60, tension=80, shear=80, bending=150,  air=1.0),
}

def pano(lado=0.6, cortes=64, altura=0.35, tipo="seda", qualidade=10):
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=cortes, y_subdivisions=cortes, size=lado, location=(0, 0, altura))
    ob = bpy.context.object; ob.name = "Pano"
    c = ob.modifiers.new("Cloth", 'CLOTH'); s = c.settings; t = TECIDOS[tipo]
    s.quality = qualidade                       # passos por quadro (padrão 5); 10 a 15 evita atravessar o produto
    s.mass = t["mass"]; s.air_damping = t["air"]
    s.tension_stiffness = s.compression_stiffness = t["tension"]
    s.shear_stiffness = t["shear"]; s.bending_stiffness = t["bending"]
    cs = c.collision_settings
    cs.collision_quality = 4                    # padrão 2
    cs.distance_min = 0.002                     # padrão 0,015 m (1,5 cm!) é grosso demais pra produto de 10 cm
    cs.use_self_collision = True; cs.self_distance_min = 0.002
    sub = ob.modifiers.new("Sub", 'SUBSURF'); sub.levels = 1; sub.render_levels = 2   # depois do cloth
    bpy.ops.object.shade_smooth()
    return ob

def colisor(ob, espessura_ext=0.005):
    # Operador modifier_add (forma padrão da interface). No teste do bpy 5.2.2 o pano atravessou o chão
    # com espessura externa de 1 mm e qualidade 5; com 5 mm e qualidade 10 pousou certo.
    with bpy.context.temp_override(object=ob, active_object=ob, selected_objects=[ob]):
        bpy.ops.object.modifier_add(type='COLLISION')
    m = ob.modifiers[-1]
    ob.collision.thickness_outer = espessura_ext   # padrão 0,02 m. 5 mm encosta sem atravessar; 1 mm ATRAVESSOU no teste (pano rápido)
    return m

if __name__ == "__main__":
    for o in list(bpy.data.objects): bpy.data.objects.remove(o)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.15, location=(0, 0, 0.075)); prod = bpy.context.object
    colisor(prod)
    bpy.ops.mesh.primitive_plane_add(size=2); colisor(bpy.context.object)
    p = pano(cortes=24, qualidade=10)
    sc = bpy.context.scene
    for f in range(1, 31): sc.frame_set(f)
    dg = bpy.context.evaluated_depsgraph_get()
    zs = [(p.matrix_world @ v.co).z for v in p.evaluated_get(dg).to_mesh().vertices]
    print("OK cloth z min/max (mundo) apos 30 quadros:", round(min(zs), 3), round(max(zs), 3))
