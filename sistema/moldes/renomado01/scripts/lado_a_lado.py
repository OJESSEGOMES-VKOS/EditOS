"""Folha lado a lado: em cima o nosso quadro (out/final.mp4), embaixo o quadro da referência do mesmo recurso.
A referência é medida, nunca material: a folha fica em conferencia/ (prova) e nada dela entra no vídeo.
uso (na pasta do vídeo): ../../.venv/Scripts/python.exe scripts/lado_a_lado.py <video.mp4> <ref.mp4> "nosso_s:ref_s:rótulo" ...
saída: conferencia/lado-a-lado.png
"""
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

AQUI = Path(__file__).resolve().parent.parent
FF = AQUI.parents[1] / 'tools' / '.cache' / 'ffmpeg' / 'ffmpeg.exe'
TMP = AQUI.parents[1] / '.tmp' / 'lado-a-lado'
TMP.mkdir(parents=True, exist_ok=True)
nosso, ref = sys.argv[1], sys.argv[2]
PARES = [a.split(':', 2) for a in sys.argv[3:]]
W, H, T = 300, 533, 64


def quadro(video, s, nome):
    out = TMP / nome
    subprocess.run([str(FF) if FF.exists() else 'ffmpeg', '-loglevel', 'error', '-y', '-ss', s, '-i', video, '-frames:v', '1', '-vf', f'scale={W}:{H}', str(out)], check=True)
    return Image.open(out).convert('RGB')


folha = Image.new('RGB', (len(PARES) * W, 2 * H + T), 'white')
d = ImageDraw.Draw(folha)
f = ImageFont.load_default(size=15)
for i, (a, b, rot) in enumerate(PARES):
    folha.paste(quadro(nosso, a, f'n{i}.png'), (i * W, 0))
    folha.paste(quadro(ref, b, f'r{i}.png'), (i * W, H + T))
    linhas, at = [], ''
    for p in f'{rot} (nosso {a} s / ref {b} s)'.split():
        if d.textlength(at + ' ' + p, font=f) > W - 12:
            linhas.append(at); at = p
        else:
            at = (at + ' ' + p).strip()
    linhas.append(at)
    for k, l in enumerate(linhas[:3]):
        d.text((i * W + 6, H + 4 + k * 19), l, font=f, fill='black')
d.text((4, 4), 'NOSSO', font=f, fill='yellow', stroke_width=2, stroke_fill='black')
d.text((4, H + T + 4), 'REFERÊNCIA (medida, não material)', font=f, fill='yellow', stroke_width=2, stroke_fill='black')
(AQUI / 'conferencia').mkdir(exist_ok=True)
folha.save(AQUI / 'conferencia' / 'lado-a-lado.png')
for x in TMP.iterdir():
    x.unlink()
TMP.rmdir()
print(AQUI / 'conferencia' / 'lado-a-lado.png')
