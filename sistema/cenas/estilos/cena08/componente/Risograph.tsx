// cena08 — Risograph (Risografia). Componente reutilizável (EditOS, cenas/estilos).
// Pôster de duas tintas (rosa e azul, que multiplicam em violeta) se imprimindo em stop motion "em dois".
// Desenho em espaço 1080x1350 (4:5) centralizado; o papel preenche qualquer formato.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/BricolageGrotesque';

const {fontFamily} = loadFont('normal', {weights: ['800'], subsets: ['latin', 'latin-ext']});

export type RisographProps = {
  palavra1?: string; // topo, nas duas tintas
  palavra2?: string; // vazada no círculo rosa
  palavra3?: string; // sobre a faixa listrada
  tam1?: number;
  tam3?: number;
  largura?: number;
  altura?: number;
  cores?: {papel: string; rosa: string; azul: string};
};

const CORES = {papel: '#EDEFEE', rosa: '#FF48B0', azul: '#3255A4'};

export const Risograph: React.FC<RisographProps> = ({
  palavra1 = 'TINTA',
  palavra2 = 'EM',
  palavra3 = 'MOVIMENTO',
  tam1 = 262,
  tam3 = 128,
  largura,
  altura,
  cores = CORES,
}) => {
  const fr = useCurrentFrame();
  const f = Math.floor(fr / 2) * 2; // animação "em dois": cada desenho segura 2 quadros
  const {fps, width, height} = useVideoConfig();
  const W = largura ?? width;
  const H = altura ?? height;
  const s = Math.min(W / 1080, H / 1350);
  const seed = f / 2;

  const carimbo = (d: number) => (f < d ? null : {e: spring({frame: f - d, fps, from: 1.14, to: 1, config: {damping: 7, stiffness: 160}}), r: spring({frame: f - d, fps, from: 3, to: 0, config: {damping: 9, stiffness: 160}})});
  const desliza = (d: number) => spring({frame: f - d, fps, config: {damping: 9, stiffness: 120}});

  // deslize de registro: as chapas chutam ~25px e voltam passando do ponto
  const slip = f >= 86 ? spring({frame: f - 86, fps, config: {damping: 7, stiffness: 140}}) : 0;
  const slipAmt = f >= 86 ? (1 - slip) : 0;
  const rx = 2 + -26 * slipAmt;
  const ry = 1 + -18 * slipAmt;

  const tr = (c: {e: number; r: number} | null, cx: number, cy: number) => (c ? `translate(${cx} ${cy}) rotate(${c.r}) scale(${c.e}) translate(${-cx} ${-cy})` : '');

  const cRosa = {x: 369, y: 706, r: 232};
  const bx = interpolate(desliza(0), [0, 1], [1300, 672]);
  const cAzul = {x: bx, y: 560, r: 246};

  // retícula do círculo azul (célula 12px, ângulo próprio da tinta); tom mais denso embaixo à esquerda
  const pontos: [number, number, number][] = [];
  const ang = (15 * Math.PI) / 180;
  for (let i = -22; i <= 22; i++) {
    for (let j = -22; j <= 22; j++) {
      const u = i * 12;
      const v = j * 12;
      const x = u * Math.cos(ang) - v * Math.sin(ang);
      const y = u * Math.sin(ang) + v * Math.cos(ang);
      if (x * x + y * y > (cAzul.r - 3) ** 2) continue;
      const tom = Math.min(1, 0.32 + 0.75 * ((-x + y) / (2 * cAzul.r) + 0.5) ** 1.2);
      pontos.push([x, y, 6.6 * Math.sqrt(tom)]);
    }
  }

  const c1 = carimbo(8);
  const c2 = carimbo(14);
  const faixa = desliza(20);
  const c3 = carimbo(28);
  const nPontos = 12;

  const tinta = (id: string, sd: number) => (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed={sd} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="d" />
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed={sd + 5} result="m" />
      <feColorMatrix in="m" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.7 0 0 0 1.35" result="ma" />
      <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed={sd + 9} result="sp" />
      <feColorMatrix in="sp" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -14 0 0 0 9.6" result="spa" />
      <feComposite in="ma" in2="spa" operator="in" result="mm" />
      <feComposite in="d" in2="mm" operator="in" />
    </filter>
  );

  const texto = (t: string, x: number, y: number, fs: number, cor: string, anchor: 'start' | 'middle' = 'start', ls = '0.05em') => (
    <text x={x} y={y} fontFamily={fontFamily} fontWeight={800} fontSize={fs} letterSpacing={ls} fill={cor} textAnchor={anchor}>{t}</text>
  );

  return (
    <AbsoluteFill style={{backgroundColor: cores.papel, overflow: 'hidden'}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <filter id="pap08"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.5" numOctaves="3" seed={2} /><feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.52  0 0 0 0 0.52  0 0 0 -1 0.62" /></filter>
        <filter id="pap08b"><feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="3" seed={4} /><feColorMatrix type="matrix" values="0 0 0 0 0.6  0 0 0 0 0.62  0 0 0 0 0.62  0 0 0 -1 0.55" /></filter>
        <rect width={W} height={H} filter="url(#pap08)" opacity={0.25} />
        <rect width={W} height={H} filter="url(#pap08b)" opacity={0.25} />
      </svg>
      <div style={{position: 'absolute', left: (W - 1080 * s) / 2, top: (H - 1350 * s) / 2, width: 1080, height: 1350, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <svg width={1080} height={1350} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <defs>
            {tinta('tr08', seed * 3 + 1)}
            {tinta('ta08', seed * 3 + 2)}
            <pattern id="list08" width={22} height={22} patternUnits="userSpaceOnUse" patternTransform={`rotate(45) translate(${(fr * 0.25) % 22} 0)`}>
              <rect width={10} height={22} fill={cores.rosa} />
            </pattern>
          </defs>
          {/* chapa rosa */}
          <g filter="url(#tr08)" style={{mixBlendMode: 'multiply'}} transform={`translate(${rx} ${ry})`}>
            <g transform={tr(carimbo(0) ?? {e: 1, r: 0}, cRosa.x, cRosa.y)}>
              <circle cx={cRosa.x} cy={cRosa.y} r={cRosa.r} fill={cores.rosa} />
            </g>
            {c1 && <g transform={tr(c1, 540, 230)}>{texto(palavra1, 540, 312, tam1, cores.rosa, 'middle')}</g>}
            {f >= 20 && <rect x={99 + (1 - faixa) * -1100} y={985} width={882} height={232} fill="url(#list08)" />}
          </g>
          {/* palavra vazada no círculo rosa (o papel aparece) */}
          {c2 && <g transform={tr(c2, cRosa.x - 20, 706)}>{texto(palavra2, cRosa.x - 20, 742, 112, cores.papel, 'middle')}</g>}
          {/* chapa azul */}
          <g filter="url(#ta08)" style={{mixBlendMode: 'multiply'}} transform={`translate(${-rx * 0.4} ${-ry * 0.4})`}>
            <g transform={`translate(${cAzul.x} ${cAzul.y})`}>
              {pontos.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={cores.azul} />)}
            </g>
            {c1 && <g transform={tr(c1, 540, 230)}>{texto(palavra1, 536, 310, tam1, cores.azul, 'middle')}</g>}
            {c3 && <g transform={tr(c3, 540, 1100)}>{texto(palavra3, 540, 1155, tam3, cores.azul, 'middle', '0.03em')}</g>}
            {Array.from({length: nPontos}, (_, i) => {
              const v = interpolate(f, [34 + i * 1.2, 36 + i * 1.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return v > 0 ? <circle key={i} cx={122 + i * 76} cy={1268} r={(6 + i * 1.3) * v} fill={cores.azul} /> : null;
            })}
          </g>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
