"""prova-print: só efeitos sonoros, sutis, sem música (herança §8). Cada som nasce de um evento visual de
src/Cenas.tsx: corte entre modos (popup grave, mais baixo pro rosto), card que entra, grifo (risco curto de marca-texto),
contador (tiques que desaceleram e um toque quando para no número dito), a palavra do pedido.
Saída: public/sfx.wav (com --previas: public/sfx_previas.wav). uso (de dentro do molde ou da pasta do vídeo): ../../.venv/Scripts/python.exe scripts/som.py
Os eventos usam as mesmas palavras das cenas (w('palavra', n)): num vídeo novo, refazer junto com src/Cenas.tsx.
"""
import json, re, sys, unicodedata
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

AQUI = Path(__file__).resolve().parent.parent
# entrada padrão: src/palavras.json [{text,start,end}]; a duração é a do vídeo (src/tema.ts: fim da última palavra + 0,73 s)
_ps = json.loads((AQUI / 'src' / 'palavras.json').read_text(encoding='utf-8'))
if not _ps:
    sys.exit('src/palavras.json está vazio: este molde precisa da fala transcrita.')
P = {'duracao': round(_ps[-1]['end'] + 0.73, 2), 'palavras': [{'texto': p['text'], 'de': p['start'], 'ate': p['end']} for p in _ps]}
PREVIAS = '--previas' in sys.argv
SR = 48000
D = P['duracao']
N = int(D * SR)
rng = np.random.default_rng(7)


def limpa(s):
    """sem maiúscula, acento e pontuação (o Whisper varia nisso)"""
    s = unicodedata.normalize('NFD', s)
    return re.sub(r'[^a-z0-9%]', '', ''.join(c for c in s if not unicodedata.combining(c)).lower())


def w(txt, n=1):
    """início da n-ésima vez que a palavra é dita; se a fala não tem, para e diz a linha a refazer"""
    k = 0
    for p in P['palavras']:
        if limpa(p['texto']) == limpa(txt) and (k := k + 1) == n:
            return p['de']
    chamada = f"w('{txt}', {n})" if n > 1 else f"w('{txt}')"
    linhas = [str(i + 1) for i, l in enumerate(Path(__file__).read_text(encoding='utf-8').splitlines()) if chamada in l]
    sys.exit(f'O som não bate com a fala de src/palavras.json: {chamada} pede a {n}ª vez que se diz "{txt}", e a fala '
             f'{"só tem " + str(k) if k else "não tem nenhuma"}.\nscripts/som.py:{",".join(linhas) or "?"}: refaça os eventos '
             'junto com as cenas de src/Cenas.tsx (LEIA.md, "Vídeo novo").')


def add(buf, t, s, g=1.0):
    i = int(t * SR)
    j = min(N, i + len(s))
    if 0 <= i < N:
        buf[i:j] += g * s[:j - i]


def env(n, a, r):
    e = np.ones(n)
    ka, kr = int(a * SR), int(r * SR)
    e[:ka] = np.linspace(0, 1, ka)
    e[n - kr:] *= np.linspace(1, 0, kr)
    return e


def lp(x, f):
    return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)


def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)


def tt(d):
    return np.arange(int(d * SR)) / SR


# ---------------------------------------------------------------- os efeitos: curtos, quentes, sem agudo estridente
def clique(g=1.0):
    """clique de interface: estalo curto + corpo grave"""
    t = tt(0.04)
    return (bp(rng.standard_normal(len(t)), 1800, 5000) * np.exp(-t * 260) * 0.7 + np.sin(2 * np.pi * 180 * t) * np.exp(-t * 90) * 0.5) * g


def pop(f=620):
    """popup grave de elemento que surge (pedido do Jessé: no lugar de swoosh): corpo grave que sobe um pouco + estalo macio"""
    g = 150 + (f - 520) * 0.25  # o f antigo só varia o tom: 150 a 225 Hz
    t = tt(0.16)
    corpo = np.sin(2 * np.pi * np.cumsum(g * (1 + 0.9 * np.exp(-t * 40))) / SR) * np.exp(-t * 26)
    estalo = lp(rng.standard_normal(len(t)), 1800) * np.exp(-t * 180) * 0.25
    return lp(corpo + estalo, 2500)


def ar(d=0.32, lo=350, hi=2600):
    """sopro de ar nos cortes"""
    n = int(d * SR)
    return bp(rng.standard_normal(n), lo, hi) * np.sin(np.linspace(0, np.pi, n)) ** 3 * 0.55


def tecla():
    t = tt(0.03)
    return bp(rng.standard_normal(len(t)), 2200, 6000) * np.exp(-t * 320) * 0.55 + np.sin(2 * np.pi * 240 * t) * np.exp(-t * 140) * 0.25


def tic():
    t = tt(0.015)
    return bp(rng.standard_normal(len(t)), 2500, 7000) * np.exp(-t * 450) * 0.5


def toque():
    """confirmação (✓): duas notas de sino, baixas e curtas"""
    s = np.zeros(int(0.9 * SR))
    for k, (f, g) in enumerate(((1318.5, 0.32), (1975.5, 0.22))):
        t = tt(0.8)
        n = (np.sin(2 * np.pi * f * t) + 0.15 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 6) * g
        i = int(k * 0.07 * SR)
        s[i:i + len(n)] += n
    return lp(s, 6000)


def baque(f=75):
    t = tt(0.25)
    return np.sin(2 * np.pi * f * t * (1 - 0.6 * t)) * np.exp(-t * 18)

def risco(d=0.3):
    """marca-texto passando no papel: ruído filtrado curto, macio"""
    n = int(d * SR)
    return bp(rng.standard_normal(n), 1200, 3800) * env(n, 0.04, 0.14) * 0.3


fx = np.zeros(N)
c = lambda t: t - 0.06  # os cortes de src/tema.ts

# ---------------------------------------------------------------- o plano do som (refazer num vídeo novo, junto com Cenas.tsx)
# cortes entre modos: a tela nova surge com o popup grave (mais baixo quando corta pro rosto)
CORTES = [('criado', c(w('ele')), 'vitrine'), ('modelos', c(w('diferença')), 'palco'), ('editar', c(w('qualquer')), 'vitrine'),
          ('vendo', c(w('inclusive')), 'vitrine'), ('previas', c(w('eu', 2)), 'palco'), ('tres', c(w('aceleradas')), 'vitrine'),
          ('mas', c(w('mas')), 'rosto'), ('outros', c(w('outros')), 'palco'), ('aprender', c(w('e', 2)), 'vitrine'),
          ('comenta', c(w('comenta')), 'rosto')]
GRIFOS = [w('editado'), w('claude'), w('criado'), w('modelos'), w('vídeo', 2), w('claude', 2), w('modelos', 2), w('modelos', 3), w('como', 2)]
CONTADORES = [(w('três') - 0.64, 3)]  # (início, valor): os mesmos de CONTADORES em src/tema.ts (o gancho não tem: o 100% está no título, PV4)
EXTRAS = [(0.25, pop(600), 0.38), (0.33, risco(0.25), 0.25), (w('edição', 2), pop(760), 0.46)]
if PREVIAS:  # as duas prévias entram (prop previas); sem elas o card segura o print
    EXTRAS += [(c(w('eu', 2)) + 0.1, pop(660), 0.34), (c(w('eu', 2)) + 0.25, pop(700), 0.34)]
# ---------------------------------------------------------------- fim do plano

for _, t0, modo in CORTES:
    add(fx, t0, pop(540 if modo == 'rosto' else 600), 0.28 if modo == 'rosto' else 0.4)
for t0 in GRIFOS:
    add(fx, t0, risco(), 0.32)
for t0, v in CONTADORES:
    passos = min(12, int(v))
    for k in range(passos):
        add(fx, t0 + 0.75 * (1 - (1 - (k + 1) / passos) ** 2), tic(), 0.32 - k * 0.012)
    add(fx, t0 + 0.75, toque(), 0.24)
for t0, s, g in EXTRAS:
    add(fx, t0, s, g)

# um pouco de sala pra não soar seco demais
ir = rng.standard_normal(int(0.35 * SR)) * np.exp(-tt(0.35) * 14)
ir = lp(ir, 5000)
fx = fx + 0.12 * fftconvolve(fx, ir)[:N] / np.max(np.abs(ir))

x = fx / (np.max(np.abs(fx)) + 1e-9) * 10 ** (-6 / 20)
saida = Path(sys.argv[sys.argv.index('--saida') + 1]) if '--saida' in sys.argv else AQUI / 'public' / ('sfx_previas.wav' if PREVIAS else 'sfx.wav')
wavfile.write(saida, SR, (np.stack([x, x], 1) * 32767).astype(np.int16))
print(saida, round(D, 2), 's')
