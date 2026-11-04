// cena14 — Paper Desk (Mesa de papéis). Palco base 1080x1350, recomposto em qualquer formato.
// Num vídeo real, as folhas trazem o print/documento real com origem e o grifo cai na frase exata.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont as loadCaslon} from '@remotion/google-fonts/LibreCaslonText';
import {loadFont as loadMono} from '@remotion/google-fonts/IBMPlexMono';
import {loadFont as loadTight} from '@remotion/google-fonts/InterTight';
import {loadFont as loadMarker} from '@remotion/google-fonts/PermanentMarker';

const {fontFamily: CASLON} = loadCaslon('normal', {weights: ['400', '700'], subsets: ['latin']});
const {fontFamily: MONO} = loadMono('normal', {weights: ['500'], subsets: ['latin']});
const {fontFamily: TIGHT} = loadTight('normal', {weights: ['800'], subsets: ['latin']});
const {fontFamily: MARKER} = loadMarker('normal', {weights: ['400'], subsets: ['latin']});

export type Trecho = {t: string; g?: boolean};
export type Cena14Props = {
  width?: number;
  height?: number;
  figura?: string;
  tituloGrafico?: string[];
  citacaoRotulo?: string;
  citacao?: Trecho[][];
  etiqueta?: string;
  nota?: string;
  vermelho?: string;
  amarelo?: string;
};

const PAPEL = '#F4F2EC', PRETO = '#151515', CINZA = '#55524B';

const Grao: React.FC<{id: string; seed: number; op?: number}> = ({id, seed, op = 0.22}) => (
  <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'multiply', opacity: op, pointerEvents: 'none'}}>
    <filter id={id}><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={3} seed={seed} /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width="100%" height="100%" filter={`url(#${id})`} />
  </svg>
);

/** física de uma folha: entra levantada de fora do quadro, cai acelerando, bate, pula de leve, desliza e para */
const usaFolha = (frame: number, fps: number, q: number, de: [number, number], rot: number, dur = 9) => {
  const t = interpolate(frame, [q, q + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)});
  const pousou = frame >= q + dur;
  const pos = interpolate(frame, [q - 2, q + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const altura = 1 - t;
  const pulo = pousou ? Math.max(0, Math.sin(((frame - q - dur) / 4) * Math.PI)) * (frame - q - dur < 4 ? 5 : 0) : 0;
  const desliza = pousou ? interpolate(frame - q - dur, [0, 5], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)}) : 0;
  const r = spring({frame: frame - q, fps, config: {damping: 10, stiffness: 140, mass: 0.6}});
  return {
    visivel: frame >= q - 2,
    x: de[0] * (1 - pos) + desliza * 6,
    y: de[1] * (1 - pos) - pulo,
    esc: 1 + altura * 0.1,
    rot: rot * r + (1 - pos) * rot * 3,
    sombra: `0 1px 1px rgba(0,0,0,${0.45 - altura * 0.35}), ${8 + altura * 40}px ${10 + altura * 50}px ${14 + altura * 40}px rgba(0,0,0,${0.35 - altura * 0.15})`,
    pousou: q + dur,
  };
};

export const Cena14: React.FC<Cena14Props> = ({
  width = 1080,
  height = 1350,
  figura = 'FIG. 2 · RETENÇÃO, PRIMEIROS 30 SEGUNDOS',
  tituloGrafico = ['A maioria decide nos', 'três primeiros segundos'],
  citacaoRotulo = 'DAS ANOTAÇÕES · P. 14',
  citacao = [
    [{t: 'Nos últimos vídeos, a maior'}],
    [{t: 'queda veio sempre cedo.'}],
    [{t: 'Quem passou do terceiro segundo', g: true}],
    [{t: 'quase sempre ficou até o fim.', g: true}],
    [{t: 'Depois disso, a linha ficou reta.'}],
  ],
  etiqueta = 'O GANCHO',
  nota = 'SAEM AQUI',
  vermelho = '#D4231B',
  amarelo = '#FFE024',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = Math.min(width / 1080, height / 1350);

  const fA = usaFolha(frame, fps, -4, [-500, -300], -1.5);
  const fB = usaFolha(frame, fps, 10, [700, 420], 2.5);
  const fC = usaFolha(frame, fps, 24, [-700, 300], -2.5);
  const fita = (q: number) => {
    const t = interpolate(frame, [q, q + 6], [1.35, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)});
    const amassa = frame >= q + 6 && frame < q + 9 ? 0.96 : 1;
    return {display: frame >= q ? 'block' : 'none', transform: `scale(${t * amassa})`};
  };
  // câmera de mão: ~7% de empurrão, 1 grau, deriva lenta e um tranco a cada pouso
  const empurra = interpolate(frame, [0, 120], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  const tranco = [fA.pousou, fB.pousou, fC.pousou, 40, 44].reduce((s, q) => s + (frame >= q ? Math.exp(-(frame - q) / 3) * Math.sin((frame - q) * 1.6) * 3 : 0), 0);
  const deriva = frame < 120 ? Math.sin(frame / 37) * 3 : Math.sin(120 / 37) * 3;

  // marcador e marca-texto
  const circ = interpolate(frame, [52, 66], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  const letras = Math.floor(interpolate(frame, [68, 84], [0, nota.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const haste = interpolate(frame, [86, 91], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  const vee = interpolate(frame, [92, 96], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const linhasG = citacao.map((l, i) => (l.some((s) => s.g) ? i : -1)).filter((i) => i >= 0);
  const grifo = (o: number) => interpolate(frame, [98 + o * 9, 98 + o * 9 + 7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.3, 1)});

  const curva = Array.from({length: 40}, (_, i) => {
    const x = i / 39;
    const y = 0.15 + 0.62 * (1 - Math.exp(-x * 9)) + Math.sin(x * 26) * 0.02;
    return `${i ? 'L' : 'M'}${70 + x * 560},${60 + y * 230}`;
  }).join(' ');

  const linhasGrade: React.ReactNode[] = [];
  for (let i = -2; i < 50; i++) {
    const forte = i % 5 === 0;
    linhasGrade.push(<line key={'v' + i} x1={i * 30} y1={-200} x2={i * 30} y2={1700} stroke="#ECE8B4" strokeOpacity={forte ? 0.22 : 0.09} strokeWidth={forte ? 1.5 : 1} />);
    linhasGrade.push(<line key={'h' + i} x1={-200} y1={i * 30} x2={1500} y2={i * 30} stroke="#ECE8B4" strokeOpacity={forte ? 0.22 : 0.09} strokeWidth={forte ? 1.5 : 1} />);
  }

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: 'radial-gradient(ellipse at 50% 45%, #327354 0%, #2D684C 50%, #245A40 100%)'}}>
      <div style={{position: 'absolute', left: (width - 1080 * k) / 2, top: (height - 1350 * k) / 2, width: 1080, height: 1350, transform: `scale(${k})`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', inset: 0, transform: `translate(${deriva + tranco * 0.6}px, ${tranco}px) scale(${1 + empurra * 0.07}) rotate(${empurra * 1}deg)`, transformOrigin: '45% 45%'}}>
          {/* tapete de corte */}
          <svg width={1500} height={1700} style={{position: 'absolute', left: -200, top: -200}}>
            <g transform="translate(200,200)">{linhasGrade}</g>
            {Array.from({length: 30}, (_, i) => <text key={i} x={210} y={200 + i * 150 + 6} fill="#ECE8B4" fillOpacity={0.35} fontSize={14} fontFamily={MONO}>{i * 5}</text>)}
            <path d="M300 1300 L760 1180" stroke="#1d4a35" strokeWidth={2} opacity={0.6} />
            <path d="M1000 300 L1180 520" stroke="#1d4a35" strokeWidth={1.5} opacity={0.5} />
            <ellipse cx={420} cy={1380} rx={120} ry={30} fill="#3a7c5c" opacity={0.25} />
          </svg>
          {/* folha do gráfico */}
          {fA.visivel && (
            <div style={{position: 'absolute', left: 80, top: 160, width: 760, height: 560, background: PAPEL, transform: `translate(${fA.x}px, ${fA.y}px) scale(${fA.esc}) rotate(${fA.rot}deg)`, boxShadow: fA.sombra}}>
              <Grao id="as14g1" seed={2} />
              <div style={{position: 'absolute', left: 40, top: 34, fontFamily: MONO, fontSize: 13, letterSpacing: 2.5, color: CINZA}}>{figura}</div>
              <div style={{position: 'absolute', left: 40, top: 60, fontFamily: CASLON, fontWeight: 700, fontSize: 36, lineHeight: 1.12, color: PRETO}}>{tituloGrafico.map((l) => <div key={l}>{l}</div>)}</div>
              <svg width={700} height={420} style={{position: 'absolute', left: 0, top: 130}}>
                <line x1={70} y1={40} x2={70} y2={330} stroke={PRETO} strokeWidth={2} />
                <line x1={70} y1={330} x2={650} y2={330} stroke={PRETO} strokeWidth={2} />
                <line x1={70} y1={160} x2={650} y2={160} stroke="#bdb8ad" strokeDasharray="3 6" />
                <text x={36} y={64} fontFamily={MONO} fontSize={13} fill={CINZA}>100%</text>
                <text x={70} y={356} fontFamily={MONO} fontSize={13} fill={CINZA}>0 s</text>
                <text x={610} y={356} fontFamily={MONO} fontSize={13} fill={CINZA}>30 s</text>
                <path d={curva} stroke={PRETO} strokeWidth={3.5} fill="none" strokeLinecap="round" />
                {/* círculo vermelho de marcador */}
                <path d="M118 70 C 40 90, 40 260, 120 290 C 200 310, 240 170, 190 95 C 160 55, 120 60, 105 80" stroke={vermelho} strokeWidth={7} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${circ} 1`} opacity={circ > 0 ? 0.95 : 0} />
                {/* seta: haste e depois um V */}
                <path d="M330 120 L 222 132" stroke={vermelho} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${haste} 1`} opacity={haste > 0 ? 1 : 0} />
                <path d="M244 112 L 220 132 L 246 152" stroke={vermelho} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${vee} 1`} opacity={vee > 0 ? 1 : 0} />
                <text x={344} y={134} fontFamily={MARKER} fontSize={38} fill={vermelho}>{nota.slice(0, letras)}</text>
              </svg>
              {/* fita no canto */}
              <div style={{position: 'absolute', right: -40, top: -18, width: 150, height: 40, background: 'rgba(230,217,180,0.85)', transformOrigin: 'center', ...fita(36), rotate: '8deg', boxShadow: '0 1px 2px rgba(0,0,0,0.15)'}} />
            </div>
          )}
          {/* folha da citação */}
          {fB.visivel && (
            <div style={{position: 'absolute', left: 445, top: 790, width: 560, height: 330, background: PAPEL, transform: `translate(${fB.x}px, ${fB.y}px) scale(${fB.esc}) rotate(${fB.rot}deg)`, boxShadow: fB.sombra}}>
              <Grao id="as14g2" seed={5} />
              <div style={{position: 'absolute', left: 34, top: 28, fontFamily: MONO, fontSize: 12, letterSpacing: 2.5, color: CINZA}}>{citacaoRotulo}</div>
              <div style={{position: 'absolute', left: 34, top: 58, fontFamily: CASLON, fontSize: 25, lineHeight: '40px', color: PRETO}}>
                {citacao.map((l, i) => (
                  <div key={i} style={{whiteSpace: 'nowrap'}}>
                    {l.map((s, j) => {
                      if (!s.g) return <span key={j}>{s.t}</span>;
                      const p = grifo(linhasG.indexOf(i));
                      return (
                        <span key={j} style={{position: 'relative', display: 'inline-block'}}>
                          <span style={{position: 'absolute', left: -3, right: -4, top: 7, bottom: 2, background: amarelo, mixBlendMode: 'multiply', opacity: 0.85, clipPath: `polygon(0 0, ${p * 103}% 0, ${p * 103 - 2}% 100%, 0 100%)`, borderRadius: 3}} />
                          <span style={{position: 'relative'}}>{s.t}</span>
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* etiqueta recortada, presa com fita em dois cantos */}
          {fC.visivel && (
            <div style={{position: 'absolute', left: 95, top: 870, transform: `translate(${fC.x}px, ${fC.y}px) scale(${fC.esc}) rotate(${fC.rot}deg)`}}>
              <div style={{background: '#fff', padding: '14px 28px', fontFamily: TIGHT, fontWeight: 800, fontSize: 62, letterSpacing: -3, color: PRETO, boxShadow: fC.sombra, position: 'relative'}}>
                <Grao id="as14g3" seed={8} op={0.12} />
                {etiqueta}
              </div>
              <div style={{position: 'absolute', left: -40, top: -14, width: 110, height: 36, background: 'rgba(230,217,180,0.85)', rotate: '-35deg', ...fita(40)}} />
              <div style={{position: 'absolute', right: -40, bottom: -14, width: 110, height: 36, background: 'rgba(230,217,180,0.85)', rotate: '-30deg', ...fita(44)}} />
            </div>
          )}
        </div>
      </div>
      <Grao id="as14filme" seed={frame % 9} op={0.12} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)'}} />
    </AbsoluteFill>
  );
};
