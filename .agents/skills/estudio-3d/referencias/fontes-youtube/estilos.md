# Destilado: estilos e mundos visuais (+ revelação de logo + motion abstrato com geometry nodes)

Fonte: 20 transcrições `estilos__*` (legenda automática, interpretada). Escrito em 2026-10-02 para o
Estúdio Claude + Blender 3D. Referência de versão: `.claude/skills/estudio-3d/referencias/blender-5.2-verdade.md`.

Convenções deste arquivo:
- **[5.2 ⚠]** = o vídeo usa algo que mudou de nome, sumiu ou mudou de comportamento até o 5.2. A
  correção vem ao lado. Quando a correção é memória minha e não sonda, ela leva [conhecimento geral].
- **[interpretado]** = a legenda está truncada ou ambígua, e o número/ligação foi deduzido do contexto.
- **[conhecimento geral]** = não está no vídeo, é conhecimento meu. Tratar como hipótese a confirmar
  em sonda antes de virar regra.
- Nomes de nó em inglês, como aparecem no Blender (é o que o script usa).

---

## 0. Tabela de pegadinhas de versão (ler antes de qualquer receita)

| O vídeo diz | No 5.2 | Fonte |
|---|---|---|
| Musgrave Texture | Sumiu (4.1). Virou o **Noise Texture** com `noise_type` (`FBM`, `MULTIFRACTAL`, `RIDGED_MULTIFRACTAL`, `HYBRID_MULTIFRACTAL`, `HETERO_TERRAIN`). "Dimension" do Musgrave virou "Roughness" no Noise | [conhecimento geral] |
| Mix RGB (shader e GN) | Nó **Mix** (`ShaderNodeMix`) com `data_type='RGBA'` (ou `'FLOAT'`, `'VECTOR'`). Sockets por índice mudam com o tipo | [conhecimento geral] |
| Shade Auto Smooth / Normals > Auto Smooth | Sumiu (4.1). Usar **Shade Auto Smooth** como modificador "Smooth by Angle" (asset de GN) ou `bpy.ops.object.shade_auto_smooth()` | [conhecimento geral] |
| EEVEE: Bloom, Screen Space Reflections, Ambient Occlusion, Contact Shadows, "bloom pass" | EEVEE novo (4.2+) removeu tudo isso. Brilho = nó **Glare** no compositor. Reflexo = `use_raytracing`. Sombra de contato = `shadow_ray_count/step_count` | verdade 5.2 + [conhecimento geral] |
| Material "Blend Mode: Alpha Blend" | `material.surface_render_method = 'BLENDED'` (ou `'DITHERED'`, padrão) | [conhecimento geral] |
| Filmic "High Contrast" / Standard | **AgX** com looks (`AgX - Punchy`, `AgX - High Contrast`…). Não trocar para Standard por padrão | verdade 5.2 |
| Principled antigo (Subsurface, Transmission, Emission) | `Subsurface Weight`/`Scale`, `Transmission Weight`, `Emission Color`/`Emission Strength` | verdade 5.2 |
| Compositor "Use Nodes" + Composite + Viewer | `scene.compositing_node_group` (node group `CompositorNodeTree`). O vídeo de 5.0 já mostra "new compositor setup" e grupos prontos | verdade 5.2 + `_BJgmrTohpw` |
| Glare com "Fog Glow" / "Streaks" | Ainda existem; o 4.2+ ganhou o tipo **Bloom** e o tipo **Sun Beams** (citados no vídeo de 5.0). No 5.x vários parâmetros viraram sockets | `_BJgmrTohpw` + [conhecimento geral] |
| Volume Cube (3.3 alpha experimental) | Existia estável a partir do 3.3/3.4. O 5.0 reformou volumes (nós de "grid"). **Confirmar por sonda** se `GeometryNodeVolumeCube` ainda existe | [conhecimento geral] |
| Rotate Instances recebendo vetor | No 4.2+ a entrada é do tipo **Rotation**; ligar um vetor converte como Euler (radianos) | [conhecimento geral] |
| Sistema de partículas + Explode modifier | Ainda existem como legado no 4.x. **Confirmar no 5.2 por sonda** antes de usar a receita do tecido rasgando | [conhecimento geral] |
| Line Art "coleção" (Grease Pencil) | Grease Pencil v3 (4.3) reescreveu tudo: Line Art virou modificador do objeto GP novo | [conhecimento geral] |
| `action.fcurves` | Não existe. Usar `anim_utils.action_get_channelbag_for_slot` | verdade 5.2 |
| Preferência "default interpolation = Linear" | Em script não depende da preferência: setar `kp.interpolation` em cada chave | verdade 5.2 |

---

## 1. Por vídeo

### Bloco A: motion abstrato com geometry nodes

#### A1. Satisfying Geometry Nodes Animation (Blender Tutorial)
- Canal: Ducky 3D · https://youtu.be/NyUJ6XH8A94 · **Nota 5** · Versão estimada 3.1/3.2 (usa Mix RGB em GN).
- Base: um plano carrega a árvore de GN; apaga o Group Input; **Cube** (primitivo) com Vertices X/Y/Z = 10 serve só de grade de pontos.
- **Instance on Points** usando um cubo REAL do cenário (arrastado do outliner com Object Info), porque o cubo instanciado tem **Bevel modifier** com alguns segmentos + shade smooth. Lição: bevel bonito em instância vem de objeto real.
- Escala das instâncias: **Noise Texture 4D**, Detail 0, Scale 1.5 → **Color Ramp** → Scale. O preto do ramp NÃO em zero (cubo nunca some), o que suaviza a variação.
- Segundo conjunto de cubos menores por dentro (árvore duplicada, Size menor) para a peça não parecer oca.
- **Loop perfeito do W** (crédito do Ducky ao Joey Carlino): dois Noise idênticos misturados por Mix; quadro 0→250: Fac 0→1, Noise A W 0→5, Noise B W −5→0. Interpolação linear. Velocidade = o número (5 rápido, 3 lento, 10 o dobro).
- Cenário "cyclorama": plano escala 5, aplica escala, extruda UMA aresta em Z (parede), Bevel modifier com segmentos, rotaciona para ângulo interessante.
- Câmera frontal **85 mm**. Luz: duas Area (300 W e 500 W) de lados opostos. Material: um azul-claro único na instância e no fundo (monocromático).
- Cycles, 150 amostras, denoise. Saída MP4 "perceptually lossless" (ou sequência PNG, mais segura).

#### A2. Abstract 3D Motion Design Loop (Blender Motion Graphics Tutorial)
- Canal: Ducky 3D · https://youtu.be/agNT-6IxN2I · **Nota 5** · Versão 4.0 (ele cita o 4.0 e o Principled novo).
- **Mesh Line** (Count 10, depois 30, offset Z menor para juntar) → **Transform Geometry** Rotation Y 90°, Translation −4.5 (centraliza 10 pontos espaçados de 1).
- **Instance on Points** com **Quadratic Bézier**: Start −5, Middle 0, End +5 num eixo (reta de 10 m) [interpretado], Resolution 100 (é a subdivisão que a deformação precisa); Rotation Z 90°.
- **Realize Instances** → **Set Position** com Offset = **Combine XYZ** (só Z) ← Noise 4D (Detail 0, Scale 0.4) → Color Ramp com interpolação **Ease** (B-Spline ainda mais macia). Linear fica "duro".
- Truque de "texture coordinate" dentro de GN: **Position → Vector Math DIVIDE** → Vector do Noise. Dividir num eixo estica o ruído ao longo das fitas e tira a cara de "noise genérico". Outro **Vector Math MULTIPLY** + nó **Value** = força do deslocamento.
- **Curve to Mesh** com perfil **Curve Line** (Z=0, X = largura → fita chata) ou **Curve Circle** (tubo). Depois modificadores **Solidify** + **Bevel** 4 segmentos (o vídeo diz "bevel node", mas no fluxo é modificador [interpretado]).
- Material das fitas: Principled com **Subsurface Weight 1**, cor rosa, **Subsurface Scale** alto (luz atravessa). Chão: madeira da ambientCG (Painted Wood 007C: Color, Roughness non-color, Normal).
- **Câmera ortográfica** em ângulo alto (ele prefere orto nesse ângulo). Luz: Area **Disk** enorme apontando para baixo, 8000→10000 W + plano de rebote cujo material tem Base Color com Value 5 (rebote "superexposto" sem luz extra).
- Cor: **AgX + Punchy**, brilho um pouco acima, gamma abaixo. 150 amostras + denoise no compositor com passes Denoising Normal/Albedo (SSS é ruidoso). Loop W 0→12 / −12→0 em 250 quadros.

#### A3. 10 Minute Tutorial – Particle Flow Animation Loop (Geometry Nodes)
- Canal: Ducky 3D · https://youtu.be/eBNolzjnHtE · **Nota 4** · Versão estimada 3.6/4.x (Noise com Normalize).
- **Ico Sphere** Radius 3, Subdiv 3 → **Mesh to Volume** → **Distribute Points in Volume** (densidade é pesada; ele termina em ~2-3) [interpretado].
- **Set Position** Offset = Noise 4D (**usar a saída Color**, não Fac, para mover em XYZ), **Normalize** ligado, Detail 0, Scale ~0.2 [interpretado], Distortion 2 → Vector Math MULTIPLY (força).
- **Instance on Points** com Ico Sphere Subdiv 2, raio pequeno + **Set Shade Smooth**.
- Cor travada no movimento: **Store Named Attribute** (tipo cor, domínio **Instance**, nome livre) ← mesma cor do noise. No shader: nó **Attribute** tipo **Instancer** → quebra com outro Noise (Detail 0, Scale 2) → Color Ramp: cáqui/"pele", rosa-claro e preto (predominância de rosa).
- Material: Subsurface Weight 1, Radius (1,1,1), Scale ~2, Roughness 0 (brilho de bala de goma).
- Luz única: Area **Disk** 1000 W, tom quente, de lado, **Spread** reduzido a ~90° (foca o feixe). World preto + **Principled Volume** fraco no World (preenche os vazios).
- Loop com dois Noise (saídas Color misturadas), W 0→5 / −5→0, 250 quadros. Cycles 300 amostras, denoise.

#### A4. Geometry Nodes Organic Plexus Animation
- Canal: Ducky 3D · https://youtu.be/ePIGnLpNzTA · **Nota 4** · Versão estimada 3.1/3.2.
- Cycles obrigatório (vidro dentro de vidro). Light Paths Total 3, caustics refletivas e refrativas desligadas, 300-500 amostras.
- **Grid** (Size 1×9, Vertices 9×22) → **Triangulate**. Deslocamento FORA do GN: **Displace modifier** com textura Clouds, coordenadas **Local Object = um Empty**. Animar a rotação do Empty (360° = loop) move o relevo sem animar o GN.
- Segundo modificador de GN: **Instance on Points** com Ico Sphere Subdiv 3, raio pequeno + Set Shade Smooth; ramo duplicado para esferas maiores com **Random Value** na Scale (Min elevado = orgânico).
- **Separate Geometry** com Random Value booleano (Probability) para "expor" só algumas esferas grandes.
- Linhas: **Mesh to Curve → Curve to Mesh** com **Curve Circle** Radius 0.002-0.003 (o "plexus").
- Três **Set Material**: fio metálico escuro pouco rugoso; esferas pequenas "metal claro" com brilho; esferas grandes vidro (Transmission 1, Roughness 0).
- Brilho seletivo: **Layer Weight (Facing)** → Color Ramp → Emission vermelha; misturado por Mix Shader cujo fator vem de **Object Info Random** → Color Ramp **Constant** (só algumas esferas acendem). Strength final ~300.
- Luz: Area Disk azul atrás, 2000-3000 W (depois baixa para 1000), outra por baixo. World preto, plano de fundo escuro. Câmera inclinada (dutch) + **DOF** bem raso. Compositor: Glare **Fog Glow**. Composição final com cópias da estrutura (Alt+D) em escalas diferentes.

#### A5. The New Way to Make Abstract models in Geometry Nodes
- Canal: Ducky 3D · https://youtu.be/9Y-GyKBv_GU · **Nota 3** · Versão 3.3 alpha (experimental na época).
- **Volume Cube → Volume to Mesh**; a forma sai da Density ← Color Ramp ← textura. **[5.2 ⚠]** confirmar o nó por sonda.
- Voronoi Distance → ramp → Density, Scale 1: blob low-poly. Resolução 60-90 (clicar e arrastar). Subdivide Mesh piora; o caminho é subir a resolução + Set Shade Smooth.
- Voronoi em **Distance to Edge**: escultura celular. Musgrave Scale 1 **[5.2 ⚠ → Noise com noise_type]**: cubo erodido.
- Noise 4D Scale 1.5, Detail 0, animar W: "líquido" dentro do cubo. Brick Texture: tijolos chanfrados.
- Mexer no **Min** do cubo alonga a peça. Voronoi sobre noise + ramp invertido: esferas.
- Uso: objetos escultóricos para loop abstrato ou "herói" de uma peça de marca.

#### A6. Easy Motion Graphics Setup with Geometry Nodes | Bouncing Rays
- Canal: Bouncing Rays · https://youtu.be/evxRGwtqYrM · **Nota 5** · Versão estimada 4.x.
- Peça base: cubo achatado em X/Y, aplica escala, bevel nas arestas verticais com **Clamp Overlap** e 15 segmentos, Merge by Distance, bevel das faces com 10 segmentos, shade smooth: um **retângulo arredondado** tipo "botão".
- GN: **Grid** 10×10 vértices → **Transform** (Z 0.5, Rotation Y 90°, fica de pé) → **Mesh to Points** modo **Faces** + segundo Mesh to Points modo **Vertices** deslocado em X 0.05 (preenche os vãos sem colidir na rotação) → **Join Geometry** → **Instance on Points** (Scale 0.11).
- **Translate Instances**: Noise 4D com W = driver `#frame/50`, Scale 2.5 → Color Ramp (contraste) → **Map Range** 0..1 → 0..5 → Combine XYZ (só X, ou Y, ou Z).
- **Rotate Instances**: mesmo sinal → Math **To Radians** (máx. 180° ou 90°). Lembrete dele: rotação em GN é radiano.
- Alternativa de motor: **Geometry Proximity** até um objeto de texto (ex.: o número "5"), Object Info em **Relative**, Distance → Color Ramp invertido. Só as peças perto do texto se mexem. Resolução do efeito = resolução do Grid.
- Cor: shader com **Object Info Random** → Color Ramp **Constant** com 4 paradas distribuídas por igual, hex de uma paleta do Coolors.
- Uso declarado: fundos de motion e **transições** de vídeo (a intro dele é uma transição com isso).

### Bloco B: revelação de logo

#### B1. Volumetric Logo Reveal Animation in 5 minutes | Blender EEVEE
- Canal: Motion Dreams · https://youtu.be/4ItYQW0Bp9U · **Nota 4** · Versão estimada 3.x (EEVEE legado: contact shadows, tile size).
- SVG importado (add-on Scalable Vector Graphics), curvas unidas (Ctrl+J), origem no cursor, Extrude na curva, converte para mesh.
- Placa: plano + **Solidify** (Offset 0) + **Boolean** com o logo → recorte vazado. Rotaciona 90° para a frente.
- Câmera **24 mm**. **Spot** ATRÁS do recorte, Power ~2000 W, Blend alto, Radius 0 (feixes mais contrastados). Câmera com rotação animada.
- Névoa: cubo grande com **Principled Volume** Density 0.1; Volumetric Shadows ligado; fim do volume = distância medida até a câmera. Custom Distance da luz ~7.
- Névoa viva: Noise (coordenadas Object) → Color Ramp (contraste) × segundo Noise de escala maior → × número baixo → Density. Noise 4D com W = `#frame/100`.
- Poeira: partículas em volume (start/end 0, lifetime 100, gravidade 0, velocidade baixa), esferas metálicas.
- Compositor: luz renderizada BRANCA e colorida depois (Mix Multiply), Exposure, **dois Glare**, Lens Distortion com Dispersion, Box Mask como letterbox.

#### B2. Volumetric Logo Reveal Animation in Blender 5.0
- Canal: Motion Dreams · https://youtu.be/_BJgmrTohpw · **Nota 5** · Versão **5.0 beta** (a mais próxima do 5.2).
- Mesma lógica: logo SVG extrudado MAIS GROSSO que a caixa; duplicado de backup; **Boolean** num cubo fino escalado em X/Z.
- Câmera: rotação zerada, X 90°, recua em Y. World preto. **Spot** Power ~1000 W, X 90°, Show Cone, cobrindo o logo.
- Cubo de volume envolvendo tudo, Principled Volume, Density **0.1**. Render: **Volumetric Shadows** + seção Volume com **Custom Range**: fim = 9.5 m (distância câmera-luz medida ~9 m). Ajustar o range ANTES de subir resolução.
- Animação: 96 quadros, spot de um lado (q1) ao outro (q96), interpolação **Linear**. Blend do spot alto para queda suave.
- Polimento: **Anisotropy** do volume para cima (empurra a névoa para a luz), Custom Distance, Radius pequeno na luz, roughness da caixa controla o brilho das bordas.
- Bug do 5.0 beta: volume às vezes não atualiza no viewport; sair e voltar da câmera resolve.
- Compositor 5.0: grupos prontos; Glare **Bloom** High Quality, threshold alto, Strength ~10 e reduz; segundo Bloom com threshold e size maiores; terceiro Glare em **Streaks** sutil; cita o tipo **Sun Beams**; grupo de ajuste de imagem + aberração cromática.
- Névoa animada: Noise 4D, W = `#frame/200`, contraste no ramp.

#### B3. Advanced Cloth Tearing Logo Reveal Animation | Almost Procedural
- Canal: Motion Dreams · https://youtu.be/7zUmZQ0G2lI · **Nota 4** · Versão estimada 2.93/3.x (EEVEE bloom pass). **[5.2 ⚠]** partículas legadas e bloom.
- Plano subdividido 10× + Subdivision **Simple** 1. Sistema de partículas como "guia": start=end=1, lifetime > animação, Physics **None**, display Point, **Use Modifier Stack** ligado.
- Textura de imagem do logo (branco no fundo preto), mapeamento UV, influência só em **Density**: partículas só onde o logo está.
- **Explode modifier** com **Cut Edges**: o plano quebra em pedaços seguindo as partículas.
- **Cloth** com massa reduzida; grupo de vértices "pin" com tudo atribuído; **Vertex Weight Proximity** ANTES do cloth: alvo = Empty esfera animado (fora do plano no q1 até cobrir no q95), modo Geometry, Lowest/Highest ~1.5, influência da textura do logo em UV. Cloth > Shape > Pin Group = pin.
- Gravidade negativa (peças sobem) + **Wind** forte com Noise. Bake do cache.
- Câmera 1 com **Child Of** o Empty (segue a revelação). Câmera 2 trocada por marcador (Ctrl+B na timeline) com zoom lento; foco animado de perto até o logo (rack focus).
- Look: world preto, Sun por trás (contraluz nos pedaços), Area de preenchimento; azul muito escuro com Noise de escala grande variando cor e roughness; **Backfacing** (Geometry) dá azul mais claro no verso; luz perto da câmera pega pedaços desfocados.
- Compositor: brilho, RGB Curves, Lens Distortion + Dispersion, Ellipse Mask borrada (vinheta), Box Mask (letterbox), parâmetros keyframed por plano. 120 quadros, motion blur.

#### B4. Create COOL Reveal Animation In Blender
- Canal: Super Normals · https://youtu.be/Fz3Blrql--I · **Nota 4** · Versão estimada 3.x.
- SVG → Extrude (Alt para todas as curvas) → mesh → **Remesh Sharp** (voxel até o logo reaparecer; Scale 0.968 [interpretado]) + **Bevel** 2 segmentos com ângulo limite ~70° [interpretado]. Copy Modifiers para as outras partes.
- GN: **Split Edges → Scale Elements** (cada face escala sozinha).
- Varredura por Empty: Object Info (Empty, **Relative**) e **Position** → Vector Math **SUBTRACT** → **DOT PRODUCT** com vetor de direção (um componente = 1) → **Clamp** (máx. 3.5; trocar o sinal inverte a direção) → Scale.
- Desmoronar com queda: **Set Position** com Offset = **Normal** × **Map Range**(dot; From Min −3, To Min 1, To Max 0) × Combine XYZ (0,1,1) para mover só em Y/Z.
- Outras partes entram por **Join Geometry** (Relative). Depois do GN, **Solidify**: parece logo montado por "tijolos".
- Material via **Set Material** dentro do GN: **Glass BSDF** azul, roughness baixa. Cycles GPU. Fundo: plano a 90° com textura; World Strength 0; Areas de recorte e uma frente.
- Truque de câmera: como o efeito é em espaço de mundo, NÃO gira o logo; parenteia câmera + luzes + fundo num Círculo e gira o círculo (360° até q70, total 160). Empty animado revela a 45°, desacelerando no fim.

#### B5. Logo Reveal Animations – Blender VFX Tutorial
- Canal: Sina Sinaie · https://youtu.be/X1c31MQ3fWU · **Nota 5** · Versão estimada 3.x. Um setup, muitas variações.
- Fatiar sem destruir: cubo com **Boolean INTERSECT** apontando para o modelo original (oculto), duplica com Shift+D e desloca até cobrir tudo. Fatias em uma coleção.
- Plano "animador" com location keyframed de uma ponta à outra do modelo (oculto no render).
- GN: **Collection Info** (Relative, **Separate Children** ligado) → **Translate Instances** → **Rotate Instances** → **Scale Instances**, com **Local Space desligado** em translate e rotate.
- Sinal por fatia: Position − Object Info(plano, Relative) (**SUBTRACT**) → **DOT PRODUCT** (direção +X).
- **Map Range** com Clamp (limiar atrás e à frente do plano) → Math **POWER** (curva de easing) → Math **SUBTRACT** (1 − x, inverte para crescer ao chegar) → Combine XYZ (liga/desliga eixos) → Scale.
- Rotação: Math MULTIPLY por **pi** (meia volta, em radianos) → Combine X → Rotation. Translação: mesmos dois nós duplicados → Translation.
- Combinar escala + rotação + translação dá dezenas de revelações com o MESMO grafo.

#### B6. Cinematic Logo Reveal Animation Blender Tutorial
- Canal: Ducky 3D · https://youtu.be/S5fzOc0yBJI · **Nota 5** · Versão estimada 3.0/3.1 (Auto Smooth, Alpha Blend). **[5.2 ⚠]** ver tabela.
- Duas cópias do SVG: (1) contorno: Fill Mode **None**, Bevel Depth **0.05**, fica visível antes de crescer; (2) corpo: Extrude bem fino (0.003 ou 0.03 [interpretado]), contorno levemente à frente.
- Corpo em mesh → **Remesh Sharp**, Remove Disconnected desligado, Octree Depth 8 (quads limpos para deslocar).
- Crescimento no shader: Mix Shader (Principled metálico cinza-médio ↔ **Transparent BSDF**). Fator: **Gradient Texture** (coordenadas Object via Mapping) → Color Ramp, com um **Noise** na frente para a borda ficar orgânica [interpretado]. Animar a **Location X do Mapping** = revelação.
- Relevo: Cycles com Displacement "Displacement and Bump", nó Displacement Scale 0.002-0.01, Subdivision Surface render 2.
- Contorno incandescente: Noise → Color Ramp → **Emission**, cor vermelho/laranja ("red hot"), Strength final ~80.
- Tempo: revelação q1 → ~q120 com Bézier, segura até ~q140 (o logo precisa "sentar" na tela).
- Luz: Area **Disk** pequena 352→450 W (look íntimo) + contraluz 1000 W. World preto. Fundo: plano metálico escuro, Point 500-800 W levemente azul (vinheta "fabricada"), **Bump ← Voronoi Manhattan** (Color) = textura sci-fi.
- Cycles 300 amostras SEM denoise (ruído como estética sci-fi). Compositor: Glare **Fog Glow**, ajustar Mix.

#### B7. Particle Flow Logo Animation in Blender (Geometry Nodes)
- Canal: Ducky 3D · https://youtu.be/oC6guqEK9J4 · **Nota 5** · Versão estimada 4.2+ (Glare Bloom).
- SVG importado, escala grande, **aplicar escala** (senão a densidade de pontos sai errada).
- **Distribute Points on Faces** método **Poisson Disk**: Density Max 1000 → 5000 → 20000, Distance Min 0.01 → 0.005.
- Espessura: Set Position com Combine XYZ (Z ← **Random Value**): logo vira "nuvem" com profundidade.
- Dispersão: Set Position Offset = Noise 4D (saída **Color**, Normalize, Scale 1, Detail 5) × Vector Math MULTIPLY. Esse MULTIPLY é animado: alto no q1 → **0 no q200** (Bézier). Partículas espalhadas se assentam no logo.
- Vida extra: W 0 → 0.1 linear no mesmo intervalo (muito sensível).
- Separate Geometry (Random booleano) → esferas (Ico Subdiv 1, escala aleatória, shade smooth) + **Mesh Circle** N-Gon de 6 vértices com rotação aleatória ("purpurina" que pisca na luz).
- Materiais: vermelho Roughness 1; dourado metálico rugoso. Câmera **24 mm**.
- Luz única: Area Disk grande ~500 W, Spread reduzido; World preto + Principled Volume **0.01**; cor da luz = o vermelho do material dessaturado [interpretado]. Cycles 300 amostras + denoise.
- Compositor: Glare **Bloom** com threshold alto (só o metal que reflete direto). 230 quadros (sobra para o logo respirar).

### Bloco C: isométrico / diorama

#### C1. How to make an Isometric Room inside of Blender
- Canal: Twan_Olig · https://youtu.be/mboMae99d_I · **Nota 4** · Versão estimada 3.x.
- Render quadrado **2000×2000**; câmera **ortográfica**, rotação Z **45°**. Cubo escalado até quase tocar as bordas; apagar o vértice do meio = 3 faces (chão + 2 paredes).
- Paredes: **Solidify** (Even Thickness) + **Bevel** com segmentos. Bevel errado = aplicar escala (Ctrl+A).
- Janela: cubo cortador com **Boolean Difference**, display Wire.
- Regra do estilo: **Bevel em todo objeto** (nada de aresta viva); Subdivision Surface em cubos para formas macias; **Array** para gavetas, prateleiras e tábuas do piso (arrays empilhados = piso).
- Madeira procedural: **Wave Texture → Color Ramp** (cor da tábua e do veio).
- Curvas (alças, vapor de café): Bézier/Path com Bevel, pontas com escala reduzida (Alt+S).
- Raio de sol barato: cubo com Principled Volume + **leve Emission** colorida (simula o feixe sem subir amostras).
- Luz: Area 150 W de cima; **Sun força 4 levemente rosa**; Area pequena 20 W amarela no abajur; plano atrás da janela com Emission 30 amarelada.

#### C2. How to Animation your Isometric Room in Blender
- Canal: Twan_Olig · https://youtu.be/K82eGZ2oDrs · **Nota 4** · Versão estimada 3.x.
- Para animar, a câmera VOLTA para perspectiva e para 16:9 (orto é para o still).
- Preparar: juntar as peças de cada móvel (Ctrl+A Visual Geometry to Mesh, depois Ctrl+J), origem dentro do objeto. Duas coleções: "a animar" e "animado" (controle de progresso).
- Base: gira em Z e escala de **0 → 1**, com chave intermediária de **sobre-rotação** (overshoot dá vida).
- Piso em Array: animar o **Count** de 0 até o total (com defasagem entre arrays) + duas chaves de escala para "pipocar".
- Objetos grandes: escala 0 + deslocamento num **eixo só**, sem firula (senão distrai). Objetos pequenos: escala + **giro**. Todos com **defasagem** entre si (entram em cascata).
- Câmeras extras ligadas a marcadores (Bind Camera to Markers); movimento de câmera **Linear** (velocidade constante).
- Luzes **parenteadas** ao objeto com que interagem e Power animado (acendem junto com o objeto).
- Render: Cycles 1920×1080, **100 amostras**, denoise, Max Bounces Total **4**.

### Bloco D: cartoon, brinquedo e produto

#### D1. Blender Factory Animation Tutorial
- Canal: Polygon Runway · https://youtu.be/OhzcCsR_EO0 · **Nota 4** · Versão estimada 3.x (Shade Auto Smooth **[5.2 ⚠]**).
- Trilho: plano em pé com bevel de vértice até virar "estádio", Merge at Center, convertido em **curva** (guia).
- Esteira: placa fina com loop cuts (para dobrar) + **Array** (Relative Offset **1.1**, deixa vão) + **Curve modifier**; **Solidify ACIMA do Curve** na pilha.
- Loop exato: origem alinhada (mediana = metade da largura de uma peça), Location X de 0 até −(Dimension X do array) entre q1 e q120, **Linear**. Uma volta exata = loop sem emenda.
- Caixa: origem na base/aresta; X entra (q1→q15), trecho **Linear** casado com a velocidade da esteira (ajuste fino de ~5 quadros), queda com Z keyframe e handle suavizado no Graph Editor, rotação Y 180° ao cair.
- Fábrica de caixas em loop: Alt+D (dados linkados) + **Make Single User > Object Animation**; desloca as chaves de cada cópia (−40 quadros, cópias no começo e no fim) = fluxo contínuo. 30 fps.
- Buraco no chão: **Boolean** (add-on Bool Tool) num chão extrudado (sólido), normais recalculadas.
- Look "brinquedo, colorido, divertido"; bevel com Harden Normals; **motion blur**; DOF focado na esteira, f-stop ~1; acentos com emissão.

#### D2. Blender 3D Product Animation Tutorial (teclado)
- Canal: Polygon Runway · https://youtu.be/b2aIUHTRKEo · **Nota 4** · Versão estimada 3.x/4.0.
- Teclas: plano com loop cuts 3 e 4 (grade com margem para todas terem o mesmo tamanho), bevel de face cria os vãos, extruda, escala por Individual Origins; Bevel modifier perfil **Arc** + **Harden Normals**; teclas com Bevel 2 + Subdivision 2.
- Letras: UV **Project from View** numa textura com as letras; dados linkados (Ctrl+L) para um unwrap só, depois Make Single User e desloca cada UV.
- Tecla: cinza-escuro sutil, Roughness 0.5, **Noise Scale 100-200 → Bump Strength 0.1-0.2** (micro-textura de plástico). Tecla Alt: laranja um pouco mais brilhante.
- Fundo "pó de latão": Noise → Color Ramp comprimido (máscara de pintinhas) → Mix Color (preto ↔ latão); a máscara vai em **Metallic** e, invertida, em **Roughness**. Base do teclado preta, roughness ~0.
- Luz: Area 1500 W atrás + duplicatas de 500 W caçando **reflexos**. Lição: em produto, o que vende são os reflexos.
- Animação conceitual: o teclado É os atalhos do Blender. Tecla S afunda (q1→q10, handles Free, descida brusca, subida macia) → teclado escala 1→**1.2** (q12→q30) com interpolação **BOUNCE**; Alt+S desfaz; R gira **360°** em Z com **antecipação** (recua antes).
- Câmera 1 com X Linear q1→q80; corte para câmera 2 no q70 (marcador), Y Linear até q140.
- **Faixa de luz passando**: Area Rectangle fina, 500 W, colorida, cruza em X perto do q120 (Bézier íngreme); cópia defasada = dois flashes. 1600×1200, 30 fps, 140 quadros, Cycles 128 amostras GPU + denoise, motion blur.

#### D3. 3D Cartoon Sneakers Full Blender Tutorial
- Canal: Polygon Runway · https://youtu.be/goJ0eswnqJ8 · **Nota 3** · Versão estimada 2.9/3.0 (EEVEE AO/SSR/bloom **[5.2 ⚠]**).
- Proporção exagerada a partir de um plano (bico estreito, cano alto), Subdivision com loops de apoio onde a forma precisa ser mais "seca".
- Ilhoses: Circle convertido em curva com Bevel Depth, encaixados com snap em face + Align Rotation to Target. Cadarço: vértices extrudados → curva com bevel + subdivision.
- Paleta de ilustração: fundo **azul-violeta**, tênis **verde e azul** vibrantes, **amarelo/laranja** de contraste nos cadarços, sola branca, ilhós metálico.
- Formato **4:3** (Dribbble). Câmera ajustada com add-on IsoCam, mas renderiza em perspectiva.
- Cycles 512 amostras + denoise (OptiX no viewport, OIDN no final). Area 500 → **250 W**; World com cor clara **tingida** para levantar a sombra; look de contraste + Exposure.
- Luz extra rotacionada atrás, colorida, maior (sombra mais macia + reflexo). Lição dele: render costuma sair escuro demais, subir exposição.

#### D4. 3D Product Animation – Microsoft Surface Laptop Animation
- Canal: Motion Nations · https://youtu.be/TbTjYWMtZcY · **Nota 3** · Versão 3.6.
- Produto "riggado" com Empties (tampa com pivô próprio, tudo parenteado a um controle). Cenário com add-on gratuito Biome-Reader (rochas, arbustos, neve).
- Câmera 35 mm, rotação (90, 0, 0). "Água": cubo bem fino, azul-escuro, **Musgrave [5.2 ⚠ → Noise]** → **Bump** (Scale 1.5, Detail 15, ~1.6 [interpretado]), roughness baixa a 0 (reflexo).
- Plano 1 (40 quadros): tampa fechada → abre, notebook sobe e gira; no Graph Editor (Normalize), handles achatados no início (S 0) e esticados no fim: **começa lento, termina rápido**.
- Câmera parenteada a Empty (órbita em Z) + dolly em Y + tilt em Z, mesma curva lento→rápido.
- HDRI (Poly Haven) com Mapping para girar a luz; árvores recoloridas com Principled metálico; céu como imagem em plano **parenteado ao Empty da câmera** (fundo acompanha a órbita); água também parenteada.
- Plano 2: coleção duplicada, chaves apagadas, nova ação **rápido → lento**. Corte no pico de velocidade dos dois = **match cut** invisível (montado no After Effects).
- 32-64 amostras + denoise, look de contraste, PNG RGB 16 bits.

### Bloco E: look 2D em 3D

#### E1. Right way to get the 2D look in 3D Blender!
- Canal: Isaac · https://youtu.be/rjWToAEEcdI · **Nota 3** · Versão 4.0 (inspirado na splash do 4.0, de Gaku Tada, feita em Grease Pencil).
- Método híbrido: modela em 3D, **textura pintada à mão** (Substance Painter, técnica de pincelada), céu como **gradiente pintado** no Photoshop, textura de grama pintada reaproveitada nas lâminas.
- Contorno: **Line Art** de coleção + modificador **Noise** (linha que treme, cara de traço). **[5.2 ⚠]** GP v3.
- Teia de aranha em Grease Pencil desenhada sobre superfície (Stroke Placement: Surface).
- Animação: formas parenteadas por origem (sem armature), **Lattice** nas nuvens (empurrar pontos = nuvem mudando), Empty para deriva; shape keys recomendadas.
- Grama com **wiggle bones**; vento com modificador **Noise no Graph Editor** em vez de chave por chave. Riggar ANTES de espalhar a grama.
- Pós e som no fim. Nota 3: depende de pintura manual, não é montável só por script; vale pelo vocabulário do estilo.

---

## 2. Mundos visuais extraídos (fichas)

Cada ficha é um "mundo" que o diretor pode escolher. Valores vêm dos vídeos; o que não vem leva marcação.

### M1. Pulso Monocromático (instâncias que respiram)
- **Origem:** A1 (Ducky, NyUJ).
- **Paleta:** uma cor só, clara e fria (azul-claro) em tudo: instâncias e fundo. Variação vem da luz.
- **Material:** Principled simples, sem textura. Instância = objeto real com Bevel (segmentos 2-3) + shade smooth.
- **Luz:** 2 Areas opostas, 300 W e 500 W, grandes (sombra macia).
- **Câmera:** frontal, **85 mm** (achata, cara de produto).
- **Movimento:** escala por Noise 4D com loop de dois noises, 250 quadros (≈10 s a 24 fps); preto do ramp acima de zero.
- **Render:** Cycles 150 amostras + denoise.
- **Usar em:** fundo de marca, vinheta de tecnologia limpa, abertura de apresentação, "respiro" entre cenas, conteúdo de loop para redes.
- **Não usar:** quando precisa contar algo (não tem narrativa), ou para marca quente/artesanal.

### M2. Fitas Doces sobre Madeira (noodles SSS ortográfico)
- **Origem:** A2 (Ducky, agNT).
- **Paleta:** rosa saturado (fitas) sobre madeira clara pintada. Duas famílias: doce + natural.
- **Material:** Subsurface Weight 1, Subsurface Scale alto, rosa; madeira PBR (cor/rugosidade/normal) ou procedural (Wave → Ramp, de C1).
- **Luz:** um Disk gigante de cima, 8000-10000 W + plano de rebote com Base Color Value 5.
- **Câmera:** **ortográfica**, ângulo alto (quase planta). Gráfico, sem perspectiva.
- **Movimento:** ondas que correm ao longo das fitas (Noise 4D esticado por Divide), loop 250 quadros, ramp Ease.
- **Render:** Cycles 150 amostras + denoise com passes; AgX Punchy, gamma levemente abaixo.
- **Usar em:** cosmético, confeitaria, moda, bem-estar, música/áudio (ondas), qualquer marca "tátil e alegre".
- **Não usar:** finanças sóbrias, jurídico, saúde regulamentada (lúdico demais).

### M3. Enxame Orgânico (partículas em volume com SSS)
- **Origem:** A3 (Ducky, eBNo).
- **Paleta:** rosa dominante + cáqui/"pele" + toques de preto. Quente e carnal.
- **Material:** SSS Weight 1, Radius (1,1,1), Scale ~2, Roughness 0; cor vinda de atributo de instância (cor trava com o movimento).
- **Luz:** Disk único 1000 W quente, lateral, Spread ~90°; World preto + Principled Volume fraco no World.
- **Câmera:** frontal, enquadra a esfera de partículas cheia.
- **Movimento:** fluxo contínuo pelo Noise 4D (Color, Distortion 2), loop de dois noises.
- **Render:** Cycles 300 amostras + denoise. Pesado (muitas instâncias): densidade baixa para prévia.
- **Usar em:** beleza, skincare, biotecnologia "suave", fundo de música, abertura de podcast.
- **Não usar:** quando a marca precisa de clareza de forma (a peça é textura, não objeto).

### M4. Plexus Microscópico (células de vidro + rede)
- **Origem:** A4 (Ducky, ePIG).
- **Paleta:** fundo quase preto, contraluz **azul**, pontos de emissão **vermelha** aleatórios, vidro neutro, fio metálico escuro.
- **Material:** vidro (Transmission Weight 1, Roughness 0); metal claro com Layer Weight Facing → Emission (borda acende) em só parte das esferas (Object Info Random + ramp Constant); fio metálico.
- **Luz:** Disk azul atrás 1000-3000 W + uma por baixo; World preto.
- **Câmera:** inclinada (dutch), DOF bem raso (f-stop baixo, depois abre um pouco).
- **Movimento:** relevo anima girando o Empty que dá coordenada à textura do Displace (360° = loop).
- **Render:** Cycles (vidro dentro de vidro), Total bounces 3, caustics off, 300-500 amostras; Glare Fog Glow.
- **Usar em:** saúde/biotech, ciência, IA/dados, "conexão", cibersegurança, rede de parceiros.
- **Não usar:** varejo popular ou alimento (frio e clínico); profissão regulamentada de saúde pede cuidado com promessa visual.

### M5. Mosaico de Botões (grade de instâncias reativa)
- **Origem:** A6 (Bouncing Rays).
- **Paleta:** 4 cores de uma paleta de designer (Coolors), sorteadas por instância com ramp Constant. Troca de paleta = troca de marca.
- **Material:** Principled simples por instância (Object Info Random).
- **Luz:** não detalhada no vídeo [lacuna]. Ponto de partida: luz suave frontal + World claro [conhecimento geral].
- **Câmera:** frontal, grade de pé enchendo o quadro.
- **Movimento:** ondas de translação/rotação por Noise 4D (`#frame/50`) OU reação de proximidade a um objeto (texto, logo, produto) que passa pela grade.
- **Render:** não informado; geometria simples roda bem em EEVEE [conhecimento geral].
- **Usar em:** **transições** entre cenas, fundos de UI/SaaS, apps, fintech jovem, revelação de número/preço (o texto "empurra" os botões).
- **Não usar:** luxo (lembra interface), marcas orgânicas.

### M6. Escultura de Volume (blob procedural)
- **Origem:** A5 (Ducky, 9Y-G).
- **Paleta:** não definida no vídeo [lacuna]; peça escultórica aceita metal, cerâmica ou cor sólida.
- **Material:** não definido [lacuna].
- **Movimento:** "líquido" pelo W do Noise 4D; ou forma estática com câmera passando por dentro.
- **Usar em:** objeto-herói abstrato para marca de arte, arquitetura, perfume, NFT/arte digital.
- **Não usar:** antes de confirmar `Volume Cube` no 5.2 por sonda.

### M7. Luz Através do Logo (revelação volumétrica)
- **Origem:** B1, B2 (Motion Dreams).
- **Paleta:** preto absoluto + feixe; a luz é renderizada BRANCA e tingida no compositor (uma render, várias cores de marca).
- **Material:** placa recortada com roughness controlando o brilho das bordas; névoa Principled Volume Density 0.1 com noise animado; poeira metálica.
- **Luz:** Spot atrás do recorte, 1000-2000 W, Blend alto, Radius 0-baixo, Custom Distance ~7.
- **Câmera:** 24 mm (B1) ou frontal reta (B2); rotação lenta de câmera ou a luz varrendo (q1→q96, Linear).
- **Render:** EEVEE com Volumetric Shadows, Custom Range = distância câmera-luz (+0.5 m), tile pequeno e amostras altas no final.
- **Pós:** 2-3 Glare (Bloom alto threshold, Bloom maior, Streaks sutil), Lens Distortion/Dispersion, letterbox, aberração cromática.
- **Usar em:** abertura institucional, trailer de evento, lançamento, canal de YouTube, cinema/entretenimento, games.
- **Não usar:** marca clara e alegre (é dramático e noturno); excesso de uso vira clichê de intro.

### M8. Metal Incandescente (logo que cresce)
- **Origem:** B6 (Ducky, S5fz).
- **Paleta:** cinza-metal médio, borda **vermelho/laranja incandescente**, fundo metálico escuro com vinheta levemente azul.
- **Material:** metal ↔ Transparent por gradiente + noise (Mapping X animado); Displacement fino 0.002-0.01; contorno curva Bevel Depth 0.05 com Emission ~80.
- **Luz:** Disk pequeno 350-450 W (íntimo) + contraluz 1000 W; Point 500-800 W azulado no fundo; bump de Voronoi **Manhattan** no fundo.
- **Câmera:** frontal.
- **Movimento:** crescimento orgânico ~5 s (q1→q120) e pausa de ~1 s.
- **Render:** Cycles 300 amostras, ruído assumido (sem denoise); Glare Fog Glow.
- **Usar em:** indústria, metalurgia, automotivo, games, academia/força, marca "forjada", barbearia premium.
- **Não usar:** marca delicada, infantil, saúde.

### M9. Montagem por Peças (logo de tijolos/fatias)
- **Origem:** B4 (Super Normals), B5 (Sina Sinaie).
- **Paleta:** B4 vidro azul em fundo escuro texturizado; B5 neutra (o look vem do material escolhido).
- **Material:** Glass BSDF azul roughness baixa (B4); qualquer (B5).
- **Luz:** Areas de recorte + frontal; World Strength 0.
- **Câmera:** câmera + luzes + fundo girando juntos num pai (o logo fica parado porque o efeito é em espaço de mundo).
- **Movimento:** varredura por Empty/plano: cada face/fatia escala, gira (π) ou desliza conforme a distância ao plano, com easing por POWER.
- **Render:** Cycles (vidro).
- **Usar em:** construtora, engenharia, tecnologia, educação ("construir"), consultoria, revelação de produto modular.
- **Não usar:** logo muito fino ou script (fatias somem); marca orgânica.

### M10. Purpurina que Pousa (partículas formando o logo)
- **Origem:** B7 (Ducky, oC6g).
- **Paleta:** **vermelho fosco + dourado metálico**, fundo preto com névoa 0.01.
- **Material:** esferas vermelhas Roughness 1; discos hexagonais dourados metálicos rugosos com rotação aleatória (piscam).
- **Luz:** um Disk grande ~500 W, Spread fechado, cor do vermelho dessaturado [interpretado].
- **Câmera:** 24 mm.
- **Movimento:** força do deslocamento animada de alto para 0 (q1→q200, Bézier) + W 0→0.1 linear: caos que se organiza em marca.
- **Render:** Cycles 300 amostras + denoise; Glare Bloom com threshold alto.
- **Usar em:** joias, perfume, Natal/datas, bebida premium, evento de gala, cosméticos de luxo.
- **Não usar:** marca minimalista ou fria; tecnologia B2B.

### M11. Tecido Rasgado (revelação por simulação)
- **Origem:** B3 (Motion Dreams, 7zUm).
- **Paleta:** azul muito escuro com verso um pouco mais claro; fundo preto; contraluz.
- **Material:** noise de escala grande variando cor e roughness; Backfacing troca a cor do verso; camada de baixo com imagem.
- **Luz:** Sun por trás + Area de preenchimento + luz perto da câmera (pedaços desfocados brilham).
- **Câmera:** duas câmeras (uma presa ao Empty que revela, outra com zoom lento e rack focus), motion blur.
- **Render:** EEVEE (o vídeo); pós com vinheta, letterbox, dispersão.
- **Usar em:** moda, têxtil, lançamento "unveil", cinema, marca premium que quer ar de evento.
- **Não usar:** sem confirmar partículas/Explode no 5.2; prazos curtos (simulação + bake).

### M12. Diorama Isométrico Aconchegante
- **Origem:** C1, C2 (Twan_Olig).
- **Paleta:** madeira quente, luz de janela amarelada, Sun levemente rosa, abajur amarelo. Aconchego de "loja de filme".
- **Material:** tudo com Bevel (nada vivo); madeira Wave → Ramp; formas macias por Subdivision; vapor com curvas.
- **Luz:** Area 150 W de cima, Sun 4 rosado, Area 20 W amarela localizada, plano de janela Emission 30; feixe de sol fingido com volume + leve emissão.
- **Câmera:** still = **ortográfica** quadrada 2000×2000, Z 45°; animação = perspectiva 16:9 com câmeras em marcadores e movimento Linear. Isométrico "verdadeiro" pede X ≈ 54.736° [conhecimento geral].
- **Movimento:** montagem em cascata: base gira e escala de 0 com overshoot; Array cresce pelo Count; grandes escalam e deslizam num eixo; pequenos escalam e giram; luzes acendem com o objeto.
- **Render:** Cycles 100 amostras, denoise, bounces 4.
- **Usar em:** imobiliária, arquitetura de interiores, café/loja física, escritório, educação, "como funciona" de serviço local, app de casa.
- **Não usar:** peça de impacto rápido em 3 s (montagem pede tempo), marca agressiva.

### M13. Fábrica de Brinquedo (loop mecânico colorido)
- **Origem:** D1 (Polygon Runway).
- **Paleta:** colorida e "funky" de brinquedo (o vídeo não lista as cores) [lacuna]; acentos com emissão.
- **Material:** simples, bevel + Harden Normals.
- **Luz:** não detalhada (timelapse) [lacuna].
- **Câmera:** levemente de cima, DOF focado na esteira, f-stop ~1, motion blur.
- **Movimento:** loop perfeito: esteira com deslocamento = comprimento exato do array; caixas em fila com animações defasadas de −40 quadros; 30 fps, 120 quadros.
- **Usar em:** e-commerce, logística, entrega, SaaS de automação, "processo" de qualquer serviço, fábrica, explicação de pipeline.
- **Não usar:** luxo, saúde.

### M14. Produto Brinquedo com Reflexos (teclado/gadget lúdico)
- **Origem:** D2 (Polygon Runway).
- **Paleta:** cinza-escuro + **laranja de acento** + preto brilhante + fundo preto com pintinhas de latão.
- **Material:** plástico com micro-bump (Noise 100-200, Bump 0.1-0.2, Roughness 0.5); fundo com máscara metal/roughness.
- **Luz:** Area 1500 W + duplicatas 500 W posicionadas pelos reflexos; **faixa de luz colorida cruzando** (rect 500 W).
- **Câmera:** dois planos com corte por marcador, movimentos Linear.
- **Movimento:** ação com personalidade: tecla afunda, objeto escala 1→1.2 com **BOUNCE**, giro de 360° com antecipação.
- **Render:** Cycles 128 amostras + denoise, motion blur, 30 fps, 1600×1200.
- **Usar em:** gadget, eletrônico, app (a "tecla" vira botão do app), loja de tecnologia, periférico gamer.
- **Não usar:** produto que precisa parecer sério e caro (o BOUNCE é piada visual).

### M15. Ilustração Cartoon Vibrante (objeto estilizado)
- **Origem:** D3 (Polygon Runway).
- **Paleta:** complementares saturadas: fundo azul-violeta, objeto verde+azul, acento amarelo/laranja, branco, um metal.
- **Material:** Principled simples por cor; subdivision com loops de apoio (formas infladas).
- **Luz:** Area 250 W + World claro tingido (sombra levantada) + luz colorida atrás; contraste + exposição alta.
- **Câmera:** perspectiva enquadrada como ilustração, **4:3**.
- **Render:** Cycles 512 amostras + denoise (still).
- **Usar em:** ícones e ilustrações de site/app, e-commerce de moda, post de produto lúdico, marca jovem.
- **Não usar:** quando a peça precisa ser fotorrealista.

### M16. Produto na Natureza com Match Cut
- **Origem:** D4 (Motion Nations).
- **Paleta:** a do HDRI e do céu (o vídeo usa "lost city" da Poly Haven e céu do Unsplash), água azul-escura.
- **Material:** água fina com bump de ruído e roughness ~0 (reflexo do produto); vegetação recolorida.
- **Luz:** HDRI com Mapping rotacionado (animável para o produto escurecer/acender na órbita).
- **Câmera:** 35 mm, órbita por Empty + dolly + tilt; fundo de céu parenteado à câmera.
- **Movimento:** **speed ramp**: plano A lento→rápido, plano B rápido→lento, corte no pico = match cut.
- **Render:** Cycles 32-64 amostras + denoise.
- **Usar em:** notebook, celular, outdoor, produto "leve e livre", sustentabilidade, turismo.
- **Não usar:** sem os assets de cenário (o vídeo depende de add-on de biomas e imagens externas).

### M17. Pintura Viva (2D look em 3D)
- **Origem:** E1 (Isaac).
- **Paleta:** a de uma ilustração pintada (referência: splash do 4.0); céu em gradiente pintado.
- **Material:** texturas de pincelada pintadas à mão; Line Art com Noise (traço vivo).
- **Luz:** não detalhada [lacuna].
- **Movimento:** lattice nas nuvens, wiggle bones na grama, Noise no Graph Editor para vento; formas parenteadas.
- **Usar em:** marca autoral, livro, storytelling de marca, ONG, café/artesanal, animação de "manifesto".
- **Não usar:** pipeline 100% por script (pintura manual), prazo curto.

---

## 3. Revelação de logo: as técnicas, passo a passo

Preparo comum a todas (B1, B2, B4, B6, B7):
1. Logo em **SVG** (conversor online se só houver PNG; logo escuro em fundo claro/transparente funciona melhor, segundo B2). Para a técnica de partículas guiadas por imagem (T6), o contrário: **logo branco em fundo preto**.
2. Habilitar o add-on de importação SVG (o vídeo de 5.0 ainda manda ligar em Preferências). Por script: confirmar o nome do módulo no 5.2 por sonda [conhecimento geral].
3. Juntar as curvas (Ctrl+J), origem no centro, **aplicar escala**.
4. Para ter geometria limpa: Extrude na curva → converter em mesh → **Remesh Sharp** (Octree 8 ou voxel até o logo reaparecer) + Bevel leve. Guardar a curva original como backup oculto.

### T1. Luz através do recorte (volumétrica) — B1/B2
1. Logo extrudado mais grosso que a placa; placa = cubo fino (ou plano + Solidify Offset 0).
2. **Boolean Difference** na placa com o logo; aplicar. Ocultar o logo.
3. Câmera frontal (B2) ou 24 mm em ângulo (B1). World preto.
4. **Spot** atrás da placa, 1000-2000 W, Show Cone para mirar, Blend alto, Radius 0-baixo.
5. Cubo de névoa envolvendo tudo: **Principled Volume**, Density 0.1, Anisotropy acima de 0.
6. Render EEVEE: Volumetric Shadows; Custom Range com fim = distância câmera-luz + ~0.5 m.
7. Animação: spot varre de um lado ao outro (96 quadros, Linear) OU câmera gira devagar.
8. Névoa viva: Noise 4D (coords Object, W = `#frame/100` a `/200`) → Ramp de contraste × segundo Noise maior → × valor baixo → Density.
9. Poeira (partículas lentas, gravidade 0, esferas metálicas).
10. Compositor: luz branca tingida com Mix Multiply, Exposure, 2-3 Glare, Lens Distortion + Dispersion, letterbox.

### T2. Crescimento orgânico com borda incandescente — B6
1. Duplicar o SVG: cópia A vira contorno (Fill None, Bevel Depth 0.05); cópia B vira corpo (Extrude fino → mesh → Remesh Sharp).
2. Corpo: Mix Shader entre metal cinza e **Transparent BSDF**; fator = Gradient (coords Object + Mapping) → Ramp, com Noise para a frente da revelação ficar orgânica.
3. Keyframe na **Location X do Mapping**: q1 escondido → q120 revelado, segurar até q140.
4. (Cycles) Displacement 0.002-0.01 + Subdivision 2 para relevo.
5. Contorno: Emission por Noise → Ramp, vermelho/laranja, Strength alto (~80).
6. Luz íntima (Disk pequeno ~450 W + contraluz 1000 W), fundo metálico com Voronoi Manhattan no bump.
7. Glare Fog Glow.

### T3. Montagem por faces com varredura de Empty — B4
1. Logo mesh limpo → modificador GN.
2. **Split Edges → Scale Elements** (faces independentes).
3. Object Info (Empty, Relative) e Position → SUBTRACT → DOT PRODUCT com direção → **Clamp** (±3.5) → Scale.
4. **Set Position**: Offset = Normal × Map Range(dot; From Min −3, To Min 1, To Max 0) × Combine(0,1,1).
5. Join Geometry com as outras partes; Set Material (vidro azul) dentro do GN; Solidify depois.
6. Animar o Empty atravessando o logo (ex.: a 45°, desacelerando no fim).
7. Girar o MUNDO (câmera, luzes e fundo parenteados num círculo), não o logo.

### T4. Fatias que giram, escalam ou deslizam — B5
1. Cubos com **Boolean Intersect** apontando para o modelo original (oculto), duplicados lado a lado até cobrir.
2. Coleção das fatias → GN: Collection Info (Relative, Separate Children) → Translate → Rotate → Scale Instances (Local Space desligado).
3. Sinal: (Position − plano animador) DOT (1,0,0) → Map Range clamp → POWER (easing) → 1 − x.
4. Escala: sinal → Combine XYZ (eixos ligados) → Scale. Rotação: sinal × π → Combine X → Rotation. Translação: sinal × distância → Combine eixo → Translation.
5. Plano animador keyframed de uma ponta à outra.
6. Variar os três canais para gerar estilos diferentes com o mesmo grafo (ponto forte anti-mesmice).

### T5. Caos que se organiza (partículas que pousam) — B7
1. Logo em mesh, escala aplicada → Distribute Points on Faces **Poisson** (Density 20000, Distance Min 0.005).
2. Espessura com Random Value em Z.
3. Offset = Noise 4D Color (Normalize, Scale 1, Detail 5) × MULTIPLY (força).
4. Dois tipos de instância (esferas e hexágonos planos) separados por Random booleano; escala e rotação aleatórias.
5. Keyframe na força: alta no q1 → **0 no q200**; W 0 → 0.1 linear.
6. Vermelho fosco + dourado metálico, Disk único, névoa 0.01, Bloom com threshold alto. Deixar ~30 quadros parados no fim.

### T6. Tecido que rasga — B3 (confirmar legado no 5.2)
1. Plano subdividido + partículas-guia por textura do logo (branco no preto, UV, influência Density).
2. Explode modifier com Cut Edges.
3. Grupo "pin" + Vertex Weight Proximity (alvo: Empty esfera animado, distâncias ~1.5, influência da textura do logo) antes do Cloth.
4. Cloth com Pin Group, gravidade negativa, vento forte com noise; bake.
5. Placa de baixo com a arte final; duas câmeras (Child Of + marcador), rack focus.
6. Alternativa [conhecimento geral]: no 5.2, refazer com GN (Split Edges + deslocamento por proximidade de Empty) se o legado falhar.

### T7. Grade que reage ao logo/texto — A6
1. Grade de botões (Grid → Mesh to Points faces + vértices deslocados → Instance on Points).
2. Geometry Proximity até o texto/logo (Relative) → Ramp invertido → Translate (Z) e/ou Rotate.
3. Animar o logo entrando na grade (ou a grade se abrindo onde o logo está). Funciona como revelação e como transição.

### T8. Revelação de produto por speed ramp + match cut — D4
1. Plano A: produto entra com curva lento→rápido (handles achatados no início, esticados no fim).
2. Plano B: outra posição/ângulo com curva rápido→lento.
3. Cortar no pico de velocidade de ambos. A câmera orbita por Empty no mesmo sentido nos dois planos.

---

## 4. Receitas para testar no Blender (montáveis por script)

Regras gerais de script para todas:
- Árvore nova de GN no 5.2: `ng = bpy.data.node_groups.new(nome, 'GeometryNodeTree')` + `ng.interface.new_socket(name="Geometry", in_out='OUTPUT', socket_type='NodeSocketGeometry')` (e INPUT se for usar a malha) [conhecimento geral].
- Mix no GN e no shader: `ShaderNodeMix`, `data_type='RGBA'`; ligar por **nome + tipo** ou índice certo (Factor float = 0, A cor = 6, B cor = 7, saída cor = 2) [conhecimento geral, confirmar em sonda].
- Driver de tempo em socket: `fc = sock.driver_add("default_value"); fc.driver.expression = "frame/100"` (expressão simples, não exige auto-run de script) [conhecimento geral].
- Keyframe em socket de nó: `sock.keyframe_insert("default_value", frame=f)`. A ação fica na **árvore** (`ng.animation_data` ou `mat.node_tree.animation_data`); interpolação via channelbag (verdade 5.2).
- Spread da Area em radianos: `light.spread = math.radians(90)`.
- Cor: manter AgX; só escolher o look (`scene.view_settings.look = 'AgX - Punchy'`).

### R1. Loop perfeito de Noise 4D (base de A1, A2, A3)
- Dois `ShaderNodeTexNoise` idênticos, `noise_dimensions='4D'`, mesmos Scale/Detail/Roughness.
- `ShaderNodeMix` RGBA: A = Noise1.Color, B = Noise2.Color.
- Chaves (frames 0 e 250, LINEAR): Mix.Factor 0 → 1; Noise1.W 0 → V; Noise2.W −V → 0. V = 5 (padrão), 3 (lento), 12 (rápido).
- Cena: `frame_start=0`, `frame_end=249` para não repetir o quadro igual na emenda [conhecimento geral].
- Limite: no meio do loop a mistura de dois ruídos perde contraste; um Color Ramp DEPOIS do Mix compensa em parte [conhecimento geral]. Alternativa sem crossfade: mover a coordenada do Noise 3D num círculo, `Position + (cos t, sin t, 0)·r` [conhecimento geral].

### R2. "Pulso Monocromático" (M1)
1. Objeto real "Peça": cubo 0.2 m, Bevel modifier (Width ~0.02, Segments 3) [valores de bevel: conhecimento geral], shade smooth, oculto no render.
2. Plano "Emissor" com GN: `GeometryNodeMeshCube` (Vertices X/Y/Z = 10, Size ~2) → `GeometryNodeInstanceOnPoints` (Instance ← `GeometryNodeObjectInfo` da Peça, As Instance ligado).
3. Scale ← R1 → `ShaderNodeValToRGB` (preto em ~0.25 de cinza, não 0) → Scale.
4. Segunda árvore igual com Cube menor (cubos internos).
5. Fundo cyclorama: plano 10×10, extrudar uma aresta 5 m em Z, Bevel (segmentos 8).
6. Câmera 85 mm frontal. Areas 300 W e 500 W, tamanho 3-4 m, lados opostos.
7. Material único azul-claro (ex.: `#9CC9F0` [conhecimento geral]) em Peça e fundo.
8. Cycles 150 amostras + denoise, 250 quadros.

### R3. "Fitas Doces" ortográfico (M2)
1. GN: `GeometryNodeMeshLine` Count 30, Offset (0,0,0.3) → `GeometryNodeTransform` Rotation Y 90°, Translation centralizando (−Count·offset/2).
2. `GeometryNodeInstanceOnPoints` com `GeometryNodeCurveQuadraticBezier` (Resolution 100, Start −5, Middle 0, End +5 num eixo), Rotation Z 90°.
3. `GeometryNodeRealizeInstances` → `GeometryNodeSetPosition` Offset = `ShaderNodeCombineXYZ`(Z = Ramp(EASE) ← Noise 4D Detail 0, Scale 0.4, Vector = Position ÷ (1, 8, 1)) × Value 0.6 [divisor e força: interpretado/ajustar].
4. `GeometryNodeCurveToMesh` com `GeometryNodeCurvePrimitiveLine` (Start (0,0,0), End (0.12,0,0)) → ribbon. `GeometryNodeSetMaterial`.
5. Modificadores depois do GN: Solidify (0.03) + Bevel (Segments 4).
6. Material: Base Color rosa, Subsurface Weight 1, Subsurface Scale 0.3-1 (subir até a luz atravessar).
7. Chão: plano com madeira (procedural Wave → Ramp de C1 se não houver PBR baixado).
8. Câmera ORTHO, ângulo alto. Area Disk 6-8 m, 8000-10000 W, para baixo; plano de rebote com Base Color HSV Value 5.
9. AgX Punchy. Loop R1 com V = 12. Prévia Resolution 20, final 100-200.

### R4. "Enxame Orgânico" (M3)
1. GN: `GeometryNodeMeshIcoSphere` (Radius 3, Subdiv 3) → `GeometryNodeMeshToVolume` (Density ~2) → `GeometryNodeDistributePointsInVolume` (densidade ajustar até ~poucos mil pontos na prévia).
2. `GeometryNodeSetPosition` Offset = Noise 4D (Color, `normalize=True`, Detail 0, Scale 0.2-2 [interpretado], Distortion 2) × `ShaderNodeVectorMath` MULTIPLY (força 1-3).
3. `GeometryNodeInstanceOnPoints` (Ico Subdiv 2, Radius 0.03) → `GeometryNodeSetShadeSmooth`.
4. `GeometryNodeStoreNamedAttribute` (`data_type='FLOAT_COLOR'`, `domain='INSTANCE'`, nome "cor") ← mesma cor do Noise → `GeometryNodeSetMaterial`.
5. Shader: `ShaderNodeAttribute` (`attribute_type='INSTANCER'`, "cor") Fac → Noise (Detail 0, Scale 2) → Ramp: cáqui, rosa-claro (dominante), preto → Base Color. Subsurface Weight 1, Radius (1,1,1), Scale 2, Roughness 0.
6. Area Disk 1000 W, cor quente (ou `use_temperature`, ~3500 K [conhecimento geral]), lateral, Spread 90°. World preto + Principled Volume Density ~0.01.
7. Loop R1 (saídas Color) V = 5. Cycles 300 amostras.

### R5. "Plexus" (M4)
1. Plano com GN 1: `GeometryNodeMeshGrid` (Size 1×9, Vertices 9×22) → `GeometryNodeTriangulate`.
2. Displace modifier: textura Clouds, Texture Coordinates = Object (Empty). Strength ~0.5-1 [ajustar].
3. GN 2: Instance on Points (Ico Subdiv 3, raio pequeno) + Shade Smooth; ramo 2 com Separate Geometry (Random booleano, Probability ~0.3) → Instance (raio maior, Random Value Scale min alto); ramo 3: `GeometryNodeMeshToCurve` → `GeometryNodeCurveToMesh` com `GeometryNodeCurvePrimitiveCircle` Radius 0.003.
4. Três Set Material: vidro (Transmission Weight 1, Roughness 0), metal claro com Emission seletiva (Layer Weight Facing → Ramp → Emission vermelha; Mix Shader fac = Object Info Random → Ramp CONSTANT), fio metálico escuro.
5. Empty: rotação Z 0 → 360° em 250 quadros, LINEAR (loop).
6. Cycles: `max_bounces=3`, caustics off, 300 amostras. Area Disk azul 1000-3000 W atrás. DOF f-stop baixo. Glare Fog Glow.

### R6. "Mosaico de Botões" (M5)
1. Peça: retângulo arredondado (cubo 1×0.6×0.1 [proporção: conhecimento geral], bevel arestas verticais 15 seg com clamp overlap, merge by distance).
2. GN: Grid 10×10 vértices → Transform (Z 0.5, Rot Y 90°) → ramo A `GeometryNodeMeshToPoints` mode FACES; ramo B Transform (X 0.05) → Mesh to Points mode VERTICES → Join → Instance on Points (Scale 0.11).
3. Motor 1 (onda): Noise 4D (W driver `frame/50`, Scale 2.5) → Ramp (contraste) → `ShaderNodeMapRange` 0..1 → 0..5 → Combine XYZ (X) → `GeometryNodeTranslateInstances`.
4. Motor 2 (giro): mesmo sinal → `ShaderNodeMath` RADIANS (de 0..180) → Combine → `GeometryNodeRotateInstances`.
5. Motor 3 (reação): `GeometryNodeProximity` Target = Object Info do texto (Relative) → Distance → Ramp invertido → substitui o Noise.
6. Material: Object Info Random → Ramp CONSTANT com 4 cores da marca.

### R7. Revelação volumétrica (T1, EEVEE)
1. Logo extrudado 0.2; placa cubo 4×0.05×3 com Boolean Difference aplicado.
2. Câmera frontal: Rotation (90°,0,0), recuada em −Y ~9 m.
3. World preto. Spot: energy 1000-2000, `spot_blend` ~0.8, `shadow_soft_size` 0-0.05, `use_custom_distance=True`, `cutoff_distance=7` [nomes: conhecimento geral, confirmar].
4. Cubo de volume 12 m: Principled Volume Density 0.1, Anisotropy 0.3-0.6 [valor: conhecimento geral].
5. `scene.eevee.use_volumetric_shadows=True`; range customizado até 9.5 m; final com `volumetric_tile_size='2'` e `volumetric_samples` alto (nomes do `volumetric_*` da verdade; confirmar quais).
6. Spot: location X −3 (q1) → +3 (q96), LINEAR.
7. Névoa: Noise 4D (coords Object, W driver `frame/150`) → Ramp → × Noise 2 → × 0.1 → Density.
8. Compositor (`compositing_node_group`): Mix Multiply com cor da marca, Glare Bloom (threshold alto), Glare Streaks fraco, Lens Distortion (Dispersion ~0.02 [conhecimento geral]), Box Mask letterbox 2.39:1.

### R8. Revelação por fatias (T4)
1. Para N = 12 fatias: cubo cortador de largura L/N com Boolean INTERSECT → modelo; duplicar e deslocar em X. Coleção "Fatias".
2. GN num objeto vazio: Collection Info ("Fatias", Relative, Separate Children) → Translate → Rotate → Scale Instances (Local Space False).
3. Sinal s = MapRange_clamp((Position − Plano.Location)·(1,0,0); From −1..1 → 0..1) → POWER 2 → 1 − s.
4. Scale = Combine(s,s,s); Rotation = Combine(s·π, 0, 0); Translation = Combine(0,0,(1−s)·2) [mistura: escolher por variação].
5. Plano animador: X de −L/2−2 (q1) a +L/2+2 (q90), BEZIER ease-out.

### R9. Logo de purpurina (T5)
1. Logo mesh, escala aplicada. GN: `GeometryNodeDistributePointsOnFaces` (`distribute_method='POISSON'`, Density Max 20000, Distance Min 0.005).
2. Set Position Offset = Combine(0,0,Random −0.05..0.05).
3. Set Position Offset = Noise 4D (Color, Normalize, Scale 1, Detail 5) × MULTIPLY F. Chaves: F = 3 (q1) → 0 (q200), BEZIER; W 0 → 0.1, LINEAR.
4. Separate Geometry (Random booleano ~0.7) → Instance Ico (Subdiv 1, Scale Random 0.3-1.2) + Instance `GeometryNodeMeshCircle` (Vertices 6, `fill_type='NGON'`, Rotation Random).
5. Materiais: vermelho Roughness 1; dourado Metallic 1, Roughness ~0.4.
6. Câmera 24 mm. World preto + Volume 0.01. Area Disk ~500 W, Spread fechado. Glare Bloom threshold alto. 230 quadros.

### R10. Diorama isométrico (M12)
1. Render 2000×2000; câmera ORTHO, Rotation (54.736°, 0, 45°) [X: conhecimento geral; o vídeo só fixa Z 45°].
2. Sala: cubo, apagar o vértice voltado para a câmera → 3 faces; Solidify (Even Thickness) + Bevel (Segments 3).
3. Janela: Boolean Difference com cubo cortador.
4. Piso: tábua + Array (eixo 1) + Array (eixo 2).
5. Madeira: Wave Texture → Ramp (2 marrons).
6. Luz: Area 150 W de cima; Sun strength 4 com cor rosada; Area 20 W amarela; plano de janela Emission 30 amarelado; cubo de feixe com Principled Volume + Emission baixa.
7. Animação (troca para perspectiva 16:9): base Scale 0→1 e Rot Z −90°→+10°→0° (overshoot) em ~20 quadros; Array Count 0→N; objetos com Scale 0→1 + deslocamento num eixo, defasagem 3-5 quadros entre eles [defasagem: conhecimento geral]; luzes com Power 0→alvo.
8. Cycles 100 amostras, denoise, `max_bounces=4`.

### R11. Esteira em loop (M13)
1. Curva guia "estádio" (plano em pé, bevel de vértices, convertido em curva).
2. Peça da esteira com 3-5 loop cuts → Array (Relative Offset X 1.1, Count até fechar) → Solidify → Curve modifier (Solidify acima do Curve na pilha).
3. Medir `dimensions.x` com o Curve desligado; Location X: 0 (q1) → −dimensions.x (q121), LINEAR.
4. Caixa: origem na aresta inferior; X entra q1→q15; trecho LINEAR na velocidade da esteira; queda Z ~q54→q70; Rotation Y 180°.
5. Cópias com dados linkados e ação própria (no script: copiar o objeto e a ação, deslocar todas as chaves em −40 quadros).
6. 30 fps, motion blur, DOF f-stop ~1.

### R12. Produto com reflexo passando (M14)
1. Area principal 1500 W + duas de 500 W posicionadas olhando o REFLEXO na câmera.
2. Faixa: Area `shape='RECTANGLE'`, size 0.1 × 4 m, 500 W, colorida; X de −6 (q100) a +6 (q120), BEZIER íngreme; segunda cópia +8 quadros.
3. Material de plástico: Roughness 0.5 + Noise Scale 150 → Bump Strength 0.15.
4. Ação "toque": objeto escala 1 → 1.2 com interpolação **BOUNCE** (q12→q30); giro 360° Z com antecipação (−15° antes) [ângulo de antecipação: conhecimento geral].
5. Duas câmeras com marcador; movimentos LINEAR. Cycles 128 + denoise, motion blur.

---

## 5. Contribuição pro Cérebro de Diretor

### 5.1 Diagnóstico da mesmice (o que os vídeos revelam)
Metade do acervo (Ducky) roda a mesma receita: plano → GN → Noise 4D → Color Ramp → instâncias →
**World preto + um Disk grande + névoa fraca + Glare**. É bonita, e é exatamente por isso que tudo
converge. Quem só aprende daí faz vídeos iguais. O motor anti-mesmice precisa tratar esse "default
Ducky" como UM mundo entre vários, não como o jeito de fazer.

### 5.2 Os 8 eixos de variação (trocar no mínimo 3 entre peças seguidas)
1. **Gerador de forma:** grade de instâncias (A1, A6) · fitas/curvas (A2) · pontos em volume (A3) · rede plexus (A4) · escultura de volume (A5) · logo em pontos (B7) · fatias (B5) · faces divididas (B4) · cena modelada/diorama (C, D).
2. **Motor do movimento:** Noise 4D em loop · proximidade a um objeto (A6, T7) · varredura por Empty/plano com dot product (B4, B5) · força que vai a zero (B7) · simulação (B3) · keyframe com personalidade (D2: BOUNCE, antecipação) · montagem em cascata (C2) · loop mecânico exato (D1) · speed ramp (D4).
3. **Família de material:** SSS doce (A2, A3) · vidro (A4, B4) · metal + emissão (A4, B6) · fosco + metal dourado (B7) · plástico com micro-bump (D2) · cartoon chapado saturado (D3) · madeira e aconchego (C1) · pintado à mão (E1).
4. **Luz:** Disk único + world preto + névoa (A3, B7) · softbox gigante de cima + rebote (A2) · spot atrás de recorte (B1/B2) · duas Areas laterais (A1) · HDRI (D4) · faixa de luz passando (D2) · luz prática localizada, abajur e janela (C1) · contraluz azul (A4).
5. **Câmera/lente:** ortográfica (A2, C1) · 85 mm (A1) · 35 mm (D4) · 24 mm (B1, B7) · dutch + DOF raso (A4) · câmera presa ao elemento que revela (B3) · mundo girando em volta (B4).
6. **Paleta:** monocromática fria (A1) · rosa + natural (A2) · rosa/cáqui/preto (A3) · preto + azul + vermelho (A4) · paleta de 4 cores de designer (A6) · preto + luz tingida (B1) · metal + laranja incandescente (B6) · vermelho + ouro (B7) · madeira + amarelo + rosa (C1) · complementares saturadas (D3).
7. **Ritmo:** loop de ~10 s (250 q a 24 fps) · revelação de 4-5 s + 1 s de respiro (B6, B7) · plano curto de 40 q com speed ramp (D4) · 140 q a 30 fps com ações em sequência (D2).
8. **Pós:** glare suave · glare + streaks + letterbox + dispersão (cinema) · ruído assumido sem denoise (B6) · limpo e claro (D3, C1) · vinheta por máscara (B3).

Regra prática: duas peças seguidas não repetem o par **(luz, paleta)** nem o par **(gerador, motor)**.

### 5.3 Escolha por briefing (produto/serviço → mundo)
| Briefing | Primeira escolha | Alternativa | Evitar |
|---|---|---|---|
| SaaS, app, fintech jovem | M5 Mosaico | M14 Produto brinquedo | M8, M11 |
| IA, dados, ciência, biotech | M4 Plexus | M9 Fatias | M15 |
| Cosmético, skincare, confeitaria | M2 Fitas doces | M3 Enxame | M8 |
| Joia, perfume, bebida premium, datas | M10 Purpurina | M7 Luz através do logo | M13 |
| Abertura institucional, evento, canal | M7 Volumétrica | M9 Fatias, M11 Tecido | M15 |
| Indústria, automotivo, academia | M8 Metal incandescente | M9 Fatias | M2 |
| Imobiliária, interiores, café, loja física | M12 Diorama | M17 Pintura viva | M4 |
| E-commerce, logística, "como funciona" | M13 Fábrica | M12 Diorama | M7 |
| Gadget, eletrônico | M14 Produto brinquedo | M16 Natureza + match cut | M3 |
| Moda, têxtil | M11 Tecido | M15 Cartoon | M13 |
| Marca autoral, ONG, storytelling | M17 Pintura viva | M12 Diorama | M5 |

Ajuste fino: marca grave e regulamentada puxa para M7/M9 com paleta sóbria; marca jovem puxa para
M2/M5/M14/M15. O design-guide do cliente manda na paleta; o mundo dá luz, câmera e movimento.

### 5.4 Princípios de direção que aparecem em vários vídeos
- **Tingir na pós, não na luz** (B1): renderizar a luz branca e colorir no compositor dá várias versões de cor da marca com um render só.
- **Reflexo vende produto** (D2): posicionar luz olhando o reflexo pela câmera, não a iluminação "geral".
- **Sutileza nos grandes, brincadeira nos pequenos** (C2): objetos grandes entram simples num eixo; os pequenos giram.
- **Overshoot e antecipação** (C2, D2) tiram a cara de "keyframe de IA".
- **Deixar o logo sentar** (B6, B7): 1 s parado no fim.
- **Ruído com intenção** (A2): esticar a textura na direção da forma (Divide no Position) tira a cara de noise genérico.
- **Preto do ramp acima de zero** (A1): variação contida parece mais caro que variação total.
- **Linear para câmera e esteira, Bézier para ação** (C2, D1, D2).
- **Efeito em espaço de mundo → gire o mundo, não o objeto** (B4).

---

## 6. Lacunas

1. **Clay/argila:** nenhum vídeo. Ponto de partida [conhecimento geral], só com sonda antes de virar regra: Principled com Roughness ~0.6-0.8, Subsurface Weight baixo, micro-bump de Noise com escala alta e impressões digitais; animação "on twos" (stepped, interpolação CONSTANT a cada 2 quadros); leve deformação por Noise por quadro.
2. **Toon/cel shading de verdade:** nenhum vídeo usa Shader to RGB + Ramp Constant, Freestyle ou contorno por casca invertida. E1 chega no 2D por pintura e Line Art, não por shader [conhecimento geral: Shader to RGB funciona só no EEVEE].
3. **Low-poly flat, papercraft, neon/cyberpunk, iridescente (Thin Film), tipografia cinética 3D, áudio-reativo:** ausentes (o áudio-reativo só é citado como conteúdo pago do Ducky).
4. **Confirmar no 5.2 por sonda:** `GeometryNodeVolumeCube`; sistema de partículas + Explode; nomes `volumetric_*` e o "custom range" de volume; `use_custom_distance`/`cutoff_distance` da luz; tipos e sockets do Glare; nomes dos grupos prontos do compositor 5.0 ("ajuste de imagem", "aberração cromática"); módulo do importador SVG; "Smooth by Angle".
5. **EEVEE x Cycles no 5.2:** quase todos os looks foram feitos em Cycles (SSS, vidro). Falta medir quais rodam bem no EEVEE novo com raytracing, dado o custo medido (~3 s/quadro em EEVEE 1080×1920 na RTX 3050) contra Cycles de 150-300 amostras.
6. **Luz não documentada:** M5 (Mosaico), M13 (Fábrica) e M17 (Pintura) não têm a luz no vídeo.
7. **Paletas em hex:** só A6 trata paleta como sistema. Os demais citam cores por nome; o catálogo precisa de hex fixos por mundo (decisão de design, não do acervo).
8. **Assets externos:** ambientCG, Poly Haven, Unsplash, add-ons Biome-Reader e IsoCam. Para script offline, preferir procedurais (madeira por Wave, céu por gradiente). Licença de cada asset deve ir para o `CREDITOS.md` quando usado.
9. **Formato vertical (1080×1920):** nenhum vídeo enquadra em 9:16; todos são 16:9, 1:1 ou 4:3. Reenquadrar cada mundo para vertical é trabalho a fazer.
10. **Tempos de render:** nenhum vídeo dá tempo por quadro; só amostras.
