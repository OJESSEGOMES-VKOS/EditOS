# Oficina antiga

**Tipo:** 2D
**Cara:** A bancada de um artesão à noite, com latão e luz quente; tudo vira um pequeno teatro mecânico em cima da mesa.
**Bom pra:** "como funciona", mecanismo, invenção, história de objeto e explicação passo a passo.

## Como é

- **Fundo:** parede de tábuas escuras na metade de cima, tampo de madeira com veio na de baixo, a poça de luz da lâmpada e poeira dourada no ar. Não muda.
- **Cores:** madeira, latão (sempre com o gradiente `oficina-antiga-latao`), papel velho, ferro, azul de vidro pra água, verde de folha (`COR`).
- **Forma:** objeto de verdade feito de latão, lata e madeira, com sombra jogada na bancada. Nada flutua sem motivo: o que está no alto pende de um fio (`Fio`).
- **Letra:** Anton gravado em placa de latão nos títulos (`Placa`), Playfair 700 em etiqueta de papel nos rótulos e na legenda.
- **Movimento:** engrenagens girando sempre, peças descendo pelo fio, mar de cilindros com manivela, folhas que abrem como brinquedo de corda. A câmera chega devagar e deriva de lado.
- **Transição:** o diafragma de latão fecha no fim da cena e abre no começo da próxima (`Diafragma`, cenas sem fusão).
- **Legenda:** Playfair 700, papel velho, palavra dita em ouro, a 71% da altura, com sombra escura.

## As peças

| Peça | O que faz |
|---|---|
| `Engrenagem` | engrenagem de latão que gira; a vida de toda cena |
| `Fio` | o fio que segura do teto o que está no alto |
| `Placa` | título gravado em placa de latão rebitada, que cai e assenta |
| `Etiqueta` | texto curto à pena numa etiqueta de papel |
| `Diafragma` | a transição: fecha e abre a cena |
| `pol` | ponto na volta de um círculo, em graus (pra dentes, raios, ponteiros) |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, que servem de molde pros novos |

## Pra desenhar coisa nova

Pergunte como um artesão montaria aquilo na bancada com latão, lata e madeira: um corpo simples, um detalhe de
latão (rebite, aro, manivela) e uma parte que se mexe. Ponha a sombra (`filter="url(#oficina-antiga-sombra)"`), apoie
na bancada ou pendure num `Fio`. Se o assunto tem mecanismo, mostre as engrenagens girando.

## Evite

- Coisa solta no ar sem fio, e desenho chapado sem sombra: aqui tudo é objeto.
- Mais de três engrenagens grandes na mesma cena.
- Cor fria dominando: a luz é sempre quente.
- Texto abaixo de 56 de tamanho.
