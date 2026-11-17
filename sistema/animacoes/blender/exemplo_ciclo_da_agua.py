"""Exemplo: o ciclo da água em 3D de bloquinho (10 s, vertical 1080x1920, 30 qps).

Rodar de dentro de sistema/, pela trava (QUEM=animacoes sh tools/com-trava.sh <blender> ...):
    blender -b -P animacoes/blender/exemplo_ciclo_da_agua.py               o vídeo -> animacoes/estilos/exemplos/ciclo-da-agua-3d-vN.mp4
    blender -b -P animacoes/blender/exemplo_ciclo_da_agua.py -- --quadro 6 só o quadro do segundo 6 -> sistema/.tmp/

A história: o sol esquenta o mar (0-2 s), a água sobe em vapor (1,5-4,5 s), vira nuvem e escurece (3,5-5,5 s),
chove na terra (5,5-8 s) e a planta cresce (7-10 s).
"""
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import kit_bloquinho as K  # noqa: E402

DUR = 10.0
sc = K.nova_cena(DUR)

# ---------------- o lugar: terra à esquerda, mar à direita
terra = K.bloco('terra', (8, 12, 1.0), (-3.5, 0, -0.5), K.COR['grama'])
barranco = K.bloco('barranco', (8, 12, 1.2), (-3.5, 0, -1.6), K.COR['terra'])
mar = K.bloco('mar', (8, 12, 1.6), (4.5, 0, -1.0), K.COR['agua'])
K.contorno([terra, barranco, mar])
ondas = []
for k, (x, y) in enumerate(((2.2, -2.5), (4.4, -1.0), (6.2, -3.2), (3.4, 1.0), (5.6, 2.0))):
    o = K.bloco(f'onda{k}', (1.0, 0.5, 0.12), (x, y, -0.15), K.COR['agua2'])
    K.balancar(o, 0, DUR, amp=0.06, periodo=1.4 + 0.2 * k)
    ondas.append(o)
for k, (x, y, h) in enumerate(((-6.0, 3.0, 2.6), (-4.6, 4.2, 2.0))):
    K.arvore(f'arvore{k}', (x, y, 0), h)

# ---------------- o sol: bola que brilha, raios que giram devagar
sol = K.grupo('sol', (-3.2, 6, 14.5))
K.bola('sol_bola', 1.3, (0, 0, 0), K.COR['sol'], sol, detalhe=1, brilha=True)
for k in range(8):
    a = k * math.pi / 4
    r = K.bloco(f'raio{k}', (0.25, 0.25, 0.8), (1.9 * math.sin(a), 0, 1.9 * math.cos(a)), K.COR['sol2'], sol, brilha=True)
    r.rotation_euler.y = a
K.chaves(sol, 'rotation_euler', [(0, (0, 0, 0)), (DUR, (0, math.radians(-90), 0))], suave=False)
K.chaves(sol, 'scale', [(0, (1, 1, 1)), (1.0, (1.15, 1.15, 1.15)), (2.0, (1, 1, 1))])     # o sol "esquenta"

# ---------------- vapor: bolinhas saem do mar e sobem até onde a nuvem vai nascer
for k in range(9):
    x0 = 2.4 + (k % 3) * 1.4
    t0 = 1.4 + k * 0.28
    v = K.bola(f'vapor{k}', 0.28, (x0, -1.0 + (k % 2), 0.2), K.COR['nuvem'])
    K.contorno([v], 0.02)
    K.chaves(v, 'location', [(t0, (x0, -1.0 + (k % 2), 0.2)), (t0 + 1.6, (0.2 + (k % 3) * 0.5, 0.5, 10.5))], suave=False)
    K.chaves(v, 'scale', [(0, (0.001,) * 3), (t0, (0.001,) * 3), (t0 + 0.3, (1,) * 3), (t0 + 1.3, (0.8,) * 3), (t0 + 1.6, (0.001,) * 3)])

# ---------------- a nuvem: cresce com o vapor e escurece antes da chuva
nuvem, m_nuvem = K.nuvem('nuvem', (-0.6, 1.0, 11.0), 1.4)
K.chaves(nuvem, 'scale', [(0, (0.001,) * 3), (2.8, (0.001,) * 3), (4.8, (1,) * 3)])
K.chaves(nuvem, 'location', [(4.8, (-0.6, 1.0, 11.0)), (6.0, (-2.6, 1.0, 11.0))])      # o vento leva pra cima da terra
K.cor_em(m_nuvem, [(4.6, K.COR['nuvem']), (5.6, K.COR['nuvem_chuva'])])
K.balancar(nuvem, 6.0, DUR, amp=0.15, periodo=2.0)

# ---------------- a chuva: cada gota nasce na nuvem, cai e some ao tocar o chão
for k in range(40):
    x = -4.6 + (k * 7 % 13) * 0.36
    y = 0.2 + (k % 3) * 0.5
    t0 = 5.7 + (k * 11 % 40) * 0.05
    g = K.bloco(f'gota{k}', (0.16, 0.16, 0.42), (x, y, 9.8), K.COR['gota'])
    K.chaves(g, 'location', [(t0, (x, y, 9.8)), (t0 + 0.75, (x, y, 0.15))], suave=False)
    K.chaves(g, 'scale', [(0, (0.001,) * 3), (t0, (0.001,) * 3), (t0 + 0.08, (1,) * 3), (t0 + 0.7, (1,) * 3), (t0 + 0.75, (0.001,) * 3)])

# ---------------- a planta: o caule sobe do chão, as folhas abrem, a flor desabrocha
planta = K.grupo('planta', (-2.6, -1.5, 0))
caule = K.cilindro('caule', 0.12, 2.6, (0, 0, 0), K.COR['folha'], planta, lados=6, ancora='base')
folhas = [K.bloco(f'folha{s}', (1.0, 0.3, 0.12), (s * 0.5, 0, 1.2 + (0.5 if s > 0 else 0)), K.COR['folha2'], planta)
          for s in (-1, 1)]
flor = K.grupo('flor', (0, 0, 2.7), planta)
for k in range(5):
    a = k * 2 * math.pi / 5
    K.bloco(f'petala{k}', (0.42, 0.18, 0.42), (0.38 * math.sin(a), 0, 0.38 * math.cos(a)), K.COR['flor'], flor)
K.bola('miolo', 0.26, (0, -0.06, 0), K.COR['miolo'], flor)
K.contorno(K.pecas(planta), 0.025)
K.chaves(caule, 'scale', [(0, (1, 1, 0.001)), (6.8, (1, 1, 0.001)), (8.3, (1, 1, 1))])
for f in folhas:
    K.aparecer(f, 7.6, 0.5)
K.aparecer(flor, 8.3, 0.6)
K.chaves(planta, 'rotation_euler', [(8.9, (0, 0, 0)), (9.4, (0, math.radians(4), 0)), (10.0, (0, math.radians(-2), 0))])

# ---------------- o letreiro de cada etapa, no alto (fora da faixa da legenda)
for k, (palavra, t0, t1) in enumerate((('EVAPORA', 1.2, 3.9), ('CONDENSA', 4.0, 5.6), ('CHOVE', 5.7, 7.6), ('CRESCE', 7.7, 10.4))):
    tx = K.texto(f'txt{k}', palavra, (0, -4.0, 15.6), tamanho=1.5, cor=K.COR['texto'])
    K.chaves(tx, 'scale', [(0, (0.001,) * 3), (t0, (0.001,) * 3), (t0 + 0.3, (1,) * 3), (t1 - 0.3, (1,) * 3), (t1, (0.001,) * 3)])

# ---------------- câmera: aproxima bem devagar e acompanha a história (do mar pra terra)
cam, alvo = K.camera(sc, (0.6, -24, 8.5), alvo=(1.0, 0, 6.8))
K.chaves(cam, 'location', [(0, (0.6, -24, 8.5)), (DUR, (-0.8, -21.5, 8.2))])
K.chaves(alvo, 'location', [(0, (1.0, 0, 6.8)), (DUR, (-1.0, 0, 6.4))])

K.renderizar(sc, 'ciclo-da-agua-3d')
