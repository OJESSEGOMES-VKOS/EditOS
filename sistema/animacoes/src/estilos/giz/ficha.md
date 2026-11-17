# Quadro de giz

**Tipo:** 2D
**Cara:** Lousa verde com moldura de madeira; tudo é desenhado a giz na frente de quem assiste.
**Bom pra:** aula, explicação passo a passo, curiosidade, conta e comparação.

## Como é

- **Fundo:** lousa verde-escura com manchas de apagador, moldura de madeira. Não muda de cor.
- **Cores:** só giz claro: branco, amarelo, azul, verde, rosa e laranja (`COR`). Nada de cor escura nem de preto.
- **Traço:** risco grosso com grão e tremor de mão (o filtro `giz`). O traço sempre SE DESENHA, nunca aparece pronto.
- **Cor por dentro:** hachura, riscos inclinados, como quem pinta com o giz de lado (`Risco cheio`).
- **Letra:** Fredericka the Great nos títulos (letra de lousa desenhada), Kalam no resto (letra de mão).
- **Movimento:** desenha, espera um instante, ganha vida (balança, cresce, chove). A câmera fica parada.
- **Transição:** o apagador passa e limpa a lousa (`Apagador`), sempre no fim da cena.
- **Legenda:** Kalam 700, branca, palavra dita em amarelo, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `Giz` | a camada que dá grão e tremor; todo desenho vai dentro dela |
| `Risco` | um caminho de pontos que se desenha; com `cheio`, pinta por dentro em hachura |
| `Escrito` | texto que se escreve da esquerda pra direita |
| `Apagador` | a transição: limpa a cena |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta`, `Seta` | desenhos prontos, que servem de molde pros novos |

## Pra desenhar coisa nova

Todo objeto é uma lista de pontos passada pro `Risco`. Pense no objeto como um professor desenharia na lousa em dez
segundos: o contorno, um ou dois detalhes, uma cor. Copo é um trapézio; casa é um quadrado com um triângulo.
Use `circulo()` pra formas redondas e `reto` pra formas de quina.

## Evite

- Desenho cheio de detalhe: giz é simples. Mais de 8 riscos num objeto já é muito.
- Texto pequeno: nada abaixo de 56 de tamanho.
- Deixar a lousa cheia: cada cena apaga a anterior.
