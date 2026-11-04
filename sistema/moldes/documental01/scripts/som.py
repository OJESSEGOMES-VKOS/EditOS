"""Cama e efeitos do documental01 (documental01.md §6), sintetizados aqui, nada de terceiros.

- trilha.wav: cama grave e lenta (ré menor, acordes de 8 s, pad abafado + pulso de sino bem baixo), ~16 dB abaixo da
  voz medida (as três referências: cama 13 a 16 dB abaixo da fala). No apagão a cama desce e só o grave fica; na
  resposta do clímax volta. Depois da última palavra ela sobe até perto do nível da fala e fecha (ref1: -21 dB nos
  3,5 s finais contra -17 dB da fala).
- efeitos.wav: um "toque" grave e curto quando cada contador para na palavra, um sopro descendo no apagão. Só isso:
  as referências não têm efeito chamativo.
Tudo vem do plano (src/plano.json) e da fala (src/palavras.json), com a mesma conta de tempo do src/Reel.tsx.
uso: ../../.venv/Scripts/python.exe scripts/som.py [ganho trilha dB] [ganho efeitos dB]
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

AQUI = Path(__file__).resolve().parent.parent
PS = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
PL = json.loads((AQUI / 'src' / 'plano.json').read_text(encoding='utf-8'))
limpa = lambda s: re.sub(r'[^a-z0-9]', '', ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn'))
if [x for x in map(limpa, PL.get('fala', '').split()) if x] != [x for x in (limpa(p['text']) for p in PS) if x]:
    sys.exit('O plano (src/plano.json) não é desta fala: rode node scripts/checar.mjs, que diz o que refazer.')
GT = float(sys.argv[1]) if len(sys.argv) > 1 else 0.0
GE = float(sys.argv[2]) if len(sys.argv) > 2 else 0.0


def tempo(x):
    if x is None or isinstance(x, (int, float)):
        return x
    return PS[x[0]]['start'] if len(x) < 3 else PS[x[0]]['start'] + x[2]


SR = 48000
FIM = PS[-1]['end']
D = round((FIM + PL['cauda']) * 100) / 100
N = int(D * SR)
tt = np.arange(N) / SR
rng = np.random.default_rng(7)
lp = lambda x, f: sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
db = lambda g: 10 ** (g / 20)
rms = lambda x: float(np.sqrt(np.mean(x ** 2)) + 1e-12)

APAGAO = tempo(PL.get('apagao'))
PARAS = [tempo(n['para']) for t in PL['telas'] for n in t.get('numeros', [])]
# a resposta do clímax: a 1ª tela que entra depois do apagão e não é a da pergunta
VOLTA = None
if APAGAO is not None:
    depois = sorted(tempo(t['de']) for t in PL['telas'] if tempo(t['de']) > APAGAO + 0.3)
    VOLTA = depois[0] if depois else None

# ------------------------------------------------------------------ cama
ACORDES = [[38, 50, 53, 57], [34, 50, 53, 58], [41, 48, 53, 57], [36, 48, 52, 55]]  # Dm Bb F C (graves)
LEN = 8.0
pad = np.zeros(N)
for k in range(int(D / LEN) + 2):
    t0 = k * LEN
    n = int((LEN + 3) * SR)
    x = np.arange(n) / SR
    e = np.minimum(1, x / 2.5) * np.clip((LEN + 3 - x) / 3, 0, 1)
    s = np.zeros(n)
    for m in ACORDES[k % 4]:
        for det in (-0.12, 0.12):
            f = hz(m) + det
            s += np.sin(2 * np.pi * f * x + rng.uniform(0, 6.28)) * (1.0 if m < 45 else 0.45)
    i = int(t0 * SR)
    j = min(N, i + n)
    if i < N:
        pad[i:j] += (s * e)[: j - i]
pad = lp(pad, 900)
grave = lp(pad, 160)
sino = np.zeros(N)
for k in range(int(D / 2.0) + 1):  # um sino baixo a cada 2 s, nota do acorde
    t0 = k * 2.0 + 1.0
    if t0 >= D:
        break
    m = ACORDES[int(t0 // LEN) % 4][2] + 12
    n = int(2.4 * SR)
    x = np.arange(n) / SR
    s = (np.sin(2 * np.pi * hz(m) * x) + 0.3 * np.sin(2 * np.pi * hz(m) * 2.01 * x)) * np.exp(-x / 0.9) * np.minimum(1, x / 0.004)
    i = int(t0 * SR)
    j = min(N, i + n)
    sino[i:j] += s[: j - i] * 0.18

# envelope da cama: entra em 0,6 s; no apagão fica só o grave; volta na resposta; sobe depois da última palavra
def rampa(t, a, b):
    return np.clip((t - a) / max(1e-3, b - a), 0, 1)

aberto = np.ones(N)
if APAGAO is not None:
    aberto = 1 - rampa(tt, APAGAO, APAGAO + 0.6)
    if VOLTA is not None:
        aberto = np.maximum(aberto, rampa(tt, VOLTA, VOLTA + 0.4))
cama = (pad * (0.35 + 0.65 * aberto) + grave * 0.6 * (1 - aberto) + sino * aberto) * rampa(tt, 0, 0.6)
sobe = 1 + 3.2 * rampa(tt, FIM + 0.1, FIM + 1.2)  # +10 dB no fecho
fecha = 1 - rampa(tt, D - 0.9, D)
cama = cama * sobe * fecha

# ------------------------------------------------------------------ efeitos
ef = np.zeros(N)


def add(t, s, g=1.0):
    i = int(round(t * SR))
    j = min(N, i + len(s))
    if 0 <= i < N:
        ef[i:j] += g * s[: j - i]


for t in PARAS:  # toque grave quando o número chega
    n = int(0.5 * SR)
    x = np.arange(n) / SR
    f = 110 + 60 * np.exp(-x / 0.02)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x / 0.12) * np.minimum(1, x / 0.003)
    add(t, lp(s, 900), 0.55)
if APAGAO is not None:  # sopro descendo
    n = int(1.2 * SR)
    x = np.arange(n) / SR
    s = lp(rng.standard_normal(n), 900) * np.sin(np.pi * x / 1.2) ** 2
    add(APAGAO - 0.2, s, 0.18)

# ------------------------------------------------------------------ níveis relativos à voz
sr_v, voz = wavfile.read(AQUI / 'public' / 'voz.wav')
voz = voz.astype(np.float32)
if voz.ndim > 1:
    voz = voz.mean(1)
voz /= 32768
quadro = int(0.05 * sr_v)
blocos = voz[: len(voz) // quadro * quadro].reshape(-1, quadro)
ativos = np.sqrt((blocos ** 2).mean(1))
r_voz = float(np.sqrt(np.mean(ativos[ativos > np.percentile(ativos, 40)] ** 2)))
ref = cama[int(1 * SR): int(min(FIM, (APAGAO or FIM)) * SR)]
cama *= r_voz * db(-16 + GT) / rms(ref)
pico_voz = float(np.abs(voz).max())
if np.abs(ef).max() > 0:
    ef *= pico_voz * db(-14 + GE) / np.abs(ef).max()
for nome, sinal in (('trilha.wav', cama), ('efeitos.wav', ef)):
    st = np.stack([sinal, sinal], 1)
    wavfile.write(AQUI / 'public' / nome, SR, np.clip(st * 32767, -32768, 32767).astype(np.int16))
    print(AQUI / 'public' / nome)
