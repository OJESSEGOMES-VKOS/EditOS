# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (cena de teste na nuvem) | fonte: amostragem por frame_set + matrix_world (bpy); channelbag: https://docs.blender.org/api/current/bpy_extras.anim_utils.html
"""
Checagem de movimento para o controle de qualidade (capítulo 10).
Mede a velocidade por quadro (espaço de mundo) de cada objeto animado e da câmera e acusa:
  LINEAR      trecho em movimento com velocidade constante (variação < 0,5%) por >= 10 quadros (curva linear)
  SEM_EASE    sai do repouso para > 60% da velocidade máxima em 1 quadro (partida seca) ou o inverso na chegada
              (atenção: pouso seco de propósito é "impacto"; confira com o roteiro)
  CAM_SEM_PAUSA  câmera em movimento em > 90% dos quadros (girando à toa)
  PARADO      cena inteira parada por > 45 quadros (1,5 s) sem intenção
Gera também um PNG do gráfico de velocidade (se o PIL estiver disponível no Python do Blender; senão grava CSV).
Uso: blender -b cena.blend -P movimento_qa.py -- saida_prefixo
"""
import bpy, sys, json, math

def velocidades(scene, objetos):
    fps = scene.render.fps / scene.render.fps_base
    P = {o.name: [] for o in objetos}
    for f in range(scene.frame_start, scene.frame_end + 1):
        scene.frame_set(f)
        for o in objetos:
            m = o.matrix_world
            P[o.name].append((m.translation.copy(), m.to_quaternion()))
    V = {}
    for n, l in P.items():
        v = [0.0]
        for i in range(1, len(l)):
            lin = (l[i][0] - l[i - 1][0]).length * fps
            ang = l[i][1].rotation_difference(l[i - 1][1]).angle * fps
            v.append(lin + 0.15 * ang)
        V[n] = v
    return V, fps

def analisar(V, scene, cam_nome=None, lim_mov=0.02):
    f0 = scene.frame_start
    achados = []
    for n, v in V.items():
        vmax = max(v) or 1e-9
        mov = [x > lim_mov * vmax + 1e-6 for x in v]
        # LINEAR: janelas de 10 quadros em movimento com coeficiente de variação < 0,5%
        # (o pico de uma Bézier padrão varia ~2 a 3% em 10 quadros; linear de verdade varia ~0%)
        i, aberto = 1, None
        while i + 10 <= len(v):
            jan = v[i:i + 10]
            ok = False
            if all(mov[i:i + 10]):
                media = sum(jan) / 10
                dp = math.sqrt(sum((x - media) ** 2 for x in jan) / 10)
                ok = media > 0.15 * vmax and dp / media < 0.005
            if ok:
                if aberto and aberto["ate"] >= f0 + i - 1:
                    aberto["ate"] = f0 + i + 9
                else:
                    aberto = dict(tipo="LINEAR", objeto=n, de=f0 + i, ate=f0 + i + 9, vel=round(media, 3))
                    achados.append(aberto)
            i += 1
        # SEM_EASE
        for i in range(1, len(v) - 1):
            if v[i - 1] <= lim_mov * vmax and v[i] > 0.6 * vmax:
                achados.append(dict(tipo="SEM_EASE_PARTIDA", objeto=n, quadro=f0 + i - 1))
            if v[i] > 0.6 * vmax and v[i + 1] <= lim_mov * vmax:
                achados.append(dict(tipo="SEM_EASE_CHEGADA", objeto=n, quadro=f0 + i))
        if cam_nome and n == cam_nome:
            frac = sum(mov) / len(mov)
            if frac > 0.9:
                achados.append(dict(tipo="CAM_SEM_PAUSA", objeto=n, fracao_em_movimento=round(frac, 2)))
    # PARADO: nenhum objeto se move por > 45 quadros
    nq = len(next(iter(V.values())))
    parado = 0
    for i in range(nq):
        if all(V[n][i] <= lim_mov * (max(V[n]) or 1) + 1e-6 for n in V):
            parado += 1
            if parado == 46:
                achados.append(dict(tipo="PARADO", ate=f0 + i, quadros=46))
        else:
            parado = 0
    return achados

def grafico(V, caminho, fps):
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        with open(caminho.replace(".png", ".csv"), "w") as fh:
            nomes = list(V)
            fh.write("quadro," + ",".join(nomes) + "\n")
            for i in range(len(V[nomes[0]])):
                fh.write(f"{i}," + ",".join(f"{V[n][i]:.4f}" for n in nomes) + "\n")
        return caminho.replace(".png", ".csv")
    W, H, M = 900, 360, 40
    im = Image.new("RGB", (W, H), (20, 20, 20)); d = ImageDraw.Draw(im)
    cores = [(80, 170, 255), (255, 150, 60), (120, 220, 120), (230, 90, 160)]
    vmax = max(max(v) for v in V.values()) or 1
    nq = len(next(iter(V.values())))
    for k in range(0, nq, int(fps)):     # grade de 1 s
        x = M + (W - 2 * M) * k / max(1, nq - 1); d.line([(x, M), (x, H - M)], fill=(50, 50, 50))
    for c, (n, v) in zip(cores * 4, V.items()):
        vm = max(v) or 1   # cada curva normalizada pelo próprio máximo: o que importa é a FORMA
        pts = [(M + (W - 2 * M) * i / max(1, nq - 1), H - M - (H - 2 * M) * x / vm) for i, x in enumerate(v)]
        d.line(pts, fill=c, width=2)
        d.text((M + 4, M - 30 + 12 * list(V).index(n)), f"{n} (máx {vm:.2f})", fill=c)
    im.save(caminho)
    return caminho

def main(prefixo="movimento"):
    sc = bpy.context.scene
    objs = [o for o in sc.objects if o.animation_data and o.animation_data.action]
    if sc.camera and sc.camera not in objs and sc.camera.animation_data:
        objs.append(sc.camera)
    V, fps = velocidades(sc, objs)
    ach = analisar(V, sc, sc.camera.name if sc.camera else None)
    g = grafico(V, prefixo + "_velocidade.png", fps)
    json.dump(dict(achados=ach, grafico=g), open(prefixo + "_laudo.json", "w"), indent=1)
    return ach, g

if __name__ == "__main__":
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    a, g = main(argv[0] if argv else "movimento")
    for x in a: print(x)
    print("gráfico:", g)
