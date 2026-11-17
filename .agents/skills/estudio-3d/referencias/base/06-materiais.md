# 06 · Materiais e Shaders

> Alvo: Blender 5.2 LTS (testado no bpy 5.2.2). Motor de produção: Cycles com OptiX na RTX 3050 ou EEVEE. Todo valor deste capítulo vale para cena em metros e objeto em escala real (celular 71,5 x 147 x 7,8 mm).
>
> Código da biblioteca: `/home/claude/codigo/materiais/materiais.py`. Testes: `teste_grade.py`, `teste_imperfeicao.py`, `teste_estilizados.py`, `teste_cor_marca.py`, `compensar_agx.py`, `medir.py`, todos na mesma pasta.

## Para que serve este capítulo

O problema nº 6 da lista do estúdio é o "plástico de CG": aspereza (roughness) igual em toda a superfície, nenhuma marca de uso e aresta viva sem chanfro (bevel). É o que faz um render de produto parecer teste de software, mesmo com luz boa. Este capítulo resolve isso com três camadas, sempre na mesma ordem:

1. **Material base certo.** Valores físicos reais: cor de metal medida, IOR de líquido medido, aspereza na faixa do acabamento real.
2. **Camada de imperfeição.** Variação de aspereza, micro riscos, digitais, poeira e desgaste de borda, em escala de milímetro.
3. **Chanfro em tudo.** Toda aresta do mundo real é arredondada. A aresta arredondada pega um fio de luz e desenha o contorno do objeto.

Depois vêm os mundos não realistas (toon, argila, gradiente, holográfico, pastel) e o problema da cor da marca sob AgX, que é onde o cliente reclama primeiro ("meu vermelho saiu salmão").

Toda receita traz: valores numéricos, o porquê, o sinal de que deu errado e o nome exato das entradas do Principled BSDF no 5.2.

## Regras de base antes de qualquer receita

### Escala real ou nada funciona

Ruído procedural, chanfro, subsurface, absorção de vidro e profundidade de campo dependem de distância em metros. Um frasco de perfume modelado com 2 m de altura (erro comum de cena gerada por IA) vai ter vidro claro demais, subsurface sem efeito e chanfro gigante. **Regra:** modele em escala real e confira com `obj.dimensions` antes de aplicar material. Sinal de erro: o ruído de imperfeição parece "manchas de vaca" (escala grande demais) ou some (pequena demais).

### Cor em linear, hex em sRGB

O Blender trabalha em espaço linear. O hex da marca está em sRGB (com curva de gama). Se você jogar `0xE8/255 = 0,91` direto no Base Color, a cor sai mais clara e lavada. A função `hex_para_linear()` da biblioteca aplica a curva sRGB oficial (trecho linear abaixo de 0,04045 e expoente 2,4 acima). **Sinal de erro:** a cor no render parece "pastelizada" em relação ao hex mesmo em Standard.

### Faixa de albedo física

Nenhum material real tem Base Color preto puro ou branco puro. O [Physically Based](https://physicallybased.info/) lista carvão em 0,02 linear, pneu em 0,023, papel de escritório em torno de 0,79 a 0,88, neve em 0,85. **Regra:** dielétricos entre 0,02 e 0,90 linear. Preto "de marca" (#1C1C1E) fica em torno de 0,011 linear, o que já é muito escuro: em produto preto, a forma vem do reflexo, não da cor.

### O que a cena já traz

A cena nasce em AgX (confirmado no laboratório). Todo número de brilho deste capítulo foi medido em AgX com look `AgX - Medium High Contrast`, salvo onde dito.

## Principled BSDF v2 no Blender 5.2, entrada por entrada

### Linha do tempo (o que entrou quando)

| Versão | O que mudou no Principled | Fonte |
|---|---|---|
| 4.0 | Principled v2: camadas (base, coat, sheen), IOR único controla reflexo e transmissão, "Specular" vira "Specular IOR Level", subsurface usa a Base Color e ganha "Subsurface Scale", coat passa a ficar acima da emissão, sheen com novo modelo de microfibra, Multiscatter GGX vira padrão | [Notas 4.0 Shading](https://developer.blender.org/docs/release_notes/4.0/shading/) |
| 4.2 | Thin Film (interferência de película fina) no Principled, só em dielétricos, "ainda não suportado no EEVEE". Novo view transform Khronos PBR Neutral | [Notas 4.2 Cycles](https://developer.blender.org/docs/release_notes/4.2/cycles/), [Notas 4.2 Rendering](https://developer.blender.org/docs/release_notes/4.2/rendering/) |
| 4.3 | Diffuse Roughness (Oren-Nayar) no Principled, como o Roughness do Diffuse BSDF | [Notas 4.3 Cycles](https://developer.blender.org/docs/release_notes/4.3/cycles/), [PR #123616](https://projects.blender.org/blender/blender/pulls/123616) |
| 5.0 | "Use Nodes" removido: material e mundo sempre usam nós. Novo nó Radial Tiling | [Notas 5.0 Rendering](https://developer.blender.org/docs/release_notes/5.0/rendering/) |
| 5.2 | Thin Wall: superfície tratada como lâmina de espessura zero com camadas espelhadas | [Blender 5.2](https://www.blender.org/download/releases/5-2/), [PR #157469](https://projects.blender.org/blender/blender/pulls/157469) |

**[confirmado por sonda no bpy 5.2.2]** A propriedade `Material.use_nodes` ainda existe mas dispara `DeprecationWarning` ("expected to be removed in Blender 6.0"). Material novo já vem com `node_tree` e um Principled BSDF chamado `"Principled BSDF"`. A biblioteca só liga `use_nodes` se `node_tree` vier vazio.

**[confirmado por sonda no bpy 5.2.2]** O manual da linha principal (main) já cita "Dispersion Scale" e "Dispersion Abbe Number" na transmissão do Principled, mas o 5.2.2 **não tem** essas entradas. Não use dispersão no Principled em 5.2. [não verificado em que versão entra]

### Arquitetura em camadas (o modelo mental certo)

O manual 5.2 descreve o Principled como baseado no OpenPBR Surface ([manual 5.2, Principled BSDF](https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/principled.html)):

- **Base:** mistura de metal, difuso, subsurface e transmissão. "A maioria dos materiais usa um desses componentes."
- **Thin film:** opcional, por cima de metal, transmissão e especular.
- **Coat:** verniz brilhante opcional por cima de toda a base.
- **Sheen:** a camada mais alta, por cima de tudo (pelúcia, poeira, tecido).
- **Emissão:** fica **abaixo** do coat e do sheen ([notas 4.0](https://developer.blender.org/docs/release_notes/4.0/shading/)).

Consequência prática que quase ninguém usa: **uma tela de celular cabe num material só.** Emissão (a imagem da tela) por baixo e Coat (o vidro) por cima, com reflexo correto do vidro e a imagem aparecendo através dele. Receita mais adiante.

### Tabela completa das entradas (nomes exatos do 5.2.2)

Lista confirmada por sonda, com padrão e faixa útil. "C" = só Cycles segundo o manual 5.2; "C+E" = funciona nos dois.

| Entrada (nome exato) | Padrão 5.2.2 | Faixa útil | Motor | O que faz |
|---|---|---|---|---|
| `Base Color` | 0,8 cinza | 0,02 a 0,90 linear | C+E | Cor do difuso, do subsurface, do metal (F0) e da transmissão |
| `Metallic` | 0,0 | 0 ou 1 (meio termo só em transição/flocos) | C+E | Mistura dielétrico e metal |
| `Roughness` | 0,5 | 0,02 a 0,9 | C+E | Aspereza microscópica do reflexo e da transmissão |
| `IOR` | 1,5 | 1,0 a 2,5 (manual: 1,0 a 4,0) | C+E | Índice de refração: controla força do reflexo (Fresnel) e da refração |
| `Alpha` | 1,0 | 0 a 1 | C+E | Recorte (folha, etiqueta). Não é vidro |
| `Thin Wall` | False | liga/desliga | C+E (ver nota) | Lâmina de espessura zero (papel, folha, vidro de janela). Novo no 5.2 |
| `Normal` | (0,0,0) = normal da malha | vetor | C+E | Relevo (bump/normal map) da base |
| `Weight` | 0,0 | não usar | | Soquete interno de peso de closure (aparece na sonda; não ligue nada) [não verificado] |
| `Diffuse Roughness` | 0,0 | 0 a 1 | C | 0 = Lambert; acima ativa Oren-Nayar (pó, argila, tecido) |
| `Subsurface Weight` | 0,0 | 0 a 1 | C+E | Mistura difuso e espalhamento subsuperficial |
| `Subsurface Radius` | (1,0; 0,2; 0,1) | RGB | C+E | Distância média de espalhamento por canal (multiplicada pela Scale) |
| `Subsurface Scale` | 0,005 | 0,001 a 0,02 m | C+E | Multiplicador do raio, em metros na cena |
| `Subsurface IOR` | 1,4 | 1,33 a 1,45 | C | Só aparece no método Random Walk (Skin) |
| `Subsurface Anisotropy` | 0,0 | -0,9 a 0,9 | C | Direção do espalhamento interno |
| `Specular IOR Level` | 0,5 | 0 a 1 | C+E | 0,5 = reflexo físico do IOR; 0 apaga o reflexo; 1 reforça (cerca de 2x o F0) [não verificado] |
| `Specular Tint` | branco | cor | C+E | Tinta do reflexo especular; em metal é a cor da borda (F82) |
| `Anisotropic` | 0,0 | 0 a 1 | C | Alonga o brilho (metal escovado) |
| `Anisotropic Rotation` | 0,0 | 0 a 1 (1 = volta inteira) | C | Gira a direção da anisotropia |
| `Tangent` | (0,0,0) | vetor | C | Direção das riscas (nó Tangent radial ou por UV) |
| `Transmission Weight` | 0,0 | 0 ou 1 | C+E | 1 = vidro/líquido |
| `Coat Weight` | 0,0 | 0 a 1 | C+E | Força do verniz (reflexo e tinta) |
| `Coat Roughness` | 0,03 | 0,0 a 0,2 | C+E | Aspereza do verniz |
| `Coat IOR` | 1,5 | 1,3 a 1,6 | C+E | Força e queda do reflexo do verniz |
| `Coat Tint` | branco | cor | C+E | Cor por absorção dentro do verniz (verniz âmbar, laca colorida) |
| `Coat Normal` | (0,0,0) | vetor | C+E | Relevo próprio do verniz (verniz liso sobre base áspera) |
| `Sheen Weight` | 0,0 | 0 a 1 | C+E | Brilho aveludado de borda (microfibra) |
| `Sheen Roughness` | 0,5 | 0,2 a 0,6 | C+E | Largura do brilho de borda |
| `Sheen Tint` | branco | cor | C+E | Cor do sheen |
| `Emission Color` | branco | cor | C+E | Cor emitida |
| `Emission Strength` | 0,0 | 0 a 10 (tela: 1,0) | C+E | 1,0 = objeto mostra exatamente a Emission Color ("shadeless") |
| `Thin Film Thickness` | 0,0 | 100 a 1000 nm | C | Espessura da película em nanômetros. 0 desliga |
| `Thin Film IOR` | 1,33 | 1,0 a 2,0 | C | IOR da película |

Propriedades do nó (não são entradas): `distribution` = `GGX` ou `MULTI_GGX` (padrão `MULTI_GGX`) e `subsurface_method` = `BURLEY`, `RANDOM_WALK` (padrão), `RANDOM_WALK_SKIN`, `RANDOM_WALK_LEGACY` **[confirmado por sonda no bpy 5.2.2]**.

### Armadilha de API descoberta na sonda

**[confirmado por sonda no bpy 5.2.2]** `p.inputs["Subsurface IOR"]` levanta erro (e `p.inputs.get("Subsurface IOR")` devolve `None`) quando o método não é `RANDOM_WALK_SKIN`. O soquete existe na lista (`p.inputs.keys()` mostra), mas a busca por nome pula soquete indisponível. Com `BURLEY` ou `RANDOM_WALK`, `Subsurface IOR` some da busca; com `RANDOM_WALK_SKIN` volta. A função `ajustar()` da biblioteca procura por laço (`next(s for s in p.inputs if s.name == nome)`) e por isso nunca falha. **Regra para qualquer script:** defina `subsurface_method` antes de escrever as entradas de subsurface, ou busque por laço.

### Cada grupo explicado

#### Base: Base Color, Metallic, Roughness, IOR

- **Base Color.** Em dielétrico é a cor difusa. Em metal (`Metallic` 1) é a cor do reflexo de frente (F0). Use as cores medidas do [Physically Based](https://physicallybased.info/), não "amarelo" para ouro.
- **Metallic.** Use 0 ou 1. Valores no meio só fazem sentido em máscaras de transição (borda gasta de pintura revelando metal) e em flocos. Sinal de erro: metal com Metallic 0,5 parece plástico sujo.
- **Roughness.** A entrada que mais vende realismo. Faixas por acabamento:

| Acabamento | Roughness |
|---|---|
| Espelho, cromo novo, vidro limpo | 0,00 a 0,05 |
| Plástico injetado brilhante, laca, cerâmica vitrificada | 0,10 a 0,25 |
| Plástico acetinado, metal escovado | 0,25 a 0,40 |
| Plástico fosco, alumínio jateado | 0,45 a 0,65 |
| Borracha, papel, tecido, argila | 0,70 a 0,90 |

- **IOR.** Controla quanto um dielétrico reflete de frente (IOR 1,5 reflete cerca de 4%) e quanto o vidro entorta a imagem. Valores reais: água 1,333, gelo 1,31, vidro 1,52, acrílico 1,49, policarbonato 1,585, PET 1,575, óleo de cozinha 1,47, etanol 1,362, mel 1,504, diamante 2,417, safira 1,768 ([Physically Based](https://physicallybased.info/)).

#### Thin Wall (novo no 5.2)

Segundo as [notas do 5.2](https://www.blender.org/download/releases/5-2/) e o manual: "a superfície é tratada como uma lâmina com as camadas espelhadas em volta da base, e a espessura é assumida como zero". Para vidro fino, combina reflexo e transmissão sem desviar a imagem; para material com subsurface, combina difuso e translúcido (luz atravessa). Usos no estúdio:

- **Papel, rótulo, folha de planta, pétala:** luz de contra atravessa e acende a folha.
- **Vidro de janela, vidro de cobertura de tela, película:** reflexo e transparência sem a lente de refração que um plano com IOR 1,52 cria.
- **Bolha de sabão:** sem "interior".

Nota do manual para EEVEE: "no modo thin wall no EEVEE, a Thickness deve ser 0 e o Thickness Mode deve ser Slab". Em bpy: `mat.thickness_mode = "SLAB"` (opções confirmadas por sonda: `SPHERE`, `SLAB`). A saída Thickness do Material Output é a do nó de saída [testar no Blender: como zerar a Thickness por script no EEVEE].

Sinal de erro: plano de vidro sem Thin Wall que distorce o que está atrás como lupa; papel que fica preto de costas para a luz.

#### Diffuse Roughness (4.3, só Cycles)

"0,0 dá reflexão Lambertiana padrão; valores mais altos ativam o BSDF de Oren-Nayar" (manual 5.2). Superfície porosa (argila, gesso, concreto, tecido, pó facial) fica mais chapada de frente e menos escura na borda, como na foto real. Valores: 0,3 a 0,6 em argila e tecido; 0 em plástico. No EEVEE é ignorado ("Roughness is not supported. Only Lambertian diffusion", [Supported Nodes](https://docs.blender.org/manual/en/latest/render/eevee/limitations/nodes_support.html)). Para análise detalhada veja [BlenderNation: Diffuse Roughness](https://www.blendernation.com/2024/10/04/blender-4-3-deep-dive-exploring-diffuse-roughness-physical-conductor/).

#### Subsurface: Weight, Radius, Scale, IOR, Anisotropy, método

A luz entra, espalha por dentro e sai em outro ponto. É o que separa sabonete, cera, fruta, pele, leite e jade de plástico pintado.

- **Weight:** 0,05 a 0,15 em cerâmica e argila (só tira a dureza); 0,3 a 0,6 em fruta, sabonete, cera; 1,0 em leite e pele.
- **Radius:** distância por canal R, G, B. Vermelho maior que verde e azul na maioria dos orgânicos (o padrão 1,0; 0,2; 0,1 já segue isso).
- **Scale:** multiplica o raio, em metros. Padrão 0,005 (5 mm). Fruta: 0,005 a 0,01. Sabonete: 0,01 a 0,02. Cerâmica: 0,001 a 0,002.
- **IOR:** só no `RANDOM_WALK_SKIN` (ver armadilha acima). 1,4 para pele.
- **Anisotropy:** -0,9 a 0,9; 0,8 aproxima pele. Só Cycles.
- **Método:** `RANDOM_WALK` (padrão, preciso em objeto fino e curvo), `RANDOM_WALK_SKIN` (pele, raio ajustado automaticamente), `BURLEY` (aproximação, menos ruído), `RANDOM_WALK_LEGACY` ("será removido"). O EEVEE não faz Random Walk nem usa IOR e anisotropia ([Supported Nodes](https://docs.blender.org/manual/en/latest/render/eevee/limitations/nodes_support.html)).

Sinal de erro: objeto parece cera brilhante e cor-de-rosa (Weight e Scale altos demais); contato com o chão sem sombra (raio vazando). No teste da grade, a pele de fruta com `#E2492F`, Weight 0,6 e Scale 0,008 saiu salmão. Corrigido para `#B8231A`, Weight 0,4, Radius (1,0; 0,25; 0,12), Scale 0,005 **[testado no bpy 5.2.2 Cycles CPU, nuvem]**.

#### Specular: IOR Level, Tint, Anisotropic, Rotation, Tangent

- **Specular IOR Level:** "ajuste do IOR para aumentar ou diminuir a intensidade da camada especular". 0,5 é o físico. Baixe para 0,25 a 0,35 em tecido e borracha (reflexo mais fraco que o IOR diria por causa de poros), nunca suba acima de 0,6 em produto realista.
- **Specular Tint:** em dielétrico, tinge o reflexo (não físico, uso artístico). Em metal é a **cor de borda** (o tom que o metal pega em ângulo rasante). O [Physically Based](https://api.physicallybased.info/materials) publica esse valor como "specularColor"; a biblioteca usa direto.
- **Anisotropic, Anisotropic Rotation, Tangent:** brilho esticado de metal escovado, fundo de panela, tampa de perfume. Só Cycles. A direção vem do `Tangent`: nó Tangent com `direction_type = "RADIAL"` e eixo Z para riscas circulares em volta do eixo (tampa torneada); `UV_MAP` para riscas lineares seguindo o UV.

#### Transmission

`Transmission Weight` 1 para vidro e líquido. O manual: "mistura entre superfície opaca em zero e totalmente transmissiva em um". Cor do vidro **não** vai na Base Color (explicação na receita de vidro colorido). No EEVEE, ligue `mat.use_raytrace_refraction = True` e `surface_render_method = "DITHERED"` (nomes confirmados por sonda) e escolha `thickness_mode` (`SPHERE` para objeto maciço, `SLAB` para placa).

#### Coat

Verniz por cima de tudo: pintura automotiva, laca, cerâmica vitrificada, unha, tampa envernizada, tela de celular. `Coat Weight` 1, `Coat Roughness` 0,02 a 0,08, `Coat IOR` 1,5. `Coat Tint` colore por absorção (o manual: "modelando absorção na camada"), útil para verniz âmbar sobre madeira. `Coat Normal` dá relevo próprio ao verniz; ligue um bump de "casca de laranja" só nele para pintura de carro e deixe a base com os flocos.

#### Sheen

Brilho aveludado de borda. `Sheen Weight` 1 e `Sheen Roughness` 0,3 a 0,5 em tecido; 0,1 a 0,3 de Weight em borracha, plástico soft touch, pêssego e para simular poeira fina. O nó Sheen BSDF avulso não é suportado no EEVEE; o sheen dentro do Principled aparece no EEVEE [testar no Blender: comparar intensidade com Cycles].

#### Emission

`Emission Strength` 1,0 = o objeto mostra exatamente a `Emission Color` (manual 5.2). Laboratório do estúdio: no AgX, tela de celular desbota acima de ~1,3; use 1,0. Medição deste capítulo (plano com emissão de `#E8432F`, sem luz):

| Emission Strength | Standard | AgX | AgX Punchy | Khronos PBR Neutral |
|---|---|---|---|---|
| 0,6 | #B93424 | #B23518 | #8C2100 | #B72507 |
| 1,0 | **#E8432F** (exato) | #CE5037 | #B0320F | #E43515 |
| 1,3 | #FF4D37 (estoura R) | #D96049 | #C03F23 | #F1442E |
| 2,0 | #FF5F44 | #E87B67 (rosado) | #D6583F | #F96357 |

**[testado no bpy 5.2.2 Cycles CPU, nuvem]** com `teste_cor_marca.py`. Leitura: no AgX, subir a força deixa o vermelho mais claro **e menos saturado** (vai para salmão). Isso é o "desbota" que o laboratório viu.

#### Thin Film

Película fina (óleo na água, bolha, lente com antirreflexo, besouro, embalagem holográfica). `Thin Film Thickness` em nanômetros ("0 desliga a simulação"), manual recomenda faixa de 100 a 1000 nm; `Thin Film IOR` padrão 1,33. Só Cycles: as [notas 4.2](https://developer.blender.org/docs/release_notes/4.2/cycles/) dizem que "o efeito ainda não é suportado pelo EEVEE" e que era "aplicado só a materiais dielétricos, suporte a metal planejado".

**[testado no bpy 5.2.2 Cycles CPU, nuvem]** Três achados que mudam a receita:

1. **O filme precisa de IOR diferente do material de baixo.** Base com IOR 1,5 e filme 1,45: nenhuma cor visível. Base 1,5 e filme 1,9: cor forte.
2. **Bolha de sabão:** base com `IOR` 1,0 (ar dos dois lados), `Thin Wall` ligado, filme 1,33 e 300 a 500 nm. Com IOR 1,33 na base o filme some.
3. **Filme sobre metal (Metallic 1):** filme sobre metal com IOR 1,33 e espessura fixa: quase invisível (filme 1,33 e 400 nm sobre prata). Com Thin Film IOR 1,9 a 2,0 e espessura variando de 250 a 750 nm, funciona sobre metal claro (cap 02) e sobre dielétrico escuro (este capítulo). [testar no Blender] qual dos dois lê melhor na RTX (ver 00 · Padrões da casa).

No EEVEE o holográfico vira esfera escura brilhante sem cor (prova `estilizados_eevee.png`).

### O que é igual e o que muda entre EEVEE e Cycles

Fonte: [Supported Nodes, manual 5.2](https://docs.blender.org/manual/en/latest/render/eevee/limitations/nodes_support.html) e manual do Principled.

| Recurso | Cycles | EEVEE 5.2 | O que fazer no EEVEE |
|---|---|---|---|
| Base, Metallic, Roughness, IOR, Coat, Sheen, Emission, Transmission | sim | sim | nada |
| Diffuse Roughness | sim | ignorado (só Lambert) | aceitar |
| Anisotropia (escovado) | sim | não | ruído esticado na Roughness + bump (a biblioteca já faz os dois) |
| Subsurface Random Walk, IOR, Anisotropy | sim | não (aproximação) | Weight e Scale menores |
| Thin Film | sim | não | Layer Weight/Fresnel numa rampa de cores na Emission ou Coat Tint [testar no Blender] |
| Thin Wall | sim | sim, com Thickness 0 e Slab | `thickness_mode = "SLAB"` |
| Nó Bevel | sim | não suportado | chanfro por modificador |
| Nó Ambient Occlusion | sim | sim, menos a opção Only Local | usar sem Only Local |
| Geometry > Pointiness | sim | não | atributo de geometria (Geometry Nodes) |
| Shader to RGB | não | sim (exclusivo do EEVEE) | |
| Caústica de vidro | sim (com custo) | não | luz falsa/projeção |

## Receitas com valores

Tabela mestra. Todas viram funções em `materiais.py` com o mesmo nome. "Teste" indica se a receita aparece numa prova renderizada.

| Receita | Base Color (hex sRGB ou linear) | Metallic | Roughness | IOR | Extras | Função | Teste |
|---|---|---|---|---|---|---|---|
| Plástico brilhante | cor da marca | 0 | 0,18 | 1,50 | Specular IOR Level 0,5 | `plastico_brilhante()` | grade 1 |
| Plástico fosco | cor da marca | 0 | 0,55 | 1,50 | Specular 0,45; Diffuse Roughness 0,3 | `plastico_fosco()` | grade 2 |
| Soft touch | #1C1C1E | 0 | 0,62 | 1,50 | Sheen 0,15 / 0,4 | `plastico_soft_touch()` | |
| Cromo | lin (0,654; 0,685; 0,701) | 1 | 0,04 | | Specular Tint (0,591; 0,675; 0,703) | `cromo()` | grade 3 |
| Ouro | lin (1,0; 0,773; 0,307) | 1 | 0,18 | | Tint (1,0; 0,985; 0,523) | `ouro()` | grade 4 |
| Aço inox escovado | lin (0,669; 0,639; 0,598) | 1 | 0,28 ± 0,08 | | Anisotropic 0,8; Tangent radial; ruído esticado | `metal_escovado()` | grade 5 |
| Alumínio anodizado | ver tabela de cores | 1 | 0,32 | | Tint = cor clareada | `aluminio_anodizado()` | grade 6 |
| Vidro limpo | branco | 0 | 0,0 | 1,52 | Transmission 1 | `vidro_limpo()` | |
| Vidro fosco (jateado) | branco | 0 | 0,35 | 1,52 | Transmission 1 | `vidro_fosco()` | |
| Vidro colorido | branco | 0 | 0,0 | 1,52 | Volume Absorption cor + densidade 40/m | `vidro_colorido()` | grade 7 |
| Água | branco | 0 | 0,0 | 1,333 | Absorção #E8F4F8, 2/m | `liquido("agua")` | |
| Refrigerante cola | branco | 0 | 0,0 | 1,35 | Absorção #5A1E0E, 120/m | `liquido("refrigerante")` | |
| Óleo | branco | 0 | 0,0 | 1,47 | Absorção #E8C84A, 30/m | `liquido("oleo")` | |
| Perfume | branco | 0 | 0,0 | 1,36 | Absorção #F2B8C6, 25/m | `liquido("perfume")` | grade 8 |
| Borracha | #1E1E1E | 0 | 0,75 | 1,52 | Specular 0,35; Sheen 0,1 | `borracha()` | |
| Tecido | cor | 0 | 0,85 | | Sheen 1 / 0,35; Specular 0,25; trama em bump | `tecido()` | grade 9 |
| Cerâmica | #F2EEE6 | 0 | 0,35 | | Coat 1 / 0,04; SSS 0,05 / 2 mm | `ceramica()` | grade 10 |
| Madeira | rampa #7A4A26 a #C48A55 | 0 | 0,45 | | anéis (Wave Rings) + bump 0,05 | `madeira()` | |
| Papel | #F4F1EA | 0 | 0,80 | | Thin Wall; SSS 0,3 / 1 mm | `papel()` | |
| Pele de fruta | #B8231A | 0 | 0,35 | | SSS 0,4; raio (1; 0,25; 0,12); 5 mm; Coat 0,3 | `pele_fruta()` | grade 11 |
| Pintura automotiva | cor | 0,6 | 0,35 | | Coat 1 / 0,02; flocos Voronoi na Normal | `pintura_automotiva()` | grade 12 |
| Gelo | branco | 0 | 0,03 a 0,30 (ruído) | 1,31 | bump 0,25; Volume Scatter 3/m | `gelo()` | |
| Tela de celular | quase preto | 0 | 0,4 | | Emission 1,0; Coat 1 / 0,02 / 1,52 | `tela_celular()` | |

### Plástico brilhante e plástico fosco

**Valores.** Brilhante: Roughness 0,15 a 0,22, IOR 1,5 (ABS e policarbonato ficam entre 1,49 e 1,59). Fosco: Roughness 0,5 a 0,6, Specular IOR Level 0,45, Diffuse Roughness 0,3.

**Por quê.** Plástico é dielétrico: a cor vem do difuso e o reflexo é branco (não tinge). A diferença entre brilhante e fosco é só a aspereza; não mexa em Metallic. Diffuse Roughness no fosco tira o "brilho de plástico de brinquedo" da borda.

**Sinal de erro.** Reflexo colorido (alguém pôs Metallic acima de 0); brilho idêntico em toda a peça (falta a camada de imperfeição); cor da marca "lavada" (ver seção de cor da marca).

```python
mat = M.plastico_brilhante("#E8432F")      # Roughness 0.18
M.imperfeicao(mat, amplitude=0.08, escala_mm=10)
```

### Metais: cromo, ouro, alumínio, aço

**Valores medidos** ([Physically Based, API](https://api.physicallybased.info/materials)), em linear. "Cor" vai na Base Color; "borda" vai na Specular Tint.

| Metal | Cor (Base Color) | Borda (Specular Tint) | Roughness sugerida |
|---|---|---|---|
| Alumínio | 0,916; 0,923; 0,924 | 0,989; 0,989; 0,972 | 0,15 a 0,35 |
| Cromo | 0,654; 0,685; 0,701 | 0,591; 0,675; 0,703 | 0,02 a 0,06 |
| Ouro | 1,059 (use 1,0); 0,773; 0,307 | 1,001; 0,985; 0,523 | 0,10 a 0,25 |
| Prata | 0,991; 0,985; 0,974 | 1,0; 1,0; 0,991 | 0,05 a 0,2 |
| Cobre | 0,932; 0,623; 0,522 | 0,999; 0,900; 0,744 | 0,15 a 0,3 |
| Latão | 0,910; 0,778; 0,423 | 0,995; 0,974; 0,747 | 0,15 a 0,3 |
| Aço inox | 0,669; 0,639; 0,598 | 0,804; 0,791; 0,714 | 0,2 a 0,35 |
| Titânio | 0,441; 0,400; 0,361 | 0,670; 0,641; 0,520 | 0,25 a 0,4 |
| Ferro | 0,530; 0,513; 0,494 | 0,612; 0,541; 0,422 | 0,3 a 0,5 |
| Platina | 0,765; 0,730; 0,676 | 0,873; 0,850; 0,747 | 0,1 a 0,25 |

**Por quê.** Metal não tem difuso: tudo que você vê é reflexo do ambiente. Por isso metal num estúdio vazio fica preto ou cinza morto. O cromo da grade só funciona porque há HDRI e três luzes de área para refletir.

**Sinal de erro.** Ouro "amarelo-mostarda" (Base Color saturada inventada); cromo cinza chapado (ambiente sem contraste, falta cartão branco e bandeira preta); metal com aspereza 0 e nenhuma variação (parece CG; use a camada de imperfeição com amplitude 0,04 a 0,08).

### Metal escovado (anisotropia + ruído esticado)

**Valores.** Aço inox, Roughness 0,28, Anisotropic 0,8, Rotation 0, Tangent radial em Z (riscas circulares) ou por UV (riscas retas). Ruído: Noise Texture em coordenada de objeto com Mapping de escala (2; 2500; 2500) quando as riscas correm ao longo de X. Em metros, 2500 por metro dá variação a cada ~0,4 mm, que é a ordem de tamanho de uma risca de lixa vista a 30 cm. Map Range do ruído para Roughness ± 0,08 e bump de 0,08 com Distance 0,2 mm.

**Por quê.** A anisotropia estica o brilho perpendicular às riscas (só Cycles). O ruído esticado desenha as riscas visíveis no close e também funciona no EEVEE, onde a anisotropia é ignorada. A [análise de Neil Blevins sobre metal escovado](http://www.neilblevins.com/art_lessons/material_brushed_metal/material_brushed_metal.htm) mostra os dois componentes (brilho alongado e textura de riscas) como inseparáveis no material real.

**Sinal de erro.** Brilho esticado na direção errada (gire `Anisotropic Rotation` 0,25 = 90°); riscas grossas como madeira (escala do Mapping baixa demais); brilho com "estrela" serrilhada (Tangent de UV ruim; troque para radial).

```python
mat = M.metal_escovado("aco_inox", roughness=0.28, anisotropia=0.8, eixo="Z")
```

### Alumínio anodizado (cores)

Anodização cria uma camada de óxido que recebe corante. Visualmente: metal com cor saturada, reflexo um pouco mais claro na borda e acabamento acetinado (jateado antes de anodizar).

| Cor | Hex sRGB (aproximação visual) |
|---|---|
| Grafite (space gray) | #3A3B3E |
| Prata natural | #C9CBCC |
| Azul | #2E5C9A |
| Vermelho | #A3242C |
| Dourado (champagne) | #C9A15A |
| Rosa | #D9A3A0 |
| Verde | #3F6B4E |
| Preto | #1A1A1C |

Essas cores são aproximações visuais de catálogo, **não medidas** (não há F0 publicado para alumínio tingido). Base Color = cor, Specular Tint = cor clareada 50% para o branco, Roughness 0,28 a 0,38, Metallic 1. Sinal de erro: parece plástico colorido (Metallic 0) ou tinta automotiva (Roughness baixa demais e sem variação).

### Vidro limpo, fosco e colorido

**Vidro limpo:** Transmission Weight 1, Roughness 0, IOR 1,52, Base Color branco. **Fosco (jateado):** igual com Roughness 0,3 a 0,45. Para vidro fosco só numa área (logo jateado), ligue uma máscara na Roughness.

**Vidro colorido pela absorção, não pela Base Color.** A Base Color na transmissão tinge a superfície de forma igual, não importa a espessura: um frasco de 5 mm de parede e um bloco de 5 cm ficam com a mesma cor, e a borda não escurece. Vidro real escurece onde a luz percorre mais material (lei de Beer-Lambert). A extensão glTF [KHR_materials_volume](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_volume/README.md) resume: transmitância T(x) = c^(x/d), em que c é a cor atingida após a distância d, e o coeficiente é σ = -ln(c)/d. No Blender, ligue um **Volume Absorption** (manual: "uso típico: água e vidro colorido") na entrada **Volume** do Material Output e mantenha a Base Color branca.

- Densidade (em 1/m, com cena em metros): frasco de perfume de 5 a 8 cm, 20 a 40; garrafa de vidro verde, 40 a 80; bloco de vidro decorativo, 10 a 20; refrigerante cola, 100 a 150.
- A biblioteca assume coeficiente efetivo ≈ densidade x (1 - cor) por canal **[não verificado na fonte do Cycles]**. Ajuste no olho: se a parte mais grossa ficar preta, divida a densidade por 2.
- O 5.2 também tem o nó **Volume Coefficients** (sonda: entradas `Absorption Coefficients`, `Scatter Coefficients`, `Anisotropy`, `IOR`, `Backscatter` etc.), que permite escrever o coeficiente por canal direto com a fórmula do glTF **[confirmado por sonda no bpy 5.2.2; versão de entrada não verificada]**.

**[testado no bpy 5.2.2 Cycles CPU, nuvem]** Vidro verde (#2E8B57, densidade 40) num cilindro de 54 mm de diâmetro: verde escuro com borda mais densa, leitura correta. Achado: sobre chão escuro, a base do cilindro fica quase preta porque refrata o chão. **Regra:** vidro precisa de algo claro atrás (cartão branco, faixa de luz, fundo em gradiente) e bandeiras pretas nas laterais para desenhar o contorno (laboratório do estúdio).

**Sinal de erro.** Vidro "de plástico" (Roughness acima de 0 sem querer); vidro preto (faltam bounces de transmissão; no Cycles use 12 ou mais em `cycles.transmission_bounces`); vidro invisível (fundo uniforme sem nada para refratar).

```python
mat = M.vidro_colorido("#2E8B57", densidade=40, ior=1.52)
```

### Líquidos: água, refrigerante, óleo, perfume

Mesmo esquema do vidro colorido, com IOR do líquido.

| Líquido | IOR | Cor de absorção | Densidade (1/m) | Fonte do IOR |
|---|---|---|---|---|
| Água | 1,333 | #E8F4F8 (quase nada) | 2 | Physically Based |
| Refrigerante cola | 1,35 | #5A1E0E | 120 | aproximado (água + açúcar) [não verificado] |
| Cerveja | 1,34 | #E0A23A | 60 | aproximado [não verificado] |
| Óleo de cozinha | 1,47 | #E8C84A | 30 | Physically Based |
| Perfume (base etanol) | 1,36 | #F2B8C6 | 25 | etanol 1,362, Physically Based |
| Mel | 1,504 | #D4900A | 80 | Physically Based |

**Líquido dentro de recipiente.** Modele o líquido como malha separada que **invade levemente** a parede interna do vidro (0,1 a 0,2 mm). Se houver vão de ar entre líquido e vidro, a luz faz duas refrações extras e o líquido parece "flutuar". O jeito fisicamente certo é ter a interface vidro/líquido com IOR relativo (1,333/1,52), mas a sobreposição pequena é o método prático aceito [testar no Blender: comparar os dois em close de copo].

Sinal de erro: refrigerante preto chapado (densidade alta demais para a espessura); água azul (água limpa em copo não é azul; azul é só em piscina, metros de profundidade).

### Borracha

Base #1E1E1E (pneu, segundo o Physically Based, é 0,023 linear, quase isso), Roughness 0,7 a 0,8, Specular IOR Level 0,35, Sheen 0,1 com Roughness 0,5 (pó fino que borracha atrai). Sinal de erro: borracha brilhando como plástico (Roughness abaixo de 0,6).

### Tecido (sheen)

Base na cor do tecido, Roughness 0,85, Specular IOR Level 0,25, **Sheen Weight 1, Sheen Roughness 0,3 a 0,4, Sheen Tint branco**, Diffuse Roughness 0,6. A trama vem de duas Wave Texture cruzadas (escala 180 por unidade de UV) multiplicadas e ligadas num Bump de força 0,3. Para close de produto (camiseta, tênis), troque por textura CC0 de tecido. Sinal de erro: tecido "de plástico" (sem sheen, a borda escurece em vez de clarear).

### Cerâmica

Base #F2EEE6 (branco quente, porcelana medida é 0,745 linear), Roughness 0,35 na base, **Coat Weight 1, Coat Roughness 0,04**, Subsurface Weight 0,05, Scale 0,002. O coat dá o reflexo nítido do esmalte e a base mais áspera dá a profundidade. Sinal de erro: parece plástico branco (sem coat) ou sabonete (SSS alto).

### Madeira

Procedural para plano médio: Wave Texture tipo `RINGS`, escala 25, distorção 6, Mapping com escala Z 0,15 (veio alongado), rampa de #7A4A26 a #C48A55, Roughness 0,45, bump 0,05. Com verniz: Coat Weight 0,6 a 1, Coat Roughness 0,08. **Para close, use textura CC0** (Poly Haven tem madeiras com tamanho real informado). Sinal de erro: anéis concêntricos perfeitos como alvo (distorção baixa).

### Papel

Base #F4F1EA, Roughness 0,8, Specular IOR Level 0,3, **Thin Wall ligado, Subsurface Weight 0,3, Scale 0,001**. O Thin Wall faz a luz de contra atravessar a folha. Valor de referência do Physically Based para papel de escritório: (0,794; 0,834; 0,884) linear, levemente azulado por branqueador óptico. Sinal de erro: papel cinza (Base Color baixa) ou papel que brilha (Roughness abaixo de 0,6).

### Tela de celular com vidro por cima

Duas formas, as duas testadas na biblioteca:

**Forma 1, um material só (recomendada para motion):** use quando não há cartões flutuando sobre a tela. Com camadas explodidas, ponha a imagem também na Base Color (aspereza 0,35), senão os cartões não projetam sombra (cap 03 §1; ver 00 · Padrões da casa).

| Entrada | Valor |
|---|---|
| Base Color | (0,005; 0,005; 0,006) (tela apagada é quase preta) |
| Roughness | 0,4 |
| Emission Color | imagem da UI (Image Texture) ou cor |
| Emission Strength | **1,0** no AgX (desbota acima de ~1,3) |
| Coat Weight | 1,0 |
| Coat Roughness | 0,02 |
| Coat IOR | 1,52 |

Funciona porque no Principled v2 a emissão fica abaixo do coat ([notas 4.0](https://developer.blender.org/docs/release_notes/4.0/shading/)): o reflexo do vidro soma por cima da imagem, como no aparelho real.

**Forma 2, vidro separado (close extremo, borda de vidro curva visível):** malha de vidro de 0,5 a 0,7 mm sobre a tela com `vidro_tampa()`: Transmission 1, Roughness 0, IOR 1,52, **Thin Wall** ligado e `thickness_mode = "SLAB"`. O Thin Wall evita a lupa de refração.

**Imagem da UI.** Image Texture com espaço de cor sRGB (é cor), extensão `EXTEND`, filtro `Smart` ou `Cubic` para texto nítido (opções confirmadas por sonda: `Linear`, `Closest`, `Cubic`, `Smart`). Sinal de erro: tela "lavada" (força acima de 1,3 no AgX); tela "adesivo" sem reflexo (falta coat); UI ilegível (resolução da imagem menor que 2x o tamanho em pixels na tela final).

### Pintura automotiva (coat + flocos metálicos)

| Entrada | Valor |
|---|---|
| Base Color | cor da pintura (ex. #8E0F1B) |
| Metallic | 0,6 (base metalizada) |
| Roughness | 0,35 |
| Normal (base) | flocos: Voronoi escala 1500/m (células ~0,7 mm), cor aleatória menos 0,5, somada à normal e normalizada |
| Coat Weight | 1,0 |
| Coat Roughness | 0,02 |
| Coat IOR | 1,5 |
| Coat Normal | vazio (verniz liso) ou ruído de "casca de laranja" bem fraco |

Os flocos vão só na Normal da base. O verniz continua liso por cima, e é isso que dá o efeito de profundidade: reflexo nítido em cima e brilho granulado embaixo. Técnica igual ao que tutoriais de pintura de carro descrevem ([BlenderNation, car paint](https://www.blendernation.com/2016/01/22/tutorial-realistic-car-paint-brdf-material/), [CGian](https://cgian.com/blender-metallic-car-paint-material/)). **[testado no bpy 5.2.2 Cycles CPU, nuvem]** Na grade (esfera de 6 cm a 85 mm), os flocos aparecem como brilho granulado vermelho. Sinal de erro: flocos visíveis como bolinhas (escala baixa); pintura sem profundidade (flocos ligados no Coat Normal).

### Pele de fruta (subsurface)

Maçã, tomate, uva, morango. `#B8231A`, Roughness 0,35, `subsurface_method = "RANDOM_WALK"`, Subsurface Weight 0,4, Radius (1,0; 0,25; 0,12), Scale 0,005, Coat 0,3 / 0,15 (cera natural). Para laranja e limão: Roughness 0,5 com bump de poros (Voronoi escala ~1500/m, força 0,2). Uva e cereja: Weight 0,6 e Scale 0,008. **[testado no bpy 5.2.2 Cycles CPU, nuvem]**: o primeiro chute (#E2492F, Weight 0,6, Scale 0,008) saiu salmão; o valor da tabela saiu vermelho de tomate.

### Gelo

IOR 1,31, Transmission 1, Roughness variando por ruído entre 0,03 e 0,30 (geada e derretimento), bump 0,25 do mesmo ruído, e **Volume Scatter** de densidade 3/m com cor (0,85; 0,93; 1,0) para a névoa de bolhas internas. Cubo de gelo real tem bolhas e rachaduras no centro: para close, adicione uma malha interna com Volume Scatter mais denso (20 a 50/m) [testar no Blender]. Sinal de erro: gelo que parece vidro (sem variação de aspereza, sem névoa).

## Camada de imperfeição

O objetivo não é "sujar". É quebrar a uniformidade que o olho reconhece como CG. Em produto de anúncio a sujeira deve ser **quase invisível de longe e legível no close**.

### Variação de aspereza por ruído (sempre)

| Parâmetro | Valor | Por quê |
|---|---|---|
| Amplitude de variação | 0,05 a 0,15 (herói limpo: 0,05 a 0,08; objeto manuseado: 0,10 a 0,15) | Abaixo de 0,05 o olho não vê; acima de 0,15 parece sujo |
| Tamanho da mancha | 5 a 15 mm em produto de mão | Escala de dedo e de pano |
| Escala do Noise | 1000 / tamanho em mm (8 mm = 125) em coordenada de **objeto** | Coordenada de objeto acompanha o objeto animado; Generated estica |
| Detail | 6 | Borda orgânica |
| Map Range | From 0,3 a 0,7 para To base ± amplitude/2 | O ruído vive entre 0,3 e 0,7; sem isso a variação real fica pela metade |

Função: `imperfeicao(mat, amplitude=0.10, escala_mm=8)`. Ela lê a Roughness atual e cria a variação em volta dela. Se a Roughness já estiver ligada (metal escovado, gelo), a função não sobrescreve.

### Micro riscos

Voronoi com `feature = "DISTANCE_TO_EDGE"`, escala 120/m, coordenada de objeto esticada 12x em um eixo e girada (0,3; 0,7; 0,2) rad. Map Range: distância 0 a 0,015 vira +0,12 a 0 de Roughness. Resultado: linhas finas mais ásperas, visíveis só no reflexo. Somado com `use_clamp` ligado. Sinal de erro: rede de "teia de aranha" visível fora do reflexo (escala baixa ou amplitude alta).

### Digitais e manchas (textura CC0)

Digital não se faz bem procedural. Use uma textura de smudge/fingerprint CC0 (ambientCG e Poly Haven têm "Smudges"/"Fingerprints" na categoria de imperfeições [não verificado o nome exato do asset]), em `Non-Color`, projeção `BOX` com blend 0,2 e escala de 5 cm por repetição. Mistura com fator 0,6 levando a Roughness para base + 0,25 onde há marca. Na biblioteca: `imperfeicao(mat, digitais="caminho.png", escala_digitais=0.05)`. **Regra:** em produto de anúncio, digitais só em superfície preta brilhante e só no quadro de close.

### Poeira

Duas formas: (1) Sheen Weight 0,05 a 0,15 com Sheen Roughness 0,5 em tudo que é escuro e fosco, poeira fina uniforme; (2) máscara de "topo" (Normal Z da Geometry, Map Range de 0,7 a 1,0) multiplicada por ruído fino, misturando Base Color para um cinza claro e Roughness para 0,9. Poeira só em superfície virada para cima. Sinal de erro: poeira na lateral vertical.

### Desgaste de borda

| Método | Motor | Custo | Quando |
|---|---|---|---|
| Geometry > **Pointiness** | só Cycles ("Pointiness is not supported" no EEVEE) | baixo | malha densa (depende de vértice) |
| Nó **Ambient Occlusion** com `Inside` | Cycles e EEVEE (EEVEE sem Only Local) | alto ("computacionalmente caro", manual) | cavidades e bordas sem malha densa |
| Nó **Bevel** comparado com a normal original | só Cycles ("Not supported: ... Bevel" no EEVEE) | alto (~20% mais lento, manual) | still frame |
| **Geometry Nodes**: `Edge Angle` ou curvatura, gravado como atributo e lido pelo nó Attribute | Cycles e EEVEE | calculado uma vez | animação no EEVEE |
| **Vertex color** pintada ou gerada por script | Cycles e EEVEE | zero | objeto herói fixo |

Fontes: [Supported Nodes 5.2](https://docs.blender.org/manual/en/latest/render/eevee/limitations/nodes_support.html), manual do nó Bevel e do nó AO (raw do manual 5.2). O nó de Geometry Nodes `GeometryNodeInputMeshEdgeAngle` existe no 5.2 **[confirmado por sonda no bpy 5.2.2]**; não existe nó de curvatura de malha pronto (só `SDFGridMeanCurvature`, para volume). Caminho EEVEE: Geometry Nodes com Edge Angle (ângulo entre faces) > Capture/Store Named Attribute no domínio de ponto chamado "borda" > nó Attribute "borda" no shader > rampa [testar no Blender].

Função Cycles pronta: `desgaste_borda_cycles(mat, cor_metal="aluminio", limiar=0.55)` (Pointiness numa rampa estreita de 0,55 a 0,60 que mistura a cor do metal e liga Metallic na borda). Para produto novo de anúncio, **não use desgaste de borda**: produto novo não tem borda gasta. Use em objeto de cenário (mesa, ferramenta, peça industrial).

### Prova antes/depois

**[testado no bpy 5.2.2 Cycles CPU, nuvem]** `teste_imperfeicao.py`: estojo 60 x 60 x 40 mm em plástico preto brilhante (#141416, Roughness 0,22) com tampa de alumínio (Ø 36 mm), 640x480, 48 amostras, denoise, AgX Medium High Contrast.

- `/home/claude/provas/imperfeicao_antes.png`: aspereza uniforme, sem chanfro, shade flat. Aresta da caixa é uma linha dura sem luz; o reflexo no topo é um espelho perfeito; a tampa parece cilindro de software.
- `/home/claude/provas/imperfeicao_depois.png`: chanfro 3 mm / 5 segmentos na caixa e 1 mm / 4 segmentos na tampa, imperfeição amplitude 0,12 / 10 mm no plástico e 0,08 / 6 mm no alumínio. Cada aresta ganhou um fio de luz que desenha o volume; o topo mostra manchas de manuseio sutis no reflexo; a tampa ganhou a linha de brilho no chanfro superior.

Medidor: média 0,57, estourado 1,1% (antes 1,17%), afundado 5,8%. A exposição praticamente não muda; o que muda é a leitura de forma.

## Chanfro em tudo

### Por que aresta viva denuncia CG

No mundo real nenhuma aresta tem raio zero. Mesmo uma lâmina de faca tem raio de micrômetros, e um celular tem raio de 0,5 a 1 mm na borda do vidro. Esse raio pega luz de um ângulo amplo e devolve um fio brilhante que contorna o objeto. Sem ele: (1) a aresta some contra o fundo, (2) a face lateral e a de cima viram dois planos colados, (3) o sombreamento suave de normal fica com "bico" nas quinas. É o sinal nº 1 de "render de software".

### Modificador Bevel: valores por objeto

Largura em escala real (cena em metros, `width = mm / 1000`):

| Objeto | Largura | Segmentos |
|---|---|---|
| Celular, fone, relógio | 0,5 a 1 mm | 3 a 4 |
| Logo 3D extrudado (5 a 10 mm de espessura) | 0,3 a 0,6 mm | 3 |
| Logo grande (> 15 cm, espessura > 10 mm) | 1 a 1,5 mm (regra relativa: 5 a 10% da espessura total; ver 00 · Padrões da casa) | 3 |
| Frasco, pote, tampa | 1 a 2 mm | 4 |
| Caixa de embalagem (papel cartão) | 0,3 a 0,5 mm | 2 |
| Caixa rígida, peça plástica grande | 2 a 4 mm | 4 a 5 |
| Móvel, bancada | 3 a 6 mm | 4 a 5 |

Configuração (nomes confirmados por sonda no bpy 5.2.2):

| Propriedade | Valor | Motivo |
|---|---|---|
| `width` | tabela acima | escala real |
| `segments` | 3 a 5 | 1 segmento é chanfro plano (bisel), 3 já lê como curva |
| `limit_method` | `"ANGLE"` | só arestas com ângulo; não chanfra a malha toda |
| `angle_limit` | 30° (`math.radians(30)`) | padrão do Blender; pega quinas de 90° e ignora curvas suaves |
| `use_clamp_overlap` | True | impede chanfro atravessar geometria |
| `miter_outer` | `"MITER_ARC"` | quina de três arestas arredondada |
| `harden_normals` | True | as faces planas continuam planas; o sombreamento suave fica só no chanfro |
| `profile` | 0,5 | perfil circular (superelipse) |

Manual 5.2 do modificador ([Bevel Modifier](https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/bevel.html)): Harden Normals "ajusta as normais das faces do chanfro para combinar com as faces vizinhas" e precisa de um atributo de normais customizadas, "criado automaticamente se necessário". Limit Method Angle "só chanfra arestas cujo ângulo entre normais de face mais o ângulo definido é menor que 180°".

```python
M.chanfrar(obj, largura_mm=1.0, segmentos=4, angulo=30)
bpy.ops.object.shade_smooth()   # harden normals só funciona com sombreamento suave
```

**Ordem na pilha:** Bevel antes de Subdivision Surface (se houver) e depois de Solidify. Sinal de erro: faces planas com manchas escuras de sombreamento (falta harden normals ou shade smooth); chanfro "inchado" em peça pequena (largura em escala errada, conferir `obj.scale` aplicado: aplique a escala antes, `transform_apply(scale=True)`, senão a largura é multiplicada).

### Nó Bevel (shader)

O nó Bevel arredonda **só o sombreamento** da aresta, sem geometria. Manual 5.2: **"Cycles Only"**, caro ("pode reduzir a velocidade em cerca de 20%"), recomendado para bake ou still, e com resultado inválido com caústica ativa ou OSL no OptiX. A lista de nós do EEVEE confirma: "Not supported: ... Bevel". Parâmetros: `Radius` em metros (0,5 a 1 mm = 0,0005 a 0,001) e `samples` 4 a 8.

**Regra do estúdio:** chanfro por **modificador** sempre (funciona nos dois motores e é geometria real que reflete). Nó Bevel só em still Cycles de objeto importado que não aceita modificador (malha suja de CAD). Função: `bevel_shader(mat, raio_mm=0.8, amostras=8)`.

## Texturas PBR CC0: Poly Haven e ambientCG

### Licença

| Fonte | Licença | Uso comercial | Atribuição | Página |
|---|---|---|---|---|
| Poly Haven | CC0 ("efetivamente domínio público") | sim, "para qualquer fim, inclusive trabalho comercial" | não exigida, apreciada | [polyhaven.com/license](https://polyhaven.com/license) |
| ambientCG | CC0 1.0 Universal | sim, "copiar, modificar, distribuir... mesmo para fins comerciais" | não exigida; sugere "Created using <asset> from ambientCG.com, licensed under CC0 1.0" | [docs.ambientcg.com/license](https://docs.ambientcg.com/license/) |
| HDRIs que vêm com o Blender (`datafiles/studiolights/world`) | CC0 (arquivo `license.txt`: criados por Greg Zaal, Poly Haven) | sim | não exigida | arquivo local |

Os termos de serviço da Poly Haven proíbem raspagem do site (scraping). **Regra:** baixe pela página ou pela API pública, um asset por vez, e registre o nome e a fonte no arquivo de créditos do projeto.

### Escala correta (tamanho real da amostra)

Toda textura fotográfica representa um pedaço do mundo com tamanho definido. A Poly Haven informa a dimensão real na página do asset; a API devolve um campo `dimensions` (ex. `wood_table_001` = 1500 x 1500, que corresponde a 1,5 x 1,5 m) [não verificado: unidade do campo é mm pela leitura do valor]. A ambientCG também informa o tamanho físico em muitos materiais [não verificado em todos].

**Como aplicar em escala real:**

1. Coordenada: UV com o mapa desdobrado em escala real (Unwrap com "Scale to Bounds" desligado) ou coordenada de **objeto** com projeção `BOX` (opções do Image Texture confirmadas por sonda: `FLAT`, `BOX`, `SPHERE`, `TUBE`; blend 0,1 a 0,3).
2. Mapping com `Scale = 1 / tamanho_real_m`. Textura de 1,5 m: escala 0,667. Couro de 0,5 m: escala 2.
3. **Texel density** (densidade de pixels por metro): mapa de 4096 px num tamanho real de 2 m = 2048 px/m. Para o objeto ocupar 1080 px de altura na tela com 15 cm reais, você precisa de 1080 / 0,15 = 7200 px/m. Abaixo disso a textura borra no close. Regra: densidade da textura maior ou igual a 1,5x a densidade de tela.

Sinal de erro: veio de madeira do tamanho de uma unha numa mesa (escala alta); couro com poros do tamanho de moeda (escala baixa).

### Como evitar repetição visível

O 5.2 **não tem** nó de "anti-tiling" ou "texture bombing" embutido **[confirmado por sonda no bpy 5.2.2]**: a busca por tipos `ShaderNode*` com "Til", "Bomb" ou "Random" só encontra `ShaderNodeRadialTiling` (5.0), que é para formas e ladrilhos radiais com cantos arredondados (entradas `Vector`, `Sides`, `Roundness`), não para quebrar repetição de textura. As técnicas que funcionam, da mais barata à mais cara:

1. **Escala real + enquadramento.** Muitas vezes a repetição só aparece porque a escala está errada.
2. **Mistura com ruído de baixa frequência.** Multiplique a Base Color por um Noise grande (escala 0,5 a 2 por metro) remapeado para 0,85 a 1,15, e faça o mesmo na Roughness. Quebra o padrão sem custo de leitura extra.
3. **Duas amostras da mesma textura** com escala e rotação diferentes (ex. 1,0 e 0,73 com 37° de rotação), misturadas por um Noise. Custo: 2 leituras. Equivale à técnica 3 de [Inigo Quilez, Texture Repetition](https://iquilezles.org/articles/texturerepetition/) (a mais barata das três, 2 leituras).
4. **Texture bombing com Voronoi.** Voronoi `Color` (aleatório por célula) alimenta rotação e deslocamento do Mapping de cada célula. Quilez descreve a versão de qualidade com 9 leituras; a versão por célula sem blend tem costura nas bordas das células [testar no Blender]. Referência clássica: [GPU Gems, cap. 20, Texture Bombing](https://developer.nvidia.com/gpugems/gpugems/part-iii-materials/chapter-20-texture-bombing).
5. **Extensão `MIRROR`** do Image Texture (opções confirmadas: `REPEAT`, `EXTEND`, `CLIP`, `MIRROR`): espelha nas emendas, reduz costura mas cria simetria visível em superfície grande.

## Shaders estilizados para os mundos não realistas

Prova: `/home/claude/provas/estilizados_eevee.png` e `/home/claude/provas/estilizados_cycles.png` (toon, argila, pastel, gradiente, holográfico, bolha), **[testado no bpy 5.2.2, EEVEE e Cycles CPU, nuvem]**.

### Toon (Shader to RGB, só EEVEE)

Diffuse BSDF > **Shader to RGB** > Color Ramp em `CONSTANT` > Emission. Shader to RGB está na lista de nós exclusivos do EEVEE ([Supported Nodes](https://docs.blender.org/manual/en/latest/render/eevee/limitations/nodes_support.html)). **No Cycles o resultado é cor chapada sem sombra** (prova `estilizados_cycles.png`, primeira esfera).

| Parâmetro | Valor |
|---|---|
| Cor clara | cor da marca |
| Cor de sombra | cor x 0,45 (ou cor puxada para o azul/roxo, mais bonito que escurecer) |
| Posição do degrau (`limiar`) | 0,5 inicial; suba até a sombra ocupar 30 a 40% da forma |
| Interpolação da rampa | `CONSTANT` |

**[testado]** Com limiar 0,12 a sombra sumiu (o mundo claro ilumina tudo acima disso); com 0,5 aparece uma faixa de sombra estreita. Em mundo claro, suba para 0,7 a 0,8. Contorno (outline) por modificador Solidify com normais invertidas e material preto de backface culling, ou Line Art [testar no Blender].

### Argila (clay)

Base #D8C7B4, Roughness 0,7, Specular IOR Level 0,3, Diffuse Roughness 0,5 (Cycles), Subsurface 0,15 / 3 mm. Para "mundo argila" do estúdio, todos os objetos no mesmo material, contraste vem só da luz. Sinal de erro: argila brilhante (Roughness abaixo de 0,6).

### Gradiente

Coordenada de objeto > Separate XYZ > Map Range (de -altura/2 a +altura/2 do objeto, em metros) > Color Ramp com duas cores da marca > Base Color. Roughness 0,4. Função `gradiente(cor_a, cor_b, eixo="Z", altura=0.1)`. Use cores de luminância parecida (ex. #6A5CFF e #FF7AB6) ou o gradiente parece sombra.

### Holográfico e iridescente (thin film)

Receita testada: base dielétrica escura (0,012; 0,012; 0,016), Metallic 0, Roughness 0,08, IOR 1,5, **Thin Film IOR 1,9**, Thin Film Thickness variando de 250 a 750 nm por Noise (escala 12, distorção 1,5). Só Cycles. Precisa de ambiente com contraste (HDRI ou faixas de luz). No EEVEE vira esfera escura (prova). Alternativa EEVEE: Layer Weight (Facing) > Color Ramp de arco-íris > Emission fraca (0,2 a 0,4) somada ao Principled [testar no Blender].

### Soft pastel

Base clara de saturação média (#F6C6D0, #CDE7F0, #E8E2F7), Roughness 0,55, Specular IOR Level 0,4, Sheen 0,3 / 0,5 (borda clara aveludada), Subsurface 0,2 / 4 mm. Luz grande e suave, fundo na mesma família de cor 10 a 15% mais escuro. Sinal de erro: pastel virando cinza (AgX com exposição baixa; suba exposição em vez de clarear a cor).

### Bolha de sabão

Transmission 1, Roughness 0, **IOR 1,0**, Thin Wall ligado, Thin Film 450 nm e IOR 1,33. Só Cycles. Prova: bordas com arco-íris sutil.

## Cor da marca sob AgX

### O problema medido

AgX comprime brilho e **desatura** cores muito saturadas e claras para evitar o "estouro em cor pura" que o Standard faz. Isso é ótimo para luz e péssimo para o hex da marca. Medição com `teste_cor_marca.py` (plano com emissão força 1,0, sem luz, PNG 8 bits, valor lido no pixel central; d = maior diferença de canal em 0 a 255) **[testado no bpy 5.2.2 Cycles CPU, nuvem]**:

| Hex da marca | Standard | AgX | AgX Punchy | Khronos PBR Neutral |
|---|---|---|---|---|
| #E8432F (vermelho) | #E8432F (d0) | #CE5037 (d26) | #B0320F (d56) | #E43515 (d26) |
| #2F6FE8 (azul) | exato | #437DC6 (d34) | #1861AD (d59) | #1567E4 (d26) |
| #FFC300 (amarelo) | exato | #CCA653 (d83) | #B78D1E (d72) | #F1BA24 (d36) |
| #7B2FF7 (roxo) | exato | #7664CD (d53) | #5848B5 (d66) | #731FED (d16) |
| #00C2A8 (verde água) | exato | #58AD9F (d88) | #139383 (d47) | #01C2A9 (d1) |
| #1C1C1E (preto de marca) | exato | #151617 (d7) | #040405 (d25) | #030308 (d25) |
| #F4F1EA (off-white) | exato | #C1C0BE (d51) | #ADABA8 (d71) | #EBE8E2 (d9) |

Leitura:

- **AgX** escurece o branco (off-white vira cinza claro #C1C0BE) e puxa cores saturadas para o cinza. O amarelo e o verde água são os piores (d83 a d88).
- **Khronos PBR Neutral** chega perto em cor média e saturada (roxo d16, verde água d1, off-white d9), mas **afunda os escuros** (#1C1C1E vira quase preto). Isso bate com a especificação: a saída é `cor - 0,04` para canais entre 0,08 e 0,8, e abaixo de 0,08 entra uma curva que zera mais rápido ([Khronos ToneMapping, PBR Neutral](https://github.com/KhronosGroup/ToneMapping/blob/main/PBR_Neutral/README.md)).
- **Standard** reproduz o hex exato com emissão 1,0, mas estoura luz e reflexo (o problema nº 1 do estúdio).

**[confirmado por sonda no bpy 5.2.2]** View transforms disponíveis: `Standard`, `Khronos PBR Neutral`, `AgX`, `Filmic`, `Filmic Log`, `False Color`, `ACES 1.3`, `ACES 2.0` e `Raw` (no display sRGB). Khronos PBR Neutral existe desde o 4.2 ([notas 4.2](https://developer.blender.org/docs/release_notes/4.2/rendering/)), "projetado para fidelidade de cor PBR, para que as cores sRGB do render batam o mais fielmente possível com a Base Color sRGB dos materiais, sob iluminação em escala de cinza". A [Khronos](https://www.khronos.org/news/press/khronos-pbr-neutral-tone-mapper-released-for-true-to-life-color-rendering-of-3d-products) diz que ele é para "e-commerce", "cenas bem expostas" e luz cinza, e que não substitui um tone mapper fílmico quando o estilo pede.

### Compensar no AgX funciona? Só em parte

`compensar_agx.py` procura a cor de emissão que, depois do AgX, sai igual ao hex (8 iterações por canal) **[testado no bpy 5.2.2 Cycles CPU, nuvem]**:

| Alvo | Emissão linear encontrada | Saída | Bateu? |
|---|---|---|---|
| #E8432F | (1,366; 0,002; 0,001) | #E8513B | perto (d14) |
| #2F6FE8 | (0,0; 0,023; 1,863) | #4E7BE7 | não (d31) |
| #FFC300 | (4,83; 1,10; 0,0) | #FAC4A3 | não (azul sobe sozinho) |
| #7B2FF7 | (0,082; 0,0; 3,27) | #8497F4 | não |
| #00C2A8 | (0,0; 0,90; 0,48) | #7BC2A8 | não |
| #F4F1EA | (4,98; 4,49; 3,31) | #EEEBE6 | sim (d6) |

Conclusão: **o AgX não consegue gerar cores muito saturadas**; mesmo com o canal oposto zerado ele adiciona os outros canais. Para branco e cores pouco saturadas, a compensação funciona (off-white precisa de emissão ~4,5 a 5 para sair como #EEEBE6).

### Regra do estúdio para a cor da marca

1. **Objeto de produto iluminado (caixa, frasco, celular): AgX.** Aceite a mudança e aprove a cor no render, não no hex. Se o cliente exigir o hex na embalagem, use **Khronos PBR Neutral** no filme inteiro e ilumine com luz neutra (5500 a 6500 K), sem estourar. Teste antes no medidor `qa.py`: o Khronos estoura mais fácil que o AgX em luz forte.
2. **Elemento plano de marca (logo final, cartela, letreiro, tela):** três caminhos, em ordem de preferência:
   - Compor o logo em 2D na edição (pós) por cima do render. O hex sai exato. Sempre que o logo é estático, este é o caminho.
   - Renderizar o elemento plano em cena ou passe separado com view transform `Standard` e emissão 1,0, e compor por cima [testar no Blender: a gestão de cor é por cena, então isso pede duas cenas e composição externa].
   - Ficar em AgX e compensar a emissão com `compensar_agx.py` quando a cor for pouco saturada (off-white, cinza, bege, vermelho escuro).
3. **Tela de celular:** AgX com emissão 1,0 (regra do laboratório). A UI vai ficar levemente menos saturada; isso lê como tela real.
4. **Nunca** "corrija" o AgX subindo saturação no material acima do hex. Fica com cara de CG e muda conforme a luz.

## A biblioteca `materiais.py`

Arquivo: `/home/claude/codigo/materiais/materiais.py`. Cabeçalho: `# Blender 5.2 | status: confirmado por sonda ... testado em render Cycles CPU na nuvem`. **[testado no bpy 5.2.2 Cycles CPU, nuvem]**: o `__main__` cria as 26 receitas do catálogo mais imperfeição, desgaste e bevel sem erro de nome.

### Funções

| Grupo | Funções |
|---|---|
| Utilidades | `hex_para_linear`, `novo_material`, `principled`, `saida`, `ajustar(mat, **entradas)` |
| Plásticos | `plastico_brilhante`, `plastico_fosco`, `plastico_soft_touch` |
| Metais | `metal(tipo, roughness)`, `cromo`, `ouro`, `metal_escovado`, `aluminio_anodizado` |
| Vidro e líquido | `vidro_limpo`, `vidro_fosco`, `vidro_colorido`, `absorcao`, `liquido(tipo)`, `gelo` |
| Diversos | `borracha`, `tecido`, `ceramica`, `madeira`, `papel`, `pele_fruta`, `pintura_automotiva`, `tela_celular`, `vidro_tampa` |
| Estilizados | `argila`, `pastel`, `gradiente`, `holografico`, `bolha_sabao`, `toon`, `cor_plana` |
| Imperfeição | `imperfeicao`, `desgaste_borda_cycles`, `bevel_shader` |
| Geometria | `chanfrar(obj, largura_mm, segmentos, angulo, harden)` e tabela `CHANFRO_MM` |
| Tabelas | `METAIS` (cor + borda), `IOR`, `LIQUIDOS`, `ANODIZADO`, `CATALOGO` |

### Convenção de `ajustar()`

`ajustar(mat, Coat_Weight=1, Coat_Roughness=0.02)`: o sublinhado vira espaço e vira o nome exato da entrada. Cor aceita hex, tupla de 3 ou de 4. Nome errado levanta `KeyError` com o nome procurado; isso é proposital, para que um nome do 3.x (`Specular`, `Clearcoat`, `Emission`, `Subsurface Color`) quebre na hora e não passe em silêncio.

Tabela de nomes antigos que IA costuma escrever de memória (todos **inexistentes** no 5.2.2):

| Nome antigo (3.x) | Nome no 5.2 |
|---|---|
| `Specular` | `Specular IOR Level` |
| `Clearcoat`, `Clearcoat Roughness` | `Coat Weight`, `Coat Roughness` |
| `Sheen` | `Sheen Weight` |
| `Subsurface`, `Subsurface Color` | `Subsurface Weight` (a cor vem da Base Color) |
| `Transmission` | `Transmission Weight` |
| `Emission` | `Emission Color` |
| `Clearcoat Normal` | `Coat Normal` |

### Exemplo de uso em cena

```python
# Blender 5.2 | status: testado no bpy 5.2.2 | fonte: 06-materiais.md
import sys, bpy
sys.path.append("/home/claude/codigo/materiais")
import materiais as M

obj = bpy.data.objects["Frasco"]
M.chanfrar(obj, largura_mm=M.CHANFRO_MM["frasco"], segmentos=4)
bpy.ops.object.shade_smooth()

vidro = M.vidro_colorido("#F2B8C6", densidade=25, ior=1.52)
obj.data.materials.append(vidro)

tampa = bpy.data.objects["Tampa"]
M.chanfrar(tampa, largura_mm=1.0)
mt = M.metal_escovado("latao", roughness=0.25, eixo="Z")
M.imperfeicao(mt, amplitude=0.06, escala_mm=6)   # escovado já liga Roughness: a função não sobrescreve
tampa.data.materials.append(mt)
```

### Snippet mínimo de nó (sem a biblioteca)

Para quem precisa colar uma receita direto:

```python
# Blender 5.2 | status: confirmado por sonda (nomes) | fonte: manual 5.2 Principled BSDF
import bpy
mat = bpy.data.materials.new("Tela")
p = mat.node_tree.nodes["Principled BSDF"]
p.inputs["Base Color"].default_value = (0.005, 0.005, 0.006, 1)
p.inputs["Roughness"].default_value = 0.4
p.inputs["Emission Color"].default_value = (0.04, 0.16, 0.92, 1)   # #3B6CF6 em linear
p.inputs["Emission Strength"].default_value = 1.0
p.inputs["Coat Weight"].default_value = 1.0
p.inputs["Coat Roughness"].default_value = 0.02
p.inputs["Coat IOR"].default_value = 1.52
```

## Testes realizados

| Prova | Arquivo | Configuração | Resultado |
|---|---|---|---|
| Grade de 12 materiais | `/home/claude/provas/materiais_grade.png` | Cycles CPU, 640x480, 48 amostras, denoise; HDRI `studio.exr` CC0 a 0,25; área principal 28 W 0,6 m a 5200 K, contorno 40 W 0,4 m a 6500 K, preenchimento 5 W 1 m; câmera 85 mm; esferas de 6 cm e cilindros de 54 x 70 mm com chanfro 1,5 mm | média 0,44, estourado 0,24%, afundado 1,6% |
| Antes/depois | `imperfeicao_antes.png`, `imperfeicao_depois.png` | Cycles CPU, 640x480, 48 amostras | ver seção de imperfeição |
| Estilizados | `estilizados_eevee.png`, `estilizados_cycles.png` | 640x240, 32 amostras | toon só no EEVEE; thin film só no Cycles |
| Cor da marca | saída de texto de `teste_cor_marca.py` e `compensar_agx.py` | Cycles, 8x8 px | tabelas acima |

Ajustes feitos depois de olhar as provas:

1. Primeira grade: chão claro (#3A3D42) e luzes fortes deixaram a imagem lavada. Corrigido: chão #24262A, principal 60 W para 28 W, preenchimento 12 W para 5 W, HDRI 0,35 para 0,25.
2. Pele de fruta salmão: corrigida (ver receita).
3. Toon sem sombra com limiar 0,12: limiar virou parâmetro, padrão 0,5.
4. Holográfico com base metálica sem cor visível; bolha com IOR 1,33 sem cor: receitas trocadas (base dielétrica escura + filme 1,9; bolha com IOR 1,0).
5. Busca de soquete `Subsurface IOR` falhando: `ajustar()` passou a buscar por laço.

Leitura da grade (fundo para frente): tecido roxo com borda aveludada clara; cerâmica branca com reflexo nítido do coat; pele de fruta vermelha com leve translucidez; pintura vermelha com brilho granulado dos flocos; metal escovado com riscas circulares no topo; anodizado azul acetinado; vidro verde com borda densa; perfume rosado; plástico vermelho brilhante (já mostrando a dessaturação do AgX para salmão no lado iluminado); plástico azul fosco; cromo com reflexo nítido das luzes; ouro.

## Checklist de material antes de renderizar o filme

1. Objeto em escala real e escala aplicada (`obj.scale == (1,1,1)`).
2. Todo objeto com aresta tem modificador Bevel na largura da tabela, shade smooth e harden normals.
3. Nenhuma Roughness é um número fixo no objeto herói (camada de imperfeição com amplitude 0,05 a 0,15).
4. Metal com cor e borda da tabela `METAIS`, e há o que refletir (HDRI, cartão, faixa de luz).
5. Vidro e líquido coloridos por Volume Absorption, Base Color branca, fundo claro atrás, bandeiras pretas nas laterais, `transmission_bounces` 12 ou mais.
6. Tela com emissão 1,0 e coat.
7. Nenhum nome de entrada do 3.x (rodar o script com `ajustar()` acusa).
8. Motor: se EEVEE, nada de Bevel shader, Pointiness, Thin Film ou anisotropia como efeito principal.
9. Cor da marca aprovada no render, não no hex; logo final composto em 2D quando possível.
10. Rodar `qa.py`: contraste 0,20 a 0,38, estourado abaixo de 1,5%.

## Fontes

1. [Blender 5.2 Manual, Principled BSDF](https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/principled.html) (texto lido no fonte do manual: [principled.rst, branch 5.2](https://projects.blender.org/blender/blender-manual/raw/branch/blender-v5.2-release/manual/render/shader_nodes/shader/principled.rst))
2. [Blender 5.2 Manual, EEVEE Supported Nodes](https://docs.blender.org/manual/en/latest/render/eevee/limitations/nodes_support.html) ([fonte rst 5.2](https://projects.blender.org/blender/blender-manual/raw/branch/blender-v5.2-release/manual/render/eevee/limitations/nodes_support.rst))
3. [Blender 5.2 Manual, Bevel Node](https://projects.blender.org/blender/blender-manual/raw/branch/blender-v5.2-release/manual/render/shader_nodes/input/bevel.rst)
4. [Blender 5.2 Manual, Ambient Occlusion Node](https://projects.blender.org/blender/blender-manual/raw/branch/blender-v5.2-release/manual/render/shader_nodes/input/ao.rst)
5. [Blender 5.2 Manual, Bevel Modifier](https://projects.blender.org/blender/blender-manual/raw/branch/blender-v5.2-release/manual/modeling/modifiers/generate/bevel.rst)
6. [Blender 5.2 Manual, Volume Absorption](https://projects.blender.org/blender/blender-manual/raw/branch/blender-v5.2-release/manual/render/shader_nodes/shader/volume_absorption.rst)
7. [Blender 4.0 Release Notes, Shading (Principled v2)](https://developer.blender.org/docs/release_notes/4.0/shading/)
8. [Blender 4.2 Release Notes, Cycles (Thin Film)](https://developer.blender.org/docs/release_notes/4.2/cycles/)
9. [Blender 4.2 Release Notes, Rendering (Khronos PBR Neutral)](https://developer.blender.org/docs/release_notes/4.2/rendering/)
10. [Blender 4.2 Release Notes, EEVEE](https://developer.blender.org/docs/release_notes/4.2/eevee/)
11. [Blender 4.3 Release Notes, Cycles (Diffuse Roughness)](https://developer.blender.org/docs/release_notes/4.3/cycles/)
12. [PR #123616, Diffuse Roughness no Principled](https://projects.blender.org/blender/blender/pulls/123616)
13. [Blender 5.0 Release Notes, Rendering](https://developer.blender.org/docs/release_notes/5.0/rendering/)
14. [Blender 5.2 LTS, página de lançamento (Thin Wall)](https://www.blender.org/download/releases/5-2/)
15. [PR #157469, Thin wall mode no Principled BSDF](https://projects.blender.org/blender/blender/pulls/157469)
16. [CG Channel, Blender 5.2 LTS key features](https://www.cgchannel.com/2026/07/blender-5-2-lts-is-here-discover-its-5-key-features/)
17. [Physically Based, banco de valores](https://physicallybased.info/) e [API de materiais](https://api.physicallybased.info/materials)
18. [Poly Haven, License](https://polyhaven.com/license) (CC0)
19. [ambientCG, License](https://docs.ambientcg.com/license/) (CC0 1.0)
20. [Poly Haven API, info de asset (dimensions)](https://api.polyhaven.com/info/wood_table_001)
21. [Khronos, PBR Neutral Tone Mapper (anúncio)](https://www.khronos.org/news/press/khronos-pbr-neutral-tone-mapper-released-for-true-to-life-color-rendering-of-3d-products)
22. [KhronosGroup/ToneMapping, PBR Neutral (especificação e GLSL)](https://github.com/KhronosGroup/ToneMapping/blob/main/PBR_Neutral/README.md)
23. [PR #118936, Khronos PBR Neutral no Blender](https://projects.blender.org/blender/blender/pulls/118936)
24. [glTF KHR_materials_volume (Beer-Lambert, atenuação)](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_volume/README.md)
25. [Inigo Quilez, Texture Repetition](https://iquilezles.org/articles/texturerepetition/)
26. [NVIDIA GPU Gems, cap. 20, Texture Bombing](https://developer.nvidia.com/gpugems/gpugems/part-iii-materials/chapter-20-texture-bombing)
27. [Neil Blevins, Brushed Metal Material](http://www.neilblevins.com/art_lessons/material_brushed_metal/material_brushed_metal.htm) (não abriu na sessão; citado pelo título e resumo de busca)
28. [BlenderNation, Diffuse Roughness e Physical Conductor no 4.3](https://www.blendernation.com/2024/10/04/blender-4-3-deep-dive-exploring-diffuse-roughness-physical-conductor/)
29. [BlenderNation, Realistic Car Paint](https://www.blendernation.com/2016/01/22/tutorial-realistic-car-paint-brdf-material/)
30. [CGian, Blender Metallic Car Paint](https://cgian.com/blender-metallic-car-paint-material/)
31. [Jay Argonaut, AgX e Khronos PBR Neutral no 4.2](https://jayargonaut.com/2024/08/11/achieving-realistic-rendering-with-agx-and-khronos-pbr-neutral-in-blender-4-2/) (não aberto; listado como leitura complementar)
32. [Issue #123514, artefatos do Khronos PBR com cores muito claras](https://projects.blender.org/blender/blender/issues/123514) (não aberto; alerta a testar)
33. HDRIs `studiolights/world/*.exr` do Blender 5.2: CC0, Greg Zaal / Poly Haven (arquivo `license.txt` local)
34. Sondas próprias no bpy 5.2.2 (`/home/claude/codigo/materiais/*.py`)

## Pendências para o Claude Code

**Testar no Blender (RTX 3050, 5.2):**

1. Thin Wall no EEVEE: como zerar a Thickness por script (saída Thickness do Material Output) e confirmar `thickness_mode = "SLAB"` no vidro de tampa de celular.
2. Holográfico no EEVEE: alternativa Layer Weight + rampa arco-íris na emissão; comparar com Cycles.
3. Desgaste de borda no EEVEE por Geometry Nodes (Edge Angle > Store Named Attribute > Attribute no shader).
4. Nó AO no EEVEE 5.2: qualidade com `Inside` ligado para desgaste de borda.
5. Coeficiente do Volume Absorption: confirmar se é densidade x (1 - cor) e comparar com o nó Volume Coefficients usando σ = -ln(c)/d.
6. Líquido em copo: sobreposição de 0,1 a 0,2 mm contra interface com IOR relativo.
7. Texture bombing por Voronoi: medir costura nas bordas das células e custo no EEVEE.
8. Toon com outline (Solidify invertido) e Line Art no EEVEE 5.2.
9. Duas cenas (AgX para produto, Standard para logo) compostas: confirmar se o compositor do 5.2 mistura cenas com gestão de cor diferente.
10. Khronos PBR Neutral num rig de estúdio completo: medir estourado no `qa.py` contra AgX.
11. Gelo com malha interna de bolhas (Volume Scatter 20 a 50/m).
12. Textura CC0 de digitais: escolher o asset exato na ambientCG/Poly Haven e registrar nome e licença.

**PENDÊNCIAS YOUTUBE:**

- "Blender 4.2! New tone mapping, the Khronos PBR Neutral Tone Mapper" ([youtube.com/watch?v=iQ3m0CfuSmg](https://www.youtube.com/watch?v=iQ3m0CfuSmg)): esperava comparação visual AgX x Khronos em produto. Não aberto.
- "Blender Car Paint Material with Metallic Glitter Texture using Principled BSDF node" ([youtube.com/watch?v=vzLzkEGRiZI](https://www.youtube.com/watch?v=vzLzkEGRiZI)): esperava escala de flocos e uso do Coat Normal. Não aberto.
