// ESTILO: Lume
// Um desenho animado claro e alegre conduzido por um mascote: o Lume, uma
// chaminha com rosto que pula de cena em cena, se espanta, sorri e aponta o que
// importa. O mundo é chapado, de cores vivas e contorno macio. Bom pra
// explicação pra todas as idades, curiosidade e conteúdo infantil.
//
//   1. `tema`      cores, fundo e legenda
//   2. as peças    o Lume, o pulo, o balão, a íris (transição)
//   3. os desenhos alguns objetos prontos, pra servir de exemplo
//   4. `Exemplo`   a história-padrão (o ciclo da água) contada neste estilo
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarBaloo} from '@remotion/google-fonts/Baloo2';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, caminho, cenasPorFrase, chega, elastico, ramp, suave, useTela} from '../../kit';

const {fontFamily: BALOO} = carregarBaloo('normal', {weights: ['700', '800'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

export const COR = {
  ceu: '#8fd3f5',
  ceuClaro: '#e3f5ff',
  chama: '#ffd25a',
  laranja: '#ff8a1f',
  brasa: '#e0661a',
  marrom: '#3a1d08',
  creme: '#fff8e8',
  azul: '#2f7fc1',
  azulClaro: '#5fb3e8',
  verde: '#4fa64a',
  verdeEscuro: '#2e7d32',
  branco: '#ffffff',
  rosa: '#ff7a3d',
} as const;
export type CorLume = keyof typeof COR;

/** O céu de dia, com dois círculos de luz bem suaves. */
const Fundo: React.FC<{t: number}> = ({t}) => {
  const {L, A} = useTela();
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${COR.ceu} 0%, ${COR.ceuClaro} 75%)`}}>
      <Tela>
        <defs>
          <radialGradient id="lume-corpo" cx="50%" cy="65%" r="60%">
            <stop offset="0%" stopColor="#fffbe6" />
            <stop offset="45%" stopColor={COR.chama} />
            <stop offset="100%" stopColor={COR.laranja} />
          </radialGradient>
          <radialGradient id="lume-halo">
            <stop offset="0%" stopColor="#ffd77a" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#ffd77a" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="lume-nevoa">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={L * 0.2 + balanco(t, 0.1) * 30} cy={A * 0.3} r={L * 0.35} fill="url(#lume-nevoa)" />
        <circle cx={L * 0.85 + balanco(t, 0.1, 3) * 30} cy={A * 0.12} r={L * 0.3} fill="url(#lume-nevoa)" />
      </Tela>
    </AbsoluteFill>
  );
};

const CONTORNO = (c: string) => `3px 3px 0 ${c}, -3px 3px 0 ${c}, 3px -3px 0 ${c}, -3px -3px 0 ${c}, 0 4px 0 ${c}, 4px 0 0 ${c}, -4px 0 0 ${c}, 0 -4px 0 ${c}, 0 9px 0 ${c}`;

export const tema: Tema = {
  id: 'lume',
  nome: 'Lume',
  fundo: COR.ceu,
  tinta: COR.marrom,
  acento: COR.laranja,
  legenda: {
    fonte: BALOO,
    peso: 800,
    tamanho: 68,
    cor: COR.branco,
    destaque: COR.chama,
    sombra: CONTORNO(COR.marrom),
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

export type Humor = 'alegre' | 'surpreso' | 'dormindo' | 'piscando';

/**
 * O Lume, o mascote: uma chaminha com rosto que flutua e tremula.
 * `s` é o tamanho (1 = uns 300 de altura), `olhar` vai de -1 (esquerda) a 1 (direita). Use dentro de <Tela>.
 */
export const Lume: React.FC<{x: number; y: number; s?: number; t: number; humor?: Humor; olhar?: number; brilho?: number}> = ({
  x,
  y,
  s = 1,
  t,
  humor = 'alegre',
  olhar = 0,
  brilho = 1,
}) => {
  const {u} = useTela();
  const k = s * u;
  const bob = Math.sin(t * 3.3) * 10;
  const flick = Math.sin(t * 9.7) * 0.04 + Math.sin(t * 5.7) * 0.03;
  const pisca = humor === 'piscando' || (humor === 'alegre' && t % 3.2 < 0.13);
  const ox = olhar * 10;
  const topo = 30 + 6 * Math.sin(t * 7.5);
  const lado = 14 * Math.sin(t * 5);
  return (
    <g transform={`translate(${x} ${y + bob * k}) scale(${k}) translate(-150 -200)`}>
      <circle cx={150} cy={190} r={(170 + 10 * Math.sin(t * 4.3)) * brilho} fill="url(#lume-halo)" />
      <g transform={`translate(150 300) scale(${1 + flick} ${1 - flick}) translate(-150 -300)`}>
        {/* as duas linguinhas de fogo dos lados: é o que faz ele ser chama, e não gota */}
        <path d={`M92,150 C${70 + lado},${108 + lado} ${88 + lado * 0.5},70 ${96 + lado * 0.6},${52 - lado * 0.4} C112,95 120,125 128,150Z`} fill={COR.laranja} stroke={COR.brasa} strokeWidth={5} />
        <path d={`M208,150 C${230 - lado},${108 - lado} ${212 - lado * 0.5},70 ${204 - lado * 0.6},${52 + lado * 0.4} C188,95 180,125 172,150Z`} fill={COR.laranja} stroke={COR.brasa} strokeWidth={5} />
        <path
          d={`M150,${topo} C${185 + lado},110 250,170 250,215 C250,272 205,305 150,305 C95,305 50,272 50,215 C50,170 ${115 + lado},110 150,${topo}Z`}
          fill="url(#lume-corpo)"
          stroke={COR.brasa}
          strokeWidth={6}
        />
        <path d="M150,150 C175,190 195,215 195,240 C195,268 175,284 150,284 C125,284 105,268 105,240 C105,215 125,190 150,150Z" fill="#fff6d6" opacity={0.75} />
      </g>
      {humor === 'dormindo' || pisca ? (
        <g stroke={COR.marrom} strokeWidth={7} strokeLinecap="round" fill="none">
          <path d={`M${108 + ox},222 q14,10 28,0`} />
          <path d={`M${164 + ox},222 q14,10 28,0`} />
        </g>
      ) : (
        <g fill={COR.marrom}>
          <ellipse cx={122 + ox} cy={218} rx={12} ry={humor === 'surpreso' ? 19 : 16} />
          <ellipse cx={178 + ox} cy={218} rx={12} ry={humor === 'surpreso' ? 19 : 16} />
          <circle cx={126 + ox} cy={211} r={4.5} fill="#fff" />
          <circle cx={182 + ox} cy={211} r={4.5} fill="#fff" />
        </g>
      )}
      <circle cx={100} cy={250} r={11} fill={COR.rosa} opacity={0.45} />
      <circle cx={200} cy={250} r={11} fill={COR.rosa} opacity={0.45} />
      {humor === 'surpreso' ? (
        <ellipse cx={150 + ox * 0.5} cy={258} rx={9} ry={11} fill={COR.marrom} />
      ) : (
        <path d={humor === 'dormindo' ? 'M140,258 q10,5 20,0' : 'M132,252 q18,18 36,0'} stroke={COR.marrom} strokeWidth={6} fill="none" strokeLinecap="round" />
      )}
    </g>
  );
};

/**
 * O pulo do Lume: de um ponto a outro, em arco. `p` de 0 a 1. Devolve [x, y, s] pra passar pro <Lume>.
 * Cada ponto é [x, y, tamanho].
 */
export const pulo = (de: [number, number, number], para: [number, number, number], p: number, altura: number): [number, number, number] => {
  const q = suave(Math.max(0, Math.min(1, p)));
  return [de[0] + (para[0] - de[0]) * q, de[1] + (para[1] - de[1]) * q - Math.sin(q * Math.PI) * altura, de[2] + (para[2] - de[2]) * q];
};

/** O balão: uma pílula creme de borda laranja, com uma linha pequena em cima e o texto grande. Entra com um pulinho. */
export const Balao: React.FC<{x: number; y: number; p: number; texto: string; rotulo?: string; tamanho?: number}> = ({x, y, p, texto, rotulo, tamanho = 84}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const e = elastico(Math.min(1, p));
  const larg = Math.max(texto.length * tamanho * 0.52, (rotulo?.length ?? 0) * 30) * u + 100 * u;
  const alt = (tamanho * 1.15 + (rotulo ? 62 : 0)) * u + 40 * u;
  return (
    <g transform={`translate(${x} ${y}) scale(${0.85 + 0.15 * e})`} opacity={Math.min(1, p * 3)}>
      <rect x={-larg / 2} y={-alt / 2 + 10 * u} width={larg} height={alt} rx={alt / 2} fill={COR.brasa} opacity={0.4} />
      <rect x={-larg / 2} y={-alt / 2} width={larg} height={alt} rx={alt / 2} fill={COR.creme} stroke={COR.brasa} strokeWidth={6 * u} />
      {rotulo && (
        <text x={0} y={-alt / 2 + 70 * u} textAnchor="middle" fontFamily={BALOO} fontWeight={800} fontSize={52 * u} fill={COR.brasa}>
          {rotulo}
        </text>
      )}
      <text x={0} y={alt / 2 - 38 * u} textAnchor="middle" fontFamily={BALOO} fontWeight={800} fontSize={tamanho * u} fill={COR.marrom}>
        {texto}
      </text>
    </g>
  );
};

/** A transição: uma íris que se abre a partir de um ponto (em geral, onde o Lume está). `p` de 0 a 1, no começo da cena. */
export const Iris: React.FC<{p: number; x: number; y: number}> = ({p, x, y}) => {
  const {L, A} = useTela();
  if (p >= 1) return null;
  const r = Math.hypot(L, A) * chega(p);
  return <AbsoluteFill style={{background: `radial-gradient(circle at ${x}px ${y}px, transparent ${r}px, ${COR.chama} ${r + 1}px, ${COR.laranja} ${r + 40}px)`}} />;
};

/** Faíscas que saem do Lume quando algo bom acontece. */
export const Faiscas: React.FC<{x: number; y: number; p: number; n?: number}> = ({x, y, p, n = 8}) => {
  const {u} = useTela();
  if (p <= 0 || p >= 1) return null;
  return (
    <>
      {Array.from({length: n}, (_, i) => {
        const a = (i / n) * Math.PI * 2 + acaso(`fa${i}`) * 0.5;
        const d = (60 + 160 * chega(p)) * u;
        return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={(12 - 9 * p) * u} fill={COR.chama} stroke={COR.brasa} strokeWidth={3 * u} />;
      })}
    </>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Forma chapada, cor viva e contorno da mesma cor, mais escuro. Nada de traço fino.

type Desenho = {x: number; y: number; tam?: number; p: number; t?: number};

export const Sol: React.FC<Desenho> = ({x, y, tam = 120, p, t = 0}) => {
  const {u} = useTela();
  const q = elastico(Math.min(1, Math.max(0, p)));
  if (q <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${q}) rotate(${t * 20})`}>
      {Array.from({length: 10}, (_, i) => (
        <path key={i} d={`M${-16 * u} ${-tam * 1.05} L0 ${-tam * 1.4} L${16 * u} ${-tam * 1.05}Z`} transform={`rotate(${i * 36})`} fill={COR.chama} stroke={COR.laranja} strokeWidth={5 * u} strokeLinejoin="round" />
      ))}
      <circle r={tam} fill={COR.chama} stroke={COR.laranja} strokeWidth={8 * u} />
      <circle cx={-tam * 0.3} cy={-tam * 0.3} r={tam * 0.25} fill="#fffbe6" opacity={0.7} />
    </g>
  );
};

export const Nuvem: React.FC<Desenho & {cinza?: number}> = ({x, y, tam = 300, p, cinza = 0}) => {
  const {u} = useTela();
  const q = elastico(Math.min(1, Math.max(0, p)));
  if (q <= 0) return null;
  const cor = cinza > 0.5 ? '#c9d6e3' : COR.branco;
  const bolhas: [number, number, number][] = [
    [-0.3, 0.08, 0.22],
    [-0.05, -0.12, 0.3],
    [0.28, 0.02, 0.24],
    [0.05, 0.12, 0.22],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${q})`}>
      {bolhas.map(([bx, by, br], i) => (
        <circle key={`c${i}`} cx={bx * tam} cy={by * tam} r={br * tam} fill={cor} stroke={COR.azulClaro} strokeWidth={8 * u} />
      ))}
      {bolhas.map(([bx, by, br], i) => (
        <circle key={`d${i}`} cx={bx * tam} cy={by * tam} r={br * tam - 4 * u} fill={cor} />
      ))}
      <rect x={-0.42 * tam} y={0.04 * tam} width={0.84 * tam} height={0.16 * tam} fill={cor} />
    </g>
  );
};

/** Gotas em forma de lágrima caindo sem parar. */
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
  const g = 18 * u;
  return (
    <>
      {Array.from({length: pingos}, (_, i) => {
        if (i / pingos > forca) return null;
        const fase = (t * (0.9 + acaso(`lv${i}`) * 0.4) + acaso(`lf${i}`)) % 1;
        const px = x - largura / 2 + ((i + 0.5) / pingos) * largura + (acaso(`lx${i}`) - 0.5) * 30 * u;
        const py = y + fase * altura;
        return (
          <path
            key={i}
            d={`M${px} ${py - g * 1.8} Q${px + g} ${py} ${px} ${py + g * 0.8} Q${px - g} ${py} ${px} ${py - g * 1.8}Z`}
            fill={COR.azulClaro}
            stroke={COR.azul}
            strokeWidth={4 * u}
            opacity={fase > 0.85 ? (1 - fase) / 0.15 : 1}
          />
        );
      })}
    </>
  );
};

/** O mar: um bloco azul do `y` até o fim da tela, com ondas brancas que andam. */
export const Mar: React.FC<{y: number; t: number; p?: number}> = ({y, t, p = 1}) => {
  const {L, A, u} = useTela();
  const sobe = (1 - chega(Math.min(1, p))) * A * 0.5;
  const onda = 100 * u;
  return (
    <g transform={`translate(0 ${sobe})`}>
      <path
        d={`M0 ${y} ${Array.from({length: Math.ceil(L / onda) + 2}, (_, i) => `Q${i * onda + onda / 2} ${y + (i % 2 ? 18 : -18) * u + Math.sin(t * 2) * 6 * u} ${(i + 1) * onda} ${y}`).join(' ')} L${L + onda * 2} ${A} L0 ${A}Z`}
        fill={COR.azul}
      />
      {[0, 1, 2].map((j) => (
        <path
          key={j}
          d={`M${-200 * u + ((t * (60 + j * 25) * u) % (200 * u))} ${y + 70 * u + j * 120 * u} ${Array.from({length: Math.ceil(L / (100 * u)) + 3}, () => `q${50 * u},${-24 * u} ${100 * u},0`).join('')}`}
          stroke="#ffffff"
          strokeOpacity={0.4}
          strokeWidth={9 * u}
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
};

/** Uma planta que cresce de `y` pra cima: caule, duas folhas e uma flor. */
export const Planta: React.FC<Desenho> = ({x, y, tam = 300, p, t = 0}) => {
  const {u} = useTela();
  const venta = balanco(t, 0.8) * tam * 0.04;
  const alto = tam * ramp(p, 0, 0.6, chega);
  const folha = (lado: 1 | -1, h: number, abre: number): Ponto[] => {
    const by = y - alto * h;
    const bx = x + venta * h;
    const c = tam * 0.34 * abre;
    return [
      [bx, by],
      [bx + lado * c * 0.5, by - c * 0.5],
      [bx + lado * c, by - c * 0.2],
      [bx + lado * c * 0.5, by + c * 0.15],
    ];
  };
  const flor = ramp(p, 0.75, 1, elastico);
  const fx = x + venta;
  const fy = y - alto;
  return (
    <>
      <path d={caminho([[x, y], [x + venta * 0.4, y - alto * 0.5], [fx, fy]])} stroke={COR.verdeEscuro} strokeWidth={16 * u} fill="none" strokeLinecap="round" />
      {p > 0.3 && <path d={caminho(folha(-1, 0.42, ramp(p, 0.3, 0.7, elastico)), true)} fill={COR.verde} stroke={COR.verdeEscuro} strokeWidth={6 * u} />}
      {p > 0.45 && <path d={caminho(folha(1, 0.68, ramp(p, 0.45, 0.85, elastico)), true)} fill={COR.verde} stroke={COR.verdeEscuro} strokeWidth={6 * u} />}
      {flor > 0 && (
        <g transform={`translate(${fx} ${fy}) scale(${flor})`}>
          {Array.from({length: 6}, (_, i) => (
            <circle key={i} cx={Math.cos((i / 6) * Math.PI * 2) * 30 * u} cy={Math.sin((i / 6) * Math.PI * 2) * 30 * u} r={24 * u} fill="#ff9ec7" stroke="#e05a8f" strokeWidth={5 * u} />
          ))}
          <circle r={20 * u} fill={COR.chama} stroke={COR.laranja} strokeWidth={5 * u} />
        </g>
      )}
    </>
  );
};

/** Um morro de grama do `y` até o fim da tela. */
export const Morro: React.FC<{y: number; p?: number}> = ({y, p = 1}) => {
  const {L, A} = useTela();
  const sobe = (1 - chega(Math.min(1, p))) * A * 0.5;
  return (
    <g transform={`translate(0 ${sobe})`}>
      <path d={`M0 ${y + 30} Q${L * 0.3} ${y - 60} ${L * 0.55} ${y} T${L} ${y - 30} L${L} ${A} L0 ${A}Z`} fill={COR.verde} />
      <path d={`M0 ${y + 160} Q${L * 0.35} ${y + 70} ${L * 0.65} ${y + 150} T${L} ${y + 120} L${L} ${A} L0 ${A}Z`} fill={COR.verdeEscuro} opacity={0.6} />
    </g>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <Tela>
      <Lume x={L / 2} y={A * 0.43} s={1.5 * ramp(t, 0, 0.5, elastico)} t={t} humor={t < 0.8 ? 'surpreso' : 'alegre'} brilho={1.3} />
      <Balao x={L / 2} y={A * 0.17} p={ramp(t, 0.3, 1)} rotulo="com o Lume" texto="O ciclo da água" tamanho={92} />
      <Faiscas x={L / 2} y={A * 0.43 - 60 * u} p={ramp(t, 0.2, 1.2)} />
    </Tela>
  );
};

const SolEMar: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const [x, y, s] = pulo([L / 2, A * 0.43, 1.5], [L * 0.7, A * 0.36, 0.9], ramp(t, 0, 0.8), 160 * u);
  return (
    <>
      <Tela>
        <Sol x={L * 0.27} y={A * 0.17} tam={110 * u} p={ramp(t, 0.2, 1)} t={t} />
        <Mar y={A * 0.5} t={t} p={ramp(t, 0, 0.9)} />
        {[0.3, 0.5].map((fx, i) => (
          <path
            key={i}
            d={caminho(Array.from({length: 5}, (_, k) => [L * fx + Math.sin(k * 1.6 + t * 4) * 14 * u, A * 0.48 - k * 30 * u] as Ponto))}
            stroke={COR.laranja}
            strokeWidth={8 * u}
            fill="none"
            strokeLinecap="round"
            opacity={ramp(t, 1.2, 1.6)}
          />
        ))}
        <Lume x={x} y={y} s={s} t={t} humor={t < 1.4 ? 'alegre' : 'surpreso'} olhar={-1} />
      </Tela>
      <Iris p={ramp(t, 0, 0.45)} x={L / 2} y={A * 0.43} />
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const [x, y, s] = pulo([L * 0.7, A * 0.36, 0.9], [L * 0.78, A * 0.42, 0.85], ramp(t, 0, 0.8), 60 * u);
  const cresce = ramp(t, 0.6, 2.2, chega);
  return (
    <>
      <Tela>
        <Mar y={A * 0.5} t={t} />
        {[0.2, 0.36, 0.52].map((fx, i) => {
          const fase = (t * 0.6 + i * 0.33) % 1;
          return <circle key={i} cx={L * fx + Math.sin(t * 3 + i) * 20 * u} cy={A * 0.47 - fase * A * 0.2} r={(34 + 40 * fase) * u} fill="#ffffff" stroke={COR.azulClaro} strokeWidth={6 * u} opacity={Math.min(1, (1 - fase) * 2)} />;
        })}
        <Nuvem x={L * 0.4} y={A * 0.18} tam={(220 + 200 * cresce) * u} p={ramp(t, 0.4, 1.1)} />
        <Lume x={x} y={y} s={s} t={t} humor="alegre" olhar={-1} />
      </Tela>
      <Iris p={ramp(t, 0, 0.45)} x={L * 0.7} y={A * 0.36} />
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const foge = ramp(t, 0.9, 1.5);
  const [x, y, s] = pulo([L * 0.5, A * 0.5, 0.85], [L * 0.8, A * 0.47, 0.85], foge, 120 * u);
  return (
    <>
      <Tela>
        <Mar y={A * 0.56} t={t} />
        <Nuvem x={L * 0.45} y={A * 0.18} tam={460 * u} p={1} cinza={t > 0.5 ? 1 : 0} />
        <Chuva x={L * 0.45} y={A * 0.25} largura={380 * u} altura={A * 0.28} t={t} forca={ramp(t, 0.4, 1.2)} />
        <Lume x={x} y={y} s={s} t={t} humor={foge > 0 && foge < 1 ? 'surpreso' : t > 1.5 ? 'piscando' : 'alegre'} olhar={-1} />
      </Tela>
      <Iris p={ramp(t, 0, 0.45)} x={L * 0.78} y={A * 0.42} />
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const [x, y, s] = pulo([L * 0.8, A * 0.4, 0.8], [L * 0.75, A * 0.44, 0.85], ramp(t, 0, 0.6), 80 * u);
  return (
    <>
      <Tela>
        <Nuvem x={L * 0.4} y={A * 0.13} tam={360 * u} p={1} cinza={1} />
        <Chuva x={L * 0.4} y={A * 0.19} largura={300 * u} altura={A * 0.2} t={t} pingos={9} forca={1 - ramp(t, 2, 2.6)} />
        <Morro y={A * 0.55} p={ramp(t, 0, 0.6)} />
        <Planta x={L * 0.4} y={A * 0.55} tam={340 * u} p={ramp(t, 0.5, 2.6)} t={t} />
        <Lume x={x} y={y} s={s} t={t} humor={t > 2.4 ? 'piscando' : 'alegre'} olhar={-1} />
        <Faiscas x={L * 0.4} y={A * 0.55 - 340 * u} p={ramp(t, 2.3, 3.1)} />
      </Tela>
      <Iris p={ramp(t, 0, 0.45)} x={L * 0.8} y={A * 0.47} />
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
      [1, 1, SolEMar, 0],
      [2, 2, VaporENuvem, 0],
      [3, 3, NuvemEChuva, 0],
      [4, 4, ChuvaEPlanta, 0],
    ])}
  />
);
