# Mosaico

**Tipo:** 2D
**Cara:** A tela inteira é um painel de pedrinhas de vidro e ouro sobre argamassa; na troca de cena, as pedras viram uma a uma em onda.
**Bom pra:** curiosidade, história, abertura marcante, explicação de poucas etapas com imagem forte.

## Como é

- **Fundo:** argamassa cinza-quente com grão de cimento, que aparece só entre as pedras.
- **Cores:** vidro fosco em azuis, verdes, terra, marfim e cinza, mais o ouro (`COR`). Cada pedra varia um pouco o brilho; o ouro cintila numa faixa de luz que passa em diagonal.
- **Forma:** tudo é feito de pedras quadradas de 30 (numa tela de 1080), levemente tortas e desencontradas. Forma grande e chapada, com contorno de uma pedra de largura pra ler.
- **Letra:** Cinzel em caixa alta, marfim, numa faixa azul-noite com friso de ouro (`Letreiro`). Legenda em Marcellus.
- **Movimento:** dentro da cena as pedras trocam de cor pra animar (mar ondula, chuva desce, planta cresce, nuvem incha), sempre pedra por pedra, nunca liso.
- **Transição:** a virada: cada pedra gira sobre si e mostra a cor nova quando a onda que sai do centro passa por ela (`virada`, 1,2 s).
- **Legenda:** Marcellus, branca com sombra preta forte, palavra dita em ouro claro, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `Painel` | pinta a tela de pedras pelo campo; com `antes` e `p`, faz a virada |
| `Campo`, `empilha` | o desenho como função "cor da pedra no ponto"; empilhar é juntar desenhos |
| `tudo`, `disco`, `anel`, `abaixo`, `faixas`, `contorno` | os campos básicos |
| `Letreiro` | a inscrição em faixa escura com friso de ouro |
| `virada(t)` | o `p` da onda de pedras no começo da cena |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos como campos, molde pros novos |

## Pra desenhar coisa nova

Pense em quem assenta pedra: silhueta grande, duas ou três cores, contorno escuro. Monte com `disco`, `abaixo` e
`faixas` empilhados, e passe `contorno()` em volta do que precisa destacar do fundo. Movimento é a forma mudando
com `t` (as pedras é que trocam de cor). Coisa menor que 3 pedras não aparece.

## Evite

- Detalhe pequeno ou linha fina: não cabe em pedra.
- Texto solto na tela: escrita só no `Letreiro`.
- Degradê liso: céu em degradê é `faixas` de pedra.
- Cena com mais de 3 coisas: o mosaico precisa de uma imagem dominante.
