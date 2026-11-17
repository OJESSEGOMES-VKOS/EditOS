# Blender 5.2 | status: confirmado por execucao (Python puro) | fonte: capitulo 02 Mundos Visuais
# Gera /home/claude/mundos.json e /home/claude/base/02-mundos-visuais.md a partir de mundos_dados.py
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mundos_dados import MUNDOS, MATRIZ, CATEGORIAS
from rotacao_mundos import TRANSICAO, familia_cor

JSON_OUT = "/home/claude/mundos.json"
MD_OUT = "/home/claude/base/02-mundos-visuais.md"

CHAVES = ["id", "nome", "conceito", "quando_usar", "status", "paleta", "nota_paleta", "cor", "materiais", "luz",
          "nota_luz", "camera", "movimento", "transicao", "tipografia", "som", "funciona_em", "evitar_em",
          "erro_classico", "referencias"]

def gerar_json():
    saida = []
    for m in MUNDOS:
        o = {k: m[k] for k in CHAVES}
        o["transicao_chave"] = TRANSICAO[m["id"]]
        o["familia_acento"] = familia_cor(m["paleta"]["acento"])
        o["matriz"] = {cat: ["evitar", "com ajuste", "funciona"][v] for cat, v in zip(CATEGORIAS, MATRIZ[m["id"]])}
        saida.append(o)
    with open(JSON_OUT, "w", encoding="utf-8") as f:
        json.dump(saida, f, ensure_ascii=False, indent=2)
    return saida

LOOK_PORQUE = {
 "AgX - Medium High Contrast": "contraste de produto sem esmagar sombra; é o padrão seguro da casa",
 "AgX - High Contrast": "pretos mais fundos e brilhos mais secos; pede luz de contorno forte para não afundar",
 "AgX - Punchy": "satura e aumenta contraste; ótimo para cor de marca forte, perigoso em pele e madeira",
 "AgX - Base Contrast": "curva neutra; preserva pastel e luz natural sem endurecer",
}

def fmt(v):
    if isinstance(v, float):
        s = f"{v:.3f}".rstrip("0").rstrip(".")
        return s.replace(".", ",")
    return str(v)

def ficha(i, m):
    p = m["paleta"]; c = m["cor"]; cam = m["camera"]; mov = m["movimento"]
    o = []
    o.append(f"### {i}. {m['nome']}  \n`id: {m['id']}` · status: {m['status']}\n")
    o.append(f"**Conceito.** {m['conceito']}\n")
    o.append(f"**Quando usar.** {m['quando_usar']}\n")
    o.append("**Paleta 60/30/10**\n")
    o.append("| Papel | Hex | Uso |\n|---|---|---|")
    o.append(f"| Fundo (60%) | `{p['fundo']}` | parede, piso, céu, área vazia |")
    o.append(f"| Apoio (30%) | `{p['apoio']}` | objetos secundários, base, sombra colorida |")
    o.append(f"| Acento (10%) | `{p['acento']}` | herói, palavra-chave, botão, logo |")
    o.append(f"| Extras | {', '.join('`'+x+'`' for x in p['extras'])} | luz alta, sombra profunda, variação |\n")
    o.append(f"{m['nota_paleta']}\n")
    o.append(f"**Cor.** View Transform `{c['view_transform']}`, Look `{c['look']}`, Exposure {fmt(c['exposicao'])}. "
             f"Por quê: {LOOK_PORQUE[c['look']]}.\n")
    o.append("**Materiais (Principled BSDF, Blender 5.2)**\n")
    o.append("| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |\n|---|---|---|---|---|---|---|---|")
    for mt in m["materiais"]:
        o.append(f"| {mt['nome']} | `{mt['base_color']}` | {fmt(mt['roughness'])} | {fmt(mt['metallic'])} | {fmt(mt['coat_weight'])} | "
                 f"{fmt(mt['transmission_weight'])} | {fmt(mt['ior'])} | {mt['outros']} |")
    o.append("")
    o.append("**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)\n")
    o.append("| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |\n|---|---|---|---|---|---|---|---|")
    for l in m["luz"]:
        passivo = l["energia_rel"] == 0 and l["temperatura_k"] == 0
        k = "não emite" if passivo else (f"{l['temperatura_k']} K" if l["temperatura_k"] else "cor RGB")
        sp = "não se aplica" if (passivo or l["spread_graus"] == 0) else f"{l['spread_graus']}°"
        o.append(f"| {l['nome']} | {l['tipo']} | {fmt(l['tamanho_m'])} | {l['azimute_graus']}° | {l['elevacao_graus']}° | "
                 f"{fmt(l['energia_rel'])} | {k} | {sp} |")
    o.append("")
    o.append(f"{m['nota_luz']}\n")
    o.append(f"- **Câmera:** lentes {', '.join(str(x) for x in cam['lentes_mm'])} mm, f/{fmt(cam['fstop'])}. {cam['movimentos']}")
    o.append(f"- **Assinatura de movimento:** curva: {mov['curva']}. Timing a 30 fps: {mov['timing_quadros_30fps']}. Overshoot: {mov['overshoot']}")
    o.append(f"- **Transição característica** (`{TRANSICAO[m['id']]}`): {m['transicao']}")
    o.append(f"- **Tipografia:** {m['tipografia']}")
    o.append(f"- **Trilha e som:** {m['som']}")
    o.append(f"- **Funciona em:** {m['funciona_em']}")
    o.append(f"- **Não funciona em:** {m['evitar_em']}")
    o.append(f"- **Erro clássico:** {m['erro_classico']}\n")
    o.append("**Referências:** " + "; ".join(f"[{r['titulo']}]({r['url']})" for r in m["referencias"]) + ".\n")
    return "\n".join(o)

SIMB = {2: "✓", 1: "~", 0: "✗"}

def matriz_md():
    o = ["| Mundo | " + " | ".join(CATEGORIAS) + " |", "|---|" + "---|" * len(CATEGORIAS)]
    nomes = {m["id"]: m["nome"] for m in MUNDOS}
    for mid, linha in MATRIZ.items():
        o.append(f"| {nomes[mid]} | " + " | ".join(SIMB[v] for v in linha) + " |")
    return "\n".join(o)

INTRO = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "capitulo_textos.md"), encoding="utf-8").read()

def gerar_md():
    partes = INTRO.split("<<FICHAS>>")
    antes, depois = partes[0], partes[1]
    fichas = "\n".join(ficha(i + 1, m) for i, m in enumerate(MUNDOS))
    depois = depois.replace("<<MATRIZ>>", matriz_md())
    texto = antes + fichas + depois
    with open(MD_OUT, "w", encoding="utf-8") as f:
        f.write(texto)
    return texto

if __name__ == "__main__":
    js = gerar_json(); md = gerar_md()
    palavras = len(re.findall(r"\w+", md))
    print("mundos:", len(js), "| palavras no md:", palavras,
          "| travessoes:", md.count("—") + md.count("–"),
          "| travessoes json:", json.dumps(js, ensure_ascii=False).count("—") + json.dumps(js, ensure_ascii=False).count("–"))
