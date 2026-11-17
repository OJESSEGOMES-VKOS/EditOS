# Maquete 3D

**Tipo:** 3D edição
**Cara:** Diorama em miniatura numa mesa, visto de cima em ângulo, com peças de plástico em cores de brinquedo e o desfoque de tilt-shift que deixa tudo pequeno.
**Bom pra:** explicar como uma coisa funciona por partes, processo, geografia, cidade, natureza, "o mundo em miniatura".

## Como é

- **Fundo:** uma sala clara fora de foco, com luzinhas borradas e o tampo de madeira da mesa embaixo.
- **Palco:** um bloco de terreno (terra dos lados, grama ou mar na tampa) em cima da mesa. Tudo acontece em cima dele.
- **Volume:** 3D de verdade calculado no Remotion: cada peça tem posição no mundo, a câmera olha de cima (uns 33 graus) e gira devagar, a luz vem do alto à esquerda (face do lado mais clara, a outra mais escura) e cada peça faz sombra macia no chão.
- **Material:** plástico pintado brilhante: bola com reflexo branco, tubo com faixa de luz, bloco com quina arredondada.
- **Cores:** de brinquedo, saturadas e limpas (`COR`): grama, mar, areia, sol, laranja, vermelho, rosa, terra, tronco.
- **Coisas no ar** (sol, nuvem) ficam presas numa haste fininha, como em maquete de verdade.
- **Tilt-shift:** a faixa de cima e a de baixo da tela ficam desfocadas; o foco é a faixa do meio, onde está a maquete.
- **Letra:** Lilita One em relevo (camadas empilhadas, como letreiro de plástico) nos títulos; Nunito 900 na legenda.
- **Movimento:** peças brotam com mola (`elastico`), pingos e vapor em loop, câmera girando bem devagar.
- **Transição:** a maquete pousa na entrada e sobe sumindo na saída (dentro da `Maquete`).
- **Legenda:** Nunito 900 branca com contorno escuro, palavra dita em amarelo, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `useCam(t, giro, cy)` | a câmera de cima que gira devagar |
| `Maquete` | ordena as peças do fundo pra frente, põe as sombras, o tilt-shift e a entrada/saída |
| `terreno` | a mesa e o bloco de terreno (tampa de grama, mar, areia...) |
| `bloco`, `bola`, `tubo`, `cone`, `haste` | as formas 3D: caixa, esfera, cilindro, cone e a haste que segura coisas no ar |
| `Letreiro` | texto em relevo de plástico |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde pros novos |

## Pra desenhar coisa nova

Monte o objeto como um brinquedo de peças: casa é um `bloco` com um `cone` em cima; carro é um `bloco` com quatro
`bola` pretas; pessoa é um `tubo` com uma `bola` de cabeça. Posição sempre no mundo (`[x, y, z]`, y pra cima, chão
em 0, terreno de -280 a 280). Coisa que voa vai numa `haste`. Passe `chao` na bola principal pra ganhar sombra.

## Evite

- Desenho plano em SVG por cima da maquete: tudo que é objeto entra como peça 3D.
- Objeto fora do terreno ou alto demais (acima de y 450 sai do foco do tilt-shift).
- Mais de umas 40 peças numa cena: polui e pesa.
- Texto pequeno: nada abaixo de 56. Texto mora no topo (Letreiro), nunca na faixa da legenda.
