// cena23 — Notification stack (Pilha de notificações). Tela de bloqueio genérica (sem aparelho, sem marca),
// pedidos caem por cima com mola, empurram os antigos, os mais velhos se escondem atrás da pilha; o total rola dígito a dígito.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Inter';

const {fontFamily: INTER} = loadFont('normal', {weights: ['500', '600', '700'], subsets: ['latin', 'latin-ext']});

export type Pedido = {valor: number; itens: number};
export type Cena23Props = {
  data: string;
  hora: string;
  app: string; // app inventado
  hoje: string; // "Hoje"
  rotuloPedidos: string; // "pedidos"
  agora: string; // "agora"
  linhaPedido: string; // "Novo pedido"
  moeda: string; // "R$"
  totalInicial: number;
  contagemInicial: number;
  pedidos: Pedido[]; // o primeiro já está na tela no quadro 1; o último é o que chega sozinho no fim
  chegadas?: number[]; // quadro de chegada de cada pedido (mesmo tamanho de pedidos)
  maisTexto: string; // "+38 mais"
  quadroMais?: number;
  verde?: string;
  width?: number;
  height?: number;
};

const W = 1080;
const H = 1350;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const fmt = (v: number, casas: number) =>
  v.toLocaleString('pt-BR', {minimumFractionDigits: casas, maximumFractionDigits: casas});

const Icone: React.FC<{tam: number; verde: string}> = ({tam, verde}) => (
  <div style={{width: tam, height: tam, borderRadius: tam * 0.24, background: verde, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
    <svg width={tam * 0.56} height={tam * 0.56} viewBox="0 0 24 24">
      <path d="M5 8 H19 L18 20 H6 Z" fill="#fff" />
      <path d="M9 10 V7 a3 3 0 0 1 6 0 V10" stroke={verde} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <path d="M9 8 V7 a3 3 0 0 1 6 0 V8" stroke="#fff" strokeWidth={1.8} fill="none" strokeLinecap="round" />
    </svg>
  </div>
);

// número que rola: só o dígito que muda sobe; antigo sai por cima com desfoque vertical
const Rolante: React.FC<{atual: string; anterior: string; t: number; altura: number}> = ({atual, anterior, t, altura}) => {
  const k = interpolate(t, [0, 7], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const len = Math.max(atual.length, anterior.length);
  const a = anterior.padStart(len, ' ');
  const n = atual.padStart(len, ' ');
  return (
    <span style={{display: 'inline-flex', fontVariantNumeric: 'tabular-nums', overflow: 'hidden', height: altura * 1.18, lineHeight: `${altura * 1.18}px`}}>
      {Array.from(n).map((c, i) => {
        if (c === ' ') return null;
        const muda = a[i] !== c && k < 1;
        const blur = Math.sin(Math.PI * k) * 3;
        return (
          <span key={i} style={{position: 'relative', display: 'inline-block'}}>
            <span style={{visibility: 'hidden'}}>{c}</span>
            {muda ? (
              <>
                <span style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${-k * altura * 1.1}px)`, filter: `blur(${blur}px)`}}>{a[i]}</span>
                <span style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${(1 - k) * altura * 1.1}px)`, filter: `blur(${blur}px)`}}>{c}</span>
              </>
            ) : (
              <span style={{position: 'absolute', left: 0, top: 0}}>{c}</span>
            )}
          </span>
        );
      })}
    </span>
  );
};

export const Cena23: React.FC<Cena23Props> = ({
  data, hora, app, hoje, rotuloPedidos, agora, linhaPedido, moeda, totalInicial, contagemInicial, pedidos,
  chegadas, maisTexto, quadroMais = 76, verde = '#1FB872', width = W, height = H,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = Math.min(width / W, height / H);
  // intervalos: começam largos (~9 quadros) e apertam (~4); o último chega sozinho depois do "+N"
  const ch = chegadas ?? (() => {
    const out = [0];
    const n = pedidos.length - 1;
    for (let i = 1; i < n; i++) out.push(out[i - 1] + Math.round(interpolate(i, [1, n - 1], [14, 4], clamp)));
    out.push(quadroMais + 12);
    return out;
  })();

  const chegou = ch.filter((c) => frame >= c).length;
  const somaAte = (n: number) => pedidos.slice(1, n).reduce((acc, p) => acc + p.valor, 0); // o 1º já está no total inicial
  const total = totalInicial + somaAte(chegou);
  const totalAnt = totalInicial + somaAte(Math.max(1, chegou - 1));
  const tUlt = chegou > 1 ? frame - ch[chegou - 1] : 99;

  const TOPO = 470;
  const PASSO = 172;
  const ALT = 156;

  return (
    <AbsoluteFill style={{background: '#070A12', fontFamily: INTER, color: '#fff'}}>
      {/* papel de parede: manchas desfocadas */}
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 90% 55% at 25% 10%, #163A78 0%, rgba(14,42,90,0) 75%), radial-gradient(ellipse 95% 60% at 80% 95%, #14606F 0%, rgba(15,76,92,0) 75%), radial-gradient(ellipse 60% 40% at 30% 70%, rgba(14,42,90,0.55) 0%, rgba(14,42,90,0) 70%)'}} />
      <div style={{position: 'absolute', left: (width - W * s) / 2, top: (height - H * s) / 2, width: W, height: H, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', top: 58, width: W, textAlign: 'center', fontWeight: 600, fontSize: 46, color: 'rgba(255,255,255,0.78)'}}>{data}</div>
        <div style={{position: 'absolute', top: 92, width: W, textAlign: 'center', fontWeight: 600, fontSize: 228, letterSpacing: -10, lineHeight: 1.1, color: 'rgba(240,244,250,0.95)', fontVariantNumeric: 'tabular-nums'}}>{hora}</div>
        {/* barra do dia */}
        <div style={{position: 'absolute', left: 86, width: 908, top: 352, height: 92, borderRadius: 30, background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(20px)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', padding: '0 30px', zIndex: 50}}>
          <Icone tam={46} verde={verde} />
          <div style={{marginLeft: 16}}>
            <div style={{fontWeight: 600, fontSize: 30, lineHeight: 1.1}}>{hoje}</div>
            <div style={{fontWeight: 500, fontSize: 22, color: 'rgba(255,255,255,0.7)', display: 'flex', gap: 6}}>
              <Rolante atual={String(contagemInicial + chegou - 1)} anterior={String(contagemInicial + Math.max(0, chegou - 2))} t={tUlt} altura={22} /> {rotuloPedidos}
            </div>
          </div>
          <div style={{marginLeft: 'auto', fontWeight: 700, fontSize: 52, letterSpacing: -1}}>
            <span style={{display: 'inline-flex', gap: 2}}>
              {moeda}&nbsp;<Rolante atual={fmt(total, 0)} anterior={fmt(totalAnt, 0)} t={tUlt} altura={52} />
            </span>
          </div>
        </div>
        {/* pilha: recortada logo abaixo da barra, para os cards saírem de baixo dela */}
        <div style={{position: 'absolute', left: 0, top: 452, width: W, height: 830, overflow: 'hidden'}}>
          {pedidos.map((p, k) => {
            if (frame < ch[k]) return null;
            const proprio = k === 0 ? 1 : spring({frame: frame - ch[k], fps, config: {damping: 12, stiffness: 210, mass: 0.7}});
            let pos = proprio - 1;
            for (let j = k + 1; j < pedidos.length; j++) {
              if (frame >= ch[j]) pos += spring({frame: frame - ch[j], fps, config: {damping: 14, stiffness: 190, mass: 0.7}});
            }
            const escond = Math.max(0, pos - 3);
            if (escond > 3.2) return null;
            const y = TOPO - 452 + Math.min(pos, 3) * PASSO + escond * 16;
            const esc = 1 - escond * 0.045;
            const escuro = 1 - Math.min(escond, 3) * 0.22;
            return (
              <div key={k} style={{position: 'absolute', left: 86, width: 908, top: y, height: ALT, borderRadius: 34, zIndex: k, transform: `scale(${esc})`, transformOrigin: '50% 100%', background: `rgba(${Math.round(110 * escuro)},${Math.round(128 * escuro)},${Math.round(140 * escuro)},${0.5})`, backdropFilter: 'blur(18px)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.16), 0 8px 24px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', padding: '0 30px', opacity: escond > 2.6 ? 0 : 1}}>
                <div style={{opacity: escond > 0.6 ? 0 : 1, display: 'flex', alignItems: 'center', width: '100%'}}>
                  <Icone tam={82} verde={verde} />
                  <div style={{marginLeft: 26, flex: 1}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span style={{fontWeight: 600, fontSize: 30}}>{app}</span>
                      <span style={{fontWeight: 500, fontSize: 24, color: 'rgba(255,255,255,0.55)'}}>{agora}</span>
                    </div>
                    <div style={{fontWeight: 500, fontSize: 31, marginTop: 6, fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.94)'}}>
                      {linhaPedido}: {moeda} {fmt(p.valor, 2)} · {p.itens} {p.itens === 1 ? 'item' : 'itens'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* "+N mais" */}
        {frame >= quadroMais && (
          <div style={{position: 'absolute', top: 1230, width: W, display: 'flex', justifyContent: 'center'}}>
            <div style={{transform: `scale(${spring({frame: frame - quadroMais, fps, config: {damping: 10, stiffness: 200}})})`, background: 'rgba(255,255,255,0.18)', borderRadius: 999, padding: '10px 34px', fontWeight: 600, fontSize: 28, boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.14)'}}>{maisTexto}</div>
          </div>
        )}
      </div>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'overlay'}}>
        <filter id="g23"><feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="11" /></filter>
        <rect width="100%" height="100%" filter="url(#g23)" />
      </svg>
    </AbsoluteFill>
  );
};
