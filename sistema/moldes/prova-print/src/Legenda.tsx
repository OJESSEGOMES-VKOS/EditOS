import React from 'react';
import {C, CENAS, FIXOS, G, P, SANS, SERIF, cenaEm, iw, tw, useT} from './tema';
import type {Modo} from './tema';

/**
 * A legenda (prova-print.md §5): dois lugares no vídeo (G15): no palco y 940, entre o card da prova e a cabeça que sai
 * do cartão de câmera (ref4); na vitrine, no capítulo e no rosto fechado y 1180 (abaixo do card, no peito). O pedaço inteiro aparece de uma vez com as palavras ainda não ditas apagadas, e
 * cada uma acende no início dela (o "apagada que acende" das referências), com o tempo de leitura da casa: o pedaço dura
 * >= 1,5 s, nunca atravessa um corte, nunca passa de 2 linhas e nunca junta fim de frase com começo de outra (G35).
 */
type Pal = {texto: string; de: number; ate: number; i: number};
type Pedaco = {pal: Pal[]; de: number; ate: number; cheio?: boolean};
/* ---------------------------------------------------------------- o plano da legenda (refazer num vídeo novo) */
/** palavras-chave (o termo protagonista: número, nome da ferramenta, o objeto da prova): serifa itálica azul */
export const CHAVE = new Set([iw('modelos'), iw('claude', 2), iw('instagram'), iw('prévias'), iw('modelos', 3), iw('aprender'), iw('dm')]);
/** as palavras que um texto fixo já mostra (o título do gancho, o contador, o comando do fecho; FIXOS em src/tema.ts): a
 * legenda não repete (PV4: um elemento por ideia na tela) */
export const FIXO = new Set(FIXOS.flatMap((x) => x.ids));
export const MIN_PEDACO = 1.5;
/** quanto antes da 1ª palavra o pedaço pode nascer apagado, quando a legenda está vazia (s) */
export const ANTECIPA = 0.5;
/* ---------------------------------------------------------------- fim do plano */

export const LUGAR = {topo: G.legenda, palco: G.legendaPalco, esq: 60, dir: 140, fonte: 66, chave: 1.22};
export const topoDe = (modo: Modo) => (modo === 'palco' ? LUGAR.palco : LUGAR.topo);
export const MAX_LINHAS = 2;
/** até 2 linhas em todo modo (a ref usa 1 linha de 1 a 3 palavras no palco, mas troca a cada 0,3 a 0,8 s: o tempo de
 * leitura da casa vence, PV2) */
const maxLinhas = (_c: number) => MAX_LINHAS;
const cena = (t: number) => CENAS.findIndex((c) => t >= c.de && t < c.ate);
const limpaPont = (s: string) => s.replace(/[.,!?:;]$/, '');

const largura = (pal: Pal[]) => pal.reduce((s, p) => s + (limpaPont(p.texto).length + 1) * LUGAR.fonte * 0.56 * (CHAVE.has(p.i) ? LUGAR.chave * 0.92 : 1), 0);
const caixa = 1080 - LUGAR.esq - LUGAR.dir;
export const linhasDe = (pal: Pal[]) => Math.max(1, Math.ceil(largura(pal) / caixa));

/** fala corrida: um trecho (entre pontuação, corte ou o comando fixo) vira o menor número de pedaços de até 2 linhas,
 * equilibrados pelo número de letras. Um pedaço nunca junta dois trechos (G35). Cada pedaço fica até o próximo nascer,
 * no mínimo 1,5 s quando a fala deixa, e nunca atravessa o corte. */
const pedacos = (): Pedaco[] => {
	const trechos: Pal[][] = [];
	let at: Pal[] = [];
	P.palavras.forEach((q, i) => {
		if (FIXO.has(i)) {
			if (at.length) trechos.push(at);
			at = [];
			return;
		}
		at.push({...q, i});
		const prox = P.palavras[i + 1];
		if (!prox || /[.,!?:;]$/.test(q.texto) || cena(prox.de) !== cena(q.de) || FIXO.has(i + 1)) {
			trechos.push(at);
			at = [];
		}
	});
	const out: Pedaco[] = [];
	for (const tr of trechos) {
		let k = 1;
		const ML = maxLinhas(cena(tr[0].de));
		while (k < tr.length && Math.ceil(linhasDe(tr) / k) > ML) k++;
		// corta em k partes equilibradas pelas letras (cada parte <= 2 linhas; se não couber, mais uma parte)
		const partes = (n: number) => {
			const tot = tr.reduce((s, p) => s + p.texto.length + 1, 0);
			const r: Pal[][] = [];
			let cur: Pal[] = [], soma = 0;
			tr.forEach((p, j) => {
				cur.push(p);
				soma += p.texto.length + 1;
				if (r.length < n - 1 && soma >= (tot * (r.length + 1)) / n && j < tr.length - 1) {
					r.push(cur);
					cur = [];
				}
			});
			if (cur.length) r.push(cur);
			return r;
		};
		let ps = partes(k);
		while (ps.some((x) => linhasDe(x) > ML) && k < tr.length) ps = partes(++k);
		ps.forEach((x, j) => out.push({pal: x, de: x[0].de, ate: x[x.length - 1].ate, cheio: ps.length > 1 && j < ps.length - 1}));
	}
	const fim = out.map((g, k) => {
		const prox = out[k + 1];
		const c = CENAS[cena(g.de)];
		const fica = Math.max(g.ate + 0.45, g.de + MIN_PEDACO, g.pal[g.pal.length - 1].de + 0.4);
		return {...g, ate: Math.min(fica, prox ? prox.de : Infinity, c ? c.ate : Infinity)};
	});
	// o pedaço pode nascer até ANTECIPA s antes da 1ª palavra (apagado, acende quando é dita) se a legenda estiver vazia e na
	// mesma cena: dá tempo de leitura à fala corrida sem atrasar nada
	return fim.map((g, k) => {
		const ant = fim[k - 1];
		const c = CENAS[cena(g.de)];
		return {...g, de: Math.max(g.de - ANTECIPA, ant ? ant.ate : 0, c ? c.de : 0)};
	});
};
export const PEDACOS = pedacos();

const estilo = (modo: Modo) =>
	modo === 'palco' || modo === 'capitulo'
		? {cor: C.tinta, chave: C.chave, sombra: undefined}
		: {cor: C.branco, chave: C.chaveEscuro, sombra: modo === 'rosto' ? '0 6px 48px rgba(0,0,0,0.5)' : undefined};

export const Legenda: React.FC = () => {
	const {t} = useT();
	const c = cenaEm(t);
	const g = PEDACOS.find((q) => t >= q.de && t < q.ate);
	if (!g) return null;
	const s = estilo(c.modo);
	const nasce = tw(t, g.de - 0.04, g.de + 0.12, 0, 1);
	return (
		<div
			style={{
				position: 'absolute',
				left: LUGAR.esq,
				right: LUGAR.dir,
				top: topoDe(c.modo),
				textAlign: 'center',
				fontFamily: SANS,
				fontWeight: 700,
				fontSize: LUGAR.fonte,
				lineHeight: '78px',
				letterSpacing: '-0.025em',
				color: s.cor,
				textShadow: s.sombra,
				opacity: nasce,
				transform: `translateY(${(1 - nasce) * 10}px)`,
			}}
		>
			{g.pal.map((p, i) => {
				const acende = tw(t, p.de - 0.03, p.de + 0.1, 0.38, 1);
				const chave = CHAVE.has(p.i);
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							marginLeft: i ? '0.24em' : 0,
							opacity: acende,
							color: chave ? s.chave : undefined,
							fontFamily: chave ? SERIF : undefined,
							fontWeight: chave ? 400 : undefined,
							fontSize: chave ? `${LUGAR.chave}em` : undefined,
							lineHeight: 1,
						}}
					>
						{limpaPont(p.texto)}
					</span>
				);
			})}
		</div>
	);
};

/* ---------------------------------------------------------------- conferência (scripts/cobertura.mjs) */
export const exibicoes = () =>
	PEDACOS.map((g) => {
		const c = cenaEm(g.de);
		const meio = LUGAR.esq + caixa / 2;
		const linhas = linhasDe(g.pal);
		const larg = Math.min(caixa, largura(g.pal));
		return {cheio: !!g.cheio, texto: g.pal.map((p) => p.texto).join(' '), ids: g.pal.map((p) => p.i), de: g.de, ate: g.ate, modo: c.modo, cena: c.id, x0: meio - larg / 2, x1: meio + larg / 2, y0: topoDe(c.modo), y1: topoDe(c.modo) + linhas * 78, linhas};
	});
