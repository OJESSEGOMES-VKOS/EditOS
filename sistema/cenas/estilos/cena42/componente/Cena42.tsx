// cena42 · Ink Doodle (Rabisco de nanquim)
// Explicativo em rabisco: tinta preta fina com tremor de mão (line boil), pessoa de palito com cabeça redonda branca,
// cenário plano de lado como um palco. Rajada de vento, um celular aparece, um X vermelho o risca, ele dá de ombros.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/PatrickHand';

const {fontFamily} = loadFont('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});

export type Cena42Props = {
  rotulo?: string; // o único rótulo manuscrito
  corCabelo?: string;
  corCeu?: string;
  width?: number;
  height?: number;
};

const W = 1080, H = 1350;
const INK = '#1D1B1A';
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const sp = (f: number, s: number, c = {damping: 10, stiffness: 150, mass: 0.7}) => spring({frame: f - s, fps: 30, config: c});

export const Cena42: React.FC<Cena42Props> = ({
  rotulo = 'ANTES DO CELULAR',
  corCabelo = '#6A4126',
  corCeu = '#A9E2EC',
  width = W,
  height = H,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const f = frame * (150 / durationInFrames);

  const hold = f >= 118; // último segundo parado, sem boil
  const boilSeed = hold ? 1 : 1 + Math.floor(f / 3) % 4;
  const push = interpolate(f, [0, 118], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});

  // vento
  const gust = interpolate(f, [16, 30, 52, 62], [0.15, 1, 1, 0], cl) + (f < 16 ? 0.15 : 0);
  const grab = interpolate(f, [22, 30, 60, 70], [0, 1, 1, 0], {...cl, easing: Easing.inOut(Easing.quad)});
  const phone = sp(f, 56, {damping: 8, stiffness: 160, mass: 0.6});
  const x1 = interpolate(f, [66, 71], [0, 1], cl);
  const x2 = interpolate(f, [72, 77], [0, 1], cl);
  const knock = (f >= 66 && f < 72 ? Math.sin((f - 66) * 1.4) * 6 : 0) + (f >= 72 && f < 78 ? Math.sin((f - 72) * 1.4) * 6 : 0);
  const shrug = sp(f, 80, {damping: 9, stiffness: 140, mass: 0.7});
  const wind = gust * (hold ? 0 : 1);
  const sway = Math.sin(f / 4) * wind;

  // objetos voando (cada um mais rápido)
  const flyers = [
    {k: 'page', t0: 0, dur: 34, y0: 330, y1: 250, front: false},
    {k: 'leaf', t0: 4, dur: 40, y0: 700, y1: 640, front: true},
    {k: 'leaf', t0: 18, dur: 26, y0: 180, y1: 120, front: false},
    {k: 'page', t0: 24, dur: 22, y0: 780, y1: 720, front: true},
    {k: 'hat', t0: 30, dur: 20, y0: 330, y1: 300, front: false},
    {k: 'leaf', t0: 36, dur: 16, y0: 520, y1: 470, front: true},
    {k: 'page', t0: 42, dur: 15, y0: 640, y1: 600, front: false},
    {k: 'leaf', t0: 46, dur: 13, y0: 260, y1: 230, front: true},
  ];
  const Flyer = ({k, t}: {k: string; t: number}) => {
    const rot = t * (k === 'hat' ? 260 : 540);
    return (
      <g transform={`rotate(${rot})`}>
        {k === 'page' && (
          <g>
            <path d="M-38 -48 L32 -52 L38 46 L-34 50 Z" fill="#FFFFFF" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
            {[-30, -14, 2, 18, 32].map((y) => <path key={y} d={`M-24 ${y} L24 ${y - 2}`} stroke={INK} strokeWidth="2.5" />)}
          </g>
        )}
        {k === 'leaf' && <path d="M-22 0 Q0 -16 24 0 Q0 16 -22 0 Z M-22 0 L24 0" fill="#C77B2A" stroke={INK} strokeWidth="3" />}
        {k === 'hat' && (
          <g>
            <path d="M-56 12 Q0 -2 56 12 Q0 26 -56 12 Z" fill="#6B4A36" stroke={INK} strokeWidth="3.5" />
            <path d="M-30 10 Q-30 -36 0 -38 Q30 -36 30 10 Z" fill="#7A5640" stroke={INK} strokeWidth="3.5" />
            <path d="M-30 0 Q0 6 30 0" stroke="#3B2A1F" strokeWidth="6" fill="none" />
          </g>
        )}
      </g>
    );
  };
  const renderFlyers = (front: boolean) =>
    flyers.filter((fl) => fl.front === front).map((fl, i) => {
      const t = (f - fl.t0) / fl.dur;
      if (t <= 0 || t >= 1 || hold) return null;
      const x = mix(-120, 1200, t);
      const y = mix(fl.y0, fl.y1, t) + Math.sin(t * 9 + i) * 26;
      return (
        <g key={i} transform={`translate(${x} ${y})`}>
          {[-14, 0, 14].map((dy) => <path key={dy} d={`M-70 ${dy} L-150 ${dy + 4}`} stroke={INK} strokeWidth="2.5" strokeLinecap="round" />)}
          <Flyer k={fl.k} t={t} />
        </g>
      );
    });

  // pose do personagem
  const head = {x: 540 + knock * 0, y: 585};
  const handL = [mix(mix(468, 418, grab), 330, shrug), mix(mix(890, 560, grab), 860, shrug)];
  const handR = [mix(mix(612, 662, grab), 750, shrug), mix(mix(890, 560, grab), 860, shrug)];
  const elbowL = [mix(mix(470, 380, grab), 400, shrug), mix(mix(810, 640, grab), 870, shrug)];
  const elbowR = [mix(mix(610, 700, grab), 680, shrug), mix(mix(810, 640, grab), 870, shrug)];
  const hairBlow = wind * 0.35 * (f < 70 ? 1 : 0);

  const s = Math.max(width / W, height / H);
  return (
    <AbsoluteFill style={{background: corCeu, overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: W, height: H, left: (width - W * s) / 2, top: (height - H * s) / 2, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <filter id="i42boil" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={boilSeed} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <g filter="url(#i42boil)" transform={`translate(540 700) scale(${1 + push * 0.05}) translate(-540 -700)`} strokeLinecap="round" strokeLinejoin="round">
            {/* céu e nuvens */}
            <rect x="-60" y="-60" width={W + 120} height="980" fill={corCeu} />
            {[[150, 140, 1], [900, 70, 0.9], [960, 1000, 0]].filter((c) => c[2]).map(([x, y, sc], i) => (
              <path key={i} transform={`translate(${x} ${y}) scale(${sc})`} d="M-80 30 Q-90 -10 -50 -14 Q-40 -50 0 -46 Q40 -60 60 -20 Q100 -16 90 30 Z" fill="#FFFFFF" stroke={INK} strokeWidth="3.5" />
            ))}
            {/* linha de morro e grama */}
            <path d="M-60 880 Q200 850 540 870 Q860 885 1140 860 L1140 1000 L-60 1000 Z" fill="#8CC56A" stroke={INK} strokeWidth="3.5" />
            <rect x="-60" y="900" width={W + 120} height="100" fill="#7DB25C" />
            <path d="M-60 900 L1140 900" stroke={INK} strokeWidth="3.5" />
            {Array.from({length: 14}, (_, i) => <path key={i} d={`M${40 + i * 80} 960 l6 -14 l6 14`} stroke="#4E7F38" strokeWidth="3" fill="none" />)}
            {/* calçada */}
            <rect x="-60" y="998" width={W + 120} height="242" fill="#D2CEC5" />
            <path d="M-60 998 L1140 998 M-60 1100 L1140 1100 M-60 1238 L1140 1238" stroke={INK} strokeWidth="3" />
            {Array.from({length: 9}, (_, i) => <path key={i} d={`M${60 + i * 130} 998 L${50 + i * 130} 1100 M${110 + i * 130} 1100 L${100 + i * 130} 1238`} stroke="#9F9A90" strokeWidth="2.5" />)}
            {/* rua */}
            <rect x="-60" y="1240" width={W + 120} height="140" fill="#7E848B" />
            {Array.from({length: 8}, (_, i) => <rect key={i} x={20 + i * 150} y="1300" width="80" height="12" fill="#FFFFFF" />)}

            {/* árvore (curva com o vento) */}
            <g>
              <path d="M110 1000 Q120 800 128 640 L150 640 Q160 800 170 1000 Z" fill="#7A4B2C" stroke={INK} strokeWidth="3.5" />
              <path d="M136 760 Q90 700 70 660 M150 720 Q200 680 220 640" stroke={INK} strokeWidth="3.5" fill="none" />
              <g transform={`translate(140 640) skewX(${(-4 - sway * 4 - wind * 10)}) translate(-140 -640)`}>
                <path d="M140 300 Q190 290 210 330 Q260 330 270 380 Q310 410 290 460 Q310 510 270 540 Q260 590 210 590 Q180 630 130 610 Q80 630 50 590 Q0 580 0 530 Q-30 490 0 450 Q-10 400 30 370 Q40 320 90 320 Q110 290 140 300 Z" fill="#6CA555" stroke={INK} strokeWidth="3.5" />
                {[[90, 410], [180, 380], [220, 480], [70, 510], [150, 540]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q20 -18 40 0`} stroke={INK} strokeWidth="3" fill="none" />)}
              </g>
            </g>

            {/* placa de ônibus (chacoalha) */}
            <g transform={`rotate(${sway * 3} 950 1110)`}>
              <path d="M950 560 L950 1110" stroke="#9AA0A6" strokeWidth="12" />
              <path d="M944 560 L944 1110 M956 560 L956 1110" stroke={INK} strokeWidth="3" />
              <rect x="938" y="1100" width="24" height="14" fill="#555" stroke={INK} strokeWidth="3" />
              <rect x="870" y="450" width="160" height="120" rx="14" fill="#FFFFFF" stroke={INK} strokeWidth="3.5" />
              <rect x="900" y="480" width="100" height="56" rx="10" fill="#F4C53C" stroke={INK} strokeWidth="3" />
              {[912, 940, 968].map((x) => <rect key={x} x={x} y="490" width="20" height="18" fill="#BEE6F0" stroke={INK} strokeWidth="2" />)}
              <circle cx="920" cy="538" r="8" fill={INK} /><circle cx="980" cy="538" r="8" fill={INK} />
              <rect x="925" y="620" width="50" height="80" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
              {[640, 660, 680].map((y) => <path key={y} d={`M935 ${y} L965 ${y}`} stroke={INK} strokeWidth="2.5" />)}
            </g>

            {/* vento: traços curvos longos */}
            {!hold && wind > 0.3 && [[200, 300], [420, 460], [120, 760], [700, 220], [640, 700]].map(([x, y], i) => {
              const ph = ((f * 0.06 + i * 0.23) % 1);
              return (
                <path key={i} d={`M${x - 140 + ph * 260} ${y} q60 -10 120 0 t120 0 q30 6 20 -16 q-14 -10 -20 6`} stroke={INK} strokeWidth="2.5" fill="none" opacity={wind * Math.sin(ph * Math.PI)} />
              );
            })}

            {renderFlyers(false)}

            {/* banco */}
            <g>
              <path d="M290 920 L290 1060 M790 920 L790 1060 M320 900 L320 1060 M760 900 L760 1060" stroke="#3B3B3B" strokeWidth="16" />
              {[[250, 700], [250, 760]].map(([x, y], i) => <rect key={i} x={x} y={y} width="580" height="40" rx="6" fill="#B07A4C" stroke={INK} strokeWidth="3.5" />)}
              <rect x="230" y="850" width="620" height="44" rx="6" fill="#B07A4C" stroke={INK} strokeWidth="3.5" />
              <path d="M280 700 L280 850 M800 700 L800 850" stroke="#3B3B3B" strokeWidth="14" />
              <path d="M270 718 L600 716 M300 778 L780 776 M260 870 L820 868" stroke="#8A5A33" strokeWidth="2.5" />
            </g>

            {/* personagem (traço mais grosso) */}
            <g stroke={INK} strokeWidth="6.5" fill="none">
              {/* corpo e pernas */}
              <path d={`M540 700 L540 860`} />
              <path d="M540 860 L470 870 L480 1050 M540 860 L610 870 L600 1050" />
              <ellipse cx="470" cy="1056" rx="24" ry="13" fill={INK} />
              <ellipse cx="610" cy="1056" rx="24" ry="13" fill={INK} />
              {/* braços */}
              <path d={`M540 740 L${elbowL[0]} ${elbowL[1]} L${handL[0]} ${handL[1]}`} />
              <path d={`M540 740 L${elbowR[0]} ${elbowR[1]} L${handR[0]} ${handR[1]}`} />
            </g>
            {[handL, handR].map((h, i) => (
              <g key={i} transform={`translate(${h[0]} ${h[1]}) scale(${i ? -1 : 1} 1)`}>
                {shrug > 0.5 ? (
                  <path d="M0 0 q-14 -8 -26 -2 q-6 -18 6 -22 q2 -16 16 -12 q8 -12 18 -2 q12 -6 14 8 q8 14 -4 26 Z" fill="#FFFFFF" stroke={INK} strokeWidth="4" />
                ) : (
                  <circle cx="0" cy="0" r="15" fill="#FFFFFF" stroke={INK} strokeWidth="4" />
                )}
              </g>
            ))}

            {/* cabeça */}
            <g transform={`translate(${head.x} ${head.y})`}>
              <circle r="128" fill="#FFFFFF" stroke={INK} strokeWidth="6.5" />
              {/* olhos */}
              {grab > 0.5 ? (
                <g stroke={INK} strokeWidth="6" fill="none"><path d="M-62 -6 L-30 4 L-62 14" /><path d="M58 -6 L26 4 L58 14" /></g>
              ) : shrug > 0.4 ? (
                <g>
                  <ellipse cx="-44" cy="0" rx="13" ry="18" fill={INK} /><ellipse cx="40" cy="0" rx="13" ry="18" fill={INK} />
                  <path d="M-66 -46 Q-44 -60 -22 -48 M18 -48 Q40 -60 62 -46" stroke={INK} strokeWidth="5" fill="none" />
                  <ellipse cx="-2" cy="60" rx={12 * shrug} ry={16 * shrug} fill="#B3443A" stroke={INK} strokeWidth="4" />
                </g>
              ) : (
                <g>
                  <path d="M-64 0 Q-44 -6 -24 0 Q-44 14 -64 0 Z" fill={INK} /><path d="M20 0 Q40 -6 60 0 Q40 14 20 0 Z" fill={INK} />
                  <path d="M-66 -10 L-22 -12 M18 -12 L62 -10" stroke={INK} strokeWidth="5" />
                  <path d="M-62 -34 L-28 -30 M24 -30 L58 -34" stroke={INK} strokeWidth="5" />
                  <path d="M-16 58 L18 56" stroke={INK} strokeWidth="5" />
                </g>
              )}
              {grab > 0.5 && <ellipse cx="0" cy="58" rx="12" ry="9" fill={INK} />}
              {/* cabelo bagunçado */}
              <g transform={`skewX(${hairBlow * 30 + Math.sin(f / 2) * wind * 4}) translate(${hairBlow * 20} 0)`}>
                <path
                  d="M-140 -10 Q-150 -60 -120 -70 Q-140 -110 -96 -110 Q-100 -150 -56 -140 Q-50 -180 -10 -158 Q10 -190 40 -156 Q80 -176 90 -136 Q140 -140 120 -96 Q160 -80 132 -46 Q156 -20 130 0 Q118 -40 100 -60 Q90 -36 70 -44 Q60 -80 30 -70 Q10 -96 -10 -70 Q-30 -96 -50 -66 Q-70 -84 -84 -56 Q-110 -60 -112 -30 Q-130 -40 -140 -10 Z"
                  fill={corCabelo} stroke={INK} strokeWidth="4.5" />
                {[[-90, -80], [-40, -110], [10, -120], [60, -100], [100, -70]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q10 -24 26 -20`} stroke="#3E2414" strokeWidth="3.5" fill="none" />)}
              </g>
            </g>

            {renderFlyers(true)}

            {/* celular e X vermelho */}
            <g transform={`translate(${800 + knock} 300) rotate(${14 + knock}) scale(${phone})`} opacity={phone > 0.02 ? 1 : 0}>
              <rect x="-62" y="-110" width="124" height="220" rx="22" fill="#3A3F48" stroke={INK} strokeWidth="5" />
              <rect x="-50" y="-90" width="100" height="180" rx="10" fill="#6FA8E8" stroke={INK} strokeWidth="3" />
              {Array.from({length: 12}, (_, i) => (
                <rect key={i} x={-40 + (i % 3) * 30} y={-78 + Math.floor(i / 3) * 34} width="20" height="20" rx="5"
                  fill={['#F25A5A', '#F7C341', '#5BC46A', '#9B6BE0', '#F28AC1', '#4DB6E0'][i % 6]} stroke={INK} strokeWidth="2" />
              ))}
              <path d="M-80 -90 L80 90" stroke="#E1191F" strokeWidth="18" pathLength={1} strokeDasharray={`${x1} 1`} />
              <path d="M80 -90 L-80 90" stroke="#E1191F" strokeWidth="18" pathLength={1} strokeDasharray={`${x2} 1`} />
            </g>
          </g>

          {/* rótulo manuscrito (fixo) */}
          <g transform="translate(540 76)">
            <path d="M-200 -42 L202 -44 L204 40 L-198 42 Z" fill="#FFFFFF" stroke={INK} strokeWidth="4" filter="url(#i42boil)" />
            <text x="0" y="16" textAnchor="middle" fontFamily={fontFamily} fontSize={50} letterSpacing={2} fill={INK}>{rotulo}</text>
          </g>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
