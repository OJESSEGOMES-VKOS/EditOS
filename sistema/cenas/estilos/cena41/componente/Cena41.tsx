// cena41 · Red Relief (Mapa em relevo vermelho)
// Mapa em relevo preto visto em ângulo baixo: relevo procedural (feTurbulence + feDiffuseLighting, luz baixa do oeste),
// grade branca no mar, uma região inunda de vermelho, um cartão gravado cai sobre ela e uma rota neon vai até o
// destino, tracejada sobre a água. Terra fictícia desenhada em código (não é mapa real).
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont as loadMarker} from '@remotion/google-fonts/PermanentMarker';
import {loadFont as loadFell} from '@remotion/google-fonts/IMFellEnglishSC';

const marker = loadMarker('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
const fell = loadFell('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;

export type Cena41Props = {
  origem?: string; // nome do lugar da região
  destino?: string;
  cartaoTitulo?: string;
  cartaoData?: string;
  corRegiao?: string;
  width?: number;
  height?: number;
};

const W = 1080, H = 1350;
const M = 1600; // lado do plano do mapa
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const MAINLAND = 'M0 0 L1600 0 L1600 380 Q1450 440 1300 400 Q1150 360 1050 430 Q950 500 820 470 Q650 430 520 500 Q400 560 300 600 L150 640 Q60 700 0 760 Z';
const ISLES = 'M1380 560 Q1430 540 1460 580 Q1440 620 1390 610 Z M1480 700 Q1520 690 1540 720 Q1510 750 1480 735 Z';
const PENIN =
  'M150 640 Q300 600 500 610 Q800 620 1000 640 Q1250 660 1380 760 Q1450 860 1350 940 Q1300 1000 1330 1100 Q1360 1250 1260 1300 Q1200 1200 1150 1060 Q1080 1000 1040 1100 Q1020 1250 960 1400 Q900 1300 890 1150 Q850 1050 760 1080 Q700 1150 720 1300 Q690 1420 600 1450 Q580 1300 560 1150 Q500 1050 420 1100 Q380 1200 300 1220 Q200 1150 240 1000 Q180 900 120 820 Q100 720 150 640 Z';
const REGION_MASK = 'M0 1700 L0 740 L150 640 Q230 610 320 605 L1600 560 L1600 1700 Z';
const CAP = [640, 880];
const DEST = [1160, 330];
const ROUTE_LAND = 'M640 880 C560 800 500 690 600 600';
const ROUTE_SEA = 'M600 600 C760 520 980 480 1160 330';

export const Cena41: React.FC<Cena41Props> = ({
  origem = 'VALE',
  destino = 'PORTO',
  cartaoTitulo = 'TERRA DO SUL',
  cartaoData = 'ANO 300',
  corRegiao = '#FF5A50',
  width = W,
  height = H,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const f = frame * (150 / durationInFrames);

  const cam = interpolate(f, [0, 118], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const write1 = interpolate(f, [4, 26], [0, 1], cl);
  const flood = interpolate(f, [30, 46], [0, 1], {...cl, easing: Easing.out(Easing.quad)});
  const card = spring({frame: f - 48, fps: 30, config: {damping: 9, stiffness: 140, mass: 0.8}});
  const rLand = interpolate(f, [60, 74], [0, 1], cl);
  const rSea = interpolate(f, [74, 92], [0, 1], {...cl, easing: Easing.out(Easing.quad)});
  const dot = spring({frame: f - 92, fps: 30, config: {damping: 8, stiffness: 180}});
  const ripple = interpolate(f, [94, 114], [0, 1], cl);
  const write2 = interpolate(f, [96, 116], [0, 1], cl);

  // ponto da cabeça da rota (para o destaque)
  const relief = (id: string, color: string, base: string) => (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="6" seed="11" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="70" xChannelSelector="R" yChannelSelector="G" result="shape" />
      <feTurbulence type="turbulence" baseFrequency="0.009" numOctaves="6" seed="3" result="h" />
      <feDiffuseLighting in="h" surfaceScale="9" diffuseConstant="1.15" lightingColor={color} result="lit">
        <feDistantLight azimuth="180" elevation="22" />
      </feDiffuseLighting>
      <feFlood floodColor={base} result="base" />
      <feComponentTransfer in="lit" result="lit2"><feFuncR type="gamma" exponent="2.2" amplitude="1.1" /><feFuncG type="gamma" exponent="2.2" amplitude="1.1" /><feFuncB type="gamma" exponent="2.2" amplitude="1.1" /></feComponentTransfer><feBlend in="lit2" in2="base" mode="screen" result="col" />
      <feComposite in="col" in2="shape" operator="in" />
    </filter>
  );

  const s = Math.max(width / W, height / H);
  return (
    <AbsoluteFill style={{background: '#030303', overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: W, height: H, left: (width - W * s) / 2, top: (height - H * s) / 2, transform: `scale(${s})`, transformOrigin: '0 0', overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, perspective: 1100, perspectiveOrigin: '50% 30%'}}>
          <div
            style={{
              position: 'absolute', width: M, height: M, left: (W - M) / 2, top: (H - M) / 2 + 120,
              transform: `rotateX(${50 - cam * 3}deg) rotateZ(${-4 + cam * 6}deg) scale(${0.78 + cam * 0.07})`,
              transformOrigin: '50% 55%',
            }}
          >
            <svg width={M} height={M} viewBox={`0 0 ${M} ${M}`}>
              <defs>
                {relief('r41g', '#A8A8A8', '#0A0A0A')}
                {relief('r41r', corRegiao, '#3A0307')}
                <filter id="r41edge" x="-5%" y="-5%" width="110%" height="110%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="6" seed="11" result="n" />
                  <feDisplacementMap in="SourceGraphic" in2="n" scale="70" xChannelSelector="R" yChannelSelector="G" result="shape" />
                  <feMorphology in="shape" operator="dilate" radius="3" result="d" />
                  <feComposite in="d" in2="shape" operator="out" result="ring" />
                  <feFlood floodColor="#FF4D47" />
                  <feComposite in2="ring" operator="in" result="edge" />
                  <feGaussianBlur in="edge" stdDeviation="6" result="g" />
                  <feMerge><feMergeNode in="g" /><feMergeNode in="edge" /></feMerge>
                </filter>
                <filter id="r41haze" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="6" seed="11" result="n" />
                  <feDisplacementMap in="SourceGraphic" in2="n" scale="70" xChannelSelector="R" yChannelSelector="G" result="shape" />
                  <feGaussianBlur in="shape" stdDeviation="30" />
                </filter>
                <filter id="r41glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="r41chalk" filterUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1600">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" result="n" />
                  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -0.6 1.5" result="holes" />
                  <feComposite in="SourceGraphic" in2="holes" operator="in" result="worn" />
                  <feGaussianBlur in="worn" stdDeviation="4" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="worn" /></feMerge>
                </filter>
                <mask id="r41flood">
                  <rect width={M} height={M} fill="black" />
                  <path d={REGION_MASK} fill="white" />
                  <rect width={M} height={M} fill="black" mask="url(#r41circ)" />
                </mask>
                <mask id="r41circ">
                  <rect width={M} height={M} fill="white" />
                  <circle cx={CAP[0]} cy={CAP[1]} r={flood * 1050} fill="black" />
                </mask>
                <mask id="r41reg"><rect width={M} height={M} fill="black" /><path d={REGION_MASK} fill="white" /></mask>
                <clipPath id="r41w1"><rect x={CAP[0] - 200} y={CAP[1] - 170} width={420 * write1} height={120} /></clipPath>
                <clipPath id="r41w2"><rect x={DEST[0] - 200} y={DEST[1] - 160} width={440 * write2} height={120} /></clipPath>
              </defs>

              {/* grade branca fina no mar */}
              <g stroke="#FFFFFF" strokeOpacity="0.42" strokeWidth="2">
                {Array.from({length: 17}, (_, i) => <line key={'v' + i} x1={i * 100} y1={0} x2={i * 100} y2={M} />)}
                {Array.from({length: 17}, (_, i) => <line key={'h' + i} x1={0} y1={i * 100} x2={M} y2={i * 100} />)}
              </g>

              {/* névoa vermelha sobre o mar */}
              <g mask="url(#r41reg)" opacity={0.25 + 0.4 * flood}><path d={PENIN} fill="#FF2933" filter="url(#r41haze)" /></g>

              {/* terra cinza em relevo */}
              <path d={`${MAINLAND} ${ISLES} ${PENIN}`} fill="#fff" filter="url(#r41g)" />
              {/* terra vermelha, revelada pela inundação */}
              <clipPath id="r41fc"><circle cx={CAP[0]} cy={CAP[1]} r={flood * 1050} /></clipPath><g clipPath="url(#r41fc)"><g mask="url(#r41reg)"><path d={PENIN} fill="#fff" filter="url(#r41r)" /></g></g>
              {/* contorno vermelho da região, já aceso */}
              <g mask="url(#r41reg)"><path d={PENIN} fill="#fff" filter="url(#r41edge)" /></g>

              {/* fronteira tracejada branca */}
              <path d="M30 760 L150 640 Q230 610 320 605" stroke="#FFFFFF" strokeWidth="5" strokeDasharray="16 12" fill="none" />

              {/* capital */}
              <circle cx={CAP[0]} cy={CAP[1]} r="10" fill="#FFFFFF" />
              <g filter="url(#r41chalk)">
                <text x={CAP[0] - 140} y={CAP[1] - 60} fontFamily={marker} fontSize={72} letterSpacing={6} fill="#FFFFFF">{origem.split("").map((c, i) => <tspan key={i} opacity={write1 * origem.length > i ? 1 : 0}>{c}</tspan>)}</text>
              </g>

              {/* rota */}
              <g filter="url(#r41glow)">
                <path d={ROUTE_LAND} stroke="#FF2933" strokeWidth="9" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${rLand} 1`} />
                <path d={ROUTE_LAND} stroke="#FFC9CC" strokeWidth="3" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${rLand} 1`} />
              </g>
              {rSea > 0 && (
                <g filter="url(#r41glow)">
                  <mask id="r41sea"><path d={ROUTE_SEA} stroke="white" strokeWidth="20" fill="none" pathLength={1} strokeDasharray={`${rSea} 1`} /></mask>
                  <g mask="url(#r41sea)">
                    <path d={ROUTE_SEA} stroke="#FF2933" strokeWidth="9" fill="none" strokeDasharray="34 26" strokeLinecap="round" />
                    <path d={ROUTE_SEA} stroke="#FFC9CC" strokeWidth="3" fill="none" strokeDasharray="34 26" strokeLinecap="round" />
                  </g>
                </g>
              )}

              {/* destino */}
              <circle cx={DEST[0]} cy={DEST[1]} r={11 * dot} fill="#FFFFFF" />
              {ripple > 0 && ripple < 1 && <circle cx={DEST[0]} cy={DEST[1]} r={14 + ripple * 60} fill="none" stroke="#FF5A50" strokeWidth="4" opacity={1 - ripple} />}
              <g filter="url(#r41chalk)">
                <text x={DEST[0] - 150} y={DEST[1] - 50} fontFamily={marker} fontSize={72} letterSpacing={6} fill="#FFFFFF">{destino.split("").map((c, i) => <tspan key={i} opacity={write2 * destino.length > i ? 1 : 0}>{c}</tspan>)}</text>
              </g>
            </svg>
          </div>
        </div>

        {/* cartão que cai sobre a região */}
        <div
          style={{
            position: 'absolute', left: 470, top: 800, width: 184, height: 240, perspective: 900,
            opacity: card > 0.02 ? 1 : 0,
          }}
        >
          <div style={{
            width: '100%', height: '100%', transformOrigin: '50% 100%',
            transform: `translateY(${(1 - card) * -120}px) rotateX(${(1 - card) * 35}deg) rotateZ(${(1 - card) * -8 + 2}deg) scale(${1 + (1 - card) * 0.25})`,
            boxShadow: `0 ${18 * card}px ${30 * card}px rgba(0,0,0,0.75)`,
          }}>
            <svg width="184" height="240" viewBox="0 0 230 300">
              <defs>
                <filter id="r41paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="2" /><feColorMatrix values="0 0 0 0 0.3 0 0 0 0 0.28 0 0 0 0 0.25 0 0 0 0.18 0" /></filter>
              </defs>
              <rect width="230" height="300" fill="#EDEAE3" />
              <rect width="230" height="300" filter="url(#r41paper)" />
              <rect x="10" y="10" width="210" height="280" fill="none" stroke="#24221F" strokeWidth="2" />
              <rect x="16" y="16" width="198" height="268" fill="none" stroke="#24221F" strokeWidth="1" />
              <text x="115" y="50" textAnchor="middle" fontFamily={fell} fontSize={19} fill="#24221F">{cartaoTitulo}</text>
              <line x1="50" y1="60" x2="180" y2="60" stroke="#24221F" strokeWidth="1" />
              {/* selo gravado: anel de contas, louros e uma torre hachurada */}
              <g transform="translate(115 160)">
                <circle r="62" fill="none" stroke="#24221F" strokeWidth="2" />
                {Array.from({length: 40}, (_, i) => <circle key={i} cx={Math.cos((i / 40) * Math.PI * 2) * 56} cy={Math.sin((i / 40) * Math.PI * 2) * 56} r="2" fill="#24221F" />)}
                <circle r="48" fill="none" stroke="#24221F" strokeWidth="1.5" />
                {Array.from({length: 7}, (_, i) => (
                  <g key={i}>
                    <ellipse cx={-38 + i * 2} cy={30 - i * 11} rx="4" ry="8" fill="none" stroke="#24221F" strokeWidth="1.3" transform={`rotate(${-30 + i * 6} ${-38 + i * 2} ${30 - i * 11})`} />
                    <ellipse cx={38 - i * 2} cy={30 - i * 11} rx="4" ry="8" fill="none" stroke="#24221F" strokeWidth="1.3" transform={`rotate(${30 - i * 6} ${38 - i * 2} ${30 - i * 11})`} />
                  </g>
                ))}
                <path d="M-18 26 L-18 -14 L-24 -14 L-24 -26 L-14 -26 L-14 -20 L-5 -20 L-5 -26 L5 -26 L5 -20 L14 -20 L14 -26 L24 -26 L24 -14 L18 -14 L18 26 Z" fill="#B8B3A8" stroke="#24221F" strokeWidth="2" />
                {Array.from({length: 9}, (_, i) => <line key={i} x1={-18} y1={-10 + i * 4} x2={18} y2={-14 + i * 4} stroke="#24221F" strokeWidth="0.9" />)}
                <path d="M-6 26 L-6 12 Q0 4 6 12 L6 26 Z" fill="#24221F" />
              </g>
              <text x="115" y="266" textAnchor="middle" fontFamily={fell} fontSize={18} fill="#24221F">{cartaoData}</text>
              <path d="M196 -4 L222 -4 L222 30 L209 22 L196 30 Z" fill="#C2232E" />
            </svg>
          </div>
        </div>

        <div style={{position: "absolute", left: 0, top: 0, width: W, height: 600, background: "linear-gradient(#030303 62%, transparent)"}} />
        {/* desfoque do fundo distante (tilt-shift), cantos escuros e grão parado */}
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 300, backdropFilter: 'blur(5px)', WebkitMaskImage: 'linear-gradient(black, transparent)', maskImage: 'linear-gradient(black, transparent)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 55%, transparent 45%, rgba(0,0,0,0.85) 100%)'}} />
        <svg style={{position: 'absolute', inset: 0}} width={W} height={H}>
          <filter id="r41grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" /><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.09 0" /></filter>
          <rect width={W} height={H} filter="url(#r41grain)" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
