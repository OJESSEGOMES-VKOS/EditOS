"""Efeitos sonoros do 3d-como-funciona, sintetizados aqui (nada baixado, nada de terceiros): public/sons/*.wav
uso: ../../.venv/Scripts/python.exe sons.py
Baixos e curtos de propósito: sublinham a peça que entra, o nome que acende e o problema; nunca brigam com a voz.
"""
import wave
from pathlib import Path

import numpy as np

SR = 48000
SAIDA = Path(__file__).resolve().parents[1] / 'public' / 'sons'
SAIDA.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)


def t_(seg):
    return np.arange(int(seg * SR)) / SR


def env(t, ataque, queda):
    return np.minimum(1, t / max(ataque, 1e-4)) * np.exp(-t / queda)


def passa_baixa(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = a * acc + (1 - a) * v
        y[i] = acc
    return y


def gravar(nome, x, pico=0.5):
    x = x / (np.max(np.abs(x)) + 1e-9) * pico
    st = np.stack([x, x], 1)
    with wave.open(str(SAIDA / f'{nome}.wav'), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


# pop: bolha de seno caindo de tom (peça que entra)
t = t_(0.16)
f = 300 + 650 * np.exp(-t * 30)
gravar('pop', np.sin(2 * np.pi * np.cumsum(f) / SR) * env(t, 0.001, 0.045), 0.42)

# brilho: sininho em duas notas com harmônicos (o nome técnico)
t = t_(1.1)
x = np.zeros_like(t)
for nota, atraso in ((1318.5, 0.0), (1975.5, 0.09)):
    tt = np.clip(t - atraso, 0, None)
    for h, g in ((1, 1.0), (2.76, 0.35), (5.4, 0.12)):
        x += g * np.sin(2 * np.pi * nota * h * tt) * env(tt, 0.002, 0.28 / h) * (t >= atraso)
gravar('brilho', x, 0.34)

# eco: ping suave e grave (algo acende no sonar)
t = t_(0.9)
gravar('eco', np.sin(2 * np.pi * 880 * t) * env(t, 0.004, 0.22) + 0.3 * np.sin(2 * np.pi * 1320 * t) * env(t, 0.004, 0.12), 0.3)

# sonar: o ping longo
t = t_(2.2)
x = np.sin(2 * np.pi * 1180 * t) * env(t, 0.003, 0.6)
x += 0.45 * np.concatenate([np.zeros(int(0.55 * SR)), x[:len(x) - int(0.55 * SR)]])  # o eco voltando
gravar('sonar', x, 0.4)

# forca: batida grave e macia (a seta de força chega)
t = t_(0.35)
f = 120 * np.exp(-t * 6) + 50
gravar('forca', np.sin(2 * np.pi * np.cumsum(f) / SR) * env(t, 0.002, 0.09), 0.5)

# esforco: rangido (motor forçando, peça a ponto de quebrar)
t = t_(1.2)
f = 90 + 25 * np.sin(2 * np.pi * 3.1 * t)
serra = 2 * ((np.cumsum(f) / SR) % 1.0) - 1
gravar('esforco', passa_baixa(serra, 900) * np.minimum(1, t / 0.15) * np.exp(-np.maximum(0, t - 0.8) / 0.15), 0.32)

# estalo: a corda arrebentando
t = t_(0.3)
ruido = rng.standard_normal(len(t))
gravar('estalo', (ruido - passa_baixa(ruido, 1800)) * env(t, 0.0005, 0.03) + 0.5 * np.sin(2 * np.pi * 180 * t) * env(t, 0.001, 0.05), 0.55)

# baque: impacto surdo (a cabine no fundo, o motor que morre)
t = t_(0.7)
f = 85 * np.exp(-t * 4) + 38
gravar('baque', np.sin(2 * np.pi * np.cumsum(f) / SR) * env(t, 0.002, 0.18) + 0.25 * passa_baixa(rng.standard_normal(len(t)), 400) * env(t, 0.001, 0.06), 0.62)

# trava: clique metálico duplo
t = t_(0.25)
x = np.zeros_like(t)
for atraso, g in ((0.0, 1.0), (0.055, 0.7)):
    tt = np.clip(t - atraso, 0, None)
    r = rng.standard_normal(len(t))
    x += g * (r - passa_baixa(r, 2500)) * env(tt, 0.0003, 0.012) * (t >= atraso)
    x += g * 0.6 * np.sin(2 * np.pi * 2400 * tt) * env(tt, 0.0005, 0.02) * (t >= atraso)
gravar('trava', x, 0.42)

# mola: boing
t = t_(0.8)
f = 160 + 60 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 3)
gravar('mola', np.sin(2 * np.pi * np.cumsum(f) / SR) * env(t, 0.003, 0.3), 0.45)

# splash: água
t = t_(1.0)
r = rng.standard_normal(len(t))
gravar('splash', passa_baixa(r, 3500) * env(t, 0.008, 0.22) + 0.4 * passa_baixa(r, 600) * env(t, 0.002, 0.1), 0.5)

# bolhas: série de blups
t = t_(1.6)
x = np.zeros_like(t)
for k in range(9):
    a0 = rng.uniform(0, 1.3)
    tt = np.clip(t - a0, 0, None)
    fr = rng.uniform(380, 900) * (1 + 1.8 * tt)
    x += np.sin(2 * np.pi * np.cumsum(fr * (t >= a0)) / SR) * env(tt, 0.002, 0.035) * (t >= a0) * rng.uniform(0.5, 1)
gravar('bolhas', x, 0.36)

# amassa: lata amassando (ruído rasgado + tom metálico caindo)
t = t_(0.9)
r = rng.standard_normal(len(t))
crepita = (rng.random(len(t)) < 0.004).astype(float)
gravar('amassa', passa_baixa(r, 2200) * env(t, 0.01, 0.25) * 0.5 + passa_baixa(crepita, 4000) * 6 * env(t, 0.01, 0.4)
       + 0.4 * np.sin(2 * np.pi * (420 - 200 * t) * t) * env(t, 0.005, 0.3), 0.55)

# parabens: arpejo alegre de sinos
t = t_(1.6)
x = np.zeros_like(t)
for i, nota in enumerate((1046.5, 1318.5, 1568.0, 2093.0)):
    a0 = i * 0.09
    tt = np.clip(t - a0, 0, None)
    x += (np.sin(2 * np.pi * nota * tt) + 0.3 * np.sin(2 * np.pi * nota * 2 * tt)) * env(tt, 0.002, 0.5) * (t >= a0)
gravar('parabens', x, 0.4)
print('sons em', SAIDA)

# chiado: gás escapando por um furo fino (a pressão despenca no capilar)
t = t_(0.7)
r = rng.standard_normal(len(t))
gravar('chiado', (r - passa_baixa(r, 2600)) * np.minimum(1, t / 0.04) * np.exp(-t / 0.28), 0.3)
