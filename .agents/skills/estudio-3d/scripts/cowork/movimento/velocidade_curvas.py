# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 | fonte: curvas.py (este pacote)
"""Gera CSV de posição e velocidade de 5 curvas (0 -> 1 m em 30 quadros) avaliando as F-curves reais do Blender.
Uso: /home/claude/bvenv/bin/python velocidade_curvas.py /saida/curvas.csv
Depois: python3 grafico_velocidade.py /saida/curvas.csv /saida/curvas_velocidade.png  (matplotlib no Python do sistema)"""
import sys, os, bpy
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import curvas

saida = sys.argv[-1] if sys.argv[-1].endswith(".csv") else "/tmp/curvas.csv"
sc = bpy.context.scene
estilos = ["linear", "bezier", "expo_out", "premium", "pouso"]
fcs = {}
for e in estilos:
    o = bpy.data.objects.new("E_" + e, None)
    sc.collection.objects.link(o)
    fcs[e] = curvas.mover(o, "location", 0, 1, 31, 0.0, 1.0, estilo=e, overshoot_pct=5.0)
with open(saida, "w") as f:
    f.write("quadro," + ",".join(f"pos_{e},vel_{e}" for e in estilos) + "\n")
    for i in range(121):
        q = 1 + i * 0.25
        lin = [q]
        for e in estilos:
            p = fcs[e].evaluate(q)
            v = (fcs[e].evaluate(q + 0.01) - fcs[e].evaluate(q - 0.01)) / 0.02 * 30  # m/s a 30 fps
            lin += [p, v]
        f.write(",".join(f"{x:.5f}" for x in lin) + "\n")
for e in estilos:
    vals = [fcs[e].evaluate(1 + i * 0.25) for i in range(121)]
    v = [(vals[i + 1] - vals[i]) * 4 * 30 for i in range(120)]
    pico = max(v); qp = 1 + v.index(pico) * 0.25
    a50 = next(1 + i * 0.25 for i, x in enumerate(vals) if x >= 0.5)
    a90 = next(1 + i * 0.25 for i, x in enumerate(vals) if x >= 0.9)
    print(f"{e:9s} vel_pico={pico:5.2f} m/s no quadro {qp:5.2f} | 50% do caminho no q{a50:5.2f} | 90% no q{a90:5.2f} | max pos {max(vals):.3f}")
print("CSV", saida)
