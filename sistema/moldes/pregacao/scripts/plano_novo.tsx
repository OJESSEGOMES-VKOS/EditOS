/* O COMEÇO VAZIO do vídeo novo (tools/novo-video.py põe este texto no lugar do bloco O PLANO de src/Corte.tsx).
 * O vídeo nasce como a pessoa falando, com o fundo real, um plano só (1,0), sem nenhuma ênfase, letreiro ou fecho do
 * aprovado. Cada momento entra porque a fala NOVA pediu, com a linha do porquê no plano.md (o nome do momento, a palavra
 * dita entre aspas e o porquê; tools/clone.py cobra). A skill .claude/skills/pregacao/SKILL.md diz como escolher. O
 * molde para ao carregar até a legenda (PEDACOS) cobrir a fala: comece por ela.
 *
 * Prender à fala: w(<palavra>, n) = início da n-ésima vez que ela é dita; c(w(...)) = o corte seco 2 quadros antes.
 *
 * OS MOMENTOS DA CASA (cada um só com o porquê dele na fala nova; modelos/pregacao/pregacao.md §1 e §4):
 *   PEDACOS   a legenda corrida no peito, Inter 800 60 px branca, páginas de até 2 linhas, toda palavra uma vez:
 *             [índice da 1ª palavra, <texto / 2ª linha>, até?, (não use o 4º campo), corpo?]. É quase o vídeo todo.
 *   ABERTURA  a frase mais forte do gancho montando-se em frase-bloco sobre a gravação (G29), tamanhos misturados e a
 *             última palavra de peso em serifa itálica vermelha, a maior: [{txt, tam, quebra?, serif?, vermelho?}].
 *             Ligada: base1 = o corte da 1ª legenda depois dela. Sem frase forte no gancho, null e base1 null.
 *   DESTAQUE  a tela creme com a frase protagonista do tema (T.destaque, uma por vídeo): tinta escura e a palavra de peso
 *             em vermelho escuro, até 4 linhas. Só a fala protagonista; a coadjuvante fica na legenda.
 *   VIRADA    a frase-bloco da virada (T.bloco2: mas, só que, e aí), só se a virada fecha uma cena forte (G28).
 *   COMANDO   o Comenta fixo até o fim (T.cta), só se a fala termina pedindo um comentário: o comando e a palavra entre
 *             aspas, com pincel: true.
 *   T         os trechos, nesta ordem no tempo: bloco1 (sempre 0), base1, base2, base3, destaque, previas, base3b, bloco2,
 *             base4, cta, fecho. null desliga; cada corte só onde a fala troca de frase. fecho = o dissolve para o preto
 *             (depois da última palavra quando não há comando).
 *   ZOOM      1,0 por padrão (G6); até 1,18 só no trecho em que a fala pede aproximar (a frase de peso, a virada).
 *   LETREIRO  opção desligada (G6: precisa recortar a pessoa); previas, só se a fala promete vídeos da própria pessoa.
 *   LEG_Y_PLANO  null põe a legenda logo abaixo do queixo medido da gravação nova (o normal num vídeo novo).
 * Destaque só no termo protagonista; nunca o nome do modelo (G33), nunca texto que não foi dito (G19). */
const T: {bloco1: number; base1: Tempo; base2: Tempo; base3: Tempo; destaque: Tempo; previas: Tempo; base3b: Tempo; bloco2: Tempo; base4: Tempo; cta: Tempo; fecho: Tempo} = {
	bloco1: 0,
	base1: null,
	base2: null,
	base3: null,
	destaque: null,
	previas: null,
	base3b: null,
	bloco2: null,
	base4: null,
	cta: null,
	fecho: null,
};
/* letreiro atrás da pessoa: opção desligada (G6) */
const LETREIRO = null as {palavra: string; n?: number; texto: string} | null;
/* o zoom de cada trecho de T; trecho fora daqui fica em 1,0 */
const ZOOM: Partial<Record<keyof typeof T, number>> = {};
/* a posição da legenda: null = logo abaixo do queixo medido; um número fixa o topo */
export const LEG_Y_PLANO: number | null = null;
/* a legenda corrida: [índice da 1ª palavra, texto (a barra quebra a linha), até?, (não use), corpo?] */
const PEDACOS: [number, string, Tempo?, string?, number?][] = [];
/* os momentos de ênfase: null desliga */
const ABERTURA: Item[] | null = null;
const DESTAQUE: Item[] | null = null;
const VIRADA: Item[] | null = null;
const COMANDO: Item[] | null = null;
