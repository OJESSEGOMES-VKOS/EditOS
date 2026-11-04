"""A cor do destaque, escolhida contra o fundo da gravação (corte-palestra.md, seção 4).

Mede o fundo de public/fala.mp4 (faixa de cima e as laterais, onde a pessoa não está) e a região da legenda, e sugere a
COR do destaque colorido: a matiz oposta à do fundo, na luz e na saturação do azul medido na ref1 (#4562AF contra LED
vermelho). Confere o contraste do branco e da cor sugerida com a região da legenda. A cor é opção do usuário (G33): isto
só sugere; quem decide escreve em COR no src/Corte.tsx.
uso (na pasta do vídeo): ../../.venv/Scripts/python.exe scripts/cor.py
"""
import colorsys, math, sys
from pathlib import Path

import cv2
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')
AQUI = Path(__file__).resolve().parent.parent
cap = cv2.VideoCapture(str(AQUI / 'public' / 'fala.mp4'))
n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
if n <= 0:
    sys.exit('não consegui ler public/fala.mp4 (rode scripts/recortar.py antes).')
fundo, leg = [], []
for k in range(8):
    cap.set(cv2.CAP_PROP_POS_FRAMES, int((k + 0.5) * n / 8))
    ok, q = cap.read()
    if not ok:
        continue
    q = cv2.resize(q, (1080, 1920))[:, :, ::-1].astype(np.float32) / 255  # RGB
    fundo += [q[0:420].reshape(-1, 3), q[480:1340, 0:160].reshape(-1, 3), q[480:1340, 920:].reshape(-1, 3)]
    leg.append(q[1150:1450, 60:940].reshape(-1, 3))
cap.release()
F, L = np.concatenate(fundo), np.concatenate(leg)


def lum(c):
    c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]


def contraste(a, b):
    a, b = max(a, b), min(a, b)
    return (a + 0.05) / (b + 0.05)


hls = np.array([colorsys.rgb_to_hls(*p) for p in F[:: max(1, len(F) // 20000)]])
peso = hls[:, 2]  # matiz média circular, pesada pela saturação
ang = hls[:, 0] * 2 * math.pi
mh = (math.degrees(math.atan2((np.sin(ang) * peso).sum(), (np.cos(ang) * peso).sum())) + 360) % 360
ms, ml = float(np.median(hls[:, 2])), float(np.median(hls[:, 1]))
hexd = lambda rgb: '#' + ''.join(f'{int(round(v * 255)):02X}' for v in rgb)
print(f'fundo: matiz {mh:.0f}°, saturação {ms:.2f}, luz {ml:.2f} (média {hexd(F.mean(0))})')
lL = float(np.median(lum(L)))
print(f'região da legenda (y 1150-1450): luminância mediana {lL:.2f}; contraste do branco {contraste(1.0, lL):.1f}:1')

oposta = (mh + 180) % 360
s, l = 0.43, 0.48  # a saturação e a luz do azul da ref1
if ms < 0.12:
    print('fundo quase sem cor: qualquer matiz contrasta; a sugestão é o azul da ref1 (matiz 222°).')
    oposta = 222
cor = colorsys.hls_to_rgb(oposta / 360, l, s)
# contraste mínimo de 4,5:1 com a região da legenda (a serifa itálica é de traço fino); se faltar, clareia ou escurece
while contraste(float(lum(np.array(cor))), lL) < 4.5 and 0.2 < l < 0.85:
    l += 0.04 if lL < 0.4 else -0.04
    cor = colorsys.hls_to_rgb(oposta / 360, l, s)
print(f'sugestão de COR: {hexd(cor)} (matiz {oposta:.0f}°, oposta ao fundo); contraste {contraste(float(lum(np.array(cor))), lL):.1f}:1')
if contraste(1.0, lL) < 3:
    print('ATENÇÃO: o branco lê mal aqui (fundo claro atrás da legenda). Avise o usuário: a gravação pede outra posição'
          ' (Y_CENTRO sobre a roupa escura) ou a cor do texto como opção dele (G33).')
if 180 <= mh <= 260 and ms >= 0.12:
    print('fundo frio (azul): a ref2 deixa o destaque branco nesse caso; as duas saídas valem, a escolha é do usuário.')
