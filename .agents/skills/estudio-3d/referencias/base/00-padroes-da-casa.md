# 00 · Padrões da casa

> Esta página é a **fonte única** dos números que aparecem em mais de um capítulo. Quando um capítulo e esta página divergirem, vale esta página. Ela nasceu da revisão cruzada dos 11 capítulos (25 contradições encontradas e resolvidas). Valores marcados **[provisório: decisão do dono]** não têm fonte que decida; são o padrão da casa até o dono bater o martelo.

## Como usar
- A IA lê esta página **antes** do capítulo específico e usa estes valores como padrão.
- Só sai do padrão com motivo escrito no tratamento (`[EXCEÇÃO] motivo`).
- Quando o Claude Code medir algo na RTX 3050 que mude um número, ele atualiza o banco Receitas e esta linha ganha a marca **[medido na RTX]**.

## Tempo e ritmo (30 fps)

| Tema | Padrão da casa | Por quê | Sinal de erro | Capítulo dono |
|---|---|---|---|---|
| Taxa de quadros | 30 fps sempre. A fábrica do Blender é 24: troque no script. | Reels, TikTok e Shorts rodam a 30; 24 cria cadência diferente do celular | Movimento com "pulos" no celular; tempos do tempos.json não batem | 09 |
| Hold do herói | Mínimo 24 q (0,8 s). Plano de revelação principal: 30 a 60 q. 12 a 18 q só dentro de plano curto de gancho. **[provisório: decisão do dono]** | Abaixo de 24 q o olho não lê forma e marca juntas | Ninguém lembra do produto ao fim do filme | 01, 04 |
| Planos por duração | 15 s: 5 a 8 planos. 30 s: 8 a 14 planos. Gancho e tensão: planos de 30 a 45 q. Revelação e packshot: 60 a 120 q. **[provisório: decisão do dono]** | Mais planos que isso vira clipe; menos vira institucional lento | Plano médio abaixo de 1,5 s em B2B; acima de 4 s em público jovem | 01, 03, 04 |
| Hold do logo | 45 a 75 q | Leitura de marca + respiro antes do corte | Logo some antes de ser lido, ou fica parado demais | 03, 04 |
| Tempo mínimo de texto | O **maior** entre `30 × (0,5 + caracteres / 12)` e `30 × (palavras / 2,5 + 0,5)`, número conta como 2 palavras; mínimo absoluto 36 q. **[provisório: valor de trabalho, não medido em anúncio]** | Junta a régua de legenda (Netflix) com a de leitura de anúncio | Texto some antes de ser lido em voz alta uma vez | 01, 08, 10 |
| Animação "em dois" | Pose a cada 2 quadros = **15 poses/s** a 30 fps | (12 poses/s é "em dois" a 24 fps) | Stop motion com cadência irregular | 02 |

## Movimento e câmera

| Tema | Padrão da casa | Por quê | Sinal de erro | Capítulo dono |
|---|---|---|---|---|
| Curva padrão | Bézier com **alça assimétrica**: saída 10%, chegada 70%. `BACK` só em pouso. `LINEAR` só em giro contínuo e rolagem mecânica. `AUTO_CLAMPED` simétrico só em push-in de hold. | Medido: a assimétrica faz 47% do caminho em 27% do tempo e passa o resto assentando (sensação premium) | Gráfico de velocidade com pico no meio do movimento | 04 |
| Overshoot | 3 a 8% da distância (`back` 0,9 a 1,55). Premium e eletrônico: 3 a 5% (`back` 0,9 a 1,15). UI e mundos pop: 6 a 8% (`back` 1,3 a 1,55). Pop candy até 12%. Zero em estúdio premium e luxo escuro. | Tabela medida no cap 04: `back` 1,0 = 3,7%, 1,2 = 5,3%, 1,4 = 7,1% | Acima de 12% vira desenho animado | 04 |
| Push-in | 5 a 15% da distância em 3 a 5 s (celular a 60 cm: 1 a 3 cm/s sutil, 5 a 7 cm/s dramático) | Regra relativa vale para qualquer escala | Câmera "atropela" o produto | 04 |
| Câmera na mão | 0,05 a 0,15° de pico, ciclo de 30 a 45 q. No modificador NOISE: `strength = radians(pico) / 0,33` | O `strength` não é a amplitude (pico real ≈ 0,33 × strength) | Acima de 0,3° em produto parado parece erro de câmera | 04 |
| Rastrear alvo | `Track To` na câmera, nunca `Damped Track` | Damped Track entortou o horizonte 5° no teste | Horizonte torto | 04 |
| Lente de 50 mm | Permitida como lente de contexto ou respiro; **nunca** a lente dominante do filme | 50 mm dominante é a assinatura da mesmice | 3 filmes seguidos com o mesmo "olhar" | 01, 02 |
| Diferença de lente entre cortes | Pelo menos 1,5× (ex.: 100 → 50 mm) ou 30° de ângulo | Abaixo disso o corte parece salto | Jump cut acidental | 01 |
| `clip_start` | 1 cm; 5 mm só em macro abaixo de 13 cm | Precisão de profundidade | Faixas e artefatos de z | 04 |

## Profundidade de campo (escala real)

| Situação | f-stop | Por quê |
|---|---|---|
| Produto de frente no 9:16 (celular a 60% da altura) | f/4 a f/5,6 | A f/2,8 só 8 mm ficam nítidos; a f/5,6, 16 mm |
| Produto em ângulo (3/4) | f/8 a f/16 | A profundidade do objeto passa da faixa nítida |
| Macro de detalhe (3 cm a 100 mm) | f/16 a f/32 | A f/2,8 o detalhe tem 0,3 mm nítidos |
| f/2,8 ou menor | Só quando a parte mole é escolha escrita no shot list | No Blender fechar o diafragma não escurece nem difrata: é de graça |
| Diorama com efeito de maquete | Modelar em escala de miniatura (base de 30 a 60 cm) ou câmera ortográfica com DoF desligado | Em escala real de 6 a 8 m, f/2 não borra nada que pareça maquete |

Os números das fichas de mundo (cap 02) valem só quando o produto inteiro cabe na faixa nítida calculada pela fórmula do cap 04 §3.

## Composição e texto (1080 x 1920)

| Tema | Padrão da casa | Capítulo dono |
|---|---|---|
| Máscara de zona segura universal | Livre: 380 px no topo, 672 px na base, 120 px à esquerda, 140 px à direita, e 300 px à direita abaixo de y 960. Área útil: x 120 a 940 (x 120 a 780 abaixo de y 960), y 380 a 1248. Centro óptico da área útil: y ≈ 814. **[não verificado em fonte oficial do TikTok e do YouTube; revisar a cada trimestre]** | 01, 08 |
| Tamanho do produto | Packshot 9:16: 40 a 55% da **altura** do quadro. Plano geral: mínimo 20% da altura. Medir pela altura da caixa da máscara, não pela área. | 01, 10 |
| Tamanho de texto | Altura da fonte ≥ 44 px no apoio; ≥ 66 px em título e CTA | 08 |
| Contraste de texto | WCAG 4,5:1 no mínimo contra o fundo real do quadro | 08 |

## Luz e cor

| Tema | Padrão da casa | Capítulo dono |
|---|---|---|
| Energia das luzes | Use os **watts absolutos** das tabelas do cap 05 §4.1 (ex.: chave 6,3 W a 0,60 m no frasco; 9,8 W a 0,75 m no celular). Se partir de chute próprio, comece 2 a 3 stops abaixo (× 0,15 a 0,35) e confira no medidor. O fator 0,15 é do Laboratório; o 0,35 é da cena do frasco do cap 05. Nenhum dos dois é constante. | 05 |
| Light linking | Em **toda** luz de contorno, e na chave quando o fundo está a menos de 50 cm | 05 |
| Produto opaco vs vidro | Opaco e fosco: metade da energia do vidro | 05 |
| Emissão de tela de app | 1,0 (no AgX desbota acima de ~1,3) | Laboratório |
| Tubo de neon | 1,0 a 2,0; quem ilumina é a luz de área ao lado. Pulso: 2,0 → 1,0 → 2,0 | 02, 05 |
| LED pequeno | 1,5 a 3 com cor saturada, conferindo o hex no medidor | 03 |
| View transform | AgX sempre em fotorrealista. Standard só em passe separado de logo ou UI plana. Khronos PBR Neutral quando o hex da embalagem é a estrela. | 05, 06, 08 |
| Look padrão | `AgX - Medium High Contrast` (inclui comida: Punchy satura tomate e molho além do real) | 05, 08 |
| Look pop | `AgX - Punchy` (pop candy, retrofuturo, neon) | 02 |
| Look neutro | `None` (é idêntico a `AgX - Base Contrast`, medido no cap 08) | 08 |
| Cor de marca | Logo e cartela em 2D por cima do render; o AgX não devolve o hex (ΔE 7,2 contra 0,7 no Khronos) | 06, 08 |
| Névoa volumétrica | Cena de mesa: densidade 0,3 (sutil) a 1,0 (forte) num cubo. 0,01 a 0,03 só em cenário de 5 m ou mais. No EEVEE, ligar `use_volumetric_shadows`. | 05 |
| Medidor de contraste | Duas réguas, nunca misture: `qa.py` do Laboratório: 0,20 a 0,38. Desvio padrão da luma (`medir.py`, `qa_extra.py`): 0,14 a 0,30; CHAPADO abaixo de 0,14. | 10 |

## Materiais

| Tema | Padrão da casa | Capítulo dono |
|---|---|---|
| Chanfro | Celular e eletrônico de mão: 0,5 a 1 mm. Frasco: 1 a 2 mm. Caixa de papel cartão: 0,3 mm. Logo extrudado: 5 a 10% da espessura total (1 a 1,2 mm num logo de 12 mm). Nunca aresta viva. | 06 |
| Escala do logo SVG | Escalar os pontos da curva **antes** de extrudar e chanfrar (o SVG entra a ~90 DPI, 1 unidade ≈ 0,282 mm) | 03, 09 |
| Cor de líquido e vidro colorido | Base Color branca; cor por **Volume Absorption** (perfume #F2B8C6 a 25/m; cola #5A1E0E a 120/m) | 06 |
| Tela de celular | Emissão 1,0. Com cartões explodidos por cima: a mesma imagem também na Base Color (aspereza 0,35), senão os cartões não projetam sombra | 03, 06 |
| Thin film | Thin Film IOR 1,9 a 2,0 com espessura variando de 250 a 750 nm por ruído. Com IOR 1,33 e espessura fixa, quase invisível. Só aparece no Cycles. | 02, 06 |
| Transmissão | `transmission_bounces` 12 no final; 16 a 24 com vidro sobre vidro e líquido | 07 |

## Render e entrega

| Tema | Padrão da casa | Capítulo dono |
|---|---|---|
| Amostras | 64 com denoise OIDN bate 256 sem denoise em um quarto do tempo. 16 + denoise em líquido vira "cera". | 07 |
| Preset final Cycles | 1024 amostras, limiar 0,01, mínimo 64, OIDN High | 07 |
| Rascunho | 25% de resolução na nuvem, 50% na RTX | 07 |
| Filme híbrido | EEVEE no que não tem vidro nem líquido; Cycles só nos planos de vidro (30 s todo em Cycles ≈ 11 h; híbrido ≈ 4 h 50, estimado) | 07 |
| Matriz de cor na entrega | `out_color_matrix=bt709` no ffmpeg, sempre (sem ela o laranja da marca volta R+9 G+7 B-7) | 07 |
| Loudness | -14 LUFS integrado, -1 dBTP. Sempre o mesmo medidor (dois medidores divergiram 0,9 LU) | 08 |
| Sincronia de som | Impacto no quadro do contato ou 1 quadro antes (2 quadros já é perceptível) | 08 |

## Mundos
- São **19 mundos** (cap 02). Os 7 calibrados na RTX pelo Claude Code têm prioridade em prazo curto: estúdio premium, luxo escuro, pop candy, vidro e cromo, neon noturno, natureza e luz do sol (luz natural), argila.
- Regra de rotação dos 4 eixos: mundo, lente dominante, família de acento e transição. Nenhum eixo repete entre dois filmes seguidos (cap 02).


## Medido na RTX 3050 Laptop (Claude Code, 2026-10-02) **[medido na RTX]**

Estas medições valem mais que as estimativas da nuvem. Onde batem com um número acima, ele fica
confirmado; onde divergem, vale esta tabela.

| Tema | Medido | Consequência |
|---|---|---|
| Placa | RTX 3050 Laptop, **4 GB de VRAM**, driver 591.59 | texture limit 2048 em cena pesada; nada de 8+ texturas 4K |
| Cycles 1080x1920, frasco de vidro + líquido + metal | 64 amostras + OIDN: 11,6 s · 64 + OptiX: 12,0 s · 256 + OIDN: 43,6 s · 256 + OptiX limiar 0,03: 37,4 s · **1024 + OIDN: 169,8 s** | **Preset final passa a 256 amostras, limiar 0,03** (a olho, igual a 1024 em zoom 100%; 64 deixa "cera" nos reflexos do vidro). 1024 só em still de capa. 30 s em 256 ≈ 9 a 11 h; em 1024 ≈ 42 h |
| Cycles revisão 540x960 com vidro | ~7 s/quadro | style frames e provas a 50% |
| EEVEE revisão 540x960 | 0,37 s/quadro (120 quadros em 45 s) | animatic e animação estilizada |
| Mantaflow no Blender completo | **funciona** (falhou só no bpy-módulo da nuvem). Bake de 40-45 quadros: res 48 = 8,5 s; res 96 = 75 s; res 128 = 120 s | splash real é viável. A receita com inflow animado **inunda** o domínio: use a porção de líquido em queda sobre o produto (`scripts/receitas/splash_produto.py`) |
| Mundos | os **19** renderizados e medidos no `qa.py` (7 calibrados à mão + 12 montados da ficha por `mundos_ficha.py`, com fotômetro) | nenhum mundo está só no papel |
| Fotômetro (`qa.fotometro`) | brutalista: 22% estourado → 0%; editorial: 18% → 0% em 2 a 4 iterações | rode o fotômetro antes de todo lookdev |
| Azimute das fichas | relativo à câmera | em cena com câmera girada, gire o rig (ou a cena), senão sol "da câmera" chapa tudo (visto no diorama) |

### Ritmo medido em 9 filmes oficiais **[medido nos filmes]**
Ver `referencias/decupagem-filmes.md`. Consumo (Apple, Nothing): mediana de 1,4 a 2,5 s por plano;
SaaS premium (Linear, Framer): 7,6 a 9,8 s com câmera em deriva. Ajustes: 30 s comporta até 16 planos
em ritmo social; o fecho real dura 4,6 a 10 s (logo + respiro 60 a 150 q); a escada rítmica de 0,2 a
0,3 s (zoom em degraus, digitação) é exceção declarada ao hold mínimo de 24 q.

### Do lote 2 do YouTube (18 tutoriais, `referencias/fontes-youtube/lote2.md`)
- **Normalize da luz de área fica ligado** (o padrão do Blender). Com ele, os watts das tabelas da casa
  valem para qualquer tamanho de luz; desligado, a potência vira valor × área em m² e as tabelas
  quebram. A biblioteca `estudio3d` nunca mexe no normalize.
- **Transição por geometry nodes em filme social:** comprimir dos ~100 quadros dos tutoriais para
  30 a 45 quadros.
- Receitas novas a testar (no destilado): vapor emissivo para fundo escuro, gotas que se fundem na
  lata (raio 1 a 2 mm, com Realize em coleção), caixa dobrando em 30 quadros com abas defasadas
  ~15 quadros, holograma de projeção (Fresnel + varredura por Wave em coordenada de câmera).
