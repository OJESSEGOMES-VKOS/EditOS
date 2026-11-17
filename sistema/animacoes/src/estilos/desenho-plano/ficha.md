# Desenho plano

**Tipo:** 2D
**Cara:** Ilustração flat moderna: formas lisas em cores chapadas e vivas, sem contorno nem sombra, que entram com mola sobre um fundo de cor inteira.
**Bom pra:** explicação rápida, dado e número, produto e serviço, curiosidade, conteúdo de marca.

## Como é

- **Fundo:** cada cena tem um fundo de uma cor só (`FundoCena`): azul-noite, céu, creme, laranja. Alterne claro e escuro entre as cenas.
- **Cores:** a paleta chapada de `COR`. No máximo quatro cores por cima do fundo. Nada de gradiente, contorno ou sombra.
- **Forma:** geometria lisa: círculo, retângulo de canto redondo, pílula, onda. O desenho é montado por peças sobrepostas.
- **Letra:** Poppins 800 em tudo: manchete grande e etiqueta em pílula, em caixa alta e espaçada.
- **Movimento:** cada peça entra com mola (`mola`, `Peca`), passa um pouco do tamanho e volta, uma depois da outra. Depois a cena respira: gira, corre de lado, cai. Câmera parada.
- **Transição:** um círculo da cor do próximo fundo cresce do centro e cobre a tela (`Bola`), no fim da cena.
- **Legenda:** Poppins 800 branca com contorno azul-tinta, palavra dita em amarelo, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `mola(t, em)` | o número de 0 a 1 com balanço que anima tudo no estilo |
| `Peca` | qualquer forma que entra crescendo com mola a partir de um ponto |
| `FundoCena` | o fundo de cor inteira da cena |
| `Etiqueta` | rótulo curto em pílula, em caixa alta |
| `Manchete` | texto grande que sobe com mola (até 5 palavras) |
| `Bola` | a transição: círculo de cor que cobre a tela |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde pros novos |

## Pra desenhar coisa nova

Monte o objeto com três a seis formas geométricas chapadas, uma por cima da outra, cada uma num `Peca` com um
tempinho de diferença (0,08 a 0,15 s). Bicho e gente são pílula + círculo + um olho de bolinha. Duas cores
próximas (um tom e um tom mais escuro) dão volume sem sombra.

## Evite

- Contorno, sombra, gradiente ou textura: matam o flat.
- Mais de quatro cores por cena.
- Fundo da mesma cor duas cenas seguidas: a `Bola` some.
- Peças entrando todas juntas: a graça é a fila de molas.
