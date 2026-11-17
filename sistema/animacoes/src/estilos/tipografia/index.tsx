// ESTILO: Tipografia cinética
// A palavra é o desenho. Fundo preto, letra condensada branca enorme, uma
// serifada itálica em ouro, e tudo que aparece é feito de texto: o mar são
// linhas da palavra "mar" ondulando, o sol é a palavra girando em anel.
// Corte seco entre as cenas, com um flash em negativo. Bom pra abertura,
// anúncio, motion e frase de impacto.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarAnton} from '@remotion/google-fonts/Anton';
import {loadFont as carregarPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import type {PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, cenasPorFrase, chega, elastico, lerp, ramp, sai, useTela} from '../../kit';

const {fontFamily: BLOCO} = carregarAnton('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: FINA} = carregarPlayfair('italic', {weights: ['600'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** Só três cores: preto, branco quente e ouro. O azul-gelo é só pra água caindo. */
export const COR = {preto: '#070707', branco: '#f4efe4', ouro: '#e0b44c', gelo: '#bfe3f2', cinza: '#2a2620'} as const;

/** Letra em ouro com brilho de metal (gradiente dentro da letra). */
const OURO: React.CSSProperties = {
  background: 'linear-gradient(180deg, #fff1c4 0%, #e8bd55 45%, #a87822 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

/** Preto puro com vinheta: a letra é a única luz. */
const Fundo: React.FC<{t: number}> = () => (
  <AbsoluteFill style={{background: COR.preto}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #1a1610 0%, transparent 60%)'}} />
  </AbsoluteFill>
);

export const tema: Tema = {
  id: 'tipografia',
  nome: 'Tipografia cinética',
  fundo: COR.preto,
  tinta: COR.branco,
  acento: COR.ouro,
  legenda: {
    fonte: BLOCO,
    peso: 400,
    tamanho: 74,
    cor: COR.branco,
    destaque: COR.ouro,
    sombra: '0 4px 0 #000, 0 0 22px #000, 0 0 8px #000',
    altura: 0.72,
    maiuscula: true,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** Uma linha de texto centrada na altura `y` (todo texto do estilo mora numa dessas). */
const Linha: React.FC<{y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({y, children, style}) => {
  const {L} = useTela();
  return (
    <div style={{position: 'absolute', top: y, left: 0, width: L, display: 'flex', justifyContent: 'center', transform: 'translateY(-50%)', ...style}}>
      {children}
    </div>
  );
};

/**
 * A peça de texto: a palavra entra letra por letra, caindo e passando um pouco do ponto.
 * `fina` troca a letra condensada pela serifada itálica; `ouro` pinta de ouro.
 */
export const Letras: React.FC<{
  txt: string;
  t: number;
  ini?: number;
  y: number;
  tamanho?: number;
  fina?: boolean;
  ouro?: boolean;
  passo?: number;
  queda?: number;
  some?: number;
}> = ({txt, t, ini = 0, y, tamanho = 200, fina = false, ouro = false, passo = 0.05, queda = -1, some = 0}) => {
  const {u} = useTela();
  return (
    <Linha y={y} style={{opacity: 1 - some, transform: `translateY(-50%) scale(${1 - some * 0.4})`}}>
      {txt.split('').map((ch, i) => {
        const p = ramp(t, ini + i * passo, ini + i * passo + 0.28, elastico);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              fontFamily: fina ? FINA : BLOCO,
              fontStyle: fina ? 'italic' : 'normal',
              fontWeight: fina ? 600 : 400,
              fontSize: tamanho * u,
              lineHeight: 1.1,
              color: COR.branco,
              opacity: Math.min(1, p * 2),
              transform: `translateY(${(1 - p) * queda * tamanho * 0.6 * u}px) scale(${0.4 + 0.6 * p})`,
              ...(ouro ? OURO : {}),
            }}
          >
            {ch}
          </span>
        );
      })}
    </Linha>
  );
};

/**
 * A peça de forma: uma faixa da mesma palavra repetida, correndo de lado e ondulando letra a letra.
 * Várias faixas empilhadas viram mar, chão, multidão. `vazada` desenha só o contorno da letra.
 */
export const Faixa: React.FC<{
  palavra: string;
  y: number;
  t: number;
  tamanho?: number;
  vazada?: boolean;
  dir?: 1 | -1;
  onda?: number;
  cor?: string;
  opacity?: number;
}> = ({palavra, y, t, tamanho = 120, vazada = false, dir = 1, onda = 0.18, cor = COR.branco, opacity = 1}) => {
  const {u} = useTela();
  const txt = `${palavra} · `.repeat(8);
  const passo = tamanho * u * 3;
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: -passo + ((dir * t * 60 * u) % passo),
        whiteSpace: 'nowrap',
        display: 'flex',
        fontFamily: BLOCO,
        fontSize: tamanho * u,
        lineHeight: 1,
        transform: 'translateY(-50%)',
        color: vazada ? 'transparent' : cor,
        WebkitTextStroke: vazada ? `${2.5 * u}px ${cor}` : undefined,
        opacity,
      }}
    >
      {txt.split('').map((ch, i) => (
        <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', transform: `translateY(${Math.sin(i * 0.55 + t * 2.4) * tamanho * onda * u}px)`}}>
          {ch}
        </span>
      ))}
    </div>
  );
};

/** A peça de traço: um fio de ouro que cresce do centro (sublinha, chão, horizonte). */
export const Fio: React.FC<{y: number; p: number; largura?: number}> = ({y, p, largura = 0.5}) => {
  const {L, u} = useTela();
  const w = L * largura * p;
  return <div style={{position: 'absolute', top: y, left: L / 2 - w / 2, width: w, height: 5 * u, background: COR.ouro}} />;
};

/** Uma palavra correndo em anel, num círculo que gira (sol, roda, relógio, planeta). Use dentro de <Tela>. */
export const Anel: React.FC<{id: string; x: number; y: number; r: number; palavra: string; giro: number; tamanho?: number; cor?: string}> = ({
  id,
  x,
  y,
  r,
  palavra,
  giro,
  tamanho = 46,
  cor = COR.ouro,
}) => {
  const {u} = useTela();
  const vezes = Math.max(3, Math.round((2 * Math.PI * r) / (palavra.length * tamanho * u * 0.75)));
  return (
    <g transform={`rotate(${giro} ${x} ${y})`}>
      <path id={`tipografia-${id}`} d={`M${x - r},${y} a${r},${r} 0 1,1 ${2 * r},0 a${r},${r} 0 1,1 ${-2 * r},0`} fill="none" />
      <text fontFamily={BLOCO} fontSize={tamanho * u} fill={cor}>
        <textPath href={`#tipografia-${id}`} textLength={2 * Math.PI * r - 6} lengthAdjust="spacing">
          {`${palavra} · `.repeat(vezes)}
        </textPath>
      </text>
    </g>
  );
};

/**
 * A transição: corte seco. Embrulha a cena inteira; nos primeiros quadros a tela
 * pisca em negativo e depois a cena faz um zoom lento contínuo. Use fusão 0 nas cenas.
 */
export const Corte: React.FC<{t: number; children: React.ReactNode}> = ({t, children}) => (
  <AbsoluteFill style={{transform: `scale(${1 + 0.05 * Math.min(1, t / 3)})`, filter: t < 0.07 ? 'invert(1)' : undefined, background: t < 0.07 ? COR.preto : undefined}}>
    {children}
  </AbsoluteFill>
);

// ---------- 3. os desenhos prontos ----------
// Todo desenho é feito de palavra: a palavra do próprio objeto, repetida,
// girando, caindo ou crescendo. Recebem o centro, o tamanho e `p` (0 a 1).

type Desenho = {x: number; y: number; tam?: number; p: number; t: number};

/** A palavra SOL em ouro, com dois anéis de texto girando em volta. */
export const Sol: React.FC<Desenho> = ({x, y, tam = 300, p, t}) => {
  const {u} = useTela();
  const s = ramp(p, 0, 1, elastico);
  return (
    <>
      <Tela>
        <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
          <Anel id="sol1" x={x} y={y} r={tam * 0.62} palavra="SOL" giro={t * 25} tamanho={52} />
          <Anel id="sol2" x={x} y={y} r={tam * 0.86} palavra="calor" giro={-t * 14} tamanho={40} cor="#c7a24a" />
        </g>
      </Tela>
      <div
        style={{
          position: 'absolute',
          left: x - tam,
          top: y,
          width: tam * 2,
          textAlign: 'center',
          transform: `translateY(-50%) scale(${s * (1 + balanco(t, 1) * 0.03)})`,
          fontFamily: BLOCO,
          fontSize: tam * 0.62,
          lineHeight: 1,
          filter: `drop-shadow(0 0 ${30 * u}px rgba(255,190,80,0.6))`,
          ...OURO,
        }}
      >
        SOL
      </div>
    </>
  );
};

/** Uma nuvem feita da palavra: cinco "nuvem" empilhadas no formato de nuvem, a do meio maior. */
export const Nuvem: React.FC<Desenho & {cor?: string}> = ({x, y, tam = 600, p, t, cor = COR.branco}) => {
  const {u} = useTela();
  const partes: [number, number, number][] = [
    [-0.34, 0.16, 0.12],
    [0.36, 0.16, 0.12],
    [-0.2, -0.17, 0.13],
    [0.22, -0.2, 0.12],
    [0, 0.12, 0.24],
  ];
  return (
    <>
      {partes.map(([dx, dy, s], i) => {
        const q = ramp(p, i * 0.12, i * 0.12 + 0.5, elastico);
        const grande = i === partes.length - 1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + dx * tam - tam / 2,
              top: y + dy * tam + balanco(t, 0.6, i) * 8 * u,
              width: tam,
              textAlign: 'center',
              transform: `translateY(-50%) scale(${q})`,
              fontFamily: grande ? BLOCO : FINA,
              fontStyle: grande ? 'normal' : 'italic',
              fontWeight: grande ? 400 : 600,
              fontSize: (tam * s) / u > 56 ? tam * s : 56 * u,
              lineHeight: 1,
              color: cor,
              opacity: grande ? 1 : 0.75,
            }}
          >
            {grande ? 'NUVEM' : 'nuvem'}
          </div>
        );
      })}
    </>
  );
};

/** Chuva de letras: as letras da palavra caindo sem parar entre `y` e `y + altura`. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; pingos?: number; palavra?: string}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  pingos = 18,
  palavra = 'chuva',
}) => {
  const {u} = useTela();
  return (
    <>
      {Array.from({length: pingos}, (_, i) => {
        if (i / pingos >= forca) return null;
        const fase = (t * (0.7 + acaso(`tv${i}`) * 0.5) + acaso(`tf${i}`)) % 1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - largura / 2 + acaso(`tx${i}`) * largura,
              top: y + fase * altura,
              fontFamily: BLOCO,
              fontSize: (56 + acaso(`ts${i}`) * 30) * u,
              lineHeight: 1,
              color: i % 4 ? COR.gelo : COR.branco,
              opacity: Math.min(1, fase * 6) * (1 - fase * 0.6),
            }}
          >
            {palavra[i % palavra.length]}
          </div>
        );
      })}
    </>
  );
};

/** O mar: faixas de "mar" ondulando, uma cheia e uma vazada, subindo de baixo com `p`. `quente` pinta de ouro. */
export const Mar: React.FC<{y: number; p: number; t: number; linhas?: number; quente?: number}> = ({y, p, t, linhas = 3, quente = 0}) => {
  const {u} = useTela();
  return (
    <>
      {Array.from({length: linhas}, (_, k) => {
        const q = ramp(p, k * 0.15, k * 0.15 + 0.6, chega);
        const cor = k % 2 ? COR.branco : quente > 0.5 ? COR.ouro : COR.branco;
        return (
          <Faixa
            key={k}
            palavra="MAR"
            y={y + k * 110 * u + (1 - q) * 300 * u}
            t={t + k}
            tamanho={110}
            vazada={k % 2 === 1}
            dir={k % 2 ? -1 : 1}
            cor={cor}
            opacity={q * (1 - k * 0.15)}
          />
        );
      })}
    </>
  );
};

/** Uma planta que cresce: o caule é a palavra escrita de pé, e as folhas são "folha" saindo de lado. */
export const Planta: React.FC<Desenho> = ({x, y, tam = 500, p, t}) => {
  const {u} = useTela();
  const alto = tam * ramp(p, 0, 0.7, chega);
  const venta = balanco(t, 0.8) * 3;
  const folhas: [number, 1 | -1][] = [
    [0.35, -1],
    [0.6, 1],
    [0.85, -1],
  ];
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${venta}deg)`, transformOrigin: '0 0'}}>
      <div
        style={{
          position: 'absolute',
          left: -40 * u,
          top: -alto,
          height: alto,
          width: 80 * u,
          overflow: 'hidden',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          fontFamily: BLOCO,
          fontSize: 64 * u,
          lineHeight: `${80 * u}px`,
          color: '#cfe3a0',
          whiteSpace: 'nowrap',
          textAlign: 'start',
        }}
      >
        {'raiz · caule · broto · '.repeat(3)}
      </div>
      {folhas.map(([h, lado], i) => {
        const q = ramp(p, 0.3 + i * 0.18, 0.6 + i * 0.18, elastico);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: lado > 0 ? 30 * u : -30 * u,
              top: -tam * h * 0.7 - 30 * u,
              transform: `translateX(${lado > 0 ? 0 : -100}%) rotate(${lado * -24}deg) scale(${q})`,
              transformOrigin: lado > 0 ? 'left center' : 'right center',
              fontFamily: FINA,
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: 70 * u,
              lineHeight: 1,
              ...OURO,
            }}
          >
            folha
          </div>
        );
      })}
    </div>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t}) => {
  const {A, u} = useTela();
  return (
    <Corte t={t}>
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <Faixa key={k} palavra="água" y={A * 0.12 + k * 150 * u} t={t + k} tamanho={90} vazada dir={k % 2 ? 1 : -1} cor="#3a342a" onda={0.1} />
      ))}
      <Letras txt="O CICLO" t={t} y={A * 0.33} tamanho={250} passo={0.06} />
      <Letras txt="da água" t={t} ini={0.45} y={A * 0.48} tamanho={170} fina ouro queda={1} />
      <Fio y={A * 0.56} p={ramp(t, 0.9, 1.5, chega)} />
    </Corte>
  );
};

const SolEMar: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const quente = ramp(t, 1.1, 1.6);
  return (
    <Corte t={t}>
      <Sol x={L / 2} y={A * 0.2} tam={260 * u} p={ramp(t, 0, 0.8)} t={t} />
      <Mar y={A * 0.43} p={ramp(t, 0.3, 1.2)} t={t} quente={quente} />
      {/* o calor subindo do mar: tremulações em ouro */}
      {[0.3, 0.5, 0.7].map((fx, i) => {
        const f = (t * 0.8 + i * 0.33) % 1;
        return (
          <div key={i} style={{position: 'absolute', left: L * fx - 30 * u, top: A * (0.38 - f * 0.06), fontFamily: FINA, fontStyle: 'italic', fontSize: 80 * u, color: COR.ouro, opacity: quente * Math.sin(f * Math.PI)}}>
            ~
          </div>
        );
      })}
    </Corte>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <Corte t={t}>
      <Mar y={A * 0.52} p={1} t={t} linhas={2} />
      {/* "vapor" sobe do mar e some dentro da nuvem */}
      {Array.from({length: 6}, (_, i) => {
        const f = ramp(t, i * 0.22, i * 0.22 + 1.3, sai);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: L * (0.2 + acaso(`vp${i}`) * 0.5),
              top: lerp(A * 0.48, A * 0.24, f),
              fontFamily: FINA,
              fontStyle: 'italic',
              fontSize: 64 * u,
              color: COR.branco,
              opacity: Math.sin(f * Math.PI) * 0.9,
            }}
          >
            vapor
          </div>
        );
      })}
      <Nuvem x={L / 2} y={A * 0.22} tam={(520 + ramp(t, 1.2, 2.6) * 120) * u} p={ramp(t, 0.9, 1.9)} t={t} />
    </Corte>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const pesa = ramp(t, 0.2, 0.9, elastico);
  return (
    <Corte t={t}>
      <Nuvem x={L / 2} y={A * (0.17 + pesa * 0.04)} tam={660 * u} p={1} t={t} cor={pesa > 0.5 ? COR.gelo : COR.branco} />
      <Chuva x={L / 2} y={A * 0.3} largura={L * 0.7} altura={A * 0.28} t={t} forca={ramp(t, 0.7, 1.6)} />
    </Corte>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <Corte t={t}>
      <Chuva x={L / 2} y={A * 0.2} largura={L * 0.75} altura={A * 0.2} t={t} pingos={12} />
      <Fio y={A * 0.585} p={ramp(t, 0, 0.5, chega)} largura={0.8} />
      <Planta x={L / 2} y={A * 0.58} tam={A * 0.3} p={ramp(t, 0.3, 2.4)} t={t} />
      <Letras txt="CRESCE" t={t} ini={1.6} y={A * 0.11} tamanho={150} ouro />
    </Corte>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // o título já está escrito na tela: sem legenda nesse trecho
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
