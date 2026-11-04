// cena37 — Rosca de partes (2D, SVG). Fatias varrem em sentido horário, o total soma no meio,
// a última fatia (a da história) sai do anel.
import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadSora} from '@remotion/google-fonts/Sora';
import {loadFont as loadInter} from '@remotion/google-fonts/InterTight';

const {fontFamily: SORA} = loadSora('normal', {weights: ['700'], subsets: ['latin']});
const {fontFamily: INTER} = loadInter('normal', {weights: ['600'], subsets: ['latin']});

export type Fatia = {nome: string; valor: number; cor?: string};
export type Cena37Props = {
  titulo?: string;
  contexto?: string;
  prefixo?: string;
  rotuloCentro?: string;
  fatias?: Fatia[]; // a última é a fatia herói
  corHeroi?: string;
  width?: number;
  height?: number;
  duracao?: number;
};

const TONS = ['#4C6C9C', '#2E9195', '#A4BB9B', '#A7AFBC', '#D49CA3'];
const CX = 540;
const CY = 610;
const RE = 330; // raio externo
const RI = 218; // raio interno
const GAP = 1.6; // graus

const setor = (a0: number, a1: number, ri: number, re: number, dx = 0, dy = 0) => {
  if (a1 - a0 < 0.2) return '';
  const p = (a: number, r: number) => {
    const t = ((a - 90) * Math.PI) / 180;
    return `${(CX + dx + r * Math.cos(t)).toFixed(2)} ${(CY + dy + r * Math.sin(t)).toFixed(2)}`;
  };
  const big = a1 - a0 > 180 ? 1 : 0;
  return `M${p(a0, re)} A${re} ${re} 0 ${big} 1 ${p(a1, re)} L${p(a1, ri)} A${ri} ${ri} 0 ${big} 0 ${p(a0, ri)} Z`;
};

export const Cena37: React.FC<Cena37Props> = ({
  titulo = 'Para onde vão R$ 100',
  contexto = 'Exemplo: uma cafeteria de bairro',
  prefixo = 'R$',
  rotuloCentro = 'das vendas',
  fatias = [
    {nome: 'Café e comida', valor: 31},
    {nome: 'Equipe', valor: 28},
    {nome: 'Aluguel', valor: 14},
    {nome: 'Taxas e outros', valor: 9},
    {nome: 'Marketing', valor: 8},
    {nome: 'Lucro', valor: 10},
  ],
  corHeroi = '#12A150',
  width = 1080,
  height = 1350,
  duracao = 150,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = duracao / 150;
  const k = Math.min(width / 1080, height / 1350);
  const total = fatias.reduce((a, f) => a + f.valor, 0);
  const n = fatias.length;
  const cores = fatias.map((f, i) => f.cor ?? (i === n - 1 ? corHeroi : TONS[i % TONS.length]));

  const inicio = (i: number) => (-4 + i * 10) * s;
  const prog = fatias.map((_, i) => spring({frame: frame - inicio(i), fps, config: {damping: 13, stiffness: 120}, durationInFrames: 22 * s}));
  const pousou = (i: number) => frame >= inicio(i) + 12 * s;
  const tHeroi = inicio(n - 1) + 20 * s;
  const sai = spring({frame: frame - tHeroi, fps, config: {damping: 11, stiffness: 180}});
  const escurece = interpolate(frame, [tHeroi, tHeroi + 8 * s], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // batida do anel a cada pouso
  let batida = 0;
  fatias.forEach((_, i) => {
    const dt = frame - (inicio(i) + 12 * s);
    if (dt >= 0 && dt < 8) batida += Math.sin((dt / 8) * Math.PI) * 6;
  });

  let ang = 0;
  const caminhos = fatias.map((f, i) => {
    const span = (f.valor / total) * 360;
    const a0 = ang + GAP / 2;
    ang += span;
    const a1 = a0 + Math.max(0, (span - GAP) * prog[i]);
    const heroi = i === n - 1;
    const meio = ((a0 + (a0 + span - GAP)) / 2 - 90) * (Math.PI / 180);
    const dist = heroi ? 26 * sai : 0;
    const grosso = heroi ? 10 * sai : 0;
    const cor = heroi ? cores[i] : interpolateColors(escurece, [0, 1], [cores[i], interpolateColors(0.38, [0, 1], [cores[i], '#FFFFFF'])]);
    return (
      <path key={i} d={setor(a0, a1, RI - grosso / 2 - batida * 0.3, RE + grosso / 2 + batida, Math.cos(meio) * dist, Math.sin(meio) * dist)}
        fill={cor} stroke={cor} strokeWidth={14} strokeLinejoin="round"
        style={heroi ? {filter: `drop-shadow(0 ${10 * sai}px ${14 * sai}px rgba(10,40,20,${0.28 * sai}))`} : undefined} />
    );
  });

  const soma = Math.round(fatias.reduce((a, f, i) => a + f.valor * Math.min(1, prog[i]), 0));
  const digitos = String(soma).length;

  return (
    <AbsoluteFill style={{background: 'linear-gradient(to bottom, #FFFFFF 0%, #F3F5F8 100%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 1080, height: 1350, marginLeft: -540, marginTop: -675, transform: `scale(${k})`}}>
        <div style={{position: 'absolute', left: 64, top: 64, fontFamily: SORA, fontWeight: 700, fontSize: 64, color: '#111418', letterSpacing: -1.5}}>{titulo}</div>
        <div style={{position: 'absolute', left: 66, top: 150, fontFamily: INTER, fontWeight: 600, fontSize: 28, color: '#7B8491'}}>{contexto}</div>
        <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
          <circle cx={CX} cy={CY} r={(RE + RI) / 2} fill="none" stroke="#E6E9EF" strokeWidth={RE - RI + 10} />
          {caminhos}
        </svg>
        <div style={{position: 'absolute', left: CX, top: CY - 20, transform: `translate(-50%, -50%) translateX(${digitos > 2 ? 0 : 0}px)`, textAlign: 'center', whiteSpace: 'nowrap'}}>
          <div style={{fontFamily: SORA, fontWeight: 700, color: '#111418', fontVariantNumeric: 'tabular-nums', letterSpacing: -4, lineHeight: 1}}>
            <span style={{fontSize: 50, verticalAlign: 'top', position: 'relative', top: 18, marginRight: 6}}>{prefixo}</span>
            <span style={{fontSize: 128}}>{soma}</span>
          </div>
          <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 28, color: '#7B8491', marginTop: 10}}>{rotuloCentro}</div>
        </div>
        {/* legenda em duas colunas */}
        <div style={{position: 'absolute', left: 150, right: 120, top: 1020, display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 18, columnGap: 30}}>
          {fatias.map((f, i) => {
            const t0 = inicio(i) + 12 * s;
            const pop = spring({frame: frame - t0, fps, config: {damping: 10, stiffness: 240}});
            const nome = spring({frame: frame - t0 - 3, fps, config: {damping: 18, stiffness: 200}});
            const heroi = i === n - 1;
            const corQ = heroi ? cores[i] : interpolateColors(escurece, [0, 1], [cores[i], interpolateColors(0.38, [0, 1], [cores[i], '#FFFFFF'])]);
            const pill = heroi ? sai : 0;
            if (!pousou(i) && pop < 0.01) return <div key={i} />;
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, height: 60}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '6px 18px 6px 10px', marginLeft: -10, borderRadius: 999,
                  background: `rgba(18,161,80,${0.12 * pill})`, transform: `scale(${1 + 0.06 * pill})`, transformOrigin: '0 50%'}}>
                  <div style={{width: 26, height: 26, borderRadius: 5, background: corQ, transform: `scale(${pop})`}} />
                  <div style={{fontFamily: SORA, fontWeight: 700, fontSize: 38, color: heroi && pill > 0.5 ? corHeroi : interpolateColors(escurece * (heroi ? 0 : 1), [0, 1], ['#111418', '#5c636d']), transform: `scale(${pop})`, transformOrigin: '0 50%', marginRight: 6, fontVariantNumeric: 'tabular-nums'}}>
                    {prefixo} {f.valor}
                  </div>
                  <div style={{overflow: 'hidden', height: 40}}>
                    <div style={{fontFamily: INTER, fontWeight: 600, fontSize: 26, lineHeight: '40px', color: heroi && pill > 0.5 ? corHeroi : '#7B8491', transform: `translateY(${(1 - nome) * 40}px)`}}>{f.nome}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
