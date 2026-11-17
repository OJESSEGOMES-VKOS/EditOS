# 08. Pós-produção: acabamento, cor, som e tipografia

Este capítulo cobre tudo o que acontece depois que o quadro sai do motor de render: o compositor do Blender 5.2 (brilho, lente, vinheta, grão, nitidez), a correção de cor e o look, o design de som, o texto que vai por cima do 3D e o lugar onde o filme é montado e exportado.

A regra que guia tudo aqui: **a pós não salva um quadro ruim, ela termina um quadro bom.** Se a luz está chapada ou a cor está lavada, volte aos capítulos de luz e de material. A pós entra quando o qa.py do Laboratório já não acusa ESTOURADO, AFUNDADO, LAVADO nem CHAPADO no render cru.

Tudo que está marcado **[confirmado por sonda no bpy 5.2.2]** foi rodado na nuvem com o módulo `bpy` 5.2.2 LTS durante a escrita deste capítulo. Os renders de prova estão em `/home/claude/provas/pos/` e o código em `/home/claude/codigo/pos/`.

---

## 1. Onde a pós entra no fluxo

| Etapa | Onde | O que decide | Ferramenta |
|---|---|---|---|
| 1. Render cru | Blender (Cycles ou EEVEE) | Luz, material, exposição | `bpy`, qa.py |
| 2. Acabamento ótico | Compositor do Blender | Bloom, lente, vinheta, grão, nitidez | `compositor_acabamento.py` |
| 3. Cor e look | View Transform + Look (AgX) e Color Balance | Contraste, temperatura, cor de marca | Blender ou DaVinci Resolve |
| 4. Texto e marca 2D | Resolve, VSE ou CapCut | Legibilidade, zona segura, timing | Este capítulo, seção 6 |
| 5. Som | Resolve (Fairlight) ou DAW | Camadas, sincronia, loudness | `eventos_de_som.py`, `mix_e_loudness.sh` |
| 6. Exportação | Resolve ou ffmpeg | Codec, bitrate, -14 LUFS, -1 dBTP | Seção 7 |
| 7. Controle de qualidade | `qa.py` + `qa_extra.py` | Nota da rubrica, checklist | Capítulo 10 |

**Por quê nessa ordem:** cada etapa depende da anterior. Grão aplicado antes da nitidez vira "areia preta" (testado, seção 3.7). Texto aplicado antes da correção de cor muda de cor junto com o filme. Som cortado antes da montagem final dessincroniza quando um plano muda de tamanho.

**Sinal de que deu errado:** você está corrigindo no compositor algo que é de luz (subindo Gain para salvar um quadro escuro, por exemplo). Volte para a luz.

---

## 2. O compositor do Blender 5.x: o que mudou e como montar por Python

### 2.1 As mudanças que quebram scripts antigos

O Blender 5.0 reestruturou o compositor. Ele passou a ser um **grupo de nós (node group)** que a cena aponta, igual aos Geometry Nodes. As notas de versão resumem: a árvore de composição pode ser reaproveitada, ligada (link) ou anexada (append) entre arquivos, e o nó Composite foi trocado pelo Group Output ([Blender 5.0 release](https://www.blender.org/download/releases/5-0/); [Blender Artists: Group Output no lugar do Composite](https://blenderartists.org/t/why-am-i-getting-group-output-instead-of-composite-node-in-the-compositor/1626301)).

| Antes (4.x) | Agora (5.0 a 5.2) | Status |
|---|---|---|
| `scene.use_nodes = True` e `scene.node_tree` | `scene.compositing_node_group = <CompositorNodeTree>` | [confirmado por sonda no bpy 5.2.2]: `scene.node_tree` não existe |
| Nó `Composite` | `NodeGroupOutput` com um soquete de saída `NodeSocketColor` criado em `ng.interface` | [confirmado por sonda no bpy 5.2.2] |
| Propriedades do nó (`node.glare_type = 'BLOOM'`) | Menus viraram **entradas** (soquetes MENU): `node.inputs["Type"].default_value = "Bloom"` | [confirmado por sonda no bpy 5.2.2] |
| Bloom nas configurações do EEVEE | Removido desde o 4.2; use o nó Glare tipo Bloom ([migração EEVEE 4.2](https://developer.blender.org/docs/release_notes/4.2/eevee_migration/)) | confirmado na doc |
| Nó Texture (legado) | Removido; texturas do Shader Editor (Noise, White Noise, Voronoi, Gradient) entram direto no compositor ([CG Cookie: novidades do 5.0](https://blog.cgcookie.com/posts/everything-new-in-blender-5-0/)) | [confirmado por sonda no bpy 5.2.2] |
| Sun Beams como nó separado | Virou um modo do Glare | [confirmado por sonda no bpy 5.2.2] |
| Vinheta, grão e aberração feitos à mão | Existem como **assets essenciais** (Vignette, Film Grain, Chromatic Aberration, Unsharp Mask, Tune Image, Split Toning, Sensor Noise) | [confirmado por sonda no bpy 5.2.2] |
| VSE sem efeitos de compositor | Modificador de faixa (strip modifier) com compositor no VSE; transições feitas com compositor no 5.2 ([Aras P.: VSE no 5.x](https://aras-p.info/blog/2026/08/18/More-Blender-VSE-tidbits/)) | confirmado em fonte secundária |

Uma pegadinha confirmada pela comunidade: na árvore principal, **só a primeira saída de imagem do Group Output é usada no render**. Saídas extras só funcionam quando a árvore é usada como grupo dentro de outra ([Blender Artists](https://blenderartists.org/t/why-am-i-getting-group-output-instead-of-composite-node-in-the-compositor/1626301)).

### 2.2 Nós disponíveis no 5.2.2 (lista da sonda)

A sonda listou 92 classes `CompositorNode*`. As que importam para comercial:

| Família | Nós (nome da classe Python) |
|---|---|
| Entrada | `CompositorNodeRLayers`, `CompositorNodeImage`, `CompositorNodeRGB`, `CompositorNodeSceneTime`, `CompositorNodeImageCoordinates`, `CompositorNodeImageInfo` |
| Ótica | `CompositorNodeGlare`, `CompositorNodeLensdist`, `CompositorNodeDefocus`, `CompositorNodeBokehBlur`, `CompositorNodeVecBlur` |
| Cor | `CompositorNodeColorBalance`, `CompositorNodeCurveRGB`, `CompositorNodeHueSat`, `CompositorNodeExposure`, `CompositorNodeBrightContrast`, `CompositorNodeColorCorrection`, `CompositorNodeHueCorrect`, `CompositorNodeTonemap`, `CompositorNodeConvertColorSpace`, `CompositorNodeConvertToDisplay` |
| Máscara | `CompositorNodeEllipseMask`, `CompositorNodeBoxMask`, `CompositorNodeCryptomatteV2`, `CompositorNodeIDMask`, `CompositorNodeMaskToSDF` |
| Filtro | `CompositorNodeFilter` (Soften, Box Sharpen, Diamond Sharpen, Laplace, Sobel, Prewitt, Kirsch, Shadow), `CompositorNodeBlur`, `CompositorNodeDenoise`, `CompositorNodeKuwahara`, `CompositorNodeConvolve` |
| Utilidade | `CompositorNodeRelativeToPixel`, `CompositorNodeSwitch`, `CompositorNodeOutputFile`, `CompositorNodeViewer`, `NodeGroupOutput` |
| Nós de shader aceitos | `ShaderNodeMix`, `ShaderNodeMath`, `ShaderNodeMapRange`, `ShaderNodeTexNoise`, `ShaderNodeTexWhiteNoise`, `ShaderNodeTexVoronoi`, `ShaderNodeTexGradient`, `ShaderNodeValToRGB`, `ShaderNodeCombineXYZ`, `ShaderNodeFloatCurve`, `ShaderNodeRGBCurve` |

`FunctionNodeRandomValue` **não** entra no compositor (erro "Cannot add node"). [confirmado por sonda no bpy 5.2.2]

**Não existe nó "Vignette" nem "Film Grain" nativo.** Existem como grupos prontos no arquivo `datafiles/assets/nodes/compositing_nodes_essentials.blend` que vem com o Blender, e aparecem na interface pelo Asset Shelf. Por script, você os anexa com `bpy.data.libraries.load` (seção 3.8). [confirmado por sonda no bpy 5.2.2]

### 2.3 O esqueleto mínimo por Python

```python
# Blender 5.2 | confirmado por sonda no bpy 5.2.2
import bpy
scene = bpy.context.scene
ng = bpy.data.node_groups.new("Acabamento", "CompositorNodeTree")
ng.interface.new_socket("Image", in_out="OUTPUT", socket_type="NodeSocketColor")
rl  = ng.nodes.new("CompositorNodeRLayers"); rl.scene = scene
out = ng.nodes.new("NodeGroupOutput")
ng.links.new(rl.outputs["Image"], out.inputs[0])
scene.compositing_node_group = ng
scene.render.use_compositing = True
```

### 2.4 Pegadinhas da API do 5.2 (todas confirmadas por sonda)

1. **Menus são strings exatas.** Glare: `"Bloom"`, `"Fog Glow"`, `"Streaks"`, `"Ghosts"`, `"Simple Star"`, `"Sun Beams"`, `"Kernel"`. Quality: `"Low"`, `"Medium"`, `"High"`. Filter: `"Box Sharpen"` e `"Diamond Sharpen"` (não "Sharpen"). Color Balance: `"Lift/Gamma/Gain"`, `"White Point"`, `"Offset/Power/Slope (ASC-CDL)"`. Lens Distortion: `"Radial"`, `"Horizontal"`. Blur: `"Tent"`, `"Quadratic"`, `"Cubic"`, `"Gaussian"`, `"Fast Gaussian"`.
2. **Soquetes com nome repetido.** No Color Balance existem duas entradas "Lift": uma VALUE e uma RGBA. O mesmo vale para Gamma, Gain, Offset, Power, Slope, Temperature e Tint. Escolha pelo tipo: `[s for s in node.inputs if s.name == "Lift" and s.type == "VALUE"][0]`.
3. **`ShaderNodeMix` tem 10 entradas com nomes repetidos.** Para modo cor (`data_type = "RGBA"`), as entradas A e B são os índices 6 e 7, e a saída de cor é `outputs[2]`.
4. **Tamanho em pixels.** O Blur recebe Size em pixels (vetor). Para valer em qualquer resolução, converta uma fração com `CompositorNodeRelativeToPixel` (`reference_dimension = "Greater"`).
5. **Para descobrir as opções de um menu**, atribua um valor inválido e leia a mensagem de erro: ela lista as opções válidas. Foi assim que este capítulo levantou as listas acima.

---

## 3. Os efeitos de acabamento

### 3.1 Tabela mestre

| Efeito | Nó no 5.2 | Valor sutil (comercial) | Por quê | Sinal de exagero |
|---|---|---|---|---|
| Brilho (bloom) | Glare, Type "Bloom" | Threshold 1,0; Smoothness 0,1; Strength 0,2 a 0,5; Size 0,4 a 0,6; Quality High | Lente real espalha luz forte. Dá "calor" a reflexos, telas e filetes de luz | Névoa sobre o produto; contraste cai; halo maior que o próprio objeto |
| Distorção de lente | Lens Distortion, "Radial" | Distortion +0,005 a +0,015 (positivo = barril), Fit ligado | Lente real nunca é perfeita; o barril leve tira a "perfeição de CG" | Linhas retas visivelmente curvas; logo ou tela deformados |
| Aberração cromática | Lens Distortion, Dispersion | 0,01 a 0,02 | Franja colorida mínima nas bordas de alto contraste | Franja visível no centro do quadro; texto com borda colorida |
| Vinheta | Ellipse Mask + Blur + Map Range, ou asset "Vignette" | Quinas 12 a 25% mais escuras | Leva o olho para o centro e para o produto | Quinas pretas; "túnel"; fundo claro fica sujo |
| Grão | White Noise animado multiplicando, ou asset "Film Grain" | Amplitude 1,5 a 4% | Quebra o liso digital, esconde banda (banding) em degradês, une 3D e filmagem | Imagem "suja"; compressão do Instagram vira borrões; pontos pretos |
| Nitidez | Filter "Box Sharpen" ou asset "Unsharp Mask" | Box Sharpen 0,04 a 0,10; Unsharp Mask raio 1 a 2 px, fator 0,2 a 0,3 | Recupera o detalhe que o denoise e o AA suavizam | Anel escuro ou claro em bordas (ringing); grão estalando |

### 3.2 Brilho (Glare tipo Bloom)

O manual define o Bloom como "o brilho suave em volta de áreas claras, causado pelo espalhamento de luz nos olhos e nas lentes", e o Fog Glow como "uma versão mais fisicamente precisa do Bloom, mais suave, a um custo maior de computação" ([manual 5.2: Glare, fonte do manual](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/compositing/types/filter/glare.rst)). Size é relativo: "1 faz o efeito cobrir a imagem inteira". Strength acima de 1 reforça o brilho.

Entradas do Glare no 5.2.2 (sonda): Image, Type, Quality, Threshold (padrão 1,0), Smoothness (0,1), Clamp, Maximum (10,0), Strength (1,0), Saturation (1,0), Tint, Size (0,5), Streaks (4), Streaks Angle, Iterations (3), Fade (0,9), Color Modulation (0,25), Diagonal, Sun Position, Jitter, Kernel Data Type, Kernel. Saídas: Image, Glare, Highlights.

**Valores por mundo visual** (os 7 mundos do Laboratório):

| Mundo | Tipo | Threshold | Strength | Size | Observação |
|---|---|---|---|---|---|
| Estúdio premium | Bloom | 1,0 | 0,2 a 0,3 | 0,4 | Quase invisível; só em reflexos |
| Luxo escuro | Fog Glow | 0,8 a 1,0 | 0,4 a 0,6 | 0,5 | Brilho é parte do clima |
| Pop candy | Bloom | 1,0 | 0,3 | 0,5 | Cor saturada já brilha sozinha |
| Vidro e cromo | Bloom | 1,2 | 0,3 a 0,4 | 0,4 | Threshold mais alto evita névoa no vidro |
| Neon noturno | Fog Glow | 0,6 a 0,8 | 0,6 a 0,9 | 0,6 | Único mundo em que brilho forte é intenção |
| Luz natural (persiana) | Bloom | 1,0 | 0,15 a 0,25 | 0,5 | Brilho só na janela |
| Argila | nenhum ou Bloom 0,1 | 1,5 | 0,1 | 0,4 | Argila é fosca; brilho denuncia CG |

**Por quê Threshold 1,0:** o compositor trabalha em luz de cena linear, antes do AgX. Valor acima de 1,0 é "mais claro que branco difuso", ou seja, só reflexo especular, tela emissiva e luz aparecem. Baixar para 0,3 faz o fundo inteiro brilhar (teste "exagero", seção 3.9).

**Streaks e Ghosts** são efeito de lente barata ou de filme de ficção. Em comercial de produto, use só se o briefing pedir "anamórfico" ou "noite". Streaks com 2 raios, ângulo 0 e Fade 0,85 imitam lente anamórfica.

**Sinal de que deu errado:** o qa_extra acusa queda de `contraste_rms` acima de 0,02 depois do bloom, ou o produto perde borda na folha de contato.

### 3.3 Distorção de lente

Entradas no 5.2.2: Image, Type (Radial, Horizontal), Distortion, Dispersion, Jitter, Fit. O manual descreve o Radial como "barril ou almofada (pincushion)" e diz que o Fit "escala a imagem para que as áreas pretas não fiquem visíveis; só funciona com distorção positiva" ([fonte do manual](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/compositing/types/transform/lens_distortion.rst)).

**Sinal do valor, testado:** a sonda passou uma grade colorida por Distortion +0,1 e -0,1. Resultado: **positivo é barril** (o centro incha, as quinas ficam pretas: 8,2% de pixels pretos sem Fit, 3,6% com Fit); **negativo é almofada** (as bordas esticam para fora, sem quina preta). [confirmado por sonda no bpy 5.2.2; script em `/home/claude/codigo/pos/sonda_lens_distortion.py`]

| Lente simulada | Distortion | Fit | Uso |
|---|---|---|---|
| Grande angular 18 a 24 mm | +0,015 a +0,03 | Sim | Plano de ambiente, interior de loja |
| Normal 35 a 50 mm | +0,005 a +0,01 | Sim | Padrão de produto |
| Tele 85 a 135 mm | 0 a -0,005 | Não | Close de produto; tele real quase não distorce |

**Por quê:** distorção zero é uma das marcas do CG. Uma lente real de 35 mm tem barril leve. O valor é tão baixo que ninguém percebe, mas as linhas paralelas deixam de ser "de régua".

**Sinal de exagero:** tela de app ou logo curvados. Regra: se o produto tem linhas retas longas (notebook, embalagem retangular, tela de celular), fique em +0,005 no máximo.

### 3.4 Aberração cromática

Duas formas no 5.2: o campo **Dispersion** do Lens Distortion (0 a 1) e o asset **Chromatic Aberration** (tipos Offset, Scale, Directional Blur, Lens Dispersion; eixo Vertical ou Horizontal; Factor padrão 0,2; Samples 3; Fit). [confirmado por sonda no bpy 5.2.2]

**Valor:** Dispersion 0,01 a 0,02. No teste com 0,012 a 360 x 640 px, a franja apareceu só no filete emissivo, como um contorno ciano e laranja de 1 px. Com 0,08 (teste "exagero"), a franja vira um contorno vermelho e azul visível no produto.

**Por quê:** lente real separa um pouco as cores nas bordas. Pouquinho dá textura ótica; muito vira "efeito de vlog".

**Sinal de exagero:** franja visível no centro do quadro ou em texto. **Regra dura: texto e logo 2D entram depois da aberração**, nunca antes, senão a marca fica com borda colorida.

### 3.5 Vinheta

**Não há nó Vignette nativo** no 5.2.2. Há dois caminhos, ambos testados:

1. **Feito à mão** (controle total, roda em qualquer versão 5.x): Ellipse Mask (Size 1,15 x 1,15, maior que o quadro) → Blur Gaussian com tamanho de 25% da maior dimensão (via Relative To Pixel) → Map Range de [0, 1] para [1 - força, 1] → Mix Multiply sobre a imagem.
2. **Asset "Vignette"** (entradas: Image, Factor 1,0, Feather 0,4, Corner Roundness 1,0, Scale 0,8 x 0,8, Offset, Angle; saídas Image e Mask).

**Valor:** quinas 12 a 25% mais escuras que o centro. No teste, a vinheta manual com força 0,18 levou a diferença "centro menos quinas" de luma de 0,073 (sem compositor) para 0,100. O asset com Factor 0,35, Feather 0,6 e Scale 0,95 chegou a 0,094.

**Por quê:** o olho vai para a área mais clara. A vinheta trabalha a favor do produto no centro e esconde o "fim do mundo" do fundo infinito.

**Sinal de exagero:** diferença centro menos quinas acima de 0,20 (o teste "exagero" deu 0,216); quinas chegando a preto; em fundo branco, a vinheta parece sujeira. **Fundo claro (estúdio premium, pop candy): vinheta 0,08 a 0,12 no máximo.**

### 3.6 Grão

Caminhos testados:

1. **Feito à mão:** `CompositorNodeImageCoordinates` (saída Pixel) → `ShaderNodeTexWhiteNoise` em 4D com W ligado ao Frame do `CompositorNodeSceneTime` (o grão muda a cada quadro) → Map Range de [0, 1] para [1 - a, 1 + a] → Mix Multiply.
2. **Asset "Film Grain"** (autor Selman Vorhoff). Presets: "8 mm Caffenol", "8 mm Home Movie", "Super 8 mm", "16 mm Broadcast", "16 mm Indie Cinema", "35 mm Portra 400", "Super 35 mm", "70 mm Cinema", "Custom". Estilos: "Xpro Sharp", "Cinematic Gritty", "Home Movie", "Studio Broadcast", "Pro Photography", "Cinematic Soft". Entradas: Factor, Animated, ISO 400, Softness, Acutance, Coarseness, Patchiness, Saturation, Luma bias, Texture Scale. [confirmado por sonda no bpy 5.2.2]
3. **Asset "Sensor Noise"**: Luminance Noise 0,1, Chroma Noise 0,05, Animated. Imita sensor digital, não filme.

**Valor:** grão multiplicativo de 1,5 a 4% de amplitude. Por que multiplicativo: somar ruído em luz linear suja as sombras; multiplicar mantém o grão proporcional ao brilho, como o filme.

**Medida no teste:** com amplitude 2,5% e nitidez antes do grão, o `ruido_sigma` do qa_extra ficou em 1,27 (escala 0 a 255). Com 3,5% e nitidez depois do grão, subiu para 2,78. O asset Film Grain ("35 mm Portra 400", Factor 0,35, animado) **suavizou** a imagem: `ruido_sigma` 0,50 e nitidez (variância do Laplaciano) caiu de 94 para 21. O asset tem amaciamento e halação internos. Se usar o asset, baixe Softness para 0,2 a 0,3 e compense com Unsharp Mask. [testar no Blender] a escala exata de Softness.

**Por quê:** o Instagram e o TikTok recomprimem o vídeo. Degradê liso de fundo vira faixas (banding) na compressão; grão fino quebra as faixas. Grão também "cola" o 3D quando o comercial mistura filmagem.

**Sinal de exagero:** grão visível no celular a um braço de distância; pontos pretos (sinal de nitidez depois do grão); arquivo final muito maior que o normal no mesmo bitrate (o codec gasta bits no grão e borra o resto).

### 3.7 Nitidez e a ordem da cadeia

O Filter "Box Sharpen" aceita Factor de 0 a 1. O asset "Unsharp Mask" tem Radius (padrão 8), Factor (0,5) e Threshold (0). [confirmado por sonda no bpy 5.2.2]

**O teste que definiu a ordem:** na primeira versão do script, a nitidez vinha depois do grão. Com grão 0,15 e nitidez 0,8 (teste "exagero"), o resultado foi uma camada de pontos pretos sobre a imagem inteira (`clip_preto` 7,3%, `ruido_sigma` 50). Mesmo com valores sutis, Box Sharpen 0,12 criou um anel escuro em volta do filete emissivo. Duas regras saíram disso:

1. **Nitidez antes do grão, sempre.**
2. **Box Sharpen 0,04 a 0,10.** Se o quadro tem bordas de altíssimo contraste (luz emissiva, cromo), prefira Unsharp Mask com Radius 1,5 a 2 px, Factor 0,2 a 0,3 e Threshold 0,02 a 0,05, porque o Threshold impede que o ruído plano seja reforçado.

**Ordem final recomendada:**

1. Render Layers
2. Glare (Bloom) na luz linear (precisa dos valores acima de 1,0)
3. Lens Distortion (distorção e dispersão)
4. Color Balance e curvas (correção primária)
5. Vinheta
6. Nitidez
7. Grão (sempre por último antes da saída)
8. Group Output

**Por quê:** efeitos óticos acontecem "dentro da lente" (antes do sensor); cor é decisão do colorista; vinheta, nitidez e grão são acabamento do meio (filme ou sensor) e entram por último.

### 3.8 Código: compositor de acabamento (testado)

Arquivo completo: `/home/claude/codigo/pos/compositor_acabamento.py`. Variante com os assets essenciais: `/home/claude/codigo/pos/compositor_assets.py`. Ambos [confirmado por sonda no bpy 5.2.2], com render EEVEE na nuvem a 360 x 640.

```python
# Blender 5.2 | status: confirmado por sonda no bpy 5.2.2 | fonte: manual 5.2 (compositing), notas 5.0
import bpy

PRESET_SUTIL = dict(
    bloom_threshold=1.0, bloom_smooth=0.1, bloom_strength=0.35, bloom_size=0.5,
    distorcao=0.008,      # positivo = barril; Fit esconde a quina preta
    dispersao=0.012,      # aberração cromática 0,01 a 0,02
    lift=0.0, gamma=1.0, gain=1.0,
    vinheta=0.18, vinheta_tam=(1.15, 1.15), vinheta_blur=0.25,
    grao=0.025,           # 2,5% multiplicativo
    nitidez=0.06,         # Box Sharpen
)

def montar(scene, p=PRESET_SUTIL, nome="Acabamento"):
    ng = bpy.data.node_groups.get(nome)
    if ng: bpy.data.node_groups.remove(ng)
    ng = bpy.data.node_groups.new(nome, "CompositorNodeTree")
    ng.interface.new_socket("Image", in_out="OUTPUT", socket_type="NodeSocketColor")
    N, L = ng.nodes, ng.links
    rl = N.new("CompositorNodeRLayers"); rl.scene = scene

    gl = N.new("CompositorNodeGlare")
    gl.inputs["Type"].default_value = "Bloom"
    gl.inputs["Quality"].default_value = "High"
    gl.inputs["Threshold"].default_value = p["bloom_threshold"]
    gl.inputs["Smoothness"].default_value = p["bloom_smooth"]
    gl.inputs["Strength"].default_value = p["bloom_strength"]
    gl.inputs["Size"].default_value = p["bloom_size"]
    L.new(rl.outputs["Image"], gl.inputs["Image"])

    ld = N.new("CompositorNodeLensdist")
    ld.inputs["Type"].default_value = "Radial"
    ld.inputs["Distortion"].default_value = p["distorcao"]
    ld.inputs["Dispersion"].default_value = p["dispersao"]
    ld.inputs["Fit"].default_value = True
    L.new(gl.outputs["Image"], ld.inputs["Image"])

    cb = N.new("CompositorNodeColorBalance")
    cb.inputs["Type"].default_value = "Lift/Gamma/Gain"
    val = lambda n: [s for s in cb.inputs if s.name == n and s.type == "VALUE"][0]
    val("Lift").default_value = p["lift"]
    val("Gamma").default_value = p["gamma"]
    val("Gain").default_value = p["gain"]
    L.new(ld.outputs["Image"], cb.inputs["Image"])

    # vinheta: elipse > blur relativo > map range > multiplica
    el = N.new("CompositorNodeEllipseMask"); el.inputs["Size"].default_value = p["vinheta_tam"]
    rp = N.new("CompositorNodeRelativeToPixel"); rp.data_type = "FLOAT"; rp.reference_dimension = "Greater"
    [s for s in rp.inputs if s.type == "VALUE"][0].default_value = p["vinheta_blur"]
    L.new(rl.outputs["Image"], rp.inputs["Image"])
    bl = N.new("CompositorNodeBlur"); bl.inputs["Type"].default_value = "Gaussian"
    L.new(el.outputs["Mask"], bl.inputs["Image"])
    xy = N.new("ShaderNodeCombineXYZ"); o = [s for s in rp.outputs if s.type == "VALUE"][0]
    L.new(o, xy.inputs["X"]); L.new(o, xy.inputs["Y"]); L.new(xy.outputs["Vector"], bl.inputs["Size"])
    mr = N.new("ShaderNodeMapRange")
    mr.inputs["To Min"].default_value = 1.0 - p["vinheta"]; mr.inputs["To Max"].default_value = 1.0
    L.new(bl.outputs["Image"], mr.inputs["Value"])
    mv = N.new("ShaderNodeMix"); mv.data_type = "RGBA"; mv.blend_type = "MULTIPLY"
    L.new(cb.outputs["Image"], mv.inputs[6]); L.new(mr.outputs["Result"], mv.inputs[7])

    # nitidez ANTES do grão
    sh = N.new("CompositorNodeFilter")
    sh.inputs["Type"].default_value = "Box Sharpen"; sh.inputs["Factor"].default_value = p["nitidez"]
    L.new(mv.outputs[2], sh.inputs["Image"])

    # grão animado multiplicativo
    ic = N.new("CompositorNodeImageCoordinates"); L.new(rl.outputs["Image"], ic.inputs["Image"])
    st = N.new("CompositorNodeSceneTime")
    wn = N.new("ShaderNodeTexWhiteNoise"); wn.noise_dimensions = "4D"
    L.new(ic.outputs["Pixel"], wn.inputs["Vector"]); L.new(st.outputs["Frame"], wn.inputs["W"])
    gm = N.new("ShaderNodeMapRange")
    gm.inputs["To Min"].default_value = 1.0 - p["grao"]; gm.inputs["To Max"].default_value = 1.0 + p["grao"]
    L.new(wn.outputs["Value"], gm.inputs["Value"])
    mg = N.new("ShaderNodeMix"); mg.data_type = "RGBA"; mg.blend_type = "MULTIPLY"
    L.new(sh.outputs["Image"], mg.inputs[6]); L.new(gm.outputs["Result"], mg.inputs[7])

    out = N.new("NodeGroupOutput"); L.new(mg.outputs[2], out.inputs[0])
    scene.compositing_node_group = ng
    scene.render.use_compositing = True
    return ng
```

**Variante com assets** (resumo do que muda): anexar os grupos e usar `CompositorNodeGroup`.

```python
# Blender 5.2 | confirmado por sonda no bpy 5.2.2
import bpy, os
arq = os.path.join(bpy.utils.resource_path("LOCAL"), "datafiles", "assets", "nodes",
                   "compositing_nodes_essentials.blend")
with bpy.data.libraries.load(arq, link=False) as (src, dst):
    dst.node_groups = [n for n in src.node_groups
                       if n in ("Vignette", "Film Grain", "Chromatic Aberration", "Unsharp Mask")]
# depois: n = ng.nodes.new("CompositorNodeGroup"); n.node_tree = bpy.data.node_groups["Film Grain"]
# n.inputs["Preset"].default_value = "35 mm Portra 400"; n.inputs["Animated"].default_value = True
```

Se `resource_path("LOCAL")` não tiver o arquivo (instalação de sistema), o script tenta `resource_path("SYSTEM")`. No Windows o caminho típico é `C:\Program Files\Blender Foundation\Blender 5.2\5.2\datafiles\assets\nodes\` [testar no Blender].

### 3.9 Números do teste

Cena de prova: caixa azul chanfrada (cor base linear 0,05; 0,2; 0,8, que em sRGB é `#3F7CE7`), filete emissivo laranja com força 8, parede quente, duas luzes de área, EEVEE 16 amostras, AgX Medium High Contrast. Folha de contato em `/home/claude/provas/pos/folha_pos.jpg`.

| Versão | clip branco % | contraste RMS | ruído sigma | nitidez (var. Laplaciano, meia res.) | centro menos quinas | Leitura |
|---|---|---|---|---|---|---|
| Sem compositor | 1,25 | 0,133 | 0,76 | 155 | 0,073 | Base |
| Manual, 1ª versão (grão 3,5%, nitidez depois) | 1,30 | 0,134 | 2,78 | 404 | 0,099 | Grão alto demais; anel no filete |
| Manual, 2ª versão (grão 2,5%, nitidez 0,12 antes do grão, distorção -0,005) | 1,30 | 0,133 | 1,27 | 382 | 0,100 | Bom, mas ainda com anel leve no filete |
| **Manual, versão final do script** (nitidez 0,06, distorção +0,008 com Fit) | 1,31 | 0,132 | 1,07 | 125 | 0,099 | **Aprovado como "sutil"** (`com_comp_v3.png`) |
| Assets (Film Grain Portra, Vignette, Unsharp) | 1,24 | 0,131 | 0,50 | 54 | 0,094 | Mais suave e "filme"; perdeu nitidez |
| Exagero (bloom 1,5 / limiar 0,3, dispersão 0,08, vinheta 0,6, grão 0,15, nitidez 0,8) | 1,27 | 0,252 | 50,4 | 9.218 | 0,216 | Reprovado: pontos pretos, franja, túnel |

Leitura do resultado: **acabamento sutil quase não mexe nos números globais** (contraste e clip ficam iguais). Ele aparece no detalhe. Por isso a conferência do acabamento é feita por recorte a 200% (capítulo 10), não pela média.

Tempo: o compositor completo somou cerca de 7 s por quadro no CPU da nuvem a 360 x 640 (68 s com contra 61 s sem). Na RTX 3050 com compositor em GPU, espere bem menos [testar no Blender].

---

## 4. Correção de cor e look

### 4.1 Onde a cor é decidida

A cadeia de cor do Blender 5.2 tem quatro etapas:

1. **Luz de cena linear** (o render, o compositor e o EXR trabalham aqui).
2. **View Transform** (AgX, Standard, Filmic, Khronos PBR Neutral e outros): transforma luz em imagem de tela.
3. **Look**: uma curva de contraste e cor aplicada junto com o View Transform.
4. **Display** (sRGB no celular).

O ponto prático: **o compositor roda antes do AgX.** Um Color Balance no compositor é uma correção "pré tonemapping", o mesmo princípio do fluxo RAW que a CG Cookie recomenda: faça exposição, balanço de branco e saturação antes da transformação e deixe a transformação fazer o resto ([CG Cookie: vibrant colors with AgX](https://blog.cgcookie.com/posts/the-secret-to-rendering-vibrant-colors-with-agx-in-blender-is-the-raw-workflow/)).

O Blender 5.0 [não verificado: versão de entrada; o cap 05 só confirma que existe] também trouxe balanço de branco direto na gestão de cor (`view_settings.use_white_balance`, `white_balance_temperature`, `white_balance_tint`) e um nó Convert Colorspace com espaços como `AgX Base sRGB`, `AgX Log`, `ACEScg`, `ACES 2.0 sRGB`, `Khronos PBR Neutral sRGB`, `Linear Rec.709`, `DaVinci Intermediate WideGamut`. [confirmado por sonda no bpy 5.2.2]

### 4.2 Looks do AgX: medidos no mesmo render

A sonda renderizou a cena de prova **uma vez** e salvou o mesmo resultado com oito combinações de View Transform e Look (`Render Result.save_render` aplica a gestão de cor da cena). Assim a única variável é a transformação.

| View Transform / Look | clip branco % | contraste RMS | faixa p1 a p99 | saturação média | colorfulness (Hasler) | ΔE2000 da cor de marca | Uso |
|---|---|---|---|---|---|---|---|
| AgX / None | 0,00 | 0,115 | 0,67 | 0,112 | 27,1 | 6,6 | Base para gradear fora (Resolve) |
| AgX / Base Contrast | 0,00 | 0,115 | 0,67 | 0,112 | 27,1 | 6,6 | Idêntico ao None (é o padrão) |
| AgX / Punchy | 0,00 | 0,115 | 0,72 | **0,143** | 30,4 | 6,9 | Pop candy, comida, cosmético colorido |
| AgX / Medium High Contrast | 1,25 | 0,133 | 0,74 | 0,129 | 31,6 | 7,2 | **Padrão do estúdio** para produto |
| AgX / High Contrast | 1,35 | **0,149** | 0,79 | 0,138 | 33,5 | 8,3 | Luxo escuro, tecnologia, noite |
| Filmic / None | 0,00 | 0,108 | 0,65 | 0,111 | 30,9 | 6,8 | Legado; não use em projeto novo |
| Standard / None | **4,42** | 0,125 | 0,72 | 0,130 | 43,1 | 4,2 | Só para tela de UI em passe separado |
| Khronos PBR Neutral / None | 1,28 | 0,138 | 0,74 | **0,168** | **45,8** | **0,7** | **Cor de marca exata** em produto |

Arquivos: `/home/claude/provas/pos/look_*.png`; números em `/home/claude/provas/pos/looks.json`. [confirmado por sonda no bpy 5.2.2]

Três achados que mudam a prática:

1. **"AgX - Base Contrast" é igual a "None".** Os números saíram idênticos. Escolher Base Contrast não muda nada.
2. **Standard estoura** (4,4% de pixels com canal em 254 ou mais, contra 1,25% no AgX MHC) e é o "lavado com branco duro" que o Laboratório identificou.
3. **Khronos PBR Neutral manteve a cor de marca com ΔE 0,7** (imperceptível), contra 7,2 no AgX MHC. Ele foi desenhado para reproduzir a cor base do material sob luz neutra, o caso de e-commerce. Com ele a separação produto e fundo caiu nesta cena (0,015 contra 0,064), então a luz precisa fazer esse trabalho.

**Regra do estúdio:**

| Situação | Transformação |
|---|---|
| Produto com cor de marca crítica (embalagem, cosmético, bebida com cor de rótulo) | Khronos PBR Neutral, ou AgX MHC com correção da cor de marca (4.5) |
| Produto em geral, tecnologia, serviços | AgX Medium High Contrast |
| Pop candy | AgX Punchy |
| Comida | AgX Medium High Contrast (Punchy satura tomate e molho além do real; ver 00 · Padrões da casa) |
| Luxo escuro, neon | AgX High Contrast |
| Vai para o Resolve | Exportar EXR (linear) e aplicar AgX lá (4.7) |

**Sinal de que deu errado:** escolher o look para "consertar" um render chapado. Se AgX None parece morto, a luz está ruim; o look só define o gosto.

### 4.3 Color Balance: o que cada controle faz de verdade

A sonda passou valores conhecidos (0,0; 0,18 que é o cinza médio; 1,0) pelo Color Balance do 5.2.2 e leu o resultado em EXR linear. [confirmado por sonda no bpy 5.2.2]

| Controle | Valor testado | Entrada 0,0 | Entrada 0,18 | Entrada 1,0 | Fórmula que bate |
|---|---|---|---|---|---|
| Lift (VALUE) | 0,1 | 0,100 | 0,262 | 1,000 | saída = entrada × (1 - lift) + lift |
| Lift (RGBA) | (1,1; 1; 1) | R 0,100 | R 0,262 | 1,000 | cor - 1 vira um lift por canal |
| Gamma | 1,2 | 0,000 | 0,240 | 1,000 | saída = entrada ^ (1 / gamma) |
| Gain | 1,2 | 0,000 | 0,216 | 1,200 | saída = entrada × gain |
| Slope (ASC-CDL) | 1,2 | 0,000 | 0,216 | 1,200 | multiplica |
| Offset (ASC-CDL) | 0,05 | 0,050 | 0,230 | 1,050 | soma |
| Power (ASC-CDL) | 1,2 | 0,000 | 0,128 | 1,000 | saída = entrada ^ power |

O manual confirma a fórmula do ASC-CDL: saída = (entrada × slope + offset) ^ power ([fonte do manual](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/compositing/types/color/adjust/color_balance.rst)).

**O alerta mais importante:** em luz linear, **Lift 0,1 levou o cinza médio de 0,18 para 0,262**, quase +0,55 stop. É enorme. No compositor do Blender, Lift útil é de **0,002 a 0,02**.

**Valores recomendados (no compositor, antes do AgX):**

| Objetivo | Controle | Valor |
|---|---|---|
| Sombra levemente fria (tecnologia, noite) | Lift RGBA | (0,995; 1,0; 1,01) |
| Sombra quente (comida, luxo) | Lift RGBA | (1,01; 1,0; 0,99) |
| Meio tom um pouco mais aberto | Gamma | 1,03 a 1,08 |
| Alta luz quente | Gain RGBA | (1,03; 1,0; 0,97) |
| Alta luz fria | Gain RGBA | (0,97; 1,0; 1,03) |
| Ajuste de exposição global | Nó Exposure | -0,3 a +0,3 stop (mais que isso: volte à luz) |

**Por quê:** separar a temperatura de sombra e de alta luz (split toning) é o que dá "cara de filme". Sombra fria com alta luz quente (o clássico "teal and orange") funciona para tecnologia; para comida, deixe tudo quente.

**Sinal de exagero:** pele, comida ou produto branco ganhando cor (branco do produto não pode ficar azul nem amarelo); preto que vira cinza (Lift alto demais).

O asset **Split Toning** (Highlights, Factor Highlights 0,5, Shadows, Factor Shadows 0,2, Balance 0,2, Smoothness 0,4) faz o mesmo de forma mais direta. Comece com Factor 0,15 nas duas pontas. [confirmado por sonda no bpy 5.2.2 que o asset existe; valores de uso: testar no Blender]

### 4.4 Curvas e contraste por luminância

O nó RGB Curves (`CompositorNodeCurveRGB`) no 5.2.2 tem entradas Image, Factor, Black Level e White Level; a curva fica em `node.mapping`. [confirmado por sonda no bpy 5.2.2 quanto às entradas; manipulação da curva por script: testar no Blender]

**Curva em S suave (no compositor, valores lineares antes do AgX):** como o compositor está em linear, mexer em curva ali é arriscado. Prefira o contraste pelo **Look** e use curva só para ajuste fino depois, no Resolve. Se for fazer no Blender, use a curva da própria gestão de cor (`view_settings.use_curve_mapping = True`, `view_settings.curve_mapping`), que age depois da transformação:

| Ponto | Entrada | Saída | Efeito |
|---|---|---|---|
| Preto | 0,00 | 0,00 a 0,02 | Não levante mais que 0,02 (preto "lavado") |
| Sombra | 0,25 | 0,22 | Sombra mais densa |
| Meio | 0,50 | 0,50 | Âncora: não mexa no cinza médio |
| Alta luz | 0,75 | 0,78 | Alta luz mais viva |
| Branco | 1,00 | 0,97 a 1,00 | 0,97 dá branco "de filme" sem estourar |

**Contraste por luminância** (mexer só onde precisa): use o nó **Color Correction**, que separa Master, Highlights, Midtones e Shadows com Saturation, Contrast, Gamma, Gain e Offset, e define a faixa dos meios tons por Midtones Start (padrão 0,2) e Midtones End (0,7). [confirmado por sonda no bpy 5.2.2] Exemplo: Shadows Contrast 1,05 e Highlights Saturation 0,95 dá sombra mais firme e alta luz sem cor gritando.

**Sinal de exagero:** `clip_preto` acima de 1% ou `contraste_rms` acima de 0,30 no qa_extra.

### 4.5 Como manter a cor de marca

O teste mostrou o problema: a cor `#3F7CE7` aplicada no material saiu com ΔE2000 de 7,2 no AgX MHC. ΔE acima de 2 já é perceptível lado a lado; acima de 5, o cliente percebe. Protocolo:

1. **Meça.** Rode `qa_extra.py quadro.png --marca "#HEX" --mascara mascara_produto.png`. A máscara sai de um passe Cryptomatte ou de um render com só o produto em branco. Sem máscara, o script pega os pixels que estão a menos de ΔE 20 da cor alvo.
2. **Escolha a transformação.** Se a marca é a estrela (embalagem, rótulo), use Khronos PBR Neutral (ΔE 0,7 no teste).
3. **Se ficar no AgX**, compense no material: ajuste a cor base na direção oposta ao erro (mais saturação, ajuste de matiz) e meça de novo. Duas ou três voltas bastam. [testar no Blender] um laço automático de compensação.
4. **Logo e tela de app:** para cor exata, o logo 2D entra **por cima** na montagem (Resolve, VSE ou CapCut), não renderizado no 3D. Tela de app emissiva: força 1,0 no AgX (o Laboratório viu que acima de 1,3 desbota).
5. **Luz neutra no herói.** Luz de 5600 a 6500 K no produto; cor quente ou fria vai no contorno e no fundo, não na luz principal.

**Por quê:** AgX foi feito para atenuar a pureza das cores fortes e evitar o "neon de CG". Isso é bom para a imagem e ruim para o Pantone do cliente.

**Sinal de que deu errado:** o cliente compara o vídeo com o site dele e diz "o azul tá diferente".

### 4.6 LUT e OCIO Look dentro do Blender

O Blender lê a configuração OCIO que vem com ele. Looks extras (um LUT .cube de "film emulation", por exemplo) só entram editando ou trocando o `config.ocio`, via variável de ambiente `OCIO` apontando para outra configuração. [não verificado no 5.2: procedimento de adicionar Look próprio ao config do 5.x]

Recomendação do estúdio: **não coloque LUT criativa dentro do Blender.** Faça o look no Resolve, onde LUT entra com um clique e pode ser comparada lado a lado. No Blender, fique com AgX + Look + Color Balance sutil.

### 4.7 Finalizar no DaVinci Resolve (gratuito) com EXR

Quando o filme tem mais de 3 planos ou vai ter texto, som e várias versões de formato, o Resolve é o lugar certo.

**Saída do Blender:**

| Campo | Valor |
|---|---|
| Formato | OpenEXR (`OPEN_EXR`) ou OpenEXR Multilayer, se precisar de passes |
| Profundidade | Half (16 bits float) |
| Codec | DWAA (menor, com perda leve) ou ZIP (sem perda) |
| Gestão de cor | EXR sai em linear da cena (Linear Rec.709 no padrão do Blender) |
| Compositor | Deixe o acabamento (grão, vinheta) para o Resolve **ou** para o Blender, nunca nos dois |

**No Resolve:**

1. Instale o DCTL **Blender-AgX** de [EaryChow/Blender-AgX-Resolve](https://github.com/EaryChow/Blender-AgX-Resolve): copie `Blender-AgX-Lib.h` e `Blender-AgX.dctl` para a pasta de LUTs do Resolve, numa subpasta "AgX". O DCTL espera entrada Linear Rec.709 e tem padrões que reproduzem o resultado do Blender. **Atenção: DCTL exige o DaVinci Resolve Studio (pago)** [não verificado no Resolve 20; confirme antes de prometer ao aluno].
2. Alternativa gratuita: no Blender, renderize em PNG 16 bits ou TIFF 16 bits com o AgX já aplicado (sem look), e faça só a correção secundária no Resolve com timeline Rec.709 Gamma 2.4.
3. Pacote de LUTs AgX para Resolve da Creative Shrimp ([AgX, Filmic e LUTs criativos](https://www.creativeshrimp.com/agx-filmic-luts.html)) é outra opção; confira a licença na página.

**Fluxo de nós no Resolve (página Color):**

| Nó | Função | Valor de partida |
|---|---|---|
| 1. Entrada | Transformação AgX (DCTL) ou nada (se veio PNG com AgX) | Padrão |
| 2. Primária | Lift/Gamma/Gain ou Offset | Movimentos de 0,01 a 0,03 |
| 3. Curva | S suave | Pontos da tabela 4.4 |
| 4. Secundária | Qualificador na cor de marca | Ajuste de matiz até ΔE < 3 |
| 5. Look | LUT criativa | Key Output Gain 0,2 a 0,4 (a LUT a 100% quase sempre exagera) |
| 6. Acabamento | Grão, vinheta | Mesmos valores da seção 3 |

---

## 5. Design de som

O som carrega metade ou mais do impacto emocional do filme ([School of Motion: Making Giants, parte 10](https://schoolofmotion.com/blog/making-giants-sound-design)). Comercial de 3D sem som desenhado parece demo de software, mesmo com imagem boa.

### 5.1 As camadas

| Camada | Função | Onde no tempo | Nível relativo na mixagem | Sinal de erro |
|---|---|---|---|---|
| Trilha (música) | Ritmo e emoção | O filme inteiro, cortada na batida | Base; 8 a 12 dB abaixo da voz quando há voz | Trilha brigando com a voz |
| Voz (locução) | Mensagem | Por cima de tudo | Referência: picos curtos perto de -14 LUFS momentâneo | Voz enterrada; "s" estalando |
| Whoosh | Movimento rápido de câmera ou objeto | Pico do som no pico de velocidade | 3 a 6 dB abaixo do impacto | Whoosh em todo movimento; vira ruído |
| Impacto (hit) | Pouso, revelação de logo, corte forte | No quadro do contato (0 a 1 quadro antes) | O som mais forte do filme, transiente curto | Impacto atrasado; impacto em todo corte |
| Riser | Tensão antes da revelação | 1 a 2 s (30 a 60 quadros) antes do impacto, terminando nele | Sobe até o nível do impacto | Riser que não "paga" com impacto |
| Foley de produto | Tampa abrindo, clique de botão, líquido, tecido | No quadro da ação | Discreto, perto do natural | Foley de biblioteca que não combina com o material |
| Cliques de interface (UI) | Toque na tela do app | No quadro em que o botão muda de estado | Baixo, agudo, curto (menos de 80 ms) | Cliques altos e repetidos irritam |
| Ambiência | "Ar" do lugar (sala, cidade, natureza) | Fundo contínuo | 20 a 30 dB abaixo da voz | Silêncio digital entre sons (sensação de vácuo) |

**Regra da hierarquia:** "reserve o som mais largo, longo ou detalhado para o maior movimento" ([Sonilo: whoosh, timing e mixagem](https://sonilo.com/ai-music/whoosh-sound-effect-guide)). Em 15 s, no máximo 1 riser, 2 a 3 impactos e 3 a 5 whooshes.

**Compare sempre no mesmo volume.** O mesmo guia lembra: um whoosh mais alto parece "melhor" só porque é mais alto. Iguale o nível antes de escolher.

### 5.2 Loudness: quanto e por quê

| Plataforma | Alvo integrado | True peak | Fonte e grau de certeza |
|---|---|---|---|
| Spotify (referência de streaming) | -14 LUFS | abaixo de -1 dBTP (abaixo de -2 se o master for mais alto que -14) | Oficial: [Spotify for Artists](https://support.spotify.com/us/artists/article/loudness-normalization/) |
| YouTube (inclui Shorts) | cerca de -14 LUFS (normaliza para baixo o que passa disso) | -1 dBTP | Não oficial, medido: [Frame.io: loudness para YouTube](https://workflow.frame.io/guide/loudness-for-youtube) cita -12 a -14 |
| TikTok | cerca de -14 LUFS | -1 dBTP | Não documentado oficialmente; [Critical Listening Lab](https://www.criticallisteninglab.com/en/learn/loudness/social-media) |
| Instagram e Facebook (Reels) | normalização variável; use -14 LUFS | -1 dBTP | Não documentado oficialmente; mesma fonte |
| Streaming de áudio (AES) | Fala: -18 LUFS; música: -16 LUFS de resultado | -1 dBTP | [AES TD1008](https://aes.org/wp-content/uploads/2024/01/20210924_TD1008_v3.13.pdf), resumo em [Production Advice](https://productionadvice.co.uk/td1008/) |
| TV (referência) | -23 LUFS (EBU R128) ou -24 LKFS (ATSC A/85) | -1 dBTP ou -2 dBTP | [AES: loudness normalization](https://aes2.org/resources/audio-topics/loudness-project/loudness-normalization/) |

**Regra do estúdio para redes sociais: -14 LUFS integrado, true peak -1 dBTP, LRA (faixa de loudness) entre 5 e 9 LU.**

**Por quê -14:** é o alvo de normalização mais comum. Se você entrega a -9 LUFS, a plataforma abaixa e o filme fica achatado pelo limitador sem ganhar volume. Se entrega a -20, a maioria das redes **não** sobe o volume e o filme soa fraco ao lado do próximo vídeo. O ITU-R BS.1770 é o padrão de medição por trás de todos esses números.

**Por quê -1 dBTP:** a recompressão para AAC ou Opus cria picos entre amostras. Com -1 dBTP sobra espaço para isso não distorcer.

**Sinal de que deu errado:** medidor mostra -14 integrado, mas o filme soa baixo. Causa típica: trilha alta com voz baixa; o integrado fica certo e a mensagem some. Meça também o **short-term** na fala: ela deve ficar entre -16 e -12 LUFS.

**Como medir e normalizar por script** (testado com ffmpeg na nuvem): `/home/claude/codigo/pos/mix_e_loudness.sh` faz o ducking da trilha sob a voz, soma as camadas, mede em uma passada e normaliza em duas passadas com o filtro `loudnorm` ([ffmpeg loudnorm](https://ffmpeg.org/ffmpeg-filters.html#loudnorm)).

```bash
# ffmpeg | testado na nuvem com sinais sintéticos
# passada 1: medir
ffmpeg -i mix.wav -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null -
# passada 2: aplicar com os números medidos (measured_I, measured_TP, measured_LRA, measured_thresh, offset)
ffmpeg -i mix.wav -af "loudnorm=I=-14:TP=-1:LRA=11:measured_I=-26.7:measured_TP=-17.8:measured_LRA=10.6:measured_thresh=-37.1:offset=0.4:linear=true" -c:a pcm_s24le final.wav
# conferência independente
ffmpeg -i final.wav -af ebur128=peak=true -f null -
```

Resultado do teste: mix bruta em -26,7 LUFS e -17,8 dBTP; depois da normalização, o `loudnorm` mediu **-14,0 LUFS e -5,1 dBTP**, mas o `ebur128` do mesmo ffmpeg mediu **-13,1 LUFS**. Diferença de 0,9 LU entre dois medidores no mesmo arquivo curto e sintético. **Lição:** escolha um medidor (o do Resolve Fairlight ou o `ebur128`) e use sempre o mesmo; trate ±1 LU como empate.

**No Resolve:** Project Settings > Fairlight > Target Loudness -14 LUFS; acompanhe o medidor Loudness (leitura Integrated); o zero do medidor passa a ser o alvo ([Envato: normalizar no Fairlight](https://elements.envato.com/learn/normalize-audio-loudness-davinci-fairlight)). Na página Deliver há opção de normalizar o áudio na exportação [não verificado na versão 20].

### 5.3 Sincronia: em que quadro o som entra

A pergunta "impacto 1 a 2 quadros antes do pouso?" tem resposta com base em norma de TV.

| Norma | Som adiantado (antes da imagem) | Som atrasado (depois da imagem) |
|---|---|---|
| ITU-R BT.1359: limite de detecção | 45 ms | 125 ms |
| EBU R37: aceitável fim a fim | 40 ms | 60 ms |
| ATSC IS-191 | 15 ms | 45 ms |

Fonte: [Wikipédia: sincronização áudio e vídeo](https://en.wikipedia.org/wiki/Audio-to-video_synchronization), que compila as normas.

A 30 fps, **1 quadro = 33,3 ms.** Logo:

* Som **1 quadro antes** (33 ms adiantado) fica abaixo do limite de detecção (45 ms). Pode.
* Som **2 quadros antes** (67 ms adiantado) passa do limite. O espectador sente "algo errado". **Não faça.**
* Som atrasado é mais tolerado (até 125 ms, quase 4 quadros), porque no mundo real o som chega depois da luz.

**Regras do estúdio (30 fps):**

| Evento | Onde colocar o transiente (ataque) do som |
|---|---|
| Impacto, pouso, batida de logo | No quadro do contato, ou 1 quadro antes. Nunca 2 ou mais antes |
| Clique de UI | No quadro em que o botão muda de estado |
| Whoosh | O **pico** do som no quadro de maior velocidade (ou de menor distância da câmera). O som começa antes |
| Riser | Termina no quadro do impacto; começa 30 a 60 quadros antes |
| Corte de plano | Som do plano novo começa no quadro do corte; "pré-lap" de ambiência de 3 a 6 quadros é permitido para suavizar |

**Whoosh em números:** no exemplo do guia da Sonilo, um whoosh de 1,15 s tem o pico em 620 ms, ou seja, por volta de 54% da duração. E, para revelação de título, ele recomenda deixar vazios os 80 ms finais do whoosh para o impacto separado entrar limpo ([Sonilo](https://sonilo.com/ai-music/whoosh-sound-effect-guide)). Com isso: `quadro_inicio_whoosh = quadro_pico_velocidade - round(0,55 × duração_s × 30)`.

**Sinal de que deu errado:** assista em velocidade normal, não quadro a quadro. Se o impacto "chega antes" do pouso, puxe um quadro para trás.

### 5.4 Trilha cortada na batida

Quadros por batida = fps × 60 / BPM. A 30 fps:

| BPM | Quadros por batida | Quadros por compasso (4 batidas) | Quadros em 2 compassos | Inteiro? |
|---|---|---|---|---|
| 90 | 20,00 | 80,0 | 160 | Sim |
| 100 | 18,00 | 72,0 | 144 | Sim |
| 110 | 16,36 | 65,45 | 130,9 | Não |
| 120 | 15,00 | 60,0 | 120 | Sim |
| 128 | 14,06 | 56,25 | 112,5 | Não |
| 140 | 12,86 | 51,43 | 102,9 | Não |

**Quando não é inteiro, o erro acumula.** Cortar a cada 14 quadros numa trilha de 128 BPM erra 0,06 quadro por batida; em 32 batidas (15 s) são 2 quadros de atraso, já perceptível. Sempre calcule cada corte a partir do zero: `quadro_n = round(offset + n × 1800 / BPM)`. Script: `/home/claude/codigo/pos/grade_de_batidas.py` (testado):

```text
$ python3 grade_de_batidas.py 128 30 8
128.0 BPM a 30.0 fps: 14.062 quadros por batida, 56.25 por compasso 4/4
  compasso  1: quadro 0
  compasso  2: quadro 56
  compasso  3: quadro 112
  compasso  4: quadro 169
  compasso  5: quadro 225
```

**Dica de escolha de trilha:** se puder escolher, prefira BPM com batida inteira a 30 fps: 60, 72, 75, 90, 100, 120, 150, 180. Em 15 s a 120 BPM você tem exatamente 30 batidas e 7,5 compassos.

**Quais cortes caem na batida:** cortes de plano e impactos no **primeiro tempo do compasso**; movimentos secundários (um ícone que entra) nas batidas intermediárias. Não corte em toda batida: a 120 BPM, plano a cada 15 quadros (0,5 s) é rápido demais para produto. Plano de produto dura de 1 a 2 compassos (60 a 120 quadros a 120 BPM).

**Offset:** a primeira batida forte da trilha raramente está no tempo zero do arquivo. Encontre o quadro da primeira batida na forma de onda e passe como `offset`.

### 5.5 Ducking da trilha sob a voz (sidechain)

| Parâmetro | Valor | Por quê |
|---|---|---|
| Redução da trilha durante a fala | 8 a 12 dB | Voz inteligível sem a trilha sumir |
| Ataque | 10 a 30 ms | Rápido o bastante para não engolir a primeira sílaba |
| Liberação (release) | 250 a 500 ms | Trilha volta suave entre frases, sem "bombear" |
| Razão | 4:1 a 8:1 | Redução firme |
| EQ na trilha durante a fala (opcional) | Corte de 2 a 4 dB entre 1 e 4 kHz | Abre espaço para a inteligibilidade sem baixar tudo |

No `mix_e_loudness.sh`: `sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350` ([ffmpeg sidechaincompress](https://ffmpeg.org/ffmpeg-filters.html#sidechaincompress)). No Resolve Fairlight, use o compressor do canal da trilha com sidechain a partir do barramento da voz.

**Sinal de exagero:** a trilha "respira" (sobe e desce) audivelmente entre palavras. Aumente o release.

### 5.6 Lista de eventos de som a partir das F-curves

**Conceito:** o som acompanha a **velocidade**, não a chave. Uma chave pode estar parada (hold) e nada acontecer; um objeto pode passar voando entre duas chaves sem nenhuma chave no meio. Por isso o script mede a posição em espaço de mundo a cada quadro (pega parent, constraint e driver), calcula a velocidade e acha:

* **WHOOSH:** pico local de velocidade, acima de um limiar e acima de 50% da velocidade máxima do objeto.
* **IMPACTO:** o objeto vinha rápido e a velocidade cai mais de 80% em até 2 quadros. O quadro marcado é o último quadro em movimento (o contato).
* **RISER:** janela de 1,5 s antes do impacto mais forte.
* **CHAVES:** quadros com chave (lidos do channelbag do 5.x), úteis para cliques de UI e foley em mudanças de estado.

Código: `/home/claude/codigo/pos/eventos_de_som.py` [confirmado por sonda no bpy 5.2.2]. Trecho central:

```python
# Blender 5.2 | confirmado por sonda no bpy 5.2.2
from bpy_extras import anim_utils

def chaves_do_objeto(ob):
    ad = ob.animation_data
    if not ad or not ad.action: return []
    cb = anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot)
    return sorted({round(k.co.x) for fc in cb.fcurves for k in fc.keyframe_points}) if cb else []

def amostrar(scene, objetos):
    fps = scene.render.fps / scene.render.fps_base
    pos = {o.name: [] for o in objetos}; rot = {o.name: [] for o in objetos}
    for f in range(scene.frame_start, scene.frame_end + 1):
        scene.frame_set(f)
        for o in objetos:
            pos[o.name].append(o.matrix_world.translation.copy())
            rot[o.name].append(o.matrix_world.to_quaternion())
    vel = {}
    for n in pos:
        v = [0.0]
        for i in range(1, len(pos[n])):
            lin = (pos[n][i] - pos[n][i-1]).length * fps                   # m/s
            ang = rot[n][i].rotation_difference(rot[n][i-1]).angle * fps    # rad/s
            v.append(lin + 0.15 * ang)
        vel[n] = v
    return vel, fps
# detectar(): pico local = WHOOSH (som começa 0,55 x duração antes do pico);
# queda de 80% em 2 quadros = IMPACTO no último quadro em movimento; RISER 1,5 s antes do maior impacto.
```

**Teste:** cubo cai de 3 m com aceleração e para seco no quadro 20; fica parado; sai em 10 quadros (45 a 55). Saída real:

```text
{'tipo': 'RISER',   'quadro_inicio': 1,  'quadro_fim': 20}
{'tipo': 'WHOOSH',  'quadro_pico': 20, 'quadro_inicio_som': 7,  'vel': 9.22}
{'tipo': 'IMPACTO', 'quadro': 20, 'vel_antes': 9.22}
{'tipo': 'WHOOSH',  'quadro_pico': 51, 'quadro_inicio_som': 38, 'vel': 17.76}
{'tipo': 'IMPACTO', 'quadro': 55, 'vel_antes': 9.12}
chaves {'Produto': [1, 20, 45, 55]}
```

O impacto saiu no quadro 20, exatamente o contato. **Limitação:** o segundo "impacto" (quadro 55) é a parada do objeto fora do quadro, não um pouso. O script não sabe o que está visível. Filtre eventos de objetos fora da câmera com `bpy_extras.object_utils.world_to_camera_view` [testar no Blender] ou revise a lista à mão. O peso de 0,15 m por radiano para rotação deve ser ajustado à escala do produto (celular real tem 0,147 m de altura; use 0,07).

**Como usar a lista:** exporte o JSON, importe os quadros como marcadores na timeline do Resolve (ou no VSE com `scene.timeline_markers.new(nome, frame=q)`) e posicione os sons sobre os marcadores.

### 5.7 Fontes de som com licença comercial

| Biblioteca | Licença | Atribuição | Anúncio pago | Cuidados |
|---|---|---|---|---|
| [Freesound](https://freesound.org/help/faq/) | Por som: CC0, CC BY, CC BY-NC (e Sampling+ antigo) | CC0 não; CC BY sim | **Só CC0 ou CC BY.** CC BY-NC proíbe uso comercial; Sampling+ proíbe publicidade | Use o filtro de licença da busca avançada; guarde o link de cada som |
| [Pixabay](https://pixabay.com/service/license-summary/) (música e efeitos) | Licença de Conteúdo Pixabay | Não exigida | Sim, com regras | Não pode revender o som isolado; conteúdo com marca reconhecível não vale para uso comercial. Algumas músicas estão no Content ID do YouTube: baixe o certificado de licença e conteste ([Pixabay: Content ID](https://pixabay.com/blog/posts/how-to-clear-a-youtube-content-id-claim-with-a-pix-190/)) |
| [Mixkit](https://mixkit.co/license/) | "Sound Effects Free License" e "Stock Music Free License" | Não exigida | Efeitos: sim (inclui anúncios). Música: anúncios online sim; TV, rádio e jogos não | Resumo de terceiros ([Kripesh Adwani](https://kripeshadwani.com/mixkit-review/)); leia a licença na página antes de usar em anúncio de TV |
| [Sonniss GDC Game Audio Bundle](https://sonniss.com/gdc-bundle-license/) | Royalty-free, mundial, não exclusiva | Não exigida | Sim, projetos ilimitados | Não pode redistribuir os sons como sons; **proibido usar para treinar IA** |
| [Zapsplat](https://www.zapsplat.com/license-type/standard-license/) | Standard (grátis) e Premium | Grátis: crédito "ZapSplat" obrigatório onde possível; Premium: não | Sim ("comerciais e publicidade") | Proibido treinar IA; proibido usar como valor principal de um produto (app de sons) |
| YouTube Audio Library | Licença do YouTube ou Creative Commons, por faixa | Algumas faixas exigem crédito na descrição | **Não use fora do YouTube.** A própria ajuda diz que a segurança é "conhecida pelo YouTube" ([ajuda YouTube](https://support.google.com/youtube/answer/3376882)) | Não serve para Reels, TikTok nem anúncio Meta |
| Epidemic Sound | Assinatura | Não | **Só planos Pro ou Enterprise** cobrem campanhas de anúncio ([preços Epidemic](https://www.epidemicsound.com/pricing/)) | Plano pessoal não cobre anúncio de cliente |
| Artlist | Assinatura | Não | Planos com licença comercial (Max, Max Business, Enterprise) ([preços Artlist](https://artlist.io/pricing)) | Os nomes dos planos mudam com frequência; confira na compra |
| TikTok Commercial Music Library | Pré-liberada para empresas | Não | Sim, **dentro do TikTok** ([TikTok Ads: CML](https://ads.tiktok.com/help/article/commercial-music-library)) | "Empresas não podem usar a biblioteca geral de músicas para uso comercial" |
| Biblioteca do CapCut | Termos do CapCut | Varia | **Risco.** Há relatos de reclamação de direitos no Facebook mesmo usando a biblioteca "comercial" ([Audiodrome](https://audiodrome.net/for-creators/capcut-music/)) | Para anúncio, traga música licenciada de fora |

### 5.8 O que é seguro para anúncio pago

Regra prática do estúdio, em ordem de segurança:

1. **Mais seguro:** música e efeitos de assinatura paga com plano que cita anúncio (Epidemic Pro ou Enterprise, Artlist com licença comercial), ou trilha encomendada com contrato.
2. **Seguro com cuidado:** efeitos CC0 do Freesound, Sonniss GDC, Mixkit (efeitos), Zapsplat (com crédito ou Premium). Guarde uma planilha com: nome do arquivo, link, licença, data de download.
3. **Seguro dentro da plataforma:** TikTok Commercial Music Library, só no TikTok.
4. **Evitar em anúncio:** YouTube Audio Library fora do YouTube; biblioteca de música do CapCut; Freesound CC BY-NC; qualquer música "sem copyright" de canal de YouTube.

**Por quê:** anúncio pago é revisado por sistema automático de direitos. Uma reclamação derruba a campanha no meio da veiculação, e o cliente paga a conta.

**Sinal de que deu errado:** você não consegue responder em 10 segundos "de onde veio este som e qual a licença".

---

## 6. Tipografia em movimento sobre 3D

### 6.1 Tamanho mínimo em 1080 x 1920

Cálculo: um celular comum mostra o vídeo vertical com cerca de 390 pontos de largura (iPhone de 6,1"). 1080 / 390 = **2,77 px do vídeo por ponto de tela**. A WCAG considera "texto grande" a partir de 18 pt (24 px CSS) ou 14 pt em negrito ([WCAG 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)); 1 pt CSS = 1,333 px CSS. [cálculo derivado; tamanho de tela é referência, não norma]

| Papel do texto | Equivalente na tela | Altura da fonte no vídeo 1080 x 1920 | Peso |
|---|---|---|---|
| Título de impacto (2 a 4 palavras) | 32 a 48 px CSS | 90 a 140 px | Bold ou Black |
| Título comum | 24 a 32 px CSS | 66 a 90 px | Semibold ou Bold |
| Apoio (frase curta) | 18 a 22 px CSS | 50 a 60 px | Medium ou Semibold |
| Mínimo absoluto (legenda, preço, aviso) | 16 px CSS | **44 px** | Medium; nunca Light |

Em 1:1 (1080 x 1080) e 4:5 (1080 x 1350) os valores em px são os mesmos, porque a largura é a mesma. Em 16:9 (1920 x 1080) visto no celular deitado, a largura de tela vira cerca de 844 pt: 1920 / 844 = 2,27, então o mínimo cai para cerca de 36 px.

**Sinal de erro:** o texto exige zoom ou pausa para ler. Teste real: assista no celular a um braço de distância.

### 6.2 Contraste (WCAG)

Razão de contraste = (L1 + 0,05) / (L2 + 0,05), com L1 e L2 as luminâncias relativas da cor mais clara e da mais escura ([WCAG 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)). Mínimo 4,5:1 para texto comum e 3:1 para texto grande.

**Regra do estúdio:** 4,5:1 sempre, mesmo em título grande, porque o fundo 3D se mexe e o pior quadro manda. Exemplos de referência: branco sobre `#1E5BFF` dá cerca de 5,2:1; branco sobre `#FF6A00` dá cerca de 2,9:1 (reprova; use texto escuro ou placa). [calculado com a função `razao_wcag` do `qa_extra.py`]

**Como verificar no quadro:** `python3 qa_extra.py quadro.png --texto x,y,w,h --plataforma reels`. O script pega a mediana dos 10% de pixels mais claros e dos 10% mais escuros dentro da caixa do texto e calcula a razão, e diz se a caixa está dentro da zona segura.

**Quando o fundo 3D não deixa:** (1) placa (card) semitransparente atrás do texto, 60 a 80% de opacidade, cantos com raio de 16 a 24 px; (2) sombra projetada suave (deslocamento 0, desfoque 24 a 40 px, preto a 35 a 50%); (3) escurecer a região do fundo no 3D (luz com light linking, ou um gradiente no compositor). Contorno (stroke) em volta da letra é o último recurso: parece amador.

### 6.3 Tempo de leitura

A BBC usa 160 a 180 palavras por minuto para legenda e um mínimo de cerca de 0,3 s por palavra ([guia BBC resumido pela Clevercast](https://www.clevercast.com/bbc-subtitling-guidelines/)). 180 ppm = 3 palavras por segundo, mas legenda é lida com som; texto de anúncio é lido no meio de imagem em movimento, então o estúdio usa uma margem.

**Fórmula do estúdio:** tempo mínimo = o maior entre as duas fórmulas: 30 × (0,5 + caracteres/12) e 30 × (palavras/2,5 + 0,5), número contando como 2 palavras; mínimo 36 q. [valor de trabalho, não verificado em estudo de anúncio] (ver 00 · Padrões da casa). A tabela abaixo mostra só a parte das palavras.

| Palavras | Tempo (s) | Quadros a 30 fps (já sem contar entrada e saída) |
|---|---|---|
| 1 a 2 | 1,2 | 36 |
| 3 | 1,7 | 51 |
| 4 | 2,1 | 63 |
| 5 | 2,5 | 75 |
| 6 | 2,9 | 87 |
| 8 | 3,7 | 111 |

Números, preços e nomes contam como 2 palavras. **Em 15 s, cabem no máximo 3 blocos de texto** sem atropelar a imagem.

**Sinal de erro:** o texto sai antes de você terminar de ler em voz baixa no ritmo normal.

### 6.4 Zonas seguras (9:16, 1080 x 1920)

| Plataforma | Topo | Base | Esquerda | Direita | Fonte |
|---|---|---|---|---|---|
| Instagram e Facebook Reels, Stories | 269 px (14%) | 672 px (35%); canto inferior direito 40% | 65 px (6%) | 65 px (6%) | Diagrama da Meta resumido em [AdsUploader](https://adsuploader.com/blog/meta-ads-safe-zones) |
| TikTok | 130 px | 484 px (mínimo; cresce com legenda longa) | 44 px | 140 px | Especificação do TikTok Ads resumida em [Cadenus](https://cadenus.io/resources/blog/tiktok-safe-zone/) |
| YouTube Shorts | 380 px | 380 px | 60 px | 120 px | [Poster.ly](https://www.poster.ly/tools/youtube-shorts-safe-zone-checker) (fonte não oficial) |
| **Zona universal do estúdio** (pior caso das três) | **380 px** | **672 px** | **120 px** | **140 px** (300 px abaixo de y 960, gabarito TikTok) | União dos piores casos |

Máscara universal do estúdio em 1080 x 1920: livre 380 px no topo, 672 px na base, 120 px à esquerda, 140 px à direita, e 300 px à direita abaixo de y 960 (gabarito TikTok). Área útil: x 120 a 940 (x 120 a 780 abaixo de y 960), y 380 a 1248. Centro óptico da área útil: y ≈ 814. [não verificado em fonte oficial do TikTok e do YouTube; revisar a cada trimestre] (ver 00 · Padrões da casa). **Texto e logo ficam dentro dela.** O produto pode passar das bordas (é imagem), mas o detalhe que vende (o rosto do produto, a tela do app) também fica dentro.

Os números variam com atualização de interface; trate como [verificar a cada trimestre] e salve uma máscara PNG de zona segura para sobrepor nos testes.

### 6.5 Texto 3D ou texto 2D por cima?

| Critério | Texto 3D (objeto Text do Blender, extrudado) | Texto 2D (na montagem) |
|---|---|---|
| Quando usar | Logo ou palavra que **faz parte da cena** (letreiro, nome gravado no produto, revelação de marca) | Mensagem, oferta, preço, chamada, legenda |
| Legibilidade | Depende de luz e ângulo; difícil garantir 4,5:1 | Controle total |
| Cor de marca | Sofre o AgX (ΔE 6 a 8 no teste) | Exata |
| Troca de idioma ou de oferta | Re-render | Troca em segundos |
| Custo | Alto | Baixo |
| Sinal de erro | Texto 3D girando para "ficar bonito" e ilegível em metade dos quadros | Texto 2D sem nenhuma relação de luz com a cena ("adesivo") |

**Regra:** texto 3D só para marca e para palavras que são objeto. Todo o resto é 2D. Para o 2D não parecer adesivo: herde a cor de uma luz da cena (o tom do contorno, por exemplo), use sombra suave coerente com a direção da luz principal e entre com o movimento da câmera (se a câmera sobe, o texto sobe 10 a 20% mais devagar, efeito de paralaxe).

Para texto 3D: chanfro (bevel) de 1 a 2% da altura da letra, extrusão de 5 a 15% da altura, material com aspereza 0,3 a 0,5 (não espelho), e luz de contorno para separar do fundo. [testar no Blender]

### 6.6 Fontes com licença comercial

As fontes do Google Fonts usam majoritariamente a **SIL Open Font License 1.1 (OFL)**, que permite uso comercial, inclusive em vídeo e anúncio. A única proibição relevante: não vender a fonte sozinha ([OFL 1.1 em choosealicense.com](https://choosealicense.com/licenses/ofl-1.1/)). Algumas usam Apache 2.0 ou Ubuntu Font License; confira na página de cada família.

| Uso | Sugestões OFL | Por quê |
|---|---|---|
| Tecnologia, SaaS, app | Inter, Manrope, Plus Jakarta Sans, Space Grotesk | Sem serifa geométrica, ótima em tela |
| Luxo, perfume, moda | Playfair Display, Cormorant, Bodoni Moda | Contraste alto de traço; use só em título grande (90 px ou mais) |
| Serviço local, clínica, advocacia | Source Sans 3, Lato, Libre Franklin | Neutra, confiável |
| Pop, comida, varejo | Poppins, Montserrat, Archivo Black | Pesada, lê rápido |

**Regra:** no máximo 2 famílias por filme; 2 a 3 pesos. Fonte do cliente (do manual de marca) tem prioridade; peça o arquivo e a licença.

**Sinal de erro:** fonte fina (Light, Thin) em fundo 3D que se mexe; serifa de alto contraste abaixo de 66 px (as hastes finas somem na compressão).

### 6.7 Animação de texto em quadros (30 fps)

| Movimento | Duração | Curva | Valores |
|---|---|---|---|
| Entrada de bloco (sobe e aparece) | 8 a 12 quadros | Saída suave forte (ease-out; "expo out") | Desloca 30 a 60 px; opacidade 0 a 100% nos primeiros 60% do tempo |
| Entrada palavra por palavra | 6 a 8 quadros por palavra | Ease-out | Atraso (stagger) de 2 a 3 quadros entre palavras |
| Entrada letra por letra | 4 a 6 quadros por letra | Ease-out | Atraso de 1 quadro; só em 1 a 2 palavras de impacto |
| Escala de impacto (logo, preço) | 6 a 10 quadros | Back out (passa 3 a 6% e volta) | 90% para 100%, nunca de 0% |
| Permanência | Tabela 6.3 | Parado, ou deriva de 1 a 2% de escala | Deriva lenta mantém vivo |
| Saída | 6 a 8 quadros (mais rápida que a entrada) | Ease-in | Desloca 20 a 40 px ou só some |
| Troca de texto no mesmo lugar | 4 a 6 quadros de sobreposição | Ease-in-out | Sai o antigo, entra o novo |

**Sincronia:** a entrada do texto começa **no quadro da batida** ou do impacto (seção 5.3); a palavra principal aterrissa nele.

**Por quê:** entrada rápida e saída mais rápida ainda é o padrão do motion comercial: o olho é guiado sem esperar.

**Sinal de erro:** todos os textos entrando igual (mesmo "fade" do software); desfoque de movimento exagerado em texto; texto que entra e sai sem respeitar o tempo de leitura.

---

## 7. Onde montar o final

| Critério | Blender VSE (5.2) | DaVinci Resolve (gratuito) | CapCut |
|---|---|---|---|
| Custo | Gratuito | Gratuito (Studio é pago) | Gratuito com recursos pagos |
| Automação por script | **Total** (`bpy`, mesmo processo do render) | API de script limitada na versão gratuita [não verificado no Resolve 20] | Nenhuma |
| Cor | Gestão de cor do Blender; modificador de compositor nas faixas (5.0) | **Melhor da categoria** (página Color) | Filtros simples |
| Som | Mixagem básica; sem medidor LUFS nativo [não verificado no 5.2] | **Fairlight** com medidor de loudness e alvo | Básico |
| Texto e legendas | Faixa de texto com caixa delimitada (5.0) | Fusion Titles, bom controle | **Melhor** para legenda dinâmica e templates |
| Licença de assets embutidos | Não tem biblioteca | Não tem | **Risco** em anúncio (seção 5.7) |
| Melhor para | Montagem automática que a IA faz sozinha; versões em lote | Filme final para cliente | Corte rápido para orgânico do próprio dono |

**Fluxo recomendado do estúdio:**

1. **Blender:** render dos planos (EXR para cliente, ou PNG 16 bits com AgX) + compositor de acabamento. Gera também `eventos.json` (seção 5.6).
2. **Montagem automática no VSE** (versão de aprovação): a IA monta os planos na grade de batidas (`grade_de_batidas.py`), coloca a trilha, aplica os marcadores de som e exporta um MP4 leve para o cliente aprovar o ritmo.
3. **Finalização no Resolve:** cor final, texto 2D, design de som, loudness -14 LUFS, exportação.
4. **CapCut** só para versões orgânicas rápidas, com música de fonte licenciada externa.

**Exportação para redes (9:16):** H.264 High, 1080 x 1920, 30 fps constante, 12 a 20 Mbps (VBR 2 passadas), AAC 48 kHz 320 kbps estéreo, -14 LUFS, -1 dBTP. [valores de prática; confira a especificação atual de cada plataforma antes de campanha grande]

**Sinal de erro:** exportar em 25 ou 60 fps um filme feito a 30 (quadros duplicados ou pulados quebram a sincronia de som); exportar com bitrate baixo (menos de 8 Mbps) e ver o grão virar blocos.

---

## 8. Checklist de saída da pós

| # | Item | Como conferir | Passa se |
|---|---|---|---|
| 1 | Compositor em `scene.compositing_node_group` | `print(scene.compositing_node_group.name)` | Não é None |
| 2 | Bloom sem névoa | Recorte 200% no produto | Borda do produto nítida |
| 3 | Distorção | Linhas retas longas | Nenhuma curva visível |
| 4 | Aberração | Recorte no texto e no logo | Sem franja |
| 5 | Vinheta | `vinheta_centro_menos_quinas` no qa_extra | 0,05 a 0,18 |
| 6 | Grão | `ruido_sigma` no qa_extra | 0,8 a 2,5 com grão; sem pontos pretos |
| 7 | Nitidez | Recorte 200% em borda clara | Sem anel |
| 8 | Look certo para o mundo | Tabela 4.2 | Bate com o briefing |
| 9 | Cor de marca | `--marca` no qa_extra | ΔE2000 ≤ 5 (ideal ≤ 3) |
| 10 | Loudness | `ebur128` ou Fairlight | -14 ±1 LUFS; true peak ≤ -1 dBTP |
| 11 | Sincronia | Assistir em velocidade normal | Impacto no contato (0 a 1 quadro antes) |
| 12 | Trilha na batida | `grade_de_batidas.py` | Cortes principais no 1º tempo |
| 13 | Licença de cada som | Planilha de licenças | Todos com link e licença; nenhum "NC" |
| 14 | Texto: tamanho | Medir altura da fonte | ≥ 44 px (apoio), ≥ 66 px (título) |
| 15 | Texto: contraste | `--texto` no qa_extra | ≥ 4,5:1 |
| 16 | Texto: zona segura | `--plataforma` no qa_extra | Dentro |
| 17 | Texto: tempo | Tabela 6.3 | Tempo ≥ fórmula |
| 18 | Exportação | `ffprobe` | 30 fps constante, 1080 x 1920, AAC 48 kHz |

---

## Fontes

1. [Blender 5.0: página oficial de lançamento](https://www.blender.org/download/releases/5-0/)
2. [Blender 5.0: notas do compositor](https://developer.blender.org/docs/release_notes/5.0/compositor/) (não abriu por redirecionamento; conteúdo conferido por sonda e pelas fontes 1, 4 e 5)
3. [Blender 4.2: migração do EEVEE (Bloom removido, usar Glare Bloom)](https://developer.blender.org/docs/release_notes/4.2/eevee_migration/)
4. [CG Cookie: tudo que é novo no Blender 5.0](https://blog.cgcookie.com/posts/everything-new-in-blender-5-0/)
5. [Blender Artists: Group Output no lugar do Composite](https://blenderartists.org/t/why-am-i-getting-group-output-instead-of-composite-node-in-the-compositor/1626301)
6. [Manual do Blender (fonte RST): Glare](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/compositing/types/filter/glare.rst)
7. [Manual do Blender (fonte RST): Color Balance](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/compositing/types/color/adjust/color_balance.rst)
8. [Manual do Blender (fonte RST): Lens Distortion](https://projects.blender.org/blender/blender-manual/raw/branch/main/manual/compositing/types/transform/lens_distortion.rst)
9. [Aras Pranckevičius: novidades do VSE no Blender 5.x](https://aras-p.info/blog/2026/08/18/More-Blender-VSE-tidbits/)
10. [CG Cookie: cores vivas com AgX e fluxo RAW](https://blog.cgcookie.com/posts/the-secret-to-rendering-vibrant-colors-with-agx-in-blender-is-the-raw-workflow/)
11. [EaryChow: Blender AgX para DaVinci Resolve (DCTL)](https://github.com/EaryChow/Blender-AgX-Resolve)
12. [Creative Shrimp: LUTs AgX e Filmic para Resolve](https://www.creativeshrimp.com/agx-filmic-luts.html)
13. [Spotify for Artists: normalização de loudness](https://support.spotify.com/us/artists/article/loudness-normalization/)
14. [AES TD1008 (PDF)](https://aes.org/wp-content/uploads/2024/01/20210924_TD1008_v3.13.pdf)
15. [Production Advice: resumo do AES TD1008](https://productionadvice.co.uk/td1008/)
16. [AES: normalização de loudness](https://aes2.org/resources/audio-topics/loudness-project/loudness-normalization/)
17. [Frame.io Workflow Guide: loudness para YouTube](https://workflow.frame.io/guide/loudness-for-youtube)
18. [Critical Listening Lab: loudness em redes sociais](https://www.criticallisteninglab.com/en/learn/loudness/social-media)
19. [Envato: normalizar loudness no Fairlight](https://elements.envato.com/learn/normalize-audio-loudness-davinci-fairlight)
20. [ffmpeg: filtros loudnorm, ebur128 e sidechaincompress](https://ffmpeg.org/ffmpeg-filters.html)
21. [Wikipédia: sincronização áudio e vídeo (ITU-R BT.1359, EBU R37, ATSC IS-191)](https://en.wikipedia.org/wiki/Audio-to-video_synchronization)
22. [School of Motion: Making Giants, parte 10, design de som](https://schoolofmotion.com/blog/making-giants-sound-design)
23. [Sonilo: guia de whoosh (timing e mixagem)](https://sonilo.com/ai-music/whoosh-sound-effect-guide)
24. [Freesound: FAQ de licenças](https://freesound.org/help/faq/) (CC0, CC BY, CC BY-NC, Sampling+)
25. [Pixabay: resumo da licença](https://pixabay.com/service/license-summary/) e [termos](https://pixabay.com/service/terms/) (Licença de Conteúdo Pixabay, uso comercial com restrições)
26. [Pixabay: como resolver reclamação de Content ID](https://pixabay.com/blog/posts/how-to-clear-a-youtube-content-id-claim-with-a-pix-190/)
27. [Mixkit: licenças](https://mixkit.co/license/) e [resumo de terceiros](https://kripeshadwani.com/mixkit-review/) (Sound Effects Free License, Stock Music Free License)
28. [Sonniss: licença do GDC Game Audio Bundle](https://sonniss.com/gdc-bundle-license/) (royalty-free, sem atribuição, sem treino de IA)
29. [Zapsplat: licença Standard e Premium](https://www.zapsplat.com/license-type/standard-license/)
30. [YouTube: Biblioteca de áudio](https://support.google.com/youtube/answer/3376882)
31. [Epidemic Sound: preços e anúncios](https://www.epidemicsound.com/pricing/)
32. [Artlist: preços e licenças](https://artlist.io/pricing)
33. [TikTok Ads: Commercial Music Library](https://ads.tiktok.com/help/article/commercial-music-library)
34. [Audiodrome: música do CapCut em anúncios](https://audiodrome.net/for-creators/capcut-music/)
35. [W3C: WCAG 2.1, contraste mínimo 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
36. [Clevercast: diretrizes de legenda da BBC](https://www.clevercast.com/bbc-subtitling-guidelines/)
37. [AdsUploader: zonas seguras da Meta](https://adsuploader.com/blog/meta-ads-safe-zones)
38. [Cadenus: zona segura do TikTok em pixels](https://cadenus.io/resources/blog/tiktok-safe-zone/)
39. [Poster.ly: zona segura do YouTube Shorts](https://www.poster.ly/tools/youtube-shorts-safe-zone-checker)
40. [SIL Open Font License 1.1](https://choosealicense.com/licenses/ofl-1.1/)

---

## Pendências para o Claude Code

**Receitas [testar no Blender] (na RTX 3050, Blender 5.2.2 com interface):**

1. Rodar `compositor_acabamento.py` em 1080 x 1920 num filme real dos 7 mundos e calibrar: bloom por mundo (tabela 3.2), grão 2,5% (ver se some no Instagram depois da recompressão) e nitidez 0,06.
2. Medir o tempo do compositor em GPU na RTX 3050 (na nuvem, CPU: cerca de 7 s por quadro a 360 x 640).
3. Asset Film Grain: achar Softness e Factor que dão grão visível sem perder nitidez (no teste, Factor 0,35 com padrões amoleceu a imagem: variância do Laplaciano de 155 para 54).
4. Confirmar o caminho do `compositing_nodes_essentials.blend` na instalação Windows e se `bpy.utils.resource_path("LOCAL")` o encontra.
5. Laço automático de compensação de cor de marca no AgX MHC (ajustar Base Color até ΔE2000 ≤ 3).
6. Testar o Khronos PBR Neutral nos 7 mundos: ele preservou a cor (ΔE 0,7), mas reduziu a separação produto e fundo nesta cena.
7. Manipular a curva do `CompositorNodeCurveRGB` e de `view_settings.curve_mapping` por script (inserir pontos da tabela 4.4).
8. Adicionar um Look próprio (LUT .cube) ao config OCIO do 5.2 e ver se aparece em `view_settings.look`.
9. Confirmar se o DCTL do AgX roda no Resolve gratuito (em versões anteriores, DCTL exigia Studio).
10. `eventos_de_som.py`: filtrar eventos de objetos fora da câmera com `world_to_camera_view`; testar numa cena com câmera animada.
11. Montagem automática no VSE: script que lê `grade_de_batidas.py` e `eventos.json`, cria faixas de cena e de som e marcadores.
12. Texto 3D: chanfro, extrusão e material da seção 6.5 num título de marca; medir contraste com `--texto`.
13. Verificar se o VSE do 5.2 tem medidor de loudness ou normalização na exportação.

**PENDÊNCIAS YOUTUBE** (não assistidos nesta pesquisa):

* "Blender 5.0 VSE compositor modifier (effects reel)", [YouTube](https://www.youtube.com/watch?v=CJvlpxKc_hs): esperava ver os efeitos de compositor aplicados direto nas faixas do VSE e o desempenho.
* Curso "Making Giants" da School of Motion, parte 10 (vídeo da página citada): esperava a construção do "arco de áudio" e o timing de efeitos em quadros.
