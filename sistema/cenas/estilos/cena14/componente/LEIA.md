# cena14: Mesa de papéis (componente)

Componente: `Cena14.tsx`. Demo: `demo.tsx` (Composition `Demo`, 1080x1350, 30 fps, 150 quadros). Render: `../demo.mp4`.

## Props
`width`, `height`, e as peças da mesa, cada uma só entra com conteúdo (1 a 3 papéis): folha do gráfico (figura,
tituloGrafico [1 ou 2 linhas], pontos [0..1 do dado real; sem pontos, sem curva], eixo {topo,inicio,fim}), folha da citação
(citacaoRotulo, citacao: linhas de trechos, g=true é o grifo), etiqueta recortada (etiqueta), nota da caneta (nota),
vermelho, amarelo. Nenhum padrão com texto: os da demo moram só no `demo.tsx` e em `textos-demo.json` (teste do clone).

## O que a cena faz
Tapete de corte verde com grade, folhas que entram levantadas e caem com peso (sombra aperta, pulinho, rotação passa e assenta), fita que bate, círculo de marcador, nota letra a letra, seta haste+V, marca-texto linha a linha, câmera de mão com tranco a cada pouso, grão e vinheta.

## Formato
Props `width`/`height` (padrão 1080x1350). O palco é desenhado em 1080x1350 e escalado para caber; o fundo preenche o resto.
Serve em 9:16 (1080x1920), 4:5 e 16:9 sem esticar. Duração de referência: 150 quadros a 30 fps (5 s); os tempos internos estão em quadros.
