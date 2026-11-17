// ESTILO: Silhueta
// Minimalismo de pôster: um céu de duas cores em degradê, uma linha de horizonte
// e poucas coisas recortadas em preto chapado contra a luz. Cada cena tem a sua
// hora do dia, e o céu muda de cor com o assunto. Bom pra reflexão, curiosidade
// calma e história com clima.
//
// As quatro partes, como no molde:
//   1. `tema`      cores, fundo e legenda
//   2. as peças    Ceu (a hora do dia), Recorte (a forma preta), Letreiro (texto), Escurece (transição)
//   3. os desenhos Sol, Nuvem, Chuva, Mar, Planta
//   4. `Exemplo`   o ciclo da água
import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {loadFont as carregarMontserrat} from '@remotion/google-fonts/Montserrat';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, caminho, cenasPorFrase, chega, circulo, ramp, useTela} from '../../kit';

const {fontFamily: MONT} = carregarMontserrat('normal', {weights: ['300', '600', '700'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** A cor das silhuetas: quase preto, nunca preto puro. */
export const TINTA = '#0a0a0c';

/** As horas do dia: [céu alto, céu perto do horizonte, chão]. Cada cena escolhe a sua. */
export const HORA = {
  madrugada: ['#141a3a', '#e2865a', '#0e0d14'],
  manha: ['#3b6f9c', '#bcd9ea', '#1d3446'],
  tarde: ['#4f86a8', '#f1d9a8', '#16201a'],
  entardecer: ['#c56a3d', '#f6c27a', '#1c130e'],
  crepusculo: ['#2a2440', '#e7a07a', '#120f17'],
  chuvoso: ['#3d4a5c', '#a9b6c2', '#151a20'],
} as const;
export type Hora = keyof typeof HORA;

/** Altura do horizonte, em fração da tela. */
export const HORIZONTE = 0.6;

const Fundo: React.FC<{t: number}> = () => <Ceu hora="crepusculo" />;

export const tema: Tema = {
  id: 'silhueta',
  nome: 'Silhueta',
  fundo: TINTA,
  tinta: '#ffffff',
  acento: '#ffcf8a',
  legenda: {
    fonte: MONT,
    peso: 700,
    tamanho: 58,
    cor: '#ffffff',
    destaque: '#ffcf8a',
    sombra: '0 2px 14px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.9)',
    altura: 0.74,
    maiuscula: true,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/**
 * O céu e o chão. `hora` é a hora do dia; com `para` e `p` (0 a 1) o céu passa de uma hora pra outra.
 * Ponha primeiro na cena: ele cobre a tela inteira.
 */
export const Ceu: React.FC<{hora: Hora; para?: Hora; p?: number}> = ({hora, para, p = 0}) => {
  const {L, A} = useTela();
  const c = (i: number) => (para ? interpolateColors(p, [0, 1], [HORA[hora][i], HORA[para][i]]) : HORA[hora][i]);
  const hz = A * HORIZONTE;
  // um id por hora, pra o céu de uma cena não pegar o degradê de outra
  const id = `silhueta-ceu-${hora}-${para ?? ''}`;
  return (
    <AbsoluteFill>
      <Tela>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c(0)} />
            <stop offset="1" stopColor={c(1)} />
          </linearGradient>
        </defs>
        <rect width={L} height={hz} fill={`url(#${id})`} />
        <rect y={hz} width={L} height={A - hz} fill={c(2)} />
      </Tela>
    </AbsoluteFill>
  );
};

/**
 * Uma forma recortada em preto. `p` de 0 a 1 faz ela subir do horizonte (ou crescer da base, com `cresce`).
 * `x`, `y` é o pé da forma. Os filhos são desenhados em volta de (0,0), em unidades de tela de 1080.
 */
export const Recorte: React.FC<{x: number; y: number; p: number; escala?: number; cresce?: boolean; cor?: string; children: React.ReactNode}> = ({
  x,
  y,
  p,
  escala = 1,
  cresce = false,
  cor = TINTA,
  children,
}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const q = ramp(p, 0, 1, chega);
  const s = escala * u;
  const tr = cresce ? `translate(${x} ${y}) scale(${s * q})` : `translate(${x} ${y + (1 - q) * 120 * u}) scale(${s})`;
  return (
    <g transform={tr} fill={cor} opacity={cresce ? 1 : q}>
      {children}
    </g>
  );
};

/** Texto fino e espaçado, de pôster, que sobe devagar. Fica no céu, acima do horizonte. */
export const Letreiro: React.FC<{x: number; y: number; children: string; p: number; tamanho?: number; forte?: boolean}> = ({
  x,
  y,
  children,
  p,
  tamanho = 110,
  forte = false,
}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const q = ramp(p, 0, 1, chega);
  return (
    <text
      x={x}
      y={y + (1 - q) * 24 * u}
      textAnchor="middle"
      fontFamily={MONT}
      fontWeight={forte ? 600 : 300}
      fontSize={tamanho * u}
      letterSpacing={forte ? `${0.5 * tamanho * u}` : `${0.04 * tamanho * u}`}
      fill="#ffffff"
      opacity={q}
      style={{textShadow: '0 2px 24px rgba(0,0,0,0.35)'}}
    >
      {forte ? children.toUpperCase() : children}
    </text>
  );
};

/** A transição: a luz vai embora e a tela escurece até a cor da silhueta. No fim da cena. */
export const Escurece: React.FC<{p: number}> = ({p}) => (p <= 0 ? null : <AbsoluteFill style={{background: TINTA, opacity: ramp(p, 0, 1)}} />);

// ---------- 3. os desenhos prontos ----------
// Cada desenho é feito em volta de (0,0), em unidades de uma tela de 1080, e vai dentro de um <Recorte>
// (que põe no lugar, na escala e na cor). Silhueta é contorno reconhecível: perfil, nunca detalhe de dentro.

/** O sol: um disco de luz (não é recorte: é a fonte da luz). */
export const Sol: React.FC<{x: number; y: number; r: number; p?: number}> = ({x, y, r, p = 1}) => (
  <g opacity={p}>
    <circle cx={x} cy={y} r={r * 1.7} fill="#ffe6b8" opacity={0.18} />
    <circle cx={x} cy={y} r={r} fill="#ffcf8a" />
  </g>
);

/** Nuvem em silhueta: três bolas e uma base reta. */
export const Nuvem: React.FC = () => (
  <>
    <circle cx={-90} cy={-40} r={70} />
    <circle cx={10} cy={-80} r={95} />
    <circle cx={110} cy={-40} r={68} />
    <rect x={-160} y={-40} width={340} height={70} rx={35} />
  </>
);

/** Chuva: riscos finos claros contra o céu (a chuva é luz, não recorte). */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; pingos?: number}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  pingos = 28,
}) => {
  const {u} = useTela();
  return (
    <g stroke="#e8eef4" strokeWidth={3 * u} strokeLinecap="round">
      {Array.from({length: pingos}, (_, i) => {
        if (i / pingos >= forca) return null;
        const fase = (t * (1.4 + acaso(`sv${i}`) * 0.6) + acaso(`sf${i}`)) % 1;
        const px = x - largura / 2 + acaso(`sx${i}`) * largura;
        const py = y + fase * altura;
        return <line key={i} x1={px} y1={py} x2={px - 6 * u} y2={py + 40 * u} opacity={0.7 * (1 - fase * 0.6)} />;
      })}
    </g>
  );
};

/** O mar: o chão vira água, com faixas de reflexo que brilham. `luz` é a cor do reflexo. */
export const Mar: React.FC<{p: number; t: number; luz?: string; x?: number}> = ({p, t, luz = '#ffcf8a', x}) => {
  const {L, A, u} = useTela();
  const cx = x ?? L / 2;
  const hz = A * HORIZONTE;
  return (
    <g>
      {[0, 1, 2, 3, 4, 5].map((n) => {
        const w = (420 - n * 55) * u * p * (1 + balanco(t, 0.6, n) * 0.08);
        return <rect key={n} x={cx - w / 2} y={hz + (30 + n * 52) * u} width={w} height={5 * u} rx={2.5 * u} fill={luz} opacity={0.6 - n * 0.08} />;
      })}
    </g>
  );
};

/** Uma planta em silhueta que cresce: `p` sobe o caule e abre as folhas. Pé em (0,0). */
export const Planta: React.FC<{p: number; t?: number}> = ({p, t = 0}) => {
  const alto = 300 * ramp(p, 0, 0.6, chega);
  const venta = balanco(t, 0.7) * 8;
  const folha = (lado: number, h: number, a: number) => {
    const s = ramp(p, a, a + 0.35, chega);
    if (s <= 0) return null;
    const by = -alto * h;
    const pts: Ponto[] = [
      [0, by],
      [lado * 60 * s, by - 50 * s],
      [lado * 130 * s, by - 30 * s],
      [lado * 70 * s, by + 10 * s],
    ];
    return <path d={caminho(pts, true)} />;
  };
  return (
    <g transform={`rotate(${venta * 0.4})`}>
      <path d={`M-7,0 L-4,${-alto} L4,${-alto} L7,0 Z`} />
      {folha(-1, 0.4, 0.3)}
      {folha(1, 0.65, 0.45)}
      {folha(-1, 0.88, 0.6)}
      {p > 0.7 && <path d={caminho(circulo(0, -alto - 14, 18 * ramp(p, 0.7, 1), 24 * ramp(p, 0.7, 1), 10), true)} />}
    </g>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const hz = A * HORIZONTE;
  return (
    <>
      <Ceu hora="madrugada" para="manha" p={ramp(t, 0, dur)} />
      <Tela>
        <Sol x={L / 2} y={hz + 60 * u - ramp(t, 0, dur) * 200 * u} r={120 * u} />
        <rect y={hz} width={L} height={A - hz} fill={HORA.madrugada[2]} />
        <Letreiro x={L / 2} y={A * 0.2} p={ramp(t, 0.1, 0.8)} tamanho={40} forte>
          a natureza
        </Letreiro>
        <Letreiro x={L / 2} y={A * 0.3} p={ramp(t, 0.3, 1.1)} tamanho={130}>
          O ciclo
        </Letreiro>
        <Letreiro x={L / 2} y={A * 0.3 + 145 * u} p={ramp(t, 0.5, 1.3)} tamanho={130}>
          da água
        </Letreiro>
        <rect y={hz - 1} width={L} height={2} fill={TINTA} opacity={0.5} />
      </Tela>
      <Escurece p={ramp(t, dur - 0.4, dur)} />
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const hz = A * HORIZONTE;
  const sobe = ramp(t, 0, 2.2, chega);
  return (
    <>
      <Ceu hora="manha" para="tarde" p={ramp(t, 0, dur)} />
      <Tela>
        <Sol x={L * 0.5} y={hz - 80 * u - sobe * A * 0.25} r={130 * u} />
        <rect y={hz} width={L} height={A - hz} fill={HORA.manha[2]} />
        <Mar p={ramp(t, 0.6, 1.8)} t={t} />
        {/* um barquinho em silhueta dá a escala do mar */}
        <Recorte x={L * 0.22} y={hz + 4 * u} p={ramp(t, 0.8, 1.6)}>
          <path d="M-70,-10 L70,-10 L50,10 L-50,10 Z M0,-10 L0,-110 L50,-20 Z" />
        </Recorte>
        <rect y={hz - 1} width={L} height={2} fill={TINTA} opacity={0.5} />
      </Tela>
      <Escurece p={ramp(t, dur - 0.4, dur)} />
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const hz = A * HORIZONTE;
  const junta = ramp(t, 1, dur, chega);
  return (
    <>
      <Ceu hora="tarde" />
      <Tela>
        <Sol x={L * 0.78} y={A * 0.16} r={80 * u} />
        <rect y={hz} width={L} height={A - hz} fill={HORA.tarde[2]} />
        <Mar p={1} t={t} luz="#f1d9a8" />
        {/* o vapor: fios claros que sobem do mar */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const fase = (t * 0.5 + i / 6) % 1;
          const x = L * (0.25 + i * 0.1) + Math.sin(fase * 6 + i) * 18 * u;
          const y = hz - fase * A * 0.28;
          return <ellipse key={i} cx={x} cy={y} rx={10 * u} ry={34 * u} fill="#ffffff" opacity={0.45 * Math.sin(fase * Math.PI)} />;
        })}
        <Recorte x={L * 0.5} y={A * 0.24} p={ramp(t, 0.5, 1.5)} escala={1.2 + junta * 0.5} cresce cor="#f7f3ea">
          <Nuvem />
        </Recorte>
        <rect y={hz - 1} width={L} height={2} fill={TINTA} opacity={0.5} />
      </Tela>
      <Escurece p={ramp(t, dur - 0.4, dur)} />
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const hz = A * HORIZONTE;
  const pesa = ramp(t, 0, 1.4);
  return (
    <>
      <Ceu hora="tarde" para="chuvoso" p={pesa} />
      <Tela>
        <Chuva x={L * 0.5} y={A * 0.27} largura={560 * u} altura={hz - A * 0.27} t={t} forca={ramp(t, 0.8, 2)} />
        <g transform={`translate(0 ${pesa * 30 * u + balanco(t, 0.4) * 6 * u})`}>
          <Recorte x={L * 0.5} y={A * 0.2} p={1} escala={1.8} cor={interpolateColors(pesa, [0, 1], ['#f7f3ea', '#2b3240'])}>
            <Nuvem />
          </Recorte>
        </g>
        <rect y={hz} width={L} height={A - hz} fill={HORA.chuvoso[2]} />
        <Recorte x={L * 0.78} y={hz + 2 * u} p={1}>
          <path d="M-10,0 L-6,-200 L6,-200 L10,0 Z" />
          <circle cx={0} cy={-230} r={80} />
          <circle cx={-60} cy={-190} r={50} />
          <circle cx={60} cy={-190} r={50} />
        </Recorte>
        <rect y={hz - 1} width={L} height={2} fill={TINTA} opacity={0.5} />
      </Tela>
      <Escurece p={ramp(t, dur - 0.4, dur)} />
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const hz = A * HORIZONTE;
  const abre = ramp(t, 1.5, dur);
  return (
    <>
      <Ceu hora="chuvoso" para="entardecer" p={abre} />
      <Tela>
        <Sol x={L * 0.25} y={hz - 140 * u} r={110 * u} p={abre} />
        <g opacity={1 - abre}>
          <Chuva x={L * 0.5} y={A * 0.08} largura={L * 0.9} altura={hz - A * 0.08} t={t} />
        </g>
        <rect y={hz} width={L} height={A - hz} fill={interpolateColors(abre, [0, 1], [HORA.chuvoso[2], HORA.entardecer[2]])} />
        <Recorte x={L * 0.55} y={hz + 2 * u} p={1} escala={1.3} cresce>
          <Planta p={ramp(t, 0.3, 2.6)} t={t} />
        </Recorte>
        <rect y={hz - 1} width={L} height={2} fill={TINTA} opacity={0.5} />
      </Tela>
    </>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, que já está escrito no céu: sem legenda nesse trecho
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
