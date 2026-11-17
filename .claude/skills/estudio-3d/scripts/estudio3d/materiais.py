"""Materiais: receitas com valores reais + a camada de imperfeição que tira a cara de CG.

Por que material de IA parece plástico de videogame: aspereza (roughness) igual na superfície
inteira, nenhum micro-relevo, cor 100% saturada e aresta viva. Toda receita aqui já nasce com
variação de aspereza e, quando faz sentido, micro-relevo. Valores de Principled BSDF v2 (5.x).

Faixas de referência (Principled v2):
    plástico brilhante  rough 0,08-0,15 | acetinado 0,25-0,4 | fosco 0,55-0,75
    metal polido/cromo  rough 0,02-0,08 | escovado 0,2-0,35 + anisotropia 0,6-0,9
    vidro               rough 0-0,02, IOR 1,45-1,52 | fosco 0,25-0,45
    água/líquido        IOR 1,33 | óleo 1,47 | diamante 2,42
    verniz (coat)       weight 1, rough 0,01-0,05 = laca, pintura de carro, cerâmica esmaltada
"""
import bpy

from .nucleo import hex_emissao, hex_lin

_CACHE = {}


def _novo(nome):
    m = bpy.data.materials.new(nome)
    m.use_nodes = True
    nt = m.node_tree
    return m, nt, nt.nodes['Principled BSDF']


def _ent(b, nome, v):
    if nome in b.inputs:
        b.inputs[nome].default_value = v


def _ruido(nt, escala, detalhe=4.0, aspereza=0.55, coord='Object', esticar=None):
    n = nt.nodes.new('ShaderNodeTexNoise')
    n.inputs['Scale'].default_value = escala
    n.inputs['Detail'].default_value = detalhe
    n.inputs['Roughness'].default_value = aspereza
    src = nt.nodes.new('ShaderNodeTexCoord').outputs[coord]
    if esticar:
        mp = nt.nodes.new('ShaderNodeMapping')
        mp.inputs['Scale'].default_value = esticar
        nt.links.new(src, mp.inputs['Vector'])
        src = mp.outputs[0]
    nt.links.new(src, n.inputs['Vector'])
    return n.outputs['Fac']


def _faixa(nt, saida, a, b, de=0.35, ate=0.65):
    mr = nt.nodes.new('ShaderNodeMapRange')
    mr.inputs['From Min'].default_value = de
    mr.inputs['From Max'].default_value = ate
    mr.inputs['To Min'].default_value = a
    mr.inputs['To Max'].default_value = b
    nt.links.new(saida, mr.inputs['Value'])
    return mr.outputs['Result']


def imperfeicao(nt, b, rough, variacao=0.35, escala=18.0, relevo=0.0, escala_relevo=900.0, entrada='Roughness'):
    """varia a aspereza em manchas (digitais, desgaste, uso) e opcionalmente põe micro-relevo.
    variacao 0,35 = a aspereza oscila ±35% em volta de `rough`. escala em 1/m no espaço do objeto:
    18 = manchas de ~5 cm (produto); 4 = manchas grandes (parede, piso)."""
    manchas = _ruido(nt, escala, 6, 0.6)
    lo, hi = rough * (1 - variacao), min(1.0, rough * (1 + variacao) + 0.01)
    nt.links.new(_faixa(nt, manchas, lo, hi), b.inputs[entrada])
    if relevo > 0:
        fino = _ruido(nt, escala_relevo, 2, 0.5)
        bp = nt.nodes.new('ShaderNodeBump')
        bp.inputs['Strength'].default_value = relevo
        bp.inputs['Distance'].default_value = 0.0005
        nt.links.new(fino, bp.inputs['Height'])
        nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])


def _cache(chave, fabrica):
    if chave not in _CACHE or _CACHE[chave].name not in bpy.data.materials:
        _CACHE[chave] = fabrica()
    return _CACHE[chave]


# ---------------------------------------------------------------- receitas
def plastico(cor='#E9E4DA', acabamento='acetinado', nome=None):
    rough = {'brilhante': 0.12, 'acetinado': 0.32, 'fosco': 0.62}[acabamento]

    def f():
        m, nt, b = _novo(nome or f'plastico_{acabamento}_{cor}')
        b.inputs['Base Color'].default_value = hex_lin(cor)
        _ent(b, 'Specular IOR Level', 0.5)
        imperfeicao(nt, b, rough, 0.3, 14, relevo=0.08 if acabamento != 'brilhante' else 0.0)
        if acabamento == 'brilhante':
            _ent(b, 'Coat Weight', 0.6)
            _ent(b, 'Coat Roughness', 0.04)
        return m
    return _cache(('plastico', cor, acabamento, nome), f)


METAIS = {  # cor base (F0) de metais reais, em sRGB
    'cromo': '#F2F3F5', 'aluminio': '#D9DCDF', 'aco': '#BFC3C6', 'titanio': '#B6AFA6',
    'ouro': '#F5CE7A', 'ouro_rosa': '#F2BBA3', 'cobre': '#F2A47E', 'latao': '#E8C882',
    'grafite': '#5C5F63', 'preto_fosco': '#2A2B2D',
}


def metal(tipo='aluminio', acabamento='escovado', cor=None, nome=None):
    """acabamento: polido, acetinado, escovado, jateado."""
    rough = {'polido': 0.04, 'acetinado': 0.16, 'escovado': 0.26, 'jateado': 0.42}[acabamento]
    base = cor or METAIS[tipo]

    def f():
        m, nt, b = _novo(nome or f'metal_{tipo}_{acabamento}')
        b.inputs['Base Color'].default_value = hex_lin(base, seguro=False)
        b.inputs['Metallic'].default_value = 1.0
        if acabamento == 'escovado':
            # riscos esticados num eixo + anisotropia: o reflexo vira uma faixa alongada
            riscos = _ruido(nt, 400, 2, 0.5, esticar=(1, 1, 0.01))
            nt.links.new(_faixa(nt, riscos, rough * 0.7, rough * 1.4), b.inputs['Roughness'])
            _ent(b, 'Anisotropic', 0.75)
        else:
            imperfeicao(nt, b, rough, 0.4 if acabamento == 'polido' else 0.25, 20)
        return m
    return _cache(('metal', tipo, acabamento, cor, nome), f)


def anodizado(cor='#3C4A5A', nome=None):
    """alumínio anodizado colorido (notebook, celular, fone premium): metal com cor + jateado fino."""
    def f():
        m, nt, b = _novo(nome or f'anodizado_{cor}')
        b.inputs['Base Color'].default_value = hex_lin(cor, seguro=False)
        b.inputs['Metallic'].default_value = 1.0
        imperfeicao(nt, b, 0.3, 0.15, 30, relevo=0.05, escala_relevo=2500)
        return m
    return _cache(('anodizado', cor, nome), f)


def vidro(cor='#FFFFFF', fosco=0.0, ior=1.5, espessura_cor=1.0, nome=None):
    """vidro. cor tinge pela transmissão (use cor clara: '#E8F4F0' = vidro esverdeado de garrafa).
    fosco 0,3 = jateado. Em EEVEE use material.surface_render_method='DITHERED' + raytracing."""
    def f():
        m, nt, b = _novo(nome or f'vidro_{cor}_{fosco}')
        b.inputs['Base Color'].default_value = hex_lin(cor, seguro=False)
        b.inputs['Transmission Weight'].default_value = 1.0
        b.inputs['IOR'].default_value = ior
        imperfeicao(nt, b, max(0.005, fosco), 0.5 if fosco < 0.05 else 0.2, 9)
        if fosco < 0.05:
            b.inputs['Roughness'].default_value = 0.0
        return m
    return _cache(('vidro', cor, fosco, ior, nome), f)


def liquido(cor='#C8102E', ior=1.34, turvo=0.0, nome=None):
    """líquido: transmissão colorida. turvo>0 usa volume pra cor ganhar profundidade (refrigerante,
    suco, perfume colorido)."""
    def f():
        m, nt, b = _novo(nome or f'liquido_{cor}')
        b.inputs['Base Color'].default_value = (1, 1, 1, 1) if turvo else hex_lin(cor, seguro=False)
        b.inputs['Transmission Weight'].default_value = 1.0
        b.inputs['IOR'].default_value = ior
        b.inputs['Roughness'].default_value = 0.0
        if turvo:
            v = nt.nodes.new('ShaderNodeVolumeAbsorption')
            v.inputs['Color'].default_value = hex_lin(cor, seguro=False)
            v.inputs['Density'].default_value = turvo
            nt.links.new(v.outputs[0], nt.nodes['Material Output'].inputs['Volume'])
        return m
    return _cache(('liquido', cor, ior, turvo, nome), f)


def borracha(cor='#2B2C2E', nome=None):
    def f():
        m, nt, b = _novo(nome or f'borracha_{cor}')
        b.inputs['Base Color'].default_value = hex_lin(cor)
        imperfeicao(nt, b, 0.7, 0.15, 25, relevo=0.15, escala_relevo=3000)
        _ent(b, 'Sheen Weight', 0.25)
        return m
    return _cache(('borracha', cor, nome), f)


def ceramica(cor='#F1EDE6', nome=None):
    def f():
        m, nt, b = _novo(nome or f'ceramica_{cor}')
        b.inputs['Base Color'].default_value = hex_lin(cor)
        imperfeicao(nt, b, 0.35, 0.2, 10)
        _ent(b, 'Coat Weight', 1.0)
        _ent(b, 'Coat Roughness', 0.03)
        _ent(b, 'Subsurface Weight', 0.05)
        return m
    return _cache(('ceramica', cor, nome), f)


def argila(cor='#E8B4A0', nome=None):
    """clay/soft: fosco, um véu de sheen e um pouco de subsurface. O mundo 'argila' inteiro usa isto."""
    def f():
        m, nt, b = _novo(nome or f'argila_{cor}')
        b.inputs['Base Color'].default_value = hex_lin(cor)
        imperfeicao(nt, b, 0.78, 0.1, 8, relevo=0.12, escala_relevo=600)
        _ent(b, 'Sheen Weight', 0.4)
        _ent(b, 'Sheen Roughness', 0.5)
        _ent(b, 'Subsurface Weight', 0.15)
        _ent(b, 'Subsurface Scale', 0.01)
        return m
    return _cache(('argila', cor, nome), f)


def tecido(cor='#4A5A6A', nome=None):
    def f():
        m, nt, b = _novo(nome or f'tecido_{cor}')
        b.inputs['Base Color'].default_value = hex_lin(cor)
        b.inputs['Roughness'].default_value = 0.85
        _ent(b, 'Sheen Weight', 1.0)
        _ent(b, 'Sheen Roughness', 0.35)
        trama = _ruido(nt, 1800, 1, 0.5, esticar=(1, 8, 1))
        bp = nt.nodes.new('ShaderNodeBump')
        bp.inputs['Strength'].default_value = 0.2
        nt.links.new(trama, bp.inputs['Height'])
        nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
        return m
    return _cache(('tecido', cor, nome), f)


def laca(cor='#0B3D2E', nome=None):
    """pintura de carro / laca de piano / embalagem premium: cor + verniz espelhado."""
    def f():
        m, nt, b = _novo(nome or f'laca_{cor}')
        b.inputs['Base Color'].default_value = hex_lin(cor)
        imperfeicao(nt, b, 0.3, 0.2, 12)
        _ent(b, 'Coat Weight', 1.0)
        _ent(b, 'Coat Roughness', 0.015)
        _ent(b, 'Coat IOR', 1.5)
        return m
    return _cache(('laca', cor, nome), f)


def iridescente(cor='#DDE3EA', espessura=420.0, nome=None):
    """película fina (thin film) do 5.x: bolha de sabão, holográfico, embalagem metalizada."""
    def f():
        m, nt, b = _novo(nome or f'irid_{cor}')
        b.inputs['Base Color'].default_value = hex_lin(cor)
        b.inputs['Metallic'].default_value = 1.0
        imperfeicao(nt, b, 0.12, 0.3, 15)
        _ent(b, 'Thin Film Thickness', espessura)
        _ent(b, 'Thin Film IOR', 1.4)
        return m
    return _cache(('irid', cor, espessura, nome), f)


def emissor(cor='#FFFFFF', forca=5.0, nome=None):
    def f():
        m, nt, b = _novo(nome or f'emissor_{cor}_{forca}')
        b.inputs['Base Color'].default_value = (0, 0, 0, 1)
        b.inputs['Emission Color'].default_value = hex_emissao(cor)
        b.inputs['Emission Strength'].default_value = forca
        return m
    return _cache(('emissor', cor, forca, nome), f)


def tela(imagem, brilho=1.0, reflexo=0.6, nome=None):
    """tela de aparelho: a imagem emite luz e um vidro (coat) por cima reflete o estúdio.
    brilho ~1,0 em AgX (calibrado): acima de 1,3 o AgX desbota e gira as cores da interface
    (verde de "confirmado" some). reflexo 0,6 = vidro que reflete sem apagar a UI; 0 = fosca.
    imagem: caminho de PNG (faça as telas em HTML e fotografe, ou use o print real do app)."""
    def f():
        m, nt, b = _novo(nome or f'tela_{getattr(imagem, "name", imagem)}')
        tx = nt.nodes.new('ShaderNodeTexImage')
        tx.image = imagem if isinstance(imagem, bpy.types.Image) else bpy.data.images.load(str(imagem), check_existing=True)
        tx.interpolation = 'Cubic'
        b.inputs['Base Color'].default_value = (0.004, 0.004, 0.005, 1)
        b.inputs['Roughness'].default_value = 0.3
        nt.links.new(tx.outputs['Color'], b.inputs['Emission Color'])
        b.inputs['Emission Strength'].default_value = brilho
        _ent(b, 'Coat Weight', reflexo)
        _ent(b, 'Coat Roughness', 0.02)
        _ent(b, 'Coat IOR', 1.52)
        return m
    return _cache(('tela', str(imagem), brilho, reflexo, nome), f)


def fundo(cor='#D9D4CC', rough=0.55, nome=None):
    """superfície de ciclorama/piso: fosca com variação larga (nada é perfeitamente liso)."""
    def f():
        m, nt, b = _novo(nome or f'fundo_{cor}')
        b.inputs['Base Color'].default_value = hex_lin(cor)
        imperfeicao(nt, b, rough, 0.25, 3)
        return m
    return _cache(('fundo', cor, rough, nome), f)


def piso_espelhado(cor='#111214', rough=0.18, nome=None):
    """piso escuro que reflete o produto borrado (luxo, tech). rough 0,1-0,25: reflexo macio."""
    def f():
        m, nt, b = _novo(nome or f'piso_esp_{cor}')
        b.inputs['Base Color'].default_value = hex_lin(cor)
        imperfeicao(nt, b, rough, 0.4, 2.5)
        _ent(b, 'Coat Weight', 0.5)
        _ent(b, 'Coat Roughness', rough * 0.5)
        return m
    return _cache(('piso_esp', cor, rough, nome), f)


def dar(obj, mat, todos=True):
    if todos:
        obj.data.materials.clear()
    obj.data.materials.append(mat)
    return obj


def gelo(nome='gelo'):
    """gelo transparente (v2): sem volume. Aspereza manchada (molhado brilha, geada fica fosca) e riscos finos."""
    def f():
        m, nt, b = _novo(nome)
        b.inputs['Base Color'].default_value = (0.97, 0.99, 1.0, 1)
        b.inputs['Transmission Weight'].default_value = 1.0
        b.inputs['IOR'].default_value = 1.31
        manchas = _ruido(nt, 90, 6, 0.6)
        nt.links.new(_faixa(nt, manchas, 0.0, 0.18, 0.5, 0.72), b.inputs['Roughness'])
        riscos = nt.nodes.new('ShaderNodeTexWave'); riscos.inputs['Scale'].default_value = 70
        riscos.inputs['Distortion'].default_value = 14; riscos.inputs['Detail'].default_value = 8
        nt.links.new(nt.nodes.new('ShaderNodeTexCoord').outputs['Object'], riscos.inputs['Vector'])
        bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.04; bp.inputs['Distance'].default_value = 0.0001
        nt.links.new(riscos.outputs['Fac'], bp.inputs['Height'])
        nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
        return m
    return _cache(('gelo', nome), f)


def fratura_gelo(nome='fratura_gelo'):
    """plano de rachadura dentro do gelo: vidro finíssimo que só reflete (Thin Wall)."""
    def f():
        m, nt, b = _novo(nome)
        b.inputs['Base Color'].default_value = (1, 1, 1, 1)
        b.inputs['Transmission Weight'].default_value = 1.0
        b.inputs['IOR'].default_value = 1.6
        b.inputs['Roughness'].default_value = 0.05
        _ent(b, 'Thin Wall', True)
        return m
    return _cache(('fratura', nome), f)
