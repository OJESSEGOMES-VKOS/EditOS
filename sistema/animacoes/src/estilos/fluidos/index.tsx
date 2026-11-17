// ESTILO: Fumaça e água
// Tudo é fluido: fumaça que sobe enrolando, fogo que respira, água em faixas de
// luz. Nada tem contorno; as coisas surgem da névoa e voltam pra ela. Bom pra
// natureza, física, clima, química e tema contemplativo.
//
// As quatro partes, na ordem do molde:
//   1. `tema`      cores, fundo e legenda
//   2. as peças    Fluido (a tela de fumaça), as camadas, Letreiro (o texto)
//   3. os desenhos sol, nuvem, chuva, mar e planta, feitos como camadas de fluido
//   4. `Exemplo`   o ciclo da água contado neste estilo
import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {loadFont as carregarCormorant} from '@remotion/google-fonts/CormorantGaramond';
import type {PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, cenasPorFrase, chega, ramp, useTela} from '../../kit';

const {fontFamily: LETRA} = carregarCormorant('normal', {weights: ['500', '700'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As cores do estilo, em [r, g, b] de 0 a 1 (é assim que o fluido mistura). */
export const COR = {
  breu: [0.02, 0.03, 0.06],
  nevoa: [0.62, 0.68, 0.78],
  fogo: [1.0, 0.55, 0.18],
  brasa: [1.0, 0.85, 0.5],
  agua: [0.25, 0.6, 0.75],
  fundoAgua: [0.0, 0.05, 0.12],
  ceu: [0.25, 0.42, 0.62],
  nuvem: [0.88, 0.92, 0.98],
  verde: [0.2, 0.62, 0.28],
  terra: [0.24, 0.16, 0.1],
} as const satisfies Record<string, readonly [number, number, number]>;
export type CorFluido = keyof typeof COR;
type RGB = [number, number, number];

const Fundo: React.FC<{t: number}> = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #0d1422 0%, #03050a 100%)'}} />;

export const tema: Tema = {
  id: 'fluidos',
  nome: 'Fumaça e água',
  fundo: '#03050a',
  tinta: '#fbf3e4',
  acento: '#ffcf8a',
  legenda: {
    fonte: LETRA,
    peso: 700,
    tamanho: 74,
    cor: '#fbf3e4',
    destaque: '#ffcf8a',
    sombra: '0 2px 20px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.9)',
    altura: 0.74,
  },
  Fundo,
};

// ---------- 2. as peças ----------

// o ruído: a matéria-prima da fumaça (sempre igual pro mesmo ponto e tempo)
const h = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const ruido = (x: number, y: number) => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  let fx = x - ix;
  let fy = y - iy;
  fx = fx * fx * (3 - 2 * fx);
  fy = fy * fy * (3 - 2 * fy);
  const a = h(ix, iy);
  const b = h(ix + 1, iy);
  const c = h(ix, iy + 1);
  const d = h(ix + 1, iy + 1);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
};
const fbm = (x: number, y: number) => {
  let s = 0;
  let a = 0.5;
  for (let i = 0; i < 4; i++) {
    s += a * ruido(x, y);
    x = x * 2.03 + 1.7;
    y = y * 2.03 + 9.2;
    a *= 0.5;
  }
  return s;
};

/**
 * Fumaça: um valor de 0 a 1 que enrola e anda com o tempo. `vx`, `vy` é pra onde ela corre
 * (vy positivo sobe). Use em toda camada pra a borda nunca ser lisa.
 */
export const fumo = (x: number, y: number, t: number, vx = 0, vy = 0.1) => {
  const qx = fbm(x + vx * t, y - vy * t);
  const qy = fbm(x + 5.2 - vx * t * 0.7, y + 1.3 + vy * t * 0.7);
  return fbm(x + 2.6 * qx - vx * t * 0.5, y + 2.6 * qy + vy * t * 0.5);
};

const mistura = (a: RGB, b: readonly number[], k: number): RGB => {
  const q = Math.max(0, Math.min(1, k));
  return [a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q, a[2] + (b[2] - a[2]) * q];
};
const liso = (a: number, b: number, x: number) => {
  const q = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return q * q * (3 - 2 * q);
};

/**
 * Uma camada pinta por cima da cor que já está no ponto. `x` vai de 0 a 1 (esquerda pra direita), `y` de 0 a 1
 * (de cima pra baixo), `r` é a proporção da tela (largura / altura), `t` o tempo.
 */
export type Camada = (cor: RGB, x: number, y: number, t: number, r: number) => RGB;

/**
 * A tela de fluido. Pinta as `camadas` em ordem, ponto a ponto, numa grade baixa que o navegador amacia:
 * por isso tudo sai macio, sem contorno. `apaga` de 0 a 1 devolve tudo à névoa (a transição do estilo).
 */
export const Fluido: React.FC<{camadas: Camada[]; t: number; apaga?: number}> = ({camadas, t, apaga = 0}) => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const {width: L, height: A} = useVideoConfig();
  const passo = 9;
  const gw = Math.ceil(L / passo);
  const gh = Math.ceil(A / passo);
  React.useLayoutEffect(() => {
    const c = ref.current!.getContext('2d')!;
    const img = c.createImageData(gw, gh);
    const r = L / A;
    const ap = chega(Math.max(0, Math.min(1, apaga)));
    for (let j = 0; j < gh; j++) {
      const y = j / gh;
      for (let i = 0; i < gw; i++) {
        const x = i / gw;
        let cor: RGB = [COR.breu[0], COR.breu[1], COR.breu[2]];
        for (const cam of camadas) cor = cam(cor, x, y, t, r);
        if (ap > 0) {
          const n = fumo(x * 2 * r, y * 2, t, 0, 0.15);
          cor = mistura(cor, [0.05 + n * 0.12, 0.06 + n * 0.13, 0.09 + n * 0.16], ap * (0.7 + n * 0.6));
        }
        // vinheta e um tom final suave
        const vx = (x - 0.5) * 1.4;
        const vy = y - 0.45;
        const v = 1 - 0.45 * (vx * vx + vy * vy);
        const k = (i + j * gw) * 4;
        for (let q = 0; q < 3; q++) {
          const z = cor[q] * v;
          img.data[k + q] = Math.round(255 * Math.pow(z / (1 + z * 0.25), 0.92));
        }
        img.data[k + 3] = 255;
      }
    }
    c.putImageData(img, 0, 0);
  });
  return <canvas ref={ref} width={gw} height={gh} style={{position: 'absolute', inset: 0, width: L, height: A}} />;
};

// as camadas de base

/** Névoa escura que se mexe devagar: o chão de toda cena. `cor` puxa o tom. */
export const nevoa = (forca = 1, cor: CorFluido = 'nevoa'): Camada => (c, x, y, t, r) => {
  const s = fumo(x * 1.6 * r, y * 1.6, t, 0.02, 0.06);
  return mistura(c, COR[cor], s * s * 0.28 * forca);
};

/** Céu de névoa clara do topo até `ate` (0 a 1 da altura). */
export const ceu = (ate: number, forca = 1): Camada => (c, x, y, t, r) => {
  if (y > ate + 0.05) return c;
  const s = fumo(x * 1.2 * r, y * 2.2, t, 0.1, 0.02);
  const k = (0.55 + 0.45 * (1 - y / ate)) * liso(ate + 0.05, ate - 0.05, y) * forca;
  return mistura(c, mistura([COR.ceu[0], COR.ceu[1], COR.ceu[2]], COR.nuvem, s * s * 1.2), k * 0.8);
};

/** Texto do estilo: letra serifada clara que sobe da névoa. `y` é a altura do centro. */
export const Letreiro: React.FC<{y: number; children: string; p: number; some?: number; tamanho?: number; cor?: string}> = ({
  y,
  children,
  p,
  some = 0,
  tamanho = 120,
  cor = '#fbf3e4',
}) => {
  const {u} = useTela();
  const v = Math.min(chega(Math.max(0, Math.min(1, p))), 1 - some);
  if (v <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: y - tamanho * u * 0.6 + (1 - v) * 40 * u,
        textAlign: 'center',
        fontFamily: LETRA,
        fontWeight: 700,
        fontSize: tamanho * u,
        lineHeight: 1.05,
        color: cor,
        opacity: v,
        filter: `blur(${(1 - v) * 14 * u}px)`,
        textShadow: `0 2px ${30 * u}px rgba(0,0,0,0.85)`,
      }}
    >
      {children}
    </div>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Cada desenho é uma camada: diz quanto de cada cor entra em cada ponto, sempre com `fumo` na borda.
// Posições em fração da tela (x e y de 0 a 1); tamanhos em fração da altura.

/** Sol de fogo: núcleo claro com borda que lambe. `forca` de 0 a 1 acende. */
export const Sol = (cx: number, cy: number, raio: number, forca = 1): Camada => (c, x, y, t, r) => {
  const dx = (x - cx) * r;
  const dy = y - cy;
  const d = Math.sqrt(dx * dx + dy * dy);
  const f = fumo(dx * 9, dy * 9, t, 0, 0.5);
  const borda = liso(raio * (1.25 + f * 0.6), raio * 0.7, d);
  let k = mistura(c, COR.fogo, borda * 1.2 * forca);
  k = mistura(k, COR.brasa, liso(raio * 0.85, 0, d) * forca);
  const halo = (0.012 / (d * d + 0.012)) * 0.35 * forca;
  return [k[0] + halo, k[1] + halo * 0.6, k[2] + halo * 0.25];
};

/** Nuvem de fumaça clara em volta de (cx, cy), com raios rx e ry. `cor` muda o tom (nuvem de chuva: 'ceu'). */
export const Nuvem = (cx: number, cy: number, rx: number, ry: number, forca = 1, cor: CorFluido = 'nuvem'): Camada => (c, x, y, t, r) => {
  const dx = ((x - cx) * r) / rx;
  const dy = (y - cy) / ry;
  const d = dx * dx + dy * dy;
  if (d > 2.4) return c;
  const s = fumo(x * 3 * r, y * 3, t, 0.12, 0.05);
  const dens = liso(1.25, 0.2, d + (0.5 - s) * 2.4) * forca;
  return mistura(mistura(c, COR[cor], dens), [1, 1, 1], dens * s * s * 0.5);
};

/** Chuva: riscos de luz azul caindo entre x0 e x1, de y0 até y1. */
export const Chuva = (x0: number, x1: number, y0: number, y1: number, forca = 1): Camada => (c, x, y, t, r) => {
  if (x < x0 || x > x1 || y < y0 || y > y1) return c;
  const col = Math.floor(x * 90 * r);
  const fase = h(col, 7);
  const v = (y * 2.6 - t * (2.4 + fase) + fase * 10) % 1;
  const risco = fase > 1 - 0.55 * forca ? liso(0.55, 0.97, (v + 1) % 1) : 0;
  const borda = liso(y0, y0 + 0.04, y) * liso(y1, y1 - 0.06, y) * liso(x0, x0 + 0.05, x) * liso(x1, x1 - 0.05, x);
  return mistura(c, [0.7, 0.88, 1], risco * borda * 0.9);
};

/** Mar: faixas de água com reflexo, da linha `nivel` pra baixo. */
export const Mar = (nivel: number, calor = 0): Camada => (c, x, y, t, r) => {
  const lim = nivel + 0.006 * Math.sin(x * 14 + t * 1.2);
  if (y < lim - 0.01) return c;
  const fundo = Math.max(0, y - lim);
  const s = fumo(x * 2.2 * r + t * 0.25, y * 7, t, 0.35, 0);
  const faixa = Math.pow(Math.abs(Math.sin(y * 90 + s * 9)), 18);
  let k = mistura([COR.agua[0] * 0.5, COR.agua[1] * 0.5, COR.agua[2] * 0.5], COR.fundoAgua, fundo * 7);
  k = [k[0] + COR.agua[0] * s * s * 0.6, k[1] + COR.agua[1] * s * s * 0.6, k[2] + COR.agua[2] * s * s * 0.6];
  k = mistura(k, [0.7, 0.9, 1], faixa * 0.25 * (1 - Math.min(1, fundo * 8)));
  // o brilho na linha d'água, e o calor que pode avermelhar a superfície
  const linha = Math.exp(-Math.abs(y - lim) * 160) * 0.6;
  k = mistura(k, COR.fogo, calor * Math.exp(-fundo * 25) * 0.35);
  return mistura(mistura(c, k, liso(lim - 0.01, lim + 0.004, y)), [1, 1, 1], linha);
};

/** Vapor: fios de fumaça subindo de `de` até `ate` (alturas), na faixa x0..x1. */
export const Vapor = (x0: number, x1: number, de: number, ate: number, forca = 1): Camada => (c, x, y, t, r) => {
  if (y > de || y < ate || x < x0 || x > x1) return c;
  const s = fumo(x * 11 * r, y * 3, t, 0, 0.45);
  const fio = liso(0.42, 0.68, s) * liso(de, de - 0.06, y) * liso(ate, ate + 0.1, y) * liso(x0, x0 + 0.08, x) * liso(x1, x1 - 0.08, x);
  return mistura(c, COR.nuvem, fio * 0.55 * forca);
};

/** Chão de terra a partir de `nivel` pra baixo. */
export const Chao = (nivel: number): Camada => (c, x, y, t, r) => {
  const lim = nivel + 0.01 * fbm(x * 6 * r, 1);
  if (y < lim - 0.005) return c;
  return mistura(c, mistura([COR.terra[0], COR.terra[1], COR.terra[2]], [0.08, 0.05, 0.03], fbm(x * 20 * r, y * 20)), liso(lim - 0.005, lim + 0.005, y));
};

/** Planta de fumaça verde: o caule sobe de (cx, base) e as folhas abrem com `cresce` de 0 a 1. */
export const Planta = (cx: number, base: number, alto: number, cresce: number): Camada => (c, x, y, t, r) => {
  if (cresce <= 0) return c;
  const a = alto * chega(Math.min(1, cresce / 0.7));
  const topo = base - a;
  if (y > base || y < topo - alto * 0.25) return c;
  const venta = Math.sin(t * 1.2) * 0.012 * ((base - y) / alto);
  const s = fumo(x * 14 * r, y * 14, t, 0, 0.3);
  const dx = (x - cx - venta) * r;
  let dens = y > topo ? liso(0.008 + s * 0.016, 0.002, Math.abs(dx)) : 0;
  const folha = (lado: number, altura: number, ini: number) => {
    const ab = chega(Math.max(0, Math.min(1, (cresce - ini) / 0.3)));
    if (ab <= 0) return 0;
    const fx = cx + venta + lado * alto * 0.13 * ab / r;
    const fy = base - a * altura - alto * 0.04 * ab;
    const ex = ((x - fx) * r) / (alto * 0.14 * ab + 1e-4);
    const ey = (y - fy + (x - fx) * lado * r * 0.5) / (alto * 0.055 * ab + 1e-4);
    return liso(1.1, 0.4, ex * ex + ey * ey + (0.5 - s) * 1.6);
  };
  dens = Math.max(dens, folha(-1, 0.45, 0.3), folha(1, 0.72, 0.45), folha(-1, 1, 0.6));
  // um brilho verde em volta, como fumaça que escapa
  const halo = liso(0.14, 0, Math.abs(dx)) ** 2 * s * 0.3 * liso(topo - alto * 0.15, topo + alto * 0.1, y);
  const k = mistura(c, [0.25, 0.7, 0.35], halo);
  return mistura(k, mistura([COR.verde[0], COR.verde[1], COR.verde[2]], [0.55, 0.85, 0.4], s * s), dens);
};

// ---------- 4. o exemplo: o ciclo da água ----------

const some = (t: number, dur: number) => ramp(t, dur - 0.6, dur);

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {A} = useTela();
  return (
    <>
      <Fluido t={t} apaga={some(t, dur) * 0.6} camadas={[nevoa(1.6), Mar(0.58), Vapor(0.15, 0.85, 0.58, 0.3, ramp(t, 0, 1))]} />
      <Letreiro y={A * 0.3} p={ramp(t, 0, 0.9)} some={some(t, dur)} tamanho={72} cor="#ffcf8a">
        O ciclo
      </Letreiro>
      <Letreiro y={A * 0.38} p={ramp(t, 0.3, 1.2)} some={some(t, dur)} tamanho={150}>
        da água
      </Letreiro>
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => (
  <Fluido
    t={t}
    apaga={some(t, dur) * 0.5}
    camadas={[nevoa(1, 'fogo'), Sol(0.64, 0.22, 0.09, ramp(t, 0, 1.2)), Mar(0.47, ramp(t, 0.8, 2.4))]}
  />
);

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => (
  <Fluido
    t={t}
    apaga={some(t, dur) * 0.5}
    camadas={[nevoa(1.2), Mar(0.5), Vapor(0.2, 0.8, 0.5, 0.22, ramp(t, 0, 0.8)), Nuvem(0.5, 0.22, 0.2 + ramp(t, 0.6, dur) * 0.1, 0.07 + ramp(t, 0.6, dur) * 0.03, ramp(t, 0.4, 1.8))]}
  />
);

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => (
  <Fluido
    t={t}
    apaga={some(t, dur) * 0.5}
    camadas={[nevoa(1, 'ceu'), Nuvem(0.5, 0.2, 0.32, 0.1, 1, t > 0.6 ? 'ceu' : 'nuvem'), Chuva(0.22, 0.78, 0.25, 0.58, ramp(t, 0.4, 1.6))]}
  />
);

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => (
  <Fluido
    t={t}
    camadas={[nevoa(1, 'ceu'), Nuvem(0.5, 0.16, 0.3, 0.09, 1, 'ceu'), Chuva(0.26, 0.74, 0.21, 0.6), Chao(0.6), Planta(0.5, 0.6, 0.26, ramp(t, 0.4, 2.8))]}
  />
);

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, que já sobe da névoa: sem legenda nesse trecho
    semLegenda={[[0, FALA_EXEMPLO.frases[1].s]]}
    cenas={cenasPorFrase(FALA_EXEMPLO, [
      [0, 0, Titulo, 0],
      [1, 1, SolEMar, 0.6],
      [2, 2, VaporENuvem, 0.6],
      [3, 3, NuvemEChuva, 0.6],
      [4, 4, ChuvaEPlanta, 0.6],
    ])}
  />
);
