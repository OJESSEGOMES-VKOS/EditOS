// ESTILO: Oficina antiga
// A bancada de um artesão à noite: parede de tábuas, tampo de madeira, peças de
// latão e uma lâmpada quente. Tudo vira um pequeno teatro mecânico em cima da
// mesa: o sol é um disco de latão numa haste, o mar são cilindros de onda que
// giram, a nuvem é uma chapa pendurada por fios. A cena fecha e abre com o
// diafragma de latão. Bom pra "como funciona", história de invenção e mecanismo.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as carregarAnton} from '@remotion/google-fonts/Anton';
import type {PropsCena, Tema} from '../../kit';
import {Camera, FALA_EXEMPLO, Filme, Tela, acaso, balanco, cenasPorFrase, chega, elastico, lerp, ramp, useTela} from '../../kit';

const {fontFamily: SERIFA} = carregarPlayfair('normal', {weights: ['700'], subsets: ['latin', 'latin-ext']});
const {fontFamily: ANTON} = carregarAnton('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As cores da oficina: madeira, latão, papel velho e a luz quente da lâmpada. */
export const COR = {
  parede: '#1C110B',
  madeira: '#4A2B14',
  latao: '#D9A848',
  lataoEscuro: '#6E4A14',
  papel: '#F3E6C8',
  ferro: '#2A2420',
  agua: '#7FC4D6',
  aguaFunda: '#2E6F86',
  folha: '#5E8A3A',
  brasa: '#FF9A3C',
} as const;

const BANCADA = 0.5; // altura da beira da bancada, em fração da tela

/** Parede de tábuas, rodapé, tampo da bancada com veio, a poça de luz da lâmpada e a poeira no ar. */
const Fundo: React.FC<{t: number}> = ({t}) => {
  const {L, A, u} = useTela();
  const yb = A * BANCADA;
  return (
    <AbsoluteFill style={{background: COR.parede}}>
      <Tela>
        <defs>
          <linearGradient id="oficina-antiga-latao" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F7DE95" />
            <stop offset="0.38" stopColor="#D2A043" />
            <stop offset="0.68" stopColor="#97661F" />
            <stop offset="1" stopColor="#E2BC63" />
          </linearGradient>
          <linearGradient id="oficina-antiga-tampo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5A3519" />
            <stop offset="1" stopColor="#2A170A" />
          </linearGradient>
          <radialGradient id="oficina-antiga-luz">
            <stop offset="0" stopColor="#FFBA60" stopOpacity="0.45" />
            <stop offset="0.4" stopColor="#E68C3C" stopOpacity="0.2" />
            <stop offset="1" stopColor="#A0501E" stopOpacity="0" />
          </radialGradient>
          {/* a sombra que tudo em cima da bancada joga */}
          <filter id="oficina-antiga-sombra" x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow dx={8 * u} dy={16 * u} stdDeviation={10 * u} floodColor="#000" floodOpacity="0.6" />
          </filter>
        </defs>
        {/* tábuas da parede */}
        {Array.from({length: Math.ceil(L / (150 * u)) + 1}, (_, i) => (
          <rect key={i} x={i * 150 * u} y={0} width={146 * u} height={yb} fill={i % 2 ? '#22150D' : '#1E120B'} />
        ))}
        <rect x={0} y={yb - 22 * u} width={L} height={30 * u} fill="#3B2414" />
        <rect x={0} y={yb + 8 * u} width={L} height={A - yb} fill="url(#oficina-antiga-tampo)" />
        {Array.from({length: 18}, (_, i) => (
          <path key={i} d={`M0 ${yb + (30 + i * 46) * u} Q${L / 2} ${yb + (30 + i * 46 + 14 * Math.sin(i)) * u} ${L} ${yb + (30 + i * 46) * u}`} stroke="#000" strokeOpacity={0.18} strokeWidth={2 * u} fill="none" />
        ))}
        <ellipse cx={L / 2} cy={yb - 40 * u} rx={L * 0.75} ry={A * 0.42} fill="url(#oficina-antiga-luz)" opacity={0.9 + 0.1 * Math.sin(t * 7)} style={{mixBlendMode: 'screen'}} />
        {Array.from({length: 20}, (_, i) => {
          const x = acaso(`ox${i}`) * L + Math.sin(t * 0.3 + i) * 40 * u;
          const y = (((acaso(`oy${i}`) * A * 0.6 - t * 10 * u * (0.4 + acaso(`ov${i}`))) % (A * 0.6)) + A * 0.6) % (A * 0.6);
          return <circle key={i} cx={x} cy={y} r={(1.5 + acaso(`or${i}`) * 3) * u} fill="#F6D58A" opacity={0.15 + 0.35 * Math.sin(t + i) ** 2} />;
        })}
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'oficina-antiga',
  nome: 'Oficina antiga',
  fundo: COR.parede,
  tinta: COR.papel,
  acento: COR.latao,
  legenda: {
    fonte: SERIFA,
    peso: 700,
    tamanho: 64,
    cor: COR.papel,
    destaque: '#F3C65E',
    sombra: '0 3px 0 #0E0804, 0 0 18px #0E0804, 0 0 6px #0E0804',
    altura: 0.71,
  },
  Fundo,
};

// ---------- 2. as peças ----------
// Tudo aqui é SVG: use dentro de <Tela>. Tamanhos já em pixels da tela (multiplique por `u`).

/** Ponto na volta de um círculo; o ângulo em graus a partir do "pra cima", no sentido do relógio. */
export const pol = (cx: number, cy: number, r: number, a: number): [number, number] => [cx + r * Math.sin((a * Math.PI) / 180), cy - r * Math.cos((a * Math.PI) / 180)];

/** Engrenagem de latão que gira. `n` dentes, `giro` em graus (passe algo como t * 40). */
export const Engrenagem: React.FC<{x: number; y: number; r: number; n?: number; giro: number; s?: number}> = ({x, y, r, n = 16, giro, s = 1}) => {
  let d = '';
  for (let i = 0; i < n; i++) {
    const pts = [pol(0, 0, r * 0.87, (i / n) * 360), pol(0, 0, r, ((i + 0.22) / n) * 360), pol(0, 0, r, ((i + 0.5) / n) * 360), pol(0, 0, r * 0.87, ((i + 0.72) / n) * 360)];
    d += (i ? 'L' : 'M') + pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L');
  }
  return s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${giro})`} filter="url(#oficina-antiga-sombra)">
      <path d={d + 'Z'} fill="url(#oficina-antiga-latao)" stroke={COR.lataoEscuro} strokeWidth={r * 0.02} />
      <circle r={r * 0.68} fill="none" stroke={COR.lataoEscuro} strokeWidth={r * 0.04} opacity={0.7} />
      {[0, 72, 144, 216, 288].map((a) => {
        const [cx, cy] = pol(0, 0, r * 0.42, a);
        return <circle key={a} cx={cx} cy={cy} r={r * 0.14} fill={COR.parede} />;
      })}
      <circle r={r * 0.12} fill={COR.ferro} stroke="#F0CF7A" strokeWidth={r * 0.03} />
    </g>
  );
};

/** Fio pendurado do teto até (x, y), com o argolinha de latão: o que segura as coisas do teatro. */
export const Fio: React.FC<{x: number; y: number}> = ({x, y}) => {
  const {u} = useTela();
  return (
    <>
      <line x1={x} y1={0} x2={x} y2={y} stroke="#B9AA8A" strokeWidth={3 * u} opacity={0.8} />
      <circle cx={x} cy={y} r={7 * u} fill="none" stroke="url(#oficina-antiga-latao)" strokeWidth={4 * u} />
    </>
  );
};

/** Placa de latão gravada: o texto da casa. `p` de 0 a 1 faz ela cair e assentar. */
export const Placa: React.FC<{x: number; y: number; tam: number; p: number; linhas: string[]}> = ({x, y, tam, p, linhas}) => {
  if (p <= 0) return null;
  const larg = Math.max(...linhas.map((l) => l.length)) * tam * 0.52 + tam;
  const alt = linhas.length * tam * 1.15 + tam * 0.5;
  return (
    <g transform={`translate(${x} ${y - (1 - p) * tam * 2}) scale(${lerp(0.7, 1, p)})`} opacity={Math.min(1, p * 2)} filter="url(#oficina-antiga-sombra)">
      <rect x={-larg / 2} y={-alt / 2} width={larg} height={alt} rx={tam * 0.15} fill="url(#oficina-antiga-latao)" stroke={COR.lataoEscuro} strokeWidth={tam * 0.05} />
      <rect x={-larg / 2 + tam * 0.15} y={-alt / 2 + tam * 0.15} width={larg - tam * 0.3} height={alt - tam * 0.3} rx={tam * 0.08} fill="none" stroke={COR.lataoEscuro} strokeWidth={tam * 0.025} opacity={0.6} />
      {[-1, 1].map((k) => [-1, 1].map((j) => <circle key={`${k}${j}`} cx={k * (larg / 2 - tam * 0.3)} cy={j * (alt / 2 - tam * 0.3)} r={tam * 0.07} fill={COR.lataoEscuro} />))}
      {linhas.map((l, i) => (
        <text key={i} x={0} y={(i - (linhas.length - 1) / 2) * tam * 1.15} textAnchor="middle" dominantBaseline="central" fontFamily={ANTON} fontSize={tam} letterSpacing={tam * 0.05} fill="#3A240A" stroke="rgba(255,236,170,.5)" strokeWidth={tam * 0.012}>
          {l}
        </text>
      ))}
    </g>
  );
};

/** Etiqueta de papel amarrada, escrita à pena: texto de apoio curto. */
export const Etiqueta: React.FC<{x: number; y: number; tam: number; p: number; children: string}> = ({x, y, tam, p, children}) => {
  if (p <= 0) return null;
  const larg = children.length * tam * 0.5 + tam * 0.9;
  return (
    <g transform={`translate(${x} ${y}) rotate(${-4 + balanco(p * 3, 1) * 2}) scale(${elastico(Math.min(1, p))})`} filter="url(#oficina-antiga-sombra)">
      <path d={`M${-larg / 2} ${-tam * 0.7} H${larg / 2} V${tam * 0.7} H${-larg / 2 + tam * 0.4} L${-larg / 2} 0 Z`} fill={COR.papel} />
      <text x={tam * 0.15} y={0} textAnchor="middle" dominantBaseline="central" fontFamily={SERIFA} fontWeight={700} fontSize={tam} fill="#3A2412">{children}</text>
    </g>
  );
};

/**
 * O diafragma de latão: a transição do estilo. `p` 0 é aberto, 1 é fechado.
 * Feche no fim da cena e abra no começo da próxima (as cenas sem fusão).
 */
export const Diafragma: React.FC<{p: number}> = ({p}) => {
  const {L, A, cx, cy} = useTela();
  if (p <= 0) return null;
  const R = Math.hypot(L, A) * 0.55;
  const r = R * (1 - ramp(p, 0, 1, chega));
  const laminas = 9;
  return (
    <AbsoluteFill>
      <Tela>
        <path d={`M0 0H${L}V${A}H0Z M${cx + r} ${cy} a${r} ${r} 0 1 0 ${-2 * r} 0 a${r} ${r} 0 1 0 ${2 * r} 0Z`} fillRule="evenodd" fill="url(#oficina-antiga-latao)" />
        {Array.from({length: laminas}, (_, i) => {
          const a = (i / laminas) * 360 + p * 60;
          const [x0, y0] = pol(cx, cy, r, a);
          const [x1, y1] = pol(cx, cy, R * 1.3, a + 50);
          return <path key={i} d={`M${x0} ${y0} Q${(x0 + x1) / 2} ${(y0 + y1) / 2 - 40} ${x1} ${y1}`} stroke={COR.lataoEscuro} strokeWidth={6} fill="none" opacity={0.8} />;
        })}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#3A240A" strokeWidth={10} />
      </Tela>
    </AbsoluteFill>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Cada coisa é uma peça do teatro mecânico: latão, madeira e chapa pintada, com
// sombra na bancada. Recebem centro (x, y), tamanho e `p` (0 a 1). Use dentro de <Tela>.

type Desenho = {x: number; y: number; tam: number; p: number; t?: number};

/** O sol: disco de latão com raios recortados, preso numa haste, que acende e gira devagar. */
export const Sol: React.FC<Desenho & {acesa?: number}> = ({x, y, tam, p, t = 0, acesa = 1}) => (
  <g opacity={Math.min(1, p * 2)}>
    <Fio x={x} y={y - tam * 0.55} />
    <circle cx={x} cy={y} r={tam * 0.9} fill={COR.brasa} opacity={0.22 * acesa} />
    <Engrenagem x={x} y={y} r={tam * 0.5} n={14} giro={t * 12} s={p} />
    <circle cx={x} cy={y} r={tam * 0.3 * p} fill="#FFD77A" opacity={0.5 + 0.5 * acesa} />
    <circle cx={x} cy={y} r={tam * 0.18 * p} fill="#FFF2C4" opacity={acesa} />
  </g>
);

/** A nuvem: chapa de lata recortada e rebitada, pendurada por dois fios. */
export const Nuvem: React.FC<Desenho & {cor?: string}> = ({x, y, tam, p, t = 0, cor = '#C9C2B4'}) => {
  const balanca = balanco(t, 0.7) * 3;
  const w = tam;
  return (
    <g opacity={Math.min(1, p * 2)}>
      <Fio x={x - w * 0.3} y={y - w * 0.18 - (1 - p) * w} />
      <Fio x={x + w * 0.3} y={y - w * 0.12 - (1 - p) * w} />
      <g transform={`translate(${x} ${y - (1 - p) * w}) rotate(${balanca})`} filter="url(#oficina-antiga-sombra)">
        <path d={`M${-w * 0.48} ${w * 0.16} a${w * 0.14} ${w * 0.14} 0 0 1 ${w * 0.1} ${-w * 0.24} a${w * 0.2} ${w * 0.2} 0 0 1 ${w * 0.36} ${-w * 0.1} a${w * 0.16} ${w * 0.16} 0 0 1 ${w * 0.3} ${w * 0.06} a${w * 0.13} ${w * 0.13} 0 0 1 ${w * 0.08} ${w * 0.28} Z`} fill={cor} stroke="#6F675A" strokeWidth={w * 0.012} />
        {[-0.3, -0.1, 0.1, 0.3].map((k) => (
          <circle key={k} cx={k * w} cy={w * 0.1} r={w * 0.012} fill="#6F675A" />
        ))}
      </g>
    </g>
  );
};

/** Gotas de vidro azul caindo de `y` até `y + altura`; `forca` de 0 a 1 liga a chuva aos poucos. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; tam: number; t: number; forca?: number; gotas?: number}> = ({x, y, largura, altura, tam, t, forca = 1, gotas = 14}) => (
  <>
    {Array.from({length: gotas}, (_, i) => {
      if (i / gotas >= forca) return null;
      const fase = (t * (0.9 + acaso(`gv${i}`) * 0.5) + acaso(`gf${i}`)) % 1;
      const gx = x - largura / 2 + acaso(`gx${i}`) * largura;
      const gy = y + fase * altura;
      return (
        <g key={i} transform={`translate(${gx} ${gy})`}>
          <path d={`M0 ${-tam} Q${tam * 0.55} ${-tam * 0.1} 0 ${tam * 0.4} Q${-tam * 0.55} ${-tam * 0.1} 0 ${-tam}Z`} fill={COR.agua} stroke="#E8FBFF" strokeWidth={tam * 0.08} />
        </g>
      );
    })}
  </>
);

/** O mar mecânico: três cilindros de onda numa caixa de madeira, girando como no teatro antigo. */
export const Mar: React.FC<Desenho & {largura: number; giro?: number}> = ({x, y, tam, p, t = 0, largura, giro = 1}) => {
  const n = 9;
  const r = largura / n / 2;
  return (
    <g opacity={Math.min(1, p * 2)} transform={`translate(0 ${(1 - p) * tam * 0.5})`} filter="url(#oficina-antiga-sombra)">
      {[0, 1, 2].map((k) => {
        const dy = y - tam * 0.35 + k * tam * 0.18;
        const dx = (Math.sin(t * 2 * giro + k * 1.3) * r * 0.8);
        let topo = `M${x - largura / 2 - r * 2 + dx} ${dy}`;
        for (let i = -1; i <= n; i++) topo += ` q${r * 0.5} ${-r * 0.9} ${r} 0 t${r} 0`;
        return <path key={k} d={`${topo} V${y + tam * 0.3} H${x - largura / 2 - r * 2} Z`} fill={[COR.agua, '#4E98AE', COR.aguaFunda][k]} stroke="#E8FBFF" strokeWidth={tam * 0.012} />;
      })}
      <rect x={x - largura / 2 - tam * 0.06} y={y + tam * 0.05} width={largura + tam * 0.12} height={tam * 0.3} rx={tam * 0.03} fill="#6A3D1C" stroke="#2A170A" strokeWidth={tam * 0.015} />
      <rect x={x - largura / 2} y={y + tam * 0.1} width={largura} height={tam * 0.05} fill="url(#oficina-antiga-latao)" />
      <g transform={`translate(${x + largura / 2 + tam * 0.06} ${y + tam * 0.2}) rotate(${t * 90 * giro})`}>
        <rect x={0} y={-tam * 0.02} width={tam * 0.16} height={tam * 0.04} fill="url(#oficina-antiga-latao)" />
        <circle r={tam * 0.035} fill={COR.lataoEscuro} />
      </g>
    </g>
  );
};

/** Uma planta de latão num vaso, que abre as folhas uma a uma, como um brinquedo de corda. */
export const Planta: React.FC<Desenho> = ({x, y, tam, p, t = 0}) => {
  const alto = tam * ramp(p, 0, 0.55, chega);
  const venta = balanco(t, 0.8) * tam * 0.02;
  return (
    <g filter="url(#oficina-antiga-sombra)">
      <path d={`M${x} ${y} L${x + venta} ${y - alto}`} stroke="url(#oficina-antiga-latao)" strokeWidth={tam * 0.045} strokeLinecap="round" />
      {[
        [0.35, -1, 0.25],
        [0.6, 1, 0.42],
        [0.85, -1, 0.58],
        [1, 1, 0.72],
      ].map(([h, lado, ini], i) => {
        const s = ramp(p, ini, ini + 0.25, elastico);
        const bx = x + venta * h;
        const by = y - alto * h;
        return s > 0 ? (
          <g key={i} transform={`translate(${bx} ${by}) rotate(${lado * (60 - 20 * s)}) scale(${s})`}>
            <path d={`M0 0 Q${tam * 0.12} ${-tam * 0.08} 0 ${-tam * 0.26} Q${-tam * 0.12} ${-tam * 0.08} 0 0Z`} fill={COR.folha} stroke="url(#oficina-antiga-latao)" strokeWidth={tam * 0.012} />
            <line x1={0} y1={0} x2={0} y2={-tam * 0.22} stroke="url(#oficina-antiga-latao)" strokeWidth={tam * 0.008} />
          </g>
        ) : null;
      })}
      <path d={`M${x - tam * 0.17} ${y} H${x + tam * 0.17} L${x + tam * 0.13} ${y + tam * 0.22} H${x - tam * 0.13} Z`} fill="#8A4A26" stroke="#3A1E0C" strokeWidth={tam * 0.012} />
      <rect x={x - tam * 0.19} y={y - tam * 0.03} width={tam * 0.38} height={tam * 0.05} rx={tam * 0.02} fill="url(#oficina-antiga-latao)" />
    </g>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

/** A câmera da oficina: chega devagar perto da bancada e deriva de lado. */
const Chega: React.FC<{t: number; dur: number; children: React.ReactNode}> = ({t, dur, children}) => {
  const {cx, cy, u} = useTela();
  return (
    <Camera t={t} chaves={[{t: 0, x: cx - 20 * u, y: cy, zoom: 1}, {t: dur, x: cx + 20 * u, y: cy - 30 * u, zoom: 1.07}]}>
      {children}
    </Camera>
  );
};

const abreFecha = (t: number, dur: number, abre = true) => <Diafragma p={Math.max(abre ? 1 - ramp(t, 0, 0.35) : 0, ramp(t, dur - 0.35, dur))} />;

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Chega t={t} dur={dur}>
        <Tela>
          <Engrenagem x={L * 0.2} y={A * 0.12} r={120 * u} giro={t * 30} />
          <Engrenagem x={L * 0.36} y={A * 0.06} r={70 * u} n={10} giro={-t * 52 + 9} />
          <Engrenagem x={L * 0.84} y={A * 0.4} r={95 * u} n={13} giro={-t * 38} />
          <Placa x={L / 2} y={A * 0.26} tam={110 * u} p={ramp(t, 0, 0.5, elastico)} linhas={['O CICLO', 'DA ÁGUA']} />
          <Mar x={L / 2} y={A * 0.5} tam={200 * u} p={ramp(t, 0.3, 0.9)} t={t} largura={600 * u} />
        </Tela>
      </Chega>
      {abreFecha(t, dur, false)}
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const desce = ramp(t, 0.2, 1, chega);
  const acesa = ramp(t, 0.9, 1.5);
  return (
    <>
      <Chega t={t} dur={dur}>
        <Tela>
          <Sol x={L * 0.62} y={lerp(-A * 0.1, A * 0.17, desce)} tam={230 * u} p={1} t={t} acesa={acesa} />
          {/* o calor: ondinhas de ar quente descendo do sol pro mar */}
          {Array.from({length: 4}, (_, i) => {
            const f = (t * 0.8 + i / 4) % 1;
            const y = A * (0.27 + f * 0.13);
            return <path key={i} d={`M${L * 0.42} ${y} q${40 * u} ${-20 * u} ${80 * u} 0 t${80 * u} 0 t${80 * u} 0`} stroke={COR.brasa} strokeWidth={6 * u} fill="none" opacity={acesa * (1 - f) * 0.8} />;
          })}
          <Mar x={L / 2} y={A * 0.5} tam={220 * u} p={1} t={t} largura={680 * u} giro={1 + acesa * 1.5} />
          <Etiqueta x={L * 0.28} y={A * 0.2} tam={60 * u} p={ramp(t, 1.4, 1.8)}>calor</Etiqueta>
        </Tela>
      </Chega>
      {abreFecha(t, dur)}
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const junta = ramp(t, 1.2, 2.2);
  return (
    <>
      <Chega t={t} dur={dur}>
        <Tela>
          {Array.from({length: 14}, (_, i) => {
            const f = (t * 0.55 + acaso(`vf${i}`)) % 1;
            const x = L / 2 + (acaso(`vx${i}`) - 0.5) * 520 * u * (1 - f * 0.5) + Math.sin(t * 2 + i) * 18 * u;
            return <circle key={i} cx={x} cy={A * 0.42 - f * A * 0.24} r={(16 + 30 * f) * u} fill={COR.papel} opacity={(1 - f) * 0.55} />;
          })}
          <Nuvem x={L / 2} y={A * 0.17} tam={lerp(380, 520, junta) * u} p={ramp(t, 0.6, 1.6, chega)} t={t} />
          <Mar x={L / 2} y={A * 0.5} tam={220 * u} p={1} t={t} largura={680 * u} giro={1.6} />
        </Tela>
      </Chega>
      {abreFecha(t, dur)}
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const pesa = ramp(t, 0.2, 1.2, elastico);
  return (
    <>
      <Chega t={t} dur={dur}>
        <Tela>
          <Nuvem x={L / 2} y={A * (0.14 + pesa * 0.06)} tam={540 * u} p={1} t={t * 3} cor={lerp(0, 1, pesa) > 0.5 ? '#7E8790' : '#C9C2B4'} />
          <Chuva x={L / 2} y={A * 0.27} largura={460 * u} altura={A * 0.23} tam={30 * u} t={t} forca={ramp(t, 1, 1.8)} gotas={16} />
          <Etiqueta x={L * 0.78} y={A * 0.1} tam={60 * u} p={ramp(t, 0.4, 0.8)}>pesada</Etiqueta>
        </Tela>
      </Chega>
      {abreFecha(t, dur)}
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Chega t={t} dur={dur}>
        <Tela>
          <Nuvem x={L / 2} y={A * 0.1} tam={460 * u} p={1} t={t} cor="#7E8790" />
          <Chuva x={L / 2} y={A * 0.17} largura={400 * u} altura={A * 0.2} tam={26 * u} t={t} gotas={12} forca={1 - ramp(t, 2.4, 3)} />
          <Planta x={L / 2} y={A * 0.52} tam={380 * u} p={ramp(t, 0.4, 2.6)} t={t} />
          <Engrenagem x={L * 0.2} y={A * 0.55} r={70 * u} n={11} giro={t * 60} />
          <Engrenagem x={L * 0.29} y={A * 0.57} r={44 * u} n={8} giro={-t * 96 + 11} />
        </Tela>
      </Chega>
      {abreFecha(t, dur + 1)}
    </>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // o título já está gravado na placa: sem legenda nesse trecho
    semLegenda={[[0, FALA_EXEMPLO.frases[1].s]]}
    cenas={cenasPorFrase(FALA_EXEMPLO, [
      [0, 0, Titulo, 0],
      [1, 1, SolEMar, 0],
      [2, 2, VaporENuvem, 0],
      [3, 3, NuvemEChuva, 0],
      [4, 4, ChuvaEPlanta, 0],
    ])}
  />
);
