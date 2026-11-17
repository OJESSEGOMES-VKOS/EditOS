# cena15: Headline Highlight (Manchete grifada)

- **Tipo:** 2D
- **A cena que ele resolve:** afirmação que tem fonte: a notícia entra e a linha é grifada.
- **Quando a fala pede:** "saiu no X", "a notícia", "segundo o jornal".
- **Completa estes modelos:** documental-dados, youtube-didatico, prova-print, minidocumentario.
- **Material e prova:** PROVA: print real da matéria com link no ORIGEM.md; nunca jornal inventado.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

O corte para a matéria que todo canal de comentário usa: a notícia voa para a tela inclinada em 3D sobre uma parede de
artigos desfocados, a câmera chega no parágrafo, um marca-texto verde-limão passa na linha que importa e um post entra
como recibo. É "não sou eu que estou dizendo".

- **Paleta:** fundo quase preto `#15181C` com cartões de artigo desfocados em cinza claro `#E9EAEC`; papel do artigo
  `#FCFCFA`, manchete `#16181B`, corpo `#26292D`, cinza pequeno `#6A6F76`, filetes `#D9DBDE`; um vermelho de jornal
  `#C1272D` só na seção; marca-texto limão `#C9F52A` com um mais fundo `#B8E81A` onde a tinta acumulou; post branco
  com um selo azul `#2F7BF5`.
- **Letra:** nome do jornal em Newsreader 800 apertado; manchete em Newsreader 700, frase comum, linhas curtas; corpo em
  Newsreader 400 com capitular grande. Tudo que é interface (data, menu, autor, post) em Inter.
- **Layout:** um artigo enche o meio, deitado para trás e um pouco virado, como página erguida para a câmera; atrás, a
  grade de outros artigos muito desfocada e girada. O post sobrepõe o canto de baixo à direita, inclinado para o outro
  lado. Texto no meio; o quinto de baixo é só fundo desfocado.
- **Textura:** o marca-texto parece tinta: borda áspera, riscos ao longo, ponta chanfrada, mancha mais escura onde a
  caneta encostou, multiplicado sobre a letra (a letra continua preta). Sombras fundas e macias, vinheta escura.
- **Os movimentos (o vocabulário):**
  - **o fundo que nunca para:** os cartões desfocados derivam desde o quadro 1 e se mexem menos que o artigo (profundidade).
  - **o voo com peso:** o artigo sobe do canto de baixo, bem deitado, com borrão de quem passou perto da lente; chega
    numa mola pesada e a inclinação passa uns graus e volta em ~1 s.
  - **o travelling até o parágrafo:** a câmera anda (não é zoom) do artigo inteiro até o trecho: começo lento, deslize
    longo, pouso suave.
  - **o grifo linha a linha:** da esquerda para a direita, rápido no começo e soltando no fim de cada linha, com uma
    pausa curta na troca de linha. O que já foi grifado não se mexe.
  - **o recibo que salta:** o post salta com passada ~0,4 s depois do último grifo; a inclinação pousa um tempo depois
    do tamanho. Tudo segura mais de 1 s.

## Como variar (o jeito, não a demo)

- **O artigo é o print real com origem** (G25, G7): manchete, veículo, data e parágrafo copiados dele. Sem a matéria
  real na mão, o estilo não entra (volta como pergunta). Os nomes da demo são inventados e nunca vão para um vídeo.
- **O grifo é o trecho que a fala lê ou parafraseia**, e só ele (1 a 3 linhas). Fala curta: uma linha grifada e sem
  post. Fala longa: duas ou três linhas e o post, se existir um post real que a fala cita.
- **Que movimento cai em que palavra:** o voo cai na fonte dita ("saiu no jornal", "a matéria diz"); o travelling
  acompanha o "e olha o que está escrito"; cada linha do grifo começa na palavra dita que abre aquela linha
  (`inicioGrifo` no quadro dela); o post entra quando a fala cita a reação.
- **Partes opcionais:** menu, autor, data e post só entram se estão no print real; vazios, somem.
- **Formatos:** em 9:16 o artigo fica mais estreito e alto, o post desce para baixo dele, acima da legenda da casa;
  em 16:9 o artigo à esquerda e o post à direita.

## Nunca

- Print chapado de frente com um retângulo amarelo por cima; grifo retangular perfeito sem mistura.
- Fade no artigo ou no post; zoom linear.
- Veículo, pessoa ou logo real recriados sem o print de origem; manchete ou número inventados.
- Reusar os textos da demo ("O Mensageiro Austral", "Casa Ventura", "Clara Moura", a manchete da margem) em qualquer
  vídeo.
