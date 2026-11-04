# cena19: Linha do tempo (componente)

Componente: `Cena19.tsx`. Demo: `demo.tsx` (Composition `Demo`, 1080x1350, 30 fps, 150 quadros). Render: `../demo.mp4`.

## Props
`width`, `height`, kicker, titulo, tituloAzul, anoInicial, anoFinal, pontos [{ano,titulo,linha,icone}] (o último é o HOJE), seloAgora, azul. Todas têm padrão (o conteúdo da demo).

## Formato
Props `width`/`height` (padrão 1080x1350). O palco é desenhado em 1080x1350 e escalado para caber; o fundo preenche o resto.
Serve em 9:16 (1080x1920), 4:5 e 16:9 sem esticar. Duração de referência: 150 quadros a 30 fps (5 s); os tempos internos estão em quadros.
