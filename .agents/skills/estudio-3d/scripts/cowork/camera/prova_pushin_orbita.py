# Blender 5.2 | status: executado no bpy 5.2.2 EEVEE (nuvem, GL por software) | fonte: rigs_camera.py, curvas.py, rigs_luz.py (cap. 05)
"""Prova do capítulo 04: push-in + órbita com easing premium num celular em escala real (71,5 x 147 x 7,8 mm).
Plano de 90 quadros (3 s a 30 fps), lente 85 mm, f/4, 9:16.
  Órbita: azimute 35° -> -10° (alça assimétrica 10%/70%)
  Push-in: braço de 62 cm -> 42 cm (mesma curva, começa junto)
  Grua: elevação 14° -> 6° (SINE EASE_IN_OUT)
  Câmera na mão: 0,08° de pico, período 36 quadros
Uso: /home/claude/bvenv/bin/python prova_pushin_orbita.py [pasta_saida] [largura]"""
import sys, os, math, time
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
sys.path.insert(0, os.path.join(AQUI, "..", "luz"))
import bpy
from mathutils import Vector
import rigs_camera as R
import curvas
import rigs_luz as L

args = [a for a in sys.argv[1:] if not a.endswith(".py")]
SAIDA = args[0] if args else "/tmp/prova_cam"
LARG = int(args[1]) if len(args) > 1 else 216
os.makedirs(SAIDA, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
r = sc.render
r.engine = "BLENDER_EEVEE"
r.resolution_x, r.resolution_y = LARG, int(LARG * 16 / 9)
r.resolution_percentage = 100
r.fps = 30
sc.frame_start, sc.frame_end = 1, 90
sc.eevee.taa_render_samples = 16
sc.view_settings.view_transform = "AgX"
sc.view_settings.look = "AgX - Medium High Contrast"
w = bpy.data.worlds.new("Mundo"); sc.world = w
w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.01, 0.01, 0.012, 1)

# ---- produto: celular em escala real
alvo = Vector((0, 0, 0.0735))
bpy.ops.mesh.primitive_cube_add(size=1)
corpo = bpy.context.active_object; corpo.name = "Celular"
corpo.scale = (0.0715, 0.0078, 0.147)
bpy.ops.object.transform_apply(scale=True)
corpo.location = alvo
corpo.rotation_euler = (math.radians(-8), 0, 0)      # inclinado para trás 8°
bv = corpo.modifiers.new("Chanfro", "BEVEL"); bv.width = 0.0032; bv.segments = 6
for p in corpo.data.polygons: p.use_smooth = True
m_corpo = bpy.data.materials.new("Titanio")
b = m_corpo.node_tree.nodes["Principled BSDF"]
b.inputs["Base Color"].default_value = (0.32, 0.30, 0.28, 1)
b.inputs["Metallic"].default_value = 1.0
b.inputs["Roughness"].default_value = 0.28
corpo.data.materials.append(m_corpo)
# tela
bpy.ops.mesh.primitive_plane_add(size=1)
tela = bpy.context.active_object; tela.name = "Tela"
tela.scale = (0.066, 0.141, 1); bpy.ops.object.transform_apply(scale=True)
tela.rotation_euler = (math.radians(90), 0, 0)
tela.parent = corpo
tela.location = (0, -0.00395, 0)
m_tela = bpy.data.materials.new("Tela")
nt = m_tela.node_tree; ns = nt.nodes
bs = ns["Principled BSDF"]
bs.inputs["Base Color"].default_value = (0, 0, 0, 1)
bs.inputs["Roughness"].default_value = 0.05
coord = ns.new("ShaderNodeTexCoord"); grad = ns.new("ShaderNodeTexGradient")
rampa = ns.new("ShaderNodeValToRGB")
rampa.color_ramp.elements[0].color = (0.02, 0.10, 0.55, 1)
rampa.color_ramp.elements[1].color = (0.95, 0.35, 0.10, 1)
mapa = ns.new("ShaderNodeMapping"); mapa.inputs["Rotation"].default_value = (0, 0, math.radians(90))
mapa.inputs["Location"].default_value = (1, 0, 0)        # rotação leva x para -v; +1 traz de volta a 0..1
nt.links.new(coord.outputs["UV"], mapa.inputs["Vector"])
nt.links.new(mapa.outputs["Vector"], grad.inputs["Vector"])
nt.links.new(grad.outputs["Fac"], rampa.inputs["Fac"])
nt.links.new(rampa.outputs["Color"], bs.inputs["Emission Color"])
bs.inputs["Emission Strength"].default_value = 1.0          # AgX: tela até 1,0 (cap. 05/09)
tela.data.materials.append(m_tela)

# apoiar no chão: o ponto mais baixo do celular girado encosta no piso (z = alvo.z - 0,075)
bpy.context.view_layer.update()
minz = min((corpo.matrix_world @ Vector(c)).z for c in corpo.bound_box)
corpo.location.z -= minz - (alvo.z - 0.075)

# ---- luz e fundo (rigs do capítulo 05)
L.fundo_infinito(alvo, escala=0.15)
L.rig_tres_pontos(alvo, escala=0.15)
L.rig_fundo_gradiente(alvo, escala=0.15)

# ---- câmera: órbita + push-in + grua + mão
rig = R.rig_orbita(tuple(alvo), raio=0.62, elev=14, azim=35, lente=85)
piv, bra, cam = rig["pivo"], rig["braco"], rig["cam"]
curvas.mover(piv, "rotation_euler", 2, 1, 90, math.radians(35), math.radians(-10), "premium")
curvas.mover(bra, "location", 1, 1, 90, -0.62, -0.42, "premium")
curvas.mover(piv, "rotation_euler", 0, 1, 90, math.radians(-14), math.radians(-6), "sine_in_out")
foco = R._empty("Foco"); foco.parent = corpo; foco.location = (0, -0.004, 0.02)
R.dof(cam, foco, fstop=4.0, laminas=7)
R.na_mao(cam, amp_graus=0.08, periodo_q=36, fino=False)

quadros = [1, 12, 24, 45, 66, 90]
t0 = time.time()
for q in quadros:
    sc.frame_set(q)
    r.image_settings.media_type = "IMAGE"; r.image_settings.file_format = "PNG"
    r.filepath = os.path.join(SAIDA, f"cam_q{q:03d}.png")
    t = time.time()
    bpy.ops.render.render(write_still=True)
    p = cam.matrix_world.translation
    print(f"q{q}: dist={(p - alvo).length*100:.1f} cm azim={math.degrees(math.atan2(p.x, -p.y)):.1f} graus  {time.time()-t:.1f}s", flush=True)
print(f"total {time.time()-t0:.1f}s")
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(SAIDA, "prova_pushin_orbita.blend"))
