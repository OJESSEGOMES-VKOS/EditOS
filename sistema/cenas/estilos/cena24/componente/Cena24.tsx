// cena24 — Before and after slider (Antes e depois, cortina). Duas páginas inteiras em texto e formas,
// uma em cima da outra numa janela de navegador genérica; o divisor varre da direita para a esquerda e volta ao meio.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadInterTight} from '@remotion/google-fonts/InterTight';
import {loadFont as loadManrope} from '@remotion/google-fonts/Manrope';

const {fontFamily: IT} = loadInterTight('normal', {weights: ['700', '800'], subsets: ['latin', 'latin-ext']});
const {fontFamily: MAN} = loadManrope('normal', {weights: ['500', '600', '700', '800'], subsets: ['latin', 'latin-ext']});

export type Produto = {nome: string; detalhe: string; preco: string};
export type Cena24Props = {
  manchete: [string, string]; // cada linha termina com o ponto em tomate
  endereco: string; // ex.: padariaroseira.com.br (inventado)
  antes: {saudacao: string; nome: string; selo: string; menu: string[]; texto: string; horario: string; semana: string[]; caixa: string; contador: string; rodape: string};
  depois: {faixa: string; marca: string; menu: string[]; titulo: [string, string, string]; sub: string; botao: string; selo: string; produtos: Produto[]};
  rotuloAntes?: string;
  rotuloDepois?: string;
  tomate?: string;
  width?: number;
  height?: number;
};

const W = 1080;
const H = 1350;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const JW = 936; // largura da janela
const JH = 968;
const PH = JH - 56; // altura da página

const Pao: React.FC<{w: number}> = ({w}) => (
  <svg width={w} height={w * 0.62} viewBox="0 0 100 62">
    <ellipse cx={50} cy={34} rx={46} ry={26} fill="#F0C9A0" />
    <ellipse cx={50} cy={30} rx={44} ry={23} fill="#F6DDBF" />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${24 + i * 16} ${40 - i * 2} Q ${34 + i * 16} ${22 - i * 2} ${50 + i * 14} ${18 + i * 2}`} stroke="#FFF7EC" strokeWidth={4} fill="none" strokeLinecap="round" />
    ))}
  </svg>
);

const SiteAntigo: React.FC<{d: Cena24Props['antes']}> = ({d}) => (
  <div style={{position: 'absolute', inset: 0, background: '#B3C5E0', fontFamily: '"Times New Roman", Times, serif', color: '#111'}}>
    <div style={{position: 'absolute', left: 40, top: 60, width: 856, bottom: 0, background: '#fff'}}>
      <div style={{margin: 14, height: 190, background: 'linear-gradient(180deg,#5C93DC 0%,#2F68B8 55%,#17458F 100%)', border: '2px solid #0E2F66', position: 'relative'}}>
        <div style={{position: 'absolute', left: 22, top: 14, color: '#fff', fontStyle: 'italic', fontSize: 30}}>{d.saudacao}</div>
        <div style={{position: 'absolute', left: 22, top: 50, color: '#fff', fontWeight: 700, fontSize: 64, lineHeight: 1.0, textShadow: '2px 2px 0 #0B2550', width: 420}}>{d.nome}</div>
        <div style={{position: 'absolute', left: 560, top: 20, width: 130, height: 130, transform: 'rotate(-14deg)'}}>
          <svg width={130} height={130} viewBox="0 0 100 100">
            <polygon points={Array.from({length: 24}, (_, i) => {
              const r = i % 2 ? 40 : 50;
              const a = (i / 24) * Math.PI * 2;
              return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
            }).join(' ')} fill="#E0302A" stroke="#fff" strokeWidth={2} />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontStyle: 'italic', fontSize: 22, textAlign: 'center', lineHeight: 1}}>{d.selo}</div>
        </div>
      </div>
      <div style={{display: 'flex', gap: 6, margin: '0 14px'}}>
        {d.menu.map((m) => (
          <div key={m} style={{background: 'linear-gradient(180deg,#F4F4F4,#C9C9C9)', border: '2px outset #DDD', padding: '3px 12px', fontSize: 19, fontWeight: 700}}>{m}</div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 16, top: 270, width: 400, fontSize: 21, lineHeight: 1.25, textAlign: 'justify'}}>
        {d.texto} <span style={{color: '#0000EE', textDecoration: 'underline'}}>Clique aqui</span> para ver o nosso <span style={{color: '#0000EE', textDecoration: 'underline'}}>cardápio</span>.
        <div style={{fontWeight: 700, fontSize: 25, marginTop: 22}}>{d.horario}</div>
        <div style={{fontWeight: 700, fontSize: 21, marginTop: 18}}>{d.semana[0]}</div>
        {d.semana.slice(1).map((x) => (
          <div key={x}>• <span style={{color: '#0000EE', textDecoration: 'underline'}}>{x}</span></div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 470, top: 280, width: 330, border: '2px solid #B22', background: '#FFF6F0', padding: 14, textAlign: 'center'}}>
        <div style={{fontWeight: 700, fontSize: 28}}>{d.caixa}</div>
        <div style={{fontStyle: 'italic', fontSize: 18, marginTop: 6}}>de seg. a sáb.</div>
      </div>
      <div style={{position: 'absolute', left: 470, top: 420, width: 330, textAlign: 'center', fontSize: 19}}>
        Você é o visitante número
        <div style={{display: 'flex', justifyContent: 'center', gap: 3, marginTop: 6}}>
          {d.contador.split('').map((c, i) => (
            <span key={i} style={{background: '#111', color: '#7CFF6B', fontFamily: 'Courier New, monospace', fontSize: 22, padding: '0 5px'}}>{c}</span>
          ))}
        </div>
        <div style={{color: '#0000EE', textDecoration: 'underline', marginTop: 14}}>Assine nosso livro de visitas!</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 20, textAlign: 'center', fontSize: 15, color: '#444'}}>{d.rodape}</div>
    </div>
  </div>
);

const SiteNovo: React.FC<{d: Cena24Props['depois']; tomate: string; frame: number; fps: number}> = ({d, tomate, frame, fps}) => (
  <div style={{position: 'absolute', inset: 0, background: '#FFFDF9', fontFamily: MAN, color: '#1A1A1A'}}>
    <div style={{height: 50, background: '#1A1A1A', color: '#fff', fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 150}}>{d.faixa}</div>
    <div style={{display: 'flex', alignItems: 'center', padding: '22px 40px', fontSize: 20, fontWeight: 600}}>
      <div style={{fontFamily: IT, fontWeight: 800, fontSize: 26}}>{d.marca}</div>
      <div style={{marginLeft: 'auto', display: 'flex', gap: 30}}>{d.menu.map((m) => <span key={m}>{m}</span>)}</div>
    </div>
    {/* arco tomate com o pão: mora na metade que o site antigo cobre no fim */}
    <div style={{position: 'absolute', left: 46, top: 160, width: 380, height: 700, borderRadius: '190px 190px 24px 24px', background: tomate, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 10, top: 330}}><Pao w={360} /></div>
      <div style={{position: 'absolute', left: 24, bottom: 26, background: '#fff', borderRadius: 999, padding: '8px 18px', fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8}}>
        <span style={{width: 10, height: 10, borderRadius: 5, background: tomate}} />{d.selo}
      </div>
    </div>
    <div style={{position: 'absolute', left: 498, top: 150, fontFamily: IT, fontWeight: 800, fontSize: 70, lineHeight: 0.98, letterSpacing: -2.6}}>
      {d.titulo[0]}<br /><span style={{color: tomate}}>{d.titulo[1]}</span><br />{d.titulo[2]}
    </div>
    <div style={{position: 'absolute', left: 498, top: 395, width: 400, fontSize: 22, fontWeight: 500, color: '#555', lineHeight: 1.3}}>{d.sub}</div>
    <div style={{position: 'absolute', left: 498, top: 476, background: '#1A1A1A', color: '#fff', borderRadius: 999, padding: '14px 18px 14px 28px', fontSize: 21, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12}}>
      {d.botao}
      <span style={{width: 28, height: 28, borderRadius: 14, background: tomate, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18}}>→</span>
    </div>
    {d.produtos.map((p, i) => {
      const k = spring({frame: frame - (58 + i * 5), fps, config: {damping: 11, stiffness: 190}});
      const pop = interpolate(k, [0, 0.6, 1], [1, 1.12, 1]);
      return (
        <div key={p.nome} style={{position: 'absolute', left: 498, top: 570 + i * 104 + (1 - k) * 12, width: 400, height: 88, borderRadius: 18, background: '#fff', boxShadow: '0 4px 14px rgba(26,26,26,0.07)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 16}}>
          <div style={{width: 58, height: 58, borderRadius: 14, background: ['#FCE3CF', '#F7D2C2', '#2A2420'][i % 3], display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop})`}}>
            <Pao w={44} />
          </div>
          <div>
            <div style={{fontWeight: 800, fontSize: 22}}>{p.nome}</div>
            <div style={{fontSize: 16, color: '#777', fontWeight: 500}}>{p.detalhe}</div>
          </div>
          <div style={{marginLeft: 'auto', background: '#FFF0EA', color: tomate, fontWeight: 800, fontSize: 20, padding: '6px 12px', borderRadius: 10, whiteSpace: 'nowrap', transform: `scale(${pop})`}}>{p.preco}</div>
        </div>
      );
    })}
  </div>
);

export const Cena24: React.FC<Cena24Props> = (props) => {
  const {manchete, endereco, antes, depois, rotuloAntes = 'ANTES', rotuloDepois = 'DEPOIS', tomate = '#E4572E', width = W, height = H} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = Math.min(width / W, height / H);

  // posição do divisor (fração da largura da página)
  const pos = (f: number) => {
    const ida = interpolate(f, [0, 30], [0.93, 0.055], {...clamp, easing: Easing.bezier(0.55, 0, 0.35, 1)});
    const assenta = interpolate(f, [30, 38], [0, 0.03], {...clamp, easing: Easing.out(Easing.quad)});
    const volta = spring({frame: f - 41, fps, config: {damping: 11, stiffness: 70, mass: 1}});
    return ida + assenta + (0.5 - 0.085) * volta;
  };
  const p = pos(frame);
  const vel = Math.abs(pos(frame + 0.5) - pos(frame - 0.5)) * JW; // px por quadro
  const borrao = Math.min(14, vel * 0.35);
  const squash = 1 - 0.14 * Math.exp(-Math.pow((frame - 31) / 2.5, 2)) - 0.12 * Math.exp(-Math.pow((frame - 42) / 2.5, 2));
  const x = p * JW;
  const zoom = 1 + 0.03 * interpolate(frame, [0, 120], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});

  const ponto = (t: string) => (
    <>
      {t}
      <span style={{color: tomate}}>.</span>
    </>
  );

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #EEF1F6 0%, #E6EAF1 100%)'}}>
      <div style={{position: 'absolute', left: (width - W * s) / 2, top: (height - H * s) / 2, width: W, height: H, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '50% 55%'}}>
          <div style={{position: 'absolute', top: 44, width: W, textAlign: 'center', fontFamily: IT, fontWeight: 700, fontSize: 88, lineHeight: 0.98, letterSpacing: -3.2, color: '#121418'}}>
            {ponto(manchete[0])}
            <br />
            {ponto(manchete[1])}
          </div>
          {/* janela */}
          <div style={{position: 'absolute', left: (W - JW) / 2, top: 268, width: JW, height: JH, borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 4px rgba(20,30,50,0.06), 0 12px 28px rgba(20,30,50,0.10), 0 40px 80px rgba(20,30,50,0.14)'}}>
            <div style={{height: 56, background: '#F1F2F4', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 9, borderBottom: '1px solid #E2E4E8'}}>
              {[0, 1, 2].map((i) => <span key={i} style={{width: 13, height: 13, borderRadius: 7, background: '#C9CCD2'}} />)}
              <span style={{marginLeft: 18, color: '#A0A4AB', fontSize: 22}}>‹ ›</span>
              <div style={{margin: '0 auto', background: '#fff', borderRadius: 999, padding: '6px 70px', fontFamily: MAN, fontSize: 18, color: '#555', fontWeight: 500}}>{endereco}</div>
              <span style={{color: '#A0A4AB', fontSize: 22}}>···</span>
            </div>
            <div style={{position: 'relative', width: JW, height: PH}}>
              <SiteAntigo d={antes} />
              <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${x}px)`}}>
                <SiteNovo d={depois} tomate={tomate} frame={frame} fps={fps} />
              </div>
              {/* rótulos */}
              <div style={{position: 'absolute', left: 18, top: 16, background: '#1A1A1A', color: '#fff', fontFamily: MAN, fontWeight: 800, fontSize: 17, letterSpacing: 2.5, padding: '7px 16px', borderRadius: 999}}>{rotuloAntes}</div>
              <div style={{position: 'absolute', right: 18, top: 16, background: '#fff', color: '#1A1A1A', fontFamily: MAN, fontWeight: 800, fontSize: 17, letterSpacing: 2.5, padding: '7px 16px', borderRadius: 999, boxShadow: '0 1px 4px rgba(0,0,0,0.15)'}}>{rotuloDepois}</div>
              {/* divisor + alça */}
              <div style={{position: 'absolute', left: x - 3, top: 0, width: 6, height: PH, background: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.18)', filter: `blur(${borrao * 0.4}px)`}} />
              <div style={{position: 'absolute', left: x - 32, top: PH / 2 - 32, width: 64, height: 64, borderRadius: 32, background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transform: `scaleX(${squash}) scaleY(${2 - squash})`, filter: `blur(${borrao * 0.5}px)`}}>
                <svg width={34} height={20} viewBox="0 0 34 20"><path d="M10 3 L3 10 L10 17 M24 3 L31 10 L24 17" stroke="#1A1A1A" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0, opacity: 0.04, mixBlendMode: 'multiply', pointerEvents: 'none'}}>
        <filter id="g24"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="13" /></filter>
        <rect width="100%" height="100%" filter="url(#g24)" />
      </svg>
    </AbsoluteFill>
  );
};
