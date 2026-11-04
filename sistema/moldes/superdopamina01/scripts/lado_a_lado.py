"""Folha lado a lado do superdopamina01: em cima o quadro da referência, embaixo o nosso, um par por recurso do modelo.
Enquanto o modelo não tem vídeo aprovado (sem assinatura.json, o tools/parece.py não roda), é esta folha que prova que o
vídeo parece o modelo. ref1 é 16:9 e ref2 é 4:3 (aparecem inteiras, com faixa preta).
Referência é medida, não material: esta folha é de conferência interna, nunca entra em entrega nem no EditOS aberto.
uso (na pasta do vídeo ou do molde): ../../.venv/Scripts/python.exe scripts/lado_a_lado.py [out/final.mp4]
sai em conferencia/lado-a-lado.jpg. Num vídeo novo, troque o tempo "nosso" de cada par pelo momento do mesmo recurso.
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

AQUI = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(AQUI.parents[1] / 'tools'))
import midia  # noqa: E402

REFS = AQUI.parents[1] / 'modelos' / 'superdopamina01' / 'referencias'
VIDEO = AQUI / (sys.argv[1] if len(sys.argv) > 1 else 'out/final.mp4')
PARES = [  # (referência, tempo dela, tempo nosso, o que se compara)
    ('ref1', 16.20, 3.70, 'imagem por palavra + legenda-âncora'),
    ('ref1', 21.50, 8.70, 'rajada 0,2 s, o texto fica'),
    ('ref1', 29.60, 1.55, 'número que pula de ordem'),
    ('ref1', 13.20, 13.30, 'momento-herói tipográfico'),
    ('ref1', 26.90, 20.60, 'tarja que revela, tela preta'),
    ('ref1', 28.20, 22.60, 'mosaico que se monta'),
    ('ref1', 42.00, 18.30, 'mesma imagem, estilos trocando'),
    ('ref2', 2.20, 5.60, 'pico: palavra enorme'),
    ('ref2', 47.50, 28.50, 'fecho: a palavra do pedido'),
]
CW, CH, T = 300, 533, 44


def quadro(v: Path, t: float) -> Image.Image:
    im = midia.quadro(v, t, 600) or Image.new('RGB', (CW, CH))
    im.thumbnail((CW, CH))
    cel = Image.new('RGB', (CW, CH), (18, 18, 18))
    cel.paste(im, ((CW - im.width) // 2, (CH - im.height) // 2))
    return cel


folha = Image.new('RGB', (len(PARES) * (CW + 8), 2 * CH + T), (18, 18, 18))
d = ImageDraw.Draw(folha)
try:
    f = ImageFont.truetype('arial.ttf', 15)
except OSError:
    f = ImageFont.load_default(size=15)
for i, (ref, tr, tn, rot) in enumerate(PARES):
    x = i * (CW + 8)
    folha.paste(quadro(REFS / f'{ref}.mp4', tr), (x, 0))
    folha.paste(quadro(VIDEO, tn), (x, CH + T))
    d.text((x + 4, CH + 4), f'{ref} {tr:g} s | nosso {tn:g} s', font=f, fill=(255, 220, 90))
    d.text((x + 4, CH + 23), rot[:40], font=f, fill=(255, 255, 255))
d.text((4, 4), 'REFERÊNCIA (medida)', font=f, fill='yellow', stroke_width=2, stroke_fill='black')
d.text((4, CH + T + 4), 'SUPERDOPAMINA01', font=f, fill='yellow', stroke_width=2, stroke_fill='black')
(AQUI / 'conferencia').mkdir(exist_ok=True)
saida = AQUI / 'conferencia' / 'lado-a-lado.jpg'
folha.save(saida, quality=88)
print(saida, folha.size)
