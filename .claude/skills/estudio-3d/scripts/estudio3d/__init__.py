"""estudio3d: a biblioteca do Estúdio Claude + Blender 3D (testada no Blender 5.2).

Escala real: 1 unidade = 1 metro. Um celular tem 0,147 m de altura. Escala real é o que faz a
luz cair certo, o desfoque ter tamanho certo e o chanfro parecer de fábrica.

Uso típico (rodando dentro do Blender: blender -b --factory-startup -P cena.py):

    import sys; sys.path.insert(0, r'<caminho>/.claude/skills/estudio-3d/scripts')
    from estudio3d import nucleo, anima, luz, materiais, palco, dispositivos, mundos, qa
    sc = nucleo.cena_nova('9:16', segundos=6, motor='cycles', qualidade='revisao')
    m = mundos.aplicar('estudio_premium', alvo=(0, 0, 0.08))
    ...
"""
AVISOS = []


def aviso(msg):
    AVISOS.append(msg)
    print('[estudio3d] AVISO:', msg)
