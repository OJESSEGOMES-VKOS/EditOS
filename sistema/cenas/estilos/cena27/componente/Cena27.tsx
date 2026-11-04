// cena27 — Day counter (Contador de dias). "DIA" vermelho + odômetro (devagar, rápido com borrão
// vertical, devagar) sobre um calendário de parede que ganha checks desenhados à mão; no último dia, soco e círculo.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

const {fontFamily: ANTON} = loadAnton('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: INTER} = loadInter('normal', {weights: ['700'], subsets: ['latin', 'latin-ext']});

export type Cena27Props = {
  rotulo: string; // "POSTANDO TODO DIA"
  palavra: string; // "DIA"
  mes: string; // "ABRIL"
  dias: number; // dias do mês / do desafio (ex.: 30)
  inicioSemana: number; // 0 = domingo; coluna do dia 1
  iniciaisSemana?: string[];
  vermelho?: string;
  width?: number;
  height?: number;
};

const W = 1080;
const H = 1350;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Cena27: React.FC<Cena27Props> = ({
  rotulo, palavra, mes, dias, inicioSemana, iniciaisSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'], vermelho = '#E5383B',
  width = W, height = H,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = Math.min(width / W, height / H);

  // curva devagar-rápido-devagar: 4 batidas, corrida, 3 batidas
  const batIni = [6, 12, 18, 24];
  const rapIni = 27;
  const rapFim = 60;
  const meio = dias - 1 - 4 - 3; // dias percorridos na corrida (do 5 ao dias-3)
  const batFim = [66, 72, 79];
  const cfg = {damping: 11, stiffness: 220, mass: 0.6};
  const valor = (f: number) => {
    let v = 1;
    for (const t of batIni) v += spring({frame: f - t, fps, config: cfg});
    v += meio * interpolate(f, [rapIni, rapFim], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
    for (const t of batFim) v += spring({frame: f - t, fps, config: cfg});
    return v;
  };
  const v = valor(frame);
  const vel = Math.abs(valor(frame + 0.5) - valor(frame - 0.5));
  const borrao = Math.min(26, vel * 30);

  // quando cada dia foi alcançado
  const chegada: number[] = [];
  for (let d = 1; d <= dias; d++) {
    let f = 0;
    while (f < 150 && valor(f) < d - 0.4) f++;
    chegada[d] = f;
  }

  const unid = ((v % 10) + 10) % 10;
  const dezC = Math.floor(v / 10) + Math.max(0, unid - 9);
  const temDez = interpolate(v, [9.4, 10], [0, 1], clamp);
  const DW = 150; // largura de um dígito Anton a 310 px (aprox.)

  const Fita: React.FC<{val: number}> = ({val}) => {
    const base = Math.floor(val);
    const fr = val - base;
    return (
      <div style={{position: 'relative', width: DW, height: 360, overflow: 'hidden'}}>
        {[-1, 0, 1, 2].map((o) => (
          <div key={o} style={{position: 'absolute', left: 0, width: DW, height: 360, textAlign: 'center', transform: `translateY(${(o - fr) * -360}px)`}}>
            {(((base + o) % 10) + 10) % 10}
          </div>
        ))}
      </div>
    );
  };

  const final = chegada[dias];
  const soco = frame >= final ? interpolate(frame - final, [0, 4, 12], [1, 1.035, 1], {...clamp, easing: Easing.out(Easing.quad)}) : 1;
  const circulo = interpolate(frame, [final + 3, final + 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

  const celulas = Math.ceil((inicioSemana + dias) / 7) * 7;
  const CW = 840;
  const cel = 90;
  const gap = 12;

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #FFFFFF 0%, #F3F3F1 100%)'}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="vb27" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation={`0 ${borrao.toFixed(2)}`} /></filter>
      </svg>
      <div style={{position: 'absolute', left: (width - W * s) / 2, top: (height - H * s) / 2, width: W, height: H, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        {/* rótulo entre fios */}
        <div style={{position: 'absolute', top: 92, width: W, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26}}>
          <div style={{width: 130, height: 2, background: '#D6D6D2'}} />
          <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: '#8F8F8B'}}>{rotulo}</div>
          <div style={{width: 130, height: 2, background: '#D6D6D2'}} />
        </div>
        {/* contador */}
        <div style={{position: 'absolute', top: 140, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: ANTON, fontSize: 340, lineHeight: '360px', height: 360}}>
          <div style={{color: vermelho, marginRight: 34}}>{palavra}</div>
          <div style={{display: 'flex', color: '#111111', filter: borrao > 0.6 ? 'url(#vb27)' : undefined}}>
            <div style={{width: DW * temDez, overflow: 'hidden'}}>{temDez > 0 && <Fita val={dezC} />}</div>
            <Fita val={unid} />
          </div>
        </div>
        {/* calendário */}
        <div style={{position: 'absolute', left: (W - CW) / 2, top: 575, width: CW, transform: `scale(${soco})`, transformOrigin: '50% 40%'}}>
          {[0.2, 0.8].map((p) => (
            <div key={p} style={{position: 'absolute', left: CW * p - 7, top: -26, width: 14, height: 46, borderRadius: 7, background: '#2A2A2A', zIndex: 2}} />
          ))}
          <div style={{background: '#fff', borderRadius: 26, padding: '34px 46px 40px', boxShadow: '0 2px 6px rgba(0,0,0,0.05), 0 24px 50px rgba(0,0,0,0.10)'}}>
            <div style={{fontFamily: ANTON, fontSize: 48, color: '#111111', letterSpacing: 1}}>{mes}</div>
            <div style={{display: 'grid', gridTemplateColumns: `repeat(7, ${cel}px)`, gap, marginTop: 6}}>
              {iniciaisSemana.map((d, i) => (
                <div key={i} style={{textAlign: 'center', fontFamily: INTER, fontWeight: 700, fontSize: 20, color: '#8F8F8B'}}>{d}</div>
              ))}
              {Array.from({length: celulas}, (_, i) => {
                const d = i - inicioSemana + 1;
                if (d < 1 || d > dias) return <div key={i} />;
                const t0 = chegada[d];
                const dur = d <= 5 || d > dias - 3 ? 8 : 4;
                const k = interpolate(frame, [t0, t0 + dur], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
                return (
                  <div key={i} style={{position: 'relative', height: cel, borderRadius: 14, background: k > 0 ? `rgba(229,56,59,${0.06 + 0.12 * k})` : '#EFEFED'}}>
                    <div style={{position: 'absolute', left: 10, top: 6, fontFamily: INTER, fontWeight: 700, fontSize: 21, color: '#74746F'}}>{d}</div>
                    {k > 0 && (
                      <svg width={cel} height={cel} viewBox="0 0 100 100" style={{position: 'absolute', inset: 0}}>
                        <path d={`M ${24 + (d % 3)} ${58 + (d % 2) * 3} Q 36 66 ${43 + (d % 4)} 80 Q 58 52 ${82 - (d % 3) * 2} ${30 + (d % 5)}`} stroke={vermelho} strokeWidth={9 + (d % 3)} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
                      </svg>
                    )}
                    {d === dias && circulo > 0 && (
                      <svg width={cel + 40} height={cel + 40} viewBox="0 0 140 140" style={{position: 'absolute', left: -20, top: -20, overflow: 'visible'}}>
                        <path d="M 78 14 C 120 16, 134 60, 120 98 C 104 132, 40 134, 18 100 C 0 70, 12 26, 56 15 C 70 12, 86 14, 96 20" stroke={vermelho} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - circulo} />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0, opacity: 0.04, mixBlendMode: 'multiply', pointerEvents: 'none'}}>
        <filter id="g27"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="23" /></filter>
        <rect width="100%" height="100%" filter="url(#g27)" />
      </svg>
    </AbsoluteFill>
  );
};
