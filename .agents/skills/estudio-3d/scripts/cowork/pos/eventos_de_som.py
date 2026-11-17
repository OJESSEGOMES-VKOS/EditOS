# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (channelbag + avaliação por quadro) | fonte: https://docs.blender.org/api/current/bpy_extras.anim_utils.html
"""
Gera a lista de "eventos de som" de uma cena animada.
Ideia: o som acompanha a VELOCIDADE, não a chave.
  - WHOOSH: pico local de velocidade acima de um limiar (o objeto passa rápido).
            O som começa ~ (duração do whoosh x 0,55) antes do pico, pra o ápice do som cair no pico.
  - IMPACTO/POUSO: quadro em que o objeto vinha rápido e para (velocidade cai > 80% em até 2 quadros).
  - RISER: janela antes do maior evento (revelação): começa 1 a 2 s antes.
  - CHAVES: lista de quadros com chave (pra foley/UI click em mudanças de estado).
Mede posição em espaço de mundo por quadro (pega parent, constraint e drivers), não só a F-curve.
Uso no Blender: blender -b cena.blend -P eventos_de_som.py -- saida.json
"""
import bpy, json, sys, math
from bpy_extras import anim_utils

def chaves_do_objeto(ob):
    """Quadros com chave (Blender 5.x: F-curves ficam no channelbag do slot)."""
    ad = ob.animation_data
    if not ad or not ad.action:
        return []
    cb = anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot)
    if cb is None:
        return []
    qs = set()
    for fc in cb.fcurves:
        for kp in fc.keyframe_points:
            qs.add(round(kp.co.x))
    return sorted(qs)

def amostrar(scene, objetos):
    fps = scene.render.fps / scene.render.fps_base
    f0, f1 = scene.frame_start, scene.frame_end
    pos = {ob.name: [] for ob in objetos}
    rot = {ob.name: [] for ob in objetos}
    for f in range(f0, f1 + 1):
        scene.frame_set(f)
        for ob in objetos:
            m = ob.matrix_world
            pos[ob.name].append(m.translation.copy())
            rot[ob.name].append(m.to_quaternion())
    vel = {}
    for n in pos:
        v = [0.0]
        for i in range(1, len(pos[n])):
            lin = (pos[n][i] - pos[n][i - 1]).length * fps                     # m/s
            ang = rot[n][i].rotation_difference(rot[n][i - 1]).angle * fps      # rad/s
            v.append(lin + 0.15 * ang)   # 0,15 m por radiano: peso da rotação (ajuste por escala)
        vel[n] = v
    return vel, fps, f0

def detectar(vel, fps, f0, lim_whoosh=1.0, dur_whoosh_s=0.8, queda=0.8):
    eventos = []
    for n, v in vel.items():
        vmax = max(v) if v else 0
        for i in range(1, len(v) - 1):
            # pico de velocidade
            if v[i] >= v[i - 1] and v[i] > v[i + 1] and v[i] >= lim_whoosh and v[i] >= 0.5 * vmax:
                q = f0 + i
                ini = q - round(dur_whoosh_s * 0.55 * fps)
                eventos.append(dict(tipo="WHOOSH", objeto=n, quadro_pico=q, quadro_inicio_som=ini,
                                    t=round((q - f0) / fps, 3), vel=round(v[i], 3)))
            # pouso: vinha rápido e parou em até 2 quadros
            ant = max(v[max(0, i - 2):i]) if i >= 2 else v[i - 1]
            if ant >= lim_whoosh * 0.6 and v[i] <= (1 - queda) * ant and v[i - 1] > v[i]:
                if not eventos or not (eventos[-1]["tipo"] == "IMPACTO" and eventos[-1]["objeto"] == n
                                       and f0 + i - eventos[-1]["quadro"] < 4):
                    # v[i] é a velocidade entre os quadros f0+i-1 e f0+i: o objeto chegou ao repouso em f0+i-1
                    eventos.append(dict(tipo="IMPACTO", objeto=n, quadro=f0 + i - 1,
                                        t=round((i - 1) / fps, 3), vel_antes=round(ant, 3)))
    # riser antes do impacto mais forte
    imp = [e for e in eventos if e["tipo"] == "IMPACTO"]
    if imp:
        top = max(imp, key=lambda e: e["vel_antes"])
        eventos.append(dict(tipo="RISER", objeto=top["objeto"], quadro_inicio=max(f0, top["quadro"] - round(1.5 * fps)),
                            quadro_fim=top["quadro"], t=round((max(f0, top["quadro"] - round(1.5 * fps)) - f0) / fps, 3)))
    return sorted(eventos, key=lambda e: e.get("quadro", e.get("quadro_pico", e.get("quadro_inicio", 0))))

def main(saida=None, objetos=None):
    scene = bpy.context.scene
    if objetos is None:
        objetos = [o for o in scene.objects if o.animation_data and o.animation_data.action]
    vel, fps, f0 = amostrar(scene, objetos)
    ev = detectar(vel, fps, f0)
    chaves = {o.name: chaves_do_objeto(o) for o in objetos}
    res = dict(fps=fps, frame_start=f0, eventos=ev, chaves=chaves,
               velocidade={n: [round(x, 3) for x in v] for n, v in vel.items()})
    if saida:
        with open(saida, "w") as fh:
            json.dump(res, fh, indent=1)
    return res

if __name__ == "__main__":
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    r = main(argv[0] if argv else None)
    for e in r["eventos"]:
        print(e)
