# cena42 · componente

`Cena42.tsx`: componente Remotion, tudo desenhado em código (SVG, filtros, sem imagem externa).
Pensado num palco 1080x1350 que escala para cobrir qualquer tamanho (`width`/`height`): em 9:16 corta as laterais,
em 16:9 corta em cima e embaixo. A linha do tempo é de 150 quadros e estica com `durationInFrames`.

**Props:** rotulo, corCabelo, corCeu, width, height.

**Conferido:** traço fino com tremor (boil a cada 3 quadros, parado no fim), palco de lado, rajada com objetos cada vez mais rápidos e traços de velocidade, mãos na cabeça, celular com X vermelho em dois traços, dar de ombros.
