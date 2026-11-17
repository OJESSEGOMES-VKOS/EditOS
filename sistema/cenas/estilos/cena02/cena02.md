# cena02: Frosted Glass UI (Vidro fosco)

- **Tipo:** 2D
- **A cena que ele resolve:** ideia apresentada como uma busca ou um passo num app.
- **Quando a fala pede:** "pesquisei", "eu perguntei pra IA", "como eu faria X".
- **Completa estes modelos:** prova-print, youtube-didatico, rosto-telas, anuncio-neon.
- **Material e prova:** o fundo desfocado vem de foto/gravação do dono; a interface é ilustração assumida (G34 se imitar app real).
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Uma ideia contada como se alguém digitasse numa busca e escolhesse um resultado. Vidro fosco flutuando sobre uma foto
de fim de tarde fora de foco: calmo, caro, de app bem feito.

- **Paleta:** céu azul-petróleo `#1F5A6E` a azul-noite `#0E2A3D`, brilho coral `#FF8A5C` e rosa `#E3558A` no
  horizonte, texto quase branco `#F8F9FB`. Uma cor fria só no cursor, `#9FD8FF`. O vidro é a mesma foto, muito mais
  borrada, um pouco escura e sem saturação.
- **Letra:** Plus Jakarta Sans, frase comum (sem caixa alta). Busca em 500, título da linha em 600 com espaçamento um
  pouco fechado, rótulo pequeno a ~65% de opacidade. Sombra leve embaixo do texto para ler sobre o vidro.
- **Layout:** uma barra larga (~85% da largura, cantos bem redondos) e, embaixo, o painel de resultados da mesma
  largura. Toda linha na mesma margem esquerda: ladrilho de vidro com ícone, título sobre rótulo. O conjunto no meio;
  o quinto de baixo é só fundo escuro desfocado.
- **Textura:** fundo pintado como foto desfocada (campos de cor, luzes de cidade borradas no horizonte, cantos mais
  escuros como lente) com grão fino por cima. O fundo só deriva alguns pixels por segundo.
- **Os movimentos (o vocabulário):**
  - **a barra que pousa:** no quadro 1 a barra já está lá, assentando de ~90% com passada leve. Nunca tela vazia.
  - **a digitação de gente:** ~1,3 quadro por letra com pequena variação e um respiro entre palavras; cursor aceso
    digitando e piscando parado. É o que faz parecer uma pessoa pensando.
  - **o painel que desdobra:** a barra sobe e o painel sai de trás dela, passando ~9%. Não aparece: desdobra.
  - **as linhas que caem:** cada resultado cai de cima, 3 quadros depois do anterior, passando ~10%.
  - **o destaque que estica:** a faixa clara vai de uma linha a outra com a borda da frente rígida e a de trás macia,
    como elástico. É a escolha.
  - **o aperto e a tecla:** a linha escolhida afunda um tico e a tecla ↵ salta. Fecha a cena.
- **Ritmo:** digita (1 a 2 s), desdobra, escolhe, segura o último segundo parado.

## Como variar (o jeito, não a demo)

- **A busca é o que a fala pergunta ou quer.** "Como faço pra cobrar mais caro?" vira a busca `cobrar mais caro`. Os
  resultados são as opções que a fala cita (uma, duas, três, quatro: a conta vem da fala, não da demo) e a linha
  escolhida é a que a pessoa diz que escolheu ou recomenda.
- **Fala curta (2 a 3 s):** só a barra e a digitação, com um resultado ou nenhum painel. **Fala longa:** a busca, a
  lista e o destaque passeando por mais de uma linha antes de parar.
- **Que movimento cai em que palavra:** a digitação acompanha a frase dita da pergunta; cada linha cai quando o item
  é dito; o destaque estica no "mas o melhor é..." (a virada); o aperto cai no verbo de decisão (escolhe, clica,
  usa). Rótulo pequeno é categoria ou dado curto dito (um preço, um tempo), nunca enfeite.
- **Formatos:** em 9:16 o conjunto sobe para o terço do meio e a legenda da casa fica embaixo do painel; em 16:9 a
  barra ocupa ~60% da largura (o componente escala o miolo 4:5; recomponha a largura se precisar).

## Nunca

- Desfoque ao vivo sobre degradê (faz faixas), bokeh de bolinhas iguais, neon, papel de parede roxo.
- Vidro leitoso com texto branco que não lê.
- Painel ou linha que esmaece: eles desdobram e caem.
- Interface que imita um app real com marca (G25): o vidro é genérico, a marca nunca aparece.
- Reusar a busca e as linhas da demo ("meus vídeos com cara premium", "Cor de cinema"...) nem os 3 resultados por
  hábito.
