// cena02 — Frosted Glass UI (Vidro fosco). Componente reutilizável (EditOS, cenas/estilos).
// Desenho em espaço 1080x1350 (4:5) centralizado; o fundo desfocado preenche qualquer formato.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, random} from 'remotion';
import {loadFont} from '@remotion/google-fonts/PlusJakartaSans';

const {fontFamily} = loadFont('normal', {weights: ['400', '500', '600'], subsets: ['latin', 'latin-ext']});

export type Linha = {titulo: string; rotulo: string; icone: 'cor' | 'camera' | 'texto'};
export type FrostedGlassProps = {
  placeholder?: string;
  busca?: string;
  linhas?: Linha[];
  escolhida?: number; // índice da linha selecionada no fim
  largura?: number;
  altura?: number;
  fotoFundo?: string; // opcional: imagem do dono para o fundo (vai desfocada); sem ela, o fundo é pintado
};

const T = '#F8F9FB';
const CARET = '#9FD8FF';

// Fundo: "foto" desfocada pintada com campos de cor (céu teal→azul, brilho coral no horizonte, rosa, luzes de cidade).
const Fundo: React.FC<{W: number; H: number; f: number; blur: number; foto?: string}> = ({W, H, f, blur, foto}) => {
  const dx = Math.sin(f / 70) * 6;
  const dy = Math.cos(f / 90) * 4;
  const luzes = Array.from({length: 26}, (_, i) => ({
    x: 0.02 + random(`lx${i}`) * 0.96,
    y: 0.74 + random(`ly${i}`) * 0.1 + (i % 3) * 0.012,
    r: 10 + random(`lr${i}`) * (i < 6 ? 60 : 24),
    a: 0.25 + random(`la${i}`) * 0.5,
  }));
  return (
    <div style={{position: 'absolute', inset: -60, transform: `translate(${dx}px, ${dy}px)`}}>
      {foto ? (
        <img src={foto} style={{width: '100%', height: '100%', objectFit: 'cover', filter: `blur(${blur}px)`}} />
      ) : (
        <div style={{position: 'absolute', inset: 0}}>
          <div style={{position: 'absolute', inset: 0, filter: `blur(${blur}px)`}}>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #1d5c6c 0%, #24607a 22%, #2f4f7c 40%, #6b4f86 52%, #c4577f 63%, #e4677a 72%, #f08a6c 80%, #b46a6c 90%, #3a2a3e 100%)'}} />
          <div style={{position: 'absolute', left: '-20%', top: '-10%', width: '80%', height: '60%', borderRadius: '50%', background: 'radial-gradient(closest-side, #1F6E78 0%, #1F5A6E00 100%)'}} />
          <div style={{position: 'absolute', right: '-25%', top: '-15%', width: '90%', height: '65%', borderRadius: '50%', background: 'radial-gradient(closest-side, #2b2f6e 0%, #0E2A3D00 100%)'}} />
          <div style={{position: 'absolute', left: '30%', top: '40%', width: '90%', height: '35%', borderRadius: '50%', background: 'radial-gradient(closest-side, #E3558Acc 0%, #E3558A00 100%)'}} />
          <div style={{position: 'absolute', left: '-20%', top: '62%', width: '80%', height: '35%', borderRadius: '50%', background: 'radial-gradient(closest-side, #FF8A5Ccc 0%, #FF8A5C00 100%)'}} />
          <div style={{position: 'absolute', left: '40%', top: '66%', width: '70%', height: '30%', borderRadius: '50%', background: 'radial-gradient(closest-side, #ff7a6a99 0%, #ff7a6a00 100%)'}} />
          </div>
          {luzes.map((l, i) => (
            <div key={i} style={{position: 'absolute', left: `${l.x * 100}%`, top: `${l.y * 100}%`, width: l.r * 2, height: l.r * 2, marginLeft: -l.r, marginTop: -l.r, borderRadius: '50%', background: i % 4 === 0 ? '#ffd9c8' : '#ffc3a8', opacity: l.a, filter: `blur(${i < 6 ? 2 : 1}px)`}} />
          ))}
          <div style={{position: 'absolute', left: '6%', top: '33%', width: 150, height: 150, borderRadius: '50%', background: '#7fc7c2', opacity: 0.22}} />
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, #0000 55%, #0E2A3D88 100%)'}} />
        </div>
      )}
    </div>
  );
};

const Icone: React.FC<{tipo: Linha['icone']}> = ({tipo}) => (
  <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth={2}>
    {tipo === 'cor' && (<><circle cx={12} cy={12} r={8} /><path d="M12 4a8 8 0 0 0 0 16z" fill={T} /></>)}
    {tipo === 'camera' && (<><rect x={3} y={7} width={12} height={10} rx={2} /><path d="M15 11l6-3v8l-6-3" /></>)}
    {tipo === 'texto' && (<path d="M6 6h12M12 6v13" strokeLinecap="round" />)}
  </svg>
);

const vidro = (raio: number): React.CSSProperties => ({
  borderRadius: raio,
  background: 'linear-gradient(135deg, rgba(255,255,255,0.20) 0%, rgba(230,236,245,0.10) 45%, rgba(40,50,70,0.10) 100%)',
  backdropFilter: 'blur(26px) saturate(0.75) brightness(0.92)',
  WebkitBackdropFilter: 'blur(26px) saturate(0.75) brightness(0.92)',
  border: '2px solid rgba(255,255,255,0.32)',
  borderTopColor: 'rgba(255,255,255,0.55)',
  borderLeftColor: 'rgba(255,255,255,0.5)',
  boxShadow: '0 24px 60px rgba(10,20,40,0.35), inset 0 0 22px rgba(255,255,255,0.10), inset 1px 1px 0 rgba(255,255,255,0.35)',
  overflow: 'hidden',
});

export const FrostedGlass: React.FC<FrostedGlassProps> = ({
  placeholder = 'Pesquise ou pergunte qualquer coisa',
  busca = 'meus vídeos com cara premium',
  linhas = [
    {titulo: 'Cor de cinema', rotulo: 'Cor', icone: 'cor'},
    {titulo: 'Câmera lenta e suave', rotulo: 'Câmera', icone: 'camera'},
    {titulo: 'Títulos limpos e mínimos', rotulo: 'Tipografia', icone: 'texto'},
  ],
  escolhida = 1,
  largura,
  altura,
  fotoFundo,
}) => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const W = largura ?? width;
  const H = altura ?? height;
  const s = Math.min(W / 1080, H / 1350);

  // digitação humana: ~1,3 quadro por letra, com pequena variação e uma pausa entre palavras
  const inicio = 4;
  const tempos: number[] = [];
  let t = inicio;
  for (let i = 0; i < busca.length; i++) {
    t += 1.05 + (random(`d${i}`) - 0.5) * 0.6 + (busca[i - 1] === ' ' ? 1.5 : 0);
    tempos.push(t);
  }
  const digitadas = tempos.filter((x) => x <= f).length;
  const fimDigitacao = tempos[tempos.length - 1] + 6;
  const digitando = f < fimDigitacao - 4;
  const caretOn = digitando || Math.floor(f / 12) % 2 === 0;

  const entra = spring({frame: f, fps, from: 0.9, to: 1, config: {damping: 12, stiffness: 140}});
  const sobe = spring({frame: f - fimDigitacao, fps, config: {damping: 16, stiffness: 120}});
  const abre = spring({frame: f - fimDigitacao - 3, fps, config: {damping: 11, stiffness: 120}});

  const barW = 918;
  const barH = 150;
  const barY = interpolate(sobe, [0, 1], [650, 440]);
  const painelTop = 440 + barH + 22;
  const linhaH = 128;
  const painelH = linhas.length * linhaH + 36;

  // destaque: passa pela linha 0 e estica até a escolhida; borda da frente rígida, de trás macia
  const tDest = fimDigitacao + 22;
  const tMuda = tDest + 18;
  const frente = spring({frame: f - tMuda, fps, config: {damping: 18, stiffness: 260}});
  const tras = spring({frame: f - tMuda, fps, config: {damping: 20, stiffness: 70}});
  const topoA = 18 + 0 * linhaH;
  const topoB = 18 + escolhida * linhaH;
  const yFrente = topoA + (topoB - topoA) * frente;
  const yTras = topoA + (topoB - topoA) * tras;
  const destTop = Math.min(yFrente, yTras);
  const destH = Math.abs(yFrente - yTras) + linhaH;
  const destVis = spring({frame: f - tDest, fps, config: {damping: 14, stiffness: 200}});
  const tPress = tMuda + 16;
  const press = interpolate(f, [tPress, tPress + 3, tPress + 8], [1, 0.97, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tecla = spring({frame: f - tPress - 2, fps, config: {damping: 9, stiffness: 180}});

  return (
    <AbsoluteFill style={{backgroundColor: '#0E2A3D', overflow: 'hidden'}}>
      <Fundo W={W} H={H} f={f} blur={22} foto={fotoFundo} />
      <div style={{position: 'absolute', left: (W - 1080 * s) / 2, top: (H - 1350 * s) / 2, width: 1080, height: 1350, transform: `scale(${s})`, transformOrigin: '0 0', fontFamily, color: T}}>
        {/* barra de busca */}
        <div style={{position: 'absolute', left: (1080 - barW) / 2, top: barY, width: barW, height: barH, ...vidro(48), transform: `scale(${entra})`, display: 'flex', alignItems: 'center', gap: 22, padding: '0 46px', zIndex: 2}}>
          <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth={2.4}><circle cx={10.5} cy={10.5} r={6.5} /><path d="M15.5 15.5L20 20" strokeLinecap="round" /></svg>
          <div style={{fontSize: 46, fontWeight: 500, whiteSpace: 'pre', textShadow: '0 1px 6px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center'}}>
            {digitadas === 0 && <span style={{display: 'inline-block', width: 3, height: 52, background: CARET, opacity: caretOn ? 1 : 0, marginRight: 4}} />}
            <span style={{opacity: digitadas === 0 ? 0.62 : 1}}>{digitadas === 0 ? placeholder : busca.slice(0, digitadas)}</span>
            {digitadas > 0 && <span style={{display: 'inline-block', width: 3, height: 52, background: CARET, opacity: caretOn ? 1 : 0, marginLeft: 3}} />}
          </div>
        </div>
        {/* painel de resultados que desdobra por trás da barra */}
        {f >= fimDigitacao && (
          <div style={{position: 'absolute', left: (1080 - barW) / 2, top: painelTop - 70 * (1 - abre), width: barW, height: painelH * Math.max(0.05, abre), ...vidro(26), zIndex: 1}}>
            <div style={{position: 'absolute', left: 14, right: 14, top: destTop, height: destH - 0, borderRadius: 14, background: 'rgba(255,255,255,0.16)', border: '1.5px solid rgba(255,255,255,0.22)', transform: `scale(${press}) scaleY(${destVis})`, opacity: f >= tDest ? 1 : 0}} />
            {linhas.map((l, i) => {
              const cai = spring({frame: f - fimDigitacao - 6 - i * 3, fps, config: {damping: 10, stiffness: 160}});
              return (
                <div key={i} style={{position: 'absolute', left: 36, right: 36, top: 18 + i * linhaH, height: linhaH, display: 'flex', alignItems: 'center', gap: 28, transform: `translateY(${(1 - cai) * -60}px)`, opacity: cai > 0.02 ? 1 : 0}}>
                  <div style={{width: 64, height: 64, borderRadius: 16, background: 'rgba(255,255,255,0.16)', border: '1.5px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icone tipo={l.icone} /></div>
                  <div style={{flex: 1, textShadow: '0 1px 6px rgba(0,0,0,0.25)'}}>
                    <div style={{fontSize: 41, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.1}}>{l.titulo}</div>
                    <div style={{fontSize: 29, fontWeight: 500, opacity: 0.65, lineHeight: 1.2}}>{l.rotulo}</div>
                  </div>
                  {i === escolhida && f >= tPress && (
                    <div style={{width: 54, height: 46, borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${tecla})`, fontSize: 28}}>↵</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.09, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
        <filter id="g02"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 24} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width={W} height={H} filter="url(#g02)" />
      </svg>
    </AbsoluteFill>
  );
};
