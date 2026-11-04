// cena26 — Social post receipt (Post como recibo). Cartão de post inventado (pessoa, empresa e rede
// inventadas, sem logo), assenta de um ângulo, os números sobem, o coração estala vermelho, duas respostas sobem
// de baixo e empilham, e um marcador vermelho sublinha a frase-chave à mão.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Inter';

const {fontFamily: INTER} = loadFont('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin', 'latin-ext']});

export type Resposta = {iniciais: string; nome: string; arroba: string; texto: string; curtidas: number; cor: string};
export type Cena26Props = {
  contexto: [string, string]; // "Postado na terça." + "Apagado na quinta." (a segunda em negrito)
  iniciais: string;
  nome: string;
  arroba: string;
  cargo: string;
  textoAntes: string; // parte do post antes da frase-chave
  fraseChave: string; // sublinhada
  hora: string;
  numeros: {respostas: number; reposts: number; curtidas: number; views: number};
  respostas: [Resposta, Resposta];
  vermelho?: string;
  width?: number;
  height?: number;
};

const W = 1080;
const H = 1350;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// 4 -> "4"; 2400 -> "2,4 mil"; 12400000 -> "12,4 mi"
const curto = (v: number) => {
  if (v >= 1e6) return `${(v / 1e6).toFixed(1).replace('.', ',')} mi`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1).replace('.', ',')} mil`;
  return String(Math.round(v));
};

const Selo: React.FC = () => (
  <svg width={30} height={30} viewBox="0 0 24 24" style={{marginLeft: 8}}>
    <circle cx={12} cy={12} r={11} fill="#2B7BF2" />
    <path d="M7 12.4 L10.5 15.6 L17 8.8" stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Coracao: React.FC<{cheio: boolean; cor: string; tam: number}> = ({cheio, cor, tam}) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24">
    <path d="M12 20.5 C 5 15.5 2.5 12.5 2.5 8.8 A 4.8 4.8 0 0 1 12 7 A 4.8 4.8 0 0 1 21.5 8.8 C 21.5 12.5 19 15.5 12 20.5 Z" fill={cheio ? cor : 'none'} stroke={cheio ? cor : '#5B6674'} strokeWidth={2} strokeLinejoin="round" />
  </svg>
);
const IcResp: React.FC = () => (
  <svg width={30} height={30} viewBox="0 0 24 24"><path d="M4 5 H20 V16 H10 L6 19.5 V16 H4 Z" fill="none" stroke="#5B6674" strokeWidth={2} strokeLinejoin="round" /></svg>
);
const IcRep: React.FC = () => (
  <svg width={30} height={30} viewBox="0 0 24 24"><path d="M5 10 V7 H17 M14 4 L17 7 L14 10 M19 14 V17 H7 M10 20 L7 17 L10 14" fill="none" stroke="#5B6674" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IcViews: React.FC = () => (
  <svg width={30} height={30} viewBox="0 0 24 24"><path d="M5 20 V12 M10 20 V6 M15 20 V10 M20 20 V14" stroke="#5B6674" strokeWidth={2.2} strokeLinecap="round" /></svg>
);
const Avatar: React.FC<{ini: string; tam: number; cor: string}> = ({ini, tam, cor}) => (
  <div style={{width: tam, height: tam, borderRadius: tam / 2, background: cor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: tam * 0.38, flexShrink: 0}}>{ini}</div>
);

export const Cena26: React.FC<Cena26Props> = ({
  contexto, iniciais, nome, arroba, cargo, textoAntes, fraseChave, hora, numeros, respostas, vermelho = '#F4385E',
  width = W, height = H,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = Math.min(width / W, height / H);

  // o cartão já está na tela, inclinado e grande, assentando na mola
  const ass = spring({frame: frame + 3, fps, config: {damping: 12, stiffness: 120}});
  const rotX = 22 * (1 - ass);
  const rotZ = -3 * (1 - ass);
  const esc = 1.08 - 0.08 * ass;

  // números sobem rápido (ease-out)
  const kNum = interpolate(frame, [2, 46], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const cResp = 18 + (numeros.respostas - 18) * kNum;
  const cRep = 40 + (numeros.reposts - 40) * kNum;
  const cCurt = 4 + (numeros.curtidas - 4) * kNum;
  const cViews = 900 + (numeros.views - 900) * kNum;
  const tCor = 34;
  const pop = frame >= tCor ? interpolate(frame - tCor, [0, 3, 9], [1, 1.25, 1], clamp) : 1;
  const vermelhoOn = frame >= tCor;

  // respostas sobem de baixo, a segunda empurra a pilha
  const r1 = spring({frame: frame - 30, fps, config: {damping: 12, stiffness: 130}});
  const r2 = spring({frame: frame - 46, fps, config: {damping: 12, stiffness: 130}});
  const vel = (f0: number) => {
    const a = spring({frame: frame - f0, fps, config: {damping: 12, stiffness: 130}});
    const b = spring({frame: frame - f0 - 1, fps, config: {damping: 12, stiffness: 130}});
    return Math.abs(a - b);
  };
  const empurra = -28 * r1 - 34 * r2;
  const recuo = 1.03 - 0.03 * interpolate(frame, [0, 115], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});

  // marcador
  const kMarc = interpolate(frame, [66, 80], [0, 1], {...clamp, easing: Easing.bezier(0.2, 0.7, 0.4, 1)});

  const TOP = 268;
  const linha = (txt: string, n: number) => <span style={{fontVariantNumeric: 'tabular-nums'}}>{txt}{n ? '' : ''}</span>;

  const Quote: React.FC<{r: Resposta; k: number; v: number; y: number; x: number; f0: number}> = ({r, k, v, y, x, f0}) => {
    const like = r.curtidas * interpolate(frame - f0, [6, 24], [0.3, 1], clamp);
    return (
      <div style={{position: 'absolute', zIndex: 2, left: 80 + x, top: y + (1 - k) * 700, width: 900, background: '#fff', borderRadius: 22, padding: '22px 28px 26px', boxShadow: '0 0 0 1.5px #E3E7EC, 0 10px 26px rgba(15,20,25,0.10), 0 2px 6px rgba(15,20,25,0.06)', filter: `blur(${Math.min(8, v * 40)}px)`}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Avatar ini={r.iniciais} tam={56} cor={r.cor} />
          <div style={{marginLeft: 16}}>
            <div style={{fontWeight: 700, fontSize: 28, color: '#0F1419'}}>{r.nome}</div>
            <div style={{fontWeight: 400, fontSize: 23, color: '#6B7684'}}>{r.arroba}</div>
          </div>
          <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, color: vermelho, fontWeight: 600, fontSize: 26, fontVariantNumeric: 'tabular-nums'}}>
            <Coracao cheio cor={vermelho} tam={26} />{curto(like)}
          </div>
        </div>
        <div style={{fontWeight: 500, fontSize: 38, color: '#0F1419', marginTop: 14, lineHeight: 1.2}}>{r.texto}</div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #F1F3F6 0%, #E7EBF0 100%)', fontFamily: INTER}}>
      <div style={{position: 'absolute', left: -200, top: 300, width: 900, height: 700, borderRadius: '50%', background: 'rgba(200,210,225,0.35)', filter: 'blur(120px)'}} />
      <div style={{position: 'absolute', left: (width - W * s) / 2, top: (height - H * s) / 2, width: W, height: H, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${recuo})`, transformOrigin: '50% 45%'}}>
          <div style={{position: 'absolute', top: 54, width: W, textAlign: 'center', fontSize: 34, color: '#6B7684', fontWeight: 500}}>
            {contexto[0]} <span style={{fontWeight: 700, color: '#3A434F'}}>{contexto[1]}</span>
          </div>
          <div style={{position: 'absolute', inset: 0, transform: `translateY(${empurra}px)`}}>
            <Quote r={respostas[0]} k={r1} v={vel(30)} y={TOP + 478} x={-16} f0={30} />
            <Quote r={respostas[1]} k={r2} v={vel(46)} y={TOP + 660} x={22} f0={46} />
            <div style={{position: 'absolute', left: 80, top: TOP, width: 920, perspective: 1600, zIndex: 0}}>
              <div style={{background: '#fff', borderRadius: 26, padding: '34px 40px 30px', boxShadow: '0 0 0 1.5px #E3E7EC, 0 18px 40px rgba(15,20,25,0.12), 0 3px 8px rgba(15,20,25,0.06)', transform: `rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${esc})`, transformOrigin: '50% 30%'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <Avatar ini={iniciais} tam={84} cor="linear-gradient(135deg,#1E3A6E,#2D5A8C)" />
                  <div style={{marginLeft: 20}}>
                    <div style={{display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 36, color: '#0F1419'}}>{nome}<Selo /></div>
                    <div style={{fontWeight: 400, fontSize: 26, color: '#6B7684'}}>{arroba} · {cargo}</div>
                  </div>
                </div>
                <div style={{fontWeight: 500, fontSize: 52, lineHeight: 1.2, color: '#0F1419', marginTop: 26, letterSpacing: -0.6}}>
                  {textoAntes}{' '}
                  <span style={{position: 'relative', display: 'inline-block'}}>
                    {fraseChave}
                    <svg width="100%" height={22} viewBox="0 0 100 22" preserveAspectRatio="none" style={{position: 'absolute', left: -4, bottom: -12, width: 'calc(100% + 8px)'}}>
                      <path d="M1 12 C 20 9, 45 13, 70 10 S 92 11, 98 8 L 99 14 C 80 16, 55 13, 30 16 S 8 15, 1 17 Z" fill={vermelho} style={{clipPath: `inset(0 ${(1 - kMarc) * 100}% 0 0)`}} />
                    </svg>
                  </span>
                </div>
                <div style={{fontSize: 26, color: '#6B7684', marginTop: 20}}>{hora}</div>
                <div style={{height: 1.5, background: '#E3E7EC', margin: '22px 0 20px'}} />
                <div style={{display: 'flex', gap: 54, fontSize: 30, color: '#5B6674', fontWeight: 500, fontVariantNumeric: 'tabular-nums'}}>
                  <span style={{display: 'flex', alignItems: 'center', gap: 10}}><IcResp />{linha(curto(cResp), 0)}</span>
                  <span style={{display: 'flex', alignItems: 'center', gap: 10}}><IcRep />{curto(cRep)}</span>
                  <span style={{display: 'flex', alignItems: 'center', gap: 10, color: vermelhoOn ? vermelho : undefined, fontWeight: vermelhoOn ? 600 : 500}}>
                    <span style={{transform: `scale(${pop})`, display: 'flex'}}><Coracao cheio={vermelhoOn} cor={vermelho} tam={30} /></span>
                    {curto(cCurt)}
                  </span>
                  <span style={{display: 'flex', alignItems: 'center', gap: 10}}><IcViews />{curto(cViews)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0, opacity: 0.03, mixBlendMode: 'multiply', pointerEvents: 'none'}}>
        <filter id="g26"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="19" /></filter>
        <rect width="100%" height="100%" filter="url(#g26)" />
      </svg>
    </AbsoluteFill>
  );
};
