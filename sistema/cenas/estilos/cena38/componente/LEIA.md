# cena38 · componente

`Cena38.tsx`: componente Remotion, tudo desenhado em código (SVG, filtros, sem imagem externa).
Pensado num palco 1080x1350 que escala para cobrir qualquer tamanho (`width`/`height`): em 9:16 corta as laterais,
em 16:9 corta em cima e embaixo. A linha do tempo é de 150 quadros e estica com `durationInFrames`.

**Props:** rotulo (a palavra dita; vazio = sem pílula), corCristal [aceso, meio, sombra], corInterior [laranja, amarelo], corEspaco [topo, base], width, height.

O objeto central (o cristal) é desenho da demo: num assunto novo ele se redesenha (veja `../cena38.md`, Como variar); céu, ilha, pedestal, cabos, camadas e tempos se reaproveitam. Os textos da demo estão em `textos-demo.json`.

**Conferido:** paleta, ilha de grade, cristal que racha e abre em duas metades com mola, núcleo que acende com órbitas e pontinhos, pílula, pedestal virando quente e energia saindo pelos cabos, último segundo parado.
