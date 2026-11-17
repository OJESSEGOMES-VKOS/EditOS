# Madeira 3D

**Tipo:** 3D edição
**Cara:** Brinquedos de madeira torneada e pintada num disco que gira devagar, tinta fosca com o veio aparecendo, cantos arredondados e sombra macia.
**Bom pra:** infantil, explicação calma, família, educação, produto artesanal, "como funciona" com aconchego.

## Como é

- **Fundo:** estúdio creme, parede que vira chão sem quina, luz suave do alto. Não muda.
- **Palco:** um disco de madeira crua (`Giradisco`). Os brinquedos ficam em cima dele.
- **Volume:** 3D calculado no Remotion: cada peça tem posição no mundo, a câmera **gira sem parar** em volta do disco
  (devagar), a luz vem do alto à esquerda e toda peça faz sombra macia e borrada no chão.
- **Material:** madeira pintada fosca (sem reflexo de plástico), com o veio da madeira (o filtro `madeira-3d-veio`)
  por cima de tudo. Peças torneadas: bola, pino, cone, cubo de canto arredondado.
- **Cores:** tinta de brinquedo um pouco apagada (`COR`): vermelho, amarelo, azul, celeste, verde, laranja, creme;
  `pinho` e `nogueira` são a madeira crua.
- **Coisas no ar** (sol, nuvem) ficam espetadas num pino de nogueira, como brinquedo de encaixe.
- **Letra:** Bree Serif, tanto na `Placa` (título com espessura) quanto na legenda e nos blocos de alfabeto.
- **Movimento:** peças brotam com mola, ondas sobem e descem, e o giro da câmera nunca para.
- **Transição:** uma tábua de madeira desce pela tela e leva a cena (`Tabua`, dentro do `Giradisco`).
- **Legenda:** Bree Serif marrom com contorno creme, palavra dita em vermelho, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `useCam(t, giro, cy, vel)` | a câmera que gira em volta do disco |
| `Giradisco` | o disco, a ordem das peças, as sombras, o veio, a entrada e a tábua da saída |
| `bolaM`, `pino`, `cone`, `cubo` | as peças torneadas; `cubo` com `letra` vira bloco de alfabeto |
| `Placa`, `Tabua` | título de madeira e a transição |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde pros novos |

## Pra desenhar coisa nova

Pense em brinquedo de madeira de loja de artesanato: tudo é bola, pino, cone ou cubo encaixado. Pessoa é um pino com
uma bola de cabeça; casa é um cubo com um cone; carro é um cubo comprido (dois cubos) com quatro bolas pretas. Posição
no mundo `[x, y, z]`, y pra cima, chão do disco em 0, disco com raio 350. Coisa no ar vai espetada num `pino`.

## Evite

- Brilho de plástico ou cor neon: a madeira é fosca e a tinta é calma.
- Peça fora do disco (raio maior que 350): ela some no giro.
- Parar a câmera: o giro lento é a assinatura do estilo.
- Texto pequeno: nada abaixo de 56. Texto no topo, nunca na faixa da legenda.
