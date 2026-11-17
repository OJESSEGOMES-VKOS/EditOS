"""Movimento: keyframes com curvas premium nativas (editáveis no Graph Editor), molas, câmera.

No Blender 5.x a ação é em camadas: `action.fcurves` NÃO existe mais. As F-curves moram no
channelbag do slot: anim_utils.action_get_channelbag_for_slot(action, slot).fcurves.

Vocabulário de curvas (a "assinatura de movimento"). Cada chave define a curva do trecho que
COMEÇA nela (é assim que o Blender interpola):

    'pousa'     EXPO ease-out     entrada rápida que assenta macio (a curva premium por excelência)
    'decola'    EXPO ease-in      saída que acelera pra fora de quadro
    'premium'   QUINT ease-in-out movimento de A a B sem pressa, peso de objeto caro
    'camera'    SINE ease-in-out  câmera: aceleração suave, nunca tranco
    'firme'     CUBIC ease-in-out o meio-termo, UI e cartões
    'ressalta'  BACK ease-out     passa um pouco do ponto e volta (overshoot). back=1.2 sutil
    'elastico'  ELASTIC ease-out  brinquedo/pop. Usar pouco
    'linear'    LINEAR            giro contínuo, esteira, nada mais
    'degrau'    CONSTANT          troca seca (visibilidade, corte)
    'bezier'    BEZIER auto       a padrão do Blender: evitar como acabamento, ela é o "cara de software"
"""
import math

import bpy
from bpy_extras import anim_utils

from . import aviso
from .nucleo import quadro

CURVAS = {
    'pousa': ('EXPO', 'EASE_OUT'),
    'decola': ('EXPO', 'EASE_IN'),
    'premium': ('QUINT', 'EASE_IN_OUT'),
    'camera': ('SINE', 'EASE_IN_OUT'),
    'firme': ('CUBIC', 'EASE_IN_OUT'),
    'suave': ('QUART', 'EASE_OUT'),
    'ressalta': ('BACK', 'EASE_OUT'),
    'elastico': ('ELASTIC', 'EASE_OUT'),
    'linear': ('LINEAR', 'AUTO'),
    'degrau': ('CONSTANT', 'AUTO'),
    'bezier': ('BEZIER', 'AUTO'),
}


def _dono(alvo, caminho):
    """aceita (objeto, 'location') ou (socket/struct, 'default_value'). Devolve (id, data_path)."""
    idb = alvo.id_data
    if idb is alvo:
        return idb, caminho
    return idb, alvo.path_from_id(caminho)


def fcurves(alvo, caminho):
    idb, dp = _dono(alvo, caminho)
    ad = idb.animation_data
    if ad is None or ad.action is None:
        return []
    cb = anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot)
    if cb is None:
        return []
    return [f for f in cb.fcurves if f.data_path == dp]


def chave(alvo, caminho, pontos, curva='premium', indice=-1, back=1.2):
    """pontos: [(t_segundos, valor), ...] ou [(t, valor, curva), ...].
    valor pode ser número ou tupla (para location, rotation_euler, scale, cor).
    """
    for p in pontos:
        t, v = p[0], p[1]
        cv = p[2] if len(p) > 2 else curva
        f = quadro(t)
        if indice >= 0:
            getattr(alvo, caminho)[indice] = v
        else:
            try:
                setattr(alvo, caminho, v)
            except (TypeError, AttributeError):
                aviso(f'não consegui atribuir {caminho}={v!r}')
        alvo.keyframe_insert(caminho, index=indice, frame=f)
        interp, ease = CURVAS[cv]
        for fc in fcurves(alvo, caminho):
            if indice >= 0 and fc.array_index != indice:
                continue
            for kp in fc.keyframe_points:
                if abs(kp.co.x - f) < 0.5:
                    kp.interpolation = interp
                    kp.easing = ease
                    if interp == 'BACK':
                        kp.back = back
    return alvo


def segura(alvo, caminho, t0, t1, curva='premium'):
    """mantém o valor atual parado entre t0 e t1 (o 'respiro' do quadro-herói)."""
    v = getattr(alvo, caminho)
    v = tuple(v) if hasattr(v, '__len__') else v
    chave(alvo, caminho, [(t0, v), (t1, v)], curva)


def ciclico(alvo, caminho):
    for fc in fcurves(alvo, caminho):
        fc.modifiers.new('CYCLES')


def tremor(alvo, caminho='rotation_euler', forca=0.004, escala=40.0, semente=0):
    """câmera na mão sutil (modificador Noise na F-curve). forca em radianos: 0,002 a 0,006 é
    "operador com tripé fluido"; acima de 0,01 vira documentário."""
    fcs = fcurves(alvo, caminho)
    if not fcs:
        alvo.keyframe_insert(caminho, frame=1)
        fcs = fcurves(alvo, caminho)
    for i, fc in enumerate(fcs):
        m = fc.modifiers.new('NOISE')
        m.strength = forca * 2
        m.scale = escala
        m.phase = semente * 13.7 + i * 31.1
    return fcs


# ---------------------------------------------------------------- molas (física assada)
def mola(u, rigidez=170.0, amortecimento=16.0, massa=1.0):
    """resposta de mola amortecida de 0 a 1 (mesma física do spring do Remotion/Framer).
    rigidez alta = rápido; amortecimento baixo = balança mais."""
    if u <= 0:
        return 0.0
    w0 = math.sqrt(rigidez / massa)
    z = amortecimento / (2 * math.sqrt(rigidez * massa))
    if z < 1:
        wd = w0 * math.sqrt(1 - z * z)
        return 1 - math.exp(-z * w0 * u) * (math.cos(wd * u) + z * w0 / wd * math.sin(wd * u))
    return 1 - math.exp(-w0 * u) * (1 + w0 * u)


def assar(alvo, caminho, fn, t0, t1, indice=-1):
    """grava fn(t) quadro a quadro (para mola, física, expressão). Interpolação linear entre quadros."""
    sc = bpy.context.scene
    f0, f1 = quadro(t0), quadro(t1)
    for f in range(f0, f1 + 1):
        t = (f - 1) / sc.render.fps
        v = fn(t)
        if indice >= 0:
            getattr(alvo, caminho)[indice] = v
        else:
            setattr(alvo, caminho, v)
        alvo.keyframe_insert(caminho, index=indice, frame=f)
    for fc in fcurves(alvo, caminho):
        for kp in fc.keyframe_points:
            if f0 <= kp.co.x <= f1:
                kp.interpolation = 'LINEAR'


def entra_mola(obj, t0, de=(0, 0, -0.05), escala_de=0.0, rigidez=170, amortecimento=14, dur=1.2):
    """entrada com mola: sobe de `de` (deslocamento) e cresce de escala_de até 1."""
    base = tuple(obj.location)
    esc = tuple(obj.scale)

    def loc(t):
        p = mola(t - t0, rigidez, amortecimento)
        return tuple(b + d * (1 - p) for b, d in zip(base, de))

    def sca(t):
        p = mola(t - t0, rigidez, amortecimento)
        k = escala_de + (1 - escala_de) * p
        return tuple(e * k for e in esc)
    assar(obj, 'location', loc, t0, t0 + dur)
    assar(obj, 'scale', sca, t0, t0 + dur)


def escalonar(objs, t0, passo, fn):
    """chama fn(obj, t) com atraso progressivo (stagger). passo de 2 a 4 quadros é o padrão."""
    sc = bpy.context.scene
    for i, o in enumerate(objs):
        fn(o, t0 + i * passo / sc.render.fps)


# ---------------------------------------------------------------- câmera
class Camera:
    """rig de câmera de estúdio:
        pivo (vazio no alvo; girar = órbita, subir = grua)
          └─ braco (vazio; location.y negativo = distância; dolly = animar braco.location.y)
               └─ cam (olha sempre pro 'foco' via Track To; o foco também comanda o desfoque)
    """

    def __init__(self, alvo=(0, 0, 0), distancia=0.8, altura=0.0, angulo=0.0, inclinacao=8.0,
                 lente=85, fstop=5.6, sensor=36, nome='Cam', distancia_por_lente=False):
        """inclinacao positiva = câmera ACIMA do alvo olhando pra baixo (graus).
        distancia_por_lente=True: `distancia` vale para 85 mm e é ajustada pela lente, pra o
        produto manter o mesmo tamanho em quadro quando o mundo troca a lente."""
        if distancia_por_lente:
            distancia = distancia * lente / 85.0
        from .nucleo import vazio, ligar
        self.pivo = vazio(nome + '.pivo', alvo)
        self.pivo.rotation_euler = (math.radians(-inclinacao), 0, math.radians(angulo))
        self.braco = vazio(nome + '.braco', (0, -distancia, altura), pai=self.pivo)
        self.foco = vazio(nome + '.foco', alvo, tamanho=0.02)
        cd = bpy.data.cameras.new(nome)
        cd.lens = lente
        cd.sensor_width = sensor
        cd.clip_start = 0.01
        cd.clip_end = 200
        cd.dof.use_dof = True
        cd.dof.focus_object = self.foco
        cd.dof.aperture_fstop = fstop
        cd.dof.aperture_blades = 7
        self.cam = ligar(bpy.data.objects.new(nome, cd), pai=self.braco)
        tr = self.cam.constraints.new('TRACK_TO')
        tr.target = self.foco
        tr.track_axis = 'TRACK_NEGATIVE_Z'
        tr.up_axis = 'UP_Y'
        bpy.context.scene.camera = self.cam

    @property
    def dados(self):
        return self.cam.data

    def orbita(self, t0, t1, ang0, ang1, curva='camera'):
        chave(self.pivo, 'rotation_euler', [(t0, math.radians(ang0)), (t1, math.radians(ang1))], curva, indice=2)

    def inclina(self, t0, t1, a0, a1, curva='camera'):
        chave(self.pivo, 'rotation_euler', [(t0, math.radians(-a0)), (t1, math.radians(-a1))], curva, indice=0)

    def dolly(self, t0, t1, d0, d1, curva='camera'):
        chave(self.braco, 'location', [(t0, -d0), (t1, -d1)], curva, indice=1)

    def grua(self, t0, t1, z0, z1, curva='camera'):
        chave(self.pivo, 'location', [(t0, z0), (t1, z1)], curva, indice=2)

    def zoom(self, t0, t1, l0, l1, curva='camera'):
        chave(self.dados, 'lens', [(t0, l0), (t1, l1)], curva)

    def foco_em(self, pontos, curva='premium'):
        """rack focus: pontos [(t, (x,y,z))]."""
        chave(self.foco, 'location', pontos, curva)

    def abertura(self, t0, t1, f0, f1, curva='camera'):
        chave(self.dados.dof, 'aperture_fstop', [(t0, f0), (t1, f1)], curva)

    def na_mao(self, forca=0.003, escala=45.0):
        tremor(self.braco, 'rotation_euler', forca, escala)
