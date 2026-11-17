// ESTILO: Origami
// Uma mesa de papel creme onde cada coisa é montada com triângulos de papel
// que se dobram sobre uma aresta: primeiro aparece o verso branco, depois a
// frente colorida assenta, com sombra. Bom pra explicação leve, infantil e
// curiosidade com cara de feito à mão.
//
// As quatro partes, como no molde:
//   1. `tema`      cores, fundo e legenda
//   2. as peças    Dobras (triângulos que dobram), Etiqueta (texto em tira de papel), Folha (transição)
//   3. os desenhos Sol, Nuvem, Chuva, Mar, Planta
//   4. `Exemplo`   o ciclo da água
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarFraunces} from '@remotion/google-fonts/Fraunces';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, cenasPorFrase, chega, emFila, ramp, suave, useTela} from '../../kit';

const {fontFamily: FRAUNCES} = carregarFraunces('normal', {weights: ['400', '600', '800'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As cores do papel. Cada cor tem a face clara e a face na sombra (o outro lado do vinco). */
export const COR = {
  amarelo: ['#f5c542', '#d99a1e'],
  laranja: ['#f08a24', '#d0621a'],
  azul: ['#3c93c9', '#22689c'],
  celeste: ['#8cc7e6', '#5ea6cf'],
  verde: ['#4fae5f', '#2f7d40'],
  branco: ['#ffffff', '#dfe5ea'],
  terra: ['#b8865a', '#8a5f3a'],
  vermelho: ['#e2574c', '#b23a33'],
} as const;
export type CorPapel = keyof typeof COR;

const PAPEL = '#f2e8d6';
const TINTA = '#2b2118';

/** A mesa: papel creme com fibra e os vincos de uma folha que já foi dobrada. */
const Fundo: React.FC<{t: number}> = () => {
  const {L, A, u} = useTela();
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${PAPEL} 0%, #e3d5bc 100%)`}}>
      <Tela>
        <defs>
          <filter id="origami-fibra" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={3} seed={8} />
            <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 -1.2 0.7" />
          </filter>
          <filter id="origami-sombra" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx={6 * u} dy={12 * u} stdDeviation={9 * u} floodColor="#3a2a14" floodOpacity="0.32" />
          </filter>
        </defs>
        <rect width={L} height={A} filter="url(#origami-fibra)" opacity={0.35} />
        <g stroke="rgba(90,70,40,0.10)" strokeWidth={2 * u}>
          <line x1={0} y1={0} x2={L} y2={A} />
          <line x1={L} y1={0} x2={0} y2={A} />
          <line x1={L / 2} y1={0} x2={L / 2} y2={A} />
          <line x1={0} y1={A / 2} x2={L} y2={A / 2} />
        </g>
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'origami',
  nome: 'Origami',
  fundo: PAPEL,
  tinta: TINTA,
  acento: '#c2561c',
  legenda: {
    fonte: FRAUNCES,
    peso: 800,
    tamanho: 66,
    cor: TINTA,
    destaque: '#c2561c',
    sombra: `0 0 10px ${PAPEL}, 0 0 4px ${PAPEL}, 0 2px 0 rgba(255,255,255,0.8)`,
    altura: 0.8,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** Um triângulo de papel: `a` e `b` são a aresta do vinco, `c` é a ponta que dobra. */
export type Tri = {a: Ponto; b: Ponto; c: Ponto; cor: CorPapel; sombra?: boolean};

/** Atalho pra montar triângulo. `sombra` usa a face escura da cor (o lado do vinco que não pega luz). */
export const tri = (a: Ponto, b: Ponto, c: Ponto, cor: CorPapel, sombra = false): Tri => ({a, b, c, cor, sombra});

/** Move e escala uma lista de triângulos desenhada em torno de (0,0). `vira` = -1 espelha. */
export const mover = (ts: Tri[], x: number, y: number, s = 1, vira = 1): Tri[] => {
  const m = (q: Ponto): Ponto => [q[0] * s * vira + x, q[1] * s + y];
  return ts.map((k) => ({...k, a: m(k.a), b: m(k.b), c: m(k.c)}));
};

/** Um leque de triângulos em volta de um centro: dá sol, flor, estrela, roda. */
export const leque = (cx: number, cy: number, raios: number[], cor: CorPapel, giro = 0): Tri[] =>
  raios.map((r1, i) => {
    const n = raios.length;
    const a1 = giro + (i / n) * Math.PI * 2;
    const a2 = giro + ((i + 1) / n) * Math.PI * 2;
    const r2 = raios[(i + 1) % n];
    return tri([cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1], [cx + Math.cos(a2) * r2, cy + Math.sin(a2) * r2], [cx, cy], cor, i % 2 === 1);
  });

/** Um triângulo dobrando: p 0 = deitado sobre o vinco, 0.5 = em pé (verso branco), 1 = assentado. */
const Dobra: React.FC<{k: Tri; p: number}> = ({k, p}) => {
  const {u} = useTela();
  if (p <= 0.001) return null;
  const {a, b, c} = k;
  const ab: Ponto = [b[0] - a[0], b[1] - a[1]];
  const l2 = ab[0] * ab[0] + ab[1] * ab[1] || 1;
  const s = ((c[0] - a[0]) * ab[0] + (c[1] - a[1]) * ab[1]) / l2;
  const pe: Ponto = [a[0] + ab[0] * s, a[1] + ab[1] * s];
  const cs = Math.cos(Math.PI * (1 - p));
  const C: Ponto = [pe[0] + (c[0] - pe[0]) * cs, pe[1] + (c[1] - pe[1]) * cs];
  const frente = cs >= 0;
  const cor = frente ? COR[k.cor][k.sombra ? 1 : 0] : '#fbf8f1';
  return (
    <polygon
      points={`${a[0]},${a[1]} ${b[0]},${b[1]} ${C[0]},${C[1]}`}
      fill={cor}
      stroke="rgba(0,0,0,0.12)"
      strokeWidth={1.4 * u}
      strokeLinejoin="round"
      style={{filter: `brightness(${0.72 + 0.28 * Math.abs(cs)})`}}
    />
  );
};

/**
 * A peça principal: uma lista de triângulos que se dobram um depois do outro.
 * `p` de 0 a 1 monta tudo; `desfaz` de 0 a 1 desmonta na ordem contrária. `t` + `balanca` fazem a peça flutuar.
 */
export const Dobras: React.FC<{tris: Tri[]; p: number; desfaz?: number; t?: number; balanca?: number}> = ({tris, p, desfaz = 0, t = 0, balanca = 0}) => {
  const {u} = useTela();
  const n = tris.length;
  return (
    <g filter="url(#origami-sombra)" transform={`translate(0 ${balanco(t, 0.5, n) * balanca * 8 * u})`}>
      {tris.map((k, i) => (
        <Dobra key={i} k={k} p={emFila(p, 0, 1, i, n, 0.7) * (1 - emFila(desfaz, 0, 1, n - 1 - i, n, 0.7))} />
      ))}
    </g>
  );
};

/** Texto numa tira de papel que se desdobra de cima pra baixo. Use dentro de <Tela>. */
export const Etiqueta: React.FC<{x: number; y: number; children: string; p: number; tamanho?: number; cor?: CorPapel}> = ({
  x,
  y,
  children,
  p,
  tamanho = 110,
  cor = 'branco',
}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const tam = tamanho * u;
  const w = children.length * tam * 0.56 + tam;
  const h = tam * 1.5;
  const abre = ramp(p, 0, 1, chega);
  return (
    <g filter="url(#origami-sombra)" transform={`translate(${x} ${y - h / 2}) scale(1 ${abre})`}>
      <polygon points={`${-w / 2},0 ${w / 2},0 ${w / 2 - tam * 0.25},${h} ${-w / 2 + tam * 0.25},${h}`} fill={COR[cor][0]} />
      <polygon points={`${-w / 2},0 ${w / 2},0 ${w / 2},${h * 0.12} ${-w / 2},${h * 0.12}`} fill="rgba(0,0,0,0.06)" />
      <text x={0} y={h * 0.7} textAnchor="middle" fontFamily={FRAUNCES} fontWeight={800} fontSize={tam} fill={cor === 'branco' ? TINTA : '#fffaf0'} opacity={ramp(p, 0.5, 1)}>
        {children}
      </text>
    </g>
  );
};

/**
 * A transição: uma folha creme grande entra dobrando pela diagonal e cobre a mesa.
 * Ponha no fim da cena, por cima de tudo. `p` de 0 a 1.
 */
export const Folha: React.FC<{p: number}> = ({p}) => {
  const {L, A, u} = useTela();
  if (p <= 0) return null;
  const q = ramp(p, 0, 1, suave);
  // a folha cresce do canto de baixo à direita; a linha do vinco anda até cobrir tudo
  const d = (L + A) * 2 * q;
  return (
    <AbsoluteFill>
      <Tela>
        <polygon points={`${L + 20},${A + 20} ${L + 20 - d},${A + 20} ${L + 20},${A + 20 - d}`} fill={PAPEL} filter="url(#origami-sombra)" />
        <line x1={L + 20 - d} y1={A + 20} x2={L + 20} y2={A + 20 - d} stroke="rgba(90,70,40,0.25)" strokeWidth={3 * u} />
      </Tela>
    </AbsoluteFill>
  );
};

// ---------- 3. os desenhos prontos ----------
// Todo desenho devolve uma lista de triângulos (Tri[]) e é montado com <Dobras>.
// Desenho novo: quebre o objeto em triângulos grandes, alterne face clara e escura.

/** Sol: um leque de pontas. */
export const sol = (x: number, y: number, r: number): Tri[] => [
  ...leque(x, y, Array.from({length: 12}, (_, i) => (i % 2 ? r * 0.7 : r)), 'laranja', 0.13),
  ...leque(x, y, Array.from({length: 8}, () => r * 0.55), 'amarelo'),
];

/** Nuvem: três triângulos que se apoiam. */
export const nuvem = (x: number, y: number, s: number, cor: CorPapel = 'branco'): Tri[] =>
  mover(
    [
      tri([-150, 50], [0, 50], [-60, -50], cor),
      tri([-60, -50], [70, -90], [0, 50], cor, true),
      tri([0, 50], [160, 50], [70, -90], cor),
      tri([-150, 50], [-60, -50], [-190, 10], cor, true),
    ],
    x,
    y,
    s
  );

/** Uma gota de papel: dois triângulos de bico pra cima. */
export const gota = (x: number, y: number, s: number): Tri[] =>
  mover([tri([0, 30], [-18, 0], [0, -34], 'azul'), tri([0, 30], [18, 0], [0, -34], 'azul', true)], x, y, s);

/** Mar: fileiras de triângulos azuis, cada fileira um tom. */
export const mar = (x0: number, x1: number, y: number, fileiras: number, s: number): Tri[] => {
  const out: Tri[] = [];
  const cores: CorPapel[] = ['celeste', 'azul', 'azul'];
  const w = 120 * s;
  const h = 80 * s;
  for (let f = 0; f < fileiras; f++)
    for (let x = x0 - w + (f % 2) * w * 0.5; x < x1; x += w) {
      const yy = y + f * h;
      out.push(tri([x, yy + h], [x + w, yy + h], [x + w / 2, yy], cores[f % 3]));
      out.push(tri([x + w / 2, yy], [x + w * 1.5, yy], [x + w, yy + h], cores[f % 3], true));
    }
  return out;
};

/** Planta: caule de dois triângulos finos e folhas em pares. */
export const planta = (x: number, y: number, s: number): Tri[] =>
  mover(
    [
      tri([-10, 0], [10, 0], [0, -260], 'verde', true),
      tri([0, -90], [0, -130], [-120, -150], 'verde'),
      tri([0, -90], [-120, -150], [-60, -70], 'verde', true),
      tri([0, -160], [0, -200], [120, -230], 'verde'),
      tri([0, -160], [120, -230], [70, -140], 'verde', true),
      tri([0, -250], [-12, -270], [-60, -330], 'verde'),
      tri([0, -250], [-60, -330], [10, -320], 'verde', true),
    ],
    x,
    y,
    s
  );

/** Chuva: gotas de papel que caem sem parar, entre `y` e `y + altura`. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; pingos?: number}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  pingos = 12,
}) => {
  const {u} = useTela();
  return (
    <g filter="url(#origami-sombra)">
      {Array.from({length: pingos}, (_, i) => {
        if (i / pingos >= forca) return null;
        const fase = (t * (0.7 + acaso(`ov${i}`) * 0.4) + acaso(`of${i}`)) % 1;
        const px = x - largura / 2 + acaso(`ox${i}`) * largura;
        return <Dobras key={i} tris={gota(px, y + fase * altura, 1.1 * u)} p={1} />;
      })}
    </g>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Dobras tris={sol(L * 0.5, A * 0.28, 150 * u)} p={ramp(t, 0, 1.2)} t={t} balanca={1} />
        <Etiqueta x={L / 2} y={A * 0.47} p={ramp(t, 0.3, 0.9)} cor="branco">
          O ciclo
        </Etiqueta>
        <Etiqueta x={L / 2} y={A * 0.47 + 180 * u} p={ramp(t, 0.6, 1.2)} cor="azul">
          da água
        </Etiqueta>
      </Tela>
      <Folha p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const esquenta = ramp(t, 1, 2.4);
  return (
    <>
      <Tela>
        <Dobras tris={sol(L * 0.62, A * 0.24, 170 * u)} p={ramp(t, 0, 1)} t={t} balanca={1} />
        <Dobras tris={mar(0, L, A * 0.46, 3, u)} p={ramp(t, 0.3, 1.4)} />
        {/* o mar aquece: triângulos laranja assentam sobre a primeira fileira */}
        <g opacity={esquenta * 0.55}>
          <Dobras tris={mar(0, L, A * 0.46, 1, u).map((k) => ({...k, cor: 'laranja' as CorPapel}))} p={esquenta} />
        </g>
      </Tela>
      <Folha p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Dobras tris={mar(0, L, A * 0.56, 2, u)} p={ramp(t, 0, 0.6)} />
        {/* o vapor: triângulos brancos pequenos subindo */}
        {[0, 1, 2, 3, 4].map((i) => {
          const fase = (t * 0.45 + i * 0.2) % 1;
          const x = L * (0.3 + i * 0.1);
          return (
            <g key={i} opacity={1 - fase}>
              <Dobras tris={mover([tri([-22, 18], [22, 18], [0, -24], 'branco')], x, A * 0.53 - fase * A * 0.2, u)} p={1} />
            </g>
          );
        })}
        <Dobras tris={nuvem(L * 0.5, A * 0.24, (1.3 + ramp(t, 1, dur) * 0.4) * u)} p={ramp(t, 0.6, 1.8)} t={t} balanca={1} />
      </Tela>
      <Folha p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const pesa = ramp(t, 0.4, 1.4);
  return (
    <>
      <Tela>
        <Dobras tris={nuvem(L * 0.5, A * 0.2 + pesa * 40 * u, 2 * u, pesa > 0.5 ? 'celeste' : 'branco')} p={1} t={t} balanca={1} />
        <Chuva x={L * 0.5} y={A * 0.27} largura={480 * u} altura={A * 0.34} t={t} forca={ramp(t, 0.8, 2)} />
      </Tela>
      <Folha p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const chao: Tri[] = [tri([0, A * 0.62], [L, A * 0.62], [L * 0.5, A * 0.58], 'terra'), tri([0, A * 0.62], [L, A * 0.62], [L * 0.2, A * 0.66], 'terra', true)];
  return (
    <Tela>
      <Dobras tris={nuvem(L * 0.5, A * 0.18, 1.7 * u, 'celeste')} p={1} t={t} balanca={1} />
      <Chuva x={L * 0.5} y={A * 0.24} largura={400 * u} altura={A * 0.3} t={t} pingos={9} />
      <Dobras tris={chao} p={ramp(t, 0, 0.6)} />
      <Dobras tris={planta(L * 0.5, A * 0.6, 1.1 * u)} p={ramp(t, 0.4, 2.4)} />
    </Tela>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, que já está nas etiquetas: sem legenda nesse trecho
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
