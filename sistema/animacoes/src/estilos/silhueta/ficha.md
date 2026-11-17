# Silhueta

**Tipo:** 2D
**Cara:** Pôster minimalista: céu de duas cores em degradê, uma linha de horizonte e poucas formas recortadas em preto chapado contra a luz.
**Bom pra:** reflexão, curiosidade calma, história com clima, frase de impacto, natureza e tempo.

## Como é

- **Fundo:** céu em degradê de duas cores sobre um chão escuro, com o horizonte a 60% da altura. Cada cena escolhe a sua hora do dia (`HORA`: madrugada, manhã, tarde, entardecer, crepúsculo, chuvoso) e pode passar de uma pra outra.
- **Cores:** o céu dá a cor; tudo que está na frente é preto chapado (`TINTA`). As únicas coisas claras são as que são luz: sol, reflexo, chuva, vapor.
- **Forma:** silhueta reconhecível pelo contorno, sem detalhe por dentro. Poucas coisas por cena (uma ou duas).
- **Movimento:** lento. A forma sobe do horizonte ou cresce da base; o céu muda de cor; o reflexo respira.
- **Letra:** Montserrat 300, grande e com respiro, no céu; Montserrat 600 em caixa alta bem espaçada pros rótulos curtos.
- **Transição:** a luz vai embora e a tela escurece (`Escurece`), no fim da cena.
- **Legenda:** Montserrat 700 em caixa alta, branca com sombra escura, palavra dita em âmbar, a 74% da altura (em cima do chão escuro).

## As peças

| Peça | O que faz |
|---|---|
| `Ceu` | o céu e o chão na hora do dia escolhida, e a passagem de uma hora pra outra |
| `Recorte` | põe uma forma preta no lugar; sobe do horizonte ou cresce da base (`cresce`) |
| `Letreiro` | texto de pôster, fino e espaçado, que sobe devagar |
| `Escurece` | a transição: a tela vai ao preto |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde pros novos |

## Pra desenhar coisa nova

Desenhe o contorno em volta de (0,0), com o pé no zero e em unidades de tela de 1080, e ponha dentro de um
`Recorte`. Pense em como a coisa fica de perfil contra o pôr do sol: árvore é tronco e três bolas, casa é quadrado e
telhado, pessoa é cabeça redonda e corpo em trapézio. Coisa que brilha (lâmpada, fogo, estrela) não é recorte: é luz,
em cor clara.

## Evite

- Detalhe dentro da silhueta (olho, janela, textura): some no preto.
- Mais de duas ou três formas por cena: o estilo vive de vazio.
- Céu de cor forte demais atrás da legenda: ela fica no chão escuro, deixe ali livre.
- Texto pequeno: nada abaixo de 56, exceto o rótulo espaçado em caixa alta (40 no mínimo).
