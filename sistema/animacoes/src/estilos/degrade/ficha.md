# Degradê vivo

**Tipo:** 2D
**Cara:** Manchas enormes de cor que passeiam devagar; na frente, uma palavra gigante que sobe da linha e formas de vidro fosco.
**Bom pra:** dica rápida, conceito, lista, marca, produto, tom moderno e limpo.

## Como é

- **Fundo:** quatro manchas de cor (degradê) que se movem devagar, com grão fino por cima. Cada cena tem a sua
  paleta (`PALETA`: noite, calor, céu, mar, folha, lilás); a fusão entre cenas troca as cores.
- **Cores:** as da paleta da cena no fundo; na frente, só branco (texto) e vidro (branco translúcido com borda clara).
- **Traço:** não tem traço desenhado. Toda forma é vidro fosco: preenchimento branco em degradê, borda clara fina e
  sombra macia (`Vidro`). Formas geométricas e arredondadas.
- **Letra:** Inter Tight 800, gigante, apertada, alinhada à esquerda, uma palavra-chave por cena (`Palavra`), com um
  rótulo pequeno espaçado em cima quando precisa.
- **Movimento:** cada palavra sobe de trás de uma linha, uma depois da outra; as formas crescem do centro; o fundo
  nunca para.
- **Transição:** a palavra sai por cima e a paleta da próxima cena funde por cima da anterior (0,5 s).
- **Legenda:** Inter Tight 800, branca, palavra dita em amarelo-claro, a 74% da altura, com sombra escura.

## As peças

| Peça | O que faz |
|---|---|
| `Manchas` | o degradê vivo; ponha no começo de toda cena com a paleta dela |
| `Vidro` | dá a cara de vidro fosco a qualquer forma SVG dentro dele; `p` faz crescer do centro; `forte` deixa mais opaco |
| `Palavra` | a palavra gigante que sobe; `some` faz sair |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, que servem de molde pros novos |

## Pra desenhar coisa nova

Pense em ícone: o objeto em uma a três formas simples (círculo, retângulo arredondado, elipse, um caminho curto),
cada uma dentro de um `Vidro`. Peça principal com `forte`, detalhe sem. A palavra da cena diz o conceito em uma
palavra (calor, vapor, chuva), sem repetir a frase da legenda.

## Evite

- Detalhe e textura dentro da forma: o vidro é liso.
- Mais de 3 palavras na `Palavra`, e qualquer texto abaixo de 56.
- Duas paletas fortes misturadas na mesma cena.
- Cor chapada na frente: na frente só existe branco e vidro.
