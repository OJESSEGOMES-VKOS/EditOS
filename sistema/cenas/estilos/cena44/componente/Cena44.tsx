// cena44 · Neon Silhouette (Silhueta neon)
// Quarto 2D com luz de cinema: figura preta com contorno de luz vermelho-coral, janela com pôr do sol e cidade,
// luminária com cone de poeira sobre um relógio de virar. 21:59 vira 22:00, a digitação para, a cabeça vira pra câmera.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont as loadOswald} from '@remotion/google-fonts/Oswald';
import {loadFont as loadRubik} from '@remotion/google-fonts/Rubik';

const oswald = loadOswald('normal', {weights: ['600'], subsets: ['latin', 'latin-ext']}).fontFamily;
const rubik = loadRubik('normal', {weights: ['800'], subsets: ['latin', 'latin-ext']}).fontFamily;

export type Cena44Props = {
  rotulo?: string;
  horaAntes?: [string, string];
  horaDepois?: [string, string];
  corRoupa?: string;
  corContorno?: string;
  width?: number;
  height?: number;
};

const W = 1080, H = 1350;
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number) => {
  const x = Math.sin(i * 51.3 + 7.1) * 43758.5453;
  return x - Math.floor(x);
};
const DUST = Array.from({length: 40}, (_, i) => ({x: rnd(i), y: rnd(i + 40), r: 1.2 + rnd(i + 80) * 2.2, v: 0.3 + rnd(i + 120)}));
const NEAR = [[60, 640, 90], [150, 600, 70], [220, 660, 80], [300, 590, 60], [360, 630, 90], [450, 600, 70], [520, 650, 80], [590, 610, 80]];
const WINS = NEAR.flatMap(([x, y, w], b) => Array.from({length: 6}, (_, k) => ({x: x + 10 + (k % 3) * (w / 3.2), y: y + 16 + Math.floor(k / 3) * 30, c: b % 3})));

export const Cena44: React.FC<Cena44Props> = ({
  rotulo = 'PRAZO',
  horaAntes = ['21', '59'],
  horaDepois = ['22', '00'],
  corRoupa = '#2B6470',
  corContorno = '#FF5A44',
  width = W,
  height = H,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const f = frame * (150 / durationInFrames);
  const hold = f >= 120;

  const push = interpolate(f, [0, 118], [0, 1], {...cl, easing: Easing.out(Easing.cubic)}) + interpolate(f, [20, 26, 32, 38], [0, 0.04, 0.04, 0.08], cl);
  const flipM = interpolate(f, [12, 24], [0, 1], {...cl, easing: Easing.in(Easing.quad)});
  const flipH = interpolate(f, [24, 34], [0, 1], {...cl, easing: Easing.in(Easing.quad)});
  const hop = Math.max(0, Math.sin(interpolate(f, [22, 27], [0, Math.PI], cl))) + Math.max(0, Math.sin(interpolate(f, [32, 37], [0, Math.PI], cl)));
  const typing = f < 36;
  const turn = spring({frame: f - 38, fps: 30, config: {damping: 11, stiffness: 160, mass: 0.6}});
  const label = spring({frame: f - 46, fps: 30, config: {damping: 9, stiffness: 150, mass: 0.6}});
  const lights = [52, 56, 60].map((s) => (f >= s ? 1 : 0));
  const blink = f >= 70 && f < 75 ? 0.1 : 1;

  // página que vira (dobradiça no topo)
  const Page = ({x, digit, flip, next}: {x: number; digit: string; flip: number; next: string}) => {
    const th = flip * Math.PI;
    const c = Math.cos(th);
    const showOld = flip < 0.97;
    const Card = ({d, back}: {d: string; back?: boolean}) => (
      <g>
        <rect x={x} y={830} width={128} height={186} rx={10} fill={back ? '#E8DCC4' : '#F3EAD8'} />
        {!back && <text x={x + 64} y={960} textAnchor="middle" fontFamily={rubik} fontWeight={800} fontSize={90} fill="#111015">{d}</text>}
      </g>
    );
    return (
      <g>
        <Card d={next} />
        {showOld && (
          <g transform={`translate(0 830) scale(1 ${Math.abs(c) < 0.02 ? 0.02 : c}) translate(0 -830)`}>
            <Card d={digit} back={c < 0} />
          </g>
        )}
        {[x + 30, x + 98].map((rx) => <rect key={rx} x={rx - 7} y={812} width={14} height={34} rx={7} fill="#8F8B93" stroke="#3C3940" strokeWidth={2} />)}
      </g>
    );
  };

  const s = Math.max(width / W, height / H);
  const eyesFront = turn;
  return (
    <AbsoluteFill style={{background: '#170F1D', overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: W, height: H, left: (width - W * s) / 2, top: (height - H * s) / 2, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <linearGradient id="n44sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2F2A57" /><stop offset="0.45" stopColor="#7A5378" /><stop offset="0.7" stopColor="#B3687C" />
              <stop offset="0.86" stopColor="#EE8F67" /><stop offset="1" stopColor="#FFD7A0" />
            </linearGradient>
            <radialGradient id="n44room" cx="0.3" cy="0.35" r="0.8">
              <stop offset="0" stopColor="#48304F" /><stop offset="1" stopColor="#170F1D" />
            </radialGradient>
            <radialGradient id="n44sun"><stop offset="0" stopColor="#FFE9C0" /><stop offset="0.3" stopColor="#FFC283" stopOpacity="0.8" /><stop offset="1" stopColor="#EE8F67" stopOpacity="0" /></radialGradient>
            <linearGradient id="n44cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE2B4" stopOpacity="0.55" /><stop offset="1" stopColor="#FFE2B4" stopOpacity="0.08" /></linearGradient>
            <radialGradient id="n44vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.8" /></radialGradient>
            <radialGradient id="n44pool"><stop offset="0" stopColor="#FFE2B4" stopOpacity="0.55" /><stop offset="1" stopColor="#FFE2B4" stopOpacity="0" /></radialGradient>
            <filter id="n44bg"><feGaussianBlur stdDeviation="1.6" /></filter>
            <filter id="n44glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="n44big" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30" /></filter>
            <filter id="n44plant" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" /></filter>
            <filter id="n44grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={hold ? 3 : 1 + (Math.floor(f / 2) % 6)} />
              <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0" />
            </filter>
            <clipPath id="n44win"><rect x="72" y="156" width="600" height="636" /></clipPath>
          </defs>

          <g transform={`translate(400 700) scale(${1 + push * 0.04}) translate(-400 -700)`}>
            <rect width={W} height={H} fill="url(#n44room)" />
            {/* quadrinho na parede */}
            <rect x="830" y="150" width="90" height="110" fill="#2C1F33" stroke="#4A3752" strokeWidth="5" />
            <path d="M846 240 L870 205 L890 225 L904 210 L904 244 L846 244 Z" fill="#4A3752" />

            {/* janela: céu, cidade (fundo levemente desfocado) */}
            <g clipPath="url(#n44win)">
              <g filter="url(#n44bg)">
                <rect x="72" y="156" width="600" height="636" fill="url(#n44sky)" />
                {[260, 300, 420].map((y, i) => <path key={i} d={`M72 ${y} Q300 ${y - 14} 672 ${y + 6}`} stroke="#E8A9A6" strokeOpacity="0.35" strokeWidth="5" fill="none" />)}
                <circle cx="260" cy="690" r="220" fill="url(#n44sun)" />
                {Array.from({length: 7}, (_, i) => <path key={i} d="M0 0 L-14 -380 L14 -380 Z" fill="#FFE2B4" opacity="0.12" transform={`translate(250 700) rotate(${-60 + i * 20})`} />)}
                {/* skyline distante, mauve e enevoado */}
                <path d="M72 700 L100 700 L100 660 L140 660 L140 690 L190 690 L190 640 L210 640 L210 600 L222 560 L234 600 L234 640 L270 640 L270 680 L330 680 L330 650 L380 650 L380 690 L430 690 L430 630 L470 630 L470 680 L540 680 L540 655 L600 655 L600 690 L672 690 L672 792 L72 792 Z" fill="#9C6E8D" opacity="0.7" />
                {/* skyline próxima, ameixa escura com janelas */}
                {NEAR.map(([x, y, w], i) => <rect key={i} x={x + 12} y={y + 30} width={w} height={792 - y} fill="#3A2440" />)}
                {WINS.map((wd, i) => (
                  <rect key={i} x={wd.x + 12} y={wd.y + 30} width="9" height="11" fill="#FFC383"
                    opacity={(i % 4 === 0 ? 0.9 : 0) + (i % 4 !== 0 ? lights[wd.c] * 0.9 : 0)} />
                ))}
              </g>
            </g>
            {/* moldura da janela */}
            <g fill="#2A1C30">
              <rect x="60" y="144" width="624" height="14" /><rect x="60" y="790" width="624" height="16" />
              <rect x="60" y="144" width="14" height="660" /><rect x="670" y="144" width="14" height="660" />
              <rect x="364" y="144" width="12" height="660" /><rect x="60" y="460" width="624" height="10" />
            </g>
            <rect x="40" y="800" width="664" height="18" fill="#3B2842" />
            <circle cx="250" cy="680" r="320" fill="#FFB27A" opacity="0.12" filter="url(#n44big)" />

            {/* luminária pendente e cone de luz com poeira */}
            <path d="M840 0 L840 330" stroke="#0E0910" strokeWidth="4" />
            <path d="M600 1040 L760 440 L920 440 L1080 1040 Z" fill="url(#n44cone)" opacity="0.5" />
            {DUST.map((d, i) => {
              const yy = 460 + ((d.y * 560 + (hold ? 120 : f) * d.v * 1.2) % 560);
              const spread = (yy - 440) / 600;
              const xx = 840 + (d.x - 0.5) * (160 + spread * 420) + Math.sin((hold ? 120 : f) / 20 + i) * 6;
              return <circle key={i} cx={xx} cy={yy} r={d.r} fill="#FFF3D6" opacity={0.55} />;
            })}
            <path d="M770 450 L790 340 L890 340 L910 450 Z" fill="#1C1420" />
            <path d="M770 450 L910 450" stroke="#FFF2D8" strokeWidth="8" filter="url(#n44glow)" />
            <ellipse cx="840" cy="452" rx="74" ry="9" fill="#FFF8EA" filter="url(#n44glow)" />

            {/* mesa */}
            <rect x="0" y="1020" width={W} height="26" fill="#2A1C30" />
            <rect x="0" y="1018" width={W} height="4" fill="#6E4A5A" />
            <ellipse cx="840" cy="1022" rx="230" ry="20" fill="url(#n44pool)" />
            <rect x="0" y="1046" width={W} height="304" fill="#140C18" />
            <path d="M220 1046 L220 1300 M520 1046 L520 1300" stroke="#0C070F" strokeWidth="16" />

            {/* relógio de virar */}
            <g transform={`translate(0 ${-hop * 10})`}>
              <rect x="652" y="790" width="314" height="236" rx="16" fill="#241A27" />
              <path d="M652 806 Q652 790 668 790 L950 790 Q966 790 966 806" stroke="#FFB98A" strokeWidth="5" fill="none" />
              <rect x="668" y="1012" width="282" height="10" fill="#E9DFC9" opacity="0.6" />
              <Page x={670} digit={horaAntes[0]} next={horaDepois[0]} flip={flipH} />
              <Page x={820} digit={horaAntes[1]} next={horaDepois[1]} flip={flipM} />
              <circle cx="809" cy="900" r="6" fill="#111015" /><circle cx="809" cy="940" r="6" fill="#111015" />
            </g>

            {/* notebook (de lado) com brilho frio */}
            <path d="M560 1016 L700 1016" stroke="#0B080D" strokeWidth="10" />
            <path d="M600 1012 L650 860" stroke="#C9D4F0" strokeWidth="5" opacity="0.8" />
            <path d="M530 1012 L660 860 L560 1012 Z" fill="#A9B8E6" opacity="0.12" />

            {/* cadeira */}
            <rect x="170" y="760" width="40" height="290" rx="12" fill="#0E0A10" />
            <path d="M175 762 L175 1040" stroke={corContorno} strokeWidth="3" opacity="0.7" />
            <rect x="180" y="1040" width="300" height="20" fill="#0E0A10" />
            <path d="M330 1060 L330 1250 M260 1250 L400 1250" stroke="#0E0A10" strokeWidth="14" />

            {/* figura: contorno vermelho deslocado para a luz, depois a silhueta */}
            {(() => {
              const tx = typing ? Math.sin(f * 1.3) * 5 : 0;
              const headJump = -Math.sin(Math.min(1, turn) * Math.PI) * 12;
              const fig = (fill: string, stroke?: string) => (
                <g>
                  {/* capuz e tronco */}
                  <path d="M200 1040 Q190 860 240 760 Q280 690 340 700 Q420 712 450 790 Q470 860 470 1040 Z" fill={fill} />
                  {/* braço até o teclado */}
                  <path d={`M380 800 Q430 900 520 ${960 + tx} L560 ${990 + tx} L540 ${1010 + tx} L500 ${990 + tx} Q400 940 350 860 Z`} fill={fill} />
                  {/* pescoço e cabeça */}
                  <rect x="306" y={640 + headJump} width="14" height="80" fill={stroke || fill} />
                  <circle cx="314" cy={575 + headJump} r="102" fill={stroke || fill} />
                </g>
              );
              return (
                <g>
                  <g transform="translate(-4 -3)">{fig(corContorno, corContorno)}</g>
                  <g>
                    {/* corpo com a roupa */}
                    <path d="M200 1040 Q190 860 240 760 Q280 690 340 700 Q420 712 450 790 Q470 860 470 1040 Z" fill={corRoupa} />
                    <path d="M250 760 Q300 720 360 730 Q330 800 270 820 Z" fill="#245762" />
                    <path d={`M380 800 Q430 900 520 ${960 + tx} L560 ${990 + tx} L540 ${1010 + tx} L500 ${990 + tx} Q400 940 350 860 Z`} fill="#24555F" />
                    <ellipse cx={548} cy={998 + tx} rx="20" ry="12" fill="#08070B" />
                    <path d="M300 760 L296 840 M326 760 L330 836" stroke="#F2EEE8" strokeWidth="3" />
                    <path d="M260 900 Q290 920 300 960 M420 870 Q430 920 420 980" stroke="#1E4A54" strokeWidth="3" fill="none" />
                    <rect x="306" y={640 + headJump} width="14" height="80" fill="#08070B" />
                    <circle cx="314" cy={575 + headJump} r="102" fill="#08070B" />
                    {/* olhos: meio fechados olhando o notebook -> deslizam e abrem pra câmera */}
                    {[0, 1].map((k) => {
                      const ex = mix(352 + k * 42, 282 + k * 64, eyesFront);
                      const ey = 565 + headJump;
                      const open = mix(0.45, 1, eyesFront) * blink;
                      return (
                        <g key={k}>
                          <ellipse cx={ex} cy={ey} rx={mix(14, 20, eyesFront)} ry={20 * open} fill="#F4F1EC" />
                          {eyesFront < 0.5 && <rect x={ex - 18} y={ey - 22} width="36" height="14" fill="#08070B" />}
                        </g>
                      );
                    })}
                  </g>
                </g>
              );
            })()}
          </g>

          {/* planta desfocada na frente da lente */}
          <g filter="url(#n44plant)" transform={`translate(${-push * 30} ${push * 20})`}>
            {[[-30, 1350, -20], [40, 1360, 10], [120, 1370, 35], [10, 1300, -45]].map(([x, y, r], i) => (
              <path key={i} d="M0 0 Q-60 -200 10 -420 Q70 -200 0 0 Z" fill="#0A060C" transform={`translate(${x} ${y}) rotate(${r})`} />
            ))}
          </g>

          {/* rótulo */}
          <g transform={`translate(540 72) scale(${label})`} opacity={label > 0.02 ? 1 : 0}>
            <text x="0" y="16" textAnchor="middle" fontFamily={oswald} fontWeight={600} fontSize={46} letterSpacing={18} fill="#FFF1E6" filter="url(#n44glow)" style={{textShadow: '0 0 12px rgba(255,90,68,0.6)'}}>{rotulo}</text>
          </g>

          <rect width={W} height={H} fill="url(#n44vig)" />
          <rect width={W} height={H} filter="url(#n44grain)" />
          <rect width={W} height="26" fill="#000" /><rect y={H - 26} width={W} height="26" fill="#000" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
