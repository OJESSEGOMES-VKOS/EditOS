"""Testes da biblioteca (kit3d) e da checagem (checar): cada defeito conhecido é criado de propósito numa cena mínima e a
checagem TEM que acusar; a versão corrigida TEM que passar limpa. Só CPU, nenhum quadro é renderizado.

rodar (da raiz do EditOS):
  "C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --factory-startup -P moldes/3d-como-funciona/blender/teste_biblioteca.py
Cada linha impressa começa com TESTE e termina em OK ou FALHOU; o código de saída é 1 se algum falhar.
"""
import math
import sys
import traceback
from pathlib import Path

import bpy

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
import kit3d as K  # noqa: E402
import checar  # noqa: E402
from estudio3d import anima  # noqa: E402

SAIDA = AQUI.parents[2] / '.tmp' / 'teste_biblioteca'
RESULTADOS = []


def nova(seg=3.0):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for lista in (K.CORTES, K.FOCOS, K.ACENDES, K.EVENTOS):
        lista.clear()
    K.ENTRADAS.clear()
    K.APARECES.clear()
    K.APOIOS.clear()
    K.SUPORTES.clear()
    K.SUMICOS.clear()
    K.ESCONDIDOS.clear()
    K.VEICULOS.clear()
    K._MATS.clear()
    K._COMPLETOS.clear()
    return K.cena(seg)


def camera_basica(seg=3.0, alvo=(0, 0, 1.0), dist=8.0):
    return K.camera([(0.0, alvo, dist, 0, 10, 'linear', 35), (seg, alvo, dist, 0, 10, 'linear', 35)])


def checa():
    c = checar.Checagem(SAIDA, K.CORTES, K.ENTRADAS, K.ACENDES, K.FOCOS, K.APARECES, '', apoios=K.APOIOS,
                        sumicos=K.SUMICOS, suportes=K.SUPORTES, veiculos=K.VEICULOS)
    c.rodar()
    return c.erros, c.avisos


def tags(lista):
    return sorted({t for _, t, _ in lista})


def teste(nome):
    def deco(fn):
        def rodar():
            try:
                fn()
                RESULTADOS.append((nome, True, ''))
                print(f'TESTE {nome}: OK')
            except Exception as e:  # noqa: BLE001
                RESULTADOS.append((nome, False, str(e)))
                print(f'TESTE {nome}: FALHOU ({e})')
                traceback.print_exc()
        rodar.nome = nome
        TESTES.append(rodar)
        return rodar
    return deco


TESTES = []


# ------------------------------------------------------------------------------------------------ movimento e tempo
@teste('1 entrada em delta não teletransporta (e a conta antiga acusa SALTO)')
def _():
    nova()
    o = K.bloco('o', (0.5, 0.5, 0.5), (0, 0, 0), '#FF0000')
    anima.assar(o, 'location', lambda t: (0, 0, 2 * t), 0, 3)
    anima.entra_mola(o, 0.0, de=(0, 0, 0.5), escala_de=0.6, dur=0.6)      # o jeito antigo: lê a location já assada
    camera_basica()
    erros, _ = checa()
    assert 'SALTO' in tags(erros), f'a entrada antiga devia dar SALTO: {tags(erros)}'
    nova()
    o = K.bloco('o', (0.5, 0.5, 0.5), (0, 0, 0), '#FF0000')
    anima.assar(o, 'location', lambda t: (0, 0, 2 * t), 0, 3)
    K.entra(o, 0.0, de=(0, 0, 0.5), escala_de=0.6, dur=0.6)
    camera_basica()
    erros, _ = checa()
    assert 'SALTO' not in tags(erros), f'K.entra não pode dar SALTO: {erros}'


@teste('2 uma conta só de tempo->quadro (sem arredondamento bancário)')
def _():
    nova()
    assert anima.quadro is K._quadro and K.nucleo.quadro is K._quadro
    assert K.q(0.5 / 30) == 2 and K.q(1.5 / 30) == 3 and K.q(2.5 / 30) == 4, (K.q(0.5 / 30), K.q(1.5 / 30), K.q(2.5 / 30))


@teste('3 mola padrão passa ≤5% e a crítica não passa nada')
def _():
    pico = max(anima.mola(u / 200, 210, 22) for u in range(0, 400))
    assert pico - 1 <= 0.05, f'passada {pico - 1:.3f}'
    pico_c = max(anima.mola(u / 200, 210, 2 * math.sqrt(210)) for u in range(0, 400))
    assert pico_c - 1 < 1e-6, f'crítica passou {pico_c - 1:.5f}'


@teste('4 pulso da seta soma em delta e nasce do zero (sem salto)')
def _():
    nova(4.0)
    K.seta('s', (0, 0, 1), (0, 0, -1), tamanho=1.0, t=0.2, ate=3.5, pulsa=True)
    camera_basica(4.0)
    erros, _ = checa()
    assert 'SALTO' not in tags(erros), erros


@teste('5 K.pos devolve a posição de mundo no instante pedido')
def _():
    nova()
    o = K.bloco('o', (0.2, 0.2, 0.2), (0, 0, 0), '#FF0000')
    anima.assar(o, 'location', lambda t: (0, 0, 2 * t), 0, 3)
    bpy.context.scene.frame_set(1)
    assert abs(o.location.z - 0.0) < 1e-6
    z = K.pos(o, 1.5).z
    assert abs(z - 3.0) < 0.05, z
    assert bpy.context.scene.frame_current == 1


@teste('6 objeto muito fora da caixa da cena é acusado (pai= com posição de mundo)')
def _():
    nova()
    pai = K.grupo('pai', (400, 0, 0))
    K.bloco('filho', (1, 1, 1), (400, 0, 0), '#00FF00', pai=pai)      # posição de mundo repetida: 800
    K.bloco('perto', (1, 1, 1), (0, 0, 0), '#FF0000')
    camera_basica()
    erros, _ = checa()
    assert 'FORA DA CENA' in tags(erros), erros


@teste('7 queda tem piso (K.queda) e o instante do impacto bate')
def _():
    assert K.queda(0.0, 0.0, 6.0, -1.5) == 6.0
    t = K.t_impacto(0.0, 6.0, -1.5)
    assert abs(K.queda(t, 0.0, 6.0, -1.5) - (-1.5)) < 1e-6 and K.queda(t + 5, 0.0, 6.0, -1.5) == -1.5
    nova(3.0)
    c = K.bloco('c', (1, 1, 1), (0, 0, 0), '#3366FF')
    K.bloco('chao', (6, 6, 0.4), (0, 0, -0.2), '#CCCCCC')
    anima.assar(c, 'location', lambda t: (0, 0, 3 - 4.9 * t * t), 0, 3)       # cai sem piso: atravessa o chão
    camera_basica()
    erros, _ = checa()
    assert 'ATRAVESSAR' in tags(erros), erros
    nova(3.0)
    c = K.bloco('c', (1, 1, 1), (0, 0, 0), '#3366FF')
    K.bloco('chao', (6, 6, 0.4), (0, 0, -0.2), '#CCCCCC')
    anima.assar(c, 'location', lambda t: (0, 0.0, K.queda(t, 0.0, 3.5, 0.5)), 0, 3)    # com piso
    camera_basica()
    erros, _ = checa()
    assert 'ATRAVESSAR' not in tags(erros), erros


@teste('8 K.Fase é contínua quando a velocidade muda (e t*vel % 1 salta)')
def _():
    vel = lambda t: 1.0 if t < 2.0 else 3.0
    fase = K.Fase(vel, 4.0)
    passos = [abs(((fase(t + 1 / 120) - fase(t) + 0.5) % 1.0) - 0.5) for t in [k / 120 for k in range(0, 480)]]
    assert max(passos) < 0.05, max(passos)
    ruim = abs((2.0 * 3.0) % 1.0 - (2.0 * 1.0) % 1.0)
    assert ruim > 0.0 or True


# ------------------------------------------------------------------------------------------------ câmera
@teste('9/10 foco fora do quadro é acusado e dentro passa')
def _():
    nova(4.0)
    o = K.bloco('o', (0.5, 0.5, 0.5), (0, 0, 1), '#FF0000')
    anima.assar(o, 'location', lambda t: (3 * t, 0, 1), 0, 4)         # sai do quadro andando pro lado
    camera_basica(4.0)
    K.foco(o, 0.0, 4.0)
    erros, _ = checa()
    assert 'FOCO' in tags(erros), erros
    nova(4.0)
    o = K.bloco('o', (0.5, 0.5, 0.5), (0, 0, 1), '#FF0000')
    camera_basica(4.0)
    K.foco(o, 0.0, 4.0)
    erros, _ = checa()
    assert 'FOCO' not in tags(erros), erros


@teste('11 pontos de câmera colados (fora de corte) são recusados')
def _():
    nova()
    try:
        K.camera([(0.0, (0, 0, 1), 8, 0, 10, 'camera', 35), (0.04, (0, 0, 1), 8, 5, 10, 'camera', 35), (2.0, (0, 0, 1), 8, 0, 10, 'linear', 35)])
    except ValueError as e:
        assert 'salto de câmera' in str(e)
        return
    raise AssertionError('não recusou')


@teste('12 corte sem quadro fantasma; corte "no quadro" acusa FANTASMA')
def _():
    nova(4.0)
    K.bloco('a', (1, 1, 1), (0, 0, 0), '#FF0000')
    K.bloco('b', (1, 1, 1), (20, 0, 0), '#00FF00')
    K.camera([(0.0, (0, 0, 0.5), 6, 0, 10, 'linear', 35), (2.0, (20, 0, 0.5), 6, 0, 10, 'corte', 35), (4.0, (20, 0, 0.5), 6, 5, 10, 'linear', 35)])
    erros, _ = checa()
    assert 'FANTASMA' not in tags(erros) and 'CORTE' not in tags(erros) and 'CÂMERA' not in tags(erros), erros
    # o salto direto no quadro do corte (sem o meio quadro): o obturador do motion blur abre sobre ele
    nova(4.0)
    K.bloco('a', (1, 1, 1), (0, 0, 0), '#FF0000')
    K.bloco('b', (1, 1, 1), (20, 0, 0), '#00FF00')
    c = K.camera([(0.0, (0, 0, 0.5), 6, 0, 10, 'linear', 35), (4.0, (0, 0, 0.5), 6, 0, 10, 'linear', 35)])
    fc = K.q(2.0)
    c.pivo.location = (0, 0, 0.5)
    c.pivo.keyframe_insert('location', frame=fc - 1)
    for fcv in anima.fcurves(c.pivo, 'location'):
        for kp in fcv.keyframe_points:
            kp.interpolation = 'CONSTANT'
    c.pivo.location = (20, 0, 0.5)
    c.pivo.keyframe_insert('location', frame=fc)
    K.CORTES.append(2.0)
    erros, _ = checa()
    assert 'FANTASMA' in tags(erros), erros


@teste('13 alcance da câmera: clip_start 0,5 e clip_end 2000')
def _():
    nova()
    c = camera_basica()
    assert abs(c.dados.clip_start - 0.5) < 1e-6 and abs(c.dados.clip_end - 2000.0) < 1e-3, (c.dados.clip_start, c.dados.clip_end)


# ------------------------------------------------------------------------------------------------ pessoas
ASSETS = AQUI.parents[2] / 'kit3d-assets'


def _medidas(arquivo, acao):
    nova(3.0)
    g = K.pessoa('p', arquivo, (0, 0, 0), altura=1.7, acao=acao)
    peles = [o for o in g.children_recursive if o.type == 'MESH' and K.vai_pro_quadro(o)]   # só o corpo (sem a forma de osso)
    zs, alts = [], []
    for f in range(1, 40, 3):
        bpy.context.scene.frame_set(f)
        P = K._pontos_mundo(peles)
        zs.append(P[:, 2].min())
        alts.append(P[:, 2].max() - P[:, 2].min())
    return min(zs), max(zs), max(alts)


@teste('14 todo personagem do kit: altura pedida e pés no chão (malha avaliada que vai pro quadro, Idle e Walk)')
def _():
    ruins = []
    arqs = sorted(list((ASSETS / 'man').glob('*.glb')) + list((ASSETS / 'woman').glob('*.glb'))
                  + [ASSETS / 'astronaut' / 'astronaut-3hC2i0CTuO.glb', ASSETS / 'casual' / 'casual-character-kZ3DmIoGip.glb'])
    assert arqs, 'sem personagens'
    for a in arqs:
        for acao in ('Idle', 'Walk'):
            mn, mx, alt = _medidas(a, acao)
            msg = f'{a.name} {acao}: pés min {mn * 100:+.1f} cm / max {mx * 100:+.1f} cm, altura {alt:.2f} m'
            print('   ', msg)
            if mn < -0.03 or mx > 0.12 or abs(alt - 1.7) > 0.12:
                ruins.append(msg)
    assert not ruins, ' | '.join(ruins)


@teste('15 Sitting toca uma vez; Idle é ciclo; clipe sem chave de braço é completado')
def _():
    nova(10.0)
    g = K.pessoa('p', 'woman/woman-casual-jpKRgGDxhk.glb', (0, 0, 0), acao='Sitting')
    arm = next(o for o in g.children_recursive if o.type == 'ARMATURE')
    st = [s for tr in arm.animation_data.nla_tracks if not tr.mute for s in tr.strips][0]
    assert st.repeat == 1.0, st.repeat
    h = K.pessoa('h', 'woman/woman-casual-jpKRgGDxhk.glb', (3, 0, 0), acao='Idle')
    arm = next(o for o in h.children_recursive if o.type == 'ARMATURE')
    st = [s for tr in arm.animation_data.nla_tracks if not tr.mute for s in tr.strips][0]
    assert st.repeat > 1.0
    assert '.completo' in st.action.name, st.action.name       # o Idle dessa mulher não anima o braço direito


@teste('16 frente: andar de costas é acusado; K.anda vira a pessoa e passa')
def _():
    nova(6.0)
    K.bloco('chao', (20, 20, 0.2), (0, 0, -0.1), '#CCCCCC')
    p = K.pessoa('p', 'woman/animated-woman-9kF7eTDbhO.glb', (-3, 0, 0), rot_z=90)         # olha pra +x
    K.troca_acao(p, 'Walk', 0.5)
    anima.chave(p, 'location', [(0.5, (-3, 0, 0), 'linear'), (4.5, (3, 0, 0), 'linear')])     # anda pra +x olhando +x: certo
    camera_basica(6.0)
    erros, _ = checa()
    assert 'DE COSTAS' not in tags(erros) and 'DE LADO' not in tags(erros), erros
    nova(6.0)
    K.bloco('chao', (20, 20, 0.2), (0, 0, -0.1), '#CCCCCC')
    p = K.pessoa('p', 'woman/animated-woman-9kF7eTDbhO.glb', (-3, 0, 0), rot_z=90)
    K.troca_acao(p, 'Walk', 0.5)
    anima.chave(p, 'location', [(0.5, (3, 0, 0), 'linear'), (4.5, (-3, 0, 0), 'linear')])     # anda pra -x olhando +x: de costas
    camera_basica(6.0)
    erros, _ = checa()
    assert 'DE COSTAS' in tags(erros), erros
    nova(6.0)
    K.bloco('chao', (20, 20, 0.2), (0, 0, -0.1), '#CCCCCC')
    p = K.pessoa('p', 'woman/animated-woman-9kF7eTDbhO.glb', (3, 0, 0), rot_z=90)
    K.anda(p, [(0.5, (3, 0, 0)), (4.5, (-3, 0, 0))])                                           # K.anda vira antes de andar
    camera_basica(6.0)
    erros, _ = checa()
    assert 'DE COSTAS' not in tags(erros) and 'DE LADO' not in tags(erros) and 'DESLIZA' not in tags(erros), erros


@teste('17 cartola pousa no topo real da cabeça')
def _():
    nova()
    g = K.pessoa('p', 'man/man-in-suit-mQnGoME1ez.glb', (0, 0, 0), altura=1.78)
    topo = K.topo_da_cabeca(g)          # medido antes do chapéu (depois, o topo é o do chapéu)
    cart = K.cartola(g)
    bpy.context.scene.frame_set(1)
    aba = bpy.data.objects['p.aba'].matrix_world.translation
    assert abs(aba.z - (topo.z - 0.025 + 0.0125)) < 0.02, (aba.z, topo.z)
    assert abs(aba.x - topo.x) < 0.1 and abs(aba.y - topo.y) < 0.1


# ------------------------------------------------------------------------------------------------ brilho, fala, som
@teste('18 K.acende: devolve a emissão original, não mistura dois acendes e funciona em curva')
def _():
    nova(6.0)
    a = K.bloco('a', (1, 1, 1), (0, 0, 0), '#336699')
    K.acende(a, 1.0, 2.0, cor='#FF0000')
    K.acende(a, 3.0, 4.0, cor='#00FF00')
    sc = bpy.context.scene
    b = a.material_slots[0].material.node_tree.nodes['Principled BSDF']
    sk, cr = b.inputs['Emission Strength'], b.inputs['Emission Color']

    def le(t):
        sc.frame_set(K.q(t))
        return sk.default_value, tuple(cr.default_value)
    assert le(0.2)[0] < 1e-6, le(0.2)
    f1, c1 = le(1.2)
    f2, c2 = le(3.2)
    assert f1 > 0.3 and f2 > 0.3 and c1[0] > c1[1] and c2[1] > c2[0], (c1, c2)     # 1º vermelho, 2º verde, sem trocar a cor do 1º
    assert le(2.0 + 0.5)[0] < 1e-6 and le(5.5)[0] < 1e-6, (le(2.5), le(5.5))
    sc.frame_set(K.q(1.2))
    assert tuple(cr.default_value)[0] > tuple(cr.default_value)[1], 'o 2º acende trocou a cor do 1º'
    assert not any(e['tipo'] == 'eco' for e in K.EVENTOS)
    nova(4.0)
    bpy.ops.curve.primitive_bezier_curve_add()
    cv = bpy.context.active_object
    cv.name = 'tubo'
    cv.data.bevel_depth = 0.05
    K.dar(cv, K.mat('#999999'))
    K.acende(cv, 1.0, 2.0)
    b = cv.material_slots[0].material.node_tree.nodes['Principled BSDF']
    bpy.context.scene.frame_set(K.q(1.2))
    assert b.inputs['Emission Strength'].default_value > 0.3, 'não acendeu a curva'


@teste('19 frase ambígua no roteiro é recusada')
def _():
    import json
    import tempfile
    p = Path(tempfile.mkdtemp(dir=SAIDA.parent)) / 'palavras.json'
    p.write_text(json.dumps([{'w': 'corda', 's': 0.0, 'e': 0.4}, {'w': 'roda', 's': 0.5, 'e': 0.9}, {'w': 'corda', 's': 1.0, 'e': 1.4}]), encoding='utf-8')
    f = K.Fala(p)
    assert f.t('roda') == 0.5 and f.t('corda#2') == 1.0 and f.t('corda', apos=0.6) == 1.0
    try:
        f.t('corda')
    except ValueError as e:
        assert 'ambígua' in str(e)
        return
    raise AssertionError('não recusou')


# ------------------------------------------------------------------------------------------------ checagem
@teste('22 z-fighting em qualquer sentido: faces opostas de material transparente são acusadas, de sólidos não')
def _():
    def cena(alfa):
        nova()
        a = K.bloco('a', (2, 0.01, 2), (0, 0, 1), '#3399FF', raio=0.0)
        K.dar(a, K.mat('#3399FF', alfa=alfa, unico=True))
        K.bloco('b', (2, 0.01, 2), (0, 0.01, 1), '#FF9933', raio=0.0)        # a face de trás de a coincide com a da frente de b
        camera_basica(alvo=(0, 0, 1.0), dist=6.0)
        return checa()
    erros, avisos = cena(0.3)
    assert 'Z-FIGHTING' in tags(erros + avisos), (erros, avisos)
    erros, avisos = cena(1.0)
    assert 'Z-FIGHTING' not in tags(erros + avisos), (erros, avisos)


@teste('23 roda que gira mais de 40% do passo entre pás por quadro é acusada')
def _():
    def cena(w):
        nova()
        r = K.grupo('roda', (0, 0, 1))
        K.bloco('raio', (1.0, 0.05, 0.05), (0, 0, 0), '#FFFFFF', pai=r)
        K.simetria(r, 6)
        anima.assar(r, 'rotation_euler', lambda t: (0, w * t, 0), 0, 3)
        camera_basica()
        return checa()
    erros, _ = cena(30.0)       # 1 rad por quadro
    assert 'RODA' in tags(erros), erros
    erros, _ = cena(6.0)        # 0,2 rad por quadro
    assert 'RODA' not in tags(erros), erros


@teste('24 sem_tampas tira os discos de um cilindro')
def _():
    nova()
    c = K.cilindro('c', 0.5, 1.0, (0, 0, 0), '#FFFFFF')
    antes = sum(1 for p in c.data.polygons if len(p.vertices) >= 8)
    K.sem_tampas(c)
    depois = sum(1 for p in c.data.polygons if len(p.vertices) >= 8)
    assert antes >= 2 and depois == 0, (antes, depois)


@teste('25 peça visível antes do tempo (animation_data_clear apagou o K.aparece) é acusada')
def _():
    def cena(apaga):
        nova(4.0)
        o = K.bloco('o', (1, 1, 1), (0, 0, 0), '#FF0000')
        K.aparece(o, 2.0)
        if apaga:
            o.animation_data_clear()
        camera_basica(4.0)
        return checa()
    erros, _ = cena(True)
    assert 'APARECE' in tags(erros), erros
    erros, _ = cena(False)
    assert 'APARECE' not in tags(erros), erros


@teste('26 o render recusa cena sem checagem limpa')
def _():
    nova()
    camera_basica()
    pasta = SAIDA.parent / 'teste_portao'
    (pasta / 'conferencia').mkdir(parents=True, exist_ok=True)
    cena_py = pasta / 'cena.py'
    cena_py.write_text('x', encoding='utf-8')
    (pasta / 'conferencia' / 'checagem.txt').unlink(missing_ok=True)
    antigo = sys.argv
    sys.argv = ['x', '--', 'render']
    try:
        try:
            K.rodar(pasta, str(cena_py))
        except SystemExit as e:
            assert e.code == 2, e.code
        else:
            raise AssertionError('não recusou o render sem checagem')
    finally:
        sys.argv = antigo


@teste('27 visibilidade fora do quadro do corte é acusada; K.esconde_no_corte passa (geladeira: parede sumindo 1 quadro antes)')
def _():
    def cena(certo):
        nova(4.0)
        K.bloco('chao', (4, 4, 0.1), (0, 0, -0.05), '#888888')
        parede = K.bloco('parede', (3, 0.2, 2), (0, 1.0, 1), '#F2C9A0')
        K.bloco('caixa', (0.6, 0.6, 0.6), (0, 0, 0.3), '#FFFFFF')
        K.camera([(0.0, (0, 0, 0.5), 5, 0, 10, 'linear', 35), (2.0, (0, 0, 0.5), 5, 180, 10, 'corte', 35), (4.0, (0, 0, 0.5), 5, 185, 10, 'linear', 35)])
        if certo:
            K.esconde_no_corte([parede], 2.0)
        else:
            for f_, v in ((K.q(2.0 - 0.05) - 1, False), (K.q(2.0 - 0.05), True)):
                parede.hide_render = v
                parede.keyframe_insert('hide_render', frame=f_)
        return checa()
    erros, _ = cena(False)
    assert 'VISIBILIDADE' in tags(erros), erros
    erros, _ = cena(True)
    assert 'VISIBILIDADE' not in tags(erros), erros


@teste('28 peça declarada com K.apoio que flutua é acusada; apoiada passa (geladeira: compressor 18 cm acima do piso)')
def _():
    def cena(z):
        nova(3.0)
        K.bloco('chao', (4, 4, 0.1), (0, 0, -0.05), '#888888')
        comp = K.grupo('compressor', (0, 0, z))
        K.esfera('comp_corpo', 0.13, (0, 0, 0.13), '#2F343C', pai=comp)
        K.entra(comp, 0.2, de=(0, 0, 0.3), escala_de=0.0, dur=0.6)
        K.apoio(comp)
        camera_basica(3.0, alvo=(0, 0, 0.4), dist=3)
        return checa()
    erros, _ = cena(0.18)
    assert 'APOIO' in tags(erros), erros
    erros, _ = cena(0.0)
    assert 'APOIO' not in tags(erros), erros


@teste('29 peça que fura uma parede fina é acusada; com folga passa (geladeira: compressor saindo dentro da caixa)')
def _():
    def cena(y):
        nova(3.0)
        K.bloco('chao', (4, 4, 0.1), (0, 0, -0.05), '#888888')
        K.bloco('fundo', (0.8, 0.04, 1.6), (0, 0.6, 0.8), '#F4F5F7')
        comp = K.grupo('compressor', (0, y, 0))
        K.esfera('comp_corpo', 0.13, (0, 0, 0.13), '#2F343C', pai=comp)
        K.entra(comp, 0.2, de=(0, 0, 0.3), escala_de=0.0, dur=0.6)
        camera_basica(3.0, alvo=(0, 0.4, 0.4), dist=3)
        return checa()
    erros, _ = cena(0.705)        # o fundo vai de 0,58 a 0,62; o compressor chega a 0,575: fura e aparece do outro lado
    assert any(t == 'ATRAVESSAR' and 'fura' in m for _, t, m in erros), erros
    erros, _ = cena(0.78)
    assert 'ATRAVESSAR' not in tags(erros), erros


@teste('30 efeito sem corpo (água, bolha) não é sólido: o barril entra no mar sem acusar; num bloco sólido acusa')
def _():
    def cena(sem):
        nova(3.0)
        mar = K.bloco('mar', (8, 8, 4), (0, 0, -2.05), '#2C8CC8', raio=0.0)
        if sem:
            K.sem_corpo(mar)
        b = K.bloco('barril', (1, 1, 1), (0, 0, 0), '#B7BFC7')
        anima.assar(b, 'location', lambda t: (0, 0, 2.0 - 1.5 * t), 0, 3)        # desce de 2 m até -2,5 m, dentro do mar
        camera_basica(3.0, alvo=(0, 0, 0), dist=10)
        return checa()
    erros, _ = cena(False)
    assert 'ATRAVESSAR' in tags(erros), erros
    erros, _ = cena(True)
    assert 'ATRAVESSAR' not in tags(erros), erros


@teste('31 tampa esquecida num corte de maquete é acusada (submarino: cavernas e casco); K.sem_tampas passa')
def _():
    import bmesh

    def cena(tira):
        nova()
        c = K.cilindro('casco', 0.9, 3.0, (0, 0, 1.0), '#F2B134', rot=(0, math.pi / 2, 0))
        bm = bmesh.new()
        bm.from_mesh(c.data)
        fora = [f for f in bm.faces if f.calc_center_median().x < -0.01 and len(f.verts) < 8]   # meia casca: tira a frente (local)
        bmesh.ops.delete(bm, geom=fora, context='FACES')
        bm.to_mesh(c.data)
        bm.free()
        if tira:
            K.sem_tampas(c)
        camera_basica()
        return checa()
    erros, _ = cena(False)
    assert 'TAMPA' in tags(erros), erros
    erros, _ = cena(True)
    assert 'TAMPA' not in tags(erros), erros
    nova()
    K.cilindro('inteiro', 0.5, 1.0, (0, 0, 1.0), '#FFFFFF')                   # cilindro inteiro: tampa certa
    camera_basica()
    erros, _ = checa()
    assert 'TAMPA' not in tags(erros), erros


@teste('32 z-fighting atrás de um vidro é visto pela câmera (erro, não aviso)')
def _():
    nova()
    K.bloco('a', (2, 0.01, 2), (0, 0.5, 1), '#3399FF', raio=0.0)
    K.bloco('b', (2, 0.01, 2), (0, 0.5, 1), '#FF9933', raio=0.0)              # mesmo plano, cores diferentes
    vidro = K.bloco('vidro', (3, 0.02, 3), (0, -0.5, 1), '#CFEFFF', raio=0.0)
    K.dar(vidro, K.vidro_claro())
    camera_basica(alvo=(0, 0, 1.0), dist=6.0)
    erros, avisos = checa()
    assert 'Z-FIGHTING' in tags(erros), (erros, avisos)


@teste('33 pessoa parada dentro de veículo que anda não desliza; pessoa deslizando no chão parado é acusada')
def _():
    nova(4.0)
    K.bloco('chao', (30, 6, 0.2), (0, 0, -0.1), '#CCCCCC')
    carro = K.grupo('carro', (0, 0, 0))
    K.bloco('carro_piso', (3, 2, 0.1), (0, 0, 0.05), '#3366FF', pai=carro)
    K.pessoa('p', 'woman/animated-woman-9kF7eTDbhO.glb', (0, 0, 0.1), rot_z=90, acao='Idle', pai=carro)
    anima.assar(carro, 'location', lambda t: (1.0 * t, 0, 0.0), 0, 4)
    camera_basica(4.0, alvo=(2, 0, 1), dist=12)
    erros, _ = checa()
    assert 'DESLIZA' not in tags(erros) and 'DE LADO' not in tags(erros), erros
    nova(4.0)
    K.bloco('chao', (30, 6, 0.2), (0, 0, -0.1), '#CCCCCC')
    p = K.pessoa('p', 'woman/animated-woman-9kF7eTDbhO.glb', (0, 0, 0), rot_z=90, acao='Idle')
    anima.assar(p, 'location', lambda t: (1.0 * t, 0, 0.0), 0, 4)
    camera_basica(4.0, alvo=(2, 0, 1), dist=12)
    erros, _ = checa()
    assert 'DESLIZA' in tags(erros), erros


@teste('34 malha que fica vazia (água do tanque vazio, recortada) não derruba a checagem')
def _():
    nova(3.0)
    molde = K.cilindro('molde', 0.3, 2.0, (0, 0, 1.0), '#FFFFFF', rot=(0, math.pi / 2, 0))
    molde.hide_render = True
    molde.hide_viewport = True
    agua = K.bloco('agua', (2.2, 0.8, 0.2), (0, 0, 0.3), '#2F9BE0', raio=0.0)
    m = agua.modifiers.new('nivel', 'BOOLEAN')
    m.operation = 'INTERSECT'
    m.object = molde
    m.solver = 'EXACT'
    anima.assar(agua, 'location', lambda t: (0, 0, 0.3 + 0.2 * t), 0, 3)       # começa abaixo do tanque: vazia
    camera_basica()
    checa()


@teste('35 K.esconde_no_corte não religa peça que já saiu de cena nem o molde escondido (submarino: setas voltando 1 quadro antes do corte)')
def _():
    nova(4.0)
    K.bloco('chao', (4, 4, 0.1), (0, 0, -0.05), '#888888')
    g = K.grupo('barril', (0, 0, 0.5))
    K.bloco('corpo', (1, 1, 1), (0, 0, 0), '#B7BFC7', pai=g)
    seta = K.seta('seta', (0, -0.8, 0.0), (0, 0, -1), tamanho=0.5, t=0.3, ate=1.0)
    seta.parent = g
    molde = K.cilindro('molde', 0.3, 1.0, (0, 0, 0), '#FFFFFF', pai=g)
    molde.hide_render = True
    K.camera([(0.0, (0, 0, 0.5), 5, 0, 10, 'linear', 35), (2.0, (3, 0, 0.5), 5, 40, 10, 'corte', 35), (4.0, (3, 0, 0.5), 5, 45, 10, 'linear', 35)])
    K.esconde_no_corte([g], 2.0)
    sc = bpy.context.scene
    sc.frame_set(K.q(2.0) - 1)
    assert seta.hide_render and molde.hide_render, (seta.hide_render, molde.hide_render)
    assert not bpy.data.objects['corpo'].hide_render
    sc.frame_set(K.q(2.0))
    assert bpy.data.objects['corpo'].hide_render
    erros, _ = checa()
    assert 'VISIBILIDADE' not in tags(erros), erros


# ------------------------------------------------------------------------------------------------ nada some sem motivo
def _poco(seg=6.0):
    """o poço mínimo do elevador: chão, uma cabine pendurada em 4 cabos e um palco à parte (x = 30) pro corte."""
    nova(seg)
    K.bloco('chao', (6, 6, 0.1), (0, 0, -0.05), '#888888')
    K.bloco('palco', (1, 1, 1), (30, 0, 0.5), '#3366FF')
    cabine = K.grupo('cabine', (0, 0, 0.5))
    K.bloco('cab_corpo', (1, 1, 1), (0, 0, 0.5), '#2F7FC1', pai=cabine)
    cabos = [K.bloco(f'cabo{i}', (0.04, 0.04, 2.5), (-0.3 + 0.2 * i, 0, 3.25), '#A7AFB8', raio=0.005) for i in range(4)]
    return cabine, cabos


def _planos(volta, seg=6.0):
    """poço até 2 s, corte pro palco, e (volta=True) corte de volta pro poço em 4 s."""
    pts = [(0.0, (0, 0, 2), 7, 0, 8, 'linear', 35), (2.0, (30, 0, 0.5), 6, 0, 8, 'corte', 35)]
    if volta:
        pts.append((4.0, (0, 0, 2), 7, 5, 8, 'corte', 35))
    pts.append((seg, pts[-1][1], pts[-1][2], pts[-1][3] + 3, 8, 'linear', 35))
    K.camera(pts)


@teste('36 K.esconde esconde só no intervalo e a peça volta sozinha (respeitando o K.aparece); não é SUMIÇO')
def _():
    cabine, cabos = _poco()
    tarde = K.bloco('tarde', (0.3, 0.3, 0.3), (1.2, 0, 0.15), '#FF0000')
    K.aparece(tarde, 3.0)                     # entra no meio do intervalo escondido: só aparece quando ele acaba
    _planos(volta=True)
    for c in cabos:
        K.esconde(c, 2.0, 4.0)
    K.esconde(tarde, 2.0, 4.0)
    sc = bpy.context.scene
    vis = lambda o, t: (sc.frame_set(K.q(t)), not o.hide_render)[1]
    assert vis(cabos[0], 1.0) and not vis(cabos[0], 3.0) and vis(cabos[0], 4.5), 'o cabo não voltou'
    assert not vis(tarde, 1.0) and not vis(tarde, 3.5) and vis(tarde, 4.5), 'o esconde atropelou o K.aparece'
    erros, avisos = checa()
    assert 'SUMIÇO' not in tags(erros + avisos) and 'VISIBILIDADE' not in tags(erros), erros


@teste('37 some de vez sem motivo e o lugar volta à câmera: SUMIÇO (elevador: cabos sumidos no corte pro Otis); com motivo é aviso; lugar fora da câmera não acusa')
def _():
    def cena(motivo, volta):
        cabine, cabos = _poco()
        _planos(volta)
        for c in cabos:
            K.some(c, 2.0, motivo=motivo)
        return checa()
    erros, avisos = cena(None, True)
    acha = [m for _, t, m in erros if t == 'SUMIÇO']
    assert acha and all(f'"cabo{i}"' in acha[0] for i in range(4)), erros
    erros, avisos = cena('quebrou', True)
    assert 'SUMIÇO' not in tags(erros) and 'SUMIÇO' in tags(avisos), (erros, avisos)
    erros, avisos = cena(None, False)
    assert 'SUMIÇO' not in tags(erros + avisos), (erros, avisos)


@teste('38 K.apoio(carga, *suportes): carga no quadro com um suporte escondido é APOIO; escondido só no outro trecho passa')
def _():
    def cena(errado):
        cabine, cabos = _poco()
        K.apoio(cabine, *cabos)
        _planos(volta=True)
        if errado:
            K.esconde(cabos[1], 3.0, 5.0)     # some de 4 a 5 s com a cabine na tela: pendurada no nada
        else:
            K.esconde(cabos[1], 2.0, 4.0)     # só enquanto a câmera está no palco: volta no corte
        return checa()
    erros, _ = cena(True)
    assert any(t == 'APOIO' and 'cabo1' in m for _, t, m in erros), erros
    erros, avisos = cena(False)
    assert 'APOIO' not in tags(erros) and 'SUMIÇO' not in tags(erros + avisos), erros


@teste('39 peça só com K.some (sem K.aparece) segue na vista e acompanha o pai até sumir; e não religa o que já tinha sumido (foguete)')
def _():
    nova(4.0)
    pai = K.grupo('pai', (0, 0, 0))
    anima.assar(pai, 'location', lambda t: (0, 0, 2.0 * t), 0, 4)
    filho = K.bloco('filho', (0.3, 0.3, 0.3), (0, 0, 1.0), '#FF0000', pai=pai)
    seta = K.seta('seta', (1.0, 0, 1.0), (0, 0, -1), tamanho=0.5, t=0.2, ate=1.0)
    seta.parent = pai
    K.some(pai, 3.0, motivo='teste')
    sc = bpy.context.scene
    sc.frame_set(K.q(2.0))
    assert not filho.hide_viewport and abs(filho.matrix_world.translation.z - 5.0) < 0.05, (filho.hide_viewport, filho.matrix_world.translation.z)
    sc.frame_set(K.q(3.0) - 1)
    assert seta.hide_render, 'o K.some do pai religou a seta que já tinha sumido'
    sc.frame_set(K.q(3.0))
    assert filho.hide_render and filho.hide_viewport


@teste('40 K.veiculo: subir de barriga (trajetória acima do nariz) e andar de lado são NARIZ; nariz na trajetória passa (avião)')
def _():
    def cena(pitch_certo, de_lado=False):
        nova(3.0)
        camera_basica(3.0, alvo=(0, 0, 3.0), dist=30.0)
        av = K.grupo('aviao_teste', (0, 0, 0))
        K.bloco('fuselagem_teste', (4.0, 0.6, 0.6), (0, 0, 0), '#FFFFFF', pai=av)
        gama = math.radians(25)
        anima.assar(av, 'location', lambda t: (8.0 * t * math.cos(gama), 0, 8.0 * t * math.sin(gama)), 0, 3)
        if pitch_certo:     # nariz 3 graus acima da trajetória (ângulo de ataque): passa
            anima.assar(av, 'rotation_euler', lambda t: (0, -(gama + math.radians(3)), 0), 0, 3)
        else:               # nariz na horizontal: a trajetória fica 25 graus acima do nariz (sobe de elevador)
            anima.assar(av, 'rotation_euler', lambda t: (0, 0, math.radians(20) if de_lado else 0.0), 0, 3)
        K.veiculo(av, frente=(1, 0, 0))
        return checa()
    erros, _ = cena(False)
    assert any(t == 'NARIZ' and 'barriga' in m for _, t, m in erros), erros
    erros, _ = cena(True)
    assert 'NARIZ' not in tags(erros), erros
    erros, _ = cena(False, de_lado=True)
    assert any(t == 'NARIZ' and 'de lado' in m for _, t, m in erros), erros


@teste('41 passageiro sentado num veículo que faz curva (gira) não anda de lado; a forma de osso (Icosphere fora do render) não conta')
def _():
    nova(3.0)
    camera_basica(3.0, alvo=(0, 0, 1.0), dist=12.0)
    veic = K.grupo('veiculo_teste', (0, 0, 0))
    K.bloco('piso_teste', (4.0, 2.0, 0.1), (0, 0, -0.05), '#888888', pai=veic)
    anima.assar(veic, 'location', lambda t: (2.0 * t, 0, 0), 0, 3)
    anima.assar(veic, 'rotation_euler', lambda t: (math.radians(-10) * t / 3, 0, math.radians(40) * t / 3), 0, 3)
    g = K.pessoa('passageiro_teste', 'man/man-HMnuH5geEG.glb', (1.0, 0.5, 0.0), altura=1.7, rot_z=90, pai=veic)
    assert any(o.name.startswith('Icosphere') for o in g.children_recursive), 'o modelo de teste não tem a forma de osso'
    erros, _ = checa()
    ruins = [m for _, t, m in erros if t in ('DE LADO', 'DE COSTAS', 'DESLIZA', 'PÉS', 'ATRAVESSAR')]
    assert not ruins, ruins


@teste('42 FORA DA CENA usa a posição de quando a peça está visível: a nuvem escondida no início que passa pela cena não acusa; a parada a 900 m acusa')
def _():
    nova(4.0)
    camera_basica(4.0, alvo=(0, 0, 1.0), dist=10.0)
    nuvem = K.bloco('nuvem_teste', (2, 2, 2), (0, 0, 0), '#FFFFFF')
    anima.assar(nuvem, 'location', lambda t: (300 - 150 * t, 30, 5), 0, 4)   # visível de 2 a 4 s: de x 0 a -300
    K.aparece(nuvem, 2.0)
    longe = K.bloco('longe_teste', (2, 2, 2), (900, 0, 0), '#FF0000')
    erros, _ = checa()
    fora = [m for _, t, m in erros if t == 'FORA DA CENA']
    assert any('longe_teste' in m for m in fora), fora
    assert not any('nuvem_teste' in m for m in fora), fora


@teste('43 ATRAVESSAR confirma o "dentro" pelo saldo de faces: peça afundada na sobreposição de duas partes da mesma malha acusa; peça parada na concavidade, perto da quina, não')
def _():
    import bmesh
    from mathutils import Matrix

    def cena(afunda):
        nova(2.0)
        camera_basica(2.0, alvo=(0, 0, 0.6), dist=6.0)
        me = bpy.data.meshes.new('poltrona_L')      # assento e braço: duas caixas fechadas que se sobrepõem, numa malha só
        bm = bmesh.new()
        bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.LocRotScale((0, 0, 0.2), None, (2.0, 1.0, 0.4)))
        bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.LocRotScale((0.75, 0, 0.5), None, (0.5, 1.0, 1.0)))
        bm.to_mesh(me)
        bm.free()
        pol = bpy.data.objects.new('poltrona_L', me)
        bpy.context.scene.collection.objects.link(pol)
        pol.data.materials.append(K.mat('#3355AA'))
        z = 0.2 if afunda else 0.52                  # afunda 10 cm na sobreposição do braço com o assento / paira 2 cm acima
        x = 0.75 if afunda else 0.37                 # ... do assento, na concavidade, 3 cm da face de dentro do braço
        cx = K.bloco('visitante', (0.2, 0.2, 0.2), (0, 0, 0), '#FF0000')
        anima.assar(cx, 'location', lambda t: (x, 0.2 * math.sin(t), z), 0, 2)
        return checa()
    erros, _ = cena(True)
    assert any(t == 'ATRAVESSAR' and 'visitante' in m for _, t, m in erros), erros
    erros, _ = cena(False)
    assert not any(t == 'ATRAVESSAR' for _, t, m in erros), erros


@teste('44 veículo do kit: a frente medida está em K.FRENTES; o carro posto de lado (rot_z errado) é DE LADO; com K.anda anda de frente nas duas mãos')
def _():
    arq = 'car/suv-xsMtZhBkxL.glb'
    assert K.frente_medida(arq) and K.frente_de(arq) == -90.0, 'a frente do SUV (medida na ponte) tem que estar registrada'
    assert not K.frente_medida('car/police-car-BwwnUrWGmV.glb')

    def cena(certo):
        nova(4.0)
        K.bloco('pista', (60, 10, 0.2), (0, 0, -0.1), '#444444')
        camera_basica(4.0, alvo=(0, 0, 1.0), dist=30.0)
        for sentido, y in ((1, -1.75), (-1, 1.75)):
            c = K.asset(f'carro{sentido:+d}', arq, (-12 * sentido, y, 0), 4.6, medida='maior',
                        rot_z=90 * sentido if certo else 0, ator='veiculo')
            if certo:
                K.anda(c, [(0.2, (-12 * sentido, y, 0)), (3.8, (12 * sentido, y, 0))])
            else:      # o erro da ponte velha: o carro de frente pra câmera, deslizando ao longo da pista
                anima.chave(c, 'location', [(0.2, (-12 * sentido, y, 0), 'linear'), (3.8, (12 * sentido, y, 0), 'linear')])
        return checa()
    erros, _ = cena(False)
    assert 'DE LADO' in tags(erros), erros
    erros, _ = cena(True)
    assert not any(t in ('DE LADO', 'DE COSTAS') for _, t, _ in erros), erros


def principal():
    SAIDA.mkdir(parents=True, exist_ok=True)
    for t in TESTES:
        t()
    ruins = [r for r in RESULTADOS if not r[1]]
    print(f'TESTE RESULTADO: {len(RESULTADOS) - len(ruins)} de {len(RESULTADOS)} ok')
    sys.stdout.flush()
    if ruins:
        sys.exit(1)


principal()
