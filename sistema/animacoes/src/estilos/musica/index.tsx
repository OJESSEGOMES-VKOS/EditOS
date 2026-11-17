// ESTILO: Música visual
// Uma noite funda cheia de pontos de luz que pulsam numa batida: a cada tempo um
// grupo de estrelas acende, o mar de pontos sobe quando alguém fala, e as coisas
// se formam de poeira de luz. Não usa som nenhum: a batida sai do relógio e a
// força sai da fala. Bom pra clima, ritmo, revelação e curiosidade.
//
//   1. `tema`      cores, fundo e legenda
//   2. as peças    batida, energia, luz que se desenha, poeira, onda de pontos, letreiro, clarão
//   3. os desenhos alguns objetos prontos, pra servir de exemplo
//   4. `Exemplo`   a história-padrão (o ciclo da água) contada neste estilo
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarJosefin} from '@remotion/google-fonts/JosefinSans';
import type {Fala, Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, Traco, acaso, balanco, caminho, cenasPorFrase, chega, ramp, useTela} from '../../kit';

const {fontFamily: JOS} = carregarJosefin('normal', {weights: ['300', '700'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As luzes. Tudo brilha: nada de cor chapada. */
export const COR = {
  branco: '#ffffff',
  ouro: '#ffd98a',
  azul: '#9ad4ff',
  lilas: '#c9a8ff',
  rosa: '#ff9ec7',
  verde: '#9dffc4',
} as const;
export type CorLuz = keyof typeof COR;
const LUZES = Object.keys(COR) as CorLuz[];

/** A batida do estilo, em batidas por minuto. */
export const BPM = 100;

/** Em que batida estamos: `n` (o número dela), `desde` (segundos desde que bateu) e `pulso` (1 na batida, cai rápido). */
export const batida = (t: number, bpm = BPM) => {
  const passo = 60 / bpm;
  const n = Math.floor(t / passo);
  const desde = t - n * passo;
  return {n, desde, pulso: Math.exp(-desde / 0.18)};
};

/** A força da fala agora: sobe em cada palavra dita e cai devagar. De 0 a 1. Faz o papel do volume. */
export const energia = (fala: Fala, tv: number) => {
  let e = 0;
  for (const f of fala.frases) {
    if (tv < f.s || tv > f.e + 1.5) continue;
    for (const w of f.palavras) if (tv >= w.s) e = Math.max(e, Math.exp(-(tv - w.s) / 0.45));
  }
  return Math.min(1, e);
};

const ESTRELAS = Array.from({length: 200}, (_, i) => ({
  x: acaso(`mx${i}`),
  y: Math.pow(acaso(`my${i}`), 1.15),
  s: 0.6 + acaso(`ms${i}`) * 1.5,
  c: LUZES[Math.floor(acaso(`mc${i}`) * 4)],
  g: i % 12,
}));

/** A noite: degradê fundo e um céu de estrelas em que um grupo acende a cada batida. */
const Fundo: React.FC<{t: number}> = ({t}) => {
  const {L, A, u} = useTela();
  const b = batida(t);
  const grupo = ((b.n % 12) + 12) % 12;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #020208 0%, #0a0b30 40%, #1c1040 72%, #020208 100%)'}}>
      <Tela>
        <defs>
          {LUZES.map((c) => (
            <radialGradient key={c} id={`musica-luz-${c}`}>
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.16" stopColor={COR[c]} />
              <stop offset="0.45" stopColor={COR[c]} stopOpacity={0.3} />
              <stop offset="1" stopColor={COR[c]} stopOpacity={0} />
            </radialGradient>
          ))}
          <filter id="musica-brilho" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation={8 * u} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={L / 2} cy={A * 0.42} r={L * (0.42 + 0.04 * b.pulso)} fill="url(#musica-luz-lilas)" opacity={0.18} />
        {ESTRELAS.map((e, i) => {
          const acesa = e.g === grupo ? b.pulso : 0;
          const tw = 0.8 + 0.2 * Math.sin(t * 2.6 + i);
          return (
            <circle
              key={i}
              cx={e.x * L}
              cy={e.y * A}
              r={e.s * 9 * u * tw * (1 + acesa)}
              fill={`url(#musica-luz-${e.c})`}
              opacity={0.28 + 0.72 * acesa}
            />
          );
        })}
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'musica',
  nome: 'Música visual',
  fundo: '#05061a',
  tinta: COR.branco,
  acento: COR.ouro,
  legenda: {
    fonte: JOS,
    peso: 700,
    tamanho: 62,
    cor: '#ffffff',
    destaque: COR.ouro,
    sombra: '0 0 22px rgba(255,217,138,0.55), 0 2px 6px #020208, 0 0 4px #020208',
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** Um ponto de luz redondo. Use dentro de <Tela>. */
export const Brilho: React.FC<{x: number; y: number; r: number; cor?: CorLuz; opacity?: number}> = ({x, y, r, cor = 'branco', opacity = 1}) =>
  r > 0 ? <circle cx={x} cy={y} r={r} fill={`url(#musica-luz-${cor})`} opacity={opacity} /> : null;

/** Um fio de luz que se desenha, com brilho em volta. `pulso` (0 a 1) acende mais forte na batida. */
export const Luz: React.FC<{pontos: Ponto[]; p: number; cor?: CorLuz; grossura?: number; fechado?: boolean; pulso?: number}> = ({
  pontos,
  p,
  cor = 'ouro',
  grossura = 6,
  fechado = false,
  pulso = 0,
}) => {
  const {u} = useTela();
  return (
    <Traco
      d={caminho(pontos, fechado)}
      p={p}
      stroke={COR[cor]}
      strokeWidth={grossura * u}
      opacity={0.7 + 0.3 * pulso}
      filter="url(#musica-brilho)"
    />
  );
};

/**
 * Poeira de luz que se junta numa forma. `alvos` são os pontos onde cada grão para;
 * com `p` = 0 os grãos estão espalhados pela tela, com `p` = 1 a forma está pronta.
 */
export const Poeira: React.FC<{alvos: Ponto[]; p: number; t: number; cor?: CorLuz; tam?: number; semente?: string; pulso?: number; deY?: number}> = ({
  alvos,
  p,
  t,
  cor = 'branco',
  tam = 16,
  semente = 'po',
  pulso = 0,
  deY,
}) => {
  const {L, A, u} = useTela();
  const q = chega(Math.max(0, Math.min(1, p)));
  return (
    <>
      {alvos.map(([ax, ay], i) => {
        const ox = acaso(`${semente}ox${i}`) * L;
        const oy = deY ?? acaso(`${semente}oy${i}`) * A * 0.6;
        const gira = Math.sin(q * Math.PI) * 60 * u;
        const ang = acaso(`${semente}a${i}`) * 6.28;
        const x = ox + (ax - ox) * q + Math.cos(ang) * gira + balanco(t, 0.7, i) * 3 * u;
        const y = oy + (ay - oy) * q + Math.sin(ang) * gira + balanco(t, 0.6, i + 9) * 3 * u;
        const r = tam * u * (0.6 + acaso(`${semente}r${i}`) * 0.8) * (1 + 0.5 * pulso);
        return <Brilho key={i} x={x} y={y} r={r} cor={cor} opacity={0.35 + 0.65 * q} />;
      })}
    </>
  );
};

/** O mar de pontos: linhas de luz que ondulam. `forca` (0 a 1) levanta as ondas, ligue na `energia` da fala. */
export const OndaDePontos: React.FC<{y: number; t: number; forca?: number; p?: number; linhas?: number; cor?: CorLuz; x0?: number; x1?: number}> = ({
  y,
  t,
  forca = 0.3,
  p = 1,
  linhas = 4,
  cor = 'azul',
  x0,
  x1,
}) => {
  const {L, u} = useTela();
  const a = x0 ?? -20 * u;
  const b = x1 ?? L + 20 * u;
  const passo = 22 * u;
  const n = Math.ceil((b - a) / passo);
  const amp = (14 + forca * 60) * u;
  return (
    <>
      {Array.from({length: linhas}, (_, l) =>
        Array.from({length: n + 1}, (_, i) => {
          if (i / n > p) return null;
          const x = a + i * passo;
          const yy = y + l * 46 * u + Math.sin(x * 0.006 / u + t * 2.4 + l) * amp * (1 - l * 0.15) + Math.sin(x * 0.025 / u - t * 3) * amp * 0.25;
          return <Brilho key={`${l}-${i}`} x={x} y={yy} r={(9 + l * 2 + forca * 6) * u} cor={cor} opacity={0.45 + 0.12 * l} />;
        })
      )}
    </>
  );
};

/** Texto de luz, espaçado, que sobe e acende. */
export const Letreiro: React.FC<{x: number; y: number; children: string; p: number; tamanho?: number; cor?: CorLuz; fino?: boolean; espaco?: number}> = ({
  x,
  y,
  children,
  p,
  tamanho = 96,
  cor = 'branco',
  fino = false,
  espaco = 0.12,
}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  return (
    <text
      x={x}
      y={y + (1 - p) * 30 * u}
      textAnchor="middle"
      fontFamily={JOS}
      fontWeight={fino ? 300 : 700}
      fontSize={tamanho * u}
      letterSpacing={`${espaco}em`}
      fill={COR[cor]}
      opacity={p}
      filter="url(#musica-brilho)"
    >
      {children}
    </text>
  );
};

/** A transição: um clarão de luz que nasce do centro e apaga. Ponha no começo da cena, por cima, com `p` de 0 a 1. */
export const Clarao: React.FC<{p: number; cor?: CorLuz}> = ({p, cor = 'ouro'}) => {
  if (p <= 0 || p >= 1) return null;
  const a = Math.sin(p * Math.PI);
  return (
    <AbsoluteFill
      style={{background: `radial-gradient(circle at 50% 42%, ${COR[cor]} 0%, ${COR[cor]}55 ${20 + p * 40}%, transparent ${40 + p * 60}%)`, opacity: a * 0.85, mixBlendMode: 'screen'}}
    />
  );
};

// ---------- 3. alguns desenhos prontos ----------

type Desenho = {x: number; y: number; tam?: number; p: number; t: number; pulso?: number};

/** Sol: um núcleo de luz e um anel que respira na batida. */
export const Sol: React.FC<Desenho> = ({x, y, tam = 150, p, t, pulso = 0}) => {
  const {u} = useTela();
  const q = ramp(p, 0, 1, chega);
  const raios = 12;
  return (
    <>
      <Brilho x={x} y={y} r={tam * 1.6 * q} cor="ouro" opacity={0.5} />
      <Brilho x={x} y={y} r={tam * 0.9 * q * (1 + 0.12 * pulso)} cor="branco" />
      <circle cx={x} cy={y} r={tam * 0.75 * q * (1 + 0.1 * pulso)} fill="none" stroke={COR.ouro} strokeWidth={4 * u} opacity={0.6 + 0.4 * pulso} filter="url(#musica-brilho)" />
      {Array.from({length: raios}, (_, i) => {
        const a = (i / raios) * Math.PI * 2 + t * 0.3;
        const r0 = tam * 0.95;
        const r1 = tam * (1.25 + 0.15 * pulso + (i % 2) * 0.12);
        return <Luz key={i} pontos={[[x + Math.cos(a) * r0, y + Math.sin(a) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1]]} p={ramp(p, 0.4, 1)} grossura={5} pulso={pulso} />;
      })}
    </>
  );
};

/** Os pontos de dentro de uma nuvem (quatro bolhas). */
export const pontosDeNuvem = (x: number, y: number, tam: number, n = 120): Ponto[] => {
  const bolhas = [
    [-0.3, 0.08, 0.24],
    [0, -0.1, 0.32],
    [0.3, 0.06, 0.24],
    [0.02, 0.14, 0.26],
  ];
  const saida: Ponto[] = [];
  for (let k = 0; saida.length < n && k < n * 20; k++) {
    const px = (acaso(`nx${k}`) - 0.5) * 1.2;
    const py = (acaso(`ny${k}`) - 0.5) * 0.9;
    if (bolhas.some(([bx, by, br]) => (px - bx) ** 2 + (py - by) ** 2 < br * br)) saida.push([x + px * tam, y + py * tam * 0.8]);
  }
  return saida;
};

/** Nuvem: poeira de luz que se junta em forma de nuvem. */
export const Nuvem: React.FC<Desenho & {cor?: CorLuz; deY?: number}> = ({x, y, tam = 420, p, t, pulso = 0, cor = 'branco', deY}) => {
  const alvos = React.useMemo(() => pontosDeNuvem(x, y, tam), [x, y, tam]);
  return <Poeira alvos={alvos} p={p} t={t} cor={cor} tam={17} semente="nuvem" pulso={pulso} deY={deY} />;
};

/** Chuva: riscos de luz caindo, mais fortes na batida. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; pulso?: number; pingos?: number}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  pulso = 0,
  pingos = 22,
}) => {
  const {u} = useTela();
  return (
    <g filter="url(#musica-brilho)">
      {Array.from({length: pingos}, (_, i) => {
        if (i / pingos > forca) return null;
        const fase = (t * (0.8 + acaso(`cv${i}`) * 0.5) + acaso(`cf${i}`)) % 1;
        const px = x - largura / 2 + acaso(`cx${i}`) * largura;
        const py = y + fase * altura;
        return <line key={i} x1={px} y1={py} x2={px} y2={py + 50 * u} stroke={COR.azul} strokeWidth={5 * u} strokeLinecap="round" opacity={(0.5 + 0.5 * pulso) * (1 - fase * 0.6)} />;
      })}
    </g>
  );
};

/** Mar: a onda de pontos. */
export const Mar = OndaDePontos;

/** Planta: um fio de luz que sobe e abre folhas de luz; na ponta acende uma flor. */
export const Planta: React.FC<Desenho> = ({x, y, tam = 360, p, t, pulso = 0}) => {
  const venta = balanco(t, 0.7) * tam * 0.04;
  const alto = tam * ramp(p, 0, 0.6, chega);
  const caule: Ponto[] = [
    [x, y],
    [x + venta * 0.4, y - alto * 0.5],
    [x + venta, y - alto],
  ];
  const folha = (lado: 1 | -1, h: number, abre: number): Ponto[] => {
    const by = y - alto * h;
    const bx = x + venta * h;
    const c = tam * 0.32 * abre;
    return [
      [bx, by],
      [bx + lado * c * 0.5, by - c * 0.5],
      [bx + lado * c, by - c * 0.25],
      [bx + lado * c * 0.55, by + c * 0.12],
    ];
  };
  return (
    <>
      <Luz pontos={caule} p={p > 0 ? 1 : 0} cor="verde" grossura={7} pulso={pulso} />
      {p > 0.3 && <Luz pontos={folha(-1, 0.45, ramp(p, 0.3, 0.7, chega))} p={1} cor="verde" fechado pulso={pulso} />}
      {p > 0.45 && <Luz pontos={folha(1, 0.7, ramp(p, 0.45, 0.85, chega))} p={1} cor="verde" fechado pulso={pulso} />}
      {p > 0.75 && <Brilho x={x + venta} y={y - alto} r={tam * 0.16 * ramp(p, 0.75, 1, chega) * (1 + 0.3 * pulso)} cor="rosa" />}
    </>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, tv, fala}) => {
  const {L, A} = useTela();
  const pulso = batida(tv).pulso;
  return (
    <Tela>
      <Letreiro x={L / 2} y={A * 0.3} p={ramp(t, 0, 0.5)} tamanho={56} fino espaco={0.4} cor="ouro">
        O CICLO
      </Letreiro>
      <Letreiro x={L / 2} y={A * 0.4} p={ramp(t, 0.15, 0.7)} tamanho={130}>
        da água
      </Letreiro>
      <OndaDePontos y={A * 0.5} t={tv} forca={energia(fala, tv) * 0.6 + pulso * 0.2} p={ramp(t, 0, 1)} linhas={3} />
    </Tela>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, tv, fala}) => {
  const {L, A, u} = useTela();
  const pulso = batida(tv).pulso;
  return (
    <>
      <Tela>
        <Sol x={L * 0.62} y={A * 0.22} tam={130 * u} p={ramp(t, 0, 1)} t={tv} pulso={pulso} />
        <OndaDePontos y={A * 0.46} t={tv} forca={0.3 + energia(fala, tv) * 0.7} cor={t > 1 ? 'ouro' : 'azul'} />
      </Tela>
      <Clarao p={ramp(t, 0, 0.6)} />
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, tv, fala}) => {
  const {L, A, u} = useTela();
  const pulso = batida(tv).pulso;
  return (
    <>
      <Tela>
        <OndaDePontos y={A * 0.5} t={tv} forca={0.2 + energia(fala, tv) * 0.5} />
        <Nuvem x={L * 0.5} y={A * 0.24} tam={520 * u} p={ramp(t, 0.1, 1.8)} t={tv} pulso={pulso} deY={A * 0.52} />
      </Tela>
      <Clarao p={ramp(t, 0, 0.6)} cor="azul" />
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, tv}) => {
  const {L, A, u} = useTela();
  const pulso = batida(tv).pulso;
  return (
    <>
      <Tela>
        <Nuvem x={L * 0.5} y={A * 0.22} tam={560 * u} p={1} t={tv} pulso={pulso} cor={t > 0.6 ? 'azul' : 'branco'} />
        <Chuva x={L * 0.5} y={A * 0.3} largura={480 * u} altura={A * 0.28} t={tv} forca={ramp(t, 0.4, 1.6)} pulso={pulso} />
      </Tela>
      <Clarao p={ramp(t, 0, 0.6)} cor="lilas" />
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t, tv, fala}) => {
  const {L, A, u} = useTela();
  const pulso = batida(tv).pulso;
  return (
    <>
      <Tela>
        <Nuvem x={L * 0.5} y={A * 0.17} tam={440 * u} p={1} t={tv} pulso={pulso} cor="azul" />
        <Chuva x={L * 0.5} y={A * 0.24} largura={380 * u} altura={A * 0.12} t={tv} pingos={12} pulso={pulso} />
        <OndaDePontos y={A * 0.58} t={tv} forca={0.1 + energia(fala, tv) * 0.3} linhas={1} cor="verde" p={ramp(t, 0, 0.8)} />
        <Planta x={L * 0.5} y={A * 0.58} tam={400 * u} p={ramp(t, 0.4, 2.6)} t={tv} pulso={pulso} />
      </Tela>
      <Clarao p={ramp(t, 0, 0.6)} cor="verde" />
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
      [1, 1, SolEMar, 0.3],
      [2, 2, VaporENuvem, 0.3],
      [3, 3, NuvemEChuva, 0.3],
      [4, 4, ChuvaEPlanta, 0.3],
    ])}
  />
);
