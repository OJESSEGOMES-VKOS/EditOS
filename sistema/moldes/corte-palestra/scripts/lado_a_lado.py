"""Folha lado a lado: referência em cima, o nosso embaixo, um par por recurso (skill criar-modelo, etapa 6).
uso (na pasta do vídeo): ../../.venv/Scripts/python.exe scripts/lado_a_lado.py out/final.mp4 "ref1@33.5|20.1|destaque na resposta" ...
cada par: "<refN>@<s da referência>|<s do nosso>|<rótulo>". As referências são as do modelo (só no estúdio local).
Saída: conferencia/lado-a-lado.png
"""
import subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

AQUI = Path(__file__).resolve().parent.parent
REFS = AQUI.parent.parent / 'modelos' / 'corte-palestra' / 'referencias'
(AQUI / 'conferencia').mkdir(exist_ok=True)
nosso, pares = sys.argv[1], sys.argv[2:]


def quadro(video, t):
    r = subprocess.run(['ffmpeg', '-loglevel', 'error', '-ss', str(t), '-i', str(video), '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True, check=True)
    from io import BytesIO
    return Image.open(BytesIO(r.stdout)).convert('RGB')


W, H, T = 300, 533, 60
folha = Image.new('RGB', (len(pares) * W, 2 * H + T), 'white')
d = ImageDraw.Draw(folha)
f = ImageFont.load_default(size=15)
for k, p in enumerate(pares):
    ref, tn, rot = p.split('|')
    nome, tr = ref.split('@')
    folha.paste(quadro(REFS / f'{nome}.mp4', tr).resize((W, H)), (k * W, 0))
    folha.paste(quadro(AQUI / nosso, tn).resize((W, H)), (k * W, H + T))
    linhas, at = [], ''
    for w in f'{rot} (ref {nome} {tr} s / nosso {tn} s)'.split():
        if d.textlength(at + ' ' + w, font=f) > W - 12:
            linhas.append(at)
            at = w
        else:
            at = (at + ' ' + w).strip()
    linhas.append(at)
    for j, l in enumerate(linhas[:3]):
        d.text((k * W + 6, H + 3 + j * 18), l, font=f, fill='black')
d.text((4, 4), 'REFERÊNCIA', font=f, fill='yellow', stroke_width=2, stroke_fill='black')
d.text((4, H + T + 4), 'NOSSO', font=f, fill='yellow', stroke_width=2, stroke_fill='black')
folha.save(AQUI / 'conferencia' / 'lado-a-lado.png')
print(AQUI / 'conferencia' / 'lado-a-lado.png')
