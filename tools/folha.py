"""Folha de quadros de um trecho, com o tempo embaixo de cada quadro: a prévia rápida depois de cada mudança.

Uma imagem mostra o movimento inteiro do trecho (o que acontece entre dois quadros soltos aparece aqui).
uso: python tools/folha.py <video.mp4> [--ini 0] [--fim 5] [--fps 4] [--colunas 6] [--saida pasta/folha.jpg]
Sem --fim vai até o fim do vídeo. A folha sai em .tmp/folhas/ se não disser onde.
"""
import argparse, sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parent))
from midia import RAIZ, quadro, sonda  # noqa: E402


def main() -> int:
    a = argparse.ArgumentParser(description='Folha de quadros de um trecho, com o tempo de cada quadro.')
    a.add_argument('video')
    a.add_argument('--ini', type=float, default=0.0)
    a.add_argument('--fim', type=float)
    a.add_argument('--fps', type=float, default=4.0)
    a.add_argument('--colunas', type=int, default=6)
    a.add_argument('--largura', type=int, default=240, help='largura de cada quadro na folha, em px')
    a.add_argument('--saida')
    o = a.parse_args()

    v = Path(o.video)
    if not v.is_file():
        print(f'não achei o vídeo {v}')
        return 1
    dur = float(sonda(v).get('format', {}).get('duration', 0))
    fim = min(o.fim, dur) if o.fim is not None else dur
    if fim <= o.ini:
        print(f'o trecho está vazio ({o.ini} a {fim} s)')
        return 1
    n = max(1, int((fim - o.ini) * o.fps))
    tempos = [o.ini + i / o.fps for i in range(n)]
    imgs = [(t, quadro(v, t, o.largura)) for t in tempos]
    imgs = [(t, im) for t, im in imgs if im is not None]
    if not imgs:
        print('não consegui tirar quadros do vídeo')
        return 1
    w, h = imgs[0][1].size
    pad, rodape = 4, 22
    lin = -(-len(imgs) // o.colunas)
    folha = Image.new('RGB', (o.colunas * (w + pad) + pad, lin * (h + rodape + pad) + pad), (32, 32, 32))
    d = ImageDraw.Draw(folha)
    try:
        fonte = ImageFont.truetype('arial.ttf', 15)
    except OSError:
        fonte = ImageFont.load_default()
    for i, (t, im) in enumerate(imgs):
        x = pad + (i % o.colunas) * (w + pad)
        y = pad + (i // o.colunas) * (h + rodape + pad)
        folha.paste(im, (x, y))
        d.text((x + 4, y + h + 3), f'{t:.2f} s', fill=(235, 235, 235), font=fonte)
    saida = Path(o.saida) if o.saida else RAIZ / '.tmp' / 'folhas' / f'{v.stem}-{o.ini:g}-{fim:g}.jpg'
    saida.parent.mkdir(parents=True, exist_ok=True)
    folha.save(saida, quality=88)
    print(f'{len(imgs)} quadros de {o.ini:g} a {fim:g} s -> {saida}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
