"""Ritmo de um vídeo: cortes por segundo, movimento médio entre quadros e % de quadros parados.
Serve pra comparar uma peça com a referência do modelo antes de mostrar (motion parado é o erro mais comum).
uso: .venv/Scripts/python.exe tools/ritmo.py <video.mp4> [<outro.mp4> ...]"""
import sys, cv2, numpy as np
for f in sys.argv[1:]:
    cap = cv2.VideoCapture(f); fps = cap.get(5); n = int(cap.get(7))
    prev = None; ph = None; cortes = []; mov = []; k = 0
    while True:
        ok, fr = cap.read()
        if not ok: break
        s = cv2.resize(fr, (160, 90)); g = cv2.cvtColor(s, cv2.COLOR_BGR2GRAY)
        h = cv2.calcHist([cv2.cvtColor(s, cv2.COLOR_BGR2HSV)], [0, 1], None, [16, 8], [0, 180, 0, 256]); cv2.normalize(h, h)
        if prev is not None:
            mov.append(np.abs(g.astype(int) - prev).mean())
            if cv2.compareHist(h, ph, cv2.HISTCMP_BHATTACHARYYA) > 0.3: cortes.append(k / fps)
        prev, ph = g.astype(int), h; k += 1
    d = n / fps; mv = np.array(mov)
    parado = (mv < 0.8).mean()
    print(f"{f.split('/')[-1][:22]:22s} {d:5.1f}s  cortes {len(cortes):3d} ({len(cortes)/d:.2f}/s)  movimento médio {mv.mean():.2f}  quadros parados {parado*100:.0f}%")
