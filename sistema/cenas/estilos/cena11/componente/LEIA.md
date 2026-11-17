# cena11: Rota no mapa 3D (componente)

Componente: `Cena11.tsx`. Demo: `demo.tsx` (Composition `Demo`, 1080x1350, 30 fps, 150 quadros). Render: `../demo.mp4`.

## Props
`width`, `height`, destino (obrigatório), lugares [{nome,x,y}] (0 a 3; coordenadas no chão de 2400x2400), rota
([x,y][] nos eixos das ruas = múltiplos de 190; padrão `ROTA_EXEMPLO`, a da demo), minutos e minutosInicio (sem `minutos`,
o cartão da viagem não entra), distancia, rotaTexto, botao. Os textos da demo moram só no `demo.tsx` e em
`textos-demo.json`; nunca voltam num vídeo (teste do clone).

## O que a cena faz
Cidade inventada em CSS 3D (caixas com topo e laterais, sombra suave), rio, parques, rua amarela; câmera sai baixa atrás do ponto azul, sobe, recua e vira para o destino; rota azul com contorno branco desenha pelas ruas e freia; alfinete cai e amassa, rótulo entra com passada; cartão sobe com mola e minutos rolam 14→12.

## Formato
Props `width`/`height` (padrão 1080x1350). O palco é desenhado em 1080x1350 e escalado para caber; o fundo preenche o resto.
Serve em 9:16 (1080x1920), 4:5 e 16:9 sem esticar. Duração de referência: 150 quadros a 30 fps (5 s); os tempos internos estão em quadros.
