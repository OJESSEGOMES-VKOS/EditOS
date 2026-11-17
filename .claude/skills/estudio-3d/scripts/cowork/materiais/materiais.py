# Blender 5.2 | status: confirmado por sonda (nomes de entradas e nós no bpy 5.2.2) e testado em render Cycles CPU na nuvem | fonte: manual Blender 5.2 (Principled BSDF), physicallybased.info (cores de metal e IOR), capítulo 06-materiais.md
"""
Biblioteca de materiais do estúdio (Blender 5.2).

Uso dentro de um script de cena:
    import sys; sys.path.append("/home/claude/codigo/materiais")
    import materiais as M
    mat = M.plastico_brilhante("#E8432F")
    obj.data.materials.append(mat)
    M.imperfeicao(mat, amplitude=0.10, escala_mm=8)
    M.chanfrar(obj, largura_mm=1.0)

Convenções:
- Cena em metros, objeto em escala real (celular 71,5 x 147 x 7,8 mm).
- Cores de entrada em hex sRGB da marca; a função converte para linear.
- Toda entrada do Principled é escrita por nome; nome errado levanta KeyError na hora.
"""
import bpy
import math
import warnings

# --------------------------------------------------------------------------
# Tabelas de referência
# --------------------------------------------------------------------------

# Cor linear (Base Color) e cor de borda (Specular Tint) de metais.
# Fonte: https://physicallybased.info (API https://api.physicallybased.info/materials)
METAIS = {
    "aluminio":   ((0.916, 0.923, 0.924), (0.989, 0.989, 0.972)),
    "cromo":      ((0.654, 0.685, 0.701), (0.591, 0.675, 0.703)),
    "ouro":       ((1.000, 0.773, 0.307), (1.000, 0.985, 0.523)),  # 1,059 no site; limitado a 1,0
    "prata":      ((0.991, 0.985, 0.974), (1.000, 1.000, 0.991)),
    "cobre":      ((0.932, 0.623, 0.522), (0.999, 0.900, 0.744)),
    "latao":      ((0.910, 0.778, 0.423), (0.995, 0.974, 0.747)),
    "aco_inox":   ((0.669, 0.639, 0.598), (0.804, 0.791, 0.714)),
    "titanio":    ((0.441, 0.400, 0.361), (0.670, 0.641, 0.520)),
    "ferro":      ((0.530, 0.513, 0.494), (0.612, 0.541, 0.422)),
    "platina":    ((0.765, 0.730, 0.676), (0.873, 0.850, 0.747)),
    "niquel":     ((0.697, 0.641, 0.563), (0.855, 0.805, 0.675)),
}

# IOR de dielétricos. Fonte: physicallybased.info
IOR = {
    "agua": 1.333, "gelo": 1.31, "vidro": 1.52, "acrilico": 1.49, "policarbonato": 1.585,
    "pet": 1.575, "oleo": 1.47, "etanol": 1.362, "mel": 1.504, "diamante": 2.417,
    "safira": 1.768, "quartzo": 1.54, "perfume": 1.36,  # perfume ~ base de etanol
}


# --------------------------------------------------------------------------
# Utilidades
# --------------------------------------------------------------------------

def hex_para_linear(hexcor, alpha=1.0):
    """'#E8432F' -> (r, g, b, a) em linear (curva sRGB oficial)."""
    h = hexcor.lstrip("#")
    srgb = [int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4)]

    def lin(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    return (lin(srgb[0]), lin(srgb[1]), lin(srgb[2]), alpha)


def _cor(c):
    """Aceita hex, tupla de 3 ou de 4."""
    if isinstance(c, str):
        return hex_para_linear(c)
    if len(c) == 3:
        return (c[0], c[1], c[2], 1.0)
    return tuple(c)


def novo_material(nome):
    """Cria (ou recria) um material com Principled BSDF limpo."""
    antigo = bpy.data.materials.get(nome)
    if antigo:
        bpy.data.materials.remove(antigo)
    mat = bpy.data.materials.new(nome)
    if mat.node_tree is None:  # 5.x: materiais sempre usam nós; isto cobre versões antigas
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", DeprecationWarning)
            mat.use_nodes = True
    return mat


def principled(mat):
    for n in mat.node_tree.nodes:
        if n.type == "BSDF_PRINCIPLED":
            return n
    raise RuntimeError("Material sem Principled BSDF: " + mat.name)


def saida(mat):
    for n in mat.node_tree.nodes:
        if n.type == "OUTPUT_MATERIAL":
            return n
    return mat.node_tree.nodes.new("ShaderNodeOutputMaterial")


def ajustar(mat, **valores):
    """ajustar(mat, Roughness=0.3, Coat_Weight=1) -> troca '_' por ' ' no nome da entrada."""
    p = principled(mat)
    for chave, v in valores.items():
        nome = chave.replace("_", " ")
        # Atenção (sonda 5.2.2): p.inputs["Subsurface IOR"] falha quando o método não é
        # Random Walk (Skin), porque a busca por nome ignora soquete indisponível.
        # Por isso a busca é feita por laço, que enxerga todos.
        sock = next((s for s in p.inputs if s.name == nome), None)
        if sock is None:
            raise KeyError("Entrada inexistente no Principled 5.2: '%s'" % nome)
        if sock.type == "RGBA":
            v = _cor(v)
        sock.default_value = v
    return p


def _no(mat, tipo, x=-600, y=0, **props):
    n = mat.node_tree.nodes.new(tipo)
    n.location = (x, y)
    for k, v in props.items():
        setattr(n, k, v)
    return n


def _link(mat, a, b):
    mat.node_tree.links.new(a, b)


def _coord_objeto(mat, x=-1200, y=0):
    tc = _no(mat, "ShaderNodeTexCoord", x, y)
    return tc.outputs["Object"]


# --------------------------------------------------------------------------
# Plásticos
# --------------------------------------------------------------------------

def plastico_brilhante(cor="#E8432F", nome="Plastico_Brilhante"):
    mat = novo_material(nome)
    ajustar(mat, Base_Color=cor, Roughness=0.18, IOR=1.50, Specular_IOR_Level=0.5)
    return mat


def plastico_fosco(cor="#2F6FE8", nome="Plastico_Fosco"):
    mat = novo_material(nome)
    ajustar(mat, Base_Color=cor, Roughness=0.55, IOR=1.50, Specular_IOR_Level=0.45,
            Diffuse_Roughness=0.3)
    return mat


def plastico_soft_touch(cor="#1C1C1E", nome="Plastico_SoftTouch"):
    """Acabamento emborrachado de eletrônico: escuro, aspereza alta, leve sheen."""
    mat = novo_material(nome)
    ajustar(mat, Base_Color=cor, Roughness=0.62, Sheen_Weight=0.15, Sheen_Roughness=0.4)
    return mat


# --------------------------------------------------------------------------
# Metais
# --------------------------------------------------------------------------

def metal(tipo="cromo", roughness=0.08, nome=None):
    cor, borda = METAIS[tipo]
    mat = novo_material(nome or ("Metal_" + tipo))
    ajustar(mat, Base_Color=cor, Specular_Tint=borda, Metallic=1.0, Roughness=roughness)
    return mat


def cromo():
    return metal("cromo", 0.04, "Cromo")


def ouro(roughness=0.18):
    return metal("ouro", roughness, "Ouro")


def metal_escovado(tipo="aco_inox", nome="Metal_Escovado", roughness=0.28,
                   anisotropia=0.8, rotacao=0.0, eixo="Z"):
    """Anisotropia (Cycles) + ruído esticado na aspereza (riscas visíveis em EEVEE também).
    eixo: direção das riscas no espaço do objeto ('X', 'Y' ou 'Z')."""
    mat = novo_material(nome)
    cor, borda = METAIS[tipo]
    p = ajustar(mat, Base_Color=cor, Specular_Tint=borda, Metallic=1.0, Roughness=roughness,
                Anisotropic=anisotropia, Anisotropic_Rotation=rotacao)
    # Tangente radial em torno do eixo escolhido (riscas giram em volta do eixo)
    tg = _no(mat, "ShaderNodeTangent", -400, -500, direction_type="RADIAL", axis=eixo)
    _link(mat, tg.outputs["Tangent"], p.inputs["Tangent"])
    # Riscas: ruído com escala alta num eixo e baixa nos outros
    coord = _coord_objeto(mat)
    mp = _no(mat, "ShaderNodeMapping", -1000, 200)
    escala = {"X": (2.0, 2500.0, 2500.0), "Y": (2500.0, 2.0, 2500.0), "Z": (2500.0, 2500.0, 2.0)}[eixo]
    mp.inputs["Scale"].default_value = escala
    _link(mat, coord, mp.inputs["Vector"])
    nz = _no(mat, "ShaderNodeTexNoise", -800, 200)
    nz.inputs["Scale"].default_value = 1.0
    nz.inputs["Detail"].default_value = 4.0
    _link(mat, mp.outputs["Vector"], nz.inputs["Vector"])
    mr = _no(mat, "ShaderNodeMapRange", -500, 200)
    mr.inputs["To Min"].default_value = roughness - 0.08
    mr.inputs["To Max"].default_value = roughness + 0.08
    _link(mat, nz.outputs["Factor"], mr.inputs["Value"])
    _link(mat, mr.outputs["Result"], p.inputs["Roughness"])
    # Micro relevo das riscas
    bump = _no(mat, "ShaderNodeBump", -300, -200)
    bump.inputs["Strength"].default_value = 0.08
    bump.inputs["Distance"].default_value = 0.0002
    _link(mat, nz.outputs["Factor"], bump.inputs["Height"])
    _link(mat, bump.outputs["Normal"], p.inputs["Normal"])
    return mat


# Cores de alumínio anodizado (aproximações de catálogo, sRGB). Ver capítulo.
ANODIZADO = {
    "grafite": "#3A3B3E", "prata": "#C9CBCC", "azul": "#2E5C9A", "vermelho": "#A3242C",
    "dourado": "#C9A15A", "rosa": "#D9A3A0", "verde": "#3F6B4E", "preto": "#1A1A1C",
}


def aluminio_anodizado(cor="azul", roughness=0.32, nome=None):
    """Anodizado: metal com cor no óxido. Base Color = cor, Specular Tint mais claro."""
    hexcor = ANODIZADO.get(cor, cor)
    base = hex_para_linear(hexcor)
    borda = tuple(min(1.0, 0.5 + 0.5 * c) for c in base[:3])
    mat = novo_material(nome or ("Aluminio_Anodizado_" + str(cor)))
    ajustar(mat, Base_Color=base, Specular_Tint=borda, Metallic=1.0, Roughness=roughness)
    return mat


# --------------------------------------------------------------------------
# Vidros e líquidos
# --------------------------------------------------------------------------

def _config_transparente(mat):
    """Ajustes de EEVEE para refração (ignorados pelo Cycles)."""
    mat.surface_render_method = "DITHERED"
    mat.use_raytrace_refraction = True
    mat.thickness_mode = "SPHERE"


def vidro_limpo(ior=1.52, roughness=0.0, nome="Vidro_Limpo"):
    mat = novo_material(nome)
    ajustar(mat, Base_Color=(1, 1, 1), Transmission_Weight=1.0, Roughness=roughness, IOR=ior)
    _config_transparente(mat)
    return mat


def vidro_fosco(ior=1.52, roughness=0.35, nome="Vidro_Fosco"):
    return vidro_limpo(ior, roughness, nome)


def absorcao(mat, cor="#2E8B57", densidade=40.0):
    """Liga Volume Absorption na saída Volume. Densidade em 1/m (cena em metros).
    Coeficiente efetivo ~ densidade x (1 - cor) por canal [não verificado na fonte do Cycles]."""
    va = _no(mat, "ShaderNodeVolumeAbsorption", -200, -400)
    va.inputs["Color"].default_value = _cor(cor)
    va.inputs["Density"].default_value = densidade
    _link(mat, va.outputs["Volume"], saida(mat).inputs["Volume"])
    return va


def vidro_colorido(cor="#2E8B57", densidade=40.0, ior=1.52, nome="Vidro_Colorido"):
    """Cor pelo volume: borda grossa fica mais escura que face fina, como vidro real."""
    mat = vidro_limpo(ior, 0.0, nome)
    absorcao(mat, cor, densidade)
    return mat


LIQUIDOS = {
    # nome: (ior, cor de absorção hex, densidade 1/m)
    "agua":        (1.333, "#E8F4F8", 2.0),
    "refrigerante": (1.35, "#5A1E0E", 120.0),
    "cerveja":     (1.34, "#E0A23A", 60.0),
    "oleo":        (1.47, "#E8C84A", 30.0),
    "perfume":     (1.36, "#F2B8C6", 25.0),
    "mel":         (1.504, "#D4900A", 80.0),
}


def liquido(tipo="agua", nome=None):
    ior, cor, dens = LIQUIDOS[tipo]
    mat = vidro_limpo(ior, 0.0, nome or ("Liquido_" + tipo))
    absorcao(mat, cor, dens)
    return mat


def gelo(nome="Gelo"):
    """Gelo: IOR 1,31, aspereza com ruído (geada) e leve névoa interna."""
    mat = vidro_limpo(1.31, 0.12, nome)
    p = principled(mat)
    coord = _coord_objeto(mat)
    nz = _no(mat, "ShaderNodeTexNoise", -800, 200)
    nz.inputs["Scale"].default_value = 60.0
    nz.inputs["Detail"].default_value = 8.0
    _link(mat, coord, nz.inputs["Vector"])
    mr = _no(mat, "ShaderNodeMapRange", -500, 200)
    mr.inputs["To Min"].default_value = 0.03
    mr.inputs["To Max"].default_value = 0.30
    _link(mat, nz.outputs["Factor"], mr.inputs["Value"])
    _link(mat, mr.outputs["Result"], p.inputs["Roughness"])
    bump = _no(mat, "ShaderNodeBump", -300, -200)
    bump.inputs["Strength"].default_value = 0.25
    _link(mat, nz.outputs["Factor"], bump.inputs["Height"])
    _link(mat, bump.outputs["Normal"], p.inputs["Normal"])
    vs = _no(mat, "ShaderNodeVolumeScatter", -200, -400)
    vs.inputs["Density"].default_value = 3.0
    vs.inputs["Color"].default_value = (0.85, 0.93, 1.0, 1.0)
    _link(mat, vs.outputs["Volume"], saida(mat).inputs["Volume"])
    return mat


# --------------------------------------------------------------------------
# Dielétricos diversos
# --------------------------------------------------------------------------

def borracha(cor="#1E1E1E", nome="Borracha"):
    mat = novo_material(nome)
    ajustar(mat, Base_Color=cor, Roughness=0.75, Specular_IOR_Level=0.35, IOR=1.52,
            Sheen_Weight=0.1, Sheen_Roughness=0.5)
    return mat


def tecido(cor="#5B3A8C", nome="Tecido"):
    mat = novo_material(nome)
    ajustar(mat, Base_Color=cor, Roughness=0.85, Specular_IOR_Level=0.25,
            Sheen_Weight=1.0, Sheen_Roughness=0.35, Sheen_Tint=(1, 1, 1),
            Diffuse_Roughness=0.6)
    # Trama: ondas cruzadas bem finas como relevo
    p = principled(mat)
    coord = _no(mat, "ShaderNodeTexCoord", -1200, 0).outputs["UV"]
    w1 = _no(mat, "ShaderNodeTexWave", -800, 100)
    w1.inputs["Scale"].default_value = 180.0
    w2 = _no(mat, "ShaderNodeTexWave", -800, -150, bands_direction="Y")
    w2.inputs["Scale"].default_value = 180.0
    _link(mat, coord, w1.inputs["Vector"])
    _link(mat, coord, w2.inputs["Vector"])
    mx = _no(mat, "ShaderNodeMath", -550, 0, operation="MULTIPLY")
    _link(mat, w1.outputs["Factor"], mx.inputs[0])
    _link(mat, w2.outputs["Factor"], mx.inputs[1])
    bump = _no(mat, "ShaderNodeBump", -300, -200)
    bump.inputs["Strength"].default_value = 0.3
    _link(mat, mx.outputs["Value"], bump.inputs["Height"])
    _link(mat, bump.outputs["Normal"], p.inputs["Normal"])
    return mat


def ceramica(cor="#F2EEE6", nome="Ceramica"):
    """Cerâmica vitrificada: base clara, coat fino brilhante por cima."""
    mat = novo_material(nome)
    ajustar(mat, Base_Color=cor, Roughness=0.35, Coat_Weight=1.0, Coat_Roughness=0.04,
            Coat_IOR=1.5, Subsurface_Weight=0.05, Subsurface_Scale=0.002)
    return mat


def madeira(clara="#C48A55", escura="#7A4A26", roughness=0.45, verniz=0.0, nome="Madeira"):
    """Madeira procedural (anéis com Wave + ruído). Para close, prefira textura CC0."""
    mat = novo_material(nome)
    p = ajustar(mat, Roughness=roughness, Coat_Weight=verniz, Coat_Roughness=0.08)
    coord = _coord_objeto(mat)
    mp = _no(mat, "ShaderNodeMapping", -1000, 0)
    mp.inputs["Scale"].default_value = (1.0, 1.0, 0.15)  # veio ao longo de Z
    _link(mat, coord, mp.inputs["Vector"])
    wv = _no(mat, "ShaderNodeTexWave", -800, 0, wave_type="RINGS")
    wv.inputs["Scale"].default_value = 25.0
    wv.inputs["Distortion"].default_value = 6.0
    wv.inputs["Detail"].default_value = 3.0
    wv.inputs["Detail Scale"].default_value = 1.5
    _link(mat, mp.outputs["Vector"], wv.inputs["Vector"])
    rp = _no(mat, "ShaderNodeValToRGB", -550, 0)
    rp.color_ramp.elements[0].color = _cor(escura)
    rp.color_ramp.elements[1].color = _cor(clara)
    rp.color_ramp.elements[0].position = 0.25
    rp.color_ramp.elements[1].position = 0.85
    _link(mat, wv.outputs["Factor"], rp.inputs["Factor"])
    _link(mat, rp.outputs["Color"], p.inputs["Base Color"])
    bump = _no(mat, "ShaderNodeBump", -300, -250)
    bump.inputs["Strength"].default_value = 0.05
    _link(mat, wv.outputs["Factor"], bump.inputs["Height"])
    _link(mat, bump.outputs["Normal"], p.inputs["Normal"])
    return mat


def papel(cor="#F4F1EA", nome="Papel"):
    """Papel: Thin Wall (5.2) + subsurface fraco = luz atravessa a folha."""
    mat = novo_material(nome)
    ajustar(mat, Base_Color=cor, Roughness=0.8, Specular_IOR_Level=0.3,
            Thin_Wall=True, Subsurface_Weight=0.3, Subsurface_Scale=0.001)
    return mat


def pele_fruta(cor="#B8231A", nome="Pele_Fruta"):
    """Maçã/tomate: SSS Random Walk com raio puxado no vermelho, pele cerosa com coat."""
    mat = novo_material(nome)
    p = principled(mat)
    p.subsurface_method = "RANDOM_WALK"  # Subsurface IOR só vale no RANDOM_WALK_SKIN
    ajustar(mat, Base_Color=cor, Roughness=0.35, Subsurface_Weight=0.4,
            Subsurface_Radius=(1.0, 0.25, 0.12), Subsurface_Scale=0.005,
            Coat_Weight=0.3, Coat_Roughness=0.15)
    return mat


def pintura_automotiva(cor="#8E0F1B", flocos=True, nome="Pintura_Automotiva"):
    """Base metálica com flocos (Voronoi) + verniz (coat) liso por cima."""
    mat = novo_material(nome)
    p = ajustar(mat, Base_Color=cor, Metallic=0.6, Roughness=0.35,
                Coat_Weight=1.0, Coat_Roughness=0.02, Coat_IOR=1.5)
    if flocos:
        coord = _coord_objeto(mat)
        vr = _no(mat, "ShaderNodeTexVoronoi", -900, -200)
        vr.inputs["Scale"].default_value = 1500.0  # células ~0,7 mm em cena métrica
        _link(mat, coord, vr.inputs["Vector"])
        # Cor aleatória por célula vira normal aleatória dos flocos (só na base; coat fica liso)
        sub = _no(mat, "ShaderNodeVectorMath", -650, -200, operation="SUBTRACT")
        sub.inputs[1].default_value = (0.5, 0.5, 0.5)
        _link(mat, vr.outputs["Color"], sub.inputs[0])
        geo = _no(mat, "ShaderNodeNewGeometry", -900, -500)
        sc = _no(mat, "ShaderNodeVectorMath", -500, -200, operation="SCALE")
        sc.inputs["Scale"].default_value = 0.5
        _link(mat, sub.outputs["Vector"], sc.inputs[0])
        ad = _no(mat, "ShaderNodeVectorMath", -350, -300, operation="ADD")
        _link(mat, geo.outputs["Normal"], ad.inputs[0])
        _link(mat, sc.outputs["Vector"], ad.inputs[1])
        nm = _no(mat, "ShaderNodeVectorMath", -200, -300, operation="NORMALIZE")
        _link(mat, ad.outputs["Vector"], nm.inputs[0])
        _link(mat, nm.outputs["Vector"], p.inputs["Normal"])
    return mat


def tela_celular(cor_tela="#3B6CF6", brilho=1.0, imagem=None, nome="Tela_Celular"):
    """Tela + vidro num material só: emissão fica ABAIXO do coat no Principled v2.
    brilho 1,0 = cor 'shadeless'; acima de ~1,3 desbota no AgX (laboratório)."""
    mat = novo_material(nome)
    p = ajustar(mat, Base_Color=(0.005, 0.005, 0.006), Roughness=0.4,
                Emission_Color=cor_tela, Emission_Strength=brilho,
                Coat_Weight=1.0, Coat_Roughness=0.02, Coat_IOR=1.52)
    if imagem:
        tex = _no(mat, "ShaderNodeTexImage", -600, 0)
        tex.image = bpy.data.images.load(imagem, check_existing=True)
        _link(mat, tex.outputs["Color"], p.inputs["Emission Color"])
    return mat


def vidro_tampa(nome="Vidro_Tampa"):
    """Vidro de cobertura separado (lâmina fina sobre a tela): Thin Wall evita refração dupla."""
    mat = novo_material(nome)
    ajustar(mat, Transmission_Weight=1.0, Roughness=0.0, IOR=1.52, Thin_Wall=True)
    _config_transparente(mat)
    mat.thickness_mode = "SLAB"
    return mat


# --------------------------------------------------------------------------
# Estilizados
# --------------------------------------------------------------------------

def argila(cor="#D8C7B4", nome="Argila"):
    mat = novo_material(nome)
    ajustar(mat, Base_Color=cor, Roughness=0.7, Specular_IOR_Level=0.3, Diffuse_Roughness=0.5,
            Subsurface_Weight=0.15, Subsurface_Scale=0.003)
    return mat


def pastel(cor="#F6C6D0", nome="Pastel"):
    """Soft pastel: cor clara de saturação média, aspereza alta, sheen branco e SSS fraco."""
    mat = novo_material(nome)
    ajustar(mat, Base_Color=cor, Roughness=0.55, Specular_IOR_Level=0.4,
            Sheen_Weight=0.3, Sheen_Roughness=0.5, Subsurface_Weight=0.2,
            Subsurface_Scale=0.004)
    return mat


def gradiente(cor_a="#6A5CFF", cor_b="#FF7AB6", eixo="Z", altura=0.1, nome="Gradiente"):
    """Gradiente linear em coordenada de objeto ao longo do eixo; altura em metros."""
    mat = novo_material(nome)
    p = ajustar(mat, Roughness=0.4)
    coord = _coord_objeto(mat)
    sep = _no(mat, "ShaderNodeSeparateXYZ", -1000, 0)
    _link(mat, coord, sep.inputs["Vector"])
    mr = _no(mat, "ShaderNodeMapRange", -800, 0)
    mr.inputs["From Min"].default_value = -altura / 2
    mr.inputs["From Max"].default_value = altura / 2
    _link(mat, sep.outputs[eixo], mr.inputs["Value"])
    rp = _no(mat, "ShaderNodeValToRGB", -550, 0)
    rp.color_ramp.elements[0].color = _cor(cor_a)
    rp.color_ramp.elements[1].color = _cor(cor_b)
    _link(mat, mr.outputs["Result"], rp.inputs["Factor"])
    _link(mat, rp.outputs["Color"], p.inputs["Base Color"])
    return mat


def holografico(espessura_min=250.0, espessura_max=750.0, nome="Holografico"):
    """Iridescente por Thin Film (só Cycles). Teste 5.2.2: filme sobre METAL quase não aparece;
    o efeito forte vem de base dielétrica escura + filme de IOR alto (1,8 a 2,0) com
    espessura variando por ruído. Fundo/HDRI com contraste é obrigatório para ler as cores."""
    mat = novo_material(nome)
    p = ajustar(mat, Base_Color=(0.012, 0.012, 0.016), Metallic=0.0, Roughness=0.08, IOR=1.5,
                Thin_Film_Thickness=(espessura_min + espessura_max) / 2, Thin_Film_IOR=1.9)
    coord = _coord_objeto(mat)
    nz = _no(mat, "ShaderNodeTexNoise", -800, 0)
    nz.inputs["Scale"].default_value = 12.0
    nz.inputs["Distortion"].default_value = 1.5
    _link(mat, coord, nz.inputs["Vector"])
    mr = _no(mat, "ShaderNodeMapRange", -500, 0)
    mr.inputs["To Min"].default_value = espessura_min
    mr.inputs["To Max"].default_value = espessura_max
    _link(mat, nz.outputs["Factor"], mr.inputs["Value"])
    _link(mat, mr.outputs["Result"], p.inputs["Thin Film Thickness"])
    return mat


def bolha_sabao(nome="Bolha_Sabao"):
    """Thin Wall + transmissão + filme fino (Cycles). IOR 1,0 = ar dos dois lados;
    o reflexo vem só do filme (IOR 1,33). Com IOR 1,33 na base o filme some (testado)."""
    mat = novo_material(nome)
    ajustar(mat, Transmission_Weight=1.0, Roughness=0.0, IOR=1.0, Thin_Wall=True,
            Thin_Film_Thickness=450.0, Thin_Film_IOR=1.33)
    _config_transparente(mat)
    return mat


def toon(cor="#FF6A3D", sombra=0.45, limiar=0.5, nome="Toon"):
    """Toon por Shader to RGB: SÓ EEVEE (no Cycles o nó não funciona)."""
    mat = novo_material(nome)
    nt = mat.node_tree
    for n in list(nt.nodes):
        if n.type == "BSDF_PRINCIPLED":
            nt.nodes.remove(n)
    out = saida(mat)
    df = _no(mat, "ShaderNodeBsdfDiffuse", -900, 0)
    s2r = _no(mat, "ShaderNodeShaderToRGB", -700, 0)
    _link(mat, df.outputs["BSDF"], s2r.inputs["Shader"])
    rp = _no(mat, "ShaderNodeValToRGB", -500, 0)
    rp.color_ramp.interpolation = "CONSTANT"
    base = _cor(cor)
    escuro = tuple(c * sombra for c in base[:3]) + (1.0,)
    rp.color_ramp.elements[0].color = escuro
    rp.color_ramp.elements[1].position = limiar  # luz recebida acima disto = cor cheia
    rp.color_ramp.elements[1].color = base
    _link(mat, s2r.outputs["Color"], rp.inputs["Factor"])
    em = _no(mat, "ShaderNodeEmission", -250, 0)
    _link(mat, rp.outputs["Color"], em.inputs["Color"])
    _link(mat, em.outputs["Emission"], out.inputs["Surface"])
    return mat


def cor_plana(cor="#FF5A1F", nome="Cor_Plana"):
    """Emissão 1,0 sem luz: reproduz o hex só se a view for Standard (ver capítulo)."""
    mat = novo_material(nome)
    ajustar(mat, Base_Color=(0, 0, 0), Roughness=1.0, Specular_IOR_Level=0.0,
            Emission_Color=cor, Emission_Strength=1.0)
    return mat


# --------------------------------------------------------------------------
# Camada de imperfeição
# --------------------------------------------------------------------------

def imperfeicao(mat, amplitude=0.10, escala_mm=8.0, riscos=True, relevo=0.02,
                digitais=None, escala_digitais=0.05):
    """Varia a aspereza em torno do valor atual.
    amplitude: variação total (0,05 a 0,15). escala_mm: tamanho da mancha em mm.
    digitais: caminho de uma textura CC0 de digitais/smudge (cinza); opcional."""
    p = principled(mat)
    base = p.inputs["Roughness"].default_value
    if p.inputs["Roughness"].is_linked:
        return mat  # já tem aspereza procedural; não sobrescreve
    coord = _coord_objeto(mat, -1500, 400)
    # 1) Manchas largas
    nz = _no(mat, "ShaderNodeTexNoise", -1100, 500)
    nz.inputs["Scale"].default_value = 1000.0 / max(escala_mm, 0.1)
    nz.inputs["Detail"].default_value = 6.0
    nz.inputs["Roughness"].default_value = 0.6
    _link(mat, coord, nz.inputs["Vector"])
    mr = _no(mat, "ShaderNodeMapRange", -850, 500)
    mr.inputs["From Min"].default_value = 0.3
    mr.inputs["From Max"].default_value = 0.7
    mr.inputs["To Min"].default_value = max(0.0, base - amplitude / 2)
    mr.inputs["To Max"].default_value = min(1.0, base + amplitude / 2)
    _link(mat, nz.outputs["Factor"], mr.inputs["Value"])
    rough = mr.outputs["Result"]
    # 2) Micro riscos: Voronoi distância à borda bem fina, esticado
    if riscos:
        mp = _no(mat, "ShaderNodeMapping", -1250, 150)
        mp.inputs["Scale"].default_value = (1.0, 1.0, 12.0)
        mp.inputs["Rotation"].default_value = (0.3, 0.7, 0.2)
        _link(mat, coord, mp.inputs["Vector"])
        vr = _no(mat, "ShaderNodeTexVoronoi", -1050, 150, feature="DISTANCE_TO_EDGE")
        vr.inputs["Scale"].default_value = 120.0
        _link(mat, mp.outputs["Vector"], vr.inputs["Vector"])
        mr2 = _no(mat, "ShaderNodeMapRange", -850, 150)
        mr2.inputs["From Min"].default_value = 0.0
        mr2.inputs["From Max"].default_value = 0.015
        mr2.inputs["To Min"].default_value = 0.12  # risco = mais áspero
        mr2.inputs["To Max"].default_value = 0.0
        _link(mat, vr.outputs["Distance"], mr2.inputs["Value"])
        soma = _no(mat, "ShaderNodeMath", -650, 350, operation="ADD", use_clamp=True)
        _link(mat, rough, soma.inputs[0])
        _link(mat, mr2.outputs["Result"], soma.inputs[1])
        rough = soma.outputs["Value"]
    # 3) Digitais (textura CC0 opcional)
    if digitais:
        tx = _no(mat, "ShaderNodeTexImage", -1050, -200)
        tx.image = bpy.data.images.load(digitais, check_existing=True)
        tx.image.colorspace_settings.name = "Non-Color"
        tx.projection = "BOX"
        tx.projection_blend = 0.2
        mpd = _no(mat, "ShaderNodeMapping", -1250, -200)
        mpd.inputs["Scale"].default_value = (1 / escala_digitais,) * 3
        _link(mat, coord, mpd.inputs["Vector"])
        _link(mat, mpd.outputs["Vector"], tx.inputs["Vector"])
        mx = _no(mat, "ShaderNodeMix", -650, 100, data_type="FLOAT")
        mx.inputs["Factor"].default_value = 0.6
        _link(mat, tx.outputs["Color"], mx.inputs["Factor"])
        _link(mat, rough, mx.inputs["A"])
        mx.inputs["B"].default_value = min(1.0, base + 0.25)
        rough = mx.outputs["Result"]
    _link(mat, rough, p.inputs["Roughness"])
    # 4) Relevo leve das manchas (casca de laranja de injeção plástica)
    if relevo > 0 and not p.inputs["Normal"].is_linked:
        bump = _no(mat, "ShaderNodeBump", -450, -300)
        bump.inputs["Strength"].default_value = relevo
        _link(mat, nz.outputs["Factor"], bump.inputs["Height"])
        _link(mat, bump.outputs["Normal"], p.inputs["Normal"])
    return mat


def desgaste_borda_cycles(mat, cor_metal="aluminio", raio_mm=0.6, limiar=0.55):
    """Desgaste de borda com Pointiness (SÓ Cycles; malha precisa de densidade)."""
    p = principled(mat)
    geo = _no(mat, "ShaderNodeNewGeometry", -1200, -600)
    rp = _no(mat, "ShaderNodeValToRGB", -950, -600)
    rp.color_ramp.elements[0].position = limiar
    rp.color_ramp.elements[1].position = limiar + 0.05
    _link(mat, geo.outputs["Pointiness"], rp.inputs["Factor"])
    cor, _ = METAIS[cor_metal]
    mx = _no(mat, "ShaderNodeMix", -650, -600, data_type="RGBA")
    if p.inputs["Base Color"].is_linked:
        _link(mat, p.inputs["Base Color"].links[0].from_socket, mx.inputs["A"])
    else:
        mx.inputs["A"].default_value = p.inputs["Base Color"].default_value
    mx.inputs["B"].default_value = cor + (1.0,)
    _link(mat, rp.outputs["Color"], mx.inputs["Factor"])
    _link(mat, mx.outputs["Result"], p.inputs["Base Color"])
    _link(mat, rp.outputs["Color"], p.inputs["Metallic"])
    return mat


def bevel_shader(mat, raio_mm=0.8, amostras=8):
    """Nó Bevel no Normal (SÓ Cycles). Arredonda o brilho da aresta sem geometria."""
    p = principled(mat)
    bv = _no(mat, "ShaderNodeBevel", -300, -700, samples=amostras)
    bv.inputs["Radius"].default_value = raio_mm / 1000.0
    if p.inputs["Normal"].is_linked:
        _link(mat, p.inputs["Normal"].links[0].from_socket, bv.inputs["Normal"])
    _link(mat, bv.outputs["Normal"], p.inputs["Normal"])
    return bv


# --------------------------------------------------------------------------
# Geometria: chanfro
# --------------------------------------------------------------------------

CHANFRO_MM = {"celular": 0.75, "frasco": 1.5, "caixa": 3.0, "logo": 0.5, "movel": 4.0}


def chanfrar(obj, largura_mm=1.0, segmentos=4, angulo=30.0, harden=True):
    """Modificador Bevel em escala real. Aplique ANTES de subdivisão, se houver."""
    m = obj.modifiers.new("Chanfro", "BEVEL")
    m.width = largura_mm / 1000.0
    m.segments = segmentos
    m.limit_method = "ANGLE"
    m.angle_limit = math.radians(angulo)
    m.use_clamp_overlap = True
    m.miter_outer = "MITER_ARC"
    m.harden_normals = harden
    m.profile = 0.5
    return m


# --------------------------------------------------------------------------
# Catálogo (para grade de teste)
# --------------------------------------------------------------------------

CATALOGO = {
    "plastico_brilhante": plastico_brilhante,
    "plastico_fosco": plastico_fosco,
    "cromo": cromo,
    "ouro": ouro,
    "metal_escovado": metal_escovado,
    "aluminio_anodizado": aluminio_anodizado,
    "vidro_limpo": vidro_limpo,
    "vidro_fosco": vidro_fosco,
    "vidro_colorido": vidro_colorido,
    "liquido_perfume": lambda: liquido("perfume"),
    "borracha": borracha,
    "tecido": tecido,
    "ceramica": ceramica,
    "madeira": madeira,
    "papel": papel,
    "pele_fruta": pele_fruta,
    "pintura_automotiva": pintura_automotiva,
    "gelo": gelo,
    "tela_celular": tela_celular,
    "argila": argila,
    "pastel": pastel,
    "gradiente": gradiente,
    "holografico": holografico,
    "bolha_sabao": bolha_sabao,
    "toon": toon,
    "cor_plana": cor_plana,
}

if __name__ == "__main__":
    for nome, f in CATALOGO.items():
        m = f()
        print("OK", nome, m.name, len(m.node_tree.nodes), "nós")
    m = plastico_brilhante(nome="Teste_Imperf")
    imperfeicao(m, 0.1, 8)
    desgaste_borda_cycles(m)
    bevel_shader(m)
    print("OK imperfeicao/desgaste/bevel")
