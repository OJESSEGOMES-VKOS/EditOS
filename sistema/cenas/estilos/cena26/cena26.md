# cena26: Social post receipt (Post como recibo)

- **Tipo:** 2D
- **A cena que ele resolve:** "olha o que ele disse": a postagem é a prova.
- **Quando a fala pede:** "ele postou", "a frase dele", "comentaram".
- **Completa estes modelos:** documental-dados, youtube-didatico, minidocumentario, especialista.
- **Material e prova:** PROVA: print real do post com link; dado pessoal de terceiro desfocado.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

O post vira prova: um cartão branco e limpo com as palavras da própria pessoa, os números correndo e uma linha
sublinhada em vermelho à mão. É o "olha o que ele disse" dos canais de comentário, sério e legível.

- **Fundo:** cinza claro frio (`#F1F3F6` a `#E7EBF0`) com uma mancha grande e desfocada para dar fundo, e grão fino.
- **Os cartões:** branco puro, tinta `#0F1419`, cinzas `#6B7684` e `#5B6674`, fio `#E3E7EC` em volta, sombra macia em
  camadas. Branco sobre cinza pálido, sem borda dura.
- **Uma cor quente só:** o vermelho `#F4385E` no coração curtido, no número dele e no sublinhado. Mais nada é
  vermelho. O azulzinho do selo `#2B7BF2` e os avatares de iniciais em tons apagados são o resto da cor.
- **Letras:** Inter. Nome em negrito com o selo, arroba e cargo em cinza, o post em 500 grande (~52 px), números em
  largura fixa para não tremerem quando contam.
- **Layout:** uma linha curta de contexto no alto, centrada, em cinza, com a última parte em negrito. O post principal
  ocupa quase toda a largura na faixa do meio. As respostas menores empilham embaixo, cada uma um pouco para um lado,
  sobrepondo a de cima. O quinto de baixo fica vazio (é onde mora a legenda da casa).

**Os movimentos (o vocabulário):**
- **Assenta de um ângulo:** no quadro 1 o cartão já está na tela, inclinado para trás, girado e um pouco grande, no
  meio da mola; em meio segundo ele deita reto.
- **Os números correm:** curtidas, respostas e visualizações sobem rápido e pousam macio.
- **O coração estala:** fica vermelho a 1,25 vez o tamanho e volta, e o número dele vira vermelho junto.
- **As respostas sobem:** vêm de baixo do quadro com mola e borrão, uma de cada vez, e cada pouso empurra a pilha um
  pouco para cima. O like delas conta ao pousar.
- **O sublinhado à mão:** um traço vermelho de borda irregular e ponta inclinada corre embaixo da frase-chave, rápido
  no começo e macio no fim. É o golpe da cena.
- **Recuo lento e pausa:** um afastamento quase imperceptível por baixo de tudo, que termina antes do último segundo
  parado para leitura.

## Como variar (o jeito, não a demo)

- **O post é real.** O cartão é recriado fiel ao print real com origem (G25): o nome, o texto, a data e os números que
  estão lá. Sem o print, a cena não entra.
- **A frase-chave é a que a fala lê ou aponta.** Pode estar no começo, no meio ou no fim do post (`textoAntes`,
  `fraseChave`, `textoDepois`). O sublinhado cai na palavra em que a pessoa diz "olha isso".
- **Respostas:** quantas a fala usa como prova, de 0 a 3. Fala que só mostra o post não ganha resposta de enfeite.
- **A linha de contexto** resume o que a fala diz sobre o post ("Publicou em março. Voltou atrás em abril."), em uma
  ou duas partes. Se a fala não dá contexto, ela some.
- **Frase curta:** só o post assentando, os números e o sublinhado, 2 a 3 s. **Fala longa:** respostas entram uma por
  trecho dito, com uma batida entre elas.
- **Formatos:** palco 4:5 escalado; em 9:16 a sobra de cima e de baixo fica limpa para a legenda; em 16:9 o cartão
  fica no centro, sem esticar, e as respostas podem ir para o lado direito.

## Nunca

- Logo ou nome de rede real desenhado, ou pessoa real sem o print real dela.
- Cartão que aparece esmaecendo: ele assenta e as respostas sobem.
- Número que treme (sempre largura fixa) ou vermelho em qualquer coisa além do coração, do número dele e do traço.
- Sublinhado reto e limpo como uma barra.
- Reaproveitar a pessoa, a empresa, o post ou as respostas da demo (`componente/textos-demo.json`).
- Refazer a coreografia da demo batida a batida (sempre duas respostas, a frase-chave sempre no fim).
