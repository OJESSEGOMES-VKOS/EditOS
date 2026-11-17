// ESTILO: Poeira cósmica
// Um céu fundo de nebulosa onde tudo é feito de milhares de pontos de luz: a
// poeira viaja pelo escuro, se junta e vira a forma; no fim da cena ela se
// espalha de novo. Bom pra ciência, espaço, origem das coisas e tema grandioso.
//
// As quatro partes, na ordem do molde:
//   1. `tema`      cores, fundo (a nebulosa) e legenda
//   2. as peças    Poeira (os pontos de luz), Brilho (o texto), e os geradores de forma
//   3. os desenhos Sol, Nuvem, Chuva, Mar e Planta, feitos de poeira
//   4. `Exemplo`   o ciclo da água contado neste estilo
import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {loadFont as carregarJosefin} from '@remotion/google-fonts/JosefinSans';
import type {PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, cenasPorFrase, chega, ramp, sai, useTela} from '../../kit';

const {fontFamily: LETRA} = carregarJosefin('normal', {weights: ['300', '600'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As cores da poeira. Todas claras: luz no escuro. */
export const COR = {
  branco: '#ffffff',
  ambar: '#ffd98a',
  azul: '#9ad4ff',
  ciano: '#6fe0d0',
  verde: '#a9e07a',
  laranja: '#ff9f5a',
  lilas: '#c9a8ff',
} as const;
export type CorPoeira = keyof typeof COR;
const NOMES = Object.keys(COR) as CorPoeira[];

/** O espaço: azul-noite com duas nuvens de nebulosa que derivam devagar e estrelas que piscam. */
const Fundo: React.FC<{t: number}> = ({t}) => {
  const {L, A, u} = useTela();
  const estrelas = 140;
  return (
    <AbsoluteFill style={{background: '#04050d'}}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(ellipse at ${30 + Math.sin(t * 0.07) * 10}% ${35 + Math.cos(t * 0.05) * 8}%, rgba(96,60,170,0.55) 0%, transparent 55%)`,
            `radial-gradient(ellipse at ${72 + Math.cos(t * 0.06) * 10}% ${68 + Math.sin(t * 0.08) * 8}%, rgba(20,110,140,0.45) 0%, transparent 52%)`,
            `radial-gradient(ellipse at 50% 50%, rgba(30,30,70,0.5) 0%, transparent 80%)`,
          ].join(','),
        }}
      />
      <Tela>
        <defs>
          <filter id="cosmico-nevoa" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency={0.0025 / Math.max(0.5, u)} numOctaves={4} seed={5} />
            <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.6  0 0 0 0 1  0 0 0 0.55 -0.12" />
          </filter>
        </defs>
        <rect width={L} height={A} filter="url(#cosmico-nevoa)" opacity={0.55} />
        {Array.from({length: estrelas}, (_, i) => {
          const pisca = 0.35 + 0.65 * Math.abs(Math.sin(t * (0.6 + acaso(`ep${i}`)) + i));
          return (
            <circle key={i} cx={acaso(`ex${i}`) * L} cy={acaso(`ey${i}`) * A} r={(0.8 + acaso(`er${i}`) * 1.8) * u} fill="#fff" opacity={pisca * 0.8} />
          );
        })}
      </Tela>
      {/* escurece as bordas, pra o centro brilhar */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,6,0.7) 100%)'}} />
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'cosmico',
  nome: 'Poeira cósmica',
  fundo: '#04050d',
  tinta: COR.branco,
  acento: COR.ciano,
  legenda: {
    fonte: LETRA,
    peso: 600,
    tamanho: 62,
    cor: COR.branco,
    destaque: COR.ciano,
    sombra: '0 0 14px #04050d, 0 0 6px #04050d, 0 2px 0 #04050d',
    altura: 0.76,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** Um grão de poeira no lugar onde ele deve chegar: x, y, tamanho (em u) e cor. */
export type Grao = [number, number, number, CorPoeira];

/**
 * A poeira: desenha uma lista de grãos como pontos de luz que se somam.
 * `junta` de 0 a 1 traz a poeira espalhada pelo céu até a forma (cada grão faz uma curva no caminho).
 * `espalha` de 0 a 1 solta a forma de novo, pra fora, apagando: é a transição do estilo.
 * `semente` muda de onde a poeira vem (use uma por desenho).
 */
export const Poeira: React.FC<{graos: Grao[]; junta?: number; espalha?: number; t: number; semente?: string}> = ({
  graos,
  junta = 1,
  espalha = 0,
  t,
  semente = 'p',
}) => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const {width: L, height: A} = useVideoConfig();
  const u = Math.min(L, A * 0.75) / 1080;
  const sprites = React.useMemo(
    () =>
      NOMES.map((n) => {
        const s = document.createElement('canvas');
        s.width = s.height = 64;
        const g = s.getContext('2d')!;
        const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        gr.addColorStop(0, '#ffffff');
        gr.addColorStop(0.14, COR[n]);
        gr.addColorStop(0.4, COR[n] + '55');
        gr.addColorStop(1, COR[n] + '00');
        g.fillStyle = gr;
        g.fillRect(0, 0, 64, 64);
        return s;
      }),
    []
  );
  React.useLayoutEffect(() => {
    const c = ref.current!.getContext('2d')!;
    c.clearRect(0, 0, L, A);
    c.globalCompositeOperation = 'lighter';
    const e = sai(Math.min(1, Math.max(0, espalha)));
    graos.forEach(([tx, ty, tam, cor], i) => {
      const a = acaso(`${semente}a${i}`);
      const b = acaso(`${semente}b${i}`);
      // cada grão chega num tempo um pouco diferente
      const m = chega(Math.min(1, Math.max(0, (junta - a * 0.35) / 0.65)));
      if (m <= 0 && junta < 1) {
        // ainda solto no céu: só um brilho fraco
      }
      const sx = acaso(`${semente}x${i}`) * L;
      const sy = acaso(`${semente}y${i}`) * A;
      const curva = Math.sin(m * Math.PI) * (60 + b * 160) * u;
      const ang = b * Math.PI * 2 + t * 0.4;
      let x = sx + (tx - sx) * m + Math.cos(ang) * curva + Math.sin(t * 0.8 + i) * 1.5 * u;
      let y = sy + (ty - sy) * m + Math.sin(ang) * curva;
      const fora = a * Math.PI * 2;
      x += Math.cos(fora) * e * (200 + b * 500) * u;
      y += Math.sin(fora) * e * (200 + b * 500) * u - e * 80 * u;
      const pisca = 0.75 + 0.25 * Math.sin(t * 5 + i);
      const sz = tam * 11 * u * pisca * (0.5 + 0.5 * m) * (1 - e * 0.6);
      c.globalAlpha = Math.min(1, (0.25 + 0.6 * m) * (1 - e));
      c.drawImage(sprites[NOMES.indexOf(cor)], x - sz / 2, y - sz / 2, sz, sz);
    });
  });
  return <canvas ref={ref} width={L} height={A} style={{position: 'absolute', inset: 0}} />;
};

// os geradores de forma: cada um devolve grãos. Desenho novo = somar formas.

/** Um disco cheio de poeira (mais denso no meio). */
export const disco = (x: number, y: number, r: number, n: number, cor: CorPoeira, s = 'd', tam = 1.4): Grao[] =>
  Array.from({length: n}, (_, i) => {
    const a = acaso(`${s}a${i}`) * Math.PI * 2;
    const d = Math.pow(acaso(`${s}r${i}`), 0.7) * r;
    return [x + Math.cos(a) * d, y + Math.sin(a) * d, tam * (0.6 + acaso(`${s}t${i}`)), cor];
  });

/** Uma mancha oval de poeira, solta nas bordas (nuvem, névoa, copa). */
export const mancha = (x: number, y: number, rx: number, ry: number, n: number, cor: CorPoeira, s = 'm'): Grao[] =>
  Array.from({length: n}, (_, i) => {
    const a = acaso(`${s}a${i}`) * Math.PI * 2;
    const d = Math.sqrt(acaso(`${s}r${i}`)) * (0.75 + acaso(`${s}b${i}`) * 0.35);
    return [x + Math.cos(a) * d * rx, y + Math.sin(a) * d * ry, 1 + acaso(`${s}t${i}`) * 1.2, cor];
  });

/** Poeira ao longo de um caminho de pontos, com `largura` de espalhamento. */
export const trilha = (pontos: [number, number][], n: number, cor: CorPoeira, largura: number, s = 't', tam = 1.2): Grao[] => {
  const seg = pontos.length - 1;
  return Array.from({length: n}, (_, i) => {
    const q = acaso(`${s}q${i}`) * seg;
    const k = Math.min(seg - 1, Math.floor(q));
    const f = q - k;
    const [x0, y0] = pontos[k];
    const [x1, y1] = pontos[k + 1];
    const g = (acaso(`${s}g${i}`) - 0.5) * largura;
    const h = (acaso(`${s}h${i}`) - 0.5) * largura;
    return [x0 + (x1 - x0) * f + g, y0 + (y1 - y0) * f + h, tam * (0.6 + acaso(`${s}t${i}`)), cor];
  });
};

/** Texto que acende: as letras chegam abertas e se fecham, com brilho. `y` é a altura do centro. */
export const Brilho: React.FC<{y: number; children: string; p: number; some?: number; tamanho?: number; cor?: CorPoeira; fina?: boolean}> = ({
  y,
  children,
  p,
  some = 0,
  tamanho = 110,
  cor = 'branco',
  fina = false,
}) => {
  const {u} = useTela();
  const v = Math.min(p, 1 - some);
  if (v <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: y - tamanho * u * 0.6,
        textAlign: 'center',
        fontFamily: LETRA,
        fontWeight: fina ? 300 : 600,
        fontSize: tamanho * u,
        lineHeight: 1.1,
        textTransform: 'uppercase',
        letterSpacing: `${0.05 + (1 - v) * 0.5}em`,
        color: COR[cor],
        opacity: v,
        filter: `blur(${(1 - v) * 10 * u}px)`,
        textShadow: `0 0 ${30 * u}px ${COR[cor]}aa, 0 0 ${8 * u}px #04050d`,
      }}
    >
      {children}
    </div>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Todo desenho recebe o centro (x, y), o tamanho, `junta` (0 a 1), `espalha` e o tempo `t`.
// Por dentro é sempre uma lista de grãos passada pra <Poeira>.

type Desenho = {x: number; y: number; tam?: number; junta?: number; espalha?: number; t: number};

export const Sol: React.FC<Desenho> = ({x, y, tam = 160, junta = 1, espalha = 0, t}) => {
  const raios: Grao[] = Array.from({length: 260}, (_, i) => {
    const a = (Math.round(acaso(`sra${i}`) * 16) / 16) * Math.PI * 2 + t * 0.15;
    const d = tam * (1.15 + Math.pow(acaso(`srd${i}`), 1.4) * (0.7 + 0.2 * Math.sin(t * 2 + i)));
    return [x + Math.cos(a) * d, y + Math.sin(a) * d, 1 + acaso(`srt${i}`), 'laranja'];
  });
  return (
    <Poeira
      semente="sol"
      t={t}
      junta={junta}
      espalha={espalha}
      graos={[...disco(x, y, tam, 700, 'ambar', 'sd', 1.6), ...disco(x, y, tam * 0.45, 160, 'branco', 'sb', 1.8), ...raios]}
    />
  );
};

export const Nuvem: React.FC<Desenho & {cor?: CorPoeira}> = ({x, y, tam = 420, junta = 1, espalha = 0, t, cor = 'branco'}) => {
  const lobos: [number, number, number][] = [
    [-0.28, 0.05, 0.22],
    [-0.05, -0.12, 0.28],
    [0.22, -0.02, 0.24],
    [0.02, 0.1, 0.3],
  ];
  return (
    <Poeira
      semente={`nuvem${cor}`}
      t={t}
      junta={junta}
      espalha={espalha}
      graos={lobos.flatMap(([dx, dy, r], k) => [
        ...mancha(x + dx * tam + Math.sin(t * 0.5 + k) * 6, y + dy * tam, r * tam, r * tam * 0.7, 260, cor, `nl${k}`),
        ...mancha(x + dx * tam, y + dy * tam, r * tam * 0.8, r * tam * 0.55, 60, 'azul', `nz${k}`),
      ])}
    />
  );
};

/** Chuva: grãos azuis riscando pra baixo entre `y` e `y + altura`. `forca` de 0 a 1 liga a chuva. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; espalha?: number}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  espalha = 0,
}) => {
  const {u} = useTela();
  const n = Math.round(48 * forca);
  const graos: Grao[] = [];
  for (let i = 0; i < n; i++) {
    const fase = (t * (0.7 + acaso(`cv${i}`) * 0.5) + acaso(`cf${i}`)) % 1;
    const px = x - largura / 2 + acaso(`cx${i}`) * largura;
    const py = y + fase * altura;
    // cada pingo é um rastro de 6 grãos, do mais forte ao mais fraco
    for (let k = 0; k < 6; k++) graos.push([px - k * 2 * u, py - k * 12 * u, 1.6 - k * 0.2, k === 0 ? 'branco' : 'azul']);
  }
  return <Poeira semente="chuva" t={t} junta={1} espalha={espalha} graos={graos} />;
};

/** O mar: faixas de poeira azul e ciano em ondas que andam. `y` é a linha d'água. */
export const Mar: React.FC<{y: number; t: number; junta?: number; espalha?: number}> = ({y, t, junta = 1, espalha = 0}) => {
  const {L, A, u} = useTela();
  const graos: Grao[] = Array.from({length: 1300}, (_, i) => {
    const w = acaso(`mw${i}`);
    const px = acaso(`mx${i}`) * L;
    const fundo = Math.pow(w, 1.3) * A * 0.13;
    const py = y + fundo + Math.sin(px * 0.01 / u + t * 1.2 + w * 7) * (8 + w * 24) * u;
    return [px, py, 0.7 + w * 1.6, acaso(`mc${i}`) > 0.8 ? 'branco' : w > 0.5 ? 'azul' : 'ciano'];
  });
  return <Poeira semente="mar" t={t} junta={junta} espalha={espalha} graos={graos} />;
};

/** A planta: o caule sobe e as folhas abrem com `cresce` de 0 a 1. `y` é o chão. */
export const Planta: React.FC<Desenho & {cresce?: number}> = ({x, y, tam = 380, junta = 1, espalha = 0, t, cresce = 1}) => {
  const alto = tam * chega(Math.min(1, cresce / 0.7));
  const venta = Math.sin(t * 1.3) * tam * 0.03;
  const caule = trilha(
    [
      [x, y],
      [x + venta * 0.5, y - alto * 0.5],
      [x + venta, y - alto],
    ],
    Math.max(2, Math.round(220 * Math.min(1, cresce / 0.7))),
    'verde',
    8,
    'pc',
    1.3
  );
  const folha = (lado: number, h: number, ini: number, s: string): Grao[] => {
    const abre = chega(Math.min(1, Math.max(0, (cresce - ini) / 0.35)));
    if (abre <= 0) return [];
    const bx = x + venta * h + lado * tam * 0.16 * abre;
    const by = y - alto * h - tam * 0.05 * abre;
    return mancha(bx, by, tam * 0.17 * abre, tam * 0.07 * abre, 160, 'verde', s).map(([gx, gy, gt, gc]) => {
      // inclina a folha pra cima
      const dx = gx - bx;
      return [gx, gy - dx * lado * 0.45, gt, gc] as Grao;
    });
  };
  return (
    <Poeira
      semente="planta"
      t={t}
      junta={junta}
      espalha={espalha}
      graos={[...caule, ...folha(-1, 0.45, 0.3, 'pf1'), ...folha(1, 0.72, 0.45, 'pf2'), ...folha(-1, 0.98, 0.6, 'pf3')]}
    />
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const fimDe = (t: number, dur: number) => ramp(t, dur - 0.45, dur) * 0.8;

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const e = fimDe(t, dur);
  const anel: Grao[] = Array.from({length: 900}, (_, i) => {
    const a = acaso(`ta${i}`) * Math.PI * 2 + t * 0.08;
    const d = (300 + (acaso(`td${i}`) - 0.5) * 70 + Math.sin(a * 5 + t) * 10) * u;
    return [L / 2 + Math.cos(a) * d, A * 0.4 + Math.sin(a) * d * 0.38, 0.8 + acaso(`tt${i}`) * 1.4, acaso(`tc${i}`) > 0.7 ? 'lilas' : 'azul'];
  });
  return (
    <>
      <Poeira semente="titulo" t={t} junta={ramp(t, -0.8, 1)} espalha={e} graos={anel} />
      <Brilho y={A * 0.38} p={ramp(t, 0, 0.8)} some={e} tamanho={60} cor="lilas" fina>
        o ciclo
      </Brilho>
      <Brilho y={A * 0.43} p={ramp(t, 0.2, 1)} some={e} tamanho={120}>
        da água
      </Brilho>
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const e = fimDe(t, dur);
  return (
    <>
      <Sol x={L * 0.62} y={A * 0.24} tam={150 * u} t={t} junta={ramp(t, -0.3, 0.8)} espalha={e} />
      <Mar y={A * 0.5} t={t} junta={ramp(t, 0, 1.2)} espalha={e} />
      {/* o calor descendo do sol até a água */}
      <Poeira
        semente="calor"
        t={t}
        espalha={e}
        graos={Array.from({length: 120}, (_, i) => {
          const f = (t * 0.5 + acaso(`hf${i}`)) % 1;
          const x0 = L * 0.62 + (acaso(`hx${i}`) - 0.5) * 200 * u;
          return [x0 + (L * (0.2 + acaso(`hy${i}`) * 0.6) - x0) * f, A * 0.3 + (A * 0.49 - A * 0.3) * f, 1.2, 'laranja'] as Grao;
        })}
        junta={ramp(t, 1.2, 1.8)}
      />
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const e = fimDe(t, dur);
  const vapor: Grao[] = Array.from({length: 260}, (_, i) => {
    const f = (t * 0.35 + acaso(`vf${i}`)) % 1;
    const x = L * (0.2 + acaso(`vx${i}`) * 0.6) + Math.sin(f * 8 + i) * 30 * u;
    return [x + (L / 2 - x) * f * 0.6, A * 0.46 - f * A * 0.2, 1 + (1 - f), 'branco'];
  });
  return (
    <>
      <Mar y={A * 0.48} t={t} espalha={e} />
      <Poeira semente="vapor" t={t} junta={ramp(t, 0, 0.8)} espalha={e} graos={vapor} />
      <Nuvem x={L / 2} y={A * 0.24} tam={(380 + ramp(t, 0.8, dur) * 160) * u} t={t} junta={ramp(t, 0.6, 2)} espalha={e} />
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const e = fimDe(t, dur);
  return (
    <>
      <Nuvem x={L / 2} y={A * 0.22} tam={560 * u} t={t} espalha={e} cor={t > 0.8 ? 'azul' : 'branco'} />
      <Chuva x={L / 2} y={A * 0.3} largura={480 * u} altura={A * 0.36} t={t} forca={ramp(t, 0.4, 1.6)} espalha={e} />
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Nuvem x={L / 2} y={A * 0.17} tam={480 * u} t={t} cor="azul" />
      <Chuva x={L / 2} y={A * 0.24} largura={420 * u} altura={A * 0.3} t={t} />
      <Poeira semente="chao" t={t} junta={ramp(t, 0, 0.8)} graos={trilha([[L * 0.12, A * 0.62], [L * 0.88, A * 0.62]], 260, 'laranja', 14 * u, 'ch')} />
      <Planta x={L / 2} y={A * 0.615} tam={340 * u} t={t} cresce={ramp(t, 0.5, 2.8)} />
    </>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, que já acende na tela: sem legenda nesse trecho
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
