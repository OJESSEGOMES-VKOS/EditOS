# Python 3 + numpy + Pillow (fora do Blender) | status: testado na nuvem em PNGs do bpy 5.2.2 | fontes:
#   Hasler & Süsstrunk 2003 (colorfulness): https://infoscience.epfl.ch/record/33994
#   Immerkær 1996 (estimativa rápida de ruído): https://doi.org/10.1006/cviu.1996.0060
#   Pech-Pacheco et al. 2000 (variância do Laplaciano como foco): https://doi.org/10.1109/ICPR.2000.903548
#   WCAG 2.x contraste e luminância relativa: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
#   CIEDE2000 (Sharma, Wu, Dalal 2005): https://hajim.rochester.edu/ece/sites/gsharma/ciede2000/
"""
qa_extra.py  complementa o qa.py do Laboratório com métricas de acabamento.

Uso:
  python3 qa_extra.py quadro.png [quadro2.png ...]
        [--marca "#1E5BFF"] [--mascara mascara.png] [--texto x,y,w,h]
        [--plataforma reels|tiktok|shorts] [--json saida.json]
  python3 qa_extra.py --folha saida.jpg q1.png q2.png ... (folha de contato)
  python3 qa_extra.py quadro.png --recortes pasta_saida/  (recortes 200% das áreas de mais detalhe)

Saída: tabela por imagem + lista de ALERTAS. Valores de referência no fim do arquivo (FAIXAS).
"""
import sys, json, math, os, argparse
import numpy as np
from PIL import Image

# ---------- faixas de referência (calibradas para render de produto em AgX, sRGB 8 bits) ----------
FAIXAS = dict(
    clip_branco_max=1.5,      # % de pixels com algum canal >= 254 (ignora fundo neutro estourado de propósito)
    clip_preto_max=1.0,       # % de pixels com todos os canais <= 2
    rms_min=0.14, rms_max=0.30,   # desvio padrão da luminância (0..1)
    faixa_min=0.55,           # p99 - p1 da luminância: abaixo disso parece lavado/chapado
    satur_min=0.10,           # saturação média HSV: abaixo disso "sem cor" (salvo look monocromático intencional)
    satur_max=0.55,           # acima disso "neon de CG"
    sat_extrema_max=8.0,      # % de pixels com S > 0,9 e V > 0,5 (cor gritando)
    colorf_min=15.0,          # Hasler-Süsstrunk: < 15 = "não colorido / levemente"
    colorf_max=90.0,          # > 90 = "extremamente colorido" (pop candy pode passar, luxo não)
    nitidez_min=25.0,         # variância do Laplaciano em meia resolução, 0..255; abaixo = mole (calibrar por cena)
    ruido_max=2.5,            # sigma de ruído (0..255) MEDIDO ANTES DO GRÃO; com grão 0,025 espere ~2 a 3
    chapado_max=45.0,         # % de blocos 16x16 sem variação (desvio < 0,6 nível): fundo digital liso demais
    grade_luz_min=0.035,      # desvio entre as 9 células da grade 3x3: abaixo = luz sem direção
    deltaE_marca_max=5.0,     # CIEDE2000 entre cor de marca pedida e mediana medida
    produto_min=18.0,         # % de ÁREA da máscara: só informação (00 Padrões da casa)
    produto_max=60.0,
    produto_altura_min=20.0,  # altura da caixa da máscara / altura do quadro: plano geral >= 20%
    produto_altura_max=90.0,  # packshot 9:16: 40 a 55% (conferir no plano); acima de 90% encosta nas bordas
    wcag_min=4.5,
)

# zonas seguras 1080x1920 (px): topo, baixo, esquerda, direita  (fontes no capítulo 08)
ZONAS = dict(
    reels=(269, 672, 65, 65),     # Meta: 14% topo, 35% baixo, 6% lados
    tiktok=(130, 484, 44, 140),
    shorts=(380, 380, 60, 120),
)

# ---------------- utilidades de cor ----------------
def srgb_to_linear(c):
    c = np.asarray(c, dtype=np.float64)
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)

def luminancia_rel(rgb01):
    """Luminância relativa WCAG (entrada sRGB 0..1)."""
    lin = srgb_to_linear(rgb01)
    return 0.2126 * lin[..., 0] + 0.7152 * lin[..., 1] + 0.0722 * lin[..., 2]

def razao_wcag(c1, c2):
    l1, l2 = float(luminancia_rel(np.array(c1))), float(luminancia_rel(np.array(c2)))
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)

def hex_rgb01(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float64) / 255.0

def rgb01_to_lab(rgb):
    lin = srgb_to_linear(rgb)
    M = np.array([[0.4124564, 0.3575761, 0.1804375],
                  [0.2126729, 0.7151522, 0.0721750],
                  [0.0193339, 0.1191920, 0.9503041]])
    xyz = lin @ M.T
    xyz = xyz / np.array([0.95047, 1.0, 1.08883])
    e = 216 / 24389; k = 24389 / 27
    f = np.where(xyz > e, np.cbrt(xyz), (k * xyz + 16) / 116)
    L = 116 * f[..., 1] - 16
    a = 500 * (f[..., 0] - f[..., 1])
    b = 200 * (f[..., 1] - f[..., 2])
    return np.stack([L, a, b], axis=-1)

def ciede2000(lab1, lab2):
    L1, a1, b1 = np.moveaxis(np.asarray(lab1, float), -1, 0)
    L2, a2, b2 = np.moveaxis(np.asarray(lab2, float), -1, 0)
    C1 = np.hypot(a1, b1); C2 = np.hypot(a2, b2)
    Cb = (C1 + C2) / 2
    G = 0.5 * (1 - np.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)))
    a1p, a2p = (1 + G) * a1, (1 + G) * a2
    C1p, C2p = np.hypot(a1p, b1), np.hypot(a2p, b2)
    h1p = np.degrees(np.arctan2(b1, a1p)) % 360
    h2p = np.degrees(np.arctan2(b2, a2p)) % 360
    dLp = L2 - L1; dCp = C2p - C1p
    dh = h2p - h1p
    dh = np.where(C1p * C2p == 0, 0, np.where(dh > 180, dh - 360, np.where(dh < -180, dh + 360, dh)))
    dHp = 2 * np.sqrt(C1p * C2p) * np.sin(np.radians(dh / 2))
    Lbp = (L1 + L2) / 2; Cbp = (C1p + C2p) / 2
    hs = h1p + h2p
    hbp = np.where(C1p * C2p == 0, hs,
                   np.where(np.abs(h1p - h2p) <= 180, hs / 2, np.where(hs < 360, (hs + 360) / 2, (hs - 360) / 2)))
    T = (1 - 0.17 * np.cos(np.radians(hbp - 30)) + 0.24 * np.cos(np.radians(2 * hbp))
         + 0.32 * np.cos(np.radians(3 * hbp + 6)) - 0.20 * np.cos(np.radians(4 * hbp - 63)))
    dth = 30 * np.exp(-((hbp - 275) / 25) ** 2)
    Rc = 2 * np.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7))
    Sl = 1 + 0.015 * (Lbp - 50) ** 2 / np.sqrt(20 + (Lbp - 50) ** 2)
    Sc = 1 + 0.045 * Cbp; Sh = 1 + 0.015 * Cbp * T
    Rt = -np.sin(np.radians(2 * dth)) * Rc
    return np.sqrt((dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh))

def conv3(img, k):
    p = np.pad(img, 1, mode="edge")
    h, w = img.shape
    out = np.zeros_like(img)
    for dy in range(3):
        for dx in range(3):
            if k[dy][dx]:
                out += k[dy][dx] * p[dy:dy + h, dx:dx + w]
    return out

# ---------------- métricas ----------------
def carregar(caminho):
    im = Image.open(caminho)
    alpha = None
    if im.mode in ("RGBA", "LA"):
        alpha = np.asarray(im.getchannel("A"), dtype=np.float64) / 255.0
    rgb8 = np.asarray(im.convert("RGB"), dtype=np.uint8)
    return rgb8, alpha

def medir(rgb8, alpha=None, marca=None, mascara=None, texto=None, plataforma=None):
    rgb = rgb8.astype(np.float64) / 255.0
    h, w, _ = rgb.shape
    Y = luminancia_rel(rgb)                       # luminância linear (WCAG)
    Yp = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]   # luma em sRGB (perceptual)
    r = {}
    r["res"] = f"{w}x{h}"
    r["clip_branco_%"] = 100.0 * np.mean(rgb8.max(axis=2) >= 254)
    r["clip_branco_total_%"] = 100.0 * np.mean(rgb8.min(axis=2) >= 254)
    r["clip_preto_%"] = 100.0 * np.mean(rgb8.max(axis=2) <= 2)
    p1, p50, p99 = np.percentile(Yp, [1, 50, 99])
    r["luma_media"] = float(Yp.mean()); r["luma_p1"] = float(p1); r["luma_p50"] = float(p50); r["luma_p99"] = float(p99)
    r["faixa_p1_p99"] = float(p99 - p1)
    r["contraste_rms"] = float(Yp.std())
    # saturação HSV
    mx, mn = rgb.max(axis=2), rgb.min(axis=2)
    S = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    r["saturacao_media"] = float(S.mean())
    r["sat_extrema_%"] = 100.0 * float(np.mean((S > 0.9) & (mx > 0.5)))
    # colorfulness Hasler-Süsstrunk (0..255)
    R, G, B = [rgb8[..., i].astype(np.float64) for i in range(3)]
    rg = R - G; yb = 0.5 * (R + G) - B
    r["colorfulness_HS"] = float(np.hypot(rg.std(), yb.std()) + 0.3 * np.hypot(rg.mean(), yb.mean()))
    # nitidez: variância do Laplaciano
    g255 = Yp * 255
    lap = conv3(g255, [[0, 1, 0], [1, -4, 1], [0, 1, 0]])
    r["nitidez_varlap"] = float(lap.var())
    # mesma medida em meia resolução (média 2x2): tira o peso do grão e do ruído fino
    hh, ww = (h // 2) * 2, (w // 2) * 2
    g2 = g255[:hh, :ww].reshape(hh // 2, 2, ww // 2, 2).mean(axis=(1, 3))
    r["nitidez_varlap_meia"] = float(conv3(g2, [[0, 1, 0], [1, -4, 1], [0, 1, 0]]).var())
    # ruído: Immerkær
    Mk = [[1, -2, 1], [-2, 4, -2], [1, -2, 1]]
    conv = np.abs(conv3(g255, Mk))[1:-1, 1:-1]
    r["ruido_sigma"] = float(math.sqrt(math.pi / 2) * conv.sum() / (6 * (w - 2) * (h - 2)))
    # vagalumes (fireflies): pixel isolado muito acima da mediana dos 8 vizinhos
    pad = np.pad(Yp, 1, mode="edge")
    viz = np.stack([pad[dy:dy + h, dx:dx + w] for dy in range(3) for dx in range(3) if not (dy == 1 and dx == 1)])
    med_viz = np.median(viz, axis=0)
    vag = (Yp - med_viz > 0.35) & (viz.max(axis=0) < Yp - 0.2)
    r["vagalumes_por_mpx"] = float(vag.sum() / (w * h / 1e6))
    # paleta: picos de matiz (12 faixas de 30 graus), ponderados pela saturação, entre pixels com S > 0,25
    Hh = np.zeros_like(mx)
    d_ = np.maximum(mx - mn, 1e-6)
    R_, G_, B_ = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    Hh = np.where(mx == R_, ((G_ - B_) / d_) % 6, np.where(mx == G_, (B_ - R_) / d_ + 2, (R_ - G_) / d_ + 4)) * 60
    sel = S > 0.25
    if sel.sum() > 100:
        hist, _ = np.histogram(Hh[sel], bins=12, range=(0, 360), weights=S[sel])
        hist = hist / hist.sum()
        r["paleta_familias"] = int((hist > 0.08).sum())
    else:
        r["paleta_familias"] = 0
    # branco com cor: pixels quase brancos (L* > 85, croma < 15) com média a*, b* longe de 0
    lab_all = rgb01_to_lab(rgb)
    croma = np.hypot(lab_all[..., 1], lab_all[..., 2])
    br = (lab_all[..., 0] > 85) & (croma < 15) & (rgb8.max(axis=2) < 254)
    if br.sum() > 200:
        r["branco_dominante_ab"] = [round(float(lab_all[..., 1][br].mean()), 2), round(float(lab_all[..., 2][br].mean()), 2)]
    # chapado: blocos 16x16 sem variação
    bh, bw = h // 16, w // 16
    blocos = g255[:bh * 16, :bw * 16].reshape(bh, 16, bw, 16).std(axis=(1, 3))
    r["chapado_%"] = 100.0 * float(np.mean(blocos < 0.6))
    # grade 3x3: direção de luz e vinheta
    cel = np.array([[Yp[i * h // 3:(i + 1) * h // 3, j * w // 3:(j + 1) * w // 3].mean() for j in range(3)] for i in range(3)])
    r["grade_3x3"] = np.round(cel, 3).tolist()
    r["grade_desvio"] = float(cel.std())
    r["vinheta_centro_menos_quinas"] = float(cel[1, 1] - np.mean([cel[0, 0], cel[0, 2], cel[2, 0], cel[2, 2]]))
    # horizonte / verticais: orientação dominante de bordas fortes
    gx = conv3(g255, [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])
    gy = conv3(g255, [[-1, -2, -1], [0, 0, 0], [1, 2, 1]])
    mag = np.hypot(gx, gy)
    forte = mag > np.percentile(mag, 98)
    ang = (np.degrees(np.arctan2(gy, gx))[forte] + 180) % 180    # direção do gradiente
    perto_h = ang[(np.abs(ang - 90) < 6)] - 90                       # bordas quase horizontais
    perto_v = np.where(ang[(ang < 6) | (ang > 174)] > 90, ang[(ang < 6) | (ang > 174)] - 180, ang[(ang < 6) | (ang > 174)])
    r["inclinacao_bordas_horiz_graus"] = float(np.median(perto_h)) if perto_h.size > 50 else None
    r["inclinacao_bordas_vert_graus"] = float(np.median(perto_v)) if perto_v.size > 50 else None
    # cobertura do produto
    m = None
    if mascara is not None and mascara.shape[:2] != (h, w):
        r["aviso"] = f"máscara {mascara.shape[1]}x{mascara.shape[0]} ignorada: imagem é {w}x{h}"
        mascara = None
    if mascara is not None:
        m = mascara > 0.5
    elif alpha is not None and alpha.min() < 0.99:
        m = alpha > 0.5
    if m is not None and m.any():
        ys, xs = np.nonzero(m)
        r["produto_%"] = 100.0 * float(m.mean())
        r["produto_altura_%"] = 100.0 * float(ys.max() - ys.min() + 1) / h
        r["produto_bbox"] = [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]
        r["produto_centro_rel"] = [round(float(xs.mean()) / w, 3), round(float(ys.mean()) / h, 3)]
        r["produto_luma_vs_fundo"] = float(Yp[m].mean() - Yp[~m].mean()) if (~m).any() else None
        # composição: distância do centro do produto ao ponto de terço mais próximo (fração da diagonal)
        cx, cy = xs.mean() / w, ys.mean() / h
        tercos = [(a, b) for a in (1 / 3, 2 / 3) for b in (1 / 3, 2 / 3)]
        r["dist_terco"] = round(float(min(math.hypot(cx - a, cy - b) for a, b in tercos)), 3)
        r["dist_centro"] = round(float(math.hypot(cx - 0.5, cy - 0.5)), 3)
        # fundo: saturação e variação fora do produto (fundo cinza padrão = pouca cor e pouca variação)
        if (~m).any():
            r["fundo_saturacao"] = float(S[~m].mean())
            r["fundo_desvio_luma"] = float(Yp[~m].std())
        # branco com cor dentro do produto (produto branco ou com partes brancas)
        lab_p = rgb01_to_lab(rgb[m]); cr = np.hypot(lab_p[:, 1], lab_p[:, 2])
        selb = (lab_p[:, 0] > 85) & (cr < 15)
        if selb.sum() > 50:
            r["branco_produto_ab"] = [round(float(lab_p[selb, 1].mean()), 2), round(float(lab_p[selb, 2].mean()), 2)]
        # sombra de contato: faixa logo abaixo do produto vs faixa mais abaixo (só vale se o produto pousa no chão)
        x1, y1, x2, y2 = r["produto_bbox"]
        a0, a1 = y2 + 1, min(h, y2 + 1 + max(2, int(0.02 * h)))
        b0, b1 = min(h, y2 + int(0.06 * h)), min(h, y2 + int(0.10 * h))
        if a1 > a0 and b1 > b0:
            faixa_a = Yp[a0:a1, x1:x2 + 1][~m[a0:a1, x1:x2 + 1]]
            faixa_b = Yp[b0:b1, x1:x2 + 1][~m[b0:b1, x1:x2 + 1]]
            if faixa_a.size > 20 and faixa_b.size > 20 and faixa_b.mean() > 1e-4:
                r["sombra_contato_razao"] = float(faixa_a.mean() / faixa_b.mean())
    # cor de marca
    if marca:
        alvo = rgb01_to_lab(hex_rgb01(marca))
        lab = rgb01_to_lab(rgb.reshape(-1, 3))
        if m is not None and m.any():
            amostra = lab[m.reshape(-1)]
        else:
            dE = ciede2000(lab, np.broadcast_to(alvo, lab.shape))
            amostra = lab[dE < 20]
        if amostra.shape[0] > 30:
            med = np.median(amostra, axis=0)
            r["marca_deltaE2000_mediana"] = float(ciede2000(med, alvo))
            r["marca_pixels_proximos_%"] = 100.0 * amostra.shape[0] / lab.shape[0]
        else:
            r["marca_deltaE2000_mediana"] = None
            r["marca_pixels_proximos_%"] = 0.0
    # contraste do texto (caixa x,y,w,h): 10% mais claros vs 10% mais escuros
    if texto:
        x, y, tw, th = texto
        reg = rgb[y:y + th, x:x + tw].reshape(-1, 3)
        Lr = luminancia_rel(reg)
        o = np.argsort(Lr)
        n = max(1, len(o) // 10)
        escuro = np.median(reg[o[:n]], axis=0); claro = np.median(reg[o[-n:]], axis=0)
        r["texto_wcag"] = float(razao_wcag(claro, escuro))
        if plataforma and w == 1080 and h == 1920:
            t, b, le, d = ZONAS[plataforma]
            r["texto_dentro_zona_segura"] = bool(x >= le and y >= t and x + tw <= w - d and y + th <= h - b)
    return r

def alertas(r):
    F = FAIXAS; a = []
    if r["clip_branco_%"] > F["clip_branco_max"]: a.append(f"ESTOURADO: {r['clip_branco_%']:.2f}% com canal em 254+")
    if r["clip_preto_%"] > F["clip_preto_max"]: a.append(f"AFUNDADO: {r['clip_preto_%']:.2f}% em preto absoluto")
    if r["contraste_rms"] < F["rms_min"]: a.append(f"LAVADO/CHAPADO: contraste RMS {r['contraste_rms']:.3f} < {F['rms_min']}")
    if r["contraste_rms"] > F["rms_max"]: a.append(f"DURO: contraste RMS {r['contraste_rms']:.3f} > {F['rms_max']}")
    if r["faixa_p1_p99"] < F["faixa_min"]: a.append(f"SEM PRETO NEM BRANCO: faixa p1..p99 {r['faixa_p1_p99']:.2f}")
    if r["saturacao_media"] < F["satur_min"]: a.append(f"SEM COR: saturação média {r['saturacao_media']:.3f}")
    if r["saturacao_media"] > F["satur_max"]: a.append(f"COR GRITANDO: saturação média {r['saturacao_media']:.3f}")
    if r["sat_extrema_%"] > F["sat_extrema_max"]: a.append(f"NEON DE CG: {r['sat_extrema_%']:.1f}% pixels com S>0,9")
    if r["colorfulness_HS"] < F["colorf_min"]: a.append(f"POUCA COR (Hasler) {r['colorfulness_HS']:.1f}")
    if r["colorfulness_HS"] > F["colorf_max"]: a.append(f"COR DEMAIS (Hasler) {r['colorfulness_HS']:.1f}")
    if r["nitidez_varlap_meia"] < F["nitidez_min"]: a.append(f"MOLE: variância do Laplaciano (meia res.) {r['nitidez_varlap_meia']:.1f}")
    if r["ruido_sigma"] > F["ruido_max"]: a.append(f"RUIDOSO: sigma {r['ruido_sigma']:.2f}")
    if r["chapado_%"] > F["chapado_max"]: a.append(f"FUNDO DIGITAL LISO: {r['chapado_%']:.0f}% de blocos sem variação")
    if r["grade_desvio"] < F["grade_luz_min"]: a.append(f"LUZ SEM DIREÇÃO: desvio da grade 3x3 {r['grade_desvio']:.3f}")
    for k in ("inclinacao_bordas_horiz_graus", "inclinacao_bordas_vert_graus"):
        v = r.get(k)
        if v is not None and 0.4 < abs(v) < 4: a.append(f"TORTO? {k} = {v:.1f} graus (conferir se é intencional)")
    if r.get("marca_deltaE2000_mediana") is not None and r["marca_deltaE2000_mediana"] > F["deltaE_marca_max"]:
        a.append(f"COR DE MARCA FORA: ΔE2000 {r['marca_deltaE2000_mediana']:.1f}")
    if "produto_altura_%" in r:   # medida por altura; produto_% (área) fica só como informação
        if r["produto_altura_%"] < F["produto_altura_min"]: a.append(f"PRODUTO PEQUENO: {r['produto_altura_%']:.1f}% da altura do quadro")
        if r["produto_altura_%"] > F["produto_altura_max"]: a.append(f"PRODUTO ESPREMIDO: {r['produto_altura_%']:.1f}% da altura do quadro")
    if r.get("vagalumes_por_mpx", 0) > 20: a.append(f"VAGALUMES: {r['vagalumes_por_mpx']:.0f} por megapixel")
    if r.get("paleta_familias", 0) > 4: a.append(f"PALETA SEM HIERARQUIA: {r['paleta_familias']} famílias de matiz com > 8%")
    if r.get("branco_produto_ab") and math.hypot(*r["branco_produto_ab"]) > 4:
        a.append(f"BRANCO DO PRODUTO COM COR? a*,b* médios {r['branco_produto_ab']} (só vale se o produto tem branco)")
    if r.get("fundo_saturacao") is not None and r["fundo_saturacao"] < 0.04 and r.get("fundo_desvio_luma", 1) < 0.06:
        a.append(f"FUNDO CINZA PADRÃO: saturação {r['fundo_saturacao']:.3f}, desvio {r['fundo_desvio_luma']:.3f}")
    if r.get("sombra_contato_razao") is not None and r["sombra_contato_razao"] > 0.92:
        a.append(f"SEM SOMBRA DE CONTATO? razão {r['sombra_contato_razao']:.2f} (só vale se o produto pousa)")
    if r.get("dist_centro") is not None and r["dist_centro"] < 0.03:
        a.append("COMPOSIÇÃO CENTRAL (ok se for intencional; varie entre planos)")
    if r.get("texto_wcag") is not None and r["texto_wcag"] < F["wcag_min"]: a.append(f"TEXTO ILEGÍVEL: contraste {r['texto_wcag']:.2f}:1")
    if r.get("texto_dentro_zona_segura") is False: a.append("TEXTO FORA DA ZONA SEGURA")
    return a

# ---------------- folha de contato e recortes ----------------
def folha_de_contato(caminhos, saida, colunas=3, largura=360):
    ims = [Image.open(c).convert("RGB") for c in caminhos]
    esc = [im.resize((largura, round(im.height * largura / im.width))) for im in ims]
    altura = max(im.height for im in esc)
    linhas = math.ceil(len(esc) / colunas)
    folha = Image.new("RGB", (colunas * largura + (colunas + 1) * 8, linhas * altura + (linhas + 1) * 8), (24, 24, 24))
    for i, im in enumerate(esc):
        folha.paste(im, (8 + (i % colunas) * (largura + 8), 8 + (i // colunas) * (altura + 8)))
    folha.save(saida, quality=92)
    return saida

def recortes_200(caminho, pasta, n=4, lado=256):
    """Recorta as regiões de maior detalhe (variância do Laplaciano) e amplia 2x sem suavizar."""
    os.makedirs(pasta, exist_ok=True)
    im = Image.open(caminho).convert("RGB")
    g = np.asarray(im.convert("L"), dtype=np.float64)
    lap = np.abs(conv3(g, [[0, 1, 0], [1, -4, 1], [0, 1, 0]]))
    h, w = g.shape
    cands = []
    for y in range(0, h - lado, lado // 2):
        for x in range(0, w - lado, lado // 2):
            cands.append((lap[y:y + lado, x:x + lado].mean(), x, y))
    cands.sort(reverse=True)
    saidas, usados = [], []
    for v, x, y in cands:
        if any(abs(x - ux) < lado and abs(y - uy) < lado for ux, uy in usados):
            continue
        usados.append((x, y))
        c = im.crop((x, y, x + lado, y + lado)).resize((lado * 2, lado * 2), Image.NEAREST)
        s = os.path.join(pasta, f"recorte_{len(saidas)}_{x}_{y}.png"); c.save(s); saidas.append(s)
        if len(saidas) >= n:
            break
    return saidas

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("imagens", nargs="*")
    ap.add_argument("--marca"); ap.add_argument("--mascara")
    ap.add_argument("--texto"); ap.add_argument("--plataforma", choices=list(ZONAS))
    ap.add_argument("--json"); ap.add_argument("--folha"); ap.add_argument("--recortes")
    ap.add_argument("--sequencia", action="store_true", help="trata as imagens como quadros seguidos e mede cintilação")
    a = ap.parse_args()
    if a.folha:
        print(folha_de_contato(a.imagens, a.folha)); return
    if a.recortes:
        print(recortes_200(a.imagens[0], a.recortes)); return
    texto = tuple(int(v) for v in a.texto.split(",")) if a.texto else None
    masc = None
    if a.mascara:
        mi = Image.open(a.mascara)
        # máscara com alfa (render com film_transparent e só o produto visível): usa o alfa; senão, a luminância
        mi = mi.getchannel("A") if mi.mode in ("RGBA", "LA") else mi.convert("L")
        masc = np.asarray(mi, dtype=np.float64) / 255.0
    tudo = {}
    for c in a.imagens:
        rgb8, alpha = carregar(c)
        r = medir(rgb8, alpha, a.marca, masc, texto, a.plataforma)
        r["alertas"] = alertas(r)
        tudo[c] = r
        print(f"\n== {os.path.basename(c)} ({r['res']})")
        for k, v in r.items():
            if k in ("alertas", "grade_3x3", "res"): continue
            print(f"  {k:32s} {v:.3f}" if isinstance(v, float) else f"  {k:32s} {v}")
        print("  grade_3x3 (luma média por célula):", r["grade_3x3"])
        print("  ALERTAS:", r["alertas"] if r["alertas"] else "nenhum")
    if a.sequencia and len(a.imagens) > 1:
        lum = [tudo[c]["luma_media"] for c in a.imagens]
        saltos = [abs(lum[i] - lum[i - 1]) for i in range(1, len(lum))]
        tudo["_sequencia"] = dict(luma=lum, salto_max=max(saltos),
                                  cintilacao=[a.imagens[i] for i in range(1, len(lum)) if saltos[i - 1] > 0.02])
        print("\n== SEQUÊNCIA: salto máximo de luma entre quadros", round(max(saltos), 4),
              "| CINTILAÇÃO em:", tudo["_sequencia"]["cintilacao"] or "nenhum")
    if a.json:
        json.dump(tudo, open(a.json, "w"), indent=1, ensure_ascii=False)

if __name__ == "__main__":
    main()
