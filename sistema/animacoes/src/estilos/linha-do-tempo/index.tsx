// ESTILO: Linha do tempo
// Um fio dourado atravessa uma noite azul-marinho e a câmera viaja por ele, de
// marco em marco. Cada marco acende com um ícone em traço de ouro, um nome e um
// rótulo. Bom pra história, passo a passo, evolução, antes e depois, processo.
//
//   1. `tema`      cores, fundo e legenda
//   2. as peças    o fio, o marco, o traço de ouro, a viagem (que é a transição), o contador
//   3. os desenhos ícones prontos em traço de ouro
//   4. `Exemplo`   a história-padrão (o ciclo da água) contada neste estilo
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarCinzel} from '@remotion/google-fonts/Cinzel';
import {loadFont as carregarLora} from '@remotion/google-fonts/Lora';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, Traco, acaso, balanco, caminho, cenasPorFrase, circulo, emFila, ramp, suave, useTela} from '../../kit';

const {fontFamily: CINZEL} = carregarCinzel('normal', {weights: ['400', '700'], subsets: ['latin', 'latin-ext']});
const {fontFamily: LORA} = carregarLora('italic', {weights: ['400', '600'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

export const COR = {
  ouro: '#e8c26a',
  ouroClaro: '#fff0c0',
  ouroEscuro: '#8a6a2a',
  marfim: '#fff6e0',
  nevoa: '#b9c3e6',
  noite: '#0a0f26',
} as const;

/** A noite azul-marinho com um véu de luz no meio. As estrelas andam com a câmera (estão no `Percurso`). */
const Fundo: React.FC<{t: number}> = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, #1b2550 0%, #0a0f26 58%, #05070f 100%)'}}>
    <Tela>
      <defs>
        <radialGradient id="linha-do-tempo-luz">
          <stop offset="0" stopColor="#fff3cf" stopOpacity={0.85} />
          <stop offset="1" stopColor="#fff3cf" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="linha-do-tempo-fio" x1="0" x2="1">
          <stop offset="0" stopColor={COR.ouroEscuro} />
          <stop offset="0.5" stopColor={COR.ouro} />
          <stop offset="1" stopColor={COR.ouroClaro} />
        </linearGradient>
        <filter id="linha-do-tempo-brilho" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feColorMatrix in="b" values="1 0 0 0 0.1  0 0.8 0 0 0.05  0 0 0.4 0 0  0 0 0 0.8 0" result="c" />
          <feMerge>
            <feMergeNode in="c" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </Tela>
  </AbsoluteFill>
);

export const tema: Tema = {
  id: 'linha-do-tempo',
  nome: 'Linha do tempo',
  fundo: COR.noite,
  tinta: COR.marfim,
  acento: COR.ouro,
  legenda: {
    fonte: LORA,
    peso: 600,
    tamanho: 64,
    cor: COR.marfim,
    destaque: COR.ouro,
    sombra: '0 2px 0 #05070f, 0 0 16px #05070f, 0 0 6px #05070f',
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** Um traço de ouro que se desenha, com brilho. Todo ícone é feito dele. Use dentro de <Tela>. */
export const Ouro: React.FC<{pontos: Ponto[]; p: number; grossura?: number; fechado?: boolean; reto?: boolean; cheio?: boolean}> = ({
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
    <g filter="url(#linha-do-tempo-brilho)">
      {cheio && p > 0.6 && <path d={d} fill={COR.ouro} opacity={ramp(p, 0.6, 1) * 0.9} />}
      <Traco d={d} p={p} stroke={COR.ouro} strokeWidth={grossura * u} />
    </g>
  );
};

/** Um ícone do marco: recebe o centro, o tamanho e `p`. Os desenhos prontos (seção 3) seguem este formato. */
export type Icone = React.FC<{x: number; y: number; tam: number; p: number; t: number}>;

export type MarcoDados = {
  /** o nome grande, até 3 palavras */
  nome: string;
  /** a linha de baixo, curta: uma data, um número, uma palavra */
  rotulo?: string;
  Icone?: Icone;
};

/** Onde fica cada coisa no vertical e no deitado: o fio, o ícone, o nome e o rótulo. */
export const useMedidas = () => {
  const {L, A, u, deitado} = useTela();
  const y = A * (deitado ? 0.5 : 0.42);
  return {
    y,
    passo: L * (deitado ? 0.42 : 0.6),
    yIcone: y - (deitado ? 200 : 250) * u,
    yNome: y + 120 * u,
    yRotulo: y + 195 * u,
    tamIcone: 290 * u,
  };
};

/** Um marco no fio: o nó, o ícone em cima e o nome e o rótulo embaixo. `p` acende, `foco` (0 a 1) apaga os que já passaram. */
export const Marco: React.FC<{x: number; dados: MarcoDados; p: number; t: number; foco?: number}> = ({x, dados, p, t, foco = 1}) => {
  const {u} = useTela();
  const m = useMedidas();
  if (p <= 0) return null;
  const {Icone: Ic} = dados;
  return (
    <g opacity={0.35 + 0.65 * foco}>
      <circle cx={x} cy={m.y} r={24 * u} fill={COR.noite} stroke={COR.ouro} strokeWidth={6 * u} />
      <circle cx={x} cy={m.y} r={11 * u * ramp(p, 0, 0.3)} fill={COR.ouroClaro} />
      <line x1={x} x2={x} y1={m.y - 34 * u} y2={m.y - 34 * u - 70 * u * ramp(p, 0, 0.4)} stroke={COR.ouro} strokeWidth={3 * u} opacity={0.6} />
      <circle cx={x} cy={m.yIcone} r={m.tamIcone * 0.85 * ramp(p, 0, 0.5)} fill="url(#linha-do-tempo-luz)" opacity={0.18 * foco} />
      {Ic && <Ic x={x} y={m.yIcone} tam={m.tamIcone} p={ramp(p, 0.05, 0.75)} t={t} />}
      <text x={x} y={m.yNome} textAnchor="middle" fontFamily={CINZEL} fontWeight={700} fontSize={(dados.nome.length > 12 ? 70 : 88) * u} fill={COR.marfim} opacity={ramp(p, 0.3, 0.6)}>
        {dados.nome}
      </text>
      {dados.rotulo && (
        <text x={x} y={m.yRotulo} textAnchor="middle" fontFamily={LORA} fontStyle="italic" fontSize={58 * u} fill={COR.ouro} opacity={ramp(p, 0.5, 0.8)}>
          {dados.rotulo}
        </text>
      )}
    </g>
  );
};

const ESTRELAS = Array.from({length: 150}, (_, i) => ({x: acaso(`lx${i}`), y: acaso(`ly${i}`), r: 1 + acaso(`lr${i}`) * 2.2, f: acaso(`lf${i}`) * 9}));

/**
 * A linha do tempo inteira, vista pela câmera. `de` e `para` são os marcos (índices; -1 é antes do primeiro)
 * e `viagem` (0 a 1) leva a câmera de um ao outro: é a transição do estilo. Toda cena desenha o percurso inteiro,
 * por isso o corte entre cenas some.
 */
export const Percurso: React.FC<{marcos: MarcoDados[]; de: number; para: number; viagem: number; t: number; acesos?: number}> = ({
  marcos,
  de,
  para,
  viagem,
  t,
  acesos = para,
}) => {
  const {L, A, u} = useTela();
  const m = useMedidas();
  const v = suave(Math.max(0, Math.min(1, viagem)));
  const pos = de + (para - de) * v;
  const x0 = L / 2;
  const cam = x0 + pos * m.passo; // x do mundo que fica no centro da tela
  const zoom = 1 - 0.07 * Math.sin(Math.PI * v);
  const fim = x0 + (marcos.length - 1) * m.passo + L * 0.6;
  const fioAte = x0 + (pos + 0.9) * m.passo;
  return (
    <Tela>
      {ESTRELAS.map((e, i) => {
        const largura = L * 3;
        const x = (((e.x * largura - (cam - x0) * 0.35) % largura) + largura) % largura - L;
        return <circle key={i} cx={x} cy={e.y * A} r={e.r * u} fill="#fff" opacity={0.2 + 0.3 * Math.abs(Math.sin(t * 1.4 + e.f))} />;
      })}
      <g transform={`translate(${L / 2} ${m.y}) scale(${zoom}) translate(${-cam} ${-m.y})`}>
        <line x1={x0 - m.passo * 1.6} x2={Math.min(fim, fioAte)} y1={m.y} y2={m.y} stroke={COR.ouro} strokeWidth={8 * u} strokeLinecap="round" />
        {marcos.map((_, i) => (
          <circle key={`n${i}`} cx={x0 + i * m.passo} cy={m.y} r={16 * u} fill={COR.noite} stroke={COR.ouroEscuro} strokeWidth={5 * u} opacity={x0 + i * m.passo < fioAte ? 1 : 0} />
        ))}
        {marcos.map((dados, i) => {
          if (i > acesos) return null;
          const chegou = i < para ? 1 : ramp(viagem, 0.7, 1);
          const foco = i === Math.round(pos) ? 1 : 0;
          return <Marco key={i} x={x0 + i * m.passo} dados={dados} p={i === acesos && i === para ? ramp(t, 0.6, 1.8) : chegou} t={t} foco={foco} />;
        })}
      </g>
    </Tela>
  );
};

/** "PASSO 2 DE 4": o contador no alto. Fica fora da câmera. */
export const Contador: React.FC<{texto: string; p: number}> = ({texto, p}) => {
  const {L, A, u} = useTela();
  return (
    <Tela>
      <text x={L / 2} y={A * 0.1} textAnchor="middle" fontFamily={CINZEL} fontSize={44 * u} letterSpacing="0.3em" fill={COR.ouro} opacity={p}>
        {texto}
      </text>
    </Tela>
  );
};

// ---------- 3. os desenhos prontos (ícones em traço de ouro) ----------

export const Sol: Icone = ({x, y, tam, p, t}) => {
  const raios = 12;
  return (
    <>
      <Ouro pontos={circulo(x, y, tam * 0.2)} p={p} fechado cheio />
      {Array.from({length: raios}, (_, i) => {
        const a = (i / raios) * Math.PI * 2 + t * 0.15;
        const r1 = tam * (i % 2 ? 0.38 : 0.5);
        return <Ouro key={i} reto pontos={[[x + Math.cos(a) * tam * 0.28, y + Math.sin(a) * tam * 0.28], [x + Math.cos(a) * r1, y + Math.sin(a) * r1]]} p={emFila(p, 0.3, 0.7, i, raios)} grossura={6} />;
      })}
    </>
  );
};

export const Mar: Icone = ({x, y, tam, p, t}) => (
  <>
    {[0, 1, 2].map((k) => {
      const pts: Ponto[] = Array.from({length: 9}, (_, i) => [x - tam * 0.5 + (tam * i) / 8, y - tam * 0.18 + k * tam * 0.18 + Math.sin(i * 1.6 + t * 1.8 + k) * tam * 0.05]);
      return <Ouro key={k} pontos={pts} p={emFila(p, 0, 1, k, 3)} grossura={6} />;
    })}
  </>
);

const contornoNuvem = (x: number, y: number, tam: number): Ponto[] => {
  const w = tam;
  const h = tam * 0.42;
  return [
    [x - w * 0.48, y + h * 0.45],
    [x - w * 0.52, y],
    [x - w * 0.3, y - h * 0.3],
    [x - w * 0.12, y - h * 0.7],
    [x + w * 0.12, y - h * 0.75],
    [x + w * 0.26, y - h * 0.35],
    [x + w * 0.46, y - h * 0.25],
    [x + w * 0.52, y + h * 0.15],
    [x + w * 0.42, y + h * 0.45],
  ];
};

export const Nuvem: Icone = ({x, y, tam, p}) => <Ouro pontos={contornoNuvem(x, y, tam)} p={p} fechado />;

export const Chuva: Icone = ({x, y, tam, p, t}) => {
  const {u} = useTela();
  return (
    <>
      <Nuvem x={x} y={y - tam * 0.18} tam={tam * 0.9} p={p} t={t} />
      {Array.from({length: 7}, (_, i) => {
        const fase = (t * 0.9 + acaso(`ch${i}`)) % 1;
        const px = x - tam * 0.3 + (i / 6) * tam * 0.6;
        const py = y + tam * 0.08 + fase * tam * 0.35;
        return p > 0.6 ? <line key={i} x1={px} y1={py} x2={px - 6 * u} y2={py + 30 * u} stroke={COR.ouroClaro} strokeWidth={6 * u} strokeLinecap="round" opacity={1 - fase} /> : null;
      })}
    </>
  );
};

export const Planta: Icone = ({x, y, tam, p, t}) => {
  const venta = balanco(t, 0.8) * tam * 0.03;
  const base = y + tam * 0.45;
  const alto = tam * 0.85;
  const folha = (lado: 1 | -1, h: number): Ponto[] => {
    const by = base - alto * h;
    const c = tam * 0.3;
    return [
      [x, by],
      [x + lado * c * 0.5, by - c * 0.45],
      [x + lado * c, by - c * 0.2],
      [x + lado * c * 0.5, by + c * 0.12],
    ];
  };
  return (
    <>
      <Ouro reto pontos={[[x - tam * 0.35, base], [x + tam * 0.35, base]]} p={ramp(p, 0, 0.3)} />
      <Ouro pontos={[[x, base], [x + venta * 0.5, base - alto * 0.5], [x + venta, base - alto]]} p={ramp(p, 0.15, 0.6)} />
      <Ouro pontos={folha(-1, 0.4)} p={ramp(p, 0.45, 0.8)} fechado cheio />
      <Ouro pontos={folha(1, 0.68)} p={ramp(p, 0.6, 1)} fechado cheio />
    </>
  );
};

/** Vapor subindo: três fios ondulados que sobem para uma nuvem. */
export const Vapor: Icone = ({x, y, tam, p, t}) => (
  <>
    <Nuvem x={x} y={y - tam * 0.25} tam={tam * 0.8} p={ramp(p, 0.4, 1)} t={t} />
    {[-1, 0, 1].map((k) => {
      const pts: Ponto[] = Array.from({length: 6}, (_, i) => [x + k * tam * 0.22 + Math.sin(i * 1.5 + t * 3 + k) * tam * 0.04, y + tam * 0.45 - (i / 5) * tam * 0.45]);
      return <Ouro key={k} pontos={pts} p={emFila(p, 0, 0.6, k + 1, 3)} grossura={6} />;
    })}
  </>
);

// ---------- 4. o exemplo: o ciclo da água ----------

const MARCOS: MarcoDados[] = [
  {nome: 'Calor', rotulo: 'sol sobre o mar', Icone: ({x, y, tam, p, t}) => (
    <>
      <Sol x={x} y={y - tam * 0.12} tam={tam * 0.8} p={p} t={t} />
      <Mar x={x} y={y + tam * 0.42} tam={tam} p={ramp(p, 0.3, 1)} t={t} />
    </>
  )},
  {nome: 'Vapor', rotulo: 'sobe e vira nuvem', Icone: Vapor},
  {nome: 'Chuva', rotulo: 'a nuvem pesa', Icone: Chuva},
  {nome: 'Vida', rotulo: 'a planta cresce', Icone: Planta},
];

const Abertura: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Percurso marcos={MARCOS} de={-1} para={-1} viagem={0} t={t} acesos={-1} />
      <Tela>
        <text x={L / 2} y={A * 0.2} textAnchor="middle" fontFamily={CINZEL} fontSize={44 * u} letterSpacing="0.3em" fill={COR.ouro} opacity={ramp(t, 0, 0.4)}>
          EM 4 PASSOS
        </text>
        <text x={L / 2} y={A * 0.29} textAnchor="middle" fontFamily={CINZEL} fontWeight={700} fontSize={112 * u} fill={COR.marfim} opacity={ramp(t, 0.1, 0.6)} filter="url(#linha-do-tempo-brilho)">
          O ciclo
        </text>
        <text x={L / 2} y={A * 0.29 + 120 * u} textAnchor="middle" fontFamily={CINZEL} fontWeight={700} fontSize={112 * u} fill={COR.marfim} opacity={ramp(t, 0.3, 0.8)} filter="url(#linha-do-tempo-brilho)">
          da água
        </text>
      </Tela>
    </>
  );
};

/** Uma cena por marco: a câmera viaja do marco anterior até este e ele acende. */
const passo = (i: number): React.FC<PropsCena> => {
  const Cena: React.FC<PropsCena> = ({t}) => (
    <>
      <Percurso marcos={MARCOS} de={i - 1} para={i} viagem={ramp(t, 0, 0.9)} t={t} />
      <Contador texto={`PASSO ${i + 1} DE ${MARCOS.length}`} p={ramp(t, 0.6, 1)} />
    </>
  );
  return Cena;
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    semLegenda={[[0, FALA_EXEMPLO.frases[1].s]]}
    cenas={cenasPorFrase(FALA_EXEMPLO, [
      [0, 0, Abertura, 0],
      [1, 1, passo(0), 0],
      [2, 2, passo(1), 0],
      [3, 3, passo(2), 0],
      [4, 4, passo(3), 0],
    ])}
  />
);
