// O kit da tela nova do motion-ouro (Ouro na Noite): as peças da casa para desenhar, no jeito do modelo, a tela que a
// fala nova pede e o aprovado não tem. Uma tela nova mora em src/telas/<Nome>.tsx da pasta do vídeo, é registrada em
// src/telas/index.ts e entra no plano (scripts/plano.py) como livre(comp='<Nome>', ...). O texto não é da tela: ele vem
// dos blocos do plano, embaixo do objeto (1ª linha em y 1210). O objeto mora no Palco (y 250 a 1050).
import React from 'react';
import {COR, DefsSvg, E, FILTRO_NEON, Fachos, H, Nevoa, Poeira, W, clamp, tw} from './base';

export {COR, E, FILTRO_NEON, HALO_OURO, HALO_TEXTO, INTER, W, H, Estrela, Fachos, Nevoa, Poeira, Seta, clamp, ini, marca, surge, talvez, tw} from './base';
export {AnelNeon, Cartao, Celular, Cursor, Icone, Ladrilho, Notebook, Pasta, Roleta} from './objetos';

/** o que toda tela nova recebe: o quadro global f e a cena do plano (de_q, ate_q) */
export type TelaNova = React.FC<{f: number; c: {id: string; de_q: number; ate_q: number}}>;

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** a câmera que nunca para: aproxima (s), gira de leve (r), desloca (x, y) e borra (blur) a partir de (ox, oy) */
export const Camera: React.FC<{s?: number; x?: number; y?: number; r?: number; ox?: number; oy?: number; blur?: number; children: React.ReactNode}> = ({s = 1, x = 0, y = 0, r = 0, ox = 540, oy = 960, blur = 0, children}) => (
	<div style={{position: 'absolute', inset: 0, transformOrigin: `${ox}px ${oy}px`, transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined}}>{children}</div>
);

/** svg do quadro inteiro (1080x1920) com os filtros da casa (#halo, #haloLargo, #lapis) */
export const Svg: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
	<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, overflow: 'visible', ...style}}>
		<DefsSvg />
		{children}
	</svg>
);

/** o fundo da casa: preto com névoa quente, fachos e poeira dourada, a câmera aproximando de leve do começo ao fim da cena */
export const Fundo: React.FC<{f: number; c: {id: string; de_q: number; ate_q: number}; fachos?: 'esq' | 'dir' | false; nevoa?: [number, number]}> = ({f, c, fachos = 'esq', nevoa = [14, 82]}) => {
	const p = (f - c.de_q) / Math.max(1, c.ate_q - c.de_q);
	return (
		<div style={{position: 'absolute', inset: 0, background: COR.fundo}}>
			<Camera s={1 + 0.04 * p} r={(f - c.de_q) * 0.015}>
				<Nevoa x={nevoa[0]} y={nevoa[1]} r={70} cor="rgba(244,137,7,0.42)" />
				<Nevoa x={80} y={22} r={55} cor="rgba(176,100,25,0.25)" />
				{fachos && <Fachos f={f} lado={fachos} o={0.85} />}
				<Poeira f={f} seed={c.id} n={60} estrelas={14} />
			</Camera>
		</div>
	);
};

/** a zona do objeto (y 250 a 1050, o lugar padrão do motion-ouro): dentro dele, (0, 0) é o canto de cima e o centro é
 * (540, 400). O objeto cresce um pouco do começo ao fim da cena e flutua de leve: nada fica parado. */
export const Palco: React.FC<{f: number; c: {de_q: number; ate_q: number}; children: React.ReactNode}> = ({f, c, children}) => {
	const p = (f - c.de_q) / Math.max(1, c.ate_q - c.de_q);
	return (
		<div style={{position: 'absolute', left: 0, top: 250, width: W, height: 800, transformOrigin: '540px 400px', transform: `scale(${1 + 0.05 * p}) translateY(${Math.sin(f * 0.05) * 6}px)`}}>
			<svg width={W} height={800} viewBox={`0 0 ${W} 800`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<DefsSvg />
			</svg>
			{children}
		</div>
	);
};

/** um objeto que entra do desfoque para o foco com escala (a entrada da casa), no quadro n */
export const Entra: React.FC<{f: number; n: number; dur?: number; de?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({f, n, dur = 9, de = 0.6, children, style}) => {
	if (f < n) return null;
	const k = tw(f, n, n + dur, 0, 1, E.back);
	const o = tw(f, n, n + dur * 0.6, 0, 1, E.out);
	return <div style={{position: 'absolute', inset: 0, opacity: clamp(o), transform: `scale(${de + (1 - de) * k})`, filter: o < 1 ? `blur(${(1 - o) * 14}px)` : undefined, ...style}}>{children}</div>;
};

/** traço neon da casa num caminho qualquer (núcleo quase branco + halo colorido), desenhado de 0 a 1 em `p` */
export const TracoNeon: React.FC<{d: string; p?: number; cor?: string; larg?: number; o?: number}> = ({d, p = 1, cor = COR.ouro, larg = 3, o = 1}) => (
	<g opacity={o}>
		<path d={d} fill="none" stroke={cor} strokeWidth={larg * 6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} filter="url(#halo)" opacity={0.8} />
		<path d={d} fill="none" stroke={cor} strokeWidth={larg * 2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={0.9} />
		<path d={d} fill="none" stroke={COR.nucleo} strokeWidth={larg} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
	</g>
);

/** pulso que decai depois do quadro n (para "acender" na palavra) */
export const pulso = (f: number, n: number, meia = 6) => (f >= n ? Math.exp(-(f - n) / meia) : 0);

export const neon = FILTRO_NEON;
