# pregacao: corte de pregação dinâmica

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde, vale o que está aqui.

**A referência é o `referencia/referencia.mp4`**, o vídeo aprovado do modelo (30 s, 9:16, com a voz). Os tempos entre
parênteses, como (6 s), apontam para ele. Do lado dele ficam a `folha.jpg` (1 quadro por segundo) e o `mapa.json`
(rosto, luz e cortes medidos a cada 0,25 s). Antes de editar, assista ao vídeo inteiro uma vez. O mesmo vídeo em qualidade cheia está no `original.mp4` e o `original-16x9.mp4`, a versão deitada, para ler letra pequena e detalhe de tela.

**A referência mostra o jeito do modelo, não um roteiro para copiar (G30).** O modelo é inspiração: o porquê e o como
de cada tela. Não se copia a sequência nem os tempos do aprovado. Cada momento descrito aqui é repertório, com o seu
porquê, e só entra onde a fala nova tiver o mesmo porquê.

Regras gerais: `REGRAS.md` §0 (G1–G35, reescritas pelo dono em 2026-11-05) mandam acima deste arquivo.

---

## 0. Do seu jeito (o aluno preenche, se quiser)

Escreva aqui, com as suas palavras, o que vale para todos os seus vídeos neste modelo. Pode ir somando com o tempo.

- Meu nome e @ (só onde o modelo mostra):
- Minha foto de perfil (nome do arquivo na pasta do estúdio):
- Chamada do fim (o que peço para a pessoa fazer):
- Gosto de:
- Não quero:

**Para o assistente:** leia esta seção antes de tudo e siga o que está nela. Ela decide o conteúdo e as opções da seção 7,
mas não muda a cara do modelo (cores, fontes, posições, ritmo). Se um pedido daqui mudar a cara, avise antes de fazer.
Quando a pessoa corrigir algo num vídeo e a correção valer para os próximos, ofereça anotar aqui, nas palavras dela.

---

## 1. A cara do modelo

A fala é a estrela: **a voz e o rosto de quem fala mandam**, a edição só amplifica.
- **Quase todo o vídeo é a pessoa, com o fundo real, e uma legenda corrida no peito**, as palavras nascendo junto com a
  voz (3 s a 11 s).
- **Momento de ênfase só onde a fala tem peso no tema** (G17, G28), e nada de enfeite fora desses picos:
  - a **frase-bloco que se monta** em tamanhos misturados, com a última palavra em serifa itálica vermelha: usada na
    referência porque o gancho (0 s a 2 s) e a virada (20 s a 22 s) eram as frases da tese; usar quando a fala nova
    tiver a frase da tese ou uma virada que fecha a cena;
  - a **tela de destaque creme** com a frase protagonista: usada na referência porque "você está vendo apenas um desses
    modelos" era a fala protagonista (13 s); usar quando a fala nova tiver a frase protagonista do tema;
  - o **letreiro gigante atrás da pessoa** (6 s a 8 s no aprovado) é opção desligada: precisa recortar a pessoa (G6).
- **Abre na gravação original com a frase mais forte** (G29), em frase-bloco por cima da pessoa. Nada de vinheta nem
  tela no início (0 s).
- **Fecha no preto**; quando a fala tem o comando, ele fica fixo: Comenta “edição” (27 s a 29 s).
- **Sem preto e branco. Sem tingir, recortar ou desfocar o fundo** (opções desligadas, G6).

## 2. Os números do modelo (o `parece.py` confere)

| Item | Valor | O que é |
|---|---|---|
| Brilho | 86 (de 0 a 255) | Médio-escuro |
| Contraste | 161 | |
| Saturação | 68 | Cor natural da gravação |
| Temperatura | +2,9 | Levemente quente |
| Rosto no plano aberto | 28% da altura do quadro | (0 s) |
| Rosto no plano fechado | 32% da altura do quadro | (8 s) |
| Altura do rosto | centro a 35% do topo | Cabeça no terço de cima |
| Rosto no centro horizontal | 50% | |
| Cabeça cortada pelo topo | 0% do tempo | Nunca |
| Tempo com rosto na tela | 88% | A maior parte do vídeo |
| Cortes | cerca de 10 por minuto | Planos longos (2 a 6 s, ou mais) |

Com o fundo real (o padrão), brilho, contraste, saturação e temperatura são os da gravação de quem usa: o `parece.py`
só avisa nesses quatro (G6) e cobra o enquadramento e o ritmo.

## 3. Câmera e ritmo

- **Corte seco** entre planos, sempre na troca de frase, 2 quadros antes da palavra.
- **Zoom só quando a fala tem motivo** (G6): o padrão é o plano aberto, 1,0, sem zoom lento contínuo e sem som de zoom.
  O aprovado trocava o enquadramento entre 1,0 e 1,18 a cada corte e tinha um zoom lento de 1,2% por segundo dentro do
  plano; hoje isso só entra num trecho em que a fala pede aproximar (a frase de peso, a virada), nunca ao acaso.
- Com zoom alto, o queixo desce. O queixo nunca pode encostar na legenda ou no bloco: se encostar, baixa o zoom.
- **Chicote borrado** para entrar e para sair de uma frase-bloco: o bloco desliza 18 px e borra (22 px) em 2 quadros, junto com o corte.
- **Dissolve rápido** de 6 quadros para entrar na tela creme (13 s) e para o preto do fecho (28 s).
- **Abertura:** a frase mais forte do trecho, nos primeiros 1 a 2 s, sobre a gravação original (G29).

## 4. Os momentos de ênfase (a assinatura)

**Fontes e cores:** Inter (800 e 900) para tudo; Instrument Serif itálica só para a palavra de peso. Branco quente
`#F3EDE4` na base; vermelho vivo `#FF2424` como a única cor de ênfase.

**Frase-bloco que se monta** (0 s a 2 s, 20 s a 22 s):
- A frase da tese fica na tela e cresce palavra por palavra, com **tamanhos misturados**: ligação menor (Inter 900, 80 a
  96 px), palavras de peso grandes (110 a 150 px), e a **última palavra em Instrument Serif itálica vermelha, a maior**
  (190 a 250 px) ("*Claude.*", 2 s; "*modelos*", 22 s).
- Cada palavra sobe desfocada (10 a 14 px de desfoque) em cerca de 4 quadros, junto com a voz.
- Fica logo abaixo do queixo, na largura de 940 px. Sai em chicote borrado junto com o corte.
- **No máximo 4 linhas**, e cada degrau de tamanho conta como linha: nada de empilhar palavra pequena "subindo" ao lado
  da grande.
- A frase-bloco também pode marcar a **virada** (a frase que muda o rumo: "mas", "só que", "e aí"; 20 s no aprovado),
  **só se a virada fecha uma cena forte** (G28). Virada no meio da frase fica na legenda: o molde de hoje deixa a do
  aprovado na legenda (`bloco2: null`).

**Letreiro gigante atrás da pessoa** (6 s a 8 s no aprovado; **opção desligada**, G6: precisa recortar a pessoa e trabalhar
camadas, o que não é o esquema do modelo. Só a pedido, com `LETREIRO = {palavra, texto}` e o `scripts/recorte.py`):
- **Mostra parte da frase que está sendo dita**, e essas palavras saem da legenda. Nunca repete atrás uma palavra que já
  está na legenda ("MODELOS").
- Inter 900, 176 px, letras apertadas (-0,05 em), em MAIÚSCULA, no topo da zona segura (y 260), com deriva curta e sem
  rolar para fora do quadro. Entra letra por letra, cada uma subindo 40 px de um desfoque de 12 px.
- A pessoa fica **na frente** (recorte com transparência). Cor vermelha `#FF2424` para ler na parede clara (com o fundo
  tingido ligado, verde-água claro `#BFE8E0`).
- Fica na tela pelo menos 1,5 s.
- **Escolha uma palavra cuja saída não deixe a legenda estranha.** Numa enumeração ("cada corte, cada legenda"), tirar
  "corte" deixa "Cada cada legenda": prefira o termo protagonista fora da enumeração, ou não use letreiro ali.

**Tela de destaque creme** (13 s):
- **Só para a fala protagonista do tema** (G17, G28) ("você está vendo apenas um desses modelos."). Fala coadjuvante ("Inclusive, se você
  estiver no Instagram agora") fica na legenda.
- Fundo creme chapado `#EDE3D3`. Texto **tinta escura `#1A1512`** (Inter 800, 96 px), a palavra de peso em **vermelho
  escuro `#C8141B`**, Instrument Serif itálica, 250 px. Topo em y 640. Até 4 linhas, palavra por palavra.
- **Texto branco sobre fundo claro é proibido.**
- Entra em dissolve de 6 quadros. Nenhuma página da legenda fica sobre o creme.

**Outros momentos do modelo** (não estão no aprovado: porquê a confirmar com o dono; use só quando a fala pede, sempre
com o mesmo jogo de sans branca, serifa itálica e vermelho):
- **Palavra-chave em vermelho itálico** dentro de um bloco.
- **Repetição espalhada:** quando a pessoa repete uma palavra, ela aparece várias vezes, pequena e branca, com uma grande
  em vermelho no centro.
- **Sílabas empilhadas:** palavra longa dita devagar entra sílaba por sílaba, empilhada, enorme.
- **Telas criadas** mantêm o texto e ganham uma ilustração minimalista em traço fino, de uma cor, com a peça-chave em
  vermelho.
- **B-roll com a voz por cima** só se o dono mandar os arquivos de B-roll junto com o vídeo. Sem eles, esse trecho vira
  as telas da casa (tela creme com a frase, ilustração em traço). Nunca baixe nem gere B-roll por conta própria.
- **Versão em boneco de brinquedo da pessoa** (mesma pose, em corte seco, na abertura) só com imagem que o dono aprovar.
- "Caprichar nas palavras-destaque" é pedido avulso de um vídeo, não regra.

**Sempre:** **destaque só no termo protagonista** (o assunto: "modelos", "Claude", "edição"), nunca advérbio, verbo
solto ou fala coadjuvante. A legenda é exatamente o que foi dito: nunca invente versículo, nome de igreja ou citação.
**Nunca escreva o nome do modelo na tela.**

## 5. A legenda (conta a história)

- **Toda palavra dita aparece na tela, uma vez só, em ordem.** Nada de trecho falado enquanto um bloco segura a tela sem
  estar escrito. Palavra de um bloco ou do letreiro não se repete na legenda.
- **Inter 800, 60 px, branco quente `#F3EDE4`**, letras apertadas (-0,035 em), entrelinha 1,16, sem caixa, sem
  contorno nem sombra colada (G16): só a sombra larga e suave do molde (`0 4px 24px rgba(0,0,0,.45)`; a camada justa
  `0 2px 4px` saiu em 2026-10-30). **Sem palavra colorida na legenda.**
- **Surgimento suave e sutil:** cada palavra nasce junto com a voz num fade de cerca de 5 quadros com 10 px de subida.
- **Páginas de até 2 linhas.** Cada página fica pelo menos 1,5 s e cada palavra pelo menos 0,4 s depois de nascer. Fala
  rápida vira página maior; **nenhum pedaço pisca.**
- **Posição fixa, na altura de leitura, um bloco por vez (G12):** no peito, logo abaixo do queixo medido, centrada na
  zona segura (x 500). No vídeo aprovado, o topo em **y 1060**, a mesma no vídeo inteiro. Nunca dois trechos empilhados. A legenda **não persegue** o enquadramento e **nunca é
  rebaixada ao pé do quadro**.
- **2ª posição só com as prévias:** topo em y 1352, logo abaixo delas.
- O tamanho da legenda é escolha por vídeo (o dono pode pedir maior ou menor); o padrão é o do vídeo aprovado.
- **Fala rápida sem respiro para fechar uma página de 1,5 s:** a página longa do mesmo trecho encolhe a letra (5º campo
  de `PEDACOS`, o corpo, ex. `50`), nunca vira 3 linhas nem fica empilhada com outra. O molde faz isso em "te mostrar a
  diferença entre vários / modelos que eu criei e melhorei".

## 6. Som, prévias e fecho

- **Som padrão:** só a voz (G6). Os golpes graves nas ênfases e o whoosh leve em cada corte do aprovado são efeito
  sonoro: só com ordem explícita no pedido.
- A cama escura é opcional e vem desligada. Quando ligada, fica cerca de 16 dB abaixo da voz, com ducking. Final em
  -14 LUFS e pico de -1 dBTP.
- **Prévias (opcional, só se a fala fala delas):** dois clipes de vídeos seus acelerados 3 vezes, 300x533, no alto da zona
  (x 185 a 815, y 260 a 793), cada um com o nome do vídeo numa etiqueta (Inter, 34 px; nunca o nome do modelo, G33),
  sobre o próprio vídeo desfocado e escurecido (porquê a confirmar com o dono, G6); a câmera desce 380 px para o rosto ficar entre as prévias e a legenda (14 s a 19 s). Nunca use vídeo de
  terceiro.
- **Fecho** (27 s a 29 s): fixo só o comando, "Comenta" (Inter 800, 92 px) e a palavra entre aspas, “*edição*” (Instrument
  Serif itálica vermelha, 180 px, com um traço de pincel que se desenha por baixo), abaixo da legenda (topo em y 1222).
  O resto da fala segue na legenda. A imagem dissolve para o preto 2 quadros antes das últimas palavras e segura 0,73 s
  depois da última.
- **Sem o comando dito na fala, não há Comenta:** `cta = null`, e o fecho dissolve para o preto depois da última palavra
  (`fecho` = fim da última palavra + cerca de 0,5 s). Se o último trecho é a tela creme, o fecho também vem depois da
  última palavra: o preto fica por cima do creme e apagaria o texto dele.
- **A palavra de peso da tela creme é o termo protagonista.** Se a frase termina em verbo, ponha o vermelho no termo
  protagonista, mesmo no meio, ou use o verbo só quando ele é o próprio assunto ("editou." num vídeo sobre edição).
- **Fala rápida antes da tela creme:** se a última página da legenda antes dela não fecha 0,4 s por palavra, leve a frase
  inteira para o creme.

## 7. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão | Como mudar |
|---|---|---|
| Golpes de som e whoosh | **desligados** (G6) | Com ordem: refaça o PLANO DO SOM de `scripts/som.py` e mixe com `public/efeitos.wav` |
| Cama escura (música) | desligada (G6) | Com ordem: `sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/final.mp4` |
| Zoom | **1,0, sem zoom lento** (G6) | `ENQ` do trecho, só onde a fala tem motivo |
| Fundo (G6) | **real**: o vídeo normal, prop `fundo: 'real'` | `fundo: 'desfoque'` (desfoque leve atrás da pessoa recortada) ou `fundo: 'recorte'` (tinge o fundo de vinho / azul petróleo; o antigo `fundoCor: true`). Os dois pedem `scripts/recorte.py`. Só com ordem |
| Ênfases (frase-bloco, tela creme) | no gancho e onde a fala tem a frase protagonista do tema (G17, G28) | Mais, só a pedido do dono |
| Preto e branco e flash negativo | desligados (não fazem parte do modelo) | só se o dono pedir |
| Letreiro atrás da pessoa | desligado (`LETREIRO = null`) | `LETREIRO = {palavra: '...', texto: '...'}` em `src/Corte.tsx` e o `scripts/recorte.py`, a pedido |
| Prévias | desligadas | Prop `previas: true` e `nomesPrevias: ["modeloA","modeloB"]` |

Os padrões vêm do `src/Root.tsx`: `{previas: false, nomesPrevias: ['interface-encenada', 'pagina-de-livro'], fundoCor:
false, fundo: 'real'}`. O render sai **sem som**; a voz entra no `mixar.sh`.

## 8. Zona segura, rosto e formato

- Todo texto (legenda, frase-bloco, tela creme, letreiro, fecho, etiquetas das prévias) fica em x 60–940 e y 250–1500
  (1080x1920). O centro do texto centralizado é x 500, o da zona, não o do quadro.
- A zona segura é assimétrica de propósito: a coluna de botões do Instagram ocupa os 140 px da direita, por isso nenhum texto passa de x 940.
- Nenhum texto cobre o rosto: legenda e blocos moram abaixo do queixo medido (`src/rosto.json`).
- No máximo 4 linhas em qualquer bloco; 2 por página de legenda.
- Nome e @ na tela, só os reais de quem fala, ou nenhum.

**O modelo vale para 9:16 e 16:9.** No horizontal:
- a pessoa fica num terço ou no centro; frase-bloco e palavras gigantes ocupam o lado livre, alinhadas à borda; o
  letreiro vira faixa atrás da pessoa;
- com a pessoa no centro, a legenda fica num **lugar fixo** do lado livre, **na altura da cabeça**, fora do alcance do
  rosto no vídeo inteiro, já contando o zoom (por exemplo, terminando em x 560, y 400 de 1080), **um bloco por vez**
  (G12): nunca um pedaço à esquerda e o seguinte à direita ao mesmo tempo;
- pedaço que ficaria menos de 0,55 s entra junto com o seguinte do mesmo trecho, no mesmo bloco; **no máximo 2 linhas**.

---

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio, menos onde está escrito "na pasta do vídeo".

1. **Crie o vídeo:** `.venv/Scripts/python.exe tools/novo-video.py pregacao <gravacao.mp4> <AAAA-MM-DD-tema>`.
   Isso cria `oficina/<AAAA-MM-DD-tema>/`, transcreve a fala (`src/palavras.json`), mede o rosto (`src/rosto.json`) e adapta
   a gravação ao modelo. O molde para ao carregar e diz qual lista do plano refazer.
   Nome que a transcrição errar (ex.: "Cloud" no lugar de "Claude") se corrige já aqui: `--trocar Cloud=Claude` (pode repetir).
2. **Escreva o `plano.md`** na pasta do vídeo, frase a frase sobre `src/palavras.json`: a frase mais forte (abertura), a
   fala protagonista dos trechos mais ligados ao tema (tela creme, com o porquê; G17, G28), a virada e o comando do fecho. A
   maior parte fica na legenda.
3. **Monte O PLANO** em `src/Corte.tsx` (na pasta do vídeo), nesta ordem:
   - `T`: cada trecho numa palavra, `w('palavra', n)` (início da n-ésima vez que ela é dita), `c()` = 2 quadros antes.
     Trechos, nesta ordem no tempo: `bloco1` (abertura em frase-bloco, obrigatório), `base1` (legenda, obrigatório),
     `base2`, `base3`, `destaque` (tela creme), `previas`, `base3b`, `bloco2` (a virada), `base4`, `cta` (Comenta),
     `fecho` (dissolve para o preto). Trecho que a fala não tem: `null`. Reponha cada trecho no lugar certo da fala nova
     só onde a fala nova tem o mesmo porquê (G30); trecho sem esse porquê fica `null` e vira legenda.
   - `ENQ`: o zoom de cada trecho, 1,0 por padrão; até 1,18 só onde a fala tem motivo (G6).
   - `LETREIRO`: `null` (o padrão). Só a pedido: `{palavra, texto}`, a palavra-tema dita que vira o letreiro, com o
     `fecho` pelo menos 1,5 s depois dela.
   - `LEG_Y_PLANO`: troque `1060` por `null` e a legenda vai sozinha para logo abaixo do queixo medido.
   - `PEDACOS`: as páginas da legenda, `[índice da 1ª palavra, 'texto / 2ª linha', até?]`, com o texto da fala. O 4º campo
     (`'vitrine'`) é só do vídeo aprovado: não use.
   - `BLOCOS`: os textos de cada frase-bloco, da tela creme e do Comenta (`{txt, tam, serif?, vermelho?, quebra?,
     pincel?}`); o `top` da frase-bloco é `topoBloco(zoom do trecho)`.
   - `FOLGA`: quanto o vídeo segue depois da última palavra (padrão 0,73 s).
4. **Recorte a pessoa** (só se o dono pediu letreiro, `fundo: 'desfoque'` ou `fundo: 'recorte'`), na pasta do vídeo e pela trava porque é pesado:
   `QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/recorte.py`. Grava `public/pessoa.webm`.
5. **Confira as regras:** `node scripts/cobertura.mjs` (na pasta do vídeo; ele pega a trava sozinho, **não** rode dentro do
   `com-trava.sh`) até zerar. Ele confere toda palavra escrita enquanto é dita, página de 1,5 s e palavra de 0,4 s, nada
   repetido, no máximo 2 posições de legenda, até 4 linhas, queixo fora da legenda e dos blocos, nada sobre a tela creme
   e, pixel a pixel, a zona segura; e diz o `top` ou o zoom que resolve.
6. **Som (só com ordem de efeito ou música, G6):** refaça o PLANO DO SOM de `scripts/som.py` com os mesmos trechos de
   `T` e rode `../../.venv/Scripts/python.exe scripts/som.py` (na pasta do vídeo). Sem ordem, pule e mixe só a voz.
7. **Olhe quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 5 10` (na pasta do vídeo).
8. **Renderize** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrinePregacao out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2`
9. **Mixe:** `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4` (na pasta do vídeo; a voz, e os golpes só se houve
   ordem). Sai em -14 LUFS.
10. **Confira a identidade:** `.venv/Scripts/python.exe tools/parece.py oficina/<v>/out/final.mp4 pregacao`.
    Reprovou, corrija o que ele aponta. Passou, olhe a folha lado a lado que ele grava: compare tipografia,
    enquadramento e acabamento, não a sequência de telas (G30).

**Prévias:** `.venv/Scripts/python.exe tools/previa.py <seu-video-pronto.mp4> oficina/<v> 1` (e `2`), a janela em
`T.previas` e o render com `--props='{"previas":true,"nomesPrevias":["modeloA","modeloB"]}'`.

## 10. O plano do vídeo aprovado (para comparar)

Feito antes das regras de 2026-11-05 (o letreiro MODELOS atrás da pessoa recortada, a frase-bloco da virada no meio da
frase, troca de zoom a cada corte, golpes e whoosh). Serve para ver a tipografia e o porquê de cada momento, não como
receita de sequência (G30). O molde de hoje tira o letreiro, devolve "modelos" à legenda e deixa a virada na legenda;
ficam a frase-bloco do gancho, a tela creme da fala protagonista e o Comenta.

| Tempo | Fala | Câmera / transição | Na tela |
|---|---|---|---|
| 0 s | Esse vídeo está sendo 100% editado pelo Claude. | aberto 1,0 | frase-bloco: "Esse vídeo está sendo / **100%** editado / pelo / *Claude.*" vermelha |
| 3 s | Ele foi criado justamente para te mostrar a diferença entre vários modelos que eu criei e melhorei | corte seco, 1,1 | legenda no peito; letreiro MODELOS vermelho atrás da cabeça (6 s a 8 s) |
| 8 s | para editar qualquer tipo de vídeo usando o Claude. | corte seco, 1,18 | legenda |
| 10,6 s | Inclusive, se você estiver no Instagram agora, | corte seco, 1,06 | legenda (fala coadjuvante) |
| 12,6 s | você está vendo apenas um desses modelos. | dissolve para a tela creme | "você está vendo / apenas um desses / *modelos.*" em tinta e vermelho escuro |
| 14,4 s | Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. | corte, prévias (câmera desce) | duas prévias com etiqueta do modelo; legenda na 2ª posição |
| 19,9 s | Mas se você quiser realmente ver outros modelos de edição | corte seco, 1,04 (a virada) | frase-bloco de 4 linhas, "*modelos*" vermelha |
| 23,2 s | como esse e aprender a como usar isso nos seus vídeos, | corte, 1,16 | legenda |
| 26,7 s | comenta edição | corte, aberto 1,0 | "Comenta" e “*edição*” vermelha com pincel, fixos |
| 27,9 s | aqui embaixo que eu vou te mandar na sua DM agora. | dissolve para o preto (28,2 s) | legenda no preto, o comando segue fixo |

No vídeo aprovado as prévias estão ligadas. Os nomes de modelo nas etiquetas das prévias são daquele vídeo.
