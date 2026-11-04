// cena34 — Conversa em 3D (3D edição: chão quadriculado e balões flutuando em CSS 3D).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Figtree';

const {fontFamily: FIGTREE} = loadFont('normal', {weights: ['500', '600', '700'], subsets: ['latin']});

export type Mensagem = {texto: string; minha: boolean; chave?: boolean};
export type Cena34Props = {
  mensagens?: Mensagem[]; // até 5, uma pode ser a "chave"
  corMinha?: string;
  lida?: string;
  width?: number;
  height?: number;
  duracao?: number;
};

export const Cena34: React.FC<Cena34Props> = ({
  mensagens = [
    {texto: 'viu os números??', minha: false},
    {texto: 'não, o que houve', minha: true},
    {texto: 'bateu 1 milhão', minha: false, chave: true},
    {texto: 'da noite pro dia', minha: false},
    {texto: 'não acredito', minha: true},
  ],
  corMinha = '#2B5FF7',
  lida = 'Lida',
  width = 1080,
  height = 1350,
  duracao = 150,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = duracao / 150;
  const k = Math.min(width / 1080, height / 1350);
  const msgs = mensagens.slice(0, 5);

  // tempos: a chave vem depois de um "..." que cresce nela
  const tempos: number[] = [];
  let t = 0;
  msgs.forEach((m, i) => {
    if (i === 0) t = 0;
    else if (m.chave) t += 30;
    else t += msgs[i - 1].chave ? 16 : 15;
    tempos.push(t * s);
  });

  const ease = Easing.bezier(0.45, 0, 0.15, 1);
  const prog = interpolate(frame, [0, 118 * s], [0, 1], {extrapolateRight: 'clamp', easing: ease});
  const zoom = interpolate(prog, [0, 1], [560, 170]);
  const rotX = interpolate(prog, [0, 1], [30, 36]);
  const rotZ = interpolate(prog, [0, 1], [-16, -4]);
  const panX = interpolate(prog, [0, 1], [120, -45]);
  const panY = interpolate(prog, [0, 1], [140, -120]);

  // layout no chão (coordenadas do chão, y cresce para perto da câmera)
  const linhaY = (i: number) => -330 + i * 150 + (msgs[i]?.chave ? 10 : 0) + (i > 2 ? 20 : 0);

  const bolha = (m: Mensagem, i: number) => {
    const t0 = tempos[i];
    const pop = spring({frame: frame - t0, fps, config: {damping: 9, stiffness: 230}});
    if (frame < t0) {
      if (!m.chave || frame < t0 - 15 * s) return null;
    }
    const sobe = spring({frame: frame - t0 - 2, fps, config: {damping: 16, stiffness: 120}});
    const alt = 4 + 26 * sobe;
    const fs = m.chave ? 102 : 68;
    const pad = m.chave ? '24px 46px' : '18px 36px';
    // "..." antes da chave
    let conteudo: React.ReactNode = m.texto;
    let escalaX = 1;
    let largura: number | undefined;
    const ehDigitando = m.chave && frame < t0;
    if (m.chave) {
      const cresce = spring({frame: frame - t0, fps, config: {damping: 12, stiffness: 150}});
      if (ehDigitando) {
        const p0 = spring({frame: frame - (t0 - 15 * s), fps, config: {damping: 9, stiffness: 230}});
        escalaX = p0;
        conteudo = (
          <span style={{display: 'inline-flex', gap: 14, padding: '10px 4px'}}>
            {[0, 1, 2].map((d) => (
              <span key={d} style={{width: 18, height: 18, borderRadius: 9, background: '#8A93A3',
                transform: `translateY(${-6 * Math.max(0, Math.sin((frame - d * 3) * 0.45))}px)`}} />
            ))}
          </span>
        );
      } else {
        largura = interpolate(cresce, [0, 1], [150, 720]);
      }
    }
    const escala = ehDigitando ? escalaX : m.chave ? 1 : pop;
    const desfoque = Math.max(0, 1.6 - i * 0.6) * prog;
    const x = m.minha ? 400 : -400;
    return (
      <div key={i} style={{position: 'absolute', left: x, top: linhaY(i), transformStyle: 'preserve-3d'}}>
        {/* sombra no chão, empurrada para baixo/direita pela altura */}
        <div style={{position: 'absolute', [m.minha ? 'right' : 'left']: 0, top: -55, transform: `translate(${alt * 0.6}px, ${alt * 0.9}px) scale(${escala})`,
          transformOrigin: m.minha ? '100% 100%' : '0 100%', width: largura ?? undefined, height: m.chave ? 140 : 108, borderRadius: 40,
          background: 'rgba(30,45,90,0.16)', filter: `blur(${6 + alt * 0.5}px)`, padding: pad, fontSize: fs, fontFamily: FIGTREE, color: 'transparent', whiteSpace: 'nowrap', boxSizing: 'border-box'}}>
          {largura === undefined ? conteudo : null}
        </div>
        <div style={{position: 'absolute', [m.minha ? 'right' : 'left']: 0, top: -55, transform: `translateZ(${alt}px) scale(${escala})`,
          transformOrigin: m.minha ? '100% 100%' : '0 100%', filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>
          <div style={{background: m.minha ? corMinha : '#FFFFFF', color: m.minha ? '#FFFFFF' : '#10141B', borderRadius: m.chave ? 44 : 38,
            borderBottomLeftRadius: m.minha ? undefined : 10, borderBottomRightRadius: m.minha ? 10 : undefined,
            boxShadow: m.minha ? 'none' : 'inset 0 0 0 1.5px rgba(16,20,27,0.1)', padding: pad, fontFamily: FIGTREE, fontWeight: m.chave ? 700 : 500,
            fontSize: fs, letterSpacing: m.chave ? -1.5 : -0.5, whiteSpace: 'nowrap', lineHeight: 1.1, width: largura, overflow: 'hidden', boxSizing: 'border-box', height: ehDigitando ? 96 : undefined}}>
            {conteudo}
          </div>
          {i === msgs.length - 1 && m.minha && (() => {
            const r = spring({frame: frame - t0 - 9, fps, config: {damping: 18, stiffness: 160}});
            return (
              <div style={{overflow: 'hidden', height: 40, textAlign: 'right', marginTop: 8}}>
                <div style={{fontFamily: FIGTREE, fontWeight: 600, fontSize: 34, color: '#8A93A3', transform: `translateY(${(1 - r) * 40}px)`}}>{lida}</div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{background: '#EDF1F7', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 1080, height: 1350, marginLeft: -540, marginTop: -675, transform: `scale(${k})`}}>
        <div style={{position: 'absolute', inset: 0, perspective: 1500, perspectiveOrigin: '540px 300px'}}>
          <div style={{position: 'absolute', left: 540, top: 700, transformStyle: 'preserve-3d',
            transform: `translateZ(${zoom}px) translate(${panX}px, ${panY}px) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`}}>
            <div style={{position: 'absolute', left: -2400, top: -2400, width: 4800, height: 4800,
              backgroundColor: '#EDF1F7',
              backgroundImage: 'linear-gradient(#C3CCDB 2px, transparent 2px), linear-gradient(90deg, #C3CCDB 2px, transparent 2px), linear-gradient(#D2D9E5 1.5px, transparent 1.5px), linear-gradient(90deg, #D2D9E5 1.5px, transparent 1.5px)',
              backgroundSize: '440px 440px, 440px 440px, 110px 110px, 110px 110px', backgroundPosition: '-2px -2px'}} />
            {msgs.map(bolha)}
          </div>
        </div>
        {/* névoa: o chão some em branco ao longe */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 380, background: 'linear-gradient(to bottom, rgba(245,247,251,0.9) 0%, rgba(245,247,251,0.5) 35%, rgba(245,247,251,0) 100%)'}} />
      </div>
    </AbsoluteFill>
  );
};
