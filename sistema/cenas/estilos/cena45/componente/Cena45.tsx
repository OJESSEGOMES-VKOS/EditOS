// cena45 · POV Doodle (Rabisco em primeira pessoa)
// Rabisco pintado: traço de marcador marrom grosso e tremido, cabeça branca redonda com sobrancelhas que atuam,
// cores apagadas e textura de pincel seco. Copos voam pra pilha, as folhas do calendário arrancam até DIA 100.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Mansalva';

const {fontFamily} = loadFont('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});

export type Cena45Props = {
  legenda?: string;
  palavraDia?: string;
  diaFinal?: number;
  corParede?: string;
  corMoletom?: [string, string];
  width?: number;
  height?: number;
};

const W = 1080, H = 1350;
const INK = '#33201C';
const BRICK = '#9A443C';
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const N_CUPS = 13;
const CUP_H = 52;

export const Cena45: React.FC<Cena45Props> = ({
  legenda = 'Sua vida de fundador',
  palavraDia = 'DIA',
  diaFinal = 100,
  corParede = '#B2B392',
  corMoletom = ['#5B8E86', '#4A776F'],
  width = W,
  height = H,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const f = frame * (150 / durationInFrames);
  const hold = f >= 120;

  // folhas arrancadas: devagar, depois corrida que acelera e freia
  const last = diaFinal - 1;
  const tearT = (k: number) => {
    if (k === 1) return 26;
    if (k === 2) return 36;
    if (k === last) return 74;
    return 44 + 28 * Easing.inOut(Easing.cubic)((k - 3) / Math.max(1, last - 3));
  };
  let day = 1;
  for (let k = 1; k <= last; k++) if (f >= tearT(k)) day = k + 1;
  const final = day >= diaFinal;
  const punch = spring({frame: f - 75, fps: 30, config: {damping: 7, stiffness: 200, mass: 0.6}});

  // rosto: determinado -> preocupado -> careta
  const worry = interpolate(f, [30, 72], [0, 1], cl);
  const panic = spring({frame: f - 76, fps: 30, config: {damping: 10, stiffness: 170, mass: 0.6}});
  const sweat1 = spring({frame: f - 88, fps: 30, config: {damping: 9, stiffness: 160}});
  const sweat2 = spring({frame: f - 96, fps: 30, config: {damping: 9, stiffness: 160}});
  const typing = f < 92 && !hold;
  const tap = typing ? Math.sin(f * 1.6) * 8 : 0;
  const writeIn = interpolate(f, [0, 16], [0, 1], cl);

  // copos: cada um lançado de fora e caindo na pilha
  const cupT = (i: number) => (i < 2 ? -10 : -4 + i * 6.4);
  const landed = Array.from({length: N_CUPS}, (_, i) => f >= cupT(i) + 9).filter(Boolean).length;
  const swayKick = Array.from({length: N_CUPS}, (_, i) => {
    const t = f - (cupT(i) + 9);
    return t >= 0 && !hold ? Math.sin(t * 0.7) * Math.exp(-t / 9) * (i === N_CUPS - 1 ? 5 : 2.5) : 0;
  }).reduce((a, b) => a + b, 0);

  const Cup = ({sq = 1}: {sq?: number}) => (
    <g transform={`scale(${1.3 * (2 - sq)} ${1.3 * sq})`}>
      <path d="M-32 -40 L32 -40 L26 0 L-26 0 Z" fill="#F2EFE6" stroke={INK} strokeWidth="7" strokeLinejoin="round" />
      <path d="M-30 -28 L30 -28 L28 -14 L-28 -14 Z" fill="#8E6F55" stroke={INK} strokeWidth="5" />
      <rect x="-36" y="-48" width="72" height="10" rx="4" fill="#F2EFE6" stroke={INK} strokeWidth="6" />
    </g>
  );

  const CalPage = ({n, red}: {n: number; red?: boolean}) => (
    <g>
      <path d="M-118 -10 L118 -8 L116 252 L-116 250 Z" fill="#F1EEE6" stroke={INK} strokeWidth="8" strokeLinejoin="round" />
      <text x="0" y="56" textAnchor="middle" fontFamily={fontFamily} fontSize={46} fill={INK}>{palavraDia}</text>
      <text x="0" y="180" textAnchor="middle" fontFamily={fontFamily} fontSize={n >= 100 ? 108 : 124} fill={red ? BRICK : INK}>{n}</text>
    </g>
  );

  const brows = (side: -1 | 1) => {
    // ângulo: determinado (dentro pra baixo) -> preocupado (dentro pra cima) -> lá em cima
    const ang = mix(mix(-18, 16, worry), 6, panic) * side;
    const lift = mix(0, -26, panic);
    return <path d={`M${side * 30} ${-70 + lift} Q${side * 62} ${-82 + lift} ${side * 96} ${-74 + lift}`} stroke={INK} strokeWidth="15" fill="none" strokeLinecap="round" transform={`rotate(${ang} ${side * 62} ${-74 + lift})`} />;
  };

  const s = Math.max(width / W, height / H);
  return (
    <AbsoluteFill style={{background: corParede, overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: W, height: H, left: (width - W * s) / 2, top: (height - H * s) / 2, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <filter id="p45marker" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="4" result="w" />
              <feDisplacementMap in="SourceGraphic" in2="w" scale="7" xChannelSelector="R" yChannelSelector="G" result="d" />
              <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="1" seed="7" result="r" />
              <feDisplacementMap in="d" in2="r" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="p45paper" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.09" numOctaves="4" seed="12" result="n" />
              <feColorMatrix in="n" type="saturate" values="0" result="g" />
              <feComponentTransfer in="g"><feFuncA type="linear" slope="0" intercept="0.22" /></feComponentTransfer>
            </filter>
          </defs>

          <rect width={W} height={H} fill={corParede} />

          <g filter="url(#p45marker)" strokeLinecap="round" strokeLinejoin="round">
            {/* legenda escrita à mão */}
            <clipPath id="p45write"><rect x="0" y="40" width={W * writeIn} height="120" /></clipPath>
            <text x={W / 2} y="128" textAnchor="middle" fontFamily={fontFamily} fontSize={78} fill={INK} clipPath="url(#p45write)">{legenda}</text>

            {/* mesa */}
            <rect x="-20" y="1050" width={W + 40} height="40" fill="#CDBD95" stroke={INK} strokeWidth="9" />
            <rect x="-20" y="1090" width={W + 40} height="300" fill="#B5A27A" stroke={INK} strokeWidth="9" />
            {[[130, 1160], [610, 1160]].map(([x, y], i) => (
              <g key={i}><rect x={x} y={y} width="340" height="120" rx="6" fill="#B5A27A" stroke={INK} strokeWidth="8" /><path d={`M${x + 130} ${y + 60} L${x + 210} ${y + 60}`} stroke={INK} strokeWidth="11" /></g>
            ))}

            {/* calendário na parede */}
            <g transform="translate(225 300)">
              <path d="M0 -110 L-40 -66 M0 -110 L40 -66" stroke={INK} strokeWidth="6" fill="none" />
              <circle cx="0" cy="-112" r="8" fill={INK} />
              {/* folhas restantes por baixo */}
              <g transform={final ? `translate(0 120) scale(${mix(1.3, 1, punch)}) translate(0 -120)` : undefined}><CalPage n={day} red={final} /></g>
              <rect x="-128" y="-72" width="256" height="66" rx="6" fill={BRICK} stroke={INK} strokeWidth="8" />
              {[-70, 70].map((x) => <rect key={x} x={x - 8} y="-86" width="16" height="36" rx="6" fill="#ECEBE7" stroke={INK} strokeWidth="5" />)}
              {/* folhas arrancadas voando */}
              {Array.from({length: last}, (_, i) => i + 1).map((k) => {
                const t = f - tearT(k);
                if (t < 0 || t > 16 || hold) return null;
                const p = t / 16;
                return (
                  <g key={k} transform={`translate(${-p * 420 - Math.sin(p * 3) * 40} ${p * p * 380 - p * 60}) rotate(${-p * 220 * (k % 2 ? 1 : -0.7)} -118 0) scale(${1 - p * 0.15})`}>
                    <CalPage n={k} />
                  </g>
                );
              })}
            </g>

            {/* pilha de copos (balança) */}
            <g transform={`rotate(${swayKick} 870 1050)`}>
              {Array.from({length: Math.min(landed, N_CUPS)}, (_, i) => {
                const t = f - (cupT(i) + 9);
                const sq = i === 0 ? 1 : mix(0.72, 1, Math.min(1, t / 5));
                return <g key={i} transform={`translate(870 ${1050 - i * CUP_H})`}><Cup sq={sq} /></g>;
              })}
            </g>
            {/* copos em voo */}
            {Array.from({length: N_CUPS}, (_, i) => i).map((i) => {
              const t = (f - cupT(i)) / 9;
              if (i === 0 || t < 0 || t >= 1) return null;
              const x = mix(1180, 870, t);
              const yTop = 1050 - i * CUP_H;
              const y = mix(560, yTop, t) - Math.sin(t * Math.PI) * 220;
              return <g key={i} transform={`translate(${x} ${y}) rotate(${(1 - t) * 260})`}><Cup /></g>;
            })}

            {/* personagem de frente */}
            <g>
              {/* corpo/moletom */}
              <path d="M370 1050 Q360 760 450 700 Q540 660 630 700 Q720 760 710 1050 Z" fill={corMoletom[0]} stroke={INK} strokeWidth="13" />
              <path d="M440 700 Q540 780 640 700 Q600 680 540 676 Q480 680 440 700 Z" fill={corMoletom[1]} stroke={INK} strokeWidth="10" />
              <path d="M505 740 L498 800 M575 740 L582 800" stroke={INK} strokeWidth="7" />
              {/* braços de palito até o teclado */}
              <path d={`M430 790 Q380 900 455 ${955 + tap}`} stroke={INK} strokeWidth="25" fill="none" />
              <path d={`M650 790 Q700 900 625 ${955 - tap}`} stroke={INK} strokeWidth="25" fill="none" />
              {/* notebook (a tampa, de costas) */}
              <rect x="345" y="900" width="390" height="150" rx="12" fill="#4B4B4B" stroke={INK} strokeWidth="11" />
              <rect x="320" y="1036" width="440" height="22" rx="8" fill="#5A5A5A" stroke={INK} strokeWidth="9" />
              {/* cabeça */}
              <g transform="translate(540 455)">
                <circle r="185" fill="#ECEBE7" stroke={INK} strokeWidth="13" />
                {brows(-1)}{brows(1)}
                {/* olhos */}
                {panic < 0.4 ? (
                  <g>
                    <ellipse cx="-62" cy="-18" rx="11" ry={mix(12, 10, worry)} fill={INK} />
                    <ellipse cx="62" cy="-18" rx="11" ry={mix(12, 10, worry)} fill={INK} />
                    {worry > 0.6 && <g stroke={INK} strokeWidth="5" fill="none" opacity={(worry - 0.6) / 0.4}><path d="M-84 8 Q-62 18 -40 8" /><path d="M40 8 Q62 18 84 8" /></g>}
                  </g>
                ) : (
                  <g>
                    {[-62, 62].map((x) => (
                      <g key={x}>
                        <circle cx={x} cy="-18" r={mix(12, 36, panic)} fill="#F6F5F1" stroke={INK} strokeWidth="9" />
                        <circle cx={x} cy="-16" r="8" fill={INK} />
                        <path d={`M${x - 30} 30 Q${x} 44 ${x + 30} 30`} stroke={INK} strokeWidth="6" fill="none" />
                      </g>
                    ))}
                  </g>
                )}
                {/* boca: sorriso convencido -> reta -> careta de dentes */}
                {panic < 0.4 ? (
                  <path d={`M-48 80 Q0 ${mix(112, 74, worry)} 48 80`} stroke={INK} strokeWidth="10" fill="none" />
                ) : (
                  <g>
                    <rect x={-70} y={62} width={140} height={58} rx={22} fill="#F6F5F1" stroke={INK} strokeWidth="9" />
                    <path d="M-66 91 L66 91" stroke={INK} strokeWidth="6" />
                    {[-40, -14, 12, 38].map((x) => <path key={x} d={`M${x} 64 L${x} 118`} stroke={INK} strokeWidth="5" />)}
                  </g>
                )}
                {/* gotas de suor */}
                <path d="M0 -26 Q16 0 0 12 Q-16 0 0 -26 Z" fill="#A9CBE0" stroke={INK} strokeWidth="5" transform={`translate(140 -110) scale(${sweat1})`} />
                <path d="M0 -26 Q16 0 0 12 Q-16 0 0 -26 Z" fill="#A9CBE0" stroke={INK} strokeWidth="5" transform={`translate(-150 30) scale(${sweat2 * 0.8})`} />
              </g>
            </g>
          </g>

          {/* textura de pincel seco sobre tudo */}
          <rect width={W} height={H} filter="url(#p45paper)" style={{mixBlendMode: 'soft-light'}} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
