import type React from 'react';
import {Easing, interpolate, spring} from 'remotion';
import {loadFont as loadPoppins} from '@remotion/google-fonts/Poppins';
import {loadFont as loadSerif} from '@remotion/google-fonts/DMSerifDisplay';
import {loadFont as loadScript} from '@remotion/google-fonts/GreatVibes';

/**
 * A identidade do autoridade (modelos/autoridade/autoridade.md §1, §4): as fontes, a cor de destaque e o movimento.
 * Vale para a casa (src/Reel.tsx), para o kit (src/ui.tsx) e para as telas novas do vídeo (src/telas/).
 */
export const FPS = 30;
const pop = loadPoppins('normal', {weights: ['500', '600', '800'], subsets: ['latin']});
const serif = loadSerif('normal', {weights: ['400'], subsets: ['latin']});
const script = loadScript('normal', {weights: ['400'], subsets: ['latin']});
export const SANS = pop.fontFamily;
export const SERIF = serif.fontFamily;
export const SCRIPT = script.fontFamily;

/* mundo de cor (autoridade.md §1 e §7): UMA cor de destaque tirada do cenário da gravação. Na vitrine, a parede
   bege/taupe vira um caramelo. Vídeo novo: troque os tons pelos da cor do cenário dele (destaque, escuro, clara) */
export const C = {
	escuro: '#16110D',
	escuro2: '#3B2D22',
	cor: '#8F5F33',
	cor2: '#B27C48',
	fundoCor: '#6A4422',
	clara: '#EBCB9F',
	creme: '#F4EFE6',
	tinta: '#1F160F',
};
export const E = {out: Easing.bezier(0.22, 1, 0.36, 1), io: Easing.bezier(0.45, 0, 0.55, 1)};
export const tw = (t: number, a: number, b: number, v0: number, v1: number, e = E.out) =>
	interpolate(t, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
export const mola = (t: number, de: number, d = 18) => (t < de ? 0 : spring({frame: (t - de) * FPS, fps: FPS, config: {damping: d, stiffness: 120, mass: 0.8}}));
/** a entrada padrão de um objeto: aparece e cresce de 80% a 100% (k = mola) */
export const entra = (k: number): React.CSSProperties => ({opacity: Math.min(1, k * 2), transform: `scale(${0.8 + 0.2 * k})`});
/** a entrada da palavra: do desfoque de 4 px, deslizando 10 px, em 0,4 s */
export const suave = (t: number, d: number, dur = 0.4): React.CSSProperties => {
	const e = tw(t, d - 0.06, d - 0.06 + dur, 0, 1);
	return {opacity: e, filter: `blur(${(1 - e) * 4}px)`, transform: `translateY(${(1 - e) * 10}px)`};
};
