# Destilado: render, cor, composição e som

Base de conhecimento do "Estúdio Claude + Blender 3D". Fonte: 14 transcrições `render_pos__*` e 5
`som__*` (legenda automática, interpretada). Escrito do ponto de vista de um supervisor de
finalização de comercial 3D.

**Como ler as marcações**
- Sem marcação: veio da fonte citada.
- **[conhecimento geral]**: não está nas transcrições. É prática de mercado ou conhecimento meu.
- **[conferir por sonda]**: nome de propriedade Python que não foi confirmado em
  `blender-5.2-verdade.md`. Rodar uma sonda antes de usar em produção.
- **[proposta]**: ideia minha para o pipeline do Claude, que ainda não foi testada.

A máquina-alvo é uma RTX 3050 Laptop com **4 GB de VRAM** [conhecimento geral sobre o modelo].
Isso pesa em textura, simplify e escolha de motor.

---

## 1. Por vídeo

### 1.1 How to use Eevee - Full Blender Course
Blender Guru · https://youtu.be/-gW6vk_OuNQ · **Nota 5** · EEVEE novo (4.2+, cita o "EEVEE Next" e
o Oscar de *Flow*). É a fonte mais profunda sobre o EEVEE de hoje.

- **Vazamento de luz** em parede fina: dar espessura (Solidify) e subir **Shadow > Steps**
  (ele chama de "precisão") de 6 para 12 a 16. Luz mais macia (raio/ângulo maior) vaza mais, e
  passa a vazar mesmo com 16. Fica mais caro, mas só frações de segundo.
- **Ruído no EEVEE** só aparece na penumbra das sombras macias. Render padrão: **64 amostras**.
  Para limpar só a sombra, em vez de dobrar tudo para 128, suba **Shadow > Rays** (rays 2 equivale
  a 64×2 só na sombra).
- **Ray tracing vem DESLIGADO** e precisa ser ligado para haver reflexo e rebatimento de luz. Ele
  diz que a primeira impressão do EEVEE é ruim justamente por isso.
- **Screen space:** o EEVEE só enxerga o que está no quadro. Disso vêm o "fantasma preto" atrás de
  objetos, o reflexo que some quando a câmera se mexe e a sala que "apaga" num pan. A correção são
  os **light probes**: **Plane** para piso/espelho/vidro plano, **Sphere** para objeto cromado ou
  de vidro e **Volume** para luz rebatida.
- **Ray tracing × Fast GI:** ray tracing serve para reflexo nítido e se sai mal em superfície
  áspera. Usar ray tracing para tudo deixa a cena escura e "lamacenta". O **Fast GI é obrigatório
  para realismo**. O limiar de rugosidade padrão (**0,5**) decide quem faz o quê: acima de 0,5 vai
  para o Fast GI. Ele mantém 0,5.
- **Os quatro valores que importam:** resolução do ray tracing, resolução do Fast GI, **steps** e
  **distance** do Fast GI. Steps funciona como "energia": **8 é pouco, 16 é o mínimo dele**.
  Distance fica em **1 a 2** quando há volume probe (o probe dá a base e o Fast GI só complementa).
- **Final de animação:** resolução baixa demais (1/16) **pisca** na animação. Para o filme final ele
  usou **1:1 no ray tracing e 1:2 no Fast GI**. Para testar, 1/16 em ambos economiza pouco tempo
  (2,46 s).
- **Desligar `Temporal Accumulation`** no denoise do ray tracing: com ele ligado as texturas ficam
  borradas.
- **World/HDRI sem volume probe ilumina tudo por igual**, inclusive caixa fechada. O volume probe
  também *bloqueia* luz. Os pontos da última fileira precisam ficar **logo dentro** da parede (com
  espessura). Search distance baixo; **surface offset** mais alto tira o bandeamento em grade.
  **Surfel resolution: padrão 20, use ~100** (acima disso o ganho é pequeno).
- **HDRI no EEVEE:** o `Sun Threshold` do World cria um "sol" no ponto mais brilhante, e esse ponto
  muda junto com a força do HDRI. Ele usa **threshold 0** (HDRI só como céu) mais um **Sun lamp**
  posicionado à mão.
- **Vidro:** vidro com refração no EEVEE não deixa ver o que está dentro (líquido). Use **vidro
  falso**: Transparent + Glossy (rugosidade 0) num Mix comandado por **Layer Weight > Facing**.
  Vale para copo e janela. `Render Method: Blended` fica mais limpo que `Dithered`, mas só funciona
  com Sphere probe.
- **Volumétrico** é onde o EEVEE brilha: cubo com Volume Scatter, densidade **0,05**, quase de
  graça (~0,5 s/quadro). **Esconder neblina e vidro antes de assar o volume probe**, senão a cena
  escurece. Ele usa uma coleção "hide before baking".
- **Tempo de render (medido):** apagar mapas de textura inúteis (metalness preto, alpha, roughness
  vazio) levou o quadro de **11 s para 4 s**. Tirar probes de plano/janela que não fazem diferença
  levou de 4,27 s para menos de 3 s. Neblina custa ~0,5 s. O EEVEE sofre mais com textura que o
  Cycles.
- Resolução do Sphere probe (cena): o padrão vai até 4K, mas **1K basta** para quase tudo.
  Speckle em folha com alpha: trocar o render method do material.

### 1.2 Make Eevee Next Look Like Cycles For All Renders
Pirani Arts · https://youtu.be/EJFNHac6fuU · **Nota 3** · Blender 4.2 LTS.

- No 4.2 o EEVEE novo **perdeu as caixas de Bloom e de Ambient Occlusion** e ganhou ray tracing.
- Amostras: **viewport 32, render 64**.
- Vazamento de sombra de area light e de HDRI: ligar **Jitter** nas sombras do viewport e na
  **sombra de cada luz** (Light > Shadow > Jitter), baixar o overblur, subir filter e resolution.
  Subir **Shadow > Rays**.
- HDRI: no World > Settings > **Sun**, ligar a sombra do sol (angle e threshold no padrão serviram)
  e o jitter.
- Ray tracing ligado (método Screen; Light Probe é a alternativa). **Resolution 1:1**, subir
  **Max Roughness**, subir **Precision**, mas **não colocar 1** (ele acha alto demais).
  **Thickness 2**.
- Fast GI: resolution cheia e mais **Rays**.
- Cabelo e pelo: ligar **High Quality Normals** e usar curvas em **Strip**.
- Sugere AOVs e passes (AO para reforçar sombra) e o compositor em tempo real no viewport.
- Cena grande com volume e várias luzes: o EEVEE chegou perto do Cycles. O flicker de sombra sumiu
  com jitter em **todas** as luzes mais o ajuste de ray tracing.

### 1.3 Best Cycles Render Settings Explained in 3 Minutes
Afternoon CG · https://youtu.be/EKb5G_Efunw · **Nota 4** · Blender 4.5. A cena saiu de 1,5 h para
1 min 25 s.

- GPU compute. **Noise threshold 0,1** (com denoise); 0,01 se a cena for muito ruidosa ou se não
  houver denoise.
- **Max samples: começa em 100** e sobe só se precisar.
- Denoise: **OptiX para vídeo, OpenImageDenoise para still**.
- Light paths: **Volume bounces = 0 sempre**, mesmo com volume. **Transparent: 3 deixa a planta com
  sombra preta, 20 resolve, 10 bastou** na cena dele. **Glossy 6, Diffuse 5.** "Translucent 8"
  (no Cycles o campo se chama **Transmission**; a legenda provavelmente errou).
- Caustics: testar, e **desligar** se o efeito for mínimo. Fast GI: testar, e **ligar** se não
  fizer diferença visível.
- Vídeo: **motion blur ligado** e **Persistent Data** (Performance) ligado. Fundo transparente:
  Film > Transparent.
- Usar Render Region para prévia rápida.
- Saída: não usar JPEG. **PNG com compressão no máximo**, porque é sem perda e só reduz o arquivo
  (conflita com o 1.13).

### 1.4 Blender 5.0's New Color System Changes Everything!
SouthernShotty · https://youtu.be/LLDm9k-xUQ4 · **Nota 4** · Blender 5.0.

- O 5.0 trouxe o **ACES** e um novo **Working Space** do arquivo: Linear Rec.709 (padrão),
  Rec.2020 e ACES. Trocar converte a cena inteira, então **decida no começo**. A recomendação é
  **ficar em Rec.709** se você não for avançado.
- Comparação das views: **Standard** perde gradação nos brilhos (verde→azul vira uma faixa de
  ciano). **Filmic** é mais lavado e ainda perde cor. **AgX** preserva a transição, mas
  **dessatura nos brancos**. **ACES** devolve saturação e fica mais "punchy", porém mais escuro.
- "Lavado" é **footage log**: muita informação para gradear depois. Não é defeito.
- Correção básica sem sair do Color Management: **Exposure +0,75** (no ACES, que é mais escuro).
  Depois **Curves**: puxar o ponto branco para a esquerda (branco volta a ser branco) e um ponto
  levemente para baixo nos médios-escuros (contraste).
- Para fazer uma cor saltar, **adicione um pouco da cor oposta**. Exemplo: água verde demais leva um
  ponto de azul nos médios do canal B.
- Os nós de cor do compositor são técnicos. As alternativas citadas são os add-ons **Render Raw**
  (Orange Turbine) e **Final LUT** (o Blender não lê LUT nativamente), ou exportar para o
  **DaVinci Resolve** em **EXR** (não PNG).

### 1.5 Mastering Jewelry Renders: Simple Compositing in Blender
Andy M Visuals · https://youtu.be/RH1x-VVuq3Q · **Nota 3** · versão não dita (3.x/4.x).

- Dois **View Layers**: (1) cenário, pedestal e luz de ambiente, com o produto em **Holdout**;
  (2) só o produto, com o próprio set de luz (coleção "ring lighting"), sem cenário e sem as luzes
  do cenário.
- O Holdout vai **na coleção inteira** (botão direito > View Layer > Set Holdout), não objeto por
  objeto.
- Luz de joia: área pequena perto para brilho na gema, **planos com gradiente** como rebatedores
  laterais e de fundo, point light para brilho suave e spot para definir o metal. Spots com
  **textura na frente (gobo)** para variar a luz no fundo.
- Composição: dois `Render Layers` (um por layer) entram num **Alpha Over** (produto por cima), e a
  saída vai para Composite e Viewer. O Factor dosa a mistura. Funciona também com sequência de
  imagens (PNG/EXR).

### 1.6 AGX color profile, a better color management in Blender
Wenbo Zhao · https://youtu.be/RtzvVP3uPXM · **Nota 2** · antes do 4.0 (AgX instalado à mão).

- Faixa dinâmica em stops: **olho ~24**, full frame **12 a 14**, médio formato **14 a 15**. Regra
  dele: mais faixa dinâmica significa menos contraste embutido e tonalidade mais suave.
- Standard tem a menor faixa. Filmic é melhor. AgX é maior ainda e dá mais espaço para pós.
- No Filmic, o look padrão dele era **Very High Contrast**. No AgX ele recomenda o look **Punchy**.
- O AgX segura detalhe no brilho (não estoura) e na sombra. Uma **curva de contraste** depois deixa a
  imagem igual ou melhor que o Filmic, com transição mais suave.

### 1.7 AgX in Blender 4.0. It's coming, are you ready?
Christopher 3D · https://youtu.be/YsTQEzcmD5w · **Nota 4** · Blender 4.0.

- **Gamut** (sRGB, Display P3) e **view transform** (como luz acima de 1,0 cabe na tela) trabalham
  juntos. Standard **só corta**.
- **Filmic ~16 stops; AgX 25 stops.** O Filmic não funciona com gamut amplo.
- **Problema das seis cores:** no Standard e no Filmic, cores saturadas e muito brilhantes colapsam
  em seis tons (vermelho, amarelo, verde, ciano, azul, magenta). O AgX mantém as faixas distintas
  e o brilho consistente entre as cores.
- Num fundo colorido de product viz com luz forte de baixo, o AgX deu brilho uniforme às faixas. O
  preço é sair **um pouco menos saturado**. A correção é um **look** (High Contrast), que é ajuste
  **depois** da transformação e não mexe no ray tracing.
- **ACES** (1.x) fica saturado e bonito, mas **desvia matiz**: luz azul puxa para roxo, verde
  puxa para amarelo, e embalagem também puxou para roxo. Também sofre com as seis cores. Foi um dos
  motivos de os devs escolherem o AgX.

### 1.8 Create Stunning Renders for Your Portfolio Like a Pro
On Mars 3D · https://youtu.be/a_IE40R4xsw · **Nota 3** · Blender 4.0, Cycles.

- **Câmera primeiro**, porque ela dita a luz. **Lente mínima 50 mm, ideal 70 a 120 mm.** Altura da
  câmera **no olho ou abaixo**: de cima o produto parece brinquedo.
- Fundo infinito: plano extrudado com bevel de **16+ segmentos**, shade smooth.
- Viewport Cycles: denoise ligado e **noise threshold 0,2** para iterar rápido.
- **Três pontos** com area lights. Key **ao lado da câmera, nunca atrás** (atrás fica chapado).
  Fill para abrir sombra, rim para separar do fundo, softbox grande por cima para carro.
- **Esferas de look-dev:** cromada, cinza médio e preta com clearcoat, para conferir exposição e
  balanço.
- Contraste vem de cor de fundo/primeiro plano e de temperatura **quente × fria**, com sutileza.
  Metal precisa de algo para refletir. O HDRI pode entrar **só no reflexo**, desligando a ray
  visibility de diffuse no World.
- **Passe de AO próprio:** material override com nó Ambient Occlusion → Color Ramp → **Emission**
  (com Light Path + Mix para ficar sem sombra). O "occlusion intensity" de 12 a 15 deixa branco
  onde não há oclusão. O wireframe sai por **Freestyle** em material sem sombra.
- View layers **Beauty / Wire / AO / Clay**, com Film Transparent. Composição: AO e wire em
  **Multiply** por cima do beauty. Serve também para turntable.

### 1.9 How to Render REALISM in Seconds with EEVEE (Blender 5 Course)
Gleb Alexandrov · https://youtu.be/b5uoGkXB5Hc · **Nota 1** · Blender 5 com Vulkan. É **anúncio de
curso**, quase sem técnica.

- No Blender 5 com o backend **Vulkan**, o EEVEE chega perto do Cycles em boa parte do tempo.
- O EEVEE pode **superar** o path tracing em luz rebatida de interior e em volume rápido.
- Terreno do Cycles: natureza com milhões de polígonos, terreno enorme e física de luz complexa.
- Não precisa mais de add-on de GI falso (SSGI).

### 1.10 How to "Fix" Blender's AgX and Render Exact Colors
CG Cookie (Jonathan Lampel) · https://youtu.be/bIYysN4KheI · **Nota 4** · recente (cita o 5.2).

- Matiz que entra diferente do que sai é a **queixa nº 1 do AgX**. Ele faz isso de propósito:
  compensa o **efeito Abney** (cor dessaturada parece mudar de matiz) e gira o matiz com o brilho
  ("hue flight"), o que dá gradação mais rica.
- **Para publicidade com cor de marca exata**, isso pode virar problema. As opções que ele aponta:
  - **Standard:** matiz exato no escuro, puxa para neon (ciano, amarelo, magenta) no brilho.
  - **Khronos PBR Neutral:** bom para **product viz em tempo real na web**. Rolagem de brilho
    fraca e **quebra com luz colorida**. Não use em render realista.
  - **Filmic:** segura matiz no escuro e tem picos de neon no brilho.
  - **AgX:** o melhor em detalhe de brilho. Dessatura o brilho para evitar o neon e gira um pouco o
    matiz.
- Variantes de AgX fora do Blender (repositório "pixel manager"): **Kraken** (o original do Troy
  Sobotka, sem compensação de Abney), **NR2383**, **SB2383** e **Kraken 800T** (o mais
  fotográfico). **ACES 2.0** ficou bem mais "filmic" que o 1.0. Segundo ele, transformações de
  câmera entram no compositor do 5.2, mas as variantes de AgX não.
- Truque "blasfemo" para produto: usar **matiz e saturação do Standard/Filmic com os brilhos do
  AgX**, misturando os dois.
- Para algo parecer mais colorido, primeiro **dessature o entorno** e puxe para a cor oposta. Subir a
  saturação vem depois. É mais eficaz e destrói menos.

### 1.11 The Secret to Rendering Vibrant Colors with AgX is the Raw Workflow
CG Cookie (Jonathan Lampel) · https://youtu.be/hS7uaTquwWc · **Nota 5** · 4.x. É a melhor fonte de
cadeia de acabamento.

- **O primeiro passo é a exposição certa**, como numa câmera. Dá para expor para a bola amarela ou
  para a azul, não para as duas. Um pouco de sub ou superexposição ajuda o realismo.
- Na tela, **brilho e saturação competem**: o máximo de um tira do outro. O que comunica "brilhante e
  colorido" é o **contexto**: a luz laranja se lê pelo que ela ilumina. **Um pouco de haze ajuda.**
  Truques: baixar a força da luz **só para o raio de câmera**, ou girar o matiz para um vizinho mais
  claro (vermelho com centro laranja).
- O AgX lavado é **recurso**: segura informação. Ajuste pós-transformação deve ser **leve e no
  fim**.
- **Se for para Resolve ou Nuke:** não gradear no Blender. Saia em **EXR 32-bit linear**.
- **Se for para Photoshop/Lightroom:** é melhor ficar no Blender, que é 32-bit até o fim, contra 16
  bits fora.
- **Raw workflow:** View Transform = **Raw**, e no compositor um nó **Convert Colorspace** aplica o
  AgX. Assim existe um **antes** e um **depois** da transformação. Com a view em AgX, **tudo** que o
  compositor faz cai **antes** da transformação.
- **Ordem dele (inspirada no Resolve):** ANTES: exposição e gama (a exposição do painel Color
  Management quebra nesse fluxo, porque é aplicada por último), color boost, white balance, glare e
  bloom. → Convert Colorspace (AgX). → DEPOIS: curvas, nitidez e detalhe, matiz e saturação, e por
  fim lente (distorção), vinheta e grão.
- **Color boost** (vibrance) sobe a saturação **na proporção inversa** da que o pixel já tem.
  Saturação perceptual em YUV/OkLab mantém o brilho percebido. Receita de cor máxima: color boost
  primeiro (seguro), um pouco de saturação depois, e ajuste até não clipar.
- **Ponto branco** fica logo acima de onde começa o clip, para usar toda a faixa.
- **Fogo** em AgX sai cor de salmão. A correção é empurrar o **gamma (pós) levemente para laranja**
  ou os highlights para laranja. Grão bom é mais visível nas áreas menos expostas.

### 1.12 10 Easy Ways to Render Faster in Blender
Blender Guru · https://youtu.be/kIW648Cfo18 · **Nota 5** · Cycles 4.x. Ganhos medidos.

- **Instância (Alt+D) em vez de cópia (Shift+D):** −95% no carregamento com milhares de cópias.
- **Camera culling:** Simplify > Camera Culling, mais "use camera culling" nos objetos (segurar
  Alt aplica a todos). −30%.
- **Clamp indirect** mais baixo para fireflies de vidro e líquido. É menos fiel, mas economiza
  minutos.
- **Vidro de janela:** desligar a Ray Visibility **Shadow** do objeto. Passa mais luz, sem
  fireflies. −66% na sala de aula.
- **Persistent Data** (Performance > Final Render). Para ele é a maior otimização de animação: não
  refaz BVH, shaders e geometria a cada quadro.
- **Noise threshold:** o padrão de **0,01 quase nunca é atingido** antes do máximo de amostras.
  Use **0,03**, que é imperceptível e **64% mais rápido**. Acima disso aparecem manchas na sombra
  em animação.
- **Textura 4K em vez de 8K** (8K pode levar o dobro do tempo para carregar). Já está pesado?
  **Simplify > Texture Limit** (ajuda quando a VRAM estoura).
- **Fast GI no Cycles:** com 2 bounces, −23% e qualidade parecida. Com 1 bounce, −77%, com
  diferença visível.
- **GPU** (OptiX/CUDA). **CPU+GPU juntos pode ser mais lento** (6% no caso dele). Ligue GPU também no
  **denoiser e no compositor**.
- **Decimate** com ratio ~0,1 em modelo baixado e denso: −60%. Em superfície curva brilhante pode
  dar artefato, que se corrige com auto smooth.

### 1.13 Render 2995x faster in Cycles
CGMatter · https://youtu.be/kYOsR9Kb8Ek · **Nota 4** · Blender 4.1.

- GPU com **OptiX**. Com denoise, **~500 amostras** chegaram ao mesmo visual de muito mais.
- Persistent Data: renderize um quadro primeiro. Denoise na GPU, com OptiX se a placa for NVIDIA.
- **Simplify:** subdivisão máxima **1 a 3** (nunca 6). **Texture limit 2048.** Camera culling e
  distance culling ligados.
- Fast GI ligado. Em Advanced, **seed animado** (ruído diferente a cada quadro). Scrambling distance
  só se não der artefato.
- Bounces: com 0 o vidro fica preto, com 4 fica transparente. Ele fechou em **5** (o padrão era 12).
- **PNG com compressão 100 é lentíssimo.** Ele usa compressão 0, ou melhor: **OpenEXR, precisão Half,
  codec DWAA, sem alpha** se não precisar.
- Menos geometria: decimate a ~45% com o modifier linkado em vários objetos; menos segmentos de
  curva em partículas e cabelo; File > Clean Up > Unused Data Blocks.
- Truques "controversos": render a **50%** com upscale depois, e **frame step 2** com interpolação
  por optical flow no Resolve. Render pela linha de comando: `blender -b arquivo.blend -a`.

### 1.14 10 Tips for BETTER Renders in the NEW EEVEE (4.3)
SouthernShotty · https://youtu.be/yMfouQTkmFA · **Nota 4** · Blender 4.3.

- **Cáustica falsa:** Voronoi 2D (Distance to Edge, detail 0) mais Noise (detail 0), escala por um
  Value, Color Ramp e soma na cor via Mix (Add). A coordenada vem de um Empty, que se anima.
- **SSS falso:** Mix Color (base com cópia em Hue/Sat, hue ~0,475, mais quente) comandado por
  **Layer Weight** (blend ~0,7) e Emission/brilho 1,25 a 2 na borda.
- **Vidro no EEVEE:** Render Method **Dithered** mais **Raytrace Transmission** ligado, e Alpha
  comandado por Layer Weight Facing (~0,1) passando por um Color Ramp (preto subido para cinza, para
  não sumir).
- **Assar luz do Cycles em textura** (add-on SimpleBake) para o cenário e iluminar só o personagem
  no EEVEE, como nos games.
- **Light linking no EEVEE** (desde o 4.3): Ctrl+L, include/exclude. Serve para contraluz só no
  personagem.
- **Jitter Camera** em Depth of Field melhora o DOF.
- Ray tracing: **resolução 1:1 é a melhor** (número menor = mais resolução). Precision **1**. Fast GI
  resolution 1, **Rays ~12**, **Steps 16**, precision alta. Método **Global Illumination** (o
  "Ambient Occlusion" é o comportamento antigo). Distance e thickness ficam no padrão, salvo
  glitch.
- **Passes:** ligar **Mist** e, no compositor, Mist → Color Ramp → mistura de cor dá neblina com
  cor e distância controladas.
- Sombras: resolução do shadow map, volume shadows, **Rays até 4**, **Steps até 16**. Em cada luz:
  **Jitter + Over Blur**, filter (anti-aliasing) e resolution limit.
- **Influence por luz** (Diffuse, Glossy, Transmission, Volume Scatter): baixar o glossy de uma
  contraluz macia (~0,5 glossy, ~0,75 diffuse) elimina brilho falso no normal map.

### 1.15 Sound Design for Cinematic Filmmaking | My Process
Jacob Nordin · https://youtu.be/I66_LmOTlSk · **Nota 4**.

- **Ordem de montagem:** (1) voz/diálogo, o mais importante; (2) música, que define ritmo e humor (às
  vezes ele escolhe antes de filmar); (3) **ambiência**, a primeira camada de sound design: sutil,
  serve para dar chão; (4) SFX.
- SFX em dois grupos. **Do ambiente** (porta, passo, foley sincronizado com a ação), que não chama
  atenção. **Criativo** (whoosh, impact, riser): whoosh deixa corte, transição e movimento
  "intencionais"; riser constrói antecipação até um **reveal** ou uma troca de energia.
- **A ausência de som importa tanto quanto o som.** Silêncio cria contraste, e a volta bate mais forte.
- O som **não precisa ser literal**: pense no que a pessoa deve sentir (um tuk-tuk pode soar como
  carro esportivo).
- **Panning** sutil L/R deixa o som mais realista. **J-cut** (o áudio da próxima cena entra antes do
  corte, com fade-in) e **L-cut** (o áudio da cena anterior continua depois do corte) escondem o
  corte.
- Três efeitos em todo projeto: **Reverb** (dá espaço e afasta o som), **EQ** (abrir espaço:
  tirar da música as frequências da voz) e **filtros high-pass e low-pass** (telefone, abafado,
  debaixo d'água).
- **Mixagem:** nada estourando no vermelho. Se tudo estiver alto, baixe o **master/bus**. No Resolve,
  Deliver > Audio Normalization mira um padrão de loudness. **Ouça em várias caixas** antes de
  publicar.

### 1.16 3 Sound Design Secrets 90% of Editors Don't Know
Herman Huang · https://youtu.be/bxAdCSL-n5E · **Nota 4**.

- Som "chato" não se resolve empilhando efeitos. **Espaço negativo** (tirar o som) gera tensão e
  antecipação, e faz o resto bater mais forte.
- Para dar ênfase a uma frase, **a música cai antes** dela.
- Silêncio total no meio de energia alta soa brusco. A versão suave é um **low-pass animado na
  música, de frequência alta para baixa** antes do drop ("o mundo prende o fôlego"), ou um
  **high-pass de baixa para alta**.
- **SFX fora do tom da música soa errado** mesmo para ouvido leigo. Ache o tom (nome do arquivo ou
  o site TuneBat) e corrija com **pitch shift**: 1 semitom = 1 tecla, **100 cents = 1 semitom**.
  Exemplo: música em Fá e som em Lá, contar os semitons até casar.
- **Stems:** voz, baixo, bateria e instrumentos separados. Tire o instrumento que briga com a voz.
  Sem stems, o separador grátis **UVR** resolve. Com stems você "rege": muta, faz fade e aplica
  low-pass por parte.

### 1.17 3 Sound Design Secrets That Feel Like CHEATING
Herman Huang · https://youtu.be/tzfzkTAQsnE · **Nota 4**.

- **Camadas por frequência** ("bolo"): um whoosh só não dá peso a um movimento grande. Empilhe sons
  que ocupem graves, médios e agudos diferentes.
- O mesmo vale para voz e música: em vez de só baixar a música, **cave um bolsão nos médios** da
  música para a voz encaixar. A legenda diz "DSR effect" (provavelmente um de-esser ou EQ dinâmico
  usado fora do propósito). Na voz, corte graves e agudos extremos.
- **Coerência de estilo:** num comercial de atletismo, não use o mesmo pacote de SFX de casamento
  ou corporativo. Grave sujo não combina com corporativo, sino limpo não combina com streetwear.
  **Escolha um pacote e fique nele.**
- "Realismo emocional" (*Euphoria*): trocar o som literal por outro de mesma emoção. Exemplo:
  coffee grounds viram iceberg rachando, e o swish do café vira onda.
- **Encaixar música longa em peça de 30 s.** Entrada: **inverter a batida inicial** (ou o fim) da
  música e usar como riser. Saída: cortar antes da próxima batida e pôr **Reverb na última batida**
  (preset "Great Hall"), com um fade no original e a versão com reverb por baixo.
- Para ficar sem emenda: **risers, swells e suckbacks** por baixo da entrada; **impacts, slams e
  hits** para fechar "com estrondo".

### 1.18 How to Sound Design Viral Videos in 2026! (Full Guide)
SalimEdits · https://youtu.be/dJidGbUDmqA · **Nota 3** · Premiere Pro, mas os valores são concretos.

- **Três partes:** diálogo (primário; tudo existe para apoiá-lo), SFX e música.
- **Cadeia de voz:** Parametric EQ preset **Vocal Enhancer** → Single-band Compressor preset **Voice
  Thickener** com **threshold −24 dB** → DeNoise a **5%** (0 a 10%; 50% estraga).
- **SFX em três camadas:** (1) **ação**: movimento rápido de câmera, clique, texto que aparece;
  (2) **hits e risers**: emoção, tensão e alívio; (3) **ambiência**: mar, café, PC, pássaros.
  Num vídeo só de motion graphic, ele **dispensou a ambiência**.
- **Sincronia:** marque os quadros de movimento mais intenso e **alinhe o pico da forma de onda do
  SFX ao marcador**. Por tipo: zoom/pan = whoosh; pop-up = som de UI; texto entrando palavra por
  palavra = **ratchet** por palavra; flicker = glitch; elementos espalhando = "data scatter".
- **Nível:** SFX com ganho de **−5 dB** como ponto de partida. Fade nas bordas para não cortar seco.
  Cores por camada na timeline.
- **Riser antes do valor, hit quando o valor é entregue.** O fim do riser encosta no começo do hit,
  e o riser leva fade-in. O riser vira "flash de câmera" quando há flash branco.
- **Drop da música no momento mais intenso** (o mesmo do riser + hit). Ele separou voz e
  instrumental da música e automatizou o volume com keyframes.
- **Master:** **Hard Limiter preset True Peak** e **Loudness Meter preset YouTube**, para o YouTube
  não recomprimir nem baixar o volume.

### 1.19 Sound Design and Sonic Brand (Google I/O'19)
Google Design (Conor O'Sullivan) · https://youtu.be/r6Nzqcotujc · **Nota 4**. Sons de produto e
assinatura sonora; base para o "sting" de marca.

- **Princípios:** o som é **informativo** (sempre tem uma função), **honesto** (expressa a marca) e
  **tranquilizador**. **O padrão é o silêncio**: a primeira pergunta é se o som é mesmo necessário.
- Pesquisa citada: o som muda a percepção de **qualidade, tempo e emoção** (música clássica levou
  as pessoas a gastar mais).
- **Hierarquia** de sons: sistema primário (frequente, curto, com **variação sutil** para não
  cansar); secundário; ambiente; notificação (ritmo, agudo, espectro largo); **hero** (1 ou 2
  momentos que celebram a essência, sem abuso); **brand sound** (logo sonoro, ativo próprio usado em
  anúncio e abertura). O do Google é piano limpo em **Sol (G de Google)**.
- **Motivo tonal com no máximo 5 notas.** **Ascendente** = abertura, positivo, sucesso;
  **descendente** = fechar, voltar, resolver; **repetição** = progresso ou processando.
  **Skeuomórfico** (obturador de câmera) quando existe associação forte.
- **Dinâmica** (variação de volume) soa natural; som chapado parece artificial. **Envelope**: ataque
  suave é ambiente e liso; ataque duro é percussivo, chama atenção e dá sensação tátil.
- **Efeitos com contenção:** reverb e delay **adoçam, não trocam o sabor**. Ele mostrou reverb bom
  × excessivo.
- **Tom-base da marca**, com sons relacionados no **mesmo tom**. Pares de ação (abrir/fechar)
  ganham sons pareados.
- **Audicione no dispositivo final.** Ele fez **mais de 100 versões** do toque padrão do Pixel,
  porque o som de estúdio muda na caixa real.

---

## 2. Síntese

### 2.1 Regras consolidadas

| # | Regra | Por quê | Valores | Sinal de erro | Fonte |
|---|---|---|---|---|---|
| R1 | **Nunca renderizar em Standard.** Use AgX. | Standard corta o brilho e colapsa as cores em 6 tons neon | `view_transform='AgX'` | Branco estourado em placa, cor saturada virando ciano/amarelo/magenta chapado | 1.4, 1.7, 1.10, 1.11 |
| R2 | **AgX sempre com look ou grade.** Ele nasce lavado de propósito. | É "log": guarda informação | Look `AgX - Punchy` ou `AgX - Medium High Contrast`/`High Contrast`, ou curva | Imagem cinza, branco que não é branco | 1.4, 1.6, 1.7, 1.11 |
| R3 | **Exposição é o primeiro ajuste de cor**, antes de luz extra e de saturação | Câmera: expor para a cor que importa | `view_settings.exposure`; +0,75 citado para o ACES | Cena escura → o reflexo é subir a luz; o certo é expor | 1.4, 1.11 |
| R4 | **Saturação vem do contexto**: dessature o entorno e use a cor oposta antes de subir a saturação | Brilho e cor competem na tela | Haze leve, fundo neutro/complementar | Saturação alta clipando e perdendo detalhe | 1.10, 1.11, 1.4 |
| R5 | **Cor de marca exata:** saiba que o AgX gira o matiz | Compensa Abney, "hue flight" | Conferir com amostra; se necessário, misturar o matiz do Standard com o brilho do AgX, ou corrigir pós-transformação | Laranja da marca virando salmão, vermelho virando rosa | 1.10, 1.11 |
| R6 | **EEVEE: ray tracing LIGADO e Fast GI LIGADO** | Off = sem reflexo nem rebatimento; só ray tracing = escuro e lamacento | `use_raytracing=True`, limiar de rugosidade 0,5, `use_fast_gi=True` | Cena escura e "de videogame velho" | 1.1, 1.2, 1.14 |
| R7 | **Fast GI steps ≥ 16** | 8 dá pouca "energia" de rebatimento | steps 16; distance 1 a 2 com volume probe, 0 (infinito) sem probe | Paredes e cantos escuros demais | 1.1, 1.14 |
| R8 | **Resolução de ray tracing/GI na final ≥ 1:2** | 1/8 a 1/16 pisca em animação | Final: RT 1:1, GI 1:2 (Guru) ou 1:1 (Shotty) | Flicker de luz rebatida e de reflexo | 1.1, 1.14, 1.2 |
| R9 | **Sombra macia sem vazamento:** steps 12 a 16, rays 2 a 4, jitter na luz | Steps = checkpoints da sombra; rays = amostras só da sombra | `shadow_step_count` 12 a 16, `shadow_ray_count` 2 (até 4), luz com jitter | Luz vazando pela quina, penumbra granulada | 1.1, 1.2, 1.14 |
| R10 | **Denoise temporal do ray tracing OFF** | Borra textura | `denoise_temporal=False` [conferir por sonda] | Textura "lavada" e sem detalhe | 1.1 |
| R11 | **EEVEE é screen space: probe onde a câmera revela o defeito** | O que sai do quadro some dos reflexos | Plane no piso refletivo; Sphere no objeto cromado/vidro (clip start ajustado, falloff 0 em esfera) | Fantasma preto atrás do objeto, cromado ficando cinza no close | 1.1 |
| R12 | **World/HDRI no EEVEE pede volume probe** se houver interior; ou HDRI só como céu (sun threshold 0) mais sun lamp | O world ilumina tudo por igual | Surfel ~100; pontos logo dentro da parede; esconder neblina e vidro ao assar | Luz azul dentro de caixa fechada, grade no teto | 1.1, 1.2 |
| R13 | **Vidro fino no EEVEE = vidro falso** (Transparent + Glossy por Facing) | A refração esconde o conteúdo | Rugosidade 0; Blended só com Sphere probe | Copo parecendo aquário, líquido invisível | 1.1, 1.14 |
| R14 | **Volume/neblina: EEVEE** | Barato e bonito no EEVEE, pesado no Cycles | Volume Scatter densidade ~0,05 | Cycles levando horas em neblina | 1.1, 1.9 |
| R15 | **Cycles: noise threshold 0,03 (final) a 0,1 (prévia) com denoise** | 0,01 nunca é atingido | `adaptive_threshold` | Render que bate no máximo de amostras sempre | 1.12, 1.3 |
| R16 | **Cycles em animação: Persistent Data ON** | Não refaz BVH/shader por quadro | `render.use_persistent_data=True` | Segundos de "Building BVH" a cada quadro | 1.12, 1.13, 1.3 |
| R17 | **Bounces enxutos** | Cada bounce custa | volume 0; diffuse 5; glossy 6; transmission ~8; transparent 10 (20 com muita folha/alpha) | Vidro preto (pouco transmission); folha com sombra preta (pouco transparent) | 1.3, 1.13 |
| R18 | **Vidro de janela no Cycles sem sombra** | Vidro fino não gera cáustica | `obj.visible_shadow=False` | Sala escura e com fireflies | 1.12 |
| R19 | **Textura no tamanho certo**; no EEVEE, apague mapas inúteis | Carregamento e VRAM | 4K máx.; texture limit 2048 na 3050 de 4 GB | Quadro EEVEE de 11 s que poderia ser 4 s | 1.1, 1.12, 1.13 |
| R20 | **Saída para pós = EXR**; PNG só para entrega final | EXR guarda faixa e é rápido de gravar (DWAA) | EXR Half DWAA; PNG compressão baixa durante o render | Banding no grade, render lento por compressão PNG | 1.4, 1.11, 1.13 |
| R21 | **Pós-transformação: leve e no fim** | Quebra a imagem se exagerar | Curva, ponto branco logo acima do clip | Cor neon, pele ou produto "queimado" | 1.11 |
| R22 | **Som: cada som tem função; o padrão é o silêncio** | O excesso cansa e barateia | ≤5 notas no sting; hero 1 a 2 por peça | Comercial "barulhento" sem ênfase | 1.19, 1.16, 1.15 |
| R23 | **SFX sincronizado pelo pico** com o quadro de movimento mais rápido | O ouvido cola pico com pico | Pico da forma de onda = marcador | Whoosh "atrasado" ou "adiantado" | 1.18 |
| R24 | **SFX no tom da música** | Fora do tom soa errado | Pitch shift em semitons/cents | Sensação de "algo errado" sem saber o quê | 1.16 |
| R25 | **Um pacote de SFX por peça** | Coerência de estilo | Mesmo fornecedor/família | Comercial premium com som de vlog | 1.17 |
| R26 | **Master com limiter true peak + loudness da plataforma** | A plataforma recomprime | Preset True Peak; preset YouTube; ver 5.4 para números | Volume oscilando, distorção no celular | 1.18, 1.15 |

### 2.2 Conflitos entre fontes

| Tema | Lado A | Lado B | Como decidir |
|---|---|---|---|
| AgX × ACES | AgX segura as faixas e tem menos desvio de matiz (Christopher 3D, CG Cookie) | ACES sai mais saturado e "punchy" (SouthernShotty) | Padrão AgX. O ACES 1.x desvia matiz (azul→roxo), ruim para cor de marca. O ACES 2.0 é elogiado no 1.10: vale um teste A/B no 5.2 (receita 6.2). |
| Precisão do ray tracing | Precision **1** (SouthernShotty) | Alta, **mas não 1** (Pirani) | Testar 0,9 × 1,0 em tempo e visual. Nenhuma fonte mediu. |
| Resolução EEVEE final | Tudo 1:1 (Pirani, Shotty) | RT 1:1 e GI 1:2 (Guru, filme final) | Começar no 1:1/1:2 do Guru. Se houver flicker de GI, ir a 1:1. |
| Noise threshold Cycles | 0,1 (Afternoon) | 0,03 (Guru); 0,2 só no viewport (On Mars) | 0,1 para revisão, 0,03 para final de animação (o Guru avisa de manchas acima de 0,03). |
| Amostras Cycles | 100 e subir (Afternoon) | ~500 bastou com denoise; "talvez 1000" (CGMatter) | Teto 256 a 512 com threshold 0,03. Medir na 3050. |
| Denoiser | OptiX para vídeo, OIDN para still (Afternoon) | Denoise na GPU, OptiX se NVIDIA (CGMatter, Guru) | RTX 3050: OptiX na animação; OIDN (GPU) em still hero. [conhecimento geral: OIDN tende a preservar mais detalhe; OptiX é mais rápido] |
| Compressão PNG | 100 (máxima, sem perda) (Afternoon) | 0, porque 100 é lentíssimo; melhor EXR (CGMatter) | Os dois estão certos: é tamanho × tempo. Animação: EXR DWAA ou PNG 15. Still final: tanto faz. |
| Onde gradear | Resolve, com EXR (SouthernShotty) | No Blender, pelo Raw workflow, se a alternativa for Photoshop; se for Resolve/Nuke, EXR linear sem grade (CG Cookie) | No pipeline do Claude não há Resolve: **gradear no compositor do Blender** (receita 4). |
| Transmission bounces | 4 já deixa transparente; fechou em 5 (CGMatter) | "Translucent 8" (Afternoon) | Vidro empilhado (garrafa com líquido) pede mais. Começar em 8 e baixar se não mudar nada. |
| Fast GI no Cycles | Liga se não fizer diferença (Afternoon) | 2 bounces −23%, 1 bounce −77% com perda (Guru) | Rascunho com 1 bounce; final com 2 ou desligado em still hero. |
| Frame step 2 + interpolação | Economia grande (CGMatter) | Nenhuma outra fonte | **Não usar em comercial**: optical flow cria artefato em borda de produto [conhecimento geral]. No máximo em teste. |

### 2.3 Antigo → 5.2

| Tutorial antigo diz | No 5.2 é | Fonte / status |
|---|---|---|
| Filmic é o padrão; look "Very High Contrast" | **AgX é o padrão** (desde o 4.0). Looks com prefixo: `AgX - Punchy` etc. | verdade.md, 1.6, 1.7 |
| Instalar AgX à mão | Nativo | 1.6 (pré-4.0) |
| Só Standard/Filmic | Também `Khronos PBR Neutral`, `ACES 1.3`, `ACES 2.0`, `Raw`, `False Color` | verdade.md, 1.4 |
| Sem working space | **Working Space do arquivo** (Linear Rec.709 / Rec.2020 / ACES) desde o 5.0 | 1.4 [nome Python: conferir por sonda] |
| `BLENDER_EEVEE_NEXT` | `BLENDER_EEVEE` | verdade.md |
| EEVEE: caixas Bloom e AO | **Removidas** (4.2). Bloom vira nó **Glare (Bloom)** no compositor; AO vira Fast GI/passe AO | 1.2 [Glare: conhecimento geral] |
| Soft Shadows, cascade, cube size | Shadow **Rays/Steps** na cena mais **Jitter/Over Blur/Filter/Resolution Limit** em cada luz | 1.1, 1.2, 1.14 |
| SSR / Screen Space Refraction | **Ray tracing** (Screen ou Light Probe) mais **Raytrace Transmission** no material | 1.1, 1.14 |
| Irradiance Volume, Reflection Cubemap, Reflection Plane | Light Probe **Volume**, **Sphere** e **Plane** | 1.1 |
| Blend Mode (Alpha Blend/Hashed) | **Render Method: Dithered / Blended** | 1.1, 1.14 |
| SSGI por add-on | Fast GI nativo | 1.9 |
| Light linking só no Cycles | EEVEE também (4.3+) | 1.14, verdade.md |
| `scene.node_tree` + `use_nodes` | **`scene.compositing_node_group`** (CompositorNodeTree) | verdade.md |
| Backend OpenGL | Vulkan disponível no Blender 5 | 1.9 |
| Cycles "Translucent bounces" | Não existe; é **Transmission** | 1.3 (erro de fala ou de legenda) |
| Transformações de câmera só via OCIO externo | Algumas entram no compositor do 5.2 | 1.10 [conferir por sonda] |

---

## 3. Presets de render

Faixas montadas a partir das fontes. Onde nenhuma fonte deu número, está marcado. Medição real
conhecida: **EEVEE 1080×1920 com 16 amostras ≈ 3 s/quadro** na RTX 3050 (verdade.md).

### 3.1 EEVEE (`'BLENDER_EEVEE'`)

| Parâmetro | Rascunho (blocking/timing) | Revisão (aprovar luz/cor) | Final | Fonte |
|---|---|---|---|---|
| `taa_render_samples` | 16 | 32 a 64 | 64 (128 só se sobrar grão; prefira subir rays de sombra) | verdade.md, 1.1, 1.2 |
| `use_raytracing` | True | True | True | 1.1 |
| Método | Screen | Screen | Screen (Light Probe se o screen falhar) | 1.2, 1.14 |
| Resolução RT | 1/4 | 1/2 | **1:1** | 1.1, 1.2, 1.14 |
| Max roughness (limiar) | 0,5 | 0,5 | 0,5 | 1.1 |
| Precision RT | padrão | 0,8 a 0,9 [interpolado] | 0,9 a 1,0 (conflito 2.2) | 1.2, 1.14 |
| Denoise RT | on, **temporal off** | on, temporal off | on, temporal off | 1.1 |
| `use_fast_gi` | True | True | True | 1.1 |
| Fast GI método | Global Illumination | GI | GI | 1.14 |
| Resolução GI | 1/4 | 1/2 | **1:2** (1:1 se piscar) | 1.1, 1.14 |
| Steps GI | 8 | 16 | 16+ | 1.1, 1.14 |
| Rays GI | padrão | padrão | mais alto (~12 em 1.14) [conferir o limite] | 1.2, 1.14 |
| Distance GI | 0 sem probe; 1 a 2 com volume probe | igual | igual | 1.1 |
| `shadow_ray_count` | 1 | 1 a 2 | 2 (até 4) | 1.1, 1.14 |
| `shadow_step_count` | 6 a 8 | 12 | 16 | 1.1, 1.14 |
| Jitter de sombra por luz | off | on nas luzes principais | **on em todas** + over blur baixo | 1.2, 1.14 |
| Sphere probe resolution | 512 | 1K | 1K (2K só em close de cromado) | 1.1 |
| Volume probe surfel | 20 | 50 | ~100 | 1.1 |
| Volumétrico | off ou densidade baixa | on | on (~0,5 s/quadro na fonte) | 1.1 |
| Motion blur | off | off | on [valor do shutter: lacuna] | verdade.md |
| DOF | sem jitter | sem jitter | **Jitter Camera** on | 1.14 |
| Texturas | mapas inúteis já removidos | — | — | 1.1 |

### 3.2 Cycles (`'CYCLES'`, OptiX)

| Parâmetro | Rascunho | Revisão | Final animação | Final still hero | Fonte |
|---|---|---|---|---|---|
| `samples` (teto) | 64 a 100 | 256 | 256 a 512 | 512 a 1000 | 1.3, 1.13 |
| `adaptive_threshold` | 0,1 a 0,2 | 0,1 | **0,03** | 0,01 a 0,03 | 1.3, 1.8, 1.12 |
| Denoiser | OptiX | OptiX | **OptiX** (GPU) | **OIDN** (GPU) | 1.3, 1.12, 1.13 |
| Resolução | 50% | 100% | 100% | 100% | 1.13 |
| Diffuse / Glossy | 2 / 2 [interpolado] | 5 / 6 | 5 / 6 | 5 / 6 | 1.3 |
| Transmission | 4 | 8 | 8 (baixar se não mudar nada) | 8 a 12 | 1.3, 1.13 |
| Transparent | 8 | 10 | 10 (20 com folhagem/alpha) | 20 | 1.3 |
| Volume | 0 | 0 | 0 | 0 | 1.3 |
| Caustics | off | off | off (on só se fizer diferença visível) | testar | 1.3 |
| Clamp indirect | baixo | baixo | baixar se houver firefly [sem valor nas fontes; o padrão é 10] | idem | 1.12 |
| Fast GI | on, 1 bounce | on, 2 bounces | on, 2 bounces | off | 1.12 |
| Persistent Data | on | on | **on** | — | 1.12, 1.13 |
| Seed animado | — | — | **on** | — | 1.13 |
| Simplify subdiv | 1 | 2 | 3 (máx.) | sem limite | 1.13 |
| Texture limit | 1024 | 2048 | **2048** (VRAM de 4 GB) | 4096 se couber | 1.12, 1.13 |
| Camera / distance cull | on | on | on (desligar se o reflexo de algo fora do quadro importar) | idem | 1.12, 1.13 |
| Vidro de janela | `visible_shadow=False` | idem | idem | idem | 1.12 |
| Motion blur | off | off | **on** | — | 1.3 |

### 3.3 Saída

| Uso | Formato | Fonte |
|---|---|---|
| Quadros para pós/grade | `OPEN_EXR`, color depth 16 (Half), codec **DWAA**, RGB sem alpha | 1.13, 1.4, 1.11 |
| Precisa de alpha (compor produto) | EXR RGBA ou PNG RGBA + Film Transparent | 1.3, 1.8 |
| Entrega rápida já gradeada no Blender | PNG 8-bit, compressão 15 (nunca 100 durante animação) | 1.13 |
| Vídeo final | FFmpeg H.264 (sequência de imagens primeiro: se cair, não perde o render) [conhecimento geral] | verdade.md |

---

## 4. Receita de acabamento (cadeia de pós)

### 4.1 Caminho A, padrão e seguro (sem Raw)
Para quase todo filme. Lembre que com view = AgX **todo nó do compositor roda ANTES do AgX**
(CG Cookie, 1.11). Então o compositor serve para efeito físico (glare, neblina, AO, vinheta), e o
"punch" vem do look.

1. **Render**: luz certa e exposição certa no Color Management (`exposure`), como numa câmera
   (1.11).
2. **Compositor** (`scene.compositing_node_group`):
   1. `Render Layers` (passes: Mist, AO se precisar).
   2. **Neblina por profundidade**: Mist → Color Ramp → Mix (cor da névoa sobre a imagem). A fonte
      deixa a distância nas configurações de Mist do World (1.14). Haze leve ajuda a luz a "ler
      colorida" (1.11).
   3. **Composição de layers**: produto sobre cenário com **Alpha Over** (1.5); AO em
      **Multiply** (1.8).
   4. **Glare tipo Bloom** (substituto do Bloom antigo) [valores: lacuna; conhecimento geral:
      threshold ~1,0, mistura sutil].
   5. **Lens Distortion** com dispersão bem baixa, **vinheta** e **grão**. São os efeitos de
      câmera que a fonte põe no fim (1.11). [Vinheta por máscara elíptica + blur + multiply:
      conhecimento geral.]
3. **View Transform AgX + look** `AgX - Punchy` ou `AgX - Medium High Contrast` (1.6, 1.7).
4. **Curvas no Color Management** (`use_curve_mapping`) para o ponto branco e um S leve, como no
   1.4. [Em que ponto da cadeia o Blender aplica essa curva: conferir por sonda.]

### 4.2 Caminho B, Raw workflow (cor máxima, nível produtora)
A cadeia do CG Cookie (1.11), na ordem dele:

```
Render Layers (linear, cena)
  ├─ PRÉ-TRANSFORMAÇÃO (linear)
  │   1. Exposure            (o exposure do painel Color Management quebra aqui)
  │   2. Gamma / contraste   (os looks do AgX quebram neste fluxo; replique com exposure+gamma)
  │   3. Color boost         (vibrance: satura mais o que tem menos saturação)
  │   4. White balance       (temperatura = azul↔vermelho; tint = verde)
  │   5. Glare / Bloom
  ├─ Convert Colorspace  →  AgX   [nome exato do espaço de destino: conferir por sonda]
  └─ PÓS-TRANSFORMAÇÃO (display), leve e no fim
      6. Curves              (ponto branco logo acima do clip; S leve)
      7. Nitidez / detalhe
      8. Matiz e saturação   (perceptual; empurrar fogo para laranja pelo gamma pós)
      9. Lens distortion / dispersion → vinheta → grão
Color Management: View Transform = 'Raw'
```

Regras da cadeia: o "colorido" sai primeiro do color boost (seguro); saturação pós entra só um
pouco, até não clipar (1.11). Cor que precisa saltar se resolve dessaturando o entorno (1.10).

### 4.3 Saída para outro programa
Se um dia o pipeline passar por Resolve: **EXR linear**, sem grade no Blender (1.11, 1.4).

---

## 5. Design de som de comercial

### 5.1 As camadas (de baixo para cima na prioridade de mix)
1. **Voz/locução**, se houver: prioridade absoluta, tudo existe para servir a ela (1.15, 1.18).
   Cadeia: EQ de realce vocal → compressor (threshold −24 dB) → denoise 5% (1.18).
2. **Música** com **stems**: define ritmo e humor. Mute o que briga com a voz; cave os médios
   para a voz (1.16, 1.17, 1.15).
3. **Ambiência**: sutil e de fundo. Em peça só de motion graphic pode ser dispensada (1.18). Em
   produto, um "room tone" de estúdio dá chão [conhecimento geral].
4. **SFX de ação**, um por movimento: whoosh em move de câmera, zoom ou giro; UI/click em pop-up e
   interface; **ratchet por palavra** em texto que entra palavra a palavra; glitch em flicker;
   "data scatter" em partículas que se espalham (1.18). Whoosh grande = **camadas por frequência**
   (grave + médio + agudo) (1.17).
5. **Hits e risers**: o riser constrói até o **reveal** do produto e o hit cai no reveal. O drop da
   música vai no mesmo quadro (1.18, 1.15, 1.17).
6. **Hero/brand sting**: o logo sonoro do fim. Motivo **≤5 notas**, **ascendente** (sucesso,
   abertura), no **tom-base da marca**, com reverb só para adoçar (1.19).
7. **Silêncio/espaço negativo** como camada deliberada antes do momento-chave, ou a versão suave:
   **low-pass da música varrendo do agudo ao grave** antes do drop (1.16, 1.15, 1.19).

### 5.2 Tipos de efeito por momento de um comercial de produto
| Momento visual | Som | Fonte |
|---|---|---|
| Abertura / entrada da música | batida inicial invertida como riser; swell | 1.17 |
| Câmera orbitando / dolly rápido | whoosh em camadas, pico no quadro de maior velocidade | 1.17, 1.18 |
| Peça encaixando / produto pousando | hit curto de ataque duro (tátil); skeuomórfico se houver associação (clique, obturador) | 1.19 |
| Texto/feature aparecendo | UI click, ratchet por palavra; sons pareados para entrar/sair | 1.18, 1.19 |
| Flash/brilho de material | riser tipo "flash de câmera" → hit | 1.18 |
| Pausa antes do reveal | silêncio ou low-pass | 1.16 |
| Reveal do produto | hit + drop da música | 1.18 |
| Packshot / logo | sting ≤5 notas ascendente; final da música com reverb "Great Hall" | 1.19, 1.17 |
| Transição entre cenas | J-cut / L-cut na ambiência; whoosh | 1.15 |

### 5.3 Sincronia com o movimento
- **Pico com pico:** o ponto mais alto da forma de onda do SFX cai no quadro do movimento mais
  intenso (1.18).
- **O riser termina onde o hit começa**; o riser leva fade-in (1.18).
- **Áudio antecipa o corte** (J-cut) e fica depois dele (L-cut) (1.15).
- **SFX afinado com a música** (pitch em semitons; 100 cents = 1 semitom) (1.16).
- **Variação sutil** em sons repetidos (cada clique um pouco diferente) para não soar robótico
  (1.19).
- **[proposta] Para o Claude:** o quadro de pico pode ser calculado pelas F-curves da animação
  (caminho via `anim_utils.action_get_channelbag_for_slot`, verdade.md). Achar o quadro de maior
  velocidade da câmera ou do objeto, converter em tempo (`quadro / fps`) e posicionar o pico do
  whoosh ali. O mesmo vale para o quadro de impacto (velocidade cai a ~0) → hit.

### 5.4 Mixagem
- SFX começam com ganho **−5 dB** e são ajustados de ouvido (1.18).
- Música desce sob a voz e **cava os médios**, em vez de só abaixar (1.17, 1.15).
- Fade nas bordas de todo SFX para não cortar seco (1.18).
- Nada no vermelho. Se tudo estiver alto, baixe o **master** (1.15).
- Master: **limiter true peak** + **medidor de loudness no padrão da plataforma** (1.18), ou
  normalização na exportação (1.15). [Números de conhecimento geral: YouTube e streaming ~**−14
  LUFS integrado**, **−1 dBTP** de pico real. Nenhuma das fontes deu o número.]
- **Audicione no dispositivo final** (celular!), em várias caixas (1.19, 1.15).
- Pouco efeito: reverb e delay adoçam, não mudam o sabor (1.19). Pan sutil L/R para dar espaço
  (1.15).
- **Um pacote de SFX por peça** (1.17).

---

## 6. Receitas para testar no Blender 5.2

Cada receita isola uma variável. Para medir, use uma cena de produto padrão do laboratório. Nomes
de propriedade fora do verdade.md estão marcados.

1. **Looks do AgX (cor lavada).** Mesmo quadro com `view_transform='AgX'` e
   `look` ∈ {`'None'`, `'AgX - Base Contrast'`, `'AgX - Medium High Contrast'`,
   `'AgX - High Contrast'`, `'AgX - Punchy'`} × `exposure` ∈ {−0,5; 0; +0,5; +1,0}. Repetir em
   `'Standard'` como controle. Esperado: Standard estoura o brilho, AgX None fica cinza, Punchy ou
   Medium High resolvem (1.6, 1.7).
2. **AgX × ACES 2.0 × Khronos PBR Neutral em cor de marca.** Placa emissiva e material na cor
   exata da marca, com luz branca forte e com luz colorida. Medir no PNG o desvio de matiz.
   Esperado: AgX gira o matiz; PBR Neutral quebra na luz colorida (1.10); ACES 1.3 puxa o azul
   para roxo (1.7).
3. **Ray tracing e Fast GI.** EEVEE 64 amostras, nesta ordem: (a) `use_raytracing=False`;
   (b) RT on, `use_fast_gi=False`; (c) RT + Fast GI com steps 8; (d) steps 16. Medir s/quadro e
   brilho médio das paredes. Esperado: (a) escuro e sem reflexo; (b) lamacento; (d) o melhor
   (1.1). [`fast_gi_step_count`: conferir por sonda.]
4. **Resolução × flicker.** Animação de 48 quadros com câmera em pan.
   `ray_tracing_options.resolution_scale` e `fast_gi_resolution` ∈ {`'16'`, `'4'`, `'2'`, `'1'`}
   [conferir por sonda]. Ver o flicker em vídeo e medir o tempo. Esperado: 1/16 pisca, 1:1/1:2
   estável (1.1).
5. **Sombra macia sem vazamento.** Area light grande atrás de parede fina com Solidify:
   `shadow_step_count` 6 → 12 → 16, `shadow_ray_count` 1 → 2 → 4, e
   `light.use_shadow_jitter=True` com `shadow_jitter_overblur` baixo [conferir por sonda]
   (1.1, 1.2, 1.14).
6. **Denoise temporal.** Material com textura fina (madeira) e `denoise_temporal` on × off
   [conferir por sonda]. Esperado: off mais nítido (1.1).
7. **Vidro no EEVEE.** Garrafa com líquido: (a) Principled com Transmission Weight 1;
   (b) Raytrace Transmission + Dithered + alpha por Facing via Color Ramp (1.14); (c) vidro falso
   Transparent + Glossy, rugosidade 0, Mix por Layer Weight Facing (1.1). Ver se o líquido aparece.
8. **Volume probe.** Interior com HDRI: sem probe × probe com pontos logo dentro das paredes,
   surfel 20 × 100, neblina e vidro escondidos × visíveis durante o bake. Esperado: neblina
   visível escurece o bake (1.1).
9. **Sun threshold.** HDRI com força 1 → 4 e `world.sun_threshold` no padrão × 0 + sun lamp
   [conferir por sonda]. Esperado: o sol do HDRI "anda" quando a força muda (1.1).
10. **Poda de textura (EEVEE).** Mesmo produto com o conjunto PBR completo × só base + normal
    (+ roughness se houver variação). Medir s/quadro. A referência da fonte é 11 s → 4 s (1.1).
11. **Cycles, threshold.** 512 amostras, OptiX, com `adaptive_threshold` ∈ {0,01; 0,03; 0,1}.
    Medir tempo e conferir mancha na sombra em 24 quadros. A fonte promete −64% em 0,03 (1.12).
12. **Cycles, Persistent Data.** 30 quadros com `render.use_persistent_data` off × on [conferir
    por sonda]. Medir o tempo total (1.12, 1.13).
13. **Cycles, Fast GI.** `use_fast_gi` off × on com `ao_bounces_render` 1 e 2 [conferir por
    sonda]. A fonte dá −23% / −77% (1.12).
14. **Bounces.** Garrafa de vidro com líquido: transmission ∈ {4, 5, 8, 12}; folhagem com alpha:
    transparent ∈ {3, 10, 20}. Achar o menor valor sem preto (1.3, 1.13).
15. **Saída.** Mesmo quadro gravado em PNG com compressão 0 / 15 / 100 × EXR Half DWAA. Medir o
    tempo de gravação e o tamanho (1.13).
16. **Compositor 5.2 do zero.** `tree = bpy.data.node_groups.new('Acabamento','CompositorNodeTree')`;
    `scene.compositing_node_group = tree`. Montar Render Layers → Glare (Bloom) → Lens Distortion
    → saída. [Conferir por sonda: tipo do nó de saída no 5.x (Group Output × Composite) e se os
    parâmetros do Glare viraram sockets.]
17. **Raw workflow.** `view_transform='Raw'` com o nó Convert Colorspace de Linear Rec.709 para o
    espaço AgX disponível na lista [conferir por sonda]. Comparar com a receita 1 (Punchy). Depois
    testar color boost e white balance antes e curva depois (1.11).
18. **Neblina por Mist.** `view_layer.use_pass_mist=True`, Mist Start/Depth do World, Mist → Color
    Ramp → Mix com cor. Comparar com um cubo de Volume Scatter 0,05 em tempo e visual (1.14, 1.1).
19. **Produto em layer separado.** View layer A (cenário, produto em holdout pela coleção) e view
    layer B (só produto com a luz dele) → Alpha Over (1.5).
20. **Som sincronizado [proposta].** Extrair das F-curves o quadro de maior velocidade da câmera,
    pôr o pico de um whoosh ali, o hit no quadro de parada e o riser terminando no hit. Mixar na
    VSE ou no FFmpeg e normalizar para −14 LUFS / −1 dBTP [conhecimento geral]. Ouvir no celular.

---

## 7. Contribuição para o Cérebro de Diretor

### 7.1 Regras de decisão (para o Claude decidir sozinho)
- **Motor:** EEVEE por padrão em motion de produto com material opaco ou metálico, interior,
  neblina ou volume, e para iterar (1.1, 1.9). **Cycles** quando houver **vidro ou líquido em
  close** (1.1), cáustica que importa ou natureza densa (1.9). Vidro fino de fundo no EEVEE vai de
  vidro falso.
- **Cor:** o filme nunca sai em Standard. AgX + look é o mínimo. A exposição é o primeiro botão.
  Saturação vem de contexto (fundo neutro ou complementar), não do slider (1.10, 1.11).
- **Cor de marca:** no briefing, pergunte se a cor da marca precisa ser **exata** no pixel. Se sim,
  rode a receita 6.2 e corrija o matiz pós-transformação ou pelo Raw workflow (1.10).
- **Cena escura:** diagnosticar nesta ordem: (1) ray tracing ligado? (2) Fast GI ligado com steps
  16? (3) exposição; (4) só então mais luz (1.1, 1.11).
- **Tempo de render:** antes de cortar amostras, cortar desperdício: textura (4K/2048), mapas
  inúteis, probes que não mudam nada, Persistent Data, threshold 0,03, simplify, instância
  (1.1, 1.12, 1.13).
- **Câmera de produto:** 70 a 120 mm, altura no olho ou abaixo, key ao lado da câmera, rim para
  separar (1.8).
- **Acabamento:** uma peça "de produtora" tem as quatro coisas: look de contraste, haze/profundidade
  leve, bloom sutil e vinheta ou grão discretos. Tudo leve (1.11).
- **Som:** silêncio é o padrão e cada som tem função. Um momento hero por peça. Sting ≤5 notas,
  ascendente, no tom da marca. SFX no tom da música e no pico do movimento. Um pacote de SFX por
  peça (1.16 a 1.19).
- **Checklist "parece comercial?" de som:** existe silêncio ou low-pass antes do reveal? O reveal
  tem hit + drop? O logo tem sting? A mixagem foi ouvida no celular?

### 7.2 Sinais de erro que o Claude deve procurar no quadro renderizado
- Branco puro chapado em superfície clara → view Standard ou exposição alta.
- Cinza geral sem preto → AgX sem look.
- Contorno escuro "fantasma" atrás de objeto num reflexo → screen space; falta probe Plane.
- Cromado acinzentando no close → falta probe Sphere.
- Faixa de luz vazando em quina → shadow steps baixos ou parede sem espessura.
- Grão só na penumbra → subir shadow rays, não as amostras gerais.
- Textura borrada no EEVEE → temporal accumulation ligado.
- Laranja virando salmão → hue skew do AgX.

---

## 8. Lacunas

1. **Nenhuma fonte testou o EEVEE do 5.2.** Todas vão de 4.2 a 4.5; a de "Blender 5" é anúncio.
   Padrões (ray tracing desligado por padrão?) e nomes Python precisam de sonda.
2. **Números de loudness** (LUFS, dBTP) não aparecem; só presets de Premiere. O −14 LUFS / −1 dBTP
   é conhecimento geral.
3. **Valores do compositor:** nenhuma fonte deu threshold e mix do Glare, força de vinheta,
   dispersão da Lens Distortion ou tamanho de grão.
4. **Motion blur:** nenhum valor de shutter para comercial.
5. **Tempo medido na RTX 3050 de 4 GB**, EEVEE × Cycles na mesma cena de produto: não existe. A
   receita 11 e a 3 resolvem.
6. **Som dentro do Blender** (VSE, `sound.mixdown`) e geração ou escolha de SFX por script: nenhuma
   fonte cobre.
7. **Luz de estúdio de produto em motion** (rebatedores, faixa de luz em superfície brilhante) só
   aparece de passagem no 1.5 e no 1.8.
8. **ACES 2.0 no Blender** só tem um elogio de passagem (1.10). Precisa de A/B próprio.
9. **Render Raw** é add-on pago e manual. O caminho por script é replicar a cadeia com nós nativos
   (receita 17), e ninguém nas fontes deu a fórmula completa do color boost em nós.
10. **Formato e codec de entrega** para Instagram/Reels (bitrate, 1080×1920, fps) não aparece.
11. **Frame step + interpolação** (1.13) não foi validado para produto; recomendo não usar.
