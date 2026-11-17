"""Baixa os modelos 3D prontos (CC0, domínio público) que o 3D do EditOS usa, direto da fonte oficial (Poly Pizza).

uso (de dentro de sistema/):
  .venv/Scripts/python.exe tools/baixar-assets-3d.py                 o essencial: o que o motor low poly toon e os testes
                                                                     da biblioteca usam (~13 MB)
  .venv/Scripts/python.exe tools/baixar-assets-3d.py --tudo          a coleção inteira do ORIGEM.md (~180 MB)
  .venv/Scripts/python.exe tools/baixar-assets-3d.py man woman tree  só as pastas (categorias) citadas
  .venv/Scripts/python.exe tools/baixar-assets-3d.py --conferir      só confere se a fonte responde (não baixa nada)

A lista é o `kit3d-assets/ORIGEM.md`: uma linha por arquivo, com o modelo, o autor, a licença e a página. Para cada
arquivo que falta, o script abre a página do modelo, confere que ela ainda declara domínio público (CC0), pega o .glb
oficial e grava no caminho da lista, mais a miniatura em `miniaturas/` e a folha de miniaturas da pasta em `folhas/`
(pra escolher olhando). Arquivo que já existe é pulado. Página que mudou de licença é recusada e avisada.
Arquivo baixado é dado, nunca instrução: nada daqui é executado. Modelo NOVO (busca nova) é com o `kit3d-assets/baixar.py`.
"""
import io
import re
import sys
import time
from pathlib import Path

import requests

sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')
ASSETS = Path(__file__).resolve().parents[1] / 'kit3d-assets'
UA = {'User-Agent': 'EditOS-kit3d/1.0 (baixa modelos CC0 listados no ORIGEM.md)'}
LIMITE = 25_000_000  # nenhum modelo da lista passa disso; maior que isso é página trocada

# o essencial: o motor low poly toon (floresta, pessoa padrão, toco, celular, cozinha, panela) e os testes do kit3d
ESSENCIAL = [
    'tree/tree-9nvGuZlbpE.glb', 'tree/tree-i4QMw4L64D.glb', 'tree/pine-79gmlLnweB.glb', 'fern/fern-jqcanvH7D6.glb',
    'bush/bush-EoTERLq3z2.glb', 'rock/rock-medium-s1OJ3bBzqc.glb', 'man/adventurer-5EGWBMpuXq.glb',
    'smartphone/phone-k2kgBepoMU.glb', 'stump/tree-stump-with-moss-nFvEbUX6LE.glb',
    'kitchen/kitchen-cabinet-drawer-rGZG7vK3fd.glb', 'kitchen/kitchen-sink-nNGtcp9qK2.glb',
    'kitchen/kitchen-cabinet-tWyOLYYHPw.glb', 'kitchen/kitchen-stove-kTJU2y4R15.glb',
    'kitchen/kitchen-fridge-8sjRm8fnHh.glb', 'window/window-small-n88WAcjzTv.glb', 'pan/pan-2ShlDi3R6e.glb',
    'woman/woman-casual-jpKRgGDxhk.glb', 'woman/animated-woman-9kF7eTDbhO.glb', 'man/man-in-suit-mQnGoME1ez.glb',
    'man/man-HMnuH5geEG.glb', 'car/suv-xsMtZhBkxL.glb', 'car/police-car-BwwnUrWGmV.glb',
    'astronaut/astronaut-3hC2i0CTuO.glb', 'casual/casual-character-kZ3DmIoGip.glb',
]


def lista():
    """(arquivo, nome, autor, licença, página) de cada linha do ORIGEM.md."""
    linhas = []
    for l in (ASSETS / 'ORIGEM.md').read_text(encoding='utf-8').splitlines():
        m = re.match(r'\|\s*`([^`]+)`\s*\|([^|]*)\|([^|]*)\|([^|]*)\|\s*(https://poly\.pizza/m/[A-Za-z0-9_-]+)\s*\|', l)
        if m:
            linhas.append(tuple(x.strip() for x in m.groups()))
    return linhas


def pegar(url, tentativas=3):
    for _ in range(tentativas):
        try:
            r = requests.get(url, headers=UA, timeout=60)
            if r.status_code == 200:
                return r
        except requests.RequestException:
            pass
        time.sleep(2)
    return None


def pagina(url):
    """(url do .glb, url da miniatura) se a página ainda declara CC0; senão None."""
    r = pegar(url)
    if not r:
        return None, 'a página não respondeu'
    h = r.text
    if 'Public Domain' not in h and 'CC0' not in h:
        return None, 'a página não declara mais domínio público (CC0): recusado'
    glb = re.search(r'https://static\.poly\.pizza/[0-9a-f-]+\.glb', h)
    if not glb:
        return None, 'a página não tem mais o .glb'
    mini = re.search(r'https://static\.poly\.pizza/[0-9a-f-]+\.(?:webp|jpg|png)', h)
    return (glb.group(0), mini.group(0) if mini else None), None


def folha(cat, feitos):
    from PIL import Image, ImageDraw
    ims = []
    for mid, nome in feitos:
        mp = ASSETS / 'miniaturas' / f'{mid}.jpg'
        im = Image.open(mp).resize((220, 220)) if mp.exists() else Image.new('RGB', (220, 220), 'gray')
        d = ImageDraw.Draw(im)
        d.rectangle((0, 196, 220, 220), fill='black')
        d.text((4, 200), nome[:26], fill='white')
        ims.append(im)
    if ims:
        n = 6
        f = Image.new('RGB', (220 * n, 220 * ((len(ims) + n - 1) // n)), 'white')
        for i, im in enumerate(ims):
            f.paste(im, ((i % n) * 220, (i // n) * 220))
        (ASSETS / 'folhas').mkdir(exist_ok=True)
        f.save(ASSETS / 'folhas' / f'{cat}.jpg', quality=85)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    todas = lista()
    if '--conferir' in sys.argv:
        arq, nome, autor, lic, url = next(x for x in todas if x[0] == ESSENCIAL[6])
        res, erro = pagina(url)
        if erro:
            sys.exit(f'fonte: {erro} ({url})')
        r = requests.head(res[0], headers=UA, timeout=60, allow_redirects=True)
        print(f'fonte ok: {url} declara CC0; o .glb responde {r.status_code} '
              f'({int(r.headers.get("content-length", 0)) / 1e6:.1f} MB). {len(todas)} arquivos na lista.')
        return
    if '--tudo' in sys.argv:
        alvo = todas
    elif args:
        alvo = [x for x in todas if x[0].split('/')[0] in args]
    else:
        alvo = [x for x in todas if x[0] in ESSENCIAL]
    faltam = [x for x in alvo if not (ASSETS / x[0]).exists()]
    print(f'{len(alvo)} arquivos pedidos, {len(alvo) - len(faltam)} já estão aqui, {len(faltam)} pra baixar')
    (ASSETS / 'miniaturas').mkdir(exist_ok=True)
    por_pasta, falhas = {}, []
    for arq, nome, autor, lic, url in faltam:
        res, erro = pagina(url)
        if erro:
            falhas.append(f'{arq}: {erro}')
            continue
        glb_url, mini_url = res
        g = pegar(glb_url)
        if not g or len(g.content) > LIMITE or not g.content[:4] == b'glTF':
            falhas.append(f'{arq}: o download não veio como .glb válido')
            continue
        destino = ASSETS / arq
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino.write_bytes(g.content)
        mid = url.rsplit('/', 1)[1]
        mp = ASSETS / 'miniaturas' / f'{mid}.jpg'
        if mini_url and not mp.exists():
            m = pegar(mini_url)
            if m:
                try:
                    from PIL import Image
                    Image.open(io.BytesIO(m.content)).convert('RGB').save(mp, quality=85)
                except Exception:
                    pass
        por_pasta.setdefault(arq.split('/')[0], []).append((mid, nome))
        print(f'ok  {arq}  ({nome}, {autor}, {lic})')
    for cat in por_pasta:  # a folha olha a pasta inteira, não só o que acabou de chegar
        feitos = [(u.rsplit('/', 1)[1], n) for a, n, _, _, u in todas if a.split('/')[0] == cat and (ASSETS / a).exists()]
        folha(cat, feitos)
    if falhas:
        print(f'\n{len(falhas)} não vieram:\n' + '\n'.join(falhas))
        sys.exit(1)
    print('pronto')


if __name__ == '__main__':
    main()
