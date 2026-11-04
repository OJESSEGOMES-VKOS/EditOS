// cena30 — Pilha de dinheiro (3D edição: caixas em CSS 3D, sem Blender).
// Maços de notas inventadas caem camada por camada num palete; a câmera sobe; o número rola um passo por camada.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/PlusJakartaSans';

const {fontFamily: JAKARTA} = loadFont('normal', {weights: ['700', '800'], subsets: ['latin']});

export type Cena30Props = {
  rotulo?: string;
  total?: number; // valor final (cada camada = total/camadas)
  camadas?: number; // padrão 10
  prefixo?: string;
  corFinal?: string;
  width?: number;
  height?: number;
  duracao?: number;
};

const BW = 158; // largura do maço (x)
const BD = 98; // comprimento (z)
const BH = 52; // altura
const COLS = 2;
const FILAS = 3;

const Face: React.FC<{w: number; h: number; t: string; bg: string; f?: string}> = ({w, h, t, bg, f}) => (
  <div style={{position: 'absolute', left: -w / 2, top: -h / 2, width: w, height: h, transform: t, background: bg, filter: f, backfaceVisibility: 'hidden'}} />
);

const borda = 'repeating-linear-gradient(to bottom, #d9e4d8 0 2px, #bfcdbf 2px 3px)';
// ponta do maço (frente): bordas de papel + cinta
const ponta = `linear-gradient(to right, transparent 0, transparent 100%), ${borda}`;
// lado comprido: bordas de papel e a cinta branca com dois fios verdes no meio
const lado = `linear-gradient(to right, transparent 0 40%, #EEF2EF 40% 41%, #3d8a5f 41% 42%, #EEF2EF 42% 58%, #3d8a5f 58% 59%, #EEF2EF 59% 60%, transparent 60%), ${borda}`;
// topo: nota inventada (borda fina + duas rosetas) cortada pela cinta
const topo = `linear-gradient(to right, transparent 40%, #EEF2EF 40% 41%, #3d8a5f 41% 42%, #EEF2EF 42% 58%, #3d8a5f 58% 59%, #EEF2EF 59% 60%, transparent 60%),
  radial-gradient(circle at 22% 50%, transparent 13px, #9fb69f 14px, transparent 15px, transparent 19px, #a9bea9 20px, transparent 21px),
  radial-gradient(circle at 78% 50%, transparent 13px, #9fb69f 14px, transparent 15px, transparent 19px, #a9bea9 20px, transparent 21px),
  linear-gradient(#CFDCCF, #CFDCCF) padding-box, linear-gradient(#a7bba7, #a7bba7)`;

const Maco: React.FC<{x: number; y: number; z: number; rz: number; sq: number}> = ({x, y, z, rz, sq}) => (
  <div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: `translate3d(${x}px, ${y}px, ${z}px) rotateZ(${rz}deg) scaleY(${sq}) scaleX(${2 - sq})`}}>
    <Face w={BW} h={BH} t={`translateZ(${BD / 2}px)`} bg={lado} f="brightness(1.04)" />
    <Face w={BD} h={BH} t={`rotateY(90deg) translateZ(${BW / 2}px)`} bg={borda} f="brightness(0.8)" />
    <Face w={BD} h={BH} t={`rotateY(-90deg) translateZ(${BW / 2}px)`} bg={borda} f="brightness(1.05)" />
    <div style={{position: 'absolute', left: -BW / 2, top: -BD / 2, width: BW, height: BD, transform: `rotateX(90deg) translateZ(${BH / 2}px)`,
      background: topo, border: '3px solid transparent', boxSizing: 'border-box', filter: 'brightness(1.1)'}} />
  </div>
);

export const Cena30: React.FC<Cena30Props> = ({
  rotulo = 'Como é R$ 1 milhão',
  total = 1000000,
  camadas = 10,
  prefixo = 'R$ ',
  corFinal = '#0E7A4C',
  width = 1080,
  height = 1350,
  duracao = 150,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = duracao / 150;
  const k = Math.min(width / 1080, height / 1350);
  // pousos: rápido, acelerando no meio
  const pousoBase = [0, 8, 16, 23, 30, 37, 44, 51, 59, 68].map((v) => v * s);
  const pousos = Array.from({length: camadas}, (_, i) => pousoBase[Math.min(i, 9)] + Math.max(0, i - 9) * 8 * s);
  const QUEDA = 9;

  const maços: React.ReactNode[] = [];
  for (let l = 0; l < camadas; l++) {
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < FILAS; r++) {
        const idx = c * FILAS + r;
        const pouso = pousos[l] + idx * 0.6 - 4;
        const p = interpolate(frame, [pouso - QUEDA, pouso], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        if (l > 0 && frame < pouso - QUEDA) continue;
        const queda = (1 - p * p) * 1000; // gravidade
        const rz = (1 - p) * (idx % 2 ? 7 : -6);
        const dt = frame - pouso;
        const sq = dt >= 0 && dt < 5 ? 1 - 0.09 * Math.sin((dt / 5) * Math.PI) : 1;
        const x = (c - (COLS - 1) / 2) * (BW + 3);
        const z = (r - (FILAS - 1) / 2) * (BD + 3);
        const y = -BH / 2 - l * (BH + 2) - queda;
        maços.push(<Maco key={`${l}-${c}-${r}`} x={x} y={y} z={z} rz={rz} sq={sq} />);
      }
    }
  }
  const aterrissadas = pousos.filter((p) => frame >= p).length;
  // odômetro: valor contínuo que rola por 6 quadros a cada pouso
  let v = 0;
  pousos.forEach((p) => {
    v += interpolate(frame, [p, p + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  });
  const passo = total / camadas;
  const valor = v * passo;
  const fim = pousos[camadas - 1];
  const soco = spring({frame: frame - fim, fps, config: {damping: 9, stiffness: 220}});
  const escalaNum = 1 + 0.08 * Math.sin(Math.min(1, soco) * Math.PI) * (frame >= fim ? 1 : 0);
  const cor = frame >= fim + 3 ? corFinal : '#101B16';

  const casas = String(Math.round(total)).length;
  const digitos: React.ReactNode[] = [];
  for (let i = casas - 1; i >= 0; i--) {
    const pot = Math.pow(10, i);
    let pos = 0;
    if (pot >= passo - 1e-6) {
      pos = pot <= passo + 1e-6 ? (valor / pot) % 10 : Math.floor(valor / pot + 1e-6) % 10 + Math.max(0, ((valor / (pot / 10)) % 10) - 9);
    }
    const lider = i === casas - 1;
    const vis = lider ? interpolate(pos, [0, 1], [0, 1], {extrapolateRight: 'clamp'}) : 1;
    const H = 170;
    const col = (
      <div key={i} style={{display: 'inline-block', height: H, overflow: 'hidden', width: lider ? `${0.62 * vis}em` : '0.62em', verticalAlign: 'top', textAlign: 'center'}}>
        <div style={{transform: `translateY(${-(pos % 10) * H}px)`}}>
          {[...Array(11)].map((_, d) => (
            <div key={d} style={{height: H, lineHeight: `${H}px`}}>{lider && d % 10 === 0 ? '' : d % 10}</div>
          ))}
        </div>
      </div>
    );
    digitos.push(col);
    if (i % 3 === 0 && i > 0) {
      const sv = i + 1 === casas ? vis : 1;
      digitos.push(<span key={`p${i}`} style={{display: 'inline-block', width: `${0.28 * sv}em`, overflow: 'hidden'}}>.</span>);
    }
  }

  const cam = interpolate(frame, [0, 80 * s], [6, 24], {extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1)});
  const sobe = interpolate(frame, [0, 80 * s], [0, 120], {extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1)});
  const afasta = interpolate(frame, [0, 80 * s], [160, -40], {extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1)});

  return (
    <AbsoluteFill style={{background: 'linear-gradient(to bottom, #F3F5F7 0%, #EEF1F3 55%, #E3E7EB 100%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 1080, height: 1350, marginLeft: -540, marginTop: -675, transform: `scale(${k})`}}>
        <div style={{position: 'absolute', inset: 0, perspective: 2600, perspectiveOrigin: '540px 500px'}}>
          <div style={{position: 'absolute', left: 540, top: 0, transformStyle: 'preserve-3d',
            transform: `translateY(${660 + sobe}px) translateZ(${afasta}px) rotateX(${-cam}deg) rotateY(-30deg)`}}>
            {/* sombra no chão (luz alta à esquerda) */}
            <div style={{position: 'absolute', left: -420, top: -420, width: 900, height: 900, transform: `translateY(${40}px) rotateX(90deg) translate(120px, -40px)`,
              background: `radial-gradient(ellipse 45% 40% at 50% 50%, rgba(60,70,80,${0.22 + 0.02 * aterrissadas}), rgba(60,70,80,0) 75%)`}} />
            {/* palete */}
            <div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: 'translateY(18px)'}}>
              <Face w={340} h={34} t="translateZ(160px)" bg="linear-gradient(to right, #5C6774 0 12%, #2c333b 12% 44%, #5C6774 44% 56%, #2c333b 56% 88%, #5C6774 88%)" />
              <Face w={320} h={34} t="rotateY(90deg) translateZ(170px)" bg="linear-gradient(to right, #46505b 0 12%, #20262c 12% 44%, #46505b 44% 56%, #20262c 56% 88%, #46505b 88%)" />
              <Face w={320} h={34} t="rotateY(-90deg) translateZ(170px)" bg="#5f6a77" />
              <div style={{position: 'absolute', left: -170, top: -160, width: 340, height: 320, transform: 'rotateX(90deg) translateZ(17px)', background: 'repeating-linear-gradient(to right, #6a7582 0 70px, #4d5763 70px 80px)'}} />
            </div>
            {maços}
          </div>
        </div>
        <div style={{position: 'absolute', top: 1010, width: '100%', textAlign: 'center', fontFamily: JAKARTA}}>
          <div style={{fontWeight: 700, fontSize: 46, color: '#5B6A63'}}>{rotulo}</div>
          <div style={{fontWeight: 800, fontSize: 140, color: cor, fontVariantNumeric: 'tabular-nums', height: 170, lineHeight: '170px', letterSpacing: -4,
            transform: `scale(${escalaNum})`, whiteSpace: 'nowrap'}}>
            <span style={{display: 'inline-block', height: 170, lineHeight: '170px', verticalAlign: 'top', marginRight: 14}}>{prefixo.trim()}</span>{digitos}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
