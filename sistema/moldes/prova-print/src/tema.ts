import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {loadFont as loadSans} from '@remotion/google-fonts/Inter';
import {loadFont as loadSerif} from '@remotion/google-fonts/InstrumentSerif';
import PALAVRAS from './palavras.json'; // entrada padrão: [{text,start,end}]
import RT from './rosto.json'; // entrada padrão: [[t,cx,cy,h]] a cada 0,25 s
import R from './rosto_med.json'; // scripts/rosto.py: mediana de olhos, largura e queixo (px no quadro 1080)

/**
 * prova-print (../../modelos/prova-print/prova-print.md): a tela prova o que a pessoa diz.
 * Palco claro (título-promessa só no gancho, cartão de câmera com a cabeça saindo da moldura) ↔ vitrine escura sem rosto (o card sobre o próprio conteúdo desfocado) ↔
 * rosto fechado só na emoção e no fecho. Prova real com grifo na frase dita e contador que para no número falado.
 * Nasceu do molde do interface-encenada (corte por palavra, legenda por pedaços, conferidor).
 */
export const FPS = 30;
const palavras = (PALAVRAS as {text: string; start: number; end: number}[]).map((p) => ({texto: p.text, de: p.start, ate: p.end}));
if (!palavras.length) throw new Error('src/palavras.json está vazio: este molde precisa da fala transcrita (tools/novo-video.py).');
/** fim da última palavra + 0,73 s */
export const DURACAO = Math.round((palavras[palavras.length - 1].ate + 0.73) * 100) / 100;
export const P = {duracao: DURACAO, palavras};
const RM = R as typeof R & {fala?: {palavras: number; fim: number}; quadros?: number};
if (!RM.fala || !RM.quadros || RM.fala.palavras !== palavras.length || RM.fala.fim !== palavras[palavras.length - 1].ate)
	throw new Error('src/rosto_med.json é de outra gravação. Rode ../../.venv/Scripts/python.exe scripts/rosto.py e carregue de novo.');
if (typeof (R as {topo?: number}).topo !== 'number')
	throw new Error('src/rosto_med.json sem o topo da cabeça: o cartão de câmera precisa da pessoa recortada (PV8). Rode QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/recorte.py e carregue de novo.');
export {R};

/** a paleta padrão (medida nas referências, prova-print.md §1); é opção do usuário (G33), troque aqui */
export const C = {
	palco: '#E9ECEE', // fundo do palco (ref1 1,00 s, canto direito)
	palcoFrio: '#D3E0EA', // o tom frio do canto de cima (ref1 1,00 s): o gradiente do palco
	tinta: '#141618', // texto no claro
	azul: '#0284FD', // caixa do título e do capítulo (ref1 1,00 s)
	chave: '#0682F7', // palavra-chave em serifa no claro (ref1 19,5 s)
	chaveEscuro: '#68B7FC', // palavra-chave no escuro e número do contador (ref1 19,5 s)
	borda: '#1781E2', // contorno do card (ref1 19,5 s)
	pilula: '#070C18', // fundo do contador (ref1 19,5 s)
	escuro: '#05070C', // base da vitrine (ref1 3,75 s: #020813)
	amarelo: '#FDFC76', // só a palavra do pedido (ref1 35,5 s)
	branco: '#FFFFFF',
	grifo: 'rgba(2,132,253,0.30)', // marca-texto azul (ref1 6,75 s)
};

const sans = loadSans('normal', {weights: ['500', '600', '700', '800'], subsets: ['latin']});
const serif = loadSerif('italic', {weights: ['400'], subsets: ['latin']});
export const SANS = sans.fontFamily;
export const SERIF = serif.fontFamily;

export const E = {
	out: Easing.bezier(0.16, 1, 0.3, 1),
	inOut: Easing.bezier(0.83, 0, 0.17, 1),
	in: Easing.bezier(0.7, 0, 0.84, 0),
};
export const useT = () => {
	const f = useCurrentFrame();
	return {f, t: f / FPS};
};
export const tw = (t: number, a: number, b: number, v0: number, v1: number, e = E.out) =>
	interpolate(t, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
export const mola = (t: number, at: number, cfg: Partial<{damping: number; stiffness: number; mass: number}> = {}) =>
	t < at ? 0 : spring({frame: (t - at) * FPS, fps: FPS, config: {damping: 16, stiffness: 190, mass: 0.8, ...cfg}});

/* ---------------------------------------------------------------- a câmera que segue o rosto (PV7) */
/** a câmera segue o rosto devagar, nunca colada nele (PV7, 2026-11-03): (1) zona morta de 45 px da gravação (o rosto
 * mexe dentro dela e a câmera não mexe); (2) passou da zona, o alvo anda só o que passou; (3) o caminho inteiro é
 * alisado com uma janela gaussiana de sigma 0,6 s (sem atraso: alisa pros dois lados). Resultado medido pelo checador:
 * velocidade e tremida (scripts/cobertura.mjs, "PV7"). O caminho é calculado uma vez, quadro a quadro (o render não depende
 * da ordem dos quadros). */
const rt = RT as number[][];
export const ZONA_MORTA = 45;
export const SIGMA = 0.6;
const camX = (() => {
	const n = Math.max(1, Math.ceil((palavras[palavras.length - 1].ate + 2) * FPS));
	const alvo = (t: number) => {
		if (!rt.length) return R.cx;
		let k = rt.findIndex((r) => r[0] > t);
		if (k <= 0) return (k === 0 ? rt[0][1] : rt[rt.length - 1][1]) * 1080;
		const a = rt[k - 1], b = rt[k];
		return (a[1] + ((b[1] - a[1]) * (t - a[0])) / (b[0] - a[0])) * 1080;
	};
	const seg: number[] = [];
	let h = rt.length ? alvo(0) : R.cx;
	for (let f = 0; f < n; f++) {
		const x = alvo(f / FPS);
		if (x > h + ZONA_MORTA) h = x - ZONA_MORTA;
		else if (x < h - ZONA_MORTA) h = x + ZONA_MORTA;
		seg.push(h);
	}
	const r = Math.ceil(3 * SIGMA * FPS);
	const pesos = Array.from({length: 2 * r + 1}, (_, j) => Math.exp(-0.5 * ((j - r) / (SIGMA * FPS)) ** 2));
	return seg.map((_, f) => {
		let s = 0, p = 0;
		for (let j = -r; j <= r; j++) {
			const v = seg[Math.min(n - 1, Math.max(0, f + j))];
			s += v * pesos[j + r];
			p += pesos[j + r];
		}
		return s / p;
	});
})();
/** centro x do rosto (px da gravação 1080) que a câmera usa no instante t: o caminho alisado */
export const rostoX = (t: number) => camX[Math.min(camX.length - 1, Math.max(0, Math.round(t * FPS)))];
export const CAMINHO = camX;

export const limpa = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9%]/g, '');
/** índice (em src/palavras.json) da n-ésima vez que a palavra é dita; se a fala não tem, para com o que refazer */
export const iw = (texto: string, n = 1) => {
	let k = 0;
	for (let i = 0; i < P.palavras.length; i++) if (limpa(P.palavras[i].texto) === limpa(texto) && ++k === n) return i;
	throw new Error(
		`O plano não bate com a fala de src/palavras.json: \`${n > 1 ? `w('${texto}', ${n})` : `w('${texto}')`}\` pede a ${n}ª vez que se diz "${texto}", e a fala ${k ? `só tem ${k}` : 'não tem nenhuma'}.\n` +
			'Refaça o plano (prova-print.md §9: base() em src/tema.ts, as cenas de src/Cenas.tsx e CHAVE em src/Legenda.tsx) e rode node scripts/cobertura.mjs.',
	);
};
export const w = (texto: string, n = 1) => P.palavras[iw(texto, n)].de;

/* ---------------------------------------------------------------- o plano: uma cena por frase (refazer num vídeo novo) */
/** corte seco 2 quadros antes da palavra que abre a cena */
const corte = (t: number) => t - 0.06;
export type Modo = 'palco' | 'vitrine' | 'capitulo' | 'rosto';
export type Cena = {id: string; modo: Modo; de: number; ate: number; fecho?: boolean};
/** [id, modo, início, fecho?] — o título-promessa é TITULO (abaixo), só na cena dele */
const base = (): [string, Modo, number, boolean?][] => [
	['gancho', 'palco', 0], // Esse vídeo está sendo 100% editado pelo Claude.
	['criado', 'vitrine', corte(w('ele'))], // Ele foi criado justamente para te mostrar a
	['modelos', 'palco', corte(w('diferença'))], // diferença entre vários modelos que eu criei e melhorei para editar
	['editar', 'vitrine', corte(w('qualquer'))], // qualquer tipo de vídeo usando o Claude.
	['vendo', 'vitrine', corte(w('inclusive'))], // Inclusive, se você estiver no Instagram agora, você está vendo apenas um desses modelos.
	['previas', 'palco', corte(w('eu', 2))], // Eu posso até colocar duas prévias rápidas aqui em cima,
	['tres', 'vitrine', corte(w('aceleradas'))], // aceleradas em três vezes.
	['mas', 'rosto', corte(w('mas'))], // Mas se você quiser realmente ver
	['outros', 'palco', corte(w('outros'))], // (ver) outros modelos de edição como esse
	['aprender', 'vitrine', corte(w('e', 2))], // e aprender a como usar isso nos seus vídeos,
	['comenta', 'rosto', corte(w('comenta')), true], // comenta edição aqui embaixo que eu vou te mandar na sua DM agora.
];
/** o título-promessa (uma linha preta + uma linha em itálico na caixa azul): palavras ditas, até 16 letras cada. Só na cena
 * do gancho e some no corte dela (PV5); enquanto ele está na tela, as palavras dele não vão para a legenda (PV4) */
const titulo = () => ({cena: 'gancho', linha1: '100% editado', linha2: 'pelo Claude', de: 0.25});
/** contadores (PV1, G8): o número dito sobe até ele e fica até o corte; as palavras dele não vão para a legenda (PV4).
 * [cena, palavras do número como foram ditas (a 1ª é o número), início, valor, sufixo, y] */
const contadores = (): [string, string[], number, number, string, number][] => [
	['tres', ['três', 'vezes'], w('três') - 0.64, 3, ' vezes', 560], // chega no 3 junto com "três"
];
/** o comando fixo do fecho ("comenta" + a palavra do pedido entre aspas): fica até o fim, é o pedido (herança §2) */
const comando = () => ({cena: 'comenta', palavras: ['comenta', 'edição'], texto: 'comenta “EDIÇÃO”'});
/* ---------------------------------------------------------------- fim do plano */

export const montaCenas = (): Cena[] => {
	const b = base();
	return b.map(([id, modo, de, fecho], i) => ({id, modo, de: i ? de : 0, ate: i + 1 < b.length ? b[i + 1][2] : DURACAO, fecho}));
};
export const CENAS = montaCenas();
export const cenaEm = (t: number) => CENAS.find((c) => t >= c.de && t < c.ate) ?? CENAS[CENAS.length - 1];
export const cenaAnterior = (c: Cena) => CENAS[CENAS.indexOf(c) - 1];
const cenaId = (id: string) => {
	const c = CENAS.find((x) => x.id === id);
	if (!c) throw new Error(`o plano cita a cena "${id}", que não existe em base() (src/tema.ts)`);
	return c;
};
/** índice da 1ª vez que a palavra é dita dentro da cena */
const iwNa = (texto: string, c: Cena) => {
	const i = P.palavras.findIndex((p) => limpa(p.texto) === limpa(texto) && p.de >= c.de - 0.01 && p.de < c.ate);
	if (i < 0) throw new Error(`a cena "${c.id}" não tem a palavra "${texto}" dita: refaça o título, o contador ou o comando em src/tema.ts`);
	return i;
};

/** texto fixo na tela (título, contador, comando): o que diz, as palavras ditas que ele mostra, quando entra e sai.
 * A legenda não repete essas palavras (PV4) e nenhum fica pendurado depois da fala dele (PV5): scripts/cobertura.mjs */
export type Fixo = {nome: string; texto: string; ids: number[]; de: number; ate: number; fecho?: boolean};
const _t = titulo();
const _tc = cenaId(_t.cena);
export const TITULO = {..._t, ate: _tc.ate, ids: `${_t.linha1} ${_t.linha2}`.split(' ').map((p) => iwNa(p, _tc))};
export const CONTADORES = contadores().map(([cena, pal, de, valor, sufixo, y]) => {
	const c = cenaId(cena);
	return {cena, de, ate: c.ate, valor, sufixo, y, ids: pal.map((p) => iwNa(p, c))};
});
const _c = comando();
const _cc = cenaId(_c.cena);
export const COMANDO = {..._c, ids: _c.palavras.map((p) => iwNa(p, _cc))};
export const FIXOS: Fixo[] = [
	{nome: 'título', texto: `${TITULO.linha1} ${TITULO.linha2}`, ids: TITULO.ids, de: TITULO.de, ate: TITULO.ate},
	...CONTADORES.map((k) => ({nome: `contador ${k.valor}${k.sufixo}`, texto: `${k.valor}${k.sufixo}`, ids: k.ids, de: k.de, ate: k.ate})),
	{nome: 'comando do fecho', texto: COMANDO.texto, ids: COMANDO.ids, de: P.palavras[COMANDO.ids[0]].de, ate: DURACAO, fecho: true},
];

/** a pessoa escolhe as prévias (props); chega a todo lugar por contexto */
export const Props = React.createContext<{previas: boolean}>({previas: false});

/* ---------------------------------------------------------------- a geometria (1080x1920; prova-print.md §3) */
export const G = {
	titulo1: 250, // topo da linha preta do título (só no gancho)
	titulo2: 352, // topo da caixa azul
	// card da prova no palco: centrado, como a ref4 (x 117-963). Com o título embaixo dele (ref4 1,5 s: y 515-975); sem o
	// título o card sobe e cresce (os palcos seguintes das refs sobem o card). Termina acima da legenda do palco.
	cardPalcoTitulo: {x: 100, y: 506, w: 880, h: 410},
	cardPalco: {x: 100, y: 250, w: 880, h: 666},
	cardVitrine: {x: 80, y: 250, w: 880, h: 890}, // card grande da vitrine
	legenda: 1180, // a legenda na vitrine, no capítulo e no rosto fechado
	legendaPalco: 940, // a legenda no palco: entre o card da prova e a cabeça (ref4 1,5 s: "AI plugins" y ~1010-1090). 2 lugares (G15)
	// o cartão de câmera do palco (PV8, medido na ref4 DfPuiYyP4Hy 0 a 4 s, 1080x1920): x 52-1039 (91,5% da largura), topo
	// y 1305 (68%), sangra pela base, raio ~55, sem contorno, o fundo da gravação dentro dele; a cabeça recortada passa da
	// borda de cima (ref: topo da cabeça ~165 px acima da borda, olhos ~125 px abaixo dela, rosto ~300 px de largura).
	// Aqui: s 0,92 para a gravação cobrir os 988 px do cartão (rosto ~366 px); olhos 125 px abaixo da borda; borda em y 1365
	// para a cabeça inteira caber entre a legenda do palco e o cartão (PV6).
	rostoPalco: {x: 46, y: 1365, w: 988, h: 600, raio: 54, s: 0.92, olhos: 1490},
};
export const SOMBRA = '0 30px 70px rgba(10,30,60,0.22), 0 6px 16px rgba(10,30,60,0.12)';
export const fundoPalco = {background: `linear-gradient(170deg, ${C.palcoFrio} 0%, ${C.palco} 55%, ${C.palco} 100%)`} as const;
