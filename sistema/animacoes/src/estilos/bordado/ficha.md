# Bordado

**Tipo:** 2D
**Cara:** Ponto-cruz num bastidor de madeira sobre linho; cada desenho é costurado ponto a ponto, com a agulha indo atrás.
**Bom pra:** história de família, receita, conselho, memória, assunto calmo e afetivo.

## Como é

- **Fundo:** toalha de linho com trama fina. No alto, o bastidor de madeira com o pano esticado; o pano pode ser tingido (`TECIDO`: cru, céu, nublado, noite, campo).
- **Cores:** linhas de meada firmes (`LINHA`): azul, céu, amarelo, laranja, vermelho, verde, verde claro, marrom, branco, cinza, tinta.
- **Traço:** tudo vira pontos em X numa grade (`Costura`). Corpo é preenchido em fileiras; coisa fina é ponto seguindo a linha.
- **Movimento:** a costura avança ponto a ponto com a agulha e a linha no ponto da vez. Coisa que anda (chuva, onda, vapor) pula de casa em casa na grade.
- **Letra:** DM Serif Display, com a costura tracejada de "ponto atrás" embaixo; rótulo em Playfair Display itálico vermelho.
- **Transição:** um pano novo, da cor da cena seguinte, desce esticado por cima do bordado (`PanoNovo`).
- **Legenda:** DM Serif Display escura, palavra dita em vermelho, halo claro de linho, a 72% da altura.

## As peças

| Peça | O que faz |
|---|---|
| `Bastidor` | o aro com o pano (cor em `tecido`); tudo que é bordado vai dentro e fica preso ao círculo |
| `useAro` | o centro, o raio e o tamanho da casa da grade, pra desenhar em proporção ao bastidor |
| `Costura` | borda uma lista de formas ponto a ponto (`p` de 0 a 1), com a agulha |
| `Cruz`, `pontosDe` | um ponto em X e a conversão de forma em pontos da grade |
| `Letreiro` | texto com a costura tracejada embaixo, que aparece da esquerda pra direita |
| `PanoNovo` | a transição |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde pros novos |

## Pra desenhar coisa nova

Pense no risco de bordado de revista: contornos grandes e simples, uma cor por parte. Monte a lista de formas
(`{pts, cor}` pra corpo cheio, `{pts, cor, linha: true}` pra traço) e passe pra uma `Costura`. Desenhe com o tamanho
do raio do bastidor (`useAro().r`): forma com menos de três casas de largura some na grade. Costure as partes em
fila, uma `Costura` por parte, com `p` escalonado.

## Evite

- Detalhe menor que duas casas da grade: não aparece.
- Linha da mesma cor do pano (branco no cru, azul-escuro na noite).
- Desenho fora do bastidor: o bordado mora dentro do aro; fora dele, só o texto.
