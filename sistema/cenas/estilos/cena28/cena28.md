# cena28: Versus (Versus)

- **Tipo:** 2D
- **A cena que ele resolve:** comparação lado a lado, item por item, com vencedor.
- **Quando a fala pede:** "X ou Y", "comparando", "qual é melhor".
- **Completa estes modelos:** youtube-didatico, prova-print, rosto-telas, autoridade.
- **Material e prova:** critérios e resultados reais (ditos ou com prova).
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

O placar de luta da TV aplicado a uma decisão: duas opções frente a frente numa tela dividida, comparadas linha a
linha, com barras que nascem do meio para fora e um check para quem ganha cada linha. Resolve "X ou Y" em segundos.

- **Fundo:** quase preto `#0B0D12` nas duas metades, cortado por uma costura escura levemente inclinada. Cada lado
  ganha cor só de luz bem baixa: azul frio entrando pela esquerda, laranja quente pela direita. O lado quente é
  carvão morno, nunca marrom. Grão fino e fixo.
- **Duas cores com dono:** azul `#3D7BFF` é sempre a opção da esquerda, laranja `#FF7A30` sempre a da direita. Só
  nas barras, nos traços sob os nomes e nos chips de check. Nada de terceira cor.
- **Letras:** os dois nomes enormes em Anton branco (o da esquerda alinhado à esquerda, o da direita à direita). O
  resto em Barlow Condensed: valores em 700 com números de largura fixa, rótulos das linhas em 600 caixa alta
  espaçada, a linha de contexto em 500 cinza `#8F96A5`.
- **Layout:** nomes no alto, cada um sobre um traço da sua cor; um selo redondo branco VS, metade azul metade laranja
  no aro, em cima da costura; a linha de contexto embaixo. Depois as linhas: rótulo pequeno centrado, valor da
  esquerda encostado no centro pela esquerda, o da direita pela direita, e a barra grossa embaixo saindo do centro,
  com um trilho apagado atrás.
- **A linha final é o desfecho:** valores um degrau maiores, barra e chip mais grossos, e uma placa com contorno fino
  na cor de quem venceu, que fica até o fim.

**Os movimentos (o vocabulário):**
- **Os nomes batem:** já estão na tela no quadro 1, grandes demais, e assentam cada um vindo do seu lado numa mola
  rápida; os traços se desenham do centro para fora.
- **O VS estoura:** uma batida depois, cresce de 60% com passo além enquanto o giro assenta.
- **A linha monta:** o rótulo salta de uma máscara, a barra dispara do centro para fora com ponta clara enquanto
  corre, os números contam junto com a barra.
- **O veredito:** o chip de check salta ao lado de quem ganhou e o valor de quem perdeu apaga para o cinza. Linha de
  sim ou não: barra cheia para quem ganha, vazio para o outro.
- **O desfecho:** a última linha corre mais e mais forte, o número cresce ao pousar, um brilho passa pela barra, o
  chip salta girando, o lado vencedor acende um instante e a placa abraça a linha.
- **A pausa:** tudo parado bem antes do fim.

## Como variar (o jeito, não a demo)

- **As linhas são os critérios que a fala cita,** de 1 a 4, na ordem em que são ditos. Fala com dois critérios tem
  duas linhas; o desfecho é sempre o último critério dito, não "o patrimônio" por hábito.
- **Cada linha entra na palavra que a cita** (`inicios`), não a cada 13 quadros. Comparação falada devagar tem
  linhas mais espaçadas; rápida, mais juntas.
- **Os nomes são as duas opções como foram ditas,** curtas (uma palavra, no máximo duas). O tamanho se ajusta ao nome
  mais longo.
- **Valores como foram ditos:** número (`formato` decide "R$", "%", "h"), ou texto curto ("Sim", "Grátis", "2 dias").
  Quem vence cada linha é o que a fala conclui, e pode ser a esquerda no desfecho.
- **Frase curta:** só os nomes, o VS e uma linha de desfecho, 2 a 3 s. **Fala longa:** até quatro linhas; mais que
  isso, divida em duas cenas.
- **Formatos:** palco 4:5 escalado; em 9:16 as linhas ganham ar e a legenda da casa fica embaixo; em 16:9 os nomes
  ficam nas pontas e as linhas no meio, com as barras mais curtas.

## Nunca

- Esmaecer: nome bate, barra cresce, texto salta da máscara, chip estoura.
- Barra que não nasce no centro ou que não bate com o número; misturar as duas cores no mesmo lado.
- Brilho neon, degradê nas barras, terceira cor; mais de quatro linhas ou rótulo de duas linhas.
- Resultado inventado: os critérios e os números são os reais, ditos ou com prova.
- Reaproveitar "alugar ou comprar" ou qualquer texto da demo (`componente/textos-demo.json`), ou repetir as quatro
  linhas com o desfecho laranja quando a fala pede outra comparação.
