import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadSerif} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as loadScript} from '@remotion/google-fonts/GreatVibes';
import PB from './palavras.json';
import ROSTO_T from './rosto.json';

/**
 * Molde do especialista (../../modelos/especialista/especialista.md): o especialista renomado.
 * Base calma (a pessoa e uma legenda serifada pequena no peito) e quatro modos com sentido fixo, todos no mesmo lugar:
 * GIGANTE (peso: gancho, virada, ordem), CURSIVA escrita à mão (nome do conceito, frase-tese), CITAÇÃO em P&B com
 * legenda dourada (fala citada) e FECHO (serifa + cursiva: aforismo ou o comando). Todo modo especial entra num corte
 * seco com aproximação e sai num clarão de película na cor da cena; o vídeo termina em preto.
 * Nasceu em 2026-11-03 da gramática medida em treinamento/especialista-renomado (ref1 = DeziDpVAqAV), sem copiar nada
 * dela. O plano abaixo é o da vitrine (a gravação comum, sistema/teste-comum/).
 */
export const FPS = 30;
const serif = loadSerif('normal', {weights: ['500', '700', '800'], subsets: ['latin']});
const script = loadScript('normal', {weights: ['400'], subsets: ['latin']});
const SERIF = serif.fontFamily;
const SCRIPT = script.fontFamily;
const E = {out: Easing.bezier(0.16, 1, 0.3, 1), io: Easing.bezier(0.45, 0, 0.55, 1)};
const tw = (t: number, a: number, b: number, v0: number, v1: number, e = E.out) =>
	interpolate(t, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

/** pb: o modo citação deixa a imagem em preto e branco (vem ligado; false = só desfoque e legenda dourada) */
export type Props = {pb: boolean};

type Pal = {texto: string; de: number; ate: number};
export const PS: Pal[] = (PB as {text: string; start: number; end: number}[]).map((p) => ({texto: p.text, de: p.start, ate: p.end}));
if (!PS.length) throw new Error('src/palavras.json está vazio: este molde precisa da fala transcrita (tools/novo-video.py).');

/* ---------------------------------------------------------------- conferência do plano contra a fala (ao carregar) */
const sem = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9%]/g, '');
const foraDaFala = (onde: string, oque: string): never => {
	throw new Error(
		`O plano não bate com a fala de src/palavras.json (${PS.length} palavras).\nsrc/Reel.tsx, ${onde}: ${oque}.\n` +
			'Refaça a seção "O PLANO" de src/Reel.tsx para a fala nova (modelos/especialista/especialista.md, seção 9) e rode node scripts/checar.mjs.',
	);
};
const pw = (i: number, esperada: string, onde: string): Pal => {
	if (!Number.isInteger(i) || i < 0 || i >= PS.length) return foraDaFala(onde, `pede a palavra ${i}, mas a fala só vai de 0 a ${PS.length - 1}`);
	if (sem(PS[i].texto) !== sem(esperada)) foraDaFala(onde, `a palavra ${i} da fala é "${PS[i].texto}", o plano espera "${esperada}"`);
	return PS[i];
};
const palavrasDe = (txt: string) => txt.replace(/\s*\/\s*/g, ' ').split(' ').filter(Boolean);
const trecho = (i0: number, texto: string, onde: string) => palavrasDe(texto).map((p, k) => pw(i0 + k, p, onde));

/* ================================================================ O PLANO (refazer num vídeo novo; o resto do arquivo é o modelo)
 * Cada índice é a posição da palavra em src/palavras.json, com o texto esperado ao lado (o molde para se não bater).
 * '/' quebra a linha. Depois de mexer: node scripts/checar.mjs até sair APROVADO. */

/** a cor tirada da cena e da roupa (scripts/cor_da_cena.py mede e sugere): letra creme, ouro da citação, traço, clarão */
export const C = {letra: '#F2EDE9', ouro: '#E2A665', traco: '#C9473B', claro: '#FAEBDB', quente: '#E7AC6A'}; // medido na gravação comum (parede bege, 32°)

/** os modos especiais, na ordem da fala. gigante: grupos de 1 ou 2 palavras, um por vez; cursiva: até 2 linhas escritas
 * à mão; citacao: páginas de legenda dourada sobre a imagem em P&B ([1ª palavra, 'texto / 2ª linha']) */
type Gig = {tipo: 'gigante'; primeira: number; grupos: string[]};
type Cur = {tipo: 'cursiva'; primeira: number; linhas: string[]};
type Cit = {tipo: 'citacao'; paginas: [number, string][]};
type ModoDef = Gig | Cur | Cit;
const MODOS_DEF: ModoDef[] = [
	{tipo: 'gigante', primeira: 0, grupos: ['Esse vídeo', 'está sendo', '100%', 'editado', 'pelo Claude.']}, // gancho
	{tipo: 'cursiva', primeira: 41, linhas: ['você está vendo apenas', 'um desses modelos.']}, // a tese do vídeo
	{tipo: 'gigante', primeira: 67, grupos: ['ver outros', 'modelos', 'de edição', 'como esse']}, // o convite (o protagonista; "Mas se você quiser realmente" fica na base: advérbio não vira destaque, G19)
];
/** o traço vermelho sob UMA palavra de um modo gigante (a palavra-alvo do gancho), uma vez no vídeo; null desliga */
const TRACO: [number, string] | null = [7, 'Claude.'];
/** trocas de plano na base (corte seco de reenquadramento numa frase nova, sem modo): [índice, palavra, zoom 1,0 a 1,08] */
const REENQUADRES: [number, string, number][] = [[34, 'Inclusive,', 1.06]];
/** fecho: a linha em serifa e a palavra em cursiva (aforismo, ou o comando com a palavra a comentar entre aspas); null desliga */
const FECHO_DEF: {serifa: [number, string]; cursiva: [number, string]; aspas: boolean} | null = {serifa: [83, 'comenta'], cursiva: [84, 'edição'], aspas: true};
/** legenda da base: [1ª palavra, 'texto / 2ª linha']. Uma página = um trecho (acaba na pontuação); depois do fecho, as
 * páginas vão para a 2ª posição, abaixo dele */
const PEDACOS: [number, string][] = [
	[8, 'Ele foi criado justamente / para te mostrar'],
	[15, 'a diferença entre vários modelos / que eu criei e melhorei'],
	[25, 'para editar qualquer tipo / de vídeo usando o Claude.'],
	[34, 'Inclusive,'],
	[35, 'se você estiver / no Instagram agora,'],
	[48, 'Eu posso até colocar / duas prévias rápidas'],
	[55, 'aqui em cima,'],
	[58, 'aceleradas em três vezes.'],
	[62, 'Mas se você quiser / realmente'],
	[74, 'e aprender a como usar / isso nos seus vídeos,'],
	[85, 'aqui embaixo que eu vou / te mandar na sua DM agora.'],
];
/* ================================================================ fim do plano */

/* ---------------------------------------------------------------- tempos derivados do plano */
export const SEGURA = 1.16; // depois da última palavra o quadro segura (ref1 66,64 -> 67,8)
export const PRETO = 1.2; // e fecha em preto (ref1 67,8 -> 69,0)
export const FIM_FALA = PS[PS.length - 1].ate;
export const DURACAO = Math.round((FIM_FALA + SEGURA + PRETO) * 100) / 100;
export const CLARAO = {sobe: 0.26, pico: 0.36, dur: 0.84}; // 0,77 a 0,90 s na ref1
export const ZOOM_MODO = 1.15; // aproximação na entrada do modo (ref1: 10 a 30%)

export type Modo = {def: ModoDef; i0: number; i1: number; de: number; k: number; nome: string};
export const MODOS: Modo[] = MODOS_DEF.map((m, j) => {
	const onde = `MODOS_DEF, o modo ${j + 1} (${m.tipo})`;
	let i0: number, n: number;
	if (m.tipo === 'gigante') { i0 = m.primeira; n = trecho(i0, m.grupos.join(' '), onde).length; }
	else if (m.tipo === 'cursiva') { i0 = m.primeira; n = trecho(i0, m.linhas.join(' '), onde).length; }
	else {
		i0 = m.paginas[0][0];
		m.paginas.forEach(([a, txt], q) => {
			trecho(a, txt, `${onde}, página ${q + 1}`);
			const prox = m.paginas[q + 1];
			if (prox && prox[0] !== a + palavrasDe(txt).length) foraDaFala(onde, `a página ${q + 2} tem que começar na palavra ${a + palavrasDe(txt).length}`);
		});
		const ult = m.paginas[m.paginas.length - 1];
		n = ult[0] + palavrasDe(ult[1]).length - i0;
	}
	const i1 = i0 + n - 1;
	const de = i0 === 0 ? 0 : PS[i0].de - 0.06; // o corte cai 2 quadros antes da 1ª palavra
	const k = PS[i1].ate - 0.05; // o clarão nasce na última palavra
	return {def: m, i0, i1, de, k, nome: `${m.tipo} "${PS[i0].texto} … ${PS[i1].texto}"`};
});
for (let j = 1; j < MODOS.length; j++) if (MODOS[j].de < MODOS[j - 1].k + CLARAO.dur * 0.5) foraDaFala(`MODOS_DEF, o modo ${j + 1}`, 'começa antes do clarão do modo anterior acabar');
if (TRACO) {
	pw(TRACO[0], TRACO[1], `TRACO [${TRACO[0]}, '${TRACO[1]}']`);
	if (!MODOS.some((m) => m.def.tipo === 'gigante' && TRACO[0] >= m.i0 && TRACO[0] <= m.i1)) foraDaFala('TRACO', 'o traço só existe dentro de um modo gigante');
}
REENQUADRES.forEach(([i, p]) => pw(i, p, `REENQUADRES [${i}, '${p}']`));
/** hora em que o traço começa a se desenhar (para o som) */
export const TRACO_T = TRACO ? PS[TRACO[0]].de + 0.08 : null;
export const FECHO = FECHO_DEF
	? (() => {
			pw(FECHO_DEF.serifa[0], FECHO_DEF.serifa[1], 'FECHO_DEF.serifa');
			pw(FECHO_DEF.cursiva[0], FECHO_DEF.cursiva[1], 'FECHO_DEF.cursiva');
			return {...FECHO_DEF, de: PS[FECHO_DEF.serifa[0]].de - 0.06};
		})()
	: null;

/** clarões: um no fim de cada modo; intensidade 0 a 1 */
export const CLAROES = MODOS.map((m) => m.k);
const claraoEm = (t: number) =>
	Math.max(0, ...CLAROES.map((k) => (t < k || t > k + CLARAO.dur ? 0 : t < k + CLARAO.sobe ? tw(t, k, k + CLARAO.sobe, 0, 1, E.io) : t < k + CLARAO.pico ? 1 : tw(t, k + CLARAO.pico, k + CLARAO.dur, 1, 0, E.io))));
/** o modo que está na tela em t (ele fica até o pico do clarão, que esconde a volta para a base) */
export const modoEm = (t: number) => MODOS.find((m) => t >= m.de && t < m.k + 0.3) ?? null;
/** texto que nasceria no meio da subida do clarão espera o branco (ref1: a legenda seguinte já aparece dentro do clarão) */
const depoisDoClarao = (de: number) => CLAROES.reduce((a, k) => (a >= k - 0.3 && a < k + 0.2 ? k + 0.2 : a), de);

/* ---------------------------------------------------------------- câmera: a base deriva devagar; o modo aproxima no corte
 * O zoom nasce da linha do queixo (o queixo fica no lugar, o rosto cresce para cima): o texto do peito nunca é invadido. */
const ROS = ROSTO_T as number[][];
const p = (xs: number[], q: number) => (xs.length ? [...xs].sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor(q * xs.length))] : 0);
export const QUEIXO = ROS.length ? Math.round(p(ROS.map(([, , cy, h]) => (cy + h / 2) * 1920), 0.98)) : 900;
export const ORIGEM = {x: ROS.length ? Math.round(p(ROS.map(([, cx]) => cx * 1080), 0.5)) : 540, y: QUEIXO};
type Trecho = {a: number; b: number; z0: number; modo: boolean};
export const TRECHOS: Trecho[] = (() => {
	const pontos: {t: number; z: number; modo: boolean}[] = [{t: 0, z: 1, modo: false}];
	for (const m of MODOS) { pontos.push({t: m.de, z: ZOOM_MODO, modo: true}); pontos.push({t: m.k + 0.3, z: -1, modo: false}); }
	for (const [i, , z] of REENQUADRES) pontos.push({t: PS[i].de - 0.06, z, modo: false});
	pontos.sort((x, y) => x.t - y.t);
	let zb = 1;
	const out: Trecho[] = [];
	pontos.forEach((mk, j) => {
		if (!mk.modo && mk.z > 0) zb = mk.z;
		const fim = j + 1 < pontos.length ? pontos[j + 1].t : DURACAO;
		if (fim > mk.t + 1e-6) out.push({a: mk.t, b: fim, z0: mk.modo ? ZOOM_MODO : zb, modo: mk.modo});
	});
	return out;
})();
/** zoom em t: dentro do trecho deriva no máximo 0,8% por segundo, até +3% (bem lento) */
export const zoomEm = (t: number) => {
	const tr = TRECHOS.find((x) => t >= x.a && t < x.b) ?? TRECHOS[TRECHOS.length - 1];
	return tr.z0 * (1 + Math.min(0.008 * (t - tr.a), 0.03));
};
/** os cortes secos de câmera (entrada de modo e reenquadre); a volta do modo fica escondida no clarão */
export const CORTES_ZOOM = [...MODOS.filter((m) => m.de > 0).map((m) => m.de), ...REENQUADRES.map(([i]) => PS[i].de - 0.06)].sort((a, b) => a - b);
/** rosto com a câmera em t: queixo e topo da cabeça (~0,25 da altura do rosto acima da caixa), em px */
export const rostoEm = (t: number) => {
	if (!ROS.length) return null;
	const r = ROS.reduce((a, b) => (Math.abs(b[0] - t) < Math.abs(a[0] - t) ? b : a));
	const z = zoomEm(t);
	const y = (v: number) => ORIGEM.y + (v * 1920 - ORIGEM.y) * z;
	return {queixo: y(r[2] + r[3] / 2), topo: y(r[2] - r[3] / 2 - 0.25 * r[3]), x0: ORIGEM.x + (r[1] * 1080 - (r[3] * 1920 * 0.42) - ORIGEM.x) * z, x1: ORIGEM.x + (r[1] * 1080 + r[3] * 1920 * 0.42 - ORIGEM.x) * z};
};

/* ---------------------------------------------------------------- o lugar do texto: UMA posição, no peito
 * Centro de todo texto em Y_TEXTO: 49% do quadro (ref1) ou, se o queixo desta gravação descer mais, logo abaixo dele com
 * folga para o maior bloco (a cursiva de 2 linhas). A 2ª posição só existe depois do fecho, para a fala que segue o comando. */
export const ZONA = {esq: 60, dir: 940, topo: 250, base: 1500};
export const ZW = ZONA.dir - ZONA.esq;
export const LEG = 58; // corpo da legenda base (ref1: maiúscula ~36 px = corpo ~52-55; a Playfair tem olho grande: 58 lê no celular e sobre as mãos)
const LEG_LH = 1.18;
export const GIG = 130; // corpo da palavra gigante (ref1: maiúscula ~95 px; a Playfair tem maiúscula de 0,71 em)
export const CUR = 120; // corpo da cursiva (ref1: até 3 linhas largas; aqui 2, na mesma largura: a Great Vibes tem olho pequeno)
const CUR_LH = 1.0;
export const FECHO_S = 84, FECHO_C = 180;
const FOLGA_QUEIXO = 36;
const MEIA_CURSIVA = (2 * CUR * CUR_LH) / 2;
export const Y_TEXTO = Math.round(Math.min(1300, Math.max(0.49 * 1920, QUEIXO + FOLGA_QUEIXO + MEIA_CURSIVA)));
export const ALT_FECHO = FECHO_S * 1.1 + FECHO_C * 1.05;
export const Y_FECHO = Math.round(Y_TEXTO - MEIA_CURSIVA); // topo do fecho = topo da cursiva
export const Y_LEG2 = Math.floor(ZONA.base - 2 * LEG * LEG_LH); // 2ª posição (só depois do fecho), pé em 1500

/* largura estimada (em por caractere) para caber na zona */
const FATOR = {leg: 0.5, gig: 0.68, cur: 0.31, fs: 0.5, fc: 0.42}; // estimativa por letra (Playfair; conferir no quadro)
export const larg = (txt: string, f: keyof typeof FATOR, tam: number) => txt.length * FATOR[f] * tam;
export const escalaGig = (txt: string) => Math.min(1, ZW / larg(txt.toUpperCase(), 'gig', GIG));
const legTam = (linhas: string[]) => Math.min(LEG, ...linhas.map((l) => (LEG * ZW) / larg(l, 'leg', LEG)));

/* ---------------------------------------------------------------- páginas de legenda (base e citação) */
export type Pagina = {linhas: string[]; i0: number; n: number; de: number; ate: number; ouro: boolean; y: number};
const inicios = () => [
	...MODOS.filter((m) => m.def.tipo !== 'citacao').map((m) => m.de),
	...(FECHO ? [FECHO.de] : []),
];
export const PAGINAS: Pagina[] = (() => {
	const todas: [number, string, boolean][] = [
		...PEDACOS.map(([a, txt]) => [a, txt, false] as [number, string, boolean]),
		...MODOS.flatMap((m) => (m.def.tipo === 'citacao' ? m.def.paginas.map(([a, txt]) => [a, txt, true] as [number, string, boolean]) : [])),
	].sort((x, y) => x[0] - y[0]);
	return todas.map(([i0, txt, ouro], j) => {
		const linhas = txt.split(/\s*\/\s*/);
		const n = trecho(i0, txt, `PEDACOS, o pedaço '${txt}'`).length;
		const de = depoisDoClarao(PS[i0].de - 0.06);
		const prox = todas[j + 1];
		const fim = Math.min(prox ? PS[prox[0]].de - 0.06 : DURACAO - PRETO, ...inicios().filter((x) => x > de + 0.01));
		const ate = depoisDoClarao(fim) === fim ? fim : Math.min(fim, CLAROES.find((k) => fim >= k - 0.3 && fim < k + 0.2)! + 0.2);
		const y = FECHO && i0 > FECHO.cursiva[0] ? Y_LEG2 : Math.round(Y_TEXTO - (linhas.length * legTam(linhas) * LEG_LH) / 2);
		return {linhas, i0, n, de, ate: Math.min(ate, DURACAO - PRETO), ouro, y};
	});
})();

/* ---------------------------------------------------------------- vídeo */
const Video: React.FC<{t: number; pb: boolean}> = ({t, pb}) => {
	const m = modoEm(t);
	const z = zoomEm(t);
	const tipo = m?.def.tipo;
	const filtro =
		tipo === 'gigante' ? 'brightness(0.72) blur(2.5px)' : tipo === 'cursiva' ? 'brightness(0.62) blur(14px)' : tipo === 'citacao' ? `${pb ? 'grayscale(1) ' : ''}blur(1.5px) brightness(0.9)` : '';
	return (
		<AbsoluteFill style={{filter: filtro || undefined}}>
			<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${ORIGEM.x}px ${ORIGEM.y}px`}}>
				<OffthreadVideo muted src={staticFile('fala.mp4')} style={{width: 1080, height: 1920}} />
			</AbsoluteFill>
			{(tipo === 'gigante' || tipo === 'cursiva') && <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 65% at 50% 55%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.5) 100%)'}} />}
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- o clarão de película: luz da cena que estoura e volta */
const Clarao: React.FC<{t: number}> = ({t}) => {
	const I = claraoEm(t);
	if (I <= 0.001) return null;
	const k = CLAROES.find((x) => t >= x && t <= x + CLARAO.dur) ?? 0;
	const u = (t - k) / CLARAO.dur; // 0 a 1 dentro do clarão
	const formas = Array.from({length: 9}, (_, i) => {
		const s = `${k.toFixed(2)}-${i}`;
		const tam = 200 + random(`t${s}`) * 260;
		const quad = random(`q${s}`) > 0.5;
		return (
			<div key={i} style={{position: 'absolute', left: -150 + random(`x${s}`) * 1200 + (random(`d${s}`) - 0.5) * 260 * u, top: 150 + random(`y${s}`) * 1500, width: tam, height: tam, borderRadius: quad ? tam * 0.22 : tam / 2,
				background: random(`c${s}`) > 0.45 ? C.claro : C.quente, opacity: I * (0.55 + 0.4 * random(`o${s}`)), filter: 'blur(22px)'}} />
		);
	});
	return (
		<AbsoluteFill style={{mixBlendMode: 'screen'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 85% 70% at ${40 + 20 * u}% 55%, ${C.claro} 0%, ${C.quente} 55%, rgba(0,0,0,0) 100%)`, opacity: I}} />
			<AbsoluteFill style={{background: C.claro, opacity: I * 0.6}} />
			{formas}
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- os modos */
const entra = (t: number, de: number, d = 0.13): React.CSSProperties => {
	const e = de <= 0 ? 1 : tw(t, de, de + d, 0, 1); // no quadro 0 já está inteiro
	return {opacity: e, transform: `scale(${1.04 - 0.04 * e})`};
};
/** a palavra gigante: serifa em caixa alta, creme, com um halo largo de luz atrás (nunca brilho colado na letra, G37) */
const Gigante: React.FC<{t: number; m: Modo}> = ({t, m}) => {
	const def = m.def as Gig;
	let k = m.i0;
	const grupos = def.grupos.map((g) => {
		const ids = palavrasDe(g).map(() => k++);
		return {g, ids};
	});
	const atual = grupos.findIndex((x, j) => t >= (j === 0 ? m.de : Math.max(m.de, PS[x.ids[0]].de - 0.06)) && (j + 1 === grupos.length ? t < m.k + 0.2 : t < PS[grupos[j + 1].ids[0]].de - 0.06));
	if (atual < 0) return null;
	const {g, ids} = grupos[atual];
	const de0 = atual === 0 ? m.de : Math.max(m.de, PS[ids[0]].de - 0.06); // o 1º grupo nasce no corte (o gancho no quadro 0)
	const sai = tw(t, m.k, m.k + 0.2, 0, 1, E.io);
	const num = g.match(/^(\d+)(%?)$/);
	const texto = num ? `${Math.round(tw(t, de0, de0 + 0.5, 0, Number(num[1]), E.io))}${num[2]}` : g.toUpperCase();
	const esc = escalaGig(g);
	const tam = GIG * esc;
	const temTraco = TRACO && ids.includes(TRACO[0]);
	const tr = temTraco ? tw(t, PS[TRACO![0]].de + 0.08, PS[TRACO![0]].de + 0.4, 0, 1, E.io) : 0;
	return (
		<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top: Y_TEXTO - tam * 0.55, height: tam * 1.1, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 1 - sai}}>
			<div style={{position: 'absolute', left: '8%', right: '8%', top: '-30%', bottom: '-30%', background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${C.claro}33 0%, rgba(0,0,0,0) 70%)`, filter: 'blur(30px)', ...entra(t, de0, 0.2)}} />
			<span style={{position: 'relative', fontFamily: SERIF, fontWeight: 800, fontSize: tam, lineHeight: 1, letterSpacing: '0.01em', color: C.letra, whiteSpace: 'nowrap', fontVariantNumeric: 'lining-nums tabular-nums', ...entra(t, de0)}}>
				{num
					? texto
					: palavrasDe(g).map((pal, q) => (
							<span key={q} style={{position: 'relative', marginLeft: q ? tam * 0.28 : 0}}>
								{pal.toUpperCase()}
								{temTraco && ids[q] === TRACO![0] && <span style={{position: 'absolute', left: '-3%', width: '106%', bottom: -tam * 0.1, height: 12, borderRadius: 6, background: C.traco, transform: `scaleX(${tr})`, transformOrigin: 'left center'}} />}
							</span>
						))}
			</span>
		</div>
	);
};
/** a cursiva escrita à mão: cada palavra se desenha da esquerda para a direita enquanto é dita */
const Cursiva: React.FC<{t: number; m: Modo}> = ({t, m}) => {
	if (t < m.de || t >= m.k + 0.2) return null;
	const def = m.def as Cur;
	const sai = tw(t, m.k, m.k + 0.2, 0, 1, E.io);
	let k = m.i0;
	return (
		<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top: Y_TEXTO - MEIA_CURSIVA, textAlign: 'center', fontFamily: SCRIPT, fontSize: CUR, lineHeight: CUR_LH, color: C.letra, opacity: 1 - sai, textShadow: '0 8px 40px rgba(0,0,0,0.35)'}}>
			{def.linhas.map((l, i) => (
				<div key={i} style={{whiteSpace: 'nowrap'}}>
					{palavrasDe(l).map((pal, q) => {
						const w = PS[k++];
						const r = tw(t, w.de - 0.04, Math.max(w.ate, w.de + 0.28), 0, 1, (x) => x);
						return <span key={q} style={{display: 'inline-block', marginLeft: q ? CUR * 0.24 : 0, clipPath: `inset(-20% ${(1 - r) * 100}% -30% -10%)`}}>{pal}</span>;
					})}
				</div>
			))}
		</div>
	);
};
const Legenda: React.FC<{t: number}> = ({t}) => {
	const pg = PAGINAS.find((g) => t >= g.de && t < g.ate);
	if (!pg) return null;
	const sai = tw(t, pg.ate - 0.08, pg.ate, 0, 1, E.io);
	return (
		<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top: pg.y, textAlign: 'center', fontFamily: SERIF, fontWeight: 500, fontSize: legTam(pg.linhas), lineHeight: LEG_LH, color: pg.ouro ? C.ouro : C.letra, opacity: tw(t, pg.de, pg.de + 0.07, 0, 1) * (1 - sai), textShadow: '0 4px 28px rgba(0,0,0,0.6), 0 0 60px rgba(0,0,0,0.35)'}}>
			{pg.linhas.map((l, i) => <div key={i} style={{whiteSpace: 'nowrap'}}>{l}</div>)}
		</div>
	);
};
/** o fecho: a linha em serifa e, abaixo, a palavra em cursiva escrita à mão; monta em 2 tempos e segura até o preto */
const Fecho: React.FC<{t: number}> = ({t}) => {
	if (!FECHO || t < FECHO.de) return null;
	const c = PS[FECHO.cursiva[0]];
	const r = tw(t, c.de - 0.04, Math.max(c.ate, c.de + 0.45), 0, 1, (x) => x);
	const s = PS[FECHO.serifa[0]].texto.replace(/[.,;:!?]$/, '');
	const w = c.texto.replace(/[.,;:!?]$/, '');
	return (
		<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top: Y_FECHO, textAlign: 'center', color: C.letra}}>
			<div style={{fontFamily: SERIF, fontWeight: 700, fontSize: FECHO_S, lineHeight: 1.1, whiteSpace: 'nowrap', ...entra(t, FECHO.de, 0.2), textShadow: '0 6px 30px rgba(0,0,0,0.45)'}}>{s.charAt(0).toUpperCase() + s.slice(1)}</div>
			<div style={{fontFamily: SCRIPT, fontSize: FECHO_C, lineHeight: 1.05, whiteSpace: 'nowrap', clipPath: `inset(-30% ${(1 - r) * 100}% -40% -10%)`, textShadow: '0 8px 40px rgba(0,0,0,0.35)'}}>{FECHO.aspas ? `“${w}”` : w}</div>
		</div>
	);
};

export const Renomado01: React.FC<Props> = ({pb = true}) => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const m = modoEm(t);
	const preto = tw(t, DURACAO - PRETO - 0.3, DURACAO - PRETO, 0, 1, E.io);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Video t={t} pb={pb} />
			{m?.def.tipo === 'gigante' && <Gigante t={t} m={m} />}
			{m?.def.tipo === 'cursiva' && <Cursiva t={t} m={m} />}
			<Legenda t={t} />
			<Fecho t={t} />
			<Clarao t={t} />
			<AbsoluteFill style={{background: '#000', opacity: preto}} />
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- conferência (scripts/checar.mjs)
 * cada texto com as palavras que mostra, quando fica na tela e a caixa (x pela largura estimada, centrada na zona) */
export type Exib = {nome: string; tipo: 'legenda' | 'gigante' | 'cursiva' | 'fecho'; ids: number[]; de: number; ate: number; x0: number; x1: number; y0: number; y1: number; linhas: number; ouro?: boolean};
const cx = (w: number) => [500 - w / 2, 500 + w / 2]; // o texto é centrado na zona segura (60–940: o centro é x 500)
export const exibicoes = (): Exib[] => {
	const out: Exib[] = [];
	for (const pg of PAGINAS) {
		const tam = legTam(pg.linhas);
		const [x0, x1] = cx(Math.max(...pg.linhas.map((l) => larg(l, 'leg', tam))));
		out.push({nome: pg.linhas.join(' / '), tipo: 'legenda', ids: Array.from({length: pg.n}, (_, q) => pg.i0 + q), de: pg.de, ate: pg.ate, x0, x1, y0: pg.y, y1: pg.y + pg.linhas.length * tam * LEG_LH, linhas: pg.linhas.length, ouro: pg.ouro});
	}
	for (const m of MODOS) {
		if (m.def.tipo === 'gigante') {
			let k = m.i0;
			m.def.grupos.forEach((g, j, gs) => {
				const ids = palavrasDe(g).map(() => k++);
				const de = j === 0 ? m.de : Math.max(m.de, PS[ids[0]].de - 0.06);
				const ate = j + 1 === gs.length ? m.k + 0.2 : PS[k].de - 0.06;
				const tam = GIG * escalaGig(g);
				const [x0, x1] = cx(larg(g.toUpperCase(), 'gig', tam));
				out.push({nome: g, tipo: 'gigante', ids, de, ate, x0, x1, y0: Y_TEXTO - tam * 0.42, y1: Y_TEXTO + tam * 0.42 + (TRACO && ids.includes(TRACO[0]) ? tam * 0.1 : 0), linhas: 1});
			});
		}
		if (m.def.tipo === 'cursiva') {
			const [x0, x1] = cx(Math.max(...m.def.linhas.map((l) => larg(l, 'cur', CUR))));
			out.push({nome: m.def.linhas.join(' / '), tipo: 'cursiva', ids: Array.from({length: m.i1 - m.i0 + 1}, (_, q) => m.i0 + q), de: m.de, ate: m.k + 0.2, x0, x1, y0: Y_TEXTO - MEIA_CURSIVA, y1: Y_TEXTO - MEIA_CURSIVA + m.def.linhas.length * CUR * CUR_LH, linhas: m.def.linhas.length});
		}
	}
	if (FECHO) {
		const [x0, x1] = cx(Math.max(larg(FECHO.serifa[1], 'fs', FECHO_S), larg(FECHO.cursiva[1] + (FECHO.aspas ? '““' : ''), 'fc', FECHO_C)));
		out.push({nome: `fecho ${FECHO.serifa[1]} ${FECHO.cursiva[1]}`, tipo: 'fecho', ids: [FECHO.serifa[0], FECHO.cursiva[0]], de: FECHO.de, ate: DURACAO - PRETO, x0, x1, y0: Y_FECHO, y1: Y_FECHO + ALT_FECHO, linhas: 2});
	}
	return out.sort((a, b) => a.de - b.de);
};
