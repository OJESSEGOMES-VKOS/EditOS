// cena35 — Escala lado a lado (3D edição: maquete de argila vista por lente longa).
// Lente longa = quase ortográfica: cada objeto tem frente clara + lado sombreado + sombra de contato.
// Uma só câmera: um recuo reto ancorado na linha do chão (o chão nunca se mexe).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/InstrumentSans';

const {fontFamily: INSTR} = loadFont('normal', {weights: ['500', '600'], subsets: ['latin']});

export type Tipo = 'pessoa' | 'onibus' | 'casa' | 'predio' | 'torre';
export type Objeto = {tipo: Tipo; nome: string; altura: string; metros: number};
export type Cena35Props = {
  objetos?: Objeto[]; // do menor ao maior, até 5
  width?: number;
  height?: number;
  duracao?: number;
};

const PPM = 9; // px por metro no quadro final
const G = 1150; // linha do chão (fixa)
const FRENTE = '#F1F2F4';
const LADO = '#D6DBE1';
const JANELA = '#C9CFD7';

// largura de frente e de lado (em metros) por tipo
const DIM: Record<Tipo, [number, number]> = {pessoa: [0.55, 0], onibus: [11, 2.2], casa: [9, 3.2], predio: [14, 4.6], torre: [10, 3.4]};

const Caixa: React.FC<{x: number; w: number; d: number; h: number; base?: number; frente?: string; lado?: string}> = ({x, w, d, h, base = 0, frente, lado}) => (
  <>
    <div style={{position: 'absolute', left: x, bottom: base, width: w, height: h, background: frente ?? FRENTE}} />
    <div style={{position: 'absolute', left: x + w, bottom: base, width: d, height: h, background: lado ?? LADO}} />
  </>
);

const Desenho: React.FC<{o: Objeto}> = ({o}) => {
  const h = o.metros * PPM;
  const [wf, ws] = DIM[o.tipo];
  const w = wf * PPM;
  const d = ws * PPM;
  if (o.tipo === 'pessoa') {
    return (
      <svg width={w * 1.4} height={h} viewBox="0 0 22 72" style={{position: 'absolute', left: -w * 0.2, bottom: 0, overflow: 'visible'}}>
        <defs><linearGradient id="p35" x1="0" x2="1"><stop offset="0" stopColor="#7d848e" /><stop offset="0.6" stopColor="#6A717B" /><stop offset="1" stopColor="#4f555e" /></linearGradient></defs>
        <circle cx={11} cy={5} r={4.6} fill="url(#p35)" />
        <rect x={9.4} y={9} width={3.2} height={3} fill="url(#p35)" />
        <rect x={4.6} y={11.5} width={12.8} height={24} rx={3.5} fill="url(#p35)" />
        <rect x={2.2} y={12.5} width={3} height={22} rx={1.5} fill="url(#p35)" />
        <rect x={16.8} y={12.5} width={3} height={22} rx={1.5} fill="url(#p35)" />
        <rect x={5.4} y={33} width={5.2} height={39} rx={2} fill="url(#p35)" />
        <rect x={11.4} y={33} width={5.2} height={39} rx={2} fill="url(#p35)" />
      </svg>
    );
  }
  if (o.tipo === 'onibus') {
    const fr = `linear-gradient(to bottom, ${FRENTE} 0 10%, ${JANELA} 10% 40%, ${FRENTE} 40% 48%, ${JANELA} 48% 72%, ${FRENTE} 72%)`;
    return <Caixa x={0} w={w} d={d} h={h} frente={fr} lado={`linear-gradient(to bottom, ${LADO} 0 10%, #bfc6cf 10% 40%, ${LADO} 40%)`} />;
  }
  if (o.tipo === 'casa') {
    const parede = h * 0.58;
    return (
      <>
        <Caixa x={0} w={w} d={d} h={parede}
          frente={`linear-gradient(to right, ${FRENTE} 0 14%, ${JANELA} 14% 32%, ${FRENTE} 32% 41%, ${JANELA} 41% 59%, ${FRENTE} 59% 68%, ${JANELA} 68% 86%, ${FRENTE} 86%) top 30% left 0 / 100% 30% no-repeat, ${FRENTE}`} />
        {/* empena de frente e telhado de lado */}
        <div style={{position: 'absolute', left: 0, bottom: parede, width: w, height: h - parede, background: FRENTE, clipPath: 'polygon(0 100%, 50% 0, 100% 100%)'}} />
        <div style={{position: 'absolute', left: w / 2, bottom: parede, width: w / 2 + d, height: h - parede, background: '#c7cdd5', clipPath: `polygon(0 0, ${(d / (w / 2 + d)) * 100}% 0, 100% 100%, ${((w / 2) / (w / 2 + d)) * 100}% 100%)`}} />
      </>
    );
  }
  if (o.tipo === 'predio') {
    const bandas = `repeating-linear-gradient(to bottom, ${FRENTE} 0 ${PPM * 1.6}px, ${JANELA} ${PPM * 1.6}px ${PPM * 3.4}px)`;
    return (
      <>
        <Caixa x={0} w={w} d={d} h={h} frente={bandas} lado={`repeating-linear-gradient(to bottom, ${LADO} 0 ${PPM * 1.6}px, #c3cad3 ${PPM * 1.6}px ${PPM * 3.4}px)`} />
        <Caixa x={w * 0.3} w={w * 0.4} d={d * 0.4} h={PPM * 2} base={h} />
      </>
    );
  }
  // torre esbelta com recuos e agulha
  const aletas = `repeating-linear-gradient(to right, ${FRENTE} 0 ${PPM * 1.2}px, #dfe3e8 ${PPM * 1.2}px ${PPM * 1.5}px)`;
  const ladoA = `repeating-linear-gradient(to right, ${LADO} 0 ${PPM * 1.2}px, #c9cfd7 ${PPM * 1.2}px ${PPM * 1.5}px)`;
  const h1 = h * 0.62, h2 = h * 0.2, h3 = h * 0.1;
  return (
    <>
      <Caixa x={0} w={w} d={d} h={h1} frente={aletas} lado={ladoA} />
      <Caixa x={w * 0.1} w={w * 0.8} d={d * 0.8} h={h2} base={h1} frente={aletas} lado={ladoA} />
      <Caixa x={w * 0.22} w={w * 0.56} d={d * 0.6} h={h3} base={h1 + h2} frente={aletas} lado={ladoA} />
      <Caixa x={w * 0.45} w={w * 0.1} d={d * 0.1} h={h - h1 - h2 - h3} base={h1 + h2 + h3} />
    </>
  );
};

export const Cena35: React.FC<Cena35Props> = ({
  objetos = [
    {tipo: 'pessoa', nome: 'Pessoa', altura: '1,8 m', metros: 1.8},
    {tipo: 'onibus', nome: 'Ônibus', altura: '4 m', metros: 4.2},
    {tipo: 'casa', nome: 'Casa', altura: '10 m', metros: 10},
    {tipo: 'predio', nome: 'Prédio', altura: '60 m', metros: 60},
    {tipo: 'torre', nome: 'Torre', altura: '120 m', metros: 120},
  ],
  width = 1080,
  height = 1350,
  duracao = 150,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = duracao / 150;
  const k = Math.min(width / 1080, height / 1350);
  const obs = objetos.slice(0, 5);

  // posições finais com o mesmo vão entre cada par
  const larg = obs.map((o) => (DIM[o.tipo][0] + DIM[o.tipo][1]) * PPM);
  const ESQ = 70;
  const DIR = 1012;
  const vao = (DIR - ESQ - larg.reduce((a, b) => a + b, 0)) / Math.max(1, obs.length - 1);
  const xs: number[] = [];
  let acc = ESQ;
  larg.forEach((l) => {
    xs.push(acc);
    acc += l + vao;
  });
  const centro = (i: number) => xs[i] + (DIM[obs[i].tipo][0] * PPM) / 2;

  // câmera: recuo em escala logarítmica, ancorado num ponto da linha do chão
  const S0 = 20;
  const AX = (540 - centro(0) * S0) / (1 - S0);
  const escala = (f: number) => Math.exp(Math.log(S0) * (1 - interpolate(f, [0, 102 * s], [0, 1], {extrapolateRight: 'clamp', easing: Easing.bezier(0.25, 0.55, 0.1, 1)})));
  const sc = escala(frame);
  const tela = (x: number, sc0: number) => AX + (x - AX) * sc0;

  // cada objeto nasce quando a vista o alcança por inteiro
  const nasce = obs.map((o, i) => {
    if (i === 0) return -100;
    for (let f = 0; f < 150 * s; f++) {
      if (tela(xs[i] + larg[i], escala(f)) < 1050) return Math.min(f, i === obs.length - 1 ? 70 * s : 999);
    }
    return 70 * s;
  });

  return (
    <AbsoluteFill style={{background: 'linear-gradient(to bottom, #D2D7DD 0%, #DCE0E5 50%, #E4E7EB 85%, #D8DDE2 100%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 1080, height: 1350, marginLeft: -540, marginTop: -675, transform: `scale(${k})`}}>
        <div style={{position: 'absolute', left: 140, right: 140, top: 200, height: 900, background: 'radial-gradient(ellipse at 60% 70%, rgba(255,255,255,0.35), rgba(255,255,255,0) 70%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: G, bottom: 0, background: 'linear-gradient(to bottom, #E2E5E9, #CFD4DA)'}} />
        {/* mundo escalado em torno de (AX, G) */}
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: G, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: G, transformOrigin: `${AX}px ${G}px`, transform: `scale(${sc})`}}>
            {obs.map((o, i) => {
              const sp = i === 0 ? 1 : spring({frame: frame - nasce[i], fps, config: {damping: 10, stiffness: 170}});
              const h = o.metros * PPM;
              const sobe = (1 - sp) * (h + 20);
              const w = larg[i];
              return (
                <div key={i} style={{position: 'absolute', left: xs[i], top: G, width: 0, height: 0}}>
                  <div style={{position: 'absolute', left: -w * 0.1, top: -3, width: w * 1.3, height: 6, borderRadius: '50%', background: 'rgba(80,90,105,0.35)', filter: 'blur(2px)', opacity: sp > 0.6 ? 1 : 0}} />
                  <div style={{position: 'absolute', left: 0, bottom: 0, width: w, height: h, transform: `translateY(${sobe}px)`}}>
                    <Desenho o={o} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* rótulos: todos no mesmo tamanho e na mesma linha de base */}
        {obs.map((o, i) => {
          const t0 = i === 0 ? -100 : nasce[i] + 6 * s;
          const n = spring({frame: frame - t0, fps, config: {damping: 16, stiffness: 300}});
          const a = spring({frame: frame - t0 - 4 * s, fps, config: {damping: 16, stiffness: 300}});
          const x = tela(centro(i), sc);
          return (
            <div key={i} style={{position: 'absolute', left: x, top: G + 22, transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap'}}>
              <div style={{overflow: 'hidden', height: 50}}>
                <div style={{fontFamily: INSTR, fontWeight: 600, fontSize: 42, color: '#111316', lineHeight: '50px', transform: `translateY(${(1 - n) * 50}px)`}}>{o.nome}</div>
              </div>
              <div style={{overflow: 'hidden', height: 38}}>
                <div style={{fontFamily: INSTR, fontWeight: 500, fontSize: 30, color: '#5B626B', lineHeight: '38px', transform: `translateY(${(1 - a) * 38}px)`}}>{o.altura}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
