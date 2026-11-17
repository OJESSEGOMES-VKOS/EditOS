# cena29 — Produto girando: componente

Props: `nome` (obrigatório), `chamadas` (obrigatório, 1 a 4: `valor`, `legenda`, `lado` esq/dir, `y` no corpo), `inicios[]` (quadro de cada chamada; padrão 30 + i×10 escalado), `corCorpo`, `corMetal`, `duracao` (escala todos os tempos). O cilindro do `Produto` é o objeto de referência: para outro produto, redesenhe só ele com a forma real e mantenha a luz, o prato e a câmera. Os textos da demo estão em `textos-demo.json`: nenhum deles vai para um vídeo novo. Como compor uma cena nova: `../cena29.md` (A personalidade, Como variar).

O que tem: Cilindro de 64 ripas em CSS 3D com luz calculada por ripa (luz principal + recorte nas duas bordas), tampa escovada, prato, reflexo espelhado no chão; câmera desce do 3/4 alto ao herói, giro para em ~3,8 s; chamadas presas ao produto (são planos 3D virados para a câmera).
