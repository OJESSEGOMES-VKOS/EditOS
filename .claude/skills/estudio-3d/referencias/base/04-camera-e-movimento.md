# 04 · Câmera e movimento (a cura do "movimento de software")

> Alvo: Blender 5.2 (sondas e renders no bpy 5.2.2 LTS na nuvem, EEVEE e Cycles CPU). Código em `/home/claude/codigo/camera/` e `/home/claude/codigo/movimento/`. Provas em `/home/claude/provas/camera_folha.png`, `/home/claude/provas/curvas_velocidade.png` e `/home/claude/provas/motion_blur_shutter.png`.

Quem olha um filme de produto decide em menos de um segundo se aquilo é "de produtora" ou "teste de 3D". A luz responde por metade dessa decisão (capítulo 05). A outra metade é a câmera: qual lente, a que distância, quanto do produto fica nítido, como a câmera se move e, principalmente, **como ela acelera e freia**. O problema 7 da lista do estúdio (curvas padrão, sem antecipação nem respiro, câmera girando à toa ou parada) e o problema 9 (mesma lente e composição em tudo) moram aqui.

Este capítulo dá números para cada escolha, explica o porquê e mostra o sinal de que deu errado. Tudo que é API foi conferido por sonda no bpy 5.2.2. O que depende da RTX 3050 ou do olho humano em tela cheia está marcado **[testar no Blender]**.

---

## 1. Resumo em uma tela

| Decisão | Padrão do estúdio | Por quê | Sinal de erro |
|---|---|---|---|
| Lente do herói | 85 a 100 mm | Perspectiva "honesta", fundo comprimido, produto sem deformar | Frasco com a frente inchada (lente curta perto demais) |
| Lente de contexto | 35 a 50 mm | Mostra ambiente sem distorcer | 24 mm a 15 cm do produto: borda esticada, cara de celular |
| Sensor | 36 mm, `sensor_fit = 'AUTO'` | Os 36 mm valem para o maior lado; 9:16 fica mais "apertado" que 16:9 | Distância copiada de um plano 16:9 para um 9:16 corta o produto |
| f-stop | f/4 a f/5,6 com produto de frente; f/11 a f/22 com produto em ângulo | Profundidade de campo na escala real é de milímetros | Metade do produto mole na resolução final |
| Movimento | sempre motivado (revelar, aproximar, acompanhar) | Câmera que gira sem motivo é o clichê nº 1 de movimento | Giro contínuo do início ao fim, sem pausa |
| Curva | Bézier com alça assimétrica (sai curta, chega longa) ou `BACK` com 3 a 8% de passada | Peso e decisão; o olho lê massa no freio | Tudo em `BEZIER AUTO_CLAMPED` simétrico: cara de software |
| Respiro | hold do herói: 24 q no mínimo (0,8 s), 30 a 60 q no plano de revelação principal; 12 a 18 q só em segura dentro de plano curto de gancho [provisório: decisão do dono] (ver 00 · Padrões da casa) | O olho precisa de tempo para ler forma e marca | Cortes a cada 15 quadros sem descanso |
| Motion blur | ligado, shutter 0,5 (180°) | Borrão de cinema; movimento rápido sem estroboscopia | Objeto rápido "pulando" de quadro em quadro |
| Tremor de mão | 0,05 a 0,15° de pico, ciclo de 30 a 45 quadros | Vida sem chamar atenção | Acima de 0,3° em produto parado parece erro de câmera |

---

## 2. Lentes e sensor

### 2.1 Como o Blender mede a lente

A câmera do Blender é uma câmera pinhole com lente fina por cima para o desfoque. A distância focal (`lens`, em mm) e o tamanho do sensor (`sensor_width`, padrão 36 mm) definem o ângulo de visão. Segundo o manual, a distância focal "controla o quanto da cena é visível de uma vez" ([manual, Cameras](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cameras.rst)).

O detalhe que confunde todo mundo é o **Sensor Fit** ([manual](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cameras.rst)):

- `AUTO`: o tamanho do sensor vale para o **maior lado** da imagem. Em 16:9 os 36 mm são a largura; em 9:16 os 36 mm são a **altura**.
- `HORIZONTAL`: você fixa a largura do sensor; a altura sai da proporção da imagem.
- `VERTICAL`: você fixa a altura; a largura sai da proporção.

Valores de fábrica conferidos **[confirmado por sonda no bpy 5.2.2]**: `lens = 50`, `sensor_width = 36`, `sensor_height = 24`, `sensor_fit = 'AUTO'`, `dof.aperture_fstop = 2.8`, `dof.use_dof = False`, `aperture_blades = 0` (bokeh redondo), `clip_start = 0.1` m, `clip_end = 1000` m. Enums: `sensor_fit` em `AUTO, HORIZONTAL, VERTICAL`; `lens_unit` em `MILLIMETERS, FOV`; `type` em `PERSP, ORTHO, PANO, CUSTOM`.

**Pegadinha do `clip_start`.** O padrão de 10 cm corta o produto quando a câmera chega a 13 cm de um frasco com 24 mm, ou num macro. Use `clip_start = 0.01` (1 cm) em filme de produto; 5 mm só em macro abaixo de 13 cm (ver 00 · Padrões da casa). O `camera_produto()` do estúdio já faz isso.

**Pegadinha do `angle_y`.** `cam.data.angle_y` devolveu 26,99° com a cena em 1080x1920, mas o ângulo vertical real nessa imagem é 39,6° (a sonda mediu a fração do quadro por projeção e bateu com a fórmula de 36 mm na vertical). O `angle_y` do dado da câmera não conhece a resolução da cena: ele usa `sensor_height = 24`. Para cálculos, use a fórmula da seção 2.3 ou `bpy_extras.object_utils.world_to_camera_view`. **[confirmado por sonda no bpy 5.2.2]**

### 2.2 O que cada lente faz com o produto

A lente não muda só o "zoom". Para manter o produto do mesmo tamanho no quadro, lente curta exige câmera perto e lente longa exige câmera longe. A distância muda a **perspectiva**: quanto mais perto, mais a parte da frente do produto cresce em relação ao resto.

Uma medida simples dessa deformação: a razão entre a distância até o centro e a distância até a frente. Para o frasco de 12 cm (raio 30 mm), enquadrado com 60% da altura em 9:16 (distâncias da tabela 2.3):

| Lente | Distância | Frente cresce | O que faz com o produto | Uso no estúdio |
|---|---|---|---|---|
| 24 mm | 13,3 cm | +29% | Frente inchada, laterais fogem, fundo enorme e nítido | Só para cenário (ambiente de loja, mesa inteira) ou efeito cômico; nunca para o herói de perto |
| 35 mm | 19,4 cm | +18% | Ainda deforma um frasco; bom para mão segurando celular e contexto de uso | Plano de contexto, POV, "app na mão" |
| 50 mm | 27,8 cm | +12% | Neutro para olho humano; produto ainda levemente "próximo" | Plano médio, transição de contexto para produto |
| 85 mm | 47,2 cm | +7% | Proporção fiel, fundo comprimido (parece mais perto e maior) | **Herói padrão** de produto pequeno |
| 100 mm | 55,6 cm | +6% | Igual a 85 com mais compressão | Herói, close de tela, linha de produtos lado a lado |
| 135 mm | 75,0 cm | +4% | Quase ortográfico; fundo vira mancha de cor | Detalhe longo, perfil de silhueta, órbita lenta de luxo |
| 100 mm "macro" | 13,9 cm (detalhe de 3 cm) | +20% no detalhe | Textura, gravação, gota, costura | Inserto de 15 a 30 quadros, nunca o plano principal |

Notas:

- **No Blender não existe distância mínima de foco nem lente "macro" especial.** Qualquer lente chega perto. "Macro" aqui é um enquadramento: um detalhe de 2 a 3 cm ocupando o quadro, com 100 mm para não deformar.
- **Compressão do fundo.** Com 135 mm, a parede a 45 cm atrás do produto parece colada nele; com 24 mm, parece distante e mostra muito mais cenário. Por isso a lente longa esconde cenário pobre e a curta exige cenário completo.
- **Variedade é regra.** Problema 9 da lista: mesma lente em tudo. Num filme de 15 s com 4 planos, use pelo menos duas famílias: por exemplo 35 mm (contexto), 85 mm (herói), 100 mm macro (detalhe), 85 mm (assinatura).

Sinal de erro: o frasco parece "barril" ou o celular parece mais largo embaixo do que em cima. Causa: lente curta perto demais. Correção: suba para 85 mm e afaste a câmera na mesma proporção.

### 2.3 Distância para enquadrar: fórmula e tabela

Câmera pinhole: a altura do quadro a uma distância `d` é `d × h_sensor / f`. Para o produto de altura `h` ocupar a fração `p` da altura do quadro:

```
d = h × f / (p × h_sensor)

h_sensor (AUTO, sensor 36 mm):
  9:16  ->  36 mm      (a altura é o maior lado)
  16:9  ->  36 × 9/16 = 20,25 mm
  1:1 e 4:5 -> 36 mm
```

Exemplo: celular de 150 mm, 60% da altura, 85 mm, 9:16: `d = 150 × 85 / (0,6 × 36) = 590 mm`.

A sonda conferiu a fórmula projetando os extremos de um objeto de 15 cm com `world_to_camera_view`: 50 mm a 34,7 cm em 9:16 deu fração 0,6004; 50 mm a 61,7 cm em 16:9 deu 0,6003; 24 mm a 16,7 cm em 9:16 deu 0,5988 **[confirmado por sonda no bpy 5.2.2]**. Script: `/home/claude/codigo/camera/calc_lente_dof.py` (tabelas) e `/home/claude/codigo/camera/sondas/sonda_3.py` (projeção).

**Distância câmera-centro do produto para ocupar 60% da altura do quadro (sensor 36 mm, AUTO):**

| Lente | Celular 15 cm, 9:16 | Celular 15 cm, 16:9 | Frasco 12 cm, 9:16 | Frasco 12 cm, 16:9 |
|---|---|---|---|---|
| 24 mm | 16,7 cm | 29,6 cm | 13,3 cm | 23,7 cm |
| 35 mm | 24,3 cm | 43,2 cm | 19,4 cm | 34,6 cm |
| 50 mm | 34,7 cm | 61,7 cm | 27,8 cm | 49,4 cm |
| 85 mm | 59,0 cm | 104,9 cm | 47,2 cm | 84,0 cm |
| 100 mm | 69,4 cm | 123,5 cm | 55,6 cm | 98,8 cm |
| 135 mm | 93,8 cm | 166,7 cm | 75,0 cm | 133,3 cm |

Para outras frações, multiplique pela razão: 40% da altura = distância × 1,5; 80% = distância × 0,75.

**Uma câmera para dois formatos.** Quando a mesma animação sai em 9:16 e 16:9, a troca de formato com `AUTO` muda o enquadramento vertical (36 mm contra 20,25 mm). Duas saídas:

1. Duas câmeras com distâncias diferentes (mais controle, composição própria para cada formato). Recomendado para o herói.
2. Uma câmera com `sensor_fit = 'VERTICAL'` e `sensor_height` fixo: a altura do quadro fica igual nos dois formatos e o 16:9 apenas ganha laterais. Bom para planos de cenário. **[testar no Blender]** a composição lateral de cada formato.

### 2.4 Sensor: quando mudar

Fique em 36 mm. Mudar o sensor muda o ângulo de visão de todas as lentes e quebra as tabelas deste manual. Se um cliente pedir "o look de um celular filmando", não mexa no sensor: use 24 a 26 mm em 9:16 (é o ângulo aproximado de uma câmera principal de celular) e chegue perto **[não verificado: ângulo exato varia por modelo]**.

---

## 3. Profundidade de campo na escala real

### 3.1 Como o Blender calcula

O Cycles transforma o f-stop em abertura física. No código do Blender ([intern/cycles/blender/camera.cpp](https://raw.githubusercontent.com/blender/blender/main/intern/cycles/blender/camera.cpp)):

```cpp
bcam->aperturesize = (bcam->lens * 1e-3f) / (2.0f * fstop);   // raio da abertura em metros
```

Três consequências práticas:

1. **A escala da cena manda.** A abertura é calculada em metros. Um celular modelado com 1,47 m de altura (10× maior) tem 10× mais profundidade de campo relativa e o desfoque some. Produto sempre em escala real (celular 71,5 x 147 x 7,8 mm; ver capítulo 09).
2. **O f-stop não muda a exposição no Blender.** No manual, o F-Stop "define a quantidade de desfoque" e nada mais ([manual](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cameras.rst)). Fechar para f/16 não escurece a imagem e não há difração. Isso libera f/16 a f/32 em macro sem penalidade, coisa que uma câmera real não permite.
3. **Não há "respiração" de foco.** A projeção é pinhole: mudar o foco não muda o enquadramento. Por isso a fórmula de profundidade de campo do Blender é um pouco diferente da fotográfica em macro (ver 3.2).

### 3.2 Fórmulas

Com foco em `s`, um ponto em `b` vira no sensor um disco de diâmetro:

```
c = f² × |b − s| / (N × b × s)          (modelo do Cycles: lente fina sobre projeção pinhole)

Hiperfocal: H = f² / (N × c)
Perto:      s × H / (H + s)
Longe:      s × H / (H − s)
Profundidade de campo = longe − perto
```

A fórmula fotográfica clássica usa `H = f²/(N c) + f` e `(s − f)` no lugar de `s` ([Wikipedia, Hyperfocal distance](https://en.wikipedia.org/wiki/Hyperfocal_distance); [Wikipedia, Depth of field](https://en.wikipedia.org/wiki/Depth_of_field)). As duas dão o mesmo resultado a mais de 20 cm; em macro a do Cycles dá mais profundidade. O script `calc_lente_dof.py` traz as duas (`dof_mm` e `dof_lente_real_mm`).

**Círculo de confusão de 0,03 mm.** É o padrão do formato 35 mm (a Wikipedia cita 0,025 mm para cinema 35 mm). No Blender, 0,03 mm sobre os 36 mm de altura de um quadro 1080x1920 equivale a **1,6 pixel**. Tudo que fica abaixo disso parece nítido em tela cheia.

### 3.3 Tabela: quanto fica nítido nos casos da tabela 2.3

Profundidade de campo total (perto até longe), c = 0,03 mm, modelo do Cycles, produto ocupando 60% da altura:

| Caso | Lente | Distância | f/2,8 | f/5,6 | f/8 | f/16 |
|---|---|---|---|---|---|---|
| Celular 15 cm, 9:16 | 35 mm | 24,3 cm | 8 mm | 16 mm | 23 mm | 47 mm |
| Celular 15 cm, 9:16 | 50 mm | 34,7 cm | 8 mm | 16 mm | 23 mm | 47 mm |
| Celular 15 cm, 9:16 | 85 mm | 59,0 cm | 8 mm | 16 mm | 23 mm | 46 mm |
| Celular 15 cm, 9:16 | 100 mm | 69,4 cm | 8 mm | 16 mm | 23 mm | 46 mm |
| Celular 15 cm, 16:9 | 35 a 100 mm | 43 a 124 cm | 26 mm | 51 mm | 73 mm | 148 mm |
| Frasco 12 cm, 9:16 | 35 a 100 mm | 19 a 56 cm | 5 mm | 10 mm | 15 mm | 30 mm |
| Frasco 12 cm, 16:9 | 35 a 100 mm | 35 a 99 cm | 16 mm | 33 mm | 47 mm | 94 mm |
| Detalhe de 3 cm (macro) | 100 mm | 13,9 cm | 0,3 mm | 0,7 mm | 0,9 mm | 1,9 mm |

O que a tabela ensina:

1. **Com o mesmo enquadramento, a lente quase não muda a profundidade de campo.** 35 mm perto e 100 mm longe dão os mesmos 16 mm a f/5,6. O que muda é o **fundo**: a lente longa borra mais o fundo (ver 3.4). Escolha a lente pela perspectiva e o f-stop pela nitidez.
2. **9:16 tem cerca de um terço da profundidade de campo do 16:9** com o mesmo produto a 60% da altura. O produto ocupa mais do sensor em 9:16 (21,6 mm contra 12,2 mm), então a ampliação é maior.
3. **Objeto pequeno tem profundidade de campo de milímetros.** Por isso a regra do estúdio:
   - Produto **de frente** (celular encarando a câmera, giro até 10°, frasco frontal em que só a face da frente importa): **f/4 a f/5,6** em 9:16 e **f/2,8 a f/4** em 16:9. A face fica inteira dentro dos 10 a 16 mm e o fundo derrete.
   - Produto **em ângulo** (celular a 30° mostra 73 mm de profundidade da tela; frasco 3/4 mostra o diâmetro inteiro): **f/8 a f/16**, ou escolha que parte fica mole (a mais distante) de propósito.
   - **Macro**: f/16 a f/32. Sem difração no Blender, não há perda. Mesmo assim a faixa nítida é de 1 a 4 mm: escolha um plano (a gravação, a gota) e deixe o resto cair.
4. **Afastar ajuda mais do que fechar.** A profundidade de campo cresce com o quadrado da distância. Enquadrar a 40% em vez de 60% dá 2,25× mais nitidez com o mesmo f-stop.

Sinal de erro: na prova a 25% tudo parece nítido; no render final a 100% a borda de cima do celular está mole. A 216 px de largura o círculo de 0,03 mm vira 0,3 px e some. **Confira foco sempre num recorte a 100% da resolução final** (`render.use_border` com uma região pequena).

Esse erro apareceu na própria prova deste capítulo: 85 mm a f/4 com o celular inclinado 8° e a câmera chegando a 42 cm. A profundidade de campo no fim do push-in é de 5,9 mm, e o celular inclinado ocupa cerca de 20 mm de profundidade da base ao topo. Na folha a 216x384 parece nítido; em 1080x1920 o topo e a base vão ficar moles. Correção: f/8 no fim do push-in (11,7 mm) com foco no centro da tela, ou animar o f-stop **[testar no Blender]** a 100%.

### 3.4 Quanto o fundo borra

Diâmetro do disco de borrão de um ponto do fundo 45 cm atrás do celular (9:16, 1920 px de altura, foco no celular, 60% da altura):

| Lente | f/2,8 | f/8 |
|---|---|---|
| 24 mm | 48 px | 17 px |
| 50 mm | 77 px | 27 px |
| 85 mm | 101 px | 35 px |
| 135 mm | 120 px | 42 px |

Fórmula na função `borrao_fundo_px()` do `calc_lente_dof.py`. Regra prática: fundo com textura (parede, persiana, cidade) precisa de 30 px ou mais de borrão para não competir com o produto; fundo de gradiente liso não precisa de desfoque nenhum.

### 3.5 Propriedades no 5.2 e foco por objeto

Propriedades de `camera.data.dof` no 5.2.2 **[confirmado por sonda no bpy 5.2.2]**: `use_dof`, `focus_object`, `focus_subtarget`, `focus_distance`, `aperture_fstop`, `aperture_blades`, `aperture_rotation`, `aperture_ratio`.

- `focus_object`: com um objeto ligado, a distância é ignorada ([manual](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cameras.rst)). **Sempre foque num empty**, nunca no próprio produto: o foco vai para a origem do objeto (no celular, o centro do corpo, 4 mm atrás da tela). Um empty "Foco" filho do produto, posto na superfície que importa, resolve.
- `aperture_blades`: 0 é bokeh redondo; 6 a 9 lâminas imitam lente real (hexágonos e heptágonos nos brilhos). O estúdio usa 7.
- `aperture_ratio`: maior que 1 achata o bokeh (anamórfico). Só com intenção de "look de cinema"; em produto pequeno quase não aparece.
- Tanto `dof.aperture_fstop` quanto `dof.focus_distance` aceitam chave: a sonda criou F-curves `dof.aperture_fstop` e `dof.focus_distance` no dado da câmera.

```python
# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 | /home/claude/codigo/camera/rigs_camera.py
def dof(cam, foco=None, fstop=5.6, laminas=7, rotacao_graus=0.0, distancia=None):
    c = cam.data.dof
    c.use_dof = True
    c.aperture_fstop = fstop
    c.aperture_blades = laminas          # 0 = redondo; 6 a 9 = lente real
    c.aperture_rotation = math.radians(rotacao_graus)
    if foco is not None:
        c.focus_object = foco            # com objeto, a distância é ignorada
    elif distancia is not None:
        c.focus_distance = distancia
    return c
```

No EEVEE, o desfoque é pós-processo com amostras jitter. As opções do 5.2 ficam em `scene.eevee`: `bokeh_max_size` (padrão 100 px), `bokeh_threshold`, `bokeh_neighbor_max`, `use_bokeh_jittered` ("Jitter Camera": randomiza a posição da câmera a cada amostra para mais precisão) e `bokeh_overblur` ([manual EEVEE, Depth of Field](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/eevee/render_settings/depth_of_field.rst)). Para desfoque forte de produto no EEVEE, ligue `use_bokeh_jittered` e suba amostras para 64 ou mais; o `bokeh_max_size` de 100 px limita o borrão máximo (a tabela 3.4 mostra que f/2,8 com 135 mm passa disso) **[testar no Blender]**.

### 3.6 Rack focus (puxada de foco)

Rack focus é trocar o foco de um objeto para outro no meio do plano. Comunica "olhe para cá agora": da embalagem para o produto, da mão para a tela, do primeiro plano para a marca no fundo.

Como montar: um empty "Foco" é o `focus_object`. Anime a **posição do empty** entre os dois alvos. Trocar `focus_object` de um objeto para outro não interpola (é um ponteiro), então o foco "pularia".

Timing a 30 fps:

| Situação | Duração da puxada | Curva | Por quê |
|---|---|---|---|
| Revelação calma (luxo, cosmético) | 18 a 24 quadros | alça assimétrica 10%/70% | O olho acompanha o foco chegando |
| Ritmo de app/tech | 10 a 14 quadros | `QUART` `EASE_IN_OUT` | Mais decidido, sem perder a leitura |
| Corte disfarçado | 6 a 8 quadros | `EXPO` `EASE_IN_OUT` | Quase um corte; usado com batida da trilha |

Regras:

- Segure 12 quadros **antes** da puxada com o primeiro alvo nítido e 18 a 24 quadros **depois** com o segundo.
- A distância entre os alvos precisa ser maior que 3× a profundidade de campo, senão a troca não se vê. Com f/2,8 em 9:16 (8 mm), 3 a 15 cm de distância entre alvos funciona.
- Puxada de foco sem movimento de câmera é mais elegante. Com câmera andando, a puxada deve começar depois que a câmera já está em velocidade.

```python
# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 (empty de foco anima de y=0,10 a -0,05 entre q30 e q48)
foco = R._empty("Foco")
cam = R.camera_produto("Rack", 100)
R.dof(cam, foco, fstop=2.8)
R.rack_focus(foco, de=(0, 0.10, 0.05), para=(0, -0.05, 0.05), q0=30, dur=18)
```

Medido no teste (`teste_rigs.py`): o empty estava em y = 0,100 no quadro 30, 0,011 no 36 e −0,050 no 48. Com a curva premium, 60% da troca acontece nos primeiros 6 quadros e o resto assenta devagar, como um foquista real.

---

## 4. Movimentos de câmera e o que cada um comunica

Regra mãe: **câmera se move por um motivo**. Os motivos válidos em filme de produto: revelar (mostrar algo que estava escondido), aproximar (aumentar importância), acompanhar (seguir um movimento do produto), transicionar (levar o olho de um plano para o próximo) e dar vida (movimento mínimo para o quadro não morrer). Câmera girando sem um desses motivos é o problema 7.

### 4.1 Tabela de movimentos

| Movimento | O que é | O que comunica | Valores para produto pequeno (30 fps) | Sinal de erro |
|---|---|---|---|---|
| Dolly / push-in | câmera anda para a frente (não é zoom) | importância crescente, "chega mais perto" | sutil: 5 a 15% da distância em 3 a 5 s; dramático: 30 a 40% em 1,5 a 2,5 s | push-in linear do começo ao fim: parece elevador |
| Pull-out | câmera recua | revelação de contexto, final, "olha o todo" | 30 a 60% da distância em 2 a 3 s | recuo que mostra cenário vazio |
| Órbita | câmera gira em torno do produto | volume, acabamento, "é um objeto real" | luxo: 8 a 15°/s; tech: 20 a 30°/s; arco total 30 a 60° por plano | 360° contínuo sem pausa (turntable de portfólio) |
| Grua (crane) | câmera sobe ou desce em arco | grandeza (de baixo para cima), revelação de cima | 5 a 15° de elevação em 2 a 3 s | subida e órbita com a mesma curva e a mesma duração (parece robô) |
| Travelling (truck) | câmera anda de lado, paralela | apresentar uma linha (variantes, cores, telas lado a lado) | 1 produto de largura a cada 1 a 1,5 s | velocidade constante sem respiro nas paradas |
| Whip pan | giro muito rápido com borrão | transição de energia, "e agora" | 4 a 8 quadros, 60 a 120° | sem motion blur: vira um salto |
| Câmera na mão sutil | tremor orgânico | humano, real, bastidor | 0,05 a 0,15° de pico, ciclo 30 a 45 quadros | tremor rápido (ciclo de 4 a 6 quadros) com amplitude alta: parece terremoto |
| Match cut | corte entre formas parecidas | continuidade de ideia (círculo vira logo, tela vira cenário) | ver seção 10 | formas desalinhadas mais de 3% da largura do quadro |
| Câmera parada | sem movimento | autoridade, hold do herói, logo | 1 a 2 s com micro push-in de 1 a 3% | parada total por mais de 45 quadros sem nada se mexer |

Os valores são o ponto de partida do estúdio, derivados das velocidades medidas nas provas deste capítulo. Todos são **[testar no Blender]** em tela de celular com o filme montado: a percepção de velocidade muda com a lente (85 mm faz a órbita parecer mais rápida que 35 mm na mesma velocidade angular, porque o fundo comprimido passa mais depressa).

### 4.2 Velocidade e distância por duração

Para o celular a 59 cm (85 mm, 9:16):

| Duração do plano | Push-in sutil | Push-in dramático | Órbita luxo | Órbita tech |
|---|---|---|---|---|
| 2 s (60 q) | 59 → 55 cm | 59 → 38 cm | 20° | 50° |
| 3 s (90 q) | 59 → 53 cm | 62 → 42 cm (prova deste capítulo) | 30° | 60° a 75° |
| 5 s (150 q) | 59 → 50 cm | evite (cansa) | 45° | evite (cansa) |

Regra de proporção: o deslocamento é proporcional à distância, não absoluto. Para o frasco a 47 cm, multiplique os centímetros por 47/59 = 0,8.

### 4.3 Estroboscopia: o limite de velocidade

A 30 fps, um objeto que anda muito por quadro "pula". O motion blur com shutter 0,5 esconde boa parte disso (seção 9). Referência prática: na prova de motion blur, o celular a 1,5 m/s andou 5 cm por quadro, que deu **30 px por quadro** num quadro de 320 px de largura (cerca de 9% da largura por quadro). Com shutter 0,5 o borrão foi de cerca de 15 px e o movimento ficou contínuo. Acima de 10% da largura por quadro, mesmo com blur, o olho lê saltos **[testar no Blender]** em tela cheia.

---

## 5. Rigs de câmera

Todos os rigs estão em `/home/claude/codigo/camera/rigs_camera.py` e foram medidos por `/home/claude/codigo/camera/teste_rigs.py` no bpy 5.2.2 **[confirmado por sonda no bpy 5.2.2]**.

### 5.1 Pivô de órbita + braço de dolly (o rig padrão)

Três níveis de hierarquia separam os movimentos em canais independentes. Cada canal pode ter sua própria curva e seu próprio tempo, que é exatamente o que tira a cara de robô (seção 6, princípio "ação sobreposta").

```
Cam_Pivo  (empty no centro do produto)
  rotation_euler.z = azimute (órbita)
  rotation_euler.x = −elevação (grua em arco)
  └─ Cam_Braco  (empty em (0, −raio, 0) local)
       location.y = −distância (dolly / push-in)
       └─ Cam  (câmera, rotação (90°, 0, 0): olha +Y, ou seja, sempre para o pivô)
            rotation_euler = tremor de mão (modificador NOISE)
            data.dof.focus_object = empty Foco
```

```python
# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 | /home/claude/codigo/camera/rigs_camera.py
def rig_orbita(alvo=(0, 0, 0), raio=0.6, elev=10.0, azim=0.0, lente=85, nome="Cam"):
    pivo = _empty(nome + "_Pivo", "SPHERE", 0.02)
    pivo.location = alvo
    pivo.rotation_euler = (math.radians(-elev), 0.0, math.radians(azim))   # XYZ: elevação antes do azimute
    braco = _empty(nome + "_Braco", "CUBE", 0.01)
    braco.parent = pivo
    braco.location = (0.0, -raio, 0.0)
    cam = camera_produto(nome, lente)
    cam.parent = braco
    cam.location = (0, 0, 0)
    cam.rotation_euler = (math.radians(90), 0, 0)
    return {"pivo": pivo, "braco": braco, "cam": cam}
```

Medição com órbita de 35° a −10°, push-in de 62 para 45 cm e elevação de 12°:

| Quadro | Distância ao alvo | Altura | Erro de mira | Horizonte |
|---|---|---|---|---|
| 1 | 62,0 cm | 12,9 cm | 0,00° | 0,00° |
| 45 | 48,7 cm | 10,1 cm | 0,00° | 0,00° |
| 90 | 45,0 cm | 9,4 cm | 0,00° | 0,00° |

Por que esse rig e não uma câmera com chaves de posição: interpolar posição em linha reta entre dois pontos de uma órbita faz a câmera "cortar caminho" por dentro do círculo e a distância ao produto diminui no meio. Com pivô, a órbita é um arco perfeito e a distância só muda quando você manda (no braço).

Atenção ao modo de rotação: o padrão `XYZ` aplica X (elevação) antes de Z (azimute), que é o que mantém o horizonte reto em qualquer azimute. Não troque para `ZXY`.

### 5.2 Track To e Damped Track

| Constraint | Como gira | Quando usar | Medido |
|---|---|---|---|
| `TRACK_TO` com `up_axis = 'UP_Y'` e `track_axis = 'TRACK_NEGATIVE_Z'` | aponta e mantém o horizonte | câmera solta (Follow Path, grua manual) mirando o produto | erro de mira 0,00°, roll 0,00° |
| `DAMPED_TRACK` | menor rotação até o alvo | luzes, objetos secundários; **não** em câmera | erro 0,00°, mas **roll de −5,18°** no teste |

O Damped Track inclinou o horizonte em 5° porque a câmera começou com rotação Z de 10°. Horizonte torto em filme de produto parece erro. Propriedades confirmadas no 5.2.2: `TRACK_TO` tem `target`, `subtarget`, `track_axis`, `up_axis`, `use_target_z`; `DAMPED_TRACK` tem `target`, `subtarget`, `track_axis`.

```python
def mirar_com(cam, alvo, tipo="TRACK_TO"):
    c = cam.constraints.new(tipo)
    c.target = alvo
    c.track_axis = "TRACK_NEGATIVE_Z"
    if tipo == "TRACK_TO":
        c.up_axis = "UP_Y"
    return c
```

Mire num **empty de mira**, não no produto. Assim você anima a mira separada da câmera (a mira chega antes, a câmera depois: ação sobreposta) e pode dar peso à mira (5.4).

### 5.3 Follow Path (trilho)

Para caminhos que não são arco nem reta: passar entre dois produtos, contornar uma embalagem aberta, descer uma escada de telas.

```python
# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 | rigs_camera.py
fp = cam.constraints.new("FOLLOW_PATH")
fp.target = trilho                 # curva Bézier 3D
fp.use_fixed_location = True       # posição pelo offset_factor (0 a 1)
fp.use_curve_follow = False        # quem mira é o Track To
fp.offset_factor = 0.0; fp.keyframe_insert("offset_factor", frame=1)
fp.offset_factor = 1.0; fp.keyframe_insert("offset_factor", frame=90)
fc = curvas.fcurve(cam, f'constraints["{fp.name}"].offset_factor', 0)
```

Medido: com três pontos (−0,5; −0,6; 0,15), (0; −0,45; 0,25), (0,5; −0,6; 0,15) e `SINE EASE_IN_OUT`, a câmera passou pelos pontos nos quadros 1, 45 e 90 com erro de mira 0,00°. A F-curve do `offset_factor` fica no channelbag com o caminho `constraints["Follow Path"].offset_factor`. Propriedades confirmadas: `offset`, `offset_factor`, `forward_axis`, `up_axis`, `use_curve_follow`, `use_fixed_location`, `use_curve_radius`.

Por que `use_fixed_location`: sem ele, a posição depende da duração da curva (`path_duration`) e de animar `offset` em quadros. Com ele, 0 é o começo e 1 o fim, e o easing é só a curva do `offset_factor`.

Sinal de erro: velocidade irregular no trilho. Pontos de controle muito desiguais em distância fazem o parâmetro andar mais rápido nos trechos longos **[testar no Blender]**. Distribua os pontos com espaçamento parecido.

### 5.4 Câmera com peso (atraso)

Câmera de verdade tem massa: quando o produto dá um tranco, o operador reage alguns quadros depois e chega suave. Imitar isso faz o produto parecer rápido e a câmera parecer humana.

O estúdio faz isso **assando** um atraso exponencial em chaves: o empty de mira persegue a posição de mundo do produto com constante de tempo `tau` em quadros.

```python
# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 | rigs_camera.py
def peso(seguidor, lider, q0, q1, tau_q=4.0, offset=(0, 0, 0)):
    cena = bpy.context.scene
    alfa = 1.0 - math.exp(-1.0 / tau_q)
    cena.frame_set(q0)
    p = lider.matrix_world.translation.copy()
    pos = []
    for f in range(q0, q1 + 1):
        cena.frame_set(f)
        alvo = lider.matrix_world.translation
        p = p + (alvo - p) * alfa
        pos.append((f, p.copy()))
    seguidor.animation_data_clear()
    for f, v in pos:
        seguidor.location = v + Vector(offset)
        seguidor.keyframe_insert("location", frame=f)
    for i in range(3):
        for k in curvas.fcurve(seguidor, "location", i).keyframe_points:
            k.interpolation = "LINEAR"
    return pos
```

Medido com o produto andando 30 cm em 10 quadros (q20 a q30, `EXPO EASE_OUT`) e `tau = 4`:

| Quadro | Produto | Mira | Atraso |
|---|---|---|---|
| 25 | 0,291 m | 0,184 m | 10,7 cm |
| 30 | 0,300 m | 0,266 m | 3,4 cm |
| 35 | 0,300 m | 0,290 m | 1,0 cm |
| 40 | 0,300 m | 0,297 m | 0,3 cm |

A mira chega a 95% no quadro 34, quatro quadros depois do produto. Valores: `tau` 3 a 6 quadros é peso de operador; acima de 8 a câmera parece atrasada demais e o produto escapa do quadro.

Por que assar e não usar driver: o atraso depende do histórico (quadros anteriores). Driver avalia só o quadro atual. Chaves assadas também deixam o render em várias máquinas determinístico. Rode `peso()` **depois** de terminar a animação do produto; se mudar o produto, rode de novo.

### 5.5 Câmera na mão sutil (modificador NOISE calibrado)

A sonda mediu o modificador NOISE do 5.2.2 com `strength = 1` em 2.000 quadros **[confirmado por sonda no bpy 5.2.2]**:

| `blend_type` | `scale` | Mín | Máx | Média | Oscilações em 1.000 quadros |
|---|---|---|---|---|---|
| `REPLACE` (padrão) | 10 | −0,330 | +0,330 | 0,000 | 148 (≈ 6,8 quadros por ciclo) |
| `REPLACE` | 30 | −0,330 | +0,330 | 0,000 | 52,5 (≈ 19 quadros por ciclo) |
| `ADD` | 10 | +0,170 | +0,830 | +0,500 | 148 |

Conclusões que mudam o código:

1. **`strength` não é amplitude.** O pico é cerca de **0,33 × strength**. Para 0,15° de pico: `strength = radians(0,15) / 0,33`.
2. **`scale` é quase um período.** Um ciclo dura cerca de **0,65 × scale** quadros. Para ciclo de 36 quadros (0,8 Hz a 30 fps): `scale ≈ 55`.
3. **Use `REPLACE`.** Apesar do nome, ele soma ruído centrado em zero à curva. `ADD` soma ruído com média +0,5 × strength: a câmera "escorrega" para um lado.
4. No 5.2 o NOISE tem campos novos: `lacunarity` (2,0), `roughness` (0,5) e `use_legacy_noise` (False). Outros campos: `strength`, `scale`, `phase`, `offset`, `depth`, `blend_in`, `blend_out`, `use_restricted_range`, `frame_start`, `frame_end`, `use_influence`, `influence`.

Valores do estúdio para produto:

| Camada | Eixo | Pico | Ciclo (30 fps) | Por quê |
|---|---|---|---|---|
| Respiração | tilt (X) | 0,05 a 0,15° | 30 a 45 quadros (0,7 a 1 Hz) | O operador respira e corrige devagar |
| Respiração | pan (Z) | 60% do tilt | igual | Pan é mais estável que tilt na mão |
| Respiração | roll (Y) | 35% do tilt | igual | Roll grande parece embriaguez |
| Micro tremor | todos | 25% da respiração | 8 quadros (~4 Hz) | Mão segurando peso |
| Posição | X, Y, Z | 0,3 a 1 mm | 1,3 × o ciclo | Só em close; em plano aberto não aparece |

Medido com 0,15° e posição 0,5 mm: tilt entre −0,138° e +0,118°, velocidade angular máxima de 0,43°/s; posição entre −0,50 e +0,50 mm.

```python
# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 | rigs_camera.py + movimento/curvas.py
def na_mao(cam, amp_graus=0.15, periodo_q=36.0, amp_mm=0.0, fino=True):
    for i, peso_eixo in ((0, 1.0), (1, 0.6), (2, 0.35)):        # tilt > pan > roll
        a = math.radians(amp_graus) * peso_eixo
        curvas.tremor(cam, "rotation_euler", i, a, periodo_q, fase=3.0,
                      rapido=(a * 0.25, 8.0) if fino else None)
    if amp_mm > 0:
        for i in range(3):
            curvas.tremor(cam, "location", i, amp_mm / 1000.0, periodo_q * 1.3, fase=11.0)
```

Coloque o tremor **na câmera**, que é filha do braço. Assim ele se soma à órbita e ao push-in sem atrapalhar as curvas principais. Use `blend_in` e `blend_out` (em quadros) quando o tremor só deve existir em parte do plano.

Sinal de erro: o produto "vibra" em relação ao fundo. Causa: tremor de posição em close com lente longa (0,5 mm com 85 mm a 42 cm de distância já é cerca de 5 px em 1920 de altura). Corte o tremor de posição e deixe só rotação.

Nota de compatibilidade com o capítulo 09: a tabela de lá fala em `strength` 0,5 a 1 mm para posição. Pela calibração acima, isso dá 0,17 a 0,33 mm de pico real, o que está dentro do "sutil". O `base.ruido()` usa `strength` cru; o `curvas.tremor()` converte de pico para strength.

---

## 6. Os 12 princípios da animação aplicados a motion de produto

Os 12 princípios vêm do livro *The Illusion of Life: Disney Animation*, de Frank Thomas e Ollie Johnston (1981), resumidos na [Wikipedia](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation). Foram pensados para personagens. Em produto, o "personagem" é o objeto, a câmera e a interface. A tabela traduz cada princípio em valor de estúdio, a 30 fps.

| # | Princípio | Em produto | Valor do estúdio | Sinal de erro |
|---|---|---|---|---|
| 1 | Comprimir e esticar (squash and stretch) | Só em objetos macios ou gráficos: gota, botão de UI, ícone, tampa de borracha. **Nunca** em vidro, metal ou celular | 3 a 6% de compressão no pouso, volume constante (`x = z = 1/sqrt(y)`), 4 a 6 quadros | celular que "amassa": parece barato e falso |
| 2 | Antecipação | Pequeno movimento contrário antes da ação: produto recua antes de avançar, câmera abre antes de entrar | 4 a 6 quadros, 5 a 10% da amplitude do movimento principal | movimento que nasce do nada; ou antecipação longa demais (mais de 8 quadros) que vira hesitação |
| 3 | Encenação (staging) | Uma ideia por plano; o herói tem o maior contraste e o centro de atenção | 1 ação principal por vez; elementos secundários começam depois que o principal assentou | dois elementos se movendo com a mesma força ao mesmo tempo |
| 4 | Direto e pose a pose | Por script, sempre pose a pose (chaves). "Direto" vira simulação (física, partículas) | poses-chave a cada 15 a 30 quadros, intermediárias geradas pelas curvas | chaves em todo quadro feitas à mão: tremido sem intenção |
| 5 | Continuidade e sobreposição (follow through, overlapping) | Partes chegam em tempos diferentes: o corpo pousa, a tampa assenta 2 quadros depois, o reflexo corre depois; a mira da câmera chega antes da câmera | atraso de 2 a 4 quadros entre partes; textos em cascata de 2 a 3 quadros por palavra | tudo para no mesmo quadro: parece bloco único |
| 6 | Pose em movimento (moving hold) | Quadro de herói nunca congela: micro push-in, luz que corre, tremor de mão | push-in de 1 a 3% durante o hold; 0,05 a 0,1° de tremor | 45 quadros ou mais sem nada mexer: o vídeo parece travado |
| 7 | Aceleração e desaceleração (slow in, slow out) | Toda partida e toda chegada têm easing. Chegada mais longa que a partida | alça de saída 10 a 25% da duração, alça de chegada 60 a 75% | `LINEAR` (partida e parada secas) ou `BEZIER AUTO` simétrico (cara de software) |
| 8 | Arcos | Produto e câmera viajam em arco, nunca em reta perfeita | órbita por pivô (5.1); trajetória de entrada com 5 a 15° de curva | produto entrando em linha reta perfeita: parece slide de apresentação |
| 9 | Ação secundária | Reflexo que corre na tela, líquido que balança, sombra que acompanha | amplitude 20 a 40% da ação principal, atrasada 3 a 6 quadros | ação secundária maior que a principal (rouba atenção) |
| 10 | Timing | O número de quadros define o peso: pesado demora mais para começar e para parar | ver tabela da seção 8 | todos os movimentos com a mesma duração (ex.: tudo em 30 quadros) |
| 11 | Exagero | Overshoot e escala levemente além do real para ler em tela pequena | overshoot de 3 a 8%; escala de "pop" de 104 a 110% | overshoot acima de 12% em produto premium: vira desenho animado |
| 12 | Desenho sólido (solid drawing) | Volume e escala reais: chanfro, espessura, sombra de contato | escala real (capítulo 09), chanfro de 0,5 a 3 mm (capítulo 06) | produto sem sombra de contato "flutuando" sem intenção |

### 6.1 Overshoot com número exato

O overshoot (passar do alvo e voltar) é a forma mais barata de dar peso e decisão. No Blender, a interpolação `BACK` com `EASE_OUT` faz isso. A sonda mediu a passada real para cada valor de `back` (chave de 0 a 1 em 30 quadros) **[confirmado por sonda no bpy 5.2.2]**:

| `k.back` | Passada máxima | Quadro do pico (de 1 a 31) |
|---|---|---|
| 0,5 | 0,8% | 24,3 |
| 0,8 | 2,3% | 22,1 |
| 1,0 | 3,7% | 21,0 |
| 1,2 | 5,3% | 20,1 |
| 1,4 | 7,1% | 19,3 |
| 1,7 | 10,0% | 18,4 |
| 2,0 | 13,2% | 17,7 |

Para a faixa de 3 a 8% do estúdio use `back` entre 0,9 e 1,55. A função `curvas.overshoot_para_back(pct)` interpola essa tabela. Escolha por tipo:

| Elemento | Overshoot | `back` |
|---|---|---|
| Produto premium (perfume, relógio) pousando | 3% | ~0,9 |
| Celular, eletrônico | 4 a 5% | 1,0 a 1,15 |
| Card de UI, botão, ícone | 6 a 8% | 1,3 a 1,55 |
| Logo em vinheta enérgica | 8% | ~1,55 |

O capítulo 09 menciona `back = 1,7` com 9% medido no quadro 15. As medidas batem: 9% é o valor no quadro 15; o pico, 10%, ocorre no quadro 18,4.

### 6.2 Antecipação por script

```python
# Blender 5.2 | status: a testar (usa apenas curvas.mover, confirmado por sonda)
# produto recua 8 mm em 5 quadros e depois avança 100 mm com pouso de 5%
y0 = prod.location.y
curvas.mover(prod, "location", 1, 40, 45, y0, y0 + 0.008, estilo="sine_in_out")      # antecipação
curvas.mover(prod, "location", 1, 45, 66, y0 + 0.008, y0 - 0.100, estilo="pouso", overshoot_pct=5)
```

Cuidado: a segunda chamada reaproveita a chave do quadro 45 e troca a interpolação dela para `BACK`. É o que se quer (a interpolação vale da chave até a próxima). O trecho 40 a 45 continua com `SINE` porque está na chave do quadro 40.

---

## 7. Curvas: o que separa premium de barato

### 7.1 O gráfico de velocidade é a verdade

O Graph Editor mostra posição por tempo. Mas o que o olho sente é a **velocidade** (a inclinação dessa curva). Por isso o estúdio confere movimento pelo gráfico de velocidade: ele mostra na hora se a partida é seca, se o pico está no lugar certo e se a chegada é longa.

A prova `/home/claude/provas/curvas_velocidade.png` foi gerada avaliando as F-curves reais do Blender (`fcurve.evaluate()`) para o mesmo deslocamento de 0 a 1 m em 30 quadros, com cinco curvas. Scripts: `/home/claude/codigo/movimento/velocidade_curvas.py` (bpy, gera CSV) e `grafico_velocidade.py` (matplotlib do Python do sistema, porque o bpy da nuvem não tem matplotlib).

| Curva | Velocidade de pico | Quadro do pico | 50% do caminho | 90% do caminho | Leitura |
|---|---|---|---|---|---|
| `LINEAR` | 1,00 m/s | todos | q16 | q28,25 | Barata. Partida e parada instantâneas |
| `BEZIER` padrão (`AUTO_CLAMPED`) | 1,50 m/s | q15,75 (meio) | q16 | q25,25 | Simétrica. É o padrão do Blender e por isso é "cara de software" |
| `EXPO` + `EASE_OUT` | 6,74 m/s | **q1** | q4 | q11 | Pico no primeiro quadro: partida seca. Só para quem já entra em movimento (vindo de fora do quadro) |
| Bézier com alça assimétrica 10%/70% | 2,15 m/s | q4,25 | q9,25 | q20,5 | **Premium**: arranca em 3 quadros, passa a maior parte do tempo assentando |
| `BACK` + `EASE_OUT`, 5% | 4,12 m/s | q1 | q5,5 | q11,75 | Pouso: passa 5% e volta (velocidade negativa entre q20 e q31) |

O padrão de fábrica de chaves novas é `BEZIER` com alça `AUTO_CLAMPED` (`preferences.edit.keyframe_new_interpolation_type` e `keyframe_new_handle_type`) **[confirmado por sonda no bpy 5.2.2]**. Com só duas chaves, isso dá a curva simétrica laranja do gráfico.

### 7.2 Formatos premium e formatos baratos

| Formato | Como fica no gráfico de velocidade | Quando usar | Nível |
|---|---|---|---|
| Linear | retângulo | só em loops mecânicos (esteira, rotação de fundo infinita com `CYCLES`) | barato |
| Ease in-out simétrico | sino centrado | quase nunca em produto; serve para movimento de câmera muito lento (push-in de hold) | neutro |
| Ease out forte (expo out) | pico no início, cauda longa | entradas vindo de fora do quadro, textos, cards de UI | premium se a entrada já está em movimento |
| Alça assimétrica (saída curta, chegada longa) | sobe rápido, pico em 10 a 20% da duração, cauda longa | órbitas, push-ins, produto que sai do repouso | **premium padrão** |
| Ease in forte (expo in) | cauda longa no início, pico no fim | saídas, zoom pela tela, whip (a velocidade esconde o corte) | premium para saídas |
| Back (overshoot) | pico no início, passa de zero para negativo no fim | pousos, UI, logo | premium com 3 a 8% |
| Elastic / bounce | várias oscilações | quase nunca; só em marca infantil ou pop | barato em premium |

Nos padrões da `ELASTIC`, a sonda leu `amplitude = 0,8` e `period = 4,1`.

### 7.3 Configuração por Python no 5.x (channelbag)

No 5.x, `action.fcurves` não existe mais. As F-curves moram no channelbag do slot ([notas 4.4, Slotted Actions](https://developer.blender.org/docs/release_notes/4.4/upgrading/slotted_actions/); ver capítulo 09, seção 4.1).

```python
# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 | /home/claude/codigo/movimento/curvas.py
import bpy
from bpy_extras import anim_utils

def fcurve(idd, data_path, index=0):
    ad = idd.animation_data
    if not ad or not ad.action:
        return None
    cb = anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot)
    return cb.fcurves.find(data_path, index=index) if cb else None

def alca_assimetrica(fc, q0, q1, saida=0.10, chegada=0.70):
    """Saída curta e chegada longa. Alças planas (mesmo valor da chave)."""
    k0 = next(k for k in fc.keyframe_points if abs(k.co.x - q0) < 1e-4)
    k1 = next(k for k in fc.keyframe_points if abs(k.co.x - q1) < 1e-4)
    d = q1 - q0
    k0.interpolation = 'BEZIER'
    k0.handle_right_type = 'FREE'
    k1.handle_left_type = 'FREE'
    k0.handle_right = (q0 + saida * d, k0.co.y)
    k1.handle_left = (q1 - chegada * d, k1.co.y)
    fc.update()
```

Enums e propriedades confirmados no 5.2.2:

- `Keyframe`: `interpolation`, `easing`, `back`, `amplitude`, `period`, `handle_left`, `handle_right`, `handle_left_type`, `handle_right_type`, `co`, `co_ui`, `type`.
- `interpolation`: `CONSTANT, LINEAR, BEZIER, SINE, QUAD, CUBIC, QUART, QUINT, EXPO, CIRC, BACK, BOUNCE, ELASTIC`.
- `easing`: `AUTO, EASE_IN, EASE_OUT, EASE_IN_OUT`.
- Tipos de alça: `FREE, ALIGNED, VECTOR, AUTO, AUTO_CLAMPED`.
- `FCurve`: `extrapolation`, `auto_smoothing`, `keyframe_points`, `modifiers`, `sampled_points`, `update()`, `evaluate(quadro)`.
- Modificadores de F-curve: `GENERATOR, FNGENERATOR, ENVELOPE, CYCLES, NOISE, LIMITS, STEPPED, SMOOTH`.

Três regras que evitam erro:

1. **A interpolação vale da chave até a próxima.** Easing de uma entrada vai na chave **inicial** do trecho (pegadinha 28 do capítulo 09).
2. **Alças `FREE` só valem com interpolação `BEZIER`.** Com `EXPO` ou `BACK`, as alças são ignoradas no trecho.
3. **Chame `fc.update()`** depois de mexer em alças por código, para o Blender recalcular as alças automáticas vizinhas.

### 7.4 As funções do estúdio

```python
# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 | curvas.py
fc = curvas.mover(obj, "location", 2, 1, 31, 0.0, 0.12, estilo="premium")       # alça 10%/70%
fc = curvas.mover(obj, "location", 2, 1, 31, 0.0, 0.12, estilo="pouso", overshoot_pct=5)
fc = curvas.mover(obj, "rotation_euler", 2, 1, 120, 0.0, 6.2832, estilo="sine_in_out")
```

Estilos: `linear`, `bezier`, `expo_out`, `expo_in_out`, `quart_out`, `quint_out`, `sine_in_out`, `premium`, `pouso`.

### 7.5 O gráfico na prática

Para olhar a velocidade de uma cena inteira, use o `movimento_qa.py` do capítulo 10 (`/home/claude/codigo/qc/movimento_qa.py`): ele acusa `LINEAR`, `SEM_EASE`, `CAM_SEM_PAUSA` e `PARADO`. Para estudar uma curva isolada, rode `velocidade_curvas.py` trocando os estilos.

---

## 8. Tabela de timing em quadros

Duração é decisão de direção, mas existem faixas que funcionam. Valores de partida do estúdio a 30 e 60 fps. A 60 fps os quadros dobram; a duração em segundos é a mesma.

| Ação | 30 fps | 60 fps | Segundos | Curva | Observação |
|---|---|---|---|---|---|
| Entrada de produto (de fora do quadro até a posição) | 18 a 24 q | 36 a 48 q | 0,6 a 0,8 s | `EXPO EASE_OUT` ou `BACK` 3 a 5% | Já entra em movimento: pico no início é correto |
| Pouso (assentar depois do overshoot) | 6 a 10 q | 12 a 20 q | 0,2 a 0,33 s | parte final do `BACK` | Peças secundárias (tampa) 2 a 4 q depois |
| Antecipação | 4 a 6 q | 8 a 12 q | 0,13 a 0,2 s | `SINE EASE_IN_OUT` | 5 a 10% da amplitude principal |
| Turntable 360° de herói | 180 a 240 q | 360 a 480 q | 6 a 8 s | `LINEAR` só em loop; senão alça assimétrica | Em filme de 15 s, prefira arco de 30 a 90° |
| Giro de revelação (90° a 180°) | 45 a 75 q | 90 a 150 q | 1,5 a 2,5 s | `EXPO EASE_IN_OUT` ou premium | Pare em pose de herói, nunca no meio |
| Texto entrando (por linha) | 10 a 15 q | 20 a 30 q | 0,33 a 0,5 s | `QUART`/`QUINT EASE_OUT` | Cascata de 2 a 3 q por palavra |
| Texto: tempo de leitura | 36 q (1 a 2 palavras) a 111 q (8 palavras) | o dobro | 1,2 a 3,7 s | | Tempo mínimo = o maior entre 30 × (0,5 + caracteres/12) e 30 × (palavras/2,5 + 0,5), número contando como 2 palavras; mínimo 36 q (capítulo 08, seção 6.3) (ver 00 · Padrões da casa) |
| Troca de tela de app | 12 a 18 q | 24 a 36 q | 0,4 a 0,6 s | `QUINT EASE_OUT` | Parecido com transições de sistema móvel **[não verificado: duração exata das plataformas]** |
| Card de UI aparecendo | 8 a 12 q | 16 a 24 q | 0,27 a 0,4 s | `BACK` 6 a 8% | Escala de 92% para 100% e opacidade junto |
| Logo resolve (montagem) | 24 a 45 q | 48 a 90 q | 0,8 a 1,5 s | premium | Antes do hold |
| Hold do logo | 45 a 75 q | 90 a 150 q | 1,5 a 2,5 s | moving hold de 1 a 2% | Fim do filme: nunca menos de 1,5 s |
| Hold do herói | 30 a 60 q | 60 a 120 q | 1 a 2 s | moving hold | Mínimo 24 q para o olho ler forma e marca; 30 a 60 q no plano de revelação principal; 12 a 18 q só dentro de plano curto de gancho [provisório: decisão do dono] (ver 00 · Padrões da casa) |
| Push-in de hold | o plano inteiro | | | `SINE EASE_IN_OUT` | 1 a 3% da distância |
| Transição 3D (seção 10) | 8 a 16 q | 16 a 32 q | 0,27 a 0,53 s | `EXPO EASE_IN` + `EXPO EASE_OUT` | O pico de velocidade cai no quadro do corte |
| Whip pan | 4 a 8 q | 8 a 16 q | 0,13 a 0,27 s | `EXPO EASE_IN_OUT` | Com motion blur ligado, sempre |
| Rack focus | 10 a 24 q | 20 a 48 q | 0,33 a 0,8 s | premium | Ver 3.6 |
| Plano inteiro (corte a corte) | 45 a 120 q | 90 a 240 q | 1,5 a 4 s | | 15 s: 5 a 8 planos; 30 s: 8 a 14 planos. Gancho e tensão podem ter planos de 30 a 45 q; revelação e packshot, 60 a 120 q [provisório: decisão do dono] (ver 00 · Padrões da casa) |

Sinal de erro: todas as ações com 30 quadros, ou entradas e saídas com a mesma duração. Saída é mais curta que entrada (cerca de 70%), porque o olho já conhece o objeto que sai.

---

## 9. Motion blur

### 9.1 Shutter 0,5 e por quê

No Blender, o `motion_blur_shutter` é o tempo, em quadros, entre o obturador abrir e fechar: "shutter 1,0 borra pelo comprimento de 1 quadro" ([manual Cycles, Motion Blur](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cycles/render_settings/motion_blur.rst)). Shutter 0,5 é metade do quadro, o equivalente ao obturador de 180° do cinema (exposição de 1/60 s a 30 fps). Pela regra do obturador ([Wikipedia, Shutter angle](https://en.wikipedia.org/wiki/Shutter_angle)), 180° é o borrão que o público reconhece como "natural".

| Shutter | Equivalente | Efeito | Uso |
|---|---|---|---|
| 0 (desligado) | obturador fechado | movimento rápido estroboscópico | só em UI 2D plana ou estilo "stop motion" |
| 0,25 | 90° | borrão curto, movimento nervoso, nítido | ação esportiva, partículas que devem ler nítidas |
| **0,5** | **180°** | **padrão de cinema** | **padrão do estúdio** |
| 1,0 | 360° | borrão longo, sonhador, "mole" | whip pan e transição rápida (só nos quadros da transição) |

**Prova medida** (`/home/claude/provas/motion_blur_shutter.png`, script `/home/claude/codigo/movimento/teste_motion_blur.py`): celular andando 5 cm por quadro (1,5 m/s) num quadro de 320 px de largura com 50 mm a 75 cm. Transição de borda (10% a 90%) medida numa linha da imagem:

| Motor | Sem blur | Shutter 0,5 | Shutter 1,0 |
|---|---|---|---|
| EEVEE | 2 px | 19 px | 37 px |
| Cycles | 2 px | 20 px | 38 px |

Os dois motores dão o mesmo borrão para movimento simples **[confirmado por sonda no bpy 5.2.2]**. O deslocamento por quadro era cerca de 30 px; shutter 0,5 borrou cerca de metade disso, como a teoria prevê.

### 9.2 Propriedades no 5.2 (EEVEE e Cycles)

No 5.x, o liga/desliga e o shutter são **da cena**, compartilhados pelos dois motores **[confirmado por sonda no bpy 5.2.2]**:

- `scene.render.use_motion_blur` (padrão False), `motion_blur_shutter` (padrão 0,5), `motion_blur_position` (`START`, `CENTER`, `END`), `motion_blur_shutter_curve`.
- EEVEE: `scene.eevee.motion_blur_steps` (padrão 1), `motion_blur_max` (padrão 32 px), `motion_blur_depth_scale`.
- Cycles: `scene.cycles.rolling_shutter_type` (`NONE`, `TOP`) e `rolling_shutter_duration`.

Diferenças importantes:

| Ponto | EEVEE | Cycles |
|---|---|---|
| Método | acumulação por passos + borrão pós-processo entre passos ([manual EEVEE](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/eevee/render_settings/motion_blur.rst)) | integra o tempo de verdade em cada amostra |
| Custo | cada passo multiplica o tempo; amostras arredondam para múltiplo dos passos | quase nenhum custo extra (0,9 s contra 1,1 s no teste) |
| Rotação rápida (whip, hélice, roda) | 1 passo borra em linha reta; use 4 a 8 passos | correto em arco |
| Objetos rápidos se cruzando | pode gerar padrão em cruz; mais passos reduzem | correto |
| Luz que se move | não se aplica | o borrão não considera o movimento das luzes ([manual Cycles](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cycles/render_settings/motion_blur.rst)) |
| Câmera ortográfica | | não há motion blur de câmera ortográfica |

Use `CENTER` como posição. Com `START`, o borrão fica "atrás" do quadro e o objeto parece adiantado em relação a elementos sem blur (texto do compositor, legendas).

---

## 10. Transições 3D sem corte

Transição sem corte é o que faz um filme de 15 s parecer uma peça única, e não quatro clipes colados. Todas abaixo têm a mesma lógica: **o corte (ou a troca de cena) acontece num quadro em que o olho não consegue comparar o antes e o depois**, seja porque a tela está coberta, seja porque a velocidade está no pico, seja porque a forma é igual.

O pico de velocidade no quadro do corte é a regra: o plano A sai com `EXPO EASE_IN` (acelerando) e o plano B entra com `EXPO EASE_OUT` (desacelerando). A velocidade é a mesma dos dois lados do corte e o motion blur cobre a emenda.

Funções em `/home/claude/codigo/movimento/transicoes.py`. Troca de câmera por marcador confirmada por sonda: com marcadores nos quadros 1 (câmera A) e 46 (câmera B), `scene.camera` foi A nos quadros 1 e 45 e B nos quadros 46 e 90 **[confirmado por sonda no bpy 5.2.2]**.

```python
def trocar_camera(cena, cam, quadro, nome=None):
    m = cena.timeline_markers.new(nome or f"cam_{cam.name}_{quadro}", frame=quadro)
    m.camera = cam
    return m
```

### 10.1 Zoom pela tela (do celular para dentro do app)

A transição mais útil para app: a câmera mergulha na tela do celular e o próximo plano é a interface em tela cheia.

Passo a passo (30 fps, celular com tela de 141 mm de altura, 85 mm, 9:16):

1. **q0 a q0+6**: hold do celular com a tela já mostrando o primeiro quadro da interface do próximo plano (mesma imagem, mesma cor).
2. **q0+6 a q0+30 (24 q)**: push-in com `EXPO EASE_IN` do braço de 59 cm até a distância em que a tela passa da altura do quadro. A tela enche 100% da altura a `d = 141 × 85 / 36 = 33,3 cm` (com 50 mm: 19,6 cm). O estúdio vai até 85% disso (28,3 cm), para a borda do celular sair do quadro.
3. **q0+30**: corte para a cena da interface (outra câmera, outra cena ou a mesma tela em plano ortográfico). O primeiro quadro do plano B é idêntico ao último do A.
4. **q0+30 a q0+42**: o plano B continua o movimento com 3 a 5% de push-in em `EXPO EASE_OUT`, assentando.
5. Motion blur 0,5 nos dois lados. Emissão da tela igual nos dois planos (1,0 no AgX, capítulo 05).

```python
# Blender 5.2 | status: distâncias confirmadas por sonda; corte a testar no Blender | transicoes.py
d_fim = T.zoom_pela_tela(rig["braco"], raio_ini=0.59, h_tela=0.141, lente=85, q0=96, dur=24)
T.trocar_camera(cena, cam_interface, 120)
```

Sinal de erro: um "pulo" de brilho ou cor no corte. A interface renderizada no celular passa pelo material do vidro e pelo AgX; a interface em tela cheia não. Ajuste a emissão até a média dos dois quadros diferir menos de 2% **[testar no Blender]**.

### 10.2 Passar por dentro do objeto

A câmera atravessa uma superfície (a tampa de um frasco, a parede de uma caixa, a lente de uma câmera) e sai em outro ambiente.

1. Plano A: push-in em `EXPO EASE_IN` até a câmera chegar a 2 a 5 mm da superfície. Com `clip_start` de 1 cm, a superfície é cortada pelo plano de recorte nesse ponto: na prática a tela fica toda da cor do material.
2. No quadro em que o material cobre 100% do quadro, troque de cena (marcador) ou esconda o objeto (`hide_render` com chave).
3. Plano B começa com algo da mesma cor cobrindo a tela (o lado de dentro, um líquido, um fundo da mesma cor) e abre com `EXPO EASE_OUT`.
4. Duração total: 10 a 16 quadros entre "começa a cobrir" e "termina de abrir".

Sinal de erro: dá para ver a malha por dentro (faces invertidas, buracos). Feche a malha ou use `clip_start` maior no quadro do corte.

### 10.3 Match cut (corte por forma)

Duas formas parecidas na mesma posição do quadro: o círculo da tampa vira o círculo do logo, a tela do celular vira o card do site, a borda da garrafa vira o horizonte.

1. Escolha a forma comum e o quadro do corte.
2. Renderize o último quadro do A e o primeiro do B e sobreponha (50% de opacidade) para checar alinhamento. Diferença máxima de posição e tamanho: **3% da largura do quadro** (32 px em 1080).
3. Se os dois planos têm movimento, a velocidade e a direção precisam ser iguais nos dois lados (mesma curva espelhada).
4. Use marcadores de câmera (`trocar_camera`) se for a mesma cena com duas câmeras.

### 10.4 Wipe por objeto

Um objeto de primeiro plano passa muito perto da lente e cobre o quadro: uma folha, um produto em queda, a mão, uma placa da marca.

1. O objeto passa a 5 a 15 cm da lente, com `wipe_objeto()` em `LINEAR` (precisa de velocidade constante para não "parar" na frente).
2. Duração da passagem: 6 a 10 quadros. O corte cai no quadro em que ele cobre 100%.
3. Desfoque forte (objeto fora da profundidade de campo) ajuda a esconder a forma e a emenda.

### 10.5 Mudança de escala

O produto cresce até virar cenário (o celular cresce até a tela virar a parede), ou a câmera recua até o produto virar um pixel de uma paisagem maior.

1. Use `escala_continua()` com `EXPO EASE_IN` e fator de 20 a 50×, ou anime a câmera, não o objeto, quando houver luz e sombra (escala do objeto muda a relação com a luz).
2. O corte para a cena seguinte cai no quadro em que um elemento da cena A coincide com um da cena B (forma igual, como no match cut).
3. Profundidade de campo: ao crescer 40×, um objeto que estava a f/5,6 passa a ter um desfoque enorme. Anime o f-stop junto (`dof.aperture_fstop` aceita chave).

### 10.6 Whip pan

1. Plano A: a câmera gira 60 a 120° em 4 a 8 quadros com `EXPO EASE_IN` (acelerando).
2. Corte no pico de velocidade.
3. Plano B: continua girando na mesma direção e freia com `EXPO EASE_OUT` em 6 a 10 quadros.
4. Shutter 1,0 só nos quadros da transição (anime `render.motion_blur_shutter`) **[testar no Blender]** se aceita chave por quadro no render de animação. No EEVEE, 4 a 8 passos de motion blur.

---

## 11. A prova: push-in + órbita com easing

**Arquivo:** `/home/claude/provas/camera_folha.png` (6 quadros, EEVEE, 216x384, 16 amostras). **Script:** `/home/claude/codigo/camera/prova_pushin_orbita.py`. **Cena:** celular em escala real (71,5 x 147 x 7,8 mm, chanfro de 3,2 mm [valor de prova, não regra: celular pede raio de canto de 9 mm e chanfro de borda de 0,5 a 1 mm, tabela do cap 06] (ver 00 · Padrões da casa), titânio metálico com aspereza 0,28), tela emissiva com degradê (força 1,0), rig de três pontos e fundo infinito do capítulo 05, AgX Medium High Contrast.

Plano de 90 quadros (3 s):

| Canal | De | Para | Curva |
|---|---|---|---|
| Órbita (pivô Z) | 35° | −10° | alça assimétrica 10%/70% |
| Push-in (braço Y) | 62 cm | 42 cm | alça assimétrica 10%/70% |
| Grua (pivô X) | 14° | 6° | `SINE EASE_IN_OUT` |
| Mão | | | 0,08° de pico, ciclo de 36 quadros |
| Lente e foco | 85 mm, f/4, 7 lâminas | | foco num empty na tela |

Medido:

| Quadro | Distância | Azimute | Tempo de render (nuvem, CPU) |
|---|---|---|---|
| 1 | 62,0 cm | 35,0° | 5,6 s |
| 12 | 57,9 cm | 25,7° | 11,5 s |
| 24 | 52,6 cm | 13,8° | 11,3 s |
| 45 | 46,3 cm | −0,3° | 11,1 s |
| 66 | 43,1 cm | −7,5° | 11,1 s |
| 90 | 42,0 cm | −10,0° | 11,1 s |

Leitura da folha: no quadro 24 (27% do tempo) a câmera já fez 47% da órbita, e do 45 ao 90 (metade do tempo) faz só os últimos 22%. É a assinatura da curva premium: arranca decidida e passa a maior parte do plano assentando, o que dá tempo ao olho para ler a tela no fim. O reflexo da luz principal atravessa a tela entre os quadros 1 e 12 (ação secundária gratuita da órbita). A grua desce 8° com curva diferente da órbita, então os dois movimentos não terminam "no mesmo tique".

O que a prova não mostra e precisa de teste a 100%: a profundidade de campo no fim do push-in (5,9 mm a f/4) é menor que a profundidade do celular inclinado (seção 3.3). **[testar no Blender]** a 1080x1920 e, se necessário, animar o f-stop de 4 para 8 entre os quadros 45 e 90.

---

## 12. Checklist de câmera e movimento (antes de renderizar)

1. Produto em escala real? `obj.dimensions` bate com a medida do produto (sem isso, a profundidade de campo é falsa).
2. `clip_start` de 1 cm? Lente escolhida pela perspectiva (85 a 100 mm no herói)?
3. Distância calculada pela fórmula da seção 2.3 para o formato certo (9:16 é diferente de 16:9)?
4. Foco num empty na superfície que importa? f-stop conferido num recorte a 100%?
5. Cada movimento tem um motivo (revelar, aproximar, acompanhar, transicionar, dar vida)?
6. Nenhuma curva `LINEAR` fora de loop, nenhuma `BEZIER AUTO` simétrica em movimento principal?
7. Canais com tempos diferentes (órbita, push-in, grua não começam nem terminam no mesmo quadro)?
8. Overshoot entre 3 e 8%? Antecipação de 4 a 6 quadros onde há ação de peso?
9. Hold do herói de 30 a 60 quadros com moving hold? Hold do logo de 45 a 75 quadros?
10. Motion blur ligado, shutter 0,5, posição `CENTER`? EEVEE com passos suficientes para rotação rápida?
11. Transições com o pico de velocidade no quadro do corte?
12. Lentes variadas entre os planos (pelo menos duas famílias)?
13. `movimento_qa.py` (capítulo 10) sem `LINEAR`, `CAM_SEM_PAUSA` ou `PARADO` não intencional?

---

## Fontes

- Manual do Blender (fonte RST), Cameras (focal length, sensor fit, depth of field): https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cameras.rst
- Manual do Blender, Cycles Motion Blur: https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/cycles/render_settings/motion_blur.rst
- Manual do Blender, EEVEE Motion Blur: https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/eevee/render_settings/motion_blur.rst
- Manual do Blender, EEVEE Depth of Field: https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/render/eevee/render_settings/depth_of_field.rst
- Código do Cycles, cálculo da abertura a partir do f-stop: https://raw.githubusercontent.com/blender/blender/main/intern/cycles/blender/camera.cpp
- API Python do Blender, `bpy_extras.anim_utils`: https://docs.blender.org/api/current/bpy_extras.anim_utils.html (nomes conferidos por sonda; a página não foi aberta nesta pesquisa)
- API Python, `Keyframe`, `TrackToConstraint`, `CameraDOFSettings`, `TimelineMarker`: https://docs.blender.org/api/current/ (conferidos por sonda no bpy 5.2.2)
- Notas de versão 4.4, Slotted Actions: https://developer.blender.org/docs/release_notes/4.4/upgrading/slotted_actions/
- Wikipedia, Hyperfocal distance: https://en.wikipedia.org/wiki/Hyperfocal_distance
- Wikipedia, Depth of field (círculo de confusão de 0,025 a 0,03 mm): https://en.wikipedia.org/wiki/Depth_of_field
- Wikipedia, Shutter angle (regra dos 180°): https://en.wikipedia.org/wiki/Shutter_angle
- Wikipedia, Twelve basic principles of animation (Thomas e Johnston, *The Illusion of Life*, 1981): https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation
- Capítulos internos: 05 (luz, rigs usados na prova), 09 (API do 5.x, pegadinhas), 10 (`movimento_qa.py`)
- Sondas e scripts deste capítulo: `/home/claude/codigo/camera/sondas/sonda_cam.py`, `sonda_2.py`, `sonda_3.py`, `/home/claude/codigo/camera/teste_rigs.py`, `/home/claude/codigo/movimento/velocidade_curvas.py`, `teste_motion_blur.py`, `transicoes.py`

## Pendências para o Claude Code

Receitas **[testar no Blender]** na máquina de referência (Blender 5.2 completo, RTX 3050):

1. Renderizar `prova_pushin_orbita.py` a 1080x1920 e checar foco no fim do push-in (f/4 contra f/8, seção 3.3 e 11).
2. EEVEE com desfoque forte: `bokeh_max_size` de 100 px limita o borrão de f/2,8 com 135 mm (120 px calculados)? Testar `use_bokeh_jittered` com 64 amostras.
3. Velocidades da tabela 4.1 e 4.2 em tela de celular, com o filme montado: órbita luxo a 8 a 15°/s com 85 mm parece lenta ou rápida?
4. Limite de estroboscopia (seção 4.3): acima de 10% da largura por quadro com shutter 0,5, o olho lê saltos?
5. Shutter animado por chave (whip pan com 1,0 só nos quadros da transição) no render de animação.
6. EEVEE com whip pan rotacional: quantos `motion_blur_steps` até sumir o borrão em linha reta (4, 6, 8)?
7. Zoom pela tela: diferença de brilho entre a interface vista no celular (vidro + AgX) e em tela cheia; meta abaixo de 2%.
8. Follow Path com pontos de espaçamento desigual: a velocidade fica irregular? Precisa de reparametrização?
9. `sensor_fit = 'VERTICAL'` para uma câmera servir 9:16 e 16:9 (seção 2.3): composição lateral aceitável?
10. Antecipação da seção 6.2: conferir se a troca de interpolação da chave compartilhada mantém o trecho anterior intacto.
11. Ângulo de visão das câmeras principais de celular (24 a 26 mm equivalente) para o "look de celular" **[não verificado]**.
12. Duração das transições de tela dos sistemas móveis (tabela 8) **[não verificado]**.

PENDÊNCIAS YOUTUBE: nenhum vídeo foi usado como fonte neste capítulo. Sugestões para estudo (não acessados): canal "Ducky 3D" (movimento de câmera e curvas em motion de produto), canal "School of Motion" (Graph Editor e curvas de velocidade, conceito aplicável ao Blender), canal "CG Boost" (rigs de câmera no Blender). Listas completas no capítulo 11.
