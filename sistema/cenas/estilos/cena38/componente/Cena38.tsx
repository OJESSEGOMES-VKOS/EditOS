// cena38 · Glow World (Mundo que brilha)
// Mundo ilustrado plano e brilhante: cristal sobre ilha de grade violeta racha em duas metades e o núcleo acende.
// Tudo em SVG desenhado em código. Linha do tempo pensada em 150 quadros (5 s a 30 fps); outra duração estica igual.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Nunito';

const {fontFamily} = loadFont('normal', {weights: ['800'], subsets: ['latin', 'latin-ext']});

export type Cena38Props = {
  rotulo?: string; // o único rótulo (pílula)
  corCristal?: [string, string, string]; // aceso, meio, sombra
  corInterior?: [string, string]; // laranja, amarelo
  corEspaco?: [string, string];
  width?: number;
  height?: number;
};

const W = 1080, H = 1350;
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const sp = (f: number, start: number, cfg = {damping: 11, stiffness: 120, mass: 0.8}) =>
  spring({frame: f - start, fps: 30, config: cfg});

// estrelas e manchas fixas (pseudo-aleatório determinístico)
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const STARS = Array.from({length: 90}, (_, i) => ({x: rnd(i) * W, y: rnd(i + 99) * 620, r: 1.2 + rnd(i + 7) * 3.2, o: 0.4 + rnd(i + 3) * 0.6}));
const DOTS = Array.from({length: 160}, (_, i) => ({x: rnd(i + 500) * W, y: 560 + rnd(i + 900) * 790, r: 1 + rnd(i + 40) * 1.8}));

export const Cena38: React.FC<Cena38Props> = ({
  rotulo = 'Núcleo da IA',
  corCristal = ['#FF5FB2', '#E2369A', '#6F1A7E'],
  corInterior = ['#F36A23', '#FACB22'],
  corEspaco = ['#140C40', '#2A1E78'],
  width = W,
  height = H,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const f = frame * (150 / durationInFrames);
  const [cLit, cMid, cSh] = corCristal;
  const [cOr, cYe] = corInterior;

  // câmera: já empurrando no quadro 0, para em ~4 s
  const push = interpolate(f, [0, 118], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const layer = (depth: number) => `translate(540 700) scale(${1 + push * 0.1 * depth}) translate(-540 -700) translate(0 ${-push * 18 * depth})`;

  // flutuação do cristal (para no final)
  const still = interpolate(f, [100, 120], [1, 0], cl);
  const bob = Math.sin(f / 9) * 8 * still;

  // costura de luz 25-37, tremida 36-44, abre 42+
  const seam = interpolate(f, [24, 36], [0, 1], cl);
  const shake = f > 34 && f < 45 ? Math.sin(f * 2.7) * 5 : 0;
  const squash = 1 - 0.06 * Math.sin(interpolate(f, [36, 44], [0, Math.PI], cl));
  const open = sp(f, 42, {damping: 9, stiffness: 110, mass: 0.9});
  const turn = sp(f, 46, {damping: 12, stiffness: 90, mass: 1});

  // núcleo acende
  const ign = sp(f, 54, {damping: 8, stiffness: 120, mass: 0.7});
  const traces = interpolate(f, [58, 80], [0, 1], {...cl, easing: Easing.out(Easing.quad)});
  const orbit = interpolate(f, [64, 84], [0, 1], {...cl, easing: Easing.inOut(Easing.quad)});
  const dot1 = sp(f, 80), dot2 = sp(f, 86);
  const ride1 = interpolate(f, [80, 104], [0.15, 0.62], {...cl, easing: Easing.out(Easing.cubic)});
  const ride2 = interpolate(f, [86, 108], [0.9, 0.28], {...cl, easing: Easing.out(Easing.cubic)});
  const pill = sp(f, 72, {damping: 9, stiffness: 140, mass: 0.6});
  const warm = interpolate(f, [92, 100], [0, 1], cl); // anel vira quente
  const powerOut = interpolate(f, [96, 118], [0, 1], {...cl, easing: Easing.out(Easing.quad)});
  const pulseIn = f < 92 ? (f % 30) / 30 : 0;

  // geometria do cristal (centro 0,0)
  const T = [8, -260], UL = [-158, -128], LL = [-150, 52], B = [0, 250], LR = [150, 52], UR = [160, -128], MT = [8, -60];
  const P = (...pts: number[][]) => pts.map((p) => p.join(',')).join(' ');
  const leftX = -open * 120 - turn * 20;
  const rightX = open * 190;
  const leftRot = -open * 8;
  const rightRot = open * 14;
  const faceW = turn * 0.88; // face cortada esquerda abre de 0 a 1 em scaleX
  const isOpen = f >= 43;

  // pontos ao longo da órbita (elipse) para os pontinhos
  const orb = (t: number) => {
    const a = Math.PI * (0.1 + t * 0.8);
    return [Math.cos(a) * -105, 35 + Math.sin(a) * 68];
  };

  const s = Math.max(width / W, height / H);
  return (
    <AbsoluteFill style={{background: corEspaco[0], overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: W, height: H, left: (width - W * s) / 2, top: (height - H * s) / 2, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <linearGradient id="g38sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={corEspaco[0]} />
              <stop offset="1" stopColor={corEspaco[1]} />
            </linearGradient>
            <radialGradient id="g38bloom">
              <stop offset="0" stopColor="#FFF6D0" stopOpacity="0.95" />
              <stop offset="0.25" stopColor={cYe} stopOpacity="0.55" />
              <stop offset="0.6" stopColor={cOr} stopOpacity="0.18" />
              <stop offset="1" stopColor={cOr} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="g38halo">
              <stop offset="0" stopColor={cLit} stopOpacity="0.45" />
              <stop offset="1" stopColor={cLit} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="g38core">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.35" stopColor="#FFF4B8" />
              <stop offset="1" stopColor={cYe} stopOpacity="0" />
            </radialGradient>
            <filter id="g38rays" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="22" /></filter>
            <filter id="g38soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
            <filter id="g38glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <pattern id="g38grid" width="70" height="70" patternUnits="userSpaceOnUse" patternTransform="translate(540 600) scale(1 0.55) rotate(45)">
              <rect width="70" height="70" fill="none" stroke="#2A1D8D" strokeWidth="3" />
            </pattern>
            <clipPath id="g38island"><path d="M-60 760 L540 470 L1140 760 L1140 1350 L-60 1350 Z" /></clipPath>
          </defs>

          <rect width={W} height={H} fill="url(#g38sky)" />

          {/* camada distante: estrelas, nuvens violetas, rochas */}
          <g transform={layer(0.25)}>
            {STARS.map((st, i) => (
              <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#FFFFFF" opacity={st.o * (0.75 + 0.25 * Math.sin(f / 7 + i) * still)} />
            ))}
            <path d="M-40 330 Q160 270 360 320 Q560 360 760 300 Q940 250 1120 300 L1120 420 L-40 420 Z" fill="#2E2287" opacity="0.55" />
            <path d="M-40 400 Q220 350 480 390 Q760 430 1120 370 L1120 520 L-40 520 Z" fill="#33268F" opacity="0.5" />
            <g fill="#6B5BC9">
              <ellipse cx="128" cy="140" rx="34" ry="30" /><ellipse cx="900" cy="236" rx="26" ry="22" /><ellipse cx="1012" cy="74" rx="18" ry="16" /><ellipse cx="460" cy="40" rx="14" ry="12" />
            </g>
            <g fill="#8C7DE0">
              <ellipse cx="120" cy="132" rx="16" ry="12" /><ellipse cx="894" cy="229" rx="12" ry="9" />
            </g>
          </g>

          {/* raios suaves atrás do núcleo */}
          <g opacity={ign * 0.55} transform={`translate(${540 + leftX * 1.2} ${575 + bob})`}>
            {Array.from({length: 9}, (_, i) => (
              <path key={i} d="M0 0 L-46 -560 L46 -560 Z" fill="#FFD9A0" opacity={0.1} transform={`rotate(${-80 + i * 20})`} filter="url(#g38rays)" />
            ))}
          </g>

          {/* ilha de grade */}
          <g transform={layer(0.55)}>
            <path d="M-60 760 L540 470 L1140 760 L1140 1350 L-60 1350 Z" fill="#3C30A0" />
            <rect x="-60" y="400" width="1200" height="1000" fill="url(#g38grid)" clipPath="url(#g38island)" />
            <path d="M-60 760 L540 470 L1140 760" fill="none" stroke="#5A4CC2" strokeWidth="6" />
            {DOTS.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#8E80E6" opacity="0.35" clipPath="url(#g38island)" />
            ))}
            {/* luz quente derramando na grade */}
            <ellipse cx={540 + leftX * 0.4} cy="980" rx={430 * ign} ry={230 * ign} fill="url(#g38bloom)" opacity={0.7 * ign} />
            {/* sombra do cristal na grade */}
            <ellipse cx="540" cy="1000" rx="180" ry="44" fill="#21176E" opacity="0.6" filter="url(#g38soft)" />

            {/* cabos */}
            {[
              'M370 1120 C300 1160 260 1220 140 1220 L-40 1220',
              'M710 1120 C780 1160 820 1220 940 1220 L1120 1220',
            ].map((d, i) => (
              <g key={i}>
                <path d={d} fill="none" stroke="#231A6E" strokeWidth="22" strokeLinecap="round" />
                <path d={d} fill="none" stroke="#3A2E9A" strokeWidth="8" strokeLinecap="round" />
                {/* pulsos que entram */}
                {f < 92 && (
                  <path d={d} fill="none" stroke="#3BE3C6" strokeWidth="10" strokeLinecap="round" pathLength={1}
                    strokeDasharray="0.07 0.93" strokeDashoffset={-(1 - pulseIn) * 0.9 - 0.05} filter="url(#g38glow)" />
                )}
                {/* força saindo, quente */}
                <path d={d} fill="none" stroke="#FFB43A" strokeWidth="9" strokeLinecap="round" pathLength={1}
                  strokeDasharray={`${powerOut} 1`} filter="url(#g38glow)" opacity={powerOut > 0 ? 1 : 0} />
              </g>
            ))}

            {/* pedestal */}
            <g transform="translate(540 1070) scale(1.25)">
              <ellipse cx="0" cy="34" rx="150" ry="50" fill="#251B7A" />
              <rect x="-150" y="-10" width="300" height="44" fill="#2E238C" />
              <ellipse cx="0" cy="-10" rx="150" ry="50" fill="#5446C4" />
              <ellipse cx="0" cy="-30" rx="104" ry="36" fill="#2E238C" />
              <rect x="-104" y="-52" width="208" height="22" fill="#2E238C" />
              <ellipse cx="0" cy="-52" rx="104" ry="36" fill="#6556D2" />
              <path d="M-140 -28 A150 50 0 0 1 -60 -56" stroke="#8A7CF0" strokeWidth="6" fill="none" strokeLinecap="round" />
              <ellipse cx="0" cy="-54" rx="70" ry="24" fill="#22186E" />
              <ellipse cx="0" cy="-54" rx="70" ry="24" fill="none" stroke={warm > 0.5 ? '#FFB43A' : '#3BE3C6'} strokeWidth="7" filter="url(#g38glow)"
                transform={`scale(${1 + Math.sin(warm * Math.PI) * 0.12})`} />
            </g>
          </g>

          {/* cristal */}
          <g transform={`translate(${540 + shake} ${575 + bob - push * 20}) scale(${1.12 + push * 0.08})`}>
            <ellipse cx="0" cy="0" rx="330" ry="360" fill="url(#g38halo)" opacity={1 - ign * 0.4} />
            {/* metade direita */}
            <g transform={`translate(${rightX} ${open * 30}) rotate(${rightRot}) scale(${1 - open * 0.3} ${squash})`}>
              {isOpen && <polygon points={P(T, MT, B)} fill={cYe} transform="translate(-14 0)" />}
              <polygon points={P(T, UR, MT)} fill={cLit} />
              <polygon points={P(MT, UR, LR, B)} fill={cMid} />
              <polygon points={P(UR, [176, -60], LR)} fill={cSh} opacity="0.65" />
              <path d="M60 -150 L110 -136" stroke="#FFD3EA" strokeWidth="7" strokeLinecap="round" />
              {DOTS.slice(0, 10).map((d, i) => <circle key={i} cx={30 + (d.x % 100)} cy={-60 + (d.y % 230)} r="2.4" fill="#FFB6DC" opacity="0.6" />)}
            </g>
            {/* metade esquerda: casca */}
            <g transform={`translate(${leftX} 0) rotate(${leftRot}) scale(1 ${squash})`}>
              <g transform={`scale(${1 - faceW * 0.2} 1)`}>
                {!isOpen || faceW < 0.98 ? (
                  <g transform={`scale(${1 - faceW} 1)`}>
                    <polygon points={P(T, UL, MT)} fill={cLit} />
                    <polygon points={P(UL, LL, B, MT)} fill={cMid} />
                    <polygon points={P(UL, [-176, -40], LL)} fill={cLit} opacity="0.7" />
                    <path d="M-120 -140 L-70 -154" stroke="#FFE1F0" strokeWidth="8" strokeLinecap="round" />
                    {DOTS.slice(10, 22).map((d, i) => <circle key={i} cx={-130 + (d.x % 110)} cy={-50 + (d.y % 220)} r="2.4" fill="#FFB6DC" opacity="0.6" />)}
                  </g>
                ) : null}
                {!isOpen && (
                  <g>
                    {/* lado direito ainda inteiro antes da abertura é desenhado pela metade direita */}
                  </g>
                )}
              </g>
              {/* face cortada */}
              {isOpen && (
                <g transform={`scale(${faceW} 1)`}>
                  <polygon points={P(T, UL, LL, B, LR, UR)} fill={cMid} transform="scale(1.07)" />
                  <polygon points={P(T, UL, LL, B, LR, UR)} fill={cOr} />
                  <polygon points={P(T, UL, LL, B, LR, UR)} fill={cYe} transform="scale(0.9)" />
                  <path d="M-170 -128 L-160 52 L-8 268 L-22 270 L-176 56 L-186 -126 Z" fill={cLit} />
                  {/* traços de circuito */}
                  <g stroke="#E58A1C" strokeWidth="4" fill="none" strokeLinecap="round" opacity={0.9}>
                    {['M0 0 L-40 -60 L-40 -150', 'M0 0 L60 -40 L90 -120', 'M0 0 L-80 30 L-110 -10', 'M0 0 L70 60 L80 150', 'M0 0 L-30 90 L-60 160', 'M0 0 L100 10 L120 -20'].map((d, i) => (
                      <path key={i} d={d} pathLength={1} strokeDasharray={`${traces} 1`} />
                    ))}
                  </g>
                  {/* núcleo */}
                  <circle cx="0" cy="0" r={150 * ign} fill="url(#g38core)" />
                  <ellipse cx="0" cy="0" rx={34 * ign} ry={46 * ign} fill="#FFFFFF" />
                  {/* órbitas */}
                  <ellipse cx="0" cy="35" rx="105" ry="68" fill="none" stroke="#6F1A7E" strokeWidth="6" pathLength={1} strokeDasharray={`${orbit * 0.5} 1`} strokeDashoffset={-0.03} />
                  <ellipse cx="0" cy="20" rx="78" ry="44" fill="none" stroke="#3BE3C6" strokeWidth="6" pathLength={1} strokeDasharray={`${orbit * 0.5} 1`} strokeDashoffset={-0.03} />
                  <circle cx={orb(ride1)[0]} cy={orb(ride1)[1]} r={11 * dot1} fill="#FF7FC6" stroke="#6F1A7E" strokeWidth="3" />
                  <circle cx={Math.cos(Math.PI * (0.1 + ride2 * 0.8)) * -78} cy={20 + Math.sin(Math.PI * (0.1 + ride2 * 0.8)) * 44} r={10 * dot2} fill="#3BE3C6" stroke="#167A6C" strokeWidth="3" />
                </g>
              )}
            </g>
            {/* costura de luz */}
            {f < 46 && seam > 0 && (
              <path d={`M8 -260 L4 -150 L14 -40 L-2 70 L6 ${-260 + seam * 510}`} stroke="#FFF6E0" strokeWidth="6" fill="none" pathLength={1} strokeDasharray={`${seam} 1`} filter="url(#g38glow)" />
            )}
          </g>

          {/* pílula do rótulo */}
          <g transform={`translate(${410} ${236}) scale(${pill})`} opacity={pill > 0.02 ? 1 : 0}>
            <rect x={-20} y={-38} width={rotulo.length * 27 + 90} height={76} rx={38} fill="#1A1150" />
            <circle cx={22} cy={0} r={11} fill="#FACB22" />
            <text x={46} y={16} fontFamily={fontFamily} fontWeight={800} fontSize={46} fill="#FFFFFF">{rotulo}</text>
          </g>

          {/* camada próxima: rochas e plantas escuras, passam mais rápido */}
          <g transform={layer(1.6)}>
            <path d="M-80 1350 Q-60 1180 80 1200 Q170 1210 200 1290 Q230 1350 240 1350 Z" fill="#150D45" />
            <path d="M880 1350 Q900 1210 1010 1200 Q1130 1195 1160 1350 Z" fill="#150D45" />
            {[[-20, 0], [10, -10], [40, -6], [70, 4]].map(([dx, rot], i) => (
              <path key={i} d="M0 0 Q-30 -70 -6 -120 Q20 -70 0 0 Z" fill="#1E1458" transform={`translate(${140 + dx} 1210) rotate(${-35 + i * 22 + rot + Math.sin(f / 14 + i) * 2 * still})`} />
            ))}
            <ellipse cx="1000" cy="1215" rx="40" ry="14" fill="#2A1F6E" />
          </g>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
