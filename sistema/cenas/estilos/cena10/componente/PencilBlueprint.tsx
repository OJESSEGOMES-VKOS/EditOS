// cena10 — Pencil to Blueprint (Lápis à planta técnica). Componente reutilizável (EditOS, cenas/estilos).
// Um desenho só: rascunho a grafite no papel quadriculado → a tinta azul inunda de dentro → linhas viram branco reto → cotas.
// O objeto de exemplo é uma luminária articulada de mesa (vista lateral). Desenho em 1080x1350 (4:5) centralizado.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random} from 'remotion';
import {loadFont} from '@remotion/google-fonts/BarlowSemiCondensed';

const {fontFamily} = loadFont('normal', {weights: ['500', '600'], subsets: ['latin', 'latin-ext']});

export type PencilBlueprintProps = {
  rotulo?: [string, string];
  cotas?: {altura: number; base: number; angulo: number}; // números do desenho (ilustração, não medida real)
  inicioInundacao?: number;
  largura?: number;
  altura?: number;
  cores?: {papel: string; grade: string; grafite: string; azul: string; mare: string; branco: string};
};

const CORES = {papel: '#ECECE6', grade: '#7FA3C4', grafite: '#25262B', azul: '#1C4C8F', mare: '#143C76', branco: '#EEF4FB'};
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const mao = Easing.inOut(Easing.cubic);

type P = [number, number];
const A: P = [405, 1080];
const B: P = [684, 652];
const C: P = [382, 382];
const RIM = {cx: 212, cy: 548, rx: 132, ry: 50, rot: 40};
const rimPt = (k: number): P => {
  const a = (RIM.rot * Math.PI) / 180;
  return [RIM.cx + Math.cos(a) * RIM.rx * k, RIM.cy + Math.sin(a) * RIM.rx * k];
};

// traço de lápis: levemente curvado, tremido, pontas que passam do ponto; "amp" 0 = reto
const linha = (p: P, q: P, sd: string, amp: number, sobra: number): string => {
  const dx = q[0] - p[0];
  const dy = q[1] - p[1];
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L;
  const ny = dx / L;
  const ex = (dx / L) * sobra;
  const ey = (dy / L) * sobra;
  const pts: string[] = [];
  const n = 14;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const arco = Math.sin(t * Math.PI) * 5 * amp;
    const tremor = (random(`${sd}${i}`) - 0.5) * 5 * amp;
    const x = p[0] - ex + (dx + 2 * ex) * t + nx * (arco + tremor);
    const y = p[1] - ey + (dy + 2 * ey) * t + ny * (arco + tremor);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return 'M' + pts.join(' L');
};
const elipse = (cx: number, cy: number, rx: number, ry: number, rot: number, sd: string, amp: number): string => {
  const a = (rot * Math.PI) / 180;
  const pts: string[] = [];
  const n = 40;
  for (let i = 0; i <= n + 3; i++) {
    const t = (i / n) * Math.PI * 2;
    const w = 1 + (random(`${sd}${i % n}`) - 0.5) * 0.06 * amp;
    const x0 = Math.cos(t) * rx * w;
    const y0 = Math.sin(t) * ry * w;
    pts.push(`${(cx + x0 * Math.cos(a) - y0 * Math.sin(a)).toFixed(1)},${(cy + x0 * Math.sin(a) + y0 * Math.cos(a)).toFixed(1)}`);
  }
  return 'M' + pts.join(' L');
};

type Traco = {d: (amp: number) => string; t0: number; t1: number; leve?: boolean; centro?: boolean; dobra?: boolean};

const TRACOS: Traco[] = [
  {d: (a) => linha([110, 1192], [970, 1192], 'ch', a, 10), t0: -6, t1: 8, dobra: true},
  {d: (a) => linha([405, 330], [405, 1215], 'ei', a, 0), t0: -4, t1: 6, leve: true, centro: true},
  {d: (a) => linha(A, B, 'b1', a, 14), t0: 4, t1: 13, dobra: true},
  {d: (a) => linha([A[0] + 20, A[1] + 6], [B[0] + 14, B[1] + 12], 'b2', a, 10), t0: 6, t1: 14, dobra: true},
  {d: (a) => linha([270, 1148], [675, 1148], 'ba', a, 8), t0: 8, t1: 13},
  {d: (a) => linha([270, 1148], [270, 1192], 'bb', a, 4), t0: 12, t1: 14},
  {d: (a) => linha([675, 1148], [675, 1192], 'bc', a, 4), t0: 13, t1: 15},
  {d: (a) => linha([382, 1120], [437, 1120], 'pa', a, 4), t0: 14, t1: 16},
  {d: (a) => linha([382, 1120], [382, 1148], 'pb', a, 2), t0: 15, t1: 17},
  {d: (a) => linha([437, 1120], [437, 1148], 'pc', a, 2), t0: 15, t1: 17},
  {d: (a) => elipse(A[0], A[1], 16, 16, 0, 'ja', a), t0: 14, t1: 18},
  {d: (a) => elipse(B[0], B[1], 16, 16, 0, 'jb', a), t0: 16, t1: 20},
  {d: (a) => elipse(B[0], B[1], 36, 34, 10, 'jb2', a * 2), t0: 18, t1: 22, leve: true},
  {d: (a) => elipse(B[0], B[1], 78, 78, 0, 'gc', a), t0: 19, t1: 24, leve: true, centro: true},
  {d: (a) => linha(B, C, 'u1', a, 14), t0: 22, t1: 30, dobra: true},
  {d: (a) => linha([B[0] - 12, B[1] - 14], [C[0] + 4, C[1] - 16], 'u2', a, 10), t0: 24, t1: 31, dobra: true},
  {d: (a) => elipse(C[0], C[1], 16, 16, 0, 'jc', a), t0: 30, t1: 33},
  {d: (a) => linha(C, rimPt(-1), 's1', a, 10), t0: 32, t1: 37},
  {d: (a) => linha(C, rimPt(1), 's2', a, 10), t0: 34, t1: 39},
  {d: (a) => elipse(RIM.cx, RIM.cy, RIM.rx, RIM.ry, RIM.rot, 'rim', a), t0: 37, t1: 44},
  {d: (a) => elipse(238, 604, 40, 40, 0, 'lam', a).split(' L').slice(0, 24).join(' L'), t0: 43, t1: 46},
  ...[0, 1, 2, 3].map((i): Traco => ({d: (a) => linha([C[0] - 20 - i * 18, C[1] + 40 + i * 30], [rimPt(-0.6 + i * 0.4)[0], rimPt(-0.6 + i * 0.4)[1] - 30], `h${i}`, a, 4), t0: 44 + i, t1: 47 + i, leve: true})),
];

export const PencilBlueprint: React.FC<PencilBlueprintProps> = ({
  rotulo = ['DO RABISCO', 'AO SISTEMA'],
  cotas = {altura: 480, base: 320, angulo: 100},
  inicioInundacao = 51,
  largura,
  altura,
  cores = CORES,
}) => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const W = largura ?? width;
  const H = altura ?? height;
  const s = Math.min(W / 1080, H / 1350);
  const sp = (d: number, damping = 12, stiffness = 170) => spring({frame: f - d, fps, config: {damping, stiffness}});

  // inundação: rápida no começo, depois desacelera; borda molhada irregular
  const tf = f - inicioInundacao;
  const R = tf <= 0 ? 0 : 1650 * (1 - Math.exp(-tf / 6.5));
  const borda = (() => {
    if (R <= 0) return '';
    const pts: string[] = [];
    for (let i = 0; i < 90; i++) {
      const th = (i / 90) * Math.PI * 2;
      const n = 0.05 * Math.sin(th * 3 + 1.3) + 0.04 * Math.sin(th * 7 + 0.4) + 0.025 * Math.sin(th * 13 + 2.1) + (random(`fl${i}`) - 0.5) * 0.04;
      const r = R * (1 + n);
      pts.push(`${(B[0] - 60 + Math.cos(th) * r).toFixed(1)},${(B[1] + 30 + Math.sin(th) * r).toFixed(1)}`);
    }
    return 'M' + pts.join(' L') + 'Z';
  })();
  // linhas brancas saltam retas depois que a borda passa
  const reto = tf <= 0 ? 1 : Math.exp(-tf / 5) * Math.cos(tf * 0.9);

  const prog = (t: Traco) => interpolate(f, [t.t0, t.t1], [0, 1], {...cl, easing: mao});

  // cotas
  const ext = sp(70, 14, 160);
  const dimV = sp(73, 14, 140);
  const dimH = sp(76, 14, 140);
  const seta = (d: number) => sp(d, 9, 220);
  const conta = (alvo: number, d: number) => Math.round(alvo * interpolate(f, [d, d + 18], [0, 1], {...cl, easing: Easing.out(Easing.cubic)}));
  const regra = interpolate(f, [92, 100], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const rot = (i: number) => sp(96 + i * 3, 11, 170);

  const yTopoV = B[1];
  const yBaseV = 1192;
  const midV = (yTopoV + yBaseV) / 2;
  const xV = 945;
  const yH = 1282;
  const midH = (270 + 675) / 2;

  return (
    <AbsoluteFill style={{backgroundColor: cores.papel, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: (W - 1080 * s) / 2, top: (H - 1350 * s) / 2, width: 1080, height: 1350, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <svg width={1080} height={1350} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <defs>
            <pattern id="gp10" width={30} height={30} patternUnits="userSpaceOnUse"><path d="M30 0 L0 0 0 30" fill="none" stroke={cores.grade} strokeWidth={1} opacity={0.35} /></pattern>
            <pattern id="gb10" width={30} height={30} patternUnits="userSpaceOnUse"><path d="M30 0 L0 0 0 30" fill="none" stroke={cores.branco} strokeWidth={1} opacity={0.1} /></pattern>
            <filter id="dente10"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed={5} result="n" /><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.4 0 0 0 1.9" result="a" /><feComposite in="SourceGraphic" in2="a" operator="in" /></filter>
            <filter id="mancha10"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed={8} /><feColorMatrix type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.15  0 0 0 0 0.35  0 0 0 -0.6 0.35" /></filter>
            <clipPath id="cl10"><path d={borda} /></clipPath>
          </defs>
          <rect x={-600} y={-600} width={2280} height={2550} fill="url(#gp10)" />
          {/* rascunho a grafite */}
          <g fill="none" stroke={cores.grafite} strokeLinecap="round" strokeLinejoin="round" filter="url(#dente10)">
            {TRACOS.map((t, i) => {
              const p = prog(t);
              if (p <= 0) return null;
              return (
                <g key={i} opacity={t.leve ? 0.55 : 0.9}>
                  <path d={t.d(1)} strokeWidth={t.leve ? 1.6 : 2.6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
                  {t.dobra && <path d={t.d(1.6)} strokeWidth={1.4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform="translate(2 -2)" />}
                </g>
              );
            })}
          </g>
          {/* a planta azul, revelada pela inundação */}
          {R > 0 && (
            <g clipPath="url(#cl10)">
              <rect x={-600} y={-600} width={2280} height={2550} fill={cores.azul} />
              <rect x={-600} y={-600} width={2280} height={2550} filter="url(#mancha10)" />
              <rect x={-600} y={-600} width={2280} height={2550} fill="url(#gb10)" />
              <path d={borda} fill="none" stroke={cores.mare} strokeWidth={26} opacity={0.9} />
              <g fill="none" stroke={cores.branco} strokeLinecap="round" strokeLinejoin="round">
                {TRACOS.map((t, i) => {
                  if (t.leve && !t.centro) return <path key={i} d={t.d(reto * 0.6)} strokeWidth={1.4} opacity={0.75} />;
                  if (t.centro) {
                    if (i === 13) return f < 72 ? <path key={i} d={t.d(0)} strokeWidth={1.4} opacity={interpolate(f, [62, 72], [0.7, 0], cl)} strokeDasharray="22 7 4 7" /> : null;
                    return <path key={i} d={t.d(0)} strokeWidth={1.6} strokeDasharray="26 8 5 8" opacity={0.85} />;
                  }
                  return <path key={i} d={t.d(reto)} strokeWidth={2.4} />;
                })}
              </g>
            </g>
          )}
          {/* sistema de cotas */}
          {f >= 66 && (
            <g stroke={cores.branco} fill="none" strokeWidth={1.6}>
              {/* marcas de centro */}
              {[A, B, C].map(([x, y], i) => {
                const k = sp(66 + i * 2, 9, 240) * 26;
                return <path key={i} d={`M${x - k} ${y} L${x + k} ${y} M${x} ${y - k} L${x} ${y + k}`} opacity={0.8} />;
              })}
              {/* ângulo: o círculo guia virou arco de cota */}
              <path d={`M${B[0] - 78 * 0.62} ${B[1] - 78 * 0.78} A 78 78 0 0 0 ${B[0]} ${B[1] + 78}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sp(70, 14, 140)} />
              {/* linhas de extensão */}
              <path d={`M${B[0] + 26} ${yTopoV} L${B[0] + 26 + (xV + 20 - B[0] - 26) * ext} ${yTopoV}`} opacity={0.8} />
              <path d={`M${975 - (975 - 690) * ext} ${yBaseV} L975 ${yBaseV}`} opacity={0} />
              <path d={`M270 ${yBaseV + 8} L270 ${yBaseV + 8 + 100 * ext} M675 ${yBaseV + 8} L675 ${yBaseV + 8 + 100 * ext}`} opacity={0.8} />
              {/* cota vertical, desenhada do meio */}
              <path d={`M${xV} ${midV - (midV - yTopoV) * dimV} L${xV} ${midV + (yBaseV - midV) * dimV}`} />
              {/* cota horizontal */}
              <path d={`M${midH - (midH - 270) * dimH} ${yH} L${midH + (675 - midH) * dimH} ${yH}`} />
              {/* pontas de seta */}
              <g fill={cores.branco} stroke="none">
                {[[xV, yTopoV, 90, 82], [xV, yBaseV, -90, 82], [270, yH, 0, 85], [675, yH, 180, 85]].map(([x, y, a, d], i) => (
                  <path key={i} d="M0 0 L18 -6 L18 6 Z" transform={`translate(${x} ${y}) rotate(${a}) scale(${seta(d)})`} />
                ))}
              </g>
            </g>
          )}
        </svg>
        {/* números que contam até o lugar */}
        {f >= 80 && (
          <div style={{fontFamily, fontWeight: 500, fontSize: 44, color: cores.branco, fontVariantNumeric: 'tabular-nums'}}>
            <div style={{position: 'absolute', left: xV - 92, top: midV - 26, transform: `scale(${sp(80, 10, 200)})`}}>{conta(cotas.altura, 80)}</div>
            <div style={{position: 'absolute', left: midH - 40, top: yH + 6, transform: `scale(${sp(83, 10, 200)})`}}>{conta(cotas.base, 83)}</div>
            <div style={{position: 'absolute', left: B[0] - 150, top: B[1] - 30, transform: `scale(${sp(86, 10, 200)})`}}>{conta(cotas.angulo, 86)}°</div>
          </div>
        )}
        {/* rótulo: a régua desenha primeiro, o texto sobe */}
        <div style={{position: 'absolute', left: 126, top: 247, width: 526 * regra, height: 2, background: cores.branco, opacity: 0.85}} />
        {rotulo.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 126, top: 76 + i * 84, height: 86, overflow: 'hidden'}}>
            <div style={{fontFamily, fontWeight: 600, fontSize: 84, letterSpacing: '0.07em', lineHeight: 1, color: cores.branco, transform: `translateY(${(1 - rot(i)) * 105}%)`}}>{l}</div>
          </div>
        ))}
      </div>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.08, mixBlendMode: 'multiply', pointerEvents: 'none'}}>
        <filter id="grao10"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={1} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width={W} height={H} filter="url(#grao10)" />
      </svg>
    </AbsoluteFill>
  );
};
