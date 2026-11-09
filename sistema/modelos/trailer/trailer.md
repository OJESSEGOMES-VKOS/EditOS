# trailer: corte de podcast cinematográfico

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde, vale o que está aqui.

Regras gerais: `REGRAS.md` §0 (G1–G35, reescritas pelo dono em 2026-11-05) mandam acima deste arquivo.

**A referência é o `referencia/referencia.mp4`**, o vídeo aprovado do modelo (30 s, com a voz). Os tempos entre
parênteses, como (6 s), apontam para ele. Do lado dele ficam a `folha.jpg` (1 quadro por segundo) e o `mapa.json`
(rosto, luz e cortes medidos a cada 0,25 s). Antes de editar, assista ao vídeo inteiro uma vez. O mesmo vídeo em
qualidade cheia está no `original.mp4`, para ler letra pequena e detalhe de tela.

**O modelo é inspiração, não molde (G30).** A referência mostra o porquê e o como de cada tela. As telas, os textos e
os cortes do vídeo novo nascem da fala nova: uma tela do modelo só entra onde o porquê dela se repete na fala nova.
Nunca copie a sequência, os tempos ou a abertura do aprovado. Ele foi feito antes das regras de 2026-11-05 (tratamento
quente, tela de respiro, legenda embaixo dos destaques): o padrão de hoje é o desta página.

Quando o `CLAUDE.md`, o `novo-video.py` ou uma mensagem do código citarem `MODELO.md`, `LEIA.md`, `REGRAS.md` ou
`CORRECOES.md`, a resposta está neste arquivo.

---

## 0. Do seu jeito (o aluno preenche, se quiser)

Escreva aqui, com as suas palavras, o que vale para todos os seus vídeos neste modelo. Pode ir somando com o tempo.

- Meu nome e @ (só onde o modelo mostra):
- Minha foto de perfil (nome do arquivo na pasta do estúdio):
- Chamada do fim (o que peço para a pessoa fazer):
- Gosto de:
- Não quero:

**Para o assistente:** leia esta seção antes de tudo e siga o que está nela. Ela decide o conteúdo e as opções da seção 7,
mas não muda a cara do modelo (cores, fontes, posições). Se um pedido daqui mudar a cara, avise antes de fazer.
Quando a pessoa corrigir algo num vídeo e a correção valer para os próximos, ofereça anotar aqui, nas palavras dela.

---

## 1. A cara do modelo

Uma pessoa falando para a câmera, no vídeo normal, com a tipografia de trailer de filme.
- **A cor é a da gravação** (G6). O âmbar, a vinheta e o grão do aprovado são a opção `tratamento: true`, só com ordem.
- **Destaques tipográficos por cima da pessoa, só onde a fala tem um ponto forte** (G17, G28), misturando 3 tipos de
  letra. A maior parte do vídeo é a pessoa com a legenda.
- **Legenda serifada calma no peito**, contando a fala inteira, um bloco por vez (4 s, 11 s, 20 s).
- **Transições de textura:** desfoque, flash branco e chicote. Nunca deslize (8 s, 15 s, 24 s).
- **Fecho com o comando:** Comenta “PALAVRA” (27 s a 29 s), quando a fala tem comando.

**O repertório de telas (cada uma com o seu porquê):**

| Tela | Usada na referência porque | Usar quando a fala nova tiver o mesmo porquê |
|---|---|---|
| Bloco de destaque de 3 vozes | marca o assunto principal da frase (o termo protagonista, M3-8) | o trecho tiver um termo protagonista ligado ao tema (G17) |
| Contador vermelho | o gancho diz um número (100%) | a fala disser um número que é o fato principal |
| Palavra-carimbo atrás do bloco | porquê a confirmar com o dono ("MODELOS", 6 s) | porquê a confirmar com o dono |
| Risco vermelho de caneta | a frase nega algo | a fala tiver uma negação forte |
| Desfoque, flash, chicote | porquê a confirmar com o dono (8 s, 15 s, 24 s) | porquê a confirmar com o dono; sem porquê, corte seco |
| Fecho "Comenta “PALAVRA”" | a fala termina com um comando | a fala nova terminar com comando |
| Tela de respiro (pessoa borrada, opção desligada) | isolar uma frase de destaque ("outros modelos de edição como esse", 22 s) | só com ordem do dono (G6) |
| Prévias (opção desligada) | a fala promete prévias ("duas prévias rápidas aqui em cima") | a fala nova prometer prévias |

## 2. Os números do modelo

| Item | Valor | O que é |
|---|---|---|
| Rosto no plano aberto | 30% da altura do quadro | (0 s) |
| Rosto no plano fechado | 36% da altura do quadro | (4 s) |
| Altura do rosto | centro a 33% do topo | Cabeça no terço de cima |
| Cabeça cortada pelo topo | no máximo 22% do tempo | Só nos planos fechados |

O aprovado também mede brilho 51 e temperatura +10, do tratamento quente; com a cor da gravação (o padrão, G6) esses
itens não valem. O `parece.py` serve para conferir o enquadramento do rosto, não para igualar o vídeo ao aprovado (G30).

## 3. Câmera e ritmo

- **Uma câmera.** Por padrão, um plano só, sem zoom e sem deriva (G6).
- **Plano fechado (zoom 1,3):** só quando a fala tem motivo (uma frase de peso, uma virada), num corte seco. Nunca
  alternar aberto e fechado por tempo, nunca aleatório (G6).
- A cabeça fica no terço de cima. Uma gravação com o rosto mais baixo é corrigida pelo `adaptar.py` (passo 1 da seção
  9), não pela câmera do plano.
- A decupagem vem antes e limpa (G5).

## 4. Os destaques (a assinatura)

- **Bloco de 2 a 3 linhas com 3 tipos de letra, bem colados:**
  - Inter Tight 800, apertada, nas palavras comuns ("a diferença entre", 6 s);
  - Playfair itálica fina na palavra de emoção ("*vários*", "*qualquer*", 6 s e 9 s);
  - Anton em caixa alta, enorme e vermelha `#E01E1E`, na palavra-chave ("MODELOS", "VÍDEO", "EDIÇÃO", 6 s, 9 s, 23 s).
- **Só onde importa (G17, G28).** O destaque entra no trecho com um ponto forte ligado ao tema; na dúvida, a palavra
  fica na legenda. Ele sai quando a legenda seguinte entra (o `ate` do bloco é o começo da página seguinte): nunca
  convivem. Nada perdura depois da fala (G27).
- **Só o assunto vira destaque.** O destaque é sempre um substantivo ou tema ("MODELOS", "EDIÇÃO"). Advérbio, verbo solto
  ou palavra de ligação nunca vira destaque. Sem assunto no trecho, fica só a legenda.
- **Acabamento (G16, G18):** sem contorno, sombra colada ou brilho; pontuação e aspas fora da palavra destacada; o
  vermelho precisa ler no fundo onde cai; nunca legenda e destaque empilhados sobre o rosto.
- **Entrada:** cada palavra nasce de um desfoque forte e sobe para o lugar em 4 a 6 quadros, junto com a voz.
- **Tamanhos:** a palavra Anton de uma linha usa 250 a 260 ("VÍDEO", "EDIÇÃO"); a palavra-carimbo atrás do bloco usa 300
  ("MODELOS", 6 s); a Playfair do bloco usa 118 a 132; a Inter Tight usa 80 a 86. O molde aplica sozinho a escala 0,9.
- **Todos os destaques parecem do mesmo tamanho**, o de "MODELOS" (6 s). Para caber na largura, o destaque pode encolher
  até 85% desse tamanho, nunca menos. Se faltar espaço entre o queixo e a legenda, a legenda vai para a 2ª posição.
- **Número é contador** na Anton vermelha, do mesmo tamanho dos destaques, sem círculo (0 até o número exato dito, 1 s,
  G10). Não troque o contador por texto para o bloco caber.
- **Negação (opcional):** a linha negada é riscada por um traço vermelho de caneta em diagonal (`risca` no bloco).
- **Nunca escreva o nome do modelo na tela (G33).** A fala pode dizer "um desses modelos" (13 s); o nome escrito não
  entra.

## 5. A legenda (conta a história)

- **Toda palavra dita aparece na tela, uma vez só (G26).** Quando um destaque ocupa a tela, a legenda some; a fala
  seguinte entra na legenda quando o destaque sai. O molde faz isso sozinho: a página que nasceria dentro de um destaque
  espera ele sair, e o checador acusa a palavra que ficaria sem tela.
- **Playfair fina branca**, em páginas de até 2 linhas (G12), com as palavras nascendo junto da voz (4 s). Sem
  contorno, sombra colada ou brilho (G16).
- **Divisão:** cada página é um trecho ou subtrecho (G14), com contagem parecida de palavras, sem juntar o fim de uma
  fala com o começo de outra (G11).
- **Tempo:** a legenda fica o tempo da fala (G9). Nunca uma palavra solta piscando.
- **A página acaba quando um destaque entra.** Nunca fica embaixo dele.
- **Posição:** no peito, com o topo em y 1220 (cerca de 64% da altura), no vídeo inteiro. Só no fecho (com o comando
  fixo) e nas prévias ela vai para a 2ª posição, com o topo em y 1363. No vídeo inteiro são só essas 2 posições.

## 6. Transições, respiro e fecho

- **Desfoque:** a imagem borra inteira em 3 a 4 quadros e a próxima nasce do borrão (8 s, 20 s).
- **Flash branco** que se dissolve em 0,5 s sobre o plano novo (15 s).
- **Chicote:** borrão de movimento que vira a cena seguinte (24 s).
- Porquê de cada transição: a confirmar com o dono. Até lá, só onde a fala muda de cena; sem motivo, corte seco.
- **Tela de respiro (opção desligada, G6):** a pessoa borrada ao fundo e só um destaque por cima. Só a pedido. Ela nunca
  carrega legenda comum.
- **Fecho só existe se a fala tem um comando** ("comenta...", "segue..."). Sem comando, `FECHO_DEF = opcional(null)` e o
  último plano termina na legenda.
- **Fecho:** "Comenta" e a palavra entre aspas, “EDIÇÃO”, ficam fixos no estilo de destaque. O resto da fala vai na
  legenda abaixo (27 s a 29 s).
- **Prévias (opcional):** dois clipes de vídeos seus, acelerados 3 vezes, em cima da tela (15 s a 19 s). Nunca use vídeo
  de terceiro, e nunca escreva o nome do modelo de cada um (G33).

## 7. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão | Como mudar |
|---|---|---|
| Tratamento quente (cor, vinheta e grão) | desligado (G6: a cor da gravação) | Prop `tratamento: true`, a pedido |
| Tela de respiro (fundo borrado) | desligada (`RESPIROS = []`) | `RESPIROS = [[de, ate]]`, a pedido |
| Destaques | onde a fala tem ponto forte (G17), mais o fecho | Mais ou menos, a pedido do dono |
| Plano fechado (zoom) | só com motivo na fala (G6) | |
| Efeitos sonoros do modelo (whoosh, sopro, impacto) | **desligados** (G6) | só com ordem explícita |
| VHS e glitch | desligados | Prop `efeitos: true` e `som.py --efeitos`, a pedido |
| Música de trailer | desligada (G6) | `som.py --cama`, a pedido |
| Prévias | desligadas | Prop `previas: true` |

**Atenção ao molde:** o código ainda pode vir com os efeitos sonoros ligados no `mixar.sh`. Até ele ser ajustado, rode
o `mixar.sh` com o 3º argumento `-` (sai só a voz).

## 8. Zona segura e rosto

- Todo texto fica em x 60–940 e y 250–1500 (1080x1920) (G15). As prévias e o vídeo podem passar disso.
- A zona segura é assimétrica de propósito: a coluna de botões do Instagram ocupa os 140 px da direita, por isso nenhum
  texto passa de x 940.
- Nenhum texto cobre o rosto. O texto mora abaixo do queixo medido (`src/rosto.json`).
- Nome e @ na tela, só os reais de quem fala, ou nenhum (G8).

---

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio, menos onde está escrito "na pasta do vídeo".

1. **Crie o vídeo:** `.venv/Scripts/python.exe tools/novo-video.py trailer <gravacao.mp4> <AAAA-MM-DD-tema>`.
   Isso cria `oficina/<AAAA-MM-DD-tema>/`, transcreve a fala (`src/palavras.json`), mede o rosto (`src/rosto.json`) e
   leva o rosto ao tamanho e à altura do modelo, sem mexer na cor (G6). Nome que a transcrição errar (ex.: "Cloud" no
   lugar de "Claude") se corrige já aqui: `--trocar Cloud=Claude` (pode repetir), ou no campo `text` do
   `src/palavras.json`, sem mexer nos tempos. Na dúvida sobre o que a pessoa disse, pergunte a ela.
2. **Escreva o `plano.md`** na pasta do vídeo, trecho a trecho sobre `src/palavras.json` (G14, G28): onde cortar, quais
   trechos têm ponto forte e qual tela do repertório (seção 1) tem o mesmo porquê. O vídeo começa na gravação original
   com ênfase no gancho (G29).
3. **Monte O PLANO** no topo de `src/Reel.tsx` (na pasta do vídeo). O molde para de propósito até o plano bater com a
   fala nova e diz qual entrada não bate.
   - `T`: os cortes, `c(índice, 'palavra')`, 2 quadros antes da palavra.
   - `CAM`: 1,0 por padrão; 1,3 só onde a fala tem motivo; a última chave é `[DURACAO, ...]`.
   - `DESFOQUES`, `FLASHES`, `CHICOTES`, `RESPIROS`, `VHS`: os tempos das transições. Lista vazia desliga (`RESPIROS`
     e `VHS` vêm vazias: opção).
   - `ABERTURA` (bloco até o 1º corte; `contador: null` se não há número dito) e `FECHO_DEF` (comando e palavra).
     `opcional(null)` desliga. A abertura em bloco só entra se o gancho tiver o mesmo porquê (número ou termo
     protagonista); senão, a gravação com a legenda.
   - `PREVIAS`: a janela das prévias, ou `opcional(null)`.
   - `BLOCOS`: os destaques, só nos trechos com ponto forte (`primeira` = índice da 1ª palavra, as linhas na ordem da
     fala, `camera` = o plano que se ajusta para ele caber; o bloco que começa num corte nasce no corte: `de: T.x`; o
     `ate` é o começo da página seguinte, `c(i, 'palavra')`).
   - `PEDACOS`: a legenda, `[índice da 1ª palavra, 'texto / 2ª linha']`, cobrindo toda palavra fora dos destaques.
4. **Confira as regras:** `node scripts/cobertura.mjs` (na pasta do vídeo) até sair `APROVADO`. Ele confere as regras
   das seções 4, 5 e 8 e diz o arquivo, a linha e o que mexer.
5. **Som:** só a voz (G6). As listas do PLANO DO SOM no topo de `scripts/som.py` ficam vazias, a não ser com ordem
   explícita.
6. **Olhe quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 5 10` (na pasta do vídeo).
7. **Renderize** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts VitrineDinamico03 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2`
8. **Mixe:** `sh scripts/mixar.sh out/so-video.mp4 out/final.mp4 -` (na pasta do vídeo). Sai em -14 LUFS, só a voz.
9. **Confira o acabamento:** `.venv/Scripts/python.exe tools/parece.py oficina/<v>/out/final.mp4 trailer` para o
   enquadramento do rosto, e a folha lado a lado para fonte, tamanho e posição. Diferença de sequência, de cor ou de
   tempo em relação ao aprovado não reprova (G30).

**Prévias:** `.venv/Scripts/python.exe tools/previa.py <seu-video-pronto.mp4> oficina/<v> 1` (e `2`), a janela em
`PREVIAS` e o render com `--props='{"previas":true}'`, sem nome de modelo na tela (G33).

## 10. O plano do vídeo aprovado (exemplo, não roteiro)

Feito antes das regras de 2026-11-05: tratamento quente, 4 destaques, tela de respiro e a legenda embaixo dos
destaques. Serve para ver cada tela no seu porquê, não como sequência a repetir (G30).

| Tempo | Fala | Câmera / transição | Na tela |
|---|---|---|---|
| 0 s | Esse vídeo está sendo 100% editado pelo Claude. | aberto | bloco com contador 0 a 100% |
| 4 s | Ele foi criado justamente para te mostrar | corte seco, fechado | legenda |
| 5 s | a diferença entre vários modelos que eu criei e melhorei | fechado | "a diferença entre / *vários*" e MODELOS vermelho |
| 8 s | para editar | desfoque, aberto | legenda |
| 8,4 s | qualquer tipo de vídeo usando o Claude. | aberto | "*qualquer* tipo de / VÍDEO" |
| 11 s | Inclusive, se você estiver no Instagram agora, você está vendo apenas | fechado | legenda |
| 13 s | um desses modelos. | fechado | "*um desses modelos.*" |
| 15 s | Eu posso até colocar duas prévias rápidas aqui em cima, aceleradas em três vezes. | flash branco, aberto | legenda e prévias |
| 20 s | Mas se você quiser realmente ver | desfoque | legenda |
| 22 s | outros modelos de edição como esse | tela de respiro | "outros modelos / de EDIÇÃO / como esse" |
| 24 s | e aprender a como usar isso nos seus vídeos, | chicote, aberto | legenda |
| 27 s | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | fecho | Comenta / “EDIÇÃO” e legenda |

## 11. Pendências do molde (não mexido nesta limpeza)

- O código ainda tem um brilho vermelho largo (40 px) atrás do destaque e sombra larga na legenda (G16).
- O `mixar.sh` liga os efeitos sonoros por padrão (G6).
- O `parece.py` ainda cobra brilho e temperatura do tratamento quente e o ritmo de cortes do aprovado.
- O `novo-video.py` pode igualar a luz de partida ao aprovado (G6).
