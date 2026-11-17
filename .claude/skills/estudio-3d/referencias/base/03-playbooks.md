# 03 · Playbooks por Categoria

Este capítulo é a caixa de ferramentas do diretor. Cada categoria de cliente tem um jeito próprio de vender pela imagem: um app vende pela clareza da tela, um perfume vende pela luz dentro do vidro, uma clínica vende pela confiança. Aqui estão os planos que cada categoria usa há décadas, as receitas pra fazer esses planos no Blender 5.2 com script, as armadilhas que denunciam o "3D de IA" e estruturas de 15 s e 30 s prontas pra preencher.

Os 10 playbooks são independentes (cada `##` vira uma subpágina). Receitas que servem a várias categorias (giro em plataforma, vista explodida, macro, packshot com CTA) estão na seção **0. Receitas comuns**, e cada playbook só traz os valores específicos dele.

## Como ler os playbooks

### Convenções

| Item | Convenção | Por quê |
|---|---|---|
| Taxa de quadros | 30 fps. 1 s = 30 quadros (q). 15 s = 450 q. 30 s = 900 q. | Padrão de Reels, TikTok e YouTube Shorts. A máquina de referência renderiza mais rápido do que em 60 fps. |
| Lente | Distância focal em mm com o sensor padrão do Blender (36 mm, equivalente a full frame). | Assim "85 mm" significa o mesmo que numa câmera real e as referências de fotografia de produto valem direto. |
| Escala | Cena em metros, objeto em tamanho real (celular 71,5 x 147 x 7,8 mm). | Profundidade de campo, chanfro, simulação de tecido e de líquido dependem da escala real. Fora dela, o desfoque e a física mentem. |
| Cor | AgX, look `AgX - Medium High Contrast` como ponto de partida. | Standard lava a cor (problema nº 1 do contexto). |
| Movimento | Alça assimétrica (saída 10%, chegada 70%) por padrão, `BACK` 3 a 8% em pouso, `LINEAR` só em giro contínuo e rolagem mecânica. `AUTO_CLAMPED` simétrico só em push-in de hold (ver 00 · Padrões da casa). | Curva padrão sem intenção é o "movimento de software" (problema nº 7). |
| Texto na tela | Sempre dentro da zona segura do formato (ver packshot). | Interface do Reels e do TikTok cobre o topo e a base. |

### Leitura das tabelas de planos

"O que vende" é a pergunta que o plano responde na cabeça de quem assiste. Se você não consegue preencher essa coluna, o plano não entra no filme. Esse é o antídoto contra o enfeite sem motivo (problema nº 3): nenhum objeto, nenhum plano e nenhum movimento entra sem uma frase de venda por trás.

### Leitura das estruturas de 15 s e 30 s

As colunas são: segundos, quadros (30 fps), lente, movimento de câmera, ação do objeto, transição de saída, som e texto na tela. A soma fecha exatamente em 450 q ou 900 q. O som é parte do roteiro: o corte cai na batida ou no impacto, e o impacto (o "tum") é marcado no quadro exato.

## 0. Receitas comuns a várias categorias

### 0.1 Giro em plataforma (turntable)

**O que é:** o produto gira no próprio eixo enquanto a câmera fica parada ou quase parada. Serve pra mostrar forma, material e volume.

**Velocidade.** A fonte de e-commerce da Ortery fala em 16 a 24 imagens por volta em visualizadores 360 e alerta que rotação rápida demais deixa o espectador tonto ([Ortery](https://www.ortery.com/4-variables-to-optimize-360-product-animations-for-ecommerce/)). Em filme publicitário, o giro completo é raro. A regra prática do estúdio:

| Tom do filme | Velocidade | Volta completa | Uso |
|---|---|---|---|
| Luxo, perfume, joia | 10 a 15 °/s | 24 a 36 s (nunca mostre inteira) | Giro de 30° a 60° num plano de 3 a 4 s |
| Premium, eletrônico | 18 a 30 °/s | 12 a 20 s | Giro de 60° a 90° num plano de 3 s |
| Pop, bebida, comida rápida | 45 a 90 °/s | 4 a 8 s | Giro com chicote (whip) entre planos |
| E-commerce (vitrine 360) | 30 a 45 °/s | 8 a 12 s | Volta completa em loop, câmera parada |

**Receita (Blender 5.2):**
1. Origem do produto no centro da base (o produto gira em torno do próprio eixo, não do centro da caixa).
2. Coloque o produto num objeto vazio (Empty) e anime só o Z do vazio. Isso deixa a rotação separada de qualquer ajuste de pose.
3. Chave no início e no fim, Bezier com alças de 10 a 14 quadros de comprimento: o miolo fica praticamente linear e a entrada e a saída não dão tranco.
4. Ligue o borrão de movimento (`scene.render.use_motion_blur = True`, obturador 0,5 é o padrão confirmado por sonda). Sem ele, o giro rápido "pisca".
5. Luz parada. Quem dá vida ao giro é o reflexo que corre pela superfície. Se a luz girar junto, o produto parece parado.

**Sinal de que deu errado:** o reflexo não muda durante o giro (luz presa ao produto ou material sem reflexo); tranco no quadro 1 (chave linear); produto "balança" (origem fora do eixo).

Código: `codigo/playbooks/giro_plataforma.py` **[confirmado por sonda no bpy 5.2.2]**. Com 24 °/s e 150 quadros ele gira 119,2°, e a amostra do quadro 13 mostra 7° (rampa suave) contra 9,4° de uma curva linear.

```python
# trecho de giro_plataforma.py (Blender 5.2)
total = graus_por_seg * (fim - inicio) / fps
ob.rotation_euler.z = 0; ob.keyframe_insert("rotation_euler", index=2, frame=inicio)
ob.rotation_euler.z = math.radians(total); ob.keyframe_insert("rotation_euler", index=2, frame=fim)
for fc in fcurves(ob):            # fcurves() lê o channelbag (action.fcurves não existe no 5.x)
    k0, k1 = fc.keyframe_points
    k0.handle_right_type = k1.handle_left_type = 'FREE'
    k0.handle_right = (k0.co.x + 12, k0.co.y)   # 12 quadros de rampa
    k1.handle_left  = (k1.co.x - 12, k1.co.y)
```

### 0.2 Vista explodida (exploded view)

**O que é:** o produto se separa em peças ao longo de eixos, mostrando o que tem dentro, e depois remonta. Vende engenharia, cuidado, "tem muita coisa aqui dentro".

**Ordem.** De fora pra dentro: primeiro sai a casca que o cliente conhece (tampa, vidro, carcaça), depois as camadas internas, por último o "coração" (bateria, chip, motor, fórmula). A remontagem é na ordem inversa: a última peça que saiu é a primeira que volta. O blog da KeyShot recomenda organizar a cena por peças nomeadas e agrupadas antes de animar, copiar animação entre peças pra manter consistência e testar em baixa resolução antes do render final ([KeyShot](https://www.keyshot.com/blog/creating-an-exploded-view-animation-with-keyshot/)).

**Timing (30 fps):**

| Parâmetro | Valor | Por quê |
|---|---|---|
| Duração de cada peça | 15 a 20 q | Menos que 12 q parece explosão, não engenharia. Mais que 24 q arrasta. |
| Atraso entre peças (cascata) | 3 a 4 q | Cria ritmo de leitura. Atraso 0 vira "tudo se espalhou". |
| Distância | 0,3 a 0,6 x a maior dimensão da peça | Longe o bastante pra ver o vão, perto o bastante pra entender que é um conjunto. |
| Segurar explodido | 30 a 45 q | Tempo pro olho ler. É aqui que entram textos de destaque. |
| Câmera | Desliza 5% a 10% pra trás durante a explosão | O conjunto cresce; sem recuo, as peças saem do quadro. |
| Direções | Eixo principal do produto (Z num fone de ouvido, Y num celular deitado). Peças laterais em diagonal de 30° a 45°. | Peças saindo em direções aleatórias parecem acidente. |

**Sinal de que deu errado:** peças se atravessando (direção errada ou atraso pequeno); "nuvem" de peças sem eixo; peça interna sem material (cinza padrão); parafusos e cabos ausentes, o que denuncia modelo de vitrine.

Código: `codigo/playbooks/vista_explodida.py` **[confirmado por sonda no bpy 5.2.2]**.

```python
# trecho de vista_explodida.py (Blender 5.2)
def explodir(pecas, inicio=30, dur=18, atraso=3, segurar=36, voltar=True):
    for i, (ob, dirv, dist) in enumerate(pecas):        # ordem: casca externa primeiro
        base = ob.location.copy(); a = inicio + i * atraso
        ob.keyframe_insert("location", frame=a)
        ob.location = base + Vector(dirv).normalized() * dist
        ob.keyframe_insert("location", frame=a + dur)
        if voltar:                                         # remonta na ordem inversa
            b = inicio + (len(pecas)-1)*atraso + dur + segurar + (len(pecas)-1-i)*atraso
            ob.keyframe_insert("location", frame=b); ob.location = base
            ob.keyframe_insert("location", frame=b + dur)
        interpolar(ob)   # Bezier AUTO_CLAMPED
```

### 0.3 Plano macro dos detalhes

**O que é:** a câmera chega a centímetros do produto. Mostra textura, acabamento, precisão. É o plano que separa produtora de teste genérico, porque o macro denuncia na hora se o material é "plástico de CG" (problema nº 6).

**Receita:**
1. Lente 90 a 135 mm. A 100 mm, a câmera fica a 15 a 30 cm do detalhe.
2. Profundidade de campo ligada, f/8 a f/16 em macro de produto em escala real (a f/2,8 um detalhe de 3 cm tem 0,3 mm nítidos) (ver 00 · Padrões da casa). Se nada fica nítido, a escala está errada (objeto gigante) ou o f-stop baixo demais.
3. Foco num objeto vazio colado no detalhe (`cam.data.dof.focus_object`), não por distância. O foco acompanha se o objeto mexer.
4. Movimento: deslize lateral (truck) de 1 a 3 cm em 60 a 90 q, ou empurrão (push-in) de 5% a 8%. Nunca parado: no macro, qualquer imobilidade parece foto.
5. Puxada de foco (rack focus) de 12 a 18 q entre dois detalhes: anime a posição do vazio de foco.
6. O detalhe precisa existir no modelo: chanfro de 0,2 a 0,5 mm nas arestas, mapa de normal ou deslocamento (textura de couro, escovado do metal, granulado do plástico), variação de aspereza de 0,05 a 0,15 por cima do valor base.
7. Uma luz de faixa (strip) rasante a 10° a 20° da superfície revela textura. Luz frontal apaga textura.

**Sinal de que deu errado:** aresta viva sem brilho na quina (falta chanfro); superfície lisa demais (aspereza uniforme); desfoque "de lente de celular" em tudo (f-stop baixo com objeto fora de escala); textura com pixels visíveis (resolução insuficiente pro macro).

### 0.4 Packshot final com composição de CTA

**O que é:** o último plano. Produto parado (ou quase), logo, frase e chamada pra ação (CTA). É o quadro que vira miniatura e que fica na memória.

**Receita:**
1. Duração: 60 a 90 q (2 a 3 s) no 15 s; 90 a 150 q (3 a 5 s) no 30 s. Menos de 45 q não dá tempo de ler a CTA.
2. Câmera em empurrão de 2% a 3% durante o packshot inteiro. Quadro congelado parece travamento.
3. Produto entre 40% e 55% da altura do quadro no 9:16 (ver 00 · Padrões da casa), apoiado no terço inferior. Em 16:9, no terço esquerdo ou direito, com a CTA no lado oposto.
4. Hierarquia: produto primeiro (mais contraste e mais nitidez), logo segundo, CTA terceiro. A CTA tem um verbo e um destino: "Baixe na App Store", "Agende pelo WhatsApp", "Peça no app". Nada de "Saiba mais" solto.
5. Zona segura no 9:16: máscara universal do estúdio em 1080 x 1920: livre 380 px no topo, 672 px na base, 120 px à esquerda, 140 px à direita, e 300 px à direita abaixo de y 960 (gabarito TikTok). Área útil: x 120 a 940 (x 120 a 780 abaixo de y 960), y 380 a 1248. Centro óptico da área útil: y ≈ 814 (ver 00 · Padrões da casa). **[não verificado em fonte oficial do TikTok e do YouTube; revisar a cada trimestre]**.
6. Fundo simplificado: o packshot pede o fundo mais limpo do filme. Tire objetos de cena, baixe o fundo em 1/2 a 1 stop.
7. Entrada do texto: 8 a 12 q depois que o produto assenta. Texto e produto chegando juntos competem.
8. Som: um acorde final ou o logo sonoro termina no quadro em que a CTA completa a entrada.

**Sinal de que deu errado:** CTA embaixo dos botões do Reels; produto e texto do mesmo tamanho; packshot com mais objetos que o primeiro plano; corte final antes de 2 s.

## 1. App mobile

**O que vende:** clareza, rapidez, "é fácil de usar", a promessa resolvida na palma da mão. O herói não é o celular. O herói é a tela, e o celular é a moldura premium que dá credibilidade.

### Os planos clássicos

| Plano | Lente | Movimento | Duração (q) | O que vende |
|---|---|---|---|---|
| Abertura no escuro: contorno do aparelho acende | 85 mm | Empurrão lento 4% | 45 a 60 | Expectativa, objeto premium |
| Tela de frente, 3/4 inclinada 20° a 30° | 50 a 70 mm | Órbita de 15° | 60 a 75 | "É isso aqui", leitura da interface |
| Camadas explodidas (interface sai da tela em cartões) | 70 a 85 mm | Órbita de 25° + recuo 8% | 60 a 90 | Profundidade, organização, "tem muita coisa bem feita" |
| Rolagem de tela (scroll) dentro do aparelho | 50 mm | Parado ou deslize vertical 2 cm | 45 a 75 | Conteúdo, variedade, fluidez |
| Toque: botão principal pressionado | 100 mm | Empurrão 6% até o botão | 30 a 45 | Ação simples, "um toque e pronto" |
| Recurso-chave isolado (cartão destacado sobe da tela) | 85 mm | Push-in no cartão | 45 a 60 | O diferencial do app |
| Notificação chegando (cartão cai de cima) | 50 mm | Leve tremor de 2 q no impacto | 30 a 40 | Resultado, retorno, "funciona" |
| Dois ou três aparelhos em escada (telas diferentes) | 35 a 50 mm | Deslize lateral (truck) | 60 a 90 | Amplitude de funções |
| Tela vira mundo: câmera entra na tela e a interface vira cenário | 35 mm | Empurrão forte 40% com chicote | 20 a 30 | Imersão, transição de impacto |
| Macro do ícone na tela inicial | 100 mm | Rack focus | 30 a 45 | Marca, ícone memorável |
| Packshot com ícone, nome e selos de loja | 70 mm | Empurrão 2% | 60 a 90 | Ação: baixar |

### Técnicas específicas com receita

#### Tela com vidro, reflexo e camadas explodidas em profundidade

Este é o plano que mais denuncia o "app como placa plana" (problema nº 5). A receita abaixo foi construída e renderizada em Cycles CPU no bpy 5.2.2 **[confirmado por sonda no bpy 5.2.2]**. A prova está em `/home/claude/provas/ui_explodida.png`.

**Pilha de objetos (de baixo pra cima), em escala real:**

| Camada | Geometria | Medida | Material |
|---|---|---|---|
| Corpo | Caixa 71,5 x 147 x 7,8 mm, cantos com bevel por peso nas 4 arestas verticais | Raio do canto 9 mm **[não verificado: meça o aparelho que o cliente quer]**; quebra de 0,3 mm nas bordas | Metal: `Metallic` 1, `Roughness` 0,25 a 0,32, cor quase preta ou a cor do aparelho |
| Tela (UI) | Plano 65 x 140,5 mm, bevel só nos vértices (`affect='VERTICES'`) | Raio 7,5 mm, 0,05 mm acima do topo do corpo | Imagem na `Emission Color` com `Emission Strength` 1,0 **e** a mesma imagem na `Base Color` |
| Vidro de cobertura | Caixa com 1,2 mm a menos que o corpo em cada lado | Espessura 0,7 mm | `Transmission Weight` 1, `IOR` 1,5, `Roughness` 0,02 |
| Cartões explodidos | Caixas finas com cantos arredondados | Espessura 0,6 mm; separação 8 a 15 mm entre camadas | Recorte da UI (emissão 0,6 + base) ou vidro fosco (`Transmission` 1, `Roughness` 0,3, `IOR` 1,45) |

**Por que a imagem também vai na Base Color:** uma superfície só de emissão não recebe sombra. Se a tela for só emissão, os cartões flutuam sobre a interface sem sombra nenhuma e a profundidade desaparece. Com a imagem também no difuso (aspereza 0,35), os cartões projetam sombra na tela e o olho entende a distância. No teste, a sombra do cartão laranja na tela é o que dá a leitura de altura.

**Distância entre camadas.** Num aparelho de 147 mm, 8 a 15 mm por camada (5% a 10% da altura) lê bem num 3/4 de 25° a 40°. Menos de 5 mm não aparece; mais de 20 mm separa tanto que o cartão parece outro objeto. No script: `SEPARACAO = 11.0`, cada cartão sobe `SEPARACAO x (i+1)`.

**Cantos arredondados que batem com o Figma.** Converta o raio do Figma (em pt) pra mm pela largura da tela:

`raio_mm = raio_pt x (largura_tela_mm / largura_tela_pt)`

Exemplo: tela de 65 mm com 393 pt de largura dá 0,165 mm por pt. Um cartão de raio 16 pt vira 2,6 mm. Raio errado é um sinal sutil, mas o designer do cliente vê na hora.

**Timing da explosão.** 24 q por cartão, cascata de 4 q, Bezier `AUTO_CLAMPED` (no script: `EXPLODE_QUADROS = (30, 54)`). Segure explodido 30 a 45 q antes de qualquer outra coisa.

**Luz (achado do teste).** No primeiro render, a principal estava no lado da câmera e o reflexo dela no vidro cobriu a tela inteira: a interface ficou cinza leitosa e o laranja virou rosa claro. A cura foi a lei da reflexão: a principal foi pra lateral, rasante (posição 0,5 / 0,15 / 0,12 m com o aparelho na origem), fora do ângulo em que o vidro a devolve pra câmera. O contorno ficou atrás a 7000 K e o preenchimento caiu pra 4 W. Resultado: tela escura e saturada, cartões com cor cheia e borda de luz.

**Sinal de que deu errado:** tela cinza ou "leitosa" (reflexo da principal ou do mundo claro no vidro: mude a luz de lugar ou ponha uma bandeira preta na direção refletida); cartões sem sombra na tela (tela só emissão); cores da UI desbotadas (emissão acima de 1,0 no AgX); cartões sem espessura (plano de 0 mm, sem borda que pega luz).

Código completo: `codigo/playbooks/tela_camadas_explodidas.py`. Render de prova: 360 x 640, 48 amostras, denoise, 1 min 57 s em CPU de 2 núcleos na nuvem. Na RTX 3050 com OptiX deve cair pra poucos segundos **[testar no Blender]**.

```python
# trecho de tela_camadas_explodidas.py (Blender 5.2)
def mat_tela(img, forca=1.0, difuso=True):
    m = bpy.data.materials.new("Tela_UI"); nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    tex = nt.nodes.new("ShaderNodeTexImage"); tex.image = img
    tex.interpolation = 'Cubic'; tex.extension = 'EXTEND'
    nt.links.new(tex.outputs["Color"], p.inputs["Emission Color"])
    p.inputs["Emission Strength"].default_value = forca          # 1,0 no AgX
    if difuso:                                                    # pra RECEBER sombra das camadas
        nt.links.new(tex.outputs["Color"], p.inputs["Base Color"])
        p.inputs["Roughness"].default_value = 0.35
    return m, tex

def mat_vidro():
    m = bpy.data.materials.new("Vidro_Cobertura")
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Transmission Weight"].default_value = 1.0
    p.inputs["Roughness"].default_value = 0.02
    p.inputs["IOR"].default_value = 1.5
    return m
```

**Referência de linguagem:** a Apple descreve o Liquid Glass (2025) como material translúcido que "reflete e refrata o que está em volta" e reage ao movimento com brilhos especulares ([Apple Newsroom](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/)). O cartão de vidro fosco da receita é a tradução 3D disso: transmissão total, aspereza 0,25 a 0,35, e um brilho que corre pela borda quando a câmera orbita.

#### Rolagem de tela por deslocamento de UV

Exporte a página inteira do Figma como um PNG alto (o frame com toda a rolagem), não vários prints. No material, um nó Mapping escala o Y pra mostrar só a "janela" da tela e anima o Location Y.

1. `janela = altura_tela_px / altura_pagina_px` (ex.: 2532 / 7500 = 0,338).
2. Scale do Mapping = (1, janela, 1).
3. Location Y no topo da página = `1 - janela`. Pra rolar `N` px do Figma: `Location Y = (1 - janela) - N / altura_pagina_px`.
4. `extension = 'CLIP'` pra não repetir a imagem quando passar do fim.
5. Chaves com Bezier `AUTO_CLAMPED`: rolagem de app real acelera e desacelera. Ritmo: role 1 a 1,5 telas em 18 a 24 q, segure 12 a 18 q pra ler, role de novo.

Código: `codigo/playbooks/rolagem_tela.py` **[confirmado por sonda no bpy 5.2.2]** (as chaves ficam no `node_tree.animation_data` do material e são lidas pelo channelbag).

```python
mp = nt.nodes.new("ShaderNodeMapping")
janela = altura_tela_px / altura_pagina_px
mp.inputs["Scale"].default_value = (1, janela, 1)
sock = mp.inputs["Location"]
for q, px in [(1, 0), (30, 0), (54, 1800), (66, 1800), (84, 3600)]:
    sock.default_value[1] = (1 - janela) - px / altura_pagina_px
    sock.keyframe_insert("default_value", index=1, frame=q)
```

**Alternativa por geometria:** quando a rolagem precisa de parallax (cabeçalho fixo, cartões que sobem em velocidades diferentes), corte a página em cartões separados e anime cada um em Y com velocidades de 1,0x (conteúdo), 0,6x (fundo) e 0x (cabeçalho fixo). Mais trabalho, mais profundidade.

### Como transformar print de tela e Figma em material 3D convincente

**1. Exportar do Figma.**

| O quê | Formato | Escala | Por quê |
|---|---|---|---|
| Tela inteira (frame do celular) | PNG | 3x (padrão iOS @3x) | Em 393 pt de largura dá 1179 px, perto da resolução real de um iPhone Pro. |
| Página com rolagem | PNG | 3x | Um único arquivo alto pra animar por UV. |
| Cartões que vão explodir | PNG com fundo transparente, um por cartão | 3x ou 4x | Cada cartão vira um objeto. Fundo transparente evita "caixa" em volta. |
| Ícone, logo, ilustração vetorial | SVG com texto convertido em contorno | Vetor | Vira geometria 3D (extrusão, chanfro). |
| Tela pra plano macro (câmera colada na tela) | PNG | 4x a 6x, ou só o recorte ampliado | 3x não aguenta zoom de 3 vezes. |

**2. Resolução necessária (px por mm de tela).** O iPhone 16 Pro tem 2622 x 1206 px a 460 ppi ([Apple Support](https://support.apple.com/en-us/121031)), ou seja, 460 / 25,4 = **18,1 px por mm**. Isso é o teto físico. O que importa no render é quantos pixels a tela ocupa no quadro final:

`px_textura_necessários ≥ px_que_a_tela_ocupa_no_render x 1,2`

Exemplo: no 9:16 em 1080 x 1920, um celular de frente ocupando 70% da altura mostra a tela com ~1340 px de altura. Precisa de pelo menos ~1600 px de textura na altura da tela. O PNG 3x (2556 px) sobra. Num macro em que a tela ocupa 3 vezes a altura do quadro (5760 px), o 3x não basta: exporte só o recorte do detalhe em 6x.

**3. Plano com emissão 1,0 no AgX.** Importe por `File > Import > Images as Planes`, que virou recurso nativo no Blender 4.2 ([manual 4.2](https://docs.blender.org/manual/en/4.2/modeling/meshes/import_images_as_planes.html)). No 5.2.2 o operador é `bpy.ops.image.import_as_mesh_planes`, com `shader` em `PRINCIPLED`, `SHADELESS` ou `EMISSION`, `emit_strength` padrão 1,0, `interpolation` em `Linear`, `Closest`, `Cubic` ou `Smart` e `size_mode` em `ABSOLUTE`, `CAMERA`, `DPI` ou `DPBU` **[confirmado por sonda no bpy 5.2.2]**. Pra tela de celular, prefira montar o material na mão (receita acima: emissão 1,0 + base difusa), porque o shader `EMISSION` puro não recebe sombra. No AgX, a tela desbota acima de ~1,3 de brilho (laboratório do Claude Code); fique em 1,0.

**4. Vidro por cima.** Caixa de 0,7 mm, transmissão 1, IOR 1,5, aspereza 0,02. Deixe 0,05 a 0,1 mm de ar entre a tela e o vidro. Se encostar, o Cycles pode gerar manchas de interseção. Em EEVEE, ligue a refração por raytracing no material e na cena **[testar no Blender: nome exato das opções de raytracing do EEVEE no 5.2]**.

**5. Separar camadas em cartões.** No Figma, cada elemento que vai explodir é exportado sozinho (PNG com transparência). No Blender, cada um vira uma caixa fina (0,6 mm) com o recorte como textura e alpha ligado no material. Alternativa sem reexportar: um nó Mapping recortando a região do PNG da tela inteira (função `mat_cartao_solido` no script, coordenadas UV de 0 a 1 do recorte).

**6. SVG no Blender 5.x.** Duas portas de entrada, as duas confirmadas no 5.2.2:
- `File > Import > SVG as Curves (.svg)` → `bpy.ops.import_curve.svg(filepath=...)`. Importa só geometria de path; preenchimento, contorno (stroke), texto, imagem e filtro são ignorados; as curvas chegam no plano XY na escala das unidades do documento ([manual 5.x, SVG](https://docs.blender.org/manual/en/dev/files/import_export/svg_curve.html)). Então, no Figma: converta texto em contorno (Outline text / Flatten) e traço em forma (Outline stroke) antes de exportar.
- `File > Import > SVG as Grease Pencil` → `bpy.ops.wm.grease_pencil_import_svg(filepath=..., resolution=10, scale=10.0)` **[confirmado por sonda no bpy 5.2.2]**. Serve pra desenho em linha que vai ser animado como traço (assinatura escrita à mão, ilustração de linha). Há relato de partes faltando na importação ([issue #133275](https://projects.blender.org/blender/blender/issues/133275)): confira o resultado.

Pra transformar o SVG em objeto 3D com chanfro, use o script de logo (`codigo/playbooks/logo_svg.py`, seção 10) ou o caminho de Geometry Nodes (Curve to Mesh, Fill Curve, Extrude Mesh) descrito pela [Blendergrid](https://blendergrid.com/articles/svg-in-geometry-nodes).

**7. Tipografia nítida.** O texto da interface é o que mais perde qualidade.

| Situação | Interpolação | Por quê |
|---|---|---|
| Textura com mais pixels que a área renderizada (caso normal, 3x) | `Cubic` ou `Linear` | `Closest` com redução gera serrilhado e "chuvisco" no texto em movimento. |
| Textura ampliada no render (macro, poucos pixels por pixel de tela) | `Cubic` | Suaviza a ampliação sem quadradinhos. |
| Pixel art, ou textura exatamente 1:1 com o render e câmera parada | `Closest` | Só aqui `Closest` dá nitidez sem defeito. |

Outros cuidados:
- O filtro de pixel do Cycles é Blackman-Harris de 1,5 px por padrão (`scene.cycles.filter_width = 1.5`) e o do EEVEE também é 1,5 (`scene.render.filter_size`) **[confirmado por sonda no bpy 5.2.2]**. Baixar pra 1,0 deixa o texto mais seco, ao custo de mais serrilhado em arestas **[testar no Blender]**.
- Texto com menos de 10 px de altura no render final não é lido em celular. Se a fonte da UI fica abaixo disso, aproxime a câmera ou use o plano de cartão explodido pra mostrar aquele trecho maior.
- Desfoque de profundidade de campo na tela só quando for intencional. A tela é o produto: ela fica no plano de foco.
- Renderize uma prova em resolução final de 1 quadro só com a tela ocupando o maior tamanho do filme. É lá que o texto quebra.

### As armadilhas da categoria

| Armadilha | Sinal visual | Cura |
|---|---|---|
| Tela como placa plana | Imagem colada num retângulo, sem vidro, sem borda, sem reflexo | Pilha corpo + tela + vidro 0,7 mm + reflexo de uma faixa de luz correndo |
| Tela lavada | Interface cinza, preto virou grafite | Principal fora do ângulo de reflexão; emissão 1,0; mundo escuro do lado refletido |
| Tela estourada | Branco da UI sem textura, cores fluorescentes | `Emission Strength` 1,0 (não 2 ou 5); AgX com look Medium High Contrast |
| Cartões sem sombra | Camadas flutuam "coladas" na tela | Tela com componente difuso; luz principal com tamanho de 0,3 a 0,6 m pra sombra macia |
| Celular sem escala | Desfoque de profundidade estranho, chanfro grosso | Escala real (71,5 x 147 x 7,8 mm) e câmera em mm reais |
| Texto ilegível | Letras borradas ou com chuvisco | PNG 3x, interpolação Cubic, prova em resolução final |
| Interface inventada | Telas genéricas que não são do app do cliente | Só use o Figma ou os prints reais do cliente. Tela falsa é propaganda enganosa |
| Celular girando à toa | 360° sem motivo no meio do filme | Giro só de 15° a 40°, motivado por revelar um lado ou um recurso |
| Notch, ilha e botões errados | Modelo de aparelho que não existe | Use aparelho genérico sem marca ou modelo licenciado; nunca misture detalhes de marcas |
| Mão de CG | Mão 3D segurando o aparelho com dedos de borracha | Evite mão. Use apoio (pedestal, superfície) ou filmagem real com a tela composta |

### Estrutura pronta de 15 s (450 q)

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 1,5 | 1 a 45 | 85 mm | Empurrão 4% | Aparelho no escuro, contorno acende da direita pra esquerda | Corte seco | Grave subindo | (nenhum) |
| 1,5 a 4,0 | 46 a 120 | 50 mm | Órbita 15° | Tela acende na home do app, 3/4 inclinado 25° | Chicote lateral | Batida 1 no q 46 | Promessa em 4 a 6 palavras |
| 4,0 a 7,0 | 121 a 210 | 85 mm | Órbita 25° + recuo 8% | Camadas explodem (3 cartões, cascata de 4 q) | Corte na batida | Três "tics" na cascata | Nome do recurso principal |
| 7,0 a 9,5 | 211 a 285 | 50 mm | Parado + rolagem | Cartões voltam; rolagem da tela mostra conteúdo | Corte | Batida 2 | Benefício 2 |
| 9,5 a 11,5 | 286 a 345 | 100 mm | Push-in 6% | Toque no botão principal, notificação cai | Flash curto 2 q | Clique + "plim" | Resultado ("Pedido confirmado") |
| 11,5 a 15,0 | 346 a 450 | 50 mm (salto de 2× desde o 100 mm, regra 14 do cap 01) | Empurrão 2% | Packshot: aparelho de frente, ícone e nome, selos de loja | (fim) | Logo sonoro termina no q 420 | CTA: "Baixe grátis" + selos |

### Estrutura pronta de 30 s (900 q)

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 2,0 | 1 a 60 | 85 mm | Empurrão 4% | Problema em uma imagem: cartão de notificação "ainda esperando?" no escuro | Corte | Ambiente + tique | Dor em 4 a 6 palavras |
| 2,0 a 4,0 | 61 a 120 | 85 mm | Push-in 10% | Aparelho surge do escuro, contorno acende | Chicote | Grave + batida 1 | (nenhum) |
| 4,0 a 7,0 | 121 a 210 | 50 mm | Órbita 15° | Tela acende na home | Corte | Batida | Nome do app + promessa |
| 7,0 a 10,5 | 211 a 315 | 85 mm | Órbita 25° + recuo | Camadas explodidas: recurso 1 em destaque | Corte na batida | Cascata de "tics" | Recurso 1 |
| 10,5 a 13,5 | 316 a 405 | 50 mm | Parado | Rolagem por UV, parada em conteúdo-chave | Chicote vertical | Rolagem sonora suave | Recurso 2 |
| 13,5 a 16,5 | 406 a 495 | 35 mm | Empurrão 40% | Câmera entra na tela, interface vira cenário | Entrada na tela | Sopro (whoosh) | (nenhum) |
| 16,5 a 20,0 | 496 a 600 | 35 a 50 mm | Deslize lateral | Dentro da interface: cartões grandes em profundidade | Saída da tela | Batida 3 | Recurso 3 |
| 20,0 a 23,0 | 601 a 690 | 50 mm | Truck | Três aparelhos em escada com telas diferentes | Corte | Batida | "Tudo num lugar só" |
| 23,0 a 25,5 | 691 a 765 | 100 mm | Push-in 6% | Toque + notificação de sucesso | Flash 2 q | Clique + "plim" | Resultado |
| 25,5 a 30,0 | 766 a 900 | 50 mm (salto de 2× desde o 100 mm, regra 14 do cap 01) | Empurrão 2% | Packshot: aparelho, ícone, selos de loja | (fim) | Logo sonoro termina no q 860 | CTA + selos |

### Mundos visuais

- **Recomendados:** estúdio premium (aparelho escuro, contorno frio), vidro e cromo (combina com interface de vidro fosco), neon noturno (apps de entretenimento, delivery noturno, fintech jovem), pop candy (apps de consumo leves), holográfico (cripto, IA, tecnologia), brutalista tech (apps de produtividade com UI densa).
- **Evitar:** argila (a tela vira brinquedo e perde a credibilidade de software), papel e recorte (briga com a emissão da tela), luz natural com persiana forte (o reflexo da persiana atravessa a tela e esconde a UI), tátil têxtil.

### Referências reais

| Referência | Link | O que aprender |
|---|---|---|
| Apple, "Introducing iPhone 17 Pro" (2025) | [YouTube](https://www.youtube.com/watch?v=IhZRSC9w3Mw) | Escuro com contorno, reflexo correndo no metal, telas sempre nítidas e saturadas. Nada gira sem motivo. |
| Apple, apresentação do Liquid Glass (2025) | [Apple Newsroom](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/) | Interface como material físico: refração, reflexo e brilho especular que reage ao movimento. Base pros cartões de vidro fosco. |
| Nothing, "Introducing Phone (3a) Series" | [YouTube](https://www.youtube.com/watch?v=ZizbGaSnIUE) | Identidade visual forte (monocromo, pontilhado) aplicada ao filme inteiro: o mundo visual é a marca. |

## 2. SaaS, site, sistema e dashboard

**O que vende:** controle, clareza dos dados, tempo economizado, "o seu negócio organizado". O herói é a interface em tela grande (16:9 nativo), e a dificuldade é que interface de computador é densa: o filme precisa escolher um pedaço por vez.

### Os planos clássicos

| Plano | Lente | Movimento | Duração (q) | O que vende |
|---|---|---|---|---|
| Janela flutuante em 3/4 sobre fundo escuro | 50 mm | Órbita 10° | 60 a 90 | "Isso é um produto de verdade" |
| Painéis explodidos em profundidade (sidebar, conteúdo, modal) | 70 mm | Recuo 10% + órbita 20° | 60 a 90 | Arquitetura, organização |
| Push-in num componente (gráfico, card de KPI) | 85 mm | Empurrão de 110% a 160% | 30 a 45 | O dado que importa |
| Cursor executando a ação principal | 50 mm | Câmera segue o cursor com atraso de 4 q | 45 a 75 | Facilidade ("é só clicar") |
| Gráfico crescendo (barras, linha desenhando) | 70 mm | Deslize lateral 3% | 30 a 60 | Resultado, crescimento |
| Digitação em campo de IA (efeito máquina de escrever) | 85 mm | Parado ou push-in 3% | 45 a 75 | Inteligência, rapidez |
| Cascata de itens (lista se preenchendo) | 50 mm | Parado | 30 a 45 | Automação, volume de trabalho feito |
| Notebook/monitor em ambiente (mesa, luz natural) | 35 mm | Truck lento | 60 a 90 | Uso real, contexto profissional |
| Multi-tela: celular + notebook com a mesma conta | 50 mm | Órbita 15° | 60 a 75 | Funciona em todo lugar |
| Integrações: ícones de apps conectando por linhas de luz | 50 mm | Recuo 15% | 45 a 60 | Encaixa no que você já usa |
| Packshot: logo + URL | 70 mm | Empurrão 2% | 60 a 90 | Ação: testar grátis |

### Técnicas específicas com receita

#### Janela de navegador e painéis explodidos

1. Exporte do Figma a tela em 2x (desktop: 1440 x 900 pt viram 2880 x 1800 px). Num 16:9 em 1920 x 1080 em que a janela ocupa 80% da largura, a janela tem ~1536 px. 2x sobra; 1x não basta.
2. Monte a janela em escala de monitor: 0,60 x 0,375 m (proporção 16:10), espessura 4 mm, cantos de 10 a 12 mm. Interface com emissão 1,0 + base difusa (mesma regra do app).
3. Recorte os painéis (barra lateral, área central, modal) em cartões de 3 mm de espessura. Separação entre camadas: 25 a 40 mm (4% a 7% da largura). Mesma cascata do app: 24 q por camada, 4 q de atraso.
4. Moldura de vidro opcional na janela inteira: aspereza 0,15, transmissão 1. Dá o ar de "objeto" à interface sem esconder o conteúdo.
5. Câmera a 50 mm, 3/4 de 20°, levemente de cima (8° a 12°). De baixo, a interface parece monumento; de cima demais, parece mesa.

#### Cursor e digitação

- **Cursor:** objeto 3D fino (seta com 2 mm de espessura, emissão branca 1,0) a 1 mm na frente da interface. Trajetória em curva (arco leve), nunca reta: mão humana não anda em linha reta. Velocidade de 1,5 a 2,5 larguras de botão por 10 q, com desaceleração nos últimos 6 q antes do alvo. Clique: escala 1,0 → 0,85 em 2 q → 1,0 em 4 q, e o botão alvo afunda 1 mm.
- **Digitação:** a análise da Impractical sobre o filme do Notion 3.0 aponta que a animação de máquina de escrever "imita a cadência de quem digita" e que cascatas rápidas transformam processamento invisível em "construção física visível" ([Impractical sobre Notion 3.0](https://impractical.ai/launch-videos/notion-3)). Ritmo prático: 1 caractere a cada 1 a 2 q (15 a 30 caracteres por segundo), com 1 pausa de 6 a 8 q depois da vírgula. Implementação: textura com o texto completo e uma máscara (nó Mapping animando um degrau) ou objeto de texto do Blender com `body` trocado por handler de quadro **[testar no Blender: handler em render de linha de comando]**.
- **Leitura:** tempo mínimo de texto na tela pela regra única: o maior entre 30 × (0,5 + caracteres/12) e 30 × (palavras/2,5 + 0,5), número contando como 2 palavras; mínimo 36 q (cap 01 §7.3) (ver 00 · Padrões da casa).

#### Gráfico que cresce

Barras: cada barra é uma caixa com origem na base; anime a escala Z de 0 a 1 com cascata de 2 a 3 q entre barras e Bezier com leve ultrapassagem (alça `AUTO` em vez de `AUTO_CLAMPED`, ou chave intermediária a 1,04). Linha: curva com `bevel_depth` de 1 a 2 mm e `bevel_factor_end` animado de 0 a 1 em 30 a 45 q **[testar no Blender: nome `bevel_factor_end` no 5.2]**. Número grande (KPI): contagem com o texto trocando a cada quadro, terminando 6 q antes do corte pra ser lido.

### Como transformar print de tela e Figma em material 3D convincente

Vale tudo da seção do app (exportação, px por mm, emissão 1,0, vidro, cartões, SVG, tipografia), com três diferenças:

1. **Escala de exportação:** 2x pra desktop. Um monitor 27" 4K tem ~163 ppi (6,4 px por mm) **[não verificado para modelo específico]**; o render quase nunca precisa de mais do que o 2x do Figma, exceto em push-in de 160% num componente: exporte esse componente sozinho em 4x.
2. **Dados reais ou fictícios coerentes:** dashboard com números aleatórios (gráfico que sobe e desce sem lógica, "Lorem ipsum") denuncia protótipo. Peça ao cliente uma conta de demonstração com dados plausíveis.
3. **Modo escuro:** interface escura em fundo escuro some. Se a UI é escura, o fundo da cena fica 1 a 1,5 stop mais claro que o fundo da UI, ou com cor complementar, e a janela ganha contorno de luz.

### As armadilhas da categoria

| Armadilha | Sinal visual | Cura |
|---|---|---|
| Interface inteira, ilegível | Tela toda no quadro, nada se lê no celular | Um componente por plano; push-in até o texto ter 10 px ou mais |
| Mockup de notebook genérico | Notebook de banco de imagem sem luz da cena | Janela flutuante estilizada ou notebook modelado com a mesma luz |
| Cursor robótico | Cursor em linha reta e velocidade constante | Arco, desaceleração, clique com escala |
| Dados sem lógica | Gráfico aleatório, nomes fictícios óbvios | Conta de demonstração com dados coerentes |
| UI escura em fundo escuro | Janela some, só os textos flutuam | Fundo 1 a 1,5 stop mais claro ou contorno de luz |
| Câmera passeando sem destino | Órbita contínua por 10 s | Cada movimento termina num componente; segure 12 a 18 q |
| Linhas de "conexão" decorativas | Linhas de luz ligando nada a nada | Linhas só entre ícones de integrações reais |
| Cubos e esferas pra "representar dados" | Formas flutuando ao redor da tela | Os dados reais da interface são o objeto; nada de enfeite |

### Estrutura pronta de 15 s (450 q)

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 2,0 | 1 a 60 | 85 mm | Push-in 5% | Problema: planilha bagunçada ou caixa de entrada lotada, em cartão escuro | Corte | Tique-taque | Dor em 5 palavras |
| 2,0 a 5,0 | 61 a 150 | 50 mm | Órbita 10° | Janela do produto acende em 3/4 | Chicote | Batida 1 | Nome + promessa |
| 5,0 a 8,0 | 151 a 240 | 70 mm | Recuo 10% + órbita 20° | Painéis explodem em 3 camadas | Corte | Cascata | Recurso 1 |
| 8,0 a 10,5 | 241 a 315 | 50 mm | Segue cursor | Cursor clica na ação principal, lista se preenche | Corte | Clique + cascata | Recurso 2 |
| 10,5 a 12,5 | 316 a 375 | 85 mm | Push-in 140% | Gráfico cresce até o KPI | Corte na batida | Subida | "+32% em 30 dias" (dado real do cliente) |
| 12,5 a 15,0 | 376 a 450 | 70 mm | Empurrão 2% | Packshot: logo + URL | (fim) | Logo sonoro | CTA: "Teste grátis em nome.com" |

### Estrutura pronta de 30 s (900 q)

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 3,0 | 1 a 90 | 35 mm | Truck lento | Mesa de trabalho real (luz natural), notebook com o caos atual | Corte | Ambiente de escritório | Dor |
| 3,0 a 5,0 | 91 a 150 | 50 mm | Push-in 30% | Câmera entra na tela do notebook | Entrada na tela | Sopro | (nenhum) |
| 5,0 a 8,0 | 151 a 240 | 50 mm | Órbita 10° | Janela do produto em fundo escuro | Corte | Batida 1 | Nome + promessa |
| 8,0 a 11,5 | 241 a 345 | 70 mm | Recuo + órbita | Painéis explodidos | Corte | Cascata | Recurso 1 |
| 11,5 a 14,5 | 346 a 435 | 85 mm | Push-in 3% | Campo de IA com digitação + resposta em cascata | Corte | Teclas suaves | Recurso 2 |
| 14,5 a 17,5 | 436 a 525 | 50 mm | Segue cursor | Cursor arrasta card entre colunas | Corte | Clique | Recurso 3 |
| 17,5 a 20,5 | 526 a 615 | 85 mm | Push-in 140% | Gráfico cresce, KPI | Corte | Subida | Resultado real |
| 20,5 a 23,5 | 616 a 705 | 50 mm | Recuo 15% | Ícones de integrações conectando por linhas | Corte | Três "plins" | "Conecta com o que você usa" |
| 23,5 a 26,0 | 706 a 780 | 50 mm | Órbita 15° | Celular + notebook com a mesma conta | Corte | Batida | "No computador e no celular" |
| 26,0 a 30,0 | 781 a 900 | 70 mm | Empurrão 2% | Packshot: logo + URL | (fim) | Logo sonoro termina no q 860 | CTA |

### Mundos visuais

- **Recomendados:** brutalista tech (UI densa, grade, tipografia forte), vidro e cromo (painéis de vidro fosco), estúdio premium (fundo grafite com contorno), holográfico (produto de IA), editorial de revista (SaaS de criação, marketing), luz natural (o plano de contexto na mesa).
- **Evitar:** pop candy em SaaS B2B sério (perde autoridade), argila (vira brinquedo), orgânico líquido (sem relação com software, vira enfeite), neon noturno em dashboard financeiro (parece cassino).

### Referências reais

| Referência | Link | O que aprender |
|---|---|---|
| Linear, "Introducing Linear Agent" | [YouTube](https://www.youtube.com/watch?v=mRql2VJ99gM) e [análise da Impractical](https://impractical.ai/launch-videos/linear-agent) | Contenção: revelação de texto por máscara, pausas longas entre cortes, câmera contínua sobre UI escura, cascatas que imitam a animação nativa do app. |
| Notion, "Introducing Notion 3.0: Agents" (2025) | [YouTube](https://www.youtube.com/watch?v=R1cF4T4lgI4) e [análise](https://impractical.ai/launch-videos/notion-3) | Como tornar visível um processo invisível (IA): digitação, cascatas de construção, push-ins suaves. |
| Stripe Sessions 2025, keynote de produto | [Stripe](https://stripe.com/sessions/2025/product-keynote) | Infraestrutura invisível mostrada por interfaces limpas e gradientes de marca consistentes do começo ao fim. |

## 3. Serviço (sem produto físico)

**O que vende:** confiança, competência, resultado e proximidade. Clínica, escritório de advocacia, agência, consultoria, serviço local (oficina, salão, escola) e B2B. O problema central: não existe objeto herói. A tentação é preencher o vazio com cubos, esferas e ícones flutuando (problema nº 3). Este playbook resolve isso com uma regra: **todo objeto em cena precisa existir de verdade na rotina do serviço ou no resultado que o cliente recebe**.

### Como dar corpo visual a algo intangível

Seis caminhos, do mais concreto ao mais abstrato. Escolha um como espinha do filme e no máximo um segundo como apoio.

| Caminho | O que vira o herói | Funciona pra | Exemplo concreto |
|---|---|---|---|
| 1. Objeto-ferramenta | Um instrumento real do ofício, em macro | Clínica, oficina, salão, estúdio | Clínica odontológica: espelho clínico de aço escovado, luz rasante, reflexo do sorriso no espelho |
| 2. Objeto-resultado | O que o cliente leva pra casa | Advocacia, consultoria, contabilidade | Advocacia: o documento assinado, a caneta, o carimbo que cai com impacto; contabilidade: a guia paga, o relatório encadernado |
| 3. Lugar em miniatura (diorama) | A fachada ou a sala, isométrica | Serviço local, clínica, escola | Fachada da clínica em diorama: a luz acende janela por janela no ritmo da trilha |
| 4. Interface do atendimento | A agenda, o WhatsApp, o painel do cliente | Qualquer serviço com agendamento ou portal | Cartão de agendamento confirmado saindo da tela do celular (receita do app) |
| 5. Metáfora de transformação | Um antes e depois físico | Agência, consultoria, reforma | Agência: a vitrine apagada numa rua de garagem vira loja acesa na avenida principal (diorama com dois estados) |
| 6. Número e tipografia como objeto | Dados de prova extrudados em 3D | B2B, consultoria | "12 anos", "3.400 clientes" em letras de metal escovado com chanfro, câmera passando rente |

**Por que funciona:** o cliente reconhece o objeto real (o espelho do dentista, a fachada da rua dele) e transfere a qualidade da imagem pra qualidade do serviço. Um cubo de vidro não lembra nada; um carimbo de cartório lembra "resolvido". A Nexus Studios deu corpo à meditação do Headspace com mais de 150 personagens e analogias visuais calorosas, e o caso relata um vídeo com 30 milhões de visualizações ([Nexus Studios](https://nexusstudios.com/work/headspace-case-study/)): o abstrato ganhou um mundo próprio, não enfeites.

**Teste do objeto (antes de modelar qualquer coisa):** "O dono do negócio toca nisso na rotina, ou o cliente recebe isso?" Se a resposta for não, o objeto sai.

### Os planos clássicos

| Plano | Lente | Movimento | Duração (q) | O que vende |
|---|---|---|---|---|
| Objeto-ferramenta em macro, luz rasante | 100 mm | Deslize 2 cm | 60 a 75 | Cuidado, precisão, técnica |
| Fachada/sala em diorama isométrico | 85 a 135 mm (quase ortográfico) | Órbita 20° | 60 a 90 | "Existe, é aqui, é perto" |
| Luz acendendo no diorama (janela por janela) | 85 mm | Parado | 30 a 45 | Abertura, acolhimento |
| Documento ou resultado chegando à mesa | 50 mm | Câmera de cima (top shot) com push-in 5% | 45 a 60 | Entrega, conclusão |
| Carimbo, assinatura ou selo com impacto | 85 mm | Tremor de 2 q no impacto | 20 a 30 | "Resolvido", segurança |
| Agenda/WhatsApp confirmando atendimento | 50 mm | Órbita 15° | 45 a 60 | Facilidade de contratar |
| Antes e depois (dois estados do diorama) | 50 mm | Wipe de luz lateral | 45 a 75 | Transformação |
| Prova social: cartões de avaliação em profundidade | 70 mm | Truck lateral | 45 a 75 | Outros confiaram |
| Número de prova extrudado | 35 mm | Câmera rente às letras (dolly) | 45 a 60 | Experiência, escala |
| Mapa local com pino caindo | 50 mm, de cima | Push-in 10% | 30 a 45 | Proximidade, serviço local |
| Packshot: logo + contato | 70 mm | Empurrão 2% | 60 a 90 | Ação: agendar, chamar |

### Técnicas específicas com receita

#### Diorama isométrico do lugar

1. Câmera com lente longa (100 a 135 mm) e distância grande, ou câmera ortográfica (`cam.data.type = 'ORTHO'`). Lente longa mantém um resto de perspectiva, que parece mais real que o ortográfico puro.
2. Ângulo clássico isométrico: câmera 35° acima do horizonte e 45° em Z. Comece por aí e ajuste.
3. Efeito de maquete: modele o diorama em escala de miniatura (base de 30 a 60 cm) ou use câmera ortográfica com DoF desligado. Em escala real de 6 a 8 m, f/2 não borra nada que pareça maquete (ver 00 · Padrões da casa).
4. Recorte o diorama numa base (um bloco de chão de 30 a 60 cm de espessura em escala), com corte limpo. O corte é o que diz "isto é uma representação", e libera a estilização.
5. Detalhes que contam a história: placa com o nome real, horário de funcionamento, a planta da recepção, a cadeira de espera. Três a cinco detalhes verdadeiros valem mais que cinquenta genéricos.
6. Luz: sol (luz direcional) a 35° com temperatura de 5000 a 5600 K, e janelas internas em 3000 K com emissão baixa. A diferença quente/frio dá vida.

**Sinal de que deu errado:** cidade genérica de banco de assets (nada é do cliente); diorama sem base, flutuando (vira enfeite); tudo nítido e chapado (sem direção de sol).

#### Carimbo, documento e selo com impacto

1. Carimbo desce em 6 q com aceleração (alça de entrada longa, saída curta: cai como objeto pesado).
2. Impacto no quadro X: o papel afunda 0,5 mm (shape key), o carimbo comprime 3% em Z por 2 q, a câmera treme 2 q (deslocamento de 1 a 2 mm em Y, só no quadro do impacto e no seguinte).
3. A marca da tinta aparece no quadro do impacto (troca de textura ou máscara com valor de 0 pra 1 em 1 q), com bordas irregulares (ruído no limiar da máscara).
4. O carimbo sobe em 10 q, mais devagar que desceu.
5. Som: o "tum" cai exatamente no quadro do impacto.

#### Prova social em cartões 3D

Avaliações reais do cliente (Google, com nome e nota) em cartões de 0,6 mm com cantos arredondados, dispostos em profundidade (separação de 6 a 10 cm entre cartões numa cena de 1 m). Câmera em truck lateral: os cartões passam com parallax. Cada cartão fica legível por pelo menos 30 q. Nunca invente avaliação: é fabricação de prova e pode ser enquadrado como propaganda enganosa.

### As armadilhas da categoria

| Armadilha | Sinal visual | Cura |
|---|---|---|
| Enfeite abstrato | Cubos, esferas, ícones de "check" flutuando | Teste do objeto: só entra o que existe na rotina ou no resultado |
| Banco de imagens em 3D | Pessoas genéricas, aperto de mão, martelo de juiz | Objetos e lugares reais do cliente; martelo de juiz não é usado no Brasil em audiência comum |
| Promessa de resultado | "Ganhe sua causa", "cura garantida" | Fale do processo e do atendimento. Conselhos profissionais (OAB, CFM, CFO) restringem publicidade com promessa **[verifique o código de ética do conselho do cliente]** |
| Antes e depois de paciente em 3D | Corpo ou rosto "melhorado" em CG | Evite. Antes e depois de pessoa tem regra própria nos conselhos de saúde; use o ambiente ou a ferramenta |
| Frieza de laboratório | Branco total, luz chapada | Luz direcional com temperatura quente nas áreas de acolhimento (3200 a 4000 K) |
| Texto demais | Lista de serviços na tela | Um serviço por plano, no máximo 6 palavras |
| Mundo visual sem relação com o setor | Neon numa advocacia tradicional | Mundo coerente com a postura da marca (ver abaixo) |
| Contato pequeno | WhatsApp ilegível no fim | Contato com 60 px ou mais de altura no 1080 x 1920, por 2 s ou mais |

### Estrutura pronta de 15 s (450 q)

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 2,5 | 1 a 75 | 100 mm | Deslize 2 cm | Objeto-ferramenta em macro, luz rasante | Corte | Ambiente + nota grave | Pergunta da dor ("Dor de dente no fim de semana?") |
| 2,5 a 5,5 | 76 a 165 | 100 mm | Órbita 20° | Diorama da fachada, luzes acendem | Corte | Batida 1 | Nome + bairro |
| 5,5 a 8,5 | 166 a 255 | 50 mm | Órbita 15° | Celular: agendamento confirmado sai da tela | Corte | Clique + "plim" | "Agende em 1 minuto" |
| 8,5 a 11,5 | 256 a 345 | 70 mm | Truck | Três avaliações reais em profundidade | Corte | Batida | "Nota 4,9 no Google" (real) |
| 11,5 a 15,0 | 346 a 450 | 70 mm | Empurrão 2% | Packshot: logo, endereço, WhatsApp | (fim) | Acorde final | CTA: "Chame no WhatsApp" + número |

### Estrutura pronta de 30 s (900 q)

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 3,0 | 1 a 90 | 50 mm | Top shot, push-in 5% | Mesa com o problema (pilha de papéis, conta, documento) | Corte | Ambiente | Dor |
| 3,0 a 6,0 | 91 a 180 | 100 mm | Deslize | Objeto-ferramenta em macro | Corte | Nota grave | (nenhum) |
| 6,0 a 9,5 | 181 a 285 | 100 mm | Órbita 20° | Diorama: fachada, luzes acendem | Corte | Batida 1 | Nome + desde quando |
| 9,5 a 13,0 | 286 a 390 | 85 mm | Push-in 8% | Diorama abre (parede some) e mostra a sala por dentro | Corte | Sopro | "Como funciona" |
| 13,0 a 16,5 | 391 a 495 | 50 mm | Trilho lateral | Processo em 3 passos: três objetos reais em sequência num trilho | Corte em cada batida | Três batidas | Passo 1, 2, 3 (2 a 3 palavras cada) |
| 16,5 a 19,0 | 496 a 570 | 85 mm | Tremor no impacto | Carimbo/selo/assinatura no documento | Corte | "Tum" no q 530 | "Resolvido" |
| 19,0 a 22,5 | 571 a 675 | 35 mm | Dolly rente | Número de prova extrudado | Corte | Subida | "12 anos, 3.400 clientes" (real) |
| 22,5 a 26,0 | 676 a 780 | 70 mm | Truck | Avaliações reais | Corte | Batida | Nota real |
| 26,0 a 30,0 | 781 a 900 | 70 mm | Empurrão 2% | Packshot: logo, endereço, WhatsApp | (fim) | Acorde | CTA |

### Mundos visuais

- **Recomendados:** diorama isométrico (serviço local, clínica, escola), editorial de revista (advocacia, consultoria, arquitetura), luz natural (clínica, bem-estar, escritório acolhedor), papel e recorte (contabilidade, educação, processos explicados), argila (serviço com tom humano e leve: pediatria, pet, escola infantil), estúdio premium (objeto-ferramenta em macro).
- **Evitar:** holográfico e neon noturno em saúde e direito (passa leveza e risco onde o cliente quer segurança), pop candy em advocacia, brutalista tech em clínica (frieza), vidro e cromo sem objeto real (vira enfeite abstrato).

### Referências reais

| Referência | Link | O que aprender |
|---|---|---|
| Nexus Studios para Headspace | [Estudo de caso](https://nexusstudios.com/work/headspace-case-study/) | Um serviço intangível ganha um mundo coerente e personagens que explicam ideias por analogia, em vez de símbolos genéricos. |
| Notion, "Introducing Notion 3.0: Agents" | [YouTube](https://www.youtube.com/watch?v=R1cF4T4lgI4) e [análise](https://impractical.ai/launch-videos/notion-3) | Trabalho invisível (o agente fazendo a tarefa) vira construção visível em cascata. Serve de modelo pra mostrar "o que a consultoria faz por você". |
| Stripe Sessions 2025 | [Stripe](https://stripe.com/sessions/2025/product-keynote) | Serviço de infraestrutura financeira mostrado por interface e identidade visual consistentes, sem metáforas soltas. |

## 4. Produto físico pequeno e eletrônico

**O que vende:** engenharia, acabamento, desempenho e desejo. Fones, relógios, carregadores, caixas de som, câmeras, gadgets, ferramentas. O herói é o objeto e a luz que corre nele.

### Os planos clássicos

| Plano | Lente | Movimento | Duração (q) | O que vende |
|---|---|---|---|---|
| Silhueta no escuro, contorno acende | 85 mm | Empurrão 4% | 45 a 60 | Mistério, forma icônica |
| Faixa de luz varrendo o corpo (light sweep) | 70 a 85 mm | Parado; a luz se move | 45 a 60 | Acabamento, curvas |
| Giro parcial em plataforma (30° a 90°) | 50 a 85 mm | Parado | 60 a 90 | Volume, desenho 3D |
| Vista explodida | 50 a 70 mm | Recuo 8% | 75 a 120 | Engenharia, "o que tem dentro" |
| Macro de textura (malha, metal escovado, LED) | 100 mm | Deslize 1 a 2 cm | 45 a 60 | Qualidade de material |
| Macro de interface física (botão, porta, dobradiça) | 100 mm | Rack focus | 30 a 45 | Precisão, função |
| Recurso visualizado (som, carga, resistência à água) | 50 mm | Órbita 15° | 45 a 75 | Desempenho |
| Encaixe (fone entrando no estojo, relógio na base) | 85 mm | Push-in 5% | 30 a 45 | Satisfação, "clique" |
| Linha de cores (variantes lado a lado) | 50 mm | Truck lateral | 60 a 90 | Escolha, personalidade |
| Escala com objeto do cotidiano | 50 mm | Parado | 30 a 45 | Tamanho real, portabilidade |
| Packshot herói 3/4 | 70 a 85 mm | Empurrão 2% | 60 a 90 | Desejo, compra |

### Técnicas específicas com receita

#### Faixa de luz varrendo o corpo (light sweep)

1. Luz de área retangular (`shape = 'RECTANGLE'`), 1,2 a 1,5 m de comprimento por 5 a 10 cm de largura (proporção de 15:1 a 25:1). É a luz de faixa (strip softbox) virtual.
2. Posição: atrás e acima do produto, de modo que o reflexo dela atravesse a superfície curva vista pela câmera.
3. Anime a luz (não o produto) passando de um lado ao outro em 30 a 45 q, Bezier suave. O reflexo vira uma linha que corre pela curva.
4. Grade (`spread`) de 30° a 60° pra a luz não vazar no fundo. O padrão do 5.2.2 é 180° (`spread = π`) **[confirmado por sonda no bpy 5.2.2]**; deixar no padrão acende o fundo inteiro.
5. Bandeiras pretas (planos pretos sem reflexo) dos lados: o metal e o vidro precisam de preto pra refletir, senão ficam cinza.

**Sinal de que deu errado:** reflexo largo e lavado (luz grande demais); nenhum reflexo visível (luz fora do ângulo de reflexão: mova até aparecer na câmera); fundo acendendo junto (spread alto).

#### Vista explodida do eletrônico

Use a receita 0.2 com estes valores: fone de ouvido com 6 a 9 peças; casca externa sai primeiro em Z (eixo do conduto), bateria e placa por último. Distância de 0,4 a 0,6 x a altura da peça. Peças internas precisam de material real: placa verde fosca (`Roughness` 0,5 com mapa de trilhas), bateria com rótulo, ímã cromado. Cabos flexíveis como curvas com `bevel_depth` de 0,3 a 0,5 mm. A câmera recua 8% durante a explosão e volta durante a remontagem.

#### Materiais de eletrônico (valores de partida)

| Material | Base | Metallic | Roughness | Extra |
|---|---|---|---|---|
| Alumínio anodizado | Cor da marca, um pouco mais escura | 1,0 | 0,28 a 0,38 | `Anisotropic` 0,3 a 0,5 pra escovado |
| Aço polido | Cinza 0,6 a 0,7 | 1,0 | 0,08 a 0,15 | Variação de aspereza por ruído ±0,05 |
| Plástico fosco (ABS) | Cor | 0 | 0,45 a 0,6 | Mapa de normal com granulado fino |
| Plástico brilhante (piano) | Cor escura | 0 | 0,05 a 0,1 | `Coat Weight` 1, `Coat Roughness` 0,03 |
| Silicone | Cor | 0 | 0,55 a 0,7 | `Subsurface Weight` 0,1 a 0,2 |
| Vidro de lente | Branco | 0 | 0,0 a 0,02 | `Transmission Weight` 1, `IOR` 1,5, `Thin Film Thickness` 200 a 400 nm pro reflexo colorido de lente tratada |
| Malha de tecido (caixa de som) | Cor | 0 | 0,7 | `Sheen Weight` 0,5 a 1 |

Chanfro em todas as arestas: 0,5 a 1 mm em escala real (tabela do cap 06) (ver 00 · Padrões da casa) (modificador Bevel com `harden_normals = True`, 2 a 3 segmentos). É o detalhe que mais separa CG de foto.

### As armadilhas da categoria

| Armadilha | Sinal visual | Cura |
|---|---|---|
| Plástico de CG | Superfície uniforme, quina viva | Chanfro 0,5 a 1 mm (tabela do cap 06), variação de aspereza, granulado |
| Metal cinza | Metal sem reflexo, parece plástico cinza | Ambiente com contraste (bandeiras pretas, faixas de luz); metal precisa de algo pra refletir |
| Giro de 360° contínuo | Produto rodando como vitrine de loja | Giro parcial motivado; luz em movimento no lugar do produto |
| Vista explodida aleatória | Peças voando em direções sem lógica | Eixo principal, ordem de fora pra dentro, cascata de 3 a 4 q |
| Recurso com efeito genérico | "Ondas sonoras" de partículas azuis | Visualize o recurso com o próprio produto (malha vibrando, LED acendendo, gota escorrendo) |
| Escala ambígua | Não dá pra saber o tamanho | Um objeto de referência real (mão real filmada, moeda, mesa) |
| LED estourado | Luz do LED branca chapada | LED pequeno: 1,5 a 3 com cor saturada, conferindo o hex no `qa_extra --marca` (ver 00 · Padrões da casa) |
| Logo do fabricante errado | Logo de outra marca, logo distorcido | Arte vetorial do cliente, aplicada como decalque com relevo de 0,05 mm |

### Estrutura pronta de 15 s (450 q)

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 2,0 | 1 a 60 | 85 mm | Empurrão 4% | Silhueta no escuro, contorno acende | Corte | Grave | (nenhum) |
| 2,0 a 4,0 | 61 a 120 | 85 mm | Parado | Faixa de luz varre o corpo | Corte | Sopro | Nome do produto |
| 4,0 a 7,5 | 121 a 225 | 50 mm | Recuo 8% | Vista explodida (6 peças, cascata 3 q), segura e remonta | Corte | Cliques mecânicos | Destaque técnico |
| 7,5 a 9,5 | 226 a 285 | 100 mm | Deslize 2 cm | Macro de textura | Rack focus | Batida | Material ("Alumínio reciclado") |
| 9,5 a 11,5 | 286 a 345 | 85 mm | Push-in 5% | Encaixe no estojo/base | Corte | "Clique" no q 330 | Benefício |
| 11,5 a 15,0 | 346 a 450 | 70 mm | Empurrão 2% | Packshot herói 3/4 | (fim) | Logo sonoro | CTA + preço ou loja |

### Estrutura pronta de 30 s (900 q)

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 3,0 | 1 a 90 | 85 mm | Empurrão 4% | Silhueta no escuro | Corte | Grave | (nenhum) |
| 3,0 a 5,5 | 91 a 165 | 85 mm | Parado | Light sweep 1 | Corte | Sopro | Nome |
| 5,5 a 8,5 | 166 a 255 | 70 mm | Parado | Giro de 60° em 90 q (20 °/s) | Corte | Batida 1 | Promessa |
| 8,5 a 13,0 | 256 a 390 | 50 mm | Recuo 8% | Vista explodida completa com rótulos | Corte | Cliques | 2 rótulos técnicos |
| 13,0 a 15,5 | 391 a 465 | 100 mm | Deslize | Macro textura | Rack focus | Batida | Material |
| 15,5 a 18,0 | 466 a 540 | 100 mm | Rack focus | Macro de botão/porta | Corte | Clique | Função |
| 18,0 a 21,5 | 541 a 645 | 50 mm | Órbita 15° | Recurso visualizado no próprio produto | Corte | Efeito do recurso | Recurso |
| 21,5 a 24,0 | 646 a 720 | 85 mm | Push-in | Encaixe | Corte | "Clique" | Benefício |
| 24,0 a 26,5 | 721 a 795 | 50 mm | Truck | Linha de cores | Corte | Batida | "Em 4 cores" |
| 26,5 a 30,0 | 796 a 900 | 70 mm | Empurrão 2% | Packshot | (fim) | Logo sonoro | CTA |

### Mundos visuais

- **Recomendados:** estúdio premium, luxo escuro, vidro e cromo, macro cinematográfico, brutalista tech (ferramentas, gadgets técnicos), retrofuturo (produtos com desenho nostálgico), neon noturno (gamer).
- **Evitar:** papel e recorte (contradiz engenharia), argila (perde precisão de material), orgânico líquido sem motivo (só se o produto for à prova d'água e a água for a prova).

### Referências reais

| Referência | Link | O que aprender |
|---|---|---|
| Apple, "Introducing iPhone 17 Pro" | [YouTube](https://www.youtube.com/watch?v=IhZRSC9w3Mw) | Light sweep no metal, macros de material, explodida limpa. Ritmo de corte na batida. |
| Apple, AirPods Pro 3 (2025) | [Apple Newsroom](https://www.apple.com/newsroom/2025/09/introducing-airpods-pro-3-the-ultimate-audio-experience/) e [YouTube](https://www.youtube.com/watch?v=EMmKs8vMKhU) | Objeto pequeno e branco em fundo escuro: contorno e sombra fazem o volume. Recurso (som, saúde) mostrado com o próprio produto. |
| Nothing, "Introducing Phone (3a) Series" | [YouTube](https://www.youtube.com/watch?v=ZizbGaSnIUE) | Linguagem gráfica da marca dominando luz, tipografia e transições. |
| Lee Schwartz, animação de produto em Blender | [80.lv](https://80.lv/articles/check-out-this-cool-dynamic-product-animation-made-in-blender) | Planos curtos com close de detalhe e troca de variantes por cor; elemento de interface sobreposto como se o espectador manipulasse o produto. |

## 5. Cosmético e perfume

**O que vende:** sensação, textura, pureza do ingrediente e desejo. Perfume vende o invisível (o cheiro) pela luz no vidro e no líquido. Cosmético vende a textura na pele sem mostrar a pele.

### Os planos clássicos

| Plano | Lente | Movimento | Duração (q) | O que vende |
|---|---|---|---|---|
| Frasco em contraluz, líquido brilhando | 85 a 100 mm | Empurrão 3% | 60 a 90 | Pureza, cor, luxo |
| Cáusticas (luz através do vidro projetada na mesa) | 50 a 85 mm | Luz gira 20° | 60 a 75 | Preciosidade |
| Textura do creme: espátula ou dedo marcando (swatch) | 100 mm | Top shot, push-in 4% | 45 a 75 | Textura, "derrete na pele" |
| Gota de sérum caindo do conta-gotas | 100 a 135 mm | Parado, câmera lenta | 30 a 45 | Concentração, precisão |
| Ingrediente real (flor, fruta, folha) com o frasco | 85 mm | Truck lateral | 60 a 75 | Origem natural |
| Tampa girando, abrindo (metal ou madeira) | 100 mm | Push-in | 30 a 45 | Acabamento, ritual |
| Borrifo de perfume (névoa contra luz) | 85 mm | Parado | 30 a 45 | Sensação, liberação |
| Líquido derramando em câmera lenta (seda líquida) | 100 mm | Órbita 10° | 45 a 60 | Fluidez, sensorialidade |
| Linha da coleção em degraus | 50 mm | Truck | 60 a 90 | Família, escolha |
| Macro do rótulo (relevo, hot stamping) | 100 mm | Rack focus | 30 a 45 | Marca, acabamento |
| Packshot com sombra longa e gradiente | 85 mm | Empurrão 2% | 60 a 90 | Desejo |

### Técnicas específicas com receita

#### Frasco de perfume: vidro grosso + líquido + contraluz

1. **Modelagem:** vidro de perfume tem base grossa (8 a 15 mm) e paredes de 2 a 4 mm **[não verificado: varia por frasco; meça a referência do cliente]**. Modele o vidro como sólido com espessura real e o líquido como objeto separado.
2. **Líquido dentro do vidro:** o líquido toca a parede interna. O jeito mais usado é fazer o líquido 0,1 mm maior que a cavidade, entrando levemente na parede, pra não deixar camada de ar entre os dois. Com camada de ar, o Cycles calcula uma refração vidro→ar→líquido que escurece e borra as bordas **[testar no Blender: comparar líquido 0,1 mm maior vs. igual à cavidade]**.
3. **Materiais:** vidro `Transmission Weight` 1, `IOR` 1,5, `Roughness` 0 a 0,02. Líquido `Transmission Weight` 1, `IOR` 1,33 a 1,36, Base Color branca; cor por Volume Absorption na saída Volume (perfume #F2B8C6 a 25/m; cola #5A1E0E a 120/m; cap 06) (ver 00 · Padrões da casa): a cor se acumula na espessura.
4. **Contraluz:** um cartão branco emissivo (plano de emissão 2 a 4) atrás do frasco, do tamanho exato do frasco visto pela câmera. O líquido acende por dentro. É a técnica clássica do fotógrafo de bebida e perfume.
5. **Bordas escuras:** duas bandeiras pretas laterais a 15 a 30 cm. O vidro ganha linhas pretas de contorno e fica definido. Sem bandeira, o vidro some no fundo.
6. **Profundidade de bounces:** `scene.cycles.transmission_bounces` padrão 12 e `transparent_max_bounces` 8 **[confirmado por sonda no bpy 5.2.2]**. Frasco com tampa de vidro e líquido pode precisar de 16 a 24 bounces de transmissão; menos que isso deixa áreas pretas dentro do vidro.

**Sinal de que deu errado:** vidro invisível (sem bandeira preta); líquido preto ou opaco (bounces baixos, camada de ar, cor saturada demais); vidro fino como copo descartável (sem espessura real).

#### Cáusticas no Cycles

No 5.2.2 existem `light.cycles.is_caustics_light`, `object.cycles.is_caustics_caster` e `object.cycles.is_caustics_receiver` **[confirmado por sonda no bpy 5.2.2]** (Manifold Next Event Estimation, as "cáusticas de sombra"). Ligue na luz principal, no frasco (caster) e na mesa (receiver). Funciona melhor com luz pequena (0,05 a 0,15 m) e forte. O EEVEE não calcula cáustica real: em EEVEE, falsifique com uma textura de cáustica projetada por luz com gobo (nó de imagem na luz) **[testar no Blender: suporte a nós em luz no EEVEE 5.2]**.

#### Textura de creme (swatch)

1. Base: plano subdividido com o creme como malha esculpida (forma de "vírgula" deixada pela espátula), 3 a 6 mm de altura em escala real.
2. Material: `Base Color` do creme, `Roughness` 0,25 a 0,4 (creme brilha um pouco), `Subsurface Weight` 0,3 a 0,6, `Subsurface Radius` pequeno (1 a 3 mm). Sem subsurface, o creme parece massa de modelar.
3. Animação de "passada": shape key da forma inicial (bolinha) até a forma espalhada, 30 a 45 q, com Bezier de saída lenta. Ou uma deformação por curva em que um objeto (espátula) arrasta a malha **[testar no Blender]**.
4. Luz rasante a 15° pra revelar as ranhuras.

#### Borrifo e líquido derramando

Borrifo de perfume é névoa: volume (Principled Volume) num cone com densidade baixa (0,5 a 2) e ruído, contra luz traseira. Mesmo princípio do vapor (playbook 7). Líquido derramando em fita (seda líquida): pode ser simulação (Mantaflow, ver bebida) ou, mais controlável, uma curva com perfil achatado (fita) animada por shape keys e ondulação por modificador Wave. Pra cosmético, o controle importa mais que a física.

### As armadilhas da categoria

| Armadilha | Sinal visual | Cura |
|---|---|---|
| Vidro invisível | Frasco some no fundo | Bandeiras pretas laterais, contraluz por cartão |
| Líquido escuro | Perfume parece xarope preto | Bounces 16+, cor menos saturada, sem camada de ar |
| Creme de massinha | Textura opaca, sem brilho | Subsurface 0,3 a 0,6, aspereza 0,3, luz rasante |
| Ingrediente decorativo | Flor genérica que não está na fórmula | Só ingredientes reais da fórmula, citados no rótulo |
| Pétalas e bolhas flutuando | Elementos soltos girando ao redor | Elementos com física e motivo (cair, assentar, borrifar) |
| Dourado amarelo de CG | Tampa "ouro" saturada e lisa | Metal 1, cor (1,0, 0,78, 0,45) aproximada, aspereza 0,15 a 0,25, microrriscos **[não verificado: ajuste pela foto do produto]** |
| Rosa e nude lavados | Paleta pastel perde contraste | Look Medium High Contrast e um elemento escuro (sombra, tampa) como âncora |
| Pele de CG | Rosto ou braço 3D aplicando o produto | Evite pele em CG. Mostre o produto e a textura; pessoa só em filmagem real |

### Estrutura pronta de 15 s (450 q)

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 2,5 | 1 a 75 | 100 mm | Parado, câmera lenta | Gota caindo / borrifo contra luz | Corte | Respiro + gota | (nenhum) |
| 2,5 a 5,5 | 76 a 165 | 85 mm | Empurrão 3% | Frasco em contraluz, líquido acende | Dissolve 8 q | Pad suave | Nome |
| 5,5 a 8,0 | 166 a 240 | 85 mm | Truck | Ingrediente real cai ao lado do frasco | Corte | Batida leve | Ingrediente |
| 8,0 a 11,0 | 241 a 330 | 100 mm | Top shot, push-in | Swatch de textura | Corte | Som tátil | Benefício sensorial |
| 11,0 a 15,0 | 331 a 450 | 85 mm | Empurrão 2% | Packshot com cáusticas e sombra longa | (fim) | Nota final | CTA |

### Estrutura pronta de 30 s (900 q)

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 3,0 | 1 a 90 | 135 mm | Parado | Gota de sérum caindo, câmera lenta | Corte | Gota amplificada | (nenhum) |
| 3,0 a 6,0 | 91 a 180 | 85 mm | Empurrão 3% | Frasco em contraluz | Dissolve | Pad | Nome |
| 6,0 a 9,0 | 181 a 270 | 50 mm | Luz gira 20° | Cáusticas desenhando na mesa | Corte | Brilhos | (nenhum) |
| 9,0 a 12,5 | 271 a 375 | 100 mm | Push-in | Tampa gira e abre | Corte | Rosca + clique | Acabamento |
| 12,5 a 16,0 | 376 a 480 | 85 mm | Truck | Ingredientes reais | Corte | Batida leve | 2 ingredientes |
| 16,0 a 19,5 | 481 a 585 | 100 mm | Órbita 10° | Líquido em fita, câmera lenta | Corte | Fluxo | Sensação |
| 19,5 a 23,0 | 586 a 690 | 100 mm | Top shot | Swatch | Corte | Tátil | Textura |
| 23,0 a 26,0 | 691 a 780 | 50 mm | Truck | Linha da coleção | Corte | Batida | Família |
| 26,0 a 30,0 | 781 a 900 | 85 mm | Empurrão 2% | Packshot | (fim) | Nota final | CTA |

### Mundos visuais

- **Recomendados:** luxo escuro (perfume), estúdio premium com gradiente, orgânico líquido (cosmético hidratante, sérum), luz natural (persiana sobre o frasco: rotina, autenticidade), editorial de revista (beleza com atitude), tátil têxtil (cosmético com toque aveludado), macro cinematográfico.
- **Evitar:** brutalista tech, neon noturno (exceto marcas jovens de maquiagem), holográfico (só se for a identidade da linha), argila (perde a pureza do vidro e do líquido).

### Referências reais

| Referência | Link | O que aprender |
|---|---|---|
| Glossier, "You Impressions" (dir. Mitch Ryan) | [LBB Online](https://lbbonline.com/news/glossier-showcases-fragrance-additions-with-vivid-avant-garde-film) | Perfume vendido como experiência sensorial ligada a quem usa, com ângulos íntimos e som atmosférico, em vez de produto girando. |
| Aesop, "Morphē" (dir. Lucy McRae) | [Vimeo](https://vimeo.com/49304150) | Mundo visual de laboratório e texturas (géis, líquidos) como linguagem da marca. Textura é o produto. |
| Belle d'Or, animação CGI de perfume | [Behance](https://www.behance.net/gallery/244324717/Belle-dOr-3D-CGI-Perfume-Animation) | Estudo de luz em vidro e líquido dourado **[não aberto: página do Behance não carregou na pesquisa; confira antes de usar como referência]**. |

## 6. Bebida e líquido

**O que vende:** frescor, sabor, energia, momento. O espectador precisa "sentir o gelado" ou "sentir o gás" sem tocar. Os três sinais universais: condensação, movimento de líquido e contraluz.

### Os planos clássicos

| Plano | Lente | Movimento | Duração (q) | O que vende |
|---|---|---|---|---|
| Lata/garrafa com condensação, gota escorrendo | 100 mm | Deslize 2 cm | 45 a 60 | Gelado, refrescância |
| Abertura do lacre (anel da lata, tampinha) | 100 mm | Push-in 5% | 20 a 30 | Momento, som icônico |
| Splash: produto atravessa uma onda de líquido | 50 a 85 mm | Câmera lenta, órbita 10° | 45 a 75 | Energia, sabor |
| Serviço: líquido caindo no copo | 85 mm | Parado | 45 a 60 | Apetite, cor |
| Bolhas subindo no copo (macro) | 100 mm | Push-in 4% | 30 a 45 | Gás, frescor |
| Gelo caindo no copo com respingo | 85 mm | Parado, câmera lenta | 30 a 45 | Gelado, impacto |
| Contraluz: líquido aceso por trás | 85 mm | Empurrão 3% | 45 a 60 | Cor, transparência, pureza |
| Ingredientes (fruta cortada, folhas) ao redor | 50 mm | Truck | 45 a 60 | Sabor natural |
| Giro rápido com chicote entre sabores | 50 mm | Chicote 6 q | 30 a 45 | Variedade |
| Brinde / encontro de duas embalagens | 50 mm | Parado | 30 a 45 | Momento social |
| Packshot com gotas e sombra de gelo | 70 a 85 mm | Empurrão 2% | 60 a 90 | Compra |

### Técnicas específicas com receita

#### Condensação em lata ou garrafa

**Na fotografia real:** mistura de água e glicerina em partes iguais num borrifador. A glicerina faz a gota durar horas sem escorrer nem evaporar ([Creatively Squared, condensação](https://www.creativelysquared.com/article/how-to-enhance-condensation-for-ice-cold-beverage-photography)). Outra técnica real: spray texturizado e depois névoa de xarope de milho com água 1:1; e gelo de acrílico no lugar de gelo verdadeiro ([Creatively Squared, temperatura](https://www.creativelysquared.com/article/top-ways-to-depict-temperature-in-your-food-and-beverage-photography)). A lição pro 3D: **gota de produção é grande, redonda e parada**, não é a névoa fina de uma lata real.

**No Blender 5.2 (Geometry Nodes):**
1. Distribuir pontos na superfície por Poisson (`Distribute Points on Faces`, `distribute_method = 'POISSON'`) com distância mínima de 1,2 mm e densidade de 60 mil pontos por m² (6 por cm²) numa lata de 66 mm.
2. Instanciar uma icosfera de raio 1 em cada ponto, usando a saída `Rotation` do próprio nó de distribuição (alinha o Z da gota à normal da lata).
3. Escala aleatória de 0,4 a 1,6 mm, com o Z multiplicado por 0,45 (gota achatada na superfície, meia-lente).
4. Material de água: `Transmission Weight` 1, `IOR` 1,33, `Roughness` 0.
5. Duas camadas: uma de microgotas (raio 0,2 a 0,5 mm, densidade 300 mil/m²) e uma de gotas grandes (1 a 3 mm, 5 mil/m²). Três a cinco gotas grandes escorrendo com trilho (curva com perfil) dão vida.
6. Máscara: sem gotas na faixa superior da lata (onde a mão segura) e na área do logo principal, se o logo precisa ficar 100% legível. Use um atributo pintado (vertex group) na entrada `Selection`.
7. Por baixo das gotas, a lata ganha aspereza 0,35 a 0,45 numa camada de "embaçado" (mistura com o metal limpo por ruído). Condensação não é só gota: é a superfície fosca de frio.

Código: `codigo/playbooks/condensacao_gn.py` **[confirmado por sonda no bpy 5.2.2: 1693 gotas instanciadas num cilindro de 66 x 122 mm]**. O método é análogo ao tutorial de Joey Carlino de gotas em lata com Geometry Nodes ([BlenderNation](https://www.blendernation.com/2022/07/07/creating-water-droplets-with-geometry-nodes/)). Asset pronto pra comparação: lata com condensação da Flareworks no BlendKit ([BlendKit](https://www.blendkit.com/asset-gallery-detail/43e43401-b136-4e19-b9be-38509cda0c9b/)) **[licença: modelo gratuito da BlendKit sob a licença própria da plataforma (royalty free); confira na página antes de uso comercial]**.

```python
# trecho de condensacao_gn.py (Blender 5.2)
dist = n.new('GeometryNodeDistributePointsOnFaces'); dist.distribute_method = 'POISSON'
dist.inputs["Distance Min"].default_value = 0.0012
dist.inputs["Density Max"].default_value = 60000
ico = n.new('GeometryNodeMeshIcoSphere'); ico.inputs["Subdivisions"].default_value = 2
rnd = n.new('FunctionNodeRandomValue'); rnd.inputs["Min"].default_value = 0.0004; rnd.inputs["Max"].default_value = 0.0016
inst = n.new('GeometryNodeInstanceOnPoints')
L(dist.outputs["Rotation"], inst.inputs["Rotation"])   # Z da gota = normal da lata
L(comb.outputs[0], inst.inputs["Scale"])               # (r, r, r x 0,45)
```

**Sinal de que deu errado:** gotas como "bolinhas de gude" (sem achatar); gotas iguais e em grade (distribuição aleatória simples, sem Poisson, ou raio único); gotas pretas (bounces de transmissão baixos); lata brilhando limpa entre as gotas (falta o embaçado).

#### Splash de líquido: quatro caminhos

O Mantaflow continua no Blender 5.2.2: o modificador Fluid com domínio `LIQUID`, método `FLIP` ou `APIC`, `flip_ratio` 0,97 e partículas secundárias (spray, espuma, bolhas) **[confirmado por sonda no bpy 5.2.2]**. Mas está em manutenção mínima: a documentação do FLIP Fluids registra que o Mantaflow "não tem desenvolvedor ativo" e que bugs viram "Known Issues" desde 2021 ([FLIP Fluids wiki](https://github.com/rlguy/Blender-FLIP-Fluids/wiki/FLIP-Fluids-Addon-vs-Blender-Mantaflow)); a fonte é de um concorrente comercial, então leia com esse filtro. Em 2020, um desenvolvedor do Mantaflow dizia no fórum do Blender que o projeto seguia ([devtalk](https://devtalk.blender.org/t/is-mantaflow-still-being-developed/15322)). No teste da nuvem, o bake do Mantaflow **falhou** no bpy instalado como módulo (erro interno `'LevelsetGrid' object has no attribute 'setConst'`). O teste no Blender 5.2 completo da máquina de referência fica pendente **[testar no Blender]**.

| Caminho | Realismo | Controle de direção de arte | Custo (RTX 3050) | Quando usar |
|---|---|---|---|---|
| A. Simulação Mantaflow (FLIP) | Alto, com física real | Baixo: a forma sai do jeito que a física quiser | Alto: res 128 a 256, minutos a horas de bake por plano; cache de GBs | Splash único, curto (1 a 2 s), em câmera lenta, que precisa de gotas e espuma reais |
| B. Geometria esculpida e animada | Médio a alto parado; médio em movimento | Total | Baixo no render, alto em horas de modelagem | Coroa de splash congelada, "fita" de líquido estilizada, cosmético |
| C. Asset pronto (VDB/Alembic de splash) | Alto | Médio (escolhe entre opções prontas) | Baixo | Prazo curto; verifique licença comercial |
| D. Meio-termo: pontos + campo de distância (metaballs modernos em Geometry Nodes) | Médio | Alto: você anima os pontos | Baixo a médio | Gotas e respingos estilizados, splash de "cartoon premium", pop candy |
| (E) Complemento pago FLIP Fluids | Alto | Médio | Médio | Quando o Mantaflow falhar e o orçamento permitir ([Superhive](https://superhivemarket.com/products/flipfluids), pago) |

**Receita A (Mantaflow, valores de partida):**
1. Domínio: caixa justa em volta do splash (cada centímetro vazio custa voxels). Escala real em metros.
2. `domain_type = 'LIQUID'`, `resolution_max` 32 pra teste de movimento, 128 a 192 pra prévia, 256 ou mais pro final. O custo cresce aproximadamente com o cubo da resolução.
3. `use_adaptive_timesteps = True` (padrão), `cfl_condition` 2,0 (padrão); baixe pra 1,0 em respingo muito rápido. Segundo o manual, CFL alto reduz o tempo mas perde precisão em velocidade alta ([manual, Domain Settings](https://docs.blender.org/manual/en/latest/physics/fluid/type/domain/settings.html)).
4. `flip_ratio` 0,97 (padrão): perto de 1 é mais energético; abaixo de 0,9 fica mais calmo e viscoso.
5. Fluxo (`FLOW`, `flow_type = 'LIQUID'`, `flow_behavior = 'INFLOW'`) com `use_initial_velocity` e `velocity_coord` de 2 a 3 m/s numa cena de 30 cm. Anime `use_inflow` de ligado pra desligado depois de 9 a 10 q: um pulso, não uma torneira.
6. Produto como efetor (`EFFECTOR`) se ele atravessa o líquido.
7. `cache_type = 'ALL'` pra bake único por script; `use_mesh = True` e `mesh_scale` 2.
8. Partículas secundárias (spray, espuma) só no bake final; elas multiplicam o custo.
9. Renderize em câmera lenta de verdade: `time_scale` do domínio abaixo de 1 (0,25 a 0,5) em vez de esticar os quadros depois.

Código: `codigo/playbooks/splash_mantaflow.py` (nomes confirmados por sonda; bake a testar).

**Receita D (pontos + campo de distância, o "metaball" de 2025):** o Creative Shrimp já ensinava respingo de tinta com partículas, campos de força e metaballs no lugar de simulação de fluido ([Creative Shrimp](https://www.creativeshrimp.com/paint-splash.html)). No 5.2.2 o mesmo princípio fica mais rápido e estável com Geometry Nodes: `Mesh to Points` → `Points to SDF Grid` (raio da gota, tamanho do voxel) → `Grid to Mesh` (limiar) → `Set Shade Smooth` **[confirmado por sonda no bpy 5.2.2: 120 pontos geraram 26 mil vértices]**.
- Raio de 4 a 8 mm em produto de 15 cm; voxel de 1/4 do raio pra superfície lisa, 1/2 pra teste.
- `Threshold` acima de 0 encolhe e separa as gotas; abaixo de 0 engorda e funde.
- Os pontos vêm de onde você quiser: vértices animados por keyframe, partículas, ou uma curva com pontos distribuídos (uma "fita" de gotas).
- Material: o mesmo líquido do produto (`Transmission` 1, `IOR` 1,33, cor da bebida). Em refrigerante escuro, `Transmission` 1, Base Color branca; cor por Volume Absorption na saída Volume (cola #5A1E0E a 120/m; cap 06) e aspereza 0,05 (ver 00 · Padrões da casa).
- Metaball nativo continua existindo (`bpy.data.metaballs`, resolução de viewport 0,4 e de render 0,2 por padrão **[confirmado por sonda]**), mas é mais lento e menos controlável que o SDF.

Código: `codigo/playbooks/splash_sdf_gn.py`.

```python
# trecho de splash_sdf_gn.py (Blender 5.2)
m2p = n.new('GeometryNodeMeshToPoints')
sdf = n.new('GeometryNodePointsToSDFGrid')
sdf.inputs["Radius"].default_value = 0.006      # 6 mm
sdf.inputs["Voxel Size"].default_value = 0.0015 # 1/4 do raio
g2m = n.new('GeometryNodeGridToMesh')
g2m.inputs["Threshold"].default_value = 0.0
```

**Sinal de que deu errado (qualquer caminho):** splash "gelatina" (resolução baixa ou raio grande demais); líquido opaco cinza (falta transmissão ou contraluz); splash que surge do nada (sem fonte de energia: o produto cai, a fruta mergulha, alguma coisa causa o splash); câmera lenta esticada depois (quadros duplicados, movimento travado).

#### Contraluz e bolhas

- **Contraluz:** o mesmo cartão branco emissivo do perfume, atrás do copo ou da garrafa, do tamanho da silhueta. Em cerveja e suco, é o que faz a cor brilhar.
- **Bolhas:** Geometry Nodes com pontos distribuídos no volume do líquido (malha do líquido → `Distribute Points in Volume` ou pontos na base) que sobem com `Set Position` usando o tempo da cena; esferas de 0,3 a 1,2 mm, `IOR` 1,0 dentro de líquido de `IOR` 1,33 **[testar no Blender: nome do nó de distribuição em volume no 5.2 e comportamento de IOR 1,0 aninhado]**. Velocidade de subida de 2 a 6 cm/s em câmera normal.
- **Gelo:** cubo com chanfro grande (2 a 3 mm), `Transmission` 1, `IOR` 1,31, `Roughness` 0,05 a 0,15 com ruído, bolhas internas e rachaduras por textura. Gelo perfeito e liso parece acrílico (o que, ironicamente, é o que os fotógrafos usam).

### As armadilhas da categoria

| Armadilha | Sinal visual | Cura |
|---|---|---|
| Gelado sem condensação | Lata seca e brilhante | Condensação em duas camadas + embaçado |
| Condensação de bolinha de gude | Gotas esféricas, iguais | Achatar Z para 0,45, raio aleatório, Poisson |
| Splash sem causa | Líquido explode no nada | Um evento físico (queda, mergulho, abertura) inicia o splash |
| Líquido escuro e opaco | Refrigerante parece petróleo | Contraluz por cartão, bounces 16+ |
| Splash de baixa resolução | Bolhas gigantes, bordas moles | Resolução 192+, ou caminho D com voxel 1/4 do raio |
| Rótulo distorcido | Logo esticado na curva da lata | UV cilíndrica correta, arte do cliente com proporção da planificação |
| Gotas tampando o logo | Marca ilegível | Máscara de condensação na área do logo |
| Gás que não sobe | Bolhas paradas ou caindo | Velocidade de subida positiva, aceleração leve |

### Estrutura pronta de 15 s (450 q)

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 2,0 | 1 a 60 | 100 mm | Deslize 2 cm | Condensação, gota escorre | Corte | Silêncio + gota | (nenhum) |
| 2,0 a 3,0 | 61 a 90 | 100 mm | Push-in 5% | Abertura do lacre | Corte no "tsss" | "Tsss" no q 70 | (nenhum) |
| 3,0 a 6,5 | 91 a 195 | 85 mm | Câmera lenta, órbita 10° | Lata cai num splash da própria bebida | Corte | Impacto + trilha entra | Nome |
| 6,5 a 9,0 | 196 a 270 | 85 mm | Parado | Bebida caindo no copo com gelo, contraluz | Corte | Líquido + gelo | Sabor |
| 9,0 a 11,0 | 271 a 330 | 100 mm | Push-in 4% | Bolhas subindo (macro) | Chicote | Borbulhas | "Zero açúcar" (se verdadeiro) |
| 11,0 a 15,0 | 331 a 450 | 70 mm | Empurrão 2% | Packshot: lata + copo, gotas | (fim) | Logo sonoro | CTA |

### Estrutura pronta de 30 s (900 q)

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 3,0 | 1 a 90 | 50 mm | Truck | Ambiente de calor (luz dura, sombra de persiana) | Corte | Cigarra, calor | (nenhum) |
| 3,0 a 5,5 | 91 a 165 | 100 mm | Deslize | Condensação | Corte | Gota | (nenhum) |
| 5,5 a 7,0 | 166 a 210 | 100 mm | Push-in | Abertura | Corte | "Tsss" no q 180 | (nenhum) |
| 7,0 a 11,0 | 211 a 330 | 85 mm | Câmera lenta | Splash com ingredientes reais | Corte | Impacto + trilha | Nome |
| 11,0 a 14,0 | 331 a 420 | 85 mm | Parado | Gelo cai no copo | Corte | Gelo | (nenhum) |
| 14,0 a 17,0 | 421 a 510 | 85 mm | Empurrão 3% | Serviço no copo com contraluz | Corte | Líquido | Sabor |
| 17,0 a 19,5 | 511 a 585 | 100 mm | Push-in | Bolhas | Corte | Borbulhas | Benefício |
| 19,5 a 23,0 | 586 a 690 | 50 mm | Chicote entre sabores | Três sabores, giro de 45° cada | Chicote 6 q | Três batidas | Sabores |
| 23,0 a 26,0 | 691 a 780 | 50 mm | Parado | Brinde de duas latas | Corte | "Tlim" | Momento |
| 26,0 a 30,0 | 781 a 900 | 70 mm | Empurrão 2% | Packshot | (fim) | Logo sonoro | CTA |

### Mundos visuais

- **Recomendados:** pop candy (refrigerante, energético, sabores), orgânico líquido, estúdio premium (destilados, água premium), luxo escuro (bebida alcoólica premium, café especial), luz natural (suco, chá, café da manhã), neon noturno (energético, bebida de balada), macro cinematográfico.
- **Evitar:** papel e recorte (contradiz líquido), brutalista tech, argila (líquido em argila perde frescor), diorama (afasta a câmera do líquido, que é o herói).

### Referências reais

| Referência | Link | O que aprender |
|---|---|---|
| Coca-Cola, "Masterpiece" (2023) | [Creative Review](https://www.creativereview.co.uk/coca-cola-masterpiece-ad/) e [D&AD](https://www.dandad.org/work/d-ad-awards-archive/coca-cola-masterpiece) | A garrafa passa por pinturas famosas, cada uma no seu estilo, mas a embalagem nunca perde a identidade. Live action, animação e IA a serviço de um único objeto herói (dir. Henry Scholfield, VFX Electric Theatre Collective). |
| Nikita Stepanov, "Beer Can splash" (RealFlow + Cinema 4D) | [Behance](https://www.behance.net/gallery/124603459/Beer-Can-splash-3D-RealFlow-Cinema-4D-CGI) | Splash em torno da lata com condensação **[não aberto: Behance retornou 403; confira o conteúdo]**. |
| CG Cookie, café com Mantaflow | [CG Cookie](https://blog.cgcookie.com/posts/let-s-make-coffee-blender-fluid-sim-mantaflow-tutorial-for-beginners/) | Passo a passo de líquido com Mantaflow em escala de xícara, útil pra testar o caminho A. |

## 7. Comida

**O que vende:** apetite. Calor, crocância, frescor, abundância e "acabou de sair". Comida em CG é das categorias mais difíceis: o olho humano é treinado há milhões de anos pra desconfiar de comida estranha.

### Os planos clássicos

| Plano | Lente | Movimento | Duração (q) | O que vende |
|---|---|---|---|---|
| Vapor subindo em contraluz | 85 a 100 mm | Push-in 4% | 45 a 60 | Quente, fresco |
| Ingredientes caindo e empilhando (montagem do lanche) | 50 a 85 mm | Câmera lenta, parado | 45 a 75 | Abundância, composição |
| Queijo puxando (cheese pull) | 100 mm | Parado | 30 a 45 | Indulgência |
| Corte revelando o interior (faca, garfo) | 85 a 100 mm | Push-in | 30 a 45 | Recheio, textura interna |
| Molho escorrendo / calda caindo | 100 mm | Câmera lenta | 30 a 45 | Suculência |
| Macro de textura (crosta, gergelim, gotas de gordura) | 100 a 135 mm | Deslize 1 cm | 30 a 45 | Crocância, qualidade |
| Top shot da mesa (flat lay) | 35 a 50 mm | Rotação de 10° em Z | 45 a 60 | Variedade, refeição completa |
| Ingrediente fresco com gota de água | 100 mm | Rack focus | 30 a 45 | Frescor, origem |
| Embalagem/entrega chegando | 50 mm | Parado | 30 a 45 | Conveniência (delivery) |
| Mordida ou pedaço faltando | 85 mm | Parado | 20 a 30 | "Alguém não resistiu" |
| Packshot: prato + logo + preço | 70 mm | Empurrão 2% | 60 a 90 | Pedido |

### Técnicas específicas com receita

#### Vapor de comida

**Na fotografia real:** incenso pra fumaça densa, contraluz pra iluminar o vapor, fundo escuro, algodão úmido aquecido no micro-ondas escondido atrás do prato, velocidade mínima de 1/200 pra congelar o vapor, e vapor direcionado pro lado oposto da luz ([Creatively Squared, temperatura](https://www.creativelysquared.com/article/top-ways-to-depict-temperature-in-your-food-and-beverage-photography)). Os princípios valem igual no 3D: **contraluz e fundo escuro**. Vapor iluminado de frente em fundo claro não aparece.

**No Blender 5.2, dois caminhos:**

| Caminho | Como | Custo | Quando |
|---|---|---|---|
| A. Volume procedural (sem simulação) | Cubo acima do prato com Principled Volume; densidade = ruído 4D cortado por rampa x gradiente que some no topo; ruído "sobe" pelo Mapping e muda de forma pelo W | Baixo, sem bake | 90% dos casos: vapor suave de prato, xícara, panela |
| B. Simulação de fumaça (Mantaflow gás) | Domínio `GAS`, fluxo de fumaça na superfície da comida com temperatura baixa | Alto, com bake | Vapor que interage (garfo atravessa, tampa abre) |

**Receita A (valores de partida):**
1. Cubo de 12 x 12 x 24 cm sobre o prato (em escala real).
2. `Density` = 2,0 x (ruído 4D, escala 18, detalhe 4, distorção 0,6, cortado por Color Ramp entre 0,52 e 0,75) x (gradiente em Z de 1 embaixo a 0 em cima).
3. `Anisotropy` 0,6: o volume espalha a luz pra frente, e o vapor brilha quando a luz vem de trás. É a versão física do conselho do fotógrafo.
4. Subida de 3 a 5 cm/s: o Location Z do Mapping desce `0,04 x quadros / 30` (linear) e o W do ruído vai de 0 a 1,5 no plano inteiro.
5. Luz de contraluz a 150° a 170° da câmera, pequena e forte; fundo 2 a 3 stops abaixo do prato.
6. `scene.cycles.volume_bounces` é 0 por padrão no 5.2.2 **[confirmado por sonda]**: espalhamento simples basta pra vapor fino; suba pra 1 ou 2 só se o vapor for denso e parecer "recortado".

Código: `codigo/playbooks/vapor_volume.py` **[confirmado por sonda no bpy 5.2.2: nós e chaves criados]**; o render do vapor fica **[testar no Blender]**. Pro caminho B, o tutorial do Blender Made Easy resume: a simulação de fumaça é simples, o aspecto de vapor vem do material ([Lesterbanks](https://lesterbanks.com/2021/02/how-to-create-steam-with-mantaflow-in-blender/)).

```python
# trecho de vapor_volume.py (Blender 5.2)
vol = N.new('ShaderNodeVolumePrincipled')
vol.inputs["Anisotropy"].default_value = 0.6        # brilha em contraluz
nz = N.new('ShaderNodeTexNoise'); nz.noise_dimensions = '4D'
nz.inputs["Scale"].default_value = 18.0
loc = mp.inputs["Location"]                           # ruído desce = vapor sobe
loc.default_value[2] = 0;  loc.keyframe_insert("default_value", index=2, frame=1)
loc.default_value[2] = -0.04 * 150 / 30; loc.keyframe_insert("default_value", index=2, frame=150)
```

**Sinal de que deu errado:** vapor como neblina uniforme (falta o corte da rampa); vapor que sobe "em bloco" (só deslocamento, sem W mudando); vapor invisível (luz de frente ou fundo claro); vapor com borda reta (o cubo aparecendo: falta o gradiente vertical e um gradiente radial nas laterais).

#### Ingredientes caindo e empilhando

1. Corpos rígidos (`bpy.ops.rigidbody.object_add` existe no 5.2.2 **[confirmado por sonda]**) pra queda natural; ou keyframes à mão pra controle total. Em comercial, o comum é misturar: simula, depois corrige à mão a posição final pra a pilha ficar fotogênica.
2. Ordem: de baixo pra cima, como se monta de verdade (pão, carne, queijo, salada, molho, pão). Atraso de 5 a 8 q entre ingredientes.
3. Cada ingrediente quica pouco: comida não é bola. Amortecimento alto, ou chave de assentamento com 1 ultrapassagem de 1 a 2 mm.
4. Queijo e folhas: corpos macios. Queijo derretendo sobre a carne pode ser cloth com rigidez baixa e massa alta, ou shape key esculpida **[testar no Blender]**.
5. Migalhas e gergelim caem 2 a 4 q depois do impacto do pão: é o detalhe que vende o impacto.

#### Materiais de comida

- Subsurface em quase tudo que é orgânico: pão `Subsurface Weight` 0,1 a 0,2, queijo 0,3 a 0,5, fruta 0,3 a 0,6, carne 0,1 a 0,2 com raio avermelhado.
- Brilho de gordura e frescor: `Coat Weight` 0,3 a 0,6 com `Coat Roughness` 0,1 em carne, legumes grelhados e molho.
- Imperfeição obrigatória: queimado irregular, gergelim fora de grade, folha com borda rasgada, gota de molho fora do lugar.
- Escaneamento (fotogrametria) é o atalho mais realista. A Poly Haven distribui assets em CC0 (uso comercial livre) e tem alguns modelos de alimentos **[não verificado: conferir disponibilidade de cada alimento no site]**.

### As armadilhas da categoria

| Armadilha | Sinal visual | Cura |
|---|---|---|
| Comida de plástico | Superfície lisa, sem subsurface | SSS, coat em áreas úmidas, imperfeição |
| Comida perfeita demais | Gergelim em grade, fatia milimétrica | Aleatoriedade controlada, um defeito por elemento |
| Vapor de neblina | Névoa cinza sem forma | Ruído cortado, contraluz, fundo escuro |
| Luz fria | Comida azulada, triste | Principal de 3200 a 4000 K, contorno quente |
| Câmera longe | Plano aberto do prato na mesa | Comida vende no macro: 100 mm, perto |
| Ingrediente que não está na receita | Folha de manjericão num lanche que não tem | Só ingredientes reais (é também questão de publicidade enganosa) |
| Queda sem peso | Ingredientes flutuam devagar | Aceleração da gravidade; câmera lenta só depois do impacto |
| Cor saturada demais | Tomate fluorescente | AgX com look Medium High Contrast, não Punchy, em comida |

### Estrutura pronta de 15 s (450 q)

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 2,5 | 1 a 75 | 100 mm | Push-in 4% | Vapor subindo em contraluz | Corte | Chiado de chapa | (nenhum) |
| 2,5 a 6,0 | 76 a 180 | 85 mm | Parado, câmera lenta parcial | Ingredientes caem e empilham | Corte | Impactos na batida | Nome do prato |
| 6,0 a 8,5 | 181 a 255 | 100 mm | Parado | Queijo puxando / molho escorrendo | Corte | Som tátil | Destaque |
| 8,5 a 10,5 | 256 a 315 | 135 mm | Deslize 1 cm | Macro da crosta | Corte | Crocante | (nenhum) |
| 10,5 a 15,0 | 316 a 450 | 70 mm | Empurrão 2% | Packshot com logo e preço | (fim) | Logo sonoro | CTA: "Peça no app" + preço |

### Estrutura pronta de 30 s (900 q)

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 3,0 | 1 a 90 | 100 mm | Rack focus | Ingrediente fresco com gota | Corte | Ambiente de cozinha | (nenhum) |
| 3,0 a 6,0 | 91 a 180 | 85 mm | Push-in | Grelha/chapa, vapor | Corte | Chiado | (nenhum) |
| 6,0 a 10,5 | 181 a 315 | 85 mm | Parado | Montagem em queda | Corte | Impactos na batida | Nome |
| 10,5 a 13,5 | 316 a 405 | 100 mm | Push-in | Corte revelando interior | Corte | Faca | Recheio |
| 13,5 a 16,5 | 406 a 495 | 100 mm | Parado | Queijo puxando | Corte | Tátil | (nenhum) |
| 16,5 a 19,5 | 496 a 585 | 135 mm | Deslize | Macro de textura | Corte | Crocante | Diferencial |
| 19,5 a 23,0 | 586 a 690 | 50 mm | Rotação 10° | Top shot da refeição completa | Corte | Batida | Combo |
| 23,0 a 26,0 | 691 a 780 | 50 mm | Parado | Embalagem de entrega chega | Corte | Campainha | "Chega quentinho" |
| 26,0 a 30,0 | 781 a 900 | 70 mm | Empurrão 2% | Packshot | (fim) | Logo sonoro | CTA |

### Mundos visuais

- **Recomendados:** macro cinematográfico, luxo escuro (hambúrguer artesanal, chocolate, carne), luz natural (padaria, café da manhã, saudável), pop candy (doces, sorvete, fast food jovem), editorial de revista (restaurante autoral).
- **Evitar:** vidro e cromo (comida em superfície fria perde apetite), holográfico, brutalista tech, neon noturno (exceto delivery noturno, e com a comida iluminada em luz quente), argila (comida de argila é brinquedo, a menos que seja o conceito).

### Referências reais

| Referência | Link | O que aprender |
|---|---|---|
| Burger King, "Moldy Whopper" (2020) | [Creative Review](https://www.creativereview.co.uk/burger-king-mould-ad/) | O oposto do apetite como prova de verdade: time-lapse de 34 dias ([Green Matters](https://www.greenmatters.com/pn/burger-kings-ad-showed-its-whopper-turning-moldy-after-34-days-and-its-marketing-genius)) em fundo preto, luz de packshot impecável e uma frase final. A luz e o fundo seguem a gramática do food film mesmo com o conteúdo invertido. |
| Deepa Mistry Godiawala, "CGI Video for a Food Brand" | [Behance](https://www.behance.net/gallery/187950157/CGI-Video-for-a-Food-Brand) | Exemplo de comida em CG pra marca **[não aberto: confira o conteúdo antes de citar ao cliente]**. |

## 8. Moda e calçado

**O que vende:** atitude, caimento, material e exclusividade. Roupa vende movimento e toque; calçado vende engenharia e estilo ao mesmo tempo (é o "eletrônico" da moda).

### Os planos clássicos

| Plano | Lente | Movimento | Duração (q) | O que vende |
|---|---|---|---|---|
| Tecido caindo e revelando o produto | 50 a 85 mm | Parado | 45 a 75 | Revelação, toque, luxo |
| Peça flutuando "vestida por ninguém" (corpo invisível) | 50 mm | Órbita 20° | 60 a 90 | Caimento, forma |
| Macro de trama, costura, couro | 100 mm | Deslize 1 cm | 45 a 60 | Qualidade, artesania |
| Calçado em giro parcial no pedestal | 70 a 85 mm | Parado | 60 a 90 | Desenho, silhueta |
| Vista explodida do calçado (cabedal, entressola, solado) | 50 mm | Recuo 8% | 75 a 105 | Tecnologia, conforto |
| Solado em contraplongée (de baixo) | 35 a 50 mm | Push-in | 30 a 45 | Tração, robustez |
| Cadarço se amarrando sozinho | 85 mm | Parado | 45 a 60 | Detalhe, ritual |
| Tecido ao vento (bandeira, lenço) | 50 mm | Câmera lenta | 45 a 60 | Leveza, movimento |
| Brincadeira de escala (produto gigante na cidade) | 24 a 35 mm | Truck | 60 a 120 | Ícone, impacto, "isso existe?" |
| Variantes de cor em sequência | 50 mm | Corte na batida | 30 por cor | Escolha |
| Packshot em pedestal com sombra dura | 70 mm | Empurrão 2% | 60 a 90 | Desejo |

### Técnicas específicas com receita

#### Tecido caindo (cloth) sobre o produto

Receita testada no bpy 5.2.2 **[confirmado por sonda: o pano de 60 x 60 cm caiu e assentou sobre um cilindro de 15 cm em 30 quadros]**:

1. **Pano:** grade de 0,6 x 0,6 m com 64 x 64 divisões (prévia com 24 x 24), a 35 cm de altura. Subdivisão (Subsurface) **depois** do modificador Cloth, nível 1 na viewport e 2 no render.
2. **Qualidade:** `quality` 10 a 15 passos por quadro (padrão 5). Com 5, o pano atravessa produto fino.
3. **Colisão do pano:** `collision_quality` 4 (padrão 2), `distance_min` 2 mm (padrão 15 mm, grosso demais pra produto de 10 cm: o pano "flutua" 1,5 cm acima), autocolisão ligada com 2 mm.
4. **Colisor (produto e chão):** modificador Collision com `thickness_outer` de 5 mm. **Achado do teste:** com 1 mm e qualidade 5 o pano atravessou o chão e caiu 1,7 m; com 5 mm e qualidade 10 pousou certo (z mínimo 7 mm, topo sobre o produto).
5. **Tecidos (valores de partida):**

| Tecido | mass | tension / compression | shear | bending | Leitura |
|---|---|---|---|---|---|
| Seda | 0,15 | 5 | 5 | 0,05 | Escorre, muitas dobras finas |
| Algodão (padrão do 5.2.2) | 0,30 | 15 | 5 | 0,5 | Neutro |
| Veludo | 0,45 | 20 | 15 | 2,0 | Dobras largas, pesadas |
| Couro | 0,60 | 80 | 80 | 150 | Dobra pouco, quebra em vincos |

Valores-padrão confirmados por sonda: `quality` 5, `mass` 0,3, `air_damping` 1, `tension_stiffness` 15, `shear_stiffness` 5, `bending_stiffness` 0,5; colisão `collision_quality` 2 e `distance_min` 0,015. Os valores por tecido são de partida **[testar no Blender]**; o manual descreve os parâmetros e traz predefinições prontas no painel ([manual, Cloth Settings](https://docs.blender.org/manual/en/latest/physics/cloth/settings/index.html)).

6. **Revelação (o pano sai do produto):** em vez de simular o pano saindo (difícil de controlar), simule o pano **caindo sobre** o produto e toque o cache **ao contrário** (o pano "levanta" e revela). Ou prenda um canto (grupo de vértices em `vertex_group_mass`, o "pin") e anime um vazio puxando esse canto.
7. **Material do tecido:** `Sheen Weight` 0,3 (algodão) a 1,0 (veludo), `Sheen Roughness` 0,3 a 0,5, aspereza 0,6 a 0,8, mapa de normal da trama. Seda: aspereza 0,25 a 0,35 com `Anisotropic` 0,5. Sem sheen, tecido vira borracha.

Código: `codigo/playbooks/tecido_cloth.py`.

```python
# trecho de tecido_cloth.py (Blender 5.2)
s.quality = 10
s.mass = 0.15; s.tension_stiffness = s.compression_stiffness = 5
s.shear_stiffness = 5; s.bending_stiffness = 0.05            # seda
cs.collision_quality = 4; cs.distance_min = 0.002
cs.use_self_collision = True; cs.self_distance_min = 0.002
ob.collision.thickness_outer = 0.005   # 1 mm atravessou no teste
```

**Sinal de que deu errado:** pano atravessando (qualidade e espessura); pano flutuando acima do produto (distance_min padrão de 15 mm); dobras "de papel alumínio" (resolução baixa, sem subdivisão); pano que nunca para de tremer (amortecimento baixo: suba `air_damping` pra 2 a 5 no fim).

#### Calçado: explodida e macro

- Explodida em Z (de cima pra baixo): cadarço e palmilha sobem, cabedal sobe menos, entressola desce, solado desce mais. 5 a 7 camadas, cascata de 4 q, 18 q por peça.
- Couro: aspereza 0,35 a 0,6 com variação por ruído, mapa de poros, `Coat Weight` 0,2 em couro envernizado. Malha (knit): mapa de normal da trama + `Sheen` 0,5. Borracha do solado: aspereza 0,7, subsurface 0,05.
- Costura: curva com `bevel_depth` 0,4 a 0,6 mm instanciada ao longo da borda (ou textura de normal), sempre com leve variação de tensão.
- O estúdio Man vs Machine fez da simulação de tecido o centro do filme do Nike Flyknit (o calçado formado por "penas" digitais), citado pela School of Motion como aula de cloth ([School of Motion](https://schoolofmotion.com/blog/motion-design-inspiration-shoe-advertising)).

#### Brincadeira de escala

O vídeo de 8 s da Jacquemus com bolsas Bambino gigantes circulando por Paris como carros foi feito em CGI por Ian Padgham; segundo ele, metade de quem vê acha que é real ou não sabe dizer, e é isso que gera engajamento ([Paper](https://www.papermag.com/jacquemus-purse-cars)). Receita: filmagem real (ou HDRI e fotos do lugar) + produto em 3D com a mesma luz (sol na mesma direção, mesma temperatura), sombra de contato no chão, borrão de movimento e granulação iguais aos da filmagem. O realismo vem da integração, não do produto.

### As armadilhas da categoria

| Armadilha | Sinal visual | Cura |
|---|---|---|
| Tecido de borracha | Brilho especular uniforme, dobras grossas | Sheen, normal de trama, subdivisão 2 |
| Pano atravessando | Produto aparece através do tecido | `quality` 10+, `thickness_outer` 5 mm, `distance_min` 2 mm |
| Roupa "pendurada no nada" | Peça flutuante sem volume interno | Corpo invisível (manequim escondido) dando a forma |
| Couro de plástico | Superfície lisa e uniforme | Poros, variação de aspereza, vincos |
| Escala sem integração | Produto gigante "colado" no vídeo | Mesma luz, sombra de contato, grão e borrão iguais |
| Cores fora da coleção | Tom do 3D diferente da peça real | Cor medida da foto do produto em luz neutra, conferida no AgX |
| Modelo humano em CG | Pessoa digital no estranho vale | Corpo invisível ou filmagem real |
| Giro de vitrine | Tênis girando 360° no centro o filme todo | Giro parcial, macros e explodida intercalados |

### Estrutura pronta de 15 s (450 q)

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 3,0 | 1 a 90 | 85 mm | Parado | Tecido cai e revela o produto (cache invertido) | Corte | Sopro de tecido | (nenhum) |
| 3,0 a 6,0 | 91 a 180 | 70 mm | Parado | Giro de 60° no pedestal (20 °/s) | Corte | Batida 1 | Nome |
| 6,0 a 9,0 | 181 a 270 | 50 mm | Recuo 8% | Explodida do calçado | Corte | Cliques | Tecnologia |
| 9,0 a 11,0 | 271 a 330 | 100 mm | Deslize | Macro da trama/couro | Corte | Tátil | Material |
| 11,0 a 15,0 | 331 a 450 | 70 mm | Empurrão 2% | Packshot com sombra dura | (fim) | Logo sonoro | CTA |

### Estrutura pronta de 30 s (900 q)

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 4,0 | 1 a 120 | 35 mm | Truck | Brincadeira de escala: produto gigante na rua | Corte | Cidade | (nenhum) |
| 4,0 a 7,0 | 121 a 210 | 85 mm | Parado | Tecido revela | Corte | Tecido | Nome |
| 7,0 a 10,0 | 211 a 300 | 70 mm | Parado | Giro parcial | Corte | Batida | Promessa |
| 10,0 a 14,0 | 301 a 420 | 50 mm | Recuo | Explodida | Corte | Cliques | 2 rótulos |
| 14,0 a 17,0 | 421 a 510 | 100 mm | Deslize | Macro | Corte | Tátil | Material |
| 17,0 a 20,0 | 511 a 600 | 50 mm | Push-in | Solado de baixo | Corte | Impacto | Tração |
| 20,0 a 23,0 | 601 a 690 | 85 mm | Parado | Cadarço se amarra | Corte | Atrito | (nenhum) |
| 23,0 a 26,0 | 691 a 780 | 50 mm | Cortes na batida | 3 cores, 30 q cada | Corte seco | 3 batidas | "3 cores" |
| 26,0 a 30,0 | 781 a 900 | 70 mm | Empurrão 2% | Packshot | (fim) | Logo sonoro | CTA |

### Mundos visuais

- **Recomendados:** editorial de revista, tátil têxtil, luz natural, estúdio premium, brutalista tech (tênis de performance), pop candy (moda jovem, sneaker colorido), luxo escuro (couro, bolsa de luxo).
- **Evitar:** holográfico (só em coleção específica), vidro e cromo (rouba a cena do tecido), diorama isométrico (afasta o material).

### Referências reais

| Referência | Link | O que aprender |
|---|---|---|
| Jacquemus, bolsas gigantes em Paris (Ian Padgham) | [Paper](https://www.papermag.com/jacquemus-purse-cars) | Escala como ideia; integração perfeita com o real; 8 s bastam. |
| Man vs Machine, Nike Flyknit e Air Max 2017 | [School of Motion](https://schoolofmotion.com/blog/motion-design-inspiration-shoe-advertising) | Simulação de tecido e dinâmica como a própria ideia do filme, não como enfeite. |
| Nike, outdoor 3D do Air Max Day | [Creative Bloq](https://www.creativebloq.com/news/nike-air-max-day-3d-billboard) | Calçado como objeto escultural em tela gigante: escala e ilusão de profundidade. |

## 9. Embalagem

**O que vende:** a marca na prateleira, o ritual de abrir, o cuidado. Embalagem é o produto mais visto do mundo: o filme precisa fazer a pessoa reconhecer a caixa no mercado.

### Os planos clássicos

| Plano | Lente | Movimento | Duração (q) | O que vende |
|---|---|---|---|---|
| Planificação dobrando até virar caixa | 50 mm | Órbita 20° | 60 a 90 | Design, cuidado, "feito pra você" |
| Tampa subindo devagar (unboxing) | 85 mm | Push-in 5% | 45 a 75 | Expectativa, premium |
| Produto saindo da caixa | 50 a 85 mm | Parado | 30 a 45 | Revelação |
| Macro de acabamento (relevo, hot stamping, verniz localizado) | 100 mm | Luz rasante se move | 45 a 60 | Qualidade gráfica |
| Lineup na prateleira (família de produtos) | 35 a 50 mm | Truck | 60 a 90 | Linha, reconhecimento |
| Caixa girando 90° pra mostrar lateral com informação | 70 mm | Parado | 45 a 60 | Transparência, informação |
| Abertura de lacre, fita, selo | 100 mm | Parado | 30 a 45 | Segurança, novidade |
| Caixa em contexto (mesa, porta de casa, delivery) | 35 mm | Truck lento | 45 a 75 | Uso real, chegada |
| Sustentabilidade: material reciclável em macro | 100 mm | Deslize | 30 a 45 | Responsabilidade |
| Pilha de caixas se montando | 50 mm | Parado | 45 a 60 | Volume, sucesso |
| Packshot: caixa 3/4 + produto ao lado | 70 mm | Empurrão 2% | 60 a 90 | Compra |

### Técnicas específicas com receita

#### Planificação dobrando (dieline)

1. Importe a faca (dieline) do cliente em SVG (vincos e cortes em camadas separadas) ou desenhe a planificação com as medidas do arquivo de produção.
2. Cada painel é um objeto separado. A hierarquia de parentesco segue a dobra: a base é a raiz, as laterais são filhas da base, as abas são filhas das laterais. A origem de cada painel fica exatamente no vinco (a dobradiça).
3. Anime a rotação local de cada painel, 90° em 15 a 20 q, em cascata de 4 a 6 q: base parada, laterais sobem juntas, abas fecham por último. Bezier com assentamento suave.
4. Espessura real: cartão dobrável (cartucho) de 0,4 a 0,6 mm; papelão ondulado de 1,5 a 3 mm, com a onda visível no corte **[não verificado: valores típicos de mercado; confirme com a gráfica do cliente]**. Modificador Solidify com a espessura, e chanfro 0,3 mm em papel cartão (ver 00 · Padrões da casa).
5. Material: papel `Roughness` 0,6 a 0,8; cor de impressão um pouco menos saturada que a tela (impressão CMYK não tem o neon do RGB); `Sheen Weight` 0,1 a 0,2 pras fibras; acabamento laminado brilhante com `Coat Weight` 0,5 e `Coat Roughness` 0,05.
6. Atalho: o asset pago "Rigged Dieline for Box Packaging" da Superhive traz planificação com rig e ações de fechar e rolar, texturas 4096 px e licença royalty free, US$ 20 ([Superhive](https://superhivemarket.com/products/rigged-packaging)).

**Sinal de que deu errado:** painéis atravessando uns aos outros (ordem da cascata ou origem fora do vinco); caixa sem espessura (papel de 0 mm não pega luz na borda); arte esticada nas abas (UV fora da planificação real).

#### Unboxing: a tampa que "suspira"

A tampa de caixa premium sai devagar por causa do ar: é o ritual que as marcas de eletrônico tornaram famoso. Receita: tampa sobe 3 mm em 12 q (muito lento, curva de saída longa), segura 4 q, depois sobe 40 mm em 18 q com aceleração. Um brilho rasante corre na borda interna da caixa enquanto a tampa sobe. Som de ar suave sincronizado com os primeiros 12 q.

#### Acabamentos gráficos no macro

| Acabamento | Receita (Principled BSDF) | Luz que revela |
|---|---|---|
| Hot stamping (metalizado) | Máscara da arte: `Metallic` 1, `Roughness` 0,15 a 0,25, cor ouro ou prata | Faixa de luz em movimento, reflexo correndo |
| Relevo seco | Mesma cor do papel; mapa de altura da arte com 0,2 a 0,4 mm | Luz rasante a 10° a 15° |
| Verniz localizado | Máscara: `Coat Weight` 1, `Coat Roughness` 0,03 sobre papel fosco | Reflexo de área grande passando |
| Soft touch | `Roughness` 0,85, `Sheen Weight` 0,3 | Luz difusa lateral |

### As armadilhas da categoria

| Armadilha | Sinal visual | Cura |
|---|---|---|
| Caixa sem espessura | Bordas de papel invisíveis | Solidify 0,4 a 3 mm + chanfro 0,3 mm |
| Cor de tela | Embalagem com cor fluorescente que não existe impressa | Saturação moderada; compare com foto da caixa real |
| Arte esticada | Texto deformado nas laterais | UV pela planificação real, arte do arquivo de produção |
| Papel de plástico | Brilho especular uniforme | Aspereza 0,6 a 0,8, sheen leve, fibras |
| Unboxing apressado | Tampa sai num pulo | Primeiros 12 q lentos, depois aceleração |
| Caixa nova demais | Cantos perfeitos, sem vinco | Leve arredondamento nos vincos, microdeformação |
| Logo pequeno no packshot | Marca ilegível na miniatura | Face principal da caixa voltada pra câmera, 3/4 de no máximo 30° |
| Lineup em fila reta | Prateleira chapada | Fileira em diagonal, alturas variadas, lente 35 a 50 mm |

### Estrutura pronta de 15 s (450 q)

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 3,5 | 1 a 105 | 50 mm | Órbita 20° | Planificação dobra e vira caixa | Corte | Dobras de papel na batida | (nenhum) |
| 3,5 a 6,0 | 106 a 180 | 100 mm | Luz rasante se move | Macro do acabamento | Corte | Brilho | Nome |
| 6,0 a 9,5 | 181 a 285 | 85 mm | Push-in 5% | Tampa "suspira" e sobe | Corte | Ar | (nenhum) |
| 9,5 a 11,5 | 286 a 345 | 85 mm | Parado | Produto sai da caixa | Corte | Batida | Benefício |
| 11,5 a 15,0 | 346 a 450 | 70 mm | Empurrão 2% | Packshot: caixa + produto | (fim) | Logo sonoro | CTA |

### Estrutura pronta de 30 s (900 q)

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 3,0 | 1 a 90 | 35 mm | Truck lento | Caixa chega à porta/mesa (contexto) | Corte | Campainha | (nenhum) |
| 3,0 a 6,5 | 91 a 195 | 100 mm | Parado | Abertura do lacre | Corte | Fita rasgando | (nenhum) |
| 6,5 a 10,0 | 196 a 300 | 85 mm | Push-in | Tampa sobe | Corte | Ar | Nome |
| 10,0 a 13,0 | 301 a 390 | 85 mm | Parado | Produto sai | Corte | Batida | Promessa |
| 13,0 a 16,5 | 391 a 495 | 50 mm | Órbita 20° | Flashback: planificação dobrando | Corte | Dobras | "Feito com cuidado" |
| 16,5 a 19,5 | 496 a 585 | 100 mm | Luz move | Macro de acabamento | Corte | Brilho | (nenhum) |
| 19,5 a 22,5 | 586 a 675 | 100 mm | Deslize | Macro do material reciclável | Corte | Tátil | "100% reciclável" (se verdadeiro) |
| 22,5 a 26,0 | 676 a 780 | 35 mm | Truck | Lineup da família | Corte | Batidas | Linha |
| 26,0 a 30,0 | 781 a 900 | 70 mm | Empurrão 2% | Packshot | (fim) | Logo sonoro | CTA |

### Mundos visuais

- **Recomendados:** papel e recorte (o mundo natural da embalagem), estúdio premium, luz natural, pop candy (doces, cosmético jovem), editorial de revista, tátil têxtil (embalagem de luxo com tecido e veludo), luxo escuro (caixa preta com hot stamping).
- **Evitar:** holográfico (só com acabamento holográfico real), neon noturno (cor de impressão some), brutalista tech fora de eletrônico, orgânico líquido (sem relação).

### Referências reais

| Referência | Link | O que aprender |
|---|---|---|
| Coca-Cola, "Masterpiece" (2023) | [Creative Review](https://www.creativereview.co.uk/coca-cola-masterpiece-ad/) | A garrafa é a embalagem e a marca ao mesmo tempo; o filme inteiro é o objeto passando de mão em mão. Silhueta reconhecível vale mais que qualquer texto. |
| Superhive, "Rigged Dieline for Box Packaging" | [Superhive](https://superhivemarket.com/products/rigged-packaging) | Como se organiza uma planificação com rig de dobra (painéis, ações de fechar), útil pra estudar antes de montar a sua. |
| KeyShot, animação de vista explodida | [KeyShot](https://www.keyshot.com/blog/creating-an-exploded-view-animation-with-keyshot/) | Organização por peças nomeadas e prévia em baixa resolução: vale igual pra dobra de caixa. |

## 10. Revelação de logo e assinatura

**O que vende:** memória. A revelação de logo (logo reveal) é o carimbo do fim de todo filme e, sozinha, vira vinheta de abertura, de vídeo do YouTube, de apresentação. Assinatura é o logo mais a frase da marca (tagline) e o contato.

### Os planos clássicos (estilos de revelação)

| Estilo | Lente | Movimento | Duração (q) | O que vende |
|---|---|---|---|---|
| Faixa de luz varrendo o logo extrudado | 50 a 85 mm | Empurrão 3% | 45 a 75 | Premium, solidez |
| Montagem: partes do logo se encaixam | 50 mm | Recuo 5% | 45 a 60 | Construção, engenharia |
| Revelação por sombra (o logo aparece na sombra de um objeto) | 35 a 50 mm | Parado; luz se move | 60 a 90 | Inteligência, surpresa |
| Câmera atravessa um elemento e o logo está atrás | 35 mm | Dolly rápido | 30 a 45 | Energia, transição |
| Material que muda (vidro vira metal, argila vira cromo) | 85 mm | Órbita 15° | 45 a 60 | Transformação |
| Traço desenhando o logo (assinatura escrita) | 50 mm | Parado | 45 a 75 | Autoria, pessoalidade |
| Logo surge do produto (tampa, tela, embalagem) | 50 a 85 mm | Push-in | 30 a 45 | Ligação produto-marca |
| Explosão em feixes (estilo vinheta de streaming) | 35 mm | Push-in forte | 60 a 120 | Ecossistema, universo |
| Tipografia cinética: tagline palavra por palavra | 50 mm | Parado | 45 a 75 | Mensagem |
| Assinatura completa: logo + tagline + contato | 50 a 70 mm | Empurrão 2% | 60 a 90 | Ação |

### Técnicas específicas com receita

#### Do SVG ao logo 3D com chanfro

Testado no bpy 5.2.2 **[confirmado por sonda: logo de 200 mm de largura, 14,4 mm de espessura total]**:

1. Arquivo: SVG com texto em contorno e traços convertidos em forma (o importador ignora preenchimento, stroke, texto e imagem; [manual 5.x](https://docs.blender.org/manual/en/dev/files/import_export/svg_curve.html)).
2. `bpy.ops.import_curve.svg(filepath=...)`, juntar as curvas num objeto.
3. Normalizar o tamanho escalando **os pontos da curva**, não o objeto. **Achado do teste:** no objeto de curva unido, `transform_apply(scale=True)` não aplicou a escala, e a extrusão e o chanfro saíram multiplicados pelo fator (espessura de 57 mm em vez de 14 mm). Escalar `co`, `handle_left` e `handle_right` de cada ponto resolveu.
4. A curva fica em `dimensions = '2D'` com `fill_mode = 'BOTH'` (preenche o miolo das letras certo). Pra mexer na origem, troque pra `'3D'` antes e volte pra `'2D'` depois: o Blender recusa mover a origem de curva 2D ("Rotation/Location cannot apply to a 2D curve").
5. `extrude` = metade da espessura (vale pra cada lado): 6 mm dá 12 mm total num logo de 20 cm. `bevel_depth` de 5 a 10% da espessura total do logo (1 a 1,2 mm num logo de 12 mm) (ver 00 · Padrões da casa), com `bevel_resolution` 3: sem chanfro, o logo parece recorte de papel; é a quina que pega a faixa de luz.
6. Material: o da marca. Metal escovado (`Metallic` 1, `Roughness` 0,25, `Anisotropic` 0,4), vidro (contraluz e bandeiras pretas, como no perfume), ou cor sólida com face frontal fosca (0,5) e chanfro brilhante (0,15) via material por face.

Código: `codigo/playbooks/logo_svg.py`.

```python
# trecho de logo_svg.py (Blender 5.2)
bpy.ops.import_curve.svg(filepath=caminho)
# ... juntar, centralizar (com dimensions='3D' temporário) ...
f = largura_m / logo.dimensions.x
for sp in logo.data.splines:                 # escala nos pontos, não no objeto
    for b in sp.bezier_points:
        b.co *= f; b.handle_left *= f; b.handle_right *= f
cu = logo.data
cu.dimensions = '2D'; cu.fill_mode = 'BOTH'
cu.extrude = espessura_m / 2                 # cada lado
cu.bevel_depth = 0.0012; cu.bevel_resolution = 3
```

#### Tempo da revelação

| Fase | Quadros | O que acontece |
|---|---|---|
| Pré-movimento | 6 a 12 | Algo se move antes do logo: luz começa a andar, um elemento recua. É o "respiro" antes da batida. |
| Revelação | 18 a 30 | O logo aparece por inteiro. No script `revelar()`: sobe 8 mm, gira de 18° a 0°, escala de 0,92 a 1,0, Bezier `AUTO_CLAMPED` (assenta sem ultrapassar). |
| Impacto | 1 | Quadro exato do logo sonoro. Opcional: brilho de 2 a 4 q correndo na quina. |
| Tagline | Entra 8 a 12 q depois do impacto, 12 a 18 q de animação | Palavra por palavra (3 a 4 q de atraso) ou linha inteira com máscara. |
| Segurar | 45 a 75 | Logo e tagline parados (com empurrão de 2%). Menos de 45 q, ninguém lê (ver 00 · Padrões da casa). |
| Total | 3 a 6 s (90 a 180 q) | Vinheta de abertura: 3 a 4 s. Fechamento de comercial: 4 a 6 s. |

**Som:** o logo sonoro é metade da revelação. A Netflix manteve o "tudum" quando trocou a animação do logo em 2019 (o "N" que explode em feixes de luz coloridos, ligado ao conceito do "espectro de histórias") ([Variety](https://variety.com/2019/digital/news/netflix-new-logo-animation-exploding-colors-1203125961/)); a história do som está no episódio do Twenty Thousand Hertz ([20k](https://www.20k.org/episodes/netflix)). Regra: o impacto visual e o impacto sonoro caem no mesmo quadro, e o som termina (com cauda) junto com o fim do segurar.

#### Assinatura escrita (traço)

Pra logo manuscrito ou assinatura pessoal: importe o SVG como Grease Pencil (`bpy.ops.wm.grease_pencil_import_svg`, **[confirmado por sonda no bpy 5.2.2]**) e anime a construção do traço (modificador de construção do Grease Pencil, "Build") **[testar no Blender: nome do modificador Build no Grease Pencil v3 do 5.2]**. Alternativa sem Grease Pencil: a curva importada como `import_curve.svg` com `bevel_depth` e `bevel_factor_end` animado de 0 a 1 (o traço "cresce" ao longo da curva). Velocidade: 15 a 25 q por palavra manuscrita.

### As armadilhas da categoria

| Armadilha | Sinal visual | Cura |
|---|---|---|
| Logo deformado | Proporção esticada, fonte trocada | Sempre do SVG oficial; escala uniforme |
| Logo sem quina | Recorte chapado, sem brilho | `bevel_depth` de 5 a 10% da espessura total |
| Partículas genéricas | Explosão de faíscas azuis antes do logo | A revelação nasce de algo da marca (forma, produto, cor) |
| Revelação longa demais | 8 s de efeito antes de ver o logo | Logo inteiro visível até o q 45 na maioria dos casos |
| Segurar curto | Corte 1 s depois do logo | 45 a 75 q parado |
| Logo sonoro fora do quadro | Batida antes ou depois da imagem | Impacto visual e sonoro no mesmo quadro |
| Mundo visual trocado | Revelação neon numa marca clássica | Mundo coerente com o resto do filme |
| Tagline competindo | Logo e frase do mesmo tamanho, juntos | Frase com 30% a 40% da altura do logo, entrando depois |

### Estrutura pronta de 15 s (450 q): vinheta de marca

Pra vinheta que é só marca (institucional curto, abertura de canal):

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 3,0 | 1 a 90 | 85 mm | Empurrão 3% | Escuro; uma faixa de luz começa a revelar uma quina | Corte | Grave subindo | (nenhum) |
| 3,0 a 6,0 | 91 a 180 | 35 mm | Dolly rápido | Câmera atravessa elemento de forma da marca | Passagem | Sopro | (nenhum) |
| 6,0 a 9,0 | 181 a 270 | 50 mm | Recuo 5% | Partes do logo se encaixam (cascata 4 q) | Corte | Cliques | (nenhum) |
| 9,0 a 11,0 | 271 a 330 | 50 mm | Empurrão 2% | Logo completo; faixa de luz na quina | (contínuo) | Logo sonoro no q 271 | (nenhum) |
| 11,0 a 15,0 | 331 a 450 | 50 mm | Empurrão 2% | Tagline entra (q 341), contato (q 371), segura | (fim) | Cauda do som | Tagline + site/@ |

### Estrutura pronta de 30 s (900 q): manifesto de marca

| Seg | Quadros | Lente | Movimento | Ação | Transição | Som | Texto na tela |
|---|---|---|---|---|---|---|---|
| 0,0 a 4,0 | 1 a 120 | 35 mm | Truck | Abertura: o mundo visual da marca (material, cor, forma) em macro | Corte | Trilha começa | Frase 1 do manifesto |
| 4,0 a 8,0 | 121 a 240 | 85 mm | Deslize | Objeto ou produto da marca em macro | Corte | Batida | Frase 2 |
| 8,0 a 12,0 | 241 a 360 | 50 mm | Órbita 15° | O mesmo elemento em outro contexto (uso real) | Corte | Batida | Frase 3 |
| 12,0 a 16,0 | 361 a 480 | 50 mm | Recuo | Elementos começam a se organizar na forma do logo | Corte | Subida | (nenhum) |
| 16,0 a 20,0 | 481 a 600 | 85 mm | Empurrão 3% | Material muda (argila → metal, papel → vidro) | Dissolve 10 q | Transição sonora | Frase 4 |
| 20,0 a 24,0 | 601 a 720 | 50 mm | Recuo 5% | Encaixe final do logo; impacto no q 690 | Corte | Logo sonoro no q 690 | (nenhum) |
| 24,0 a 30,0 | 721 a 900 | 50 a 70 mm | Empurrão 2% | Assinatura: logo + tagline (q 702) + contato (q 735), segura | (fim) | Cauda | Tagline + contato |

### Mundos visuais

- **Recomendados:** todos podem servir, desde que seja **o mesmo mundo do filme ou da identidade da marca**. Os mais versáteis: estúdio premium, luxo escuro, vidro e cromo, argila (marca humana e leve), papel e recorte (educação, serviços), holográfico (tecnologia), retrofuturo (marcas com herança).
- **Evitar:** trocar de mundo só na revelação (o fim parece de outro filme); neon e holográfico em marcas de tradição; pop candy em marcas de saúde e direito.

### Referências reais

| Referência | Link | O que aprender |
|---|---|---|
| Netflix, animação do logo dos Originais (2019) | [Variety](https://variety.com/2019/digital/news/netflix-new-logo-animation-exploding-colors-1203125961/) | Revelação com conceito (espectro de histórias), fundo escuro de cinema e logo sonoro preservado. |
| Twenty Thousand Hertz, "Tudum" | [20k.org](https://www.20k.org/episodes/netflix) | Como um logo sonoro curto vira memória de marca; sincronismo com a imagem. |
| Coca-Cola, "Masterpiece" (fechamento) | [Creative Review](https://www.creativereview.co.uk/coca-cola-masterpiece-ad/) | Assinatura que fecha a ideia do filme: a garrafa e a marca chegam juntas no último plano. |

## Fontes

**Documentação do Blender e API**
- [Blender 5.2 Manual: Fluid Domain Settings](https://docs.blender.org/manual/en/latest/physics/fluid/type/domain/settings.html) (resolução, CFL, passos de tempo adaptativos; texto lido pelo repositório do manual)
- [Blender Python API: FluidDomainSettings](https://docs.blender.org/api/current/bpy.types.FluidDomainSettings.html)
- [Blender 5.x Manual: Import SVG as Curves](https://docs.blender.org/manual/en/dev/files/import_export/svg_curve.html) e [versão 5.0](https://docs.blender.org/manual/en/5.0/addons/import_export/curve_svg.html)
- [Blender 4.2 Manual: Import Images as Planes](https://docs.blender.org/manual/en/4.2/modeling/meshes/import_images_as_planes.html)
- [Blender 5.2 Manual: Cloth Settings](https://docs.blender.org/manual/en/latest/physics/cloth/settings/index.html)
- [Issue #133275: Importing SVG, parts missing](https://projects.blender.org/blender/blender/issues/133275)
- Sondas próprias no bpy 5.2.2 LTS (nuvem): operadores `import_curve.svg`, `wm.grease_pencil_import_svg`, `image.import_as_mesh_planes`; padrões de Cloth, Collision, Fluid (FLIP/APIC, flip_ratio 0,97, CFL 2,0), Metaball, cáusticas MNEE, filtros de pixel, bounces; nós `GeometryNodePointsToSDFGrid`, `GeometryNodeGridToMesh`, `GeometryNodeDistributePointsOnFaces` (saída Rotation). Renders e testes registrados em `/home/claude/codigo/playbooks/`.

**Simulação e técnicas 3D**
- [FLIP Fluids wiki: FLIP Fluids Addon vs Blender Mantaflow](https://github.com/rlguy/Blender-FLIP-Fluids/wiki/FLIP-Fluids-Addon-vs-Blender-Mantaflow) (fonte comercial concorrente; status do Mantaflow)
- [Blender devtalk: Is Mantaflow still being developed?](https://devtalk.blender.org/t/is-mantaflow-still-being-developed/15322)
- [FLIP Fluids na Superhive](https://superhivemarket.com/products/flipfluids) (complemento pago, licença comercial da loja)
- [CG Cookie: café com Mantaflow](https://blog.cgcookie.com/posts/let-s-make-coffee-blender-fluid-sim-mantaflow-tutorial-for-beginners/)
- [Creative Shrimp: Paint Splash](https://www.creativeshrimp.com/paint-splash.html)
- [BlenderNation: gotas com Geometry Nodes (Joey Carlino)](https://www.blendernation.com/2022/07/07/creating-water-droplets-with-geometry-nodes/)
- [Blendergrid: SVG em Geometry Nodes](https://blendergrid.com/articles/svg-in-geometry-nodes)
- [Lesterbanks: vapor com Mantaflow](https://lesterbanks.com/2021/02/how-to-create-steam-with-mantaflow-in-blender/)
- [BlenderNation: Steaming Coffee Animation Tutorial (2026)](https://www.blendernation.com/2026/05/04/steaming-coffee-animation-tutorial/)
- [KeyShot: Creating an Exploded View Animation](https://www.keyshot.com/blog/creating-an-exploded-view-animation-with-keyshot/)
- [Ortery: 4 Variables to Optimize 360 Product Animations](https://www.ortery.com/4-variables-to-optimize-360-product-animations-for-ecommerce/)
- [80.lv: animação de produto em Blender (Lee Schwartz)](https://80.lv/articles/check-out-this-cool-dynamic-product-animation-made-in-blender)

**Fotografia e styling**
- [Creatively Squared: condensação em bebida (glicerina 1:1)](https://www.creativelysquared.com/article/how-to-enhance-condensation-for-ice-cold-beverage-photography)
- [Creatively Squared: temperatura em comida e bebida (vapor, gelo, condensação)](https://www.creativelysquared.com/article/top-ways-to-depict-temperature-in-your-food-and-beverage-photography)

**Produto, interface e marca**
- [Apple Support: iPhone 16 Pro Tech Specs](https://support.apple.com/en-us/121031) (2622 x 1206 px, 460 ppi, 71,5 mm de largura)
- [Apple Newsroom: Liquid Glass (2025)](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/)
- [Apple Newsroom: AirPods Pro 3](https://www.apple.com/newsroom/2025/09/introducing-airpods-pro-3-the-ultimate-audio-experience/)
- [MacRumors: anúncio do iPhone 17 Pro](https://www.macrumors.com/2025/09/18/apple-iphone-17-pro-ad/)
- [Impractical: análise do Notion 3.0](https://impractical.ai/launch-videos/notion-3) e [do Linear Agent](https://impractical.ai/launch-videos/linear-agent)
- [Stripe Sessions 2025: Product keynote](https://stripe.com/sessions/2025/product-keynote)
- [Nexus Studios: Headspace](https://nexusstudios.com/work/headspace-case-study/)
- [Creative Review: Coca-Cola Masterpiece](https://www.creativereview.co.uk/coca-cola-masterpiece-ad/) e [D&AD](https://www.dandad.org/work/d-ad-awards-archive/coca-cola-masterpiece)
- [Creative Review: Burger King Mouldy Whopper](https://www.creativereview.co.uk/burger-king-mould-ad/) e [Green Matters (34 dias)](https://www.greenmatters.com/pn/burger-kings-ad-showed-its-whopper-turning-moldy-after-34-days-and-its-marketing-genius)
- [LBB Online: Glossier You Impressions](https://lbbonline.com/news/glossier-showcases-fragrance-additions-with-vivid-avant-garde-film)
- [Vimeo: Morphē, Lucy McRae para Aesop](https://vimeo.com/49304150)
- [Paper: Jacquemus, bolsas sobre rodas](https://www.papermag.com/jacquemus-purse-cars)
- [School of Motion: inspiração em publicidade de calçado](https://schoolofmotion.com/blog/motion-design-inspiration-shoe-advertising)
- [Creative Bloq: outdoor 3D Nike Air Max Day](https://www.creativebloq.com/news/nike-air-max-day-3d-billboard)
- [Variety: nova animação do logo Netflix (2019)](https://variety.com/2019/digital/news/netflix-new-logo-animation-exploding-colors-1203125961/)
- [Twenty Thousand Hertz: Netflix "Tudum"](https://www.20k.org/episodes/netflix)

**Vídeos de referência (links encontrados por busca)**
- [Introducing iPhone 17 Pro](https://www.youtube.com/watch?v=IhZRSC9w3Mw) · [Introducing AirPods Pro 3](https://www.youtube.com/watch?v=EMmKs8vMKhU) · [Nothing, Introducing Phone (3a) Series](https://www.youtube.com/watch?v=ZizbGaSnIUE) · [Linear Agent](https://www.youtube.com/watch?v=mRql2VJ99gM) · [Notion 3.0](https://www.youtube.com/watch?v=R1cF4T4lgI4)

**Assets (licença)**
- [Superhive: Rigged Dieline for Box Packaging](https://superhivemarket.com/products/rigged-packaging): pago (US$ 20), royalty free, uso comercial sim.
- [FLIP Fluids](https://superhivemarket.com/products/flipfluids): pago, licença da loja.
- [BlendKit: lata com condensação (Flareworks)](https://www.blendkit.com/asset-gallery-detail/43e43401-b136-4e19-b9be-38509cda0c9b/): gratuito na licença da BlendKit (royalty free) **[confirme na página antes de uso comercial]**.
- Poly Haven: todos os assets em CC0 (uso comercial sim, sem atribuição obrigatória).
- Behance (Belle d'Or, Beer Can splash, CGI Food Brand): só referência visual, nunca reutilize material.

## Pendências para o Claude Code

### PENDÊNCIAS YOUTUBE

| Título | Canal | Link | O que esperava aprender |
|---|---|---|---|
| Creating Water Droplets with Geometry Nodes | Joey Carlino | [youtu.be/g72JfGE7o3E](https://youtu.be/g72JfGE7o3E) | Árvore de nós exata das gotas em lata; comparar com `condensacao_gn.py` |
| How to Create Steam w/ Mantaflow | Blender Made Easy | [youtube.com/watch?v=_K0XsHht6pg](https://www.youtube.com/watch?v=_K0XsHht6pg) | Material de vapor sobre simulação de fumaça (densidade, cor, anisotropia) |
| Steaming Coffee Animation Tutorial | (via BlenderNation 2026) | [youtu.be/8jv2n2RElf4](https://youtu.be/8jv2n2RElf4) | Vapor de café com simulação em versão recente do Blender |
| Introducing iPhone 17 Pro | Apple | [youtube.com/watch?v=IhZRSC9w3Mw](https://www.youtube.com/watch?v=IhZRSC9w3Mw) | Decupagem plano a plano (lente, duração, luz) pra calibrar a tabela do playbook 4 |
| Introducing AirPods Pro 3 | Apple | [youtube.com/watch?v=EMmKs8vMKhU](https://www.youtube.com/watch?v=EMmKs8vMKhU) | Vista explodida e timing de peças pequenas |
| Introducing Linear Agent | Linear | [youtube.com/watch?v=mRql2VJ99gM](https://www.youtube.com/watch?v=mRql2VJ99gM) | Timing de revelação de texto e cascata em UI escura |
| Introducing Notion 3.0 | Notion | [youtube.com/watch?v=R1cF4T4lgI4](https://www.youtube.com/watch?v=R1cF4T4lgI4) | Ritmo de digitação e cascata pra o playbook 2 |
| Introducing Phone (3a) Series | Nothing | [youtube.com/watch?v=ZizbGaSnIUE](https://www.youtube.com/watch?v=ZizbGaSnIUE) | Como a identidade gráfica comanda luz e transições |
| Product water splash Simulation in blender | (canal não identificado) | [youtube.com/watch?v=DbewtqTrzgo](https://www.youtube.com/watch?v=DbewtqTrzgo) | Configuração de splash de produto no Mantaflow |

Nenhum desses vídeos foi assistido. As tabelas de planos foram montadas pela prática de produção e pelas fontes escritas; a decupagem real dos vídeos deve confirmar ou corrigir lentes e durações.

### Receitas [testar no Blender] (prioridade de cima pra baixo)

1. **Bake do Mantaflow no Blender 5.2 completo** (`splash_mantaflow.py`, res 32 e depois 128). No bpy-módulo da nuvem o bake falhou com `'LevelsetGrid' object has no attribute 'setConst'`. Se falhar também na RTX 3050, o caminho padrão de splash vira o D (`splash_sdf_gn.py`) e o FLIP Fluids fica como opção paga.
2. **Tela com camadas explodidas na RTX 3050** (`tela_camadas_explodidas.py`): medir tempo por quadro em Cycles OptiX e em EEVEE a 1080 x 1920; conferir se o reflexo da principal some como na prova; passar o `qa.py`.
3. **Refração por raytracing no EEVEE 5.2** pro vidro de cobertura e cartões foscos: nomes exatos das opções e resultado comparado ao Cycles.
4. **Filtro de pixel 1,0 vs 1,5** na nitidez de texto de interface (Cycles e EEVEE).
5. **Condensação renderizada** (`condensacao_gn.py`) com material de lata e embaçado: conferir leitura de gota no 100 mm e custo no Cycles.
6. **Vapor procedural renderizado** (`vapor_volume.py`) em contraluz: densidade, corte da rampa e anisotropia; somar gradiente radial pra apagar as laterais do cubo.
7. **Tecidos** (`tecido_cloth.py`): validar a tabela seda/algodão/veludo/couro visualmente e o truque do cache invertido pra revelação.
8. **Líquido dentro do vidro**: líquido 0,1 mm maior que a cavidade vs. igual, e número de bounces de transmissão necessário num frasco com tampa de vidro.
9. **Cáusticas MNEE** (`is_caustics_light/caster/receiver`) em frasco de perfume: tempo de render e ruído na RTX 3050.
10. **Bolhas**: nome do nó de distribuição em volume no 5.2 e esfera de IOR 1,0 dentro de líquido IOR 1,33.
11. **Grease Pencil**: modificador de construção (Build) no Grease Pencil v3 do 5.2 pra assinatura escrita; `bevel_factor_end` em curva como alternativa.
12. **Digitação**: troca de `body` de texto por handler de quadro em render por linha de comando (`blender -b`).
13. **Zona segura do 9:16**: medir a sobreposição atual da interface do Reels e do TikTok e atualizar a seção 0.4.
