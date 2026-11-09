/**
 * imagem-por-palavra: a lógica do modelo, sem React. O render (src/Reel.tsx), o checador (scripts/conferir.mjs) e o som
 * (scripts/som.py, pelo src/eventos.json que o checador grava) partem deste mesmo arquivo: o que um desenha o outro confere.
 * A regra está em ../../modelos/imagem-por-palavra/imagem-por-palavra.md.
 *
 * Gramática: duas faixas independentes.
 *  1. A FAIXA DE IMAGEM (src/plano.json → "planos"): uma fila emendada de planos, cada um começando no início de uma
 *     palavra (corte no 1º quadro da palavra que ele ilustra). Plano é a pessoa (aberto/fechado/close da mesma tomada),
 *     uma imagem (src/imagens.json), a mesma imagem trocando de estilo, um mosaico, dois painéis, ou um cartão chapado.
 *     Ela troca a cada 1 a 3 palavras, em ondas (rajada de 0,17–0,25 s por no máximo 3 s, depois respiro).
 *  2. A FAIXA DE TEXTO (correção I-LEGENDA, 2026-11-07): blocos CURTOS da fala (o pedaço que está sendo dito, de 1 a
 *     ~6 palavras, nunca a frase empilhada), centrados, um tamanho só (72 px), cada palavra entrando na voz. O bloco
 *     troca no fim do trecho (G11, G14) ou numa quebra do plano; a imagem troca por baixo dele (E4). Um bloco pode ter
 *     uma TRAVA: a palavra/termo enorme com as palavras pequenas encostadas nos cantos dela (antes em cima, alinhadas à
 *     esquerda dela; depois embaixo, alinhadas à direita). Sobre a pessoa e a imagem o texto mora logo abaixo do queixo;
 *     num cartão chapado (palco da tipografia), no meio do quadro.
 * Nenhum filtro de cor na gravação da pessoa (G6): estilos, duotone e negativo só nas imagens.
 */
import PB from './palavras.json';
import ROSTO from './rosto.json';
import MAOS from './maos.json';
import PLANO from './plano.json';
import IMAGENS from './imagens.json';
import LARG from './larguras.json';

export const FPS = 30;
export const W = 1080, H = 1920;
/** zona segura das redes em 9:16 (REGRAS §5) */
export const ZONA = {esq: 60, dir: 940, topo: 250, base: 1500};
export const ZW = ZONA.dir - ZONA.esq;
export const CX = (ZONA.esq + ZONA.dir) / 2;
/** a palavra nasce 1 quadro antes da voz (nas referências ela aparece junto com o som; nada fica escrito antes de ser dito) */
export const ANTECIPA = 1 / 30;
/** o corte de imagem cai 1 quadro antes da palavra (E2: a imagem chega junto com a palavra, ±1 quadro) */
export const Q1 = 1 / FPS;

export type Pal = {texto: string; de: number; ate: number};
export const PS: Pal[] = (PB as {text: string; start: number; end: number}[]).map((p) => ({texto: p.text, de: p.start, ate: p.end}));
if (!PS.length) throw new Error('src/palavras.json está vazio: este molde precisa da fala transcrita (tools/novo-video.py).');
export const CAUDA = 0.75;
export const DURACAO = Math.round((PS[PS.length - 1].ate + CAUDA) * 100) / 100;
const quadro = (t: number) => Math.round(t * FPS) / FPS;
/** quando a palavra aparece na legenda */
export const entra = (i: number) => Math.max(0, quadro(PS[i].de - ANTECIPA));
/** quando o plano que começa na palavra i corta */
export const corta = (i: number) => (i === 0 ? 0 : Math.max(0, quadro(PS[i].de - Q1)));

/* ---------------------------------------------------------------- paletas (opção do usuário, G31) */
export type NomePaleta = 'noite' | 'creme-lima' | 'sangue';
export type Paleta = {preto: string; creme: string; tinta: string; texto: string; destaque: string; destaque2: string};
/** As paletas prontas, medidas nas referências. Nenhuma é regra: o usuário escolhe e troca qualquer cor solta. */
export const PALETAS: Record<NomePaleta, Paleta> = {
	// ref1 (o documentário): preto fundo #000000–#0E0B0F, branco puro nos cartões, laranja de acento
	noite: {preto: '#060507', creme: '#F0EEEA', tinta: '#0E0F12', texto: '#F7F5F0', destaque: '#FD7D00', destaque2: '#F0EEEA'},
	// ref2 (o criador): creme #F0EEEA, preto azulado #0E0F12, lima #C9DA3C
	'creme-lima': {preto: '#0E0F12', creme: '#F0EEEA', tinta: '#0E0F12', texto: '#F7F5F0', destaque: '#C9DA3C', destaque2: '#FD7D00'},
	// ref2 22 s ("background" em vermelho): vermelho #982323 sobre preto
	sangue: {preto: '#0B090A', creme: '#E6E2DE', tinta: '#130F11', texto: '#F4F0EC', destaque: '#D8322B', destaque2: '#E6E2DE'},
};
export const PADRAO_PALETA: NomePaleta = 'noite';
export type CoresSoltas = Partial<Paleta>;
export const paletaDe = (nome?: string, cores?: CoresSoltas): Paleta => ({
	...(PALETAS[(nome as NomePaleta) || PADRAO_PALETA] ?? PALETAS[PADRAO_PALETA]),
	...(cores ?? {}),
});

/* ---------------------------------------------------------------- o plano */
type Ref = [number, string];
export type TipoPlano = 'pessoa' | 'img' | 'estilos' | 'rajada' | 'mosaico' | 'paineis' | 'card';
export type Enquadre = 'aberto' | 'fechado' | 'close';
export type Trat = 'natural' | 'arquivo' | 'duotone' | 'pb' | 'negativo';
export type Mov = 'empurra' | 'recua' | 'gira' | 'desliza';
export type PlanoIn = {
	de: Ref; tipo: TipoPlano;
	plano?: Enquadre; img?: string; imgs?: string[]; trat?: Trat; mov?: Mov;
	fundo?: 'preto' | 'creme' | 'destaque'; sobe?: Ref;  porque?: string; passo?: number; escuro?: number;
};
export type Plano = PlanoIn & {i: number; t0: number; t1: number; k: number};
export type VozPico = 'gigante' | 'conta' | 'digita';
export type PicoIn = {de: Ref; ate?: Ref; voz?: VozPico; fixo?: boolean};
type PlanoJson = {
	paleta?: string; cores?: CoresSoltas; picoPx?: number; queixo?: number;
	planos: PlanoIn[];
	quebras?: Ref[];
	picos?: PicoIn[];
	heroi?: {de: Ref; ate: Ref; caixa?: number[]} | null;
	tarja?: Ref[];
	ponte?: {img: string; de: Ref; ate: Ref; de_xy?: [number, number]; ate_xy?: [number, number]}[];
	flash?: Ref[];
	negativo?: Ref[];
	texto?: Record<string, string>;
};
const PJ = PLANO as unknown as PlanoJson;
export const PALETA_PLANO = PJ.paleta ?? '';
export const CORES_PLANO = PJ.cores ?? {};
export type Imagem = {palavra: Ref; arquivo: string; prompt?: string; fonte?: string};
export const IMGS = IMAGENS as unknown as Record<string, Imagem>;

/** confere que o índice aponta para a palavra certa: plano de outra fala não renderiza (o checador diz o que refazer) */
const ERROS_PLANO: string[] = [];
const limpa = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9%]/g, '');
export const idx = (r: Ref, onde: string) => {
	const [i, w] = r;
	if (!PS[i] || limpa(PS[i].texto) !== limpa(w)) ERROS_PLANO.push(`${onde}: [${i}, "${w}"] não bate com a fala (${PS[i] ? `a palavra ${i} é "${PS[i].texto}"` : 'índice fora da fala'})`);
	return i;
};
export const escrita = (i: number) => PJ.texto?.[String(i)] ?? PS[i].texto;

export const PLANOS: Plano[] = PJ.planos.map((p, k) => ({...p, k, i: idx(p.de, `planos[${k}]`), t0: 0, t1: 0}));
PLANOS.forEach((p, k) => {
	p.t0 = corta(p.i);
	p.t1 = k + 1 < PLANOS.length ? corta(PLANOS[k + 1].i) : DURACAO;
});
export const planoEm = (t: number) => {
	let p = PLANOS[0];
	for (const x of PLANOS) if (t >= x.t0) p = x;
	return p;
};

/* ---------------------------------------------------------------- o rosto (texto nunca sobre ele) */
const RJ = ROSTO as number[][];
export const TEM_ROSTO = RJ.length > 0;
/** o queixo mais baixo da gravação (fração do quadro): o zoom puxa dele, então ele não sai do lugar em nenhum plano */
/** o queixo: o "queixo" do plano (medido no quadro, quando o detector exagera porque a pessoa encosta na câmera) ou o mais
 * baixo medido */
export const QUEIXO = TEM_ROSTO ? (PJ.queixo ?? Math.max(...RJ.map((r) => r[2] + r[3] / 2)) * H) : 0;
export const ORIGEM = {x: TEM_ROSTO ? (RJ.reduce((a, r) => a + r[1], 0) / RJ.length) * W : W / 2, y: TEM_ROSTO ? QUEIXO : H * 0.5};
export const ZOOM: Record<Enquadre, number> = {aberto: 1.0, fechado: 1.25, close: 1.5};

/* ---------------------------------------------------------------- as mãos (scripts/maos.py): o texto do peito não fica sobre elas */
const MJ = MAOS as unknown as {celula: number; amostras: [number, number[]][]};
export const TEM_MAOS = !!MJ.amostras?.length;
export type Caixa = {x0: number; y0: number; x1: number; y1: number};
/** fração da área das caixas de texto que cai sobre mão/braço no tempo t, com o zoom do enquadre (puxado do queixo) */
export const maoSobre = (caixas: Caixa[], t: number, zoom: number) => {
	if (!TEM_MAOS) return 0;
	const a = MJ.amostras[Math.min(MJ.amostras.length - 1, Math.max(0, Math.round(t * 4)))][1];
	let tot = 0, mao = 0;
	for (const b of caixas)
		for (let y = b.y0 + 10; y < b.y1; y += 20)
			for (let x = b.x0 + 10; x < b.x1; x += 20) {
				const xs = ORIGEM.x + (x - ORIGEM.x) / zoom, ys = ORIGEM.y + (y - ORIGEM.y) / zoom;
				tot++;
				if (((a[Math.floor(ys / MJ.celula)] ?? 0) >> Math.floor(xs / MJ.celula)) & 1) mao++;
			}
	return tot ? mao / tot : 0;
};

/* ---------------------------------------------------------------- a legenda-âncora e o pico */
export const LEG_PX = 68; // Inter Tight 900 (sans pesada das refs), UM tamanho no vídeo (G12); nada fica menor que isto (I-LEGENDA)
export const LEG_LH = Math.round(LEG_PX * 1.1);
/** a legenda tem um lugar só sobre a pessoa e a imagem: o topo da 1ª linha em Y1, 40 px abaixo do queixo mais baixo medido
 * (o zoom puxa do queixo, então ele não sai do lugar). Sem rosto (narração), 1000. No cartão, o texto é centrado em CY. */
export const Y1 = TEM_ROSTO ? Math.round(Math.min(1340, Math.max(900, QUEIXO + 40))) : 1000;
export const CY = 900;
/** altura mediana do rosto (px): a boca fica ~0,18 dela acima do queixo; o texto pode encostar no queixo, nunca na boca */
export const ROSTO_H = TEM_ROSTO ? [...RJ.map((r) => r[3] * H)].sort((a, b) => a - b)[Math.floor(RJ.length / 2)] : 0;
export const bocaY = (zoom: number) => ORIGEM.y - 0.18 * ROSTO_H * zoom;
const LS_LEG = -0.02, LS_PICO = -0.04;
const larg = (s: string, peso: 'w700' | 'w900', px: number, ls: number) =>
	[...s].reduce((a, c) => a + ((LARG as Record<string, Record<string, number>>)[peso][c] ?? 600) / 1000 + ls, 0) * px;
export const largLeg = (s: string) => larg(s, 'w900', LEG_PX, LS_LEG);
export const largPico = (s: string, px: number) => larg(s, 'w900', px, LS_PICO);
export const ESPACO = larg(' ', 'w900', LEG_PX, LS_LEG);

/** pontuação que fecha um trecho (G14: ponto) e um subtrecho (vírgula). O bloco troca sozinho só no fim do trecho; na
 * vírgula só com "quebras" no plano, e só se os dois lados ficarem legíveis (G9: "Ah," sozinho não vira bloco). */
const FECHA = /[.;:!?…]["”’)]*$/;
const VIRG = /[,]["”’)]*$/;
export const fechaTrecho = (i: number) => FECHA.test(PS[i].texto);
export const fechaSub = (i: number) => VIRG.test(PS[i].texto);

export const HEROI = PJ.heroi ? {de: idx(PJ.heroi.de, 'heroi.de'), ate: idx(PJ.heroi.ate, 'heroi.ate'), caixa: PJ.heroi.caixa ?? []} : null;
const TARJA = new Set((PJ.tarja ?? []).map((r, k) => idx(r, `tarja[${k}]`)));
const QUEBRAS = new Set((PJ.quebras ?? []).map((r, k) => idx(r, `quebras[${k}]`)));
export type Pico = {de: number; ate: number; voz: VozPico; fixo: boolean};
export const PICOS: Pico[] = (PJ.picos ?? []).map((p, k) => {
	const de = idx(p.de, `picos[${k}].de`);
	const ate = p.ate ? idx(p.ate, `picos[${k}].ate`) : de; // pico de 2 palavras: "ate" é a última
	// "conta" (1 → 10 → 100) mostra números que a pessoa não disse (G10): só a pedido; o padrão é a gigante
	return {de, ate, voz: p.voz ?? 'gigante', fixo: !!p.fixo};
});

export type Linha = {ids: number[]; w: number};
export type Bloco = {
	k: number; ids: number[]; t0: number; t1: number;
	estilo: 'leg' | 'heroi' | 'tarja';
	antes: Linha[]; pico: Pico | null; depois: Linha[]; fixo: boolean;
	trechoInteiro: boolean; cartao: boolean;
};
/** quebra as palavras pequenas em até 2 linhas equilibradas (o checador acusa se não couber) */
const quebrar = (ids: number[], maxLinhas: number): Linha[] => {
	if (!ids.length) return [];
	const w = (xs: number[]) => xs.reduce((a, i, m) => a + largLeg(escrita(i)) + (m ? ESPACO : 0), 0);
	if (w(ids) <= ZW || maxLinhas === 1 || ids.length === 1) return [{ids, w: w(ids)}];
	let melhor = 1, nota = Infinity;
	for (let c = 1; c < ids.length; c++) {
		const n = Math.max(w(ids.slice(0, c)), w(ids.slice(c)));
		if (n < nota) { nota = n; melhor = c; }
	}
	return [{ids: ids.slice(0, melhor), w: w(ids.slice(0, melhor))}, {ids: ids.slice(melhor), w: w(ids.slice(melhor))}];
};

/** os blocos: um trecho (até o ponto), cortado nas quebras do plano, no pico fixo e no herói */
export const BLOCOS: Bloco[] = (() => {
	const grupos: number[][] = [];
	let g: number[] = [];
	const fecha = () => { if (g.length) grupos.push(g); g = []; };
	for (let i = 0; i < PS.length; i++) {
		const comecaHeroi = HEROI && i === HEROI.de;
		const fimFixo = PICOS.some((p) => p.fixo && i === p.ate + 1);
		if (QUEBRAS.has(i) || comecaHeroi || fimFixo) fecha();
		g.push(i);
		if (fechaTrecho(i) || (HEROI && i === HEROI.ate)) fecha();
	}
	fecha();
	const inicioTrecho = (i: number) => i === 0 || fechaTrecho(i - 1);
	const blocos: Bloco[] = grupos.map((ids, k) => {
		const pico = PICOS.find((p) => p.de >= ids[0] && p.ate <= ids[ids.length - 1]) ?? null;
		const heroi = !!HEROI && ids[0] === HEROI.de;
		const tarja = ids.some((i) => TARJA.has(i));
		const peq = pico ? ids.filter((i) => i < pico.de || i > pico.ate) : ids;
		const antes = pico ? quebrar(peq.filter((i) => i < pico.de), 2) : heroi ? [] : quebrar(peq, 2);
		const depois = pico ? quebrar(peq.filter((i) => i > pico.ate), 1) : [];
		const ultimo = ids[ids.length - 1];
		return {
			k, ids, t0: entra(ids[0]), t1: 0, estilo: heroi ? 'heroi' : tarja ? 'tarja' : 'leg', antes, pico, depois,
			fixo: !!pico?.fixo, trechoInteiro: inicioTrecho(ids[0]) && fechaTrecho(ultimo), cartao: false,
		};
	});
	blocos.forEach((b, k) => {
		b.t1 = k + 1 < blocos.length ? blocos[k + 1].t0 : DURACAO;
		if (k === 0) b.t0 = 0;
		b.cartao = planoEm(b.t0 + 0.001).tipo === 'card';
	});
	return blocos;
})();
export const FIXO = BLOCOS.find((b) => b.fixo) ?? null;
export const blocosEm = (t: number) => BLOCOS.filter((b) => (t >= b.t0 && t < b.t1) || (b.fixo && t >= b.t0));

/** a gigante: um tamanho só no vídeo (G12, G13), o maior em que a mais longa cabe em 92% da zona, nunca menor que 2x a
 * legenda (variação só para cima, até 2 tamanhos: a gigante e o herói) */
export const PICO_PX = (() => {
	if (PJ.picoPx) return PJ.picoPx;
	const textos = BLOCOS.filter((b) => b.pico).map((b) => b.ids.filter((i) => i >= b.pico!.de && i <= b.pico!.ate).map(escrita).join(' '));
	if (!textos.length) return 200;
	const px = Math.min(...textos.map((s) => (0.92 * ZW) / (largPico(s, 1))));
	return Math.max(2 * LEG_PX, Math.min(300, Math.floor(px)));
})();
export const PICO_ALT = Math.round(PICO_PX * 0.86); // a caixa da gigante é justa: as pequenas encostam nela (a trava)
/** o topo da gigante sobre a pessoa/imagem: fixo no vídeo (G13), com 1 linha de 68 px embaixo dela até o fim da zona */
export const YG = ZONA.base - 4 - LEG_LH - PICO_ALT;
export const picoTexto = (b: Bloco) => b.ids.filter((i) => i >= b.pico!.de && i <= b.pico!.ate).map(escrita).join(' ');

export type Geo = {antes: {x: number; y: number}[]; pico: {x: number; y: number; w: number} | null; depois: {x: number; y: number}[]};
/** onde cada linha fica (x à esquerda, y no topo), para o render e para o checador.
 * Pessoa e imagem: tudo a partir de Y1 (o lugar fixo, G12). Cartão: a pilha centrada em CY (palco da tipografia).
 * A trava: as de antes alinhadas à esquerda da gigante, as de depois alinhadas à direita dela, encostadas. */
export const geometria = (b: Bloco): Geo => {
	const altura = b.antes.length * LEG_LH + (b.pico ? PICO_ALT : 0) + b.depois.length * LEG_LH;
	// a gigante sobre a pessoa/imagem mora numa altura fixa, no peito, colada na base da zona com 1 linha embaixo
	let y = b.cartao || b.fixo ? Math.round(CY - altura / 2) : b.pico ? YG - b.antes.length * LEG_LH : Y1;
	const centro = (w: number) => CX - w / 2;
	if (!b.pico) return {antes: b.antes.map((l) => { const r = {x: centro(l.w), y}; y += LEG_LH; return r; }), pico: null, depois: []};
	const gw = largPico(picoTexto(b), PICO_PX);
	const gx = centro(gw);
	const antes = b.antes.map((l) => { const x = gx + l.w <= ZONA.dir ? Math.max(ZONA.esq, gx) : centro(l.w); const r = {x, y}; y += LEG_LH; return r; });
	const pico = {x: gx, y, w: gw};
	y += PICO_ALT;
	const depois = b.depois.map((l) => { const x = gx + gw - l.w >= ZONA.esq ? Math.min(ZONA.dir - l.w, gx + gw - l.w) : centro(l.w); const r = {x, y}; y += LEG_LH; return r; });
	return {antes, pico, depois};
};

/** as caixas de texto do bloco (para zona, rosto e mãos) */
export const caixas = (b: Bloco): Caixa[] => {
	const g = geometria(b);
	const cx = (x: number, w: number, y: number, h: number): Caixa => ({x0: x, y0: y, x1: x + w, y1: y + h});
	const out = [...b.antes.map((l, n) => cx(g.antes[n].x, l.w, g.antes[n].y, LEG_LH)), ...b.depois.map((l, n) => cx(g.depois[n].x, l.w, g.depois[n].y, LEG_LH))];
	if (g.pico) out.push(cx(g.pico.x, g.pico.w, g.pico.y, PICO_ALT));
	return out;
};

/* ---------------------------------------------------------------- objeto-ponte, flash, negativo */
export const PONTES = (PJ.ponte ?? []).map((p, k) => ({
	img: p.img, de: corta(idx(p.de, `ponte[${k}].de`)), ate: corta(idx(p.ate, `ponte[${k}].ate`)),
	de_xy: p.de_xy ?? [-0.2, 0.62], ate_xy: p.ate_xy ?? [1.25, 0.3],
}));
export const FLASHES = (PJ.flash ?? []).map((r, k) => corta(idx(r, `flash[${k}]`)));
export const NEGATIVOS = (PJ.negativo ?? []).map((r, k) => corta(idx(r, `negativo[${k}]`)));

/* ---------------------------------------------------------------- o que muda na tela (eventos): ritmo e som */
export const ESTILO_PASSO = 0.17; // E10: a mesma imagem troca de estilo a cada 5 quadros
export const ESTILOS: Trat[] = ['natural', 'duotone', 'pb', 'negativo', 'arquivo'];
export type Evento = {t: number; tipo: string; i?: number};
const PISO = 0.165; // 5 quadros: nenhuma troca mais perto que isto de outra (nem do corte seguinte)
/** quantas trocas internas um plano tem (estilos, rajada, ladrilhos) e qual está na tela no tempo t */
export const passoDe = (p: Plano) => (p.tipo === 'estilos' ? ESTILO_PASSO : p.tipo === 'rajada' ? p.passo ?? 0.2 : p.tipo === 'mosaico' ? p.passo ?? 0.17 : 0);
export const nSub = (p: Plano) => {
	const passo = passoDe(p);
	if (!passo) return 0;
	const max = p.tipo === 'estilos' ? Infinity : (p.imgs ?? []).length - 1;
	let n = 0;
	while (n + 1 <= max && quadro(p.t0 + (n + 1) * passo) <= p.t1 - PISO + 1e-6) n++;
	return n;
};
export const subEm = (p: Plano, t: number) => Math.max(0, Math.min(nSub(p), Math.floor((t - p.t0) / passoDe(p) + 1e-6)));
/** cada troca visual (corte, estilo, imagem da rajada, ladrilho do mosaico) e cada evento do texto, em ordem; o som toca um efeito em cada */
export const EVENTOS: Evento[] = (() => {
	const ev: Evento[] = [];
	const nome: Record<string, string> = {estilos: 'estilo', rajada: 'rajada', mosaico: 'ladrilho'};
	for (const p of PLANOS) {
		if (p.k > 0) ev.push({t: p.t0, tipo: p.tipo === 'pessoa' ? 'corte-pessoa' : p.tipo === 'card' ? 'corte-card' : 'corte', i: p.i});
		for (let m = 1; m <= nSub(p); m++) ev.push({t: quadro(p.t0 + m * passoDe(p)), tipo: nome[p.tipo]});
		if (p.tipo === 'paineis' && p.sobe) ev.push({t: corta(idx(p.sobe, `planos[${p.k}].sobe`)), tipo: 'sobe'});
	}
	for (const b of BLOCOS) {
		if (b.pico) ev.push({t: entra(b.pico.de), tipo: `pico-${b.pico.voz}`, i: b.pico.de});
		if (b.estilo === 'heroi') for (const i of b.ids) ev.push({t: entra(i), tipo: 'tecla', i});
		if (b.estilo === 'tarja') for (const i of b.ids) ev.push({t: entra(i), tipo: 'revela', i});
	}
	for (const t of FLASHES) ev.push({t, tipo: 'flash'});
	for (const p of PONTES) ev.push({t: p.de, tipo: 'ponte-entra'}, {t: p.ate - 0.25, tipo: 'ponte-sai'});
	return ev.sort((a, b) => a.t - b.t);
})();
/** as trocas de imagem (o que o tools/ritmo.py e o olho contam): cortes, estilos e ladrilhos */
export const TROCAS = EVENTOS.filter((e) => ['corte', 'corte-pessoa', 'corte-card', 'estilo', 'rajada', 'ladrilho'].includes(e.tipo)).map((e) => e.t);
export {ERROS_PLANO};
