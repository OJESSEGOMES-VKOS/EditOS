# Destilado: lote 2 (efeitos de produto, luz, materiais especiais, direção de arte)

Fonte: 18 transcrições `lote2__*` em `pesquisa/transcricoes/`. Legenda automática interpretada
(ex.: "kronos" = Khronos, "agx" = AgX, "scope mode" = Sculpt Mode, "big sound" = Bake Sound).
Conferido contra `referencias/blender-5.2-verdade.md` e `referencias/base/00-padroes-da-casa.md`.

Convenções:
- **[cg]** = conhecimento geral meu, não está na transcrição. Testar antes de virar regra.
- **[5.2]** = tradução de passo de versão antiga para o Blender 5.2.
- **[sonda]** = nome de API que acredito correto, mas precisa ser confirmado rodando no 5.2.
- **[conflito]** = contradiz ou tensiona um padrão da casa. O padrão da casa vale até medir.
- Watts citados valem na escala da cena do autor. Nunca copie watts sem copiar a distância e a
  escala (padrão da casa: comece 2 a 3 stops abaixo e passe no fotômetro).

---

## 1. Por vídeo

### 1.1 Water Droplets with Geometry Nodes
- Canal: Joey Carlino | https://youtu.be/g72JfGE7o3E | **Blender 3.2** | **Nota 4**
- Método diferente do da base: em vez de instanciar esferas, faz **pontos → volume → malha**. As
  gotas vizinhas **se fundem** como metaball (parece água de verdade, não bolinha).
- Cadeia de nós: `Object Info` (lata, modo **Relative**) → `Distribute Points on Faces` →
  `Points to Volume` → `Volume to Mesh` → `Set Shade Smooth` → `Set Material`.
- Escala do autor: lata de **1,2 m de altura** (irreal; ele avisa que o tamanho das gotas e a
  densidade dependem da escala do objeto). Raio das gotas por `Random Value`: **mín 0,01, máx 0,02**.
- Resolução: os dois nós em modo **Amount**, um único `Integer` ligado nos dois. Começa em 64,
  usa **128** no dia a dia, **256** se quiser mais liso. Ligue "Timings" no overlay para ver o custo.
- `Volume to Mesh`: **threshold 0,5** (fica mais liso), densidade do volume sempre **1** (mudar a
  densidade obriga a mudar o threshold).
- Espaçamento controlado: distribuição **Poisson Disk**, densidade **1000 a 5000**, distância
  mínima **0,02 a 0,03** (da ordem do raio). Gotas que se tocam um pouco são aceitáveis: lata
  "intocada" tem gotas separadas; lata manuseada tem gotas fundidas.
- Material: base branca, aspereza 0, transmissão 1. Ele confirma que o Cycles dá a refração real.
- Por que objeto separado: o GN mora num plano que lê a lata. Se o GN ficar na própria lata, perde
  a UV do rótulo ao juntar (ele contornou com `Geometry to Instance` no fim).
- Bônus: trocar `Object Info` por `Collection Info` aplica gotas em todas as latas da coleção. Sem
  `Realize Instances` antes, todas recebem **as mesmas gotas nos mesmos lugares**.

### 1.2 How to Create Steam w/ Mantaflow
- Canal: Blender Made Easy | https://youtu.be/_K0XsHht6pg | **Blender 2.9x** (2021) | **Nota 4**
- Fluxo: cilindro **bem fino** sobre o café, escondido da câmera, `Fluid > Flow`, tipo fumaça,
  `Inflow`. **Initial temperature 1,2** (sobe um pouco mais rápido).
- **Surface emission 0,6** (menos fumaça sai; fica mais leve).
- Textura no fluxo: textura **Clouds** com **contrast 5**; o **offset** da textura é animado de 0
  no quadro 1 a **1,5** no quadro 300, interpolação **LINEAR**. É isso que faz o vapor sair em
  fios e não em bloco.
- Domínio: **resolution divisions 160**, **time scale 0,8** (vapor mais lento), **Adaptive
  Domain** ligado com **threshold 0,001** (não corta a fumaça rala), **Heat 1,5**, **Dissolve**
  ligado com **30 quadros**, fim do cache 300, cache **Modular** com **Is Resumable**.
- Vento: force field **Wind**, **strength 0,05**, **flow 0**, girado de lado. Mais forte que isso o
  vapor "voa embora". Xícara como **Effector > Collision** se o vapor encostar nela.
- Material do vapor (o segredo do vídeo): **Emission na saída Volume**, força =
  `Volume Info.Density` → `Color Ramp` → `Math Multiply` (**8**) × `Light Path.Is Camera Ray`.
  O "Is Camera Ray" impede o vapor de iluminar a cena; ele só aparece para a câmera.
- Color Ramp de 3 paradas: preto, **branco no meio**, preto na ponta; aproximar as paradas recorta
  a fumaça rala e dá fios definidos. **Cor da emissão cinza (valor ~0,4)**: mais escuro = mais
  transparente.
- Por que Emission e não Principled Volume: menos ruído e um pouco mais rápido (**~15 s contra
  ~19 s** no render dele), e controle total da cor. O Principled Volume não chega ao branco puro.
- EEVEE: o vapor emissivo **some** no EEVEE. Lá use `Principled Volume` com densidade = rampa ×
  **7** (render de **~7 s**).
- Luz: lâmpada pontual **3000 W, raio 3** à esquerda (escala da cena dele); mundo quase preto;
  Look **High Contrast**; Cycles **40 amostras** + denoise no compositor.

### 1.3 Blender Steaming Coffee Animation Tutorial
- Canal: Polygon Runway | https://youtu.be/8jv2n2RElf4 | **Blender 4.x** (data não dita) | **Nota 3**
- Fluxo: círculo pequeno **preenchido** (F) dentro da xícara + `Object > Quick Effects > Quick
  Smoke`. Fonte do fluxo **Planar**.
- Sem dissolve o vapor vira **cogumelo** acumulado no topo. **Dissolve 10 quadros**, depois
  reduzido para **7**.
- **Pré-rolagem:** início do cache em **-100**. Assim o vapor já existe no quadro 1, sem o "tempo de
  aquecimento" da simulação.
- Cache **All** (bake) em vez de Replay; fim 120 para testar, **240** no final.
- Força **Turbulence** com **strength 0,5** dá o rodopio. Sempre **Free + Bake** de novo depois de
  mexer em força.
- Material: densidade do volume do domínio **15** (o padrão fica escuro e quase invisível).
- Superfície do café: foto de cima (textura) na Base Color; a mesma imagem passa por
  `Hue/Saturation` (saturação 0) e vai na **aspereza** (espuma clara fosca, café escuro brilhante).
- Ondulação do café: subdivisão 2 + modificador **Displace** com textura **Clouds** de tamanho
  grande, **strength 0,08 a 0,1**, coordenada de um **Empty** animado em X de forma **LINEAR** do
  quadro 1 ao 200.
- Luz: **Area Disk** atrás (contraluz), grande para sombra macia; HDRI girado para casar com a luz
  de área. Cycles **256 amostras** + denoise na GPU.

### 1.4 Product water splash Simulation in blender
- Canal: Cleverpoly | https://youtu.be/DbewtqTrzgo | **Blender 3.x** | **Nota 3**
- **Proxy de colisão:** coleção do produto → GN `Realize Instances` → `Mesh to Volume` →
  `Volume to Mesh` → aplicar → `Remesh`. Depois um cubo com `Shrinkwrap` (Target Normal Project,
  com offset) + `Remesh` voxel = "gaiola" fechada que a água não atravessa. Ajuste final com
  Alt+S (encolher pelas normais) até encostar no produto.
- Domínio líquido **resolução 64** para testar, **80 a 100** no final; colisões com as paredes do
  domínio desligadas; **gravidade 0** nos Field Weights; fim **150** (depois 100).
- Fluxo: plano, líquido, geometria, **surface emission 5**.
- Força (Force field) chaveada: **q10 = 0**, **q15 = -200** (rápido demais) corrigido para **-5**;
  no impacto (**q46**) **-0,5**, depois **-0,2**; **q70 → q71** volta para **-5** para tirar a
  água de cena.
- Câmera lenta pelo **time scale**: **q34 = 1, q35 = 0,2**; **q70 = 0,2 → q71 = 0,7 a 0,8**.
- Defeito do final: a água forma uma **bola em volta da força**. Correção dele: tirar a força de
  dentro do domínio. E o conselho honesto: corte para outro plano do produto em vez de resolver o fim.
- Malha: **upres 3**, **particle radius 1,3**. Cache **Modular + Resumable**, "Bake All".
- Material: **Glass BSDF** com aspereza leve, **IOR 1,33**, e **Volume Absorption** azulado na
  saída Volume: onde a água é grossa fica azul, onde é fina fica branca. Não pinte a cor na superfície.

### 1.5 Blender 4.2! New tone mapping, the Khronos PBR Neutral Tone Mapper
- Canal: Christopher 3D | https://youtu.be/iQ3m0CfuSmg | **Blender 4.2** | **Nota 3**
- Feito para a cor sRGB definida (marca, embalagem) **sob luz neutra**; daí o nome.
- Comparações em cubos metálicos com cores de amostra e em embalagens:
  - **Standard:** amarelo forte **clipa**; degradê do claro ao escuro ruim.
  - **Filmic:** degradê suave, mas o brilho não parece brilho; lava a cor; cada cor saturada
    reage de um jeito sob luz forte (luz "inconsistente").
  - **AgX:** melhor nas altas luzes (a cor clareia de forma natural), luz consistente entre cores,
    mas **dessatura** e às vezes muda o matiz. Fundo de imagem com emissão **perde saturação**.
  - **Khronos:** mantém saturação e matiz do rótulo, gradação boa e mais contraste geral.
- Sem números (nem ΔE). Serve como confirmação visual da tabela da casa.

### 1.6 What is Normalize lighting in Blender 4.5?
- Canal: Christopher 3D | https://youtu.be/lLoBGZgMzJw | **Blender 4.5** | **Nota 4**
- Internamente a luz é **emissão por unidade de área, e a unidade é o metro quadrado**: 5 com
  normalize desligado = 5 W/m².
- **Normalize desligado (relativo):** a potência total cresce com a área. Luz de 1×1 m = 5 W; 2×2 m
  = **20 W**; 0,5×0,5 m = **1,25 W**.
- **Normalize ligado (absoluto, o padrão, o jeito antigo):** a luz emite os 5 W totais em qualquer
  tamanho. Mudar o tamanho muda **só a maciez da sombra**, não o brilho da cena.
- **1×1 m é o ponto onde os dois modos coincidem.**
- Luz pontual com raio minúsculo (menos de ~1 cm): desligado = fraca; ligado = a energia toda sai
  de uma área pequena e **estoura**, obrigando a valores "anormalmente baixos".
- O "W" saiu da interface no 4.5, mas o valor continua sendo potência radiante (não elétrica).
- Novo `exposure` da luz: ajuste em **stops** (+1 = dobro), em vez de mexer no número de potência.

### 1.7 Blender Car Paint Material with Metallic Glitter Texture
- Canal: blenderian | https://youtu.be/vzLzkEGRiZI | **Blender 3.x** (usa Specular e Clearcoat) | **Nota 2**
- Base: hex **#FF2800**, aspereza **0,1**, metallic **1**, specular **1**, clearcoat **1**.
- "Glitter": `Mix Shader` entre a tinta e um segundo Principled **branco**, fator =
  `Noise` escala **250** → `Color Ramp` preto em **0,6** e branco em **0,8**; coordenada **Object**.
- Segunda camada de pó escuro: mais um Mix com Principled escuro e rampa com preto em **0,5**.
- Fraco: o brilho vem de mancha de cor, não de normal. Não muda com o ângulo como floco de verdade.
  A receita da base (flocos Voronoi na Normal + Coat) é melhor.

### 1.8 Procedural ATM Card Motion Graphics in Blender | Extra Nodes
- Canal: 3D Singh VFX | https://youtu.be/O2xkMsAVG_Q | **Blender 4.x + complemento Extra Nodes** | **Nota 2**
- Cinco animações de cartão, todas com nós do complemento (Line Scatter, Time Falloff, Geometry
  Tracer, Surface Roller, Curve Scatter, Circle Scatter).
- Pilha de **20 cartões** que abre animando o **ponto final da linha**, curva rápida no começo e
  lenta no fim. Alinhamento desligado (cartões não giram com a linha).
- Escala dos cartões pelo **fator ao longo da curva** (spline factor): pequenos numa ponta,
  grandes na outra.
- "Relógio": fator de 0 a 1 passando por **Snap** (degraus fixos) = movimento em tique-taque.
- Rastro: cópias do cartão com índice de rastro invertido (o mais novo = 0), deslocadas e
  encolhidas pelo índice; o cartão original fica por cima com material próprio.
- Leque em arco: **17 cópias** numa curva que escala e muda de raio. Sem **eixo de travamento**
  (lock axis) os cartões **viram** quando a curva se deforma (normal e tangente mudam).
- Enrolar cartão: precisa de malha subdividida e de um **ID por cartão** para enrolar cada um
  separado, em modo "grosso" porque o cartão tem espessura.

### 1.9 Realistic Glass in Cinema 4D + Redshift
- Canal: Greyscalegorilla | https://youtu.be/G369nusDX4s | **C4D + Redshift** (traduzir) | **Nota 3**
- Lente **200 mm** para close de vidro; seis copos canelados; 1920x1080.
- Regras de composição: copos **não se tocam nem se cruzam**; linhas apontando para o centro;
  separação maior entre os copos lê melhor (o original tinha mais espaço que a cópia dele).
- Cor: ele admite o vício de cor saturada; o render bom usa **cores mais contidas** (âmbar,
  fumê, lavanda) e **um copo incolor** no meio.
- Luz do original (Dan Zucco): **HDRI faz quase tudo** (escritório de concreto, exposição normal)
  + **uma luz de área só para reflexo** (câmera e difuso desligados) que põe os brilhos nas
  bordas + sol e céu como preenchimento azulado. Fundo branco, piso de mármore.
- A maior lição dele: a luz que só aparece no reflexo. Desligada, o vidro perde os brilhos;
  com difuso ligado, ela ilumina demais.
- Denoise **OIDN** funciona muito bem com vidro (meio manchado no começo, limpa depois).

### 1.10 Using Light Gobos in Redshift
- Canal: Greyscalegorilla | https://youtu.be/mDT94FHPg9c | **C4D + Redshift** (traduzir) | **Nota 3**
- Gobo = "goes before optics": algo na frente da luz que desenha sombra (persiana, galho, janela,
  cáustica).
- Montado numa **spotlight** com textura. Posição do gobo = **apontar a luz**; com o modo grafo
  dá para deslocar, girar, ladrilhar e corrigir a cor da textura.
- **Maciez do gobo atrelada à maciez da sombra** da luz (softness 1 a 3 no exemplo).
- Cáustica: abrir o cone e ladrilhar **1,5 × 1,5**; baixar a exposição da câmera para clima de
  "reflexo de piscina".
- **Gobo tem que ser motivado:** sombra de árvore sem árvore possível por perto parece errada.
  Persiana na parede = "existe uma janela na sala".
- Sol de fim de tarde: estoure um pouco as altas luzes (luz forte + exposição da câmera).

### 1.11 CG Geek vs. Ai
- Canal: CG Geek | https://youtu.be/XWo0NRdafLk | **Blender 4.x** (2024) | **Nota 2**
- Não é sobre IA operando 3D: é artista contra Midjourney gerando imagem.
- Processo humano: **3 paletas de cor** primeiro → manchas 2D no Grease Pencil para achar
  composição → só então 3D.
- Terreno orgânico: pontos espalhados + icosfera deformada instanciada com rotação/escala
  aleatória → `Realize Instances` → modificador **Remesh** (vira rocha). O mesmo ao longo de uma
  curva (`Curve to Points`) desenha a ilha em "8".
- Profundidade: geometria **perto e longe** da câmera. Grama e rocha por máscara da normal Z
  (`Separate XYZ` → `Color Ramp`).
- **Cada cor da paleta precisa de um portador na cena:** o roxo virou vinhas emissivas e uma
  segunda luz (sol roxo vindo de baixo, "outro planeta" fora de quadro).
- Nuvens VDB com **dois Volume Scatter de anisotropia diferente** somados. Rastro volumétrico atrás
  da nave guia o olho. Humanos escaneados dão escala.
- Onde a IA de imagem falhou: não entendeu "ilha flutuante" (precisou da palavra "landscape"),
  **bom como miniatura, detalhe ruim ampliado**, pouco controle e nada de animação.

### 1.12 How You Can Make Your Renders Pop in Blender 3.0
- Canal: Ducky 3D | https://youtu.be/0sgdTB1gyUI | **Blender 3.0** | **Nota 3**
- Luz principal **Spot** forte (**20 000 W** na escala dele): **superexponha e depois baixe a
  exposição** na gestão de cor + Look **High Contrast**. É o "pop" dele.
- **Spot size pequeno** para iluminar só uma parte da cena (mancha oval que corta) e **radius
  grande** para a borda da mancha virar degradê suave.
- Preenchimento: duas **Area grandes** de **500 W** feitas com **Alt+D** (instância), para mudar a
  potência das duas de uma vez.
- Sete materiais simples, todos com **Bump fraco** para "dar vontade de tocar": Wave distorcido;
  Voronoi; Noise com **detail 15 a 16** e roughness alta, topo achatado pela rampa (granulado
  fino); Magic com **depth 1**; Noise escala **75** (grande) ou **20** (riscos pequenos).
- Cor: rampa da cor base com a segunda parada **um pouco mais escura que o hex**.
- Truque de continuidade: `Gradient` girado **90°** na peça amarela para a ponta azul encostar no
  vizinho azul. A cor parece "vazar" de um objeto para outro.
- Tese: luz não óbvia (nada de três pontos padrão) + variedade de textura faz o olho ficar mais tempo.

### 1.13 Transition Effect W/ Geometry Nodes
- Canal: Ducky 3D | https://youtu.be/Y_u7ryvs2HU | **Blender 3.0** | **Nota 4**
- Dissolver: `Delete Geometry` com seleção = `Noise` → `Color Ramp`. Animar a parada da rampa
  "monta" e "desmonta" o objeto. Malha densa (subdivida até a densidade de uma icosfera alta).
- Depois do GN, na pilha: **Smooth** (tira o serrilhado da borda) + **Solidify** (dá espessura à
  casca que sobra).
- Tempos: entra em **~100 quadros**, segura, troca de material **q126 → ~q210**, sai em **~100
  quadros** (q213 → q313). Mais rápido que isso "é chocante e não se aprecia".
- Segunda transição no shader: `Mix Shader` entre dois materiais, fator = `Noise` (detail 12) →
  `Color Ramp` em **Constant** (borda dura). Animar a rampa = um material "come" o outro.
- Material 1: preto, bump por `Voronoi` **Distance to Edge** com vetor torcido por Noise via Mix
  (padrão celular orgânico); o Voronoi também na aspereza.
- Luz: duas Area **500 W** azuladas (Alt+D) nas laterais, uma Area **vermelha 1000 → 2000 W**
  atrás; fundo plano preto subdividido (**8 cortes**) com **Wireframe**; lente **85 mm**.
- Custo na fazenda: **308 quadros, ~16 s/quadro, 300 amostras, US$ 2**.

### 1.14 Creative Lighting Effects in Blender 3D
- Canal: Kaizen | https://youtu.be/5iKG9xNMtlw | **Blender 3.x** | **Nota 3**
- Sala de espelhos: paredes com metallic **1**, aspereza **0**; piso quase preto com aspereza por
  `Noise` (escala **12**, detail **15**, roughness **0,7**) → rampa de cinza escuro a quase
  branco (nunca 0 e 1 puros) + bump de outro Noise com **strength 0,1**.
- Tubos de luz por GN: `Mesh Line` (**5** pontos) instanciando linhas de **-3 a 3 m**, quatro lados
  por Transform, girados **45°** em Z, subidos **0,5 m**.
- **Tubo realista em duas camadas:** casca externa `Curve to Mesh` raio **0,02** com tampas, material
  `Mix(Translucent, Transparent)` fator **0,25**; dentro, cópia com escala Y **0,95** e raio
  **0,001** com emissão branca **250**. As pontas escurecem sozinhas porque o núcleo é mais curto.
- Liga e desliga por música: `Delete Geometry` com `Random Value` booleano; probabilidade vem de um
  `Value` com o som "assado" na curva (Bake Sound to F-Curves), passando por `Map Range` invertido
  (to min 1, to max 0). Precisa de `Realize Instances` antes, senão liga tudo ou nada.
- Câmera **panorâmica fisheye equisolid**, FOV **360°**, lente **12**; mundo preto; cubo de névoa
  `Principled Volume` anisotropia **0,6**, densidade **0,1 a 0,3**, azulada.
- Câmera gira **+360°** em Z com interpolação **LINEAR**; troca de cor da emissão chaveada nos
  pontos da música. Saída 1080p, 30 fps, 300 quadros, MP4 "perceptually lossless" + AAC.

### 1.15 How to Make Cloth Objects in Blender 3D (sem simulação)
- Canal: Kaizen | https://youtu.be/i-NHx0PY-pM | **Blender 2.9x/3.x** | **Nota 3**
- Escultura com **Cloth Filter**: modos gravity, inflate, expand, pinch, scale. **Cloth damping
  0,5** (sem isso mexe rápido demais).
- Controle por **Face Sets** (criados da seleção do modo edição) ou por **máscara** (Smooth Mask
  uma vez). Ctrl+I inverte; Alt+M limpa.
- Couro capitonê: icosfera 2 subdivisões, chanfro minúsculo, subdivisão 4 aplicada, seleção do
  chanfro encolhida ao mínimo → face set → infla o cinza, desinfla o verde.
- Ornamento de bronze: plano subdividido 4+4 vezes, máscara desenhada, infla o claro, baixa o
  resto. Almofada: plano extrudado fino, face set na borda, infla.
- Depois: Smart UV Project para o tecido não esticar.

### 1.16 Folding Box Packaging Animation in Blender [Full Process]
- Canal: Derek Elliott | https://youtu.be/O1em_ijMvUk | **Blender 3.1** | **Nota 5**
- Malha: cubo padrão sem a face de cima; loop cut; apaga **duas laterais** do anel de cima para as
  abas internas dobrarem de **pivô mais baixo** que as externas. Abas internas com leve afunilamento.
- Armature com **4 ossos** nas linhas de dobra (nomes F, B, L, R), pai com **Empty Groups** e
  atribuição manual de vértices por aba (controle total, sem pesos automáticos).
- Keying set **Rotation**; fechar em **30 quadros** a **30 fps**. Abas internas passam um pouco
  de **90°**; externas exatamente **90°** (Ctrl). Deixe uma **fresta** entre as abas externas.
- Anti-interseção: as abas externas começam em **~q15**; velocidades diferentes por aba.
- **Bevel** com limit method **None** (o "Angle" faz o chanfro aparecer e sumir quando a aba gira).
- Etiqueta: plano com vários loop cuts + modificador **Curve** num path dobrado; animar o X de
  **q20 a q60** faz a etiqueta "rolar" e assentar sobre a caixa depois que as abas fecham.
- Tudo parentado a um Empty (keep transform) para girar a composição sem quebrar a animação.
- Papelão: `Wave` (projeção Cube) só no **Bump** com strength e **distance muito baixos**
  (ondulado); `Noise` de escala alta com distorção → rampa marrom claro a marrom quase preto;
  aspereza **0,7**.
- Logos por **segundo mapa UV** (nó UV Map) e `Mix` multiplicando preto; a ondulação continua.
- Solidify: **material offset** (miolo sem logo) e **rim offset 2** (borda ondulada por `Magic`
  texture). Use coordenada **Generated**: com Object a textura **escorrega** quando a armature move.
- Etiqueta transparente brilhante; Look **High Contrast** no fim.

### 1.17 Holographic Shader [and engine!] in Blender
- Canal: Derek Elliott | https://youtu.be/0Kpx21jcte0 | **Blender 2.9x/3.0** | **Nota 4**
- Holograma de projeção (não é o iridescente da base). Mundo com força **0**.
- `Emission` + `Fresnel` no fator de um `Mix Shader`: bordas **emissivas**, miolo transparente
  (ele inverteu as entradas para chegar nisso).
- O "transparente" é um segundo Mix: **Transparent + Diffuse**, quase todo transparente. O pouco de
  Diffuse **oclui o que está atrás**: tira a bagunça de ver tudo ao mesmo tempo.
- Manchas pretas = limite de saltos transparentes (padrão **8**). Suba se tiver muitas camadas.
- Linhas de varredura: `Wave` com coordenada **Camera** (as linhas seguem a vista, não a peça),
  eixo Y, no fator de um último Mix com Transparent. Animar o Y move as linhas.
- Look **Very High Contrast** para o "pop".
- EEVEE (versão antiga): bloom ligado, blend mode **Alpha Blend**, sombra desligada.

### 1.18 Motion Design Process: Art Direction & Style Frames
- Canal: The Futur Academy (Nidia Dias) | https://youtu.be/J76-IxN7pVI | C4D + Redshift | **Nota 4**
- **Style frame** = imagem parada final (2D ou 3D) que define a cara do filme antes de animar.
- Microsoft 365: ler o guia da marca (Fluent Design) antes; fase longa de exploração; o filme tem
  que parecer do **mesmo mundo** da campanha estática.
- **Explore longe antes de se autocensurar.** O cliente pode ser mais aberto do que você supõe.
- Metáfora boa (cor "sangrando" no vidro = colaboração) foi achada **abstrata demais**. A versão
  aprovada ganhou **texto na tela** para quem vê pela primeira vez.
- **Teste de leitura:** um colega disse que a grade parecia **azulejo de banheiro**; ela tirou.
- Storyboard com **lista de planos de interação** (clique, digitação) para a filmagem.
- "Como você iluminaria isso na vida real?" e "onde está o operador, a grua, o trilho?": câmera
  plausível = visual premium. Grande-angular voando parece falso.
- Peça de uma imagem só (HP): uma progressão de contraste (bruto à esquerda, orgânico à direita)
  conta a história no lugar da sequência.
- Quando ela mesma anima, começa por **testes de movimento** e só depois faz os style frames.
- Motion procedural = "duplicar, escalar, girar e deslocar" (cloners).
- Reserva: sapato gigante num ambiente realista **ficou fora de proporção**. Ela refez depois de
  aprovado e explicou o porquê ao cliente. Loop: infla na batida do sapato e desinfla de volta.
- Reaproveitar simulação: colunas iguais = a mesma simulação deslocada e girada.

---

## 2. Síntese por tema

### 2.1 Condensação
- **Regra:** gotas que se fundem parecem água; esferas soltas parecem miçanga. Por quê: a tensão
  superficial junta gotas vizinhas. Fonte: 1.1.
- **Dois métodos, combine:** (a) base da casa: icosferas achatadas instanciadas (controle, barato);
  (b) Joey: pontos → volume/SDF → malha (gotas fundidas, mais orgânico, mais caro).
- **[cg, inferência]** No método (b) as esferas nascem centradas na superfície, então metade
  afunda na lata e sobra uma **cúpula**: o achatamento sai de graça.
- **Valores (escala do Joey → escala real):** lata de 1,2 m, raio 0,01 a 0,02 m. Numa lata real de
  122 mm (fator 0,1): **raio 1 a 2 mm**, distância mínima Poisson **2 a 3 mm**. Bate com a faixa da
  base (gotas grandes 1 a 3 mm).
- **Sinal de erro:** gotas idênticas em latas iguais (faltou Realize da coleção); gotas em degraus
  "fatiadas" (resolução baixa ou threshold errado); rótulo perdeu a UV (GN na própria lata).
- **Antigo → 5.2:** `Points to Volume` + `Volume to Mesh` (3.x) → no 5.2 a base já confirmou
  `Points to SDF Grid` + `Grid to Mesh`. Os nós antigos provavelmente ainda existem **[sonda]**.

### 2.2 Vapor
- **Três caminhos agora:** A procedural (base), B1 Mantaflow + Principled Volume (base), **B2
  Mantaflow + Emission só para a câmera** (1.2).
- **Regra do fio:** vapor bonito sai em fios. Por quê: um fluxo uniforme vira bolha/cogumelo.
  Valores: textura Clouds contraste 5 no fluxo com offset linear 0 → 1,5 em 300 q; surface
  emission 0,6; dissolve 7 a 30 q; vento 0,05 ou turbulência 0,5. Fonte: 1.2, 1.3.
- **Regra da pré-rolagem:** cache começando em -100 para o vapor já estar estabelecido no q1.
  Fonte: 1.3.
- **Regra do recorte:** densidade → rampa preto/branco/preto aproximada recorta a fumaça rala.
- **[conflito]** O vapor emissivo **ignora a direção da luz**: não brilha mais em contraluz. A base
  manda contraluz + anisotropia 0,6 para vapor fotorreal. Use o B2 em fundo escuro estilizado ou
  quando o ruído do volume atrasar o prazo; no fotorreal fique com A ou B1.
- **Sinal de erro:** cogumelo no topo (sem dissolve); vapor surgindo do nada no q1 (sem
  pré-rolagem); vapor escuro e invisível (densidade de material baixa: subir para ~15); vapor
  iluminando a mesa (emissão sem Is Camera Ray).
- **Custo:** emissão ~20% mais rápida que Principled Volume no Cycles (1.2, máquina do autor).
- **Antigo → 5.2:** "Look High Contrast" era do Filmic → no 5.2 `AgX - High Contrast` (a casa usa
  Medium High). Denoise pelo compositor é desnecessário no 5.2 (denoise do Cycles) **[cg]**. Se
  precisar do compositor, ele mora em `scene.compositing_node_group`.

### 2.3 Splash
- O vídeo 1.4 confirma a escola da base (gravidade 0 + força em degraus + time scale 1 → 0,2).
- **Acrescenta:** proxy de colisão em gaiola fechada (produto com furos ou muitas peças vaza
  água); particle radius **1,3** e upres **3**; força tirada do domínio no fim para não formar a
  "bola"; e **cortar para o próximo plano** em vez de resolver o fim da simulação.
- **Material:** IOR 1,33 + Volume Absorption para cor por espessura (bate com a base: cor no volume,
  não na superfície).
- **Sinal de erro:** bola de água presa no atrator; água atravessando o produto (sem gaiola);
  velocidade de "explosão" (força -200 em vez de -5).

### 2.4 Cor: Khronos PBR Neutral
- Confirma a tabela da casa: Khronos quando o hex é a estrela, sob luz neutra.
- **Acrescenta:** fundo de imagem **emissivo** (degradê do cliente) perde saturação no AgX. Se o
  fundo é arte de marca, ou Khronos no plano inteiro, ou fundo em 2D na composição.
- **[conflito]** O vídeo diz que o Khronos tem "mais contraste"; a base mediu **queda da separação
  produto e fundo** (0,015 contra 0,064). Os dois podem ser verdade (contraste global maior,
  separação local menor). Vale a medição da casa: com Khronos, a luz precisa separar o produto.

### 2.5 Luz: normalize, gobo, luz só de reflexo, mancha de spot
- **Normalize (1.6):** padrão ligado = watts absolutos; mudar o tamanho só muda a maciez.
  Desligado: `potência total = valor × área em m²`. **Regra para script:** nunca desligue o
  normalize usando os watts das tabelas da casa **[inferência: as tabelas foram medidas com o
  padrão do 5.2.2, normalize True]**. Ajuste global em stops pelo `exposure` da luz.
  Sinal de erro: lâmpada pontual de raio milimétrico estourando no reflexo.
- **Gobo (1.10):** sempre **motivado** (janela, árvore possível no mundo da cena). A maciez do gobo
  vem do tamanho da luz, igual à da sombra. Ladrilhar a textura (1,5×) adensa o padrão. **5.2:** a
  base já faz gobo com geometria (persiana). O caminho com textura dentro de uma luz Spot no Cycles
  existe **[cg, sonda]**, mas é a lacuna 8 da base.
- **Luz só de reflexo (1.9):** uma área que não ilumina nem aparece, só brilha no vidro. **5.2:**
  luz é objeto, então `light_obj.visible_diffuse = False`, `visible_camera = False`,
  `visible_glossy = True` **[cg; a base confirmou essas propriedades em objetos de malha; em luz,
  sonda]**.
- **Mancha de spot (1.12):** spot fechado ilumina só parte do quadro; raio grande deixa a borda em
  degradê. Superexpor e baixar a exposição da vista aumenta o "pop". **[conflito leve]** A casa diz:
  exposição global entre -1 e +1, senão as luzes estão erradas. Use o truque dentro dessa faixa.
- **Luz motivada em geral (1.11, 1.18):** toda luz extra precisa de uma fonte crível ("outro
  planeta" fora do quadro, janela, operador).

### 2.6 Materiais especiais
- **Pintura de carro (1.7):** só confirma hex/aspereza 0,1/metal/verniz. **Mantenha a base**
  (flocos Voronoi na Normal ~1500/m + Coat 1, aspereza do verniz 0,02). **5.2:** `Specular` →
  `Specular IOR Level`; `Clearcoat` → `Coat Weight`.
- **Holograma de projeção (1.17):** Fresnel controla emissão nas bordas; Diffuse em pouca dose
  oclui o fundo; Wave em coordenada Camera para varredura. **Não confundir** com o "holográfico"
  da base, que é iridescência por Thin Film. **5.2:** saltos transparentes =
  `scene.cycles.transparent_max_bounces`; no EEVEE o "Alpha Blend" virou
  `material.surface_render_method = 'BLENDED'` e o bloom saiu do EEVEE (vai pelo nó Glare do
  compositor) **[cg, sonda]**.
- **Vidro de produto (1.9):** HDRI + luz de reflexo + preenchimento frio; cores contidas; um item
  incolor; nada se tocando. OIDN combina com vidro (confirma a casa: 64 amostras + OIDN ainda deixa
  "cera" nos reflexos; preset final 256).
- **Tubo de luz (1.14):** núcleo emissivo fino dentro de casca translúcida. **[conflito aparente]**
  A casa manda tubo de neon com emissão 1,0 a 2,0. Aqui 250 funciona porque o núcleo tem 1 mm de
  raio e fica escondido: o que a câmera vê é a casca translúcida. Meça no fotômetro antes de usar.
- **Papelão (1.16):** ondulado no Bump (Wave), polpa no Noise, rampa de dois marrons, aspereza 0,7,
  borda ondulada no rim do Solidify. Chanfro da casa para caixa de papel cartão: 0,3 mm.
- **Tecido sem simulação (1.15):** Cloth Filter em face sets é rápido e controlável, mas é
  ferramenta de pincel interativo (ver lacunas).

### 2.7 Embalagem dobrando (1.16)
- **Regras:** abas internas dobram de pivô mais baixo e passam um pouco de 90°; externas param em
  90° com fresta; externas começam ~15 q depois; cada aba com velocidade própria. Por quê: dobra
  simultânea cruza as abas e parece máquina.
- **Valores:** 30 q no total a 30 fps; etiqueta rola de q20 a q60 (começa antes do fim das abas,
  assenta depois).
- **Sinal de erro:** chanfro piscando (Bevel em Angle); textura escorregando na aba (coordenada
  Object com armature); abas atravessando (sem defasagem).
- **[conflito]** O mundo "papel e recorte" da base fala em dobra de 12 a 18 q com 4% de overshoot.
  Lá é papel estilizado. Embalagem realista segue o Derek (30 q, sem overshoot nas externas).
- **5.2:** Auto Smooth sumiu no 4.1 → `Smooth by Angle` (`shade_auto_smooth`) **[cg]**; `Mix RGB`
  → nó `Mix` em modo cor; `Specular` → `Specular IOR Level`.

### 2.8 Transições por Geometry Nodes (1.13, 1.14, 1.8)
- **Dissolver por Delete Geometry + ruído:** limiar animado; Smooth + Solidify depois.
- **Troca de material por máscara de ruído** com rampa Constant (borda dura).
- **Liga e desliga por som:** Random booleano com probabilidade vinda de áudio.
- **Cartões:** Snap no fator dá movimento em degraus; lock axis evita cartão virando.
- **[conflito]** O Ducky usa ~100 q para entrar e ~100 q para sair (3,3 s cada). Na casa, gancho e
  tensão ficam em 30 a 45 q por plano. Em filme social, comprima para 30 a 45 q com a curva
  assimétrica da casa (saída 10%, chegada 70%); 100 q só em plano de revelação lenta.
- **5.2:** para script, anime um `Compare`/`Map Range` (entrada com `default_value`) em vez da
  posição da parada da Color Ramp. É mais fácil de chavear e de ler no channelbag **[cg]**.

### 2.9 Direção de arte e style frames (1.18, 1.11)
- Ordem: guia da marca → paleta → manchas 2D → style frames → movimento. Exceção: quando o mesmo
  artista anima, teste de movimento antes do style frame.
- Explorar longe antes de cortar; metáfora abstrata precisa de âncora (texto, produto visível).
- Teste de leitura por terceiro: o que **parece** (azulejo de banheiro) vence o que você quis dizer.
- Checar **escala e proporção** produto × ambiente antes de aprovar (sapato gigante).
- Câmera e luz plausíveis: pergunte onde estariam o operador, o trilho e a lâmpada.
- Cada cor da paleta precisa de um portador (material, luz, emissão).
- Uma imagem só conta história por **progressão de contraste** no quadro.

### 2.10 Erros de IA em 3D
- O vídeo 1.11 é sobre IA de imagem (Midjourney), não sobre um agente operando o Blender.
- O que vale para o estúdio: a IA de imagem **erra conceito espacial** ("ilha flutuante"),
  **segura como miniatura e falha ampliada**, e dá pouco controle. Para o Claude, a analogia é:
  conferir no render em 100%, não na miniatura. O medidor e os renders de prova da casa já cobrem.
- O vídeo **não traz** erros típicos de LLM em script de Blender (ver lacunas).

---

## 3. Receitas para testar no Blender 5.2

Todas em metros, 30 fps, AgX `Medium High Contrast` salvo indicação. Nomes de API marcados
**[sonda]** precisam de confirmação antes de virar script oficial.

**R1. Condensação fundida (SDF) numa lata real**
1. Lata 66 × 122 mm. Objeto separado "gotas" com GN: `Object Info` (lata, `transform_space =
   'RELATIVE'`) → `Distribute Points on Faces` (`distribute_method = 'POISSON'`, `Distance Min`
   0,0025, `Density Max` 200000).
2. `Random Value` float 0,001 a 0,002 → `Set Point Radius`; `Points to SDF Grid` (`Radius`
   ligado ao raio por ponto se o nó aceitar campo; senão valor fixo 0,0015 **[sonda]**,
   `Voxel Size` 0,0005, 1/4 do raio como na base) → `Grid to Mesh` (`Threshold` 0) → `Set Shade Smooth` →
   `Set Material` (Transmission Weight 1, IOR 1,333, Roughness 0, Base Color branca).
3. Variante fiel ao vídeo: `Points to Volume` (Amount, raio pelo Random) → `Volume to Mesh`
   (Amount 128 a 256, threshold 0,5, densidade 1) **[sonda: nós existem no 5.2?]**.
4. Somar a camada de microgotas instanciadas e o embaçado da base.
5. Medir: tempo de avaliação do GN (Timings) e render Cycles 540x960 com 64 amostras + OIDN.

**R2. Vapor emissivo de xícara (Mantaflow gás)**
1. Fluxo: cilindro raio 2 cm, altura 2 mm, 1 cm acima do café, `visible_camera = False`. Fluid
   `FLOW`, `flow_type = 'SMOKE'`, `flow_behavior = 'INFLOW'`, `temperature` 1,2,
   `surface_distance` 0,6 (surface emission), `use_texture = True` com textura `CLOUDS`
   (`contrast` 5), `texture_offset` 0 em q1 e 1,5 em q300, LINEAR **[sonda nos nomes]**.
2. Domínio GAS justo acima da xícara: `resolution_max` 160 (teste 64), `time_scale` 0,8,
   `use_adaptive_domain = True`, `adapt_threshold` 0,001, `beta` (heat) 1,5,
   `use_dissolve_smoke = True`, `dissolve_speed` 30, `cache_frame_start` -100, `cache_frame_end`
   300, `cache_type = 'ALL'` **[sonda]**.
3. Força `WIND` strength 0,05, flow 0, de lado. Xícara `EFFECTOR` colisão.
4. Material do domínio (só Volume): `Volume Info.Density` → `Color Ramp` (0: preto, 0,35: branco,
   0,7: preto) → `Math MULTIPLY` × 8 → `Math MULTIPLY` × `Light Path.Is Camera Ray` → `Emission
   Strength`; `Emission Color` cinza (0,4). Mundo quase preto.
5. Variante EEVEE: `Principled Volume`, Density = rampa × 7.
6. Medir: tempo de bake por resolução (comparar com a tabela da casa do líquido) e render com
   emissão contra Principled Volume no mesmo quadro.

**R3. Café vivo (superfície + pré-rolagem)**
1. Superfície: disco com Grid Fill, Subdivision 2, `DISPLACE` com textura `CLOUDS` de tamanho
   grande (≈ 3× o diâmetro), `strength` 0,08, `direction = 'Z'`, `texture_coords = 'OBJECT'`
   ligado a um Empty que anda em X de forma LINEAR do q1 ao q200 (≈ 1 diâmetro).
2. Aspereza da superfície = foto do café dessaturada (escura brilha, espuma fosca).
3. Vapor: R2 ou base A; se Mantaflow, dissolve 7 a 10 q, turbulência strength 0,5, pré-rolagem -100.
4. Contraluz: Area `DISK` atrás e acima (150° a 170° da câmera, regra da base).

**R4. Splash com gaiola de colisão**
1. Gaiola: GN no produto: `Realize Instances` → `Mesh to Volume` → `Volume to Mesh`; aplicar;
   `REMESH` voxel ~2 mm; usar como `EFFECTOR` e esconder do render.
2. Domínio LIQUID res 64 (teste) / 96 a 128 (final, tabela da casa), `effector_weights.gravity` 0,
   `use_mesh = True`, `mesh_scale` 3, `particle_radius` 1,3, `cache_type = 'MODULAR'`,
   `cache_resumable = True` **[sonda]**.
3. Fluxo plano com surface emission 5. Força `FORCE` com strength: q10 0, q15 -5, q46 -0,5, q70
   -0,2, q71 -5 (CONSTANT). `time_scale`: q34 1, q35 0,2, q70 0,2, q71 0,75 (CONSTANT).
4. No q70 tire a força do domínio (ou corte o plano). Material: Principled `Transmission Weight`
   1, IOR 1,33 + `Volume Absorption` na cor da bebida (base: cola #5A1E0E a 120/m).

**R5. Holograma de projeção**
1. Mundo força 0. Material: `Fresnel` (IOR 1,45 de partida, ajuste até as bordas acenderem) →
   fator do Mix A: entrada 1 = Mix B, entrada 2 = `Emission` (cor menta, strength 3 a 5).
2. Mix B: `Transparent` (entrada 1) e `Diffuse` (entrada 2) com fator 0,2.
3. Varredura: `Texture Coordinate.Camera` → `Wave` (Bands, eixo Y, escala 20 a 40) → fator do Mix
   C entre Mix A e `Transparent`. Animar a fase/offset para as linhas correrem.
4. `scene.cycles.transparent_max_bounces` 16 a 32 se aparecer preto.
5. EEVEE 5.2: `material.surface_render_method = 'BLENDED'` e Glare (Bloom) no compositor **[sonda]**.
6. Medir no medidor: emissão estoura acima de quanto no AgX MHC.

**R6. Vidro com luz só de reflexo**
1. HDRI de estúdio/escritório (Poly Haven, CC0) como luz principal, força 1.
2. Area `RECTANGLE` grande perto e de lado, potência pelo fotômetro; `visible_camera = False`,
   `visible_diffuse = False`, `visible_glossy = True`, `visible_transmission = True` **[sonda em
   objeto de luz]**.
3. Sol fraco azulado como preenchimento (`use_temperature`, 8000 K).
4. Lente 200 mm, objetos sem contato. Comparar com e sem a luz de reflexo no mesmo quadro.

**R7. Mancha de spot com borda macia ("pop")**
1. Spot apontado para 1/2 a 2/3 da cena, `spot_size` 25° a 35°, `spot_blend` 0,3,
   `shadow_soft_size` grande (0,3 a 0,5 m em cena de mesa) para borda em degradê.
2. Preenchimento: duas Area grandes com o **mesmo** data-block de luz (equivalente ao Alt+D),
   2 a 3 stops abaixo da spot.
3. Potência da spot pelo fotômetro até ~5% de pixels estourados; depois `view_settings.exposure`
   entre -0,5 e -1. Look `AgX - Medium High Contrast` (ou High Contrast em mundo pop).

**R8. Gobo motivado por textura na luz (Cycles)**
1. Spot com `use_nodes = True`. Nós: `Texture Coordinate.Normal` → `Separate XYZ` → X/Z e Y/Z
   (`Math DIVIDE`) → `Combine XYZ` → `Mapping` (escala 1,5) → `Image Texture` (persiana/folhas,
   preto e branco) → `Emission.Strength` **[cg, sonda: coordenadas dentro do nó de luz]**.
2. Alternativa garantida: a persiana em geometria da base (`visible_camera = False`).
3. Regra: escolher o gobo pela fonte crível do cenário; maciez pelo `shadow_soft_size`.

**R9. Transição dissolver + troca de material**
1. GN: `Noise` (escala 3 a 5, detail 4) → `Compare` (`GREATER_THAN`, B chaveado de -0,1 a 1,1) →
   `Delete Geometry.Selection`. Pilha: GN → `SMOOTH` (fator 0,5, repeat 5) → `SOLIDIFY`
   (espessura 2 a 3 mm em produto de 15 cm).
2. Tempos: social 30 a 45 q (curva assimétrica da casa); revelação lenta até 100 q.
3. Shader: `Mix Shader` com fator = `Noise` (detail 12) → `Map Range` com faixa estreita (borda
   dura), limiar chaveado com 15 a 30 q de atraso em relação à geometria.
4. F-curves pelo channelbag (`anim_utils.action_get_channelbag_for_slot`), nunca `action.fcurves`.

**R10. Caixa dobrando com etiqueta**
1. Caixa 2 × 2 × 2 (escala do vídeo) ou caixa real com chanfro 0,3 mm. Malha: cubo sem topo, loop
   cut, duas laterais do anel apagadas (abas internas com pivô baixo).
2. Armature com 4 ossos nas dobras; vertex groups F/B/L/R atribuídos por face via bmesh; modificador
   `ARMATURE`. (Alternativa mais simples por script: cada aba como objeto separado com origem na
   dobra, filhas do corpo.)
3. Chaves de rotação: internas q0 → q30 até 95°; externas q15 → q30 até 90° exatos, velocidades
   diferentes; deixar 1 a 2 mm de fresta.
4. `SOLIDIFY` (material_offset 1, material_offset_rim 2) + `BEVEL` (`limit_method = 'NONE'`).
5. Etiqueta: plano com 20 loop cuts + `CURVE` num path dobrado; X chaveado q20 → q60.
6. Papelão: `Wave` (escala alta) → `Bump` (strength 0,05, distance 0,001); `Noise` escala 30+
   distorção 0,5 → rampa (#B08A5A a #3A2A1A) → Base Color; aspereza 0,7; rim com `Magic` em
   coordenada **Generated**.

**R11. Tubo de luz translúcido**
1. Curva raio 20 mm, material `Mix(Translucent, Transparent)` fator 0,25.
2. Núcleo: a mesma curva com 95% do comprimento, raio 1 mm, `Emission Strength` 250 (escala do
   vídeo), cor do mundo.
3. Névoa: cubo `Principled Volume` densidade 0,3, anisotropia 0,6 (faixa de mesa da casa).
4. Medir estourado no fotômetro e comparar com o neon da casa (emissão 1 a 2 + Area ao lado).

**R12. Khronos contra AgX com fundo de marca emissivo**
1. Embalagem com rótulo de hex conhecido + fundo plano com degradê de marca em `Emission` 1.
2. Render igual em `AgX` (MHC) e `Khronos PBR Neutral` (None). Medir ΔE do rótulo e do fundo e a
   separação produto/fundo no `qa.py`.

---

## 4. O que acrescenta ou corrige na base

1. **Vapor:** novo caminho B2 (emissão + `Is Camera Ray`) para fundo escuro e prazo curto, com o
   conflito anotado: não reage a contraluz. Somar ao playbook 7 do cap 03 a **pré-rolagem**
   (cache em -100) e o **fluxo texturizado** (Clouds, contraste 5, offset linear).
2. **Condensação:** registrar o método fundido (SDF) como segunda camada e a regra de
   **Realize** em coleção para variar por lata. A faixa de raio convertida (1 a 2 mm) confirma a base.
3. **Splash:** acrescentar a **gaiola de colisão**, particle radius 1,3, upres 3, e a saída do fim
   (força fora do domínio ou corte). Os degraus de força confirmam o R13 já destilado.
4. **Normalize:** escrever no cap 05 a regra "script nunca desliga normalize com watts da
   tabela" e a fórmula do modo desligado (`valor × área m²`). 1×1 m é o ponto neutro.
5. **Luz só de reflexo em objeto de luz:** estender a regra do cartão de reflexo invisível para
   luzes (sondar `visible_diffuse` em luz).
6. **Gobo:** acrescentar a regra **"gobo motivado"** ao mundo luz natural e ao cap 05.
7. **Holograma:** nova entrada de material "holograma de projeção", separada do "holográfico
   iridescente" da base, para não haver confusão de nome.
8. **Embalagem:** novo playbook de dobra (30 q, defasagem 15 q, internas além de 90°, Bevel sem
   limite, Generated na borda). Fica separado da dobra estilizada do mundo papel.
9. **Transições:** catálogo ganha "dissolver por ruído", "troca de material por máscara" e "liga e
   desliga por áudio", com a correção de ritmo (30 a 45 q em social).
10. **EEVEE:** tutoriais antigos mandam ligar AO, Bloom e SSR. No 5.2 essas chaves não existem
    desse jeito; bloom vai pelo Glare do compositor **[cg, sonda]**. Avisar no cap 07.
11. **Looks:** três autores (Ducky, Derek, Blender Made Easy) terminam com High/Very High
    Contrast. Isso apoia `AgX - High Contrast` como opção de mundo estilizado. **Não muda** o padrão
    fotorreal da casa (Medium High).
12. **Direção:** acrescentar ao cérebro de diretor o teste de leitura por terceiro, a checagem de
    escala produto × ambiente antes da aprovação, e "cada cor da paleta tem um portador".
13. **Pintura de carro:** nada a corrigir; o vídeo é inferior à receita da base.

---

## 5. Lacunas

1. **Erros de agente de IA operando o Blender:** nenhum vídeo cobre isso (o CG Geek é Midjourney).
   Continua valendo só o `blender-5.2-verdade.md` e a memória de pegadinhas.
2. **Condensação que escorre** (gota com rastro), embaçado por shader e gelo: ninguém mostra.
3. **Nenhuma receita deste lote foi medida na RTX 3050.** Vapor Mantaflow em res 160 com 300 q
   pode ficar caro; medir antes de prometer prazo.
4. **Gobo por nós na luz** segue sem prova no 5.2 (a coordenada dentro do nó de luz é suposição).
5. **Cloth Filter** é ferramenta de pincel interativo; por script em modo `-b` provavelmente não
   roda **[cg]**. Alternativas a testar: Cloth com pressão (simulação curta), ou deslocamento por
   máscara de face set em GN.
6. **Extra Nodes** (cartões) é complemento de terceiros (licença e preço não vistos). Precisa
   reescrever em GN nativo (Mesh Line, Curve to Points com Align Rotation e eixo travado, Snap).
7. **Vidro do Greyscalegorilla:** sem IOR, dispersão nem espessura; só a direção de luz.
8. **Khronos e Futur sem números:** confirmação qualitativa.
9. **"Bake Sound to F-Curves"** mudou de nome no 4.x (provavelmente `graph.sound_to_samples`)
   **[sonda]**. Para script é mais robusto ler o áudio e escrever as chaves direto.
10. **Câmera panorâmica fisheye** no 5.2: confirmar `cam.type = 'PANO'` e
    `panorama_type = 'FISHEYE_EQUISOLID'` **[sonda]**.
11. Holograma com glitch/tremulação e flicker de marca: não coberto.
