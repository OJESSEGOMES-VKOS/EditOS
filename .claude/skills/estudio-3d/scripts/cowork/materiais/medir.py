# Blender 5.2 | status: testado na nuvem (Python puro, numpy/PIL) | fonte: cap 06 · Materiais
# Mede brilho médio, % estourado (>=250) e % afundado (<=5) de um PNG. Roda no python3 do sistema (PIL).
import sys
from PIL import Image, ImageStat
for f in sys.argv[1:]:
    im = Image.open(f).convert("L"); px = list(im.getdata()); n = len(px)
    est = sum(1 for v in px if v >= 250) / n * 100; afu = sum(1 for v in px if v <= 5) / n * 100
    st = ImageStat.Stat(im)
    print(f"{f}: media={st.mean[0]/255:.3f} desvio={st.stddev[0]/255:.3f} estourado={est:.2f}% afundado={afu:.2f}%")
