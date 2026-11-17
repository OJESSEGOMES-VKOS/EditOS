# Destilado: Materiais e Realismo

Base de conhecimento do "Estúdio Claude + Blender 3D". Fonte: as 18 transcrições `material__*`
em `pesquisa/transcricoes/` (legenda automática, interpretada). Destilado em 2026-10-02.

**Legenda das marcas**
- **[sonda 5.2]**: conferido rodando Python no Blender 5.2.2 LTS desta máquina em 2026-10-02
  (nome de nó, índice de socket, enum, valor padrão). É verdade, não memória.
- **[conhecimento geral]**: vem de mim, não dos vídeos. Use, mas trate como hipótese até testar.
- **(fonte: Canal)**: veio do vídeo citado.
- Valor entre aspas de legenda ambígua ("05") vem com as duas leituras possíveis.

**Escala de referência.** Os valores de escala de textura dos vídeos de vidro e de produto foram
calibrados para objeto de uns **20 cm com escala aplicada** (Ctrl+A) e coordenada **Object**
(fonte: Ryan King Art). Com coordenada Object, `Scale` do nó de textura significa mais ou menos
"ciclos por metro". Objeto maior ou menor: escale junto.

---

## 0. Os 12 achados que mais pesam

1. **Material bonito com luz ruim parece falso; material simples com luz certa parece real.** Vidro
   e superfície brilhante só existem pelo que refletem. Sem cartão preto na lateral, o vidro perde
   a borda (Wenbo Zhao); luz de área crua dá reflexo feio em superfície brilhante (Extra 3D).
2. **Aspereza nunca é um número.** Toda superfície leva pelo menos 2 camadas de variação na
   Roughness (ruído fino + mancha/sujeira), sempre sutis (fator ~0,1 a 0,25). (Kaizen, Ryan King,
   TopChannel, Branden Arc)
3. **Grunge direto na Roughness parece molhado.** Tem que comprimir a faixa (somar um piso ou
   Map Range), não ligar cru. (TopChannel1on1)
4. **Aresta viva é o selo do CG.** Chanfro real (modificador Bevel) nas bordas grandes e nó Bevel
   na Normal para o fio de luz nas pequenas; peças separadas recebem o chanfro do shader na
   interseção se forem **um objeto só** (Ctrl+J). (Blender Secrets, DECODED, CG Boost)
5. **Máscaras inteligentes procedurais substituem o Substance**: curvatura (Pointiness),
   borda (Bevel · Normal, ou dois Bevels em Difference) e cavidade (Ambient Occlusion). Todas
   só no Cycles. (Kaizen, Christopher Fraser, DECODED)
6. **O desgaste conta uma história física**: borda gasta vira metal exposto (metálico, mais liso),
   fresta junta sujeira (mais escura e mais áspera), topo junta poeira (Sheen). Cada máscara vai
   para cor, metálico, aspereza e bump ao mesmo tempo, não só para a cor. (Kaizen, DECODED)
7. **Vidro precisa de espessura real** (Solidify) e chanfro; casca de face única refrata errado.
   (Ryan King Art, Berk Kaplan)
8. **Imperfeição de comercial é pista, não protagonista**: impressão digital e risco "pequena
   dica", nunca evidente. (Wenbo Zhao, Ryan King: smudges de 0,02 a 0,4)
9. **Rótulo é pilha de shaders, não uma textura**: base (papel/plástico) → Mix Shader com máscara
   de cromo → Mix Shader com máscara de foil. Branco na máscara = camada de cima. (Jared Brashier)
10. **Repetição de textura denuncia na hora.** Voronoi (saída Color) ligado em Location ou
    Rotation do Mapping quebra o ladrilho com um nó. (DECODED, Extra 3D)
11. **Escala do detalhe tem que bater com o mundo real**: ondulação de água grande demais parece
    gelatina. (Blender Guru) Normal de rótulo a 0,2 já parece "letra de balão"; 0,125 fica real.
    (Jared Brashier)
12. **AO no shader é dinâmico**: ótimo para modelar, ruim para animação (objeto que passa deixa
    "sujeira" viajando). Em animação, assar. (DECODED)

---

## 1. Por vídeo

Nota 1-5 = utilidade para a IA montar material por script no 5.2 (não é nota do vídeo em si).

### 1.1 How to Create Professional Materials
- **Canal:** Kaizen · **Link:** https://youtu.be/-x-b2U-MSgc · **Nota: 5** · **Versão:** 2.9x/3.x
  (usa Mix RGB, hoje nó Mix em modo Color)
- Cria um "smart material" de caixa metálica pintada **sem textura nenhuma**: tudo sai de máscaras
  geradas pela geometria. Se você muda a malha (inset, detalhe novo), o material se adapta sozinho.
- **Avisa que a maioria das máscaras só funciona no Cycles.**
- **Curvatura:** Geometry → `Pointiness` → Color Ramp (aperta as paradas para contraste) → Gamma
  → Math Multiply com um Noise Texture (para a curvatura não ficar perfeita).
- **Máscara de borda:** Bevel (Normal) e Geometry (Normal) entram num Vector Math **Dot Product**;
  a saída fraca vai num Map Range com **To Min = 1 e To Max = 0** (inverte). Para quebrar a
  perfeição: Noise (Detail e Roughness altos) → Map Range → **Radius do Bevel**.
- **Máscara de cavidade (AO):** Noise ligado na entrada `Color` do Ambient Occlusion; saída
  `Color` do AO → Color Ramp **invertido** (Flip).
- **Cor em camadas:** divisão em duas cores por Gradient Texture (Mapping com Rotation Y = 90°,
  rampa em Constant) → mix com cor mais escura/marrom pela máscara de AO (sujeira) → mix com cor
  mais clara pela curvatura (realce) → mix final com cinza médio-escuro pela máscara de borda
  (metal exposto).
- **Metallic = máscara de borda direto.** Borda vira metal, o resto continua tinta.
- **Roughness:** Mix com Factor = rampa da borda (parada branca puxada à esquerda), A = rampa do
  AO (preto → cinza médio, branco → cinza claro, para nada ficar 0 nem 1), B = preto/cinza escuro
  (borda reflexiva). Depois um segundo Mix com Noise→Ramp no fator **0,25**.
- **Normal:** a rampa do AO → Bump `Height`, **Strength 0,25** (a sujeira ganha relevo).

### 1.2 Realistic Materials Are Easy In Blender
- **Canal:** DECODED · **Link:** https://youtu.be/y9_dnFhIgrA · **Nota: 5** · **Versão:** 4.x
  (cita o Sheen novo, que é do 4.0+)
- **Anti-repetição de um nó:** Voronoi com UV no Vector; saída **Color** ligada no **Location** do
  Mapping corta a imagem em células aleatórias. Subir a escala do Voronoi corta mais; costura quase
  some em textura ruidosa; `Detail` alto mistura as bordas das células.
- **Bevel em peças separadas:** com o nó Bevel na Normal, peças separadas mostram quina viva na
  interseção. **Juntando tudo num objeto (Ctrl+J), o Bevel do shader arredonda até a
  interseção** entre malhas que não se tocam topologicamente.
- **Textura por distância da câmera:** Camera Data `View Distance` → Math Multiply (valor pequeno,
  ajustado com Shift) → Color Ramp em **Ease** → Factor de um Mix Shader entre textura de perto
  (alta resolução) e de longe. Acompanha a câmera em animação; o defeito é a troca visível se a
  câmera correr rápido.
- **Sujeira de transição entre materiais:** Ambient Occlusion → Color Ramp invertido →
  `Distance` "04" (0,04 ou 0,4, legenda ambígua), **Inside desligado, Only Local desligado** (precisa
  sentir os outros objetos) → Factor de um Mix Color em **Overlay** com cor escura, entre a textura
  difusa e o Principled. Vira node group "dirt" reaproveitado em todos os materiais.
- **Limite do AO:** qualquer objeto ganha a sujeira (um gato recém-chegado fica "sujo"); personagem
  andando arrasta a sombra. **Solução: assar em textura.**
- **Poeira com Sheen:** Sheen Weight sobe = camada de pó; **Sheen Roughness sobe**; Sheen Tint em
  cinza amarronzado. Máscara: Texture Coordinate `Normal` → Separate Color → canal **Blue (Z)** = só
  o topo. Mix Color com A = Blue, Factor = Noise (escala baixa, Detail e Roughness altos) → um pouco
  de pó nas laterais. O Sheen já faz o efeito de borda (Fresnel), não precisa fingir.

### 1.3 Procedural Glass Material (Blender Tutorial)
- **Canal:** Ryan King Art · **Link:** https://youtu.be/4bBCZwkp8ww · **Nota: 5** · **Versão:** 4.x
  (Transmission Weight, Coat Weight). Receita completa na seção 3 (R7).
- **Cena:** icosfera subdiv 5 escalada para 0,2 com escala aplicada; copo = cilindro sem tampa com
  **Solidify bem fino**, **Bevel 4 segmentos**, **Subdivision 1**. Diz que vidro sem espessura
  não fica realista.
- **Só Cycles:** funciona melhor no Cycles, "não funciona muito bem no Eevee".
- **Luz:** uma área com Power ~80 de frente-lateral + HDRI (Poly Haven, 1K) com Strength 2; fundo
  plano cinza bem escuro para o vidro aparecer; câmera 80 mm.
- **Coordenada Object** em tudo (mapeamento mais uniforme), Mapping com escala única exposta.
- **Manchas/digitais (Roughness):** Voronoi **Smooth F1, Scale 18, Detail 15** → Color Ramp com as
  paradas invertidas; distorcido por Noise (Scale 15, Detail 15, Roughness 1) via Mix Color
  **Linear Light** (A = vetor do Mapping, B = Noise) com fator **0,1**.
- **Ruído de aspereza:** Noise **Scale 30, Detail 15, Roughness 0,8** → Color Ramp (preto puxado) →
  Mix (A preto, B rampa) = slider liga/desliga. Aspereza global por Brightness/Contrast com o
  Brightness dividido por **40** (Math Divide) para o controle não ser sensível demais.
- **Rachaduras (Normal):** dois Voronoi **Distance to Edge**, Scale **15** e **30**, Detail 15,
  Roughness **0,52**, Lacunarity **3**, somados com Mix **Darken** fator 1 → Color Ramp com o branco
  puxado quase para o preto (linhas finíssimas) → Bump. Distorção: Noise (Scale 20, Detail 15,
  Roughness 0,6) via Linear Light fator **0,01**.
- **Empenamento (vidro soprado):** Noise Scale 10 → Bump com Strength 0,1 a 0,2, encadeado (a Normal
  do Bump das rachaduras entra na `Normal` do Bump do empenamento).
- **Principled:** Base Color branco 1,0, **Transmission Weight 1**, Alpha exposto como
  "transparência", Coat Weight/Coat Roughness expostos (verniz extra). Smudges somados à aspereza
  por Mix **Add**. Valores sugeridos: smudges 0,02 a 0,4, blending 0,1 a 0,2, noise roughness
  0,3 a 0,4.
- Usa Filmic "Very High Contrast" (no 5.2 a cena já nasce em AgX; ver `blender-5.2-verdade.md`).

### 1.4 The RIGHT Way to do Edge Wear (in Cycles!)
- **Canal:** Christopher Fraser · **Link:** https://youtu.be/EQ149bMtKRA · **Nota: 4** ·
  **Versão:** 2.9x/3.x (Mix RGB)
- **Desgaste de borda com dois Bevels:** Bevel A com **Radius 0** e samples no mínimo; Bevel B com
  raio maior e mais samples. Os dois num Mix em **Difference**, fator 1 → aparece a borda.
- Color Ramp em **Constant** para borda dura. Para cobrir bordas curvas por igual, passar por um
  separador HSV (saída de valor) antes da rampa: saída mais uniforme. No 5.2 isso é **Separate
  Color em modo HSV** [sonda 5.2].
- Máscara → Metallic; outra rampa → fator da cor.
- **Imperfeição no raio:** um mapa de imperfeição (imagem) no Radius do Bevel grande. Para não zerar
  o desgaste nas quinas, **Map Range** entre o mapa e o Bevel com **mínimo 0,01** (sempre há algum
  desgaste) e máximo mais baixo (efeito sutil).
- **Plástico desbotado de sol:** mesma máscara, mas na cor: bordas **mais claras e menos saturadas**
  (Hue/Saturation), em vez de "tinta descascada".
- **Sujeira oposta:** o mesmo Map Range no `Distance` do Ambient Occlusion = sujeira de fresta
  irregular. Atualiza em tempo real quando o objeto se move.
- **Só Cycles** (título e método).

### 1.5 Realistic Multi-Layer Product Label Texturing in Blender
- **Canal:** Jared Brashier // JBR4SH · **Link:** https://youtu.be/iwVuA1hWkRA · **Nota: 4** ·
  **Versão:** 3.x (usa "specular 0,7", que no 5.2 é Specular IOR Level)
- Rótulo de produto real = **3 materiais em camadas usando ~5 mapas**.
- **Base:** Principled com cor, roughness (com Color Ramp no meio "por boa prática", para ajustar a
  reflexão sem refazer o mapa) e Normal Map do relevo tátil.
- **Normal Map Strength:** 0,2 já é demais ("letras de balão"); usa **0,125**.
- Troca o espaço do Normal Map de Tangent para **Blender Object** porque a queda nas bordas do
  relevo ficou mais parecida com o real, e admite não saber explicar. Ver conflito 2.2-c.
- **Cromo:** Principled **Metallic 1, specular 0,7, Roughness 0,05** ("não perfeitamente
  reflexivo").
- **Foil colorido:** Metallic 1, cor laranja, **Roughness 0,08** (brilha, mas é mais áspero que o
  cromo).
- **Empilhamento:** Mix Shader (Shader1 = base, Shader2 = cromo, Factor = mapa de cromagem) → esse
  Mix vira a nova base → Mix Shader com o foil (Factor = mapa de foil). **Branco = camada de cima;
  preto = deixa passar a de baixo.** Dá para empilhar indefinidamente.
- Luzes escondidas da câmera, fundo infinito (psych), câmera fixa.

### 1.6 Real Glass Texture Blender Tutorial
- **Canal:** Wenbo Zhao · **Link:** https://youtu.be/RmuRtImXIhg · **Nota: 4** · **Versão:** 2.9x/3.x
- Compara 4 vidros com a **mesma luz**: uma área grande + 2 cartões de rebatimento atrás, **sem
  HDRI**.
- Principled com Roughness 0,001 e Transmission 1: acha "meio falso". Glass BSDF padrão: fica bom
  e serve como solução simples. Shader "profissional" de terceiros com cáustica falsa e leve tom
  verde.
- **O dele:** Mix Shader entre **Transparent BSDF** e Principled (Roughness 0, Transmission 1), com
  Factor vindo de **Light Path `Ray Depth` → Math Greater Than** com limiar ajustável. Gosta porque
  o fundo do copo fica mais limpo.
- Detalhe extra: Noise → Color Ramp → Bump, em coordenada Object, para uma ondulação mínima na
  lateral ("vidro liso ainda tem imperfeição").
- Imperfeição (digital, risco) entra pela rampa e é **mínima**: "não exagere, isso perde o sentido".
- **Lição central:** o que mais pesa é a luz. Vidro reflete o entorno; **cartões pretos nas
  laterais desenham a borda do vidro**. Sem eles a borda some e não parece "iluminado por
  profissional".
- Leve **tom esverdeado** = vidro real.

### 1.7 Glass Material in Blender 4.3: Quick and Easy!
- **Canal:** Berk Kaplan - Designer · **Link:** https://youtu.be/tc-xuMpE0o4 · **Nota: 4** ·
  **Versão:** 4.3 (EEVEE novo, mesmo do 5.2)
- Base: Principled branco, **Roughness 0, Transmission 1**, objeto subdividido e Shade Smooth.
- **No EEVEE, três chaves:** no material, **Raytraced Transmission** ligado; na cena, **Ray
  Tracing** ligado; no material, **Thickness = Slab** (Sphere deixa com cara de lupa). No 5.2:
  `material.use_raytrace_refraction`, `material.thickness_mode = 'SLAB'`,
  `scene.eevee.use_raytracing` [sonda 5.2 para os dois do material].
- **Valor ligado na entrada `Thickness` do Material Output:** "05" (0,05 ou 0,5, ambíguo). O socket
  existe no 5.2: `Material Output` inputs[3] `Thickness` [sonda 5.2].
- Espessura física com **Solidify** + Shade Auto Smooth para manter quinas.
- Vidro de carro: cor levemente **verde-azulada e dessaturada**.
- **Truque de dois motores:** duplicar a árvore, uma Material Output com target **Cycles** e outra
  **EEVEE** (`target` em `ALL/EEVEE/CYCLES` [sonda 5.2]). Cada motor usa a sua.

### 1.8 Blender Secrets - 5 minutes of Beveling knowledge
- **Canal:** Blender Secrets · **Link:** https://youtu.be/rzZFIpqc98M · **Nota: 4** · **Versão:** 2.9x+
- **Ctrl+B** para chanfro grande que muda a forma; **modificador Bevel** para chanfro pequeno, em
  **Angle** ou **Weight** (Ctrl+E → Bevel Weight; vários tamanhos num modificador só).
- Chanfro de 2 arestas parecendo liso: **Data Transfer** de normais custom de um gêmeo mais
  chanfrado (mesmo lugar, escondido de viewport e render; Face Corner Data → Custom Normals), ou
  **Weighted Normal** no próprio objeto.
- **Nó Bevel no shader:** Normal do material ← Bevel, **raio bem pequeno**, mais samples = mais
  bonito e mais lento. Para enxergar o fio: **mais especular, menos aspereza**. **Só Cycles, só em
  Rendered.** Usar quando economiza muita modelagem.
- Defeitos de chanfro: n-gon (junte vértices com J), ordem de modificador, geometria dupla (Merge
  by Distance), loops colados demais (deslize com GG) e **escala não aplicada = chanfro
  inconsistente**.
- Perfil custom (escada), miter outer arc/patch em cantos.

### 1.9 6 Blender Hard-Surface Modeling Tricks I Wish I Knew Earlier
- **Canal:** CG Boost · **Link:** https://youtu.be/Ml2t8uxPAQU · **Nota: 3** · **Versão:** 4.2+
  (cita pinar modificador)
- Malha leve + Subdivision (Ctrl+3) + **Crease** (Shift+E) nas arestas duras escolhidas por Select
  Similar → Face Angles.
- Depois **Bevel Weight 1** nas mesmas arestas + modificador Bevel com **Limit Method = Weight** e
  **Harden Normals**: quinas nítidas mas com fio de luz.
- **Pin to Last** no Bevel e no Subdivision para o Mirror entrar antes (`use_pin_to_last` [sonda 5.2]).
- Peça "colada" em superfície curva: Shrinkwrap por vertex group na borda + **Data Transfer de
  Custom Normals, Nearest Face Interpolated** = junção some no shading.

### 1.10 Photorealistic Textures In Blender
- **Canal:** Extra 3D · **Link:** https://youtu.be/aUnpMrAYzGs · **Nota: 3** · **Versão:** 4.x
- Fontes PBR: Poly Haven, ambientCG, Megascans, Poliigon. **Resolução por distância: 8K close,
  4K primeiro plano, 2K fundo.** Displacement em EXR quando der.
- ambientCG traz normal GL e DX: **usar a GL** (o Blender é OpenGL; `convention` OPENGL/DIRECTX
  existe no Normal Map [sonda 5.2]).
- Se o Node Wrangler criar Bump junto com Normal e Displacement, **Strength 0,1 ou 0**.
- AO do pacote: Mix Color **Multiply** fator **0,5** sobre a cor (opcional).
- Displacement and Bump com escala ~**0,03** e geometria suficiente (Subdivision alto).
- Sem UV: coordenada Object + projeção **Box** (com blend; no outro vídeo, 0,2).
- **Anti-repetição:** Voronoi (Object) → Color → **Rotation** do Mapping; bom para grama, terra,
  areia; ruim para tijolo (padrão óbvio).
- **Variação amarrada ao padrão:** Noise 4D (W como semente, Detail máximo) → Ramp → Mix **Screen**
  sobre a cor; depois Mix **Color Burn** com a própria cor via rampa, para a mancha seguir o desenho
  do tijolo.
- **Musgo/reboco pela altura:** Displacement do material base → Ramp duro → Mix (A = máscara de
  ruído, Factor = altura, B = branco) → Mix Shader. Gradient controlado por **Empty** (coordenada
  Object apontando para o Empty) e borda da transição com Color Burn pela altura para não ter
  costura. Displacement de dois materiais se mistura com **Mix Color**, não Mix Shader.
- Decal: imagem com Extension **Clip**, coordenada de um Empty, Location 0,5,0,5,0,5; Alpha
  invertido no Factor; corrosão em volta pela altura.

### 1.11 Photorealistic Texturing In Blender 5.0
- **Canal:** Extra 3D · **Link:** https://youtu.be/8HfKtaDx6tM · **Nota: 3** · **Versão:** 5.0
- Objeto real tem variação, sujeira e imperfeição que material de biblioteca não traz.
- Foto comum vira PBR "pobre": Color Ramp da imagem → Roughness; imagem → Bump Height.
- Coordenada Object + Box, blend **0,2**; aplicar escala.
- **Roughness brilhante:** em vez de mover as paradas, **baixar o branco da rampa** (aproxima de 0).
- **Variação de cor:** Mix Color com Noise ou grunge no Factor; segunda cor = a mesma com
  **saturação reduzida** (Hue/Saturation). Vários grunges somados com Mix em **Add** (fator = opacidade).
- **Mistura de mapas:** displacement e bump somam com **Add**; **normal map mistura com Overlay**.
- Displacement de verdade: Displacement and Bump e desligar a correção de bump (no 5.2,
  `material.cycles.use_bump_map_correction` [sonda 5.2]).
- Sujeira = Mix Shader com um Principled marrom escuro de **Roughness 1**. Desgaste = Dot Product
  Bevel × Geometry + grunge + Map Range.
- Lascas pintadas à mão com estêncil (fora do escopo de script). **Vidro: digital ou risco na
  Roughness via Color Ramp, e pronto.**

### 1.12 Surface Imperfections In Blender For Beginners
- **Canal:** Branden Arc · **Link:** https://youtu.be/bcfzTaC-fEk · **Nota: 3** · **Versão:** 2.9x/3.x
- Imperfeição aparece de **dois jeitos: aspereza diferente e relevo**. Mapas em P&B (ambientCG,
  sharetextures).
- Mapa → Color Ramp (contraste = intensidade) → **Invert** (fator 0/1 alterna "base brilhante e
  manchas ásperas" ↔ "base áspera e manchas brilhantes") → Roughness.
- Mesmo mapa na cor: rampa colorida (laranja → marrom) = sujeira tingida.
- Relevo: rampa → Bump Height, **Strength e Distance bem baixos**; normal map cru fica errado.
- **Versão procedural:** Noise → Ramp → Roughness; Noise em **4D**, o `W` funciona como semente
  sem mudar a escala.

### 1.13 how to make roughness imperfections in blender using grunge maps
- **Canal:** TopChannel1on1 · **Link:** https://youtu.be/WV7awSYe2MI · **Nota: 3** · **Versão:** 2.8
- Roughness de pacote PBR "ainda parece artificial".
- **Grunge direto na Roughness = aparência de molhado.** Correção: **Math Add** depois do grunge
  (sobe o piso, menos reflexivo) e ajuste o valor.
- Ladrilho: dois grunges diferentes, escalas diferentes, misturados por **Multiply** ou **Screen**.
- Se o resultado sair negativo, **Clamp** (roughness vive entre 0 e 1).
- Cor base → Bump com intensidade muito baixa.
- Funciona em EEVEE e Cycles (roughness por textura não depende de recurso só do Cycles).

### 1.14 Making materials realistic in Blender
- **Canal:** Rob Tuytel · **Link:** https://youtu.be/eimKJnbj5BE · **Nota: 3** · **Versão:** 3.x
- Mistura tijolo + reboco (Poly Haven "castle brick 07", "gray plaster 02"); referências fotográficas.
- **Roughness e Normal em Non-Color** sempre.
- Displacement real: nó Displacement, material em Displacement Only, Subdivision adaptativa em
  **Simple** (Catmull-Clark arredonda o plano). No 5.2 a adaptativa está no próprio modificador:
  `use_adaptive_subdivision`, `adaptive_space`, `adaptive_pixel_size`; o "feature set
  Experimental" não existe mais (`scene.cycles.feature_set` deu erro) [sonda 5.2].
- **Height blend:** máscara (Color Attribute pintado) + altura do tijolo + falloff, montado com
  Subtract/Divide/Add num node group "blend height falloff" → Color Ramp → Mix Shader e Mix Color do
  displacement. O reboco entra **primeiro nas juntas**, como no real.
- Dois rebocos: um "dentro" (entre tijolos) e um "por cima" (displacement maior).
- Variação de tijolo: versões escura e laranja da mesma textura misturadas por máscara.
- Midlevel 0 e escalas diferentes por camada de displacement.

### 1.15 The Key to Realism in Blender (or 3D)
- **Canal:** Kaizen · **Link:** https://youtu.be/0OVEJVbklV0 · **Nota: 3** · **Versão:** 4.x
- **Triforce do realismo: sujeito, luz, câmera.**
- Sujeito: fotoescaneamento (patrocínio) captura "manchinhas" que separam o CG do real. Escanear em
  dia nublado ou sombra, nunca sol direto.
- **Luz pelo objetivo, não pela física**: uma fonte só é fisicamente certo e quase nunca parece real.
  Receita dele: HDRI fraco (cor de preenchimento) + área principal (com ou sem gobo) + área de
  preenchimento + planos de rebatimento + às vezes um cubo de Volume Scatter com densidade muito
  baixa e anisotropia alta.
- Câmera: imitar o aparelho (celular, DSLR, câmera antiga). Pós: vinheta (máscara + blur + Alpha
  Over), **Lens Distortion com valor muito baixo** ("ou fica falso"), grão via textura misturada em
  **Linear Light** (grão na sombra) ou **Overlay** (grão no realce).
- Para materiais: "3D cria imagens perfeitas sem a nossa ajuda"; a imperfeição tem que ser
  adicionada de propósito.

### 1.16 Realistic Product Lighting In Blender
- **Canal:** Extra 3D · **Link:** https://youtu.be/WreZ_VKDn4M · **Nota: 3** · **Versão:** 4.x
  (light linking = 4.0+)
- Três luzes: **contra-luz forte** (realce), **lateral dura** (Spread baixo, sombra marcada), lateral
  oposta **macia** (Spread alto). Gire as luzes em volta do 3D cursor no centro do produto.
- Em produto brilhante, área crua dá **reflexo feio**: usar imagem/gradiente na luz.
- **Vidro: planos de Emission com Gradient** (Color Ramp em **B-Spline**, lado claro para trás),
  escondidos da câmera (Object → Visibility → Camera desligado; `visible_camera` [sonda 5.2]).
  Gera degradê suave no reflexo. Não exagerar na força.
- **Light linking** para a luz não estragar o reflexo do chão.

### 1.17 Fixing Your Renders
- **Canal:** Blender Guru · **Link:** https://youtu.be/XK5weMlS47M · **Nota: 2** · **Versão:** 4.x
- Material conta a história: piso de madeira genérico vira concreto polido; tijolo vira tijolo de
  demolição sujo; cano enferrujado "precisa de mais texturização".
- **Escala do bump:** ondulação do lago grande demais "parece gelatina"; tem que ser bem menor.
- Sujeira na água como **decal** por cima melhora o realismo.
- Escolher bons assets é "a coisa mais fácil" para melhorar a imagem; referência, referência.

### 1.18 10+ Blender Tricks That Will Make Your Renders Cinematic
- **Canal:** Extra 3D · **Link:** https://youtu.be/LIYtVHs9zAA · **Nota: 2** · **Versão:** 3.x/4.x
- Planos de Emission no alto e atrás, invisíveis à câmera; nunca luz de frente.
- Neblina: cubo com Volume Scatter **Density 0,01, Anisotropy 0,7**; ou Emission no volume 0,03.
- Lens Distortion "02" (0,02); Glare para brilho.
- Lente: 24 mm ambiente, 70-80 mm personagem; DOF blades 8, ratio 2, f-stop 0,1 a 0,8 (muito
  aberto, efeito forte); 21:9.

---

## 2. Síntese

### 2.1 Regras consolidadas

| # | Regra | Por quê | Valores de partida | Sinal de erro | Fonte |
|---|---|---|---|---|---|
| R-01 | Roughness sempre em camadas: piso + variação fina + mancha | Superfície real tem uso e microrrisco; aspereza uniforme é a assinatura do CG | Piso no tom do material; ruído fino em fator 0,1 a 0,25; manchas 0,02 a 0,4 | Reflexo "de vidro líquido" igual em toda a peça | Kaizen, Ryan King, TopChannel |
| R-02 | Comprimir a faixa da roughness, nunca ligar grunge cru | Mapa P&B cru vai de 0 a 1 e cria zona espelhada que lê como água | Math Add (piso) ou Map Range para faixa estreita; rampa "nada de 0 nem 1" | Manchas com cara de molhado | TopChannel, Kaizen |
| R-03 | Toda máscara vai em 3 lugares: cor, roughness e normal (e metálico se expõe metal) | Desgaste físico muda cor, brilho e relevo juntos | Bump da sujeira 0,25; borda: metálico 1 e roughness baixa | Sujeira que parece "pintada por cima", sem mudar o brilho | Kaizen, Branden Arc |
| R-04 | Aresta nunca viva | Real não tem aresta de espessura zero; a borda pega luz | Modificador Bevel (Weight/Angle) + Harden Normals; nó Bevel com raio pequeno | Silhueta recortada sem fio de luz | Blender Secrets, CG Boost, DECODED |
| R-05 | Peças que se tocam viram um objeto só antes do nó Bevel | O Bevel do shader só arredonda interseção dentro do mesmo objeto | Ctrl+J | Quina dura justo onde duas peças se encontram | DECODED |
| R-06 | Escala aplicada antes de chanfro e textura | Bevel inconsistente e textura deformada com escala não aplicada | Ctrl+A (transform_apply scale) | Chanfro mais largo num eixo; ruído esticado | Blender Secrets, Ryan King, Extra 3D |
| R-07 | Coordenada Object (+ Box com blend 0,2 para imagem) quando não há UV boa | Evita costura e esticamento; procedural não precisa de UV | Object → Mapping; Box blend 0,2 | Textura esticada nas laterais | Ryan King, Extra 3D |
| R-08 | Quebrar repetição | Ladrilho visível denuncia a hora | Voronoi Color → Mapping Location (ou Rotation) | Mesmo desenho a cada X cm | DECODED, Extra 3D |
| R-09 | Imperfeição de produto de comercial é mínima | O cliente quer produto limpo; a imperfeição só "segura" o reflexo | Digital/risco na roughness com rampa apertada | Produto parecendo usado/sujo sem querer | Wenbo Zhao, Ryan King |
| R-10 | Vidro com espessura e chanfro | Refração depende de entrar e sair do volume | Solidify fino (espessura real), Bevel 4 seg, Subdiv 1 | Vidro parecendo bolha de sabão ou lupa | Ryan King, Berk Kaplan |
| R-11 | Vidro se ilumina com cartões, não só com HDRI | O vidro só mostra o que reflete | Cartões pretos nas laterais (borda escura); planos de emissão com gradiente para realce | Borda some; reflexo de quadrado duro | Wenbo Zhao, Extra 3D |
| R-12 | Vidro real tem tom | Vidro sodo-cálcico é levemente verde | Base Color verde-azulado bem dessaturado | "Vidro de CG" incolor demais | Wenbo Zhao, Berk Kaplan |
| R-13 | Superfície brilhante pede fonte de luz com gradiente | Área uniforme vira retângulo chapado no reflexo | Imagem ou Gradient na luz/plano emissor | Reflexo com cara de lâmpada de estúdio quadrada | Extra 3D |
| R-14 | Escala do detalhe = escala do mundo | O olho mede o tamanho pelo detalhe | Bump fino; normal de rótulo 0,125 | "Gelatina", "letra de balão" | Blender Guru, Jared Brashier |
| R-15 | Rótulo = pilha de Mix Shader com máscara P&B | Cada processo de impressão tem outro brilho | Cromo M1 R0,05; foil M1 R0,08; normal 0,125 | Rótulo chapado, tudo com o mesmo brilho | Jared Brashier |
| R-16 | Sujeira de fresta liga os objetos ao mundo | No real, pó e sujeira acumulam no encontro de superfícies | AO, Inside off, Only Local off, Overlay escuro | Objeto "flutuando", sem transição com o chão/vizinho | DECODED, Fraser, Kaizen |
| R-17 | Em animação, AO e máscara de distância têm efeito colateral | São calculados a cada quadro | Assar AO quando objetos se movem; não usar troca por distância com câmera rápida | Sujeira que acompanha quem passa; textura trocando à vista | DECODED |
| R-18 | Poeira no topo, com Sheen | Pó cai e acumula em cima; Sheen faz o Fresnel do pó | Sheen Weight por Normal Z + ruído; Sheen Roughness alto | Pó uniforme em todas as faces | DECODED |
| R-19 | Mapas técnicos em Non-Color | Roughness/normal/altura são dados, não cor | `image.colorspace_settings.name = 'Non-Color'` [conhecimento geral] | Roughness "lavada", normal estranha | Rob Tuytel |
| R-20 | Displacement de verdade só com geometria; senão bump | Displacement desloca vértice | Bump para produto; Displacement + adaptativa para superfície vista de perto | Viewport lento sem ganho; displacement "em degraus" | Extra 3D, Rob Tuytel |
| R-21 | Mistura de mapas por tipo | Cada dado soma de um jeito | Altura/bump: Add; normal map: Overlay; variação de cor: Screen/Add/Overlay | Normal "estourada" ao somar | Extra 3D |
| R-22 | Pós é sutil | Distorção e glare fortes leem como filtro | Lens Distortion ~0,02; grão Linear Light/Overlay | Imagem "instagramada" | Kaizen, Extra 3D |

### 2.2 Conflitos (e como decidir)

- **a) Principled com transmissão vs Glass BSDF vs mistura com Transparent.** Wenbo acha o
  Principled "falso" e prefere Glass BSDF ou o truque do Transparent; Ryan King constrói o vidro
  procedural inteiro sobre o Principled. O próprio Wenbo conclui que a luz pesa mais que o shader.
  **Decisão:** Principled (Transmission Weight 1) como padrão, porque aceita roughness, normal, coat
  e camadas; Glass BSDF quando for um vidro limpo e simples. O truque do Light Path é um "cheat"
  para fundo de copo escuro demais, não o padrão. [conhecimento geral: no 4.0+ o Principled v2 e o
  Glass BSDF usam a mesma família de microfaceta, então a diferença do vídeo antigo diminuiu.]
- **b) Mancha áspera ou mancha brilhante?** Branden Arc mostra as duas (Invert). No vidro, a digital
  é **mais áspera** que o vidro (Ryan King, Extra 3D). [conhecimento geral: em superfície fosca, a
  oleosidade da digital deixa a marca **mais brilhante**.] **Decisão:** base lisa → mancha áspera;
  base fosca → mancha mais lisa.
- **c) Normal Map em Tangent ou Blender Object?** Jared usa Blender Object por resultado visual e
  admite não saber o porquê. [conhecimento geral: normal map de pacote é tangente; Object space só
  é correto se o mapa foi assado em espaço de objeto. O efeito dele provavelmente foi só suavizar
  o relevo.] **Decisão:** Tangent por padrão; para suavizar, baixe o Strength.
- **d) Desgaste por Dot Product (Kaizen) ou por dois Bevels em Difference (Fraser).** Os dois são
  Cycles-only. O de Fraser cobre melhor bordas curvas (com Separate Color HSV); o de Kaizen é mais
  simples de inverter com Map Range. **Decisão:** Dot Product como padrão (menos nós), dois Bevels
  quando a peça é arredondada.
- **e) Displacement real (Rob Tuytel, Extra 3D 4.x) vs "displacement como bump" (Extra 3D 5.0).**
  **Decisão:** produto de comercial = bump; parede/chão em close = displacement com subdivisão
  adaptativa.
- **f) Uma luz só ou várias.** Kaizen: uma fonte é físico, mas não parece real; Wenbo: uma área +
  cartões. Não é conflito real: os dois usam **uma fonte principal e rebatimentos**.
- **g) Filmic (Ryan King) vs AgX.** No 5.2 a cena nasce em AgX; o destilado segue AgX
  (`blender-5.2-verdade.md`).
- **h) "Specular 0,7" no cromo (Jared, 3.x).** No 5.2 vira Specular IOR Level 0,7, mas
  [conhecimento geral] em metal (Metallic 1) a cor de reflexão vem da Base Color e o Specular IOR
  Level quase não muda o resultado. Não confie nesse valor para o cromo; confie em Base Color clara
  + Roughness 0,05.
- **i) Mix de variação de cor.** Screen (Extra 3D PBR), Add (Extra 3D 5.0), Multiply/Screen
  (TopChannel), Overlay (DECODED). **Decisão:** clarear = Screen; escurecer sujeira = Multiply ou
  Overlay com cor escura; somar várias camadas = Add com fator baixo.

### 2.3 Nome antigo → nome no 5.2

**Principled BSDF** (nomes do 5.2 [sonda 5.2]; correspondência [conhecimento geral] salvo nota)

| Vídeo antigo diz | No 5.2 | Observação |
|---|---|---|
| Specular | **Specular IOR Level** | padrão 0,5 = neutro [sonda 5.2] |
| Specular Tint (número) | **Specular Tint** (cor) | padrão branco [sonda 5.2] |
| Clearcoat | **Coat Weight** | |
| Clearcoat Roughness | **Coat Roughness** | padrão 0,03 [sonda 5.2] |
| Clearcoat Normal | **Coat Normal** | também há Coat IOR (1,5) e Coat Tint [sonda 5.2] |
| Transmission | **Transmission Weight** | |
| Transmission Roughness | (removido) usa **Roughness** | |
| Subsurface | **Subsurface Weight** | método padrão RANDOM_WALK [sonda 5.2] |
| Subsurface Color | (removido) usa **Base Color** | |
| Sheen | **Sheen Weight** | Sheen Roughness padrão 0,5 [sonda 5.2] |
| Sheen Tint (número) | **Sheen Tint** (cor) | |
| Emission | **Emission Color** + **Emission Strength** | Strength nasce **0** [sonda 5.2]: cor sozinha não acende |
| IOR 1,45 | **IOR 1,5** | padrão do Principled no 5.2 [sonda 5.2] |
| (não existia) | **Thin Wall**, **Diffuse Roughness**, **Thin Film Thickness/IOR** | novos; nenhum vídeo usa |
| Distribution | GGX ou **MULTI_GGX** (padrão) | [sonda 5.2] |

**Outros nós e ajustes**

| Vídeo antigo diz | No 5.2 | Fonte |
|---|---|---|
| Mix RGB | **Mix** (`ShaderNodeMix`, `data_type='RGBA'`) | [sonda 5.2] |
| Musgrave Texture | **Noise Texture** com `noise_type` (FBM, MULTIFRACTAL, RIDGED_MULTIFRACTAL, HYBRID_MULTIFRACTAL, HETERO_TERRAIN) | [sonda 5.2] |
| Separate RGB / Separate HSV | **Separate Color** (`mode` RGB/HSV/HSL) | [sonda 5.2] |
| Vertex Color | **Color Attribute** (no Python, `ShaderNodeVertexColor` [conhecimento geral]) ou Attribute | [conhecimento geral] |
| Feature Set Experimental + Adaptive | `SubsurfModifier.use_adaptive_subdivision` (+ `adaptive_space`, `adaptive_pixel_size`) | [sonda 5.2] |
| Settings → Displacement (Cycles) | `material.displacement_method` = BUMP / DISPLACEMENT / BOTH | [sonda 5.2] |
| Bump correction | `material.cycles.use_bump_map_correction` | [sonda 5.2] |
| EEVEE Screen Space Refraction / Refraction Depth | `material.use_raytrace_refraction`, `thickness_mode` SPHERE/SLAB, socket `Thickness` do Material Output | [sonda 5.2] |
| Blend Mode (EEVEE Legacy) | `material.surface_render_method` DITHERED/BLENDED | [sonda 5.2] |
| `material.use_nodes = True` | Desnecessário: material novo já nasce com Principled + Output; o atributo dá DeprecationWarning (remoção prevista no 6.0) | [sonda 5.2] |
| `BLENDER_EEVEE_NEXT` | `BLENDER_EEVEE` | `blender-5.2-verdade.md` |
| Filmic | **AgX** (padrão) | `blender-5.2-verdade.md` |
| Shade Auto Smooth | modificador "Smooth by Angle" [conhecimento geral] | |

### 2.4 O que só funciona no Cycles

| Recurso | Cycles | EEVEE |
|---|---|---|
| Nó **Bevel** (chanfro de shader, máscara de borda) | sim | não [conhecimento geral] → use modificador Bevel real |
| **Pointiness** (curvatura) | sim | não [conhecimento geral] → curvatura assada ou atributo de Geometry Nodes |
| Nó **Ambient Occlusion** | sim, completo | aproximado [conhecimento geral] |
| Vidro procedural do Ryan King | sim | "não funciona muito bem" |
| Vidro no EEVEE | n/a | Raytraced Transmission + Ray Tracing + Slab + Thickness |
| Light Path `Ray Depth` (truque do Wenbo) | sim | parcial [conhecimento geral] |
| Displacement real | sim | limitado [conhecimento geral] |

**Consequência para o Estúdio:** a camada de realismo de material (borda, curvatura, AO) é
**Cycles**. Se o pipeline renderiza em EEVEE por tempo (~3 s/quadro, memória
`blender-5-pegadinhas`), o chanfro tem que vir da **geometria** (modificador) e as máscaras têm
que ser **assadas** antes.

---

## 3. Receitas procedurais (prontas para Python)

### 3.0 Convenções de montagem [sonda 5.2]

- Material novo já vem com `Principled BSDF` e `Material Output`. Não use `use_nodes`.
- **Mix (`ShaderNodeMix`) com `data_type='RGBA'`:** `inputs[0]` = Factor, `inputs[6]` = A,
  `inputs[7]` = B, `outputs[2]` = Result. (Em FLOAT: A=2, B=3, out 0.) Os nomes se repetem, então
  **ligue por índice**. `blend_type`: MIX, DARKEN, MULTIPLY, BURN, LIGHTEN, SCREEN, DODGE, ADD,
  OVERLAY, SOFT_LIGHT, LINEAR_LIGHT, DIFFERENCE, EXCLUSION, SUBTRACT, DIVIDE, HUE, SATURATION,
  COLOR, VALUE. `clamp_result` existe.
- **Map Range** (FLOAT): 0 Value, 1 From Min, 2 From Max, 3 To Min, 4 To Max; saída 0 Result.
- **Noise:** 0 Vector, 1 W, 2 Scale, 3 Detail, 4 Roughness, 5 Lacunarity, 6 Offset, 7 Gain,
  8 Distortion; saídas Factor, Color. `noise_dimensions` 1D a 4D.
- **Voronoi:** 0 Vector, 1 W, 2 Scale, 3 Detail, 4 Roughness, 5 Lacunarity, 6 Smoothness,
  7 Exponent, 8 Randomness; saídas Distance, Color, Position, W, Radius. `feature`: F1, F2,
  SMOOTH_F1, DISTANCE_TO_EDGE, N_SPHERE_RADIUS.
- **Bevel:** 0 Radius, 1 Normal; propriedade `samples`. **Ambient Occlusion:** 0 Color, 1 Distance,
  2 Normal; saídas Color, AO; propriedades `samples`, `inside`, `only_local`.
- **Geometry** = `ShaderNodeNewGeometry` (saída `Pointiness` índice 7, `Normal` índice 1).
- **Vector Math** `DOT_PRODUCT`: saída `Value` (índice 1).
- **Bump:** 0 Strength, 1 Distance, 2 Filter Width, 3 Height, 4 Normal.
- **Hue/Saturation** (`ShaderNodeHueSaturation`): 0 Hue, 1 Saturation, 2 Value, 3 Factor, 4 Color.
- **Color Ramp** = `ShaderNodeValToRGB`; paradas em `node.color_ramp.elements` (`.position`,
  `.color`), `color_ramp.interpolation` em EASE, CARDINAL, LINEAR, B_SPLINE, CONSTANT.
- **EEVEE:** `scene.eevee.use_raytracing` nasce **False** [sonda 5.2]; o vidro R8b exige ligar.

**Prova de montagem [sonda 5.2]:** R1, R2a, R2b, R2d, R3, R5, R7 (completo), R8a, R10 e R11 foram
montados por script com os ajudantes abaixo (índices de socket, enums e propriedades exatamente
como escritos aqui) e renderizaram sem erro em Cycles e EEVEE (render de teste 160x90, 8 amostras,
cubos chanfrados). O teste só prova que **monta e compila**; o acerto visual de cada valor ainda
pede render de prova em close. (O script de teste ficou em pasta temporária e não faz parte do
repositório; os ajudantes abaixo e as árvores de nós bastam para remontá-lo.)

Ajudantes mínimos (o padrão de todas as receitas):

```python
import bpy

def mat_novo(nome):
    m = bpy.data.materials.new(nome)          # já vem com Principled + Output
    nt = m.node_tree
    return m, nt, nt.nodes["Principled BSDF"], nt.nodes["Material Output"]

def no(nt, tipo, **props):
    n = nt.nodes.new(tipo)
    for k, v in props.items():
        setattr(n, k, v)
    return n

def liga(nt, a, sa, b, sb):                    # sa/sb: índice ou nome
    nt.links.new(a.outputs[sa], b.inputs[sb])

def rampa(n, pontos, interp='LINEAR'):         # pontos: [(pos, (r,g,b,a)), ...]
    cr = n.color_ramp; cr.interpolation = interp
    el = cr.elements
    while len(el) > len(pontos): el.remove(el[-1])
    while len(el) < len(pontos): el.new(0.5)
    for e, (p, c) in zip(el, pontos):
        e.position = p; e.color = c

def mix_cor(nt, modo='MIX', fator=None):
    n = no(nt, "ShaderNodeMix", data_type='RGBA', blend_type=modo)
    if fator is not None: n.inputs[0].default_value = fator
    return n                                   # A=inputs[6], B=inputs[7], saída outputs[2]
```

Notação abaixo: `Nó(param=valor)`, `A.saída → B.entrada`. Cinzas escritos como um número
(0,5 = cor (0,5, 0,5, 0,5, 1)). Valores sem fonte entre parênteses são **[conhecimento geral]**
calibrados para objeto de ~20 cm com escala aplicada.

---

### R0. Mapeamento e anti-repetição (reutilizado por todas)

```
TC   = TexCoord
MAP  = Mapping(vector_type='POINT', Scale=(s,s,s))            s = "escala do material"
TC.Object → MAP.Vector
# anti-repetição (só para textura de imagem ou padrão que repete):
VOR  = Voronoi(feature='F1', Scale=5 a 20, Detail=0 a 2)
TC.Object (ou UV) → VOR.Vector ;  VOR.Color → MAP.Location     (ou → MAP.Rotation)
```
Fonte: Ryan King (Object), DECODED (Voronoi → Location), Extra 3D (→ Rotation).

### R1. Quebra de aspereza universal (node group "AsperezaViva")

O antídoto do "plástico de CG". Vai em **todo** material opaco.

```
Entradas do grupo: Piso (0,35), Faixa (0,12), Escala (30), Manchas (0,15), Semente W (0)
N1 = Noise(noise_dimensions='4D', Scale=Escala, Detail=15, Roughness=0.8, W=Semente)   ← Ryan King
N2 = Noise(noise_dimensions='4D', Scale=Escala/6, Detail=8, Roughness=0.6, W=Semente+7)  (macro)
R1 = ColorRamp(N1.Factor; pos 0.40 preto, 0.65 branco)          ← "preto puxado" (Ryan King)
R2 = ColorRamp(N2.Factor; pos 0.35 preto, 0.75 branco)
MUL = Math(MULTIPLY)( R1.Color, R2.Color )                       ← dois grunges em Multiply (TopChannel)
MR = MapRange(Value=MUL, From 0..1, To Min=Piso, To Max=Piso+Faixa, clamp=True)   ← comprimir faixa (TopChannel, Kaizen)
MANCHA (opcional) = R7-smudges (ver vidro) somado: Math(ADD)(MR, Smudge*Manchas) com use_clamp=True
Saída: Roughness
```
Ligação: `TC.Object → MAP → N1.Vector e N2.Vector`. Fator efetivo de variação ≈ Faixa (0,1 a
0,25, faixa de Kaizen). **Sinal de erro:** se aparecer "molhado", a Faixa está larga ou o Piso
baixo demais.

### R2. Máscaras inteligentes (node groups "MascaraBorda", "MascaraCurvatura", "MascaraCavidade") · só Cycles

**R2a. Borda por Dot Product** (Kaizen)
```
G   = Geometry
BN  = Noise(Scale=(40), Detail=15, Roughness=0.7)              ← "detail e roughness altos"
BMR = MapRange(BN.Factor, To Min=(0.002), To Max=(0.012))       ← raio do chanfro em metros
BV  = Bevel(samples=8, Radius ← BMR.Result)
DOT = VectorMath(DOT_PRODUCT)(BV.Normal, G.Normal)
EM  = MapRange(DOT.Value, From Min=(0.90), From Max=1.0, To Min=1, To Max=0, clamp=True)   ← To Min 1 / To Max 0 (Kaizen)
Saída: EM.Result (1 = borda)
```
**R2b. Borda por dois Bevels** (Fraser), melhor em peça arredondada
```
B0  = Bevel(samples=2, Radius=0)         ← "samples no mínimo" (Fraser); 2 montou e renderizou no teste
IMP = Noise(Scale=(25), Detail=15, Roughness=0.75)
IMR = MapRange(IMP.Factor, To Min=0.01*k, To Max=(0.03)*k)      ← mínimo 0,01 (Fraser); k = tamanho do objeto em m / 1 (conhecimento geral)
B1  = Bevel(samples=16, Radius ← IMR.Result)
DIF = Mix RGBA(blend_type='DIFFERENCE', Factor=1, A ← B0.Normal, B ← B1.Normal)
HSV = SeparateColor(mode='HSV', Color ← DIF.Result)
ER  = ColorRamp(HSV.Blue /*Value*/; CONSTANT; pos 0.0 preto, (0.08) branco)
Saída: ER.Color
```
**R2c. Curvatura** (Kaizen)
```
G = Geometry ; CR = ColorRamp(G.Pointiness; pos (0.48) preto, (0.56) branco)
GM = Gamma(CR.Color, Gamma=(1.5))
NZ = Noise(Scale=(15), Detail=8, Roughness=0.6)
CURV = Math(MULTIPLY)(GM.Color, NZ.Factor)
```
Pointiness depende da densidade da malha [conhecimento geral]: em malha leve com Subdivision ela
mal aparece; aplique subdivisão ou prefira R2a.

**R2d. Cavidade/AO** (Kaizen + DECODED)
```
NZ = Noise(Scale=(20), Detail=8)
AO = AmbientOcclusion(samples=16, inside=False, only_local=False, Distance=(0.03 × tamanho do objeto em m ×10 ≈ 2-5% do objeto), Color ← NZ.Color)
CAV = ColorRamp(AO.Color; FLIP: pos 0.0 branco, (0.6) preto)   ← invertido (Kaizen, DECODED)
Saída: CAV.Color (1 = fresta)
```

### R3. Plástico de produto (ABS fosco/acetinado)

O caso mais comum em comercial: tampa, carcaça, frasco opaco.

```
P = Principled: Base Color = cor da marca, Metallic 0, IOR 1.5 (padrão), Coat Weight 0
Roughness ← R1 (Piso 0.35 acetinado / 0.55 fosco, Faixa 0.10, Escala 30)            (conhecimento geral para pisos)
Normal ← BEV = Bevel(samples=8, Radius=(0.0015))   → fio de luz em toda aresta  (Blender Secrets, DECODED)
# micro relevo de molde (opcional):
MB = Noise(Scale=(300), Detail=4) → Bump(Strength=(0.03), Distance=(0.001), Height ← MB.Factor, Normal ← BEV.Normal) → P.Normal
# desbotado de sol nas bordas (Fraser), só se a história pedir uso:
EM (R2a ou R2b) → HS = HueSaturation(Saturation=(0.8), Value=(1.15), Color ← cor base)
MIXC = Mix RGBA(MIX, Factor ← EM × (0.5), A ← cor base, B ← HS) → P.Base Color
```
Geometria: modificador Bevel `limit_method='ANGLE'` ou `'WEIGHT'`, `segments` 3 a 4,
`harden_normals=True`; largura proporcional ao objeto (ver R14).

### R4. Plástico brilhante / laca (frasco, eletrônico premium)

```
P: Base Color = cor, Roughness ← R1 (Piso 0.25, Faixa 0.08)
   Coat Weight = (1.0), Coat Roughness ← R1-fino (Piso 0.02, Faixa 0.04)   ← verniz por cima (Ryan King expõe Coat)
   Coat Normal ← Bump bem fraco de Noise Scale (200) Strength (0.02)  (casca de laranja; conhecimento geral)
Normal ← Bevel(Radius 0.001)
```
Iluminação obrigatória: R13 do checklist (fonte com gradiente), senão o coat mostra o retângulo da
área.

### R5. Metal pintado com desgaste de borda (o "smart material" da caixa) · Cycles

Integral do Kaizen, com os valores do vídeo onde existem.

```
# Máscaras
EM   = R2a (borda)            CURV = R2c (curvatura)          CAV = R2d (cavidade)
# Cor
C_top  = cor da tinta (ex. amarelo-laranja)      C_bot = cinza azulado (segunda cor, opcional)
GR   = GradientTexture(LINEAR) com Mapping(Rotation Y=90°, Location X negativo até alinhar)
GRR  = ColorRamp(GR.Factor; CONSTANT)                         ← divisão de duas cores
SPLIT= Mix RGBA(MIX, Factor ← GRR.Color, A ← C_top, B ← C_bot)
# (para uma cor só, SPLIT = C_top)
SUJ  = Mix RGBA(MIX, Factor ← CAV, A ← SPLIT, B ← SPLIT escurecida/amarronzada)      ← sujeira
REAL = Mix RGBA(MIX, Factor ← CURV, A ← SUJ, B ← SPLIT clareada)                     ← realce de curvatura
FIM  = Mix RGBA(MIX, Factor ← EM, A ← REAL, B ← cinza médio-escuro (0.25))           ← metal exposto
FIM → P.Base Color
# Metálico
EM → P.Metallic                                              ← direto (Kaizen)
# Aspereza
ER  = ColorRamp(EM; pos 0.0 preto, (0.3) branco)             ← "branco puxado à esquerda"
AR  = ColorRamp(CAV; pos 0 → 0.5, pos 1 → 0.8)              ← "preto vira cinza médio, branco vira cinza claro"
RM  = Mix RGBA(MIX, Factor ← ER, A ← AR, B ← (0.12))        ← borda reflexiva (preto/cinza escuro)
NZ  = Noise(Scale (30), Detail 15) → ColorRamp
RF  = Mix RGBA(MIX, Factor=0.25, A ← RM, B ← NZ rampa)      ← 0,25 (Kaizen)
RF → P.Roughness
# Relevo
AR → Bump(Strength=0.25, Height) → P.Normal                 ← 0,25 (Kaizen)
```
Variação "plástico gasto ao sol" do Fraser: troque a camada FIM por R3-desbotado e não ligue
Metallic.

### R6. Cromo e foil (acabamentos de impressão e de peça)

```
CROMO = Principled(Base Color (0.9), Metallic 1, Roughness 0.05)        ← Jared: "não perfeitamente reflexivo"
FOIL  = Principled(Base Color = cor do foil, Metallic 1, Roughness 0.08) ← Jared
```
Sempre com R1 de faixa mínima por cima (Piso 0,05, Faixa 0,03) [conhecimento geral] e nunca com
Roughness 0 cravado. Metal liso **só existe pelo que reflete**: sem HDRI ou cartões, vira preto.

### R7. Vidro procedural (Cycles) · Ryan King, com todos os valores

Geometria antes do shader: **Solidify** com espessura real (copo ~2-3 mm, icosfera do vídeo "bem
fino"), **Bevel 4 segmentos**, **Subdivision 1**, Shade Smooth, escala aplicada.

```
TC.Object → MAP (Scale = "Material Scale" 1.0)          [grupo de mapeamento comum]

# — Smudges / digitais (Roughness) —
SN   = Noise(Scale 15, Detail 15, Roughness 1.0, Vector ← MAP)
SLL  = Mix RGBA(LINEAR_LIGHT, Factor = "Smudges Blending" 0.1, A ← MAP.Vector, B ← SN.Factor)
SV   = Voronoi(feature='SMOOTH_F1', Scale 18, Detail 15, Vector ← SLL.Result)
SR   = ColorRamp(SV.Distance; invertida: pos (0.0) branco, (0.25) preto)      ← paradas trocadas
# — Ruído de aspereza —
RN   = Noise(Scale 30, Detail 15, Roughness 0.8, Vector ← MAP)
RR   = ColorRamp(RN.Factor; preto puxado para (0.45), branco em 1.0)
RS   = Mix RGBA(MIX, Factor = "Noise Roughness" 0, A = preto, B ← RR.Color)
DIV  = Math(DIVIDE)("Glass Roughness" 0, 40)                                  ← suaviza o slider
BC   = BrightContrast(Color ← RS.Result, Brightness ← DIV, Contrast 0)
ADD  = Mix RGBA(ADD, Factor = "Smudges Amount" 0, A ← BC.Color, B ← SR.Color)
ADD.Result → P.Roughness
# — Rachaduras (Normal) —
MAP2 = Mapping(Scale = "Crack Scale" 1.0, Vector ← MAP)
CN   = Noise(Scale 20, Detail 15, Roughness 0.6, Vector ← MAP2)
CLL  = Mix RGBA(LINEAR_LIGHT, Factor 0.01, A ← MAP2.Vector, B ← CN.Color)
V1   = Voronoi(feature='DISTANCE_TO_EDGE', Scale 15, Detail 15, Roughness 0.52, Lacunarity 3, Vector ← CLL)
V2   = Voronoi(idem, Scale 30)
DK   = Mix RGBA(DARKEN, Factor 1, A ← V1.Distance, B ← V2.Distance)
CRR  = ColorRamp(DK.Result; preto 0.0, branco (0.01))                         ← linhas finíssimas
CB   = Bump(Strength = "Cracks Bump Strength" 0, Height ← CRR.Color)
# — Empenamento —
WN   = Noise(Scale = "Warping Scale" 10, Vector ← MAP)
WB   = Bump(Strength = "Warping Bump Strength" 0 (uso 0.1–0.2), Height ← WN.Factor, Normal ← CB.Normal)
WB.Normal → P.Normal
# — Principled —
P: Base Color 1.0 (ou leve verde-azulado, R-12), Transmission Weight 1, IOR 1.5 ("Glass IOR"),
   Alpha = "Transparency" 1, Coat Weight 0, Coat Roughness 0 (expostos)
```
Faixas de uso (Ryan King): Smudges Amount 0,02 a 0,4; Smudges Blending 0,1 a 0,2; Noise Roughness
0,3 a 0,4; Warping 0,1 a 0,2 com escala ~0,2; Glass Roughness alto (~20) = vidro jateado.
Luz do vídeo: área Power 80 + HDRI Strength 2 + fundo escuro; câmera 80 mm. Para comercial,
somar os cartões pretos laterais do Wenbo (R-11).

### R8. Variantes de vidro

**R8a. Fundo limpo (Wenbo Zhao), Cycles**
```
LP  = LightPath ; GT = Math(GREATER_THAN)(LP."Ray Depth", Threshold (2 a 4))   ← limiar ajustável
TR  = BsdfTransparent
PG  = Principled(Roughness 0, Transmission Weight 1)
MS  = MixShader(Factor ← GT, Shader1 ← PG, Shader2 ← TR)     → Surface
(+ opcional) Noise(Object) → ColorRamp → Bump fraco → PG.Normal
```
É trapaça física: depois de N quiques o raio vira transparente puro. Use só se o interior do copo
ficar escuro demais. [conhecimento geral: alternativa honesta é subir `scene.cycles.transmission_bounces`
e `max_bounces`, que existem no 5.2 [sonda 5.2].]

**R8b. Vidro no EEVEE (Berk Kaplan)**
```
P: Base Color branco (carro: verde-azulado dessaturado), Roughness 0, Transmission Weight 1
material.use_raytrace_refraction = True        [sonda 5.2]
material.thickness_mode = 'SLAB'                [sonda 5.2]
scene.eevee.use_raytracing = True               (verdade 5.2)
Value(espessura em metros; vídeo "05") → Material Output.Thickness (inputs[3])   [sonda 5.2]
+ Solidify na malha
```
**R8c. Duas saídas:** uma `Material Output(target='CYCLES')` com R7 e outra
`Material Output(target='EEVEE')` com R8b, no mesmo material (Berk Kaplan) [enum sonda 5.2].

### R9. Rótulo em camadas (Jared Brashier)

As máscaras P&B são **arte de design**, não pintura de textura: geradas por script (PIL a partir do
SVG/logo da marca, ou render ortográfico de texto) [conhecimento geral]. Branco = camada de cima.

```
# Base (papel/BOPP)
IMG_COR  = ImageTexture(arte colorida, sRGB, UV do rótulo)
IMG_RUG  = ImageTexture(roughness, Non-Color) → ColorRamp (ajuste fino) → BASE.Roughness
IMG_NRM  = ImageTexture(relevo tátil, Non-Color) → NormalMap(space='TANGENT', Strength 0.125) → BASE.Normal
BASE     = Principled(Base Color ← IMG_COR)
# Cromo
CROMO    = R6 cromo  (Metallic 1, Roughness 0.05)
MK_CROMO = ImageTexture(máscara cromo, Non-Color)
MS1      = MixShader(Factor ← MK_CROMO.Color, Shader1 ← BASE, Shader2 ← CROMO)
# Foil
FOIL     = R6 foil (Metallic 1, Roughness 0.08, cor)
MK_FOIL  = ImageTexture(máscara foil, Non-Color)
MS2      = MixShader(Factor ← MK_FOIL.Color, Shader1 ← MS1, Shader2 ← FOIL) → Surface
```
Sem imagem nenhuma (faixa/listra de rótulo): a máscara pode ser `Wave(BANDS)` ou `Gradient` →
`ColorRamp(CONSTANT)` [conhecimento geral]. Verniz localizado = uma terceira camada com Roughness
baixa pela mesma lógica.

### R10. Sujeira de fresta (node group "dirt") · Cycles

DECODED + Fraser. Entra entre a cor base e o Principled de qualquer material.
```
NZ  = Noise(Scale (8), Detail 8) → MapRange(To Min 0.02×k, To Max 0.06×k)      ← irregular (Fraser)
AO  = AmbientOcclusion(inside=False, only_local=False, samples 16, Distance ← MapRange)
CR  = ColorRamp(AO.Color; invertido: 0 branco, (0.5) preto)
OV  = Mix RGBA(OVERLAY, Factor ← CR.Color × força (0.6), A ← cor base, B ← marrom-escuro (0.08,0.06,0.04))
OV → P.Base Color ;   CR também → +0.1 na Roughness (sujeira é mais áspera, Kaizen)
```
Em animação: **assar** (Bake) o AO numa imagem antes [DECODED]. Para produto parado com câmera
andando, o AO dinâmico é seguro.

### R11. Poeira (node group "dust") · DECODED

```
TC.Normal → SC = SeparateColor(RGB)      → SC.Blue = topo
DN  = Noise(Scale (4), Detail 15, Roughness 0.8)
DM  = Mix RGBA(MIX, Factor ← DN.Factor, A ← SC.Blue, B ← cinza (0.35))     ← "um pouco de pó nas laterais"
DMR = MapRange(DM.Result, From 0..1, To Min 0, To Max força (0.6))
P.Sheen Weight ← DMR ;  P.Sheen Roughness = (0.8) ;  P.Sheen Tint = cinza amarronzado (0.55,0.5,0.45)
```
TexCoord `Normal` está em espaço do objeto [conhecimento geral]: se o objeto girar na animação, o
"topo" gira junto. Para pó que respeita o mundo, use Geometry `Normal` (espaço do mundo)
[conhecimento geral].

### R12. Alvenaria/reboco com height blend (PBR CC0 baixado, não pintado)

Rob Tuytel + Extra 3D. Texturas de Poly Haven/ambientCG baixadas por script (CC0).
```
TIJ = grupo PBR tijolo (Color sRGB; Roughness/Normal/Displacement Non-Color), Object + Box blend 0.2
REB = grupo PBR reboco
MASK= Noise 4D(Scale (2), Detail 15) → ColorRamp   (ou Gradient guiado por um Empty)
H   = Displacement(altura) do tijolo, Non-Color
# HeightBlend [conhecimento geral, os vídeos não dão a fórmula exata]:
#   f = clamp( (MASK - H) / falloff + 0.5 , 0, 1 )   → reboco ocupa primeiro onde H é baixo (juntas)
SUB = Math(SUBTRACT)(MASK, H) ; DIVF = Math(DIVIDE)(SUB, falloff (0.1)) ; ADDH = Math(ADD, use_clamp=True)(DIVF, 0.5)
MS  = MixShader(Factor ← ADDH, Shader1 ← TIJ, Shader2 ← REB)
DISP= Mix FLOAT(Factor ← ADDH, A ← altura tijolo, B ← altura reboco) → Displacement(Midlevel 0, Scale 0.03) → Output.Displacement
material.displacement_method = 'BOTH' ; Subsurf(use_adaptive_subdivision=True, subdivision_type='SIMPLE')
```
Variação de cor amarrada ao padrão: Noise → Ramp → Mix **Screen** e depois Mix **Burn** (Color
Burn) com a cor do tijolo (Extra 3D).

### R13. Tecido (sem fonte nos vídeos: tudo [conhecimento geral])

Nenhum dos 18 vídeos ensina tecido; só o Sheen do DECODED. Receita provisória, a validar com
render de prova:
```
P: Base Color = cor, Roughness 0.8, Sheen Weight 1.0, Sheen Roughness 0.4, Sheen Tint branco
Trama: W1 = Wave(BANDS, bands_direction='X', Scale 400, wave_profile='SIN')
       W2 = Wave(BANDS, bands_direction='Y', Scale 400)
       T  = Math(MAXIMUM)(W1.Factor, W2.Factor) → Bump(Strength 0.2, Distance 0.0005) → P.Normal
Variação: R1 com Piso 0.75, Faixa 0.15
```
Fica na lista de lacunas até ter vídeo ou teste que confirme.

### R14. Chanfro: qual ferramenta, qual tamanho

| Situação | Ferramenta | Ajuste | Fonte |
|---|---|---|---|
| Chanfro que muda a silhueta | Ctrl+B / `bpy.ops.mesh.bevel` | segmentos 3 a 5 | Blender Secrets |
| Chanfro pequeno em toda quina | Modificador Bevel `limit_method='ANGLE'` | `segments` 3, `harden_normals=True` | Blender Secrets, CG Boost |
| Chanfros de tamanhos diferentes | `limit_method='WEIGHT'` + bevel weight por aresta | weight 1 nas quinas escolhidas | Blender Secrets, CG Boost |
| Malha com Subdivision | Crease nas arestas duras + Bevel por weight + **Pin to Last** | `use_pin_to_last=True` | CG Boost |
| Fio de luz sem tocar na malha (Cycles) | nó Bevel na Normal | raio pequeno, samples 8 a 16 | Blender Secrets, DECODED |
| Peças encostadas | Ctrl+J, depois nó Bevel | | DECODED |
| Chanfro de 2 segmentos parecendo liso | Weighted Normal ou Data Transfer de Custom Normals | Face Corner Data, Nearest Face Interpolated | Blender Secrets, CG Boost |

Tamanho: os vídeos não dão número. [conhecimento geral] produto de mão: 0,5 a 2 mm; objeto de
mesa grande: 2 a 5 mm; regra prática ~0,5% a 1% da maior dimensão. Fio de luz visível exige
superfície com Roughness baixa e uma luz que "raspe" a quina (Blender Secrets: "mais especular,
menos aspereza").

---

## 4. Checklist "por que parece falso"

| Sintoma | Causa provável | Correção | Fonte |
|---|---|---|---|
| Reflexo igual e perfeito na peça inteira | Roughness num número só | R1 (duas escalas de ruído, faixa 0,1 a 0,25) | Kaizen, Ryan King |
| Manchas parecem água/molhado | Grunge cru 0 a 1 na Roughness | Math Add de piso ou Map Range; Clamp | TopChannel |
| Silhueta recortada, quina sem brilho | Aresta viva | Bevel (modificador) + nó Bevel; Harden Normals | Blender Secrets, CG Boost |
| Quina dura onde duas peças se encontram | Peças em objetos separados | Ctrl+J antes do nó Bevel | DECODED |
| Chanfro mais largo num eixo | Escala não aplicada | Aplicar escala | Blender Secrets |
| Textura esticada nas laterais | Projeção Flat/UV ruim | Object + Box (blend 0,2) | Extra 3D |
| Mesmo desenho repetindo | Ladrilho | Voronoi Color → Mapping Location/Rotation; dois grunges de escalas diferentes | DECODED, TopChannel |
| Sujeira "pintada por cima" | Máscara só na cor | Mesma máscara na Roughness (+áspera) e no Bump (0,25) | Kaizen |
| Objeto flutua, sem ligação com chão/vizinho | Nenhuma transição entre materiais | Grupo "dirt" (AO, Only Local off) | DECODED |
| Sujeira acompanha objeto que passa | AO dinâmico em animação | Assar AO | DECODED |
| Textura troca à vista com câmera rápida | Mistura por View Distance | Câmera mais lenta ou desligar a troca | DECODED |
| Vidro parece bolha ou lupa | Sem espessura / Thickness Sphere no EEVEE | Solidify; EEVEE: Slab + Thickness | Ryan King, Berk Kaplan |
| Vidro sem borda definida | Entorno claro de todos os lados | Cartões pretos laterais | Wenbo Zhao |
| Interior do copo escuro demais | Poucos quiques de transmissão | Subir transmission/max bounces; ou truque Light Path | Wenbo Zhao, [conhecimento geral] |
| Vidro "de CG", incolor | Base Color branco puro | Leve verde-azulado dessaturado | Wenbo Zhao, Berk Kaplan |
| Vidro no EEVEE opaco ou sem interior | Raytraced Transmission/Ray Tracing desligados | Ligar os dois | Berk Kaplan |
| Retângulo chapado refletido no plástico brilhante | Luz de área uniforme | Gradiente ou imagem na luz; planos emissivos B-Spline | Extra 3D |
| Chão com reflexo estourado pelas luzes do produto | Luz afetando tudo | Light linking | Extra 3D |
| Relevo de rótulo "letra de balão" | Normal Strength alto | 0,125 | Jared Brashier |
| Rótulo chapado, um brilho só | Uma camada só | Pilha base → cromo → foil com máscaras | Jared Brashier |
| Detalhe de bump parece gelatina/miniatura | Escala do ruído grande demais | Diminuir a escala do detalhe para o tamanho real | Blender Guru |
| Produto parece usado sem querer | Imperfeição forte demais | Imperfeição só como pista (smudges ≤0,4, rampa apertada) | Wenbo Zhao, Ryan King |
| Material "2D", sem profundidade | Sem normal/bump/displacement | Bump fraco; displacement com geometria em close | Extra 3D, Branden Arc |
| Roughness lavada, normal estranha | Mapa técnico em sRGB | Non-Color | Rob Tuytel |
| Normal invertida (relevo para dentro) | Mapa DirectX | Usar GL ou `convention='DIRECTX'` | Extra 3D, [sonda 5.2] |
| Emission não acende | Strength nasce 0 no 5.2 | Definir Emission Strength | [sonda 5.2] |
| Cor lavada ou estourada | Troca para Standard | Manter AgX | `blender-5.2-verdade.md` |
| Imagem limpa demais, "render" | Sem imperfeição de câmera | Grão (Linear Light/Overlay), vinheta, distorção ~0,02 | Kaizen, Extra 3D |
| Bevel/pointiness/AO sem efeito | Render em EEVEE | Cycles, ou chanfro na geometria e máscaras assadas | Kaizen, Blender Secrets |

---

## 5. Contribuição para o Cérebro de Diretor

Regras de decisão que o "diretor" do Estúdio deve aplicar antes de aprovar material:

1. **Qual é a história do objeto?** Novo de caixa (comercial): limpo, mas nunca estéril; imperfeição
   só na roughness e só aparece no realce. Usado/herói de ambiente: desgaste de borda, sujeira de
   fresta, pó no topo. O material obedece ao roteiro (Blender Guru: "vida esquecida"; Fraser:
   plástico de sol vs tinta lascada).
2. **Distância da câmera decide o nível de detalhe.** Close = micro detalhe, bump fino, textura alta
   (8K na regra do Extra 3D); fundo = só variação de cor e roughness.
3. **Material e luz são aprovados juntos.** Superfície brilhante e vidro não têm "material bom" sem
   a luz certa: exigir fonte com gradiente, cartões pretos para borda e contra-luz para realce
   (Wenbo, Extra 3D). Diagnóstico de "parece falso" começa pela luz, depois o material.
4. **A borda é onde o olho acredita.** Todo plano de produto precisa de pelo menos uma luz que
   "raspe" uma quina chanfrada.
5. **Escala é inegociável.** Objeto em tamanho real e escala aplicada antes de qualquer textura;
   detalhe com o tamanho do mundo real (lição da gelatina).
6. **Sutil vence.** Cada camada de imperfeição começa no mínimo e sobe até "quase não ver";
   se aparece na miniatura, está forte demais (Wenbo, Ryan King, Kaizen).
7. **Motor manda na receita.** Cycles = realismo de material completo (Bevel, Pointiness, AO).
   EEVEE = chanfro geométrico + máscaras assadas + vidro com Slab. O diretor escolhe o motor sabendo
   disso, não depois.
8. **Animação muda as regras.** Máscara dinâmica (AO, distância) pode "andar" na tela; o diretor
   pergunta "o que se move neste plano?" antes de liberar.
9. **Prova antes de "pronto".** Render de prova em close, com a luz final, olhando realce, borda e
   transição com o chão. [conhecimento geral: para a IA, comparar recortes do render (realce de uma
   quina, área de roughness) contra limites numéricos, porque ela não "vê" como o olho.]

---

## 6. Lacunas

- **Tecido:** nenhum vídeo. R13 é hipótese. Faltam trama, fiapo (fuzz), costura, dobra.
- **Metal escovado/anisotrópico:** ninguém usa Anisotropic/Anisotropic Rotation/Tangent.
- **Plástico translúcido, cera, sabão, pele, frutas:** nenhum vídeo de Subsurface Weight/Radius/Scale.
- **Líquido em copo, gelo, condensação, gotas:** nada (IOR de água, interface líquido-vidro).
- **Pintura automotiva com flake:** só a menção do Coat do Ryan King.
- **Recursos novos do Principled v2:** Thin Wall, Thin Film (iridescência), Diffuse Roughness, Coat
  Tint, Specular Tint em metal: nenhum vídeo; precisa de teste próprio.
- **Números de chanfro:** nenhum vídeo dá largura por tamanho de objeto; a faixa em R14 é minha.
- **Rótulo envolvendo cilindro:** UV/projeção do rótulo em garrafa não é ensinado.
- **EEVEE sem Bevel/Pointiness:** nenhum vídeo mostra como assar máscaras por script (Bake de AO e
  curvatura) para levar o realismo ao EEVEE.
- **Valores medidos de roughness por material real:** os vídeos ajustam no olho; falta tabela
  (plástico injetado, alumínio anodizado, papel couché, vidro jateado).
- **Cáustica:** só citada (Wenbo); o 5.2 tem `is_caustics_caster/receiver` no objeto e
  `caustics_reflective/refractive` na cena [sonda 5.2], mas sem método nos vídeos.
- **Verificação automática:** nenhum vídeo ensina medir "cara de CG" sem olho humano; o método do
  Estúdio precisa definir o teste de prova do material.
- **Ambiguidades de legenda a testar:** AO Distance "04" (DECODED), Thickness "05" (Berk Kaplan),
  smudges "02" (Ryan King).
