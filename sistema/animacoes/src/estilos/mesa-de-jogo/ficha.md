# Mesa de jogo

**Tipo:** 2D
**Cara:** Mesa de feltro vinho à noite, sob a luminária; tudo aparece pintado na face de cartas que viram, com fichas e ouro em folha.
**Bom pra:** curiosidade, probabilidade, conta, mistério, revelação e "parece mentira".

## Como é

- **Fundo:** feltro vinho com a luz da luminária no alto, trama de pano, borda de madeira escura e poeira dourada flutuando. Não muda.
- **Cores:** vinho, creme de papel, a tinta do baralho (vermelho e preto), petróleo no verso das cartas, ouro em folha (`COR`). Água em azul claro, folha em verde fechado.
- **Forma:** chapada, sem contorno de mão, como o naipe impresso numa carta. Os desenhos usam os próprios naipes: o sol tem raios de ouros, a chuva são copas de ponta-cabeça, a folha é uma espada.
- **Letra:** Anton em ouro em folha nos títulos (com brilho que passa), Playfair itálico em creme nos rótulos, Archivo 800 na legenda.
- **Movimento:** carta cai e bate na mesa com mola, vira em 3D levantando do feltro, acende em ouro; ficha bate e quica; a câmera respira e empurra devagar.
- **Transição:** o rodo do crupiê entra pela direita e varre a cena pra fora da mesa (`Rodo`).
- **Legenda:** Archivo 800, creme, palavra dita em ouro, a 71% da altura, com sombra escura.

## As peças

| Peça | O que faz |
|---|---|
| `Carta` | a peça principal: carta que vira (`vira`), levanta (`alt`) e acende (`brilho`); a face é um SVG de 200 x 280 onde vai o desenho |
| `Naipe` | copas, espadas, ouros ou paus, em qualquer cor: o tijolo de todo desenho |
| `Ficha`, `Pilha` | ficha de pôquer que bate (com número curto dentro) e pilha de cenário |
| `Ouro` | texto de título em ouro em folha que bate na mesa |
| `Rotulo` | texto de apoio em creme itálico |
| `Estouro` | faíscas de ouro na hora da revelação |
| `Rodo` | a transição: envolve a cena e varre tudo pra fora |
| `bate` | a mola de quem cai na mesa (use pra escala e pra `alt`) |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, que servem de molde pros novos |

## Pra desenhar coisa nova

Pense no objeto como a figura impressa numa carta: duas ou três formas chapadas, na tinta do baralho, de preferência
montadas com naipes (`Naipe`) e círculos. Desenhe dentro da face da `Carta` (coordenadas de 200 x 280) e revele
virando a carta na palavra que fala dele. Quantidade se mostra com fichas ou com uma fileira de cartas.

## Evite

- Desenho com contorno e sombreado: aqui é tinta chapada de baralho.
- Carta pequena demais: a principal tem pelo menos 260 de largura, senão o desenho da face some.
- Mesa cheia: no máximo três cartas em destaque e duas pilhas de cenário.
- Texto abaixo de 56 de tamanho.
- Carta de marca ou figura de baralho de terceiros (valete, rei desenhados): use só canto e naipe.
