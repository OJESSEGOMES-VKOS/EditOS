// ESTILO: Vidro 3D
// Objetos de vidro fosco e translúcido flutuando num fundo limpo, com cara de
// app premium: o que está atrás do vidro aparece borrado e deslocado (a refração),
// a borda pega luz em cima e escurece embaixo (a espessura), um brilho corre na
// superfície e a sombra no chão sai colorida. Tudo feito no próprio motor, sem
// programa de 3D. Bom pra tecnologia, produto, dado e explicação moderna.
//
// Este arquivo segue o molde do giz:
//   1. `tema`      cores, fundo (as luzes coloridas) e legenda
//   2. as peças    o vidro, o cartão de vidro, o texto, a entrada e a saída em foco
//   3. os desenhos Sol, Nuvem, Chuva, Mar e Planta em vidro
//   4. `Exemplo`   o ciclo da água contado neste estilo
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarManrope} from '@remotion/google-fonts/Manrope';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, caminho, cenasPorFrase, chega, elastico, ramp, useTela} from '../../kit';

const {fontFamily: LETRA} = carregarManrope('normal', {weights: ['600', '800'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As tintas do vidro: cada objeto é um vidro tingido de uma destas. */
export const COR = {
  ambar: '#ffb020',
  laranja: '#ff7a3d',
  azul: '#3d7bff',
  ciano: '#35c8ff',
  violeta: '#8a5cff',
  verde: '#2fcf8a',
  rosa: '#ff5c9a',
  gelo: '#dfe8ff',
  tinta: '#1d2340',
} as const;
export type CorVidro = keyof typeof COR;

/** As luzes coloridas atrás de tudo. O vidro mostra estas mesmas luzes, borradas e deslocadas. */
const Luzes: React.FC<{t: number; borrao: string}> = ({t, borrao}) => {
  const {L, A} = useTela();
  const luzes: [number, number, number, string][] = [
    [0.2, 0.22, 0.42, '#7d9bff'],
    [0.85, 0.36, 0.38, '#b48cff'],
    [0.4, 0.55, 0.36, '#ffb79a'],
    [0.75, 0.08, 0.26, '#7fe3ff'],
  ];
  return (
    <g filter={`url(#${borrao})`}>
      {luzes.map(([x, y, r, c], i) => (
        <circle key={i} cx={L * x + Math.sin(t * 0.35 + i * 2) * L * 0.06} cy={A * y + Math.cos(t * 0.3 + i) * A * 0.03} r={L * r} fill={c} opacity={0.55} />
      ))}
    </g>
  );
};

/** O fundo: branco-gelo limpo, com as luzes coloridas desfocadas passando devagar. */
const Fundo: React.FC<{t: number}> = ({t}) => {
  const {u} = useTela();
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #f3f5fb 0%, #eceff8 60%, #e6e9f5 100%)'}}>
      <Tela>
        <defs>
          <filter id="vidro-luz" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={110 * u} />
          </filter>
          <filter id="vidro-fosco" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={150 * u} />
          </filter>
          <filter id="vidro-sombra" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={26 * u} />
          </filter>
          <filter id="vidro-macio" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={7 * u} />
          </filter>
          <filter id="vidro-ponto" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation={10 * u} />
          </filter>
          {/* o brilho que corre na superfície: claro no alto à esquerda, some no meio */}
          <linearGradient id="vidro-brilho" x1="0" y1="0" x2="0.7" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity={0.75} />
            <stop offset="0.45" stopColor="#ffffff" stopOpacity={0.12} />
            <stop offset="1" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
          {/* o aro: a borda acende em cima e apaga embaixo */}
          <linearGradient id="vidro-aro" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity={1} />
            <stop offset="0.6" stopColor="#ffffff" stopOpacity={0.25} />
            <stop offset="1" stopColor="#ffffff" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <Luzes t={t} borrao="vidro-luz" />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'vidro-3d',
  nome: 'Vidro 3D',
  fundo: '#eceff8',
  tinta: COR.tinta,
  acento: '#4b5cff',
  legenda: {
    fonte: LETRA,
    peso: 800,
    tamanho: 70,
    cor: COR.tinta,
    destaque: '#4b5cff',
    sombra: '0 0 18px rgba(255,255,255,0.95), 0 0 6px rgba(255,255,255,0.95), 0 2px 0 rgba(255,255,255,0.9)',
    altura: 0.73,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/**
 * Um objeto de vidro. `d` é o contorno (caminho SVG em coordenadas da tela), (cx, cy) o centro e `tam` o tamanho
 * aproximado (pra posicionar brilho e sombra). Por dentro aparecem as luzes do fundo, borradas e deslocadas.
 * `chao` (altura em px) liga a sombra colorida embaixo; `t` é o segundo do VÍDEO (tv), pra refração bater com o fundo.
 */
export const Vidro: React.FC<{
  id: string;
  d: string;
  cx: number;
  cy: number;
  tam: number;
  cor: CorVidro;
  t: number;
  chao?: number;
  opacidade?: number;
}> = ({id, d, cx, cy, tam, cor, t, chao, opacidade = 1}) => {
  const {u} = useTela();
  if (opacidade <= 0) return null;
  const c = COR[cor];
  const corte = `vidro-c-${id}`;
  // a refração: o que está atrás aparece ampliado e puxado pro centro do objeto
  const lente = `translate(${cx} ${cy}) scale(1.35) translate(${-cx - tam * 0.12} ${-cy - tam * 0.18})`;
  return (
    <g opacity={opacidade}>
      {chao !== undefined && (
        <ellipse cx={cx} cy={chao} rx={tam * 0.5} ry={tam * 0.09} fill={c} opacity={0.35} filter="url(#vidro-sombra)" />
      )}
      {/* a sombra colorida que o vidro joga logo atrás de si */}
      <path d={d} fill={c} opacity={0.22} transform={`translate(0 ${tam * 0.1})`} filter="url(#vidro-sombra)" />
      <clipPath id={corte}>
        <path d={d} />
      </clipPath>
      <g clipPath={`url(#${corte})`}>
        <rect x={cx - tam * 2} y={cy - tam * 2} width={tam * 4} height={tam * 4} fill="#ffffff" opacity={0.3} />
        <g transform={lente}>
          <Luzes t={t} borrao="vidro-fosco" />
        </g>
        <path d={d} fill={c} opacity={0.55} />
        <path d={d} fill="url(#vidro-brilho)" />
        {/* a espessura: luz na borda de cima, tinta escura na borda de baixo */}
        <path d={d} fill="none" stroke="#ffffff" strokeWidth={14 * u} opacity={0.75} transform={`translate(${4 * u} ${6 * u})`} filter="url(#vidro-macio)" />
        <path d={d} fill="none" stroke={c} strokeWidth={22 * u} opacity={0.55} transform={`translate(${-5 * u} ${-8 * u})`} filter="url(#vidro-macio)" />
        {/* o ponto de brilho da luz do estúdio */}
        <ellipse cx={cx - tam * 0.2} cy={cy - tam * 0.22} rx={tam * 0.13} ry={tam * 0.06} fill="#ffffff" opacity={0.85} filter="url(#vidro-ponto)" transform={`rotate(-30 ${cx - tam * 0.2} ${cy - tam * 0.22})`} />
      </g>
      <path d={d} fill="none" stroke="url(#vidro-aro)" strokeWidth={3 * u} />
    </g>
  );
};

/** Texto do estilo: Manrope grossa, tinta azul-noite, com um halo branco pra ler em cima das luzes. Fica dentro da <Tela>. */
export const Texto: React.FC<{x: number; y: number; children: string; tamanho?: number; p?: number; cor?: string; peso?: number}> = ({
  x,
  y,
  children,
  tamanho = 96,
  p = 1,
  cor = COR.tinta,
  peso = 800,
}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  return (
    <text
      x={x}
      y={y + (1 - ramp(p, 0, 1, chega)) * 30 * u}
      opacity={ramp(p, 0, 0.6)}
      textAnchor="middle"
      fontFamily={LETRA}
      fontWeight={peso}
      fontSize={tamanho * u}
      letterSpacing={-1.5 * u}
      fill={cor}
    >
      {children}
    </text>
  );
};

/** O cartão de vidro (o painel de app): um retângulo de cantos redondos em vidro gelo, pra pôr texto ou ícone em cima. */
export const Cartao: React.FC<{id: string; cx: number; cy: number; largura: number; altura: number; t: number; cor?: CorVidro}> = ({
  id,
  cx,
  cy,
  largura,
  altura,
  t,
  cor = 'gelo',
}) => {
  const r = Math.min(largura, altura) * 0.22;
  const x = cx - largura / 2;
  const y = cy - altura / 2;
  const d = `M${x + r} ${y}H${x + largura - r}A${r} ${r} 0 0 1 ${x + largura} ${y + r}V${y + altura - r}A${r} ${r} 0 0 1 ${x + largura - r} ${y + altura}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + altura - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  return <Vidro id={id} d={d} cx={cx} cy={cy} tam={Math.min(largura, altura) * 1.4} cor={cor} t={t} />;
};

/** Flutuar: o vidro sobe e desce devagar, cada um no seu ritmo. Devolve o deslocamento em px. */
export const flutua = (t: number, semente: number, amplitude: number) => balanco(t, 0.45, semente) * amplitude;

/**
 * A entrada e a saída: a cena chega saindo do desfoque e crescendo um pouco, e sai voltando pro desfoque
 * (como a câmera trocando o foco). Envolva o conteúdo da cena.
 */
export const Foco: React.FC<{t: number; dur: number; children: React.ReactNode; primeira?: boolean; ultima?: boolean}> = ({t, dur, children, primeira, ultima}) => {
  const {u} = useTela();
  const entra = primeira ? 1 : ramp(t, 0, 0.55, chega);
  const sai = ultima ? 0 : ramp(t, dur - 0.45, dur);
  const borrado = (1 - entra) * 26 + sai * 26;
  return (
    <AbsoluteFill
      style={{
        filter: borrado > 0.3 ? `blur(${borrado * u}px)` : undefined,
        opacity: Math.min(entra * 1.4, 1 - sai),
        transform: `scale(${0.94 + entra * 0.06 + sai * 0.05})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Todo desenho é um contorno passado pro <Vidro>. Formas cheias e arredondadas funcionam
// melhor: o vidro precisa de área pra mostrar a refração.

const circuloD = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`;
const gotaD = (x: number, y: number, r: number) =>
  `M${x} ${y - r * 1.8}C${x + r * 0.5} ${y - r} ${x + r} ${y - r * 0.2} ${x + r} ${y + r * 0.2}A${r} ${r} 0 0 1 ${x - r} ${y + r * 0.2}C${x - r} ${y - r * 0.2} ${x - r * 0.5} ${y - r} ${x} ${y - r * 1.8}Z`;

type Desenho = {x: number; y: number; tam?: number; t: number; chao?: number};

/** O sol: disco de vidro âmbar com um anel de vidro laranja que gira devagar em volta. */
export const Sol: React.FC<Desenho> = ({x, y, tam = 260, t, chao}) => {
  const yy = y + flutua(t, 1, tam * 0.05);
  const n = 10;
  return (
    <>
      {Array.from({length: n}, (_, i) => {
        const a = (i / n) * Math.PI * 2 + t * 0.25;
        const px = x + Math.cos(a) * tam * 0.72;
        const py = yy + Math.sin(a) * tam * 0.72;
        return <Vidro key={i} id={`sol-raio${i}`} d={circuloD(px, py, tam * 0.07)} cx={px} cy={py} tam={tam * 0.14} cor="laranja" t={t} />;
      })}
      <Vidro id="sol" d={circuloD(x, yy, tam * 0.48)} cx={x} cy={yy} tam={tam} cor="ambar" t={t} chao={chao} />
    </>
  );
};

/** A nuvem: um contorno fofo de vidro gelo (ou azul, quando carregada). */
export const Nuvem: React.FC<Desenho & {cor?: CorVidro; id?: string; opacidade?: number}> = ({x, y, tam = 420, t, chao, cor = 'gelo', id = 'nuvem', opacidade}) => {
  const yy = y + flutua(t, 3, tam * 0.025);
  const w = tam;
  const h = tam * 0.42;
  const pontos: Ponto[] = [
    [x - w * 0.5, yy + h * 0.42],
    [x - w * 0.54, yy + h * 0.02],
    [x - w * 0.32, yy - h * 0.24],
    [x - w * 0.14, yy - h * 0.66],
    [x + w * 0.1, yy - h * 0.76],
    [x + w * 0.26, yy - h * 0.38],
    [x + w * 0.46, yy - h * 0.28],
    [x + w * 0.56, yy + h * 0.1],
    [x + w * 0.46, yy + h * 0.44],
  ];
  return <Vidro id={id} d={caminho(pontos, true)} cx={x} cy={yy} tam={tam * 0.75} cor={cor} t={t} chao={chao} opacidade={opacidade} />;
};

/** Gotas de vidro ciano caindo. `forca` de 0 a 1 liga a chuva aos poucos. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; gotas?: number}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  gotas = 8,
}) => {
  const {u} = useTela();
  const r = 20 * u;
  return (
    <>
      {Array.from({length: gotas}, (_, i) => {
        if (i / gotas > forca) return null;
        const fase = (t * (0.7 + acaso(`vid-v${i}`) * 0.35) + acaso(`vid-f${i}`)) % 1;
        const gx = x - largura / 2 + ((i + 0.5) / gotas) * largura + (acaso(`vid-x${i}`) - 0.5) * largura * 0.06;
        const gy = y + fase * altura;
        return (
          <Vidro key={i} id={`gota${i}`} d={gotaD(gx, gy, r)} cx={gx} cy={gy} tam={r * 3} cor="ciano" t={t} opacidade={Math.min(1, (1 - fase) * 5, fase * 8)} />
        );
      })}
    </>
  );
};

/** O mar: uma placa de vidro azul com a crista em onda, larga e grossa. */
export const Mar: React.FC<{y: number; t: number; altura?: number; id?: string}> = ({y, t, altura, id = 'mar'}) => {
  const {L, A, u} = useTela();
  const h = altura ?? A * 0.11;
  const x0 = L * 0.08;
  const x1 = L * 0.92;
  const r = 40 * u;
  let d = `M${x0} ${y + h - r}V${y}`;
  for (let x = x0; x <= x1; x += 20 * u) d += `L${x} ${y + Math.sin((x - x0) / (85 * u) + t * 1.6) * 18 * u}`;
  d += `L${x1} ${y + h - r}Q${x1} ${y + h} ${x1 - r} ${y + h}H${x0 + r}Q${x0} ${y + h} ${x0} ${y + h - r}Z`;
  return <Vidro id={id} d={d} cx={L / 2} cy={y + h / 2} tam={h * 2.4} cor="azul" t={t} chao={y + h + 40 * u} />;
};

/** Uma planta de vidro verde: caule e folhas que se abrem, sobre um vaso de vidro gelo. `p` de 0 a 1. */
export const Planta: React.FC<Desenho & {p: number}> = ({x, y, tam = 340, p, t}) => {
  const {u} = useTela();
  const alto = tam * ramp(p, 0, 0.6, chega);
  const venta = balanco(t, 0.7) * tam * 0.03;
  const folha = (lado: 1 | -1, em: number, de: number, i: number) => {
    const abre = ramp(p, de, de + 0.35, elastico);
    if (abre <= 0) return null;
    const bx = x + venta * em;
    const by = y - alto * em;
    const c = tam * 0.3 * abre;
    const pts: Ponto[] = [
      [bx, by],
      [bx + lado * c * 0.45, by - c * 0.42],
      [bx + lado * c, by - c * 0.3],
      [bx + lado * c * 0.6, by + c * 0.08],
    ];
    return <Vidro key={i} id={`folha${i}`} d={caminho(pts, true)} cx={bx + lado * c * 0.5} cy={by - c * 0.15} tam={c} cor="verde" t={t} />;
  };
  const vaso = `M${x - tam * 0.22} ${y}H${x + tam * 0.22}L${x + tam * 0.16} ${y + tam * 0.24}Q${x + tam * 0.15} ${y + tam * 0.28} ${x + tam * 0.1} ${y + tam * 0.28}H${x - tam * 0.1}Q${x - tam * 0.15} ${y + tam * 0.28} ${x - tam * 0.16} ${y + tam * 0.24}Z`;
  return (
    <>
      {alto > 4 && (
        <Vidro
          id="caule"
          d={`M${x - 9 * u} ${y}L${x + venta - 9 * u} ${y - alto}L${x + venta + 9 * u} ${y - alto}L${x + 9 * u} ${y}Z`}
          cx={x}
          cy={y - alto / 2}
          tam={tam * 0.2}
          cor="verde"
          t={t}
        />
      )}
      {folha(1, 0.38, 0.3, 0)}
      {folha(-1, 0.62, 0.42, 1)}
      {folha(1, 0.86, 0.55, 2)}
      {p > 0.8 && <Vidro id="flor" d={circuloD(x + venta, y - alto - 14 * u, tam * 0.09 * ramp(p, 0.8, 1, elastico))} cx={x + venta} cy={y - alto - 14 * u} tam={tam * 0.2} cor="rosa" t={t} />}
      <Vidro id="vaso" d={vaso} cx={x} cy={y + tam * 0.14} tam={tam * 0.5} cor="gelo" t={t} chao={y + tam * 0.32} />
    </>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, dur, tv}) => {
  const {L, A, u} = useTela();
  const fy = flutua(t, 5, 10 * u);
  return (
    <Foco t={t} dur={dur} primeira>
      <Tela>
        <Sol x={L * 0.72} y={A * 0.14} tam={210 * u} t={tv} />
        <Cartao id="titulo" cx={L / 2} cy={A * 0.33 + fy} largura={L * 0.8} altura={340 * u} t={tv} />
        <Texto x={L / 2} y={A * 0.33 + fy - 18 * u} tamanho={118} p={ramp(t, 0.1, 0.8)}>
          O ciclo
        </Texto>
        <Texto x={L / 2} y={A * 0.33 + fy + 110 * u} tamanho={118} p={ramp(t, 0.3, 1)} cor="#3d63ff">
          da água
        </Texto>
        <Mar y={A * 0.47} t={tv} altura={A * 0.08} />
      </Tela>
    </Foco>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur, tv}) => {
  const {L, A, u} = useTela();
  const aquece = ramp(t, 0.8, 2.2);
  return (
    <Foco t={t} dur={dur}>
      <Tela>
        <Sol x={L * 0.62} y={A * 0.19} tam={(250 + aquece * 30) * u} t={tv} />
        {/* o calor descendo: três feixes de vidro laranja */}
        {[0, 1, 2].map((i) => {
          const q = ramp(t, 0.5 + i * 0.2, 1.3 + i * 0.2, chega);
          const x0 = L * (0.5 - i * 0.1);
          const y0 = A * 0.3;
          const comp = A * 0.11 * q;
          return q > 0 ? (
            <Vidro
              key={i}
              id={`calor${i}`}
              d={`M${x0 - 10 * u} ${y0}L${x0 + 10 * u} ${y0}L${x0 - comp * 0.35 + 6 * u} ${y0 + comp}L${x0 - comp * 0.35 - 6 * u} ${y0 + comp}Z`}
              cx={x0}
              cy={y0 + comp / 2}
              tam={80 * u}
              cor="laranja"
              t={tv}
            />
          ) : null;
        })}
        <Mar y={A * 0.45} t={tv} />
      </Tela>
    </Foco>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur, tv}) => {
  const {L, A, u} = useTela();
  const junta = ramp(t, 0.5, 2, chega);
  return (
    <Foco t={t} dur={dur}>
      <Tela>
        <Mar y={A * 0.48} t={tv} />
        {/* bolhas de vapor de vidro sobem e se juntam na nuvem */}
        {Array.from({length: 6}, (_, i) => {
          const sobe = ramp(t, i * 0.1, 1.1 + i * 0.1, chega);
          const x0 = L * (0.22 + i * 0.11);
          const bx = x0 + (L / 2 - x0) * junta * 0.7;
          const by = A * (0.46 - sobe * 0.22);
          const r = (24 + 8 * sobe) * u * (1 - junta * 0.7);
          return sobe > 0 && junta < 0.97 ? <Vidro key={i} id={`bolha${i}`} d={circuloD(bx, by, r)} cx={bx} cy={by} tam={r * 2} cor="ciano" t={tv} /> : null;
        })}
        <Nuvem x={L / 2} y={A * 0.19} tam={(280 + junta * 220) * u} t={tv} opacidade={ramp(t, 0.6, 1.3)} />
      </Tela>
    </Foco>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur, tv}) => {
  const {L, A, u} = useTela();
  const pesa = ramp(t, 0.3, 1.1);
  return (
    <Foco t={t} dur={dur}>
      <Tela>
        <Chuva x={L / 2} y={A * 0.28} largura={L * 0.56} altura={A * 0.28} t={tv} forca={ramp(t, 0.7, 1.7)} />
        <Nuvem id="nuvem-azul" x={L / 2} y={A * (0.17 + pesa * 0.02)} tam={560 * u} t={tv} cor="azul" chao={A * 0.6} />
        <Nuvem id="nuvem-gelo" x={L / 2} y={A * (0.17 + pesa * 0.02)} tam={560 * u} t={tv} opacidade={1 - pesa} />
      </Tela>
    </Foco>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t, dur, tv}) => {
  const {L, A, u} = useTela();
  return (
    <Foco t={t} dur={dur} ultima>
      <Tela>
        <Chuva x={L * 0.32} y={A * 0.2} largura={L * 0.3} altura={A * 0.3} t={tv} gotas={4} />
        <Nuvem x={L * 0.32} y={A * 0.13} tam={340 * u} t={tv} cor="azul" />
        <Sol x={L * 0.76} y={A * 0.13} tam={150 * u} t={tv} />
        <Planta x={L * 0.6} y={A * 0.5} tam={330 * u} p={ramp(t, 0.3, 2.6)} t={tv} />
      </Tela>
    </Foco>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, já escrito no cartão de vidro: sem legenda nesse trecho
    semLegenda={[[0, FALA_EXEMPLO.frases[1].s]]}
    cenas={cenasPorFrase(FALA_EXEMPLO, [
      [0, 0, Titulo, 0],
      [1, 1, SolEMar, 0.2],
      [2, 2, VaporENuvem, 0.2],
      [3, 3, NuvemEChuva, 0.2],
      [4, 4, ChuvaEPlanta, 0.2],
    ])}
  />
);
