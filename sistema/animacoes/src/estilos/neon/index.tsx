// ESTILO: Neon
// Uma parede de tijolo escura à noite onde cada desenho é um letreiro de tubo
// de neon: o tubo se estende, acende piscando como lâmpada velha e fica
// zumbindo de leve. A cena troca apagando o letreiro aos trancos.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarTilt} from '@remotion/google-fonts/TiltNeon';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, caminho, cenasPorFrase, circulo, chega, ramp, useTela} from '../../kit';

const {fontFamily: TILT} = carregarTilt('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As cores dos tubos. Sempre claras e saturadas: neon apagado não existe na tela. */
export const COR = {
  rosa: '#ff4fb8',
  ciano: '#3ff0ff',
  azul: '#2f8bff',
  amarelo: '#ffd36b',
  laranja: '#ff9a3c',
  verde: '#6dff8a',
  lilas: '#c9b8ff',
  branco: '#fff7fb',
} as const;
export type CorNeon = keyof typeof COR;

/** A parede: tijolo quase preto, com a vinheta escura nas bordas. Os filtros de brilho moram aqui. */
const Fundo: React.FC<{t: number}> = () => {
  const {L, A, u} = useTela();
  return (
    <AbsoluteFill style={{background: '#08070b'}}>
      <Tela>
        <defs>
          <pattern id="neon-tijolo" width={180 * u} height={90 * u} patternUnits="userSpaceOnUse">
            <rect width={180 * u} height={90 * u} fill="#151218" />
            <rect x={3 * u} y={3 * u} width={174 * u} height={39 * u} rx={3 * u} fill="#1d1920" />
            <rect x={-87 * u} y={48 * u} width={174 * u} height={39 * u} rx={3 * u} fill="#1b171e" />
            <rect x={93 * u} y={48 * u} width={174 * u} height={39 * u} rx={3 * u} fill="#1e1a21" />
          </pattern>
          <filter id="neon-halo" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={22 * u} />
          </filter>
          <filter id="neon-brilho" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={6 * u} />
          </filter>
        </defs>
        <rect width={L} height={A} fill="url(#neon-tijolo)" />
      </Tela>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.65) 100%)'}} />
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'neon',
  nome: 'Neon',
  fundo: '#08070b',
  tinta: COR.branco,
  acento: COR.rosa,
  legenda: {
    fonte: TILT,
    peso: 400,
    tamanho: 82,
    cor: COR.branco,
    destaque: '#ffd1ec',
    sombra: `0 0 6px ${COR.rosa}, 0 0 18px ${COR.rosa}, 0 0 40px rgba(255,79,184,0.7), 0 3px 0 #000`,
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/**
 * Como a lâmpada acende: começa em `ini` (segundos), pisca uns trancos e firma em ~0,5 s.
 * Depois fica com um zumbido leve. Devolve a opacidade de 0 a 1.
 */
export const acende = (t: number, ini: number, semente: string) => {
  const d = t - ini;
  if (d < 0) return 0;
  const zumbido = 0.94 + 0.06 * Math.sin(t * 15 + ini * 7);
  if (d > 0.5) return zumbido;
  return acaso(`${semente}${Math.floor(d * 15)}`) > 0.45 ? 0.35 + d : 0.05;
};

/**
 * O tubo de neon: um caminho SVG `d` em quatro camadas (halo largo, brilho, tubo e o fio branco quente).
 * `p` de 0 a 1 estende o tubo; `luz` de 0 a 1 é o quanto está aceso (use `acende`).
 */
export const Tubo: React.FC<{d: string; cor?: CorNeon; p?: number; luz?: number; grossura?: number}> = ({d, cor = 'rosa', p = 1, luz = 1, grossura = 1}) => {
  const {u} = useTela();
  if (p <= 0 || luz <= 0) return null;
  const c = COR[cor];
  const comum = {d, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - Math.min(1, p)};
  return (
    <g opacity={luz}>
      <path {...comum} stroke={c} strokeWidth={34 * grossura * u} filter="url(#neon-halo)" opacity={0.75} />
      <path {...comum} stroke={c} strokeWidth={16 * grossura * u} filter="url(#neon-brilho)" />
      <path {...comum} stroke={c} strokeWidth={8 * grossura * u} />
      <path {...comum} stroke="#ffffff" strokeWidth={3 * grossura * u} opacity={0.85} />
    </g>
  );
};

/** Pontos ligados por curva suave viram o `d` de um tubo (atalho pra desenhar com listas de pontos). */
export const tubo = (pontos: Ponto[], fechado = false) => caminho(pontos, fechado);

/** Letreiro escrito em neon: letra de tubo com halo, que acende piscando a partir de `ini`. */
export const Letreiro: React.FC<{y: number; t: number; ini?: number; children: string; tamanho?: number; cor?: CorNeon}> = ({y, t, ini = 0, children, tamanho = 130, cor = 'rosa'}) => {
  const {L, u} = useTela();
  const c = COR[cor];
  return (
    <div
      style={{
        position: 'absolute',
        left: L * 0.06,
        width: L * 0.88,
        top: y,
        textAlign: 'center',
        fontFamily: TILT,
        fontSize: tamanho * u,
        lineHeight: 1.15,
        color: '#fff',
        opacity: acende(t, ini, `letreiro${children}`),
        textShadow: `0 0 ${6 * u}px ${c}, 0 0 ${18 * u}px ${c}, 0 0 ${44 * u}px ${c}, 0 0 ${90 * u}px ${c}`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * O apagão: a transição do estilo. A parede escurece aos trancos, como letreiro sendo desligado.
 * Ponha no fim da cena com `p` de 0 a 1.
 */
export const Apagao: React.FC<{p: number}> = ({p}) => {
  if (p <= 0) return null;
  const tranco = p < 1 && acaso(`apagao${Math.floor(p * 8)}`) > 0.6 ? 0.25 : 0;
  return <AbsoluteFill style={{background: '#08070b', opacity: Math.min(1, p * 1.1 - tranco)}} />;
};

// ---------- 3. alguns desenhos prontos ----------
// Todo desenho é um ou mais <Tubo>, cada um com a sua cor, acendendo um depois do outro.
// Recebe o centro (x, y), o tamanho, o `t` da cena e `ini` (o segundo em que começa a acender).

type Desenho = {x: number; y: number; tam?: number; t: number; ini?: number};

const raios = (x: number, y: number, r1: number, r2: number, n: number, giro = 0) =>
  Array.from({length: n}, (_, i) => {
    const a = (i / n) * Math.PI * 2 + giro;
    return `M${x + Math.cos(a) * r1} ${y + Math.sin(a) * r1}L${x + Math.cos(a) * r2} ${y + Math.sin(a) * r2}`;
  }).join('');

export const Sol: React.FC<Desenho> = ({x, y, tam = 300, t, ini = 0}) => (
  <>
    <Tubo d={tubo(circulo(x, y, tam * 0.4, tam * 0.4, 24), true)} cor="laranja" p={ramp(t, ini, ini + 0.6, chega)} luz={acende(t, ini, 'sol')} />
    <Tubo d={raios(x, y, tam * 0.55, tam * 0.75, 12, t * 0.3)} cor="amarelo" p={ramp(t, ini + 0.4, ini + 0.9)} luz={acende(t, ini + 0.4, 'raios')} />
  </>
);

export const Nuvem: React.FC<Desenho & {cor?: CorNeon}> = ({x, y, tam = 400, t, ini = 0, cor = 'ciano'}) => {
  const w = tam;
  const h = tam * 0.42;
  const d = `M${x - w * 0.5} ${y + h * 0.4} q${-w * 0.08} ${-h * 0.6} ${w * 0.18} ${-h * 0.62} q${w * 0.06} ${-h * 0.6} ${w * 0.32} ${-h * 0.42} q${w * 0.2} ${-h * 0.2} ${w * 0.26} ${h * 0.34} q${w * 0.2} ${h * 0.1} ${w * 0.1} ${h * 0.7} Z`;
  return <Tubo d={d} cor={cor} p={ramp(t, ini, ini + 0.8, chega)} luz={acende(t, ini, `nuvem${cor}`)} />;
};

/** Chuva: tracinhos de neon caindo. `forca` de 0 a 1 liga aos poucos. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number}> = ({x, y, largura, altura, t, forca = 1}) => {
  const {u} = useTela();
  return (
    <>
      {Array.from({length: 10}, (_, i) => {
        if (i / 10 >= forca) return null;
        const fase = (t * (1 + acaso(`neon-v${i}`) * 0.4) + acaso(`neon-f${i}`)) % 1;
        const px = x - largura / 2 + ((i + 0.5) / 10) * largura;
        const py = y + fase * altura;
        return <Tubo key={i} d={`M${px} ${py}L${px - 8 * u} ${py + 50 * u}`} cor="azul" grossura={0.7} luz={1 - fase * 0.6} />;
      })}
    </>
  );
};

/** Mar: duas linhas de onda que correm. Vai de `x0` a `x1`, com a primeira onda em `y`. */
export const Mar: React.FC<{y: number; t: number; ini?: number; x0?: number; x1?: number}> = ({y, t, ini = 0, x0, x1}) => {
  const {L, u} = useTela();
  const a = x0 ?? L * 0.08;
  const b = x1 ?? L * 0.92;
  return (
    <>
      {[0, 1].map((k) => {
        const pontos: Ponto[] = Array.from({length: 12}, (_, i) => [a + ((b - a) * i) / 11, y + k * 90 * u + Math.sin(i * 1.4 + t * 2.4 + k) * 22 * u]);
        return <Tubo key={k} d={tubo(pontos)} cor={k ? 'azul' : 'ciano'} p={ramp(t, ini + k * 0.2, ini + 0.8 + k * 0.2)} luz={acende(t, ini + k * 0.2, `mar${k}`)} />;
      })}
    </>
  );
};

/** Planta: caule e folhas que se estendem com `p`. (x, y) é o pé. */
export const Planta: React.FC<{x: number; y: number; tam?: number; p: number; t: number}> = ({x, y, tam = 360, p, t}) => {
  const v = Math.sin(t * 1.5) * tam * 0.02;
  const folha = (lado: number, h: number) => `M${x + v * h} ${y - tam * h} q${lado * tam * 0.12} ${-tam * 0.2} ${lado * tam * 0.3} ${-tam * 0.1} q${-lado * tam * 0.1} ${tam * 0.14} ${-lado * tam * 0.3} ${tam * 0.1}`;
  return (
    <>
      <Tubo d={`M${x} ${y}Q${x} ${y - tam * 0.5} ${x + v} ${y - tam}`} cor="verde" p={ramp(p, 0, 0.6)} luz={p > 0 ? 1 : 0} />
      <Tubo d={folha(-1, 0.4)} cor="verde" p={ramp(p, 0.35, 0.7)} luz={acende(p * 3, 1, 'f1')} />
      <Tubo d={folha(1, 0.7)} cor="verde" p={ramp(p, 0.55, 0.9)} luz={acende(p * 3, 1.6, 'f2')} />
      <Tubo d={tubo(circulo(x + v, y - tam * 1.06, tam * 0.07), true)} cor="rosa" p={ramp(p, 0.85, 1)} luz={acende(p * 3, 2.5, 'flor')} />
    </>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Mar y={A * 0.5} t={t} ini={-1} />
        <Tubo d={`M${L / 2} ${A * 0.33}C${L / 2 - 90 * u} ${A * 0.4} ${L / 2 - 70 * u} ${A * 0.45} ${L / 2} ${A * 0.45}C${L / 2 + 70 * u} ${A * 0.45} ${L / 2 + 90 * u} ${A * 0.4} ${L / 2} ${A * 0.33}Z`} cor="ciano" luz={acende(t, -1, 'gota')} />
      </Tela>
      <Letreiro y={A * 0.1} t={t} ini={0.2}>
        O ciclo da água
      </Letreiro>
      <Apagao p={ramp(t, dur - 0.4, dur)} />
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Sol x={L * 0.5} y={A * 0.22} tam={380 * u} t={t} ini={0} />
        <Mar y={A * 0.48} t={t} ini={0.4} />
        {/* o calor: três ondinhas laranja subindo do mar */}
        {[0.3, 0.5, 0.7].map((fx, i) => {
          const s = (t * 0.6 + i * 0.33) % 1;
          const yy = A * 0.46 - s * A * 0.08;
          return t > 1 ? <Tubo key={i} d={`M${L * fx} ${yy}q${20 * u} ${-25 * u} 0 ${-50 * u}q${-20 * u} ${-25 * u} 0 ${-50 * u}`} cor="laranja" grossura={0.7} luz={1 - s} /> : null;
        })}
      </Tela>
      <Apagao p={ramp(t, dur - 0.4, dur)} />
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Mar y={A * 0.52} t={t} ini={-1} />
        {[0.38, 0.5, 0.62].map((fx, i) => {
          const s = (t * 0.5 + i * 0.33) % 1;
          const yy = A * 0.5 - s * A * 0.16;
          return <Tubo key={i} d={`M${L * fx} ${yy}q${24 * u} ${-30 * u} 0 ${-60 * u}q${-24 * u} ${-30 * u} 0 ${-60 * u}`} cor="branco" grossura={0.7} luz={(1 - s) * ramp(t, 0, 0.4)} />;
        })}
        <Nuvem x={L * 0.5} y={A * 0.24} tam={(440 + ramp(t, 1, dur) * 120) * u} t={t} ini={0.8} />
      </Tela>
      <Apagao p={ramp(t, dur - 0.4, dur)} />
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const pesa = t > 0.9;
  return (
    <>
      <Tela>
        <Nuvem x={L * 0.5} y={A * 0.22 + ramp(t, 0.6, 1.2) * 40 * u} tam={600 * u} t={t} ini={pesa ? 0.9 : -1} cor={pesa ? 'lilas' : 'ciano'} />
        <Chuva x={L * 0.5} y={A * 0.3} largura={480 * u} altura={A * 0.28} t={t} forca={ramp(t, 1, 1.8)} />
      </Tela>
      <Apagao p={ramp(t, dur - 0.4, dur)} />
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const chao = A * 0.57;
  return (
    <Tela>
      <Nuvem x={L * 0.5} y={A * 0.15} tam={520 * u} t={t} ini={0} cor="lilas" />
      <Chuva x={L * 0.5} y={A * 0.22} largura={420 * u} altura={A * 0.26} t={t} />
      <Tubo d={`M${L * 0.12} ${chao}L${L * 0.88} ${chao}`} cor="verde" p={ramp(t, 0, 0.6)} luz={acende(t, 0, 'chao')} />
      <Planta x={L * 0.5} y={chao} tam={300 * u} p={ramp(t, 0.6, 2.6)} t={t} />
    </Tela>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 está no letreiro: sem legenda nesse trecho
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
