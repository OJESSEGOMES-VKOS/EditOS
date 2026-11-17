# Python do sistema (Pillow) | status: testado na nuvem | junta quadros em folha de contato com rótulo
"""Uso: python3 folha.py saida.png colunas "rotulo1|rotulo2|..." img1.png img2.png ...
Rótulos opcionais (passe "" para usar o nome do arquivo)."""
import sys, os, math
from PIL import Image, ImageDraw, ImageFont


def fonte(t):
    for c in ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
              "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"):
        if os.path.exists(c):
            return ImageFont.truetype(c, t)
    return ImageFont.load_default()


def folha(caminhos, saida, colunas=3, rotulos=None, largura_cel=300, titulo=None):
    imgs = [Image.open(c).convert("RGB") for c in caminhos]
    w0, h0 = imgs[0].size
    cw, ch = largura_cel, int(h0 * largura_cel / w0)
    faixa, mg, topo = 40, 10, (44 if titulo else 0)
    linhas = math.ceil(len(imgs) / colunas)
    F = Image.new("RGB", (colunas * cw + (colunas + 1) * mg, topo + linhas * (ch + faixa) + (linhas + 1) * mg), (16, 16, 18))
    d = ImageDraw.Draw(F)
    if titulo:
        d.text((mg, 12), titulo, fill=(240, 240, 240), font=fonte(18))
    for i, im in enumerate(imgs):
        c, l = i % colunas, i // colunas
        x = mg + c * (cw + mg); y = topo + mg + l * (ch + faixa + mg)
        F.paste(im.resize((cw, ch), Image.LANCZOS), (x, y))
        txt = rotulos[i] if rotulos else os.path.basename(caminhos[i])
        for j, parte in enumerate(txt.split("\\n")):
            d.text((x + 4, y + ch + 4 + j * 17), parte, fill=(225, 225, 225), font=fonte(13))
    F.save(saida)
    return saida


if __name__ == "__main__":
    saida, col, rot = sys.argv[1], int(sys.argv[2]), sys.argv[3]
    imgs = sys.argv[4:]
    titulo = None
    if rot.startswith("T:"):
        titulo, rot = rot[2:].split("||", 1)
    folha(imgs, saida, col, rot.split("|") if rot else None, titulo=titulo)
    print("ok", saida)
