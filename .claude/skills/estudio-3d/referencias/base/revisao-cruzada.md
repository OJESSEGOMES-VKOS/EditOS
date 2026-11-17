# Revisão técnica da base (diretor técnico)

> Escopo: leitura integral de `_CONTEXTO.md` e dos capítulos 01 a 11. Nada foi editado nos capítulos. Onde este relatório diz "certo", a decisão se apoia em sonda citada no próprio capítulo, no `_CONTEXTO` (Laboratório na RTX 3050) ou em conta refeita aqui com a fórmula do capítulo 04. Onde não há fonte que decida, a linha diz "decisão do dono".
>
> Regra de leitura das erratas: a frase proposta é para colar no capítulo indicado, no lugar do trecho citado.

---

## 1. Contradições entre capítulos

### 1.1 Fator de calibração de energia (0,15 contra 0,35)

| Onde | O que diz |
|---|---|
| `_CONTEXTO`, "verdade confirmada" | Primeiro chute estourou 28% do quadro; correção energia × 0,15 (cerca de 3 stops) |
| 01 §8.2 (luz pontual), 02 "Calibração herdada" e fichas 1, 2, 5, 10 §3 item 3 | × 0,15 |
| 05 §1 "caminho das iterações" | Primeiro chute deu 20,75% estourado; × 0,2 a 0,35; final × 0,35 |
| 05 §11.3 | "o fator 0,35 do Laboratório equivale a `exposure = -1,5`" |
| 05 §13 (código) | `FATOR_ENERGIA = 1.0` vidro, `0.5` opaco (outro fator, por material) |

**Qual está certo:** os dois números são verdadeiros para cenas diferentes: 0,15 é do Laboratório (rig dele, RTX 3050), 0,35 é da cena do frasco do cap 05 (nuvem). O erro é tratar qualquer um como constante universal e, no 05 §11.3, atribuir 0,35 ao Laboratório. Os watts absolutos batem entre capítulos: 02 ficha 1 dá principal de 10 a 15 W a 0,7 m para o celular; 05 §4.1 dá 9,8 W a 0,75 m. Conta de stops: log2(0,15) = -2,74; log2(0,35) = -1,51.

**Errata 05 §11.3:** "Útil para calibrar: o fator 0,15 do Laboratório equivale a `exposure` de cerca de -2,7 em todas as luzes; o fator 0,35 que funcionou na cena do frasco deste capítulo equivale a -1,5. Fator não é constante: use os watts absolutos das tabelas (ex.: chave 6,3 W a 0,60 m no frasco, 9,8 W a 0,75 m no celular) e meça com o `qa.py`."

**Errata geral (01 §8.2, 02 calibração, 10 item 3):** trocar "energia × 0,15" por "energia nos watts absolutos da tabela do cap 05 §4.1; se partir de um chute próprio, comece 2 a 3 stops abaixo (× 0,15 a 0,35) e confira no `qa.py`".

### 1.2 Faixa de contraste do medidor (quatro réguas com o mesmo nome)

| Onde | Métrica | Faixa "boa" |
|---|---|---|
| `_CONTEXTO`, 01, 02, 06, 09 §6.1 | "contraste" do `qa.py` (definição não publicada na base) | 0,20 a 0,38 |
| 05 §12.1 (tabela de alarmes) | desvio padrão da luminância; CHAPADO se < 0,15 | |
| 05 §4.5 | "contraste abaixo de 0,10 no medidor = chapado (qa.py acusa CHAPADO)" | |
| 02 "prova na nuvem" | p95 menos p5 da luminância | só antes e depois |
| 10 §5 | `contraste_rms` (desvio da luma sRGB) | 0,14 a 0,30 |
| 09 §6.4 volta 4 | `qa/medir.py` "desvio" 0,13 julgado contra 0,20 a 0,38 | |

**Qual está certo:** o cap 10 §5 é o único que define a fórmula e avisa: "não compare os dois números entre si". O cap 09 §6.4 comete exatamente esse erro (desvio 0,13 reprovado contra a faixa do `qa.py`), e o 05 dá dois limiares diferentes (0,10 e 0,15) para o mesmo alarme.

**Errata 09 §6.1 passo 3 e §6.4:** "Faixa de contraste depende do medidor. `qa.py` do Laboratório: 0,20 a 0,38. Desvio padrão da luma (`medir.py`, `qa_extra.py`): 0,14 a 0,30. Nunca julgue um número pela faixa do outro."
**Errata 05 §4.5 e §12.1:** "CHAPADO no medidor da nuvem (desvio padrão): abaixo de 0,14. Faixa do `qa.py` real: ver Laboratório."

### 1.3 Zona segura do 9:16 em px (cinco versões)

| Onde | Topo | Base | Esquerda | Direita | Fonte citada |
|---|---|---|---|---|---|
| 01 §7.4 Reels | 269 | 672 | 65 | 65 | Meta via Solid Labs |
| 01 §7.4 TikTok | 240 | 660 | 120 | 120 (300 abaixo de y 960) | gabarito medido por Solid Labs |
| 01 §7.4 Shorts | 192 | 480 | 0 | 108 | Google via Solid Labs |
| 01 §7.4 máscara única | 269 | 672 | 120 | 120 (300 abaixo de y 960) | interseção |
| 03 §0.4 | ~250 | ~400 | | ~120 | "valores de prática", não verificado |
| 08 §6.4 TikTok | 130 | 484 | 44 | 140 | Cadenus |
| 08 §6.4 Shorts | 380 | 380 | 60 | 120 | Poster.ly (não oficial) |
| 08 §6.4, 07 §5.4, 10 itens 29 e 51 "zona universal" | 380 | 672 | 65 | 140 | interseção |

**Qual está certo:** nenhuma fonte é oficial além do texto da Meta (14%, 35%, 6%), e ele aparece igual em 01 e 08. O 03 §0.4 é o mais perigoso (base de 400 px deixa a CTA atrás da legenda do Reels). Para anúncio, a regra segura é a união dos piores casos.

**Errata única (01 §7.4, 03 §0.4, 07 §5.4, 08 §6.4, 10 itens 29 e 51):** "Máscara universal do estúdio em 1080 x 1920: livre 380 px no topo, 672 px na base, 120 px à esquerda, 140 px à direita, e 300 px à direita abaixo de y 960 (gabarito TikTok). Área útil: x 120 a 940 (x 120 a 780 abaixo de y 960), y 380 a 1248. Centro óptico da área útil: y ≈ 814. [não verificado em fonte oficial do TikTok e do YouTube; revisar a cada trimestre]."

### 1.4 f-stop para produto pequeno

| Onde | O que recomenda |
|---|---|
| 04 §3.3 (fórmula do código do Cycles, sonda) | Celular 15 cm a 60% em 9:16: 8 mm nítidos a f/2,8, 16 mm a f/5,6. Detalhe de 3 cm a 100 mm: 0,3 mm a f/2,8. Regra: frente f/4 a f/5,6 (9:16); em ângulo f/8 a f/16; macro f/16 a f/32 |
| 10 item 40 | f/4 a f/8; acusa f-stop < 2,8 com foco < 0,5 m |
| 01 §8.2 | "f/2,8 a f/5,6 em produto pequeno" |
| 01 §9.4 (fone) | planos 01, 03, 05 com 100 mm f/2,8 |
| 01 §2.4 e §9 | macro cinematográfico f/2,8 a f/5,6; vários DET com 100 mm f/2,8 |
| 02 fichas | luxo escuro f/2; macro f/2,8 a 8 a 20 cm; neon f/1,8; holográfico, vidro e cromo, natureza f/2,8 |
| 03 §0.3 | macro f/2,8 a f/5,6 ("f/2,8 a 20 cm já deixa uns poucos milímetros") |
| 03 §3 (diorama) | "f/2 a f/4 com fachada de 6 a 8 m em escala real" para efeito de maquete |

**Qual está certo:** o cap 04, que deriva da fórmula do `camera.cpp` e foi conferido por sonda. Conta refeita com a fórmula do 04 para o plano 05 do exemplo 4 (fone de ~30 mm a 40% da altura, 100 mm, 9:16): distância 208 mm, profundidade de campo ≈ 0,7 mm a f/2,8. O fone sai quase todo mole. O diorama do 03 também não funciona: fachada de 7 m a 60% com 135 mm fica a ~44 m; a f/2 a faixa nítida é de ~13 m, maior que o prédio, e não há efeito de maquete. Tilt-shift exige escala de miniatura ou f-stop muito menor que f/1.

**Errata 01 §8.2 (linha "Profundidade de campo desligada"):** "Ligar DoF com f/4 a f/5,6 em produto de frente no 9:16 e f/8 a f/16 com produto em ângulo (tabela 3.3 do cap 04); f/2,8 só quando a parte mole for escolha escrita no shot list. Foco num empty na superfície que vende."
**Errata 01 §9.4 e §9.1 (colunas Lente):** "trocar 100 mm f/2,8 por 100 mm f/8 (DET) e 85 mm f/4 por 85 mm f/5,6 (PP), e conferir num recorte a 100%."
**Errata 02 (linha Câmera de luxo escuro, macro, neon, holográfico, vidro e cromo, natureza):** "f-stop pela tabela 3.3 do cap 04; o número desta ficha vale só para o fundo fora de foco quando o produto inteiro cabe na faixa nítida calculada."
**Errata 03 §0.3 item 2:** "f/8 a f/16 em macro de produto em escala real (a f/2,8 um detalhe de 3 cm tem 0,3 mm nítidos)."
**Errata 03 §3 (diorama) item 3:** "Efeito de maquete: modele o diorama em escala de miniatura (base de 30 a 60 cm) ou use câmera ortográfica com DoF desligado. Em escala real de 6 a 8 m, f/2 não borra nada que pareça maquete."

### 1.5 Padrão de curva: `AUTO_CLAMPED` é padrão ou é o erro?

| Onde | O que diz |
|---|---|
| 01 §8.2, 04 §7.1 e §12 item 6, 09 §4.3 | Bézier `AUTO_CLAMPED` simétrico é a "cara de software"; padrão do estúdio é alça assimétrica 10%/70% ou `BACK` |
| 03 "Convenções" | "Bezier com alças `AUTO_CLAMPED` por padrão" em todos os playbooks; vista explodida, cascata da UI, rolagem e revelação de logo usam `AUTO_CLAMPED` |

**Certo:** cap 04 (gráfico de velocidade medido: simétrico tem pico no meio; assimétrico tem pico no q4 e passa 53% do tempo assentando).
**Errata 03 "Convenções", linha Movimento:** "Alça assimétrica (saída 10%, chegada 70%) por padrão, `BACK` 3 a 8% em pouso, `LINEAR` só em giro contínuo e rolagem mecânica. `AUTO_CLAMPED` simétrico só em push-in de hold."

### 1.6 Overshoot

| Onde | Valor |
|---|---|
| 01 regra 17 | 2 a 5%, volta em 6 a 10 q |
| 04 §6.1 (medido por sonda) | 3 a 8%; acima de 12% vira desenho; premium 3% (`back` 0,9), celular 4 a 5% (`back` 1,0 a 1,15), UI 6 a 8% |
| 09 §4.3 | produto que pousa: `back` 1,2 a 1,6 (= 5,3 a ~9%); exemplo do celular `back` 1,3; `cascata` padrão 1,4 |
| 02 fichas | estúdio premium e luxo escuro "Não"; pop candy 8 a 15%; fitas 8% |
| 03 §10 | revelação de logo `AUTO_CLAMPED` "sem ultrapassar" |

**Certo:** a tabela `back` → % do cap 04 é medida. O mundo decide se há overshoot (02); se houver, o 04 dá o número. O 09 está acima da faixa para celular, e o pop candy do 02 passa do teto do 04.
**Errata 09 §4.3 (tabela):** "Entrada de produto que pousa: `back` 0,9 a 1,15 (3 a 5%) em produto premium e eletrônico; 1,3 a 1,55 (6 a 8%) em UI e mundos pop. Conferir na tabela 6.1 do cap 04." E no `base.cascata`, padrão `back` 1,3.
**Errata 01 regra 17:** "overshoot de 3 a 8% (tabela 6.1 do cap 04), zero nos mundos luxo escuro e estúdio premium."
**Errata 02 ficha pop candy:** "Overshoot 8 a 12% (acima de 12% vira desenho animado, cap 04)."

### 1.7 Tempo de segurar o herói (hold)

| Onde | Valor |
|---|---|
| 01 regra 7, §3.2, §3.3, exemplos | 12 a 24 q no pico da revelação |
| 04 §1 e §8 | 30 a 60 q; "mínimo 24 q para o olho ler forma e marca" |
| 10 rubrica Movimento 5 | pausa de 15 a 30 q antes da revelação |

**Decisão do dono.** Nenhum dos dois tem fonte própria (o 01 dobra o valor de animação clássica; o 04 é regra de estúdio). Proposta de errata para os dois: "Hold do herói: 24 q no mínimo (0,8 s), 30 a 60 q no plano de revelação principal; 12 a 18 q só em segura dentro de plano curto de gancho."

### 1.8 Número de planos por duração

| Onde | 15 s | 30 s |
|---|---|---|
| 01 §3.2 | 6 a 9 planos (média 1,7 a 2,5 s) | 10 a 16 |
| 04 §8 | 4 a 6 | 7 a 10 |
| 03 (estruturas prontas) | 5 a 6 | 9 a 10 |
| 08 §5.4 | plano de produto = 1 a 2 compassos (60 a 120 q a 120 BPM) | |

**Errata (01 §3.2 e 04 §8):** "15 s: 5 a 8 planos; 30 s: 8 a 14 planos. Gancho e tensão podem ter planos de 30 a 45 q; revelação e packshot, 60 a 120 q." Decisão final do dono.

### 1.9 Velocidade de push-in

| Onde | Valor |
|---|---|
| 01 regra 23 | 5 a 20 cm/s em produto pequeno |
| 04 §4.2 (celular a 59 cm) | sutil 59 → 53 cm em 3 s (2 cm/s); dramático 62 → 42 cm em 3 s (6,7 cm/s) |

**Certo:** 04 (medido na prova). 20 cm/s a 59 cm cruza a distância inteira em 3 s.
**Errata 01 regra 23:** "push-in de 1 a 3 cm/s (sutil) a 5 a 7 cm/s (dramático) com o celular a 60 cm; a regra é em % da distância (5 a 15% em 3 a 5 s), não em cm absolutos."

### 1.10 Tremor de câmera na mão

| Onde | Valor |
|---|---|
| 04 §5.5 (NOISE calibrado por sonda) | 0,05 a 0,15° de pico; acima de 0,3° em produto parado parece erro |
| 01 §8.2 | 0,1 a 0,3° |
| 02 argila | 0,2°; neon "ruído de 0,3° a 1 Hz" |
| 09 §4.3 | NOISE `strength` 0,5 a 1 mm (04 mostra que isso é 0,17 a 0,33 mm de pico) |

**Errata 01 §8.2 e 02 (argila, neon):** "tremor de 0,05 a 0,15° de pico, ciclo de 30 a 45 q, com `strength = radians(pico) / 0,33` (cap 04 §5.5)."

### 1.11 Tempo mínimo de leitura do texto

| Onde | Fórmula |
|---|---|
| 01 §7.3 | quadros = max(25; 30 × (0,5 + caracteres / 12)) |
| 08 §6.3, 10 item 52, 04 §8 | quadros = 30 × (palavras / 2,5 + 0,5), mínimo 36 q; número conta como 2 palavras |
| 03 §2 | 0,4 s por palavra curta (2,5 a 3 palavras/s), não verificado |

**Consequência:** os exemplos do 01 reprovam no QA do cap 10. "Chega quente em 30 min" (ex. 1, plano 06): 70 q no 01; pela regra do 10 são 6 palavras = 87 q. "Caixa dos próximos 90 dias" (ex. 2, plano 08): 86 q contra 87 q exigidos.
**Errata (01 §7.3, 08 §6.3, 10 item 52):** "Tempo mínimo = o maior entre as duas fórmulas: 30 × (0,5 + caracteres/12) e 30 × (palavras/2,5 + 0,5), número contando como 2 palavras; mínimo 36 q. [valor de trabalho, não verificado em estudo de anúncio]." E refazer os quadros de texto dos exemplos 1 e 2 do cap 01.

### 1.12 Tamanho mínimo de texto em 1080 x 1920

| Onde | Valor |
|---|---|
| 01 §7.3 | altura de maiúscula ≥ 48 px (corpo), ≥ 64 px (CTA) |
| 08 §6.1, 10 item 50 | altura da fonte ≥ 44 px (mínimo), ≥ 66 px (título) |
| 03 §1 e §3 | texto da UI ≥ 10 px no render; contato ≥ 60 px |
| 02 ficha 1 | "legenda em Inter 400, 14 a 16 px em 1080" |

**Certo:** 08 (cálculo explicado). O 02 é erro claro (14 px some no celular). Atenção: "altura de maiúscula" (01) é cerca de 70% da "altura da fonte" (08), então 48 px de maiúscula ≈ 68 px de fonte; o 01 é mais rígido.
**Errata 02 ficha 1:** "legenda em Inter 500, 50 a 60 px em 1080 (mínimo absoluto 44 px, cap 08 §6.1)."
**Errata 01 §7.3:** "Altura da fonte (não da maiúscula): ≥ 44 px no apoio, ≥ 66 px em título e CTA (cap 08 §6.1)."

### 1.13 Tamanho do produto no packshot e unidade da medida

| Onde | Valor | Unidade |
|---|---|---|
| 01 regra 4 | plano geral ≥ 20%; packshot 9:16 35 a 50%; 4:5 45 a 65%; 16:9 55 a 75% | altura do quadro |
| 03 §0.4 | 45 a 60% da altura útil | altura |
| 10 §5 e item 23 | `produto_%` 18 a 60 (rubrica: 18 a 45%) | **área** da máscara |

**Problema:** para um celular (proporção 0,49) em 9:16, área ≈ 0,86 × altura². Um packshot correto pelo 01 com 35% da altura dá 10,6% de área e o `qa_extra` acusa PRODUTO PEQUENO; 50% de altura dá 21,6%.
**Errata 10 §5 e item 23:** "Medir `produto_altura_%` (altura da caixa da máscara / altura do quadro) com faixa 35 a 60% no packshot 9:16 e ≥ 20% em plano geral; `produto_%` (área) fica só como informação." **Errata 01 regra 4 e 03 §0.4:** unificar em "packshot 9:16: 40 a 55% da altura".

### 1.14 Emissão de tela, neon e LED no AgX

| Onde | Valor |
|---|---|
| `_CONTEXTO` | tela desbota acima de ~1,3; use 1,0 |
| 02 (neon noturno, calibrado pelo Laboratório) | tubo de neon 1,0 |
| 09 pegadinha 23 | "acima de ~1,0 desbota; use 0,8 a 1,0" |
| 05 §4.8 | tubo de neon com Emission Strength 8; se branco, "baixe para 4 a 6"; pulso 6 → 3 → 6 |
| 03 §4 armadilhas | LED com emissão 2 a 5 |

**Certo:** `_CONTEXTO` e 02 para tela e neon (Laboratório). No 05, a iluminação vem da luz de área ao lado do tubo, então o tubo não precisa de 8.
**Errata 05 §4.8:** "Tubo com Emission Strength 1,0 a 2,0 (Laboratório calibrou 1,0 no mundo neon); quem ilumina é a área de 4,2 W. Pulso de neon: 2,0 → 1,0 → 2,0."
**Errata 09 pegadinha 23:** "Emissão de tela acima de ~1,3 no AgX: desbota. Use 1,0."
**Errata 03 (LED estourado):** "LED pequeno: 1,5 a 3 com cor saturada, conferindo o hex no `qa_extra --marca`."

### 1.15 Look do AgX (padrão e comida)

| Onde | O que diz |
|---|---|
| 03, 04, 05, 06, 08, 09 | `AgX - Medium High Contrast` padrão (consistente) |
| 03 §7 armadilhas | "AgX com look Medium High Contrast, não Punchy, em comida" |
| 08 §4.2 regra | "Pop candy, comida: AgX Punchy" |
| 02 fichas argila e natureza | `AgX - Base Contrast` ("curva neutra") |
| 05 §11.2 | luz natural: `AgX - Low Contrast` |
| 08 §4.2 (medido) | Base Contrast é idêntico a None |

**Certo:** a medida do 08 (Base Contrast = None). Para comida, o 03 tem o motivo (tomate fluorescente) e o 08 não dá motivo específico.
**Errata 08 §4.2 (tabela de regra):** "Pop candy: AgX Punchy. Comida: AgX Medium High Contrast (Punchy satura tomate e molho além do real)."
**Errata 02 fichas argila e natureza:** "Look `None` (idêntico a Base Contrast, medido no cap 08)." E 05 §11.2: luz natural "`None` ou `AgX - Low Contrast`", alinhado com a ficha.

### 1.16 Tamanho de chanfro

| Objeto | 01 | 02 | 03 | 04 | 06 (tabela) | 09 / 10 |
|---|---|---|---|---|---|---|
| Celular, eletrônico de mão | 0,3 a 1 mm | 0,6 mm | 0,2 a 0,5 mm | 3,2 mm na prova; "0,5 a 3 mm" | 0,5 a 1 mm | ≥ 0,5 mm; 0,5 a 2 mm |
| Logo extrudado | | | `bevel_depth` 1 a 1,5 mm (logo de 20 cm) | | 0,3 a 0,6 mm (5 a 10 mm de espessura) | 0,3 mm no exemplo SVG |
| Caixa de papel cartão | | | 0,1 mm | | 0,3 a 0,5 mm | |
| Frasco | | 1 mm (vidro grosso) | | | 1 a 2 mm | (05 e 07 usam 3 mm) |

**Certo:** a tabela do 06 (capítulo dono do tema, com motivo físico). Os 3 a 3,2 mm de 04, 05 e 07 são provas de cena, não regra. O logo do 03 é de 20 cm com 12 mm de espessura, fora da linha do 06; vale escrever a regra relativa.
**Errata 03 §4 (eletrônico):** "Chanfro 0,5 a 1 mm (tabela do cap 06)." **03 §9:** "chanfro 0,3 mm em papel cartão." **03 §10 item 5:** "`bevel_depth` de 5 a 10% da espessura total do logo (1 a 1,2 mm num logo de 12 mm)". **06 tabela:** acrescentar "logo grande (> 15 cm, espessura > 10 mm): 1 a 1,5 mm". **04 §11:** "chanfro de 3,2 mm" deve virar "raio de canto 9 mm e chanfro de borda 0,8 mm" ou ser marcado como valor de prova.

### 1.17 Cor de líquido: Base Color ou absorção

| Onde | O que diz |
|---|---|
| 02 ficha orgânico líquido | "nunca tingir a Base Color de líquido transparente"; Volume Absorption |
| 06 §vidro colorido e líquidos (testado) | cor por Volume Absorption, Base Color branca |
| 03 §5 item 3 (perfume) | "cor no Base Color (âmbar, rosa) com saturação moderada" |
| 03 §6 receita D | "Transmission 1 com cor marrom saturada" |

**Errata 03 §5 item 3 e §6 receita D:** "Base Color branca; cor por Volume Absorption na saída Volume (perfume #F2B8C6 a 25/m; cola #5A1E0E a 120/m; cap 06)."

### 1.18 Filme fino (thin film) sobre metal

| Onde | O que diz |
|---|---|
| 02 "prova na nuvem" item 3 | sobre base dielétrica preta: fraco; sobre metal claro `#C4C8D0`, Thin Film IOR 2,0, espessura 250 a 750 nm por Noise: funcionou |
| 06 §Thin Film e §estilizados | sobre metal: "quase invisível" (filme 1,33, 400 nm); usar base dielétrica escura e filme 1,9 |

**Leitura:** os dois testes são válidos e não se contradizem na física; o que mudou foi o IOR do filme (1,33 contra 2,0) e a espessura variável. A frase do 06 generaliza demais.
**Errata 06 §Thin Film item 3:** "Filme sobre metal com IOR 1,33 e espessura fixa: quase invisível. Com Thin Film IOR 1,9 a 2,0 e espessura variando de 250 a 750 nm, funciona sobre metal claro (cap 02) e sobre dielétrico escuro (este capítulo). [testar no Blender] qual dos dois lê melhor na RTX."

### 1.19 Material de tela de celular

| Onde | Receita |
|---|---|
| 03 §1 (testada em Cycles) | emissão 1,0 + mesma imagem na Base Color (aspereza 0,35) para receber sombra dos cartões; vidro separado de 0,7 mm |
| 06 §tela, Forma 1 | Base Color quase preta (0,005), emissão 1,0, Coat 1 |

**Leitura:** a Forma 1 do 06 não recebe sombra dos cartões explodidos. As duas valem para casos diferentes.
**Errata 06 §tela, Forma 1:** "Use quando não há cartões flutuando sobre a tela. Com camadas explodidas, ponha a imagem também na Base Color (aspereza 0,35), senão os cartões não projetam sombra (cap 03 §1)."

### 1.20 Transmissão no vidro e preset final do Cycles

| Onde | Valor |
|---|---|
| 07 §3.4 e §3.6 | `transmission_bounces` final 12, "mínimo 8 para qualquer vidro"; final 1024 amostras, limiar 0,01 |
| 03 §5 | frasco com tampa de vidro e líquido: 16 a 24; "bounces 16+" |
| 06 | 12 ou mais |
| 09 §5.1 `preset_render` | final_cycles 256 amostras, limiar 0,02 |

**Errata 07 §3.4:** "12 no final; 16 a 24 quando há vidro sobre vidro com líquido (frasco com tampa de vidro), com `max_bounces` igual ou maior." **Errata 09 §5.1:** "final_cycles: 1024 amostras, limiar 0,01, mínimo 64, OIDN High (presets do cap 07 §3.6)."

### 1.21 Densidade de névoa no mundo neon

| Onde | Valor |
|---|---|
| 02 ficha neon | Volume Scatter 0,01 a 0,03 |
| 05 §9.1 (testado) | 0,01 a 0,05 é para sala de 5 a 20 m; cena de mesa (0,5 a 0,8 m de feixe) pede 0,3 a 1,0 |

**Errata 02 ficha neon:** "névoa em cubo, densidade 0,3 (sutil) a 1,0 (forte) em cena de mesa; 0,01 a 0,03 só em cenário de 5 m ou mais (cap 05 §9.1)."

### 1.22 Animação "em dois" a 30 fps

02 ficha argila ("12 quadros por segundo de pose dentro de 30 fps") e ficha papel ("stepped em 2 quadros, 12 poses por segundo") erram a conta: a 30 fps, pose a cada 2 quadros dá **15 poses/s** (12 é "em dois" a 24 fps). O 01 §9.3 está certo ("troca de pose a cada 2 q").
**Errata 02 (argila e papel):** "pose a cada 2 quadros (15 poses por segundo a 30 fps)."

### 1.23 Lente de 50 mm e lentes por mundo

| Onde | O que diz |
|---|---|
| 01 regra 13 e §8.2 | 50 mm é a lente da mesmice; proibido sem justificativa escrita |
| 02 fichas | 50 mm aparece em 11 dos 19 mundos (pop candy, diorama, argila, vidro e cromo, brutalista, papel, neon, natureza, fitas, arquitetônico, color block) |
| 03 estruturas | 50 mm é a segunda lente mais usada (tela 3/4, janela de SaaS, explodida, linha de cores) |
| 04 §1 | lente de contexto 35 a 50 mm |
| 01 §2.4 contra 02 | diorama 85 a 135 mm ou ortográfica (01) contra 50 e 85 mm f/11 (02) |

**Errata 01 regra 13:** "50 mm é permitido como lente de contexto ou de respiro, desde que não seja a lente dominante do filme (eixo 2 da regra de rotação do cap 02)." **Errata 02 ficha diorama:** "85 a 135 mm, ou ortográfica; DoF desligado (cap 01 §8.2)."

### 1.24 Quantos mundos existem

01 §2.4 lista 16 (9 "a testar"); 02 tem 19 (3 já provados na nuvem: holográfico, papel, têxtil); 09 §2.1 manda o `tratamento.md` escolher "um dos 7 mundos testados"; 08 §3.2 só calibra bloom para os 7. O nome do 7º também muda: "luz natural" (01, `_CONTEXTO`) e "natureza e luz do sol" (02).
**Errata 09 §2.1:** "decide o mundo (um dos 19 do cap 02; os 7 calibrados na RTX têm prioridade em prazo curto)". **Errata 01 §2.4:** "Os 16 mundos daqui são os 16 primeiros do cap 02 (que tem 19, com fichas completas); status de teste: ver cap 02." Unificar o nome como "Natureza e luz do sol (luz natural)".

### 1.25 Outras divergências menores

| Tema | Onde | Divergência | Errata proposta |
|---|---|---|---|
| `clip_start` | 04 §2.1 (1 cm) contra 09 §5.1 `criar_camera` (5 mm) | | "1 cm; 5 mm só em macro abaixo de 13 cm" |
| Resolução de rascunho | 07 §3.6 (50%) contra 09 §5.1 (25%) | 25% é para a nuvem | "25% na nuvem, 50% na RTX" nos dois |
| Hold do logo | 04 §8 (45 a 60 q) contra 03 §10 (45 a 90 q) e 10 rubrica Marca (1,5 a 2,5 s) | | "45 a 75 q" |
| Antecipação do logo | 03 §10 (6 a 12 q) contra 04 §8 (4 a 6 q) | o 03 descreve "algo se move antes", não antecipação clássica | renomear no 03 para "pré-movimento" |
| Diferença de lente entre cortes | 01 regra 14 (1,5×) contra 03 estrutura do app 15 s (100 → 70 mm = 1,43×) | | ajustar o 03 para 100 → 50 mm ou trocar o ângulo 30° |
| Hornet | 02 usa três links de `hellohornet.com` como referência | 11 §2 diz que Hornet ficou fora por falta de link verificado | 11: incluir `hellohornet.com` (já lido no 02) ou 02: marcar [não verificado] |
| Blackmeal | 02 Fontes: "site não abriu" | 11 Fontes: "lido integralmente" | conferir e unificar |

**fps padrão:** sem contradição. Todos os capítulos usam 30 fps e lembram que a fábrica é 24.

---

## 2. Erros de API, nomes e fatos técnicos suspeitos

| # | Onde | O que está escrito | Problema | Correção |
|---|---|---|---|---|
| 1 | 05 §11.3 | "fator 0,35 do Laboratório = `exposure` -1,5" | atribuição errada (ver 1.1) | ver errata 1.1 |
| 2 | 09 §4.10 | `ffmpeg -framerate 30 -i ... -c:v libx264 -pix_fmt yuv420p -crf 16 saida.mp4` | sem `out_color_matrix=bt709` nem marcas; o 07 §5.5 mediu desvio R+9 G+7 B-7 no laranja da marca | usar o comando do 07 §5.6 |
| 3 | 03 §3 diorama | efeito de maquete com fachada de 6 a 8 m a f/2 a f/4 | fisicamente errado pela fórmula do 04 (ver 1.4) | errata 1.4 |
| 4 | 02 argila e papel | "em dois" = 12 poses/s a 30 fps | conta errada (15) | errata 1.22 |
| 5 | 09 pegadinha 23 | desbota "acima de ~1,0" | contradiz o Laboratório (~1,3) | errata 1.14 |
| 6 | 06 §Thin Film | "só em dielétricos" (notas 4.2) como regra do 5.2 | o 02 renderizou com cor sobre metal no 5.2.2 | errata 1.18 |
| 7 | 09 §6.4 | desvio 0,13 comparado a 0,20 a 0,38 | métrica errada para a faixa | errata 1.2 |
| 8 | 09 §6.3 | "Zonas seguras ... estão no capítulo de composição" | esse capítulo não existe | "cap 01 §7.4 e cap 08 §6.4" |
| 9 | 09 §4.7 item 1 e código | `extrude` antes de converter, depois `transform_apply(scale)` na malha | a escala aplicada depois multiplica a espessura já extrudada; o 03 §10 achou o mesmo erro em curva (57 mm em vez de 14 mm) | escalar primeiro (pontos da curva, como no 03), extrudar e chanfrar depois, em mm reais |
| 10 | 09 pendência 11 | `sequence_editor.strips.new_image` | não verificado | sondar antes de usar |
| 11 | 05 §7.2 | estado incluir/excluir por item da coleção de light linking | nome Python não encontrado | sondar `CollectionLightLinking` |
| 12 | 08 §4.1 | balanço de branco "trazido no 5.0" | versão de entrada não verificada (05 só confirma que existe) | marcar [não verificado] |
| 13 | 03 §2 | velocidade de leitura "0,4 s por palavra" | terceira regra de leitura, sem fonte | remover e apontar para a regra única (1.11) |
| 14 | 04 §11 | celular "chanfro de 3,2 mm" | provável confusão com raio de canto | errata 1.16 |

Nada encontrado que contradiga as sondas do `_CONTEXTO` nos pontos centrais: `action.fcurves` sumiu e todos usam channelbag; `BLENDER_EEVEE`; `scene.compositing_node_group`; nomes do Principled v2; looks com prefixo `AgX - `; `media_type` antes de `file_format`; `use_nodes` só quando `node_tree` vem vazio. A busca por nomes do 3.x (`Specular`, `Clearcoat`, `Emission` como entrada) não achou uso indevido. Nenhum travessão nos 11 capítulos.

---

## 3. Buracos frente à especificação

| Cap | Item pedido | Situação | O que falta |
|---|---|---|---|
| 01 | interrogatório, 15 conceitos por categoria, batidas, tratamento, shot list, pipeline com portões, heurísticas, mesmice, 5 exemplos | completo | banco de conceitos sem **produto industrial** e sem **B2B com produto físico** (categorias do `_CONTEXTO`); nenhum exemplo em **1:1** nem de **6 s** e **60 s** prontos; portões numerados só 0, 2 e 4 no texto (a tabela do §6 cobre todos) |
| 02 | 16+ mundos | 19 fichas | 9 mundos sem render; 3 só na nuvem com medidor caseiro; bloom (cap 08) só para 7; matriz sem coluna "industrial"; grade de miniaturas dos 19 não existe |
| 03 | playbooks com 15 s e 30 s | 10 playbooks com as duas estruturas | sem playbook de **produto industrial**; sem estruturas de **6, 20 e 60 s**; estruturas só pensadas em 9:16 (sem adaptação 16:9 e 4:5); 13 receitas [testar], com Mantaflow falhando no bake |
| 04 | lentes, DOF, 12 princípios, curvas, timing | completo | composição por formato (coordenadas de terços em 4:5 e 1:1) rasa; câmera ortográfica para diorama não tratada; velocidades da tabela 4.1 não vistas em tela de celular |
| 05 | rigs, cartões, light linking, volumétrico, AgX, diagnóstico | completo (9 rigs, 28 sintomas) | todos os rigs só em Cycles CPU; HDRI só reflexo sem teste; equivalência EEVEE pendente; nenhum rig para produto grande (calçado, notebook aberto) testado |
| 06 | Principled entrada por entrada, receitas, imperfeição, chanfro, PBR, estilizados | completo | faltam **couro**, **pão/queijo/carne** (estão espalhados no 03), **papel cartão impresso com laminação** e **condensação** como receita de material; asset de digitais não escolhido |
| 07 | presets, passes, codecs, farm | completo | todos os tempos de RTX menos três são estimativa; spec do Reels não oficial; comandos `ffmpeg` só para 9:16 e 16:9 (faltam 4:5 e 1:1); orçamento de farm com OctaneBench inventado |
| 08 | compositor, cor, som, tipografia | completo | **legenda fechada (SRT)** e legenda queimada para filme mudo não tratadas; locução e voz sintética só citadas; montagem automática no VSE não escrita; loudness testado só com sinal sintético |
| 09 | pipeline, loop, MCP, assets, pegadinhas | completo (32 pegadinhas) | servidor MCP oficial não aberto; download Poly Haven não testado; volta 5 da cena de exemplo não feita (contraste ainda abaixo da faixa) |
| 10 | rubrica, checklist 30+ | rubrica de 10 áreas e 55 itens | métrica de sombra de contato pouco confiável; aspereza uniforme e banding sem medida; máscara de produto não automatizada; faixas do `qa_extra` calibradas em poucos renders |
| 11 | referências | 82 itens | **nenhum vídeo assistido**; fichas de decomposição com luz, câmera e som em branco; nenhuma referência de estúdio brasileiro além da Tendril SP; licença do Kenney não conferida |

---

## 4. As 10 descobertas que mais mudam os próximos filmes

1. **Light linking em toda luz de contorno e na chave quando o fundo está a menos de 50 cm.** Na volta 4 do cap 09, o canto do fundo caiu de 0,785 para 0,000 só com isso; no cap 05, a média do quadro foi de 0,508 para 0,227 e o chão deixou de virar holofote. É a cura mais barata do "fundo mais claro que o herói".
2. **Profundidade de campo em escala real é de milímetros.** Celular a 60% do 9:16: 8 mm nítidos a f/2,8 e 16 mm a f/5,6; detalhe de 3 cm a 100 mm: 0,3 mm a f/2,8. No Blender fechar o diafragma não escurece nem difrata, então f/8 a f/16 em ângulo e em macro é de graça (cap 04 §3). Corrige metade dos f-stops da base.
3. **Curva assimétrica 10%/70% no lugar do `AUTO_CLAMPED`.** Na prova do cap 04, a câmera faz 47% da órbita em 27% do tempo e passa a segunda metade assentando; o gráfico de velocidade mostra pico no q4 contra o q16 da curva padrão. Overshoot tem tabela medida: `back` 1,0 = 3,7%, 1,2 = 5,3%, 1,4 = 7,1%.
4. **Escurecer primeiro, depois acender só o herói.** O primeiro chute estoura 20 a 28% do quadro; fundo a 0,45 m atrás já cai 1,6 stop pela lei do inverso do quadrado; grade de 60 a 75° protege o fundo; produto opaco usa metade da energia do vidro (vermelho virou rosa sem isso).
5. **Cor de marca: AgX não reproduz o hex.** ΔE2000 de 7,2 no AgX MHC contra 0,7 no Khronos PBR Neutral (cap 08); branco de cena 1,0 sai #C4 no AgX; amarelo e verde-água erram d83 a d88 (cap 06). Regra: logo e cartela em 2D por cima, Khronos quando a embalagem é a estrela.
6. **Tela de app que não é placa:** emissão 1,0 e a mesma imagem na Base Color (para receber sombra), vidro de 0,7 mm a 0,05 mm acima, cartões a 8 a 15 mm e a chave fora do ângulo de reflexão. Sem isso a UI fica leitosa e o laranja vira rosa (cap 03 §1).
7. **Vidro e líquido:** bandeiras pretas a ±55°, cartões de reflexo emissivos (12) invisíveis para câmera e sombra, cartão de transluz atrás (2, degradê radial), cor por Volume Absorption e não pela Base Color, transmissão 12 a 24 (caps 05, 06, 07).
8. **Denoise vale mais que 4× amostras, e o filme é híbrido.** 64 amostras com OIDN (1,28% de erro) batem 256 sem denoise (1,87%) em um quarto do tempo; 16 + denoise vira "cera". 30 s todo em Cycles final: ~11 h; híbrido com 8 s de vidro: ~4 h 50 (cap 07).
9. **Matriz BT.709 na entrega.** Sem `out_color_matrix=bt709`, o laranja #E0602A volta com R+9 G+7 B-7; com ela, só arredondamento (cap 07 §5.5). Erro invisível no PC e visível no celular do cliente.
10. **Anti-mesmice medida, não opinada:** regra dos 4 eixos (mundo, lente dominante, família de acento, transição) com `registrar` que recusa repetição (cap 02), e animatic cinza que mede a altura do herói por plano (o teste pegou 14% num plano que exige 20%, cap 01 §5.4).

---

## 5. Pendências consolidadas

### 5.1 PENDÊNCIAS YOUTUBE (deduplicadas; nenhum vídeo foi assistido)

| # | Título | Canal | Link | O que aprender | Cap |
|---|---|---|---|---|---|
| 1 | Motion Design Process: Art Direction & Style Frames | The Futur | https://www.classcentral.com/course/youtube-motion-design-process-art-direction-style-frames-109064 | quantos style frames apresentar e como conduzir o portão | 01 |
| 2 | Nothing Phone (3) Trailer | Nothing | https://www.youtube.com/watch?v=kLmCLaj7NxQ | ritmo de corte, matriz de pontos, luz dura | 02 |
| 3 | Blender Clay render Tutorial (Render Breakdown) | xyz3dlab | https://www.youtube.com/watch?v=CSBStg6pyZM | subsuperfície e luz de clay | 02 |
| 4 | Introducing AirPods Pro 3 | Apple | https://www.youtube.com/watch?v=EMmKs8vMKhU | estrutura de filme premium, explodida de peça pequena | 02, 03 |
| 5 | Introducing iPhone 17 Pro | Apple | https://www.youtube.com/watch?v=IhZRSC9w3Mw | decupagem plano a plano (lente, duração, luz) | 03 |
| 6 | Introducing Phone (3a) Series | Nothing | https://www.youtube.com/watch?v=ZizbGaSnIUE | identidade gráfica comandando luz e transição | 03 |
| 7 | Introducing Linear Agent | Linear | https://www.youtube.com/watch?v=mRql2VJ99gM | revelação de texto e cascata em UI escura | 03 |
| 8 | Introducing Notion 3.0 | Notion | https://www.youtube.com/watch?v=R1cF4T4lgI4 | ritmo de digitação e cascata | 03 |
| 9 | Creating Water Droplets with Geometry Nodes | Joey Carlino | https://youtu.be/g72JfGE7o3E | árvore de nós de gotas em lata | 03 |
| 10 | How to Create Steam w/ Mantaflow | Blender Made Easy | https://www.youtube.com/watch?v=_K0XsHht6pg | material de vapor sobre fumaça | 03 |
| 11 | Steaming Coffee Animation Tutorial | via BlenderNation 2026 | https://youtu.be/8jv2n2RElf4 | vapor em versão recente | 03 |
| 12 | Product water splash Simulation in blender | não identificado | https://www.youtube.com/watch?v=DbewtqTrzgo | splash de produto no Mantaflow | 03 |
| 13 | Blender 4.2! New tone mapping, Khronos PBR Neutral | não identificado | https://www.youtube.com/watch?v=iQ3m0CfuSmg | Khronos x AgX em produto | 05, 06 |
| 14 | What is Normalize lighting in Blender 4.5? | não identificado | https://www.youtube.com/watch?v=lLoBGZgMzJw | `normalize` ao escalar luz | 05 |
| 15 | Blender Car Paint Material with Metallic Glitter | não identificado | https://www.youtube.com/watch?v=vzLzkEGRiZI | escala de flocos e Coat Normal | 06 |
| 16 | Blender 5.0 VSE compositor modifier (effects reel) | não identificado | https://www.youtube.com/watch?v=CJvlpxKc_hs | efeitos de compositor nas faixas do VSE | 08 |
| 17 | Making Giants, parte 10 (som) | School of Motion | https://schoolofmotion.com/blog/making-giants-sound-design | arco de áudio e timing de efeitos | 08 |
| 18 | Abstract 3D Motion Design Loop | Ducky 3D | https://www.youtube.com/watch?v=agNT-6IxN2I | loop perfeito e ritmo | 11 |
| 19 | Bender, Abstract Design Tutorial (2.8) | Ducky 3D | https://www.youtube.com/watch?v=gPsLC9Ol-Vs | deformação abstrata | 11 |
| 20 | Make An Abstract Motion Graphic in Blender 2.82 | Ducky 3D | https://www.youtube.com/watch?v=bmuNyG8h_TE | composição de mograph | 11 |
| 21 | Intro to Motion Graphics (trailer CG Cookie) | Ducky 3D | https://www.youtube.com/watch?v=OzwXdErVqmQ | só a ementa (pago) | 11 |
| 22 | Easy Abstract Animation With Geometry Nodes | Ducky 3D | busca: https://www.youtube.com/results?search_query=Ducky+3D+Easy+Abstract+Animation+With+Geometry+Nodes | GN para animação abstrata | 11 |
| 23 | Modern Kinetic Animated Loop | Ducky 3D | busca: https://www.youtube.com/results?search_query=Ducky+3D+Modern+Kinetic+Animated+Loop | tipografia cinética | 11 |
| 24 | How To Make Your Renders Pop | Ducky 3D | busca: https://www.youtube.com/results?search_query=Ducky+3D+How+To+Make+Your+Renders+Pop | contraste, cor e luz | 11 |
| 25 | Geometry Nodes Transition Tutorial | Ducky 3D | busca: https://www.youtube.com/results?search_query=Ducky+3D+Geometry+Nodes+Transition+Tutorial | transição procedural | 11 |
| 26 | 3 Tips To Look like a Pro Blender Artist | Ducky 3D | busca: https://www.youtube.com/results?search_query=Ducky+3D+3+Tips+To+Look+like+a+Pro+Blender+Artist | acabamento | 11 |
| 27 | 5 Ways You Can Make Motion Graphics in Blender | Ducky 3D | busca: https://www.youtube.com/results?search_query=Ducky+3D+5+Ways+You+Can+Make+Motion+Graphics+in+Blender | panorama | 11 |
| 28 | How to do Product Animations in Blender | Kaizen | busca: https://www.youtube.com/results?search_query=Kaizen+How+to+do+Product+Animations+in+Blender | animação de produto | 11 |
| 29 | Geometry Nodes Looping Animations [VJ Style] | Kaizen | busca: https://www.youtube.com/results?search_query=Kaizen+Geometry+Nodes+Looping+Animations+VJ+Style | loops procedurais | 11 |
| 30 | Mirror Light Show using Geometry Nodes | Kaizen | busca: https://www.youtube.com/results?search_query=Kaizen+Mirror+Light+Show+Geometry+Nodes | luz e reflexo procedural | 11 |
| 31 | Creating Perfect Cloth without Cloth Simulations | Kaizen | busca: https://www.youtube.com/results?search_query=Kaizen+Creating+Perfect+Cloth+without+Cloth+Simulations | tecido sem simulação | 11 |
| 32 | Geometry Nodes based Audio Visualizer | canal a confirmar | https://www.youtube.com/watch?v=8jq9iqjSpuE | reação a áudio | 11 |
| 33 | Playlist Geometry Nodes Blender Tutorials | canal a confirmar | https://www.youtube.com/playlist?list=PLsGl9GczcgBsv58A4sTYSmLDhipykRS4O | base de GN | 11 |
| 34 | Procedural ATM Card Motion Graphics | Derek Elliott | https://www.youtube.com/watch?v=O2xkMsAVG_Q | cartão procedural | 11 |
| 35 | Folding Box Packaging Animation [Full Process] | Derek Elliott | busca: https://www.youtube.com/results?search_query=Derek+Elliott+Folding+Box+Packaging+Animation+Blender | embalagem dobrando | 11 |
| 36 | Exploded view animation from a CAD file (3.0) | Derek Elliott | busca: https://www.youtube.com/results?search_query=Derek+Elliott+exploded+view+animation+CAD+Blender | explodida de CAD | 11 |
| 37 | UX/UI Animation in Blender 2.8 | Derek Elliott | busca: https://www.youtube.com/results?search_query=Derek+Elliott+UX+UI+Animation+in+Blender | interface em 3D | 11 |
| 38 | Product Design in Blender: Headphones | Derek Elliott | busca: https://www.youtube.com/results?search_query=Derek+Elliott+Product+Design+in+Blender+Headphones | modelagem de eletrônico | 11 |
| 39 | Practical Material Development in Blender | Derek Elliott | busca: https://www.youtube.com/results?search_query=Derek+Elliott+Practical+Material+Development+Blender | material com imperfeição | 11 |
| 40 | Building a holographic shader (plus jet engine!) | Derek Elliott | busca: https://www.youtube.com/results?search_query=Derek+Elliott+holographic+shader+jet+engine | shader holográfico | 11 |
| 41 | Mograph and Lighting stream | Polyfjord | https://www.youtube.com/watch?v=h9WKsqDKj90 | luz para mograph | 11 |
| 42 | Polyfjord Tutorial Cinematic Universe, Vol. 1 | Polyfjord | https://www.youtube.com/watch?v=X-D3fcTV1Uc | coletânea | 11 |
| 43 | #44: Creating Viral Tutorials, w/ Polyfjord | canal externo | https://www.youtube.com/watch?v=jae_L4q8Gz8 | ritmo e clareza | 11 |
| 44 | Introducing Robots by Polyfjord (trailer) | Polyfjord | https://www.youtube.com/watch?v=u0DKedc34mw | só a ementa | 11 |
| 45 | How to make Apocalyptic Cities, Lazy Tutorials | Ian Hubert | https://www.youtube.com/watch?v=qNba2oEij2c | cenário rápido | 11 |
| 46 | Animate Moths, Lazy Tutorials | Ian Hubert | https://www.youtube.com/watch?v=imkSdlbXB_U | animação secundária barata | 11 |
| 47 | Make Nightmare Men, Lazy Tutorials | Ian Hubert | https://www.youtube.com/watch?v=bgfJIZEDY44 | personagem simples | 11 |
| 48 | Realistic Glass in Cinema 4D + Redshift | Greyscalegorilla | https://www.youtube.com/watch?v=G369nusDX4s | vidro de produto | 11 |
| 49 | Using Light Gobos in Redshift | Greyscalegorilla | https://www.youtube.com/watch?v=mDT94FHPg9c | gobo e persiana | 11 |
| 50 | Getting to Know Redshift for Cinema 4D | Greyscalegorilla | https://www.youtube.com/watch?v=LcxjkHFS-2k | render físico | 11 |
| 51 | 3 Quick Tips for Better and Faster Redshift Renders | Greyscalegorilla | https://www.youtube.com/watch?v=ZsqM8QHZ0pQ | otimização | 11 |
| 52 | Greyscalegorilla Guide to Redshift | Greyscalegorilla | https://www.youtube.com/watch?v=Ni4A5LQGhpk | panorama | 11 |
| 53 | Playlist Learn Cinema 4D | Greyscalegorilla | https://www.youtube.com/playlist?list=PL_KyR3yGDJFvABUPOgYlQXR078NHNXbu4 | fundamentos de mograph | 11 |
| 54 | The Story Behind Blender's Donut Tutorial | Blender Guru | https://www.youtube.com/watch?v=vb1uZf4n9Vg | didática | 11 |
| 55 | CG Geek vs. Ai | CG Geek | https://www.youtube.com/watch?v=XWo0NRdafLk | onde a IA erra em 3D | 11 |
| 56 | 13+ AMAZING New Blender Channels, Addons and Projects | Curtis Holt | https://www.youtube.com/watch?v=YmzL3OCA52s | novos canais | 11 |
| 57 | EJ Hassenfratz @ NAB 2020 | Eyedesyn | https://www.youtube.com/watch?v=DmAaVyhfCXI | 3D estilizado | 11 |

Sem vídeo específico (só sugestão de canal): 04 (Ducky 3D, School of Motion, CG Boost), 07 (Blender Guru, CG Cookie, Blender oficial), 09 e 10 (remetem ao 11 e ao 08).

### 5.2 [testar no Blender] consolidado por capítulo (uma linha cada, sem repetição)

**01**
- Animatic `animatic_blocking.py` com `blender -b` na RTX: tempo a 270x480 e troca de câmera por marcador em `render(animation=True)`.
- Vídeo do animatic pelo FFmpeg do Blender com `media_type = 'VIDEO'`.
- Gabarito de zona segura por Box Mask em `compositing_node_group` (1080x1920 e 1080x1350).
- Micro-tremor e alças de ease-out forte comparados ao `AUTO_CLAMPED` numa folha de contato.
- Exemplo 5: líquido sem simulação (deslocamento, coroa por shape key, condensação instanciada) e tempo Cycles por quadro.
- Animação "em dois" com `CONSTANT` a 30 fps.
- Tamanho mínimo de texto medido num celular real.

**02**
- Render e `qa.py` dos 9 mundos sem prova (diorama, orgânico, brutalista, macro, retrofuturo, editorial, fitas, arquitetônico, color block).
- Holográfico, papel e têxtil no `qa.py` oficial e no EEVEE.
- Por que `Light.diffuse_factor = 0` e `visible_diffuse = False` na luz não tiraram a luz do piso no Cycles.
- Strength do sol e Orthographic Scale do diorama em 9:16.
- Fitas: Curve com Bevel e Twist contra GN Curve to Mesh em tempo de render.
- Color block: luminância de fundo em que o AgX começa a desaturar `#2F6FDE`.
- Grade de miniaturas 360x640 dos 19 mundos.

**03**
- Bake do Mantaflow no Blender completo (falhou no bpy-módulo); se falhar, caminho D vira padrão.
- `tela_camadas_explodidas.py` na RTX (Cycles e EEVEE, 1080x1920) com `qa.py`.
- Refração por raytracing no EEVEE 5.2 para vidro de cobertura (nomes: `use_raytrace_refraction`, `surface_render_method`, ver 06).
- Filtro de pixel 1,0 contra 1,5 na nitidez de texto de UI.
- `condensacao_gn.py` renderizado a 100 mm e custo Cycles.
- `vapor_volume.py` renderizado em contraluz, com gradiente radial.
- Tabela de tecidos (seda, algodão, veludo, couro) e cache invertido do pano.
- Líquido 0,1 mm maior que a cavidade contra igual, e bounces num frasco com tampa de vidro.
- Cáusticas MNEE no frasco: tempo e ruído na RTX.
- Nó de distribuição em volume no 5.2 e bolha de IOR 1,0 dentro de IOR 1,33.
- Modificador Build do Grease Pencil v3 e `bevel_factor_end` como alternativa.
- Troca de `body` de texto por handler em `blender -b`.
- Medição da interface atual do Reels e do TikTok.

**04**
- `prova_pushin_orbita.py` a 1080x1920: f/4 contra f/8 no fim do push-in.
- `bokeh_max_size` de 100 px contra o borrão de f/2,8 com 135 mm; `use_bokeh_jittered` com 64 amostras.
- Velocidades das tabelas 4.1 e 4.2 vistas em tela de celular.
- Limite de estroboscopia (10% da largura por quadro com shutter 0,5).
- Shutter animado por chave no render de animação.
- Passos de motion blur do EEVEE no whip pan rotacional (4, 6, 8).
- Diferença de brilho na transição "zoom pela tela" (meta < 2%).
- Follow Path com pontos desiguais.
- `sensor_fit = 'VERTICAL'` servindo 9:16 e 16:9.
- Troca de interpolação da chave compartilhada na antecipação.

**05**
- `teste_antes_depois.py` a 540x960 com OptiX e `qa.py` real.
- Mesma prova em EEVEE: `visible_camera` nos cartões e transluz com raytracing.
- Fator de energia do spot no EEVEE.
- Tempo de névoa em Cycles OptiX e EEVEE a 1080x1920 (tile 4 e 8).
- `mundo_hdri_reflexo` com HDRI de estúdio Poly Haven em Cycles e EEVEE.
- Light linking com emissor de logo e shadow linking com mão.
- Gobo por nós dentro da luz no Cycles.
- Junção de passe Standard (logo) com render AgX no compositor (ver também 06 item 9 e 08).
- Painel de histograma no Image Editor do 5.2.

**06**
- Thin Wall no EEVEE: zerar Thickness por script e `thickness_mode = "SLAB"`.
- Holográfico no EEVEE por Layer Weight e rampa.
- Desgaste de borda no EEVEE por GN (Edge Angle → atributo).
- Nó AO com `Inside` no EEVEE 5.2.
- Coeficiente do Volume Absorption contra o nó Volume Coefficients.
- Texture bombing por Voronoi: costura e custo.
- Toon com outline e Line Art no EEVEE.
- Khronos PBR Neutral num rig completo: estourado contra AgX.
- Gelo com malha interna de bolhas.
- Escolher e registrar a textura CC0 de digitais.

**07**
- VRAM (4 ou 6 GB) e driver 575+ com `nvidia-smi`.
- Seis tempos da tabela 3.6 medidos (frasco e celular).
- `teste_amostras.py` na GPU: OIDN GPU, OIDN CPU e OptiX.
- VRAM com 4, 8 e 16 texturas 4K, com e sem `texture_limit_render` e cache `.tx`.
- Ganho de `use_persistent_data` com só a câmera em movimento.
- CPU + GPU contra só GPU no notebook.
- Throttling térmico (quadro 1 contra quadro 400).
- Tamanho do EXR multicamada com DWAA, PIZ e ZIP.
- `use_placeholder` com duas instâncias na mesma pasta.
- Banding de degradê escuro no EEVEE (meia precisão).

**08**
- `compositor_acabamento.py` em 1080x1920 nos 7 mundos (bloom, grão 2,5% depois da recompressão, nitidez 0,06).
- Tempo do compositor em GPU.
- Softness e Factor do asset Film Grain sem perder nitidez.
- Caminho do `compositing_nodes_essentials.blend` no Windows.
- Laço automático de compensação de cor de marca no AgX MHC.
- Khronos nos 7 mundos (separação produto e fundo).
- Curva do `CompositorNodeCurveRGB` e `view_settings.curve_mapping` por script.
- Look próprio (LUT) no config OCIO do 5.2.
- DCTL do AgX no Resolve gratuito.
- `eventos_de_som.py` filtrando objetos fora da câmera.
- Montagem automática no VSE a partir de `grade_de_batidas.py` e `eventos.json`.
- Texto 3D com chanfro e contraste medido.
- Medidor de loudness no VSE do 5.2.

**09**
- `cena_exemplo.py` a 50% na RTX e ordem `-s -e` antes de `-a`.
- Isolamento de luzes com GPU e no Cycles (contorno iluminando parede a 13 cm).
- `assets_polyhaven.py` com rede liberada (cache e User-Agent).
- ambientCG v3 com `include`.
- GLB com Draco no Blender completo e seleção após importar.
- SVG real com furos (O, A, B).
- Driver com função Python em `blender -b`.
- FFmpeg com `--factory-startup` no 5.2.
- `font_bold` e `body_format` em texto 3D.
- Servidor MCP oficial: ferramentas, tempo limite e busca na API 5.2.
- MP4 pelo VSE por script (`strips.new_image`).
- Volta 5 da cena de exemplo (contraste, quadros 12, 66, 113, 165, faixa de coat).

**10**
- `qa.py` e `qa_extra.py` nos mesmos 20 quadros aprovados para alinhar faixas.
- Máscara de produto automática por Cryptomatte V2 ou `film_transparent`.
- Nova métrica de sombra de contato colada no contorno inferior.
- Checagem `bpy` de fresta (item 19) e de objetos sem função (item 21).
- `movimento_qa.py` detectando antecipação, settle e overlap.
- Medidas de aspereza uniforme e de banding.
- Laudo gerado automaticamente a partir do JSON.

**11**
- Fichas de decomposição dos 10 filmes da seção 3 e dos 8 da 3.11.
- Hornet e Nathan Kim; portfólio da ManvsMachine.
- Licença do Kenney e do Poly Pizza.

---

## 6. O que ficou fraco ou não verificado

1. **Nada foi medido na RTX 3050 nesta rodada.** Fora os três tempos do Laboratório, todos os tempos de render, VRAM e farm são estimativa por regra de escala feita em CPU de 2 núcleos.
2. **O `qa.py` real nunca rodou nos testes da base.** Cada capítulo usou um medidor diferente (p95 menos p5, desvio padrão, `qa_extra`), então as faixas de contraste não são comparáveis entre capítulos.
3. **Nove dos 19 mundos são direção de arte no papel**, sem render; os três provados na nuvem usaram medidor caseiro.
4. **Zonas seguras sem fonte oficial** para TikTok e YouTube Shorts; os valores de pixel divergem até 250 px entre fontes secundárias.
5. **Fórmulas de leitura e tamanho de texto são derivadas** (Netflix, BBC, WCAG), não medidas em anúncio; duas fórmulas convivem.
6. **Splash por Mantaflow falhou** no bpy-módulo; o caminho de líquido "real" está sem prova.
7. **Nenhum vídeo do YouTube foi assistido** (57 pendências), e as fichas de decomposição dos filmes de referência têm luz, câmera e som em branco.
8. **Spec do Instagram Reels e loudness das redes** vêm de prática e fonte não oficial; o teste de loudness usou sinal sintético e dois medidores discordaram em 0,9 LU.
9. **EEVEE quase não foi provado em luz e material** (rigs, vidro, cartões, light path do HDRI, Thin Wall); a regra "filme híbrido" depende disso.
10. **MCP oficial do Blender Lab** foi descrito por fonte de terceiros (versão, número de ferramentas); a página oficial não abriu.
11. **Várias páginas do manual 5.2 e das notas de versão 5.x não abriram**; o que salva é a sonda, que confirma nome, não comportamento visual.
12. **Licenças pontuais sem conferência**: Kenney, BlendKit (lata), fontes Google família a família, DCTL do AgX no Resolve gratuito.
13. **Valores físicos de produto não medidos**: raio do canto do celular, lata de 350 ml, espessura de frasco e de papelão, pontuação OctaneBench.
14. **Regras de duração e ritmo (hold, número de planos, push-in) têm números diferentes entre capítulos** e nenhum foi validado assistindo o filme montado no celular.
