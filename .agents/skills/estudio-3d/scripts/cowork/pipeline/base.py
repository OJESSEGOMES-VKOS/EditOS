# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (cena_exemplo.py roda este modulo inteiro) | fonte: sondas p1 a p6 do capitulo 09 + docs.blender.org/api/current
"""Utilitarios do estudio para montar cenas por script no Blender 5.2.

Uso dentro de um script de cena:

    import sys, pathlib
    sys.path.insert(0, str(pathlib.Path(__file__).parent))
    import base as B

Tudo aqui usa metro como unidade interna (1 unidade Blender = 1 m) e so
mostra milimetros na interface. Isso mantem luz, fisica e profundidade de
campo corretas.
"""
import json
import math
import os
import sys
import time

import bpy
from bpy_extras import anim_utils

# ---------------------------------------------------------------------------
# Log simples (vai para o stdout, que o blender -b mostra no terminal)
# ---------------------------------------------------------------------------
_T0 = time.time()


def log(*partes):
    print(f"[estudio {time.time() - _T0:6.1f}s]", *partes, flush=True)


# ---------------------------------------------------------------------------
# Argumentos depois de "--"  (blender -b -P cena.py -- --plano 3)
# ---------------------------------------------------------------------------
def args_do_script(argv=None):
    """Devolve so os argumentos que vieram depois de '--'."""
    argv = sys.argv if argv is None else argv
    return argv[argv.index("--") + 1:] if "--" in argv else []


def parse_args(definicoes, argv=None):
    """definicoes: lista de (nome, tipo, padrao). Ex.: [("--plano", int, 0)]."""
    import argparse
    p = argparse.ArgumentParser()
    for nome, tipo, padrao in definicoes:
        if tipo is bool:
            p.add_argument(nome, action="store_true")
        else:
            p.add_argument(nome, type=tipo, default=padrao)
    return p.parse_args(args_do_script(argv))


# ---------------------------------------------------------------------------
# Tempo: tempos.json e a fonte unica de verdade
# ---------------------------------------------------------------------------
def carregar_tempos(caminho):
    with open(caminho, encoding="utf-8") as f:
        t = json.load(f)
    fps = t["fps"]
    # converte segundos em quadros (1-based) para cada plano e evento
    for p in t["planos"]:
        p["q_ini"] = seg_para_quadro(p["inicio_s"], fps)
        p["q_fim"] = seg_para_quadro(p["fim_s"], fps) - 1
    for e in t.get("eventos", []):
        e["q"] = seg_para_quadro(e["t_s"], fps)
    return t


def seg_para_quadro(seg, fps=30):
    return int(round(seg * fps)) + 1


# ---------------------------------------------------------------------------
# Cena
# ---------------------------------------------------------------------------
def limpar_cena():
    """Cena vazia de fabrica. Mantem a cena padrao (que ja nasce em AgX)."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for bloco in (bpy.data.meshes, bpy.data.materials, bpy.data.lights,
                  bpy.data.cameras, bpy.data.curves, bpy.data.actions):
        for item in list(bloco):
            if item.users == 0:
                bloco.remove(item)
    return bpy.context.scene


def unidades_mm(cena=None):
    """Interface em mm, escala interna em metro (scale_length = 1.0)."""
    cena = cena or bpy.context.scene
    u = cena.unit_settings
    u.system = "METRIC"
    u.scale_length = 1.0
    u.length_unit = "MILLIMETERS"
    return u


FORMATOS = {
    "9:16": (1080, 1920),
    "1:1": (1080, 1080),
    "4:5": (1080, 1350),
    "16:9": (1920, 1080),
}


def definir_formato(nome="9:16", escala_pct=100, fps=30, cena=None):
    cena = cena or bpy.context.scene
    r = cena.render
    r.resolution_x, r.resolution_y = FORMATOS[nome]
    r.resolution_percentage = escala_pct
    r.fps = fps          # o padrao de fabrica e 24: sempre declarar
    r.fps_base = 1.0
    r.pixel_aspect_x = r.pixel_aspect_y = 1.0
    return r


def cor_agx(look="AgX - Medium High Contrast", exposicao=0.0, gamma=1.0, cena=None):
    """Gestao de cor. Nunca Standard em filme final (lava a imagem)."""
    cena = cena or bpy.context.scene
    v = cena.view_settings
    v.view_transform = "AgX"
    v.look = look
    v.exposure = exposicao
    v.gamma = gamma
    cena.display_settings.display_device = "sRGB"
    return v


PRESETS = {
    # nivel: (motor, amostras, %resolucao)
    # rascunho: 25% na nuvem, 50% na RTX (passe escala_pct=50 ou troque aqui)
    "rascunho": ("BLENDER_EEVEE", 16, 25),
    "prova": ("BLENDER_EEVEE", 32, 50),
    "final_eevee": ("BLENDER_EEVEE", 64, 100),
    # final_cycles: presets do cap 07 secao 3.6 (1024, limiar 0,01, min 64, OIDN High)
    "final_cycles": ("CYCLES", 1024, 100),
}

# limiar de ruido e amostras minimas por nivel Cycles (cap 07 secao 3.6)
CYCLES_ADAPTATIVO = {"final_cycles": (0.01, 64)}


def preset_render(nivel="rascunho", cena=None, gpu=False):
    cena = cena or bpy.context.scene
    motor, amostras, pct = PRESETS[nivel]
    r = cena.render
    r.engine = motor
    r.resolution_percentage = pct
    if motor == "BLENDER_EEVEE":
        cena.eevee.taa_render_samples = amostras
    else:
        c = cena.cycles
        c.samples = amostras
        c.use_adaptive_sampling = True
        limiar, minimo = CYCLES_ADAPTATIVO.get(nivel, (0.02, 0))
        c.adaptive_threshold = limiar
        c.adaptive_min_samples = minimo
        c.use_denoising = True
        c.denoiser = "OPENIMAGEDENOISE"
        c.denoising_quality = "HIGH"
        c.device = "GPU" if gpu else "CPU"
        if gpu:
            ativar_optix()
    return r


def ativar_optix():
    """Liga OptiX na RTX. Em maquina sem GPU NVIDIA so registra e segue."""
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        prefs.compute_device_type = "OPTIX"
        prefs.get_devices()
        for d in prefs.devices:
            d.use = d.type in {"OPTIX", "CPU"}
        log("OptiX:", [d.name for d in prefs.devices if d.use])
    except Exception as e:  # nuvem sem GPU
        log("OptiX indisponivel:", e)


def saida_png(caminho, profundidade="8", rgba=False, cena=None):
    cena = cena or bpy.context.scene
    ims = cena.render.image_settings
    ims.media_type = "IMAGE"          # 5.x: media_type antes de file_format
    ims.file_format = "PNG"
    ims.color_mode = "RGBA" if rgba else "RGB"
    ims.color_depth = profundidade
    cena.render.filepath = caminho


def saida_exr(caminho, multicamada=False, cena=None):
    cena = cena or bpy.context.scene
    ims = cena.render.image_settings
    ims.media_type = "MULTI_LAYER_IMAGE" if multicamada else "IMAGE"
    if not multicamada:
        ims.file_format = "OPEN_EXR"
    ims.color_depth = "16"
    ims.exr_codec = "DWAA"
    cena.render.filepath = caminho


def saida_mp4(caminho, qualidade="HIGH", cena=None):
    """H.264 em MP4. No 5.x FFMPEG so existe com media_type='VIDEO'."""
    cena = cena or bpy.context.scene
    ims = cena.render.image_settings
    ims.media_type = "VIDEO"
    ff = cena.render.ffmpeg
    ff.format = "MPEG4"
    ff.codec = "H264"
    ff.constant_rate_factor = qualidade
    ff.ffmpeg_preset = "GOOD"
    cena.render.filepath = caminho


# ---------------------------------------------------------------------------
# Camera
# ---------------------------------------------------------------------------
def criar_camera(nome="Cam", lente_mm=50, local=(0, -1, 0.2), alvo=None,
                 sensor_mm=36, f_stop=None, foco_obj=None, ativa=True,
                 clip_start_m=0.01):
    """clip_start padrao 1 cm; 5 mm (0.005) so em macro abaixo de 13 cm."""
    cam_d = bpy.data.cameras.new(nome)
    cam_d.lens = lente_mm
    cam_d.sensor_fit = "AUTO"
    cam_d.sensor_width = sensor_mm
    cam_d.clip_start = clip_start_m
    cam_d.clip_end = 100
    if f_stop:
        cam_d.dof.use_dof = True
        cam_d.dof.aperture_fstop = f_stop
        if foco_obj:
            cam_d.dof.focus_object = foco_obj
    cam = bpy.data.objects.new(nome, cam_d)
    bpy.context.scene.collection.objects.link(cam)
    cam.location = local
    if alvo is not None:
        mirar(cam, alvo)
    if ativa:
        bpy.context.scene.camera = cam
    return cam


def mirar(obj, alvo):
    """Gira obj para olhar o ponto alvo (tupla) ou objeto. Sem constraint."""
    from mathutils import Vector
    p = Vector(alvo.location if hasattr(alvo, "location") else alvo)
    direcao = p - obj.location
    obj.rotation_euler = direcao.to_track_quat("-Z", "Y").to_euler()


# ---------------------------------------------------------------------------
# Animacao: keyframes com easing via channelbag (acoes em slots, 4.4+)
# ---------------------------------------------------------------------------
def fcurves_de(id_animado):
    """F-curves do slot ativo. action.fcurves nao existe mais no 5.x."""
    ad = id_animado.animation_data
    if not ad or not ad.action:
        return []
    cb = anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot)
    return cb.fcurves if cb else []


def chave(obj, data_path, quadro, valor=None, index=-1,
          interp="BEZIER", easing="AUTO", back=None, handle="AUTO_CLAMPED"):
    """Insere chave e ajusta interpolacao do ponto recem-criado.

    interp: CONSTANT, LINEAR, BEZIER, SINE, QUAD, CUBIC, QUART, QUINT,
            EXPO, CIRC, BACK, BOUNCE, ELASTIC
    easing: AUTO, EASE_IN, EASE_OUT, EASE_IN_OUT
    A interpolacao vale do ponto ATUAL ate o proximo.
    """
    if valor is not None:
        alvo = getattr(obj, data_path)
        if index >= 0:
            alvo[index] = valor
        elif hasattr(alvo, "__len__") and not isinstance(alvo, str):
            for i, v in enumerate(valor):
                alvo[i] = v
        else:
            setattr(obj, data_path, valor)
    obj.keyframe_insert(data_path, index=index, frame=quadro)
    for fc in fcurves_de(obj):
        if fc.data_path != data_path or (index >= 0 and fc.array_index != index):
            continue
        for k in fc.keyframe_points:
            if abs(k.co.x - quadro) < 0.01:
                k.interpolation = interp
                k.easing = easing
                if back is not None:
                    k.back = back
                k.handle_left_type = handle
                k.handle_right_type = handle
        fc.update()


def mover(obj, data_path, q_ini, q_fim, v_ini, v_fim, interp="EXPO",
          easing="EASE_OUT", back=None, index=-1):
    """Atalho: duas chaves com o easing no primeiro ponto."""
    chave(obj, data_path, q_ini, v_ini, index, interp, easing, back)
    chave(obj, data_path, q_fim, v_fim, index, "BEZIER", "AUTO")


def cascata(objs, data_path, q_ini, duracao, atraso, v_ini, v_fim,
            interp="BACK", easing="EASE_OUT", back=1.3, index=-1):
    """Mesmo movimento em varios objetos com atraso fixo (stagger).
    back 1.3 = ~6% de overshoot (tabela 6.1 do cap 04)."""
    for i, o in enumerate(objs):
        q0 = q_ini + i * atraso
        mover(o, data_path, q0, q0 + duracao, v_ini, v_fim, interp, easing, back, index)


def ruido(obj, data_path, index, forca=0.002, escala=20.0, fase=None):
    """F-curve modifier NOISE: micro vida em camera de mao ou flutuacao."""
    for fc in fcurves_de(obj):
        if fc.data_path == data_path and fc.array_index == index:
            m = fc.modifiers.new("NOISE")
            m.strength = forca
            m.scale = escala
            m.phase = fase if fase is not None else (hash(obj.name) % 100)
            return m


def loop(obj, data_path=None):
    """F-curve modifier CYCLES: repete a animacao (loops de fundo)."""
    for fc in fcurves_de(obj):
        if data_path is None or fc.data_path == data_path:
            fc.modifiers.new("CYCLES")


# ---------------------------------------------------------------------------
# Modelagem e acabamento
# ---------------------------------------------------------------------------
def aplicar_chanfro(obj, largura_m=0.0005, segmentos=3, angulo_graus=30,
                    endurecer=True):
    """Chanfro (bevel) por modificador. 0,5 mm e o minimo para pegar luz em
    objeto de mao; 1 a 2 mm para caixas de 10 cm."""
    m = obj.modifiers.new("Chanfro", "BEVEL")
    m.width = largura_m
    m.segments = segmentos
    m.limit_method = "ANGLE"
    m.angle_limit = math.radians(angulo_graus)
    m.harden_normals = endurecer
    m.miter_outer = "MITER_ARC"
    if obj.type == "MESH":
        for p in obj.data.polygons:
            p.use_smooth = True
    return m


def material_basico(nome, cor=(0.8, 0.8, 0.8, 1), aspereza=0.4, metal=0.0,
                    coat=0.0):
    mat = bpy.data.materials.new(nome)   # 5.x: ja nasce com node_tree
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = cor
    bsdf.inputs["Roughness"].default_value = aspereza
    bsdf.inputs["Metallic"].default_value = metal
    bsdf.inputs["Coat Weight"].default_value = coat
    return mat


def luz_area(nome, local, alvo, energia_w, tamanho_m=1.0, kelvin=None,
             grade_graus=None):
    d = bpy.data.lights.new(nome, "AREA")
    d.energy = energia_w
    d.size = tamanho_m
    if kelvin:
        d.use_temperature = True
        d.temperature = kelvin
    if grade_graus:
        d.spread = math.radians(grade_graus)
    o = bpy.data.objects.new(nome, d)
    bpy.context.scene.collection.objects.link(o)
    o.location = local
    mirar(o, alvo)
    return o


def mundo_cor(cor=(0.02, 0.02, 0.025), forca=1.0):
    w = bpy.context.scene.world or bpy.data.worlds.new("Mundo")
    bpy.context.scene.world = w
    bg = w.node_tree.nodes.get("Background")
    bg.inputs["Color"].default_value = (*cor, 1)
    bg.inputs["Strength"].default_value = forca
    return w


# ---------------------------------------------------------------------------
# Render e provas
# ---------------------------------------------------------------------------
def salvar_quadro(quadro, caminho, cena=None):
    cena = cena or bpy.context.scene
    cena.frame_set(quadro)
    saida_png(caminho, cena=cena)
    t = time.time()
    bpy.ops.render.render(write_still=True)
    log(f"quadro {quadro} -> {caminho} ({time.time() - t:.1f}s)")
    return caminho


def folha_contato(caminhos, saida, colunas=4, rotulos=None, largura_cel=360,
                  fundo=(18, 18, 20)):
    """Junta quadros numa grade com rotulo. Precisa de Pillow.
    O Python do Blender nao traz Pillow: rode este trecho com o Python do
    sistema (python3 -c 'import base; ...') ou instale Pillow no Blender."""
    from PIL import Image, ImageDraw
    imgs = [Image.open(c).convert("RGB") for c in caminhos]
    w0, h0 = imgs[0].size
    escala = largura_cel / w0
    cw, ch = largura_cel, int(h0 * escala)
    faixa = 28
    linhas = math.ceil(len(imgs) / colunas)
    folha = Image.new("RGB", (colunas * cw + (colunas + 1) * 8,
                              linhas * (ch + faixa) + (linhas + 1) * 8), fundo)
    d = ImageDraw.Draw(folha)
    for i, im in enumerate(imgs):
        c, l = i % colunas, i // colunas
        x = 8 + c * (cw + 8)
        y = 8 + l * (ch + faixa + 8)
        folha.paste(im.resize((cw, ch)), (x, y))
        txt = rotulos[i] if rotulos else os.path.basename(caminhos[i])
        d.text((x + 4, y + ch + 6), txt, fill=(230, 230, 230))
    folha.save(saida)
    return saida


def lado_a_lado(antes, depois, saida, rotulos=("ANTES", "DEPOIS")):
    from PIL import Image, ImageDraw
    a = Image.open(antes).convert("RGB")
    b = Image.open(depois).convert("RGB").resize(a.size)
    w, h = a.size
    f = Image.new("RGB", (w * 2 + 24, h + 36), (18, 18, 20))
    f.paste(a, (8, 8))
    f.paste(b, (w + 16, 8))
    d = ImageDraw.Draw(f)
    d.text((12, h + 14), rotulos[0], fill=(230, 230, 230))
    d.text((w + 20, h + 14), rotulos[1], fill=(230, 230, 230))
    f.save(saida)
    return saida
