import React from 'react';
import {C, DISPLAY, DIVISA, E, SOMBRA, fundoClaro, mola, tw, useT} from './tema';

export const Check: React.FC<{size?: number; cor?: string}> = ({size = 28, cor = C.tinta}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
		<path d="M5 12.5l4.5 4.5L19 7.5" />
	</svg>
);

export const Bolinha: React.FC<{size?: number}> = ({size = 44}) => (
	<div style={{width: size, height: size, flex: 'none', borderRadius: size / 2, background: C.menta, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
		<Check size={size * 0.62} />
	</div>
);

/** o asterisco laranja que marca o Claude (o agente que edita), sem copiar logotipo */
export const Faisca: React.FC<{size?: number}> = ({size = 34}) => (
	<svg width={size} height={size} viewBox="0 0 24 24">
		{[0, 30, 60, 90, 120, 150].map((a) => (
			<rect key={a} x={11} y={2} width={2.4} height={20} rx={1.2} fill={C.claude} transform={`rotate(${a} 12.2 12)`} />
		))}
	</svg>
);

/**
 * painel claro de cima da tela dividida: desce na entrada, sobe na saída (a saída começa no `ate`).
 * `funde`: quando vem direto do editor (mesmo fundo marfim), aparece no lugar em vez de descer.
 */
export const Painel: React.FC<{de: number; ate: number; funde?: boolean; children: React.ReactNode}> = ({de, ate, funde = false, children}) => {
	const {t} = useT();
	if (t < de - 0.01 || t > ate + 0.45) return null;
	const entra = tw(t, de, de + 0.4, 0, 1, E.inOut);
	const sai = tw(t, ate, ate + 0.4, 0, 1, E.inOut);
	const y = funde ? -sai * DIVISA : (Math.min(entra, 1 - sai) - 1) * DIVISA;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: DIVISA, overflow: 'hidden', ...fundoClaro, opacity: funde ? Math.min(1, entra * 3) : 1, transform: `translateY(${y}px)`}}>
			{children}
		</div>
	);
};

/** a coluna livre ao lado do rosto (parede à esquerda, altura dos olhos) */
export const Coluna: React.FC<{children: React.ReactNode; top?: number}> = ({children, top = 470}) => (
	<div style={{position: 'absolute', left: 96, top, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14}}>{children}</div>
);

export const Etiqueta: React.FC<{p: number; children: React.ReactNode; style?: React.CSSProperties}> = ({p, children, style}) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			gap: 12,
			padding: '10px 22px 12px 14px',
			borderRadius: 40,
			background: C.papel,
			color: C.tinta,
			fontWeight: 700,
			boxShadow: SOMBRA,
			opacity: Math.min(1, p * 2),
			transform: `scale(${0.85 + 0.15 * p})`,
			...style,
		}}
	>
		{children}
	</div>
);

/* ================================================================ o kit da tela livre
 * As peças com que se desenha a tela que a fala nova pede (src/telas/, na pasta do vídeo), no jeito da casa:
 * papel sobre marfim, sombra macia, Geist 800 apertada em tinta, menta só como preenchimento e marca-texto, verde no
 * que dá certo, entrada com mola, uma coisa por vez, tudo preso a uma palavra dita (o `em` de cada peça).
 * Texto: nunca menor que 56 px (o tamanho da pílula, a legenda que corre junto no dividido).
 */
type Modo = 'dividido' | 'cheia';
/** a área segura de cada modo: no dividido o painel vai até a pílula (y 880); na cheia, abaixo do título dito (y 460) */
export const ZONA_LIVRE: Record<Modo, {x0: number; x1: number; y0: number; y1: number}> = {
	dividido: {x0: 80, x1: 940, y0: 250, y1: 880},
	cheia: {x0: 80, x1: 940, y0: 460, y1: 1500},
};

/** o palco da tela livre: tudo dentro da zona segura do modo, centrado. Toda tela livre desenha dentro dele. */
export const Palco: React.FC<{modo: Modo; children: React.ReactNode; gap?: number; style?: React.CSSProperties}> = ({modo, children, gap = 28, style}) => {
	const z = ZONA_LIVRE[modo];
	return (
		<div style={{position: 'absolute', left: z.x0, width: z.x1 - z.x0, top: z.y0, height: z.y1 - z.y0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap, ...style}}>
			{children}
		</div>
	);
};

/** entra com mola na palavra `em` (sobe, cresce e gira um pouco, como os cartões da casa); com `ate`, sai em 0,3 s */
export const Entra: React.FC<{em: number; ate?: number; gira?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({em, ate, gira = 0, children, style}) => {
	const {t} = useT();
	const p = mola(t, em, {damping: 13, stiffness: 220, mass: 0.7});
	const s = ate !== undefined ? tw(t, ate, ate + 0.3, 0, 1, E.in) : 0;
	if (p <= 0 || s >= 1) return null;
	return <div style={{opacity: Math.min(1, p * 2) * (1 - s), transform: `translateY(${(1 - p) * 50}px) scale(${(0.6 + 0.4 * p) * (1 - 0.15 * s)}) rotate(${(1 - p) * gira}deg)`, ...style}}>{children}</div>;
};

/** o cartão de papel da casa (raio 26, sombra macia), já preenchido */
export const Cartao: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
	<div style={{background: C.papel, borderRadius: 26, boxShadow: SOMBRA, padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 20, ...style}}>{children}</div>
);

/** marca-texto menta que corre por baixo da palavra, 0,3 s depois de `em` */
export const MarcaTexto: React.FC<{em: number; children: React.ReactNode}> = ({em, children}) => {
	const {t} = useT();
	const m = tw(t, em + 0.3, em + 0.7, 0, 1, E.inOut);
	return (
		<span style={{position: 'relative', display: 'inline-block'}}>
			<span style={{position: 'absolute', left: -4, right: -4, bottom: '0.14em', height: '0.36em', borderRadius: 6, background: C.menta, transform: `scaleX(${m})`, transformOrigin: '0 50%'}} />
			<span style={{position: 'relative'}}>{children}</span>
		</span>
	);
};

/** frase grande (Geist 800, letras apertadas, tinta): palavra a palavra sobe da máscara a partir de `em`; as de `marcas`
 * ganham o marca-texto. Só texto dito (G19), e nunca o mesmo que a legenda mostra na mesma hora (G26). */
export const Frase: React.FC<{texto: string; em: number; tamanho?: number; marcas?: string[]; passo?: number}> = ({texto, em, tamanho = 74, marcas = [], passo = 0.06}) => {
	const {t} = useT();
	return (
		<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: '0.24em', textAlign: 'center', fontFamily: DISPLAY, fontWeight: 800, fontSize: Math.max(56, tamanho), lineHeight: 1.06, letterSpacing: '-0.04em', color: C.tinta}}>
			{texto.split(' ').map((w, k) => {
				const de = em + k * passo;
				const y = tw(t, de, de + 0.32, 105, 0, E.out);
				return (
					<span key={k} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: '0.14em', marginBottom: '-0.14em', opacity: t >= de - 0.02 ? 1 : 0}}>
						<span style={{display: 'inline-block', transform: `translateY(${y}%)`}}>{marcas.includes(w) ? <MarcaTexto em={de}>{w}</MarcaTexto> : w}</span>
					</span>
				);
			})}
		</div>
	);
};

/** a pílula de papel com ícone (como o chip do Claude), Geist 800 */
export const Chip: React.FC<{em: number; children: React.ReactNode; icone?: React.ReactNode; tamanho?: number}> = ({em, children, icone, tamanho = 60}) => {
	const {t} = useT();
	const p = mola(t, em, {damping: 11, stiffness: 240});
	if (p <= 0) return null;
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 16, background: C.papel, borderRadius: 60, padding: '20px 40px', boxShadow: `0 0 0 ${10 * (1 - Math.min(1, p))}px rgba(126,217,178,0.35), ${SOMBRA}`, fontFamily: DISPLAY, fontWeight: 800, fontSize: Math.max(56, tamanho), letterSpacing: '-0.03em', color: C.tinta, transform: `scale(${0.6 + 0.4 * p})`}}>
			{icone}
			{children}
		</div>
	);
};

/** linha de lista em cartão: o círculo vazio vira ✓ menta em `ok` (a lista que ganha ✓ item a item) */
export const ItemCheck: React.FC<{em: number; ok?: number; children: React.ReactNode; tamanho?: number; largura?: number}> = ({em, ok, children, tamanho = 56, largura = 760}) => {
	const {t} = useT();
	const v = ok !== undefined ? mola(t, ok, {damping: 10, stiffness: 300, mass: 0.6}) : 0;
	return (
		<Entra em={em} gira={-6}>
			<Cartao style={{width: largura, padding: '18px 28px'}}>
				{v > 0 ? <div style={{transform: `scale(${v})`}}><Bolinha size={64} /></div> : <div style={{width: 64, height: 64, flex: 'none', borderRadius: 32, border: `4px solid ${C.grade}`}} />}
				<div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: Math.max(56, tamanho), letterSpacing: '-0.03em', color: C.tinta}}>{children}</div>
			</Cartao>
		</Entra>
	);
};

/** a barra que enche (ou esvazia) de `de0` a `para` entre `de` e `ate` (a barra verde dos cartões da casa) */
export const Barra: React.FC<{de: number; ate: number; de0?: number; para?: number; largura?: number; altura?: number; cor?: string}> = ({de, ate, de0 = 0, para = 1, largura = 700, altura = 30, cor = C.verde}) => {
	const {t} = useT();
	const v = tw(t, de, ate, de0, para, E.inOut);
	return (
		<div style={{width: largura, height: altura, borderRadius: altura / 2, background: C.grade, overflow: 'hidden'}}>
			<div style={{width: `${v * 100}%`, height: altura, borderRadius: altura / 2, background: cor}} />
		</div>
	);
};

/** número grande que conta de `de0` até `para` entre `de` e `ate` (o número como foi dito, G10) */
export const Numero: React.FC<{de: number; ate: number; de0?: number; para: number; casas?: number; prefixo?: string; sufixo?: string; tamanho?: number}> = ({de, ate, de0 = 0, para, casas = 0, prefixo = '', sufixo = '', tamanho = 180}) => {
	const {t} = useT();
	const v = tw(t, de, ate, de0, para, E.out);
	return (
		<div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: Math.max(56, tamanho), letterSpacing: '-0.05em', lineHeight: 1, color: C.tinta, fontVariantNumeric: 'tabular-nums'}}>
			{prefixo}
			{v.toLocaleString('pt-BR', {minimumFractionDigits: casas, maximumFractionDigits: casas})}
			{sufixo}
		</div>
	);
};

/** risca o que está dentro em `em` (o "não tem", o "acabou"); com `ate`, o risco sai */
export const Risco: React.FC<{em: number; ate?: number; children: React.ReactNode; cor?: string}> = ({em, ate, children, cor = C.alerta}) => {
	const {t} = useT();
	const r = tw(t, em, em + 0.25, 0, 1, E.out) * (ate !== undefined ? 1 - tw(t, ate, ate + 0.25, 0, 1, E.in) : 1);
	return (
		<div style={{position: 'relative', display: 'inline-flex'}}>
			{children}
			{r > 0 ? <div style={{position: 'absolute', left: '-6%', top: '50%', width: '112%', height: 12, marginTop: -6, borderRadius: 6, background: cor, transform: `rotate(-28deg) scaleX(${r})`, transformOrigin: '0 50%'}} /> : null}
		</div>
	);
};

/** ícone de traço (viewBox 24), no traço da casa; `d` é um caminho ou uma lista de caminhos */
export const Icone: React.FC<{d: string | string[]; size?: number; cor?: string; espessura?: number}> = ({d, size = 96, cor = C.verde, espessura = 2}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={espessura} strokeLinecap="round" strokeLinejoin="round">
		{(Array.isArray(d) ? d : [d]).map((x, i) => (
			<path key={i} d={x} />
		))}
	</svg>
);

/** anéis que saem do centro do pai a partir de `em` (som, sinal, alcance), menta, um a cada `passo` s; param em `ate`.
 * Crescem de `minimo` x `raio` até `raio` (ponha o mínimo fora do objeto do meio, senão nascem escondidos atrás dele). */
export const Ondas: React.FC<{em: number; ate?: number; raio?: number; minimo?: number; cor?: string; passo?: number}> = ({em, ate, raio = 260, minimo = 0.45, cor = C.menta, passo = 0.5}) => {
	const {t} = useT();
	const fim = ate ?? Infinity;
	if (t < em) return null;
	return (
		<div style={{position: 'absolute', left: '50%', top: '50%', width: 0, height: 0}}>
			{[0, 1, 2].map((k) => {
				const nasce = em + k * passo; // cada anel nasce em nasce + n * 3 * passo e vive 3 * passo
				if (t < nasce) return null;
				const n = Math.floor((t - nasce) / (3 * passo));
				if (nasce + n * 3 * passo > fim) return null;
				const ciclo = (t - nasce - n * 3 * passo) / (3 * passo);
				const r = raio * (minimo + (1 - minimo) * ciclo);
				return <div key={k} style={{position: 'absolute', left: -r, top: -r, width: 2 * r, height: 2 * r, borderRadius: r, border: `8px solid ${cor}`, opacity: 1 - ciclo}} />;
			})}
		</div>
	);
};
