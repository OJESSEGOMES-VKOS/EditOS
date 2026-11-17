# cena37 — Rosca de partes: componente

Props: `titulo`, `contexto`, `prefixo` (ex.: R$), `sufixo` (ex.: %), `rotuloCentro`, `fatias[]` (2 a 7, quantas a fala citar), `heroi` (índice da fatia da história; padrão a última), `passo` (quadros entre fatias, padrão 10), `corHeroi`. Nenhum texto tem padrão: tudo vem da fala. Os textos da demo estão em `textos-demo.json` e não vão para vídeo novo. Como compor uma cena nova: `../cena37.md` (A personalidade, Como variar).

O que tem: SVG 2D: fatias varrem com mola a cada 10 quadros, anel 'bate' para fora no pouso, total soma em algarismos tabulares, linha da legenda salta com o pouso; a fatia herói sai 26 px com sombra, as outras clareiam e a linha herói ganha a pílula verde.
