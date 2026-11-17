// ESTILO: Colagem
// Um caderno de recortes: cada cena é uma folha nova de papel colorido, de borda
// rasgada, que entra deslizando e cobre a anterior; em cima dela as coisas são
// recortes de jornal, retícula de gráfica e papel listrado, colados um a um com
// sombra e um pouco tortos. O texto é bilhete de sequestro: cada letra recortada
// de uma revista diferente. Fita adesiva segura tudo.
//
//   1. `tema`      cores, papéis, fundo e legenda
//   2. as peças    Folha, FolhaNova, Recorte, Tira, Letras, Etiqueta, Fita
//   3. os desenhos Sol, Nuvem, Chuva, Mar, Planta
//   4. `Exemplo`   o ciclo da água
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarAbril} from '@remotion/google-fonts/AbrilFatface';
import {loadFont as carregarAnton} from '@remotion/google-fonts/Anton';
import {loadFont as carregarMaquina} from '@remotion/google-fonts/SpecialElite';
import {loadFont as carregarPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, caminho, cenasPorFrase, chega, circulo, elastico, emFila, ramp, tremer, useTela} from '../../kit';

const {fontFamily: ABRIL} = carregarAbril('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: ANTON} = carregarAnton('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: MAQUINA} = carregarMaquina('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: PLAYFAIR} = carregarPlayfair('normal', {weights: ['900'], subsets: ['latin', 'latin-ext']});
const FONTES = [ABRIL, ANTON, MAQUINA, PLAYFAIR];

// ---------- 1. o tema ----------

/** As cores chapadas de papel (folhas de fundo e recortes lisos). */
export const COR = {
  creme: '#fbf7ee',
  kraft: '#ece4d2',
  marinho: '#1f2a44',
  noite: '#14213d',
  ceu: '#bcd7e6',
  azul: '#3d6fb6',
  agua: '#9fc6c9',
  areia: '#e8d9b8',
  bege: '#d9c7a3',
  pessego: '#f2b880',
  vermelho: '#c1121f',
  amarelo: '#f6c945',
  verde: '#3f8a3a',
  marrom: '#6b4226',
  preto: '#1b1b1b',
} as const;
export type CorColagem = keyof typeof COR;

/** Os papéis estampados (cada recorte é de um papel). */
export const PAPEL = {
  listra: 'url(#colagem-listra)',
  solar: 'url(#colagem-ret-am)',
  folha: 'url(#colagem-ret-vd)',
  laranja: 'url(#colagem-ret-lj)',
  jornal: 'url(#colagem-jornal)',
} as const;
export type Papel = keyof typeof PAPEL | CorColagem;
const tinta = (p: Papel) => (p in PAPEL ? PAPEL[p as keyof typeof PAPEL] : COR[p as CorColagem]);

/** A mesa: papel kraft com fibra e tiras de jornal coladas no alto. Os papéis estampados moram aqui. */
const Fundo: React.FC<{t: number}> = () => {
  const {L, A, u} = useTela();
  return (
    <AbsoluteFill style={{background: COR.kraft}}>
      <Tela>
        <defs>
          <pattern id="colagem-listra" width={26 * u} height={26 * u} patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
            <rect width={26 * u} height={26 * u} fill="#7fb2dc" />
            <rect width={26 * u} height={11 * u} fill="#2f6fb0" />
          </pattern>
          <pattern id="colagem-ret-am" width={18 * u} height={18 * u} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <rect width={18 * u} height={18 * u} fill="#f6c945" />
            <circle cx={9 * u} cy={9 * u} r={5 * u} fill="#e07a1f" />
          </pattern>
          <pattern id="colagem-ret-vd" width={16 * u} height={16 * u} patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
            <rect width={16 * u} height={16 * u} fill="#8cc084" />
            <circle cx={8 * u} cy={8 * u} r={4.5 * u} fill="#2e6b33" />
          </pattern>
          <pattern id="colagem-ret-lj" width={14 * u} height={14 * u} patternUnits="userSpaceOnUse">
            <rect width={14 * u} height={14 * u} fill="#f4a261" />
            <circle cx={7 * u} cy={7 * u} r={4 * u} fill="#d1495b" />
          </pattern>
          <pattern id="colagem-jornal" width={180 * u} height={120 * u} patternUnits="userSpaceOnUse">
            <rect width={180 * u} height={120 * u} fill="#e9e2cf" />
            {Array.from({length: 9}, (_, i) => (
              <rect key={i} x={(6 + (i % 2) * 90) * u} y={(10 + Math.floor(i / 2) * 22) * u} width={(78 - (i % 3) * 12) * u} height={7 * u} fill="#6e6656" opacity={0.75} />
            ))}
            <rect x={6 * u} y={104 * u} width={160 * u} height={10 * u} fill="#3a3428" />
          </pattern>
          <filter id="colagem-fibra">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={3} seed={5} />
            <feColorMatrix values="0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0.1 0" />
          </filter>
          <filter id="colagem-sombra" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx={5 * u} dy={8 * u} stdDeviation={5 * u} floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>
        <rect width={L} height={A} filter="url(#colagem-fibra)" />
        <rect x={-30 * u} y={A * 0.06} width={L + 60 * u} height={A * 0.3} fill="url(#colagem-jornal)" opacity={0.5} transform={`rotate(-2 ${L / 2} ${A * 0.2})`} />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'colagem',
  nome: 'Colagem',
  fundo: COR.kraft,
  tinta: COR.preto,
  acento: COR.vermelho,
  legenda: {
    fonte: ANTON,
    peso: 400,
    tamanho: 66,
    cor: COR.creme,
    destaque: COR.amarelo,
    sombra: `0 0 0 ${COR.preto}, 3px 3px 0 ${COR.preto}, -2px -2px 0 ${COR.preto}, 2px -2px 0 ${COR.preto}, -2px 2px 0 ${COR.preto}`,
    altura: 0.72,
    maiuscula: true,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** Contorno rasgado: refina a forma e treme cada ponto, como papel rasgado à mão. */
export const rasgar = (pontos: Ponto[], semente: string, forca = 9): Ponto[] => {
  const fino: Ponto[] = [];
  for (let i = 0; i < pontos.length; i++) {
    const a = pontos[i];
    const b = pontos[(i + 1) % pontos.length];
    for (let k = 0; k < 3; k++) fino.push([a[0] + ((b[0] - a[0]) * k) / 3, a[1] + ((b[1] - a[1]) * k) / 3]);
  }
  return tremer(fino, semente, forca);
};

/** A folha de fundo da cena: papel de uma cor, borda de cima rasgada, por baixo de tudo da cena. */
export const Folha: React.FC<{cor: CorColagem; topo?: number; semente?: string}> = ({cor, topo, semente = 'f'}) => {
  const {L, A, u} = useTela();
  const y0 = topo ?? A * 0.08;
  const borda: Ponto[] = Array.from({length: 40}, (_, i) => [-20 * u + (i * (L + 40 * u)) / 39, y0 + (acaso(`${semente}${i}`) - 0.5) * 34 * u]);
  const forma: Ponto[] = [...borda, [L + 40 * u, A + 40 * u], [-40 * u, A + 40 * u]];
  return (
    <>
      <path d={caminho(forma, true, true)} fill={COR[cor]} filter="url(#colagem-sombra)" />
      <path d={caminho(forma, true, true)} fill="#000" opacity={0.08} filter="url(#colagem-fibra)" />
    </>
  );
};

/**
 * A transição: a cena inteira entra como folha nova, deslizando da direita e assentando torta.
 * Embrulhe a cena inteira nela; `p` de 0 a 1 nos primeiros 0,35 s. Use fusão 0 entre as cenas.
 */
export const FolhaNova: React.FC<{p: number; children: React.ReactNode}> = ({p, children}) => {
  const {L, A} = useTela();
  const q = 1 - p;
  return (
    <AbsoluteFill style={{transform: `translateX(${q * (L + 80)}px) rotate(${q * 6}deg)`, transformOrigin: `${L / 2}px ${A * 0.68}px`}}>
      {children}
    </AbsoluteFill>
  );
};

/**
 * Um recorte colado: forma de papel com borda rasgada e a margem branca do recorte. `p` de 0 a 1 cola ele (chega
 * maior e torto, assenta com sombra). `papel` é a estampa (listra, solar, folha, laranja, jornal) ou uma cor lisa.
 */
export const Recorte: React.FC<{pontos: Ponto[]; p: number; papel: Papel; semente: string; borda?: boolean; giro?: number}> = ({
  pontos,
  p,
  papel,
  semente,
  borda = true,
  giro,
}) => {
  const {u} = useTela();
  const forma = React.useMemo(() => rasgar(pontos, semente, 9 * u), [pontos, semente, u]);
  if (p <= 0) return null;
  const xs = pontos.map((q) => q[0]);
  const ys = pontos.map((q) => q[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const g = giro ?? (acaso(`${semente}g`) - 0.5) * 7;
  const q = ramp(p, 0, 1, elastico);
  const s = 1.25 - 0.25 * q;
  const d = caminho(forma, true, true);
  return (
    <g opacity={Math.min(1, p * 2.5)} transform={`translate(${cx} ${cy}) rotate(${g * (2 - q)}) scale(${s}) translate(${-cx} ${-cy})`} filter="url(#colagem-sombra)">
      {borda && <path d={d} fill={COR.creme} stroke={COR.creme} strokeWidth={10 * u} strokeLinejoin="bevel" />}
      <path d={d} fill={tinta(papel)} />
    </g>
  );
};

/** Uma tira de papel no lugar de linha (raio, caule, onda): margem branca e a cor por cima, pontas cortadas. */
export const Tira: React.FC<{pontos: Ponto[]; p: number; cor?: CorColagem; grossura?: number; semente: string}> = ({pontos, p, cor = 'preto', grossura = 20, semente}) => {
  const {u} = useTela();
  const pts = React.useMemo(() => tremer(pontos, semente, 3 * u), [pontos, semente, u]);
  if (p <= 0) return null;
  const d = caminho(pts, false, true);
  return (
    <g filter="url(#colagem-sombra)" opacity={Math.min(1, p * 3)}>
      <path d={d} fill="none" stroke={COR.creme} strokeWidth={(grossura + 10) * u} strokeLinecap="square" strokeLinejoin="bevel" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
      <path d={d} fill="none" stroke={COR[cor]} strokeWidth={grossura * u} strokeLinecap="butt" strokeLinejoin="bevel" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
    </g>
  );
};

/**
 * Bilhete de sequestro: cada letra recortada de uma revista (fonte, cor e giro diferentes), coladas uma a uma.
 * Use pra título e pra UMA palavra forte; nunca pra frase que a legenda já está mostrando.
 */
export const Letras: React.FC<{texto: string; p: number; tamanho?: number; semente?: string}> = ({texto, p, tamanho = 118, semente = 'l'}) => {
  const {u} = useTela();
  const pares = [
    [COR.creme, '#111'],
    ['#111', COR.creme],
    ['#e63946', '#fff'],
    [COR.amarelo, '#111'],
    [COR.creme, COR.vermelho],
    ['#a8dadc', '#111'],
  ];
  const n = texto.replace(/ /g, '').length;
  let idx = 0;
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: tamanho * 0.5 * u, rowGap: 14 * u}}>
      {texto.split(' ').map((w, wi) => (
        <div key={wi} style={{display: 'flex', gap: 5 * u}}>
          {[...w].map((ch) => {
            const i = idx++;
            const [fundo, cor] = pares[Math.floor(acaso(semente + i) * pares.length)];
            const q = ramp(p, i / (n + 1), (i + 1.6) / (n + 1), elastico);
            return (
              <div
                key={i}
                style={{
                  fontFamily: FONTES[Math.floor(acaso(`${semente}f${i}`) * 4)],
                  fontSize: tamanho * u * (0.92 + acaso(`${semente}s${i}`) * 0.18),
                  lineHeight: 1.05,
                  padding: `${2 * u}px ${9 * u}px`,
                  background: fundo,
                  color: cor,
                  transform: `rotate(${(acaso(`${semente}r${i}`) - 0.5) * 9}deg) scale(${0.6 + 0.4 * q})`,
                  boxShadow: `${3 * u}px ${4 * u}px 0 rgba(0,0,0,0.28)`,
                  opacity: q > 0 ? 1 : 0,
                }}
              >
                {ch}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** A etiqueta vermelha: uma palavra em Anton, caixa alta, que se revela da esquerda (rótulo, número, lugar). */
export const Etiqueta: React.FC<{children: string; p: number; tamanho?: number; cor?: CorColagem}> = ({children, p, tamanho = 64, cor = 'vermelho'}) => {
  const {u} = useTela();
  return (
    <div
      style={{
        display: 'inline-block',
        fontFamily: ANTON,
        fontSize: tamanho * u,
        letterSpacing: '0.12em',
        color: '#fff',
        background: COR[cor],
        padding: `${4 * u}px ${26 * u}px`,
        transform: 'rotate(-2deg)',
        boxShadow: `${4 * u}px ${5 * u}px 0 rgba(0,0,0,0.3)`,
        clipPath: `inset(0 ${100 - Math.min(1, p) * 100}% 0 0)`,
      }}
    >
      {children.toUpperCase()}
    </div>
  );
};

/** Um pedaço de fita adesiva translúcida, pra prender uma folha ou um recorte (dentro de <Tela>). */
export const Fita: React.FC<{x: number; y: number; giro?: number; p?: number}> = ({x, y, giro = -20, p = 1}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  return <rect x={x - 75 * u} y={y - 24 * u} width={150 * u} height={48 * u} fill="#f3eccf" opacity={0.75 * Math.min(1, p * 2)} transform={`rotate(${giro} ${x} ${y})`} />;
};

/** Texto em HTML posicionado no alto da tela (título, etiqueta), fora da faixa da legenda. */
export const NoAlto: React.FC<{children: React.ReactNode; y?: number}> = ({children, y = 0.12}) => {
  const {A, L} = useTela();
  return <div style={{position: 'absolute', top: A * y, left: L * 0.06, right: L * 0.06, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{children}</div>;
};

// ---------- 3. os desenhos prontos ----------
// Cada desenho são 2 a 5 recortes ou tiras, cada um de um papel. Recebe o centro, o tamanho e `p` (0 a 1).

type Desenho = {x: number; y: number; tam?: number; p: number; t?: number};

export const Sol: React.FC<Desenho> = ({x, y, tam = 300, p, t = 0}) => {
  const r = tam / 2;
  return (
    <>
      {Array.from({length: 8}, (_, i) => {
        const a = (i / 8) * Math.PI * 2 + balanco(t, 0.3) * 0.05;
        return (
          <Tira key={i} semente={`sr${i}`} cor="amarelo" grossura={tam * 0.07} p={emFila(p, 0.45, 0.55, i, 8)} pontos={[[x + Math.cos(a) * r * 1.15, y + Math.sin(a) * r * 1.15], [x + Math.cos(a) * r * 1.6, y + Math.sin(a) * r * 1.6]]} />
        );
      })}
      <Recorte semente="sol" papel="solar" pontos={circulo(x, y, r, r, 16)} p={ramp(p, 0, 0.5)} />
    </>
  );
};

export const Nuvem: React.FC<Desenho & {papel?: Papel}> = ({x, y, tam = 400, p, papel = 'creme'}) => {
  const w = tam;
  const h = tam * 0.42;
  const pts: Ponto[] = [
    [x - w * 0.5, y + h * 0.45],
    [x - w * 0.55, y],
    [x - w * 0.35, y - h * 0.35],
    [x - w * 0.15, y - h * 0.8],
    [x + w * 0.12, y - h * 0.85],
    [x + w * 0.28, y - h * 0.4],
    [x + w * 0.5, y - h * 0.3],
    [x + w * 0.56, y + h * 0.15],
    [x + w * 0.45, y + h * 0.45],
  ];
  return <Recorte semente={`nuvem${Math.round(x)}`} papel={papel} pontos={pts} p={p} />;
};

/** Gotas recortadas que caem em degraus (o recorte não escorre: pula). `forca` liga aos poucos. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; gotas?: number}> = ({x, y, largura, altura, t, forca = 1, gotas = 14}) => {
  const {u} = useTela();
  return (
    <g filter="url(#colagem-sombra)">
      {Array.from({length: gotas}, (_, i) => {
        if (i / gotas >= forca) return null;
        const fase = Math.floor(((t * (0.8 + acaso(`cv${i}`) * 0.5) + acaso(`cf${i}`)) % 1) * 8) / 8; // 8 poses por queda
        const px = x - largura / 2 + acaso(`cx${i}`) * largura;
        const py = y + fase * altura;
        const s = 18 * u;
        return <path key={i} d={`M${px} ${py - s * 1.6} L${px + s * 0.8} ${py} L${px} ${py + s * 0.7} L${px - s * 0.8} ${py} Z`} fill="url(#colagem-listra)" stroke={COR.creme} strokeWidth={4 * u} />;
      })}
    </g>
  );
};

/** Mar: três faixas onduladas de papel listrado, coladas uma atrás da outra, que balançam. */
export const Mar: React.FC<{y: number; p: number; t: number}> = ({y, p, t}) => {
  const {L, A, u} = useTela();
  return (
    <>
      {[0, 1, 2].map((k) => {
        const topo: Ponto[] = Array.from({length: 9}, (_, i) => [-40 * u + (i * (L + 80 * u)) / 8, y + k * 70 * u + Math.sin(i * 1.4 + k + Math.floor(t * 4) * 0.5) * 14 * u]);
        const forma: Ponto[] = [...topo, [L + 40 * u, A * 0.62], [-40 * u, A * 0.62]];
        return <Recorte key={k} semente={`mar${k}`} papel={k === 1 ? 'azul' : 'listra'} pontos={forma} p={emFila(p, 0, 1, k, 3)} giro={0} />;
      })}
    </>
  );
};

export const Planta: React.FC<Desenho> = ({x, y, tam = 360, p, t = 0}) => {
  const alto = tam * ramp(p, 0, 0.5, chega);
  const venta = balanco(t, 0.6) * tam * 0.02;
  const folha = (lado: number, alt: number, q: number): Ponto[] => {
    const bx = x + venta;
    const by = y - alto * alt;
    const c = tam * 0.34;
    return [[bx, by], [bx + lado * c * 0.5 * q, by - c * 0.42 * q], [bx + lado * c * q, by - c * 0.1 * q], [bx + lado * c * 0.45 * q, by + c * 0.12 * q]];
  };
  return (
    <>
      <Tira semente="caule" cor="verde" grossura={tam * 0.05} p={p > 0 ? 1 : 0} pontos={[[x, y], [x + venta * 0.5, y - alto * 0.5], [x + venta, y - alto]]} />
      {p > 0.35 && <Recorte semente="fe" papel="folha" pontos={folha(-1, 0.45, 1)} p={ramp(p, 0.35, 0.65)} />}
      {p > 0.55 && <Recorte semente="fd" papel="folha" pontos={folha(1, 0.75, 1)} p={ramp(p, 0.55, 0.85)} />}
      {p > 0.75 && <Recorte semente="fl" papel="laranja" pontos={circulo(x + venta, y - alto - tam * 0.06, tam * 0.1, tam * 0.1, 8)} p={ramp(p, 0.75, 1)} />}
    </>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Folha cor="marinho" topo={A * 0.4} semente="t" />
        <Mar y={A * 0.5} p={1} t={t} />
        <Fita x={L * 0.14} y={A * 0.405} giro={-24} />
        <Fita x={L * 0.86} y={A * 0.405} giro={20} />
      </Tela>
      <NoAlto y={0.13}>
        {/* a frase 0 é o título escrito aqui: a legenda fica desligada neste trecho */}
        <Letras texto="O CICLO" p={1} tamanho={132} semente="t1" />
        <div style={{height: 18 * u}} />
        <Letras texto="DA ÁGUA" p={ramp(t, 0, 0.9)} tamanho={132} semente="t2" />
      </NoAlto>
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <FolhaNova p={ramp(t, 0, 0.35, chega)}>
      <Tela>
        <Folha cor="pessego" semente="s" />
        <Sol x={L * 0.62} y={A * 0.26} tam={260 * u} p={ramp(t, 0.2, 1.1)} t={t} />
        <Mar y={A * 0.44} p={ramp(t, 0.1, 0.8)} t={t} />
        {/* o calor: três tiras laranja onduladas subindo do mar */}
        {[0.3, 0.45, 0.6].map((fx, i) => (
          <Tira key={i} semente={`calor${i}`} cor="vermelho" grossura={12} p={ramp(t, 1 + i * 0.2, 1.6 + i * 0.2)} pontos={Array.from({length: 5}, (_, k) => [L * fx + (k % 2 ? 16 : -16) * u, A * 0.42 - k * 34 * u] as Ponto)} />
        ))}
      </Tela>
      <NoAlto y={0.08}>
        <Etiqueta p={ramp(t, 1.2, 1.7)}>calor</Etiqueta>
      </NoAlto>
    </FolhaNova>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const junta = ramp(t, 0.6, 1.8);
  return (
    <FolhaNova p={ramp(t, 0, 0.35, chega)}>
      <Tela>
        <Folha cor="ceu" semente="v" />
        <Mar y={A * 0.5} p={1} t={t} />
        {[0.3, 0.5, 0.7].map((fx, i) => {
          const sobe = Math.floor(((t * 0.6 + i * 0.3) % 1) * 6) / 6;
          return <Recorte key={i} semente={`vap${i}`} papel="creme" borda={false} pontos={circulo(L * fx, A * 0.46 - sobe * A * 0.14, 34 * u, 22 * u, 8)} p={ramp(t, i * 0.2, 0.5 + i * 0.2) * (1 - junta * 0.8)} />;
        })}
        <Nuvem x={L * 0.5} y={A * 0.24} tam={(320 + junta * 200) * u} p={ramp(t, 0.5, 1.4)} papel="jornal" />
        <Fita x={L * 0.5 - 200 * u} y={A * 0.2} giro={-30} p={ramp(t, 1.4, 1.6)} />
      </Tela>
      <NoAlto y={0.07}>
        <Etiqueta p={ramp(t, 1.3, 1.8)} cor="marinho">lá em cima</Etiqueta>
      </NoAlto>
    </FolhaNova>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const pesa = ramp(t, 0, 1);
  return (
    <FolhaNova p={ramp(t, 0, 0.35, chega)}>
      <Tela>
        <Folha cor="noite" semente="n" />
        <Chuva x={L * 0.5} y={A * 0.3} largura={480 * u} altura={A * 0.28} t={t} forca={ramp(t, 0.6, 1.5)} />
        <g transform={`translate(0 ${pesa * 40 * u})`}>
          <Nuvem x={L * 0.5} y={A * 0.22} tam={560 * u} p={1} papel="jornal" />
          <Recorte semente="ventre" papel="marinho" borda={false} pontos={circulo(L * 0.5, A * 0.27, 230 * u, 40 * u, 12)} p={ramp(t, 0.2, 0.8)} giro={0} />
        </g>
      </Tela>
      <NoAlto y={0.07}>
        <Etiqueta p={ramp(t, 1, 1.5)} cor="amarelo">
          pesou
        </Etiqueta>
      </NoAlto>
    </FolhaNova>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const cresce = ramp(t, 0.5, 2.4);
  return (
    <FolhaNova p={ramp(t, 0, 0.35, chega)}>
      <Tela>
        <Folha cor="areia" semente="c" />
        <Nuvem x={L * 0.42} y={A * 0.21} tam={380 * u} p={1} papel="jornal" />
        <Chuva x={L * 0.45} y={A * 0.26} largura={300 * u} altura={A * 0.2} t={t} gotas={10} forca={1 - ramp(t, 1.2, 2)} />
        <Recorte semente="terra" papel="marrom" pontos={[[-30 * u, A * 0.53], [L * 0.5, A * 0.52], [L + 30 * u, A * 0.535], [L + 30 * u, A * 0.6], [-30 * u, A * 0.6]]} p={ramp(t, 0, 0.4)} giro={0} />
        <Planta x={L * 0.6} y={A * 0.525} tam={370 * u} p={cresce} t={t} />
      </Tela>
      <NoAlto y={0.07}>
        <Letras texto="VIDA" p={ramp(t, 1.8, 2.5)} tamanho={110} semente="vida" />
      </NoAlto>
    </FolhaNova>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
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
