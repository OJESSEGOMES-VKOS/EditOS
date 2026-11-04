// cena13 — Ink Wash (Aguada de nanquim). Pintura procedural em SVG, redesenhada a partir do quadro.
// A tinta espalha com borda (nunca dissolve). Palco base 1080x1350, recomposto em qualquer formato.
import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont as loadSC} from '@remotion/google-fonts/CormorantSC';
import {loadFont as loadGar} from '@remotion/google-fonts/CormorantGaramond';

const {fontFamily: SC} = loadSC('normal', {weights: ['500', '600'], subsets: ['latin']});
const {fontFamily: GAR} = loadGar('italic', {weights: ['500'], subsets: ['latin']});

export type Cena13Props = {
  width?: number;
  height?: number;
  titulo?: [string, string]; // duas colunas verticais
  frase?: string;
  capitulo?: string;
  papel?: string;
  tinta?: string;
  vermelho?: string;
};

const rnd = (s: number) => {
  let x = Math.sin(s * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

// cume com picos agudos, de 0 a 1080
const cume = (base: number, amp: number, seed: number, picos: number[]) => {
  const pts: [number, number][] = [];
  for (let x = -20; x <= 1100; x += 6) {
    let y = base + Math.sin(x / 70 + seed) * amp * 0.25 + Math.sin(x / 23 + seed * 2) * amp * 0.08 + (rnd(x + seed) - 0.5) * 3 - Math.abs(Math.sin(x / 19 + seed * 3)) ** 6 * amp * 0.32 - Math.abs(Math.sin(x / 47 + seed)) ** 10 * amp * 0.45;
    for (const p of picos) y -= Math.max(0, 1 - Math.abs(x - p) / (amp * 0.9)) ** 1.6 * amp;
    pts.push([x, y]);
  }
  return pts;
};

const ease = (f: number, a: number, b: number, e = Easing.out(Easing.cubic)) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

export const Cena13: React.FC<Cena13Props> = ({
  width = 1080,
  height = 1350,
  titulo = ['O RIO', 'NÃO TEM NOME'],
  frase = 'Três dias rio abaixo.',
  capitulo = 'Dia 01 · Capítulo um',
  papel = '#EEEAE0',
  tinta = '#1B1A18',
  vermelho = '#B8352A',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = Math.min(width / 1080, height / 1350);

  const cordilheiras = useMemo(
    () => [
      {pts: cume(600, 120, 1, [180, 420, 520, 700, 980]), op: 0.2, nevoa: 120, ini: -6, dur: 30},
      {pts: cume(690, 95, 4, [60, 300, 650, 860]), op: 0.3, nevoa: 110, ini: 4, dur: 32},
      {pts: cume(770, 70, 7, [140, 380, 560, 760]), op: 0.42, nevoa: 100, ini: 14, dur: 34},
    ],
    [],
  );
  const riscosPenhasco = useMemo(
    () => Array.from({length: 70}, (_, i) => {
      const x = 845 + rnd(i * 3.1) * 240;
      const yTop = 700 + Math.max(0, (900 - x)) * 0.5 + rnd(i * 7.7) * 60;
      const len = 120 + rnd(i * 1.3) * 300;
      return {x, y: yTop, len, w: 1 + rnd(i * 5.5) * 3, ord: rnd(i * 2.2)};
    }),
    [],
  );
  const agulhas = useMemo(
    () => [[800, 662], [850, 650], [905, 640], [940, 668], [830, 690]].flatMap(([cx, cy], g) =>
      Array.from({length: 14}, (_, i) => ({cx, cy, a: -170 + (i / 13) * 160 + rnd(g * 31 + i) * 10, l: 26 + rnd(g * 13 + i) * 22, g})),
    ),
    [],
  );

  const frente = (ini: number, dur: number) => interpolate(frame, [ini, ini + dur], [-80, 1180], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  const caminho = (pts: [number, number][], fundo: number) => `M${pts[0][0]},${fundo} ` + pts.map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + ` L${pts[pts.length - 1][0]},${fundo} Z`;
  const linhaCume = (pts: [number, number][]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

  // sol: nasce do centro com borda molhada, passa ~10% e assenta
  const sol = spring({frame: frame - 12, fps, config: {damping: 9, stiffness: 70, mass: 1}});
  // penhasco: contorno, depois lavagem de cima para baixo, depois riscos
  const contorno = ease(frame, 30, 44);
  const lavaPenhasco = interpolate(frame, [36, 70], [640, 1360], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  const tronco = ease(frame, 60, 70);
  const galho = ease(frame, 66, 76);
  const barco = ease(frame, 38, 50);
  // texto pincelado em ordem de leitura, selo carimbado por último
  const col1 = ease(frame, 48, 66, Easing.inOut(Easing.quad));
  const col2 = ease(frame, 58, 80, Easing.inOut(Easing.quad));
  const fr = ease(frame, 74, 92, Easing.inOut(Easing.quad));
  const cap = ease(frame, 84, 100, Easing.inOut(Easing.quad));
  const selo = spring({frame: frame - 100, fps, config: {damping: 10, stiffness: 260, mass: 0.6}});
  const deriva = frame * 0.25;

  return (
    <AbsoluteFill style={{background: papel, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: (width - 1080 * k) / 2, top: (height - 1350 * k) / 2, width: 1080, height: 1350, transform: `scale(${k})`, transformOrigin: '0 0'}}>
        <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
          <defs>
            <filter id="as13borda" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={3} seed={3} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale={70} />
            </filter>
            <filter id="as13seco">
              <feTurbulence type="fractalNoise" baseFrequency="0.9 0.05" numOctaves={2} seed={5} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale={5} />
            </filter>
            <filter id="as13sol">
              <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves={3} seed={8} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale={9} result="d" />
              <feGaussianBlur in="d" stdDeviation={1.4} />
            </filter>
            <filter id="as13nevoa"><feGaussianBlur stdDeviation={18} /></filter>
            {cordilheiras.map((c, i) => {
              const topo = Math.min(...c.pts.map((p) => p[1]));
              const fundo = Math.max(...c.pts.map((p) => p[1])) + c.nevoa;
              return (
                <linearGradient key={i} id={`as13g${i}`} gradientUnits="userSpaceOnUse" x1="0" y1={topo} x2="0" y2={fundo}>
                  <stop offset="0" stopColor={tinta} stopOpacity={c.op} />
                  <stop offset="0.55" stopColor={tinta} stopOpacity={c.op * 0.55} />
                  <stop offset="1" stopColor={tinta} stopOpacity={0} />
                </linearGradient>
              );
            })}
            {cordilheiras.map((c, i) => {
              const f = frente(c.ini, c.dur);
              return (
                <React.Fragment key={i}>
                  <mask id={`as13m${i}`}><rect x={-100} y={0} width={f + 100} height={1350} fill="#fff" filter="url(#as13borda)" /></mask>
                  <mask id={`as13w${i}`}><rect x={f - 90} y={0} width={90} height={1350} fill="#fff" filter="url(#as13borda)" /></mask>
                </React.Fragment>
              );
            })}
            <mask id="as13mp"><rect x={700} y={0} width={500} height={lavaPenhasco} fill="#fff" filter="url(#as13borda)" /></mask>
            <linearGradient id="as13gp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={tinta} stopOpacity={0.55} />
              <stop offset="0.6" stopColor={tinta} stopOpacity={0.25} />
              <stop offset="1" stopColor={tinta} stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* sol atrás dos picos distantes */}
          {sol > 0.01 && <circle cx={610} cy={472} r={74 * sol} fill={vermelho} opacity={0.9} filter="url(#as13sol)" />}
          {/* aves */}
          {frame > 26 && [[520, 405], [548, 418], [500, 425]].map(([x, y], i) => <path key={i} d={`M${x - 9},${y - 4} Q${x - 3},${y - 2} ${x},${y + 2} Q${x + 3},${y - 2} ${x + 9},${y - 4}`} stroke={tinta} strokeWidth={1.6} fill="none" opacity={ease(frame, 26 + i * 3, 32 + i * 3)} />)}
          {/* cordilheiras: lavagem atrás de uma frente irregular, faixa molhada mais escura, cume em pincel seco */}
          {cordilheiras.map((c, i) => {
            const fundo = Math.max(...c.pts.map((p) => p[1])) + c.nevoa;
            return (
              <g key={i}>
                <path d={caminho(c.pts, fundo)} fill={`url(#as13g${i})`} mask={`url(#as13m${i})`} />
                <path d={caminho(c.pts, fundo)} fill={tinta} opacity={0.12} mask={`url(#as13w${i})`} />
                <path d={linhaCume(c.pts)} stroke={tinta} strokeOpacity={c.op + 0.15} strokeWidth={1.6} fill="none" filter="url(#as13seco)" mask={`url(#as13m${i})`} />
                <rect x={-40} y={fundo - c.nevoa * 0.55 + Math.sin(frame / 30 + i) * 3} width={1160} height={c.nevoa * 0.6} fill={papel} opacity={0.55} filter="url(#as13nevoa)" transform={`translate(${(i % 2 ? -1 : 1) * deriva},0)`} />
              </g>
            );
          })}
          {/* penhasco */}
          <g mask="url(#as13mp)">
            <path d="M880 690 C 860 720, 840 760, 832 820 C 826 900, 840 1000, 830 1250 L1100 1250 L1100 640 C 1040 650, 960 660, 880 690 Z" fill="url(#as13gp)" filter="url(#as13seco)" />
          </g>
          <path d="M1100 640 C 1040 650, 960 660, 880 690 C 860 720, 840 760, 832 820 C 826 900, 840 1000, 834 1180" stroke={tinta} strokeWidth={3.2} fill="none" pathLength={1} strokeDasharray={`${contorno} 1`} filter="url(#as13seco)" opacity={contorno > 0 ? 0.9 : 0} />
          {riscosPenhasco.map((r, i) => {
            const q = 46 + r.ord * 24;
            const g = ease(frame, q, q + 6);
            if (g <= 0) return null;
            return <path key={i} d={`M${r.x},${r.y} l${-r.len * 0.12},${r.len}`} stroke={tinta} strokeWidth={r.w} strokeOpacity={0.55} pathLength={1} strokeDasharray={`${g} 1`} filter="url(#as13seco)" />;
          })}
          {/* pinheiro: tronco, galho e agulhas saindo de cada tufo */}
          <path d="M935 700 C 925 680, 905 668, 880 662" stroke={tinta} strokeWidth={6} fill="none" pathLength={1} strokeDasharray={`${tronco} 1`} opacity={tronco > 0 ? 1 : 0} />
          <path d="M880 662 C 860 660, 830 664, 790 668" stroke={tinta} strokeWidth={3.5} fill="none" pathLength={1} strokeDasharray={`${galho} 1`} opacity={galho > 0 ? 1 : 0} />
          {agulhas.map((a, i) => {
            const g = ease(frame, 72 + a.g * 3 + (i % 14) * 0.4, 78 + a.g * 3 + (i % 14) * 0.4);
            if (g <= 0) return null;
            const rad = (a.a * Math.PI) / 180;
            return <line key={i} x1={a.cx} y1={a.cy} x2={a.cx + Math.cos(rad) * a.l * g} y2={a.cy + Math.sin(rad) * a.l * 0.35 * g} stroke={tinta} strokeWidth={2} />;
          })}
          {/* figura minúscula com faixa vermelha */}
          {frame > 64 && (
            <g transform="translate(902,712)" opacity={1}>
              <path d="M0 -26 L0 0 M-6 0 L6 0" stroke={tinta} strokeWidth={4} />
              <circle cx={0} cy={-30} r={4} fill={tinta} />
              <rect x={-3} y={-14} width={6} height={3} fill={vermelho} />
            </g>
          )}
          {/* rio de riscos finos e quebrados */}
          {Array.from({length: 22}, (_, i) => {
            const y = 1020 + i * 13 + (i % 3) * 3;
            const x = rnd(i * 9) * 720 + ((i % 2 ? 1 : -1) * deriva) / 2;
            const g = ease(frame, 30 + i * 1.5, 40 + i * 1.5);
            return <line key={i} x1={x} y1={y} x2={x + (60 + rnd(i * 4) * 180) * g} y2={y} stroke={tinta} strokeOpacity={0.5} strokeWidth={1.5} strokeLinecap="round" />;
          })}
          {/* barco */}
          <g transform={`translate(${410 + deriva * 0.6},1100)`} opacity={barco > 0 ? 1 : 0}>
            <path d="M-46 0 Q0 16 46 0" stroke={tinta} strokeWidth={6} fill="none" pathLength={1} strokeDasharray={`${barco} 1`} />
            <path d="M-4 -2 L-4 -26 M-12 -18 L-4 -28 L4 -18" stroke={tinta} strokeWidth={3} fill="none" opacity={barco > 0.7 ? 1 : 0} />
            <path d="M8 -6 L60 -30" stroke={tinta} strokeWidth={1.5} opacity={barco > 0.9 ? 1 : 0} />
          </g>
        </svg>
        {/* título vertical em duas colunas, pincelado de cima para baixo */}
        {[titulo[0], titulo[1]].map((t, i) => {
          const p = i === 0 ? col1 : col2;
          return (
            <div key={i} style={{display: p > 0 ? 'block' : 'none', position: 'absolute', left: i === 0 ? 172 : 104, top: 132, writingMode: 'vertical-rl', fontFamily: SC, fontWeight: 600, fontSize: 40, letterSpacing: 14, color: tinta, WebkitMaskImage: `linear-gradient(to bottom, #000 ${p * 100 - 6}%, transparent ${p * 100 + 4}%)`, maskImage: `linear-gradient(to bottom, #000 ${p * 100 - 6}%, transparent ${p * 100 + 4}%)`}}>{t}</div>
          );
        })}
        <div style={{position: 'absolute', left: 260, top: 160, display: fr > 0 ? 'flex' : 'none', alignItems: 'center', gap: 14, fontFamily: GAR, fontStyle: 'italic', fontSize: 30, color: tinta, WebkitMaskImage: `linear-gradient(to right, #000 ${fr * 100 - 5}%, transparent ${fr * 100 + 5}%)`, maskImage: `linear-gradient(to right, #000 ${fr * 100 - 5}%, transparent ${fr * 100 + 5}%)`}}>
          <span style={{width: 12, height: 12, background: vermelho, display: 'inline-block'}} />{frase}
        </div>
        <div style={{display: cap > 0 ? 'block' : 'none', position: 'absolute', left: 286, top: 226, fontFamily: SC, fontWeight: 500, fontSize: 25, letterSpacing: 5, color: '#8a8275', WebkitMaskImage: `linear-gradient(to right, #000 ${cap * 100 - 5}%, transparent ${cap * 100 + 5}%)`, maskImage: `linear-gradient(to right, #000 ${cap * 100 - 5}%, transparent ${cap * 100 + 5}%)`}}>{capitulo}</div>
        {/* selo carimbado por último: chega a 112% com inclinação e assenta */}
        {frame >= 100 && (
          <div style={{position: 'absolute', left: 122, top: 640, width: 56, height: 56, background: vermelho, borderRadius: 4, transform: `scale(${1.12 - 0.12 * selo}) rotate(${(1 - selo) * -6}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width={34} height={34} viewBox="0 0 34 34"><path d="M5 7 H29 M5 17 H29 M5 27 H29 M17 7 V27 M9 7 V12 M25 22 V27" stroke={papel} strokeWidth={3.2} fill="none" /></svg>
          </div>
        )}
        {/* fibra do papel e grão por cima de tudo, inclusive da tinta */}
        <svg width={1080} height={1350} style={{position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.22}}>
          <filter id="as13papel"><feTurbulence type="fractalNoise" baseFrequency="0.02 0.6" numOctaves={3} seed={11} /><feColorMatrix type="matrix" values="0 0 0 0 0.6  0 0 0 0 0.56  0 0 0 0 0.5  0 0 0 0.6 0" /></filter>
          <rect width="100%" height="100%" filter="url(#as13papel)" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
