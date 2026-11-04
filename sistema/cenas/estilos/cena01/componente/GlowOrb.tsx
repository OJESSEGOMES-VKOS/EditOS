// cena01 — Glow Orb (Orbe de luz). Componente reutilizável (EditOS, cenas/estilos).
// Desenho em espaço 1080x1350 (4:5) centralizado; o fundo preenche qualquer formato (9:16, 4:5, 16:9).
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Outfit';

const {fontFamily} = loadFont('normal', {weights: ['500'], subsets: ['latin', 'latin-ext']});

export type GlowOrbProps = {
  frase?: string;
  largura?: number;
  altura?: number;
  cores?: {fundo: string; halo: string; haloFim: string; orbe: string; orbeLuz: string; linha: string};
  inicioTexto?: number; // quadro em que o texto começa a subir
  inicioAnel?: number; // quadro do "expirar" que solta o anel
};

const CORES = {fundo: '#070304', halo: '#531829', haloFim: '#13050B', orbe: '#F696DE', orbeLuz: '#FBF6F8', linha: '#F6EFF2'};

// círculos de contorno: x, y (no espaço 1080x1350), raio, profundidade (0 longe .. 1 perto)
const CIRCULOS = [
  [250, 210, 48, 0.3], [830, 170, 34, 0.15], [900, 390, 92, 0.9], [150, 700, 40, 0.4],
  [960, 1010, 50, 0.55], [330, 1330, 70, 0.8], [840, 1290, 40, 0.5], [70, 1120, 46, 0.6],
] as const;

export const GlowOrb: React.FC<GlowOrbProps> = ({
  frase = 'Esteja presente.',
  largura,
  altura,
  cores = CORES,
  inicioTexto = 28,
  inicioAnel = 100,
}) => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const W = largura ?? width;
  const H = altura ?? height;
  const s = Math.min(W / 1080, H / 1350);

  // respiração do orbe: recua um pouco, um respiro fundo com ~10% de passagem, depois respira devagar
  const recuo = interpolate(f, [0, 4], [0, -0.06], {extrapolateRight: 'clamp'});
  const respiro = spring({frame: f - 4, fps, config: {damping: 9, stiffness: 70, mass: 1}});
  const lento = 0.025 * Math.sin(((f - 30) / 90) * Math.PI * 2) * interpolate(f, [24, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const expira = interpolate(f, [inicioAnel - 6, inicioAnel, inicioAnel + 14], [0, -0.06, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const escala = 0.5 + recuo + 0.5 * respiro + lento + expira;
  const luz = 0.5 + 0.5 * spring({frame: f - 7, fps, config: {damping: 12, stiffness: 60}}) + lento * 0.6; // a luz atrasa o corpo
  const R = 118 * escala; // raio final ~ 236 px de diâmetro
  const cx = 540;
  const cy = 600;

  // empurrão de câmera em direção ao orbe, perde velocidade numa cauda longa
  const empurra = 0.09 * (1 - Math.exp(-f / 55));

  // anel que se solta do aro e vira órbita
  const anel = spring({frame: f - inicioAnel, fps, config: {damping: 11, stiffness: 55}});
  const raioAnel = R * (1 + 1.0 * anel);

  const letras = Array.from(frase);
  const fimTexto = inicioTexto + letras.length * 2.5 + 10;
  const aperto = interpolate(f, [inicioTexto, fimTexto], [0.06, -0.03], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

  return (
    <AbsoluteFill style={{backgroundColor: cores.fundo, overflow: 'hidden'}}>
      {/* halo rosa profundo que morre antes dos cantos */}
      <div
        style={{
          position: 'absolute', left: W / 2 - 900 * s, top: H / 2 + (cy - 675) * s - 900 * s, width: 1800 * s, height: 1800 * s,
          background: `radial-gradient(circle, ${cores.halo} 0%, ${cores.halo}cc 14%, ${cores.haloFim} 42%, ${cores.fundo}00 62%)`,
          opacity: 0.55 + 0.45 * luz,
          transform: `scale(${0.85 + 0.15 * luz})`,
        }}
      />
      {/* grão fino em movimento para o degradê não fazer faixas */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'screen'}}>
        <filter id="g01"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 30} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width={W} height={H} filter="url(#g01)" />
      </svg>
      <div style={{position: 'absolute', left: (W - 1080 * s) / 2, top: (H - 1350 * s) / 2, width: 1080, height: 1350, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        {/* círculos com paralaxe */}
        {CIRCULOS.map(([x, y, r, d], i) => {
          const k = 1 + empurra * (0.4 + 1.6 * d);
          const px = cx + (x - cx) * k;
          const py = cy + (y - cy) * k;
          const rr = r * (1 + empurra * d * 1.2);
          return (
            <div key={i} style={{position: 'absolute', left: px - rr, top: py - rr, width: rr * 2, height: rr * 2, borderRadius: '50%', border: `${1.5 + d * 1.5}px solid ${cores.linha}`, opacity: 0.35 + 0.55 * d}} />
          );
        })}
        {/* anel em órbita */}
        {f >= inicioAnel && (
          <div style={{position: 'absolute', left: cx - raioAnel, top: cy - raioAnel, width: raioAnel * 2, height: raioAnel * 2, borderRadius: '50%', border: `2px solid ${cores.linha}`, opacity: 0.55 - 0.15 * anel}} />
        )}
        {/* o orbe */}
        <div
          style={{
            position: 'absolute', left: cx - R, top: cy - R, width: R * 2, height: R * 2, borderRadius: '50%',
            background: `radial-gradient(circle at 62% 70%, #fde8f6 0%, #f9b6e8 30%, ${cores.orbe} 62%, #f8a8e4 82%, ${cores.orbeLuz} 100%)`,
            boxShadow: `0 0 0 ${3}px ${cores.orbeLuz}ee, 0 0 ${18 * luz}px ${6 * luz}px ${cores.orbe}cc, 0 0 ${70 * luz}px ${20 * luz}px ${cores.orbe}55, 0 0 ${160 * luz}px ${40 * luz}px ${cores.halo}aa, inset 0 0 ${20}px ${cores.orbeLuz}`,
          }}
        />
        {/* a frase: letra a letra saindo de uma máscara */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', overflow: 'hidden', paddingTop: 20, paddingBottom: 30}}>
          <div style={{fontFamily, fontWeight: 500, fontSize: 100, color: cores.linha, letterSpacing: `${aperto}em`, whiteSpace: 'pre', lineHeight: 1}}>
            {letras.map((c, i) => {
              const sp = spring({frame: f - inicioTexto - i * 2.5, fps, config: {damping: 10, stiffness: 140}});
              return (
                <span key={i} style={{display: 'inline-block', transform: `translateY(${(1 - sp) * 150}px)`}}>{c}</span>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
