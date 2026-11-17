// ESTILO: Madeira 3D
// Brinquedos de madeira torneada e pintada, em cima de um disco de madeira que
// gira devagar num estúdio claro: bolas, peões, cilindros e blocos de letra,
// tinta fosca com o veio da madeira aparecendo por baixo, cantos arredondados e
// sombra macia. "3D edição": o volume é calculado aqui, sem Blender.
//
//   1. `tema`      cores, fundo e legenda
//   2. as peças    o mundo 3D (bolaM, pino, cubo, cone), o Giradisco e a Tabua
//   3. os desenhos Sol, Nuvem, Chuva, Mar, Planta
//   4. `Exemplo`   o ciclo da água
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarBree} from '@remotion/google-fonts/BreeSerif';
import type {PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, cenasPorFrase, chega, elastico, ramp, useTela} from '../../kit';

const {fontFamily: LETRA} = carregarBree('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** Tinta de brinquedo de madeira: cores fechadas, um pouco apagadas, foscas. `pinho` é a madeira crua. */
export const COR = {
  pinho: '#e2b57f',
  nogueira: '#9a6038',
  vermelho: '#d4483b',
  amarelo: '#f2b632',
  azul: '#3c7fc4',
  celeste: '#8cc4e8',
  verde: '#4f9a4a',
  creme: '#f4ead6',
  cinza: '#8f96a3',
  laranja: '#e57c35',
} as const;
export type CorMadeira = keyof typeof COR;

const tom = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(k >= 1 ? v + (255 - v) * (k - 1) : v * k));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

/** O estúdio: parede creme que vira chão sem quina, com luz suave do alto. */
const Fundo: React.FC<{t: number}> = () => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(ellipse 80% 45% at 50% 30%, #fff8ea 0%, rgba(255,248,234,0) 70%), linear-gradient(180deg, #e9dcc4 0%, #f1e6d1 48%, #dcc7a4 100%)',
    }}
  />
);

export const tema: Tema = {
  id: 'madeira-3d',
  nome: 'Madeira 3D',
  fundo: '#efe3cc',
  tinta: '#4a2f1c',
  acento: COR.vermelho,
  legenda: {
    fonte: LETRA,
    peso: 400,
    tamanho: 72,
    cor: '#4a2f1c',
    destaque: COR.vermelho,
    sombra: '0 3px 0 #fff6e4, 0 0 4px #fff6e4, 0 0 4px #fff6e4, 0 0 14px rgba(255,246,228,0.9)',
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------
// Mundo 3D de verdade: posição [x, y, z] com y pra cima e o chão do disco em 0.
// A câmera gira em volta sem parar (`giro`), a luz vem do alto à esquerda.

export type V3 = [number, number, number];
export type Cam = {giro: number; inclina: number; cx: number; cy: number; s: number; dist: number};
export type Item = {d: number; el: React.ReactNode; sombra?: React.ReactNode};

const proj = (c: Cam, [x, y, z]: V3) => {
  const xr = x * Math.cos(c.giro) - z * Math.sin(c.giro);
  const zr = x * Math.sin(c.giro) + z * Math.cos(c.giro);
  const d = zr * Math.cos(c.inclina) + y * Math.sin(c.inclina);
  const f = c.dist / (c.dist - d);
  return {x: c.cx + xr * c.s * f, y: c.cy - (y * Math.cos(c.inclina) - zr * Math.sin(c.inclina)) * c.s * f, d, f};
};

const sombraEm = (c: Cam, [x, y, z]: V3, r: number) => {
  const p = proj(c, [x + r * 0.3, 0, z + r * 0.15]);
  const rx = r * c.s * p.f * (1 + y / 500);
  return <ellipse cx={p.x} cy={p.y} rx={rx} ry={rx * Math.sin(c.inclina)} fill="#5a3a1e" opacity={0.32 / (1 + y / 250)} />;
};

/** Uma bola de madeira pintada (fosca, sem brilho de plástico). */
export const bolaM = (c: Cam, centro: V3, r: number, cor: CorMadeira, escala = 1, sombra = true): Item => {
  const p = proj(c, centro);
  const R = r * c.s * p.f * escala;
  return {
    d: p.d,
    sombra: sombra && escala > 0.05 ? sombraEm(c, centro, r * escala) : undefined,
    el: R < 0.5 ? null : <circle cx={p.x} cy={p.y} r={R} fill={`url(#madeira-3d-bola-${cor})`} />,
  };
};

/** Um pino torneado em pé (cilindro), com a borda de cima arredondada. */
export const pino = (c: Cam, base: V3, r: number, h: number, cor: CorMadeira, sombra = true): Item => {
  const pb = proj(c, base);
  const pt = proj(c, [base[0], base[1] + h, base[2]]);
  const si = Math.sin(c.inclina);
  const rb = r * c.s * pb.f;
  const rt = r * c.s * pt.f;
  return {
    d: proj(c, [base[0], base[1] + h / 2, base[2]]).d,
    sombra: sombra && h > 0 ? sombraEm(c, base, r) : undefined,
    el:
      h <= 0 ? null : (
        <g>
          <path
            d={`M${pb.x - rb},${pb.y} L${pt.x - rt},${pt.y} L${pt.x + rt},${pt.y} L${pb.x + rb},${pb.y} A${rb} ${rb * si} 0 0 1 ${pb.x - rb} ${pb.y} Z`}
            fill={`url(#madeira-3d-pino-${cor})`}
            stroke={`url(#madeira-3d-pino-${cor})`}
            strokeWidth={4 * c.s}
            strokeLinejoin="round"
          />
          <ellipse cx={pt.x} cy={pt.y} rx={rt * 0.98} ry={rt * si} fill={tom(COR[cor], 1.1)} stroke={tom(COR[cor], 1.3)} strokeWidth={3 * c.s} />
        </g>
      ),
  };
};

/** Um cone torneado (copa de pinheiro, pingo). */
export const cone = (c: Cam, base: V3, r: number, h: number, cor: CorMadeira): Item => {
  const pb = proj(c, base);
  const pa = proj(c, [base[0], base[1] + h, base[2]]);
  const rb = r * c.s * pb.f;
  const si = Math.sin(c.inclina);
  return {
    d: proj(c, [base[0], base[1] + h * 0.3, base[2]]).d,
    el: <path d={`M${pb.x - rb},${pb.y} L${pa.x},${pa.y} L${pb.x + rb},${pb.y} A${rb} ${rb * si} 0 0 1 ${pb.x - rb} ${pb.y} Z`} fill={`url(#madeira-3d-pino-${cor})`} strokeLinejoin="round" stroke={`url(#madeira-3d-pino-${cor})`} strokeWidth={6 * c.s} />,
  };
};

/** Um cubo de madeira de canto arredondado; com `letra`, vira bloco de alfabeto. */
export const cubo = (c: Cam, centro: V3, lado: number, cor: CorMadeira, letra?: string, escala = 1): Item => {
  const [x, y, z] = centro;
  const m = (lado * escala) / 2;
  const pt = (a: number, b: number, e: number) => proj(c, [x + a * m, y + b * m, z + e * m]);
  const sg = Math.sin(c.giro);
  const cg = Math.cos(c.giro);
  const faces: {vis: number; luz: number; q: [number, number, number][]; frente?: boolean}[] = [
    {vis: sg, luz: cg, q: [[1, -1, -1], [1, -1, 1], [1, 1, 1], [1, 1, -1]]},
    {vis: -sg, luz: -cg, q: [[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]]},
    {vis: cg, luz: -sg, q: [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]], frente: true},
    {vis: -cg, luz: sg, q: [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1]]},
  ];
  const pts = (q: [number, number, number][]) => q.map(([a, b, e]) => pt(a, b, e));
  const poli = (q: [number, number, number][]) => pts(q).map((v) => `${v.x},${v.y}`).join(' ');
  const raio = lado * escala * 0.16 * c.s;
  return {
    d: proj(c, centro).d,
    sombra: escala > 0.05 ? sombraEm(c, [x, y - m, z], m * 1.2) : undefined,
    el:
      escala <= 0.02 ? null : (
        <g strokeLinejoin="round" strokeWidth={raio}>
          {faces
            .filter((f) => f.vis > 0.001)
            .map((f, i) => {
              const k = 0.66 + 0.18 * f.luz;
              const q = pts(f.q);
              const meio = {x: (q[0].x + q[2].x) / 2, y: (q[0].y + q[2].y) / 2};
              // a letra vai pintada na face da frente, achatada conforme a face vira
              const larg = Math.hypot(q[1].x - q[0].x, q[1].y - q[0].y) / (2 * m * c.s * proj(c, centro).f);
              return (
                <g key={i}>
                  <polygon points={poli(f.q)} fill={tom(COR[cor], k)} stroke={tom(COR[cor], k)} />
                  {letra && f.frente && (
                    <text
                      x={0}
                      y={0}
                      transform={`translate(${meio.x} ${meio.y + lado * escala * 0.3 * c.s}) scale(${Math.max(0.05, larg)} 1)`}
                      textAnchor="middle"
                      fontFamily={LETRA}
                      fontSize={lado * escala * 0.85 * c.s}
                      fill={COR.creme}
                    >
                      {letra}
                    </text>
                  )}
                </g>
              );
            })}
          <polygon points={poli([[-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1]])} fill={tom(COR[cor], 1.08)} stroke={tom(COR[cor], 1.08)} />
        </g>
      ),
  };
};

const Luzes: React.FC<{u: number}> = ({u}) => (
  <defs>
    {(Object.keys(COR) as CorMadeira[]).map((k) => (
      <React.Fragment key={k}>
        <radialGradient id={`madeira-3d-bola-${k}`} cx="0.38" cy="0.34" r="0.75">
          <stop offset="0" stopColor={tom(COR[k], 1.18)} />
          <stop offset="0.55" stopColor={COR[k]} />
          <stop offset="1" stopColor={tom(COR[k], 0.58)} />
        </radialGradient>
        <linearGradient id={`madeira-3d-pino-${k}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={tom(COR[k], 0.68)} />
          <stop offset="0.35" stopColor={tom(COR[k], 1.12)} />
          <stop offset="1" stopColor={tom(COR[k], 0.55)} />
        </linearGradient>
      </React.Fragment>
    ))}
    {/* o veio da madeira: listras finas e onduladas por cima da tinta, só onde tem peça */}
    <filter id="madeira-3d-veio" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency={`${0.004 / u} ${0.06 / u}`} numOctaves={3} seed={4} result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.16  0 0 0 0 0.05  -3 0 0 0 1.75" result="veio" />
      <feComposite in="veio" in2="SourceAlpha" operator="in" result="dentro" />
      <feMerge>
        <feMergeNode in="SourceGraphic" />
        <feMergeNode in="dentro" />
      </feMerge>
    </filter>
    {/* na tinta o veio aparece fraquinho, por baixo da pintura */}
    <filter id="madeira-3d-veio-tinta" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency={`${0.004 / u} ${0.06 / u}`} numOctaves={3} seed={4} result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.16  0 0 0 0 0.05  -1.4 0 0 0 0.78" result="veio" />
      <feComposite in="veio" in2="SourceAlpha" operator="in" result="dentro" />
      <feMerge>
        <feMergeNode in="SourceGraphic" />
        <feMergeNode in="dentro" />
      </feMerge>
    </filter>
    <filter id="madeira-3d-sombra">
      <feGaussianBlur stdDeviation={14 * u} />
    </filter>
  </defs>
);

/** A câmera que gira sem parar em volta do disco, olhando um pouco de cima. */
export const useCam = (t: number, giro = 0, cyFrac = 0.4, vel = 0.22): Cam => {
  const {L, A, u} = useTela();
  return {giro: giro + t * vel, inclina: 0.42, cx: L / 2, cy: A * cyFrac, s: u * 1.38, dist: 1700};
};

/**
 * O giradisco: um disco de madeira crua onde os brinquedos ficam. Ordena as
 * peças do fundo pra frente, põe sombra macia e o veio em tudo. `t`/`dur`
 * fazem a peça entrar crescendo e a Tabua passar na saída.
 */
export const Giradisco: React.FC<{c: Cam; itens: Item[]; t: number; dur: number; children?: React.ReactNode; semSaida?: boolean}> = ({c, itens, t, dur, children, semSaida}) => {
  const {u} = useTela();
  const disco = pino(c, [0, -34, 0], 350, 34, 'pinho', false);
  const ordem = [...itens].sort((a, b) => a.d - b.d);
  const entra = ramp(t, 0, 0.5, chega);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${0.9 + entra * 0.1})`, opacity: Math.min(1, entra * 2)}}>
        <Tela>
          <Luzes u={u} />
          {sombraEm(c, [0, 0, 0], 400)}
          <g filter="url(#madeira-3d-veio)">{disco.el}</g>
          <g filter="url(#madeira-3d-sombra)">{ordem.map((it, i) => <React.Fragment key={i}>{it.sombra}</React.Fragment>)}</g>
          <g filter="url(#madeira-3d-veio-tinta)">
            {ordem.map((it, i) => (
              <React.Fragment key={i}>{it.el}</React.Fragment>
            ))}
          </g>
          {children}
        </Tela>
      </AbsoluteFill>
      {!semSaida && <Tabua p={ramp(t, dur - 0.35, dur)} />}
    </AbsoluteFill>
  );
};

/** A transição: uma tábua de madeira larga desce pela tela e leva a cena junto. */
export const Tabua: React.FC<{p: number}> = ({p}) => {
  const {L, A, u} = useTela();
  if (p <= 0) return null;
  const h = A * 0.55;
  const y = -h + p * (A + h);
  return (
    <AbsoluteFill>
      <Tela>
        <defs>
          <linearGradient id="madeira-3d-tabua" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={tom(COR.pinho, 1.15)} />
            <stop offset="0.12" stopColor={COR.pinho} />
            <stop offset="0.9" stopColor={tom(COR.pinho, 0.85)} />
            <stop offset="1" stopColor={tom(COR.pinho, 0.6)} />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={L} height={Math.max(0, y)} fill={tema.fundo} />
        <g filter="url(#madeira-3d-veio)">
          <rect x={-20 * u} y={y} width={L + 40 * u} height={h} rx={40 * u} fill="url(#madeira-3d-tabua)" />
        </g>
        <rect x={0} y={y + h} width={L} height={30 * u} fill="#5a3a1e" opacity={0.18} />
      </Tela>
    </AbsoluteFill>
  );
};

/** Título pintado em madeira, com a espessura da peça embaixo. */
export const Placa: React.FC<{x: number; y: number; children: string; tamanho?: number; cor?: CorMadeira; p?: number}> = ({x, y, children, tamanho = 110, cor = 'vermelho', p = 1}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const sobe = (1 - ramp(p, 0, 1, elastico)) * 50 * u;
  return (
    <g fontFamily={LETRA} fontSize={tamanho * u} textAnchor="middle" opacity={Math.min(1, p * 3)} filter="url(#madeira-3d-veio)">
      {Array.from({length: 8}, (_, i) => (
        <text key={i} x={x} y={y + sobe + (8 - i) * 1.5 * u} fill={tom(COR[cor], 0.55)}>
          {children}
        </text>
      ))}
      <text x={x} y={y + sobe} fill={COR[cor]}>
        {children}
      </text>
    </g>
  );
};

// ---------- 3. os desenhos prontos ----------

/** O sol: bola amarela num pino, com uma coroa de bolinhas laranja em pé que acompanha o giro. */
export const Sol = (c: Cam, pos: V3, p: number, t: number): Item[] => {
  const e = ramp(p, 0, 1, elastico);
  return [
    pino(c, [pos[0], 0, pos[2]], 12, pos[1], 'nogueira'),
    bolaM(c, pos, 78 * e, 'amarelo', 1, false),
    ...Array.from({length: 10}, (_, i) => {
      const a = (i / 10) * Math.PI * 2 + t * 0.5;
      return bolaM(c, [pos[0] + Math.cos(a) * 118 * e, pos[1] + Math.sin(a) * 118 * e, pos[2]], 18, 'laranja', ramp(p, 0.3 + i * 0.04, 0.6 + i * 0.04, elastico), false);
    }),
  ];
};

/** A nuvem: bolas brancas foscas num pino. `cor` 'cinza' é a nuvem de chuva. */
export const Nuvem = (c: Cam, pos: V3, p: number, tam = 1, cor: CorMadeira = 'creme'): Item[] => [
  pino(c, [pos[0], 0, pos[2]], 10, pos[1] - 30 * tam, 'nogueira'),
  ...(
    [
      [0, 0, 0, 62],
      [-72, -16, 6, 46],
      [72, -14, -6, 48],
      [-34, 30, -10, 44],
      [34, 28, 12, 46],
      [0, -8, 52, 40],
      [0, -8, -52, 40],
    ] as [number, number, number, number][]
  ).map(([x, y, z, r], i) => bolaM(c, [pos[0] + x * tam, pos[1] + y * tam, pos[2] + z * tam], r * tam, cor, ramp(p, i * 0.09, i * 0.09 + 0.4, elastico), i === 0)),
];

/** Pingos: gotas de madeira azul (bolinha com cone em cima) caindo em loop. */
export const Chuva = (c: Cam, pos: V3, raio: number, de: number, t: number, forca = 1, n = 16): Item[] =>
  Array.from({length: n}, (_, i) => {
    if (i / n > forca) return [];
    const fase = (t * (0.7 + acaso(`dv${i}`) * 0.4) + acaso(`df${i}`)) % 1;
    const a = acaso(`da${i}`) * Math.PI * 2;
    const r = Math.sqrt(acaso(`dr${i}`)) * raio;
    const y = de * (1 - fase) + 12;
    const x = pos[0] + Math.cos(a) * r;
    const z = pos[2] + Math.sin(a) * r;
    return [bolaM(c, [x, y, z], 11, 'azul', 1, false), cone(c, [x, y + 6, z], 10, 22, 'azul')];
  }).flat();

/** O mar: uma fila de ondas, meias-bolas azuis que sobem e descem uma depois da outra. */
export const Mar = (c: Cam, p: number, t: number, raio = 300): Item[] => {
  const itens: Item[] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 7; j++) {
      const x = -raio + (j / 6) * raio * 2;
      const z = -raio * 0.7 + (i / 3) * raio * 1.4;
      if (x * x + z * z > raio * raio * 1.05) continue;
      const k = i * 7 + j;
      itens.push(bolaM(c, [x, 10 + balanco(t, 1.4, j + i * 0.6) * 14, z], 48, (i + j) % 2 ? 'azul' : 'celeste', ramp(p, k * 0.02, k * 0.02 + 0.35, elastico)));
    }
  }
  return itens;
};

/** A planta: vaso de pino, caule que sobe e uma árvore de cones empilhados (brinquedo de encaixe). */
export const Planta = (c: Cam, base: V3, p: number, tam = 1): Item[] => {
  const h = 120 * tam * ramp(p, 0.1, 0.45, chega);
  const [x, y, z] = base;
  return [
    pino(c, [x, y, z], 62 * tam, 70 * tam, 'vermelho'),
    pino(c, [x, y + 70 * tam, z], 12 * tam, h, 'nogueira', false),
    ...[0, 1, 2].map((i) => {
      const e = ramp(p, 0.45 + i * 0.15, 0.75 + i * 0.15, elastico);
      return cone(c, [x, y + 70 * tam + h * 0.45 + i * 62 * tam * e, z], (95 - i * 22) * tam * e, 105 * tam * e, 'verde');
    }),
  ];
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A} = useTela();
  const c = useCam(t, -0.25, 0.5, 0.12);
  const blocos = ['Á', 'G', 'U', 'A'].map((l, i) =>
    cubo(c, [-165 + i * 110, 50, 40], 100, (['azul', 'vermelho', 'amarelo', 'verde'] as CorMadeira[])[i], l, ramp(t, 0.2 + i * 0.18, 0.7 + i * 0.18, elastico)),
  );
  return (
    <Giradisco c={c} t={t} dur={dur} itens={[...blocos, ...Nuvem(c, [150, 260, -170], ramp(t, 0.6, 1.4), 0.6)]}>
      <Placa x={L / 2} y={A * 0.17} tamanho={130} cor="nogueira" p={ramp(t, 0, 0.8)}>
        O ciclo da
      </Placa>
    </Giradisco>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const c = useCam(t, 0.3);
  const quente = ramp(t, 1, 1.8);
  const vapor = Array.from({length: 5}, (_, i) => {
    const fase = (t * 0.45 + i / 5) % 1;
    return bolaM(c, [(acaso(`mx${i}`) - 0.5) * 360, 60 + fase * 200, (acaso(`mz${i}`) - 0.5) * 300], 14, 'creme', quente * Math.sin(fase * Math.PI), false);
  });
  return <Giradisco c={c} t={t} dur={dur} itens={[...Mar(c, ramp(t, 0.1, 1), t), ...Sol(c, [-60, 290, -200], ramp(t, 0.3, 1.2), t), ...vapor]} />;
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const c = useCam(t, 1.1);
  const vapor = Array.from({length: 8}, (_, i) => {
    const fase = (t * 0.5 + i / 8) % 1;
    return bolaM(c, [(acaso(`nx${i}`) - 0.5) * 300 * (1 - fase), 60 + fase * 260, (acaso(`nz${i}`) - 0.5) * 300 * (1 - fase)], 16 + fase * 12, 'creme', Math.sin(fase * Math.PI), false);
  });
  return <Giradisco c={c} t={t} dur={dur} itens={[...Mar(c, 1, t), ...vapor, ...Nuvem(c, [0, 380, 0], ramp(t, 0.4, 1.4), 0.75 + ramp(t, 0.8, dur) * 0.4)]} />;
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const c = useCam(t, 1.9);
  const pesa = ramp(t, 0.2, 1);
  return (
    <Giradisco
      c={c}
      t={t}
      dur={dur}
      itens={[...Nuvem(c, [0, 400 - pesa * 30, 0], 1, 1.1, pesa > 0.5 ? 'cinza' : 'creme'), ...Chuva(c, [0, 0, 0], 150, 330, t, ramp(t, 0.6, 1.5))]}
    />
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t, dur}) => {
  const c = useCam(t, 2.6);
  return (
    <Giradisco
      c={c}
      t={t}
      dur={dur}
      semSaida
      itens={[...Nuvem(c, [-170, 420, -120], 1, 0.75, 'cinza'), ...Chuva(c, [-170, 0, -120], 110, 360, t, 1 - ramp(t, 2, 3), 10), ...Planta(c, [60, 0, 80], ramp(t, 0.2, 2.6), 1.1)]}
    />
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
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
