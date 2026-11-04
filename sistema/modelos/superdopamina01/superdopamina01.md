# superdopamina01: uma imagem por palavra, a legenda fica, o pico explode

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde (`moldes/superdopamina01/`), vale o que está aqui.

**Estado (2026-11-03): em prova, aguardando o olho do dono.** Ainda não há vídeo aprovado, então ainda não existem
`referencia/`, `exemplos/` nem `assinatura.json`, e o `tools/parece.py` não roda. Até a aprovação, a régua é: as duas
decupagens em `analise/refN_decupagem.md` (quadros medidos em `analise/q/`, folhas `analise/refN_tl_*.png`), o estudo do
lote em `treinamento/super-edicao-dopamina/` e a vitrine `oficina/2026-11-03-superdopamina01-vitrine/out/final.mp4`.
**A referência própria definitiva é pendência:** a vitrine foi feita com a gravação comum de 30 s (só ~16 s com imagem,
para poupar crédito); o vídeo aprovado que vira `referencia/` tem de ser um vídeo do @ojessegomes inteiro no modelo, com
roteiro escrito para ser ilustrado (§9, passo 1). Quando o dono aprovar: copiar o aprovado para
`exemplos/vitrine-superdopamina01.mp4`, rodar `tools/assinatura.py superdopamina01` e `tools/referencia.py
superdopamina01`, tirar o `--sem-adaptar` da §9 e trocar este parágrafo pela linha padrão da referência.

**Uso:** a vitrine de edição do @ojessegomes, o nível máximo de estímulo, vertical 1080x1920.

**As referências mostram o jeito, não um roteiro (G32).** São dois vídeos de criadores de fora (ref1 @editbymmh,
minidocumentário narrado, 16:9; ref2 @sam.john.creates, criador falando + motion, 4:3). Nenhum texto, imagem, tema,
número, marca, som ou cor delas entra num vídeo: elas são medida. Não vão para o EditOS aberto (G27).

Herda `.claude/skills/criar-modelo/referencias/heranca.md` e o `REGRAS.md` (G1–G37). Sobrescreve só o que está na
tabela "O que este modelo sobrescreve", no fim da §6, cada item com o motivo.

| Ref | De onde | O que ela ensina aqui |
|---|---|---|
| ref1 | painel "Final output" do post de @editbymmh (85 s) | a regra-mãe: imagem nova no início da palavra que ela ilustra, a cada 1–3 palavras (2,41 trocas/s, mediana 0,37 s); a legenda pequena que fica enquanto as imagens passam; picos tipográficos a cada ~6 s; número que pula de ordem; tarja que revela; momento-herói; estilos trocando; objeto-ponte; fecho que desacelera |
| ref2 | @sam.john.creates (49 s) | o mesmo com uma pessoa falando: fundo troca e o texto continua; palavra enorme na cor do sentido; a palavra faz o que diz; respiro com a pessoa no miolo; mosaico antes da chamada; a palavra do pedido grande no fim |

---

## 0. Do seu jeito (o dono preenche e vai somando)

- Meu nome e @ (só onde o modelo mostra; hoje nenhum lugar mostra):
- Chamada do fim (o que peço para a pessoa fazer):
- Paleta (noite, creme-lima, sangue) ou as minhas cores:
- Gosto de:
- Não quero:

**Para o assistente:** leia esta seção antes de tudo. A paleta e qualquer cor solta escrita aqui valem sem pedir licença
(`"paleta"` e `"cores"` no `src/plano.json`). O resto da cara (fonte, posições, tamanhos, ritmo) só muda avisando antes.
Quando o dono corrigir algo e valer para os próximos vídeos, anote aqui nas palavras dele e no `CORRECOES.md`.

---

## 1. A cara do modelo

**A forma de execução, em uma frase:** cada palavra concreta da fala ganha a sua imagem no instante em que é dita (uma
troca a cada 1 a 3 palavras, em ondas de rajada e respiro), enquanto uma legenda pequena e fixa acumula a frase por cima;
a cada ~6 s um número ou palavra explode em tipografia enorme que se mexe, e cada evento tem o seu som.

Duas faixas independentes, e é isso que separa este modelo de todos os outros da casa:
- **A faixa de imagem** troca rápido: imagem (gerada ou livre), a pessoa (aberto, fechado, close da mesma tomada), a
  mesma imagem trocando de estilo, uma rajada, um mosaico, dois painéis, um cartão chapado. Corte seco no 1º quadro da
  palavra ilustrada.
- **A faixa de texto** troca devagar: a **legenda-âncora**, Inter Tight 700 branca, pequena, num lugar só (logo abaixo do
  queixo mais baixo medido; na vitrine y 1088), acumulando a frase palavra a palavra; só troca de bloco no fim do trecho (G35). **Corte de imagem não é corte de
  texto** (E4): é assim que a imagem anda a 0,2–0,4 s sem ferir o tempo de ler.
- **O pico**: uma palavra ou número do bloco vira tipografia enorme (Inter Tight 900, laranja na paleta padrão) logo
  abaixo da 1ª linha, e se mexe: entra com soco e foco, número pula de ordem de grandeza (1% → 10% → 100%).

**Os três sinais de reconhecimento, mudo, em 1 segundo:**
1. a imagem de baixo troca várias vezes enquanto a mesma linha de legenda continua parada e crescendo;
2. a legenda pequena branca, sempre no mesmo lugar, com o resto da tela mudando;
3. a palavra/número enorme que entra com soco e se mexe (conta, pula, digita).

**O que separa dos vizinhos** (lidos, nenhum alterado; triagem em `TRIAGEM.md`):

| Modelo | A frase dele | O que separa |
|---|---|---|
| dynamic01 | a fala se escreve na tela, corte seco pessoa ↔ cartão chapado; o pulso vem do reenquadramento | lá o texto **troca junto** com a tela (tela ≥ 1,5 s, 42–56 trocas/min) e é proibido flash, efeito e som. Aqui a imagem troca a ~2/s **por baixo** de um texto que fica, com som em cada evento. Os dois têm "palavra-chave grande", mas o dynamic01 não tem imagem nenhuma |
| modelodinamico01 | a tela encena a frase com interface de verdade, microação a cada 0,5–1 s | lá a unidade é a **frase** (um card de interface por frase, fundo creme com grade); aqui é a **palavra** (uma imagem por palavra concreta), sem interface |
| modelodinamico03 | podcast cinematográfico: tratamento quente na pessoa, destaques tipográficos por cima dela, ~4 cortes/min | lá o ritmo vem do texto sobre um plano longo e há cor na gravação; aqui ~36x mais cortes e a gravação crua |
| superpodcast01 | cada frase ganha a imagem do que está sendo dito, mundos em corte seco | o parente mais perto, mas **10x mais lento** (~24 cortes/min, uma imagem por frase, a legenda zera a cada plano). Aqui uma imagem a cada 1–3 palavras, a legenda **atravessa** o corte, picos que se mexem, som por evento |
| ojgstyle01 | o estilo do Jessé: gravação crua, a legenda é a protagonista, nenhum efeito nem som | o oposto em estímulo: lá ~4 cortes/min, só a voz; aqui ~110/min, efeito e cama. Os dois usam a gravação sem tratamento |

Não misturar: o que se ensina aqui (piso de 0,17 s, legenda que atravessa o corte de imagem, som por evento) fica só
neste modelo (G12).

**O encanto (de onde vem a dopamina, ref1 §3 da ficha):** a recompensa de reconhecimento ("ele disse touro, vi o touro")
3 vezes por segundo, sem perder o fio porque o texto não troca junto; o contraste entre rajada e respiro; o número que se
mexe; o enigma da tarja. **O que as referências evitam (e o modelo também):** a mesma densidade o vídeo inteiro (ref1
desce para 4–5 trocas por 5 s no fecho); legenda grande disputando com a imagem; plano parado; tela de texto sem imagem
por muito tempo; efeito sem som.

## 2. Os números do modelo

Medidos nas duas referências (as de 16:9 e 4:3 traduzidas para 1080x1920) e fixados aqui. A vitrine é a §10.

| Item | Nas referências | No modelo (1080x1920) |
|---|---|---|
| Trocas de imagem | `tools/ritmo.py`: **ref1 2,41/s**, ref2 1,52/s (`medir_curto`: 108,7 e 58,5 cenas/min) | **1,8 a 2,6 por segundo no plano** (o checador conta corte, estilo, imagem da rajada e ladrilho; avisa fora, reprova abaixo de 1,4). O `ritmo.py` mede menos que o plano (não vê troca entre fotos escuras parecidas nem ladrilho): no trecho com imagem, confira **≥ 1,8/s no `ritmo.py`** |
| Intervalo entre trocas | ref1 mediana 0,37 s (p25 0,17, p75 0,57); ref2 0,60 s | mediana **0,25–0,45 s** |
| Rajada | ref1 20–25 s: 0,17–0,25 s por plano por 1 a 3 s; ref2 0–7 s | **piso 0,17 s (5 quadros)**; abaixo de 0,3 s só em rajada de **no máximo 3 s**, depois respiro |
| Janela de 5 s | ref1 4 a 16 cenas; ref2 2 a 8 | **nenhuma janela com menos de 4 trocas** (a do fecho, 3) |
| Pico tipográfico | ref1 ~13 em 85 s (1 a cada ~6,5 s); "$100,000,000" 83% da largura | **1 a cada 5–8 s**; **um tamanho só no vídeo**: o maior em que o pico mais longo cabe em 92% da zona (140–260 px; vitrine 164 px) |
| Momento-herói | ref1 12,2–15,2 s, um no vídeo | **um por vídeo**, ~2 s, na frase-promessa |
| Legenda-âncora | ref1: 4,1–5,2% da altura do 16:9, 13% da largura para 9 letras, no centro | **64 px** Inter Tight 700, topo da 1ª linha **40 px abaixo do queixo mais baixo** (entre y 900 e 1150; sem rosto, 1000; vitrine 1088), até 2 linhas (entrelinha 71 px) |
| Tempo em cartão chapado | ref1 tela preta 1,5 s (26,0–27,5); ref2 cartões de 0,5–1 s | **no máximo 4,0 s seguidos** |
| Pessoa | ref2 55% com rosto; ref1 narrado | **15–35% do tempo**: a abertura (gancho), respiros e reenquadramentos; no máximo 3 planos da pessoa seguidos |
| Fecho | ref1 75–85 s: 4–5 trocas por 5 s, planos de 0,5–0,7 s | desacelera: a última janela pode ter 3 trocas |
| Luz e cor da gravação | — | **as da gravação**: o modelo não mexe (G33) |

## 3. Cenas e ritmo

**Os planos da faixa de imagem** (`"planos"` no `src/plano.json`, cada um começa numa palavra: `"de": [índice, "palavra"]`):

| Tipo | Como é | Quando a fala pede |
|---|---|---|
| `img` | imagem em tela cheia, sempre andando (`mov`: empurra 1,00→1,08, recua, gira ±1,6°, desliza ±26 px), vinheta e faixa escura embaixo para a legenda | toda palavra concreta (objeto, lugar, ação, gente sem rosto) |
| `rajada` | várias imagens em sequência, `passo` 0,17–0,25 s | lista, "qualquer tipo de", enumeração, "tudo isso" |
| `estilos` | a mesma imagem trocando de estilo a cada 0,17 s (natural, duotone, P&B, negativo, arquivo) | verbo de movimento, velocidade, "de novo", "aceleradas" (E10) |
| `mosaico` | ladrilhos 2 colunas entrando um a um (`passo` ≥ 0,17 s); `escuro` (0–1) escurece por cima | "vários", "muitos", quantidade; recapitulação; o fundo do fecho (`passo` 0,5, `escuro` 0,62) |
| `paineis` | dois painéis com a própria gravação a 3x; `sobe` desliza para cima numa palavra | "duas", comparação, prévia, "aqui em cima" |
| `pessoa` | a gravação, `plano` aberto 1,0 / fechado 1,25 / close 1,5, o zoom puxado do queixo | o gancho, a opinião, o respiro depois de uma rajada ou do herói |
| `card` | cartão chapado `preto`, `creme` ou `destaque`, com luz que anda devagar e grão | o pico de tela cheia, a tarja, o herói, o fecho |

**Quem decide o corte é a palavra:** a imagem entra no 1º quadro da palavra que ela ilustra (o corte cai 1 quadro antes
do `start`, E2). Dentro de uma rajada o passo é fixo. Palavra de ligação ("de", "que", "o") não ganha imagem: a imagem da
palavra concreta anterior segue até a próxima.

**Ondas:** rajada (0,17–0,25 s) por no máximo 3 s → respiro (0,5–1,5 s: a pessoa, um cartão, uma imagem mais longa) →
ritmo de cruzeiro (0,3–0,6 s). O fecho desacelera. Nenhuma janela de 5 s com menos de 4 trocas.

**A pessoa:** abre o vídeo (heranca §4: "abre com a pessoa, o gancho escrito desde o quadro 0") e volta como respiro. No
máximo 3 planos seguidos dela (reenquadramentos secos, enquadres diferentes a cada corte); depois volta a imagem.

## 4. Repertório

**Os picos** (`"picos"` no plano; um por bloco, no máximo 1 linha de legenda antes e 1 depois):

| Voz | Como é | Gatilho |
|---|---|---|
| `conta` | número em algarismos que **pula de ordem**: 1% → 10% → 100%, um salto a cada 0,17 s, termina no número dito (E7) | todo número dito em algarismos |
| `gigante` | a palavra entra com soco (1,35 → 1,0 em 0,14 s, foco do borrão) e cresce 4% até o fim do bloco | o termo protagonista: nome, conceito, "diferença", número dito por extenso ("três vezes.") |
| `digita` | letra a letra com cursor | ano, código, nome de produto |
| `fixo` | o comando do fecho, no meio do cartão, fica até o fim; a fala segue embaixo | "comenta X" (heranca §2: só o comando fixo, a palavra entre aspas) |

**Número na tela = número falado (decisão da casa, G8).** "100%" dito → "100%" na tela (os saltos terminam nele).
Número dito por extenso ("três") fica por extenso: o pico `gigante` mexe a palavra, não troca a grafia.

**Os efeitos** (do catálogo de 26 do manual do lote; o que está pronto no molde):

| Efeito | No molde | Gatilho | Prova |
|---|---|---|---|
| Corte-palavra | `img` | toda palavra concreta | ref1 16,0–19,8 |
| Legenda-âncora | automático | sempre | ref1 21,2–22,0 |
| Rajada | `rajada` | lista | ref1 20–25 |
| Estilos trocando | `estilos` | verbo de movimento | ref1 41,5–42,7 |
| Pico + contador por saltos | `picos` | número, protagonista | ref1 28,5–29,3; ref2 12,0 |
| Tarja que revela | `"tarja": [[i, "palavra"]]` (o bloco inteiro) | virada ("mas", "só que"), segredo | ref1 26,2–27,3 |
| Mosaico que se monta | `mosaico` | quantidade, recapitulação | ref1 27,7–29,2; ref2 42,3 |
| Momento-herói | `"heroi": {de, ate, caixa}` | a frase-promessa, uma por vídeo | ref1 12,2–15,2 |
| Objeto-ponte | `"ponte"` (PNG recortado, atravessa os cortes) | troca de assunto, rajada (o objeto fica, o fundo troca) | ref1 0,2–3,7; ref2 13,8–15,8 |
| Flash com luz | `"flash"` | entrada de pico forte, troca de bloco (1 a cada ~8 s) | ref1 2,67 |
| Negativo relâmpago | `"negativo"` (desligado) | choque, nunca na pessoa | ref1 74,8 |
| Dois painéis | `paineis` | "duas", prévia | — (da casa) |
| Varredura/fade de saída | automático no fim | último 0,5 s | ref1 82,7–83,3 |
| Empurrão lento | toda `img` | sempre | ref1 (quase todas as fotos) |

**Ainda não estão no molde** (desenhe em `src/Reel.tsx` só se a fala pedir, e passe pelo olho do dono): gráfico vivo
(rosca/linha), número maior que a tela, HUD de análise, caixas de rastreamento, partículas, recorte da pessoa com
profundidade (precisa de máscara por quadro: `scripts/maos.py` já roda o RVM e é o caminho), silhueta de cor (só com
imagem, nunca a pessoa: G33), PIP redondo, tela em perspectiva (só interface fiel, G34), palavra esticada, cursor falso,
ícone-pontuação (existe só no efeito tipográfico de reserva, §8), mosaico de recapitulação com contador.

## 5. Texto na tela

- **Fonte:** Inter Tight (OFL), 700 na legenda, 900 no pico e no herói. Uma família, dois pesos (heranca §3). Larguras
  medidas da própria fonte (`scripts/larguras.py` → `src/larguras.json`), usadas para quebrar linhas e conferir a zona.
- **A legenda-âncora:** 64 px, entreletra -0,01 em, branca `#F7F5F0` com sombra larga e suave
  (`0 6px 42px rgba(0,0,0,.5)`, G37: nada de contorno ou glow colado). Sobre cartão creme, tinta `#0E0F12`, limpa.
  Cada palavra nasce **0,15 s antes da voz**, no lugar já reservado, num fade com foco de 8 px em 0,12 s. Nada empurra
  nada.
- **Um bloco é um trecho (G35):** termina na pontuação; trecho longo vira blocos do mesmo trecho nas `"quebras"` do
  plano. No máximo **2 linhas**. Bloco **≥ 1,5 s**; cada palavra **≥ 0,4 s** depois de nascer.
- **Lugar:** a 1ª linha sempre 40 px abaixo do queixo mais baixo medido (`src/rosto.json`; vitrine y 1088); o pico logo
  abaixo dela (+79 px); a linha de depois do pico logo abaixo do pico. São as 2 posições do vídeo (G15). O herói (centro) e o comando fixo do fecho
  (centro do cartão) são telas de destaque.
- **O gancho já está escrito desde o quadro 0** (G23, heranca §4): o 1º bloco aparece apagado (38%) e cada palavra acende
  na voz.
- **O pico:** a palavra/número do bloco que é o termo protagonista (G19), um por bloco, sempre exatamente como foi dito
  (G8). Sai da legenda (cada palavra aparece uma vez só, G14) e mora no lugar do pico. Laranja `#FD7D00` (paleta noite);
  sobre creme, tinta.
- **O herói:** o bloco inteiro em 124 px, digitado letra a letra (~0,035 s por letra), a câmera recua de 1,55× a 1,0 e o
  bloco assenta em 3D (rotateY −18° → 0, rotateX 9° → 0), desfoque de movimento enquanto anda; as palavras de `caixa`
  em caixa invertida creme com letra tinta.
- **A tarja:** cada palavra do bloco é uma barra branca até ser dita e se abre em texto (0,16 s) em tela preta.
- Nunca o nome do modelo na tela (G20). Nunca travessão. Nome e @ só os reais de quem fala, e só quando dados (G31).

## 6. Transições, som e fecho

- **Corte seco** em toda troca. O flash (luz branca quente que some em 0,2 s) marca a entrada de um pico forte ou a troca
  de bloco, no máximo 1 a cada ~8 s.
- **Fecho:** desacelera e recapitula (E17). O fundo é o mosaico das imagens que já passaram, escurecido, um ladrilho a
  cada 0,5 s; a chamada vira o pico `fixo` no centro (o comando, a palavra entre aspas em MAIÚSCULA, até o fim); a fala
  restante segue na legenda. Os últimos 0,5 s fundem ao preto com uma varredura de som.
- **Som (E18, ligado: são os efeitos do próprio modelo):** `scripts/final.py` toca um efeito em cada evento do
  `src/eventos.json` (o checador grava): corte = toque grave curto ("popup" grave, heranca §8, não swoosh); estilo =
  blip; rajada = sopro curto; ladrilho = tique; pico = subida + impacto grave; contador = tique por salto + sino; herói =
  teclas; tarja = estalo, com a cama sumindo 0,35 s antes da 1ª revelação; flash = subida + impacto; ponte = sopro de
  entrada e saída. **Cama contínua** (grave e ar, sem melodia) ~22 LU abaixo da voz, abaixando 4 dB sob ela: o piso nunca
  cai a silêncio entre frases (ref1 -24,8 dB, ref2 -22,7 dB de chão). Efeitos ~13 LU abaixo da voz. Final -14 LUFS,
  pico ≤ -1 dBTP. **Música é opção** (G21): `--trilha <wav>` (16 LU abaixo da voz, com ducking).

### O que este modelo sobrescreve (e por quê)

| Regra herdada | Aqui | Motivo ligado à forma de execução |
|---|---|---|
| REGRAS §3 / memória: evento a cada 0,3–0,7 s (piso 0,3 s) | **piso 0,17 s em rajadas de no máximo 3 s**, só para imagem | é a assinatura medida (ref1 25% dos intervalos abaixo de 0,17 s; rajadas em 20–25 s). **Exceção deste modelo, não da casa** |
| REGRAS §3 "nada atravessa um corte seco" | **a legenda atravessa o corte de imagem**; nunca atravessa o fim do trecho | E4: corte de imagem ≠ corte de texto. É o que deixa a imagem a 0,2 s e o texto no tempo de ler (G1 vale para o texto) |
| heranca §4 "nos primeiros 9 s, só o que abre e mais um" (S4) | a 1ª imagem entra no 1º número/palavra concreta (~1,5–2 s) | a densidade é a forma; o gancho continua na pessoa e escrito desde o quadro 0 |
| heranca §4 "no máximo ~3 cortes de zoom no vídeo" | reenquadramento seco da pessoa como respiro, no máximo 3 planos dela seguidos | sem imagem, o reenquadramento é o B-roll do modelo (§8) |
| heranca §5 "sem preto e branco"; "efeito no fundo desligado" | P&B, duotone, negativo e arquivo **só nas imagens**, 0,17 s cada, no `estilos` | E10/E14: a mesma ação em estilos é recurso da referência; a gravação da pessoa nunca recebe filtro (G33) |
| REGRAS §3 bloco ≥ 1,5 s | aceita **1,2–1,5 s** (aviso) só quando a fala não deixa outra divisão do trecho com cada palavra a 0,4 s | fala rápida de vitrine; a palavra continua ≥ 0,4 s e nasce com a voz |
| heranca §8 "efeitos sutis" | um efeito por evento (~2 por segundo), mas ~13 LU abaixo da voz | E18: o som é metade da dopamina; a voz continua na frente |

## 7. Opções (o que vem ligado e o que é escolha)

**Paletas: opção, não regra (G33).** O molde precisa renderizar uma, por isso há uma padrão.

| Papel | **Noite** (padrão, ref1) | Creme e Lima (ref2) | Sangue (ref2 22 s) |
|---|---|---|---|
| Preto do cartão | `#060507` | `#0E0F12` | `#0B090A` |
| Creme do cartão | `#F0EEEA` | `#F0EEEA` | `#E6E2DE` |
| Tinta (texto no creme) | `#0E0F12` | `#0E0F12` | `#130F11` |
| Texto | `#F7F5F0` | `#F7F5F0` | `#F4F0EC` |
| Destaque (pico, duotone) | laranja `#FD7D00` | lima `#C9DA3C` | vermelho `#D8322B` |

Cores soltas no plano (`"cores": {"destaque": "#..."}`) ou na prop (`--props='{"paleta":"creme-lima"}'`).

| Opção | Padrão | Como mudar |
|---|---|---|
| Tratamento de cor na gravação | **não existe** (G33) | o ajuste é do usuário, antes |
| Efeitos sonoros e cama | **ligados** (são do modelo) | `final.py` sem eles: não há chave; peça e eu desligo no plano |
| Música | desligada (G21) | `scripts/final.py out/so-video.mp4 out/final.mp4 --trilha public/trilha.wav` |
| Negativo relâmpago | desligado | `"negativo": [[i, "palavra"]]` (nunca na pessoa) |
| Flash | ligado nos picos fortes | `"flash": []` desliga |
| Objeto-ponte | ligado se houver o PNG | `"ponte": []` desliga |
| Imagem gerada por IA | **desligada** (regra absoluta do material, herança §0) | só liga se o dono pedir para aquele vídeo |

## 8. Zona segura, rosto, mãos, material e "Com o que o vídeo tiver"

- Todo texto em x 60–940 e y 250–1500 (o checador mede com as larguras reais da fonte). O rosto nunca fica coberto: o
  texto mora abaixo do queixo mais baixo medido, e o zoom puxa do queixo (ele não sai do lugar). **As mãos:** a pessoa
  costuma segurar o microfone no peito; `scripts/maos.py` mede mão e braço a cada 0,25 s (RVM + cor da pele) e o checador
  reprova acima de 15% do texto sobre elas na média de um plano da pessoa (avisa acima de 8%). O que fazer: imagem no
  lugar da pessoa naquele trecho, plano mais fechado, ou o pico num cartão.
- **O material (o gargalo):** ~2 imagens por segundo de fala com imagem (~150 por 85 s). A ordem é fixa:
  1. **Roteiro escrito para ser ilustrado** (R9): cada frase com 2 a 4 palavras concretas. Frase abstrata sem nenhuma vira
     respiro (a pessoa) ou é reescrita.
  2. **A lista palavra → imagem ANTES de editar:** `src/imagens.json` (id → `palavra` [índice, "palavra"], `arquivo`,
     `fonte`, `prompt`). `scripts/material.py --lista` confere contra a fala e escreve `material/LISTA.md`.
  3. **Só material do dono** (herança §0): `fonte: "usuario"` é o padrão. Gerar ou buscar **só com pedido explícito
     dele para aquele vídeo**; aí, `scripts/material.py --gerar` → kie.ai (Nano Banana 2.1, 1K, 9:16, ~4 créditos por imagem,
     ~40 s cada), com o estilo da casa no prompt (foto cinematográfica, pretos fundos, luz única, **sem texto, sem logo,
     sem marca**). Foto vira JPG q88 (~200–400 KB). `fonte: "kie+recorte"` recorta o fundo (objeto-ponte).
     `fonte: "livre"` = foto com licença aberta (`kit/buscar.py`, anotada no `ORIGEM.md`); `fonte: "usuario"` = arquivo
     do dono. **Nunca** filme, noticiário, foto de imprensa ou logo de terceiro (ref1 usa; nós não). Gente real só de
     foto real; IA só figurante sem rosto (silhueta, mãos, de costas).
  4. **O que faltar não trava o vídeo:** o plano que aponta para uma imagem ausente vira o **efeito tipográfico** (o fundo
     alterna preto/creme, ícones-pontuação ●■▲ entram, a legenda continua por cima: ref2 2,0–4,0 s) e a falta vai para
     `material/PEDIDO.md`.
  Imagem pode repetir em outra palavra (mosaico, recap, estilos): reaproveitar é barato e dá unidade.
- **Custo da prova** (só quando o dono pediu geração): gere só o trecho que vai provar o modelo (~15–20 s); o resto vai com a pessoa, cartões
  e reaproveitamento.

### Com o que o vídeo tiver (G32)

| O que a referência faz | Só com a gravação da pessoa (sem nenhuma imagem) |
|---|---|
| imagem nova por palavra concreta (ref1 2,41/s) | **reenquadramento seco** (aberto/fechado/close) + **efeito tipográfico** (fundo preto ↔ creme com a legenda atravessando, ícones-pontuação) a cada 1–3 palavras, nas mesmas ondas |
| rajada de imagens de uma lista | rajada de fundos chapados (preto/creme/destaque) a 0,2 s com a legenda parada por cima |
| mosaico, estilos trocando | dois painéis da própria gravação a 3x; estilos não entram (G33: nada de filtro na pessoa) |
| objeto-ponte 3D | o pico tipográfico atravessa o corte (o número segue enquanto o fundo troca) |
| B-roll de prova, gráfico de dados | o número dito como pico `conta`; prova de verdade só se o usuário der (vira pedido) |
| narração sem rosto (ref1) | o modelo funciona igual: sem `fala.mp4` com rosto, os planos `pessoa` viram cartões; a legenda e os picos não mudam |
| trilha e pacotes de efeito | a cama e os efeitos sintetizados do `final.py` (sem licença de terceiro) |

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio (`sistema/`), menos onde está escrito "na pasta do vídeo" (`oficina/<v>/`).

1. **Roteiro escrito para ser ilustrado** (R9; vale a skill `orquestrador-conteudo`): gancho de contradição resolvido na
   2ª frase, a frase-promessa (vai virar o herói), viradas marcadas ("mas", "só que"), números ditos em comparação, fecho
   com "você". Em cada frase, marque as palavras que viram imagem.
2. **Crie o vídeo:** `QUEM=<nome> sh tools/com-trava.sh .venv/Scripts/python.exe tools/novo-video.py superdopamina01 <gravacao.mp4> <AAAA-MM-DD-tema> --trocar Cloud=Claude --sem-adaptar`.
   O `--sem-adaptar` é obrigatório enquanto o modelo não tem `assinatura.json`. **Apague `public/img/`** que veio do molde
   (são as imagens da vitrine; o `material.py` lista as órfãs). Sem `ffmpeg` completo no PATH o `preparar.py` cai no filtro
   de voz (ver pendências); a gravação comum já tem a base pronta em `teste-comum/base/`.
3. **Meça as mãos** (na pasta do vídeo): `QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/maos.py`.
4. **Liste a fala** (na pasta do vídeo): `node scripts/conferir.mjs --palavras` (marca os fins de trecho).
5. **A lista palavra → imagem** em `src/imagens.json`, depois
   `../../kit/.venv/Scripts/python.exe scripts/material.py --lista` e, aprovada a lista,
   `QUEM=<nome> sh ../../tools/com-trava.sh ../../kit/.venv/Scripts/python.exe scripts/material.py` (gera só o que falta;
   `--folha` monta `material/folha.jpg` para olhar). Escreva o `roteiro.md` na pasta do vídeo (vai junto na entrega).
6. **O plano** em `src/plano.json`: `"planos"` (a faixa de imagem, §3), `"quebras"` (onde um trecho longo vira outro
   bloco), `"picos"` (§4; 1 a cada 5–8 s), `"heroi"` (um), `"tarja"`, `"ponte"`, `"flash"`, `"texto"` (grafia na tela:
   `{"84": "“EDIÇÃO”"}`), `"paleta"`, `"cores"`.
7. **Confira** (na pasta do vídeo): `node scripts/conferir.mjs` até `APROVADO`. Confere: plano bate com a fala; piso de
   0,17 s e rajadas ≤ 3 s; janelas de 5 s; trocas/s; cartão ≤ 4 s seguidos; pessoa ≤ 3 planos seguidos e enquadres
   diferentes; negativo fora da pessoa; cada palavra uma vez; bloco ≤ 2 linhas, ≥ 1,5 s (1,2 com aviso), palavra ≥ 0,4 s,
   sem passar da pontuação; pico no lugar e no tamanho; zona segura; texto fora do rosto e das mãos; 2 posições de
   legenda; travessão e nome do modelo. Grava `src/presentes.json` e `src/eventos.json`.
8. **Olhe quadros** (na pasta do vídeo): `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 0 1.5 ...`
   (um pacote só; saem em `conferencia/`). Olhe o quadro 0, um logo depois de cada pico, o herói, a tarja e o fecho.
9. **Renderize** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineSuperDopamina01 out/so-video.mp4 --codec=h264 --crf=18 --concurrency=2`.
10. **Som e final** (na pasta do vídeo): `QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/final.py out/so-video.mp4 out/final.mp4`
    (-14 LUFS, pico ≤ -1 dBTP, e entrega em `<perfil>/conteudo/` pelo `tools/entregar.py`).
11. **Prove:** folha de 1 qps (`.venv/Scripts/python.exe tools/folha.py oficina/<v>/out/final.mp4 --fps 1 --saida oficina/<v>/conferencia/folha-1qps.jpg`),
    ritmo (`.venv/Scripts/python.exe tools/ritmo.py oficina/<v>/out/final.mp4`: 1,8–2,6 cortes/s, movimento médio ≥ 4) e
    a folha lado a lado (na pasta do vídeo, `../../.venv/Scripts/python.exe scripts/lado_a_lado.py`, trocando o tempo
    "nosso" de cada par). Depois da aprovação do modelo, também `tools/parece.py`.

**O terceiro vídeo (tema chato, fala longa, sem prova):** a densidade não sobe sozinha. Se o roteiro não tem palavras
concretas, o vídeo cai para a pessoa + efeito tipográfico (§8) e fica abaixo de 1,8 trocas/s: o checador avisa. Volte ao
passo 1 e reescreva as frases para ter o que ilustrar; número sem fonte não vira pico.

## 10. A vitrine (para comparar)

`oficina/2026-11-03-superdopamina01-vitrine/` (a gravação comum de 30 s do Jessé, `teste-comum/gravacao.mp4`, base de
`teste-comum/base/`). Paleta noite. 20 imagens geradas (18 fotos + raio + a claquete recortada), cobrindo 1,7–19,9 s; o
resto vai com a pessoa, cartões e reaproveitamento.

| Tempo | Fala | Faixa de imagem | Texto |
|---|---|---|---|
| 0 s | Esse vídeo está sendo 100% editado pelo Claude. | pessoa fechado → cartão preto com flash em "100%" → imagem "editado" → pessoa close | gancho escrito desde o quadro 0; **100%** pula 1% → 10% → 100% (pico de tela cheia: tira o número de cima da mão com o microfone) |
| 3,1 s | Ele foi criado justamente para | "criado" (gira), "alvo" em "justamente" | legenda |
| 4,6 s | te mostrar a diferença entre vários modelos | "mostrar" → cartão creme com flash em "diferença" → mosaico de 6 em "vários" | **diferença** (pico) |
| 6,7 s | que eu criei e melhorei | "criei", "melhorei" | legenda (bloco de 1,33 s: a fala não deixa outra divisão) |
| 8,1 s | para editar qualquer tipo de vídeo usando o Claude. | "editar" → **rajada** de 5 tipos de vídeo a 0,2 s com a **claquete** atravessando → pessoa | legenda parada enquanto a rajada passa |
| 10,7 s | Inclusive, / se você estiver no Instagram agora, | pessoa fechado → "você" → "celular" → "relógio" | dois blocos (trechos) |
| 12,6 s | você está vendo apenas um desses modelos. | cartão preto | **herói** digitado, "apenas um" em caixa invertida |
| 14,5 s | Eu posso até colocar duas / prévias rápidas aqui em cima, | pessoa close → "colocar" → dois painéis a 3x → "raio" em "rápidas" → painéis sobem em "cima" | legenda |
| 17,9 s | aceleradas em três vezes. | "aceleradas" em estilos trocando → cartão preto com flash | **três vezes.** (pico) |
| 20,0 s | Mas se você quiser realmente ver | cartão preto | **tarja que revela** |
| 21,9 s | outros modelos de edição como esse e aprender | mosaico de recapitulação (8 imagens já vistas) → "editar" em estilos em "edição" → pessoa | legenda |
| 24,8 s | a como usar isso nos seus vídeos, | "aprender" → "editado" → "podcast" em estilos | legenda |
| 26,8 s | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | mosaico de recapitulação escurecido (6 imagens, 0,5 s cada) até o fim, fade | comando fixo **“EDIÇÃO”**; o resto na legenda |
