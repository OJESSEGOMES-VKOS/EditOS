// cena36 — Troféu do marco (3D edição: placa de prata com espessura em CSS 3D + odômetro cromado).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadBarlow} from '@remotion/google-fonts/BarlowSemiCondensed';
import {loadFont as loadMont} from '@remotion/google-fonts/Montserrat';

const {fontFamily: BARLOW} = loadBarlow('normal', {weights: ['700'], subsets: ['latin']});
const {fontFamily: MONT} = loadMont('normal', {weights: ['600'], subsets: ['latin']});

export type Cena36Props = {
  meta?: number; // o marco (ex.: 100000)
  inicio?: number; // de onde a contagem parte
  palavra?: string;
  separador?: string;
  width?: number;
  height?: number;
  duracao?: number;
};

const PW = 700;
const PH = 660;
const PT = 46;
const CROMO = 'linear-gradient(180deg, #ffffff 0%, #d9dee2 30%, #8f979d 50%, #eef2f4 54%, #aab1b6 80%, #ffffff 100%)';

export const Cena36: React.FC<Cena36Props> = ({
  meta = 100000,
  inicio = 72000,
  palavra = 'SEGUIDORES',
  separador = '.',
  width = 1080,
  height = 1350,
  duracao = 150,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = duracao / 150;
  const k = Math.min(width / 1080, height / 1350);

  // giro + subida: pousa pouco antes de 2 s com um balanço que passa do esquadro
  const pouso = 54 * s;
  const rotY = frame < pouso
    ? interpolate(frame, [0, pouso], [-66, 5], {easing: Easing.bezier(0.5, 0.05, 0.6, 1)})
    : 5 * Math.cos((frame - pouso) * 0.32) * Math.exp(-(frame - pouso) * 0.2);
  const subida = interpolate(frame, [0, 54 * s], [380, 0], {extrapolateRight: 'clamp', easing: Easing.bezier(0.2, 0.6, 0.3, 1)});
  const zoom = interpolate(frame, [0, 120 * s], [-140, 30], {extrapolateRight: 'clamp', easing: Easing.bezier(0.3, 0, 0.2, 1)});

  // contagem: corre, desacelera perto da meta, para em meta-1, depois vira tudo junto
  const quase = meta - 1;
  const pc = interpolate(frame, [0, 66 * s], [0, 1], {extrapolateRight: 'clamp'});
  let v = quase - (quase - inicio) * Math.pow(1 - pc, 3.2);
  const virada = interpolate(frame, [76 * s, 86 * s], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  v = v + virada * (meta - v);
  const quique = frame > 86 * s ? Math.sin((frame - 86 * s) * 0.7) * Math.exp(-(frame - 86 * s) * 0.35) * 10 : 0;

  const casas = String(meta).length;
  const CEL = 128;
  const rodas: React.ReactNode[] = [];
  for (let i = casas - 1; i >= 0; i--) {
    const pot = Math.pow(10, i);
    let pos = i === 0 ? v % 10 : Math.floor(v / pot + 1e-9) % 10;
    if (i > 0) pos += Math.max(0, (v % pot) - (pot - 1));
    const lider = i === casas - 1;
    rodas.push(
      <div key={i} style={{width: 0.56 * CEL, height: CEL, overflow: 'hidden', position: 'relative'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, transform: `translateY(${-pos * CEL + quique}px)`}}>
          {[...Array(11)].map((_, d) => (
            <div key={d} style={{height: CEL, lineHeight: `${CEL}px`, textAlign: 'center'}}>
              <span style={{background: CROMO, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 -1px 0 rgba(255,255,255,0.5)) drop-shadow(0 2px 1px rgba(0,0,0,0.9))'}}>
                {lider && d % 10 === 0 ? ' ' : d % 10}
              </span>
            </div>
          ))}
        </div>
      </div>,
    );
    if (i % 3 === 0 && i > 0) {
      rodas.push(
        <div key={`s${i}`} style={{width: 0.22 * CEL, height: CEL, lineHeight: `${CEL}px`, textAlign: 'center'}}>
          <span style={{background: CROMO, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{separador}</span>
        </div>,
      );
    }
  }
  // sombreado das rodas (curvatura do cilindro)
  const sombraRoda = 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.85) 100%)';

  // faixas de luz que varrem o metal conforme ele gira
  const faixa = 60 + rotY * 2.4;
  const metalFrente = `linear-gradient(100deg, rgba(255,255,255,0) ${faixa - 14}%, rgba(255,255,255,0.85) ${faixa - 4}%, rgba(255,255,255,0) ${faixa + 3}%, rgba(255,255,255,0) ${faixa + 22}%, rgba(255,255,255,0.6) ${faixa + 27}%, rgba(255,255,255,0) ${faixa + 32}%),
    linear-gradient(180deg, #f4f6f7 0%, #c9cfd3 40%, #6c7479 52%, #9aa2a7 70%, #dfe4e7 100%)`;
  const ladoLuz = 0.5 + 0.5 * Math.abs(Math.sin((rotY * Math.PI) / 180)) + 0.2;
  const metalLado = `linear-gradient(180deg, rgba(255,255,255,${0.9 * ladoLuz}), rgba(120,130,135,${ladoLuz}) 50%, rgba(240,244,246,${ladoLuz}))`;

  const chromeLinha = <div style={{height: 3, width: 380, margin: '0 auto', background: 'linear-gradient(to right, #6d757a, #f5f7f8 50%, #6d757a)'}} />;

  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 45% at 50% 48%, #144234 0%, #0d2d23 35%, #09221B 55%, #030D0A 100%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 1080, height: 1350, marginLeft: -540, marginTop: -675, transform: `scale(${k})`}}>
        <div style={{position: 'absolute', inset: 0, perspective: 2600, perspectiveOrigin: '540px 520px'}}>
          <div style={{position: 'absolute', left: 540, top: 0, transformStyle: 'preserve-3d',
            transform: `translateY(${600 + subida}px) translateZ(${zoom}px) rotateX(-7deg) rotateY(${rotY}deg)`}}>
            {/* pedestal de pedra */}
            <div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: `translateY(${PH / 2 + 50}px)`}}>
              <div style={{position: 'absolute', left: -380, top: -50, width: 760, height: 100, transform: 'translateZ(120px)', background: 'linear-gradient(to bottom, #2a2f2d, #0c0f0e 40%, #050706)'}} />
              <div style={{position: 'absolute', left: -120, top: -50, width: 240, height: 100, transform: 'rotateY(90deg) translateZ(380px)', background: 'linear-gradient(to bottom, #1c201f, #050706)'}} />
              <div style={{position: 'absolute', left: -120, top: -50, width: 240, height: 100, transform: 'rotateY(-90deg) translateZ(380px)', background: 'linear-gradient(to bottom, #333937, #0a0c0b)'}} />
              <div style={{position: 'absolute', left: -380, top: -120, width: 760, height: 240, transform: 'rotateX(90deg) translateZ(50px)', background: 'linear-gradient(to bottom, #151918, #232826)'}} />
            </div>
            {/* espessura da placa */}
            {[1, -1].map((l) => (
              <div key={l} style={{position: 'absolute', left: -PT / 2, top: -PH / 2 + 50, width: PT, height: PH - 100, transform: `rotateY(${l * 90}deg) translateZ(${PW / 2 - 2}px)`, background: metalLado}} />
            ))}
            <div style={{position: 'absolute', left: -PW / 2 + 50, top: -PT / 2, width: PW - 100, height: PT, transform: `rotateX(90deg) translateZ(${PH / 2 - 2}px)`, background: 'linear-gradient(to right, #9aa2a7, #ffffff, #9aa2a7)'}} />
            {[-PT / 2 + 3, -PT / 4, 0, PT / 4].map((z) => (
              <div key={z} style={{position: 'absolute', left: -PW / 2, top: -PH / 2, width: PW, height: PH, borderRadius: 54, transform: `translateZ(${z}px)`, background: '#8c9499'}} />
            ))}
            {/* face */}
            <div style={{position: 'absolute', left: -PW / 2, top: -PH / 2, width: PW, height: PH, borderRadius: 54, transform: `translateZ(${PT / 2}px)`, background: metalFrente,
              boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.85), inset 0 0 0 7px rgba(90,98,103,0.6)'}}>
              <div style={{position: 'absolute', inset: 46, borderRadius: 26, background: 'linear-gradient(170deg, #121514 0%, #070908 55%, #0c0f0e 100%)',
                boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.9), 0 0 0 2px rgba(40,46,44,0.9)'}}>
                <div style={{position: 'absolute', inset: 0, borderRadius: 26, background: `linear-gradient(100deg, rgba(255,255,255,0) ${faixa - 8}%, rgba(255,255,255,0.05) ${faixa}%, rgba(255,255,255,0) ${faixa + 8}%)`}} />
                <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center'}}>
                  <svg width={52} height={52} viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 2px 1px rgba(0,0,0,0.9))'}}>
                    <defs><linearGradient id="st36" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="0.5" stopColor="#9aa2a7" /><stop offset="0.55" stopColor="#eef2f4" /><stop offset="1" stopColor="#c3c9cd" /></linearGradient></defs>
                    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" fill="url(#st36)" />
                  </svg>
                  <div style={{height: 26}} />
                  {chromeLinha}
                  <div style={{display: 'flex', justifyContent: 'center', fontFamily: BARLOW, fontWeight: 700, fontSize: 124, margin: '10px 0', position: 'relative'}}>
                    {rodas}
                    <div style={{position: 'absolute', inset: 0, background: sombraRoda, pointerEvents: 'none'}} />
                  </div>
                  {chromeLinha}
                  <div style={{marginTop: 30, fontFamily: MONT, fontWeight: 600, fontSize: 30, letterSpacing: 10, paddingLeft: 10}}>
                    <span style={{background: CROMO, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 2px 1px rgba(0,0,0,0.9))'}}>{palavra}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.06, mixBlendMode: 'overlay'}}>
          <filter id="g36"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter="url(#g36)" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
