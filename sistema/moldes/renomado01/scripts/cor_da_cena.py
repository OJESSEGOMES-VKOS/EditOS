"""Mede a cor da cena e da roupa na gravação e sugere a linha `C` do plano (renomado01.md, seção 1: a cor vem da cena).
- claro: o tom das luzes claras da cena (os 8% de pixels mais claros), puxado para quase branco -> cor do clarão e da letra;
- quente: o tom mais saturado entre as partes claras (abajur, parede quente, janela) -> o miolo do clarão;
- ouro: o mesmo tom de "quente", mais saturado -> a legenda da citação (fala citada);
- traço: vermelho de sinal, fixo (é o único "sinal" do modelo, como na ref1).
Nada disso mexe na gravação (G33): é só a cor dos elementos do modelo.
uso (na pasta do vídeo): ../../.venv/Scripts/python.exe scripts/cor_da_cena.py
"""
import colorsys
import subprocess
from pathlib import Path

import numpy as np

AQUI = Path(__file__).resolve().parent.parent
FF = AQUI.parents[1] / 'tools' / '.cache' / 'ffmpeg' / 'ffmpeg.exe'
W, H = 135, 240
raw = subprocess.run([str(FF) if FF.exists() else 'ffmpeg', '-loglevel', 'error', '-i', str(AQUI / 'public' / 'fala.mp4'), '-vf', f'fps=0.5,scale={W}:{H}',
                      '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
q = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3).astype(float) / 255
# a cena é o que fica em volta da pessoa: as faixas dos lados e o alto do quadro (a pele e o rosto não entram)
px = np.concatenate([q[:, :, : W // 5].reshape(-1, 3), q[:, :, -W // 5:].reshape(-1, 3), q[:, : H // 8].reshape(-1, 3)])
hls = np.array([colorsys.rgb_to_hls(*p) for p in px[:: max(1, len(px) // 40000)]])
amostra = px[:: max(1, len(px) // 40000)]
L = hls[:, 1]


def tom(sel):
    # o tom da cor mediana do grupo (a mediana em RGB é estável; o tom de pixel quase cinza, sozinho, não é)
    h, l, s = colorsys.rgb_to_hls(*np.median(amostra[sel], 0))
    return h, s


def hexa(h, l, s):
    return '#%02X%02X%02X' % tuple(round(c * 255) for c in colorsys.hls_to_rgb(h, l, s))


hc, sc = tom(L >= np.percentile(L, 92))  # as luzes claras da cena
hq, _ = tom(L >= np.percentile(L, 60))  # o tom da cena iluminada
if sc < 0.08:  # luz clara quase branca: o tom dela não é confiável, vale o tom da cena
    hc = hq
C = {'letra': hexa(hc, 0.93, min(0.45, sc + 0.2)),
     'ouro': hexa(hq, 0.64, 0.68),
     'traco': '#C9473B',
     'claro': hexa(hc, 0.92, 0.75),
     'quente': hexa(hq, 0.66, 0.72)}
print('tom das luzes claras: %.0f°, tom quente: %.0f°' % (hc * 360, hq * 360))
print("export const C = {letra: '%(letra)s', ouro: '%(ouro)s', traco: '%(traco)s', claro: '%(claro)s', quente: '%(quente)s'};" % C)
if not (0.0 <= hq <= 0.17 or hq >= 0.95):
    print('aviso: a cena não tem tom quente; o clarão sai na cor da cena (ex.: azulado), como na ref do Dewly. Confira a leitura do ouro na citação.')
