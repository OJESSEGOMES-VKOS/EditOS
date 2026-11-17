# Blender 5.2 | status: confirmado por execucao (Python puro, sem bpy) | fonte: capitulo 02 Mundos Visuais, secao "A regra de rotacao"
# Sorteio ponderado de mundo visual + registro em historico_mundos.json.
# Regra: nenhum dos 4 eixos (mundo, lente dominante, familia de paleta, transicao) repete entre filmes consecutivos.
# Uso:
#   python rotacao_mundos.py sortear --categoria app [--historico historico_mundos.json] [--semente 7]
#   python rotacao_mundos.py registrar --projeto "Delivery X Reels" --categoria app --mundo vidro_cromo \
#        --lente 85 --acento "#7CE0FF" --transicao refracao [--acento-mundo neon_noturno] [--formato 9:16] [--duracao 20]
import argparse, colorsys, datetime, json, os, random, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mundos_dados import MUNDOS, MATRIZ, CATEGORIAS

POR_ID = {m["id"]: m for m in MUNDOS}

# transicao caracteristica de cada mundo (chave curta, e o eixo 4)
TRANSICAO = {
 "estudio_premium": "match_cut_giro", "luxo_escuro": "fusao_escuro", "pop_candy": "cor_cheia_pop",
 "diorama_isometrico": "giro_base", "argila": "morph", "vidro_cromo": "wipe_refrativo",
 "organico_liquido": "wipe_liquido", "brutalista_tech": "corte_seco_grade", "macro_cinematografico": "desfoque",
 "papel_recorte": "wipe_papel", "retrofuturo": "glint", "neon_noturno": "flash_neon",
 "natureza_sol": "passagem_sombra", "holografico": "varredura_cor", "editorial_revista": "virar_pagina",
 "tatil_textil": "wipe_tecido", "fitas_ribbons": "wipe_fita", "arquitetonico_luz_dura": "wipe_luz",
 "color_block": "troca_cor",
}

def familia_cor(hex_):
    """Familia de matiz do acento em 12 fatias de 30 graus, ou 'neutro' se saturacao < 0,18."""
    h = hex_.lstrip("#"); r, g, b = (int(h[i:i+2], 16) / 255 for i in (0, 2, 4))
    hh, ll, ss = colorsys.rgb_to_hls(r, g, b)
    if ss < 0.18 or ll > 0.92 or ll < 0.08:
        return "neutro"
    nomes = ["vermelho", "laranja", "amarelo", "lima", "verde", "verde-agua",
             "ciano", "azul", "anil", "violeta", "magenta", "rosa"]
    return nomes[int(((hh * 360) + 15) % 360 // 30)]

def carregar(caminho):
    if os.path.exists(caminho):
        with open(caminho, encoding="utf-8") as f:
            return json.load(f)
    return {"versao": 1, "projetos": []}

def sortear(categoria, historico, semente=None):
    rnd = random.Random(semente)
    col = CATEGORIAS.index(categoria)
    projetos = historico["projetos"]
    ult = projetos[-1] if projetos else None
    recentes = [p["mundo_base"] for p in projetos[-5:]]
    candidatos = []
    for m in MUNDOS:
        nota = MATRIZ[m["id"]][col]
        if nota == 0:
            continue                                  # matriz diz evitar
        peso = {2: 3.0, 1: 1.0}[nota]
        if ult:
            if m["id"] == ult["mundo_base"] or m["id"] == ult.get("mundo_acento"):
                continue                              # eixo 1: mundo
            if familia_cor(m["paleta"]["acento"]) == ult["paleta"]["familia"]:
                continue                              # eixo 3: familia de paleta
            if TRANSICAO[m["id"]] == ult["transicao"]:
                continue                              # eixo 4: transicao
            lentes = [l for l in m["camera"]["lentes_mm"] if l != ult["lente_dominante_mm"]]
            if not lentes:
                continue                              # eixo 2: lente
        if m["id"] in recentes:
            peso *= 0.3                               # usado nos ultimos 5: menos chance
        candidatos.append((m, peso))
    if not candidatos:
        raise SystemExit("Nenhum mundo passa na regra. Use um mundo nota 1 com ajuste ou troque a paleta do acento.")
    total = sum(p for _, p in candidatos); x = rnd.uniform(0, total); acc = 0
    for m, p in candidatos:
        acc += p
        if x <= acc:
            escolhido = m; break
    lentes = escolhido["camera"]["lentes_mm"]
    if ult:
        lentes = [l for l in lentes if l != ult["lente_dominante_mm"]]
    return {
        "mundo_base": escolhido["id"],
        "lente_dominante_mm": rnd.choice(lentes),
        "paleta": {"fundo": escolhido["paleta"]["fundo"], "acento": escolhido["paleta"]["acento"],
                   "familia": familia_cor(escolhido["paleta"]["acento"])},
        "transicao": TRANSICAO[escolhido["id"]],
        "look": escolhido["cor"]["look"],
        "candidatos": [(m["id"], round(p, 2)) for m, p in candidatos],
    }

def validar_consecutivo(a, b):
    """Retorna a lista de eixos repetidos entre dois registros (vazia = ok)."""
    rep = []
    if a["mundo_base"] == b["mundo_base"]: rep.append("mundo")
    if a["lente_dominante_mm"] == b["lente_dominante_mm"]: rep.append("lente")
    if a["paleta"]["familia"] == b["paleta"]["familia"]: rep.append("paleta")
    if a["transicao"] == b["transicao"]: rep.append("transicao")
    return rep

def registrar(caminho, reg):
    hist = carregar(caminho)
    if hist["projetos"]:
        rep = validar_consecutivo(hist["projetos"][-1], reg)
        if rep:
            raise SystemExit(f"Recusado: repete {', '.join(rep)} em relacao ao filme anterior.")
    hist["projetos"].append(reg)
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(hist, f, ensure_ascii=False, indent=2)
    return hist

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("acao", choices=["sortear", "registrar"])
    ap.add_argument("--historico", default="historico_mundos.json")
    ap.add_argument("--categoria", required=True, choices=CATEGORIAS)
    ap.add_argument("--semente", type=int)
    ap.add_argument("--projeto"); ap.add_argument("--mundo"); ap.add_argument("--acento-mundo")
    ap.add_argument("--lente", type=int); ap.add_argument("--acento"); ap.add_argument("--transicao")
    ap.add_argument("--formato", default="9:16"); ap.add_argument("--duracao", type=int, default=15)
    a = ap.parse_args()
    if a.acao == "sortear":
        print(json.dumps(sortear(a.categoria, carregar(a.historico), a.semente), ensure_ascii=False, indent=2))
    else:
        m = POR_ID[a.mundo]
        reg = {"projeto": a.projeto, "data": datetime.date.today().isoformat(), "categoria": a.categoria,
               "mundo_base": a.mundo, "mundo_acento": a.acento_mundo,
               "lente_dominante_mm": a.lente or m["camera"]["lentes_mm"][0],
               "paleta": {"fundo": m["paleta"]["fundo"], "acento": a.acento or m["paleta"]["acento"],
                          "familia": familia_cor(a.acento or m["paleta"]["acento"])},
               "transicao": a.transicao or TRANSICAO[a.mundo], "look": m["cor"]["look"],
               "formato": a.formato, "duracao_s": a.duracao}
        registrar(a.historico, reg); print("registrado:", json.dumps(reg, ensure_ascii=False))
