# Python do sistema (Pillow + numpy) | status: testado na nuvem | mede ruído (RMSE contra a referência 1024 amostras + denoise) e monta a folha
"""Uso: python3 folha_amostras.py /tmp/amostras /home/claude/provas/render_amostras.png "16:2.8,3.7|64:10.2,10.8|256:40.1,41.5" """
import sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont
pasta, saida, tempos = sys.argv[1], sys.argv[2], sys.argv[3]
T = {int(k): [float(x) for x in v.split(",")] for k, v in (p.split(":") for p in tempos.split("|"))}
ref = np.asarray(Image.open(os.path.join(pasta, "a1024_dn.png")).convert("RGB")).astype(float) / 255
def fonte(t):
    return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", t)
cw, ch, mg, faixa, topo = 256, 320, 10, 46, 40
F = Image.new("RGB", (3 * cw + 4 * mg, topo + 2 * (ch + faixa) + 3 * mg), (16, 16, 18))
d = ImageDraw.Draw(F)
d.text((mg, 10), "Cycles CPU 256x320, frasco de vidro: amostras fixas x denoise OIDN (albedo+normal)", fill=(240, 240, 240), font=fonte(14))
for col, spp in enumerate((16, 64, 256)):
    for lin, dn in enumerate((False, True)):
        f = os.path.join(pasta, f"a{spp:04d}_{'dn' if dn else 'cru'}.png")
        im = Image.open(f).convert("RGB"); a = np.asarray(im).astype(float) / 255
        rmse = np.sqrt(((a - ref) ** 2).mean())
        x = mg + col * (cw + mg); y = topo + mg + lin * (ch + faixa + mg)
        F.paste(im, (x, y))
        d.text((x + 4, y + ch + 4), f"{spp} amostras {'+ denoise' if dn else 'sem denoise'}", fill=(230, 230, 230), font=fonte(13))
        d.text((x + 4, y + ch + 22), f"{T[spp][1 if dn else 0]:.1f} s | erro RMSE {rmse*100:.2f}%", fill=(190, 190, 190), font=fonte(12))
        print(spp, dn, f"rmse={rmse*100:.2f}%")
F.save(saida); print("ok", saida)
