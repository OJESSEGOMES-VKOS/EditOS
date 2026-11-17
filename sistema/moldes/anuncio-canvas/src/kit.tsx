// O kit da tela nova do anuncio-canvas (a peça que a fala pede e a casa não tem). Toda tela de src/telas/ desenha só
// com o que está aqui: as cores da paleta C (src/tema.ts, a marca de quem anuncia), a Sora, a entrada da casa (mola com
// desfoque), o vidro, a pílula, o risco, o marca-texto, o glitch e o tempo da fala (w, wf). Regras: a skill
// .claude/skills/anuncio-canvas/SKILL.md e modelos/anuncio-canvas/anuncio-canvas.md §4.
import React from 'react';
import {C, E, SANS, mola, rnd, tw, useT} from './tema';
import {BRILHO_TEXTO, Celular, brilho} from './ui';

export {C, E, FPS, MAO, P, SANS, existe, mola, pare, rnd, seq, tw, useT, w, wf} from './tema';
export {BRILHO_TEXTO, Bolha, Celular, G, Glitch, IconeVidro, ImgOuTela, Linha, MarcaTexto, Notif, Pal, Pilula, Risco, TelaGenerica, Wordmark, ab, brilho, brilhoCaixa, hexA} from './ui';

/** a entrada da casa: mola (amortecimento 15, rigidez 150), escala 0,7 → 1, opacidade e desfoque de 22 px que some */
export const frente = (t: number, de: number, cfg = {}) => {
	const k = mola(t, de, {damping: 15, stiffness: 150, ...cfg});
	return {opacity: Math.min(1, k * 2), transform: `scale(${0.7 + 0.3 * k})`, filter: k < 0.7 ? `blur(${(0.7 - k) * 22}px)` : undefined} as React.CSSProperties;
};

/** o palco da peça nova: entra com a entrada da casa na palavra `de` e cabe numa caixa de até 880 x 1000 px (a peça
 *  mora em volta do keyframe da frase; maior que isso ela cobre a frase e sai da zona segura). Desenhe dentro dele. */
export const Palco: React.FC<{de: number; larg?: number; alt?: number; children: React.ReactNode}> = ({de, larg = 700, alt = 500, children}) => {
	const {t} = useT();
	if (larg > 880 || alt > 1000) throw new Error(`[anuncio-canvas] Palco de ${larg}x${alt}: no máximo 880 x 1000 px (a peça cobriria a frase).`);
	return <div style={{position: 'relative', width: larg, height: alt, ...frente(t, de)}}>{children}</div>;
};

/** celular inclinado que sobe com mola e balança devagar (a tela é o print real de quem anuncia, ou a genérica) */
export const Fone: React.FC<{src: string; larg: number; de: number; giro?: number}> = ({src, larg, de, giro = -18}) => {
	const {t} = useT();
	const k = mola(t, de, {damping: 18, stiffness: 80, mass: 1});
	return (
		<div style={{perspective: 2200}}>
			<div style={{transform: `translateY(${(1 - k) * 260}px) rotateX(${8 - 4 * k}deg) rotateY(${giro + 8 * k + Math.sin(t * 0.7) * 3}deg)`, opacity: Math.min(1, k * 2)}}>
				<Celular src={src} larg={larg} />
			</div>
		</div>
	);
};

/** neon colorido que pisca ao acender: um por item dito (o público, a categoria), cada um num ponto do canvas */
export const Neon: React.FC<{de: number; cor: string; ic: (s: number, c: string) => React.ReactNode; txt: string; sub?: string}> = ({de, cor, ic, txt, sub}) => {
	const {t} = useT();
	const p = t - (de - 0.06);
	const flick = p < 0.22 ? (rnd(Math.floor(p * 60)) > 0.45 ? 1 : 0.25) : 1;
	return (
		<div style={{...frente(t, de - 0.06), display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: t < de - 0.06 ? 0 : flick}}>
			<div style={{filter: `drop-shadow(0 0 14px ${cor}) drop-shadow(0 0 36px ${cor})`}}>{ic(180, cor)}</div>
			{sub && <div style={{fontFamily: SANS, fontWeight: 400, fontSize: 52, color: '#fff', textShadow: brilho(cor, 0.5)}}>{sub}</div>}
			<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 120, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1, ...(BRILHO_TEXTO ? {textShadow: `0 0 10px ${cor}, 0 0 30px ${cor}, 0 0 70px ${cor}`, WebkitTextStroke: `3px ${cor}`} : {})}}>{txt}</div>
		</div>
	);
};

/** cartão de vidro escuro com borda clara (a base de toda peça-objeto nova: cartão, painel, estante) */
export const Cartao: React.FC<{larg: number; alt: number; claro?: boolean; acento?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({larg, alt, claro, acento = 0, style, children}) => (
	<div
		style={{
			position: 'relative',
			width: larg,
			height: alt,
			borderRadius: Math.min(44, alt * 0.22),
			background: claro ? '#fff' : 'linear-gradient(160deg, #26212F, #15121C)',
			border: claro ? '2px solid #ECE8F3' : '2px solid rgba(255,255,255,0.1)',
			boxShadow: claro ? '0 30px 80px rgba(20,20,40,0.16)' : `0 30px 70px rgba(0,0,0,0.5), 0 0 ${70 * acento}px ${C.v}`,
			overflow: 'hidden',
			...style,
		}}
	>
		{children}
	</div>
);

/** a peça já nasceu? (para trocar de estado numa palavra: apaga, acende, ganha check) */
export const passou = (t: number, de: number, dur = 0.3) => tw(t, de, de + dur, 0, 1, E.inOut);
