# cena18: Zoom na gravação de tela (componente)

Componente: `Cena18.tsx`. Demo: `demo.tsx` (Composition `Demo`, 1080x1350, 30 fps, 150 quadros). Render: `../demo.mp4`.

## Props
`width`, `height`, projeto, status, compartilhar, dialogo, abas, campos [[rótulo, valor]], qualidade, tamanhoRotulo, tamanho, cancelar, botao, passoNumero, passoTexto, legendaPrevia, azul (o alvo é o botão em BTN no topo do arquivo). Todas têm padrão (o conteúdo da demo).

## O que a cena faz
Plano aberto nítido no quadro 0; cursor curva até o botão e a câmera segue depois com uma mola só (~1,5x), com desfoque durante o movimento; clique escurece, aperta a 95%, anel e ondulação; pílula do passo entra por último e o número pula depois.

## Formato
Props `width`/`height` (padrão 1080x1350). O palco é desenhado em 1080x1350 e escalado para caber; o fundo preenche o resto.
Serve em 9:16 (1080x1920), 4:5 e 16:9 sem esticar. Duração de referência: 150 quadros a 30 fps (5 s); os tempos internos estão em quadros.
