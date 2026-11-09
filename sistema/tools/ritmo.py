"""Ritmo de um vídeo: cortes por segundo, movimento médio entre quadros e % de quadros parados.
Serve pra comparar uma peça com a referência do modelo antes de mostrar (motion parado é o erro mais comum).
uso: .venv/Scripts/python.exe tools/ritmo.py <video.mp4> [<outro.mp4> ...] [--de S] [--ate S]
--de/--ate (segundos) medem só um trecho de cada vídeo (ex.: a onda de imagem do imagem-por-palavra)."""
import argparse, sys, cv2, numpy as np
sys.stdout.reconfigure(encoding='utf-8')
ap = argparse.ArgumentParser()
ap.add_argument('videos', nargs='+')
ap.add_argument('--de', type=float, default=0.0)
ap.add_argument('--ate', type=float, default=None)
a = ap.parse_args()
for f in a.videos:
    cap = cv2.VideoCapture(f); fps = cap.get(5) or 30; n = int(cap.get(7))
    k0 = max(0, int(round(a.de * fps))); k1 = n if a.ate is None else min(n, int(round(a.ate * fps)))
    if k0: cap.set(cv2.CAP_PROP_POS_FRAMES, k0)
    prev = None; ph = None; cortes = []; mov = []; k = k0
    while k < k1:
        ok, fr = cap.read()
        if not ok: break
        s = cv2.resize(fr, (160, 90)); g = cv2.cvtColor(s, cv2.COLOR_BGR2GRAY)
        h = cv2.calcHist([cv2.cvtColor(s, cv2.COLOR_BGR2HSV)], [0, 1], None, [16, 8], [0, 180, 0, 256]); cv2.normalize(h, h)
        if prev is not None:
            mov.append(np.abs(g.astype(int) - prev).mean())
            if cv2.compareHist(h, ph, cv2.HISTCMP_BHATTACHARYYA) > 0.3: cortes.append(k / fps)
        prev, ph = g.astype(int), h; k += 1
    d = max((k - k0) / fps, 1e-6); mv = np.array(mov) if mov else np.zeros(1)
    parado = (mv < 0.8).mean()
    trecho = f' [{k0 / fps:.1f}-{k / fps:.1f}s]' if (a.de or a.ate is not None) else ''
    print(f"{f.replace(chr(92), '/').split('/')[-1][:22]:22s}{trecho} {d:5.1f}s  cortes {len(cortes):3d} ({len(cortes)/d:.2f}/s)  movimento médio {mv.mean():.2f}  quadros parados {parado*100:.0f}%")
