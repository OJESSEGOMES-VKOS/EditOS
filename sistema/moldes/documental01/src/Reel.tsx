import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as loadPoppins} from '@remotion/google-fonts/Poppins';
import PB from './palavras.json';
import PLANO from './plano.json';
import DADOS from './dados.json';

/**
 * documental01 (../../modelos/documental01/documental01.md): uma prova real fica na tela e se transforma no tempo da
 * narração. Família A (gráfico vivo): a imagem-mãe é um gráfico feito por código a partir de dado real (src/dados.json,
 * com as fontes). Família B (arquivo): a imagem-mãe é um documento, mapa ou pintura de domínio público (public/), com
 * pontos e fios que se desenham. O texto mora em três camadas fixas: rótulo (topo), título ou número (meio de cima),
 * legenda de uma palavra (66% da altura). A história desta fala (tempos, telas, números, eventos) mora em ./plano.json;
 * aqui só o desenho. Nenhum corte: o plano é um só.
 */
export const FPS = 30;
const W = 1080;
const H = 1920;
export const ZONA = {esq: 60, dir: 940, topo: 250, base: 1500};
export const CENTRO_X = 540; // texto centrado; largura máx. 2 x (940 - 540) = 800 (botões do Instagram à direita)
export const LARG_MAX = 800;
export const Y = {rotulo: 368, titulo: 505, eixo: 1152, legenda: 1270, credito: 1432}; // medidos na ref1 (19%, 26%, 60%, 66%, 74,6%)

const playfair = loadPlayfair('normal', {weights: ['400', '600', '700'], subsets: ['latin', 'latin-ext']});
loadPlayfair('italic', {weights: ['400', '600'], subsets: ['latin', 'latin-ext']});
const poppins = loadPoppins('normal', {weights: ['400', '500', '600', '800'], subsets: ['latin', 'latin-ext']});
const SERIFA = playfair.fontFamily;
const SANS = poppins.fontFamily;
export const FONTES = [SERIFA, SANS];
export const CORPO = {rotulo: 30, titulo: 96, numero: 190, numero2: 130, sub: 50, legenda: 78, credito: 19, frase: 100, ligacao: 46};

/* paletas (opção do usuário, G33). "ouro" é a padrão da família A (preto + âmbar, medido na ref1); "pergaminho" e
   "marrom" são as da família B (medidas na ref2). */
export const PALETAS = {
	ouro: {fundo: '#000000', fundo2: '#000000', texto: '#F3E8D6', acento: '#D6B38D', rotulo: '#D1B79B', legenda: '#FFFFFF', barra: '#C8985D', barraTopo: '#EBCB98', eixo: '#888166', credito: '#8C7C68', frase: '#D6B38D'},
	pergaminho: {fundo: '#E7D7C1', fundo2: '#C7A880', texto: '#3A271A', acento: '#AF6357', rotulo: '#7A5A44', legenda: '#3A271A', barra: '#9C6B45', barraTopo: '#C4925F', eixo: '#7A5A44', credito: '#7A6450', frase: '#3A271A'},
	marrom: {fundo: '#3C1F16', fundo2: '#24110E', texto: '#ECDEC6', acento: '#D6B38D', rotulo: '#D1B79B', legenda: '#FFFFFF', barra: '#C8985D', barraTopo: '#EBCB98', eixo: '#888166', credito: '#A08C74', frase: '#D6B38D'},
} as const;
type Paleta = (typeof PALETAS)[keyof typeof PALETAS];

/* ---------------------------------------------------------------- palavras e plano */
type Pal = {text: string; start: number; end: number};
export const PS = PB as Pal[];
const pare = (msg: string): never => {
	throw new Error(`\n\n[documental01] ${msg}\nO checador diz o resto: node scripts/checar.mjs\n`);
};
export const limpa = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]/g, '');
if (!PS.length) pare('src/palavras.json está vazio: rode tools/novo-video.py com a narração.');
{
	const plano = String(PLANO.fala ?? '').split(/\s+/).map(limpa).filter(Boolean);
	const fala = PS.map((p) => limpa(p.text)).filter(Boolean);
	const k = plano.findIndex((x, i) => x !== fala[i]);
	if (k >= 0 || plano.length !== fala.length) {
		const j = k >= 0 ? k : Math.min(plano.length, fala.length);
		pare(
			`O plano não bate com a fala: na palavra ${j + 1} o plano tem "${plano[j] ?? '(fim)'}" e src/palavras.json tem "${fala[j] ?? '(fim)'}". ` +
				'Refaça a história sobre a fala nova em src/plano.json (documental01.md, seção 9) e cole o texto da fala nova no campo "fala".',
		);
	}
}
/** um tempo do plano: segundos, [índice, "palavra"] (o início dela, conferida) ou [índice, "palavra", mais segundos] */
type Tempo = number | (number | string)[];
const tempo = (x: Tempo, onde: string): number => {
	if (typeof x === 'number') return x;
	const [i, palavra, mais] = x as [number, string, number?];
	const p = PS[i];
	if (!p) return pare(`src/plano.json, ${onde}: a palavra ${i} não existe (a fala tem ${PS.length}, de 0 a ${PS.length - 1}).`);
	if (limpa(p.text) !== limpa(palavra)) return pare(`src/plano.json, ${onde}: espera "${palavra}" na palavra ${i}, e a fala tem "${p.text}" (${p.start.toFixed(2)} s).`);
	return mais === undefined ? p.start : p.start + mais;
};
const talvez = (x: Tempo | null | undefined, onde: string) => (x === undefined || x === null ? null : tempo(x, onde));

type NumeroJ = {valor: number; inicio?: number; de: Tempo; para: Tempo; dito: string; sub?: string};
type TelaJ = {de: Tempo; rotulo?: string; titulo?: string; numeros?: NumeroJ[]; semana?: {dias: Tempo[]; valores: number[]; rotulos: string[]}; ligacao?: string; frase?: string};
type BarraJ = {t: Tempo; de?: number; ate?: number; nivel: number; dur: number; varre?: 'igual' | 'valor'};
type PlanoJson = {
	cauda: number;
	familia: 'A' | 'B';
	paleta: keyof typeof PALETAS;
	legenda?: boolean;
	telas: TelaJ[];
	destaques?: number[];
	inicial?: number;
	barras?: BarraJ[];
	apagao?: Tempo | null;
	camera?: {t: Tempo; x: number; y?: number; zoom: number; dur: number}[];
	marcas?: {t: Tempo; barra: number | null; nome?: string; dur?: number}[];
	reguas?: {de: Tempo; ate: Tempo; barra: number}[];
	divisao?: {de: Tempo; ate: Tempo; depois: number; rotulos: {t: Tempo; txt: string; grupo: number}[]} | null;
	pilha?: {de: Tempo; ate: Tempo; itens: number[]; junto: number; dur: number} | null;
	documento?: {arquivo: string; largura: number; altura: number; y: number; credito: string; de?: Tempo; pontos?: {t: Tempo; x: number; y: number; nome: string}[]; fios?: {de: Tempo; ate: Tempo; pontos: [number, number][]}[]} | null;
	credito: {de: Tempo; txt: string};
};
const PL = PLANO as unknown as PlanoJson;
export const FAMILIA = PL.familia;
export const COR: Paleta = PALETAS[PL.paleta] ?? pare(`paleta "${PL.paleta}" não existe (${Object.keys(PALETAS).join(', ')})`);
export const DURACAO = Math.round((PS[PS.length - 1].end + PL.cauda) * 100) / 100;

/* telas (camadas 1 e 2) */
export const TELAS = PL.telas.map((t, i) => ({
	...t,
	de: tempo(t.de, `telas[${i}].de`),
	numeros: (t.numeros ?? []).map((n, j) => ({...n, inicio: n.inicio ?? 0, de: tempo(n.de, `telas[${i}].numeros[${j}].de`), para: tempo(n.para, `telas[${i}].numeros[${j}].para`)})),
	semana: t.semana ? {...t.semana, dias: t.semana.dias.map((d, j) => tempo(d, `telas[${i}].semana.dias[${j}]`))} : undefined,
})).map((t, i, a) => ({...t, ate: i + 1 < a.length ? (a[i + 1].de as number) : DURACAO}));
export const DESTAQUES = new Set(PL.destaques ?? []);
export const APAGAO = talvez(PL.apagao, 'apagao');
export const SEM_APAGAO = PL.apagao === null; // desligado de propósito (vídeo sem clímax; o motivo vai no plano.md)
export const CREDITO = {de: tempo(PL.credito.de, 'credito.de'), txt: PL.credito.txt};

/* legenda (camada 3): uma palavra por vez, presa ao início dela. Palavra que ficaria menos de 0,4 s junta a vizinha do
   mesmo trecho (a seguinte; se ela fecha o trecho, a anterior), nunca através de pontuação (G35), máx. 3 curtas numa linha só. */
// cada bloco fica >= 0,4 s (toda palavra >= 0,4 s depois de aparecer, REGRAS §3); 3 palavras curtas, >= 0,5 s. A legenda
// aqui é a batida da voz, uma palavra por vez (ref1); quem se lê com calma é o título (1 s + 3 palavras/s, no checador).
export const legMin = (n: number) => (n >= 3 ? 0.5 : 0.4);
const fechaTrecho = (s: string) => /[.,;:!?…]$/.test(s);
export const LEGENDA: {de: number; ate: number; idx: number[]}[] = [];
if (PL.legenda ?? FAMILIA === 'A') {
	const blocos = PS.map((_, i) => [i]);
	const dura = (b: number[], prox?: number[]) => (prox ? PS[prox[0]].start : PS[b[b.length - 1]].end + 0.8) - PS[b[0]].start;
	// número curto que fecha um nome ("Gênesis 1.") vai junto do nome: sozinho, "1." não se lê
	for (let k = 1; k < blocos.length; k++) {
		const b = blocos[k];
		const ant = blocos[k - 1];
		const txt = PS[b[0]].text.replace(/[.,;:!?…]$/, '');
		if (b.length === 1 && /^\d{1,3}$/.test(txt) && ant.length < 3 && !fechaTrecho(PS[ant[ant.length - 1]].text) && /^\p{Lu}/u.test(PS[ant[ant.length - 1]].text)) {
			blocos.splice(k - 1, 2, [...ant, ...b]);
			k--;
		}
	}
	for (let k = 0; k < blocos.length; k++) {
		const b = blocos[k];
		if (dura(b, blocos[k + 1]) >= legMin(b.length) - 1e-6) continue;
		const prox = blocos[k + 1];
		const ant = blocos[k - 1];
		if (prox && b.length + prox.length <= 3 && !fechaTrecho(PS[b[b.length - 1]].text)) {
			blocos.splice(k, 2, [...b, ...prox]);
			k--;
		} else if (ant && ant.length + b.length <= 3 && !fechaTrecho(PS[ant[ant.length - 1]].text)) {
			blocos.splice(k - 1, 2, [...ant, ...b]);
			k -= 2;
		}
	}
	for (const [k, idx] of blocos.entries()) {
		const prox = blocos[k + 1];
		const ult = idx[idx.length - 1];
		const de = PS[idx[0]].start;
		const minimo = de + legMin(idx.length);
		// segue até a palavra seguinte; numa pausa longa some 0,35 s depois do fim da fala (nunca antes do mínimo)
		let ate = prox ? Math.min(PS[prox[0]].start, Math.max(PS[ult].end + 0.35, minimo)) : Math.min(DURACAO, Math.max(PS[ult].end + 0.8, minimo));
		if (prox && PS[prox[0]].start - ate < 0.12) ate = PS[prox[0]].start; // vão menor que 4 quadros pisca: emenda
		LEGENDA.push({de, ate, idx});
	}
}

/* barras (imagem-mãe da família A) */
type Item = {nome: string; valor: number; grupo: number};
export const ITENS = (DADOS as {itens: Item[]}).itens;
const N = ITENS.length;
const X0 = 60;
const X1 = 1020; // o gráfico vai de borda a borda (não é texto)
const PASSO = (X1 - X0) / Math.max(1, N);
const BW = Math.max(3, PASSO * 0.78);
const HMAX = 420; // topo da barra mais alta em y 732 (38%), abaixo do título
const FATIA = HMAX / Math.max(1, Math.max(...(DADOS as {itens: {valor: number}[]}).itens.map((d) => d.valor))); // 1 unidade (1 capítulo) em px
const VMAX = Math.max(...ITENS.map((d) => d.valor));
export const barraX = (k: number) => X0 + (k + 0.5) * PASSO;
export const barraH = (k: number) => Math.max(2, (ITENS[k].valor / VMAX) * HMAX);
const acum = ITENS.reduce<number[]>((a, d) => [...a, (a[a.length - 1] ?? 0) + d.valor], []);
const TOTAL = acum[acum.length - 1] ?? 1;

const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const saida = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3));
const cl = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

const EVB = [
	...(PL.barras ?? []).map((e, i) => ({...e, t: tempo(e.t, `barras[${i}].t`)})),
	...(APAGAO !== null ? [{t: APAGAO, nivel: 0.07, dur: 0.5}] : []),
].sort((a, b) => a.t - b.t);
// para o checador: o início de cada evento e, nos que varrem, um ponto a cada 0,3 s (a varredura é mudança visível)
const amostra = (t: number, dur: number) => Array.from({length: Math.max(1, Math.ceil(dur / 0.3) + 1)}, (_, k) => Math.min(t + dur, t + k * 0.3));
export const EVENTOS_BARRAS = EVB.flatMap((e) => (e.varre || e.dur > 0.6 ? amostra(e.t, e.dur) : [e.t]));
const nivelBarra = (k: number, t: number) => {
	let v = PL.inicial ?? 0.25;
	for (const e of EVB) {
		const i0 = e.de ?? 0;
		const i1 = e.ate ?? N - 1;
		if (k < i0 || k > i1 || t < e.t) continue;
		let s = e.t;
		let L = e.dur;
		if (e.varre) {
			L = Math.min(0.25, e.dur);
			const f = e.varre === 'valor' ? ((acum[k] ?? 0) - (i0 > 0 ? acum[i0 - 1] : 0)) / ((acum[i1] ?? TOTAL) - (i0 > 0 ? acum[i0 - 1] : 0)) : i1 > i0 ? (k - i0) / (i1 - i0) : 1;
			s = e.t + (e.dur - L) * f;
		}
		if (t < s) continue;
		v = v + (e.nivel - v) * ease((t - s) / L);
	}
	return v;
};

/* câmera: só para ler um detalhe (zoom no eixo); o texto não entra nela */
const CAM = (PL.camera ?? []).map((c, i) => ({...c, t: tempo(c.t, `camera[${i}].t`), y: c.y ?? Y.eixo})).sort((a, b) => a.t - b.t);
export const EVENTOS_CAMERA = CAM.flatMap((c) => amostra(c.t, c.dur));
const camera = (t: number) => {
	let c = {x: CENTRO_X, y: Y.eixo, zoom: 1};
	for (const k of CAM) {
		if (t < k.t) break;
		const p = ease((t - k.t) / k.dur);
		c = {x: c.x + (k.x - c.x) * p, y: c.y + (k.y - c.y) * p, zoom: c.zoom + (k.zoom - c.zoom) * p};
	}
	return c;
};
// o ponto (x, y) do gráfico na tela: a câmera mira (c.x, c.y) e o põe em (540, c.y)
const projeta = (c: {x: number; y: number; zoom: number}, x: number, y: number) => ({x: CENTRO_X + (x - c.x) * c.zoom, y: c.y + (y - c.y) * c.zoom});

const MARCAS = (PL.marcas ?? []).map((m, i) => ({...m, t: tempo(m.t, `marcas[${i}].t`), dur: m.dur ?? 0.5}));
export const EVENTOS_MARCAS = MARCAS.map((m) => m.t);
const REGUAS = (PL.reguas ?? []).map((r, i) => ({...r, de: tempo(r.de, `reguas[${i}].de`), ate: tempo(r.ate, `reguas[${i}].ate`)}));
const DIV = PL.divisao ? {...PL.divisao, de: tempo(PL.divisao.de, 'divisao.de'), ate: tempo(PL.divisao.ate, 'divisao.ate'), rotulos: PL.divisao.rotulos.map((r, i) => ({...r, t: tempo(r.t, `divisao.rotulos[${i}].t`)}))} : null;
const PILHA = PL.pilha ? {...PL.pilha, de: tempo(PL.pilha.de, 'pilha.de'), ate: tempo(PL.pilha.ate, 'pilha.ate')} : null;
const DOC = PL.documento
	? {
			...PL.documento,
			de: talvez(PL.documento.de, 'documento.de') ?? 0,
			pontos: (PL.documento.pontos ?? []).map((p, i) => ({...p, t: tempo(p.t, `documento.pontos[${i}].t`)})),
			fios: (PL.documento.fios ?? []).map((f, i) => ({...f, de: tempo(f.de, `documento.fios[${i}].de`), ate: tempo(f.ate, `documento.fios[${i}].ate`)})),
		}
	: null;
export const EVENTOS_DOC = DOC ? [...DOC.pontos.map((p) => p.t), ...DOC.fios.flatMap((f) => [f.de, f.ate])] : [];
export const EXTRAS = {
	reguas: REGUAS,
	divisao: DIV,
	pilha: PILHA,
};

/* ---------------------------------------------------------------- desenho */
export const fmt = (v: number) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const contador = (n: {valor: number; inicio: number; de: number; para: number}, t: number) => (t >= n.para ? n.valor : t <= n.de ? n.inicio : n.inicio + (n.valor - n.inicio) * saida((t - n.de) / (n.para - n.de)));

/** "texto com *itálico na cor de destaque*", "|" quebra a linha */
const Marcado: React.FC<{txt: string; cor: string; acento: string; corpo: number; peso?: number}> = ({txt, cor, acento, corpo, peso = 400}) => (
	<>
		{txt.split('|').map((linha, i) => (
			<div key={i} style={{lineHeight: 1.12}}>
				{linha.split(/(\*[^*]+\*)/).map((p, j) =>
					p.startsWith('*') ? (
						<span key={j} style={{fontStyle: 'italic', color: acento, fontWeight: 600}}>
							{p.slice(1, -1)}
						</span>
					) : (
						<span key={j} style={{color: cor, fontWeight: peso}}>
							{p}
						</span>
					),
				)}
			</div>
		))}
	</>
);

const Fundo: React.FC = () =>
	COR.fundo === COR.fundo2 ? (
		<AbsoluteFill style={{background: COR.fundo}} />
	) : (
		<AbsoluteFill style={{background: `radial-gradient(ellipse 85% 70% at 50% 40%, ${COR.fundo} 0%, ${COR.fundo} 45%, ${COR.fundo2} 100%)`}} />
	);

const Barras: React.FC<{t: number}> = ({t}) => {
	const c = camera(t);
	const tr = `translate(${CENTRO_X} ${c.y}) scale(${c.zoom}) translate(${-c.x} ${-c.y})`;
	const niveis = ITENS.map((_, k) => nivelBarra(k, t));
	const barra = (k: number, refl: boolean) => {
		const lv = niveis[k];
		const h = barraH(k);
		const op = cl(0.1 + 0.9 * Math.min(1, lv), 0, 1);
		// a barra é feita das unidades dela: um fio escuro a cada unidade (cada capítulo), visível quando a câmera chega perto
		return (
			<g key={(refl ? 'r' : 'b') + k} opacity={op}>
				<rect x={barraX(k) - BW / 2} y={Y.eixo - h} width={BW} height={h} rx={Math.min(2, BW / 3)} fill="url(#gBarra)" />
				{FATIA >= 2 ? <rect x={barraX(k) - BW / 2} y={Y.eixo - h} width={BW} height={h} fill="url(#pFatia)" /> : null}
			</g>
		);
	};
	// pilha: cópias das barras escolhidas viajam e se empilham ao lado de outra (a soma, sem número inventado)
	let pilha: React.ReactNode = null;
	if (PILHA && t >= PILHA.de && t < PILHA.ate + 0.4) {
		const sai = 1 - cl((t - PILHA.ate) / 0.4);
		let base = Y.eixo;
		pilha = PILHA.itens.map((k, j) => {
			const p = ease((t - PILHA.de - j * 0.12) / Math.max(0.3, PILHA.dur - 0.36));
			const h = barraH(k);
			const xAlvo = barraX(PILHA.junto) + PASSO * 1.1;
			const x = barraX(k) + (xAlvo - barraX(k)) * p;
			const yAlvo = base - h;
			base -= h;
			const y = Y.eixo - h + (yAlvo - (Y.eixo - h)) * p;
			return <rect key={'p' + k} x={x - BW / 2} y={y} width={BW} height={h - 1} rx={1.5} fill={COR.texto} opacity={0.9 * sai} />;
		});
	}
	const brilho = ITENS.map((_, k) => (niveis[k] > 1.02 ? k : -1)).filter((k) => k >= 0);
	return (
		<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
			<defs>
				<linearGradient id="gBarra" x1="0" y1="1" x2="0" y2="0">
					<stop offset="0" stopColor={COR.barra} />
					<stop offset="1" stopColor={COR.barraTopo} />
				</linearGradient>
				<linearGradient id="gRefl" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#fff" stopOpacity="0.42" />
					<stop offset="1" stopColor="#fff" stopOpacity="0" />
				</linearGradient>
				<mask id="mRefl">
					<rect x={-2000} y={Y.eixo} width={6000} height={330} fill="url(#gRefl)" />
				</mask>
				<pattern id="pFatia" patternUnits="userSpaceOnUse" x={0} y={Y.eixo} width={W} height={FATIA}>
					<rect x={0} y={0} width={W} height={Math.min(1, FATIA * 0.35)} fill="#000" opacity={0.55} />
				</pattern>
				<filter id="fBloom" x="-10%" y="-30%" width="120%" height="160%">
					<feGaussianBlur stdDeviation="16" />
				</filter>
				<radialGradient id="gLuz" cx="0.5" cy="0.5" r="0.5">
					<stop offset="0" stopColor={COR.barra} stopOpacity="0.55" />
					<stop offset="0.6" stopColor={COR.barra} stopOpacity="0.12" />
					<stop offset="1" stopColor={COR.barra} stopOpacity="0" />
				</radialGradient>
				<filter id="fBrilho" x="-200%" y="-20%" width="500%" height="140%">
					<feGaussianBlur stdDeviation="10" />
				</filter>
			</defs>
			{/* a luz que as barras acesas jogam em volta (a ref1 é um domo luminoso): cresce com o quanto o gráfico está aceso */}
			<ellipse cx={CENTRO_X} cy={Y.eixo} rx={560} ry={480} fill="url(#gLuz)" opacity={0.5 * cl(niveis.reduce((a, b) => a + Math.min(1, b), 0) / N)} />
			<g transform={tr}>
				{brilho.map((k) => (
					<rect key={'g' + k} x={barraX(k) - BW} y={Y.eixo - barraH(k) - 6} width={BW * 2} height={barraH(k) + 6} fill={COR.barraTopo} opacity={cl((niveis[k] - 1) * 1.6)} filter="url(#fBrilho)" />
				))}
				<g filter="url(#fBloom)" opacity={0.9}>
					{ITENS.map((_, k) => (
						<rect key={'l' + k} x={barraX(k) - BW / 2} y={Y.eixo - barraH(k)} width={BW} height={barraH(k)} fill={COR.barra} opacity={cl(0.1 + 0.9 * Math.min(1, niveis[k]))} />
					))}
				</g>
				{ITENS.map((_, k) => barra(k, false))}
				{pilha}
				<g mask="url(#mRefl)">
					<g transform={`translate(0 ${2 * Y.eixo}) scale(1 -1)`}>{ITENS.map((_, k) => barra(k, true))}</g>
				</g>
			</g>
			<line x1={0} x2={W} y1={c.y + (Y.eixo - c.y) * c.zoom} y2={c.y + (Y.eixo - c.y) * c.zoom} stroke={COR.eixo} strokeWidth={1.5} />
			<Sobreposicoes t={t} c={c} />
		</svg>
	);
};

/** marcador, régua e divisão: em coordenada de tela (a letra não cresce com o zoom) */
const Sobreposicoes: React.FC<{t: number; c: {x: number; y: number; zoom: number}}> = ({t, c}) => {
	const out: React.ReactNode[] = [];
	// marcador que corre o eixo
	const ativas = MARCAS.filter((m) => t >= m.t);
	const m = ativas[ativas.length - 1];
	if (m && m.barra !== null) {
		const ant = ativas.length > 1 ? ativas[ativas.length - 2] : null;
		const xDe = ant && ant.barra !== null ? barraX(ant.barra) : barraX(m.barra);
		const p = ease((t - m.t) / m.dur);
		const xg = xDe + (barraX(m.barra) - xDe) * p;
		const hg = ant && ant.barra !== null ? barraH(ant.barra) + (barraH(m.barra) - barraH(ant.barra)) * p : barraH(m.barra);
		const base = projeta(c, xg, Y.eixo);
		const topo = projeta(c, xg, Y.eixo - hg);
		const entra = ant && ant.barra !== null ? 1 : cl((t - m.t) / 0.2);
		const rot = p >= 1 ? cl((t - m.t - m.dur) / 0.15) : 0;
		const yRot = topo.y - 58;
		out.push(
			<g key="marca" opacity={entra}>
				<circle cx={base.x} cy={base.y} r={6} fill={COR.texto} />
				<line x1={base.x} x2={base.x} y1={base.y} y2={yRot + 14} stroke={COR.texto} strokeWidth={1.5} opacity={0.75} />
				{m.nome ? (
					<g opacity={rot}>
						<rect x={base.x - (m.nome.length * 13.5 + 36) / 2} y={yRot - 22} width={m.nome.length * 13.5 + 36} height={40} rx={20} fill={COR.fundo} stroke={COR.acento} strokeWidth={1.5} />
						<text x={base.x} y={yRot + 6} textAnchor="middle" fill={COR.texto} style={{fontFamily: SANS, fontWeight: 600, fontSize: 20, letterSpacing: '0.12em'}}>
							{m.nome}
						</text>
					</g>
				) : null}
			</g>,
		);
	}
	for (const [i, R] of REGUAS.entries()) {
		if (t < R.de || t >= R.ate + 0.3) continue;
		const p = saida((t - R.de) / 0.6);
		const sai = 1 - cl((t - R.ate) / 0.3);
		const x = barraX(R.barra) + PASSO * 0.9;
		const a = projeta(c, x, Y.eixo);
		const b = projeta(c, x, Y.eixo - barraH(R.barra) * p);
		out.push(
			<g key={'regua' + i} opacity={sai} stroke={COR.acento} strokeWidth={2}>
				<line x1={a.x} x2={b.x} y1={a.y} y2={b.y} />
				<line x1={a.x - 7} x2={a.x + 7} y1={a.y} y2={a.y} />
				<line x1={b.x - 7} x2={b.x + 7} y1={b.y} y2={b.y} />
			</g>,
		);
	}
	if (DIV && t >= DIV.de && t < DIV.ate + 0.4) {
		const sai = 1 - cl((t - DIV.ate) / 0.4);
		const xd = (barraX(DIV.depois) + barraX(DIV.depois + 1)) / 2;
		const a = projeta(c, xd, Y.eixo);
		const p = saida((t - DIV.de) / 0.5);
		out.push(<line key="div" x1={a.x} x2={a.x} y1={a.y} y2={a.y - (a.y - 700) * p} stroke={COR.acento} strokeWidth={1.5} strokeDasharray="6 8" opacity={0.8 * sai} />);
		for (const r of DIV.rotulos) {
			if (t < r.t) continue;
			const ks = ITENS.map((d, k) => (d.grupo === r.grupo ? k : -1)).filter((k) => k >= 0);
			const xm = projeta(c, (barraX(ks[0]) + barraX(ks[ks.length - 1])) / 2, Y.eixo).x;
			out.push(
				<text key={'dr' + r.txt} x={xm} y={712} textAnchor="middle" fill={COR.rotulo} opacity={sai * cl((t - r.t) / 0.25)} style={{fontFamily: SANS, fontWeight: 500, fontSize: 22, letterSpacing: '0.22em'}}>
					{r.txt}
				</text>,
			);
		}
	}
	return <>{out}</>;
};

/** família B: o documento real (pintura, mapa, página) com pontos e fios que se desenham */
const Documento: React.FC<{t: number}> = ({t}) => {
	if (!DOC) return null;
	const entra = cl((t - DOC.de) / 0.5);
	// na família B o zoom fica preso no topo da obra: ela cresce para baixo e nunca cobre a frase (y 400-640)
	const c0 = camera(t);
	const c = {...c0, y: DOC.y};
	const x0 = CENTRO_X - DOC.largura / 2;
	return (
		<AbsoluteFill style={{opacity: entra}}>
			<div style={{position: 'absolute', inset: 0, transform: `translate(${CENTRO_X}px, ${c.y}px) scale(${c.zoom}) translate(${-c.x}px, ${-c.y}px)`, transformOrigin: '0 0'}}>
				<Img src={staticFile(DOC.arquivo)} style={{position: 'absolute', left: x0, top: DOC.y, width: DOC.largura, height: DOC.altura, objectFit: 'cover', boxShadow: '0 30px 80px rgba(0,0,0,0.35)'}} />
				<svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
					{DOC.fios.map((f, i) => {
						const p = saida((t - f.de) / Math.max(0.2, f.ate - f.de));
						if (p <= 0) return null;
						const d = f.pontos.map(([x, y], j) => `${j ? 'L' : 'M'}${x0 + x * DOC.largura} ${DOC.y + y * DOC.altura}`).join(' ');
						return <path key={i} d={d} fill="none" stroke={COR.acento} strokeWidth={4 / c.zoom} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />;
					})}
					{DOC.pontos.map((p, i) =>
						t >= p.t ? (
							<g key={i} opacity={cl((t - p.t) / 0.25)}>
								<circle cx={x0 + p.x * DOC.largura} cy={DOC.y + p.y * DOC.altura} r={9 / c.zoom} fill={COR.acento} stroke={COR.fundo} strokeWidth={3 / c.zoom} />
								<rect x={x0 + p.x * DOC.largura + 10 / c.zoom} y={DOC.y + p.y * DOC.altura - 22 / c.zoom} width={(p.nome.length * 15 + 16) / c.zoom} height={40 / c.zoom} rx={8 / c.zoom} fill={COR.fundo} opacity={0.88} />
								<text x={x0 + p.x * DOC.largura + 18 / c.zoom} y={DOC.y + p.y * DOC.altura + 8 / c.zoom} fill={COR.texto} style={{fontFamily: SERIFA, fontStyle: 'italic', fontWeight: 600, fontSize: 30 / c.zoom}}>
									{p.nome}
								</text>
							</g>
						) : null,
					)}
				</svg>
			</div>
			{/* o crédito da obra sai quando o crédito final (que lista as obras) entra: os dois nunca se sobrepõem */}
			<div style={{position: 'absolute', top: Math.min(DOC.y + DOC.altura + 14, ZONA.base - 64), left: CENTRO_X - LARG_MAX / 2, width: LARG_MAX, textAlign: 'center', opacity: 1 - cl((t - CREDITO.de) / 0.3)}}>
				<span style={{display: 'inline-block', padding: '4px 14px', borderRadius: 8, background: COR.fundo, fontFamily: SERIFA, fontStyle: 'italic', fontSize: 22, lineHeight: 1.3, color: COR.credito}}>{DOC.credito}</span>
			</div>
		</AbsoluteFill>
	);
};

const SEMANA = {cel: 96, alt: 116, vao: 14};
const Tela: React.FC<{tela: (typeof TELAS)[number]; t: number}> = ({tela, t}) => {
	// troca curta entre telas (a ref1 dissolve em ~0,3 s): a velha sai nos 0,15 s antes da palavra da nova e a nova
	// entra em 0,2 s nela, sem as duas se sobreporem; a 1ª tela já está no quadro 0 (gancho escrito)
	const dentro = tela.de <= 0.001 ? 1 : cl((t - tela.de) / 0.2);
	const fora = tela.ate >= DURACAO ? 1 : 1 - cl((t - (tela.ate - 0.15)) / 0.15);
	const op = Math.min(dentro, fora);
	if (op <= 0) return null;
	const nums = tela.numeros ?? [];
	return (
		<AbsoluteFill style={{opacity: op}}>
			{tela.rotulo ? (
				<div style={{position: 'absolute', top: Y.rotulo - 22, left: CENTRO_X - LARG_MAX / 2, width: LARG_MAX, textAlign: 'center', fontFamily: SANS, fontWeight: 500, fontSize: CORPO.rotulo, letterSpacing: '0.24em', color: COR.rotulo, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>
					{tela.rotulo}
				</div>
			) : null}
			{tela.titulo ? (
				<div style={{position: 'absolute', top: 410, left: CENTRO_X - LARG_MAX / 2, width: LARG_MAX, textAlign: 'center', fontFamily: SERIFA, fontSize: CORPO.titulo}}>
					<Marcado txt={tela.titulo} cor={COR.texto} acento={COR.acento} corpo={CORPO.titulo} />
				</div>
			) : null}
			{tela.frase ? (
				<div style={{position: 'absolute', top: 400, left: CENTRO_X - LARG_MAX / 2, width: LARG_MAX, textAlign: 'center', fontFamily: SERIFA}}>
					{tela.ligacao ? <div style={{fontStyle: 'italic', fontSize: CORPO.ligacao, color: COR.frase === COR.texto ? COR.acento : COR.texto, opacity: 0.9, marginBottom: 6}}>{tela.ligacao}</div> : null}
					<div style={{fontWeight: 700, fontSize: CORPO.frase, lineHeight: 1.05, color: COR.frase, filter: `blur(${(1 - cl((t - tela.de) / 0.3)) * 14}px)`}}>{tela.frase}</div>
				</div>
			) : null}
			{nums.map((n, j) => {
				const dois = nums.length > 1;
				const cx = dois ? (j === 0 ? 330 : 730) : CENTRO_X;
				const nasce = cl((t - n.de) / 0.15);
				return (
					<div key={j} style={{position: 'absolute', top: dois ? 430 : 400, left: cx - 200, width: 400, textAlign: 'center', opacity: nasce}}>
						<div style={{fontFamily: SERIFA, fontWeight: 600, fontSize: dois ? CORPO.numero2 : CORPO.numero, lineHeight: 1, color: COR.texto, fontVariantNumeric: 'lining-nums tabular-nums'}}>{fmt(contador(n, t))}</div>
						{n.sub ? (
							<div style={{fontFamily: SERIFA, fontSize: dois ? 40 : CORPO.sub, marginTop: 8, whiteSpace: 'nowrap'}}>
								<Marcado txt={n.sub} cor={COR.acento} acento={COR.texto} corpo={CORPO.sub} />
							</div>
						) : null}
					</div>
				);
			})}
			{tela.semana
				? (() => {
						const s = tela.semana;
						const n = s.valores.length;
						const larg = n * SEMANA.cel + (n - 1) * SEMANA.vao;
						return s.valores.map((v, j) => {
							const p = saida((t - s.dias[j]) / 0.25);
							if (p <= 0) return null;
							const ultimo = j === n - 1 && v !== s.valores[0];
							return (
								<div key={j} style={{position: 'absolute', top: 470, left: CENTRO_X - larg / 2 + j * (SEMANA.cel + SEMANA.vao), width: SEMANA.cel, height: SEMANA.alt, borderRadius: 14, border: `1.5px solid ${ultimo ? COR.acento : COR.rotulo}`, background: ultimo ? 'rgba(214,179,141,0.16)' : 'transparent', opacity: p, transform: `translateY(${(1 - p) * 16}px)`, textAlign: 'center'}}>
									<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 18, letterSpacing: '0.16em', color: COR.rotulo, marginTop: 14}}>{s.rotulos[j]}</div>
									<div style={{fontFamily: SERIFA, fontWeight: 600, fontSize: 56, lineHeight: 1.1, color: ultimo ? COR.acento : COR.texto}}>{v}</div>
								</div>
							);
						});
					})()
				: null}
		</AbsoluteFill>
	);
};

const Legenda: React.FC<{t: number}> = ({t}) => {
	const b = LEGENDA.find((x) => t >= x.de && t < x.ate);
	if (!b) return null;
	const txt = b.idx.map((i) => PS[i].text.toUpperCase());
	const nChars = txt.join(' ').length;
	const corpo = Math.min(CORPO.legenda, LARG_MAX / (nChars * 0.7));
	const p = cl((t - b.de) / 0.08);
	return (
		<div style={{position: 'absolute', top: Y.legenda - corpo * 0.62, left: CENTRO_X - LARG_MAX / 2, width: LARG_MAX, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: corpo, lineHeight: 1.2, opacity: p, transform: `scale(${0.97 + 0.03 * p})`, whiteSpace: 'nowrap'}}>
			{b.idx.map((i, j) => (
				<span key={i} style={{color: DESTAQUES.has(i) ? COR.acento : COR.legenda}}>
					{(j ? ' ' : '') + PS[i].text.toUpperCase()}
				</span>
			))}
		</div>
	);
};

const Credito: React.FC<{t: number}> = ({t}) =>
	t < CREDITO.de ? null : (
		<div style={{position: 'absolute', top: Y.credito - 12, left: CENTRO_X - LARG_MAX / 2, width: LARG_MAX, textAlign: 'center', opacity: cl((t - CREDITO.de) / 0.4)}}>
			<span style={{display: 'inline-block', padding: FAMILIA === 'B' ? '4px 14px' : 0, borderRadius: 8, background: FAMILIA === 'B' ? COR.fundo : 'transparent', fontFamily: SANS, fontWeight: 400, fontSize: CORPO.credito, letterSpacing: '0.06em', textTransform: 'uppercase', color: COR.credito, lineHeight: 1.5}}>{CREDITO.txt}</span>
		</div>
	);

export const Documental01: React.FC = () => {
	const t = useCurrentFrame() / FPS;
	return (
		<AbsoluteFill style={{background: COR.fundo}}>
			<Fundo />
			{FAMILIA === 'A' ? <Barras t={t} /> : <Documento t={t} />}
			{TELAS.map((tela, i) => (t >= tela.de - 0.01 && t < tela.ate ? <Tela key={i} tela={tela} t={t} /> : null))}
			<Legenda t={t} />
			<Credito t={t} />
		</AbsoluteFill>
	);
};
