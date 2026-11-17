# cena31 — Cartão que vira: componente

Props: `marca`, `plano`, `preco` (obrigatórios, os ditos), `periodo`, `beneficios` (0 a 3, os que a fala cita), `rodapeFrente` (a linha pequena da frente, opcional), `viradaEm` (quadro da virada, na palavra do preço), `corDestaque`. Os textos da demo estão em `textos-demo.json`: nenhum deles vai para um vídeo novo. Como compor uma cena nova: `../cena31.md` (A personalidade, Como variar).

O que tem: Cartão com espessura real (camadas internas + bordas polidas que brilham no meio do giro), desfoque de movimento de verdade (`CameraMotionBlur`, 8 amostras), dois brilhos varrendo, sombra na parede que estreita e amacia; benefícios com círculo que salta, visto que se desenha e texto saindo da máscara.
