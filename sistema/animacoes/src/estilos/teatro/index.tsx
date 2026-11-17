// ESTILO: Teatrinho de papel
// Um palco de brinquedo com moldura de madeira, cortina vermelha e luzes de ribalta.
// Tudo é recorte de papel colorido com borda branca, preso em vareta, em camadas
// a distâncias diferentes (3D leve). A cortina fecha e abre entre as cenas.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarRye} from '@remotion/google-fonts/Rye';
import {loadFont as carregarAlfa} from '@remotion/google-fonts/AlfaSlabOne';
import type {PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, Palco3D, Plano, Tela, acaso, balanco, cenasPorFrase, chega, elastico, ramp, useTela} from '../../kit';

const {fontFamily: CARTAZ} = carregarRye('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: FORTE} = carregarAlfa('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** As cores do papel: vivas e chapadas, como cartolina. */
export const COR = {
  creme: '#fbf1dc',
  amarelo: '#f7b733',
  laranja: '#ef7b2d',
  vermelho: '#c8322b',
  azul: '#2f7fc1',
  azulClaro: '#7cc3e8',
  marinho: '#1f4f86',
  verde: '#4caf50',
  verdeEscuro: '#2e7d3a',
  branco: '#f7f9fb',
  cinza: '#9aa7b8',
  marrom: '#7a4a2a',
} as const;

/** O retângulo da boca de cena, em proporção da tela. */
const boca = (L: number, A: number) => ({x0: L * 0.08, x1: L * 0.92, y0: A * 0.12, y1: A * 0.57});

/** A plateia escura e os filtros do papel (os filtros moram aqui pra todas as camadas usarem). */
const Fundo: React.FC<{t: number}> = () => {
  const {L, A, u} = useTela();
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%, #3a1a10 0%, #1c0c07 60%, #0e0604 100%)'}}>
      <Tela>
        <defs>
          {/* recorte: borda branca de papel, sombra no cenário de trás e grão de cartolina */}
          <filter id="teatro-recorte" x="-25%" y="-25%" width="150%" height="150%">
            <feMorphology in="SourceAlpha" operator="dilate" radius={5 * u} result="borda" />
            <feFlood floodColor={COR.creme} />
            <feComposite in2="borda" operator="in" result="branco" />
            <feGaussianBlur in="borda" stdDeviation={7 * u} />
            <feOffset dx={8 * u} dy={12 * u} result="sb" />
            <feFlood floodColor="#000" floodOpacity={0.4} />
            <feComposite in2="sb" operator="in" result="sombra" />
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} />
            <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0.25 0" />
            <feComposite in2="SourceAlpha" operator="in" result="grao" />
            <feMerge>
              <feMergeNode in="sombra" />
              <feMergeNode in="branco" />
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="grao" />
            </feMerge>
          </filter>
          <linearGradient id="teatro-cortina" x1="0" x2="1">
            <stop offset="0" stopColor="#4a0c09" />
            <stop offset="0.5" stopColor="#a8231b" />
            <stop offset="1" stopColor="#4a0c09" />
          </linearGradient>
        </defs>
        {/* as cabeças da plateia, lá embaixo */}
        {Array.from({length: 9}, (_, i) => (
          <circle key={i} cx={L * (0.05 + i * 0.112)} cy={A * 0.99} r={(60 + acaso(`cab${i}`) * 20) * u} fill="#080302" />
        ))}
      </Tela>
    </AbsoluteFill>
  );
};

export const tema: Tema = {
  id: 'teatro',
  nome: 'Teatrinho de papel',
  fundo: '#1c0c07',
  tinta: COR.creme,
  acento: COR.amarelo,
  legenda: {
    fonte: FORTE,
    peso: 400,
    tamanho: 62,
    cor: COR.creme,
    destaque: COR.amarelo,
    sombra: '0 4px 0 #0e0604, 0 0 16px #0e0604',
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** Uma camada do cenário a uma distância (`z` negativo é mais pro fundo). Use dentro do <Palco>. */
export const Camada: React.FC<{z?: number; children: React.ReactNode}> = ({z = 0, children}) => (
  <Plano z={z}>
    <Tela>{children}</Tela>
  </Plano>
);

/** O céu pintado do fundo do palco: a primeira camada de toda cena. */
export const Ceu: React.FC<{de?: string; ate?: string}> = ({de = '#9fd6f2', ate = '#fde7b0'}) => {
  const {L, A} = useTela();
  return (
    <Camada z={-320}>
      <defs>
        <linearGradient id={`teatro-ceu-${de.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={de} />
          <stop offset="1" stopColor={ate} />
        </linearGradient>
      </defs>
      <rect x={-L * 0.3} y={-A * 0.3} width={L * 1.6} height={A * 1.6} fill={`url(#teatro-ceu-${de.slice(1)})`} />
    </Camada>
  );
};

/**
 * O palco inteiro: as camadas dentro da boca de cena, a moldura, a ribalta e a cortina.
 * `cortina` de 0 (aberta) a 1 (fechada) é a transição do estilo. `t` dá a vida da luz.
 */
export const Palco: React.FC<{t: number; cortina: number; children: React.ReactNode}> = ({t, cortina, children}) => {
  const {L, A, u} = useTela();
  const b = boca(L, A);
  const meio = L / 2;
  const fecha = Math.max(0, Math.min(1, cortina));
  // cada metade da cortina corre da borda até o meio, com a barra ondulada
  const metade = (lado: 1 | -1) => {
    const borda = lado < 0 ? b.x0 - 30 * u : b.x1 + 30 * u;
    const ponta = lado < 0 ? b.x0 + 70 * u + (meio - b.x0 - 70 * u) * fecha : b.x1 - 70 * u - (b.x1 - 70 * u - meio) * fecha;
    const curva = ponta - lado * 50 * u * (1 - fecha);
    return `M${borda} ${b.y0 - 20 * u} L${ponta} ${b.y0 - 20 * u} Q${curva} ${(b.y0 + b.y1) / 2} ${ponta + lado * 20 * u * (1 - fecha)} ${b.y1 + 10 * u} L${borda} ${b.y1 + 10 * u} Z`;
  };
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', inset: 0, clipPath: `inset(${b.y0}px ${L - b.x1}px ${A - b.y1}px ${b.x0}px)`}}>
        <Palco3D viraY={balanco(t, 0.25) * 2.5} viraX={1.5}>
          {children}
        </Palco3D>
      </div>
      <Tela>
        {/* a cortina, por cima do cenário e por baixo da moldura */}
        <path d={metade(-1)} fill="url(#teatro-cortina)" />
        <path d={metade(1)} fill="url(#teatro-cortina)" />
        {/* moldura de madeira com filete dourado */}
        <rect x={b.x0 - 22 * u} y={b.y0 - 22 * u} width={b.x1 - b.x0 + 44 * u} height={b.y1 - b.y0 + 44 * u} fill="none" stroke="#5a3218" strokeWidth={44 * u} />
        <rect x={b.x0 - 4 * u} y={b.y0 - 4 * u} width={b.x1 - b.x0 + 8 * u} height={b.y1 - b.y0 + 8 * u} fill="none" stroke="#d9a441" strokeWidth={6 * u} />
        {/* o bandô de cima, com franja em gomos */}
        <path
          d={`M${b.x0 - 44 * u} ${b.y0 - 44 * u} L${b.x1 + 44 * u} ${b.y0 - 44 * u} L${b.x1 + 44 * u} ${b.y0 + 30 * u} ${Array.from({length: 8}, (_, i) => {
            const x = b.x1 + 44 * u - ((i + 1) * (b.x1 - b.x0 + 88 * u)) / 8;
            return `Q${x + (b.x1 - b.x0 + 88 * u) / 16} ${b.y0 + 80 * u} ${x} ${b.y0 + 30 * u}`;
          }).join(' ')} Z`}
          fill="url(#teatro-cortina)"
        />
        {/* a ribalta: tábua da frente com lâmpadas que tremem */}
        <rect x={b.x0 - 44 * u} y={b.y1 + 22 * u} width={b.x1 - b.x0 + 88 * u} height={40 * u} fill="#3d2010" />
        {Array.from({length: 7}, (_, i) => {
          const x = b.x0 + ((i + 0.5) * (b.x1 - b.x0)) / 7;
          const brilho = 0.75 + 0.25 * balanco(t, 2, i);
          return (
            <g key={i}>
              <ellipse cx={x} cy={b.y1 + 20 * u} rx={60 * u} ry={26 * u} fill="#ffcf7a" opacity={0.25 * brilho} />
              <circle cx={x} cy={b.y1 + 26 * u} r={11 * u} fill="#fff1c4" opacity={brilho} />
            </g>
          );
        })}
      </Tela>
    </AbsoluteFill>
  );
};

/** Um recorte de papel com borda branca e sombra. `vareta` desenha a haste que segura por baixo. */
export const Recorte: React.FC<{x: number; y: number; esc?: number; giro?: number; vareta?: number; children: React.ReactNode}> = ({
  x,
  y,
  esc = 1,
  giro = 0,
  vareta = 0,
  children,
}) => {
  const {u} = useTela();
  return (
    <g transform={`translate(${x} ${y})`}>
      {vareta > 0 && <line x1={0} y1={0} x2={6 * u} y2={vareta} stroke="#3d2010" strokeWidth={7 * u} strokeLinecap="round" />}
      <g transform={`rotate(${giro}) scale(${esc})`} filter="url(#teatro-recorte)">
        {children}
      </g>
    </g>
  );
};

/** O cartaz de título: cai do alto pendurado em dois fios e balança. `p` de 0 a 1 faz ele descer. */
export const Cartaz: React.FC<{y: number; linhas: string[]; p: number; t: number; tamanho?: number}> = ({y, linhas, p, t, tamanho = 110}) => {
  const {L, u} = useTela();
  if (p <= 0) return null;
  const h = (linhas.length * 1.15 + 0.7) * tamanho * u;
  const w = L * 0.68;
  const yy = y - (1 - ramp(p, 0, 1, elastico)) * (y + h);
  return (
    <g transform={`rotate(${balanco(t, 0.6) * 1.8} ${L / 2} 0)`}>
      <line x1={L / 2 - w * 0.35} y1={0} x2={L / 2 - w * 0.35} y2={yy - h / 2} stroke="#2a1608" strokeWidth={4 * u} />
      <line x1={L / 2 + w * 0.35} y1={0} x2={L / 2 + w * 0.35} y2={yy - h / 2} stroke="#2a1608" strokeWidth={4 * u} />
      <g filter="url(#teatro-recorte)">
        <rect x={L / 2 - w / 2} y={yy - h / 2} width={w} height={h} rx={10 * u} fill={COR.vermelho} />
        <rect x={L / 2 - w / 2 + 18 * u} y={yy - h / 2 + 18 * u} width={w - 36 * u} height={h - 36 * u} rx={6 * u} fill={COR.creme} />
      </g>
      {linhas.map((l, i) => (
        <text
          key={i}
          x={L / 2}
          y={yy - h / 2 + (0.35 + 0.95 + i * 1.15) * tamanho * u}
          textAnchor="middle"
          fontFamily={CARTAZ}
          fontSize={tamanho * u}
          fill={COR.vermelho}
        >
          {l}
        </text>
      ))}
    </g>
  );
};

/** A cortina de cada cena: abre no começo e fecha no fim (a última cena passa `fim={false}`). */
export const cortinaDe = (t: number, dur: number, fim = true) => Math.max(1 - ramp(t, 0, 0.6, chega), fim ? ramp(t, dur - 0.45, dur) : 0);

// ---------- 3. alguns desenhos prontos ----------
// Todo desenho recebe o centro (x, y), o tamanho e `p` (0 a 1), e é um <Recorte>
// com formas chapadas. Coisa nova: contorno simples, uma ou duas cores, vareta.

type Desenho = {x: number; y: number; tam?: number; p: number; t?: number};

/** Sol de papel que sobe na vareta e gira devagar. */
export const Sol: React.FC<Desenho> = ({x, y, tam = 200, p, t = 0}) => {
  const {A} = useTela();
  if (p <= 0) return null;
  const sobe = (1 - ramp(p, 0, 1, elastico)) * A * 0.35;
  const n = 14;
  const raios = Array.from({length: n * 2}, (_, i) => {
    const a = (i / (n * 2)) * Math.PI * 2;
    const r = i % 2 ? tam * 0.36 : tam * 0.5;
    return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
  }).join(' ');
  return (
    <Recorte x={x} y={y + sobe} giro={t * 14} vareta={A * 0.5}>
      <polygon points={raios} fill={COR.amarelo} />
      <circle r={tam * 0.27} fill={COR.laranja} />
      <circle r={tam * 0.17} fill={COR.amarelo} />
    </Recorte>
  );
};

/** Nuvem de papel que entra de lado e boia. `peso` de 0 a 1 escurece e baixa a nuvem. */
export const Nuvem: React.FC<Desenho & {peso?: number}> = ({x, y, tam = 360, p, t = 0, peso = 0}) => {
  const {L} = useTela();
  if (p <= 0) return null;
  const entra = (1 - ramp(p, 0, 1, chega)) * L * 0.8;
  const cor = peso > 0.5 ? COR.cinza : COR.branco;
  const w = tam;
  return (
    <Recorte x={x - entra} y={y + balanco(t, 0.5) * w * 0.03 + peso * w * 0.08} esc={1 + peso * 0.08}>
      <path
        d={`M${-w * 0.5} ${w * 0.12} Q${-w * 0.56} ${-w * 0.1} ${-w * 0.3} ${-w * 0.1} Q${-w * 0.25} ${-w * 0.34} ${0} ${-w * 0.26} Q${w * 0.2} ${-w * 0.4} ${w * 0.32} ${-w * 0.12} Q${w * 0.56} ${-w * 0.08} ${w * 0.5} ${w * 0.12} Z`}
        fill={cor}
      />
    </Recorte>
  );
};

/** Gotas de papel caindo entre `y` e `y + altura`. `forca` de 0 a 1 liga aos poucos. */
export const Chuva: React.FC<{x: number; y: number; largura: number; altura: number; t: number; forca?: number; gotas?: number}> = ({
  x,
  y,
  largura,
  altura,
  t,
  forca = 1,
  gotas = 12,
}) => {
  const {u} = useTela();
  const g = 26 * u;
  return (
    <g filter="url(#teatro-recorte)">
      {Array.from({length: gotas}, (_, i) => {
        if (i / gotas >= forca) return null;
        const fase = (t * (0.8 + acaso(`tv${i}`) * 0.4) + acaso(`tf${i}`)) % 1;
        const px = x - largura / 2 + ((i + 0.5) / gotas) * largura + (acaso(`tx${i}`) - 0.5) * 30 * u;
        const py = y + fase * altura;
        return <path key={i} d={`M${px} ${py - g * 1.3} Q${px + g} ${py + g * 0.4} ${px} ${py + g * 0.6} Q${px - g} ${py + g * 0.4} ${px} ${py - g * 1.3} Z`} fill={COR.azul} />;
      })}
    </g>
  );
};

/** O mar do teatrinho: três faixas de onda que correm em sentidos opostos. `p` faz subir do chão. */
export const Mar: React.FC<{y: number; p: number; t: number}> = ({y, p, t}) => {
  const {L, A, u} = useTela();
  const cores = [COR.azulClaro, COR.azul, COR.marinho];
  return (
    <>
      {cores.map((cor, k) => {
        const yy = y + k * 55 * u + (1 - ramp(p, k * 0.15, 0.6 + k * 0.15, chega)) * A * 0.3;
        const passo = 120 * u;
        const corre = (((k % 2 ? -1 : 1) * t * 70 * u) % passo) - passo;
        let d = `M${-L * 0.2 + corre} ${A}`;
        for (let x = -L * 0.2 + corre; x < L * 1.25; x += passo) d += ` L${x} ${yy} Q${x + passo / 2} ${yy - 38 * u} ${x + passo} ${yy}`;
        d += ` L${L * 1.3} ${A} Z`;
        return (
          <g key={k} filter="url(#teatro-recorte)">
            <path d={d} fill={cor} />
          </g>
        );
      })}
    </>
  );
};

/** Planta de papel que brota do chão: caule sobe e as folhas abrem com um pulo. */
export const Planta: React.FC<Desenho> = ({x, y, tam = 300, p, t = 0}) => {
  if (p <= 0) return null;
  const alto = tam * ramp(p, 0, 0.6, chega);
  const folha = (lado: 1 | -1, h: number, q: number) =>
    q > 0 ? (
      <path
        d={`M0 ${-h} Q${lado * tam * 0.3 * q} ${-h - tam * 0.25 * q} ${lado * tam * 0.38 * q} ${-h - tam * 0.05 * q} Q${lado * tam * 0.2 * q} ${-h + tam * 0.06 * q} 0 ${-h} Z`}
        fill={COR.verde}
      />
    ) : null;
  return (
    <Recorte x={x} y={y} giro={balanco(t, 0.7) * 3}>
      <rect x={-tam * 0.03} y={-alto} width={tam * 0.06} height={alto} fill={COR.verdeEscuro} />
      {folha(-1, alto * 0.45, ramp(p, 0.3, 0.7, elastico))}
      {folha(1, alto * 0.7, ramp(p, 0.45, 0.85, elastico))}
      {p > 0.7 && <circle cy={-alto} r={tam * 0.1 * ramp(p, 0.7, 1, elastico)} fill={COR.vermelho} />}
    </Recorte>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const Titulo: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <Palco t={t} cortina={cortinaDe(t, dur)}>
      <Ceu de="#f6c27a" ate="#fde7b0" />
      <Camada z={-120}>
        <Mar y={A * 0.5} p={1} t={t} />
      </Camada>
      <Camada>
        <Cartaz y={A * 0.32} linhas={['O ciclo', 'da água']} p={ramp(t, 0.2, 1)} t={t} tamanho={112} />
        <Recorte x={L * 0.17} y={A * 0.2} esc={u}>
          <circle r={20} fill={COR.amarelo} />
        </Recorte>
      </Camada>
    </Palco>
  );
};

const SolEMar: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <Palco t={t} cortina={cortinaDe(t, dur)}>
      <Ceu />
      <Camada z={-180}>
        <Sol x={L * 0.62} y={A * 0.25} tam={250 * u} p={ramp(t, 0.2, 1.2)} t={t} />
      </Camada>
      <Camada z={-60}>
        {/* o calor: risquinhos laranja que tremem sobre a água */}
        {[0.3, 0.5, 0.7].map((fx, i) => {
          const q = ramp(t, 1.2 + i * 0.2, 1.6 + i * 0.2);
          return q > 0 ? (
            <Recorte key={i} x={L * fx} y={A * 0.42 - balanco(t, 2, i) * 10 * u} esc={q}>
              <path d={`M0 0 q${20 * u} ${-25 * u} 0 ${-50 * u} q${-20 * u} ${-25 * u} 0 ${-50 * u}`} stroke={COR.laranja} strokeWidth={14 * u} fill="none" strokeLinecap="round" />
            </Recorte>
          ) : null;
        })}
      </Camada>
      <Camada>
        <Mar y={A * 0.46} p={ramp(t, 0, 0.9)} t={t} />
      </Camada>
    </Palco>
  );
};

const VaporENuvem: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <Palco t={t} cortina={cortinaDe(t, dur)}>
      <Ceu />
      <Camada z={-150}>
        <Nuvem x={L * 0.5} y={A * 0.22} tam={(260 + ramp(t, 0.8, dur) * 180) * u} p={ramp(t, 0.6, 1.4)} t={t} />
        {/* o vapor: bolinhas de papel que sobem do mar até a nuvem */}
        {Array.from({length: 6}, (_, i) => {
          const fase = (t * 0.6 + i / 6) % 1;
          return (
            <Recorte key={i} x={L * (0.3 + (i % 3) * 0.2) + Math.sin(fase * 6 + i) * 20 * u} y={A * (0.46 - fase * 0.22)} esc={1 - fase * 0.4}>
              <circle r={22 * u} fill={COR.branco} opacity={1 - fase * 0.5} />
            </Recorte>
          );
        })}
      </Camada>
      <Camada>
        <Mar y={A * 0.48} p={1} t={t} />
      </Camada>
    </Palco>
  );
};

const NuvemEChuva: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <Palco t={t} cortina={cortinaDe(t, dur)}>
      <Ceu de="#7d8fa6" ate="#c9d3dc" />
      <Camada z={-150}>
        <Chuva x={L * 0.5} y={A * 0.27} largura={420 * u} altura={A * 0.24} t={t} forca={ramp(t, 0.7, 1.6)} />
        <Nuvem x={L * 0.5} y={A * 0.22} tam={480 * u} p={1} t={t} peso={ramp(t, 0.2, 0.8)} />
      </Camada>
      <Camada>
        <Mar y={A * 0.5} p={1} t={t} />
      </Camada>
    </Palco>
  );
};

const ChuvaEPlanta: React.FC<PropsCena> = ({t, dur}) => {
  const {L, A, u} = useTela();
  return (
    <Palco t={t} cortina={cortinaDe(t, dur, false)}>
      <Ceu />
      <Camada z={-150}>
        <Nuvem x={L * 0.42} y={A * 0.2} tam={400 * u} p={1} t={t} peso={1 - ramp(t, 1.2, 2.2)} />
        <Chuva x={L * 0.42} y={A * 0.25} largura={340 * u} altura={A * 0.2} t={t} forca={1 - ramp(t, 1.6, 2.4)} gotas={9} />
      </Camada>
      <Camada>
        {/* o morro de grama, com a planta brotando nele */}
        <Planta x={L * 0.6} y={A * 0.5} tam={330 * u} p={ramp(t, 0.6, 2.4)} t={t} />
        <Recorte x={L * 0.5} y={A * 0.5}>
          <path d={`M${-L * 0.6} ${A * 0.2} L${-L * 0.6} ${0} Q${0} ${-A * 0.05} ${L * 0.6} ${0} L${L * 0.6} ${A * 0.2} Z`} fill={COR.verdeEscuro} />
        </Recorte>
      </Camada>
    </Palco>
  );
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={FALA_EXEMPLO}
    // a frase 0 é o título, que já está no cartaz: sem legenda nesse trecho
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
