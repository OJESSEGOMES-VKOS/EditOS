# 02 · Mundos Visuais (o motor anti-mesmice)

> Blender 5.2 (sonda: `bpy.app.version_string` = "5.2.2 LTS"). Este capítulo existe para atacar o problema 9 da base ("mesma linguagem em tudo") e, de quebra, os problemas 4 (fundo padrão) e 8 (escuro sem intenção). Os dados de cada mundo também estão em `/home/claude/mundos.json`, que é o arquivo que a IA lê na hora de produzir.

## Por que "mundos"

Quando uma IA monta um filme 3D sem direção de arte, ela escolhe a média de tudo: fundo cinza claro, lente de 50 mm, luz de três pontos, look padrão, transição de fusão. O resultado não é feio, é genérico, e dois filmes seguidos saem iguais. Um produtor humano resolve isso com repertório: ele pensa "esse aqui é um filme de luxo escuro" e a partir daí sabe a lente, a luz, a trilha e o tipo de corte.

Um **mundo visual** é esse repertório empacotado. Ele fecha nove decisões de uma vez:

1. paleta na proporção 60/30/10 (fundo, apoio, acento);
2. configuração de cor (view transform e look do AgX, exposição);
3. materiais com valores do Principled BSDF;
4. rig de luz com posição, tamanho, energia relativa, temperatura e grade (spread);
5. linguagem de câmera (lentes, f-stop, movimentos);
6. assinatura de movimento (curva, timing a 30 fps, overshoot);
7. transição característica;
8. tipografia (família, peso, caixa, tracking);
9. trilha e design de som.

Por que empacotar: se cada decisão for tomada isolada, a IA mistura um look Punchy com uma tipografia de luxo e uma transição de brinquedo, e o filme perde identidade. Com o mundo escolhido, as nove decisões já conversam entre si. Sinal de que deu errado: você consegue trocar o produto do filme por outro de categoria diferente e nada no resto do filme "reclama".

## Como a IA usa este capítulo (fluxo de 7 passos)

1. **Ler o briefing e fixar a categoria** entre as 10 colunas da matriz: app, SaaS, serviço, eletrônico, cosmético, bebida, comida, moda, embalagem, logo. Se o produto cabe em duas (ex.: app de delivery de comida), a categoria é a do que aparece na tela por mais tempo.
2. **Ler `historico_mundos.json`** do cliente e da produtora (último filme entregue).
3. **Sortear o mundo** com `rotacao_mundos.py sortear --categoria <cat>`. O sorteio já exclui ✗ da matriz e qualquer mundo que repita um dos 4 eixos do filme anterior. Se o briefing pede um mundo específico, ele vence o sorteio, mas a regra dos 4 eixos continua valendo para lente, paleta e transição.
4. **Abrir a ficha do mundo** (abaixo ou no JSON) e montar a cena com os valores dela.
5. **Renderizar quadros de teste** (EEVEE 540x960 ou Cycles com poucas amostras) e passar o `qa.py`. Faixas boas: contraste 0,20 a 0,38, estourado abaixo de 1,5%.
6. **Ajustar só o que o qa acusar**, na ordem: exposição, energia da principal, cor do fundo, look. Nunca trocar de mundo no meio para "consertar".
7. **Registrar** com `rotacao_mundos.py registrar`. Projeto não registrado é projeto que vai ser repetido.

## Convenções das fichas

- **Azimute:** 0° é a posição da câmera; +90° é a direita do quadro; 180° é atrás do herói; valores negativos são à esquerda. **Elevação:** 0° na altura do herói, 90° em cima.
- **Energia relativa:** a principal vale 1,0. Watts dependem da escala e da distância, por isso cada ficha traz uma nota com a referência em W quando ela foi medida. Escala de referência das provas: herói de 10 a 15 cm com luzes a 0,35 a 0,9 m. Para o celular em escala real (71,5 x 147 x 7,8 mm) a ordem de grandeza é a mesma.
- **Spread** é a grade (honeycomb) da luz de área, em graus. A propriedade existe na API (`Light.spread`, padrão π rad = 180°) [confirmado por sonda no bpy 5.2.2].
- **Temperatura:** `use_temperature = True` e `temperature` em K [confirmado por sonda no bpy 5.2.2]. Onde a tabela diz "cor RGB", a luz usa `color` com `use_temperature = False`.
- **Looks do AgX disponíveis no 5.2.2** (lista exata devolvida pela sonda): `None`, `AgX - Punchy`, `AgX - Greyscale`, `AgX - Very High Contrast`, `AgX - High Contrast`, `AgX - Medium High Contrast`, `AgX - Base Contrast`, `AgX - Medium Low Contrast`, `AgX - Low Contrast`, `AgX - Very Low Contrast`. View transforms: `Standard`, `ACES 1.3`, `ACES 2.0`, `Khronos PBR Neutral`, `AgX`, `Filmic`, `Filmic Log`, `False Color`, `Raw` [confirmado por sonda no bpy 5.2.2]. Nenhum mundo usa Standard: foi ele que lavou os filmes antigos.
- **Nomes de entradas do Principled BSDF** seguem o 5.2.2: `Coat Weight`, `Transmission Weight`, `Sheen Weight`, `Sheen Tint`, `Sheen Roughness`, `Specular IOR Level`, `Thin Film Thickness`, `Thin Film IOR`, `Subsurface Weight` etc. [confirmado por sonda no bpy 5.2.2]. Referência: [Principled BSDF, manual do Blender 5.2 LTS](https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/principled.html).
- **Status de cada mundo:** "calibrado pelo Claude Code" (os 7 já testados na RTX 3050), "[testado no bpy 5.2.2 Cycles CPU, nuvem]" (os 3 provados neste capítulo) ou "[testar no Blender]" (valores de direção de arte ainda sem render).

## Calibração herdada e lições da prova na nuvem

### O que os 7 mundos testados pelo Claude Code ensinaram (não contradizer)

Os mundos estúdio premium, luxo escuro, pop candy, vidro e cromo, neon noturno, natureza (luz de persiana) e argila foram rodados no Blender 5.2.2 com a RTX 3050. As fichas deles respeitam estas regras:

| Regra | Valor | Por quê | Sinal de que foi ignorada |
|---|---|---|---|
| Energia baixa | energia nos watts absolutos da tabela do cap 05 §4.1; se partir de um chute próprio, comece 2 a 3 stops abaixo (× 0,15 a 0,35) e confira no `qa.py` (ver 00 · Padrões da casa) | o primeiro rig estourou 28% do quadro em branco puro | qa.py acusa ESTOURADO, brilho chapado sem textura |
| Fundo afastado e escuro | 1,2 a 1,4× a escala do herói, um tom abaixo do planejado | fundo perto recebe a mesma luz do herói e o contraste some | herói e fundo com a mesma luminância (LAVADO) |
| Grade na principal | spread de 60 a 75° | concentra a luz no herói e não no cenário | fundo mais claro que o produto |
| Bandeiras pretas | planos pretos laterais em vidro e cromo | vidro só existe pelo que reflete; sem preto não há borda | vidro vira bolha cinza sem linha escura |
| Emissão de tela e neon | 1,0 | no AgX a tela desbota acima de cerca de 1,3 | cor da interface lavada, perto do branco |
| Sol por script | `view_layer.update()` antes de ler a direção | a matriz do objeto só atualiza depois do update | sombra apontando para o lado errado |

### O que a prova na nuvem ensinou (3 mundos novos)

Rodei holográfico, papel e recorte e tátil e têxtil no bpy 5.2.2 como módulo, Cycles CPU, 360x360, 32 amostras com denoise, frasco cilíndrico de 40 mm de raio por 120 mm com chanfro de 3 mm e esfera de 30 mm. Script: `/home/claude/codigo/mundos/prova_mundos_novos.py`. Imagens: `/home/claude/provas/mundo_holografico.png`, `mundo_papel.png`, `mundo_textil.png`. [testado no bpy 5.2.2 Cycles CPU, nuvem]

1. **Contorno atrás do herói lava o piso da frente.** No holográfico, os dois contornos coloridos a 150° e -140° atravessavam a área do herói e caíam no chão na frente dele, pintando o primeiro plano de ciano e magenta. Tentei `Light.diffuse_factor = 0` e `visible_diffuse = False` no objeto da luz: o resultado no Cycles não mudou [motivo não verificado]. Fechar o spread para 25° piorou (concentrou o feixe). O que resolveu foi **light linking**: o contorno só ilumina a coleção do herói. Regra: em mundo de fundo escuro, toda luz colorida de contorno usa light linking.
2. **Piso escuro também precisa de `Specular IOR Level` baixo** (0,08 no holográfico). Com 0,5 o piso fosco ainda espelhava os contornos em ângulo rasante.
3. **Filme fino uniforme dá um tom só.** Com `Thin Film Thickness` fixo em 520 nm sobre metal, o frasco ficou só levemente rosado. Ligando um Noise (escala 3) num Map Range de 250 a 750 nm, apareceram as faixas verde e magenta típicas de holograma. Sobre base dielétrica preta o efeito ficou fraco demais; sobre metal claro (`#C4C8D0`, Metallic 1,0, Thin Film IOR 2,0) funcionou.
4. **Papel e têxtil lavam com rebate forte.** Primeira versão do papel: fundo creme `#F4EBDD`, rebate de 4 W, World 0,25: contraste do meu medidor caseiro (p95 menos p5 da luminância) em 0,11 e saturação média 0,10. Correção: fundo kraft `#CDB894`, rebate 1,2 W (cerca de 10% da principal), World 0,08 e exposição -0,3: a saturação subiu para 0,25 e a sombra do sol ficou desenhada. No têxtil, o preenchimento caiu de 3 W para 1 W e o fundo desceu de `#D8CFC2` para `#A89A88`; contraste foi de 0,33 para 0,47 e a penugem (sheen) apareceu na borda da esfera.

O medidor que usei não é o `qa.py` do Claude Code (não estava disponível na nuvem), então os números acima servem para comparar antes e depois, não para comparar com as faixas do qa.py. [testar no Blender] com o qa.py oficial.

```python
# Blender 5.2 | status: confirmado por sonda (bpy 5.2.2, Cycles CPU) | trecho de prova_mundos_novos.py
herois = bpy.data.collections.new("herois")
bpy.context.scene.collection.children.link(herois)
for ob in (frasco, esfera):
    herois.objects.link(ob)
contorno.light_linking.receiver_collection = herois   # o contorno acende só o herói

# filme fino variando: é a variação de espessura que vira arco-íris
nt = mat.node_tree; p = nt.nodes.get("Principled BSDF")
nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 3.0
mr = nt.nodes.new("ShaderNodeMapRange")
mr.inputs["To Min"].default_value = 250; mr.inputs["To Max"].default_value = 750
nt.links.new(nz.outputs["Fac"], mr.inputs["Value"])
nt.links.new(mr.outputs["Result"], p.inputs["Thin Film Thickness"])
```

O filme fino entrou no Principled BSDF na série 4.2 ([pull request #118477](https://projects.blender.org/blender/blender/pulls/118477), [manual 4.2](https://docs.blender.org/manual/en/4.2/render/shader_nodes/shader/principled.html)) e as entradas existem no 5.2.2 [confirmado por sonda no bpy 5.2.2]. Se o filme fino renderiza no EEVEE do 5.2 da mesma forma que no Cycles: [testar no Blender].

## Os mundos

São 19 mundos. Os 16 pedidos de partida mais três próprios: fitas e formas doces (ribbons), arquitetônico com luz dura e monocromático color block. Cada ficha tem tudo que a IA precisa para montar a cena sem inventar.

### 1. Estúdio premium minimalista  
`id: estudio_premium` · status: calibrado pelo Claude Code (Blender 5.2.2, RTX 3050)

**Conceito.** O produto sozinho num vazio grafite, esculpido por luzes grandes e macias, como nos filmes de produto de grande marca de tecnologia.

**Quando usar.** Lançamento de eletrônico, app com aparelho na mão, SaaS que quer parecer hardware de luxo acessível. Quando o desenho do objeto já é bonito e o trabalho é sair da frente dele (é o que a Buck disse sobre o Pixel 4a).

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#25272B` | parede, piso, céu, área vazia |
| Apoio (30%) | `#8C9096` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#3D7BE0` | herói, palavra-chave, botão, logo |
| Extras | `#F2F1EE`, `#0F1012` | luz alta, sombra profunda, variação |

O fundo não é preto: grafite 15% de luminância deixa a silhueta escura do produto se separar. O acento é a cor do produto ou da marca, e só aparece no produto e numa palavra do texto.

**Cor.** View Transform `AgX`, Look `AgX - Medium High Contrast`, Exposure 0. Por quê: contraste de produto sem esmagar sombra; é o padrão seguro da casa.

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| alumínio anodizado | `#9DA1A8` | 0,32 | 1 | 0 | 0 | 1,5 | Anisotropic 0,4; chanfro 0,6 mm em escala real; microrranhura por Noise escala 800 na Roughness (0,28 a 0,36) |
| vidro frontal da tela | `#0B0C0E` | 0,04 | 0 | 1 | 0 | 1,52 | Coat Roughness 0,02; tela por Emission Strength 1,0 (nunca acima no AgX) |
| cerâmica fosca do fundo | `#25272B` | 0,85 | 0 | 0 | 0 | 1,5 | Specular IOR Level 0,3 para o piso não espelhar as luzes |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| principal (softbox) | AREA retangular | 1,2 | 40° | 35° | 1 | 5600 K | 70° |
| contorno | AREA retangular 0,15 x 1,0 | 1 | 150° | 20° | 0,8 | 6500 K | 60° |
| preenchimento | AREA | 1,5 | -60° | 10° | 0,25 | 5200 K | 120° |
| gradiente do fundo | SPOT 40° | 0,3 | 180° | 60° | 0,35 | 5000 K | 40° |

Referência: celular 147 mm a 0,7 m, principal 10 a 15 W (watts absolutos, alinhados com a tabela do cap 05 §4.1: 9,8 W a 0,75 m) (ver 00 · Padrões da casa). Grade 60 a 75° na principal. Fundo afastado 1,3× a altura do produto, iluminado só pelo spot que desenha um halo atrás do produto.

- **Câmera:** lentes 85, 100, 135 mm, f/4. Dolly lento de 3 a 5% do quadro por segundo, órbita de no máximo 25° em 4 s, push-in final de 8%. Nunca giro de 360°.
- **Assinatura de movimento:** curva: Bézier com saída lenta: alças 0,6 na entrada e 0,9 na saída (ease-out longo). Timing a 30 fps: Revelação 36 a 48 quadros; giro de produto 60 a 90 quadros; respiro parado de 12 quadros antes do logo. Overshoot: Não. Assentamento com 2% de desaceleração extra, nunca quique.
- **Transição característica** (`match_cut_giro`): Corte seco no ponto de maior velocidade do giro (match cut de rotação), ou passagem do produto tapando a lente (wipe por objeto).
- **Tipografia:** Inter (OFL) ou Geist (OFL): títulos em 600, caixa mista, tracking -2%; legenda em Inter 500, 50 a 60 px em 1080 (mínimo absoluto 44 px, cap 08 §6.1), tracking 0 (ver 00 · Padrões da casa). Uma frase por tela.
- **Trilha e som:** Eletrônica ambiente minimalista, 90 a 100 BPM, piano processado ou sintetizador de onda senoidal. Foley preciso: clique de botão, deslize de alumínio, um 'whoosh' de ar a cada giro (nada de impacto de trailer).
- **Funciona em:** Eletrônico, app, SaaS, relógio, fone, cosmético de embalagem rígida, logo de empresa de tecnologia.
- **Não funciona em:** Comida e bebida (o vazio grafite esfria o apetite) e serviço local de pessoa para pessoa (fica frio e distante).
- **Erro clássico:** Virar 'estúdio branco infinito': fundo claro, luz por todos os lados, produto sem sombra. Sinal visual: histograma colado na direita, borda do produto sumindo no fundo, contraste abaixo de 0,20 no qa.py (LAVADO).

**Referências:** [Apple, Introducing iPhone Air (Newsroom, 2025)](https://www.apple.com/newsroom/2025/09/introducing-iphone-air-a-powerful-new-iphone-with-a-breakthrough-design/); [ManvsMachine, Apple iMac Pro Behind The Scenes (Vimeo)](https://vimeo.com/260280672); [Tendril, Figure 02 (filme de produto com fundo austero)](https://tendril.studio/work/figure02/).

### 2. Luxo escuro  
`id: luxo_escuro` · status: calibrado pelo Claude Code (Blender 5.2.2, RTX 3050)

**Conceito.** Preto profundo, ouro contido e um contorno fino que desenha a silhueta como fio de luz.

**Quando usar.** Perfume, relógio, bebida destilada, joia, cartão premium, escritório de advocacia ou consultoria de alto ticket. Quando a sensação é 'raro e caro'.

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#0B0A09` | parede, piso, céu, área vazia |
| Apoio (30%) | `#2A2622` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#C9A45C` | herói, palavra-chave, botão, logo |
| Extras | `#E8D9B5`, `#5A4A32` | luz alta, sombra profunda, variação |

Preto morno (vermelho levemente acima do azul) parece veludo; preto azulado parece tela desligada. Ouro nunca saturado: #C9A45C é latão escovado, não amarelo.

**Cor.** View Transform `AgX`, Look `AgX - High Contrast`, Exposure -0,3. Por quê: pretos mais fundos e brilhos mais secos; pede luz de contorno forte para não afundar.

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| ouro escovado | `#D9B26A` | 0,22 | 1 | 0 | 0 | 1,5 | Anisotropic 0,6, Anisotropic Rotation por textura radial; chanfro 0,4 mm |
| vidro de frasco grosso | `#FFFFFF` | 0,02 | 0 | 0 | 1 | 1,5 | Paredes com espessura real de 4 a 6 mm; líquido interno com IOR 1,36 e Base Color #E9C98B |
| laca preta | `#0A0A0A` | 0,08 | 0 | 1 | 0 | 1,5 | Coat Roughness 0,03; Coat IOR 1,5 |
| veludo do apoio | `#1A1512` | 0,9 | 0 | 0 | 0 | 1,5 | Sheen Weight 0,8, Sheen Tint #6B5A44, Sheen Roughness 0,3 |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| contorno esquerdo (strip) | AREA retangular 0,1 x 1,2 | 1,2 | -130° | 15° | 1 | 3800 K | 60° |
| contorno direito (strip) | AREA retangular 0,1 x 1,2 | 1,2 | 135° | 15° | 0,8 | 4200 K | 60° |
| principal recortada | SPOT 25° com borda 0,3 | 0,05 | 30° | 45° | 0,6 | 3200 K | 25° |
| bandeiras pretas | planos pretos 0,6 x 1,2 (Base Color #000000, Roughness 1) | 0,6 | 90° | 0° | 0 | não emite | não se aplica |

Energia baixa: a calibração do Claude Code mostrou que o primeiro chute estourou 28% da imagem; use os watts absolutos da tabela do cap 05 §4.1 e, se partir de um chute próprio, comece 2 a 3 stops abaixo (× 0,15 a 0,35) e confira no `qa.py` (ver 00 · Padrões da casa). As bandeiras pretas a ±90° são o que cria a linha escura no meio do vidro e fazem o contorno aparecer.

- **Câmera:** lentes 100, 135 mm, f/2 (f-stop pela tabela 3.3 do cap 04; o número desta ficha vale só para o fundo fora de foco quando o produto inteiro cabe na faixa nítida calculada; ver 00 · Padrões da casa). Deslize lateral (truck) de 10 cm em 5 s com o contorno 'correndo' na superfície; tilt-up lento revelando o rótulo; foco mudando do detalhe para o produto inteiro (rack focus de 24 quadros).
- **Assinatura de movimento:** curva: Bézier muito suave, alças longas (0,8/0,8); quase linear no meio. Timing a 30 fps: Planos de 90 a 150 quadros; revelação por luz (o contorno acende em 30 quadros). Overshoot: Não. Luxo não quica.
- **Transição característica** (`fusao_escuro`): Fusão por escuro: o quadro apaga até 5% de luminância em 12 quadros e o próximo nasce de um fio de contorno.
- **Tipografia:** Cormorant Garamond (OFL) ou Bodoni Moda (OFL) em 500, caixa alta, tracking +12 a +18%; corpo em Jost (OFL) 300. Ouro só no logotipo.
- **Trilha e som:** Cordas graves e piano esparso, 60 a 72 BPM, ou eletrônica lenta com sub-grave. Texturas: tilintar de vidro, tampa magnética, respiração de ambiente grande. Silêncio de 0,5 s antes do logo.
- **Funciona em:** Perfume, relógio, joia, bebida destilada, cartão e banco premium, advocacia, logo de marca de alto padrão.
- **Não funciona em:** App popular, comida de entrega, produto infantil, SaaS de produtividade (promete exclusividade onde o cliente quer facilidade).
- **Erro clássico:** 'Escuro sem intenção': tudo afundado, herói sem contorno, ouro virando marrom. Sinal: qa.py acusa AFUNDADO ou ESCURO, silhueta do produto some no fundo, ouro sem um ponto de brilho.

**Referências:** [Hornet, La Mer Global Holiday Campaign](https://www.hellohornet.com/projects/la-mer---global-holiday-campaign); [Chanel Bleu de Chanel, 3D CGI Perfume Animation (Behance)](https://www.behance.net/gallery/127909887/Chanel-Bleu-De-Chanel-3D-CGI-Perfume-Animation); [Bang & Olufsen, Beolab 28 (Vimeo)](https://vimeo.com/557990749).

### 3. Pop candy / brinquedo  
`id: pop_candy` · status: calibrado pelo Claude Code (Blender 5.2.2, RTX 3050)

**Conceito.** Cores de bala, formas gordinhas e brilho de plástico injetado: o produto vira brinquedo que dá vontade de apertar.

**Quando usar.** App de consumo, fintech jovem, bebida e snack, marca para público de 16 a 30 anos, lançamento de função divertida.

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#FFB8D2` | parede, piso, céu, área vazia |
| Apoio (30%) | `#7A5CFF` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#FFE14D` | herói, palavra-chave, botão, logo |
| Extras | `#3DDC97`, `#FF5A36` | luz alta, sombra profunda, variação |

Fundo saturado médio (nunca branco) e acento complementar. Regra: no máximo 3 matizes por quadro; o quarto e o quinto ficam para outros planos.

**Cor.** View Transform `AgX`, Look `AgX - Punchy`, Exposure 0. Por quê: satura e aumenta contraste; ótimo para cor de marca forte, perigoso em pele e madeira.

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| plástico brilhante | `#7A5CFF` | 0,25 | 0 | 0,3 | 0 | 1,5 | Coat Roughness 0,1; Subsurface Weight 0,05 com raio 2 mm (dá aspecto de bala); chanfro generoso de 8 a 12% do lado |
| borracha macia | `#FF5A36` | 0,6 | 0 | 0 | 0 | 1,5 | Sheen Weight 0,2; Specular IOR Level 0,35 |
| gel translúcido | `#3DDC97` | 0,1 | 0 | 0 | 0,6 | 1,4 | Subsurface Weight 0,3; bom para gotas e botões |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| principal grande | AREA | 2 | 35° | 50° | 1 | 6000 K | 75° |
| preenchimento | AREA | 2 | -70° | 20° | 0,5 | 6500 K | 120° |
| contorno | AREA | 0,8 | 160° | 30° | 0,6 | 7000 K | 60° |

Proporção principal:preenchimento de 2:1 (não 4:1): sombras suaves e coloridas. Fundo recebe a cor por bounce; mantenha o fundo 1,2× afastado para a sombra de contato não sumir.

- **Câmera:** lentes 35, 50 mm, f/5,6. Câmera com 'pulo': push-in rápido de 12 quadros com assentamento, pan em chicote (whip pan) entre objetos, leve inclinação holandesa de 5°.
- **Assinatura de movimento:** curva: Ease-in-out forte com overshoot e assentamento elástico (2 oscilações). Timing a 30 fps: Antecipação 4 a 6 quadros, ação 8 a 12, overshoot 4, assentamento 8; ciclos de 'squash' de 6 quadros. Overshoot: Sim: 8 a 12% da distância (acima de 12% vira desenho animado, cap 04) (ver 00 · Padrões da casa), squash and stretch de 10% no volume.
- **Transição característica** (`cor_cheia_pop`): Objeto que cresce e enche a tela com a cor do fundo do próximo plano (cut por cor cheia), ou 'pop' com escala 0 para 1,1 para 1 em 10 quadros.
- **Tipografia:** Fredoka (OFL) ou Baloo 2 (OFL) em 700, caixa baixa, tracking -1%; números em Unbounded (OFL) 800.
- **Trilha e som:** Pop eletrônico ou funk melódico, 110 a 125 BPM. Foley de brinquedo: 'boing', estalo de bolha, marimba, plástico batendo. Cada 'pop' visual tem um som.
- **Funciona em:** App, fintech, snack, bebida, cosmético jovem, embalagem, logo de marca jovem.
- **Não funciona em:** Advocacia, saúde séria, luxo, B2B pesado (diminui a credibilidade e soa infantil).
- **Erro clássico:** 'Arco-íris sem regra': 6 cores no mesmo quadro e tudo saturado igual, sem hierarquia. Sinal: o olho não acha o herói em 0,5 s; o produto tem a mesma saturação do fundo.

**Referências:** [Ordinary Folk, Introducing Spline](https://www.ordinaryfolk.co/project/introducing-spline); [Ordinary Folk, Equilibrium (formas geométricas com material tátil)](https://www.ordinaryfolk.co/project/equilibrium); [Buck, Nike White Hot](https://buck.co/work/nike-white-hot).

### 4. Diorama isométrico  
`id: diorama_isometrico` · status: [testar no Blender]

**Conceito.** Um pedaço de mundo recortado numa base, visto de cima em ângulo fixo, onde o serviço ou o app acontece em miniatura.

**Quando usar.** Explicar processo (do pedido à entrega), serviço local, SaaS com várias etapas, logística, imobiliária, clínica. Quando o produto é invisível e precisa de um cenário.

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#F3E9DC` | parede, piso, céu, área vazia |
| Apoio (30%) | `#7FB7A4` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#F26B3A` | herói, palavra-chave, botão, logo |
| Extras | `#2F4858`, `#F6C85F` | luz alta, sombra profunda, variação |

Fundo neutro quente atrás da base; a base é o 30% (verde de maquete), e o acento marca o caminho do processo (o pedido, o carro, o cursor).

**Cor.** View Transform `AgX`, Look `AgX - Medium High Contrast`, Exposure 0. Por quê: contraste de produto sem esmagar sombra; é o padrão seguro da casa.

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| base de maquete | `#7FB7A4` | 0,7 | 0 | 0 | 0 | 1,5 | Chanfro 1,5% do lado da base; corte lateral em #5E8C7C para mostrar 'terra' |
| prédios e móveis foscos | `#F7F1E8` | 0,65 | 0 | 0 | 0 | 1,5 | Variação de 3% de cor por objeto (Object Info > Random) |
| vidro de janela | `#BFD9E6` | 0,1 | 0 | 0 | 0 | 1,5 | Opaco com Roughness baixa (evita custo de transmissão em centenas de janelas) |
| elemento de destaque | `#F26B3A` | 0,35 | 0 | 0,2 | 0 | 1,5 | Emission Strength 0,3 só no item que está 'agindo' |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| sol | SUN, ângulo 2° | 0 | 45° | 50° | 1 | 5400 K | não se aplica |
| céu | World cor #BFD9F2, força 0,3 | 0 | 0° | 90° | 0,3 | 7500 K | não se aplica |
| preenchimento frontal | AREA | 3 | -20° | 30° | 0,15 | 6000 K | 120° |

Sol a 45° de azimute dá sombra para trás e para a direita em todos os blocos, o que lê como 'manhã'. Sol entre 2 e 4 em força Strength; teste com o qa.py antes de subir. [testar no Blender]

- **Câmera:** lentes 85 a 135 mm, ou ortográfica; DoF desligado (cap 01 §8.2) (ver 00 · Padrões da casa). Ortográfica (Orthographic Scale do tamanho da base × 1,3) ou perspectiva de 85 mm a 35° de elevação e 45° de azimute. Movimento: travelling lateral sobre o diorama seguindo o acento; zoom-in ortográfico de 20%.
- **Assinatura de movimento:** curva: Ease-in-out médio; peças entram de baixo com overshoot leve. Timing a 30 fps: Montagem do diorama: peças em cascata com 2 a 3 quadros de defasagem, cada uma 10 quadros; ação principal 45 a 60 quadros. Overshoot: Leve: 5% na entrada das peças, zero no movimento de câmera.
- **Transição característica** (`giro_base`): A base gira 90° e revela o próximo cômodo, ou a câmera sobe e o diorama vira peça de um diorama maior (zoom-out de escala).
- **Tipografia:** Manrope (OFL) em 700 para títulos, caixa mista, tracking -1%; rótulos em Manrope 500 dentro de etiquetas 3D com chanfro.
- **Trilha e som:** Indie pop leve ou lo-fi, 95 a 110 BPM, com glockenspiel e palmas. Foley de miniatura: cliques, encaixe de peça, motor pequeno.
- **Funciona em:** Serviço, SaaS, app de entrega, imobiliária, clínica, logística, explicação de processo.
- **Não funciona em:** Perfume, joia, moda (miniatura tira o peso do objeto de desejo) e revelação de logo curta (não dá tempo de ler o mundo).
- **Erro clássico:** 'Maquete de vitrine sem vida': tudo estático, mesma cor, nenhum caminho. Sinal: o espectador não sabe para onde olhar; nenhum elemento com acento se movendo.

**Referências:** [Anton Egorov, Live Digital Diorama 3D Animation Loop (Behance)](https://www.behance.net/gallery/165424867/Live-Digital-Diorama-3D-Animation-Loop); [Roman Klco, Isometric Rooms (Behance)](https://www.behance.net/gallery/107678093/Isometric-Rooms); [80.lv, Cozy Assembling Bakery Diorama Animation Made in Blender](https://80.lv/articles/cozy-assembling-bakery-diorama-animation-made-in-blender).

### 5. Argila macia (clay)  
`id: argila` · status: calibrado pelo Claude Code (Blender 5.2.2, RTX 3050)

**Conceito.** Tudo parece modelado à mão em massinha fosca: bordas gordas, marca de dedo, cor de giz pastel.

**Quando usar.** Serviço humano (psicologia, escola, clínica infantil, consultoria pequena), app de bem-estar, explicação de conceito abstrato com carinho.

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#E9D8C4` | parede, piso, céu, área vazia |
| Apoio (30%) | `#9DB8A0` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#E2725B` | herói, palavra-chave, botão, logo |
| Extras | `#F2C14E`, `#6C7A9C` | luz alta, sombra profunda, variação |

Pastéis com saturação de 30 a 45%, nunca branco puro. O fundo é a mesma massa em tom de areia; o acento é terracota.

**Cor.** View Transform `AgX`, Look `None` (idêntico a Base Contrast, medido no cap 08), Exposure 0. Por quê: curva neutra; preserva pastel e luz natural sem endurecer (ver 00 · Padrões da casa).

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| massinha | `#E2725B` | 0,75 | 0 | 0 | 0 | 1,4 | Subsurface Weight 0,15, Subsurface Radius (3, 1,5, 1) mm, Subsurface Scale 0,01; Normal por Noise escala 40 força 0,05 (marca de dedo) |
| massinha do fundo | `#E9D8C4` | 0,85 | 0 | 0 | 0 | 1,4 | Mesma receita, Subsurface Weight 0,08 |
| detalhe brilhante | `#2E2A27` | 0,3 | 0 | 0 | 0 | 1,45 | Olhos e botões: único ponto de brilho da cena |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| principal | AREA | 1,5 | 40° | 45° | 1 | 5000 K | 70° |
| preenchimento | AREA | 2 | -60° | 15° | 0,4 | 5600 K | 120° |
| contorno | AREA | 0,6 | 160° | 35° | 0,5 | 6000 K | 60° |

Calibrado pelo Claude Code: energia baixa (watts absolutos da tabela do cap 05 §4.1; chute próprio começa 2 a 3 stops abaixo, × 0,15 a 0,35) (ver 00 · Padrões da casa) e fundo afastado e mais escuro. A sombra de contato é o que vende 'objeto real em cima da mesa'.

- **Câmera:** lentes 50, 65 mm, f/4. Câmera quase parada com tremor de 0,05 a 0,15° de pico, ciclo de 30 a 45 q, com `strength = radians(pico) / 0,33` (cap 04 §5.5) (stop motion), push-in de 6% em 3 s. Opcional: animar em 'dois' (pose a cada 2 quadros: 15 poses por segundo a 30 fps) (ver 00 · Padrões da casa).
- **Assinatura de movimento:** curva: Pose a pose com interpolação Constant (stepped) em 2s, ou Bézier com squash. Timing a 30 fps: Poses a cada 2 quadros; ação 18 a 30 quadros; antecipação 6 quadros. Overshoot: Sim, com squash de 8% e stretch de 12%.
- **Transição característica** (`morph`): Morph de massinha: a forma de um plano se deforma até virar a forma do próximo (shape key de 20 a 30 quadros).
- **Tipografia:** Nunito (OFL) 800 ou Fredoka (OFL) 600, caixa mista, tracking 0; texto pode virar objeto 3D de massinha com chanfro de 15%.
- **Trilha e som:** Acústico leve: ukulele, xilofone, assobio, 90 a 105 BPM. Foley de massinha (squish), madeira, papel.
- **Funciona em:** Serviço, app de bem-estar, educação, comida (biscoito, padaria), embalagem artesanal, logo de marca acolhedora.
- **Não funciona em:** Eletrônico premium, luxo, SaaS técnico de segurança (passa fragilidade).
- **Erro clássico:** 'Plástico de CG pintado de pastel': aspereza uniforme 0,5, sem subsuperfície, arestas vivas. Sinal: reflexo especular nítido em superfície que devia ser massinha, borda dura de 90°.

**Referências:** [Buck, Instacart Fresh (formas simples com realismo tátil)](https://buck.co/work/instacart-fresh); [Gianluca Squillace, Clay Render Breakdown (ArtStation, artigo 80.lv)](https://www.artstation.com/artwork/aGKqz9); [80.lv, Breakdown: Rendering 3D Clay Models in Marmoset Toolbag](https://80.lv/articles/breakdown-rendering-3d-clay-models-in-marmoset-toolbag).

### 6. Vidro e cromo  
`id: vidro_cromo` · status: calibrado pelo Claude Code (Blender 5.2.2, RTX 3050)

**Conceito.** Superfícies que só existem pelo que refletem: vidro grosso, cromo espelhado e faixas de luz desenhando as bordas.

**Quando usar.** Interface de app em camadas de vidro, IA, fintech, produto com vidro ou metal polido, revelação de logo tecnológico.

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#0E1116` | parede, piso, céu, área vazia |
| Apoio (30%) | `#5B6B7F` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#7CE0FF` | herói, palavra-chave, botão, logo |
| Extras | `#E6EEF5`, `#2B3440` | luz alta, sombra profunda, variação |

Vidro não tem cor própria: a paleta mora no que ele reflete. Por isso o fundo é escuro e as faixas de luz (strips) são o desenho.

**Cor.** View Transform `AgX`, Look `AgX - Medium High Contrast`, Exposure 0. Por quê: contraste de produto sem esmagar sombra; é o padrão seguro da casa.

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| vidro grosso | `#FFFFFF` | 0 | 0 | 0 | 1 | 1,5 | Espessura real (Solidify 4 a 8 mm); Thin Film opcional 0; chanfro 1 mm (é ali que a luz desenha) |
| vidro fosco (frosted) | `#F2F6FA` | 0,25 | 0 | 0 | 1 | 1,45 | Para cartões de interface; Roughness 0,2 a 0,35 |
| cromo | `#E8EAEC` | 0,05 | 1 | 0 | 0 | 1,5 | Base Color nunca #FFFFFF; Roughness 0,03 a 0,08 |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| faixa esquerda (strip) | AREA retangular 0,08 x 1,5 | 1,5 | -110° | 10° | 1 | 6500 K | 60° |
| faixa direita (strip) | AREA retangular 0,08 x 1,5 | 1,5 | 115° | 10° | 0,9 | 6500 K | 60° |
| topo (softbox) | AREA | 1 | 0° | 80° | 0,4 | 6000 K | 70° |
| bandeiras pretas | planos pretos 1,0 x 1,5 a ±80° | 1 | 80° | 0° | 0 | não emite | não se aplica |

Calibração do Claude Code: bandeiras pretas laterais são obrigatórias, senão o vidro some (reflete fundo claro e vira bolha cinza). Cycles com vidro ~7 s por quadro a 540x960 na RTX 3050.

- **Câmera:** lentes 50, 85 mm, f/2,8 (f-stop pela tabela 3.3 do cap 04; o número desta ficha vale só para o fundo fora de foco quando o produto inteiro cabe na faixa nítida calculada; ver 00 · Padrões da casa). Órbita curta (15 a 20°) para as faixas correrem nas bordas; slide lateral através de camadas de vidro (parallax); foco que passa de uma camada a outra.
- **Assinatura de movimento:** curva: Ease-in-out preciso (alças 0,5/0,5), deslocamentos curtos. Timing a 30 fps: Camadas de interface entram com 3 quadros de defasagem, 14 quadros cada; giro de 20° em 45 quadros. Overshoot: Mínimo: 2 a 3% nas camadas de UI; zero no vidro sólido.
- **Transição característica** (`wipe_refrativo`): Refração: o próximo plano aparece distorcido através de um bloco de vidro que atravessa a tela (wipe refrativo de 15 quadros).
- **Tipografia:** Space Grotesk (OFL) 500 ou Sora (OFL) 600, caixa mista, tracking -2%; números em JetBrains Mono (OFL).
- **Trilha e som:** Eletrônica limpa, 100 a 115 BPM, pads com reverb longo. Foley de vidro (tink), deslize de cromo, 'shimmer' agudo filtrado.
- **Funciona em:** App, SaaS, fintech, eletrônico, perfume, logo tecnológico.
- **Não funciona em:** Comida, moda têxtil, serviço local acolhedor (fica frio) e cena com luz de todos os lados (vidro sem contraste).
- **Erro clássico:** 'Vidro bolha cinza': vidro sem espessura, sem bandeira preta, refletindo um mundo uniforme. Sinal: nenhuma linha escura dentro do vidro, borda do objeto invisível.

**Referências:** [Tendril, Hublot The Arsham Droplet (titânio, safira, vidro mineral)](https://tendril.studio/work/arsham-droplet); [Bang & Olufsen, Beosound Theatre (Vimeo)](https://vimeo.com/746646949); [Twenty75, Design Movements: 3D Chrome Art](https://www.twenty75.com/projects/3d-chrome/).

### 7. Orgânico e líquido  
`id: organico_liquido` · status: [testar no Blender]

**Conceito.** O produto nasce de um líquido em movimento: ondas, gotas, coroas de respingo e superfícies que escorrem.

**Quando usar.** Bebida, cosmético líquido (sérum, óleo), limpeza, refrigerante, café. Quando o atributo é 'fresco', 'hidratante' ou 'sabor'.

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#0F3B3A` | parede, piso, céu, área vazia |
| Apoio (30%) | `#5FB8A6` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#F4E9C1` | herói, palavra-chave, botão, logo |
| Extras | `#E0F2EE`, `#123230` | luz alta, sombra profunda, variação |

O líquido carrega a cor da marca; o fundo é a versão escura dessa cor (mesma matiz, luminância 15%). Acento creme para brilhos e texto.

**Cor.** View Transform `AgX`, Look `AgX - Punchy`, Exposure -0,2. Por quê: satura e aumenta contraste; ótimo para cor de marca forte, perigoso em pele e madeira.

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| água / bebida | `#FFFFFF` | 0 | 0 | 0 | 1 | 1,333 | Volume Absorption densidade 2 a 8 com a cor da bebida; nunca tingir a Base Color de líquido transparente |
| creme / sérum | `#F4E9C1` | 0,2 | 0 | 0 | 0 | 1,45 | Subsurface Weight 0,6, Subsurface Radius (4, 3, 2) mm |
| lata alumínio | `#C8CCD0` | 0,18 | 1 | 0 | 0 | 1,5 | Condensação: gotas instanciadas com transmissão IOR 1,333 |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| contraluz principal | AREA | 1,5 | 170° | 25° | 1 | 6000 K | 75° |
| lateral de recorte | AREA retangular 0,2 x 1,2 | 1,2 | -100° | 20° | 0,6 | 6500 K | 60° |
| frontal suave | AREA | 2 | 20° | 15° | 0,25 | 5600 K | 120° |

Líquido se ilumina por trás: a contraluz é a principal. Frontal baixo só para não perder o rótulo. Simulação de fluido cara: prefira geometria animada (onda por Displace e Wave Texture) para 6 a 15 s. [testar no Blender]

- **Câmera:** lentes 100, 135 mm, f/2,8. Alta velocidade simulada: tempo desacelerado (o respingo dura 60 quadros), câmera parada ou dolly-in lento de 4%.
- **Assinatura de movimento:** curva: Física desacelerada; câmera em ease-out longo. Timing a 30 fps: Respingo 45 a 75 quadros (câmera lenta 4 a 8×); onda contínua com período de 90 quadros. Overshoot: O líquido pode passar do ponto e voltar (coroa de respingo); a câmera não.
- **Transição característica** (`wipe_liquido`): Onda que cobre a lente e limpa revelando o próximo plano (wipe líquido de 18 quadros), ou gota em close cuja superfície reflete o próximo plano.
- **Tipografia:** Outfit (OFL) 500 ou DM Sans (OFL) 500, caixa baixa, tracking 0; textos com movimento de 'flutuar' de 4 px.
- **Trilha e som:** Downtempo ou house orgânico 100 a 118 BPM. Foley de líquido gravado (gole, bolha, respingo), abertura de lata, gelo.
- **Funciona em:** Bebida, cosmético, limpeza, comida líquida (café, iogurte), embalagem.
- **Não funciona em:** SaaS e serviço sem relação com líquido (vira metáfora gratuita) e eletrônico (sugere estrago).
- **Erro clássico:** 'Água de gelatina': líquido com Base Color colorida e sem volume, parecendo vidro sólido. Sinal: respingo sem gotículas separadas, borda sem refração.

**Referências:** [Buck, Truly Flavor Films (simulação líquida abstrata)](https://buck.co/work/truly-flavor-films); [Buck, Pepsi Black (captura de líquido e CG)](https://buck.co/work/pepsi-black); [Six N. Five, Flow](https://sixnfive.com/projects/flow/).

### 8. Brutalista tech  
`id: brutalista_tech` · status: [testar no Blender]

**Conceito.** Hardware cru: concreto, alumínio fresado, grade de pontos, tipografia monoespaçada e luz de oficina.

**Quando usar.** Gadget com personalidade, ferramenta para desenvolvedor, SaaS de infraestrutura, marca que quer parecer engenharia honesta.

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#D9D7D2` | parede, piso, céu, área vazia |
| Apoio (30%) | `#3A3A38` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#FF3B1F` | herói, palavra-chave, botão, logo |
| Extras | `#F5F4F0`, `#1A1A19` | luz alta, sombra profunda, variação |

Cinza de concreto claro, grafite e um vermelho de botão de emergência (só em 1 elemento por quadro). Nada de gradiente.

**Cor.** View Transform `AgX`, Look `AgX - High Contrast`, Exposure 0. Por quê: pretos mais fundos e brilhos mais secos; pede luz de contorno forte para não afundar.

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| concreto | `#BDBAB3` | 0,88 | 0 | 0 | 0 | 1,5 | Bump por Noise escala 120 força 0,15 e furos por Voronoi; chanfro 2 mm quebrado |
| alumínio fresado | `#A7AAAD` | 0,35 | 1 | 0 | 0 | 1,5 | Anisotropic 0,8 com rotação por textura circular (marca de fresa) |
| plástico técnico | `#F5F4F0` | 0,5 | 0 | 0 | 0 | 1,5 | Specular IOR Level 0,4; peça transparente opcional com Transmission 1,0 e Roughness 0,3 |
| LED / matriz de pontos | `#FF3B1F` | 0,4 | 0 | 0 | 0 | 1,5 | Emission Strength 1,0 em pontos de 0,8 mm |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| principal dura | AREA | 0,3 | 60° | 40° | 1 | 5000 K | 50° |
| rebate frio | AREA | 1,5 | -50° | 10° | 0,2 | 6500 K | 120° |
| contorno | AREA retangular 0,1 x 1 | 1 | 170° | 20° | 0,5 | 6000 K | 60° |

Principal pequena (0,3 m) para sombra definida; fill fraco 5:1. A sombra dura é parte do desenho brutalista. [testar no Blender]

- **Câmera:** lentes 35, 50, 100 mm, f/8. Cortes secos entre planos frontais, laterais e de cima (vistas de desenho técnico); travelling lateral mecânico com velocidade constante; explodido do produto (exploded view).
- **Assinatura de movimento:** curva: Linear ou ease curto (alças 0,2): mecânico de propósito. Timing a 30 fps: Movimentos em múltiplos de 6 quadros (6, 12, 24); explodido 36 quadros com defasagem de 2 por peça. Overshoot: Não. Paradas secas, com 1 quadro de 'tranco'.
- **Transição característica** (`corte_seco_grade`): Corte seco no beat; ou wipe de grade: o quadro é varrido por uma matriz de pontos que acende e apaga (8 quadros).
- **Tipografia:** Space Mono (OFL) ou JetBrains Mono (OFL) 400 caixa alta tracking +5%; título em Doto (OFL, matriz de pontos) ou Archivo (OFL) 800 condensado.
- **Trilha e som:** Eletrônica minimal/IDM 120 a 128 BPM, glitch controlado. Foley de máquina: relé, trava, clique de teclado mecânico, zumbido de 50 Hz.
- **Funciona em:** Eletrônico, SaaS técnico, app de desenvolvedor, ferramenta, embalagem industrial, logo de startup de hardware.
- **Não funciona em:** Cosmético, comida, serviço de cuidado, moda delicada (frieza e aspereza afastam).
- **Erro clássico:** 'Concreto de stock': textura repetida visível, tudo cinza sem acento, luz chapada. Sinal: padrão repetindo a cada 50 cm, nenhum vermelho no quadro, sombra mole.

**Referências:** [Nothing Phone (3) Trailer (YouTube oficial)](https://www.youtube.com/watch?v=kLmCLaj7NxQ); [Yonick Studio, Nothing 3a Pro (conceito de lançamento)](https://yonick.studio/work/nothing-3a-pro); [Tendril, IBM z17](https://tendril.studio/work/ibm-z17).

### 9. Macro cinematográfico  
`id: macro_cinematografico` · status: [testar no Blender]

**Conceito.** A câmera encosta no produto: textura, fibra, gota, engrenagem, com foco raso e luz rasante revelando detalhe que o olho não vê.

**Quando usar.** Provar qualidade de fabricação: relógio, cosmético (textura de creme), comida (crocância), tecido, eletrônico (porta, botão, lente).

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#141210` | parede, piso, céu, área vazia |
| Apoio (30%) | `#6B5B4D` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#E8B04A` | herói, palavra-chave, botão, logo |
| Extras | `#F0E6D8`, `#2A2420` | luz alta, sombra profunda, variação |

Fundo quase preto porque o desfoque precisa de escuro para o bokeh aparecer; a paleta vem do material do produto.

**Cor.** View Transform `AgX`, Look `AgX - Medium High Contrast`, Exposure -0,2. Por quê: contraste de produto sem esmagar sombra; é o padrão seguro da casa.

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| metal usinado | `#B9B2A8` | 0,28 | 1 | 0 | 0 | 1,5 | Microrranhura obrigatória (Noise escala 2000 na Roughness 0,22 a 0,34); chanfro 0,2 mm |
| textura de creme | `#F0E6D8` | 0,35 | 0 | 0 | 0 | 1,45 | Subsurface Weight 0,5; Displacement real (Subdivision + Displace 0,5 mm) |
| poeira e fiapo | `#FFFFFF` | 0,9 | 0 | 0 | 0 | 1,5 | Partículas de 0,05 mm, 30 a 80 por plano, só em contraluz |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| rasante | AREA retangular 0,05 x 0,4 | 0,4 | 80° | 8° | 1 | 4500 K | 45° |
| contraluz | SPOT 20° | 0,02 | 170° | 20° | 0,7 | 5600 K | 20° |
| rebate | AREA | 0,5 | -40° | 20° | 0,1 | 5000 K | 120° |

Em macro, a luz rasante (elevação 5 a 10°) é que revela relevo. Escala real importa: o DOF de Cycles depende da distância em metros; modele em escala 1:1. [testar no Blender]

- **Câmera:** lentes 100, 135, 180 mm, f/2,8 (f-stop pela tabela 3.3 do cap 04; o número desta ficha vale só para o fundo fora de foco quando o produto inteiro cabe na faixa nítida calculada; ver 00 · Padrões da casa). Slider de 2 a 4 cm em 5 s, rack focus de 30 quadros, rotação de produto 10° muito lenta. Câmera a 8 a 20 cm do objeto.
- **Assinatura de movimento:** curva: Quase linear com ease nas pontas (alças 0,3). Timing a 30 fps: Planos de 90 a 120 quadros; rack focus 24 a 36 quadros. Overshoot: Não.
- **Transição característica** (`desfoque`): Desfoque total (foco vai a zero em 10 quadros) e o próximo plano nasce desfocado e entra em foco; ou match cut de forma (gota vira lente).
- **Tipografia:** Fraunces (OFL) 400 itálico para frases curtas, ou Instrument Serif (OFL); dados técnicos em IBM Plex Mono (OFL) 400, tracking +3%.
- **Trilha e som:** Ambiente minimal 70 a 85 BPM ou sem batida; foley ampliado: tique de relógio, estalo de crocância, fricção de tecido gravada de perto.
- **Funciona em:** Relógio, eletrônico, cosmético, comida, bebida, moda (tecido), embalagem premium.
- **Não funciona em:** SaaS e serviço (não há superfície para mostrar) e logo (macro de letra só funciona com logo físico).
- **Erro clássico:** 'Macro sem escala': objeto modelado em escala errada, então o desfoque fica de maquete (tilt-shift sem querer) ou some. Sinal: tudo nítido a 2 cm da lente, ou o produto inteiro parece brinquedo.

**Referências:** [Tendril, Hublot MP-10 (macro com luz dramática)](https://tendril.studio/work/mp-10); [Michael Sapryhin, 3D product animation ELYSIUM Perfume (Behance)](https://www.behance.net/gallery/106660823/3D-product-design-animation-ELYSIUM-PERFUME); [ManvsMachine, Nike Flyknit (Vimeo)](https://vimeo.com/162826208).

### 10. Papel e recorte  
`id: papel_recorte` · status: [testado no bpy 5.2.2 Cycles CPU, nuvem]

**Conceito.** Camadas de cartolina recortada, empilhadas com sombra dura entre elas, como um teatro de papel iluminado pelo sol.

**Quando usar.** Serviço local, educação, ONG, comida artesanal, marca com história de origem, explicação passo a passo com calor humano.

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#CDB894` | parede, piso, céu, área vazia |
| Apoio (30%) | `#E3D3B6` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#E2553F` | herói, palavra-chave, botão, logo |
| Extras | `#F2B33D`, `#2F5D62` | luz alta, sombra profunda, variação |

Kraft e creme como base (são cor de papel de verdade), acento terracota e amarelo mostarda. Testado: com fundo creme claro (#F4EBDD) e rebate forte a imagem lavou.

**Cor.** View Transform `AgX`, Look `AgX - Medium High Contrast`, Exposure -0,3. Por quê: contraste de produto sem esmagar sombra; é o padrão seguro da casa.

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| cartolina | `#F2B33D` | 0,92 | 0 | 0 | 0 | 1,5 | Subsurface Weight 0,05 (luz atravessando a borda); espessura real 0,5 mm (Solidify); Bump por Noise escala 300 força 0,03 (fibra) |
| papel kraft do fundo | `#CDB894` | 0,95 | 0 | 0 | 0 | 1,5 | Specular IOR Level 0,2 |
| papel colorido de acento | `#E2553F` | 0,95 | 0 | 0 | 0 | 1,5 | Borda com corte levemente irregular (Displace 0,2 mm) |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| sol duro | SUN, ângulo 1,5° | 0 | 55° | 38° | 1 | 5200 K | não se aplica |
| rebate | AREA | 1,2 | -60° | 15° | 0,12 | 6500 K | 120° |
| céu | World #DDE6F0 força 0,08 | 0 | 0° | 90° | 0,04 | 7500 K | não se aplica |

Valores da prova na nuvem: sol Strength 2,2; rebate 1,2 W a 0,8 m; World 0,08. Com rebate 4 W e World 0,25 a imagem lavou (qa caseiro: contraste p95-p5 caiu, saturação média 0,10). Corrigido para saturação 0,25.

- **Câmera:** lentes 35, 50 mm, f/8. Frontal e plana (camadas paralelas ao sensor), travelling lateral para parallax entre camadas, push-in através de camadas como cortina.
- **Assinatura de movimento:** curva: Stepped com pose a cada 2 quadros (15 poses por segundo a 30 fps) para parecer stop motion (ver 00 · Padrões da casa); ou ease-out com leve 'flap' de papel. Timing a 30 fps: Camadas entram com 3 quadros de defasagem; dobra de papel 12 a 18 quadros. Overshoot: Leve (4%) com dobra; papel balança e assenta.
- **Transição característica** (`wipe_papel`): Uma camada de papel desliza e cobre o quadro (wipe de cartolina com sombra), ou dobradura (fold) de 15 quadros.
- **Tipografia:** Bricolage Grotesque (OFL) 700 ou Caveat (OFL) para anotação à mão; caixa mista, tracking 0; letras recortadas em papel com sombra de 2 mm.
- **Trilha e som:** Folk acústico ou indie com palmas, 95 a 110 BPM. Foley de papel: rasgo, dobra, tesoura, papel deslizando.
- **Funciona em:** Serviço, educação, comida, embalagem, app de nicho acolhedor, logo de marca artesanal.
- **Não funciona em:** Eletrônico premium, perfume, fintech séria (parece barato ou improvisado).
- **Erro clássico:** 'Papel de plástico': Roughness 0,5, sem espessura, sem sombra entre camadas. Sinal: brilho especular no papel, camadas coladas sem sombra, borda perfeita de vetor.

**Referências:** [Buck, Lily's Gummy Bears (mundo de papel em 3D)](https://buck.co/work/lilys-gummy-bears); [Buck, Sherwin-Williams Paint Chips](https://buck.co/work/sherwin-williams); [80.lv, Surreal Papercraft-Style World Made in Blender](https://80.lv/articles/check-out-this-surreal-papercraft-style-world-made-in-blender).

### 11. Retrofuturo  
`id: retrofuturo` · status: [testar no Blender]

**Conceito.** O futuro como foi imaginado entre 1970 e 2000: cromo aerografado, horizonte em degradê, formas de nave e capa de disco.

**Quando usar.** Lançamento com nostalgia, música, games, tênis, bebida energética, evento, app que quer parecer 'clássico instantâneo'.

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#2B1B3D` | parede, piso, céu, área vazia |
| Apoio (30%) | `#F2709C` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#FFD36E` | herói, palavra-chave, botão, logo |
| Extras | `#5FC3E4`, `#0E0A16` | luz alta, sombra profunda, variação |

Degradê de pôr do sol no horizonte (roxo para rosa para amarelo) e cromo refletindo esse céu. Evite neon verde (é outro mundo).

**Cor.** View Transform `AgX`, Look `AgX - Punchy`, Exposure 0. Por quê: satura e aumenta contraste; ótimo para cor de marca forte, perigoso em pele e madeira.

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| cromo aerografado | `#E6E1EA` | 0,12 | 1 | 0 | 0 | 1,5 | Reflete World com gradiente; chanfros gordos (5 a 8% do lado) para pegar o céu |
| plástico de época | `#F2709C` | 0,4 | 0 | 0,3 | 0 | 1,5 | Coat Roughness 0,2 |
| chão de grade | `#0E0A16` | 0,6 | 0 | 0 | 0 | 1,5 | Linhas de grade com Emission Strength 0,8 cor #F2709C |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| céu em gradiente | World: Gradient Texture #2B1B3D para #F2709C para #FFD36E, força 0,6 | 0 | 180° | 5° | 1 | cor RGB | não se aplica |
| sol baixo | SUN, ângulo 3° | 0 | 175° | 6° | 0,6 | 3500 K | não se aplica |
| preenchimento frontal | AREA | 2 | 10° | 20° | 0,2 | 6500 K | 120° |

O World com gradiente é a luz principal (é o que o cromo reflete). Sol rasante atrás cria contorno quente. [testar no Blender]

- **Câmera:** lentes 24, 35, 85 mm, f/5,6. Dolly-in frontal em direção ao horizonte, órbita heroica de baixo para cima (câmera a 10 cm do chão olhando para cima), zoom óptico rápido de época (zoom de 35 para 85 mm em 20 quadros).
- **Assinatura de movimento:** curva: Ease-in-out clássico com pequeno overshoot. Timing a 30 fps: Planos de 45 a 60 quadros; logo entra em 20 quadros com brilho (glint) de 8 quadros. Overshoot: Leve (5%) nos objetos; o glint é o 'impacto'.
- **Transição característica** (`glint`): Brilho em estrela (glint) que estoura e limpa o quadro em 6 quadros, ou linhas de varredura (scanline wipe).
- **Tipografia:** Monoton (OFL) ou Righteous (OFL) para títulos, caixa alta, tracking +8%; texto corrido em Outfit (OFL) 400. Letras com bisel cromado só no logo.
- **Trilha e som:** Synthwave/outrun 100 a 118 BPM, bateria eletrônica com reverb gated, arpejo de sintetizador analógico. Foley de fita (rebobinar), 'zap' de laser suave.
- **Funciona em:** Tênis, games, bebida, evento, música, app de entretenimento, logo com apelo nostálgico.
- **Não funciona em:** Saúde, advocacia, B2B sério e luxo contemporâneo (soa fantasia e kitsch).
- **Erro clássico:** 'Pôster de synthwave genérico': sol listrado, grade roxa e palmeira em tudo. Sinal: o produto é intercambiável; a cena seria a mesma sem ele.

**Referências:** [Buck, Spotify Premium (ilustrações aerografadas estilo capa dos anos 70)](https://buck.co/work/spotify-premium); [Creative Review, Air Max Day '18 by ManvsMachine (estética anos 90)](https://www.creativereview.co.uk/air-max-day-18-by-manvsmachine/); [Florian Renner, Retrowave (Vimeo, Cinema 4D)](https://vimeo.com/117890578).

### 12. Neon noturno  
`id: neon_noturno` · status: calibrado pelo Claude Code (Blender 5.2.2, RTX 3050)

**Conceito.** Cidade molhada à noite: fontes de luz coloridas que aparecem no quadro, reflexo no chão e névoa leve.

**Quando usar.** App de entrega noturna, bar, energético, games, moda urbana, tênis, evento, fintech jovem.

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#07080F` | parede, piso, céu, área vazia |
| Apoio (30%) | `#1F2A4A` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#FF2E88` | herói, palavra-chave, botão, logo |
| Extras | `#29E3FF`, `#FFB547` | luz alta, sombra profunda, variação |

Dois neons complementares (magenta e ciano) e um âmbar de poste. O fundo é preto azulado; a cor vem só das fontes visíveis.

**Cor.** View Transform `AgX`, Look `AgX - Punchy`, Exposure -0,3. Por quê: satura e aumenta contraste; ótimo para cor de marca forte, perigoso em pele e madeira.

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| tubo de neon | `#FF2E88` | 0,3 | 0 | 0 | 0 | 1,5 | Emission Strength 1,0 (no AgX a cor desbota acima de ~1,3); tubo de vidro externo opcional |
| asfalto molhado | `#121317` | 0,15 | 0 | 0 | 0 | 1,5 | Roughness variando 0,05 a 0,5 por Noise (poças); Normal com Noise fino |
| metal pintado | `#2A2F3A` | 0,4 | 0,6 | 0,3 | 0 | 1,5 | Coat Roughness 0,1 |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| neon magenta (fonte visível) | AREA retangular 0,04 x 1,2 ou malha emissiva | 1,2 | -120° | 20° | 1 | cor RGB | 90° |
| neon ciano (fonte visível) | AREA retangular 0,04 x 1,0 | 1 | 110° | 15° | 0,8 | cor RGB | 90° |
| poste âmbar | SPOT 35° | 0,1 | 30° | 70° | 0,5 | 2700 K | 35° |
| névoa | Volume Scatter em cubo, densidade 0,3 (sutil) a 1,0 (forte) em cena de mesa; 0,01 a 0,03 só em cenário de 5 m ou mais (cap 05 §9.1) (ver 00 · Padrões da casa) | 0 | 0° | 0° | 0 | não emite | não se aplica |

Calibrado pelo Claude Code. Emissão do neon em 1,0; o brilho do quadro vem do reflexo no chão molhado, não de subir a energia. Névoa baixa senão o contraste some.

- **Câmera:** lentes 24, 35, 50 mm, f/1,8 (f-stop pela tabela 3.3 do cap 04; o número desta ficha vale só para o fundo fora de foco quando o produto inteiro cabe na faixa nítida calculada; ver 00 · Padrões da casa). Steadicam simulada (tremor de 0,05 a 0,15° de pico, ciclo de 30 a 45 q, com `strength = radians(pico) / 0,33`, cap 04 §5.5), travelling lateral rente ao chão para o reflexo correr, bokeh grande de luzes de fundo.
- **Assinatura de movimento:** curva: Ease-out com aceleração de entrada (whip) e cortes no beat. Timing a 30 fps: Planos curtos de 20 a 40 quadros; flicker de neon de 2 quadros em 1 de cada 3 cortes. Overshoot: Pouco (3%); energia vem do corte, não do quique.
- **Transição característica** (`flash_neon`): Flash de luz neon (2 quadros a 80% de branco tingido) ou passagem de carro/objeto escuro em primeiro plano.
- **Tipografia:** Chakra Petch (OFL) 600 ou Unbounded (OFL) 700, caixa alta, tracking +6%; título pode ser neon 3D com tubo de 8 mm.
- **Trilha e som:** Trap, phonk ou synthwave escura, 130 a 150 BPM (ou 70 em meio tempo). Foley: chuva, zumbido de reator de neon, carro passando, poça.
- **Funciona em:** App, games, bebida energética, moda urbana, tênis, evento, logo de marca noturna.
- **Não funciona em:** Cosmético natural, comida saudável, serviço infantil, advocacia (passa perigo e noite).
- **Erro clássico:** 'Tudo neon': 10 tubos de 5 cores, emissão alta, quadro rosa uniforme. Sinal: cor desbotada perto do branco, sem área preta de verdade, herói sem contorno próprio.

**Referências:** [Hornet, 5 Gum: Overstimulate Your Senses](https://www.hellohornet.com/projects/5-gum---overstimulate-your-senses); [Visual Scientist, NEON NIGHT (Behance)](https://www.behance.net/gallery/62430835/NEON-NIGHT); [Ordinary Folk, Nightdrive](https://www.ordinaryfolk.co/project/nightdrive).

### 13. Natureza e luz do sol  
`id: natureza_sol` · status: calibrado pelo Claude Code (Blender 5.2.2, RTX 3050)

**Conceito.** Luz de janela ou de fim de tarde atravessando folhas e persiana, sombras desenhadas no produto, materiais naturais.

**Quando usar.** Cosmético natural, café, comida, bebida, casa e decoração, clínica, bem-estar, serviço de cuidado.

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#E8DCC8` | parede, piso, céu, área vazia |
| Apoio (30%) | `#8A9A6B` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#D9822B` | herói, palavra-chave, botão, logo |
| Extras | `#F6F1E7`, `#4A3F35` | luz alta, sombra profunda, variação |

Pedra clara, verde sálvia e âmbar de sol. A cor do sol (3200 a 4300 K) contra sombra levemente azulada é o que dá vida.

**Cor.** View Transform `AgX`, Look `None` (idêntico a Base Contrast, medido no cap 08), Exposure 0. Por quê: curva neutra; preserva pastel e luz natural sem endurecer (ver 00 · Padrões da casa).

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| pedra / travertino | `#E2D6C2` | 0,75 | 0 | 0 | 0 | 1,5 | Bump por Noise escala 60 força 0,1; poros por Voronoi |
| madeira clara | `#C9A57A` | 0,55 | 0 | 0,1 | 0 | 1,5 | Textura CC0 (ex.: Poly Haven); chanfro 1 mm |
| folha | `#6E8A4E` | 0,45 | 0 | 0 | 0 | 1,5 | Subsurface Weight 0,3 ou Translucent mix 0,4 (folha acesa por trás) |
| vidro âmbar | `#FFFFFF` | 0,02 | 0 | 0 | 1 | 1,5 | Volume Absorption cor #B5651D densidade 15 |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| sol | SUN, ângulo 0,5 a 1,5° | 0 | 60° | 25° | 1 | 4000 K | não se aplica |
| gobo (persiana ou folhas) | planos recortados entre sol e produto | 0 | 60° | 25° | 0 | não emite | não se aplica |
| céu / rebate frio | AREA | 2,5 | -60° | 30° | 0,15 | 7500 K | 120° |

Calibrado pelo Claude Code como 'luz natural (persiana)'. view_layer.update() antes de ler a direção do sol por script. A sombra do gobo é o desenho do quadro.

- **Câmera:** lentes 50, 85 mm, f/2,8 (f-stop pela tabela 3.3 do cap 04; o número desta ficha vale só para o fundo fora de foco quando o produto inteiro cabe na faixa nítida calculada; ver 00 · Padrões da casa). Câmera quase parada; o movimento é da luz (gobo de folhas balançando 2 a 3° a 0,3 Hz); dolly-in lento de 5%.
- **Assinatura de movimento:** curva: Senoide suave para folhas; ease-out longo para produto. Timing a 30 fps: Planos de 90 a 150 quadros; sombra de folha com ciclo de 60 a 90 quadros. Overshoot: Não.
- **Transição característica** (`passagem_sombra`): Passagem de sombra (uma nuvem ou folha grande escurece o quadro em 10 quadros e o próximo nasce iluminado) ou fusão de 15 quadros.
- **Tipografia:** Fraunces (OFL) 300 a 500 com eixo 'soft', caixa mista, tracking -1%; corpo em DM Sans (OFL) 400.
- **Trilha e som:** Acústico/folk com violão dedilhado, 70 a 90 BPM; ambiente de pássaros distantes, vento, xícara na mesa.
- **Funciona em:** Cosmético, comida, bebida, serviço de cuidado, clínica, casa, moda natural, embalagem sustentável.
- **Não funciona em:** Games, fintech noturna, SaaS de segurança (calma demais para urgência).
- **Erro clássico:** 'Sol de meio-dia chapado': sol alto a 70°, sem gobo, sombra curta embaixo do objeto. Sinal: produto sem desenho de luz, sombra preta curta, cena parecendo foto de catálogo.

**Referências:** [Aesop, Harvest Campaign (Vimeo)](https://vimeo.com/461743318); [Buck, 7UP (CG com luz de sol quente)](https://buck.co/work/7up); [Six N. Five, The Japanese Garden](https://sixnfive.com/projects/the-japanese-garden/).

### 14. Holográfico e iridescente  
`id: holografico` · status: [testado no bpy 5.2.2 Cycles CPU, nuvem]

**Conceito.** Superfícies que mudam de cor conforme o ângulo, como bolha de sabão, CD ou película holográfica, sobre fundo escuro arroxeado.

**Quando usar.** Cosmético jovem, IA, cripto, música, moda Y2K, lançamento 'mágico', embalagem especial.

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#141226` | parede, piso, céu, área vazia |
| Apoio (30%) | `#2A2048` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#C4C8D0` | herói, palavra-chave, botão, logo |
| Extras | `#FF59C7`, `#4DE6FF`, `#B7FF8A` | luz alta, sombra profunda, variação |

O acento é prata neutro: as cores do arco-íris nascem do filme fino (thin film), não da Base Color. Fundo roxo escuro para as faixas coloridas saltarem.

**Cor.** View Transform `AgX`, Look `AgX - Punchy`, Exposure 0,8. Por quê: satura e aumenta contraste; ótimo para cor de marca forte, perigoso em pele e madeira.

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| metal holográfico | `#C4C8D0` | 0,12 | 1 | 0 | 0 | 1,5 | Thin Film Thickness variando 250 a 750 nm (Noise escala 3 > Map Range), Thin Film IOR 2,0. Filme uniforme dá um tom só; é a variação que vira faixa de arco-íris |
| bolha / vidro iridescente | `#E9E4F2` | 0,05 | 0 | 0 | 1 | 1,45 | Thin Film Thickness 380 nm, Thin Film IOR 1,33 |
| piso | `#0D0B16` | 0,85 | 0 | 0 | 0 | 1,5 | Specular IOR Level 0,08 (piso não pode espelhar os contornos) |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| principal | AREA | 0,5 | 55° | 50° | 1 | 6500 K | 45° |
| tiras laterais (strip) | AREA retangular 0,05 x 0,5, light linking só no herói | 0,5 | -75° | 8° | 0,85 | 6500 K | 90° |
| contorno magenta | AREA cor (1,0, 0,35, 0,85), light linking só no herói | 0,25 | 150° | 20° | 2,3 | cor RGB | 30° |
| contorno ciano | AREA cor (0,3, 0,9, 1,0), light linking só no herói | 0,25 | -140° | 20° | 2 | cor RGB | 30° |

Prova na nuvem (herói de 12 cm, luzes a 0,35 a 0,6 m): principal 6 W, tiras 5 W, contornos 14 e 12 W, World #2A2048 força 0,25, exposição +0,8. Sem light linking os contornos lavaram o piso da frente (o feixe atravessa o herói e cai no chão); Light.diffuse_factor = 0 não resolveu no Cycles, light linking resolveu.

- **Câmera:** lentes 85, 100 mm, f/2,8 (f-stop pela tabela 3.3 do cap 04; o número desta ficha vale só para o fundo fora de foco quando o produto inteiro cabe na faixa nítida calculada; ver 00 · Padrões da casa). Órbita lenta de 30 a 40° (a cor só muda se o ângulo muda), rotação do próprio objeto em 90 quadros, push-in de 6%.
- **Assinatura de movimento:** curva: Ease-in-out suave; rotação contínua com velocidade constante no meio. Timing a 30 fps: Giro de 45° em 60 a 90 quadros; brilho percorre a superfície em 30 quadros. Overshoot: Não no objeto; leve (4%) em elementos gráficos.
- **Transição característica** (`varredura_cor`): Varredura de cor: uma faixa iridescente atravessa o quadro e troca o plano (12 quadros), ou dissolve por filme fino (o objeto vira bolha e estoura).
- **Tipografia:** Syne (OFL) 700 a 800, caixa alta, tracking +4%; ou Unbounded (OFL) 500. Texto em prata neutro, nunca em degradê arco-íris.
- **Trilha e som:** Hyperpop suave ou eletrônica etérea 120 a 140 BPM; texturas de 'shimmer', sinos, vidro friccionado.
- **Funciona em:** Cosmético, app, moda, embalagem especial, música, logo de marca jovem ou de tecnologia.
- **Não funciona em:** Comida, serviço tradicional, advocacia, B2B industrial (parece efeito gratuito).
- **Erro clássico:** 'Degradê arco-íris pintado': textura de gradiente na Base Color em vez de filme fino. Sinal: as cores não mudam quando a câmera gira; o objeto parece adesivo.

**Referências:** [Six N. Five, Holo-Scandinavian](https://sixnfive.com/projects/holo-scandinavian/); [assetpro.design, 3D Iridescent HD Shapes (Behance)](https://www.behance.net/gallery/188630181/3D-Iridescent-HD-Shapes); [Maryna Polonska, Animated Iridescent Gradients v.3 (Behance)](https://www.behance.net/gallery/163777045/Animated-Iridescent-Gradients-v3).

### 15. Editorial de revista  
`id: editorial_revista` · status: [testar no Blender]

**Conceito.** O quadro é uma página de revista de moda: grid tipográfico forte, muito espaço vazio, produto fotografado como capa.

**Quando usar.** Moda, cosmético, marca pessoal, consultoria criativa, agência, lançamento de coleção, SaaS de criadores.

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#EFEBE4` | parede, piso, céu, área vazia |
| Apoio (30%) | `#1C1B19` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#C23B22` | herói, palavra-chave, botão, logo |
| Extras | `#B9B1A4`, `#FFFFFF` | luz alta, sombra profunda, variação |

Papel off-white, tinta preta e um vermelho editorial só para um número ou uma palavra. A cor vem do produto fotografado.

**Cor.** View Transform `AgX`, Look `AgX - Medium High Contrast`, Exposure 0. Por quê: contraste de produto sem esmagar sombra; é o padrão seguro da casa.

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| fundo de papel fotográfico | `#EFEBE4` | 0,9 | 0 | 0 | 0 | 1,5 | Ciclorama com curva de raio 40 cm; Specular IOR Level 0,2 |
| tecido do produto | `#C23B22` | 0,8 | 0 | 0 | 0 | 1,5 | Sheen Weight 0,5, Sheen Roughness 0,4 |
| tipografia 3D | `#1C1B19` | 0,6 | 0 | 0 | 0 | 1,5 | Extrusão 2 a 4% da altura da letra, chanfro 0,5% |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| beauty dish (principal) | AREA disco | 0,55 | 10° | 40° | 1 | 5600 K | 60° |
| rebate abaixo | AREA | 1 | 0° | -20° | 0,3 | 5600 K | 120° |
| recorte do fundo | AREA | 1,5 | 180° | 30° | 0,5 | 6000 K | 75° |

Luz frontal alta de moda (beauty dish) com sombra curta embaixo do queixo do produto; o fundo recebe luz própria para ficar 0,5 stop acima do produto. [testar no Blender]

- **Câmera:** lentes 85, 135 mm, f/5,6. Quadros fixos compostos como página (produto no terço, texto na coluna); cortes rápidos em sequência de 'virar página'; zoom digital de 3% em 2 s.
- **Assinatura de movimento:** curva: Ease-out forte nos textos (entra rápido, assenta devagar); objeto quase parado. Timing a 30 fps: Cada 'página' dura 30 a 45 quadros; texto entra em 8 a 10 quadros com máscara de linha. Overshoot: Não. Elegância vem da parada exata.
- **Transição característica** (`virar_pagina`): Virar página (page turn) 10 quadros, ou corte seco com o grid tipográfico permanecendo fixo enquanto a imagem troca.
- **Tipografia:** Instrument Serif (OFL) ou Playfair Display (OFL) em tamanhos grandes, caixa mista, tracking -3%; apoio em Inter (OFL) 500 caixa alta tracking +10%, 11 a 13 px.
- **Trilha e som:** House minimal ou jazz eletrônico, 115 a 122 BPM; foley de flash de câmera, obturador, virar página.
- **Funciona em:** Moda, cosmético, perfume, marca pessoal, agência, consultoria, embalagem premium, logo.
- **Não funciona em:** App de utilidade, comida de entrega, B2B técnico (vira pose sem informação).
- **Erro clássico:** 'Texto por cima de tudo': tipografia sem grid, pequena e centralizada, competindo com o produto. Sinal: margem desigual, mais de 2 famílias, linha de texto sobre a área de maior detalhe.

**Referências:** [Buck, Amazon Echo Buds (tipografia expressiva e mundo surreal)](https://buck.co/work/amazon-echo-buds); [Vucko, Spotify Wrapped 2024](https://vucko.co/work/spotify-wrapped-2024); [Buck, Meta Connect 23 (tipografia expressiva com objetos 3D)](https://buck.co/work/meta-connect-23).

### 16. Tátil e têxtil  
`id: tatil_textil` · status: [testado no bpy 5.2.2 Cycles CPU, nuvem]

**Conceito.** Tudo é macio: feltro, veludo, tricô, espuma. Luz rasante mostra a penugem e dá vontade de tocar.

**Quando usar.** Moda, calçado, casa, colchão, produto de bebê, fone com almofada, marca de conforto, serviço de cuidado.

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#A89A88` | parede, piso, céu, área vazia |
| Apoio (30%) | `#7A8C6E` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#6E2E3A` | herói, palavra-chave, botão, logo |
| Extras | `#D9E3CF`, `#E8B7C0` | luz alta, sombra profunda, variação |

Tons terrosos médios. Testado: fundo bege claro (#D8CFC2) com preenchimento 3 W ficou lavado; descer o fundo para #A89A88 e o preenchimento para 1 W resolveu.

**Cor.** View Transform `AgX`, Look `AgX - Medium High Contrast`, Exposure -0,2. Por quê: contraste de produto sem esmagar sombra; é o padrão seguro da casa.

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| feltro | `#7A8C6E` | 0,95 | 0 | 0 | 0 | 1,5 | Sheen Weight 1,0, Sheen Tint #D9E3CF, Sheen Roughness 0,35; Bump por Noise escala 400 força 0,2 |
| veludo | `#6E2E3A` | 0,9 | 0 | 0 | 0 | 1,5 | Sheen Weight 1,0, Sheen Tint #E8B7C0, Sheen Roughness 0,25 |
| tricô | `#B5A795` | 0,9 | 0 | 0 | 0 | 1,5 | Geometria de laçada instanciada ou textura com Displacement; Sheen 0,6 |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| principal rasante | AREA | 0,8 | 70° | 18° | 1 | 4300 K | 65° |
| contorno | AREA | 0,4 | 160° | 30° | 0,7 | 5600 K | 60° |
| preenchimento | AREA | 1,5 | -50° | 10° | 0,07 | 4800 K | 120° |

Prova na nuvem (herói de 12 cm, luzes a 0,6 a 0,9 m): principal 14 W, contorno 10 W, preenchimento 1 W, World 0,05. A penugem (sheen) só aparece na borda com luz rasante e contorno; com luz frontal o tecido vira plástico fosco.

- **Câmera:** lentes 85, 100 mm, f/4. Slider lento, close de textura, objeto sendo pressionado (afundar 8% e voltar).
- **Assinatura de movimento:** curva: Ease-in-out macio com assentamento lento (soft body ou shape key). Timing a 30 fps: Afundar 10 quadros, voltar 20 quadros; tecido cai em 30 a 45 quadros (simulação de tecido). Overshoot: Leve, amortecido: 3% e um único retorno.
- **Transição característica** (`wipe_tecido`): Tecido que cai e cobre a câmera (cloth wipe de 20 quadros) ou corte por textura (close de fibra vira o fundo do próximo plano).
- **Tipografia:** Jost (OFL) 400 ou Quicksand (OFL) 600, caixa baixa, tracking +2%; texto bordado opcional (Displacement de ponto).
- **Trilha e som:** Lo-fi ou R&B lento, 75 a 90 BPM; foley de tecido gravado perto, almofada, zíper.
- **Funciona em:** Moda, calçado, casa, cosmético de cuidado, produto infantil, fone, embalagem de presente.
- **Não funciona em:** SaaS, fintech, eletrônico de alta precisão (macio vira sinônimo de impreciso).
- **Erro clássico:** 'Tecido sem penugem': Roughness 0,5 e sheen zero, luz de frente. Sinal: borda do objeto escura e dura em vez de clarear.

**Referências:** [Tendril, Cash App (texturas fofas e espumosas)](https://tendril.studio/work/cashapp); [ManvsMachine, Flyknit (página do projeto)](https://mvsm.com/project/flyknit); [Buck, Woolmark](https://buck.co/work/woolmark).

### 17. Fitas e formas doces (ribbons)  
`id: fitas_ribbons` · status: [testar no Blender]

**Conceito.** Fitas largas e curvas de material sedoso que dançam em volta do produto ou do logo e guiam o olhar.

**Quando usar.** Revelação de logo, vinheta de marca, lançamento de sistema operacional ou app, cosmético, chocolate, presente.

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#1B2A4A` | parede, piso, céu, área vazia |
| Apoio (30%) | `#5B7BD5` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#FFC2A1` | herói, palavra-chave, botão, logo |
| Extras | `#A7C7FF`, `#F4F1FF` | luz alta, sombra profunda, variação |

Fundo de uma matiz, fitas em degradê dentro da mesma família e um acento quente na fita líder.

**Cor.** View Transform `AgX`, Look `AgX - Medium High Contrast`, Exposure 0. Por quê: contraste de produto sem esmagar sombra; é o padrão seguro da casa.

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| fita sedosa | `#5B7BD5` | 0,3 | 0 | 0,2 | 0 | 1,5 | Sheen Weight 0,4; Anisotropic 0,3 seguindo a direção da fita; espessura 1 a 2% da largura (Solidify) |
| fita translúcida | `#A7C7FF` | 0,2 | 0 | 0 | 0,5 | 1,45 | Subsurface Weight 0,2 em vez de transmissão total (renderiza mais rápido) |
| fita líder | `#FFC2A1` | 0,25 | 0 | 0,3 | 0 | 1,5 | Coat Roughness 0,1 |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| principal | AREA | 1,5 | 30° | 45° | 1 | 5600 K | 70° |
| contraluz | AREA | 1 | 170° | 30° | 0,8 | 7000 K | 60° |
| rebate colorido | AREA cor #FFC2A1 | 2 | -70° | 0° | 0,2 | cor RGB | 120° |

Contraluz forte para a borda fina das fitas brilhar. Fitas por Curve com Bevel + Twist animado ou Geometry Nodes Curve to Mesh com perfil retangular. [testar no Blender]

- **Câmera:** lentes 35, 50, 85 mm, f/4. Câmera segue a fita líder (follow path) e para no produto; órbita de 40° com fitas passando em primeiro plano desfocadas.
- **Assinatura de movimento:** curva: Bézier com fluxo contínuo; fita com 'follow-through' (a ponta chega 6 a 10 quadros depois da base). Timing a 30 fps: Varredura de fita 30 a 45 quadros; laço final em 20 quadros; logo assenta em 12. Overshoot: Sim na ponta da fita (8%), não no produto.
- **Transição característica** (`wipe_fita`): A fita atravessa a lente e cobre a tela (ribbon wipe de 14 quadros), ou se enrola e vira a forma do logo.
- **Tipografia:** Sora (OFL) 500 ou Lexend (OFL) 500, caixa mista, tracking -1%; logo pode ser escrito pela fita (curva seguindo o traço).
- **Trilha e som:** Pop orquestral leve ou eletrônica melódica, 100 a 112 BPM; 'swish' de seda acompanhando cada passagem, harpa e sinos.
- **Funciona em:** Logo, vinheta, app, SaaS (lançamento), cosmético, chocolate, embalagem de presente.
- **Não funciona em:** Industrial, advocacia, comida salgada (doce demais para o tom).
- **Erro clássico:** 'Macarrão de fita': muitas fitas sem líder, cruzando sem direção, cobrindo o produto. Sinal: o produto aparece menos de 50% do tempo; fitas com espessura zero piscando.

**Referências:** [Six N. Five, Windows 11 Background](https://sixnfive.com/projects/windows-11/); [FEDEX RIBBONS (Behance)](https://www.behance.net/gallery/50059907/FEDEX-RIBBONS); [Jared Koenigshofer, Redshift Ribbons (Procedural) (Behance)](https://www.behance.net/gallery/193448179/Redshift-Ribbons-(Procedural)).

### 18. Arquitetônico com luz dura  
`id: arquitetonico_luz_dura` · status: [testar no Blender]

**Conceito.** O produto como escultura num espaço de arquitetura mínima: paredes de gesso, arcos, escadas e uma faixa de sol dura cortando a parede.

**Quando usar.** Perfume, bolsa, móvel, imobiliária, clínica de estética, escritório de arquitetura, marca de moda adulta, consultoria premium.

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#E4D7C5` | parede, piso, céu, área vazia |
| Apoio (30%) | `#B98B6E` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#2F3A2F` | herói, palavra-chave, botão, logo |
| Extras | `#F3ECE2`, `#7C5A44` | luz alta, sombra profunda, variação |

Gesso quente, terracota e um verde-escuro de planta ou de produto. A sombra é a quarta cor: azulada por causa do céu.

**Cor.** View Transform `AgX`, Look `AgX - Medium High Contrast`, Exposure -0,2. Por quê: contraste de produto sem esmagar sombra; é o padrão seguro da casa.

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| gesso / reboco | `#E4D7C5` | 0,9 | 0 | 0 | 0 | 1,5 | Bump por Noise escala 30 força 0,08; cantos com chanfro 3 mm |
| pedra polida | `#B98B6E` | 0,25 | 0 | 0 | 0 | 1,5 | Veio por Wave Texture distorcida |
| produto (exemplo couro) | `#2F3A2F` | 0,55 | 0 | 0,15 | 0 | 1,5 | Sheen Weight 0,2; costura com Bump |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| sol de janela | SUN, ângulo 0,5° | 0 | -55° | 30° | 1 | 4500 K | não se aplica |
| recorte de janela (gobo) | parede com abertura retangular ou arco entre sol e cena | 0 | -55° | 30° | 0 | não emite | não se aplica |
| céu de preenchimento | World #BFD3E6 força 0,15 + AREA | 3 | 30° | 40° | 0,1 | 8000 K | 120° |

Uma única fonte dura e uma abertura de arquitetura desenhando a forma da luz na parede. Sol com ângulo de 0,5° para borda nítida. [testar no Blender]

- **Câmera:** lentes 35, 50 mm, f/8. Composição simétrica frontal, dolly lento para a frente atravessando um vão, time-lapse de sol (a faixa de luz anda 30 cm em 4 s até encontrar o produto).
- **Assinatura de movimento:** curva: Linear para a luz (time-lapse); ease-out longo para a câmera. Timing a 30 fps: Faixa de sol cruza o quadro em 90 a 120 quadros; planos de 120 quadros. Overshoot: Não.
- **Transição característica** (`wipe_luz`): A faixa de sol varre o quadro e o próximo plano é revelado onde ela passa (wipe de luz), ou corte por arco (a câmera atravessa um arco e muda de sala).
- **Tipografia:** Libre Caslon Display (OFL) ou Cormorant (OFL) 500, caixa mista, tracking 0; apoio em Work Sans (OFL) 400 caixa alta tracking +12%.
- **Trilha e som:** Neoclássico ou ambiente com piano e reverb de sala grande, 60 a 80 BPM; passos em pedra, vento em corredor.
- **Funciona em:** Perfume, moda, móvel, imobiliária, clínica de estética, consultoria, logo premium, cosmético.
- **Não funciona em:** App de entrega, games, snack (lento e contemplativo demais).
- **Erro clássico:** 'Sala de render de arquitetura': luz de todos os lados, sem gobo, paredes brancas puras. Sinal: nenhuma sombra desenhada na parede, parede em 100% de branco.

**Referências:** [Six N. Five, Umbral](https://sixnfive.com/projects/umbral/); [Tendril, Alo Handbag (luz e sombra em ambiente mínimo)](https://tendril.studio/work/alo-handbag); [Buck, Microsoft Copilot+ PCs (luz inspirada em James Turrell)](https://buck.co/work/microsoft-copilot-pcs).

### 19. Monocromático color block  
`id: color_block` · status: [testar no Blender]

**Conceito.** Uma cor domina tudo: fundo, apoio, objetos e luz em variações tonais da mesma matiz, e o produto é a única exceção.

**Quando usar.** Linha de produto com variações de cor, campanha de cor nova, app que muda tema, logo com cor proprietária forte, cosmético por tom.

**Paleta 60/30/10**

| Papel | Hex | Uso |
|---|---|---|
| Fundo (60%) | `#2F6FDE` | parede, piso, céu, área vazia |
| Apoio (30%) | `#1F4FA8` | objetos secundários, base, sombra colorida |
| Acento (10%) | `#F5F2EA` | herói, palavra-chave, botão, logo |
| Extras | `#5C8EF0`, `#163B7D` | luz alta, sombra profunda, variação |

60% e 30% são a mesma matiz (azul) com luminâncias diferentes; o acento é um neutro claro ou o próprio produto. Troque a matiz por produto, mantendo a regra.

**Cor.** View Transform `AgX`, Look `AgX - Medium High Contrast`, Exposure 0. Por quê: contraste de produto sem esmagar sombra; é o padrão seguro da casa.

**Materiais (Principled BSDF, Blender 5.2)**

| Material | Base Color | Roughness | Metallic | Coat Weight | Transmission Weight | IOR | Outros |
|---|---|---|---|---|---|---|---|
| fosco tonal | `#2F6FDE` | 0,7 | 0 | 0 | 0 | 1,5 | Specular IOR Level 0,35; formas de apoio com chanfro 4% |
| brilhante tonal | `#1F4FA8` | 0,15 | 0 | 0,5 | 0 | 1,5 | Coat Roughness 0,05: a diferença fosco/brilho substitui a diferença de cor |
| produto em contraste | `#F5F2EA` | 0,4 | 0 | 0 | 0 | 1,5 | Ou o material real do produto |

**Rig de luz** (azimute 0° = câmera, 90° = direita, 180° = atrás; energia relativa à principal)

| Luz | Tipo | Tamanho (m) | Azimute | Elevação | Energia rel. | Temperatura | Spread |
|---|---|---|---|---|---|---|---|
| principal | AREA | 1,5 | 40° | 40° | 1 | 5600 K | 70° |
| contorno | AREA | 0,6 | 160° | 25° | 0,6 | 5600 K | 60° |
| preenchimento tonal | AREA cor da matiz (ex. #5C8EF0) | 2 | -60° | 10° | 0,25 | cor RGB | 120° |

Luz branca na principal (senão o produto também tinge), preenchimento na cor do mundo. AgX desatura cores muito intensas perto do branco: mantenha o fundo com luminância média. [testar no Blender]

- **Câmera:** lentes 50, 85 mm, f/5,6. Composição gráfica plana, câmera frontal; troca de cor do mundo inteiro no corte; push-in curto de 5%.
- **Assinatura de movimento:** curva: Ease-in-out médio, formas de apoio com pequeno overshoot. Timing a 30 fps: Troca de cor do mundo em 8 a 12 quadros; ação 24 a 36 quadros. Overshoot: Leve (5%) nas formas; zero no produto.
- **Transição característica** (`troca_cor`): Troca de cor cheia: o mundo inteiro muda de matiz em 10 quadros mantendo a composição (color swap), ideal para mostrar variações.
- **Tipografia:** Archivo (OFL) 800 ou Big Shoulders Display (OFL) 800, caixa alta, tracking -2%; texto no tom mais escuro da matiz.
- **Trilha e som:** Pop eletrônico com batida seca 105 a 120 BPM; cada troca de cor marcada por um 'stab' de sintetizador.
- **Funciona em:** Eletrônico com variação de cor, cosmético por tom, app, bebida por sabor, embalagem, logo, moda.
- **Não funciona em:** Serviço de confiança (advocacia, saúde) quando a cor não é da marca; comida natural (cor única artificial).
- **Erro clássico:** 'Tudo da mesma luminância': fundo, apoio e objetos no mesmo valor, sumindo uns nos outros. Sinal: imagem em preto e branco vira cinza uniforme; o produto não se separa.

**Referências:** [Buck, Oura: Ring True to You (ambientes tom sobre tom)](https://buck.co/work/oura-ring-true-to-you); [Buck, Google Pixel 4a (cor simples e foco no aparelho)](https://buck.co/work/google-pixel-4a); [Ordinary Folk, Colorscope: Green (CNN, 2D monocromático)](https://www.ordinaryfolk.co/project/cnn-green).


## Matriz mundo × categoria

✓ = funciona sem ajuste (peso 3 no sorteio). ~ = funciona com ajuste descrito na ficha (peso 1). ✗ = evitar (peso 0, fora do sorteio).

| Mundo | app | SaaS | serviço | eletrônico | cosmético | bebida | comida | moda | embalagem | logo |
|---|---|---|---|---|---|---|---|---|---|---|
| Estúdio premium minimalista | ✓ | ✓ | ~ | ✓ | ✓ | ~ | ✗ | ~ | ✓ | ✓ |
| Luxo escuro | ✗ | ~ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| Pop candy / brinquedo | ✓ | ~ | ✗ | ~ | ✓ | ✓ | ✓ | ~ | ✓ | ✓ |
| Diorama isométrico | ✓ | ✓ | ✓ | ~ | ✗ | ~ | ~ | ✗ | ~ | ✗ |
| Argila macia (clay) | ✓ | ~ | ✓ | ✗ | ~ | ~ | ✓ | ✗ | ✓ | ✓ |
| Vidro e cromo | ✓ | ✓ | ~ | ✓ | ✓ | ~ | ✗ | ~ | ~ | ✓ |
| Orgânico e líquido | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✗ | ✓ | ~ |
| Brutalista tech | ✓ | ✓ | ~ | ✓ | ✗ | ~ | ✗ | ~ | ~ | ✓ |
| Macro cinematográfico | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Papel e recorte | ~ | ~ | ✓ | ✗ | ~ | ~ | ✓ | ~ | ✓ | ✓ |
| Retrofuturo | ✓ | ~ | ✗ | ~ | ~ | ✓ | ~ | ✓ | ~ | ✓ |
| Neon noturno | ✓ | ~ | ✗ | ✓ | ~ | ✓ | ~ | ✓ | ~ | ✓ |
| Natureza e luz do sol | ~ | ~ | ✓ | ~ | ✓ | ✓ | ✓ | ✓ | ✓ | ~ |
| Holográfico e iridescente | ✓ | ~ | ✗ | ~ | ✓ | ~ | ✗ | ✓ | ✓ | ✓ |
| Editorial de revista | ~ | ~ | ✓ | ~ | ✓ | ~ | ~ | ✓ | ✓ | ✓ |
| Tátil e têxtil | ~ | ✗ | ~ | ~ | ✓ | ✗ | ~ | ✓ | ✓ | ~ |
| Fitas e formas doces (ribbons) | ✓ | ✓ | ~ | ~ | ✓ | ~ | ~ | ~ | ✓ | ✓ |
| Arquitetônico com luz dura | ✗ | ~ | ✓ | ~ | ✓ | ~ | ✗ | ✓ | ✓ | ✓ |
| Monocromático color block | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ~ | ✓ | ✓ | ✓ |

Como ler as células mais discutíveis:

- **Estúdio premium em comida = ✗.** O vazio grafite e a luz fria esfriam o apetite. Comida pede calor de cor (3200 a 4500 K) e textura em close. Se o cliente insiste em "clean", use natureza e luz do sol com fundo de pedra clara.
- **Luxo escuro em serviço = ✓.** Advocacia, consultoria de alto ticket e clínica de estética vendem confiança e exclusividade. O cuidado é não usar ouro em serviço popular: troque o acento dourado por branco quente `#E8D9B5`.
- **Diorama em logo = ✗.** Um diorama precisa de 2 a 3 s só para ser lido; uma revelação de logo de 6 s não tem esse tempo.
- **Orgânico e líquido em logo = ~.** Funciona quando a marca é de bebida ou cosmético (o logo emerge do líquido); vira metáfora gratuita em qualquer outra.
- **Macro em SaaS = ✗.** Não existe superfície física para revelar. Se o SaaS tem hardware (leitor, maquininha), use a coluna eletrônico.
- **Color block em serviço = ✗** quando a cor não é da marca. Se for (ex.: clínica com azul proprietário), vira ~.

## A regra de rotação

### Os 4 eixos

| Eixo | O que é | Como medir | Exemplo |
|---|---|---|---|
| 1. Mundo | o `id` do mundo base (e o do acento, se houver mix) | igualdade de id | `vidro_cromo` |
| 2. Lente dominante | a lente que fica mais de 50% do tempo na tela | mm inteiros | 85 |
| 3. Paleta | a família de matiz do acento | 12 fatias de 30° no círculo de matiz, mais "neutro" se a saturação for menor que 0,18 | "ciano" |
| 4. Transição | a chave da transição principal do filme | igualdade de chave | `wipe_refrativo` |

**Regra:** nenhum dos 4 eixos repete entre filmes consecutivos da produtora. Duas regras de apoio: o mesmo mundo não volta nos últimos 3 filmes do mesmo cliente, e o mesmo look do AgX não aparece 3 vezes seguidas.

Por quê 4 eixos e não só o mundo: dois mundos diferentes filmados com a mesma lente de 85 mm, o mesmo acento laranja e o mesmo corte por fusão parecem o mesmo filme para quem rola o feed. O olho reconhece primeiro a cor dominante, depois o enquadramento (lente) e o ritmo de corte (transição); o "mundo" em si é a última coisa que ele nota. Sinal de que a regra foi quebrada: colocar dois filmes lado a lado em miniatura e não saber qual é qual.

### Sorteio ponderado pela matriz

1. Pegue a coluna da categoria na matriz. ✗ sai do sorteio.
2. Peso inicial: ✓ = 3, ~ = 1.
3. Exclua todo mundo que repetiria um eixo do último filme: mesmo id, mesma família de acento, mesma chave de transição, ou nenhuma lente disponível diferente da lente dominante anterior.
4. Multiplique por 0,3 o peso de qualquer mundo usado nos últimos 5 filmes.
5. Sorteie proporcional ao peso. Escolha a lente dominante entre as lentes do mundo, excluindo a anterior.
6. Se ninguém sobrar, use um mundo ~ com o ajuste da ficha, ou mantenha o mundo e troque o acento de família (nunca a cor da marca: mova a cor da marca para o apoio e use um acento neutro).

**Atenção ao viés quente.** Dos 19 acentos padrão, 6 caem em "laranja" e 5 em "vermelho". Depois de um filme com acento quente, o sorteio fica estreito. Isso é proposital (empurra para frio e neutro), mas quando a cor da marca é quente em todos os filmes de um cliente, a família registrada deve ser a do **acento real usado**, e a variação tem que vir do fundo e do mundo.

### Como a IA registra: `historico_mundos.json`

Um arquivo por produtora (na raiz dos projetos) e, opcionalmente, um por cliente. Esquema:

```json
{
  "versao": 1,
  "projetos": [
    {
      "projeto": "Delivery X, Reels 20 s",
      "data": "2026-10-02",
      "categoria": "app",
      "mundo_base": "vidro_cromo",
      "mundo_acento": "neon_noturno",
      "lente_dominante_mm": 85,
      "paleta": {"fundo": "#0E1116", "acento": "#7CE0FF", "familia": "ciano"},
      "transicao": "wipe_refrativo",
      "look": "AgX - Medium High Contrast",
      "formato": "9:16",
      "duracao_s": 20
    }
  ]
}
```

Comandos (script em `/home/claude/codigo/mundos/rotacao_mundos.py`, Python puro, testado na nuvem):

```bash
python rotacao_mundos.py sortear --categoria app --historico historico_mundos.json
python rotacao_mundos.py registrar --historico historico_mundos.json --categoria app \
  --projeto "Delivery X, Reels 20 s" --mundo vidro_cromo --lente 85 --acento "#7CE0FF" \
  --transicao wipe_refrativo --acento-mundo neon_noturno --formato 9:16 --duracao 20
```

O `registrar` recusa o registro se algum eixo repetir o filme anterior (testei: registrar `neon_noturno` com lente 85 logo depois de `vidro_cromo` com lente 85 devolve "Recusado: repete lente em relação ao filme anterior"). Isso força a IA a mudar a decisão antes de entregar, e não depois.

Função de família de cor usada no script (o eixo 3):

```python
# Blender 5.2 | status: confirmado por execução (Python puro) | trecho de rotacao_mundos.py
import colorsys
def familia_cor(hex_):
    h = hex_.lstrip("#"); r, g, b = (int(h[i:i+2], 16) / 255 for i in (0, 2, 4))
    hh, ll, ss = colorsys.rgb_to_hls(r, g, b)
    if ss < 0.18 or ll > 0.92 or ll < 0.08:
        return "neutro"
    nomes = ["vermelho", "laranja", "amarelo", "lima", "verde", "verde-agua",
             "ciano", "azul", "anil", "violeta", "magenta", "rosa"]
    return nomes[int(((hh * 360) + 15) % 360 // 30)]
```

## Como mixar mundos (base + acento) sem virar bagunça

Mix é útil quando a categoria pede dois tons ao mesmo tempo (ex.: app de delivery noturno: precisão de interface e energia de rua). A regra que evita bagunça:

1. **O mundo base manda em 4 coisas e não divide:** fundo, look do AgX, linguagem de câmera e assinatura de movimento. Se dois mundos disputam o look, o filme perde a cor.
2. **O mundo acento empresta UM eixo só**, escolhido entre: um material (ex.: o vidro do vidro e cromo), uma luz (ex.: o contorno neon), a transição, ou a tipografia. Dois eixos emprestados já viram dois filmes colados.
3. **Proporção de tela 80/20:** o acento aparece em no máximo 20% do tempo ou da área do quadro.
4. **A paleta do acento entra no slot de 10%**, nunca no de 60%. Se o neon do mundo acento pinta o fundo, ele virou base.
5. **Mundos com a mesma temperatura emocional misturam; opostos brigam.** Calmo com calmo (natureza + tátil), preciso com preciso (estúdio premium + brutalista), festivo com festivo (pop candy + fitas).
6. **Registre o mix.** O `mundo_acento` entra no histórico e conta como mundo usado para a regra dos 4 eixos.

### Mixes que funcionam

| Base | Acento | O que o acento empresta | Briefing típico |
|---|---|---|---|
| Vidro e cromo | Neon noturno | contorno magenta e ciano com light linking | app de delivery ou fintech noturna |
| Estúdio premium | Macro cinematográfico | 2 planos de detalhe com luz rasante | eletrônico ou relógio, provar acabamento |
| Natureza e luz do sol | Tátil e têxtil | material (linho, feltro) no apoio | cosmético natural, casa, colchão |
| Luxo escuro | Orgânico e líquido | transição (wipe líquido) | perfume, destilado |
| Diorama isométrico | Pop candy | materiais de plástico brilhante nas peças de destaque | app de consumo, explicação de processo jovem |
| Editorial de revista | Arquitetônico com luz dura | luz (faixa de sol por gobo) | moda, consultoria criativa |
| Color block | Fitas | transição (ribbon wipe) entre as trocas de cor | linha de produto por cor, lançamento de tema de app |
| Brutalista tech | Papel e recorte | tipografia de anotação à mão (Caveat) | ferramenta de desenvolvedor com tom humano |

### Mixes proibidos

| Combinação | Por que falha | Sinal visual |
|---|---|---|
| Luxo escuro + pop candy | exclusividade e brinquedo se anulam | ouro ao lado de plástico rosa, preto virando cinza |
| Argila + vidro e cromo | macio fosco contra espelho frio; os dois pedem luzes opostas | massinha com reflexo nítido, vidro sem bandeira |
| Neon noturno + natureza e luz do sol | noite e dia no mesmo quadro sem motivo narrativo | sombra de sol em cena com poste aceso |
| Retrofuturo + editorial | dois sistemas tipográficos fortes brigando | duas famílias de display no mesmo quadro |
| Holográfico + papel | efeito óptico de luxo em material pobre | papel com arco-íris parece adesivo barato |
| Qualquer mundo + 2 acentos | três linguagens = nenhuma | o espectador não sabe o tom do filme em 2 s |

### Checagem antes de renderizar um mix

1. O look do AgX é um só e é o do base? 
2. O acento empresta um único eixo?
3. O acento ocupa no máximo 20% do tempo ou da área?
4. A cor do acento está no slot de 10%?
5. Tirando o acento, o filme ainda se sustenta como o mundo base? Se não, o acento virou base: troque os papéis e registre de novo.

## Fontes

Estúdios, projetos e filmes (referências visuais citadas nas fichas; todas checadas por busca ou leitura da página em outubro de 2026):

- [Apple Newsroom, Introducing iPhone Air](https://www.apple.com/newsroom/2025/09/introducing-iphone-air-a-powerful-new-iphone-with-a-breakthrough-design/)
- [ManvsMachine, Apple iMac Pro Behind The Scenes (Vimeo)](https://vimeo.com/260280672) · [ManvsMachine no Vimeo](https://vimeo.com/mvsm) · [Flyknit, ManvsMachine](https://mvsm.com/project/flyknit) · [Nike Flyknit (Vimeo)](https://vimeo.com/162826208) · [It's Nice That sobre Flyknit](https://www.itsnicethat.com/articles/man-vs-machine-nike-flyknit-innovation-190416) · [Creative Review, Air Max Day '18](https://www.creativereview.co.uk/air-max-day-18-by-manvsmachine/)
- [Buck, trabalhos 3D](https://buck.co/work/tag/3d) · [Instacart Fresh](https://buck.co/work/instacart-fresh) · [Woolmark](https://buck.co/work/woolmark) · [Lily's Gummy Bears](https://buck.co/work/lilys-gummy-bears) · [Sherwin-Williams](https://buck.co/work/sherwin-williams) · [Truly](https://buck.co/work/truly-flavor-films) · [Pepsi Black](https://buck.co/work/pepsi-black) · [Oura](https://buck.co/work/oura-ring-true-to-you) · [Pixel 4a](https://buck.co/work/google-pixel-4a) · [Nike White Hot](https://buck.co/work/nike-white-hot) · [Spotify Premium](https://buck.co/work/spotify-premium) · [Amazon Echo Buds](https://buck.co/work/amazon-echo-buds) · [Meta Connect 23](https://buck.co/work/meta-connect-23) · [7UP](https://buck.co/work/7up) · [Microsoft Copilot+ PCs](https://buck.co/work/microsoft-copilot-pcs) · [Microsoft Surface Laptop 5](https://buck.co/work/microsoft-surface)
- [Tendril Studio](https://tendril.studio/) · [Figure 02](https://tendril.studio/work/figure02/) · [Hublot MP-10](https://tendril.studio/work/mp-10) · [Hublot Arsham Droplet](https://tendril.studio/work/arsham-droplet) · [IBM z17](https://tendril.studio/work/ibm-z17) · [Alo Handbag](https://tendril.studio/work/alo-handbag) · [Cash App](https://tendril.studio/work/cashapp)
- [Ordinary Folk, trabalhos](https://www.ordinaryfolk.co/work) · [Introducing Spline](https://www.ordinaryfolk.co/project/introducing-spline) · [Equilibrium](https://www.ordinaryfolk.co/project/equilibrium) · [Nightdrive](https://www.ordinaryfolk.co/project/nightdrive) · [Colorscope: Green](https://www.ordinaryfolk.co/project/cnn-green)
- [Hornet](https://www.hellohornet.com/) · [La Mer Global Holiday](https://www.hellohornet.com/projects/la-mer---global-holiday-campaign) · [5 Gum](https://www.hellohornet.com/projects/5-gum---overstimulate-your-senses)
- [Six N. Five](https://sixnfive.com/) · [Umbral](https://sixnfive.com/projects/umbral/) · [Holo-Scandinavian](https://sixnfive.com/projects/holo-scandinavian/) · [Flow](https://sixnfive.com/projects/flow/) · [The Japanese Garden](https://sixnfive.com/projects/the-japanese-garden/) · [Windows 11 Background](https://sixnfive.com/projects/windows-11/) · [Gestalten, Six N. Five sobre realismo e imperfeição](https://gestalten.com/blogs/journal/six-n-five-on-designing-realism-and-its-imperfections)
- [Vucko, trabalhos](https://vucko.co/work) · [Spotify Wrapped 2024](https://vucko.co/work/spotify-wrapped-2024) · [Communication Arts, A Brand's Body Language (Vucko)](https://www.commarts.com/columns/vucko)
- [Oddfellows, trabalhos](https://oddfellows.tv/work) · [Motion Array, Studio Spotlight Oddfellows](https://motionarray.com/learn/motion-design/studio-spotlight-oddfellows/) · [Motion Array, Studio Spotlight ManvsMachine](https://motionarray.com/learn/motion-design/studio-spotlight-manvsmachine/)
- [Blackmeal no Behance](https://www.behance.net/blackmeal?locale=en_US) (pesquisado; o site do estúdio não abriu na nuvem, por isso nenhum projeto dele foi usado como referência de ficha)
- [Bang & Olufsen, Beosound Theatre (Vimeo)](https://vimeo.com/746646949) · [Bang & Olufsen, Beolab 28 (Vimeo)](https://vimeo.com/557990749)
- [Aesop, Harvest Campaign (Vimeo)](https://vimeo.com/461743318)
- [Nothing Phone (3) Trailer (YouTube)](https://www.youtube.com/watch?v=kLmCLaj7NxQ) · [Yonick Studio, Nothing 3a Pro](https://yonick.studio/work/nothing-3a-pro)
- Behance: [Chanel Bleu de Chanel CGI](https://www.behance.net/gallery/127909887/Chanel-Bleu-De-Chanel-3D-CGI-Perfume-Animation) · [ELYSIUM Perfume](https://www.behance.net/gallery/106660823/3D-product-design-animation-ELYSIUM-PERFUME) · [Live Digital Diorama](https://www.behance.net/gallery/165424867/Live-Digital-Diorama-3D-Animation-Loop) · [Isometric Rooms](https://www.behance.net/gallery/107678093/Isometric-Rooms) · [NEON NIGHT](https://www.behance.net/gallery/62430835/NEON-NIGHT) · [3D Iridescent HD Shapes](https://www.behance.net/gallery/188630181/3D-Iridescent-HD-Shapes) · [Animated Iridescent Gradients v.3](https://www.behance.net/gallery/163777045/Animated-Iridescent-Gradients-v3) · [FEDEX RIBBONS](https://www.behance.net/gallery/50059907/FEDEX-RIBBONS) · [Redshift Ribbons (Procedural)](https://www.behance.net/gallery/193448179/Redshift-Ribbons-(Procedural)) (o Behance bloqueia leitura automática; os links vieram de resultado de busca com título e autor)
- [Florian Renner, Retrowave (Vimeo)](https://vimeo.com/117890578) · [Twenty75, 3D Chrome](https://www.twenty75.com/projects/3d-chrome/)
- 80.lv: [Cozy Assembling Bakery Diorama](https://80.lv/articles/cozy-assembling-bakery-diorama-animation-made-in-blender) · [Surreal Papercraft-Style World](https://80.lv/articles/check-out-this-surreal-papercraft-style-world-made-in-blender) · [Rendering 3D Clay Models](https://80.lv/articles/breakdown-rendering-3d-clay-models-in-marmoset-toolbag) · [Gianluca Squillace, Clay Render Breakdown (ArtStation)](https://www.artstation.com/artwork/aGKqz9)

Técnica:

- [Principled BSDF, manual do Blender 5.2 LTS](https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/principled.html) · [manual 4.2 LTS](https://docs.blender.org/manual/en/4.2/render/shader_nodes/shader/principled.html)
- [Cycles: thin film iridescence no Principled BSDF, PR #118477](https://projects.blender.org/blender/blender/pulls/118477)
- [AgX, repositório de Eary Chow (origem do view transform)](https://github.com/EaryChow/AgX)
- Sonda local: bpy 5.2.2 LTS em `/home/claude/bvenv` (looks, view transforms, propriedades de luz, light linking, filme fino).

Fontes tipográficas citadas (todas SIL Open Font License 1.1, uso comercial permitido, disponíveis no [Google Fonts](https://fonts.google.com/)): Inter, Geist, Cormorant Garamond, Cormorant, Bodoni Moda, Jost, Fredoka, Baloo 2, Unbounded, Manrope, Nunito, Space Grotesk, Sora, JetBrains Mono, Outfit, DM Sans, Space Mono, Doto, Archivo, Fraunces, Instrument Serif, IBM Plex Mono, Bricolage Grotesque, Caveat, Monoton, Righteous, Chakra Petch, Syne, Playfair Display, Quicksand, Lexend, Libre Caslon Display, Work Sans, Big Shoulders Display. A licença de cada família deve ser conferida na página dela no Google Fonts antes da entrega [não verificado família a família nesta sessão].

Texturas citadas: Poly Haven (CC0, uso comercial sim).

## Pendências para o Claude Code

**Receitas [testar no Blender] (RTX 3050, EEVEE e Cycles OptiX):**

1. Renderizar os 9 mundos ainda sem render (diorama, orgânico e líquido, brutalista, macro, retrofuturo, editorial, fitas, arquitetônico, color block) com o cilindro-frasco e a esfera de `prova_mundos_novos.py` e passar o `qa.py` oficial. Ajustar energia relativa e exposição das fichas.
2. Repetir holográfico, papel e têxtil no `qa.py` oficial e no EEVEE (o filme fino no EEVEE do 5.2 não foi verificado).
3. Investigar por que `Light.diffuse_factor = 0` e `Object.visible_diffuse = False` na luz não tiraram a iluminação do piso no Cycles CPU. Hipótese: o piso recebe luz direta (não rebatida) e essas chaves agem em outra parte do caminho da luz [não verificado]. Light linking resolve, mas vale saber o motivo.
4. Diorama: confirmar Strength do sol (chute 2 a 4) e o Orthographic Scale ideal para 9:16.
5. Macro: confirmar que o DOF do Cycles em escala 1:1 com f/2,8 a 15 cm dá a profundidade esperada (sem cara de miniatura).
6. Fitas: validar Curve com Bevel e Twist animado contra Geometry Nodes Curve to Mesh em tempo de render.
7. Color block: medir em que luminância de fundo o AgX começa a desaturar a matiz (testar `#2F6FDE` com exposição -0,5 a +0,5).
8. Gerar uma grade de miniaturas dos 19 mundos (um PNG por mundo, 360x640) para a IA comparar filmes lado a lado na checagem da regra de rotação.

**PENDÊNCIAS YOUTUBE**

| Título | Canal | Link | O que esperava aprender |
|---|---|---|---|
| Nothing Phone (3) Trailer | Nothing | https://www.youtube.com/watch?v=kLmCLaj7NxQ | ritmo de corte, uso de matriz de pontos e luz dura no filme oficial (só o link foi confirmado; vídeo não assistido) |
| Blender Clay render Tutorial (Render Breakdown) | xyz3dlab | https://www.youtube.com/watch?v=CSBStg6pyZM | valores de subsuperfície e iluminação de clay render no Blender |
| AirPods Pro 3 | Apple | https://www.youtube.com/watch?v=EMmKs8vMKhU | estrutura de filme de produto do estúdio premium (lentes, tempo de plano) |
