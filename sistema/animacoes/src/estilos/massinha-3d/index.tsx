// ESTILO: Massinha 3D
// Bonecos e objetos de massinha num estúdio de mesa: cada forma é estufada como
// argila (borda arredondada, brilho de luz de estúdio, sombra de contato no chão).
// O volume é feito no próprio motor, com luz calculada sobre a forma (filtro de
// iluminação do SVG), sem programa de 3D. Bom pra explicação simpática, infantil,
// produto e curiosidade.
//
// Este arquivo segue o molde do giz:
//   1. `tema`      cores, fundo (o estúdio) e legenda
//   2. as peças    o barro (volume e luz), bola, cobrinha, sombra, letra de massinha, entrada e amassada
//   3. os desenhos Sol, Nuvem, Chuva, Mar e Planta em massinha
//   4. `Exemplo`   o ciclo da água contado neste estilo
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarFredoka} from '@remotion/google-fonts/Fredoka';
import type {PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, cenasPorFrase, chega, elastico, ramp, useTela} from '../../kit';

const {fontFamily: LETRA} = carregarFredoka('normal', {weights: ['600', '700'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As cores da massinha: vivas e um pouco leitosas, como argila de modelar. */
export const COR = {
  laranja: '#ff8a3d',
  amarelo: '#ffc53d',
  azul: '#3d8bff',
  azulEscuro: '#2a62c9',
  celeste: '#8cc4ff',
  branco: '#fbf7f2',
  cinza: '#aebbd2',
  verde: '#5cc46a',
  verdeEscuro: '#3a9a4c',
  terra: '#b0703f',
  rosa: '#ff8fa3',
} as const;
export type CorMassa = keyof typeof COR;

/** Mistura uma cor hex com branco (q > 0) ou preto (q < 0). */
const tom = (hex: string, q: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(q > 0 ? v + (255 - v) * q : v * (1 + q)));
  return `rgb(${c.join(',')})`;
};

/** O estúdio: parede e chão numa curva só (o fundo infinito de foto), luz principal do alto à esquerda. */
const Fundo: React.FC<{t: number}> = () => {
  const {L, A, u} = useTela();
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #fde7d8 0%, #f8d5bf 48%, #f1c3a6 62%, #e9b495 100%)'}}>
      <Tela>
        <defs>
          {/*
            O barro: a forma vira um relevo (a borda desce, o meio fica alto), a luz do estúdio bate
            nesse relevo e devolve sombra própria e brilho. É isso que dá o volume de massinha.
          */}
          <filter id="massinha-vol" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation={11 * u} result="relevo" />
            <feDiffuseLighting in="relevo" surfaceScale={46 * u} diffuseConstant={1.15} lightingColor="#ffffff" result="luz">
              <feDistantLight azimuth={225} elevation={42} />
            </feDiffuseLighting>
            <feComposite in="SourceGraphic" in2="luz" operator="arithmetic" k1={0.74} k2={0.42} k3={0} k4={0} result="sombreado" />
            <feSpecularLighting in="relevo" surfaceScale={46 * u} specularConstant={0.75} specularExponent={16} lightingColor="#fff6ec" result="brilho">
              <feDistantLight azimuth={225} elevation={52} />
            </feSpecularLighting>
            <feComposite in="brilho" in2="SourceAlpha" operator="in" result="brilhoDentro" />
            {/* a textura de dedo: um ruído fino que mexe pouco na luz */}
            <feTurbulence type="fractalNoise" baseFrequency={0.9 / u} numOctaves={2} seed={4} result="grao" />
            <feColorMatrix in="grao" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.10 0" result="graoEscuro" />
            <feComposite in="graoEscuro" in2="SourceAlpha" operator="in" result="graoDentro" />
            <feComposite in="brilhoDentro" in2="sombreado" operator="arithmetic" k2={0.55} k3={1} result="comBrilho" />
            <feMerge>
              <feMergeNode in="comBrilho" />
              <feMergeNode in="graoDentro" />
            </feMerge>
          </filter>
          <filter id="massinha-sombra" x="-50%" y="-200%" width="200%" height="500%">
            <feGaussianBlur stdDeviation={14 * u} />
          </filter>
          <filter id="massinha-luz">
            <feGaussianBlur stdDeviation={120 * u} />
          </filter>
        </defs>
        {/* a luz principal do estúdio, um clarão suave no alto à esquerda */}
        <ellipse cx={L * 0.25} cy={A * 0.18} rx={L * 0.5} ry={A * 0.22} fill="#fff6ee" opacity={0.7} filter="url(#massinha-luz)" />
        {/* a curva onde a parede vira chão */}
        <ellipse cx={L / 2} cy={A * 0.62} rx={L * 0.9} ry={A * 0.05} fill="#fff1e6" opacity={0.35} filter="url(#massinha-luz)" />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'massinha-3d',
  nome: 'Massinha 3D',
  fundo: '#f8d5bf',
  tinta: '#4a2a1c',
  acento: '#e2552b',
  legenda: {
    fonte: LETRA,
    peso: 700,
    tamanho: 72,
    cor: '#4a2a1c',
    destaque: '#e2552b',
    sombra: '0 3px 0 #fff4ea, 0 0 16px #fff4ea, 0 0 6px #fff4ea',
    altura: 0.74,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** O barro: tudo que vai dentro vira massinha com volume e luz. Formas que se tocam DENTRO de um mesmo Barro se fundem numa peça só. */
export const Barro: React.FC<{children: React.ReactNode; opacity?: number}> = ({children, opacity = 1}) => (
  <g filter="url(#massinha-vol)" opacity={opacity}>
    {children}
  </g>
);

/** Uma bola (ou ovo) de massinha. Use dentro de <Barro>. */
export const Bola: React.FC<{x: number; y: number; r: number; ry?: number; cor: CorMassa; giro?: number}> = ({x, y, r, ry = r, cor, giro = 0}) => (
  <ellipse cx={x} cy={y} rx={r} ry={ry} fill={COR[cor]} transform={giro ? `rotate(${giro} ${x} ${y})` : undefined} />
);

/** Uma cobrinha de massinha (o rolinho que se faz na palma): de (x1, y1) a (x2, y2), com grossura. Use dentro de <Barro>. */
export const Cobrinha: React.FC<{x1: number; y1: number; x2: number; y2: number; grossura: number; cor: CorMassa}> = ({x1, y1, x2, y2, grossura, cor}) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={COR[cor]} strokeWidth={grossura} strokeLinecap="round" />
);

/** A sombra de contato: a mancha suave que a peça faz no chão. Fica FORA do Barro, antes da peça. */
export const Sombra: React.FC<{x: number; y: number; largura: number; forca?: number}> = ({x, y, largura, forca = 1}) => (
  <ellipse cx={x} cy={y} rx={largura / 2} ry={largura * 0.09} fill="#7a3f22" opacity={0.32 * forca} filter="url(#massinha-sombra)" />
);

/**
 * A entrada e a saída de massinha: a peça nasce do chão esticando, passa do ponto e assenta (squash & stretch),
 * e no fim é amassada contra o chão. (x, y) é o ponto do chão onde ela apoia.
 */
export const Molde: React.FC<{x: number; y: number; t: number; de?: number; dur?: number; children: React.ReactNode}> = ({
  x,
  y,
  t,
  de = 0,
  dur = 99,
  children,
}) => {
  const nasce = ramp(t, de, de + 0.7, elastico);
  if (nasce <= 0) return null;
  const amassa = ramp(t, dur - 0.45, dur, chega);
  const respira = balanco(t, 0.9, x) * 0.015;
  const sy = nasce * (1 - amassa * 0.92) * (1 + respira);
  const sx = (0.6 + 0.4 * Math.min(1, nasce)) * (1 + amassa * 0.35) * (1 - respira);
  return <g transform={`translate(${x} ${y}) scale(${sx} ${sy}) translate(${-x} ${-y})`}>{children}</g>;
};

/** Letra de massinha: texto grosso e estufado como se fosse modelado. Fica dentro de <Barro>. */
export const Letra: React.FC<{x: number; y: number; children: string; tamanho?: number; cor?: CorMassa}> = ({x, y, children, tamanho = 130, cor = 'laranja'}) => {
  const {u} = useTela();
  return (
    <text x={x} y={y} textAnchor="middle" fontFamily={LETRA} fontWeight={700} fontSize={tamanho * u} fill={COR[cor]} letterSpacing={2 * u}>
      {children}
    </text>
  );
};

/** O chão da cena onde as peças apoiam (em proporção da altura). */
export const CHAO = 0.58;

// ---------- 3. alguns desenhos prontos ----------
// Todo desenho é bola, cobrinha ou caminho cheio, dentro de um <Barro>, com <Sombra> no chão
// e (quando apoia no chão) um <Molde> pra nascer esticando. Desenho novo segue o mesmo jeito.

type Desenho = {x: number; y: number; tam?: number; t: number};

/** O sol: bola laranja com raios de cobrinha amarela que giram devagar. Flutua (a sombra fica no chão). */
export const Sol: React.FC<Desenho & {chao?: number}> = ({x, y, tam = 150, t, chao}) => {
  const {A} = useTela();
  const flutua = balanco(t, 0.6) * tam * 0.06;
  return (
    <>
      <Sombra x={x} y={(chao ?? CHAO) * A} largura={tam * 1.2} forca={0.5} />
      <Barro>
        {Array.from({length: 9}, (_, i) => {
          const a = (i / 9) * Math.PI * 2 + t * 0.35;
          return (
            <Cobrinha
              key={i}
              x1={x + Math.cos(a) * tam * 0.78}
              y1={y + flutua + Math.sin(a) * tam * 0.78}
              x2={x + Math.cos(a) * tam * 1.12}
              y2={y + flutua + Math.sin(a) * tam * 1.12}
              grossura={tam * 0.22}
              cor="amarelo"
            />
          );
        })}
      </Barro>
      <Barro>
        <Bola x={x} y={y + flutua} r={tam * 0.62} cor="laranja" />
      </Barro>
    </>
  );
};

/** A nuvem: bolas que se fundem numa peça só, branca ou cinza de chuva. */
export const Nuvem: React.FC<Desenho & {cor?: CorMassa; chao?: number; sombra?: boolean}> = ({x, y, tam = 360, t, cor = 'branco', chao, sombra = true}) => {
  const {A} = useTela();
  const w = tam;
  const flutua = balanco(t, 0.5, 3) * w * 0.02;
  const yy = y + flutua;
  return (
    <>
      {sombra && <Sombra x={x} y={(chao ?? CHAO) * A} largura={w * 0.9} forca={0.45} />}
      <Barro>
        <Bola x={x - w * 0.28} y={yy + w * 0.04} r={w * 0.2} cor={cor} />
        <Bola x={x - w * 0.04} y={yy - w * 0.08} r={w * 0.25} cor={cor} />
        <Bola x={x + w * 0.24} y={yy} r={w * 0.21} cor={cor} />
        <Bola x={x} y={yy + w * 0.1} r={w * 0.46} ry={w * 0.12} cor={cor} />
      </Barro>
    </>
  );
};

/** Pingos de massinha azul que caem esticando e se achatam no chão. `forca` de 0 a 1 liga a chuva aos poucos. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; pingos?: number}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  pingos = 10,
}) => {
  const {u} = useTela();
  return (
    <Barro>
      {Array.from({length: pingos}, (_, i) => {
        if (i / pingos > forca) return null;
        const fase = (t * (0.8 + acaso(`mas-v${i}`) * 0.4) + acaso(`mas-f${i}`)) % 1;
        const px = x - largura / 2 + ((i + 0.5) / pingos) * largura + (acaso(`mas-x${i}`) - 0.5) * largura * 0.06;
        const py = y + fase * altura;
        const estica = 1 + fase * 0.6;
        const chega = fase > 0.92; // no fim, achata
        const r = 15 * u;
        return chega ? (
          <Bola key={i} x={px} y={y + altura + r * 0.3} r={r * 1.7} ry={r * 0.45} cor="azul" />
        ) : (
          <path
            key={i}
            d={`M${px} ${py - r * 2.2 * estica} C${px + r * 0.6} ${py - r} ${px + r} ${py} ${px + r} ${py + r * 0.3} A${r} ${r} 0 0 1 ${px - r} ${py + r * 0.3} C${px - r} ${py} ${px - r * 0.6} ${py - r} ${px} ${py - r * 2.2 * estica}Z`}
            fill={COR.azul}
          />
        );
      })}
    </Barro>
  );
};

/** O mar: duas placas de massinha azul com a crista em onda, uma atrás da outra. */
export const Mar: React.FC<{y: number; t: number; altura?: number}> = ({y, t, altura}) => {
  const {L, A, u} = useTela();
  const h = altura ?? A * 0.1;
  const placa = (base: number, fase: number, amp: number) => {
    let d = `M${-40 * u} ${base + h}L${-40 * u} ${base}`;
    for (let x = -40 * u; x <= L + 40 * u; x += 24 * u) d += `L${x} ${base + Math.sin(x / (90 * u) + fase) * amp}`;
    return d + `L${L + 40 * u} ${base + h}Z`;
  };
  return (
    <>
      <Barro>
        <path d={placa(y, t * 1.4 + 1, 16 * u)} fill={COR.azulEscuro} />
      </Barro>
      <Barro>
        <path d={placa(y + h * 0.35, -t * 1.7, 20 * u)} fill={COR.azul} />
      </Barro>
    </>
  );
};

/** Uma planta que cresce de um montinho de terra: caule de cobrinha e folhas de bola achatada. `p` de 0 a 1. */
export const Planta: React.FC<Desenho & {p: number}> = ({x, y, tam = 320, p, t}) => {
  const alto = tam * ramp(p, 0, 0.6, chega);
  const venta = balanco(t, 0.8) * tam * 0.03;
  const folha = (lado: 1 | -1, em: number, de: number) => {
    const abre = ramp(p, de, de + 0.3, elastico);
    if (abre <= 0) return null;
    const by = y - alto * em;
    return <Bola key={`${lado}${em}`} x={x + venta * em + lado * tam * 0.15 * abre} y={by} r={tam * 0.15 * abre} ry={tam * 0.07 * abre} cor="verde" giro={lado * -25} />;
  };
  return (
    <>
      <Sombra x={x} y={y + tam * 0.05} largura={tam * 0.9} />
      <Barro>
        {alto > 4 && <Cobrinha x1={x} y1={y} x2={x + venta} y2={y - alto} grossura={tam * 0.07} cor="verdeEscuro" />}
        {folha(1, 0.4, 0.3)}
        {folha(-1, 0.62, 0.42)}
        {folha(1, 0.85, 0.55)}
        {p > 0.75 && <Bola x={x + venta} y={y - alto - tam * 0.04} r={tam * 0.1 * ramp(p, 0.75, 1, elastico)} cor="rosa" />}
      </Barro>
      <Barro>
        <Bola x={x} y={y + tam * 0.02} r={tam * 0.4} ry={tam * 0.1} cor="terra" />
      </Barro>
    </>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const chao = A * CHAO;
  return (
    <Tela>
      <Sombra x={L / 2} y={chao} largura={L * 0.7} />
      <Molde x={L / 2} y={A * 0.3} t={t} dur={dur}>
        <Barro>
          <Letra x={L / 2} y={A * 0.3} tamanho={150} cor="laranja">
            O ciclo
          </Letra>
        </Barro>
      </Molde>
      <Molde x={L / 2} y={A * 0.3 + 170 * u} t={t} de={0.25} dur={dur}>
        <Barro>
          <Letra x={L / 2} y={A * 0.3 + 170 * u} tamanho={150} cor="azul">
            da água
          </Letra>
        </Barro>
      </Molde>
      <Molde x={L / 2} y={chao} t={t} de={0.5} dur={dur}>
        <Barro>
          <Bola x={L * 0.5} y={chao - 60 * u} r={56 * u} ry={60 * u} cor="celeste" />
        </Barro>
      </Molde>
    </Tela>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A} = useTela();
  const aquece = ramp(t, 0.9, 2.2);
  return (
    <Tela>
      <Molde x={L * 0.6} y={A * CHAO} t={t} dur={dur}>
        <Sol x={L * 0.6} y={A * 0.2} tam={170 * (1 + aquece * 0.12) * (L / 1080)} t={t} chao={0.44} />
      </Molde>
      <Molde x={L / 2} y={A * CHAO} t={t} de={0.2} dur={dur}>
        <Mar y={A * 0.46} t={t} />
        {/* o mar esquentando: bolhinhas sobem da superfície */}
        <Barro>
          {Array.from({length: 6}, (_, i) => {
            const fase = (t * 0.7 + i / 6) % 1;
            return aquece > 0 ? <Bola key={i} x={L * (0.15 + i * 0.14)} y={A * (0.45 - fase * 0.07)} r={(18 + 10 * (1 - fase)) * (L / 1080) * aquece} cor="celeste" /> : null;
          })}
        </Barro>
      </Molde>
    </Tela>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const junta = ramp(t, 0.6, 2.2, chega);
  return (
    <Tela>
      <Molde x={L / 2} y={A * CHAO} t={t} dur={dur}>
        <Mar y={A * 0.5} t={t} />
      </Molde>
      {/* bolinhas de vapor sobem e se juntam no lugar da nuvem */}
      <Barro>
        {Array.from({length: 7}, (_, i) => {
          const sobe = ramp(t, i * 0.12, 1.2 + i * 0.12, chega);
          const x0 = L * (0.2 + i * 0.1);
          const xs = x0 + (L * 0.5 - x0) * junta * 0.6;
          const ys = A * (0.49 - sobe * 0.27);
          return sobe > 0 && junta < 0.98 ? <Bola key={i} x={xs} y={ys} r={(18 + 10 * sobe) * u * (1 - junta * 0.6)} cor="celeste" /> : null;
        })}
      </Barro>
      <Molde x={L / 2} y={A * 0.3} t={t} de={0.9} dur={dur}>
        <Nuvem x={L / 2} y={A * 0.2} tam={(300 + junta * 160) * u} t={t} sombra={false} />
      </Molde>
    </Tela>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const pesa = ramp(t, 0.3, 1.1);
  return (
    <Tela>
      <Sombra x={L / 2} y={A * CHAO} largura={L * 0.7} forca={0.6} />
      <Chuva x={L / 2} y={A * 0.27} largura={L * 0.5} altura={A * 0.29} t={t} forca={ramp(t, 0.8, 1.8)} />
      <Molde x={L / 2} y={A * 0.32} t={t} dur={dur}>
        <Nuvem x={L / 2} y={A * (0.17 + pesa * 0.03)} tam={520 * u} t={t} cor="cinza" sombra={false} />
        <g opacity={1 - pesa}>
          <Nuvem x={L / 2} y={A * (0.17 + pesa * 0.03)} tam={520 * u} t={t} cor="branco" sombra={false} />
        </g>
      </Molde>
    </Tela>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <Tela>
      <Chuva x={L * 0.33} y={A * 0.2} largura={L * 0.3} altura={A * 0.33} t={t} pingos={5} />
      <Nuvem x={L * 0.33} y={A * 0.13} tam={330 * u} t={t} cor="cinza" chao={CHAO} />
      <Sol x={L * 0.76} y={A * 0.14} tam={100 * u} t={t} chao={CHAO} />
      <Molde x={L * 0.58} y={A * CHAO} t={t} de={0.1}>
        <Planta x={L * 0.58} y={A * 0.55} tam={330 * u} p={ramp(t, 0.4, 2.8)} t={t} />
      </Molde>
    </Tela>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, já modelado em massinha: sem legenda nesse trecho
    semLegenda={[[0, FALA_EXEMPLO.frases[1].s]]}
    cenas={cenasPorFrase(FALA_EXEMPLO, [
      [0, 0, Titulo, 0],
      [1, 1, SolEMar, 0.15],
      [2, 2, VaporENuvem, 0.15],
      [3, 3, NuvemEChuva, 0.15],
      [4, 4, ChuvaEPlanta, 0.15],
    ])}
  />
);
