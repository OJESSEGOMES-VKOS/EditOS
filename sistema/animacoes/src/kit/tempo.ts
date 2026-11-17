// O tempo do vídeo. Tudo nas animações é medido em SEGUNDOS, nunca em quadros:
// a cena recebe `t` (segundos desde que ela começou) e decide o que mostrar.
import {Easing, interpolate} from 'remotion';

export const FPS = 30;

export const FORMATOS = {
  vertical: {largura: 1080, altura: 1920}, // Reels, Shorts, TikTok
  horizontal: {largura: 1920, altura: 1080}, // YouTube
  quadrado: {largura: 1080, altura: 1080}, // feed
} as const;
export type Formato = keyof typeof FORMATOS;

export const suave = Easing.bezier(0.45, 0, 0.25, 1); // entra e sai devagar
export const chega = Easing.out(Easing.cubic); // chega freando
export const sai = Easing.in(Easing.cubic); // sai acelerando
export const elastico = Easing.out(Easing.back(1.6)); // passa um pouco e volta

const preso = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Vai de 0 a 1 entre os segundos `a` e `b`. Antes de `a` é 0, depois de `b` é 1. */
export const ramp = (t: number, a: number, b: number, curva: (n: number) => number = suave) =>
  interpolate(t, [a, b], [0, 1], {...preso, easing: curva});

/** Sobe de 0 a 1 em `entra` segundos, fica, e desce a 0 nos últimos `some` segundos antes de `fim`. */
export const janela = (t: number, ini: number, fim: number, entra = 0.3, some = 0.3) =>
  Math.min(ramp(t, ini, ini + entra), 1 - ramp(t, fim - some, fim));

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** Passa por uma lista de [segundo, valor], com curva suave entre eles. */
export const chaves = (t: number, pontos: [number, number][], curva: (n: number) => number = suave) =>
  interpolate(
    t,
    pontos.map((p) => p[0]),
    pontos.map((p) => p[1]),
    {...preso, easing: curva}
  );

/** Número "ao acaso" que é sempre o mesmo pra mesma semente (entre 0 e 1). Nunca use Math.random num vídeo. */
export const acaso = (semente: number | string) => {
  let h = 2166136261;
  const s = String(semente);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967295;
};

/** Balanço contínuo e orgânico entre -1 e 1 (pra respiração, vento, mão tremendo). */
export const balanco = (t: number, velocidade = 1, semente = 0) =>
  Math.sin(t * velocidade * 2.1 + semente * 12.9) * 0.6 + Math.sin(t * velocidade * 3.7 + semente * 4.1) * 0.4;
