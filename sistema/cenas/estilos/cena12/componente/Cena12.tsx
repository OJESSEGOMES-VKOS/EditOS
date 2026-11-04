// cena12 — Exploded Teardown (Explodido). CSS 3D com caixas de verdade (topo + laterais), sem recorte plano.
// Palco base 1080x1350, recomposto em qualquer formato. Produto da demo: teclado genérico de 21 teclas.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont as loadSans} from '@remotion/google-fonts/IBMPlexSans';
import {loadFont as loadMono} from '@remotion/google-fonts/IBMPlexMono';

const {fontFamily: SANS} = loadSans('normal', {weights: ['600', '700'], subsets: ['latin']});
const {fontFamily: MONO} = loadMono('normal', {weights: ['400', '500'], subsets: ['latin']});

export type Parte = {nome: string; spec: string};
export type Cena12Props = {
  width?: number;
  height?: number;
  partes?: Parte[]; // de cima para baixo: teclas, chaves, placa, placa de circuito, colunas, caixa
  titulo?: string;
  specTitulo?: string;
  laranja?: string;
};

const COLS = 7, ROWS = 3, U = 62; // grade de teclas
const BW = COLS * U + 40, BH = ROWS * U + 40; // tamanho da base

type BoxP = {x: number; y: number; w: number; h: number; d: number; z?: number; topo: string; lado: string; frente: string; topoExtra?: React.ReactNode; raio?: number};
const Caixa: React.FC<BoxP> = ({x, y, w, h, d, z = 0, topo, lado, frente, topoExtra, raio = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transformStyle: 'preserve-3d', transform: `translateZ(${z}px)`}}>
    <div style={{position: 'absolute', inset: 0, background: frente, borderRadius: raio}} />
    <div style={{position: 'absolute', left: 0, top: h, width: w, height: d, background: frente, transformOrigin: 'top', transform: 'rotateX(90deg)'}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: d, background: lado, transformOrigin: 'top', transform: 'rotateX(90deg)'}} />
    <div style={{position: 'absolute', left: w, top: 0, width: d, height: h, background: lado, transformOrigin: 'left', transform: 'rotateY(-90deg)'}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: d, height: h, background: frente, transformOrigin: 'left', transform: 'rotateY(-90deg)'}} />
    <div style={{position: 'absolute', inset: 0, background: topo, transform: `translateZ(${d}px)`, borderRadius: raio}}>{topoExtra}</div>
  </div>
);

export const Cena12: React.FC<Cena12Props> = ({
  width = 1080,
  height = 1350,
  partes = [
    {nome: 'Teclas', spec: 'PBT · 1u × 21'},
    {nome: 'Chaves', spec: 'lineares · encaixe'},
    {nome: 'Placa', spec: 'alumínio de 1,5 mm'},
    {nome: 'Placa de circuito', spec: 'um chip, 21 teclas'},
    {nome: 'Colunas', spec: 'latão · M2 × 4'},
    {nome: 'Caixa', spec: 'bandeja com junta'},
  ],
  titulo = '21 teclas, aberto',
  specTitulo = 'VISTA EXPLODIDA · 6 CAMADAS · PASSO DE 19,05 MM',
  laranja = '#FF5A2A',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = Math.min(width / 1080, height / 1350);
  const kF = Math.max(width / 1080, height / 1350);

  // câmera: recua e desliza para a esquerda no primeiro segundo; órbita de ~10 graus no plano todo
  const recua = interpolate(frame, [0, 30], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const esc = interpolate(recua, [0, 1], [1.45, 1.13]);
  const cx = interpolate(recua, [0, 1], [540, 330]);
  const cy = interpolate(recua, [0, 1], [640, 470]);
  const orb = interpolate(frame, [0, 140], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const rotZ = -28 - orb * 10, rotX = 58, PERS = 2600;

  // alturas: montado -> explodido, de cima para baixo, uma camada a cada 10 quadros, mola com ~10% de passada
  const montado = [34, 26, 20, 12, 4, 0];
  const passo = 118;
  const explodido = [5 * passo, 4 * passo, 3 * passo, 2 * passo, passo * 1.0, 0];
  const qCamada = (i: number) => 8 + i * 10;
  const sobe = (i: number, f = frame) => (i === 5 ? 1 : spring({frame: f - qCamada(i), fps, config: {damping: 9, stiffness: 180, mass: 0.55}}));
  const zDe = (i: number, f = frame) => montado[i] + (explodido[i] - montado[i]) * sobe(i, f) - explodido[2] * 0.95 * Math.min(1, sobe(2, f));

  // projeção igual à do CSS (rotateX(rotX) rotateZ(rotZ) + perspectiva) para ancorar as linhas-guia
  const proj = (x: number, y: number, z: number) => {
    const a = (rotZ * Math.PI) / 180, b = (rotX * Math.PI) / 180;
    const x1 = x * Math.cos(a) - y * Math.sin(a);
    const y1 = x * Math.sin(a) + y * Math.cos(a);
    const y2 = y1 * Math.cos(b) - z * Math.sin(b);
    const z2 = y1 * Math.sin(b) + z * Math.cos(b);
    const f = PERS / (PERS - z2);
    return {x: cx + esc * x1 * f, y: cy + esc * y2 * f};
  };

  const teclas: React.ReactNode[] = [];
  const chaves: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const destaque = r === 1 && c === COLS - 1;
      const cinza = c === 0 || c === COLS - 1 || r === ROWS - 1 && c > 4;
      const x = 20 + c * U + 5, y = 20 + r * U + 5;
      teclas.push(<Caixa key={`t${r}${c}`} x={x} y={y} w={U - 10} h={U - 10} d={22} raio={5} topo={destaque ? `linear-gradient(135deg,#ff7a50,${laranja})` : cinza ? 'linear-gradient(135deg,#b9bcc2,#9a9ea5)' : 'linear-gradient(135deg,#f6f3ec,#e2ddd2)'} lado={destaque ? '#b83a17' : cinza ? '#6f737a' : '#a9a397'} frente={destaque ? '#d9481f' : cinza ? '#83878e' : '#c7c1b4'} />);
      chaves.push(
        <Caixa key={`c${r}${c}`} x={x + 5} y={y + 5} w={U - 20} h={U - 20} d={22} topo="linear-gradient(135deg,#3a3c41,#232428)" lado="#0d0d0f" frente="#1a1b1e"
          topoExtra={<div style={{position: 'absolute', left: '30%', top: '30%', width: '40%', height: '40%', background: '#e0302b', borderRadius: 3, boxShadow: '0 0 0 2px #8a1612'}} />} />,
      );
    }

  const furos = Array.from({length: COLS * ROWS}, (_, i) => <div key={i} style={{position: 'absolute', left: 20 + (i % COLS) * U + 14, top: 20 + Math.floor(i / COLS) * U + 14, width: U - 28, height: U - 28, background: '#0b0b0d'}} />);
  const pcbExtra = (
    <svg width={BW} height={BH} style={{position: 'absolute', inset: 0}}>
      {Array.from({length: 40}, (_, i) => <circle key={i} cx={30 + ((i * 53) % (BW - 60))} cy={25 + ((i * 37) % (BH - 50))} r={2.4} fill="#e9e3c0" />)}
      {Array.from({length: 12}, (_, i) => <path key={'p' + i} d={`M${30 + i * 36} 30 v ${60 + (i % 3) * 30} h 30`} stroke="#3b8c56" strokeWidth={2} fill="none" />)}
      <rect x={BW / 2 - 26} y={BH / 2 - 26} width={52} height={52} fill="#141414" />
    </svg>
  );

  const camadas: React.ReactNode[] = [
    <div key="0" style={{transformStyle: 'preserve-3d'}}>{teclas}</div>,
    <div key="1" style={{transformStyle: 'preserve-3d'}}>{chaves}</div>,
    <Caixa key="2" x={0} y={0} w={BW} h={BH} d={7} topo="linear-gradient(135deg,#2c2e33,#1a1b1e)" lado="#0e0e10" frente="#141416" topoExtra={<>{furos}</>} raio={6} />,
    <Caixa key="3" x={4} y={4} w={BW - 8} h={BH - 8} d={6} topo="linear-gradient(135deg,#1f8a4a,#126b36)" lado="#0b3d20" frente="#0e4f29" topoExtra={pcbExtra} raio={4} />,
    <div key="4" style={{transformStyle: 'preserve-3d'}}>{[[14, 14], [BW - 30, 14], [14, BH - 30], [BW - 30, BH - 30]].map(([x, y], i) => <Caixa key={i} x={x + 3} y={y + 3} w={8} h={8} d={Math.max(6, zDe(3) - zDe(4) - 2)} topo="#c9a15a" lado="#5e4319" frente="#7d5a24" raio={4} />)}</div>,
    <div key="5" style={{transformStyle: 'preserve-3d'}}>
      <Caixa x={-12} y={-12} w={BW + 24} h={BH + 24} d={8} topo="linear-gradient(135deg,#34363b,#202125)" lado="#0c0c0e" frente="#17181b" raio={12} />
      <Caixa x={-12} y={-12} w={BW + 24} h={14} d={34} topo="#3a3c42" lado="#121214" frente="#1d1e22" />
      <Caixa x={-12} y={BH - 2} w={BW + 24} h={14} d={34} topo="#3a3c42" lado="#121214" frente="#26272c" />
      <Caixa x={-12} y={-12} w={14} h={BH + 24} d={34} topo="#3a3c42" lado="#121214" frente="#1d1e22" />
      <Caixa x={BW - 2} y={-12} w={14} h={BH + 24} d={34} topo="#3a3c42" lado="#2a2b30" frente="#1d1e22" />
    </div>,
  ];

  // rótulos: coluna à direita, cada um no ritmo da sua camada
  const rotuloX = 700;
  const titQ = qCamada(5) + 14;
  const barra = interpolate(frame, [titQ, titQ + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const palavras = titulo.split(' ');

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: 'radial-gradient(ellipse 60% 50% at 40% 40%, #2A2D33 0%, #16171b 60%, #0A0A0C 100%)'}}>
      <svg width="100%" height="100%" style={{position: 'absolute', opacity: 0.06}}>
        <filter id="as12g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={1} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter="url(#as12g)" />
      </svg>
      <div style={{position: 'absolute', left: (width - 1080 * k) / 2, top: (height - 1350 * k) / 2, width: 1080, height: 1350, transform: `scale(${k})`, transformOrigin: '0 0'}}>
        {/* o produto */}
        <div style={{position: 'absolute', left: cx, top: cy, width: 0, height: 0, transform: `scale(${esc})`, perspective: PERS}}>
          <div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: `rotateX(${rotX}deg) rotateZ(${rotZ}deg)`}}>
            {[5, 4, 3, 2, 1, 0].map((i) => {
              const v = Math.abs(zDe(i) - zDe(i, frame - 1));
              return (
                <div key={i} style={{position: 'absolute', left: -BW / 2, top: -BH / 2, width: BW, height: BH, transformStyle: 'preserve-3d', transform: `translateZ(${zDe(i)}px)`}}>
                  {camadas[i]}
                </div>
              );
            })}
          </div>
        </div>
        {/* linhas-guia e rótulos */}
        <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
          {partes.map((p, i) => {
            const q = qCamada(i) + 6;
            const d = proj(BW / 2 + 8, BH / 2 - 30, zDe(i) + (i === 4 ? 60 : 12));
            const ly = 205 + i * 102 + (i >= 3 ? 10 : 0);
            const g = interpolate(frame, [q, q + 7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
            if (frame < q) return null;
            const ex = rotuloX - 18;
            return (
              <g key={i}>
                <line x1={d.x} y1={d.y} x2={d.x + (ex - d.x) * g} y2={d.y + (ly - d.y) * g} stroke="#6b7078" strokeWidth={1.5} />
                <circle cx={d.x} cy={d.y} r={5} fill="#ECEEF1" />
              </g>
            );
          })}
        </svg>
        {partes.map((p, i) => {
          const q = qCamada(i) + 9;
          const ly = 205 + i * 102 + (i >= 3 ? 10 : 0);
          const s = spring({frame: frame - q, fps, config: {damping: 11, stiffness: 220, mass: 0.5}});
          return (
            <div key={i} style={{display: frame >= q ? 'block' : 'none', position: 'absolute', left: rotuloX, top: ly - 22, overflow: 'hidden', paddingBottom: 4, whiteSpace: 'nowrap'}}>
              <div style={{transform: `translateY(${(1 - s) * 70}px)`}}>
                <div style={{display: 'flex', gap: 10, alignItems: 'baseline'}}>
                  <span style={{fontFamily: MONO, fontWeight: 500, fontSize: 27, color: laranja}}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 40, color: '#ECEEF1'}}>{p.nome}</span>
                </div>
                <div style={{fontFamily: MONO, fontSize: 24, color: '#A3A8B0', marginLeft: 46}}>{p.spec}</div>
              </div>
            </div>
          );
        })}
        {/* título por último */}
        <div style={{position: 'absolute', left: 95, top: 1000}}>
          <div style={{width: 64 * barra, height: 8, background: laranja}} />
          <div style={{display: 'flex', gap: 18, marginTop: 26, overflow: 'hidden', fontFamily: SANS, fontWeight: 700, fontSize: 84, color: '#ECEEF1', letterSpacing: -2, lineHeight: 1.1}}>
            {palavras.map((w, i) => {
              const s = spring({frame: frame - titQ - 4 - i * 4, fps, config: {damping: 13, stiffness: 200, mass: 0.6}});
              return <span key={i} style={{transform: `translateY(${(1 - s) * 100}px)`}}>{w}</span>;
            })}
          </div>
          <div style={{overflow: 'hidden', marginTop: 12}}>
            <div style={{fontFamily: MONO, fontSize: 21, letterSpacing: 2.5, color: '#A3A8B0', transform: `translateY(${(1 - spring({frame: frame - titQ - 18, fps, config: {damping: 14, stiffness: 200}})) * 40}px)`}}>{specTitulo}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
