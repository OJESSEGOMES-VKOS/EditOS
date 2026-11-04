// cena46 · Blue Grid (Grade azul, como funciona)
// Modelo de argila branca sobre grade de engenharia azul: um motor turbofan inventado com um quarto cortado gira
// devagar enquanto linhas de ar laranja entram, são comprimidas, queimam em vermelho e saem atrás. Três chamadas.
// "3D edição": superfícies de revolução projetadas em código (sem three.js), ordenadas por profundidade.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Montserrat';

const {fontFamily} = loadFont('normal', {weights: ['600'], subsets: ['latin', 'latin-ext']});

export type Cena46Props = {
  titulo?: string;
  chamadas?: [string, string, string];
  width?: number;
  height?: number;
};

const W = 1080, H = 1350;
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
type V3 = [number, number, number];
type Q = {p: V3[]; n: V3; c: [number, number, number]; line?: boolean; glow?: number};

const CLAY: [number, number, number] = [234, 238, 242];
const CUT: [number, number, number] = [188, 200, 213];
const BLADE: [number, number, number] = [210, 219, 229];
const SEG = 40;
const inCut = (th: number) => {
  // corta o quarto de cima-frente (y>0 e z>0)
  const a = ((th % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  return a > 0.0001 && a < Math.PI / 2 - 0.0001;
};
const ring = (x: number, r: number, th: number): V3 => [x, Math.sin(th) * r, Math.cos(th) * r];

// superfície de revolução entre perfis (x, r), opcionalmente cortada
const revolve = (prof: [number, number][], c: [number, number, number], cut: boolean, inward = false): Q[] => {
  const out: Q[] = [];
  for (let i = 0; i < prof.length - 1; i++) {
    for (let k = 0; k < SEG; k++) {
      const t0 = (k / SEG) * Math.PI * 2, t1 = ((k + 1) / SEG) * Math.PI * 2;
      const tm = (t0 + t1) / 2;
      if (cut && inCut(tm)) continue;
      const [xa, ra] = prof[i], [xb, rb] = prof[i + 1];
      const p: V3[] = [ring(xa, ra, t0), ring(xa, ra, t1), ring(xb, rb, t1), ring(xb, rb, t0)];
      const slope = (ra - rb) / Math.max(0.001, Math.hypot(xb - xa, rb - ra));
      let n: V3 = [slope, Math.sin(tm), Math.cos(tm)];
      if (inward) n = [-n[0], -n[1], -n[2]];
      out.push({p, n, c});
    }
  }
  return out;
};
// faces do corte (espessura da parede) nos ângulos 0 e 90°
const cutFaces = (prof: [number, number][], thick: number): Q[] => {
  const out: Q[] = [];
  for (const th of [0, Math.PI / 2]) {
    for (let i = 0; i < prof.length - 1; i++) {
      const [xa, ra] = prof[i], [xb, rb] = prof[i + 1];
      const p: V3[] = [ring(xa, ra, th), ring(xb, rb, th), ring(xb, rb - thick, th), ring(xa, ra - thick, th)];
      const n: V3 = th === 0 ? [0, 1, 0] : [0, 0, 1];
      out.push({p, n: th === 0 ? [0, -1, 0] : [0, 0, 1], c: CUT});
      void n;
    }
  }
  return out;
};
const disc = (x: number, r0: number, r1: number, c: [number, number, number], seg = 28): Q[] =>
  Array.from({length: seg}, (_, k) => {
    const t0 = (k / seg) * Math.PI * 2, t1 = ((k + 1) / seg) * Math.PI * 2;
    return {p: [ring(x, r0, t0), ring(x, r1, t0), ring(x, r1, t1), ring(x, r0, t1)], n: [-1, 0, 0] as V3, c};
  });

const NAC: [number, number][] = [[0, 38], [4, 40.5], [14, 41], [30, 40.5], [44, 39], [54, 36]];
const NAC_IN: [number, number][] = NAC.map(([x, r]) => [x, r - 3]);
const CORE: [number, number][] = [[42, 23], [56, 25], [70, 24], [82, 21], [88, 19]];
const CORE_IN: [number, number][] = CORE.map(([x, r]) => [x, r - 2.5]);
const STATIC: Q[] = [
  ...revolve(NAC, CLAY, true),
  ...revolve(NAC_IN, CLAY, true, true),
  ...cutFaces(NAC, 3),
  ...revolve(CORE, CLAY, true),
  ...revolve(CORE_IN, [214, 222, 232], true, true),
  ...cutFaces(CORE, 2.5),
  ...revolve([[20, 8], [90, 8]], [200, 210, 222], false),
  ...revolve([[88, 13], [96, 9], [104, 3], [108, 0.2]], CLAY, false), // cone de escape
];

export const Cena46: React.FC<Cena46Props> = ({
  titulo = 'Turbofan explicado',
  chamadas = ['FAN', 'COMPRESSOR', 'ESCAPE'],
  width = W,
  height = H,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const f = frame * (150 / durationInFrames);

  const settle = interpolate(f, [0, 120], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const yaw = ((16 + settle * 10) * Math.PI) / 180;
  const pitch = (24 * Math.PI) / 180;
  // fan: marcha lenta, acelera a partir de 1 s, para junto com tudo
  const fanAng = interpolate(f, [0, 30, 60, 120], [0, 0.4, 2.4, 6.2], {...cl, easing: Easing.out(Easing.sin)});
  const flow = interpolate(f, [30, 60], [0, 1], {...cl, easing: Easing.out(Easing.quad)});
  const heat = interpolate(f, [46, 70], [0, 1], cl);
  const jet = interpolate(f, [56, 80], [0, 1], {...cl, easing: Easing.out(Easing.quad)});
  const pulse = interpolate(f, [0, 120], [0, 4.2], {...cl, easing: Easing.out(Easing.quad)});
  const call = (st: number) => ({
    dot: spring({frame: f - st, fps: 30, config: {damping: 10, stiffness: 200}}),
    line: interpolate(f, [st + 2, st + 10], [0, 1], cl),
    word: spring({frame: f - st - 8, fps: 30, config: {damping: 10, stiffness: 160, mass: 0.6}}),
  });
  const C1 = call(62), C2 = call(74), C3 = call(86);

  const TGT: V3 = [54, 0, 0];
  const DIST = 320, FOC = 2500;
  const proj = (p: V3): [number, number, number] => {
    const dx = p[0] - TGT[0], dy = p[1] - TGT[1], dz = p[2] - TGT[2];
    // gira em torno de y (yaw) e depois de x (pitch); câmera olha para -z
    const x1 = dx * Math.cos(yaw) + dz * Math.sin(yaw);
    const z1 = -dx * Math.sin(yaw) + dz * Math.cos(yaw);
    const y2 = dy * Math.cos(pitch) - z1 * Math.sin(pitch);
    const z2 = dy * Math.sin(pitch) + z1 * Math.cos(pitch);
    const d = DIST - z2;
    const s = FOC / d;
    return [520 + x1 * s, 720 - y2 * s, d];
  };
  const camDir = (): V3 => {
    // direção para a câmera no mundo
    const v: V3 = [0, Math.sin(pitch), Math.cos(pitch)];
    return [-v[2] * Math.sin(yaw), v[1], v[2] * Math.cos(yaw)];
  };
  const toCam = camDir();
  const L: V3 = [-0.55, 0.75, 0.45];

  // peças que giram: pás do fan e anéis do compressor
  const blades: Q[] = Array.from({length: 22}, (_, i) => {
    const a = (i / 22) * Math.PI * 2 + fanAng;
    const tw = 0.32;
    const p: V3[] = [ring(15, 10, a - 0.06), ring(20, 10, a + 0.12), ring(19, 36.5, a + tw + 0.1), ring(14, 36.5, a + tw - 0.12)];
    return {p, n: [-0.7, Math.sin(a + 1.2) * 0.5, Math.cos(a + 1.2) * 0.5] as V3, c: BLADE};
  });
  const comp: Q[] = [];
  for (let x = 26; x <= 62; x += 3.2) {
    const rOut = interpolate(x, [26, 62], [21, 17]);
    const hot = interpolate(x, [44, 62], [0, 1], cl) * heat;
    const c: [number, number, number] = [210 + hot * 35, 219 - hot * 120, 229 - hot * 140];
    comp.push(...disc(x, 8, rOut, c, 24).map((q) => ({...q, glow: hot})));
  }
  const comb: Q[] = [...revolve([[63, 16], [68, 18], [74, 16]], [235 - heat * 10, 220 - heat * 150, 222 - heat * 170], false)].map((q) => ({...q, glow: heat}));

  const quads = [...STATIC, ...blades, ...comp, ...comb]
    .map((q) => {
      const pp = q.p.map(proj);
      const depth = pp.reduce((a, b) => a + b[2], 0) / pp.length;
      // normal virada pra câmera
      let n = q.n;
      const nl = Math.hypot(n[0], n[1], n[2]) || 1;
      n = [n[0] / nl, n[1] / nl, n[2] / nl];
      const facing = n[0] * toCam[0] + n[1] * toCam[1] + n[2] * toCam[2];
      if (facing < 0) n = [-n[0], -n[1], -n[2]];
      const lam = Math.max(0, n[0] * L[0] + n[1] * L[1] + n[2] * L[2]);
      const k = 0.62 + 0.38 * lam;
      const col = `rgb(${Math.round(q.c[0] * k - (1 - k) * 30)},${Math.round(q.c[1] * k - (1 - k) * 10)},${Math.round(Math.min(255, q.c[2] * k + (1 - k) * 40))})`;
      return {pp, depth, col, glow: q.glow || 0};
    })
    .sort((a, b) => b.depth - a.depth);

  // linhas de ar (no mundo) -> projetadas
  const flows = Array.from({length: 9}, (_, i) => {
    const a = (i / 9) * Math.PI * 2 + 0.4;
    const core = i % 3 === 0;
    const r0 = core ? 13 : 28 + (i % 2) * 5;
    const pts: V3[] = [];
    for (let x = -70; x <= (core ? 150 : 115); x += 4) {
      let r = r0;
      if (core) r = x < 20 ? 13 : x < 62 ? interpolate(x, [20, 62], [13, 9.5]) : x < 90 ? interpolate(x, [62, 90], [9.5, 12]) : interpolate(x, [90, 150], [12, 7]);
      else r = x < 50 ? r0 : interpolate(x, [50, 115], [r0, r0 + 4], cl);
      const tw = x > 15 ? (x - 15) * 0.004 : 0;
      pts.push([x, Math.sin(a + tw) * r, Math.cos(a + tw) * r]);
    }
    return {pts: pts.map(proj), core};
  });
  const poly = (pp: [number, number, number][]) => pp.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' ');

  const callout = (p: V3, ty: number, tx: number, lb: typeof C1, word: string, below = false) => {
    const q = proj(p);
    const yEnd = q[1] + (ty - q[1]) * lb.line;
    const rule = 200;
    return (
      <g>
        <circle cx={q[0]} cy={q[1]} r={8 * lb.dot} fill="#FFFFFF" stroke="#1E5A9C" strokeWidth="3" />
        <polyline points={`${q[0]},${q[1]} ${q[0]},${yEnd}`} stroke="#FFFFFF" strokeWidth="2" fill="none" />
        {lb.line >= 1 && <line x1={q[0]} y1={ty} x2={q[0] + (tx - q[0])} y2={ty} stroke="#FFFFFF" strokeWidth="2" />}
        {lb.line >= 1 && <line x1={tx} y1={ty} x2={tx + (q[0] > tx ? -rule * 0 : rule)} y2={ty} stroke="#FFFFFF" strokeWidth="2" />}
        <g transform={`translate(0 ${(1 - lb.word) * 18})`} opacity={Math.min(1, lb.word * 1.5)}>
          <text x={Math.min(tx, q[0])} y={below ? ty + 44 : ty - 14} fontFamily={fontFamily} fontWeight={600} fontSize={40} letterSpacing={5} fill="#FFFFFF">{word}</text>
        </g>
      </g>
    );
  };

  const s = Math.max(width / W, height / H);
  return (
    <AbsoluteFill style={{background: '#042D61', overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: W, height: H, left: (width - W * s) / 2, top: (height - H * s) / 2, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <radialGradient id="b46bg" cx="0.5" cy="0.55" r="0.75"><stop offset="0" stopColor="#1E5A9C" /><stop offset="0.6" stopColor="#0B417D" /><stop offset="1" stopColor="#042D61" /></radialGradient>
            <filter id="b46glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="b46hot" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18" /></filter>
            <filter id="b46shadow"><feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#021733" floodOpacity="0.8" /></filter>
            <filter id="b46grid"><feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves="2" seed="3" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="4" /></filter>
          </defs>
          <rect width={W} height={H} fill="url(#b46bg)" />
          <g filter="url(#b46grid)">
            {Array.from({length: 34}, (_, i) => (
              <g key={i}>
                <line x1={i * 33} y1={0} x2={i * 33} y2={H} stroke="#5D93D0" strokeOpacity={i % 2 ? 0.1 : 0.22} strokeWidth="1.5" />
                <line x1={0} y1={i * 33} x2={W} y2={i * 33} stroke="#5D93D0" strokeOpacity={i % 2 ? 0.1 : 0.22} strokeWidth="1.5" />
                <line x1={0} y1={(i + 34) * 33} x2={W} y2={(i + 34) * 33} stroke="#5D93D0" strokeOpacity={i % 2 ? 0.1 : 0.22} strokeWidth="1.5" />
              </g>
            ))}
          </g>

          {/* sombra suave do modelo */}
          <ellipse cx="560" cy="1120" rx="420" ry="60" fill="#021C40" opacity="0.45" filter="url(#b46hot)" />

          {/* modelo */}
          <g>
            {quads.map((q, i) => (
              <polygon key={i} points={poly(q.pp)} fill={q.col} stroke={q.col} strokeWidth="0.8" strokeLinejoin="round" />
            ))}
          </g>
          {/* linhas de painel na pele */}
          <g stroke="#45515F" strokeWidth="1.6" fill="none" opacity="0.7">
            {[14, 30, 44].map((x) => {
              const r = NAC.find((p) => p[0] >= x)![1];
              const pts = Array.from({length: 31}, (_, k) => ring(x, r + 0.1, Math.PI / 2 + (k / 30) * Math.PI * 1.5)).map(proj);
              return <polyline key={x} points={poly(pts)} />;
            })}
          </g>
          {/* núcleo quente brilhando por dentro */}
          {heat > 0 && (() => {
            const c = proj([66, 0, 0]);
            return <ellipse cx={c[0]} cy={c[1]} rx={170} ry={130} fill="#F25148" opacity={0.45 * heat} filter="url(#b46hot)" />;
          })()}

          {/* fluxo de ar */}
          <g filter="url(#b46glow)">
            {flows.map((fl, i) => {
              const n = fl.pts.length;
              const shown = Math.max(2, Math.floor(n * Math.min(1, flow * 1.25 - (i % 3) * 0.08)));
              if (flow <= 0) return null;
              const pp = fl.pts.slice(0, shown);
              const tip = pp[pp.length - 1];
              const red = fl.core ? heat : 0;
              const mainCol = fl.core ? `rgb(${243 - red * 1},${143 - red * 62},${63 + red * 9})` : '#F38F3F';
              return (
                <g key={i}>
                  <polyline points={poly(pp)} stroke={mainCol} strokeWidth={fl.core ? 4.5 : 3.5} fill="none" strokeLinecap="round" opacity="0.95" />
                  <polyline points={poly(pp)} stroke="#FFD2A8" strokeWidth="3" fill="none" strokeDasharray="10 90" strokeDashoffset={-pulse * 100 - i * 13} opacity="0.9" />
                  {shown < n && <circle cx={tip[0]} cy={tip[1]} r="6" fill="#FFE7CF" />}
                </g>
              );
            })}
            {/* jato vermelho atrás do cone */}
            {jet > 0 && (() => {
              const a = proj([104, 0, 0]), b = proj([104 + 70 * jet, 0, 0]);
              return (
                <g>
                  <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#F25148" strokeWidth={70} strokeLinecap="round" opacity="0.45" filter="url(#b46hot)" />
                  <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#FF7A6E" strokeWidth={18} strokeLinecap="round" opacity="0.7" />
                </g>
              );
            })()}
          </g>

          {/* título e chamadas */}
          <text x="70" y="140" fontFamily={fontFamily} fontWeight={600} fontSize={72} fill="#F4F7FA" filter="url(#b46shadow)">{titulo}</text>
          {callout([17, 22, 6], 430, 80, C1, chamadas[0])}
          {callout([48, 14, 14], 380, 440, C2, chamadas[1])}
          {callout([100, 6, 4], 1190, 640, C3, chamadas[2], true)}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
