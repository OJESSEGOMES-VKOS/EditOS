// cena31 — Cartão que vira (3D edição: cartão com espessura em CSS 3D + desfoque de movimento real).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {loadFont} from '@remotion/google-fonts/Manrope';

const {fontFamily: MANROPE} = loadFont('normal', {weights: ['500', '700', '800'], subsets: ['latin']});

export type Cena31Props = {
  marca?: string;
  plano?: string;
  preco?: string;
  periodo?: string;
  beneficios?: string[]; // até 3
  corDestaque?: string;
  width?: number;
  height?: number;
  duracao?: number;
};

const CW = 860;
const CH = 540;
const T = 16; // espessura
const RAD = 34;

const Face: React.FC<{t: string; children?: React.ReactNode; style?: React.CSSProperties}> = ({t, children, style}) => (
  <div style={{position: 'absolute', left: -CW / 2, top: -CH / 2, width: CW, height: CH, borderRadius: RAD, transform: t, backfaceVisibility: 'hidden', overflow: 'hidden',
    background: '#15171A', ...style}}>{children}</div>
);

const Cena: React.FC<Required<Omit<Cena31Props, 'width' | 'height' | 'beneficios'>>> = ({marca, plano, preco, periodo, corDestaque, duracao}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = duracao / 150;
  const flip = spring({frame: frame - 30 * s, fps, config: {damping: 14, stiffness: 95, mass: 0.9}});
  const giroLento = interpolate(frame, [0, 30 * s], [-30, -16], {extrapolateRight: 'clamp'});
  const rotY = giroLento + (180 - 4 - giroLento) * flip;
  const lift = 230 * Math.sin(Math.PI * Math.min(1, Math.max(0, flip)));
  const push = interpolate(frame, [0, 30 * s], [-80, 0], {extrapolateRight: 'clamp'});
  const sobe = interpolate(frame, [56 * s, 72 * s], [0, -250], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.3, 0, 0.1, 1)});
  const rotX = interpolate(frame, [56 * s, 72 * s], [8, 5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // brilhos que atravessam a face: um no começo (frente), outro no pouso (verso)
  const brilho1 = interpolate(frame, [0, 32 * s], [-40, 120], {extrapolateRight: 'clamp'});
  const brilho2 = interpolate(frame, [42 * s, 66 * s], [-40, 130], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const reflexo = (pos: number, forca: number) => (
    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(115deg, transparent ${pos - 22}%, rgba(255,255,255,${0.09 * forca}) ${pos - 8}%, rgba(255,255,255,${0.32 * forca}) ${pos}%, rgba(255,255,255,${0.09 * forca}) ${pos + 8}%, transparent ${pos + 22}%)`}} />
  );
  const acabamento = (
    <>
      <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 1px, rgba(0,0,0,0.02) 1px 3px)'}} />
      <div style={{position: 'absolute', inset: 0, background: 'repeating-radial-gradient(circle at 30% 120%, rgba(255,255,255,0) 0 38px, rgba(255,255,255,0.025) 39px 40px)'}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(170deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 40%, rgba(0,0,0,0.25))'}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: RAD, boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.12)'}} />
    </>
  );
  const marcaEl = (tam: number) => (
    <div style={{display: 'flex', alignItems: 'center', gap: tam * 0.4, fontFamily: MANROPE, fontWeight: 700, fontSize: tam, color: '#F3F5F7'}}>
      <svg width={tam * 0.9} height={tam * 0.9} viewBox="0 0 20 20"><path d="M10 2 L18 18 L13 18 L10 11 L7 18 L2 18 Z" fill={corDestaque} /></svg>
      {marca}
    </div>
  );

  // borda: lado direito/esquerdo (aparecem no meio do giro) com polimento que reage ao ângulo
  const brilhoBorda = 0.45 + 0.55 * Math.abs(Math.sin((rotY * Math.PI) / 180));
  const borda = (lado: 1 | -1) => (
    <div style={{position: 'absolute', left: -T / 2, top: -CH / 2 + RAD, width: T, height: CH - 2 * RAD, transform: `rotateY(${lado * 90}deg) translateZ(${CW / 2 - 0.5}px)`,
      background: `linear-gradient(to bottom, rgb(${90 * brilhoBorda},${94 * brilhoBorda},${100 * brilhoBorda}), rgb(${235 * brilhoBorda},${238 * brilhoBorda},${242 * brilhoBorda}) 45%, rgb(${120 * brilhoBorda},${124 * brilhoBorda},${130 * brilhoBorda}))`}} />
  );
  const bordaH = (lado: 1 | -1) => (
    <div style={{position: 'absolute', left: -CW / 2 + RAD, top: -T / 2, width: CW - 2 * RAD, height: T, transform: `rotateX(${lado * 90}deg) translateZ(${CH / 2 - 0.5}px)`,
      background: lado === 1 ? 'linear-gradient(to right, #6b7078, #e6e9ee, #8a8f97)' : '#2a2d32'}} />
  );
  // camadas internas para dar volume nos cantos arredondados
  const miolo = [-T / 2 + 2, -T / 4, 0, T / 4, T / 2 - 2].map((z) => (
    <div key={z} style={{position: 'absolute', left: -CW / 2, top: -CH / 2, width: CW, height: CH, borderRadius: RAD, transform: `translateZ(${z}px)`,
      background: `rgb(${150 * brilhoBorda},${154 * brilhoBorda},${160 * brilhoBorda})`}} />
  ));

  // sombra na parede: estreita e amacia quando o cartão levanta
  const sombraW = CW * (0.35 + 0.65 * Math.abs(Math.cos((rotY * Math.PI) / 180)));
  const sombraBlur = 30 + lift * 0.25;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 540 - sombraW / 2 + 40 + lift * 0.2, top: 675 - CH / 2 + 60 + sobe + lift * 0.15, width: sombraW, height: CH * 0.92, borderRadius: 50,
        background: `rgba(40,46,56,${0.32 - lift * 0.0006})`, filter: `blur(${sombraBlur}px)`}} />
      <div style={{position: 'absolute', inset: 0, perspective: 2200, perspectiveOrigin: '540px 640px'}}>
        <div style={{position: 'absolute', left: 540, top: 0, transformStyle: 'preserve-3d',
          transform: `translateY(${640 + sobe}px) translateZ(${push + lift}px) rotateX(${rotX}deg) rotateZ(-1deg) rotateY(${rotY}deg)`}}>
          {miolo}
          {borda(1)}
          {borda(-1)}
          {bordaH(1)}
          {bordaH(-1)}
          <Face t={`translateZ(${T / 2}px)`}>
            {acabamento}
            {reflexo(brilho1, 1)}
            <div style={{position: 'absolute', left: 56, top: 52}}>{marcaEl(40)}</div>
            <div style={{position: 'absolute', left: 58, right: 58, bottom: 50, display: 'flex', justifyContent: 'space-between', fontFamily: MANROPE, fontWeight: 700, fontSize: 18, letterSpacing: 6, color: 'rgba(243,245,247,0.75)'}}>
              <span>MEMBRO</span><span>DESDE 2026</span>
            </div>
          </Face>
          <Face t={`rotateY(180deg) translateZ(${T / 2}px)`}>
            {acabamento}
            {reflexo(brilho2, 1)}
            <div style={{position: 'absolute', left: 56, top: 46}}>{marcaEl(26)}</div>
            <div style={{position: 'absolute', left: 50, top: 120, fontFamily: MANROPE, fontWeight: 800, fontSize: 190, letterSpacing: -8, lineHeight: 1, color: '#F3F5F7'}}>{plano}</div>
            <div style={{position: 'absolute', left: 56, top: 330, fontFamily: MANROPE, fontWeight: 800, fontSize: 76, letterSpacing: -2, color: '#F3F5F7'}}>
              {preco}<span style={{fontWeight: 500, fontSize: 36, opacity: 0.75, letterSpacing: 0}}> {periodo}</span>
            </div>
          </Face>
        </div>
      </div>
    </div>
  );
};

export const Cena31: React.FC<Cena31Props> = ({
  marca = 'Norte',
  plano = 'Pro',
  preco = 'R$ 29',
  periodo = '/mês',
  beneficios = ['Projetos ilimitados', 'Suporte prioritário', 'Cancele quando quiser'],
  corDestaque = '#FF5A1F',
  width = 1080,
  height = 1350,
  duracao = 150,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = duracao / 150;
  const k = Math.min(width / 1080, height / 1350);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 55% at 50% 42%, #F4F5F7 0%, #EEF0F3 45%, #E0E3E8 100%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 1080, height: 1350, marginLeft: -540, marginTop: -675, transform: `scale(${k})`}}>
        <CameraMotionBlur shutterAngle={200} samples={8}>
          <Cena marca={marca} plano={plano} preco={preco} periodo={periodo} corDestaque={corDestaque} duracao={duracao} />
        </CameraMotionBlur>
        <div style={{position: 'absolute', top: 820, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <div>
            {beneficios.slice(0, 3).map((b, i) => {
              const t0 = (68 + i * 8) * s;
              const pop = spring({frame: frame - t0, fps, config: {damping: 10, stiffness: 240}});
              const tick = interpolate(frame, [t0 + 3, t0 + 9], [24, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              const sobe = spring({frame: frame - t0 - 2, fps, config: {damping: 18, stiffness: 180}});
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, height: 92}}>
                  <svg width={50} height={50} viewBox="0 0 50 50" style={{transform: `scale(${pop})`, flexShrink: 0}}>
                    <circle cx={25} cy={25} r={25} fill={corDestaque} />
                    <path d="M14 26 L22 33 L36 18" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={24} strokeDashoffset={tick} pathLength={24} />
                  </svg>
                  <div style={{overflow: 'hidden', height: 76}}>
                    <div style={{fontFamily: MANROPE, fontWeight: 700, fontSize: 56, lineHeight: '76px', color: '#121417', letterSpacing: -1, transform: `translateY(${(1 - sobe) * 76}px)`}}>{b}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
