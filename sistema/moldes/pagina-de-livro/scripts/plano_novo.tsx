/* O COMEÇO VAZIO do vídeo novo (tools/novo-video.py põe este texto no lugar do bloco O PLANO de src/Reel.tsx).
 * O vídeo nasce como a gravação crua num plano só (aberto, 1,0), sem nenhuma palavra gigante, corte, chicote ou comando
 * do aprovado. Cada peça entra porque a fala NOVA pediu, com a linha do porquê no plano.md (o nome da peça, a palavra
 * dita entre aspas e o porquê; tools/clone.py cobra). A skill .claude/skills/pagina-de-livro/SKILL.md diz como escolher.
 * Comece pela legenda (todas as palavras, uma vez), depois os blocos só nos termos que importam ao tema.
 *
 * Prender à fala (índices de src/palavras.json): c(i) = corte 2 quadros antes da palavra i; antes(i) = 3 centésimos
 * antes (início de peça); ler(i) = a palavra i com os 0,4 s de leitura (fim da página que acaba nela).
 *
 * AS PEÇAS DA CASA (cada uma só com o porquê dela na fala nova; modelos/pagina-de-livro/pagina-de-livro.md §1 a §6):
 *   legenda   a página padrão, Poppins 46 branca, 1 ou 2 linhas em zigue-zague (1ª esq, 2ª dir), o trecho de peso em
 *             600 (p(<texto>, 'b')): {tipo: legenda, de, ate, pos: 1, linhas: [P(i, esq, p(<texto>)), P(j, dir, ...)]}.
 *             pos 2 (y 1400) só no fecho com o comando ou nas prévias. É a maior parte do vídeo.
 *   bloco     a palavra gigante colorida pelo sentido, só no termo que importa ao tema (G17), no máximo 3 por vídeo:
 *             {tipo: bloco, de, ate, x, largura?, ladoDir?, top, linhas: [P(...), K(<PALAVRA>, i, cor, al, {casar?}), ...]}.
 *             Lateral (top 0.357, do lado oposto ao rosto num plano médio 1,45) ou central gigante (top 0.6, x 0.5,
 *             largura 560-600, a conclusão de uma frase longa). Cor: azul = o que se busca, vermelho = o que dói,
 *             branco = a resposta neutra ou a 2ª palavra forte; duas palavras do mesmo bloco nunca com a mesma cor.
 *   PLANOS    os planos por corte seco, só com motivo (virada, destaque que pede outro lado, chamada): {de, zoom, fx, fy};
 *             médio 1,45 com o rosto à esquerda (fx 0.29) ou à direita (0.72) para abrir lugar ao bloco, close 1,65,
 *             aberto 1,0 numa virada (todo vídeo tem um aberto de 1,5 s ou mais). pb e previas só com ordem (G6).
 *   CHICOTE   o chicote de 1 quadro na entrada da chamada, só se a fala termina pedindo um comentário; com ele, o bloco
 *             do comando (a pequena e a palavra entre aspas gigante azul) e o resto da fala na legenda pos 2.
 * Nenhuma peça atravessa um corte. Nunca o nome do modelo (G33), nunca texto que não foi dito (G19). */
/* ---------------------------------------------------------------- planos: corte só com motivo */
const CORTE = {};
const PLANOS: Plano[] = [
	{de: 0, zoom: 1.0, fx: 0.5, fy: 0.34}, // aberto: a gravação como veio
];
/* chicote de 1 quadro na entrada da chamada; null desliga */
const CHICOTE = null as number | null;
/* as peças de texto, na ordem do tempo */
const PECAS: Peca[] = [];
