// ESTILO: Pixel de videogame
// Cara de jogo antigo de 16 bits: tudo é feito de quadradinhos numa grade, o céu
// desce em faixas com pontilhado, as coisas andam aos saltos de pixel, o texto
// é digitado numa caixa de diálogo e a cena troca num mosaico de blocos.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarPress} from '@remotion/google-fonts/PressStart2P';
import {loadFont as carregarPixelify} from '@remotion/google-fonts/PixelifySans';
import type {PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, cenasPorFrase, chega, ramp, useTela} from '../../kit';

const {fontFamily: PRESS} = carregarPress('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: PIXELIFY} = carregarPixelify('normal', {weights: ['700'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** A paleta fechada do jogo. Cor fora daqui quebra a cara de 16 bits. */
export const COR = {
  noite: '#101018',
  marinho: '#14143a',
  azul: '#2a4fb0',
  ceu: '#3a6fd8',
  claro: '#5fa8ff',
  gelo: '#bfe6ff',
  branco: '#f4f4f4',
  amarelo: '#ffd23f',
  laranja: '#ff9e4a',
  vermelho: '#e8433a',
  verde: '#4caa3f',
  folha: '#8bd65a',
  musgo: '#2e8a3a',
  terra: '#6b3e23',
  mar: '#2f78c4',
  fundoMar: '#1a4b8c',
  cinza: '#9aa6c8',
  chumbo: '#5a6488',
} as const;

/** Tamanho de um pixel do jogo numa tela de 1080. Tudo encaixa nesta grade. */
export const PX = 10;
const grade = (v: number, p: number) => Math.round(v / p) * p;

/** Céu em faixas com pontilhado entre elas (o degradê de jogo antigo) e chão escuro onde mora a legenda. */
const FAIXAS = [COR.azul, COR.ceu, COR.claro, '#9fd6ff', COR.gelo];
const Fundo: React.FC<{t: number}> = () => {
  const {L, A, u} = useTela();
  const p = PX * u;
  const h = grade((A * 0.62) / FAIXAS.length, p);
  return (
    <AbsoluteFill style={{background: COR.marinho}}>
      <Tela>
        <defs>
          {FAIXAS.map((c, i) => (
            <pattern key={i} id={`pixel-xadrez-${i}`} width={2 * p} height={2 * p} patternUnits="userSpaceOnUse">
              <rect width={p} height={p} fill={c} />
              <rect x={p} y={p} width={p} height={p} fill={c} />
            </pattern>
          ))}
        </defs>
        <g shapeRendering="crispEdges">
          {FAIXAS.map((c, i) => (
            <React.Fragment key={i}>
              <rect x={0} y={i * h} width={L} height={h} fill={c} />
              {i > 0 && <rect x={0} y={i * h - 2 * p} width={L} height={2 * p} fill={`url(#pixel-xadrez-${i})`} />}
            </React.Fragment>
          ))}
          <rect x={0} y={FAIXAS.length * h} width={L} height={A} fill={COR.marinho} />
          <rect x={0} y={FAIXAS.length * h} width={L} height={p} fill={COR.noite} />
        </g>
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'pixel',
  nome: 'Pixel de videogame',
  fundo: COR.marinho,
  tinta: COR.branco,
  acento: COR.amarelo,
  legenda: {
    fonte: PIXELIFY,
    peso: 700,
    tamanho: 74,
    cor: COR.branco,
    destaque: COR.amarelo,
    sombra: `5px 5px 0 ${COR.noite}, -3px -3px 0 ${COR.noite}, 3px -3px 0 ${COR.noite}, -3px 3px 0 ${COR.noite}`,
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** A camada de pixel: tira o serrilhado suave pra todo quadrado ficar com quina dura. Use dentro de <Tela>. */
export const Pixels: React.FC<{children: React.ReactNode}> = ({children}) => <g shapeRendering="crispEdges">{children}</g>;

/**
 * Um desenho de pixel feito de texto: cada letra do `mapa` é uma cor de `cores`, o ponto é vazio.
 * (x, y) é o centro; `escala` multiplica o pixel; `p` de 0 a 1 monta o desenho bloco a bloco, na diagonal.
 */
export const Sprite: React.FC<{mapa: string[]; cores: Record<string, string>; x: number; y: number; escala?: number; p?: number; virar?: boolean}> = ({
  mapa,
  cores,
  x,
  y,
  escala = 1,
  p = 1,
  virar = false,
}) => {
  const {u} = useTela();
  const b = PX * escala * u;
  const w = mapa[0].length;
  const h = mapa.length;
  const x0 = grade(x - (w * b) / 2, PX * u);
  const y0 = grade(y - (h * b) / 2, PX * u);
  return (
    <Pixels>
      {mapa.flatMap((linha, j) =>
        linha.split('').map((ch, i) => {
          const c = cores[virar ? linha[w - 1 - i] : ch];
          if (!c || (i + j) / (w + h) >= p) return null;
          return <rect key={`${i}-${j}`} x={x0 + i * b} y={y0 + j * b} width={b} height={b} fill={c} />;
        })
      )}
    </Pixels>
  );
};

/** Um círculo cheio feito de blocos (sol, bola, cabeça). `r` em pixels de tela; `p` cresce do centro. */
export const Disco: React.FC<{x: number; y: number; r: number; cor: string; p?: number}> = ({x, y, r, cor, p = 1}) => {
  const {u} = useTela();
  const b = PX * u;
  const n = Math.round((r * p) / b);
  if (n <= 0) return null;
  const cx = grade(x, b);
  const cy = grade(y, b);
  const linhas = [];
  for (let j = -n; j <= n; j++) {
    const meia = Math.floor(Math.sqrt(n * n + n * 0.6 - j * j));
    linhas.push(<rect key={j} x={cx - meia * b} y={cy + j * b} width={(2 * meia + 1) * b} height={b} fill={cor} />);
  }
  return <Pixels>{linhas}</Pixels>;
};

/** Texto de jogo que se digita letra a letra. `p` de 0 a 1; com `seta`, o ▼ pisca no fim. */
export const Digitado: React.FC<{texto: string; p: number; tamanho?: number; cor?: string; t?: number; seta?: boolean}> = ({
  texto,
  p,
  tamanho = 58,
  cor = COR.branco,
  t = 0,
  seta = false,
}) => {
  const {u} = useTela();
  const n = Math.floor(texto.length * Math.min(1, p));
  return (
    <div style={{fontFamily: PRESS, fontSize: tamanho * u, lineHeight: 1.5, color: cor, textShadow: `${5 * u}px ${5 * u}px 0 ${COR.noite}`}}>
      {texto.slice(0, n)}
      <span style={{color: 'transparent', textShadow: 'none'}}>{texto.slice(n)}</span>
      {seta && n >= texto.length && Math.floor(t * 4) % 2 === 0 && <span style={{color: COR.amarelo, fontSize: tamanho * u * 0.6}}> ▼</span>}
    </div>
  );
};

/** A caixa de diálogo de RPG: abre de cima pra baixo (`abre` 0 a 1) e segura um título e um texto digitado. */
export const CaixaDialogo: React.FC<{y: number; abre: number; rotulo?: string; children: React.ReactNode}> = ({y, abre, rotulo, children}) => {
  const {L, u} = useTela();
  if (abre <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: L * 0.07,
        width: L * 0.86,
        top: y,
        transform: `scaleY(${abre})`,
        transformOrigin: 'top',
        background: `linear-gradient(${COR.azul}, #121a6a)`,
        border: `${10 * u}px solid ${COR.branco}`,
        outline: `${10 * u}px solid ${COR.noite}`,
        boxShadow: `inset 0 0 0 ${6 * u}px #6a7aff, 0 ${12 * u}px 0 ${8 * u}px rgba(0,0,0,0.35)`,
        boxSizing: 'border-box',
        padding: `${36 * u}px ${42 * u}px`,
      }}
    >
      {rotulo && <div style={{fontFamily: PRESS, fontSize: 34 * u, color: COR.amarelo, textShadow: `${4 * u}px ${4 * u}px 0 ${COR.noite}`, marginBottom: 28 * u}}>{rotulo}</div>}
      {children}
    </div>
  );
};

/**
 * O mosaico: a transição do estilo. Blocos grandes cobrem a tela na diagonal.
 * `entra` de 0 a 1 descobre a cena (use no começo), `sai` de 0 a 1 cobre (use no fim).
 */
export const Mosaico: React.FC<{entra?: number; sai?: number}> = ({entra = 1, sai = 0}) => {
  const {L, A, u} = useTela();
  if (entra >= 1 && sai <= 0) return null;
  const b = PX * 12 * u;
  const nx = Math.ceil(L / b);
  const ny = Math.ceil(A / b);
  const blocos = [];
  for (let j = 0; j < ny; j++)
    for (let i = 0; i < nx; i++) {
      const d = (i + j) / (nx + ny - 2);
      if (d >= entra || d < sai) blocos.push(<rect key={`${i}-${j}`} x={i * b} y={j * b} width={b} height={b} fill={(i + j) % 2 ? COR.noite : COR.marinho} />);
    }
  return (
    <AbsoluteFill>
      <Tela>
        <Pixels>{blocos}</Pixels>
      </Tela>
    </AbsoluteFill>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Todo desenho é feito de Disco, Sprite e retângulos na grade, e anda aos saltos de pixel (posição passa pela grade).

type Desenho = {x: number; y: number; tam?: number; p: number; t?: number};

/** Sol de jogo: disco em três anéis e oito blocos de raio girando e piscando. */
export const Sol: React.FC<Desenho> = ({x, y, tam = 150, p, t = 0}) => {
  const {u} = useTela();
  const b = PX * u;
  return (
    <>
      <Disco x={x} y={y} r={tam * 0.5} cor={COR.laranja} p={p} />
      <Disco x={x} y={y} r={tam * 0.38} cor={COR.amarelo} p={p} />
      <Disco x={x - tam * 0.1} y={y - tam * 0.1} r={tam * 0.14} cor={COR.branco} p={p} />
      <Pixels>
        {p >= 1 &&
          Array.from({length: 8}, (_, i) => {
            const a = (i / 8) * Math.PI * 2 + Math.floor(t * 4) * (Math.PI / 16);
            const r = tam * 0.68 + (Math.floor(t * 6 + i) % 3) * b;
            return <rect key={i} x={grade(x + Math.cos(a) * r, b)} y={grade(y + Math.sin(a) * r, b)} width={2 * b} height={2 * b} fill={i % 2 ? COR.amarelo : COR.branco} />;
          })}
      </Pixels>
    </>
  );
};

/** Nuvem: três discos e a sombra reta embaixo. `pesada` de 0 a 1 escurece pra nuvem de chuva. */
export const Nuvem: React.FC<Desenho & {pesada?: number}> = ({x, y, tam = 300, p, pesada = 0}) => {
  const {u} = useTela();
  const cor = pesada > 0.5 ? COR.cinza : COR.branco;
  const sombra = pesada > 0.5 ? COR.chumbo : '#cfe6ff';
  const partes: [number, number, number][] = [
    [-0.28, 0.06, 0.22],
    [0, -0.06, 0.3],
    [0.28, 0.06, 0.22],
  ];
  return (
    <>
      {partes.map(([dx, dy, r], i) => (
        <Disco key={i} x={x + dx * tam} y={y + dy * tam} r={r * tam} cor={cor} p={ramp(p, i * 0.2, 0.6 + i * 0.2, chega)} />
      ))}
      {p >= 1 && (
        <Pixels>
          <rect x={grade(x - tam * 0.48, PX * u)} y={grade(y + tam * 0.2, PX * u)} width={grade(tam * 0.96, PX * u)} height={2 * PX * u} fill={sombra} />
        </Pixels>
      )}
    </>
  );
};

/** Chuva de blocos: gotas de 1x3 pixels caindo aos saltos. `forca` de 0 a 1 liga aos poucos. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; gotas?: number}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  gotas = 18,
}) => {
  const {u} = useTela();
  const b = PX * u;
  return (
    <Pixels>
      {Array.from({length: gotas}, (_, i) => {
        if (i / gotas >= forca) return null;
        const fase = (t * (1.1 + acaso(`pixel-v${i}`) * 0.5) + acaso(`pixel-f${i}`)) % 1;
        const gx = grade(x - largura / 2 + acaso(`pixel-x${i}`) * largura, b);
        const gy = grade(y + fase * altura, b);
        return <rect key={i} x={gx} y={gy} width={b} height={3 * b} fill={i % 3 ? COR.claro : COR.gelo} />;
      })}
    </Pixels>
  );
};

/** O mar: listras de duas cores e traços de espuma correndo. Vai de `y` até `y + altura`. */
export const Mar: React.FC<{y: number; altura: number; p: number; t: number}> = ({y, altura, p, t}) => {
  const {L, u} = useTela();
  const b = PX * u;
  const y0 = grade(y + (1 - p) * altura, b);
  const n = Math.floor((y + altura - y0) / b);
  return (
    <Pixels>
      {Array.from({length: n}, (_, j) => (
        <rect key={j} x={0} y={y0 + j * b} width={L} height={b} fill={j % 6 < 3 && j < 8 ? COR.mar : COR.fundoMar} />
      ))}
      {p > 0.5 &&
        Array.from({length: 14}, (_, i) => {
          const yy = y0 + b * (1 + ((i * 3) % Math.max(1, n - 2)));
          const xx = grade((((i * 157 + t * (120 + i * 12)) * u) % (L + 100 * u)) - 50 * u, b);
          return <rect key={`e${i}`} x={xx} y={yy} width={(3 + (i % 3) * 2) * b} height={b} fill={COR.gelo} />;
        })}
    </Pixels>
  );
};

/** Os blocos de folha da planta. */
const FOLHA = ['..gg', '.ggG', 'ggG.', 'G...'];

/** Planta que cresce em degraus: o caule sobe bloco a bloco e as folhas brotam alternadas. (x, y) é o pé. */
export const Planta: React.FC<Desenho> = ({x, y, tam = 300, p, t = 0}) => {
  const {u} = useTela();
  const b = PX * u;
  const total = Math.round(tam / b / 2);
  const n = Math.floor(total * ramp(p, 0, 0.75));
  const cx = grade(x, b);
  const ventinho = Math.floor(t * 2) % 2;
  const cores = {g: COR.folha, G: COR.musgo};
  return (
    <>
      <Pixels>
        {Array.from({length: n}, (_, j) => (
          <rect key={j} x={cx + (j > total * 0.7 ? ventinho * b : 0)} y={grade(y, b) - (j + 1) * 2 * b} width={2 * b} height={2 * b} fill={j % 2 ? COR.verde : COR.musgo} />
        ))}
      </Pixels>
      {[0.35, 0.6, 0.85].map((h, i) =>
        n > total * h ? (
          <Sprite key={i} mapa={FOLHA} cores={cores} escala={2} virar={i % 2 === 0} x={cx + (i % 2 ? 6 : -4) * b} y={grade(y, b) - total * h * 2 * b - 2 * b} p={ramp(p, 0.3 + i * 0.2, 0.5 + i * 0.2)} />
        ) : null
      )}
      {p >= 1 && <Disco x={cx + b} y={grade(y, b) - (n + 1) * 2 * b} r={2.5 * b} cor={Math.floor(t * 3) % 2 ? COR.vermelho : COR.amarelo} />}
    </>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const GOTA = ['..w..', '.wbw.', 'wbbbw', 'wbbbw', '.www.'];

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const pulo = Math.abs(Math.sin(t * 5)) * 60 * u;
  return (
    <>
      <Tela>
        <Mar y={A * 0.5} altura={A * 0.12} p={1} t={t} />
        <Sprite mapa={GOTA} cores={{w: COR.branco, b: COR.claro}} escala={5} x={L / 2} y={A * 0.43 - pulo} />
      </Tela>
      <CaixaDialogo y={A * 0.1} abre={ramp(t, 0, 0.35, chega) * 0.7 + 0.3}>
        <Digitado texto="O CICLO DA ÁGUA" p={ramp(t, 0.3, 1.5)} tamanho={72} t={t} seta />
      </CaixaDialogo>
      <Mosaico sai={ramp(t, dur - 0.4, dur)} />
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <>
      <Tela>
        <Sol x={L * 0.68} y={A * 0.2} tam={190 * u} p={ramp(t, 0.1, 0.8, chega)} t={t} />
        <Mar y={A * 0.46} altura={A * 0.16} p={ramp(t, 0, 0.6)} t={t} />
        {/* o calor: blocos laranja subindo do mar em zigue-zague */}
        <Pixels>
          {Array.from({length: 10}, (_, i) => {
            const fase = (t * 0.8 + i / 10) % 1;
            const x = L * (0.15 + (i % 5) * 0.17) + Math.sin(fase * 9 + i) * 20 * u;
            return t > 0.8 ? <rect key={i} x={grade(x, PX * u)} y={grade(A * 0.45 - fase * A * 0.1, PX * u)} width={2 * PX * u} height={2 * PX * u} fill={fase < 0.5 ? COR.laranja : COR.amarelo} /> : null;
          })}
        </Pixels>
      </Tela>
      <Mosaico entra={ramp(t, 0, 0.4)} sai={ramp(t, dur - 0.4, dur)} />
    </>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const b = PX * u;
  return (
    <>
      <Tela>
        <Mar y={A * 0.5} altura={A * 0.12} p={1} t={t} />
        {/* o vapor: colunas de blocos claros subindo até a nuvem */}
        <Pixels>
          {Array.from({length: 14}, (_, i) => {
            const fase = (t * 0.7 + acaso(`pixel-vp${i}`)) % 1;
            const x = L * 0.3 + acaso(`pixel-vx${i}`) * L * 0.4;
            return <rect key={i} x={grade(x, b)} y={grade(A * 0.49 - fase * A * 0.2, b)} width={2 * b} height={2 * b} fill={COR.branco} opacity={1 - fase * 0.6} />;
          })}
        </Pixels>
        <Nuvem x={L * 0.5} y={A * 0.22} tam={(300 + ramp(t, 0.6, dur) * 160) * u} p={ramp(t, 0.4, 1.6)} />
      </Tela>
      <Mosaico entra={ramp(t, 0, 0.4)} sai={ramp(t, dur - 0.4, dur)} />
    </>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  const desce = ramp(t, 0.2, 1.2) * 40 * u;
  return (
    <>
      <Tela>
        <Nuvem x={L * 0.5} y={A * 0.2 + desce} tam={520 * u} p={1} pesada={ramp(t, 0.3, 0.9)} />
        <Chuva x={L * 0.5} y={A * 0.28 + desce} largura={440 * u} altura={A * 0.3} t={t} forca={ramp(t, 0.9, 1.8)} />
      </Tela>
      <Mosaico entra={ramp(t, 0, 0.4)} sai={ramp(t, dur - 0.4, dur)} />
    </>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const b = PX * u;
  const chao = grade(A * 0.56, b);
  return (
    <>
      <Tela>
        <Nuvem x={L * 0.5} y={A * 0.17} tam={440 * u} p={1} pesada={1} />
        <Chuva x={L * 0.5} y={A * 0.23} largura={360 * u} altura={chao - A * 0.24} t={t} gotas={12} />
        <Pixels>
          <rect x={0} y={chao} width={L} height={3 * b} fill={COR.verde} />
          {Array.from({length: Math.ceil(L / b / 6)}, (_, i) => (
            <rect key={i} x={i * 6 * b} y={chao} width={2 * b} height={b} fill={COR.musgo} />
          ))}
          <rect x={0} y={chao + 3 * b} width={L} height={A * 0.06} fill={COR.terra} />
        </Pixels>
        <Planta x={L * 0.5} y={chao} tam={340 * u} p={ramp(t, 0.5, 2.6)} t={t} />
      </Tela>
      <Mosaico entra={ramp(t, 0, 0.4)} />
    </>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 está digitada na caixa de diálogo: sem legenda nesse trecho
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
