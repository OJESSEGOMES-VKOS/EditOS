# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (channelbag, interpolation, easing, back, handles FREE, NOISE) | fonte: https://docs.blender.org/api/current/bpy_extras.anim_utils.html ; https://docs.blender.org/api/current/bpy.types.Keyframe.html
"""
Biblioteca de curvas de movimento para o estúdio (Blender 5.x, ações em slots).

Funções:
  fcurve(idd, data_path, index)             -> F-curve pelo channelbag (5.x)
  mover(obj, path, index, q0, q1, v0, v1, estilo)  estilos: 'linear','bezier','expo_out','expo_in_out',
                                            'quart_out','quint_out','sine_in_out','premium','pouso'
  alca_assimetrica(fc, q0, q1, saida, chegada)  alças FREE: saida/chegada em fração da duração (0..1)
  overshoot_para_back(pct)                  converte overshoot desejado (%) em k.back (tabela medida)
  tremor(obj, path, index, amp_pico, periodo_q)  modificador NOISE calibrado (pico ~0,33 x strength)
"""
import bpy
from bpy_extras import anim_utils

# medido por sonda no 5.2.2: chave 0 -> 1 em 30 quadros, BACK + EASE_OUT, (back, overshoot %)
_BACK = [(0.5, 0.8), (0.8, 2.3), (1.0, 3.7), (1.2, 5.3), (1.4, 7.1), (1.7, 10.0), (2.0, 13.2)]
NOISE_PICO_POR_STRENGTH = 0.33      # strength 1 -> varia entre -0,33 e +0,33 (blend REPLACE)
NOISE_PERIODO_POR_SCALE = 0.65      # scale 30 -> ~19 quadros por oscilação (média medida)


def fcurve(idd, data_path, index=0):
    ad = idd.animation_data
    if not ad or not ad.action:
        return None
    cb = anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot)
    return cb.fcurves.find(data_path, index=index) if cb else None


def _set(obj, data_path, index, valor):
    alvo = obj.path_resolve(data_path)
    if hasattr(alvo, "__len__"):
        alvo[index] = valor
        return True
    if "." in data_path:
        base, attr = data_path.rsplit(".", 1)
        setattr(obj.path_resolve(base), attr, valor)
    else:
        setattr(obj, data_path, valor)
    return False


def _achar_chave(fc, quadro):
    for k in fc.keyframe_points:
        if abs(k.co.x - quadro) < 1e-4:
            return k
    raise ValueError(f"sem chave no quadro {quadro}")


def overshoot_para_back(pct):
    """Interpola a tabela medida. 3% -> ~0,9 ; 5% -> ~1,16 ; 8% -> ~1,55."""
    for (b0, p0), (b1, p1) in zip(_BACK, _BACK[1:]):
        if p0 <= pct <= p1:
            return b0 + (b1 - b0) * (pct - p0) / (p1 - p0)
    return _BACK[0][0] if pct < _BACK[0][1] else _BACK[-1][0]


def alca_assimetrica(fc, q0, q1, saida=0.10, chegada=0.70):
    """Bézier 'premium': sai rápido (alça de saída curta) e assenta longo (alça de chegada longa).
    saida/chegada = comprimento da alça em fração da duração. Alças planas (mesmo valor da chave)."""
    k0, k1 = _achar_chave(fc, q0), _achar_chave(fc, q1)
    d = q1 - q0
    k0.interpolation = 'BEZIER'
    k0.handle_right_type = 'FREE'
    k1.handle_left_type = 'FREE'
    k0.handle_right = (q0 + saida * d, k0.co.y)
    k1.handle_left = (q1 - chegada * d, k1.co.y)
    fc.update()


ESTILOS = {
    "linear": ("LINEAR", "AUTO"), "bezier": ("BEZIER", "AUTO"),
    "expo_out": ("EXPO", "EASE_OUT"), "expo_in_out": ("EXPO", "EASE_IN_OUT"),
    "quart_out": ("QUART", "EASE_OUT"), "quint_out": ("QUINT", "EASE_OUT"),
    "sine_in_out": ("SINE", "EASE_IN_OUT"), "pouso": ("BACK", "EASE_OUT"),
}


def mover(obj, data_path, index, q0, q1, v0, v1, estilo="premium", overshoot_pct=5.0):
    """Anima um canal de v0 (quadro q0) a v1 (quadro q1) com um estilo nomeado. Devolve a F-curve.
    A interpolação vale da chave até a próxima: por isso o estilo vai na chave inicial."""
    vetor = False
    for q, v in ((q0, v0), (q1, v1)):
        vetor = _set(obj, data_path, index, v)
        if vetor:
            obj.keyframe_insert(data_path, index=index, frame=q)
        else:
            obj.keyframe_insert(data_path, frame=q)
    fc = fcurve(obj, data_path, index if vetor else 0)
    k0 = _achar_chave(fc, q0)
    if estilo == "premium":
        alca_assimetrica(fc, q0, q1)
    else:
        k0.interpolation, k0.easing = ESTILOS[estilo]
        if estilo == "pouso":
            k0.back = overshoot_para_back(overshoot_pct)
    return fc


def tremor(obj, data_path, index, amp_pico, periodo_q=30.0, fase=1.0, rapido=None):
    """Câmera na mão: modificador NOISE. amp_pico na unidade do canal (rad para rotação, m para posição).
    periodo_q: quadros por oscilação (30 q a 30 fps = ~1 Hz). rapido=(amp, periodo) soma uma 2ª camada fina."""
    fc = fcurve(obj, data_path, index)
    if fc is None:
        obj.keyframe_insert(data_path, index=index, frame=bpy.context.scene.frame_start)
        fc = fcurve(obj, data_path, index)
    camadas = [(amp_pico, periodo_q)] + ([rapido] if rapido else [])
    mods = []
    for i, (a, p) in enumerate(camadas):
        m = fc.modifiers.new('NOISE')
        m.blend_type = 'REPLACE'   # REPLACE: ruído centrado no valor da curva. ADD desloca a média em +0,5 x strength
        m.strength = a / NOISE_PICO_POR_STRENGTH
        m.scale = p / NOISE_PERIODO_POR_SCALE
        m.phase = fase + 7.3 * index + 13.1 * i
        mods.append(m)
    return mods
