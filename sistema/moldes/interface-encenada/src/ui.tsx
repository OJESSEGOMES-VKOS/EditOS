import React from 'react';
import {Freeze, OffthreadVideo, staticFile} from 'remotion';
import {C, DIVISA, E, MONO, R, SANS, SERIF, SOMBRA, mola, rostoX, tw, useT} from './tema';

/** o vídeo pode acabar antes da fala: daí em diante segura o penúltimo quadro de public/fala.mp4 (na vitrine, 906 quadros:
 * segura o 904). A contagem vem de src/rosto_med.json, que scripts/rosto.py mede do vídeo. */
const ULTIMO = R.quadros - 2;

/** a fala da pessoa (muda: o som entra uma vez só, no Reel). Congela no fim (ULTIMO). */
export const Fala: React.FC<{s?: number; x?: number; y?: number}> = ({s = 1, x = 0, y = 0}) => {
	const {f} = useT();
	const v = <OffthreadVideo muted src={staticFile('fala.mp4')} style={{width: 1080, height: 1920}} />;
	return (
		<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `translate(${x}px, ${y}px) scale(${s})`}}>
			{f < ULTIMO ? v : <Freeze frame={ULTIMO}>{v}</Freeze>}
		</div>
	);
};

/** enquadra o vídeo numa caixa: escala s, olhos em (cx, oy) da caixa; segue o rosto na horizontal (rosto_t.json) */
export const FalaEm: React.FC<{s: number; cx: number; oy: number; fixo?: boolean}> = ({s, cx, oy, fixo}) => {
	const {t} = useT();
	return <Fala s={s} x={cx - s * (fixo ? R.cx : rostoX(t))} y={oy - s * R.olhos} />;
};

/** caixa de seleção com alças (estilo Figma, ref3) em volta de um elemento posicionado */
export const Selecao: React.FC<{o?: number; cor?: string; pad?: number}> = ({o = 1, cor = C.selecao, pad = 10}) => (
	<div style={{position: 'absolute', inset: -pad, border: `4px solid ${cor}`, opacity: o, pointerEvents: 'none'}}>
		{[
			{left: -11, top: -11},
			{right: -11, top: -11},
			{left: -11, bottom: -11},
			{right: -11, bottom: -11},
		].map((k, j) => (
			<div key={j} style={{position: 'absolute', width: 18, height: 18, background: C.branco, border: `4px solid ${cor}`, ...k}} />
		))}
	</div>
);

/** a faísca do Claude (asterisco de raios, não é o logo) */
export const Faisca: React.FC<{size: number; cor?: string}> = ({size, cor = C.branco}) => (
	<svg width={size} height={size} viewBox="-50 -50 100 100">
		{Array.from({length: 12}, (_, i) => {
			const a = (i / 12) * Math.PI * 2;
			const r = i % 2 ? 34 : 44;
			return <line key={i} x1={Math.cos(a) * 9} y1={Math.sin(a) * 9} x2={Math.cos(a) * r} y2={Math.sin(a) * r} stroke={cor} strokeWidth={9} strokeLinecap="round" />;
		})}
	</svg>
);

export const ChipClaude: React.FC<{size: number}> = ({size}) => (
	<div style={{width: size, height: size, borderRadius: size * 0.24, background: C.destaque, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SOMBRA}}>
		<Faisca size={size * 0.72} />
	</div>
);

export const Cursor: React.FC<{x: number; y: number; cor?: string; rotulo?: string; o?: number; clique?: number}> = ({x, y, cor = C.tinta, rotulo, o = 1, clique = 0}) => (
	<div style={{position: 'absolute', left: x, top: y, opacity: o, transform: `scale(${1 - 0.15 * clique})`, transformOrigin: '0 0'}}>
		<svg width={46} height={56} viewBox="0 0 23 28">
			<path d="M1 1 L1 22 L6.5 16.5 L10.5 26 L14 24.5 L10 15.5 L18 15.5 Z" fill={cor} stroke={C.branco} strokeWidth={1.6} strokeLinejoin="round" />
		</svg>
		{rotulo && (
			<div style={{position: 'absolute', left: 34, top: 40, background: cor, color: C.branco, fontFamily: SANS, fontWeight: 700, fontSize: 24, padding: '4px 12px', borderRadius: 8, whiteSpace: 'nowrap'}}>{rotulo}</div>
		)}
	</div>
);

/** entrada que salta (mola) */
export const pop = (t: number, at: number) => {
	const k = mola(t, at);
	return {opacity: Math.min(1, k * 1.6), transform: `scale(${0.6 + 0.4 * k})`};
};

/** título do palco (MODELO §2 M1): serifa itálica na cor de destaque + sans preta + traço de pincel */
export const Titulo: React.FC<{serif: string; sans?: string; de: number; ate?: number}> = ({serif, sans, de, ate = 999}) => {
	const {t} = useT();
	if (t < de || t > ate + 0.25) return null;
	const e = tw(t, de, de + 0.28, 0, 1);
	const s = tw(t, ate, ate + 0.22, 0, 1, E.in);
	const x = (1 - e) * 140 - s * 160;
	const blur = (1 - e) * 10 + s * 12;
	const traco = tw(t, de + 0.12, de + 0.5, 0, 1);
	const topo = sans ? 205 : 255;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: topo, textAlign: 'center', opacity: Math.min(e * 1.5, 1 - s), transform: `translateX(${x}px)`, filter: `blur(${blur}px)`}}>
			<div style={{fontFamily: SERIF, fontSize: 112, lineHeight: 1, color: C.destaque, letterSpacing: '-0.01em'}}>{serif}</div>
			{sans && <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 96, lineHeight: 1.05, color: C.tinta, letterSpacing: '-0.035em'}}>{sans}</div>}
			<svg width={460} height={22} viewBox="0 0 460 22" style={{marginTop: 8}}>
				<path d="M6 14 C 120 6, 300 6, 454 11" stroke={C.destaque} strokeWidth={7} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - traco} />
			</svg>
		</div>
	);
};

/** o card do meio do palco (x 57 a 1023, y 453 a 1158) */
export const CardPalco: React.FC<{escuro?: boolean; children: React.ReactNode; de: number}> = ({escuro, children, de}) => {
	const {t} = useT();
	const e = mola(t, de, {damping: 18});
	return (
		<div
			style={{
				position: 'absolute',
				left: 57,
				top: 453,
				width: 966,
				height: 705,
				borderRadius: 18,
				background: escuro ? C.escuro : C.papel,
				boxShadow: SOMBRA,
				overflow: 'hidden',
				opacity: Math.min(1, e * 1.5),
				transform: `translateY(${(1 - e) * 60}px)`,
			}}
		>
			{children}
		</div>
	);
};

/** troca de conteúdo dentro do card: chicote com borrão (MODELO §5), entra da direita e sai pra esquerda */
export const Troca: React.FC<{de: number; ate: number; children: React.ReactNode; primeira?: boolean}> = ({de, ate, children, primeira}) => {
	const {t} = useT();
	if (t < de || t >= ate + 0.2) return null;
	const e = primeira ? 1 : tw(t, de, de + 0.24, 0, 1);
	const s = tw(t, ate, ate + 0.2, 0, 1, E.in);
	return (
		<div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - e) * 260 - s * 300}px)`, filter: `blur(${(1 - e) * 14 + s * 16}px)`, opacity: Math.min(e * 2, 1 - s)}}>{children}</div>
	);
};

/** o rosto num card embaixo, sangrando pra fora da base (M1) */
export const RostoPalco: React.FC = () => (
	<div style={{position: 'absolute', left: 109, top: 1330, width: 862, height: 640, borderRadius: 36, overflow: 'hidden', boxShadow: SOMBRA, background: '#000'}}>
		<FalaEm s={0.82} cx={431} oy={250} />
	</div>
);

/* ================================================================ o kit da tela livre (src/telas/ da pasta do vídeo)
 * As peças da casa para a interface que a fala nova pede e o aprovado não tem. Toda tela livre desenha dentro do <Palco>,
 * e cada movimento está preso a uma palavra dita (os instantes chegam do plano em `em`). A língua é a do modelo: creme com
 * grade, papel #FBF8F2 ou escuro #161616, terracota #D97757 de acento, Geist / Instrument Serif itálica / Geist Mono,
 * entrada com mola ou deslizando em ~8 quadros, troca no lugar com chicote (Troca). Nada de ícone genérico nem selo. */

/** dividido (M3): em cima o visual (até a DIVISA, y 858), embaixo o rosto no tamanho do aprovado */
const LARGURA_APROVADO = 398.6;
export const Dividido: React.FC<{children: React.ReactNode}> = ({children}) => (
	<>
		<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: DIVISA, overflow: 'hidden'}}>{children}</div>
		<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, clipPath: `inset(${DIVISA}px 0 0 0)`}}>
			<FalaEm s={LARGURA_APROVADO / R.largura} cx={540} oy={1170} />
		</div>
	</>
);

/** a zona segura de cada modo, onde a tela livre desenha (px no quadro 1080x1920, ou no card do palco):
 * palco = o card inteiro (966x705); dividido = a metade de cima (x 60-1020, y 60-800); motion = x 60-1020, y 150-1270
 * (com a legenda no topo, y 420-1500) */
export const ZONA_LIVRE = {
	palco: {x: 0, y: 0, w: 966, h: 705},
	dividido: {x: 60, y: 60, w: 960, h: 740},
	motion: {x: 60, y: 150, w: 960, h: 1120},
	motionTopo: {x: 60, y: 420, w: 960, h: 1080},
};
export const Palco: React.FC<{modo: 'palco' | 'dividido' | 'motion'; topo?: boolean; children: React.ReactNode}> = ({modo, topo, children}) => {
	const z = modo === 'motion' && topo ? ZONA_LIVRE.motionTopo : ZONA_LIVRE[modo];
	return <div style={{position: 'absolute', left: z.x, top: z.y, width: z.w, height: z.h}}>{children}</div>;
};

/** pasta e arquivo (ícones desenhados) */
export const Pasta: React.FC<{cor?: string; cheia?: number}> = ({cor = C.destaque, cheia = 1}) => (
	<svg width={36} height={30} viewBox="0 0 36 30" style={{flex: 'none'}}>
		<path d="M2 5 Q2 2 5 2 L13 2 L16 6 L31 6 Q34 6 34 9 L34 25 Q34 28 31 28 L5 28 Q2 28 2 25 Z" fill={cor} fillOpacity={0.18 + 0.72 * cheia} stroke={cor} strokeWidth={2.5} />
	</svg>
);
export const Arq: React.FC<{cor?: string}> = ({cor = '#9C958A'}) => (
	<svg width={36} height={30} viewBox="0 0 36 30" style={{flex: 'none'}}>
		<path d="M9 2 L22 2 L29 9 L29 28 L9 28 Z" fill="none" stroke={cor} strokeWidth={2.5} strokeLinejoin="round" />
		<path d="M22 2 L22 9 L29 9" fill="none" stroke={cor} strokeWidth={2.5} strokeLinejoin="round" />
	</svg>
);

/** entra com mola no instante `em` (sobe 60 px; salta: o pop de escala 0,6 para 1) */
export const Entra: React.FC<{em: number; x: number; y: number; w?: number; h?: number; salta?: boolean; children: React.ReactNode}> = ({em, x, y, w, h, salta, children}) => {
	const {t} = useT();
	if (t < em - 0.02) return null;
	const k = mola(t, em - 0.02, {damping: 18});
	const st: React.CSSProperties = salta ? pop(t, em - 0.02) : {opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 60}px)`};
	return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, ...st}}>{children}</div>;
};

/** janela de app (papel ou escura), barra com os três pontos e o nome em mono; o conteúdo vai embaixo da barra */
export const Janela: React.FC<{w: number; h: number; titulo?: string; escuro?: boolean; children?: React.ReactNode}> = ({w, h, titulo, escuro, children}) => (
	<div style={{position: 'relative', width: w, height: h, borderRadius: 26, background: escuro ? C.escuro : C.branco, boxShadow: SOMBRA, border: escuro ? '1px solid #2E2C2A' : '1px solid #E6E1D8', overflow: 'hidden'}}>
		<div style={{height: 70, borderBottom: escuro ? '1px solid #2E2C2A' : '1px solid #EEE9E1', display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 28}}>
			{['#FF5F57', '#FEBC2E', '#28C840'].map((k) => (
				<div key={k} style={{width: 18, height: 18, borderRadius: 9, background: k}} />
			))}
			{titulo ? <div style={{flex: 1, textAlign: 'center', marginRight: 120, fontFamily: MONO, fontSize: 22, color: C.suave}}>{titulo}</div> : null}
		</div>
		<div style={{position: 'absolute', left: 0, top: 70, width: w, height: h - 70}}>{children}</div>
	</div>
);

/** uma linha de lista em mono que desliza da esquerda no instante `em` (pasta, arquivo, item); `marca` acende a seleção */
export const Linha: React.FC<{em: number; y: number; x?: number; icone?: 'pasta' | 'arq' | null; marca?: number; children: React.ReactNode}> = ({em, y, x = 36, icone = null, marca, children}) => {
	const {t} = useT();
	if (t < em - 0.02) return null;
	const k = tw(t, em - 0.02, em + 0.2, 0, 1);
	const sel = marca !== undefined && t >= marca;
	return (
		<div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 18, padding: '12px 18px', borderRadius: 12, fontFamily: MONO, fontWeight: 500, fontSize: 32, color: sel ? C.branco : C.tinta, background: sel ? C.selecao : 'transparent', opacity: k, transform: `translateX(${(1 - k) * -50}px)`}}>
			{icone === 'pasta' ? <Pasta cor={sel ? C.branco : C.destaque} /> : icone === 'arq' ? <Arq /> : null}
			{children}
		</div>
	);
};

/** o ✓ verde que estala no instante `em` */
export const Check: React.FC<{em: number; size?: number}> = ({em, size = 40}) => {
	const {t} = useT();
	if (t < em) return null;
	return <div style={{width: size, height: size, borderRadius: size / 2, background: C.verde, color: C.branco, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 800, fontSize: size * 0.6, ...pop(t, em)}}>✓</div>;
};

/** texto que se digita letra a letra de `de` a `ate`, com o cursor piscando (campo de prompt, busca, comentário) */
export const Digita: React.FC<{texto: string; de: number; ate: number; mono?: boolean; size?: number; cor?: string}> = ({texto, de, ate, mono, size = 46, cor = C.tinta}) => {
	const {t} = useT();
	const n = Math.round(tw(t, de, ate, 0, texto.length, (x) => x));
	const pisca = t < ate + 0.6 && (t < ate || Math.floor(t * 2.2) % 2 === 0);
	return (
		<span style={{fontFamily: mono ? MONO : SANS, fontWeight: 500, fontSize: size, color: cor, whiteSpace: 'nowrap'}}>
			{texto.slice(0, n)}
			{t >= de - 0.2 && pisca ? <span style={{display: 'inline-block', width: 4, height: size * 1.05, background: C.tinta, marginLeft: 6, verticalAlign: '-0.15em'}} /> : null}
		</span>
	);
};

/** o botão de enviar: terracota com a seta, vira verde com o ✓ no instante `envia` */
export const Enviar: React.FC<{envia: number; size?: number}> = ({envia, size = 62}) => {
	const {t} = useT();
	const ok = t >= envia;
	return (
		<div style={{width: size, height: size, borderRadius: size / 2, background: ok ? C.verde : C.destaque, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${ok ? 0.9 + 0.1 * mola(t, envia) : 1})`}}>
			{ok ? (
				<span style={{color: C.branco, fontFamily: SANS, fontWeight: 800, fontSize: size * 0.5}}>✓</span>
			) : (
				<svg width={size * 0.48} height={size * 0.48} viewBox="0 0 24 24">
					<path d="M12 19V5M5 12l7-7 7 7" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			)}
		</div>
	);
};

/** o contador: pílula escura, o número em Geist 800 terracota claro subindo até EXATAMENTE o número dito (G10) */
export const Contador: React.FC<{em: number; valor: number; sufixo?: string; rotulo?: string; size?: number}> = ({em, valor, sufixo = '', rotulo, size = 120}) => {
	const {t} = useT();
	if (t < em) return null;
	const n = Math.round(tw(t, em, em + 0.75, 0, valor));
	return (
		<div style={{display: 'inline-flex', alignItems: 'baseline', gap: 18, background: C.escuro, borderRadius: 30, padding: '18px 34px', ...pop(t, em)}}>
			<span style={{fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: '-0.04em', color: C.destaqueClaro, lineHeight: 1}}>
				{n}
				{sufixo}
			</span>
			{rotulo ? <span style={{fontFamily: SANS, fontWeight: 700, fontSize: size * 0.32, color: C.branco}}>{rotulo}</span> : null}
		</div>
	);
};

/** o grifo: marca-texto terracota a 30% que se desenha da esquerda para a direita em 0,35 s, atrás do texto */
export const Grifo: React.FC<{em: number; children: React.ReactNode}> = ({em, children}) => {
	const {t} = useT();
	const k = tw(t, em, em + 0.35, 0, 1);
	return (
		<span style={{position: 'relative', display: 'inline-block'}}>
			<span style={{position: 'absolute', left: -6, right: -6, top: '18%', bottom: '8%', background: 'rgba(217,119,87,0.30)', borderRadius: 6, transformOrigin: '0 50%', transform: `scaleX(${k})`}} />
			<span style={{position: 'relative'}}>{children}</span>
		</span>
	);
};
