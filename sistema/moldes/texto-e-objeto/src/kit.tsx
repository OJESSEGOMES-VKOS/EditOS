/* O kit da casa do texto-e-objeto: o que serve a qualquer fala (texto-e-objeto.md §5, .claude/skills/texto-e-objeto).
 * Os heróis da casa (src/Cenas.tsx) e as telas livres do vídeo novo (src/telas/<Nome>.tsx) usam só daqui: assim o objeto
 * novo nasce com a cara do modelo (as cores do fundo da própria tela, a faísca, a mola, a entrada do desfoque). */
import React from 'react';
import {C, E, MONO, P, SANS, SCRIPT, SERIF, limpa, mola, tw, useT, w} from './tema';

export {C, E, MONO, SANS, SCRIPT, SERIF, limpa, mola, tw, useT, w};

/* ------------------------------------------------------------------ tipos */
export type Fonte = 'sans' | 'script' | 'serif';
export type Efeito = 'corta' | 'sublinha' | 'moldura' | 'anel';
export type Linha = {txt: string; tam: number; fonte?: Fonte; peso?: number; acento?: boolean; efeito?: Record<string, Efeito>};
export type Palavra = {txt: string; de: number; efeito?: Efeito};
export type LinhaPronta = Linha & {palavras: Palavra[]};
/** o herói de uma tela: <Heroi comp="Nome" /> no plano (o nome de um herói da casa ou de uma tela livre registrada) */
export type HeroiEl = React.ReactElement<{comp: string}>;
export type Spec = {id: string; fundo: 'E' | 'L'; topo: number; linhas: Linha[]; heroi?: HeroiEl; alinha?: 'left' | 'center'; iris?: boolean; de?: () => number};
export type Cena = Omit<Spec, 'linhas' | 'de'> & {linhas: LinhaPronta[]; de: number; ate: number};
/** o que todo herói recebe: a própria tela (fundo, começo e fim) */
export type HeroiProps = {c: Cena};

/* os valores de estilo do plano têm nome (o tools/clone.py lê as aspas do plano como texto de tela) */
export const CURSIVA: Fonte = 'script';
export const SERIFA: Fonte = 'serif';
export const ESQ = 'left' as const;
export const CORTA: Efeito = 'corta';
export const SUBLINHA: Efeito = 'sublinha';
export const MOLDURA: Efeito = 'moldura';
export const ANEL: Efeito = 'anel';

/* ------------------------------------------------------------------ peças */
export const ab = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({position: 'absolute', left: x, top: y, ...extra});
/** o perfil (props da composição) na assinatura do fecho; vazio esconde */
export const Perfil = React.createContext({arroba: '', foto: '', arquivo: ''});
/** as cores do herói vêm do fundo da tela dele: no escuro, acento laranja e fg creme; no laranja, acento creme e fg tinta */
export const cores = (f: 'E' | 'L') => (f === 'E' ? {fg: C.creme, acento: C.laranja, sub: 'rgba(251,239,230,0.82)', contra: C.tinta} : {fg: C.tinta, acento: C.creme, sub: 'rgba(26,13,8,0.8)', contra: C.creme});

/** a faísca de 12 raios (o ícone de ideia/decisão da casa) */
export const Faisca: React.FC<{size: number; cor: string; giro?: number}> = ({size, cor, giro = 0}) => (
	<svg width={size} height={size} viewBox="-50 -50 100 100" style={{transform: `rotate(${giro}deg)`}}>
		{Array.from({length: 12}, (_, i) => {
			const a = (i / 12) * Math.PI * 2;
			const r = i % 2 ? 34 : 45;
			return <line key={i} x1={Math.cos(a) * 8} y1={Math.sin(a) * 8} x2={Math.cos(a) * r} y2={Math.sin(a) * r} stroke={cor} strokeWidth={8} strokeLinecap="round" />;
		})}
	</svg>
);

/** início da palavra se ela é dita dentro desta tela (n-ésima vez dentro dela); senão o começo da tela: o herói nunca nasce pronto */
export const naTela = (c: Cena, texto: string, n = 1) => P.palavras.filter((p) => limpa(p.texto) === limpa(texto) && p.de >= c.de - 0.01 && p.de < c.ate)[n - 1]?.de ?? c.de;

/** a palavra é dita dentro desta tela? (para um herói que serve a mais de uma tela e faz coisas diferentes em cada uma) */
export const diz = (c: Cena, texto: string) => P.palavras.some((p) => limpa(p.texto) === limpa(texto) && p.de >= c.de - 0.01 && p.de < c.ate);

/** entrada da casa: nasce do desfoque, 40 px à direita, em ~5 quadros (a mesma da palavra) */
export const surge = (t: number, at: number): React.CSSProperties => {
	const k = tw(t, at - 0.04, at + 0.14, 0, 1);
	return {opacity: k, filter: `blur(${(1 - k) * 18}px)`, transform: `translateX(${(1 - k) * 40}px)`};
};
/** entrada com mola: cresce de 40% a 100% (o objeto que "chega") */
export const cresce = (t: number, at: number, cfg?: Parameters<typeof mola>[2]): React.CSSProperties => {
	const k = mola(t, at, cfg);
	return {opacity: Math.min(1, k * 1.5), transform: `scale(${0.4 + 0.6 * k})`};
};

/** o palco do herói: a área livre da tela (por padrão embaixo do bloco de texto, y 820 a 1500, x 80 a 1000). Tudo do herói
 * se desenha dentro dele, em coordenadas próprias (0,0 no canto de cima). Com o bloco no meio da tela, o herói não entra. */
export const Palco: React.FC<{de?: number; ate?: number; children: React.ReactNode}> = ({de = 820, ate = 1500, children}) => (
	<div style={ab(80, de, {width: 920, height: ate - de})}>{children}</div>
);
