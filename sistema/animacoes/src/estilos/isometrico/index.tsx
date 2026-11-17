// ESTILO: Maquete isométrica
// Uma maquete de blocos flutuando no ar, vista em isométrico: cada coisa é
// feita de cubos com três faces de luz (topo claro, lados mais escuros), que
// caem do alto e assentam com um quique. A maquete inteira respira e balança
// num palco em perspectiva (3D edição, feito no próprio motor). A cena sai
// numa cortina de losangos que vira. Bom pra "como funciona", processo,
// cidade, sistema, natureza e qualquer coisa que se monta por partes.
//
// As quatro partes, como no molde:
//   1. `tema`      cores, fundo e legenda
//   2. as peças    iso, Maquete (os blocos), Letreiro, Losangos
//   3. os desenhos sol, nuvem, chuva, mar, planta (listas de blocos)
//   4. `Exemplo`   o ciclo da água contado neste estilo
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarNunito} from '@remotion/google-fonts/Nunito';
import type {PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Palco3D, Plano, Tela, acaso, balanco, cenasPorFrase, elastico, ramp, useTela} from '../../kit';

const {fontFamily: NUNITO} = carregarNunito('normal', {weights: ['800', '900'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As cores da maquete. Cada bloco usa uma delas e o estilo escurece os lados sozinho. */
export const COR = {
  ceuTopo: '#cfe9ff',
  ceuBase: '#fdf3e4',
  agua: '#3aa6d8',
  aguaFunda: '#2b84b8',
  grama: '#6fbf4a',
  terra: '#9a6b3f',
  tronco: '#7a4b28',
  folha: '#2f9a4f',
  folhaClara: '#46b862',
  nuvem: '#f4f7fb',
  sol: '#ffc83d',
  laranja: '#ff8a3d',
  tinta: '#24324a',
} as const;
export type CorIso = keyof typeof COR;

/** Céu claro em degradê suave, com a sombra da maquete no "chão" lá embaixo. */
const Fundo: React.FC<{t: number}> = ({t}) => {
  const {L, A} = useTela();
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${COR.ceuTopo} 0%, ${COR.ceuBase} 100%)`}}>
      <Tela>
        <defs>
          <radialGradient id="isometrico-sombra">
            <stop offset="0" stopColor={COR.tinta} stopOpacity={0.22} />
            <stop offset="1" stopColor={COR.tinta} stopOpacity={0} />
          </radialGradient>
        </defs>
        <ellipse cx={L / 2} cy={A * 0.53} rx={L * (0.4 + balanco(t, 0.5) * 0.01)} ry={A * 0.025} fill="url(#isometrico-sombra)" />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'isometrico',
  nome: 'Maquete isométrica',
  fundo: COR.ceuBase,
  tinta: COR.tinta,
  acento: COR.laranja,
  legenda: {
    fonte: NUNITO,
    peso: 900,
    tamanho: 64,
    cor: COR.tinta,
    destaque: '#e8641b',
    sombra: `0 0 8px ${COR.ceuBase}, 0 0 16px ${COR.ceuBase}, 0 2px 0 #ffffff`,
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** Um bloco da maquete, em unidades de grade (1 = um quadradinho do chão). */
export type Bloco = {
  x: number;
  y: number;
  z: number;
  w?: number;
  d?: number;
  h?: number;
  cor: CorIso;
  /** segundo da cena em que o bloco cai e assenta */
  em: number;
  /** segundo em que ele sobe e some (opcional) */
  some?: number;
};

/** Escurece ou clareia uma cor (os lados do cubo). */
const tom = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * k))));
  return `rgb(${c.join(',')})`;
};

/**
 * A projeção isométrica: leva um ponto (x, y, z) da grade pra tela.
 * `escala` é o tamanho de um quadradinho; (cx, cy) é onde fica o canto (0, 0, 0).
 */
export const iso = (x: number, y: number, z: number, escala: number, cx: number, cy: number): [number, number] => [
  cx + (x - y) * Math.cos(Math.PI / 6) * escala,
  cy + (x + y) * 0.5 * escala - z * escala,
];

/**
 * A maquete: desenha uma lista de blocos na ordem certa (de trás pra frente),
 * cada um caindo do alto com quique no seu `em`. Fica dentro de um palco em
 * perspectiva que respira e balança. `n` é o tamanho da grade (pra centralizar).
 */
export const Maquete: React.FC<{blocos: Bloco[]; t: number; n?: number; altura?: number; escala?: number; vira?: number}> = ({
  blocos,
  t,
  n = 8,
  altura = 0.36,
  escala = 68,
  vira = 1,
}) => {
  const {L, A, u} = useTela();
  const s = escala * u;
  const cx = L / 2;
  const cy = A * altura - (n * 0.5 * s) / 2 + balanco(t, 0.6) * 6 * u;
  const pts = (a: [number, number][]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const ordem = [...blocos].sort((a, b) => a.x + a.y + a.z * 0.5 - (b.x + b.y + b.z * 0.5));
  return (
    <Palco3D viraX={8 + balanco(t, 0.35) * 2 * vira} viraY={balanco(t, 0.25, 1) * 6 * vira}>
      <Plano>
        <Tela>
          {ordem.map((c, i) => {
            const p = ramp(t, c.em, c.em + 0.55, elastico);
            const q = c.some !== undefined ? 1 - ramp(t, c.some, c.some + 0.4) : 1;
            if (p <= 0 || q <= 0) return null;
            const {w = 1, d = 1, h = 1} = c;
            const x = c.x;
            const y = c.y;
            const z = c.z + (1 - p) * 4 + (1 - q) * 3;
            const P = (a: number, b: number, e: number) => iso(a, b, e, s, cx, cy);
            const topo = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)];
            const esq = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)];
            const dir = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)];
            const cor = COR[c.cor];
            return (
              <g key={i} opacity={Math.min(1, p * 1.6) * q}>
                <polygon points={pts(esq)} fill={tom(cor, 0.8)} />
                <polygon points={pts(dir)} fill={tom(cor, 0.62)} />
                <polygon points={pts(topo)} fill={cor} stroke={tom(cor, 1.12)} strokeWidth={1.2 * u} />
              </g>
            );
          })}
        </Tela>
      </Plano>
    </Palco3D>
  );
};

/** Letreiro: texto grande em Nunito 900, que cai do alto e quica, palavra por palavra. */
export const Letreiro: React.FC<{children: string; t: number; em?: number; y: number; tamanho?: number; cor?: CorIso}> = ({
  children,
  t,
  em = 0,
  y,
  tamanho = 120,
  cor = 'tinta',
}) => {
  const {u} = useTela();
  const palavras = children.split(' ');
  return (
    <div style={{position: 'absolute', left: 50 * u, right: 50 * u, top: y, textAlign: 'center', lineHeight: 1.05}}>
      {palavras.map((w, i) => {
        const p = ramp(t, em + i * 0.12, em + i * 0.12 + 0.5, elastico);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              margin: `0 ${14 * u}px`,
              fontFamily: NUNITO,
              fontWeight: 900,
              fontSize: tamanho * u,
              color: COR[cor],
              opacity: Math.min(1, p * 2),
              transform: `translateY(${(1 - p) * -120 * u}px)`,
              textShadow: `0 ${8 * u}px 0 ${tom(COR[cor], 0.6)}33`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Losangos: a transição do estilo. Uma grade de losangos isométricos vira e
 * cobre a tela em diagonal. Ponha no fim da cena, por cima de tudo.
 */
export const Losangos: React.FC<{p: number; cor?: CorIso}> = ({p, cor = 'agua'}) => {
  const {L, A, u} = useTela();
  if (p <= 0) return null;
  const s = 120 * u;
  const lw = s * Math.cos(Math.PI / 6) * 2;
  const lh = s;
  const cols = Math.ceil(L / lw) + 2;
  const lins = Math.ceil(A / (lh / 2)) + 2;
  const itens: React.ReactNode[] = [];
  for (let j = 0; j < lins; j++)
    for (let i = 0; i < cols; i++) {
      const x = i * lw + (j % 2 ? lw / 2 : 0) - lw / 2;
      const y = (j * lh) / 2 - lh / 2;
      const atraso = ((x / L) * 0.4 + (y / A) * 0.6) * 0.6;
      const q = ramp(p, atraso, atraso + 0.4);
      if (q <= 0) continue;
      itens.push(
        <polygon
          key={`${i}-${j}`}
          points={`${x},${y - (lh / 2) * q} ${x + (lw / 2) * q},${y} ${x},${y + (lh / 2) * q} ${x - (lw / 2) * q},${y}`}
          fill={j % 2 ? COR[cor] : tom(COR[cor], 0.85)}
        />
      );
    }
  return (
    <AbsoluteFill>
      <Tela>{itens}</Tela>
    </AbsoluteFill>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Aqui os desenhos são listas de blocos (e não componentes), porque a Maquete
// precisa de todos juntos pra pôr cada um na frente ou atrás do outro.
// Desenho novo segue o mesmo jeito: uma função que devolve Bloco[].

/** O mar: uma placa de água de n x n, com uma ondinha correndo pelos blocos. */
export const mar = (t: number, em = 0, n = 8): Bloco[] => {
  const b: Bloco[] = [];
  for (let x = 0; x < n; x++)
    for (let y = 0; y < n; y++)
      b.push({x, y, z: Math.sin(t * 2 + (x + y) * 0.8) * 0.06, h: 0.35, cor: (x + y) % 2 ? 'agua' : 'aguaFunda', em: em + (x + y) * 0.03});
  return b;
};

/** O sol: um cubo grande amarelo no alto, com quatro cubinhos girando em volta. */
export const sol = (t: number, x: number, y: number, z: number, em = 0): Bloco[] => [
  {x, y, z, w: 1.6, d: 1.6, h: 1.6, cor: 'sol', em},
  ...[0, 1, 2, 3].map((i) => {
    const a = t * 1.2 + (i * Math.PI) / 2;
    return {x: x + 0.65 + Math.cos(a) * 1.5, y: y + 0.65 + Math.sin(a) * 1.5, z: z + 0.6, w: 0.3, d: 0.3, h: 0.3, cor: 'laranja' as CorIso, em: em + 0.3 + i * 0.1};
  }),
];

/** A nuvem: um cacho de blocos brancos que deriva devagar. `tam` 1 é o normal. */
export const nuvem = (t: number, x: number, y: number, z: number, em = 0, tam = 1, cor: CorIso = 'nuvem'): Bloco[] => {
  const vai = Math.sin(t * 0.4) * 0.3;
  const partes: [number, number, number, number, number][] = [
    [0, 0, 1.6, 1.1, 0.6],
    [0.5, -0.4, 1, 0.9, 0.55],
    [1.1, 0.3, 1.4, 1, 0.5],
    [0.3, 0.6, 1.2, 0.8, 0.45],
  ];
  return partes.map(([ox, oy, w, d, h], j) => ({x: x + ox * tam + vai, y: y + oy * tam, z: z + (j === 1 ? 0.3 : 0) * tam, w: w * tam, d: d * tam, h: h * tam, cor, em: em + j * 0.12}));
};

/** A chuva: cubinhos azuis caindo de `z0` até a água, sem parar. `forca` liga aos poucos. */
export const chuva = (t: number, x: number, y: number, z0: number, forca = 1, n = 10): Bloco[] =>
  Array.from({length: n}, (_, i) => i)
    .filter((i) => i / n < forca)
    .map((i) => {
      const fase = (t * (0.9 + acaso(`iso-v${i}`) * 0.3) + acaso(`iso-f${i}`)) % 1;
      return {x: x + acaso(`iso-x${i}`) * 2.2, y: y + acaso(`iso-y${i}`) * 1.6, z: z0 * (1 - fase) + 0.4, w: 0.18, d: 0.18, h: 0.4, cor: 'agua' as CorIso, em: -1};
    });

/** Uma árvore de blocos: tronco e copa em três andares. `p` de 0 a 1 faz ela crescer. */
export const planta = (x: number, y: number, z: number, p: number, em = 0): Bloco[] => {
  const b: Bloco[] = [];
  if (p <= 0) return b;
  const tronco = Math.min(1, p / 0.4);
  b.push({x: x + 0.38, y: y + 0.38, z, w: 0.24, d: 0.24, h: 1 * tronco, cor: 'tronco', em});
  if (p > 0.35) b.push({x: x + 0.1, y: y + 0.1, z: z + 1, w: 0.8, d: 0.8, h: 0.7, cor: 'folha', em: em + 0.2});
  if (p > 0.6) b.push({x: x + 0.22, y: y + 0.22, z: z + 1.7, w: 0.56, d: 0.56, h: 0.5, cor: 'folhaClara', em: em + 0.4});
  if (p > 0.85) b.push({x: x + 0.36, y: y + 0.36, z: z + 2.2, w: 0.28, d: 0.28, h: 0.3, cor: 'folhaClara', em: em + 0.6});
  return b;
};

/** Um morrinho de terra: base marrom com grama por cima, n x m blocos. */
export const terreno = (x0: number, y0: number, nx: number, ny: number, em = 0): Bloco[] => {
  const b: Bloco[] = [];
  for (let x = 0; x < nx; x++)
    for (let y = 0; y < ny; y++) {
      b.push({x: x0 + x, y: y0 + y, z: 0.2, h: 0.6, cor: 'terra', em: em + (x + y) * 0.06});
      b.push({x: x0 + x, y: y0 + y, z: 0.8, h: 0.25, cor: 'grama', em: em + 0.15 + (x + y) * 0.06});
    }
  return b;
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {A} = useTela();
  return (
    <>
      <Maquete t={t} altura={0.4} blocos={[...mar(t, -0.3, 6), ...nuvem(t, 1.5, 1.5, 3.2, 0.6, 1.1)]} n={6} escala={72} />
      <Letreiro t={t} em={0.2} y={A * 0.07}>
        O ciclo da água
      </Letreiro>
      <Losangos p={ramp(t, dur - 0.5, dur)} cor="sol" />
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => (
  <>
    <Maquete
      t={t}
      blocos={[
        ...mar(t, 0),
        ...sol(t, 2.6, -2.6, 4.4, 0.3),
        // bolhas de calor que sobem da água
        ...[0, 1, 2].map((i) => {
          const fase = (t * 0.7 + i / 3) % 1;
          return {x: 2 + i * 2, y: 3 + (i % 2), z: 0.4 + fase * 2.2, w: 0.25, d: 0.25, h: 0.25, cor: 'laranja' as CorIso, em: 1.2, some: undefined};
        }),
      ]}
    />
    <Losangos p={ramp(t, dur - 0.5, dur)} cor="nuvem" />
  </>
);

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const vapor: Bloco[] = [0, 1, 2, 3, 4].map((i) => {
    const fase = (t * 0.45 + i / 5) % 1;
    return {x: 2.5 + (i % 3), y: 2.5 + (i % 2), z: 0.4 + fase * 4.4, w: 0.3 * (1 - fase * 0.5), d: 0.3, h: 0.3, cor: 'nuvem', em: 0.1};
  });
  const tam = 1 + ramp(t, 1, dur) * 0.4;
  return (
    <>
      <Maquete t={t} blocos={[...mar(t, -1), ...vapor, ...nuvem(t, 2.5, 2.5, 5, 0.6, tam)]} />
      <Losangos p={ramp(t, dur - 0.5, dur)} cor="aguaFunda" />
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const desce = ramp(t, 0.1, 0.9) * 0.8;
  return (
    <>
      <Maquete
        t={t}
        blocos={[...mar(t, -1), ...nuvem(t, 2, 2.3, 5.4 - desce, -1, 1.5, t > 0.6 ? 'ceuTopo' : 'nuvem'), ...chuva(t, 2.3, 2.6, 4.4 - desce, ramp(t, 0.5, 1.4), 14)]}
      />
      <Losangos p={ramp(t, dur - 0.5, dur)} cor="grama" />
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const p = ramp(t, 0.7, 2.6);
  return (
    <Maquete
      t={t}
      blocos={[
        ...mar(t, -1),
        ...terreno(1, 1, 5, 5, 0),
        ...nuvem(t, 2, 1.6, 6, -1, 1.3, 'ceuTopo'),
        ...chuva(t, 2.3, 1.9, 5, 1, 8),
        ...planta(3, 3, 1.05, p, 0.7),
        ...planta(1.4, 4.4, 1.05, ramp(t, 1.4, 2.8), 1.4),
        ...planta(4.6, 1.5, 1.05, ramp(t, 1.8, 3.2), 1.8),
      ]}
    />
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, que já está no letreiro: sem legenda nesse trecho
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
