"""Recorta o trecho escolhido da gravação longa (corte-palestra.md, seção 3 e 9).

Lê trecho.json da pasta do vídeo:  {"frases": [3, 4, 5, 7, 8]}   (os números do scripts/ponto.py)
e a gravação inteira em base/ (fala.mp4, voz.wav, palavras.json, rosto.json, frases.json). Frases seguidas viram um
trecho contínuo, com as pausas naturais de quem fala (a pausa retórica é parte do corte); onde a lista pula uma frase
(tomada repetida, assunto que não é do pensamento) ou a pausa passa de PAUSA_MAX, entra uma emenda.
Bordas de cada trecho: 0,08 s antes da 1ª palavra e 0,10 s depois da última (micro-fade de 6 ms no áudio).
O último trecho segue FOLGA s depois da última palavra (lido de src/Corte.tsx: a última frase respira); a voz some nos
0,3 s depois da última palavra, para nada da frase seguinte vazar no fecho.

Saída: public/fala.mp4, public/voz.wav, src/palavras.json, src/rosto.json (no tempo do corte), src/emendas.json (os
instantes das emendas no tempo do corte) e trecho-mapa.txt (de onde veio cada pedaço).
Pesado (ffmpeg): rode pela trava, na pasta do vídeo:
  QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/recortar.py
"""
import json, re, subprocess, sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
AQUI = Path(__file__).resolve().parent.parent
B = AQUI / 'base'
PAUSA_MAX = 1.2  # pausa maior que isso dentro do pensamento vira emenda (tempo morto, não respiração)
ANTES, DEPOIS = 0.08, 0.10

for arq in ('fala.mp4', 'voz.wav', 'palavras.json', 'frases.json'):
    if not (B / arq).exists():
        sys.exit(f'falta base/{arq}: rode tools/novo-video.py na gravação e depois scripts/ponto.py.')
if not (AQUI / 'trecho.json').exists():
    sys.exit('falta trecho.json na pasta do vídeo: {"frases": [n, n, ...]} com os números do scripts/ponto.py.')
PS = json.loads((B / 'palavras.json').read_text(encoding='utf-8'))
FR = {f['n']: f for f in json.loads((B / 'frases.json').read_text(encoding='utf-8'))}
# cada item: n (a frase inteira) ou [n, k] (sem as k primeiras palavras) ou [n, k, j] (sem as k primeiras e as j últimas)
itens = [x if isinstance(x, list) else [x] for x in json.loads((AQUI / 'trecho.json').read_text(encoding='utf-8'))['frases']]
escolha = [x[0] for x in itens]
# "respiro": {"n": s} = depois da frase n, s segundos da pausa real antes da emenda (o gancho que pousa, a pausa retórica)
RESPIRO = {int(k): float(v) for k, v in json.loads((AQUI / 'trecho.json').read_text(encoding='utf-8')).get('respiro', {}).items()}
fim_frase = {FR[n]['i1']: n for n in FR}
if not escolha or any(n not in FR for n in escolha) or escolha != sorted(set(escolha)):
    sys.exit(f'trecho.json: "frases" tem de ser uma lista crescente de números entre 1 e {len(FR)} (scripts/ponto.py), ou [n, k] / [n, k, j].')
m = re.search(r'^const FOLGA = ([\d.]+);', (AQUI / 'src' / 'Corte.tsx').read_text(encoding='utf-8'), re.M)
FOLGA = float(m.group(1)) if m else 1.6
DUR = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(B / 'fala.mp4')],
                           capture_output=True, text=True).stdout.strip())

# pedaços em palavras: frases seguidas formam um pedaço; uma pausa > PAUSA_MAX entre palavras abre outro
pedacos = []
for n, *corta in itens:
    k, j = (corta + [0, 0])[:2]
    ids = list(range(FR[n]['i0'] + k, FR[n]['i1'] + 1 - j))
    if not ids:
        sys.exit(f'trecho.json: a frase {n} ficou sem palavras com {corta}.')
    if pedacos and n - 1 in escolha and not k and PS[ids[0]]['start'] - PS[pedacos[-1][-1]]['end'] <= PAUSA_MAX:
        pedacos[-1] += ids
    else:
        pedacos.append(ids)
cortado = []
for ids in pedacos:  # pausa longa dentro de uma frase também vira emenda
    cur = [ids[0]]
    for i in ids[1:]:
        if PS[i]['start'] - PS[cur[-1]]['end'] > PAUSA_MAX:
            cortado.append(cur)
            cur = []
        cur.append(i)
    cortado.append(cur)
seg = []
for k, ids in enumerate(cortado):
    de = max(0.0, PS[ids[0]]['start'] - ANTES, PS[ids[0] - 1]['end'] if ids[0] else 0.0)
    ate = min(DUR, PS[ids[-1]]['end'] + (FOLGA if k == len(cortado) - 1 else max(DEPOIS, RESPIRO.get(fim_frase.get(ids[-1]), 0))))
    if k < len(cortado) - 1 and ids[-1] + 1 < len(PS):
        ate = min(ate, PS[ids[-1] + 1]['start'])
    seg.append((round(de, 3), round(ate, 3), ids))

# tempo novo de cada palavra e as emendas
novas, emendas, mapa, t0 = [], [], [], 0.0
for k, (de, ate, ids) in enumerate(seg):
    for i in ids:
        novas.append(dict(text=PS[i]['text'], start=round(PS[i]['start'] - de + t0, 3), end=round(PS[i]['end'] - de + t0, 3)))
    mapa.append(f'{t0:7.2f}-{t0 + ate - de:7.2f} s do corte  <=  {de:7.2f}-{ate:7.2f} s da gravação  "{" ".join(PS[i]["text"] for i in ids)}"')
    t0 += ate - de
    if k < len(seg) - 1:
        emendas.append(round(t0, 3))
fim_voz = novas[-1]['end']  # a voz some logo depois da última palavra

# gravação deitada (16:9 de evento): recorte 9:16 fixo, centrado na mediana do rosto do trecho (plano único: o recorte não
# persegue a pessoa); a gravação em pé (celular) entra inteira
WH = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0',
                     str(B / 'fala.mp4')], capture_output=True, text=True).stdout.strip().split(',')
W, H = int(WH[0]), int(WH[1])
rosto = json.loads((B / 'rosto.json').read_text(encoding='utf-8')) if (B / 'rosto.json').exists() else []
X0, CW, CROP = 0, W, ''
if W > H:
    CW = int(H * 9 / 16) // 2 * 2
    cxs = sorted(r[1] for r in rosto if r[3] > 0 and any(de <= r[0] <= ate for de, ate, _ in seg))
    cx = cxs[len(cxs) // 2] * W if cxs else W / 2
    X0 = int(min(max(cx - CW / 2, 0), W - CW))
    CROP = f',crop={CW}:{H}:{X0}:0'
    print(f'gravação deitada {W}x{H}: recorte 9:16 fixo x {X0}-{X0 + CW} (rosto mediano em x {cx:.0f})')

# vídeo e voz: trim + concat; micro-fade de 6 ms em cada borda; a voz cala nos 0,3 s depois da última palavra
fv, fa = [], []
for k, (de, ate, _) in enumerate(seg):
    d = ate - de
    fv.append(f'[0:v]trim={de}:{ate},setpts=PTS-STARTPTS[v{k}]')
    fa.append(f'[1:a]atrim={de}:{ate},asetpts=PTS-STARTPTS,afade=t=in:d=0.006,afade=t=out:st={max(0, d - 0.006):.3f}:d=0.006[a{k}]')
n = len(seg)
filtro = ';'.join(fv + fa) + ';' + ''.join(f'[v{k}]' for k in range(n)) + f'concat=n={n}:v=1:a=0{CROP},scale=1080:1920:flags=lanczos,setsar=1[v];' + ''.join(f'[a{k}]' for k in range(n)) + \
    f'concat=n={n}:v=0:a=1,afade=t=out:st={fim_voz + 0.05:.3f}:d=0.3[a]'
ff = ['ffmpeg', '-loglevel', 'error', '-y', '-i', str(B / 'fala.mp4'), '-i', str(B / 'voz.wav'), '-filter_complex', filtro]
(AQUI / 'public').mkdir(exist_ok=True)
# um ffmpeg só, com as duas saídas (o grafo tem [v] e [a]; cada saída leva uma)
subprocess.run(ff + ['-map', '[v]', '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-r', '30', '-an',
                     '-movflags', '+faststart', str(AQUI / 'public' / 'fala.mp4'),
                     '-map', '[a]', '-ar', '48000', '-ac', '2', str(AQUI / 'public' / 'voz.wav')], check=True)

# rosto no tempo do corte, na grade de 0,25 s (o mais perto da gravação)
novo_rosto, t = [], 0.0
if rosto:
    while t < t0:
        acc, tg = 0.0, None
        for de, ate, _ in seg:
            if t < acc + ate - de:
                tg = de + t - acc
                break
            acc += ate - de
        r = min(rosto, key=lambda x: abs(x[0] - tg))
        novo_rosto.append([round(t, 2), round((r[1] * W - X0) / CW, 4) if r[3] > 0 else r[1], r[2], r[3]])
        t += 0.25
(AQUI / 'src' / 'palavras.json').write_text(json.dumps(novas, ensure_ascii=False, indent=0), encoding='utf-8')
(AQUI / 'src' / 'rosto.json').write_text(json.dumps(novo_rosto), encoding='utf-8')
(AQUI / 'src' / 'emendas.json').write_text(json.dumps(emendas), encoding='utf-8')
(AQUI / 'trecho-mapa.txt').write_text('\n'.join(mapa) + f'\nemendas no tempo do corte: {emendas}\n', encoding='utf-8')
print('\n'.join(mapa))
print(f'corte: {t0:.2f} s ({len(novas)} palavras, {len(emendas)} emenda(s)); a última palavra acaba em {fim_voz:.2f} s e a imagem'
      f' segue {t0 - fim_voz:.2f} s')
