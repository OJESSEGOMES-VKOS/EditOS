# cena44 · componente

`Cena44.tsx`: componente Remotion, tudo desenhado em código (SVG, filtros, sem imagem externa).
Pensado num palco 1080x1350 que escala para cobrir qualquer tamanho (`width`/`height`): em 9:16 corta as laterais,
em 16:9 corta em cima e embaixo. A linha do tempo é de 150 quadros e estica com `durationInFrames`.

**Props:** `rotulo` (uma palavra dita; sem ela, nenhum rótulo), `horaAntes` e `horaDepois` (o relógio de virar só aparece com os dois, números como foram ditos), `corRoupa`, `corContorno`, `width`, `height`. O quarto, a janela, a luminária e a pose são da demo e moram no código: fala nova pede outro lugar e outro objeto (`../cena44.md`, Como variar). Os textos da demo estão em `textos-demo.json`.

**Conferido:** quarto ameixa, pôr do sol com cidade e janelas acendendo em 3 grupos, luminária com poeira, relógio de virar 21:59→22:00 com pulinho, cabeça vira e olhos abrem, piscada, grão e vinheta, último segundo parado.
