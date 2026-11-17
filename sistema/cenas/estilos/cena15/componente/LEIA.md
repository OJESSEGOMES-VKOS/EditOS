# cena15: Manchete grifada (componente)

Componente: `Cena15.tsx`. Demo: `demo.tsx` (Composition `Demo`, 1080x1350, 30 fps, 150 quadros). Render: `../demo.mp4`.

## Props
`width`, `height`, jornal, dataLinha, edicao, menu, secao, manchete [linhas], autor, autorLinha, capitular, corpo (linhas de trechos; g=true é grifado), postNome, postArroba, postTexto, postNumeros, marcaTexto, inicioGrifo. manchete e corpo são obrigatórios; o
resto é opcional e vazio por padrão (sem `postTexto`, o post não entra; sem `postNumeros`, a linha de números não entra).
Num vídeo real, tudo vem do print real com origem (G25). Os textos da demo moram só no `demo.tsx` e em
`textos-demo.json`; nunca voltam num vídeo (teste do clone).

## O que a cena faz
Parede de artigos desfocados que deriva, artigo que voa do canto em inclinação 3D com mola pesada e balanço, travelling até o parágrafo, marca-texto lima com borda irregular e multiply linha a linha, post que entra com passada.

## Formato
Props `width`/`height` (padrão 1080x1350). O palco é desenhado em 1080x1350 e escalado para caber; o fundo preenche o resto.
Serve em 9:16 (1080x1920), 4:5 e 16:9 sem esticar. Duração de referência: 150 quadros a 30 fps (5 s); os tempos internos estão em quadros.
