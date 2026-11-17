// ESTILO: Teatro de sombras
// Um pano de algodão iluminado por trás por uma lamparina que tremula. Tudo é
// boneco recortado em preto, preso em vareta: nasce desfocado longe do pano e
// fica nítido quando encosta nele. Entre as cenas o boneco se afasta e a luz baixa.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarCinzel} from '@remotion/google-fonts/Cinzel';
import type {PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, cenasPorFrase, chega, ramp, useTela} from '../../kit';

const {fontFamily: CINZEL} = carregarCinzel('normal', {weights: ['700'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** A sombra é uma cor só. A luz é que muda. */
export const PRETO = '#140904';
const NIVEIS = 6; // quantos desfoques prontos existem (do nítido ao longe)

/** O pano iluminado: luz quente no meio que tremula, fibra do tecido e borda escura. */
const Fundo: React.FC<{t: number}> = ({t}) => {
  const {L, A, u} = useTela();
  const tremor = 1 + balanco(t, 3.2) * 0.035 + (acaso(`luz${Math.floor(t * 12)}`) - 0.5) * 0.02;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Tela>
        <defs>
          <radialGradient id="teatro-de-sombras-luz" cx="50%" cy="34%" r="62%">
            <stop offset="0%" stopColor="#fff2cf" />
            <stop offset="38%" stopColor="#f2a64a" />
            <stop offset="74%" stopColor="#8a3a12" />
            <stop offset="100%" stopColor="#1e0802" />
          </radialGradient>
          <filter id="teatro-de-sombras-pano" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9 0.02" numOctaves={2} seed={3} />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.9 0.75" />
          </filter>
          {/* os desfoques: 0 é o boneco encostado no pano, o último é bem longe */}
          {Array.from({length: NIVEIS}, (_, i) => (
            <filter key={i} id={`teatro-de-sombras-d${i}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={(1.6 + i * i * 1.4) * u} />
            </filter>
          ))}
          <linearGradient id="teatro-de-sombras-baixo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.55" stopColor="#000" stopOpacity={0} />
            <stop offset="0.85" stopColor="#000" stopOpacity={0.55} />
          </linearGradient>
        </defs>
        <rect width={L} height={A} fill="url(#teatro-de-sombras-luz)" opacity={Math.min(1, tremor)} />
        <rect width={L} height={A} filter="url(#teatro-de-sombras-pano)" opacity={0.18} />
        <rect width={L} height={A} fill="url(#teatro-de-sombras-baixo)" />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'teatro-de-sombras',
  nome: 'Teatro de sombras',
  fundo: '#1e0802',
  tinta: PRETO,
  acento: '#ffd79a',
  legenda: {
    fonte: CINZEL,
    peso: 700,
    tamanho: 66,
    cor: '#fff4dc',
    destaque: '#ffc46b',
    sombra: '0 3px 0 #000, 0 0 22px #000, 0 0 8px #000',
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/**
 * Um boneco de sombra. `longe` de 0 (encostado no pano, nítido) a 1 (longe, desfocado e maior).
 * `vareta` é o comprimento da haste que desce do boneco até fora da tela.
 */
export const Boneco: React.FC<{x: number; y: number; longe?: number; giro?: number; esc?: number; vareta?: number; children: React.ReactNode}> = ({
  x,
  y,
  longe = 0,
  giro = 0,
  esc = 1,
  vareta = 0,
  children,
}) => {
  const {A, u} = useTela();
  const l = Math.max(0, Math.min(1, longe));
  if (l >= 1) return null;
  const nivel = Math.min(NIVEIS - 1, Math.round(l * (NIVEIS - 1)));
  const s = esc * (1 + l * 0.25);
  return (
    <g opacity={1 - l * 0.6} filter={`url(#teatro-de-sombras-d${nivel})`}>
      {vareta > 0 && <line x1={x} y1={y} x2={x + 24 * u} y2={Math.max(A * 1.02, y + vareta)} stroke={PRETO} strokeWidth={5 * u} />}
      <g transform={`translate(${x} ${y}) rotate(${giro}) scale(${s})`} fill={PRETO} fillRule="evenodd">
        {children}
      </g>
    </g>
  );
};

/** O letreiro: palavras recortadas numa tábua de sombra, que chega de longe até o pano. */
export const Letreiro: React.FC<{x: number; y: number; texto: string; longe: number; tamanho?: number}> = ({x, y, texto, longe, tamanho = 100}) => {
  const {u} = useTela();
  const w = texto.length * tamanho * 0.72 * u;
  return (
    <Boneco x={x} y={y} longe={longe} vareta={1}>
      <text y={0} textAnchor="middle" fontFamily={CINZEL} fontWeight={700} fontSize={tamanho * u} letterSpacing={2 * u}>
        {texto}
      </text>
      <rect x={-w / 2} y={tamanho * 0.22 * u} width={w} height={10 * u} />
    </Boneco>
  );
};

/** A transição: a luz baixa como se a lamparina soprasse. Ponha por cima de tudo. `p` de 0 a 1. */
export const Sopro: React.FC<{p: number}> = ({p}) => (p > 0 ? <AbsoluteFill style={{background: '#000', opacity: p * 0.85}} /> : null);

/** O quanto o boneco está longe numa cena: chega do fundo em `chegada` e se afasta no fim. */
export const longeDe = (t: number, dur: number, chegada = 0) => Math.max(1 - ramp(t, chegada, chegada + 0.6, chega), ramp(t, dur - 0.5, dur));

// ---------- 3. alguns desenhos prontos ----------
// Todo desenho é um <Boneco> com formas pretas: um contorno com furos de renda
// (o `evenodd` vaza os furos) e uma vareta. Coisa nova segue o mesmo jeito.

type Desenho = {x: number; y: number; tam?: number; longe?: number; t?: number};

/** Furos redondos que vazam a luz, como a renda dos bonecos de couro. */
export const furos = (pts: [number, number, number][]) =>
  pts.map(([x, y, r]) => `M${x - r},${y}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0Z`).join('');

export const Sol: React.FC<Desenho> = ({x, y, tam = 200, longe = 0, t = 0}) => {
  const r = tam / 2;
  const raios = Array.from({length: 24}, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    const b = ((i + 0.5) / 24) * Math.PI * 2;
    const rr = i % 2 ? r : r * 0.85;
    return `${i ? 'L' : 'M'}${Math.cos(a) * r * 0.66},${Math.sin(a) * r * 0.66}L${Math.cos(b) * rr},${Math.sin(b) * rr}`;
  }).join('');
  const d = raios + 'Z' + furos([[0, 0, r * 0.3]]) + furos(Array.from({length: 10}, (_, i) => [Math.cos((i / 10) * 6.283) * r * 0.48, Math.sin((i / 10) * 6.283) * r * 0.48, r * 0.05] as [number, number, number]));
  return (
    <Boneco x={x} y={y} longe={longe} giro={t * 12} vareta={1}>
      <path d={d} />
    </Boneco>
  );
};

export const Nuvem: React.FC<Desenho> = ({x, y, tam = 320, longe = 0, t = 0}) => {
  const w = tam / 320;
  return (
    <Boneco x={x + balanco(t, 0.4) * tam * 0.04} y={y} longe={longe} esc={w} vareta={1}>
      <path d={'M-150 30 Q-150 -20 -100 -20 Q-90 -70 -30 -66 Q0 -110 60 -76 Q120 -80 120 -20 Q170 -16 160 30 Z' + furos([[-80, 5, 9], [-40, 5, 9], [0, 5, 9], [40, 5, 9], [80, 5, 9]])} />
    </Boneco>
  );
};

/** Riscos de chuva caindo (sombra fina). `forca` de 0 a 1 liga aos poucos. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; longe?: number}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  longe = 0,
}) => {
  const {u} = useTela();
  return (
    <Boneco x={0} y={0} longe={longe}>
      {Array.from({length: 18}, (_, i) => {
        if (i / 18 >= forca) return null;
        const fase = (t * (1 + acaso(`sv${i}`) * 0.5) + acaso(`sf${i}`)) % 1;
        const px = x - largura / 2 + ((i + 0.5) / 18) * largura;
        const py = y + fase * altura;
        return <rect key={i} x={px} y={py} width={7 * u} height={44 * u} rx={3 * u} transform={`rotate(12 ${px} ${py})`} />;
      })}
    </Boneco>
  );
};

/** O mar: três ondas recortadas que correm em sentidos opostos. Cobre de `y` até o pé da tela. */
export const Mar: React.FC<{y: number; t: number; longe?: number; p?: number}> = ({y, t, longe = 0, p = 1}) => {
  const {L, A, u} = useTela();
  return (
    <Boneco x={0} y={0} longe={longe}>
      {[0, 1, 2].map((i) => {
        const yy = y + i * 50 * u + (1 - ramp(p, i * 0.15, 0.6 + i * 0.15, chega)) * A * 0.4;
        const fase = (t * (i % 2 ? -1.6 : 1.2)) + i;
        let d = `M${-60 * u} ${A} L${-60 * u} ${yy}`;
        for (let x = -60 * u; x <= L + 60 * u; x += 20 * u) d += ` L${x} ${yy + Math.sin(x / ((60 + i * 15) * u) + fase) * (18 - i * 3) * u}`;
        return <path key={i} d={d + ` L${L + 60 * u} ${A} Z`} opacity={i === 0 ? 0.55 : 1} />;
      })}
    </Boneco>
  );
};

/** Um broto que cresce: `p` de 0 a 1 sobe o caule e abre as folhas recortadas. */
export const Planta: React.FC<Desenho & {p: number}> = ({x, y, tam = 300, p, longe = 0, t = 0}) => {
  const h = tam * ramp(p, 0, 0.6, chega);
  const folha = (lado: number, alt: number, q: number) =>
    `M0 ${-alt} Q${lado * tam * 0.12 * q} ${-alt - tam * 0.2 * q} ${lado * tam * 0.36 * q} ${-alt - tam * 0.14 * q} Q${lado * tam * 0.18 * q} ${-alt + tam * 0.04 * q} 0 ${-alt + 4} Z`;
  return (
    <Boneco x={x} y={y} longe={longe} giro={balanco(t, 0.7) * 3}>
      <rect x={-tam * 0.025} y={-h} width={tam * 0.05} height={h} />
      <path d={folha(-1, h * 0.45, ramp(p, 0.3, 0.7, chega))} />
      <path d={folha(1, h * 0.75, ramp(p, 0.45, 0.85, chega))} />
      {p > 0.7 && <path d={furos([[0, -h - tam * 0.06, tam * 0.07 * ramp(p, 0.7, 1)]])} />}
    </Boneco>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Abertura: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A} = useTela();
  return (
    <>
      <Tela>
        <Mar y={A * 0.56} t={t} />
        <Letreiro x={L / 2} y={A * 0.3} texto="O CICLO" longe={longeDe(t, dur, 0.1)} tamanho={120} />
        <Letreiro x={L / 2} y={A * 0.42} texto="DA ÁGUA" longe={longeDe(t, dur, 0.4)} tamanho={120} />
      </Tela>
      <Sopro p={ramp(t, dur - 0.35, dur) - ramp(t, dur, dur + 0.3)} />
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const sobe = ramp(t, 0, 1.4, chega);
  return (
    <Tela>
      <Sol x={L * 0.62} y={A * (0.5 - sobe * 0.26)} tam={300 * u} longe={longeDe(t, dur, 0.1)} t={t} />
      <Mar y={A * 0.52} t={t} p={ramp(t, 0, 0.8)} />
      {/* o calor: fiapos de sombra que sobem tremendo da água */}
      {[0.3, 0.45, 0.6].map((fx, i) => (
        <Boneco key={i} x={L * fx + balanco(t, 2, i) * 12 * u} y={A * 0.48} longe={1 - ramp(t, 1.1 + i * 0.2, 1.6 + i * 0.2)}>
          <path d={`M0 0 q${18 * u} ${-24 * u} 0 ${-48 * u} q${-18 * u} ${-24 * u} 0 ${-48 * u}`} fill="none" stroke={PRETO} strokeWidth={9 * u} strokeLinecap="round" />
        </Boneco>
      ))}
    </Tela>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <Tela>
      <Mar y={A * 0.54} t={t} />
      {Array.from({length: 7}, (_, i) => {
        const fase = (t * 0.55 + i / 7) % 1;
        return (
          <Boneco key={i} x={L * (0.3 + (i % 4) * 0.13) + Math.sin(fase * 6 + i) * 18 * u} y={A * (0.5 - fase * 0.26)} longe={fase * 0.5}>
            <circle r={(16 + fase * 12) * u} />
          </Boneco>
        );
      })}
      <Nuvem x={L * 0.5} y={A * 0.22} tam={(300 + ramp(t, 0.8, dur) * 160) * u} longe={longeDe(t, dur, 0.6)} t={t} />
    </Tela>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const pesa = ramp(t, 0.2, 0.9);
  return (
    <Tela>
      <Mar y={A * 0.56} t={t} />
      <Chuva x={L * 0.5} y={A * 0.26} largura={420 * u} altura={A * 0.28} t={t} forca={ramp(t, 0.7, 1.5)} longe={ramp(t, dur - 0.5, dur)} />
      <Nuvem x={L * 0.5} y={A * (0.2 + pesa * 0.04)} tam={(480 + pesa * 40) * u} longe={ramp(t, dur - 0.5, dur)} t={t} />
    </Tela>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const vai = ramp(t, 1.4, 2.4);
  return (
    <Tela>
      <Chuva x={L * 0.42} y={A * 0.24} largura={360 * u} altura={A * 0.26} t={t} forca={1 - vai} longe={vai * 0.6} />
      <Nuvem x={L * 0.42} y={A * 0.2} tam={400 * u} longe={1 - ramp(t, 0, 0.5) + vai * 0.5} t={t} />
      <Planta x={L * 0.6} y={A * 0.54} tam={360 * u} p={ramp(t, 0.5, 2.5)} t={t} />
      {/* o chão: um morro recortado */}
      <Boneco x={0} y={0}>
        <path d={`M0 ${A} L0 ${A * 0.56} Q${L * 0.5} ${A * 0.5} ${L} ${A * 0.56} L${L} ${A} Z`} />
      </Boneco>
    </Tela>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, que já está no letreiro: sem legenda nesse trecho
    semLegenda={[[0, FALA_EXEMPLO.frases[1].s]]}
    cenas={cenasPorFrase(FALA_EXEMPLO, [
      [0, 0, Abertura, 0],
      [1, 1, SolEMar, 0.3],
      [2, 2, VaporENuvem, 0.3],
      [3, 3, NuvemEChuva, 0.3],
      [4, 4, ChuvaEPlanta, 0.3],
    ])}
  />
);
