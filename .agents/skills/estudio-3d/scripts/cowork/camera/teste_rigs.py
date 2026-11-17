# Blender 5.2 | status: executado no bpy 5.2.2 (nuvem) | mede cada rig de rigs_camera.py
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy
from mathutils import Vector
import rigs_camera as R, curvas
from bpy_extras.object_utils import world_to_camera_view
sc = bpy.context.scene
for o in list(bpy.data.objects): bpy.data.objects.remove(o)
sc.render.fps = 30; sc.frame_start, sc.frame_end = 1, 120
sc.render.resolution_x, sc.render.resolution_y = 1080, 1920

def erro_mira(cam, alvo):
    m = cam.matrix_world
    fwd = (m.to_3x3() @ Vector((0, 0, -1))).normalized()
    d = (Vector(alvo) - m.translation).normalized()
    return math.degrees(fwd.angle(d))
def horizonte(cam):
    x = cam.matrix_world.to_3x3() @ Vector((1, 0, 0))
    return math.degrees(math.asin(max(-1, min(1, x.z))))

# 1) órbita + push-in
r = R.rig_orbita((0, 0, 0.075), raio=R.distancia_enquadrar(0.15, 85, "9:16"), elev=12, azim=35, lente=85)
piv, bra, cam = r["pivo"], r["braco"], r["cam"]
curvas.mover(piv, "rotation_euler", 2, 1, 90, math.radians(35), math.radians(-10), "premium")
curvas.mover(bra, "location", 1, 1, 90, -0.62, -0.45, "premium")
for f in (1, 45, 90):
    sc.frame_set(f)
    p = cam.matrix_world.translation
    dist = (p - Vector((0, 0, 0.075))).length
    print(f"ORBITA q{f}: dist={dist*100:.1f} cm alt={(p.z-0.075)*100:.1f} cm azim={math.degrees(math.atan2(-p.x, -p.y)):.1f} erro_mira={erro_mira(cam,(0,0,0.075)):.2f} graus horizonte={horizonte(cam):.2f} graus")
print("raio 60% celular 85mm 9:16 =", round(R.distancia_enquadrar(0.15, 85, "9:16"), 4))
# 2) Track To x Damped Track
alvo = R._empty("Alvo"); alvo.location = (0.1, 0.0, 0.05)
for tipo in ("TRACK_TO", "DAMPED_TRACK"):
    c = R.camera_produto("T_" + tipo, 50, ativa=False); c.location = (0.3, -0.5, 0.4)
    c.rotation_euler = (math.radians(60), 0, math.radians(10))
    R.mirar_com(c, alvo, tipo); bpy.context.view_layer.update()
    print(f"{tipo}: erro_mira={erro_mira(c, alvo.location):.2f} horizonte(roll)={horizonte(c):.2f} graus")
# 3) Follow Path
rc = R.rig_caminho([(-0.5, -0.6, 0.15), (0, -0.45, 0.25), (0.5, -0.6, 0.15)], alvo, 50, q0=1, q1=90)
for f in (1, 45, 90):
    sc.frame_set(f); p = rc["cam"].matrix_world.translation
    print(f"CAMINHO q{f}: pos=({p.x:.3f},{p.y:.3f},{p.z:.3f}) erro_mira={erro_mira(rc['cam'], alvo.location):.2f}")
# 4) peso: líder anda 0 -> 0,3 m em 10 quadros (q20 a q30, expo_out) ; mira segue com tau 4
lider = R._empty("Lider"); curvas.mover(lider, "location", 0, 20, 30, 0.0, 0.3, "expo_out")
mira = R._empty("Mira")
R.peso(mira, lider, 1, 80, tau_q=4.0)
for f in (20, 25, 30, 35, 40, 50):
    sc.frame_set(f)
    print(f"PESO q{f}: lider x={lider.location.x:.3f} mira x={mira.location.x:.3f} atraso={lider.location.x-mira.location.x:.3f} m")
q95 = next(f for f in range(20, 80) if (sc.frame_set(f) or True) and mira.location.x >= 0.285)
print("PESO mira chega a 95% no quadro", q95, "(líder chega no 30)")
# 5) na mão
cm = R.camera_produto("Mao", 50, ativa=False); cm.rotation_euler = (math.radians(90), 0, 0)
R.na_mao(cm, amp_graus=0.15, periodo_q=36, amp_mm=0.5)
rx = []; lx = []
for f in range(1, 601):
    sc.frame_set(f); rx.append(math.degrees(cm.rotation_euler.x) - 90); lx.append(cm.location.x * 1000)
print(f"MAO tilt: min={min(rx):.3f} max={max(rx):.3f} graus | loc x: min={min(lx):.2f} max={max(lx):.2f} mm")
vel = [abs(rx[i]-rx[i-1])*30 for i in range(1, len(rx))]
print(f"MAO velocidade angular max={max(vel):.2f} graus/s media={sum(vel)/len(vel):.2f}")
# 6) rack focus
f_e = R._empty("Foco"); f_e.location = (0, 0, 0)
cf = R.camera_produto("Rack", 100, ativa=False); R.dof(cf, f_e, 2.8)
R.rack_focus(f_e, (0, 0.10, 0.05), (0, -0.05, 0.05), 30, 18)
for f in (30, 36, 48):
    sc.frame_set(f); print(f"RACK q{f}: foco y={f_e.location.y:.3f}")
print("DOF focus_object:", cf.data.dof.focus_object.name, "fstop", round(cf.data.dof.aperture_fstop, 2))
