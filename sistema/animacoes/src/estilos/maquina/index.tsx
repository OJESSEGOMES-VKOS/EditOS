// ESTILO: Máquina
// O vídeo que se monta a partir de uma lista: cada cena é um desenho em traço de
// ouro que se desenha sozinho no alto e a frase dita escrita embaixo, numa
// serifada itálica creme, sobre um fundo de gravura escura com poeira dourada
// subindo. Abre com o título já escrito no quadro 0 e fecha com um símbolo e uma
// linha. Bom pra texto que é a peça (citação, regra, lista de passos), com
// imagem simples e solene.
//
// A diferença dos outros estilos: o vídeo é DADO, não cena escrita à mão. Você
// passa a fala, a lista de cenas ({frases, desenho, rotulo}) e o título pra
// `Maquina`, e ela monta o Filme inteiro. Desenho que falta é uma entrada nova em
// `DESENHOS` (traços SVG numa caixa de 1000 x 1000), no próprio video.tsx.
//
//   1. `tema`      cores, fundo e legenda (a legenda fica desligada: a frase já está escrita)
//   2. as peças    Ouro (o traço), Desenho, Texto, Abertura, Fecho, os ajudantes de traço
//   3. os desenhos DESENHOS (biblioteca genérica, caixa 1000 x 1000)
//   4. a máquina   Maquina (fala + lista de cenas -> vídeo)
//   5. `Exemplo`   o ciclo da água
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarCinzel} from '@remotion/google-fonts/Cinzel';
import {loadFont as carregarCormorant} from '@remotion/google-fonts/CormorantGaramond';
import type {Fala, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, cenasPorFrase, chega, ramp, suave, useTela} from '../../kit';

const {fontFamily: CINZEL} = carregarCinzel('normal', {weights: ['700'], subsets: ['latin', 'latin-ext']});
const {fontFamily: CORMORANT} = carregarCormorant('italic', {weights: ['600'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

export const COR = {
  ouro: '#e8c170',
  creme: '#f8ecd2',
  fundo: '#120c06',
} as const;

/** A gravura escura: marrom quase preto, linhas finas em diagonal, poeira de ouro subindo e o canto fechado. */
const Fundo: React.FC<{t: number}> = ({t}) => {
  const {L, A, u} = useTela();
  const linhas = React.useMemo(() => {
    const d: string[] = [];
    for (let i = -A; i < L; i += 14 * u) d.push(`M${i},0L${i + A * 0.6},${A}`);
    return d.join('');
  }, [L, A, u]);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2a1d10 0%, #120c06 60%, #070402 100%)'}}>
      <Tela>
        <path d={linhas} stroke={COR.ouro} strokeWidth={1 * u} opacity={0.07} />
        {Array.from({length: 60}, (_, i) => {
          const x = acaso(`mx${i}`) * L;
          const y = (((acaso(`my${i}`) * A - t * 30 * u * (0.4 + acaso(`mv${i}`))) % A) + A) % A;
          return <circle key={i} cx={x} cy={y} r={(1 + acaso(`mr${i}`) * 2.5) * u} fill={COR.ouro} opacity={0.15 + 0.35 * Math.abs(Math.sin(t + i))} />;
        })}
      </Tela>
      <AbsoluteFill style={{boxShadow: `inset 0 0 ${L * 0.18}px ${L * 0.08}px #000`}} />
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'maquina',
  nome: 'Máquina',
  fundo: COR.fundo,
  tinta: COR.creme,
  acento: COR.ouro,
  // a frase dita já está escrita na cena: a Maquina monta o vídeo com a legenda desligada
  legenda: {
    fonte: CORMORANT,
    peso: 600,
    tamanho: 66,
    cor: COR.creme,
    destaque: COR.ouro,
    sombra: '0 2px 18px #000, 0 0 4px #000',
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** Ajudantes pra escrever traços na caixa de 1000 x 1000 (cada um devolve o `d` de um <path>). */
export const raios = (cx: number, cy: number, r0: number, r1: number, n: number, a0 = 0) =>
  Array.from({length: n}, (_, i) => {
    const a = a0 + (i / n) * Math.PI * 2;
    return `M${cx + Math.cos(a) * r0},${cy + Math.sin(a) * r0}L${cx + Math.cos(a) * r1},${cy + Math.sin(a) * r1}`;
  }).join('');
export const ondas = (y: number, x0 = 80, x1 = 920, a = 22, n = 6) => {
  const w = (x1 - x0) / n;
  let d = `M${x0},${y}`;
  for (let i = 0; i < n; i++) d += `q${w / 4},${-a} ${w / 2},0q${w / 4},${a} ${w / 2},0`;
  return d;
};
export const estrela = (cx: number, cy: number, r: number) =>
  'M' +
  Array.from({length: 11}, (_, i) => {
    const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
    const rr = i % 2 ? r * 0.4 : r;
    return `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`;
  }).join('L');
export const circ = (cx: number, cy: number, r: number) => `M${cx - r},${cy}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0`;

/**
 * O traço de ouro: desenha a lista de traços em sequência (cada um começa 0,23 s depois do anterior e leva 1,3 s),
 * com um brilho em volta. Fica dentro de um <svg viewBox="0 0 1000 1000">.
 */
export const Ouro: React.FC<{tracos: string[]; t: number; grossura?: number; de?: number}> = ({tracos, t, grossura = 7, de = 0.2}) => (
  <>
    {tracos.map((d, i) => {
      const p = ramp(t, de + i * 0.23, de + 1.3 + i * 0.23, suave);
      return <path key={i} d={d} pathLength={1} fill="none" stroke={COR.ouro} strokeWidth={grossura} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />;
    })}
  </>
);

/** Onde mora o desenho e o texto em cada formato: em pé, desenho em cima e texto embaixo; deitado, lado a lado. */
export const useCaixas = () => {
  const {L, A, u, deitado} = useTela();
  return deitado
    ? {desenho: {lado: 760 * u * 1.33, x: L * 0.07, y: (A - 760 * u * 1.33) / 2}, texto: {x: L * 0.52, y: A * 0.2, largura: L * 0.42, alto: A * 0.6, tamanho: 70}}
    : {desenho: {lado: 820 * u, x: (L - 820 * u) / 2, y: A * 0.15}, texto: {x: L * 0.08, y: A * 0.6, largura: L * 0.84, alto: A * 0.22, tamanho: 84}};
};

/** O desenho da cena: os traços em ouro na caixa do formato, crescendo um pouco enquanto a cena dura. */
export const Desenho: React.FC<{tracos: string[]; t: number; sai?: number}> = ({tracos, t, sai = 0}) => {
  const {desenho: c} = useCaixas();
  return (
    <svg
      width={c.lado}
      height={c.lado}
      viewBox="0 0 1000 1000"
      style={{position: 'absolute', left: c.x, top: c.y, opacity: 1 - sai, transform: `scale(${1 + 0.012 * t})`, filter: `drop-shadow(0 0 12px ${COR.ouro}88)`}}
    >
      <Ouro tracos={tracos} t={t} />
    </svg>
  );
};

/** A frase dita, escrita na caixa de texto (Cormorant itálico creme) com o rótulo em Cinzel ouro embaixo. */
export const Texto: React.FC<{frase: string; rotulo?: string; t: number; sai?: number}> = ({frase, rotulo, t, sai = 0}) => {
  const {u, deitado} = useTela();
  const {texto: c} = useCaixas();
  const entra = ramp(t, 0.13, 0.55, chega);
  return (
    <div
      style={{
        position: 'absolute',
        left: c.x,
        top: c.y,
        width: c.largura,
        height: c.alto,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: deitado ? 'center' : 'flex-start',
        textAlign: deitado ? 'left' : 'center',
        opacity: entra * (1 - sai),
        transform: `translateY(${(1 - entra) * 16 * u}px)`,
      }}
    >
      <div style={{fontFamily: CORMORANT, fontStyle: 'italic', fontWeight: 600, color: COR.creme, fontSize: c.tamanho * u, lineHeight: 1.18, textShadow: '0 2px 18px #000, 0 0 4px #000'}}>{frase}</div>
      {rotulo && <div style={{fontFamily: CINZEL, color: COR.ouro, fontSize: c.tamanho * 0.5 * u, marginTop: 26 * u, letterSpacing: 4 * u}}>{rotulo}</div>}
    </div>
  );
};

/** A abertura: o título e o subtítulo já escritos no quadro 0, com o primeiro desenho apagado atrás. */
export const Abertura: React.FC<{titulo: string; subtitulo?: string; tracos?: string[]; t: number; dur: number}> = ({titulo, subtitulo, tracos = [], t, dur}) => {
  const {u, deitado} = useTela();
  const sai = ramp(t, dur - 0.45, dur);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 80 * u, opacity: 1 - sai}}>
      <svg width={(deitado ? 380 : 520) * u} height={(deitado ? 380 : 520) * u} viewBox="0 0 1000 1000" style={{opacity: 0.55, marginBottom: 30 * u}}>
        {tracos.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={COR.ouro} strokeWidth={6} strokeLinecap="round" />
        ))}
      </svg>
      <div style={{fontFamily: CINZEL, color: COR.ouro, fontSize: 96 * u, lineHeight: 1.1, textShadow: '0 0 30px #000'}}>{titulo}</div>
      {subtitulo && <div style={{fontFamily: CORMORANT, fontStyle: 'italic', color: '#f5e6c4', fontSize: 60 * u, marginTop: 24 * u}}>{subtitulo}</div>}
    </AbsoluteFill>
  );
};

/** O fecho: um símbolo que se desenha no centro e uma linha curta em Cinzel (a última palavra, a fonte, o nome). */
export const Fecho: React.FC<{tracos: string[]; linha?: string; t: number}> = ({tracos, linha, t}) => {
  const {u} = useTela();
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', opacity: ramp(t, 0, 0.4)}}>
      <svg width={440 * u} height={440 * u} viewBox="0 0 1000 1000" style={{filter: `drop-shadow(0 0 12px ${COR.ouro}88)`}}>
        <Ouro tracos={tracos} t={t} grossura={8} de={0} />
      </svg>
      {linha && <div style={{fontFamily: CINZEL, color: COR.ouro, fontSize: 64 * u, marginTop: 20 * u}}>{linha}</div>}
    </AbsoluteFill>
  );
};

// ---------- 3. os desenhos prontos (caixa 1000 x 1000; cada string é um traço que se desenha) ----------
// Genéricos, de placa de museu: contorno e um ou dois detalhes. Desenho novo é uma entrada nova, no video.tsx.

const pessoa = 'M500,250a46,52 0 1,1 0.1,0M470,320c-40,10-80,30-86,80l-10,170M530,320c40,10 80,30 86,80l10,170M450,330l-6,260l20,260M550,330l6,260l-20,260M500,600l0,250';

export const DESENHOS: Record<string, string[]> = {
  luz: [circ(500, 480, 120), raios(500, 480, 170, 360, 16), raios(500, 480, 180, 260, 16, Math.PI / 16)],
  sol: [circ(500, 420, 140), raios(500, 420, 190, 300, 12)],
  mar: [ondas(560, 80, 920, 26, 5), ondas(660, 140, 860, 20, 5), ondas(760, 80, 920, 26, 5)],
  nuvem: ['M220,620c-90,0-110,-120-20,-140c0,-110 140,-150 200,-70c60,-110 240,-80 230,50c110,-10 140,160 20,160Z'],
  chuva: ['M260,420c-70,0-90,-100-15,-115c0,-90 115,-120 165,-55c50,-90 195,-65 190,40c90,-10 115,130 15,130Z', ...[300, 420, 540, 660].map((x) => `M${x},500l-30,90M${x + 40},640l-30,90`)],
  planta: ['M500,880L500,520', 'M500,700c-80,-10-150,-70-160,-150c80,0 150,60 160,150', 'M500,600c80,-10 150,-80 150,-170c-80,10-150,80-150,170', 'M300,880L700,880'],
  montanha: ['M60,820L360,360L520,600L660,440L940,820Z', 'M300,450l60,-90l50,80'],
  casa: ['M200,880L200,520L500,280L800,520L800,880Z', 'M440,880L440,700a60,60 0 0,1 120,0L560,880', 'M260,600l100,0l0,90l-100,0z'],
  estrelas: [estrela(330, 380, 90), estrela(650, 300, 60), estrela(620, 640, 110), estrela(250, 720, 50)],
  pessoa: [pessoa, 'M120,880L880,880'],
  livro: ['M500,320L500,820', 'M500,320C420,280 260,280 160,320L160,820C260,780 420,780 500,820', 'M500,320C580,280 740,280 840,320L840,820C740,780 580,780 500,820'],
  relogio: [circ(500, 500, 300), 'M500,500L500,300', 'M500,500L640,580', raios(500, 500, 250, 290, 12)],
  lampada: ['M380,560c-100,-90-60,-300 120,-300c180,0 220,210 120,300c-30,30-40,60-40,90l-160,0c0,-30-10,-60-40,-90Z', 'M420,700l160,0M440,760l120,0', raios(500, 400, 330, 400, 9, -Math.PI)],
  coracao: ['M500,820C200,600 160,420 260,330c90,-80 200,-40 240,40c40,-80 150,-120 240,-40c100,90 60,270-240,490Z'],
  seta: ['M150,500L820,500', 'M680,360L840,500L680,640'],
  ciclo: ['M500,200a300,300 0 1,1 -260,150', 'M190,260L240,350L330,320'],
};

// ---------- 4. a máquina ----------

export type CenaMaquina = {
  /** as frases da fala que a cena cobre (contando do 0): [primeira, última] */
  frases: [number, number];
  /** o nome em DESENHOS (ou a lista de traços do desenho novo) */
  desenho: string | string[];
  /** linha curta em Cinzel embaixo da frase (passo, número, fonte); opcional */
  rotulo?: string;
};

const tracosDe = (d: string | string[], extra?: Record<string, string[]>) => (Array.isArray(d) ? d : (extra?.[d] ?? DESENHOS[d] ?? DESENHOS.luz));
const textoDe = (fala: Fala, [a, b]: [number, number]) => fala.frases.slice(a, b + 1).map((f) => f.texto).join(' ');

/**
 * O vídeo inteiro a partir de dados. A frase 0 da fala é o título (fica escrito no quadro 0); cada item de `cenas`
 * cobre as frases dele e mostra o desenho com a frase escrita. O `fecho` desenha um símbolo na última frase.
 */
export const Maquina: React.FC<{
  fala: Fala;
  titulo: string;
  subtitulo?: string;
  cenas: CenaMaquina[];
  fecho?: {desenho: string | string[]; linha?: string};
  desenhos?: Record<string, string[]>;
  trilha?: string;
}> = ({fala, titulo, subtitulo, cenas, fecho, desenhos, trilha}) => {
  const lista = React.useMemo(() => {
    const primeira = tracosDe(cenas[0]?.desenho ?? 'luz', desenhos);
    const Ab: React.FC<PropsCena> = ({t, dur}) => <Abertura titulo={titulo} subtitulo={subtitulo} tracos={primeira} t={t} dur={dur} />;
    const itens: [number, number, React.FC<PropsCena>, number][] = [[0, 0, Ab, 0]];
    cenas.forEach((c, k) => {
      const ultima = k === cenas.length - 1;
      const C: React.FC<PropsCena> = ({t, dur}) => {
        const sai = ultima && fecho ? ramp(t, dur - 1.15, dur - 0.85) : ultima ? 0 : ramp(t, dur - 0.4, dur);
        return (
          <>
            <Desenho tracos={tracosDe(c.desenho, desenhos)} t={t} sai={sai} />
            <Texto frase={textoDe(fala, c.frases)} rotulo={c.rotulo} t={t} sai={sai} />
            {ultima && fecho && t > dur - 1.0 && <Fecho tracos={tracosDe(fecho.desenho, desenhos)} linha={fecho.linha} t={(t - (dur - 1.0)) * 2.2} />}
          </>
        );
      };
      itens.push([c.frases[0], c.frases[1], C, 0]);
    });
    return cenasPorFrase(fala, itens);
  }, [fala, titulo, subtitulo, cenas, fecho, desenhos]);
  return <Filme tema={tema} fala={fala} cenas={lista} legenda={false} trilha={trilha} />;
};

// ---------- 5. o exemplo: o ciclo da água ----------

export const Exemplo: React.FC = () => (
  <Maquina
    fala={FALA_EXEMPLO}
    titulo="O ciclo da água"
    subtitulo="em quatro passos"
    cenas={[
      {frases: [1, 1], desenho: 'sol', rotulo: 'I'},
      {frases: [2, 2], desenho: 'nuvem', rotulo: 'II'},
      {frases: [3, 3], desenho: 'chuva', rotulo: 'III'},
      {frases: [4, 4], desenho: 'planta', rotulo: 'IV'},
    ]}
    fecho={{desenho: 'ciclo'}}
  />
);
