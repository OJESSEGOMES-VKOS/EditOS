// ESTILO: Mapa de rota
// Um mapa antigo de papel envelhecido, desenhado a pena. A explicação vira uma
// viagem: cada passo é uma parada no mapa, a câmera segue a rota pontilhada até
// lá, a tinta se espalha em aguada e o desenho da parada é traçado a pena.
// Bom pra processo em etapas, rota, linha do tempo e "como uma coisa leva à outra".
//
// As quatro partes, como no molde:
//   1. `tema`      cores, fundo e legenda
//   2. as peças    Pena, Aguada, Rotulo, Rota, Parada, Rosa e a Viagem (a câmera)
//   3. os desenhos Sol, Nuvem, Chuva, Mar e Planta a pena
//   4. `Exemplo`   o ciclo da água como uma rota de quatro paradas
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarCinzel} from '@remotion/google-fonts/Cinzel';
import {loadFont as carregarGaramond} from '@remotion/google-fonts/EBGaramond';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {Camera, FALA_EXEMPLO, Filme, Tela, Traco, acaso, balanco, caminho, cenasPorFrase, chega, circulo, emFila, ramp, tremer, useTela} from '../../kit';

const {fontFamily: TITULO} = carregarCinzel('normal', {weights: ['600', '700'], subsets: ['latin', 'latin-ext']});
const {fontFamily: LETRA} = carregarGaramond('italic', {weights: ['600'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** Tinta e aguadas do mapa: marrom de pena, vermelho de rota e lavados claros. */
export const COR = {
  tinta: '#3a2414',
  vermelho: '#9a2f1e',
  sepia: '#a9773d',
  azul: '#5d8aa0',
  verde: '#6f8a4a',
  ocre: '#d19a3a',
  papel: '#ead8b0',
} as const;
export type CorMapa = keyof typeof COR;

/** O papel: pergaminho com manchas, fibras e bordas queimadas. Fica parado; o mapa anda por cima. */
const Fundo: React.FC<{t: number}> = () => {
  const {L, A} = useTela();
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #f1e2bd 0%, #e2c994 60%, #b98f55 100%)'}}>
      <Tela>
        <defs>
          <filter id="mapa-papel">
            <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves={4} seed={3} />
            <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.28  0 0 0 0 0.1  0 0 0 0.22 0" />
          </filter>
          <filter id="mapa-fibra">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={9} />
            <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0.12 0" />
          </filter>
          <radialGradient id="mapa-borda" cx="50%" cy="50%" r="72%">
            <stop offset="70%" stopColor="#5a3416" stopOpacity={0} />
            <stop offset="100%" stopColor="#3a1e08" stopOpacity={0.75} />
          </radialGradient>
        </defs>
        <rect width={L} height={A} filter="url(#mapa-papel)" />
        <rect width={L} height={A} filter="url(#mapa-fibra)" />
        <rect width={L} height={A} fill="url(#mapa-borda)" />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'mapa',
  nome: 'Mapa de rota',
  fundo: '#e2c994',
  tinta: COR.tinta,
  acento: COR.vermelho,
  legenda: {
    fonte: LETRA,
    peso: 600,
    tamanho: 66,
    cor: '#2a180a',
    destaque: COR.vermelho,
    sombra: '0 0 10px #f3e6c4, 0 0 22px #f3e6c4, 0 0 4px #f3e6c4',
    altura: 0.8,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** Um traço de pena que se desenha: fino, marrom, com tremor leve de mão. */
export const Pena: React.FC<{pontos: Ponto[]; p: number; cor?: CorMapa; grossura?: number; fechado?: boolean; reto?: boolean; id?: string}> = ({
  pontos,
  p,
  cor = 'tinta',
  grossura = 5,
  fechado = false,
  reto = false,
  id = `${pontos[0][0]}-${pontos[0][1]}-${pontos.length}`,
}) => {
  const {u} = useTela();
  const mao = React.useMemo(() => tremer(pontos, id, 1.6 * u), [pontos, id, u]);
  return <Traco d={caminho(mao, fechado, reto)} p={p} stroke={COR[cor]} strokeWidth={grossura * u} />;
};

/** A aguada: tinta diluída que se espalha num borrão de bordas irregulares. Vem antes do traço. */
export const Aguada: React.FC<{x: number; y: number; r: number; p: number; cor?: CorMapa; id: string}> = ({x, y, r, p, cor = 'sepia', id}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  return (
    <>
      <filter id={`mapa-aguada-${id}`} x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={3} seed={Math.floor(acaso(id) * 90)} />
        <feDisplacementMap in="SourceGraphic" scale={60 * u} />
      </filter>
      <circle cx={x} cy={y} r={r * chega(Math.min(1, p))} fill={COR[cor]} opacity={0.28} filter={`url(#mapa-aguada-${id})`} />
      <circle cx={x} cy={y} r={r * 0.6 * chega(Math.min(1, p))} fill={COR[cor]} opacity={0.18} filter={`url(#mapa-aguada-${id})`} />
    </>
  );
};

/** Letreiro de mapa: Cinzel em caixa alta pros nomes, Garamond itálico pras notas. Surge de baixo pra cima. */
export const Rotulo: React.FC<{x: number; y: number; children: string; p: number; tamanho?: number; cor?: CorMapa; nota?: boolean}> = ({
  x,
  y,
  children,
  p,
  tamanho = 48,
  cor = 'tinta',
  nota = false,
}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  return (
    <text
      x={x}
      y={y + (1 - chega(Math.min(1, p))) * 14 * u}
      opacity={Math.min(1, p * 1.5)}
      textAnchor="middle"
      fontFamily={nota ? LETRA : TITULO}
      fontWeight={nota ? 600 : 700}
      fontSize={tamanho * u}
      letterSpacing={nota ? 0 : 4 * u}
      fill={COR[cor]}
    >
      {nota ? children : children.toUpperCase()}
    </text>
  );
};

/** A rota pontilhada entre paradas, com o marcador vermelho na ponta. `p` de 0 a 1 percorre a rota. */
export const Rota: React.FC<{pontos: Ponto[]; p: number}> = ({pontos, p}) => {
  const {u} = useTela();
  const d = caminho(pontos);
  return (
    <>
      <path d={d} fill="none" stroke={COR.vermelho} strokeOpacity={0.12} strokeWidth={6 * u} strokeDasharray={`${3 * u} ${16 * u}`} strokeLinecap="round" />
      <defs>
        <mask id="mapa-rota-mascara">
          <Traco d={d} p={p} stroke="#fff" strokeWidth={22 * u} />
        </mask>
      </defs>
      <path d={d} fill="none" stroke={COR.vermelho} strokeWidth={7 * u} strokeDasharray={`${4 * u} ${16 * u}`} strokeLinecap="round" mask="url(#mapa-rota-mascara)" />
    </>
  );
};

/** O marco de uma parada: um X vermelho dentro de um círculo a pena. */
export const Parada: React.FC<{x: number; y: number; p: number}> = ({x, y, p}) => {
  const {u} = useTela();
  const r = 26 * u;
  return (
    <>
      <Pena id={`marco${x}`} pontos={circulo(x, y, r)} fechado p={ramp(p, 0, 0.6)} grossura={4} />
      <Pena id={`xa${x}`} reto pontos={[[x - r * 0.5, y - r * 0.5], [x + r * 0.5, y + r * 0.5]]} p={ramp(p, 0.5, 0.8)} cor="vermelho" grossura={7} />
      <Pena id={`xb${x}`} reto pontos={[[x + r * 0.5, y - r * 0.5], [x - r * 0.5, y + r * 0.5]]} p={ramp(p, 0.7, 1)} cor="vermelho" grossura={7} />
    </>
  );
};

/** A rosa dos ventos: o enfeite que diz "isto é um mapa". */
export const Rosa: React.FC<{x: number; y: number; tam: number; p: number; t?: number}> = ({x, y, tam, p, t = 0}) => {
  const pontas = Array.from({length: 16}, (_, i): Ponto => {
    const a = -Math.PI / 2 + (i * Math.PI) / 8;
    const r = i % 4 === 0 ? tam : i % 2 === 0 ? tam * 0.6 : tam * 0.24;
    return [x + Math.cos(a) * r, y + Math.sin(a) * r];
  });
  return (
    <g transform={`rotate(${balanco(t, 0.2) * 3} ${x} ${y})`}>
      <Pena id="rosa-c1" pontos={circulo(x, y, tam * 0.95, tam * 0.95, 24)} fechado p={ramp(p, 0, 0.5)} grossura={3} />
      <Pena id="rosa-c2" pontos={circulo(x, y, tam * 0.8, tam * 0.8, 24)} fechado p={ramp(p, 0.1, 0.6)} grossura={2} />
      <Pena id="rosa" reto fechado pontos={pontas} p={ramp(p, 0.3, 1)} grossura={4} />
      <path d={`M${x},${y - tam} L${x + tam * 0.09},${y - tam * 0.24} L${x},${y} L${x - tam * 0.09},${y - tam * 0.24}Z`} fill={COR.vermelho} opacity={ramp(p, 0.7, 1)} />
    </g>
  );
};

/**
 * A Viagem: a transição do estilo. A câmera sai de uma parada e voa pela rota até a outra.
 * `de` e `ate` são pontos do mapa; `p` de 0 a 1 é o voo. Afasta no meio do caminho pra mostrar onde está.
 */
export const Viagem: React.FC<{de: Ponto; ate: Ponto; ini: number; fim: number; t: number; zoom?: number; children: React.ReactNode}> = ({
  de,
  ate,
  ini,
  fim,
  t,
  zoom = 1.75,
  children,
}) => {
  const meio = (ini + fim) / 2;
  return (
    <Camera
      t={t}
      chaves={[
        {t: ini, x: de[0], y: de[1], zoom},
        {t: meio, x: (de[0] + ate[0]) / 2, y: (de[1] + ate[1]) / 2, zoom: zoom * 0.72},
        {t: fim, x: ate[0], y: ate[1], zoom},
        {t: fim + 60, x: ate[0], y: ate[1], zoom: zoom * 1.06},
      ]}
    >
      {children}
    </Camera>
  );
};

// ---------- 3. os desenhos a pena ----------
// Todo desenho recebe o centro (x, y), o tamanho e `p` (0 a 1). Primeiro a aguada,
// depois o contorno a pena, depois as hachuras. Desenho novo segue o mesmo jeito.

type Desenho = {x: number; y: number; tam?: number; p: number};

/** Hachura a pena: riscos paralelos curtos, o "sombreado" de gravura. */
const Hachura: React.FC<{x: number; y: number; w: number; h: number; p: number; id: string; n?: number}> = ({x, y, w, h, p, id, n = 6}) => (
  <>
    {Array.from({length: n}, (_, i) => {
      const fx = x - w / 2 + (w * i) / (n - 1);
      return <Pena key={i} id={`${id}${i}`} reto pontos={[[fx, y - h / 2], [fx - h * 0.4, y + h / 2]]} p={emFila(p, 0, 1, i, n)} grossura={2.5} />;
    })}
  </>
);

export const Sol: React.FC<Desenho & {t?: number}> = ({x, y, tam = 120, p, t = 0}) => {
  const n = 14;
  return (
    <>
      <Aguada id="sol" x={x} y={y} r={tam * 1.1} p={ramp(p, 0, 0.4)} cor="ocre" />
      <Pena id="sol" pontos={circulo(x, y, tam * 0.45, tam * 0.45, 18)} fechado p={ramp(p, 0.2, 0.6)} />
      {Array.from({length: n}, (_, i) => {
        const a = (i / n) * Math.PI * 2 + t * 0.15;
        const r1 = tam * (i % 2 ? 0.85 : 1.05) * (1 + balanco(t, 1.2, i) * 0.05);
        const pts: Ponto[] = [
          [x + Math.cos(a) * tam * 0.58, y + Math.sin(a) * tam * 0.58],
          [x + Math.cos(a + 0.12) * tam * 0.75, y + Math.sin(a + 0.12) * tam * 0.75],
          [x + Math.cos(a) * r1, y + Math.sin(a) * r1],
        ];
        return <Pena key={i} id={`raio${i}`} pontos={pts} p={emFila(p, 0.5, 0.5, i, n)} grossura={3.5} />;
      })}
    </>
  );
};

export const Nuvem: React.FC<Desenho & {cor?: CorMapa}> = ({x, y, tam = 260, p, cor = 'azul'}) => {
  const w = tam;
  const h = tam * 0.4;
  const pontos: Ponto[] = [
    [x - w * 0.5, y + h * 0.45],
    [x - w * 0.52, y],
    [x - w * 0.3, y - h * 0.35],
    [x - w * 0.12, y - h * 0.8],
    [x + w * 0.12, y - h * 0.85],
    [x + w * 0.26, y - h * 0.4],
    [x + w * 0.46, y - h * 0.3],
    [x + w * 0.54, y + h * 0.15],
    [x + w * 0.44, y + h * 0.45],
  ];
  return (
    <>
      <Aguada id={`nuvem${x}`} x={x} y={y} r={tam * 0.42} p={ramp(p, 0, 0.4)} cor={cor} />
      <Pena id={`nuvem${x}`} pontos={pontos} fechado p={ramp(p, 0.2, 0.8)} />
      <Hachura id={`nh${x}`} x={x + w * 0.05} y={y + h * 0.28} w={w * 0.6} h={h * 0.25} p={ramp(p, 0.7, 1)} />
    </>
  );
};

/** Chuva a pena: riscos inclinados que caem sem parar. `forca` de 0 a 1 liga aos poucos. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; pingos?: number}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  pingos = 14,
}) => {
  const {u} = useTela();
  return (
    <>
      {Array.from({length: pingos}, (_, i) => {
        if (i / pingos > forca) return null;
        const fase = (t * (0.8 + acaso(`mv${i}`) * 0.4) + acaso(`mf${i}`)) % 1;
        const px = x - largura / 2 + acaso(`mx${i}`) * largura;
        const py = y + fase * altura;
        return <line key={i} x1={px} y1={py} x2={px - 8 * u} y2={py + 30 * u} stroke={COR.azul} strokeWidth={4 * u} strokeLinecap="round" opacity={1 - fase * 0.6} />;
      })}
    </>
  );
};

/** Mar de mapa antigo: ondinhas em fila, como os cartógrafos desenhavam a água. */
export const Mar: React.FC<{x: number; y: number; largura: number; p: number; t: number}> = ({x, y, largura, p, t}) => {
  const {u} = useTela();
  const linhas = 3;
  return (
    <>
      <Aguada id={`mar${x}`} x={x} y={y + 50 * u} r={largura * 0.5} p={ramp(p, 0, 0.4)} cor="azul" />
      {Array.from({length: linhas}, (_, k) => {
        const n = 7;
        const pts: Ponto[] = Array.from({length: n * 2 + 1}, (_, i) => [
          x - largura / 2 + (largura * i) / (n * 2) + (k % 2) * 20 * u,
          y + k * 44 * u + (i % 2 ? -12 * u : 0) + Math.sin(t * 1.5 + k) * 4 * u,
        ]);
        return <Pena key={k} id={`onda${x}${k}`} pontos={pts} p={emFila(p, 0.25, 0.75, k, linhas)} cor="tinta" grossura={4} />;
      })}
    </>
  );
};

/** Planta a pena: caule que sobe, folhas com nervura e uma aguada verde. */
export const Planta: React.FC<Desenho & {t?: number}> = ({x, y, tam = 260, p, t = 0}) => {
  const venta = balanco(t, 0.8) * tam * 0.03;
  const alto = tam * ramp(p, 0, 0.6, chega);
  const folha = (lado: 1 | -1, h: number, abre: number): Ponto[] => {
    const by = y - alto * h;
    const bx = x + venta * h;
    const c = tam * 0.32 * abre;
    return [[bx, by], [bx + lado * c * 0.5, by - c * 0.45], [bx + lado * c, by - c * 0.15], [bx + lado * c * 0.5, by + c * 0.12], [bx, by]];
  };
  return (
    <>
      <Aguada id="planta" x={x} y={y - tam * 0.5} r={tam * 0.45} p={ramp(p, 0.3, 0.8)} cor="verde" />
      <Pena id="caule" pontos={[[x, y], [x + venta * 0.4, y - alto * 0.5], [x + venta, y - alto]]} p={p > 0 ? 1 : 0} grossura={5} />
      {p > 0.3 && <Pena id="folhaE" pontos={folha(-1, 0.45, ramp(p, 0.3, 0.7, chega))} p={1} />}
      {p > 0.45 && <Pena id="folhaD" pontos={folha(1, 0.7, ramp(p, 0.45, 0.85, chega))} p={1} />}
      {p > 0.6 && <Pena id="broto" pontos={folha(-1, 0.98, ramp(p, 0.6, 1, chega) * 0.7)} p={1} />}
      <Pena id="chao" pontos={[[x - tam * 0.5, y], [x - tam * 0.1, y - 6], [x + tam * 0.5, y + 4]]} p={ramp(p, 0, 0.3)} grossura={4} />
    </>
  );
};

// ---------- 4. o exemplo: o ciclo da água como rota ----------
// O mapa é o mesmo nas cinco cenas; muda só onde a câmera está e o que já foi desenhado.
// Cada parada mora num ponto do mapa (em fração da tela).

const PARADAS: [number, number][] = [
  [0.5, 0.42], // título (o mapa inteiro)
  [0.3, 0.27], // sol e mar
  [0.7, 0.37], // nuvem
  [0.32, 0.56], // chuva
  [0.66, 0.7], // planta
];

/** O mapa inteiro. `feito[i]` de 0 a 1 diz quanto da parada i já foi desenhado; `rota` quanto da rota foi andado. */
const OMapa: React.FC<{feito: number[]; rota: number; t: number}> = ({feito, rota, t}) => {
  const {L, A, u} = useTela();
  const P = PARADAS.map(([fx, fy]): Ponto => [L * fx, A * fy]);
  const rotaPts: Ponto[] = [P[1], [L * 0.52, A * 0.24], P[2], [L * 0.58, A * 0.5], P[3], [L * 0.4, A * 0.68], P[4]];
  const passo = 120 * u;
  return (
    <Tela>
      {/* a grade de meridianos e o litoral: o mapa que existe por baixo de tudo */}
      <g stroke={COR.tinta} strokeOpacity={0.14} strokeWidth={2 * u}>
        {Array.from({length: Math.ceil(L / passo) + 1}, (_, i) => (
          <line key={`v${i}`} x1={i * passo} y1={0} x2={i * passo} y2={A} />
        ))}
        {Array.from({length: Math.ceil(A / passo) + 1}, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * passo} x2={L} y2={i * passo} />
        ))}
      </g>
      <Pena id="costa" pontos={[[0, A * 0.12], [L * 0.15, A * 0.16], [L * 0.1, A * 0.3], [L * 0.18, A * 0.42], [L * 0.08, A * 0.5], [0, A * 0.48]]} p={1} grossura={3} />
      <Pena id="costa2" pontos={[[L, A * 0.78], [L * 0.88, A * 0.82], [L * 0.92, A * 0.92], [L * 0.8, A]]} p={1} grossura={3} />
      <Rosa x={L * 0.84} y={A * 0.13} tam={95 * u} p={1} t={t} />
      <Rota pontos={rotaPts} p={rota} />
      {P.slice(1).map(([x, y], i) => (
        <Parada key={i} x={x} y={y + 150 * u} p={feito[i + 1] > 0 ? 1 : 0} />
      ))}
      {/* as ilustrações de cada parada */}
      <Sol x={P[1][0] + 60 * u} y={P[1][1] - 90 * u} tam={75 * u} p={ramp(feito[1], 0, 0.6)} t={t} />
      <Mar x={P[1][0]} y={P[1][1] + 50 * u} largura={300 * u} p={ramp(feito[1], 0.3, 1)} t={t} />
      <Nuvem x={P[2][0]} y={P[2][1]} tam={260 * u} p={feito[2]} />
      <Nuvem x={P[3][0]} y={P[3][1] - 60 * u} tam={240 * u} p={feito[3] > 0 ? 1 : 0} cor="azul" />
      {feito[3] > 0 && <Chuva x={P[3][0]} y={P[3][1] - 20 * u} largura={200 * u} altura={130 * u} t={t} forca={ramp(feito[3], 0.2, 0.8)} />}
      <Planta x={P[4][0]} y={P[4][1] + 110 * u} tam={220 * u} p={feito[4]} t={t} />
      {feito[1] > 0.6 && <Rotulo x={P[1][0]} y={P[1][1] + 210 * u} p={ramp(feito[1], 0.6, 1)} tamanho={34}>Mar quente</Rotulo>}
      {feito[2] > 0.6 && <Rotulo x={P[2][0]} y={P[2][1] + 210 * u} p={ramp(feito[2], 0.6, 1)} tamanho={34}>Nuvem</Rotulo>}
      {feito[3] > 0.6 && <Rotulo x={P[3][0]} y={P[3][1] + 210 * u} p={ramp(feito[3], 0.6, 1)} tamanho={34}>Chuva</Rotulo>}
      {feito[4] > 0.6 && <Rotulo x={P[4][0]} y={P[4][1] + 210 * u} p={ramp(feito[4], 0.6, 1)} tamanho={34}>Planta</Rotulo>}
    </Tela>
  );
};

/** As cinco cenas usam a mesma receita: voa até a parada `i` e desenha o que mora lá. */
const cenaDaParada = (i: number): React.FC<PropsCena> => ({t}) => {
  const {L, A, u} = useTela();
  const voo = 1.2;
  const feito = PARADAS.map((_, k) => (k < i ? 1 : k === i ? ramp(t, voo * 0.7, voo + 1.6) : 0));
  const rotaAte = [0, 0, 0.3, 0.62, 1][i];
  const rotaDe = [0, 0, 0, 0.3, 0.62][i];
  const de: Ponto = [L * PARADAS[i - 1][0], A * PARADAS[i - 1][1] + 60 * u];
  const ate: Ponto = [L * PARADAS[i][0], A * PARADAS[i][1] + 60 * u];
  return (
    <Viagem de={i === 1 ? [L / 2, A / 2] : de} ate={ate} ini={0} fim={voo} t={t} zoom={i === 1 ? 1.75 : 1.75}>
      <OMapa feito={feito} rota={i === 1 ? 0 : rotaDe + (rotaAte - rotaDe) * ramp(t, 0, voo)} t={t} />
    </Viagem>
  );
};

const Titulo: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const pc = ramp(t, 0, 0.4);
  return (
    <>
      <Camera t={t} chaves={[{t: 0, zoom: 1.08}, {t: 3, zoom: 1}]}>
        <OMapa feito={[1, 0, 0, 0, 0]} rota={0} t={t} />
      </Camera>
      <Tela>
        {/* a cártula: a moldura do título dos mapas antigos */}
        <rect x={L * 0.08} y={A * 0.38} width={L * 0.84} height={260 * u} fill="#f3e6c4" opacity={0.92 * pc} stroke={COR.tinta} strokeWidth={4 * u} />
        <rect x={L * 0.08 + 14 * u} y={A * 0.38 + 14 * u} width={L * 0.84 - 28 * u} height={232 * u} fill="none" stroke={COR.vermelho} strokeWidth={2 * u} opacity={pc} />
        <Rotulo x={L / 2} y={A * 0.38 + 125 * u} p={ramp(t, 0.1, 0.7)} tamanho={64}>O ciclo da água</Rotulo>
        <Rotulo x={L / 2} y={A * 0.38 + 210 * u} p={ramp(t, 0.5, 1.1)} tamanho={56} nota cor="vermelho">em quatro paradas</Rotulo>
      </Tela>
    </>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    semLegenda={[[0, FALA_EXEMPLO.frases[1].s]]}
    cenas={cenasPorFrase(FALA_EXEMPLO, [
      [0, 0, Titulo, 0],
      [1, 1, cenaDaParada(1), 0.4],
      [2, 2, cenaDaParada(2), 0],
      [3, 3, cenaDaParada(3), 0],
      [4, 4, cenaDaParada(4), 0],
    ])}
  />
);
