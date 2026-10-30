"""Mede o que dá pra medir num vídeo pronto e diz se passa na régua de entrega.

Régua: H.264 yuv420p (o yuvj420p que o Remotion grava também passa), áudio AAC 48 kHz, -14 LUFS (de -15 a -13) e pico real até -1 dBTP
(aceita até -0,9: a medida por sobreamostragem e o AAC variam uns centésimos), abre rápido (faststart);
tamanho, fps e duração conferidos com o que foi pedido. Vídeo sem som (página de carrossel muda) passa sem a parte
do áudio, avisando.
uso: python tools/medir_entrega.py <video.mp4> [--tamanho 1080x1350] [--fps 30] [--max-s 60]
Sai com código 1 se algo reprova.
"""
import argparse, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from midia import audio, lufs, pico_real, sonda  # noqa: E402


def faststart(v: Path) -> bool:
    with open(v, 'rb') as f:
        cab = f.read(1 << 20)
    m, d = cab.find(b'moov'), cab.find(b'mdat')
    return m != -1 and (d == -1 or m < d)


def main() -> int:
    a = argparse.ArgumentParser(description='Confere um vídeo pronto contra a régua de entrega.')
    a.add_argument('video')
    a.add_argument('--tamanho', help='ex.: 1080x1920, 1080x1350, 1920x1080')
    a.add_argument('--fps', type=float)
    a.add_argument('--max-s', type=float, help='duração máxima (página de carrossel: 60)')
    o = a.parse_args()

    v = Path(o.video)
    if not v.is_file():
        print(f'não achei o vídeo {v}')
        return 1
    d = sonda(v)
    vs = [s for s in d.get('streams', []) if s.get('codec_type') == 'video']
    au = [s for s in d.get('streams', []) if s.get('codec_type') == 'audio']
    if not vs:
        print('o arquivo não tem imagem')
        return 1
    s = vs[0]
    dur = float(d.get('format', {}).get('duration', 0))
    num, den = (s.get('r_frame_rate', '0/1').split('/') + ['1'])[:2]
    fps = float(num) / float(den or 1)
    tam = f"{s.get('width')}x{s.get('height')}"
    linhas = [
        ('imagem', f"{s.get('codec_name')} {s.get('pix_fmt')}", s.get('codec_name') == 'h264' and s.get('pix_fmt') in {'yuv420p', 'yuvj420p'}),
        ('tamanho', tam, o.tamanho is None or tam == o.tamanho),
        ('fps', f'{fps:.2f}', o.fps is None or abs(fps - o.fps) < 0.01),
        ('duração', f'{dur:.2f} s', o.max_s is None or dur <= o.max_s),
    ]
    if au:
        x = au[0]
        linhas.append(('áudio', f"{x.get('codec_name')} {x.get('sample_rate')} Hz",
                       x.get('codec_name') == 'aac' and x.get('sample_rate') == '48000'))
        sinal = audio(v)
        l, p = lufs(sinal), pico_real(sinal)
        linhas.append(('volume', f'{l:.1f} LUFS' if l is not None else 'silêncio', l is not None and -15 <= l <= -13))
        linhas.append(('pico real', f'{p:.2f} dBTP' if p is not None else 'silêncio', p is None or p <= -0.9))
    else:
        linhas.append(('áudio', 'sem som (ok só se a peça é muda de propósito)', True))
    linhas.append(('abre rápido (faststart)', 'sim' if faststart(v) else 'não', faststart(v)))

    ruim = 0
    for nome, valor, ok in linhas:
        print(f"{'ok     ' if ok else 'REPROVA'}  {nome}: {valor}")
        ruim += not ok
    print('passou na régua de entrega' if not ruim else f'{ruim} item(ns) reprovado(s)')
    return 1 if ruim else 0


if __name__ == '__main__':
    sys.exit(main())
