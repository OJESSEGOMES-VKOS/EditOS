# Blender 5.2 | status: validado no bpy 5.2.2 da nuvem (sem GPU: enums de dispositivo/denoiser vêm só com CPU/OIDN; OptiX a testar na RTX 3050) | fonte: manual Cycles (sampling, light paths, performance, GPU) https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cycles/ ; sondas sonda_cam.py, sonda_passes.py
"""
Presets de render do estúdio para RTX 3050 Laptop (4 GB ou 6 GB de VRAM).

  aplicar(cena, motor='CYCLES'|'BLENDER_EEVEE', nivel='rascunho'|'revisao'|'final', vram_gb=4, gpu=True)
  ligar_gpu(tipo='OPTIX')                  liga OptiX (ou CUDA); na nuvem sem GPU só avisa e segue em CPU
  passes(cena, perfil='composicao')        liga passes de dados, luz, cryptomatte e AOV
  saida_png_seq(cena, pasta, nome)         PNG 16 bits RGBA, sequência numerada
  saida_exr_multicamada(cena, pasta, nome) EXR multicamada (DWAA) com todos os passes
  saida_mp4_blender(cena, caminho, kbps)   MP4 H.264 + AAC 48 kHz pelo FFmpeg interno do Blender (5.x: media_type)
  estimar(seg_quadro, duracao_s, fps)      tempo total em horas
Uso: import presets as P; P.aplicar(bpy.context.scene, 'CYCLES', 'final', vram_gb=4)
"""
import bpy

# ------------------------------------------------------------------ tabelas
CYCLES = {
    #               amostras máx, limiar ruído, mín amostras, % res, denoise qualidade, prefiltro
    "rascunho": dict(samples=128, threshold=0.05, min_samples=0, pct=50, dq="FAST", pre="FAST",
                     max_b=8, diff=2, gloss=3, trans=8, transp=8, clamp_i=5.0, blur_glossy=1.0),
    "revisao":  dict(samples=384, threshold=0.03, min_samples=0, pct=50, dq="BALANCED", pre="ACCURATE",
                     max_b=12, diff=3, gloss=4, trans=10, transp=8, clamp_i=10.0, blur_glossy=1.0),
    "final":    dict(samples=1024, threshold=0.01, min_samples=64, pct=100, dq="HIGH", pre="ACCURATE",
                     max_b=16, diff=4, gloss=6, trans=12, transp=12, clamp_i=10.0, blur_glossy=0.5),
}
EEVEE = {
    #               amostras, ray tracing, resolução do RT (1 = cheia), raios/passos de sombra, % res, mb steps
    "rascunho": dict(samples=16, rt=False, rt_res="2", sh_rays=1, sh_steps=6, pct=50, mb_steps=1),
    "revisao":  dict(samples=32, rt=True, rt_res="2", sh_rays=1, sh_steps=6, pct=50, mb_steps=1),
    "final":    dict(samples=64, rt=True, rt_res="1", sh_rays=2, sh_steps=8, pct=100, mb_steps=4),
}


def ligar_gpu(tipo="OPTIX"):
    """Liga GPU nas preferências do Cycles. Retorna True se achou dispositivo do tipo pedido."""
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        prefs.compute_device_type = tipo
        prefs.get_devices()
        achou = False
        for d in prefs.devices:
            d.use = d.type == tipo            # só a GPU: CPU junto atrasa no notebook (CPU vira gargalo)
            achou = achou or d.type == tipo
        return achou
    except Exception as e:                    # nuvem sem GPU: enum vazio -> TypeError
        print("[presets] GPU indisponível:", e)
        return False


def aplicar(cena=None, motor="CYCLES", nivel="revisao", vram_gb=4, gpu=True, motion_blur=True):
    cena = cena or bpy.context.scene
    r = cena.render
    r.engine = motor
    r.use_persistent_data = True              # anima mais rápido: BVH e texturas ficam na memória entre quadros
    r.use_motion_blur = motion_blur
    r.motion_blur_shutter = 0.5               # 180°: borrão de câmera de cinema
    r.motion_blur_position = "CENTER"
    r.fps, r.fps_base = 30, 1.0
    if motor == "CYCLES":
        p = CYCLES[nivel]
        c = cena.cycles
        tem_gpu = gpu and ligar_gpu("OPTIX")
        c.device = "GPU" if tem_gpu else "CPU"
        c.samples = p["samples"]
        c.use_adaptive_sampling = True
        c.adaptive_threshold = p["threshold"]
        c.adaptive_min_samples = p["min_samples"]
        c.use_denoising = True
        c.denoiser = "OPENIMAGEDENOISE"       # OIDN 2 roda na GPU NVIDIA; OPTIX só aparece com GPU presente
        c.denoising_input_passes = "RGB_ALBEDO_NORMAL"
        c.denoising_prefilter = p["pre"]
        c.denoising_quality = p["dq"]
        c.denoising_use_gpu = tem_gpu
        c.max_bounces = p["max_b"]
        c.diffuse_bounces = p["diff"]
        c.glossy_bounces = p["gloss"]
        c.transmission_bounces = p["trans"]   # vidro: 8 no mínimo, 12 para frasco com líquido
        c.transparent_max_bounces = p["transp"]
        c.volume_bounces = 0
        c.sample_clamp_direct = 0.0
        c.sample_clamp_indirect = p["clamp_i"]
        c.blur_glossy = p["blur_glossy"]
        c.caustics_reflective = False         # cáustica liga só no plano que mostra a luz através do vidro
        c.caustics_refractive = False
        c.use_light_tree = True
        # memória: 4 GB -> limite 2048 px; 6 GB -> 4096 px (o rascunho sempre 1024)
        lim = "1024" if nivel == "rascunho" else ("2048" if vram_gb <= 4 else "4096")
        c.texture_limit_render = lim if nivel != "final" or vram_gb <= 4 else "OFF"
    else:
        p = EEVEE[nivel]
        e = cena.eevee
        e.taa_render_samples = p["samples"]
        e.use_raytracing = p["rt"]
        e.ray_tracing_method = "SCREEN"
        e.ray_tracing_options.resolution_scale = p["rt_res"]
        e.shadow_ray_count = p["sh_rays"]
        e.shadow_step_count = p["sh_steps"]
        e.use_fast_gi = True
        e.motion_blur_steps = p["mb_steps"]
        e.use_overscan = nivel == "final"     # evita borda escura de reflexo/AO na margem
        e.overscan_size = 0.03
    r.resolution_percentage = p["pct"]
    return p


def passes(cena=None, perfil="composicao"):
    """composicao: Z, normal, vetor, mist, luz difusa/brilho direto, emissão, AO, cryptomatte obj+mat, dados de denoise.
    minimo: só cryptomatte de objeto e Z."""
    cena = cena or bpy.context.scene
    vl = cena.view_layers[0]
    vl.use_pass_z = True
    vl.use_pass_cryptomatte_object = True
    if perfil == "composicao":
        for k in ("use_pass_normal", "use_pass_vector", "use_pass_mist", "use_pass_diffuse_direct",
                  "use_pass_glossy_direct", "use_pass_emit", "use_pass_ambient_occlusion",
                  "use_pass_cryptomatte_material"):
            setattr(vl, k, True)
        vl.pass_cryptomatte_depth = 6
        if cena.render.engine == "CYCLES":
            vl.cycles.denoising_store_passes = True
    return vl


def aov(cena, nome, tipo="VALUE"):
    a = cena.view_layers[0].aovs.add()
    a.name, a.type = nome, tipo
    return a


def saida_png_seq(cena, pasta, nome="q"):
    ims = cena.render.image_settings
    ims.media_type = "IMAGE"                  # 5.x: escolher o tipo de mídia antes do formato
    ims.file_format = "PNG"
    ims.color_mode = "RGBA"
    ims.color_depth = "16"
    ims.compression = 15
    cena.render.filepath = f"{pasta.rstrip('/')}/{nome}_####"
    cena.render.use_overwrite = False         # retomar render que caiu sem refazer quadros prontos
    cena.render.use_placeholder = True        # duas máquinas podem dividir a mesma pasta
    return ims


def saida_exr_multicamada(cena, pasta, nome="q"):
    ims = cena.render.image_settings
    ims.media_type = "MULTI_LAYER_IMAGE"
    ims.color_depth = "16"                    # meia precisão: suficiente para cor; use 32 para Z/posição exatos
    ims.exr_codec = "DWAA"
    cena.render.filepath = f"{pasta.rstrip('/')}/{nome}_####"
    return ims


def saida_mp4_blender(cena, caminho, kbps=16000, audio=True):
    """H.264 High pelo FFmpeg interno. Para entrega final prefira PNG + ffmpeg externo (cap. 07)."""
    r = cena.render
    ims = r.image_settings
    ims.media_type = "VIDEO"
    ff = r.ffmpeg
    ff.format = "MPEG4"
    ff.codec = "H264"
    ff.constant_rate_factor = "NONE"          # NONE = modo por bitrate
    ff.video_bitrate = kbps
    ff.maxrate = int(kbps * 1.5)
    ff.buffersize = int(kbps * 2)
    ff.gopsize = int(r.fps / 2)               # YouTube: GOP de metade do fps
    ff.use_max_b_frames = True
    ff.max_b_frames = 2
    ff.ffmpeg_preset = "GOOD"
    if audio:
        ff.audio_codec = "AAC"
        ff.audio_mixrate = 48000
        ff.audio_bitrate = 320
        ff.audio_channels = "STEREO"
    r.filepath = caminho
    return ff


def estimar(seg_quadro, duracao_s, fps=30, abertura_s=30):
    """Horas totais = (quadros x s/quadro + abertura) / 3600. abertura = compilar shaders, BVH, carregar texturas."""
    q = int(round(duracao_s * fps))
    return (q * seg_quadro + abertura_s) / 3600.0


if __name__ == "__main__":
    cena = bpy.context.scene
    for motor in ("CYCLES", "BLENDER_EEVEE"):
        for nivel in ("rascunho", "revisao", "final"):
            aplicar(cena, motor, nivel, vram_gb=4)
            if motor == "CYCLES":
                c = cena.cycles
                print(motor, nivel, c.device, c.samples, round(c.adaptive_threshold, 3), c.denoiser,
                      c.transmission_bounces, c.texture_limit_render, cena.render.resolution_percentage)
            else:
                e = cena.eevee
                print(motor, nivel, e.taa_render_samples, e.use_raytracing, e.ray_tracing_options.resolution_scale,
                      e.shadow_ray_count, e.motion_blur_steps, cena.render.resolution_percentage)
    passes(cena); aov(cena, "mascara_tela")
    saida_png_seq(cena, "/tmp/r", "p1"); print("png", cena.render.image_settings.file_format, cena.render.filepath)
    saida_exr_multicamada(cena, "/tmp/r", "p1"); print("exr", cena.render.image_settings.file_format)
    saida_mp4_blender(cena, "/tmp/r/peca_"); print("mp4", cena.render.image_settings.file_format, cena.render.ffmpeg.codec,
                                                   cena.render.ffmpeg.video_bitrate, cena.render.ffmpeg.audio_codec)
    print("estimativa 15 s a 7 s/quadro:", round(estimar(7, 15), 2), "h")
