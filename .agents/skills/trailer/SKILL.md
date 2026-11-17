---
name: trailer
description: >
  Modelo de edição trailer do EditOS: a pessoa falando e tipografia de trailer de filme por cima só nos pontos fortes.
  Use quando pedirem "edita no trailer", "edita minha gravação no trailer", "corte de podcast cinematográfico" ou um
  vídeo falado com letra de cinema, Anton vermelha e legenda serifada.
---

# trailer: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de editar no trailer, para qualquer fala. O arquivo detalhado
(números, tamanhos, opções, comandos) é `sistema/modelos/trailer/trailer.md`; o método comum de todas as skills é
`sistema/JEITO.md`; as regras do dono (`REGRAS.md` §0, G1 a G35) mandam acima das duas.

O vídeo aprovado (`sistema/modelos/trailer/referencia/`) é **um exemplo** desse jeito aplicado a uma fala: a do "100%
editado pelo Claude". Ele nunca é o roteiro, a sequência nem a lista de destaques do vídeo novo. Quem grava sobre a
padaria dele recebe um trailer sobre a padaria: os destaques são as palavras fortes da fala dele, não "MODELOS",
"VÍDEO" e "EDIÇÃO".

## Quando usar

- **Sim:** uma pessoa falando para a câmera (9:16), 15 s a 60 s, fala com peso (opinião, anúncio, virada, convite), em
  que 2 ou 3 frases têm um termo que merece virar letra de cinema.
- **Não:** fala que precisa mostrar coisas (um número em gráfico, uma lista, um antes e depois: vai para o
  `rosto-telas`); fala calma de reflexão (o `pagina-de-livro`); pregação ou fala emocional longa (o `pregacao`).

## A personalidade (vale para qualquer fala)

Cada regra: o que é, o porquê, quando sim, quando não.

1. **A pessoa no vídeo normal é a base.** Gravação crua, cor e fundo reais (G6), um plano (1,0), cabeça no terço de
   cima. *Por quê:* o trailer é o rosto com letra de cinema, não um filme de efeitos. *Sim:* a maior parte do vídeo,
   sempre com a legenda. *Não:* âmbar, vinheta, grão, VHS ou tela de respiro sem ordem do dono (são opções).
2. **A legenda é serifada e calma, no peito.** Playfair fina branca, páginas de até 2 linhas, topo em y 1220, as
   palavras nascendo com a voz. *Por quê:* contraste com o destaque: a legenda sussurra, o destaque grita. Só 2 posições
   no vídeo todo (a 2ª, y 1363, só no fecho e nas prévias).
3. **O destaque de 3 vozes é a assinatura.** Um bloco de 2 a 3 linhas bem coladas: Inter Tight 800 apertada nas
   palavras comuns, Playfair itálica fina na palavra de emoção, Anton enorme em caixa alta na palavra-chave, vermelha
   `#E01E1E` só nela. Cada palavra nasce de um desfoque forte e sobe para o lugar junto com a voz. *Por quê:* é a
   tipografia de cartaz de filme; o vermelho aponta o assunto. *Sim:* o trecho tem um termo protagonista do tema (G17),
   um substantivo ou nome. *Não:* advérbio, verbo solto, palavra de ligação, frase coadjuvante: ficam na legenda. Na
   dúvida, legenda.
4. **Um bloco por vez.** O destaque toma a tela e a legenda some enquanto ele está lá; a página seguinte entra quando
   ele sai. Nunca legenda e destaque empilhados, nunca texto no rosto (o molde sobe a câmera para o bloco caber entre o
   queixo e a legenda).
5. **Todos os destaques do mesmo tamanho**, o da palavra-chave de uma linha (Anton 250 a 260); encolhe no máximo a 85%
   para caber. Número dito vira contador (0 até o número, na Anton vermelha). Frase que nega algo pode ganhar o risco
   vermelho de caneta na linha negada.
6. **Transições de textura, só com motivo.** Desfoque, flash branco e chicote, nunca deslize. *Sim:* onde a fala muda
   de cena (uma virada, um assunto novo). *Não:* em todo corte; sem motivo, corte seco.
7. **Câmera parada.** 1,0 por padrão; o plano fechado (1,3, corte seco) só numa frase de peso ou numa virada, nunca
   alternando por tempo (G6).
8. **O fecho é o comando, se a fala tiver comando.** O comando dito e a palavra a comentar entre aspas na Anton
   vermelha, fixos até o fim; o resto da fala corre na legenda da 2ª posição. Sem comando, termina na legenda.
9. **O ritmo:** a maior parte é rosto com legenda; 2 a 4 destaques num vídeo de 30 s, cada um no seu ponto forte. O
   aprovado tinha mais (feito antes das regras de 2026-11-05); hoje vale a G17.

## As peças (o que já existe em código)

Do molde `sistema/moldes/trailer/` (`src/Reel.tsx`, bloco O PLANO):
- `PEDACOS` (a legenda), `BLOCOS` (o destaque de 3 vozes, com `risca` e `carimbo` opcionais), `ABERTURA` (o gancho em
  bloco, com contador se há número dito), `FECHO_DEF` (o comando), `T`/`CAM` (cortes e câmera), `DESFOQUES`,
  `FLASHES`, `CHICOTES`; opções `PREVIAS`, `RESPIROS`, `VHS`.
- As vozes do bloco têm o nome da letra: `inter`, `playfair`, `anton`, `antonVermelha`.

**Não há tela livre neste modelo, de propósito.** Tudo o que o trailer põe na tela é a própria fala em tipografia: o
aprovado não tem nenhuma tela de conteúdo (objeto, gráfico, interface). Desenhar uma ilustração para a fala nova seria
outro modelo. A invenção aqui é tipográfica: escolher, na fala nova, os trechos, as palavras e a voz de cada uma.

## A invenção (o destaque que a fala nova pede)

Para cada frase com força para o tema (G28):
1. **Ache o termo protagonista** (o assunto, um substantivo ou nome). Ele é a Anton; vermelha se é a palavra-chave.
2. **Ache a palavra de emoção** do mesmo trecho (o adjetivo, o "qualquer", o "nunca"). Ela é a Playfair itálica.
3. **O resto do trecho** vai na Inter Tight, na ordem da fala, em 2 a 3 linhas. Bloco que não cabe vira legenda.
4. **Escolha o enfeite só com motivo:** número dito = contador; negação = `risca`; virada = a transição no corte.
5. **Escreva no plano:** `{de, ate, camera: [corte, corte], primeira, linhas: [[[inter, 80, 'palavras ditas']], [[antonVermelha, 250, 'palavra']]]}`.

**Exemplo 1 (fala que o aprovado não tem):** *"Na minha padaria o pão sai às seis. Quem chega às sete já não pega
quente."* Gancho na legenda (G29). Em "não pega quente", destaque com risca: "já não pega" (Inter) / "QUENTE"
(Anton vermelha), a 1ª linha riscada. Por quê: "não" (a frase nega) e "quente" (o assunto). Nada de "MODELOS".

**Exemplo 2:** *"Em 2024 a gente atendeu 3 mil clientes."* Abertura em bloco com contador: "Em 2024 a gente atendeu"
(Inter) / contador 0 a 3 mil (Anton vermelha) / "clientes" (Playfair). Por quê: "3 mil" (o número é o fato
principal do gancho).


## O teste do clone (antes do render)

1. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) tem de sair `SEM CLONE`.
2. **Todo destaque tem dono:** no `plano.md`, a linha da cena diz o nome da peça como está no plano (`BLOCOS`,
   `ABERTURA`, `FECHO_DEF`...) e a palavra dita entre aspas que pediu ela, com o porquê.
3. **Folha lado a lado** com `sistema/modelos/trailer/referencia/folha.jpg`: *mesmo modelo?* (legenda serifada, 3
   vozes, Anton vermelha, câmera parada) **sim**; *mesmo vídeo?* (mesmas palavras em destaque, mesma ordem) **não**.

## O caminho (os comandos estão no `trailer.md` §9)

1. Ler esta skill e o `trailer.md`. 2. `tools/novo-video.py trailer <gravação> <AAAA-MM-DD-tema>`: o plano nasce vazio
(a gravação, um plano, sem destaque). 3. Ler a fala (`src/palavras.json`) antes de olhar o exemplo. 4. `plano.md`
com o plano de cenas (`cenas.json` → `tools/decupar.py --plano`). 5. Montar o bloco O PLANO: legenda primeiro, depois
os destaques. 6. `node scripts/cobertura.mjs` até `APROVADO`. 7. `tools/clone.py` até `SEM CLONE`. 8. Quadros e folha
lado a lado. 9. Render, mixagem (só a voz), entrega.

## Nunca

- Começar do plano do aprovado ou copiar o bloco O PLANO de outro vídeo.
- Pôr "MODELOS", "VÍDEO", "EDIÇÃO" ou o contador porque "o modelo tem": só o que a fala nova diz, com o porquê.
- Destaque em advérbio, verbo solto ou ligação; legenda e destaque juntos; texto no rosto.
- Âmbar, grão, vinheta, VHS, tela de respiro, efeito sonoro ou música sem ordem (G6).
- Escrever o que não foi dito (G19), o nome do modelo (G33), contorno, brilho ou sombra colada (G16).
