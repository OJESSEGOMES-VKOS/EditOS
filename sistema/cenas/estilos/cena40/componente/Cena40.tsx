// cena40 · Hologram (Holograma)
// Maquete de um lugar inteiro em holograma azul-gelo sobre preto. A câmera orbita ~35° e empurra; um veículo vira
// vermelho com uma linha de varredura, uma rota vermelha vai do portão até a doca e três rótulos mono em fio fino.
// "3D edição": projeção em perspectiva calculada em código (sem three.js), faces ordenadas por profundidade.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/JetBrainsMono';

const {fontFamily} = loadFont('normal', {weights: ['400', '600'], subsets: ['latin', 'latin-ext']});

export type Rotulo40 = {nome: string; hora: string};
export type Cena40Props = {
  rotuloPortao?: Rotulo40;
  rotuloVeiculo?: Rotulo40;
  rotuloDestino?: Rotulo40;
  corGelo?: string;
  corDestaque?: string;
  width?: number;
  height?: number;
};

const W = 1080, H = 1350;
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
type V3 = [number, number, number];
type Box = {x0: number; x1: number; z0: number; z1: number; y0: number; y1: number; k: string; fans?: number[][]};

// a maquete (unidades do mundo; y para cima)
const BOXES: Box[] = [
  {k: 'bA', x0: 6, x1: 46, z0: 6, z1: 54, y0: 0, y1: 22, fans: Array.from({length: 18}, (_, i) => [10 + (i % 3) * 13, 10 + Math.floor(i / 3) * 7.6])},
  {k: 'bB', x0: 50, x1: 78, z0: 22, z1: 62, y0: 0, y1: 19, fans: Array.from({length: 12}, (_, i) => [55 + (i % 2) * 14, 26 + Math.floor(i / 2) * 6])},
  {k: 'tr1', x0: 21, x1: 29, z0: 58, z1: 82, y0: 1.2, y1: 12},
  {k: 'cab1', x0: 21.5, x1: 28.5, z0: 83, z1: 90, y0: 1.2, y1: 9.5},
  {k: 'tr2', x0: 32, x1: 40, z0: 58, z1: 82, y0: 1.2, y1: 12},
  {k: 'cab2', x0: 32.5, x1: 39.5, z0: 83, z1: 90, y0: 1.2, y1: 9.5},
  {k: 'ac1', x0: 60, x1: 72, z0: 70, z1: 80, y0: 0, y1: 8, fans: [[66, 75]]},
  {k: 'ac2', x0: 76, x1: 88, z0: 70, z1: 80, y0: 0, y1: 8, fans: [[82, 75]]},
  {k: 'ac3', x0: 76, x1: 88, z0: 50, z1: 60, y0: 0, y1: 8, fans: [[82, 55]]},
  {k: 'booth', x0: 46, x1: 52, z0: 92, z1: 98, y0: 0, y1: 7},
  {k: 'pipe', x0: 47, x1: 49, z0: 54, z1: 70, y0: 0, y1: 10},
];
const SITE = {x0: 0, x1: 94, z0: 0, z1: 100};
const GATE: V3 = [43, 0, 100];
const DOCK: V3 = [36, 3, 54];
const ROUTE: V3[] = [[43, 0.2, 104], [43, 0.2, 94], [36, 0.2, 92], [36, 0.2, 56]];

export const Cena40: React.FC<Cena40Props> = ({
  rotuloPortao = {nome: 'PORTÃO', hora: '02:14'},
  rotuloVeiculo = {nome: 'CAMINHÃO 3', hora: ''},
  rotuloDestino = {nome: 'DOCA 2', hora: '02:16'},
  corGelo = '#85C9FB',
  corDestaque = '#CF3538',
  width = W,
  height = H,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const f = frame * (150 / durationInFrames);

  // câmera: orbita ~35°, baixa um pouco e empurra, para em 4 s
  const cam = interpolate(f, [0, 120], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const yaw = ((-52 + cam * 35) * Math.PI) / 180;
  const pitch = ((50 - cam * 7) * Math.PI) / 180;
  const dist = 240 - cam * 38;
  const tgt: V3 = [47, 6, 52];
  const focal = 1750;

  const proj = (p: V3): [number, number, number] => {
    const dx = p[0] - tgt[0], dy = p[1] - tgt[1], dz = p[2] - tgt[2];
    const cx = dx * Math.cos(yaw) - dz * Math.sin(yaw);
    const cz0 = dx * Math.sin(yaw) + dz * Math.cos(yaw);
    const cy = dy * Math.cos(pitch) - cz0 * Math.sin(pitch);
    const cz = dy * Math.sin(pitch) + cz0 * Math.cos(pitch);
    const depth = dist - cz;
    const s = focal / depth;
    return [W / 2 + cx * s, 660 - cy * s, depth];
  };
  const camPos: V3 = (() => {
    // posição da câmera no mundo (para culling)
    const cz = dist;
    const y = cz * Math.sin(pitch), h = cz * Math.cos(pitch);
    return [tgt[0] + h * Math.sin(yaw), tgt[1] + y, tgt[2] + h * Math.cos(yaw)];
  })();

  // vermelho
  const scan = interpolate(f, [30, 46], [0, 1], cl);
  const flash = interpolate(f, [24, 30, 34], [0, 1, 0.6], cl);
  const route = interpolate(f, [48, 76], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
  const ring = spring({frame: f - 76, fps: 30, config: {damping: 12, stiffness: 120}});
  const lab = (st: number) => ({
    dot: spring({frame: f - st, fps: 30, config: {damping: 10, stiffness: 200}}),
    line: interpolate(f, [st + 2, st + 8], [0, 1], cl),
    txt: spring({frame: f - st - 6, fps: 30, config: {damping: 10, stiffness: 150, mass: 0.7}}),
  });
  const L1 = lab(14), L2 = lab(44), L3 = lab(80);

  const pts = (a: V3[]) => a.map((p) => proj(p)).map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' ');
  const circle = (cx: number, cz: number, r: number, y: number, n = 14): V3[] =>
    Array.from({length: n}, (_, i) => [cx + Math.cos((i / n) * Math.PI * 2) * r, y, cz + Math.sin((i / n) * Math.PI * 2) * r]);

  const isRed = (b: Box, zMid: number) => b.k === 'tr2' || b.k === 'cab2' ? zMid > 90 - scan * 34 : false;
  const RED = corDestaque;

  // faces de uma caixa
  const faces = (b: Box) => {
    const {x0, x1, z0, z1, y0, y1} = b;
    const list: {p: V3[]; n: V3; top?: boolean}[] = [
      {p: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], n: [0, 1, 0], top: true},
      {p: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], n: [0, 0, 1]},
      {p: [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], n: [0, 0, -1]},
      {p: [[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], n: [1, 0, 0]},
      {p: [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], n: [-1, 0, 0]},
    ];
    const c: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2];
    return list.filter((fc) => {
      const fcC = fc.p.reduce((a, q) => [a[0] + q[0] / 4, a[1] + q[1] / 4, a[2] + q[2] / 4], [0, 0, 0] as V3);
      const v = [camPos[0] - fcC[0], camPos[1] - fcC[1], camPos[2] - fcC[2]];
      return v[0] * fc.n[0] + v[1] * fc.n[1] + v[2] * fc.n[2] > 0;
    }).map((fc) => ({...fc, c}));
  };

  const sorted = [...BOXES].sort((a, b) => proj([(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, (b.z0 + b.z1) / 2])[2] - proj([(a.x0 + a.x1) / 2, (a.y0 + a.y1) / 2, (a.z0 + a.z1) / 2])[2]);

  const drawBox = (b: Box, refl = false) => {
    const fl = refl ? (p: V3): V3 => [p[0], -p[1], p[2]] : (p: V3) => p;
    const red = (zm: number) => isRed(b, zm);
    const veh = b.k.startsWith('tr') || b.k.startsWith('cab');
    return (
      <g key={b.k + (refl ? 'r' : '')}>
        {faces(b).map((fc, i) => {
          const zm = fc.p.reduce((a, q) => a + q[2], 0) / 4;
          const r = red(zm);
          const fill = r ? 'url(#h40red)' : veh ? 'url(#h40glass)' : fc.top ? 'url(#h40roof)' : 'url(#h40wall)';
          return <polygon key={i} points={pts(fc.p.map(fl))} fill={fill} fillOpacity={veh ? 0.75 : 0.88} stroke={r ? '#FF8A86' : veh ? '#36E0FF' : '#BFE6FF'} strokeWidth={veh ? 2.2 : 1.6} strokeLinejoin="round" />;
        })}
        {/* linhas de painel nas paredes */}
        {!veh && !refl && b.y1 > 8 && [0.33, 0.66].map((t) => (
          <polyline key={t} points={pts([[b.x0, b.y0 + (b.y1 - b.y0) * t, b.z1], [b.x1, b.y0 + (b.y1 - b.y0) * t, b.z1]])} stroke="#CDEBFF" strokeOpacity="0.35" strokeWidth="1" fill="none" />
        ))}
        {veh && !refl && Array.from({length: 6}, (_, i) => (
          <polyline key={i} points={pts([[b.x0, b.y0 + 0.5, b.z0 + (i + 0.5) * (b.z1 - b.z0) / 6], [b.x0, b.y1 - 0.4, b.z0 + (i + 0.5) * (b.z1 - b.z0) / 6]])} stroke={red(b.z0 + (i + 0.5) * (b.z1 - b.z0) / 6) ? '#FFB0AC' : '#7FEFFF'} strokeOpacity="0.5" strokeWidth="1.2" fill="none" />
        ))}
        {(b.fans || []).map(([fx, fz], i) => (
          <g key={i}>
            <polygon points={pts(circle(fx, fz, b.k.startsWith('ac') ? 4.2 : 2.3, b.y1 + 0.05).map(fl))} fill="#0F4C86" fillOpacity="0.55" stroke="#E2F4FF" strokeWidth="1.3" />
            <polygon points={pts(circle(fx, fz, b.k.startsWith('ac') ? 1.4 : 0.8, b.y1 + 0.06).map(fl))} fill="#E2F4FF" fillOpacity="0.8" />
          </g>
        ))}
        {/* rodas */}
        {(b.k === 'tr1' || b.k === 'tr2' || b.k === 'cab1' || b.k === 'cab2') && !refl && [b.z0 + 3, b.z1 - 3].map((wz, i) => (
          <polygon key={i} points={pts(Array.from({length: 12}, (_, k) => [b.x0 - 0.1, 1.4 + Math.sin((k / 12) * Math.PI * 2) * 1.4, wz + Math.cos((k / 12) * Math.PI * 2) * 1.4] as V3))}
            fill="#03070D" stroke={red(wz) ? '#FF6A64' : '#4FF0FF'} strokeWidth="2.4" />
        ))}
      </g>
    );
  };

  const routePts = (() => {
    // percorre a rota até a fração "route"
    const segs = ROUTE.slice(1).map((p, i) => Math.hypot(p[0] - ROUTE[i][0], p[2] - ROUTE[i][2]));
    const total = segs.reduce((a, b) => a + b, 0);
    let left = total * route;
    const out: V3[] = [ROUTE[0]];
    for (let i = 0; i < segs.length && left > 0; i++) {
      const t = Math.min(1, left / segs[i]);
      const a = ROUTE[i], b = ROUTE[i + 1];
      out.push([a[0] + (b[0] - a[0]) * t, a[1], a[2] + (b[2] - a[2]) * t]);
      left -= segs[i];
    }
    return out;
  })();
  const head = proj(routePts[routePts.length - 1]);

  const labelAt = (p: V3, y: number, lb: typeof L1, r: Rotulo40, align: 'l' | 'r') => {
    const q = proj(p);
    const yEnd = q[1] + (y - q[1]) * lb.line;
    const tx = align === 'l' ? q[0] + 14 : q[0] - 14;
    return (
      <g>
        <circle cx={q[0]} cy={q[1]} r={7 * lb.dot} fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1={q[0]} y1={q[1]} x2={q[0]} y2={yEnd} stroke="#FFFFFF" strokeWidth="1.6" />
        <line x1={q[0]} y1={y} x2={align === 'l' ? q[0] + 10 : q[0] - 10} y2={y} stroke="#FFFFFF" strokeWidth="1.6" opacity={lb.line >= 1 ? 1 : 0} />
        <g transform={`translate(0 ${(1 - lb.txt) * 26})`} opacity={Math.min(1, lb.txt * 1.4)}>
          <text x={tx} y={y + (y > q[1] ? 10 : -4)} fontFamily={fontFamily} fontWeight={600} fontSize={30} letterSpacing={2} fill="#EEF8FF" textAnchor={align === 'l' ? 'start' : 'end'}>{r.nome}</text>
          {r.hora && <text x={tx} y={y + (y > q[1] ? 44 : 30)} fontFamily={fontFamily} fontWeight={400} fontSize={27} letterSpacing={2} fill="#9DB7CF" textAnchor={align === 'l' ? 'start' : 'end'}>{r.hora}</text>}
        </g>
      </g>
    );
  };

  const fog = (i: number) => (Math.sin(f / 40 + i * 2) * 30) * interpolate(f, [100, 120], [1, 0], cl);
  const redPool = interpolate(f, [34, 46], [0, 1], cl);
  const s = Math.max(width / W, height / H);

  return (
    <AbsoluteFill style={{background: '#03070D', overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: W, height: H, left: (width - W * s) / 2, top: (height - H * s) / 2, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <linearGradient id="h40roof" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#B4E0FF" /><stop offset="1" stopColor={corGelo} /></linearGradient>
            <linearGradient id="h40wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#69B3E8" /><stop offset="0.7" stopColor="#3B83C4" /><stop offset="1" stopColor="#0C3F78" /></linearGradient>
            <linearGradient id="h40glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1B4F7E" /><stop offset="1" stopColor="#071D36" /></linearGradient>
            <linearGradient id="h40red" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF6A64" /><stop offset="1" stopColor={RED} /></linearGradient>
            <radialGradient id="h40haze"><stop offset="0" stopColor="#172734" stopOpacity="0.9" /><stop offset="1" stopColor="#03070D" stopOpacity="0" /></radialGradient>
            <radialGradient id="h40poolC"><stop offset="0" stopColor="#4FE6FF" stopOpacity="0.8" /><stop offset="1" stopColor="#4FE6FF" stopOpacity="0" /></radialGradient>
            <radialGradient id="h40poolR"><stop offset="0" stopColor="#FF4A44" stopOpacity="0.9" /><stop offset="1" stopColor="#FF4A44" stopOpacity="0" /></radialGradient>
            <filter id="h40bloom" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b" />
              <feColorMatrix in="b" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.9 0" result="b2" />
              <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="4" result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 -0.1" result="n2" />
              <feComposite in="n2" in2="SourceGraphic" operator="in" result="speck" />
              <feMerge><feMergeNode in="b2" /><feMergeNode in="SourceGraphic" /><feMergeNode in="speck" /></feMerge>
            </filter>
            <filter id="h40blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40" /></filter>
            <filter id="h40rglow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="h40refl"><feGaussianBlur stdDeviation="5" /></filter>
          </defs>

          <ellipse cx="540" cy="660" rx="620" ry="460" fill="url(#h40haze)" />

          {/* reflexo no chão preto brilhante */}
          <g opacity="0.16" filter="url(#h40refl)">{sorted.map((b) => drawBox(b, true))}</g>

          {/* poças de luz sob veículos */}
          {[[25, 74], [36, 74]].map(([x, z], i) => {
            const red = i === 1 ? redPool : 0;
            return (
              <g key={i}>
                <polygon points={pts(circle(x, z, 13, 0.05, 20))} fill="url(#h40poolC)" opacity={0.75 * (1 - red)} filter="url(#h40refl)" />
                <polygon points={pts(circle(x, z, 13, 0.05, 20))} fill="url(#h40poolR)" opacity={0.85 * red} filter="url(#h40refl)" />
              </g>
            );
          })}

          {/* contorno do terreno e cerca */}
          <g stroke="#7FD4FF" fill="none" filter="url(#h40bloom)">
            <polygon points={pts([[SITE.x0, 0, SITE.z0], [SITE.x1, 0, SITE.z0], [SITE.x1, 0, SITE.z1], [SITE.x0, 0, SITE.z1]])} fill="#0A2A4A" fillOpacity="0.35" strokeWidth="1.5" strokeOpacity="0.7" />
          </g>

          {/* rota vermelha (no chão, antes das caixas) */}
          {route > 0 && (
            <g filter="url(#h40rglow)">
              <polyline points={pts(routePts)} stroke={RED} strokeWidth="26" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points={pts(routePts)} stroke="#FFD2CF" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {route < 1 && <circle cx={head[0]} cy={head[1]} r="10" fill="#FFF2F0" />}
            </g>
          )}

          {/* maquete */}
          <g filter="url(#h40bloom)">
            {sorted.map((b) => drawBox(b))}
            {/* cerca: trilhos e postes */}
            <g stroke="#9ADCFF" strokeOpacity="0.55" strokeWidth="1.3" fill="none">
              {[0, 3.2].map((y) => (
                <polyline key={y} points={pts([[SITE.x0 + 50, y, SITE.z1], [SITE.x1, y, SITE.z1], [SITE.x1, y, SITE.z0], [SITE.x0, y, SITE.z0], [SITE.x0, y, SITE.z1], [SITE.x0 + 38, y, SITE.z1]])} />
              ))}
              {Array.from({length: 30}, (_, i) => {
                const t = i / 30;
                const per = 2 * (SITE.x1 + SITE.z1);
                let d = t * per;
                let p: V3;
                if (d < SITE.x1) p = [d, 0, SITE.z1];
                else if ((d -= SITE.x1) < SITE.z1) p = [SITE.x1, 0, SITE.z1 - d];
                else if ((d -= SITE.z1) < SITE.x1) p = [SITE.x1 - d, 0, 0];
                else p = [0, 0, d - SITE.x1];
                if (p[2] === SITE.z1 && p[0] > 38 && p[0] < 50) return null;
                return <polyline key={i} points={pts([p, [p[0], 3.2, p[2]]])} />;
              })}
            </g>
            {/* doca: a porta vira vermelha quando a rota chega */}
            <polygon points={pts([[33, 0.2, 54.1], [39, 0.2, 54.1], [39, 9, 54.1], [33, 9, 54.1]])} fill={ring > 0.1 ? RED : '#0C3F78'} fillOpacity={ring > 0.1 ? 0.9 : 0.6} stroke={ring > 0.1 ? '#FF9A96' : '#BFE6FF'} strokeWidth="1.6" />
          </g>

          {/* linha de varredura no veículo */}
          {scan > 0 && scan < 1 && (() => {
            const z = 90 - scan * 34;
            return <polyline points={pts([[32, 0.8, z], [32, 12.4, z], [40, 12.4, z]])} stroke="#FFFFFF" strokeWidth="5" fill="none" filter="url(#h40rglow)" />;
          })()}
          {flash > 0 && scan < 0.05 && <g opacity={flash * 0.6} filter="url(#h40rglow)">{drawBox(BOXES[4])}</g>}
          {/* brilho vermelho do veículo */}
          {scan > 0 && <polygon points={pts(circle(36, 74, 12, 4, 16))} fill="url(#h40poolR)" opacity={0.45 * scan} filter="url(#h40refl)" />}

          {/* anel onde a rota termina */}
          {ring > 0 && (
            <g filter="url(#h40rglow)">
              <polygon points={pts(circle(36, 57, 2.2 * ring, 0.3, 18))} fill="none" stroke="#FF6E68" strokeWidth="5" />
              <polygon points={pts(circle(36, 57, 4.5 * ring, 0.3, 24))} fill="none" stroke={RED} strokeWidth="3" opacity={1 - ring * 0.5} />
            </g>
          )}

          {/* neblina baixa */}
          <g opacity="0.22" filter="url(#h40blur)">
            <ellipse cx={180 + fog(1)} cy="1060" rx="320" ry="70" fill="#6F8EA8" />
            <ellipse cx={900 + fog(2)} cy="1010" rx="300" ry="60" fill="#6F8EA8" />
            <ellipse cx={540 + fog(3)} cy="380" rx="420" ry="80" fill="#4D6D88" opacity="0.6" />
          </g>

          {/* rótulos no preto */}
          {labelAt(GATE, 1215, L1, rotuloPortao, 'l')}
          {labelAt([36, 12, 70], 1215, L2, rotuloVeiculo, 'r')}
          {labelAt(DOCK, 180, L3, rotuloDestino, 'l')}

          {/* vinheta */}
          <rect width={W} height={H} fill="url(#h40haze)" opacity="0" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
