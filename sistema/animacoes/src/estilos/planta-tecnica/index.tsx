// ESTILO: Planta técnica
// Uma folha de projeto azul (blueprint) onde tudo é desenhado a régua em linha
// branca: eixos tracejados, traço duplo de lápis, cotas com setinha e número,
// rótulo em letra de máquina e um carimbo no canto. A cena sai numa varredura
// de scanner. Bom pra "como funciona", engenharia, processo e medida.
//
// As quatro partes, como no molde:
//   1. `tema`      cores, fundo e legenda
//   2. as peças    Linha, Cota, Rotulo, Eixos, Varredura
//   3. os desenhos Sol, Nuvem, Chuva, Mar, Planta, Seta
//   4. `Exemplo`   o ciclo da água contado neste estilo
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarArquiteto} from '@remotion/google-fonts/ArchitectsDaughter';
import {loadFont as carregarMono} from '@remotion/google-fonts/IBMPlexMono';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, Traco, acaso, balanco, caminho, cenasPorFrase, chega, circulo, emFila, ramp, useTela} from '../../kit';

const {fontFamily: MAO} = carregarArquiteto('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: MONO} = carregarMono('normal', {weights: ['500'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** Planta técnica é quase monocromática: branco de linha e um ciano pra destacar. */
export const COR = {
  linha: '#eaf3ff',
  ciano: '#9fe6ff',
  amarelo: '#ffe27a',
  papel: '#144a98',
  escuro: '#0d3672',
} as const;
export type CorPlanta = keyof typeof COR;

/** A folha azul com grade fina e grossa, grão de cópia, moldura dupla e o carimbo. */
const Fundo: React.FC<{t: number}> = () => {
  const {L, A, u} = useTela();
  const g = 30 * u;
  const m = 40 * u;
  const cw = 360 * u;
  const ch = 70 * u;
  const cx = L - m - 14 * u - cw;
  const cy = A - m - 14 * u - ch;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, #1b5bb3 0%, #144a98 55%, #0d3672 100%)'}}>
      <Tela>
        <defs>
          <pattern id="planta-tecnica-grade" width={g} height={g} patternUnits="userSpaceOnUse">
            <path d={`M${g},0V${g}H0`} fill="none" stroke="#9cc2f0" strokeWidth={0.8 * u} opacity={0.22} />
          </pattern>
          <pattern id="planta-tecnica-grade5" width={g * 5} height={g * 5} patternUnits="userSpaceOnUse">
            <path d={`M${g * 5},0V${g * 5}H0`} fill="none" stroke="#b8d4f6" strokeWidth={1.6 * u} opacity={0.3} />
          </pattern>
          <filter id="planta-tecnica-grao">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0" />
          </filter>
        </defs>
        <rect width={L} height={A} fill="url(#planta-tecnica-grade)" />
        <rect width={L} height={A} fill="url(#planta-tecnica-grade5)" />
        <rect width={L} height={A} filter="url(#planta-tecnica-grao)" />
        <rect x={m} y={m} width={L - 2 * m} height={A - 2 * m} fill="none" stroke={COR.linha} strokeWidth={3 * u} opacity={0.85} />
        <rect x={m + 12 * u} y={m + 12 * u} width={L - 2 * m - 24 * u} height={A - 2 * m - 24 * u} fill="none" stroke={COR.linha} strokeWidth={1 * u} opacity={0.6} />
        {/* o carimbo do canto */}
        <g fontFamily={MONO} fill={COR.linha} opacity={0.75}>
          <rect x={cx} y={cy} width={cw} height={ch} fill="none" stroke={COR.linha} strokeWidth={1.5 * u} />
          <line x1={cx} y1={cy + ch / 2} x2={cx + cw} y2={cy + ch / 2} stroke={COR.linha} strokeWidth={1 * u} />
          <line x1={cx + cw * 0.62} y1={cy + ch / 2} x2={cx + cw * 0.62} y2={cy + ch} stroke={COR.linha} strokeWidth={1 * u} />
          <text x={cx + 14 * u} y={cy + 25 * u} fontSize={19 * u}>PROJETO · DESENHO TÉCNICO</text>
          <text x={cx + 14 * u} y={cy + 60 * u} fontSize={19 * u}>REV. A</text>
          <text x={cx + cw * 0.62 + 14 * u} y={cy + 60 * u} fontSize={19 * u}>ESC 1:1</text>
        </g>
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'planta-tecnica',
  nome: 'Planta técnica',
  fundo: COR.papel,
  tinta: COR.linha,
  acento: COR.ciano,
  legenda: {
    fonte: MAO,
    peso: 400,
    tamanho: 66,
    cor: '#ffffff',
    destaque: COR.amarelo,
    sombra: `0 0 4px ${COR.escuro}, 0 3px 0 ${COR.escuro}, 0 0 18px ${COR.escuro}`,
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/**
 * Uma linha de projeto que se desenha: traço firme mais um traço fino deslocado
 * (o lápis da construção). Com `cheio`, ganha um véu branco bem leve por dentro.
 */
export const Linha: React.FC<{
  pontos: Ponto[];
  p: number;
  cor?: CorPlanta;
  grossura?: number;
  cheio?: boolean;
  fechado?: boolean;
  reto?: boolean;
}> = ({pontos, p, cor = 'linha', grossura = 4, cheio = false, fechado = cheio, reto = false}) => {
  const {u} = useTela();
  const d = caminho(pontos, fechado, reto);
  return (
    <>
      {cheio && <path d={d} fill={COR[cor]} opacity={0.12 * ramp(p, 0.4, 1)} stroke="none" />}
      <Traco d={d} p={p} stroke={COR[cor]} strokeWidth={grossura * u} />
      <Traco d={d} p={p} stroke={COR[cor]} strokeWidth={1.2 * u} opacity={0.5} transform={`translate(${7 * u} ${7 * u})`} />
    </>
  );
};

/** Texto em letra de máquina que se revela da esquerda pra direita (rótulo, número, nome de peça). */
export const Rotulo: React.FC<{
  x: number;
  y: number;
  children: string;
  p: number;
  tamanho?: number;
  cor?: CorPlanta;
  mao?: boolean;
  ancora?: 'start' | 'middle' | 'end';
}> = ({x, y, children, p, tamanho = 30, cor = 'linha', mao = false, ancora = 'middle'}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const n = Math.ceil(children.length * Math.min(1, p));
  return (
    <text
      x={x}
      y={y}
      textAnchor={ancora}
      fontFamily={mao ? MAO : MONO}
      fontWeight={mao ? 400 : 500}
      fontSize={tamanho * u}
      letterSpacing={mao ? 0 : 0.15 * tamanho * u}
      fill={COR[cor]}
    >
      {children.slice(0, n)}
    </text>
  );
};

/** Cota: a linha de medida com as duas setinhas e o valor numa caixinha. */
export const Cota: React.FC<{x0: number; x1: number; y: number; valor: string; p: number}> = ({x0, x1, y, valor, p}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const c = (x0 + x1) / 2;
  const meia = ((x1 - x0) / 2) * ramp(p, 0, 0.7, chega);
  const s = 18 * u;
  return (
    <g stroke={COR.linha} fill={COR.linha} opacity={Math.min(1, p * 2)}>
      <line x1={x0} y1={y - 22 * u} x2={x0} y2={y + 22 * u} strokeWidth={1.2 * u} />
      <line x1={x1} y1={y - 22 * u} x2={x1} y2={y + 22 * u} strokeWidth={1.2 * u} />
      <line x1={c - meia} y1={y} x2={c + meia} y2={y} strokeWidth={1.6 * u} />
      <path d={`M${x0},${y} l${s},${-s * 0.4} v${s * 0.8} Z M${x1},${y} l${-s},${-s * 0.4} v${s * 0.8} Z`} stroke="none" />
      <rect x={c - 100 * u} y={y - 22 * u} width={200 * u} height={44 * u} fill={COR.papel} stroke="none" />
      <g stroke="none">
        <Rotulo x={c} y={y + 11 * u} p={ramp(p, 0.5, 1)} tamanho={30}>
          {valor}
        </Rotulo>
      </g>
    </g>
  );
};

/** Os eixos tracejados de construção, cruzando no ponto (x, y). */
export const Eixos: React.FC<{x: number; y: number; p: number}> = ({x, y, p}) => {
  const {L, A, u} = useTela();
  return (
    <g stroke={COR.linha} strokeWidth={1.4 * u} strokeDasharray={`${22 * u} ${8 * u} ${4 * u} ${8 * u}`} opacity={0.4 * p}>
      <line x1={x} y1={A * 0.06} x2={x} y2={A * 0.64} />
      <line x1={70 * u} y1={y} x2={L - 70 * u} y2={y} />
    </g>
  );
};

/** Título de folha: "FIG. 1 · NOME" com régua embaixo. */
export const Figura: React.FC<{n: number; nome: string; t: number}> = ({n, nome, t}) => {
  const {L, A, u} = useTela();
  const y = A * 0.075;
  return (
    <>
      <Rotulo x={90 * u} y={y} p={ramp(t, 0.1, 0.8)} tamanho={30} ancora="start">{`FIG. ${n} · ${nome}`}</Rotulo>
      <line x1={90 * u} y1={y + 18 * u} x2={90 * u + (L - 180 * u) * ramp(t, 0.2, 1)} y2={y + 18 * u} stroke={COR.linha} strokeWidth={1.2 * u} opacity={0.6} />
    </>
  );
};

/**
 * A varredura: a transição do estilo. Uma barra de scanner ciano desce e,
 * atrás dela, a folha fica limpa. Ponha no fim da cena, por cima de tudo.
 */
export const Varredura: React.FC<{p: number}> = ({p}) => {
  const {L, A, u} = useTela();
  if (p <= 0) return null;
  const y = p * (A + 60 * u);
  return (
    <AbsoluteFill>
      <Tela>
        <defs>
          <linearGradient id="planta-tecnica-scan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={COR.ciano} stopOpacity={0} />
            <stop offset="1" stopColor={COR.ciano} stopOpacity={0.55} />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={L} height={Math.max(0, y)} fill={COR.papel} />
        <rect x={0} y={0} width={L} height={Math.max(0, y)} fill="url(#planta-tecnica-grade)" />
        <rect x={0} y={0} width={L} height={Math.max(0, y)} fill="url(#planta-tecnica-grade5)" />
        <rect x={0} y={y - 120 * u} width={L} height={120 * u} fill="url(#planta-tecnica-scan)" />
        <line x1={0} y1={y} x2={L} y2={y} stroke="#ffffff" strokeWidth={4 * u} />
      </Tela>
    </AbsoluteFill>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Todo desenho é feito de pontos passados pra <Linha>, como numa planta: forma
// geométrica limpa, quina reta onde der, e uma cota pra dizer o tamanho.

type Desenho = {x: number; y: number; tam?: number; p: number};

export const Sol: React.FC<Desenho & {t?: number}> = ({x, y, tam = 150, p, t = 0}) => {
  const {u} = useTela();
  const raios = 12;
  return (
    <>
      <Linha pontos={circulo(x, y, tam * 0.5, tam * 0.5, 24)} p={ramp(p, 0, 0.6)} cheio />
      <circle cx={x} cy={y} r={tam * 0.32} fill="none" stroke={COR.linha} strokeWidth={1.2 * u} strokeDasharray={`${6 * u} ${6 * u}`} opacity={ramp(p, 0.4, 0.7)} />
      {Array.from({length: raios}, (_, i) => {
        const a = (i / raios) * Math.PI * 2 + t * 0.15;
        const r0 = tam * 0.64;
        const r1 = tam * (i % 2 ? 0.86 : 1.0) * (1 + balanco(t, 1.2, i) * 0.04);
        return (
          <Linha
            key={i}
            reto
            pontos={[
              [x + Math.cos(a) * r0, y + Math.sin(a) * r0],
              [x + Math.cos(a) * r1, y + Math.sin(a) * r1],
            ]}
            p={emFila(p, 0.45, 0.55, i, raios)}
            grossura={3}
          />
        );
      })}
    </>
  );
};

/** Nuvem de projeto: três arcos de círculo sobre uma base reta. */
export const Nuvem: React.FC<Desenho & {cor?: CorPlanta}> = ({x, y, tam = 300, p, cor = 'linha'}) => {
  const w = tam;
  const h = tam * 0.4;
  const arco = (cx: number, cy: number, r: number, a0: number, a1: number): Ponto[] =>
    Array.from({length: 7}, (_, i) => {
      const a = a0 + ((a1 - a0) * i) / 6;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    });
  const pontos: Ponto[] = [
    [x - w * 0.5, y + h * 0.5],
    ...arco(x - w * 0.27, y + h * 0.15, h * 0.42, Math.PI * 0.95, Math.PI * 1.75),
    ...arco(x + w * 0.02, y - h * 0.1, h * 0.62, Math.PI * 1.15, Math.PI * 1.9),
    ...arco(x + w * 0.3, y + h * 0.15, h * 0.42, Math.PI * 1.3, Math.PI * 2.05),
    [x + w * 0.5, y + h * 0.5],
  ];
  return <Linha pontos={pontos} p={p} cor={cor} cheio />;
};

/** Chuva: tracinhos tracejados paralelos caindo sem parar. `forca` de 0 a 1 liga aos poucos. */
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
    <g stroke={COR.ciano} strokeWidth={4 * u} strokeLinecap="round">
      {Array.from({length: pingos}, (_, i) => {
        if (i / pingos > forca) return null;
        const fase = (t * (0.8 + acaso(`pt-v${i}`) * 0.4) + acaso(`pt-f${i}`)) % 1;
        const px = x - largura / 2 + ((i + 0.5) / pingos) * largura;
        const py = y + fase * altura;
        return <line key={i} x1={px} y1={py} x2={px} y2={py + 50 * u} opacity={1 - fase * 0.6} strokeDasharray={`${14 * u} ${8 * u}`} />;
      })}
    </g>
  );
};

/** Mar em corte: uma onda senoidal desenhada e a hachura de corte embaixo dela. */
export const Mar: React.FC<{y: number; p: number; t: number; x0?: number; x1?: number}> = ({y, p, t, x0, x1}) => {
  const {L, u} = useTela();
  const a = x0 ?? 90 * u;
  const b = x1 ?? L - 90 * u;
  const n = 24;
  const onda: Ponto[] = Array.from({length: n}, (_, i) => [a + ((b - a) * i) / (n - 1), y + Math.sin(i * 0.9 + t * 1.8) * 14 * u]);
  const fundo = 170 * u;
  const linhas = 14;
  return (
    <>
      <Linha pontos={onda} p={ramp(p, 0, 0.6)} cor="ciano" grossura={4} />
      <line x1={a} y1={y + fundo} x2={a + (b - a) * ramp(p, 0.2, 0.7)} y2={y + fundo} stroke={COR.linha} strokeWidth={3 * u} />
      {Array.from({length: linhas}, (_, i) => {
        const hx = a + ((b - a) * (i + 0.5)) / linhas;
        const q = ramp(p, 0.5 + (i / linhas) * 0.4, 0.6 + (i / linhas) * 0.4);
        return q > 0 ? (
          <line key={i} x1={hx} y1={y + fundo} x2={hx + 60 * u * q} y2={y + fundo - 60 * u * q - 30 * u} stroke={COR.linha} strokeWidth={1.2 * u} opacity={0.5} />
        ) : null;
      })}
    </>
  );
};

/** Planta em elevação: caule reto, folhas em losango e uma cota de altura. */
export const Planta: React.FC<Desenho & {t?: number}> = ({x, y, tam = 360, p, t = 0}) => {
  const {u} = useTela();
  const venta = balanco(t, 0.8) * tam * 0.02;
  const alto = tam * ramp(p, 0, 0.7, chega);
  const folha = (lado: 1 | -1, altura: number, abre: number): Ponto[] => {
    const by = y - alto * altura;
    const bx = x + venta * altura;
    const c = tam * 0.3 * abre;
    return [
      [bx, by],
      [bx + lado * c * 0.5, by - c * 0.35],
      [bx + lado * c, by - c * 0.1],
      [bx + lado * c * 0.5, by + c * 0.15],
    ];
  };
  return (
    <>
      <Linha reto pontos={[[x, y], [x + venta, y - alto]]} p={p > 0 ? 1 : 0} grossura={5} />
      {p > 0.3 && <Linha reto pontos={folha(-1, 0.42, ramp(p, 0.3, 0.75, chega))} p={1} cheio />}
      {p > 0.45 && <Linha reto pontos={folha(1, 0.7, ramp(p, 0.45, 0.9, chega))} p={1} cheio />}
      {p > 0.6 && <Linha reto pontos={folha(-1, 0.96, ramp(p, 0.6, 1, chega) * 0.7)} p={1} cheio />}
      {/* cota de altura, ao lado */}
      {p > 0.2 && (
        <g stroke={COR.amarelo} strokeWidth={1.6 * u} opacity={ramp(p, 0.2, 0.5)}>
          <line x1={x + tam * 0.45} y1={y} x2={x + tam * 0.45} y2={y - alto} />
          <line x1={x + tam * 0.4} y1={y} x2={x + tam * 0.5} y2={y} />
          <line x1={x + tam * 0.4} y1={y - alto} x2={x + tam * 0.5} y2={y - alto} />
        </g>
      )}
      <Rotulo x={x + tam * 0.52} y={y - alto / 2} p={ramp(p, 0.6, 1)} tamanho={28} cor="amarelo" ancora="start">
        ALTURA
      </Rotulo>
    </>
  );
};

/** Seta de fluxo: linha tracejada com ponta cheia. */
export const Seta: React.FC<{de: Ponto; ate: Ponto; p: number; cor?: CorPlanta}> = ({de, ate, p, cor = 'linha'}) => {
  const {u} = useTela();
  const q = ramp(p, 0, 0.8);
  const fx = de[0] + (ate[0] - de[0]) * q;
  const fy = de[1] + (ate[1] - de[1]) * q;
  const ang = Math.atan2(ate[1] - de[1], ate[0] - de[0]);
  const s = 26 * u;
  if (p <= 0) return null;
  return (
    <g stroke={COR[cor]} fill={COR[cor]}>
      <line x1={de[0]} y1={de[1]} x2={fx} y2={fy} strokeWidth={3 * u} strokeDasharray={`${16 * u} ${10 * u}`} />
      <path
        d={`M${fx},${fy} L${fx - Math.cos(ang - 0.4) * s},${fy - Math.sin(ang - 0.4) * s} L${fx - Math.cos(ang + 0.4) * s},${fy - Math.sin(ang + 0.4) * s} Z`}
        stroke="none"
        opacity={ramp(p, 0.1, 0.3)}
      />
    </g>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Eixos x={L / 2} y={A * 0.36} p={ramp(t, 0, 0.4)} />
        <Rotulo x={L / 2} y={A * 0.27} p={ramp(t, 0, 0.5)} tamanho={34}>
          PROJETO Nº 01
        </Rotulo>
        <Rotulo x={L / 2} y={A * 0.36} p={ramp(t, 0.2, 0.9)} tamanho={124} mao cor="linha">
          O ciclo
        </Rotulo>
        <Rotulo x={L / 2} y={A * 0.36 + 140 * u} p={ramp(t, 0.5, 1.2)} tamanho={124} mao cor="linha">
          da água
        </Rotulo>
        <Cota x0={L * 0.2} x1={L * 0.8} y={A * 0.36 + 230 * u} valor="1 CICLO" p={ramp(t, 1, 1.8)} />
      </Tela>
      <Varredura p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Figura n={1} nome="AQUECIMENTO" t={t} />
        <Eixos x={L * 0.7} y={A * 0.22} p={ramp(t, 0, 0.4)} />
        <Sol x={L * 0.7} y={A * 0.22} tam={170 * u} p={ramp(t, 0, 1.2)} t={t} />
        <Rotulo x={L * 0.7} y={A * 0.22 + 230 * u} p={ramp(t, 1, 1.5)} tamanho={26}>
          FONTE DE CALOR
        </Rotulo>
        <Mar y={A * 0.5} p={ramp(t, 0.3, 1.3)} t={t} />
        {[0.25, 0.42, 0.59].map((fx, i) => (
          <Seta key={i} de={[L * fx, A * 0.48]} ate={[L * fx, A * 0.36]} p={ramp(t, 1.2 + i * 0.2, 1.9 + i * 0.2)} cor="amarelo" />
        ))}
      </Tela>
      <Varredura p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const larg = (380 + ramp(t, 0.8, dur) * 120) * u;
  return (
    <>
      <Tela>
        <Figura n={2} nome="EVAPORAÇÃO" t={t} />
        <Mar y={A * 0.54} p={1} t={t} />
        <Seta de={[L * 0.5, A * 0.52]} ate={[L * 0.5, A * 0.34]} p={ramp(t, 0, 0.8)} cor="ciano" />
        <Rotulo x={L * 0.5 + 30 * u} y={A * 0.44} p={ramp(t, 0.6, 1.1)} tamanho={26} ancora="start">
          VAPOR
        </Rotulo>
        <Nuvem x={L * 0.5} y={A * 0.24} tam={larg} p={ramp(t, 0.5, 1.6)} />
        <Cota x0={L * 0.5 - larg / 2} x1={L * 0.5 + larg / 2} y={A * 0.15} valor="LARGURA" p={ramp(t, 1.4, 2.2)} />
      </Tela>
      <Varredura p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Figura n={3} nome="PRECIPITAÇÃO" t={t} />
        <Nuvem x={L * 0.5} y={A * 0.24} tam={520 * u} p={1} cor={t > 0.9 ? 'ciano' : 'linha'} />
        <Chuva x={L * 0.5} y={A * 0.31} largura={420 * u} altura={A * 0.3} t={t} forca={ramp(t, 0.4, 1.6)} />
        <Rotulo x={L * 0.5 + 270 * u} y={A * 0.24} p={ramp(t, 0.8, 1.4)} tamanho={26} ancora="start">
          PESO
        </Rotulo>
        <Seta de={[L * 0.5 + 300 * u, A * 0.26]} ate={[L * 0.5 + 300 * u, A * 0.36]} p={ramp(t, 1, 1.6)} cor="amarelo" />
      </Tela>
      <Varredura p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const chao = A * 0.6;
  return (
    <Tela>
      <Figura n={4} nome="CRESCIMENTO" t={t} />
      <Nuvem x={L * 0.42} y={A * 0.19} tam={440 * u} p={1} cor="ciano" />
      <Chuva x={L * 0.42} y={A * 0.25} largura={360 * u} altura={A * 0.25} t={t} pingos={10} />
      <Linha reto pontos={[[L * 0.12, chao], [L * 0.88, chao]]} p={ramp(t, 0, 0.6)} grossura={4} />
      {Array.from({length: 12}, (_, i) => (
        <line key={i} x1={L * 0.12 + i * 64 * u} y1={chao + 4 * u} x2={L * 0.12 + i * 64 * u - 26 * u} y2={chao + 30 * u} stroke={COR.linha} strokeWidth={1.2 * u} opacity={0.5 * ramp(t, 0.4, 0.8)} />
      ))}
      <Planta x={L * 0.42} y={chao} tam={290 * u} p={ramp(t, 0.5, 2.6)} t={t} />
    </Tela>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, que já está na folha: sem legenda nesse trecho
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
