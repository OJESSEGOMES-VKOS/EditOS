"""O motor low poly toon com nome neutro (a skill low-poly-toon).

É o MESMO módulo do kit nascido na primeira página que usou o estilo (mentedetransbordo_kit.py), não uma cópia:
`import lowpoly_kit as LP` devolve aquele módulo, então `LP.K = K`, `LP.ESTILO`, `LP.PALETA` e `LP._COR_PESSOA` são os
mesmos objetos. Mexeu no motor? Mexa no mentedetransbordo_kit.py: as duas portas enxergam a mudança.
Daqui só sai uma peça a mais, `brilha` (o nome técnico acendendo no toon), pendurada no mesmo módulo.

Uso (dentro do Blender, com sistema/kit3d e o blender/ do molde 3d-como-funciona no sys.path):
    import kit3d as K
    import lowpoly_kit as LP
    LP.K = K
    LP.estilo(sc, 'toon', 'tarde')
"""
import sys

import mentedetransbordo_kit as _motor


def brilha(objs, cor, t0, t1, luz='#FFF1A6'):
    """o "Esse é o [nome]" no toon. O `K.acende` mexe na emissão do Principled, que o material toon não tem; aqui a
    peça ganha um material só dela, pisca 2 vezes em amarelo-claro no t0, fica clara até t1 e volta à própria cor.
    `cor` é a cor normal da peça (da PALETA). Toca o som 'brilho' no t0. Devolve o material."""
    t1 = max(t1, t0 + 0.7)   # as duas piscadas cabem antes de assentar
    m = _motor.mat(cor, unico=True)
    for o in (objs if isinstance(objs, (list, tuple)) else [objs]):
        if o.data.materials:
            o.data.materials[0] = m
        else:
            o.data.materials.append(m)
    _motor.cor_em(m, [(0.0, cor), (t0, cor), (t0 + 0.12, luz), (t0 + 0.27, cor), (t0 + 0.42, luz), (t1 - 0.25, luz),
                      (t1, cor)])
    _motor.K.evento(t0, 'brilho', 0.5)
    return m


if not hasattr(_motor, 'brilha'):
    _motor.brilha = brilha
sys.modules[__name__] = _motor
