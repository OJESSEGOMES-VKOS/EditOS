// cena06 — Magazine Layout and Note (Página de revista com nota). Componente reutilizável (EditOS, cenas/estilos).
// A página se monta (cada linha sobe da sua máscara, a foto abre como persiana) e uma caneta vermelha anota na margem.
// Desenho em espaço 1080x1350 (4:5) centralizado; o papel preenche qualquer formato.
import React, {useEffect, useRef, useState} from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, delayRender, continueRender, random} from 'remotion';
import {loadFont as loadBodoni} from '@remotion/google-fonts/BodoniModa';
import {loadFont as loadNews} from '@remotion/google-fonts/Newsreader';
import {loadFont as loadNota} from '@remotion/google-fonts/LaBelleAurore';

const {fontFamily: bodoni} = loadBodoni('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
loadBodoni('italic', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: news} = loadNews('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']});
loadNews('italic', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: nota} = loadNota('normal', {weights: ['400'], subsets: ['latin']});

export type MagazineNoteProps = {
  titulo?: [string, string]; // linha 2 entra em itálico e recuada
  numero?: string;
  corpo?: string[]; // linhas da coluna estreita
  legenda?: string;
  nota?: [string, string]; // a anotação em caneta, duas linhas
  foto?: string; // opcional: foto do dono (vira duotone); sem ela, o mar ao entardecer é pintado
  largura?: number;
  altura?: number;
  cores?: {papel: string; tinta: string; caneta: string; duoEscuro: string; duoClaro: string};
};

const CORES = {papel: '#EAEDED', tinta: '#1B1E25', caneta: '#C42E26', duoEscuro: '#242E46', duoClaro: '#E2E7EC'};
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Sobe: React.FC<{d: number; children: React.ReactNode; style?: React.CSSProperties}> = ({d, children, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - d, fps, config: {damping: 10, stiffness: 150}});
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.12em', ...style}}>
      <div style={{transform: `translateY(${(1 - p) * 115}%)`}}>{children}</div>
    </div>
  );
};

// mar ao entardecer pintado, em duotone
const Mar: React.FC<{w: number; h: number; c: typeof CORES; f: number}> = ({w, h, c, f}) => {
  const hor = h * 0.6;
  const brilhos = Array.from({length: 90}, (_, i) => {
    const y = hor + 8 + Math.pow(random(`gy${i}`), 1.3) * (h - hor - 10);
    const spread = 20 + ((y - hor) / (h - hor)) * 120;
    return {x: w * 0.5 + (random(`gx${i}`) - 0.5) * 2 * spread, y, l: 6 + random(`gl${i}`) * 20, a: 0.4 + random(`ga${i}`) * 0.6};
  });
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id="ceu06" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5d677d" /><stop offset="0.5" stopColor="#aab3c2" /><stop offset="1" stopColor={c.duoClaro} /></linearGradient>
        <linearGradient id="mar06" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6c7690" /><stop offset="0.35" stopColor="#3d4762" /><stop offset="1" stopColor={c.duoEscuro} /></linearGradient>
        <radialGradient id="sol06"><stop offset="0" stopColor="#fff" /><stop offset="0.35" stopColor="#f4f6f8" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
        <filter id="nuv06"><feGaussianBlur stdDeviation="10" /></filter>
        <filter id="grao06"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={3} /><feColorMatrix type="saturate" values="0" /></filter>
      </defs>
      <rect width={w} height={hor} fill="url(#ceu06)" />
      <circle cx={w * 0.5} cy={h * 0.36} r={150} fill="url(#sol06)" opacity={0.9} />
      <circle cx={w * 0.5} cy={h * 0.36} r={52} fill="#fbfcfd" />
      <g filter="url(#nuv06)" fill={c.duoEscuro}>
        <ellipse cx={w * 0.3} cy={h * 0.2} rx={260} ry={34} opacity={0.35} />
        <ellipse cx={w * 0.8} cy={h * 0.27} rx={220} ry={26} opacity={0.3} />
        <ellipse cx={w * 0.45} cy={h * 0.43} rx={340} ry={30} opacity={0.5} />
        <ellipse cx={w * 0.15} cy={h * 0.5} rx={240} ry={40} opacity={0.45} />
        <ellipse cx={w * 0.85} cy={h * 0.52} rx={220} ry={36} opacity={0.4} />
      </g>
      <rect y={hor} width={w} height={h - hor} fill="url(#mar06)" />
      <ellipse cx={w * 0.5} cy={hor + 40} rx={90} ry={60} fill="#e9edf2" opacity={0.25} filter="url(#nuv06)" />
      {brilhos.map((b, i) => (
        <rect key={i} x={b.x - b.l / 2} y={b.y} width={b.l} height={2.2} fill="#f2f4f7" opacity={b.a * (0.6 + 0.4 * Math.sin(f * 0.3 + i))} />
      ))}
      <rect width={w} height={h} filter="url(#grao06)" opacity={0.16} style={{mixBlendMode: 'overlay'}} />
    </svg>
  );
};

// anotação escrita letra a letra seguindo o traço (contorno de cada letra desenhado por stroke-dash)
const Nota: React.FC<{texto: string; x: number; y: number; inicio: number; vel: number; cor: string; tam: number}> = ({texto, x, y, inicio, vel, cor, tam}) => {
  const f = useCurrentFrame();
  const ref = useRef<SVGTextElement>(null);
  const [pos, setPos] = useState<number[] | null>(null);
  const [handle] = useState(() => delayRender('medir nota'));
  useEffect(() => {
    document.fonts.ready.then(() => {
      const el = ref.current;
      if (el) setPos(Array.from(texto).map((_, i) => el.getStartPositionOfChar(i).x));
      continueRender(handle);
    });
  }, [handle, texto]);
  // tempo de cada letra: velocidade de mão + pausa entre palavras
  let t = inicio;
  const ini: number[] = [];
  Array.from(texto).forEach((c) => {
    ini.push(t);
    t += c === ' ' ? 4 : vel;
  });
  const L = 420;
  return (
    <g transform={`translate(${x} ${y})`}>
      <text ref={ref} x={0} y={0} fontFamily={nota} fontSize={tam} fill="none" opacity={0}>{texto}</text>
      {pos && Array.from(texto).map((c, i) => {
        if (c === ' ') return null;
        const p = interpolate(f, [ini[i], ini[i] + vel * 1.6], [0, 1], cl);
        if (p <= 0) return null;
        return (
          <text key={i} x={pos[i]} y={0} fontFamily={nota} fontSize={tam} fill={p >= 1 ? cor : 'none'} stroke={cor} strokeWidth={1.3} strokeDasharray={L} strokeDashoffset={L * (1 - p)}>{c}</text>
        );
      })}
    </g>
  );
};

export const MagazineNote: React.FC<MagazineNoteProps> = ({
  titulo = ['Notas sobre', 'a luz lenta.'],
  numero = '(03)',
  corpo = ['Algumas tardes o mar', 'fica quieto antes do', 'céu. A gente ficou', 'até a cor ir embora', 'e guardou os últimos', 'dez minutos pra nós.'],
  legenda = 'Prancha 4. O mar, um minuto depois.',
  nota = ['leia isto', 'duas vezes.'],
  foto,
  largura,
  altura,
  cores = CORES,
}) => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const W = largura ?? width;
  const H = altura ?? height;
  const s = Math.min(W / 1080, H / 1350);

  // foto abre de baixo pra cima como persiana, saindo de um leve empurrão e seguindo à deriva
  const abre = spring({frame: f + 4, fps, config: {damping: 13, stiffness: 90}});
  const corte = (1 - abre) * 100;
  const empurra = 1.1 - 0.07 * spring({frame: f, fps, config: {damping: 20, stiffness: 40}}) - f * 0.00025;

  const regua = interpolate(f, [-4, 10], [0.6, 1], cl);
  const seta = interpolate(f, [84, 100], [0, 1], {...cl, easing: (t) => 1 - Math.pow(1 - t, 2)});
  const ponta = f >= 103;

  const photoX = 99;
  const photoY = 531;
  const photoW = 522;
  const photoH = 698;

  return (
    <AbsoluteFill style={{backgroundColor: cores.papel, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: (W - 1080 * s) / 2, top: (H - 1350 * s) / 2, width: 1080, height: 1350, transform: `scale(${s})`, transformOrigin: '0 0', color: cores.tinta}}>
        <div style={{position: 'absolute', left: 90, top: 134, width: 870 * regua, height: 2, background: cores.tinta, opacity: 0.75}} />
        <Sobe d={-6} style={{position: 'absolute', left: 88, top: 150, fontFamily: bodoni, fontSize: 158, letterSpacing: '-0.03em', lineHeight: 1}}>{titulo[0]}</Sobe>
        <Sobe d={-2} style={{position: 'absolute', left: 226, top: 318, fontFamily: bodoni, fontStyle: 'italic', fontSize: 158, letterSpacing: '-0.03em', lineHeight: 1}}>{titulo[1]}</Sobe>
        {/* foto */}
        <div style={{position: 'absolute', left: photoX, top: photoY, width: photoW, height: photoH, overflow: 'hidden', clipPath: `inset(${corte}% 0 0 0)`}}>
          <div style={{width: '100%', height: '100%', transform: `scale(${empurra})`}}>
            {foto ? (
              <img src={foto} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.05)', mixBlendMode: 'multiply'}} />
            ) : (
              <Mar w={photoW} h={photoH} c={cores} f={f} />
            )}
          </div>
        </div>
        <Sobe d={12} style={{position: 'absolute', left: photoX, top: 1246, fontFamily: news, fontStyle: 'italic', fontSize: 22, opacity: 0.75}}>{legenda}</Sobe>
        {/* coluna estreita */}
        <Sobe d={6} style={{position: 'absolute', left: 657, top: 540, fontFamily: news, fontSize: 25}}>{numero}</Sobe>
        {corpo.map((l, i) => (
          <Sobe key={i} d={9 + i * 2.5} style={{position: 'absolute', left: 657, top: 586 + i * 36, fontFamily: news, fontSize: 25, lineHeight: 1.3, whiteSpace: 'nowrap'}}>{l}</Sobe>
        ))}
        {/* caneta */}
        <svg width={1080} height={1350} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <g transform="rotate(-7 760 960)">
            <Nota texto={nota[0]} x={660} y={930} inicio={30} vel={2.6} cor={cores.caneta} tam={64} />
            <Nota texto={nota[1]} x={705} y={1030} inicio={58} vel={2.6} cor={cores.caneta} tam={64} />
          </g>
          <path d="M700 1048 C676 1060 662 1040 676 1030 C692 1020 700 1050 676 1068 C620 1110 520 1040 452 846" fill="none" stroke={cores.caneta} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - seta} opacity={f >= 84 ? 1 : 0} />
          {ponta && <path d="M432 878 L452 846 L470 880" fill="none" stroke={cores.caneta} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      </div>
      {/* papel: grão estático, fibras longas e dente multiplicado sobre tudo */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, mixBlendMode: 'multiply', pointerEvents: 'none'}}>
        <filter id="papel06"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed={7} /><feColorMatrix type="matrix" values="0 0 0 0 0.92  0 0 0 0 0.93  0 0 0 0 0.94  0 0 0 -0.9 0.62" /></filter>
        <filter id="fibra06"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.18" numOctaves="2" seed={11} /><feColorMatrix type="matrix" values="0 0 0 0 0.9  0 0 0 0 0.91  0 0 0 0 0.92  0 0 0 -1.2 0.7" /></filter>
        <rect width={W} height={H} filter="url(#papel06)" opacity={0.5} />
        <rect width={W} height={H} filter="url(#fibra06)" opacity={0.35} />
      </svg>
    </AbsoluteFill>
  );
};
