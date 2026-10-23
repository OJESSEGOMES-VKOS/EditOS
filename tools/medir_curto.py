"""Mede uma referência curta (Reel, até ~1 min) em densidade alta.
uso (venv do estúdio, tem cv2 + faster-whisper):
  ../.venv/Scripts/python.exe medir_curto.py <video.mp4> <prefixo> [qps=2]
saídas:
  <prefixo>_tl_NN.png   folhas com <qps> quadros por segundo, hora no canto (hora do meio do intervalo do filtro fps)
  <prefixo>_cortes.txt  cortes secos (limiar 0,30) e mediana
  <prefixo>_rosto.txt   por quadro: altura do maior rosto (YuNet) e centro x
  <prefixo>_som.txt     chão de ruído p10 (trilha por baixo?) e volume médio
  <prefixo>_fala.txt    transcrição Whisper large-v3 palavra a palavra, em linhas de ~3 s (idioma detectado)
"""
import json, os, re, subprocess, sys, tempfile
from pathlib import Path
from statistics import median
import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont

video, pref = Path(sys.argv[1]).resolve(), sys.argv[2]
qps = float(sys.argv[3]) if len(sys.argv) > 3 else 2.0
TOOLS = Path(__file__).resolve().parent
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(video)], capture_output=True, text=True).stdout)

# quadros e cortes pelo OpenCV (o ffmpeg do Remotion não tem os filtros fps/select): um passe só pelo vídeo
tmp = Path(tempfile.mkdtemp(dir=os.environ.get('TEMP')))
cap = cv2.VideoCapture(str(video))
fv = cap.get(cv2.CAP_PROP_FPS) or 30.0
c, ant, k, prox, qs = [0.0], None, 0, 0.0, []
while True:
    ok, im = cap.read()
    if not ok:
        break
    t = k / fv
    # cena nova: diferença de histograma de cor (equivale ao scene > 0,30 do ffmpeg, aproximado)
    h = cv2.calcHist([cv2.cvtColor(cv2.resize(im, (160, 90)), cv2.COLOR_BGR2HSV)], [0, 1], None, [32, 32], [0, 180, 0, 256])
    cv2.normalize(h, h)
    if ant is not None and cv2.compareHist(ant, h, cv2.HISTCMP_BHATTACHARYYA) > 0.30:
        c.append(t)
    ant = h
    if t + 1e-6 >= prox:  # um quadro a cada 1/qps s
        q = tmp / f'{len(qs) + 1:04d}.jpg'
        cv2.imwrite(str(q), im, [cv2.IMWRITE_JPEG_QUALITY, 90])
        qs.append(q)
        prox += 1 / qps
    k += 1
cap.release()
c.append(dur)
cenas = [(a, b) for a, b in zip(c, c[1:]) if b - a > 0.08]
dd = [b - a for a, b in cenas]
with open(f'{pref}_cortes.txt', 'w', encoding='utf-8') as f:
    f.write(f'duracao {dur:.2f}s | cenas {len(cenas)} | media {dur / len(cenas):.2f}s | mediana {median(dd):.2f}s\n')
    for i, (a, b) in enumerate(cenas):
        f.write(f'{i:03d} {a:6.2f} {b - a:5.2f}\n')

im0 = cv2.imread(str(qs[0]))
H0, W0 = im0.shape[:2]
det = cv2.FaceDetectorYN.create(str(TOOLS / 'modelos/face_detection_yunet_2023mar.onnx'), '', (W0, H0), 0.7)
rost = []
for q in qs:
    im = cv2.imread(str(q))
    det.setInputSize((im.shape[1], im.shape[0]))
    _, fs = det.detect(im)
    if fs is not None and len(fs):
        r = max(fs, key=lambda r: r[3])
        rost.append((float(r[3]) / im.shape[0], (float(r[0]) + float(r[2]) / 2) / im.shape[1], len(fs)))
    else:
        rost.append((0.0, 0.0, 0))
with open(f'{pref}_rosto.txt', 'w', encoding='utf-8') as f:
    com = sum(h > 0 for h, _, _ in rost)
    f.write(f'quadros {len(rost)} | com rosto {com} ({100 * com / len(rost):.0f}%) | 2+ rostos {sum(n > 1 for *_, n in rost)} | altura media do rosto {np.mean([h for h, _, _ in rost if h] or [0]):.2f}\n')
    for i, (h, x, n) in enumerate(rost):
        f.write(f'{i / qps + 0.5 / qps:6.2f} h={h:.2f} x={x:.2f} n={n}\n')

# folhas
vert = H0 > W0
tw, th = (180, 320) if vert else (320, 180)
col, lin = (8, 3) if vert else (5, 5)
fonte = ImageFont.load_default(size=16)  # fonte embutida no Pillow: funciona em Windows, macOS e Linux
ims = []
for i, q in enumerate(qs):
    im = Image.open(q).convert('RGB').resize((tw, th))
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 52, 20], fill='black')
    d.text((3, 1), f'{i / qps + 0.5 / qps:5.2f}', font=fonte, fill='yellow')
    ims.append(im)
for p in range(0, len(ims), col * lin):
    folha = Image.new('RGB', (col * tw, lin * th), 'black')
    for j, im in enumerate(ims[p:p + col * lin]):
        folha.paste(im, ((j % col) * tw, (j // col) * th))
    folha.save(f'{pref}_tl_{p // (col * lin) + 1:02d}.png')
for q in qs:
    q.unlink()

# som
raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', str(video), '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', '-f', 'wav', '-'], capture_output=True).stdout
i0 = raw.find(b'data')
raw = raw[i0 + 8:] if i0 != -1 else b''
a = np.frombuffer(raw[:len(raw) // 2 * 2], np.int16).astype(np.float32) / 32768
if len(a):
    j = 800
    db = 20 * np.log10(np.sqrt((a[:len(a) // j * j].reshape(-1, j) ** 2).mean(1)) + 1e-9)
    Path(f'{pref}_som.txt').write_text(f'chao p10 {np.percentile(db, 10):.1f} dB | mediana {np.median(db):.1f} dB | p95 {np.percentile(db, 95):.1f} dB\n', encoding='utf-8')

# fala
out = tmp / 'whisper'
r = subprocess.run([sys.executable, str(TOOLS / 'transcribe.py'), str(video), str(out), '--model', 'large-v3', '--language', 'auto'], capture_output=True, text=True)
try:
    d = json.loads((out / 'transcript.json').read_text(encoding='utf-8'))
    linhas, buf, ini = [], [], None
    for x in d['words']:
        ini = x['start'] if ini is None else ini
        buf.append(x['text'].strip())
        if x['end'] - ini > 3:
            linhas.append(f'[{ini:5.1f}-{x["end"]:5.1f}] ' + ' '.join(buf)); buf, ini = [], None
    if buf:
        linhas.append(f'[{ini:5.1f}] ' + ' '.join(buf))
    Path(f'{pref}_fala.txt').write_text(f'idioma {d.get("language")}\n' + '\n'.join(linhas), encoding='utf-8')
except Exception as e:
    Path(f'{pref}_fala.txt').write_text(f'sem fala transcrita ({e})', encoding='utf-8')
print(pref, open(f'{pref}_cortes.txt', encoding='utf-8').readline().strip(), '|', open(f'{pref}_rosto.txt', encoding='utf-8').readline().strip())
