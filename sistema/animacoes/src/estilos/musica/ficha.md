# Música visual

**Tipo:** 2D
**Cara:** Noite funda feita de pontos de luz que pulsam numa batida; as coisas se formam de poeira de luz e o mar de pontos sobe quando a fala fica forte.
**Bom pra:** clima, ritmo, revelação, curiosidade, vídeo com trilha marcante ou sem narração.

## Como é

- **Fundo:** degradê de noite (quase preto em cima e embaixo, azul-anil e roxo no meio) com um céu de estrelas. A cada batida um grupo de estrelas acende forte e apaga.
- **Cores:** só luz: branco, ouro, azul, lilás, rosa e verde (`COR`). Tudo tem núcleo branco e halo colorido. Nada de cor chapada.
- **Forma:** nada tem contorno sólido. A coisa é poeira de luz que se junta (`Poeira`), fio de luz que se desenha (`Luz`) ou fileira de pontos que ondula (`OndaDePontos`).
- **Letra:** Josefin Sans: fina e bem espaçada nos rótulos, grossa nos títulos, sempre com brilho.
- **Movimento:** tudo respira na batida (`batida`, 100 por minuto, saída do relógio). A força das ondas e do brilho vem da `energia` da fala (cada palavra dita levanta, depois cai). Não usa arquivo de som: se a pessoa mandar trilha, combine o `BPM` com ela.
- **Transição:** um clarão de luz que nasce no centro e apaga (`Clarao`), no começo da cena.
- **Legenda:** Josefin Sans 700, branca com halo dourado, palavra dita em ouro, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `batida(t)` | número da batida e o `pulso` (1 na batida, cai rápido): ligue em tamanho, brilho e cor |
| `energia(fala, tv)` | a força da fala agora, de 0 a 1: faz o papel do volume |
| `Brilho` | um ponto de luz redondo |
| `Luz` | fio de luz que se desenha, com halo |
| `Poeira` | grãos de luz que se juntam numa forma (`deY` diz de que altura eles saem) |
| `OndaDePontos` | fileiras de pontos que ondulam; `forca` levanta as ondas |
| `Letreiro` | texto de luz que sobe e acende |
| `Clarao` | a transição |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, que servem de molde pros novos |

## Pra desenhar coisa nova

Pense em constelação: coisa cheia vira `Poeira` (escreva uma função que devolve pontos de dentro da forma, como
`pontosDeNuvem`); coisa fina vira `Luz` (uma lista de pontos). Uma casa é um quadrado e um triângulo de `Luz`; uma
árvore é um tronco de `Luz` e uma copa de `Poeira`. Toda coisa recebe o `pulso` da batida pra respirar junto.

## Evite

- Cor sólida, preenchimento chapado ou contorno escuro: aqui tudo é luz.
- Muito grão: mais de uns 150 pontos numa forma deixa pesado e embola.
- Texto fino pequeno: o rótulo fino só a partir de 56; título grosso.
- Pulso forte em tudo ao mesmo tempo: escolha o que bate na batida (estrelas, sol, chuva) e deixe o resto respirar.
