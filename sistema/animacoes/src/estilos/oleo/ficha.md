# Pintura a óleo

**Tipo:** 2D
**Cara:** Cada cena é um quadro a óleo pintado na hora, com pinceladas grossas e empasto que seguem a forma das coisas.
**Bom pra:** história, reflexão, curiosidade com clima, abertura bonita, tema de arte, natureza e lugar.

## Como é

- **Fundo:** tela de linho crua com a trama do tecido; só aparece antes da primeira pincelada.
- **Cores:** paleta de pintor: ultramar, cobalto, celeste, névoa, ocre, amarelo-nápoles, siena, verde e a sombra violeta (`COR`). Nada de preto puro nem cor de neon.
- **Forma:** formas grandes com luz de um lado e sombra do outro (`bola`), céus e mares em degradê. Não há contorno: o volume vem da tinta.
- **Pincelada:** duas camadas: a massa (pinceladas largas que cobrem tudo) e o detalhe (pinceladas menores por cima). A direção segue o contorno das formas, e cada pincelada tem a crista clara do empasto.
- **Letra:** Playfair Display 900 nos títulos, cor de luz com contorno de sombra (`Assinatura`); Playfair itálico na legenda.
- **Movimento:** dentro do quadro a tinta se move: o reflexo do sol tremula, o mar ondula, a chuva desce, a nuvem incha, a planta cresce.
- **Transição:** a repintura: o quadro novo é pintado por cima do velho, das pinceladas grandes pras pequenas, em 1,8 s (`repintura`).
- **Legenda:** Playfair Display itálico 700, creme com sombra escura forte, palavra dita em amarelo-nápoles, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `Quadro` | pinta o campo com pinceladas; com `antes` e `p`, repinta por cima do quadro anterior |
| `Campo`, `empilha` | o desenho como função "cor da tinta no ponto"; empilhar é juntar desenhos |
| `degrade`, `bola`, `abaixo` | os campos básicos (céu e mar, forma com volume, chão) |
| `Assinatura` | título pintado |
| `repintura(t)` | o `p` da pintura no começo da cena |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos como campos, molde pros novos |

## Pra desenhar coisa nova

Pense como um pintor que bloqueia o quadro: duas ou três massas de cor com luz e sombra, um fundo em degradê, e
pronto. Monte com `bola`, `degrade` e `abaixo` empilhados. Forma menor que uma pincelada grande (uns 45 numa tela de
1080) se perde; o detalhe fino não existe neste estilo.

## Evite

- Forma pequena ou fina: vira borrão.
- Duas coisas da mesma cor encostadas: a pincelada não separa o que não tem diferença de luz.
- Texto pequeno ou em cima de área muito clara: título só com a `Assinatura`.
- Repintar a cada segundo: o quadro precisa de tempo parado pra ser visto (a tinta continua viva por dentro).
