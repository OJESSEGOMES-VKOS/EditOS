# cena13: Aguada de nanquim (componente)

Componente: `Cena13.tsx`. Demo: `demo.tsx` (Composition `Demo`, 1080x1350, 30 fps, 150 quadros). Render: `../demo.mp4`.

## Props
`width`, `height`, titulo [col1, col2] (verticais), frase, capitulo, papel, tinta, vermelho. Todas têm padrão (o conteúdo da demo).

## O que a cena faz
Pintura procedural em SVG: três cordilheiras com lavagem atrás de frente irregular e faixa molhada, penhasco de pincel seco de cima para baixo, pinheiro com agulhas, barco, rio de riscos, sol que floresce com passada, título vertical pincelado e selo carimbado a 112%.

## Formato
Props `width`/`height` (padrão 1080x1350). O palco é desenhado em 1080x1350 e escalado para caber; o fundo preenche o resto.
Serve em 9:16 (1080x1920), 4:5 e 16:9 sem esticar. Duração de referência: 150 quadros a 30 fps (5 s); os tempos internos estão em quadros.
