// cena11 — 3D Map Route (Rota no mapa 3D). Cidade inventada em CSS 3D (caixas reais), sem marca de app.
// Palco base 1080x1350, recomposto em qualquer formato.
import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Inter';

const {fontFamily: INTER} = loadFont('normal', {weights: ['500', '600', '700', '800'], subsets: ['latin']});

export type Cena11Props = {
  width?: number;
  height?: number;
  destino?: string;
  lugares?: {nome: string; x: number; y: number}[];
  minutosInicio?: number;
  minutos?: number;
  distancia?: string;
  rotaTexto?: string;
  botao?: string;
};

const G = 2400; // tamanho do chão
const PASSO = 190, RUA = 40;
const rnd = (s: number) => {const x = Math.sin(s * 91.7 + 13.3) * 43758.5453; return x - Math.floor(x);};
// rio: curva suave atravessando o chão
const rioY = (x: number) => 1230 - x * 0.08 + Math.sin(x / 420) * 70;
const ROTA: [number, number][] = [[760, 2090], [760, 1520], [1140, 1520], [1140, 950], [1520, 950], [1520, 760], [1710, 760]]; // eixos das ruas (múltiplos de PASSO)
const PARQUES = new Set(['2-9', '8-3', '10-7', '4-4']);
const RUA_AMARELA = 8; // índice da rua horizontal principal

const Predio: React.FC<{x: number; y: number; w: number; h: number; d: number}> = ({x, y, w, h, d}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transformStyle: 'preserve-3d'}}>
    <div style={{position: 'absolute', inset: 0, boxShadow: `${d * 0.35}px ${d * 0.25}px ${d * 0.4}px rgba(80,90,100,0.22)`, background: '#dcdad4'}} />
    <div style={{position: 'absolute', left: 0, top: h, width: w, height: d, background: '#e9eaec', transformOrigin: 'top', transform: 'rotateX(90deg)'}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: d, height: h, background: '#dfe1e4', transformOrigin: 'left', transform: 'rotateY(-90deg)'}} />
    <div style={{position: 'absolute', left: w, top: 0, width: d, height: h, background: '#d8dadd', transformOrigin: 'left', transform: 'rotateY(-90deg)'}} />
    <div style={{position: 'absolute', inset: 0, background: d > 55 ? '#EEF0F3' : '#F7F7F5', transform: `translateZ(${d}px)`}} />
  </div>
);

export const Cena11: React.FC<Cena11Props> = ({
  width = 1080,
  height = 1350,
  destino = 'O Estúdio',
  lugares = [
    {nome: 'Cidade Velha', x: 950, y: 690},
    {nome: 'Estação Central', x: 1430, y: 1330},
    {nome: 'Parque da Ribeira', x: 1330, y: 1700},
  ],
  minutosInicio = 14,
  minutos = 12,
  distancia = '4,2 km',
  rotaTexto = 'Rota mais rápida',
  botao = 'Ir',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = Math.min(width / 1080, height / 1350);
  const kF = Math.max(width / 1080, height / 1350);

  const cidade = useMemo(() => {
    const predios: React.ReactNode[] = [];
    const quadras: React.ReactNode[] = [];
    const arvores: {x: number; y: number}[] = [];
    let n = 0;
    for (let r = 0; r < G / PASSO; r++)
      for (let c = 0; c < G / PASSO; c++) {
        const x0 = c * PASSO + RUA / 2, y0 = r * PASSO + RUA / 2, L = PASSO - RUA;
        const cxq = x0 + L / 2, cyq = y0 + L / 2;
        if (Math.abs(cyq - rioY(cxq)) < 135) continue;
        const parque = PARQUES.has(`${r}-${c}`);
        quadras.push(<div key={`q${r}-${c}`} style={{position: 'absolute', left: x0, top: y0, width: L, height: L, background: parque ? '#C9E5BD' : '#ECEAE4'}} />);
        if (parque) {
          for (let t = 0; t < 5; t++) arvores.push({x: x0 + 25 + rnd(r * 7 + c + t) * (L - 50), y: y0 + 25 + rnd(r * 3 + c * 5 + t * 2) * (L - 50)});
          continue;
        }
        const partes = rnd(r * 13 + c) > 0.4 ? 2 : 1;
        for (let a = 0; a < partes; a++)
          for (let b = 0; b < 2; b++) {
            const w = partes === 1 ? L - 12 : L / 2 - 8;
            const h = L / 2 - 8;
            const alto = 18 + Math.floor(rnd(n++ * 1.7) * 3) * 22 + rnd(n * 2.3) * 10;
            predios.push(<Predio key={`p${r}-${c}-${a}-${b}`} x={x0 + 6 + a * (L / 2)} y={y0 + 6 + b * (L / 2)} w={w - 4} h={h - 4} d={alto} />);
          }
      }
    const rio = Array.from({length: 49}, (_, i) => [i * 50, rioY(i * 50)] as [number, number]);
    const rioPath = 'M' + rio.map((p) => `${p[0]},${p[1] - 70}`).join(' L') + ' L' + rio.slice().reverse().map((p) => `${p[0]},${p[1] + 70}`).join(' L') + ' Z';
    return {predios, quadras, arvores, rioPath};
  }, []);

  // câmera: sobe e recua primeiro, depois vira e estreita no destino, pouso longo e macio
  const sobe = interpolate(frame, [0, 58], [0, 1], {extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1)});
  const vira = interpolate(frame, [8, 86], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.45, 0, 0.15, 1)});
  const pitch = interpolate(sobe, [0, 1], [74, 42]);
  const s = interpolate(sobe, [0, 1], [2.3, 0.72]);
  const yaw = interpolate(vira, [0, 1], [0, 16]);
  const tx = interpolate(vira, [0, 1], [760, 1380]);
  const ty = interpolate(vira, [0, 1], [1950, 1170]);
  const ax = 540, ay = interpolate(sobe, [0, 1], [1050, 700]);

  // rota: desenha pelas ruas, cantos arredondados, freia na chegada
  const rotaP = interpolate(frame, [4, 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.3, 0.2, 0.35, 1)});
  const rotaD = 'M' + ROTA.map((p) => p.join(',')).join(' L');
  const qPino = 80;
  const pino = interpolate(frame, [qPino, qPino + 7], [-220, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)});
  const amassa = frame >= qPino + 7 ? 1 - 0.18 * Math.exp(-(frame - qPino - 7) / 2.5) * Math.cos((frame - qPino - 7) / 1.4) : 1;
  const rot = spring({frame: frame - qPino - 6, fps, config: {damping: 9, stiffness: 260, mass: 0.5}});
  const qCard = 96;
  const card = spring({frame: frame - qCard, fps, config: {damping: 11, stiffness: 150, mass: 0.7}});
  const odo = interpolate(frame, [qCard + 4, qCard + 26], [0, minutosInicio - minutos], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const pulso = (frame % 30) / 30;

  const billboard = (sc = 1): React.CSSProperties => ({transform: `rotateZ(${-yaw}deg) rotateX(${-pitch}deg) scale(${sc / s})`, transformOrigin: '50% 100%', transformStyle: 'preserve-3d'});
  const [px, py] = ROTA[ROTA.length - 1];
  const [dx, dy] = ROTA[0];

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: 'linear-gradient(#f1f4f7, #E4E9EE 40%)'}}>
      <div style={{position: 'absolute', left: (width - 1080 * kF) / 2, top: (height - 1350 * kF) / 2, width: 1080, height: 1350, transform: `scale(${kF})`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', inset: 0, perspective: 1500, perspectiveOrigin: `${ax}px ${ay - 300}px`}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: G, height: G, transformOrigin: '0 0', transformStyle: 'preserve-3d', background: '#FBFBFA', transform: `translate(${ax}px, ${ay}px) rotateX(${pitch}deg) rotateZ(${yaw}deg) scale(${s}) translate(${-tx}px, ${-ty}px)`}}>
            {/* rua amarela principal */}
            <div style={{position: 'absolute', left: 0, top: RUA_AMARELA * PASSO - RUA / 2 + 4, width: G, height: RUA - 8, background: '#FFE3A3'}} />
            {cidade.quadras}
            <svg width={G} height={G} style={{position: 'absolute', inset: 0}}><path d={cidade.rioPath} fill="#8EC6EE" /></svg>
            {/* rota com contorno branco, por cima do chão */}
            <svg width={G} height={G} style={{position: 'absolute', inset: 0, transform: 'translateZ(1px)', overflow: 'visible'}}>
              <path d={rotaD} stroke="#fff" strokeWidth={46 / Math.pow(s, 0.75)} fill="none" strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={`${rotaP} 1`} />
              <path d={rotaD} stroke="#1A73E8" strokeWidth={32 / Math.pow(s, 0.75)} fill="none" strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={`${rotaP} 1`} />
            </svg>
            {/* ponto azul de localização com pulso */}
            <div style={{position: 'absolute', left: dx, top: dy, transform: 'translateZ(2px)'}}>
              <div style={{position: 'absolute', left: -110, top: -110, width: 220, height: 220, borderRadius: '50%', background: 'rgba(26,115,232,0.16)', transform: `scale(${(0.4 + pulso * 0.9) / s})`, opacity: 1 - pulso}} />
              <div style={{position: 'absolute', left: -22, top: -22, width: 44, height: 44, borderRadius: '50%', background: '#1A73E8', border: '8px solid #fff', boxSizing: 'border-box', transform: `scale(${1.43 / Math.pow(s, 0.45)})`, boxShadow: '0 2px 6px rgba(0,0,0,0.25)'}} />
            </div>
            {cidade.predios}
            {cidade.arvores.map((a, i) => (
              <div key={i} style={{position: 'absolute', left: a.x, top: a.y, width: 0, height: 0, transformStyle: 'preserve-3d'}}>
                <div style={{position: 'absolute', left: -14, top: -30, width: 28, height: 30, ...billboard(s)}}>
                  <div style={{width: 28, height: 28, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #b9e0a9, #9FCF8E 55%, #7fb46e)'}} />
                </div>
              </div>
            ))}
            {/* rótulos em terreno aberto */}
            {lugares.map((l, i) => (
              <div key={l.nome} style={{position: 'absolute', left: l.x, top: l.y, width: 0, height: 0, transformStyle: 'preserve-3d', opacity: frame > 30 + i * 8 ? 1 : 0}}>
                <div style={{position: 'absolute', left: -200, top: -40, width: 400, height: 40, textAlign: 'center', ...billboard(1), transform: `translateZ(75px) ${billboard(1).transform}`}}>
                  <span style={{fontFamily: INTER, fontWeight: 600, fontSize: 32, color: '#5f666e', textShadow: '0 0 6px #fff, 0 0 3px #fff, 0 0 2px #fff'}}>{l.nome}</span>
                </div>
              </div>
            ))}
            {/* alfinete vermelho: cai, amassa um pouco e assenta; rótulo entra com passada */}
            {frame >= qPino && (
              <div style={{position: 'absolute', left: px, top: py, width: 0, height: 0, transformStyle: 'preserve-3d'}}>
                <div style={{position: 'absolute', left: -30, top: -76, width: 60, height: 76, ...billboard(1), transform: `translateZ(70px) ${billboard(1).transform}`}}>
                  <div style={{transform: `translateY(${pino}px) scale(${2 - amassa}, ${amassa})`, transformOrigin: '50% 100%'}}>
                    <svg width={60} height={76} viewBox="0 0 30 38"><path d="M15 37 C 10 28, 3 22, 3 14 A12 12 0 0 1 27 14 C 27 22, 20 28, 15 37 Z" fill="#EA4335" stroke="#fff" strokeWidth={2.4} /><circle cx={15} cy={14} r={4.5} fill="#fff" /></svg>
                  </div>
                  <div style={{position: 'absolute', left: 66, top: 8, whiteSpace: 'nowrap', fontFamily: INTER, fontWeight: 700, fontSize: 36, color: '#EA4335', textShadow: '0 0 6px #fff, 0 0 3px #fff', transform: `scale(${rot})`, transformOrigin: 'left center'}}>{destino}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* névoa da distância */}
        <AbsoluteFill style={{background: `linear-gradient(rgba(228,233,238,${0.9 - sobe * 0.35}) 0%, rgba(228,233,238,0) ${30 - sobe * 14}%)`}} />
      </div>
      {/* cartão da viagem */}
      <div style={{position: 'absolute', left: (width - 1080 * k) / 2, top: (height - 1350 * k) / 2, width: 1080, height: 1350, transform: `scale(${k})`, transformOrigin: '0 0', pointerEvents: 'none'}}>
        {frame >= qCard && (
          <div style={{position: 'absolute', left: 40, right: 40, top: 1120, height: 160, background: '#fff', borderRadius: 30, boxShadow: '0 12px 40px rgba(30,40,60,0.18)', transform: `translateY(${(1 - card) * 360}px)`, display: 'flex', alignItems: 'center', padding: '0 40px', fontFamily: INTER}}>
            <div style={{flex: 1}}>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 10, color: '#121417'}}>
                <div style={{height: 60, overflow: 'hidden', fontWeight: 800, fontSize: 56, letterSpacing: -2, fontVariantNumeric: 'tabular-nums', lineHeight: '60px'}}>
                  <div style={{transform: `translateY(${-odo * 60}px)`}}>
                    {Array.from({length: minutosInicio - minutos + 1}, (_, i) => <div key={i}>{minutosInicio - i}</div>)}
                  </div>
                </div>
                <span style={{fontWeight: 800, fontSize: 56, letterSpacing: -2}}>min</span>
              </div>
              <div style={{fontWeight: 500, fontSize: 24, color: '#6B737C', marginTop: 6}}>{distancia} · <span style={{color: '#1F9D55', fontWeight: 600}}>{rotaTexto}</span></div>
            </div>
            <div style={{width: 130, height: 76, borderRadius: 18, background: '#1A73E8', color: '#fff', fontWeight: 700, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{botao}</div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
