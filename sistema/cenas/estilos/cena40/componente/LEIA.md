# cena40 · componente

`Cena40.tsx`: componente Remotion, tudo desenhado em código (SVG, filtros, sem imagem externa).
Pensado num palco 1080x1350 que escala para cobrir qualquer tamanho (`width`/`height`): em 9:16 corta as laterais,
em 16:9 corta em cima e embaixo. A linha do tempo é de 150 quadros e estica com `durationInFrames`.

**Props:** rotuloPortao, rotuloVeiculo, rotuloDestino ({nome, hora}; cada um só aparece se for passado, sem texto padrão), corGelo, corDestaque, width, height.

A maquete (`BOXES`, `SITE`, `ROUTE`, `GATE`, `DOCK` no topo do arquivo) é o lugar da demo: num lugar novo, copie o componente para a pasta do vídeo e troque essas listas (veja `../cena40.md`, Como variar). Os textos da demo estão em `textos-demo.json`.

**Conferido:** maquete em azul-gelo com projeção 3D própria, órbita de ~35° que para em 4 s, varredura que deixa o veículo vermelho, poça de luz vermelha, rota vermelha do portão à doca com anel, três rótulos mono em fio fino no preto, último segundo parado.
