"""Dispositivos e interface em 3D: celular, notebook, cartão de UI, pilha de camadas explodida.

Por que tela de app de IA parece placa: falta espessura de vidro, falta o reflexo do estúdio na
tela, falta a borda metálica pegando luz e as camadas estão coladas. Aqui o celular tem medidas
reais (71,5 x 147 x 7,8 mm), vidro com verniz por cima da imagem e moldura de metal chanfrada.

Toda peça devolve um VAZIO pivô (anime o pivô, não as partes).
"""
import math

import bpy

from . import materiais as M
from .geo import bloco, cilindro, placa_face
from .nucleo import ligar, vazio


def _filho(o, pai, loc=(0, 0, 0), rot=(0, 0, 0)):
    o.parent = pai
    o.location = loc
    o.rotation_euler = rot
    return o


def celular(nome='celular', tela=None, corpo='titanio', cor_corpo=None, brilho_tela=1.0,
            de_pe=True, escala=1.0):
    """tela: caminho de PNG na proporção ~9:19,5 (ex.: 1170x2532). de_pe=True: tela olhando -Y."""
    W, H, E = 0.0715 * escala, 0.147 * escala, 0.0078 * escala
    R = 0.0115 * escala
    piv = vazio(nome, tamanho=0.03)
    raiz = vazio(nome + '.raiz', pai=piv, tamanho=0.01)
    if de_pe:
        raiz.rotation_euler = (math.radians(90), 0, 0)
    mat_corpo = M.metal(corpo, 'acetinado', cor=cor_corpo) if corpo in M.METAIS else M.anodizado(cor_corpo or '#3A3D42')
    caixa = _filho(bloco(nome + '.corpo', W, H, E, R, 0.0011 * escala, mat_corpo), raiz)
    # traseira de vidro fosco, levemente embutida
    tras = _filho(placa_face(nome + '.traseira', W - 0.002 * escala, H - 0.002 * escala, R - 0.001 * escala,
                             M.vidro('#2B2E33', fosco=0.35)), raiz, (0, 0, -E / 2 - 0.0001), (math.pi, 0, 0))
    # moldura preta + tela
    borda = 0.0018 * escala
    _filho(placa_face(nome + '.moldura', W - 0.0008 * escala, H - 0.0008 * escala, R - 0.0004 * escala,
                      M.plastico('#0A0A0B', 'brilhante')), raiz, (0, 0, E / 2 + 0.00005))
    mtela = M.tela(tela, brilho_tela) if tela else M.emissor('#0B0C0E', 0.2)
    _filho(placa_face(nome + '.tela', W - 2 * borda, H - 2 * borda, R - borda, mtela), raiz, (0, 0, E / 2 + 0.0001))
    # ilha dinâmica
    _filho(bloco(nome + '.ilha', 0.019 * escala, 0.0055 * escala, 0.0002, 0.00275 * escala, 0.00005,
                 M.plastico('#050506', 'brilhante')), raiz, (0, H / 2 - 0.011 * escala, E / 2 + 0.0002))
    # câmeras atrás
    ilha_cam = _filho(bloco(nome + '.modulo', 0.03 * escala, 0.03 * escala, 0.0015 * escala, 0.007 * escala,
                            0.0004 * escala, M.vidro('#3A3E44', fosco=0.2)), raiz,
                      (-W / 2 + 0.0195 * escala, H / 2 - 0.0195 * escala, -E / 2 - 0.0008 * escala))
    for dx, dy in ((-0.0068, 0.0068), (0.0068, -0.0068), (-0.0068, -0.0068)):
        lente = _filho(cilindro(nome + '.lente', 0.0052 * escala, 0.0018 * escala, M.metal('aco', 'polido'),
                                segs=48, chanfro=0.0003 * escala), ilha_cam, (dx * escala, dy * escala, -0.0018 * escala), (math.pi, 0, 0))
        _filho(cilindro(nome + '.vidro', 0.0038 * escala, 0.0004 * escala, M.vidro('#101418'), segs=48, chanfro=0.0001),
               lente, (0, 0, 0.0018 * escala))
    return piv


def notebook(nome='notebook', tela=None, cor='#C9CCD0', abertura=105.0, brilho_tela=1.0, escala=1.0):
    """notebook de 13-14". abertura em graus (0 fechado). Anime `piv['tampa'].rotation_euler.x`."""
    W, D = 0.304 * escala, 0.215 * escala
    piv = vazio(nome, tamanho=0.05)
    mat = M.anodizado(cor) if cor else M.metal('aluminio', 'jateado')
    base = _filho(bloco(nome + '.base', W, D, 0.0105 * escala, 0.012 * escala, 0.0015 * escala, mat), piv, (0, 0, 0.00525 * escala))
    _filho(placa_face(nome + '.teclado', W * 0.86, D * 0.42, 0.004 * escala, M.plastico('#151618', 'fosco')),
           base, (0, D * 0.12, 0.00526 * escala + 0.0001))
    _filho(placa_face(nome + '.trackpad', W * 0.4, D * 0.3, 0.006 * escala, M.vidro('#9EA3A8', fosco=0.4)),
           base, (0, -D * 0.29, 0.00526 * escala + 0.0001))
    dobradica = vazio(nome + '.dobradica', pai=piv, tamanho=0.01)
    dobradica.location = (0, D / 2 - 0.004 * escala, 0.0105 * escala)
    dobradica.rotation_euler = (math.radians(-abertura), 0, 0)
    tampa = _filho(bloco(nome + '.tampa', W, D, 0.005 * escala, 0.012 * escala, 0.0012 * escala, mat), dobradica,
                   (0, -D / 2, 0.0025 * escala))
    _filho(placa_face(nome + '.moldura', W - 0.002 * escala, D - 0.002 * escala, 0.011 * escala,
                      M.plastico('#08090A', 'brilhante')), tampa, (0, 0, -0.0026 * escala), (math.pi, 0, 0))
    mt = M.tela(tela, brilho_tela) if tela else M.emissor('#0B0C0E', 0.2)
    # rotação X=pi: a face olha pra dentro da tampa e o topo da imagem fica na ponta longe da dobradiça
    _filho(placa_face(nome + '.tela', W - 0.012 * escala, D - 0.016 * escala, 0.004 * escala, mt), tampa,
           (0, -0.001 * escala, -0.00265 * escala), (math.pi, 0, 0))
    piv['tampa'] = dobradica.name
    return piv


def cartao(nome, imagem, w, h, raio=0.012, esp=0.004, modo='emite', brilho=1.3, cor_corpo='#F4F2EE'):
    """cartão de interface com espessura (UI flutuante, card de dashboard, janela de navegador).
    modo 'emite': a imagem brilha como tela | 'impresso': a imagem é a cor de um cartão fosco
    iluminado pela cena (mais "objeto", menos "tela") | 'vidro': vidro fosco com a UI atrás."""
    piv = vazio(nome, tamanho=0.02)
    if modo == 'vidro':
        corpo = M.vidro('#F2F6FA', fosco=0.28)
    else:
        corpo = M.plastico(cor_corpo, 'acetinado')
    _filho(bloco(nome + '.corpo', w, h, esp, raio, min(0.0015, esp * 0.3), corpo), piv)
    if modo == 'impresso':
        mat = bpy.data.materials.new(nome + '.img')
        mat.use_nodes = True
        nt = mat.node_tree
        b = nt.nodes['Principled BSDF']
        tx = nt.nodes.new('ShaderNodeTexImage')
        tx.image = bpy.data.images.load(str(imagem), check_existing=True)
        nt.links.new(tx.outputs['Color'], b.inputs['Base Color'])
        b.inputs['Roughness'].default_value = 0.4
        b.inputs['Coat Weight'].default_value = 0.3
    else:
        mat = M.tela(imagem, brilho, reflexo=0.6)
    z = esp / 2 + 0.0001 if modo != 'vidro' else -esp / 2 - 0.0005
    _filho(placa_face(nome + '.face', w - 0.002, h - 0.002, max(0.0, raio - 0.001), mat), piv, (0, 0, z))
    return piv


def pilha_explodida(nome, imagens, w, h, afastamento=0.03, **kw):
    """camadas de UI empilhadas em profundidade (a "vista explodida" de interface). Anime o
    afastamento de cada filho em z de 0 até o valor pra "abrir" a interface."""
    piv = vazio(nome, tamanho=0.03)
    camadas = []
    for i, img in enumerate(imagens):
        c = cartao(f'{nome}.{i}', img, w, h, **kw)
        c.parent = piv
        c.location = (0, 0, i * afastamento)
        camadas.append(c)
    piv['camadas'] = [c.name for c in camadas]
    return piv, camadas
