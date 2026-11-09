import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadSerif} from '@remotion/google-fonts/PlayfairDisplay';
import PB from './palavras.json';
import ROSTO_T from './rosto.json';

/**
 * Molde do especialista (../../modelos/especialista/especialista.md): o especialista renomado.
 * Base calma (a pessoa e uma legenda serifada no peito) e POUCOS destaques, padronizados (correção do dono, 2026-11-07):
 *  - GIGANTE: serifa em caixa alta, sempre do mesmo tamanho. Pode levar a LINHA DE CIMA (o começo da mesma fala, numa
 *    linha só, logo acima, na mesma tela: "uma fala = uma tela") e o TRAÇO vermelho sob a palavra-alvo.
 *  - CITAÇÃO: fala que a pessoa põe na boca de outro, em itálico dourado, no tamanho da linha de cima; cada bloco abre e
 *    fecha aspas.
 * Cursiva escrita à mão e o fecho serifa + cursiva saíram do modelo (dono, 2026-11-07).
 * Transição: FUSÃO curta (0,3 s, sem som, sem cor por cima): o fim do trecho anterior continua andando e se dissolve no
 * trecho novo. Só ENTRE trechos diferentes (G23), no corte. A voz nunca é escondida; a volta do zoom do gigante fica
 * dentro da fusão. O vídeo termina em preto.
 */
export const FPS = 30;
const serif = loadSerif('normal', {weights: ['500', '700', '800'], subsets: ['latin']});
const serifIt = loadSerif('italic', {weights: ['500'], subsets: ['latin']});
const SERIF = serif.fontFamily;
const SERIF_IT = serifIt.fontFamily;
const E = {out: Easing.bezier(0.16, 1, 0.3, 1), io: Easing.bezier(0.45, 0, 0.55, 1)};
const tw = (t: number, a: number, b: number, v0: number, v1: number, e = E.out) =>
	interpolate(t, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

/** G6: fundo real por padrão. 'desfoque' e pb (P&B na citação) só a pedido do dono. */
export type Props = {pb?: boolean; fundo?: 'real' | 'desfoque'};

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
const semPont = (s: string) => s.replace(/[.,;:!?…]+$/, '');

/* ================================================================ O PLANO (refazer num vídeo novo; o resto do arquivo é o modelo)
 * Cada índice é a posição da palavra em src/palavras.json, com o texto esperado ao lado (o molde para se não bater).
 * '/' quebra a linha. Depois de mexer: node scripts/checar.mjs até sair APROVADO. */

/** a cor tirada da cena e da roupa (scripts/cor_da_cena.py): letra creme, ouro da citação, traço */
export const C = {letra: '#F2EDE9', ouro: '#E2A665', traco: '#C9473B'}; // medido na gravação comum (parede bege, 32°)

/** gigante: grupos de 1 a 3 palavras, um por vez; cima: o começo da MESMA fala, 1 linha acima do gigante, na mesma tela;
 * traco: true põe o traço vermelho sob a última palavra (a palavra-alvo).
 * citacao: páginas [1ª palavra, 'texto / 2ª linha'], SEM aspas no plano (o molde abre e fecha aspas em cada página).
 * Exemplo de par (do especialista v2): {tipo: 'gigante', primeira: 0, cima: 'Escolhe sempre coisas que te', grupos: ['desafiem'], traco: true} */
type Gig = {tipo: 'gigante'; primeira: number; cima?: string; grupos: string[]; traco?: boolean};
type Cit = {tipo: 'citacao'; paginas: [number, string][]};
type ModoDef = Gig | Cit;
const MODOS_DEF: ModoDef[] = [
	{tipo: 'gigante', primeira: 0, grupos: ['Esse vídeo', 'está sendo', '100%', 'editado', 'pelo Claude.'], traco: true}, // gancho (fala longa demais para 1 linha de cima)
	{tipo: 'gigante', primeira: 83, grupos: ['comenta', 'edição']}, // o comando do fim
];
/** transições (fusão) ANTES destas palavras: só onde um trecho fecha e começa outra ideia (G23) */
const TRANSICOES: [number, string][] = [[8, 'Ele'], [48, 'Eu'], [62, 'Mas']];
const REENQUADRES: [number, string, number][] = [];
const PEDACOS: [number, string][] = [
	[8, 'Ele foi criado justamente / para te mostrar'],
	[15, 'a diferença entre vários modelos / que eu criei e melhorei'],
	[25, 'para editar qualquer tipo / de vídeo usando o Claude.'],
	[34, 'Inclusive,'],
	[35, 'se você estiver / no Instagram agora,'],
	[41, 'você está vendo apenas / um desses modelos.'],
	[48, 'Eu posso até colocar / duas prévias rápidas'],
	[55, 'aqui em cima,'],
	[58, 'aceleradas em três vezes.'],
	[62, 'Mas se você quiser / realmente ver'],
	[68, 'outros modelos de edição / como esse'],
	[74, 'e aprender a como usar / isso nos seus vídeos,'],
	[85, 'aqui embaixo que eu vou / te mandar na sua DM agora.'],
];
/** medir por gravação, no quadro: entre o queixo e o que houver de claro na roupa */
export const Y_TEXTO = 1187; // centro da legenda, da citação e do gigante sozinho
export const Y_PAR = 1100; // topo do par linha de cima + gigante (sem par nesta vitrine)
/* ================================================================ fim do plano */

/* ---------------------------------------------------------------- tempos */
export const SEGURA = 1.16;
export const PRETO = 1.2;
export const FIM_FALA = PS[PS.length - 1].ate;
export const DURACAO = Math.round((FIM_FALA + SEGURA + PRETO) * 100) / 100;
/** a fusão: o trecho anterior se dissolve no novo em 0,3 s, começando no corte */
export const FUSAO = 0.3;
export const ZOOM_MODO = 1.15;

/** os cortes onde entra a fusão (no meio da pausa entre os dois trechos), em s */
export const FUSOES = TRANSICOES.map(([i, p]) => {
	pw(i, p, `TRANSICOES [${i}, '${p}']`);
	if (i === 0) foraDaFala('TRANSICOES', 'não há transição antes da 1ª palavra');
	return Math.round(((PS[i - 1].ate + PS[i].de) / 2) * FPS) / FPS;
});

export type Modo = {def: ModoDef; i0: number; i1: number; de: number; k: number; fim: number; zfim: number; nome: string};
export const MODOS: Modo[] = MODOS_DEF.map((m, j) => {
	const onde = `MODOS_DEF, o modo ${j + 1} (${m.tipo})`;
	let i0: number, n: number;
	if (m.tipo === 'gigante') {
		i0 = m.primeira;
		n = trecho(i0, [m.cima ?? '', ...m.grupos].join(' '), onde).length;
		if (m.cima && m.cima.includes('/')) foraDaFala(onde, 'a linha de cima é UMA linha (sem /)');
	} else {
		i0 = m.paginas[0][0];
		m.paginas.forEach(([a, txt], q) => {
			if (/[“”"]/.test(txt)) foraDaFala(onde, 'tire as aspas do plano: o molde abre e fecha aspas em cada página');
			trecho(a, txt, `${onde}, página ${q + 1}`);
			const prox = m.paginas[q + 1];
			if (prox && prox[0] !== a + palavrasDe(txt).length) foraDaFala(onde, `a página ${q + 2} tem que começar na palavra ${a + palavrasDe(txt).length}`);
		});
		const ult = m.paginas[m.paginas.length - 1];
		n = ult[0] + palavrasDe(ult[1]).length - i0;
	}
	const i1 = i0 + n - 1;
	const de = i0 === 0 ? 0 : PS[i0].de - 0.06;
	const k = PS[i1].ate - 0.05;
	// G23: a tela sai junto com a fala; a última fala do vídeo segura até o preto
	const fim = i1 === PS.length - 1 ? DURACAO - PRETO : Math.max(PS[i1].ate, Math.min(PS[i1 + 1].de - 0.06, PS[i1].ate + 0.25));
	// o zoom do gigante só volta escondido num mergulho (o próximo, até 6 s depois) ou no fim da tela
	const prox = FUSOES.find((c) => c >= fim - 0.3 && c < fim + 6);
	const zfim = i1 === PS.length - 1 ? DURACAO : prox !== undefined ? prox : fim;
	return {def: m, i0, i1, de, k, fim, zfim, nome: `${m.tipo} "${PS[i0].texto} … ${PS[i1].texto}"`};
});
for (let j = 1; j < MODOS.length; j++) if (MODOS[j].de < MODOS[j - 1].fim - 0.01) foraDaFala(`MODOS_DEF, o modo ${j + 1}`, 'começa antes do modo anterior acabar');
REENQUADRES.forEach(([i, p]) => pw(i, p, `REENQUADRES [${i}, '${p}']`));
/** palavras com traço (a última de cada gigante com traco: true) */
export const TRACOS: number[] = MODOS.flatMap((m) => (m.def.tipo === 'gigante' && m.def.traco ? [m.i1] : []));
export const TRACO_T = TRACOS.length ? PS[TRACOS[0]].de + 0.08 : null;
export const modoEm = (t: number) => MODOS.find((m) => t >= m.de && t < m.fim) ?? null;

/* ---------------------------------------------------------------- câmera: o gigante aproxima no corte; volta no mergulho */
const ROS = ROSTO_T as number[][];
const p = (xs: number[], q: number) => (xs.length ? [...xs].sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor(q * xs.length))] : 0);
export const QUEIXO = ROS.length ? Math.round(p(ROS.map(([, , cy, h]) => (cy + h / 2) * 1920), 0.98)) : 900;
export const ORIGEM = {x: ROS.length ? Math.round(p(ROS.map(([, cx]) => cx * 1080), 0.5)) : 540, y: QUEIXO};
type Trecho = {a: number; b: number; z0: number; modo: boolean};
export const TRECHOS: Trecho[] = (() => {
	const pontos: {t: number; z: number; modo: boolean}[] = [{t: 0, z: 1, modo: false}];
	for (const m of MODOS) { pontos.push({t: m.de, z: m.def.tipo === 'gigante' ? ZOOM_MODO : 1, modo: true}); pontos.push({t: m.zfim, z: -1, modo: false}); }
	for (const [i, , z] of REENQUADRES) pontos.push({t: PS[i].de - 0.06, z, modo: false});
	pontos.sort((x, y) => x.t - y.t);
	let zb = 1;
	const out: Trecho[] = [];
	pontos.forEach((mk, j) => {
		if (!mk.modo && mk.z > 0) zb = mk.z;
		const fim = j + 1 < pontos.length ? pontos[j + 1].t : DURACAO;
		if (fim > mk.t + 1e-6) out.push({a: mk.t, b: fim, z0: mk.modo ? mk.z : zb, modo: mk.modo});
	});
	return out;
})();
export const DERIVA = 0;
export const zoomEm = (t: number) => {
	const tr = TRECHOS.find((x) => t >= x.a && t < x.b) ?? TRECHOS[TRECHOS.length - 1];
	return tr.z0 * (1 + Math.min(DERIVA * (t - tr.a), 0.03));
};
export const CORTES_ZOOM = [...MODOS.filter((m) => m.de > 0 && m.def.tipo === 'gigante').map((m) => m.de), ...REENQUADRES.map(([i]) => PS[i].de - 0.06)].sort((a, b) => a - b);
export const rostoEm = (t: number) => {
	if (!ROS.length) return null;
	const r = ROS.reduce((a, b) => (Math.abs(b[0] - t) < Math.abs(a[0] - t) ? b : a));
	const z = zoomEm(t);
	const y = (v: number) => ORIGEM.y + (v * 1920 - ORIGEM.y) * z;
	return {queixo: y(r[2] + r[3] / 2), topo: y(r[2] - r[3] / 2 - 0.25 * r[3]), x0: ORIGEM.x + (r[1] * 1080 - (r[3] * 1920 * 0.42) - ORIGEM.x) * z, x1: ORIGEM.x + (r[1] * 1080 + r[3] * 1920 * 0.42 - ORIGEM.x) * z};
};

/* ---------------------------------------------------------------- tamanhos: UM por tipo no vídeo inteiro (G12, G13) */
export const ZONA = {esq: 60, dir: 940, topo: 250, base: 1500};
export const ZW = ZONA.dir - ZONA.esq;
export const LEG = 58; // legenda padrão: um tamanho só, nunca encolhe (G12)
const LEG_LH = 1.18;
export const LINHA = 66; // linha de cima do gigante E citação em itálico (o mesmo tamanho: destaque secundário)
export const GIG0 = 130;
const FATOR = {leg: 0.45, linha: 0.45, cit: 0.42, gig: 0.68}; // largura por letra (Playfair; medido no quadro)
export const larg = (txt: string, f: keyof typeof FATOR, tam: number) => txt.length * FATOR[f] * tam;
/** o gigante tem UM tamanho no vídeo: o do grupo mais largo que ainda cabe */
export const GIG = Math.floor(GIG0 * Math.min(1, ...MODOS.flatMap((m) => (m.def.tipo === 'gigante' ? m.def.grupos.map((g) => ZW / larg(semPont(g).toUpperCase(), 'gig', GIG0)) : []))));
export const escalaGig = (_txt: string) => GIG / GIG0;
const GAP_PAR = 4;
const ALT_LINHA = LINHA * 1.18;
/** posições: legenda, citação e gigante sozinho centrados em Y_TEXTO; par (linha de cima + gigante) com topo em Y_PAR */
const gigTopo = (m: Modo) => ((m.def as Gig).cima ? Y_PAR + ALT_LINHA + GAP_PAR : Y_TEXTO - GIG * 0.55);

/* ---------------------------------------------------------------- páginas de legenda (base e citação) */
export type Pagina = {linhas: string[]; i0: number; n: number; de: number; ate: number; ouro: boolean; y: number};
const aspas = (linhas: string[]) => linhas.map((l, i) => `${i === 0 ? '“' : ''}${l}${i === linhas.length - 1 ? '”' : ''}`);
export const PAGINAS: Pagina[] = (() => {
	const todas: [number, string, boolean][] = [
		...PEDACOS.map(([a, txt]) => [a, txt, false] as [number, string, boolean]),
		...MODOS.flatMap((m) => (m.def.tipo === 'citacao' ? m.def.paginas.map(([a, txt]) => [a, txt, true] as [number, string, boolean]) : [])),
	].sort((x, y) => x[0] - y[0]);
	const gigs = MODOS.filter((m) => m.def.tipo === 'gigante');
	return todas.map(([i0, txt, ouro], j) => {
		const crua = txt.split(/\s*\/\s*/);
		const linhas = ouro ? aspas(crua) : crua;
		const n = trecho(i0, txt, `PEDACOS, o pedaço '${txt}'`).length;
		const de = PS[i0].de - 0.06;
		const prox = todas[j + 1];
		const fim = Math.min(prox ? PS[prox[0]].de - 0.06 : DURACAO - PRETO, ...gigs.map((m) => m.de).filter((x) => x > de + 0.01));
		const lh = ouro ? ALT_LINHA : LEG * LEG_LH;
		return {linhas, i0, n, de, ate: Math.min(fim, DURACAO - PRETO), ouro, y: Math.round(Y_TEXTO - (linhas.length * lh) / 2)};
	});
})();

/* ---------------------------------------------------------------- vídeo */
const Video: React.FC<{t: number; pb: boolean; desfoque: boolean}> = ({t, pb, desfoque}) => {
	const m = modoEm(t);
	const z = zoomEm(t);
	const tipo = m?.def.tipo;
	const filtro = !desfoque ? (tipo === 'citacao' && pb ? 'grayscale(1)' : '') : tipo === 'gigante' ? 'brightness(0.72) blur(2.5px)' : tipo === 'citacao' ? `${pb ? 'grayscale(1) ' : ''}blur(1.5px) brightness(0.9)` : '';
	return (
		<AbsoluteFill style={{filter: filtro || undefined}}>
			<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${ORIGEM.x}px ${ORIGEM.y}px`}}>
				<OffthreadVideo muted src={staticFile('fala.mp4')} style={{width: 1080, height: 1920}} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
/** a fusão: por 0,3 s depois do corte, o fim do trecho anterior (andando, com o zoom dele) se dissolve sobre o novo */
const Fusoes: React.FC<{t: number}> = ({t}) => (
	<>
		{FUSOES.map((c) => {
			const a = Math.round(c * FPS), d = Math.round(FUSAO * FPS);
			if (t < c - 0.01 || t > c + FUSAO) return null;
			const z = zoomEm(c - 0.04);
			return (
				<Sequence key={c} from={a} durationInFrames={d} layout="none">
					<AbsoluteFill style={{opacity: tw(t, c, c + FUSAO, 1, 0, E.io)}}>
						<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${ORIGEM.x}px ${ORIGEM.y}px`}}>
							<OffthreadVideo muted src={staticFile('fala.mp4')} startFrom={a - d} style={{width: 1080, height: 1920}} />
						</AbsoluteFill>
					</AbsoluteFill>
				</Sequence>
			);
		})}
	</>
);

const SOMBRA = '0 4px 28px rgba(0,0,0,0.6), 0 0 60px rgba(0,0,0,0.35)'; // sombra larga e suave (G16)
const entra = (t: number, de: number, d = 0.13): React.CSSProperties => {
	const e = de <= 0 ? 1 : tw(t, de, de + d, 0, 1);
	return {opacity: e, transform: `scale(${1.04 - 0.04 * e})`};
};
/** o gigante: serifa em caixa alta, creme; com a linha de cima (mesma fala) e o traço vermelho sob a palavra-alvo */
const Gigante: React.FC<{t: number; m: Modo}> = ({t, m}) => {
	const def = m.def as Gig;
	let k = m.i0 + (def.cima ? palavrasDe(def.cima).length : 0);
	const grupos = def.grupos.map((g) => ({g, ids: palavrasDe(g).map(() => k++)}));
	const iniG = (j: number) => (j === 0 ? m.de : Math.max(m.de, PS[grupos[j].ids[0]].de - 0.06));
	const atual = grupos.findIndex((_, j) => t >= iniG(j) && (j + 1 === grupos.length ? t < m.fim : t < iniG(j + 1)));
	if (atual < 0) return null;
	const {g, ids} = grupos[atual];
	const de0 = iniG(atual);
	const sai = m.fim >= DURACAO - PRETO - 0.01 ? 0 : tw(t, m.fim - 0.08, m.fim, 0, 1, E.io);
	const tr = def.traco && ids.includes(m.i1) ? tw(t, PS[m.i1].de + 0.08, PS[m.i1].de + 0.4, 0, 1, E.io) : 0;
	const top = gigTopo(m);
	return (
		<>
			{def.cima && (
				<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top: Y_PAR, textAlign: 'center', fontFamily: SERIF, fontWeight: 500, fontSize: LINHA, lineHeight: 1.18, color: C.letra, whiteSpace: 'nowrap', opacity: 1 - sai, textShadow: SOMBRA}}>
					{def.cima}
				</div>
			)}
			<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top, height: GIG * 1.1, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 1 - sai}}>
				<span style={{position: 'relative', fontFamily: SERIF, fontWeight: 800, fontSize: GIG, lineHeight: 1, letterSpacing: '0.01em', color: C.letra, whiteSpace: 'nowrap', textShadow: SOMBRA, ...entra(t, de0)}}>
					{palavrasDe(g).map((pal, q) => (
						<span key={q} style={{position: 'relative', marginLeft: q ? GIG * 0.28 : 0}}>
							{semPont(pal).toUpperCase()}
							{def.traco && ids[q] === m.i1 && <span style={{position: 'absolute', left: '-3%', width: '106%', bottom: -GIG * 0.1, height: 12, borderRadius: 6, background: C.traco, transform: `scaleX(${tr})`, transformOrigin: 'left center'}} />}
						</span>
					))}
				</span>
			</div>
		</>
	);
};
const Legenda: React.FC<{t: number}> = ({t}) => {
	const pg = PAGINAS.find((g) => t >= g.de && t < g.ate);
	if (!pg) return null;
	const sai = tw(t, pg.ate - 0.08, pg.ate, 0, 1, E.io);
	return (
		<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top: pg.y, textAlign: 'center', fontFamily: pg.ouro ? SERIF_IT : SERIF, fontStyle: pg.ouro ? 'italic' : 'normal', fontWeight: 500, fontSize: pg.ouro ? LINHA : LEG, lineHeight: pg.ouro ? 1.18 : LEG_LH, color: pg.ouro ? C.ouro : C.letra, opacity: tw(t, pg.de, pg.de + 0.07, 0, 1) * (1 - sai), textShadow: SOMBRA}}>
			{pg.linhas.map((l, i) => <div key={i} style={{whiteSpace: 'nowrap'}}>{l}</div>)}
		</div>
	);
};

export const Renomado01: React.FC<Props> = ({pb = false, fundo = 'real'}) => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const m = modoEm(t);
	const preto = tw(t, DURACAO - PRETO - 0.3, DURACAO - PRETO, 0, 1, E.io);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Video t={t} pb={pb} desfoque={fundo === 'desfoque'} />
			<Fusoes t={t} />
			{m?.def.tipo === 'gigante' && <Gigante t={t} m={m} />}
			<Legenda t={t} />
			<AbsoluteFill style={{background: '#000', opacity: preto}} />
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- conferência (scripts/checar.mjs)
 * cada texto com as palavras que mostra, quando fica na tela, a caixa e o centro esperado da posição do tipo (yc) */
export type Exib = {nome: string; tipo: 'legenda' | 'citacao' | 'gigante' | 'cima'; ids: number[]; de: number; ate: number; x0: number; x1: number; y0: number; y1: number; yc: number; linhas: number};
const cx = (w: number) => [500 - w / 2, 500 + w / 2];
export const exibicoes = (): Exib[] => {
	const out: Exib[] = [];
	for (const pg of PAGINAS) {
		const tam = pg.ouro ? LINHA : LEG;
		const lh = pg.ouro ? ALT_LINHA : LEG * LEG_LH;
		const [x0, x1] = cx(Math.max(...pg.linhas.map((l) => larg(l, pg.ouro ? 'cit' : 'leg', tam))));
		out.push({nome: pg.linhas.join(' / '), tipo: pg.ouro ? 'citacao' : 'legenda', ids: Array.from({length: pg.n}, (_, q) => pg.i0 + q), de: pg.de, ate: pg.ate, x0, x1, y0: pg.y, y1: pg.y + pg.linhas.length * lh, yc: Y_TEXTO, linhas: pg.linhas.length});
	}
	for (const m of MODOS) {
		if (m.def.tipo !== 'gigante') continue;
		const def = m.def;
		let k = m.i0;
		if (def.cima) {
			const ids = palavrasDe(def.cima).map(() => k++);
			const [x0, x1] = cx(larg(def.cima, 'linha', LINHA));
			out.push({nome: def.cima, tipo: 'cima', ids, de: m.de, ate: m.fim, x0, x1, y0: Y_PAR, y1: Y_PAR + ALT_LINHA, yc: Y_PAR + ALT_LINHA / 2, linhas: 1});
		}
		const top = gigTopo(m);
		def.grupos.forEach((g, j, gs) => {
			const ids = palavrasDe(g).map(() => k++);
			const de = j === 0 ? m.de : Math.max(m.de, PS[ids[0]].de - 0.06);
			const ate = j + 1 === gs.length ? m.fim : PS[k].de - 0.06;
			const [x0, x1] = cx(larg(semPont(g).toUpperCase(), 'gig', GIG));
			const c = top + GIG * 0.55;
			out.push({nome: g, tipo: 'gigante', ids, de, ate, x0, x1, y0: c - GIG * 0.42, y1: c + GIG * 0.42 + (def.traco ? GIG * 0.1 : 0), yc: c, linhas: 1});
		});
	}
	return out.sort((a, b) => a.de - b.de);
};
