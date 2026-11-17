# 10. Controle de qualidade: a régua do estúdio

Este capítulo é o "supervisor de estúdio" escrito em regra. Ele responde a três perguntas antes de qualquer entrega:

1. **O filme está bom o bastante para sair com o nome do estúdio?** (a rubrica, seção 2)
2. **Algum quadro denuncia "3D barato"?** (o checklist de 55 itens, seção 3)
3. **Como a IA prova o que está dizendo?** (o protocolo de revisão e o laudo, seções 4 e 5, e o código, seção 6)

A regra de ouro: **nota sem evidência não vale.** Toda nota da rubrica e todo item do checklist aponta um quadro, um recorte ou um número medido. A IA tende a ser generosa consigo mesma. Este capítulo existe para impedir isso.

As medidas automáticas vêm de três scripts:

| Script | Onde roda | O que mede | Status |
|---|---|---|---|
| `qa.py` (Laboratório) | Python | ESTOURADO, AFUNDADO, LAVADO, ESCURO, SEM COR, CHAPADO; contraste 0,20 a 0,38; estourado < 1,5% | Já existe |
| `/home/claude/codigo/qc/qa_extra.py` | Python 3 com numpy e Pillow (fora do Blender) | Clip preto e branco, contraste RMS, faixa, saturação, colorfulness de Hasler e Süsstrunk, nitidez, ruído, vagalumes, fundo liso, direção de luz, inclinação, cobertura e posição do produto, sombra de contato, cor de marca (ΔE2000), branco com cor, paleta, contraste de texto (WCAG), zona segura, cintilação, folha de contato, recortes 200% | Testado na nuvem nesta pesquisa |
| `/home/claude/codigo/qc/movimento_qa.py` | Dentro do Blender (`bpy`) | Curva linear, partida e chegada secas, câmera sem pausa, cena parada; gráfico de velocidade | [confirmado por sonda no bpy 5.2.2] |

---

## 1. Visão geral da revisão

A revisão tem quatro camadas, nesta ordem. Cada uma é mais cara que a anterior, então a anterior filtra.

| Camada | O que é | Custo | Pega |
|---|---|---|---|
| 1. Medição automática | `qa.py` + `qa_extra.py` em 6 a 9 quadros; `movimento_qa.py` na cena | Segundos | Exposição, cor, ruído, nitidez, composição grosseira, curvas lineares |
| 2. Olho no quadro | Folha de contato e recortes a 200% | 1 a 3 min | Material, aresta, reflexo, sombra, texto, artefato |
| 3. Comparação com referência | Lado a lado com 1 a 3 referências do briefing | 2 min | "Parece de produtora?", gosto, nível |
| 4. Rubrica e laudo | 10 áreas de 0 a 5, com evidência | 5 min | Decisão de entregar ou refazer |

**Por quê essa ordem:** número barato elimina o óbvio (um quadro 4% estourado não precisa de olho humano para ser reprovado). O olho fica para o que número não pega (uma aresta sem chanfro).

**Sinal de que deu errado:** a IA dá nota 4 em "luz" e o `qa_extra` acusa LUZ SEM DIREÇÃO no mesmo quadro. Número e nota precisam concordar, ou o laudo explica por que não concordam.

---

## 2. A rubrica de estúdio

### 2.1 As 10 áreas

Cada área recebe nota de 0 a 5. A tabela descreve 1, 3 e 5; 2 e 4 ficam entre os vizinhos. **0 = ausente ou quebrado** (sem som; marca errada; render com erro).

| # | Área | 1 (amador) | 3 (correto, sem assinatura) | 5 (produtora) | Evidência exigida |
|---|---|---|---|---|---|
| 1 | **Ideia** | Produto girando no vazio. Sem começo, meio e fim. Nada que só esse produto teria | Uma ação clara (abrir, montar, revelar), mas genérica; serviria para qualquer marca | Uma metáfora visual própria do produto, que se entende sem texto em 3 s; o filme tem virada (problema e solução, antes e depois) | Frase de uma linha da ideia e o quadro onde ela "cai" |
| 2 | **Composição** | Produto centralizado e pequeno em todos os planos; bordas cortando em lugar ruim; espaço vazio sem função | Produto com tamanho certo (40 a 55% da altura no packshot 9:16, mínimo 20% da altura em plano geral), terços respeitados, mas a mesma composição em todo plano | Cada plano tem hierarquia clara (1º, 2º e 3º elementos), variação entre planos (close, médio, detalhe), espaço negativo que carrega texto | `produto_altura_%`, `dist_terco`, `dist_centro` em 6 quadros; folha de contato |
| 3 | **Luz** | Chapada, sem direção; ou escura sem intenção; sem contorno | Principal com direção e contraste 2 a 3:1; contorno presente; sombra de contato | Luz conta a história do material (fio de luz no chanfro, alta luz desenhada no vidro), razão 3 a 4:1 controlada, contorno 1000 K mais frio, fundo afastado e mais escuro | `grade_desvio`, `produto_luma_vs_fundo`, clips; recorte do chanfro |
| 4 | **Material** | Plástico de CG: aspereza uniforme, aresta viva, sem imperfeição | Materiais certos (metal parece metal), chanfro presente, aspereza variada em pelo menos uma superfície | Imperfeição em escala certa (micro-arranhão, poeira, digital), variação de aspereza por mapa, vidro com espessura e refração plausível; resiste a close de 200% | 2 recortes a 200% do produto |
| 5 | **Movimento** | Curvas lineares; tudo se move ao mesmo tempo; sem antecipação nem respiro | Ease-in e ease-out em tudo, com hierarquia de tempo (o herói chega primeiro) | Antecipação, sobreposição (overlap), assentamento (settle) de 2 a 4 quadros; ritmo que respira (pausa de 15 a 30 quadros antes da revelação) | `movimento_qa.py` (sem LINEAR nem SEM_EASE indevidos) e gráfico de velocidade |
| 6 | **Câmera** | Gira em volta do produto sem motivo, ou fica parada o filme todo; mesma lente em tudo | Movimentos motivados e suaves; 2 lentes diferentes no filme | Cada movimento revela algo (um detalhe, um texto, o próximo plano); lente escolhida por plano (85 a 100 mm em close, 35 a 50 mm em ambiente); DOF a favor | Lista de planos com lente e f-stop; `CAM_SEM_PAUSA` ausente |
| 7 | **Cor** | Lavada (Standard) ou neon de CG; sem paleta | AgX com look adequado; paleta de 2 a 3 famílias; marca certa | Paleta com intenção (frio e quente separando planos), correção sutil de sombra e alta luz, cor de marca exata (ΔE ≤ 3), look consistente entre planos | `colorfulness_HS`, `saturacao_media`, `paleta_familias`, `marca_deltaE2000_mediana` |
| 8 | **Ritmo** | Planos com a mesma duração; cortes fora da batida; texto atropela a imagem | Cortes na batida; duração dos planos varia | O filme acelera e desacelera de propósito; a revelação cai no 1º tempo de um compasso; texto respeita o tempo de leitura | Grade de batidas vs lista de cortes; tabela de tempo de texto |
| 9 | **Som** | Só trilha, ou trilha de biblioteca proibida; volume errado | Trilha licenciada cortada na batida; 2 a 3 efeitos; -14 LUFS | Camadas completas (trilha, whoosh, impacto, foley, UI, ambiência), sincronia ao quadro, ducking sob voz, -14 ±1 LUFS e -1 dBTP; licença registrada | Medição `ebur128`; planilha de licenças; marcadores de som vs eventos |
| 10 | **Marca** | Logo distorcido ou com cor errada; sem assinatura; texto ilegível | Logo correto no final; cor de marca certa; texto legível e dentro da zona segura | A marca está no mundo do filme (cor de marca na luz ou no fundo, tipografia do manual), assinatura final com timing de 1,5 a 2,5 s, consistência total com o manual da marca | `--marca`, `--texto`, `--plataforma` no qa_extra; quadro da assinatura |

### 2.2 A nota mínima para entregar

| Regra | Valor | Por quê |
|---|---|---|
| Média das 10 áreas | **≥ 4,0** | Abaixo disso o filme é "correto", e correto não vende produtora |
| Nenhuma área abaixo de | **3** | Uma área fraca derruba a percepção do todo (som ruim estraga imagem boa) |
| Áreas de portão (cliente): Cor e Marca | **≥ 4** | Erro de marca é o que o cliente percebe primeiro e o que mais gera retrabalho |
| Conteúdo orgânico do próprio dono | Média ≥ 3,5, nenhuma < 3 | Velocidade importa mais, mas o mínimo não cai |
| Nota 5 em qualquer área | Precisa de **duas** evidências independentes | Evita inflação |

**Quando reprovar:** a IA não entrega. Ela lista as áreas abaixo da regra, o que mudar (com valor numérico) e roda de novo. Máximo de 3 voltas automáticas; na 4ª, pede decisão humana.

### 2.3 Como a IA pontua com evidência

1. **Comece em 3 e justifique para cima ou para baixo.** Toda área parte de 3. Para subir para 4, cite uma evidência do nível 5 parcialmente atingido. Para 5, duas evidências. Para descer, cite o defeito.
2. **Cite o quadro.** "Luz 4: quadro 045, contorno visível no lado direito do frasco (recorte_2); `grade_desvio` 0,10; `produto_luma_vs_fundo` +0,09."
3. **Número manda no que é número.** Exposição, clip, ruído, ΔE de marca, loudness e contraste de texto são decididos pelo script. A IA não pode dar 4 em Cor com ΔE de marca 7,5.
4. **Olho manda no que é forma.** Chanfro, intenção de composição, ideia. Nesses casos a evidência é o recorte com uma frase do que se vê.
5. **Compare com a referência antes de dar 5.** Ponha o quadro ao lado da melhor referência do briefing. Se a referência ganha, não é 5.
6. **Separe "intenção" de "defeito".** Composição central pode ser intenção (plano de assinatura). O laudo diz qual é e por quê.

**Sinal de que deu errado:** todas as áreas com a mesma nota; nenhuma nota abaixo de 4 na primeira volta; evidência genérica ("a luz está boa").

---

## 3. O checklist "parece CG barato?"

55 itens verificáveis num quadro ou na cena. Para cada um: o que procurar no PNG, como medir por script quando dá, e a correção. Os nomes de métrica são as chaves que o `qa_extra.py` imprime.

Convenções: "folha" = folha de contato; "recorte" = recorte a 200% gerado por `qa_extra.py quadro.png --recortes pasta/`; "máscara" = PNG do produto isolado (Cryptomatte, ou render com `film_transparent` e só o produto visível).

### 3.1 Luz (itens 1 a 10)

| # | Defeito | O que procurar no PNG | Medida por script | Correção |
|---|---|---|---|---|
| 1 | Luz chapada, sem direção | Os dois lados do produto com o mesmo brilho; sem lado de sombra | `grade_desvio` < 0,035 (desvio entre as 9 células da grade 3x3) | Principal de área a 45° e 30° acima, 3 a 4 vezes o preenchimento |
| 2 | Produto não se separa do fundo | Silhueta "some" no fundo; borda sem fio de luz | `produto_luma_vs_fundo` entre -0,03 e +0,03 (com máscara) | Contorno a 135°, 1000 K mais frio; fundo afastado 1,2 a 1,4× e mais escuro |
| 3 | Branco estourado | Áreas brancas sem textura, chapadas | `clip_branco_%` > 1,5 (canal ≥ 254) | Energia nos watts absolutos da tabela do cap 05 §4.1; se partir de um chute próprio, comece 2 a 3 stops abaixo (× 0,15 a 0,35) e confira no `qa.py` (ver 00 · Padrões da casa); AgX MHC no lugar de Standard |
| 4 | Preto absoluto (afundado) | Sombras sem nenhum detalhe | `clip_preto_%` > 1,0 (todos os canais ≤ 2) | Preenchimento a 1/4 da principal, ou rebatedor; Lift 0,005 no compositor |
| 5 | Lavado (Standard ou sem contraste) | Imagem cinza, sem preto nem branco | `contraste_rms` < 0,14 e `faixa_p1_p99` < 0,55; conferir `view_transform` | AgX + Look MHC; aumentar razão de luz |
| 6 | Escuro sem intenção | Herói escuro em mundo que não é "luxo escuro" | `luma_p50` < 0,18 e `produto_luma_vs_fundo` < 0 | Subir principal 1 stop; abrir exposição só se o mundo pedir |
| 7 | Sem sombra de contato | O produto "flutua" no chão; base sem linha escura | `sombra_contato_razao` > 0,92 (faixa logo abaixo da base vs faixa mais abaixo); ver limitação em 6.4 | Oclusão de contato: no EEVEE, raytracing ligado e luz com sombra suave; no Cycles, já vem; reduzir altura da principal |
| 8 | Sombras múltiplas cruzadas | Duas ou três sombras em direções diferentes | Só olho (folha) | Uma luz com sombra dura; as outras com sombra suave ou sem sombra |
| 9 | Reflexo sem nada para refletir | Cromo ou vidro refletindo cinza liso | Desvio de luma dentro da máscara do metal < 0,05 [medida manual com numpy na máscara] | Cartões de luz (placas emissivas) e bandeiras pretas posicionadas para desenhar o reflexo |
| 10 | Tela de app estourada ou desbotada | Tela branca sem UI legível; cores de UI lavadas | Clip na máscara da tela; ΔE da cor principal da UI | Emissão 1,0 no AgX (o Laboratório viu desbotar acima de 1,3); vidro por cima com reflexo leve |

### 3.2 Material (itens 11 a 17)

| # | Defeito | O que procurar no PNG | Medida por script | Correção |
|---|---|---|---|---|
| 11 | Aspereza uniforme ("plástico de CG") | Alta luz com a mesma largura e borda em toda a superfície | Só olho no recorte; com máscara, desvio de luma das altas luzes muito baixo é indício | Mapa de aspereza com variação de 0,05 a 0,15 em torno do valor base |
| 12 | Aresta viva sem chanfro | Borda sem o fio de luz; quina "de papel" | Recorte; indício: sem pico de luma na faixa de 2 px da borda da máscara | Chanfro (bevel) de 0,5 a 2 mm na escala real; 3 a 4 segmentos |
| 13 | Sem imperfeição em close | Superfície perfeita a 200% | Recorte | Micro-arranhão, poeira, digital em mapa de aspereza, intensidade baixa (0,02 a 0,08) |
| 14 | Metal "chumbo" | Metal cinza escuro sem reflexo vivo | Saturação e luma na máscara do metal; olho | Metallic 1,0, Base Color clara (0,6 a 0,9), ambiente com algo para refletir |
| 15 | Vidro sem espessura | Vidro parece película; sem refração na borda | Recorte | Modelar espessura real (2 a 4 mm), IOR 1,45 a 1,52, Cycles para vidro |
| 16 | Textura esticada ou repetida | Padrão repetindo em grade; rótulo deformado | Olho; autocorrelação da região [não implementado] | UV correto; textura com escala real; quebra de repetição |
| 17 | Textura de baixa resolução | Logo do rótulo com pixel ou borrado a 200% | Recorte; `nitidez_varlap_meia` na região do rótulo | Textura com pelo menos 2× a resolução que ocupa na tela |

### 3.3 Geometria e escala (itens 18 a 22)

| # | Defeito | O que procurar no PNG | Medida por script | Correção |
|---|---|---|---|---|
| 18 | Escala errada | Celular parece do tamanho de uma TV; DOF de miniatura em objeto grande | `bpy`: `obj.dimensions` contra o tamanho real (celular 71,5 × 147 × 7,8 mm) | Modelar em metros reais; lente e DOF coerentes com a escala |
| 19 | Flutuando sem querer | Fresta entre o produto e o chão | `bpy`: menor Z do bounding box do produto menos Z do chão > 0,5 mm; item 7 | Encostar (snap) no chão |
| 20 | Interseção de malhas | Uma peça atravessando a outra | Olho no recorte | Ajustar posição; colisão |
| 21 | Enfeite flutuante sem função | Cubos, esferas, cápsulas, anéis girando em volta do produto | `bpy`: listar objetos que não são produto, cenário ou luz; perguntar "qual a função?" | Remover, ou dar função (o elemento vira ingrediente, peça, ícone do benefício) |
| 22 | Chanfro inconsistente | Algumas arestas chanfradas e outras vivas | Recorte | Mesmo modificador de chanfro em tudo que é peça real |

### 3.4 Composição (itens 23 a 29)

| # | Defeito | O que procurar no PNG | Medida por script | Correção |
|---|---|---|---|---|
| 23 | Produto pequeno demais | Muito fundo, pouco produto | Medir `produto_altura_%` (altura da caixa da máscara / altura do quadro) com faixa 40 a 55% no packshot 9:16 e ≥ 20% em plano geral; `produto_%` (área) fica só como informação | Lente mais longa ou câmera mais perto (ver 00 · Padrões da casa) |
| 24 | Produto espremido ou cortado mal | Produto encostando na borda, corte em junta (pulso, tampa) | `produto_bbox` a menos de 2% da borda; `produto_%` > 60 | Recuar ou cortar de propósito num terço do objeto |
| 25 | Composição central em todos os planos | Folha inteira com o produto no meio | `dist_centro` < 0,03 em mais de 70% dos quadros da folha | Alternar terços (`dist_terco` < 0,08) e centro só na assinatura |
| 26 | Horizonte torto | Mesa ou linha de horizonte levemente inclinada | `inclinacao_bordas_horiz_graus` entre 0,4 e 4 (abaixo é ruído, acima é intencional) | Zerar rotação Y da câmera, ou inclinar de propósito (≥ 8°, "dutch angle") |
| 27 | Fundo padrão (cinza ou branco infinito) | Ciclorama cinza liso, igual a todo render de IA | `fundo_saturacao` < 0,04 e `fundo_desvio_luma` < 0,06; `chapado_%` > 45 | Fundo com cor do mundo, degradê de luz, textura, ou ambiente real |
| 28 | Espaço negativo morto | Grande área vazia que não carrega texto nem respiro | Olho na folha | Reenquadrar ou reservar a área para o texto |
| 29 | Detalhe que vende sob a interface | Rosto do produto ou UI do app na faixa de baixo do Reels | Bounding box da área importante vs zona universal (seção 6.4 do capítulo 08) | Subir o produto. Máscara universal do estúdio em 1080 x 1920: livre 380 px no topo, 672 px na base, 120 px à esquerda, 140 px à direita, e 300 px à direita abaixo de y 960 (gabarito TikTok). Área útil: x 120 a 940 (x 120 a 780 abaixo de y 960), y 380 a 1248. Centro óptico da área útil: y ≈ 814. [não verificado em fonte oficial do TikTok e do YouTube; revisar a cada trimestre] (ver 00 · Padrões da casa) |

### 3.5 Cor (itens 30 a 35)

| # | Defeito | O que procurar no PNG | Medida por script | Correção |
|---|---|---|---|---|
| 30 | Cor de marca errada | Azul da marca "puxando" para roxo ou lavado | `marca_deltaE2000_mediana` > 5 (ideal ≤ 3) | Khronos PBR Neutral, ou compensar no material; logo 2D por cima |
| 31 | Neon de CG | Cores gritando, sem degradê | `sat_extrema_%` > 8 ou `saturacao_media` > 0,55 | AgX (atenua pureza); baixar saturação do material; luz menos colorida |
| 32 | Sem cor | Tudo cinza sem intenção | `saturacao_media` < 0,10 e `colorfulness_HS` < 15 | Cor no fundo ou na luz de contorno; Look Punchy |
| 33 | Paleta sem hierarquia | Cinco cores disputando | `paleta_familias` > 4 (faixas de 30° de matiz com > 8% do peso de saturação) | Uma cor dominante, uma de apoio, uma de acento |
| 34 | Banding em degradê | Faixas visíveis no fundo | Olho no recorte com contraste aumentado; `chapado_%` alto em fundo com degradê é indício | Grão 1,5 a 3% (capítulo 08); render em 16 bits até a exportação |
| 35 | Branco do produto com cor | Produto branco amarelado ou azulado | `branco_produto_ab` com hipotenusa de a*, b* > 4 (com máscara) | Luz principal neutra (5600 a 6500 K); balanço de branco em `view_settings` |

### 3.6 Câmera e movimento (itens 36 a 43)

| # | Defeito | O que procurar | Medida por script | Correção |
|---|---|---|---|---|
| 36 | Curva linear | Movimento "de robô", velocidade constante | `movimento_qa.py`: LINEAR (variação < 0,5% em 10 quadros) | Bézier com alças longas; ease-out forte na chegada |
| 37 | Partida ou chegada seca sem intenção | Objeto que arranca ou para em 1 quadro | SEM_EASE_PARTIDA, SEM_EASE_CHEGADA | Ease de 6 a 12 quadros; pouso seco só onde há impacto de som |
| 38 | Câmera girando à toa | Órbita contínua em volta do produto | CAM_SEM_PAUSA (câmera em movimento em > 90% dos quadros) | Movimento motivado com pausa de 15 a 30 quadros; câmera parada também é escolha |
| 39 | Cena morta | Nada se move por mais de 1,5 s sem intenção | PARADO (> 45 quadros) | Deriva lenta (1 a 2% de escala ou 2 a 5 cm de câmera) |
| 40 | DOF exagerado em produto pequeno | Metade do produto fora de foco em close | `bpy`: `cam.data.dof.aperture_fstop` < 2,8 com foco < 0,5 m; `nitidez_varlap_meia` na máscara | f/4 a f/5,6 com produto de frente no 9:16, f/8 a f/16 em ângulo, f/16 a f/32 em macro (tabela 3.3 do cap 04); f/2,8 só quando a parte mole for escolha escrita no shot list; foco no logo ou no detalhe que vende (ver 00 · Padrões da casa) |
| 41 | Mesma lente em tudo | Todos os planos com a mesma perspectiva | `bpy`: conjunto de `cam.data.lens` dos planos tem 1 valor | Pelo menos 2 lentes; close 85 a 100 mm, ambiente 35 a 50 mm |
| 42 | Movimento rápido sem borrão de movimento | Objeto rápido "estroboscópico" | `bpy`: `render.use_motion_blur`; olho em quadros de pico | Motion blur com obturador 0,5 (180°) |
| 43 | Cintilação entre quadros | Brilho pulsando | `qa_extra.py --sequencia`: salto de luma média > 0,02 entre quadros vizinhos | Mais amostras; denoise temporal; semente de ruído animada (Cycles) |

### 3.7 Render técnico (itens 44 a 48)

| # | Defeito | O que procurar no PNG | Medida por script | Correção |
|---|---|---|---|---|
| 44 | Ruído | Granulado colorido em sombras | `ruido_sigma` > 2,5 **medido antes do grão do compositor** | Mais amostras; denoise OptiX ou OIDN; luz maior |
| 45 | Vagalumes (fireflies) | Pontos brancos isolados | `vagalumes_por_mpx` > 20 | Clamp indireto 5 a 10 (Cycles); fechar caminhos cáusticos; denoise |
| 46 | Mole (denoise ou desfoque demais) | Detalhe de textura sumiu | `nitidez_varlap_meia` < 25 (calibrar por cena) | Denoise com albedo e normal; nitidez 0,04 a 0,10 |
| 47 | Serrilhado | Escada em bordas finas | Recorte | Filtro de pixel 1,5 px; mais amostras de AA |
| 48 | Artefato de denoise | Manchas "aquarela" em sombras | Recorte em área escura | Mais amostras antes do denoise; denoise com passes |

### 3.8 Texto e marca (itens 49 a 53)

| # | Defeito | O que procurar | Medida por script | Correção |
|---|---|---|---|---|
| 49 | Texto ilegível | Texto sumindo no fundo | `qa_extra.py --texto x,y,w,h`: `texto_wcag` < 4,5 | Placa 60 a 80%, sombra suave, ou escurecer o fundo |
| 50 | Texto pequeno | Precisa de zoom | Altura da fonte em px (medir na caixa) < 44 (apoio) ou < 66 (título) | Tabela 6.1 do capítulo 08 |
| 51 | Texto fora da zona segura | Coberto por botões ou legenda da plataforma | `--plataforma reels|tiktok|shorts`: `texto_dentro_zona_segura` = False | Máscara universal do estúdio em 1080 x 1920: livre 380 px no topo, 672 px na base, 120 px à esquerda, 140 px à direita, e 300 px à direita abaixo de y 960 (gabarito TikTok). Área útil: x 120 a 940 (x 120 a 780 abaixo de y 960), y 380 a 1248. Centro óptico da área útil: y ≈ 814. [não verificado em fonte oficial do TikTok e do YouTube; revisar a cada trimestre] (ver 00 · Padrões da casa) |
| 52 | Texto rápido demais | Some antes de ler | Quadros na tela abaixo do tempo mínimo: o maior entre 30 × (0,5 + caracteres/12) e 30 × (palavras/2,5 + 0,5), número contando como 2 palavras; mínimo 36 q. [valor de trabalho, não verificado em estudo de anúncio] | Seção 6.3 do capítulo 08 (ver 00 · Padrões da casa) |
| 53 | Logo distorcido ou com cor errada | Proporção mudada; cor diferente do manual | `--marca`; razão largura e altura do logo vs arquivo original (± 1%) | Logo 2D vetorial por cima; nunca escalar só num eixo |

### 3.9 Som (itens 54 e 55)

| # | Defeito | Como verificar | Medida por script | Correção |
|---|---|---|---|---|
| 54 | Loudness fora | Filme baixo ao lado de outros vídeos, ou distorcendo | `ffmpeg -i final.mp4 -af ebur128=peak=true -f null -`: integrado fora de -14 ± 1 LUFS ou true peak > -1 dBTP | `mix_e_loudness.sh` (capítulo 08) |
| 55 | Som fora de sincronia ou sem licença | Impacto antes do pouso; som sem origem | Comparar marcadores de som com `eventos_de_som.py`; planilha de licença | Impacto no quadro do contato (0 a 1 quadro antes); trocar som sem licença |

---

## 4. Como a IA confere: o protocolo de revisão

### 4.1 Passo 1: escolher os quadros

**Folha de contato de 6 a 9 quadros**, escolhidos por evento, não por intervalo fixo:

| Quadro | Por quê |
|---|---|
| Primeiro quadro | O "polegar parado" do feed decide aqui |
| Quadro de 1,0 s | O espectador já decidiu ficar ou sair |
| Pico de velocidade de cada movimento principal | Onde motion blur, aliasing e borrão aparecem |
| Quadro de pouso ou impacto | Onde contato, sombra e sincronia de som aparecem |
| Meio de cada texto na tela | Legibilidade e zona segura |
| Quadro de revelação do produto (herói) | O quadro que mais importa; vai para recorte a 200% |
| Último quadro (assinatura) | Marca, logo, chamada |

Para achar os quadros de pico e pouso automaticamente, use a lista de `eventos_de_som.py` (capítulo 08): os eventos WHOOSH dão os picos e os IMPACTO dão os pousos.

```bash
# folha de contato (3 colunas, 360 px de largura cada)
python3 /home/claude/codigo/qc/qa_extra.py --folha folha.jpg q001.png q030.png q045.png q060.png q090.png q120.png q150.png q180.png q240.png
```

### 4.2 Passo 2: medir

```bash
python3 /home/claude/codigo/qc/qa_extra.py q*.png --marca "#1E5BFF" --mascara mascara_q120.png \
        --texto 120,420,840,180 --plataforma reels --sequencia --json laudo_metricas.json
blender -b cena.blend -P /home/claude/codigo/qc/movimento_qa.py -- laudo_mov
```

**Regra de leitura dos alertas:** alerta não é reprovação automática. É uma pergunta que o laudo precisa responder: "defeito" (corrigir) ou "intenção" (explicar). Exemplo: COMPOSIÇÃO CENTRAL no quadro de assinatura é intenção.

### 4.3 Passo 3: olhar a 200%

```bash
python3 /home/claude/codigo/qc/qa_extra.py q120.png --recortes recortes_q120/
```

O script escolhe as 4 regiões de 256 × 256 px com mais detalhe (maior variância do Laplaciano), sem sobreposição, e amplia 2× sem suavizar (vizinho mais próximo). É ali que aparecem: chanfro, aspereza, ruído, vagalume, franja de aberração, anel de nitidez, pixel de textura.

O que a IA procura em cada recorte, em ordem: (1) borda do produto (chanfro, contorno, aliasing); (2) alta luz (forma, variação, estouro); (3) sombra (ruído, artefato de denoise, preto absoluto); (4) texto e logo (franja, serrilhado).

### 4.4 Passo 4: comparar lado a lado com a referência

Monte uma folha com 3 colunas: quadro do estúdio, referência 1, referência 2 (mesma altura). Compare na mesma ordem da rubrica: luz (direção, razão), cor (paleta, look), composição (tamanho do produto), material. Rode o `qa_extra` também na referência: se a referência tem `contraste_rms` 0,22 e o quadro tem 0,13, a diferença está medida.

**Cuidado:** referência de anúncio baixada do Instagram vem recomprimida. Compare forma e intenção, não ruído nem nitidez.

### 4.5 Passo 5: checar o movimento pela velocidade

O `movimento_qa.py` gera um PNG com uma curva de velocidade por objeto (cada curva normalizada pelo próprio máximo, porque o que importa é a forma) e uma grade vertical a cada 1 s.

Como ler a curva:

| Forma da curva | Significa | Nota de Movimento |
|---|---|---|
| Degrau (sobe reto, platô, desce reto) | Interpolação linear | 1 a 2 |
| Sino simétrico | Bézier padrão (ease in e out iguais) | 3 |
| Sino assimétrico com cauda longa no fim | Ease-out forte: chega e assenta | 4 |
| Pequeno vale antes do pico (vai para trás e depois para frente) | Antecipação | 4 a 5 |
| Pequena oscilação depois da chegada (2 a 4 quadros) | Assentamento (settle) ou overshoot | 4 a 5 |
| Picos de objetos diferentes defasados 3 a 6 quadros | Sobreposição (overlap) e hierarquia | 5 |
| Todos os picos no mesmo quadro | Tudo se move junto; sem hierarquia | 2 |
| Câmera com velocidade acima de zero o filme inteiro | Câmera sem pausa | 2 |

**Teste real:** dois cubos fazendo o mesmo percurso de 2 m em 39 quadros, um com interpolação LINEAR e outro com Bézier padrão, e uma câmera girando 1 rad em LINEAR durante 90 quadros. O laudo saiu:

```text
{'tipo': 'LINEAR', 'objeto': 'Linear', 'de': 2, 'ate': 40, 'vel': 1.538}
{'tipo': 'SEM_EASE_PARTIDA', 'objeto': 'Linear', 'quadro': 1}
{'tipo': 'SEM_EASE_CHEGADA', 'objeto': 'Linear', 'quadro': 40}
{'tipo': 'LINEAR', 'objeto': 'Camera', 'de': 2, 'ate': 90, 'vel': 0.05}
{'tipo': 'SEM_EASE_PARTIDA', 'objeto': 'Camera', 'quadro': 1}
{'tipo': 'CAM_SEM_PAUSA', 'objeto': 'Camera', 'fracao_em_movimento': 0.99}
```

O cubo com Bézier não foi acusado. Na primeira versão do script, com tolerância de 3% de variação, o topo do sino da Bézier (que varia cerca de 2 a 3% em 10 quadros) era confundido com linear; a tolerância caiu para 0,5%. [confirmado por sonda no bpy 5.2.2; gráfico em `/home/claude/provas/pos/teste_mov_velocidade.png`]

### 4.6 Passo 6: ouvir

Assista ao filme inteiro em velocidade normal, **com som, no celular** (ou numa janela de 9:16 do tamanho de um celular). Confira: o impacto chega junto com o pouso? a voz se entende sem legenda? a trilha corta na batida? Depois rode a medição de loudness (item 54).

### 4.7 Formato do laudo

O laudo é curto, padronizado e sempre com evidência. Modelo:

```markdown
# Laudo de QC | <projeto> | versão <n> | <data>

## Decisão
REPROVADO (média 3,7; Cor 3 abaixo do portão 4)

## Rubrica
| Área | Nota | Evidência |
|---|---|---|
| Ideia | 4 | Metáfora "garagem para avenida" cai no q120 (porta abre, produto na luz) |
| Composição | 4 | produto_% 24 a 31 nos planos herói; terços em 5 de 7 quadros (dist_terco < 0,08) |
| Luz | 4 | grade_desvio 0,09; contorno visível em recorte_1 de q120; clip_branco 0,8% |
| Material | 3 | recorte_2 q120: aresta da tampa sem chanfro (item 12) |
| Movimento | 4 | movimento_qa sem LINEAR; settle de 3 quadros no pouso (gráfico) |
| Câmera | 4 | lentes 35 e 85 mm; sem CAM_SEM_PAUSA |
| Cor | 3 | marca_deltaE2000 7,4 no frasco (item 30) |
| Ritmo | 4 | cortes nos quadros 0, 60, 120, 180 (120 BPM); texto 63 quadros para 4 palavras |
| Som | 4 | -14,2 LUFS, -1,3 dBTP; impacto no q120 (contato no q120) |
| Marca | 4 | logo vetorial na assinatura; texto_wcag 6,1 |
| **Média** | **3,8** | |

## Itens do checklist acusados
- 12 Aresta viva sem chanfro: q120 recorte_2. Correção: bevel 1,5 mm, 3 segmentos na tampa.
- 30 Cor de marca: ΔE 7,4. Correção: trocar para Khronos PBR Neutral e medir de novo.
- 25 Composição central: q240 (assinatura) = intenção, mantido.

## Próxima volta
1. Chanfro na tampa. 2. View transform Khronos PBR Neutral. 3. Re-render de q090 a q150. 4. Re-medir.
```

---

## 5. Os números de referência (faixas do qa_extra)

Faixas atuais (`FAIXAS` no topo do script), calibradas nos renders de prova deste capítulo e no Laboratório. São ponto de partida: ajuste por mundo visual depois de 10 filmes aprovados.

| Métrica | Faixa boa | Alerta | O que é |
|---|---|---|---|
| `clip_branco_%` | < 1,5 | ESTOURADO | % de pixels com algum canal ≥ 254 |
| `clip_preto_%` | < 1,0 | AFUNDADO | % de pixels com todos os canais ≤ 2 |
| `contraste_rms` | 0,14 a 0,30 | LAVADO/CHAPADO ou DURO | Desvio padrão da luma (0 a 1) |
| `faixa_p1_p99` | ≥ 0,55 | SEM PRETO NEM BRANCO | Distância entre o 1º e o 99º percentil da luma |
| `saturacao_media` | 0,10 a 0,55 | SEM COR ou COR GRITANDO | Média da saturação HSV |
| `sat_extrema_%` | < 8 | NEON DE CG | % com S > 0,9 e V > 0,5 |
| `colorfulness_HS` | 15 a 90 | POUCA COR ou COR DEMAIS | Métrica de Hasler e Süsstrunk |
| `nitidez_varlap_meia` | ≥ 25 | MOLE | Variância do Laplaciano em meia resolução |
| `ruido_sigma` | ≤ 2,5 (antes do grão) | RUIDOSO | Estimativa de Immerkær, escala 0 a 255 |
| `vagalumes_por_mpx` | ≤ 20 | VAGALUMES | Pixels isolados 0,35 acima da mediana dos vizinhos |
| `chapado_%` | ≤ 45 | FUNDO DIGITAL LISO | % de blocos 16 × 16 sem variação |
| `grade_desvio` | ≥ 0,035 | LUZ SEM DIREÇÃO | Desvio das médias de luma na grade 3 × 3 |
| `inclinacao_bordas_*` | < 0,4° ou ≥ 4° | TORTO? | Mediana do ângulo das bordas fortes quase horizontais e quase verticais |
| `produto_altura_%` | ≥ 20 em plano geral; 40 a 55 no packshot 9:16 (ver 00 · Padrões da casa) | PRODUTO PEQUENO (< 20) ou ESPREMIDO (> 90) | Altura da caixa da máscara / altura do quadro |
| `produto_%` | só informação | nenhum | Área da máscara (não use para julgar tamanho) |
| `marca_deltaE2000_mediana` | ≤ 5 (ideal ≤ 3) | COR DE MARCA FORA | ΔE2000 entre a cor pedida e a mediana medida |
| `paleta_familias` | ≤ 4 | PALETA SEM HIERARQUIA | Faixas de 30° de matiz com > 8% |
| `texto_wcag` | ≥ 4,5 | TEXTO ILEGÍVEL | Razão WCAG entre claros e escuros da caixa |
| salto de luma na sequência | ≤ 0,02 | CINTILAÇÃO | Diferença de luma média entre quadros vizinhos |

**Diferença para o `qa.py` do Laboratório:** o Laboratório usa contraste na faixa 0,20 a 0,38, medido do jeito dele. O `contraste_rms` do `qa_extra` é o desvio padrão da luma em sRGB e dá números menores (o render de prova aprovado no olho deu 0,13). **Não compare os dois números entre si**; cada um tem sua faixa. [testar: rodar os dois nos mesmos 20 quadros aprovados e alinhar as faixas]

---

## 6. O código: `qa_extra.py`

Arquivo: `/home/claude/codigo/qc/qa_extra.py` (cerca de 390 linhas, Python 3 + numpy + Pillow; roda fora do Blender e também no Python do `bvenv`). Movimento: `/home/claude/codigo/qc/movimento_qa.py` (roda dentro do Blender).

### 6.1 As fórmulas

| Métrica | Fórmula | Fonte |
|---|---|---|
| Luminância relativa (WCAG) | Linearizar sRGB: c ≤ 0,04045 → c / 12,92; senão ((c + 0,055) / 1,055)^2,4. L = 0,2126 R + 0,7152 G + 0,0722 B | [WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) |
| Razão de contraste | (L1 + 0,05) / (L2 + 0,05) | WCAG 2.1 |
| Contraste RMS | Desvio padrão da luma (0 a 1) | Definição clássica de contraste RMS (Peli, 1990) |
| Colorfulness | rg = R - G; yb = 0,5 (R + G) - B; M = √(σrg² + σyb²) + 0,3 √(μrg² + μyb²), em 0 a 255 | [Hasler e Süsstrunk, 2003](https://infoscience.epfl.ch/record/33994) |
| Nitidez | Variância da imagem filtrada pelo Laplaciano [0 1 0; 1 -4 1; 0 1 0] | [Pech-Pacheco et al., 2000](https://doi.org/10.1109/ICPR.2000.903548) |
| Ruído | σ = √(π/2) × Σ abs(I ∗ M) / (6 (W - 2)(H - 2)), M = [1 -2 1; -2 4 -2; 1 -2 1] | [Immerkær, 1996](https://doi.org/10.1006/cviu.1996.0060) |
| Diferença de cor | CIEDE2000 sobre CIELAB (D65) | [Sharma, Wu e Dalal, 2005](https://hajim.rochester.edu/ece/sites/gsharma/ciede2000/) |

Escala de referência da colorfulness de Hasler e Süsstrunk (do artigo): 0 não colorido; 15 levemente; 33 moderadamente; 45 medianamente; 59 bastante; 82 altamente; 109 extremamente. É por isso que a faixa do estúdio é 15 a 90.

### 6.2 Trechos centrais

```python
# Python 3 + numpy + Pillow | testado na nuvem em PNGs do bpy 5.2.2
import numpy as np, math

def srgb_to_linear(c):
    c = np.asarray(c, dtype=np.float64)
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)

def luminancia_rel(rgb01):
    lin = srgb_to_linear(rgb01)
    return 0.2126 * lin[..., 0] + 0.7152 * lin[..., 1] + 0.0722 * lin[..., 2]

def razao_wcag(c1, c2):
    l1, l2 = float(luminancia_rel(np.array(c1))), float(luminancia_rel(np.array(c2)))
    return (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)

def conv3(img, k):
    p = np.pad(img, 1, mode="edge"); h, w = img.shape; out = np.zeros_like(img)
    for dy in range(3):
        for dx in range(3):
            if k[dy][dx]: out += k[dy][dx] * p[dy:dy + h, dx:dx + w]
    return out

def metricas_basicas(rgb8):
    rgb = rgb8.astype(np.float64) / 255.0
    h, w, _ = rgb.shape
    Yp = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]
    r = {}
    r["clip_branco_%"] = 100.0 * np.mean(rgb8.max(axis=2) >= 254)
    r["clip_preto_%"]  = 100.0 * np.mean(rgb8.max(axis=2) <= 2)
    p1, p99 = np.percentile(Yp, [1, 99]); r["faixa_p1_p99"] = p99 - p1
    r["contraste_rms"] = Yp.std()
    mx, mn = rgb.max(axis=2), rgb.min(axis=2)
    S = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    r["saturacao_media"] = S.mean()
    R, G, B = [rgb8[..., i].astype(np.float64) for i in range(3)]
    rg, yb = R - G, 0.5 * (R + G) - B
    r["colorfulness_HS"] = math.hypot(rg.std(), yb.std()) + 0.3 * math.hypot(rg.mean(), yb.mean())
    g = Yp * 255
    r["nitidez_varlap"] = conv3(g, [[0, 1, 0], [1, -4, 1], [0, 1, 0]]).var()
    c = np.abs(conv3(g, [[1, -2, 1], [-2, 4, -2], [1, -2, 1]]))[1:-1, 1:-1]
    r["ruido_sigma"] = math.sqrt(math.pi / 2) * c.sum() / (6 * (w - 2) * (h - 2))
    cel = np.array([[Yp[i*h//3:(i+1)*h//3, j*w//3:(j+1)*w//3].mean() for j in range(3)] for i in range(3)])
    r["grade_desvio"] = cel.std()
    r["vinheta_centro_menos_quinas"] = cel[1, 1] - np.mean([cel[0, 0], cel[0, 2], cel[2, 0], cel[2, 2]])
    return r
```

O arquivo completo também tem: CIEDE2000 vetorizado, conversão sRGB para CIELAB, sombra de contato, cobertura e posição do produto, fundo, vagalumes, paleta, branco com cor, contraste de texto com zona segura, cintilação em sequência, folha de contato e recortes a 200%.

### 6.3 Resultados medidos nesta pesquisa

Imagens em `/home/claude/provas/pos/` (cena de prova do capítulo 08, 360 × 640, EEVEE 16 amostras; e as sondas de 200 × 200 que já existiam em `/home/claude/probe/`).

| Imagem | clip branco % | contraste RMS | faixa | saturação | colorfulness | ruído σ | Alertas principais |
|---|---|---|---|---|---|---|---|
| `look_Standard_None.png` (Standard, "lavado") | **4,42** | 0,125 | 0,72 | 0,130 | 43,1 | 0,68 | ESTOURADO, LAVADO |
| `look_AgX_None.png` | 0,00 | 0,115 | 0,67 | 0,112 | 27,1 | | LAVADO (look sem contraste) |
| `look_AgX_Medium_High_Contrast.png` | 1,25 | 0,133 | 0,74 | 0,129 | 31,6 | | LAVADO por pouco (cena de prova tem luz fraca) |
| `look_AgX_High_Contrast.png` | 1,35 | **0,149** | 0,79 | 0,138 | 33,5 | | nenhum de exposição |
| `look_Khronos_PBR_Neutral_None.png` | 1,28 | 0,138 | 0,74 | **0,168** | **45,8** | | ΔE de marca 0,7 |
| `com_comp_v3.png` (acabamento final) | 1,31 | 0,132 | 0,74 | 0,152 | 33,5 | 1,07 | COMPOSIÇÃO CENTRAL, PRODUTO PEQUENO (7,2%) |
| `exagero.png` (acabamento exagerado) | 1,27 | 0,252 | 0,97 | 0,157 | 30,9 | **50,4** | AFUNDADO 7,3%, RUIDOSO, VAGALUMES 148/Mpx |
| `/home/claude/probe/t.png` (Cycles, macaco cinza) | 0,00 | 0,082 | 0,43 | 0,002 | 0,4 | 0,59 | LAVADO, SEM PRETO NEM BRANCO, SEM COR, FUNDO DIGITAL LISO (84%) |
| `/home/claude/probe/e.png` (EEVEE, macaco cinza) | 0,00 | 0,081 | 0,43 | 0,000 | 0,1 | 0,57 | Os mesmos |

Saída real do script para o quadro de acabamento final (com máscara, marca e uma caixa de texto de teste):

```text
== com_comp_v3.png (360x640)
  clip_branco_%                    1.312
  clip_preto_%                     0.003
  faixa_p1_p99                     0.736
  contraste_rms                    0.132
  saturacao_media                  0.152
  colorfulness_HS                  33.471
  nitidez_varlap_meia              124.741
  ruido_sigma                      1.069
  vagalumes_por_mpx                0.000
  paleta_familias                  2
  grade_desvio                     0.103
  vinheta_centro_menos_quinas      0.099
  produto_%                        7.204
  produto_centro_rel               [0.505, 0.512]
  dist_terco                       0.224
  dist_centro                      0.013
  fundo_saturacao                  0.121
  sombra_contato_razao             1.137
  marca_deltaE2000_mediana         7.523
  texto_wcag                       1.815
  ALERTAS: ['LAVADO/CHAPADO: contraste RMS 0.132 < 0.14', 'COR DE MARCA FORA: ΔE2000 7.5',
            'PRODUTO PEQUENO: 7.2% do quadro', 'SEM SOMBRA DE CONTATO? ...',
            'COMPOSIÇÃO CENTRAL ...', 'TEXTO ILEGÍVEL: contraste 1.81:1']
```

Leitura: a cena de prova foi feita para testar o compositor, não para ser bonita, e o script reprovou do jeito certo. Produto pequeno (7%), centralizado, flutuando na frente de uma parede, cor de marca deslocada pelo AgX. A "caixa de texto" de teste estava sobre a parede lisa, sem texto, então 1,8:1 é o contraste da parede consigo mesma.

### 6.4 Limitações honestas (o que o número não sabe)

1. **Sombra de contato.** Teste com um cubo branco sobre um chão bege: pousado, deu razão 0,99 (acusou "sem sombra"); flutuando a 35 cm, deu 0,80 (não acusou). Motivo: com a luz vindo de trás e do lado, a sombra do cubo flutuante caiu logo abaixo dele na imagem, e o cubo pousado não tinha linha de oclusão visível no EEVEE com 8 amostras (o que é, ele mesmo, um sinal de CG barato). **Conclusão: a métrica acusa a falta de escurecimento na base, não prova contato.** Para "flutuando", use a checagem de geometria do item 19 (`bpy`). Folha em `/home/claude/provas/pos/folha_contato.jpg`.
2. **Grão versus ruído.** O `ruido_sigma` não distingue grão intencional de ruído de render. Meça antes do compositor (desligue `render.use_compositing` ou leia o EXR cru).
3. **Nitidez depende do conteúdo.** Uma cena com fundo liso e um produto pequeno tem variância do Laplaciano baixa mesmo nítida. Compare versões da mesma cena, não cenas diferentes.
4. **Branco com cor e cor de marca precisam de máscara.** Sem máscara, o script pega o brilho da luz quente da cena como "branco amarelado".
5. **Inclinação** só aparece com bordas fortes e retas suficientes (mais de 50 pixels de borda na faixa); em cena orgânica volta `None`.
6. **Contraste de texto** pega os 10% mais claros e mais escuros da caixa: se a caixa for maior que o texto, mede o fundo. Desenhe a caixa justa.
7. **Faixas calibradas em poucos renders.** Recalibrar depois de 10 filmes aprovados (Pendências).

### 6.5 `movimento_qa.py` em resumo

```python
# Blender 5.2 | confirmado por sonda no bpy 5.2.2
# velocidade por quadro em espaço de mundo (pega parent, constraint e driver)
for f in range(scene.frame_start, scene.frame_end + 1):
    scene.frame_set(f)
    for o in objetos:
        P[o.name].append((o.matrix_world.translation.copy(), o.matrix_world.to_quaternion()))
# v = |Δposição| × fps + 0,15 × |Δrotação| × fps
# LINEAR: 10 quadros em movimento com variação < 0,5% (Bézier padrão varia 2 a 3% no topo)
# SEM_EASE: de repouso para > 60% da velocidade máxima em 1 quadro (ou o inverso)
# CAM_SEM_PAUSA: câmera em movimento em > 90% dos quadros
# PARADO: nada se move por > 45 quadros
```

---

## 7. Rotina do supervisor (resumo operacional)

| Momento | O que rodar | Critério para seguir |
|---|---|---|
| Depois de cada render de teste (540 × 960) | `qa.py` + `qa_extra.py` no quadro herói | Nenhum alerta de exposição |
| Depois da animação (antes do render final) | `movimento_qa.py` | Nenhum LINEAR nem SEM_EASE sem intenção; gráfico com hierarquia |
| Depois do render final | Folha de 6 a 9 quadros + `qa_extra.py --sequencia` + recortes do herói | Checklist sem itens abertos |
| Depois da pós (cor, texto, som) | `qa_extra.py --marca --texto --plataforma`; `ebur128` | Marca ΔE ≤ 5, WCAG ≥ 4,5, -14 ± 1 LUFS |
| Antes de entregar | Rubrica + laudo | Média ≥ 4,0; nenhuma área < 3; Cor e Marca ≥ 4 |

---

## Fontes

1. [W3C: WCAG 2.1, entendendo o contraste mínimo 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
2. [W3C: luminância relativa](https://www.w3.org/WAI/WCAG21/Understanding/relative-luminance.html)
3. [Hasler e Süsstrunk (2003): Measuring colourfulness in natural images (EPFL Infoscience)](https://infoscience.epfl.ch/record/33994)
4. [Immerkær (1996): Fast noise variance estimation, Computer Vision and Image Understanding](https://doi.org/10.1006/cviu.1996.0060)
5. [Pech-Pacheco et al. (2000): Diatom autofocusing in brightfield microscopy, variância do Laplaciano (ICPR)](https://doi.org/10.1109/ICPR.2000.903548)
6. [Sharma, Wu e Dalal (2005): implementação e testes da CIEDE2000](https://hajim.rochester.edu/ece/sites/gsharma/ciede2000/)
7. [Wikipédia: sincronização áudio e vídeo (ITU-R BT.1359, EBU R37, ATSC IS-191)](https://en.wikipedia.org/wiki/Audio-to-video_synchronization)
8. [Spotify for Artists: normalização de loudness (-14 LUFS, -1 dBTP)](https://support.spotify.com/us/artists/article/loudness-normalization/)
9. [Critical Listening Lab: loudness em redes sociais](https://www.criticallisteninglab.com/en/learn/loudness/social-media)
10. [ffmpeg: filtro ebur128](https://ffmpeg.org/ffmpeg-filters.html#ebur128)
11. [AdsUploader: zonas seguras da Meta (Reels e Stories)](https://adsuploader.com/blog/meta-ads-safe-zones)
12. [Cadenus: zona segura do TikTok em pixels](https://cadenus.io/resources/blog/tiktok-safe-zone/)
13. [Poster.ly: zona segura do YouTube Shorts](https://www.poster.ly/tools/youtube-shorts-safe-zone-checker)
14. [Clevercast: diretrizes de legenda da BBC (160 a 180 ppm)](https://www.clevercast.com/bbc-subtitling-guidelines/)
15. [Blender 4.2: migração do EEVEE (Bloom vira Glare)](https://developer.blender.org/docs/release_notes/4.2/eevee_migration/)
16. [Blender 5.0: página de lançamento](https://www.blender.org/download/releases/5-0/)
17. [CG Cookie: novidades do Blender 5.0 (assets de compositor)](https://blog.cgcookie.com/posts/everything-new-in-blender-5-0/)
18. [Blender Python API: bpy_extras.anim_utils (channelbag)](https://docs.blender.org/api/current/bpy_extras.anim_utils.html)
19. [Sonilo: guia de whoosh (timing)](https://sonilo.com/ai-music/whoosh-sound-effect-guide)
20. [School of Motion: design de som para animação](https://schoolofmotion.com/blog/making-giants-sound-design)
21. Capítulo 08 desta base (`/home/claude/base/08-pos-cor-e-som.md`): valores de acabamento, looks medidos, loudness, tipografia

---

## Pendências para o Claude Code

**Receitas [testar no Blender] e calibração:**

1. Rodar `qa.py` e `qa_extra.py` nos mesmos 20 quadros aprovados dos 7 mundos e alinhar as faixas (`contraste_rms` do qa_extra vs contraste do qa.py; `nitidez_varlap_meia` mínima por mundo).
2. Gerar a máscara do produto automaticamente: passe Cryptomatte (`view_layer.use_pass_cryptomatte_object`) e nó Cryptomatte V2 no compositor com File Output, ou um segundo render com `film_transparent` e só o produto. Confirmar a API do Cryptomatte V2 no 5.2.
3. Sombra de contato: trocar a métrica por uma faixa de 3 a 6 px **colada no contorno inferior da máscara** (seguindo o contorno, não o bounding box) e testar com luz principal de frente, de lado e de trás.
4. Checagem de geometria do item 19 (fresta entre produto e chão) e do item 21 (listar objetos sem função) como script `bpy`.
5. `movimento_qa.py`: detectar antecipação (vale antes do pico), settle (oscilação após a chegada) e overlap (defasagem entre picos de objetos) para pontuar Movimento 4 e 5 automaticamente.
6. Medida de aspereza uniforme (item 11): desvio da largura das altas luzes dentro da máscara.
7. Medida de banding (item 34): histograma de níveis em regiões de gradiente suave.
8. Ligar a rubrica a um JSON de laudo e gerar o Markdown do laudo automaticamente a partir das métricas.

**PENDÊNCIAS YOUTUBE:** nenhuma específica deste capítulo (as do capítulo 08 se aplicam ao som e ao compositor).
