# Blender 5.2 | status: confirmado por sonda (bpy 5.2.2 LTS, Cycles CPU, nuvem) | fonte: capitulo 02 Mundos Visuais
# Prova de paleta e luz de 3 mundos nao testados pelo Claude Code: holografico, papel e recorte, tatil e textil.
# Uso: /home/claude/bvenv/bin/python prova_mundos_novos.py [id_do_mundo ...]
import bpy, math, sys, os
import numpy as np
from mathutils import Vector

OUT = "/home/claude/provas"

def hex2lin(h):
    h = h.lstrip('#'); c = [int(h[i:i+2], 16)/255 for i in (0, 2, 4)]
    return tuple(((x/12.92) if x <= 0.04045 else ((x+0.055)/1.055)**2.4) for x in c) + (1.0,)

def limpar():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def material(nome, base, rough=0.5, metal=0.0, coat=0.0, trans=0.0, ior=1.5, sheen=0.0,
             sheen_tint="#FFFFFF", sheen_rough=0.5, thin_film=0.0, thin_film_ior=1.33, sss=0.0, spec=0.5):
    m = bpy.data.materials.new(nome)
    p = m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value = hex2lin(base)
    p.inputs["Roughness"].default_value = rough
    p.inputs["Metallic"].default_value = metal
    p.inputs["Coat Weight"].default_value = coat
    p.inputs["Transmission Weight"].default_value = trans
    p.inputs["IOR"].default_value = ior
    p.inputs["Sheen Weight"].default_value = sheen
    p.inputs["Sheen Tint"].default_value = hex2lin(sheen_tint)
    p.inputs["Sheen Roughness"].default_value = sheen_rough
    p.inputs["Thin Film Thickness"].default_value = thin_film
    p.inputs["Thin Film IOR"].default_value = thin_film_ior
    p.inputs["Subsurface Weight"].default_value = sss
    p.inputs["Specular IOR Level"].default_value = spec
    return m

def luz_area(nome, az, el, dist, tam, energia, kelvin, spread_deg, alvo=(0, 0, 0.05)):
    L = bpy.data.lights.new(nome, 'AREA')
    L.size = tam; L.energy = energia; L.spread = math.radians(spread_deg)
    L.use_temperature = True; L.temperature = kelvin
    o = bpy.data.objects.new(nome, L); bpy.context.collection.objects.link(o)
    a, e = math.radians(az), math.radians(el)
    # azimute 0 = frente da camera (camera em -Y), cresce no sentido anti-horario visto de cima
    pos = Vector((dist*math.cos(e)*math.sin(a), -dist*math.cos(e)*math.cos(a), dist*math.sin(e))) + Vector(alvo)
    o.location = pos
    o.rotation_euler = (Vector(alvo) - pos).to_track_quat('-Z', 'Y').to_euler()
    return o

def luz_sol(nome, az, el, energia, kelvin, angulo_deg):
    L = bpy.data.lights.new(nome, 'SUN'); L.energy = energia; L.angle = math.radians(angulo_deg)
    L.use_temperature = True; L.temperature = kelvin
    o = bpy.data.objects.new(nome, L); bpy.context.collection.objects.link(o)
    a, e = math.radians(az), math.radians(el)
    d = Vector((math.cos(e)*math.sin(a), -math.cos(e)*math.cos(a), math.sin(e)))
    o.rotation_euler = (-d).to_track_quat('-Z', 'Y').to_euler()
    return o

def cena_base(fundo_hex, piso_hex, mat_heroi, mat_apoio, fundo_rough=0.8, fundo_spec=0.5):
    # piso e parede com curva (ciclorama simples): plano + parede afastada 1,3x
    bpy.ops.mesh.primitive_plane_add(size=3, location=(0, 0, 0))
    piso = bpy.context.object; piso.data.materials.append(material("piso", piso_hex, rough=fundo_rough, spec=fundo_spec))
    bpy.ops.mesh.primitive_plane_add(size=3, location=(0, 0.42, 0.6), rotation=(math.radians(90), 0, 0))
    parede = bpy.context.object; parede.data.materials.append(material("parede", fundo_hex, rough=fundo_rough, spec=fundo_spec))
    # frasco: cilindro 40 mm de raio x 120 mm com chanfro 3 mm
    bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=0.04, depth=0.12, location=(-0.035, 0.0, 0.06))
    f = bpy.context.object
    b = f.modifiers.new("chanfro", 'BEVEL'); b.width = 0.003; b.segments = 4; b.limit_method = 'ANGLE'
    bpy.ops.object.shade_smooth(); f.data.materials.append(mat_heroi)
    # esfera 30 mm de raio
    bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=0.03, location=(0.06, -0.03, 0.03))
    s = bpy.context.object; bpy.ops.object.shade_smooth(); s.data.materials.append(mat_apoio)
    return f, s

def camera(lente_mm, fstop, foco_dist, az=0, el=8, dist=0.75):
    c = bpy.data.cameras.new("cam"); c.lens = lente_mm
    c.dof.use_dof = True; c.dof.aperture_fstop = fstop; c.dof.focus_distance = foco_dist
    o = bpy.data.objects.new("cam", c); bpy.context.collection.objects.link(o)
    a, e = math.radians(az), math.radians(el); alvo = Vector((0, 0, 0.05))
    o.location = Vector((dist*math.cos(e)*math.sin(a), -dist*math.cos(e)*math.cos(a), dist*math.sin(e))) + alvo
    o.rotation_euler = (alvo - o.location).to_track_quat('-Z', 'Y').to_euler()
    bpy.context.scene.camera = o

def mundo_cor(hex_, forca):
    w = bpy.data.worlds.new("w"); bpy.context.scene.world = w
    bg = w.node_tree.nodes.get("Background")
    bg.inputs[0].default_value = hex2lin(hex_); bg.inputs[1].default_value = forca

def render(nome, look, expo):
    s = bpy.context.scene
    s.render.engine = 'CYCLES'; s.cycles.device = 'CPU'; s.cycles.samples = 32
    s.cycles.use_denoising = True
    s.render.resolution_x = s.render.resolution_y = 360
    s.view_settings.view_transform = 'AgX'; s.view_settings.look = look; s.view_settings.exposure = expo
    s.render.filepath = os.path.join(OUT, nome + ".png")
    bpy.ops.render.render(write_still=True)
    img = bpy.data.images.load(s.render.filepath)
    px = np.array(img.pixels[:]).reshape(-1, 4)[:, :3]
    lum = 0.2126*px[:, 0] + 0.7152*px[:, 1] + 0.0722*px[:, 2]
    estourado = float((px.min(axis=1) > 0.98).mean()*100)
    p5, p95 = np.percentile(lum, 5), np.percentile(lum, 95)
    sat = float((px.max(axis=1) - px.min(axis=1)).mean())
    print(f"QA {nome}: media={lum.mean():.3f} p5={p5:.3f} p95={p95:.3f} contraste(p95-p5)={p95-p5:.3f} "
          f"estourado={estourado:.2f}% saturacao_media={sat:.3f}")

# ---------- MUNDOS ----------
def holografico(fator=1.0):
    limpar()
    her = material("holo_frasco", "#C4C8D0", rough=0.12, metal=1.0, coat=0.0, thin_film=520, thin_film_ior=2.0)
    # espessura do filme variando 250 a 750 nm por ruido: e isso que vira faixa de arco-iris (filme uniforme = um tom so)
    nt = her.node_tree; p = nt.nodes.get("Principled BSDF")
    nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 3.0; nz.inputs["Detail"].default_value = 2.0
    mr = nt.nodes.new("ShaderNodeMapRange"); mr.inputs["To Min"].default_value = 250; mr.inputs["To Max"].default_value = 750
    nt.links.new(nz.outputs["Fac"], mr.inputs["Value"]); nt.links.new(mr.outputs["Result"], p.inputs["Thin Film Thickness"])
    apo = material("holo_esfera", "#E9E4F2", rough=0.05, metal=0.0, trans=1.0, ior=1.45, thin_film=380, thin_film_ior=1.33)
    fr, es = cena_base("#141226", "#0D0B16", her, apo, fundo_rough=0.85, fundo_spec=0.08)
    herois = bpy.data.collections.new("herois")
    bpy.context.scene.collection.children.link(herois)
    for ob in (fr, es): herois.objects.link(ob)
    luz_area("principal", 55, 50, 0.6, 0.5, 6*fator, 6500, 45)
    # tiras verticais (strip) dos lados: desenham o reflexo longo onde o filme fino mostra o arco-iris
    for nome, az in (("tira_esq", -75), ("tira_dir", 80)):
        t = luz_area(nome, az, 8, 0.35, 0.05, 5*fator, 6500, 90)
        t.data.shape = 'RECTANGLE'; t.data.size = 0.05; t.data.size_y = 0.5
        t.light_linking.receiver_collection = herois
    # contornos coloridos atras do heroi: pintam o reflexo do heroi sem lavar o piso
    for nome, az, el, en, cor in (("contorno_magenta", 150, 20, 14, (1.0, 0.35, 0.85)),
                                  ("contorno_ciano", -140, 20, 12, (0.3, 0.9, 1.0))):
        o = luz_area(nome, az, el, 0.55, 0.25, en*fator, 5000, 30, alvo=(0, 0, 0.09))
        o.data.use_temperature = False; o.data.color = cor
        o.light_linking.receiver_collection = herois   # light linking: o contorno so acende o heroi, nunca o piso
    mundo_cor("#2A2048", 0.25)
    camera(85, 2.8, 0.75, az=10, el=10)

def papel(fator=1.0):
    limpar()
    her = material("cartolina_frasco", "#F2B33D", rough=0.92, sss=0.05)
    apo = material("cartolina_esfera", "#E2553F", rough=0.95, sss=0.05)
    cena_base("#CDB894", "#E3D3B6", her, apo, fundo_rough=0.95)
    luz_sol("sol_duro", 55, 38, 2.2*fator, 5200, 1.5)
    luz_area("rebate", -60, 15, 0.8, 1.2, 1.2*fator, 6500, 120)
    mundo_cor("#DDE6F0", 0.08)
    camera(50, 8.0, 0.75, az=0, el=22)

def textil(fator=1.0):
    limpar()
    her = material("feltro_frasco", "#7A8C6E", rough=0.95, sheen=1.0, sheen_tint="#D9E3CF", sheen_rough=0.35)
    apo = material("veludo_esfera", "#6E2E3A", rough=0.9, sheen=1.0, sheen_tint="#E8B7C0", sheen_rough=0.25)
    cena_base("#A89A88", "#B5A795", her, apo, fundo_rough=0.95)
    luz_area("principal_rasante", 70, 18, 0.6, 0.8, 14*fator, 4300, 65)
    luz_area("contorno", 160, 30, 0.6, 0.4, 10*fator, 5600, 60)
    luz_area("preenchimento", -50, 10, 0.9, 1.5, 1.0*fator, 4800, 120)
    mundo_cor("#A89A88", 0.05)
    camera(100, 4.0, 0.75, az=-8, el=12)

MUNDOS = {
    "holografico": (holografico, "AgX - Punchy", 0.8),
    "papel": (papel, "AgX - Medium High Contrast", -0.3),
    "textil": (textil, "AgX - Medium High Contrast", -0.2),
}

if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a in MUNDOS] or list(MUNDOS)
    fator = 1.0
    for a in sys.argv[1:]:
        if a.startswith("fator="): fator = float(a.split("=")[1])
    for nome in args:
        f, look, expo = MUNDOS[nome]; f(fator); render(f"mundo_{nome}", look, expo)
