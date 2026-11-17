# cena07: Blue Editorial (Editorial azul)

- **Tipo:** 2D
- **A cena que ele resolve:** frase-manifesto curta e forte, título, virada de capítulo.
- **Quando a fala pede:** frase de efeito, "a verdade é", título do capítulo.
- **Completa estes modelos:** texto-e-objeto, fala-escrita, ojg, imagem-por-palavra.
- **Material e prova:** o sistema faz tudo; só texto dito.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Uma capa de revista em movimento: um campo azul elétrico e letra branca que é cortada, fatiada e rearrumada. A força
está no contraste entre o itálico gigante e a palavra pequena e pesada. É frase-manifesto, título, virada de capítulo.

- **Paleta:** azul ultramar elétrico `#2433F0` (azul, nunca roxo nem marinho), branco `#F4F5FA`, réguas no mesmo
  branco a ~55%. Nada mais.
- **Letra:** duas famílias, tudo em minúsculas. As enormes em serifa itálica de vitrine (Instrument Serif itálico),
  do tamanho que a largura deixar, espaçamento -0.03em. As pequenas em grotesca preta (Schibsted Grotesk 900), ~6% da
  altura, espaçamento bem fechado. Esse contraste é o estilo inteiro.
- **Layout:** uma pilha de capa, não uma grade: chapéu pequeno em cima sobre uma régua de largura toda; a enorme cujo
  topo fura a régua; uma pequena alinhada à direita numa régua curta; uma pequena sentada na linha de base da enorme
  final; régua de fecho. Tudo dentro dos 900 px do meio; quinto de baixo vazio.
- **Textura:** nenhuma. Cor chapada, borda nítida.
- **Os movimentos (o vocabulário):**
  - **a letra que sobe da base:** letras enormes sobem por uma máscara na linha de base, 2–3 quadros entre elas, com
    ~10% de passada. O quadro 1 já tem letra.
  - **o salto de escala:** a primeira palavra fica enorme ~0,7 s e encolhe para chapéu em ~8 quadros, com borrão de
    movimento na viagem. Dá a hierarquia na cara de quem vê.
  - **a cortina inclinada:** um corte no ângulo do itálico atravessa a palavra da esquerda para a direita, com um fio
    branco na borda que encolhe ao sair.
  - **a que sai de baixo:** uma palavra pequena escorrega de baixo de outra (ou da régua), como se estivesse guardada
    atrás dela.
  - **as quatro fatias:** a última palavra chega em quatro faixas horizontais de lados alternados, fica uma batida
    fora de registro (o corte aparece) e trava numa palavra só.
  - **a régua que corre:** as réguas se desenham num ease rápido. Cada batida segura 8–15 quadros; a capa pronta
    segura ~1,5 s.

## Como variar (o jeito, não a demo)

- **A frase dita vira partes** (2 a 6), cortadas onde a fala respira, em minúsculas, palavra por palavra como foi
  dito: "o cliente / compra / confiança." são 3 partes; "não é sorte, / é / método." também; "você / não precisa /
  de mais / um curso" são 4. A demo tem 5 partes por acaso, não por regra.
- **Qual parte é enorme:** a palavra de peso (o substantivo da tese, o verbo da virada, o número); as de ligação
  ("o", "de", "é", "mais") são pequenas. Sem dizer, o componente alterna começando pela pequena e faz a última
  enorme.
- **O movimento vem do lugar, não da demo:** a primeira pequena faz o salto de escala; a primeira enorme sobe da base;
  a enorme do meio é a cortina; a pequena do meio sai de baixo da régua (alternando direita e esquerda); a pequena
  logo antes da última enorme senta na base dela; a última enorme chega em fatias. `tempos` põe cada parte na palavra
  dita (o componente só espera o chapéu terminar de subir).
- **Curta (2 partes):** chapéu e uma enorme em fatias. **Longa (6 partes):** as enormes encolhem para a pilha caber;
  mais que 6 é frase para dividir em duas cenas, ou para a legenda.
- **Formatos:** o miolo é 4:5; em 9:16 a capa fica no terço de cima e do meio e a legenda da casa mora embaixo (ou
  some, porque a capa já é a fala: METODO §6); em 16:9 dá para pôr a pilha à esquerda e deixar ar à direita.

## Nunca

- Roxo, marinho, degradê, brilho; terceira família de letra; maiúsculas.
- Grade modular, rótulo numerado, simetria centrada (isso é a cena09, não esta).
- Fade ou dissolve: palavra sobe, corta, fatia ou escorrega.
- Reusar "cada quadro conta uma ideia" ou as 5 partes por hábito, ou o tempo da demo (a demo é
  `componente/demo-coreografia.tsx`, só para a demo).
