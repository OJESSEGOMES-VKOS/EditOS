// cena05 — Oscilloscope (Osciloscópio). Componente reutilizável (EditOS, cenas/estilos).
// Um traço só o tempo todo: seno que trava → Lissajous 2:3 girando → onda que amortece até a reta → as letras sobem da reta.
// Desenho em espaço 1080x1350 (4:5) centralizado; a tela preenche qualquer formato.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/ShareTechMono';

const {fontFamily: mono} = loadFont('normal', {weights: ['400'], subsets: ['latin']});

export type OscilloscopeProps = {
  palavra?: string; // maiúsculas; letras disponíveis abaixo (A-Z básicas)
  largura?: number;
  altura?: number;
  cores?: {tela: string; face: string; grade: string; brilho: string; nucleo: string};
};

const CORES = {tela: '#030805', face: '#09150E', grade: '#0D2216', brilho: '#46FF8C', nucleo: '#D7FFF3'};
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// letras monolinha: [largura, caminho] em unidades da altura de maiúscula (y para cima = negativo)
const LETRAS: Record<string, [number, string]> = {
  A: [0.64, 'M0 0 L.32 -1 L.64 0 M.12 -.38 L.52 -.38'],
  B: [0.56, 'M0 0 L0 -1 L.36 -1 C.6 -1 .6 -.53 .36 -.53 L0 -.53 M.36 -.53 C.64 -.53 .64 0 .36 0 L0 0'],
  C: [0.6, 'M.6 -.82 C.5 -1.02 .0 -1.05 0 -.5 C0 .05 .5 .02 .6 -.18'],
  D: [0.6, 'M0 0 L0 -1 L.25 -1 C.8 -1 .8 0 .25 0 Z'],
  E: [0.52, 'M.52 -1 L0 -1 L0 0 L.52 0 M0 -.52 L.42 -.52'],
  F: [0.5, 'M.5 -1 L0 -1 L0 0 M0 -.52 L.4 -.52'],
  G: [0.62, 'M.6 -.82 C.5 -1.02 0 -1.05 0 -.5 C0 .05 .62 .05 .62 -.42 L.36 -.42'],
  H: [0.58, 'M0 0 L0 -1 M.58 0 L.58 -1 M0 -.52 L.58 -.52'],
  I: [0, 'M0 0 L0 -1'],
  L: [0.46, 'M0 -1 L0 0 L.46 0'],
  M: [0.72, 'M0 0 L0 -1 L.36 -.4 L.72 -1 L.72 0'],
  N: [0.62, 'M0 0 L0 -1 L.62 0 L.62 -1'],
  O: [0.66, 'M.33 0 C-.11 0 -.11 -1 .33 -1 C.77 -1 .77 0 .33 0'],
  P: [0.54, 'M0 0 L0 -1 L.32 -1 C.62 -1 .62 -.48 .32 -.48 L0 -.48'],
  R: [0.56, 'M0 0 L0 -1 L.32 -1 C.62 -1 .62 -.48 .32 -.48 L0 -.48 M.28 -.48 L.56 0'],
  S: [0.58, 'M.56 -.84 C.48 -1.02 .04 -1.03 .04 -.76 C.04 -.5 .58 -.52 .58 -.24 C.58 .04 .08 .04 0 -.17'],
  T: [0.62, 'M0 -1 L.62 -1 M.31 -1 L.31 0'],
  U: [0.58, 'M0 -1 L0 -.35 C0 .1 .58 .1 .58 -.35 L.58 -1'],
  V: [0.62, 'M0 -1 L.31 0 L.62 -1'],
  Y: [0.62, 'M0 -1 L.31 -.48 L.62 -1 M.31 -.48 L.31 0'],
  ' ': [0.2, ''],
};

const N = 520;

export const Oscilloscope: React.FC<OscilloscopeProps> = ({palavra = 'SINTONIA', largura, altura, cores = CORES}) => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const W = largura ?? width;
  const H = altura ?? height;
  const s = Math.min(W / 1080, H / 1350);
  const cy = 745;

  const curva = (t: number): string => {
    // pesos de forma
    const aLiss = interpolate(t, [14, 24], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
    const aSolta = interpolate(t, [48, 56], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
    const fase = t < 12 ? t * 0.55 - 0.02 * t * t : 12 * 0.55 - 0.02 * 144; // rola e trava
    const giro = 0.9 - t * 0.012;
    const tau = Math.max(0, t - 54);
    const amort = Math.exp(-tau / 6) * Math.cos(tau * 0.42);
    const pts: string[] = [];
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      // seno rolando
      const xs = -80 + u * 1240;
      const ys = cy - 180 * Math.sin(2 * Math.PI * (3.2 * u) - fase);
      // Lissajous 2:3
      const xl = 540 + 290 * Math.sin(2 * Math.PI * 2 * u + giro);
      const yl = cy - 290 * Math.sin(2 * Math.PI * 3 * u);
      // onda que amortece (passa pelo zero uma vez)
      const yd = cy - 200 * amort * Math.sin(2 * Math.PI * 3 * u) * Math.sin(Math.PI * u);
      let x = xs + (xl - xs) * aLiss;
      let y = ys + (yl - ys) * aLiss;
      x = x + (xs - x) * aSolta;
      y = y + (yd - y) * aSolta;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return 'M' + pts.join(' L');
  };

  // letras
  const capH = 150;
  const gap = 0.32 * capH;
  const letras = Array.from(palavra).map((c) => LETRAS[c] ?? LETRAS[' ']);
  const total = letras.reduce((a, [w]) => a + w * capH, 0) + gap * (letras.length - 1);
  let xx = 540 - total / 2;
  const pos = letras.map(([w]) => {
    const p = xx;
    xx += w * capH + gap;
    return p;
  });
  const tLetra = 76;
  const escLetra = (i: number, t: number) => (t < tLetra + i * 3 ? 0 : spring({frame: t - tLetra - i * 3, fps, config: {damping: 9, stiffness: 150}}));

  const mostraCurva = (t: number) => t < 74;
  const camada = (t: number, alfa: number, k: string) => (
    <g key={k} opacity={alfa}>
      {mostraCurva(t) ? <path d={curva(t)} /> : <path d={`M-80 ${cy} L1160 ${cy}`} />}
      {t >= 70 && letras.map(([, d], i) => (
        <path key={i} d={d} transform={`translate(${pos[i]} ${cy}) scale(${capH} ${capH * escLetra(i, t)})`} vectorEffect="non-scaling-stroke" />
      ))}
    </g>
  );

  // ponto do feixe
  const uFeixe = (f * 0.023) % 1;
  const feixeVis = f < 50;

  const dphi = Math.max(0, interpolate(f, [18, 70], [46.7, 0], cl));
  const leitura = f < 16 ? 'Y-T   5 ms/div' : `X-Y   Δφ ${dphi.toFixed(1).replace('.', ',')}°`;
  const trava = f > 96;

  return (
    <AbsoluteFill style={{backgroundColor: cores.tela, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 52%, ${cores.face} 0%, ${cores.tela} 75%)`}} />
      <div style={{position: 'absolute', left: (W - 1080 * s) / 2, top: (H - 1350 * s) / 2, width: 1080, height: 1350, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <svg width={1080} height={1350} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <defs>
            <radialGradient id="mg05" cx="50%" cy="55%" r="60%"><stop offset="0.45" stopColor="#fff" /><stop offset="1" stopColor="#000" /></radialGradient>
            <mask id="m05"><rect x={-500} y={-500} width={2080} height={2350} fill="url(#mg05)" /></mask>
            <filter id="halo05" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7" /></filter>
            <filter id="meio05" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6" /></filter>
          </defs>
          {/* graticule que some nas bordas */}
          <g mask="url(#m05)" stroke={cores.grade} strokeWidth={2} opacity={0.6}>
            {Array.from({length: 15}, (_, i) => <line key={`v${i}`} x1={540 + (i - 7) * 112} y1={-100} x2={540 + (i - 7) * 112} y2={1450} />)}
            {Array.from({length: 17}, (_, i) => <line key={`h${i}`} x1={-100} y1={cy + (i - 8) * 112} x2={1180} y2={cy + (i - 8) * 112} />)}
            {Array.from({length: 60}, (_, i) => <line key={`tx${i}`} x1={540 + (i - 30) * 22.4} y1={cy - 7} x2={540 + (i - 30) * 22.4} y2={cy + 7} stroke="#13331f" />)}
            {Array.from({length: 70}, (_, i) => <line key={`ty${i}`} x1={533} y1={cy + (i - 35) * 22.4} x2={547} y2={cy + (i - 35) * 22.4} stroke="#13331f" />)}
          </g>
          {/* persistência: os últimos quadros atrás do traço */}
          <g fill="none" stroke={cores.brilho} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round">
            {[5, 4, 3, 2, 1].map((k) => camada(f - k * 1.5, 0.08 + (5 - k) * 0.05, `p${k}`))}
          </g>
          {/* halo, meio e núcleo do traço */}
          <g fill="none" stroke={cores.brilho} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" filter="url(#halo05)" opacity={0.55}>{camada(f, 1, 'h')}</g>
          <g fill="none" stroke={cores.brilho} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" filter="url(#meio05)" opacity={0.9}>{camada(f, 1, 'm')}</g>
          <g fill="none" stroke={cores.nucleo} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round">{camada(f, 1, 'c')}</g>
          {feixeVis && (() => {
            const d = curva(f).slice(1).split(' L');
            const [bx, by] = d[Math.floor(uFeixe * N)].split(',').map(Number);
            return <circle cx={bx} cy={by} r={8} fill={cores.nucleo} style={{filter: `drop-shadow(0 0 8px ${cores.brilho})`}} />;
          })()}
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1180, textAlign: 'center', fontFamily: mono, fontSize: 22, letterSpacing: '0.12em', color: cores.brilho, opacity: 0.45, whiteSpace: 'pre'}}>
          {leitura}   <span style={{opacity: trava ? 1 : 0.5, color: trava ? cores.nucleo : cores.brilho}}>TRAVA</span>
        </div>
      </div>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.06, mixBlendMode: 'screen'}}>
        <filter id="g05"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed={f % 20} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width={W} height={H} filter="url(#g05)" />
      </svg>
    </AbsoluteFill>
  );
};
