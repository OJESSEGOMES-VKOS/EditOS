# cena46 · componente

`Cena46.tsx`: componente Remotion, tudo desenhado em código (SVG, filtros, sem imagem externa).
Pensado num palco 1080x1350 que escala para cobrir qualquer tamanho (`width`/`height`): em 9:16 corta as laterais,
em 16:9 corta em cima e embaixo. A linha do tempo é de 150 quadros e estica com `durationInFrames`.

**Props:** `titulo` (o nome dito da coisa; sem ele, nada), `chamadas[]` (de 0 a 3, presas na ordem à entrada, ao miolo e à saída do modelo), `inicios[]` (quadro, na escala de 150, em que cada chamada pousa; padrão 62, 74, 86), `width`, `height`. O turbofan (perfis `NAC`, `CORE`, pás, compressor, fluxo) é da demo: outra máquina é geometria nova com as mesmas funções (`../cena46.md`, Como variar). Os textos da demo estão em `textos-demo.json`.

**Conferido:** grade azul, motor de argila com um quarto cortado em projeção 3D própria, fan acelerando, linhas de ar laranja com ponta brilhante e pulsos, núcleo ficando vermelho, jato atrás, três chamadas em sequência, tudo para no último segundo.
