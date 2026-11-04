"""Recorta a pessoa da gravação (Robust Video Matting, onnx) e grava public/pessoa.webm com transparência: é a cabeça que
passa por cima da borda do cartão de câmera do palco (prova-print.md §3, PV8). Mede também o topo da cabeça
(cabelo incluso) e grava em src/rosto_med.json ("topo": o ponto mais alto da cabeça no vídeo, p2; "topo_med": a mediana),
em px da gravação 1080x1920: o enquadramento e o checador usam isso para nunca cortar a cabeça (PV6).
Lê public/fala.mp4. Rode depois de scripts/rosto.py (que reescreve o rosto_med.json).
uso (na pasta do vídeo, com a trava): QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/recorte.py
"""
import json
import os
import subprocess
from pathlib import Path

import numpy as np
import onnxruntime as ort

AQUI = Path(__file__).resolve().parent.parent
EST = AQUI.parents[1]  # raiz do estúdio (sistema/)
FF = str(EST / 'tools' / '.cache' / 'ffmpeg' / 'ffmpeg.exe') if os.name == 'nt' else 'ffmpeg'
W, H = 1080, 1920
ent = AQUI / 'public' / 'fala.mp4'
sai = AQUI / 'public' / 'pessoa.webm'
RM = AQUI / 'src' / 'rosto_med.json'
r = json.loads(RM.read_text(encoding='utf-8'))

sess = ort.InferenceSession(str(EST / 'tools' / 'modelos' / 'rvm_mobilenetv3_fp32.onnx'), providers=['CUDAExecutionProvider', 'CPUExecutionProvider'])
rec = [np.zeros((1, 1, 1, 1), np.float32)] * 4
ratio = np.array([0.25], np.float32)

le = subprocess.Popen([FF, '-loglevel', 'error', '-i', str(ent), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
es = subprocess.Popen([FF, '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{W}x{H}', '-r', '30', '-i', '-',
                       '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '6M', '-auto-alt-ref', '0', str(sai)], stdin=subprocess.PIPE)
# faixa do rosto (largura medida) em volta do centro: o topo é o 1º risco de cabeça ali, não um ombro ou a mão levantada
x0, x1 = int(max(0, r['cx'] - 0.7 * r['largura'])), int(min(W, r['cx'] + 0.7 * r['largura']))
topos, f = [], 0
while True:
    buf = le.stdout.read(W * H * 3)
    if len(buf) < W * H * 3:
        break
    rgb = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
    src = (rgb.astype(np.float32) / 255).transpose(2, 0, 1)[None]
    fgr, pha, *rec = sess.run(None, {'src': src, 'r1i': rec[0], 'r2i': rec[1], 'r3i': rec[2], 'r4i': rec[3], 'downsample_ratio': ratio})
    a = (pha[0, 0] * 255).clip(0, 255).astype(np.uint8)
    es.stdin.write(np.dstack([rgb, a]).tobytes())
    if f % 3 == 0:
        linhas = np.where((a[: int(r['olhos']), x0:x1] > 128).sum(1) >= 12)[0]
        if len(linhas):
            topos.append(int(linhas[0]))
    if f % 150 == 0:
        print(f, flush=True)
    f += 1
es.stdin.close()
es.wait()
if not topos:
    raise SystemExit('não achei a cabeça no recorte: confira public/fala.mp4')
r['topo'] = round(float(np.percentile(topos, 2)), 1)
r['topo_med'] = round(float(np.median(topos)), 1)
RM.write_text(json.dumps(r, indent=1), encoding='utf-8')
print(f, 'quadros ->', sai, '| topo da cabeça p2', r['topo'], 'mediana', r['topo_med'], '(olhos', r['olhos'], ')')
