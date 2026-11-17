// ESTILO: Papel e sombras
// Um palquinho de mesa: recortes de papel COLORIDO presos em varetas, na frente
// de um pano iluminado por uma lamparina que fica embaixo. Cada recorte joga a
// sua sombra no pano; quanto mais longe do pano, maior e mais borrada a sombra,
// e ela dança quando a chama tremula. Bom pra conto, fábula e explicação com clima.
//
// Diferente do `papel-recortado` (recorte deitado na mesa, stop-motion) e do
// `teatro-de-sombras` (só silhueta preta): aqui o papel tem cor E sombra.
//
// Este arquivo segue o molde do giz:
//   1. `tema`      cores, fundo (o palco) e legenda
//   2. as peças    palco, recorte com sombra, letreiro, cortina
//   3. os desenhos Sol, Nuvem, Chuva, Mar e Planta em recorte
//   4. `Exemplo`   o ciclo da água contado neste estilo
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarMarcellus} from '@remotion/google-fonts/Marcellus';
import type {PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, cenasPorFrase, chega, elastico, ramp, useTela} from '../../kit';

const {fontFamily: LETRA} = carregarMarcellus('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As cores do papel. Vivas, de cartolina; a sombra e a madeira são quentes. */
export const COR = {
  amarelo: '#ffcc33',
  laranja: '#ff9a2e',
  azul: '#4a95d8',
  azulFundo: '#2c6fb7',
  celeste: '#8fc8ee',
  branco: '#fbf6ea',
  verde: '#4fa24a',
  verdeEscuro: '#2f7f3a',
  terra: '#a8643a',
  vermelho: '#c8463a',
  sombra: '#2a1408',
  creme: '#fff3dc',
  ouro: '#f5d48a',
} as const;
export type CorPapel = keyof typeof COR;

/** A tremulação da lamparina, de -1 a 1. Tudo que depende da luz usa ela. */
export const chama = (t: number) => Math.sin(t * 7) * 0.6 + Math.sin(t * 14.3 + 1) * 0.4;

/** O pano (a área de cena), em proporção da tela. As cenas desenham dentro dele. */
export const usePano = () => {
  const {L, A} = useTela();
  return {x: L * 0.07, y: A * 0.1, w: L * 0.86, h: A * 0.52};
};

/** O palco: fundo escuro, pano aceso pela lamparina, cortinas vermelhas, bambinela e o tablado de madeira. */
const Fundo: React.FC<{t: number}> = ({t}) => {
  const {L, A, u} = useTela();
  const P = usePano();
  const luz = 0.9 + 0.05 * chama(t);
  const largCortina = P.x + 34 * u;
  return (
    <AbsoluteFill style={{background: '#1a0d06'}}>
      <Tela>
        <defs>
          <radialGradient id="pes-pano" cx="50%" cy="85%" r="80%">
            <stop offset="0%" stopColor="#fff2cf" />
            <stop offset="55%" stopColor="#f0c98a" />
            <stop offset="100%" stopColor="#8a4f22" />
          </radialGradient>
          <pattern id="pes-trama" width={6 * u} height={6 * u} patternUnits="userSpaceOnUse">
            <path d={`M0 0H${6 * u}M0 0V${6 * u}`} stroke="#7a4a20" strokeOpacity={0.14} strokeWidth={u} />
          </pattern>
          {/* o grão do papel: todo recorte passa por este filtro */}
          <filter id="pes-papel">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="n" />
            <feColorMatrix in="n" type="saturate" values="0" result="g" />
            <feComposite in="g" in2="SourceGraphic" operator="in" result="m" />
            <feBlend in="SourceGraphic" in2="m" mode="multiply" />
          </filter>
          <filter id="pes-vinheta">
            <feGaussianBlur stdDeviation={30 * u} />
          </filter>
        </defs>
        <rect x={P.x} y={P.y} width={P.w} height={P.h} rx={10 * u} fill="url(#pes-pano)" style={{filter: `brightness(${luz})`}} />
        <rect x={P.x} y={P.y} width={P.w} height={P.h} fill="url(#pes-trama)" />
        <rect x={P.x} y={P.y} width={P.w} height={P.h} fill="none" stroke="#3a1a08" strokeOpacity={0.55} strokeWidth={60 * u} filter="url(#pes-vinheta)" />
        {/* cortinas laterais com pregas */}
        <rect x={0} y={0} width={largCortina} height={A} fill="#7d1a1a" />
        <rect x={L - largCortina} y={0} width={largCortina} height={A} fill="#7d1a1a" />
        {Array.from({length: 4}, (_, i) => (
          <g key={i}>
            <line x1={(14 + i * 22) * u} y1={0} x2={(14 + i * 22) * u} y2={A} stroke="#4f0e0e" strokeWidth={5 * u} />
            <line x1={L - (14 + i * 22) * u} y1={0} x2={L - (14 + i * 22) * u} y2={A} stroke="#4f0e0e" strokeWidth={5 * u} />
          </g>
        ))}
        {/* bambinela em ondas no alto */}
        <rect x={0} y={0} width={L} height={P.y - 16 * u} fill="#5e1212" />
        <path
          d={`M0 ${P.y - 16 * u}` + Array.from({length: 8}, (_, i) => `Q${((i + 0.5) * L) / 8} ${P.y + 36 * u} ${((i + 1) * L) / 8} ${P.y - 16 * u}`).join('') + `V0H0Z`}
          fill="#5e1212"
        />
        <rect x={0} y={P.y - 26 * u} width={L} height={6 * u} fill={COR.ouro} opacity={0.7} />
        {/* o tablado onde mora a legenda */}
        <rect x={0} y={P.y + P.h} width={L} height={A - P.y - P.h} fill="#2a1408" />
        <rect x={0} y={P.y + P.h} width={L} height={12 * u} fill="#c99a4a" />
        {/* o brilho da lamparina, embaixo, no centro */}
        <ellipse cx={L / 2} cy={P.y + P.h + 26 * u} rx={L * 0.3} ry={30 * u} fill="#ffcf7a" opacity={0.18 + 0.05 * chama(t)} filter="url(#pes-vinheta)" />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'papel-e-sombras',
  nome: 'Papel e sombras',
  fundo: '#1a0d06',
  tinta: COR.creme,
  acento: COR.ouro,
  legenda: {
    fonte: LETRA,
    peso: 400,
    tamanho: 70,
    cor: COR.creme,
    destaque: COR.amarelo,
    sombra: '0 3px 0 #1a0d06, 0 0 14px #1a0d06, 0 0 4px #1a0d06',
    altura: 0.74,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** O palco da cena: tudo que vai dentro fica recortado no pano. Use dentro de <Tela>. */
export const Palco: React.FC<{children: React.ReactNode}> = ({children}) => {
  const P = usePano();
  const {u} = useTela();
  return (
    <>
      <clipPath id="pes-corte-pano">
        <rect x={P.x} y={P.y} width={P.w} height={P.h} rx={10 * u} />
      </clipPath>
      <g clipPath="url(#pes-corte-pano)">{children}</g>
    </>
  );
};

/**
 * Um recorte de papel colorido. `d` é o desenho em volta do (0, 0), numa escala de ~100;
 * (x, y) é onde ele fica, `s` o tamanho. `prof` de 0 (encostado no pano) a 1 (perto da luz):
 * quanto mais perto da luz, maior, mais deslocada e mais borrada a sombra no pano.
 * `vara` mostra a vareta de quem segura, saindo por baixo do palco.
 */
export const Recorte: React.FC<{
  id: string;
  d: string;
  cor: CorPapel;
  x: number;
  y: number;
  t: number;
  s?: number;
  giro?: number;
  prof?: number;
  vara?: boolean;
  opacidade?: number;
}> = ({id, d, cor, x, y, t, s = 1, giro = 0, prof = 0.4, vara = true, opacidade = 1}) => {
  const {L, A, u} = useTela();
  const P = usePano();
  if (opacidade <= 0) return null;
  const esc = s * u;
  const ch = chama(t);
  // a luz vem de baixo, do centro: a sombra foge pra longe dela
  const dx = (x - L / 2) * 0.1 * prof + ch * 16 * u * prof;
  const dy = (y - A) * 0.03 * prof + (22 + 26 * prof) * u;
  const cresce = 1 + 0.14 * prof;
  const baseVara = P.y + P.h + 200 * u;
  return (
    <g opacity={opacidade}>
      <filter id={`pes-b-${id}`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation={(3 + prof * 14) * u} />
      </filter>
      <g filter={`url(#pes-b-${id})`} opacity={0.72 - prof * 0.2}>
        <g transform={`translate(${x + dx} ${y + dy}) rotate(${giro}) scale(${esc * cresce})`}>
          <path d={d} fill={COR.sombra} stroke={COR.sombra} strokeWidth={10 / s} strokeLinejoin="round" />
        </g>
        {vara && <line x1={x + dx} y1={y + dy} x2={x + dx * 1.6 + 20 * u} y2={baseVara} stroke={COR.sombra} strokeWidth={8 * u} />}
      </g>
      {vara && <line x1={x} y1={y} x2={x + 10 * u} y2={baseVara} stroke="#6b4226" strokeWidth={7 * u} strokeLinecap="round" />}
      <g transform={`translate(${x} ${y}) rotate(${giro}) scale(${esc})`}>
        {/* a borda branca do corte de tesoura e o papel colorido por cima */}
        <path d={d} fill={COR.branco} stroke={COR.branco} strokeWidth={10 / s} strokeLinejoin="round" />
        <path d={d} fill={COR[cor]} filter="url(#pes-papel)" />
      </g>
    </g>
  );
};

/** Quanto falta pro recorte chegar, subindo pela vareta de baixo do palco: some em `y`. `p` de 0 a 1. */
export const subida = (p: number, A: number) => (1 - ramp(p, 0, 1, elastico)) * A * 0.4;

/** Letreiro: letra de papel creme recortada, com sombra no pano. Use dentro de <Tela>. */
export const Letreiro: React.FC<{x: number; y: number; children: string; p: number; t: number; tamanho?: number; cor?: CorPapel}> = ({
  x,
  y,
  children,
  p,
  t,
  tamanho = 110,
  cor = 'creme',
}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const ch = chama(t);
  const desce = (1 - ramp(p, 0, 1, chega)) * -70 * u;
  return (
    <g transform={`translate(0 ${desce + balanco(t, 0.6) * 4 * u})`} opacity={ramp(p, 0, 0.5)}>
      <text x={x + ch * 6 * u} y={y + 16 * u} textAnchor="middle" fontFamily={LETRA} fontSize={tamanho * u} fill={COR.sombra} opacity={0.4} filter="url(#pes-vinheta)">
        {children}
      </text>
      <text x={x} y={y} textAnchor="middle" fontFamily={LETRA} fontSize={tamanho * u} fill={COR[cor]} stroke={COR.branco} strokeWidth={6 * u} paintOrder="stroke" filter="url(#pes-papel)">
        {children}
      </text>
    </g>
  );
};

/** A transição: as cortinas vermelhas fecham no meio (p de 0 a 1). Com `abrir`, abrem. */
export const Cortina: React.FC<{p: number; abrir?: boolean}> = ({p, abrir}) => {
  const {L, A, u} = useTela();
  if (p <= 0 || (abrir && p >= 1)) return null;
  const q = abrir ? 1 - ramp(p, 0, 1) : ramp(p, 0, 1);
  const w = (L / 2 + 10 * u) * q;
  return (
    <AbsoluteFill>
      <Tela>
        {[0, 1].map((lado) => (
          <g key={lado}>
            <rect x={lado ? L - w : 0} y={0} width={w} height={A} fill="#7d1a1a" />
            {Array.from({length: 6}, (_, i) => {
              const xl = lado ? L - w + (i + 0.5) * (w / 6) : (i + 0.5) * (w / 6);
              return <line key={i} x1={xl} y1={0} x2={xl} y2={A} stroke="#4f0e0e" strokeWidth={6 * u} />;
            })}
          </g>
        ))}
      </Tela>
    </AbsoluteFill>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Cada desenho é um ou mais `Recorte`s; o contorno é um caminho em volta do (0, 0)
// numa escala de ~100. Desenho novo: escreva o contorno como quem corta com tesoura.

const PI = Math.PI;
/** Estrela de `n` pontas: serve pra sol, flor e brilho. */
export const estrelaD = (r: number, n = 5, ri = 0.45) =>
  'M' +
  Array.from({length: n * 2}, (_, i) => {
    const a = -PI / 2 + (i / (n * 2)) * 2 * PI;
    const rr = i % 2 ? r * ri : r;
    return `${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`;
  }).join('L') +
  'Z';
/** A crista do mar: faixa com ondas em cima, de largura `w`. `fase` anda com o tempo. */
export const ondaD = (fase: number, w = 560, a = 22) => {
  let d = `M${-w},200L${-w},0`;
  for (let x = -w; x <= w; x += 20) d += `L${x},${(Math.sin(x / 70 + fase) * a).toFixed(1)}`;
  return d + `L${w},200Z`;
};
export const NUVEM_D = 'M-150,40 C-190,40 -200,-10 -160,-25 C-165,-75 -100,-90 -70,-60 C-55,-110 20,-115 40,-65 C70,-95 140,-80 135,-30 C185,-30 190,40 140,40 Z';
export const GOTA_D = 'M0,-50 C18,-20 34,0 34,18 C34,38 18,50 0,50 C-18,50 -34,38 -34,18 C-34,0 -18,-20 0,-50Z';
export const FOLHA_D = 'M0,0 C20,-30 60,-40 90,-30 C70,0 40,15 0,0Z';
export const CHAO_D = 'M-560,200L-560,30Q-300,-40 -40,10T560,0L560,200Z';

type Desenho = {x: number; y: number; t: number; s?: number; p?: number};

export const Sol: React.FC<Desenho> = ({x, y, t, s = 1.4, p = 1}) => {
  const {A} = useTela();
  return <Recorte id="sol" d={estrelaD(110, 14, 0.74)} cor="amarelo" x={x} y={y + subida(p, A)} t={t} s={s} giro={t * 12} prof={0.7} opacidade={p > 0 ? 1 : 0} />;
};

export const Nuvem: React.FC<Desenho & {cor?: CorPapel; id?: string; opacidade?: number}> = ({x, y, t, s = 1.4, p = 1, cor = 'branco', id = 'nuvem', opacidade = 1}) => {
  const {A, u} = useTela();
  return <Recorte id={id} d={NUVEM_D} cor={cor} x={x + balanco(t, 0.4) * 10 * u} y={y + subida(p, A)} t={t} s={s} prof={0.6} opacidade={p > 0 ? opacidade : 0} />;
};

/** Gotas de papel que descem em fila pendurada, cada uma na sua vareta fina (sem vara visível pra não poluir). */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; gotas?: number}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  gotas = 9,
}) => (
  <>
    {Array.from({length: gotas}, (_, i) => {
      if (i / gotas > forca) return null;
      const fase = (t * (0.55 + acaso(`pes-v${i}`) * 0.3) + acaso(`pes-f${i}`)) % 1;
      const gx = x - largura / 2 + ((i + 0.5) / gotas) * largura + (acaso(`pes-x${i}`) - 0.5) * largura * 0.05;
      return (
        <Recorte
          key={i}
          id={`gota${i}`}
          d={GOTA_D}
          cor="azul"
          x={gx}
          y={y + fase * altura}
          t={t}
          s={0.62}
          prof={0.5 + acaso(`pes-p${i}`) * 0.4}
          vara={false}
          opacidade={Math.min(1, (1 - fase) * 4)}
        />
      );
    })}
  </>
);

/** O mar em duas faixas de papel que balançam em sentidos contrários. */
export const Mar: React.FC<{y: number; t: number; p?: number}> = ({y, t, p = 1}) => {
  const {L, A, u} = useTela();
  const sob = subida(p, A);
  return (
    <>
      <Recorte id="mar-fundo" d={ondaD(t * 1.3 + 1)} cor="azulFundo" x={L / 2 + balanco(t, 0.5) * 14 * u} y={y + 50 * u + sob} t={t} s={1.1} prof={0.15} vara={false} />
      <Recorte id="mar-frente" d={ondaD(-t * 1.6, 560, 26)} cor="azul" x={L / 2 - balanco(t, 0.5) * 14 * u} y={y + 110 * u + sob} t={t} s={1.1} prof={0.3} vara={false} />
    </>
  );
};

/** Uma planta de papel que sobe da terra: o caule estica e as folhas abrem. `p` de 0 a 1. */
export const Planta: React.FC<Desenho> = ({x, y, t, s = 1, p = 1}) => {
  const {u} = useTela();
  const alto = 320 * s * ramp(p, 0, 0.6);
  const venta = balanco(t, 0.7) * 6;
  const folha = (lado: 1 | -1, em: number, de: number) => {
    const abre = ramp(p, de, de + 0.3, elastico);
    if (abre <= 0) return null;
    return (
      <Recorte
        key={`${lado}${em}`}
        id={`folha${lado}${em}`}
        d={FOLHA_D}
        cor={lado > 0 ? 'verde' : 'verdeEscuro'}
        x={x}
        y={y - alto * em * u}
        t={t}
        s={s * abre * 1.1}
        giro={lado > 0 ? -10 + venta : 190 - venta}
        prof={0.45}
        vara={false}
      />
    );
  };
  return (
    <>
      {alto > 0 && (
        <Recorte
          id="caule"
          d={`M-6,0 L-6,${-alto} L6,${-alto} L6,0Z`}
          cor="verdeEscuro"
          x={x}
          y={y}
          t={t}
          s={1}
          giro={venta}
          prof={0.4}
          vara={false}
        />
      )}
      {folha(1, 0.45, 0.35)}
      {folha(-1, 0.7, 0.5)}
      {folha(1, 0.92, 0.65)}
      {p > 0.8 && <Recorte id="flor" d={estrelaD(40, 6, 0.55)} cor="laranja" x={x + venta * 2 * u} y={y - alto * u - 20 * s * u} t={t} s={s * ramp(p, 0.8, 1, elastico)} giro={t * 20} prof={0.5} vara={false} />}
    </>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, u} = useTela();
  const P = usePano();
  return (
    <>
      <Tela>
        <Palco>
          <Mar y={P.y + P.h * 0.72} t={t} p={ramp(t, 0, 0.6)} />
          <Sol x={L * 0.5} y={P.y + P.h * 0.62} t={t} s={1.1} p={ramp(t, 0.2, 1)} />
          <Letreiro x={L / 2} y={P.y + P.h * 0.24} p={ramp(t, 0, 0.9)} t={t} tamanho={120}>
            O ciclo
          </Letreiro>
          <Letreiro x={L / 2} y={P.y + P.h * 0.24 + 130 * u} p={ramp(t, 0.25, 1.15)} t={t} tamanho={120} cor="amarelo">
            da água
          </Letreiro>
        </Palco>
      </Tela>
      <Cortina p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L} = useTela();
  const P = usePano();
  return (
    <>
      <Tela>
        <Palco>
          <Sol x={L * 0.66} y={P.y + P.h * 0.26} t={t} s={1.5} p={ramp(t, 0, 0.8)} />
          {/* raios de papel laranja descendo até o mar */}
          {[0, 1, 2].map((i) => (
            <Recorte
              key={i}
              id={`raio${i}`}
              d="M-8,0 L8,0 L4,160 L-4,160Z"
              cor="laranja"
              x={L * (0.58 - i * 0.08)}
              y={P.y + P.h * 0.38}
              t={t}
              s={ramp(t, 0.6 + i * 0.2, 1.2 + i * 0.2)}
              giro={25 + i * 8}
              prof={0.5}
              vara={false}
            />
          ))}
          <Mar y={P.y + P.h * 0.66} t={t} />
        </Palco>
      </Tela>
      <Cortina p={ramp(t, 0, 0.5)} abrir />
      <Cortina p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L} = useTela();
  const P = usePano();
  return (
    <>
      <Tela>
        <Palco>
          <Mar y={P.y + P.h * 0.7} t={t} />
          {/* fiapos de vapor de papel celeste subindo em vareta */}
          {[0, 1, 2].map((i) => {
            const q = ramp(t, 0.3 + i * 0.3, 2 + i * 0.3);
            return (
              <Recorte
                key={i}
                id={`vapor${i}`}
                d="M0,40 C-30,20 30,0 0,-20 C-30,-40 20,-60 0,-80 L14,-80 C34,-60 -16,-40 14,-20 C44,0 -16,20 14,40Z"
                cor="celeste"
                x={L * (0.36 + i * 0.14)}
                y={P.y + P.h * (0.66 - q * 0.3)}
                t={t}
                s={1.2}
                prof={0.5}
                opacidade={1 - ramp(q, 0.8, 1)}
              />
            );
          })}
          <Nuvem x={L * 0.5} y={P.y + P.h * 0.24} t={t} s={1.2 + ramp(t, 1.2, dur) * 0.6} p={ramp(t, 0.9, 1.7)} />
        </Palco>
      </Tela>
      <Cortina p={ramp(t, 0, 0.5)} abrir />
      <Cortina p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L} = useTela();
  const P = usePano();
  const pesa = ramp(t, 0.4, 1.2);
  return (
    <>
      <Tela>
        <Palco>
          <Chuva x={L * 0.5} y={P.y + P.h * 0.36} largura={P.w * 0.6} altura={P.h * 0.5} t={t} forca={ramp(t, 0.9, 1.8)} />
          {/* a nuvem pesa: desce um pouco e escurece pra azul */}
          <Nuvem id="nuvem-carregada" x={L * 0.5} y={P.y + P.h * (0.22 + pesa * 0.05)} t={t} s={1.9} cor="celeste" />
          <Nuvem id="nuvem-clara" x={L * 0.5} y={P.y + P.h * (0.22 + pesa * 0.05)} t={t} s={1.9} cor="branco" opacidade={1 - pesa} />
        </Palco>
      </Tela>
      <Cortina p={ramp(t, 0, 0.5)} abrir />
      <Cortina p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L} = useTela();
  const P = usePano();
  return (
    <>
      <Tela>
        <Palco>
          <Nuvem x={L * 0.36} y={P.y + P.h * 0.18} t={t} s={1.2} cor="celeste" />
          <Chuva x={L * 0.36} y={P.y + P.h * 0.28} largura={P.w * 0.36} altura={P.h * 0.4} t={t} gotas={5} />
          <Sol x={L * 0.76} y={P.y + P.h * 0.2} t={t} s={0.9} />
          <Recorte id="terra" d={CHAO_D} cor="terra" x={L / 2} y={P.y + P.h * 0.86} t={t} s={1} prof={0.15} vara={false} />
          <Planta x={L * 0.58} y={P.y + P.h * 0.88} t={t} s={1} p={ramp(t, 0.4, 2.8)} />
        </Palco>
      </Tela>
      <Cortina p={ramp(t, 0, 0.5)} abrir />
    </>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, já recortado no letreiro: sem legenda nesse trecho
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
