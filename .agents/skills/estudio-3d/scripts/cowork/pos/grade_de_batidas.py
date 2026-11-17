# Python puro | status: testado (aritmética) | fonte: 1 batida = 60/BPM s; quadros = fps*60/BPM
"""Grade de batidas em quadros: onde cortar para a trilha cair na batida.
Uso: python3 grade_de_batidas.py 128 30 20 [offset_quadros]  (BPM, fps, duração em s, quadro da 1ª batida)"""
import sys
def grade(bpm, fps=30, dur=20, offset=0):
    qpb = fps * 60 / bpm
    out, n = [], 0
    while True:
        q = offset + n * qpb
        if q > dur * fps: break
        out.append((n, round(q), "COMPASSO" if n % 4 == 0 else "batida"))
        n += 1
    return qpb, out
if __name__ == "__main__":
    bpm = float(sys.argv[1]); fps = float(sys.argv[2]) if len(sys.argv) > 2 else 30
    dur = float(sys.argv[3]) if len(sys.argv) > 3 else 20; off = float(sys.argv[4]) if len(sys.argv) > 4 else 0
    qpb, g = grade(bpm, fps, dur, off)
    print(f"{bpm} BPM a {fps} fps: {qpb:.3f} quadros por batida, {4*qpb:.2f} por compasso 4/4")
    for n, q, t in g:
        if t == "COMPASSO": print(f"  compasso {n//4+1:2d}: quadro {q}")
