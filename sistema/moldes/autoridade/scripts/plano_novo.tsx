// O começo vazio do vídeo novo (tools/novo-video.py põe este texto no lugar do bloco do plano de src/Reel.tsx (entre as linhas marcadas)).
// O vídeo nasce como a casa sem telas: a gravação com a deriva lenta e a legenda limpa de 72 px no peito, com as
// páginas feitas sozinhas (paginasAuto). Nenhuma tela, título, painel ou fecho do aprovado vem junto. Cada peça entra
// porque a fala NOVA pediu, com a linha por quê no plano.md (o nome da peça, a palavra dita entre aspas e o porquê;
// tools/clone.py cobra). A skill .claude/skills/autoridade/SKILL.md diz como escolher.
//
// Prender à fala: de(i) = o início da palavra i de src/palavras_voz.json (0 = a 1ª); c(x) = 2 quadros antes de x.
// Palavra ou texto que não bate com a fala: o molde para ao carregar e diz a lista e a linha.
//
// O QUE O PLANO SEMPRE TEM (já abaixo, vazio):
//   T            os cortes do vídeo, com nome: telaX: c(de(i)). Só o plano lê T.
//   MARCAS       as palavras que fazem um herói da casa agir (cartoes, barras, linhaTempo, player)
//   CURTA_JUNTO  true: na tela cheia, a palavra depois de uma de até 2 letras entra junto com ela
//   ENTRADAS     páginas da legenda com entrada própria, índice da 1ª palavra para o tempo
//   trechos      [começo, modo] na ordem: M.video (a base, a maior parte), M.tela, M.painel, M.celular, M.lista,
//                M.previas. Nunca duas telas seguidas; tela cheia de 1 a 2,5 s, uma ideia por tela
//   CAM          a deriva lenta (menos de 1% por segundo), no máximo 3 ênfases; o rosto em 27% (30% na ênfase)
//   ROSTO_MEDIDO null (o ponto dos olhos sai de src/rosto.json)
//   PEDACOS      a legenda: paginasAuto() faz tudo; troque por páginas escritas à mão pelo sentido. Barra quebra a
//                linha, asteriscos destacam na dividida, cerquilha com número pula as palavras que uma tela, um título ou
//                o fecho já mostra; dá para misturar: [..., paginasAuto(i0, i1), ...]
//
// AS PEÇAS DA CASA (cada uma desligada; ligue com uma linha PECA = ...; só quando a fala nova tiver o porquê dela,
// autoridade.md §4):
//   TITULOS   o gancho e a frase de extremo destaque do tema: a legenda com destaque, palavra por palavra, no peito
//             (topo y 1110, até 3 linhas). Linhas com normal(72, texto), ancora(116, palavra), serifa(72, ...) ou
//             cursiva(72, ...); UMA alternativa por título:
//             TITULOS = [{de: 0, ate: T.depois, primeira: 0, linhas: [[normal(72, ...)], [normal(72, ...), ancora(116, ...)]]}];
//   TELAS     tela cheia: a frase de peso que descreve uma ação ou um objeto. Tipografia da fala a partir de primeira e
//             um herói que faz o que a frase diz, no fundo escuro (E) ou de cor (L), alternando:
//             TELAS = [{de: T.tela, fundo: E, topo: 530, primeira: i, linhas: [{txt: ..., tam: 124}], heroi: Nome}];
//             Heróis da casa: Cartoes (vários vídeos lado a lado), Barras (algo que cresce), LinhaTempo (cortar, editar),
//             Player (o vídeo dele tocando). O normal num tema novo é uma tela nova (src/telas/).
//   PAINEIS   dividida com uma tela nova em cima e o vídeo sempre embaixo: a fala cita algo para mostrar (um objeto,
//             um material, um app) e a pessoa continua importante:
//             PAINEIS = [{de: T.painel, heroi: Nome, em: {chave: de(i)}, textos: {chave: [i, palavras ditas]}}];
//   LISTA     a fala lista itens ditos (2 a 8): o painel creme com os vistos que acendem um a um
//             LISTA = {titulo: palavras ditas, itens: [...ditos], vistos: [um índice por item], acende: DAVEZ};
//   CELULAR   a fala é sobre quem está vendo no Instagram agora: o vídeo dele num celular de Reels genérico
//             CELULAR = {marcas: [índice de Instagram, índice da palavra que traz os outros]};
//   CTA       a fala pede um comentário: o comando e o botão que acende na palavra
//             CTA = {i: índice de comenta, comando: a palavra dita, palavra: a palavra seguinte entre aspas, de: T.fecho};
//   FLASH     a fala vira o rumo (mas, só que, e se): o flash branco de 4 quadros no corte da ênfase. FLASH = T.virada;
//
// A TELA NOVA (o herói que a fala pede e a casa não tem; o normal num tema novo): src/telas/Nome.tsx com o kit de
// src/ui.tsx (Palco, Em, Entra, Cartao, Painel, Texto, Pilula, Visto, Barra, Numero, Traco, Onda) e as cores de
// src/tema.ts, registrada em src/telas/index.ts. Texto na tela só o que é dito (G19), número como foi dito (G10).
const T = {};
const MARCAS: Record<string, number[]> = {};
const CURTA_JUNTO = true;
const ENTRADAS: Record<number, number> = {};
const trechos = (_previas: boolean): [number, Modo][] => [[0, M.video]];
const CAM: [number, number, boolean?][] = [[0, 1.0], [DURACAO, 1.03]];
const ROSTO_MEDIDO = null as {x: number; y: number} | null;
const PEDACOS = paginasAuto();
