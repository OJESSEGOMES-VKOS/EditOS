# Blender 5.2 | status: testado no bpy 5.2.2 Cycles CPU, nuvem | fonte: capítulo 06-materiais.md
"""Grade de materiais: 12 objetos (esferas e cilindros chanfrados) em escala real.
Rodar: /home/claude/bvenv/bin/python teste_grade.py [saida.png] [amostras]"""
import sys, math, os
import bpy
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import materiais as M

saida = sys.argv[1] if len(sys.argv) > 1 else "/home/claude/provas/materiais_grade.png"
amostras = int(sys.argv[2]) if len(sys.argv) > 2 else 48

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "CYCLES"
sc.cycles.device = "CPU"
sc.cycles.samples = amostras
sc.cycles.use_denoising = True
sc.cycles.max_bounces = 12
sc.cycles.transmission_bounces = 12
sc.render.resolution_x, sc.render.resolution_y = 640, 480
sc.view_settings.view_transform = "AgX"
sc.view_settings.look = "AgX - Medium High Contrast"

# Mundo: HDRI de estúdio CC0 que vem com o Blender (Poly Haven), fraco
w = bpy.data.worlds.new("Mundo"); sc.world = w
nt = w.node_tree
bg = nt.nodes["Background"]
HDRI = os.path.join(bpy.utils.resource_path("LOCAL"), "datafiles", "studiolights", "world", "studio.exr")
if not os.path.exists(HDRI):  # bpy como módulo: sobe a partir de .../5.2/scripts/modules/bpy
    raiz = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(bpy.__file__))))
    HDRI = os.path.join(raiz, "datafiles", "studiolights", "world", "studio.exr")
env = nt.nodes.new("ShaderNodeTexEnvironment")
env.image = bpy.data.images.load(HDRI)
nt.links.new(env.outputs["Color"], bg.inputs["Color"])
bg.inputs["Strength"].default_value = 0.25

# Chão e fundo (curva infinita simples: plano grande escuro)
bpy.ops.mesh.primitive_plane_add(size=4, location=(0, 0, 0))
chao = bpy.context.object
mchao = M.novo_material("Chao")
M.ajustar(mchao, Base_Color="#24262A", Roughness=0.5)
chao.data.materials.append(mchao)

# Luzes: principal área 0,5 m a 45° lateral e ~40° de altura; contorno atrás
def luz_area(nome, energia, tam, loc, alvo=(0, 0, 0.03), temp=5600):
    l = bpy.data.lights.new(nome, "AREA")
    l.energy = energia; l.size = tam
    l.use_temperature = True; l.temperature = temp
    o = bpy.data.objects.new(nome, l); sc.collection.objects.link(o)
    o.location = loc
    d = [alvo[i] - loc[i] for i in range(3)]
    import mathutils
    o.rotation_euler = mathutils.Vector(d).to_track_quat("-Z", "Y").to_euler()
    return o

luz_area("Principal", 28, 0.6, (-0.55, -0.55, 0.6), temp=5200)
luz_area("Contorno", 40, 0.4, (0.5, 0.6, 0.35), temp=6500)
luz_area("Preenchimento", 5, 1.0, (0.8, -0.5, 0.3), temp=5600)

# Câmera 85 mm
cam = bpy.data.cameras.new("Cam"); cam.lens = 85
co = bpy.data.objects.new("Cam", cam); sc.collection.objects.link(co)
co.location = (0, -1.05, 0.85)
import mathutils
co.rotation_euler = (mathutils.Vector((0, 0.01, 0.03)) - co.location).to_track_quat("-Z", "Y").to_euler()
sc.camera = co

R = 0.03  # raio 3 cm
def esfera(x, y):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=R, location=(x, y, R), segments=64, ring_count=32)
    o = bpy.context.object; bpy.ops.object.shade_smooth(); return o

def cilindro(x, y, h=0.07):
    bpy.ops.mesh.primitive_cylinder_add(radius=R * 0.9, depth=h, location=(x, y, h / 2), vertices=96)
    o = bpy.context.object
    M.chanfrar(o, largura_mm=1.5, segmentos=4)
    bpy.ops.object.shade_smooth()
    return o

# (nome, função, forma)
grade = [
    ("plastico_brilhante", lambda: M.plastico_brilhante("#E8432F"), "e"),
    ("plastico_fosco", lambda: M.plastico_fosco("#2F6FE8"), "e"),
    ("cromo", M.cromo, "e"),
    ("ouro", M.ouro, "e"),
    ("metal_escovado", M.metal_escovado, "c"),
    ("anodizado_azul", lambda: M.aluminio_anodizado("azul"), "c"),
    ("vidro_colorido", lambda: M.vidro_colorido("#2E8B57", 40), "c"),
    ("perfume", lambda: M.liquido("perfume"), "c"),
    ("tecido", M.tecido, "e"),
    ("ceramica", M.ceramica, "e"),
    ("pele_fruta", M.pele_fruta, "e"),
    ("pintura_auto", M.pintura_automotiva, "e"),
]
xs = [-0.18, -0.06, 0.06, 0.18]
ys = [-0.14, 0.0, 0.14]
for i, (nome, f, forma) in enumerate(grade):
    x = xs[i % 4]; y = ys[i // 4]
    o = esfera(x, y) if forma == "e" else cilindro(x, y)
    o.name = nome
    o.data.materials.append(f())

sc.render.filepath = saida
bpy.ops.render.render(write_still=True)
print("SALVO", saida)
