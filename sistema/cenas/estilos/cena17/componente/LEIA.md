# cena17: Celular com app (componente)

Componente: `Cena17.tsx`. Demo: `demo.tsx` (Composition `Demo`, 1080x1350, 30 fps, 150 quadros). Render: `../demo.mp4`.

## Props
`width`, `height`, saudacao, nome, rotuloSaldo, saldoInicial, saldoFinal, delta, deltaLinha, linhas [{nome,sub,valor,positivo}], notifTitulo, notifTexto, statRotulo, statValor, statDelta, metaTitulo, metaTexto, metaPct, acento, acentoClaro. Todas têm padrão (o conteúdo da demo).

## O que a cena faz
Celular em CSS 3D com espessura e brilho na borda gira para três quartos com mola pesada; sombra no chão alarga; saldo conta em dígitos tabulares, gráfico desenha com ponto na ponta, chip pula, linhas sobem; três cartões, um a cada ~0,5 s: notificação sai da pílula da câmera, cartão de número cresce do chip, meta nasce de um disco; flutuação com paralaxe no fim.

## Formato
Props `width`/`height` (padrão 1080x1350). O palco é desenhado em 1080x1350 e escalado para caber; o fundo preenche o resto.
Serve em 9:16 (1080x1920), 4:5 e 16:9 sem esticar. Duração de referência: 150 quadros a 30 fps (5 s); os tempos internos estão em quadros.
