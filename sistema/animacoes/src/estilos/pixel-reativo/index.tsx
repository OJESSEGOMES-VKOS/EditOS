// ESTILO: Pixel reativo
// Arcade de 16 bits à noite: céu violeta em degraus, moldura de fliperama e
// sprites feitos de quadradinhos que PULAM a cada palavra dita. A fala é a
// batida: cada palavra dá um pulso que faz o sprite saltar, o chão tremer e
// soltar faísca. Bom pra curiosidade rápida, tecnologia e público jovem.
//
// Este arquivo segue o molde do giz:
//   1. `tema`      cores, fundo e legenda
//   2. as peças    sprite, pulso da fala, caixa de texto, faísca, varredura
//   3. os desenhos Sol, Nuvem, Chuva, Mar e Planta em sprite
//   4. `Exemplo`   o ciclo da água contado neste estilo
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarPress} from '@remotion/google-fonts/PressStart2P';
import {loadFont as carregarJersey} from '@remotion/google-fonts/Jersey10';
import type {Fala, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, cenasPorFrase, ramp, useTela} from '../../kit';

const {fontFamily: ARCADE} = carregarPress('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: PIXEL} = carregarJersey('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** A paleta fechada. Cada letra dos sprites é uma destas cores. */
export const COR: Record<string, string> = {
  k: '#1b1626', // contorno e moldura
  w: '#ffffff',
  y: '#ffd83d',
  o: '#ff9b1f',
  r: '#e8433a',
  B: '#2f6fd6', // mar
  b: '#5aa7ff',
  c: '#9fe1ff', // espuma, vapor, pingo
  g: '#3fb24a',
  G: '#22783a',
  t: '#7a4a24', // terra
  s: '#c9c2b8',
  n: '#8d9bb8', // nuvem carregada
  v: '#5a4a8a',
};

/** O pixel: tudo anda e cresce em múltiplos dele. */
const usePx = () => {
  const {u} = useTela();
  return 12 * u;
};
const grade = (v: number, P: number) => Math.round(v / P) * P;

const CEU = ['#120d24', '#18122f', '#1f173c', '#271d4b', '#30245c', '#3b2b6e'];

/** O céu de fliperama: faixas violeta em degrau, estrelas que piscam e a moldura do gabinete. */
const Fundo: React.FC<{t: number}> = ({t}) => {
  const {L, A} = useTela();
  const P = usePx();
  const faixa = grade(A * 0.11, P);
  return (
    <AbsoluteFill style={{background: CEU[0]}}>
      <Tela>
        <g shapeRendering="crispEdges">
          {CEU.map((c, i) => (
            <rect key={c} x={0} y={i * faixa} width={L} height={faixa + 1} fill={c} />
          ))}
          <rect x={0} y={CEU.length * faixa} width={L} height={A} fill="#140f2a" />
          {/* xadrez entre as faixas, como no jogo */}
          {CEU.slice(1).map((c, i) =>
            Array.from({length: Math.ceil(L / (P * 2))}, (_, k) => (
              <rect key={`${i}-${k}`} x={k * P * 2 + (i % 2) * P} y={(i + 1) * faixa - P} width={P} height={P} fill={c} />
            ))
          )}
          {Array.from({length: 34}, (_, i) => {
            const x = grade(acaso(`pr-x${i}`) * L, P);
            const y = grade(P * 6 + acaso(`pr-y${i}`) * A * 0.5, P);
            const liga = (Math.floor(t * 2.5 + acaso(`pr-f${i}`) * 6) + i) % 4 !== 0;
            return liga ? <rect key={i} x={x} y={y} width={P * 0.75} height={P * 0.75} fill={i % 5 ? '#ffffff' : COR.y} opacity={0.75} /> : null;
          })}
        </g>
        {/* moldura do gabinete: preto grosso com filete amarelo */}
        <rect x={P} y={P} width={L - 2 * P} height={A - 2 * P} fill="none" stroke={COR.k} strokeWidth={P * 2} />
        <rect x={P * 2.5} y={P * 2.5} width={L - 5 * P} height={A - 5 * P} fill="none" stroke={COR.y} strokeWidth={P * 0.6} />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'pixel-reativo',
  nome: 'Pixel reativo',
  fundo: CEU[0],
  tinta: '#ffffff',
  acento: COR.y,
  legenda: {
    fonte: PIXEL,
    peso: 400,
    tamanho: 100,
    cor: '#ffffff',
    destaque: COR.y,
    sombra: '-4px -4px 0 #1b1626, 4px -4px 0 #1b1626, -4px 4px 0 #1b1626, 4px 4px 0 #1b1626, 0 9px 0 #1b1626',
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/**
 * O pulso da fala: 1 no instante em que uma palavra começa, cai rápido até 0.
 * É a batida do estilo: use pra fazer sprite pular, chão tremer, faísca sair.
 * `atraso` em segundos faz um sprite pular um pouco depois do outro.
 */
export const pulso = (fala: Fala, tv: number, atraso = 0) => {
  const agora = tv - atraso;
  let ultima = -99;
  for (const f of fala.frases) {
    if (f.s > agora) break;
    for (const p of f.palavras) if (p.s <= agora) ultima = p.s;
  }
  return Math.exp(-(agora - ultima) / 0.13);
};

/** Quantas palavras já foram ditas: serve pra alternar pose ou lado a cada batida. */
export const batidas = (fala: Fala, tv: number) =>
  fala.frases.reduce((n, f) => n + f.palavras.filter((p) => p.s <= tv).length, 0);

/**
 * Um sprite: cada string é uma linha, cada letra uma cor de `COR` ('.' é vazio).
 * (x, y) é o canto de cima à esquerda, `e` a escala (inteira fica mais fiel), `troca` recolore letras.
 * A posição sempre cai na grade do pixel: o sprite anda aos degraus.
 */
export const Sprite: React.FC<{linhas: string[]; x: number; y: number; e?: number; troca?: Record<string, string>; virar?: boolean}> = ({
  linhas,
  x,
  y,
  e = 1,
  troca,
  virar,
}) => {
  const P = usePx() * e;
  const w = linhas[0].length;
  const x0 = grade(x, usePx());
  const y0 = grade(y, usePx());
  return (
    <g shapeRendering="crispEdges">
      {linhas.flatMap((linha, j) =>
        linha.split('').map((ch, i) => {
          if (ch === '.') return null;
          const cor = COR[troca?.[ch] ?? ch] ?? ch;
          const xi = virar ? w - 1 - i : i;
          return <rect key={`${i}-${j}`} x={x0 + xi * P} y={y0 + j * P} width={P + 0.5} height={P + 0.5} fill={cor} />;
        })
      )}
    </g>
  );
};

/** Largura e altura de um sprite na tela, pra centralizar. */
export const medida = (linhas: string[], e: number, P: number) => [linhas[0].length * P * e, linhas.length * P * e] as const;

/** Faíscas: quatro pixels que saltam de (x, y) na batida. Passe o `pulso`. */
export const Faisca: React.FC<{x: number; y: number; forca: number; cor?: string}> = ({x, y, forca, cor = COR.y}) => {
  const P = usePx();
  if (forca < 0.08) return null;
  const d = (1 - forca) * P * 7 + P * 2;
  return (
    <g shapeRendering="crispEdges" opacity={forca}>
      {[
        [-1, -1],
        [1, -1],
        [-1.6, 0],
        [1.6, 0],
      ].map(([a, b], i) => (
        <rect key={i} x={grade(x + a * d, P)} y={grade(y + b * d, P)} width={P} height={P} fill={cor} />
      ))}
    </g>
  );
};

/**
 * A caixa de texto do jogo: fundo preto, borda branca, letra de fliperama que se digita.
 * Vai FORA da <Tela> (é HTML). `p` de 0 a 1 digita o texto; `\n` quebra linha.
 */
export const Caixa: React.FC<{x: number; y: number; largura: number; p: number; children: string; tamanho?: number; cor?: string; rotulo?: string; pulo?: number}> = ({
  x,
  y,
  largura,
  p,
  children,
  tamanho = 64,
  cor = '#ffffff',
  rotulo,
  pulo = 0,
}) => {
  const {u} = useTela();
  const P = usePx();
  if (p <= 0) return null;
  const n = Math.floor(children.length * Math.min(1, p * 1.15));
  return (
    <div
      style={{
        position: 'absolute',
        left: x - largura / 2,
        top: y,
        width: largura,
        background: COR.k,
        border: `${P}px solid #ffffff`,
        boxShadow: `${P}px ${P}px 0 ${COR.r}`,
        padding: `${30 * u}px ${28 * u}px`,
        textAlign: 'center',
        transform: `translateY(${-pulo * 10 * u}px)`,
      }}
    >
      {rotulo && <div style={{fontFamily: ARCADE, fontSize: 30 * u, color: COR.y, marginBottom: 22 * u}}>{rotulo}</div>}
      <div style={{fontFamily: PIXEL, fontWeight: 400, fontSize: tamanho * u, lineHeight: 1.15, color: cor, whiteSpace: 'pre-line', minHeight: tamanho * u * 1.15}}>
        {children.slice(0, n)}
        <span style={{opacity: Math.floor(p * 12) % 2 ? 1 : 0, color: COR.y}}>{n < children.length ? '█' : ''}</span>
      </div>
    </div>
  );
};

/**
 * A transição: faixas pretas entram alternando os lados e fecham a tela, em degraus.
 * Ponha no fim da cena (p de 0 a 1) ou no começo da próxima (`abrir`).
 */
export const Varredura: React.FC<{p: number; abrir?: boolean}> = ({p, abrir}) => {
  const {L, A} = useTela();
  const P = usePx();
  if (p <= 0 || (abrir && p >= 1)) return null;
  const n = 16;
  const h = A / n;
  return (
    <AbsoluteFill>
      <Tela>
        <g shapeRendering="crispEdges">
          {Array.from({length: n}, (_, i) => {
            const q = ramp(p, (i / n) * 0.4, 0.6 + (i / n) * 0.4);
            const w = grade((abrir ? 1 - q : q) * L, P * 3);
            return <rect key={i} x={i % 2 ? L - w : 0} y={i * h} width={w} height={h + 1} fill={COR.k} />;
          })}
        </g>
      </Tela>
    </AbsoluteFill>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Todo desenho é um sprite (ou uma pilha de retângulos na grade). Recebe o centro
// (x, y), a escala `e` e o `pulo` (o pulso da fala). Desenho novo: escreva as linhas.

export const SPRITES = {
  sol: ['...yy...', '.y.yy.y.', '..yyyy..', 'yyyooyyy', 'yyyooyyy', '..yyyy..', '.y.yy.y.', '...yy...'],
  nuvem: ['....www.....', '..wwwwww.ww.', '.wwwwwwwwwww', 'wwwwwwwwwwww', '.ssssssssss.'],
  gota: ['.c.', 'cwc', 'ccc', '.c.'],
  folha: ['..gg', '.ggG', 'ggG.', 'G...'],
  broto: ['.y.', 'yoy', '.y.'],
};

type Desenho = {x: number; y: number; e?: number; pulo?: number};

export const Sol: React.FC<Desenho> = ({x, y, e = 4, pulo = 0}) => {
  const P = usePx();
  const [w, h] = medida(SPRITES.sol, e, P);
  return <Sprite linhas={SPRITES.sol} x={x - w / 2} y={y - h / 2 - pulo * P * 4} e={e} />;
};

export const Nuvem: React.FC<Desenho & {carregada?: boolean}> = ({x, y, e = 4, pulo = 0, carregada}) => {
  const P = usePx();
  const [w, h] = medida(SPRITES.nuvem, e, P);
  return <Sprite linhas={SPRITES.nuvem} x={x - w / 2} y={y - h / 2 - pulo * P * 2} e={e} troca={carregada ? {w: 'n', s: 'v'} : undefined} />;
};

/** Pingos de 1 por 3 pixels que caem na grade, entre `y` e `y + altura`. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; pingos?: number}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  pingos = 18,
}) => {
  const P = usePx();
  return (
    <g shapeRendering="crispEdges">
      {Array.from({length: pingos}, (_, i) => {
        if (i / pingos > forca) return null;
        const fase = (t * (1.1 + acaso(`pr-v${i}`) * 0.5) + acaso(`pr-f${i}`)) % 1;
        const px = grade(x - largura / 2 + acaso(`pr-c${i}`) * largura, P);
        const py = grade(y + fase * altura, P);
        return <rect key={i} x={px} y={py} width={P} height={P * 3} fill={COR.c} />;
      })}
    </g>
  );
};

/** O mar: bloco azul com a crista em degraus que ondula, e espuma. `pulo` faz a crista saltar. */
export const Mar: React.FC<{y: number; altura: number; t: number; pulo?: number; p?: number}> = ({y, altura, t, pulo = 0, p = 1}) => {
  const {L} = useTela();
  const P = usePx();
  const col = P * 3;
  const n = Math.ceil(L / col);
  const sobe = altura * (1 - ramp(p, 0, 1));
  return (
    <g shapeRendering="crispEdges">
      {Array.from({length: n}, (_, i) => {
        const onda = grade(Math.sin(i * 0.55 + t * 3) * P * 1.6 - pulo * P * 2 * (i % 2 ? 1 : 0.4), P);
        const top = grade(y, P) + onda + sobe;
        return (
          <g key={i}>
            <rect x={i * col} y={top} width={col + 0.5} height={Math.max(0, altura - onda - sobe)} fill={COR.B} />
            <rect x={i * col} y={top} width={col + 0.5} height={P} fill={COR.b} />
            {(i + Math.floor(t * 4)) % 5 === 0 && <rect x={i * col} y={top - P} width={P * 2} height={P} fill={COR.c} />}
          </g>
        );
      })}
    </g>
  );
};

/** O chão: grama em dente de serra em cima de terra. */
export const Chao: React.FC<{y: number; altura: number; tremor?: number}> = ({y, altura, tremor = 0}) => {
  const {L} = useTela();
  const P = usePx();
  const y0 = grade(y + tremor * P, P);
  return (
    <g shapeRendering="crispEdges">
      <rect x={0} y={y0} width={L} height={altura} fill={COR.t} />
      <rect x={0} y={y0} width={L} height={P * 2} fill={COR.g} />
      {Array.from({length: Math.ceil(L / (P * 4))}, (_, i) => (
        <rect key={i} x={i * P * 4} y={y0 - P} width={P * 2} height={P} fill={COR.g} />
      ))}
    </g>
  );
};

/** Uma planta que se monta bloco a bloco: `p` sobe o caule (um pixel por vez) e abre as folhas. */
export const Planta: React.FC<Desenho & {p: number}> = ({x, y, e = 2, p, pulo = 0}) => {
  const P = usePx() * e;
  const alto = Math.floor(ramp(p, 0, 0.75) * 9);
  const xb = grade(x - P / 2, usePx());
  const yb = grade(y - pulo * P * 0.8, usePx());
  const folhas = [
    {em: 3, lado: -1},
    {em: 5, lado: 1},
    {em: 7, lado: -1},
  ];
  return (
    <g shapeRendering="crispEdges">
      {Array.from({length: alto}, (_, i) => (
        <rect key={i} x={xb} y={yb - (i + 1) * P} width={P} height={P + 0.5} fill={i % 2 ? COR.G : COR.g} />
      ))}
      {folhas.map(({em, lado}, i) =>
        alto > em ? (
          <Sprite key={i} linhas={SPRITES.folha} virar={lado < 0} x={lado > 0 ? xb + P : xb - 4 * P} y={yb - (em + 3) * P} e={e} />
        ) : null
      )}
      {alto >= 9 && p > 0.85 && <Sprite linhas={SPRITES.broto} x={xb - P} y={yb - 12 * P} e={e} />}
    </g>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, dur, tv, fala}) => {
  const {L, A, u} = useTela();
  const P = usePx();
  const bate = pulso(fala, tv);
  const [gw] = medida(SPRITES.gota, 6, P);
  return (
    <>
      <Tela>
        <Sprite linhas={SPRITES.gota} x={L / 2 - gw / 2} y={A * 0.12 - Math.abs(Math.sin(t * 4)) * P * 6} e={6} />
        <Mar y={A * 0.52} altura={A * 0.12} t={t} pulo={bate} />
      </Tela>
      <Caixa x={L / 2} y={A * 0.25} largura={L * 0.84} p={ramp(t, 0.15, 1.1)} tamanho={150} rotulo="FASE 1" pulo={bate}>
        {'O CICLO\nDA ÁGUA'}
      </Caixa>
      <Varredura p={ramp(t, dur - 0.45, dur)} />
      <Varredura p={ramp(t, 0, 0.4)} abrir />
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur, tv, fala}) => {
  const {L, A} = useTela();
  const P = usePx();
  const bate = pulso(fala, tv);
  return (
    <>
      <Tela>
        <Sol x={L * 0.66} y={A * 0.2} e={4} pulo={bate} />
        <Faisca x={L * 0.66} y={A * 0.2} forca={bate} />
        <Mar y={A * 0.46} altura={A * 0.16} t={t} pulo={pulso(fala, tv, 0.08)} p={ramp(t, 0.1, 0.8)} />
        {/* o mar esquenta: vapor de pixels começa a subir */}
        {Array.from({length: 9}, (_, i) => {
          const fase = (t * 0.6 + i / 9) % 1;
          if (t < 1) return null;
          return (
            <rect
              key={i}
              x={grade(L * (0.12 + (i / 9) * 0.76), P)}
              y={grade(A * 0.44 - fase * A * 0.16, P)}
              width={P}
              height={P}
              fill={COR.c}
              opacity={1 - fase}
              shapeRendering="crispEdges"
            />
          );
        })}
      </Tela>
      <Varredura p={ramp(t, dur - 0.45, dur)} />
      <Varredura p={ramp(t, 0, 0.4)} abrir />
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur, tv, fala}) => {
  const {L, A} = useTela();
  const P = usePx();
  const bate = pulso(fala, tv);
  const e = 2 + Math.floor(ramp(t, 0.6, dur - 0.6) * 3.99); // a nuvem cresce em degraus
  return (
    <>
      <Tela>
        <Mar y={A * 0.5} altura={A * 0.12} t={t} pulo={bate} />
        {Array.from({length: 14}, (_, i) => {
          const fase = (t * 0.7 + acaso(`pr-vp${i}`)) % 1;
          return (
            <rect
              key={i}
              x={grade(L * (0.3 + acaso(`pr-vx${i}`) * 0.4) + Math.sin(fase * 6 + i) * P, P)}
              y={grade(A * 0.48 - fase * A * 0.22, P)}
              width={P}
              height={P}
              fill={COR.c}
              opacity={1 - fase * 0.7}
              shapeRendering="crispEdges"
            />
          );
        })}
        <Nuvem x={L * 0.5} y={A * 0.2} e={e} pulo={bate} />
      </Tela>
      <Varredura p={ramp(t, dur - 0.45, dur)} />
      <Varredura p={ramp(t, 0, 0.4)} abrir />
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur, tv, fala}) => {
  const {L, A} = useTela();
  const bate = pulso(fala, tv);
  const carregada = batidas(fala, tv) > 9 || t > 0.8;
  return (
    <>
      <Tela>
        <Chuva x={L * 0.5} y={A * 0.25} largura={L * 0.6} altura={A * 0.3} t={t} forca={ramp(t, 0.6, 1.6)} />
        <Nuvem x={L * 0.5} y={A * 0.18} e={6} pulo={bate} carregada={carregada} />
        <Chao y={A * 0.56} altura={A * 0.06} tremor={bate * 0.5} />
        <Faisca x={L * 0.3} y={A * 0.55} forca={pulso(fala, tv, 0.1)} cor={COR.c} />
        <Faisca x={L * 0.7} y={A * 0.55} forca={pulso(fala, tv, 0.18)} cor={COR.c} />
      </Tela>
      <Varredura p={ramp(t, dur - 0.45, dur)} />
      <Varredura p={ramp(t, 0, 0.4)} abrir />
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t, tv, fala}) => {
  const {L, A} = useTela();
  const bate = pulso(fala, tv);
  return (
    <>
      <Tela>
        <Nuvem x={L * 0.32} y={A * 0.13} e={4} carregada pulo={pulso(fala, tv, 0.1)} />
        <Chuva x={L * 0.32} y={A * 0.17} largura={L * 0.38} altura={A * 0.36} t={t} pingos={10} />
        <Sol x={L * 0.76} y={A * 0.14} e={3} pulo={bate} />
        <Chao y={A * 0.54} altura={A * 0.08} />
        <Planta x={L * 0.56} y={A * 0.54} e={2.5} p={ramp(t, 0.3, 2.6)} pulo={bate} />
        <Faisca x={L * 0.56} y={A * 0.22} forca={t > 2.6 ? bate : 0} />
      </Tela>
      <Varredura p={ramp(t, 0, 0.4)} abrir />
    </>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, já escrito na caixa: sem legenda nesse trecho
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
