// ESTILO: Papel recortado
// Recortes de papel colorido com borda de tesoura, grão de fibra e sombra de
// altura, animados em stop-motion (12 poses por segundo): cada peça entra
// pulando ou deslizando, treme de leve a cada pose, e a cena seguinte chega
// numa folha nova de borda rasgada que sobe por cima.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarDM} from '@remotion/google-fonts/DMSerifDisplay';
import {loadFont as carregarArchivo} from '@remotion/google-fonts/ArchivoBlack';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, cenasPorFrase, elastico, quando, ramp, useTela} from '../../kit';

const {fontFamily: SERIFA} = carregarDM('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: BLOCO} = carregarArchivo('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** Cores de papel de dobradura: chapadas, sem degradê. */
export const COR = {
  creme: '#fbf2df',
  noite: '#1d2650',
  ceu: '#a9d3e3',
  mar1: '#3f8fa8',
  mar2: '#2f7593',
  mar3: '#245d7a',
  mar4: '#1b4762',
  sol: '#f2a33d',
  amarelo: '#f2c94c',
  laranja: '#e2733a',
  vermelho: '#c2452d',
  verde1: '#9cc25a',
  verde2: '#5c8f34',
  verde3: '#3f6b2a',
  cinza: '#8f97a8',
  terra: '#6b4426',
  tinta: '#2a1d14',
} as const;

/** A mesa: papelão escuro. Cada cena cobre ela com a folha dela. */
const Fundo: React.FC<{t: number}> = () => <AbsoluteFill style={{background: '#2a2018'}} />;

export const tema: Tema = {
  id: 'papel-recortado',
  nome: 'Papel recortado',
  fundo: '#2a2018',
  tinta: COR.creme,
  acento: COR.amarelo,
  legenda: {
    fonte: BLOCO,
    peso: 400,
    tamanho: 62,
    cor: COR.creme,
    destaque: COR.amarelo,
    sombra: '0 4px 0 #1a0f06, 0 0 14px #1a0f06, 0 0 5px #1a0f06',
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** Trava o tempo em 12 poses por segundo: é o que dá o andar de stop-motion. Passe o `t` da cena por aqui. */
export const passo = (t: number) => Math.floor(t * 12) / 12;

/** Contorno de tesoura: cada lado vira vários cortes retos, levemente tortos. */
export const cortar = (pts: Ponto[], semente: string, amp: number, seg: number): string => {
  const out: Ponto[] = [];
  pts.forEach((a, i) => {
    const b = pts[(i + 1) % pts.length];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const n = Math.max(1, Math.round(len / seg));
    const nx = -(b[1] - a[1]) / len;
    const ny = (b[0] - a[0]) / len;
    for (let j = 0; j < n; j++) {
      const k = j / n;
      const o = j === 0 ? 0 : (acaso(`${semente}-${i}-${j}`) - 0.5) * 2 * amp;
      out.push([a[0] + (b[0] - a[0]) * k + nx * o, a[1] + (b[1] - a[1]) * k + ny * o]);
    }
  });
  return 'M' + out.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L') + 'Z';
};

/** Pontos de uma elipse (pra recortar redondo). */
export const roda = (cx: number, cy: number, rx: number, ry = rx, n = 28): Ponto[] =>
  Array.from({length: n}, (_, i) => [cx + Math.cos((i / n) * Math.PI * 2) * rx, cy + Math.sin((i / n) * Math.PI * 2) * ry] as Ponto);
/** Pontos de uma estrela (raios de sol, brilho). */
export const estrela = (cx: number, cy: number, R: number, r: number, n: number, giro = -Math.PI / 2): Ponto[] =>
  Array.from({length: n * 2}, (_, i) => {
    const a = giro + (i / (n * 2)) * Math.PI * 2;
    return [cx + Math.cos(a) * (i % 2 ? r : R), cy + Math.sin(a) * (i % 2 ? r : R)] as Ponto;
  });
/** Retângulo. */
export const caixa = (x: number, y: number, w: number, h: number): Ponto[] => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
/** Faixa ondulada que vai até o pé da tela (mar, morro, chão). */
export const morro = (L: number, A: number, y: number, amp: number, fase: number): Ponto[] => [
  ...Array.from({length: 25}, (_, i) => {
    const x = -L * 0.08 + (i / 24) * L * 1.16;
    return [x, y - amp * (0.6 * Math.sin((x / L) * 9 + fase) + 0.4 * Math.sin((x / L) * 21 + fase * 1.7))] as Ponto;
  }),
  [L * 1.08, A * 1.05],
  [-L * 0.08, A * 1.05],
];

export type Forma = {pts: Ponto[]; cor: string};
type De = 'baixo' | 'cima' | 'esquerda' | 'direita' | 'pula';

/**
 * Um recorte de papel (uma ou várias formas coladas juntas). `p` de 0 a 1 faz ele entrar
 * (pulando ou deslizando de uma borda); `t` dá o tremor de pose a pose; `altura` 1 a 3 é o
 * quanto ele está acima da mesa (sombra maior). `anda` desloca ele livre (peixe, nuvem passando).
 */
export const Recorte: React.FC<{
  formas: Forma[];
  p: number;
  t: number;
  semente: string;
  de?: De;
  altura?: 1 | 2 | 3;
  ferve?: number;
  origem?: Ponto;
  anda?: Ponto;
}> = ({formas, p, t, semente, de = 'pula', altura = 2, ferve = 1.6, origem, anda = [0, 0]}) => {
  const {L, A, u} = useTela();
  const d = React.useMemo(
    () => formas.map((f, i) => cortar(f.pts, semente + i, (altura === 3 ? 4 : 2.5) * u, 46 * u)),
    [formas, semente, altura, u]
  );
  if (p <= 0) return null;
  const e = elastico(Math.min(1, p));
  const o = origem ?? formas[0].pts.reduce<Ponto>((s, q) => [s[0] + q[0] / formas[0].pts.length, s[1] + q[1] / formas[0].pts.length], [0, 0]);
  let dx = anda[0];
  let dy = anda[1];
  let esc = 1;
  let gira = 0;
  if (de === 'baixo') dy += (1 - e) * A * 0.6;
  if (de === 'cima') dy -= (1 - e) * A * 0.6;
  if (de === 'esquerda') dx -= (1 - e) * L * 1.1;
  if (de === 'direita') dx += (1 - e) * L * 1.1;
  if (de === 'pula') {
    esc = Math.max(0.001, e);
    gira = (1 - e) * -25;
  } else gira = (1 - Math.min(1, e)) * (acaso(semente + 'g') > 0.5 ? 6 : -6);
  // o tremor muda a cada pose, nunca entre poses
  const pose = Math.round(t * 12);
  const jx = (acaso(`${semente}x${pose}`) - 0.5) * 2 * ferve * u;
  const jy = (acaso(`${semente}y${pose}`) - 0.5) * 2 * ferve * u;
  const jr = (acaso(`${semente}r${pose}`) - 0.5) * ferve * 0.4;
  return (
    <g
      transform={`translate(${dx + jx},${dy + jy}) rotate(${gira + jr},${o[0]},${o[1]}) translate(${o[0]},${o[1]}) scale(${esc}) translate(${-o[0]},${-o[1]})`}
      filter={`url(#papel-recortado-a${altura})`}
    >
      {d.map((c, i) => (
        <path key={i} d={c} fill={formas[i].cor} />
      ))}
    </g>
  );
};

/**
 * A mesa de cada cena: a folha de fundo, os filtros do papel, o que vai dentro (SVG)
 * e a luz de luminária que oscila um pouco a cada pose. Toda cena começa por ela.
 */
export const Mesa: React.FC<{cor: string; t: number; children?: React.ReactNode}> = ({cor, t, children}) => {
  const {L, A, u} = useTela();
  return (
    <AbsoluteFill>
      <Tela>
        <defs>
          {[1, 2, 3].map((k) => (
            <filter key={k} id={`papel-recortado-a${k}`} x="-15%" y="-15%" width="135%" height="140%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves={3} seed={7} result="n" />
              <feColorMatrix in="n" type="matrix" values="0.17 0.17 0.17 0 0.66  0.17 0.17 0.17 0 0.65  0.17 0.17 0.17 0 0.63  0 0 0 0 1" result="g" />
              <feBlend in="SourceGraphic" in2="g" mode="multiply" result="m" />
              <feComposite in="m" in2="SourceGraphic" operator="in" result="tex" />
              <feDropShadow in="tex" dx={k * 3 * u} dy={k * 6 * u} stdDeviation={k * 4 * u} floodColor="#160c04" floodOpacity={0.5} />
            </filter>
          ))}
        </defs>
        <path d={cortar(caixa(-20 * u, -20 * u, L + 40 * u, A + 40 * u), 'mesa', 3 * u, 60 * u)} fill={cor} filter="url(#papel-recortado-a1)" />
        {children}
      </Tela>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at 50% 38%, transparent 45%, rgba(25,12,2,0.5) 100%)',
          opacity: 0.9 + (acaso('luz' + Math.round(t * 12)) - 0.5) * 0.12,
        }}
      />
    </AbsoluteFill>
  );
};

const RUIDO = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.12  0 0 0 0.22 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>")`;
const RASGO =
  'polygon(0% 6%, 6% 0%, 17% 5%, 29% 1%, 41% 4%, 55% 0%, 68% 5%, 81% 1%, 93% 4%, 100% 0%, 99% 30%, 100% 62%, 98% 100%, 87% 95%, 74% 100%, 61% 96%, 47% 100%, 33% 95%, 20% 100%, 8% 96%, 0% 100%, 1% 55%)';

/**
 * Texto em papel rasgado: uma tira creme com letra serifada e, opcional, uma etiqueta vermelha
 * em cima. Entra deslizando da esquerda (`p` de 0 a 1) e treme de pose a pose. `y` é a altura (0 a 1).
 */
export const Etiqueta: React.FC<{texto: string; p: number; t: number; y?: number; rotulo?: string; tamanho?: number}> = ({
  texto,
  p,
  t,
  y = 0.14,
  rotulo,
  tamanho = 112,
}) => {
  const {L, A, u} = useTela();
  if (p <= 0) return null;
  const e = elastico(Math.min(1, p));
  const pose = Math.round(t * 12);
  const j = (s: string) => (acaso(s + pose) - 0.5) * 2;
  return (
    <div
      style={{
        position: 'absolute',
        top: A * y,
        left: 0,
        width: L,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `translate(${(1 - e) * -L}px, ${j('ty') * 2 * u}px) rotate(${(1 - e) * -8 + j('tr') * 0.4}deg)`,
      }}
    >
      {rotulo && (
        <div style={{filter: `drop-shadow(${5 * u}px ${9 * u}px ${7 * u}px rgba(20,10,0,0.5))`, transform: 'rotate(-4deg)', marginBottom: -14 * u, zIndex: 2}}>
          <div
            style={{
              background: COR.vermelho,
              backgroundImage: RUIDO,
              clipPath: 'polygon(0 4%, 100% 0, 98% 100%, 2% 94%)',
              padding: `${14 * u}px ${34 * u}px ${10 * u}px`,
              fontFamily: BLOCO,
              fontSize: 56 * u,
              letterSpacing: '0.1em',
              color: COR.creme,
            }}
          >
            {rotulo.toUpperCase()}
          </div>
        </div>
      )}
      <div style={{filter: `drop-shadow(${8 * u}px ${14 * u}px ${10 * u}px rgba(20,10,0,0.55))`, transform: 'rotate(1.2deg)'}}>
        <div
          style={{
            background: '#f6ecd6',
            backgroundImage: RUIDO,
            clipPath: RASGO,
            padding: `${34 * u}px ${60 * u}px ${30 * u}px`,
            maxWidth: L * 0.88,
            fontFamily: SERIFA,
            fontSize: tamanho * u,
            lineHeight: 1.0,
            color: COR.tinta,
            textAlign: 'center',
            whiteSpace: 'pre-line',
          }}
        >
          {texto}
        </div>
      </div>
    </div>
  );
};

/**
 * A transição: uma folha nova, com a borda de cima rasgada, sobe do pé da tela e cobre tudo.
 * Ponha no fim da cena, por cima, com a cor da folha da cena seguinte.
 */
export const FolhaNova: React.FC<{p: number; cor: string}> = ({p, cor}) => {
  const {L, A, u} = useTela();
  if (p <= 0) return null;
  const topo = A * 1.1 - elastico(Math.min(1, p)) * A * 1.25;
  const borda = Array.from({length: 25}, (_, i) => [-L * 0.05 + (i / 24) * L * 1.1, topo + (acaso('rasgo' + i) - 0.5) * 40 * u] as Ponto);
  const pts: Ponto[] = [...borda, [L * 1.05, topo + A * 1.3], [-L * 0.05, topo + A * 1.3]];
  return (
    <AbsoluteFill>
      <Tela>
        <path d={cortar(pts, 'folha', 3 * u, 50 * u)} fill={cor} filter="url(#papel-recortado-a3)" />
      </Tela>
    </AbsoluteFill>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Todo desenho recebe a posição, o tamanho, `p` (0 a 1, a entrada) e `t` (o tremor e a vida).
// É feito de formas (listas de pontos) coladas num <Recorte>. Desenho novo segue o mesmo jeito.

type Desenho = {x: number; y: number; tam?: number; p: number; t: number};

/** Sol: coroa de raios que gira aos trancos, disco laranja e miolo amarelo. */
export const Sol: React.FC<Desenho> = ({x, y, tam = 180, p, t}) => {
  const giro = Math.floor(t * 4) * 0.08;
  return (
    <>
      <Recorte semente="sol-raios" p={p} t={t} origem={[x, y]} altura={2} formas={[{pts: estrela(x, y, tam * 1.5, tam * 1.05, 16, giro), cor: COR.laranja}]} />
      <Recorte semente="sol-disco" p={p - 0.1} t={t} origem={[x, y]} altura={2} formas={[{pts: roda(x, y, tam), cor: COR.sol}]} />
      <Recorte semente="sol-miolo" p={p - 0.2} t={t} origem={[x, y]} altura={1} formas={[{pts: roda(x, y, tam * 0.62), cor: '#f7cf5c'}]} />
    </>
  );
};

/** Nuvem: três bolas e uma base reta, coladas. */
export const Nuvem: React.FC<Desenho & {cor?: string; de?: De; anda?: Ponto; semente?: string}> = ({x, y, tam = 1, p, t, cor = COR.creme, de = 'pula', anda, semente = 'nuvem'}) => {
  const s = tam;
  const formas: Forma[] = [
    {pts: roda(x - 70 * s, y + 10 * s, 60 * s, 48 * s, 24), cor},
    {pts: roda(x + 10 * s, y - 18 * s, 80 * s, 66 * s, 28), cor},
    {pts: roda(x + 95 * s, y + 12 * s, 58 * s, 46 * s, 24), cor},
    {pts: caixa(x - 120 * s, y + 10 * s, 260 * s, 50 * s), cor},
  ];
  return <Recorte semente={semente} p={p} t={t} de={de} anda={anda} origem={[x, y]} formas={formas} />;
};

/** Pingos recortados caindo aos trancos, entre `y` e `y + altura`. `forca` de 0 a 1 liga a chuva aos poucos. */
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
    <g filter="url(#papel-recortado-a1)">
      {Array.from({length: pingos}, (_, i) => {
        if (i / pingos >= forca) return null;
        const fase = (t * (0.8 + acaso(`cv${i}`) * 0.4) + acaso(`cf${i}`)) % 1;
        const px = x - largura / 2 + acaso(`cx${i}`) * largura;
        const py = y + fase * altura;
        const r = 13 * u;
        const gota: Ponto[] = [[px, py - r * 2.6], [px + r, py - r * 0.2], ...roda(px, py, r, r, 10).slice(0, 6), [px - r, py - r * 0.2]];
        return <path key={i} d={cortar(gota, 'gota' + i, 1.2 * u, 12 * u)} fill={COR.mar1} />;
      })}
    </g>
  );
};

/** O mar: quatro faixas de papel azul que sobem do pé da tela e balançam. */
export const Mar: React.FC<{y: number; p: number; t: number}> = ({y, p, t}) => {
  const {L, A, u} = useTela();
  return (
    <>
      {[COR.mar1, COR.mar2, COR.mar3, COR.mar4].map((cor, i) => (
        <Recorte
          key={i}
          semente={'mar' + i}
          p={p * 1.6 - i * 0.2}
          t={t}
          de="baixo"
          anda={[Math.sin(t * (2.2 - i * 0.3) + i) * 26 * u, Math.cos(t * 2 + i) * 8 * u]}
          formas={[{pts: morro(L, A, y + i * 70 * u, 22 * u, i * 2.1), cor}]}
        />
      ))}
    </>
  );
};

/** Uma planta: o caule sobe, as folhas pulam uma a uma e a flor abre por último. */
export const Planta: React.FC<Desenho> = ({x, y, tam = 1, p, t}) => {
  const s = tam;
  const alto = 320 * s * Math.min(1, p / 0.5);
  const venta = Math.sin(t * 2) * 4;
  const folha = (lado: 1 | -1, h: number): Forma => ({pts: roda(x + lado * 62 * s, y - h, 66 * s, 26 * s, 18).map(([a, b]) => [a, b - lado * (a - x) * 0.35] as Ponto), cor: COR.verde2});
  return (
    <g transform={`rotate(${venta} ${x} ${y})`}>
      {p > 0 && <Recorte semente="caule" p={1} t={t} altura={1} formas={[{pts: caixa(x - 10 * s, y - alto, 20 * s, alto), cor: COR.verde3}]} />}
      <Recorte semente="folhaE" p={ramp(p, 0.35, 0.6)} t={t} origem={[x, y - 120 * s]} formas={[folha(-1, 120 * s)]} />
      <Recorte semente="folhaD" p={ramp(p, 0.5, 0.75)} t={t} origem={[x, y - 200 * s]} formas={[folha(1, 200 * s)]} />
      <Recorte
        semente="flor"
        p={ramp(p, 0.7, 1)}
        t={t}
        altura={3}
        origem={[x, y - 330 * s]}
        formas={[
          {pts: estrela(x, y - 330 * s, 64 * s, 30 * s, 6), cor: COR.laranja},
          {pts: roda(x, y - 330 * s, 22 * s, 22 * s, 12), cor: COR.amarelo},
        ]}
      />
    </g>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const F = FALA_EXEMPLO;

const Titulo: React.FC<PropsCena> = ({t: t0, dur}) => {
  const {L, A, u} = useTela();
  const t = passo(t0);
  return (
    <>
      <Mesa cor={COR.noite} t={t}>
        <Mar y={A * 0.56} p={ramp(t, 0, 0.9)} t={t} />
        <Nuvem x={L * 0.24} y={A * 0.44} tam={0.8 * u} p={ramp(t, 0.5, 1)} t={t} de="esquerda" anda={[t * 20 * u, 0]} semente="tn1" />
        <Nuvem x={L * 0.76} y={A * 0.4} tam={0.6 * u} p={ramp(t, 0.7, 1.2)} t={t} de="direita" anda={[-t * 16 * u, 0]} semente="tn2" />
      </Mesa>
      <Etiqueta texto={'O ciclo\nda água'} rotulo="como funciona" p={ramp(t, 0, 0.5)} t={t} y={0.14} tamanho={140} />
      <FolhaNova p={ramp(t, dur - 0.45, dur)} cor={COR.ceu} />
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t: t0, dur, fala}) => {
  const {L, A, u} = useTela();
  const t = passo(t0);
  const esquenta = quando(fala, 'esquenta', 1) - F.frases[1].s;
  return (
    <>
      <Mesa cor={COR.ceu} t={t}>
        <Sol x={L * 0.5} y={A * 0.25} tam={150 * u} p={ramp(t, 0, 0.6)} t={t} />
        <Mar y={A * 0.5} p={ramp(t, 0.2, 1)} t={t} />
        {/* o calor: tiras laranja onduladas que sobem do mar */}
        {[0.3, 0.5, 0.7].map((fx, i) => {
          const sobe = ((t - esquenta + i * 0.3) % 1.2) / 1.2;
          const ys = A * 0.47 - sobe * A * 0.08;
          const tira: Ponto[] = Array.from({length: 6}, (_, k) => [L * fx + Math.sin(k * 1.4 + t * 4) * 14 * u, ys - k * 22 * u] as Ponto);
          const pts: Ponto[] = [...tira, ...tira.slice().reverse().map(([a, b]) => [a + 18 * u, b] as Ponto)];
          return <Recorte key={i} semente={'calor' + i} p={t > esquenta ? 1 : 0} t={t} altura={1} formas={[{pts, cor: COR.laranja}]} />;
        })}
      </Mesa>
      <FolhaNova p={ramp(t, dur - 0.45, dur)} cor={COR.ceu} />
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t: t0, dur, fala}) => {
  const {L, A, u} = useTela();
  const t = passo(t0);
  const vira = quando(fala, 'vira', 2) - F.frases[2].s;
  return (
    <>
      <Mesa cor={COR.ceu} t={t}>
        <Mar y={A * 0.52} p={1} t={t} />
        {/* bolinhas de vapor sobem e somem dentro da nuvem */}
        {Array.from({length: 9}, (_, i) => {
          const f = (t * 0.7 + i / 9) % 1;
          const px = L * (0.25 + acaso('vx' + i) * 0.5) + (L * 0.5 - L * (0.25 + acaso('vx' + i) * 0.5)) * f;
          const py = A * 0.48 - f * A * 0.24;
          return <Recorte key={i} semente={'vapor' + i} p={1} t={t} altura={1} formas={[{pts: roda(px, py, (16 + f * 20) * u, (16 + f * 20) * u, 12), cor: '#ffffff'}]} />;
        })}
        <Nuvem x={L * 0.5} y={A * 0.22} tam={(1.2 + ramp(t, vira, dur) * 0.5) * u} p={ramp(t, vira - 0.3, vira + 0.2)} t={t} />
      </Mesa>
      <FolhaNova p={ramp(t, dur - 0.45, dur)} cor="#c4ccd6" />
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t: t0, dur, fala}) => {
  const {L, A, u} = useTela();
  const t = passo(t0);
  const pesa = quando(fala, 'pesa', 3) - F.frases[3].s;
  const chove = quando(fala, 'chuva', 3) - F.frases[3].s;
  const desce = ramp(t, pesa, pesa + 0.6) * A * 0.04;
  return (
    <>
      <Mesa cor="#c4ccd6" t={t}>
        <Chuva x={L * 0.5} y={A * 0.28} largura={L * 0.6} altura={A * 0.3} t={t} forca={ramp(t, chove - 0.4, chove + 0.6)} />
        <Nuvem x={L * 0.5} y={A * 0.2 + desce} tam={1.8 * u} p={1} t={t} cor={t > pesa ? COR.cinza : COR.creme} semente="nuvem-chuva" />
        <Recorte semente="chao3" p={1} t={t} formas={[{pts: morro(L, A, A * 0.6, 14 * u, 1), cor: COR.verde1}]} />
      </Mesa>
      <FolhaNova p={ramp(t, dur - 0.45, dur)} cor="#d9ecd8" />
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t: t0, fala}) => {
  const {L, A, u} = useTela();
  const t = passo(t0);
  const cresce = quando(fala, 'planta', 4) - F.frases[4].s;
  return (
    <Mesa cor="#d9ecd8" t={t}>
      <Nuvem x={L * 0.5} y={A * 0.14} tam={1.5 * u} p={1} t={t} cor={COR.cinza} semente="nuvem-fim" />
      <Chuva x={L * 0.5} y={A * 0.2} largura={L * 0.5} altura={A * 0.22} t={t} forca={1 - ramp(t, cresce + 1, cresce + 1.8)} pingos={10} />
      <Recorte semente="chao4" p={ramp(t, 0, 0.5)} t={t} de="baixo" formas={[{pts: morro(L, A, A * 0.58, 16 * u, 2), cor: COR.verde1}]} />
      <Planta x={L * 0.5} y={A * 0.585} tam={1.15 * u} p={ramp(t, cresce - 0.4, cresce + 1.6)} t={t} />
    </Mesa>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // o título já está escrito no papel: sem legenda nesse trecho
    semLegenda={[[0, FALA_EXEMPLO.frases[1].s]]}
    // corte seco: a folha nova que sobe já é a transição
    cenas={cenasPorFrase(FALA_EXEMPLO, [
      [0, 0, Titulo, 0],
      [1, 1, SolEMar, 0],
      [2, 2, VaporENuvem, 0],
      [3, 3, NuvemEChuva, 0],
      [4, 4, ChuvaEPlanta, 0],
    ])}
  />
);
