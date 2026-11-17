# Destilado: APP, SITE E SAAS em 3D

Tema: UI 3D e UX animado, celular e notebook com tela, cartões flutuantes, vidro estilo "liquid
glass", troca de telas, ícones animados, estrutura de vídeo explicativo de SaaS e ritmo de
lançamento de produto digital.

Fonte: as 11 transcrições `app_saas__*` em `pesquisa/transcricoes/`. A legenda é automática e vem
com erros; os números abaixo foram conferidos no texto falado. Onde o vídeo não dá número e eu
complemento, aparece **[conhecimento geral]**. O que muda do tutorial antigo para o Blender 5.2
segue `.claude/skills/estudio-3d/referencias/blender-5.2-verdade.md` (marcado **[verdade 5.2]**).
Item que eu acho certo mas que não está na sonda vai como **[conhecimento geral, sondar]**.

O diagnóstico de partida: a tela do app sai como "placa plana com imagem colada". As fontes, juntas,
mostram por que isso acontece e como sair: **tela boa é um sanduíche** (camadas separadas em
profundidade, cada uma com material próprio), **a luz tem que ter o que refletir** (faixas, HDRI,
spots, piso brilhante), **o vidro precisa de espessura, borda e fundo com textura pra refratar**, e
**a interface precisa estar fazendo alguma coisa** (rolar, ser tocada, mudar de estado).

---

## 1. Por vídeo

Notas: 5 = central para o tema e com técnica reaproveitável; 1 = quase nada do tema.

---

### 1.1 3D UX/UI Animation in Blender 2.8

- Canal: Derek Elliott (138 mil views, 72 min)
- Link: https://youtu.be/5GpjYYXXffo
- Nota: **5**. É o vídeo-mãe do tema; outros dois tutoriais (jammed., Aryan) citam ele.
- Software: Blender 2.8, EEVEE (legacy).

Técnicas:
1. **Celular montado em camadas, não numa placa.** Plano escalado em Y vira o corpo, com
   Solidify para espessura. Um duplicado subido em Z vira as barras pretas do topo e da base
   (duas edge loops, apaga a face do meio). Os "posts" ficam em outro objeto, um pouco acima. Cada
   peça nova é subida "um pouquinho" para não brigar com a de baixo: ele cita o flicker de duas
   faces no mesmo plano (z-fighting) como motivo.
2. **Feed rolando com máscara booleana.** O post (um plano quadrado com uma faixa separada por
   bevel de 1 corte, a faixa apagada, para a área dos ícones) recebe **Array** com Relative Offset
   só em Y, valor negativo, contagem de **10 a 12**. Um cubo chamado "cutter" corta o array com
   **Boolean em modo Intersect**: só aparece o que está dentro do cubo, que vai exatamente da
   barra de cima à de baixo. O cutter fica com Display As = **Bounds** e com a câmera de render
   desligada no outliner. **Ordem dos modificadores: Solidify, Array, Boolean** (o boolean por
   último).
3. **Câmera ortográfica** (controle de zoom pelo Orthographic Scale, não movendo a câmera) e
   formato quadrado **1500 x 1500** para Instagram. É a escolha "infográfico estilizado".
4. **Luz:** a point padrão vira **Area em disco**, grande, atrás e acima do celular; um duplicado
   do outro lado, maior e mais fraco, como preenchimento. Ele recomenda iluminar antes de pôr
   material, para ler sombra e contraste.
5. **Materiais por contraste de família:** cor chapada (post azul, depois laranja), preto com
   **Roughness 0.9** para matar o brilho, **emissão** nos ícones (glow) e um **coração metálico**
   vermelho. Ele diz explicitamente que a mistura chapado + brilhante + metálico é o que dá
   interesse. Um objeto pode ter vários slots de material (faixa dos ícones com outro material).
6. **Ícones de UI como linha brilhante:** botões home/voltar/recentes feitos com **Skin
   modifier** sobre arestas (raio reduzido com Ctrl+A até virar linha fina; Mark Root em cada
   pedaço solto), material **Emission** + **Bloom** do EEVEE. Barra de status com barras de sinal,
   envelope (faca + bevel) e hora em texto com Extrude, tudo com o mesmo material glow e um
   pouquinho de espessura.
7. **Tempo:** 30 fps, peça de **8 s = 240 quadros**. **1 s (quadros 1 a 30) para tudo entrar**; a
   rolagem começa no quadro 30. Para segurar uma pausa, duplica a chave (Shift+D) alguns quadros à
   frente.
8. **Rolagem tipo "flick", não ease-in-out.** No Graph Editor ele abre a alça de saída curta e a
   de chegada longa: a rolagem dispara rápido e desacelera longo, como um dedo jogando o feed. O
   ease padrão do Blender (lento-rápido-lento) é o erro. Detalhe extra: antes da segunda rolagem,
   um pequeno recuo para trás, como o polegar "armando" o gesto.
9. **Entrada por controle (Empty):** tudo (inclusive o cutter) parentado a um Empty. Escala
   **0 a 1** entre os quadros 1 e 30, mais queda em Z e um giro em Y; interpolação **Quadratic com
   Ease Out**, que ele descreve como começar "punchy snappy and then it settles into place". Os
   posts caem em Z com atraso próprio e um **Simple Deform em Bend** (precisa de edge loops e do
   eixo do objeto girado 90°) vai de um ângulo até **0 no quadro 30**: o conteúdo entra "envergado"
   e assenta reto.
10. **Interação simulada:** um círculo "tapper" parentado ao post: aparece por escala em **4 a 5
    quadros**, rola junto, some; só se reposiciona enquanto está invisível. **Toque duplo**: escala
    0, 1, 0.1, 1, 0 em poucos quadros, depois acelerado no Graph Editor. **Coração** surge por volta
    do quadro **190 a 200** (escala 0 a 1 em uns 10 quadros), sobe em Z com interpolação **Linear**
    até o fim e some por escala; o celular some **um pouco antes** do coração. Por último, um
    flutuar leve do celular inteiro (sobe e desce, gira pouco) e as luzes parentadas ao controle,
    também se mexendo.

---

### 1.2 How I made my stylized 3D animations in Blender (Behind The Scenes)

- Canal: TheMathewFlames (91 mil views, 42 min)
- Link: https://youtu.be/8P3b6yDfCqs
- Nota: **1**. É bastidor de animação de personagem estilizado (paródias), não de app.
- Software: Blender 4.0.2, EEVEE, OpenToonz para 2D e montagem.

Técnicas aproveitáveis por tabela:
1. Movimento "nos dois" (on twos): insere chave a cada 2 quadros e põe interpolação **Constant**;
   nos trechos muito rápidos volta para Bezier. Serve para estilo "snappy", não para UI premium.
2. Renderiza camadas separadas em **PNG RGBA com fundo transparente** e compõe depois.
3. Plano de luz/raio que sempre encara a câmera com constraint **Copy Rotation** mirando a câmera.
4. Raios de luz e "speed lines": cilindro sem tampas, Gradient + Voronoi esticado + Color Ramp +
   Transparent, animado com `#frame` num valor de mapeamento.
5. Tela de TV dentro da cena com **Image Texture carregando um vídeo**.
6. Confete: partículas emitindo uma coleção de 3 peças, cor aleatória via **Object Info > Random**
   num Color Ramp.

---

### 1.3 Microsoft Style Card Animation in Blender 3D

- Canal: Motion Nations (69 mil views, 30 min)
- Link: https://youtu.be/c_LRgt-tVuA
- Nota: **3**. Cartões de UI soltos no ar por física, bom para abertura de SaaS.
- Software: Blender (versão não declarada), simulação em EEVEE, render em **Cycles GPU**.

Técnicas:
1. Pilha de cartões: plano em formato de cartão + **Array com Constant Offset Z = 0.1**, X = 0,
   contagem **11**.
2. Cartões viram tecido: Physics **Cloth**, subdivide 4 em edit, **Subdivision Surface 3**
   (viewport e render), **Solidify** padrão. Base com **Collision**.
3. Um plano "tapa" a pilha de baixo para cima: Z **-16** no quadro 1 a **0** no quadro **13-14**
   (depois -20 para mais força). Interpolação **Linear** é obrigatória: com Bezier o plano chega
   desacelerando e o impacto morre.
4. Cloth: preset **Silk**, **Quality 35**, **Tension 5**, **Compression 2**, **Shear 2**,
   **Self Collision** ligada com qualidade **10**.
5. Ondulação sem sofrer com física: **Displace** com textura **Clouds**, tamanho **2**,
   coordenadas por **Object** (um Empty), direção **Z**, **Midlevel 0**, **Strength** animada de
   **0** (antes de voar) a **0.4** (no ar).
6. **Bake** de 90 quadros no cache e só então mexe em câmera e material.
7. Fundo: plano com a **mesma rotação da câmera** (copia os valores) para ficar sempre de frente.
8. Material por cartão: aplica o Array, em edit seleciona cada camada pela vista lateral com
   X-ray e atribui um slot. Tipos: **Gradient Texture + Color Ramp** com Mapping em coordenadas
   **Object** (rotação 90/-90); **vidro** (Glass BSDF misturado); e **Image Texture com um design
   de UI** (texto, linhas, gradientes feitos fora) no cartão de cima.
9. Luz: HDRI de estúdio do Poly Haven (força **1**) + **Area 200 W** com nós na luz (**Noise +
   Color Ramp**) e **Spread 1**: vira um gobo de manchas de luz no fundo.
10. Render: **64 ou 32 amostras** com denoise, 1920x1080, 90 quadros, PNG RGB 16 bits.

---

### 1.4 3D Floating UI Animation in After Effects

- Canal: Motion Nations (309 mil views, 17 min)
- Link: https://youtu.be/ErdO0edE1Ig
- Nota: **3**. After Effects, mas a coreografia de "UI saindo de uma fonte" traduz direto.
- Software: After Effects (versão não declarada; usa track matte por pick whip, recurso recente).

Técnicas (traduzidas para Blender entre parênteses):
1. Tela da UI como composição própria **1080 x 600** com cantos arredondados por máscara (no
   Blender: plano com bevel nos vértices e a imagem por UV).
2. **Seis telas em carrossel**: cada uma girada **360/6 = 60°** em Y em torno de um pivô
   empurrado **Z 500** (no Blender: seis planos parentados a um Empty, cada um a 60°, deslocados
   do centro).
3. **O carrossel só gira quando o dedo desliza** no vídeo de referência; fora do gesto, ele para.
   A interação manda no movimento.
4. Curvas suavizadas no speed graph para chegada macia.
5. **Glow em contorno:** duplica a tela, deixa só o traço, modo **Add**, empilha **3 glows**, o
   último bem forte (no Blender: moldura em emissão forte por trás do vidro + Glare no compositor).
6. Raios de luz saindo do ponto de origem, com intensidade animada de 0 até cheio.
7. **Fundo escurece quando a UI acende:** exposição do vídeo de fundo vai a **-1** no momento do
   toque, para o olho ir para a interface.
8. **Entrada escalonada:** cada tela vem de baixo, com escala 0 e opacidade 0, com **10 quadros**
   de atraso entre uma e outra; depois ele comprime tudo porque ficou lento.

---

### 1.5 Blender 3D UI Switch Animation Tutorial

- Canal: Polygon Runway (32 mil views, 23 min)
- Link: https://youtu.be/hmS-nV4x4oo
- Nota: **5**. O melhor exemplo das fontes de "a mudança de estado muda o mundo inteiro".
- Software: Blender 4.x (Bool Tool como extensão, logo 4.2+), **Cycles GPU**.

Técnicas:
1. Forma de pílula: plano, **Ctrl+Shift+B** (bevel de vértice) com **Clamp Overlap** e **16
   segmentos**; extrude e **Shift+N** (recalcular normais) sempre que extrudar geometria plana.
2. Placa de fundo: plano escalado **10x**, extrudado; recorte com **Bool Tool** (Difference).
   Bevel modifier de **4 segmentos** com **Harden Normals** para tirar sombreado ruim.
3. Botão (knob): círculo de **32 vértices** extrudado, fechado, bevel com **4 cortes**, insets no
   topo para ter geometria, **Subdivision 2**, shade smooth.
4. **Encaixe perfeito sem unir geometria:** grupo de vértices na borda de baixo do knob,
   **Shrinkwrap** só nesse grupo mirando a superfície de baixo, e **Data Transfer** (Face Corner
   Data, Custom Normals, Nearest Face Interpolated) com o mesmo grupo. Parece uma peça só.
5. **Tempo em loop de 120 quadros a 30 fps:** desliza em X do quadro **1 ao 30**, segura até o
   **60**, volta do **60 ao 90**, segura até o **120**. Chaves duplicadas com Shift+D.
6. Texto "light"/"dark" com **Bevel na geometria do texto**, centralizado, parentado à peça que
   desliza.
7. Materiais: tudo com o **mesmo material glossy, Roughness 0.1**. Texto com **transmissão** e
   **emissão**: azul em **15** no quadro 1, vai a **0** no quadro **15**; o outro texto, laranja,
   sobe de 0 a **15** até o quadro **30**. A cor troca durante a primeira metade do curso.
8. **O estado muda a cena inteira:** Area principal **1500 W** no claro cai para **15 W** no
   escuro; a Base Color do material de fundo escurece por chave; a cor do World também. Ele chama
   isso de ajudar a luz "artificialmente" pelo material.
9. **Reflexo planejado:** dois **Spot de 1500 W** com o cone mirando só o knob, para desenhar
   brilho nele; reposicionados para o estado escuro. Uma Area de **500 W** atrás como contraluz.
10. Câmera: chaves de posição no 1 e copiadas no 121 (loop perfeito), com pequenos empurrões
    aleatórios no meio via auto-key, tipo mão. Color management com contraste mais alto,
    exposição um pouco acima (equilíbrio entre claro e escuro), **motion blur ligado**, 128
    amostras com denoise.

---

### 1.6 How to Create a SaaS Explainer Ad in After Effects

- Canal: Vane Motion (168 mil views, 54 min)
- Link: https://youtu.be/iRkEN4doyeQ
- Nota: **4**. É o único com estrutura de peça de SaaS (cena de recursos, transição, texto,
  paralaxe), no estilo do canal Zelios.
- Software: After Effects, renderizador Advanced 3D, plugin Deep Glow (pago; o Glow nativo serve).

Técnicas (traduzidas para Blender entre parênteses):
1. **Cartão de recurso:** 180 x 350 px, cantos **100**, preenchimento em gradiente da paleta,
   contorno em gradiente de **10 px**, caixa interna com cantos **50**, texto em modo Overlay,
   ícone num círculo com traço de **4 px** e glow em modo Add.
2. **Carrossel de cartões** a 55% de escala, montado como prisma (cada cartão girado em passos
   fixos em Y em torno de um centro), parentado a um null. Gira **0 a 360° em Y em 6 s** com
   **25° de inclinação em X** para dar perspectiva; ease com influência de **70%**.
3. **Cartões curvam:** curvatura de **0 a -40** em **25 quadros**, com **20 segmentos** para o
   arco ficar liso; ease longo (alças puxadas ao máximo). Alguns cartões também giram para a
   horizontal no começo. (No Blender: **Simple Deform Bend** com ângulo animado.)
4. **Opacidade 98%** nos cartões, de leve, para parecer vidro.
5. **Transição por forma:** estrela de 4 pontas (raio interno 30, externo 80, roundness interno
   200%, externo 10%) que voa em Z de **-2595** (preenche a tela) passando por **-2140** a **0**
   em cerca de **3 s**, girando de **-45° a 90° a 270°**, em trajetória curva. A estrela é a
   máscara que mostra a cena 1 dentro dela e, invertida, revela o fundo da cena 2. Truque de
   tempo: velocidade contínua nos pontos intermediários ("a estrela nunca para"), influências
   **70 / 50 / 90%**.
6. Fundo: gradiente de **4 cores**, feixe de luz desenhado e borrado (**150**, modo Screen),
   partículas visíveis só dentro do feixe, raios de sol em Screen com opacidade baixa.
7. **Texto entra por caractere:** posição de baixo e opacidade 0, offset do range selector de
   **-100 a 100**, forma **Ramp Up**, **Ease High 20 / Ease Low 100**.
8. **Paralaxe:** grade sutil (espessura 2, Overlay) empurrada **1000 px para trás em Z**; câmera de
   35 mm num null que **recua -300** a partir do fim da transição: a câmera continua andando
   depois que a forma termina, e isso dá "dinamismo". (No Blender: câmera perspectiva real e
   camadas em Z diferentes.)
9. Brilhos finais: círculo com gradiente radial subindo, traço de **40 px** com blur **30** em Add,
   cópias mais finas atrasadas; ajuste de curvas para contraste e um toque de azul.

---

### 1.7 motion graphics in blender

- Canal: MiGo Pro (95 mil views, 23 min)
- Link: https://youtu.be/KrMdrLC7XL8
- Nota: **3**. Onda deformando uma superfície de UI quando o cursor "clica": muito reaproveitável.
- Software: Blender (versão não declarada), Cycles; câmera lenta final no DaVinci (optical flow).

Técnicas:
1. Superfície: plano com **muitas edge loops em X**, Solidify.
2. **Deformador invisível:** cilindro de **80 vértices** deitado, varrendo da esquerda para a
   direita em **60 quadros**, com uma chave extra no meio: rápido, devagar no meio, rápido de novo
   (alças editadas no Graph Editor só no X).
3. **Proximidade vira peso:** grupo de vértices em tudo + **Vertex Weight Proximity** mirando o
   cilindro, modo **Geometry**, por **Faces**, **Normalize** ligado, falloff **Smooth**, distância
   na casa de **0.6 a 0.8** (ajustado vendo em Weight Paint).
4. **Displace** usando esse grupo, força baixa (0.x). Displace acima do Solidify na pilha;
   **Subdivision 2**; mais loops para suavizar.
5. **Wave modifier** com origem num Empty no canto, largura estreita, **Speed 0.3 a 0.4**. A altura
   é animada: **0 no quadro 40, 1.1 no quadro 42, 0 no 50-55**. Ou seja, um pulso disparado.
6. **Seta/cursor** desce e bate na superfície no quadro **40**, exatamente quando a onda pequena
   nasce; lenta no contato, rápida na ida e na volta (Bezier editado).
7. **Anéis de impacto:** toro fino (**22 segmentos**) com Array em Z por **Object Offset** de um
   Empty; escalar o Empty abre os anéis. Sobem quando a seta bate e descem quando ela sobe.
8. Material "plástico de vidro": **Transmission 1**, roughness baixa, **IOR 1.1 a 1.2**. Achado
   importante: **o vidro sai preto se não houver nada claro embaixo**; ele põe uma placa clara sob
   a superfície.
9. Logo/botão "follow" em **Image Texture na emissão**, alinhado por UV para que o botão fique
   onde a onda começa.

---

### 1.8 Apple's Liquid Glass | Blender Tutorial

- Canal: kutson blend (18 mil views, 4 min)
- Link: https://youtu.be/lz0gXjEs9GY
- Nota: **5**. Curto, mas é a resposta mais direta ao problema da "placa colada".
- Software: Blender (versão não declarada; vídeo da época do iOS 26, então 4.4/4.5
  [conhecimento geral]), **Cycles**.

Técnicas:
1. **A UI vem de verdade, não de imagem:** baixa o UI kit do iOS 26 no Figma Community, exporta
   cada parte como **SVG**, importa no Blender e alinha. Escala com pivô no 3D cursor, **Origin to
   Geometry**.
2. **Empty cubo como controle**, tudo parentado com **Keep Transform**.
3. **Chão com grade para mostrar a refração:** plano com **Brick Texture**, squash 1, preto e
   branco, traço fino. Sem algo com desenho atrás, o vidro não tem o que distorcer.
4. Câmera com **Track To** num segundo Empty.
5. Limpa geometria em excesso do SVG, **Solidify** para espessura e **Bevel** para arredondar a
   borda; ajusta para não sobrar quina viva.
6. Luz **de cima, reta**, suavizada.
7. **Material de vidro sem sombra escura:** apaga o Principled; **Mix Shader** entre **Glass BSDF**
   e **Transparent BSDF**, com fator = **Light Path > Is Shadow Ray**. O vidro continua refratando
   para a câmera, mas a sombra atrás dele fica clara. Segundo painel com vidro um pouco mais
   escuro (variação de camada).
8. **O brilho que corre na borda (o que dá vida):** separa a aresta externa do painel (P), apaga os
   modificadores, converte em **curva**; uma **Area light** com **Track To** no controle e **Follow
   Path** nessa curva, andando em volta do painel. Aplica escala da curva antes (senão a luz
   desalinha).
9. **Light linking:** essa luz só ilumina a coleção dos painéis, sem sujar o resto da cena.
10. **Ícones com bounce:** quadro **1 escala 0**, quadro **10 escala acima de 1**, quadro **15
    escala final**; cada ícone com um pequeno atraso. Glow por "geometry proximity" funcionou só
    no EEVEE e não no Cycles; a solução ficou fora do vídeo (canal de Telegram).

---

### 1.9 Modeling and Animating a Laptop in 10 minutes

- Canal: Aryan (41 mil views, 9 min)
- Link: https://youtu.be/MTb4XxMXlG8
- Nota: **3**. Bom para notebook e para "o que reflete na tela".
- Software: Blender (versão não declarada), LoopTools, **Cycles**.

Técnicas:
1. Referências de fundo (frente e topo) como Image Reference.
2. Teclado: uma tecla modelada + Array por linha; une tudo, marca costuras, seleciona os topos e
   **UV > Project from View** sobre a foto do teclado.
3. Corpo: plano de quadrados + LoopTools Relax nas quinas; portas e entalhe da dobradiça.
4. **Tela:** imagem (melhorada num upscaler antes) em material próprio, UV ajustado, **Roughness
   quase 0**: "dá um monitor brilhante". Moldura preta em outro slot.
5. Corpo **metálico** preto; touchpad cinza mais claro e **menos reflexivo**; teclas metálicas.
   Logo traseiro feito como **mapa de roughness** (imagem em Non-Color no Roughness).
6. Animação: dobradiça parentada à tela, abrindo em **100 quadros**, interpolação **Linear**
   (escolha dele; ver conflito na seção 2).
7. Câmera com **DOF f/6.7** e **distância de foco animada** do quadro 0 ao 40 (rack focus); câmera
   desliza devagar, com a alça da chave final puxada para ficar ainda mais lenta.
8. **Piso colorido com roughness baixa** para ver o reflexo da tela no chão.
9. **Reflexos que passam:** planos compridos em **emissão branca força 3**, com Array, acima do
   notebook, parentados a um Empty que **gira ao longo de 100 quadros**. As faixas correm pela
   tela e pelo metal.

---

### 1.10 Easily animate icons in Blender | Geometry Nodes

- Canal: George Kayesi (25 mil views, 4 min)
- Link: https://youtu.be/qgTQ-ULnalQ
- Nota: **3**. Ícones da tela de um celular reagindo a um ponto invisível, procedural.
- Software: Blender com Geometry Nodes (versão não declarada).

Técnicas:
1. Ícones 3D, cada um um objeto, numa coleção própria.
2. Plano (5 cm) com Geometry Nodes: **Collection Info** (Relative, **Separate Children**) ligado a
   **Scale Instances**. A coleção original fica desligada no viewport e no render.
3. Empty (Plane Axes, raio 5 cm) trazido como **Object Info** (Relative).
4. **Vector Math > Distance** entre a localização do Empty e o **Position**; **Map Range**; o
   resultado vai na **Scale** do Scale Instances. Mover o Empty faz os ícones crescerem perto dele.
5. **Bounce procedural:** um **Color Ramp** entre o Map Range e a escala, preto em **~0.35**,
   branco em **~0.7** e mais **duas paradas** extras (uma branca) para criar o sobe-passa-volta.
6. Animação = chaves só na posição do Empty (vista frontal ortográfica).

---

### 1.11 3D Animated UI Design Teaser Tutorial - Blender & After Effects

- Canal: jammed. (43 mil views, 11 min)
- Link: https://youtu.be/tgRYK4AXOek
- Nota: **2**. Superficial, mas traz dois princípios de ritmo (música e storyboard).
- Software: Blender 2.9x/3.x com EEVEE legacy (Bloom, SSR, AO como caixas), After Effects.

Técnicas:
1. iPhone pronto do Blend Swap via **Append**; troca a imagem do material da tela por um **vídeo
   do protótipo** do app, na **mesma resolução da tela**; ligar **Auto Refresh** no nó para o vídeo
   tocar na timeline.
2. **Fundo infinito (cyclorama):** plano grande, extruda a aresta de trás para cima em Z, **bevel
   com vários cortes** na quina, shade smooth. Fundo preto.
3. Luz: a lâmpada padrão **atrás do celular** (contraluz) + duplicada como preenchimento.
4. EEVEE: mais amostras, AO, Bloom (threshold mais alto para não estourar), SSR, motion blur.
5. **Música primeiro:** áudio no Video Sequencer, corta o trecho, e a duração da cena segue a
   duração da música.
6. **Chave final primeiro:** posa o celular onde ele termina, chave em location/rotation/scale;
   depois volta ao quadro 1, tira o celular para fora do quadro pela esquerda e chave. Entra "no
   tum" da música; ajuste com **Ease Out** e interpolação até casar com o som.
7. Câmera e contraluz também animados; cores animadas. **Storyboard** antes para decidir como cada
   corte passa para o próximo.
8. Render em **sequência PNG** (retoma se travar). Depois, no After Effects, texto rastreado
   (motion tracking) preso a um ponto da tela do celular.

---

## 2. Síntese do tema

### 2.1 Regras consolidadas

| # | Regra | Por quê | Valores | Sinal de erro | Fonte |
|---|---|---|---|---|---|
| 1 | **A tela é um sanduíche, não uma placa.** Corpo, vidro, fundo da UI, cartões e ícones em objetos separados, cada um numa altura. | A profundidade só aparece quando há sobreposição e sombra entre camadas; uma placa com imagem é lida como 2D. | Mínimo: separar o bastante para não dar z-fighting (Derek). Faixa de partida para UI "explodida": ver Receita 1 [conhecimento geral]. | Imagem lisa, sem sombra de um elemento sobre outro; flicker de faces coplanares. | Derek; Polygon Runway; Motion Nations (cards) |
| 2 | **Misture famílias de material na mesma peça:** chapado, emissivo, metálico, vidro. | O contraste entre famílias cria hierarquia e interesse; tudo igual vira plástico. | Preto Roughness 0.9 (fosco); tela/glossy 0.0-0.1; emissão em ícones; metal no herói. | Todos os objetos com o mesmo brilho. | Derek; Aryan; Polygon Runway |
| 3 | **Tela brilhante precisa de algo para refletir.** Ponha fontes que desenham reflexo: faixas emissivas, HDRI, spots mirados, piso brilhante. | Roughness baixa sem ambiente reflete preto; o "vidro" some. | Faixas emissão 3 girando em 100 quadros; spots 1500 W só no herói; piso roughness baixa; HDRI força 1. | Tela parecendo papel ou preta chapada. | Aryan; Polygon Runway; Motion Nations (cards) |
| 4 | **Vidro = espessura + borda chanfrada + fundo com desenho + algo claro atrás.** | Refração só se nota distorcendo um padrão; vidro sem nada claro atrás sai preto. | Solidify + Bevel; chão em grade (Brick); placa clara sob a superfície; IOR 1.1-1.2 no "plástico de vidro". | Vidro preto, ou invisível, ou igual a um plano transparente. | kutson; MiGo |
| 5 | **Mate a sombra escura do vidro.** | A sombra cheia de um painel de vidro denuncia "objeto opaco" e suja a UI. | Mix Glass/Transparent com fator Is Shadow Ray (Cycles). | Mancha escura sob o painel. | kutson |
| 6 | **Um brilho tem que andar pela borda.** | É o que faz o vidro parecer vivo e caro; reflexo parado é foto. | Area light em Follow Path na curva da borda, Track To no controle, light linking só nos painéis. | Vidro "morto" que só aparece quando a câmera mexe. | kutson; Aryan (faixas que passam) |
| 7 | **A interação manda no movimento.** Nada gira ou rola sem um "porquê": toque, swipe, clique. | O olho entende causa e efeito; movimento sem gatilho parece protetor de tela. | Carrossel gira só no swipe; onda nasce no quadro do clique (40); tapper aparece 4-5 quadros antes da rolagem. | Elementos se mexendo o tempo todo, sem foco. | Motion Nations (AE); MiGo; Derek |
| 8 | **Rolagem é flick: dispara e desacelera longo.** Nunca o ease-in-out padrão. | É como o polegar joga o feed. | Saída curta, chegada longa; recuo de alguns quadros antes do próximo flick. | Rolagem "elevador" (lenta, rápida, lenta). | Derek |
| 9 | **Entrada é rápida e assenta** (ease out), com elementos filhos atrasados. | Dá peso e leitura; o atraso dos filhos dá profundidade no tempo. | Aparelho 0 a 1 em 30 quadros, Quadratic Ease Out, queda Z e giro Y; ícones 1-10-15 com overshoot; atraso de ~10 quadros entre telas (e depois comprimir). | Tudo chega junto, linear, e para seco. | Derek; kutson; Motion Nations (AE) |
| 10 | **Mudança de estado muda o mundo.** Ao trocar de tela/modo, a luz, o fundo, o World e a emissão mudam junto. | A troca vira acontecimento; não é só um elemento deslizando. | Luz 1500 a 15 W; emissão 15 a 0 em 15 quadros e 0 a 15 até o 30; Base Color e World com chave. | Toggle desliza e nada mais reage. | Polygon Runway |
| 11 | **Quando a UI acende, o fundo apaga.** | Dirige o olho sem corte. | Fundo -1 de exposição no toque. | UI competindo com fundo claro. | Motion Nations (AE) |
| 12 | **Nunca deixe o aparelho parado.** Flutuar leve + câmera com respiro. | Imobilidade total parece render de catálogo. | Sobe/desce e giro pequenos no controle; câmera com empurrões mínimos e loop (chave 1 = chave 121). | Quadros congelados entre ações. | Derek; Polygon Runway |
| 13 | **Cartões curvam e assentam.** Conteúdo entra envergado e endireita, ou se curva ao girar. | Quebra a rigidez de "retângulo colado". | Simple Deform Bend até 0 no quadro 30; curvatura 0 a -40 em 25 quadros. | Placas rígidas girando como portas. | Derek; Vane Motion |
| 14 | **A câmera continua depois da transição.** | Movimento que termina junto com a transição parece degrau. | Câmera recua (-300 no AE) a partir do fim da forma. | Transição para, câmera para, tudo para. | Vane Motion |
| 15 | **Paralaxe vem de camadas em Z com câmera perspectiva.** | Ortográfica achata; profundidade precisa de perspectiva. | Grade 1000 px atrás; camadas de fundo/meio/frente. | "Fundo pintado" atrás do produto. | Vane Motion |
| 16 | **Impacto físico é Linear; gesto de UI é eased; subida de recompensa é Linear.** | Linear mantém velocidade no contato e dá "subida mecânica"; ease dá leitura ao gesto. | Colisor -16 a 0 em 13 quadros linear; coração sobe linear; UI com ease out. | Impacto fraco (ease no colisor) ou UI robótica (linear no gesto). | Motion Nations (cards); Derek |
| 17 | **Uma recompensa por peça.** O clímax é um retorno visível da ação (coração, check, número). | Fecha a pergunta "e daí?" do vídeo de app. | Toque duplo de 4 quadros por toque; coração ~10 quadros com overshoot; aparelho sai antes. | Peça sem clímax, termina no meio da rolagem. | Derek |
| 18 | **A UI de verdade vale mais que imagem achatada.** Use SVG/vetores ou partes separadas do layout. | Cada parte vira objeto com espessura e material próprios. | SVG do Figma, Origin to Geometry, controle por Empty. | Print de tela num plano. | kutson; Derek |
| 19 | **Tela com conteúdo vivo.** Vídeo do protótipo como textura, rodando. | Interface parada lê como foto. | Mesma resolução da tela; Auto Refresh. | Imagem estática por 15 s. | jammed. |
| 20 | **Música e storyboard antes da animação.** | Os cortes e as entradas caem no tempo do som; transições planejadas. | Duração da cena = trecho da música; entrada "no tum". | Animação boa que não casa com nada. | jammed. |

### 2.2 Conflitos entre as fontes

- **EEVEE x Cycles.** Derek e jammed. usam EEVEE pela velocidade; quem faz vidro e transmissão
  (kutson, MiGo, Polygon Runway, Motion Nations cards, Aryan) renderiza em Cycles. kutson ainda
  relata um glow que só funcionou no EEVEE. Decisão para nós: vidro de verdade vai para Cycles
  (OptiX existe na máquina **[verdade 5.2]**) ou EEVEE com raytracing ligado (`use_raytracing`
  **[verdade 5.2]**); peça chapada/estilizada pode ir de EEVEE (~3 s por quadro em 1080x1920 com
  16 amostras **[verdade 5.2]**).
- **Ortográfica x perspectiva.** Derek usa ortográfica (visual de infográfico, ícone isométrico).
  Vane e Aryan dependem de perspectiva (paralaxe, DOF). Para "nível produtora" de produto digital,
  perspectiva com lente longa é o padrão; ortográfica fica para peça estilizada flat.
- **Linear na abertura do notebook (Aryan) x ease em gesto (Derek, jammed.).** Aryan põe Linear na
  dobradiça. Pelas regras 9 e 16, abertura de tampa é gesto e pede ease out [conhecimento geral];
  Linear só para impacto e subida mecânica.
- **Glass BSDF misturado (kutson, Motion Nations) x Principled com transmissão (MiGo, Polygon).**
  Os dois existem no 5.2. Principled usa **Transmission Weight** **[verdade 5.2]**. O truque do Is
  Shadow Ray é de Cycles; no EEVEE a sombra de objeto transmissivo se controla por material
  [conhecimento geral, sondar].
- **Constant "nos dois" (TheMathewFlames) x curvas suaves (todo o resto).** Snappy de animação
  estilizada não serve para UI premium; manter só como linguagem alternativa.

### 2.3 Versão antiga para Blender 5.2

| O tutorial ensina | No 5.2 | Marca |
|---|---|---|
| EEVEE com caixas "Bloom", "Screen Space Reflections", "Ambient Occlusion", "Soft Shadows" (Derek, jammed.) | EEVEE novo (`'BLENDER_EEVEE'`; o nome `BLENDER_EEVEE_NEXT` não existe). Reflexo/AO pelo `use_raytracing` e `fast_gi`. Bloom saiu do EEVEE: vira nó **Glare** no compositor. | [verdade 5.2] para motores e raytracing; Glare/bloom [conhecimento geral, sondar] |
| `scene.node_tree` + `use_nodes` para compositor | `scene.compositing_node_group` (CompositorNodeTree) | [verdade 5.2] |
| Principled "Specular" baixo para tirar brilho (Derek, na imagem do logo) | **Specular IOR Level** | [verdade 5.2] |
| "Transmission" = 1 (MiGo, Polygon) | **Transmission Weight** | [verdade 5.2] |
| "Emission" + "Strength" (Polygon) | **Emission Color** + **Emission Strength** | [verdade 5.2] |
| "Clearcoat" para camada de verniz | **Coat Weight / Coat Roughness / Coat IOR** | [verdade 5.2] |
| Color management "High Contrast" (Polygon) / trocar para Standard | Ficar em **AgX**; looks com nome exato, ex.: `AgX - Medium High Contrast`, `AgX - Punchy`. Standard estraga a cor. | [verdade 5.2] |
| `action.fcurves` em script | Channelbag por slot: `anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot)` | [verdade 5.2] |
| Interpolação por menu T (Quadratic, Linear) | `kp.interpolation` = `QUAD`, `LINEAR`, `EXPO`, `BACK`...; `kp.easing` = `EASE_OUT`... vale para o trecho que começa na chave | [verdade 5.2] |
| Normals > Auto Smooth (Derek) | Saiu no 4.1; usar **Shade Auto Smooth** / modificador **Smooth by Angle** | [conhecimento geral] |
| Add-on "Import Images as Planes" (Derek) | Embutido desde o 4.2 (Add > Image > Mesh Plane / File > Import) | [conhecimento geral] |
| Bool Tool add-on (Polygon) | Extensão (ele mesmo mostra pelo Get Extensions) | fonte + [conhecimento geral] |
| Light com temperatura por cor RGB | `light.use_temperature = True; light.temperature = 5600` | [verdade 5.2] |
| Light linking (kutson) | `obj.light_linking.receiver_collection` / `blocker_collection` | [verdade 5.2] |
| Area light com Spread (Motion Nations) | `spread` existe; formas `SQUARE`, `RECTANGLE`, `DISK`, `ELLIPSE` | [verdade 5.2] |
| Motion blur "nas configurações do EEVEE" (jammed.) | `render.use_motion_blur`, `render.motion_blur_shutter` | [verdade 5.2] |
| `shape_key_add` | Nasce com valor 1.0: zerar logo depois | [verdade 5.2] |

---

## 3. Receitas para testar no Blender

Unidades: metros, 30 fps. Os valores com fonte vêm do vídeo; os demais estão marcados.

### Receita 1: Celular-sanduíche (anti-placa)

Objetivo: substituir a placa com imagem por 5 camadas.

1. Corpo: plano 0.0715 x 0.147 m (proporção de celular [conhecimento geral]); em edit, bevel de
   vértices com **Clamp Overlap e 16 segmentos** (Polygon); **Solidify** 0.0078 m
   [conhecimento geral]; Bevel modifier 3 segmentos, **Harden Normals** (Polygon).
2. Moldura e vidro de capa: duplicata do contorno, levemente menor, Z +0.0004 m acima do corpo
   [conhecimento geral]. Material: Principled, Base Color quase preto, Roughness 0.02-0.05, Coat
   Weight 1 [conhecimento geral]. É ela que pega o reflexo das faixas (Receita 6).
3. Fundo da UI (camada 0): plano dentro do vidro com a cor/gradiente do app em **Emission Color**,
   Emission Strength 1-3 sob AgX [conhecimento geral].
4. Cartões e listas (camada 1): objetos separados, Solidify fino, subidos acima do fundo. Para
   leitura "real": 0.0005-0.001 m. Para UI "explodida" de motion: 0.004-0.012 m, mais a camada 2
   (ícones, botões) mais 0.003-0.006 m acima [conhecimento geral, calibrar em teste]. Regra mínima
   da fonte: nunca coplanar (Derek).
5. Ícones e glifos (camada 2): linhas por **Skin modifier** ou SVG extrudado, material emissivo
   (Derek; kutson).
6. Tudo parentado a um **Empty controle** (Derek, kutson).
7. Prova: render de uma câmera a 30-40° do plano da tela; deve haver sombra de contato de cada
   camada na de baixo e o reflexo da faixa só na capa de vidro.

### Receita 2: Feed rolando com máscara (Derek)

1. Post: plano quadrado; edge loop + bevel de 1 corte, apaga a face para separar a faixa de ícones.
2. Modificadores, nesta ordem: **Solidify**, **Array** (Relative Offset X 0, Y **-1.05**
   [conhecimento geral para o espaçamento], count **12**), **Boolean** Intersect com o cubo cutter.
3. Cutter: `display_type = 'BOUNDS'`, `hide_render = True`, dimensionado da barra de cima à de
   baixo; parentado ao controle junto com o resto.
4. Chaves em location Y do post: quadro **30** início; flick até o quadro ~60; segura até ~90;
   recuo de 3-4 quadros para trás; segundo flick até ~125 (tempos de Derek aproximados).
5. Flick no 5.2:
   ```python
   from bpy_extras import anim_utils
   ad = posts.animation_data
   cb = anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot)
   for fc in cb.fcurves:
       if fc.data_path == "location" and fc.array_index == 1:
           for kp in fc.keyframe_points:
               kp.interpolation = 'EXPO'   # ou 'QUART'
               kp.easing = 'EASE_OUT'
   ```
   (EXPO/QUART Ease Out é a aproximação por preset do flick feito à mão por Derek
   [conhecimento geral].)
6. Se o boolean gerar faces piscando em algum quadro, mudar a chave um quadro (Derek).

### Receita 3: Entrada do aparelho que assenta (Derek)

1. Controle: escala **0 no quadro 1, 1 no quadro 30**; Z começando acima; rotação Y com alguns
   graus; interpolação **`QUAD` + `EASE_OUT`**.
2. Filhos atrasados: posts com Z inicial mais alto chegando no quadro 30.
3. **Simple Deform** nos posts: `deform_method = 'BEND'`, eixo Y (com o eixo do objeto girado 90°,
   como no vídeo), ângulo de ~30° [conhecimento geral] no quadro 1 até **0 no quadro 30**. Precisa
   de edge loops no post.
4. Depois do 30: flutuar contínuo no controle (Z +-0.002 m, rotação +-1.5° em ciclos de 3-4 s
   [conhecimento geral]).

### Receita 4: Painel liquid glass (kutson), Cycles

1. UI em SVG (Figma) importada; Origin to Geometry; limpar geometria demais.
2. Painel: **Solidify** (0.004-0.008 m num painel de ~0.1 m [conhecimento geral]) + **Bevel**
   modifier (largura ~40% da espessura, 4-6 segmentos [conhecimento geral]).
3. Material:
   ```python
   m = bpy.data.materials.new("vidro_liquido"); m.use_nodes = True
   nt = m.node_tree; nt.nodes.clear()
   out  = nt.nodes.new("ShaderNodeOutputMaterial")
   mix  = nt.nodes.new("ShaderNodeMixShader")
   glas = nt.nodes.new("ShaderNodeBsdfGlass")
   trn  = nt.nodes.new("ShaderNodeBsdfTransparent")
   lp   = nt.nodes.new("ShaderNodeLightPath")
   glas.inputs["Roughness"].default_value = 0.05   # [conhecimento geral]
   glas.inputs["IOR"].default_value = 1.45          # [conhecimento geral]
   nt.links.new(lp.outputs["Is Shadow Ray"], mix.inputs[0])
   nt.links.new(glas.outputs[0], mix.inputs[1])
   nt.links.new(trn.outputs[0], mix.inputs[2])
   nt.links.new(mix.outputs[0], out.inputs["Surface"])
   ```
   Segundo painel atrás: o mesmo com o Color do Glass um tom mais escuro (kutson).
4. Fundo com desenho: chão com **Brick Texture** preto e branco, squash 1 (kutson); offset 0 para
   grade alinhada [conhecimento geral]. Na peça final, trocar a grade pela própria UI/fundo de
   marca, mas sempre com detalhe atrás do vidro.
5. Luz de cima, Area grande e suave (kutson).
6. Brilho de borda: duplicar a aresta externa, `convert(target='CURVE')`, aplicar escala; Area
   pequena (0.01-0.02 m, alta potência [conhecimento geral]) com constraint **`FOLLOW_PATH`** na
   curva (animar `offset` ou o `eval_time` da curva de 0 a 100% em 2-3 s [conhecimento geral]) e
   **`TRACK_TO`** no Empty controle.
7. `luz.light_linking.receiver_collection = colecao_paineis` **[verdade 5.2]**.
8. Ícones: escala **0 (q1) / ~1.15 (q10) / 1 (q15)**, atraso de 2-3 quadros entre ícones
   (overshoot de 1.15 e atraso em [conhecimento geral]; quadros 1/10/15 de kutson).
9. Variante EEVEE: `scene.eevee.use_raytracing = True`; Principled com Transmission Weight 1,
   Roughness 0.05; no material, renderização por raytrace de refração
   (`material.use_raytrace_refraction = True`, `surface_render_method = 'DITHERED'`)
   [conhecimento geral, sondar].
10. Prova: o padrão do fundo tem que entortar visivelmente na borda chanfrada, a sombra sob o
    painel tem que ser clara e o brilho tem que dar a volta.

### Receita 5: Toggle de estado claro/escuro (Polygon Runway), Cycles

1. Pílula: plano, bevel de vértice com Clamp Overlap, 16 segmentos; extrude; Shift+N.
2. Placa: plano x10 extrudado, recorte Difference, Bevel 4 segmentos + Harden Normals.
3. Knob: círculo 32 vértices, extrude, fill, bevel 4 cortes, insets, Subdivision 2.
4. Encaixe: grupo "borda" na loop de baixo; **Shrinkwrap** (vertex_group = borda, alvo = placa);
   **Data Transfer** (`use_loop_data = True`, `data_types_loops = {'CUSTOM_NORMAL'}`,
   `loop_mapping = 'POLYINTERP_NEAREST'`, vertex_group = borda).
5. X da peça: q1 posição A, q30 posição B, q60 B, q90 A, q120 A. 120 quadros, 30 fps.
6. Material comum glossy **Roughness 0.1**.
7. Texto A: Transmission Weight alto + Emission Color azul, **Strength 15 no q1, 0 no q15**, de
   volta a 15 entre q75 e q90. Texto B: laranja, **0 no q15, 15 no q30**, volta a 0 entre q60 e
   q75.
8. Area principal **1500 W (q1) a 15 W (q30)**; Base Color do fundo mais escura no q30; cor do
   World mais escura no q30; tudo espelhado de volta em q60/q90.
9. Dois **Spot 1500 W** com cone só no knob, reposicionados no estado escuro; Area **500 W** de
   contraluz.
10. Câmera: chave no q1 copiada no q121; 3-4 desvios pequenos no meio. Motion blur ligado. 128
    amostras com denoise. AgX com look `AgX - Medium High Contrast` no lugar do "High Contrast"
    antigo [verdade 5.2 para o nome].

### Receita 6: Reflexos que passam pela tela (Aryan)

1. Tela com Roughness **~0.02**, piso colorido com Roughness baixa (0.1-0.2 [conhecimento geral]).
2. Faixa: plano comprido, **Emission branca força 3**, **Array** de 3-5 faixas
   [conhecimento geral para a contagem], acima do aparelho e fora do quadro da câmera.
3. Faixas parentadas a um Empty que gira ao longo de **100 quadros** (Aryan).
4. Para não clarear o resto da cena: a faixa só serve de reflexo; no Cycles,
   `obj.visible_camera = False` e manter visível em reflexão [conhecimento geral].
5. Prova: num frame do meio, a faixa precisa estar cruzando a tela e aparecer no piso.

### Receita 7: Onda na UI quando o cursor clica (MiGo)

1. Placa da UI: plano com muitas loops em X (subdividir até ~100 colunas [conhecimento geral]),
   Solidify, depois Subdivision 2.
2. Cilindro de **80 vértices** deitado, oculto no render, varrendo X em **60 quadros**, com chave
   extra no meio (rápido, lento, rápido).
3. Modificadores na placa, nesta ordem: **Vertex Weight Proximity** (`proximity_mode =
   'GEOMETRY'`, `proximity_geometry = {'FACE'}`, alvo = cilindro, `falloff_type = 'SMOOTH'`,
   `normalize = True`; para peso 1 perto do cilindro: `min_dist = 0.7`, `max_dist = 0.0`
   [conhecimento geral sobre a ordem dos campos]), **Displace** (vertex_group, força ~0.2-0.4),
   **Wave** (origem num Empty no canto, `speed = 0.35`, largura estreita, altura com chave **0 no
   q40, 1.1 no q42, 0 no q52**), **Solidify**, **Subdivision 2**.
4. Seta/cursor desce e toca a placa no **q40**; Bezier lenta no contato.
5. Anéis: toro fino, **22 segmentos**, Array em Z com Object Offset num Empty; o Empty escala de
   0 para cima quando a seta toca e volta quando ela sobe.
6. Material da placa: Principled Transmission Weight 1, Roughness baixa, **IOR 1.1-1.2**; **placa
   clara embaixo** para o vidro não ficar preto. UI/botão em Image Texture ligada à Emission Color.

### Receita 8: Ícones reagindo a um ponto invisível (George Kayesi, Geometry Nodes)

1. Coleção "icones" (um objeto por ícone), desligada no viewport e render.
2. Plano 0.05 m com Geometry Nodes:
   `Collection Info (Relative, Separate Children) -> Scale Instances -> Group Output`.
3. `Object Info (Empty, Relative).Location` e `Position` em **Vector Math (Distance)**;
   `-> Map Range -> Color Ramp -> Scale` do Scale Instances.
4. Color Ramp: preto em **0.35**, branco em **0.7**, mais duas paradas (ex.: branco em 0.5 e cinza
   claro em 0.6 para o overshoot [conhecimento geral para as posições extras]).
5. Animar só a posição do Empty passando pela grade de ícones. Variação: o Empty segue o cursor
   da Receita 7, e os ícones "acordam" por onde o cursor passa.

### Receita 9: Carrossel de cartões de recurso (Vane Motion + Motion Nations AE)

1. N cartões (6 nos dois vídeos) com cantos arredondados (bevel de vértice), espessura fina,
   gradiente da paleta, contorno emissivo, ícone num círculo e texto.
2. Cada cartão parentado a um Empty central, girado **360/N** (60° para 6) e afastado do centro.
3. Empty: rotação Z (ou Y, conforme o eixo da cena) de **0 a 360° em 6 s (180 quadros)** e
   inclinação fixa de **25°** no outro eixo (Vane); `BEZIER` com ease longo (influência ~70%).
4. Curvatura: **Simple Deform Bend** em cada cartão, ângulo de 0 a ~40° [conhecimento geral para a
   conversão do "-40" do AE] em **25 quadros**, com subdivisão suficiente (equivalente aos 20
   segmentos).
5. Leve transparência: Principled Alpha 0.98 ou Transmission Weight baixo [conhecimento geral]
   (Vane usa opacidade 98%).
6. Entrada: cartões de baixo, escala 0, com **10 quadros** de atraso e depois comprimir para ~5
   (Motion Nations AE).
7. Glow: moldura emissiva forte atrás de cada cartão + Glare no compositor
   (`scene.compositing_node_group`) [verdade 5.2 para o local; Glare em conhecimento geral].

### Receita 10: Cartões soprados por física (Motion Nations)

1. Cartão: plano, Array Constant Offset Z **0.1**, X 0, count **11**; subdividir 4 em edit;
   Subdivision Surface **3/3**; Solidify.
2. Cloth: preset Silk; `quality = 35`; `tension_stiffness = 5`; `compression_stiffness = 2`;
   `shear_stiffness = 2`; self collision ligada, qualidade **10**.
3. Base com Collision. Colisor: Z **-16 (ou -20) no q1 a 0 no q13**, **`LINEAR`**.
4. Displace Clouds (tamanho 2, coordenadas Object num Empty, direção Z, midlevel 0), força **0 a
   0.4** quando os cartões já estão no ar.
5. Bake 90 quadros. Depois: aplicar o Array, um material por cartão (gradiente, vidro, UI).
6. Luz: HDRI estúdio força 1 + Area 200 W com Noise + Color Ramp nos nós da luz e Spread 1 (gobo)
   (nós de luz são do Cycles [conhecimento geral]).
7. Render: Cycles 32-64 amostras com denoise.

### Receita 11: Indicador de toque e recompensa (Derek)

1. Tapper: disco fino emissivo branco a ~60% de alfa [conhecimento geral], parentado ao conteúdo
   que rola. Escala 0 a 1 em **4-5 quadros** antes do gesto; some no fim; só muda de lugar
   invisível.
2. Toque duplo: escala **0, 1, 0.1, 1, 0** em ~10-12 quadros no total [conhecimento geral para o
   total; sequência de Derek].
3. Recompensa (coração/check/selo): Solidify + Bevel com Limit Method Angle e Clamp; metal ou cor
   da marca. Escala 0 a 1 em ~10 quadros com `BACK`/`EASE_OUT` [conhecimento geral para o preset],
   sobe em Z `LINEAR` até o fim, sai por escala no fim. O aparelho sai por escala alguns quadros
   antes.

### Receita 12: Tela com vídeo do produto (jammed.)

1. Gravar/renderizar o protótipo na **resolução exata da tela** (ex.: 1179x2556 de um iPhone
   [conhecimento geral]).
2. Image Texture com o vídeo: `img.source = 'MOVIE'`; `tex.image_user.frame_duration = N`;
   `use_auto_refresh = True`; `use_cyclic` se for loop [conhecimento geral, sondar].
3. Ligar na **Emission Color** do fundo da UI (camada 0 da Receita 1), nunca como única camada.

### Receita 13: Foco dirigido (Motion Nations AE + Aryan)

1. Quando a UI acende: `scene.view_settings.exposure` ou a força do World cai o equivalente a
   **-1** em ~10 quadros [conhecimento geral para o tempo]; chave por
   `scene.keyframe_insert('view_settings.exposure')` [conhecimento geral]. Melhor ainda: baixar só
   as luzes do fundo, para a UI emissiva manter o brilho.
2. Rack focus: `cam.data.dof.use_dof = True`, f-stop baixo, `focus_distance` com chave do q0 ao
   q40 (Aryan; f/6.7 no vídeo, abrir mais para aparelho pequeno [conhecimento geral]).

### Receita 14: Transição por forma (Vane, traduzida)

1. Forma da marca (estrela de 4 pontas do vídeo, ou o símbolo do cliente) como mesh plana,
   parentada à câmera.
2. Animar: escala que preenche o quadro a escala pequena, rotação **-45° a 90° a 270°** em ~3 s,
   velocidade contínua nos pontos do meio (sem parar).
3. Renderizar a cena 1 e a cena 2 em View Layers separadas e usar a forma (por ID/Cryptomatte ou
   holdout) como máscara no compositor `scene.compositing_node_group` [conhecimento geral, testar].
4. A câmera da cena 2 continua recuando depois que a forma termina (Vane).

---

## 4. Estruturas prontas

Nenhuma fonte entrega um roteiro de app de 15 s ou de SaaS de 30 s inteiro. Os roteiros abaixo
são montados **com batidas que existem nas fontes**, cada uma com a origem ao lado; o que é costura
minha está marcado. 30 fps.

### 4.1 Vídeo de app: 15 s (450 quadros), vertical ou quadrado

| Tempo | Quadros | O que acontece | Fonte |
|---|---|---|---|
| 0,0-1,0 s | 1-30 | Celular entra: escala 0 a 1, cai em Z, gira em Y, QUAD Ease Out. Conteúdo entra envergado (Bend) e endireita no q30. Alternativa: desliza da lateral "no tum" da música. | Derek; jammed. |
| 1,0-1,5 s | 30-45 | Assenta. Começa o flutuar leve e a câmera com respiro. Tela já com vídeo/UI viva. | Derek; Polygon; jammed. |
| 1,5-2,0 s | 45-60 | Tapper aparece (4-5 quadros) no ponto de toque. | Derek |
| 2,0-3,0 s | 60-90 | Primeiro flick de rolagem (dispara, desacelera longo). | Derek |
| 3,0-4,0 s | 90-120 | Pausa de leitura; recuo de polegar de 3-4 quadros. | Derek |
| 4,0-5,0 s | 120-150 | Segundo flick até o item que importa. | Derek |
| 5,0-6,5 s | 150-195 | Ícones/recursos estouram em sequência: 0 / overshoot no q10 / final no q15 de cada um, atrasados. | kutson; George (versão procedural) |
| 6,5-8,0 s | 195-240 | Troca de estado ou tela: elemento desliza em 1 s e **a luz, o fundo e a emissão mudam junto**. | Polygon |
| 8,0-10,0 s | 240-300 | Camadas saem da tela em profundidade: cartões sobem do vidro, um a um (atraso ~5 quadros), e o fundo escurece -1. Um brilho corre na borda do vidro. | Motion Nations AE; kutson; Derek (camadas) |
| 10,0-11,5 s | 300-345 | Toque duplo (4 quadros cada toque) e recompensa (coração/check) em ~10 quadros, subindo linear. | Derek |
| 11,5-12,5 s | 345-375 | Celular sai por escala, um pouco antes da recompensa sair. | Derek |
| 12,5-15,0 s | 375-450 | Logo + chamada. Texto por caractere de baixo, Ramp Up, ease. Câmera ainda se movendo devagar. | Vane (texto e câmera contínua); marca no último post em Derek. Duração do fecho [conhecimento geral] |

Ritmo: as entradas caem nos acentos da música escolhida antes de animar (jammed.). Se o corte for
diferente, o storyboard decide qual batida encurta (jammed.).

### 4.2 Vídeo de SaaS: 30 s (900 quadros), horizontal 1920x1080

| Tempo | Quadros | O que acontece | Fonte |
|---|---|---|---|
| 0-1 s | 1-30 | Fundo de marca: gradiente de 4 cores, feixe de luz borrado, partículas só dentro do feixe. Cartões de recurso estouram em sequência (atraso 10 quadros comprimido). | Vane; Motion Nations AE |
| 1-3 s | 30-90 | Carrossel de 6 cartões girando (360° em 6 s, inclinação 25°); cartões curvam em 25 quadros; vidro a 98%. | Vane |
| 3-4,5 s | 90-135 | Transição por forma da marca voando para a câmera, girando sem parar; dentro dela, a cena 1; fora, a cena 2. | Vane |
| 4,5-8 s | 135-240 | Headline do problema/produto em texto 3D por caractere; grade ao fundo em Z para paralaxe; câmera continua recuando depois da transição. | Vane |
| 8-11 s | 240-330 | Notebook abre (ease out, não linear), rack focus do q0 ao q40 da cena, faixas de luz passando pela tela e pelo metal, reflexo no piso. | Aryan (+ regra 16) |
| 11-15 s | 330-450 | Prova do produto: a tela toca o vídeo real do sistema. Cursor desce e clica: onda na UI e anéis no ponto do clique. | jammed.; MiGo |
| 15-18 s | 450-540 | Do clique, painéis saem da tela em camadas para a frente do notebook; fundo escurece -1; glow nos contornos. | Motion Nations AE; Derek (camadas) |
| 18-22 s | 540-660 | Recursos: grade de ícones acordando por onde o cursor passa; um toggle muda o estado e a luz da cena toda acompanha. | George; Polygon |
| 22-26 s | 660-780 | Resultado em painel liquid glass (o número/benefício), com brilho correndo na borda e refração do fundo. | kutson |
| 26-28 s | 780-840 | Cartões soprados ou carrossel voltando como "tudo num lugar só" (opcional). | Motion Nations (cards); Vane |
| 28-30 s | 840-900 | Logo e chamada; câmera assenta mas não para de vez; brilho final. | Vane (brilhos e câmera); fecho [conhecimento geral] |

Observação honesta: o único vídeo com estrutura de explicativo de SaaS é o da Vane, e ele cobre
~12 s (carrossel, transição, texto e paralaxe). Do segundo 8 em diante, o roteiro é costura minha
com técnicas de outras fontes; a ordem problema, produto, prova, resultado, chamada é
[conhecimento geral] de explicativo, não vem das transcrições.

---

## 5. Contribuição pro Cérebro de Diretor

Princípios que este tema acrescenta ao jeito de decidir de um diretor de motion para app/SaaS:

1. **Pergunta de abertura de toda cena de tela:** "quantas camadas essa tela tem e o que separa
   cada uma?". Menos de três camadas com materiais diferentes é placa; volta para a bancada.
2. **Pergunta de luz para toda superfície brilhante:** "o que essa superfície está refletindo
   agora?". Se a resposta é "nada", ela vai sair preta ou de papel. Pôr faixa, spot mirado ou HDRI.
3. **Vidro só existe com três coisas:** espessura chanfrada, desenho atrás para distorcer e um
   brilho que anda. Faltou uma, não chame de vidro.
4. **Causa antes de efeito.** Todo movimento da UI tem um gatilho visível um pouco antes (dedo,
   cursor, swipe). O gatilho entra 4-5 quadros antes da reação.
5. **A troca de estado é um acontecimento de cena**, não um deslize: luz, fundo, World e emissão
   respondem.
6. **Foco por subtração:** quando a UI acende, o resto apaga. Não brigar por atenção.
7. **Curvas com intenção:** gesto de UI = ease out (flick ou assentar); impacto e subida mecânica
   = linear; pausa é parte do gesto (segurar chave).
8. **Nada congela.** O aparelho respira e a câmera respira; até a transição termina com a câmera
   ainda andando.
9. **Uma recompensa por peça.** O vídeo de app fecha num retorno visível da ação.
10. **Música e storyboard antes do primeiro keyframe.** As batidas da tabela 4.x são o esqueleto;
    a música decide quanto cada uma dura.
11. **Contraste de famílias de material é hierarquia.** Chapado para informação, emissão para
    ação, metal ou vidro para o herói.

Sinais de "parece IA / parece amador" específicos deste tema: tela como imagem colada sem camada;
todos os objetos com o mesmo brilho; rolagem com ease-in-out; tudo entrando junto; vidro preto;
sombra escura sob painel de vidro; aparelho parado entre ações; transição que para seco.

---

## 6. Lacunas

1. **Profundidade exata das camadas.** Nenhuma fonte dá distância entre camadas de UI; os valores
   da Receita 1 são ponto de partida meu e precisam de teste em render.
2. **Liquid glass completo.** kutson cobre refração, sombra e brilho de borda, mas não o desfoque
   do que está atrás (frosted), a dispersão cromática na borda nem o glow (a solução dele ficou
   fora do vídeo). Falta testar Roughness na transmissão para o fosco e Thin Film/dispersão.
3. **Vidro no EEVEE 5.2.** Nenhuma fonte usa o EEVEE novo; as configurações de refração por material
   estão como [conhecimento geral, sondar]. Precisa de sonda antes de virar regra.
4. **Bloom/Glare no 5.2.** Os tutoriais usam a caixa Bloom do EEVEE antigo; o caminho pelo Glare no
   compositor 5.2 precisa ser confirmado por sonda (nome do tipo e se as opções são entradas ou
   propriedades).
5. **Estrutura de SaaS longa.** Só a Vane cobre parte de um explicativo (~12 s). Faltam fontes
   sobre narrativa com locução, legenda na tela, ordem problema-solução e duração de cada recurso.
6. **Tipografia 3D animada no Blender.** O texto por caractere vem do After Effects; falta a
   tradução testada (Geometry Nodes ou objetos por letra) com os mesmos easings.
7. **Formato vertical 9:16.** Os exemplos são quadrados ou 16:9; enquadramento de celular e
   notebook em vertical não aparece.
8. **Cursor e microinterações de desktop** (hover, arrastar, digitar) não aparecem, só clique (MiGo)
   e toque (Derek).
9. **Som.** Nenhuma fonte trata de sound design de UI (cliques, whooshes), só de sincronizar com
   música (jammed.).
10. **Conteúdo da tela.** Todos importam a UI pronta (Figma, AE, imagem). Falta um caminho para a IA
    gerar a UI do cliente em camadas a partir do site/app real.
11. **Transição por forma no Blender.** A Receita 14 é tradução minha do método do AE; não há fonte
    em Blender.
12. **TheMathewFlames** praticamente não serve ao tema; **jammed.** é raso. Vale buscar mais
    fontes de produtoras de SaaS (lançamento de produto, "product reveal") feitas em Blender.
