"""Gera src/larguras.json: a largura de cada caractere (em milésimos do corpo) na fonte do modelo, medida no arquivo de
scripts/fontes/ (Inter Tight, OFL, a mesma que o render carrega do Google Fonts), nos pesos que o modelo usa.
O src/modelo.ts usa a tabela para quebrar as linhas e escolher o tamanho do pico; o checador, para a zona segura.
Só precisa rodar de novo se trocar de fonte.
uso (na pasta do molde ou do vídeo): ../../.venv/Scripts/python.exe scripts/larguras.py
"""
import json
from pathlib import Path

from PIL import ImageFont

AQUI = Path(__file__).resolve().parent.parent
F = AQUI / 'scripts' / 'fontes' / 'InterTight.ttf'
CH = ''.join(chr(c) for c in range(32, 127)) + ''.join(chr(c) for c in range(0xC0, 0x100)) + '“”‘’…%ºª€$×'
out = {}
for peso in (700, 900):
    f = ImageFont.truetype(str(F), 1000)
    f.set_variation_by_axes([peso])
    out[f'w{peso}'] = {c: round(f.getlength(c)) for c in CH}
(AQUI / 'src' / 'larguras.json').write_text(json.dumps(out, ensure_ascii=False), encoding='utf-8')
print('src/larguras.json', {k: len(v) for k, v in out.items()})
