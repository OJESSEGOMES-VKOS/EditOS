# cena22: Isometric flow (Fluxo isométrico)

- **Tipo:** 3D edição (feito no Remotion com perspectiva/CSS 3D ou three.js, sem Blender)
- **A cena que ele resolve:** como um sistema funciona em etapas.
- **Quando a fala pede:** "primeiro... depois...", "o processo", "o caminho do".
- **Completa estes modelos:** motion-ouro, personagem, documental-dados, youtube-didatico; mecanismo físico detalhado: 3d-como-funciona (Blender).
- **Material e prova:** o sistema faz tudo.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Uma maquete isométrica limpa numa laje de cantos redondos: cada etapa de um processo sobe do chão, ganha uma etiqueta
numerada, e alguma coisa viaja pela estrada entre elas. É o "como funciona" de canal explicativo, em um plano só.

- **Paleta:** fundo quase branco frio `#EEF2F7` em cima a `#E3E9F1` embaixo; laje branca `#F7F9FC` (laterais um tico
  mais escuras); estrada ardósia `#3A4458` com tracejado branco. Uma cor por etapa: menta `#36C39A`, azul `#3B6CF6`,
  coral `#FF6A4D`. Ardósia `#2B3445` em portas, janelas e rodas; branco em telhados e etiquetas. Sem dourado, sem
  marrom.
- **Letra:** Inter Tight. Título em 800, apertado, ardósia, uma linha em cima. Cada etiqueta é uma pílula branca: chip
  azul com o número, a palavra da etapa em 700, um tempo pequeno cinza embaixo.
- **Layout:** a laje é um losango que ocupa a largura, em isométrico reto (sem perspectiva). A estrada faz zigue-zague
  ligando as etapas da esquerda para a direita; cada prédio fica atrás da estrada com a porta virada para ela;
  etiquetas acima de cada prédio, escalonadas para nunca se tocarem. Título em cima, quinto de baixo vazio.
- **Textura:** blocos foscos de brinquedo, cantos levemente arredondados, um sol macio (sombra suave, escurecido onde a
  parede encontra o chão), grão fraco no fundo. Sem contorno, sem brilho.
- **Os movimentos (o vocabulário):**
  - **a maquete já pronta:** no quadro 1 a laje, a estrada, as árvores e o veículo estão lá, câmera um pouco mais perto
    e já andando.
  - **o prédio que brota:** cada etapa sobe do chão rápido, passa um pulinho da altura e pousa com um amassadinho, 1/3
    de segundo depois da anterior. A etiqueta estoura 1/5 de segundo depois, com passada pequena.
  - **a faixa que se desenha:** o tracejado da estrada se desenha da primeira etapa até a última.
  - **o vai e vem com batida:** a coisa que o processo move (na demo, caixas e uma van) anda em batidas distintas (cada
    caixa um pulo, a van afunda na mola a cada uma), sai, faz as curvas e freia com mergulho na última etapa.
  - **o check:** o número da última etiqueta salta e vira um check verde. A câmera orbita ~6° e recua, parada em 4 s;
    o último 2/3 de segundo é totalmente parado.

## Como variar (o jeito, não a demo)

- **As etapas são as ditas, na ordem e no número da fala** ("o cliente agenda, a gente confirma, ele vem, paga e
  volta" são cinco, não três). Cada etapa é um bloco que diz o que ela é (agenda = um prédio com calendário na
  fachada, consultório = uma casa com cruz), feito com a mesma caixa isométrica. O que viaja é o que a fala move (um
  pedido, uma pessoa, dinheiro), nunca a van por hábito.
- **O componente é a referência de 3 etapas de entrega.** Com outro número de etapas ou outros objetos, recomponha no
  vídeo com as mesmas primitivas (caixa de 3 faces, ordem do pintor, estrada, etiqueta-pílula) e uma cor por etapa
  (acima de 3, alterne as três cores ou use tons da casa, nunca um arco-íris).
- **Que movimento cai em que palavra:** cada prédio brota no nome da etapa; o viajante sai no verbo de movimento
  ("leva", "manda"); o check cai no resultado ("e pronto", "chegou"). Fala curta: 2 etapas e o check. Fala longa: até 5
  etapas, a estrada mais comprida, sem etiqueta encostando.
- **Formatos:** em 9:16 a laje gira para ficar mais alta que larga (estrada em S vertical); em 16:9 a laje se estica na
  horizontal e o título vai para a esquerda.

## Nunca

- Câmera em perspectiva: é ortográfica, para ler como diagrama.
- Prédio ou etiqueta que esmaece: eles sobem, estouram e desenham.
- Etiqueta sobre etiqueta ou escondendo a curva da estrada; mais de uma palavra e um tempo por etiqueta.
- Degradê nos objetos, neon, brilho, cor extra.
- Reusar a história da demo (pedido, embala, entrega, van com caixas, "Como o pedido chega até você") ou as três
  etapas por hábito.
