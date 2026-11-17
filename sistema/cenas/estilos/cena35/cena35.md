# cena35: Scale lineup (Escala lado a lado)

- **Tipo:** 3D edição (feito no Remotion com perspectiva/CSS 3D ou three.js, sem Blender)
- **A cena que ele resolve:** comparação de tamanho com coisas conhecidas.
- **Quando a fala pede:** "do tamanho de", "X vezes maior", "comparando".
- **Completa estes modelos:** personagem, documental-dados, motion-ouro, 3d-como-funciona (como ponte).
- **Material e prova:** medidas reais com fonte.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Coisas que todo mundo conhece sobem do chão uma a uma numa maquete de argila branca, da menor à maior, enquanto a câmera
recua num movimento só. É a comparação de tamanho dos grandes canais de visualização, só com os objetos e os números.

- **Estúdio:** cinza frio quase chapado, `#D2D7DD` em cima a `#E4E7EB` no horizonte, um pouco mais claro atrás da fila;
  chão claro `#CFD4DA` que se funde na parede, sem horizonte duro. Tudo calmo para o olho só medir.
- **Os objetos:** argila branca fosca `#F1F2F4`, com faixas de janela e aletas uns tons mais cinza (`#D6DBE1`,
  `#C9CFD7`). A pessoa é uma figura grafite `#6A717B`, como a de maquete de arquiteto, para continuar visível quando
  fica minúscula. Nenhuma outra cor.
- **Luz:** vista de lado por lente longa (nada distorce), luz macia de cima à esquerda, frente clara, lado cinza e uma
  sombra de contato no pé. Sem contorno, sem textura: janela é degrau na argila.
- **Letras:** Instrument Sans. O nome em 600 (42 px) quase preto `#111316`; a medida embaixo em 500 (30 px) cinza
  `#5B626B`. Todos os rótulos no mesmo tamanho, na mesma linha de base, logo abaixo do chão.
- **A fila:** uma linha só, da esquerda para a direita, do menor ao maior, todos no mesmo chão no terço de baixo, com o
  mesmo vão entre cada par. No fim o maior ocupa a direita e quase a altura toda.

**Os movimentos (o vocabulário):**
- **Começa no menor:** o primeiro quadro é o menor objeto, grande, sozinho no estúdio, com o rótulo dele, e a câmera já
  recuando.
- **Um recuo só:** a câmera se afasta reto, ganha velocidade no primeiro terço de segundo e depois vai assentando. Nunca
  vira, nunca reenquadra, e a linha do chão nunca se mexe. É o que dá a sensação de escala honesta.
- **O objeto sobe:** quando a vista chega no lugar dele, cada objeto sobe do chão, dá um pulinho e assenta.
- **O rótulo entra:** o nome sobe de uma máscara, a medida um instante depois.
- **O maior dispara:** o último sobe quase até o topo do quadro. É o "olha o tamanho disso".
- **A pausa:** a câmera para por volta de 3,4 s e o resto fica parado.

## Como variar (o jeito, não a demo)

- **Os objetos são os que a fala compara,** com as medidas como foram ditas (G10), de dois a cinco (`objetos`). A
  escala se ajusta sozinha pela maior altura: dá para comparar uma formiga e uma moeda ou um prédio e uma montanha.
- **Formas novas:** os tipos prontos (`pessoa`, `onibus`, `casa`, `predio`, `torre`, `bloco`) são as formas de argila.
  Objeto que não existe (um celular, uma pilha de papel, uma árvore) nasce no `Desenho` como caixas de frente clara e
  lado sombreado, com degraus de janela ou faixa onde fizer sentido; mesma argila, mesma luz. `largura` em metros troca
  a do tipo.
- **A referência conhecida vem primeiro:** quase sempre a pessoa (ou a mão, a moeda) à esquerda, para o olho ter régua.
- **Cada objeto entra quando a fala diz o nome dele;** se a fala for mais lenta que o recuo, estique `duracao`. O
  maior entra na palavra que pesa.
- **Frase curta** ("é do tamanho de três ônibus"): dois objetos, recuo curto. **Frase longa:** no máximo cinco; o
  resto fica na fala.
- **Formatos:** palco 4:5; em 9:16 sobra parede em cima (o maior pode crescer) e chão embaixo (a legenda da casa mora
  ali, em tinta escura); em 16:9 a fila ganha mais vão e o maior continua à direita.

## Nunca

- Régua, seta, colchete ou linha de medida: o rótulo carrega a altura.
- Câmera que vira ou reenquadra para correr atrás de cada objeto.
- Rótulos em alturas ou tamanhos diferentes, ou encavalados.
- Monumento real, torre famosa, ônibus com marca, ou qualquer cor de destaque.
- Medida que a pessoa não disse.
- Reaproveitar a pessoa-ônibus-casa-prédio-torre da demo com os mesmos números (`componente/textos-demo.json`).
- Refazer a coreografia da demo batida a batida (sempre cinco, sempre a torre) quando a fala compara outra coisa.
