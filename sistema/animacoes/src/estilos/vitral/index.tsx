// ESTILO: Vitral
// A tela inteira é um painel de vidro com chumbo: cacos escuros e foscos, e a luz
// atravessando em feixes com poeira. Cada coisa da cena é um trecho do painel que
// ACENDE caco por caco, na cor dela. Texto é vidro colorido contornado de chumbo.
//
//   1. `tema`      cores, fundo (o painel apagado) e legenda
//   2. as peças    Vidro (área acesa), Caco (peça solta), Letreiro (texto), Clarao (transição)
//   3. os desenhos Sol, Nuvem, Chuva, Mar, Planta
//   4. `Exemplo`   o ciclo da água contado em vidro
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarCinzelDeco} from '@remotion/google-fonts/CinzelDecorative';
import {loadFont as carregarMarcellus} from '@remotion/google-fonts/Marcellus';
import type {Ponto, PropsCena} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, caminho, cenasPorFrase, chega, circulo, ramp, useTela} from '../../kit';
import type {Tema} from '../../kit';

const {fontFamily: TITULO} = carregarCinzelDeco('normal', {weights: ['700'], subsets: ['latin', 'latin-ext']});
const {fontFamily: LETRA} = carregarMarcellus('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As cores de vidro: saturadas, de joia. O chumbo é quase preto. */
export const COR = {
  rubi: '#d8283a',
  ambar: '#f2a81c',
  ouro: '#ffd75e',
  esmeralda: '#1f9e5a',
  folha: '#7cc443',
  safira: '#1f4fd0',
  celeste: '#5fb8ee',
  ametista: '#7a3cc8',
  opala: '#eef3f6',
} as const;
export type CorVidro = keyof typeof COR;
const CHUMBO = '#120e0b';

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
/** A cor de um caco: a cor base com brilho `k` e um desvio próprio, pra cada vidro sair um pouco diferente. */
const tom = (hex: string, k: number, semente: string) => {
  const d = (acaso(semente) - 0.5) * 50;
  const [r, g, b] = rgb(hex).map((c, i) => Math.max(0, Math.min(255, (c + d * (i === 1 ? 0.6 : 1)) * k)));
  return `rgb(${r | 0},${g | 0},${b | 0})`;
};

// O painel: uma malha de cacos (Voronoi) que cobre a tela, calculada uma vez.
type CacoMalha = {d: string; cx: number; cy: number; r: number};
const corta = (poly: Ponto[], a: number, b: number, c: number): Ponto[] => {
  const out: Ponto[] = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const dp = a * p[0] + b * p[1] - c;
    const dq = a * q[0] + b * q[1] - c;
    if (dp <= 0) out.push(p);
    if (dp * dq < 0) {
      const k = dp / (dp - dq);
      out.push([p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]);
    }
  }
  return out;
};
const malhas = new Map<string, CacoMalha[]>();
const malha = (L: number, A: number, u: number) => {
  const chave = `${L}x${A}`;
  if (malhas.has(chave)) return malhas.get(chave)!;
  const g = 66 * u;
  const sem: Ponto[] = [];
  for (let y = -g / 2; y < A + g; y += g)
    for (let x = -g / 2; x < L + g; x += g) sem.push([x + acaso(`vx${x}${y}`) * g * 0.8, y + acaso(`vy${x}${y}`) * g * 0.8]);
  const caixa: Ponto[] = [[-g, -g], [L + g, -g], [L + g, A + g], [-g, A + g]];
  const lista = sem.map((p, i) => {
    let poly = caixa;
    sem.forEach((q, j) => {
      if (i === j || Math.abs(q[0] - p[0]) > g * 2.5 || Math.abs(q[1] - p[1]) > g * 2.5) return;
      poly = corta(poly, q[0] - p[0], q[1] - p[1], (q[0] ** 2 + q[1] ** 2 - p[0] ** 2 - p[1] ** 2) / 2);
    });
    return {d: caminho(poly, true, true), cx: p[0], cy: p[1], r: acaso(`c${i}`)};
  });
  malhas.set(chave, lista);
  return lista;
};
const ESCURO = ['#3a2a6a', '#1d3a6e', '#4a2030', '#24443a', '#5a4220'];

/** O painel apagado: cacos foscos, a luz passeando por trás, chumbo e feixes de luz com poeira. */
const Fundo: React.FC<{t: number}> = ({t}) => {
  const {L, A, u} = useTela();
  const cel = malha(L, A, u);
  const lx = L * (0.5 + Math.sin(t * 0.35) * 0.3);
  const ly = A * (0.35 + Math.cos(t * 0.27) * 0.15);
  return (
    <AbsoluteFill style={{background: CHUMBO}}>
      <Tela>
        <defs>
          <filter id="vitral-grao" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={3} seed={4} />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.3 0" />
          </filter>
          <linearGradient id="vitral-feixe" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff1c7" stopOpacity="0.2" />
            <stop offset="1" stopColor="#fff1c7" stopOpacity="0" />
          </linearGradient>
        </defs>
        {cel.map((c, i) => {
          const luz = 0.3 + 0.32 * Math.exp(-((c.cx - lx) ** 2 + (c.cy - ly) ** 2) / (420 * u) ** 2);
          return <path key={i} d={c.d} fill={tom(ESCURO[Math.floor(c.r * ESCURO.length)], luz * 1.6, `f${i}`)} stroke={CHUMBO} strokeWidth={8 * u} strokeLinejoin="round" />;
        })}
        <rect width={L} height={A} filter="url(#vitral-grao)" style={{mixBlendMode: 'overlay'}} />
        <g style={{mixBlendMode: 'screen'}} opacity={0.55 + 0.2 * Math.sin(t * 1.3)}>
          {[0, 1, 2].map((i) => {
            const x0 = L * (0.2 + i * 0.3) + Math.sin(t * 0.4 + i) * 40 * u;
            return <path key={i} d={`M${x0 - 50 * u},0 L${x0 + 60 * u},0 L${x0 - 240 * u},${A} L${x0 - 520 * u},${A} Z`} fill="url(#vitral-feixe)" />;
          })}
          {Array.from({length: 36}, (_, i) => {
            const x = (acaso(`px${i}`) * L + t * (12 + acaso(`pv${i}`) * 20) * u) % L;
            const y = (acaso(`py${i}`) * A + t * 25 * u) % A;
            return <circle key={i} cx={x} cy={y} r={(1.5 + acaso(`pr${i}`) * 2.5) * u} fill="#fff6d8" opacity={0.25 + 0.4 * Math.sin(t * 2 + i) ** 2} />;
          })}
        </g>
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'vitral',
  nome: 'Vitral',
  fundo: CHUMBO,
  tinta: COR.opala,
  acento: COR.ouro,
  legenda: {
    fonte: LETRA,
    peso: 400,
    tamanho: 66,
    cor: '#fbf3df',
    destaque: COR.ouro,
    sombra: '0 0 4px #000, 0 3px 0 #120e0b, 0 0 22px #120e0b, 0 0 10px #120e0b',
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/**
 * Um trecho do painel que acende na cor dada: os cacos da malha que caem dentro das `formas`
 * (uma ou mais listas de pontos, somadas) ganham cor, do centro pra fora, conforme `p` vai de 0 a 1.
 */
export const Vidro: React.FC<{formas: Ponto[][]; cor: CorVidro; p: number; id: string; brilho?: number}> = ({formas, cor, p, id, brilho = 1}) => {
  const {L, A, u} = useTela();
  if (p <= 0) return null;
  const pts = formas.flat();
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const [mx, my] = [(x0 + x1) / 2, (y0 + y1) / 2];
  const raio = Math.hypot(x1 - x0, y1 - y0) / 2 + 1;
  const g = 70 * u;
  const d = formas.map((f) => caminho(f, true, true)).join(' ');
  const cel = malha(L, A, u).filter((c) => c.cx > x0 - g && c.cx < x1 + g && c.cy > y0 - g && c.cy < y1 + g);
  return (
    <g>
      <clipPath id={`vitral-${id}`}>
        <path d={d} />
      </clipPath>
      <g clipPath={`url(#vitral-${id})`}>
        {cel.map((c, i) => {
          const ordem = (Math.hypot(c.cx - mx, c.cy - my) / raio) * 0.75 + c.r * 0.25;
          const q = ramp(p, ordem * 0.7, ordem * 0.7 + 0.3);
          if (q <= 0) return null;
          const flash = 1 + 0.8 * (1 - q) * (q > 0 ? 1 : 0);
          return <path key={i} d={c.d} fill={tom(COR[cor], (0.82 + c.r * 0.3) * brilho * flash, `${id}${i}`)} opacity={q} stroke={CHUMBO} strokeWidth={7 * u} />;
        })}
      </g>
      <path d={d} fill="none" stroke={CHUMBO} strokeWidth={11 * u} strokeLinejoin="round" opacity={ramp(p, 0, 0.3)} />
    </g>
  );
};

/** Uma peça de vidro solta (gota, folha, caule): a forma inteira num caco só, com chumbo e reflexo. */
export const Caco: React.FC<{pontos: Ponto[]; cor: CorVidro; o?: number; reto?: boolean}> = ({pontos, cor, o = 1, reto = false}) => {
  const {u} = useTela();
  if (o <= 0) return null;
  const d = caminho(pontos, true, reto);
  return (
    <g opacity={o}>
      <path d={d} fill={COR[cor]} stroke={CHUMBO} strokeWidth={8 * u} strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={3 * u} transform={`translate(${-3 * u} ${-3 * u})`} />
    </g>
  );
};

/** Texto em vidro: letras coloridas contornadas de chumbo, que acendem uma a uma com `p`. */
export const Letreiro: React.FC<{x: number; y: number; children: string; p: number; tamanho?: number; cor?: CorVidro; titulo?: boolean}> = ({
  x,
  y,
  children,
  p,
  tamanho = 110,
  cor = 'ouro',
  titulo = true,
}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const letras = [...children];
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontFamily={titulo ? TITULO : LETRA}
      fontWeight={titulo ? 700 : 400}
      fontSize={tamanho * u}
      stroke={CHUMBO}
      strokeWidth={9 * u}
      strokeLinejoin="round"
      paintOrder="stroke"
      style={{filter: `drop-shadow(0 0 ${14 * u}px ${COR[cor]}88)`}}
    >
      {letras.map((l, i) => {
        const q = ramp(p, (i / letras.length) * 0.7, (i / letras.length) * 0.7 + 0.3);
        return (
          <tspan key={i} fill={q > 0.5 ? COR[cor] : '#3a3040'} fillOpacity={0.4 + q * 0.6}>
            {l}
          </tspan>
        );
      })}
    </text>
  );
};

/**
 * A transição do estilo: um clarão de sol atravessa o vidro na diagonal.
 * Ponha no começo da cena, por cima de tudo, com `p` de 0 a 1 no primeiro meio segundo.
 */
export const Clarao: React.FC<{p: number}> = ({p}) => {
  const {L, A} = useTela();
  if (p <= 0 || p >= 1) return null;
  const x = -L + p * L * 3;
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
      <Tela>
        <defs>
          <linearGradient id="vitral-clarao" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff2c8" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff2c8" stopOpacity="0.85" />
            <stop offset="1" stopColor="#fff2c8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x={x} y={-A * 0.2} width={L * 0.9} height={A * 1.4} fill="url(#vitral-clarao)" transform={`rotate(-18 ${L / 2} ${A / 2})`} />
      </Tela>
    </AbsoluteFill>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Área grande = Vidro (acende caco por caco); peça pequena ou que anda = Caco.

type Desenho = {x: number; y: number; tam?: number; p: number; t?: number};

export const Sol: React.FC<Desenho> = ({x, y, tam = 170, p, t = 0}) => {
  const raios = Array.from({length: 12}, (_, i) => {
    const a = (i / 12) * Math.PI * 2 + t * 0.15;
    const r1 = tam * (1.45 + 0.08 * balanco(t, 1.2, i));
    return [
      [x + Math.cos(a - 0.12) * tam * 1.05, y + Math.sin(a - 0.12) * tam * 1.05],
      [x + Math.cos(a) * r1, y + Math.sin(a) * r1],
      [x + Math.cos(a + 0.12) * tam * 1.05, y + Math.sin(a + 0.12) * tam * 1.05],
    ] as Ponto[];
  });
  return (
    <>
      <Vidro id="sol-raios" formas={raios} cor="ambar" p={ramp(p, 0.4, 1)} />
      <Vidro id="sol" formas={[circulo(x, y, tam, tam, 24)]} cor="ouro" p={ramp(p, 0, 0.7)} brilho={1.1 + 0.1 * Math.sin(t * 3)} />
    </>
  );
};

export const Nuvem: React.FC<Desenho & {cor?: CorVidro}> = ({x, y, tam = 360, p, cor = 'opala'}) => (
  <Vidro
    id={`nuvem-${Math.round(x)}`}
    cor={cor}
    p={p}
    formas={[
      circulo(x - tam * 0.28, y + tam * 0.05, tam * 0.24, tam * 0.2, 18),
      circulo(x, y - tam * 0.06, tam * 0.3, tam * 0.27, 18),
      circulo(x + tam * 0.3, y + tam * 0.06, tam * 0.22, tam * 0.18, 18),
      [[x - tam * 0.5, y + tam * 0.1], [x + tam * 0.5, y + tam * 0.1], [x + tam * 0.5, y + tam * 0.24], [x - tam * 0.5, y + tam * 0.24]],
    ]}
  />
);

/** Gotas de vidro azul caindo sem parar entre `y` e `y + altura`. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; pingos?: number}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  pingos = 14,
}) => {
  const {u} = useTela();
  return (
    <>
      {Array.from({length: pingos}, (_, i) => {
        if (i / pingos >= forca) return null;
        const fase = (t * (0.8 + acaso(`cv${i}`) * 0.4) + acaso(`cf${i}`)) % 1;
        const px = x - largura / 2 + acaso(`cx${i}`) * largura;
        const py = y + fase * altura;
        const r = 16 * u;
        return <Caco key={i} cor="celeste" o={1 - fase * 0.4} pontos={[[px, py - r * 2.6], [px + r, py], [px, py + r * 0.9], [px - r, py]]} />;
      })}
    </>
  );
};

/** O mar: uma faixa de vidro azul com a crista ondulando. */
export const Mar: React.FC<{y: number; p: number; t: number; fundo?: number}> = ({y, p, t, fundo}) => {
  const {L, A, u} = useTela();
  const base = fundo ?? A * 0.6;
  const n = 14;
  const crista: Ponto[] = Array.from({length: n}, (_, i) => [(-0.05 + (1.1 * i) / (n - 1)) * L, y + Math.sin(i * 1.3 + t * 1.8) * 20 * u]);
  return (
    <>
      <Vidro id="mar" cor="safira" p={p} formas={[[...crista, [L * 1.05, base], [-L * 0.05, base]]]} />
      <Vidro id="mar-luz" cor="celeste" p={ramp(p, 0.3, 1)} formas={[[...crista, ...crista.slice().reverse().map(([a, b]) => [a, b + 46 * u] as Ponto)]]} />
    </>
  );
};

/** Uma planta que cresce: caule e folhas de vidro verde, `p` de 0 a 1. */
export const Planta: React.FC<Desenho> = ({x, y, tam = 360, p, t = 0}) => {
  const {u} = useTela();
  const alto = tam * ramp(p, 0, 0.7, chega);
  const venta = balanco(t, 0.8) * tam * 0.03;
  const folha = (lado: 1 | -1, h: number, abre: number): Ponto[] => {
    const bx = x + venta * h;
    const by = y - alto * h;
    const c = tam * 0.34 * abre;
    return [[bx, by], [bx + lado * c * 0.45, by - c * 0.5], [bx + lado * c, by - c * 0.35], [bx + lado * c * 0.6, by + c * 0.05]];
  };
  return (
    <>
      <Caco o={p > 0 ? 1 : 0} cor="esmeralda" pontos={[[x - 9 * u, y], [x + venta - 6 * u, y - alto], [x + venta + 6 * u, y - alto], [x + 9 * u, y]]} reto />
      <Caco o={ramp(p, 0.3, 0.4)} cor="folha" pontos={folha(-1, 0.4, ramp(p, 0.3, 0.75, chega))} />
      <Caco o={ramp(p, 0.45, 0.55)} cor="folha" pontos={folha(1, 0.68, ramp(p, 0.45, 0.9, chega))} />
      <Caco o={ramp(p, 0.6, 0.7)} cor="esmeralda" pontos={folha(-1, 0.98, ramp(p, 0.6, 1, chega) * 0.7)} />
    </>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t}) => {
  const {L, A} = useTela();
  return (
    <Tela>
      <Vidro id="titulo-gota" cor="celeste" p={ramp(t, 0, 1.2)} formas={[[[L / 2, A * 0.1], [L * 0.62, A * 0.2], [L / 2, A * 0.25], [L * 0.38, A * 0.2]]]} />
      <Letreiro x={L / 2} y={A * 0.37} p={ramp(t, 0.1, 1)} tamanho={118}>
        O ciclo
      </Letreiro>
      <Letreiro x={L / 2} y={A * 0.46} p={ramp(t, 0.5, 1.4)} tamanho={118} cor="celeste">
        da água
      </Letreiro>
    </Tela>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A} = useTela();
  const quente = ramp(t, 0.8, dur);
  return (
    <>
      <Tela>
        <Sol x={L * 0.62} y={A * 0.2} tam={140 * (L / 1080)} p={ramp(t, 0, 1.1)} t={t} />
        <Mar y={A * 0.44} p={ramp(t, 0.3, 1.3)} t={t} />
        {/* o mar esquenta: o vidro de cima vira âmbar */}
        <Vidro id="mar-quente" cor="ambar" p={quente} brilho={0.9} formas={[[[0, A * 0.47], [L, A * 0.47], [L, A * 0.52], [0, A * 0.52]]]} />
      </Tela>
      <Clarao p={ramp(t, 0, 0.6)} />
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Mar y={A * 0.5} p={1} t={t} />
        {[0, 1, 2, 3, 4].map((i) => {
          const fase = (t * 0.5 + i / 5) % 1;
          const x = L * (0.28 + i * 0.11) + Math.sin(t * 2 + i) * 18 * u;
          const y = A * 0.48 - fase * A * 0.22;
          return <Caco key={i} cor="opala" o={Math.sin(fase * Math.PI) * 0.9} pontos={circulo(x, y, 22 * u, 30 * u, 8)} />;
        })}
        <Nuvem x={L / 2} y={A * 0.2} tam={(360 + ramp(t, 0.8, dur) * 160) * u} p={ramp(t, 0.6, 1.8)} />
      </Tela>
      <Clarao p={ramp(t, 0, 0.6)} />
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const pesa = ramp(t, 0.2, 1.2);
  return (
    <>
      <Tela>
        <Nuvem x={L / 2} y={A * 0.2 + pesa * 30 * u} tam={540 * u} p={1} cor={pesa > 0.5 ? 'safira' : 'opala'} />
        <Chuva x={L / 2} y={A * 0.3} largura={460 * u} altura={A * 0.28} t={t} forca={ramp(t, 0.6, 1.8)} />
      </Tela>
      <Clarao p={ramp(t, 0, 0.6)} />
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Nuvem x={L / 2} y={A * 0.15} tam={460 * u} p={1} cor="safira" />
        <Chuva x={L / 2} y={A * 0.22} largura={380 * u} altura={A * 0.3} t={t} pingos={10} />
        <Vidro id="terra" cor="ambar" brilho={0.55} p={ramp(t, 0, 0.8)} formas={[[[L * 0.12, A * 0.57], [L * 0.88, A * 0.57], [L * 0.88, A * 0.6], [L * 0.12, A * 0.6]]]} />
        <Planta x={L / 2} y={A * 0.57} tam={330 * u} p={ramp(t, 0.5, 2.6)} t={t} />
      </Tela>
      <Clarao p={ramp(t, 0, 0.6)} />
    </>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, que já está escrito no vidro: sem legenda nesse trecho
    semLegenda={[[0, FALA_EXEMPLO.frases[1].s]]}
    cenas={cenasPorFrase(FALA_EXEMPLO, [
      [0, 0, Titulo, 0],
      [1, 1, SolEMar, 0.3],
      [2, 2, VaporENuvem, 0.3],
      [3, 3, NuvemEChuva, 0.3],
      [4, 4, ChuvaEPlanta, 0.3],
    ])}
  />
);
