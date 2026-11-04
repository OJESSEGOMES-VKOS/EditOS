// cena29 — Produto girando (3D edição: CSS 3D, sem Blender).
// Um produto cilíndrico fechado gira num prato escuro; a câmera desce do 3/4 alto ao ângulo herói;
// quatro chamadas finas saem uma a uma. Palco desenhado em 1080x1350 e escalado para qualquer formato.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadManrope} from '@remotion/google-fonts/Manrope';
import {loadFont as loadMono} from '@remotion/google-fonts/DMMono';

const {fontFamily: MANROPE} = loadManrope('normal', {weights: ['600'], subsets: ['latin']});
const {fontFamily: MONO} = loadMono('normal', {weights: ['500'], subsets: ['latin']});

export type Chamada = {valor: string; legenda: string; lado: 'esq' | 'dir'; y: number};

export type Cena29Props = {
  nome?: string;
  chamadas?: Chamada[]; // até 4; y em px do palco (de -260 topo do produto a 170 base)
  corCorpo?: string;
  corMetal?: string;
  width?: number;
  height?: number;
  duracao?: number; // quadros (padrão 150)
};

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const tom = (h: string, k: number) => {
  const [r, g, b] = hex(h).map((c) => Math.max(0, Math.min(255, Math.round(c * k))));
  return `rgb(${r},${g},${b})`;
};

const R = 186; // raio do produto
const TOPO = -318;
const BASE = 176; // topo do prato
const N = 64;

const Grao: React.FC<{op?: number}> = ({op = 0.07}) => (
  <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: op, mixBlendMode: 'overlay'}}>
    <filter id="g29">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#g29)" />
  </svg>
);

// Produto + prato. rotY = giro do produto; dim escurece (cópia do reflexo no chão).
const Produto: React.FC<{rotY: number; corCorpo: string; corMetal: string; dim: number}> = ({rotY, corCorpo, corMetal, dim}) => {
  const w = (2 * Math.PI * R) / N + 1.2;
  const h = BASE - TOPO;
  const slats = [];
  for (let i = 0; i < N; i++) {
    const phi = (i * 360) / N;
    const th = ((phi - rotY) * Math.PI) / 180; // normal no mundo (0 = de frente)
    const dif = Math.max(0, Math.cos(th + 0.75)); // luz principal à esquerda-frente
    const borda = Math.pow(Math.abs(Math.sin(th)), 7) * (Math.cos(th) > -0.2 ? 1 : 0);
    const k = (0.42 + 0.55 * dif + 1.15 * borda) * dim;
    const km = (0.5 + 0.75 * dif + 1.0 * borda) * dim;
    slats.push(
      <div
        key={i}
        style={{
          position: 'absolute', left: -w / 2, top: TOPO, width: w, height: h,
          transform: `rotateY(${phi}deg) translateZ(${R}px)`, backfaceVisibility: 'hidden',
          background: `linear-gradient(to bottom, ${tom(corMetal, km * 0.95)} 0px, ${tom(corMetal, km * 0.6)} 34px, ${tom(corCorpo, k * 0.5)} 36px, ${tom(corCorpo, k * 0.5)} 40px, transparent 40px, transparent ${h - 34}px, ${tom(corCorpo, k * 0.5)} ${h - 34}px, ${tom(corMetal, km * 0.75)} ${h - 31}px, ${tom(corMetal, km * 0.45)} ${h}px),
            linear-gradient(to right, ${tom(corCorpo, k * 0.78)}, ${tom(corCorpo, k * 1.08)} 45%, ${tom(corCorpo, k * 0.7)})`,
        }}
      />,
    );
  }
  // prato
  const RP = 300;
  const NP = 90;
  const wp = (2 * Math.PI * RP) / NP + 1.5;
  const lados = [];
  for (let i = 0; i < NP; i++) {
    const phi = (i * 360) / NP;
    const th = (phi * Math.PI) / 180; // o prato não gira visivelmente (é liso)
    const k = (0.5 + 0.6 * Math.max(0, Math.cos(th + 0.6)) + 0.8 * Math.pow(Math.abs(Math.sin(th)), 10)) * dim;
    lados.push(
      <div key={i} style={{position: 'absolute', left: -wp / 2, top: BASE, width: wp, height: 14,
        transform: `rotateY(${phi}deg) translateZ(${RP}px)`, backfaceVisibility: 'hidden',
        background: `linear-gradient(to bottom, ${tom('#3a3e45', k)}, ${tom('#121418', k)})`}} />,
    );
  }
  const disco = (r: number, y: number, bg: string, extra: React.ReactNode = null) => (
    <div style={{position: 'absolute', left: -r, top: -r, width: 2 * r, height: 2 * r, borderRadius: '50%',
      transform: `translateY(${y}px) rotateX(90deg)`, background: bg}}>{extra}</div>
  );
  const botoes = [0, 90, 180, 270].map((a) => {
    const rr = 92;
    const x = Math.cos((a * Math.PI) / 180) * rr;
    const y = Math.sin((a * Math.PI) / 180) * rr;
    return (
      <div key={a} style={{position: 'absolute', left: R + x - 26, top: R + y - 26, width: 52, height: 52, borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, ${tom(corMetal, 1.6 * dim)}, ${tom(corMetal, 0.7 * dim)} 70%)`,
        boxShadow: `inset 0 0 0 2px ${tom('#1a1c20', dim)}`}} />
    );
  });
  return (
    <div style={{position: 'absolute', transformStyle: 'preserve-3d'}}>
      {lados}
      {disco(RP, BASE, `radial-gradient(circle, ${tom('#2e3238', dim)} 0%, ${tom('#24272c', dim)} 60%, ${tom('#3a3f47', dim)} 95%, ${tom('#9aa0a8', dim)} 99%)`)}
      {/* contato do produto no prato */}
      {disco(R + 30, BASE - 0.5, `radial-gradient(circle, rgba(0,0,0,${0.7 * dim}) 55%, transparent 72%)`)}
      <div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: `rotateY(${-rotY}deg)`}}>
        {slats}
        {/* tampa escovada: o brilho radial fica fixo na luz, o escovado gira */}
        {disco(R, TOPO, `repeating-radial-gradient(circle, ${tom(corMetal, 0.62 * dim)} 0 2px, ${tom(corMetal, 0.5 * dim)} 2px 4px)`,
          <>
            <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(from ${rotY + 200}deg, rgba(255,255,255,${0.55 * dim}), transparent 50deg, rgba(0,0,0,${0.25 * dim}) 120deg, transparent 180deg, rgba(255,255,255,${0.4 * dim}) 230deg, transparent 290deg, rgba(255,255,255,${0.55 * dim}))`}} />
            <div style={{position: 'absolute', left: R - 44, top: R - 44, width: 88, height: 88, borderRadius: '50%', background: tom('#2a2d33', dim)}} />
            {botoes}
          </>)}
        {disco(R - 1, BASE - 1, tom('#16181b', dim))}
        {/* pequena janela de indicador na frente, sem marca */}
        <div style={{position: 'absolute', left: -38, top: BASE - 70, width: 76, height: 20, borderRadius: 10,
          transform: `translateZ(${R + 1.5}px)`, background: tom('#1a1c20', dim), boxShadow: `inset 0 0 0 2px ${tom(corMetal, 0.8 * dim)}`}} />
      </div>
    </div>
  );
};

export const Cena29: React.FC<Cena29Props> = ({
  nome = 'Eco Um',
  chamadas = [
    {valor: 'IP67', legenda: 'À PROVA D’ÁGUA', lado: 'esq', y: -280},
    {valor: '360°', legenda: 'SOM', lado: 'dir', y: -190},
    {valor: '40 h', legenda: 'BATERIA', lado: 'esq', y: -60},
    {valor: '480 g', legenda: 'PESO', lado: 'dir', y: 80},
  ],
  corCorpo = '#353940',
  corMetal = '#8A8F98',
  width = 1080,
  height = 1350,
  duracao = 150,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = (q: number) => (q * duracao) / 150; // tempos escalam com a duração
  const k = Math.min(width / 1080, height / 1350);

  const rotY = interpolate(frame, [0, t(114)], [-118, 0], {extrapolateRight: 'clamp', easing: Easing.bezier(0.25, 0.1, 0.25, 1)});
  const cam = interpolate(frame, [0, t(84)], [30, 9], {extrapolateRight: 'clamp', easing: Easing.bezier(0.45, 0, 0.2, 1)});
  const zoom = interpolate(frame, [0, t(84)], [-120, 0], {extrapolateRight: 'clamp', easing: Easing.bezier(0.45, 0, 0.2, 1)});

  const callout = (c: Chamada, i: number) => {
    const t0 = t(30 + i * 10);
    const pop = spring({frame: frame - t0, fps, config: {damping: 12, stiffness: 260}});
    const linha = interpolate(frame, [t0 + 2, t0 + 7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
    const val = spring({frame: frame - t0 - 5, fps, config: {damping: 11, stiffness: 200}});
    const leg = spring({frame: frame - t0 - 8, fps, config: {damping: 20, stiffness: 200}});
    const esq = c.lado === 'esq';
    const x = (esq ? -1 : 1) * R * 0.86;
    const L = 84;
    return (
      <div key={i} style={{position: 'absolute', transformStyle: 'preserve-3d',
        transform: `translate3d(${x}px, ${c.y}px, ${R * 0.5}px) rotateX(${-cam}deg)`}}>
        <div style={{position: 'absolute', left: -6, top: -6, width: 12, height: 12, borderRadius: 6, background: '#F1F3F6', transform: `scale(${pop})`}} />
        <div style={{position: 'absolute', top: -1, height: 2, width: L * linha, background: 'rgba(205,210,218,0.85)', [esq ? 'right' : 'left']: 0}} />
        <div style={{position: 'absolute', top: -46, [esq ? 'right' : 'left']: L + 18, textAlign: esq ? 'right' : 'left', whiteSpace: 'nowrap'}}>
          <div style={{overflow: 'hidden', height: 66}}>
            <div style={{fontFamily: MANROPE, fontWeight: 600, fontSize: 58, letterSpacing: -1.5, color: '#F1F3F6', lineHeight: '66px', transform: `translateY(${(1 - val) * 66}px)`}}>{c.valor}</div>
          </div>
          <div style={{overflow: 'hidden', height: 34}}>
            <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 25, letterSpacing: 2.5, color: '#8C939D', lineHeight: '34px', transform: `translateY(${(1 - leg) * 34}px)`}}>{c.legenda}</div>
          </div>
        </div>
      </div>
    );
  };

  const cena = (dim: number, espelho: boolean) => (
    <div style={{position: 'absolute', left: 540, top: 0, transformStyle: 'preserve-3d',
      transform: `translateY(735px) translateZ(${zoom}px) rotateX(${-cam}deg)${espelho ? ` translateY(${2 * (BASE + 14)}px) scaleY(-1)` : ''}`}}>
      <Produto rotY={rotY} corCorpo={corCorpo} corMetal={corMetal} dim={dim} />
      {!espelho && chamadas.slice(0, 4).map(callout)}
    </div>
  );

  return (
    <AbsoluteFill style={{background: 'linear-gradient(to bottom, #090A0C 0%, #121418 45%, #16181C 70%, #0b0c0e 100%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 1080, height: 1350, marginLeft: -540, marginTop: -675, transform: `scale(${k})`}}>
        {/* poça de luz no chão */}
        <div style={{position: 'absolute', left: 90, top: 820, width: 900, height: 360, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(48,52,59,0.9), rgba(48,52,59,0) 70%)'}} />
        <div style={{position: 'absolute', inset: 0, perspective: 2400, perspectiveOrigin: '540px 600px'}}>
          {cena(0.22, true)}
        </div>
        {/* o reflexo some para o fundo */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 960, bottom: 0, background: 'linear-gradient(to bottom, rgba(14,15,18,0) 0%, rgba(12,13,15,0.85) 30%, #0b0c0e 60%)'}} />
        <div style={{position: 'absolute', inset: 0, perspective: 2400, perspectiveOrigin: '540px 600px'}}>
          {cena(1, false)}
        </div>
        <div style={{position: 'absolute', top: 92, width: '100%', textAlign: 'center', fontFamily: MANROPE, fontWeight: 600, fontSize: 98, letterSpacing: -3, color: '#F1F3F6'}}>{nome}</div>
      </div>
      <Grao />
    </AbsoluteFill>
  );
};
