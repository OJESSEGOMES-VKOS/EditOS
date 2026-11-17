# cena41: Red Relief (Mapa em relevo vermelho)

- **Tipo:** 3D edição (feito no Remotion com perspectiva/CSS 3D ou three.js, sem Blender)
- **A cena que ele resolve:** onde a história aconteceu, mapa histórico.
- **Quando a fala pede:** nome de país/região, "na época", guerra, história.
- **Completa estes modelos:** documental-dados, personagem, especialista.
- **Material e prova:** lugares e fatos reais com fonte.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Um mapa em relevo preto visto de lado, baixo, como nos canais de história. A terra é escura e em alto-relevo, o mar é
preto com grade branca fina, e só uma região acende em vermelho. É sério, antigo e dramático.

- **Paleta:** mar preto puro `#030303` com grade branca fina. Terra em relevo carvão, quase preta nos vales `#0A0A0A`
  até cinza claro nas encostas iluminadas `#A8A8A8`, com grão amassado. A região da história em vermelho que brilha,
  escuro nos vales `#9A0A14` até vivo nas encostas `#FF5A50`, com borda acesa `#FF4D47` e uma névoa vermelha
  vazando sobre o mar. Rota neon `#FF2933` com miolo rosa claro. Fronteiras em tracejado branco. Só o vermelho e o
  branco têm cor.
- **Letras:** nomes de lugar em letra de marcador branca, gasta como giz e com brilho leve (Permanent Marker), deitada
  no mapa em perspectiva. Legendas do cartão em serifa de livro gravado (IM Fell English SC).
- **O cartão:** papel marfim `#EDEAE3` com moldura dupla fina em tinta escura `#24221F`, um selo gravado redondo
  (anel de contas, louros, um emblema hachurado), uma linha curta em cima, uma data embaixo e uma etiqueta vermelha
  `#C2232E` presa no canto. Nunca rosto.
- **Layout:** câmera olhando o mapa uns 50 graus inclinada. A região ocupa a metade de baixo, o destino o terço de
  cima, o quinto inferior é só mar e grade.
- **Textura:** relevo exagerado com luz baixa vindo do oeste, fundo distante desfocado, cantos escuros, grão parado.

**Os movimentos (o vocabulário):**
- **Já no mapa:** o primeiro quadro tem o relevo em aproximação lenta com um giro leve, com o contorno vermelho e a
  fronteira já acesos.
- **O nome em giz:** o lugar se escreve da esquerda para a direita, letra a letra.
- **A inundação:** o vermelho toma a região partindo da capital em meio segundo, com uma borda quente na frente; a
  névoa acende cada costa quando chega nela.
- **O cartão cai:** desce, bate e a inclinação assenta com mola, com sombra macia embaixo. Dá o "quem" e o "quando".
- **A rota:** sai da capital, cruza a fronteira, vira tracejado brilhante sobre a água e pousa no destino: um ponto
  salta, um anel se espalha, o segundo nome se escreve.
- **Parada:** a câmera assenta e o último segundo fica imóvel.

## Como variar (o jeito, não a demo)

- **O mapa é o lugar da fala.** O padrão é uma terra fictícia (`MAPA_FICTICIO`); para um lugar real, passe `mapa` com
  o contorno traçado de um mapa de verdade (num plano 1600x1600): `terra`, `regiao`, `mascaraRegiao`, `fronteira`,
  `capital`, `destino`, `rotaTerra`, `rotaMar`. O relevo, a luz, a grade, o vermelho e a câmera vêm de graça.
- **Batidas pela frase:** "foi aqui que tudo começou" é só o nome e a inundação, sem rota e sem cartão. "Saíram de
  Lisboa e chegaram à Bahia" é nome, inundação, rota e o segundo nome. "Em 1500, Portugal..." pede o cartão com a data
  dita. Use só as batidas que a frase tem; sem `destino`, sem rota; sem `cartaoTitulo` e `cartaoData`, sem cartão.
- **Rota em terra ou no mar:** trecho em terra é linha cheia (`rotaTerra`), trecho sobre a água é tracejado
  (`rotaMar`). Uma viagem só por terra não tem tracejado.
- **O selo do cartão** é o emblema do assunto (torre, navio, coroa, ferramenta), redesenhado em traço gravado e
  hachura; nunca retrato.
- **Nomes e datas como foram ditos** (G10), no máximo três ou quatro rótulos na tela.
- **Formatos:** o palco 4:5 cobre a tela; em 9:16 corta as laterais (capital e destino perto do meio), em 16:9 corta
  em cima e embaixo (a rota pode correr na horizontal; o cartão é fixo na tela em `left 470, top 800` do palco, mova
  na cópia se ele cobrir o lugar).

## Nunca

- Globo, foto de satélite ou mapa vetorial chapado. A terra é relevo em preto e cinza.
- Retrato ou rosto no cartão.
- Segunda cor de destaque, degradê ou textura no mar.
- Explosão de partícula, flare, dissolver. A inundação e a rota se desenham; nada aparece esmaecendo.
- Mais de três ou quatro rótulos na tela.
- Reaproveitar o "vale", o "porto", a "terra do sul", a torre do selo ou qualquer texto da demo
  (`componente/textos-demo.json`) quando a história é outra.
- Refazer a coreografia da demo batida a batida (nome, inundação, cartão, rota, destino) se a fala pede menos.
