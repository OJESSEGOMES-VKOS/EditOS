# cena12: Explodido (teardown) (componente)

Componente: `Cena12.tsx`. Demo: `demo.tsx` (Composition `Demo`, 1080x1350, 30 fps, 150 quadros). Render: `../demo.mp4`.

## Props
`width`, `height`, partes [{nome,spec}] (6, de cima para baixo), titulo, specTitulo, laranja. Todas têm padrão (o conteúdo da demo).

## O que a cena faz
Teclado genérico de 21 teclas em CSS 3D com caixas reais; câmera recua e desliza para a esquerda, órbita de 10°; camadas sobem de cima para baixo a cada 10 quadros com mola de ~10%; linha-guia sai do ponto na borda da peça e o rótulo sobe de uma máscara; título por último com barra laranja.

## Formato
Props `width`/`height` (padrão 1080x1350). O palco é desenhado em 1080x1350 e escalado para caber; o fundo preenche o resto.
Serve em 9:16 (1080x1920), 4:5 e 16:9 sem esticar. Duração de referência: 150 quadros a 30 fps (5 s); os tempos internos estão em quadros.
