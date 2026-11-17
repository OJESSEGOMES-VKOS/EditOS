# cena41 · componente

`Cena41.tsx`: componente Remotion, tudo desenhado em código (SVG, filtros, sem imagem externa).
Pensado num palco 1080x1350 que escala para cobrir qualquer tamanho (`width`/`height`): em 9:16 corta as laterais,
em 16:9 corta em cima e embaixo. A linha do tempo é de 150 quadros e estica com `durationInFrames`.

**Props:** origem, destino (os nomes ditos; vazio = sem nome), cartaoTitulo, cartaoData (os dois vazios = sem cartão), `mapa` (`Mapa41`: `terra`, `regiao`, `mascaraRegiao`, `fronteira`, `capital`, `destino`, `rotaTerra`, `rotaMar`, num plano 1600x1600; padrão `MAPA_FICTICIO`; sem `destino`, sem rota), corRegiao, width, height. Nenhum texto tem padrão. O cartão fica fixo na tela (left 470, top 800 do palco); mova na cópia se cobrir o lugar. O selo gravado (a torre) é desenho da demo: redesenhe o emblema do assunto. Os textos da demo estão em `textos-demo.json`. Como compor uma cena nova: `../cena41.md`.

**Conferido:** relevo procedural iluminado do oeste, grade branca no mar, região com contorno vermelho já aceso, inundação vermelha a partir da capital, cartão gravado que cai e assenta, rota neon tracejada sobre a água, anel no destino, nomes em giz.
