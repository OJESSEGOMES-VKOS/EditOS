// cena18 — Screen-Recording Zoom (Zoom na gravação de tela). Palco base 1080x1350.
// A interface é desenhada em código (nítida em qualquer zoom). Num vídeo real, troque pelo recriado fiel da tela do dono (G34).
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

const {fontFamily: INTER} = loadInter('normal', {weights: ['500', '600', '700'], subsets: ['latin']});
const {fontFamily: MONO} = loadMono('normal', {weights: ['500'], subsets: ['latin']});

export type Cena18Props = {
  width?: number;
  height?: number;
  projeto?: string;
  status?: string;
  compartilhar?: string;
  dialogo?: string;
  abas?: string[];
  campos?: [string, string][];
  qualidade?: string;
  tamanhoRotulo?: string;
  tamanho?: string;
  cancelar?: string;
  botao?: string;
  passoNumero?: string;
  passoTexto?: string;
  legendaPrevia?: string;
  azul?: string;
};

const WW = 1000, WH = 1100; // janela, em unidades de desenho
const BTN = {x: 818, y: 594, w: 128, h: 46}; // botão alvo dentro da janela

const Paisagem: React.FC<{texto: string}> = ({texto}) => (
  <svg viewBox="0 0 260 470" width="100%" height="100%" preserveAspectRatio="none">
    <defs><linearGradient id="as18ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fc3e6" /><stop offset="1" stopColor="#dfe9f1" /></linearGradient></defs>
    <rect width="260" height="470" fill="url(#as18ceu)" />
    <path d="M0 250 L60 170 L110 220 L170 140 L260 230 L260 470 L0 470Z" fill="#5d7690" />
    <path d="M0 300 L50 240 L120 290 L190 220 L260 280 L260 470 L0 470Z" fill="#3c5068" />
    <path d="M0 350 L80 300 L150 340 L220 300 L260 320 L260 470 L0 470Z" fill="#26364a" />
    <text x="130" y="400" fill="#fff" fontFamily={INTER} fontWeight={700} fontSize="22" textAnchor="middle">{texto}</text>
  </svg>
);

const Onda: React.FC<{w: number; seed: number}> = ({w, seed}) => {
  const barras = [];
  for (let i = 0; i < w / 5; i++) {
    const h = 6 + Math.abs(Math.sin(i * 0.7 + seed) * Math.cos(i * 0.23 + seed * 2)) * 30;
    barras.push(<rect key={i} x={i * 5} y={20 - h / 2} width={3} height={h} rx={1} fill="#7fd0b0" />);
  }
  return <svg width={w} height={40}>{barras}</svg>;
};

export const Cena18: React.FC<Cena18Props> = ({
  width = 1080,
  height = 1350,
  projeto = 'Resumo do fim de semana v3',
  status = 'Salvo · 9:16 · 00:42',
  compartilhar = 'Compartilhar',
  dialogo = 'Exportar',
  abas = ['Vídeo', 'GIF', 'Áudio'],
  campos = [['Formato', 'MP4 · H.264'], ['Resolução', '1080 × 1920'], ['Quadros', '30 fps']],
  qualidade = 'Alta',
  tamanhoRotulo = 'Tamanho estimado',
  tamanho = '148 MB · 0:42',
  cancelar = 'Cancelar',
  botao = 'Exportar',
  passoNumero = '3',
  passoTexto = 'Clique em Exportar',
  legendaPrevia = 'dia um.',
  azul = '#3D7BFA',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = Math.min(width / 1080, height / 1350);
  const kF = Math.max(width / 1080, height / 1350);

  // cursor conduz, câmera segue um tempo depois numa mola só, sem quique
  const cur = interpolate(frame, [6, 38], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1)});
  const p0 = {x: 905, y: 60}, pc = {x: 640, y: 300}, p1 = {x: BTN.x + 74, y: BTN.y + 30};
  const bez = (t: number) => ({x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * pc.x + t * t * p1.x, y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * pc.y + t * t * p1.y});
  const c = bez(cur);
  const cAnt = bez(interpolate(frame - 1, [6, 38], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1)}));
  const velCur = Math.hypot(c.x - cAnt.x, c.y - cAnt.y);

  const z = spring({frame: frame - 15, fps, config: {damping: 200, stiffness: 38, mass: 1}});
  const zAnt = spring({frame: frame - 16, fps, config: {damping: 200, stiffness: 38, mass: 1}});
  const esc = interpolate(z, [0, 1], [0.86, 1.32]);
  const left = interpolate(z, [0, 1], [540 - (WW * 0.86) / 2, 1012 - WW * 1.32]);
  const top = interpolate(z, [0, 1], [640 - (WH * 0.86) / 2, 124]);
  const borrao = Math.min(6, Math.abs(z - zAnt) * 160);

  // clique
  const qClique = 44;
  const chegou = interpolate(frame, [34, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const aperta = frame >= qClique ? 1 - 0.05 * (1 - spring({frame: frame - qClique - 3, fps, config: {damping: 10, stiffness: 300, mass: 0.4}})) * (frame >= qClique ? 1 : 0) : 1;
  const mergulho = frame >= qClique && frame < qClique + 5 ? 0.9 : 1;
  const anel = spring({frame: frame - qClique, fps, config: {damping: 14, stiffness: 140, mass: 0.6}});
  const onda = interpolate(frame, [qClique, qClique + 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const qPilula = 62;
  const pil = spring({frame: frame - qPilula, fps, config: {damping: 11, stiffness: 200, mass: 0.6}});
  const num = spring({frame: frame - qPilula - 4, fps, config: {damping: 9, stiffness: 260, mass: 0.5}});

  const TXT = '#ECEEF1', LBL = '#9A9FA8', HAIR = '#33353B';
  const regua = ['00:00:00', '00:00:05', '00:00:10', '00:00:15', '00:00:20', '00:00:25', '00:00:30', '00:00:35'];

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: 'radial-gradient(ellipse at 10% 5%, #E3EFE9 0%, #CFE3DF 40%, #B8D7D6 70%, #9CC4BD 100%)'}}>
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.18, mixBlendMode: 'multiply'}}>
        <filter id="as18grao"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 7} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter="url(#as18grao)" />
      </svg>
      <div style={{position: 'absolute', left: (width - 1080 * k) / 2, top: (height - 1350 * k) / 2, width: 1080, height: 1350, transform: `scale(${k})`, transformOrigin: '0 0', fontFamily: INTER}}>
        {/* a janela do app */}
        <div style={{position: 'absolute', left, top, width: WW, height: WH, transform: `scale(${esc})`, transformOrigin: '0 0', filter: borrao > 0.3 ? `blur(${borrao}px)` : undefined}}>
          <div style={{position: 'absolute', inset: 0, background: '#1B1C20', borderRadius: 18, overflow: 'hidden', boxShadow: '0 50px 90px rgba(20,50,45,0.45), 0 12px 30px rgba(20,50,45,0.3)'}}>
            {/* barra de título */}
            <div style={{height: 76, background: '#212227', borderBottom: `1px solid ${HAIR}`, display: 'flex', alignItems: 'center', padding: '0 22px', gap: 16}}>
              {['#FF5F57', '#FEBC2E', '#28C840'].map((cc) => <span key={cc} style={{width: 13, height: 13, borderRadius: 7, background: cc}} />)}
              <span style={{width: 22, height: 16, border: `2px solid ${LBL}`, borderRadius: 3, marginLeft: 10}} />
              <span style={{color: LBL, fontSize: 22}}>‹</span>
              <div>
                <div style={{color: TXT, fontWeight: 600, fontSize: 23}}>{projeto} <span style={{color: LBL}}>⌄</span></div>
                <div style={{color: LBL, fontWeight: 500, fontSize: 13, marginTop: 2}}><span style={{color: '#3FBF7F'}}>●</span> {status}</div>
              </div>
              <div style={{flex: 1}} />
              {[['MK', '#E0806E'], ['JR', '#6EA7E0']].map(([t, cc], i) => <span key={t} style={{width: 32, height: 32, borderRadius: 16, background: cc, color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: i ? -10 : 0, border: '2px solid #212227'}}>{t}</span>)}
              <span style={{color: LBL, fontSize: 13, fontWeight: 600}}>+2</span>
              <span style={{background: '#2C2E34', border: `1px solid ${HAIR}`, color: TXT, fontSize: 18, fontWeight: 600, padding: '10px 18px', borderRadius: 9, marginLeft: 10}}>⇪ {compartilhar}</span>
            </div>
            {/* trilho lateral */}
            <div style={{position: 'absolute', left: 0, top: 77, width: 58, bottom: 300, borderRight: `1px solid ${HAIR}`, background: '#1E1F24'}}>
              {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{width: 20, height: 20, margin: '26px auto 0', borderRadius: 5, border: `2px solid ${i === 0 ? TXT : '#5a5e66'}`}} />)}
            </div>
            {/* prévia */}
            <div style={{position: 'absolute', left: 90, top: 110, width: 262, height: 470, borderRadius: 6, overflow: 'hidden'}}><Paisagem texto={legendaPrevia} /></div>
            {/* diálogo de exportação */}
            <div style={{position: 'absolute', left: 430, top: 102, width: 540, height: 572, background: '#26272C', border: `1px solid ${HAIR}`, borderRadius: 14, boxShadow: '0 20px 50px rgba(0,0,0,0.5)', padding: '22px 26px', boxSizing: 'border-box'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', color: TXT, fontWeight: 600, fontSize: 26}}><span>{dialogo}</span><span style={{color: LBL}}>×</span></div>
              <div style={{display: 'flex', background: '#1E1F24', borderRadius: 9, padding: 4, marginTop: 18}}>
                {abas.map((a, i) => <div key={a} style={{flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 7, fontSize: 18, fontWeight: 600, color: i === 0 ? TXT : LBL, background: i === 0 ? '#3A3C43' : 'transparent'}}>{a}</div>)}
              </div>
              {campos.map(([r, v]) => (
                <div key={r} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, fontSize: 19}}>
                  <span style={{color: LBL, fontWeight: 500}}>{r}</span>
                  <span style={{color: TXT, fontWeight: 600, background: '#2F3036', border: `1px solid ${HAIR}`, borderRadius: 7, padding: '7px 12px'}}>{v} <span style={{color: LBL}}>⌄</span></span>
                </div>
              ))}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 34, fontSize: 19}}>
                <span style={{color: LBL, fontWeight: 500}}>Qualidade</span>
                <span style={{display: 'flex', alignItems: 'center', gap: 16}}>
                  <span style={{position: 'relative', width: 150, height: 5, borderRadius: 3, background: '#44464d'}}><span style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: '78%', background: azul, borderRadius: 3}} /><span style={{position: 'absolute', left: '78%', top: -7, width: 18, height: 18, borderRadius: 9, background: '#fff', marginLeft: -9}} /></span>
                  <span style={{color: TXT, fontWeight: 600}}>{qualidade}</span>
                </span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 32, fontSize: 18}}>
                <span style={{color: LBL, fontWeight: 500}}>{tamanhoRotulo}</span>
                <span style={{color: LBL, fontFamily: MONO}}>{tamanho}</span>
              </div>
            </div>
            <div style={{position: 'absolute', left: BTN.x - 150, top: BTN.y, height: BTN.h, width: 126, borderRadius: 9, background: '#2F3036', border: `1px solid ${HAIR}`, color: TXT, fontWeight: 600, fontSize: 19, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'}}>{cancelar}</div>
            <div style={{position: 'absolute', left: BTN.x, top: BTN.y, width: BTN.w, height: BTN.h, borderRadius: 9, background: `linear-gradient(${azul}, #2F6AE6)`, color: '#fff', fontWeight: 600, fontSize: 19, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${aperta})`, filter: `brightness(${1 - chegou * 0.14})`}}>{botao}</div>
            {/* linha do tempo */}
            <div style={{position: 'absolute', left: 0, right: 0, top: 800, bottom: 0, borderTop: `1px solid ${HAIR}`, background: '#1E1F24'}}>
              <div style={{display: 'flex', gap: 0, fontFamily: MONO, fontSize: 11, color: '#6b7078', padding: '10px 0 0 20px'}}>{regua.map((r) => <span key={r} style={{width: 125}}>{r}</span>)}</div>
              <div style={{position: 'absolute', left: 430, top: 0, bottom: 0, width: 2, background: '#FF5A4E'}}><div style={{position: 'absolute', left: -7, top: 0, width: 16, height: 14, background: '#FF5A4E', clipPath: 'polygon(0 0,100% 0,50% 100%)'}} /></div>
              {[[16, 250], [276, 120], [406, 240], [656, 200]].map(([x, w], i) => (
                <div key={i} style={{position: 'absolute', left: x, top: 46, width: w - 6, height: 58, borderRadius: 6, overflow: 'hidden', background: 'linear-gradient(90deg,#5d7690,#c89a7a,#5d7690)', opacity: 0.9}}>
                  <div style={{position: 'absolute', left: 6, top: 4, fontSize: 10, color: '#fff', fontFamily: MONO}}>A00{i + 1}_C0{i + 2}</div>
                </div>
              ))}
              {[[16, 330], [356, 280], [646, 330]].map(([x, w], i) => (
                <div key={i} style={{position: 'absolute', left: x, top: 118, width: w - 8, height: 52, borderRadius: 6, background: '#1f4f43', overflow: 'hidden', padding: '6px 4px', boxSizing: 'border-box'}}><Onda w={w - 16} seed={i * 3 + 1} /></div>
              ))}
              {[[16, 330], [356, 280], [646, 330]].map(([x, w], i) => (
                <div key={'b' + i} style={{position: 'absolute', left: x, top: 186, width: w - 8, height: 52, borderRadius: 6, background: '#1f4f43', overflow: 'hidden', padding: '6px 4px', boxSizing: 'border-box'}}><Onda w={w - 16} seed={i * 5 + 2} /></div>
              ))}
            </div>
            {/* clique: anel e ondulação */}
            {frame >= qClique && (
              <>
                <div style={{position: 'absolute', left: p1.x - 28, top: p1.y - 28, width: 56, height: 56, borderRadius: 28, border: '4px solid rgba(255,255,255,0.95)', transform: `scale(${0.3 + anel * 0.9})`, opacity: anel > 0.98 && frame > qClique + 30 ? 0.85 : 1}} />
                <div style={{position: 'absolute', left: p1.x - 28, top: p1.y - 28, width: 56, height: 56, borderRadius: 28, border: '2px solid rgba(255,255,255,0.5)', transform: `scale(${1 + onda * 1.6})`, opacity: 1 - onda}} />
              </>
            )}
          </div>
          {/* cursor */}
          <svg width={40} height={52} viewBox="0 0 20 26" style={{position: 'absolute', left: c.x - 4, top: c.y - 2, transform: `scale(${mergulho})`, transformOrigin: '4px 2px', filter: velCur > 6 ? `blur(${Math.min(3, velCur / 10)}px) drop-shadow(0 2px 3px rgba(0,0,0,0.4))` : 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))'}}>
            <path d="M2 1 L2 20 L7 15.5 L10.5 23 L13.6 21.6 L10.2 14.4 L17 14 Z" fill="#fff" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
          </svg>
        </div>
        {/* pílula do passo */}
        {pil > 0.01 && (
          <div style={{position: 'absolute', left: 540, top: 1150, transform: `translate(-50%, -50%) scale(${pil})`, display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 40, padding: '12px 30px 12px 12px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', whiteSpace: 'nowrap'}}>
            <span style={{width: 40, height: 40, borderRadius: 20, background: '#121417', color: '#fff', fontWeight: 700, fontSize: 21, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${num})`}}>{passoNumero}</span>
            <span style={{fontWeight: 600, fontSize: 30, color: '#121417'}}>{passoTexto}</span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
