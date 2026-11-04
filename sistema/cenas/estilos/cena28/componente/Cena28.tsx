// cena28 — Versus (tale of the tape). Duas opções frente a frente: nomes batem, VS estoura na costura,
// linhas montam a cada meio segundo com barras que crescem do centro para fora; a última linha é o desfecho.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadBarlow} from '@remotion/google-fonts/BarlowCondensed';

const {fontFamily: ANTON} = loadAnton('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: BARLOW} = loadBarlow('normal', {weights: ['500', '600', '700'], subsets: ['latin', 'latin-ext']});

export type Linha = {rotulo: string; a: number | string; b: number | string; vence: 'a' | 'b'};
export type Cena28Props = {
  nomeA: string;
  nomeB: string;
  subtitulo: string;
  linhas: Linha[]; // até 4; a última é o desfecho
  formato?: (v: number) => string;
  azul?: string;
  laranja?: string;
  width?: number;
  height?: number;
};

const W = 1080;
const H = 1350;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const fmtPadrao = (v: number) => `R$ ${Math.round(v).toLocaleString('pt-BR')}`;

const Check: React.FC<{cor: string; tam: number; k: number; giro?: number}> = ({cor, tam, k, giro = 0}) => (
  <div style={{width: tam, height: tam, borderRadius: tam * 0.24, background: cor, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k}) rotate(${giro}deg)`, flexShrink: 0}}>
    <svg width={tam * 0.7} height={tam * 0.7} viewBox="0 0 24 24"><path d="M5 12.5 L10 17 L19 7" stroke="#fff" strokeWidth={3.6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>
);

export const Cena28: React.FC<Cena28Props> = ({
  nomeA, nomeB, subtitulo, linhas, formato = fmtPadrao, azul = '#3D7BFF', laranja = '#FF7A30', width = W, height = H,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = Math.min(width / W, height / H);
  const CX = W / 2;
  const MEIA = 420; // meia largura da barra

  // nomes já na tela, grandes demais, batendo cada um do seu lado
  const bate = spring({frame: frame + 4, fps, config: {damping: 10, stiffness: 190}});
  const escNome = 1.06 - 0.06 * bate;
  const sublinha = interpolate(frame, [0, 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const vs = spring({frame: frame - 5, fps, config: {damping: 9, stiffness: 200}});
  const sub = interpolate(frame, [6, 13], [1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const tamNome = (_t: string) => Math.min(210, 372 / (0.53 * Math.max(nomeA.length, nomeB.length)));

  const n = linhas.length;
  const TOP = 470;
  const PASSO = 212;

  return (
    <AbsoluteFill style={{background: '#0B0D12', overflow: 'hidden'}}>
      {/* chão dividido por costura inclinada, luz fria pela esquerda e quente pela direita, baixa */}
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 90% at -5% 35%, rgba(61,123,255,0.20) 0%, rgba(61,123,255,0) 70%)'}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 90% at 105% 40%, rgba(255,110,50,0.15) 0%, rgba(255,110,50,0) 70%)'}} />
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <line x1={width / 2 + 40 * s} y1={0} x2={width / 2 - 40 * s} y2={height} stroke="rgba(0,0,0,0.55)" strokeWidth={26 * s} />
        <line x1={width / 2 + 40 * s} y1={0} x2={width / 2 - 40 * s} y2={height} stroke="rgba(255,255,255,0.025)" strokeWidth={2} />
      </svg>
      <div style={{position: 'absolute', left: (width - W * s) / 2, top: (height - H * s) / 2, width: W, height: H, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        {/* nomes */}
        <div style={{position: 'absolute', left: 92, top: 70, width: 400, height: 240, display: 'flex', alignItems: 'flex-end', fontFamily: ANTON, fontSize: tamNome(nomeA), color: '#fff', lineHeight: 1, transform: `translateX(${(1 - bate) * -60}px) scale(${escNome})`, transformOrigin: '0% 100%'}}>{nomeA}</div>
        <div style={{position: 'absolute', right: 92, top: 70, width: 400, height: 240, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', fontFamily: ANTON, fontSize: tamNome(nomeB), color: '#fff', lineHeight: 1, transform: `translateX(${(1 - bate) * 60}px) scale(${escNome})`, transformOrigin: '100% 100%'}}>{nomeB}</div>
        <div style={{position: 'absolute', left: CX - 70 - 400 * sublinha, top: 300, width: 400 * sublinha, height: 9, background: azul, borderRadius: 2}} />
        <div style={{position: 'absolute', left: CX + 70, top: 300, width: 400 * sublinha, height: 9, background: laranja, borderRadius: 2}} />
        {/* VS */}
        <div style={{position: 'absolute', left: CX - 62, top: 302 - tamNome(nomeA) * 0.42 - 62, width: 124, height: 124, borderRadius: 62, background: `conic-gradient(${laranja} 0 180deg, ${azul} 180deg 360deg)`, padding: 7, transform: `scale(${0.6 + 0.4 * vs}) rotate(${(1 - vs) * -30}deg)`, opacity: frame < 5 ? 0 : 1}}>
          <div style={{width: '100%', height: '100%', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ANTON, fontSize: 52, color: '#0B0D12'}}>VS</div>
        </div>
        <div style={{position: 'absolute', top: 345, width: W, height: 44, overflow: 'hidden', textAlign: 'center'}}>
          <div style={{fontFamily: BARLOW, fontWeight: 500, fontSize: 34, color: '#8F96A5', transform: `translateY(${sub * 44}px)`}}>{subtitulo}</div>
        </div>

        {linhas.map((l, i) => {
          const final = i === n - 1;
          const t0 = 8 + i * 13;
          const dur = final ? 26 : 14;
          const y = TOP + i * PASSO + (final ? 30 : 0);
          const rot = interpolate(frame, [t0, t0 + 6], [1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
          const kRaw = interpolate(frame, [t0 + 2, t0 + 2 + dur], [0, 1], clamp);
          const k = kRaw >= 1 ? 1 : Easing.out(Easing.back(final ? 2.2 : 1.6))(kRaw);
          const num = typeof l.a === 'number' && typeof l.b === 'number';
          const mx = num ? Math.max(l.a as number, l.b as number) : 1;
          const fracA = num ? (l.a as number) / mx : l.vence === 'a' ? 1 : 0;
          const fracB = num ? (l.b as number) / mx : l.vence === 'b' ? 1 : 0;
          const kv = Math.min(1, kRaw * 1.05);
          const txtA = num ? formato((l.a as number) * Easing.out(Easing.cubic)(kv)) : (l.a as string);
          const txtB = num ? formato((l.b as number) * Easing.out(Easing.cubic)(kv)) : (l.b as string);
          const fim = t0 + 2 + dur;
          const chip = spring({frame: frame - fim, fps, config: {damping: 9, stiffness: 220}});
          const perdeu = interpolate(frame, [fim, fim + 5], [0, 1], clamp);
          const corA = l.vence === 'a' ? '#fff' : `rgb(${255 - 112 * perdeu},${255 - 105 * perdeu},${255 - 90 * perdeu})`;
          const corB = l.vence === 'b' ? '#fff' : `rgb(${255 - 112 * perdeu},${255 - 105 * perdeu},${255 - 90 * perdeu})`;
          const tamV = final ? 84 + 10 * Math.max(0, Math.sin(interpolate(frame, [fim - 4, fim + 6], [0, Math.PI], clamp))) : 66;
          const espB = final ? 30 : 20;
          const placa = spring({frame: frame - fim - 2, fps, config: {damping: 10, stiffness: 170}});
          const brilho = final ? interpolate(frame, [fim - 2, fim + 14], [-0.3, 1.3], clamp) : -1;
          const flash = final ? interpolate(frame, [fim, fim + 4, fim + 20], [0, 1, 0], clamp) : 0;
          if (frame < t0) {
            return (
              <div key={i} style={{position: 'absolute', left: CX - MEIA, top: y + 118, width: MEIA * 2, height: espB, borderRadius: 4, background: 'rgba(255,255,255,0.05)'}} />
            );
          }
          return (
            <React.Fragment key={i}>
              {final && flash > 0 && (
                <div style={{position: 'absolute', left: l.vence === 'b' ? CX : 0, top: 0, width: CX, height: H, background: `radial-gradient(ellipse 80% 40% at ${l.vence === 'b' ? '70%' : '30%'} 80%, rgba(255,122,48,${0.18 * flash}) 0%, rgba(0,0,0,0) 70%)`}} />
              )}
              {final && (
                <div style={{position: 'absolute', left: 104, top: y - 34, width: W - 208, height: 220, borderRadius: 14, border: `2px solid ${laranja}`, background: 'rgba(255,122,48,0.06)', transform: `scale(${0.92 + 0.08 * placa})`, opacity: placa > 0.02 ? 1 : 0}} />
              )}
              <div style={{position: 'absolute', top: y - 12, width: W, height: 40, overflow: 'hidden', textAlign: 'center'}}>
                <div style={{fontFamily: BARLOW, fontWeight: 600, fontSize: 25, letterSpacing: 4, color: '#8F96A5', transform: `translateY(${rot * 40}px)`}}>{l.rotulo}</div>
              </div>
              <div style={{position: 'absolute', right: W - CX + 22, top: y + 18, height: 96, display: 'flex', alignItems: 'center', gap: 16, fontFamily: BARLOW, fontWeight: 700, fontSize: tamV, color: corA, fontVariantNumeric: 'tabular-nums'}}>
                {l.vence === 'a' && chip > 0.01 && <Check cor={azul} tam={final ? 50 : 42} k={chip} giro={final ? (1 - chip) * -90 : 0} />}
                {txtA}
              </div>
              <div style={{position: 'absolute', left: CX + 22, top: y + 18, height: 96, display: 'flex', alignItems: 'center', gap: 16, fontFamily: BARLOW, fontWeight: 700, fontSize: tamV, color: corB, fontVariantNumeric: 'tabular-nums'}}>
                {txtB}
                {l.vence === 'b' && chip > 0.01 && <Check cor={laranja} tam={final ? 50 : 42} k={chip} giro={final ? (1 - chip) * 90 : 0} />}
              </div>
              {/* trilho + barras do centro para fora */}
              <div style={{position: 'absolute', left: CX - MEIA, top: y + 118, width: MEIA * 2, height: espB, borderRadius: 4, background: 'rgba(255,255,255,0.05)'}} />
              <div style={{position: 'absolute', left: CX - MEIA * fracA * k, top: y + 118, width: MEIA * fracA * k, height: espB, background: azul, borderRadius: '4px 0 0 4px', boxShadow: kRaw < 1 && kRaw > 0 ? `inset 10px 0 8px -4px rgba(255,255,255,0.7)` : 'none'}} />
              <div style={{position: 'absolute', left: CX, top: y + 118, width: MEIA * fracB * k, height: espB, background: laranja, borderRadius: '0 4px 4px 0', overflow: 'hidden', boxShadow: kRaw < 1 && kRaw > 0 ? `inset -10px 0 8px -4px rgba(255,255,255,0.7)` : 'none'}}>
                {brilho > -0.3 && brilho < 1.3 && (
                  <div style={{position: 'absolute', top: 0, bottom: 0, left: `${brilho * 100 - 15}%`, width: '30%', background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)'}} />
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
        <filter id="g28"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="29" /></filter>
        <rect width="100%" height="100%" filter="url(#g28)" />
      </svg>
    </AbsoluteFill>
  );
};
