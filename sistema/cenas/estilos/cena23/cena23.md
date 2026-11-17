# cena23: Notification stack (Pilha de notificações)

- **Tipo:** 2D
- **A cena que ele resolve:** resultado chegando: pedidos/vendas caindo na tela.
- **Quando a fala pede:** "vendi", "olha meu celular depois", "os pedidos".
- **Completa estes modelos:** prova-print, anuncio-neon, imagem-por-palavra.
- **Material e prova:** PROVA: só com print/números reais do dono; sem eles o estilo não entra (nunca fabricar).
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

A tela de bloqueio enchendo de pedidos: cada notificação cai na pilha e o total sobe junto. Prova sem frase de efeito:
a pessoa só assiste o resultado chegar.

- **Paleta:** papel de parede escuro de manchas borradas, azul fundo `#0E2A5A` e petróleo `#0F4C5C` sobre quase preto
  `#070A12`, liso e com grão fino. Um acento só, o verde do app `#1FB872`. O resto é branco em intensidades
  diferentes. Sem roxo, sem neon.
- **Letra:** Inter. Linha da data pequena em 600 a ~75% de branco; hora grande em 600 (~200 px), apertada. Título da
  notificação em 600, corpo em 500, o "agora" apagado. Todo número com dígitos de largura fixa.
- **Layout:** tela de bloqueio sem moldura de celular: ilha no alto, sinal, wi-fi, bateria, cadeado, data e hora.
  Embaixo da hora, uma barra fosca: ícone verde do app, "Hoje", a contagem e o total grande à direita. Depois, a
  pilha de cartões foscos largos (ícone do app inventado, nome, "agora", linha do pedido com valor). Quatro cartões
  inteiros; os mais velhos se escondem atrás, menores, mais baixos e mais escuros; uma pílula "+N" embaixo.
- **Textura:** cartões brancos a ~15–18% sobre o fundo, borda fina mais clara, cantos macios; grão fino e parado por
  cima de tudo.
- **Os movimentos (o vocabulário):**
  - **a tela que já lê:** no quadro 1 a hora, a barra e um cartão estão lá. Nada nasce do vazio.
  - **o cartão que cai e empurra:** cada pedido novo cai de cima da pilha, saindo de baixo da barra, numa mola rápida
    com passada pequena, e empurra os outros para baixo.
  - **a cascata que acelera:** os intervalos começam largos (~9 quadros) e apertam (~4): o ritmo vira enxurrada.
  - **o esconde atrás:** do quinto em diante, os velhos encolhem, deslizam para trás do da frente e escurecem um degrau.
  - **o total que rola:** a cada chegada só o dígito que muda rola para cima, com leve borrão vertical; a contagem rola
    junto. Nunca pula.
  - **o fecho:** a pilha assenta, a pílula "+N" salta, e um pedido atrasado chega sozinho. Último segundo parado.

## Como variar (o jeito, não a demo)

- **Só com resultado real do dono** (G7, G10): os valores, a contagem e o total são os dele, com o print ou o
  relatório de origem. Sem isso o estilo não entra (plano B: o número dito em outra resposta). O app é inventado e
  com nome neutro, ou o print fiel do app real (G25), nunca a marca de outro.
- **A notificação é o que a fala diz que chega:** pedido, inscrição, agendamento, mensagem ("Novo agendamento: Corte ·
  14h"). `linhaPedido` e `palavraItens` mudam a linha; sem itens, só o valor.
- **Quantos cartões:** o que a fala sustenta. "Choveu pedido" pede uma enxurrada (10 a 15); "chegaram três
  agendamentos hoje" são três cartões, com intervalos largos e sem pílula "+N". A contagem e o total batem com a soma.
- **Que movimento cai em que palavra:** a cascata começa no verbo ("começou a chegar"); o total pousa no número dito;
  o pedido atrasado é o "e ainda chegou mais um" se a fala tiver; senão, tire.
- **Formatos:** 9:16 é o natural (a tela de bloqueio cabe inteira, a legenda fica sobre o rodapé calmo); em 16:9 a tela
  fica num retrato no meio ou à direita, com o número dito ao lado.

## Nunca

- Cartão que esmaece; dígito que muda de largura; total que pula sem rolar.
- Moldura de celular, logo de fabricante, nome ou ícone de app real que não seja do dono.
- Roxo, neon, papel de parede claro; o mesmo valor em todo cartão.
- Resultado inventado num vídeo de verdade.
- Reusar os números e textos da demo ("Vitrine", "Sexta, 14 de março", "+38 mais", os valores da lista).
