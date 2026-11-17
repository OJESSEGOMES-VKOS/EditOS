# cena45 · componente

`Cena45.tsx`: componente Remotion, tudo desenhado em código (SVG, filtros, sem imagem externa).
Pensado num palco 1080x1350 que escala para cobrir qualquer tamanho (`width`/`height`): em 9:16 corta as laterais,
em 16:9 corta em cima e embaixo. A linha do tempo é de 150 quadros e estica com `durationInFrames`.

**Props:** `legenda` (a frase manuscrita do topo; sem ela, topo vazio), `diaFinal` e `palavraDia` (o calendário só aparece com `diaFinal`; folhas arrancam do 1 até ele), `copos` (quantos copos voam pra pilha; 0, o padrão, é sem pilha), `corParede`, `corMoletom`, `width`, `height`. O fundador, o calendário e os copos são da demo: fala nova pede outros objetos que acumulam e contam (`../cena45.md`, Como variar). Os textos da demo estão em `textos-demo.json`.

**Conferido:** traço marrom grosso tremido, textura de pincel seco, copos lançados com amassadinho e pilha que balança, folhas do calendário arrancando devagar e depois em corrida até DIA 100 vermelho, sobrancelhas de determinado a preocupado, careta e suor, último segundo parado.
