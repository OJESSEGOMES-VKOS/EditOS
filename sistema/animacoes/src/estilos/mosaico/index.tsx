// ESTILO: Mosaico
// A tela inteira é um painel de pedrinhas de vidro sobre argamassa. Cada cena é
// uma imagem montada com as pedras; na troca, as pedrinhas viram uma a uma, em
// onda a partir do centro, e se assentam na imagem nova. As de ouro cintilam.
// Bom pra curiosidade, história, abertura marcante, explicação de poucas etapas.
//
// As quatro partes, como no molde:
//   1. `tema`      cores, fundo e legenda
//   2. as peças    Painel (as pedras), os campos (disco, faixa, ...), Letreiro e a virada (transição)
//   3. os desenhos Sol, Nuvem, Chuva, Mar e Planta como campos de pedra
//   4. `Exemplo`   o ciclo da água em cinco painéis
//
// O jeito de desenhar aqui é diferente: um desenho não é um traço, é um CAMPO, uma
// função que diz de que cor é a pedra que está no ponto (x, y). O Painel pergunta
// pra cada pedra e pinta. Juntar desenhos é empilhar campos.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarCinzel} from '@remotion/google-fonts/Cinzel';
import {loadFont as carregarMarcellus} from '@remotion/google-fonts/Marcellus';
import type {PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, cenasPorFrase, ramp, useTela} from '../../kit';

const {fontFamily: TITULO} = carregarCinzel('normal', {weights: ['700'], subsets: ['latin', 'latin-ext']});
const {fontFamily: LETRA} = carregarMarcellus('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As pedras. Vidro colorido fosco e ouro. Cada pedra sorteia um pouco a cor dentro do tom. */
export const COR = {
  argamassa: '#3a342c',
  ouro: '#d9a93a',
  ouroClaro: '#f0cf6a',
  marfim: '#efe6cf',
  azulNoite: '#16264a',
  azul: '#2f5f9e',
  celeste: '#7fb0d8',
  ceuClaro: '#b9d6ea',
  mar: '#1f5f7f',
  marClaro: '#3f8fae',
  verde: '#3f6a2e',
  verdeClaro: '#7f9f45',
  terra: '#8a5a2e',
  telha: '#b9573a',
  cinza: '#8a8f95',
  branco: '#f7f4ec',
} as const;
export type CorPedra = keyof typeof COR;

/** O lado da pedra numa tela de 1080 de largura. */
const LADO = 30;

/** A argamassa: cinza-quente, com o grão do cimento. É o que aparece entre as pedras. */
const Fundo: React.FC<{t: number}> = () => {
  const {L, A} = useTela();
  return (
    <AbsoluteFill style={{background: COR.argamassa}}>
      <Tela>
        <defs>
          <filter id="mosaico-cimento">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves={2} seed={8} />
            <feColorMatrix values="0 0 0 0 0.9  0 0 0 0 0.85  0 0 0 0 0.75  0 0 0 0.12 0" />
          </filter>
        </defs>
        <rect width={L} height={A} filter="url(#mosaico-cimento)" />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'mosaico',
  nome: 'Mosaico',
  fundo: COR.argamassa,
  tinta: COR.marfim,
  acento: COR.ouroClaro,
  legenda: {
    fonte: LETRA,
    peso: 400,
    tamanho: 70,
    cor: '#ffffff',
    destaque: COR.ouroClaro,
    sombra: '0 0 4px #000, 0 3px 0 #1a1612, 0 0 16px #000, 0 0 28px #000',
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** Um campo: a cor da pedra no ponto (x, y), ou null quando ali não tem nada desse desenho. */
export type Campo = (x: number, y: number) => CorPedra | null;

/** Empilha campos: o último que responde ganha. O primeiro deve cobrir a tela toda (o céu, o chão). */
export const empilha = (...campos: Campo[]): Campo => (x, y) => {
  for (let i = campos.length - 1; i >= 0; i--) {
    const c = campos[i](x, y);
    if (c) return c;
  }
  return null;
};

// Os campos básicos, com que se monta tudo.
export const tudo = (cor: CorPedra): Campo => () => cor;
export const disco = (cx: number, cy: number, r: number, cor: CorPedra, ry = r): Campo => (x, y) => (((x - cx) / r) ** 2 + ((y - cy) / ry) ** 2 <= 1 ? cor : null);
export const anel = (cx: number, cy: number, r0: number, r1: number, cor: CorPedra): Campo => (x, y) => {
  const d = Math.hypot(x - cx, y - cy);
  return d >= r0 && d <= r1 ? cor : null;
};
/** Do `y` pra baixo (com a borda ondulada por `onda`). */
export const abaixo = (y0: number, cor: CorPedra, onda: (x: number) => number = () => 0): Campo => (x, y) => (y >= y0 + onda(x) ? cor : null);
/** Faixas horizontais: céu em degradê, feito de pedra. */
export const faixas = (y0: number, y1: number, cores: CorPedra[]): Campo => (x, y) => {
  if (y < y0 || y > y1) return null;
  return cores[Math.min(cores.length - 1, Math.floor(((y - y0) / (y1 - y0)) * cores.length))];
};

/**
 * O painel: pinta a tela com pedrinhas segundo o `campo`.
 * `antes` é o campo da cena anterior e `p` (0 a 1) a virada: cada pedra gira e troca
 * de cor quando a onda que sai do centro passa por ela. As pedras de ouro cintilam com `t`.
 */
export const Painel: React.FC<{campo: Campo; antes?: Campo; p?: number; t: number}> = ({campo, antes, p = 1, t}) => {
  const {L, A, u, cx, cy} = useTela();
  const lado = LADO * u;
  const cols = Math.ceil(L / lado) + 1;
  const rows = Math.ceil(A / lado) + 1;
  const raio = Math.hypot(L, A) / 2;
  const pedras = React.useMemo(() => {
    const lista = [];
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        const k = `${i},${j}`;
        const x = i * lado + lado / 2 + (j % 2 ? lado * 0.12 : -lado * 0.12) + (acaso(`mx${k}`) - 0.5) * lado * 0.14;
        const y = j * lado + lado / 2 + (acaso(`my${k}`) - 0.5) * lado * 0.14;
        lista.push({
          x,
          y,
          giro: (acaso(`mg${k}`) - 0.5) * 12,
          tam: lado * (0.8 + acaso(`ms${k}`) * 0.1),
          luz: 0.86 + acaso(`ml${k}`) * 0.26,
          atraso: Math.hypot(x - cx, y - cy) / raio,
        });
      }
    return lista;
  }, [cols, rows, lado, cx, cy, raio]);
  const brilho = (t * 0.35) % 1.6;
  return (
    <AbsoluteFill>
      <Tela>
        {pedras.map((s, n) => {
          // cada pedra gira no seu momento da onda: 0 a 0.5 mostra a cor velha, 0.5 a 1 a nova
          const q = Math.min(1, Math.max(0, (p * 1.5 - s.atraso * 0.5) / 1));
          const nova = q >= 0.5 || !antes;
          const nome = (nova ? campo(s.x, s.y) : antes!(s.x, s.y)) ?? 'argamassa';
          if (nome === 'argamassa') return null;
          const achata = antes ? Math.abs(Math.cos(q * Math.PI)) : Math.min(1, q * 2);
          const ouro = nome === 'ouro' || nome === 'ouroClaro';
          const diag = (s.x / L + s.y / A) / 2;
          const reluz = ouro ? Math.max(0, 1 - Math.abs(diag - brilho + 0.3) * 6) * 0.5 : 0;
          const luz = s.luz + reluz + balanco(t, 0.6, n) * (ouro ? 0.05 : 0.015);
          return (
            <rect
              key={n}
              x={-s.tam / 2}
              y={-s.tam / 2}
              width={s.tam}
              height={s.tam}
              rx={s.tam * 0.12}
              fill={COR[nome]}
              style={{filter: `brightness(${luz.toFixed(2)})`}}
              transform={`translate(${s.x} ${s.y}) rotate(${s.giro}) scale(1 ${Math.max(0.04, achata)})`}
            />
          );
        })}
      </Tela>
    </AbsoluteFill>
  );
};

/** A virada da cena: `p` da onda de pedras no começo de uma cena. */
export const virada = (t: number, dur = 1.2) => ramp(t, 0, dur);

/** Letreiro: letras de pedra marfim numa faixa escura com friso de ouro, como a inscrição de um piso antigo. */
export const Letreiro: React.FC<{y: number; children: string; p: number; tamanho?: number}> = ({y, children, p, tamanho = 84}) => {
  const {L, u} = useTela();
  if (p <= 0) return null;
  const h = tamanho * 1.9 * u;
  return (
    <AbsoluteFill style={{opacity: Math.min(1, p * 2)}}>
      <Tela>
        <rect x={0} y={y - h / 2} width={L} height={h} fill={COR.azulNoite} />
        <rect x={0} y={y - h / 2} width={L} height={10 * u} fill={COR.ouro} />
        <rect x={0} y={y + h / 2 - 10 * u} width={L} height={10 * u} fill={COR.ouro} />
        <text x={L / 2} y={y + tamanho * 0.36 * u} textAnchor="middle" fontFamily={TITULO} fontWeight={700} fontSize={tamanho * u} letterSpacing={6 * u} fill={COR.marfim}>
          {children.toUpperCase()}
        </text>
      </Tela>
    </AbsoluteFill>
  );
};

// ---------- 3. os desenhos: campos de pedra ----------
// Todo desenho devolve um Campo. Contorno escuro de uma pedra em volta é o que faz
// a forma "ler" no mosaico: use `contorno()`. Desenho novo segue o mesmo jeito.

/** Põe uma borda de uma pedra de largura, na cor dada, em volta de um campo. */
export const contorno = (dentro: Campo, cor: CorPedra, largura: number): Campo => (x, y) => {
  if (dentro(x, y)) return dentro(x, y);
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (dentro(x + dx * largura, y + dy * largura)) return cor;
  return null;
};

export const Sol = (cx: number, cy: number, r: number, t: number): Campo => {
  const raios: Campo = (x, y) => {
    const d = Math.hypot(x - cx, y - cy);
    if (d < r * 1.15 || d > r * 1.75) return null;
    const a = Math.atan2(y - cy, x - cx) + t * 0.3;
    return Math.cos(a * 12) > 0.35 ? 'ouro' : null;
  };
  return empilha(raios, anel(cx, cy, r * 0.8, r, 'ouro'), disco(cx, cy, r * 0.8, 'ouroClaro'));
};

export const Nuvem = (cx: number, cy: number, w: number, cor: CorPedra = 'branco', borda: CorPedra = 'cinza'): Campo => {
  const corpo = empilha(disco(cx - w * 0.28, cy + w * 0.04, w * 0.24, cor, w * 0.18), disco(cx, cy - w * 0.08, w * 0.3, cor, w * 0.24), disco(cx + w * 0.28, cy + w * 0.03, w * 0.24, cor, w * 0.18));
  return contorno(corpo, borda, w * 0.05);
};

/** Chuva: colunas de pedras azuis que descem com `t`. `forca` de 0 a 1 liga aos poucos. */
export const Chuva = (cx: number, y0: number, largura: number, altura: number, t: number, forca = 1): Campo => (x, y) => {
  if (Math.abs(x - cx) > largura / 2 || y < y0 || y > y0 + altura) return null;
  const coluna = Math.floor((x - cx + largura) / (largura / 9));
  if (coluna % 2 || acaso(`cc${coluna}`) > forca) return null;
  const fase = ((y - y0) / altura - t * 0.9 - acaso(`cf${coluna}`)) % 0.34;
  return (fase + 0.34) % 0.34 < 0.12 ? 'celeste' : null;
};

/** O mar: faixas de dois azuis com cristas onduladas que andam com `t`. */
export const Mar = (y0: number, t: number, escala: number): Campo => {
  const onda = (k: number) => (x: number) => Math.sin(x / (90 * escala) + t * 1.5 + k) * 22 * escala;
  return empilha(abaixo(y0, 'marClaro', onda(0)), abaixo(y0 + 70 * escala, 'mar', onda(2)), abaixo(y0 + 160 * escala, 'azulNoite', onda(4)));
};

/** Planta: caule e folhas em verde, crescendo com `p`. */
export const Planta = (cx: number, chao: number, alto: number, p: number): Campo => {
  const h = alto * Math.min(1, p * 1.3);
  const caule: Campo = (x, y) => (Math.abs(x - cx) < alto * 0.045 && y <= chao && y >= chao - h ? 'verde' : null);
  const folha = (lado: number, fh: number, abre: number): Campo =>
    abre <= 0 ? () => null : disco(cx + lado * alto * 0.2 * abre, chao - h * fh, alto * 0.2 * abre, lado > 0 ? 'verde' : 'verdeClaro', alto * 0.12 * abre);
  return empilha(caule, folha(-1, 0.4, ramp(p, 0.3, 0.7)), folha(1, 0.65, ramp(p, 0.5, 0.85)), folha(-1, 0.92, ramp(p, 0.7, 1) * 0.8));
};

// ---------- 4. o exemplo: o ciclo da água ----------
// Cada cena é um campo (que pode mudar com t). A cena seguinte recebe o campo
// da anterior como `antes`, pra virada sair da imagem velha pra nova.

type Montagem = (L: number, A: number, u: number, t: number) => Campo;

const ceu = (A: number, cores: CorPedra[] = ['azul', 'celeste', 'ceuClaro']) => empilha(tudo('azulNoite'), faixas(0, A * 0.62, cores));

const M: Montagem[] = [
  // 0 título: céu, mar e a inscrição
  (L, A, u, t) => empilha(ceu(A), Sol(L * 0.5, A * 0.2, 110 * u, t), Mar(A * 0.5, t, u)),
  // 1 o sol esquenta o mar
  (L, A, u, t) => empilha(ceu(A, ['celeste', 'ceuClaro', 'marfim']), Sol(L * 0.5, A * 0.22, (150 + balanco(t, 1) * 6) * u, t), Mar(A * 0.44, t, u)),
  // 2 o vapor sobe e vira nuvem
  (L, A, u, t) => {
    const sobe = ramp(t, 0.6, 2.4);
    const vapor: Campo = (x, y) => {
      for (const fx of [0.3, 0.5, 0.7]) {
        const yy = (y / A - 0.42 + t * 0.06) * 12;
        if (y > A * 0.28 && y < A * 0.47 && Math.abs(x - L * fx - Math.sin(yy) * 30 * u) < 16 * u) return 'branco';
      }
      return null;
    };
    return empilha(ceu(A), vapor, Nuvem(L * 0.5, A * 0.2, L * (0.35 + sobe * 0.25)), Mar(A * 0.48, t, u));
  },
  // 3 a nuvem pesa e vira chuva
  (L, A, u, t) =>
    empilha(ceu(A, ['azulNoite', 'azul', 'celeste']), Chuva(L * 0.5, A * 0.26, L * 0.6, A * 0.32, t, ramp(t, 0.6, 1.6)), Nuvem(L * 0.5, A * 0.18, L * 0.7, 'cinza', 'azulNoite')),
  // 4 a chuva faz a planta crescer
  (L, A, u, t) =>
    empilha(
      ceu(A),
      Nuvem(L * 0.5, A * 0.12, L * 0.5),
      Chuva(L * 0.5, A * 0.18, L * 0.42, A * 0.16, t),
      abaixo(A * 0.55, 'terra', (x) => Math.sin(x / (160 * u)) * 12 * u),
      Planta(L * 0.5, A * 0.56, A * 0.3, ramp(t, 0.8, 2.8)),
    ),
];

/** A cena `i`: o painel dela, virando a partir do painel da cena anterior (congelado no fim dela). */
const cena = (i: number): React.FC<PropsCena> => ({t, tv, fala}) => {
  const {L, A, u} = useTela();
  const campo = M[i](L, A, u, t);
  const fimAnterior = i > 0 ? fala.frases[i].s - (i > 1 ? fala.frases[i - 1].s : 0) : 0;
  const antes = i > 0 ? M[i - 1](L, A, u, fimAnterior) : undefined;
  return (
    <>
      <Painel campo={campo} antes={antes} p={i === 0 ? Math.min(1, tv * 3 + 0.4) : virada(t)} t={t} />
      {i === 0 && <Letreiro y={A * 0.36} p={ramp(t, 0.5, 1)}>O ciclo da água</Letreiro>}
    </>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    semLegenda={[[0, FALA_EXEMPLO.frases[1].s]]}
    cenas={cenasPorFrase(FALA_EXEMPLO, [
      [0, 0, cena(0), 0],
      [1, 1, cena(1), 0],
      [2, 2, cena(2), 0],
      [3, 3, cena(3), 0],
      [4, 4, cena(4), 0],
    ])}
  />
);
