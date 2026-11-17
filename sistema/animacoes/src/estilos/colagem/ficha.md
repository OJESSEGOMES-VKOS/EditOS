# Colagem

**Tipo:** 2D
**Cara:** Caderno de recortes: cada cena é uma folha colorida de borda rasgada que entra deslizando; em cima, recortes de jornal, retícula de gráfica e papel listrado colados um a um, tortos e com sombra, e letras de bilhete de sequestro.
**Bom pra:** curiosidade, notícia, lista, opinião, cultura pop, assunto com tom de revista ou de fanzine.

## Como é

- **Fundo:** mesa de papel kraft com fibra e tiras de jornal coladas no alto. Cada cena traz a sua `Folha` de uma cor só, com a borda de cima rasgada.
- **Cores:** papel chapado (`COR`: creme, marinho, céu, pêssego, areia, vermelho, amarelo, verde...) e os papéis estampados (`PAPEL`): listrado azul, retícula amarela, verde e laranja, e jornal. Cada recorte é de um papel.
- **Forma:** todo recorte tem borda rasgada (`rasgar`), a margem branca de quem recortou com a mão, sombra de altura e um giro torto. Linha vira `Tira` de papel com ponta cortada, nunca traço fino.
- **Movimento:** o recorte chega maior e torto e assenta com mola, como mão colando; um a um, nunca tudo junto. O que é contínuo (gota, vapor, onda) anda em degraus, como papel mexido à mão.
- **Letra:** bilhete de sequestro (`Letras`): cada letra num quadradinho de papel, de uma fonte (Abril Fatface, Anton, Special Elite, Playfair Display 900), de uma cor e de um giro. `Etiqueta` vermelha em Anton caixa alta pra uma palavra.
- **Transição:** a cena inteira entra como folha nova deslizando da direita e assentando torta (`FolhaNova`, 0,35 s); fusão 0.
- **Legenda:** Anton em caixa alta, creme com contorno preto, palavra dita em amarelo, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `Folha` | a folha de fundo da cena, uma cor, borda de cima rasgada |
| `FolhaNova` | a transição: embrulha a cena e faz ela entrar deslizando |
| `Recorte` | uma forma de papel (pontos) colada com mola; `papel` = estampa ou cor |
| `Tira` | uma tira de papel no lugar de linha (raio, caule, onda, seta) |
| `Letras` | bilhete de sequestro, letra por letra (título ou UMA palavra forte) |
| `Etiqueta` | palavra em etiqueta vermelha que se revela da esquerda |
| `Fita` | um pedaço de fita adesiva |
| `NoAlto` | põe texto no alto da tela, fora da faixa da legenda |
| `rasgar` | deixa qualquer contorno com borda de papel rasgado |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde dos novos |

## Pra desenhar coisa nova

Pense em quem recorta de revista com tesoura e cola: duas a cinco formas simples (círculo, retângulo, triângulo,
gota), cada uma de um papel diferente (o jornal pra o que é "notícia" ou neutro, a retícula pra o que tem cor viva,
o listrado pra água e tecido). Um prédio é um retângulo de jornal com janelas de retícula amarela; um celular é um
retângulo marinho com a tela de papel céu; uma pessoa é um círculo creme e um corpo de papel colorido. Cole na
ordem de quem monta: o maior primeiro, o detalhe por último.

## Evite

- Linha fina, degradê, brilho ou sombra macia de 3D: aqui tudo é papel.
- Movimento liso demais no que é contínuo: anda em degraus.
- `Letras` com a frase que a legenda está mostrando: use pra título (com a legenda desligada no trecho) ou uma palavra que a fala não diz naquele instante.
- Mais de 6 recortes chegando na mesma cena; mais de uma cor de folha por cena.
