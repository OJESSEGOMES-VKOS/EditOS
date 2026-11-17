// ESTILO: Desenho plano
// Ilustração "flat" moderna: formas lisas e geométricas, cores chapadas e
// vivas, sem contorno, sem sombra e sem gradiente. Cada cena tem um fundo de
// cor inteira e monta o desenho peça por peça, que entra com mola (passa um
// pouco do tamanho e volta). A cena seguinte chega num círculo de cor que
// cresce do centro. Bom pra explicação rápida, dado, produto e curiosidade.
//
// As quatro partes, como no molde:
//   1. `tema`      cores, fundo e legenda
//   2. as peças    mola, Peca, Fundo de cena, Etiqueta, Manchete, Bola
//   3. os desenhos Sol, Nuvem, Chuva, Mar, Planta
//   4. `Exemplo`   o ciclo da água contado neste estilo
import React from 'react';
import {AbsoluteFill, spring} from 'remotion';
import {loadFont as carregarPoppins} from '@remotion/google-fonts/Poppins';
import type {PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, FPS, Filme, Tela, acaso, balanco, cenasPorFrase, ramp, useTela} from '../../kit';

const {fontFamily: POP} = carregarPoppins('normal', {weights: ['600', '800'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** A paleta chapada. Cada cena usa um fundo e no máximo quatro cores por cima. */
export const COR = {
  noite: '#1d2b53',
  ceu: '#8fd3f4',
  mar: '#1f8a9e',
  mar2: '#16707f',
  marClaro: '#2aa5b8',
  verde: '#3bb273',
  verde2: '#2a8f5a',
  sol: '#ffcf3f',
  laranja: '#ff8a3d',
  coral: '#ff5e5b',
  creme: '#fff4e0',
  terra: '#c97b4a',
  branco: '#ffffff',
  tinta: '#152039',
} as const;
export type CorPlana = keyof typeof COR;

/** Por baixo de tudo, só uma cor lisa: quem dá o fundo de verdade é cada cena (`FundoCena`). */
const Fundo: React.FC<{t: number}> = () => <AbsoluteFill style={{background: COR.creme}} />;

export const tema: Tema = {
  id: 'desenho-plano',
  nome: 'Desenho plano',
  fundo: COR.creme,
  tinta: COR.tinta,
  acento: COR.coral,
  legenda: {
    fonte: POP,
    peso: 800,
    tamanho: 64,
    cor: COR.branco,
    destaque: COR.sol,
    // o fundo muda de cor a cada cena: contorno escuro chapado garante leitura em qualquer uma
    sombra: `0 4px 0 ${COR.tinta}, 3px 0 0 ${COR.tinta}, -3px 0 0 ${COR.tinta}, 0 -3px 0 ${COR.tinta}, 0 0 14px rgba(21,32,57,0.6)`,
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/**
 * A mola do estilo: vai de 0 a 1 a partir do segundo `em`, passa um pouco e volta.
 * `firme` maior = menos balanço.
 */
export const mola = (t: number, em: number, firme = 12) =>
  spring({frame: (t - em) * FPS, fps: FPS, config: {damping: firme, stiffness: 140}});

/** Uma peça que entra com mola, crescendo a partir do ponto (x, y). */
export const Peca: React.FC<{x: number; y: number; t: number; em: number; firme?: number; children: React.ReactNode}> = ({x, y, t, em, firme, children}) => {
  const s = mola(t, em, firme);
  if (s <= 0.001) return null;
  return <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>{children}</g>;
};

/** O fundo de cor inteira da cena. Ponha primeiro dentro da <Tela>. */
export const FundoCena: React.FC<{cor: CorPlana}> = ({cor}) => {
  const {L, A} = useTela();
  return <rect width={L} height={A} fill={COR[cor]} />;
};

/** Etiqueta em pílula (rótulo curto em caixa alta), que sobe com mola. */
export const Etiqueta: React.FC<{children: string; t: number; em?: number; cor?: CorPlana; fundo?: CorPlana; y?: number}> = ({
  children,
  t,
  em = 0.1,
  cor = 'tinta',
  fundo = 'sol',
  y,
}) => {
  const {A, u} = useTela();
  const s = mola(t, em, 14);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: y ?? A * 0.075,
        textAlign: 'center',
        opacity: s,
        transform: `translateY(${(1 - s) * 50 * u}px)`,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          fontFamily: POP,
          fontWeight: 800,
          fontSize: 40 * u,
          letterSpacing: '0.12em',
          color: COR[cor],
          background: COR[fundo],
          padding: `${10 * u}px ${30 * u}px`,
          borderRadius: 40 * u,
        }}
      >
        {children}
      </span>
    </div>
  );
};

/** Manchete grande em Poppins 800, que sobe com mola. Até 5 palavras. */
export const Manchete: React.FC<{children: string; t: number; em?: number; cor?: CorPlana; y: number; tamanho?: number}> = ({
  children,
  t,
  em = 0.2,
  cor = 'branco',
  y,
  tamanho = 140,
}) => {
  const {u} = useTela();
  const s = mola(t, em, 13);
  return (
    <div
      style={{
        position: 'absolute',
        left: 60 * u,
        right: 60 * u,
        top: y,
        textAlign: 'center',
        fontFamily: POP,
        fontWeight: 800,
        fontSize: tamanho * u,
        lineHeight: 1.02,
        color: COR[cor],
        whiteSpace: 'pre-line',
        opacity: Math.min(1, s * 1.5),
        transform: `translateY(${(1 - s) * 70 * u}px)`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Bola: a transição do estilo. Um círculo da cor do próximo fundo cresce do
 * centro até cobrir a tela. Ponha no fim da cena, por cima de tudo.
 */
export const Bola: React.FC<{p: number; cor: CorPlana; x?: number; y?: number}> = ({p, cor, x, y}) => {
  const {L, A, cx, cy} = useTela();
  if (p <= 0) return null;
  const r = Math.hypot(L, A) * p;
  return (
    <AbsoluteFill>
      <Tela>
        <circle cx={x ?? cx} cy={y ?? cy} r={r} fill={COR[cor]} />
      </Tela>
    </AbsoluteFill>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Todo desenho é feito de formas geométricas lisas (círculo, retângulo de canto
// redondo, onda), cada uma entrando com mola em sequência. Sem contorno.

type Desenho = {x: number; y: number; tam?: number; t: number; em?: number};

export const Sol: React.FC<Desenho> = ({x, y, tam = 200, t, em = 0}) => {
  const {u} = useTela();
  return (
    <>
      <Peca x={x} y={y} t={t} em={em + 0.2} firme={10}>
        <g transform={`rotate(${t * 12} ${x} ${y})`}>
          {Array.from({length: 12}, (_, i) => (
            <rect key={i} x={x - 14 * u} y={y - tam * 1.75} width={28 * u} height={tam * 0.6} rx={14 * u} fill={COR.sol} transform={`rotate(${i * 30} ${x} ${y})`} />
          ))}
        </g>
      </Peca>
      <Peca x={x} y={y} t={t} em={em}>
        <circle cx={x} cy={y} r={tam} fill={COR.sol} />
      </Peca>
      <Peca x={x} y={y} t={t} em={em + 0.12}>
        <circle cx={x} cy={y} r={tam * 0.6} fill={COR.creme} />
      </Peca>
    </>
  );
};

/** Nuvem chapada: três círculos sobre uma pílula, cada um entrando com mola. */
export const Nuvem: React.FC<Desenho & {cor?: CorPlana}> = ({x, y, tam = 300, t, em = 0, cor = 'branco'}) => {
  const k = tam / 300;
  const bolas: [number, number, number][] = [
    [-80, 0, 70],
    [0, -30, 95],
    [90, 5, 65],
  ];
  return (
    <>
      {bolas.map(([dx, dy, r], i) => (
        <Peca key={i} x={x + dx * k} y={y + dy * k} t={t} em={em + i * 0.08}>
          <circle cx={x + dx * k} cy={y + dy * k} r={r * k} fill={COR[cor]} />
        </Peca>
      ))}
      <Peca x={x} y={y + 40 * k} t={t} em={em + 0.2}>
        <rect x={x - 150 * k} y={y + 5 * k} width={300 * k} height={70 * k} rx={35 * k} fill={COR[cor]} />
      </Peca>
    </>
  );
};

/** Chuva: tracinhos arredondados chapados caindo sem parar. `forca` liga aos poucos. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; pingos?: number; cor?: CorPlana}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  pingos = 14,
  cor = 'marClaro',
}) => {
  const {u} = useTela();
  return (
    <>
      {Array.from({length: pingos}, (_, i) => {
        if (i / pingos > forca) return null;
        const fase = (t * (0.9 + acaso(`dp-v${i}`) * 0.4) + acaso(`dp-f${i}`)) % 1;
        const px = x - largura / 2 + ((i + 0.5) / pingos) * largura;
        const py = y + fase * altura;
        return <rect key={i} x={px - 8 * u} y={py} width={16 * u} height={56 * u} rx={8 * u} fill={COR[cor]} opacity={fase > 0.85 ? (1 - fase) / 0.15 : 1} />;
      })}
    </>
  );
};

/** Mar em três faixas de onda chapadas que sobem com mola e correm de lado. */
export const Mar: React.FC<{y: number; t: number; em?: number}> = ({y, t, em = 0}) => {
  const {L, A, u} = useTela();
  const larg = 240 * u;
  const cores: CorPlana[] = ['marClaro', 'mar', 'mar2'];
  return (
    <>
      {cores.map((c, n) => {
        const s = mola(t, em + n * 0.12, 16);
        const desl = ((t * (60 + n * 30) * u + n * 90 * u) % larg) - larg;
        const yy = y + n * 70 * u + (1 - s) * A * 0.5;
        const ondas = Math.ceil(L / larg) + 2;
        const d = `M${desl},${yy} ${Array.from({length: ondas}, () => `q${larg / 4},${-40 * u} ${larg / 2},0 t${larg / 2},0`).join(' ')} V${A} H${desl} Z`;
        return <path key={n} d={d} fill={COR[c]} />;
      })}
    </>
  );
};

/** Árvore/planta chapada: tronco de pílula e copa de círculo, crescendo com mola. */
export const Planta: React.FC<Desenho & {variante?: number}> = ({x, y, tam = 300, t, em = 0, variante = 0}) => {
  const k = tam / 300;
  const s = mola(t, em, 9);
  const venta = balanco(t, 0.9, variante) * 3;
  if (s <= 0.001) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${venta})`}>
      <rect x={-16 * k} y={-170 * k} width={32 * k} height={170 * k} rx={8 * k} fill={COR.terra} />
      <circle cy={-220 * k} r={(variante % 2 ? 95 : 115) * k} fill={variante % 2 ? COR.verde : COR.verde2} />
      <circle cx={-40 * k} cy={-250 * k} r={38 * k} fill={variante % 2 ? COR.verde2 : COR.verde} />
      {variante % 2 === 0 && <circle cx={55 * k} cy={-245 * k} r={22 * k} fill={COR.coral} />}
    </g>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <AbsoluteFill>
        <Tela>
          <FundoCena cor="noite" />
          <Peca x={L / 2} y={A * 0.5} t={t} em={0}>
            <circle cx={L / 2} cy={A * 0.5} r={(280 + 16 * Math.sin(t * 2)) * u} fill={COR.mar} />
          </Peca>
          <Chuva x={L / 2} y={A * 0.33} largura={360 * u} altura={A * 0.25} t={t} forca={ramp(t, 0.3, 1)} pingos={8} cor="ceu" />
        </Tela>
      </AbsoluteFill>
      <Etiqueta t={t} em={0.1}>COMO A NATUREZA FUNCIONA</Etiqueta>
      <Manchete t={t} em={0.25} y={A * 0.14}>
        {'O ciclo\nda água'}
      </Manchete>
      <Bola p={ramp(t, dur - 0.5, dur)} cor="laranja" />
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <AbsoluteFill>
        <Tela>
          <FundoCena cor="laranja" />
          <Sol x={L * 0.5} y={A * 0.27} tam={130 * u} t={t} em={0} />
          <Mar y={A * 0.5} t={t} em={0.5} />
          {[0.3, 0.5, 0.7].map((fx, i) => {
            const fase = (t * 0.6 + i / 3) % 1;
            return (
              <rect
                key={i}
                x={L * fx - 10 * u}
                y={A * 0.5 - fase * A * 0.1}
                width={20 * u}
                height={50 * u}
                rx={10 * u}
                fill={COR.laranja}
                opacity={ramp(t, 1.2, 1.5) * (1 - fase)}
              />
            );
          })}
        </Tela>
      </AbsoluteFill>
      <Bola p={ramp(t, dur - 0.5, dur)} cor="ceu" />
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const cresce = 1 + ramp(t, 1, dur) * 0.4;
  return (
    <>
      <AbsoluteFill>
        <Tela>
          <FundoCena cor="ceu" />
          <Mar y={A * 0.5} t={t + 2} />
          {[0, 1, 2, 3].map((i) => {
            const fase = (t * 0.5 + i / 4) % 1;
            return <circle key={i} cx={L * (0.35 + i * 0.1)} cy={A * 0.48 - fase * A * 0.2} r={(14 + fase * 18) * u} fill={COR.branco} opacity={1 - fase} />;
          })}
          <Nuvem x={L * 0.5} y={A * 0.22} tam={300 * u * cresce} t={t} em={0.6} />
        </Tela>
      </AbsoluteFill>
      <Bola p={ramp(t, dur - 0.5, dur)} cor="noite" />
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const pesa = mola(t, 0.3, 8);
  return (
    <>
      <AbsoluteFill>
        <Tela>
          <FundoCena cor="noite" />
          <g transform={`translate(0 ${pesa * 50 * u})`}>
            <Nuvem x={L * 0.5} y={A * 0.17} tam={420 * u} t={t + 3} cor="ceu" />
          </g>
          <Chuva x={L * 0.5} y={A * 0.29} largura={440 * u} altura={A * 0.3} t={t} forca={ramp(t, 0.5, 1.5)} pingos={16} cor="ceu" />
        </Tela>
      </AbsoluteFill>
      <Bola p={ramp(t, dur - 0.5, dur)} cor="ceu" />
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const chao = A * 0.6;
  return (
    <AbsoluteFill>
      <Tela>
        <FundoCena cor="ceu" />
        <Nuvem x={L * 0.5} y={A * 0.12} tam={340 * u} t={t + 3} />
        <Chuva x={L * 0.5} y={A * 0.17} largura={420 * u} altura={A * 0.3} t={t} pingos={10} forca={1 - ramp(t, 2.5, 3.5)} />
        <Peca x={L / 2} y={A} t={t} em={0} firme={16}>
          <circle cx={L * 0.2} cy={chao + 820 * u} r={860 * u} fill={COR.verde2} />
          <circle cx={L * 0.85} cy={chao + 860 * u} r={820 * u} fill={COR.verde} />
        </Peca>
        <Planta x={L * 0.5} y={chao + 30 * u} tam={300 * u} t={t} em={0.6} />
        <Planta x={L * 0.22} y={chao + 50 * u} tam={190 * u} t={t} em={1.2} variante={1} />
        <Planta x={L * 0.8} y={chao + 60 * u} tam={170 * u} t={t} em={1.6} variante={2} />
      </Tela>
    </AbsoluteFill>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, que já está na manchete: sem legenda nesse trecho
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
