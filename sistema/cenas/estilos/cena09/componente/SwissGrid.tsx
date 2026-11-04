// cena09 — Swiss Grid (Grade suíça). Componente reutilizável (EditOS, cenas/estilos).
// Grade modular desenhada, círculo andando de célula em célula, campo vermelho abrindo da célula, texto empurrado da margem.
// Desenho em espaço 1080x1350 (4:5) centralizado; o papel preenche qualquer formato.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/PublicSans';

const {fontFamily} = loadFont('normal', {weights: ['600', '800'], subsets: ['latin', 'latin-ext']});

export type SwissGridProps = {
  linhas?: [string, string, string];
  legendas?: [string, string, string, string];
  largura?: number;
  altura?: number;
  cores?: {papel: string; tinta: string; vermelho: string};
};

const CORES = {papel: '#F0F0E8', tinta: '#101010', vermelho: '#F03820'};
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const M = 225; // módulo
const X0 = 90; // margem esquerda
const Y0 = 36;
const gx = (c: number) => X0 + c * M;
const gy = (r: number) => Y0 + r * M;

export const SwissGrid: React.FC<SwissGridProps> = ({
  linhas = ['A forma', 'segue o', 'ritmo.'],
  legendas = ['Grade', 'Campo', 'Tipo', 'Círculo'],
  largura,
  altura,
  cores = CORES,
}) => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const W = largura ?? width;
  const H = altura ?? height;
  const s = Math.min(W / 1080, H / 1350);
  const sp = (d: number, damping = 11, stiffness = 200) => spring({frame: f - d, fps, config: {damping, stiffness}});
  const longo = Easing.bezier(0.1, 0.8, 0.15, 1);

  // grade: verticais caem, horizontais varrem, ~2 quadros entre si (já desenhando no quadro 1)
  const verts = [0, 1, 2, 3, 4].map((c, i) => interpolate(f, [-6 + i * 2, 10 + i * 2], [0, 1], {...cl, easing: longo}));
  const hors = [0, 1, 2, 3, 4, 5, 6].map((r, i) => interpolate(f, [-4 + i * 2, 12 + i * 2], [0, 1], {...cl, easing: longo}));

  // círculo anda como torre: (0,0) → (1,0) → (2,0) → (2,1)
  const passos: [number, number][] = [[0, 0], [1, 0], [2, 0], [2, 1]];
  let ccx = gx(0) + M / 2;
  let ccy = gy(0) + M / 2;
  let vel = 0;
  for (let k = 1; k < passos.length; k++) {
    const d = 4 + (k - 1) * 5;
    const p = sp(d, 12, 260);
    const p0 = sp(d - 1, 12, 260);
    vel = Math.max(vel, Math.abs(p - p0));
    ccx += (passos[k][0] - passos[k - 1][0]) * M * p;
    ccy += (passos[k][1] - passos[k - 1][1]) * M * p;
  }
  const dir = f < 15 ? 'x' : 'y';
  // círculo recua ~10% e cresce para o lugar de dois módulos (colunas 2-3, linhas 0-1)
  const cresce = sp(56, 12, 170);
  const recua = interpolate(f, [50, 56], [0, 0.1], cl) * (1 - cresce);
  const raio = (M / 2 - 3) * (1 - recua) + (M / 2) * cresce;
  const fx = gx(3), fy = gy(1);
  ccx = ccx + (fx - ccx) * cresce;
  ccy = ccy + (fy - ccy) * cresce;
  const velC = Math.abs(cresce - sp(55, 12, 170));

  // campo vermelho: abre da célula (2,1) → atravessa as colunas até sangrar à direita → sobe e sangra no topo
  const c1 = sp(18, 12, 220);
  const c2 = sp(24, 12, 200);
  const c3 = sp(30, 12, 200);
  const h1 = (M / 2) * (1 - c1);
  const L = gx(2) + h1 - (gx(2) - gx(1)) * c2;
  const R = gx(3) - h1 + (1090 - gx(3)) * c2;
  const T = gy(1) + h1 - (gy(1) + 10) * c3;
  const Bt = gy(2) - h1 + (gy(3) - gy(2)) * c3;
  const rect = {x: L, y: T, w: R - L, h: Bt - T};
  const velCampo = Math.abs(c2 - sp(23, 12, 200)) + Math.abs(c3 - sp(29, 12, 200));

  const linhaD = (i: number) => 36 + i * 6;

  return (
    <AbsoluteFill style={{backgroundColor: cores.papel, overflow: 'hidden'}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="mbc09" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={dir === 'x' ? `${vel * 90} 0` : `0 ${vel * 90}`} /></filter>
        <filter id="mbg09" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={`${velC * 60}`} /></filter>
        <filter id="mbf09" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={`${velCampo * 50}`} /></filter>
      </svg>
      <div style={{position: 'absolute', left: (W - 1080 * s) / 2, top: (H - 1350 * s) / 2, width: 1080, height: 1350, transform: `scale(${s})`, transformOrigin: '0 0', fontFamily, color: cores.tinta}}>
        {/* campo vermelho */}
        {f >= 18 && (
          <div style={{position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h, background: cores.vermelho, filter: velCampo > 0.01 ? 'url(#mbf09)' : undefined}} />
        )}
        {/* grade 2px */}
        <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
          {verts.map((p, i) => <line key={`v${i}`} x1={gx(i)} y1={0} x2={gx(i)} y2={1350 * p} stroke={cores.tinta} strokeWidth={2} opacity={0.85} />)}
          {hors.map((p, i) => <line key={`h${i}`} x1={0} y1={gy(i)} x2={1080 * p} y2={gy(i)} stroke={cores.tinta} strokeWidth={2} opacity={0.85} />)}
        </svg>
        {/* círculo */}
        <div style={{position: 'absolute', left: ccx - raio, top: ccy - raio, width: raio * 2, height: raio * 2, borderRadius: '50%', background: cores.tinta, filter: f < 22 && vel > 0.01 ? 'url(#mbc09)' : velC > 0.01 ? 'url(#mbg09)' : undefined}} />
        {/* texto empurrado para fora da linha da margem, alinhado à esquerda, linha de base na grade */}
        {linhas.map((l, i) => {
          const p = sp(linhaD(i), 11, 190);
          const base = gy(3) + i * M;
          return (
            <div key={i} style={{position: 'absolute', left: X0, top: base - 238, height: 260, width: 990, overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: -10, bottom: 18, fontSize: 228, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, whiteSpace: 'pre', transform: `translateX(${(1 - p) * -105}%)`}}>{l}</div>
            </div>
          );
        })}
        {/* legendas numeradas caem de uma linha da grade */}
        {legendas.map((l, i) => {
          const d = [24, 30, 48, 64][i];
          const p = sp(d, 12, 200);
          return (
            <div key={i} style={{position: 'absolute', left: gx(i) + 2, top: gy(5) + 18, height: 40, overflow: 'hidden', width: M}}>
              <div style={{fontSize: 24, fontWeight: 600, transform: `translateY(${(1 - p) * -110}%)`, whiteSpace: 'pre'}}>
                {String(i + 1).padStart(2, '0')}  <span style={{opacity: 0.6}}>{l}</span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
