# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (rodado na nuvem, EEVEE 270x480) | fonte: capitulo 09
"""Monta uma cena simples a partir do tempos.json e renderiza os quadros-chave.

Como rodar:
  blender -b -P cena_exemplo.py -- --tempos tempos_exemplo.json --saida ../../provas --pct 25
  (na nuvem: /home/claude/bvenv/bin/python cena_exemplo.py -- --pct 25)
"""
import math
import os
import pathlib
import sys

AQUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
import bpy  # noqa: E402
import base as B  # noqa: E402

a = B.parse_args([
    ("--tempos", str, str(AQUI / "tempos_exemplo.json")),
    ("--saida", str, "/home/claude/provas"),
    ("--pct", int, 25),
    ("--amostras", int, 16),
    ("--motor", str, "BLENDER_EEVEE"),
    ("--prefixo", str, "pipeline"),
    ("--so-salvar", bool, False),
])
T = B.carregar_tempos(a.tempos)
fps = T["fps"]
q_fim = B.seg_para_quadro(T["duracao_s"], fps) - 1
P = {p["nome"]: p for p in T["planos"]}

# --- cena base -------------------------------------------------------------
cena = B.limpar_cena()
B.unidades_mm(cena)
B.definir_formato(T["formato"], a.pct, fps)
B.cor_agx("AgX - Medium High Contrast")
cena.frame_start, cena.frame_end = 1, q_fim
cena.render.engine = a.motor
if a.motor == "BLENDER_EEVEE":
    cena.eevee.taa_render_samples = a.amostras
else:
    cena.cycles.samples = a.amostras
B.mundo_cor((0.012, 0.012, 0.016), 1.0)

# --- objetos ---------------------------------------------------------------
# fundo vertical escuro, afastado 35 cm atras do heroi (nao o infinito cinza
# padrao e NUNCA um chao em z=0 cortando o objeto: erro da versao 1)
bpy.ops.mesh.primitive_plane_add(size=3, location=(0, 0.35, 0), rotation=(math.radians(90), 0, 0))
fundo = bpy.context.active_object
fundo.name = "Fundo"
fundo.data.materials.append(B.material_basico("M_Fundo", (0.035, 0.03, 0.04, 1), 0.55))

# celular em escala real: 71,5 x 147 x 7,8 mm
bpy.ops.mesh.primitive_cube_add(size=1)
cel = bpy.context.active_object
cel.name = "Celular"
cel.scale = (0.0715, 0.0078, 0.147)
bpy.ops.object.transform_apply(scale=True)
B.aplicar_chanfro(cel, largura_m=0.0025, segmentos=4, angulo_graus=40)
cel.data.materials.append(B.material_basico("M_Corpo", (0.02, 0.02, 0.022, 1), 0.28, metal=0.9))

# tela (plano levemente a frente da face -Y) com emissao contida (1,0)
bpy.ops.mesh.primitive_plane_add(size=1)
tela = bpy.context.active_object
tela.name = "Tela"
tela.scale = (0.066, 0.141, 1)
tela.rotation_euler = (math.radians(90), 0, 0)
bpy.ops.object.transform_apply(scale=True, rotation=True)
tela.location = (0, -0.00395, 0)
tela.parent = cel
mt = B.material_basico("M_Tela", (0.0, 0.0, 0.0, 1), 0.08)
bsdf = mt.node_tree.nodes["Principled BSDF"]
# tela com gradiente vertical (azul em cima, quase preto embaixo) para nao
# virar placa chapada; emissao 0,8 (abaixo do limite de ~1,0 no AgX)
nt = mt.node_tree
coord = nt.nodes.new("ShaderNodeTexCoord")
sep = nt.nodes.new("ShaderNodeSeparateXYZ")
rampa = nt.nodes.new("ShaderNodeValToRGB")
rampa.color_ramp.elements[0].color = (0.005, 0.01, 0.03, 1)
rampa.color_ramp.elements[1].color = (0.10, 0.32, 1.0, 1)
nt.links.new(coord.outputs["Generated"], sep.inputs["Vector"])
nt.links.new(sep.outputs["Z"], rampa.inputs["Fac"])  # plano em XZ: Y e constante
nt.links.new(rampa.outputs["Color"], bsdf.inputs["Emission Color"])
bsdf.inputs["Emission Strength"].default_value = 0.8
bsdf.inputs["Coat Weight"].default_value = 1.0
tela.data.materials.append(mt)

# tres palavras em texto 3D
fonte = None
for f in ("/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf",
          "C:/Windows/Fonts/arialbd.ttf"):
    if os.path.exists(f):
        fonte = bpy.data.fonts.load(f, check_existing=True)
        break
m_txt = B.material_basico("M_Texto", (0.62, 0.6, 0.57, 1), 0.35)
palavras = []
for i, w in enumerate(["PEDIU.", "CHEGOU.", "PRONTO."]):
    c = bpy.data.curves.new(f"Txt_{w}", type="FONT")
    c.body = w
    c.size = 0.028
    c.extrude = 0.002
    c.bevel_depth = 0.0004
    c.bevel_resolution = 2
    c.align_x = "CENTER"
    if fonte:
        c.font = fonte
    o = bpy.data.objects.new(c.name, c)
    cena.collection.objects.link(o)
    o.data.materials.append(m_txt)
    o.rotation_euler = (math.radians(90), 0, 0)
    o.location = (0, -0.03, -0.112 - i * 0.034)
    palavras.append(o)

# --- luz: principal 45 graus/30 acima, contorno 135 graus mais fria --------
alvo = (0, 0, -0.06)
B.luz_area("Principal", (-0.55, -0.6, 0.40), alvo, 16, 0.6, kelvin=5200, grade_graus=70)
B.luz_area("Preench", (0.6, -0.6, -0.05), alvo, 4, 0.8, kelvin=5600)
B.luz_area("Contorno", (0.30, 0.22, 0.30), (0, 0, 0), 60, 0.25, kelvin=7500, grade_graus=60)
B.luz_area("ContornoEsq", (-0.30, 0.22, 0.20), (0, 0, 0), 40, 0.25, kelvin=7500, grade_graus=60)
# light linking: os contornos so tocam o heroi. Na versao 3 eles clareavam o
# fundo inteiro (canto superior foi de 0,00 para 0,78 de brilho so com eles).
heroi = bpy.data.collections.new("Heroi_Luz")
for o in [cel, tela] + palavras:
    heroi.objects.link(o)
for nome in ("Contorno", "ContornoEsq"):
    cena.objects[nome].light_linking.receiver_collection = heroi
# mancha de luz no fundo atras do heroi: separa figura e fundo
B.luz_area("Fundo", (0, 0.05, 0.5), (0, 0.35, 0.05), 2.5, 0.4, kelvin=4200, grade_graus=45)

# --- camera ----------------------------------------------------------------
cam = B.criar_camera("Cam", P["entrada"]["lente_mm"], (0, -0.95, 0.02), (0, 0, -0.05))

# --- animacao a partir do tempos.json --------------------------------------
pe, pr, pm, pa = P["entrada"], P["revelacao"], P["mensagem"], P["assinatura"]
# entrada: sobe 18 cm com BACK (passa e volta), 24 quadros
B.mover(cel, "location", pe["q_ini"], pe["q_ini"] + 24, (0, 0, -0.18), (0, 0, 0.0),
        interp="BACK", easing="EASE_OUT", back=1.3)
# revelacao: gira 35 graus em Z com EXPO EASE_IN_OUT
B.mover(cel, "rotation_euler", pr["q_ini"], pr["q_ini"] + 40, (0, 0, 0),
        (0, 0, math.radians(35)), interp="EXPO", easing="EASE_IN_OUT")
# mensagem: palavras sobem 2 cm e crescem, cascata de 4 quadros
for o in palavras:
    o.scale = (0, 0, 0)
B.cascata(palavras, "scale", pm["q_ini"], 12, 4, (0, 0, 0), (1, 1, 1), interp="BACK", back=1.6)
# camera: empurrao lento continuo de 6 por cento em todo o filme
B.mover(cam, "location", 1, q_fim, (0, -0.95, 0.02), (0, -0.89, 0.02),
        interp="SINE", easing="EASE_IN_OUT")
B.ruido(cam, "location", 2, forca=0.0008, escala=25)

# --- render dos quadros-chave ----------------------------------------------
os.makedirs(a.saida, exist_ok=True)
if a.so_salvar:
    bpy.ops.wm.save_as_mainfile(filepath=str(AQUI / "cena_exemplo.blend"))
    sys.exit(0)
caminhos = []
for q in T["quadros_chave"]:
    caminhos.append(B.salvar_quadro(q, os.path.join(a.saida, f"{a.prefixo}_q{q:03d}.png")))
try:
    B.folha_contato(caminhos, os.path.join(a.saida, f"{a.prefixo}_folha.png"), colunas=4,
                    rotulos=[f"q{q} {p['nome']}" for q, p in zip(T["quadros_chave"], T["planos"])])
    B.log("folha de contato ok")
except ImportError:
    B.log("Pillow ausente: rode a folha de contato com o Python do sistema")
B.log("fim")
