"""Núcleo: cena nova, formato, cor (AgX), motor e qualidade de render, cores em hex.

Regras que moram aqui (e por quê):
- AgX sempre. 'Standard' estoura brancos e lava cinzas: foi a causa nº 1 do "sem vida".
- Look padrão 'AgX - Medium High Contrast' (comercial pede contraste). 'AgX - Punchy' para pop.
- Cor de superfície nunca é preto nem branco absoluto (albedo real fica entre ~0,02 e ~0,85).
"""
import math

import bpy

from . import aviso

FORMATOS = {
    '9:16': (1080, 1920),
    '4:5': (1080, 1350),
    '1:1': (1080, 1080),
    '16:9': (1920, 1080),
    '21:9': (2560, 1080),
}

# amostras por qualidade. 'rascunho' é pra conferir composição; 'revisao' pra julgar luz e
# material; 'final' pra entregar.
QUALIDADE = {
    'eevee': {'rascunho': 16, 'revisao': 64, 'final': 128},
    'cycles': {'rascunho': 24, 'revisao': 96, 'final': 256},  # final medido: 256 = 1024 a olho, 4x mais rápido
}


def _set(obj, attr, val):
    try:
        setattr(obj, attr, val)
        return True
    except Exception as e:  # noqa: BLE001
        aviso(f'{type(obj).__name__}.{attr} = {val!r} falhou: {e}')
        return False


# ---------------------------------------------------------------- cor
def hex_lin(h, seguro=True):
    """'#RRGGBB' -> RGBA linear. seguro=True prende o albedo entre 0,02 e 0,85 (realismo)."""
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    c = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    if seguro:
        c = [min(0.85, max(0.02, x)) for x in c]
    return (c[0], c[1], c[2], 1.0)


def hex_emissao(h):
    """cor para luz e emissão: sem trava de albedo."""
    return hex_lin(h, seguro=False)


def cor(sc=None, look='AgX - Medium High Contrast', exposicao=0.0, gama=1.0):
    sc = sc or bpy.context.scene
    sc.view_settings.view_transform = 'AgX'
    _set(sc.view_settings, 'look', look)
    sc.view_settings.exposure = exposicao
    sc.view_settings.gamma = gama
    sc.display_settings.display_device = 'sRGB'


# ---------------------------------------------------------------- motor
def gpu():
    """liga OptiX (ou CUDA) em todas as placas. Devolve o tipo ligado ou None."""
    try:
        prefs = bpy.context.preferences.addons['cycles'].preferences
    except KeyError:
        return None
    for tipo in ('OPTIX', 'CUDA', 'HIP', 'METAL', 'ONEAPI'):
        try:
            prefs.compute_device_type = tipo
            prefs.get_devices()
            achou = False
            for d in prefs.devices:
                d.use = d.type == tipo
                achou |= d.use
            if achou:
                return tipo
        except Exception:  # noqa: BLE001
            continue
    return None


def motor(sc=None, nome='eevee', qualidade='revisao', motion_blur=True, obturador=0.5):
    """nome: 'eevee' ou 'cycles'. obturador 0,5 = 180°, o padrão de cinema."""
    sc = sc or bpy.context.scene
    amostras = QUALIDADE[nome][qualidade]
    if nome == 'cycles':
        sc.render.engine = 'CYCLES'
        tipo = gpu()
        cy = sc.cycles
        cy.device = 'GPU' if tipo else 'CPU'
        cy.samples = amostras
        cy.use_adaptive_sampling = True
        cy.adaptive_threshold = {'rascunho': 0.05, 'revisao': 0.02, 'final': 0.03}[qualidade]
        cy.use_denoising = True
        _set(cy, 'denoiser', 'OPTIX' if (tipo == 'OPTIX' and qualidade != 'final') else 'OPENIMAGEDENOISE')
        _set(cy, 'denoising_use_gpu', bool(tipo))
        # caminhos de luz: o suficiente pra vidro e líquido, sem cáusticas (ruído caro)
        cy.max_bounces = 12
        cy.diffuse_bounces = 3
        cy.glossy_bounces = 4
        cy.transmission_bounces = 12
        cy.volume_bounces = 1
        cy.transparent_max_bounces = 16
        cy.caustics_reflective = False
        cy.caustics_refractive = False
        cy.blur_glossy = 1.0
        # persistent data + motion blur entre quadros de uma mesma sessão gera riscos horizontais
        # (bug visto no 5.2.2, 2026-10-03): fica desligado.
        _set(sc.render, 'use_persistent_data', False)
    else:
        sc.render.engine = 'BLENDER_EEVEE'
        ee = sc.eevee
        ee.taa_render_samples = amostras
        _set(ee, 'use_raytracing', True)
        _set(ee, 'use_shadows', True)
        _set(ee, 'shadow_ray_count', 2 if qualidade != 'rascunho' else 1)
        _set(ee, 'shadow_step_count', 8)
        _set(ee, 'use_fast_gi', True)
        _set(ee, 'fast_gi_method', 'GLOBAL_ILLUMINATION')
        _set(ee, 'use_volumetric_shadows', True)
        _set(ee, 'volumetric_tile_size', '4' if qualidade == 'final' else '8')
    sc.render.use_motion_blur = motion_blur
    sc.render.motion_blur_shutter = obturador
    sc.render.film_transparent = False


# ---------------------------------------------------------------- cena
def cena_nova(formato='9:16', fps=30, segundos=6.0, motor_nome='eevee', qualidade='revisao',
              look='AgX - Medium High Contrast', exposicao=0.0, escala=100, limpar=True):
    if limpar:
        bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    w, h = FORMATOS[formato]
    sc.render.resolution_x, sc.render.resolution_y = w, h
    sc.render.resolution_percentage = escala
    sc.render.fps = fps
    sc.frame_start = 1
    sc.frame_end = max(1, round(segundos * fps))
    sc.unit_settings.system = 'METRIC'
    sc.unit_settings.scale_length = 1.0
    cor(sc, look, exposicao)
    motor(sc, motor_nome, qualidade)
    if sc.world is None:
        sc.world = bpy.data.worlds.new('Mundo')
    sc.world.color = (0.02, 0.02, 0.022)
    return sc


def quadro(t, sc=None):
    """segundos -> número do quadro (o quadro 1 é t=0)."""
    sc = sc or bpy.context.scene
    return 1 + round(t * sc.render.fps)


def tempo(f, sc=None):
    sc = sc or bpy.context.scene
    return (f - 1) / sc.render.fps


def colecao(nome, pai=None):
    c = bpy.data.collections.get(nome) or bpy.data.collections.new(nome)
    pai = pai or bpy.context.scene.collection
    if c.name not in pai.children:
        pai.children.link(c)
    return c


def ligar(o, col=None, pai=None):
    (col or bpy.context.scene.collection).objects.link(o)
    if pai is not None:
        o.parent = pai
    return o


def vazio(nome, loc=(0, 0, 0), pai=None, tamanho=0.05):
    o = bpy.data.objects.new(nome, None)
    o.empty_display_size = tamanho
    ligar(o, pai=pai)
    o.location = loc
    return o


def mira(o, alvo):
    """aponta um objeto (câmera, luz) para um ponto, sem restrição."""
    from mathutils import Vector
    d = Vector(alvo) - o.location
    o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()


def salvar(caminho):
    bpy.ops.wm.save_as_mainfile(filepath=str(caminho))


def graus(*a):
    return tuple(math.radians(x) for x in a)
