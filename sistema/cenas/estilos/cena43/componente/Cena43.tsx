// cena43 · Deep Time (Tempo profundo)
// Simulação espacial em janela de cinema: buraco negro com anel fino, disco de gás em rampa de fogo, uma estrela
// esticada e rasgada vira um fluxo que fecha um anel; a legenda cinza rola o ano. O tempo desacelera até parar.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/SourceSans3';

const {fontFamily} = loadFont('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});

export type Cena43Props = {
  anoInicial?: number;
  anoFinal?: number;
  rotuloAno?: string;
  frase?: string;
  width?: number;
  height?: number;
};

const W = 1080, H = 1350;
const BAR = 96;
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const rnd = (i: number) => {
  const x = Math.sin(i * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
};
const STARS = Array.from({length: 420}, (_, i) => ({x: rnd(i) * W, y: BAR + rnd(i + 1000) * (H - 2 * BAR), r: 0.6 + rnd(i + 77) ** 3 * 2.2, o: 0.2 + rnd(i + 5) * 0.8}));
const GRAINS = Array.from({length: 520}, (_, i) => ({a: rnd(i + 3000) * Math.PI * 2, rr: 0.78 + rnd(i + 4000) * 0.42, r: 0.8 + rnd(i + 5000) * 1.8, o: 0.3 + rnd(i + 6000) * 0.7}));
const DUST = Array.from({length: 14}, (_, i) => ({x: rnd(i + 7000) * W, y: BAR + rnd(i + 8000) * (H - 2 * BAR), r: 2 + rnd(i + 9000) * 5}));

const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// geometria: centro do buraco e o disco inclinado
const CX = 540, CY = 600, RH = 205, RX = 440, RY = 275, TILT = -6;
const STREAM =
  'M745 885 L784 814 L815 798 L843 780 L870 761 L894 741 L915 719 L933 697 L949 674 L961 650 L970 626 L976 602 L978 578 L978 554 L973 530 L966 507 L955 485 L941 463 L924 443 L905 423 L882 405 L857 389 L829 374 L799 361 L767 350 L734 340 L699 333 L663 327 L625 324 L588 323 L550 324 L511 327 L473 332 L436 339 L399 348 L363 359 L329 372 L296 386 L265 402 L237 420 L210 439 L186 459 L165 481 L147 503 L131 526 L119 550 L110 574 L104 598 L102 622 L102 646 L107 670 L114 693 L125 715 L139 737 L156 757 L175 777 L198 795 L223 811 L251 826 L281 839 L313 850 L346 860 L381 867 L417 873 L455 876 L492 877 L530 876 L569 873 L607 868 L644 861 L681 852 L717 841 L751 828 L784 814';

export const Cena43: React.FC<Cena43Props> = ({
  anoInicial = 972280615,
  anoFinal = 1000000000,
  rotuloAno = 'Ano',
  frase = 'Um buraco negro errante alcança a estrela',
  width = W,
  height = H,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const f = frame * (150 / durationInFrames);

  const time = interpolate(f, [0, 120], [0, 1], {...cl, easing: Easing.out(Easing.quad)}); // tempo que desacelera
  const spin = time * 1.6;
  const push = interpolate(f, [0, 120], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const stretch = interpolate(f, [0, 38], [1, 1.5], cl);
  const tear = interpolate(f, [38, 46], [0, 1], cl);
  const stream = interpolate(f, [40, 112], [0.04, 1], {...cl, easing: Easing.inOut(Easing.quad)});
  const year = interpolate(f, [0, 40], [anoInicial, anoFinal], {...cl, easing: Easing.out(Easing.cubic)});
  const lineIn = interpolate(f, [66, 84], [0, 1], cl);
  const knot = 1 - tear * 0.45;

  const ell = (k: number, a: number): [number, number] => {
    const t = (TILT * Math.PI) / 180;
    const x = Math.cos(a) * RX * k, y = Math.sin(a) * RY * k;
    return [CX + x * Math.cos(t) - y * Math.sin(t), CY + x * Math.sin(t) + y * Math.cos(t)];
  };

  const s = Math.max(width / W, height / H);
  const caption = `${rotuloAno} ${fmt(year)}`;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: W, height: H, left: (width - W * s) / 2, top: (height - H * s) / 2, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <clipPath id="d43win"><rect x="0" y={BAR} width={W} height={H - 2 * BAR} /></clipPath>
            <filter id="d43smoke" x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="4" seed="8" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="34" xChannelSelector="R" yChannelSelector="G" result="d" />
              <feGaussianBlur in="d" stdDeviation="5" result="b" />
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2" result="g" />
              <feColorMatrix in="g" type="matrix" values="0 0 0 0 1 0 0 0 0 0.72 0 0 0 0 0.4 0 0 0 0.9 -0.5" result="g2" />
              <feComposite in="g2" in2="b" operator="in" result="grain" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="grain" /></feMerge>
            </filter>
            <filter id="d43bloom" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22" /></filter>
            <filter id="d43soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" /></filter>
            <radialGradient id="d43star"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.3" stopColor="#FCFADA" /><stop offset="0.7" stopColor="#EEB86F" stopOpacity="0.7" /><stop offset="1" stopColor="#B26D3C" stopOpacity="0" /></radialGradient>
            <mask id="d43back"><rect width={W} height={H} fill="white" /><circle cx={CX} cy={CY} r={RH + 4} fill="black" /></mask>
            <mask id="d43front"><rect width={W} height={H} fill="black" /><rect x="0" y={CY + 30} width={W} height={H} fill="white" /></mask>
          </defs>

          <g clipPath="url(#d43win)">
            <rect width={W} height={H} fill="#070504" />
            <g transform={`translate(${CX} ${CY}) scale(${1 + push * 0.04}) translate(${-CX} ${-CY})`}>
              {STARS.map((st, i) => <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#FFFFFF" opacity={st.o} />)}
            </g>

            <g transform={`translate(${CX} ${CY}) scale(${0.96 + push * 0.12}) rotate(${-2 + push * 3}) translate(${-CX} ${-CY})`}>
              {/* brilho geral */}
              <ellipse cx={CX} cy={CY} rx={RX * 1.05} ry={RY * 1.2} fill="#B26D3C" opacity="0.12" filter="url(#d43bloom)" />

              {/* disco: parte de trás e arco lenteado por cima do buraco */}
              <g filter="url(#d43smoke)" mask="url(#d43back)">
                <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke="#B8622E" strokeWidth="56" opacity="0.8" transform={`rotate(${TILT} ${CX} ${CY})`} />
              </g>
              {/* fluxo da estrela rasgada: fecha o anel de fogo */}
              <g mask="url(#d43back)">
                <path d={STREAM} fill="none" stroke="#EEB86F" strokeWidth="60" opacity="0.35" pathLength={1} strokeDasharray={`${stream} 1`} filter="url(#d43bloom)" />
                <g filter="url(#d43smoke)">
                  <path d={STREAM} fill="none" stroke="#B8622E" strokeWidth="50" pathLength={1} strokeDasharray={`${stream} 1`} strokeLinecap="round" />
                  <path d={STREAM} fill="none" stroke="#EEB86F" strokeWidth="26" pathLength={1} strokeDasharray={`${stream} 1`} strokeLinecap="round" />
                  <path d={STREAM} fill="none" stroke="#FCFADA" strokeWidth="8" pathLength={1} strokeDasharray={`${Math.min(stream, 0.35)} 1`} strokeLinecap="round" opacity={tear} />
                </g>
              </g>

              {/* grãos girando no disco */}
              <g mask="url(#d43back)">
                {GRAINS.map((g, i) => {
                  const p = ell(g.rr, g.a + spin * (1.6 / g.rr));
                  return <circle key={i} cx={p[0]} cy={p[1]} r={g.r} fill={g.rr < 0.9 ? '#FCE7B8' : '#EEB86F'} opacity={g.o * 0.8} />;
                })}
              </g>

              {/* sombra e anel */}
              <circle cx={CX} cy={CY} r={RH} fill="#000" />
              <circle cx={CX} cy={CY} r={RH + 3} fill="none" stroke="#FFC98A" strokeWidth="14" opacity="0.35" filter="url(#d43soft)" />
              <circle cx={CX} cy={CY} r={RH + 2} fill="none" stroke="#FFF1E0" strokeWidth="3.5" />

              {/* parte da frente do disco, cruzando a sombra por baixo */}
              <g filter="url(#d43smoke)" mask="url(#d43front)">
                <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke="#B8622E" strokeWidth="56" opacity="0.85" transform={`rotate(${TILT} ${CX} ${CY})`} />
                <path d={STREAM} fill="none" stroke="#EEB86F" strokeWidth="30" pathLength={1} strokeDasharray={`${stream} 1`} strokeLinecap="round" />
              </g>
              <g mask="url(#d43front)">
                {GRAINS.slice(0, 260).map((g, i) => {
                  const p = ell(g.rr, g.a + spin * (1.6 / g.rr));
                  return p[1] > CY + 30 ? <circle key={i} cx={p[0]} cy={p[1]} r={g.r} fill="#F7D9A0" opacity={g.o * 0.7} /> : null;
                })}
              </g>

              {/* estrela: estica, rasga e fica como um nó brilhante */}
              <g transform={`translate(745 885) rotate(-35) scale(${stretch * (1 + tear * 0.5)} ${1 / stretch * knot})`}>
                <circle r="120" fill="url(#d43star)" opacity="0.6" filter="url(#d43bloom)" />
                <ellipse rx={46} ry={46} fill="url(#d43star)" />
                <ellipse rx={20} ry={20} fill="#FFFFFF" />
              </g>
              {tear > 0 && (
                <path d="M745 885 C840 860 930 800 975 720" stroke="#FCFADA" strokeWidth={30 * tear} strokeLinecap="round" fill="none" filter="url(#d43smoke)" opacity={0.9} />
              )}
            </g>

            {/* poeira passando na frente da lente */}
            {DUST.map((d, i) => (
              <circle key={i} cx={(d.x + time * 140 * (1 + (i % 3))) % W} cy={d.y - time * 30} r={d.r} fill="#C9A27A" opacity="0.18" filter="url(#d43soft)" />
            ))}
          </g>

          {/* barras de cinema e legenda */}
          <rect width={W} height={BAR} fill="#000" />
          <rect y={H - BAR} width={W} height={BAR} fill="#000" />
          <text x={W / 2} y={H - BAR / 2 + 10} textAnchor="middle" fontFamily={fontFamily} fontSize={30} fill="#B6B6B4">
            <tspan>{caption}</tspan>
            {lineIn > 0 && (
              <tspan opacity={lineIn}>
                {'   |   '}
                {frase}
              </tspan>
            )}
          </text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
