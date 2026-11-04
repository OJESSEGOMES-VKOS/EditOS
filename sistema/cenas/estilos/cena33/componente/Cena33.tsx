// cena33 — Iceberg (3D edição: malha low-poly real, projetada e sombreada por faceta em SVG).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Figtree';

const {fontFamily: FIGTREE} = loadFont('normal', {weights: ['700'], subsets: ['latin']});

export type Cena33Props = {
  resultado?: string;
  camadas?: [string, string, string];
  width?: number;
  height?: number;
  duracao?: number;
};

type V = [number, number, number];
// perfil do iceberg (y para baixo; 0 = linha d'água)
const ANEIS: [number, number][] = [
  [-330, 0], [-235, 50], [-125, 92], [-35, 128], [0, 140], [70, 250], [210, 330], [400, 360], [600, 345], [770, 280], [890, 160], [960, 0],
];
const NSEG = 9;
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const MALHA: V[][] = ANEIS.map(([y, r], i) =>
  [...Array(NSEG)].map((_, j) => {
    const a = ((j + (i % 2) * 0.5) / NSEG) * Math.PI * 2 + i * 0.21;
    const jr = r * (0.84 + rnd(i * 31 + j) * 0.3);
    const jy = r === 0 ? 0 : (rnd(i * 17 + j * 7) - 0.5) * 34;
    const dx = y < 0 ? -18 * (1 - y / -330) : 0; // ponta um pouco fora do eixo
    return [jr * Math.cos(a) + (i === 0 ? -20 : dx * 0), y + jy, jr * Math.sin(a)] as V;
  }),
);
const TRIS: [V, V, V][] = [];
for (let i = 0; i < MALHA.length - 1; i++) {
  for (let j = 0; j < NSEG; j++) {
    const a = MALHA[i][j], b = MALHA[i][(j + 1) % NSEG], c = MALHA[i + 1][j], d = MALHA[i + 1][(j + 1) % NSEG];
    if (ANEIS[i][1] > 0) TRIS.push([a, b, c]);
    if (ANEIS[i + 1][1] > 0) TRIS.push([b, d, c]);
  }
}
const raioEm = (y: number) => {
  for (let i = 0; i < ANEIS.length - 1; i++) {
    const [y0, r0] = ANEIS[i];
    const [y1, r1] = ANEIS[i + 1];
    if (y >= y0 && y <= y1) return (r0 + ((y - y0) / (y1 - y0)) * (r1 - r0)) * 0.99;
  }
  return 0;
};

const hx = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t);
const rgb = (c: number[]) => `rgb(${c.map((v) => Math.round(Math.max(0, Math.min(255, v)))).join(',')})`;
const MAR: [number, string][] = [[0, '#A6DDEF'], [300, '#5BAEDA'], [620, '#2C74B1'], [960, '#205A93']];
const corMar = (y: number) => {
  for (let i = 0; i < MAR.length - 1; i++) {
    if (y <= MAR[i + 1][0]) return mix(hx(MAR[i][1]), hx(MAR[i + 1][1]), Math.max(0, (y - MAR[i][0]) / (MAR[i + 1][0] - MAR[i][0])));
  }
  return hx(MAR[MAR.length - 1][1]);
};

export const Cena33: React.FC<Cena33Props> = ({
  resultado = 'O resultado',
  camadas = ['Tentativas que falharam', 'Noites viradas', 'O sistema'],
  width = 1080,
  height = 1350,
  duracao = 150,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = duracao / 150;
  const k = Math.min(width / 1080, height / 1350);

  const e1 = Easing.bezier(0.5, 0, 0.3, 1);
  const e2 = Easing.bezier(0.35, 0, 0.15, 1);
  const f = frame;
  const cy = f < 30 * s ? interpolate(f, [0, 30 * s], [-120, 200], {easing: Easing.bezier(0.6, 0, 0.35, 1)}) : interpolate(f, [30 * s, 128 * s], [200, 330], {extrapolateRight: 'clamp', easing: e2});
  const S = f < 30 * s ? interpolate(f, [0, 30 * s], [2.3, 2.2], {easing: e1}) : interpolate(f, [30 * s, 128 * s], [2.2, 1.0], {extrapolateRight: 'clamp', easing: e2});
  const orb = (interpolate(f, [0, 128 * s], [-9, 7], {extrapolateRight: 'clamp', easing: Easing.bezier(0.3, 0, 0.3, 1)}) * Math.PI) / 180;
  const pit = (5 * Math.PI) / 180;

  const proj = (p: V): [number, number, number] => {
    const x = p[0] * Math.cos(orb) + p[2] * Math.sin(orb);
    const z0 = -p[0] * Math.sin(orb) + p[2] * Math.cos(orb);
    const y = p[1] * Math.cos(pit) + z0 * Math.sin(pit);
    const z = z0 * Math.cos(pit) - p[1] * Math.sin(pit);
    return [540 + x * S, (y - cy) * S + 675, z];
  };
  const agua = (0 - cy) * S + 675;
  const L = [-0.55, -0.7, 0.45];
  const ln = Math.hypot(...L);
  const tris = TRIS.map((t) => {
    const P = t.map(proj);
    // normal no espaço da câmera, apontando para fora
    const u = [P[1][0] - P[0][0], P[1][1] - P[0][1], (P[1][2] - P[0][2]) * S];
    const v = [P[2][0] - P[0][0], P[2][1] - P[0][1], (P[2][2] - P[0][2]) * S];
    let n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const nl = Math.hypot(...n) || 1;
    n = n.map((c) => c / nl);
    const cx = (P[0][0] + P[1][0] + P[2][0]) / 3 - 540;
    const cz = (P[0][2] + P[1][2] + P[2][2]) / 3;
    if (n[0] * cx + n[2] * cz < 0) n = n.map((c) => -c);
    const lam = Math.max(0, (n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) / ln);
    const yMed = (t[0][1] + t[1][1] + t[2][1]) / 3;
    return {P, n, lam, zMed: cz, yMed};
  }).filter((t) => t.n[2] > -0.05).sort((a, b) => a.zMed - b.zMed);

  const gelo = hx('#FFFFFF');
  const sombra = hx('#A5CBE6');
  const pts = (P: [number, number, number][]) => P.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

  const pill = (txt: string, x: number, y: number, t0: number | null, alinhar: 'centro' | 'esq' = 'centro') => {
    const sp = t0 === null ? 1 : spring({frame: frame - t0, fps, config: {damping: 15, stiffness: 300}});
    if (sp <= 0.001) return null;
    return (
      <div key={txt} style={{position: 'absolute', left: x, top: y, transform: `translate(${alinhar === 'centro' ? -50 : 0}%, -50%) scale(${sp})`,
        background: '#FFFFFF', borderRadius: 999, padding: '12px 28px', fontFamily: FIGTREE, fontWeight: 700, fontSize: 40, color: '#0C2A4A',
        boxShadow: '0 6px 18px rgba(12,42,74,0.22)', whiteSpace: 'nowrap'}}>{txt}</div>
    );
  };
  const tela = (wy: number) => (wy - cy) * S + 675;
  const fatias = [300, 620];
  const tFatia = [52 * s, 64 * s];

  const contorno = (wy: number, prog: number) => {
    const r = raioEm(wy) * 1.03;
    const ps = [...Array(25)].map((_, i) => proj([r * Math.cos(Math.PI * (i / 24)), wy, r * Math.sin(Math.PI * (i / 24))]));
    const d = 'M' + ps.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L');
    return <path d={d} fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - prog} opacity={0.95} />;
  };

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#205A93'}}>
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 1080, height: 1350, marginLeft: -540, marginTop: -675, transform: `scale(${k})`}}>
        <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
          <defs>
            <linearGradient id="ceu33" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CFE5F4" /><stop offset="1" stopColor="#F2F8FC" /></linearGradient>
            <linearGradient id="mar33" gradientUnits="userSpaceOnUse" x1="0" y1={tela(0)} x2="0" y2={tela(960)}>
              {MAR.map(([y, c]) => <stop key={y} offset={y / 960} stopColor={c} />)}
            </linearGradient>
            <clipPath id="cima33"><rect x={0} y={-10} width={1080} height={Math.max(0, agua + 10)} /></clipPath>
            <clipPath id="baixo33"><rect x={0} y={agua} width={1080} height={Math.max(0, 1360 - agua)} /></clipPath>
          </defs>
          <rect x={0} y={0} width={1080} height={Math.max(0, agua)} fill="url(#ceu33)" />
          <rect x={0} y={agua} width={1080} height={Math.max(0, 1350 - agua)} fill="url(#mar33)" />
          <g clipPath="url(#cima33)">
            {tris.map((t, i) => <polygon key={i} points={pts(t.P)} fill={rgb(mix(sombra, gelo, Math.pow(t.lam, 0.7)))} stroke={rgb(mix(sombra, gelo, Math.pow(t.lam, 0.7)))} strokeWidth={0.6} />)}
          </g>
          <g clipPath="url(#baixo33)">
            {tris.map((t, i) => {
              const base = mix(sombra, gelo, Math.pow(t.lam, 0.7));
              const prof = Math.max(0, Math.min(1, t.yMed / 960));
              const c = mix(mix(base, corMar(t.yMed), 0.42 + 0.3 * prof), [255, 255, 255], 0.16);
              return <polygon key={i} points={pts(t.P)} fill={rgb(c)} stroke={rgb(c)} strokeWidth={0.6} />;
            })}
          </g>
          {/* superfície fosca logo abaixo da linha (a "cortina" que sobe) */}
          <rect x={0} y={agua} width={1080} height={70 * S} fill="url(#fosco33)" />
          <defs>
            <linearGradient id="fosco33" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E6F6FB" stopOpacity={0.55} /><stop offset="1" stopColor="#E6F6FB" stopOpacity={0} /></linearGradient>
          </defs>
          <line x1={0} x2={1080} y1={agua} y2={agua} stroke="#fff" strokeWidth={4} />
          {fatias.map((wy, i) => {
            const prog = interpolate(frame, [tFatia[i], tFatia[i] + 12 * s], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
            const y = tela(wy);
            return (
              <g key={wy}>
                <line x1={540 - 540 * prog} x2={540 + 540 * prog} y1={y} y2={y} stroke="#fff" strokeWidth={2.5} strokeDasharray="12 10" opacity={0.85} />
                {contorno(wy, prog)}
              </g>
            );
          })}
        </svg>
        {pill(resultado, proj([75, -120, 0])[0] + 30, tela(-120), null, 'esq')}
        {pill(camadas[0], proj([0, 140, 0])[0], tela(140), 38 * s)}
        {pill(camadas[1], proj([0, 460, 0])[0], tela(460), 52 * s)}
        {pill(camadas[2], proj([0, 800, 0])[0], tela(800), 64 * s)}
      </div>
    </AbsoluteFill>
  );
};
