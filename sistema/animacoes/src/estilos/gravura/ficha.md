# Gravura

**Tipo:** 2D
**Cara:** Prancha de livro ilustrado antigo: a cena é uma chapa de talho-doce impressa em papel envelhecido, feita só de linhas paralelas de buril que engrossam no escuro.
**Bom pra:** história, ciência e natureza com cara de enciclopédia antiga, curiosidade, "como era antigamente".

## Como é

- **Fundo:** papel creme envelhecido com manchas e grão. A cena fica numa chapa com a marca da prensa e moldura dupla, sempre acima da legenda.
- **Cores:** uma tinta só, sépia quase preta (`COR.tinta`), sobre o papel. O único toque de cor é o destaque da legenda, ferrugem.
- **Traço:** não existe contorno nem cor chapada. A imagem é um campo de claro e escuro que a `Chapa` grava em três passadas: linhas horizontais que engrossam e se desviam na sombra, hachura a 50° nas sombras e uma terceira passada nas sombras fundas.
- **Movimento:** dentro da chapa as coisas andam devagar (onda, vapor, chuva, planta crescendo) e as linhas acompanham.
- **Letra:** IM Fell English, a letra dos livros antigos: o título da prancha em itálico entre filetes, com o rótulo em versalete ("prancha i").
- **Transição:** o buril passa na diagonal, com um risco de luz, e grava a chapa nova por cima da velha (`Chapa` com `de`). A primeira chapa se imprime de cima pra baixo.
- **Legenda:** IM Fell English, tinta sépia com halo de papel, palavra dita em ferrugem, a 73% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `campo`, `Camada` | montam a luz da cena: um fundo e camadas que se tampam |
| `elipse`, `faixa`, `poligono` | as formas que dizem onde cada camada cobre |
| `Chapa` | grava o campo em linhas de buril, com moldura; com `de`, faz a transição |
| `Rotulo` | o título da prancha, acima da chapa |
| `ceu`, `sol`, `nuvem`, `chuva`, `mar`, `planta` | desenhos prontos (camadas), molde pros novos |

## Pra desenhar coisa nova

Pense em luz e sombra, não em linha. Cada objeto é uma ou mais camadas: onde ele está (`elipse`, `faixa`, `poligono`)
e quão claro ele é ali (1 = papel limpo, 0 = sombra funda). Dê volume clareando o lado da luz e escurecendo a barriga
(veja a `nuvem`). Objeto escuro contra fundo claro lê melhor que cinza contra cinza.

## Evite

- Detalhe menor que umas três linhas de buril (uns 25 de tamanho): some na trama.
- Campo todo no mesmo cinza: a gravura vive do contraste.
- Cor, contorno ou texto dentro da chapa.
- Chapa na faixa da legenda (de 62% pra baixo, no vertical).
