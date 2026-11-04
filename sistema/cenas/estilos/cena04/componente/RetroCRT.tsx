// cena04 — Retro CRT Glow (TV de tubo). Componente reutilizável (EditOS, cenas/estilos).
// Desenho em espaço 1080x1350 (4:5) centralizado; o tubo preenche qualquer formato.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont as loadTitulo} from '@remotion/google-fonts/Syncopate';
import {loadFont as loadMono} from '@remotion/google-fonts/ShareTechMono';

const {fontFamily: titulo} = loadTitulo('normal', {weights: ['700'], subsets: ['latin']});
const {fontFamily: mono} = loadMono('normal', {weights: ['400'], subsets: ['latin']});

export type RetroCRTProps = {
  linhas?: [string, string]; // título em duas linhas (maiúsculas)
  sistema?: string; // linha de sistema digitada
  duracao?: number; // em quadros; a saída acontece no fim
  largura?: number;
  altura?: number;
  tamanhoTitulo?: number;
  cores?: {tubo: string; vidro: string; nucleo: string; bloom: string; acento: string};
};

const CORES = {tubo: '#07090F', vidro: '#0B0E16', nucleo: '#FCFBF8', bloom: '#FF9A90', acento: '#F05A4A'};
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const RetroCRT: React.FC<RetroCRTProps> = ({
  linhas = ['FIQUE', 'LIGADO'],
  sistema = 'SINAL CAPTURADO',
  duracao,
  largura,
  altura,
  tamanhoTitulo = 150,
  cores = CORES,
}) => {
  const f = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();
  const D = duracao ?? durationInFrames;
  const W = largura ?? width;
  const H = altura ?? height;
  const s = Math.min(W / 1080, H / 1350);
  const cy = 735; // linha de abertura (meio do título)

  // abertura: linha incha, abre em duas bordas, a imagem desdobra com ~10% de passagem (~12 quadros)
  const incha = interpolate(f, [0, 4], [1, 1.8], cl);
  const abre = spring({frame: f - 4, fps, config: {damping: 9, stiffness: 160}});
  // saída: mais rápida, fecha na linha em ~9 quadros; depois a linha estreita de volta ao estado inicial
  const tFecha = D - 32;
  const fecha = interpolate(f, [tFecha, tFecha + 9], [0, 1], {...cl, easing: Easing.in(Easing.cubic)});
  const sy = Math.max(0.006, abre * (1 - fecha) + 0.006);
  const quente = interpolate(f, [6, 22], [1, 0], cl) + fecha * 0.8;
  const linhaVis = f < 9 || fecha > 0.85;
  const linhaLarg = f < 9 ? interpolate(f, [0, 6], [0.8, 0.86], cl) : interpolate(f, [tFecha + 9, D - 1], [0.86, 0.74], cl);
  const linhaGrossa = f < 9 ? incha * 6 : interpolate(f, [tFecha + 6, tFecha + 10, D - 1], [14, 8, 5], cl);

  // texto de sistema
  const tDig = 30;
  const n = Math.max(0, Math.min(sistema.length, Math.floor((f - tDig) / 1.5)));
  const fimDig = tDig + sistema.length * 1.5;
  const ponto = spring({frame: f - fimDig, fps, config: {damping: 8, stiffness: 220}});
  const fase = (f - fimDig) % 24;
  const cursor = f < fimDig ? 1 : fase < 12 ? 1 : interpolate(fase, [12, 16], [1, 0.15], cl);

  const flicker = 1 + 0.01 * Math.sin(f * 2.3) * Math.sin(f * 0.7);
  const humY = ((f * 4) % 1700) - 200;
  const wobble = quente * Math.sin(f * 1.9) * 6;
  const brilho = (1 + quente * 0.7) * flicker;

  const bloom = `0 0 3px ${cores.nucleo}, 0 0 10px ${cores.bloom}, 0 0 26px ${cores.bloom}dd, 0 0 70px ${cores.bloom}88`;
  const franja = quente * 5 + 1.2;

  return (
    <AbsoluteFill style={{backgroundColor: '#020306', overflow: 'hidden'}}>
      {/* face do tubo */}
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 48%, ${cores.vidro} 0%, ${cores.tubo} 70%, #030408 100%)`}} />
      <div style={{position: 'absolute', left: (W - 1080 * s) / 2, top: (H - 1350 * s) / 2, width: 1080, height: 1350, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        {/* a imagem: título + sistema, desdobrando a partir da linha */}
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${cy}px) scaleY(${sy}) translateY(${-cy}px) translateX(${wobble}px)`, filter: `brightness(${brilho})`}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: cy - tamanhoTitulo * 1.25, textAlign: 'center', fontFamily: titulo, fontWeight: 700, fontSize: tamanhoTitulo, letterSpacing: '0.06em', lineHeight: 1.12, color: cores.nucleo, textShadow: `${-franja}px 0 1px rgba(255,60,60,${0.35 * Math.min(1, quente + 0.3)}), ${franja}px 0 1px rgba(80,120,255,${0.3 * Math.min(1, quente + 0.3)}), ${bloom}`}}>
            {linhas[0]}<br />{linhas[1]}
          </div>
          <div style={{position: 'absolute', left: 150, top: cy + tamanhoTitulo * 1.55, fontFamily: mono, fontSize: 44, letterSpacing: '0.22em', color: cores.nucleo, opacity: 0.82, display: 'flex', alignItems: 'center', textShadow: `0 0 8px ${cores.bloom}88`}}>
            <div style={{width: 12, height: 12, borderRadius: 6, background: cores.acento, marginRight: 18, transform: `scale(${f >= fimDig ? 0.6 + 0.4 * ponto : 0.6})`, opacity: f >= fimDig ? 1 : 0.35, boxShadow: `0 0 10px ${cores.acento}`}} />
            {f >= tDig - 6 && <span style={{whiteSpace: 'pre'}}>{sistema.slice(0, n)}</span>}
            {f >= tDig - 6 && <span style={{display: 'inline-block', width: 24, height: 44, marginLeft: 4, background: cores.nucleo, opacity: cursor}} />}
          </div>
        </div>
        {/* bordas que correm ao abrir */}
        {f >= 4 && f < 18 && [-1, 1].map((d) => (
          <div key={d} style={{position: 'absolute', left: 80, right: 80, top: cy + d * sy * 200 - 2, height: 4, background: cores.nucleo, opacity: interpolate(f, [4, 17], [1, 0], cl), boxShadow: `0 0 18px 6px ${cores.bloom}aa`}} />
        ))}
        {/* a linha acesa (abertura e saída) */}
        {linhaVis && (
          <div style={{position: 'absolute', left: 540 - (1080 * linhaLarg) / 2, width: 1080 * linhaLarg, top: cy - linhaGrossa / 2, height: linhaGrossa, borderRadius: linhaGrossa, background: `linear-gradient(90deg, ${cores.bloom}00, ${cores.nucleo} 12%, ${cores.nucleo} 88%, ${cores.bloom}00)`, boxShadow: `0 0 12px 3px ${cores.bloom}cc, 0 0 40px 10px ${cores.bloom}55`}} />
        )}
      </div>
      {/* barra de zumbido rolando */}
      <div style={{position: 'absolute', left: 0, right: 0, top: humY * s, height: 260 * s, background: 'linear-gradient(180deg, #ffffff00, #ffffff0a, #ffffff00)'}} />
      {/* linhas de varredura curvas + neve + brilho do vidro + vinheta da borda arredondada */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern id="scan04" width={W} height={4 * s} patternUnits="userSpaceOnUse"><rect width={W} height={1.6 * s} fill="#000" opacity={0.25} /></pattern>
          <filter id="neve04"><feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="1" seed={f} /><feColorMatrix type="saturate" values="0" /></filter>
        </defs>
        <g style={{transformOrigin: 'center', transform: 'scale(1.02, 1)'}}><rect width={W} height={H} fill="url(#scan04)" /></g>
        <rect width={W} height={H} filter="url(#neve04)" opacity={0.05 + quente * 0.05} style={{mixBlendMode: 'screen'}} />
      </svg>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(120deg, #ffffff00 30%, #ffffff07 45%, #ffffff00 60%)'}} />
      <div style={{position: 'absolute', inset: -2, borderRadius: `${8 * s}% / ${6 * s}%`, boxShadow: `inset 0 0 ${160 * s}px ${60 * s}px #000000dd, inset 0 0 ${40 * s}px ${10 * s}px #000`}} />
    </AbsoluteFill>
  );
};
