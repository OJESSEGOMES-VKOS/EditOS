# Render, pós e som

Profundidade: `fontes-youtube/render-pos-som.md` (19 vídeos: CG Cookie, Blender Guru, SouthernShotty,
CGMatter, Christopher 3D, Herman Huang, Daniel Schiffer, Google Design e outros).

## Motor: qual usar
| Situação | Motor |
|---|---|
| Animatic, blocking, timing | EEVEE rascunho a 25% |
| Vidro, líquido, metal em close, still hero | **Cycles** (OptiX na RTX 3050) |
| Animação longa estilizada, névoa/volume | EEVEE final (raytracing + fast GI ligados) |
| Produto realista animado com prazo curto | EEVEE final; Cycles só nos planos de vidro |

## Medido na máquina (RTX 3050 Laptop, Blender 5.2.2)
- EEVEE revisão (64 amostras) 540x960: **0,37 s/quadro** → ~1,5 s em 1080x1920.
- Cycles revisão (96 amostras, adaptativo 0,02, OptiX) 540x960, frasco de vidro: **~7 s/quadro**
  (10 s com a abertura do Blender).
- Antes de render longo: meça 3 quadros, multiplique e avise o dono.

## Presets da biblioteca (`nucleo.motor`)
- EEVEE: amostras 16/64/128; `use_raytracing`, `use_fast_gi` (método GI), sombras com 2 raios e 8
  passos, volumétrico com sombra. As fontes recomendam ainda: fast GI steps 16, resolução RT 1:1 e
  GI 1:2 no final (1/16 pisca), denoise temporal desligado (a confirmar por sonda).
- Cycles: amostras 24/96/384; adaptativo 0,05/0,02/0,01; denoiser OptiX (OIDN no final);
  bounces 12 (difuso 3, glossy 4, transmissão 12); cáusticas off; Persistent Data on.
- Dicas que as fontes mediram: limiar 0,03 em vez de 0,01 (−64% de tempo); texture limit 2048
  (VRAM de 4 GB); apagar mapas inúteis no EEVEE (11 s → 4 s por quadro). **Nunca** frame step +
  interpolação em comercial (artefato na borda do produto).

## Saída
Sempre sequência de imagens (PNG compressão 15 para entrega; EXR Half DWAA se for gradear). Vídeo
final no FFmpeg: `-c:v libx264 -pix_fmt yuv420p -crf 16`.

## Cor e acabamento
- **AgX + look** (`AgX - Medium High Contrast` padrão; `Punchy` pra pop; `High Contrast` pra luxo).
  O AgX nasce lavado de propósito: sem look, fica cinza.
- **Exposição antes de luz e de saturação.** Cor que precisa saltar: dessature o entorno.
- **Cor exata da marca:** o AgX gira o matiz (laranja vira salmão). Se a cor da marca for crítica,
  use o caminho Raw (view `Raw` + Convert Colorspace no compositor, cadeia completa no destilado)
  e confira com amostra.
- Com view AgX, **todo nó do compositor roda antes do AgX**: o compositor serve pra efeito físico.
- Compositor (`scene.compositing_node_group`): Glare tipo Bloom sutil (substituto do Bloom antigo,
  a confirmar parâmetros por sonda) → Lens Distortion com dispersão mínima → vinheta → grão. Ou faça
  o acabamento no FFmpeg como os filmes anteriores (halo, vinheta, grão em `montar.py`).

## Design de som de comercial
**Camadas:** voz (se houver) → música com stems → ambiência sutil → SFX de ação (um por movimento)
→ riser até o reveal → hit + drop no reveal → **sting final ≤ 5 notas, ascendente, no tom da
marca** → silêncio ou low-pass antes do momento-chave.

| Momento | Som |
|---|---|
| Câmera orbitando / dolly rápido | whoosh em camadas (grave + médio + agudo), pico no quadro de maior velocidade |
| Peça encaixando / pousando | hit curto, ataque duro |
| Texto/UI aparecendo | clique, ratchet por palavra |
| Pausa antes do reveal | silêncio ou low-pass |
| Reveal | hit + drop |
| Packshot / logo | sting |

**Sincronia:** pico do SFX no quadro de movimento mais intenso (calcule pela derivada das F-curves).
O riser termina onde o hit começa. SFX afinados com a música. Um pacote de SFX por peça.
**Mix:** SFX começam em −5 dB; música cava os médios sob a voz; master com limiter true peak;
alvo ~−14 LUFS e −1 dBTP para redes [conhecimento geral]; escute no celular.
Sem biblioteca de som licenciada, sintetize (como `audio/compor.py` dos filmes anteriores) ou peça
a trilha ao dono.
