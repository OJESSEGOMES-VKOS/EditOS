// ESTILO: Gravura
// Livro ilustrado antigo: cada cena é uma chapa de talho-doce impressa num papel
// envelhecido. Não existe cor nem contorno: a imagem é feita só de linhas
// paralelas de buril, que engrossam onde é escuro e ganham hachura cruzada nas
// sombras. Trocar de cena é o buril passar na diagonal e gravar a chapa nova.
// Bom pra história, ciência à moda antiga, curiosidade com cara de enciclopédia.
//
// As quatro partes, como no molde:
//   1. `tema`      cores, fundo e legenda
//   2. as peças    Campo (a luz e a sombra da cena), Chapa (as linhas de buril), Moldura, Rotulo
//   3. os desenhos ceu, sol, nuvem, chuva, mar, planta (camadas de luz e sombra)
//   4. `Exemplo`   o ciclo da água
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarFell} from '@remotion/google-fonts/IMFellEnglish';
import {loadFont as carregarFellSC} from '@remotion/google-fonts/IMFellEnglishSC';
import type {PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, cenasPorFrase, chega, ramp, suave, useTela} from '../../kit';

// IM Fell só tem 'latin', que já cobre os acentos do português
const {fontFamily: FELL} = carregarFell('normal', {weights: ['400'], subsets: ['latin']});
const {fontFamily: FELL_SC} = carregarFellSC('normal', {weights: ['400'], subsets: ['latin']});

// ---------- 1. o tema ----------

export const COR = {
  papel: '#ecdfc1',
  marca: '#e3d3b0', // a marca da chapa prensada no papel
  tinta: '#2a1d13', // a única tinta: sépia quase preta
  apagada: '#5a3d24', // tinta mais clara, pros rótulos
} as const;

/** O papel: creme envelhecido, com manchas de tempo e grão. */
const Fundo: React.FC<{t: number}> = () => {
  const {L, A} = useTela();
  return (
    <AbsoluteFill style={{background: COR.papel}}>
      <Tela>
        <defs>
          <filter id="gravura-papel" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={3} seed={7} result="m" />
            <feColorMatrix in="m" values="0 0 0 0 0.55  0 0 0 0 0.42  0 0 0 0 0.25  0 0 0 0.9 -0.35" result="manchas" />
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={3} result="g" />
            <feColorMatrix in="g" values="0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0.12 0" result="grao" />
            <feMerge>
              <feMergeNode in="manchas" />
              <feMergeNode in="grao" />
            </feMerge>
          </filter>
          {/* a tinta que espalha um tiquinho no papel */}
          <filter id="gravura-tinta">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves={1} seed={2} />
            <feDisplacementMap in="SourceGraphic" scale={1.6} />
          </filter>
        </defs>
        <rect width={L} height={A} filter="url(#gravura-papel)" opacity={0.55} />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'gravura',
  nome: 'Gravura',
  fundo: COR.papel,
  tinta: COR.tinta,
  acento: '#8a3b1e',
  legenda: {
    fonte: FELL,
    peso: 400,
    tamanho: 70,
    cor: COR.tinta,
    destaque: '#8a3b1e',
    sombra: `0 0 10px ${COR.papel}, 0 0 4px ${COR.papel}`,
    altura: 0.73,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/**
 * O campo é a luz da cena: pra cada ponto (x, y) ele diz quão claro é, de 0 (sombra funda) a 1 (papel limpo).
 * A Chapa transforma o campo em linhas de buril. Desenhar no estilo é montar o campo com camadas.
 */
export type Campo = (x: number, y: number) => number;

/** Uma camada: onde ela cobre (`cobre`, de 0 a 1) e quão clara ela é ali (`luz`). */
export type Camada = {cobre: (x: number, y: number) => number; luz: number | ((x: number, y: number) => number)};

/** Junta camadas sobre um fundo: a de cima tampa a de baixo. */
export const campo =
  (fundo: number | Campo, ...camadas: Camada[]): Campo =>
  (x, y) => {
    let l = typeof fundo === 'number' ? fundo : fundo(x, y);
    for (const c of camadas) {
      const a = c.cobre(x, y);
      if (a <= 0) continue;
      const lc = typeof c.luz === 'number' ? c.luz : c.luz(x, y);
      l = l * (1 - a) + lc * a;
    }
    return Math.max(0, Math.min(1, l));
  };

const borda = (d: number, macio: number) => Math.max(0, Math.min(1, 0.5 - d / macio));

/** Formas básicas pra `cobre`: elipse, faixa horizontal (de y0 até y1) e polígono. `macio` é a borda esfumada. */
export const elipse = (cx: number, cy: number, rx: number, ry: number, macio = 6) => (x: number, y: number) =>
  borda((Math.hypot((x - cx) / rx, (y - cy) / ry) - 1) * Math.min(rx, ry), macio);
export const faixa = (y0: number, y1: number, macio = 6) => (x: number, y: number) => borda(Math.max(y0 - y, y - y1), macio);
export const poligono = (pts: [number, number][]) => (x: number, y: number) => {
  let dentro = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro ? 1 : 0;
};

/** O retângulo da chapa (a área gravada), sempre acima da faixa da legenda. */
export const useChapa = () => {
  const {L, A, u, deitado} = useTela();
  const x0 = deitado ? L * 0.28 : 90 * u;
  const x1 = deitado ? L * 0.72 : L - 90 * u;
  const y0 = deitado ? A * 0.08 : A * 0.17;
  const y1 = deitado ? A * 0.58 : A * 0.58;
  return {x0, x1, y0, y1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0, u};
};

/** Uma família de linhas paralelas no ângulo `ang`; a largura de cada trecho vem da sombra do campo. */
const familia = (c: Campo, ch: ReturnType<typeof useChapa>, ang: number, gap: number, larg: (l: number) => number, desvio: number) => {
  const ca = Math.cos(ang);
  const sa = Math.sin(ang);
  const R = Math.hypot(ch.w, ch.h) / 2 + 10;
  const passo = 6 * ch.u;
  const out: string[] = [];
  for (let v = -R; v <= R; v += gap) {
    const cima: string[] = [];
    const baixo: string[] = [];
    let algum = false;
    for (let s = -R; s <= R; s += passo) {
      const x = ch.cx + s * ca - v * sa;
      const y = ch.cy + s * sa + v * ca;
      if (x < ch.x0 - 6 || x > ch.x1 + 6 || y < ch.y0 - 6 || y > ch.y1 + 6) continue;
      const l = c(x, y);
      const w = larg(l) * ch.u;
      if (w > 0.15) algum = true;
      const d = (0.5 - l) * desvio * ch.u;
      cima.push(`${(x - sa * (d - w / 2)).toFixed(1)},${(y + ca * (d - w / 2)).toFixed(1)}`);
      baixo.push(`${(x - sa * (d + w / 2)).toFixed(1)},${(y + ca * (d + w / 2)).toFixed(1)}`);
    }
    if (algum && cima.length > 1) out.push('M' + cima.join('L') + 'L' + baixo.reverse().join('L') + 'Z');
  }
  return out.join('');
};

/** As três passadas do buril: a linha principal, a hachura a 50° nas sombras e a terceira nas sombras fundas. */
const Linhas: React.FC<{c: Campo}> = ({c}) => {
  const ch = useChapa();
  const u = ch.u;
  return (
    <g fill={COR.tinta}>
      <path d={familia(c, ch, 0, 7.5 * u, (l) => Math.min(6.6, Math.pow(1 - l, 1.15) * 7.4 + 0.35), 7)} />
      <path d={familia(c, ch, 0.87, 9 * u, (l) => Math.min(5, Math.max(0, 0.52 - l) * 13), 0)} opacity={0.92} />
      <path d={familia(c, ch, -0.87, 10 * u, (l) => Math.min(4.5, Math.max(0, 0.26 - l) * 22), 0)} opacity={0.9} />
    </g>
  );
};

/**
 * A chapa gravada, com a moldura dupla e a marca da prensa. Use dentro de <Tela>.
 * Sem `de`, a gravura aparece de cima pra baixo (`p` de 0 a 1).
 * Com `de` (o campo da cena anterior), o buril passa na diagonal e grava a chapa nova por cima: é a transição.
 */
export const Chapa: React.FC<{c: Campo; de?: Campo; p?: number}> = ({c, de, p = 1}) => {
  const ch = useChapa();
  const u = ch.u;
  const q = ramp(p, 0, 1, suave);
  const bx = ch.x0 - 300 * u + q * (ch.w + 600 * u);
  const id = `gravura-corte-${Math.round(ch.y0)}`;
  return (
    <>
      <rect x={ch.x0 - 34 * u} y={ch.y0 - 34 * u} width={ch.w + 68 * u} height={ch.h + 68 * u} fill={COR.marca} stroke="#cdb98f" strokeWidth={2 * u} />
      <defs>
        <clipPath id={`${id}-placa`}>
          <rect x={ch.x0} y={ch.y0} width={ch.w} height={ch.h} />
        </clipPath>
        <clipPath id={`${id}-novo`}>
          {de ? (
            <path d={`M${ch.x0 - 1000 * u},${ch.y0 - 50 * u}L${bx},${ch.y0 - 50 * u}L${bx - 400 * u},${ch.y1 + 50 * u}L${ch.x0 - 1000 * u},${ch.y1 + 50 * u}Z`} />
          ) : (
            <rect x={ch.x0} y={ch.y0} width={ch.w} height={ch.h * q} />
          )}
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-placa)`} filter="url(#gravura-tinta)">
        {de && q < 1 && <Linhas c={de} />}
        <g clipPath={q < 1 ? `url(#${id}-novo)` : undefined}>
          {de && q < 1 && <rect x={ch.x0} y={ch.y0} width={ch.w} height={ch.h} fill={COR.marca} />}
          {q > 0 && <Linhas c={c} />}
        </g>
      </g>
      {de && q > 0 && q < 1 && (
        <line x1={bx} y1={ch.y0 - 50 * u} x2={bx - 400 * u} y2={ch.y1 + 50 * u} stroke="#fff4d6" strokeWidth={3 * u} opacity={0.8} clipPath={`url(#${id}-placa)`} />
      )}
      <rect x={ch.x0 - 8 * u} y={ch.y0 - 8 * u} width={ch.w + 16 * u} height={ch.h + 16 * u} fill="none" stroke={COR.tinta} strokeWidth={4 * u} />
      <rect x={ch.x0 - 18 * u} y={ch.y0 - 18 * u} width={ch.w + 36 * u} height={ch.h + 36 * u} fill="none" stroke={COR.tinta} strokeWidth={1.5 * u} />
    </>
  );
};

/** O título da prancha, acima da chapa: rótulo em versalete e o título em itálico de livro antigo, entre filetes. */
export const Rotulo: React.FC<{rotulo?: string; titulo: string; p: number; tamanho?: number}> = ({rotulo, titulo, p, tamanho = 110}) => {
  const {L, A, u, deitado} = useTela();
  if (p <= 0) return null;
  const q = ramp(p, 0, 1, chega);
  const y = deitado ? A * 0.72 : A * 0.12;
  return (
    <g opacity={q}>
      <g stroke={COR.tinta} strokeWidth={2 * u}>
        <line x1={L / 2 - 300 * u * q} y1={y - 70 * u} x2={L / 2 + 300 * u * q} y2={y - 70 * u} />
        <line x1={L / 2 - 300 * u * q} y1={y + 50 * u} x2={L / 2 + 300 * u * q} y2={y + 50 * u} />
      </g>
      <path d={`M${L / 2},${y + 36 * u} l${14 * u},${14 * u} l${-14 * u},${14 * u} l${-14 * u},${-14 * u}Z`} fill={COR.tinta} />
      {rotulo && (
        <text x={L / 2} y={y - 92 * u} textAnchor="middle" fontFamily={FELL_SC} fontSize={56 * u} letterSpacing={6 * u} fill={COR.apagada}>
          {rotulo}
        </text>
      )}
      <text x={L / 2} y={y + 22 * u} textAnchor="middle" fontFamily={FELL} fontStyle="italic" fontSize={tamanho * u} fill={COR.tinta}>
        {titulo}
      </text>
    </g>
  );
};

// ---------- 3. os desenhos prontos ----------
// Cada desenho é uma CAMADA (ou um fundo) de luz e sombra, montada com elipse, faixa e poligono.
// Pense em claro e escuro, não em contorno: o que é luz fica perto de 1, o que é sombra perto de 0.

/** O céu: mais escuro em cima, clareando até o horizonte. */
export const ceu =
  (y0: number, y1: number, alto = 0.62, baixo = 0.9): Campo =>
  (_x, y) =>
    alto + (baixo - alto) * Math.max(0, Math.min(1, (y - y0) / (y1 - y0)));

/** O sol: um disco de papel limpo com um halo que clareia o céu em volta. */
export const sol = (cx: number, cy: number, r: number): Camada[] => [
  {cobre: elipse(cx, cy, r * 2.2, r * 2.2, r * 2), luz: 0.9},
  {cobre: elipse(cx, cy, r, r, 4), luz: 1},
];

/** Uma nuvem: bolas claras com a barriga em sombra. `escura` deixa ela carregada de chuva. */
export const nuvem = (cx: number, cy: number, s: number, escura = 0): Camada[] => {
  const bolas: [number, number, number][] = [
    [-120, 10, 80],
    [-20, -40, 110],
    [100, 0, 85],
    [10, 40, 120],
  ];
  const cobre = (x: number, y: number) => Math.max(...bolas.map(([dx, dy, r]) => elipse(cx + dx * s, cy + dy * s, r * s * 1.2, r * s * 0.8, 8)(x, y)));
  return [{cobre, luz: (_x, y) => 0.97 - escura * 0.5 - Math.min(1, Math.max(0, (y - cy + 20 * s) / (90 * s))) * (0.25 + escura * 0.15)}];
};

/** O mar: faixa escura com ondas, mais clara onde a luz bate. `t` faz as ondas andarem. */
export const mar = (y0: number, y1: number, t: number, u: number): Camada => ({
  cobre: (x, y) => borda(Math.max(y0 + Math.sin(x / (60 * u) + t * 2) * 10 * u - y, y - y1), 6),
  luz: (x, y) => 0.3 + 0.18 * Math.sin(y / (14 * u) + Math.sin(x / (90 * u) + t * 1.5) * 2),
});

/** Chuva: riscos claros caindo sobre um campo escuro. Devolve uma camada de luz em fios diagonais. */
export const chuva = (x0: number, x1: number, y0: number, y1: number, t: number, u: number, forca = 1): Camada => ({
  cobre: (x, y) => {
    if (y < y0 || y > y1 || x < x0 || x > x1) return 0;
    const k = Math.floor((x - (y - y0) * 0.15) / (34 * u));
    const fase = ((y - y0) / (y1 - y0) - t * (0.9 + acaso(`gc${k}`) * 0.4) - acaso(`gf${k}`)) % 1;
    const f = fase < 0 ? fase + 1 : fase;
    const xx = (x - (y - y0) * 0.15) - k * 34 * u;
    return acaso(`gk${k}`) < forca && f < 0.18 && Math.abs(xx - 17 * u) < 3 * u ? 1 : 0;
  },
  luz: 1,
});

/** Uma planta que cresce (`p` de 0 a 1): caule e folhas em sombra contra o céu claro. Pé em (x, y). */
export const planta = (x: number, y: number, s: number, p: number, t = 0): Camada[] => {
  const alto = 340 * s * ramp(p, 0, 0.6, chega);
  const venta = balanco(t, 0.6) * 6 * s;
  const folha = (h: number, lado: number, abre: number): Camada => {
    const a = ramp(p, abre, abre + 0.3, chega);
    const bx = x + venta * h;
    const by = y - alto * h;
    // folha em amêndoa: sai do caule, sobe até a ponta e volta
    const c = 170 * s * a;
    const pts: [number, number][] = [
      [bx, by],
      [bx + lado * c * 0.35, by - c * 0.38],
      [bx + lado * c, by - c * 0.35],
      [bx + lado * c * 0.55, by + c * 0.02],
    ];
    return {cobre: a > 0 ? poligono(pts) : () => 0, luz: 0.12};
  };
  return [
    {cobre: poligono([[x - 9 * s, y], [x + 9 * s, y], [x + 5 * s + venta, y - alto], [x - 5 * s + venta, y - alto]]), luz: 0.08},
    folha(0.4, -1, 0.3),
    folha(0.65, 1, 0.45),
    folha(0.92, -0.6, 0.6),
  ];
};

// ---------- 4. o exemplo: o ciclo da água ----------

const useCampos = (t: number) => {
  const ch = useChapa();
  const {x0, x1, y0, y1, cx, h, u} = ch;
  const hz = y0 + h * 0.62;
  const campos = {
    titulo: campo(ceu(y0, hz), ...sol(cx, hz - 40 * u, 110 * u), mar(hz, y1, t, u)),
    solEMar: campo(ceu(y0, hz, 0.45, 0.8), ...sol(cx + 170 * u, y0 + 150 * u, 90 * u), mar(hz, y1, t, u)),
    vapor: campo(
      ceu(y0, hz),
      mar(hz, y1, t, u),
      ...nuvem(cx, y0 + 140 * u + (1 - ramp(t, 0, 2.5)) * 60 * u, 0.5 + ramp(t, 0, 2.5) * 0.6, 0),
      ...[0, 1, 2, 3, 4].map((i): Camada => {
        const f = (t * 0.4 + i / 5) % 1;
        return {cobre: elipse(x0 + (0.2 + i * 0.15) * (x1 - x0), hz - f * h * 0.3, 14 * u, 44 * u, 14 * u), luz: 1 - f * 0.1};
      })
    ),
    chuva: campo(ceu(y0, hz, 0.35, 0.55), mar(hz, y1, t, u), ...nuvem(cx, y0 + 130 * u, 1.3, 0.7), chuva(x0, x1, y0 + 230 * u, hz + 30 * u, t, u, ramp(t, 0.6, 1.8))),
    planta: campo(
      ceu(y0, y1 - 110 * u, 0.7, 0.95),
      {cobre: faixa(y1 - 110 * u, y1 + 20 * u, 10 * u), luz: (x, y) => 0.32 + 0.1 * Math.sin(x / (30 * u)) * Math.cos(y / (12 * u))},
      ...planta(cx, y1 - 105 * u, u, ramp(t, 0.6, 2.8), t)
    ),
  };
  return campos;
};

const Titulo: React.FC<PropsCena> = ({t}) => {
  const c = useCampos(t);
  return (
    <Tela>
      <Rotulo rotulo="prancha i" titulo="O ciclo da água" p={ramp(t, 0, 0.8)} />
      <Chapa c={c.titulo} p={ramp(t, 0, 1.2)} />
    </Tela>
  );
};

const SolEMar: React.FC<PropsCena> = ({t}) => {
  const c = useCampos(t);
  return (
    <Tela>
      <Rotulo rotulo="prancha ii" titulo="O sol" p={1} tamanho={100} />
      <Chapa de={c.titulo} c={c.solEMar} p={ramp(t, 0, 0.9)} />
    </Tela>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t}) => {
  const c = useCampos(t);
  return (
    <Tela>
      <Rotulo rotulo="prancha iii" titulo="O vapor" p={1} tamanho={100} />
      <Chapa de={c.solEMar} c={c.vapor} p={ramp(t, 0, 0.9)} />
    </Tela>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t}) => {
  const c = useCampos(t);
  return (
    <Tela>
      <Rotulo rotulo="prancha iv" titulo="A chuva" p={1} tamanho={100} />
      <Chapa de={c.vapor} c={c.chuva} p={ramp(t, 0, 0.9)} />
    </Tela>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const c = useCampos(t);
  return (
    <Tela>
      <Rotulo rotulo="prancha v" titulo="A planta" p={1} tamanho={100} />
      <Chapa de={c.chuva} c={c.planta} p={ramp(t, 0, 0.9)} />
    </Tela>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, que já está impresso na prancha: sem legenda nesse trecho
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
