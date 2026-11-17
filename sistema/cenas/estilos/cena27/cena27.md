# cena27: Day counter (Contador de dias)

- **Tipo:** 2D
- **A cena que ele resolve:** desafio, sequência, "30 dias de", construção em público.
- **Quando a fala pede:** "dia 1", "há 30 dias", "todo dia".
- **Completa estes modelos:** prova-print, ojg, youtube-didatico, imagem-por-palavra.
- **Material e prova:** número do dia como dito.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Um placar de desafio: uma palavra vermelha enorme, um número que roda como hodômetro e um calendário de parede que
se enche de checks feitos a caneta. Transforma "fiz isso todo dia" em um segundo de prova limpa.

- **Fundo:** branco que desce para um cinza neutro quase invisível (`#FFFFFF` a `#F3F3F1`), com grão de papel bem
  fino. Nada bege, marrom ou dourado.
- **Um vermelho só:** `#E5383B` na palavra grande, em todo check e no círculo final. O número e o mês em quase preto
  `#111111`. Cinzas pequenos para rótulo (`#8F8F8B`) e datas (`#74746F`).
- **Letras:** Anton (a pesada e estreita) para a palavra, o número e o mês; a palavra e o número têm uns 340 px e
  enchem a largura. Inter 700 em caixa alta espaçada para o rótulo e as datas.
- **Layout:** rótulo cinza pequeno no alto, centrado entre dois fios. O contador logo abaixo, o maior possível. Embaixo,
  um cartão branco de calendário com cantos redondos, sombra macia e dois pinos escuros saindo do topo (é um
  calendário de parede), o mês no canto, as iniciais da semana e a grade de 7 colunas com quadrinhos arredondados.
- **Textura:** chapada e nítida. Sem contorno, sem brilho, sem degradê no vermelho.

**Os movimentos (o vocabulário):**
- **Abre já lendo:** o primeiro quadro é o dia 1 com o primeiro quadrinho marcado.
- **As batidas do começo:** os primeiros dias sobem um por vez, com pausa e um passinho além. Cada dia é um tique.
- **A corrida:** no meio o hodômetro acelera num borrão vertical e os checks enchem a grade numa onda só.
- **A casa da dezena:** quando chega a 10, o dígito novo entra e a palavra vermelha desliza para abrir espaço.
- **O freio:** os últimos três dias voltam a ser batidas. A curva devagar-rápido-devagar é o estilo.
- **O check à mão:** cada quadrinho ganha um traço vermelho meio torto, desenhado na hora em que o contador passa, e
  fica rosado. Nunca aparece esmaecendo.
- **O pouso:** no último dia o número passa e volta, o cartão dá um soquinho (cresce um pouco e volta) e um círculo
  vermelho solto é desenhado em volta da data. Depois, tudo parado.

## Como variar (o jeito, não a demo)

- **O número é o que a fala diz.** "Dia 12 de 30" pousa no 12 (`ate`) com o resto da grade vazia; "uma semana" é um
  calendário de 7 com batidas só (contagem até 8 vira só batidas, sem corrida). O mês e onde ele começa são os reais
  (`inicioSemana`).
- **A palavra vermelha é a unidade dita:** "DIA", "TREINO", "POST", "SEMANA"; o rótulo é o que a pessoa faz, nas
  palavras dela.
- **O pouso cai na palavra do número.** `fimQuadro` leva o contador a pousar no quadro em que o número é falado; o
  ritmo inteiro escala junto.
- **Sem calendário:** contagem que não é de dias (vendas, quilos) não é esse estilo; use a cena16 ou a cena36.
- **Frase curta:** pouso rápido (`fimQuadro` 40 a 50), 2 a 3 s com a pausa. **Frase longa:** pouso mais tarde, mas
  as batidas do começo e do fim continuam secas.
- **Formatos:** palco 4:5 escalado; em 9:16 sobra limpo em cima e embaixo para a legenda da casa; em 16:9 o contador
  pode ficar à esquerda e o calendário à direita (recomponha os dois blocos lado a lado).

## Nunca

- Check esmaecendo: ele é desenhado como traço.
- Contador em velocidade constante, ou sem as batidas do começo e do fim.
- Segunda cor de destaque, brilho no vermelho, sombra na letra grande.
- Número parado enquanto a grade enche: os dois andam juntos.
- Contar um número que a pessoa não fez de verdade.
- Reaproveitar o rótulo, o mês ou o "30 de 30" da demo (`componente/textos-demo.json`) quando a fala é outra, ou
  refazer a demo batida a batida.
