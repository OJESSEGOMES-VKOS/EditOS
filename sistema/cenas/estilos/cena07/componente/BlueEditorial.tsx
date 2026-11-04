// cena07 — Blue Editorial (Editorial azul). Componente reutilizável (EditOS, cenas/estilos).
// Capa de revista em movimento: azul chapado, tipo branco em minúsculas, itálico enorme x grotesca pesada pequena.
// Desenho em espaço 1080x1350 (4:5) centralizado; o azul preenche qualquer formato.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont as loadSerif} from '@remotion/google-fonts/InstrumentSerif';
import {loadFont as loadGrot} from '@remotion/google-fonts/SchibstedGrotesk';

const {fontFamily: serif} = loadSerif('italic', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: grot} = loadGrot('normal', {weights: ['900'], subsets: ['latin', 'latin-ext']});

export type BlueEditorialProps = {
  partes?: [string, string, string, string, string]; // pequena, enorme, pequena, pequena, enorme (minúsculas)
  largura?: number;
  altura?: number;
  cores?: {azul: string; branco: string};
  tamGrande?: number;
  tamFinal?: number;
};

const CORES = {azul: '#2433F0', branco: '#F4F5FA'};
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const rapido = Easing.bezier(0.2, 0.9, 0.2, 1);

export const BlueEditorial: React.FC<BlueEditorialProps> = ({
  partes = ['cada', 'quadro', 'conta', 'uma', 'ideia'],
  largura,
  altura,
  cores = CORES,
  tamGrande = 375,
  tamFinal = 380,
}) => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const W = largura ?? width;
  const H = altura ?? height;
  const s = Math.min(W / 1080, H / 1350);
  const sp = (d: number, damping = 10, stiffness = 170) => spring({frame: f - d, fps, config: {damping, stiffness}});
  const regra = (d: number, dur = 7) => interpolate(f, [d, d + dur], [0, 1], {...cl, easing: rapido});
  const B = cores.branco;
  const pequeno: React.CSSProperties = {fontFamily: grot, fontWeight: 900, letterSpacing: '-0.045em', lineHeight: 1, color: B, whiteSpace: 'pre'};
  const grande: React.CSSProperties = {fontFamily: serif, fontStyle: 'italic', letterSpacing: '-0.03em', lineHeight: 1, color: B, whiteSpace: 'pre'};

  // 1) primeira palavra nasce enorme e encolhe para chapéu (kicker) com borrão na viagem
  const enc = interpolate(f, [21, 29], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
  const vel = interpolate(f, [21, 25, 29], [0, 1, 0], cl);
  const tam1 = interpolate(enc, [0, 1], [270, 80]);
  const base1 = interpolate(enc, [0, 1], [830, 194]);

  // 2) cortina inclinada revela a palavra enorme
  const wipe = interpolate(f, [31, 41], [0, 1], {...cl, easing: Easing.inOut(Easing.quad)});
  const incl = 0.36; // inclinação do itálico
  const wx = -200 + wipe * 1400;

  // 4) fatias da última palavra
  const fat = [0, 1, 2, 3].map((i) => sp(70 + i * 2, 13, 150));
  const trava = f >= 86;

  return (
    <AbsoluteFill style={{backgroundColor: cores.azul, overflow: 'hidden'}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="mb07" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation={`0 ${vel * 14}`} /></filter>
        <filter id="mbx07" x="-50%" y="-10%" width="200%" height="120%"><feGaussianBlur stdDeviation={`${trava ? 0 : 10 * (1 - Math.min(...fat))} 0`} /></filter>
      </svg>
      <div style={{position: 'absolute', left: (W - 1080 * s) / 2, top: (H - 1350 * s) / 2, width: 1080, height: 1350, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        {/* palavra 1: letras sobem pela máscara da linha de base, depois encolhem */}
        <div style={{position: 'absolute', left: 99, top: base1 - tam1 * 0.98, overflow: enc > 0 ? 'visible' : 'hidden', height: tam1 * 1.25, filter: vel > 0.05 ? 'url(#mb07)' : undefined}}>
          <div style={{...pequeno, fontSize: tam1}}>
            {Array.from(partes[0]).map((c, i) => (
              <span key={i} style={{display: 'inline-block', transform: `translateY(${(1 - sp(-3 + i * 2.5, 9, 180)) * 105}%)`}}>{c}</span>
            ))}
          </div>
        </div>
        {/* régua 1 */}
        <div style={{position: 'absolute', left: 99, top: 246, width: 882 * regra(27), height: 2, background: B, opacity: 0.55}} />
        {/* palavra 2 (enorme, itálico) revelada pela cortina inclinada */}
        {f >= 31 && (
          <div style={{position: 'absolute', left: 82, top: 540 - tamGrande * 0.86, ...grande, fontSize: tamGrande, clipPath: `polygon(-100px -200px, ${wx + 300 * incl}px -200px, ${wx - 600 * incl}px 700px, -100px 700px)`}}>{partes[1]}</div>
        )}
        {f >= 31 && wipe < 1 && (
          <div style={{position: 'absolute', left: 82 + wx - 200 * incl, top: 540 - tamGrande * 0.95, width: 2, height: tamGrande * 1.25 * (1 - wipe * 0.7), background: B, transform: `skewX(${-Math.atan(incl) * 57.3}deg)`, transformOrigin: 'bottom'}} />
        )}
        {/* palavra 3: sai de baixo da régua curta, à direita */}
        {f >= 46 && (() => {
          const esq = interpolate(f, [46, 52, 56, 63], [616, 387, 387, 99], {...cl, easing: rapido});
          return <div style={{position: 'absolute', left: esq, top: 733, width: 616 - esq, height: 2, background: B, opacity: 0.55}} />;
        })()}
        <div style={{position: 'absolute', right: 99, top: 656, height: 100, overflow: 'hidden'}}>
          <div style={{...pequeno, fontSize: 82, transform: `translateY(${(1 - sp(47, 12, 160)) * -100}%)`}}>{partes[2]}</div>
        </div>
        {/* palavra 5: chega em 4 fatias horizontais de lados alternados, fora de registro, depois trava */}
        {f >= 70 && [0, 1, 2, 3].map((i) => {
          const lado = i % 2 === 0 ? -1 : 1;
          const off = trava ? 0 : (1 - fat[i]) * 900 * lado + (f >= 80 ? lado * 14 * (i % 3 === 0 ? 1 : -0.6) : 0);
          const top = (i / 4) * 100;
          return (
            <div key={i} style={{position: 'absolute', left: 268, top: 1125 - tamFinal * 0.86, ...grande, fontSize: tamFinal, clipPath: `inset(${top}% -10% ${100 - top - 25}% -10%)`, transform: `translateX(${off}px)`, filter: !trava && fat[i] < 0.9 ? 'url(#mbx07)' : undefined}}>{partes[4]}</div>
          );
        })}
        {/* palavra 4: escorrega de baixo da palavra enorme, para a esquerda */}
        <div style={{position: 'absolute', left: 99, top: 1052, width: 160, height: 90, overflow: 'hidden'}}>
          <div style={{...pequeno, fontSize: 82, transform: `translateX(${(1 - sp(88, 13, 170)) * 120}%)`}}>{partes[3]}</div>
        </div>
        {/* régua de fecho */}
        <div style={{position: 'absolute', left: 99, top: 1237, width: 837 * regra(92), height: 2, background: B, opacity: 0.55}} />
      </div>
    </AbsoluteFill>
  );
};
