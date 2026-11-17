/* O COMEÇO VAZIO do vídeo novo (tools/novo-video.py põe este texto no lugar do bloco O PLANO de src/Reel.tsx).
 * O vídeo nasce como a gravação íntegra num plano só (rosto, 1,0), sem nenhuma palavra-chave, papel, B-roll, vazamento
 * ou terço do aprovado. Cada peça entra porque a fala NOVA pediu, com a linha do porquê no plano.md (o nome da peça, a
 * palavra dita entre aspas e o porquê; tools/clone.py cobra). A skill .claude/skills/minidocumentario/SKILL.md diz como
 * escolher. Comece pela legenda padrão (todas as palavras, uma vez, um trecho por bloco), depois as ênfases.
 *
 * Prender à fala: os ids são índices de src/palavras.json; rg(a, b) = as palavras de a até b; de(i, <lista>) = o início
 * da palavra i. Cada corte cai no início da 1ª palavra do plano.
 *
 * AS PEÇAS DA CASA (cada uma só com o porquê dela na fala nova; modelos/minidocumentario/minidocumentario.md §1 e §3):
 *   blocos    a legenda em três níveis, um bloco por trecho (nunca atravessa ponto ou vírgula, SP5), até 2 linhas:
 *             padrão {tipo: 'p', ids, y: 1110 / 1193, al: 'c'} no peito (o chão: o vídeo quase todo);
 *             intermediário: verm: [id] na linha (a palavra de carga em vermelho, dentro da frase);
 *             gigante {tipo: 'k', id, y: ~1250, cor: COR.sinal} só no termo-imagem que fecha um argumento ou na tese do
 *             fecho (G17, ~1 a cada 10-15 s), com as pequenas encostadas (al: kwL em cima, kwR embaixo); COR.branco para
 *             o predicado depois de é/foi/era ou nome de pessoa; caixa: id para marca ou produto dito.
 *   PLANOS    {id, de, ate, mundo, q}: com uma câmera, um plano rosto do começo ao fim, sem zoom fingindo outra câmera
 *             (M1); com vários ângulos gravados, um plano por ângulo (camera: <arquivo do ângulo>) com o porquê (aberto =
 *             tese, close = pessoal). arquivo com img só com B-roll real do criador; papel só com prints ou fotos reais
 *             (tools/cards.py com o material dele). Nada gerado (G7, M1).
 *   VAZAMENTOS  o vazamento de luz vermelho-âmbar-branco, só na virada real da história (1 a 2 por vídeo).
 *   TERCOS    o terço inferior com nome e @, só com os reais de quem fala (props nome e arroba).
 * Nunca o nome do modelo (G33), nunca texto que não foi dito (G19). */
const PLANOS: Plano[] = [
	{id: 'P1', de: 0, ate: DURACAO, mundo: rosto, q: {s: 1.0, ox: 0.5, oy: 0.33}}, // a gravação íntegra
];
const VAZAMENTOS = []; // os segundos dos vazamentos, ex. [12.4]; [] desliga; só na virada da fala (scripts/trilha.py lê esta linha)
/* blocos de texto, plano a plano (posições em px no quadro 1080x1920) */
const blocos = (prev: boolean): Bloco[] => {
	void prev; // a janela das prévias (plano dividida) só existe com ordem
	return [];
};
/* quando e onde entra o terço inferior (1ª aparição do rosto); [] desliga */
const TERCOS: Terco[] = [];
