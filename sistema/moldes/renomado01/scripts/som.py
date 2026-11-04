"""O som do renomado01: contido, só o que a imagem faz.
- clarão: um sopro quente que cresce até o pico do clarão e se desfaz (o "respiro" da película);
- entrada de modo (o corte com aproximação): um grave curto e baixo ("popup" grave da herança, não swoosh);
- o traço: um risco de caneta bem baixo;
- --cama (opção, desligada por padrão): uma cama contínua quente e calma por baixo da voz, que some no preto
  (a ref1 tem trilha contínua; na casa música é escolha do usuário).
Os tempos vêm do próprio plano (node scripts/checar.mjs --tempos): não há um segundo plano para refazer.
uso (na pasta do vídeo): ../../.venv/Scripts/python.exe scripts/som.py [--cama]   -> public/trilha.wav (duração do vídeo)
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

AQUI = Path(__file__).resolve().parent.parent
r = subprocess.run(['node', 'scripts/checar.mjs', '--tempos'], cwd=AQUI, capture_output=True, text=True, encoding='utf-8')
if r.returncode:
    sys.exit('o plano de src/Reel.tsx não carrega:\n' + r.stdout + r.stderr)
T = json.loads(r.stdout.strip().splitlines()[-1])
SR = 48000
D = T['duracao']
N = int(round(D * SR))
tt = np.arange(N) / SR
rng = np.random.default_rng(7)
lp = lambda x, f: sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
bp = lambda x, a, b: sosfilt(butter(2, [a, b], 'band', fs=SR, output='sos'), x)


def add(buf, t, s, g):
    i = int(t * SR)
    j = min(N, i + len(s))
    if 0 <= i < N:
        buf[i:j] += g * s[:j - i]


def sopro(d=0.95, pico=0.36):
    n = int(d * SR)
    x = np.arange(n) / SR
    env = np.where(x < pico, (x / pico) ** 2, np.exp(-(x - pico) * 5.5))
    return (bp(rng.standard_normal(n), 250, 2400) * 0.8 + bp(rng.standard_normal(n), 3000, 9000) * 0.2) * env


def grave(d=0.7, f=58):
    x = np.arange(int(d * SR)) / SR
    return np.sin(2 * np.pi * f * x * (1 - 0.18 * x)) * np.exp(-x * 7) + lp(rng.standard_normal(len(x)), 500) * np.exp(-x * 30) * 0.25


def risco(d=0.3):
    n = int(d * SR)
    return bp(rng.standard_normal(n), 1800, 6000) * np.sin(np.linspace(0, np.pi, n)) ** 1.5


fx = np.zeros(N)
for k in T['claroes']:
    add(fx, k, sopro(), 0.5)
for t in T['entradas']:
    add(fx, t, grave(), 0.45)
if T['traco'] is not None:
    add(fx, T['traco'], risco(), 0.12)

# cama: acorde quente (ré + lá + fá#) bem baixo, respiração lenta, some no preto
acorde = sum(np.sin(2 * np.pi * f * tt + k) * a for k, (f, a) in enumerate(((73.4, 0.5), (110, 0.3), (146.8, 0.22), (185, 0.12), (220, 0.08))))
cama = lp(acorde, 700) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.05 * tt))
fim = D - T['preto']
cama *= np.minimum(1, tt / 1.5) * np.clip((fim + 0.4 - tt) / 1.4, 0, 1)

ref = cama / (np.max(np.abs(cama)) + 1e-9) * 0.6 + fx
mix = ref if '--cama' in sys.argv else fx
mix = mix / (np.max(np.abs(ref)) + 1e-9) * 10 ** (-6 / 20)
saida = AQUI / 'public' / 'trilha.wav'
wavfile.write(saida, SR, (np.stack([mix, mix], 1) * 32767).astype(np.int16))
print(saida, round(D, 2), 's', 'com a cama' if '--cama' in sys.argv else 'só efeitos')
