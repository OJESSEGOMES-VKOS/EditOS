# Vitral

**Tipo:** 2D
**Cara:** A tela é um painel de vidro com chumbo; cada coisa acende caco por caco, em cor de joia, com a luz atravessando.
**Bom pra:** história com clima, curiosidade, conteúdo que pede cor forte e um ar solene.

## Como é

- **Fundo:** a tela inteira é uma malha de cacos de vidro escuros e foscos, presos por chumbo preto. Uma luz passeia por trás e acende de leve os cacos por onde passa. Feixes de luz com poeira descem na diagonal.
- **Cores:** cores de joia, saturadas (`COR`): rubi, âmbar, ouro, esmeralda, folha, safira, celeste, ametista e opala. Cada caco sai um pouco diferente do vizinho.
- **Forma:** ninguém desenha contorno. A coisa nasce quando os cacos que caem dentro dela acendem, do centro pra fora, com um brilho rápido. A borda leva chumbo grosso.
- **Letra:** Cinzel Decorative nos títulos, em vidro colorido contornado de chumbo. Marcellus na legenda.
- **Movimento:** acende, a luz passeia, as peças soltas (gotas, folhas) andam. O vapor e a chuva são cacos que sobem e caem.
- **Transição:** um clarão de sol atravessa o vidro na diagonal no começo de cada cena (`Clarao`).
- **Legenda:** Marcellus, creme, palavra dita em ouro, com sombra escura forte, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `Vidro` | acende um trecho do painel numa cor: recebe uma ou mais formas (listas de pontos) e liga os cacos de dentro |
| `Caco` | uma peça de vidro solta, inteira, com chumbo e reflexo: pra coisa pequena ou que se mexe |
| `Letreiro` | texto em vidro, letra por letra acendendo |
| `Clarao` | a transição: luz que atravessa o vidro |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, que servem de molde pros novos |

## Pra desenhar coisa nova

Pense como quem monta um vitral: uma forma grande e simples, uma cor só por área. Coisa grande e parada vira `Vidro`
(o contorno em pontos, com `circulo()` pras redondas); coisa pequena ou que anda vira `Caco`. Uma casa é um `Vidro`
quadrado âmbar com um `Vidro` triangular rubi em cima. Duas ou três cores por objeto bastam.

## Evite

- Detalhe fino: o caco tem uns 66 de largura, forma menor que isso some. Detalhe pequeno vai em `Caco`.
- Usar cor escura pra coisa importante: ela some no painel apagado.
- Símbolo religioso ou janela de igreja: o estilo é a técnica do vidro, não o lugar.
- Texto pequeno: nada abaixo de 56 de tamanho.
