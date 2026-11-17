import PB from './palavras.json';
import {Chave, POSE} from './Camera';
import {FPS} from './tempos';

/**
 * O plano do vídeo: tudo o que está preso à fala mora neste arquivo, no bloco entre as linhas "O PLANO" e "fim do
 * plano". O resto do src/ é o modelo (câmera, grade, montagem, tela de reels, prévias, títulos, conta no gelo, telas
 * livres) e fica igual. No molde, o bloco é o plano do vídeo aprovado (um EXEMPLO do jeito, nunca o roteiro de outro
 * vídeo). Num vídeo novo, o tools/novo-video.py troca o bloco pelo começo vazio (scripts/plano_novo.ts): só a pessoa,
 * cheio e punch-in. Cada parte entra porque a fala nova pediu (skill youtube-didatico, sistema/JEITO.md) e se confere
 * com `node scripts/checar.mjs`. Toda parte nasce desligada aqui em cima ([] ou null) e o bloco só liga a que usa.
 */
type Pal = {text: string; start: number; end: number};
export const PS = PB as Pal[];

export const pare = (msg: string): never => {
	throw new Error(`\n\n[youtube-didatico] ${msg}\n`);
};
const limpa = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
if (!PS.length) pare('src/palavras.json está vazio: rode tools/novo-video.py (ou tools/preparar.py) com a gravação.');
const REFAZER = 'O plano é de outra fala: refaça o bloco O PLANO de src/plano.ts sobre o src/palavras.json novo (skill youtube-didatico; modelos/youtube-didatico/youtube-didatico.md, seção 11).';
/** a fala é a do vídeo aprovado? (impressão digital do texto do src/palavras.json do molde) */
export const FALA_DO_APROVADO = (() => {
	let h = 5381;
	for (const c of PS.map((p) => limpa(p.text)).join(' ')) h = (h * 33 + c.charCodeAt(0)) >>> 0;
	return h === 2431698839;
})();
/** nomes que só o aprovado pode mostrar (os modelos do criador e o nome deste modelo) */
export const NOMES_DO_APROVADO = ['youtube-didatico', 'edition01', 'interface-encenada', 'trailer', 'rosto-telas', 'minidocumentario', 'pregacao', 'pagina-de-livro', 'autoridade'];
/** início (s) da palavra i da fala, conferindo que ela é `palavra` (sem contar maiúscula, acento e pontuação) */
const w = (i: number, palavra: string) => {
	const p = PS[i];
	if (!p) return pare(`src/plano.ts pede a palavra ${i} ("${palavra}"), mas a fala tem ${PS.length} palavras (0 a ${PS.length - 1}). ${REFAZER}`);
	if (limpa(p.text) !== limpa(palavra)) return pare(`src/plano.ts espera "${palavra}" na palavra ${i}, e a fala tem "${p.text}" em ${p.start.toFixed(2)} s. ${REFAZER}`);
	return p.start;
};
/** um tempo livre t (s), que não é o início de uma palavra, ancorado na palavra i (conferida como no `w`) */
const em = (t: number, i: number, palavra: string) => (w(i, palavra), t);
/** o fim da palavra i (conferida como no `w`) */
const fim = (i: number, palavra: string) => (w(i, palavra), PS[i].end);
void em, fim; // nem todo plano usa os dois

/** o fim: 0,7 s depois da última palavra (o pedido segura até aqui) */
export const DURACAO_Q = Math.round((PS[PS.length - 1].end + 0.7) * FPS);

/* ---------------------------------------------------------------- as partes: nascem desligadas; o bloco liga as que a fala pede */
/** palavra-título gigante ATRÁS da pessoa (só com a prop fundo: 'recorte', que precisa de public/pessoa.webm) */
export type Atras = {de: number; ate: number; linhas: string[]; size: number; top: number};
export let ATRAS: Atras[] = [];
/** frase NA FRENTE, sobre a camiseta: uma linha branca (palavra, quando entra) e a linha gigante amarela */
export type Frase = {de: number; ate: number; top: number; linha1: [string, number][]; linha2: [string, number][]};
export let FRASES: Frase[] = [];
/** título de capítulo branco e pesado no centro do A-roll, com o fio amarelo embaixo (cada linha entra 0,08 s depois) */
export type Titulo = {de: number; ate: number; top: number; linhas: string[]};
export let TITULOS: Titulo[] = [];
/** os vídeos da grade: public/ex/<nome>.mp4 (540x960). Cada um ganha o nome embaixo */
export let GRADE: string[] = [];
/** telas da grade no gelo; `par`: começa com dois lado a lado (em `varios` vira a grade, aproxima a partir de `zoom`) */
export type TelaGrade = {de: number; ate: number; par?: {varios: number; zoom: number}};
export let GRADES: TelaGrade[] = [];
/** montagem: um vídeo cheio por corte seco, public/ex/cheio_<nome>.mp4 recortado a partir do segundo `recorte` do vídeo dele */
export type Montagem = {recorte: number; planos: [number, number, string][]};
export let MONTAGEM: Montagem | null = null;
/** tela de reels genérica em volta do plano (a pose POSE.reel nas chaves); o @ vem da prop `arroba` */
export let REEL: {de: number; ate: number} | null = null;
/** contorno amarelo e rótulo no cartão do rosto (o cartão tem de estar na pose POSE.cartao) */
export let ESTE: {de: number; ate: number; rotulo: string} | null = null;
/** as prévias em cima (só com a prop `previas: true`; a câmera desce na chave do `de`) */
export let PREVIAS: {de: number; entra: number; ate: number} | null = null;
/** o pedido: degradê escuro e a frase de ação, a palavra-chave gigante em amarelo; fica até o fim */
export type Cta = {de: number; top: number; antes: string; chave: [string, number]; depois: [string, number]};
export let CTA: Cta | null = null;
/** conta no gelo: cada item entra quando é dito, num cartão que enche a tela; o rosto fica no cartão do canto (POSE.cartao
 * nas chaves, no `de`). É o plano B da montagem e da grade quando o criador não tem vídeos prontos. [item, quando é dito] */
export type Conta = {de: number; ate: number; itens: [string, number][]};
export let LISTA: Conta | null = null;
/** telas livres: a tela de gelo que a fala nova pede e o aprovado não tem (src/telas/<comp>.tsx da pasta do vídeo, com o kit
 * de src/ui.tsx); o rosto fica no cartão do canto (POSE.cartao nas chaves, no `de`). `em`: os instantes (cada um preso a
 * uma palavra dita), `textos`: o texto dito que a tela escreve, `dados`: o resto. */
export type Livre = {comp: string; de: number; ate: number; em?: Record<string, number>; textos?: Record<string, string>; dados?: Record<string, unknown>};
export let LIVRES: Livre[] = [];

// ================================================================ O PLANO (refazer num vídeo novo; aqui, o do vídeo aprovado)
/* os tempos, cada um amarrado a uma palavra */
const T = {
	punch1: w(4, '100%'),
	editado: w(5, 'editado'),
	pelo: w(6, 'pelo'),
	claude: w(7, 'Claude'),
	largo1: w(10, 'criado'), // o bloco 100% sai aqui (4 palavras, 2,34 s)
	tela1: w(16, 'diferença'), // o cartão gira, entram dois
	varios: w(18, 'vários'), // a grade 3x2
	zoom: em(6.3, 19, 'modelos'),
	montagem: w(26, 'editar'), // "editar qualquer tipo de vídeo"
	largo2: w(31, 'usando'), // "usando o Claude."
	punch2: w(34, 'Inclusive'),
	reel: em(11.75, 38, 'no'), // "Instagram": o plano encolhe para a tela de reels
	nome: w(45, 'um'), // "um desses modelos.": YOUTUBE / EDITION01
	previas: w(49, 'posso'), // a janela das prévias
	entraPrevia: w(50, 'até'), // "até colocar"
	mas: w(62, 'Mas'),
	tela2: w(68, 'outros'), // "outros modelos": callback da grade
	esse: em(23.4, 72, 'como'), // "como esse": contorno e nome no cartão
	largo3: w(76, 'a'), // "aprender"
	cta: w(83, 'comenta'),
	edicao: w(84, 'edição'),
	aqui: w(85, 'aqui'),
};

/* câmera: [t (s), pose, transição (0 = corte seco), gira?] */
export const chaves = (previas: boolean): Chave[] => [
	[0, POSE.punch(1.15, 0.36), 0],
	[T.punch1, POSE.cheio, 0], // abre para o plano inteiro: a parede acima da cabeça recebe o 100%
	[T.largo1, POSE.punch(1.12, 0.36), 0],
	[T.tela1, POSE.cartao, 0.38, true],
	[T.montagem, POSE.cheio, 0], // escondida pela montagem
	[T.largo2, POSE.cheio, 0],
	[T.punch2, POSE.punch(1.2, 0.36), 0],
	[T.reel, POSE.reel, 0.4],
	[T.nome, POSE.punch(1.12, 0.33), 0],
	...((previas
		? [
				[T.previas, POSE.baixo(1), 0.32],
			]
		: [[T.previas, POSE.cheio, 0]]) as Chave[]),
	[T.mas, POSE.punch(1.2, 0.36), 0],
	[T.tela2, POSE.cartao, 0.38, true],
	[T.largo3, POSE.cheio, 0],
	[T.cta, POSE.punch(1.15, 0.3), 0],
];

/* as partes que este vídeo liga (a que não aparece aqui fica desligada) */
ATRAS = [{de: T.punch1, ate: T.largo1, linhas: ['100%'], size: 250, top: 118}];
FRASES = [{de: T.editado, ate: T.largo1, top: 1215, linha1: [['editado', T.editado], ['pelo', T.pelo]], linha2: [['Claude', T.claude]]}];
TITULOS = [{de: T.nome, ate: T.previas, top: 1150, linhas: ['youtube', 'edition01']}];
GRADE = ['trailer', 'minidocumentario', 'pregacao', 'pagina-de-livro', 'autoridade', 'interface-encenada'];
GRADES = [
	{de: T.tela1, ate: T.montagem, par: {varios: T.varios, zoom: T.zoom}},
	{de: T.tela2, ate: T.largo3},
];
MONTAGEM = {
	recorte: 8.0,
	planos: [
		[T.montagem, 8.58, 'rosto-telas'],
		[8.58, 8.9, 'autoridade'],
		[8.9, 9.22, 'trailer'],
		[9.22, T.largo2, 'minidocumentario'],
	],
};
REEL = {de: T.reel, ate: T.nome};
ESTE = {de: T.esse, ate: T.largo3, rotulo: 'youtube-didatico'};
PREVIAS = {de: T.previas, entra: T.entraPrevia, ate: T.mas};
CTA = {de: T.cta, top: 1268, antes: 'comenta', chave: ['EDIÇÃO', T.edicao], depois: ['aqui embaixo', T.aqui]};
// ================================================================ fim do plano

/* ---------------------------------------------------------------- trava: o plano do aprovado não vai para outra fala */
if (!FALA_DO_APROVADO) {
	const tem = (x: string) => NOMES_DO_APROVADO.includes(limpa(x));
	const achou = [
		...(TITULOS.some((d) => d.linhas.some(tem) || tem(d.linhas.join(''))) ? ['TITULOS (só um título com palavra dita na fala, nunca o nome do modelo)'] : []),
		...(ESTE && tem(ESTE.rotulo) ? ['ESTE (só com o rótulo real do vídeo que está no cartão)'] : []),
		...(GRADE.some(tem) ? ['GRADE e GRADES (só com os vídeos prontos do criador, com os nomes dele, em public/ex/)'] : []),
		...(MONTAGEM?.planos.some(([, , n]) => tem(n)) ? ['MONTAGEM (só com os vídeos prontos do criador em public/ex/cheio_<nome>.mp4)'] : []),
		...([...ATRAS.flatMap((a) => a.linhas), ...FRASES.flatMap((f) => [...f.linha1, ...f.linha2].map((p) => p[0])), ...(LISTA?.itens.map((i) => i[0]) ?? []), ...LIVRES.flatMap((L) => Object.values(L.textos ?? {}))].some(tem) ? ['tire de ATRAS, FRASES, LISTA e LIVRES o nome do modelo (o texto é sempre o que foi dito)'] : []),
	];
	if (achou.length) pare(`src/plano.ts ainda tem partes do plano do vídeo aprovado, e a fala é outra. Tire do bloco O PLANO (ou refaça como a skill youtube-didatico manda):\n  - ${achou.join('\n  - ')}\n(PREVIAS também, a menos que o criador tenha as prévias dele; e as props nomesPrevias com os nomes reais.)`);
}
