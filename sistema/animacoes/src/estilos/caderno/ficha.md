# Rabisco de caderno

**Tipo:** 2D
**Cara:** Caneta esferográfica azul numa folha pautada de caderno, com traço tremido que ferve e círculo de caneta vermelha no que importa.
**Bom pra:** dica rápida, explicação leve, estudo, "anotação de aula", conteúdo descontraído.

## Como é

- **Fundo:** folha de caderno creme, pauta azul clara, margem vermelha e os furos do fichário.
- **Cores:** azul de caneta em quase tudo. Vermelho pra destacar (círculo, seta), verde e laranja de caneta colorida só pra dar cor a uma coisa por cena.
- **Traço:** caneta em duas passadas, tremida, que "ferve" (o tremor muda 7,5 vezes por segundo, como desenho animado à mão). Sempre se desenha.
- **Cor por dentro:** rabisco em zigue-zague contínuo (`Rabisco`), como quem pinta com caneta.
- **Letra:** Caveat 700, letra de mão, um pouco torta, escrita da esquerda pra direita.
- **Movimento:** desenha, ferve sempre (nunca fica parado de verdade), balança. Câmera parada.
- **Transição:** cada cena chega numa folha nova que desce por cima (`Folha`).
- **Legenda:** Caveat 700 azul com halo de papel, palavra dita em vermelho, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `Folha` | a página da cena e a transição; tudo da cena vai dentro dela |
| `Caneta` | traço de caneta que se desenha e ferve (passe sempre o `t`) |
| `Rabisco` | zigue-zague que pinta dentro de uma forma; precisa de `id` único |
| `Escrito` | texto à mão que vai sendo escrito |
| `Circulado` | círculo de caneta vermelha em volta do que importa |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde dos novos |

## Pra desenhar coisa nova

Desenhe como um aluno na margem do caderno: contorno simples com `Caneta` (`fechado` pra forma fechada), uma cor em
`Rabisco` por dentro, e no fim um `Circulado` ou uma seta vermelha no ponto principal. Pessoa é bonequinho de palito
feito de `Caneta` (círculo e cinco riscos).

## Evite

- Pintar tudo: o rabisco é pra uma ou duas coisas por cena, o resto fica só no contorno.
- Muita cor: azul manda, vermelho destaca, verde e laranja aparecem pouco.
- Texto pequeno: nada abaixo de 56 de tamanho.
- Desenho na margem esquerda (antes da linha vermelha) ou embaixo, na faixa da legenda.
