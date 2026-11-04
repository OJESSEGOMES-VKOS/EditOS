# cortepalestra01: corte de pregação e palestra

Este é o único arquivo que você precisa ler para editar neste modelo. Tudo o que está aqui é regra. Quando algo daqui
bater com o código do molde (`sistema/moldes/cortepalestra01/`), vale o que está aqui.

**Ainda sem vídeo aprovado.** Até o dono aprovar, o padrão é a vitrine
(`sistema/oficina/2026-11-03-cortepalestra01-vitrine/out/final.mp4`) e as medidas das duas referências (seção 2). Antes da
aprovação não existe `assinatura.json`: o vídeo novo nasce com `--sem-adaptar` e o `parece.py` ainda não confere. As duas
coisas caem quando a referência própria for aprovada (seção 10, pendências).

**A referência mostra o jeito do modelo, não um roteiro para copiar.** O modelo veio de dois cortes de pregação de
terceiros, estudados como medida (`analise/`). Nenhum quadro, texto, frase, doutrina ou som deles entra em vídeo nosso.

---

## 0. Do seu jeito (o aluno preenche, se quiser)

Escreva aqui, com as suas palavras, o que vale para todos os seus vídeos neste modelo. Pode ir somando com o tempo.

- Meu nome e @ (só onde o modelo mostra; por padrão, nenhum):
- De quem são as gravações que eu corto (eu, minha igreja, o palestrante que me contratou):
- Cor do destaque que eu prefiro (ou "a que o `cor.py` sugerir"):
- Fecho: escurecer até o preto ou segurar a imagem:
- Gosto de:
- Não quero:

**Para o assistente:** leia esta seção antes de tudo e siga o que está nela. Ela decide o conteúdo e as opções da
seção 7, mas não muda a forma do modelo (o ponto certo, a contenção, a densidade do destaque, a posição). Se um pedido
daqui mudar a forma, avise antes de fazer. Correção que vale para os próximos vídeos: ofereça anotar aqui, nas palavras
da pessoa.

---

## 1. A cara do modelo

**Um pensamento inteiro recortado da gravação longa, da primeira palavra da frase de impacto até a palavra que resolve,
com uma legenda pequena e quieta num lugar só, e a palavra-resposta acendendo grande em serifa itálica: denso no
gancho, raro no corpo, e a última frase respirando.**

O trabalho do modelo é, nesta ordem: **escolher o trecho** (seção 3, a parte que mais vale), **conter a edição** (quase
nada na tela além da legenda) e **gastar o destaque só onde a fala dá a resposta**.

**Os três sinais de reconhecimento (mudo, no primeiro segundo):**
1. A gravação do evento inteira, intacta: sem zoom, sem cor, sem moldura, sem elemento gráfico. Só texto por cima.
2. Uma legenda branca **pequena**, de uma linha, sempre no mesmo ponto, na barriga/peito de quem fala (centro a 67% da
   altura).
3. Uma palavra em **serifa itálica grande** que acende quase só no começo, e depois some por longos trechos.

**De onde vem o encanto** (medido, não impressão): a escolha do trecho (as duas referências entram em 0,00 s na frase
de impacto e saem na palavra que resolve), a contenção (ref1: 8 destaques nos 6,7 s do gancho e **2 nos 60 s
seguintes**; ref2: nenhum bloco nos 22 s finais) e a sincronia (o texto nasce com a voz e a resposta acende no instante
em que é dita). O que as referências **evitam** é regra tanto quanto o que fazem:
- nenhum efeito na imagem (zoom, cor, transição, tremida, recorte da pessoa);
- nenhum destaque no clímax e no fecho (a força ali é da fala: "Ele vai voltar", "obedecê-la hoje" ficam na legenda);
- nenhum som de edição (efeito, golpe, whoosh) e nenhuma música (a música da ref2 é a lição do que não fazer, pelo dono).

### A gramática fala → tela

| Função da frase | O que a tela faz | Prova |
|---|---|---|
| Gancho de pergunta sobre a vida de quem assiste | **bloco que se monta** com a voz: sans pequena + a palavra da pergunta em serifa na COR + a resposta em serifa branca; zera a cada pergunta nova | ref1 0,0–6,7 s |
| Gancho de contradição ("Não estamos em…") | bloco que se monta com a palavra de peso em serifa (branca, ou na COR se o fundo pedir) | ref2 0,0–5,25 s |
| Tese, prova, citação, explicação | só a legenda pequena | ref1 6,8–18 s; ref2 5,3–11 s |
| Pergunta retórica + pausa | a pergunta fica na legenda **atravessando a pausa**; a resposta entra no instante dito, em **destaque na COR** (é o destaque do corpo) | ref1 18,0–20,0 s e 30,6–34,0 s |
| Sentença curta que vale sozinha | legenda; na 1ª metade, se ainda há destaque disponível, a palavra de peso dela | ref2 11,0 e 16,5 s |
| Paralelismo (a mesma estrutura 2 vezes) | se houver destaque, na **2ª** vez, que pesa mais e segura ~2,5 s | ref1 31,5–34,0 s |
| Virada pessoal ("eu te dou um conselho…") | só a legenda | ref1 41,5 s |
| Clímax e fecho | só a legenda; a última página fica na tela enquanto a imagem respira | ref1 66,8 s; ref2 48,3 s |

### O que separa este modelo do pregacaodinamica01 (e do ojgstyle01)

Regra de um modelo não entra no outro (G12). Nada daqui muda o `pregacaodinamica01.md` nem o molde dele.

| | cortepalestra01 | pregacaodinamica01 | ojgstyle01 |
|---|---|---|---|
| De onde vem o vídeo | **trecho escolhido** de gravação longa (culto, palestra, evento, aula) | gravação própria curta, já é o vídeo | gravação própria, decupada em tomadas |
| Duração | 45–75 s, o tamanho do pensamento (refs 49,5 e 70 s) | ~30 s | 30–60 s |
| Ênfase | densa no gancho, **rara** no corpo (no máx. 1 a cada 20 s) | a cada 5–10 s, em todo o vídeo | uma palavra-chave por frase |
| Legenda | Montserrat 700, **56 px**, 1 linha (até 2), centro a 67% | Inter 800, 60 px, páginas de 2 linhas, y 1060 | Inter 600, 66 px, 2 posições |
| Destaque | Playfair Display itálica 128 px, **cor escolhida contra o fundo** + branco na resposta em imperativo | Instrument Serif vermelha `#FF2424` fixa, frase-bloco de até 250 px | Playfair Black itálica amarela fixa |
| Imagem | intacta: sem zoom, sem letreiro, sem tela creme, sem chicote | zoom 1,0–1,18, letreiro atrás da pessoa recortada, tela creme | crua, papel com quadros |
| Som | só a voz | voz + golpes graves + whoosh | voz original |
| Fecho | a última frase respira 1,6 s (escurece ou segura) | preto 0,73 s, "Comenta" fixo quando dito | — |

## 2. Os números do modelo

Medidos nas duas referências (`analise/ref1_decupagem.md`, `analise/ref2_decupagem.md`) e na vitrine. Depois da
aprovação, o `assinatura.json` do vídeo aprovado passa a valer para o `parece.py`.

| Item | Referências | Regra do modelo |
|---|---|---|
| Duração | 69,97 s (ref1), 49,53 s (ref2) | 45 a 75 s; o corte tem o tamanho do pensamento, nunca se enche |
| Entrada | 1ª palavra em 0,00 s nas duas | a 1ª palavra em até 0,15 s (o checador confere) |
| Saída | ref1: escurece de ~0,4 a 1,2 s depois da última palavra, ~2 s de preto; ref2: 1,2 s de imagem | FOLGA 1,6 s (1 a 2 s); escurece de +0,4 a +1,2 s, preto até +1,6 s |
| Velocidade da fala | 2,92 (ref1) e 2,15 (ref2) palavras/s; gancho até 3,4 | não se acelera a fala |
| Legenda | maiúscula 39 px → corpo ~54–56 px (2,8% da altura); centro a 67% (y 1269–1308) | Montserrat 700, 56 px, centro y 1286 |
| Destaque | 115 px de altura, 750 px de largura (69% do quadro) → ~2,3x a legenda | Playfair Display itálica 700, 128 px (o 500 da 1ª prova sumia sobre a camiseta escura: revisão de diretor) |
| Cor do destaque | azul `#4562AF` contra fundo de matiz 10–16° (ref1); branco contra fundo azul de matiz 205–214° (ref2) | a matiz oposta à do fundo, com contraste de pelo menos 4,5:1 com o que fica atrás da legenda (`scripts/cor.py`) |
| Densidade do destaque | ref1: 8 em 6,7 s, depois 2 em 60 s; ref2: 5 blocos até 26 s, depois 22 s sem | gancho com pelo menos 1; corpo no máx. 1 a cada 20 s (mínimo 2) |
| Cortes de edição | 0 (as 4 a 13 "cenas" medidas são trocas de câmera do evento) | 0; só as emendas do recorte, quando a gravação tem tomadas repetidas |
| Luz e cor | as da gravação | as da gravação (nenhum tratamento, G33) |
| Som | voz média -17 dB; fundo ~10 dB abaixo (música, não copiar) | só a voz, -14 LUFS, pico -1 dBTP |

## 3. O ponto certo: como escolher o trecho numa gravação longa

É a parte que mais vale do modelo. Uma pregação de 40 min tem, em geral, três a seis cortes bons. O corte bom não é o
trecho mais bonito: é **um pensamento inteiro, do gancho à resolução, e nada depois**.

### As regras (medidas nas duas referências)
- **R1. Começa na primeira palavra da frase de impacto.** Sem respiração, sem "então", sem a frase de contexto de antes.
  As duas referências têm a 1ª palavra em 0,00 s.
- **R2. O gancho fala com a vida de quem assiste e resolve rápido.** Dois jeitos provados:
  - **pergunta + resposta em série:** perguntas da vida da pessoa, cada uma respondida no imperativo (ref1: três em
    6,7 s);
  - **contradição de uma crença comum:** "o que você acha bom não é o que parece" (ref2: em 4,9 s; puxou 2,7x os
    comentários com as mesmas curtidas).
- **R3. Um pensamento inteiro e nada depois.** O corte acaba na frase que fecha a tese. Quem fala não começa o assunto
  seguinte dentro do corte.
- **R4. A última palavra é a mais forte** ("voltar.", "hoje"). Nunca termina em "né", "amém", "tá", transição ou pedido
  de oração.
- **R5. Pergunta retórica + pausa + resposta** segura a atenção no meio. Prefira trechos que tenham esse jogo.
- **R6. Sentenças que valem sozinhas**, uma a cada ~7 s (ref2: 6 em 48 s).
- **R7. Paralelismo pesa mais na 2ª vez.**
- **R8. Virada pessoal antes do fecho:** sai da teoria para a vida de quem fala, e daí para o fecho.
- **R9. Tamanho:** 45 a 75 s. Pensamento que fecha em 40 s é um corte de 40 s; pensamento que pede 90 s é dividido em
  dois cortes (cada um com o seu gancho) ou não é corte.

### O passo a passo (o que o aluno faz)
1. **Transcreva a gravação inteira** (o `tools/novo-video.py` já faz: `base/palavras.json`). Gravação de mais de
   ~20 min: corte antes, à mão ou com ffmpeg, a parte do culto que interessa (a ministração), para a transcrição não
   levar horas.
2. **Rode o mapa:** `../../.venv/Scripts/python.exe scripts/ponto.py` (na pasta do vídeo). Ele numera as frases, mostra a
   pausa antes de cada uma e marca: `P` pergunta, `V` fala com "você", `N` contradição/negação, `S` sentença curta,
   `R5` pergunta com pausa depois, `C` começa em continuação (não serve de 1ª frase), `F` fecha bem, `X` tomada
   repetida. E lista as janelas candidatas de 45 a 75 s, com uma pontuação que só ordena.
3. **Leia como quem assiste no feed, não como quem estava no culto.** Para cada janela candidata, responda:
   - A 1ª frase faz sentido para quem não ouviu nada antes? (Se pede "como eu disse", não.)
   - Ela fala da vida de quem assiste, ou contradiz algo que ele acredita?
   - Existe uma resposta, uma virada ou uma sentença no meio?
   - A última frase resolve a primeira? A última palavra é forte?
   - Tira um pedaço do meio e o pensamento ainda fecha? Então o pedaço sai (emenda) ou o corte é mais curto.
4. **Escreva a escolha** em `trecho.json`: `{"frases": [12, 13, 14, 15, 16, 17, 18, 19]}`. Frases seguidas viram um
   trecho contínuo, com as pausas naturais (a pausa retórica é parte do corte). Pular um número cria uma **emenda**:
   use só para tirar tomada repetida (`X`), tropeço ou aparte (aviso do culto, "pode sentar"), nunca para costurar
   frases de lugares diferentes da pregação num pensamento que quem falou não disse.
5. **Recorte:** `QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/recortar.py`. Sai a fala
   do trecho (`public/fala.mp4`, `public/voz.wav`), as palavras e o rosto no tempo do corte e `src/emendas.json`. A
   gravação deitada (16:9 de evento) vira 9:16 num recorte fixo centrado na pessoa; a de celular entra inteira.
6. **Ouça o corte inteiro uma vez antes de editar.** Se o começo pede contexto ou o fim pede continuação, volte ao 3.

### O que nunca fazer na escolha
- Tirar a frase do contexto para que diga outra coisa (é a fala de alguém: o sentido é o dela).
- Juntar frases de momentos diferentes num pensamento novo.
- Cortar para caber em 60 s um pensamento que só fecha em 80: divida em dois cortes ou escolha outro.
- Usar gravação de outra pessoa sem a autorização dela (a igreja, o palestrante): o corte é de quem fala.

## 4. O repertório (o que aparece na tela)

**Legenda base** (a do vídeo quase inteiro): Montserrat 700, 56 px, branca `#FFFFFF`, sem caixa, sem contorno; a linha
se monta palavra por palavra no tempo da voz e fica até a próxima página. A página é centrada na zona segura (x 500),
centro em y 1286, e **dentro dela as linhas se alinham à esquerda**: a linha cresce da margem, como escrita (centrada,
a 1ª palavra nascia fora do lugar, à espera das palavras que ainda não foram ditas; revisão de diretor da vitrine).

**Bloco do gancho** (0 s até `GANCHO_ATE`): páginas de até 4 degraus que se montam com a voz e zeram a cada pergunta ou
sentença nova. Sans pequena + palavra em Playfair itálica grande (128 px). A palavra da pergunta (ou a de peso da
contradição) vai na **COR**; a resposta em imperativo vai em **branco**. Cada degrau é uma linha (nada de palavra
pequena "subindo" na grande).

**Destaque do corpo** (no máximo 1 a cada 20 s, no mínimo 2 no vídeo): a palavra-resposta da pergunta retórica, ou a
palavra de peso de uma sentença de efeito na 1ª metade, em Playfair itálica 128 px na COR, na mesma posição da legenda
e no lugar dela. Segura enquanto a ideia vale (~2,5 s na ref1).

**A pergunta que segura na pausa:** a página da pergunta retórica fica na tela durante a pausa; a resposta entra quando
é dita.

**Fecho:** a última página fica; a imagem escurece até o preto (opção: segura a imagem).

**Exemplo, não regra:** o azul `#4562AF` (era o oposto de um LED vermelho), o encavalamento da linha pequena sobre a
grande (a casa proíbe), a sans pesada maior e os blocos à esquerda da ref2, o letreiro do telão do palco.

**Interface (G34):** este modelo não recria interface nenhuma.

## 5. O texto na tela (e o que este modelo sobrescreve da herança)

Herda `.claude/skills/criar-modelo/referencias/heranca.md` inteira, com estas sobrescritas, cada uma ligada à forma:

| Herança | Aqui | Por quê |
|---|---|---|
| Legenda de gravação normal: referência de 72 px (PF16) | **56 px** (faixa por vídeo: 56 a 72 px) | a legenda pequena e quieta é o que faz o destaque raro pesar (ref1: corpo ~56 px, 2,8% da altura). 72 px vira legenda comum e apaga o contraste com a serifa |
| Palavra-chave forte ganha animação/ilustração (G4), tela simples vira tela dividida ou ganha ilustração (PF7, PF14) | **nada de ilustração, tela criada ou tela dividida** | a forma é contenção: a força é da fala escolhida. Ilustrar uma pregação a cada frase é o oposto do que as duas referências fazem |
| Câmera: aproximação e afastamento leves, zoom contínuo lento | **nenhum movimento de câmera** | as trocas de plano das referências vêm da gravação do evento (dono); a gravação entra intacta |
| Efeitos sonoros sutis, "popup" grave em elemento que surge | **sem efeito sonoro** | nenhuma das referências tem; o silêncio da edição deixa a voz sozinha |
| Bloco de legenda é um trecho só (G35) | vale para toda **legenda**; o **bloco do gancho** pode juntar a pergunta e a resposta dela (só através do "?") | a pergunta e a resposta são uma unidade no gancho (ref1); o checador acusa qualquer outro trecho junto (decisão para o olho do dono, seção 10) |

E o que a referência faz e a casa **não deixa** (a casa vence):
- **Tempo de leitura (G1).** A ref1 troca a legenda a cada 1 ou 2 palavras (~0,5 s). Aqui a página dura **pelo menos
  1,5 s** e cada palavra **0,4 s**: a linha se monta palavra a palavra com a voz (o olho vê 1 a 3 palavras novas por vez,
  como na referência) e só troca quando o trecho acaba.
- **Sem sombra justa nem contorno (G37).** Só uma sombra larga e suave (`0 8px 64px rgba(0,0,0,.34)`) para ler sobre a
  gravação clara.
- **No máximo 4 linhas** por bloco (a ref2 chega a 5) e **2** por página de legenda.
- **Escreva o que foi dito, não o que o transcritor ouviu** (ref2: tela "inchou", transcrição "encheu"):
  `tools/trocar.py oficina/<v> Errado=Certo`.
- **Destaque só no termo protagonista**, do mesmo tamanho em todo o vídeo (128 px). Nunca nome do modelo na tela; nome
  e @ só os reais de quem fala, e por padrão nenhum.

## 6. Transições e fecho

- **Nenhuma transição de edição.** A gravação corre do 0 ao fim. As trocas de câmera de uma gravação multicâmera ficam
  como vieram (não são edição); a página pode atravessá-las (ref2 18,0 s).
- **Emenda do recorte** (só quando o trecho pula uma tomada repetida): corte seco, e **nenhuma página atravessa a
  emenda** (o checador acusa). O reenquadramento 1,0 ↔ 1,08 na emenda é opção desligada.
- **Fecho:** a última palavra fica na tela; a imagem escurece de 0,4 a 1,2 s depois dela e o preto segura até 1,6 s
  (`ESCURECE = true`). A voz cala 0,05 s depois da última palavra, em 0,3 s, para nada do assunto seguinte vazar.
- **Sem chamada inventada.** O corte termina na frase que resolve; a chamada para ação vai na legenda do post.

## 7. Opções (o que vem ligado e o que é escolha)

| Opção | Padrão | Como mudar (em `src/Corte.tsx`) |
|---|---|---|
| Escurecer até o preto no fecho (ref1) | **ligado** | `ESCURECE = false` segura a imagem (ref2) |
| Cor do destaque | a sugerida pelo `scripts/cor.py` para a gravação (vitrine: a do plano, seção 10) | `COR = '#...'`. Paletas prontas: azul `#4562AF` (medido na ref1, contra fundo quente: vermelho, madeira, bege), âmbar `#C98A2B` (sugestão da casa, não medida, contra fundo frio: azul, verde), só branco (fundo azul saturado, como a ref2) |
| Tamanho da legenda | 56 px | `TAM.sans` entre 56 e 72 (o destaque fica ~2,3x: `TAM.serif`) |
| Música | desligada | `sh scripts/mixar.sh out/so-video.mp4 public/trilha.wav out/final.mp4` (~16 dB abaixo, com ducking) |
| Reenquadramento nas emendas | desligado | `REENQUADRA_EMENDAS = true` |
| Tratamento de cor, preto e branco, efeitos, música | desligados (G21, G33) | não fazem parte do modelo |

## 8. Zona segura, rosto e material

- Todo texto entre x 60–940 e y 250–1500 (1080x1920); o centro do texto é x 500. O checador renderiza só os textos e
  acusa qualquer pixel fora.
- Nenhum texto sobre o rosto: o topo de cada página fica 20 px abaixo do queixo medido (`src/rosto.json`) enquanto ela
  está na tela. Gravação com a pessoa muito perto (queixo abaixo de y ~1100): desça `Y_CENTRO` até o pé do bloco caber
  em y 1500, ou use páginas de menos degraus.
- **Mãos:** quem prega gesticula no peito, onde mora o texto. A legenda pode passar pela mão de relance (as duas
  referências passam: microfone e mão sob a legenda), mas o **destaque não fica mais da metade do tempo dele sobre a
  mão** (`scripts/maos.py` mede, o checador acusa). Se ficar, o destaque vai para outra palavra da mesma ideia ou o bloco
  perde um degrau.
- Material: só a gravação. Nada a buscar, gerar ou pedir.

### Com o que o vídeo tiver (G32)

| Recurso das referências | O que o modelo faz só com a gravação da pessoa |
|---|---|
| Gravação multicâmera do evento (trocas de lente, plateia) | não é edição: entra como veio. Gravação de uma câmera só fica em **plano único**. Nunca se gera "outra câmera" |
| LED, telão e letreiro do palco | nada: o fundo é o da gravação. Fundo claro ou neutro (sala, estúdio, celular em casa) funciona igual; o `cor.py` escolhe a cor contra ele |
| Música por baixo | nada (a voz sozinha) |
| Gravação deitada 16:9 (YouTube, transmissão) | recorte 9:16 fixo centrado na pessoa (`recortar.py`) |
| Gravação com tomadas repetidas (celular, aula gravada) | o `ponto.py` marca `X` e o trecho pula a tomada: emenda em corte seco |
| Pregador que anda pelo palco | recorte fixo na mediana do rosto; se ele sai do quadro por mais de 1 s, esse trecho não serve para corte (escolha outro) |
| Fala sem pergunta nem contradição no começo | o gancho é a 1ª sentença que vale sozinha (R6), com a palavra de peso dela em destaque. Sem nenhuma, a gravação não tem corte nesse trecho |

## 9. Como fazer um vídeo novo

Os comandos rodam da raiz do estúdio (`sistema/`), menos onde está escrito "na pasta do vídeo". Tudo pesado vai pela
trava.

1. **Crie o vídeo** (transcreve a gravação inteira em `base/`):
   `QUEM=<nome> sh tools/com-trava.sh .venv/Scripts/python.exe tools/novo-video.py cortepalestra01 <gravacao.mp4> <AAAA-MM-DD-tema> --sem-adaptar`
   (o `--sem-adaptar` cai depois da aprovação; nome que a transcrição errar: `--trocar Errado=Certo`).
2. **Ache o ponto certo** (seção 3): `../../.venv/Scripts/python.exe scripts/ponto.py`, escolha, escreva `trecho.json`,
   e `QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/recortar.py` (na pasta do vídeo).
   Escreva o `plano.md` (ou `roteiro.md`) com o trecho, o porquê da entrada e da saída e as palavras de destaque.
3. **Escolha a cor:** `../../.venv/Scripts/python.exe scripts/cor.py` e ponha a sugestão (ou a do usuário) em `COR`.
4. **Monte o plano** em `src/Corte.tsx` (na pasta do vídeo): `GANCHO_ATE` (onde acaba o gancho) e `PEDACOS`, as páginas
   `[índice da 1ª palavra, 'texto']`, com `*palavra*` (serifa na COR) e `_palavra_` (serifa branca) só onde a gramática
   da seção 1 manda. Uma página por trecho (vírgula, ponto, interrogação fecham a página), até 2 linhas na legenda, até
   4 degraus no bloco. O índice é a posição da palavra em `src/palavras.json` (0 é a primeira).
5. **Meça as mãos** (pela trava): `QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/maos.py`.
   **Confira:** `node scripts/cobertura.mjs` (na pasta do vídeo; ele pega a trava sozinho, não rode dentro do
   `com-trava.sh`) até sair "zerado". Ele confere entrada e saída, toda palavra na tela, tempo de leitura, G35, linhas,
   densidade do destaque, emendas, queixo, mãos e zona segura, e diz o que mudar. A página que ainda está na tela quando
   chega uma emenda acaba nela sozinha. Conta de bolso para quebrar páginas: a página nasce 1 quadro antes da 1ª
   palavra e acaba 1 quadro antes da 1ª palavra da seguinte; a última palavra de cada página precisa de 0,4 s até lá,
   então a página só pode acabar onde a fala dá esse fôlego (vírgula, ponto, palavra longa).
6. **Olhe quadros:** `QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 0.5 3 ...` (na pasta do vídeo).
7. **Renderize** (na pasta do vídeo):
   `QUEM=<nome> sh ../../tools/com-trava.sh npx remotion render src/index.ts CortePalestra out/so-video.mp4 --codec=h264 --crf=16 --concurrency=2`
8. **Mixe:** `QUEM=<nome> sh ../../tools/com-trava.sh sh scripts/mixar.sh out/so-video.mp4 out/final.mp4` (só a voz,
   -14 LUFS). A versão vai sozinha para `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4`.
9. **Prove:** folha de 1 quadro por segundo (`tools/folha.py`) e, depois da aprovação do modelo,
   `.venv/Scripts/python.exe tools/parece.py oficina/<v>/out/final.mp4 cortepalestra01`.

**O terceiro vídeo do aluno** (pregação longa, fala lenta, sem pergunta nenhuma): o gancho é a primeira sentença que
vale sozinha, com uma palavra de peso em serifa; no corpo, sem pergunta retórica, o destaque vai em no máximo duas
sentenças de efeito da 1ª metade; o resto é legenda. Se o `ponto.py` não acha janela de 45 s, rode `--min 35`: o corte
tem o tamanho do pensamento.

## 10. O plano da vitrine (para comparar)

Vitrine: `sistema/oficina/2026-11-03-cortepalestra01-vitrine/` (`out/final.mp4`, `plano.md`, `trecho.json`,
`trecho-mapa.txt`, `conferencia/folha-1qps.jpg`, `conferencia/lado-a-lado.png`). É prova do sistema, não conteúdo.

**A gravação:** a única gravação longa do Jessé no EditOS, `oficina/2026-10-29-ojg-01-sistema-de-edicao/entrada/20261023_162933.mp4`
(157,5 s, celular em pé, com tomadas repetidas). A gravação comum (`teste-comum/`, 30 s, um pensamento só) não deixa
provar a escolha do trecho, que é a parte principal do modelo.

**O ponto certo:** o `ponto.py` achou 22 frases, marcou 10 tomadas repetidas (X) e a tomada quebrada do orquestrador
(Q). Trecho: `{"frases": [1, 2, 3, 4, [9, 2], [10, 1]], "respiro": {"2": 0.9}}`. Entra em "Esse é mais um daqueles
vídeos…" (0,08 s); gancho de contradição até "todos iguais." (pousa 0,9 s); sai em "quem decide é você.". Ficaram fora o
orquestrador (o pensamento fecha sem ele), "Porque isso eu te entrego… 30 minutos" (venda, não resolve o gancho) e o
"Comente" (chamada vai no post). **33,0 s**: o pensamento desta gravação tem 31,4 s de fala, e o modelo não enche.

| hora | fala | tela |
|---|---|---|
| 0,05–4,29 | Esse é mais um daqueles vídeos que você vê por aí totalmente editados pelo Claude Code. | bloco de 4 degraus que se monta; *Claude Code.* em serifa branca |
| 4,29–8,19 | Mas talvez você esteja estranhando que ele não é exatamente como os outros, | legenda (2 páginas) |
| 8,19–9,88 | todos iguais. | "todos" + *iguais.* na COR (a crença que o gancho nega) |
| 9,93–13,85 | Isso porque eu criei um sistema de edição próprio que reúne vários modelos | *próprio* na COR (a resposta) |
| 13,85–18,04 | de edição que o Claude usa e foge do copia e cola que todos mostram. | legenda |
| 18,09–21,07 | Mas o melhor disso tudo é que todos eles são editáveis | *editáveis* na COR (último destaque) |
| 21,07–30,10 | e você também pode criar os seus próprios modelos. Você pode usar os modelos… os seus próprios vídeos. | só legenda, 4 páginas |
| 30,12–33,00 | quem decide é você. | legenda; escurece de 31,8 a 32,6 s, preto até 33,0 |

COR da vitrine: `#6D87C5` (`cor.py`: parede bege quase sem cor, camiseta preta atrás da legenda, contraste 4,6:1).

**Medidas da vitrine x referências:** duração 33,0 s (refs 49,5 e 70,0); entrada 0,08 s (refs 0,00); fala 3,3
palavras/s (refs 2,15–2,92: o Jessé fala mais rápido que pregador); destaques 3 no gancho (9 s) e 2 no corpo, depois
10 s só de legenda (ref1: 8 + 2; ref2: 5 blocos e 22 s sem); 0 cortes de edição além das 4 emendas das tomadas (refs: 0);
-14,0 LUFS; checador zerado (aviso: a mão passa sob o texto o tempo todo, seção 8).

**Pendências para a aprovação:**
- A referência própria definitiva: um corte de **gravação longa de verdade** (pregação, palestra ou aula de 20 min ou
  mais, de preferência de evento) com 45–75 s de pensamento, do dono ou de quem ele autorizar. Com ela aprovada:
  `exemplos/`, `tools/assinatura.py cortepalestra01`, `tools/referencia.py cortepalestra01`, sai o `--sem-adaptar` e o
  modelo entra na contagem do `LEIA.md`.
- O recorte 9:16 de gravação deitada (16:9) está no `recortar.py` mas não foi provado em gravação real deitada.


**Revisão de diretor (antes do dono), o que mudou:** a serifa de peso 500 sumia sobre a camiseta preta (passou a 700 e o
`cor.py` a exigir 4,5:1, de `#5070B9` para `#6D87C5`); a linha centrada fazia a 1ª palavra nascer fora do lugar (linhas
alinhadas à esquerda dentro da página centrada); um falso rosto num quadro (a mão, em 27,25 s) acusava texto sobre o
queixo (o checador ignora o quadro que foge da mediana); o pico passava 0,1 dB de -1 dBTP (alvo -1,5 no `mixar.sh`).

**Para o olho do dono (decisões de gosto):**
1. A legenda segura a página por 1,5 s e monta a linha palavra a palavra (G1), em vez de trocar a cada 1 ou 2 palavras
   como a ref1. Recomendação: manter (a regra da casa vence; o olho ainda vê 1 a 3 palavras novas por vez).
2. No bloco do gancho, a pergunta e a resposta podem ficar na mesma página (só através do "?"). Recomendação: manter;
   a vitrine não usou (o gancho dela é de contradição).
3. A mão de quem fala passa sob o texto quase o tempo todo na posição medida (67%). Recomendação: manter a posição
   (é a das duas referências) e cuidar só do contraste.
