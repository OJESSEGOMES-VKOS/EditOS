# Blender 5.2: o que é verdade (confirmado por sonda na máquina)

Confirmado em 2026-10-02 rodando `laboratorio/sonda*.py` no **Blender 5.2.2 LTS**, numa RTX 3050
Laptop com OptiX. Tutorial antigo (2.8, 3.x e 4.0) que contradiz isto está desatualizado.

## Cor
- A cena nova já nasce em **AgX** (view transform) com display **sRGB**. Se o código troca para
  `'Standard'`, ele estraga a cor de propósito. Os filmes antigos daqui fizeram isso.
- View transforms: `AgX`, `Filmic`, `Standard`, `Khronos PBR Neutral`, `ACES 1.3`, `ACES 2.0`,
  `False Color`, `Raw`.
- Looks do AgX (nome exato): `AgX - Very Low Contrast`, `AgX - Low Contrast`,
  `AgX - Medium Low Contrast`, `AgX - Base Contrast`, `AgX - Medium High Contrast`,
  `AgX - High Contrast`, `AgX - Very High Contrast`, `AgX - Punchy`, `AgX - Greyscale`.
- Displays: `sRGB`, `Display P3`, `Rec.1886`, `Rec.2020`.
- O `view_settings` tem balanço de branco (`use_white_balance`, `white_balance_temperature`,
  `white_balance_tint`).

## Motores
- Identificadores: `'CYCLES'`, `'BLENDER_EEVEE'` (o EEVEE novo, ex-"Next"; o nome
  `BLENDER_EEVEE_NEXT` **não existe**) e `'BLENDER_WORKBENCH'`.
- EEVEE: `use_raytracing`, `ray_tracing_method`, `use_fast_gi`, `fast_gi_method`,
  `shadow_ray_count`, `shadow_step_count`, `use_volumetric_shadows`, `volumetric_*` e
  `taa_render_samples`.
- Cycles: o padrão é 4096 amostras, adaptativo 0,01 e denoiser OIDN. O OptiX existe como dispositivo
  (`compute_device_type='OPTIX'`).
- Motion blur: `render.use_motion_blur` e `render.motion_blur_shutter`.

## Principled BSDF (nomes exatos das entradas)
Base Color, Metallic, Roughness, IOR, Alpha, **Thin Wall**, Normal, Weight, **Diffuse
Roughness**, Subsurface Weight / Radius / Scale / IOR / Anisotropy, **Specular IOR Level**,
Specular Tint, Anisotropic, Anisotropic Rotation, Tangent, **Transmission Weight**, **Coat
Weight** / Roughness / IOR / Tint / Normal, **Sheen Weight** / Roughness / Tint, **Emission
Color**, Emission Strength, **Thin Film Thickness**, **Thin Film IOR**.

Nomes velhos que **não existem mais**: `Specular`, `Subsurface`, `Clearcoat`, `Transmission`,
`Emission` (sozinho) e `Sheen` (sozinho). A distribuição é `GGX` ou `MULTI_GGX`.

## Animação por Python (a pegadinha mais cara)
- **`action.fcurves` NÃO existe.** A ação é em camadas e slots (desde o 4.4, e no 5.x o caminho
  antigo foi removido). Para chegar às F-curves:
  ```python
  from bpy_extras import anim_utils
  ad = obj.animation_data
  cb = anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot)
  for fc in cb.fcurves: ...
  ```
- Interpolações: CONSTANT, LINEAR, BEZIER, SINE, QUAD, CUBIC, QUART, QUINT, EXPO, CIRC, BACK,
  BOUNCE, ELASTIC. Easing: AUTO, EASE_IN, EASE_OUT, EASE_IN_OUT.
- A interpolação de uma chave vale para o trecho que **começa** nela.
- `shape_key_add` cria a chave com valor 1.0. Zere logo depois.

## Compositor
- Mora em **`scene.compositing_node_group`** (um node group do tipo `CompositorNodeTree`). O
  `scene.node_tree` com `use_nodes` do jeito antigo não é o caminho.

## Luz
- A luz tem **temperatura nativa**: `light.use_temperature = True; light.temperature = 5600`.
- Área: formas `SQUARE`, `RECTANGLE`, `DISK` e `ELLIPSE`. `spread` (grade/colmeia), `normalize`
  e `exposure`.
- Light linking: `obj.light_linking.receiver_collection` e `blocker_collection`.

## Câmera
- `dof.use_dof`, `aperture_fstop`, `aperture_blades`, `aperture_ratio` (bokeh anamórfico),
  `focus_object` e `focus_distance`.

## Saída
- FFmpeg: MPEG4/MKV/WEBM/QUICKTIME, com codecs H264, H265, AV1, PRORES e DNXHD. Imagem em PNG,
  OPEN_EXR, OPEN_EXR_MULTILAYER, WEBP e AVIF.

## Desempenho medido
- EEVEE 1080x1920 com 16 amostras: ~3 s por quadro na RTX 3050 Laptop (memória
  `blender-5-pegadinhas`).

## Confirmado no laboratório (2026-10-02, renders de prova)
- `obj.visible_camera`, `visible_shadow`, `visible_diffuse` e `visible_glossy` existem e funcionam
  no Cycles: é assim que cartão de reflexo, bandeira e persiana ficam invisíveis pra câmera.
- `obj.matrix_world` só reflete `rotation_euler` recém-definida depois de
  `bpy.context.view_layer.update()`. Sem isso, a direção calculada é a identidade.
- Keyframe com `kp.interpolation = 'EXPO'`/`'BACK'` + `kp.easing` + `kp.back` pelo channelbag:
  funciona e é editável no Graph Editor.
- Modificador `NOISE` em F-curve (`fc.modifiers.new('NOISE')`, `strength`, `scale`, `phase`):
  funciona (câmera na mão).
- Constraint `TRACK_TO` + `dof.focus_object` num vazio: rig de câmera estável.
- Modificador `BEVEL` com `harden_normals=True` + `WEIGHTED_NORMAL(keep_sharp=True)`: chanfro limpo
  sem artefato de sombreamento.
- `bpy.ops.wm.read_factory_settings(use_empty=True)` dá cena limpa em modo `-b`.
- Imagem carregada com `colorspace_settings.name = 'Non-Color'` devolve em `pixels` o valor gravado
  no PNG (é como o medidor lê o quadro final).
- Tempos medidos: EEVEE revisão 540x960 = 0,37 s/quadro; Cycles revisão 540x960 com vidro =
  ~7 s/quadro (RTX 3050 Laptop, OptiX).

## Bug confirmado (2026-10-03)
- **`render.use_persistent_data = True` + motion blur** renderizando vários quadros numa mesma
  sessão (render de animação ou quadros soltos em sequência): o 1º quadro sai certo e os seguintes
  saem com **riscos horizontais** (a imagem parece rasgada). Mesmo quadro renderizado sozinho sai
  limpo. A biblioteca deixa `use_persistent_data` desligado. Foi parte dos quadros estragados da ORLA v1.
- **Chave com um ponto só vale pro filme inteiro.** `anima.chave(luz, 'energy', [(t, valor)])` deixa a
  luz acesa do quadro 1 ao fim, não só a partir de t. Toda luz de um plano só leva uma chave em 0
  no quadro anterior ao plano e outra em 0 no quadro depois. Na ORLA v2 a luz do logo do packshot
  ficou acesa no filme todo e lavou a garrafa de branco. Pra achar a luz culpada: renderizar o
  quadro escondendo uma luz por vez e medir a média (`hide_render`, um arquivo por teste).
