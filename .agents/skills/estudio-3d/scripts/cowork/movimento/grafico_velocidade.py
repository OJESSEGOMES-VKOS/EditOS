# Python do sistema (matplotlib) | status: testado na nuvem | entrada: CSV de velocidade_curvas.py (F-curves avaliadas no bpy 5.2.2)
"""Plota posição e velocidade de cada curva. Uso: python3 grafico_velocidade.py curvas.csv saida.png"""
import sys, csv
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ent, sai = sys.argv[1], sys.argv[2]
linhas = list(csv.DictReader(open(ent)))
q = [float(l["quadro"]) for l in linhas]
rot = {
    "linear": ("Linear (barata: partida e parada secas)", "#9aa0a6", "--"),
    "bezier": ("Bézier padrão AUTO_CLAMPED (simétrica, 'de software')", "#e8a33d", "-"),
    "expo_out": ("EXPO + EASE_OUT (pico no 1º quadro: só p/ quem já entra em movimento)", "#d64545", "-"),
    "premium": ("Bézier alça assimétrica 10%/70% (premium: arranca e assenta longo)", "#2f7de1", "-"),
    "pouso": ("BACK + EASE_OUT, overshoot 5% (pouso)", "#2aa876", "-."),
}
fig, ax = plt.subplots(2, 1, figsize=(10, 8.6), sharex=True)
for k, (nome, cor, est) in rot.items():
    ax[0].plot(q, [float(l["pos_" + k]) for l in linhas], est, color=cor, lw=2.2, label=nome)
    ax[1].plot(q, [float(l["vel_" + k]) for l in linhas], est, color=cor, lw=2.2, label=nome)
ax[0].set_ylabel("posição (m)")
ax[0].set_title("Mesmo deslocamento (0 a 1 m em 30 quadros a 30 fps), cinco curvas do Blender 5.2", fontsize=12)
ax[0].axhline(1.0, color="#444", lw=0.6)
ax[1].set_ylabel("velocidade (m/s)")
ax[1].set_xlabel("quadro")
ax[1].axhline(0, color="#444", lw=0.6)
for a in ax:
    a.grid(alpha=0.25)
    a.set_xlim(1, 31)
ax[0].legend(fontsize=8.5, loc="lower right")
fig.text(0.01, 0.005, "Curvas avaliadas por fcurve.evaluate() no bpy 5.2.2. Fonte: /home/claude/codigo/movimento/velocidade_curvas.py",
         fontsize=7.5, color="#666")
fig.tight_layout(rect=(0, 0.02, 1, 1))
fig.savefig(sai, dpi=130)
print("ok", sai)
