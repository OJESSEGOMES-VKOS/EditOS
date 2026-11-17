// ESTILO: Maquete 3D
// Um diorama em miniatura em cima de uma mesa, visto de cima em ângulo, como
// maquete de escola ou de vitrine: blocos de terreno, peças de plástico
// brilhante em cores de brinquedo, coisas penduradas em hastes, e o desfoque
// de tilt-shift em cima e embaixo que faz tudo parecer pequeno. "3D edição":
// o volume é calculado aqui (projeção, luz por face, sombra), sem Blender.
//
//   1. `tema`      cores, fundo e legenda
//   2. as peças    o mundo 3D (Bloco, Bola, Tubo, Cone, Haste), a Maquete e a Troca
//   3. os desenhos Sol, Nuvem, Chuva, Mar, Planta
//   4. `Exemplo`   o ciclo da água
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarLilita} from '@remotion/google-fonts/LilitaOne';
import {loadFont as carregarNunito} from '@remotion/google-fonts/Nunito';
import type {PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, cenasPorFrase, chega, elastico, ramp, useTela} from '../../kit';

const {fontFamily: TITULO} = carregarLilita('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: TEXTO} = carregarNunito('normal', {weights: ['900'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** Cores de brinquedo: saturadas, limpas, de plástico pintado. */
export const COR = {
  grama: '#5cc35a',
  terra: '#b5774a',
  mar: '#2f9be0',
  areia: '#f3d58a',
  sol: '#ffc928',
  laranja: '#ff8a3d',
  branco: '#f6f7fb',
  cinza: '#9aa9c4',
  vermelho: '#ef4b4b',
  rosa: '#ff8fb8',
  tronco: '#8a5634',
  mesa: '#c99d6e',
  haste: '#d9dde6',
} as const;
export type CorMaquete = keyof typeof COR;

/** Clareia (k > 1) ou escurece (k < 1) uma cor. */
const tom = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(k >= 1 ? v + (255 - v) * (k - 1) : v * k));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

/** O ambiente fora de foco: uma sala clara, borrada, com luzinhas desfocadas. */
const Fundo: React.FC<{t: number}> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #cfe6ee 0%, #e9e2d3 45%, #b98d60 46%, #a77a4f 100%)'}}>
      <Tela>
        <defs>
          <filter id="maquete-3d-bokeh">
            <feGaussianBlur stdDeviation={18 * u} />
          </filter>
        </defs>
        <g filter="url(#maquete-3d-bokeh)">
          {Array.from({length: 9}, (_, i) => (
            <circle
              key={i}
              cx={L * acaso(`bx${i}`)}
              cy={A * (0.04 + acaso(`by${i}`) * 0.3) + balanco(t, 0.2, i) * 8 * u}
              r={(40 + acaso(`br${i}`) * 70) * u}
              fill={['#ffffff', '#ffe7b0', '#bfe3ff'][i % 3]}
              opacity={0.55}
            />
          ))}
        </g>
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'maquete-3d',
  nome: 'Maquete 3D',
  fundo: '#e9e2d3',
  tinta: '#26303f',
  acento: COR.sol,
  legenda: {
    fonte: TEXTO,
    peso: 900,
    tamanho: 64,
    cor: '#ffffff',
    destaque: COR.sol,
    sombra: '0 4px 0 #26303f, 0 0 3px #26303f, 0 0 3px #26303f, 0 0 16px rgba(20,25,35,0.8)',
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------
// O mundo é 3D de verdade: cada peça tem posição [x, y, z] (y pra cima), a
// câmera gira em volta (`giro`) e olha de cima (`inclina`), e a luz vem do alto
// à esquerda. As peças devolvem um `Item`; a <Maquete> ordena pela distância.

export type V3 = [number, number, number];
export type Cam = {giro: number; inclina: number; cx: number; cy: number; s: number; dist: number};
export type Item = {d: number; el: React.ReactNode; sombra?: React.ReactNode};

const proj = (c: Cam, [x, y, z]: V3) => {
  const cg = Math.cos(c.giro);
  const sg = Math.sin(c.giro);
  const xr = x * cg - z * sg;
  const zr = x * sg + z * cg;
  const ci = Math.cos(c.inclina);
  const si = Math.sin(c.inclina);
  const d = zr * ci + y * si;
  const f = c.dist / (c.dist - d);
  return {x: c.cx + xr * c.s * f, y: c.cy - (y * ci - zr * si) * c.s * f, d, f};
};

/** Sombra macia no chão (altura `chao`) embaixo de um ponto. */
const sombraEm = (c: Cam, [x, , z]: V3, r: number, chao: number, forca = 0.3) => {
  const p = proj(c, [x + r * 0.25, chao, z + r * 0.2]);
  const rx = r * c.s * p.f * 1.05;
  return <ellipse cx={p.x} cy={p.y} rx={rx} ry={rx * Math.sin(c.inclina)} fill="#1d2433" opacity={forca} />;
};

/** Um bloco (caixa). `topo` pinta a tampa de outra cor (grama em cima, terra do lado). */
export const bloco = (c: Cam, centro: V3, [w, h, p]: V3, cor: CorMaquete, topo?: CorMaquete, raio = 0): Item => {
  const [x, y, z] = centro;
  const pt = (a: number, b: number, e: number) => proj(c, [x + (a * w) / 2, y + (b * h) / 2, z + (e * p) / 2]);
  const sg = Math.sin(c.giro);
  const cg = Math.cos(c.giro);
  // as faces de lado: normal no mundo e se está virada pra câmera
  const faces: {vis: number; luz: number; q: [number, number, number][]}[] = [
    {vis: sg, luz: cg, q: [[1, -1, -1], [1, -1, 1], [1, 1, 1], [1, 1, -1]]},
    {vis: -sg, luz: -cg, q: [[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]]},
    {vis: cg, luz: -sg, q: [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]},
    {vis: -cg, luz: sg, q: [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1]]},
  ];
  const poli = (q: [number, number, number][]) => q.map(([a, b, e]) => pt(a, b, e)).map((v) => `${v.x},${v.y}`).join(' ');
  const base = COR[cor];
  return {
    d: proj(c, centro).d,
    el: (
      <g strokeLinejoin="round" strokeWidth={raio * c.s}>
        {faces
          .filter((f) => f.vis > 0.001)
          .map((f, i) => {
            const k = 0.62 + 0.18 * f.luz;
            return <polygon key={i} points={poli(f.q)} fill={tom(base, k)} stroke={tom(base, k)} />;
          })}
        <polygon points={poli([[-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1]])} fill={tom(COR[topo ?? cor], 1.04)} stroke={tom(COR[topo ?? cor], 1.04)} />
      </g>
    ),
  };
};

/** Uma bola de plástico brilhante. `chao` liga a sombra embaixo dela. */
export const bola = (c: Cam, centro: V3, r: number, cor: CorMaquete, chao?: number, escala = 1): Item => {
  const p = proj(c, centro);
  const R = r * c.s * p.f * escala;
  return {
    d: p.d,
    sombra: chao !== undefined && escala > 0.05 ? sombraEm(c, centro, r * escala, chao, 0.28 / (1 + (centro[1] - chao) / 300)) : undefined,
    el:
      R < 0.5 ? null : (
        <g>
          <circle cx={p.x} cy={p.y} r={R} fill={`url(#maquete-3d-bola-${cor})`} />
          <ellipse cx={p.x - R * 0.35} cy={p.y - R * 0.42} rx={R * 0.26} ry={R * 0.16} fill="#ffffff" opacity={0.7} transform={`rotate(-30 ${p.x - R * 0.35} ${p.y - R * 0.42})`} />
        </g>
      ),
  };
};

/** Um tubo em pé (cilindro), da base pra cima. */
export const tubo = (c: Cam, base: V3, r: number, h: number, cor: CorMaquete): Item => {
  const pb = proj(c, base);
  const pt = proj(c, [base[0], base[1] + h, base[2]]);
  const si = Math.sin(c.inclina);
  const rb = r * c.s * pb.f;
  const rt = r * c.s * pt.f;
  const corpo = `M${pb.x - rb},${pb.y} L${pt.x - rt},${pt.y} L${pt.x + rt},${pt.y} L${pb.x + rb},${pb.y} A${rb} ${rb * si} 0 0 1 ${pb.x - rb} ${pb.y} Z`;
  return {
    d: proj(c, [base[0], base[1] + h / 2, base[2]]).d,
    el: h <= 0 ? null : (
      <g>
        <path d={corpo} fill={`url(#maquete-3d-tubo-${cor})`} />
        <ellipse cx={pt.x} cy={pt.y} rx={rt} ry={rt * si} fill={tom(COR[cor], 1.12)} />
      </g>
    ),
  };
};

/** Um cone em pé (copa de pinheiro, telhado, gota). */
export const cone = (c: Cam, base: V3, r: number, h: number, cor: CorMaquete): Item => {
  const pb = proj(c, base);
  const pa = proj(c, [base[0], base[1] + h, base[2]]);
  const rb = r * c.s * pb.f;
  const si = Math.sin(c.inclina);
  return {
    d: proj(c, [base[0], base[1] + h * 0.3, base[2]]).d,
    el: (
      <path d={`M${pb.x - rb},${pb.y} L${pa.x},${pa.y} L${pb.x + rb},${pb.y} A${rb} ${rb * si} 0 0 1 ${pb.x - rb} ${pb.y} Z`} fill={`url(#maquete-3d-tubo-${cor})`} />
    ),
  };
};

/** A haste fininha de maquete que segura as coisas no ar (sol, nuvem). */
export const haste = (c: Cam, de: V3, ate: V3): Item => {
  const a = proj(c, de);
  const b = proj(c, ate);
  return {
    d: Math.min(a.d, b.d) - 1,
    el: (
      <g strokeLinecap="round">
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#8d95a6" strokeWidth={7 * c.s} />
        <line x1={a.x - 1.5 * c.s} y1={a.y} x2={b.x - 1.5 * c.s} y2={b.y} stroke="#f2f4f8" strokeWidth={2.5 * c.s} />
      </g>
    ),
  };
};

/** Os gradientes de luz de cada cor (bola e tubo). Vai uma vez dentro da <Maquete>. */
const Luzes: React.FC = () => (
  <defs>
    {(Object.keys(COR) as CorMaquete[]).map((k) => (
      <React.Fragment key={k}>
        <radialGradient id={`maquete-3d-bola-${k}`} cx="0.36" cy="0.32" r="0.78">
          <stop offset="0" stopColor={tom(COR[k], 1.35)} />
          <stop offset="0.45" stopColor={COR[k]} />
          <stop offset="1" stopColor={tom(COR[k], 0.5)} />
        </radialGradient>
        <linearGradient id={`maquete-3d-tubo-${k}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={tom(COR[k], 0.62)} />
          <stop offset="0.32" stopColor={tom(COR[k], 1.25)} />
          <stop offset="0.6" stopColor={COR[k]} />
          <stop offset="1" stopColor={tom(COR[k], 0.48)} />
        </linearGradient>
      </React.Fragment>
    ))}
    <filter id="maquete-3d-sombra">
      <feGaussianBlur stdDeviation={10} />
    </filter>
  </defs>
);

/**
 * A maquete: monta os itens na ordem certa (do fundo pra frente), põe as sombras
 * no chão e aplica o tilt-shift (cima e baixo desfocados). `t` e `dur` fazem a
 * entrada (a maquete pousa) e a saída (ela sobe e some): é a transição do estilo.
 */
export const Maquete: React.FC<{itens: Item[]; t: number; dur: number; children?: React.ReactNode; semSaida?: boolean}> = ({itens, t, dur, children, semSaida}) => {
  const {A} = useTela();
  const entra = ramp(t, 0, 0.4, chega);
  const sai = semSaida ? 0 : ramp(t, dur - 0.3, dur);
  const ordem = [...itens].sort((a, b) => a.d - b.d);
  const cena = (
    <Tela>
      <Luzes />
      <g filter="url(#maquete-3d-sombra)">{ordem.map((it, i) => <React.Fragment key={i}>{it.sombra}</React.Fragment>)}</g>
      {ordem.map((it, i) => (
        <React.Fragment key={i}>{it.el}</React.Fragment>
      ))}
      {children}
    </Tela>
  );
  const estilo: React.CSSProperties = {
    transform: `translateY(${(1 - entra) * A * 0.06 - sai * A * 0.08}px) scale(${0.94 + entra * 0.06})`,
    opacity: Math.min(entra * 1.6, 1 - sai),
  };
  const borra = 'linear-gradient(180deg, #000 0%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 50%, #000 68%)';
  return (
    <AbsoluteFill style={estilo}>
      <AbsoluteFill>{cena}</AbsoluteFill>
      {/* o tilt-shift: a mesma cena borrada, só nas faixas de cima e de baixo */}
      <AbsoluteFill style={{filter: 'blur(7px) saturate(1.15)', WebkitMaskImage: borra, maskImage: borra}}>{cena}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** A câmera padrão: de cima, a uns 33 graus, girando de leve. */
export const useCam = (t: number, giro = 0.62, cyFrac = 0.43): Cam => {
  const {L, A, u} = useTela();
  return {giro: giro + balanco(t, 0.25) * 0.06 + t * 0.02, inclina: 0.58, cx: L / 2, cy: A * cyFrac, s: u * 1.3, dist: 2600};
};

/** A mesa e o bloco de terreno onde a maquete fica. `topo` muda a tampa (grama, mar...). */
export const terreno = (c: Cam, topo: CorMaquete = 'grama', lado = 560): Item[] => [
  bloco(c, [0, -95, 0], [lado + 520, 50, lado + 420], 'mesa'),
  bloco(c, [0, -35, 0], [lado, 70, lado], 'terra', topo, 6),
];

/** Texto em relevo, de peça de plástico: camadas empilhadas dão a espessura. */
export const Letreiro: React.FC<{x: number; y: number; children: string; tamanho?: number; cor?: CorMaquete; p?: number}> = ({x, y, children, tamanho = 120, cor = 'sol', p = 1}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const sobe = (1 - ramp(p, 0, 1, elastico)) * 60 * u;
  const camadas = 10;
  return (
    <g fontFamily={TITULO} fontSize={tamanho * u} textAnchor="middle" opacity={Math.min(1, p * 3)}>
      <text x={x + 10 * u} y={y + sobe + 26 * u} fill="#1d2433" opacity={0.25} filter="url(#maquete-3d-sombra)">
        {children}
      </text>
      {Array.from({length: camadas}, (_, i) => (
        <text key={i} x={x} y={y + sobe + (camadas - i) * 1.6 * u} fill={tom(COR[cor], 0.55 + i * 0.02)}>
          {children}
        </text>
      ))}
      <text x={x} y={y + sobe} fill={COR[cor]} stroke={tom(COR[cor], 1.3)} strokeWidth={2 * u}>
        {children}
      </text>
    </g>
  );
};

// ---------- 3. os desenhos prontos ----------
// Todo desenho recebe a câmera, o ponto no mundo e `p` (0 a 1), e devolve itens.

/** O sol: bola amarela presa numa haste, com raios de bolinha laranja girando. */
export const Sol = (c: Cam, pos: V3, p: number, t: number, chao = 0): Item[] => {
  const e = ramp(p, 0, 1, elastico);
  const raios = Array.from({length: 8}, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + t * 0.6;
    return bola(c, [pos[0] + Math.cos(a) * 112, pos[1] + Math.sin(a) * 112, pos[2]], 16, 'laranja', undefined, e);
  });
  return [haste(c, [pos[0], chao, pos[2]], pos), bola(c, pos, 72, 'sol', chao, e), ...raios];
};

const NUVEM: V3[] = [
  [0, 0, 0],
  [-70, -14, 10],
  [70, -12, -8],
  [-30, 34, -4],
  [36, 30, 10],
  [-120, -24, 0],
  [118, -22, 4],
];

/** A nuvem: bolas brancas agrupadas, numa haste. `tam` 1 é o normal; `cor` escurece pra chuva. */
export const Nuvem = (c: Cam, pos: V3, p: number, tam = 1, cor: CorMaquete = 'branco', chao = 0): Item[] => [
  haste(c, [pos[0], chao, pos[2]], pos),
  ...NUVEM.map(([x, y, z], i) => bola(c, [pos[0] + x * tam, pos[1] + y * tam, pos[2] + z * tam], (i < 5 ? 58 : 42) * tam, cor, i === 0 ? chao : undefined, ramp(p, i * 0.1, i * 0.1 + 0.4, elastico))),
];

/** Pingos (tubinhos azuis) caindo entre a altura `de` e `ate`, num quadrado de lado `largura`. */
export const Chuva = (c: Cam, pos: V3, largura: number, de: number, ate: number, t: number, forca = 1, n = 22): Item[] =>
  Array.from({length: n}, (_, i) => {
    if (i / n > forca) return null;
    const fase = (t * (0.8 + acaso(`mv${i}`) * 0.5) + acaso(`mf${i}`)) % 1;
    const y = de + (ate - de) * fase;
    return tubo(c, [pos[0] + (acaso(`mx${i}`) - 0.5) * largura, y, pos[2] + (acaso(`mz${i}`) - 0.5) * largura], 5, 30, 'mar');
  }).filter((x): x is Item => x !== null);

/** O mar: a tampa azul vem do `terreno`; aqui são as ondinhas (bolinhas claras) que sobem e descem. */
export const Mar = (c: Cam, y: number, lado: number, t: number, p = 1): Item[] =>
  Array.from({length: 14}, (_, i) => {
    const x = (acaso(`ox${i}`) - 0.5) * lado * 0.85;
    const z = (acaso(`oz${i}`) - 0.5) * lado * 0.85;
    return bola(c, [x, y + 4 + balanco(t, 1.2, i) * 6, z], 14, 'branco', undefined, 0.6 * ramp(p, i * 0.04, i * 0.04 + 0.3));
  });

/** A planta: um tronco que cresce e uma copa de bolas verdes que brotam. */
export const Planta = (c: Cam, base: V3, p: number, t: number, tam = 1): Item[] => {
  const h = 150 * tam * ramp(p, 0, 0.5, chega);
  const topo: V3 = [base[0], base[1] + h, base[2]];
  const copa: V3[] = [
    [0, 40, 0],
    [-46, 10, 10],
    [46, 14, -6],
    [0, 8, 44],
    [0, 12, -44],
    [0, 78, 0],
  ];
  return [
    tubo(c, base, 16 * tam, h, 'tronco'),
    ...copa.map(([x, y, z], i) =>
      bola(c, [topo[0] + x * tam + balanco(t, 0.7, i) * 3, topo[1] + y * tam, topo[2] + z * tam], (i === 0 ? 62 : 46) * tam, 'grama', i === 0 ? base[1] : undefined, ramp(p, 0.45 + i * 0.07, 0.75 + i * 0.07, elastico)),
    ),
  ];
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A} = useTela();
  const c = useCam(t, 0.62, 0.47);
  const itens = [
    ...terreno(c, 'grama', 460),
    bloco(c, [80, 2, 40], [220, 6, 260], 'mar', undefined, 4),
    ...Planta(c, [-120, 0, -90], ramp(t, 0.3, 1.8), t, 0.8),
    ...Nuvem(c, [150, 260, -150], ramp(t, 0.6, 1.6), 0.55, 'branco', 0),
  ];
  return (
    <Maquete itens={itens} t={t} dur={dur}>
      <Letreiro x={L / 2} y={A * 0.13} tamanho={150} cor="mar" p={ramp(t, 0.1, 0.9)}>
        O ciclo
      </Letreiro>
      <Letreiro x={L / 2} y={A * 0.13 + 128 * c.s} tamanho={150} cor="sol" p={ramp(t, 0.35, 1.15)}>
        da água
      </Letreiro>
    </Maquete>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const c = useCam(t, 0.7);
  const quente = ramp(t, 0.9, 1.8);
  const vapor = Array.from({length: 6}, (_, i) => {
    const fase = (t * 0.45 + i / 6) % 1;
    return bola(c, [(acaso(`vx${i}`) - 0.5) * 300, fase * 200, (acaso(`vz${i}`) - 0.5) * 300], 16, 'branco', undefined, quente * Math.sin(fase * Math.PI));
  });
  return (
    <Maquete
      itens={[...terreno(c, 'mar'), bloco(c, [-200, 6, 0], [140, 12, 540], 'areia', undefined, 4), ...Mar(c, 0, 520, t, ramp(t, 0.2, 1)), ...Sol(c, [-150, 330, -140], ramp(t, 0.1, 1), t), ...vapor]}
      t={t}
      dur={dur}
    />
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const c = useCam(t, 0.8, 0.46);
  const cresce = ramp(t, 0.6, dur - 0.4);
  const vapor = Array.from({length: 9}, (_, i) => {
    const fase = (t * 0.5 + i / 9) % 1;
    return bola(c, [(acaso(`wx${i}`) - 0.5) * 260 * (1 - fase), 10 + fase * 300, (acaso(`wz${i}`) - 0.5) * 260 * (1 - fase)], 18 + fase * 14, 'branco', undefined, Math.min(1, ramp(t, 0, 0.6)) * Math.sin(fase * Math.PI) * 0.95);
  });
  return <Maquete itens={[...terreno(c, 'mar'), ...Mar(c, 0, 520, t), ...vapor, ...Nuvem(c, [0, 380, 0], ramp(t, 0.4, 1.4), 0.7 + cresce * 0.45)]} t={t} dur={dur} />;
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const c = useCam(t, 0.9, 0.45);
  const pesa = ramp(t, 0.2, 1);
  return (
    <Maquete
      itens={[
        ...terreno(c, 'grama'),
        bloco(c, [90, 2, 60], [260, 6, 220], 'mar', undefined, 4),
        ...Nuvem(c, [0, 380 - pesa * 30, 0], 1, 1.15, pesa > 0.5 ? 'cinza' : 'branco'),
        ...Chuva(c, [0, 0, 0], 300, 300, 10, t, ramp(t, 0.6, 1.6)),
      ]}
      t={t}
      dur={dur}
    />
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t, dur}) => {
  const c = useCam(t, 1.0, 0.45);
  return (
    <Maquete
      itens={[
        ...terreno(c, 'grama'),
        ...Nuvem(c, [-60, 420, -60], 1, 0.85, 'cinza'),
        ...Chuva(c, [-60, 0, -60], 220, 340, 10, t, 1 - ramp(t, 2, 3), 14),
        ...Planta(c, [40, 0, 60], ramp(t, 0.3, 2.6), t, 1.1),
        bola(c, [-170, 12, 150], 14, 'rosa', 0, ramp(t, 1.6, 2.1, elastico)),
        bola(c, [180, 12, -40], 14, 'vermelho', 0, ramp(t, 1.9, 2.4, elastico)),
      ]}
      t={t}
      dur={dur}
      semSaida
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
