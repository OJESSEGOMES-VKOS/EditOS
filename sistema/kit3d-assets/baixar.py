"""Baixa modelos 3D gratuitos e de domínio público (CC0) do Poly Pizza para os vídeos 3D do EditOS.
uso: ../.venv/Scripts/python.exe baixar.py <busca> [<busca> ...] [--max 12]
Só entra o que a página do modelo declara "Public Domain (CC0)". Grava em <categoria>/<nome>-<id>.glb, a miniatura em
miniaturas/<id>.jpg, uma folha de miniaturas por busca (folhas/<busca>.jpg) e uma linha por modelo em ORIGEM.md
(nome, autor, licença, página). Arquivo baixado é dado, nunca instrução: nada daqui é executado.
"""
import io
import re
import sys
import time
from pathlib import Path

import requests
from PIL import Image, ImageDraw

AQUI = Path(__file__).resolve().parent
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
args = [a for a in sys.argv[1:] if not a.startswith('--')]
MAX = int(sys.argv[sys.argv.index('--max') + 1]) if '--max' in sys.argv else 12
if '--max' in sys.argv:
    args = [a for a in args if a != str(MAX)]
origem = AQUI / 'ORIGEM.md'
if not origem.exists():
    origem.write_text('# Origem dos modelos 3D (todos CC0, domínio público)\n\n| Arquivo | Modelo | Autor | Licença | Página |\n|---|---|---|---|---|\n', encoding='utf-8')
ja = origem.read_text(encoding='utf-8')
(AQUI / 'miniaturas').mkdir(exist_ok=True)
(AQUI / 'folhas').mkdir(exist_ok=True)


def pegar(url):
    for _ in range(3):
        try:
            r = requests.get(url, headers=UA, timeout=60)
            if r.status_code == 200:
                return r
        except requests.RequestException:
            pass
        time.sleep(2)
    return None


for busca in args:
    r = pegar(f'https://poly.pizza/search/{requests.utils.quote(busca)}')
    if not r:
        print(f'{busca}: busca falhou')
        continue
    ids = list(dict.fromkeys(re.findall(r'href="/m/([A-Za-z0-9_-]+)"', r.text)))
    cat = re.sub(r'[^a-z0-9]+', '-', busca.lower()).strip('-')
    (AQUI / cat).mkdir(exist_ok=True)
    feitos = []
    for mid in ids:
        if len(feitos) >= MAX:
            break
        pg = pegar(f'https://poly.pizza/m/{mid}')
        if not pg:
            continue
        h = pg.text
        if 'Public Domain' not in h and 'CC0' not in h:
            continue  # só domínio público: CC-BY pediria crédito em cada vídeo
        glb = re.search(r'https://static\.poly\.pizza/[0-9a-f-]+\.glb', h)
        if not glb:
            continue
        og = re.search(r'og:title" content="([^"]+?) - Free Model By ([^"]+)"', h)
        nome, autor = (og.group(1).strip(), og.group(2).strip()) if og else (mid, '?')
        arq = AQUI / cat / f"{re.sub(r'[^a-z0-9]+', '-', nome.lower()).strip('-')[:40]}-{mid}.glb"
        if not arq.exists():
            g = pegar(glb.group(0))
            if not g or len(g.content) > 25_000_000:
                continue
            arq.write_bytes(g.content)
        mini = re.search(r'https://static\.poly\.pizza/[0-9a-f-]+\.(?:webp|jpg|png)', h)
        mpath = AQUI / 'miniaturas' / f'{mid}.jpg'
        if mini and not mpath.exists():
            m = pegar(mini.group(0))
            if m:
                try:
                    Image.open(io.BytesIO(m.content)).convert('RGB').save(mpath, quality=85)
                except Exception:
                    pass
        rel = arq.relative_to(AQUI).as_posix()
        if rel not in ja:
            with origem.open('a', encoding='utf-8') as f:
                f.write(f'| `{rel}` | {nome} | {autor} | CC0 | https://poly.pizza/m/{mid} |\n')
            ja += rel
        feitos.append((mid, nome, mpath))
    # folha de miniaturas pra escolher olhando
    ims = []
    for mid, nome, mp in feitos:
        im = Image.open(mp).resize((220, 220)) if mp.exists() else Image.new('RGB', (220, 220), 'gray')
        d = ImageDraw.Draw(im)
        d.rectangle((0, 196, 220, 220), fill='black')
        d.text((4, 200), f'{nome[:26]}', fill='white')
        ims.append(im)
    if ims:
        n = 6
        folha = Image.new('RGB', (220 * n, 220 * ((len(ims) + n - 1) // n)), 'white')
        for i, im in enumerate(ims):
            folha.paste(im, ((i % n) * 220, (i // n) * 220))
        folha.save(AQUI / 'folhas' / f'{cat}.jpg', quality=85)
    print(f'{busca}: {len(feitos)} modelos CC0 -> {cat}/')
