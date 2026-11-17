# Papel recortado

**Tipo:** 2D
**Cara:** Recortes de papel colorido com borda de tesoura e sombra, animados aos trancos como stop-motion de mesa.
**Bom pra:** história infantil, explicação simples, conto, curiosidade da natureza.

## Como é

- **Fundo:** cada cena é uma folha de papel de uma cor só, cobrindo a mesa. A luz de luminária faz vinheta quente e oscila um pouco.
- **Cores:** papel de dobradura chapado (`COR`): creme, azul-noite, céu, quatro azuis de mar, laranja, amarelo, vermelho, três verdes, cinza. Sem degradê.
- **Forma:** toda peça tem borda de tesoura (cortes retos, levemente tortos), grão de fibra e sombra que mostra a altura sobre a mesa.
- **Movimento:** 12 poses por segundo (`passo`). As peças entram pulando ou deslizando da borda, passam um pouco e voltam, e tremem de leve a cada pose.
- **Letra:** DM Serif Display no papel rasgado; Archivo Black na etiqueta vermelha e na legenda.
- **Transição:** uma folha nova, de borda rasgada, sobe do pé da tela e cobre a cena (`FolhaNova`), já com a cor da cena seguinte.
- **Legenda:** Archivo Black creme, palavra dita em amarelo, sombra escura, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `passo` | trava o tempo em 12 poses por segundo; toda cena passa o `t` por ele |
| `Mesa` | a folha de fundo da cena, os filtros do papel e a luz; tudo vai dentro dela |
| `Recorte` | uma ou várias formas coladas que entram (`de`: pula, baixo, cima, esquerda, direita) e tremem |
| `cortar`, `roda`, `estrela`, `caixa`, `morro` | as formas: contorno de tesoura, elipse, estrela, retângulo, faixa ondulada até o pé |
| `Etiqueta` | texto em papel rasgado, com etiqueta vermelha opcional |
| `FolhaNova` | a transição: folha rasgada que sobe e cobre |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde pros novos |

## Pra desenhar coisa nova

Pense no objeto como alguém recortaria com tesoura em um minuto: duas a cinco formas simples coladas (elipse,
retângulo, triângulo, estrela), cada uma de uma cor chapada. Peixe é uma elipse com um triângulo de rabo; casa é uma
caixa com um triângulo. Junte as formas num `Recorte` só quando elas se movem juntas.

## Evite

- Movimento liso: sem o `passo`, perde a cara de stop-motion.
- Detalhe fino (linha, texto pequeno): tesoura não faz.
- Mais de uma cor de fundo na mesma cena.
