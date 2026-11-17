// ESTILO: Quadro de giz
// Uma lousa verde onde tudo é desenhado a giz na frente de quem assiste: o
// traço avança, a cor entra em hachura, o texto se escreve, e o apagador limpa
// a cena. Bom pra aula, explicação passo a passo e curiosidade.
//
// Este arquivo é o molde de como um estilo é feito:
//   1. `tema`      cores, fundo e legenda
//   2. as peças    o jeito do estilo pôr coisa na tela (traço, cor, texto, transição)
//   3. os desenhos alguns objetos prontos, pra servir de exemplo de como desenhar
//   4. `Exemplo`   a história-padrão (o ciclo da água) contada neste estilo
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarFredericka} from '@remotion/google-fonts/FrederickatheGreat';
import {loadFont as carregarKalam} from '@remotion/google-fonts/Kalam';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, Traco, acaso, balanco, caminho, cenasPorFrase, chega, circulo, emFila, ramp, tremer, useTela} from '../../kit';

const {fontFamily: TITULO} = carregarFredericka('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: MAO} = carregarKalam('normal', {weights: ['700'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As cores do giz. Poucas e claras: giz não tem cor escura. */
export const COR = {
  branco: '#f4f4ef',
  amarelo: '#ffe08a',
  azul: '#9fd3f0',
  verde: '#a9e39a',
  rosa: '#ffb3a8',
  laranja: '#ffc48a',
} as const;
export type CorGiz = keyof typeof COR;

/** A lousa: verde com mancha de apagador, moldura de madeira e canaleta com os gizes. */
const Fundo: React.FC<{t: number}> = () => {
  const {L, A, u} = useTela();
  const m = 26 * u; // largura da moldura
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 45% 40%, #2f4a3d 0%, #213a2f 55%, #16271f 100%)'}}>
      <Tela>
        <defs>
          {/* o grão e o tremor do giz: todo desenho passa por este filtro */}
          <filter id="giz" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves={2} seed={7} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={6 * u} result="d" />
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves={1} seed={2} result="g" />
            <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.55" result="m" />
            <feComposite in="d" in2="m" operator="in" />
          </filter>
          <filter id="giz-mancha">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={3} seed={11} />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.09 0" />
          </filter>
        </defs>
        <rect width={L} height={A} filter="url(#giz-mancha)" />
        <rect x={m / 2} y={m / 2} width={L - m} height={A - m} fill="none" stroke="#6b4a2f" strokeWidth={m} />
        <rect x={m} y={m} width={L - 2 * m} height={A - 2 * m} fill="none" stroke="#3d2a1a" strokeWidth={3 * u} opacity={0.6} />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'giz',
  nome: 'Quadro de giz',
  fundo: '#213a2f',
  tinta: COR.branco,
  acento: COR.amarelo,
  legenda: {
    fonte: MAO,
    peso: 700,
    tamanho: 64,
    cor: COR.branco,
    destaque: COR.amarelo,
    sombra: '0 3px 0 #16271f, 0 0 18px #16271f, 0 0 6px #16271f',
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** A camada de giz: tudo que vai dentro ganha o grão e o tremor. Use dentro de <Tela>. */
export const Giz: React.FC<{children: React.ReactNode; opacity?: number}> = ({children, opacity = 1}) => (
  <g filter="url(#giz)" opacity={opacity}>
    {children}
  </g>
);

/**
 * Um risco de giz que se desenha. `pontos` é o caminho, `p` vai de 0 a 1.
 * `cheio` fecha a forma e pinta por dentro com hachura (riscos inclinados), como se pinta com giz de lado.
 */
export const Risco: React.FC<{
  pontos: Ponto[];
  p: number;
  cor?: CorGiz;
  grossura?: number;
  cheio?: boolean;
  fechado?: boolean;
  reto?: boolean;
  id?: string;
}> = ({pontos, p, cor = 'branco', grossura = 9, cheio = false, fechado = cheio, reto = false, id = `${pontos[0][0]}-${pontos[0][1]}-${pontos.length}`}) => {
  const {u} = useTela();
  const mao = React.useMemo(() => tremer(pontos, id, 3.5 * u), [pontos, id, u]);
  const d = caminho(mao, fechado, reto);
  const [x0, x1, y0, y1] = React.useMemo(() => {
    const xs = pontos.map((q) => q[0]);
    const ys = pontos.map((q) => q[1]);
    return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  }, [pontos]);
  const passo = 15 * u;
  const n = cheio ? Math.ceil((x1 - x0 + (y1 - y0)) / passo) : 0;
  return (
    <>
      {cheio && p > 0.35 && (
        <g clipPath={`url(#corte-${id})`} stroke={COR[cor]} strokeWidth={5 * u} opacity={0.72} strokeLinecap="round">
          <clipPath id={`corte-${id}`}>
            <path d={caminho(pontos, true, reto)} />
          </clipPath>
          {Array.from({length: n}, (_, i) => {
            const x = x0 + i * passo;
            const q = ramp(p, 0.35 + (i / n) * 0.5, 0.5 + (i / n) * 0.5);
            const h = y1 - y0;
            return q > 0 ? <line key={i} x1={x} y1={y0} x2={x - h * 0.75 * q} y2={y0 + h * q} /> : null;
          })}
        </g>
      )}
      <Traco d={d} p={Math.min(1, p / 0.7)} stroke={COR[cor]} strokeWidth={grossura * u} />
    </>
  );
};

/** Texto escrito a giz, que aparece da esquerda pra direita como se alguém escrevesse. */
export const Escrito: React.FC<{
  x: number;
  y: number;
  children: string;
  p: number;
  tamanho?: number;
  cor?: CorGiz;
  titulo?: boolean;
  ancora?: 'start' | 'middle' | 'end';
}> = ({x, y, children, p, tamanho = 70, cor = 'branco', titulo = false, ancora = 'middle'}) => {
  const {L, u} = useTela();
  if (p <= 0) return null;
  const id = `escrito-${x}-${y}-${children.length}`;
  return (
    <>
      <clipPath id={id}>
        <rect x={0} y={y - tamanho * u * 1.4} width={L * Math.min(1, p)} height={tamanho * u * 2.2} />
      </clipPath>
      <text
        x={x}
        y={y}
        clipPath={`url(#${id})`}
        textAnchor={ancora}
        fontFamily={titulo ? TITULO : MAO}
        fontWeight={titulo ? 400 : 700}
        fontSize={tamanho * u}
        fill={COR[cor]}
      >
        {children}
      </text>
    </>
  );
};

/**
 * O apagador: a transição do estilo. Ponha no fim de uma cena, por cima de tudo.
 * `p` de 0 a 1 passa o apagador da esquerda pra direita e deixa a lousa limpa.
 */
export const Apagador: React.FC<{p: number}> = ({p}) => {
  const {L, A, u} = useTela();
  if (p <= 0) return null;
  const x = -220 * u + p * (L + 440 * u);
  return (
    <AbsoluteFill>
      <Tela>
        <defs>
          <filter id="giz-borrao">
            <feGaussianBlur stdDeviation={22 * u} />
          </filter>
        </defs>
        <rect x={0} y={0} width={Math.max(0, x)} height={A} fill="#213a2f" />
        <rect x={0} y={0} width={Math.max(0, x)} height={A} fill="#ffffff" opacity={0.035} filter="url(#giz-borrao)" />
        <g transform={`translate(${x} ${A * 0.5 + Math.sin(p * 9) * A * 0.2}) rotate(${Math.sin(p * 9) * 8})`}>
          <rect x={-70 * u} y={-150 * u} width={140 * u} height={300 * u} rx={14 * u} fill="#8a6a45" />
          <rect x={-70 * u} y={-150 * u} width={46 * u} height={300 * u} rx={10 * u} fill="#e9e4d6" />
        </g>
      </Tela>
    </AbsoluteFill>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Todo desenho recebe o centro (x, y), o tamanho e `p` (0 a 1), e é feito de
// listas de pontos passadas pro <Risco>. Desenho novo segue o mesmo jeito.

type Desenho = {x: number; y: number; tam?: number; p: number};

export const Sol: React.FC<Desenho & {t?: number}> = ({x, y, tam = 150, p, t = 0}) => {
  const raios = 10;
  return (
    <>
      <Risco id="sol" pontos={circulo(x, y, tam * 0.5)} p={p} cor="amarelo" cheio />
      {Array.from({length: raios}, (_, i) => {
        const a = (i / raios) * Math.PI * 2 + t * 0.25;
        const pulsa = 1 + balanco(t, 1.4, i) * 0.07;
        const r0 = tam * 0.68;
        const r1 = tam * 0.98 * pulsa;
        return (
          <Risco
            key={i}
            id={`raio${i}`}
            reto
            pontos={[
              [x + Math.cos(a) * r0, y + Math.sin(a) * r0],
              [x + Math.cos(a) * r1, y + Math.sin(a) * r1],
            ]}
            p={emFila(p, 0.5, 0.5, i, raios)}
            cor="amarelo"
            grossura={8}
          />
        );
      })}
    </>
  );
};

export const Nuvem: React.FC<Desenho & {cor?: CorGiz}> = ({x, y, tam = 300, p, cor = 'branco'}) => {
  const w = tam;
  const h = tam * 0.42;
  const pontos: Ponto[] = [
    [x - w * 0.5, y + h * 0.5],
    [x - w * 0.56, y + h * 0.05],
    [x - w * 0.34, y - h * 0.3],
    [x - w * 0.16, y - h * 0.72],
    [x + w * 0.08, y - h * 0.86],
    [x + w * 0.24, y - h * 0.42],
    [x + w * 0.46, y - h * 0.32],
    [x + w * 0.56, y + h * 0.12],
    [x + w * 0.46, y + h * 0.5],
  ];
  return <Risco id={`nuvem${x}`} pontos={pontos} p={p} cor={cor} cheio />;
};

/** Pingos caindo sem parar, entre `y` e `y + altura`. `forca` de 0 a 1 liga a chuva aos poucos. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; pingos?: number}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  pingos = 16,
}) => {
  const {u} = useTela();
  return (
    <>
      {Array.from({length: pingos}, (_, i) => {
        if (i / pingos > forca) return null;
        const fase = (t * (0.9 + acaso(`v${i}`) * 0.5) + acaso(`f${i}`)) % 1;
        const px = x - largura / 2 + acaso(`x${i}`) * largura;
        const py = y + fase * altura;
        return (
          <line key={i} x1={px} y1={py} x2={px - 10 * u} y2={py + 46 * u} stroke={COR.azul} strokeWidth={7 * u} strokeLinecap="round" opacity={1 - fase * 0.5} />
        );
      })}
    </>
  );
};

/** Ondas do mar: três linhas que balançam. */
export const Mar: React.FC<{y: number; p: number; t: number; x0?: number; x1?: number}> = ({y, p, t, x0, x1}) => {
  const {L, u} = useTela();
  const a = x0 ?? 60 * u;
  const b = x1 ?? L - 60 * u;
  return (
    <>
      {[0, 1, 2].map((k) => {
        const n = 9;
        const pontos: Ponto[] = Array.from({length: n}, (_, i) => [
          a + ((b - a) * i) / (n - 1),
          y + k * 58 * u + Math.sin(i * 1.7 + t * 1.6 + k) * 16 * u,
        ]);
        return <Risco key={k} id={`onda${k}`} pontos={pontos} p={emFila(p, 0, 1, k, 3)} cor="azul" grossura={10 - k * 1.5} />;
      })}
    </>
  );
};

/** Uma planta que cresce: `p` de 0 a 1 sobe o caule e abre as folhas. */
export const Planta: React.FC<Desenho & {t?: number}> = ({x, y, tam = 360, p, t = 0}) => {
  const venta = balanco(t, 0.8) * tam * 0.03;
  const alto = tam * ramp(p, 0, 0.7, chega);
  const caule: Ponto[] = [
    [x, y],
    [x + venta * 0.4, y - alto * 0.5],
    [x + venta, y - alto],
  ];
  const folha = (lado: 1 | -1, altura: number, abre: number): Ponto[] => {
    const by = y - alto * altura;
    const bx = x + venta * altura;
    const c = tam * 0.3 * abre;
    return [
      [bx, by],
      [bx + lado * c * 0.5, by - c * 0.45],
      [bx + lado * c, by - c * 0.2],
      [bx + lado * c * 0.55, by + c * 0.12],
    ];
  };
  return (
    <>
      <Risco id="caule" pontos={caule} p={p > 0 ? 1 : 0} cor="verde" grossura={11} />
      {p > 0.3 && <Risco id="folhaE" pontos={folha(-1, 0.45, ramp(p, 0.3, 0.75, chega))} p={1} cor="verde" cheio />}
      {p > 0.45 && <Risco id="folhaD" pontos={folha(1, 0.72, ramp(p, 0.45, 0.9, chega))} p={1} cor="verde" cheio />}
      {p > 0.6 && <Risco id="broto" pontos={folha(-1, 1, ramp(p, 0.6, 1, chega) * 0.7)} p={1} cor="verde" cheio />}
    </>
  );
};

/** Uma seta de `de` até `ate`, com a ponta. */
export const Seta: React.FC<{de: Ponto; ate: Ponto; p: number; cor?: CorGiz; curva?: number}> = ({de, ate, p, cor = 'branco', curva = 0}) => {
  const {u} = useTela();
  const meio: Ponto = [(de[0] + ate[0]) / 2 + curva * (ate[1] - de[1]) * 0.3, (de[1] + ate[1]) / 2 - curva * (ate[0] - de[0]) * 0.3];
  const ang = Math.atan2(ate[1] - meio[1], ate[0] - meio[0]);
  const asa = 34 * u;
  const ponta = (lado: number): Ponto => [ate[0] - Math.cos(ang + lado * 0.5) * asa, ate[1] - Math.sin(ang + lado * 0.5) * asa];
  return (
    <>
      <Risco id={`seta${de[0]}${ate[1]}`} pontos={[de, meio, ate]} p={ramp(p, 0, 0.7)} cor={cor} grossura={8} />
      <Risco id={`ponta${de[0]}${ate[1]}`} reto pontos={[ponta(1), ate, ponta(-1)]} p={ramp(p, 0.65, 1)} cor={cor} grossura={8} />
    </>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Giz>
          <Escrito x={L / 2} y={A * 0.36} p={ramp(t, 0, 0.6)} tamanho={128} titulo cor="amarelo">
            O ciclo
          </Escrito>
          <Escrito x={L / 2} y={A * 0.36 + 150 * u} p={ramp(t, 0.35, 0.95)} tamanho={128} titulo cor="amarelo">
            da água
          </Escrito>
          <Risco
            id="sublinha"
            pontos={[
              [L * 0.24, A * 0.36 + 200 * u],
              [L * 0.5, A * 0.36 + 214 * u],
              [L * 0.76, A * 0.36 + 198 * u],
            ]}
            p={ramp(t, 0.8, 1.3)}
            cor="azul"
          />
        </Giz>
      </Tela>
      <Apagador p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Giz>
          <Sol x={L * 0.7} y={A * 0.2} tam={170 * u} p={ramp(t, 0, 1)} t={t} />
          <Mar y={A * 0.52} p={ramp(t, 0.3, 1.2)} t={t} />
          {[0.28, 0.46, 0.64].map((fx, i) => (
            <Seta key={i} de={[L * fx, A * 0.49]} ate={[L * fx + 30 * u, A * 0.33]} p={ramp(t, 1 + i * 0.25, 1.9 + i * 0.25)} cor="branco" curva={0.5} />
          ))}
        </Giz>
      </Tela>
      <Apagador p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Giz>
          <Mar y={A * 0.58} p={1} t={t} />
          <Seta de={[L * 0.5, A * 0.55]} ate={[L * 0.5, A * 0.37]} p={ramp(t, 0, 0.8)} curva={0.4} />
          <Nuvem x={L * 0.5} y={A * 0.24} tam={(360 + ramp(t, 0.8, dur) * 150) * u} p={ramp(t, 0.5, 1.6)} />
        </Giz>
      </Tela>
      <Apagador p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Giz>
          <Nuvem x={L * 0.5} y={A * 0.24} tam={520 * u} p={1} cor={t > 0.9 ? 'azul' : 'branco'} />
          <Chuva x={L * 0.5} y={A * 0.31} largura={430 * u} altura={A * 0.32} t={t} forca={ramp(t, 0.5, 1.8)} />
        </Giz>
      </Tela>
      <Apagador p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <Tela>
      <Giz>
        <Nuvem x={L * 0.5} y={A * 0.2} tam={460 * u} p={1} cor="azul" />
        <Chuva x={L * 0.5} y={A * 0.27} largura={380 * u} altura={A * 0.26} t={t} pingos={12} />
        <Risco
          id="chao"
          pontos={[
            [L * 0.14, A * 0.62],
            [L * 0.5, A * 0.615],
            [L * 0.86, A * 0.62],
          ]}
          p={ramp(t, 0, 0.6)}
          cor="laranja"
        />
        <Planta x={L * 0.5} y={A * 0.615} tam={300 * u} p={ramp(t, 0.5, 2.6)} t={t} />
      </Giz>
    </Tela>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, que já está escrito na lousa: sem legenda nesse trecho
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
