// ESTILO: Retícula de gráfica
// Tudo vira pontinhos de quatro tintas (ciano, magenta, amarelo e preto), em
// quatro ângulos, sobre papel, como uma página impressa vista de perto. A cena
// chega numa onda de pressão que engorda os pontos. Bom pra notícia, curiosidade,
// explicação com cara de revista e tom pop.
//
// As quatro partes, na ordem do molde:
//   1. `tema`      cores, fundo (o papel) e legenda
//   2. as peças    Reticula (a impressão), os pintores, Impresso (o texto)
//   3. os desenhos Sol, Nuvem, Chuva, Mar e Planta, como pintores
//   4. `Exemplo`   o ciclo da água contado neste estilo
import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {loadFont as carregarGrotesk} from '@remotion/google-fonts/SpaceGrotesk';
import {loadFont as carregarMono} from '@remotion/google-fonts/SpaceMono';
import type {PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, cenasPorFrase, chega, ramp, useTela} from '../../kit';

const {fontFamily: GROTESK} = carregarGrotesk('normal', {weights: ['700'], subsets: ['latin', 'latin-ext']});
const {fontFamily: MONO} = carregarMono('normal', {weights: ['700'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As quatro tintas da gráfica e o papel. */
export const TINTA = {
  ciano: '#00a3e0',
  magenta: '#e5007d',
  amarelo: '#ffe100',
  preto: '#151515',
  papel: '#f3ecdc',
} as const;

/** O papel: creme com fibra, marcas de registro nos cantos e a barra de cor no topo. */
const Fundo: React.FC<{t: number}> = () => {
  const {L, A, u} = useTela();
  const m = (x: number, y: number, k: number) => (
    <g key={k} stroke={TINTA.preto} strokeWidth={2 * u} fill="none">
      <circle cx={x} cy={y} r={16 * u} />
      <line x1={x - 26 * u} y1={y} x2={x + 26 * u} y2={y} />
      <line x1={x} y1={y - 26 * u} x2={x} y2={y + 26 * u} />
    </g>
  );
  return (
    <AbsoluteFill style={{background: TINTA.papel}}>
      <Tela>
        <filter id="pontos-fibra">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={3} />
          <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.5  0 0 0 0 0.42  0 0 0 0.16 0" />
        </filter>
        <rect width={L} height={A} filter="url(#pontos-fibra)" />
        {m(L * 0.05, A * 0.035, 0)}
        {m(L * 0.95, A * 0.035, 1)}
        {m(L * 0.05, A * 0.6, 2)}
        {m(L * 0.95, A * 0.6, 3)}
        {[TINTA.ciano, TINTA.magenta, TINTA.amarelo, TINTA.preto].map((c, i) => (
          <rect key={i} x={L / 2 - 160 * u + i * 80 * u} y={A * 0.035 - 12 * u} width={64 * u} height={24 * u} fill={c} />
        ))}
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'pontos',
  nome: 'Retícula de gráfica',
  fundo: TINTA.papel,
  tinta: TINTA.preto,
  acento: TINTA.magenta,
  legenda: {
    fonte: GROTESK,
    peso: 700,
    tamanho: 66,
    cor: TINTA.preto,
    destaque: TINTA.magenta,
    sombra: `0 0 10px ${TINTA.papel}, 0 0 5px ${TINTA.papel}, 0 0 2px ${TINTA.papel}, 0 0 2px ${TINTA.papel}`,
    altura: 0.73,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/**
 * Um pintor desenha a cena em cores normais numa tela de canvas (coordenadas de tela cheia, L x A).
 * A Retícula pega essa pintura e reimprime em pontos. Desenhe com cor chapada e forte: a retícula cuida da cara.
 */
export type Pintor = (c: CanvasRenderingContext2D, t: number, L: number, A: number, u: number) => void;

const ANGULOS: [string, number, number][] = [
  [TINTA.ciano, 15, 0],
  [TINTA.magenta, 75, 1],
  [TINTA.amarelo, 0, 2],
  [TINTA.preto, 45, 3],
];
let rascunho: HTMLCanvasElement | null = null;

/**
 * A impressão: pinta os `pintores` por baixo e reimprime tudo em pontos de quatro tintas.
 * `chega` de 0 a 1 passa a onda de pressão que traz a cena (do ponto `de`, em fração da tela).
 * `apaga` de 0 a 1 encolhe os pontos até sumir: a transição do estilo.
 */
export const Reticula: React.FC<{pintores: Pintor[]; t: number; chega?: number; apaga?: number; de?: [number, number]}> = ({
  pintores,
  t,
  chega: entra = 1,
  apaga = 0,
  de = [0.5, 0.35],
}) => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const {width: L, height: A} = useVideoConfig();
  const u = Math.min(L, A * 0.75) / 1080;
  React.useLayoutEffect(() => {
    const OW = Math.round(L / 4);
    const OH = Math.round(A / 4);
    if (!rascunho) rascunho = document.createElement('canvas');
    if (rascunho.width !== OW || rascunho.height !== OH) {
      rascunho.width = OW;
      rascunho.height = OH;
    }
    const o = rascunho.getContext('2d', {willReadFrequently: true})!;
    o.setTransform(1, 0, 0, 1, 0, 0);
    o.fillStyle = '#ffffff';
    o.fillRect(0, 0, OW, OH);
    o.setTransform(OW / L, 0, 0, OH / A, 0, 0);
    for (const p of pintores) {
      o.save();
      p(o, t, L, A, u);
      o.restore();
    }
    const px = o.getImageData(0, 0, OW, OH).data;
    const c = ref.current!.getContext('2d')!;
    c.clearRect(0, 0, L, A);
    c.globalCompositeOperation = 'multiply';
    const S = 17 * u;
    const D = Math.hypot(L, A) * 0.6;
    const cx0 = L * de[0];
    const cy0 = A * de[1];
    const onda = chega(Math.max(0, Math.min(1, entra))) * Math.hypot(L, A) * 1.1;
    const encolhe = 1 - chega(Math.max(0, Math.min(1, apaga)));
    if (encolhe <= 0) return;
    for (const [cor, ang, ch] of ANGULOS) {
      const a = (ang * Math.PI) / 180;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      // o registro "vivo": cada tinta treme um tiquinho, como na máquina
      const jx = Math.sin(t * 4 + ch) * 1.4 * u;
      const jy = Math.cos(t * 3 + ch * 2) * 1.4 * u;
      c.fillStyle = cor;
      c.beginPath();
      const n = Math.ceil(D / S);
      for (let i = -n; i <= n; i++)
        for (let j = -n; j <= n; j++) {
          const x = L / 2 + (i * ca - j * sa) * S + jx;
          const y = A / 2 + (i * sa + j * ca) * S + jy;
          if (x < -S || x > L + S || y < -S || y > A + S) continue;
          const dr = Math.hypot(x - cx0, y - cy0);
          if (dr > onda) continue;
          const qx = Math.min(OW - 1, Math.max(0, Math.floor((x / L) * OW)));
          const qy = Math.min(OH - 1, Math.max(0, Math.floor((y / A) * OH)));
          const q = (qy * OW + qx) * 4;
          const r = px[q] / 255;
          const g = px[q + 1] / 255;
          const b = px[q + 2] / 255;
          const k = 1 - Math.max(r, g, b);
          let tinta = ch === 3 ? k * 0.92 : (1 - [r, g, b][ch] - k) / (1 - k + 1e-4);
          if (ch === 3 && k < 0.25) tinta = 0;
          if (tinta < 0.03) continue;
          // a frente da onda engorda os pontos
          const f = onda - dr;
          const pressao = 1 + 0.6 * Math.exp(-(f * f) / (9000 * u * u));
          const raio = Math.min(S * 0.78, S * 0.62 * Math.sqrt(tinta) * pressao) * encolhe;
          if (raio < 0.4) continue;
          c.moveTo(x + raio, y);
          c.arc(x, y, raio, 0, Math.PI * 2);
        }
      c.fill();
    }
  });
  return <canvas ref={ref} width={L} height={A} style={{position: 'absolute', inset: 0}} />;
};

/**
 * Texto impresso: letra grossa feita de pontinhos pretos dentro de uma faixa de papel com borda,
 * que a impressora revela da esquerda pra direita. `y` é o centro da faixa.
 */
export const Impresso: React.FC<{y: number; children: string; p: number; rotulo?: string; tamanho?: number; some?: number}> = ({
  y,
  children,
  p,
  rotulo,
  tamanho = 130,
  some = 0,
}) => {
  const {L, u} = useTela();
  const v = Math.max(0, Math.min(1, p)) * (1 - some);
  if (v <= 0) return null;
  const h = tamanho * u * (rotulo ? 1.9 : 1.5);
  const passo = 7 * u;
  const corte = `pontos-varre-${Math.round(y)}`;
  const trama = `pontos-trama-${Math.round(y)}`;
  return (
    <Tela>
      <defs>
        <pattern id={trama} width={passo} height={passo} patternUnits="userSpaceOnUse">
          <circle cx={passo / 2} cy={passo / 2} r={passo * 0.46} fill={TINTA.preto} />
        </pattern>
        <clipPath id={corte}>
          <rect x={0} y={y - h} width={L * Math.min(1, v * 1.3)} height={h * 2} />
        </clipPath>
      </defs>
      <g opacity={Math.min(1, v * 3)}>
        <rect x={L * 0.065} y={y - h / 2} width={L * 0.87} height={h} fill={TINTA.papel} fillOpacity={0.94} stroke={TINTA.preto} strokeWidth={6 * u} />
      </g>
      <g clipPath={`url(#${corte})`}>
        {rotulo && (
          <text x={L / 2} y={y - h / 2 + 62 * u} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={56 * u} fill={TINTA.magenta}>
            {rotulo.toUpperCase()}
          </text>
        )}
        <text
          x={L / 2}
          y={y + (rotulo ? h / 2 - 40 * u : tamanho * u * 0.35)}
          textAnchor="middle"
          fontFamily={GROTESK}
          fontWeight={700}
          fontSize={tamanho * u}
          fill={`url(#${trama})`}
        >
          {children}
        </text>
      </g>
    </Tela>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Cada desenho é um pintor: canvas comum, cor chapada e forte. Posição em pixels da tela (use L, A e u).

/** Sol: disco amarelo com miolo laranja e raios que giram. */
export const Sol = (x: number, y: number, raio: number, p = 1): Pintor => (c, t, _L, _A, u) => {
  if (p <= 0) return;
  const r = raio * chega(Math.min(1, p));
  c.fillStyle = '#ffd400';
  c.strokeStyle = '#ff9a00';
  c.lineWidth = 26 * u;
  c.lineCap = 'round';
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + t * 0.4;
    c.beginPath();
    c.moveTo(x + Math.cos(a) * r * 1.35, y + Math.sin(a) * r * 1.35);
    c.lineTo(x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75);
    c.stroke();
  }
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, '#ff7a00');
  g.addColorStop(1, '#ffd400');
  c.fillStyle = g;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
};

/** Nuvem: quatro bolas juntas, cinza-claro com a base mais escura. `cor` troca o tom (chuva: azul-acinzentado). */
export const Nuvem = (x: number, y: number, tam: number, p = 1, cor = '#a9c6e8'): Pintor => (c, t) => {
  if (p <= 0) return;
  const s = tam * chega(Math.min(1, p));
  const dx = Math.sin(t * 0.8) * tam * 0.02;
  c.fillStyle = cor;
  c.beginPath();
  for (const [bx, by, br] of [
    [-0.3, 0.05, 0.2],
    [-0.08, -0.12, 0.26],
    [0.18, -0.04, 0.22],
    [0.34, 0.08, 0.15],
  ]) {
    c.moveTo(x + dx + bx * s + br * s, y + by * s);
    c.arc(x + dx + bx * s, y + by * s, br * s, 0, Math.PI * 2);
  }
  c.rect(x + dx - 0.3 * s, y, 0.64 * s, 0.22 * s);
  c.fill();
  c.fillStyle = 'rgba(40,60,90,0.35)';
  c.fillRect(x + dx - 0.36 * s, y + 0.15 * s, 0.68 * s, 0.07 * s);
};

/** Chuva: traços azuis caindo sem parar entre `y` e `y + altura`. */
export const Chuva = (x: number, y: number, largura: number, altura: number, forca = 1): Pintor => (c, t, _L, _A, u) => {
  c.strokeStyle = '#1f6fd1';
  c.lineWidth = 16 * u;
  c.lineCap = 'round';
  const n = 14;
  for (let i = 0; i < n; i++) {
    if (i / n >= forca) continue;
    const fase = (t * (0.8 + (i % 4) * 0.12) + i * 0.31) % 1;
    const px = x - largura / 2 + ((i * 0.618) % 1) * largura;
    const py = y + fase * altura;
    c.beginPath();
    c.moveTo(px, py);
    c.lineTo(px - 8 * u, py + 60 * u);
    c.stroke();
  }
};

/** Mar: azul forte com ondas que andam, da linha `y` pra baixo (até `ate`). */
export const Mar = (y: number, ate: number, p = 1, calor = 0): Pintor => (c, t, L, _A, u) => {
  if (p <= 0) return;
  const topo = ate - (ate - y) * chega(Math.min(1, p));
  const g = c.createLinearGradient(0, topo, 0, ate);
  g.addColorStop(0, calor > 0 ? `rgb(${42 + 110 * calor},${167 - 30 * calor},${224 - 70 * calor})` : '#2aa7e0');
  g.addColorStop(1, '#0a3d91');
  c.fillStyle = g;
  c.beginPath();
  c.moveTo(0, ate);
  for (let x = 0; x <= L; x += 20 * u) c.lineTo(x, topo + Math.sin(x / (90 * u) + t * 1.6) * 16 * u);
  c.lineTo(L, ate);
  c.closePath();
  c.fill();
  c.strokeStyle = '#bfe8ff';
  c.lineWidth = 10 * u;
  for (let k = 1; k <= 2; k++) {
    c.beginPath();
    for (let x = 0; x <= L; x += 20 * u) {
      const yy = topo + k * 70 * u + Math.sin(x / (70 * u) - t * 1.3 + k) * 10 * u;
      if (x === 0) c.moveTo(x, yy);
      else c.lineTo(x, yy);
    }
    c.stroke();
  }
};

/** Planta: caule verde que sobe de (x, y) e três folhas que abrem com `p` de 0 a 1. */
export const Planta = (x: number, y: number, tam: number, p: number): Pintor => (c, t, _L, _A, u) => {
  if (p <= 0) return;
  const alto = tam * chega(Math.min(1, p / 0.6));
  const venta = Math.sin(t * 1.2) * tam * 0.03;
  c.strokeStyle = '#1e9b3a';
  c.lineWidth = 22 * u;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(x, y);
  c.quadraticCurveTo(x + venta * 0.4, y - alto * 0.5, x + venta, y - alto);
  c.stroke();
  const folha = (lado: number, h: number, ini: number) => {
    const ab = chega(Math.max(0, Math.min(1, (p - ini) / 0.3)));
    if (ab <= 0) return;
    const fx = x + venta * h + lado * tam * 0.16 * ab;
    const fy = y - alto * h - tam * 0.04 * ab;
    c.fillStyle = '#3cc24f';
    c.beginPath();
    c.ellipse(fx, fy, tam * 0.17 * ab, tam * 0.075 * ab, -lado * 0.45, 0, Math.PI * 2);
    c.fill();
  };
  folha(-1, 0.45, 0.3);
  folha(1, 0.72, 0.45);
  folha(-1, 1, 0.6);
};

/** Chão: faixa de terra marrom a partir de `y`. */
export const Chao = (y: number, ate: number): Pintor => (c, _t, L) => {
  c.fillStyle = '#8a4b1c';
  c.fillRect(0, y, L, ate - y);
};

// ---------- 4. o exemplo: o ciclo da água ----------

const sai = (t: number, dur: number) => ramp(t, dur - 0.45, dur) * 0.4;

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Reticula t={t} chega={ramp(t, -0.3, 0.9)} apaga={sai(t, dur)} de={[0.5, 0.45]} pintores={[Mar(A * 0.44, A * 0.58, 1), Sol(L * 0.75, A * 0.14, 70 * u)]} />
      <Impresso y={A * 0.3} p={ramp(t, 0.2, 1)} some={sai(t, dur)} rotulo="o ciclo">
        da água
      </Impresso>
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <Reticula
      t={t}
      chega={ramp(t, -0.35, 0.8)}
      apaga={sai(t, dur)}
      de={[0.66, 0.2]}
      pintores={[Sol(L * 0.66, A * 0.2, 120 * u, ramp(t, 0, 0.8)), Mar(A * 0.42, A * 0.6, ramp(t, -0.2, 0.7), ramp(t, 1, 2.5) * 0.45)]}
    />
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const vapor = (c: CanvasRenderingContext2D, tt: number) => {
    c.strokeStyle = '#6f8fbf';
    c.lineWidth = 26 * u;
    c.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      const f = (tt * 0.45 + i * 0.25) % 1;
      const x = L * (0.28 + i * 0.15);
      const y0 = A * 0.43 - f * A * 0.12;
      c.globalAlpha = 1 - f;
      c.beginPath();
      c.moveTo(x, y0);
      c.bezierCurveTo(x + 30 * u, y0 - 30 * u, x - 30 * u, y0 - 60 * u, x, y0 - 90 * u);
      c.stroke();
    }
    c.globalAlpha = 1;
  };
  return (
    <Reticula
      t={t}
      chega={ramp(t, -0.35, 0.8)}
      apaga={sai(t, dur)}
      de={[0.5, 0.45]}
      pintores={[Mar(A * 0.45, A * 0.6), vapor, Nuvem(L / 2, A * 0.18, (420 + ramp(t, 0.8, dur) * 120) * u, ramp(t, 0.5, 1.4))]}
    />
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <Reticula
      t={t}
      chega={ramp(t, -0.35, 0.8)}
      apaga={sai(t, dur)}
      de={[0.5, 0.2]}
      pintores={[Nuvem(L / 2, A * 0.2, 600 * u, 1, t > 0.7 ? '#8fa6c4' : '#a9c6e8'), Chuva(L / 2, A * 0.27, 460 * u, A * 0.3, ramp(t, 0.4, 1.5))]}
    />
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <Reticula
      t={t}
      chega={ramp(t, -0.35, 0.8)}
      de={[0.5, 0.55]}
      pintores={[Nuvem(L / 2, A * 0.14, 520 * u, 1, '#8fa6c4'), Chuva(L / 2, A * 0.2, 420 * u, A * 0.3), Chao(A * 0.55, A * 0.6), Planta(L / 2, A * 0.55, 320 * u, ramp(t, 0.5, 2.6))]}
    />
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, já impresso na tela: sem legenda nesse trecho
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
