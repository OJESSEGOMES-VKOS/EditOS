# cena43 · componente

`Cena43.tsx`: componente Remotion, tudo desenhado em código (SVG, filtros, sem imagem externa).
Pensado num palco 1080x1350 que escala para cobrir qualquer tamanho (`width`/`height`): em 9:16 corta as laterais,
em 16:9 corta em cima e embaixo. A linha do tempo é de 150 quadros e estica com `durationInFrames`.

**Props:** anoInicial, anoFinal, rotuloAno, frase, width, height.

**Conferido:** janela de cinema, rampa de fogo, buraco negro com anel fino, estrela que estica e rasga, fluxo que fecha o anel, legenda com o ano rolando e a frase entrando, tempo desacelerando até parar.
