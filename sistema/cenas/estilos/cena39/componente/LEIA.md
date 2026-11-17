# cena39 · componente

`Cena39.tsx`: componente Remotion, tudo desenhado em código (SVG, filtros, sem imagem externa).
Pensado num palco 1080x1350 que escala para cobrir qualquer tamanho (`width`/`height`): em 9:16 corta as laterais,
em 16:9 corta em cima e embaixo. A linha do tempo é de 150 quadros e estica com `durationInFrames`.

**Props:** rotuloQuadro (vazio = sem), legenda (o único cartão, a palavra dita; vazio = sem cartão; o cartão cresce com a palavra), corTerno [base, sombra, lapela], corGravata, width, height.

O escritório, o quadro e o gráfico que cai são a história da demo: numa história nova o lugar, o objeto e a ação se redesenham (veja `../cena39.md`, Como variar); corpo, poses, mãos, papéis que caem, cartão e tempos se reaproveitam. Os textos da demo estão em `textos-demo.json`.

**Conferido:** escritório plano, gráfico subindo ponto a ponto, quadro racha e balança num pino, zigue-zague vermelho, pânico (olhos, braços, suor), bilhetes caindo, cartão com sombra azul dura, último segundo parado.
