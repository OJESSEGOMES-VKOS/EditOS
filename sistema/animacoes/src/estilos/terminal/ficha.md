# Terminal

**Tipo:** 2D
**Cara:** Tela de computador antigo em fósforo verde, onde todo desenho é feito de letras e símbolos.
**Bom pra:** tecnologia, programação, dados, mistério, "como funciona por dentro".

## Como é

- **Fundo:** preto esverdeado com um brilho leve no meio, como tubo de imagem apagado.
- **Cores:** fósforo verde (`COR.verde`), verde quase branco pro texto grande (`COR.claro`), verde escuro pra chão e coisa de fundo, e o âmbar só pro que é quente ou importante (o sol, um alerta).
- **Forma:** não existe traço. Cada desenho é um campo de claro e escuro, e cada ponto vira um caractere: vazio é espaço, meio é `:` ou `+`, cheio é `#` ou `@`.
- **Movimento:** o desenho é impresso de cima pra baixo com uma linha de `#` na frente; depois o campo mexe (raio gira, onda corre, chuva cai).
- **Letra:** JetBrains Mono em tudo.
- **Texto:** dentro da janela do terminal, depois de um `$ comando`, digitado com cursor de bloco piscando.
- **Transição:** a varredura, uma barra verde que desce e apaga a tela.
- **Por cima de tudo:** linhas de varredura e a borda escura do tubo (`Tubo`).
- **Legenda:** JetBrains Mono 800, verde, palavra dita em verde claro, com halo preto, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `Letras` | pinta uma caixa com caracteres a partir de um campo de brilho; `p` imprime de cima pra baixo |
| `Prompt` | a janela do terminal com o comando e o texto grande digitado |
| `cursor` | o bloco █ que pisca |
| `Tubo` | linhas de varredura e borda escura; vai por último em toda cena |
| `Varredura` | a transição: barra que desce e limpa a tela |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde pros novos |

## Pra desenhar coisa nova

Escreva um campo: uma conta que recebe x e y (de 0 a 1 dentro da caixa) e devolve o brilho de 0 a 1. Forma redonda é
distância até o centro; forma cheia devolve 1 dentro e 0 fora; borda que esmaece usa `Math.exp`. Passe o campo pra
`Letras` com a caixa em volta do objeto. Use o tempo `t` dentro da conta pra ele mexer. Objeto grande lê melhor:
caixa de pelo menos 300 de largura.

## Evite

- Objeto pequeno demais: com poucas células vira borrão de letras.
- Cor fora do verde e do âmbar.
- Contorno fino: aqui a forma é cheia, feita de claro e escuro.
- Esquecer o `Tubo` no fim da cena: sem ele a tela perde a cara de monitor.
