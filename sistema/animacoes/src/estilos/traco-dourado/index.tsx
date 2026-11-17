// ESTILO: Traço dourado
// Papel de arroz quente; tudo é pincelado em tinta preta de cerdas, e depois um
// fio de ouro com brilho costura a obra: contorna, atravessa, sublinha. Uma
// faísca corre pelo fio. A tinta é o desenho; o ouro é o que importa nele.
// A cena seguinte nasce por cima enquanto a anterior desbota.
//
// O pincel é o mesmo do estilo `nanquim` (importado de lá); a cara deste estilo é
// o fio de ouro, o papel mais quente, a ausência de aguada e de vermelho, e a letra.
//
//   1. `tema`      cores, fundo e legenda
//   2. as peças    Pincel (do nanquim), Fio, Mancha, Titulo, SeloOuro
//   3. os desenhos Sol, Nuvem, Chuva, Mar, Planta
//   4. `Exemplo`   o ciclo da água
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarCormorant} from '@remotion/google-fonts/CormorantGaramond';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, caminho, cenasPorFrase, chega, circulo, elastico, emFila, ramp, useTela} from '../../kit';
import {Pincel, amostrar} from '../nanquim';

export {Pincel};

const {fontFamily: CORMORANT} = carregarCormorant('normal', {weights: ['500', '700'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** Tinta quase preta, o papel de arroz e os tons do ouro (escuro, claro, faísca). */
export const COR = {
  tinta: '#14100c',
  papel: '#efe5cf',
  ouro: '#c8902a',
  ouroEscuro: '#a8741a',
  ouroClaro: '#f5d77a',
  faisca: '#fff6d6',
} as const;

/** O papel de arroz: creme quente, fibras curtas em todas as direções e o canto queimado de leve. */
const Fundo: React.FC<{t: number}> = () => {
  const {L, A, u} = useTela();
  const fibras = React.useMemo(
    () => Array.from({length: 700}, (_, i) => [acaso(`fx${i}`) * L, acaso(`fy${i}`) * A, (20 + acaso(`fl${i}`) * 60) * u, acaso(`fa${i}`) * Math.PI] as const),
    [L, A, u]
  );
  return (
    <AbsoluteFill style={{background: COR.papel}}>
      <Tela>
        <defs>
          <radialGradient id="traco-dourado-vinheta" cx="50%" cy="52%" r="75%">
            <stop offset="0.55" stopColor="#000" stopOpacity={0} />
            <stop offset="1" stopColor="#5a3c14" stopOpacity={0.3} />
          </radialGradient>
          <linearGradient id="traco-dourado-ouro" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={COR.ouroEscuro} />
            <stop offset="0.35" stopColor={COR.ouroClaro} />
            <stop offset="0.6" stopColor={COR.ouro} />
            <stop offset="1" stopColor="#ffe9a8" />
          </linearGradient>
          <filter id="traco-dourado-brilho" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={7 * u} />
          </filter>
          <filter id="traco-dourado-tinta" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} />
            <feDisplacementMap in="SourceGraphic" scale={3} />
          </filter>
        </defs>
        <g stroke="rgba(120,95,60,0.10)" strokeWidth={1.2 * u}>
          {fibras.map(([x, y, l, a], i) => (
            <line key={i} x1={x} y1={y} x2={x + Math.cos(a) * l} y2={y + Math.sin(a) * l} />
          ))}
        </g>
        <rect width={L} height={A} fill="url(#traco-dourado-vinheta)" />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'traco-dourado',
  nome: 'Traço dourado',
  fundo: COR.papel,
  tinta: COR.tinta,
  acento: COR.ouro,
  legenda: {
    fonte: CORMORANT,
    peso: 700,
    tamanho: 70,
    cor: COR.tinta,
    destaque: COR.ouroEscuro,
    sombra: `0 0 10px ${COR.papel}, 0 0 4px ${COR.papel}, 0 2px 0 ${COR.papel}`,
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** A camada de tinta: a borda bebe no papel. Todo `Pincel` vai dentro dela (o `Fio` fica fora, por cima). */
export const Tinta: React.FC<{children: React.ReactNode; opacity?: number}> = ({children, opacity = 1}) => (
  <g filter="url(#traco-dourado-tinta)" opacity={opacity}>
    {children}
  </g>
);

/**
 * O fio de ouro: uma linha fina com brilho que se desenha por cima da tinta. Na ponta que avança vai uma faísca;
 * quando o fio fica pronto, a faísca passa a correr por ele (`t` liga a corrida). `p` de 0 a 1.
 */
export const Fio: React.FC<{pontos: Ponto[]; p: number; t?: number; grossura?: number; fechado?: boolean}> = ({pontos, p, t = 0, grossura = 7, fechado = false}) => {
  const {u} = useTela();
  const pts = React.useMemo(() => amostrar(fechado ? [...pontos, pontos[0]] : pontos, 60), [pontos, fechado]);
  if (p <= 0) return null;
  const d = caminho(pts, false, true);
  const w = grossura * u;
  const k = p < 1 ? p : (t * 0.5) % 1;
  const [sx, sy] = pts[Math.min(pts.length - 1, Math.round(k * (pts.length - 1)))];
  const traco = {pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - p, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <g>
      <path d={d} {...traco} stroke={COR.ouro} strokeWidth={w * 3.2} opacity={0.6} filter="url(#traco-dourado-brilho)" />
      <path d={d} {...traco} stroke={COR.ouroEscuro} strokeWidth={w * 1.5} />
      <path d={d} {...traco} stroke="url(#traco-dourado-ouro)" strokeWidth={w} />
      <circle cx={sx} cy={sy} r={w * 3.2} fill={COR.ouroClaro} opacity={0.5} filter="url(#traco-dourado-brilho)" />
      <circle cx={sx} cy={sy} r={w * 1.3} fill={COR.faisca} />
    </g>
  );
};

/**
 * A mancha de tinta: uma forma cheia de nanquim que se espalha de baixo pra cima (silhueta de gente, de montanha,
 * de objeto). Use pra o que precisa de peso; a linha fica pro `Pincel`.
 */
export const Mancha: React.FC<{pontos: Ponto[]; p: number; id: string}> = ({pontos, p, id}) => {
  if (p <= 0) return null;
  const ys = pontos.map((q) => q[1]);
  const xs = pontos.map((q) => q[0]);
  const [y0, y1] = [Math.min(...ys), Math.max(...ys)];
  const corte = y1 - (y1 - y0) * ramp(p, 0, 1, chega);
  return (
    <g>
      <clipPath id={`traco-dourado-m-${id}`}>
        <rect x={Math.min(...xs) - 20} y={corte} width={Math.max(...xs) - Math.min(...xs) + 40} height={y1 - corte + 20} />
      </clipPath>
      <path d={caminho(pontos, true)} fill={COR.tinta} clipPath={`url(#traco-dourado-m-${id})`} opacity={0.95} />
    </g>
  );
};

/** O título: um rótulo pequeno em ouro em cima (capítulo, passo) e a palavra grande em tinta, Cormorant 700. */
export const Titulo: React.FC<{x: number; y: number; rotulo?: string; children: string; p: number; tamanho?: number}> = ({x, y, rotulo, children, p, tamanho = 124}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  return (
    <g opacity={Math.min(1, p * 1.5)} transform={`translate(0 ${(1 - ramp(p, 0, 1, chega)) * 16 * u})`}>
      {rotulo && (
        <text x={x} y={y - tamanho * u * 0.95} textAnchor="middle" fontFamily={CORMORANT} fontWeight={700} fontSize={44 * u} letterSpacing={10 * u} fill={COR.ouroEscuro}>
          {rotulo.toUpperCase()}
        </text>
      )}
      <text x={x} y={y} textAnchor="middle" fontFamily={CORMORANT} fontWeight={700} fontSize={tamanho * u} fill={COR.tinta}>
        {children}
      </text>
    </g>
  );
};

/** O selo dourado: quadrado de ouro com um número ou letra em papel, que bate com mola. Fecha um título ou o vídeo. */
export const SeloOuro: React.FC<{x: number; y: number; p: number; letra: string; tam?: number}> = ({x, y, p, letra, tam = 92}) => {
  const {u} = useTela();
  if (p <= 0) return null;
  const s = ramp(p, 0, 1, elastico) * (tam / 92) * u;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(-4)`}>
      <rect x={-46} y={-46} width={92} height={92} fill="#b8801c" />
      <rect x={-38} y={-38} width={76} height={76} fill="none" stroke={COR.papel} strokeWidth={2.5} opacity={0.7} />
      <text y={22} textAnchor="middle" fontFamily={CORMORANT} fontWeight={700} fontSize={64} fill={COR.papel}>
        {letra}
      </text>
    </g>
  );
};

// ---------- 3. os desenhos prontos ----------
// Primeiro a tinta (Pincel, Mancha), depois o ouro (Fio) costurando o que importa. Recebem centro, tamanho, `p` e `t`.

type Desenho = {x: number; y: number; tam?: number; p: number; t?: number};

export const Sol: React.FC<Desenho> = ({x, y, tam = 300, p, t = 0}) => {
  const r = tam / 2;
  return (
    <>
      <Tinta>
        <Pincel pontos={circulo(x, y, r, r, 18).concat([[x - r * 0.25, y - r * 0.97]])} p={ramp(p, 0, 0.55)} grossura={tam * 0.1} semente="td-sol" forca={0.85} />
      </Tinta>
      {Array.from({length: 10}, (_, i) => {
        const a = (i / 10) * Math.PI * 2 + t * 0.06;
        return <Fio key={i} pontos={[[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.85, y + Math.sin(a) * r * 1.85]]} p={emFila(p, 0.45, 0.55, i, 10)} t={t + i * 0.1} grossura={6} />;
      })}
    </>
  );
};

export const Nuvem: React.FC<Desenho & {pesada?: number}> = ({x, y, tam = 420, p, t = 0, pesada = 0}) => {
  const w = tam;
  const h = tam * 0.4;
  const contorno: Ponto[] = [
    [x - w * 0.5, y + h * 0.45],
    [x - w * 0.55, y + h * 0.05],
    [x - w * 0.36, y - h * 0.3],
    [x - w * 0.18, y - h * 0.75],
    [x + w * 0.08, y - h * 0.85],
    [x + w * 0.26, y - h * 0.4],
    [x + w * 0.48, y - h * 0.3],
    [x + w * 0.56, y + h * 0.12],
    [x + w * 0.45, y + h * 0.45],
  ];
  return (
    <>
      <Tinta>
        {pesada > 0 && <Mancha id={`nuvem${Math.round(x)}`} pontos={contorno} p={pesada} />}
        <Pincel pontos={[...contorno, contorno[0]]} p={ramp(p, 0, 0.75)} grossura={tam * 0.055} semente={`td-nuvem${Math.round(x)}`} />
      </Tinta>
      <Fio pontos={[[x - w * 0.46, y + h * 0.6], [x, y + h * 0.66], [x + w * 0.44, y + h * 0.6]]} p={ramp(p, 0.7, 1)} t={t} />
    </>
  );
};

/** Chuva: pinceladas curtas caindo sem parar, e de vez em quando uma gota de ouro. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; pingos?: number}> = ({x, y, largura, altura, t, forca = 1, pingos = 16}) => {
  const {u} = useTela();
  return (
    <g strokeLinecap="round">
      {Array.from({length: pingos}, (_, i) => {
        if (i / pingos >= forca) return null;
        const fase = (t * (0.9 + acaso(`tdv${i}`) * 0.5) + acaso(`tdf${i}`)) % 1;
        const px = x - largura / 2 + acaso(`tdx${i}`) * largura;
        const py = y + fase * altura;
        const ouro = i % 5 === 0;
        return (
          <line key={i} x1={px} y1={py} x2={px - 10 * u} y2={py + 46 * u} stroke={ouro ? COR.ouro : COR.tinta} strokeWidth={(ouro ? 5 : 7) * u} opacity={(ouro ? 1 : 0.85) - fase * 0.5} />
        );
      })}
    </g>
  );
};

/** Mar: duas pinceladas de onda e o fio de ouro correndo entre elas, como o reflexo. */
export const Mar: React.FC<{y: number; p: number; t: number}> = ({y, p, t}) => {
  const {L, u} = useTela();
  const onda = (yy: number, amp: number, fase: number): Ponto[] => Array.from({length: 10}, (_, i) => [70 * u + ((L - 140 * u) * i) / 9, yy + Math.sin(i * 1.3 + fase + t * 1.4) * amp]);
  return (
    <>
      <Tinta>
        <Pincel pontos={onda(y, 22 * u, 0)} p={ramp(p, 0, 0.5)} grossura={26} semente="td-onda1" />
        <Pincel pontos={onda(y + 150 * u, 26 * u, 2)} p={ramp(p, 0.2, 0.7)} grossura={30} semente="td-onda2" />
      </Tinta>
      <Fio pontos={onda(y + 75 * u, 10 * u, 1)} p={ramp(p, 0.55, 1)} t={t} grossura={4} />
    </>
  );
};

/** Planta: caule e folhas de uma pincelada só, e o fio de ouro subindo pelo caule. */
export const Planta: React.FC<Desenho> = ({x, y, tam = 360, p, t = 0}) => {
  const alto = tam * ramp(p, 0, 0.6, chega);
  const venta = balanco(t, 0.8) * tam * 0.03;
  const caule: Ponto[] = [[x, y], [x + venta * 0.4, y - alto * 0.5], [x + venta, y - alto]];
  const folha = (lado: number, alt: number, abre: number, k: number) => {
    const bx = x + venta * alt;
    const by = y - alto * alt;
    const c = tam * 0.38 * abre;
    return abre > 0 ? <Pincel key={k} pontos={[[bx, by], [bx + lado * c * 0.55, by - c * 0.35], [bx + lado * c, by - c * 0.15]]} p={1} grossura={tam * 0.07} semente={`td-folha${k}`} /> : null;
  };
  return (
    <>
      <Tinta>
        <Pincel pontos={caule} p={p > 0 ? 1 : 0} grossura={tam * 0.06} semente="td-caule" />
        {folha(-1, 0.4, ramp(p, 0.3, 0.6, chega), 0)}
        {folha(1, 0.65, ramp(p, 0.45, 0.75, chega), 1)}
        {folha(-1, 0.9, ramp(p, 0.6, 0.9, chega), 2)}
      </Tinta>
      <Fio pontos={caule.map(([a, b]) => [a + 18, b] as Ponto)} p={ramp(p, 0.75, 1)} t={t} grossura={5} />
    </>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Abertura: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <Tela>
      {/* a gota: uma mancha de tinta que já está no papel no quadro 0, o fio de ouro costura a volta dela */}
      <Tinta>
        <Mancha id="gota" p={1} pontos={[[L * 0.5, A * 0.2], [L * 0.5 + 110 * u, A * 0.32], [L * 0.5 + 100 * u, A * 0.39], [L * 0.5, A * 0.43], [L * 0.5 - 100 * u, A * 0.39], [L * 0.5 - 110 * u, A * 0.32]]} />
      </Tinta>
      {/* o ouro dá a volta: é o "ciclo" do título, sem escrever na tela a frase que a legenda mostra */}
      <Fio fechado pontos={circulo(L * 0.5, A * 0.32, 250 * u, 250 * u, 20)} p={ramp(t, 0.1, 1.4)} t={t} />
    </Tela>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, tv}) => {
  const {L, A, u} = useTela();
  return (
    <Tela>
      <Sol x={L * 0.6} y={A * 0.22} tam={250 * u} p={ramp(t, 0, 1.1)} t={t} />
      <Mar y={A * 0.44} p={ramp(t, 0.3, 1.4)} t={tv} />
    </Tela>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, tv}) => {
  const {L, A, u} = useTela();
  const junta = ramp(t, 0.6, 1.8);
  return (
    <Tela>
      {/* o mar anda no tempo do vídeo (tv): na fusão ele casa com o da cena anterior em vez de dobrar */}
      <Mar y={A * 0.44} p={1} t={tv} />
      <Tinta>
        {[0.32, 0.5, 0.68].map((fx, i) => (
          <Pincel key={i} pontos={Array.from({length: 6}, (_, k) => [L * fx + Math.sin(k * 1.5 + t * 3 + i) * 18 * u, A * 0.43 - k * 30 * u - ((t * 0.5 + i * 0.3) % 1) * 40 * u] as Ponto)} p={ramp(t, i * 0.15, 0.6 + i * 0.15) * (1 - junta * 0.7)} grossura={10} semente={`td-vapor${i}`} forca={0.6} />
        ))}
      </Tinta>
      <Nuvem x={L * 0.5} y={A * 0.18} tam={(320 + junta * 200) * u} p={ramp(t, 0.5, 1.6)} t={t} />
    </Tela>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <Tela>
      <Nuvem x={L * 0.5} y={A * 0.17} tam={560 * u} p={1} t={t} pesada={ramp(t, 0, 1.1)} />
      <Chuva x={L * 0.5} y={A * 0.25} largura={460 * u} altura={A * 0.32} t={t} forca={ramp(t, 0.6, 1.5)} pingos={22} />
    </Tela>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  return (
    <Tela>
      <Nuvem x={L * 0.4} y={A * 0.13} tam={400 * u} p={1} t={t} pesada={1} />
      <Chuva x={L * 0.4} y={A * 0.19} largura={300 * u} altura={A * 0.3} t={t} pingos={12} forca={1 - ramp(t, 1.8, 2.6)} />
      <Tinta>
        <Pincel pontos={[[L * 0.1, A * 0.56], [L * 0.5, A * 0.555], [L * 0.9, A * 0.562]]} p={ramp(t, 0, 0.5)} grossura={30} semente="td-chao" />
      </Tinta>
      <Planta x={L * 0.56} y={A * 0.555} tam={440 * u} p={ramp(t, 0.4, 2.4)} t={t} />
      {/* o selo fecha o vídeo: 4 passos do ciclo */}
      <SeloOuro x={L * 0.82} y={A * 0.5} p={ramp(t, 2.3, 2.8)} letra="4" tam={110} />
    </Tela>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    cenas={cenasPorFrase(FALA_EXEMPLO, [
      [0, 0, Abertura, 0],
      [1, 1, SolEMar, 0.45],
      [2, 2, VaporENuvem, 0.45],
      [3, 3, NuvemEChuva, 0.45],
      [4, 4, ChuvaEPlanta, 0.45],
    ])}
  />
);
