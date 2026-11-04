"""Mede onde estão as mãos (e os braços) da pessoa, para o texto do peito não ficar por cima delas (dynamic01.md, seção 3).
Lê public/fala.mp4 e src/rosto.json. A cada 0,25 s:
  1. recorta a pessoa do fundo (Robust Video Matting, ../../tools/modelos/rvm_mobilenetv3_fp32.onnx): parede e
     móvel da cor da pele não contam;
  2. aprende a cor da pele no próprio rosto (Cr/Cb do centro do rosto) e marca essa cor dentro da pessoa;
  3. guarda só o que fica da gola para baixo (o rosto e o pescoço não são mão).
Saída: src/maos.json = {"celula": 40, "amostras": [[t, [linha0, ..., linha47]]]}: o quadro 1080x1920 em células de
40 px (27 x 48); cada linha é um número cujos bits dizem quais das 27 colunas têm mão. Sem rosto, sai sem amostras.
uso (na pasta do vídeo ou do molde): ../../.venv/Scripts/python.exe scripts/maos.py
"""
import json
import subprocess
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

AQUI = Path(__file__).resolve().parent.parent
ROS = json.loads((AQUI / 'src' / 'rosto.json').read_text(encoding='utf-8'))
SAI = AQUI / 'src' / 'maos.json'
W, H, C = 270, 480, 10  # amostra em 1/4 do quadro; célula de 10 px aqui = 40 px no quadro cheio
if not ROS:
    SAI.write_text(json.dumps({'celula': 40, 'amostras': []}))
    raise SystemExit('sem rosto: src/maos.json sem amostras')
raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', str(AQUI / 'public' / 'fala.mp4'), '-vf', f'fps=4,scale={W}:{H}',
                      '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
qs = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3)
sess = ort.InferenceSession(str(AQUI.parents[1] / 'tools' / 'modelos' / 'rvm_mobilenetv3_fp32.onnx'), providers=['CPUExecutionProvider'])
rec = [np.zeros((1, 1, 1, 1), np.float32)] * 4
amostras, com = [], 0
for k, q in enumerate(qs):
    _, pha, *rec = sess.run(None, {'src': (q.astype(np.float32) / 255).transpose(2, 0, 1)[None], 'r1i': rec[0], 'r2i': rec[1],
                                   'r3i': rec[2], 'r4i': rec[3], 'downsample_ratio': np.array([1.0], np.float32)})
    t, cx, cy, h = ROS[min(k, len(ROS) - 1)][:4]
    linhas = [0] * (H // C)
    if h > 0:
        ycc = cv2.cvtColor(q, cv2.COLOR_RGB2YCrCb).astype(np.float32)
        y0, y1 = int((cy - h * 0.25) * H), int((cy + h * 0.25) * H)
        x0, x1 = int((cx - h * 0.18) * W), int((cx + h * 0.18) * W)
        pele = ycc[y0:y1, x0:x1, 1:].reshape(-1, 2)
        mu, sd = pele.mean(0), pele.std(0) + 2.0
        m = (np.abs((ycc[..., 1:] - mu) / sd).max(2) < 2.2) & (pha[0, 0] > 0.5)
        m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
        m[:int((cy + h * 0.95) * H)] = 0  # da gola para cima não é mão
        cel = m.reshape(H // C, C, W // C, C).mean((1, 3)) > 0.35
        linhas = [int(sum(1 << j for j in np.where(r)[0])) for r in cel]
        com += any(linhas)
    amostras.append([round(k / 4, 2), linhas])
SAI.write_text(json.dumps({'celula': 40, 'amostras': amostras}), encoding='utf-8')
print(f'src/maos.json: {len(amostras)} amostras, mão abaixo da gola em {com}')
