# renomado01: o especialista renomado

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde, vale o que está aqui.

**Ainda não há vídeo aprovado.** O modelo nasceu em 2026-11-03 da gramática medida em
`../../../treinamento/especialista-renomado/` (a referência estudada, ref1 = DeziDpVAqAV, decupada em
`analise/ref1_decupagem.md`). A prova dele é a vitrine com a gravação comum
(`oficina/2026-11-03-renomado01-vitrine/`). Quando o dono aprovar um vídeo, ele vira o `referencia/` e os tempos entre
parênteses deste arquivo passam a apontar para ele; até lá, `(ref1 9,7 s)` aponta para a referência estudada e
`(vitrine 13 s)` para a vitrine. **A referência estudada é medida, nunca material:** nenhum quadro, texto, frase ou som
dela entra em vídeo nosso nem em entrega.

**A referência mostra o jeito do modelo, não um roteiro para copiar.** Os modos, os textos e os cortes do vídeo novo
nascem da fala nova.

Quando o `CLAUDE.md`, o `novo-video.py` ou uma mensagem do código citarem `MODELO.md`, `LEIA.md`, `REGRAS.md` ou
`CORRECOES.md`, a resposta está neste arquivo.

---

## 0. Do seu jeito (o aluno preenche, se quiser)

Escreva aqui, com as suas palavras, o que vale para todos os seus vídeos neste modelo. Pode ir somando com o tempo.

- Meu nome e @ (só onde o modelo mostra):
- Minha foto de perfil (nome do arquivo na pasta do estúdio):
- Minha profissão e o conselho dela (OAB, CFM, CRO, CFP, CFN, CREA...), se for regulamentada:
- Chamada do fim (o que peço para a pessoa fazer), ou "fecho só com a frase":
- Gosto de:
- Não quero:

**Para o assistente:** leia esta seção antes de tudo e siga o que está nela. Ela decide o conteúdo e as opções da seção 7,
mas não muda a forma do modelo (os modos, a posição única, a entrada e a saída). Se um pedido daqui mudar a forma,
avise antes de fazer. Quando a pessoa corrigir algo num vídeo e a correção valer para os próximos, ofereça anotar aqui,
nas palavras dela.

---

## 1. A cara do modelo (a forma de execução)

**Em uma frase:** o especialista fala calmo com uma legenda serifada pequena no peito, e só nas frases marcadas a tela
troca de modo por corte seco com aproximação (palavra gigante = peso, cursiva escrita à mão = nome do conceito ou
tese, preto e branco com legenda dourada = fala citada), sempre no mesmo lugar, e cada modo sai num clarão de
película na cor da cena.

**Os três sinais de reconhecimento** (mudo, em 1 segundo):
1. **Tipografia de livro no peito:** serifa clássica (Playfair) e cursiva (Great Vibes), num lugar só; nunca sans de Reels (ref1 inteira).
2. **O efeito tem sentido fixo:** o espectador aprende o código sem perceber (palavra gigante sempre é peso; cursiva
   sempre é conceito ou tese; P&B dourado sempre é fala citada).
3. **O clarão de película** que fecha cada modo e devolve a base (ref1 3,1 / 10,6 / 21,4 / 29,8 / 43,7 / 53,5 / 63,4 s).

**De onde vem o encanto:** contenção. A base calma ocupa a maior parte do tempo e o efeito vale porque é raro. O que a
referência **evita** é tão regra quanto o que ela faz: não tem tela cheia, não tem tela dividida, não tem B-roll, não
tem ícone, não tem sans, não tem cor que não esteja na cena, não tem chamada gritada, não corta a pausa do
especialista.

**A gramática (o que a tela faz com cada função de frase):**

| Função da frase | O que a tela faz | Prova |
|---|---|---|
| Gancho (≤ 3 s, paradoxo ou situação do público) | GIGANTE, uma palavra ou duas curtas por vez; o traço vermelho sob a palavra-alvo, uma vez no vídeo | ref1 0–3,1 s; traço 3,0 s |
| Objeção respondida, contexto, explicação | base: a pessoa e a legenda serifada pequena | ref1 3,5–9,7 s |
| Autoridade (data e nome técnico) | base, com a pausa mantida; o NOME técnico vira CURSIVA | ref1 5,3–10,6 s |
| Fala citada ("o comum diz X", "pergunte Y") | CITAÇÃO: P&B + legenda dourada, a frase literal | ref1 27,2 / 39,3 s |
| Frase-tese | CURSIVA, até 2 linhas, escrita junto da voz | ref1 49,4–53,5 s |
| Virada ("mas", "agora") ou ordem (imperativo) | GIGANTE | ref1 17,3 / 59,5 s |
| Fecho em aforismo ou volta ao gancho | FECHO: a linha em serifa + a palavra em cursiva, e o preto | ref1 65,6–69,0 s |
| Fecho com comando ("comenta X") | FECHO: o comando em serifa + a palavra a comentar em cursiva entre aspas; o resto da fala na 2ª posição | vitrine 26,7 s |

Fala sem uma dessas funções fica na base. **Sem fala citada, não há citação; sem tese, não há cursiva.** O modelo
nunca inventa a função que a fala não tem.

## 2. Os números do modelo

Medidos na ref1 (`analise/ref1_decupagem.md`) e na vitrine. O `parece.py` só confere depois da aprovação (não há
`assinatura.json` ainda); até lá quem confere é o `scripts/checar.mjs` e o olho na folha lado a lado.

| Item | ref1 | Vitrine (gravação comum) | O que é |
|---|---|---|---|
| Tempo na base | ~57% | ~68% | só a pessoa e a legenda pequena |
| Tempo em modo especial | ~34% | 24% (sem citação na fala) | gigante, cursiva, citação |
| Tempo em clarão | ~9% (7 x 0,77–0,90 s) | 8% (3 x 0,84 s; pico YAVG ~232 contra 207 da ref1, véu baixado depois) | |
| Clarão a cada | 7,5 a 13,9 s (média ~10) | 11,6 e 9,5 s | régua: 1 a cada ~10 s; num vídeo de 30 s, 3 |
| Modo especial dura | 0,9 a 4,4 s | 0,9 a 4,5 (checador) | |
| Trecho de base dura | 4,7 a 8,8 s | ≥ 2 s (aviso abaixo de 4,5) | |
| Centro do texto | y 950–960 (49–50%) | logo abaixo do queixo (seção 5) | uma posição só |
| Rosto | altura 0,24 do quadro, olhos a 26% | o `adaptar.py` leva até aqui depois da aprovação | |
| Fala | 2,7 palavras/s | 3,2 (gravação comum) | teto do especialista calmo |
| Preto no fim | 1,2 s, depois de ~1,2 s segurando | o mesmo | |

## 3. Cenas, câmera e ritmo

- **Uma câmera, uma tomada.** Base em zoom 1,0 com deriva bem lenta (até 0,8% por segundo, no máximo +3% no trecho).
- **Entrada de modo = corte seco com aproximação** (zoom 1,15, ref1: 10 a 30%) no quadro do corte, 2 quadros antes da
  1ª palavra do modo. **O zoom nasce da linha do queixo:** o queixo fica no lugar e o rosto cresce para cima, então o
  texto do peito nunca é invadido.
- **Saída de modo = clarão de película** (0,84 s: sobe 0,26 s, segura até 0,36 s, desce até 0,84 s), que nasce na
  última palavra do modo. A volta para a base (cor, zoom 1,0, sem desfoque) acontece escondida no pico do clarão. 7 de 7
  clarões da ref1 fecham um modo: **todo modo especial sai num clarão, e só ele** (o fecho sai no preto).
- **Troca de plano na base** (opcional, `REENQUADRES`): corte seco de reenquadre (1,0 → até 1,08) numa frase nova,
  quando a base passaria de ~9 s sem nada (ref1 5,41 e 23,42 s). Conta como corte de zoom.
- **Cortes de zoom no vídeo:** no máximo 1 a cada ~10 s (3 num vídeo de 30 s), só na entrada de modo e na troca de
  plano. O checador cobra.
- **Ritmo pelo tamanho do vídeo:** clarão a cada ~10 s (7,5 a 13,9 na ref1; o checador recusa abaixo de 5 s). Quanto
  mais longo e mais "mentor", mais a base respira.
- **A pausa do especialista não se corta** (ref1 manteve 1,8 s depois de "Em 1957,"). Decupagem limpa tira take
  repetido, não o respiro.
- **Fim:** depois da última palavra o quadro segura 1,16 s, escurece em 0,3 s e fica 1,2 s em preto.

## 4. Os modos (a assinatura)

Todos na mesma posição (seção 5), todos com as **duas famílias** do modelo: **Playfair Display** (serifa de livro:
legenda 500, fecho 700, gigante 800) e **Great Vibes** (cursiva). Nenhuma terceira fonte.

- **GIGANTE (peso)** (vitrine 0–2,9 s e 21,4–24,1 s): Playfair Display 800 em CAIXA ALTA, corpo 130 px (maiúscula
  ~92 px; ref1 ~95 px), creme da cena, espaçamento 0,01 em. Reta, não itálica: na itálica 800 o N tem terminal em bola
  que se perde sobre a mão (revisão de diretor 2026-11-03). **Um grupo por vez** (1 palavra; 2 quando a palavra sozinha
  ficaria menos de 0,4 s, ref1 "A REAÇÃO"), troca seca com entrada de 4 quadros (escala 104% → 100%), cada grupo ≥ 0,4 s.
  O grupo que não cabe em 880 px encolhe até 80%, nunca menos: abaixo disso, separe. O fundo escurece (brilho 0,72) e
  desfoca de leve (2,5 px), com vinheta. **O brilho é um halo largo de luz atrás da palavra** (degradê da cor clara da
  cena, desfoque 30 px), nunca brilho colado na letra (G37). Número dito é contador (0 → o número exato, 0,5 s). Algarismos de régua (lining), não os antigos da Playfair.
  **Nenhum grupo é palavra fraca:** a frase de peso que abre com ligação ou advérbio ("Mas se você quiser realmente")
  deixa essa parte na base e o gigante começa no protagonista (G19; revisão de diretor 2026-11-03).
- **O TRAÇO** (vitrine 2,6 s): uma barra vermelha de sinal (`#C9473B`, 12 px, cantos redondos) que se desenha da
  esquerda para a direita em 0,32 s sob **uma** palavra de um modo gigante: a palavra-alvo do gancho. **Uma vez no
  vídeo.** O vermelho é o único sinal do modelo; ele não aparece em mais nada.
- **CURSIVA (conceito com nome, frase-tese)** (vitrine 12,5–14,6 s): Great Vibes, corpo 120 px (a Great Vibes tem olho pequeno: 120 px ocupa a largura que a cursiva da ref1 ocupa), entrelinha 1,0, até 2 linhas, creme.
  **Cada palavra se escreve da esquerda para a direita enquanto é dita** (do início ao fim da palavra, no mínimo
  0,28 s). O fundo desfoca forte (14 px: o rosto fica ilegível) e escurece (0,62).
- **CITAÇÃO (fala citada)** (ref1 27,2 e 39,3 s): a imagem em preto e branco com desfoque leve (1,5 px), a legenda da
  base na mesma serifa e no mesmo corpo, em **ouro da cena**. A frase é a literal, entre aspas na fala; nunca uma frase
  inventada para "caber" o modo.
- **FECHO** (vitrine 26,7 s ao fim): a linha em Playfair 700, 84 px, entra suave (0,2 s) e, abaixo, a palavra em Great
  Vibes 180 px se escreve na voz. Com comando: "Comenta" + “palavra” entre aspas, e o resto da fala na 2ª posição
  (seção 5). Com aforismo: a frase dividida em serifa + cursiva, sem chamada. Segura até o preto.
- **Exemplo, não regra:** o cenário escuro de cortina e abajur, o terno, as frases e os temas da ref1 são do criador
  dela.
- **Interfaces:** o modelo não recria app, site ou aparelho (a tipografia é o único grafismo). Se um vídeo precisar
  mostrar uma tela, ela segue G34 (`interface-fiel.md`) e entra como CITAÇÃO visual de 1 a 2,5 s, nunca como tela cheia
  longa.

## 5. Texto na tela: uma posição, a legenda pequena

- **Uma posição só para todo texto**, centrada em x 500 (o meio da zona segura) e em y `Y_TEXTO`: 49% do quadro (ref1)
  ou, se o queixo da gravação descer mais, logo abaixo dele, com 36 px de folga para a cursiva de 2 linhas
  (`Y_TEXTO = máx(941, queixo p98 + 36 + 120)`, até 1300). Na vitrine, com a gravação sem adaptar, deu y 1187 (62%).
  O olho nunca procura o texto.
- **A 2ª posição só existe depois do fecho**, para a fala que segue o comando: pé em y 1500 (heranca: no máximo 2
  posições).
- **Legenda da base:** Playfair Display 500, **58 px** (maiúscula ~41 px; ref1: maiúscula ~36 px; sobrescrita do 72 px,
  veja seção 7a), entrelinha 1,18, creme da cena, sem tarja, só sombra larga e suave (`0 4px 28px rgba(0,0,0,.6)` +
  `0 0 60px rgba(0,0,0,.35)`, G37: nada desenha a borda da letra). Página inteira de uma vez, na 1ª palavra (ref1: troca seca por página), até 2 linhas, até ~38 letras por linha.
- **Uma página = um trecho** (G35): acaba na pontuação; trecho longo vira páginas menores do mesmo trecho. Página ≥ 1,5 s;
  a que fecha um trecho curto ("Inclusive,") pode ficar menos, nunca menos de 0,45 s (nada pisca).
- **Dentro do clarão:** a página que nasceria na subida do clarão espera o branco (até 0,2 s depois do início do
  clarão), como na ref1 ("a legenda seguinte já aparece dentro do clarão").
- **Toda palavra dita aparece uma vez só**, na legenda, num modo ou no fecho. O checador acusa buraco e repetição.
- **Rosto e mãos:** nenhum texto acima do queixo medido (com a câmera). Mão no peito por baixo da letra é aceita (a
  ref1 também tem, 9,9 s), mas o checador avisa quando mais de 20% da caixa de um modo tem mão embaixo; olhe o quadro.

## 6. Transições, som e fecho

- **Só duas transições:** o corte seco com aproximação (entrada) e o clarão (saída). Nada de desfoque de passagem,
  chicote, deslize ou flash branco seco.
- **O clarão é a cor da cena:** degradê radial da cor clara para a quente, um véu claro e 9 formas de bokeh (redondas e
  quadradas, 200 a 460 px, desfoque 22 px) que andam de leve, em `screen`. Pico de brilho próximo do branco (ref1 YAVG
  201–207 contra 63,5 da base). Cena azulada dá clarão azulado (Dewly 10,0 s): é a cor de `C`, não um âmbar fixo.
- **Som (vem ligado):** sopro quente que cresce até o pico de cada clarão; um grave curto e baixo na entrada de cada
  modo ("popup" grave, nunca swoosh); um risco de caneta bem baixo no traço. Os tempos saem do próprio plano.
- **Cama contínua (opção):** um acorde quente e calmo por baixo da voz, que some no preto (ref1 tem trilha contínua:
  −19 dB na pausa, −31 dB no preto). Desligada por padrão (música é escolha do usuário).
- Mixagem: voz na frente, efeitos com ducking, -14 LUFS, pico -1 dBTP.

## 7. Opções e regras (herança)

**Herda `.claude/skills/criar-modelo/referencias/heranca.md`.** O que este modelo sobrescreve, e por quê:

| Herança | Aqui | Motivo (ligado à forma de execução) |
|---|---|---|
| Legenda de leitura 72 px (PF16) | 58 px (Playfair, olho grande) | A forma vive do contraste entre a base pequena e calma e o modo gigante; a ref1 mede maiúscula ~36 px. 58 px de Playfair dá maiúscula ~41 px e lê no celular, também sobre as mãos. **Pede o olho do dono** (seção 7a). |
| Sem preto e branco (PF8, PR16; G21 "P&B é escolha") | o P&B entra **só** no modo citação, como sentido fixo | O P&B é gramática (fala citada), não tratamento: sem ele o espectador perde o código. Vem ligado e se desliga com a prop `pb: false` (a citação fica só com o desfoque e o ouro). |
| Nenhum tratamento de cor na gravação (G33) | nenhum tratamento de cor; só os efeitos momentâneos dos modos (escurecer/desfocar no gigante e na cursiva, P&B na citação) e o clarão por cima | O efeito marca o modo e some no clarão; a cor da gravação na base não é tocada. |
| Poucos cortes de zoom, ~3 no vídeo (PF5, PF13) | 1 a cada ~10 s (3 em 30 s, 6 em 60 s) | Cada corte marca a entrada de um modo; é o que dá o código. Num vídeo de 30 s fica dentro dos 3. |
| Hook leve: abre com a pessoa e só depois a edição (P2) | abre com a pessoa **e** o gancho em GIGANTE desde o quadro 0 | O gancho escrito desde o quadro 0 é regra mais nova (G23, memória "gancho na tela desde o início"); a pessoa está na tela o tempo todo. |
| Tela simples vira tela dividida/ilustração (PF7, PF14) | nunca tela dividida, cheia ou ilustração | A contenção é o encanto (ref1 inteira: o único grafismo é a tipografia). |

O resto da herança vale inteiro: legenda conta a história, G35, tempo de leitura, destaque só no protagonista, zona
segura, G37 (sem contorno/glow colado), nome/@ só reais, nunca o nome do modelo na tela, outra câmera nunca por IA.

**Opções:**

| Opção | Padrão | Como mudar |
|---|---|---|
| P&B no modo citação | **ligado** | Prop `pb: false` |
| Efeitos sonoros (sopro, grave, risco) | **ligados** | 3º argumento `-` no `mixar.sh` (sai só a voz) |
| Cama contínua | desligada | `scripts/som.py --cama` |
| Traço vermelho | ligado se o gancho tem palavra-alvo | `TRACO = null` |
| Troca de plano na base | só quando a base passaria de ~9 s | `REENQUADRES = []` |
| Cor dos elementos (`C`) | a medida da cena | `scripts/cor_da_cena.py` sugere; o usuário pode trocar (G33) |

### 7a. O que pede o olho do dono (decisões de gosto)
1. **Corpo da legenda base:** 58 px de Playfair (recomendo) contra 72 px (PF16). 72 deixa a base mais "legenda comum" e tira o
   contraste com o gigante.
2. **P&B na citação ligado por padrão** (recomendo ligado; é a gramática).
3. **Posição do texto em gravação com o rosto baixo** (a vitrine, sem adaptar, pôs o texto a 62%, sobre as mãos do
   microfone; o checador avisa 22 a 44% da caixa dos modos com mão embaixo): depois da aprovação o `adaptar.py` leva o rosto ao tamanho do modelo e o texto volta a ~49%.

### 7b. Profissão regulamentada (médico, advogado, dentista, psicólogo, nutricionista, engenheiro e afins)
O modelo serve especialistas de conselho. **Todo roteiro desses nichos passa pelas regras de publicidade atuais do
conselho da categoria (OAB, CFM, CRO, CFP, CFN, CREA...) antes de editar**, pesquisadas na hora, nunca de memória.
Em geral: nada de promessa de resultado; nada de antes e depois quando o conselho proíbe; nada de captação agressiva
nem de preço como chamariz; a autoridade vem do conhecimento (data, nome técnico, fonte), nunca de autoelogio. A
autoridade de fonte do gancho ("Em 1957...") só com fonte verificada em 2 lugares; a fala citada é sempre um exemplo
de conversa, nunca um paciente ou cliente real identificável. Na dúvida, o tom sóbrio e informativo vence.

## 8. Zona segura, material e "Com o que o vídeo tiver"

- Todo texto em x 60–940 e y 250–1500 (1080x1920); o centro dos textos é x 500. Nenhum texto acima do queixo.
- Nome e @ na tela, só os reais de quem fala, ou nenhum. Nunca o nome do modelo.

| Recurso da referência | O que o modelo faz só com a gravação da pessoa |
|---|---|
| Cenário escuro de estúdio, luz de abajur | nada a fazer: a cor do modelo vem da cena que existe (`cor_da_cena.py`); o clarão sai na cor dela |
| Trilha contínua licenciada | cama sintetizada, opção |
| Clarão de película (película real ou banco) | gerado em código (véu + bokeh), na cor da cena |
| Plano mais fechado na entrada de modo | corte de zoom da mesma tomada |
| Tratamento de pele de estúdio | não entra (G33) |
| Fala citada encenada | só se a fala tem; senão o modo não aparece |
| Tipografia | tudo do modelo, sem material |

Não precisa de B-roll, print, segunda câmera nem imagem. **Funciona com uma selfie de 30 s.**

---

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio (`sistema/`), menos onde está escrito "na pasta do vídeo".

1. **Roteiro (se o vídeo ainda não foi gravado):** gancho ≤ 3 s (paradoxo ou situação do público); a objeção respondida
   logo depois; autoridade por fonte (data e nome técnico) ou por campo, nunca autoelogio; o contraste "a frase do jeito
   comum x a do jeito certo", com as palavras literais (vira citação); uma frase-tese (vira cursiva); fecho em aforismo
   ou voltando ao gancho; ~2,7 palavras/s, com pausas. Profissão regulamentada: seção 7b antes de tudo.
2. **Crie o vídeo:** `.venv/Scripts/python.exe tools/novo-video.py renomado01 <gravacao.mp4> <AAAA-MM-DD-tema>`
   (**antes da aprovação do modelo, com `--sem-adaptar`**: ainda não há `assinatura.json`; esta nota sai na aprovação).
   Nome errado na transcrição: `--trocar Errado=Certo`.
3. **Meça a cena e as mãos** (na pasta do vídeo): `../../.venv/Scripts/python.exe scripts/cor_da_cena.py` (cole a linha
   `C` no plano) e `QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/maos.py`.
4. **Escreva o `plano.md`** frase a frase sobre `src/palavras.json`: a função de cada frase (seção 1) e o modo que ela
   chama. Conte: um modo a cada ~10 s, modos de 0,9 a 4,5 s, base respirando.
5. **Monte O PLANO** no topo de `src/Reel.tsx` (o molde para ao carregar e diz o que não bate com a fala):
   - `C`: a cor da cena;
   - `MODOS_DEF`: `{tipo: 'gigante', primeira, grupos}`, `{tipo: 'cursiva', primeira, linhas}` (até 2) ou
     `{tipo: 'citacao', paginas: [[i, 'texto / 2ª linha'], ...]}`, na ordem da fala;
   - `TRACO`: `[índice, 'palavra']` dentro de um gigante, ou `null`;
   - `REENQUADRES`: `[[índice, 'palavra', zoom]]`, ou `[]`;
   - `FECHO_DEF`: `{serifa: [i, 'palavra'], cursiva: [i, 'palavra'], aspas}`, ou `null`;
   - `PEDACOS`: a legenda da base, `[1ª palavra, 'texto / 2ª linha']`, cobrindo toda palavra fora dos modos e do fecho.
6. **Confira:** `node scripts/checar.mjs` (na pasta do vídeo) até `APROVADO`; leia os avisos.
7. **Som:** `../../.venv/Scripts/python.exe scripts/som.py` (na pasta do vídeo; `--cama` liga a música).
8. **Olhe quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 5 10` (na pasta do vídeo).
9. **Renderize** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts Renomado01 out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2`
10. **Mixe:** `QUEM=<nome> sh ../../tools/com-trava.sh sh scripts/mixar.sh out/so-video.mp4 out/final.mp4` (-14 LUFS).
11. **Prove:** folha de 1 quadro por segundo (`tools/folha.py`) e a lado a lado
    (`../../.venv/Scripts/python.exe scripts/lado_a_lado.py out/final.mp4 <ref.mp4> "nosso_s:ref_s:rótulo" ...`). Depois
    da aprovação, também `tools/parece.py`.

**O terceiro vídeo (tema chato, fala longa, sem citação):** base com a legenda pequena; o gancho em gigante; a tese em
cursiva; a virada em gigante; um reenquadre se a base passar de ~9 s; fecho em serifa + cursiva. Sem fala citada, não
há citação: não invente. Vídeo de 60 s pede ~6 modos; de 15 s, 1 ou 2.

## 10. O plano da vitrine (para comparar)

Gravação comum (`teste-comum/gravacao.mp4`, 30,4 s de fala, 3,2 palavras/s), sem adaptar.

| Tempo | Fala | Modo | Na tela |
|---|---|---|---|
| 0–2,9 s | Esse vídeo está sendo 100% editado pelo Claude. | GIGANTE (gancho), zoom 1,15 | ESSE VÍDEO / ESTÁ SENDO / 0→100% / EDITADO / PELO CLAUDE., traço sob CLAUDE. |
| 2,8 s | | clarão | |
| 3,0–10,6 s | Ele foi criado ... usando o Claude. | base | 3 páginas |
| 10,6 s | Inclusive, se você estiver no Instagram agora, | base, troca de plano 1,06 | 2 páginas |
| 12,5–14,6 s | você está vendo apenas um desses modelos. | CURSIVA (a tese), corte + 1,15 | 2 linhas escritas na voz |
| 14,4 s | | clarão | |
| 14,6–21,4 s | Eu posso até colocar ... três vezes. Mas se você quiser realmente | base | 4 páginas ("realmente" é advérbio: não vira gigante, G19) |
| 21,4–24,1 s | ver outros modelos de edição como esse | GIGANTE (o convite), corte + 1,15 | VER OUTROS / MODELOS / DE EDIÇÃO / COMO ESSE |
| 23,9 s | | clarão | |
| 24,1–26,7 s | e aprender a como usar isso nos seus vídeos, | base | 1 página |
| 26,7 s–fim | comenta edição aqui embaixo que eu vou te mandar na sua DM agora. | FECHO | Comenta / “edição” e a legenda na 2ª posição; preto 1,2 s |

Sem fala citada na gravação comum: a vitrine não mostra o modo citação (seção 11).

## 11. Estado e pendências
- Modelo em prova (2026-11-03). Não entra na contagem do catálogo nem no aberto até o "ok" do dono.
- **Referência própria definitiva:** pendente. Uma gravação de especialista de verdade (com fala citada, para mostrar
  os quatro modos), editada aqui e aprovada pelo dono, vira o `referencia/`; aí rodam `tools/assinatura.py renomado01`
  e `tools/referencia.py renomado01`, e o `--sem-adaptar` sai da seção 9.
- O modo citação está no código e no checador, mas não aparece na vitrine (a fala comum não tem citação).
- Vitrine (2026-11-03): `oficina/2026-11-03-renomado01-vitrine/out/final.mp4`, 32,0 s, -14,0 LUFS, pico -1,1 dBTP,
  checador APROVADO (avisos: 3 páginas curtas que fecham trecho, G35; uma base de 2,5 s; mãos sob o texto a 62%).
  Folhas: `conferencia/folha-1qps.jpg` e `conferencia/lado-a-lado.png` da pasta da vitrine.

## 12. O que separa o renomado01 dos vizinhos

| | renomado01 | profissional01 | modelodinamico03 | sofistmotion01 |
|---|---|---|---|---|
| Frase | base calma + 4 modos de sentido fixo, entrada por corte, saída por clarão | autoridade didática: tudo que puder vira ilustração, tela cheia ou dividida | corte de podcast como trailer, destaque de 3 vozes nas palavras fortes | motion narrado, sem apresentador |
| Pessoa na tela | sempre | ~71% (telas cheias e divididas) | sempre (respiro borrado) | nunca |
| Grafismo | só tipografia | heróis, painéis, celular, B-roll | tipografia de 3 vozes | objetos de motion |
| Fontes | 2 famílias (Playfair Display + Great Vibes) | Poppins + 2 alternativas | Inter Tight + Playfair + Anton | Inter + contorno neon |
| Posições de texto | 1 (2ª só depois do fecho) | 2 | 2 | livre por tela |
| P&B | sim, só com sentido (fala citada) | proibido | não | não |
| Cor | tirada da cena de quem grava | destaque tirado do cenário | âmbar fixo, vermelho Anton | ouro na noite fixo |
| Transição | corte+aproximação / clarão de película | flash de 4 quadros na ênfase | desfoque, flash, chicote | flash, clarão, preto, mergulho |
| Destaque | o sentido decide o modo (peso, conceito, citação) | título de frase-chave | palavra forte em vermelho | palavra em contorno |
| Fecho | aforismo ou comando em serifa + cursiva, e preto | botão Comenta que acende | Comenta “PALAVRA” em Anton | assinatura em ouro |
