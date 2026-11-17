# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (roda e renderiza em Cycles CPU) | fonte: API bpy 5.2.2 sondada + _CONTEXTO.md (celular 71,5 x 147 x 7,8 mm, emissão 1,0 no AgX)
# Tela de app com vidro e camadas de interface explodidas em profundidade.
# Uso: /home/claude/bvenv/bin/python tela_camadas_explodidas.py  (ou blender -b -P tela_camadas_explodidas.py)
# Troque UI_PNG por um export do Figma (PNG 3x). Sem arquivo, o script gera uma interface de teste.
import bpy, math, os
import numpy as np
from mathutils import Vector
from bpy_extras import anim_utils

UI_PNG = ""            # caminho do PNG exportado do Figma (ex.: tela_home@3x.png). Vazio = gera teste.
SAIDA = "/home/claude/provas/ui_explodida.png"
MM = 0.001             # 1 mm em metros (cena em escala real)

# Medidas (mm)
CORPO = (71.5, 147.0, 7.8)       # celular de referência do estúdio
TELA = (65.0, 140.5)             # área ativa aproximada [não verificado para modelo específico]
RAIO_CORPO = 9.0                  # raio do canto do corpo [não verificado; meça o aparelho real]
RAIO_TELA = 7.5
VIDRO_ESP = 0.7                   # espessura do vidro de cobertura
CARTAO_ESP = 0.6                  # espessura de cada cartão de interface
SEPARACAO = 11.0                  # distância entre camadas explodidas (8 a 15 mm lê bem num aparelho de 147 mm)
EXPLODE_QUADROS = (30, 54)        # quadro inicial e final da explosão (24 quadros = 0,8 s a 30 fps)

scn = bpy.context.scene
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)

# ---------- utilidades ----------
def caixa_arredondada(nome, w, h, esp, raio, z=0.0):
    """Caixa fina com cantos arredondados no plano XY (bevel só nos vértices verticais via modificador)."""
    bpy.ops.mesh.primitive_cube_add(size=1)
    ob = bpy.context.object
    ob.name = nome
    ob.scale = (w * MM, h * MM, esp * MM)
    bpy.ops.object.transform_apply(scale=True)
    ob.location.z = z * MM
    # marca só as 4 arestas verticais pra arredondar canto sem arredondar a face
    me = ob.data
    for e in me.edges:
        v1, v2 = me.vertices[e.vertices[0]].co, me.vertices[e.vertices[1]].co
        e.select = abs(v1.x - v2.x) < 1e-9 and abs(v1.y - v2.y) < 1e-9
    bw = me.attributes.get("bevel_weight_edge") or me.attributes.new("bevel_weight_edge", 'FLOAT', 'EDGE')
    for i, e in enumerate(me.edges):
        bw.data[i].value = 1.0 if e.select else 0.0
    b = ob.modifiers.new("Canto", 'BEVEL')
    b.limit_method = 'WEIGHT'
    b.width = raio * MM
    b.segments = 10
    # chanfro pequeno nas bordas de cima e de baixo, pra pegar luz (0,3 mm)
    b2 = ob.modifiers.new("Quebra", 'BEVEL')
    b2.limit_method = 'ANGLE'
    b2.width = min(0.3, esp * 0.4) * MM
    b2.segments = 2
    b2.harden_normals = True
    bpy.ops.object.shade_smooth()
    return ob

def plano_tela(nome, w, h, raio, z):
    bpy.ops.mesh.primitive_plane_add(size=1)
    ob = bpy.context.object
    ob.name = nome
    ob.scale = (w * MM, h * MM, 1)
    bpy.ops.object.transform_apply(scale=True)
    ob.location.z = z * MM
    b = ob.modifiers.new("Canto", 'BEVEL')
    b.affect = 'VERTICES'
    b.width = raio * MM
    b.segments = 10
    return ob

def gerar_ui_teste(w=390, h=844, escala=3):
    """Interface fictícia em pixels (sem PIL): fundo, barra, cartões. Só pra prova."""
    W, H = w * escala, h * escala
    px = np.zeros((H, W, 4), dtype=np.float32)
    px[..., :3] = (0.035, 0.04, 0.06); px[..., 3] = 1
    def ret(x, y, ww, hh, cor):
        y0 = H - (y + hh) * escala; y1 = H - y * escala
        px[y0:y1, x * escala:(x + ww) * escala, :3] = cor
    ret(0, 0, 390, 110, (0.07, 0.08, 0.11))
    ret(20, 60, 180, 28, (0.9, 0.9, 0.92))
    ret(20, 140, 350, 180, (0.95, 0.42, 0.12))
    ret(20, 340, 165, 140, (0.16, 0.18, 0.24))
    ret(205, 340, 165, 140, (0.16, 0.18, 0.24))
    for i in range(4):
        ret(20, 500 + i * 70, 350, 56, (0.11, 0.12, 0.16))
        ret(32, 512 + i * 70, 32, 32, (0.3, 0.75, 0.55))
        ret(76, 516 + i * 70, 200, 10, (0.75, 0.75, 0.78))
    ret(0, 780, 390, 64, (0.07, 0.08, 0.11))
    img = bpy.data.images.new("UI_teste", W, H, alpha=True)
    img.pixels.foreach_set(px.ravel())
    img.pack()
    return img

def mat_tela(img, forca=1.0, difuso=True):
    """Tela: imagem como emissão 1,0 (AgX) + a mesma imagem como cor base, pra RECEBER sombra das camadas."""
    m = bpy.data.materials.new("Tela_UI")
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = img
    tex.interpolation = 'Cubic'   # 'Closest' só se o pixel da textura >= pixel do render (ver seção tipografia)
    tex.extension = 'EXTEND'
    nt.links.new(tex.outputs["Color"], p.inputs["Emission Color"])
    p.inputs["Emission Strength"].default_value = forca
    if difuso:
        nt.links.new(tex.outputs["Color"], p.inputs["Base Color"])
        p.inputs["Roughness"].default_value = 0.35
    else:
        p.inputs["Base Color"].default_value = (0, 0, 0, 1)
    return m, tex

def mat_vidro():
    m = bpy.data.materials.new("Vidro_Cobertura")
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (1, 1, 1, 1)
    p.inputs["Transmission Weight"].default_value = 1.0
    p.inputs["Roughness"].default_value = 0.02
    p.inputs["IOR"].default_value = 1.5
    p.inputs["Coat Weight"].default_value = 0.0
    return m

def mat_cartao_vidro_fosco(cor=(0.9, 0.92, 1.0, 1)):
    """Cartão estilo vidro fosco: transmissão 1, aspereza 0,25 a 0,35 (borra o que está atrás)."""
    m = bpy.data.materials.new("Cartao_Fosco")
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = cor
    p.inputs["Transmission Weight"].default_value = 1.0
    p.inputs["Roughness"].default_value = 0.3
    p.inputs["IOR"].default_value = 1.45
    return m

def mat_cartao_solido(img, x0, y0, x1, y1):
    """Cartão com um recorte da própria UI (coordenadas UV 0..1 do recorte)."""
    m = bpy.data.materials.new("Cartao_UI")
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    uv = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Location"].default_value = (x0, y0, 0)
    mp.inputs["Scale"].default_value = (x1 - x0, y1 - y0, 1)
    tex = nt.nodes.new("ShaderNodeTexImage"); tex.image = img; tex.extension = 'EXTEND'
    nt.links.new(uv.outputs["UV"], mp.inputs["Vector"])
    nt.links.new(mp.outputs["Vector"], tex.inputs["Vector"])
    nt.links.new(tex.outputs["Color"], p.inputs["Base Color"])
    nt.links.new(tex.outputs["Color"], p.inputs["Emission Color"])
    p.inputs["Emission Strength"].default_value = 0.6
    p.inputs["Roughness"].default_value = 0.3
    return m

def mat_corpo():
    m = bpy.data.materials.new("Corpo_Aluminio")
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (0.08, 0.085, 0.09, 1)
    p.inputs["Metallic"].default_value = 1.0
    p.inputs["Roughness"].default_value = 0.28
    return m

def easing_bezier(ob):
    """Liga todas as chaves do objeto em Bezier com alças AUTO_CLAMPED (sem ultrapassar)."""
    ad = ob.animation_data
    if not ad or not ad.action:
        return
    cb = anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot)
    for fc in cb.fcurves:
        for k in fc.keyframe_points:
            k.interpolation = 'BEZIER'
            k.handle_left_type = k.handle_right_type = 'AUTO_CLAMPED'

# ---------- cena ----------
img = bpy.data.images.load(UI_PNG) if UI_PNG and os.path.exists(UI_PNG) else gerar_ui_teste()

corpo = caixa_arredondada("Corpo", *CORPO, RAIO_CORPO, z=-CORPO[2] / 2)
corpo.data.materials.append(mat_corpo())

tela = plano_tela("Tela", *TELA, RAIO_TELA, z=0.05)
mt, _ = mat_tela(img)
tela.data.materials.append(mt)

vidro = caixa_arredondada("Vidro", CORPO[0] - 1.2, CORPO[1] - 1.2, VIDRO_ESP, RAIO_CORPO - 0.6, z=VIDRO_ESP / 2 + 0.1)
vidro.data.materials.append(mat_vidro())

# Três cartões que saem da tela. Coordenadas UV do recorte = posição do elemento no PNG (0..1, origem embaixo).
cartoes = [
    # nome, largura, altura, centro_y (mm), material
    ("Cartao_Destaque", 58.5, 30.0, 34.0, mat_cartao_solido(img, 20/390, 1-320/844, 370/390, 1-140/844)),
    ("Cartao_Lista",    58.5, 38.0, -22.0, mat_cartao_vidro_fosco()),
    ("Cartao_Botao",    40.0, 9.0, -58.0, mat_cartao_solido(img, 0.1, 0.02, 0.9, 0.06)),
]
obs_cartao = []
for i, (nome, w, h, cy, mat) in enumerate(cartoes):
    c = caixa_arredondada(nome, w, h, CARTAO_ESP, 4.0, z=1.2)
    c.location.y = cy * MM
    c.data.materials.append(mat)
    obs_cartao.append(c)

# Animação da explosão: cada cartão sobe SEPARACAO*(i+1) mm, com 4 quadros de atraso entre eles (cascata).
q0, q1 = EXPLODE_QUADROS
for i, c in enumerate(obs_cartao):
    z0 = c.location.z
    atraso = i * 4
    c.keyframe_insert("location", index=2, frame=q0 + atraso)
    c.location.z = z0 + SEPARACAO * (i + 1) * MM
    c.keyframe_insert("location", index=2, frame=q1 + atraso)
    easing_bezier(c)

# Grupo inclinado: o aparelho gira 38° em X (tela vira pra câmera) e -24° em Z pra mostrar a profundidade.
raiz = bpy.data.objects.new("Raiz", None); scn.collection.objects.link(raiz)
for o in [corpo, tela, vidro] + obs_cartao:
    o.parent = raiz
raiz.rotation_euler = (math.radians(38), 0, math.radians(-24))

# ---------- luz e câmera ----------
def area(nome, energia, tam, loc, alvo=(0, 0, 0), temp=None):
    l = bpy.data.lights.new(nome, 'AREA'); l.energy = energia; l.size = tam
    if temp:
        l.use_temperature = True; l.temperature = temp
    o = bpy.data.objects.new(nome, l); scn.collection.objects.link(o)
    o.location = loc
    d = Vector(alvo) - Vector(loc)
    o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    return o

# Principal lateral e rasante: fora do ângulo de reflexão do vidro visto pela câmera.
# Se a principal ficar "atrás" da câmera, o reflexo dela cobre a tela e a UI fica cinza leitosa (testado).
area("Principal", 25, 0.5, (0.5, 0.15, 0.12), temp=5600)
area("Contorno", 30, 0.2, (-0.35, 0.4, 0.15), temp=7000)
area("Preenchimento", 4, 1.0, (-0.45, -0.2, 0.05), temp=5200)

cam_d = bpy.data.cameras.new("Cam"); cam_d.lens = 85
cam_d.dof.use_dof = True; cam_d.dof.aperture_fstop = 5.6
cam = bpy.data.objects.new("Cam", cam_d); scn.collection.objects.link(cam)
cam.location = (0.12, -0.46, 0.34)
cam.rotation_euler = (Vector((0, 0, 0.005)) - cam.location).to_track_quat('-Z', 'Y').to_euler()
cam_d.dof.focus_object = raiz
scn.camera = cam

w = bpy.data.worlds.new("Mundo"); scn.world = w
w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.012, 0.013, 0.018, 1)

# ---------- render ----------
scn.render.engine = 'CYCLES'
scn.cycles.device = 'CPU'
scn.cycles.samples = 48
scn.cycles.use_denoising = True
scn.render.resolution_x, scn.render.resolution_y = 360, 640
scn.render.fps = 30
scn.view_settings.view_transform = 'AgX'
scn.view_settings.look = 'AgX - Medium High Contrast'
scn.frame_start, scn.frame_end = 1, 90
scn.frame_set(70)   # depois da explosão
scn.render.filepath = SAIDA
os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
if __name__ == "__main__" or bpy.app.background:
    bpy.ops.render.render(write_still=True)
    print("OK render", SAIDA)
