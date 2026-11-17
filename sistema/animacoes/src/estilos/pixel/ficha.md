# Pixel de videogame

**Tipo:** 2D
**Cara:** Jogo antigo de 16 bits: tudo feito de quadradinhos, céu em faixas pontilhadas e texto digitado numa caixa de diálogo.
**Bom pra:** curiosidade, tecnologia, passo a passo com cara de fase de jogo, público jovem.

## Como é

- **Fundo:** céu em cinco faixas de azul, com pontilhado em xadrez entre uma e outra, e chão azul-marinho embaixo (onde mora a legenda).
- **Cores:** só a paleta fechada `COR` (azuis, branco, amarelo, laranja, verdes, terra, cinzas). Cor fora dela quebra a cara.
- **Forma:** blocos quadrados numa grade (`PX`, 10 numa tela de 1080). Nada de curva lisa, nada de borda suave.
- **Movimento:** aos saltos de pixel. Tudo que anda passa pela grade, então move em degraus, como no jogo. Coisa que nasce se monta bloco a bloco.
- **Letra:** Press Start 2P na caixa de diálogo e nos títulos; Pixelify Sans na legenda.
- **Transição:** o mosaico, blocos grandes que cobrem a tela na diagonal no fim da cena e descobrem a próxima.
- **Legenda:** Pixelify Sans 700, branca com contorno escuro duro, palavra dita em amarelo, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `Pixels` | a camada de quina dura; todo retângulo solto vai dentro dela |
| `Sprite` | desenho feito de texto (cada letra uma cor), que se monta na diagonal com `p` |
| `Disco` | círculo cheio de blocos, que cresce do centro |
| `Digitado` | texto de jogo que se digita letra a letra, com o ▼ piscando no fim |
| `CaixaDialogo` | a caixa azul de borda branca do RPG, que abre de cima pra baixo |
| `Mosaico` | a transição: `entra` no começo da cena, `sai` no fim |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde pros novos |

## Pra desenhar coisa nova

Desenhe como um `Sprite`: uma lista de linhas de texto, cada letra uma cor, ponto é vazio. Pense em 6 a 14 pixels
de largura e aumente com `escala`. Forma redonda é `Disco`; faixa reta é `rect` dentro de `Pixels`, com a posição
passada pela grade. Pessoa é um boneco de silhueta simples (cabeça, tronco, pernas), nunca personagem de jogo que existe.

## Evite

- Personagem, tela, fonte ou som de jogo que já existe.
- Movimento liso e curvas suaves: aqui tudo anda em degrau.
- Sombra borrada, degradê liso, transparência demais.
- Texto pequeno: Press Start é larga, use frases curtas (até 16 letras por linha) e nunca abaixo de 56.
