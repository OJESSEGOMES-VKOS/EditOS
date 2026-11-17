// ESTILO: Vitral cósmico
// Uma rosácea redonda flutuando no escuro do espaço, em que cada vidro é feito
// de grãos de luz em cor de joia. No começo a poeira se junta e forma a rosácea;
// a cada cena as cores giram, varrendo do centro pra fora, e o medalhão do meio
// mostra em traço de luz o assunto do momento. Bom pra clima, mistério, ciência,
// "o que é", fato curioso e abertura solene.
//
//   1. `tema`      cores, fundo e legenda
//   2. as peças    a rosácea de grãos, o medalhão, o traço de luz, os feixes, o letreiro
//   3. os desenhos ícones prontos do medalhão
//   4. `Exemplo`   a história-padrão (o ciclo da água) contada neste estilo
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarCinzel} from '@remotion/google-fonts/Cinzel';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, Traco, acaso, balanco, caminho, cenasPorFrase, circulo, emFila, ramp, suave, useTela} from '../../kit';

const {fontFamily: CINZEL} = carregarCinzel('normal', {weights: ['400', '700'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As joias, na ordem em que giram. */
export const JOIAS = ['#e0283c', '#2a6cff', '#f2b51c', '#1fae6a', '#9b3cff', '#ff7a1a', '#18c6d6'] as const;
export const COR = {
  vazio: '#04030c',
  chumbo: '#0b0912',
  ouro: '#e6be6e',
  luz: '#fff3d0',
  medalhao: '#1a1238',
} as const;

const ESTRELAS = Array.from({length: 90}, (_, i) => ({x: acaso(`vx${i}`), y: acaso(`vy${i}`), r: 0.8 + acaso(`vr${i}`) * 1.8, f: acaso(`vf${i}`) * 9}));

/** O espaço: quase preto, um halo violeta atrás da rosácea e poucas estrelas. Também guarda os brilhos de cada joia. */
const Fundo: React.FC<{t: number}> = ({t}) => {
  const {L, A, u} = useTela();
  const r = useRosa();
  return (
    <AbsoluteFill style={{background: COR.vazio}}>
      <Tela>
        <defs>
          {[...JOIAS, COR.luz].map((c, i) => (
            <radialGradient key={c} id={`vitral-cosmico-g${i}`}>
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.15" stopColor={c} />
              <stop offset="0.42" stopColor={c} stopOpacity={0.35} />
              <stop offset="1" stopColor={c} stopOpacity={0} />
            </radialGradient>
          ))}
          <radialGradient id="vitral-cosmico-halo">
            <stop offset="0" stopColor="#5a3ca0" stopOpacity={0.45} />
            <stop offset="1" stopColor="#5a3ca0" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="vitral-cosmico-centro">
            <stop offset="0" stopColor="#2a1d52" />
            <stop offset="1" stopColor="#120c26" />
          </radialGradient>
          <linearGradient id="vitral-cosmico-feixe" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffdca0" stopOpacity={0.16} />
            <stop offset="1" stopColor="#ffdca0" stopOpacity={0} />
          </linearGradient>
          <filter id="vitral-cosmico-brilho" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation={9 * u} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {ESTRELAS.map((e, i) => (
          <circle key={i} cx={e.x * L} cy={e.y * A} r={e.r * u} fill="#fff" opacity={0.15 + 0.35 * Math.abs(Math.sin(t * 1.1 + e.f))} />
        ))}
        <circle cx={r.cx} cy={r.cy} r={r.R * 2} fill="url(#vitral-cosmico-halo)" />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'vitral-cosmico',
  nome: 'Vitral cósmico',
  fundo: COR.vazio,
  tinta: COR.luz,
  acento: COR.ouro,
  legenda: {
    fonte: CINZEL,
    peso: 700,
    tamanho: 60,
    cor: COR.luz,
    destaque: COR.ouro,
    sombra: '0 0 22px rgba(255,210,140,0.45), 0 2px 8px #000, 0 0 4px #000',
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** Onde a rosácea fica: centro (cx, cy) e raio R. No vertical ela mora no meio de cima, acima da legenda. */
export const useRosa = () => {
  const {L, A, deitado} = useTela();
  const R = deitado ? A * 0.36 : L * 0.4;
  return {cx: L / 2, cy: A * (deitado ? 0.47 : 0.39), R};
};

const ANEIS = [0, 0.42, 0.64, 0.84, 1];
const SETORES = [1, 8, 16, 24];
type Celula = {r0: number; r1: number; a0: number; a1: number; anel: number; s: number};
const CELULAS: Celula[] = [];
for (let a = 1; a < 4; a++)
  for (let s = 0; s < SETORES[a]; s++) {
    const gira = a === 2 ? Math.PI / SETORES[a] : 0;
    CELULAS.push({r0: ANEIS[a], r1: ANEIS[a + 1], a0: gira + (s / SETORES[a]) * 2 * Math.PI - Math.PI / 2, a1: gira + ((s + 1) / SETORES[a]) * 2 * Math.PI - Math.PI / 2, anel: a, s});
  }
const POR_CELULA = 11;
const GRAOS = CELULAS.flatMap((c, ci) =>
  Array.from({length: POR_CELULA}, (_, j) => {
    const id = ci * 100 + j;
    return {ci, u: acaso(`gu${id}`), w: acaso(`gw${id}`), fase: acaso(`gp${id}`) * 6.28, tam: 0.7 + acaso(`gz${id}`) * 1.4, x0: acaso(`gx${id}`), y0: acaso(`gy${id}`), vira: acaso(`gv${id}`)};
  })
);

/** A cor (índice da joia) de uma célula na volta `k` das cores. */
const joia = (c: Celula, k: number) => (c.s + c.anel * 2 + k * 3) % JOIAS.length;

/**
 * A rosácea de grãos de luz. `junta` (0 a 1) traz a poeira espalhada até os vidros; `volta` é a volta das cores
 * desta cena e `virada` (0 a 1) é a transição: as cores da volta anterior viram as novas, do centro pra fora.
 */
export const Rosacea: React.FC<{tv: number; junta?: number; volta: number; virada?: number}> = ({tv, junta = 1, volta, virada = 1}) => {
  const {L, A, u} = useTela();
  const {cx, cy, R} = useRosa();
  const j = suave(Math.max(0, Math.min(1, junta)));
  const chumbo = ramp(junta, 0.75, 1);
  return (
    <>
      <g style={{mixBlendMode: 'screen'}}>
        {GRAOS.map((g, i) => {
          const c = CELULAS[g.ci];
          const ja = ramp(virada, (c.anel - 1) * 0.25, (c.anel - 1) * 0.25 + 0.5);
          const k = g.vira < ja ? volta : volta - 1;
          const r = R * (c.r0 + 0.04 + (c.r1 - c.r0 - 0.08) * (g.u + 0.08 * Math.sin(tv * 1.2 + g.fase)));
          const a = c.a0 + 0.05 + (c.a1 - c.a0 - 0.1) * (g.w + 0.06 * Math.sin(tv * 1.5 + g.fase * 2));
          const espalha = Math.sin(j * Math.PI) * 80 * u;
          const x = g.x0 * L + (cx + Math.cos(a) * r - g.x0 * L) * j + Math.cos(g.fase) * espalha;
          const y = g.y0 * A + (cy + Math.sin(a) * r - g.y0 * A) * j + Math.sin(g.fase) * espalha;
          const onda = 0.6 + 0.4 * Math.sin(tv * 3.6 - c.anel * 1.2 + c.s * 0.4);
          return <circle key={i} cx={x} cy={y} r={g.tam * 15 * u * (0.75 + 0.3 * onda)} fill={`url(#vitral-cosmico-g${joia(c, Math.max(0, k))})`} opacity={(0.45 + 0.4 * j) * (0.7 + 0.3 * onda)} />;
        })}
      </g>
      {chumbo > 0 && (
        <g opacity={chumbo}>
          {ANEIS.slice(1).map((a, i) => (
            <circle key={i} cx={cx} cy={cy} r={R * a} fill="none" stroke={COR.chumbo} strokeWidth={10 * u} />
          ))}
          {CELULAS.map((c, i) => (
            <line key={i} x1={cx + Math.cos(c.a0) * R * c.r0} y1={cy + Math.sin(c.a0) * R * c.r0} x2={cx + Math.cos(c.a0) * R * c.r1} y2={cy + Math.sin(c.a0) * R * c.r1} stroke={COR.chumbo} strokeWidth={9 * u} />
          ))}
          <circle cx={cx} cy={cy} r={R + 12 * u} fill="none" stroke={COR.ouro} strokeWidth={3 * u} opacity={0.6} />
        </g>
      )}
    </>
  );
};

/** O medalhão: o vidro escuro do centro, onde o assunto aparece em traço de luz. Passe o desenho como filho. */
export const Medalhao: React.FC<{p: number; children?: React.ReactNode}> = ({p, children}) => {
  const {cx, cy, R} = useRosa();
  if (p <= 0) return null;
  return (
    <g opacity={p}>
      <circle cx={cx} cy={cy} r={R * ANEIS[1] - 5} fill="url(#vitral-cosmico-centro)" />
      <g filter="url(#vitral-cosmico-brilho)">{children}</g>
    </g>
  );
};

/** Traço de luz creme que se desenha: tudo no medalhão é feito dele. */
export const TracoDeLuz: React.FC<{pontos: Ponto[]; p: number; grossura?: number; fechado?: boolean; reto?: boolean; cheio?: boolean}> = ({
  pontos,
  p,
  grossura = 7,
  fechado = false,
  reto = false,
  cheio = false,
}) => {
  const {u} = useTela();
  const d = caminho(pontos, fechado, reto);
  return (
    <>
      {cheio && p > 0.6 && <path d={d} fill={COR.luz} opacity={ramp(p, 0.6, 1) * 0.85} />}
      <Traco d={d} p={p} stroke={COR.luz} strokeWidth={grossura * u} />
    </>
  );
};

/** Os feixes de luz que descem da rosácea. */
export const Feixes: React.FC<{p: number}> = ({p}) => {
  const {A} = useTela();
  const {cx, cy, R} = useRosa();
  if (p <= 0) return null;
  return <path d={`M${cx - R * 0.6} ${cy + R * 0.85} L${cx + R * 0.6} ${cy + R * 0.85} L${cx + R * 1.2} ${A} L${cx - R * 1.2} ${A}Z`} fill="url(#vitral-cosmico-feixe)" opacity={p} style={{mixBlendMode: 'screen'}} />;
};

/** Texto em maiúscula clássica, com brilho dourado. */
export const Letreiro: React.FC<{x: number; y: number; children: string; p: number; tamanho?: number; cor?: string; espaco?: number; peso?: number}> = ({
  x,
  y,
  children,
  p,
  tamanho = 96,
  cor = COR.luz,
  espaco = 0.05,
  peso = 700,
}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  return (
    <text x={x} y={y + (1 - p) * 20 * u} textAnchor="middle" fontFamily={CINZEL} fontWeight={peso} fontSize={tamanho * u} letterSpacing={`${espaco}em`} fill={cor} opacity={p} filter="url(#vitral-cosmico-brilho)">
      {children}
    </text>
  );
};

// ---------- 3. os desenhos prontos (ícones do medalhão) ----------
// Recebem `p` e o tempo; desenham no centro da rosácea, do tamanho do medalhão.

type Icone = React.FC<{p: number; t: number}>;

export const Sol: Icone = ({p, t}) => {
  const {cx, cy, R} = useRosa();
  const m = R * ANEIS[1];
  return (
    <>
      <TracoDeLuz pontos={circulo(cx, cy, m * 0.24)} p={p} fechado cheio />
      {Array.from({length: 12}, (_, i) => {
        const a = (i / 12) * Math.PI * 2 + t * 0.2;
        const r1 = m * (i % 2 ? 0.6 : 0.78);
        return <TracoDeLuz key={i} reto pontos={[[cx + Math.cos(a) * m * 0.36, cy + Math.sin(a) * m * 0.36], [cx + Math.cos(a) * r1, cy + Math.sin(a) * r1]]} p={emFila(p, 0.3, 0.7, i, 12)} grossura={6} />;
      })}
    </>
  );
};

export const Mar: Icone = ({p, t}) => {
  const {cx, cy, R} = useRosa();
  const m = R * ANEIS[1];
  return (
    <>
      {[0, 1, 2].map((k) => {
        const pts: Ponto[] = Array.from({length: 9}, (_, i) => [cx - m * 0.62 + (m * 1.24 * i) / 8, cy - m * 0.3 + k * m * 0.3 + Math.sin(i * 1.4 + t * 2 + k) * m * 0.08]);
        return <TracoDeLuz key={k} pontos={pts} p={emFila(p, 0, 1, k, 3)} grossura={6} />;
      })}
    </>
  );
};

const nuvem = (cx: number, cy: number, w: number): Ponto[] => {
  const h = w * 0.42;
  return [
    [cx - w * 0.48, cy + h * 0.45],
    [cx - w * 0.52, cy],
    [cx - w * 0.3, cy - h * 0.3],
    [cx - w * 0.12, cy - h * 0.7],
    [cx + w * 0.12, cy - h * 0.75],
    [cx + w * 0.26, cy - h * 0.35],
    [cx + w * 0.46, cy - h * 0.25],
    [cx + w * 0.52, cy + h * 0.15],
    [cx + w * 0.42, cy + h * 0.45],
  ];
};

export const Nuvem: Icone = ({p, t}) => {
  const {cx, cy, R} = useRosa();
  const m = R * ANEIS[1];
  return <TracoDeLuz pontos={nuvem(cx, cy + balanco(t, 0.4) * m * 0.04, m * 1.2)} p={p} fechado />;
};

export const Chuva: Icone = ({p, t}) => {
  const {u} = useTela();
  const {cx, cy, R} = useRosa();
  const m = R * ANEIS[1];
  return (
    <>
      <TracoDeLuz pontos={nuvem(cx, cy - m * 0.3, m * 1.05)} p={p} fechado />
      {p > 0.5 &&
        Array.from({length: 6}, (_, i) => {
          const fase = (t * 1.1 + acaso(`vc${i}`)) % 1;
          const x = cx - m * 0.4 + (i / 5) * m * 0.8;
          const y = cy + m * 0.0 + fase * m * 0.55;
          return <line key={i} x1={x} y1={y} x2={x - 5 * u} y2={y + 26 * u} stroke={COR.luz} strokeWidth={6 * u} strokeLinecap="round" opacity={1 - fase} />;
        })}
    </>
  );
};

export const Planta: Icone = ({p, t}) => {
  const {cx, cy, R} = useRosa();
  const m = R * ANEIS[1];
  const base = cy + m * 0.6;
  const alto = m * 1.1;
  const venta = balanco(t, 0.8) * m * 0.04;
  const folha = (lado: 1 | -1, h: number): Ponto[] => {
    const by = base - alto * h;
    const c = m * 0.42;
    return [
      [cx, by],
      [cx + lado * c * 0.5, by - c * 0.45],
      [cx + lado * c, by - c * 0.2],
      [cx + lado * c * 0.5, by + c * 0.12],
    ];
  };
  return (
    <>
      <TracoDeLuz pontos={[[cx, base], [cx + venta * 0.5, base - alto * 0.5], [cx + venta, base - alto]]} p={ramp(p, 0, 0.5)} />
      <TracoDeLuz pontos={folha(-1, 0.38)} p={ramp(p, 0.35, 0.75)} fechado cheio />
      <TracoDeLuz pontos={folha(1, 0.66)} p={ramp(p, 0.55, 1)} fechado cheio />
    </>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, tv}) => {
  const {L, A, u} = useTela();
  return (
    <Tela>
      <Rosacea tv={tv} junta={ramp(t, 0, 2)} volta={0} />
      <Medalhao p={ramp(t, 1.6, 2.1)}>
        <Sol p={ramp(t, 1.7, 2.3)} t={tv} />
      </Medalhao>
      <Letreiro x={L / 2} y={A * 0.08} p={ramp(t, 0.2, 0.8)} tamanho={44} cor={COR.ouro} espaco={0.35} peso={400}>
        O CICLO
      </Letreiro>
      <Letreiro x={L / 2} y={A * 0.08 + 100 * u} p={ramp(t, 0.4, 1)} tamanho={92}>
        DA ÁGUA
      </Letreiro>
    </Tela>
  );
};

/** Uma cena com a rosácea na volta `volta` de cores e um ícone no medalhão. */
const cena = (volta: number, Ic: Icone, Ic2?: Icone): React.FC<PropsCena> => {
  const C: React.FC<PropsCena> = ({t, tv}) => (
    <Tela>
      <Feixes p={ramp(t, 0, 0.8)} />
      <Rosacea tv={tv} volta={volta} virada={ramp(t, 0, 1.1)} />
      <Medalhao p={1}>
        <g opacity={Ic2 ? 1 - ramp(t, 1.4, 1.8) : 1}>
          <Ic p={ramp(t, 0.2, 1.2)} t={tv} />
        </g>
        {Ic2 && <Ic2 p={ramp(t, 1.6, 2.6)} t={tv} />}
      </Medalhao>
    </Tela>
  );
  return C;
};

const SolEMar: Icone = ({p, t}) => {
  const {cx, cy, R} = useRosa();
  const m = R * ANEIS[1];
  return (
    <>
      <g transform={`translate(${cx} ${cy - m * 0.3}) scale(0.55) translate(${-cx} ${-cy})`}>
        <Sol p={p} t={t} />
      </g>
      <g transform={`translate(${cx} ${cy + m * 0.4}) scale(0.7 0.6) translate(${-cx} ${-cy})`}>
        <Mar p={ramp(p, 0.3, 1)} t={t} />
      </g>
    </>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    semLegenda={[[0, FALA_EXEMPLO.frases[1].s]]}
    cenas={cenasPorFrase(FALA_EXEMPLO, [
      [0, 0, Titulo, 0],
      [1, 1, cena(1, SolEMar), 0],
      [2, 2, cena(2, Mar, Nuvem), 0],
      [3, 3, cena(3, Chuva), 0],
      [4, 4, cena(4, Planta), 0],
    ])}
  />
);
