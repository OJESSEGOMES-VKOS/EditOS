"""Mundos visuais: o motor anti-mesmice. Cada mundo é um pacote completo e coerente de fundo,
luz, cor, lente e assinatura de movimento. Escolha UM por filme e registre (regra de rotação:
dois filmes seguidos do mesmo cliente nunca no mesmo mundo; dois filmes seguidos do estúdio
nunca com o mesmo mundo + mesma lente).

    m = mundos.aplicar('luxo_escuro', alvo=(0, 0, 0.09), escala=1.0)
    m['paleta']['acento']  -> cor de acento do mundo
    m['camera']            -> dict com lente, fstop, inclinacao, distancia sugeridos
    m['curvas']            -> curvas de entrada/saída/câmera do mundo

Cada ficha diz para que serve e para que NÃO serve. Respeite.
"""
from . import luz as L
from . import materiais as M
from .geo import ciclorama
from .nucleo import cor

MUNDOS = {
    'estudio_premium': {
        'serve': 'eletrônico, app, SaaS, cosmético clean, qualquer produto que quer parecer caro e confiável',
        'nao_serve': 'comida, marca jovem/barulhenta, serviço emocional',
        'fundo': ('ciclorama', '#AEB0B2'),
        'recuo': 1.4,
        'rig': ('produto', {'forca': 1.0, 'quente': 5000, 'frio': 6800}),
        'cartoes': [(-0.35, -0.15, 0.25, 4.0), (0.4, 0.05, 0.3, 3.0)],
        'bandeiras': [(-0.32, 0.0), (0.32, 0.0)],
        'look': ('AgX - Medium High Contrast', 0.0),
        'paleta': {'fundo': '#D8D3CB', 'primaria': '#1E1F22', 'secundaria': '#B9B2A7', 'acento': '#2F6BFF'},
        'camera': {'lente': 85, 'fstop': 5.6, 'inclinacao': 6, 'distancia': 0.75},
        'curvas': {'entra': 'pousa', 'sai': 'decola', 'camera': 'camera', 'ui': 'firme'},
        'movimento': 'lento e preciso: push-in de 8-12% em 3 s, órbita de no máx. 25°, segura o herói 18-24 quadros',
    },
    'luxo_escuro': {
        'serve': 'perfume, joia, relógio, bebida premium, carro, cartão black, marca de alto ticket',
        'nao_serve': 'app de massa, infantil, comida do dia a dia',
        'fundo': ('piso_espelhado', '#0D0D0F', ('#16161A', '#050506')),
        'rig': ('contorno_duplo', {'forca': 1.0, 't_contorno': 3600}),
        'cartoes': [(-0.3, 0.1, 0.12, 6.0)],
        'look': ('AgX - High Contrast', 0.3),
        'intencao': 'escuro',
        'paleta': {'fundo': '#0B0B0C', 'primaria': '#1A1A1D', 'secundaria': '#3A3530', 'acento': '#C9A45C'},
        'camera': {'lente': 100, 'fstop': 2.8, 'inclinacao': 4, 'distancia': 0.9},
        'curvas': {'entra': 'premium', 'sai': 'premium', 'camera': 'camera', 'ui': 'premium'},
        'movimento': 'muito lento: travelling lateral, luz que varre o objeto (animar a régua de contorno), nada salta',
    },
    'pop_candy': {
        'serve': 'app de consumo, marca jovem, bebida colorida, snack, brinquedo, beleza divertida',
        'nao_serve': 'jurídico, saúde séria, luxo',
        'fundo': ('ciclorama', '#F7B8C8'),
        'recuo': 1.4,
        'rig': ('softbox_topo', {'forca': 1.1, 'frio': 7500}),
        'cartoes': [],
        'look': ('AgX - Punchy', 0.15),
        'paleta': {'fundo': '#FFC9D6', 'primaria': '#FF4F7B', 'secundaria': '#FFD23F', 'acento': '#3DDC97'},
        'camera': {'lente': 50, 'fstop': 8.0, 'inclinacao': 10, 'distancia': 0.7},
        'curvas': {'entra': 'ressalta', 'sai': 'decola', 'camera': 'firme', 'ui': 'ressalta'},
        'movimento': 'quicado e com overshoot: entradas com mola, squash leve, cortes no tempo da batida',
    },
    'vidro_cromo': {
        'serve': 'tech, IA, fintech, cripto, produto com vidro/metal, SaaS que quer parecer futuro',
        'nao_serve': 'orgânico, artesanal, comida',
        'fundo': ('piso_espelhado', '#0B0D11', ('#2B3240', '#07080B')),
        'rig': ('produto', {'forca': 0.7, 'quente': 6000, 'frio': 9000}),
        'cartoes': [(-0.3, -0.1, 0.35, 8.0), (0.3, -0.1, 0.35, 8.0), (0.0, 0.25, 0.5, 5.0)],
        'bandeiras': [(-0.45, 0.0), (0.45, 0.0)],
        'look': ('AgX - Medium High Contrast', 0.2),
        'paleta': {'fundo': '#0A0C10', 'primaria': '#D7DCE3', 'secundaria': '#5B6B82', 'acento': '#6CF0FF'},
        'camera': {'lente': 70, 'fstop': 4.0, 'inclinacao': 8, 'distancia': 0.8},
        'curvas': {'entra': 'pousa', 'sai': 'decola', 'camera': 'premium', 'ui': 'firme'},
        'movimento': 'órbita contínua lenta + reflexos correndo na superfície (os cartões andam, o objeto quase parado)',
    },
    'neon_noturno': {
        'serve': 'game, app noturno, música, evento, energia, marca urbana, tech jovem',
        'nao_serve': 'saúde, jurídico, produto que precisa mostrar cor real',
        'fundo': ('piso_espelhado', '#0A0B12', ('#120F24', '#04040A')),
        'rig': ('neon', {'forca': 1.0, 'cor_a': '#FF2E88', 'cor_b': '#2EE6FF'}),
        'cartoes': [],
        'nevoa': 0.015,
        'look': ('AgX - Medium High Contrast', 1.0),
        'intencao': 'escuro',
        'paleta': {'fundo': '#07070D', 'primaria': '#15131F', 'secundaria': '#FF2E88', 'acento': '#2EE6FF'},
        'camera': {'lente': 35, 'fstop': 2.8, 'inclinacao': 3, 'distancia': 0.6},
        'curvas': {'entra': 'pousa', 'sai': 'decola', 'camera': 'firme', 'ui': 'pousa'},
        'movimento': 'rápido e no beat: whip pans, cortes secos, luz piscando em sincronia',
    },
    'luz_natural': {
        'serve': 'serviço local, saúde, casa, bem-estar, comida, café, artesanal, marca humana',
        'nao_serve': 'tech futurista, luxo noturno',
        'fundo': ('ciclorama', '#D9CCB8'),
        'recuo': 1.2,
        'rig': ('janela', {'forca': 1.0}),
        'gobo': 'persiana',
        'cartoes': [],
        'look': ('AgX - Base Contrast', 0.2),
        'paleta': {'fundo': '#E9DFD0', 'primaria': '#3E3328', 'secundaria': '#A88B6A', 'acento': '#5E8C61'},
        'camera': {'lente': 50, 'fstop': 2.8, 'inclinacao': 12, 'distancia': 0.8},
        'curvas': {'entra': 'suave', 'sai': 'suave', 'camera': 'camera', 'ui': 'suave'},
        'movimento': 'respirado: câmera na mão sutil, luz do sol que anda, poeira no ar',
    },
    'argila': {
        'serve': 'explicar serviço/processo, app amigável, educação, saúde acessível, marca leve',
        'nao_serve': 'luxo, produto que precisa de realismo de material',
        'fundo': ('ciclorama', '#E8C6B3'),
        'recuo': 1.4,
        'rig': ('softbox_topo', {'forca': 0.9, 'frio': 6500}),
        'cartoes': [],
        'look': ('AgX - Base Contrast', 0.35),
        'paleta': {'fundo': '#F3D9C9', 'primaria': '#E07A5F', 'secundaria': '#81B29A', 'acento': '#3D405B'},
        'camera': {'lente': 65, 'fstop': 5.6, 'inclinacao': 18, 'distancia': 0.8},
        'curvas': {'entra': 'ressalta', 'sai': 'decola', 'camera': 'firme', 'ui': 'ressalta'},
        'movimento': 'brinquedo: objetos entram com mola, giram de leve, tudo arredondado',
    },
}


def aplicar(nome, alvo=(0, 0, 0), escala=1.0, raio_ciclorama=None):
    """monta fundo, luz, cartões, névoa e cor do mundo. Devolve a ficha + objetos criados.
    Os 7 mundos daqui são calibrados à mão; qualquer outro id de `mundos.json` (19 no total) é
    montado pela ficha em `mundos_ficha.aplicar_ficha`."""
    if nome not in MUNDOS:
        from . import mundos_ficha
        fichas = mundos_ficha.carregar()
        if nome not in fichas:
            raise KeyError(f'mundo desconhecido: {nome}. Disponíveis: {sorted(set(MUNDOS) | set(fichas))}')
        return mundos_ficha.aplicar_ficha(fichas[nome], alvo, escala)
    ficha = dict(MUNDOS[nome])
    look, exp = ficha['look']
    cor(look=look, exposicao=exp)
    criados = {}
    fundo = ficha['fundo']
    if fundo[0] == 'ciclorama':
        L.mundo_gradiente(fundo[1], fundo[1], forca=0.6, luz_ambiente=0.25)
        criados['fundo'] = ciclorama(largura=8 * escala, profundidade=4 * escala, altura=4 * escala,
                                     raio=raio_ciclorama or 0.9 * escala, mat=M.fundo(fundo[1]))
        criados['fundo'].location.y = alvo[1] + ficha.get('recuo', 0.6) * escala
    elif fundo[0] == 'piso_espelhado':
        topo, base = fundo[2]
        L.mundo_gradiente(topo, base, forca=1.0, luz_ambiente=0.2)
        criados['fundo'] = ciclorama(largura=10 * escala, profundidade=6 * escala, altura=6 * escala,
                                     raio=1.5 * escala, mat=M.piso_espelhado(fundo[1]))
        criados['fundo'].location.y = alvo[1] + 1.2 * escala
    elif fundo[0] == 'gradiente':
        L.mundo_gradiente(fundo[1], fundo[2], forca=1.0, luz_ambiente=0.3)
    rig_nome, kw = ficha['rig']
    criados['luzes'] = L.rig(rig_nome, alvo, escala=escala, **kw)
    criados['cartoes'] = []
    for i, (x, z, larg, forca) in enumerate(ficha.get('cartoes', [])):
        pos = (alvo[0] + x * escala, alvo[1] - 0.25 * escala, alvo[2] + z * escala)
        criados['cartoes'].append(L.cartao_reflexo(f'cartao_{i}', pos, alvo, larg * escala, larg * 0.4 * escala, forca))
    if ficha.get('gobo') == 'persiana' and 'sol' in criados['luzes']:
        criados['gobo'] = L.persiana(alvo, criados['luzes']['sol'], escala)
    criados['bandeiras'] = []
    for i, (x, z) in enumerate(ficha.get('bandeiras', [])):
        pos = (alvo[0] + x * escala, alvo[1] + 0.05 * escala, alvo[2] + z * escala)
        criados['bandeiras'].append(L.bandeira(f'bandeira_{i}', pos, alvo, 0.5 * escala, 0.9 * escala))
    if ficha.get('nevoa'):
        criados['nevoa'] = L.nevoa(ficha['nevoa'], tamanho=4 * escala, centro=(alvo[0], alvo[1] + 0.5 * escala, alvo[2] + 1.0 * escala))
    ficha['criados'] = criados
    ficha['nome'] = nome
    return ficha
