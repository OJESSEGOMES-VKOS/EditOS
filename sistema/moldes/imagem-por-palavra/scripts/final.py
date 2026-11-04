"""O som e o mp4 final do imagem-por-palavra: um efeito por evento visual sobre uma cama contínua (E18), a voz na frente.

Lê src/eventos.json (gravado pelo scripts/conferir.mjs a partir do plano: cada corte, estilo, imagem da rajada,
ladrilho, pico, tecla, tarja, flash e ponte) e public/voz.wav. Gera:
  - a cama: grave contínuo e ar (ruído rosado filtrado + nota de fundo lenta), ~22 LU abaixo da voz, que abaixa 4 dB
    sob a voz e some 0,35 s antes de cada revelação da tarja (o "silêncio antes da revelação");
  - os efeitos: corte = toque grave curto ("popup" grave, heranca §8); estilo = blip; rajada = sopro curto;
    ladrilho = tique; pico = impacto grave com subida antes; contador = tique por salto + sino; tecla = cliques;
    tarja = estalo; flash = subida + impacto; ponte = sopro de entrada e de saída; fim = varredura e grave;
  - a mixagem: voz (passa-alta 80 Hz + compressão leve), efeitos ~13 LU abaixo dela, cama ~22 LU abaixo;
    tudo a -14 LUFS integrado e pico real <= -1 dBTP (medidos aqui, BS.1770, tools/midia.py).
Sem música (G21): trilha do usuário entra com --trilha <arquivo.wav> (16 LU abaixo da voz, com ducking).
uso (na pasta do vídeo): ../../.venv/Scripts/python.exe scripts/final.py out/so-video.mp4 out/final.mp4 [--trilha x.wav]
         --so-som  grava só public/efeitos.wav e public/cama.wav (para ouvir)
No fim chama ../../tools/entregar.py (na vitrine e no molde não faz nada).
"""
import argparse, json, subprocess, sys
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, resample_poly

AQUI = Path(__file__).resolve().parent.parent
RAIZ = AQUI.parents[1]
sys.path.insert(0, str(RAIZ / 'tools'))
import midia  # noqa: E402  (LUFS BS.1770, pico real, ffmpeg do estúdio)

SR = 48000
rng = np.random.default_rng(7)
ap = argparse.ArgumentParser()
ap.add_argument('video', nargs='?', default='out/so-video.mp4')
ap.add_argument('saida', nargs='?', default='out/final.mp4')
ap.add_argument('--trilha', default='')
ap.add_argument('--so-som', action='store_true')
a = ap.parse_args()

EV = json.loads((AQUI / 'src' / 'eventos.json').read_text(encoding='utf-8'))
D = float(EV['duracao'])
N = int(D * SR)
tt = np.arange(N) / SR
lp = lambda x, f: sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
hp = lambda x, f: sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)
bp = lambda x, f0, f1: sosfilt(butter(2, [f0, f1], 'band', fs=SR, output='sos'), x)


def env(n, ataque, queda):
    e = np.exp(-np.arange(n) / max(1, queda * SR))
    na = max(1, int(ataque * SR))
    e[:na] *= np.linspace(0, 1, na)
    return e


def add(buf, t, s, g=1.0):
    i = int(round(t * SR))
    if i < 0:
        s, i = s[-i:], 0
    j = min(len(buf), i + len(s))
    if i < len(buf):
        buf[i:j] += g * s[:j - i]


def toque(f0=95, dur=0.09):
    n = int(dur * SR); x = np.arange(n) / SR
    return np.sin(2 * np.pi * f0 * x * (1 - 0.35 * x / dur)) * env(n, 0.002, 0.03) + 0.25 * hp(rng.standard_normal(n), 3500) * env(n, 0.0005, 0.004)


def sopro(dur=0.18, f0=600, f1=5000, sobe=True):
    n = int(dur * SR); r = rng.standard_normal(n); out = np.zeros(n)
    for k in range(8):
        a0, a1 = k * n // 8, (k + 1) * n // 8
        fr = f0 * (f1 / f0) ** (((k + 0.5) / 8) if sobe else 1 - (k + 0.5) / 8)
        out[a0:a1] = bp(r, fr * 0.6, min(fr * 1.6, 20000))[a0:a1]
    return out * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.6


def blip():
    n = int(0.035 * SR); x = np.arange(n) / SR
    return (0.6 * bp(rng.standard_normal(n), 1800, 6500) + 0.4 * np.sign(np.sin(2 * np.pi * 820 * x))) * env(n, 0.0005, 0.012)


def tique(f=2300):
    n = int(0.045 * SR); x = np.arange(n) / SR
    return np.sin(2 * np.pi * f * x) * np.exp(-x * 110)


def impacto(f0=48, dur=0.9):
    n = int(dur * SR); x = np.arange(n) / SR
    return np.sin(2 * np.pi * f0 * x * (1 - 0.3 * x / dur)) * np.exp(-x * 4.5) + 0.5 * lp(rng.standard_normal(n), 420) * env(n, 0.001, 0.07)


def sino(f=1568, dur=0.8):
    n = int(dur * SR); x = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f * h * x) * np.exp(-x * (3 + h)) / h for h in (1, 2.01, 3.02))


def tecla():
    n = int(0.03 * SR)
    return hp(rng.standard_normal(n), 2200) * env(n, 0.0003, 0.006) + 0.4 * toque(160, 0.03)


fx = np.zeros(N)
tempos_revela = []
for e in EV['eventos']:
    t, tipo = e['t'], e['tipo']
    if tipo == 'corte':
        add(fx, t, toque(95), 0.55)
    elif tipo == 'corte-pessoa':
        add(fx, t, toque(80, 0.08), 0.4)
    elif tipo == 'corte-card':
        add(fx, t - 0.12, sopro(0.16, 900, 6000), 0.35); add(fx, t, toque(70, 0.1), 0.45)
    elif tipo == 'estilo':
        add(fx, t, blip(), 0.28)
    elif tipo == 'rajada':
        add(fx, t - 0.05, sopro(0.12, 1200, 7000), 0.3); add(fx, t, toque(110, 0.06), 0.3)
    elif tipo == 'ladrilho':
        add(fx, t, tique(2100), 0.3); add(fx, t, toque(120, 0.05), 0.3)
    elif tipo in ('pico-gigante', 'pico-digita'):
        add(fx, t - 0.3, sopro(0.3, 300, 4000), 0.35); add(fx, t, impacto(46), 0.8)
    elif tipo == 'pico-conta':
        for k in range(4):
            add(fx, t + 0.17 * k, tique(2000 + 260 * k), 0.38)
        add(fx, t + 0.51, sino(1760, 0.7), 0.22); add(fx, t + 0.51, impacto(52, 0.6), 0.5)
    elif tipo == 'tecla':
        for k in range(3):
            add(fx, t + 0.04 * k, tecla(), 0.3)
    elif tipo == 'revela':
        tempos_revela.append(t)
        add(fx, t, toque(140, 0.05), 0.45); add(fx, t, tique(3200), 0.15)
    elif tipo == 'sobe':
        add(fx, t, sopro(0.3, 500, 6000), 0.35)
    elif tipo == 'flash':
        add(fx, t - 0.35, sopro(0.35, 200, 9000), 0.45); add(fx, t, impacto(42, 1.1), 0.6)
    elif tipo == 'ponte-entra':
        add(fx, t - 0.05, sopro(0.35, 400, 4500), 0.4)
    elif tipo == 'ponte-sai':
        add(fx, t, sopro(0.28, 5000, 500, sobe=False), 0.35)
add(fx, D - 0.75, sopro(0.6, 300, 8000), 0.3)
add(fx, D - 0.2, impacto(40, 0.9), 0.3)

# a cama: ruído rosado grave + ar + uma nota de fundo que respira devagar; nunca silêncio entre as frases (E18)
rosa = np.cumsum(rng.standard_normal(N)); rosa = hp(rosa - np.convolve(rosa, np.ones(4800) / 4800, 'same'), 30)
cama = 0.6 * lp(rosa, 380) / (np.abs(rosa).max() + 1e-9) + 0.12 * bp(rng.standard_normal(N), 4000, 9000)
cama += 0.35 * np.sin(2 * np.pi * 55 * tt) * (0.75 + 0.25 * np.sin(2 * np.pi * 0.11 * tt)) + 0.18 * np.sin(2 * np.pi * 82.4 * tt) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * tt + 1))
cama *= np.clip(tt / 0.4, 0, 1) * np.clip((D - tt) / 0.6, 0, 1)
for t in tempos_revela[:1]:  # some antes da 1ª revelação da tarja e volta nela
    cama *= 1 - 0.85 * np.clip((tt - (t - 0.45)) / 0.1, 0, 1) * np.clip((t + 0.05 - tt) / 0.1, 0, 1)

# a voz
sr_v, voz = wavfile.read(AQUI / 'public' / 'voz.wav')
voz = voz.astype(np.float64) / (32768 if voz.dtype == np.int16 else 1)
voz = voz.mean(1) if voz.ndim == 2 else voz
if sr_v != SR:
    voz = resample_poly(voz, SR, sr_v)
voz = np.pad(voz, (0, max(0, N - len(voz))))[:N]
voz = hp(voz, 80)
# compressão leve (3:1 acima de -20 dBFS de envelope)
envv = np.sqrt(lp(voz ** 2, 20).clip(1e-12))
lim = 10 ** (-20 / 20)
voz *= np.where(envv > lim, (envv / lim) ** (1 / 3 - 1), 1.0)
fala = np.clip(envv / (envv.max() + 1e-9) / 0.08, 0, 1)
cama *= lp(10 ** (-4 * fala / 20), 5)

st = lambda x: np.stack([x, x], 1)
L = lambda x: midia.lufs(st(x)) or -70
lv = L(voz)
fx *= 10 ** (((lv - 13) - L(fx)) / 20)
cama *= 10 ** (((lv - 22) - L(cama)) / 20)
trilha = np.zeros(N)
if a.trilha:
    sr_t, tr = wavfile.read(a.trilha)
    tr = tr.astype(np.float64) / (32768 if tr.dtype == np.int16 else 1)
    tr = tr.mean(1) if tr.ndim == 2 else tr
    tr = resample_poly(tr, SR, sr_t) if sr_t != SR else tr
    trilha = np.pad(tr, (0, max(0, N - len(tr))))[:N]
    trilha *= 10 ** (((lv - 16) - L(trilha)) / 20) * lp(10 ** (-6 * fala / 20), 5)
if a.so_som:
    for nome, x in (('efeitos.wav', fx), ('cama.wav', cama)):
        wavfile.write(AQUI / 'public' / nome, SR, (st(x / (np.abs(x).max() + 1e-9) * 0.7) * 32767).astype(np.int16))
    print('public/efeitos.wav e public/cama.wav'); sys.exit(0)
mix = voz + fx + cama + trilha
mix *= 10 ** ((-14 - L(mix)) / 20)


def limitar(x, teto_db):
    """limitador com antecipação de 4 ms: o ganho desce antes do pico e volta suave"""
    teto = 10 ** (teto_db / 20)
    n = int(0.004 * SR)
    jan = np.lib.stride_tricks.sliding_window_view(np.pad(np.abs(x), (n, n)), 2 * n + 1).max(1)[:len(x)]
    g = np.minimum(1, teto / (jan + 1e-12))
    return x * np.minimum(g, np.convolve(g, np.ones(n) / n, 'same'))


for _ in range(4):
    mix = limitar(mix, -1.6)
    mix *= 10 ** ((-14 - L(mix)) / 20)
    pr = midia.pico_real(st(mix))
    if pr is not None and pr <= -1.05:
        break
mix = limitar(mix, -1.6)
out_wav = AQUI / 'out' / 'mix.wav'
out_wav.parent.mkdir(exist_ok=True)
wavfile.write(out_wav, SR, (st(mix) * 32767).clip(-32768, 32767).astype(np.int16))
video, saida = AQUI / a.video, AQUI / a.saida
subprocess.run([midia.exe('ffmpeg'), '-v', 'error', '-y', '-i', str(video), '-i', str(out_wav), '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', str(saida)], check=True)
out_wav.unlink()
x = midia.audio(saida)
print(f'{saida.relative_to(AQUI)}: {midia.lufs(x):.1f} LUFS, pico {midia.pico_real(x):.1f} dBTP, {D:.2f} s | voz {lv:.1f}, efeitos {L(fx):.1f}, cama {L(cama):.1f} LUFS')
subprocess.run([sys.executable, str(RAIZ / 'tools' / 'entregar.py'), str(AQUI), str(saida)])
