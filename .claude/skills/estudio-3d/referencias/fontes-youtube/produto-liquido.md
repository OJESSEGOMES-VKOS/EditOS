# Destilado: produto físico e líquido

Fonte: 16 transcrições (`produto__*` e `liquido_comida__*`) em `pesquisa/transcricoes/`. Legenda
automática interpretada. Conferido contra `.claude/skills/estudio-3d/referencias/blender-5.2-verdade.md`.

Convenções deste arquivo:
- **[cg]** = conhecimento geral meu, não está nas transcrições. Testar antes de virar regra.
- **[5.2]** = como fica no Blender 5.2 quando o vídeo ensina coisa de versão antiga.
- **[sonda]** = nome de API que eu acredito correto mas precisa ser confirmado rodando no 5.2.
- Potências de luz citadas valem para a escala da cena do autor. Mudou a escala, muda a potência
  (lei do inverso do quadrado). Nunca copiar watts sem copiar a distância.

---

## 1. Por vídeo

### 1.1 How to Make Perfect Product Animations in Blender
- Canal: Aryan | https://youtu.be/29hmUGb0384 | Blender 4.4 (arquivo "4.43")
- **Nota 5.** O melhor do lote: três planos completos de comercial (abertura, meio, fechamento)
  com intenção clara em cada um, luz motivada e evento físico no fim.
- **Plano 1, teaser de silhueta (abertura):** câmera alinhada atrás/na frente do produto, focal
  **122 mm**. Duração decidida antes: 2 s = 60 quadros a 30 fps (usou 70). Câmera com chave só de
  posição, sobe em Z do quadro 1 ao 70, interpolação **LINEAR** (velocidade constante, "sem
  acelerar e frear").
- Luz do teaser: **Area atrás do produto, virada para a câmera** (rotação X -90 e empurrada no Z
  local para trás do objeto). Ela acende só as bordas. Forma **Disk** e tamanho grande para borda
  mais macia. Cor = cor do produto (azul na escova; "Monster verde, use verde"). A luz é animada
  junto com a câmera, de baixo para cima, e **cresce em escala** para cobrir o produto inteiro
  quando a câmera chega ao topo. Linear também.
- **Fundo como luz, não como cor:** plano alinhado à vista, empurrado para trás, **parentado à
  câmera** (Ctrl P, keep transform). O gradiente vem de uma **Area Disk alongada colocada logo à
  frente do plano, virada para o plano**, parentada ao fundo e animada subindo com a câmera.
- **Plano 2, detalhe:** produto girado 180°, câmera de baixo olhando a parte de vidro. Duas Area
  compridas (escaladas em Z) nas laterais, giradas em torno do centro do produto (pivô no cursor
  3D) para desenhar **linhas de reflexo** no corpo: começou em 200 W, ficou em **~700 W**, azul
  claro. Duplica e gira para o outro lado.
- Problema e correção: as luzes laterais clarearam o fundo. Solução: **afastar o plano de fundo**
  (escala com pivô na câmera), subir o **clip end da câmera para 3000+** e multiplicar a potência
  da luz de fundo ("adicionar uns zeros") porque ela ficou longe.
- Luz interna: disco com Emission **strength 10**, azul; o vidro do corpo recebe base color igual
  à cor da emissão para saturar. Troca de cor como corte: azul até o quadro 25, **preto no 27,
  verde no 29**, depois vermelho. Mesmas chaves no vidro.
- No plano 2: produto gira um pouco (0 a 70, linear) e a câmera faz zoom out lento animando a
  **focal**, linear. DOF ligado com foco na parte da frente.
- **Plano 3, fechamento:** escova desce devagar (linear até ~30) e **encaixa rápido** no
  carregador no quadro 59; nesse instante nasce uma onda na água. Focal 149 mm, depois 223 mm no
  quadro 51 descendo um pouco (zoom out lento), **pulo da câmera para trás com leve rotação no
  impacto**, e depois continua recuando devagar.
- Água: plano gigante até encostar no fundo, Principled **Metallic 1, Roughness 0** (espelho, sem
  costura no horizonte). Noise Texture (Color) -> Bump (Height) -> Normal; scale alto, strength
  baixo. Movimento da água: chave no **scale do Noise** do quadro 1 ao último (subiu para 525),
  linear.
- Onda: subdividir o plano 1 vez, chanfrar só o vértice central (**Ctrl B, V**) com **profile 0.2
  e 300 segmentos** (anéis densos só onde a onda passa, sem explodir polígonos). **Wave modifier**
  (aplicar escala antes, senão quebra), height **0.21 m**, **cyclic desligado** (uma onda só),
  chave no height até 0 para morrer, **Time > Offset = quadro do impacto (59)**.
- **Light linking:** luz de recorte atrás do produto afeta só a coleção do produto; o reflexo dela
  some da água. Render: Cycles 128 amostras + denoise, 1920x1080, FFmpeg MPEG-4, qualidade
  "perceptually lossless". Estimar tempo: renderizar 1 quadro e multiplicar.

### 1.2 Blender Product Animation Tutorial: How I Made a Ray-Ban Commercial
- Canal: OnlyRJ | https://youtu.be/BS7MK5nqNrw | versão não dita (UI 4.x)
- **Nota 4.** Comercial real de óculos, com "quebra e volta" e partículas. Modelagem longa (pular).
- Escala real importa: o óculos foi para **escala 0.03** para bater com o tamanho real (afeta DOF,
  luz e física).
- Cycles GPU, **200 amostras** (100 também serve). HDRI 4K EXR com **World strength 0.1** (o HDRI
  só dá reflexo, não ilumina a cena).
- Materiais: plástico preto brilhante; lente da câmera **Roughness 0 + Transmission 1**; logo SVG
  importado com base color branca **valor 3** (branco acima de 1 para "estourar").
- Fundo: plano escala 5, aresta de trás extrudada em Z e chanfrada (ciclorama), Diffuse vermelho
  roughness 0.3, gradiente com **Gradient Texture -> Color Ramp** com as duas cores iguais à marca,
  uma mais escura, girado via Mapping.
- Luz em dois pontos: Area grande em cima (potência "35", lida como forte na escala 0.03) e uma
  **Disk lateral vermelha potência 7** para filete de cor da marca no lado. Depois **baixou a luz
  de cima** para ganhar highlights no aro.
- Ritmo: 30 fps, planos de **90 quadros (3 s)**. Plano 1: câmera faz push-in subindo (1 a 90);
  óculos sobe girando devagar até o 70 e **nos últimos 20 quadros sobe rápido**. Interpolação
  trocada de linear para **Bezier** para suavizar.
- Plano 2: duplica câmera, **75 mm**, mais perto. Cena de quebra feita como **cópia completa da
  cena** (Full Copy), 165 quadros.
- Quebra: chaves de todas as peças no 60, **explosão 10 quadros depois (70)**, peças voltam a zero
  depois; câmera **abre (recua) durante a quebra** até ~110; no fim o óculos desce. Truque: no
  quadro 60 o controlador ainda se move um pouco para "**não parar antes de quebrar**".
- Partículas da quebra: emissor ícosfera no centro, **200 partículas, quadros 60 a 70, lifetime
  150, gravidade 0 (field weights), velocidade normal 7**, render como objeto (ícosfera subdiv 1,
  material vidro roughness baixa), **randomness de tamanho 1**, seed 8, emissor oculto. Força
  **Turbulence strength 0.1, flow 2.5** para elas boiarem. Bake all dynamics.
- Fechamento: Look **High Contrast** + exposição um pouco acima. **Motion blur ligado.**

### 1.3 Import a CAD model and create an Exploded View animation
- Canal: Derek Elliott | https://youtu.be/KFb4r8UVO0A | Blender 3.0 beta
- **Nota 4.** O método profissional de preparar CAD para explodida. O próprio autor diz que não
  sabe se há "boa razão" para explodida: é pedido comum, mas é efeito, não argumento.
- Importar OBJ (STEP precisa de add-on, ele usa "Stepper"). CAD costuma chegar grande: escalar
  **0.1** (às vezes 0.1 de novo) e **aplicar escala**.
- Separar: Edit > **Separate by Loose Parts**. Ver as peças: shading **Random** + **Cavity**.
  **Set Origin to Geometry** em tudo para poder selecionar por círculo.
- Cuidado: **Remove Doubles/Merge by distance** pode fundir rolamento com a carcaça (geometria
  perfeitamente encostada). Separar primeiro, fundir depois peça a peça.
- Pivô de rotação: selecionar geometria do eixo, cursor no selecionado, **Set Origin to 3D
  Cursor**. Parentar subconjuntos (keep transform).
- Montar com **snap ao grid (Ctrl)** para poder remontar exato. Chaves como "estado salvo".
- Fluxo: montado no quadro 1 (keying set Location em tudo), auto-key com "only active keying
  set", posiciona explodido no **30**, volta no 50/60 com pausa. Depois Graph Editor: G X para
  abrir espaço e **S X para esticar a animação para 120 quadros** (mais lento = mais caro).
- Interesse extra: **Randomize Transform** só na rotação, pequeno, no meio da explodida, com
  chaves iguais no começo e no fim (as peças "respiram" e voltam). Sem colisão entre peças.
- Detalhe funcional: **shape key** para o clipe afundar (rotação em torno do cursor com edição
  proporcional "connected only"), chaveado sincronizado com a explosão. Bounce na interpolação
  "fica absurdo": ficar no Bezier.

### 1.4 Exploded View Animation of Objects in Blender
- Canal: George Kayesi | https://youtu.be/IC0-9b0Rv2g | versão não dita
- **Nota 4** para o nosso caso (sistema perfeito para script).
- Um Empty (Plain Axes ou Cube) por eixo de explosão. Cada peça recebe **Copy Location** com o
  Empty como alvo, **Offset ligado**, só o eixo da explosão ligado (desliga X e Y para explosão
  em Z).
- Copy to Selected (selecionar as peças e por último a que tem a constraint).
- **Influence diferente por peça** cria o espaçamento (a peça mais externa anda mais).
- Peças do lado oposto: **Invert** no eixo.
- Para animar, chave **só no Empty**. Uma curva controla a explosão inteira.

### 1.5 The ABSOLUTE BEST Blender Product Animation Tutorial for Beginners
- Canal: Blender Artsy | https://youtu.be/eaKKfF2hHF8 | versão não dita
- **Nota 3.** Vale pelo speed ramp; a segunda metade é só música.
- Produto parentado a Empty; câmera **120 mm** parentada a outro Empty. **World 0** (tudo preto).
  Cycles, 30 fps.
- Abertura: produto começa **colado na câmera, no escuro**, e anda até sua posição sob a luz em
  90 quadros, girando para preparar o ângulo da explodida.
- Explodida 90 a 130 de uma vez: seleciona todas as peças, Options > **Affect Only Locations**, G
  com eixo local duas vezes: cada peça anda no **seu eixo local** (depende de o CAD vir com eixos
  locais coerentes).
- **Speed ramp:** chave extra perto do fim (quadro 120) arrastada para o 100: rápido no começo,
  muito lento no fim. Mesma rampa no Empty da câmera (escala 90 a 130 para abrir o quadro).
- Volta: duplicar as chaves e **S X -1** (espelhar no tempo). Ao montar, rotação final **X 0,
  Y 180** (de frente para a câmera).
- Corte com rampa: ao fim da explodida, câmera vai ao close em ~10 quadros com chave intermediária
  arrastada (rápido e assenta). Blocos de ~40 quadros (180 a 220 etc.).

### 1.6 KeyShot Quick Tip: Exploded View Animations
- Canal: KeyShot | https://youtu.be/-mlVWDeLtZQ | KeyShot, não Blender
- **Nota 3.** Conceitos transferíveis.
- Curva de ease custom **0 -> 1, segurar alguns segundos, voltar a 0** numa curva só (melhor que
  espelhar nós). Alças puxadas para curva macia; copiar/colar a mesma curva em todas as peças.
- **Desfasar um pouco** algumas peças (parafusos) para não andarem em bloco.
- Copiar a animação de um lado para o outro (simetria). Câmera orbitando junto.
- Explodida em animação permite tirar stills do meio e ligar motion blur.

### 1.7 You Can Create This Stunning Perfume Bottle in Blender Under 30 Minutes
- Canal: Blending Visuals | https://youtu.be/Lwh3HrtWyPE | versão não dita (4.x)
- **Nota 4.** Fraco na modelagem, forte na luz de perfume.
- Cilindro com **64 vértices** (número par para refazer faces). Área do rótulo achatada sem
  destruir: vertex group + Shrinkwrap para um cilindro de **96 vértices**.
- Chão com constraint **Floor** (o frasco nunca atravessa o chão).
- Rótulo: Mix Shader com máscara de textura P&B; parte metálica com metallic alto e roughness
  baixa. Cor dourada pelo nó **Blackbody 4000 K** (o mesmo valor usado nas luzes, coerência de
  temperatura). Noise -> Bump com strength baixo para textura no rótulo; aro dourado metálico
  também com Blackbody 4000.
- Spot **atrás do frasco**, radius aumentado (sombra macia), cor Blackbody 4000 via nós.
- **Light linking (Ctrl L > link):** luz de detalhe afeta só o frasco, não o ambiente.
- **Fundo abstrato por luz texturizada:** Area com **beam spread reduzido** (luz dura), nos nós
  da luz Noise -> Color Ramp (contraste alto) multiplicando a emissão, escalada em Z (manchas
  compridas, ~0.1), Mix com Emission Blackbody 4000 e preto. Rebater de vários lados.
- Backlight para o frasco, luz extra só para destacar o logo, DOF f/2, bevel nas arestas.
- Otimização: **bounces totais 8**.

### 1.8 Perfume Bottle Product CGI in Blender 4.2
- Canal: Mafriend | https://youtu.be/i8nAdR7MCV8 | Blender 4.2
- **Nota 3.** Modelagem de facetas (Poke Faces + Select Similar > Amount of connecting edges +
  Alt S) e um bom esquema de luz.
- Espessura do vidro: Alt E (extrude along normals) com **offset even**. **Recalcular normais
  (Shift N)**: o face orientation estava vermelho. Normal invertida estraga vidro.
- Subdivisão + Bevel **0.04, 2 segmentos**. Formato vertical **1080x1350** (4:5).
- Vidro: Glass BSDF branco FFFFFF. Líquido: duplicar o frasco, apagar a casca externa, fechar o
  topo, material próprio; IOR baixado para **1.34**. Plataforma: cubo em vidro **muito rugoso**
  (fosco), bevel 3 segmentos.
- Luz (escala da cena dele): Area topo **100 W**; Area lateral **400 W**; outra lateral **300 W**;
  fill grande **1000 W**; **Point atrás 500 W** para acender o líquido por trás; **Spot 2000 W
  com gobo** (imagem de janela na emissão via nós, radius maior suaviza, Spot Size e Blend
  aumentados). Câmera **90 mm**.
- Look **High Contrast**. Comentário: Khronos PBR Neutral "muito avermelhado" para essa cena;
  ficou no AgX.
- Rótulo: Mix Shader com a imagem como máscara entre dois Principled (um metálico), a mesma imagem
  no **Bump** (rótulo em relevo). 100 amostras.

### 1.9 Realistic Product Design in Blender 4.4: Perfume Bottle
- Canal: MK Graphics | https://youtu.be/AIqxxThx8Pg | Blender 4.4
- **Nota 3.** Valores de material e o truque do rótulo no vidro.
- Corpo: cubo + Subdivision nível 4 + Solidify (even thickness), base interna engrossada. Tampa:
  Bevel **0.02, 4 segmentos, Miter Outer Arc, Harden Normals**. Tubo interno por curva com
  depth e resolution 24.
- Cycles: viewport 32 amostras, final **256 + denoise**. HDRI com strength **0.6** no fim.
- Materiais: corpo Glass roughness **0**; tampa Glass roughness **0.2**; tubo Glass **0.3**;
  spray metálico amarelo roughness **0.15** e partes **0.1**; líquido IOR **1.4** amarelo claro,
  feito duplicando as faces internas e **escalando um pouco para dentro**.
- **Rótulo:** imagem como plano, aplicar escala/rotação (obrigatório), loop cuts para ter
  geometria, **Shrinkwrap Project eixo +Y** no frasco com offset leve, **roughness 1**.
  **Desligar Visibility > Transmission no rótulo** para ele não se refletir na parede interna do
  vidro.
- Film **Transparent** (HDRI ilumina mas não aparece). Ciclorama com Glossy roughness **0.3**
  (reflexo do frasco no chão). Resolução **2160x2160**.
- Spot atrás e ao lado, virado para a câmera, potência ditada como "1,00 W" (provável 1000 W),
  **radius 1 m**. Look **Medium High Contrast**.

### 1.10 Blender 3D Headphones Animation Tutorial
- Canal: Polygon Runway | https://youtu.be/mn3q14VrDDM | versão não dita (4.x)
- **Nota 3.** Modelagem longa; valem o loop de giro e os materiais.
- Giro em loop: Empty pai, rotação Z **0 -> -360 do quadro 1 ao 121** com cena de 120 quadros
  (loop sem quadro repetido). Graph Editor: **curva íngreme no meio** (o grosso do giro acontece
  rápido no centro) e nas pontas a curva **não chega a zero de inclinação** ("nunca para"). 30 fps.
- Luz: plano de fundo; Area grande em cima (topo forte); key lateral menor e mais perto; **Spot
  de recorte 5000 W** atrás e por baixo mirando os aros metálicos. Depois tinta azul forte no
  backlight.
- Plástico preto: Noise Texture com coordenada **Object** e scale alto (grão fino) -> Bump; o
  mesmo noise por Color Ramp na roughness, com o preto da rampa **clareado** para a variação não
  ficar agressiva. Parte brilhante separada; metal Metallic 1 roughness baixa.
- Almofada: preto total com **Sheen violeta** e roughness alta ("o sheen faz o resto").
- Cycles GPU, denoise, 128 amostras. Contraste e exposição na gestão de cor.

### 1.11 lets make a beverage commercial in blender
- Canal: TopChannel1on1 | https://youtu.be/T2r6imiurWo | versão não dita (3.x)
- **Nota 4.** Explosão de fruta orbitando a lata + fluido barato em computador fraco.
- Fatias de morango: Mirror com **Bisect** e um Empty girado como plano de corte; textura da face
  cortada por imagem. Auto Smooth **65°**.
- Explosão: sistema de partículas + **Explode modifier** no morango; emissão quadros **10 a 11**,
  **20 partículas**, **normal velocity 20**; render das partículas desligado no próprio objeto.
- Pedaços: ícosfera escondida dentro do morango emitindo **coleção** (fatias, folhas, gotas),
  escala aleatória, rotação aleatória + **Dynamic**, angular velocity **1 a 2**, **100
  partículas**, lifetime longo, **gravidade 0**, emissor oculto. Peças escalam de 0 para
  parecerem sair de dentro da fruta.
- Segurar as partículas perto do produto: força **Drag** com strength linear/angular chaveado
  (0 no início, sobe depois); **Vortex strength 1** para orbitarem a lata.
- Fluido: domínio **só onde o líquido passa** (economia), **bordas sem colisão**, fonte = plano
  levemente curvo, **Is Planar**, inflow, parentado; **gravidade 0** no domínio; initial velocity
  normal **5**.
- **Isolar forças:** as forças das partículas desestabilizam o fluido. Field Weights do domínio
  com **coleção própria de forças** (só turbulência). Turbulence depois: size 0.5, flow 20,
  strength 5.
- Malha: smooth positive **3**, negative **3**, particle radius **1.5**, upres **3**. Conselho:
  **não passar de 64 de resolução** em PC fraco; ganha-se detalhe na malha, não na resolução.
- Obstáculo como effector. **Animar visibilidade do domínio** para não renderizar o cubo inicial.

### 1.12 PRODUCT ANIMATION IN BLENDER 4.0: WATER SPLASH
- Canal: Malin.mp4 | https://youtu.be/gcDzDJRkCxk | Blender 4.0 (MacBook M1)
- **Nota 4.** Receita completa de splash em câmera lenta com números.
- Effector **não é a lata**: é uma malha simplificada contornando a lata, inflada levemente
  (scale along normals), display wire, parentada à lata.
- Flow: cubo em **Y 7, Z 1.5**, líquido, **sampling substeps 10**, initial velocity **Y -12**.
  Domínio: cubo escala **8 x 10 x 8**.
- Effector surface thickness **0.2**. Lata girada **X -18, Y -4.87, Z -25.2**.
- Domínio: bordas sem colisão, cache **Modular + Resumable**, fim **90**, **gravidade 0** (field
  weights e gravidade da cena), resolução **128** (resultado final dele: **256**). Bake 45 s no M1.
- Força para dar forma ao jato: Force field em **(4, -8, 6)** com strength chaveada: q1 **0**, q10
  **0**, q15 **-2**, q45 **-2**, q46 **-0.2**, q70 **-0.2**, q71 **-9**.
- **Câmera lenta por Time Scale do domínio:** q1 a q35 = **1**, q36 a q70 = **0.2**, q71 = **1**.
- Malha: upres **3**, particle radius **1.6**, bake 2 min 32 s. Smooth modifier repeat **4** +
  shade smooth.
- Câmera **125 mm em Y -50**, DOF com foco num Empty, **f-stop 0.2**, passepartout 1. Cycles,
  noise threshold **0.1**, 300 amostras máx., HDRI. Água: Glass IOR **1.333**.

### 1.13 PRODUCT ANIMATION IN BLENDER 3.6: POURING FROM SODA CAN
- Canal: Malin.mp4 | https://youtu.be/hqz2WRTNQ5U | Blender 3.6
- **Nota 4.** Despejo a partir da boca da lata.
- Flow = **faces da abertura da lata separadas** (P > Selection). Inflow; **Use Flow chaveado
  ligado até o 70 e desligado no 71** (o jato para).
- **Surface emission 7** (a fonte não tem espessura), initial velocity **normal 50, Y -7**.
- Corpo da lata: effector, substeps **2**, surface thickness **0.7**; tampa: effector thickness
  **0.5**.
- Domínio: res **128** (final 256), bordas sem colisão, Modular, fim **110**, Resumable (mostrou
  retomar do quadro 35 após cancelar). Malha upres **4**, particle radius **1.7**, smoothing
  **3/3**.
- **Líquido colorido:** Glass IOR 1.333 com a cor da bebida + **Volume Absorption** com cor mais
  escura na saída Volume.
- Render: Cycles, threshold 0.1, 300 amostras, motion blur. Denoise no compositor com passes
  Denoising Data (Noisy, Normal, Albedo).

### 1.14 PRODUCT ANIMATION IN BLENDER 3.6: WATER ON PATH
- Canal: Malin.mp4 | https://youtu.be/0pOV_A-qH2A | Blender 3.6
- **Nota 3.** Água em espiral guiada por curva (o "laço de líquido" em volta do produto).
- Curva: Geometry Nodes Spiral (resolution **74**, height **5.2**) -> Curve to Mesh com perfil
  de linha (Y 0.5 a -0.5), Set Curve Radius **0.505**, Resample **4** + Delete Geometry
  (index > **591**) = 4 curvas; torcer com edição proporcional; Displace Clouds (scale **0.51**,
  strength **0.17**); Subdivision 1; converter de volta em curva.
- **Force Field forma Curve**, strength **-8**, flow **1.1**, noise **3**. Flow menor = líquido
  mais rápido.
- Domínio res **150**, **CFL 2**, bordas sem colisão, Modular, fim 200; malha upres **4**,
  radius **1.7**; flow = UV Sphere. Smooth repeat **15**.
- Água Glass IOR **1.33**, roughness **0.034**. Chão de vidro com Noise -> Bump (detail **0**,
  scale **0.61**, strength **0.5**, distance **0.09**).
- Câmera em Follow Path num círculo + Track To num Empty. Cycles, threshold 0.1, 300 amostras,
  motion blur, H.264.

### 1.15 Water Simulation In Blender Tutorial: Water Splash
- Canal: Sost cgTeCH | https://youtu.be/IJTIzna5TBs | versão não dita
- **Nota 3.** Splash básico, útil como checagem dos números.
- Fonte = plano atrás da lata, **na altura do meio** (espirra em cima e embaixo). Aplicar escala
  de tudo antes de simular.
- Surface emission **6**, initial velocity **Y -15**. Mostrar normais no overlay para conferir a
  direção da emissão.
- Lata: effector com padrão. Domínio res **128**, bordas sem colisão, mesh ligado, fim **100**,
  Modular + Resumable, **gravidade 0**. Upres **3**.
- Material: Principled roughness 0, transmission 1, IOR **1.333**. Smooth repeat **3**.

### 1.16 Create a Condensation-Dripping Coke Can in Blender
- Canal: Cas Raven 3D | https://youtu.be/9ybdZDSOEsI | versão não dita
- **Nota 3.** A única condensação do lote, mas é básica (gotas são esferas, não escorrem apesar
  do título).
- Metal: Metallic **1**, roughness **0.3**; rótulo em imagem também metallic 1, roughness 0.3.
- Gotas por Geometry Nodes: Object Info (lata, Relative) -> **Distribute Points on Faces**
  (densidade ~100) -> **Instance on Points** (UV Sphere, raio 0.1 a 0.2, Transform com **Z 1.4**
  para alongar) -> **Random Value** na escala (máx. por volta de 0.3 na escala dele) -> Realize
  Instances -> Set Shade Smooth -> Set Material "água".
- Água das gotas: Glass roughness **0.1**, IOR **1.333**.
- Luz: Area topo **250 W Disk tamanho 3**; lateral **100 W Disk tamanho 2** a RX 70; cópia girada
  120° mais fraca do outro lado; **contraluz 300 W cor FFCCB8** (quente); luz de fundo **400 W
  Disk tamanho 2** para gradiente. Fundo DF8181, World 7F5451.
- Medium High Contrast. Preview 48 amostras, final ~248.

---

## 2. Síntese do tema: regras consolidadas

### R1. O recorte vem primeiro: a borda acesa desenha o produto
- **Regra:** a primeira luz de produto é a de trás (rim/recorte), não a da frente.
- **Por quê:** separa o produto do fundo e desenha a silhueta; é o que tira o "chapado". Aryan
  chama de "uma das coisas mais importantes".
- **Valores:** Area Disk grande atrás, virada para a câmera (Aryan); Spot 5000 W atrás e por
  baixo nos aros (Polygon Runway); Point 500 W atrás do líquido (Mafriend); contraluz quente
  300 W FFCCB8 (Cas Raven); Spot atrás com radius 1 m (MK).
- **Deu errado se:** o produto some no fundo, ou o centro do produto está tão claro quanto a borda.
- **Fontes:** 1.1, 1.8, 1.9, 1.10, 1.16.

### R2. Reflexo em produto brilhante é desenhado com tiras, não com HDRI
- **Regra:** em plástico brilhante, vidro e metal, o que dá forma é a **linha de reflexo** de
  Areas compridas, giradas em torno do centro do produto.
- **Por quê:** material brilhante só mostra o que reflete; HDRI genérico vira reflexo sujo.
- **Valores:** duas Areas escaladas em Z, 200 a 700 W na cena do Aryan, uma de cada lado,
  azul claro. HDRI quando entra fica fraco: World 0.1 (OnlyRJ), HDRI 0.6 (MK), ou Film
  Transparent.
- **Deu errado se:** o corpo do produto aparece com manchas de céu/janela sem relação com a
  forma, ou sem nenhuma faixa contínua.
- **Fontes:** 1.1, 1.2, 1.9.

### R3. Fundo é luz numa superfície, e fica longe
- **Regra:** o fundo é um plano escuro com uma luz própria criando gradiente; ele fica longe o
  bastante para as luzes do produto não o lavarem.
- **Por quê:** gradiente de luz tem profundidade; cor chapada no fundo é o "fundo de CG".
- **Valores:** Area Disk alongada a poucos centímetros do plano, virada para ele (Aryan); luz de
  fundo 400 a 500 W Disk 2 (Cas Raven); Gradient Texture + Color Ramp (OnlyRJ) como alternativa
  sem luz. Se afastar o plano: subir clip end (3000+) e a potência da luz de fundo.
- **Deu errado se:** o fundo clareia quando você liga a key/as tiras, ou tem cor uniforme.
- **Fontes:** 1.1, 1.2, 1.16.

### R4. Isolar luz por light linking
- **Regra:** luz que existe para um detalhe (recorte, logo) afeta só o produto.
- **Por quê:** evita o reflexo indesejado no chão espelho/água e o ambiente lavado.
- **Valores:** coleção do produto como receptora da luz. **[5.2]** confirmado:
  `luz_obj.light_linking.receiver_collection = colecao` (e `blocker_collection` para sombra).
- **Deu errado se:** aparece mancha grande de luz no chão/água ou no fundo.
- **Fontes:** 1.1, 1.7.

### R5. Paleta da luz sai do produto
- **Regra:** a cor das luzes de recorte/fundo é a cor da marca/produto, ou uma temperatura única.
- **Por quê:** a cena inteira fala uma cor só; é o oposto de "luz branca neutra" (lavado).
- **Valores:** azul na escova azul, verde no energético verde (Aryan); vermelho da marca no
  óculos (OnlyRJ); **Blackbody 4000 K** em luzes E no dourado do rótulo (Blending Visuals); azul
  forte no backlight do fone (Polygon Runway). **[5.2]** usar `light.use_temperature = True;
  light.temperature = 4000` em vez do nó Blackbody quando for só cor.
- **Conflito aparente:** cor saturada da marca (Aryan, OnlyRJ) vs uma temperatura quente única
  (Blending Visuals). Não é conflito: tecnologia/energia pede cor de marca; luxo/perfume pede
  temperatura quente única.
- **Deu errado se:** luzes brancas em todos os lados e o produto parece foto de catálogo.
- **Fontes:** 1.1, 1.2, 1.7, 1.10.

### R6. Contraste vem do Look do AgX, nunca do Standard
- **Regra:** finalizar com Look de contraste; nenhum vídeo usa Standard.
- **Valores:** High Contrast (OnlyRJ, Mafriend), Medium High Contrast (MK, Cas Raven), mais
  exposição leve (OnlyRJ). **[5.2]** nomes exatos: `'AgX - High Contrast'`,
  `'AgX - Medium High Contrast'`. Khronos PBR Neutral foi descartado ("avermelhado") numa cena.
- **Deu errado se:** preto acinzentado, cor lavada.
- **Fontes:** 1.2, 1.8, 1.9, 1.16.

### R7. Lente longa, sempre
- **Regra:** produto se filma com tele.
- **Valores observados:** 75 mm (close do óculos), 90 mm (perfume), 120 mm (GoPro), 122 mm
  (teaser), 125 mm (splash), 149 a 223 mm (fechamento). Câmera longe, zoom pela focal.
- **Por quê [cg]:** tele comprime perspectiva e não deforma o produto; grande-angular perto
  distorce embalagem.
- **Deu errado se:** bordas do produto "inchadas", perspectiva exagerada.
- **Fontes:** 1.1, 1.2, 1.5, 1.8, 1.12.

### R8. Ritmo: deriva linear + evento rápido + assentamento
- **Regra:** câmera e produto derivam devagar em velocidade constante; o evento (encaixe, quebra,
  explosão) é rápido; depois assenta com ease-out longo.
- **Valores:** deriva LINEAR (Aryan, quadros 1 a 70); speed ramp com chave extra arrastada do
  120 para o 100 (rápido no início, lento no fim, Blender Artsy); quebra 10 quadros depois do
  último hold (OnlyRJ 60 -> 70); encaixe rápido no 59 após descida lenta (Aryan); giro com miolo
  íngreme (Polygon Runway).
- **Conflito:** LINEAR (Aryan) vs Bezier "para suavizar" (OnlyRJ, Derek). Resolução: linear para
  movimento contínuo de câmera/deriva; Bezier/ease-out para o evento. Ease-in-out simétrico em
  tudo é o "movimento de software" a evitar.
- **Deu errado se:** tudo acelera e freia igual (curva padrão Bezier auto em todas as chaves).
- **Fontes:** 1.1, 1.2, 1.3, 1.5, 1.10.

### R9. O produto nunca para
- **Regra:** nenhum hold morto. Antes de quebrar ainda há micro movimento; o loop de giro não zera
  a velocidade nas pontas.
- **Valores:** chave extra no quadro 60 com leve subida e rotação (OnlyRJ); pontas da curva de
  rotação com inclinação (Polygon Runway); câmera continua recuando devagar após o impacto
  (Aryan).
- **Deu errado se:** existe um trecho de quadros idênticos, ou o objeto "trava" e depois anda.
- **Fontes:** 1.1, 1.2, 1.10.

### R10. A câmera reage ao evento
- **Regra:** no momento do evento a câmera muda de comportamento (pulo para trás, abre o quadro,
  corta rápido para close).
- **Valores:** pulo para trás com leve rotação no encaixe (Aryan); câmera recua durante a
  quebra até ~40 quadros depois (OnlyRJ); Empty da câmera escala junto com a explodida e depois
  close em ~10 quadros (Blender Artsy).
- **Deu errado se:** a câmera faz o mesmo movimento antes, durante e depois do evento.
- **Fontes:** 1.1, 1.2, 1.5.

### R11. Todo elemento extra nasce de um evento físico do produto
- **Regra:** partícula, onda, gota, pedaço só existem porque algo aconteceu com o produto.
- **Exemplos nas fontes:** onda nasce no quadro do encaixe (time offset = 59); estilhaços de
  vidro nascem do centro da quebra entre o 60 e o 70; pedaços de morango saem de dentro do
  morango (escala de 0) e ficam orbitando a lata por drag + vortex; gotas só na superfície da lata.
- **Por quê:** é a resposta direta ao defeito "enfeites flutuantes sem motivo".
- **Deu errado se:** há coisas flutuando desde o quadro 1 sem origem.
- **Fontes:** 1.1, 1.2, 1.11, 1.16.

### R12. Partículas "boiam": sem gravidade e com força de controle
- **Valores:** gravidade 0 em field weights (OnlyRJ, TopChannel); Turbulence strength 0.1 flow
  2.5 (OnlyRJ); Drag com strength chaveada de 0 para cima (segura perto do produto) + Vortex 1
  (órbita) (TopChannel); tamanho com randomness 1; rotação aleatória + dinâmica, angular 1 a 2.
- **Deu errado se:** partículas caem (gravidade ligada) ou fogem do quadro (sem drag).
- **Fontes:** 1.2, 1.11.

### R13. Splash comercial = gravidade zero + força chaveada + time scale
- **Regra:** o splash de comercial não é física real; é coreografia.
- **Valores:** gravidade 0 (domínio e cena); Force field com strength em degraus (0, -2, -0.2,
  -9); time scale 1 -> **0.2** -> 1 em degraus; initial velocity 12 a 15 no eixo; surface emission
  6 a 7; bordas do domínio sem colisão; domínio só onde há líquido.
- **Exceção:** despejo (1.13) mantém gravidade (o vídeo não a desliga); jato para por Use Flow
  chaveado.
- **Deu errado se:** o líquido cai feio no chão do domínio ou bate numa parede invisível.
- **Fontes:** 1.11, 1.12, 1.13, 1.15.

### R14. Qualidade do fluido vem da malha, não só da resolução
- **Consenso:** mesh upres **3 a 4**, particle radius **1.5 a 1.7**, smoothing pos/neg **3/3**,
  depois Smooth modifier (repeat 3 a 15) + shade smooth.
- **Conflito:** resolução ≤64 em PC fraco (TopChannel) vs 128 de teste e 256 final (Malin, Sost).
  Para a RTX 3050: começar em 64 para coreografia, 128 para aprovar, 256 só no final **[cg]**.
- **Cache:** Modular + Resumable sempre (retoma bake cancelado).
- **Deu errado se:** líquido em "bolinhas" (radius baixo/upres baixo) ou "massa de modelar"
  (smooth demais).
- **Fontes:** 1.11 a 1.15.

### R15. Effector simplificado e com espessura
- **Regra:** o objeto de colisão é uma casca simples em volta do produto, com surface thickness.
- **Valores:** malha traçada e inflada, thickness 0.2 (Malin splash); corpo 0.7 e tampa 0.5
  (despejo); substeps 2 no effector, 10 na fonte rápida.
- **Por quê:** malha de produto detalhada e fina vaza líquido.
- **Fontes:** 1.12, 1.13.

### R16. Água e líquido: valores de material
- **Água:** IOR **1.333** (unânime), roughness 0 a 0.1 (gotas 0.1, jato 0.034).
- **Perfume:** IOR 1.4 (MK) ou 1.34 (Mafriend): **conflito**, ambos plausíveis; álcool ~1.36
  **[cg]**.
- **Bebida colorida:** cor na transmissão + **Volume Absorption** mais escura (1.13).
- **Conflito de shader:** Glass BSDF (MK, Mafriend, Malin) vs Principled com transmissão (Sost,
  Blending Visuals, OnlyRJ). **[5.2]** usar Principled com `Transmission Weight = 1` (o nome
  `Transmission` não existe mais), pois ganha Coat, Thin Film e Specular IOR Level **[cg]**.
- **Fontes:** 1.8, 1.9, 1.12 a 1.16.

### R17. Vidro com rótulo e líquido: três cuidados
- Normais recalculadas (Shift N) antes de qualquer material de vidro (1.8).
- Rótulo com Shrinkwrap Project e **Visibility > Transmission desligado** para não se espelhar
  dentro do vidro (1.9). **[sonda]** `obj.visible_transmission = False`.
- Líquido como cópia das faces internas, levemente menor (1.8, 1.9). **[cg]** a técnica
  fisicamente correta é sobrepor um pouco o líquido à parede interna; a folga gera uma película
  de ar com reflexo duplo. Testar as duas.
- Plataforma de vidro **fosco** (roughness alta) para o perfume não brigar com o fundo (1.8).

### R18. Plástico e tecido sem cara de CG
- Plástico: Noise de coordenada Object, scale alto -> Bump fraco + o mesmo noise por Color Ramp
  na roughness com amplitude contida (1.10).
- Rótulo em relevo: a própria imagem do rótulo no Bump (1.8); textura de papel por Noise -> Bump
  fraco (1.7).
- Couro/almofada: preto com **Sheen Weight** colorido e roughness alta (1.10). **[5.2]** entrada
  `Sheen Weight` e `Sheen Tint`.
- Branco de logo acima de 1 (valor 3) para "estourar" (1.2).

### R19. Explodida: preparar, espaçar por influência, rampa e volta
- Preparar CAD (escala, loose parts, origens, cuidado com merge) (1.3).
- Espaçamento proporcional por **Influence** de Copy Location num Empty (1.4).
- **Rampa:** a explodida abre rápido e assenta devagar; chave extra arrastada (1.5); curva
  única 0 -> 1 -> hold -> 0 (1.6).
- Desfasar peças em poucos quadros (1.6); micro rotação aleatória no meio (1.3).
- Esticar para 120 quadros em vez de 30 (1.3).
- Volta = chaves espelhadas no tempo (1.5) ou parte 2 da mesma curva (1.6).
- **Deu errado se:** peças atravessam umas às outras, todas andam juntas como bloco, ou a
  explodida tem velocidade constante.

### R20. Duração decidida antes; planos curtos
- Planos de 2 a 3 s: 60 a 90 quadros a 30 fps (1.1, 1.2); quebra completa 165 quadros (1.2);
  explodida + pausa 60 a 120 quadros (1.3). Cada cena de comercial como **cena separada** (Full
  Copy) ou arquivo de saída com nome próprio (1.1 avisa: renomear a saída para não sobrescrever).

### R21. Render: valores que aparecem
- Cycles com 100 a 300 amostras + denoise; noise threshold 0.1 (Malin) para ir rápido **[cg]**:
  em vidro/líquido 0.1 pode deixar manchas; 0.02 a 0.05 é mais seguro.
- Bounces totais 8 para acelerar (1.7) **[cg]**: perfume com várias camadas de vidro pode pedir
  transmission bounces mais altos; conferir se o interior escurece.
- Motion blur ligado em quebra, splash e despejo (1.2, 1.12 a 1.14).
- **Conflito Cycles x EEVEE:** todos os vídeos usam Cycles ("Cycles parece muito melhor", 1.1).
  **[5.2]** o EEVEE com `use_raytracing` faz refração aproximada **[cg]**; vidro e líquido
  continuam sendo trabalho de Cycles (OptiX na RTX 3050). Medir tempo por quadro antes.

### R22. Coisas de versão antiga e como ficam no 5.2
| Vídeo ensina | No 5.2 |
|---|---|
| Look "Medium High Contrast" do Filmic | AgX padrão; Look `'AgX - Medium High Contrast'` |
| Principled `Transmission`, `Emission`, `Sheen` | `Transmission Weight`, `Emission Color` + `Emission Strength`, `Sheen Weight` |
| Auto Smooth 65° (malha, 3.x) | removido desde 4.1; usar `bpy.ops.object.shade_auto_smooth(angle=...)` ou modificador Smooth by Angle **[cg][sonda]** |
| Compositor em `scene.node_tree` com Denoise | `scene.compositing_node_group`; o denoise OIDN já vem no render do Cycles |
| `action.fcurves` em scripts de interpolação | `anim_utils.action_get_channelbag_for_slot(...).fcurves` |
| Nó Blackbody só para cor de luz | `light.use_temperature` + `light.temperature` |
| Engine `BLENDER_EEVEE_NEXT` | `'BLENDER_EEVEE'` |
| Fluido Mantaflow, Particle System, Explode modifier, Wave modifier | **[sonda]** confirmar que seguem no 5.2 (eu acredito que sim) |

---

## 3. Receitas para testar no Blender 5.2

Todas por Python. Nomes de API marcados **[sonda]** precisam de confirmação na primeira rodada.
Cena padrão para medir: 1080x1920 ou 1920x1080, 30 fps, AgX.

1. **Teaser de silhueta com recorte (Aryan).**
   Produto na origem. Câmera a ~10 m na frente, focal 122 mm, chave só de location: q1 Z abaixo
   do produto, q70 Z no topo, interpolação LINEAR. Area `shape='DISK'`, atrás do produto virada
   para a câmera, `size` 1,5x a largura do produto, cor = cor do produto, chaves de location e
   scale de baixo (pequena) para cima (cobrindo o produto), LINEAR. World strength 0. Fundo: plano
   parentado à câmera + Area Disk alongada (scale X 0.3, Y 2) a 0,2 m do plano virada para ele,
   subindo junto. Look `'AgX - Medium High Contrast'`. Potências iniciais **[cg]**: recorte
   200 W, fundo 100 W a 2 m; ajustar por render. **Validar:** frame q35 com centro do produto
   escuro e bordas acesas; fundo com gradiente visível.

2. **Tiras de reflexo (Aryan).**
   Duas Areas `shape='RECTANGLE'`, `size=0.3`, `size_y=3`, a 1,5 m do produto, uma em +90° e
   outra em -90° em torno do eixo Z do produto, 200 W subindo até ~700 W, cor azul claro (ou
   temperatura 6500 K). Fundo afastado; câmera `clip_end = 3000`. **Validar:** linha de reflexo
   contínua nos dois lados do corpo; fundo não clareou mais que 10% entre "tiras desligadas" e
   "ligadas".

3. **Light linking do recorte (Aryan, Blending Visuals).**
   Coleção "PRODUTO". `luz.light_linking.receiver_collection = bpy.data.collections['PRODUTO']`.
   Chão espelho (Principled Metallic 1, Roughness 0). **Validar:** render com e sem linking; com
   linking a mancha da luz some do chão e o recorte no produto permanece.

4. **Chão d'água com onda no impacto (Aryan).**
   Plano escala 50, subdividir 1x, bevel do vértice central (`bpy.ops.mesh.bevel(affect='VERTICES',
   segments=300, profile=0.2, offset=...)`), aplicar escala. Material: Principled Metallic 1,
   Roughness 0, Noise (scale 50) -> Bump (strength 0.1) -> Normal; chave no scale do Noise do q1
   ao último, LINEAR. Wave modifier: `height=0.21`, `use_cyclic=False`, `time_offset=59`
   **[sonda]**; chave `height` 0.21 no q59 e 0 no q90 (ou usar `damping_time`/`lifetime` **[sonda]**).
   **Validar:** no q58 água parada; no q62 um anel visível saindo do ponto de impacto; no q90 sumiu.

5. **Explodida por Empty + Copy Location (George Kayesi).**
   Para cada peça i (de n), constraint `COPY_LOCATION` com `target=empty_z`, `use_offset=True`,
   `use_x=False`, `use_y=False`, `influence=(i+1)/n`; peças abaixo do centro com `invert_z=True`.
   Animar só `empty_z.location.z`: q1 = 0, q20 = D (explodido), hold até q50, q70 = 0. Interpolação
   da subida com easing EASE_OUT tipo `EXPO` ou `QUART`. **Validar:** nenhuma interseção no q20
   (bounding boxes não se cruzam); a peça mais externa anda D, a mais interna D/n.

6. **Speed ramp da explodida (Blender Artsy + KeyShot).**
   Peças: chave montada no q90, explodida no q130, com chave intermediária no q100 já em 85% da
   distância (rápido e assenta). Desfasar cada peça 2 quadros. Volta: copiar as chaves para
   q160-q200 espelhadas. Câmera (via Empty pai): escala 1 -> 1,4 entre q90 e q130 com a mesma
   rampa. Acessar F-curves pelo channelbag. **Validar:** curva de velocidade (diferença de posição
   por quadro) com pico nos primeiros 10 quadros e cauda longa.

7. **Burst de estilhaços na quebra (OnlyRJ).**
   Ícosfera emissora no centro da quebra. ParticleSettings: `count=200`, `frame_start=60`,
   `frame_end=70`, `lifetime=150`, `normal_factor=7`, `render_type='OBJECT'`,
   `instance_object` = ícosfera subdiv 1 com Principled transmissão 1 roughness 0.05,
   `particle_size` pequeno, `size_random=1`, `effector_weights.gravity=0`; emissor
   `show_instancer_for_render=False`. Turbulence: `field.strength=0.1`, `field.flow=2.5`
   **[sonda]**. Peças do produto: chave no q60, separadas no q70, de volta no q120. Câmera recua
   entre q60 e q110. Motion blur ligado. **Validar:** nenhuma partícula antes do q60; elas
   continuam no quadro no q120.

8. **Rótulo em vidro sem reflexo interno (MK).**
   Plano com imagem, aplicar transformações, subdividir 20x10, Shrinkwrap `wrap_method='PROJECT'`,
   eixo +Y, `target=frasco`, `offset=0.001`. Material do rótulo roughness 1.
   `rotulo.visible_transmission = False` **[sonda]**. **Validar:** render com e sem; sem a flag
   aparece o rótulo espelhado na parede de trás do vidro.

9. **Perfume: vidro + líquido + plataforma fosca (MK, Mafriend).**
   Vidro: Principled `Transmission Weight 1`, Roughness 0, IOR 1.45 **[cg]**, normais
   recalculadas. Líquido: Principled `Transmission Weight 1`, IOR 1.36, cor âmbar leve, + Volume
   Absorption (densidade 2 **[cg]**). Teste A: líquido 1% menor que a parede interna; teste B:
   líquido 1% sobreposto à parede **[cg]**. Tampa: vidro roughness 0.2. Plataforma: cubo com
   vidro roughness 0.6, bevel 3 segmentos. Luz: Point atrás do frasco 500 W (escala do Mafriend)
   e key lateral. Cycles OptiX. **Validar:** comparar A x B no contorno do líquido; líquido
   brilhando pela luz de trás.

10. **Gobo de janela e luz texturizada (Mafriend, Blending Visuals).**
    Spot 2000 W, `spot_size` 45°, `spot_blend` 0.5, `shadow_soft_size` 0.2, nós da luz: Image
    Texture (gobo) -> Emission Strength. Alternativa procedural: Area com `spread` 20°, nós Noise
    (scale 3, coordenadas Normal) -> Color Ramp (preto 0.45, branco 0.55) -> Mix com Emission
    temperatura 4000 K. **[cg]** textura em luz só funciona no Cycles. **Validar:** recorte do gobo
    legível no fundo, sem cobrir o produto.

11. **Condensação por Geometry Nodes, versão melhorada (Cas Raven + [cg]).**
    Base do vídeo: Object Info (lata, Relative) -> Distribute Points on Faces (densidade 100) ->
    Instance on Points (UV Sphere raio 0.1, escala Z 1.4) -> Random Value na escala -> Realize ->
    Set Shade Smooth -> Set Material (Principled transmissão 1, roughness 0.1, IOR 1.333).
    Melhorias **[cg]**: (a) duas camadas, micro gotas densidade 3000 raio 0.2 mm + gotas grandes
    densidade 150 raio 1 a 2 mm em escala real de lata; (b) orientar pelas normais com Align
    Rotation to Vector e achatar no eixo da normal (meia gota, escala 0.4); (c) máscara por Noise
    na densidade para ter zonas secas. **Validar:** em close 100 mm, gotas com reflexo e refração,
    não parecendo bolas de gude; distribuição irregular.

12. **Splash slow-mo (Malin 4.0), parâmetros exatos.**
    Lata rot (-18°, -4.87°, -25.2°). Effector = casca simplificada inflada, parentada,
    `surface_distance=0.2`. Flow: cubo em (0, 7, 1.5), `flow_type='LIQUID'`, `subframes=10`,
    `use_initial_velocity=True`, `velocity_coord=(0,-12,0)` **[sonda]**. Domínio 8x10x8,
    `domain_type='LIQUID'`, `resolution_max=128`, bordas sem colisão, `cache_type='MODULAR'`,
    `cache_resumable=True`, fim 90, `effector_weights.gravity=0` e gravidade da cena 0. Força em
    (4,-8,6) com strength chaveada: 1:0, 10:0, 15:-2, 45:-2, 46:-0.2, 70:-0.2, 71:-9 (CONSTANT).
    `time_scale`: 1:1, 35:1, 36:0.2, 70:0.2, 71:1 (CONSTANT). Malha `use_mesh=True`,
    `mesh_scale=3`, `particle_radius=1.6`. Smooth modifier repeat 4. Câmera 125 mm em Y -50, DOF
    foco num Empty, f-stop ajustado à escala **[cg]**. **Validar:** medir tempo de bake na RTX
    3050 a 64 e a 128; quadro 50 mostra o líquido "congelado" ao redor da lata.

13. **Despejo da lata (Malin 3.6).**
    Flow = faces da boca separadas, `flow_behavior='INFLOW'`, `use_flow` chaveado True até q70 e
    False no q71, `surface_distance=7`, `velocity_normal=50`, `velocity_coord=(0,-7,0)`
    **[sonda]**. Corpo: effector `subframes=2`, `surface_distance=0.7`; tampa 0.5. Domínio 128,
    Modular, fim 110, `mesh_scale=4`, `particle_radius=1.7`, `mesh_smoothen_pos=3`,
    `mesh_smoothen_neg=3`. Material: transmissão com cor da bebida + Volume Absorption mais
    escura. **Validar:** jato contínuo e cortado no q71; cor da bebida legível na espessura.

14. **Laço de líquido em espiral (Malin 3.6).**
    Curva guia (pode ser espiral simples por script em vez de GN): 3 voltas, raio 0.5, altura 5.2,
    leve torção e ruído. Force field `shape='CURVE'` **[sonda]**, strength -8, flow 1.1, noise 3.
    Domínio 150 (testar 96), `cfl_condition=2`, Modular, 200 quadros, `mesh_scale=4`, radius 1.7.
    Smooth repeat 15. Água IOR 1.33 roughness 0.034. **Validar:** o líquido segue a espiral e não
    se desfaz antes de 2/3 do caminho.

15. **Explosão de fruta orbitando o produto (TopChannel).**
    Fruta com Explode modifier: partículas `count=20`, emissão q10 a q11, `normal_factor=20`. Ícosfera
    interna emitindo coleção (fatias via Mirror+Bisect, folhas, gotas): `count=100`,
    `use_rotations=True`, rotação aleatória, `angular_velocity_factor=1.5`, gravidade 0, escala das
    instâncias de 0 a 1 nos primeiros quadros. Drag: strength 0 no q10, 2 no q25 **[cg]**. Vortex
    strength 1 no eixo da lata. **Validar:** pedaços saem de dentro da fruta, desaceleram e
    orbitam sem sair do quadro até o fim.

16. **Giro 360 em loop com miolo rápido (Polygon Runway).**
    Empty pai, rot Z: q1 = 0, q121 = -360°, cena 1 a 120. Chaves extras q40 (-60°) e q80 (-300°):
    o miolo faz 240° em 40 quadros, as pontas 60° em 40 quadros (nunca param). Interpolação
    BEZIER com alças alinhadas. **Validar:** loop sem salto entre q120 e q1; velocidade mínima nas
    pontas maior que zero.

17. **Troca de cor por corte na luz interna (Aryan).**
    Emission strength 10. Chaves de `Emission Color` com interpolação CONSTANT: q1 azul, q25 azul,
    q27 preto, q29 verde, q45 preto, q47 vermelho. Vidro do corpo com base color igual nos mesmos
    quadros. **Validar:** a troca acontece num quadro, sem gradiente intermediário.

---

## 4. Planos clássicos por categoria (o que aparece e o que cada um vende)

**Perfume / cosmético** (1.7, 1.8, 1.9)
- Hero estático 4:5 ou 1:1, frasco central, contraluz atravessando o líquido: vende a cor e a
  pureza do líquido.
- Gobo de janela/folhagem no fundo e no chão: vende ambiente, sofisticação, "luz de fim de tarde".
- Close de rótulo em relevo dourado com luz dedicada ao logo: vende marca e acabamento.
- Frasco sobre plataforma de vidro fosco/pedra com reflexo no chão glossy (roughness 0.3): vende
  peso e presença.
- Temperatura única quente (4000 K) em luz e metais: vende luxo coerente.

**Fone de ouvido** (1.10)
- Giro 360 em loop com aceleração no miolo: vende design de todos os ângulos (feito para redes,
  loop perfeito).
- Recorte forte nos aros metálicos por baixo/atrás: vende acabamento premium.
- Close no couro da almofada com sheen: vende conforto.

**Óculos** (1.2)
- Entrada: sobe girando devagar e acelera nos últimos 20 quadros, câmera em push-in: vende
  apresentação, "chegou".
- Close 75 mm na câmera/lente embutida: vende a tecnologia.
- Quebra e volta com estilhaços de vidro, câmera abrindo: vende "o que tem dentro" e engenharia.
- Filete de luz na cor da marca: vende identidade.

**Pequeno eletrônico / escova / gadget** (1.1, 1.5)
- Teaser de silhueta subindo, só a borda acesa: vende mistério, abertura de comercial.
- Sai do escuro para a luz (produto colado na câmera e recua): vende revelação.
- Macro de detalhe com luz interna trocando de cor por corte: vende recurso (modos, LED).
- Encaixe na base com onda no chão d'água: vende o fechamento, "clique" satisfatório.
- Explodida com speed ramp e close rápido: vende complexidade interna.

**Produto mecânico / CAD** (1.3, 1.4, 1.6)
- Montado -> explodido -> pausa -> montado, peças desfasadas: vende engenharia e número de peças.
- Detalhe funcional (clipe afundando por shape key): vende como funciona.
- Micro rotação aleatória das peças no meio da explodida: vende vida, evita diagrama técnico.

**Bebida / lata** (1.11 a 1.16)
- Lata inclinada (X -18°, Z -25°) atravessando splash em câmera lenta (time scale 0.2): vende
  frescor e impacto.
- Despejo pela boca da lata com cor da bebida no líquido: vende o produto em uso, sabor.
- Laço de líquido em espiral ao redor da lata com câmera orbitando: vende energia, movimento.
- Explosão do ingrediente (fruta) orbitando a lata: vende sabor/ingrediente.
- Hero estático com condensação e contraluz quente: vende "gelada".

**Comida:** só o morango fatiado/explodindo (1.11). Lacuna.

**Celular:** nenhum vídeo do lote (Derek cita um tutorial de celular dele que não está aqui).
Lacuna.

---

## 5. Contribuição para o Cérebro de Diretor

Regras de decisão que este tema prova e que respondem aos defeitos atuais:

1. **Cor lavada:** World em 0 a 0.1, Look de contraste do AgX, luzes coloridas na cor do produto
   ou numa temperatura única. Nenhuma cena de produto das fontes usa luz branca em todos os lados.
2. **Luz chapada:** a ordem de montagem é recorte -> tiras de reflexo -> luz de fundo -> key
   (por último e fraca). HDRI só como reflexo fraco. Luz de detalhe isolada por light linking.
3. **Enfeites sem motivo:** proibido elemento que não nasce de evento do produto. Cada partícula
   tem quadro de nascimento ligado a uma ação (encaixe, quebra, explosão, abertura).
4. **Material de plástico de CG:** micro noise em Bump + roughness variando pouco, sheen em
   tecido, relevo no rótulo, branco de logo acima de 1, normais conferidas, vidro com rótulo sem
   transmissão.
5. **Movimento de software:** deriva LINEAR + evento rápido + ease-out longo; nada de ease-in-out
   simétrico em tudo; produto nunca para; câmera muda de comportamento no evento.
6. **Lente:** 75 a 150 mm como padrão; zoom pela focal com câmera longe.
7. **Roteiro de comercial de produto em três atos** (Aryan e OnlyRJ convergem): abertura de
   mistério (silhueta / sai do escuro) -> detalhe que vende recurso (close, luz interna,
   explodida) -> fechamento com evento físico e packshot (encaixe + onda, quebra e volta). Planos
   de 60 a 90 quadros a 30 fps.
8. **Fundo é luz sobre superfície** e fica longe; se as luzes do produto o clareiam, afaste e
   compense.
9. **Explodida é tempero, não prato:** usar só quando há interior que vale mostrar (Derek duvida
   da utilidade); sempre com rampa e volta.
10. **Simulação é coreografia:** gravidade zero, forças chaveadas, time scale em degraus. Física
    real só no despejo.

---

## 6. Lacunas (o que as transcrições não cobrem)

- **Composição fora do centro:** todos os vídeos centralizam o produto. Nada sobre terço, espaço
  negativo para texto, diagonal, quadro vertical para anúncio com área de legenda. Precisa vir
  de outra fonte (tema direção/câmera).
- **Celular / tela / app no aparelho:** nenhum vídeo. Falta tela emissiva com conteúdo, reflexo
  de vidro sobre a tela, giro "hero" do celular, alinhamento de UI.
- **Comida de verdade:** hambúrguer, café com vapor, chocolate/mel viscoso (viscosidade no
  fluido), queijo, crocância, migalhas, fumaça. Só há o morango.
- **Splash de leite/coroa, bolhas de gás dentro da bebida, gelo, espuma:** ausentes.
- **Condensação realista:** gotas escorrendo com rastro, película de embaçado (micro gotas por
  shader), gelo/frost. O vídeo de condensação só instancia esferas.
- **Cáusticas:** só uma menção solta a "shadow caustics". Nada de valores para cáustica de vidro
  e líquido no chão (MNEE no Cycles **[cg]**).
- **Escala real x valores:** quase todos trabalham fora de escala (2 m de fone, lata gigante).
  Potência de luz, DOF (f-stop 0.2 a 50 m) e fluido dependem disso. Precisamos fixar um padrão
  de escala real e recalibrar.
- **Tempo de render/bake na RTX 3050:** só há tempos de MacBook M1 (bake 45 s a 2 min 32 s a
  128). Medir.
- **Cycles x EEVEE no 5.2 para vidro e líquido:** nenhum vídeo testa EEVEE com raytracing.
- **Packshot final com logo e tipografia, color grading, som:** citados como pós ("dá pra
  ajustar depois"), sem método.
- **Status no 5.2 de Mantaflow, Particle System, Explode e Wave modifier, e os nomes exatos das
  propriedades de fluido:** precisam de sonda antes de qualquer receita de líquido rodar.
- **Cremes, texturas cosméticas, swirl de produto, pó:** ausentes.
