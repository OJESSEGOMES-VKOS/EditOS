# 05 · Luz (a cura número 1 do "sem vida")

> Alvo: Blender 5.2 (testes feitos no bpy 5.2.2 LTS, Cycles CPU e EEVEE, na nuvem). Código completo em `/home/claude/codigo/luz/`. Provas visuais em `/home/claude/provas/`.

Quando um filme de produto parece "teste de 3D", quase sempre a culpa é da luz antes de ser do modelo ou do material. Luz chapada (sem direção, sem contraste, sem contorno) faz um frasco de perfume de R$ 600 parecer um cilindro de plástico. Este capítulo ensina a montar a luz como um fotógrafo de produto monta o estúdio, com números que funcionam no Blender 5.2 e com o sinal de que deu errado.

Regra de leitura: cada rig tem tabela de valores para o frasco de 12 cm (referência), com a fórmula para converter para celular (15 cm) e notebook (30 cm). Os valores marcados **[testado no bpy 5.2.2 Cycles CPU, nuvem]** foram renderizados e medidos neste capítulo. Os que dependem do seu monitor ou da RTX 3050 estão marcados **[testar no Blender]**.

---

## 1. A prova antes de tudo: o que muda quando a luz é pensada

Cena idêntica nas duas imagens: frasco de vidro de 12 cm (raio 30 mm, chanfro de 3 mm com 4 segmentos), líquido âmbar (IOR 1,36), tampa de metal dourado (Metallic 1, Roughness 0,22), câmera de 85 mm a 0,62 m, 8° acima do centro, AgX.

| | Antes (luz "padrão") | Depois (rig deste capítulo) |
|---|---|---|
| Arquivo | `/home/claude/provas/luz_antes.png` | `/home/claude/provas/luz_depois.png` |
| Luz | 1 ponto de 30 W ao lado da câmera, World cinza 0,5 com força 1,0 | três pontos + contorno duplo + 2 cartões de reflexo + 2 bandeiras pretas + cartão de transluz + luz de fundo |
| Chão/fundo | plano cinza 0,6, colado no produto | fundo infinito cinza 0,035, parede a 0,45 m atrás do produto |
| Look | AgX, sem look | AgX, `AgX - Medium High Contrast` |
| Luminância média | 0,672 | 0,328 |
| Contraste (desvio padrão da luminância) | 0,082 | 0,171 |
| Estourado (pixels > 0,98) | 0,01% | 0,36% |
| Tempo (320x400, 64 amostras, OIDN, CPU nuvem) | 46 s | 39 s |

**[testado no bpy 5.2.2 Cycles CPU, nuvem]** Script: `/home/claude/codigo/luz/teste_antes_depois.py`.

O que a imagem "antes" mostra: o produto tem a mesma luminância do fundo, o vidro não tem borda, o líquido vira um borrão, a tampa não tem brilho com forma. O que o "depois" mostra: fundo que escurece em gradiente atrás do produto, duas linhas de luz definindo as bordas do vidro, o líquido aceso por trás (brilho âmbar no centro), tampa com reflexo de softbox e chão escuro com uma poça de luz quente na base.

### O caminho das iterações (aprenda com os erros, eles vão se repetir)

1. **Primeiro chute: 20,75% do quadro estourado.** O chão virou branco. Confirmou a calibração do Laboratório: o primeiro chute de energia sai cerca de 3 stops acima. Solução: energia × 0,2 a 0,35.
2. **Energia × 0,2: chão ainda claro demais.** A luz principal e o preenchimento atingiam o chão na frente do produto. Solução: light linking (seção 7), chave e preenchimento só no produto.
3. **Chão ainda claro, agora pelo brilho.** Os contornos por trás (azimute 140° a 150°) faziam um reflexo rasante no chão de aspereza 0,6. Solução: contornos também ligados só ao produto. Chão ficou escuro e elegante.
4. **Líquido virou mancha preta.** Com fundo escuro, o vidro e o líquido não têm o que refratar. Solução: cartão de transluz (emissivo, atrás do produto, invisível para a câmera e para o difuso).
5. **Cartão de transluz aparecia como retângulo duro.** Solução: degradê radial no cartão e cartão maior e mais longe (0,55 x 0,55 m a 0,35 m).
6. **Final:** energia × 0,35 do chute inicial, cartões de reflexo com emissão 12, transluz 2.

Lição que vale para qualquer produto: **escureça primeiro, depois acenda só o que precisa aparecer.** Luz boa de produto é mais sobre onde a luz não chega do que sobre onde ela chega.

---

## 2. Fundamentos rápidos com números

### 2.1 Relação de contraste chave:preenchimento (lighting ratio)

A relação de contraste mede quanto o lado iluminado do produto é mais claro que o lado da sombra. Na definição da ASC (American Society of Cinematographers), conta-se (chave + preenchimento) : preenchimento ([Wikipedia, Lighting ratio](https://en.wikipedia.org/wiki/Lighting_ratio)). Cada stop dobra a luz, então:

| Relação | Diferença em stops | O que comunica | Onde usar |
|---|---|---|---|
| 1:1 | 0 | nada; sem forma, "foto de documento" | só em catálogo técnico ou fundo branco de e-commerce |
| 2:1 | 1 | leve, amigável, limpo | cosmético claro, app, serviço, saúde, infantil, comida |
| 4:1 | 2 | profissional, com forma e volume | padrão de produto premium, eletrônico, bebida, notebook |
| 8:1 | 3 | dramático, luxo, mistério | perfume, relógio, whisky, revelação de logo escura, carro |
| 16:1 ou mais | 4+ | noir, quase silhueta | só no início de uma revelação (o produto "acende" depois) |

**Como medir no Blender sem fotômetro.** A iluminação que chega ao produto vem de P / d² (energia sobre distância ao quadrado) para fontes pequenas. No nosso rig: chave 6,3 W a 0,60 m dá 6,3 / 0,36 = 17,5; preenchimento 2,8 W a 0,80 m dá 2,8 / 0,64 = 4,4. Razão de 4:1, ou 2 stops. Isso vale para fontes do mesmo tipo e tamanho aproximado; com tamanhos muito diferentes, confirme no quadro (seção 12).

**Sinal de erro:** se o lado da sombra e o lado da luz parecem iguais no quadro, você está em 1:1 ou 2:1 sem querer. Se o lado da sombra some no fundo (preto puro, `AFUNDADO` no qa.py), você passou de 16:1.

### 2.2 Tamanho aparente da fonte e dureza da sombra

A dureza da sombra não depende do tamanho da luz em metros. Depende do **tamanho aparente**: o ângulo que a luz ocupa vista do produto. Ângulo = 2 × atan(tamanho / (2 × distância)).

| Fonte | Tamanho | Distância | Ângulo aparente | Sombra |
|---|---|---|---|---|
| Sol real | | | 0,53° | dura, borda de faca |
| Spot com raio 5 mm (rig duro) | 10 mm | 1,2 m | 0,5° | dura |
| Sol do Blender com `angle` 1,5° | | | 1,5° | dura com borda levemente macia |
| Faixa (strip) 4 cm de largura | 40 mm | 0,40 m | 5,7° na largura | dura numa direção, macia na outra |
| Chave do rig (0,40 x 0,55 m) | 0,47 m médio | 0,60 m | 43° | macia |
| Softbox de cima (0,60 m) | 0,60 m | 0,55 m | 57° | muito macia |

Regra prática: **abaixo de 3° a sombra é dura; acima de 20° é macia.** Para deixar a sombra mais macia sem mudar a energia, aproxime a luz (o ângulo cresce) e compense a energia pela lei do inverso do quadrado (2.3).

**Sinal de erro:** sombra dura num cosmético "suave" (luz pequena demais ou longe demais); ou produto sem nenhuma sombra de contato no chão (luz enorme e muito perto, tudo vira névoa).

No Blender: na luz de área, o tamanho é `size` e `size_y` (formas `SQUARE`, `RECTANGLE`, `DISK`, `ELLIPSE`); em ponto e spot é `shadow_soft_size` (o "Radius" da interface); no sol é `angle`. **[confirmado por sonda no bpy 5.2.2]**

### 2.3 Lei do inverso do quadrado na escala real

A intensidade que chega cai com o quadrado da distância ([Wikipedia, Inverse-square law](https://en.wikipedia.org/wiki/Inverse-square_law)). Dobrou a distância, a luz cai para 1/4 (2 stops). Isso explica três coisas que todo filme de produto precisa:

1. **Por que afastar o fundo escurece o fundo.** Chave a 0,60 m na frente do produto e fundo a 0,45 m atrás: o fundo fica a cerca de 1,05 m da luz. (1,05 / 0,60)² = 3,06, ou seja, 1,6 stop mais escuro que o produto sem mexer em nada. É por isso que o Laboratório afasta o fundo 1,2 a 1,4 vezes a escala.
2. **Por que a luz perto faz degradê no produto.** Com a chave a 0,30 m de um frasco de 12 cm, a frente do frasco (0,27 m) recebe (0,33 / 0,27)² = 1,5 vez mais luz que a parte de trás (0,33 m). Com a chave a 1,2 m, a diferença cai para 1,1 vez. Luz perto = degradê bonito e queda rápida; luz longe = uniforme e chapada.
3. **Por que mudar a escala do produto muda a energia.** Se você multiplica todas as distâncias por k, precisa multiplicar a energia por k² para manter a mesma exposição. Esta é a fórmula de conversão usada em todas as tabelas:

| Produto | Altura | k (fator de escala) | Distâncias e tamanhos | Energia |
|---|---|---|---|---|
| Frasco (referência) | 0,12 m | 1,00 | × 1,00 | × 1,00 |
| Celular em pé | 0,15 m | 1,25 | × 1,25 | × 1,56 |
| Notebook | 0,30 m | 2,50 | × 2,50 | × 6,25 |

A lei vale exatamente para fontes pontuais. Uma área grande muito perto (luz maior que a distância) cai mais devagar; trate os números como ponto de partida e confira o quadro.

**No Blender 5.x:** desde o 4.5 as luzes têm `normalize` (ligado por padrão: a potência não muda quando você escala a luz) e `exposure` (multiplicador em stops, útil para corrigir todas as luzes de uma vez) ([CG Channel, Blender 4.5](https://www.cgchannel.com/2025/07/blender-4-5-lts-is-out-check-out-its-5-key-features/)). Padrão da luz de área no 5.2.2: `energy` 10 W, `size` 0,25 m, `spread` 180° (π rad), `normalize` True, `exposure` 0. **[confirmado por sonda no bpy 5.2.2]**

### 2.4 Temperatura de cor (K) e contraste quente/frio

| Fonte | Temperatura | Sensação |
|---|---|---|
| Vela | 1.900 K | íntimo, romântico |
| Tungstênio (lâmpada de estúdio antiga) | 3.200 K | quente, aconchego, "noite em casa" |
| Fim de tarde | 3.500 a 4.500 K | dourado, nostalgia, premium |
| Flash e luz do dia ao meio-dia | 5.500 a 5.600 K | neutro, verdade, catálogo |
| Céu nublado | 6.500 a 7.000 K | frio, limpo, técnico |
| Sombra de céu azul | 8.000 a 10.000 K | gelado, tecnologia, madrugada |

Fonte da escala: [Wikipedia, Color temperature](https://en.wikipedia.org/wiki/Color_temperature).

No Blender 5.2: `light.use_temperature = True` e `light.temperature = 5600`. A cor final é `temperature_color` multiplicada por `color`, por isso deixe `color` em branco quando usar temperatura. **[confirmado por sonda no bpy 5.2.2]** A temperatura nativa nas luzes chegou no 4.5 ([CG Channel](https://www.cgchannel.com/2025/07/blender-4-5-lts-is-out-check-out-its-5-key-features/)).

O balanço de branco da "câmera" também existe no 5.2: `scene.view_settings.use_white_balance`, `white_balance_temperature` (padrão 6.500 K) e `white_balance_tint`. **[confirmado por sonda no bpy 5.2.2]** Use para corrigir o filme inteiro de uma vez, nunca para compensar luz mal escolhida.

**Contraste quente/frio com valores** (detalhado na seção 8): chave quente 4.300 a 5.200 K com contorno frio 6.500 a 8.000 K. Diferença mínima perceptível: cerca de 1.000 K. Diferença "de cinema": 2.000 a 3.500 K. Acima de 4.000 K de diferença, vira efeito (neon, ficção científica).

---

## 3. Como ler este capítulo: convenção de ângulos e a biblioteca

Todas as funções estão em `/home/claude/codigo/luz/rigs_luz.py`. Convenção:

- **Azimute 0°** = do lado da câmera (frente do produto). **90°** = direita do quadro. **180°** = atrás do produto. **-90° (270°)** = esquerda do quadro.
- **Elevação 0°** = altura do centro do produto. **90°** = em cima.
- **Distância** = do centro do produto até o centro da luz, em metros.
- A câmera fica em -Y olhando para +Y.

```text
              180° (atrás)
                  |
   -135°          |          135°
        \         |         /
         \     [PRODUTO]   /
-90° ------------ + ------------ 90°
 (esquerda)       |        (direita do quadro)
         /        |        \
        /         |         \
    -45°          |          45°
                  0°
              [CÂMERA]
```

A função básica:

```python
# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 | trecho de rigs_luz.py
def luz_area(nome, alvo, az, el, dist, energia, tamanho, tamanho_y=None,
             forma='RECTANGLE', kelvin=5600, spread_graus=180.0,
             ver_camera=False, col='LUZES'):
    dado = bpy.data.lights.new(nome, 'AREA')
    dado.shape = forma                 # SQUARE, RECTANGLE, DISK, ELLIPSE
    dado.size = tamanho
    dado.size_y = tamanho_y if tamanho_y else tamanho
    dado.energy = energia * FATOR_ENERGIA
    dado.use_temperature = True
    dado.temperature = kelvin
    dado.spread = math.radians(spread_graus)   # em radianos; padrão pi (180°)
    ob = bpy.data.objects.new(nome, dado)
    colecao(col).objects.link(ob)
    ob.location = pos_orbital(alvo, az, el, dist)
    mirar(ob, alvo)
    ob.visible_camera = ver_camera     # a luz aparece em reflexos, não no quadro direto
    return ob
```

**Spread (grade, "colmeia")** é o ângulo de abertura do feixe da luz de área. 180° espalha para todo lado; 60 a 75° concentra no produto e protege o fundo (calibração do Laboratório). Pense em spread como a colmeia (grid) da softbox real.

Todos os rigs abaixo foram renderizados juntos com `/home/claude/codigo/luz/teste_rigs.py` (frasco opaco 12 cm, tampa cromada, fundo infinito cinza 0,05, AgX Medium High Contrast, 24 amostras). Provas em `/home/claude/provas/rig_*.png`.

**Regra de energia por material [testado no bpy 5.2.2 Cycles CPU, nuvem]:** os valores das tabelas foram calibrados em vidro. Para produto **opaco e fosco** (plástico, papel, cerâmica), multiplique tudo por **0,5**. Sem isso, um vermelho (0,7; 0,25; 0,2 linear) virou rosa claro no AgX, que é o sinal clássico de estouro no AgX: a cor perde saturação antes de virar branco.

---

## 4. Os rigs de luz nomeados

### 4.1 Três pontos de produto (rig padrão)

```text
PLANTA BAIXA (vista de cima)                 [FUNDO a 0,45 m]
                         CONTORNO 150°, el 25°
                              ▮ (faixa fina, fria)
                    \
                     \
                    [FRASCO]
                   /        \
     CHAVE -45°, el 30°      PREENCHIMENTO 60°, el 10°
       ▭ (0,40 x 0,55)          ▭ (0,60 x 0,60)
                  [CÂMERA 0°]
```

| Luz | Tipo / forma | Tamanho (frasco) | Dist. | Az / el | Energia | Temp. | Spread |
|---|---|---|---|---|---|---|---|
| Chave | Área / RECTANGLE | 0,40 x 0,55 m | 0,60 m | -45° / 30° | 6,3 W | 5.200 K | 70° |
| Preenchimento | Área / RECTANGLE | 0,60 x 0,60 m | 0,80 m | 60° / 10° | 2,8 W | 5.500 K | 120° |
| Contorno | Área / RECTANGLE | 0,08 x 0,60 m | 0,55 m | 150° / 25° | 8,75 W | 6.500 K | 60° |

| Escala | Chave | Preenchimento | Contorno |
|---|---|---|---|
| Frasco 12 cm | 0,40 x 0,55 m a 0,60 m, 6,3 W | 0,60 m a 0,80 m, 2,8 W | 0,08 x 0,60 m a 0,55 m, 8,75 W |
| Celular 15 cm | 0,50 x 0,69 m a 0,75 m, 9,8 W | 0,75 m a 1,00 m, 4,4 W | 0,10 x 0,75 m a 0,69 m, 13,7 W |
| Notebook 30 cm | 1,00 x 1,38 m a 1,50 m, 39 W | 1,50 m a 2,00 m, 17,5 W | 0,20 x 1,50 m a 1,38 m, 55 W |

**[testado no bpy 5.2.2 Cycles CPU, nuvem]** no frasco de vidro (prova `luz_depois.png`) e em frasco opaco com energia × 0,5 (média 0,449, contraste 0,228, estourado 0,21%).

**Quando usar:** sempre como ponto de partida. Eletrônico, cosmético, bebida, embalagem.
**Por quê:** a chave dá forma (lado claro e lado escuro), o preenchimento controla a relação de contraste (aqui 4:1), o contorno separa o produto do fundo.
**Sinal de erro:** (a) chão claro na frente do produto: a chave está atingindo o chão, ligue o light linking ou suba a elevação para 40°; (b) contorno aparecendo como mancha no chão atrás: ligue o contorno só ao produto; (c) produto opaco com cor desbotada: energia × 0,5.

```python
# Blender 5.2 | status: testado no bpy 5.2.2 Cycles CPU, nuvem | /home/claude/codigo/luz/rigs_luz.py
def rig_tres_pontos(alvo, escala=0.12, kelvin_chave=5200):
    k = _k(escala)   # escala / 0.12
    chave = luz_area('Chave', alvo, -45, 30, 0.60 * k, 6.3 * k * k, 0.40 * k, 0.55 * k,
                     kelvin=kelvin_chave, spread_graus=70)
    preench = luz_area('Preenchimento', alvo, 60, 10, 0.80 * k, 2.8 * k * k, 0.60 * k, 0.60 * k,
                       kelvin=kelvin_chave + 300, spread_graus=120)
    contorno = luz_area('Contorno', alvo, 150, 25, 0.55 * k, 8.75 * k * k, 0.08 * k, 0.60 * k,
                        kelvin=kelvin_chave + 1300, spread_graus=60)
    return chave, preench, contorno
```

### 4.2 Softbox de cima (top light)

```text
VISTA LATERAL
            ▭▭▭▭ TOPO (0,60 x 0,60) el 85°, 0,55 m
              |
              v
           [FRASCO]
   ▭ FRENTE BAIXA el 5°, 1,0 m (só para levantar a frente)
[CÂMERA]
```

| Luz | Tipo / forma | Tamanho | Dist. | Az / el | Energia | Temp. | Spread |
|---|---|---|---|---|---|---|---|
| Topo | Área / RECTANGLE | 0,60 x 0,60 m | 0,55 m | 0° / 85° | 10,5 W | 5.600 K | 75° |
| Frente baixa | Área / RECTANGLE | 0,50 x 0,30 m | 1,00 m | 0° / 5° | 1,05 W | 5.600 K | 120° |

Celular: tudo × 1,25 em tamanho e distância, × 1,56 em energia. Notebook: × 2,5 e × 6,25. **[testado no bpy 5.2.2 Cycles CPU, nuvem]** (média 0,537, estourado 0,28%).

**Quando usar:** comida, bebida em copo, cosmético deitado, produto visto de cima (flat lay), tela de celular deitada (a softbox vira o reflexo retangular da tela).
**Por quê:** a luz de cima desenha o topo e cria sombra de contato curta e macia, que "assenta" o produto no chão. É a luz de mesa de restaurante e de vitrine.
**Sinal de erro:** a frente do produto fica preta (aumente a frente baixa para 2 W); olhos de "caveira" em embalagens com relevo (topo baixo demais, suba para 85° a 90°).

### 4.3 Contorno duplo (dual rim / kicker)

```text
PLANTA BAIXA
   RIM ESQ -140°          RIM DIR 140°
        ▮ \               / ▮
            \           /
              [FRASCO]
                 |
             [CÂMERA]
```

| Luz | Tipo / forma | Tamanho | Dist. | Az / el | Energia | Temp. | Spread |
|---|---|---|---|---|---|---|---|
| Rim esquerdo | Área / RECTANGLE | 0,06 x 0,60 m | 0,50 m | -140° / 20° | 7,7 W | 7.000 K | 50° |
| Rim direito | Área / RECTANGLE | 0,06 x 0,60 m | 0,50 m | 140° / 20° | 7,7 W | 7.000 K | 50° |

**[testado no bpy 5.2.2 Cycles CPU, nuvem]** com uma descoberta importante: sozinho, sem light linking, o contorno duplo deixou 12,45% do quadro afundado (frente do produto preta, o que é a intenção) mas acendeu o chão atrás como um holofote rasante. **Use sempre com light linking** (seção 7).

**Quando usar:** revelação no escuro, produto escuro em fundo escuro (fone preto, garrafa de vinho), começo de filme antes de a chave "acender".
**Por quê:** duas linhas de luz desenham a silhueta inteira. O olho lê a forma pelo contorno, mesmo sem ver a frente.
**Sinal de erro:** o chão ganha duas manchas brilhantes atrás do produto (falta light linking); o contorno some no meio do produto (a faixa está larga demais ou o azimute passou de 160°: reduza para 130° a 145°).

### 4.4 Fundo em gradiente (luz no fundo)

```text
VISTA LATERAL
                      PAREDE
                    .:░▒▓█▓▒░:.   (mancha clara atrás do produto)
                         ^
                         |  disco 0,25 m mirando para cima
          [FRASCO]   ◯ LUZ FUNDO (escondida atrás do produto, 5 mm acima do chão)
[CÂMERA]
```

| Luz | Tipo / forma | Tamanho | Posição | Mira | Energia | Temp. | Spread |
|---|---|---|---|---|---|---|---|
| Fundo | Área / DISK | 0,25 m | 0,25 m atrás do produto, rente ao chão | ponto da parede 7 cm acima do centro do produto | 2,1 W | 4.500 K | 90° |

`visible_camera = False`. **[testado no bpy 5.2.2 Cycles CPU, nuvem]** (média 0,663 com três pontos juntos; no vidro, com light linking, gerou o gradiente de `luz_depois.png`).

**Quando usar:** sempre que o fundo for escuro. É a diferença entre "objeto no vazio" e "objeto num estúdio".
**Por quê:** o halo claro atrás do produto separa a silhueta (o mesmo trabalho do contorno) e cria vinheta natural sem pós-produção.
**Sinal de erro:** halo com borda definida (aumente o tamanho do disco para 0,4 m ou afaste a luz da parede); halo maior que o quadro (spread 90° para 60°).

### 4.5 Estúdio infinito (cyc)

```text
VISTA LATERAL
       ▭▭▭▭▭ TETO 1,2 x 0,6 m, el 70°
                                    |  parede
                                    |
          [PRODUTO]               _/   curva com raio 0,15 m (sem quina)
 ___________________________________/   chão
[CÂMERA]
```

| Elemento | Valor (frasco) |
|---|---|
| Fundo infinito | chão + curva de raio 0,15 m + parede, parede a 0,45 m atrás do produto, 2,0 m de largura |
| Cor do fundo | cinza 0,5 (high key) ou 0,03 a 0,05 (low key); aspereza 0,6 |
| Teto | Área RECTANGLE 1,2 x 0,6 m, 0,9 m, 0° / 70°, 14 W (opaco: 7 W), 5.600 K, spread 100° |
| Lateral | Área RECTANGLE 0,6 x 0,8 m, 0,8 m, -60° / 25°, 4,9 W (opaco: 2,45 W), 5.200 K, spread 75° |

**[testado no bpy 5.2.2 Cycles CPU, nuvem]** com fundo 0,5 e energia × 0,5: média 0,771, contraste 0,060. É deliberadamente baixo: o cyc claro é um visual de catálogo.

**Quando usar:** e-commerce, ficha técnica, produto colorido que precisa ler a cor verdadeira, "versão catálogo" de um filme.
**Por quê:** a curva elimina a linha do horizonte; a luz grande e de cima simula o estúdio de fotografia branco.
**Sinal de erro:** é o problema nº 4 da base ("fundo padrão, sempre igual"). Se o filme inteiro está no cyc cinza, ele vai parecer teste de 3D. Use o cyc como uma cena, não como o mundo do filme. CHAPADO no medidor da nuvem (desvio padrão): abaixo de 0,14. Faixa do `qa.py` real: ver Laboratório (ver 00 · Padrões da casa).

### 4.6 Luz dura dramática

```text
PLANTA BAIXA
                       RIM 160°  ▮ (fino, frio)
                     /
            [FRASCO]
          /
   SPOT -70°, el 35°, 1,2 m
   ● raio 5 mm, cone 25°
                [CÂMERA]
```

| Luz | Tipo | Tamanho | Dist. | Az / el | Energia | Temp. | Feixe |
|---|---|---|---|---|---|---|---|
| Dura | Spot | `shadow_soft_size` 5 mm | 1,20 m | -70° / 35° | 120 W | 4.300 K | `spot_size` 25°, `spot_blend` 0,25 |
| Rim | Área RECTANGLE | 0,05 x 0,50 m | 0,60 m | 160° / 15° | 3,5 W | 6.500 K | spread 40° |

**[testado no bpy 5.2.2 Cycles CPU, nuvem]** (média 0,143, 49% do quadro abaixo de 0,02: intencional, é low key).

Atenção à energia do spot: no Blender, a potência do spot é calculada como se fosse um ponto que irradia para todos os lados; o cone só corta. Por isso o spot precisa de muito mais watts que a área para a mesma exposição. Conta de bolso: para igualar a chave de área (6,3 W a 0,6 m), um spot a 1,2 m precisa de cerca de 4π × 1,44 × 5,6 ≈ 100 W. **[testar no Blender]** se a regra se mantém no EEVEE.

**Quando usar:** relógio, ferramenta, faca, whisky, calçado de couro, "momento herói" de 1 a 2 s.
**Por quê:** sombra de faca e textura em relevo. A luz rasante (-70°) mostra cada risco do couro ou do metal escovado.
**Sinal de erro:** produto em silhueta total sem querer (falta o rim); sombra cortada por uma borda reta (o cone é estreito demais: `spot_size` de 25° para 35°).

### 4.7 Luz de janela com persiana (gobo)

```text
PLANTA BAIXA
                         CÉU 70° ▭ (azulado, 8.000 K)
                [FRASCO]
             ||||||||   <- persiana: 8 lâminas a 0,35 m do produto
           ☀ SOL -60°, el 35°
                [CÂMERA]
```

| Elemento | Valor |
|---|---|
| Sol | `SUN`, força 4 (W/m²), `angle` 1,5°, 4.800 K, direção -60° / 35° |
| Persiana (gobo) | 8 lâminas pretas, 0,5 m de largura x 3 mm de espessura, passo 35 mm, a 0,35 m do produto no caminho do sol, `visible_camera = False` |
| Céu (preenchimento) | Área 0,8 x 0,8 m, 0,9 m, 70° / 20°, 2,1 W, 8.000 K, spread 150° |

**[testado no bpy 5.2.2 Cycles CPU, nuvem]** (média 0,228; faixas nítidas no produto e no chão, ver `rig_janela.png`).

O Blender 5.2 não tem propriedade de gobo na luz (nenhuma propriedade com "gobo" no RNA da luz; **[confirmado por sonda no bpy 5.2.2]**). O gobo é geometria real entre a luz e o produto. Em Cycles também dá para fazer gobo com nós na própria luz (textura de imagem na emissão da luz) **[não verificado no 5.2]**.

**Quando usar:** "luz natural" (um dos 7 mundos do Laboratório), café, skincare, casa, serviço local, advocacia (escritório), manhã.
**Por quê:** faixas de luz contam "existe uma janela fora do quadro", dão lugar e hora sem modelar um cenário.
**Sinal de erro:** faixas borradas (sol com `angle` acima de 3°, ou persiana longe demais do produto: aproxime para 0,2 a 0,35 m); faixas atravessando o rótulo e escondendo a marca (gire o sol 10° até as faixas caírem fora do logo).

### 4.8 Luz de neon (emissivas + área colorida)

```text
PLANTA BAIXA
   NEON A -120°  |                 |  NEON B 120°
   (magenta)     |    [FRASCO]     |  (azul)
                 |                 |
   tubo 4 mm + área 0,02 x 0,5 colada no tubo
                     [CÂMERA]
```

| Elemento | Valor |
|---|---|
| Tubo A e B | cilindro raio 4 mm, 0,5 m de altura, a 0,35 m, az ±120°, el 5°; Emission Strength 1,0 a 2,0 (Laboratório calibrou 1,0 no mundo neon); quem ilumina é a área de 4,2 W (ver 00 · Padrões da casa) |
| Cor A | (1,0; 0,05; 0,45) magenta |
| Cor B | (0,05; 0,4; 1,0) azul |
| Área que ilumina de verdade | RECTANGLE 0,02 x 0,50 m a 0,33 m (logo à frente do tubo), 4,2 W, mesma cor, `use_temperature = False`, spread 120° |

**[testado no bpy 5.2.2 Cycles CPU, nuvem]** (média 0,112; contorno magenta de um lado e azul do outro, poças de cor no chão).

**Quando usar:** "neon noturno" (mundo do Laboratório), app de delivery noturno, games, música, bebida energética, tech.
**Por quê:** o tubo visível no quadro justifica a cor; a área faz o trabalho de iluminar sem ruído. Iluminar só com o tubo emissivo gera ruído (fireflies) em Cycles e luz fraca no EEVEE.
**Sinal de erro:** tubo branco no centro (Emission Strength alto demais com AgX: a cor saturada vira branco; mantenha 1,0 a 2,0); produto inteiro roxo (as duas cores se misturam na frente: aumente o azimute para ±130° e deixe a chave neutra fraca na frente).

### 4.9 Luz de faixa (strip lights) para cilindros e objetos brilhantes

```text
PLANTA BAIXA
  FAIXA ESQ -110°  ▮               ▮  FAIXA DIR 110°
                      [CILINDRO]
           ▮ FAIXA FRENTE -25° (estreita, fraca)
                      [CÂMERA]
```

| Luz | Tipo / forma | Tamanho | Dist. | Az / el | Energia | Temp. | Spread |
|---|---|---|---|---|---|---|---|
| Faixa esquerda | Área RECTANGLE | 0,04 x 0,70 m | 0,40 m | -110° / 5° | 4,2 W | 6.000 K | 60° |
| Faixa direita | Área RECTANGLE | 0,04 x 0,70 m | 0,40 m | 110° / 5° | 4,2 W | 6.000 K | 60° |
| Faixa frente | Área RECTANGLE | 0,03 x 0,70 m | 0,70 m | -25° / 10° | 1,4 W | 6.000 K | 60° |

**[testado no bpy 5.2.2 Cycles CPU, nuvem]** num cilindro cromado (média 0,290; duas linhas brancas verticais nas bordas e uma linha de assinatura perto do centro).

**Quando usar:** lata, garrafa, perfume, caneta, batom, fone, relógio, qualquer metal polido ou vidro.
**Por quê:** um cilindro brilhante não mostra a luz, mostra o **reflexo** da luz. Uma softbox quadrada vira uma mancha larga; uma faixa vira uma linha fina e longa que segue a altura do cilindro e define o volume.
**Sinal de erro:** linhas que não chegam ao topo e à base do produto (faixa curta: o comprimento precisa ser 5 a 6 vezes a altura do produto quando perto); linha muito grossa (faixa larga demais ou perto demais).

---

## 5. Cartões de reflexo e bandeiras pretas (o segredo das fotos de produto)

### 5.1 A física que manda: ângulo de incidência = ângulo de reflexão

Num material brilhante (vidro, metal, plástico laqueado, tela), a câmera não vê a luz que chega ao objeto. Ela vê **o que está refletido** nele. O ponto da superfície em que você quer um brilho é aquele cuja normal fica na bissetriz entre a direção da câmera e a direção do cartão. Na prática:

- Para um brilho **na borda** de um cilindro visto de frente, a normal da borda aponta para o lado (90°). A bissetriz de 0° (câmera) e do cartão precisa ser 90°, então o cartão fica perto de 180°, atrás e de lado. Na prática, entre 100° e 140°, porque o chanfro e a curvatura desviam a normal.
- Para um brilho **no centro** do cilindro, o cartão fica perto da câmera (0° a 25°).
- Para uma **tela de celular** inclinada 15° para trás, o cartão que aparece na tela fica 30° acima do eixo da câmera (o dobro da inclinação).

O guia de garrafas da Outshinery resume a lição dos fotógrafos: o preto profundo nas laterais de uma garrafa escura "não é preto de verdade; é a ausência de reflexo, criada por folhas pretas dos dois lados da garrafa" ([Outshinery](https://www.outshinery.com/articles/how-to-photograph-glass-bottle-without-reflections)). O mesmo guia trata a bandeira preta (negative fill) como a "arma secreta" do still de vidro. Veja também [ProPhotoStudio, glass](https://www.prophotostudio.net/blog/learning-center/why-photographing-glass-is-so-hard/) e [Elena Vels Studio](https://elenavelsstudio.com/how-to-shoot-reflective-products-without-the-hassle/).

### 5.2 Cartão branco (luz) e bandeira preta (sombra) no Blender

| Peça | O que é no Blender | Tamanho (frasco) | Posição | Material |
|---|---|---|---|---|
| Cartão de reflexo lateral | plano | 0,10 x 0,60 m | az ±100°, el 5°, 0,30 m | Emissão 12, degradê na largura (centro 100%, borda 0%) |
| Bandeira preta | plano | 0,12 x 0,60 m | az ±55°, el 5°, 0,28 m | Principled preto 0,002, Roughness 1, Specular IOR Level 0 |
| Cartão de transluz | plano | 0,55 x 0,55 m | az 180°, el 0°, 0,35 m | Emissão 2, degradê radial, cor (1,0; 0,92; 0,80) |

Para celular, × 1,25 em tamanho e distância; notebook × 2,5. A emissão do cartão não muda com a escala (é brilho de superfície, não potência). **[testado no bpy 5.2.2 Cycles CPU, nuvem]** na prova `luz_depois.png`.

**Tamanho do cartão:** o reflexo ocupa no produto mais ou menos a mesma fração que o cartão ocupa do "céu" visto pelo produto. Cartão de 10 cm a 30 cm faz uma linha fina num frasco; cartão de 30 cm a 30 cm faz uma faixa larga. Comece fino; faixa larga demais "lava" o vidro.

**Degradê no cartão:** o cartão uniforme faz uma linha com borda dura (parece adesivo). O degradê imita o difusor de uma softbox real: centro forte, bordas que somem. No código, `material_emissivo(..., gradiente=True, modo='X')` para faixa e `modo='RADIAL'` para transluz. Detalhe que custou uma iteração: as coordenadas Object de um plano padrão vão de -0,5 a 0,5, então o Map Range tem `From Max` 0,5, não 1,0.

### 5.3 Tornar invisível para a câmera (Ray Visibility) no 5.2

Propriedades no objeto, **[confirmado por sonda no bpy 5.2.2]**:

| Propriedade Python | Na interface (Object > Visibility > Ray Visibility) | Para o cartão | Para a bandeira |
|---|---|---|---|
| `visible_camera` | Camera | False | False |
| `visible_diffuse` | Diffuse | True (False no transluz, para não acender o chão) | True |
| `visible_glossy` | Glossy | True (é o reflexo que queremos) | True |
| `visible_transmission` | Transmission | True (aparece através do vidro) | True |
| `visible_volume_scatter` | Volume Scatter | True | True |
| `visible_shadow` | Shadow | False (o cartão não deve sombrear o produto) | False |
| `is_holdout`, `is_shadow_catcher` | Holdout, Shadow Catcher | não usar | não usar |

Fonte de conceito: [Blender Artists, objeto invisível que aparece no reflexo](https://blenderartists.org/t/how-do-i-make-objectcast-reflections-but-the-object-itself-is-invisible/1193086) e o manual de visibilidade de objeto do Cycles ([manual](https://docs.blender.org/manual/en/latest/render/cycles/object_settings/object_data.html)). No EEVEE, as luzes ganharam opções de visibilidade de raio no 4.2 ([notas 4.2 EEVEE](https://developer.blender.org/docs/release_notes/4.2/eevee/)); se `visible_camera` em objetos é respeitado pelo EEVEE do mesmo jeito que no Cycles **[testar no Blender]**.

```python
# Blender 5.2 | status: testado no bpy 5.2.2 Cycles CPU, nuvem | /home/claude/codigo/luz/rigs_luz.py
def cartoes_reflexo(alvo, escala=0.12, forca=12.0, gradiente=True):
    k = _k(escala)
    mat = material_emissivo('CartaoMat', (1, 1, 1), forca, gradiente=gradiente)
    a = plano('CartaoEsq', alvo, -100, 5, 0.30 * k, 0.10 * k, 0.60 * k, mat)
    b = plano('CartaoDir', alvo, 100, 5, 0.30 * k, 0.10 * k, 0.60 * k, mat)
    return a, b

def bandeiras_pretas(alvo, escala=0.12, az=(-55, 55), dist=0.28):
    k = _k(escala)
    preto = material_preto()
    return [plano(f'Bandeira{i}', alvo, a, 5, dist * k, 0.12 * k, 0.60 * k, preto, col='BANDEIRAS')
            for i, a in enumerate(az)]

def cartao_transluz(alvo, escala=0.12, forca=2.0, kelvin_cor=(1.0, 0.92, 0.80)):
    k = _k(escala)
    mat = material_emissivo('TransluzMat', kelvin_cor, forca, gradiente=True, modo='RADIAL')
    c = plano('CartaoTransluz', alvo, 180, 0, 0.35 * k, 0.55 * k, 0.55 * k, mat)
    c.visible_diffuse = False   # não acende o chão atrás: só aparece através do vidro
    return c
```

(A função `plano` já faz `visible_camera = False` e `visible_shadow = False`.)

### 5.4 Receita por tipo de produto brilhante

| Produto | Cartões | Bandeiras | Observação |
|---|---|---|---|
| Frasco de vidro transparente | 2 laterais ±100° + transluz 180° | 2 a ±55° | sem transluz, líquido em fundo escuro vira mancha |
| Garrafa de vidro escuro (vinho) | 2 faixas ±110° finas | 2 a ±60° coladas | o corpo fica preto, só as linhas desenham |
| Lata de alumínio | 2 faixas ±110° + 1 frente -25° | nenhuma ou 1 | metal precisa de algo para refletir em todo o corpo |
| Celular (tela preta brilhante) | 1 cartão grande acima da câmera (el 30° se a tela inclina 15°) | 1 grande atrás da câmera | o cartão vira o degradê da tela apagada |
| Relógio cromado | 1 faixa frente + 1 cartão de cima | 2 laterais | o cromo "é" o ambiente: sem cartões ele vira preto |
| Notebook (tampa de alumínio) | 1 cartão 1,0 x 0,25 m acima e atrás | 1 abaixo | linha de luz na borda da tampa |

**Sinal de erro geral:** vidro "leitoso" e sem borda (faltam bandeiras pretas); metal preto ou sujo (nada para refletir: falta cartão); cartão aparecendo no quadro (esqueceu `visible_camera = False`); sombra estranha no produto (esqueceu `visible_shadow = False`).

---

## 6. HDRI + luzes de área

### 6.1 Quando usar HDRI

HDRI é uma foto 360° com alta faixa dinâmica usada como ambiente. Para produto, ela serve para três coisas, em ordem de importância: **reflexo** rico em metal e vidro, **preenchimento** suave do ambiente, e raramente **luz principal** (só em cena "externa" realista).

Fonte recomendada: [Poly Haven HDRIs](https://polyhaven.com/hdris), licença **CC0**: uso comercial permitido, sem obrigação de crédito ([licença Poly Haven](https://polyhaven.com/license)). Para estúdio, procure HDRIs de estúdio com softboxes (busque "studio" no Poly Haven) em resolução 2K a 4K; 1K basta se o HDRI só aparece em reflexo desfocado.

| Uso | Força do Background | Rotação | Visível na câmera |
|---|---|---|---|
| Só reflexo (produto premium) | 0,3 a 0,8 para raios de brilho; 0,1 a 0,2 no difuso | girar até a softbox do HDRI cair na borda do produto | não (cor sólida escura) |
| Preenchimento de ambiente | 0,2 a 0,5 | girar para a área mais clara ficar do lado da chave | não |
| Cena externa realista | 1,0 | sol do HDRI alinhado com a sombra que você quer | sim, desfocado |

A rotação se faz no nó Mapping (eixo Z). Gire em passos de 15° e olhe o reflexo no produto, não o fundo.

### 6.2 HDRI só para reflexo: dois caminhos no 5.2

**Caminho A, sem nós (Cycles):** World > Ray Visibility. **[confirmado por sonda no bpy 5.2.2]** `world.cycles_visibility` tem `camera`, `diffuse`, `glossy`, `transmission`, `scatter`. Desligue `camera` (fundo some) e `diffuse` (HDRI não ilumina o difuso), deixe `glossy` e `transmission` ligados.

```python
w = bpy.context.scene.world
v = w.cycles_visibility
v.camera, v.diffuse, v.glossy, v.transmission = False, False, True, True
```

Limite: é tudo ou nada. Não dá para "um pouco de difuso".

**Caminho B, Light Path (Cycles e EEVEE):** o nó Light Path tem as saídas `Is Camera Ray`, `Is Glossy Ray`, `Is Diffuse Ray`, `Is Transmission Ray` e outras **[confirmado por sonda no bpy 5.2.2]**. Mistura três Backgrounds: um forte para brilho, um fraco para difuso e uma cor sólida para a câmera. Técnica descrita em [Meshlogic, exposição correta de HDRI](https://meshlogic.github.io/posts/blender/rendering/nodes-correct-hdri/) e no [manual do nó Light Path](https://docs.blender.org/manual/en/latest/render/shader_nodes/input/light_path.html).

```python
# Blender 5.2 | status: nomes de nós e saídas confirmados por sonda no bpy 5.2.2; render com HDRI a testar
def mundo_hdri_reflexo(caminho_hdri, forca_reflexo=0.6, forca_luz=0.15, rot_graus=0,
                        cor_fundo=(0.02, 0.02, 0.022)):
    w = bpy.context.scene.world or bpy.data.worlds.new('World')
    bpy.context.scene.world = w
    if w.node_tree is None:
        w.use_nodes = True
    nt = w.node_tree; nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputWorld')
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Rotation'].default_value[2] = math.radians(rot_graus)
    env = nt.nodes.new('ShaderNodeTexEnvironment')
    env.image = bpy.data.images.load(caminho_hdri, check_existing=True)
    lp = nt.nodes.new('ShaderNodeLightPath')
    bg_luz = nt.nodes.new('ShaderNodeBackground'); bg_luz.inputs['Strength'].default_value = forca_luz
    bg_ref = nt.nodes.new('ShaderNodeBackground'); bg_ref.inputs['Strength'].default_value = forca_reflexo
    bg_cam = nt.nodes.new('ShaderNodeBackground'); bg_cam.inputs['Color'].default_value = (*cor_fundo, 1)
    mix_ref = nt.nodes.new('ShaderNodeMixShader'); mix_cam = nt.nodes.new('ShaderNodeMixShader')
    L = nt.links.new
    L(tc.outputs['Generated'], mp.inputs['Vector']); L(mp.outputs['Vector'], env.inputs['Vector'])
    L(env.outputs['Color'], bg_luz.inputs['Color']); L(env.outputs['Color'], bg_ref.inputs['Color'])
    L(lp.outputs['Is Glossy Ray'], mix_ref.inputs['Fac'])
    L(bg_luz.outputs[0], mix_ref.inputs[1]); L(bg_ref.outputs[0], mix_ref.inputs[2])
    L(lp.outputs['Is Camera Ray'], mix_cam.inputs['Fac'])
    L(mix_ref.outputs[0], mix_cam.inputs[1]); L(bg_cam.outputs[0], mix_cam.inputs[2])
    L(mix_cam.outputs[0], out.inputs['Surface'])
    return w
```

Observação: `World.use_nodes` gera DeprecationWarning no 5.2 ("expected to be removed in Blender 6.0"). O world padrão já vem com `node_tree`, então o código só liga `use_nodes` se a árvore não existir. **[confirmado por sonda no bpy 5.2.2]**

**EEVEE e HDRI:** desde o 4.2, o EEVEE extrai automaticamente a contribuição de sol do HDRI ("Sun light contribution is now automatically extracted from HDRI lighting", [notas 4.2 EEVEE](https://developer.blender.org/docs/release_notes/4.2/eevee/)). No 5.2 os controles estão em `world.sun_threshold`, `sun_angle`, `use_sun_shadow` **[confirmado por sonda no bpy 5.2.2]**. Se o HDRI de estúdio gerar uma sombra dura estranha no EEVEE, suba `sun_threshold` para não extrair sol. Como o EEVEE trata o truque de Light Path (que é pensado para traçado de raio) **[testar no Blender]**.

**Sinal de erro:** produto com reflexo de céu azul e árvores num filme de estúdio (HDRI externo usado como reflexo de produto); sombras em duas direções (HDRI com sol + sua chave: escolha um).

---

## 7. Light linking no Blender 5.x

### 7.1 O que é e onde funciona

Light linking faz uma luz iluminar só os objetos que você escolher. Shadow linking escolhe quais objetos projetam sombra daquela luz. Chegou no **Cycles no 4.0**: "With light linking, lights can be set to affect only specific objects in the scene. Shadow linking additionally gives control over which objects acts as shadow blockers for a light" ([notas 4.0 Cycles](https://developer.blender.org/docs/release_notes/4.0/cycles/); discussão de design em [devtalk](https://devtalk.blender.org/t/cycles-light-and-shadow-linking/29587)). Chegou no **EEVEE no 4.3**, com luzes convencionais e materiais emissivos, incluindo shadow linking ([Blender 4.3](https://www.blender.org/download/releases/4-3/), [CG Channel 4.3](https://www.cgchannel.com/2024/11/5-key-features-in-blender-4-3/), [PR #127514](https://projects.blender.org/blender/blender/pulls/127514)). Manual: [Light Linking](https://docs.blender.org/manual/en/latest/render/lights/light_linking.html).

**[testado no bpy 5.2.2, nuvem]** Duas esferas, uma luz de área ligada só à esfera da direita: Cycles 0,225 (esquerda, só ambiente) contra 0,812 (direita); EEVEE 0,199 contra 0,812. Funciona nos dois motores.

### 7.2 A API (confirmada por sonda)

No objeto da luz (ou do emissor): `obj.light_linking.receiver_collection` (quem recebe luz) e `obj.light_linking.blocker_collection` (quem bloqueia, isto é, faz sombra). **[confirmado por sonda no bpy 5.2.2]**

A coleção não precisa estar ligada à cena; ela é só uma lista. Dentro dela, cada item pode ser incluído ou excluído (na interface, o ícone de checagem ao lado do objeto; "Toggle the checkbox to invert the effect", [Blender 4.3](https://www.blender.org/download/releases/4-3/)). O nome Python do estado por item: `colecao.collection_objects[i].light_linking.link_state`, com `'INCLUDE'` ou `'EXCLUDE'` (tipo `CollectionLightLinking`) **[confirmado por sonda no bpy 5.2.2]**. Os objetos são de `colecao.objects`; o estado mora em `colecao.collection_objects`, na mesma ordem.

```python
# Blender 5.2 | status: testado no bpy 5.2.2 Cycles CPU e EEVEE, nuvem | rigs_luz.py
def contorno_so_no_produto(luz_obj, objetos_produto, nome='SoProduto'):
    col = bpy.data.collections.get(nome) or bpy.data.collections.new(nome)
    for o in objetos_produto:
        if o.name not in col.objects:
            col.objects.link(o)
    luz_obj.light_linking.receiver_collection = col
    return col
```

### 7.3 Usos práticos com números

| Problema | Ligação | Resultado medido |
|---|---|---|
| Chave acende o chão na frente | chave e preenchimento → receptor = produto | chão caiu de branco para cinza escuro (prova, iteração 2) |
| Contorno faz mancha no chão | contorno e rims → receptor = produto | média do quadro 0,508 → 0,227 (iteração 3), contraste vira "luxo escuro" |
| Logo emissivo ilumina o produto e mancha a cor | emissor do logo → receptor = só o fundo | **[testar no Blender]** |
| Cartão de reflexo faz sombra | não precisa de linking: `visible_shadow = False` | |
| Personagem/mão com sombra do produto feia | shadow linking: bloqueador sem a mão | **[testar no Blender]** |

**Sinal de erro:** produto sem sombra de contato no chão depois do linking (era esperado: o chão não recebe a chave, então não tem sombra dela). Solução: deixe uma luz fraca não ligada (a luz de fundo ou o topo a 1 W) para o chão ter a sombra de contato, ou use um Shadow Catcher só para a sombra.

---

## 8. Contraste de temperatura quente/frio com valores

| Receita | Chave | Preenchimento | Contorno / fundo | Δ K | Comunica |
|---|---|---|---|---|---|
| Neutro premium | 5.200 K | 5.500 K | 6.500 K | 1.300 | verdade, tecnologia limpa |
| Pôr do sol | 3.800 K | 6.500 K (céu) | 7.500 K | 3.700 | nostalgia, lifestyle, café |
| Luxo quente | 3.200 K | nenhum (bandeira) | 4.500 K fundo | 1.300 | whisky, couro, perfume amadeirado |
| Tech frio | 6.500 K | 7.000 K | 9.000 K + acento magenta | 2.500 | app, SaaS, fintech à noite |
| Janela de manhã | 4.800 K (sol) | 8.000 K (céu) | | 3.200 | casa, skincare, serviço local |
| Teal and orange | 3.500 K | | 9.000 K | 5.500 | cinema de ação; use só em vinheta curta |

Regras:
1. **A pele e a comida pedem chave quente** (3.500 a 4.800 K). Chave fria em comida = comida velha.
2. **Tecnologia aguenta chave neutra e contorno frio.** Tela de app deve ficar em 6.500 K aparente (o branco da tela é o branco da marca).
3. **Uma cor domina.** Quente e frio em proporção 70/30 ou 80/20 de área do quadro. Meio a meio vira "luz de boate" sem intenção.
4. **No AgX, temperaturas extremas desaturam no brilho.** Um contorno de 9.000 K forte vira branco azulado; se precisar de azul de verdade, use `color` em vez de temperatura e energia menor.

**Sinal de erro:** produto branco que parece amarelado em todos os quadros (chave quente demais sem contraponto frio; adicione contorno 2.000 K mais frio ou use `white_balance_temperature` para neutralizar o filme); embalagem com cor de marca "errada" (a temperatura da chave tingiu a cor: chave em 5.500 K nos quadros de pack shot).

---

## 9. Volumétrico: feixe de luz na névoa sem estourar o tempo

### 9.1 A regra da densidade (o número da tarefa precisa de tradução)

A densidade do volume é por metro. O que o olho vê é a **profundidade óptica**: densidade × comprimento do caminho da luz dentro da névoa. Uma densidade de 0,01 a 0,05 é a faixa certa para uma sala de 5 a 20 m (profundidade 0,05 a 1,0). Na escala de mesa, com o feixe atravessando 0,3 a 0,6 m de névoa, a mesma profundidade óptica pede densidade 10 vezes maior.

| Escala da cena | Caminho do feixe | Densidade inicial | Visual |
|---|---|---|---|
| Sala, palco, carro (5 a 20 m) | 5 a 10 m | 0,01 a 0,05 | ar levemente denso |
| Produto médio, notebook (1 a 2 m) | 1 a 1,5 m | 0,1 a 0,3 | feixe visível, fundo limpo |
| Produto pequeno, frasco (cena de 1,2 m) | 0,5 a 0,8 m | **0,3 a 1,0** | 0,3 = feixe sutil; 1,0 = feixe forte |

**[testado no bpy 5.2.2 Cycles CPU e EEVEE, nuvem]** Cubo de 1,2 m com Principled Volume, anisotropia 0,6, spot de 60 W a 0,6 m (az 150°, el 55°, cone 20°): densidade 0,3 deu feixe sutil e elegante; 1,0 deu feixe forte e escureceu o quadro em 15% (média 0,215 → 0,181 no Cycles). Provas: `/home/claude/provas/vol_*.png`. Script: `/home/claude/codigo/luz/teste_volume.py`.

### 9.2 Onde colocar a névoa: cubo, não World

| Opção | Vantagem | Custo |
|---|---|---|
| Principled Volume num **cubo** que envolve a cena | controle de onde há névoa; a câmera pode ficar fora; fundo infinito continua limpo | baixo |
| Volume no **World** | cobre tudo, inclusive o infinito | alto; no EEVEE, desde o 4.2 o volume do World não tem mais limite de distância e pode "bloquear totalmente o sol e o fundo" ([notas 4.2 EEVEE](https://developer.blender.org/docs/release_notes/4.2/eevee/)) |

Entradas do Principled Volume no 5.2.2: Color, Density, Anisotropy, Absorption Color, Emission Strength, Emission Color, Blackbody Intensity, Blackbody Tint, Temperature. Volume Scatter no 5.2.2 tem Color, Density, Anisotropy e novos modelos de fase em `phase`: `HENYEY_GREENSTEIN`, `FOURNIER_FORAND`, `DRAINE`, `RAYLEIGH`, `MIE`. **[confirmado por sonda no bpy 5.2.2]** Manual: [Principled Volume](https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/volume_principled.html).

**Anisotropia** controla para onde a névoa espalha a luz: 0 espalha igual para todo lado; 0,5 a 0,8 espalha para a frente, o feixe fica muito mais visível quando a luz vem **de trás em direção à câmera** (contraluz). Por isso o feixe de teste está em azimute 150°. Com luz vindo de frente (az 0° a 45°), use anisotropia 0 a 0,2 ou o feixe quase some.

```python
# Blender 5.2 | status: testado no bpy 5.2.2 Cycles CPU e EEVEE, nuvem | rigs_luz.py
def nevoa_no_cubo(alvo, escala=0.12, densidade=0.3, anisotropia=0.6, tamanho=None):
    k = _k(escala)
    tamanho = tamanho or 2.0 * k
    bpy.ops.mesh.primitive_cube_add(size=tamanho, location=alvo)
    cubo = bpy.context.active_object; cubo.name = 'Nevoa'
    m = bpy.data.materials.new('NevoaMat')
    if m.node_tree is None:
        m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    v = nt.nodes.new('ShaderNodeVolumePrincipled')
    v.inputs['Density'].default_value = densidade
    v.inputs['Anisotropy'].default_value = anisotropia
    nt.links.new(v.outputs[0], out.inputs['Volume'])
    cubo.data.materials.append(m)
    return cubo
```

### 9.3 EEVEE volumetrics no 5.2 (nomes confirmados)

Em `scene.eevee` **[confirmado por sonda no bpy 5.2.2]**, com o valor padrão entre parênteses:

| Propriedade | Padrão | Recomendado para produto | Por quê |
|---|---|---|---|
| `volumetric_tile_size` | '8' | '4' no render final, '8' ou '16' no teste | tile menor = feixe com borda mais nítida, mais memória |
| `volumetric_samples` | 64 | 64 a 128 | menos amostras = feixe em degraus |
| `volumetric_sample_distribution` | | 0,8 | concentra amostras perto da câmera |
| `volumetric_start` / `volumetric_end` | 0,1 / 100 m | 0,1 / 3 m na escala de mesa | intervalo curto = resolução melhor onde importa |
| `use_volumetric_shadows` | **False** | **True** | sem isso o produto não corta o feixe (some o efeito "raio de luz") |
| `volumetric_shadow_samples` | | 16 a 32 | |
| `volumetric_ray_depth` | 16 | manter | |
| `volumetric_light_clamp` | 0 | 0 ou 10 se aparecer pontos estourados | |

Cada luz tem `volume_factor` (quanto ela participa do volume) **[confirmado por sonda no bpy 5.2.2]**. Truque de produção: deixe `volume_factor = 0` na chave e no preenchimento e 1,0 só na luz do feixe. Assim só o feixe "desenha" a névoa, e o resto do quadro fica limpo.

O EEVEE do 4.2 em diante também dilui o volume para evitar tremulação ("Volume lighting is now dithered to avoid flickering") e calcula interseção correta de malhas em vez de caixas ([notas 4.2 EEVEE](https://developer.blender.org/docs/release_notes/4.2/eevee/)).

### 9.4 Cycles: o novo algoritmo do 5.0 e o custo

O Cycles 5.0 trocou o algoritmo de volume por um baseado em "null scattering", agora padrão, sem viés e sem os artefatos em bloco de volumes sobrepostos ([notas 5.0 Cycles](https://developer.blender.org/docs/release_notes/5.0/cycles/)). Configurações em `scene.cycles` no 5.2.2: `volume_bounces`, `volume_step_rate`, `volume_max_steps`, `volume_biased`, `use_volume_guiding`, `volume_guiding_probability`. **[confirmado por sonda no bpy 5.2.2]** (`volume_step_rate` padrão 1,0; `volume_max_steps` padrão 1024).

**Custo medido [testado no bpy 5.2.2 Cycles CPU, nuvem]:** 200x250, 24 amostras: sem névoa 4,4 s; névoa 0,3 = 9,5 s (2,2 vezes); névoa 1,0 = 8,3 s. O tempo do EEVEE na nuvem roda sem GPU e não serve de referência.

**Estimativa para a RTX 3050 Laptop [testar no Blender]:** o Laboratório mediu ~7 s/quadro em Cycles com vidro a 540x960. Com névoa em cubo, espere 2 a 2,5 vezes: 15 a 18 s/quadro. Um filme de 15 s (450 quadros) sobe de ~53 min para ~2 h. No EEVEE (0,37 s/quadro a 540x960), volumetria com tile 8 deve ficar abaixo de 1 s/quadro.

Regras para não estourar o tempo:
1. Névoa só no cubo, nunca no World.
2. `volume_bounces = 0` no Cycles (o espalhamento múltiplo quase não aparece numa névoa tênue).
3. Feixe em EEVEE e produto em Cycles? Não misture motores no mesmo quadro. Escolha EEVEE para filmes com muita névoa.
4. Teste em 25% da resolução e 16 amostras; o feixe aparece igual.

**Sinal de erro:** névoa cinza leitosa cobrindo o produto (densidade alta e anisotropia 0: suba a anisotropia para 0,6 e baixe a densidade); feixe sem borda (no EEVEE, `use_volumetric_shadows` desligado ou tile 16); feixe com degraus (tile grande ou poucas amostras).

---

## 10. Luz contando a história

Luz parada em filme de 15 s é luz de catálogo. A luz deve acompanhar o arco: mistério, revelação, prova, assinatura. Os exemplos abaixo usam 30 fps (1 s = 30 quadros).

### 10.1 O arco em quatro atos (filme de 15 s, 450 quadros)

| Ato | Quadros | Luz | Valores |
|---|---|---|---|
| 1. Mistério | 1 a 45 (0 a 1,5 s) | só contorno duplo, chave em 5% | rims 140% da energia normal; chave 0,3 W; relação além de 16:1 |
| 2. Revelação | 45 a 60 (0,5 s) | chave "acende" e esfria | chave de 5% para 100% em 15 quadros; 3.200 K → 5.200 K |
| 3. Prova (detalhes) | 60 a 360 (10 s) | chave estável, faixa de brilho percorre o produto | faixa frontal de az -40° para -10° em 300 quadros (o brilho "passeia" pelo vidro) |
| 4. Assinatura | 360 a 450 (3 s) | fundo sobe, produto mantém | luz de fundo de 2,1 W para 4 W em 30 quadros; logo entra |

### 10.2 Por que esses números

- **15 quadros (0,5 s) para acender:** mais rápido que 8 quadros parece flash de erro; mais lento que 30 quadros perde o impacto. 15 é um "respiro" visível.
- **Esfriar de 3.200 K para 5.200 K ao acender:** a luz quente do mistério vira a luz "verdadeira" do produto. O olho lê como "agora você está vendo direito".
- **Rims caindo de 140% para 100%:** quando a chave entra, o contorno não precisa mais carregar a silhueta. Manter 140% depois da revelação estoura as bordas.
- **Brilho que passeia:** mover a luz (ou o cartão de reflexo) e não a câmera é o truque clássico de produto parado que parece vivo. 30° em 10 s é lento o bastante para não chamar atenção.

### 10.3 Código (com a API de animação do 5.x)

```python
# Blender 5.2 | status: testado no bpy 5.2.2 (keyframes avaliados por frame_set), nuvem | rigs_luz.py
def chave(dado, prop, quadro, valor):
    setattr(dado, prop, valor)
    dado.keyframe_insert(data_path=prop, frame=quadro)

def acender_na_revelacao(luz_chave, luz_contorno, q_inicio=1, q_revela=45, q_fim=90):
    L, R = luz_chave.data, luz_contorno.data
    e_chave, e_rim = L.energy, R.energy
    chave(L, 'energy', q_inicio, e_chave * 0.05)
    chave(L, 'energy', q_revela, e_chave * 0.05)
    chave(L, 'energy', q_revela + 15, e_chave)
    chave(L, 'temperature', q_revela, 3200)
    chave(L, 'temperature', q_revela + 15, 5200)
    chave(R, 'energy', q_inicio, e_rim * 1.4)
    chave(R, 'energy', q_revela + 15, e_rim)
    chave(R, 'energy', q_fim, e_rim)
```

**Verificação [testado no bpy 5.2.2, nuvem]:** quadro 1 = 0,31 W e 3.200 K; quadro 45 = 0,31 W; quadro 52 = 3,01 W e 4.100 K; quadro 60 = 6,3 W e 5.200 K. As f-curves ficam no channelbag (`anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot).fcurves`), não em `action.fcurves`, que não existe no 5.x.

Para a curva de acender, troque a interpolação do keyframe 45 por saída lenta e entrada rápida (ease in) para dar sensação de "ligar a chave"; ou use `CONSTANT` para um corte seco tipo interruptor. A curva padrão Bezier funciona, mas é a escolha "de software" (problema nº 7 da base).

### 10.4 Outros movimentos de luz que funcionam

| Movimento | Valores (30 fps) | Uso |
|---|---|---|
| Varredura de brilho (light sweep) | faixa de 0,04 m passa de az -60° a +60° em 20 quadros | revelação de logo cromado, tela de celular |
| Respiro | energia da chave ±8% em ciclo de 90 quadros | produto parado em plano longo (para não parecer congelado) |
| Nascer do sol | sol de el 5° para 25° e 3.000 K para 4.800 K em 150 quadros | bebida, café, skincare |
| Pulso de neon | Emission Strength 2,0 → 1,0 → 2,0 em 4 quadros, 2 vezes, irregular | noturno, games |
| Apagar para a assinatura | tudo menos o fundo cai para 20% em 12 quadros | fim de filme com logo |

**Sinal de erro:** luz mudando sem motivo visível no roteiro (parece bug de render); flicker por animar `exposure` e `energy` ao mesmo tempo em direções opostas; temperatura animada em luz com `use_temperature = False` (não faz nada).

---

## 11. Exposição e AgX

### 11.1 O que é o AgX

AgX é a transformação de visualização (view transform) padrão desde o Blender 4.0, substituindo o Filmic. Ela comprime a faixa dinâmica da cena (luz real, sem teto) para a tela (0 a 1), fazendo cores muito brilhantes caminharem para o branco como num filme fotográfico, com "melhor tratamento de cor em áreas superexpostas que o Filmic" ([notas 4.0 color management](https://developer.blender.org/docs/release_notes/4.0/color_management/); detalhes técnicos em [PR #106355](https://projects.blender.org/blender/blender/pulls/106355)). Manual: [Color Management](https://docs.blender.org/manual/en/latest/render/color_management.html).

A cena nasce em AgX no 5.2.2 (`view_transform = 'AgX'`, `look = 'None'`). **[confirmado por sonda no bpy 5.2.2]**

### 11.2 Nomes exatos no 5.2.2

**View transforms disponíveis:** `Standard`, `ACES 1.3`, `ACES 2.0`, `Khronos PBR Neutral`, `AgX`, `Filmic`, `Filmic Log`, `False Color`, `Raw`. **[confirmado por sonda no bpy 5.2.2]** (ACES 1.3 e 2.0 aparecem no 5.2; em que versão entraram **[não verificado]**.)

**Looks do AgX:** `None`, `AgX - Punchy`, `AgX - Greyscale`, `AgX - Very High Contrast`, `AgX - High Contrast`, `AgX - Medium High Contrast`, `AgX - Base Contrast`, `AgX - Medium Low Contrast`, `AgX - Low Contrast`, `AgX - Very Low Contrast`.

**Looks de Filmic, Khronos PBR Neutral e Standard:** `None`, `Very High Contrast`, `High Contrast`, `Medium High Contrast`, `Medium Contrast`, `Medium Low Contrast`, `Low Contrast`, `Very Low Contrast` (sem prefixo).

**Display devices:** `sRGB`, `Display P3`, `Rec.1886`, `Rec.2020`, `Rec.2100-PQ`, `Rec.2100-HLG`.

Erro comum de script: `look = 'Punchy'` falha; o nome é `'AgX - Punchy'`. **[confirmado por sonda no bpy 5.2.2]**

| Look | Quando |
|---|---|
| `AgX - Medium High Contrast` | padrão deste manual para produto; usado na prova |
| `AgX - High Contrast` | luxo escuro, luz dura |
| `AgX - Punchy` | pop, candy, neon; aumenta saturação e escurece (ver tabela 11.4) |
| `AgX - Base Contrast` / `None` | quando a cor da marca é crítica e você vai graduar depois |
| `None` ou `AgX - Low Contrast` | luz natural, lifestyle leve (alinhado com a ficha natureza do cap 02; `None` é idêntico a Base Contrast, medido no cap 08) |

### 11.3 Exposição e gama

`scene.view_settings.exposure` (stops; padrão 0) e `gamma` (padrão 1,0). **[confirmado por sonda no bpy 5.2.2]**

- **Exposição** move toda a imagem em stops antes da curva do AgX. +1 = dobro da luz. Use para acertar a exposição geral depois que as relações entre luzes estão certas. Faixa saudável: -1 a +1. Se precisar de mais que ±1,5, as luzes estão erradas, volte para elas.
- **Gama** deforma os meios-tons depois da curva. Deixe em 1,0. Gama diferente de 1 é o caminho mais rápido para o "lavado".
- `light.exposure` (por luz) é diferente: multiplica só aquela luz em stops. Útil para calibrar: o fator 0,15 do Laboratório equivale a `exposure` de cerca de -2,7 em todas as luzes; o fator 0,35 que funcionou na cena do frasco deste capítulo equivale a -1,5. Fator não é constante: use os watts absolutos das tabelas (ex.: chave 6,3 W a 0,60 m no frasco, 9,8 W a 0,75 m no celular) e meça com o `qa.py` (ver 00 · Padrões da casa).

### 11.4 Teste de cor de marca: AgX vs Filmic vs Khronos PBR Neutral vs Standard

**[testado no bpy 5.2.2 Cycles CPU, nuvem]** Plano com emissão pura da cor hex, força 1,0, câmera ortográfica, sem luz nenhuma. A saída é o que o arquivo PNG mostra. Script: `/home/claude/codigo/luz/teste_cor_marca.py`.

| Hex da marca | Standard | Khronos PBR Neutral | AgX (None) | AgX - Punchy | Filmic |
|---|---|---|---|---|---|
| #E63946 (vermelho) | #E53845 | #E01C31 | #CB4B4A | #AE2B2B | #C43D4D |
| #1D3557 (azul marinho) | #1C3456 | #022A51 | #123353 | #001C38 | #1D3960 |
| #FFB703 (amarelo) | #FEB602 | #EFAD23 | #CC9E4C | #B68518 | #CDAE03 |
| #2A9D8F (verde água) | #299C8E | #0A9889 | #3A968C | #19776E | #2C9E94 |
| #FFFFFF (branco) | #FEFEFE | #EEEEEE | #C4C4C4 | #B0B0B0 | #CDCDCD |

E o que acontece quando você tenta "compensar" subindo a emissão:

| Força da emissão | Branco no AgX | Vermelho #E63946 no AgX | Vermelho no Khronos |
|---|---|---|---|
| 1 | #C4C4C4 | #CB4B4A | #E01C31 |
| 2 | #D8D8D8 | #E57977 | #F85962 |
| 4 | #E8E8E8 | #F59F9D | #FC8D91 |
| 8 | #F4F4F4 | #FEBDBB | #FDB4B7 |
| 16 | #FEFEFE | #FED3D2 | #FED2D3 |

**O que isso ensina:**
1. **No AgX, um valor de cena 1,0 vira 77% na tela (#C4).** Branco de cena não é branco de tela. O "branco" de produto bem exposto no AgX fica entre #D8 e #F4, nunca #FF, e isso é bom: é o que dá cara de foto.
2. **No AgX, a cor de marca nunca sai exata.** Subir a energia não resolve: o vermelho fica rosa antes de ficar certo (o "desbotado acima de ~1,3" que o Laboratório viu).
3. **Khronos PBR Neutral** foi desenhado "para obter cores sRGB no render que batam o mais fielmente possível com a cor base do material, sob iluminação em escala de cinza", pensando em fotografia de produto ([notas 4.2](https://developer.blender.org/docs/release_notes/4.2/rendering/); [Khronos](https://www.khronos.org/news/press/khronos-pbr-neutral-tone-mapper-released-for-true-to-life-color-rendering-of-3d-products); [devtalk](https://devtalk.blender.org/t/adding-pbr-neutral-tone-mapper/33602)). Existe desde o **4.2** e está no 5.2.2 com o nome exato `Khronos PBR Neutral`. No nosso teste ele preserva o branco (#EE) e o matiz, mas **aumenta a saturação** de cores médias (vermelho, azul marinho, verde água). É o melhor compromisso para catálogo, não para o logo.
4. **Standard é o único que devolve o hex** (erro de 1 unidade). Por isso Standard serve para grafismo plano.

### 11.5 Por que nunca Standard em fotorrealista, e quando ele é aceitável

**Nunca Standard em fotorrealismo:** o Standard corta tudo acima de 1,0 em branco puro. Brilho de vidro, borda de metal e reflexo de softbox (valores de 3 a 50 em cena) viram manchas brancas sem gradação; cores saturadas brilhantes ficam "neon de CG". Foi o Standard que lavou os filmes do Laboratório (problema nº 1 da base).

**Standard é aceitável quando:**
- Tela de UI plana, motion 2D, cartela de texto, sem luz física (emissão ≤ 1,0).
- Placa final de logo em que o hex precisa ser exato.
- Passes técnicos (máscaras, ID).

**Estratégia para cor de marca exata num filme fotorrealista:**
1. Renderize o produto em AgX (ou Khronos PBR Neutral em catálogo).
2. Renderize o logo/cartela em Standard, num passe ou cena separada, emissão 1,0 com a cor hex convertida para linear.
3. Junte no compositor (`scene.compositing_node_group`) ou na edição. **[testar no Blender]** se o compositor do 5.2 permite transformações diferentes por camada sem render separado.
4. Se o logo está **dentro** da cena (gravado no produto), aceite o desvio do AgX e confira com o cliente; a referência é "parece a marca na foto", não "bate o hex".

**Filmic:** sem motivo para usar no 5.x em trabalho novo. Fica para abrir arquivos antigos.

**Sinal de erro:** filme inteiro com cara de pastel e brancos cinzentos (gama ≠ 1, ou look `Low Contrast` sem querer); reflexos com borda branca chapada (Standard em fotorrealismo); logo rosado (logo emissivo forte no AgX).

---

## 12. O diagnóstico visual

### 12.1 Medidor: como ler o histograma

O Laboratório tem o `qa.py` (na máquina de referência) com seis alarmes. Faixas boas: contraste 0,20 a 0,38, estourado abaixo de 1,5%. Os testes deste capítulo usaram um medidor simplificado na nuvem (média e desvio padrão da luminância, % acima de 0,98 e abaixo de 0,02, em `teste_antes_depois.py`), que não é idêntico ao qa.py: use os números como tendência, não como meta exata.

| Alarme do qa.py | O que o histograma mostra | Causa provável na luz | Primeira correção |
|---|---|---|---|
| ESTOURADO | pilha encostada na direita, > 1,5% acima de 0,98 | energia alta, chave perto, emissão > 1,3 no AgX | energia × 0,5 (1 stop) ou `exposure` -1 |
| AFUNDADO | pilha encostada na esquerda | sem preenchimento, sem luz de fundo, relação > 16:1 | preenchimento a 1/4 da chave; luz de fundo 2 W |
| LAVADO | histograma estreito no meio, nada nos extremos, saturação baixa | Standard com gama, World cinza forte, luz 1:1 | AgX + Medium High Contrast; World força 0 a 0,1 |
| ESCURO | pilha toda no terço esquerdo, sem nada à direita | tudo fraco por igual | `view_settings.exposure` +1, ou chave × 2 |
| SEM COR | saturação média baixa | luz branca em tudo, sem temperatura, fundo cinza | chave 4.500 K + contorno 7.000 K; fundo com cor da marca a 20% |
| CHAPADO | desvio padrão < 0,14 no medidor da nuvem (faixa do `qa.py` real: ver Laboratório), histograma estreito | luz frontal, preenchimento igual à chave, cyc claro | chave para -45°, preenchimento a 25%; bandeira preta |

Para ver o histograma no Blender com interface: Image Editor > Scopes (Histogram e Waveform) **[não verificado no 5.2: posição do painel]**. Por script, leia `bpy.data.images.load(caminho).pixels` com numpy, como no código de teste.

### 12.2 Tabela: o que você vê → causa → correção com número

| # | O que você vê no quadro | Causa provável na luz | Correção com número |
|---|---|---|---|
| 1 | Produto e fundo com o mesmo brilho | fundo perto e iluminado pela chave | afaste o fundo para 0,45 m × k (frasco); spread da chave 70°; fundo cinza 0,03 a 0,05 |
| 2 | Chão branco na frente do produto | chave e preenchimento atingem o chão | light linking: chave e preenchimento só no produto; ou elevação da chave 30° → 45° |
| 3 | Mancha brilhante no chão atrás do produto | contorno rasante refletindo no chão | contorno ligado só ao produto; ou aspereza do chão 0,6 → 0,9 |
| 4 | Vidro leitoso, sem borda | sem bandeiras, ambiente claro refletido | 2 bandeiras pretas a az ±55°, 0,28 m; World força 0 |
| 5 | Líquido dentro do vidro preto/morto | nada atrás para refratar | cartão de transluz 0,55 m a 0,35 m atrás, emissão 2, degradê radial |
| 6 | Retângulo duro visto através do vidro | cartão de transluz uniforme, perto, pequeno | degradê radial; dobre o tamanho; afaste para 0,35 m |
| 7 | Metal cromado preto ou sujo | não há nada claro para refletir | 2 faixas az ±110°, 0,04 x 0,70 m, 4,2 W; ou HDRI só no glossy força 0,6 |
| 8 | Reflexo da luz como mancha quadrada no cilindro | softbox quadrada no lugar de faixa | troque por RECTANGLE 0,04 x 0,70 m |
| 9 | Cor vermelha virou rosa, azul virou bebê | estouro no AgX (desatura antes de virar branco) | energia × 0,5; produto opaco usa metade da energia do vidro |
| 10 | Cor da marca "suja" ou mais escura | AgX comprime; look Punchy escurece | `AgX - Base Contrast` no pack shot; logo em passe Standard |
| 11 | Tudo cinza e sem contraste | Standard + gama, ou AgX Low Contrast, ou luz 1:1 | AgX + `AgX - Medium High Contrast`; relação 4:1 |
| 12 | Sombra dura num cosmético "suave" | luz pequena ou distante (< 3° aparente) | chave de 0,40 x 0,55 m a 0,60 m (≈ 43°) |
| 13 | Produto "flutuando", sem contato com o chão | sem sombra de contato (luz enorme ou linking tirou o chão) | topo de 1 W não ligado; ou ambient occlusion; elevação da chave 30° |
| 14 | Silhueta some no fundo escuro | sem contorno, sem luz de fundo | contorno 150° (8,75 W × k²) ou luz de fundo 2,1 W |
| 15 | Borda do produto estourada em branco | contorno forte demais ou largo | contorno 0,08 m → 0,05 m; energia × 0,7; spread 60° → 45° |
| 16 | Dois produtos com sombras em direções diferentes | HDRI com sol + chave | HDRI só no glossy (`cycles_visibility.diffuse = False`) ou `sun_threshold` alto no EEVEE |
| 17 | Faixas da persiana borradas | sol largo ou persiana longe | sol `angle` 1,5°; persiana a 0,2 a 0,35 m do produto |
| 18 | Tudo roxo no neon | duas cores se misturando na frente | neons em az ±130°; chave neutra fraca (1 W) na frente |
| 19 | Tubo de neon branco no meio | emissão alta demais no AgX | Emission Strength 1,0 a 2,0 (a área de 4,2 W é quem ilumina) |
| 20 | Névoa leitosa cobre o produto | densidade alta, anisotropia 0 | anisotropia 0,6; densidade 1,0 → 0,3 (cena de mesa); `volume_factor` 0 na chave |
| 21 | Feixe de luz sem borda (EEVEE) | sombra volumétrica desligada (padrão no 5.2.2) | `use_volumetric_shadows = True`; `volumetric_tile_size = '4'` |
| 22 | Pontos brancos piscando (fireflies) | luz pequena e forte vista por reflexo/refração; emissivo iluminando | troque emissivo por área; `sample_clamp_indirect` 10; mais amostras + OIDN |
| 23 | Cartão de reflexo aparece no quadro | `visible_camera` ligado | `obj.visible_camera = False` |
| 24 | Sombra estranha atravessando o produto | cartão ou bandeira projetando sombra | `obj.visible_shadow = False` |
| 25 | Filme amarelado no geral | chave quente sem contraponto | contorno 2.000 K mais frio; ou `white_balance_temperature` |
| 26 | Produto acende "do nada" no filme | animação sem motivo no roteiro | amarre a subida da chave à revelação (15 quadros) |
| 27 | Tela de celular cinza chapada | reflexo do ambiente cinza na tela | cartão grande escuro atrás da câmera (bandeira) e 1 cartão em degradê acima |
| 28 | Quadro escuro, histograma no terço esquerdo | energia × 0,15 aplicada a tudo, inclusive o que já estava certo | `view_settings.exposure` +1; ou chave × 2 |

---

## 13. Código e arquivos deste capítulo

| Arquivo | O que faz | Status |
|---|---|---|
| `/home/claude/codigo/luz/rigs_luz.py` | biblioteca: `luz_area`, `luz_spot`, 9 rigs, cartões, bandeiras, transluz, HDRI só reflexo, World ray visibility, light linking, névoa, EEVEE volumetrics, animação de revelação | nomes confirmados por sonda; rigs testados em Cycles CPU |
| `/home/claude/codigo/luz/teste_antes_depois.py` | gera `luz_antes.png` e `luz_depois.png` e mede | testado |
| `/home/claude/codigo/luz/teste_rigs.py` | renderiza cada rig (`tres`, `top`, `rim`, `fundo`, `cyc`, `dura`, `janela`, `neon`, `faixas`) | testado |
| `/home/claude/codigo/luz/teste_volume.py` | feixe na névoa, Cycles e EEVEE, mede tempo | testado |
| `/home/claude/codigo/luz/teste_cor_marca.py` | mede desvio de hex por view transform | testado |

Como usar a biblioteca num script de cena:

```python
# Blender 5.2 | status: testado no bpy 5.2.2 Cycles CPU, nuvem
import sys; sys.path.insert(0, '/home/claude/codigo/luz')
import rigs_luz as R
from mathutils import Vector

ALT = 0.15                         # celular em pé
alvo = Vector((0, 0, ALT / 2))
R.FATOR_ENERGIA = 1.0              # vidro/metal; use 0.5 para produto opaco fosco
R.fundo_infinito(alvo, ALT, cor=(0.035, 0.036, 0.04))
chave, preench, contorno = R.rig_tres_pontos(alvo, ALT)
rims = R.rig_contorno_duplo(alvo, ALT)
for luz in (chave, preench, contorno, *rims):
    R.contorno_so_no_produto(luz, produto_objs, nome='Produto')
R.cartoes_reflexo(alvo, ALT, forca=12)
R.bandeiras_pretas(alvo, ALT)
R.rig_fundo_gradiente(alvo, ALT)
R.acender_na_revelacao(chave, contorno, q_revela=45)
cena.view_settings.view_transform = 'AgX'
cena.view_settings.look = 'AgX - Medium High Contrast'
```

---

## Fontes

1. [Blender Manual 5.2, Light Objects](https://docs.blender.org/manual/en/latest/render/lights/light_object.html)
2. [Blender Manual 5.2, Light Linking](https://docs.blender.org/manual/en/latest/render/lights/light_linking.html)
3. [Blender Manual, Cycles Object Settings (visibilidade de raio)](https://docs.blender.org/manual/en/latest/render/cycles/object_settings/object_data.html)
4. [Blender Manual, Cycles World Settings](https://docs.blender.org/manual/en/latest/render/cycles/world_settings.html)
5. [Blender Manual, nó Light Path](https://docs.blender.org/manual/en/latest/render/shader_nodes/input/light_path.html)
6. [Blender Manual, Principled Volume](https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/volume_principled.html)
7. [Blender Manual, EEVEE Volumes](https://docs.blender.org/manual/en/latest/render/eevee/render_settings/volumes.html)
8. [Blender Manual, Color Management](https://docs.blender.org/manual/en/latest/render/color_management.html)
9. [Notas de versão 4.0, Cycles (light e shadow linking)](https://developer.blender.org/docs/release_notes/4.0/cycles/)
10. [Notas de versão 4.0, Color Management (AgX)](https://developer.blender.org/docs/release_notes/4.0/color_management/)
11. [PR #106355, AgX](https://projects.blender.org/blender/blender/pulls/106355)
12. [Notas de versão 4.2, Rendering/Color Management (Khronos PBR Neutral)](https://developer.blender.org/docs/release_notes/4.2/rendering/)
13. [Notas de versão 4.2, EEVEE (volumes, sombras, sol do HDRI, visibilidade de raio das luzes)](https://developer.blender.org/docs/release_notes/4.2/eevee/)
14. [Notas de migração EEVEE 4.2](https://developer.blender.org/docs/release_notes/4.2/eevee_migration/)
15. [Blender 4.3, página da versão (light linking no EEVEE)](https://www.blender.org/download/releases/4-3/)
16. [PR #127514, EEVEE Light & Shadow linking](https://projects.blender.org/blender/blender/pulls/127514)
17. [CG Channel, 5 key features in Blender 4.3](https://www.cgchannel.com/2024/11/5-key-features-in-blender-4-3/)
18. [CG Channel, Blender 4.5 LTS (temperature, normalize, exposure nas luzes)](https://www.cgchannel.com/2025/07/blender-4-5-lts-is-out-check-out-its-5-key-features/)
19. [Notas de versão 5.0, Cycles (volume null scattering)](https://developer.blender.org/docs/release_notes/5.0/cycles/)
20. [Notas de versão 5.0, EEVEE](https://developer.blender.org/docs/release_notes/5.0/eevee/)
21. [Developer Forum, Cycles Light and Shadow Linking](https://devtalk.blender.org/t/cycles-light-and-shadow-linking/29587)
22. [Developer Forum, Adding PBR Neutral tone mapper](https://devtalk.blender.org/t/adding-pbr-neutral-tone-mapper/33602)
23. [Khronos, PBR Neutral Tone Mapper](https://www.khronos.org/news/press/khronos-pbr-neutral-tone-mapper-released-for-true-to-life-color-rendering-of-3d-products)
24. [Blender Artists, objeto invisível que aparece em reflexos](https://blenderartists.org/t/how-do-i-make-objectcast-reflections-but-the-object-itself-is-invisible/1193086)
25. [Meshlogic, exposição correta de HDRI e Light Path](https://meshlogic.github.io/posts/blender/rendering/nodes-correct-hdri/)
26. [Poly Haven, HDRIs](https://polyhaven.com/hdris) (licença CC0, uso comercial sim, crédito não obrigatório)
27. [Poly Haven, License](https://polyhaven.com/license)
28. [Outshinery, Glass bottle photography (bandeiras pretas, contorno, gradiente)](https://www.outshinery.com/articles/how-to-photograph-glass-bottle-without-reflections)
29. [ProPhotoStudio, How to photograph glass](https://www.prophotostudio.net/blog/learning-center/why-photographing-glass-is-so-hard/)
30. [Elena Vels Studio, reflective products](https://elenavelsstudio.com/how-to-shoot-reflective-products-without-the-hassle/)
31. [Wikipedia, Lighting ratio](https://en.wikipedia.org/wiki/Lighting_ratio)
32. [Wikipedia, Inverse-square law](https://en.wikipedia.org/wiki/Inverse-square_law)
33. [Wikipedia, Color temperature](https://en.wikipedia.org/wiki/Color_temperature)

Nota de verificação: as páginas do manual em docs.blender.org não puderam ser lidas na íntegra a partir da nuvem (o leitor devolveu só o índice). Todo nome de propriedade citado neste capítulo foi confirmado por sonda no bpy 5.2.2; as notas de versão (developer.blender.org) e a página da versão 4.3 foram lidas.

---

## Pendências para o Claude Code

**Receitas [testar no Blender] na máquina de referência (RTX 3050, OptiX):**

1. Rodar `teste_antes_depois.py` em 540x960 com OptiX e passar `luz_depois.png` pelo `qa.py` real. Meta: contraste 0,20 a 0,38, estourado < 1,5%. O medidor da nuvem deu desvio 0,171; se o qa.py acusar CHAPADO, suba a chave 30% ou desça o preenchimento para 2 W.
2. Repetir a prova em EEVEE (mesma cena): conferir se `visible_camera = False` esconde os cartões e se o cartão de transluz aparece através do vidro com raytracing ligado (`scene.eevee.use_raytracing = True`; padrão False no 5.2.2).
3. Confirmar o fator de energia do spot (rig de luz dura) no EEVEE.
4. Medir tempo real de névoa em Cycles OptiX e EEVEE a 1080x1920 (densidade 0,3, tile 4 e 8).
5. Testar o truque de Light Path do HDRI (`mundo_hdri_reflexo`) com um HDRI de estúdio do Poly Haven (CC0), em Cycles e EEVEE.
6. Light linking com emissor de logo (receptor só o fundo) e shadow linking com mão/personagem.
7. Descobrir o nome Python do estado incluir/excluir de cada item na coleção de light linking (resolvido: `collection_objects[i].light_linking.link_state`, ver §7.2).
8. Gobo por nós dentro da luz (Cycles light nodes) como alternativa à persiana de geometria.
9. Compositor do 5.2: juntar passe do logo em Standard com o render em AgX dentro de `scene.compositing_node_group`.
10. Conferir no Image Editor > Scopes do 5.2 o painel de histograma.

**PENDÊNCIAS YOUTUBE (não acessados):**

| Título | Canal | Link | O que esperava aprender |
|---|---|---|---|
| Blender 4.2! New tone mapping, the Khronos PBR Neutral Tone Mapper | (canal não identificado) | https://www.youtube.com/watch?v=iQ3m0CfuSmg | comparação visual Khronos vs AgX em produto |
| What is Normalize lighting in Blender 4.5? | (canal não identificado) | https://www.youtube.com/watch?v=lLoBGZgMzJw | comportamento de `normalize` ao escalar luzes de área e sol em W/m² |
