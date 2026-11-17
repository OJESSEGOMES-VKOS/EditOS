# cena29: Product turntable (Produto girando)

- **Tipo:** 3D edição (feito no Remotion com perspectiva/CSS 3D ou three.js, sem Blender)
- **A cena que ele resolve:** apresentar um produto com suas especificações.
- **Quando a fala pede:** "esse é o", "tem X de bateria", lançamento.
- **Completa estes modelos:** anuncio-neon, anuncio-canvas.
- **Material e prova:** foto/modelo real do produto do dono; números como ditos.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

O plano de filme de lançamento: um produto fechado gira devagar num prato escuro de estúdio, e linhas finas saltam
para os números que importam. Um objeto, poucas especificações, o giro pousando no ângulo bonito.

- **Fundo:** um estúdio grafite. Quase preto `#090A0C` no alto, subindo para `#16181C` atrás do produto, com uma
  poça de luz grafite `#30343B` no chão sob o prato e grão fino. Nada de cor no fundo.
- **O objeto:** grafite fosco (`#353940`) com metal cinza-espacial (`#8A8F98`) nas pontas, escovado. O prato é um
  disco acetinado mais escuro. Uma luz de recorte nas duas bordas separa o produto escuro da sala escura, e um reflexo
  apagado no chão completa o estúdio.
- **Letras:** Manrope 600 para o nome (centrado no alto, ~98 px, apertado) e para os valores (~58 px). DM Mono 500 em
  caixa alta espaçada (~25 px) para a legendinha cinza `#8C939D` de cada valor. Texto branco suave `#F1F3F6`.
- **As chamadas:** um ponto branco na superfície, um fio fino reto para o lado e o valor com a legenda na ponta.
  Alternam esquerda e direita descendo pelo produto; as da esquerda alinhadas à direita, as da direita à esquerda,
  todas apontando para o objeto. A parte de baixo fica calma.

**Os movimentos (o vocabulário):**
- **Já girando:** no quadro 1 o produto já roda, visto de um 3/4 alto, com o nome no lugar.
- **A câmera desce:** desliza do alto para o ângulo herói e pousa macio, aproximando um pouco.
- **O giro freia:** o prato diminui até parar de vez pouco antes do fim, com a frente virada para a câmera.
- **A chamada salta:** o ponto estala na superfície, o fio dispara em poucos quadros, o valor sobe de uma máscara
  com um passo além e a legenda vem atrás. Uma por vez, com uns 10 quadros entre elas.
- **A pausa:** com tudo parado no ângulo herói, o último segundo é quieto.

## Como variar (o jeito, não a demo)

- **O objeto é o produto real.** O componente desenha um cilindro (a caixa de som da demo) como objeto de referência.
  Para outro produto, redesenhe só o `Produto` com a forma dele (frasco: cilindro com gargalo; caixa: quatro faces;
  celular: uma placa fina; tênis: perfil em camadas), sempre a partir da foto real, e mantenha o resto: a mesma
  conta de luz (`dif` + `borda` de recorte), o grafite e o metal, o prato, o reflexo e a câmera. A cor do corpo pode
  ser a real (`corCorpo`, `corMetal`), desde que fosca e escura o bastante para o estúdio.
- **As chamadas são os números ditos,** de 1 a 4, cada uma com um valor e duas ou três palavras. A primeira salta na
  palavra que diz o primeiro número (`inicios`), a próxima na seguinte. Fala com dois números tem duas chamadas.
- **A altura de cada chamada** (`y`) aponta para a parte do produto de que o número fala (bateria embaixo, tela em
  cima), não para a posição da demo.
- **Frase curta:** o giro, o nome e uma chamada, 2 a 3 s (`duracao` encurta tudo junto). **Fala longa:** mais
  chamadas, nunca giro mais rápido.
- **Formatos:** palco 4:5 escalado; em 9:16 sobra estúdio em cima e embaixo (legenda da casa embaixo); em 16:9 as
  chamadas podem abrir mais para os lados.

## Nunca

- Desmontar, abrir ou girar rápido: é um objeto fechado girando devagar (o que tem dentro é a cena12).
- Linha grossa, seta, caixa ou ícone em volta das chamadas: só fio e letra.
- Mais de quatro chamadas, ou frase dentro delas; especificação que o dono não disse.
- Brilho, reflexo de lente, partícula ou fundo colorido.
- Reaproveitar o "Eco Um", a caixa de som ou os quatro números da demo (`componente/textos-demo.json`), ou repetir as
  quatro chamadas no mesmo lugar e ordem para outro produto.
