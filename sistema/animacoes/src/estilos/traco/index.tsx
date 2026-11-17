// ESTILO: Traço contínuo
// Um papel claro e UMA linha só, que nunca sai do papel: ela se desenha, e
// quando o assunto muda, a mesma linha escorrega e vira o desenho seguinte.
// A ponta da caneta é um ponto coral que anda na frente. Bom pra explicar como
// uma coisa vira outra: processo, transformação, antes e depois.
//
// As quatro partes, como no molde:
//   1. `tema`      cores, fundo e legenda
//   2. as peças    forma (pontos), Fio (a linha que desenha e se transforma), Detalhe, Letra
//   3. os desenhos sol, nuvem, chuva, mar, planta (formas de uma linha só)
//   4. `Exemplo`   o ciclo da água
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarItaliana} from '@remotion/google-fonts/Italiana';
import {loadFont as carregarSpectral} from '@remotion/google-fonts/Spectral';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, Traco, acaso, balanco, cenasPorFrase, chega, emFila, ramp, suave, useTela} from '../../kit';

const {fontFamily: TITULO} = carregarItaliana('normal', {weights: ['400'], subsets: ['latin']}); // Italiana só tem 'latin', que já cobre os acentos do português
const {fontFamily: TEXTO} = carregarSpectral('normal', {weights: ['600', '700'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

export const COR = {
  papel: '#f4f1ea',
  linha: '#1f2a44', // azul-tinta: a linha principal
  ponta: '#ff6b5a', // coral: só a ponta da caneta e o destaque
  detalhe: '#6c7a96', // azul-acinzentado: os riscos curtos de detalhe
} as const;

/** O papel: claro, liso, com um grão bem leve e uma margem fina. */
const Fundo: React.FC<{t: number}> = () => {
  const {L, A, u} = useTela();
  return (
    <AbsoluteFill style={{background: COR.papel}}>
      <Tela>
        <defs>
          <filter id="traco-grao" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={5} />
            <feColorMatrix values="0 0 0 0 0.12  0 0 0 0 0.16  0 0 0 0 0.27  0 0 0 0.07 0" />
          </filter>
        </defs>
        <rect width={L} height={A} filter="url(#traco-grao)" />
        <rect x={40 * u} y={40 * u} width={L - 80 * u} height={A - 80 * u} fill="none" stroke={COR.linha} strokeWidth={1.5 * u} opacity={0.18} />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'traco',
  nome: 'Traço contínuo',
  fundo: COR.papel,
  tinta: COR.linha,
  acento: COR.ponta,
  legenda: {
    fonte: TEXTO,
    peso: 700,
    tamanho: 62,
    cor: COR.linha,
    destaque: COR.ponta,
    sombra: `0 0 8px ${COR.papel}, 0 0 3px ${COR.papel}`,
    altura: 0.74,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** Quantos pontos toda forma tem: é o que deixa uma forma virar a outra. */
export const PONTOS = 600;

/** Os pedaços de uma forma: reta, arco e onda. Junte vários num array só (`[...reta(), ...arco()]`). */
export const reta = (a: Ponto, b: Ponto, n = 20): Ponto[] =>
  Array.from({length: n}, (_, i) => [a[0] + ((b[0] - a[0]) * i) / (n - 1), a[1] + ((b[1] - a[1]) * i) / (n - 1)]);
export const arco = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 60): Ponto[] =>
  Array.from({length: n}, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / (n - 1);
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  });
export const onda = (x0: number, x1: number, y: number, altura: number, voltas: number, n = 80): Ponto[] =>
  Array.from({length: n}, (_, i) => {
    const q = i / (n - 1);
    return [x0 + (x1 - x0) * q, y + Math.sin(q * voltas * Math.PI * 2) * altura];
  });

/** Fecha os pedaços numa forma: espalha os pontos por igual ao longo da linha (sempre PONTOS pontos). */
export const forma = (pts: Ponto[]): Ponto[] => {
  const dist = [0];
  for (let i = 1; i < pts.length; i++) dist.push(dist[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = dist[dist.length - 1] || 1;
  const out: Ponto[] = [];
  let j = 1;
  for (let i = 0; i < PONTOS; i++) {
    const d = (total * i) / (PONTOS - 1);
    while (j < dist.length - 1 && dist[j] < d) j++;
    const q = (d - dist[j - 1]) / (dist[j] - dist[j - 1] || 1);
    out.push([pts[j - 1][0] + (pts[j][0] - pts[j - 1][0]) * q, pts[j - 1][1] + (pts[j][1] - pts[j - 1][1]) * q]);
  }
  return out;
};

const emCaminho = (pts: Ponto[]) => 'M' + pts.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join('L');

/**
 * A linha. Sem `de`, ela se desenha do começo ao fim (`desenha` de 0 a 1).
 * Com `de`, ela já está inteira na forma `de` e escorrega até `para` (`vira` de 0 a 1): é a transição do estilo.
 * A ponta coral anda na frente enquanto a linha trabalha. `t` faz a linha respirar.
 */
export const Fio: React.FC<{para: Ponto[]; de?: Ponto[]; desenha?: number; vira?: number; t?: number}> = ({para, de, desenha = 1, vira = 1, t = 0}) => {
  const {u} = useTela();
  const m = de ? ramp(vira, 0, 1, suave) : 1;
  const mexe = de ? 1 - Math.abs(m - 0.5) * 2 : 0; // a linha ondula no meio da virada
  const pts = para.map((b, i) => {
    const a = de ? de[i] : b;
    const w = Math.sin(i * 0.09 + t * 4) * 14 * u * mexe + balanco(t, 0.3, i * 0.01) * 2 * u;
    return [a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m + w] as Ponto;
  });
  const p = de ? 1 : desenha;
  const trabalha = de ? m > 0 && m < 1 : p > 0 && p < 1;
  const ponta = trabalha ? pts[Math.min(PONTOS - 1, Math.floor((de ? m : p) * (PONTOS - 1)))] : null;
  return (
    <>
      <Traco d={emCaminho(pts)} p={p} fill="none" stroke={COR.linha} strokeWidth={6 * u} strokeLinecap="round" strokeLinejoin="round" />
      {ponta && (
        <>
          <circle cx={ponta[0]} cy={ponta[1]} r={20 * u} fill={COR.ponta} opacity={0.2} />
          <circle cx={ponta[0]} cy={ponta[1]} r={9 * u} fill={COR.ponta} />
        </>
      )}
    </>
  );
};

/** Riscos curtos de detalhe (brilho, gota, grama), finos e mais claros, que se desenham em fila. */
export const Detalhe: React.FC<{riscos: Ponto[][]; p: number; cor?: string}> = ({riscos, p, cor = COR.detalhe}) => {
  const {u} = useTela();
  return (
    <>
      {riscos.map((r, i) => (
        <Traco key={i} d={emCaminho(r)} p={emFila(p, 0, 1, i, riscos.length)} fill="none" stroke={cor} strokeWidth={3 * u} strokeLinecap="round" />
      ))}
    </>
  );
};

/** Texto fino de título, que aparece da esquerda pra direita com um fio coral por baixo. */
export const Letra: React.FC<{x: number; y: number; children: string; p: number; tamanho?: number}> = ({x, y, children, p, tamanho = 130}) => {
  const {L, u} = useTela();
  if (p <= 0) return null;
  const id = `traco-letra-${Math.round(y)}`;
  const tam = tamanho * u;
  const w = children.length * tam * 0.42;
  return (
    <>
      <clipPath id={id}>
        <rect x={0} y={y - tam * 1.2} width={L * ramp(p, 0, 1, chega)} height={tam * 1.6} />
      </clipPath>
      <text x={x} y={y} textAnchor="middle" fontFamily={TITULO} fontSize={tam} fill={COR.linha} clipPath={`url(#${id})`}>
        {children}
      </text>
      <Traco d={`M${x - w / 2},${y + tam * 0.25} L${x + w / 2},${y + tam * 0.25}`} p={ramp(p, 0.4, 1)} stroke={COR.ponta} strokeWidth={4 * u} strokeLinecap="round" />
    </>
  );
};

// ---------- 3. os desenhos prontos ----------
// Cada desenho é UMA forma: uma lista de pedaços emendados (o fim de um é perto do começo do outro), passada por
// `forma()`. Todo desenho entra e sai pela esquerda, na mesma altura, pra uma forma virar a outra sem dar nó.

type Lugar = {x: number; y: number; s: number};

/** Sol: entra pela esquerda, dá a volta no disco, solta os raios em zigue-zague e sai pela direita. */
export const sol = ({x, y, s}: Lugar): Ponto[] =>
  forma([
    ...reta([x - 400 * s, y], [x - 130 * s, y], 10),
    ...arco(x, y, 130 * s, 130 * s, Math.PI, Math.PI * 3, 90),
    ...Array.from({length: 25}, (_, i) => {
      const a = Math.PI + (i / 24) * Math.PI * 2;
      const r = i % 2 ? 150 * s : 230 * s;
      return [x + Math.cos(a) * r, y + Math.sin(a) * r] as Ponto;
    }),
    ...reta([x - 230 * s, y], [x + 400 * s, y + 4 * s], 10),
  ]);

/** Mar: três ondas emendadas por curvas nas pontas. */
export const mar = ({x, y, s}: Lugar): Ponto[] =>
  forma([
    ...onda(x - 420 * s, x + 420 * s, y, 22 * s, 3.5),
    ...arco(x + 420 * s, y + 45 * s, 45 * s, 45 * s, -Math.PI / 2, Math.PI / 2, 20),
    ...onda(x + 420 * s, x - 420 * s, y + 90 * s, 22 * s, 3.5),
    ...arco(x - 420 * s, y + 135 * s, 45 * s, 45 * s, -Math.PI / 2, -Math.PI * 1.5, 20),
    ...onda(x - 420 * s, x + 420 * s, y + 180 * s, 22 * s, 3.5),
  ]);

/** Nuvem: base reta e três bolhas por cima, de um fôlego só. */
export const nuvem = ({x, y, s}: Lugar): Ponto[] =>
  forma([
    ...reta([x - 420 * s, y + 60 * s], [x - 210 * s, y + 60 * s], 10),
    ...arco(x - 210 * s, y, 60 * s, 60 * s, Math.PI / 2, Math.PI * 1.5, 30),
    ...arco(x - 50 * s, y - 40 * s, 120 * s, 110 * s, Math.PI * 1.1, Math.PI * 1.95, 40),
    ...arco(x + 150 * s, y + 0 * s, 80 * s, 80 * s, Math.PI * 1.35, Math.PI * 2.5, 30),
    ...reta([x + 150 * s, y + 80 * s], [x + 420 * s, y + 60 * s], 10),
  ]);

/** Nuvem com chuva: a nuvem, e a linha desce em fios de chuva antes de sair. */
export const chuva = ({x, y, s}: Lugar): Ponto[] =>
  forma([
    ...reta([x - 420 * s, y + 60 * s], [x - 210 * s, y + 60 * s], 10),
    ...arco(x - 210 * s, y, 60 * s, 60 * s, Math.PI / 2, Math.PI * 1.5, 30),
    ...arco(x - 50 * s, y - 40 * s, 120 * s, 110 * s, Math.PI * 1.1, Math.PI * 1.95, 40),
    ...arco(x + 150 * s, y + 0 * s, 80 * s, 80 * s, Math.PI * 1.35, Math.PI * 2.5, 30),
    // os fios de chuva: a linha desce e sobe quase no mesmo lugar, da direita pra esquerda
    ...[1.5, 0.5, -0.5, -1.5].flatMap((k) => [
      [x + k * 90 * s + 6 * s, y + 80 * s] as Ponto,
      [x + k * 90 * s, y + (300 + Math.abs(k) * 20) * s] as Ponto,
      [x + k * 90 * s - 6 * s, y + 80 * s] as Ponto,
    ]),
    ...reta([x - 210 * s, y + 80 * s], [x + 420 * s, y + 60 * s], 10),
  ]);

/** Folha em forma de amêndoa: sai de `de`, vai até a ponta `ate` por cima e volta por baixo. */
export const folha = (de: Ponto, ate: Ponto, larg: number, n = 24): Ponto[] => {
  const nx = -(ate[1] - de[1]);
  const ny = ate[0] - de[0];
  const l = Math.hypot(nx, ny) || 1;
  const lado = (sinal: number, q: number): Ponto => {
    const b = Math.sin(q * Math.PI) * larg * sinal;
    return [de[0] + (ate[0] - de[0]) * q + (nx / l) * b, de[1] + (ate[1] - de[1]) * q + (ny / l) * b];
  };
  return [...Array.from({length: n}, (_, i) => lado(1, i / (n - 1))), ...Array.from({length: n}, (_, i) => lado(-1, 1 - i / (n - 1)))];
};

/** Planta: o chão vem da esquerda, sobe o caule soltando as folhas, desce e volta ao chão. */
export const planta = ({x, y, s}: Lugar): Ponto[] =>
  forma([
    ...onda(x - 420 * s, x - 6 * s, y, 8 * s, 1.5, 30),
    ...reta([x - 6 * s, y], [x - 6 * s, y - 180 * s], 12),
    ...folha([x - 6 * s, y - 180 * s], [x - 190 * s, y - 260 * s], 45 * s),
    ...reta([x - 6 * s, y - 180 * s], [x - 6 * s, y - 420 * s], 12),
    ...folha([x - 6 * s, y - 420 * s], [x - 60 * s, y - 540 * s], 26 * s),
    ...reta([x - 6 * s, y - 420 * s], [x + 6 * s, y - 300 * s], 8),
    ...folha([x + 6 * s, y - 300 * s], [x + 200 * s, y - 380 * s], 48 * s),
    ...reta([x + 6 * s, y - 300 * s], [x + 6 * s, y], 14),
    ...onda(x + 6 * s, x + 420 * s, y, 8 * s, 1.5, 30),
  ]);

/** Pingos soltos que caem (riscos de detalhe). */
export const pingos = (x: number, y: number, largura: number, altura: number, t: number, n = 10, u = 1): Ponto[][] =>
  Array.from({length: n}, (_, i) => {
    const fase = (t * (0.8 + acaso(`tp${i}`) * 0.4) + acaso(`tf${i}`)) % 1;
    const px = x - largura / 2 + acaso(`tx${i}`) * largura;
    const py = y + fase * altura;
    return [
      [px, py],
      [px - 6 * u, py + 34 * u],
    ];
  });

// ---------- 4. o exemplo: o ciclo da água ----------
// Cada cena vira a forma da cena anterior na sua. É a mesma linha o vídeo inteiro.

const useFormas = () => {
  const {L, A, u} = useTela();
  return {
    sol: sol({x: L / 2, y: A * 0.3, s: u}),
    mar: mar({x: L / 2, y: A * 0.36, s: u}),
    nuvem: nuvem({x: L / 2, y: A * 0.3, s: u}),
    chuva: chuva({x: L / 2, y: A * 0.2, s: u}),
    planta: planta({x: L / 2, y: A * 0.55, s: u}),
  };
};

const Titulo: React.FC<PropsCena> = ({t}) => {
  const {L, A} = useTela();
  const f = useFormas();
  return (
    <Tela>
      <Fio para={f.sol} desenha={ramp(t, 0, 1.6)} t={t} />
      <Letra x={L / 2} y={A * 0.56} p={ramp(t, 0.2, 1)}>
        O ciclo
      </Letra>
    </Tela>
  );
};

const TituloCompleto: React.FC<PropsCena> = (props) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Titulo {...props} />
      <Tela>
        <Letra x={L / 2} y={A * 0.56 + 140 * u} p={ramp(props.t, 0.6, 1.4)}>
          da água
        </Letra>
      </Tela>
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const f = useFormas();
  // o sol encolhe e sobe enquanto a linha vira mar
  const solAlto = sol({x: L * 0.68, y: A * 0.15, s: 0.55 * u});
  return (
    <Tela>
      <Fio de={f.sol} para={f.mar} vira={ramp(t, 0, 1.2)} t={t} />
      <g opacity={ramp(t, 0.8, 1.4)}>
        <Fio para={solAlto} desenha={ramp(t, 0.8, 2)} t={t} />
      </g>
      <Detalhe
        riscos={[0.3, 0.45, 0.6].map((fx, i) => [
          [L * fx, A * 0.33 - i * 6 * u],
          [L * fx + 10 * u, A * 0.29 - i * 6 * u],
        ])}
        p={ramp(t, 1.6, 2.4)}
        cor={COR.ponta}
      />
    </Tela>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const f = useFormas();
  const vapor: Ponto[][] = [0, 1, 2, 3].map((i) => {
    const fase = (t * 0.5 + i / 4) % 1;
    const x = L * (0.32 + i * 0.12);
    const y = A * 0.52 - fase * A * 0.12;
    return [
      [x, y + 50 * u],
      [x + 14 * u, y + 25 * u],
      [x - 14 * u, y],
      [x, y - 25 * u],
    ];
  });
  return (
    <Tela>
      <Fio de={f.mar} para={f.nuvem} vira={ramp(t, 0.3, 1.6)} t={t} />
      <Detalhe riscos={vapor} p={1} />
      <Detalhe riscos={onda(L * 0.15, L * 0.85, A * 0.58, 10 * u, 3).map((q, i, a) => [q, a[Math.min(a.length - 1, i + 1)]])} p={ramp(t, 0.6, 1.4)} />
    </Tela>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const f = useFormas();
  return (
    <Tela>
      <Fio de={f.nuvem} para={f.chuva} vira={ramp(t, 0.2, 1.5)} t={t} />
      <Detalhe riscos={pingos(L / 2, A * 0.38, 520 * u, A * 0.2, t, 10, u)} p={ramp(t, 1.2, 2)} />
    </Tela>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const f = useFormas();
  return (
    <Tela>
      <Fio de={f.chuva} para={f.planta} vira={ramp(t, 0.2, 1.8)} t={t} />
      <Detalhe riscos={pingos(L / 2, A * 0.08, 520 * u, A * 0.12, t, 8, u)} p={1} />
    </Tela>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, que já está escrito: sem legenda nesse trecho
    semLegenda={[[0, FALA_EXEMPLO.frases[1].s]]}
    cenas={cenasPorFrase(FALA_EXEMPLO, [
      [0, 0, TituloCompleto, 0],
      [1, 1, SolEMar, 0],
      [2, 2, VaporENuvem, 0],
      [3, 3, NuvemEChuva, 0],
      [4, 4, ChuvaEPlanta, 0],
    ])}
  />
);
