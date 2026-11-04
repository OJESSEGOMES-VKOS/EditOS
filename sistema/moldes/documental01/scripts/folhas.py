"""Folhas de conferência do documental01, tiradas do mp4 final.
- conferencia/folha-1s.jpg: um quadro por segundo, com o segundo escrito.
- conferencia/lado-a-lado.jpg (só com pares): em cima o nosso quadro, embaixo o da referência com o mesmo recurso.
  pares.json: [[t_nosso, "ref1", t_ref, "o recurso"], ...]; a referência vem de ../../modelos/documental01/referencias/
  (ou do referencia/referencia.mp4 do modelo, depois da aprovação, com "aprovado" no lugar de "ref1").
uso (na pasta do vídeo): ../../.venv/Scripts/python.exe scripts/folhas.py out/final.mp4 [conferencia/pares.json]
"""
import json
import math
import sys
from pathlib import Path

import cv2
from PIL import Image, ImageDraw, ImageFont

AQUI = Path(__file__).resolve().parent.parent
MP4 = AQUI / (sys.argv[1] if len(sys.argv) > 1 else 'out/final.mp4')
PARES = json.loads(Path(sys.argv[2]).read_text(encoding='utf-8')) if len(sys.argv) > 2 else []
CONF = AQUI / 'conferencia'
CONF.mkdir(exist_ok=True)
MOD = AQUI.parent.parent / 'modelos' / 'documental01'


def quadro(video, t):
    cap = cv2.VideoCapture(str(video))
    cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
    ok, im = cap.read()
    cap.release()
    if not ok:
        raise SystemExit(f'não li {video} em {t} s')
    return Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB))


cap = cv2.VideoCapture(str(MP4))
dur = cap.get(cv2.CAP_PROP_FRAME_COUNT) / (cap.get(cv2.CAP_PROP_FPS) or 30)
cap.release()
f = ImageFont.load_default(size=18)
cw, ch, cols = 216, 384, 8
ts = [min(s, dur - 0.05) for s in range(0, int(math.ceil(dur)))]
grade = Image.new('RGB', (cols * cw, ((len(ts) + cols - 1) // cols) * ch), 'black')
g = ImageDraw.Draw(grade)
for k, t in enumerate(ts):
    grade.paste(quadro(MP4, t).resize((cw, ch)), ((k % cols) * cw, (k // cols) * ch))
    g.text(((k % cols) * cw + 6, (k // cols) * ch + 4), f'{t:.1f}', font=f, fill='yellow')
grade.save(CONF / 'folha-1s.jpg', quality=88)
print(CONF / 'folha-1s.jpg')

if PARES:
    W, H, T = 300, 533, 74
    f2 = ImageFont.load_default(size=14)
    folha = Image.new('RGB', (len(PARES) * W, 2 * H + T), 'white')
    d = ImageDraw.Draw(folha)
    for i, (tn, ref, tr, rot) in enumerate(PARES):
        fonte = MOD / 'referencia' / 'referencia.mp4' if ref == 'aprovado' else MOD / 'referencias' / f'{ref}.mp4'
        folha.paste(quadro(MP4, tn).resize((W, H)), (i * W, 0))
        if fonte.exists():
            folha.paste(quadro(fonte, tr).resize((W, H)), (i * W, H + T))
        linhas, at = [], ''
        for p in f'{tn:.1f} s / {ref} {tr:.1f} s: {rot}'.split():
            if d.textlength(at + ' ' + p, font=f2) > W - 12:
                linhas.append(at)
                at = p
            else:
                at = (at + ' ' + p).strip()
        linhas.append(at)
        for k, l in enumerate(linhas[:4]):
            d.text((i * W + 6, H + 3 + k * 17), l, font=f2, fill='black')
    d.text((4, 4), 'NOSSO', font=f2, fill='yellow', stroke_width=2, stroke_fill='black')
    d.text((4, H + T + 4), 'REFERÊNCIA', font=f2, fill='yellow', stroke_width=2, stroke_fill='black')
    folha.save(CONF / 'lado-a-lado.jpg', quality=88)
    print(CONF / 'lado-a-lado.jpg')
