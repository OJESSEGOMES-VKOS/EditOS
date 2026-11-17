# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 | fonte: API bpy 5.2.2 (Keyframe.interpolation, FCurve modifiers)
# Giro em plataforma (turntable) com velocidade em graus por segundo, sem tranco no começo nem no fim.
import bpy, math
from _util import fcurves

def turntable(ob, graus_por_seg=24, inicio=1, fim=150, fps=30, rampa_q=12):
    """Linear no miolo; rampa de entrada/saída de rampa_q quadros (aceleração suave)."""
    total = graus_por_seg * (fim - inicio) / fps
    ob.rotation_euler.z = 0
    ob.keyframe_insert("rotation_euler", index=2, frame=inicio)
    ob.rotation_euler.z = math.radians(total)
    ob.keyframe_insert("rotation_euler", index=2, frame=fim)
    for fc in fcurves(ob):
        if fc.data_path == "rotation_euler":
            k0, k1 = fc.keyframe_points
            k0.interpolation = 'BEZIER'
            # alças com comprimento de rampa_q quadros: o miolo fica quase linear
            for k, s in ((k0, 1), (k1, -1)):
                k.handle_left_type = k.handle_right_type = 'FREE'
                k.handle_right = (k.co.x + rampa_q, k.co.y) if s == 1 else k.handle_right
                k.handle_left = (k.co.x - rampa_q, k.co.y) if s == -1 else k.handle_left
    return total

if __name__ == "__main__":
    bpy.ops.mesh.primitive_cylinder_add(); ob = bpy.context.object
    t = turntable(ob, 24, 1, 150)
    sc = bpy.context.scene
    vals = []
    for f in (1, 13, 75, 138, 150):
        sc.frame_set(f); vals.append(round(math.degrees(ob.rotation_euler.z), 1))
    print("OK turntable total", round(t, 1), "graus; amostras", vals)
