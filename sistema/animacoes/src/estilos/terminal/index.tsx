// ESTILO: Terminal
// Uma tela de computador antigo, fósforo verde no preto: todo desenho é feito de
// letras e símbolos (quanto mais claro o ponto, mais "cheio" o caractere), o
// texto é digitado depois de um prompt com cursor piscando, e a cena troca numa
// varredura de cima pra baixo.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarMono} from '@remotion/google-fonts/JetBrainsMono';
import type {PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, acaso, cenasPorFrase, chega, ramp, useTela} from '../../kit';

const {fontFamily: MONO} = carregarMono('normal', {weights: ['400', '800'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** Fósforo verde em três forças, mais o âmbar pra destaque raro. */
export const COR = {
  fundo: '#020604',
  verde: '#8dffa8',
  claro: '#eafff0',
  escuro: '#2f7a45',
  ambar: '#ffc65a',
} as const;

/** Do vazio ao cheio: o brilho de um ponto vira um destes caracteres. */
const RAMPA = ' .,:;-=+*x%#@';
const sat = (v: number) => Math.max(0, Math.min(1, v));

/** A tela apagada: preto esverdeado com um brilho leve no meio, como tubo de imagem. */
const Fundo: React.FC<{t: number}> = () => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, #07160c 0%, ${COR.fundo} 70%)`}} />
);

export const tema: Tema = {
  id: 'terminal',
  nome: 'Terminal',
  fundo: COR.fundo,
  tinta: COR.verde,
  acento: COR.claro,
  legenda: {
    fonte: MONO,
    peso: 800,
    tamanho: 62,
    cor: COR.verde,
    destaque: COR.claro,
    sombra: `0 0 14px ${COR.verde}88, 0 3px 0 #000, 0 0 4px #000, 0 0 10px #000`,
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** Um campo de brilho: recebe x e y (0 a 1 dentro da caixa) e devolve de 0 (vazio) a 1 (cheio). */
export type Campo = (x: number, y: number) => number;

/**
 * O desenho em letras: pinta a caixa (x, y, largura, altura) com caracteres, um por célula.
 * `p` de 0 a 1 revela de cima pra baixo, com uma linha de # na frente, como tela imprimindo.
 * `cor` muda o fósforo (o normal é o verde).
 */
export const Letras: React.FC<{x: number; y: number; largura: number; altura: number; campo: Campo; p?: number; cor?: string; semente?: string}> = ({
  x,
  y,
  largura,
  altura,
  campo,
  p = 1,
  cor = COR.verde,
  semente = 'l',
}) => {
  const {u} = useTela();
  const cw = 18 * u; // célula: 18 x 30 numa tela de 1080
  const ch = 30 * u;
  const cols = Math.max(1, Math.floor(largura / cw));
  const rows = Math.max(1, Math.floor(altura / ch));
  const ate = p * (rows + 1);
  const linhas: string[] = [];
  for (let j = 0; j < rows; j++) {
    let s = '';
    for (let i = 0; i < cols; i++) {
      if (j > ate) s += ' ';
      else if (j === Math.floor(ate) && p < 1) s += acaso(`${semente}${i}-${j}`) > 0.5 ? '#' : ' ';
      else s += RAMPA[Math.floor(sat(campo((i + 0.5) / cols, (j + 0.5) / rows)) * (RAMPA.length - 0.01))];
    }
    linhas.push(s);
  }
  return (
    <pre
      style={{
        position: 'absolute',
        left: x,
        top: y,
        margin: 0,
        fontFamily: MONO,
        fontWeight: 800,
        fontSize: ch * 0.9,
        lineHeight: `${ch}px`,
        letterSpacing: cw - ch * 0.9 * 0.6,
        color: cor,
        textShadow: `0 0 ${10 * u}px ${cor}77`,
      }}
    >
      {linhas.join('\n')}
    </pre>
  );
};

/** O cursor de bloco que pisca duas vezes por segundo. */
export const cursor = (t: number) => (Math.floor(t * 2) % 2 === 0 ? '█' : ' ');

/**
 * A janela do terminal: uma linha de comando pequena (`comando`) e embaixo o texto grande sendo digitado.
 * `p` de 0 a 1 digita; o cursor fica piscando no fim.
 */
export const Prompt: React.FC<{y: number; comando: string; texto: string; p: number; t: number; tamanho?: number}> = ({y, comando, texto, p, t, tamanho = 84}) => {
  const {L, u} = useTela();
  const n = Math.floor(texto.length * Math.min(1, p));
  return (
    <div
      style={{
        position: 'absolute',
        left: L * 0.07,
        width: L * 0.86,
        top: y,
        boxSizing: 'border-box',
        padding: `${30 * u}px ${40 * u}px`,
        background: 'rgba(2,8,5,0.93)',
        border: `${3 * u}px solid ${COR.verde}`,
        boxShadow: `0 0 ${30 * u}px ${COR.verde}44`,
        fontFamily: MONO,
      }}
    >
      <div style={{fontSize: 30 * u, color: COR.verde, opacity: 0.75, marginBottom: 14 * u}}>$ {comando}</div>
      <div style={{fontSize: tamanho * u, fontWeight: 800, color: COR.claro, lineHeight: 1.1, textShadow: `0 0 ${18 * u}px ${COR.verde}88`}}>
        {texto.slice(0, n)}
        {n < texto.length ? '█' : cursor(t)}
      </div>
    </div>
  );
};

/** As linhas de varredura e a borda escura do tubo. Vai por cima de tudo em toda cena. */
export const Tubo: React.FC = () => {
  const {u} = useTela();
  return (
    <>
      <AbsoluteFill style={{background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0 ${2 * u}px, transparent ${2 * u}px ${5 * u}px)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 100%)'}} />
    </>
  );
};

/**
 * A varredura: a transição do estilo. Uma barra clara desce e apaga a tela atrás dela.
 * Ponha no fim da cena com `p` de 0 a 1.
 */
export const Varredura: React.FC<{p: number}> = ({p}) => {
  const {A, u} = useTela();
  if (p <= 0) return null;
  const y = p * A;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: y, background: COR.fundo}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: y - 6 * u, height: 12 * u, background: COR.verde, boxShadow: `0 0 ${40 * u}px ${COR.verde}`, opacity: 0.8}} />
    </AbsoluteFill>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Cada desenho é um campo de brilho (uma conta de x e y) passado pras <Letras>, numa caixa em volta do centro.
// Desenho novo segue o mesmo jeito: pense em claro e escuro, não em contorno.

type Desenho = {x: number; y: number; tam?: number; p: number; t?: number};

/** Sol: miolo cheio, borda que esmaece e raios girando. */
export const Sol: React.FC<Desenho> = ({x, y, tam = 300, p, t = 0}) => {
  const campo: Campo = (nx, ny) => {
    const dx = nx - 0.5;
    const dy = (ny - 0.5) * 0.95;
    const d = Math.hypot(dx, dy);
    const raio = 0.5 + 0.5 * Math.cos(Math.atan2(dy, dx) * 10 + t * 2);
    return d < 0.2 ? 1 : Math.exp(-(d - 0.2) * 9) * (0.35 + 0.65 * raio);
  };
  return <Letras x={x - tam / 2} y={y - tam / 2} largura={tam} altura={tam} campo={campo} p={p} cor={COR.ambar} semente="sol" />;
};

/** Nuvem: três bolhas somadas, mais clara em cima. `pesada` escurece o miolo. */
export const Nuvem: React.FC<Desenho & {pesada?: number}> = ({x, y, tam = 400, p, t = 0, pesada = 0}) => {
  const campo: Campo = (nx, ny) => {
    const b = (cx: number, cy: number, r: number) => Math.max(0, 1 - Math.hypot((nx - cx) / r, (ny - cy) / (r * 1.6)));
    const v = Math.max(b(0.3, 0.6, 0.22), b(0.52, 0.45, 0.28), b(0.74, 0.6, 0.2));
    const ondula = 0.1 * Math.sin(nx * 18 + t * 3);
    return sat(v * 2.2 * (1 - pesada * 0.45 * ny) + ondula * (v > 0 ? 1 : 0));
  };
  return <Letras x={x - tam / 2} y={y - tam * 0.3} largura={tam} altura={tam * 0.6} campo={campo} p={p} semente="nuvem" />;
};

/** Chuva: colunas de | e : caindo. `forca` de 0 a 1 liga aos poucos. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number}> = ({x, y, largura, altura, t, forca = 1}) => {
  const campo: Campo = (nx, ny) => {
    const col = Math.floor(nx * 30);
    if (acaso(`chuva-c${col}`) > forca * 0.55) return 0;
    const fase = (ny * 2.2 - t * (1.3 + acaso(`chuva-v${col}`)) + acaso(`chuva-f${col}`) * 3) % 1;
    const f = fase < 0 ? fase + 1 : fase;
    return f < 0.2 ? 0.55 + f * 2 : 0;
  };
  return <Letras x={x - largura / 2} y={y} largura={largura} altura={altura} campo={campo} />;
};

/** Mar: ondas de brilho que correm de lado. Vai de `y` até `y + altura`, na largura da tela. */
export const Mar: React.FC<{y: number; altura: number; p: number; t: number}> = ({y, altura, p, t}) => {
  const {L} = useTela();
  const campo: Campo = (nx, ny) => {
    const onda = Math.sin(nx * 22 - t * 3 + ny * 9) * 0.5 + 0.5;
    const topo = 0.1 + 0.06 * Math.sin(nx * 12 + t * 2);
    return ny < topo ? 0 : sat(0.25 + 0.65 * onda * (1 - ny * 0.5));
  };
  return <Letras x={L * 0.04} y={y} largura={L * 0.92} altura={altura} campo={campo} p={p} semente="mar" />;
};

/** Planta: caule e duas folhas que crescem com `p`. (x, y) é o pé. */
export const Planta: React.FC<Desenho> = ({x, y, tam = 360, p, t = 0}) => {
  const alto = ramp(p, 0, 0.7, chega);
  const campo: Campo = (nx, ny) => {
    const h = 1 - ny; // 0 no pé, 1 no topo
    if (h > alto) return 0;
    const vento = Math.sin(t * 2) * 0.03 * h;
    const caule = Math.abs(nx - 0.5 - vento) < 0.04 ? 1 : 0;
    const folha = (hy: number, lado: number) => {
      const abre = ramp(p, 0.3 + hy * 0.4, 0.6 + hy * 0.4);
      const fx = (nx - 0.5 - lado * 0.17) / (0.17 * abre + 0.001);
      const fy = (h - hy) / 0.08;
      return fx * fx + fy * fy < 1 ? 0.75 : 0;
    };
    return Math.max(caule, folha(0.4, -1), folha(0.62, 1), h > alto - 0.06 && alto > 0.9 && Math.abs(nx - 0.5 - vento) < 0.09 ? 0.9 : 0);
  };
  return <Letras x={x - tam / 2} y={y - tam} largura={tam} altura={tam} campo={campo} />;
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Mar y={A * 0.42} altura={A * 0.17} p={ramp(t, 0, 0.8)} t={t} />
      <Prompt y={A * 0.1} comando="./ciclo --agua" texto="O ciclo da água" p={ramp(t, 0.2, 1.4)} t={t} />
      <Letras x={L * 0.42} y={A * 0.32} largura={160 * u} altura={120 * u} campo={(x, y) => (Math.hypot(x - 0.5, (y - 0.55) * 0.8 + Math.abs(x - 0.5) * 0.5) < 0.3 ? 1 : 0)} />
      <Tubo />
      <Varredura p={ramp(t, dur - 0.45, dur)} />
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  // o calor: o mar fica mais forte embaixo do sol
  return (
    <>
      <Sol x={L * 0.62} y={A * 0.2} tam={440 * u} p={ramp(t, 0, 0.9)} t={t} />
      <Mar y={A * 0.43} altura={A * 0.17} p={ramp(t, 0.3, 1.1)} t={t} />
      <Letras
        x={L * 0.3}
        y={A * 0.33}
        largura={L * 0.4}
        altura={A * 0.1}
        campo={(x, y) => (Math.sin(x * 30 + y * 12 - t * 6) > 0.6 && t > 1 ? 0.5 : 0)}
        cor={COR.ambar}
      />
      <Tubo />
      <Varredura p={ramp(t, dur - 0.45, dur)} />
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Mar y={A * 0.47} altura={A * 0.13} p={1} t={t} />
      {/* o vapor: pontos que sobem em colunas tortas */}
      <Letras
        x={L * 0.25}
        y={A * 0.3}
        largura={L * 0.5}
        altura={A * 0.17}
        campo={(x, y) => {
          const fase = (y * 3 + t * 1.2 + acaso(`vp${Math.floor(x * 14)}`)) % 1;
          return Math.abs(Math.sin(x * 44 + y * 6)) > 0.8 && fase < 0.3 ? 0.4 : 0;
        }}
      />
      <Nuvem x={L * 0.5} y={A * 0.2} tam={(560 + ramp(t, 0.8, dur) * 200) * u} p={ramp(t, 0.4, 1.4)} t={t} />
      <Tubo />
      <Varredura p={ramp(t, dur - 0.45, dur)} />
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Nuvem x={L * 0.5} y={A * 0.18 + ramp(t, 0.2, 1.2) * 40 * u} tam={780 * u} p={1} t={t} pesada={ramp(t, 0.2, 1)} />
      <Chuva x={L * 0.5} y={A * 0.3} largura={620 * u} altura={A * 0.3} t={t} forca={ramp(t, 0.8, 1.8)} />
      <Tubo />
      <Varredura p={ramp(t, dur - 0.45, dur)} />
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Nuvem x={L * 0.5} y={A * 0.13} tam={700 * u} p={1} t={t} pesada={1} />
      <Chuva x={L * 0.5} y={A * 0.22} largura={560 * u} altura={A * 0.33} t={t} />
      <Planta x={L * 0.5} y={A * 0.57} tam={440 * u} p={ramp(t, 0.4, 2.6)} t={t} />
      <Letras x={L * 0.08} y={A * 0.57} largura={L * 0.84} altura={60 * u} campo={(x) => 0.5 + 0.2 * Math.sin(x * 40)} cor={COR.escuro} />
      <Tubo />
    </>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 está digitada no terminal: sem legenda nesse trecho
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
