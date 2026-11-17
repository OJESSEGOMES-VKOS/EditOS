"""Fecha um vídeo do 3d-como-funciona: monta (montar.py), renderiza a montagem no Remotion, acerta o volume pro padrão
das redes (-14 LUFS, pico -1,5 dBTP) e tira os quadros de conferência (1 por segundo).
uso: ../../.venv/Scripts/python.exe finalizar.py <pasta-do-video>
saída: <pasta>/out/<pasta>.mp4 e <pasta>/conferencia/c###.jpg
"""
import os
import subprocess
import sys
from pathlib import Path

pasta = Path(sys.argv[1]).resolve()
MOLDE = Path(__file__).resolve().parents[1]
RAIZ = MOLDE.parents[1]
FF = RAIZ / 'node_modules' / '@remotion' / 'compositor-win32-x64-msvc' / 'ffmpeg.exe'
CLI = RAIZ / 'node_modules' / '@remotion' / 'cli' / 'remotion-cli.js'
TMP = RAIZ / '.tmp'
env = {**os.environ, 'TEMP': str(TMP), 'TMP': str(TMP)}

subprocess.run([sys.executable, str(Path(__file__).with_name('montar.py')), str(pasta)], check=True)
out = pasta / 'out'
out.mkdir(exist_ok=True)
bruto = TMP / f'{pasta.name}-sem-volume.mp4'
subprocess.run(['node', str(CLI), 'render', 'src/index.ts', 'Explicativo', str(bruto), f'--props={pasta / "props.json"}',
                f'--public-dir={pasta / "public"}', '--codec=h264', '--crf=16', '--concurrency=2'], cwd=MOLDE, env=env, check=True)
final = out / f'{pasta.name}.mp4'
# TP -2,0 (e não -1,5): o AAC sobe o pico ~0,2 dB; com -1,5 o arquivo final media -1,3 dBTP (elevador, submarino)
subprocess.run([str(FF), '-hide_banner', '-loglevel', 'error', '-y', '-i', str(bruto), '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-2.0:LRA=11',
                '-ar', '48000', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', str(final)], check=True)
bruto.unlink(missing_ok=True)
conf = pasta / 'conferencia'
conf.mkdir(exist_ok=True)
for f in conf.glob('*.jpg'):
    f.unlink()
subprocess.run([str(FF), '-hide_banner', '-loglevel', 'error', '-y', '-i', str(final), '-r', '1', '-vf', 'scale=270:-2', '-q:v', '4',
                str(conf / 'c%03d.jpg')], check=True)
r = subprocess.run([str(FF), '-hide_banner', '-i', str(final), '-vn', '-af', 'loudnorm=print_format=summary', '-f', 'wav', '-y', str(TMP / 'medida.wav')],
                   capture_output=True, text=True)
medidas = [l.strip() for l in r.stderr.splitlines() if 'Input Integrated' in l or 'Input True Peak' in l]
(TMP / 'medida.wav').unlink(missing_ok=True)
print(f'pronto: {final}')
print(' | '.join(medidas))
