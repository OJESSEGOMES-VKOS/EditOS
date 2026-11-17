// ESTILO: Rabisco de nanquim
// Papel creme com fibra; tudo é pincelado em tinta preta de pena e pincel: o
// traço tem cerdas que secam no fim, a sombra entra em hachura, a aguada
// (tinta diluída) se espalha e um carimbo vermelho fecha o título. A troca de
// cena é uma folha nova de papel passando por cima, com a borda de pincel.
//
//   1. `tema`      cores, fundo e legenda
//   2. as peças    Tinta, Pincel, Aguada, Hachura, Respingo, Palito, Escrito, Selo, FolhaNova
//   3. os desenhos Sol, Nuvem, Chuva, Mar, Planta
//   4. `Exemplo`   o ciclo da água
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarMincho} from '@remotion/google-fonts/ShipporiMincho';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, caminho, cenasPorFrase, chega, circulo, emFila, ramp, useTela} from '../../kit';

const {fontFamily: MINCHO} = carregarMincho('normal', {weights: ['500', '800'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** Tinta preta, aguada cinza, vermelhão do carimbo e um azul de tinta bem diluída. */
export const COR = {
  tinta: '#18141a',
  cinza: '#5d575c',
  vermelho: '#b8261a',
  azul: '#3c5a8c',
  papel: '#efe6d2',
} as const;
export type CorNanquim = keyof typeof COR;

/** O papel: creme com fibra comprida e o canto escurecido, como folha de arroz velha. */
const Fundo: React.FC<{t: number}> = () => {
  const {L, A} = useTela();
  return (
    <AbsoluteFill style={{background: COR.papel}}>
      <Tela>
        <defs>
          <filter id="nanquim-fibra">
            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.09" numOctaves={3} seed={9} />
            <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.48  0 0 0 0 0.38  0 0 0 0.22 0" />
          </filter>
          <radialGradient id="nanquim-vinheta" cx="50%" cy="50%" r="75%">
            <stop offset="0.6" stopColor="#000" stopOpacity={0} />
            <stop offset="1" stopColor="#3a2a10" stopOpacity={0.28} />
          </radialGradient>
          {/* a tinta que bebe no papel: borda um pouco irregular em todo traço */}
          <filter id="nanquim-tinta" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} />
            <feDisplacementMap in="SourceGraphic" scale={3} />
          </filter>
        </defs>
        <rect width={L} height={A} filter="url(#nanquim-fibra)" />
        <rect width={L} height={A} fill="url(#nanquim-vinheta)" />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'nanquim',
  nome: 'Rabisco de nanquim',
  fundo: COR.papel,
  tinta: COR.tinta,
  acento: COR.vermelho,
  legenda: {
    fonte: MINCHO,
    peso: 800,
    tamanho: 64,
    cor: COR.tinta,
    destaque: COR.vermelho,
    sombra: `0 0 10px ${COR.papel}, 0 0 4px ${COR.papel}, 0 2px 0 ${COR.papel}`,
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** Amostra um caminho suave com `n` pontos (o pincel precisa de muitos pontos pra variar a pressão). */
export const amostrar = (pontos: Ponto[], n = 48): Ponto[] => {
  if (pontos.length < 3) {
    const [a, b] = pontos;
    return Array.from({length: n}, (_, i) => [a[0] + ((b[0] - a[0]) * i) / (n - 1), a[1] + ((b[1] - a[1]) * i) / (n - 1)] as Ponto);
  }
  const seg = pontos.length - 1;
  return Array.from({length: n}, (_, i) => {
    const s = (i / (n - 1)) * seg;
    const k = Math.min(seg - 1, Math.floor(s));
    const f = s - k;
    const [p0, p1, p2, p3] = [pontos[Math.max(0, k - 1)], pontos[k], pontos[k + 1], pontos[Math.min(seg, k + 2)]];
    const cr = (a: number, b: number, c: number, d: number) =>
      0.5 * (2 * b + (-a + c) * f + (2 * a - 5 * b + 4 * c - d) * f * f + (-a + 3 * b - 3 * c + d) * f * f * f);
    return [cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])] as Ponto;
  });
};

/** A camada de tinta: tudo dentro ganha a borda que bebe no papel. Use dentro de <Tela>. */
export const Tinta: React.FC<{children: React.ReactNode; opacity?: number}> = ({children, opacity = 1}) => (
  <g filter="url(#nanquim-tinta)" opacity={opacity}>
    {children}
  </g>
);

/**
 * Uma pincelada que se desenha. Feita de cerdas: grossa no meio, fina nas pontas, e as cerdas
 * de fora secam antes do fim (o risco falhado do pincel). `p` vai de 0 a 1.
 */
export const Pincel: React.FC<{pontos: Ponto[]; p: number; grossura?: number; cor?: CorNanquim; semente?: string; forca?: number}> = ({
  pontos,
  p,
  grossura = 22,
  cor = 'tinta',
  semente = 'p',
  forca = 0.75,
}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const w0 = grossura * u;
  const pts = amostrar(pontos, Math.max(12, Math.min(80, pontos.length * 14)));
  const n = pts.length;
  const N = 11;
  return (
    <g fill="none" stroke={COR[cor]} strokeLinecap="round" strokeLinejoin="round">
      {Array.from({length: N}, (_, b) => {
        const off = b / (N - 1) - 0.5 + (acaso(`${semente}o${b}`) - 0.5) * 0.08;
        const seca = Math.abs(off) > 0.18 ? 0.5 + acaso(`${semente}s${b}`) * 0.5 : 1;
        const fim = Math.max(2, Math.round(n * seca));
        const linha: Ponto[] = [];
        for (let i = 0; i < fim; i++) {
          const q = pts[Math.min(n - 1, i + 1)];
          const r = pts[Math.max(0, i - 1)];
          const dx = q[0] - r[0];
          const dy = q[1] - r[1];
          const comp = Math.hypot(dx, dy) || 1;
          const pres = 0.25 + 0.75 * Math.pow(Math.sin(Math.PI * Math.min(1, (i / (n - 1)) * 1.1 + 0.05)), 0.5);
          const o = off * w0 * pres;
          linha.push([pts[i][0] - (dy / comp) * o, pts[i][1] + (dx / comp) * o]);
        }
        return (
          <path
            key={b}
            d={caminho(linha, false, true)}
            strokeWidth={Math.max(1.4, (w0 / N) * 2)}
            opacity={forca * (0.65 + acaso(`${semente}a${b}`) * 0.35)}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - Math.min(1, p / seca)}
          />
        );
      })}
    </g>
  );
};

/** Aguada: tinta diluída que se espalha no papel, com a borda mais escura onde secou. `p` faz ela crescer. */
export const Aguada: React.FC<{x: number; y: number; r: number; p: number; cor?: CorNanquim; forca?: number; achata?: number; semente?: number}> = ({
  x,
  y,
  r,
  p,
  cor = 'cinza',
  forca = 0.22,
  achata = 1,
  semente = 1,
}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const R = r * (1 - Math.pow(1 - Math.min(1, p), 3));
  const borda = (k: number) =>
    Array.from({length: 40}, (_, i) => {
      const a = (i / 40) * Math.PI * 2;
      const nz = Math.sin(a * 3 + semente + k) * 0.5 + Math.sin(a * 7 + semente * 2.3) * 0.3 + Math.sin(a * 13 + semente * 4.1) * 0.2;
      const rr = R * (1 - k * 0.18) * (1 + 0.15 * nz);
      return [x + Math.cos(a) * rr, y + Math.sin(a) * rr * achata] as Ponto;
    });
  return (
    <g style={{filter: `blur(${4 * u}px)`}} fill={COR[cor]}>
      <path d={caminho(borda(0), true)} opacity={forca} stroke={COR[cor]} strokeOpacity={forca * 1.4} strokeWidth={4 * u} />
      <path d={caminho(borda(1), true)} opacity={forca * 0.5} />
      <path d={caminho(borda(2), true)} opacity={forca * 0.5} />
    </g>
  );
};

/** Hachura: riscos paralelos de pena dentro de uma forma, pra sombra ou cor chapada. Precisa de `id` único. */
export const Hachura: React.FC<{id: string; forma: Ponto[]; p: number; passo?: number; angulo?: number; cor?: CorNanquim}> = ({
  id,
  forma,
  p,
  passo = 18,
  angulo = -35,
  cor = 'tinta',
}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const xs = forma.map((q) => q[0]);
  const ys = forma.map((q) => q[1]);
  const [cx, cy] = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
  const raio = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2;
  const n = Math.ceil((2 * raio) / (passo * u));
  return (
    <g>
      <clipPath id={`nanquim-h-${id}`}>
        <path d={caminho(forma, true)} />
      </clipPath>
      <g clipPath={`url(#nanquim-h-${id})`}>
      <g transform={`rotate(${angulo} ${cx} ${cy})`} stroke={COR[cor]} strokeWidth={3 * u} strokeLinecap="round" opacity={0.8}>
        {Array.from({length: n}, (_, i) => {
          const q = ramp(p, (i / n) * 0.6, (i / n) * 0.6 + 0.4);
          const yy = cy - raio + i * passo * u + (acaso(`${id}${i}`) - 0.5) * 4 * u;
          return q > 0 ? <line key={i} x1={cx - raio} y1={yy} x2={cx - raio + 2 * raio * q} y2={yy + (acaso(`${id}d${i}`) - 0.5) * 6 * u} /> : null;
        })}
      </g>
      </g>
    </g>
  );
};

/** Respingo: pingos de tinta que caem da pena. Bom pra dar energia a uma batida ou fechar um desenho. */
export const Respingo: React.FC<{x: number; y: number; raio: number; p: number; semente?: string; cor?: CorNanquim}> = ({x, y, raio, p, semente = 'r', cor = 'tinta'}) => {
  const {u} = useTela();
  return (
    <g fill={COR[cor]}>
      {Array.from({length: 12}, (_, i) => {
        const q = ramp(p, i * 0.04, i * 0.04 + 0.2, chega);
        if (q <= 0) return null;
        const a = acaso(`${semente}a${i}`) * Math.PI * 2;
        const d = raio * Math.sqrt(acaso(`${semente}d${i}`));
        return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={(3 + acaso(`${semente}r${i}`) * 9) * u * q} opacity={0.85} />;
      })}
    </g>
  );
};

/**
 * Personagem-palito: cabeça redonda e corpo em pinceladas. `bracos` de -1 (caídos) a 1 (pro alto),
 * `passo` mexe as pernas (use o tempo pra andar), `p` desenha a figura.
 */
export const Palito: React.FC<{x: number; y: number; tam?: number; p: number; bracos?: number; passo?: number; olha?: 1 | -1; semente?: string}> = ({
  x,
  y,
  tam = 300,
  p,
  bracos = -0.4,
  passo = 0,
  olha = 1,
  semente = 'palito',
}) => {
  const {u} = useTela();
  const h = tam;
  const quadril: Ponto = [x, y - h * 0.42];
  const ombro: Ponto = [x, y - h * 0.74];
  const perna = (lado: number): Ponto[] => {
    const a = Math.sin(passo + lado * Math.PI / 2) * 0.35;
    return [quadril, [x + Math.sin(a) * h * 0.21 + lado * h * 0.04, y - h * 0.2], [x + Math.sin(a) * h * 0.32 + lado * h * 0.08, y]];
  };
  const braco = (lado: number): Ponto[] => {
    const ang = Math.PI / 2 - lado * (0.5 + (bracos + 1) * 1.1);
    return [ombro, [x + Math.cos(ang) * h * 0.18, ombro[1] + Math.sin(ang) * h * 0.18], [x + Math.cos(ang) * h * 0.34, ombro[1] + Math.sin(ang) * h * 0.34]];
  };
  const g = 15 * (tam / 300);
  return (
    <>
      <Pincel pontos={circulo(x + olha * h * 0.01, y - h * 0.87, h * 0.11, h * 0.12, 12).concat([[x + olha * h * 0.01, y - h * 0.99]])} p={ramp(p, 0, 0.3)} grossura={g} semente={`${semente}c`} />
      <circle cx={x + olha * h * 0.05} cy={y - h * 0.88} r={5 * u * (tam / 300)} fill={COR.tinta} opacity={p > 0.3 ? 1 : 0} />
      <Pincel pontos={[ombro, [x + olha * h * 0.01, y - h * 0.58], quadril]} p={ramp(p, 0.2, 0.5)} grossura={g * 1.3} semente={`${semente}t`} />
      <Pincel pontos={braco(-1)} p={ramp(p, 0.45, 0.7)} grossura={g} semente={`${semente}be`} />
      <Pincel pontos={braco(1)} p={ramp(p, 0.5, 0.75)} grossura={g} semente={`${semente}bd`} />
      <Pincel pontos={perna(-1)} p={ramp(p, 0.65, 0.9)} grossura={g} semente={`${semente}pe`} />
      <Pincel pontos={perna(1)} p={ramp(p, 0.7, 1)} grossura={g} semente={`${semente}pd`} />
    </>
  );
};

/** Texto em letra de pincel (Shippori Mincho) que chega borrado e assenta, como tinta secando. */
export const Escrito: React.FC<{x: number; y: number; children: string; p: number; tamanho?: number; cor?: CorNanquim; peso?: 500 | 800}> = ({
  x,
  y,
  children,
  p,
  tamanho = 110,
  cor = 'tinta',
  peso = 800,
}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  return (
    <text
      x={x}
      y={y + (1 - p) * 20 * u}
      textAnchor="middle"
      fontFamily={MINCHO}
      fontWeight={peso}
      fontSize={tamanho * u}
      fill={COR[cor]}
      opacity={Math.min(1, p * 1.4)}
      style={{filter: `blur(${(1 - p) * 8 * u}px)`}}
    >
      {children}
    </text>
  );
};

/** O carimbo vermelho: bate do alto e assenta. Use com uma ou duas letras, só pra assinar um título. */
export const Selo: React.FC<{x: number; y: number; tam?: number; p: number; letra?: string}> = ({x, y, tam = 120, p, letra = ''}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const s = (1.3 - 0.3 * ramp(p, 0, 1, chega)) * tam * u;
  return (
    <g transform={`translate(${x} ${y}) rotate(-5) scale(${s / 100})`} opacity={Math.min(1, p * 2) * 0.92}>
      <rect x={-50} y={-50} width={100} height={100} rx={6} fill={COR.vermelho} />
      <rect x={-41} y={-41} width={82} height={82} rx={3} fill="none" stroke={COR.papel} strokeWidth={4} />
      <text y={16} textAnchor="middle" fontFamily={MINCHO} fontWeight={800} fontSize={46} fill={COR.papel}>
        {letra}
      </text>
    </g>
  );
};

/** A transição: uma folha nova de papel passa por cima, com a borda rasgada de pincel. Ponha no fim da cena. */
export const FolhaNova: React.FC<{p: number}> = ({p}) => {
  const {L, A, u} = useTela();
  if (p <= 0) return null;
  const x = -120 * u + p * (L + 240 * u);
  const borda: Ponto[] = Array.from({length: 24}, (_, i) => [x + (acaso(`fn${i}`) - 0.5) * 70 * u + Math.sin(i * 0.9) * 30 * u, (i / 23) * A]);
  return (
    <AbsoluteFill>
      <Tela>
        <path d={`M-10 -10 ${caminho(borda, false, true).replace('M', 'L')} L-10 ${A + 10}Z`} fill={COR.papel} />
        <Pincel pontos={borda.filter((_, i) => i % 3 === 0)} p={1} grossura={30} semente="folha" forca={0.55} />
      </Tela>
    </AbsoluteFill>
  );
};

// ---------- 3. os desenhos prontos ----------
// Cada um recebe o centro (x, y), o tamanho e `p` (0 a 1). Contorno em Pincel,
// cor em Aguada, sombra em Hachura. Desenho novo segue o mesmo jeito.

type Desenho = {x: number; y: number; tam?: number; p: number; t?: number};

export const Sol: React.FC<Desenho> = ({x, y, tam = 300, p, t = 0}) => {
  const r = tam / 2;
  return (
    <>
      <Aguada x={x} y={y} r={r * 1.05} p={ramp(p, 0.1, 0.8)} cor="vermelho" forca={0.35} semente={3} />
      <Pincel pontos={circulo(x, y, r, r, 16).concat([[x - r * 0.3, y - r * 0.95]])} p={ramp(p, 0, 0.6)} grossura={tam * 0.1} semente="sol" />
      {Array.from({length: 8}, (_, i) => {
        const a = (i / 8) * Math.PI * 2 + t * 0.15;
        const r1 = r * (1.3 + balanco(t, 1.2, i) * 0.05);
        return (
          <Pincel key={i} pontos={[[x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r * 1.2], [x + Math.cos(a) * r1 * 1.25, y + Math.sin(a) * r1 * 1.25]]} p={emFila(p, 0.5, 0.5, i, 8)} grossura={tam * 0.06} semente={`raio${i}`} />
        );
      })}
    </>
  );
};

/** Nuvem: contorno em ondas de pincel e aguada por dentro. `escura` de 0 a 1 enche de tinta (nuvem de chuva). */
export const Nuvem: React.FC<Desenho & {escura?: number}> = ({x, y, tam = 400, p, escura = 0}) => {
  const w = tam;
  const h = tam * 0.4;
  const contorno: Ponto[] = [
    [x - w * 0.5, y + h * 0.45],
    [x - w * 0.55, y + h * 0.05],
    [x - w * 0.36, y - h * 0.3],
    [x - w * 0.18, y - h * 0.75],
    [x + w * 0.08, y - h * 0.85],
    [x + w * 0.26, y - h * 0.4],
    [x + w * 0.48, y - h * 0.3],
    [x + w * 0.56, y + h * 0.12],
    [x + w * 0.45, y + h * 0.45],
    [x - w * 0.5, y + h * 0.45],
  ];
  return (
    <>
      <Aguada x={x} y={y} r={w * 0.48} achata={0.5} p={ramp(p, 0.3, 1)} forca={0.12 + escura * 0.45} semente={7} />
      <Pincel pontos={contorno} p={ramp(p, 0, 0.8)} grossura={tam * 0.05} semente={`nuvem${Math.round(x)}`} />
    </>
  );
};

/** Chuva: riscos curtos de pena caindo sem parar entre `y` e `y + altura`. `forca` de 0 a 1 liga aos poucos. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; pingos?: number}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  pingos = 18,
}) => {
  const {u} = useTela();
  return (
    <g stroke={COR.tinta} strokeLinecap="round">
      {Array.from({length: pingos}, (_, i) => {
        if (i / pingos >= forca) return null;
        const fase = (t * (1 + acaso(`cv${i}`) * 0.6) + acaso(`cf${i}`)) % 1;
        const px = x - largura / 2 + acaso(`cx${i}`) * largura;
        const py = y + fase * altura;
        return <line key={i} x1={px} y1={py} x2={px - 12 * u} y2={py + 50 * u} strokeWidth={6 * u} opacity={0.85 - fase * 0.5} />;
      })}
    </g>
  );
};

/** Mar: pinceladas de onda que balançam, com aguada azul por baixo. */
export const Mar: React.FC<{y: number; p: number; t: number; x0?: number; x1?: number}> = ({y, p, t, x0, x1}) => {
  const {L, u} = useTela();
  const a = x0 ?? 70 * u;
  const b = x1 ?? L - 70 * u;
  return (
    <>
      <Aguada x={(a + b) / 2} y={y + 90 * u} r={(b - a) * 0.55} achata={0.3} p={ramp(p, 0.2, 1)} cor="azul" forca={0.18} semente={5} />
      {[0, 1, 2].map((k) => {
        const pts: Ponto[] = Array.from({length: 9}, (_, i) => [a + ((b - a) * i) / 8, y + k * 70 * u + Math.sin(i * 1.6 + t * 1.8 + k) * 18 * u]);
        return <Pincel key={k} pontos={pts} p={emFila(p, 0, 1, k, 3)} grossura={26 - k * 6} semente={`onda${k}`} />;
      })}
    </>
  );
};

/** Planta: caule de pincel que sobe e folhas de uma pincelada só, como no bambu. */
export const Planta: React.FC<Desenho> = ({x, y, tam = 360, p, t = 0}) => {
  const venta = balanco(t, 0.8) * tam * 0.03;
  const alto = tam * ramp(p, 0, 0.6, chega);
  const folha = (lado: number, alt: number, abre: number, k: number) => {
    const bx = x + venta * alt;
    const by = y - alto * alt;
    const c = tam * 0.38 * abre;
    return (
      <Pincel key={k} pontos={[[bx, by], [bx + lado * c * 0.55, by - c * 0.35], [bx + lado * c, by - c * 0.15]]} p={abre > 0 ? 1 : 0} grossura={tam * 0.07} semente={`folha${k}`} />
    );
  };
  return (
    <>
      <Pincel pontos={[[x, y], [x + venta * 0.4, y - alto * 0.5], [x + venta, y - alto]]} p={p > 0 ? 1 : 0} grossura={tam * 0.06} semente="caule" />
      {folha(-1, 0.4, ramp(p, 0.3, 0.6, chega), 0)}
      {folha(1, 0.62, ramp(p, 0.45, 0.75, chega), 1)}
      {folha(-1, 0.85, ramp(p, 0.6, 0.9, chega), 2)}
      {folha(1, 1, ramp(p, 0.75, 1, chega) * 0.7, 3)}
    </>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Tinta>
          <Aguada x={L / 2} y={A * 0.33} r={L * 0.42} achata={0.45} p={ramp(t, 0, 1)} cor="azul" forca={0.14} semente={2} />
          <Escrito x={L / 2} y={A * 0.3} p={ramp(t, 0, 0.5)} tamanho={140}>
            O ciclo
          </Escrito>
          <Escrito x={L / 2} y={A * 0.3 + 160 * u} p={ramp(t, 0.25, 0.75)} tamanho={140}>
            da água
          </Escrito>
          <Pincel pontos={[[L * 0.2, A * 0.3 + 215 * u], [L * 0.5, A * 0.3 + 232 * u], [L * 0.8, A * 0.3 + 210 * u]]} p={ramp(t, 0.6, 1.1)} grossura={30} semente="sublinha" />
          <Respingo x={L * 0.8} y={A * 0.3 + 215 * u} raio={60 * u} p={ramp(t, 1.05, 1.4)} semente="tit" />
          <Selo x={L * 0.8} y={A * 0.17} tam={110} p={ramp(t, 0.9, 1.3)} letra="Á" />
        </Tinta>
      </Tela>
      <FolhaNova p={ramp(t, dur - 0.35, dur)} />
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Tinta>
          <Sol x={L * 0.66} y={A * 0.18} tam={240 * u} p={ramp(t, 0, 0.9)} t={t} />
          <Mar y={A * 0.46} p={ramp(t, 0.2, 1)} t={t} />
          <Palito x={L * 0.24} y={A * 0.44} tam={250 * u} p={ramp(t, 0.5, 1.3)} bracos={-0.2 + balanco(t, 2) * 0.3} semente="banhista" />
          {/* o calor: linhas que tremem subindo do mar */}
          {[0.48, 0.62, 0.76].map((fx, i) => (
            <Pincel key={i} pontos={Array.from({length: 5}, (_, k) => [L * fx + Math.sin(k * 1.8 + t * 5 + i) * 14 * u, A * 0.43 - k * 32 * u] as Ponto)} p={ramp(t, 1 + i * 0.2, 1.6 + i * 0.2)} grossura={12} semente={`calor${i}`} />
          ))}
        </Tinta>
      </Tela>
      <FolhaNova p={ramp(t, dur - 0.35, dur)} />
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const junta = ramp(t, 0.6, 1.8);
  return (
    <>
      <Tela>
        <Tinta>
          <Mar y={A * 0.5} p={1} t={t} />
          {/* fiapos de vapor sobem em espiral e se juntam na nuvem */}
          {[0.3, 0.45, 0.6, 0.72].map((fx, i) => {
            const sobe = ((t * 0.5 + i * 0.25) % 1) * (1 - junta);
            const y0 = A * 0.47 - sobe * A * 0.15;
            return (
              <Pincel key={i} pontos={Array.from({length: 6}, (_, k) => [L * fx + Math.sin(k * 1.5 + t * 3 + i) * 20 * u, y0 - k * 30 * u] as Ponto)} p={ramp(t, i * 0.15, 0.6 + i * 0.15)} grossura={10} semente={`vapor${i}`} forca={0.6} />
            );
          })}
          <Nuvem x={L * 0.5} y={A * 0.2} tam={(320 + junta * 220) * u} p={ramp(t, 0.5, 1.6)} t={t} />
        </Tinta>
      </Tela>
      <FolhaNova p={ramp(t, dur - 0.35, dur)} />
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const pesa = ramp(t, 0, 1);
  return (
    <>
      <Tela>
        <Tinta>
          <Nuvem x={L * 0.5} y={A * 0.17 + pesa * 40 * u} tam={560 * u} p={1} escura={pesa} />
          <Hachura id="ventre" forma={circulo(L * 0.5, A * 0.21 + pesa * 40 * u, 230 * u, 50 * u)} p={ramp(t, 0.3, 1.1)} passo={20} />
          <Chuva x={L * 0.5} y={A * 0.26} largura={460 * u} altura={A * 0.32} t={t} forca={ramp(t, 0.7, 1.6)} pingos={22} />
        </Tinta>
      </Tela>
      <FolhaNova p={ramp(t, dur - 0.35, dur)} />
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const cresce = ramp(t, 0.4, 2.3);
  return (
    <Tela>
      <Tinta>
        <Nuvem x={L * 0.42} y={A * 0.14} tam={420 * u} p={1} escura={0.7} />
        <Chuva x={L * 0.42} y={A * 0.2} largura={340 * u} altura={A * 0.3} t={t} pingos={14} />
        <Pincel pontos={[[L * 0.1, A * 0.58], [L * 0.5, A * 0.575], [L * 0.9, A * 0.582]]} p={ramp(t, 0, 0.5)} grossura={30} semente="chao" />
        <Hachura id="terra" forma={[[L * 0.1, A * 0.585], [L * 0.9, A * 0.585], [L * 0.9, A * 0.6], [L * 0.1, A * 0.6]]} p={ramp(t, 0.2, 0.8)} passo={16} />
        <Planta x={L * 0.42} y={A * 0.575} tam={320 * u} p={cresce} t={t} />
        <Palito x={L * 0.76} y={A * 0.575} tam={240 * u} p={ramp(t, 0.2, 1)} bracos={-0.5 + cresce * 1.4} olha={-1} semente="feliz" />
      </Tinta>
    </Tela>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, que já está escrito no papel: sem legenda nesse trecho
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
