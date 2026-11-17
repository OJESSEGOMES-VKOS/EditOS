// ESTILO: Livro pop-up
// Um livro aberto na mesa. Cada cena é uma página: as camadas de papel recortado
// se levantam da dobra do livro, uma atrás da outra, com profundidade de verdade
// e sombra no papel. No fim da cena elas deitam de novo (da frente pra trás) e a
// página seguinte se ergue. Bom pra história contada, criança, explicação leve.
//
// As quatro partes, como no molde:
//   1. `tema`      cores, fundo (mesa e livro) e legenda
//   2. as peças    Pagina (o palco), Camada (papel que levanta), Placa (texto em papel), Virar (a transição)
//   3. os desenhos Sol, Nuvem, Chuva, Mar e Planta em papel recortado
//   4. `Exemplo`   o ciclo da água em cinco páginas
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarFraunces} from '@remotion/google-fonts/Fraunces';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Palco3D, Tela, acaso, balanco, caminho, cenasPorFrase, circulo, elastico, emFila, ramp, useTela} from '../../kit';

const {fontFamily: LETRA} = carregarFraunces('normal', {weights: ['700', '900'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As cartolinas. Cores de papel colorido: vivas, mas foscas. */
export const COR = {
  creme: '#f6ecd6',
  ceu: '#9fcbe3',
  noite: '#2c3a5e',
  sol: '#f2b63f',
  solClaro: '#ffe7a3',
  mar: '#2f7fa8',
  marEscuro: '#1d5a7c',
  nuvem: '#fbfaf4',
  chuva: '#5aa6d6',
  verde: '#5f9a3c',
  verdeClaro: '#9cc25a',
  terra: '#9a6a3c',
  vermelho: '#c8503a',
} as const;
export type CorPapel = keyof typeof COR;

/** A linha da dobra do livro (em fração da altura): tudo se levanta dali. */
export const DOBRA = 0.6;

/** A mesa de madeira escura e o livro aberto, visto de cima e da frente. */
const Fundo: React.FC<{t: number}> = () => {
  const {L, A, u} = useTela();
  const y = A * DOBRA;
  const borda = 50 * u;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%, #5a3a24 0%, #3a2416 60%, #22140b 100%)'}}>
      <Tela>
        <defs>
          <filter id="pop-up-madeira">
            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.08" numOctaves={3} seed={4} />
            <feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.05  0 0 0 0 0.02  0 0 0 0.35 0" />
          </filter>
          <linearGradient id="pop-up-pagina" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e8dcc0" />
            <stop offset="45%" stopColor="#f6ecd6" />
            <stop offset="50%" stopColor="#cdbd98" />
            <stop offset="55%" stopColor="#f6ecd6" />
            <stop offset="100%" stopColor="#e8dcc0" />
          </linearGradient>
        </defs>
        <rect width={L} height={A} filter="url(#pop-up-madeira)" />
        {/* a capa por baixo e o bloco de páginas, em perspectiva (mais largo embaixo) */}
        <path d={`M${borda * 0.4},${y - 30 * u} L${L - borda * 0.4},${y - 30 * u} L${L + borda},${A * 0.97} L${-borda},${A * 0.97}Z`} fill="#7a2a22" />
        <path d={`M${borda},${y} L${L - borda},${y} L${L - borda * 0.1},${A * 0.93} L${borda * 0.1},${A * 0.93}Z`} fill="url(#pop-up-pagina)" />
        {[1, 2, 3].map((k) => (
          <line key={k} x1={borda * 0.1} y1={A * 0.93 + k * 7 * u} x2={L - borda * 0.1} y2={A * 0.93 + k * 7 * u} stroke="#d9cba8" strokeWidth={3 * u} />
        ))}
        {/* a sombra da dobra */}
        <rect x={borda} y={y - 4 * u} width={L - 2 * borda} height={26 * u} fill="#000" opacity={0.18} />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'pop-up',
  nome: 'Livro pop-up',
  fundo: '#3a2416',
  tinta: '#2a1a10',
  acento: COR.vermelho,
  legenda: {
    fonte: LETRA,
    peso: 900,
    tamanho: 72,
    cor: '#2a1a10',
    destaque: COR.vermelho,
    sombra: '0 0 12px #f6ecd6, 0 0 6px #f6ecd6, 0 2px 0 #f6ecd6',
    altura: 0.74,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** O papel: grão de fibra e a sombra que a camada joga no que está atrás. Vai uma vez por página. */
const Filtros: React.FC = () => {
  const {u} = useTela();
  return (
    <svg width={0} height={0} style={{position: 'absolute'}}>
      <defs>
        <filter id="pop-up-papel" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={5} result="g" />
          <feColorMatrix in="g" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.16 0" result="gr" />
          <feComposite in="gr" in2="SourceGraphic" operator="in" result="gg" />
          <feGaussianBlur in="SourceAlpha" stdDeviation={9 * u} result="b" />
          <feOffset in="b" dx={0} dy={14 * u} result="s" />
          <feColorMatrix in="s" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0" result="so" />
          <feMerge>
            <feMergeNode in="so" />
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="gg" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

/**
 * A página: o palco em 3D do livro. Tudo que é `Camada` vai dentro.
 * Respira de leve (o livro balança um pouco) pra nunca ficar parado.
 */
export const Pagina: React.FC<{t: number; children: React.ReactNode}> = ({t, children}) => (
  <AbsoluteFill>
    <Filtros />
    <Palco3D viraX={-8 + balanco(t, 0.3) * 1.5} viraY={balanco(t, 0.2, 3) * 4} distancia={1600}>
      {children}
    </Palco3D>
  </AbsoluteFill>
);

/**
 * Uma camada de papel que se levanta da dobra. `z` é a distância (negativo = mais pro fundo);
 * `p` de 0 (deitada na página) a 1 (em pé). Desenhe dentro em coordenadas da tela, como num <Tela>.
 */
export const Camada: React.FC<{z?: number; p: number; children: React.ReactNode}> = ({z = 0, p, children}) => {
  const {L, A} = useTela();
  if (p <= 0) return null;
  const ang = 90 * (1 - Math.min(1.08, p));
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformOrigin: `50% ${A * DOBRA}px`,
        transform: `translateZ(${z}px) rotateX(${ang}deg)`,
        backfaceVisibility: 'hidden',
      }}
    >
      <svg viewBox={`0 0 ${L} ${A}`} width={L} height={A} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <g filter="url(#pop-up-papel)">{children}</g>
      </svg>
    </div>
  );
};

/** Um recorte de papel: a forma cheia com a borda branca do corte. */
export const Recorte: React.FC<{d: string; cor: CorPapel}> = ({d, cor}) => {
  const {u} = useTela();
  return <path d={d} fill={COR[cor]} stroke="#fffaf0" strokeWidth={4 * u} strokeLinejoin="round" />;
};

/** Texto impresso numa plaquinha de papel que se levanta com a camada. */
export const Placa: React.FC<{x: number; y: number; children: string; tamanho?: number; cor?: CorPapel}> = ({x, y, children, tamanho = 72, cor = 'creme'}) => {
  const {u} = useTela();
  const w = children.length * tamanho * 0.58 * u + 80 * u;
  const h = tamanho * 1.6 * u;
  return (
    <>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={10 * u} fill={COR[cor]} stroke="#fffaf0" strokeWidth={4 * u} />
      <text x={x} y={y + tamanho * 0.34 * u} textAnchor="middle" fontFamily={LETRA} fontWeight={900} fontSize={tamanho * u} fill="#2a1a10">
        {children}
      </text>
    </>
  );
};

/**
 * Virar: a transição. Dá o `p` de cada camada `i` de `n` numa cena que dura `dur`:
 * levanta em fila do fundo pra frente no começo, e deita da frente pro fundo no fim.
 */
export const virar = (t: number, dur: number, i: number, n: number, sobe = 1.1, desce = 0.6) => {
  const ergue = elastico(emFila(t, 0, sobe, i, n, 0.55));
  const deita = emFila(t, dur - desce, desce, n - 1 - i, n, 0.5);
  return ergue * (1 - deita);
};

// ---------- 3. os desenhos em papel ----------
// Cada desenho é um ou mais `Recorte` (caminhos SVG). Retornam só o desenho:
// quem decide em que camada ele fica é a cena. Desenho novo segue o mesmo jeito.

const d = (pts: Ponto[], fechado = true) => caminho(pts, fechado);

export const Sol: React.FC<{x: number; y: number; tam: number; t?: number}> = ({x, y, tam, t = 0}) => {
  const n = 12;
  const pontas = Array.from({length: n * 2}, (_, i): Ponto => {
    const a = (i * Math.PI) / n + t * 0.2;
    const r = i % 2 ? tam * 0.62 : tam * (1 + balanco(t, 1, i) * 0.04);
    return [x + Math.cos(a) * r, y + Math.sin(a) * r];
  });
  return (
    <>
      <path d={caminho(pontas, true, true)} fill={COR.sol} stroke="#fffaf0" strokeWidth={4} />
      <Recorte d={d(circulo(x, y, tam * 0.5, tam * 0.5, 20))} cor="solClaro" />
    </>
  );
};

export const Nuvem: React.FC<{x: number; y: number; tam: number; cor?: CorPapel}> = ({x, y, tam, cor = 'nuvem'}) => {
  const w = tam;
  const bolhas: [number, number, number][] = [
    [-0.3, 0.05, 0.22],
    [-0.05, -0.12, 0.3],
    [0.25, 0, 0.24],
    [0.05, 0.12, 0.26],
  ];
  const caminhoNuvem = bolhas.map(([fx, fy, fr]) => d(circulo(x + fx * w, y + fy * w, fr * w, fr * w * 0.8, 16))).join(' ');
  return <Recorte d={caminhoNuvem} cor={cor} />;
};

/** Chuva em papel: gotinhas recortadas penduradas em fios, que balançam e descem. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number}> = ({x, y, largura, altura, t, forca = 1}) => {
  const {u} = useTela();
  const n = 9;
  return (
    <>
      {Array.from({length: n}, (_, i) => {
        if (i / n > forca) return null;
        const px = x - largura / 2 + (largura * (i + 0.5)) / n;
        const queda = ((t * 0.7 + acaso(`pg${i}`)) % 1) * altura;
        const py = y + queda;
        const s = 26 * u;
        return (
          <g key={i}>
            <line x1={px} y1={y} x2={px} y2={py - s} stroke="#fffaf0" strokeWidth={2 * u} opacity={0.6} />
            <Recorte d={`M${px},${py - s} Q${px + s * 0.7},${py + s * 0.2} ${px},${py + s * 0.55} Q${px - s * 0.7},${py + s * 0.2} ${px},${py - s}Z`} cor="chuva" />
          </g>
        );
      })}
    </>
  );
};

/** Uma faixa de mar em papel: a crista em ondas, cheia até a dobra. */
export const Mar: React.FC<{y: number; t: number; cor?: CorPapel; fase?: number}> = ({y, t, cor = 'mar', fase = 0}) => {
  const {L, A, u} = useTela();
  const n = 14;
  const crista = Array.from({length: n + 1}, (_, i): Ponto => [-40 * u + ((L + 80 * u) * i) / n, y + Math.sin(i * 1.3 + fase + t * 1.4) * 14 * u - (i % 2) * 18 * u]);
  return <Recorte d={d([...crista, [L + 40 * u, A * DOBRA], [-40 * u, A * DOBRA]])} cor={cor} />;
};

/** Planta em papel: caule e folhas que abrem com `p`. */
export const Planta: React.FC<{x: number; y: number; tam: number; p: number; t?: number}> = ({x, y, tam, p, t = 0}) => {
  const alto = tam * Math.min(1, p * 1.4);
  const venta = balanco(t, 0.7) * tam * 0.04;
  const folha = (lado: 1 | -1, h: number, abre: number) => {
    const bx = x + venta * h;
    const by = y - alto * h;
    const c = tam * 0.4 * abre;
    return d([[bx, by], [bx + lado * c * 0.4, by - c * 0.5], [bx + lado * c, by - c * 0.3], [bx + lado * c * 0.6, by + c * 0.1]]);
  };
  const w = tam * 0.05;
  return (
    <>
      <Recorte d={d([[x - w, y], [x - w + venta, y - alto], [x + w + venta, y - alto], [x + w, y]])} cor="verde" />
      {p > 0.3 && <Recorte d={folha(-1, 0.4, ramp(p, 0.3, 0.7))} cor="verdeClaro" />}
      {p > 0.5 && <Recorte d={folha(1, 0.65, ramp(p, 0.5, 0.85))} cor="verde" />}
      {p > 0.7 && <Recorte d={folha(-1, 0.92, ramp(p, 0.7, 1) * 0.8)} cor="verdeClaro" />}
    </>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

/** O céu da página: um painel de papel no fundo, com a borda arredondada. */
const Ceu: React.FC<{cor?: CorPapel}> = ({cor = 'ceu'}) => {
  const {L, A, u} = useTela();
  const m = 70 * u;
  const topo = A * 0.12;
  return <Recorte d={`M${m},${A * DOBRA} L${m},${topo + 120 * u} Q${m},${topo} ${m + 120 * u},${topo} L${L - m - 120 * u},${topo} Q${L - m},${topo} ${L - m},${topo + 120 * u} L${L - m},${A * DOBRA}Z`} cor={cor} />;
};

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A} = useTela();
  const n = 4;
  return (
    <Pagina t={t}>
      <Camada z={-300} p={Math.max(0.15, virar(t, dur, 0, n))}>
        <Ceu />
      </Camada>
      <Camada z={-180} p={virar(t, dur, 1, n)}>
        <Nuvem x={L * 0.28} y={A * 0.24} tam={L * 0.32} />
        <Nuvem x={L * 0.74} y={A * 0.3} tam={L * 0.26} />
      </Camada>
      <Camada z={-60} p={virar(t, dur, 2, n)}>
        <Mar y={A * 0.5} t={t} />
      </Camada>
      <Camada z={60} p={virar(t, dur, 3, n)}>
        <Placa x={L / 2} y={A * 0.4}>O ciclo da água</Placa>
      </Camada>
    </Pagina>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const n = 4;
  return (
    <Pagina t={t}>
      <Camada z={-300} p={virar(t, dur, 0, n)}>
        <Ceu cor="ceu" />
      </Camada>
      <Camada z={-200} p={virar(t, dur, 1, n)}>
        <Sol x={L * 0.62} y={A * 0.25} tam={150 * u} t={t} />
      </Camada>
      <Camada z={-80} p={virar(t, dur, 2, n)}>
        <Mar y={A * 0.46} t={t} cor="mar" />
      </Camada>
      <Camada z={40} p={virar(t, dur, 3, n)}>
        <Mar y={A * 0.53} t={t} cor="marEscuro" fase={2} />
      </Camada>
    </Pagina>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const n = 4;
  const sobe = ramp(t, 0.8, dur - 0.6);
  return (
    <Pagina t={t}>
      <Camada z={-300} p={virar(t, dur, 0, n)}>
        <Ceu />
      </Camada>
      <Camada z={-160} p={virar(t, dur, 1, n)}>
        {/* fitas de vapor em papel, subindo */}
        {[0.3, 0.5, 0.7].map((fx, i) => {
          const y0 = A * 0.48 - sobe * A * 0.12 - i * 10 * u;
          const pts: Ponto[] = Array.from({length: 5}, (_, k) => [L * fx + Math.sin(k * 1.4 + t * 2 + i) * 22 * u, y0 - k * 45 * u]);
          return <path key={i} d={caminho(pts)} fill="none" stroke="#fffaf0" strokeWidth={22 * u} strokeLinecap="round" opacity={0.9} />;
        })}
        <Nuvem x={L * 0.5} y={A * 0.22} tam={L * (0.3 + sobe * 0.25)} />
      </Camada>
      <Camada z={-40} p={virar(t, dur, 2, n)}>
        <Mar y={A * 0.5} t={t} />
      </Camada>
      <Camada z={60} p={virar(t, dur, 3, n)}>
        <Mar y={A * 0.55} t={t} cor="marEscuro" fase={2} />
      </Camada>
    </Pagina>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A} = useTela();
  const n = 3;
  return (
    <Pagina t={t}>
      <Camada z={-300} p={virar(t, dur, 0, n)}>
        <Ceu cor="noite" />
      </Camada>
      <Camada z={-150} p={virar(t, dur, 1, n)}>
        <Chuva x={L * 0.5} y={A * 0.26} largura={L * 0.6} altura={A * 0.26} t={t} forca={ramp(t, 0.6, 1.6)} />
      </Camada>
      <Camada z={-40} p={virar(t, dur, 2, n)}>
        <Nuvem x={L * 0.5} y={A * 0.22} tam={L * 0.62} cor="nuvem" />
      </Camada>
    </Pagina>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const n = 4;
  return (
    <Pagina t={t}>
      <Camada z={-300} p={virar(t, 99, 0, n)}>
        <Ceu />
      </Camada>
      <Camada z={-200} p={virar(t, 99, 1, n)}>
        <Nuvem x={L * 0.5} y={A * 0.2} tam={L * 0.45} />
        <Chuva x={L * 0.5} y={A * 0.24} largura={L * 0.4} altura={A * 0.14} t={t} />
      </Camada>
      <Camada z={-60} p={virar(t, 99, 2, n)}>
        <Planta x={L * 0.5} y={A * DOBRA - 50 * u} tam={A * 0.26} p={ramp(t, 0.8, 2.8)} t={t} />
      </Camada>
      <Camada z={60} p={virar(t, 99, 3, n)}>
        <Recorte d={caminho([[-20, A * 0.53], [L * 0.3, A * 0.51], [L * 0.7, A * 0.535], [L + 20, A * 0.52], [L + 20, A * DOBRA], [-20, A * DOBRA]], true)} cor="terra" />
      </Camada>
    </Pagina>
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
