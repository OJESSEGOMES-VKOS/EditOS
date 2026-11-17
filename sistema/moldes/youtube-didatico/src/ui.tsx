import React from 'react';
import {Easing, interpolate} from 'remotion';
import {loadFont as loadInterTight} from '@remotion/google-fonts/InterTight';

/**
 * O kit da casa youtube-didatico: a identidade "Gelo, tinta e amarelo" (youtube-didatico.md, seções 5 e 6) e as peças
 * para montar a tela livre (a tela de gelo que a fala nova pede e o aprovado não tem). Tudo aqui serve a qualquer tema.
 *
 *   gelo #F8F8F8 = fundo das explicações          tinta #0A0A0A = texto sobre o gelo
 *   branco #FCFCFC = texto na frente da pessoa     amarelo #FCDC00 = o ÚNICO acento (palavra-chave, fio, contorno, ponto)
 *   ruim #FC0000 = o que é negado ou riscado       cinza #7A7A7A = rótulo secundário
 *   Inter Tight 900 (título, palavra-chave) / 800 (rótulo, número) / 700 (frase de ação); caixa alta, entreletra apertada
 *
 * O jeito de entrar: do borrão para nítido, subindo, com borrão de movimento (0,2 a 0,32 s). Nada pisca, gira à toa,
 * treme ou brilha. Cartão branco de canto 22 a 34 px com sombra suave, sem borda.
 */
const it = loadInterTight('normal', {weights: ['600', '700', '800', '900'], subsets: ['latin', 'latin-ext']});
export const SANS = it.fontFamily;
export const COR = {gelo: '#F8F8F8', tinta: '#0A0A0A', branco: '#FCFCFC', amarelo: '#FCDC00', ruim: '#FC0000', cinza: '#7A7A7A', vaga: '#EDEDED', cartao: '#FFFFFF'};
export const SOMBRA_TXT = '0 4px 24px rgba(0,0,0,0.45)';
export const SOMBRA_CARTAO = '0 18px 44px rgba(0,0,0,0.16), 0 3px 10px rgba(0,0,0,0.08)';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const tw = (t: number, a: number, b: number, v0: number, v1: number, e = OUT) => interpolate(t, [a, b], [v0, v1], {...clamp, easing: e});

/** texto que acende: do borrão (14 px) para nítido em 0,2 s, subindo e crescendo de 94% a 100% */
export const Acende: React.FC<{t: number; t0: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number}> = ({t, t0, children, style, dy = 24}) => {
	if (t < t0) return null;
	const u = tw(t, t0, t0 + 0.2, 0, 1);
	return (
		<span style={{display: 'inline-block', opacity: u, filter: `blur(${(1 - u) * 14}px)`, transform: `translateY(${(1 - u) * dy}px) scale(${0.94 + 0.06 * u})`, ...style}}>
			{children}
		</span>
	);
};

/* ================================================================ o kit da tela livre */

/** a zona da tela livre: a mesma área da grade e da conta (x 55 a 1025, y 90 a 1248), logo acima do cartão do rosto
 * (x 652 a 1022, y 1300 a 1800). Todo desenho de tela livre mora aqui dentro; a posição dos filhos é relativa a ela. */
export const PALCO = {x: 55, y: 90, w: 970, h: 1158};
export const Palco: React.FC<{children: React.ReactNode; centro?: boolean}> = ({children, centro = true}) => (
	<div
		style={{
			position: 'absolute', left: PALCO.x, top: PALCO.y, width: PALCO.w, height: PALCO.h, fontFamily: SANS, color: COR.tinta,
			...(centro ? {display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28} : {}),
		}}
	>
		{children}
	</div>
);

/** entra do jeito da casa: do borrão para nítido, de baixo (90 px), com borrão de movimento, em 0,32 s. `ate`: sai em 0,2 s */
export const Entra: React.FC<{t: number; em: number; ate?: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number}> = ({t, em, ate, children, style, dy = 90}) => {
	if (t < em) return <div style={{...style, visibility: 'hidden'}}>{children}</div>;
	const u = tw(t, em, em + 0.32, 0, 1);
	const s = ate !== undefined ? tw(t, ate - 0.2, ate, 1, 0) : 1;
	return <div style={{...style, opacity: Math.min(1, u * 1.6) * s, transform: `translateY(${(1 - u) * dy}px)`, filter: `blur(${(1 - u) * 16}px)`}}>{children}</div>;
};

/** cartão branco de canto 30 px e sombra suave, sem borda. `vaga`: antes do conteúdo entrar, a vaga cinza-clara já aparece */
export const Cartao: React.FC<{children?: React.ReactNode; w?: number | string; h?: number | string; raio?: number; style?: React.CSSProperties}> = ({children, w, h, raio = 30, style}) => (
	<div style={{width: w, height: h, borderRadius: raio, background: COR.cartao, boxShadow: SOMBRA_CARTAO, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 48px', boxSizing: 'border-box', ...style}}>{children}</div>
);

/** a palavra-título da tela: 900, caixa alta, entreletra -0,045 em, tinta (ou amarelo só na palavra-chave). Cada palavra
 * acende quando é dita: `ps` = [palavra, quando é dita]. Texto só o que foi dito (G19), como foi dito (G10). */
export const Palavras: React.FC<{t: number; ps: [string, number][]; tam?: number; cor?: string; peso?: number}> = ({t, ps, tam = 150, cor = COR.tinta, peso = 900}) => (
	<div style={{fontFamily: SANS, fontWeight: peso, fontSize: tam, lineHeight: 0.92, letterSpacing: '-0.045em', textTransform: 'uppercase', color: cor, textAlign: 'center'}}>
		{ps.map(([p, t0], k) => (
			<React.Fragment key={k}>
				{k > 0 && ' '}
				<Acende t={t} t0={t0}>{p}</Acende>
			</React.Fragment>
		))}
	</div>
);

/** rótulo secundário: 800, 44 px, cinza (o número do item, uma legenda curta do desenho) */
export const Rotulo: React.FC<{children: React.ReactNode; cor?: string; tam?: number}> = ({children, cor = COR.cinza, tam = 44}) => (
	<div style={{fontFamily: SANS, fontWeight: 800, fontSize: tam, letterSpacing: '-0.02em', textTransform: 'uppercase', color: cor}}>{children}</div>
);

/** o ponto amarelo da casa (marca um item) */
export const Ponto: React.FC<{d?: number}> = ({d = 40}) => <div style={{width: d, height: d, borderRadius: d / 2, background: COR.amarelo, flexShrink: 0}} />;

/** o fio amarelo que costura o modelo: desenha da esquerda para a direita em 0,35 s a partir de `em` */
export const Fio: React.FC<{t: number; em: number; w?: number; h?: number}> = ({t, em, w = 640, h = 6}) => (
	<div style={{width: w * tw(t, em, em + 0.35, 0, 1), height: h, background: COR.amarelo, alignSelf: 'center'}} />
);

/** negação ("não tem", "não consegue"): o risco vermelho atravessa o filho em 0,3 s a partir de `em` */
export const Risco: React.FC<{t: number; em: number; children: React.ReactNode}> = ({t, em, children}) => {
	const u = tw(t, em, em + 0.3, 0, 1);
	return (
		<div style={{position: 'relative', display: 'inline-block'}}>
			{children}
			<svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', inset: '-6%', width: '112%', height: '112%', overflow: 'visible'}}>
				<line x1={8} y1={92} x2={8 + 84 * u} y2={92 - 84 * u} stroke={COR.ruim} strokeWidth={16} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
			</svg>
		</div>
	);
};

/** "este aqui": o contorno amarelo de 7 px em volta do filho, na palavra que aponta (`em`) */
export const Contorno: React.FC<{t: number; em: number; raio?: number; children: React.ReactNode}> = ({t, em, raio = 34, children}) => {
	const u = tw(t, em, em + 0.25, 0, 1);
	return (
		<div style={{position: 'relative', display: 'inline-block'}}>
			{children}
			{t >= em && <div style={{position: 'absolute', inset: -14, borderRadius: raio + 9, border: `7px solid ${COR.amarelo}`, opacity: u, transform: `scale(${1.06 - 0.06 * u})`}} />}
		</div>
	);
};

/** processo: a linha tracejada da esquerda para a direita que se desenha entre `de` e `ate` (fluxo de etapas, seção 4) */
export const Tracejado: React.FC<{t: number; de: number; ate: number; w?: number}> = ({t, de, ate, w = 160}) => (
	<svg width={w} height={40} viewBox={`0 0 ${w} 40`} style={{flexShrink: 0}}>
		<line x1={4} y1={20} x2={4 + (w - 34) * tw(t, de, ate, 0, 1)} y2={20} stroke={COR.tinta} strokeWidth={6} strokeDasharray="14 12" strokeLinecap="round" />
		{t >= ate && <path d={`M${w - 26} 6 L${w - 6} 20 L${w - 26} 34`} fill="none" stroke={COR.tinta} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}
	</svg>
);

/** número com prova: conta de 0 até EXATAMENTE o número dito (G10) em 0,75 s, a partir de `em` */
export const Numero: React.FC<{t: number; em: number; valor: number; antes?: string; depois?: string; tam?: number; cor?: string}> = ({t, em, valor, antes = '', depois = '', tam = 220, cor = COR.tinta}) => {
	const v = Math.round(tw(t, em, em + 0.75, 0, valor));
	return (
		<div style={{fontFamily: SANS, fontWeight: 900, fontSize: tam, lineHeight: 0.9, letterSpacing: '-0.045em', color: cor, fontVariantNumeric: 'tabular-nums'}}>
			<Acende t={t} t0={em}>{`${antes}${v.toLocaleString('pt-BR')}${depois}`}</Acende>
		</div>
	);
};

/** ícone de traço (24x24, traço da tinta), para o "conceito novo = uma palavra e um ícone" (seção 4). `d`: um dos
 * desenhos de ICONES ou um caminho SVG próprio do vídeo (desenhado no mesmo traço). */
export const ICONES = {
	play: 'M7 4.5v15l12-7.5z',
	som: 'M4 9v6h4l5 4V5L8 9zM16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12',
	onda: 'M2 12h2l2-6 3 12 3-14 3 16 3-11 2 3h2',
	ouvido: 'M7 10a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-6 0M10 10a2 2 0 0 1 4 0',
	livro: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 5v16M8 7h7',
	lupa: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 21 21',
	estrela: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
	check: 'M5 12.5l4.5 4.5L19 7.5',
	x: 'M6 6l12 12M18 6 6 18',
	pasta: 'M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18z',
	relogio: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
	link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
	mais: 'M12 5v14M5 12h14',
	video: 'M3 6.5A1.5 1.5 0 0 1 4.5 5h10A1.5 1.5 0 0 1 16 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 17.5zM16 10l5-3v10l-5-3',
} as const;
export const Icone: React.FC<{d: keyof typeof ICONES | string; tam?: number; cor?: string; traco?: number}> = ({d, tam = 200, cor = COR.tinta, traco = 1.9}) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" style={{flexShrink: 0}}>
		<path d={(ICONES as Record<string, string>)[d] ?? d} fill="none" stroke={cor} strokeWidth={traco} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);
