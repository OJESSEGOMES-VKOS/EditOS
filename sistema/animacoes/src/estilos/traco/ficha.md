# Traço contínuo

**Tipo:** 2D
**Cara:** Papel claro e uma linha azul-tinta só, que nunca sai do papel: ela se desenha e depois escorrega pra virar o desenho seguinte, com a ponta coral da caneta na frente.
**Bom pra:** explicar como uma coisa vira outra: processo, ciclo, transformação, antes e depois, ideia que evolui.

## Como é

- **Fundo:** papel claro e liso, grão bem leve e uma margem fina. Não muda.
- **Cores:** três e só: azul-tinta na linha, azul-acinzentado nos riscos de detalhe e coral na ponta da caneta e nos destaques (`COR`). Nada de preenchimento.
- **Traço:** uma linha de espessura única, ponta redonda. O desenho principal de cada cena é UMA linha só, sem levantar a caneta.
- **Movimento:** na primeira cena a linha se desenha; dali pra frente ela não some, ela vira: escorrega da forma anterior até a nova, ondulando no meio do caminho. A ponta coral mostra onde a linha está trabalhando.
- **Letra:** Italiana nos títulos, fina e alta, com um fio coral por baixo (`Letra`).
- **Transição:** a própria virada da linha (`Fio` com `de`). Não tem corte nem cortina.
- **Legenda:** Spectral 700, azul-tinta com halo de papel, palavra dita em coral, a 74% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `reta`, `arco`, `onda`, `forma` | montam uma forma de linha única com sempre o mesmo número de pontos |
| `Fio` | a linha: se desenha (`desenha`) ou vira de uma forma pra outra (`de`, `para`, `vira`) |
| `Detalhe` | riscos curtos e finos de apoio (brilho, gota, vapor) |
| `Letra` | título fino que se escreve com um fio coral por baixo |
| `sol`, `mar`, `nuvem`, `chuva`, `planta`, `pingos` | desenhos prontos, molde pros novos |

## Pra desenhar coisa nova

Pense como quem desenha sem tirar a caneta do papel: entre pela esquerda, contorne o objeto e saia pela direita, na
mesma altura. Emende os pedaços (`reta`, `arco`, `onda`, zigue-zague de pontos) e passe por `forma()`. Entrar e sair
pelos lados é o que faz uma forma virar a outra sem dar nó. Detalhe que não cabe na linha vai em `Detalhe`.

## Evite

- Mais de uma linha principal na mesma cena: a graça é ser uma só (um segundo `Fio` menor, no máximo).
- Forma que começa e termina no meio do desenho: a virada vira um novelo.
- Preencher forma ou usar outra cor na linha.
- Texto pequeno: nada abaixo de 56.
