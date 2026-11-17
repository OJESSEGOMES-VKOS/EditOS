# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 | fonte: API bpy 5.2.2; ordem e timing: KeyShot blog (exploded view) + prática de estúdio
# Vista explodida com cascata: peças saem de fora pra dentro, cada uma com atraso, e voltam em ordem inversa.
import bpy
from mathutils import Vector
from _util import interpolar

def explodir(pecas, inicio=30, dur=18, atraso=3, segurar=36, voltar=True):
    """pecas = lista de (objeto, vetor_direcao, distancia_m) na ORDEM de saída (casca externa primeiro)."""
    q = inicio
    for i, (ob, dirv, dist) in enumerate(pecas):
        base = ob.location.copy()
        a = inicio + i * atraso
        ob.keyframe_insert("location", frame=a)
        ob.location = base + Vector(dirv).normalized() * dist
        ob.keyframe_insert("location", frame=a + dur)
        if voltar:
            # remonta na ordem inversa: a última que saiu é a primeira que volta
            b = inicio + (len(pecas) - 1) * atraso + dur + segurar + (len(pecas) - 1 - i) * atraso
            ob.keyframe_insert("location", frame=b)
            ob.location = base
            ob.keyframe_insert("location", frame=b + dur)
        interpolar(ob)   # Bezier AUTO_CLAMPED: sai suave, chega suave, sem ultrapassar
    return q

if __name__ == "__main__":
    obs = []
    for i, z in enumerate([0.012, 0.006, 0.0, -0.006]):
        bpy.ops.mesh.primitive_cube_add(size=0.05, location=(0, 0, z)); obs.append(bpy.context.object)
    explodir([(obs[0], (0, 0, 1), 0.04), (obs[1], (0, 0, 1), 0.02), (obs[3], (0, 0, -1), 0.03)])
    bpy.context.scene.frame_set(48); print("OK explodida", [round(o.location.z, 4) for o in obs])
