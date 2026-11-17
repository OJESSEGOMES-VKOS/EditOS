# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (EEVEE, 30 fps, marcadores de camera, folha de contato) | fonte: capitulo 01 Cerebro de Diretor
# Animatic em blocos cinza (blocking) a partir de um shot list em Python.
# Uso: blender -b -P animatic_blocking.py   (ou /home/claude/bvenv/bin/python animatic_blocking.py)
# Saida: OUT/plano_XX_fNNN.png (primeiro, meio e ultimo quadro de cada plano) + OUT/folha_contato.png
import bpy, math, os
import numpy as np
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector

OUT = os.environ.get("ANIMATIC_OUT", "/tmp/animatic")
os.makedirs(OUT, exist_ok=True)
W, H = 270, 480          # 9:16 em 1/4 de 1080x1920: rapido pra olhar
FPS = 30

# Shot list minimo: (nome, quadros, lente_mm, cam_ini, cam_fim, alvo)
SHOTS = [
    ("01_gancho",   45, 85,  (0.0, -0.9, 0.10), (0.0, -0.6, 0.10), (0, 0, 0.07)),
    ("02_tensao",   60, 35,  (0.6, -0.8, 0.45), (0.3, -0.9, 0.35), (0, 0, 0.05)),
    ("03_revelacao",90, 50,  (0.0, -0.7, 0.25), (-0.25,-0.6, 0.20), (0, 0, 0.07)),
    ("04_packshot", 60, 100, (0.0, -1.1, 0.12), (0.0, -1.0, 0.12), (0, 0, 0.07)),
]

def limpar():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def material_cinza(nome, v):
    m = bpy.data.materials.new(nome)
    m.diffuse_color = (v, v, v, 1)
    return m

def bloco(nome, dims, loc, cinza):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.active_object
    o.name = nome
    o.scale = dims
    o.data.materials.append(material_cinza("m_" + nome, cinza))
    return o

limpar()
sc = bpy.context.scene
sc.render.engine = "BLENDER_EEVEE"
sc.render.fps = FPS                     # padrao de fabrica e 24 (sonda)
sc.render.resolution_x, sc.render.resolution_y = W, H
sc.eevee.taa_render_samples = 8
sc.view_settings.view_transform = "AgX"
sc.view_settings.look = "AgX - Medium High Contrast"

# Mundo cinza medio, sem HDRI: blocking nao julga luz
w = bpy.data.worlds.new("blocking"); sc.world = w
w.use_nodes = True  # gera DeprecationWarning no 5.2, funciona
w.node_tree.nodes["Background"].inputs[0].default_value = (0.18, 0.18, 0.18, 1)

# Cena em escala real (metros): celular 71,5 x 147 x 7,8 mm em pe
bloco("chao", (3, 3, 0.01), (0, 0, -0.005), 0.35)
heroi = bloco("HEROI_celular", (0.0715, 0.0078, 0.147), (0, 0, 0.0735), 0.8)
bloco("apoio_A", (0.12, 0.12, 0.04), (-0.18, 0.10, 0.02), 0.5)
bloco("apoio_B", (0.08, 0.08, 0.10), (0.20, 0.15, 0.05), 0.5)

sun = bpy.data.lights.new("chave", "SUN"); sun.energy = 3
so = bpy.data.objects.new("chave", sun); sc.collection.objects.link(so)
so.rotation_euler = (math.radians(50), 0, math.radians(35))

inicio = 1
cortes = []
for nome, nq, lente, c0, c1, alvo in SHOTS:
    cd = bpy.data.cameras.new("cam_" + nome); cd.lens = lente
    cd.sensor_width = 36
    co = bpy.data.objects.new("cam_" + nome, cd); sc.collection.objects.link(co)
    tgt = bpy.data.objects.new("alvo_" + nome, None); sc.collection.objects.link(tgt)
    tgt.location = alvo
    tc = co.constraints.new("TRACK_TO"); tc.target = tgt
    fim = inicio + nq - 1
    co.location = c0; co.keyframe_insert("location", frame=inicio)
    co.location = c1; co.keyframe_insert("location", frame=fim)
    mk = sc.timeline_markers.new(nome, frame=inicio); mk.camera = co   # troca de camera por marcador
    cortes.append((nome, inicio, fim, co))
    inicio = fim + 1
sc.frame_start, sc.frame_end = 1, inicio - 1

def altura_heroi(obj, cam):
    # % da altura do quadro ocupada pela caixa do heroi (0 a 100), e se esta inteiro no quadro
    dg = bpy.context.evaluated_depsgraph_get()
    pts = [world_to_camera_view(sc, cam, obj.matrix_world @ Vector(c)) for c in obj.bound_box]
    ys = [p.y for p in pts]; xs = [p.x for p in pts]
    dentro = min(xs) >= 0 and max(xs) <= 1 and min(ys) >= 0 and max(ys) <= 1
    return round((max(ys) - min(ys)) * 100, 1), dentro

arquivos = []
for nome, f0, f1, co in cortes:
    for f in (f0, (f0 + f1) // 2, f1):
        sc.frame_set(f)
        sc.camera = co
        alt, dentro = altura_heroi(heroi, co)
        print(f"QA {nome} f{f}: heroi ocupa {alt}% da altura; inteiro no quadro={dentro}")
        p = os.path.join(OUT, f"{nome}_f{f:03d}.png")
        sc.render.filepath = p
        bpy.ops.render.render(write_still=True)
        arquivos.append(p)

# Folha de contato: 3 colunas (ini, meio, fim) x N linhas (planos)
cols, linhas = 3, len(cortes)
folha = np.ones((linhas * H, cols * W, 4), dtype=np.float32)
for i, p in enumerate(arquivos):
    img = bpy.data.images.load(p)
    px = np.array(img.pixels[:], dtype=np.float32).reshape(H, W, 4)  # origem embaixo
    r, c = divmod(i, cols)
    y0 = (linhas - 1 - r) * H
    folha[y0:y0 + H, c * W:(c + 1) * W] = px
    bpy.data.images.remove(img)
fi = bpy.data.images.new("folha", cols * W, linhas * H, alpha=True)
fi.pixels = folha.ravel()
fi.filepath_raw = os.path.join(OUT, "folha_contato.png"); fi.file_format = "PNG"
fi.save()
print("OK", len(arquivos), "quadros;", sc.frame_end, "quadros totais =", round(sc.frame_end / FPS, 2), "s")
