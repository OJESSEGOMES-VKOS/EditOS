// ESTILO: Rabisco de caderno
// Caneta esferográfica azul numa folha pautada de caderno: o traço é tremido e
// "ferve" (muda um pouquinho várias vezes por segundo, como desenho animado à
// mão), a cor entra em zigue-zague rabiscado, o destaque é um círculo de caneta
// vermelha e cada cena chega numa página nova que desce por cima da anterior.
//
//   1. `tema`      cores, fundo e legenda
//   2. as peças    Folha, Caneta, Rabisco, Escrito, Circulado
//   3. os desenhos Sol, Nuvem, Chuva, Mar, Planta
//   4. `Exemplo`   o ciclo da água
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarCaveat} from '@remotion/google-fonts/Caveat';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, caminho, cenasPorFrase, chega, circulo, emFila, ramp, tremer, useTela} from '../../kit';

const {fontFamily: CAVEAT} = carregarCaveat('normal', {weights: ['700'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** Azul de caneta, vermelho de correção, verde e laranja de caneta colorida (pra variar, com parcimônia). */
export const COR = {
  azul: '#1d3b9a',
  vermelho: '#c0392b',
  verde: '#1f7a4a',
  laranja: '#d9731a',
  papel: '#fbf9f1',
  pauta: '#9cc0e4',
  margem: '#e58a8a',
} as const;
export type CorCaneta = 'azul' | 'vermelho' | 'verde' | 'laranja';

/** A folha pautada: linhas azuis, margem vermelha e os furos do fichário. */
const PaginaDesenho: React.FC = () => {
  const {L, A, u} = useTela();
  const passo = 60 * u;
  const n = Math.ceil(A / passo);
  return (
    <Tela>
      <rect width={L} height={A} fill={COR.papel} />
      {Array.from({length: n}, (_, i) => (
        <line key={i} x1={0} x2={L} y1={140 * u + i * passo} y2={140 * u + i * passo} stroke={COR.pauta} strokeWidth={2 * u} opacity={0.7} />
      ))}
      <line x1={120 * u} x2={120 * u} y1={0} y2={A} stroke={COR.margem} strokeWidth={3 * u} />
      {[0.2, 0.5, 0.8].map((f) => (
        <circle key={f} cx={56 * u} cy={A * f} r={20 * u} fill="#e3ddcd" />
      ))}
    </Tela>
  );
};

const Fundo: React.FC<{t: number}> = () => (
  <AbsoluteFill>
    <PaginaDesenho />
  </AbsoluteFill>
);

export const tema: Tema = {
  id: 'caderno',
  nome: 'Rabisco de caderno',
  fundo: COR.papel,
  tinta: COR.azul,
  acento: COR.vermelho,
  legenda: {
    fonte: CAVEAT,
    peso: 700,
    tamanho: 90,
    cor: COR.azul,
    destaque: COR.vermelho,
    sombra: `0 0 8px ${COR.papel}, 0 0 4px ${COR.papel}, 0 0 2px ${COR.papel}`,
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** O "ferver": muda o tremor 7,5 vezes por segundo. Todo traço passa o `t` pra ganhar vida. */
const quadroDeMao = (t: number) => Math.floor(t * 7.5);

/**
 * A página da cena e a transição: cada cena vai dentro de uma Folha, que desce do alto
 * por cima da página anterior (como folha de caderno virando). Use em volta de tudo da cena.
 */
export const Folha: React.FC<{t: number; children: React.ReactNode}> = ({t, children}) => {
  const {A} = useTela();
  const p = ramp(t, 0, 0.4, chega);
  return (
    <AbsoluteFill
      style={{
        transform: `translateY(${-(1 - p) * A * 1.05}px) rotate(${-(1 - p) * 4}deg)`,
        transformOrigin: '50% 0%',
        boxShadow: p < 1 ? '0 30px 40px rgba(0,0,0,0.25)' : 'none',
      }}
    >
      <PaginaDesenho />
      {children}
    </AbsoluteFill>
  );
};

/**
 * Um traço de caneta que se desenha e ferve: duas passadas (uma firme e uma fina por cima,
 * como quem repassa a linha). `p` vai de 0 a 1, `t` dá o tremor vivo.
 */
export const Caneta: React.FC<{pontos: Ponto[]; p: number; t: number; cor?: CorCaneta; fechado?: boolean; grossura?: number; semente?: string}> = ({
  pontos,
  p,
  t,
  cor = 'azul',
  fechado = false,
  grossura = 5,
  semente = 'c',
}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const q = quadroDeMao(t);
  const comum = {fill: 'none', stroke: COR[cor], strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - Math.min(1, p)};
  return (
    <>
      <path d={caminho(tremer(pontos, `${semente}a${q}`, 2.5 * u), fechado)} strokeWidth={grossura * u} {...comum} />
      <path d={caminho(tremer(pontos, `${semente}b${q}`, 4 * u), fechado)} strokeWidth={grossura * 0.45 * u} opacity={0.6} {...comum} />
    </>
  );
};

/**
 * Rabisco de pintar: zigue-zague contínuo de caneta que enche a forma, preso dentro dela.
 * Precisa de `id` único. `p` de 0 a 1 vai enchendo.
 */
export const Rabisco: React.FC<{id: string; forma: Ponto[]; p: number; t: number; cor?: CorCaneta; passo?: number; angulo?: number}> = ({
  id,
  forma,
  p,
  t,
  cor = 'azul',
  passo = 14,
  angulo = -50,
}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const xs = forma.map((q) => q[0]);
  const ys = forma.map((q) => q[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const R = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2 + 10 * u;
  const a = (angulo * Math.PI) / 180;
  const [dx, dy, nx, ny] = [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a)];
  const zig: Ponto[] = [];
  for (let d = -R, j = 0; d <= R; d += passo * u, j++) {
    const lado = j % 2 ? 1 : -1;
    zig.push([cx + nx * d + dx * R * lado, cy + ny * d + dy * R * lado]);
  }
  return (
    <g>
      <clipPath id={`caderno-r-${id}`}>
        <path d={caminho(forma, true)} />
      </clipPath>
      <path
        clipPath={`url(#caderno-r-${id})`}
        d={caminho(tremer(zig, `${id}${quadroDeMao(t)}`, 6 * u), false, true)}
        fill="none"
        stroke={COR[cor]}
        strokeWidth={3 * u}
        strokeLinejoin="round"
        opacity={0.7}
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - Math.min(1, p)}
      />
    </g>
  );
};

/** Texto em letra de mão (Caveat) que vai sendo escrito da esquerda pra direita, um pouco torto. */
export const Escrito: React.FC<{x: number; y: number; children: string; p: number; tamanho?: number; cor?: CorCaneta; giro?: number}> = ({
  x,
  y,
  children,
  p,
  tamanho = 120,
  cor = 'azul',
  giro = -2,
}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontFamily={CAVEAT}
      fontWeight={700}
      fontSize={tamanho * u}
      fill={COR[cor]}
      transform={`rotate(${giro} ${x} ${y})`}
      style={{clipPath: `inset(0 ${100 - Math.min(1, p) * 100}% 0 0)`}}
    >
      {children}
    </text>
  );
};

/** O círculo de caneta vermelha em volta do que importa: uma volta e meia, sem fechar certinho. */
export const Circulado: React.FC<{x: number; y: number; rx: number; ry: number; p: number; t: number; cor?: CorCaneta}> = ({x, y, rx, ry, p, t, cor = 'vermelho'}) => {
  const volta: Ponto[] = Array.from({length: 22}, (_, i) => {
    const a = -2.6 + (i / 21) * Math.PI * 2.4;
    const r = 1 + i * 0.006;
    return [x + Math.cos(a) * rx * r, y + Math.sin(a) * ry * r];
  });
  return <Caneta pontos={volta} p={p} t={t} cor={cor} grossura={5} semente={`circ${Math.round(x)}`} />;
};

// ---------- 3. os desenhos prontos ----------
// Cada um recebe o centro (x, y), o tamanho, `p` (0 a 1) e `t` (o ferver).
// Contorno em Caneta, cor em Rabisco. Desenho novo segue o mesmo jeito.

type Desenho = {x: number; y: number; tam?: number; p: number; t: number};

export const Sol: React.FC<Desenho> = ({x, y, tam = 260, p, t}) => {
  const r = tam / 2;
  return (
    <>
      <Rabisco id={`sol${Math.round(x)}`} forma={circulo(x, y, r)} p={ramp(p, 0.4, 1)} t={t} cor="laranja" />
      <Caneta pontos={circulo(x, y, r, r, 16)} fechado p={ramp(p, 0, 0.5)} t={t} cor="laranja" semente="sol" />
      {Array.from({length: 10}, (_, i) => {
        const a = (i / 10) * Math.PI * 2 + t * 0.2;
        const r1 = r * (1.55 + balanco(t, 1.5, i) * 0.08);
        return <Caneta key={i} pontos={[[x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r * 1.2], [x + Math.cos(a) * r1, y + Math.sin(a) * r1]]} p={emFila(p, 0.4, 0.6, i, 10)} t={t} cor="laranja" semente={`raio${i}`} />;
      })}
    </>
  );
};

/** Nuvem: contorno de bolinhas. `escura` de 0 a 1 enche de rabisco azul (nuvem de chuva). */
export const Nuvem: React.FC<Desenho & {escura?: number}> = ({x, y, tam = 400, p, t, escura = 0}) => {
  const w = tam;
  const h = tam * 0.42;
  const forma: Ponto[] = [
    [x - w * 0.5, y + h * 0.45],
    [x - w * 0.56, y + h * 0.02],
    [x - w * 0.35, y - h * 0.32],
    [x - w * 0.15, y - h * 0.78],
    [x + w * 0.1, y - h * 0.85],
    [x + w * 0.26, y - h * 0.42],
    [x + w * 0.47, y - h * 0.3],
    [x + w * 0.56, y + h * 0.12],
    [x + w * 0.45, y + h * 0.45],
  ];
  return (
    <>
      {escura > 0 && <Rabisco id={`nuvem${Math.round(x)}`} forma={forma} p={escura} t={t} passo={22 - escura * 10} />}
      <Caneta pontos={forma} fechado p={p} t={t} grossura={6} semente={`nuvem${Math.round(x)}`} />
    </>
  );
};

/** Chuva: tracinhos de caneta caindo sem parar. `forca` de 0 a 1 liga aos poucos. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; pingos?: number}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  pingos = 16,
}) => {
  const {u} = useTela();
  return (
    <>
      {Array.from({length: pingos}, (_, i) => {
        if (i / pingos >= forca) return null;
        const fase = (t * (0.9 + acaso(`cv${i}`) * 0.5) + acaso(`cf${i}`)) % 1;
        const px = x - largura / 2 + acaso(`cx${i}`) * largura;
        const py = y + fase * altura;
        return <Caneta key={i} pontos={[[px, py], [px - 8 * u, py + 44 * u]]} p={1} t={t} grossura={5} semente={`pingo${i}`} />;
      })}
    </>
  );
};

/** Mar: três ondas de caneta que balançam, a de cima pintada em rabisco. */
export const Mar: React.FC<{y: number; p: number; t: number; x0?: number; x1?: number}> = ({y, p, t, x0, x1}) => {
  const {L, u} = useTela();
  const a = x0 ?? 150 * u;
  const b = x1 ?? L - 70 * u;
  const onda = (k: number): Ponto[] => Array.from({length: 10}, (_, i) => [a + ((b - a) * i) / 9, y + k * 64 * u + Math.sin(i * 1.5 + t * 1.8 + k) * 16 * u]);
  const corpo: Ponto[] = [...onda(0), [b, y + 200 * u], [a, y + 200 * u]];
  return (
    <>
      <Rabisco id="mar" forma={corpo} p={ramp(p, 0.4, 1)} t={t} passo={26} angulo={-20} />
      {[0, 1, 2].map((k) => (
        <Caneta key={k} pontos={onda(k)} p={emFila(p, 0, 0.8, k, 3)} t={t} grossura={6 - k} semente={`onda${k}`} />
      ))}
    </>
  );
};

/** Planta: caule que sobe e folhas em gota, pintadas de verde em rabisco. */
export const Planta: React.FC<Desenho> = ({x, y, tam = 360, p, t}) => {
  const venta = balanco(t, 0.8) * tam * 0.03;
  const alto = tam * ramp(p, 0, 0.6, chega);
  const folha = (lado: number, alt: number, abre: number): Ponto[] => {
    const bx = x + venta * alt;
    const by = y - alto * alt;
    const c = tam * 0.3 * abre;
    return [[bx, by], [bx + lado * c * 0.5, by - c * 0.45], [bx + lado * c, by - c * 0.2], [bx + lado * c * 0.55, by + c * 0.12]];
  };
  const folhas: [number, number, number][] = [[-1, 0.45, ramp(p, 0.3, 0.7, chega)], [1, 0.72, ramp(p, 0.45, 0.85, chega)], [-1, 1, ramp(p, 0.6, 1, chega) * 0.7]];
  return (
    <>
      <Caneta pontos={[[x, y], [x + venta * 0.4, y - alto * 0.5], [x + venta, y - alto]]} p={p > 0 ? 1 : 0} t={t} cor="verde" grossura={7} semente="caule" />
      {folhas.map(([lado, alt, abre], k) =>
        abre > 0 ? (
          <g key={k}>
            <Rabisco id={`folha${k}`} forma={folha(lado, alt, abre)} p={1} t={t} cor="verde" passo={10} />
            <Caneta pontos={folha(lado, alt, abre)} fechado p={1} t={t} cor="verde" semente={`folha${k}`} />
          </g>
        ) : null
      )}
    </>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <Folha t={t}>
      <Tela>
        <Escrito x={L / 2 + 30 * u} y={A * 0.3} p={ramp(t, 0, 0.6)} tamanho={170}>
          O ciclo
        </Escrito>
        <Escrito x={L / 2 + 30 * u} y={A * 0.3 + 170 * u} p={ramp(t, 0.35, 0.95)} tamanho={170}>
          da água
        </Escrito>
        <Circulado x={L / 2 + 30 * u} y={A * 0.3 + 115 * u} rx={L * 0.36} ry={210 * u} p={ramp(t, 0.9, 1.5)} t={t} />
        {[0, 1, 2].map((i) => (
          <Caneta key={i} pontos={[[L * (0.35 + i * 0.13), A * 0.47], [L * (0.33 + i * 0.13), A * 0.5]]} p={ramp(t, 1 + i * 0.1, 1.2 + i * 0.1)} t={t} grossura={7} semente={`gota${i}`} />
        ))}
      </Tela>
    </Folha>
  );
};

const SolEMar: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <Folha t={t}>
      <Tela>
        <Sol x={L * 0.66} y={A * 0.2} tam={230 * u} p={ramp(t, 0, 0.9)} t={t} />
        <Mar y={A * 0.44} p={ramp(t, 0.2, 1.1)} t={t} />
        {/* o calor: setinhas tremidas do sol pro mar */}
        {[0.42, 0.56].map((fx, i) => (
          <Caneta key={i} pontos={[[L * fx + 60 * u, A * 0.28], [L * fx + 20 * u, A * 0.35], [L * fx, A * 0.41]]} p={ramp(t, 1.3 + i * 0.2, 1.8 + i * 0.2)} t={t} cor="vermelho" semente={`calor${i}`} />
        ))}
        <Circulado x={L * 0.55} y={A * 0.48} rx={L * 0.42} ry={110 * u} p={ramp(t, 1.8, 2.4)} t={t} />
      </Tela>
    </Folha>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const junta = ramp(t, 0.9, 2);
  return (
    <Folha t={t}>
      <Tela>
        <Mar y={A * 0.5} p={1} t={t} />
        {[0.32, 0.5, 0.68].map((fx, i) => {
          const y0 = A * 0.46 - ((t * 0.6 + i * 0.3) % 1) * A * 0.12 * (1 - junta);
          return <Caneta key={i} pontos={Array.from({length: 6}, (_, k) => [L * fx + Math.sin(k * 1.6 + i) * 22 * u, y0 - k * 34 * u] as Ponto)} p={ramp(t, 0.3 + i * 0.15, 0.9 + i * 0.15)} t={t} semente={`vapor${i}`} />;
        })}
        <Nuvem x={L * 0.55} y={A * 0.2} tam={(320 + junta * 200) * u} p={ramp(t, 0.2, 1.2)} t={t} />
      </Tela>
    </Folha>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const pesa = ramp(t, 0.4, 1.3);
  return (
    <Folha t={t}>
      <Tela>
        <Nuvem x={L * 0.55} y={A * 0.18 + pesa * 30 * u} tam={560 * u} p={1} t={t} escura={pesa} />
        <Chuva x={L * 0.55} y={A * 0.27} largura={440 * u} altura={A * 0.3} t={t} forca={ramp(t, 1, 1.8)} pingos={20} />
      </Tela>
    </Folha>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <Folha t={t}>
      <Tela>
        <Nuvem x={L * 0.55} y={A * 0.14} tam={440 * u} p={1} t={t} escura={0.8} />
        <Chuva x={L * 0.55} y={A * 0.21} largura={360 * u} altura={A * 0.28} t={t} pingos={12} />
        <Caneta pontos={[[L * 0.15, A * 0.58], [L * 0.55, A * 0.575], [L * 0.92, A * 0.58]]} p={ramp(t, 0.3, 0.8)} t={t} cor="laranja" grossura={7} semente="chao" />
        <Planta x={L * 0.55} y={A * 0.577} tam={330 * u} p={ramp(t, 0.6, 2.4)} t={t} />
        <Circulado x={L * 0.55} y={A * 0.5} rx={190 * u} ry={200 * u} p={ramp(t, 2.3, 2.8)} t={t} />
      </Tela>
    </Folha>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, que já está escrito na folha: sem legenda nesse trecho
    semLegenda={[[0, FALA_EXEMPLO.frases[1].s]]}
    // a folha nova desce por cima da anterior: a fusão curta deixa a de baixo à vista
    cenas={cenasPorFrase(FALA_EXEMPLO, [
      [0, 0, Titulo, 0],
      [1, 1, SolEMar, 0.15],
      [2, 2, VaporENuvem, 0.15],
      [3, 3, NuvemEChuva, 0.15],
      [4, 4, ChuvaEPlanta, 0.15],
    ])}
  />
);
