# cena15: Manchete grifada (componente)

Componente: `Cena15.tsx`. Demo: `demo.tsx` (Composition `Demo`, 1080x1350, 30 fps, 150 quadros). Render: `../demo.mp4`.

## Props
`width`, `height`, jornal, dataLinha, edicao, menu, secao, manchete [linhas], autor, autorLinha, capitular, corpo (linhas de trechos; g=true é grifado), postNome, postArroba, postTexto, postNumeros, marcaTexto, inicioGrifo. Todas têm padrão (o conteúdo da demo).

## O que a cena faz
Parede de artigos desfocados que deriva, artigo que voa do canto em inclinação 3D com mola pesada e balanço, travelling até o parágrafo, marca-texto lima com borda irregular e multiply linha a linha, post que entra com passada.

## Formato
Props `width`/`height` (padrão 1080x1350). O palco é desenhado em 1080x1350 e escalado para caber; o fundo preenche o resto.
Serve em 9:16 (1080x1920), 4:5 e 16:9 sem esticar. Duração de referência: 150 quadros a 30 fps (5 s); os tempos internos estão em quadros.
