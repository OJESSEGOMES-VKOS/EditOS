# cena19: Linha do tempo (componente)

Componente: `Cena19.tsx`. Demo: `demo.tsx` (Composition `Demo`, 1080x1350, 30 fps, 150 quadros). Render: `../demo.mp4`.

## Props
`width`, `height`; obrigatórias: kicker, titulo, anoInicial, pontos [{ano,titulo,linha,icone?}] (2 a 5 marcos; o último é o HOJE; sem `icone`, o quadradinho mostra a inicial do título). Opcionais: tituloAzul, anoFinal (padrão: último marco + 1), seloAgora (padrão "HOJE"), azul. Qualquer intervalo de anos cabe: o caminho até o hoje tem sempre o mesmo comprimento e os anos sem marco rareiam sozinhos quando o intervalo é longo.

**Textos da demo:** ficam só no `demo.tsx` e em `textos-demo.json`; nunca voltam num vídeo (teste do clone).

## Formato
Props `width`/`height` (padrão 1080x1350). O palco é desenhado em 1080x1350 e escalado para caber; o fundo preenche o resto.
Serve em 9:16 (1080x1920), 4:5 e 16:9 sem esticar. Duração de referência: 150 quadros a 30 fps (5 s); os tempos internos estão em quadros.
