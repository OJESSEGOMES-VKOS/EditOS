import React from 'react';
import {C, CAIXAS_ALTAS, CHAVES, DIVISA, EQUILIBRIO, MONO, P, SANS, SELECOES, SERIF, cenaEm, montaCenas, tw, useCenas, useT} from './tema';
import type {Modo} from './tema';

/**
 * A legenda é a espinha (MODELO §3): pedaços de até 3 palavras, entrando palavra por palavra,
 * um lugar e um estilo por modo. Palavra-chave em serifa itálica na cor de destaque.
 * Nunca atravessa corte: o pedaço fecha na troca de cena (os cortes são os mesmos com ou sem prévias).
 */
type Pal = {texto: string; de: number; ate: number; i: number};
type Pedaco = {pal: Pal[]; de: number; ate: number; cheio?: boolean};
/* ---------------------------------------------------------------- o plano da legenda
 * CHAVE (palavras-chave), CAIXA_ALTA (a palavra do pedido) e SELECAO (a que ganha alças) moram no bloco "O PLANO" de
 * src/tema.ts, junto com as cenas. */
const CHAVE = CHAVES;
const CAIXA_ALTA = CAIXAS_ALTAS;
const SELECAO = SELECOES;
const EQUILIBRA = EQUILIBRIO;
/** tempo mínimo de cada pedaço na tela (s). 0 = pedaços de 1 a 3 palavras como na vitrine (MODELO §3); com 1.5 os pedaços
 * se juntam até durar 1,5 s e cada palavra ficar 0,4 s (REGRAS §3), que é o que o conferidor cobra */
export const MIN_PEDACO = 1.5; // G12 e REGRAS §3: o padrão do molde é o tempo de ler (0 refaz a vitrine aprovada)
/* ---------------------------------------------------------------- fim do plano */

const CORTES = montaCenas(false);
const pedacos = (): Pedaco[] => {
	const out: Pedaco[] = [];
	let at: Pal[] = [];
	const cena = (t: number) => CORTES.findIndex((c) => t >= c.de && t < c.ate);
	P.palavras.forEach((q, i) => {
		const p = {...q, i};
		at.push(p);
		const prox = P.palavras[i + 1];
		const fecha = !prox || at.length === 3 || /[.,!?]$/.test(p.texto) || prox.de - p.ate > 0.3 || cena(prox.de) !== cena(p.de);
		if (fecha) {
			out.push({pal: at, de: at[0].de, ate: p.ate});
			at = [];
		}
	});
	const gs = MIN_PEDACO ? (EQUILIBRA ? equilibrar(cena) : juntar(out, cena)) : out;
	return gs.map((g, i) => {
		const prox = gs[i + 1];
		const c = CORTES[cena(g.de)];
		const fica = MIN_PEDACO ? Math.max(g.ate + 0.45, g.de + MIN_PEDACO, g.pal[g.pal.length - 1].de + 0.4) : g.ate + 0.45;
		return {...g, ate: Math.min(fica, prox ? prox.de : Infinity, c ? c.ate : Infinity)};
	});
};
/** com MIN_PEDACO: junta o pedaço seguinte (da mesma cena) enquanto o atual ficaria curto ou a última palavra dele sumiria
 * antes de 0,4 s, mas nunca passa de 2 linhas no lugar do modo da cena (fala rápida não vira bloco de 3 linhas). O pedaço
 * que parou por estar cheio fica marcado (cheio) e o conferidor cobra dele só 1 s na tela. */
export const MAX_LINHAS = 2;
const juntar = (gs: Pedaco[], cena: (t: number) => number): Pedaco[] => {
	const out: Pedaco[] = [];
	for (const g of gs) {
		const at = out[out.length - 1];
		const quer = at && cena(at.de) === cena(g.de) && (g.de < at.de + MIN_PEDACO || g.de < at.pal[at.pal.length - 1].de + 0.4);
		if (quer && linhasDe([...at.pal, ...g.pal], CORTES[cena(at.de)]?.modo ?? 'palco') <= MAX_LINHAS) out[out.length - 1] = {pal: [...at.pal, ...g.pal], de: at.de, ate: g.ate};
		else {
			if (quer) at.cheio = true;
			out.push(g);
		}
	}
	return out;
};
/** com EQUILIBRA (o padrão do vídeo novo; a vitrine aprovada saiu sem): em vez de juntar grupos de 3 palavras na gula, cada
 * cena é cortada em pedaços pela melhor partição (programação dinâmica): nenhum pedaço curto (1,5 s; 1 s o cheio de 2
 * linhas), nenhuma palavra que some antes de 0,4 s, até 2 linhas, e o corte de preferência numa pontuação ou pausa. Fala
 * rápida deixava o último pedaço da cena sozinho ("seu vídeo." em 0,5 s) e não havia corte de cena que resolvesse. */
const equilibrar = (cena: (t: number) => number): Pedaco[] => {
	const W = P.palavras.map((q, i) => ({...q, i}));
	const out: Pedaco[] = [];
	let s = 0;
	while (s < W.length) {
		const k = cena(W[s].de);
		let e = s;
		while (e + 1 < W.length && cena(W[e + 1].de) === k) e++;
		const c = CORTES[k];
		const modo = c?.modo ?? 'palco';
		const fimCena = c ? c.ate : Infinity;
		// custo[j]: a melhor partição das palavras s..j-1; de[j]: onde começa o último pedaço dela
		const custo: number[] = Array(e + 2).fill(Infinity), de: number[] = Array(e + 2).fill(-1), cheios: boolean[] = Array(e + 2).fill(false);
		custo[s] = 0;
		for (let a = s; a <= e; a++) {
			if (custo[a] === Infinity) continue;
			for (let b = a + 1; b <= e + 1 && b - a <= 14; b++) {
				const pal = W.slice(a, b);
				if (linhasDe(pal, modo) > MAX_LINHAS) break;
				const ult = pal[pal.length - 1];
				const cheio = linhasDe(pal, modo) === MAX_LINHAS && (b > e || linhasDe(W.slice(a, b + 1), modo) > MAX_LINHAS);
				const ate = Math.min(Math.max(ult.ate + 0.45, pal[0].de + MIN_PEDACO, ult.de + 0.4), b <= e ? W[b].de : Infinity, fimCena);
				let v = ate - pal[0].de < (cheio ? 1 : MIN_PEDACO) - 1e-6 ? 1 : 0;
				if (!cheio) v += pal.filter((p) => ate - p.de < 0.4 - 1e-6).length;
				const pausa = b > e || /[.,!?]$/.test(ult.texto) || W[b].de - ult.ate > 0.3;
				const c2 = custo[a] + v * 1000 + (pausa ? 0 : 2) + 0.3 * Math.max(0, ate - pal[0].de - 3) + 0.5;
				if (c2 < custo[b]) {
					custo[b] = c2;
					de[b] = a;
					cheios[b] = cheio;
				}
			}
		}
		const partes: Pedaco[] = [];
		for (let b = e + 1; b > s; b = de[b]) {
			const pal = W.slice(de[b], b);
			partes.unshift({pal, de: pal[0].de, ate: pal[pal.length - 1].ate, cheio: cheios[b]});
		}
		out.push(...partes);
		s = e + 1;
	}
	return out;
};

const limpa = (s: string) => s.replace(/[.,!?]$/, '');

/** onde e em que tamanho cada modo põe a legenda (MODELO §2: um lugar por modo): topo, margens da caixa (esq/dir, o texto
 * centra entre elas), fonte e a escala da palavra-chave. A vitrine usa a caixa x 40-1040; a zona segura (REGRAS §5) é
 * x 60-940 e y 250-1500: num vídeo novo, esq 60 e dir 140 e um topo que caiba (o conferidor mede). */
export const LUGAR = {
	motion: {topo: 1290, topoAlto: 250, esq: 60, dir: 140, fonte: 84, chave: 1.25},
	palco: {topo: 1210, esq: 60, dir: 140, fonte: 54, chave: 1.3},
	dividido: {topo: DIVISA - 34, esq: 60, dir: 140, fonte: 40, chave: 1},
	rosto: {topo: 1200, esq: 60, dir: 140, fonte: 78, chave: 1.3}, // o lugar padrão da legenda (G12): o peito, y 1200
};

export const Legenda: React.FC = () => {
	const {t} = useT();
	const cenas = useCenas();
	const cena = cenaEm(cenas, t);
	const g = PEDACOS.find((q) => t >= q.de && t < q.ate);
	if (!g) return null;
	const modo = cena.modo;

	const palavra = (p: Pal, i: number, cor: string, corChave: string, escalaChave: number) => {
		const k = tw(t, p.de - 0.02, p.de + 0.12, 0, 1);
		const chave = CHAVE.has(p.i) && modo !== 'dividido';
		const txt = modo === 'dividido' || CAIXA_ALTA.has(p.i) ? limpa(p.texto).toUpperCase() : limpa(p.texto);
		const sel = SELECAO.has(p.i) && modo !== 'dividido';
		const ks = tw(t, p.de + 0.04, p.de + 0.22, 0, 1);
		return (
			<span
				key={i}
				style={{
					position: 'relative',
					display: 'inline-block',
					marginLeft: i ? '0.26em' : 0,
					opacity: k,
					transform: `translateY(${(1 - k) * 14}px)`,
					color: chave ? corChave : cor,
					fontFamily: chave ? SERIF : undefined,
					fontWeight: chave ? 400 : undefined,
					fontSize: chave ? `${escalaChave}em` : undefined,
					lineHeight: 1,
					padding: sel ? '0 0.12em' : undefined,
				}}
			>
				{txt}
				{sel && (
					<span style={{position: 'absolute', inset: '-0.06em -0.02em -0.1em', border: `4px solid ${C.selecao}`, opacity: ks}}>
						{[
							[-9, -9],
							[null, -9],
							[-9, null],
							[null, null],
						].map(([l, tp], j) => (
							<span key={j} style={{position: 'absolute', width: 14, height: 14, background: C.branco, border: `3px solid ${C.selecao}`, left: l ?? undefined, right: l === null ? -9 : undefined, top: tp ?? undefined, bottom: tp === null ? -9 : undefined}} />
						))}
					</span>
				)}
			</span>
		);
	};

	if (modo === 'motion')
		return (
			<div style={{position: 'absolute', left: LUGAR.motion.esq, right: LUGAR.motion.dir, top: cena.legendaTopo ? LUGAR.motion.topoAlto : LUGAR.motion.topo, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: LUGAR.motion.fonte, letterSpacing: '-0.03em', color: C.tinta}}>
				{g.pal.map((p, i) => palavra(p, i, C.tinta, C.destaque, LUGAR.motion.chave))}
			</div>
		);
	if (modo === 'palco')
		return (
			<div style={{position: 'absolute', left: LUGAR.palco.esq, right: LUGAR.palco.dir, top: LUGAR.palco.topo, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: LUGAR.palco.fonte, letterSpacing: '-0.02em', color: C.tinta}}>
				{g.pal.map((p, i) => palavra(p, i, C.tinta, C.destaque, LUGAR.palco.chave))}
			</div>
		);
	if (modo === 'dividido') {
		const e = tw(t, g.de - 0.02, g.de + 0.1, 0, 1);
		return (
			<div style={{position: 'absolute', left: LUGAR.dividido.esq, right: LUGAR.dividido.dir, top: LUGAR.dividido.topo, display: 'flex', justifyContent: 'center'}}>
				<div style={{background: '#1F1F1F', color: C.branco, fontFamily: MONO, fontWeight: 500, fontSize: LUGAR.dividido.fonte, letterSpacing: '0.02em', padding: '10px 22px 12px', borderRadius: 8, opacity: e, transform: `scale(${0.94 + 0.06 * e})`}}>
					{g.pal.map((p, i) => palavra(p, i, C.branco, C.branco, 1))}
				</div>
			</div>
		);
	}
	return (
		<div
			style={{
				position: 'absolute',
				left: LUGAR.rosto.esq,
				right: LUGAR.rosto.dir,
				top: LUGAR.rosto.topo,
				textAlign: 'center',
				fontFamily: SANS,
				fontWeight: 700,
				fontSize: LUGAR.rosto.fonte,
				letterSpacing: '-0.025em',
				color: C.branco,
				textShadow: '0 4px 24px rgba(0,0,0,0.4)',
			}}
		>
			{g.pal.map((p, i) => palavra(p, i, C.branco, C.destaqueClaro, LUGAR.rosto.chave))}
		</div>
	);
};

/* ---------------------------------------------------------------- conferência (scripts/cobertura.mjs)
 * cada pedaço com as palavras que mostra, quando fica na tela, o modo e a caixa estimada (largura pelo número de letras,
 * centrada na caixa do modo; a palavra-chave conta na escala dela). */
/** largura estimada (px) das palavras no lugar do modo: letras x fonte; a palavra-chave conta na escala dela */
const largura = (pal: Pal[], modo: Modo) => {
	const L = LUGAR[modo];
	return pal.reduce((s, p) => s + (limpa(p.texto).length + 1) * L.fonte * (modo === 'dividido' ? 0.62 : 0.55) * (CHAVE.has(p.i) ? L.chave : 1), 0);
};
const linhasDe = (pal: Pal[], modo: Modo) => Math.max(1, Math.ceil(largura(pal, modo) / (1080 - LUGAR[modo].esq - LUGAR[modo].dir)));
/** os pedaços (calculados depois de LUGAR e das larguras, que juntar() usa) */
export const PEDACOS = pedacos();
export const exibicoes = (previas: boolean) => {
	const cenas = montaCenas(previas);
	return PEDACOS.map((g) => {
		const cena = cenaEm(cenas, g.de);
		const L = LUGAR[cena.modo];
		const topo = cena.modo === 'motion' && cena.legendaTopo ? LUGAR.motion.topoAlto : L.topo;
		const caixa = 1080 - L.esq - L.dir, meio = L.esq + caixa / 2;
		const larguraTotal = largura(g.pal, cena.modo);
		const linhas = linhasDe(g.pal, cena.modo);
		const larg = Math.min(caixa, larguraTotal);
		const alto = linhas * L.fonte * Math.max(1.2, g.pal.some((p) => CHAVE.has(p.i)) ? L.chave : 1);
		return {cheio: !!g.cheio, texto: g.pal.map((p) => p.texto).join(' '), ids: g.pal.map((p) => p.i), de: g.de, ate: g.ate, modo: cena.modo, cena: cena.id, x0: meio - larg / 2, x1: meio + larg / 2, y0: topo, y1: topo + alto, linhas};
	});
};
