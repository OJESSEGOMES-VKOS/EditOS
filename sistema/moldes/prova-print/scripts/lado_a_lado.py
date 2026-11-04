"""Folha lado a lado: em cima o nosso quadro, embaixo o quadro da referência do mesmo recurso (um par por recurso).
uso (de dentro da pasta do vídeo): ../../.venv/Scripts/python.exe scripts/lado_a_lado.py <saida.png> nosso.png:ref.png:rotulo ...
Os quadros da referência ficam em ../../modelos/prova-print/analise/q/ (medida, não material: a folha é só conferência).
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

out, pares = sys.argv[1], [a.split(':', 2) for a in sys.argv[2:]]
W, H, T = 300, 533, 64
folha = Image.new('RGB', (len(pares) * W, 2 * H + T), 'white')
d = ImageDraw.Draw(folha)
try:
    f = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 15)
except OSError:
    f = ImageFont.load_default(size=15)
for i, (a, b, rot) in enumerate(pares):
    folha.paste(Image.open(a).convert('RGB').resize((W, H)), (i * W, 0))
    folha.paste(Image.open(b).convert('RGB').resize((W, H)), (i * W, H + T))
    linhas, at = [], ''
    for p in rot.split():
        if d.textlength(at + ' ' + p, font=f) > W - 12:
            linhas.append(at); at = p
        else:
            at = (at + ' ' + p).strip()
    linhas.append(at)
    for k, l in enumerate(linhas[:3]):
        d.text((i * W + 6, H + 4 + k * 19), l, font=f, fill='black')
d.text((4, 4), 'NOSSO', font=f, fill='yellow', stroke_width=2, stroke_fill='black')
d.text((4, H + T + 4), 'REFERÊNCIA', font=f, fill='yellow', stroke_width=2, stroke_fill='black')
Path(out).parent.mkdir(parents=True, exist_ok=True)
folha.save(out)
print(out)
