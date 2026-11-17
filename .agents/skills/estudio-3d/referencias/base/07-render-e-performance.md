# 07 · Render e performance (qualidade final sem derreter o notebook)

> Alvo: Blender 5.2 (sondas no bpy 5.2.2 LTS da nuvem, Cycles CPU e EEVEE; tempos da RTX 3050 Laptop vêm do Laboratório do Claude Code). Código em `/home/claude/codigo/render/`. Prova em `/home/claude/provas/render_amostras.png`.

Render é onde o filme bom vira arquivo entregue ou vira madrugada perdida. A máquina de referência é um notebook com RTX 3050 Laptop: boa para EEVEE e para Cycles com OptiX, mas com pouca memória de vídeo. Este capítulo diz qual motor usar em cada caso, quais números colocar em cada campo, quanto tempo cada escolha custa e como transformar a sequência de imagens no arquivo exato que Instagram, TikTok e YouTube esperam.

Regra de ouro do estúdio: **renderize sequência de imagens (PNG 16 bits ou EXR), nunca vídeo direto**, e monte o MP4 no fim com o `ffmpeg`. Se o render cair no quadro 431, você recomeça do 431 (capítulo 09, seção 4.10).

---

## 1. Resumo em uma tela

| Decisão | Padrão do estúdio | Por quê | Sinal de erro |
|---|---|---|---|
| Motor | EEVEE para UI, logo, superfícies opacas, mundos pop e argila; Cycles para vidro, líquido, perfume, joia e cromo | O EEVEE modela só um evento de refração e reflexo de tela; o Cycles traça a luz de verdade | Frasco de vidro no EEVEE com interior preto ou líquido sem cor |
| Dispositivo | GPU com OptiX | Usa os núcleos de ray tracing da RTX | Render na CPU do notebook (5 a 10× mais lento) |
| Amostras Cycles | adaptativa: máximo 1024, limiar 0,01 no final | O limiar decide a qualidade; o máximo só é teto | Limiar 0,1 no final: ruído que o denoise vira "cera" |
| Denoise | OIDN com albedo + normal, na GPU, qualidade alta | Melhor detalhe; o manual diz que o OIDN "costuma dar qualidade superior" | 16 amostras + denoise: líquido e textura viram borrão liso |
| Vidro | transmissão 12, brilho 6, cáustica desligada | Vidro com líquido atravessa 4 a 8 superfícies | Interior do frasco preto (transmissão baixa) |
| Memória (4 GB) | texturas no máximo 2048 px no final; `use_persistent_data` | 4K ocupa 64 MB por textura, 8K 256 MB | "Out of memory" ou render 3× mais lento (memória do sistema) |
| Saída | PNG 16 bits RGBA em sequência; EXR multicamada quando há composição | Retomar sem perder; cor sem banding | MP4 direto do Blender que corrompe no quadro 400 |
| Entrega | H.264 High, yuv420p, BT.709 marcado, AAC 48 kHz, `+faststart` | É o que as plataformas pedem e recodificam melhor | Laranja da marca mudando de tom no celular (matriz de cor errada) |

---

## 2. Cycles ou EEVEE no 5.x

### 2.1 O que mudou

No Blender 5.x os nomes de motor são `BLENDER_EEVEE`, `CYCLES` e `BLENDER_WORKBENCH`. `BLENDER_EEVEE_NEXT` não existe mais **[confirmado por sonda no bpy 5.2.2]** (capítulo 09). O EEVEE atual é o motor reescrito que estreou no 4.2 ("EEVEE Next"): ray tracing em espaço de tela e por sondas, sombras virtuais, iluminação global rápida, volumes melhores e motion blur por acumulação.

### 2.2 O que o EEVEE novo faz bem

- **Velocidade.** No Laboratório, 0,37 s por quadro a 540x960 e cerca de 3 s a 1080x1920 com 16 amostras na RTX 3050. É 10 a 20× mais rápido que o Cycles com vidro.
- **Superfícies opacas e brilhantes**: plástico, metal escovado, cerâmica, papel, tecido, argila. Com ray tracing ligado (`use_raytracing`), os reflexos de objetos visíveis no quadro ficam corretos.
- **UI de app e telas emissivas**: emissão, camadas de vidro fino (uma refração), blur de fundo.
- **Motion blur e profundidade de campo** de qualidade de filme com amostras suficientes (capítulo 04, seção 9: o borrão do EEVEE mediu 19 px contra 20 px do Cycles no mesmo movimento).
- **Light linking** desde o 4.3 (capítulo 05).

### 2.3 Onde o EEVEE falha (limites do manual)

O manual do 5.x lista ([EEVEE Limitations](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/eevee/limitations/limitations.rst)):

| Limite | Número | Efeito em produto |
|---|---|---|
| Refração | "só um evento de refração é modelado corretamente" | Frasco com líquido (vidro → líquido → vidro) sai errado; copo com gelo, pior |
| Volumes | só espalhamento simples | Fumaça e névoa sem a luz "rica" do Cycles |
| Precisão | cálculos em meia precisão (16 bits), exceto a árvore de nós do shader | Banding em degradês muito suaves **[testar no Blender]** |
| Sondas de luz esféricas | até 128 ativas | Sem problema em produto |
| Sondas planas (reflexo de chão) | até 16 no enquadramento | Sem problema em produto |
| Atributos de Geometry Nodes no material | até 14 | Raro em produto |
| Shader AOV | até 16 de cor e 16 de valor ([Passes](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/layers/passes.rst)) | Suficiente |

E, pela natureza do ray tracing em espaço de tela: **o que está fora do quadro não aparece no reflexo**, a não ser pelas sondas. Cromo e vidro que precisam refletir o estúdio ao redor (softboxes atrás da câmera) mostram reflexo genérico. O Cycles não tem esse problema.

### 2.4 Tabela de decisão

| Produto ou mundo (capítulo 02) | Motor | Por quê |
|---|---|---|
| App, SaaS, dashboard, UI explodida | EEVEE | Emissão e camadas finas; velocidade para muitas iterações |
| Logo e vinheta (sem vidro) | EEVEE | Superfície opaca, metal, texto 3D |
| Eletrônico (celular, fone) de frente | EEVEE com ray tracing | Corpo opaco; a tela é emissão |
| Eletrônico com lente de câmera em close | Cycles | Vidro em camadas na lente |
| Perfume, bebida em garrafa, cosmético em vidro | **Cycles** | Várias refrações, líquido, cáustica |
| Joia, cromo, "vidro e cromo" | **Cycles** | Reflexos de fora do quadro |
| Comida | Cycles se houver subsuperfície forte (queijo, fruta); EEVEE para embalagem | SSS e brilho úmido |
| Moda, calçado, tecido | EEVEE com prova em Cycles | Tecido opaco; conferir sheen no Cycles |
| Mundos "pop candy", "argila", "luz natural" | EEVEE | Superfícies opacas e foscas |
| Mundos "luxo escuro", "vidro e cromo", "neon noturno" | Cycles nos planos de herói | Reflexo e contorno são o produto |
| Névoa com feixe de luz | EEVEE (prova) e Cycles (final) | Capítulo 05, seção 9 |

**Filme híbrido** (o mais comum): planos de UI, texto e logo em EEVEE; plano de herói com vidro em Cycles. Use o mesmo AgX e o mesmo look nos dois e confira a cor lado a lado (capítulo 08). Sinal de erro: o produto muda de brilho no corte entre motores. Iguale com `view_settings.exposure` por plano, nunca com a energia das luzes (que mudaria a direção da luz entre os planos).

---

## 3. Presets para RTX 3050 Laptop

### 3.1 A placa

A RTX 3050 Laptop existe em versões de **4 GB** (a mais comum) e **6 GB** de VRAM **[não verificado: confira no Gerenciador de Tarefas ou `nvidia-smi` qual é a do dono]**. É arquitetura Ampere, com núcleos de ray tracing.

Requisitos do manual para OptiX: GPU NVIDIA com compute capability 5.0 ou mais e driver **575 ou mais novo**; o denoise acelerado pede compute capability 7.0, que cobre todas as RTX ([manual, GPU Rendering](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cycles/gpu_rendering.rst)). O OptiX usa o hardware de ray tracing das RTX e é a escolha padrão.

Quando a memória da GPU enche, o manual diz que o Cycles com CUDA ou OptiX "tenta usar automaticamente a memória do sistema". Fica mais lento, mas costuma ser mais rápido que CPU. Quando nem isso basta, aparece "Out of memory".

### 3.2 Orçamento de memória

Do manual ([GPU Rendering](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cycles/gpu_rendering.rst)): texturas de 8K, 4K, 2K e 1K ocupam 256 MB, 64 MB, 16 MB e 4 MB. Esses números são de textura 8 bits RGBA; HDRI e texturas em ponto flutuante ocupam 4× mais (uma HDRI 4K float: cerca de 256 MB) **[não verificado: o manual cita só os números de 8 bits]**.

Conta para 4 GB:

| Item | Memória aproximada |
|---|---|
| Sistema, driver e janela do Blender (se a tela do notebook estiver ligada na NVIDIA) | 0,5 a 1 GB |
| Buffers do render 1080x1920 com passes (Cycles) | 0,2 a 0,5 GB **[testar no Blender]** |
| Denoise OIDN na GPU | 0,3 a 0,8 GB **[testar no Blender]** |
| Sobra para cena e texturas | **cerca de 2 GB** |

Ou seja: em 4 GB cabem cerca de **30 texturas 4K** ou **120 texturas 2K**. Um produto PBR completo (cor, aspereza, normal, metal) em 4K são 4 texturas (256 MB). Três produtos assim mais uma HDRI 4K float já passam de 1 GB.

Ferramentas, em ordem de uso:

1. **Limite de textura no render**: `scene.cycles.texture_limit_render` (enum `OFF, 128, 256, 512, 1024, 2048, 4096, 8192`, padrão `OFF`) **[confirmado por sonda no bpy 5.2.2]**. O estúdio usa 2048 em 4 GB e `OFF` (ou 4096) em 6 GB. Em produto ocupando 60% de um quadro 1080x1920, uma textura de 2048 no rótulo já tem mais pixels que a tela.
2. **Cache de textura do 5.2**: `render.use_texture_cache` (padrão ligado) e `render.use_auto_generate_texture_cache` (padrão desligado) **[confirmado por sonda no bpy 5.2.2]**. O manual descreve que o cache guarda as imagens em formato `.tx` para reduzir memória, com opção de gerar automaticamente no render ([manual, Performance](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cycles/render_settings/performance.rst)). **[testar no Blender]** o ganho real na RTX 3050 com texturas 4K.
3. **Tile**: tamanho padrão de 2048 px, que "dá um bom equilíbrio"; baixe para 1024 ou 512 se faltar memória ([manual, Performance](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cycles/render_settings/performance.rst)). Propriedades: `cycles.use_auto_tile`, `cycles.tile_size`.
4. **Simplify**: `render.use_simplify` e `simplify_subdivision_render` para cortar subdivisão em planos abertos.
5. **Tela do notebook na GPU integrada**: no Windows, rode o Blender com a NVIDIA para render, mas a interface pode ficar na integrada (painel de controle NVIDIA ou configurações de gráficos do Windows) **[não verificado: depende do notebook]**.

Sinal de erro de memória: o tempo por quadro triplica de repente sem mudança de cena (foi para a memória do sistema), ou o log mostra "Out of memory" / "System is out of GPU memory".

### 3.3 Amostragem adaptativa e denoise no 5.2

Padrões de fábrica do Cycles no 5.2.2 **[confirmado por sonda no bpy 5.2.2]**: `samples = 4096`, `use_adaptive_sampling = True`, `adaptive_threshold = 0.01`, `adaptive_min_samples = 0`, `use_denoising = True`, `denoiser = 'OPENIMAGEDENOISE'`, `denoising_input_passes = 'RGB_ALBEDO_NORMAL'`, `denoising_prefilter = 'ACCURATE'`, `denoising_quality = 'HIGH'`.

Do manual ([Sampling](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cycles/render_settings/sampling.rst)):

- **Noise Threshold** (limiar de ruído): faixa de 0,1 a 0,001; valor menor dá mais qualidade e mais tempo. Zero deixa o Cycles calcular a partir do número de amostras. É esse número que decide a qualidade; as amostras máximas são só o teto.
- **Min Samples**: zero deixa o Cycles escolher pelo limiar.
- **Time Limit**: para o quadro quando passa do tempo, mesmo sem chegar nas amostras. Não conta o pré-processamento. Útil como trava de segurança em animação (`cycles.time_limit`).
- **Denoisers**: "Automatic" prefere GPU e prefere OIDN ao OptiX; **OpenImageDenoise** "costuma dar qualidade superior"; **OptiX** é o denoiser da NVIDIA.
- **Passes de entrada**: só cor, cor + albedo (mínimo recomendado para preservar detalhe), cor + albedo + normal.
- **OIDN**: prefiltro None, Fast ou Accurate (mais detalhe); qualidade High, Balanced ou Fast; **Use GPU** acelera muito, mas pede memória de GPU.
- **Path guiding**: só na CPU; bom em luz difícil (luz entrando por fresta); 128 a 256 amostras de treino costumam bastar. Não use no notebook (render na GPU).

**OIDN ou OptiX?** No estúdio:

| Uso | Denoiser | Por quê |
|---|---|---|
| Viewport (prévia interativa) | OptiX (ou Automatic) | Mais rápido, a qualidade importa menos |
| Rascunho e revisão | OIDN na GPU, qualidade Balanced, prefiltro Fast/Accurate | Rápido e fiel |
| Final | OIDN na GPU, qualidade High, prefiltro Accurate, albedo + normal | Melhor detalhe segundo o manual |
| Final com memória no limite (4 GB) | OIDN na CPU (`denoising_use_gpu = False`) | Libera VRAM; custa alguns segundos por quadro |

Na nuvem (sem GPU), o enum `denoiser` só aceita `OPENIMAGEDENOISE`; `'OPTIX'` dá `enum "OPTIX" not found in ('OPENIMAGEDENOISE')` **[confirmado por sonda no bpy 5.2.2]**. Script que roda nos dois lugares precisa usar OIDN ou tratar o erro.

### 3.4 Light paths: vidro, cáustica e clamp

Padrões do 5.2.2 **[confirmado por sonda no bpy 5.2.2]**: `max_bounces = 12`, `diffuse_bounces = 4`, `glossy_bounces = 4`, `transmission_bounces = 12`, `volume_bounces = 0`, `transparent_max_bounces = 8`, `sample_clamp_direct = 0`, `sample_clamp_indirect = 10`, `caustics_reflective = True`, `caustics_refractive = True`, `blur_glossy = 1.0`.

Do manual ([Light Paths](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cycles/render_settings/light_paths.rst)): o total de saltos deveria ser alto para melhor qualidade e baixo para velocidade; zero é só luz direta. O **clamp** limita a intensidade máxima de uma amostra: reduz ruído, mas tira fidelidade; o manual recomenda limitar o indireto separado do direto, porque o indireto gera mais vagalumes (fireflies). A **cáustica** pode ser desligada para reduzir ruído de caminhos difíceis. O **Filter Glossy** borra reflexos depois de saltos ásperos para tirar vagalumes de cáustica; "1,0 é um bom ponto de partida".

Valores do estúdio:

| Campo | Rascunho | Revisão | Final | Por quê |
|---|---|---|---|---|
| `max_bounces` | 8 | 12 | 16 | Teto geral |
| `diffuse_bounces` | 2 | 3 | 4 | Produto em estúdio escuro: o difuso indireto pesa pouco |
| `glossy_bounces` | 3 | 4 | 6 | Cromo refletindo cromo; tampa refletindo frasco |
| `transmission_bounces` | 8 | 10 | 12 | Frasco com líquido: ar, vidro, líquido, vidro, ar de cada lado. **Mínimo 8 para qualquer vidro.** 12 no final; 16 a 24 quando há vidro sobre vidro com líquido (frasco com tampa de vidro), com `max_bounces` igual ou maior (ver 00 · Padrões da casa) |
| `transparent_max_bounces` | 8 | 8 | 12 | Folhas com alfa, UI em camadas |
| `volume_bounces` | 0 | 0 | 0 (1 com névoa) | Capítulo 05 |
| `sample_clamp_direct` | 0 | 0 | 0 | Não corte luz direta: some brilho do contorno |
| `sample_clamp_indirect` | 5 | 10 | 10 | Mata vagalume de vidro e metal |
| `blur_glossy` | 1,0 | 1,0 | 0,5 | No final, menos borrão para manter o brilho nítido |
| Cáustica | desligada | desligada | desligada (ligue só no plano que mostra a luz através do vidro no chão) | Cáustica de vidro é cara e ruidosa |

Sinal de erro com transmissão baixa: o interior do frasco fica preto ou a parede de trás do vidro some. Sinal de erro com clamp indireto baixo demais (abaixo de 3): o vidro perde o brilho interno e fica "fosco".

### 3.5 Persistent data e quadro de teste

- `render.use_persistent_data = True`: o manual descreve que mantém os dados do render na memória para re-renders e animações mais rápidos, ao custo de memória extra ([Performance](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cycles/render_settings/performance.rst)). Ganho grande quando só a câmera se move (o BVH não é refeito). Em 4 GB, desligue se a cena estiver no limite. Padrão: desligado **[confirmado por sonda no bpy 5.2.2]**.
- **Quadro de teste a 50%**: toda decisão de luz, material e câmera é tomada a 50% (540x960). Foco e nitidez de textura são conferidos num recorte a 100% (`render.use_border` + `use_crop_to_border`), nunca no quadro inteiro.

### 3.6 Os três presets (Cycles e EEVEE)

Implementados em `/home/claude/codigo/render/presets.py` **[validado no bpy 5.2.2 da nuvem]**:

**Cycles (GPU OptiX, denoise OIDN):**

| Campo | Rascunho | Revisão | Final |
|---|---|---|---|
| Resolução | 25% na nuvem, 50% na RTX (540x960) | 50% | 100% (1080x1920) |
| Amostras máximas | 128 | 384 | 1024 |
| Limiar de ruído | 0,05 | 0,03 | 0,01 |
| Amostras mínimas | 0 (auto) | 0 (auto) | 64 |
| Denoise | OIDN, Fast, prefiltro Fast | OIDN, Balanced, Accurate | OIDN, High, Accurate, albedo + normal |
| Light paths | 8 / 2 / 3 / 8 | 12 / 3 / 4 / 10 | 16 / 4 / 6 / 12 |
| Clamp indireto | 5 | 10 | 10 |
| Limite de textura (4 GB) | 1024 | 2048 | 2048 (6 GB: OFF) |
| Persistent data | sim | sim | sim |
| Motion blur | 0,5 | 0,5 | 0,5 |

**EEVEE:**

| Campo | Rascunho | Revisão | Final |
|---|---|---|---|
| Resolução | 25% na nuvem, 50% na RTX | 50% | 100% |
| `taa_render_samples` | 16 | 32 | 64 (128 com desfoque forte) |
| `use_raytracing` | não | sim | sim |
| `ray_tracing_options.resolution_scale` | 2 | 2 | 1 (resolução cheia) |
| Sombras (`shadow_ray_count` / `shadow_step_count`) | 1 / 6 | 1 / 6 | 2 / 8 |
| `motion_blur_steps` | 1 | 1 | 4 (8 para giro rápido) |
| `use_overscan` | não | não | sim, 3% |

Enums do EEVEE confirmados no 5.2.2: `ray_tracing_method` em `PROBE, SCREEN`; `ray_tracing_options.resolution_scale` em `1, 2, 4, 8, 16`; `fast_gi_method` em `AMBIENT_OCCLUSION_ONLY, GLOBAL_ILLUMINATION`; `shadow_pool_size` de 16 a 2048 MB (padrão 512). Padrões: `taa_render_samples = 64`, `use_raytracing = False`, `shadow_ray_count = 1`, `shadow_step_count = 6`, `use_fast_gi = True`. Opções de ray tracing com padrão: `use_denoise`, `denoise_spatial`, `denoise_temporal`, `denoise_bilateral` (todos ligados), `trace_max_roughness = 0.5`, `screen_trace_quality = 0.25`, `screen_trace_thickness = 0.1`.

Do manual EEVEE ([Sampling](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/eevee/render_settings/sampling.rst)): mais raios de sombra reduzem o ruído da sombra; mais passos deixam a sombra mais suave e custam mais.

**Tempo estimado por quadro na RTX 3050 Laptop (9:16):**

| Preset | EEVEE | Cycles com vidro | Base |
|---|---|---|---|
| Rascunho (540x960) | ~0,37 s | ~3 s | EEVEE medido no Laboratório; Cycles estimado |
| Revisão (540x960) | ~0,5 s | ~7 s | Cycles medido no Laboratório (vidro a 540x960) |
| Final (1080x1920) | ~10 s | ~45 s | estimado: 4× pixels; EEVEE 16 amostras medido em ~3 s |

Os números de rascunho do Cycles e todos os finais são **estimativas** feitas com a regra de escala da seção 6 sobre os três tempos medidos no Laboratório. **[testar no Blender]** os seis na máquina de referência e substituir.

### 3.7 Código

```python
# Blender 5.2 | status: validado no bpy 5.2.2 da nuvem | /home/claude/codigo/render/presets.py (trecho)
def aplicar(cena=None, motor="CYCLES", nivel="revisao", vram_gb=4, gpu=True, motion_blur=True):
    cena = cena or bpy.context.scene
    r = cena.render
    r.engine = motor
    r.use_persistent_data = True
    r.use_motion_blur = motion_blur
    r.motion_blur_shutter = 0.5
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
        c.denoiser = "OPENIMAGEDENOISE"
        c.denoising_input_passes = "RGB_ALBEDO_NORMAL"
        c.denoising_prefilter = p["pre"]
        c.denoising_quality = p["dq"]
        c.denoising_use_gpu = tem_gpu
        c.transmission_bounces = p["trans"]
        # ... (demais campos no arquivo)
```

```python
def ligar_gpu(tipo="OPTIX"):
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        prefs.compute_device_type = tipo
        prefs.get_devices()
        achou = False
        for d in prefs.devices:
            d.use = d.type == tipo          # só a GPU; CPU junto atrasa no notebook
            achou = achou or d.type == tipo
        return achou
    except Exception as e:
        print("[presets] GPU indisponível:", e)
        return False
```

O que a validação na nuvem mostrou **[confirmado por sonda no bpy 5.2.2]**:

- Sem GPU, `compute_device_type = 'OPTIX'` é aceito sem erro, mas `get_devices()` só lista a CPU (`Intel Xeon Processor @ 2.10GHz`, tipo `CPU`). Por isso a função testa se achou um dispositivo do tipo pedido e cai para CPU sozinha.
- `cycles.device` aceita `CPU` e `GPU`. O enum de `compute_device_type` aparece vazio quando listado sem GPU: não use a lista de enum para descobrir se há GPU, use `prefs.devices`.
- Saída da validação: `CYCLES final CPU 1024 0.01 OPENIMAGEDENOISE 12 2048 100`; `BLENDER_EEVEE final 64 True 1 2 4 100`.

**Ligar CPU junto com a GPU?** No desktop com CPU forte, às vezes ajuda. No notebook, a CPU esquenta, divide o mesmo limite térmico e vira gargalo nos últimos tiles. O estúdio usa só a GPU **[testar no Blender]** os dois casos uma vez.

---

## 4. Passes de render

### 4.1 Para que servem

Passes são camadas separadas do render (profundidade, normais, luz difusa, brilho, máscaras) que deixam ajustar na composição sem renderizar de novo. No estúdio, servem para três coisas: máscara do produto (cryptomatte), profundidade para névoa e desfoque na pós (Z e mist) e controle fino de brilho e reflexo (passes de luz).

### 4.2 Nomes no 5.2

Propriedades na `view_layer` **[confirmado por sonda no bpy 5.2.2]**: `use_pass_combined`, `use_pass_z`, `use_pass_vector`, `use_pass_position`, `use_pass_normal`, `use_pass_uv`, `use_pass_mist`, `use_pass_object_index`, `use_pass_material_index`, `use_pass_shadow`, `use_pass_ambient_occlusion`, `use_pass_emit`, `use_pass_environment`, `use_pass_diffuse_direct/indirect/color`, `use_pass_glossy_direct/indirect/color`, `use_pass_transmission_direct/indirect/color`, `use_pass_subsurface_direct/indirect/color`, `use_pass_grease_pencil`, `use_pass_cryptomatte_object/material/asset`, `pass_cryptomatte_depth` (padrão 6), `use_pass_cryptomatte_accurate`, `aovs`.

Específicos do Cycles em `view_layer.cycles`: `use_pass_volume_direct/indirect`, `use_pass_shadow_catcher`, `denoising_store_passes`, `pass_debug_sample_count`, `pass_render_time`. Específicos do EEVEE em `view_layer.eevee`: `use_pass_volume_direct`, `use_pass_transparent`, `use_pass_bloom`.

Saídas do nó Render Layers com os passes ligados, como aparecem no compositor do 5.2.2 **[confirmado por sonda no bpy 5.2.2]**:

| Motor | Saídas |
|---|---|
| Cycles | `Image, Alpha, Depth, Mist, Normal, Vector, Diffuse Direct, Glossy Direct, Emission, Ambient Occlusion, CryptoObject00..02, CryptoMaterial00..02, Noisy Image, Denoising Albedo, Denoising Specular Albedo, Denoising Normal, Denoising Roughness, Denoising Depth, <AOV>` |
| EEVEE | `Image, Alpha, Depth, Mist, Normal, Vector, Diffuse Direct, Glossy Direct, Emission, Shadow, Ambient Occlusion, <AOV>, CryptoObject00..02, CryptoMaterial00..02` |

Notas:

- O passe `Shadow` só saiu no EEVEE; no Cycles a sombra separada vem pelo shadow catcher.
- Com `denoising_store_passes`, o Cycles entrega a imagem **sem** denoise (`Noisy Image`) e os dados de denoise. Serve para denoisar na composição ou para comparar.
- Profundidade de cryptomatte 6 = até 6 objetos sobrepostos por pixel (3 camadas `00..02` de 2 cada). Para vidro sobre líquido sobre fundo, 6 basta.
- O manual confirma: "UV" só existe no Cycles; EEVEE tem passe "Transparent" para superfícies com blend ([Passes](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/layers/passes.rst)).

### 4.3 AOV (passe próprio)

Um AOV é uma máscara que você define no material: por exemplo, "mascara_tela" com valor 1 só na tela do celular, para trocar a interface na pós.

```python
# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2
aov = cena.view_layers[0].aovs.add()
aov.name, aov.type = "mascara_tela", "VALUE"           # tipos: COLOR, VALUE
no = mat_tela.node_tree.nodes.new("ShaderNodeOutputAOV")
no.aov_name = "mascara_tela"                            # entradas do nó: Color, Value
no.inputs["Value"].default_value = 1.0
```

O AOV aparece como saída `mascara_tela` no Render Layers nos dois motores.

### 4.4 Perfis do estúdio

| Perfil | Passes | Quando |
|---|---|---|
| Nenhum | só `Image` | Filme sem composição (EEVEE, UI) |
| Mínimo | Z + CryptoObject | Ajuste de cor só no produto, névoa na pós |
| Composição | Z, normal, vetor, mist, difuso direto, brilho direto, emissão, AO, cryptomatte de objeto e material, dados de denoise, AOV da tela | Herói em Cycles com pós no compositor (capítulo 08) |

`presets.passes(cena, 'composicao')` liga o perfil completo. Passes custam memória e disco (um EXR multicamada de 1080x1920 com esse perfil passa de 50 MB por quadro **[testar no Blender]**): só ligue o que vai usar.

---

## 5. Saída: sequência, EXR e vídeo

### 5.1 Sequência PNG 16 bits

```python
# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 | presets.py
def saida_png_seq(cena, pasta, nome="q"):
    ims = cena.render.image_settings
    ims.media_type = "IMAGE"            # 5.x: tipo de mídia antes do formato
    ims.file_format = "PNG"
    ims.color_mode = "RGBA"
    ims.color_depth = "16"
    ims.compression = 15
    cena.render.filepath = f"{pasta.rstrip('/')}/{nome}_####"
    cena.render.use_overwrite = False   # retoma sem refazer quadros prontos
    cena.render.use_placeholder = True  # duas máquinas podem dividir a pasta
```

Por que 16 bits: degradês escuros de fundo (mundo "luxo escuro") em 8 bits mostram faixas (banding) depois da gradação de cor. Por que `use_overwrite = False` e `use_placeholder = True`: o render pode cair e recomeçar do primeiro quadro que falta; e duas máquinas renderizando a mesma pasta não repetem quadros **[testar no Blender]** o comportamento com placeholder no 5.2.

Compressão PNG 15% é rápida e o arquivo fica 20 a 30% maior que com 90%. Disco é mais barato que tempo.

### 5.2 EXR multicamada

```python
def saida_exr_multicamada(cena, pasta, nome="q"):
    ims = cena.render.image_settings
    ims.media_type = "MULTI_LAYER_IMAGE"   # file_format vira OPEN_EXR_MULTILAYER sozinho
    ims.color_depth = "16"                 # meia precisão para cor; 32 para Z e posição exatos
    ims.exr_codec = "DWAA"
    cena.render.filepath = f"{pasta.rstrip('/')}/{nome}_####"
```

Codecs EXR no 5.2.2 **[confirmado por sonda no bpy 5.2.2]**: `NONE, ZIP, PIZ, DWAA, DWAB, HTJ2K, ZIPS, RLE, PXR24, B44, B44A`. DWAA é com perda leve e arquivos pequenos (bom para beauty); ZIP ou PIZ sem perda (use para Z, vetor e cryptomatte se for compor com precisão). Quando misturar, o estúdio usa PIZ no EXR multicamada inteiro **[testar no Blender]** o tamanho.

Lembre: EXR é linear e sem o AgX aplicado da mesma forma que o PNG. O PNG sai já com AgX e look; o EXR precisa da mesma transformação na composição (capítulo 08).

### 5.3 Vídeo pelo FFmpeg do próprio Blender (5.x)

No 5.x, vídeo é um tipo de mídia: `image_settings.media_type = 'VIDEO'` muda `file_format` para `FFMPEG` sozinho (capítulo 09, seção 4.10). Testado no bpy 5.2.2 com o preset do estúdio: 15 quadros Workbench viraram `peca_0001-0015.mp4`, que o `ffprobe` leu como **H.264 High, yuv420p, 30/1, AAC LC 48 kHz** **[confirmado por sonda no bpy 5.2.2]**.

```python
def saida_mp4_blender(cena, caminho, kbps=16000, audio=True):
    r = cena.render
    r.image_settings.media_type = "VIDEO"
    ff = r.ffmpeg
    ff.format = "MPEG4"
    ff.codec = "H264"
    ff.constant_rate_factor = "NONE"     # NONE = controle por bitrate
    ff.video_bitrate = kbps
    ff.maxrate = int(kbps * 1.5)
    ff.buffersize = int(kbps * 2)
    ff.gopsize = int(r.fps / 2)          # YouTube: GOP de metade do fps
    ff.use_max_b_frames = True
    ff.max_b_frames = 2
    ff.ffmpeg_preset = "GOOD"
    if audio:
        ff.audio_codec = "AAC"
        ff.audio_mixrate = 48000
        ff.audio_bitrate = 320
        ff.audio_channels = "STEREO"
    r.filepath = caminho
```

Propriedades de `render.ffmpeg` no 5.2.2 com padrões **[confirmado por sonda no bpy 5.2.2]**: `format` (MPEG1), `codec` (NONE), `video_bitrate` (0), `minrate`, `maxrate`, `muxrate`, `gopsize` (0), `max_b_frames`, `use_max_b_frames`, `buffersize`, `packetsize`, `constant_rate_factor` (NONE), `custom_constant_rate_factor` (23), `ffmpeg_preset` (GOOD; opções `BEST, GOOD, REALTIME`), `ffmpeg_prores_profile`, `use_autosplit`, `use_lossless_output`, `audio_codec` (NONE; opções `AAC, AC3, FLAC, MP2, MP3, OPUS, PCM, VORBIS`), `audio_bitrate` (192), `audio_volume`, `audio_mixrate` (48000), `audio_channels` (STEREO).

Uso no estúdio: **só para prévia** (animatic, aprovação rápida). Para entrega, sequência PNG + `ffmpeg` externo, por três motivos: retomada de render, controle da matriz de cor (5.5) e os relatos de FFmpeg sumindo com `--factory-startup` no 5.0 (capítulo 09, pegadinha 30).

### 5.4 Especificações das plataformas

**YouTube (oficial,** [Configurações de codificação recomendadas](https://support.google.com/youtube/answer/1722171), consultado em 02/10/2026**):**

- Contêiner MP4.
- Áudio AAC-LC, Opus ou Eclipsa Audio, 48 kHz.
- Vídeo H.264, perfil High, varredura progressiva, **GOP fechado de metade do fps**, croma 4:2:0.
- Taxas de quadro: 24, 25, 30, 48, 50, 60 fps (envie no fps em que foi produzido).
- Bitrates recomendados para SDR:

| Resolução | 24 a 30 fps | 48 a 60 fps |
|---|---|---|
| 2160p (4K) | 35 a 45 Mbps | 53 a 68 Mbps |
| 1440p | 16 Mbps | 24 Mbps |
| 1080p | 8 Mbps | 12 Mbps |
| 720p | 5 Mbps | 7,5 Mbps |

Vertical: o player se adapta ao tamanho do vídeo; Shorts usam 9:16.

**TikTok (anúncios, oficial,** [Video ads specifications](https://ads.tiktok.com/help/article/video-ads-specifications)**):** proporção 9:16, 1:1 ou 16:9; resolução sem restrição (mínimo sugerido 720x1280, 640x640 ou 1280x720); `.mp4`, `.mov`, `.mpeg`, `.avi`; bitrate de **516 kbps ou mais**; até 500 MB. A página não detalha fps nem áudio.

**Instagram Reels:** a página de especificações da Meta recusou acesso automático nesta pesquisa. O que o estúdio usa, por prática corrente: 1080x1920, 9:16, H.264 High, 30 fps, yuv420p, AAC 48 kHz estéreo, MP4 com fast start, 8 a 16 Mbps **[não verificado na fonte oficial da Meta]**. A plataforma recodifica tudo: o objetivo é mandar um arquivo limpo, com bitrate alto e cor marcada, para a recodificação partir de algo bom.

**Zonas seguras de texto em 9:16** (interface da plataforma por cima): estão no capítulo 08, seção 6.4. Máscara universal do estúdio em 1080 x 1920: livre 380 px no topo, 672 px na base, 120 px à esquerda, 140 px à direita, e 300 px à direita abaixo de y 960 (gabarito TikTok). Área útil: x 120 a 940 (x 120 a 780 abaixo de y 960), y 380 a 1248. Centro óptico da área útil: y ≈ 814. [não verificado em fonte oficial do TikTok e do YouTube; revisar a cada trimestre] (ver 00 · Padrões da casa). Isso é decisão de composição, então vale na câmera (capítulo 04) e não só na pós.

### 5.5 A matriz de cor: o erro que muda o laranja da marca

O PNG sai do Blender em RGB sRGB. O H.264 guarda YUV. A conversão RGB para YUV usa uma matriz; vídeo HD usa BT.709. Se o `ffmpeg` converter com a matriz antiga (BT.601) e o arquivo for marcado como BT.709, o player decodifica com a matriz errada e as cores mudam.

Teste feito na nuvem (ffmpeg 6.1.1) com o laranja `#E0602A` (224, 96, 42), codificado e decodificado como BT.709:

| Conversão | RGB depois do vídeo | Desvio |
|---|---|---|
| Sem `out_color_matrix` (padrão do ffmpeg) | (233, 103, 35) | R +9, G +7, B −7 |
| Com `scale=out_color_matrix=bt709:out_range=tv` | (221, 94, 39) | R −3, G −2, B −3 (só arredondamento de 4:2:0) |

**[confirmado na nuvem com ffmpeg 6.1.1]**. Nove pontos no vermelho é a diferença entre o laranja da marca e "um laranja". Todos os comandos do estúdio levam `out_color_matrix=bt709` e as marcas `-color_primaries bt709 -color_trc bt709 -colorspace bt709`.

### 5.6 Comandos ffmpeg prontos (testados)

Script completo: `/home/claude/codigo/render/entrega_ffmpeg.sh <pasta_png> <prefixo> <trilha.wav> <saida_base> [9x16|16x9]`. Testado com uma sequência de 60 PNG 16 bits (540x960) e uma trilha de 48 kHz; o `ffprobe` conferiu cada saída **[testado na nuvem, ffmpeg 6.1.1]**.

**Redes (Reels, TikTok, Shorts) 1080x1920:**

```bash
ffmpeg -y -framerate 30 -i render/p_%04d.png -i trilha.wav \
  -map 0:v -map 1:a -shortest \
  -vf "scale=1080:1920:flags=lanczos:out_color_matrix=bt709:out_range=tv,format=yuv420p" \
  -c:v libx264 -profile:v high -level:v 4.2 -preset slow -crf 17 -maxrate 16M -bufsize 32M \
  -g 15 -keyint_min 15 -sc_threshold 0 -bf 2 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
  -c:a aac -b:a 320k -ar 48000 -ac 2 -movflags +faststart entrega_redes.mp4
```

`ffprobe`: `h264 High, 1080x1920, yuv420p, level 42, bt709/bt709/bt709, 30/1` e `aac LC 48000 Hz 2 canais`.

**YouTube 1080p30 (troque `scale` para 1920:1080 em 16:9):**

```bash
ffmpeg -y -framerate 30 -i render/p_%04d.png -i trilha.wav \
  -map 0:v -map 1:a -shortest \
  -vf "scale=1920:1080:flags=lanczos:out_color_matrix=bt709:out_range=tv,format=yuv420p" \
  -c:v libx264 -profile:v high -preset slow -b:v 16M -maxrate 20M -bufsize 32M \
  -g 15 -keyint_min 15 -sc_threshold 0 -bf 2 -flags +cgop \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
  -c:a aac -b:a 384k -ar 48000 -ac 2 -movflags +faststart entrega_youtube.mp4
```

**Mestre (ProRes 422 HQ, 10 bits, PCM 24 bits) para arquivo e reedição:**

```bash
ffmpeg -y -framerate 30 -i render/p_%04d.png -i trilha.wav -map 0:v -map 1:a -shortest \
  -vf "scale=1080:1920:flags=lanczos:out_color_matrix=bt709:out_range=tv,format=yuv422p10le" \
  -c:v prores_ks -profile:v 3 -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  -c:a pcm_s24le -ar 48000 entrega_mestre.mov
```

**Prévia para aprovação no WhatsApp (720x1280, teto 2,5 Mbps):**

```bash
ffmpeg -y -framerate 30 -i render/p_%04d.png -i trilha.wav -map 0:v -map 1:a -shortest \
  -vf "scale=720:1280:flags=lanczos:out_color_matrix=bt709:out_range=tv,format=yuv420p" \
  -c:v libx264 -profile:v high -preset medium -crf 23 -maxrate 2500k -bufsize 5M \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  -c:a aac -b:a 128k -ar 48000 -movflags +faststart previa.mp4
```

O que cada opção faz e por quê:

| Opção | Por quê |
|---|---|
| `-framerate 30` antes do `-i` | Define o fps da sequência. Sem isso, o ffmpeg assume 25 e o filme fica lento e fora de sincronia com o áudio |
| `-profile:v high` | Exigência do YouTube; aceito por todas as redes |
| `-level:v 4.2` | Teto compatível com 1080p até 60 fps em celulares |
| `-crf 17` | Qualidade quase sem perda visual; a escala vai de 0 a 51, menor é melhor ([ffmpeg codecs](https://ffmpeg.org/ffmpeg-codecs.html)) |
| `-maxrate` / `-bufsize` | Teto de bitrate: evita picos que algumas plataformas rejeitam |
| `-g 15 -keyint_min 15 -sc_threshold 0` | GOP fixo de metade do fps (YouTube pede); quadro-chave regular ajuda a recodificação |
| `-flags +cgop` | GOP fechado (YouTube pede) |
| `format=yuv420p` | Croma 4:2:0: é o que todo celular decodifica |
| `out_color_matrix=bt709` + marcas | Cor certa (5.5) |
| `-ar 48000` | 48 kHz é o padrão de vídeo (YouTube pede); 44,1 kHz é de música |
| `-b:a 320k` | O AAC do ffmpeg usa 128 kbps se você não disser nada ([ffmpeg codecs](https://ffmpeg.org/ffmpeg-codecs.html)): pouco para trilha com graves |
| `-movflags +faststart` | Índice no início do arquivo: começa a tocar antes de baixar tudo |
| `-shortest` | Corta no menor (vídeo ou áudio). Garanta que a trilha tem pelo menos a duração do vídeo |

Tempo: 60 quadros (2 s) com as quatro saídas levaram 19 s na nuvem (2 núcleos). Um filme de 30 s leva poucos minutos no notebook.

---

## 6. Estimativa de tempo

### 6.1 A fórmula

```
Tempo total = quadros × s_por_quadro + abertura

quadros       = duração (s) × fps
s_por_quadro  ≈ k × pixels × amostras_efetivas + denoise + sincronização
abertura      = compilar shaders (EEVEE), montar BVH, carregar texturas: 10 a 60 s na primeira vez
```

Com `use_persistent_data`, a sincronização entre quadros cai muito quando só a câmera se move.

**Regra de escala medida.** No teste de amostras (seção 7), com amostras fixas, o tempo cresceu quase linear: 16 → 64 → 256 amostras deram 2,8 → 10,2 → 40,1 s (cada 4× de amostras deu 3,6 a 3,9× de tempo). Daí:

- Dobrar a resolução linear (540x960 para 1080x1920) = 4× pixels = cerca de 4× tempo.
- Dobrar amostras efetivas = cerca de 2× tempo no Cycles.
- O denoise OIDN custou 0,6 a 1,4 s a 256x320 na CPU (82 mil pixels). Em 1080x1920 (2 milhões de pixels) na CPU isso vira 15 a 35 s por quadro **[estimado]**; na GPU, poucos segundos **[testar no Blender]**. Mais um motivo para `denoising_use_gpu = True` quando houver memória.

### 6.2 Exemplos para filmes de 15 s e 30 s (30 fps)

Com os tempos por quadro da tabela 3.6 e 30 s de abertura:

| Preset | s/quadro | 15 s (450 q) | 30 s (900 q) |
|---|---|---|---|
| EEVEE rascunho | 0,37 | 3 min | 6 min |
| EEVEE revisão | 0,5 | 4 min | 8 min |
| EEVEE final | ~10 | 1 h 15 | 2 h 30 |
| Cycles rascunho | ~3 | 23 min | 46 min |
| Cycles revisão | ~7 | 53 min | 1 h 46 |
| Cycles final | ~45 | 5 h 38 | 11 h 15 |

O que isso decide:

1. **Filme todo em Cycles final, 30 s, no notebook: uma noite inteira.** Por isso o filme híbrido (2.4): só os planos de vidro em Cycles. Um filme de 30 s com 8 s de vidro: 240 q × 45 s + 660 q × 10 s = 4 h 50, menos da metade.
2. **Iteração é EEVEE rascunho**: 3 a 6 min por versão completa. O loop visual do capítulo 09 roda com prova de 4 a 6 quadros, não com filme inteiro.
3. **Renderize os planos em ordem de risco**, não em ordem do filme: primeiro o plano de vidro (o mais caro e o que mais falha).
4. Notebook em render longo: na tomada, plano de energia de alto desempenho, base ventilada. Throttling térmico pode aumentar o tempo em 20 a 40% depois da primeira hora **[não verificado: depende do modelo; meça o tempo do quadro 1 e do quadro 400]**.

### 6.3 Renderizar em partes

Divida por plano ou por faixa de quadros (`-s` e `-e` antes de `-a`, capítulo 09). Com `use_overwrite = False`, recomeçar a mesma faixa pula os quadros prontos.

---

## 7. A prova: amostras e denoise

**Arquivo:** `/home/claude/provas/render_amostras.png`. **Script:** `/home/claude/codigo/render/teste_amostras.py` (render) e `/home/claude/codigo/render/folha_amostras.py` (medição e folha, Python do sistema com Pillow e numpy).

**Cena:** o frasco de vidro de 12 cm do capítulo 05 (vidro IOR 1,5 com chanfro de 3 mm, líquido âmbar IOR 1,36, tampa de metal dourado), rig de três pontos, contorno duplo, luz de fundo e cartões de reflexo, AgX Medium High Contrast. Cycles **CPU** (2 núcleos Xeon 2,1 GHz da nuvem), 256x320, transmissão 12, brilho 6, clamp indireto 10, cáustica desligada, **amostragem adaptativa desligada** (para comparar amostras fixas). Referência: 1024 amostras com denoise (164,4 s). Erro: RMSE contra a referência, em % da escala 0 a 255.

| Amostras | Sem denoise | Erro | Com denoise OIDN (albedo + normal, High) | Erro |
|---|---|---|---|---|
| 16 | 2,8 s | 9,82% | 3,7 s | 1,98% |
| 64 | 10,2 s | 4,04% | 10,8 s | 1,28% |
| 256 | 40,1 s | 1,87% | 41,5 s | 0,88% |

**[testado no bpy 5.2.2 Cycles CPU, nuvem]**

Leitura:

1. **O denoise vale mais que 4× amostras.** 64 amostras com denoise (1,28%) ficam melhores que 256 sem (1,87%), em um quarto do tempo.
2. **16 amostras com denoise parece bom de longe e engana.** O erro é baixo (1,98%), mas na folha o líquido perde o detalhe interno e vira um degradê liso ("cera"). O RMSE mede ruído, não mede detalhe perdido. É o sinal clássico de amostras de menos.
3. **O ruído cai com a raiz das amostras.** Sem denoise: 9,82 → 4,04 → 1,87 (cada 4× de amostras corta o erro pela metade, mais ou menos). Para cortar o ruído pela metade, é preciso 4× o tempo. Por isso a amostragem adaptativa (limiar de ruído) é a configuração certa no dia a dia: ela gasta amostras só onde há ruído (vidro, sombra suave) e para cedo no fundo liso.
4. **O denoise custou 0,6 a 1,4 s** a 256x320 na CPU (ver 6.1 para a conta em 1080x1920).
5. Para vidro com líquido, o estúdio considera **256 amostras efetivas + denoise** o mínimo do final. Com adaptativa no limiar 0,01 e teto de 1024, o Cycles chega lá sozinho nas áreas difíceis.

---

## 8. Render farm

Quando o notebook não dá conta do prazo (um filme de 30 s em Cycles final, ou várias versões de cliente), há três caminhos.

### 8.1 SheepIt (gratuito, por pontos)

Do [FAQ do SheepIt](https://www.sheepit-renderfarm.com/faq) (consultado em 02/10/2026):

- **Gratuito**; mantido por doações e anúncios.
- Funciona por **pontos**: você ganha pontos emprestando o seu computador para renderizar quadros dos outros e gasta quando os outros renderizam os seus. A máquina de referência é um Intel i5-9600 (CPU) e uma RTX 3060 (GPU); render em GPU vale 18× mais pontos que em CPU.
- Só versões **estáveis** do Blender (detecta a versão do `.blend`; beta e daily não).
- Limites: projeto de até 2.048 MB; EXR limitado a 4096x2160 com compressão. Para contribuir: 8 GB de RAM (2 livres), 40 GB de disco, 2 núcleos.
- Direitos: o dono do projeto mantém os direitos, desde que seja dono de todos os assets.
- **Privacidade**: o FAQ não detalha proteção dos arquivos. Os quadros são renderizados em computadores de terceiros, então o `.blend` (com o produto do cliente) sai da sua máquina **[não verificado: política de privacidade não consultada]**. Não use em produto sob confidencialidade (lançamento não anunciado) sem autorização escrita do cliente.

Uso no estúdio: deixar o notebook acumulando pontos nas horas paradas e gastar em planos pesados de projetos não confidenciais. Suporte ao 5.2 depende de o SheepIt já ter adicionado a versão **[testar no Blender]** antes de contar com ele.

### 8.2 Farms pagas

**GarageFarm** ([preços](https://garagefarm.net/pricing), consultados em 02/10/2026):

| Prioridade | CPU | GPU |
|---|---|---|
| Baixa | US$ 0,024 por GHz·hora | US$ 0,004 por OB·hora |
| Média | US$ 0,036 por GHz·hora | US$ 0,006 por OB·hora |
| Alta | US$ 0,072 por GHz·hora | US$ 0,012 por OB·hora |

Novos usuários recebem US$ 25 de crédito de teste. "OB·hora" é hora de GPU medida em pontos do OctaneBench: custo = horas na GPU de referência × pontuação OctaneBench × preço.

**Como estimar o custo de um filme:** se o filme leva `H` horas na RTX 3050 e a pontuação OctaneBench dela é `S`, o trabalho equivale a cerca de `H × S` OB·hora. Exemplo com S ≈ 200 **[não verificado: pontuação da RTX 3050 Laptop]**: o Cycles final de 15 s (5,6 h) seria cerca de 1.130 OB·hora, ou US$ 4,50 na prioridade baixa e US$ 13,50 na alta, mais impostos e conversão. Use o crédito de teste para medir com uma cena real antes de orçar para cliente.

**RebusFarm, Ranch Computing, iRender e outras**: preços não consultados nesta pesquisa (a página de preços da RebusFarm deu erro 404) **[não verificado]**.

### 8.3 Checklist antes de mandar para farm

1. Versão do Blender suportada (5.2 LTS).
2. Arquivo empacotado: `File > External Data > Pack Resources` ou caminhos relativos (`//texturas/`).
3. Sem add-ons que a farm não tem (Geometry Nodes nativos são seguros; add-ons comprados, não).
4. Saída em PNG 16 bits ou EXR, nunca vídeo.
5. Render de um quadro de teste na farm e comparação com o mesmo quadro local (cor, AgX, denoise).
6. Contrato do cliente permite enviar os arquivos para terceiros.

---

## 9. Checklist de render

1. Motor escolhido pela tabela 2.4 (vidro e cromo em Cycles; UI e opaco em EEVEE)?
2. `render.fps = 30` declarado (o padrão de fábrica é 24)?
3. AgX com o look do mundo (capítulo 05 e 08)? Nunca Standard.
4. GPU OptiX ligada e conferida no log (`ligar_gpu()` retornou True)?
5. Cycles: limiar de ruído do preset, transmissão 8 ou mais com vidro, cáustica desligada, clamp indireto 10?
6. Memória: texturas dentro do orçamento (2048 em 4 GB), persistent data se couber?
7. Quadro de teste a 50% aprovado e recorte a 100% conferido (foco e textura)?
8. Passes só os necessários? AOV da tela se a interface for trocada na pós?
9. Saída em sequência PNG 16 bits (ou EXR), `use_overwrite = False`?
10. Motion blur 0,5, `CENTER`?
11. Tempo estimado pela tabela 6.2 cabe no prazo? Se não: híbrido, farm ou menos amostras com denoise.
12. Entrega com `entrega_ffmpeg.sh` e conferência no `ffprobe` (High, yuv420p, bt709, 30/1, AAC 48 kHz)?

---

## Fontes

- Manual do Blender (fonte RST), Cycles Sampling (limiar, denoise, path guiding): https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cycles/render_settings/sampling.rst
- Manual do Blender, Cycles Light Paths (saltos, clamp, cáustica, filter glossy): https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cycles/render_settings/light_paths.rst
- Manual do Blender, Cycles Performance (tile, cache de textura, persistent data): https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cycles/render_settings/performance.rst
- Manual do Blender, GPU Rendering (OptiX, driver 575, memória, tamanho de textura): https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cycles/gpu_rendering.rst
- Manual do Blender, EEVEE Limitations: https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/eevee/limitations/limitations.rst
- Manual do Blender, EEVEE Sampling: https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/eevee/render_settings/sampling.rst
- Manual do Blender, Render Passes (Cycles e EEVEE, AOV, cryptomatte): https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/layers/passes.rst
- Manual do Blender, Motion Blur (Cycles e EEVEE): https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cycles/render_settings/motion_blur.rst , https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/eevee/render_settings/motion_blur.rst
- YouTube, configurações de codificação recomendadas (consultado em 02/10/2026): https://support.google.com/youtube/answer/1722171
- TikTok, especificações de anúncios em vídeo: https://ads.tiktok.com/help/article/video-ads-specifications
- FFmpeg, documentação de codecs (libx264, aac): https://ffmpeg.org/ffmpeg-codecs.html (a wiki https://trac.ffmpeg.org/wiki/Encode/H.264 bloqueou acesso automático nesta pesquisa)
- SheepIt, FAQ (consultado em 02/10/2026): https://www.sheepit-renderfarm.com/faq
- GarageFarm, preços (consultado em 02/10/2026): https://garagefarm.net/pricing
- Capítulo 09 (`media_type`, FFmpeg no 5.x, pegadinhas) e capítulo 05 (cena do frasco)
- Sondas e scripts deste capítulo: `/home/claude/codigo/camera/sondas/sonda_cam.py`, `/home/claude/codigo/render/sonda_passes.py`, `/home/claude/codigo/render/presets.py`, `teste_amostras.py`, `folha_amostras.py`, `entrega_ffmpeg.sh`

## Pendências para o Claude Code

Receitas **[testar no Blender]** na máquina de referência (Blender 5.2 completo, RTX 3050 Laptop):

1. Confirmar VRAM (4 ou 6 GB) com `nvidia-smi` e a versão do driver (575 ou mais para OptiX).
2. Medir os seis tempos da tabela 3.6 (EEVEE e Cycles em rascunho, revisão e final) com a cena do frasco e a do celular; substituir as estimativas.
3. Rodar `teste_amostras.py` na GPU com OptiX: mesma tabela da seção 7, e comparar OIDN na GPU, OIDN na CPU e OptiX (tempo e detalhe do líquido).
4. Medir o consumo de VRAM com 4, 8 e 16 texturas 4K, com e sem `texture_limit_render = '2048'`, e com o cache de textura `.tx` do 5.2.
5. Medir o ganho de `use_persistent_data` numa animação de 60 quadros só com câmera em movimento.
6. CPU + GPU juntas contra só GPU no notebook.
7. Throttling térmico: tempo do quadro 1 contra o quadro 400 num render longo.
8. EXR multicamada com o perfil "composição": tamanho por quadro com DWAA, PIZ e ZIP.
9. `use_placeholder` + `use_overwrite = False` com duas instâncias do Blender na mesma pasta.
10. EEVEE: degradê escuro de fundo em 16 bits mostra banding pela meia precisão?
11. Pontuação OctaneBench da RTX 3050 Laptop para orçar farm (seção 8.2).
12. Especificações oficiais de Reels na Central de Ajuda da Meta (página bloqueada nesta pesquisa).
13. Suporte do SheepIt ao Blender 5.2 e política de privacidade dos arquivos.

PENDÊNCIAS YOUTUBE: nenhum vídeo foi usado como fonte neste capítulo. Sugestões para estudo (não acessados): canal "Blender Guru" (otimização de render no Cycles), canal "CG Cookie" (passes e composição), canal "Blender" oficial (notas do EEVEE Next e do 5.x). Listas completas no capítulo 11.
