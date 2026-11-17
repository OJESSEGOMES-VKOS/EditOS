# cena10: Pencil to Blueprint (Lápis à planta técnica)

- **Tipo:** 2D
- **A cena que ele resolve:** da ideia ao produto, processo, projeto, engenharia.
- **Quando a fala pede:** "comecei rabiscando", "o projeto", "como foi construído".
- **Completa estes modelos:** motion-ouro, documental-dados, prova-print, 3d-como-funciona (como ponte 2D).
- **Material e prova:** o sistema faz tudo; o objeto é desenho, não prova.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Um rabisco a lápis no papel quadriculado que a tinta azul transforma em planta técnica, sem corte: o mesmo desenho,
promovido. É "da ideia ao produto" em uma imagem.

- **Paleta:** papel `#ECECE6`, grade fraca `#7FA3C4`, grafite `#25262B`; azul planta `#1C4C8F`, linha de maré
  `#143C76`, tinta branca `#EEF4FB`. Dois mundos: cinza de lápis antes, azul e branco depois.
- **Letra:** Barlow Semi Condensed. Rótulo em caixa alta 600, ~84 px, espaçamento aberto (+0.07em), alinhado à
  esquerda em cima de uma régua fina. Medidas em 500, ~44 px, números de largura fixa.
- **Layout:** um objeto simples de perfil, grande no meio, em pé sobre uma linha de chão. Rótulo no alto à esquerda,
  alinhado com a borda do desenho. Duas ou três cotas à direita e embaixo, longe do quinto de baixo.
- **Textura:** grade de engenharia fraca; grafite com dente de papel, traço dobrado e levemente arqueado, pontas que
  passam do ponto; grão fino por cima; uma mancha leve no azul.
- **Os movimentos (o vocabulário):**
  - **o rabisco em ordem de mão:** chão e eixos de construção primeiro, depois contornos firmes, juntas como círculos
    que passam do ponto, hachura rápida por último. Cada traço acelera e freia como mão. O lápis já risca no quadro 1.
  - **o respiro do rascunho:** o desenho pronto segura ~1/3 de segundo. Dá tempo de ver que era um rabisco.
  - **a inundação:** o azul vaza de dentro do desenho com borda molhada irregular e maré mais escura logo atrás;
    rápido no começo, depois devagar.
  - **o traço que endireita:** onde a borda passa, grafite vira tinta branca e a linha salta reta (mola). Construção
    vira linha de centro traço-ponto; o círculo guia vira o arco do ângulo.
  - **o sistema que pousa:** marcas de centro estalam, linhas de extensão crescem, cotas se desenham do meio para fora,
    setas estalam e os números contam até o valor. A régua do rótulo se desenha e o rótulo sobe sobre ela.
- **Ritmo:** rabisco ~1,7 s, inundação ~0,7 s, cotas ~1 s, segura 1,5 s.

## Como variar (o jeito, não a demo)

- **O objeto é o que a fala diz.** "Eu desenhei a casa no guardanapo" → a casa de perfil; "o app começou num caderno"
  → a tela do app em linhas simples. Monte o objeto com `linha()` e `elipse()` (prop `tracos`) em 15 a 30 traços, na
  ordem de mão. A luminária da demo é só exemplo.
- **Cotas só com número dito** (0 a 3). Sem número na fala: sem cotas, e a cena fecha no rótulo. Número dito: ele é
  a cota (G10), com a unidade como foi dita.
- **O rótulo são palavras ditas** (3 a 5), em 1 ou 2 linhas: o "antes → depois" da fala ("DA IDEIA / À LOJA").
- **Que movimento cai em que palavra:** o rabisco acompanha o "eu tinha só uma ideia"; a inundação cai na virada
  ("até que", "virou", "hoje"); as cotas no número; o rótulo no fecho. Fala curta (2–3 s): rabisco mais curto (menos
  traços), inundação logo. Fala longa: o rascunho pode ter mais traços, nunca mais de 3 cotas.
- **Formatos:** em 9:16 o objeto cresce na vertical e o rótulo fica no alto; em 16:9 objeto à esquerda do centro,
  cotas à direita, rótulo em cima à esquerda.

## Nunca

- Corte ou fade do rascunho para a planta: é um desenho só, promovido.
- Brilho nas linhas brancas, degradê no azul, mais de três cotas, objeto trocado no meio.
- Letra cursiva no rótulo, lápis ou mão desenhados na tela, medida inventada.
- Reusar a luminária, o rótulo ("DO RABISCO / AO SISTEMA") ou os números da demo.
