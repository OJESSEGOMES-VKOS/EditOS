// ESTILO: Pintura a óleo
// Cada cena é um quadro pintado na frente de quem assiste: centenas de pinceladas
// grossas, com empasto (a crista de tinta que pega luz), seguindo o contorno das
// formas. A cena nova é pintada por cima da anterior, pincelada por pincelada.
// Bom pra história, reflexão, curiosidade com clima, abertura bonita.
//
// As quatro partes, como no molde:
//   1. `tema`      cores, fundo (a tela de linho) e legenda
//   2. as peças    Quadro (as pinceladas), os campos de cor, Assinatura (texto) e a repintura (transição)
//   3. os desenhos Sol, Nuvem, Chuva, Mar e Planta como campos de cor
//   4. `Exemplo`   o ciclo da água em cinco quadros
//
// Como no mosaico, um desenho aqui é um CAMPO: uma função que diz a cor da tinta no
// ponto (x, y). O Quadro pergunta pra cada pincelada e, pela diferença de luz em
// volta, vira a pincelada pra seguir a forma.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import type {PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, cenasPorFrase, chega, ramp, useTela} from '../../kit';

const {fontFamily: LETRA} = carregarPlayfair('italic', {weights: ['700'], subsets: ['latin', 'latin-ext']});
const {fontFamily: TITULO} = carregarPlayfair('normal', {weights: ['900'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** A paleta do pintor: terras quentes, azuis profundos e luz de amarelo-nápoles. */
export const COR = {
  linho: '#d8c8a8',
  ocre: '#c98a2e',
  napoles: '#f4d58a',
  luz: '#fff1c8',
  siena: '#8a4a22',
  sombra: '#2a2238',
  ultramar: '#22417a',
  cobalto: '#3f6fb0',
  celeste: '#9cc0dc',
  nevoa: '#d9dcd6',
  verde: '#3f6a34',
  verdeLuz: '#8fae4a',
  cinza: '#6f7480',
  carmim: '#9a2f2a',
} as const;

/** A tela de linho crua, com a trama do tecido. Só aparece antes da primeira pincelada e nas frestas. */
const Fundo: React.FC<{t: number}> = () => {
  const {L, A} = useTela();
  return (
    <AbsoluteFill style={{background: COR.linho}}>
      <Tela>
        <defs>
          <filter id="oleo-trama">
            <feTurbulence type="turbulence" baseFrequency="0.9 0.06" numOctaves={1} seed={2} result="a" />
            <feTurbulence type="turbulence" baseFrequency="0.06 0.9" numOctaves={1} seed={3} result="b" />
            <feBlend in="a" in2="b" mode="multiply" />
            <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.28  0 0 0 0 0.18  0 0 0 0.35 0" />
          </filter>
        </defs>
        <rect width={L} height={A} filter="url(#oleo-trama)" />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'oleo',
  nome: 'Pintura a óleo',
  fundo: COR.linho,
  tinta: COR.luz,
  acento: COR.napoles,
  legenda: {
    fonte: LETRA,
    peso: 700,
    tamanho: 70,
    cor: '#fffaf0',
    destaque: COR.napoles,
    sombra: '0 0 4px #1a1420, 0 3px 0 #1a1420, 0 0 18px #1a1420, 0 0 30px #1a1420',
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

type RGB = [number, number, number];
const rgb = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mistura = (a: RGB, b: RGB, p: number): RGB => [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, a[2] + (b[2] - a[2]) * p];
const lum = (c: RGB) => (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11) / 255;
const css = (c: RGB, k = 1) => `rgb(${Math.max(0, Math.min(255, c[0] * k)) | 0},${Math.max(0, Math.min(255, c[1] * k)) | 0},${Math.max(0, Math.min(255, c[2] * k)) | 0})`;

/** Um campo: a cor da tinta no ponto (x, y), ou null quando o desenho não passa ali. */
export type Campo = (x: number, y: number) => RGB | null;

/** Empilha campos: o último que responde ganha. O primeiro deve cobrir a tela toda. */
export const empilha = (...campos: Campo[]): Campo => (x, y) => {
  for (let i = campos.length - 1; i >= 0; i--) {
    const c = campos[i](x, y);
    if (c) return c;
  }
  return null;
};

/** Degradê vertical entre várias cores (o céu, o mar). */
export const degrade = (y0: number, y1: number, cores: string[]): Campo => {
  const cs = cores.map(rgb);
  return (_x, y) => {
    const p = Math.min(1, Math.max(0, (y - y0) / (y1 - y0))) * (cs.length - 1);
    const i = Math.min(cs.length - 2, Math.floor(p));
    return mistura(cs[i], cs[i + 1], p - i);
  };
};

/** Mancha redonda com luz: clara no lado de cima à esquerda, escura no de baixo, borda macia. */
export const bola = (cx: number, cy: number, r: number, cor: string, ry = r, luz = 0.35): Campo => {
  const c = rgb(cor);
  return (x, y) => {
    const d = ((x - cx) / r) ** 2 + ((y - cy) / ry) ** 2;
    if (d > 1) return null;
    const lado = ((cx - x) / r + (cy - y) / ry) * 0.5;
    return mistura(c, lado > 0 ? rgb(COR.luz) : rgb(COR.sombra), Math.abs(lado) * luz);
  };
};

/** Do `y0` (mais `onda(x)`) pra baixo, num degradê de cores. */
export const abaixo = (y0: number, y1: number, cores: string[], onda: (x: number) => number = () => 0): Campo => {
  const g = degrade(y0, y1, cores);
  return (x, y) => (y >= y0 + onda(x) ? g(x, y) : null);
};

type Pincelada = {x: number; y: number; w: number; len: number; r: number; r2: number; atraso: number};

/**
 * O quadro: pinta o `campo` com pinceladas. Com `antes` (o campo da cena anterior) e `p` (0 a 1),
 * repinta: o quadro velho fica por baixo e as pinceladas novas cobrem, das grandes pras pequenas.
 */
export const Quadro: React.FC<{campo: Campo; antes?: Campo; p?: number}> = ({campo, antes, p = 1}) => {
  const {L, A, u} = useTela();
  const pinceladas = React.useMemo(() => {
    const lista: Pincelada[] = [];
    const passo = 42 * u;
    const cols = Math.ceil(L / passo) + 1;
    const rows = Math.ceil(A / passo) + 1;
    // primeiro a massa: pinceladas largas em grade solta, que cobrem tudo
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        const k = `${i},${j}`;
        lista.push({
          x: i * passo + (acaso(`ox${k}`) - 0.5) * passo * 0.8,
          y: j * passo + (acaso(`oy${k}`) - 0.5) * passo * 0.8,
          w: 46 * u,
          len: 78 * u,
          r: acaso(`or${k}`),
          r2: acaso(`oq${k}`),
          atraso: acaso(`od${k}`) * 0.45,
        });
      }
    // depois o detalhe: pinceladas menores, por cima
    const n = Math.round(rows * cols * 0.9);
    for (let i = 0; i < n; i++)
      lista.push({
        x: acaso(`dx${i}`) * L,
        y: acaso(`dy${i}`) * A,
        w: (15 + acaso(`dw${i}`) * 9) * u,
        len: (34 + acaso(`dl${i}`) * 26) * u,
        r: acaso(`dr${i}`),
        r2: acaso(`dq${i}`),
        atraso: 0.4 + acaso(`dd${i}`) * 0.6,
      });
    return lista;
  }, [L, A, u]);

  const pinta = (c: Campo, s: Pincelada, prog: number, k: number) => {
    const cor = c(s.x, s.y) ?? rgb(COR.linho);
    // a direção segue a forma: perpendicular à diferença de luz em volta
    const e = 8 * u;
    const gx = lum(c(s.x + e, s.y) ?? cor) - lum(c(s.x - e, s.y) ?? cor);
    const gy = lum(c(s.x, s.y + e) ?? cor) - lum(c(s.x, s.y - e) ?? cor);
    const g = Math.hypot(gx, gy);
    const ang = g > 0.015 ? Math.atan2(gx, -gy) + (s.r2 - 0.5) * 0.3 : Math.sin(s.x / (170 * u) + s.y / (260 * u)) * 0.35 + (s.r - 0.5) * 0.5;
    const m = 0.9 + s.r * 0.2;
    const ca = Math.cos(ang);
    const sa = Math.sin(ang);
    const h = s.len / 2;
    const cv = (s.r2 - 0.5) * s.w * 0.5;
    const d = `M${(s.x - ca * h).toFixed(1)},${(s.y - sa * h).toFixed(1)}Q${(s.x - sa * cv).toFixed(1)},${(s.y + ca * cv).toFixed(1)} ${(s.x + ca * h).toFixed(1)},${(s.y + sa * h).toFixed(1)}`;
    const traco = prog < 1 ? {pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - prog} : {};
    return (
      <g key={k}>
        <path d={d} stroke={css(cor, m)} strokeWidth={s.w} strokeLinecap="round" fill="none" {...traco} />
        {/* o empasto: a crista de tinta que pega a luz */}
        <path d={d} stroke={css(cor, m * 1.22)} strokeWidth={s.w * 0.22} strokeLinecap="round" fill="none" opacity={0.55} transform={`translate(${(-sa * s.w * 0.22).toFixed(1)} ${(ca * s.w * 0.22).toFixed(1)})`} {...traco} />
      </g>
    );
  };

  return (
    <AbsoluteFill>
      <Tela>
        {antes && p < 1 && pinceladas.map((s, k) => pinta(antes, s, 1, k))}
        {pinceladas.map((s, k) => {
          const prog = ramp(p, s.atraso * 0.75, s.atraso * 0.75 + 0.25, chega);
          return prog > 0 ? pinta(campo, s, prog, k + 100000) : null;
        })}
      </Tela>
    </AbsoluteFill>
  );
};

/** A repintura: o `p` do quadro novo no começo da cena (em `dur` segundos). */
export const repintura = (t: number, dur = 1.8) => ramp(t, 0, dur);

/** Texto pintado: letra clássica, cor de luz, com sombra de tinta. Surge de baixo. */
export const Assinatura: React.FC<{y: number; children: string; p: number; tamanho?: number}> = ({y, children, p, tamanho = 100}) => {
  const {L, u} = useTela();
  if (p <= 0) return null;
  return (
    <AbsoluteFill style={{opacity: Math.min(1, p * 1.5)}}>
      <Tela>
        <text
          x={L / 2}
          y={y + (1 - chega(Math.min(1, p))) * 20 * u}
          textAnchor="middle"
          fontFamily={TITULO}
          fontWeight={900}
          fontSize={tamanho * u}
          fill={COR.luz}
          stroke={COR.sombra}
          strokeWidth={10 * u}
          paintOrder="stroke"
        >
          {children}
        </text>
      </Tela>
    </AbsoluteFill>
  );
};

// ---------- 3. os desenhos: campos de cor ----------
// Forma grande, com luz de um lado e sombra do outro: o pincel faz o resto.

export const Sol = (cx: number, cy: number, r: number): Campo => {
  const nucleo = bola(cx, cy, r, COR.luz, r, 0.1);
  const halo = rgb(COR.napoles);
  return (x, y) => {
    const n = nucleo(x, y);
    if (n) return n;
    const d = Math.hypot(x - cx, y - cy) / r;
    return d < 2.2 ? mistura(halo, rgb(COR.ocre), (d - 1) / 1.2) : null;
  };
};

export const Nuvem = (cx: number, cy: number, w: number, cor: string = COR.nevoa): Campo =>
  empilha(bola(cx - w * 0.28, cy + w * 0.05, w * 0.24, cor, w * 0.17), bola(cx + w * 0.28, cy + w * 0.04, w * 0.24, cor, w * 0.17), bola(cx, cy - w * 0.06, w * 0.32, cor, w * 0.24));

/** Chuva: véus inclinados de azul-cinza que descem com `t`. */
export const Chuva = (cx: number, y0: number, largura: number, altura: number, t: number, forca = 1): Campo => {
  const c = rgb(COR.cobalto);
  return (x, y) => {
    if (y < y0 || y > y0 + altura || Math.abs(x - cx) > (largura / 2) * forca) return null;
    const faixa = Math.sin((x + (y - y0) * 0.25) / (largura * 0.035) + t * 0.5);
    const cai = Math.sin((y - y0) / (altura * 0.08) - t * 6);
    return faixa > 0.55 && cai > -0.2 ? mistura(c, rgb(COR.celeste), 0.4) : null;
  };
};

export const Mar = (y0: number, A: number, t: number, escala: number, brilho = 0, cx = 540 * escala): Campo => {
  const base = abaixo(y0, A, [COR.cobalto, COR.ultramar, COR.sombra], (x) => Math.sin(x / (110 * escala) + t * 1.4) * 18 * escala);
  return (x, y) => {
    const c = base(x, y);
    if (!c || brilho <= 0) return c;
    // o reflexo do sol: uma faixa clara no meio do mar
    const perto = Math.max(0, 1 - Math.abs(x - cx) / (160 * escala)) * Math.max(0, 1 - (y - y0) / (A * 0.25));
    return mistura(c, rgb(COR.napoles), perto * brilho * (0.6 + Math.sin(y / (14 * escala) + t * 3) * 0.4));
  };
};

export const Planta = (cx: number, chao: number, alto: number, p: number): Campo => {
  const h = alto * Math.min(1, p * 1.3);
  const caule: Campo = (x, y) => (Math.abs(x - cx) < alto * 0.04 && y <= chao && y >= chao - h ? rgb(COR.verde) : null);
  const folha = (lado: number, fh: number, abre: number): Campo =>
    abre <= 0 ? () => null : bola(cx + lado * alto * 0.2 * abre, chao - h * fh, alto * 0.2 * abre, lado > 0 ? COR.verde : COR.verdeLuz, alto * 0.11 * abre);
  return empilha(caule, folha(-1, 0.4, ramp(p, 0.3, 0.7)), folha(1, 0.65, ramp(p, 0.5, 0.85)), folha(-1, 0.92, ramp(p, 0.7, 1) * 0.8));
};

// ---------- 4. o exemplo: o ciclo da água ----------

type Montagem = (L: number, A: number, u: number, t: number) => Campo;

const M: Montagem[] = [
  // 0 título: entardecer sobre o mar
  (L, A, u, t) => empilha(degrade(0, A * 0.5, [COR.ultramar, COR.cobalto, COR.ocre]), Sol(L * 0.5, A * 0.42, 90 * u), Mar(A * 0.48, A, t, u, 0.7, L * 0.5)),
  // 1 o sol esquenta o mar
  (L, A, u, t) => empilha(degrade(0, A * 0.45, [COR.cobalto, COR.celeste, COR.napoles]), Sol(L * 0.5, A * 0.2, (120 + balanco(t, 1) * 6) * u), Mar(A * 0.42, A, t, u, 1, L * 0.5)),
  // 2 o vapor sobe e vira nuvem
  (L, A, u, t) => {
    const sobe = ramp(t, 0.6, 2.4);
    const nevoa = rgb(COR.nevoa);
    const vapor: Campo = (x, y) => {
      if (y < A * 0.24 || y > A * 0.47) return null;
      for (const fx of [0.3, 0.5, 0.7]) if (Math.abs(x - L * fx - Math.sin(y / (50 * u) + t * 2) * 26 * u) < 22 * u) return nevoa;
      return null;
    };
    return empilha(degrade(0, A * 0.48, [COR.cobalto, COR.celeste]), vapor, Nuvem(L * 0.5, A * 0.18, L * (0.38 + sobe * 0.24)), Mar(A * 0.48, A, t, u));
  },
  // 3 a nuvem pesa e vira chuva
  (L, A, u, t) =>
    empilha(
      degrade(0, A, [COR.sombra, COR.ultramar, COR.cinza]),
      Chuva(L * 0.5, A * 0.24, L * 0.75, A * 0.34, t, ramp(t, 0.4, 1.4)),
      Nuvem(L * 0.5, A * 0.17, L * 0.75, COR.cinza),
    ),
  // 4 a chuva faz a planta crescer
  (L, A, u, t) =>
    empilha(
      degrade(0, A * 0.56, [COR.cobalto, COR.celeste, COR.nevoa]),
      Nuvem(L * 0.5, A * 0.12, L * 0.5),
      Chuva(L * 0.5, A * 0.16, L * 0.4, A * 0.18, t),
      abaixo(A * 0.55, A, [COR.ocre, COR.siena, COR.sombra], (x) => Math.sin(x / (170 * u)) * 14 * u),
      Planta(L * 0.5, A * 0.56, A * 0.3, ramp(t, 0.9, 3)),
    ),
];

/** A cena `i`: o quadro dela, repintado por cima do quadro da cena anterior. */
const cena = (i: number): React.FC<PropsCena> => ({t, fala}) => {
  const {L, A, u} = useTela();
  const fimAnterior = i > 0 ? fala.frases[i].s - (i > 1 ? fala.frases[i - 1].s : 0) : 0;
  return (
    <>
      <Quadro campo={M[i](L, A, u, t)} antes={i > 0 ? M[i - 1](L, A, u, fimAnterior) : undefined} p={i === 0 ? ramp(t, -0.5, 1.2) : repintura(t)} />
      {i === 0 && <Assinatura y={A * 0.3} p={ramp(t, 1.1, 1.7)}>O ciclo da água</Assinatura>}
    </>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    semLegenda={[[0, FALA_EXEMPLO.frases[1].s]]}
    cenas={cenasPorFrase(FALA_EXEMPLO, [
      [0, 0, cena(0), 0],
      [1, 1, cena(1), 0],
      [2, 2, cena(2), 0],
      [3, 3, cena(3), 0],
      [4, 4, cena(4), 0],
    ])}
  />
);
