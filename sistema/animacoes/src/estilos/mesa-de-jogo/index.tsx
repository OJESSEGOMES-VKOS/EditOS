// ESTILO: Mesa de jogo
// Uma mesa de feltro vinho à noite, sob a luz de uma luminária. Tudo é carta,
// ficha e ouro em folha: as coisas aparecem pintadas na face de cartas que
// viram em 3D, as fichas batem na mesa e o rodo do crupiê recolhe a cena.
// Bom pra curiosidade, conta, probabilidade, mistério e revelação.
import React from 'react';
import {AbsoluteFill, spring} from 'remotion';
import {loadFont as carregarAnton} from '@remotion/google-fonts/Anton';
import {loadFont as carregarPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as carregarArchivo} from '@remotion/google-fonts/Archivo';
import type {PropsCena, Tema} from '../../kit';
import {Camera, FALA_EXEMPLO, Filme, Tela, acaso, balanco, cenasPorFrase, chega, lerp, ramp, sai, useTela} from '../../kit';

const {fontFamily: ANTON} = carregarAnton('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: PLAY} = carregarPlayfair('italic', {weights: ['700'], subsets: ['latin', 'latin-ext']});
const {fontFamily: ARCHIVO} = carregarArchivo('normal', {weights: ['800'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As cores da mesa: feltro vinho, papel creme, tinta de baralho e ouro. */
export const COR = {
  vinho: '#4A1220',
  vinhoEscuro: '#2A0A14',
  creme: '#F3E9D2',
  petroleo: '#12475C',
  agua: '#6FB3C8',
  vermelho: '#D7263D',
  preto: '#161216',
  ouro: '#E0B04A',
  folha: '#2F6B4F',
} as const;

/** O feltro sob a luminária, a trama do pano, a borda de madeira e a poeira dourada no ar. */
const Fundo: React.FC<{t: number}> = ({t}) => {
  const {L, A, u} = useTela();
  const borda = 46 * u;
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle ${A * 0.62}px at 50% 38%, #A63655 0%, #822640 14%, #5E182B 30%, ${COR.vinho} 45%, ${COR.vinhoEscuro} 75%, #130408 100%)`}}>
      <AbsoluteFill
        style={{
          opacity: 0.55,
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.13) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(255,215,200,.05) 0 1px, transparent 1px 5px)',
        }}
      />
      <AbsoluteFill style={{border: `${borda}px solid #2C170D`, borderRadius: 60 * u, boxShadow: 'inset 0 0 0 5px #5A351C, inset 0 0 90px 30px rgba(0,0,0,.55)'}} />
      <Tela>
        <defs>
          {/* o metal do ouro em folha, usado por todo desenho dourado */}
          <linearGradient id="mesa-de-jogo-ouro" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FBE7A6" />
            <stop offset="0.3" stopColor="#E9BE5B" />
            <stop offset="0.52" stopColor="#C8922E" />
            <stop offset="0.68" stopColor="#F0CC72" />
            <stop offset="1" stopColor="#B8842A" />
          </linearGradient>
        </defs>
        {Array.from({length: 26}, (_, i) => {
          const x = acaso(`px${i}`) * L + Math.sin(t * 0.35 + i) * 46 * u;
          const y = (((acaso(`py${i}`) * A - t * 14 * u * (0.4 + acaso(`pv${i}`))) % A) + A) % A;
          return <circle key={i} cx={x} cy={y} r={(1.6 + acaso(`pr${i}`) * 3.4) * u} fill="#F6D58A" opacity={0.12 + 0.4 * Math.sin(t * 1.2 + i * 2.1) ** 2} />;
        })}
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'mesa-de-jogo',
  nome: 'Mesa de jogo',
  fundo: COR.vinho,
  tinta: COR.creme,
  acento: COR.ouro,
  legenda: {
    fonte: ARCHIVO,
    peso: 800,
    tamanho: 66,
    cor: COR.creme,
    destaque: COR.ouro,
    sombra: '0 4px 0 #130408, 0 0 20px #130408, 0 0 8px #130408',
    altura: 0.71,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** Pula de 0 a 1 com uma mola, a partir do segundo `t0`: o jeito de uma coisa bater na mesa. */
export const bate = (t: number, t0: number, firmeza = 170) => (t < t0 ? 0 : spring({frame: (t - t0) * 30, fps: 30, config: {damping: 11, stiffness: firmeza, mass: 0.6}}));

/** Um naipe de baralho (0 copas, 1 espadas, 2 ouros, 3 paus), num quadrado de lado `tam` com centro em (x, y). Use dentro de SVG. */
export const Naipe: React.FC<{n: number; x: number; y: number; tam: number; cor?: string; rot?: number}> = ({n, x, y, tam, cor, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${tam / 100}) translate(-50 -50)`} fill={cor ?? (n % 2 === 0 ? COR.vermelho : COR.preto)}>
    {n === 0 && <path d="M50 90 C20 64 5 47 5 29 C5 15 16 6 28 6 C38 6 46 12 50 21 C54 12 62 6 72 6 C84 6 95 15 95 29 C95 47 80 64 50 90Z" />}
    {n === 1 && <path d="M50 4 C70 30 95 44 95 64 C95 78 85 86 73 86 C64 86 57 82 53 75 C55 86 60 92 68 97 L32 97 C40 92 45 86 47 75 C43 82 36 86 27 86 C15 86 5 78 5 64 C5 44 30 30 50 4Z" />}
    {n === 2 && <path d="M50 3 L90 50 L50 97 L10 50Z" />}
    {n === 3 && <path d="M50 5 a21 21 0 1 1 -.1 0Z M26 37 a21 21 0 1 1 -.1 0Z M74 37 a21 21 0 1 1 -.1 0Z M43 48 L57 48 C57 78 62 90 70 97 L30 97 C38 90 43 78 43 48Z" />}
  </g>
);

const VERSO = `repeating-linear-gradient(45deg, rgba(243,233,210,.2) 0 2px, transparent 2px 13px), repeating-linear-gradient(-45deg, rgba(243,233,210,.2) 0 2px, transparent 2px 13px), ${COR.petroleo}`;

/**
 * A carta: a peça principal. `vira` 0 é de costas, 1 é de frente (no meio ela gira em 3D e levanta da mesa).
 * A face é um SVG de 200 x 280: passe o desenho em `children` (Sol, Mar...) ou só `canto` e `naipe` pra uma carta comum.
 */
export const Carta: React.FC<{
  x: number;
  y: number;
  largura: number;
  vira?: number;
  rot?: number;
  alt?: number;
  brilho?: number;
  canto?: string;
  naipe?: number;
  children?: React.ReactNode;
}> = ({x, y, largura, vira = 0, rot = 0, alt = 0, brilho = 0, canto, naipe = 2, children}) => {
  const v = Math.max(0, Math.min(1, vira));
  const ang = (1 - v) * 180;
  const frente = ang < 90;
  const h = alt + Math.sin(Math.PI * v) * 0.7; // quanto ela está fora da mesa
  const s = (largura / 200) * (1 + 0.1 * h);
  const tinta = naipe % 2 === 0 ? COR.vermelho : COR.preto;
  const luz = brilho > 0.01 ? `, 0 0 ${44 * brilho}px ${7 * brilho}px rgba(255,205,105,${0.8 * brilho})` : '';
  return (
    <div
      style={{
        position: 'absolute', left: x - 100, top: y - 140, width: 200, height: 280, borderRadius: 16, overflow: 'hidden', background: COR.creme,
        boxShadow: `${3 + 12 * h}px ${7 + 34 * h}px ${(9 + 40 * h) / s}px rgba(8,2,4,${0.5 - 0.15 * Math.min(1, h)})${luz}`,
        transform: `rotate(${rot}deg) scale(${s}) perspective(900px) rotateY(${frente ? ang : ang - 180}deg)`,
      }}
    >
      {frente ? (
        <svg viewBox="0 0 200 280" width={200} height={280} style={{position: 'absolute', inset: 0}}>
          {children ?? <Naipe n={naipe} x={100} y={150} tam={104} />}
          {canto && (
            <>
              <text x={26} y={48} textAnchor="middle" fontFamily={ANTON} fontSize={40} fill={tinta}>{canto}</text>
              <Naipe n={naipe} x={26} y={70} tam={24} />
              <g transform="rotate(180 100 140)">
                <text x={26} y={48} textAnchor="middle" fontFamily={ANTON} fontSize={40} fill={tinta}>{canto}</text>
                <Naipe n={naipe} x={26} y={70} tam={24} />
              </g>
            </>
          )}
          <rect x={1} y={1} width={198} height={278} rx={15} fill="none" stroke="rgba(90,60,30,.3)" strokeWidth={2} />
          {brilho > 0.01 && <rect width={200} height={280} fill="#FFE7A0" opacity={0.4 * brilho} />}
        </svg>
      ) : (
        <div style={{position: 'absolute', inset: 9, borderRadius: 9, background: VERSO, boxShadow: 'inset 0 0 0 3px rgba(224,176,74,.8)'}}>
          <div style={{position: 'absolute', left: '50%', top: '50%', width: 52, height: 52, margin: -26, transform: 'rotate(45deg)', background: 'linear-gradient(135deg,#F6DB8C,#C8922E)', border: `5px solid ${COR.creme}`, boxSizing: 'border-box'}} />
        </div>
      )}
    </div>
  );
};

/** Ficha de pôquer que bate na mesa. `d` é o diâmetro; dá pra escrever um número curto dentro. */
export const Ficha: React.FC<{x: number; y: number; d: number; cor?: string; s?: number; rot?: number; children?: React.ReactNode}> = ({x, y, d, cor = COR.vinho, s = 1, rot = 0, children}) =>
  s <= 0.01 ? null : (
    <div
      style={{
        position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', transform: `rotate(${rot}deg) scale(${s})`,
        background: `repeating-conic-gradient(${COR.creme} 0 18deg, ${cor} 18deg 45deg)`, boxShadow: `${d * 0.04}px ${d * 0.09}px ${d * 0.12}px rgba(6,1,3,.6)`,
      }}
    >
      <div style={{position: 'absolute', inset: '13%', borderRadius: '50%', background: cor, boxShadow: `inset 0 0 0 ${d * 0.035}px ${COR.ouro}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ANTON, color: COR.creme, fontSize: d * 0.5}}>
        {children}
      </div>
    </div>
  );

/** Uma pilha de fichas parada num canto da mesa (dá peso e cenário). */
export const Pilha: React.FC<{x: number; y: number; n?: number; d: number; cor?: string}> = ({x, y, n = 5, d, cor = COR.petroleo}) => (
  <>
    {Array.from({length: n}, (_, k) => (
      <Ficha key={k} x={x + (acaso(`pl${x}${k}`) - 0.5) * d * 0.06} y={y - k * d * 0.08} d={d} cor={cor} rot={acaso(`pr${y}${k}`) * 90} />
    ))}
  </>
);

/** Texto em ouro em folha, com um brilho que passa. `p` de 0 a 1 faz ele bater na mesa. */
export const Ouro: React.FC<{x: number; y: number; tam: number; p?: number; t?: number; children: React.ReactNode}> = ({x, y, tam, p = 1, t = 0, children}) => {
  if (p <= 0) return null;
  const brilho = (((t * 0.42) % 1.7) + 1.7) % 1.7 / 1.7;
  const base: React.CSSProperties = {fontFamily: ANTON, fontSize: tam, lineHeight: 1.18, padding: '0 0.08em', whiteSpace: 'pre', display: 'block'};
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${lerp(1.8, 1, p)})`, opacity: Math.min(1, p * 2)}}>
      <span style={{...base, position: 'absolute', color: 'rgba(18,3,7,.8)', transform: 'translate(0.035em,0.05em)', textShadow: '0 0 0.16em rgba(8,1,3,.75)'}}>{children}</span>
      <span
        style={{
          ...base, position: 'relative', color: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text', backgroundRepeat: 'no-repeat',
          backgroundImage: 'linear-gradient(105deg, rgba(255,252,232,0) 42%, rgba(255,252,232,.95) 50%, rgba(255,252,232,0) 58%), linear-gradient(180deg, #FBE7A6 0%, #E9BE5B 30%, #C8922E 52%, #F0CC72 66%, #B8842A 100%)',
          backgroundSize: '260% 100%, 100% 100%', backgroundPosition: `${lerp(140, -40, brilho)}% 0, 0 0`,
        }}
      >
        {children}
      </span>
    </div>
  );
};

/** Texto de apoio em creme, itálico de cartaz antigo. */
export const Rotulo: React.FC<{x: number; y: number; tam: number; p?: number; children: React.ReactNode}> = ({x, y, tam, p = 1, children}) =>
  p <= 0 ? null : (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, ${(1 - p) * 30}%)`, opacity: p, fontFamily: PLAY, fontSize: tam, color: COR.creme, whiteSpace: 'nowrap', textShadow: '0 3px 10px #130408'}}>
      {children}
    </div>
  );

/** Faíscas de ouro que estouram de um ponto no segundo `t0` (pra quando algo se revela). */
export const Estouro: React.FC<{x: number; y: number; t: number; t0: number; raio: number}> = ({x, y, t, t0, raio}) => {
  const d = (t - t0) / 0.8;
  if (d < 0 || d > 1) return null;
  return (
    <Tela>
      {Array.from({length: 22}, (_, i) => {
        const a = (i / 22) * Math.PI * 2 + acaso(`ea${i}`) * 0.8;
        const r = raio * (0.35 + 0.65 * acaso(`er${i}`)) * sai(d);
        return <circle key={i} cx={x + Math.cos(a) * r} cy={y + Math.sin(a) * r + raio * 0.15 * d * d} r={raio * 0.025 * (1 - d * 0.6)} fill="#F6D58A" opacity={1 - d * d} />;
      })}
    </Tela>
  );
};

/**
 * O rodo do crupiê: a transição do estilo. Envolve a cena e, com `p` de 0 a 1,
 * o rodo entra pela direita e varre tudo pra fora da mesa pela esquerda.
 */
export const Rodo: React.FC<{p: number; children: React.ReactNode}> = ({p, children}) => {
  const {L, A, u} = useTela();
  const k = ramp(p, 0, 1, (n) => n * n);
  const dx = -k * L * 1.25;
  const xr = L * 1.05 + dx; // a pá do rodo vai na frente do que ela empurra
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${dx}px) rotate(${-k * 4}deg)`}}>{children}</AbsoluteFill>
      {p > 0 && p < 1 && (
        <Tela>
          <g transform={`translate(${xr} ${A * 0.4}) rotate(${-8 + k * 6})`} filter="drop-shadow(10px 18px 10px rgba(6,1,3,.55))">
            <rect x={-14 * u} y={-A * 0.3} width={28 * u} height={A * 0.6} rx={10 * u} fill="#6B4425" />
            <rect x={14 * u} y={-12 * u} width={L * 0.9} height={24 * u} rx={12 * u} fill="#8A5A30" />
            <rect x={-14 * u} y={-A * 0.3} width={9 * u} height={A * 0.6} fill="url(#mesa-de-jogo-ouro)" />
          </g>
        </Tela>
      )}
    </AbsoluteFill>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Pintados com a tinta do baralho (vermelho, preto, ouro, petróleo), chapados e
// sem contorno de mão, como o naipe de uma carta. Recebem centro (x, y), tamanho e
// `p` (0 a 1). Servem soltos num SVG ou dentro da face de uma <Carta> (200 x 280).

type Desenho = {x: number; y: number; tam: number; p: number; t?: number};

export const Sol: React.FC<Desenho> = ({x, y, tam, p, t = 0}) => {
  const s = Math.max(0, p);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {Array.from({length: 12}, (_, i) => (
        <Naipe key={i} n={2} x={Math.cos((i / 12) * Math.PI * 2 + t * 0.3) * tam * 0.4} y={Math.sin((i / 12) * Math.PI * 2 + t * 0.3) * tam * 0.4} tam={tam * (0.17 + 0.02 * balanco(t, 1.4, i))} rot={(i / 12) * 360 + 90 + t * 17} cor="url(#mesa-de-jogo-ouro)" />
      ))}
      <circle r={tam * 0.27} fill={COR.vermelho} />
      <circle r={tam * 0.22} fill="url(#mesa-de-jogo-ouro)" />
    </g>
  );
};

export const Nuvem: React.FC<Desenho & {cor?: string}> = ({x, y, tam, p, cor = COR.petroleo}) => (
  <g transform={`translate(${x} ${y}) scale(${Math.max(0, p)})`} fill={cor}>
    <circle cx={-tam * 0.24} cy={tam * 0.02} r={tam * 0.17} />
    <circle cx={0} cy={-tam * 0.08} r={tam * 0.24} />
    <circle cx={tam * 0.25} cy={tam * 0.03} r={tam * 0.16} />
    <rect x={-tam * 0.4} y={tam * 0.02} width={tam * 0.8} height={tam * 0.17} rx={tam * 0.085} />
    <path d={`M${-tam * 0.3} ${tam * 0.12} H${tam * 0.3}`} stroke="url(#mesa-de-jogo-ouro)" strokeWidth={tam * 0.025} strokeLinecap="round" />
  </g>
);

/** Gotas em forma de lágrima caindo entre `y` e `y + altura`; `forca` de 0 a 1 liga a chuva aos poucos. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; tam: number; t: number; forca?: number; gotas?: number}> = ({x, y, largura, altura, tam, t, forca = 1, gotas = 14}) => (
  <>
    {Array.from({length: gotas}, (_, i) => {
      if (i / gotas >= forca) return null;
      const fase = (t * (0.8 + acaso(`cv${i}`) * 0.5) + acaso(`cf${i}`)) % 1;
      const gx = x - largura / 2 + acaso(`cx${i}`) * largura;
      return <Naipe key={i} n={0} x={gx} y={y + fase * altura} tam={tam} rot={180} cor={COR.agua} />;
    })}
  </>
);

/** O mar: faixas onduladas em petróleo com a crista em creme, balançando. */
export const Mar: React.FC<Desenho & {largura: number}> = ({x, y, tam, p, t = 0, largura}) => {
  const ondas = 7;
  const r = largura / ondas / 2;
  return (
    <g opacity={Math.min(1, p * 2)}>
      {[0, 1, 2].map((k) => {
        const dy = y + k * tam * 0.22 + (1 - p) * tam * 0.4;
        const dx = Math.sin(t * 1.4 + k) * r * 0.5;
        let topo = `M${x - largura / 2 - r * 2 + dx} ${dy}`;
        for (let i = -1; i <= ondas; i++) topo += ` a${r} ${r * 0.8} 0 0 1 ${r * 2} 0`;
        return (
          <g key={k}>
            <path d={`${topo} V${dy + tam} H${x - largura / 2 - r * 2 + dx} Z`} fill={[COR.agua, '#2E7C93', COR.petroleo][k]} />
            <path d={topo} fill="none" stroke={COR.creme} strokeWidth={tam * 0.025} opacity={0.6} />
          </g>
        );
      })}
    </g>
  );
};

/** Uma planta que cresce: caule de ouro e folhas em forma de espadas que abrem uma a uma. */
export const Planta: React.FC<Desenho> = ({x, y, tam, p, t = 0}) => {
  const alto = tam * ramp(p, 0, 0.6, chega);
  const venta = balanco(t, 0.8) * tam * 0.03;
  const folhas: [number, number, number][] = [
    [0.35, -1, 0.25],
    [0.6, 1, 0.4],
    [0.85, -1, 0.55],
    [1, 0, 0.7],
  ];
  return (
    <g>
      <path d={`M${x} ${y} Q${x + venta} ${y - alto * 0.5} ${x + venta * 2} ${y - alto}`} stroke="url(#mesa-de-jogo-ouro)" strokeWidth={tam * 0.05} fill="none" strokeLinecap="round" />
      {folhas.map(([h, lado, ini], i) => {
        const s = ramp(p, ini, ini + 0.3, chega);
        return s > 0 ? <Naipe key={i} n={1} x={x + venta * 2 * h + lado * tam * 0.13 * s} y={y - alto * h} tam={tam * 0.28 * s} rot={lado * 50} cor={COR.folha} /> : null;
      })}
    </g>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

/** A câmera da mesa: respira o tempo todo e empurra devagar. */
const Respira: React.FC<{t: number; children: React.ReactNode}> = ({t, children}) => {
  const {cx, cy} = useTela();
  return <Camera t={t} chaves={[{t: 0, x: cx, y: cy + balanco(t, 0.3) * 6, zoom: 1.04 + t * 0.012}]}>{children}</Camera>;
};

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <Rodo p={ramp(t, dur - 0.45, dur + 0.1)}>
      <Respira t={t}>
        {[-1, 0, 1].map((k) => (
          <Carta key={k} x={L / 2 + k * 230 * u} y={A * 0.47 + Math.abs(k) * 30 * u} largura={220 * u} rot={k * 12} vira={k === 0 ? ramp(t, 0.8, 1.3) : 0} alt={1 - bate(t, 0.15 * (k + 1))}>
            {k === 0 && <Mar x={100} y={130} tam={70} p={1} t={t} largura={200} />}
          </Carta>
        ))}
        <Pilha x={L * 0.17} y={A * 0.57} d={110 * u} cor={COR.vinho} />
        <Pilha x={L * 0.83} y={A * 0.57} n={4} d={110 * u} />
        <Ouro x={L / 2} y={A * 0.2} tam={150 * u} p={bate(t, 0.1)} t={t}>O ciclo</Ouro>
        <Ouro x={L / 2} y={A * 0.29} tam={150 * u} p={bate(t, 0.35)} t={t + 0.3}>da água</Ouro>
      </Respira>
    </Rodo>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const calor = ramp(t, 1.4, 2.4);
  return (
    <Rodo p={ramp(t, dur - 0.45, dur + 0.1)}>
      <Respira t={t}>
        <Carta x={L / 2} y={A * 0.2} largura={300 * u} vira={ramp(t, 0.1, 0.6)} alt={1 - bate(t, 0)} canto="A" brilho={0.3 + 0.3 * balanco(t, 2)}>
          <Sol x={100} y={150} tam={170} p={bate(t, 0.45)} t={t} />
        </Carta>
        <Carta x={L / 2} y={A * 0.46} largura={300 * u} vira={ramp(t, 0.6, 1.1)} alt={1 - bate(t, 0.4)} canto="A" naipe={1} brilho={calor * 0.8}>
          <Mar x={100} y={120 - calor * 10} tam={90} p={ramp(t, 0.9, 1.4)} t={t * (1 + calor * 2)} largura={200} />
        </Carta>
        {/* o calor descendo do sol pro mar: losangos de ouro em fila */}
        <Tela>
          {Array.from({length: 5}, (_, i) => {
            const f = (t * 0.9 + i / 5) % 1;
            return t > 1 ? <Naipe key={i} n={2} x={L / 2 + Math.sin(f * 7 + i) * 30 * u} y={A * (0.3 + f * 0.05)} tam={34 * u} cor="url(#mesa-de-jogo-ouro)" /> : null;
          })}
        </Tela>
      </Respira>
    </Rodo>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const vira = ramp(t, 1.3, 1.8);
  return (
    <Rodo p={ramp(t, dur - 0.45, dur + 0.1)}>
      <Respira t={t}>
        <Carta x={L / 2} y={A * 0.47} largura={280 * u} vira={1} canto="A" naipe={1}>
          <Mar x={100} y={120} tam={90} p={1} t={t} largura={200} />
        </Carta>
        <Carta x={L / 2} y={A * 0.19} largura={260 * u + vira * 60 * u} vira={vira} alt={1 - bate(t, 0.1)} canto="A" naipe={3} brilho={ramp(t, 1.5, 1.9) * (1 - ramp(t, 2, 2.6))}>
          <Nuvem x={100} y={150} tam={180} p={bate(t, 1.6)} />
        </Carta>
        {/* o vapor: poeira de ouro subindo da carta do mar até a carta de cima */}
        <Tela>
          {Array.from({length: 16}, (_, i) => {
            const f = (t * 0.7 + acaso(`vf${i}`)) % 1;
            const vy = A * 0.37 - f * A * 0.13;
            return <circle key={i} cx={L / 2 + (acaso(`vx${i}`) - 0.5) * 240 * u + Math.sin(t * 2 + i) * 20 * u} cy={vy} r={(8 + 10 * f) * u} fill={COR.creme} opacity={(1 - f) * 0.7 * (1 - ramp(t, 2.2, 2.6))} />;
          })}
        </Tela>
        <Estouro x={L / 2} y={A * 0.19} t={t} t0={1.75} raio={300 * u} />
      </Respira>
    </Rodo>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const pesa = ramp(t, 0.2, 1.1);
  return (
    <Rodo p={ramp(t, dur - 0.45, dur + 0.1)}>
      <Respira t={t}>
        <Carta x={L / 2 + Math.sin(t * 30) * 4 * u * pesa * (1 - ramp(t, 1.2, 1.4))} y={A * (0.19 + pesa * 0.04)} largura={320 * u} vira={1} canto="A" naipe={3}>
          <Nuvem x={100} y={150} tam={180 + pesa * 20} p={1} cor={pesa > 0.5 ? '#0B2E3C' : COR.petroleo} />
          <Chuva x={100} y={185} largura={120} altura={80} tam={18} t={t} forca={ramp(t, 1, 1.6)} gotas={8} />
        </Carta>
        <Tela>
          <Chuva x={L / 2} y={A * 0.33} largura={360 * u} altura={A * 0.24} tam={46 * u} t={t} forca={ramp(t, 1.1, 1.9)} gotas={16} />
        </Tela>
        <Ficha x={L * 0.24} y={A * 0.52} d={120 * u} cor={COR.petroleo} s={bate(t, 1.2)} />
        <Ficha x={L * 0.76} y={A * 0.5} d={120 * u} cor={COR.petroleo} s={bate(t, 1.45)} />
      </Respira>
    </Rodo>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const cresce = ramp(t, 0.6, 2.8);
  return (
    <Respira t={t}>
      <Tela>
        <Chuva x={L / 2} y={A * 0.06} largura={600 * u} altura={A * 0.22} tam={40 * u} t={t} gotas={12} forca={1 - ramp(t, 2.2, 3)} />
      </Tela>
      <Carta x={L / 2} y={A * 0.42} largura={330 * u} vira={ramp(t, 0, 0.45)} canto="A" naipe={1} brilho={ramp(t, 2.6, 3.1)}>
        <rect x={20} y={232} width={160} height={20} rx={10} fill="#6B4425" />
        <Planta x={100} y={234} tam={190} p={cresce} t={t} />
      </Carta>
      <Pilha x={L * 0.18} y={A * 0.55} d={110 * u} cor={COR.vinho} />
      <Pilha x={L * 0.82} y={A * 0.55} n={6} d={110 * u} />
      <Estouro x={L / 2} y={A * 0.42} t={t} t0={2.7} raio={360 * u} />
    </Respira>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // o título já está escrito em ouro na mesa: sem legenda nesse trecho
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
