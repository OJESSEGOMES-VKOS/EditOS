import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, E, SANS, SCRIPT, SERIF, entra, mola, suave, tw} from './tema';

/**
 * O kit das telas novas do autoridade (a tela que a fala pede e o aprovado não tem; modelos/autoridade/autoridade.md §4
 * e §9). Tudo na linguagem da casa: Poppins 600/800 com UMA alternativa (DM Serif ou Great Vibes), a cor de destaque do
 * cenário (C), o creme e a tinta, a mola de entrada (80% -> 100%), a palavra que entra do desfoque, a borda creme de 6 px
 * nos cartões e a sombra funda. Nada de contorno no texto, brilho, tremor ou giro sem motivo.
 *
 * Toda tela nova desenha dentro do <Palco modo={modo}>, em coordenadas do próprio palco:
 *   cheia    = o herói embaixo da tipografia da tela: 880 x 600 (no quadro, x 100 a 980, y 1000 a 1600). Objeto, sem texto.
 *   dividida = o painel de cima, opaco, sobre o vídeo: 960 x 840 (no quadro, x 60 a 1020, y 60 a 900); texto só em
 *              y >= 190 do palco (y 250 do quadro) e até x 880 do palco (x 940 do quadro).
 */
export type ModoTela = 'cheia' | 'dividida';
/** o herói: o objeto que faz o que a frase diz. Recebe o tempo atual (t), o começo e o fim da tela, a cor da frente (fg)
 * e a de acento (ac), já certas para o fundo; o modo; e do plano os instantes (em), os textos ditos e o resto (dados) */
export type Heroi = React.FC<{t: number; de: number; fim: number; fg: string; ac: string; modo: ModoTela; em: Record<string, number>; textos: Record<string, string>; dados: Record<string, unknown>}>;
export const PALCO: Record<ModoTela, {x: number; y: number; w: number; h: number}> = {
	cheia: {x: 100, y: 1000, w: 880, h: 600},
	dividida: {x: 60, y: 60, w: 960, h: 840},
};
/** onde o texto de uma tela nova pode morar, no quadro (o checador usa esta caixa) */
export const ZONA_TEXTO: Record<ModoTela, {x0: number; x1: number; y0: number; y1: number}> = {
	cheia: {x0: 100, x1: 940, y0: 1000, y1: 1500},
	dividida: {x0: 60, x1: 940, y0: 250, y1: 900},
};

export const Palco: React.FC<{modo: ModoTela; children: React.ReactNode}> = ({modo, children}) => {
	const p = PALCO[modo];
	return <div style={{position: 'absolute', left: p.x, top: p.y, width: p.w, height: p.h}}>{children}</div>;
};

/** posiciona um filho no palco (x, y do canto de cima à esquerda; ou cx para centrar na horizontal) */
export const Em: React.FC<{x?: number; cx?: number; y: number; w?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, cx, y, w, children, style}) => (
	<div style={{position: 'absolute', left: cx !== undefined && w ? cx - w / 2 : x ?? 0, top: y, width: w, ...style}}>{children}</div>
);

/** um objeto que entra com a mola da casa no instante `em` (0,04 s antes da palavra dita) */
export const Entra: React.FC<{t: number; em: number; children: React.ReactNode; style?: React.CSSProperties}> = ({t, em, children, style}) => (
	<div style={{...entra(mola(t, em - 0.04)), ...style}}>{children}</div>
);

/** o cartão 9:16 da casa: borda da cor da frente, raio 26, sombra funda; `quadro` mostra a gravação (public/quadro.jpg) */
export const Cartao: React.FC<{w: number; fg: string; quadro?: boolean; claro?: number; fundo?: string; children?: React.ReactNode; style?: React.CSSProperties}> = ({w, fg, quadro, claro = 1, fundo = C.escuro2, children, style}) => {
	const h = (w * 16) / 9;
	return (
		<div style={{position: 'relative', width: w, height: h, borderRadius: 26, overflow: 'hidden', border: `6px solid ${fg}`, background: fundo, boxShadow: '0 30px 60px -20px rgba(0,0,0,0.6)', ...style}}>
			{quadro && <Img src={staticFile('quadro.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: `brightness(${claro})`}} />}
			{children}
		</div>
	);
};

/** o painel creme com o cabeçalho tinta (o do painel de lista); `titulo` só com palavra dita */
export const Painel: React.FC<{w: number; titulo?: string; children: React.ReactNode}> = ({w, titulo, children}) => (
	<div style={{width: w, background: C.creme, borderRadius: 32, overflow: 'hidden', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.5)'}}>
		{titulo ? <div style={{background: C.tinta, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.creme}}>{titulo}</div> : null}
		<div style={{padding: '18px 34px'}}>{children}</div>
	</div>
);

/** texto dito numa tela nova, palavra que entra do desfoque em `em`. voz: base (Poppins 600), ancora (800 apertada),
 * serif (DM Serif) ou script (Great Vibes); uma alternativa por tela. Nunca menor que 40 px */
export const Texto: React.FC<{t: number; em: number; tam: number; voz?: 'base' | 'ancora' | 'serif' | 'script'; cor?: string; children: React.ReactNode}> = ({t, em, tam, voz = 'base', cor = '#fff', children}) => {
	const fam = voz === 'serif' ? SERIF : voz === 'script' ? SCRIPT : SANS;
	return (
		<span style={{display: 'inline-block', whiteSpace: 'nowrap', fontFamily: fam, fontWeight: voz === 'ancora' ? 800 : voz === 'base' ? 600 : 400, fontSize: Math.max(40, voz === 'script' ? tam * 1.3 : tam), letterSpacing: voz === 'ancora' ? '-0.03em' : voz === 'base' ? '-0.01em' : 0, lineHeight: 1.05, color: cor, ...suave(t, em)}}>
			{children}
		</span>
	);
};

/** o rótulo em pílula branca com o ponto da cor de destaque (Poppins 800); só com o nome dito */
export const Pilula: React.FC<{txt: string; tam?: number; style?: React.CSSProperties}> = ({txt, tam = 34, style}) => (
	<div style={{display: 'inline-flex', alignItems: 'center', gap: tam * 0.45, padding: `${tam * 0.4}px ${tam * 0.8}px`, borderRadius: 999, background: 'rgba(255,255,255,0.95)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', whiteSpace: 'nowrap', ...style}}>
		<span style={{width: tam * 0.42, height: tam * 0.42, borderRadius: tam, background: C.cor, flexShrink: 0}} />
		<span style={{fontFamily: SANS, fontWeight: 800, fontSize: tam, letterSpacing: '0.02em', color: '#1d1d1d', lineHeight: 1.1}}>{txt}</span>
	</div>
);

/** o visto que se desenha em `em` (círculo da cor de destaque, ✓ branco); aceso = o item da vez (branco sobre a cor) */
export const Visto: React.FC<{t: number; em: number; tam?: number; aceso?: boolean}> = ({t, em, tam = 52, aceso}) => {
	const e = tw(t, em - 0.06, em + 0.3, 0, 1);
	const v = tw(t, em, em + 0.45, 0, 1, E.io);
	return (
		<svg width={tam} height={tam} viewBox="0 0 64 64" style={{flexShrink: 0}}>
			<circle cx="32" cy="32" r="28" fill={aceso ? '#fff' : C.cor} fillOpacity={e} stroke={aceso ? '#fff' : C.cor} strokeWidth="4" />
			<path d="M19 33 L28 42 L45 23" fill="none" stroke={aceso ? C.cor : '#fff'} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - v} />
		</svg>
	);
};

/** a barra arredondada que cresce de `v0` a `v1` (0 a 1 da largura) entre `de` e `ate` */
export const Barra: React.FC<{t: number; de: number; ate: number; v0?: number; v1: number; w: number; h?: number; cor: string; trilho?: string}> = ({t, de, ate, v0 = 0, v1, w, h = 34, cor, trilho = 'rgba(244,239,230,0.18)'}) => (
	<div style={{width: w, height: h, borderRadius: h / 2, background: trilho, overflow: 'hidden'}}>
		<div style={{width: `${tw(t, de, ate, v0, v1, E.io) * 100}%`, height: '100%', borderRadius: h / 2, background: cor}} />
	</div>
);

/** o número que conta até o valor DITO (G10), em Poppins 800 */
export const Numero: React.FC<{t: number; de: number; ate: number; para: number; tam: number; cor?: string; sufixo?: string}> = ({t, de, ate, para, tam, cor = '#fff', sufixo = ''}) => (
	<span style={{fontFamily: SANS, fontWeight: 800, fontSize: tam, letterSpacing: '-0.03em', color: cor, fontVariantNumeric: 'tabular-nums'}}>
		{Math.round(tw(t, de, ate, 0, para, E.io))}
		{sufixo}
	</span>
);

/** o traço da cor de destaque que se desenha em 0,3 s (risca, sublinha, corta: a lâmina da linha do tempo) */
export const Traco: React.FC<{t: number; em: number; w: number; cor: string; espessura?: number; vertical?: boolean}> = ({t, em, w, cor, espessura = 8, vertical}) => {
	const k = tw(t, em - 0.04, em + 0.3, 0, 1);
	return <div style={{width: vertical ? espessura : w * k, height: vertical ? w * k : espessura, borderRadius: espessura, background: cor}} />;
};

/** a trilha de som da casa (as barras da linha do tempo): `n` barras, `aceso` de 0 a 1 acende da esquerda para a direita */
export const Onda: React.FC<{n?: number; w: number; h?: number; cor: string; aceso?: number; picos?: number[]}> = ({n = 40, w, h = 120, cor, aceso = 1, picos = []}) => (
	<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{overflow: 'visible'}}>
		{Array.from({length: n}).map((_, i) => {
			const a = 0.18 + 0.82 * Math.abs(Math.sin(i * 1.7) * 0.6 + Math.sin(i * 0.6) * 0.4);
			const alto = (picos.includes(i) ? 1 : a) * h;
			const on = i / n < aceso;
			return <rect key={i} x={i * (w / n) + 2} y={(h - alto) / 2} width={w / n - 6} height={alto} rx="4" fill={cor} opacity={on ? 0.9 : 0.25} />;
		})}
	</svg>
);
