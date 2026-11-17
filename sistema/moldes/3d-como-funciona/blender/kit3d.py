"""kit3d: as peças do modelo 3d-como-funciona no Blender 5.2, por cima da biblioteca estudio3d.

O modelo inteiro em uma ideia: a coisa se monta e quebra na frente da câmera, cada peça presa à palavra que diz o
que ela faz. Aqui moram as peças que todo vídeo usa:
- Fala: transforma uma frase do roteiro no tempo em que ela é dita (palavras.json do alinhar.py).
- mundo_dia: céu claro, sol macio, maquete bonita (nada fotorreal, nada brinquedo).
- mat: material simples com rugosidade e cor travada (cache por cor).
- aparece / some: visibilidade seca (a peça só existe a partir da palavra dela).
- entra: entrada com mola (cresce, desce ou desliza até o lugar).
- acende: a peça nomeada pisca em amarelo no "Esse é o [nome]".
- seta: seta grossa de força/peso, que entra com mola e pulsa.
- Planos: a câmera muda de ponto de vista por elo (viagem suave ou corte seco).
- Atenção com `pai=`: `loc` é LOCAL ao pai. Quem passa posição de mundo junto com `pai=` dobra o deslocamento.
- anda: quem anda por um caminho vira sempre pra direção do movimento, com o passo no ritmo do deslocamento.
- esconde_no_corte: some/volta no quadro exato do corte. apoio: declara peça que tem que estar pousada.
- sem_corpo: água, bolha, onda, névoa (a checagem não conta como sólido). encolhe / sai: saída encolhendo, sem sumir seco.
- sem_tampas: tira os discos de um cilindro cortado (a checagem acusa TAMPA esquecida no corte).
- Nada some sem motivo, e o que foi escondido volta: `esconde(obj, t0, t1)` esconde só no intervalo e devolve a peça
  sozinha; `some(obj, t, motivo=...)` é o sumiço de vez, com o motivo físico na tela ("quebrou", "caiu fora");
  `apoio(carga, *suportes)` declara quem segura a carga (cabine pelos cabos): a checagem acusa SUMIÇO e APOIO.
- barra: haste reta entre dois pontos (corda, cabo, tirante), sem chute de posição e ângulo.
- veiculo: declara o eixo do nariz de um veículo feito por código; a checagem confere o NARIZ contra a velocidade em 3D.
- checar: a conferência automática (salto, z-fighting, atravessar, pessoa de costas, pés fora do chão), sem render.
"""
import json
import math
import re
import sys
import unicodedata
from pathlib import Path

import bpy
from mathutils import Vector

# a biblioteca estudio3d mora na skill estudio-3d do próprio EditOS (<raiz>/.claude/skills/estudio-3d/scripts, a
# raiz é parents[4]); a de cima (parents[6]) só serve de reserva no estúdio local antigo
ESTUDIO = next((p / '.claude' / 'skills' / 'estudio-3d' / 'scripts' for p in Path(__file__).resolve().parents
                if (p / '.claude' / 'skills' / 'estudio-3d' / 'scripts' / 'estudio3d').is_dir()), None)
if ESTUDIO is None:
    raise SystemExit('kit3d: não achei .claude/skills/estudio-3d/scripts (a skill estudio-3d do EditOS)')
sys.path.insert(0, str(ESTUDIO))
from estudio3d import anima, geo, nucleo  # noqa: E402

FPS = 30
AMARELO = '#FFD84D'


def _quadro(t, sc=None):
    """segundos -> número do quadro (o quadro 1 é t=0). Arredonda 0,5 pra cima. É a ÚNICA conta de tempo -> quadro do
    kit: a do nucleo e a do anima (que usavam round(), arredondamento bancário: 0,5 ia pro par) foram trocadas por esta."""
    fps = (sc or bpy.context.scene).render.fps
    return 1 + math.floor(t * fps + 0.5)


nucleo.quadro = _quadro
anima.quadro = _quadro

# ---------------------------------------------------------------- cortes de câmera (a checagem tolera salto colado num corte)
CORTES = []
FOCOS = []      # (nome, t0, t1): objeto-foco de cada plano (a checagem confere que ele fica no quadro)
APARECES = {}   # nome da peça -> t em que ela passa a existir (a checagem acusa peça visível antes)
ENTRADAS = {}   # nome da peça -> [(t0, t1)] das entradas com mola (a mola pode afundar um pouco: a checagem não conta)
APOIOS = []     # (nome, t0, t1): peça sólida que tem que estar apoiada em algo embaixo (a checagem acusa APOIO se flutuar)
SUPORTES = []   # (carga, [suportes], t0, t1): K.apoio(carga, *suportes); a checagem acusa APOIO se um suporte some com a carga no quadro
SUMICOS = {}    # nome -> (t, motivo): o que some DE VEZ (K.some). Sem motivo, a checagem acusa SUMIÇO se o lugar volta à tela
ESCONDIDOS = [] # (nome, t0, t1): o que foi escondido só num intervalo (K.esconde) e volta sozinho
NO_AR = []      # (nome, t0, t1): pessoa no ar de propósito (pulo, queda); a checagem não cobra pé no chão nem Walk ali
VEICULOS = []   # (nome, frente, t0, t1, nariz_acima, sobe_acima, de_lado): K.veiculo; a checagem confere o NARIZ em 3D

# frente de cada modelo: o ângulo (graus, no plano XY local do modelo, antes de rot_z) pra onde ele aponta.
# pessoa e quase todo modelo glTF importado olham pra -Y (-90). Todo VEÍCULO (carro, caminhão, ônibus, barco, avião)
# que uma cena usa entra aqui pelo trecho do nome do arquivo, depois de MEDIDO: a ponta dos faróis/grade (e as
# lanternas vermelhas na outra), a proa em quilha, o nariz. Veículo sem registro avisa no `K.asset(..., ator='veiculo')`.
# Medição de 2026-10-22 (ponte): `.tmp/ponte/frentes.py` (materiais por ponta + vista de -Y e de +Y). Nos 7 abaixo
# os faróis/grade ficam na ponta -Y e as lanternas na +Y; a proa do navio é a ponta -Y (mais estreita, em quilha).
FRENTES = {
    'car/car-hatchback-BG0KAhmGDt': -90.0,
    'car/suv-xsMtZhBkxL': -90.0,
    'car/car-unqqkULtRU': -90.0,
    'car/pickup-truck-qn4grQgHm8': -90.0,
    'car/sports-car-Gzj704DXdr': -90.0,
    'truck/truck-cXw6oiFtZ8': -90.0,
    'yacht/cruise-ship-yq9EKmEmfC': -90.0,
}


def frente_de(arquivo):
    for trecho, graus in FRENTES.items():
        if trecho in str(arquivo).replace('\\', '/'):
            return graus
    return -90.0


def frente_medida(arquivo):
    """o modelo tem a frente medida e registrada em FRENTES?"""
    return any(trecho in str(arquivo).replace('\\', '/') for trecho in FRENTES)


# ---------------------------------------------------------------- eventos de som (a cena anota, a montagem toca)
EVENTOS = []


def evento(t, tipo, peso=1.0):
    """tipo: pop (peça entra), brilho (nome técnico acende), forca (seta de força), esforco (tremor), mais os que a
    cena quiser (estalo, splash, trava, bolhas...). A montagem junta eventos colados e escolhe o som."""
    EVENTOS.append({'t': round(float(t), 3), 'tipo': tipo, 'peso': peso})


def salvar_eventos(caminho):
    evs = sorted(EVENTOS, key=lambda e: e['t'])
    out = []
    for e in evs:  # junta eventos iguais a menos de 0,25 s (8 pessoas entrando = um pop só)
        if out and out[-1]['tipo'] == e['tipo'] and e['t'] - out[-1]['t'] < 0.25:
            continue
        out.append(e)
    Path(caminho).write_text(json.dumps(out, ensure_ascii=False, indent=0), encoding='utf-8')
    print(f'eventos: {len(out)} em {caminho}')


# ---------------------------------------------------------------- a fala
def _n(s):
    return re.sub(r'[^\w]', '', unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower())


class Fala:
    """f = Fala('palavras.json'); f.t('pendura') = início da palavra; f.fim('contrapeso') = fim da frase dada.
    Frase com várias palavras procura a sequência; 'frase#2' = a 2ª vez. Procura a partir de `apos` (segundos)."""

    def __init__(self, arquivo):
        self.p = json.loads(Path(arquivo).read_text(encoding='utf-8'))
        self.n = [_n(x['w']) for x in self.p]
        self.duracao = self.p[-1]['e']

    def _acha(self, frase, apos=0.0):
        txt, _, vez = frase.partition('#')
        alvo = [_n(w) for w in txt.split() if _n(w)]
        v = int(vez or 1)
        for i in range(len(self.n) - len(alvo) + 1):
            if self.p[i]['s'] + 1e-3 < apos:
                continue
            if self.n[i:i + len(alvo)] == alvo:
                v -= 1
                if v == 0:
                    return i, i + len(alvo) - 1
        raise ValueError(f'frase não dita: "{frase}" (depois de {apos:.2f} s)')

    def _vezes(self, frase):
        txt = frase.partition('#')[0]
        alvo = [_n(w) for w in txt.split() if _n(w)]
        return sum(1 for i in range(len(self.n) - len(alvo) + 1) if self.n[i:i + len(alvo)] == alvo)

    def _ambigua(self, frase, apos):
        if '#' not in frase and apos == 0.0:
            n = self._vezes(frase)
            if n > 1:
                raise ValueError(f'frase ambígua: "{frase}" aparece {n} vezes no roteiro. Use "{frase}#2" (a 2ª vez) ou apos=<segundos>.')

    def t(self, frase, apos=0.0):
        self._ambigua(frase, apos)
        return self.p[self._acha(frase, apos)[0]]['s']

    def fim(self, frase, apos=0.0):
        self._ambigua(frase, apos)
        return self.p[self._acha(frase, apos)[1]]['e']


# ---------------------------------------------------------------- cena e mundo
def cena(segundos, amostras=48, escala=100):
    sc = nucleo.cena_nova('9:16', fps=FPS, segundos=segundos, motor_nome='eevee', qualidade='revisao',
                          look='AgX - Punchy', escala=escala)
    sc.eevee.taa_render_samples = amostras
    nucleo._set(sc.eevee, 'use_raytracing', False)  # maquete clara: sombra macia basta, sem custo de reflexo
    nucleo._set(sc.eevee, 'use_shadow_jitter_viewport', False)
    sc.render.use_motion_blur = True
    sc.render.motion_blur_shutter = 0.35
    sc.view_settings.exposure = 0.0
    return sc


def mundo_dia(topo='#7EC4F2', horizonte='#DDF0FB', forca=1.0, sol_forca=3.2, sol_az=-35, sol_el=48, sol_cor=5600,
              macio=6.0):
    """céu em degradê (vertical) + sol macio. Tudo claro e com direção: o herói fica no lado iluminado."""
    w = bpy.context.scene.world
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes.clear()
    co = nt.nodes.new('ShaderNodeTexCoord')
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    rampa = nt.nodes.new('ShaderNodeValToRGB')
    rampa.color_ramp.elements[0].position = 0.45
    rampa.color_ramp.elements[0].color = nucleo.hex_emissao(horizonte)
    rampa.color_ramp.elements[1].position = 0.85
    rampa.color_ramp.elements[1].color = nucleo.hex_emissao(topo)
    bg = nt.nodes.new('ShaderNodeBackground')
    bg.inputs['Strength'].default_value = forca
    out = nt.nodes.new('ShaderNodeOutputWorld')
    # degradê preso à tela (Window: 0 embaixo, 1 em cima): o céu é sempre claro no horizonte e azul no topo do
    # quadro, qualquer que seja a inclinação da câmera (maquete, não simulação)
    nt.links.new(co.outputs['Window'], sep.inputs[0])
    nt.links.new(sep.outputs['Y'], rampa.inputs['Fac'])
    nt.links.new(rampa.outputs['Color'], bg.inputs['Color'])
    nt.links.new(bg.outputs[0], out.inputs[0])
    # sol
    ld = bpy.data.lights.new('Sol', 'SUN')
    ld.energy = sol_forca
    ld.angle = math.radians(macio)
    ld.use_temperature = True
    ld.temperature = sol_cor
    sol = bpy.data.objects.new('Sol', ld)
    bpy.context.scene.collection.objects.link(sol)
    sol.rotation_euler = (math.radians(90 - sol_el), 0, math.radians(sol_az))
    # luz de preenchimento do céu (de baixo, fraca): tira o preto das sombras
    lf = bpy.data.lights.new('Preenche', 'SUN')
    lf.energy = sol_forca * 0.18
    lf.angle = math.radians(40)
    lf.use_temperature = True
    lf.temperature = 9000
    lf.use_shadow = False
    pf = bpy.data.objects.new('Preenche', lf)
    bpy.context.scene.collection.objects.link(pf)
    pf.rotation_euler = (math.radians(180 - 30), 0, math.radians(sol_az + 160))
    return sol


# ---------------------------------------------------------------- materiais
_MATS = {}


def mat(cor, rough=0.55, metal=0.0, nome=None, emissao=None, alfa=1.0, unico=False):
    """material de maquete: cor travada (albedo realista), rugosidade média. unico=True cria cópia (pra acender)."""
    chave = (cor, rough, metal, emissao, alfa)
    if not unico and chave in _MATS:
        return _MATS[chave]
    m = bpy.data.materials.new(nome or f'm_{cor.strip("#")}')
    m.use_nodes = True
    b = m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = nucleo.hex_lin(cor)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    b.inputs['Emission Color'].default_value = nucleo.hex_emissao(emissao or AMARELO)
    b.inputs['Emission Strength'].default_value = 1.5 if emissao else 0.0
    if alfa < 1:
        b.inputs['Alpha'].default_value = alfa
        m.surface_render_method = 'BLENDED'
    if not unico:
        _MATS[chave] = m
    return m


def vidro_claro(cor='#CFEFFF', alfa=0.28):
    """'vidro' de maquete: plástico transparente com brilho, barato no EEVEE (não é refração de verdade)."""
    m = mat(cor, rough=0.12, alfa=alfa, unico=True, nome='vidro_maquete')
    return m


def dar(o, m):
    o.data.materials.clear()
    o.data.materials.append(m)
    return o


def unico(o):
    """cada objeto que vai acender precisa do material só dele."""
    for i, s in enumerate(o.material_slots):
        if s.material:
            s.material = s.material.copy()
    return o


# ---------------------------------------------------------------- geometria rápida
def bloco(nome, dims, loc, cor, raio=None, rough=0.55, pai=None, col=None):
    w, d, h = dims
    r = raio if raio is not None else min(w, d, h) * 0.12
    o = geo.bloco(nome, w, d, h, raio=r, chanfro=min(0.02, min(w, d, h) * 0.08), mat=mat(cor, rough))
    o.location = loc
    if pai:
        o.parent = pai
    _mover(o, col)
    return o


def cilindro(nome, raio, altura, loc, cor, rough=0.5, metal=0.0, rot=(0, 0, 0), pai=None, segs=48, col=None):
    o = geo.cilindro(nome, raio, altura, mat=mat(cor, rough, metal), segs=segs, base_em_zero=False)
    o.location = loc
    o.rotation_euler = rot
    if pai:
        o.parent = pai
    _mover(o, col)
    return o


def esfera(nome, raio, loc, cor, rough=0.5, pai=None, col=None, subdiv=3):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdiv, radius=raio, location=loc)
    o = bpy.context.active_object
    o.name = nome
    bpy.ops.object.shade_smooth()
    dar(o, mat(cor, rough))
    if pai:
        o.parent = pai
    _mover(o, col)
    return o


def _mover(o, col):
    if col is None:
        return
    for c in list(o.users_collection):
        c.objects.unlink(o)
    col.objects.link(o)


def grupo(nome, loc=(0, 0, 0), pai=None):
    return nucleo.vazio(nome, loc, pai=pai, tamanho=0.2)


# ---------------------------------------------------------------- tempo e visibilidade
def q(t):
    return _quadro(t)


def aparece(o, t, filhos=True):
    """a peça não existe antes de t (visibilidade seca na câmera e no render)."""
    for x in _todos(o, filhos):
        if x is not o and anima.fcurves(x, 'hide_render'):
            continue  # filho que já tem a vez dele não é ligado junto com o pai
        _limpa_visibilidade(x)
        APARECES[x.name] = t
        x.hide_render = True
        x.hide_viewport = True
        x.keyframe_insert('hide_render', frame=1)
        x.keyframe_insert('hide_viewport', frame=1)
        x.hide_render = False
        x.hide_viewport = False
        x.keyframe_insert('hide_render', frame=q(t))
        x.keyframe_insert('hide_viewport', frame=q(t))


def _limpa_visibilidade(x):
    for cam in ('hide_render', 'hide_viewport'):
        for fc in anima.fcurves(x, cam):
            _remove_fc(x, fc)


def _remove_fc(x, fc):
    from bpy_extras import anim_utils
    ad = x.animation_data
    cb = anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot)
    cb.fcurves.remove(fc)


def some(o, t, motivo=None, filhos=True):
    """a peça some DE VEZ em t (e os filhos). Só some de vez o que tem motivo físico na tela: passe o `motivo` ("quebrou",
    "trocado pelos cabos", "caiu fora", "efeito acabou"). Esconder pra uma vista ou pra outro trecho é temporário: use
    `K.esconde(obj, t0, t1)`, que devolve a peça sozinha. A checagem acusa SUMIÇO (erro) quando a peça some sem motivo e
    o lugar onde ela estava volta a aparecer na câmera depois; com motivo, vira aviso."""
    if isinstance(motivo, bool):        # compatível com some(o, t, filhos)
        filhos, motivo = motivo, None
    for x in _todos(o, filhos):
        for cam in ('hide_render', 'hide_viewport'):
            # peça (ou filho) já escondida 1 quadro antes (sumiu antes, ou é o molde de um BOOLEAN) não ganha a chave
            # "visível 1 quadro antes": ela reapareceria por 1 quadro (o foguete inteiro sumindo religava as setas e o vapor).
            # E a chave "visível" vale pros DOIS canais: com só a chave True no hide_viewport, a peça sem K.aparece ficava
            # fora da vista o vídeo inteiro, e a checagem (que usa a vista) via a posição congelada no quadro 1.
            fh = anima.fcurves(x, cam)
            if not ((fh and fh[0].evaluate(max(1, q(t) - 1)) > 0.5) or (not fh and getattr(x, cam))):
                setattr(x, cam, False)
                x.keyframe_insert(cam, frame=max(1, q(t) - 1))
            setattr(x, cam, True)
            x.keyframe_insert(cam, frame=q(t))
        SUMICOS[x.name] = (t, motivo)
        if motivo:
            x['some_motivo'] = str(motivo)


def esconde(o, t0, t1, filhos=True):
    """esconde `o` (e os filhos) SÓ de t0 a t1: em t1 a peça volta sozinha, no estado em que estaria sem o esconde (o
    `K.aparece` e o `K.some` que já existem continuam valendo fora do intervalo). Serve pra corte a outro trecho (a peça
    some enquanto a câmera está na feira de 1854 e volta quando a cena volta) e pra tirar o que tapa uma vista. Troca no
    quadro K.q(t), o mesmo do K.camera: com t0 e t1 nos tempos dos cortes, a troca cai no quadro do corte. Liga
    hide_render e hide_viewport juntos (a checagem enxerga o mesmo que o render)."""
    f0, f1 = q(t0), q(t1)
    if f1 <= f0:
        raise ValueError(f'K.esconde: t1 ({t1:.2f} s) tem que vir depois de t0 ({t0:.2f} s)')
    for x in _todos(o, filhos):
        for cam in ('hide_render', 'hide_viewport'):
            fcs = anima.fcurves(x, cam)
            fc = fcs[0] if fcs else None
            antes_ = (fc.evaluate(f0 - 1) > 0.5) if fc else bool(getattr(x, cam))
            depois = (fc.evaluate(f1) > 0.5) if fc else bool(getattr(x, cam))
            if fc:   # o que estava no intervalo é substituído pelo escondido
                for i in range(len(fc.keyframe_points) - 1, -1, -1):
                    if f0 - 1 < fc.keyframe_points[i].co.x <= f1 + 1e-6:
                        fc.keyframe_points.remove(fc.keyframe_points[i])
            for f, v in ((f0 - 1, antes_), (f0, True), (f1 - 1, True), (f1, depois)):
                setattr(x, cam, v)
                x.keyframe_insert(cam, frame=f)
            for fc in anima.fcurves(x, cam):
                for kp in fc.keyframe_points:
                    kp.interpolation = 'CONSTANT'
        ESCONDIDOS.append((x.name, t0, t1))


def esconde_no_corte(objs, t_ida, t_volta=None):
    """esconde `objs` (e os filhos) do corte em t_ida até o corte em t_volta (None = até o fim): a vista de trás tira a
    parede da cozinha, a porta... A troca usa o mesmo K.q do K.camera, então plano e visibilidade mudam no MESMO quadro
    (nada some 1 quadro antes do corte, nada pisca 1 quadro depois; a checagem acusa VISIBILIDADE). Liga hide_render e
    hide_viewport juntos: a checagem (ray_cast) enxerga o mesmo que o render."""
    pts = [(q(t_ida) - 1, False), (q(t_ida), True)]
    if t_volta is not None:
        pts += [(q(t_volta) - 1, True), (q(t_volta), False)]
    for o in objs:
        for x in _todos(o, True):
            # peça que já está escondida no corte (já saiu de cena, ou o molde escondido de um BOOLEAN) fica como está:
            # a chave "visível 1 quadro antes" a faria reaparecer (submarino: as setas da pressão voltavam no corte)
            fh = anima.fcurves(x, 'hide_render')
            if (fh and fh[0].evaluate(q(t_ida) - 1) > 0.5) or (not fh and x.hide_render):
                continue
            for cam in ('hide_render', 'hide_viewport'):
                for f, v in pts:
                    setattr(x, cam, v)
                    x.keyframe_insert(cam, frame=f)
                for fc in anima.fcurves(x, cam):
                    for kp in fc.keyframe_points:
                        kp.interpolation = 'CONSTANT'
            if t_volta is None:   # vista em corte até o fim: é declarado (a checagem lista como aviso, não erro)
                SUMICOS[x.name] = (t_ida, 'vista em corte até o fim (esconde_no_corte sem volta)')
            else:
                ESCONDIDOS.append((x.name, t_ida, t_volta))


def apoio(carga, *suportes, t0=0.0, t1=None):
    """duas declarações que a checagem confere:
    - `K.apoio(peca[, t0[, t1]])`: a peça sólida (compressor, comida, caixa, bloco) fica POUSADA em algo embaixo, com
      folga de até 1 cm, enquanto estiver visível entre t0 e t1 (None = até o fim; a entrada com mola não conta). A
      checagem acusa APOIO quando ela flutua.
    - `K.apoio(carga, *suportes, t0=, t1=)`: a carga é SEGURADA pelos suportes (cabine pelos cabos, pista pelos pendurais,
      cápsula pelas cordas do paraquedas, foguete pelas garras da base). Enquanto a carga estiver visível no quadro (entre
      t0 e t1), todo suporte declarado tem que estar visível: a checagem acusa APOIO quando um deles está escondido (a
      cabine pendurada no nada). Suporte pode vir solto ou em lista: `K.apoio(cabine, *cabos)` ou `K.apoio(cabine, cabos)`."""
    sups = []
    for s in suportes:
        sups += list(s) if isinstance(s, (list, tuple, set)) else [s]
    if sups and all(s is None or isinstance(s, (int, float)) for s in sups):   # forma antiga: apoio(peca, t0, t1)
        t0 = sups[0]
        t1 = sups[1] if len(sups) > 1 else t1
        sups = []
    if not sups:
        APOIOS.append((carga.name, t0, t1))
    else:
        SUPORTES.append((carga.name, [s.name for s in sups], t0, t1))
    return carga


def _todos(o, filhos):
    out = [o]
    if filhos:
        out += list(o.children_recursive)
    return out


def entra(o, t, de=(0, 0, 0.6), escala_de=0.0, rigidez=210, amortecimento=22, dur=1.0, mostrar=True, critico=False,
          som=True):
    """entrada com mola: vem de `de` (deslocamento) e cresce de escala_de até 1. Já liga a visibilidade.
    A entrada mora em delta_location e delta_scale, uma camada que SOMA por cima do movimento próprio da peça
    (location, scale). Por isso o objeto nunca teletransporta: quem move a peça mexe em location, a entrada só
    desloca a partir de onde ela estiver. A mola padrão (amortecimento 22) passa só ~3% do tamanho final; peça que entra
    DENTRO de outra usa `critico=True` (amortecimento crítico: chega sem passar nada e não estoura a casca).
    `som=False`: a peça entra fora do quadro (a torre lá longe), então não toca o pop (som só com causa na tela)."""
    if critico:
        amortecimento = 2 * math.sqrt(rigidez)
    if mostrar:
        aparece(o, t)
    if t > 0.05 and som:
        evento(t, 'pop')
    ENTRADAS.setdefault(o.name, []).append((t, t + dur + 0.3))
    _entrada(o, t, de, escala_de, rigidez, amortecimento, dur)


def _entrada(o, t0, de, escala_de, rigidez, amortecimento, dur):
    def desloca(t):
        p = anima.mola(t - t0, rigidez, amortecimento)
        return tuple(d * (1 - p) for d in de)

    def cresce(t):
        p = anima.mola(t - t0, rigidez, amortecimento)
        k = escala_de + (1 - escala_de) * p
        return (k, k, k)
    anima.assar(o, 'delta_location', desloca, t0, t0 + dur)
    anima.assar(o, 'delta_scale', cresce, t0, t0 + dur)


ACENDES = []   # (objetos, t0, t1) de cada acende: a checagem confere se a peça nomeada está na tela no t0
_TIPOS_COM_MATERIAL = ('MESH', 'CURVE', 'SURFACE', 'META', 'FONT')


def _emissao_base(m):
    """cor e força de emissão ORIGINAIS do material (guardadas na 1ª vez), pra o acende devolver o valor de antes."""
    b = m.node_tree.nodes.get('Principled BSDF')
    if '_emi_f0' not in m:
        m['_emi_cor0'] = list(b.inputs['Emission Color'].default_value)
        m['_emi_f0'] = float(b.inputs['Emission Strength'].default_value)
    return b, tuple(m['_emi_cor0']), float(m['_emi_f0'])


def acende(objs, t0, t1, forca=2.2, cor=AMARELO, pisca=2):
    """o nome técnico: a peça ganha brilho (amarelo por padrão) no 'Esse é o [nome]', pisca `pisca` vezes, assenta e
    apaga em t1, DEVOLVENDO a emissão ao valor original. Cada acende vale só no seu intervalo (cor e força com chave),
    então dois acendes no mesmo objeto não se misturam. Funciona em malha e em curva (tubo, cabo). O som é sempre
    'brilho'."""
    if not isinstance(objs, (list, tuple)):
        objs = [objs]
    ACENDES.append((list(objs), t0, t1))
    evento(t0, 'brilho')
    c_lin = nucleo.hex_emissao(cor)
    for o in objs:
        for x in [o] + list(o.children_recursive):
            if x.type not in _TIPOS_COM_MATERIAL or not x.material_slots:
                continue
            if not x.get('_acende_unico'):
                unico(x)
                x['_acende_unico'] = True
            for s in x.material_slots:
                if not s.material or not s.material.use_nodes:
                    continue
                b, cor0, f0 = _emissao_base(s.material)
                sk, sc_ = b.inputs['Emission Strength'], b.inputs['Emission Color']
                if not anima.fcurves(sk, 'default_value'):  # 1ª vez: fixa o valor original desde o quadro 1
                    anima.chave(sc_, 'default_value', [(0.0, cor0, 'degrau')])
                    anima.chave(sk, 'default_value', [(0.0, f0, 'degrau')])
                anima.chave(sc_, 'default_value', [(max(0, t0 - 0.06), c_lin, 'degrau'), (t1 + 0.26, cor0, 'degrau')])
                pts = [(max(0, t0 - 0.05), 0.0, 'degrau')]
                for k in range(pisca):
                    pts += [(t0 + k * 0.28, forca, 'suave'), (t0 + k * 0.28 + 0.16, forca * 0.25, 'suave')]
                pts += [(t0 + pisca * 0.28, forca * 0.55, 'premium'), (t1, forca * 0.55, 'suave'), (t1 + 0.25, f0, 'degrau')]
                anima.chave(sk, 'default_value', pts)


def seta(nome, loc, direcao=(0, 0, -1), tamanho=1.0, cor='#FF5A36', t=0.0, ate=None, pulsa=True, col=None):
    """seta grossa de força (corpo + ponta), apontando pra `direcao`. Entra com mola em t e pulsa até `ate`."""
    raiz = grupo(nome, loc)
    corpo = cilindro(nome + '.corpo', 0.09 * tamanho, 0.55 * tamanho, (0, 0, 0.30 * tamanho), cor, rough=0.4, pai=raiz, col=col)
    bpy.ops.mesh.primitive_cone_add(radius1=0.22 * tamanho, depth=0.32 * tamanho, vertices=32, location=(0, 0, -0.06 * tamanho))
    ponta = bpy.context.active_object
    ponta.name = nome + '.ponta'
    ponta.rotation_euler = (math.pi, 0, 0)
    bpy.ops.object.shade_smooth()
    dar(ponta, mat(cor, 0.4))
    ponta.parent = raiz
    _mover(ponta, col)
    d = Vector(direcao).normalized()
    raiz.rotation_euler = Vector((0, 0, -1)).rotation_difference(d).to_euler()
    for x in (raiz, corpo, ponta):
        x['anotacao'] = True        # desenho da força, não peça: some quando a força acaba (a checagem de SUMIÇO não conta)
    entra(raiz, t, de=tuple(-d * 0.5 * tamanho), escala_de=0.2, dur=0.8)
    EVENTOS[-1]['tipo'] = 'forca'
    if pulsa and ate:
        # o pulso soma em delta_location (a mesma camada da entrada), então não briga com quem move a seta
        def pulso(tt):
            u = tt - (t + 0.8)
            k = min(1.0, u / 0.3)
            return tuple(dd * 0.07 * tamanho * math.sin(u * 7.0) * k for dd in d)
        anima.assar(raiz, 'delta_location', pulso, t + 0.8, ate)
    if ate:
        some(raiz, ate, motivo='seta de força: a força acabou')
    return raiz


def barra(nome, p0, p1, raio, cor, pai=None, rough=0.5, metal=0.0, segs=12, col=None):
    """haste reta de p0 a p1 (corda, cabo, tirante, haste), no espaço do pai: as duas pontas caem exatamente nos pontos
    dados. Nada de cilindro com posição e ângulo chutados (as cordas do paraquedas do foguete ficavam soltas e em X)."""
    a, b = Vector(p0), Vector(p1)
    d = b - a
    o = cilindro(nome, raio, d.length, tuple((a + b) / 2), cor, rough=rough, metal=metal, pai=pai, segs=segs, col=col)
    o.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
    return o


def queda(t, t0, z0, piso, v0=0.0, g=9.8):
    """altura, no instante t, de algo solto em t0 a z0 (v0 = velocidade vertical inicial, pra cima +), em queda livre
    (1 g, 9,8 m/s2) que PARA no `piso`. Toda queda do vídeo usa isto: sem piso, a peça atravessa o chão."""
    u = max(0.0, t - t0)
    return max(piso, z0 + v0 * u - 0.5 * g * u * u)


def t_impacto(t0, z0, piso, v0=0.0, g=9.8):
    """instante em que a queda de `queda()` chega no piso (o instante do som do baque, não o da palavra)."""
    a, b, c = -0.5 * g, v0, z0 - piso
    return t0 + (-b - math.sqrt(max(0.0, b * b - 4 * a * c))) / (2 * a)


class Fase:
    """fase (0 a 1, em voltas) de um laço (partícula, esteira, gota) cuja velocidade `vel(t)` muda no tempo. A fase é a
    soma acumulada da velocidade, nunca `(t * vel) % 1` (que salta toda vez que a velocidade muda)."""

    def __init__(self, vel, t1, passo=1.0 / 120):
        self.passo = passo
        self.tab = [0.0]
        for k in range(int(t1 / passo) + 2):
            self.tab.append(self.tab[-1] + 0.5 * (vel(k * passo) + vel((k + 1) * passo)) * passo)

    def __call__(self, t):
        x = max(0.0, t) / self.passo
        i = min(int(x), len(self.tab) - 2)
        v = self.tab[i] + (self.tab[i + 1] - self.tab[i]) * (x - i)
        return v % 1.0


def sem_tampas(o, minimo_de_vertices=8):
    """tira as tampas (os discos) de um cilindro: o casco de um corte de maquete fica um tubo aberto, e o disco não
    corta mais o interior."""
    import bmesh
    bm = bmesh.new()
    bm.from_mesh(o.data)
    tampas = [f for f in bm.faces if len(f.verts) >= minimo_de_vertices]
    bmesh.ops.delete(bm, geom=tampas, context='FACES')
    bm.to_mesh(o.data)
    bm.free()
    return o


def no_ar(pessoa, t0, t1):
    """a pessoa está no ar de propósito entre t0 e t1 (pulo do muro, queda até a areia): a checagem não cobra pé no chão
    (PÉS) nem animação de caminhada (DESLIZA) nesse intervalo. Salto, atravessar e frente continuam cobrados."""
    NO_AR.append((pessoa.name, t0, t1))


def sem_corpo(*objs):
    """efeito sem corpo (água, superfície do mar, onda de som, bolha, névoa, fumaça): a checagem não conta como sólido
    nem como peça que atravessa (a bolha sai da água, a onda passa pela pedra, o barril entra no mar). Vale pros filhos.
    Não use em peça de verdade: o que é sólido continua sendo conferido."""
    for o in objs:
        for x in [o] + list(o.children_recursive):
            x['sem_corpo'] = True
    return objs[0] if len(objs) == 1 else objs


def encolhe(o, t, dur=0.3):
    """a peça encolhe até sumir (escala 0) nos `dur` segundos antes de t, por cima do que ela já faz (camada delta).
    Use antes de um `some` (ou com o `ate=` da seta) pra a peça não sumir seca na frente da câmera."""
    anima.chave(o, 'delta_scale', [(t - dur, (1.0, 1.0, 1.0), 'firme'), (t, (0.001, 0.001, 0.001), 'linear')])


def sai(o, t, dur=0.3):
    """saída com mola ao contrário: encolhe em `dur` e some em t."""
    encolhe(o, t, dur)
    some(o, t)


def pos(o, t):
    """onde o objeto está NO MUNDO no instante t (avalia as animações dele e dos pais). Use sempre que algo for
    posicionado em relação a uma peça que se move: `obj.location` lido durante a montagem da cena vale o quadro 1 (ou
    o último valor gravado), não o instante que importa."""
    sc = bpy.context.scene
    f0 = sc.frame_current
    sc.frame_set(q(t))
    v = o.matrix_world.translation.copy()
    sc.frame_set(f0)
    return v


def tremer(o, t0, t1, forca=0.03, freq=28.0, caminho='location'):
    """tremor de esforço (motor forçando, peça a ponto de quebrar)."""
    evento(t0, 'esforco')
    base = tuple(getattr(o, caminho))

    def f(t):
        if t < t0 or t > t1:
            return base
        k = math.sin(math.pi * (t - t0) / max(0.01, t1 - t0))
        return (base[0] + forca * k * math.sin(t * freq), base[1] + forca * k * math.cos(t * freq * 1.3), base[2])
    anima.assar(o, caminho, f, t0 - 0.05, t1 + 0.05)


# ---------------------------------------------------------------- modelos prontos (CC0, kit3d-assets/)
ASSETS = Path(__file__).resolve().parents[3] / 'kit3d-assets'


def _importa(arquivo):
    """importa um glb e devolve (raízes, todos os objetos novos)."""
    antes = set(bpy.data.objects)
    antes_ac = set(bpy.data.actions)
    bpy.ops.import_scene.gltf(filepath=str(ASSETS / arquivo if not Path(arquivo).is_absolute() else arquivo))
    novos = [o for o in bpy.data.objects if o not in antes]
    raizes = [o for o in novos if o.parent is None or o.parent not in novos]
    _importa.acoes = [a for a in bpy.data.actions if a not in antes_ac]
    return raizes, novos


def vai_pro_quadro(o):
    """o objeto aparece no render? A forma de osso que o importador do glTF traz (a esfera 'Icosphere' dos esqueletos
    HumanArmature/CharacterArmature, na coleção 'glTF_not_exported', excluída) não aparece: não pode entrar na medida nem
    no pouso. Com ela na conta, a pessoa ficava 29 cm acima do chão e 18% mais baixa (o astronauta, 0,9 m acima)."""
    vl = bpy.context.view_layer

    def acha(lc, nome):
        if lc.collection.name == nome:
            return lc
        for c in lc.children:
            r = acha(c, nome)
            if r is not None:
                return r
        return None
    for c in o.users_collection:
        if c == bpy.context.scene.collection:
            return True
        lc = acha(vl.layer_collection, c.name)
        if lc is not None and not lc.exclude and not c.hide_render:
            return True
    return False


def _pontos_mundo(objs):
    """vértices, no mundo, da malha AVALIADA (com a pose do esqueleto, os modificadores e a escala) dos objetos malha."""
    import numpy as np
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    out = []
    for o in objs:
        if o.type != 'MESH':
            continue
        eo = o.evaluated_get(dg)
        me = eo.to_mesh()
        try:
            co = np.empty(len(me.vertices) * 3)
            me.vertices.foreach_get('co', co)
        finally:
            eo.to_mesh_clear()
        M = np.array(eo.matrix_world)
        out.append(co.reshape(-1, 3) @ M[:3, :3].T + M[:3, 3])
    return np.concatenate(out) if out else np.zeros((0, 3))


def _caixa(objs):
    """(mínimo, máximo) no mundo da malha avaliada: o tamanho que o modelo tem de verdade, na pose que ele está."""
    P = _pontos_mundo(objs)
    return Vector(P.min(0)), Vector(P.max(0))


def asset(nome, arquivo, loc=(0, 0, 0), tamanho=1.0, medida='altura', rot_z=0.0, pai=None, col=None, ator=None):
    """um modelo pronto no tamanho real: `medida` = 'altura' ou 'maior' (maior dimensão) = `tamanho` em metros.
    A base do modelo pousa em loc (z = chão). Devolve o vazio que comanda o modelo. `ator` = 'pessoa' ou 'veiculo'
    registra a frente do modelo (FRENTES), pra a checagem e o `anda` virarem o modelo pra onde ele vai."""
    raizes, novos = _importa(arquivo)
    g = grupo(nome, (0, 0, 0))
    if ator:
        g['ator'] = ator
        g['frente_graus'] = frente_de(arquivo)
        if ator == 'veiculo' and not frente_medida(arquivo):
            print(f'AVISO kit3d: a frente de "{arquivo}" não foi medida (FRENTES); usando -90. Meça (faróis/lanternas, '
                  f'proa) e registre antes de confiar no rot_z e na checagem de frente.')
    g['acoes'] = [a.name for a in getattr(_importa, 'acoes', [])]
    for r in raizes:
        r.parent = g
    mn, mx = _caixa([o for o in novos if vai_pro_quadro(o)])
    dim = mx - mn
    ref = dim.z if medida == 'altura' else max(dim)
    k = tamanho / max(ref, 1e-6)
    for r in raizes:  # centra no xy e pousa a base no zero, depois escala
        r.location = ((r.location.x - (mn.x + mx.x) / 2) * k, (r.location.y - (mn.y + mx.y) / 2) * k, (r.location.z - mn.z) * k)
        r.scale = tuple(s * k for s in r.scale)
    g.location = loc
    g.rotation_euler = (0, 0, math.radians(rot_z))
    if pai:
        g.parent = pai
    if col:
        for o in [g] + novos:
            _mover(o, col)
    return g


# clipes que tocam UMA vez (transição ou gesto): seguram a última pose em vez de repetir. Os outros (Idle, Walk, Run,
# Clapping, Wave...) são ciclos e repetem.
UMA_VEZ = ('sitting', 'death', 'jump', 'roll', 'standing', 'slash', 'punch', 'kick', 'hitrecieve', 'interact', 'shoot')
MISTURA = 5   # quadros de mistura entre uma animação e a seguinte (Idle -> Walk sem pulo de pose)


def _faixa(arm, a, f, velocidade, primeira=False):
    """põe o clipe `a` numa faixa NLA nova a partir do quadro f. Ciclo = repete até o fim; clipe de UMA_VEZ = toca uma vez e
    segura a última pose. A 1ª faixa de um ciclo começa antes do quadro 1 (com a fase certa), então não precisa segurar
    pose antes. As seguintes ENTRAM com mistura de MISTURA quadros por cima da anterior, que termina logo depois e não
    segura a pose dela (extrapolação 'NOTHING'). As faixas que o importador do glTF deixou mudas não entram na conta."""
    ad = arm.animation_data or arm.animation_data_create()
    esc = 1.0 / max(0.1, velocidade)
    f0, f1 = a.frame_range
    ciclo = max(1.0, f1 - f0) * esc
    uma_vez = any(k in a.name.lower().split('|')[-1] for k in UMA_VEZ)
    ini = f
    if primeira and not uma_vez and f > 1:
        ini = f - math.ceil((f - 1) / ciclo) * ciclo
    if not primeira:
        # a faixa que está valendo em f (a de cima, mesmo que já tenha acabado e esteja segurando a pose) some em MISTURA
        # quadros, junto com a entrada da nova: o canal que SÓ o clipe antigo anima (alvos de IK do pé) volta ao repouso
        # suavemente em vez de ficar preso na pose velha e estalar quando a faixa acaba
        ativas = [tr for tr in ad.nla_tracks if not tr.mute and tr.strips]
        if ativas:
            ant = ativas[-1].strips[0]
            if not ant.use_animated_influence:
                ant.influence = 1.0        # antes de ligar a influência animada: a chave automática nasce em 1, não em 0
                ant.use_animated_influence = True
            fc = ant.fcurves.find('influence') or ant.fcurves.new('influence')
            fc.keyframe_points.insert(f, 1.0).interpolation = 'LINEAR'
            fc.keyframe_points.insert(f + MISTURA, 0.0).interpolation = 'LINEAR'
            if ant.frame_start < f < ant.frame_end:
                ant.frame_end = min(ant.frame_end, f + MISTURA + 2)
                if ant.extrapolation != 'HOLD':
                    ant.extrapolation = 'NOTHING'
    tr = ad.nla_tracks.new()
    st = tr.strips.new(a.name, int(math.floor(ini)), a)
    st.scale = esc
    if uma_vez:
        st.repeat = 1.0
    else:
        total = bpy.context.scene.frame_end - st.frame_start + 10
        st.repeat = max(1.0, total / ciclo)
    st.extrapolation = 'HOLD' if (primeira and uma_vez) else 'HOLD_FORWARD'
    if not primeira:
        # entra em MISTURA quadros (a influência animada substitui o blend_in automático, então a entrada também é chave)
        st.influence = 0.0
        st.use_animated_influence = True
        fc = st.fcurves.find('influence') or st.fcurves.new('influence')
        fc.keyframe_points.insert(f, 0.0).interpolation = 'LINEAR'
        fc.keyframe_points.insert(f + MISTURA, 1.0).interpolation = 'LINEAR'
    return st


_COMPLETOS = {}


def _canais_do_clipe(a):
    from bpy_extras import anim_utils
    out = {}
    for sl in a.slots:
        cb = anim_utils.action_get_channelbag_for_slot(a, sl)
        if cb:
            for fc in cb.fcurves:
                out[(fc.data_path, fc.array_index)] = fc
    return out


def _completa(g, a):
    """Alguns clipes do kit (o Idle das mulheres 'HumanArmature') não têm chave pro braço direito: o braço fica na pose
    de repouso do modelo, esticado de lado (T). Devolve uma cópia do clipe com os canais de braço/ombro que faltam
    fixos na pose do primeiro quadro do Walk do mesmo esqueleto."""
    if a.name in _COMPLETOS:
        return _COMPLETOS[a.name]
    ref = None
    for n in g.get('acoes', []):
        c = bpy.data.actions.get(n)
        if c is not None and 'walk' in c.name.lower().split('|')[-1]:
            ref = c
            break
    if ref is None or 'walk' in a.name.lower().split('|')[-1]:
        _COMPLETOS[a.name] = a
        return a
    tem, quer = _canais_do_clipe(a), _canais_do_clipe(ref)
    falta = [(k, fc) for k, fc in quer.items() if k not in tem and 'rotation' in k[0]
             and any(w in k[0].lower() for w in ('arm', 'shoulder'))]
    if not falta:
        _COMPLETOS[a.name] = a
        return a
    from bpy_extras import anim_utils
    nova = a.copy()
    nova.name = a.name + '.completo'
    cb = anim_utils.action_get_channelbag_for_slot(nova, nova.slots[0])
    f0, f1 = a.frame_range
    for (dp, idx), fc in falta:
        novo = cb.fcurves.new(data_path=dp, index=idx)
        v = fc.evaluate(ref.frame_range[0])
        novo.keyframe_points.insert(f0, v).interpolation = 'LINEAR'
        novo.keyframe_points.insert(f1, v).interpolation = 'LINEAR'
    _COMPLETOS[a.name] = nova
    return nova


def _acha_clipe(g, acao):
    proprias = [bpy.data.actions[n] for n in g.get('acoes', [])]
    curto = lambda a: a.name.lower().split('|')[-1]
    acoes = [a for a in proprias if acao.lower() in curto(a)]
    exata = [a for a in acoes if curto(a) in (acao.lower(), 'man_' + acao.lower(), 'female_' + acao.lower())]
    achado = (exata or acoes or [None])[0]
    return _completa(g, achado) if achado is not None else None


def pessoa(nome, arquivo, loc=(0, 0, 0), altura=1.72, rot_z=0.0, acao='Idle', pai=None, inicio=0.0, velocidade=1.0):
    """uma pessoa de verdade (personagem CC0 com esqueleto), na altura certa e com a animação `acao` (Idle, Walk,
    Clapping, Sitting, Run...) em loop desde `inicio`. rot_z = pra onde ela olha (0 = olhando pra câmera em -Y).
    O ponto mais baixo da malha, em todo o ciclo da animação, pousa no chão (loc.z)."""
    g = asset(nome, arquivo, loc, altura, 'altura', rot_z, pai, ator='pessoa')
    arm = next((o for o in g.children_recursive if o.type == 'ARMATURE'), None)
    if arm:
        a = _acha_clipe(g, acao)
        if a:
            ad = arm.animation_data or arm.animation_data_create()
            ad.action = None
            _faixa(arm, a, int(q(inicio)), velocidade, primeira=True)
            _pousa_pes(g, arm, a, inicio)
    return g


def _pousa_pes(g, arm, acao, inicio):
    """o ponto mais baixo da malha, medido na pose real ao longo do ciclo da animação, vai pro z = 0 do grupo `g`
    (o chão). O modelo nem flutua nem afunda, qualquer que seja a pose do arquivo."""
    sc = bpy.context.scene
    f_ini = sc.frame_current
    f0, f1 = acao.frame_range
    base = q(inicio)
    peles = [o for o in g.children_recursive if o.type == 'MESH' and vai_pro_quadro(o)]
    menor = 1e9
    for k in range(7):
        sc.frame_set(base + int(round((f1 - f0) * k / 6)))
        P = _pontos_mundo(peles)
        if len(P):
            inv = g.matrix_world.inverted()
            menor = min(menor, min((inv @ Vector(p)).z for p in P[P[:, 2].argsort()[:20]]))
    sc.frame_set(f_ini)
    if menor < 1e8 and abs(menor) > 1e-4:
        for r in g.children:
            r.location.z -= menor


def topo_da_cabeca(g):
    """ponto no mundo do topo da cabeça da pessoa `g`, medido na malha avaliada (pose parada do começo): o maior z e o
    centro (x, y) dos vértices a até 4 cm dele."""
    sc = bpy.context.scene
    f_ini = sc.frame_current
    sc.frame_set(1)
    P = _pontos_mundo([o for o in g.children_recursive if o.type == 'MESH' and vai_pro_quadro(o)])
    sc.frame_set(f_ini)
    zmax = P[:, 2].max()
    topo = P[P[:, 2] > zmax - 0.04]
    return Vector((topo[:, 0].mean(), topo[:, 1].mean(), zmax))


def na_cabeca(g, obj, sobe=0.0):
    """prende `obj` no osso da cabeça do personagem `g`: o objeto segue a cabeça na animação. `obj` é modelado em metros,
    com a BASE em z = 0, em pé, e fica com a base `sobe` metros acima do topo REAL da cabeça (medido na malha: negativo
    afunda a base na cabeça, como uma aba de chapéu)."""
    from mathutils import Matrix
    arm = next((o for o in g.children_recursive if o.type == 'ARMATURE'), None)
    if not arm:
        obj.parent = g
        return obj
    nomes = [b.name for b in arm.data.bones]
    osso = next((n for n in nomes if n.lower() in ('head', 'head_end')), None) or next((n for n in nomes if 'head' in n.lower()), nomes[-1])
    sc = bpy.context.scene
    f_ini = sc.frame_current
    sc.frame_set(1)
    ponto = topo_da_cabeca(g) + Vector((0, 0, sobe))
    sc.frame_set(1)
    bpy.context.view_layer.update()
    pb = arm.pose.bones[osso]
    M_osso = arm.matrix_world @ pb.matrix @ Matrix.Translation((0, pb.bone.length, 0))  # o filho de osso nasce na ponta dele
    obj.parent = arm
    obj.parent_type = 'BONE'
    obj.parent_bone = osso
    obj.matrix_parent_inverse = M_osso.inverted()
    obj.matrix_basis = Matrix.Translation(ponto)
    sc.frame_set(f_ini)
    return obj


def na_osso(g, obj, osso, desloc=(0.0, 0.0, 0.0), rot=(0.0, 0.0, 0.0), frame=1):
    """prende `obj` num osso do esqueleto da pessoa `g` (ex.: 'Wrist.R'): o objeto fica na mão e segue o braço em toda a
    animação. Posição e giro (`desloc` em metros, `rot` em radianos) são relativos ao osso, na pose do quadro `frame`;
    a escala do objeto no mundo não muda (é a do próprio objeto)."""
    from mathutils import Euler, Matrix
    arm = next((o for o in g.children_recursive if o.type == 'ARMATURE'), None)
    sc = bpy.context.scene
    f_ini = sc.frame_current
    sc.frame_set(frame)
    bpy.context.view_layer.update()
    pb = arm.pose.bones[osso]
    pai = arm.matrix_world @ pb.matrix @ Matrix.Translation((0, pb.bone.length, 0))   # o filho de osso nasce na ponta dele
    mundo = arm.matrix_world @ pb.matrix @ Matrix.Translation(desloc)
    loc, quat, _ = mundo.decompose()
    obj.parent = arm
    obj.parent_type = 'BONE'
    obj.parent_bone = osso
    obj.matrix_parent_inverse = pai.inverted()
    obj.matrix_basis = Matrix.Translation(loc) @ quat.to_matrix().to_4x4() @ Euler(rot).to_matrix().to_4x4()
    sc.frame_set(f_ini)
    return obj


def cartola(g, cor='#1C1C1C', alta=True):
    """cartola (ou chapéu-coco, alta=False) na cabeça do personagem: a aba pousa 2,5 cm abaixo do topo real da cabeça."""
    h = 0.2 if alta else 0.1
    c = grupo(g.name + '.chapeu', (0, 0, 0))
    cilindro(g.name + '.aba', 0.165, 0.025, (0, 0, 0.0125), cor, rough=0.5, pai=c)
    cilindro(g.name + '.copa', 0.105, h, (0, 0, 0.025 + h / 2), cor, rough=0.45, pai=c)
    return na_cabeca(g, c, sobe=-0.025)


def troca_acao(g, acao, t, velocidade=1.0):
    """muda a animação da pessoa a partir de t (ex.: Idle -> Walk -> Idle). A faixa anterior termina em t e não segura
    a pose dela."""
    arm = next((o for o in g.children_recursive if o.type == 'ARMATURE'), None)
    if not arm:
        return
    a = _acha_clipe(g, acao)
    if a:
        _faixa(arm, a, int(q(t)), velocidade)


def foco(obj, t0, t1):
    """declara que `obj` é o foco do plano de t0 a t1: a checagem acusa se ele sair do quadro (faixa de 10% a 90%)."""
    FOCOS.append((obj.name, t0, t1))


def veiculo(obj, frente=(1, 0, 0), t0=0.0, t1=None, nariz_acima=15.0, sobe_acima=3.0, de_lado=8.0):
    """declara um veículo feito por código (avião, foguete, submarino, carro): `frente` é o eixo LOCAL do nariz e o Z
    local é o "pra cima" dele. Entre t0 e t1, com mais de 1 m/s, a checagem confere o NARIZ em 3D contra a velocidade
    (o `ator` só olha o plano XY): andar de ré ou de lado (mais de `de_lado` graus) é erro; a trajetória acima do nariz
    (subir "de barriga", mais de `sobe_acima` graus) é erro; o nariz acima da trajetória é o ângulo de ataque, aceito
    até `nariz_acima` graus (avião rodando na pista, subindo). Avião sem isso subia de elevador com o nariz 28 graus
    abaixo da trajetória (2026-10-21)."""
    VEICULOS.append((obj.name, tuple(frente), t0, t1, nariz_acima, sobe_acima, de_lado))
    return obj


def simetria(obj, n):
    """a peça tem `n` pás/raios iguais (roda, hélice, turbina): a checagem acusa giro acima de 40% do passo por quadro."""
    obj['simetria'] = int(n)
    return obj


def _selo(cena_py):
    """impressão digital do que a checagem conferiu: a cena, a biblioteca, a checagem e as falas."""
    import hashlib
    h = hashlib.sha1()
    pasta = Path(cena_py).resolve().parent
    for f in (Path(cena_py), Path(__file__), Path(__file__).with_name('checar.py'), pasta / 'palavras.json'):
        if f.exists():
            h.update(f.read_bytes())
    return h.hexdigest()[:16]


def checar(pasta, cena_py=None):
    """a conferência sem render (checar.py): grava `<pasta>/conferencia/checagem.txt` e sai com erro se achar defeito."""
    import checar as _c
    fecha_cortes()
    _c.rodar(pasta, CORTES, ENTRADAS, ACENDES, FOCOS, APARECES, _selo(cena_py) if cena_py else '', apoios=APOIOS,
             sumicos=SUMICOS, suportes=SUPORTES, veiculos=VEICULOS, no_ar=NO_AR)


def rodar(pasta, cena_py, eventos=None, amostras_previa=16, pct_previa=40):
    """o portão da cena: escolhe o modo pelo que vem depois do `--` e roda. Toda cena termina com `K.rodar(AQUI, __file__)`.
        previa t1 t2 ...  quadros de prévia nos instantes dados
        checar            a conferência sem render (grava conferencia/checagem.txt, com o selo)
        eventos           grava eventos.json (os sons) chamando `eventos()`
        render [f0 f1]    renderiza os quadros. RECUSA se a checagem não estiver limpa pra esta versão da cena
        salvar            grava cena.blend
    """
    args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    modo = args[0] if args else ''
    pasta = Path(pasta)
    sc = bpy.context.scene
    fecha_cortes()
    if modo == 'previa':
        sc.render.resolution_percentage = pct_previa
        sc.eevee.taa_render_samples = amostras_previa
        saida = pasta / 'previa'
        saida.mkdir(exist_ok=True)
        for s_ in args[1:]:
            t = float(s_)
            sc.frame_set(q(t))
            sc.render.filepath = str(saida / f'p_{t:06.2f}.png')
            bpy.ops.render.render(write_still=True)
    elif modo == 'checar':
        checar(pasta, cena_py)
    elif modo == 'eventos':
        if eventos:
            eventos()
        salvar_eventos(pasta / 'eventos.json')
    elif modo == 'render':
        rel = pasta / 'conferencia' / 'checagem.txt'
        txt = rel.read_text(encoding='utf-8') if rel.exists() else ''
        if 'RESULTADO: LIMPA' not in txt or f'SELO: {_selo(cena_py)}' not in txt:
            print('RENDER RECUSADO: a checagem não está limpa pra esta versão da cena. Rode `-- checar` e corrija o que ela acusar.')
            sys.exit(2)
        f0 = int(args[1]) if len(args) > 1 else None
        f1 = int(args[2]) if len(args) > 2 else None
        render_png(pasta / 'quadros', f0, f1)
    elif modo == 'salvar':
        nucleo.salvar(pasta / 'cena.blend')
    elif modo not in ('', 'nada'):
        raise SystemExit(f'modo desconhecido: {modo} (previa | checar | eventos | render | salvar)')


# ---------------------------------------------------------------- caminhar com a frente certa
def _gira_ate(atual, alvo):
    """o ângulo `alvo` visto da volta mais curta a partir de `atual` (sem dar a volta inteira)."""
    return atual + (alvo - atual + math.pi) % (2 * math.pi) - math.pi


def anda(g, pontos, vel_passo=1.25, giro=0.25, olha_no_fim=None):
    """`g` (pessoa ou veículo) percorre `pontos` [(t, (x, y, z)), ...]. O 1º ponto é onde ele está no instante t (sai
    dali); cada ponto seguinte é onde ele CHEGA no instante t. Dois pontos seguidos no mesmo lugar = fica parado.
    Em cada trecho ele vira pra direção do movimento (giro de `giro` s antes de sair), anda em velocidade constante
    até a chegada, e a animação acompanha: Walk com a velocidade do passo ajustada ao deslocamento (`vel_passo` = m/s
    do ciclo nativo da animação), Idle parado. `olha_no_fim` = direção no mundo (graus; 0 = +X, 90 = +Y) pra onde ele
    fica olhando ao parar; padrão: continua virado pra onde andou."""
    fr = math.radians(g.get('frente_graus', -90.0))
    pts = [(t, Vector(p)) for t, p in pontos]
    trechos = []
    for (ta, a), (tb, b) in zip(pts, pts[1:]):
        d = b - a
        if math.hypot(d.x, d.y) > 1e-4 and tb > ta:
            trechos.append((ta, tb, a, b, math.atan2(d.y, d.x) - fr))
    if not trechos:
        return
    passo = 1.0 / FPS
    rz = [(0.0, g.rotation_euler.z)]

    def tecla(t, r):
        rz.append((max(t, rz[-1][0] + passo), r))
    for ta, tb, a, b, rot in trechos:
        tecla(ta - giro, rz[-1][1])
        tecla(ta, _gira_ate(rz[-1][1], rot))
    if olha_no_fim is not None:
        tecla(trechos[-1][1], rz[-1][1])
        tecla(trechos[-1][1] + giro, _gira_ate(rz[-1][1], math.radians(olha_no_fim) - fr))
    anima.chave(g, 'rotation_euler', [(t, (0, 0, r), 'firme') for t, r in rz])

    def posicao(t):
        for ta, tb, a, b, rot in trechos:
            if t < ta:
                return tuple(a)
            if t <= tb:
                return tuple(a + (b - a) * ((t - ta) / (tb - ta)))
        return tuple(trechos[-1][3])
    anima.assar(g, 'location', posicao, 0.0, trechos[-1][1])
    if g.get('ator') == 'pessoa':
        for ta, tb, a, b, rot in trechos:
            troca_acao(g, 'Walk', ta, velocidade=(b - a).length / (tb - ta) / vel_passo)
            troca_acao(g, 'Idle', tb)


# ---------------------------------------------------------------- câmera por planos
def _ease(u, curva):
    u = max(0.0, min(1.0, u))
    if curva == 'linear':
        return u
    if curva == 'degrau':
        return 0.0
    if curva == 'camera':  # SINE ease-in-out
        return 0.5 - 0.5 * math.cos(math.pi * u)
    return u * u * (3 - 2 * u)


def _estado(a, b, t):
    """onde a câmera está no instante t do trecho que vai do ponto a ao b (curva do trecho = a[5])."""
    u = _ease((t - a[0]) / max(1e-6, b[0] - a[0]), a[5])
    mix = lambda x, y: x + (y - x) * u
    est = [tuple(mix(x, y) for x, y in zip(a[1], b[1])), mix(a[2], b[2]), mix(a[3], b[3]), mix(a[4], b[4])]
    if len(a) > 6 and len(b) > 6:
        est.append(mix(a[6], b[6]))
    return est


def _chave_frac(alvo, caminho, v, frame, curva, indice=-1):
    """chave num quadro FRACIONÁRIO (o corte acontece a meio quadro do corte, antes de o obturador abrir)."""
    if indice >= 0:
        getattr(alvo, caminho)[indice] = v
    else:
        setattr(alvo, caminho, v)
    alvo.keyframe_insert(caminho, index=indice, frame=frame)
    interp, ease = anima.CURVAS[curva]
    for fc in anima.fcurves(alvo, caminho):
        if indice >= 0 and fc.array_index != indice:
            continue
        for kp in fc.keyframe_points:
            if abs(kp.co.x - frame) < 1e-3:
                kp.interpolation = interp
                kp.easing = ease


def camera(pontos, lente=35):
    """uma câmera só, guiada por pontos no tempo:
        (t, alvo(x,y,z), distância, azimute°, inclinação°, curva[, lente])
    `curva` é a do trecho que COMEÇA no ponto: 'camera' (viagem suave até o próximo), 'linear' (deriva
    constante: o plano que nunca congela) ou 'degrau' (parado). Um ponto com curva 'corte' é um corte seco:
    a câmera segue o trecho anterior até 1 quadro antes e salta pra ele; dali em diante o trecho é 'linear'.
    O salto da câmera (e o de tudo que reseta junto, ver fecha_cortes) acontece a MEIO QUADRO antes do quadro do
    corte, quando o obturador do motion blur está fechado: o quadro do corte sai limpo, sem fantasma dos dois planos.
    Dois pontos a menos de 0,3 s um do outro (fora de um corte) dão salto de câmera: a função recusa.
    Azimute 0 = câmera em -Y olhando +Y; inclinação positiva = de cima."""
    for a, b in zip(pontos, pontos[1:]):
        if b[0] - a[0] < 0.3 and b[5] != 'corte':
            raise ValueError(f'câmera: pontos a {b[0] - a[0]:.2f} s um do outro ({a[0]:.2f} s e {b[0]:.2f} s) fora de um corte '
                             f'dão salto de câmera. Afaste pra 0,3 s ou mais, ou declare o 2º como "corte".')
    pts, cortes, planos = [], [], []
    plano = 0
    for p in pontos:
        p = list(p)
        eh_corte = p[5] == 'corte'
        if eh_corte:
            CORTES.append(p[0])
            p[5] = 'linear'
            if pts:
                a = pts[-1]
                th = p[0] - 1.0 / FPS
                # o plano anterior não viaja pro próximo: fica nele até 1 quadro antes do corte, CONTINUANDO o movimento
                # que vinha (o alvo de um K.segue segue andando; copiar o último ponto congelava o alvo e perdia o objeto).
                # Só vale pra pontos densos (K.segue: a cada 0,4 s); uma viagem longa que CHEGOU não continua além do destino.
                if a[5] in ('camera', 'linear'):
                    a[5] = 'linear'
                    b = pts[-2] if len(pts) > 1 and pts[-2][0] < a[0] and planos[-2] == planos[-1] and pts[-2][5] == 'linear' and a[0] - pts[-2][0] <= 0.6 else None
                    dt = max(0.0, min(th - a[0], 1.5))
                    if b is not None and a[0] > b[0]:
                        # pontos densos: a espera continua o movimento inteiro (alvo, distância, giro e inclinação)
                        k = dt / (a[0] - b[0])
                        mx = lambda x, y: x + (x - y) * k
                        h = [th, tuple(mx(x, y) for x, y in zip(a[1], b[1])), mx(a[2], b[2]), mx(a[3], b[3]), mx(a[4], b[4]), 'degrau'] + a[6:]
                    else:
                        # deriva lenta do plano parado, proporcional ao tempo que falta até o corte (trecho com menos de
                        # 0,5 s não deriva: os 2,5 graus fixos viravam um tranco de 2 quadros depois de um K.segue)
                        kd = 0.0 if dt < 0.5 else min(1.0, dt / 1.5)
                        h = [th, a[1], a[2] * (1 - 0.03 * kd), a[3] + 2.5 * kd, a[4], 'degrau'] + a[6:]
                else:
                    h = [th] + a[1:5] + ['degrau'] + a[6:]
                pts.append(h)
                cortes.append(False)
                planos.append(plano)
            plano += 1
        pts.append(p)
        cortes.append(eh_corte)
        planos.append(plano)
    c = anima.Camera(alvo=pts[0][1], distancia=pts[0][2], angulo=pts[0][3], inclinacao=pts[0][4], lente=lente, fstop=11)
    c.dados.dof.use_dof = False
    for p, corte in zip(pts, cortes):
        tt, alvo, dist, az, inc, cv = p[:6]
        itens = [(c.pivo, 'location', tuple(alvo)), (c.foco, 'location', tuple(alvo)),  # a câmera mira o foco: ele anda junto
                 (c.pivo, 'rotation_euler', (math.radians(-inc), 0, math.radians(az))), (c.braco, 'location', (0, -dist, 0))]
        if len(p) > 6:
            itens.append((c.dados, 'lens', p[6]))
        # alcance: perto em 0,5 m (não 0,01: com 0,01 a precisão de profundidade cai a 1,5 cm a 50 m) e longe em 2000 m
        # (com 150 o mar de nuvens, o chão e as nuvens somem)
        itens.append((c.dados, 'clip_start', 0.5 if dist > 3.0 else 0.2))
        itens.append((c.dados, 'clip_end', 2000.0))
        for alvo_, caminho, v in itens:
            if corte:
                _chave_frac(alvo_, caminho, v, q(tt) - 0.5, cv)
            else:
                anima.chave(alvo_, caminho, [(tt, v, cv)])
    fecha_cortes()
    return c


_TRANSF_CORTE = ('location', 'rotation_euler', 'scale', 'delta_location', 'delta_rotation_euler', 'delta_scale')


def fecha_cortes():
    """Tudo que RESETA num corte (cabine que volta pra cima, plataforma que sobe, peça que muda de lugar) salta a meio
    quadro do corte, junto com a câmera e em degrau, em vez de riscar o quadro do corte na interpolação linear.
    Idempotente: pode ser chamada de novo depois que a cena ganhar mais animação."""
    from bpy_extras import anim_utils
    for t in CORTES:
        fc_ = q(t)
        for o in bpy.data.objects:
            ad = o.animation_data
            if not ad or not ad.action:
                continue
            cb = anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot)
            if cb is None:
                continue
            for fcv in list(cb.fcurves):
                if fcv.data_path not in _TRANSF_CORTE:
                    continue
                a, b = fcv.evaluate(fc_ - 1), fcv.evaluate(fc_)
                viz = max(abs(a - fcv.evaluate(fc_ - 2)), abs(fcv.evaluate(fc_ + 1) - b))
                if abs(b - a) < 0.05 + 4 * viz:
                    continue
                if any(abs(kp.co.x - (fc_ - 0.5)) < 1e-3 for kp in fcv.keyframe_points):
                    continue
                for kp in fcv.keyframe_points:
                    if fc_ - 1 - 1e-3 <= kp.co.x < fc_ - 0.5:
                        kp.interpolation = 'CONSTANT'
                novo = fcv.keyframe_points.insert(fc_ - 0.5, b)
                novo.interpolation = 'CONSTANT'


def segue(t0, t1, alvo_de, dist, az0, az1, inc, passo=0.4, primeiro='linear', lente=35):
    """pontos de câmera a cada `passo` segundos mirando um alvo que anda (alvo_de(t) -> (x, y, z)). Use pra tudo que
    se move rápido (foguete, cápsula, carro, avião): ponto fixo com 'camera' perde o objeto."""
    out = []
    n = max(1, int((t1 - t0) / passo))
    for k in range(n + 1):
        t = t0 + (t1 - t0) * k / n
        out.append((t, tuple(alvo_de(t)), dist, az0 + (az1 - az0) * k / n, inc, primeiro if k == 0 else 'linear', lente))
    return out


def render_png(pasta, f0=None, f1=None):
    fecha_cortes()
    sc = bpy.context.scene
    Path(pasta).mkdir(parents=True, exist_ok=True)
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGB'
    sc.render.filepath = str(Path(pasta) / 'q')
    if f0:
        sc.frame_start = f0
    if f1:
        sc.frame_end = f1
    sc.render.use_overwrite = False  # retomar sem refazer quadro pronto
    sc.render.use_placeholder = True
    bpy.ops.render.render(animation=True)
