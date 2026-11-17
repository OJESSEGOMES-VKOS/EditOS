// ESTILO: Bordado
// Ponto-cruz num bastidor de madeira, em cima de uma toalha de linho. Todo
// desenho vira uma grade de pontos em X costurados um a um, com a agulha e a
// linha indo atrás; o tecido do bastidor pode ser tingido de qualquer cor, e a
// cena seguinte chega num pano novo esticado por cima.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarDM} from '@remotion/google-fonts/DMSerifDisplay';
import {loadFont as carregarPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import type {Ponto, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Tela, acaso, balanco, cenasPorFrase, chega, circulo, quando, ramp, useTela} from '../../kit';

const {fontFamily: SERIFA} = carregarDM('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: ITALICA} = carregarPlayfair('italic', {weights: ['700'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As linhas de bordar: cores de meada, médias e firmes (precisam aparecer no tecido claro e no tingido). */
export const LINHA = {
  azul: '#2f5d8c',
  ceu: '#4f86b8',
  amarelo: '#e0a21c',
  laranja: '#d0722a',
  vermelho: '#a5452f',
  verde: '#3f7d3a',
  verdeClaro: '#6fa65a',
  marrom: '#7a5432',
  branco: '#fbf8f1',
  cinza: '#8a8f9a',
  tinta: '#2f2a3a',
} as const;

/** Tecidos pra tingir o bastidor (a aida é o tecido cru de ponto-cruz). */
export const TECIDO = {cru: '#f6f1e6', ceu: '#cfe2ee', nublado: '#d9dde2', noite: '#2c3550', campo: '#e6efd6'} as const;

/** A toalha de linho por baixo de tudo: trama fina de fios cruzados. */
const Fundo: React.FC<{t: number}> = () => {
  const {L, A, u} = useTela();
  return (
    <AbsoluteFill style={{background: '#e9dfcc'}}>
      <Tela>
        <defs>
          <pattern id="bordado-linho" width={8 * u} height={8 * u} patternUnits="userSpaceOnUse">
            <rect width={8 * u} height={8 * u} fill="#ebe2cf" />
            <path d={`M0,${2 * u}H${8 * u}M0,${6 * u}H${8 * u}`} stroke="#d8ccb3" strokeWidth={1.6 * u} />
            <path d={`M${2 * u},0V${8 * u}M${6 * u},0V${8 * u}`} stroke="#e1d6bf" strokeWidth={1.2 * u} />
          </pattern>
        </defs>
        <rect width={L} height={A} fill="url(#bordado-linho)" />
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'bordado',
  nome: 'Bordado',
  fundo: '#e9dfcc',
  tinta: LINHA.tinta,
  acento: LINHA.vermelho,
  legenda: {
    fonte: SERIFA,
    peso: 400,
    tamanho: 72,
    cor: LINHA.tinta,
    destaque: LINHA.vermelho,
    sombra: '0 0 4px #f6f1e6, 0 0 10px #f6f1e6, 0 0 18px #efe6d4, 0 2px 0 #f6f1e6',
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** O lugar do bastidor na tela: centro e raio. Fica todo acima da faixa da legenda. */
export const useAro = () => {
  const {L, A, u} = useTela();
  const r = Math.min(L * 0.4, A * 0.24);
  return {cx: L / 2, cy: A * 0.06 + 78 * u + r, r, cel: 22 * u, u};
};

/**
 * O bastidor: aro de madeira com o tecido esticado (`tecido`, a cor do pano) e o parafuso no alto.
 * Tudo que é bordado vai dentro dele (SVG), e fica preso ao círculo do pano.
 */
export const Bastidor: React.FC<{tecido?: string; children?: React.ReactNode}> = ({tecido = TECIDO.cru, children}) => {
  const {cx, cy, r, cel, u} = useAro();
  return (
    <AbsoluteFill>
      <Tela>
        <defs>
          <pattern id="bordado-aida" width={cel} height={cel} patternUnits="userSpaceOnUse">
            {[0, cel].map((x) => [0, cel].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2.2 * u} fill="#000" opacity={0.13} />))}
          </pattern>
          <radialGradient id="bordado-madeira" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.93" stopColor="#b98a52" />
            <stop offset="0.97" stopColor="#d7aa6c" />
            <stop offset="1" stopColor="#8e6232" />
          </radialGradient>
          <filter id="bordado-sombra">
            <feDropShadow dx="0" dy={10 * u} stdDeviation={14 * u} floodColor="#5a4428" floodOpacity="0.35" />
          </filter>
          <filter id="bordado-relevo">
            <feDropShadow dx={1.2 * u} dy={1.6 * u} stdDeviation={0.8 * u} floodColor="#3b2a14" floodOpacity="0.45" />
          </filter>
          <clipPath id="bordado-pano">
            <circle cx={cx} cy={cy} r={r + 4 * u} />
          </clipPath>
        </defs>
        <circle cx={cx} cy={cy} r={r + 34 * u} fill="url(#bordado-madeira)" filter="url(#bordado-sombra)" />
        <circle cx={cx} cy={cy} r={r + 4 * u} fill={tecido} />
        <circle cx={cx} cy={cy} r={r + 4 * u} fill="url(#bordado-aida)" />
        <g clipPath="url(#bordado-pano)">{children}</g>
        <circle cx={cx} cy={cy} r={r + 4 * u} fill="none" stroke="#7a5228" strokeWidth={3 * u} opacity={0.5} />
        <rect x={cx - 34 * u} y={cy - r - 62 * u} width={68 * u} height={40 * u} rx={8 * u} fill="#a07040" />
        <rect x={cx - 12 * u} y={cy - r - 78 * u} width={24 * u} height={30 * u} rx={6 * u} fill="#c7c2b8" />
      </Tela>
    </AbsoluteFill>
  );
};

/** Um ponto em X. `p` de 0 a 1: primeiro a perna "/", depois a "\" com o brilho da linha. */
export const Cruz: React.FC<{x: number; y: number; cor: string; p: number}> = ({x, y, cor, p}) => {
  const {cel, u} = useAro();
  if (p <= 0) return null;
  const h = cel / 2 - 2 * u;
  const a = Math.min(1, p * 2);
  const b = Math.max(0, p * 2 - 1);
  return (
    <g strokeLinecap="round">
      <line x1={x - h} y1={y + h} x2={x - h + 2 * h * a} y2={y + h - 2 * h * a} stroke={cor} strokeWidth={6.5 * u} />
      {b > 0 && <line x1={x - h} y1={y - h} x2={x - h + 2 * h * b} y2={y - h + 2 * h * b} stroke={cor} strokeWidth={6.5 * u} />}
      {b > 0 && <line x1={x - h + 2 * u} y1={y - h + u} x2={x - h + 2 * u + (2 * h - 4 * u) * b} y2={y - h + u + (2 * h - 4 * u) * b} stroke="#fff" strokeWidth={1.4 * u} opacity={0.35} />}
    </g>
  );
};

/** Uma forma pra bordar: contorno fechado (`cheio`, preenchido em fileiras) ou linha aberta (ponto seguindo o traço). */
export type Forma = {pts: Ponto[]; cor: string; linha?: boolean};

const dentro = (q: Ponto, poly: Ponto[]) => {
  let r = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > q[1] !== yj > q[1] && q[0] < ((xj - xi) * (q[1] - yi)) / (yj - yi) + xi) r = !r;
  }
  return r;
};
const distancia = (q: Ponto, a: Ponto, b: Ponto) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const k = Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(q[0] - a[0] - k * dx, q[1] - a[1] - k * dy);
};

/** Passa as formas pra grade do tecido, na ordem em que se costura (forma por forma, de cima pra baixo ou ao longo da linha). */
export const pontosDe = (formas: Forma[], cel: number): {x: number; y: number; cor: string}[] => {
  const out: {x: number; y: number; cor: string; o: number}[] = [];
  formas.forEach((f, si) => {
    const xs = f.pts.map((q) => q[0]);
    const ys = f.pts.map((q) => q[1]);
    const x0 = Math.floor((Math.min(...xs) - cel) / cel) * cel;
    const y0 = Math.floor((Math.min(...ys) - cel) / cel) * cel;
    for (let gy = y0; gy <= Math.max(...ys) + cel; gy += cel)
      for (let gx = x0; gx <= Math.max(...xs) + cel; gx += cel) {
        const q: Ponto = [gx + cel / 2, gy + cel / 2];
        if (!f.linha) {
          if (dentro(q, f.pts)) out.push({x: q[0], y: q[1], cor: f.cor, o: si * 1e7 + gy * 10 + gx / cel});
        } else
          for (let j = 1; j < f.pts.length; j++)
            if (distancia(q, f.pts[j - 1], f.pts[j]) < cel * 0.6) {
              out.push({x: q[0], y: q[1], cor: f.cor, o: si * 1e7 + j * 1e4 + Math.hypot(q[0] - f.pts[j - 1][0], q[1] - f.pts[j - 1][1])});
              break;
            }
      }
  });
  return out.sort((a, b) => a.o - b.o);
};

/**
 * Borda as formas ponto a ponto. `p` de 0 a 1 é quanto já foi costurado; enquanto costura, a agulha
 * e a linha aparecem no ponto da vez. Use dentro do <Bastidor>.
 */
export const Costura: React.FC<{formas: Forma[]; p: number; agulha?: boolean}> = ({formas, p, agulha = true}) => {
  const {cel, u} = useAro();
  const pts = pontosDe(formas, cel);
  const n = pts.length;
  const feitos = Math.min(n, Math.max(0, p) * n);
  const vez = feitos > 0 && feitos < n ? pts[Math.floor(feitos)] : null;
  return (
    <>
      <g filter="url(#bordado-relevo)">
        {pts.slice(0, Math.ceil(feitos)).map((q, i) => (
          <Cruz key={i} x={q.x} y={q.y} cor={q.cor} p={Math.min(1, feitos - i)} />
        ))}
      </g>
      {agulha && vez && (
        <g>
          <path d={`M${vez.x},${vez.y} Q${vez.x + 60 * u},${vez.y - 120 * u} ${vez.x + 30 * u},${vez.y - 220 * u}`} stroke={vez.cor} strokeWidth={3 * u} fill="none" />
          <line x1={vez.x + 4 * u} y1={vez.y - 4 * u} x2={vez.x + 70 * u} y2={vez.y - 110 * u} stroke="#cfd3d8" strokeWidth={5 * u} strokeLinecap="round" />
          <line x1={vez.x + 6 * u} y1={vez.y - 8 * u} x2={vez.x + 60 * u} y2={vez.y - 98 * u} stroke="#fff" strokeWidth={1.5 * u} opacity={0.8} />
        </g>
      )}
    </>
  );
};

/**
 * Texto bordado no pano: letra serifada com a costura de "ponto atrás" (tracejado) embaixo, que aparece
 * da esquerda pra direita com `p`. `rotulo` é uma linha pequena em itálico por cima. `y` em proporção da altura.
 */
export const Letreiro: React.FC<{texto: string; p: number; y: number; rotulo?: string; tamanho?: number; cor?: string}> = ({
  texto,
  p,
  y,
  rotulo,
  tamanho = 120,
  cor = LINHA.tinta,
}) => {
  const {L, A, u} = useTela();
  if (p <= 0) return null;
  return (
    <div style={{position: 'absolute', top: A * y, left: 0, width: L, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      {rotulo && (
        <div style={{fontFamily: ITALICA, fontStyle: 'italic', fontWeight: 700, fontSize: 60 * u, color: LINHA.vermelho, opacity: Math.min(1, p * 2)}}>{rotulo}</div>
      )}
      <div
        style={{
          fontFamily: SERIFA,
          fontSize: tamanho * u,
          lineHeight: 1.02,
          color: cor,
          textAlign: 'center',
          whiteSpace: 'pre-line',
          textShadow: `${2 * u}px ${3 * u}px 0 rgba(165,69,47,0.25)`,
          clipPath: `inset(0 ${100 - Math.min(1, p) * 100}% 0 0)`,
        }}
      >
        {texto}
      </div>
      <div style={{width: L * 0.5 * Math.min(1, p), borderTop: `${5 * u}px dashed ${LINHA.vermelho}`, marginTop: 18 * u}} />
    </div>
  );
};

/**
 * A transição: um pano novo (com a cor do tecido da cena seguinte) desce esticado por cima do bordado,
 * preso ao aro. Ponha no fim da cena, dentro do <Bastidor>.
 */
export const PanoNovo: React.FC<{p: number; tecido: string}> = ({p, tecido}) => {
  const {cx, cy, r, u} = useAro();
  if (p <= 0) return null;
  const e = ramp(p, 0, 1, chega);
  const base = cy - r - 10 * u + e * (2 * r + 20 * u);
  // a barra do pano vem um pouco ondulada, como tecido que está sendo puxado
  const barra = Array.from({length: 13}, (_, k) => {
    const i = 12 - k;
    return `L${(cx - r - 10 * u + (i / 12) * (2 * r + 20 * u)).toFixed(1)},${(base + Math.sin(i * 1.3 + p * 9) * 10 * u * (1 - e)).toFixed(1)}`;
  }).join('');
  const d = `M${cx - r - 10 * u},${cy - r - 10 * u}L${cx + r + 10 * u},${cy - r - 10 * u}${barra}Z`;
  return (
    <g filter="url(#bordado-sombra)">
      <path d={d} fill={tecido} />
      <path d={d} fill="url(#bordado-aida)" />
    </g>
  );
};

// ---------- 3. alguns desenhos prontos ----------
// Todo desenho recebe a posição, o tamanho e `p` (0 a 1, quanto já foi bordado) e vira formas na <Costura>.
// Desenho novo segue o mesmo jeito: contornos cheios pro corpo, `linha` pro que é fino.

type Desenho = {x: number; y: number; tam?: number; p: number; t?: number};

/** Sol: disco amarelo, miolo laranja e oito raios em linha que crescem e encolhem. */
export const Sol: React.FC<Desenho> = ({x, y, tam = 120, p, t = 0}) => {
  const raios: Forma[] = Array.from({length: 8}, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    const r1 = tam * (1.55 + balanco(t, 1.2, i) * 0.15);
    return {pts: [[x + Math.cos(a) * tam * 1.25, y + Math.sin(a) * tam * 1.25], [x + Math.cos(a) * r1, y + Math.sin(a) * r1]], cor: LINHA.laranja, linha: true};
  });
  return (
    <>
      <Costura formas={[{pts: circulo(x, y, tam, tam, 24), cor: LINHA.amarelo}]} p={ramp(p, 0, 0.7)} />
      <Costura formas={[{pts: circulo(x, y, tam * 0.45, tam * 0.45, 16), cor: LINHA.laranja}]} p={ramp(p, 0.5, 0.8)} agulha={false} />
      <Costura formas={raios} p={ramp(p, 0.7, 1)} />
    </>
  );
};

/** Nuvem: três bolas preenchidas. */
export const Nuvem: React.FC<Desenho & {cor?: string}> = ({x, y, tam = 300, p, cor = LINHA.branco}) => (
  <Costura
    p={p}
    formas={[
      {pts: circulo(x - tam * 0.3, y + tam * 0.06, tam * 0.27, tam * 0.2, 18), cor},
      {pts: circulo(x, y - tam * 0.06, tam * 0.33, tam * 0.27, 20), cor},
      {pts: circulo(x + tam * 0.3, y + tam * 0.07, tam * 0.25, tam * 0.19, 18), cor},
    ]}
  />
);

/** Pingos bordados que descem de linha em linha da grade. `forca` de 0 a 1 liga a chuva aos poucos. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; pingos?: number}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  pingos = 10,
}) => {
  const {cel} = useAro();
  const formas: Forma[] = [];
  for (let i = 0; i < pingos; i++) {
    if (i / pingos >= forca) continue;
    const fase = (t * (0.7 + acaso(`cv${i}`) * 0.4) + acaso(`cf${i}`)) % 1;
    const px = x - largura / 2 + acaso(`cx${i}`) * largura;
    const py = y + fase * altura;
    formas.push({pts: [[px, py], [px, py + cel * 1.6]], cor: LINHA.ceu, linha: true});
  }
  return <Costura formas={formas} p={1} agulha={false} />;
};

/** O mar: duas faixas de onda (azul claro e escuro) que andam devagar de lado. */
export const Mar: React.FC<{y: number; p: number; t: number; baixo?: number}> = ({y, p, t, baixo}) => {
  const {cx, cy, r, u} = useAro();
  const fundo = baixo ?? cy + r;
  const faixa = (y0: number, k: number): Ponto[] => [
    ...Array.from({length: 13}, (_, i) => [cx - r + (i / 12) * 2 * r, y0 + Math.sin(i * 1.1 + t * 1.5 + k) * 18 * u] as Ponto),
    [cx + r, fundo + 10 * u],
    [cx - r, fundo + 10 * u],
  ];
  return (
    <>
      <Costura formas={[{pts: faixa(y, 0), cor: LINHA.ceu}]} p={ramp(p, 0, 0.6)} />
      <Costura formas={[{pts: faixa(y + 70 * u, 2), cor: LINHA.azul}]} p={ramp(p, 0.4, 1)} />
    </>
  );
};

/** Uma planta: o caule sobe em ponto de linha, duas folhas e um botão vermelho no alto. */
export const Planta: React.FC<Desenho> = ({x, y, tam = 300, p}) => {
  const folha = (lado: 1 | -1, h: number): Ponto[] => [
    [x, y - h],
    [x + lado * tam * 0.2, y - h - tam * 0.15],
    [x + lado * tam * 0.38, y - h - tam * 0.05],
    [x + lado * tam * 0.2, y - h + tam * 0.05],
  ];
  return (
    <>
      <Costura formas={[{pts: [[x, y], [x, y - tam]], cor: LINHA.verde, linha: true}]} p={ramp(p, 0, 0.35)} />
      <Costura formas={[{pts: folha(-1, tam * 0.35), cor: LINHA.verdeClaro}]} p={ramp(p, 0.3, 0.55)} />
      <Costura formas={[{pts: folha(1, tam * 0.6), cor: LINHA.verdeClaro}]} p={ramp(p, 0.5, 0.75)} />
      <Costura formas={[{pts: circulo(x, y - tam - tam * 0.1, tam * 0.14, tam * 0.14, 12), cor: LINHA.vermelho}]} p={ramp(p, 0.75, 1)} />
    </>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const F = FALA_EXEMPLO;
const local = (fala: PropsCena['fala'], palavra: string, frase: number) => quando(fala, palavra, frase) - F.frases[frase].s;

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {cx, cy, r, u} = useAro();
  return (
    <>
      <Bastidor tecido={TECIDO.cru}>
        {/* uma gota grande bordada no meio do pano */}
        <Costura
          p={ramp(t, 0, dur - 0.4)}
          formas={[{pts: [[cx, cy - r * 0.55], [cx + r * 0.32, cy + r * 0.05], ...circulo(cx, cy + r * 0.2, r * 0.36, r * 0.36, 20).slice(5, 16), [cx - r * 0.32, cy + r * 0.05]], cor: LINHA.ceu}]}
        />
        <PanoNovo p={ramp(t, dur - 0.4, dur)} tecido={TECIDO.ceu} />
      </Bastidor>
      <Letreiro texto="O ciclo da água" rotulo="bordado à mão" p={ramp(t, 0.1, 1.1)} y={0.57} tamanho={104} />
    </>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur, fala}) => {
  const {cx, cy, r, u} = useAro();
  const esquenta = local(fala, 'esquenta', 1);
  return (
    <Bastidor tecido={TECIDO.ceu}>
      <Sol x={cx} y={cy - r * 0.38} tam={r * 0.24} p={ramp(t, 0, 1)} t={t} />
      <Mar y={cy + r * 0.22} p={ramp(t, 0.3, 1.3)} t={t} />
      {/* o calor: três linhas onduladas laranja subindo do mar */}
      {[-0.4, 0, 0.4].map((dx, i) => {
        const s = ((t - esquenta + i * 0.3) % 1.2) / 1.2;
        const y0 = cy + r * 0.12 - s * r * 0.25;
        const pts: Ponto[] = Array.from({length: 4}, (_, k) => [cx + dx * r + Math.sin(k * 1.6 + t * 3) * 12 * u, y0 - k * 24 * u] as Ponto);
        return t > esquenta ? <Costura key={i} formas={[{pts, cor: LINHA.vermelho, linha: true}]} p={1} agulha={false} /> : null;
      })}
      <PanoNovo p={ramp(t, dur - 0.4, dur)} tecido={TECIDO.ceu} />
    </Bastidor>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur, fala}) => {
  const {cx, cy, r, u} = useAro();
  const nuvem = local(fala, 'nuvem', 2);
  return (
    <Bastidor tecido={TECIDO.ceu}>
      <Mar y={cy + r * 0.38} p={1} t={t} />
      {/* o vapor: pontos brancos soltos que sobem até a nuvem */}
      <Costura
        agulha={false}
        p={1}
        formas={Array.from({length: 7}, (_, i) => {
          const f = (t * 0.6 + i / 7) % 1;
          const px = cx + (i / 6 - 0.5) * r * 1.2 * (1 - f * 0.6);
          const py = cy + r * 0.3 - f * r * 0.6;
          return {pts: [[px, py], [px, py + 4 * u]], cor: LINHA.branco, linha: true};
        })}
      />
      <Nuvem x={cx} y={cy - r * 0.42} tam={r * (1.1 + ramp(t, nuvem, dur) * 0.25)} p={ramp(t, nuvem - 0.8, nuvem + 0.5)} />
      <PanoNovo p={ramp(t, dur - 0.4, dur)} tecido={TECIDO.nublado} />
    </Bastidor>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur, fala}) => {
  const {cx, cy, r} = useAro();
  const pesa = local(fala, 'pesa', 3);
  const chuva = local(fala, 'chuva', 3);
  const desce = ramp(t, pesa, pesa + 0.6) * r * 0.1;
  return (
    <Bastidor tecido={TECIDO.nublado}>
      <Chuva x={cx} y={cy - r * 0.15} largura={r * 1.2} altura={r * 0.95} t={t} forca={ramp(t, chuva - 0.4, chuva + 0.5)} pingos={12} />
      <Nuvem x={cx} y={cy - r * 0.42 + desce} tam={r * 1.5} p={ramp(t, 0, 0.9)} cor={t > pesa ? LINHA.cinza : LINHA.branco} />
      <PanoNovo p={ramp(t, dur - 0.4, dur)} tecido={TECIDO.campo} />
    </Bastidor>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t, fala}) => {
  const {cx, cy, r, u} = useAro();
  const planta = local(fala, 'planta', 4);
  const chao: Ponto[] = [[cx - r, cy + r * 0.55], [cx + r, cy + r * 0.5], [cx + r, cy + r + 10 * u], [cx - r, cy + r + 10 * u]];
  return (
    <Bastidor tecido={TECIDO.campo}>
      <Nuvem x={cx} y={cy - r * 0.62} tam={r * 1.1} p={1} cor={LINHA.cinza} />
      <Chuva x={cx} y={cy - r * 0.45} largura={r * 0.9} altura={r * 0.55} t={t} pingos={8} forca={1 - ramp(t, planta + 1, planta + 1.8)} />
      <Costura formas={[{pts: chao, cor: LINHA.marrom}]} p={ramp(t, 0, 0.8)} agulha={false} />
      <Planta x={cx} y={cy + r * 0.52} tam={r * 0.75} p={ramp(t, planta - 0.6, planta + 1.6)} />
    </Bastidor>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // o título já está bordado na tela: sem legenda nesse trecho
    semLegenda={[[0, FALA_EXEMPLO.frases[1].s]]}
    // corte seco: o pano novo que desce já é a transição
    cenas={cenasPorFrase(FALA_EXEMPLO, [
      [0, 0, Titulo, 0],
      [1, 1, SolEMar, 0],
      [2, 2, VaporENuvem, 0],
      [3, 3, NuvemEChuva, 0],
      [4, 4, ChuvaEPlanta, 0],
    ])}
  />
);
