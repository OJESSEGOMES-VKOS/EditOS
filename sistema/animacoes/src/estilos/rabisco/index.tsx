// ESTILO: Rabisco de canetão
// Folha branca de bloco de desenho, canetão preto grosso com traço que ferve
// (o tremor muda 8 vezes por segundo, como animação feita à mão) e a cor entra
// por baixo, num borrão de marca-texto um pouco fora do contorno. A cena sai
// num rabisco de marca-texto que cobre a tela. Bom pra explicação leve,
// curiosidade e ideia simples.
//
// As quatro partes, como no molde:
//   1. `tema`      cores, fundo e legenda
//   2. as peças    Canetao, Borrao, Letra, Riscado
//   3. os desenhos Sol, Nuvem, Chuva, Mar, Planta, Seta
//   4. `Exemplo`   o ciclo da água contado neste estilo
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarMarker} from '@remotion/google-fonts/CaveatBrush';
import {loadFont as carregarPatrick} from '@remotion/google-fonts/PatrickHand';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, Traco, acaso, balanco, caminho, cenasPorFrase, chega, circulo, emFila, ramp, tremer, useTela} from '../../kit';

const {fontFamily: MARCADOR} = carregarMarker('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: MAO} = carregarPatrick('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** Preto de canetão e as cores de marca-texto (sempre por baixo do preto, translúcidas). */
export const COR = {
  preto: '#151515',
  amarelo: '#ffe600',
  rosa: '#ff7eb6',
  azul: '#5ec8ff',
  verde: '#7ee36a',
  laranja: '#ffa940',
  papel: '#fdfdfb',
} as const;
export type CorRabisco = keyof typeof COR;

/** Quantas vezes por segundo o traço "ferve" (troca de tremor). */
const FERVE = 8;
const fervura = (t: number) => Math.floor(t * FERVE) % 3;

/** A folha branca de bloco: fibra leve do papel e uma sombrinha de folha no canto. */
const Fundo: React.FC<{t: number}> = () => {
  const {L, A} = useTela();
  return (
    <AbsoluteFill style={{background: COR.papel}}>
      <Tela>
        <defs>
          <filter id="rabisco-fibra">
            <feTurbulence type="fractalNoise" baseFrequency="0.6 0.03" numOctaves={2} seed={5} />
            <feColorMatrix values="0 0 0 0 0.4  0 0 0 0 0.38  0 0 0 0 0.3  0 0 0 0.07 0" />
          </filter>
          <radialGradient id="rabisco-luz" cx="0.5" cy="0.4" r="0.8">
            <stop offset="0.6" stopColor="#000" stopOpacity={0} />
            <stop offset="1" stopColor="#5a5040" stopOpacity={0.12} />
          </radialGradient>
        </defs>
        <rect width={L} height={A} filter="url(#rabisco-fibra)" />
        <rect width={L} height={A} fill="url(#rabisco-luz)" />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'rabisco',
  nome: 'Rabisco de canetão',
  fundo: COR.papel,
  tinta: COR.preto,
  acento: COR.amarelo,
  legenda: {
    fonte: MARCADOR,
    peso: 400,
    tamanho: 84,
    cor: COR.preto,
    destaque: '#e0207a',
    sombra: `0 0 6px ${COR.papel}, 0 0 14px ${COR.papel}, 0 0 3px ${COR.papel}`,
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/**
 * O traço de canetão preto que se desenha e ferve. Duas passadas (uma grossa e
 * uma fina tremida), como quem passa a caneta duas vezes.
 * Precisa de `t` (o segundo da cena) pra ferver.
 */
export const Canetao: React.FC<{
  pontos: Ponto[];
  p: number;
  t: number;
  grossura?: number;
  fechado?: boolean;
  reto?: boolean;
  id?: string;
}> = ({pontos, p, t, grossura = 10, fechado = false, reto = false, id = `${pontos[0][0]}-${pontos[0][1]}-${pontos.length}`}) => {
  const {u} = useTela();
  const f = fervura(t);
  const a = caminho(tremer(pontos, `${id}a${f}`, 4 * u), fechado, reto);
  const b = caminho(tremer(pontos, `${id}b${f}`, 7 * u), fechado, reto);
  return (
    <>
      <Traco d={a} p={p} stroke={COR.preto} strokeWidth={grossura * u} />
      <Traco d={b} p={p} stroke={COR.preto} strokeWidth={grossura * 0.35 * u} opacity={0.7} />
    </>
  );
};

/**
 * O borrão de marca-texto: a cor da forma, pintada por baixo, um pouco
 * deslocada do contorno, em pinceladas largas e translúcidas.
 */
export const Borrao: React.FC<{pontos: Ponto[]; p: number; cor: CorRabisco; id?: string}> = ({pontos, p, cor, id = `b${pontos[0][0]}-${pontos.length}`}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const xs = pontos.map((q) => q[0]);
  const ys = pontos.map((q) => q[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const passo = 34 * u;
  const n = Math.max(1, Math.ceil((y1 - y0) / passo));
  const dx = 14 * u;
  const dy = 10 * u;
  return (
    <g opacity={0.75} style={{mixBlendMode: 'multiply'}}>
      <clipPath id={`rabisco-corte-${id}`}>
        <path d={caminho(pontos, true)} transform={`translate(${dx} ${dy})`} />
      </clipPath>
      <g clipPath={`url(#rabisco-corte-${id})`} stroke={COR[cor]} strokeWidth={passo * 1.35} strokeLinecap="round">
        {Array.from({length: n + 1}, (_, i) => {
          const q = ramp(p, (i / (n + 1)) * 0.7, (i / (n + 1)) * 0.7 + 0.3, chega);
          if (q <= 0) return null;
          const y = y0 + dy + i * passo + (acaso(`${id}${i}`) - 0.5) * 8 * u;
          const ida = i % 2 === 0;
          const xa = ida ? x0 : x1 + 2 * dx;
          const xb = ida ? x1 + 2 * dx : x0;
          return <line key={i} x1={xa} y1={y} x2={xa + (xb - xa) * q} y2={y - 6 * u} />;
        })}
      </g>
    </g>
  );
};

/** Forma completa: borrão de cor por baixo e contorno de canetão por cima. */
export const Forma: React.FC<{pontos: Ponto[]; p: number; t: number; cor?: CorRabisco; grossura?: number; reto?: boolean; id?: string}> = ({
  pontos,
  p,
  t,
  cor,
  grossura = 10,
  reto = false,
  id,
}) => (
  <>
    {cor && <Borrao pontos={pontos} p={ramp(p, 0.45, 1)} cor={cor} id={id} />}
    <Canetao pontos={pontos} p={ramp(p, 0, 0.6)} t={t} fechado grossura={grossura} reto={reto} id={id} />
  </>
);

/** Letra de canetão, que entra palavra por palavra com um tranquinho, levemente torta. */
export const Letra: React.FC<{
  x: number;
  y: number;
  children: string;
  p: number;
  tamanho?: number;
  cor?: CorRabisco;
  giro?: number;
  mao?: boolean;
}> = ({x, y, children, p, tamanho = 80, cor = 'preto', giro = -3, mao = false}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const palavras = children.split(' ');
  const n = Math.ceil(palavras.length * Math.min(1, p));
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      transform={`rotate(${giro} ${x} ${y})`}
      fontFamily={mao ? MAO : MARCADOR}
      fontSize={tamanho * u}
      fill={COR[cor]}
    >
      {palavras.slice(0, n).join(' ')}
    </text>
  );
};

/**
 * Riscado: a transição do estilo. Um marca-texto amarelo gigante rabisca a tela
 * em zigue-zague e, quando a tela está coberta, a cena seguinte começa.
 */
export const Riscado: React.FC<{p: number; cor?: CorRabisco}> = ({p, cor = 'amarelo'}) => {
  const {L, A, u} = useTela();
  if (p <= 0) return null;
  const faixas = 7;
  const alto = A / faixas;
  const pts: Ponto[] = [];
  for (let i = 0; i <= faixas; i++) {
    const y = i * alto;
    pts.push(i % 2 === 0 ? [-80 * u, y] : [L + 80 * u, y]);
  }
  const d = caminho(pts, false, true);
  return (
    <AbsoluteFill>
      <Tela>
        <Traco d={d} p={ramp(p, 0, 0.85)} stroke={COR[cor]} strokeWidth={alto * 1.5} opacity={0.95} strokeLinecap="round" />
        <rect width={L} height={A} fill={COR.papel} opacity={ramp(p, 0.88, 1)} />
      </Tela>
    </AbsoluteFill>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Todo desenho é uma lista de pontos: `Forma` (contorno + cor por baixo) ou
// `Canetao` (só linha). Poucos traços, forma redondinha, um olho de bolinha se
// a coisa for "viva" no assunto. Todos recebem `t` pra ferver.

type Desenho = {x: number; y: number; tam?: number; p: number; t: number};

export const Sol: React.FC<Desenho> = ({x, y, tam = 150, p, t}) => {
  const raios = 9;
  return (
    <>
      <Forma id="r-sol" pontos={circulo(x, y, tam * 0.5)} p={ramp(p, 0, 0.6)} t={t} cor="amarelo" />
      {Array.from({length: raios}, (_, i) => {
        const a = (i / raios) * Math.PI * 2 + 0.3;
        const r0 = tam * 0.68;
        const r1 = tam * (0.95 + balanco(t, 2, i) * 0.08);
        return (
          <Canetao
            key={i}
            id={`r-raio${i}`}
            reto
            t={t}
            grossura={8}
            pontos={[
              [x + Math.cos(a) * r0, y + Math.sin(a) * r0],
              [x + Math.cos(a) * r1, y + Math.sin(a) * r1],
            ]}
            p={emFila(p, 0.5, 0.5, i, raios)}
          />
        );
      })}
    </>
  );
};

export const Nuvem: React.FC<Desenho & {cor?: CorRabisco}> = ({x, y, tam = 300, p, t, cor = 'azul'}) => {
  const w = tam;
  const h = tam * 0.45;
  const pontos: Ponto[] = [
    [x - w * 0.48, y + h * 0.45],
    [x - w * 0.55, y + h * 0.0],
    [x - w * 0.36, y - h * 0.3],
    [x - w * 0.2, y - h * 0.7],
    [x + w * 0.06, y - h * 0.85],
    [x + w * 0.26, y - h * 0.5],
    [x + w * 0.48, y - h * 0.35],
    [x + w * 0.56, y + h * 0.1],
    [x + w * 0.44, y + h * 0.48],
    [x, y + h * 0.52],
  ];
  return <Forma id={`r-nuvem${Math.round(x)}`} pontos={pontos} p={p} t={t} cor={cor} />;
};

/** Pingos em gota (contorno preto, cor azul) caindo sem parar. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; pingos?: number}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  pingos = 10,
}) => {
  const {u} = useTela();
  return (
    <>
      {Array.from({length: pingos}, (_, i) => {
        if (i / pingos > forca) return null;
        const fase = (t * (0.7 + acaso(`r-v${i}`) * 0.4) + acaso(`r-f${i}`)) % 1;
        const px = x - largura / 2 + ((i + acaso(`r-x${i}`) * 0.6) / pingos) * largura;
        const py = y + fase * altura;
        const s = 26 * u;
        const gota: Ponto[] = [
          [px, py - s],
          [px + s * 0.55, py + s * 0.3],
          [px, py + s * 0.8],
          [px - s * 0.55, py + s * 0.3],
        ];
        return <Forma key={i} id={`r-gota${i}`} pontos={gota} p={1} t={t} cor="azul" grossura={6} />;
      })}
    </>
  );
};

/** Mar: um bloco de ondas em "m" deitado, com azul por baixo. */
export const Mar: React.FC<{y: number; p: number; t: number; x0?: number; x1?: number}> = ({y, p, t, x0, x1}) => {
  const {L, A, u} = useTela();
  const a = x0 ?? 70 * u;
  const b = x1 ?? L - 70 * u;
  const n = 7;
  const larg = (b - a) / n;
  const topo: Ponto[] = [];
  for (let i = 0; i <= n * 2; i++) topo.push([a + (larg / 2) * i, y + (i % 2 ? -1 : 1) * 16 * u + Math.sin(t * 2 + i) * 5 * u]);
  const fundo = Math.min(y + 230 * u, A * 0.6);
  const bloco: Ponto[] = [...topo, [b, fundo], [a, fundo]];
  return (
    <>
      <Borrao id="r-mar" pontos={bloco} p={ramp(p, 0.4, 1)} cor="azul" />
      <Canetao id="r-onda" pontos={topo} p={ramp(p, 0, 0.6)} t={t} grossura={10} />
      {[0.3, 0.65].map((fy, k) => (
        <Canetao
          key={k}
          id={`r-ondinha${k}`}
          t={t}
          grossura={6}
          pontos={Array.from({length: 5}, (_, i) => [a + (b - a) * (0.15 + k * 0.4) + i * 30 * u, y + (fundo - y) * fy + (i % 2 ? -8 : 8) * u] as Ponto)}
          p={ramp(p, 0.5 + k * 0.15, 0.9 + k * 0.1)}
        />
      ))}
    </>
  );
};

/** Plantinha num vaso de traço: caule, duas folhas redondas e um broto. */
export const Planta: React.FC<Desenho> = ({x, y, tam = 360, p, t}) => {
  const alto = tam * ramp(p, 0, 0.6, chega);
  const venta = balanco(t, 0.9) * tam * 0.03;
  const folha = (lado: 1 | -1, altura: number, abre: number): Ponto[] => {
    const by = y - alto * altura;
    const bx = x + venta * altura;
    const c = tam * 0.32 * abre;
    return circulo(bx + lado * c * 0.5, by - c * 0.15, c * 0.5, c * 0.28, 10);
  };
  return (
    <>
      <Canetao id="r-caule" pontos={[[x, y], [x + venta * 0.5, y - alto * 0.5], [x + venta, y - alto]]} p={p > 0 ? 1 : 0} t={t} grossura={10} />
      {p > 0.3 && <Forma id="r-folhaE" pontos={folha(-1, 0.45, ramp(p, 0.3, 0.7, chega))} p={1} t={t} cor="verde" />}
      {p > 0.45 && <Forma id="r-folhaD" pontos={folha(1, 0.72, ramp(p, 0.45, 0.85, chega))} p={1} t={t} cor="verde" />}
      {p > 0.6 && <Forma id="r-broto" pontos={folha(-1, 1, ramp(p, 0.6, 1, chega) * 0.7)} p={1} t={t} cor="verde" />}
    </>
  );
};

/** Seta torta de canetão. */
export const Seta: React.FC<{de: Ponto; ate: Ponto; p: number; t: number; curva?: number}> = ({de, ate, p, t, curva = 0.4}) => {
  const {u} = useTela();
  const meio: Ponto = [(de[0] + ate[0]) / 2 + curva * (ate[1] - de[1]) * 0.3, (de[1] + ate[1]) / 2 - curva * (ate[0] - de[0]) * 0.3];
  const ang = Math.atan2(ate[1] - meio[1], ate[0] - meio[0]);
  const asa = 36 * u;
  const ponta = (l: number): Ponto => [ate[0] - Math.cos(ang + l * 0.55) * asa, ate[1] - Math.sin(ang + l * 0.55) * asa];
  return (
    <>
      <Canetao id={`r-seta${Math.round(de[0])}`} pontos={[de, meio, ate]} p={ramp(p, 0, 0.7)} t={t} grossura={8} />
      <Canetao id={`r-ponta${Math.round(de[0])}`} reto pontos={[ponta(1), ate, ponta(-1)]} p={ramp(p, 0.65, 1)} t={t} grossura={8} />
    </>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const sub: Ponto[] = [
    [L * 0.2, A * 0.36 + 60 * u],
    [L * 0.8, A * 0.36 + 50 * u],
  ];
  return (
    <>
      <Tela>
        <Borrao id="r-marca" pontos={[[L * 0.18, A * 0.26], [L * 0.82, A * 0.26], [L * 0.82, A * 0.37], [L * 0.18, A * 0.37]]} p={ramp(t, 0.6, 1.3)} cor="amarelo" />
        <Letra x={L / 2} y={A * 0.24} p={ramp(t, 0, 0.3)} tamanho={120}>
          O ciclo
        </Letra>
        <Letra x={L / 2} y={A * 0.24 + 140 * u} p={ramp(t, 0.25, 0.6)} tamanho={130}>
          da água
        </Letra>
        <Canetao id="r-sub" pontos={sub} p={ramp(t, 0.9, 1.4)} t={t} grossura={9} />
        <Chuva x={L * 0.5} y={A * 0.08} largura={L * 0.7} altura={A * 0.08} t={t} pingos={5} />
      </Tela>
      <Riscado p={ramp(t, dur - 0.55, dur)} />
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Sol x={L * 0.66} y={A * 0.2} tam={170 * u} p={ramp(t, 0, 1)} t={t} />
        <Mar y={A * 0.44} p={ramp(t, 0.3, 1.2)} t={t} />
        {[0.24, 0.42].map((fx, i) => (
          <Seta key={i} de={[L * fx, A * 0.41]} ate={[L * fx + 20 * u, A * 0.28]} p={ramp(t, 1.1 + i * 0.25, 1.8 + i * 0.25)} t={t} />
        ))}
        <Letra x={L * 0.3} y={A * 0.22} p={ramp(t, 1.6, 1.7)} tamanho={64} cor="preto" giro={-8}>
          quente!
        </Letra>
      </Tela>
      <Riscado p={ramp(t, dur - 0.55, dur)} cor="azul" />
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Mar y={A * 0.5} p={1} t={t} />
        {[0, 1, 2].map((i) => {
          const fase = (t * 0.5 + i / 3) % 1;
          const px = L * (0.35 + i * 0.15);
          const py = A * 0.47 - fase * A * 0.12;
          return (
            <Canetao
              key={i}
              id={`r-vapor${i}`}
              t={t}
              grossura={7}
              pontos={Array.from({length: 4}, (_, k) => [px + (k % 2 ? 18 : -18) * u, py - k * 30 * u] as Ponto)}
              p={ramp(t, 0.1 + i * 0.15, 0.6 + i * 0.15)}
            />
          );
        })}
        <Nuvem x={L * 0.5} y={A * 0.22} tam={(340 + ramp(t, 0.8, dur) * 160) * u} p={ramp(t, 0.5, 1.6)} t={t} cor="azul" />
      </Tela>
      <Riscado p={ramp(t, dur - 0.55, dur)} cor="rosa" />
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const pesa = ramp(t, 0.2, 1, chega);
  return (
    <>
      <Tela>
        <g transform={`translate(0 ${pesa * 30 * u})`}>
          <Nuvem x={L * 0.5} y={A * 0.2} tam={520 * u} p={1} t={t} cor={t > 0.8 ? 'azul' : 'rosa'} />
        </g>
        <Chuva x={L * 0.5} y={A * 0.32} largura={420 * u} altura={A * 0.26} t={t} forca={ramp(t, 0.5, 1.6)} />
      </Tela>
      <Riscado p={ramp(t, dur - 0.55, dur)} cor="verde" />
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const chao = A * 0.58;
  return (
    <Tela>
      <Nuvem x={L * 0.5} y={A * 0.15} tam={440 * u} p={1} t={t} cor="azul" />
      <Chuva x={L * 0.5} y={A * 0.22} largura={360 * u} altura={A * 0.2} t={t} pingos={7} />
      <Forma
        id="r-terra"
        pontos={[
          [L * 0.16, chao],
          [L * 0.84, chao],
          [L * 0.8, chao + 40 * u],
          [L * 0.2, chao + 40 * u],
        ]}
        p={ramp(t, 0, 0.6)}
        t={t}
        cor="laranja"
        grossura={9}
      />
      <Planta x={L * 0.5} y={chao} tam={300 * u} p={ramp(t, 0.5, 2.6)} t={t} />
    </Tela>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, que já está escrito na folha: sem legenda nesse trecho
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
