"""O começo vazio de um vídeo novo do 3d-como-funciona (JEITO.md §6.3): só o mundo, a câmera aberta e o portão.

Nada aqui vem de um vídeo pronto: nenhum objeto, nenhum elo, nenhum plano. Cada peça entra porque a fala nova pede,
na palavra que diz o que ela faz (a tabela de elos do roteiro.md manda). Copie para a pasta do vídeo:
    cp moldes/3d-como-funciona/blender/cena_vazia.py oficina/AAAA-MM-DD-3d-tema/cena.py
e rode de dentro de sistema/ (B = o caminho que tools/blender.py imprime), sempre pela trava:
    QUEM=3d sh tools/com-trava.sh "$B" -b --factory-startup -P oficina/<pasta>/cena.py -- previa 1 5 | checar | eventos | render | salvar
Precisa de palavras.json na pasta (ferramentas/alinhar.py, depois da voz).
"""
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SIS = next(p for p in AQUI.parents if (p / 'moldes' / '3d-como-funciona').is_dir())
sys.path.insert(0, str(SIS / 'moldes' / '3d-como-funciona' / 'blender'))
sys.path.insert(0, str(SIS / 'kit3d'))
import kit3d as K  # noqa: E402

# o motor: 'toon' = o low poly toon (o padrão desde 2026-11-04, skill low-poly-toon); 'maquete' = a maquete clara do
# padrão de 2026-10-22 (EEVEE com sombra macia, K.mundo_dia)
MOTOR = 'toon'

F = K.Fala(AQUI / 'palavras.json')
T = F.t                      # T('frase') = quando a frase começa; F.fim('frase') = quando termina; 'frase#2' = 2ª vez
DUR = round(F.duracao + 1.4, 2)
sc = K.cena(DUR)
if MOTOR == 'toon':
    import lowpoly_kit as LP
    LP.K = K
    LP.estilo(sc, 'toon', 'tarde')    # chame antes de criar qualquer material; cor da peça: LP.mat('#hex')
else:
    K.mundo_dia()

# ---------------------------------------------------------------- o lugar (decidido pela fala nova, não pelo exemplo)
# Chão, céu e o que cerca a coisa explicada. Pessoa, árvore, carro, casa e móvel vêm prontos (K.asset / K.pessoa,
# CC0 de kit3d-assets/); só o mecanismo explicado é feito por código.

# ---------------------------------------------------------------- os elos (um bloco por linha da tabela do roteiro.md)
# Para cada elo: a peça entra na palavra que diz o que ela faz (K.entra), o problema acontece na palavra do problema
# (seta, tremer, queda com piso), o nome acende no "Esse é o" (LP.brilha no toon; K.acende na maquete). Declare o que
# a checagem confere:
# K.foco(obj, t0, t1), K.apoio(carga, *suportes), K.esconde(obj, t0, t1), K.some(obj, t, motivo=...).

# ---------------------------------------------------------------- a câmera: (t, alvo, distância, azimute°, inclinação°, curva)
K.camera([
    (0.0, (0, 0, 1.0), 9.0, 20, 18, 'camera'),
    (DUR, (0, 0, 1.0), 8.0, 32, 16, 'degrau'),
])


def eventos():
    """sons além dos pops das entradas (K.evento(t, 'baque') no instante físico, nunca no da palavra)."""


# o portão: no toon, o do motor (prévia no próprio look e o selo cobrindo também o motor); na maquete, o do kit3d
(LP.rodar if MOTOR == 'toon' else K.rodar)(AQUI, __file__, eventos=eventos)
