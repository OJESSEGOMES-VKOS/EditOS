/**
 * O plano do vídeo (imagem-por-palavra.md §3, §4 e §9). O bloco entre as linhas "O PLANO" e "fim do plano" é o único
 * pedaço que muda por vídeo: o tools/novo-video.py troca ele pelo scripts/plano_novo.ts (o começo vazio) e o
 * tools/clone.py compara ele com o do aprovado. Lido por src/modelo.ts (render e checador).
 *
 * Dentro do bloco, texto entre aspas é só o que a fala diz (a palavra de cada [índice, "palavra"], a grafia de "texto",
 * o id de uma imagem da lista); o resto são as constantes daqui de cima. Peça desligada = None.
 */
import PB from './palavras.json';
import LARG from './larguras.json';
import type {CoresSoltas, PicoIn, PlanoIn} from './modelo';

type Ref = [number, string];
/** peça desligada (o tools/clone.py lê "= None" como tela fora do plano) */
const None = undefined;
// os tipos de plano da faixa de imagem (§3)
const PESSOA = 'pessoa', IMG = 'img', ESTILOS = 'estilos', RAJADA = 'rajada', MOSAICO = 'mosaico', PAINEIS = 'paineis', CARD = 'card';
// o enquadre da pessoa (aberto 1,0 / fechado 1,25 / close 1,5), o fundo do cartão e o movimento da imagem
const ABERTO = 'aberto', FECHADO = 'fechado', CLOSE = 'close';
const PRETO = 'preto', CREME = 'creme', DESTAQUE = 'destaque';
const EMPURRA = 'empurra', RECUA = 'recua', GIRA = 'gira', DESLIZA = 'desliza';
// a voz do pico (§4) e as paletas (§7)
const GIGANTE = 'gigante', DIGITA = 'digita';
const NOITE = 'noite', CREME_LIMA = 'creme-lima', SANGUE = 'sangue';
void [PESSOA, IMG, ESTILOS, RAJADA, MOSAICO, PAINEIS, CARD, ABERTO, FECHADO, CLOSE, PRETO, CREME, DESTAQUE, EMPURRA, RECUA, GIRA, DESLIZA, GIGANTE, DIGITA, NOITE, CREME_LIMA, SANGUE];

/** prender à fala: w('palavra', n) = [índice, palavra] da n-ésima vez que ela é dita (sem acento, maiúscula nem pontuação) */
const PS = (PB as {text: string}[]).map((p) => p.text);
const limpa = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9%]/g, '');
const w = (palavra: string, n = 1): Ref => {
	let k = 0;
	for (let i = 0; i < PS.length; i++) if (limpa(PS[i]) === limpa(palavra) && ++k === n) return [i, PS[i]];
	throw new Error(`src/plano.ts: a palavra "${palavra}" (${n}ª vez) não está na fala (src/palavras.json)`);
};
/** a 1ª palavra da fala: o 1º plano começa nela */
const INICIO: Ref = [0, PS[0] ?? ''];

/**
 * quebrasPadrao(): a legenda curta da casa sem escolha nenhuma (o começo vazio). Dentro de cada trecho (até o ponto), o
 * bloco troca na 1ª palavra em que ele já ficou 1,5 s, a palavra de antes ficou 0,4 s, o resto do trecho ainda tem 1,5 s
 * e o texto cabe em 2 linhas (de preferência na vírgula). Nunca junta trechos (G14). É ponto de partida: o plano do vídeo
 * troca por quebras escolhidas quando quiser.
 */
const DE = (PB as {start: number}[]).map((p) => p.start);
const LG = LARG as Record<string, Record<string, number>>;
const largura = (a: number, b: number) =>
	PS.slice(a, b).join(' ').split('').reduce((s, c) => s + (LG.w900[c] ?? 600) / 1000 - 0.02, 0) * 68;
const quebrasPadrao = (): Ref[] => {
	const fim = /[.;:!?…]["”’)]*$/, virg = /,["”’)]*$/;
	// cabe em 2 linhas de 880 px (a legenda quebra no ponto mais equilibrado)
	const cabe = (x: number, y: number) => largura(x, y) <= 880 || [...Array(y - x - 1)].some((_, c) => largura(x, x + c + 1) <= 880 && largura(x + c + 1, y) <= 880);
	const out: Ref[] = [];
	for (let a = 0; a < PS.length; ) {
		let b = a;
		while (b < PS.length - 1 && !fim.test(PS[b])) b++;
		const depois = b + 1 < PS.length ? DE[b + 1] : DE[b] + 1.5; // quando o trecho seguinte começa
		const ini = (y: number) => (y > b ? depois : DE[y]);
		// a melhor divisão do trecho (programação dinâmica): blocos curtos, de preferência na vírgula; se a fala não deixa
		// 1,5 s por bloco, tenta 1,2 s (o checador avisa); se nem assim, divide só pela largura e o checador aponta a palavra
		// que ficou curta: ali a fala rápida pede uma escolha (a trava no termo do trecho, que abre mais lugar)
		for (const [L, tempo] of [[1.52, true], [1.22, true], [1.22, false]] as [number, boolean][]) {
			const custo: number[] = Array(b + 2).fill(Infinity);
			const de: number[] = Array(b + 2).fill(-1);
			custo[a] = 0;
			for (let y = a + 1; y <= b + 1; y++)
				for (let x = a; x < y; x++) {
					if (custo[x] === Infinity || !cabe(x, y) || ini(y) - DE[x] < L) continue;
					// a última palavra do bloco fica o tempo de ler: 0,4 s, ou 0,25 s num bloco que já ficou 1,5 s (G9)
					if (tempo && ini(y) - DE[y - 1] < (ini(y) - DE[x] >= 1.52 ? 0.27 : 0.42)) continue;
					const c = custo[x] + (y - x - 4) ** 2 + (y <= b && !virg.test(PS[y - 1]) ? 3 : 0);
					if (c < custo[y]) (custo[y] = c), (de[y] = x);
				}
			if (custo[b + 1] === Infinity) continue;
			const cortes: number[] = [];
			for (let y = de[b + 1]; y > a; y = de[y]) cortes.unshift(y);
			cortes.forEach((y) => out.push([y, PS[y]]));
			break;
		}
		a = b + 1;
	}
	return out;
};
void [w, INICIO, quebrasPadrao];

/* as peças do plano (o bloco abaixo dá o valor de cada uma; None = desligada) */
type Heroi = {de: Ref; ate: Ref; caixa?: number[]};
type Ponte = {img: string; de: Ref; ate: Ref; de_xy?: [number, number]; ate_xy?: [number, number]};
let paleta: string = NOITE;
let cores: CoresSoltas = {};
let planos: PlanoIn[] = [];
let quebras: Ref[] | undefined;
let picos: PicoIn[] | undefined;
let heroi: Heroi | undefined;
let tarja: Ref[] | undefined;
let ponte: Ponte[] | undefined;
let flash: Ref[] | undefined;
let negativo: Ref[] | undefined;
let texto: Record<string, string> | undefined;
let queixo: number | undefined;
let picoPx: number | undefined;

// ================================================================ O PLANO (num vídeo novo nasce do scripts/plano_novo.ts)
paleta = NOITE;
cores = {};
planos = [
	{de: [0, 'Esse'], tipo: PESSOA, plano: FECHADO},
	{de: [8, 'Ele'], tipo: PESSOA, plano: CLOSE},
	{de: [12, 'para'], tipo: IMG, img: 'mostrar', mov: RECUA},
	{de: [16, 'diferença'], tipo: CARD, fundo: CREME},
	{de: [18, 'vários'], tipo: MOSAICO, imgs: ['casamento', 'podcast', 'cozinha', 'futebol', 'viagem', 'alvo'], passo: 0.17},
	{de: [22, 'criei'], tipo: IMG, img: 'criei', mov: DESLIZA},
	{de: [24, 'melhorei'], tipo: IMG, img: 'melhorei', mov: EMPURRA},
	{de: [26, 'editar'], tipo: IMG, img: 'editar', mov: GIRA},
	{de: [27, 'qualquer'], tipo: RAJADA, imgs: ['casamento', 'podcast', 'cozinha', 'futebol', 'viagem'], passo: 0.2},
	{de: [31, 'usando'], tipo: PESSOA, plano: CLOSE},
	{de: [34, 'Inclusive,'], tipo: PESSOA, plano: FECHADO},
	{de: [41, 'você'], tipo: CARD, fundo: PRETO},
	{de: [48, 'Eu'], tipo: PESSOA, plano: CLOSE},
	{de: [58, 'aceleradas'], tipo: ESTILOS, img: 'aceleradas'},
	{de: [60, 'três'], tipo: CARD, fundo: PRETO},
	{de: [62, 'Mas'], tipo: PESSOA, plano: CLOSE},
	{de: [68, 'outros'], tipo: PESSOA, plano: FECHADO},
	{de: [75, 'aprender'], tipo: PESSOA, plano: CLOSE},
	{de: [80, 'nos'], tipo: ESTILOS, img: 'editado'},
	{de: [83, 'comenta'], tipo: MOSAICO, imgs: ['casamento', 'podcast', 'cozinha', 'futebol', 'viagem', 'aceleradas'], passo: 0.5, escuro: 0.62},
];
quebras = [[13, 'te'], [20, 'que'], [25, 'para'], [53, 'prévias'], [68, 'outros'], [76, 'a']];
picos = [
	{de: [16, 'diferença'], voz: GIGANTE},
	{de: [60, 'três'], ate: [61, 'vezes.'], voz: GIGANTE},
	{de: [84, 'edição'], voz: GIGANTE, fixo: true},
];
heroi = {de: [41, 'você'], ate: [47, 'modelos.'], caixa: [44, 45]};
tarja = [];
ponte = [{img: 'claquete', de: [27, 'qualquer'], ate: [31, 'usando']}];
flash = [[60, 'três']];
negativo = [];
texto = {84: '“EDIÇÃO”'};
queixo = None;
picoPx = None;
// ================================================================ fim do plano

const PLANO = {paleta, cores, planos, quebras, picos, heroi, tarja, ponte, flash, negativo, texto, queixo, picoPx};
export default PLANO;
