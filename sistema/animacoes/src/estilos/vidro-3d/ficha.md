# Vidro 3D

**Tipo:** 3D leve
**Cara:** Objetos de vidro fosco e translúcido flutuando num fundo branco-gelo com luzes coloridas desfocadas, com cara de app premium.
**Bom pra:** tecnologia, produto, app, dado e número, explicação moderna e limpa.

## Como é

- **Fundo:** branco-gelo limpo, com quatro luzes coloridas grandes e desfocadas (azul, violeta, pêssego, ciano) passando devagar. Não muda de cor.
- **Vidro (a marca do estilo):** todo objeto é um `Vidro`. Por dentro ele mostra as mesmas luzes do fundo, mais borradas, ampliadas e deslocadas (a refração do vidro fosco); por cima, a tinta do objeto translúcida, um brilho que desce do alto à esquerda e um ponto de luz de estúdio. A borda é a espessura: acende em cima, ganha tinta escura embaixo, com um aro fino que pega luz.
- **Sombra:** o vidro joga uma sombra COLORIDA da própria tinta logo atrás e, se apoia em algo (`chao`), uma mancha colorida macia embaixo.
- **Cores:** tintas de vidro (`COR`): âmbar, laranja, azul, ciano, violeta, verde, rosa e gelo. A letra é azul-noite.
- **Movimento:** tudo flutua devagar (`flutua`), cada peça no seu ritmo; coisas novas crescem com um leve passar do ponto. Nada é brusco.
- **Letra:** Manrope 800 (letra de interface, firme e limpa), com espaçamento apertado.
- **Transição:** o foco. A cena sai desfocando e a próxima chega saindo do desfoque (`Foco`), como câmera trocando o foco.
- **Legenda:** Manrope 800, azul-noite com halo branco, palavra dita em azul-elétrico, a 73% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `Vidro` | o objeto de vidro: refração das luzes, tinta, brilho, espessura, aro e sombra colorida |
| `Cartao` | o painel de vidro de cantos redondos (o cartão de app), pra pôr texto em cima |
| `Texto` | letra do estilo que sobe e aparece |
| `Foco` | a transição: envolve a cena inteira |
| `flutua` | o balanço lento de cada peça |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde dos novos |

## Pra desenhar coisa nova

Escreva o contorno do objeto como caminho SVG (ou pontos passados pro `caminho(pontos, true)`, como a nuvem) e passe
pro `Vidro` com o centro e o tamanho. Formas cheias e arredondadas, sem parte fina: o vidro precisa de área pra
mostrar a refração. Objeto de duas cores vira dois vidros; o de trás primeiro. Passe sempre o `tv` (segundo do vídeo)
como `t` do `Vidro`, pra o que aparece dentro dele bater com as luzes do fundo.

## Evite

- Muito vidro pequeno ao mesmo tempo: mais de uns 15 pesa na foto e vira ruído.
- Vidro em cima de vidro da mesma tinta: some. Alterne gelo e cor.
- Fundo escuro ou cor chapada: o vidro precisa das luzes atrás pra existir.
- Texto pequeno: nada abaixo de 56 de tamanho.
