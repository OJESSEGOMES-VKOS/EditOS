// cena17 — App Mockup (Celular com app). CSS 3D. Palco base 1080x1350, recomposto em qualquer formato.
// Tela e cartões são ilustração genérica; num vídeo real, a tela é o recriado fiel do app do dono (G34).
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/PlusJakartaSans';

const {fontFamily: PJ} = loadFont('normal', {weights: ['500', '600', '700', '800'], subsets: ['latin']});

export type Linha = {nome: string; sub: string; valor: string; positivo?: boolean};
export type Cena17Props = {
  width?: number;
  height?: number;
  saudacao?: string;
  nome?: string;
  rotuloSaldo?: string;
  saldoInicial?: number;
  saldoFinal?: number;
  delta?: string;
  deltaLinha?: string;
  linhas?: Linha[];
  notifTitulo?: string;
  notifTexto?: string[];
  statRotulo?: string;
  statValor?: string;
  statDelta?: string;
  metaTitulo?: string;
  metaTexto?: string;
  metaPct?: number;
  acento?: string;
  acentoClaro?: string;
};

const INK = '#0e1116', GR = '#7a818c';
const fmt = (v: number) => {
  const [i, d] = v.toFixed(2).split('.');
  return {i: i.replace(/\B(?=(\d{3})+(?!\d))/g, '.'), d};
};

export const Cena17: React.FC<Cena17Props> = ({
  width = 1080,
  height = 1350,
  saudacao = 'Bom dia',
  nome = 'Marina Alves',
  rotuloSaldo = 'Saldo total',
  saldoInicial = 19679.14,
  saldoFinal = 24860.42,
  delta = '+ 6,2%',
  deltaLinha = '+R$ 1.240 em 30 dias',
  linhas = [
    {nome: 'Estúdio Norte', sub: 'Salário · Hoje', valor: '+R$ 4.200,00', positivo: true},
    {nome: 'Mercado Verde', sub: 'Mercado · Ontem', valor: '−R$ 86,40'},
    {nome: 'Aluguel', sub: 'Moradia · 27 out', valor: '−R$ 1.850,00'},
  ],
  notifTitulo = 'Pagamento recebido',
  notifTexto = ['R$ 4.200 chegaram do Estúdio Norte.', 'R$ 420 foram para a reserva.'],
  statRotulo = 'Guardado no mês',
  statValor = 'R$ 1.240',
  statDelta = '+18% vs set',
  metaTitulo = 'Viagem a Lisboa',
  metaTexto = 'R$ 4.100 de R$ 5.000',
  metaPct = 82,
  acento = '#0e9f6e',
  acentoClaro = '#e3f6ee',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = Math.min(width / 1080, height / 1350);
  const sp = (q: number, cfg = {damping: 11, stiffness: 170, mass: 0.7}) => spring({frame: frame - q, fps, config: cfg});

  // o celular gira para o lugar com peso
  const gira = spring({frame, fps, config: {damping: 13, stiffness: 55, mass: 1.2}});
  const ry = interpolate(gira, [0, 1], [-62, -20]);
  const rz = interpolate(gira, [0, 1], [-13, -3]);
  const rx = interpolate(gira, [0, 1], [16, 8]);
  const brilho = interpolate(frame, [8, 26], [-0.2, 1.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // flutuação final
  const flut = interpolate(frame, [95, 150], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bob = Math.sin((frame - 95) / 14) * 5 * flut;
  const deriva = flut * 14;

  // a tela se monta enquanto pousa
  const conta = interpolate(frame, [4, 44], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const saldo = fmt(saldoInicial + (saldoFinal - saldoInicial) * conta);
  const graf = interpolate(frame, [10, 46], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const chip = sp(46);
  const aba = interpolate(frame, [6, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

  const pts = Array.from({length: 24}, (_, i) => {
    const v = 0.15 + (i / 23) ** 1.6 * 0.75 + Math.sin(i * 1.7) * 0.04;
    return [i * (300 / 23), 120 - v * 110] as [number, number];
  });
  const nVis = graf * 23;
  const vis = pts.filter((_, i) => i <= nVis);
  const ult = pts[Math.min(23, Math.floor(nVis) + 1)];
  const pen = pts[Math.floor(nVis)];
  const ponta: [number, number] = [pen[0] + (ult[0] - pen[0]) * (nVis % 1), pen[1] + (ult[1] - pen[1]) * (nVis % 1)];
  const caminho = [...vis, ponta].map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');

  // cartões: um de cada vez, ~meio segundo entre eles
  const qN = 52, qS = 68, qM = 84;
  const cN = sp(qN), cS = sp(qS), cM = sp(qM);
  const anelM = interpolate(frame, [qM, qM + 26], [0, metaPct / 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const barras = [0.45, 0.55, 0.4, 0.62, 0.5, 1];

  const PW = 400, PH = 820;
  const cartao: React.CSSProperties = {position: 'absolute', background: '#fff', borderRadius: 22, overflow: 'hidden', boxShadow: '0 2px 6px rgba(30,45,70,0.08), 0 24px 50px rgba(30,45,70,0.18)', fontFamily: PJ};

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: 'linear-gradient(#dfe6ee, #cfd8e2 70%, #c3cdd8)'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 45% 38% at 50% 45%, #f4f7fa 0%, rgba(244,247,250,0) 100%)'}} />
      <svg width="100%" height="100%" style={{position: 'absolute', opacity: 0.07, mixBlendMode: 'multiply'}}>
        <filter id="as17g"><feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves={2} seed={3} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter="url(#as17g)" />
      </svg>
      <div style={{position: 'absolute', left: (width - 1080 * k) / 2, top: (height - 1350 * k) / 2, width: 1080, height: 1350, transform: `scale(${k})`, transformOrigin: '0 0', fontFamily: PJ, color: INK}}>
        {/* sombra no chão: alarga quando o celular encara a câmera */}
        <div style={{position: 'absolute', left: 540 - 60 - 170 * gira, top: 1160, width: 120 + 340 * gira, height: 46, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(40,55,80,0.35), rgba(40,55,80,0) 70%)', filter: 'blur(6px)'}} />
        {/* o celular */}
        <div style={{position: 'absolute', left: 540 - PW / 2, top: 230 + bob * 0.5, width: PW, height: PH, perspective: 2200}}>
          <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`}}>
            {Array.from({length: 12}, (_, i) => (
              <div key={i} style={{position: 'absolute', inset: 0, borderRadius: 64, background: i === 0 ? '#8d939b' : '#3a3e45', transform: `translateZ(${-2 - i * 2.4}px)`}} />
            ))}
            <div style={{position: 'absolute', inset: 0, borderRadius: 64, background: `linear-gradient(100deg, #1b1d21 ${brilho * 100 - 8}%, #c9ced6 ${brilho * 100}%, #1b1d21 ${brilho * 100 + 8}%)`, padding: 14, boxSizing: 'border-box'}}>
              <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 52, overflow: 'hidden', background: '#fff', padding: '22px 26px', boxSizing: 'border-box'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700}}><span>8:30</span><span style={{letterSpacing: 2}}>▪▪▪</span></div>
                <div style={{position: 'absolute', left: '50%', top: 16, width: 104, height: 30, marginLeft: -52, borderRadius: 16, background: '#0b0c0e'}} />
                <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 26}}>
                  <div style={{width: 38, height: 38, borderRadius: 19, background: 'linear-gradient(135deg,#9aa6b4,#4a5462)'}} />
                  <div style={{flex: 1}}><div style={{fontSize: 12, color: GR, fontWeight: 500}}>{saudacao}</div><div style={{fontSize: 16, fontWeight: 700}}>{nome}</div></div>
                  <div style={{width: 32, height: 32, borderRadius: 16, border: '1.5px solid #e3e6ea'}} />
                </div>
                <div style={{fontSize: 13, color: GR, fontWeight: 500, marginTop: 22}}>{rotuloSaldo}</div>
                <div style={{fontSize: 44, fontWeight: 800, letterSpacing: -1.5, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1}}>R$ {saldo.i}<span style={{fontSize: 24, color: '#a7adb5'}}>,{saldo.d}</span></div>
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, height: 24}}>
                  <span style={{background: acentoClaro, color: acento, fontWeight: 700, fontSize: 12, padding: '3px 8px', borderRadius: 10, transform: `scale(${chip})`}}>{delta}</span>
                  <span style={{fontSize: 12, color: GR, fontWeight: 500, opacity: chip > 0.5 ? 1 : 0}}>{deltaLinha}</span>
                </div>
                <svg width={300} height={130} style={{marginTop: 4, overflow: 'visible'}}>
                  <defs><linearGradient id="as17f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={acento} stopOpacity={0.22} /><stop offset="1" stopColor={acento} stopOpacity={0} /></linearGradient></defs>
                  <path d={`${caminho} L${ponta[0]},125 L0,125 Z`} fill="url(#as17f)" />
                  <path d={caminho} stroke={acento} strokeWidth={3} fill="none" strokeLinejoin="round" />
                  <circle cx={ponta[0]} cy={ponta[1]} r={5} fill="#fff" stroke={acento} strokeWidth={2.5} />
                  {graf >= 1 && <g transform={`translate(${ponta[0] - 78},${ponta[1] - 36}) scale(${chip})`}><rect width={74} height={22} rx={6} fill={INK} /><text x={37} y={15} fill="#fff" fontSize={11} fontWeight={700} textAnchor="middle" fontFamily={PJ}>R$ 24.860</text></g>}
                </svg>
                <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', background: '#f2f4f6', borderRadius: 12, padding: 4, marginTop: 8, fontSize: 12, fontWeight: 600, color: GR}}>
                  <div style={{position: 'absolute', top: 4, bottom: 4, width: '20%', left: `calc(${aba * 20}% + 4px)`, background: '#fff', borderRadius: 9, boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}} />
                  {['1S', '1M', '3M', '1A', 'Tudo'].map((t) => <span key={t} style={{position: 'relative', flex: 1, textAlign: 'center', padding: '6px 0'}}>{t}</span>)}
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 18, fontSize: 15, fontWeight: 700}}><span>Atividade recente</span><span style={{color: acento, fontSize: 12}}>Ver tudo</span></div>
                {linhas.map((l, i) => {
                  const r = sp(30 + i * 6, {damping: 14, stiffness: 200, mass: 0.6});
                  return (
                    <div key={l.nome} style={{overflow: 'hidden', height: 52}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, transform: `translateY(${(1 - r) * 54}px)`}}>
                        <div style={{width: 34, height: 34, borderRadius: 10, background: l.positivo ? acentoClaro : '#f2f4f6', color: l.positivo ? acento : GR, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14}}>{l.positivo ? '↑' : '•'}</div>
                        <div style={{flex: 1}}><div style={{fontSize: 13, fontWeight: 700}}>{l.nome}</div><div style={{fontSize: 11, color: GR, fontWeight: 500}}>{l.sub}</div></div>
                        <div style={{fontSize: 13, fontWeight: 700, color: l.positivo ? acento : INK}}>{l.valor}</div>
                      </div>
                    </div>
                  );
                })}
                <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 64, borderTop: '1px solid #eef0f2', display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                  {[0, 1, 2, 3].map((i) => <span key={i} style={{width: 18, height: 18, borderRadius: 5, border: `2px solid ${i === 0 ? INK : '#b8bdc4'}`}} />)}
                </div>
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.18) 48%, rgba(255,255,255,0) 56%)'}} />
              </div>
            </div>
          </div>
        </div>
        {/* notificação: sai da pílula da câmera e desdobra */}
        {cN > 0.01 && (() => {
          const x = interpolate(cN, [0, 1], [500, 115]), y = interpolate(cN, [0, 1], [262, 168]);
          const w = interpolate(cN, [0, 1], [100, 500]), h = interpolate(cN, [0, 1], [30, 132]);
          return (
            <div style={{...cartao, left: x - deriva, top: y + bob * 1.4, width: w, height: h, borderRadius: interpolate(cN, [0, 1], [16, 22]), transform: 'rotate(-2deg)', background: cN < 0.25 ? '#0b0c0e' : '#fff'}}>
              <div style={{position: 'absolute', left: 22, top: 22, width: 456, display: 'flex', gap: 16}}>
                <div style={{width: 50, height: 50, borderRadius: 13, background: acento, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22}}>↗</div>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 19, fontWeight: 700}}><span>{notifTitulo}</span><span style={{fontSize: 13, color: GR, fontWeight: 500}}>agora</span></div>
                  {notifTexto.map((t) => <div key={t} style={{fontSize: 15, color: '#3c434d', fontWeight: 500, marginTop: 3}}>{t}</div>)}
                </div>
              </div>
            </div>
          );
        })()}
        {/* cartão de número: cresce do próprio chip */}
        {cS > 0.01 && (() => {
          const w = interpolate(cS, [0, 1], [96, 240]), h = interpolate(cS, [0, 1], [34, 250]);
          return (
            <div style={{...cartao, left: 760 + deriva * 1.3, top: 860 - h + bob * 1.2, width: w, height: h, transform: 'rotate(1.5deg)'}}>
              <div style={{position: 'absolute', left: 22, bottom: 22, width: 196}}>
                <div style={{fontSize: 14, color: GR, fontWeight: 500}}>{statRotulo}</div>
                <div style={{fontSize: 40, fontWeight: 800, letterSpacing: -1}}>{statValor}</div>
                <div style={{display: 'inline-block', background: acentoClaro, color: acento, fontWeight: 700, fontSize: 12, padding: '3px 8px', borderRadius: 10}}>{statDelta}</div>
                <div style={{display: 'flex', alignItems: 'flex-end', gap: 8, height: 70, marginTop: 14}}>
                  {barras.map((b, i) => {
                    const sb = sp(qS + 8 + i * 2, {damping: 9, stiffness: 220, mass: 0.5});
                    return <div key={i} style={{flex: 1, height: `${b * 100 * sb}%`, borderRadius: 4, background: i === barras.length - 1 ? acento : '#e6e9ed'}} />;
                  })}
                </div>
              </div>
            </div>
          );
        })()}
        {/* cartão de meta: começa como um disco em volta do anel e se estica */}
        {cM > 0.01 && (() => {
          const w = interpolate(cM, [0, 1], [96, 330]);
          return (
            <div style={{...cartao, left: 110 - deriva * 1.5, top: 960 + bob * 1.6, width: w, height: 96, borderRadius: interpolate(cM, [0, 1], [48, 22]), transform: 'rotate(-1.5deg)'}}>
              <svg width={64} height={64} style={{position: 'absolute', left: 16, top: 16}}>
                <circle cx={32} cy={32} r={26} stroke="#e6e9ed" strokeWidth={7} fill="none" />
                <circle cx={32} cy={32} r={26} stroke={acento} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray={`${anelM * 163.4} 200`} transform="rotate(-90 32 32)" />
                <text x={32} y={37} textAnchor="middle" fontSize={14} fontWeight={800} fontFamily={PJ} fill={INK}>{Math.round(anelM * 100)}%</text>
              </svg>
              <div style={{position: 'absolute', left: 96, top: 22, whiteSpace: 'nowrap'}}>
                <div style={{fontSize: 20, fontWeight: 700}}>{metaTitulo}</div>
                <div style={{fontSize: 14, color: GR, fontWeight: 500}}>{metaTexto}</div>
              </div>
            </div>
          );
        })()}
      </div>
    </AbsoluteFill>
  );
};
