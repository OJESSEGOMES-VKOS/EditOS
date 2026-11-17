# Retícula de gráfica

**Tipo:** 2D
**Cara:** Página impressa vista de perto: tudo é feito de pontinhos de quatro tintas (ciano, magenta, amarelo e preto) sobre papel creme.
**Bom pra:** curiosidade, notícia, explicação com cara de revista ou de gibi antigo, tom pop.

## Como é

- **Fundo:** papel creme com fibra, marcas de registro nos cantos e a barra das quatro tintas no topo. Não muda.
- **Cores:** só as quatro tintas (`TINTA`). A cena é pintada em cor normal e a `Reticula` separa em pontos; a mistura
  dos pontos faz as outras cores (verde = ciano + amarelo, laranja = magenta + amarelo).
- **Traço:** não tem linha. Toda forma é uma mancha de pontos em grade inclinada, um ângulo por tinta (15°, 75°, 0°,
  45°), com o registro tremendo um tiquinho, como na máquina.
- **Letra:** Space Grotesk 700 no texto grande, feito de pontinhos pretos, dentro de uma faixa de papel com borda
  preta; Space Mono 700 em magenta no rótulo (`Impresso`).
- **Movimento:** a cena chega numa onda de pressão que sai de um ponto e engorda os pontos na frente dela; depois as
  coisas andam (chuva, onda, raio do sol girando).
- **Transição:** os pontos encolhem até quase sumir (`apaga`) e a próxima cena chega na onda.
- **Legenda:** Space Grotesk 700, preta, palavra dita em magenta, a 73% da altura, com halo de papel em volta.

## As peças

| Peça | O que faz |
|---|---|
| `Reticula` | imprime a cena em pontos; `chega` passa a onda de pressão (a partir de `de`), `apaga` encolhe os pontos |
| `Pintor` | o formato de todo desenho: uma função que pinta em canvas comum, em cor chapada |
| `Impresso` | texto grande de pontinhos numa faixa de papel, revelado da esquerda pra direita |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta`, `Chao` | desenhos prontos (pintores), que servem de molde pros novos |

## Pra desenhar coisa nova

Escreva um pintor: pinte o objeto em canvas com formas grandes e cor forte e chapada (círculo, elipse, retângulo,
linha grossa). Nada de linha fina nem detalhe pequeno: o ponto da retícula tem uns 17 de tamanho, e o que for menor
que três pontos some. Cor muito clara vira quase nada; cor muito escura vira preto.

## Evite

- Linha fina, texto pintado dentro do pintor e detalhe miúdo.
- Branco puro como cor de objeto: no papel ele some.
- Mais de 4 ou 5 pintores na mesma cena.
- Texto pequeno: nada abaixo de 56.
