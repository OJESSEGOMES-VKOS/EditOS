// ESTILO: Degradê vivo
// Quatro manchas enormes de cor que se movem devagar atrás de tudo; cada cena
// tem a sua paleta. Na frente, uma palavra gigante que sobe da linha e formas
// de vidro fosco. Bom pra marca, lista, conceito, dica rápida e tom moderno.
//
// As quatro partes, na ordem do molde:
//   1. `tema`      cores, fundo e legenda
//   2. as peças    Manchas (o degradê), Vidro (a forma), Palavra (o texto grande)
//   3. os desenhos Sol, Nuvem, Chuva, Mar e Planta, de vidro
//   4. `Exemplo`   o ciclo da água contado neste estilo
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarInter} from '@remotion/google-fonts/InterTight';
import type {PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, cenasPorFrase, chega, ramp, useTela} from '../../kit';

const {fontFamily: LETRA} = carregarInter('normal', {weights: ['500', '800'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As paletas: cada uma é [fundo, mancha 1, mancha 2, mancha 3, mancha 4]. Cada cena escolhe uma. */
export const PALETA = {
  noite: ['#0b0a1a', '#3d2c8d', '#1a1a5e', '#6c3fa0', '#24245e'],
  calor: ['#2a1300', '#ffb347', '#ff7a18', '#ffe29a', '#e0533a'],
  ceu: ['#03203a', '#2f80ed', '#56ccf2', '#0b5e8a', '#a0e3ff'],
  mar: ['#022c35', '#00b4d8', '#48cae4', '#0077b6', '#7ae0c8'],
  folha: ['#06281a', '#27ae60', '#a8e063', '#1e8449', '#f7d794'],
  lilas: ['#1a0f2e', '#f8a5c2', '#c39bd3', '#fbd38d', '#6c5b7b'],
} as const;
export type Paleta = keyof typeof PALETA;

const POS: [number, number][] = [
  [0.2, 0.25],
  [0.8, 0.3],
  [0.3, 0.75],
  [0.75, 0.8],
];

/**
 * O degradê vivo: quatro manchas que passeiam devagar, mais um grão fino por cima.
 * Ponha no começo de toda cena com a paleta dela; a fusão entre as cenas troca as cores.
 */
export const Manchas: React.FC<{paleta: Paleta; t: number}> = ({paleta, t}) => {
  const {L, A} = useTela();
  const p = PALETA[paleta];
  const camadas = POS.map(([bx, by], n) => {
    const x = (bx + 0.14 * Math.sin(t * (0.5 - n * 0.06) + n * 1.7)) * 100;
    const y = (by + 0.1 * Math.cos(t * (0.4 - n * 0.05) + n)) * 100;
    return `radial-gradient(circle at ${x}% ${y}%, ${p[n + 1]} 0%, transparent 58%)`;
  });
  return (
    <AbsoluteFill style={{background: p[0]}}>
      <AbsoluteFill style={{background: camadas.join(','), filter: 'saturate(1.1)'}} />
      <AbsoluteFill style={{background: 'rgba(0,0,0,0.2)'}} />
      <Tela style={{mixBlendMode: 'overlay', opacity: 0.35}}>
        <filter id="degrade-grao">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={4} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={L} height={A} filter="url(#degrade-grao)" />
      </Tela>
    </AbsoluteFill>
  );
};

const Fundo: React.FC<{t: number}> = ({t}) => <Manchas paleta="noite" t={t} />;

export const tema: Tema = {
  id: 'degrade',
  nome: 'Degradê vivo',
  fundo: '#0b0a1a',
  tinta: '#ffffff',
  acento: '#ffffff',
  legenda: {
    fonte: LETRA,
    peso: 800,
    tamanho: 64,
    cor: '#ffffff',
    destaque: '#ffe9a8',
    sombra: '0 2px 16px rgba(0,0,0,0.6), 0 0 5px rgba(0,0,0,0.55), 0 1px 1px rgba(0,0,0,0.5)',
    altura: 0.74,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/**
 * Vidro fosco: o jeito do estilo pôr forma na tela. Tudo que vai dentro (path, circle, rect, ellipse)
 * ganha o preenchimento de vidro e a borda clara. `p` de 0 a 1 faz a forma surgir crescendo do centro (cx, cy).
 * Use dentro de <Tela>.
 */
export const Vidro: React.FC<{children: React.ReactNode; p?: number; cx: number; cy: number; forte?: boolean}> = ({
  children,
  p = 1,
  cx,
  cy,
  forte = false,
}) => {
  const {u} = useTela();
  const e = chega(Math.max(0, Math.min(1, p)));
  if (e <= 0) return null;
  const id = forte ? 'degrade-vidro-forte' : 'degrade-vidro';
  return (
    <g
      transform={`translate(${cx} ${cy}) scale(${0.6 + 0.4 * e}) translate(${-cx} ${-cy})`}
      opacity={e}
      fill={`url(#${id})`}
      stroke="rgba(255,255,255,0.85)"
      strokeWidth={3 * u}
      filter="url(#degrade-sombra)"
    >
      <defs>
        <linearGradient id="degrade-vidro" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity={0.55} />
          <stop offset="1" stopColor="#ffffff" stopOpacity={0.1} />
        </linearGradient>
        <linearGradient id="degrade-vidro-forte" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity={0.95} />
          <stop offset="1" stopColor="#ffffff" stopOpacity={0.5} />
        </linearGradient>
        <filter id="degrade-sombra" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy={14 * u} stdDeviation={18 * u} floodColor="#000" floodOpacity={0.22} />
        </filter>
      </defs>
      {children}
    </g>
  );
};

/**
 * A palavra gigante: cada palavra sobe de trás de uma linha, uma depois da outra. Alinhada à esquerda.
 * `p` de 0 a 1 faz subir, `some` de 0 a 1 faz sair por cima. Até 3 palavras curtas.
 */
export const Palavra: React.FC<{y: number; children: string; p: number; some?: number; tamanho?: number; rotulo?: string}> = ({
  y,
  children,
  p,
  some = 0,
  tamanho = 190,
  rotulo,
}) => {
  const {u, L} = useTela();
  const ws = children.split(' ');
  return (
    <div style={{position: 'absolute', left: L * 0.08, right: L * 0.08, top: y, color: '#fff', fontFamily: LETRA}}>
      {rotulo && (
        <div style={{fontWeight: 500, fontSize: 44 * u, letterSpacing: '0.3em', opacity: 0.85 * ramp(p, 0, 0.4) * (1 - some), marginBottom: 16 * u}}>
          {rotulo.toUpperCase()}
        </div>
      )}
      <div style={{fontWeight: 800, fontSize: tamanho * u, lineHeight: 0.98, letterSpacing: '-0.035em', textShadow: '0 4px 40px rgba(0,0,0,0.2)'}}>
        {ws.map((w, i) => {
          const a = chega(Math.max(0, Math.min(1, p * (ws.length + 1) - i)));
          const s = chega(Math.max(0, Math.min(1, some * (ws.length + 1) - i)));
          return (
            <span key={i} style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.1em', marginRight: '0.22em'}}>
              <span style={{display: 'inline-block', transform: `translateY(${(1 - a) * 105 - s * 105}%)`}}>{w}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Todo desenho recebe o centro (x, y), o tamanho e `p` (0 a 1), e é feito de formas simples dentro de <Vidro>.

type Desenho = {x: number; y: number; tam?: number; p: number; t?: number};

export const Sol: React.FC<Desenho> = ({x, y, tam = 200, p, t = 0}) => {
  const {u} = useTela();
  return (
    <>
      <Vidro cx={x} cy={y} p={ramp(p, 0.3, 1)}>
        <circle cx={x} cy={y} r={tam * 1.45} fill="none" strokeDasharray={`${24 * u} ${30 * u}`} transform={`rotate(${t * 12} ${x} ${y})`} />
      </Vidro>
      <Vidro cx={x} cy={y} p={p} forte>
        <circle cx={x} cy={y} r={tam} />
      </Vidro>
    </>
  );
};

export const Nuvem: React.FC<Desenho> = ({x, y, tam = 420, p, t = 0}) => {
  const w = tam;
  const h = tam * 0.42;
  const dx = Math.sin(t * 0.8) * tam * 0.02;
  const d = `M${x - w * 0.5 + dx} ${y + h * 0.5}
    a ${h * 0.5} ${h * 0.5} 0 0 1 ${h * 0.1} ${-h * 0.98}
    a ${w * 0.22} ${w * 0.22} 0 0 1 ${w * 0.38} ${-h * 0.4}
    a ${w * 0.2} ${w * 0.2} 0 0 1 ${w * 0.38} ${h * 0.3}
    a ${h * 0.55} ${h * 0.55} 0 0 1 ${w * 0.24 - h * 0.1} ${h * 1.08} Z`;
  return (
    <Vidro cx={x} cy={y} p={p} forte>
      <path d={d} />
    </Vidro>
  );
};

/** Gotas de vidro caindo sem parar entre `y` e `y + altura`. `forca` de 0 a 1 liga a chuva aos poucos. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number}> = ({x, y, largura, altura, t, forca = 1}) => {
  const {u} = useTela();
  const n = 10;
  return (
    <>
      {Array.from({length: n}, (_, i) => {
        if (i / n >= forca) return null;
        const fase = (t * (0.8 + (i % 3) * 0.15) + i * 0.37) % 1;
        const px = x - largura / 2 + ((i * 0.618) % 1) * largura;
        const py = y + fase * altura;
        return (
          <Vidro key={i} cx={px} cy={py} p={1 - Math.max(0, fase - 0.85) / 0.15}>
            <rect x={px - 14 * u} y={py - 45 * u} width={28 * u} height={90 * u} rx={14 * u} />
          </Vidro>
        );
      })}
    </>
  );
};

/** O mar: três faixas de vidro em onda, da linha `y` pra baixo. */
export const Mar: React.FC<{y: number; p: number; t: number}> = ({y, p, t}) => {
  const {L, u} = useTela();
  return (
    <>
      {[0, 1, 2].map((k) => {
        const n = 7;
        let d = `M${-20 * u} ${y + k * 70 * u + 120 * u}`;
        for (let i = 0; i <= n; i++) {
          const px = -20 * u + ((L + 40 * u) * i) / n;
          d += ` L${px} ${y + k * 70 * u + Math.sin(i * 1.3 + t * 1.5 + k) * 18 * u}`;
        }
        d += ` L${L + 20 * u} ${y + k * 70 * u + 120 * u} Z`;
        return (
          <Vidro key={k} cx={L / 2} cy={y} p={ramp(p, k * 0.2, 0.6 + k * 0.2)}>
            <path d={d} strokeLinejoin="round" />
          </Vidro>
        );
      })}
    </>
  );
};

/** A planta: o caule sobe e as folhas abrem com `p` de 0 a 1. `y` é o chão. */
export const Planta: React.FC<Desenho> = ({x, y, tam = 360, p, t = 0}) => {
  const {u} = useTela();
  const alto = tam * chega(Math.min(1, p / 0.6));
  const giro = Math.sin(t * 1.2) * 3;
  const folha = (lado: number, h: number, ini: number) => {
    const a = ramp(p, ini, ini + 0.3);
    const fy = y - alto * h;
    return (
      <Vidro cx={x} cy={fy} p={a} forte>
        <ellipse cx={x + lado * tam * 0.17} cy={fy} rx={tam * 0.16} ry={tam * 0.07} transform={`rotate(${-lado * 25} ${x} ${fy})`} />
      </Vidro>
    );
  };
  return (
    <g transform={`rotate(${giro} ${x} ${y})`}>
      <Vidro cx={x} cy={y} p={p > 0 ? 1 : 0} forte>
        <rect x={x - 12 * u} y={y - alto} width={24 * u} height={alto} rx={12 * u} />
      </Vidro>
      {folha(-1, 0.45, 0.3)}
      {folha(1, 0.7, 0.45)}
      {folha(-1, 0.95, 0.6)}
    </g>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const sai = (t: number, dur: number) => ramp(t, dur - 0.5, dur);

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Manchas paleta="ceu" t={t} />
      <Palavra y={A * 0.24} p={ramp(t, 0, 1.1)} some={sai(t, dur)} rotulo="o ciclo" tamanho={210}>
        da água
      </Palavra>
      <Tela>
        {/* uma gota de vidro que cai e quica devagar */}
        <Vidro cx={L * 0.62} cy={A * 0.53} p={ramp(t, 0, 0.7)} forte>
          <path
            transform={`translate(0 ${Math.sin(t * 2) * 14 * u})`}
            d={`M${L * 0.62} ${A * 0.53 - 190 * u} C${L * 0.62 + 40 * u} ${A * 0.53 - 110 * u} ${L * 0.62 + 120 * u} ${A * 0.53 - 30 * u} ${L * 0.62 + 120 * u} ${A * 0.53 + 40 * u} A${120 * u} ${120 * u} 0 0 1 ${L * 0.62 - 120 * u} ${A * 0.53 + 40 * u} C${L * 0.62 - 120 * u} ${A * 0.53 - 30 * u} ${L * 0.62 - 40 * u} ${A * 0.53 - 110 * u} ${L * 0.62} ${A * 0.53 - 190 * u}Z`}
          />
        </Vidro>
      </Tela>
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Manchas paleta="calor" t={t} />
      <Palavra y={A * 0.08} p={ramp(t, 0, 0.9)} some={sai(t, dur)}>
        calor
      </Palavra>
      <Tela>
        <Sol x={L * 0.66} y={A * 0.32} tam={140 * u} p={ramp(t, 0.1, 0.9)} t={t} />
        <Mar y={A * 0.5} p={ramp(t, 0.5, 1.6)} t={t} />
      </Tela>
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Manchas paleta="ceu" t={t} />
      <Palavra y={A * 0.08} p={ramp(t, 0, 0.9)} some={sai(t, dur)}>
        vapor
      </Palavra>
      <Tela>
        <Mar y={A * 0.53} p={1} t={t} />
        {[0, 1, 2, 3].map((i) => {
          const f = (t * 0.45 + i * 0.25) % 1;
          const px = L * (0.3 + i * 0.13);
          return (
            <Vidro key={i} cx={px} cy={A * 0.5} p={(1 - f) * ramp(t, 0, 0.6)}>
              <circle cx={px + Math.sin(f * 6 + i) * 20 * u} cy={A * 0.5 - f * A * 0.14} r={(26 - f * 10) * u} />
            </Vidro>
          );
        })}
        <Nuvem x={L * 0.5} y={A * 0.33} tam={(380 + ramp(t, 0.8, dur) * 120) * u} p={ramp(t, 0.6, 1.5)} t={t} />
      </Tela>
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Manchas paleta="noite" t={t} />
      <Palavra y={A * 0.08} p={ramp(t, 0, 0.9)} some={sai(t, dur)}>
        chuva
      </Palavra>
      <Tela>
        <Chuva x={L / 2} y={A * 0.4} largura={440 * u} altura={A * 0.2} t={t} forca={ramp(t, 0.4, 1.6)} />
        <Nuvem x={L / 2} y={A * 0.34} tam={540 * u} p={1} t={t} />
      </Tela>
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Manchas paleta="folha" t={t} />
      <Palavra y={A * 0.08} p={ramp(t, 0, 0.9)}>
        vida
      </Palavra>
      <Tela>
        <Chuva x={L * 0.5} y={A * 0.33} largura={500 * u} altura={A * 0.24} t={t} />
        <Vidro cx={L / 2} cy={A * 0.6} p={ramp(t, 0, 0.5)}>
          <rect x={L * 0.12} y={A * 0.598} width={L * 0.76} height={18 * u} rx={9 * u} />
        </Vidro>
        <Planta x={L * 0.5} y={A * 0.598} tam={300 * u} p={ramp(t, 0.4, 2.6)} t={t} />
      </Tela>
    </>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, já escrito grande na tela: sem legenda nesse trecho
    semLegenda={[[0, FALA_EXEMPLO.frases[1].s]]}
    cenas={cenasPorFrase(FALA_EXEMPLO, [
      [0, 0, Titulo, 0],
      [1, 1, SolEMar, 0.5],
      [2, 2, VaporENuvem, 0.5],
      [3, 3, NuvemEChuva, 0.5],
      [4, 4, ChuvaEPlanta, 0.5],
    ])}
  />
);
