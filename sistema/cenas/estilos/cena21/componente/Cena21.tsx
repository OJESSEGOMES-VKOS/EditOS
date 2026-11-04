// cena21 — Laptop reveal (Notebook revela). 3D edição: notebook em CSS 3D (base + tampa com dobradiça),
// câmera orbita de 3/4 baixo até a frente, a tela acende passando por desfoque, a página rola, o cursor clica,
// o nome sobe por máscara. Página do produto é ilustração genérica desenhada em código.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/InterTight';

const {fontFamily: INTER} = loadFont('normal', {weights: ['500', '600', '700', '800'], subsets: ['latin', 'latin-ext']});

export type Cena21Props = {
  produto: string; // nome que sobe embaixo
  linha: string; // linha pequena
  marca: string; // nome no topo da página
  menu: string[];
  titulo: [string, string];
  subtitulo: string;
  botao: string;
  azul?: string;
  width?: number;
  height?: number;
};

const W = 1080;
const H = 1350;
const LW = 820; // largura do notebook
const LD = 560; // profundidade da base
const LH = 560; // altura da tampa

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Pagina: React.FC<Cena21Props & {rolagem: number; clique: number; cursor: [number, number]; cursorVis: number}> = (p) => {
  const azul = p.azul ?? '#2F6BFF';
  const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const cores = ['#DCEBFF', '#DDF5E6', '#FFE6D5', '#E9E3FF', '#FFF1C9', '#D9F2F2'];
  const tarefas = [[0, 0, 0], [0, 1, 1], [1, 0, 2], [2, 1, 3], [3, 0, 1], [3, 2, 4], [4, 1, 5], [5, 0, 0], [5, 2, 2], [6, 1, 3], [1, 2, 4], [2, 3, 0]];
  return (
    <div style={{position: 'absolute', inset: 0, background: '#FAFAFB', overflow: 'hidden', fontFamily: INTER, color: '#0F1115'}}>
      <div style={{position: 'absolute', left: 0, top: -p.rolagem, width: '100%'}}>
        <div style={{display: 'flex', alignItems: 'center', padding: '18px 26px', fontSize: 13}}>
          <div style={{width: 16, height: 12, borderRadius: 4, background: azul, marginRight: 8}} />
          <div style={{fontWeight: 700, fontSize: 14}}>{p.marca}</div>
          <div style={{display: 'flex', gap: 22, marginLeft: 70, color: '#555A63', fontWeight: 500}}>
            {p.menu.map((m) => <span key={m}>{m}</span>)}
          </div>
          <div style={{marginLeft: 'auto', color: '#555A63', fontWeight: 500}}>Entrar</div>
        </div>
        <div style={{textAlign: 'center', marginTop: 38, fontSize: 50, fontWeight: 800, letterSpacing: -2, lineHeight: 1.0}}>
          {p.titulo[0]}<br />{p.titulo[1]}
        </div>
        <div style={{textAlign: 'center', marginTop: 14, fontSize: 15, color: '#6E6E73', fontWeight: 500}}>{p.subtitulo}</div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 18}}>
          <div style={{background: azul, color: '#fff', fontWeight: 700, fontSize: 15, padding: '10px 26px', borderRadius: 999, transform: `scale(${1 - 0.08 * p.clique})`, filter: `brightness(${1 - 0.22 * p.clique})`}}>
            {p.botao}
          </div>
        </div>
        {/* a imagem do produto: uma semana em quadros */}
        <div style={{margin: '34px 70px 0', background: '#fff', borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', padding: '14px 18px 20px'}}>
          <div style={{display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 700}}>
            Esta semana <span style={{color: '#9A9AA0', fontWeight: 500, marginLeft: 10}}>12 tarefas</span>
            <span style={{marginLeft: 'auto', display: 'flex', gap: 6}}>
              {['Dia', 'Semana', 'Mês'].map((t, i) => (
                <span key={t} style={{fontSize: 11, padding: '3px 9px', borderRadius: 6, background: i === 1 ? '#EEF2FF' : '#F2F2F4', color: '#555'}}>{t}</span>
              ))}
            </span>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginTop: 12}}>
            {dias.map((d) => <div key={d} style={{fontSize: 11, color: '#8A8A90', fontWeight: 600, textAlign: 'center'}}>{d}</div>)}
            {Array.from({length: 28}, (_, i) => {
              const col = i % 7;
              const lin = Math.floor(i / 7);
              const t = tarefas.find((x) => x[0] === col && x[1] === lin);
              return (
                <div key={i} style={{height: 34, borderRadius: 6, background: t ? cores[t[2]] : 'transparent', padding: '5px 6px'}}>
                  {t ? <div style={{height: 5, width: '70%', borderRadius: 3, background: 'rgba(15,17,21,0.35)'}} /> : null}
                  {t ? <div style={{height: 4, width: '45%', borderRadius: 3, marginTop: 5, background: 'rgba(15,17,21,0.18)'}} /> : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* cursor */}
      <svg width={22} height={28} viewBox="0 0 22 28" style={{position: 'absolute', left: p.cursor[0], top: p.cursor[1], opacity: p.cursorVis, transform: `scale(${1 - 0.15 * p.clique})`, transformOrigin: '2px 2px'}}>
        <path d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.8 L18 15.8 Z" fill="#111" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export const Cena21: React.FC<Cena21Props> = (props) => {
  const {width = W, height = H, produto, linha} = props;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = Math.min(width / W, height / H);

  // tampa: 1/4 aberta -> abre com mola e pequeno passo além, assenta ~1 s
  const mola = spring({frame, fps, config: {damping: 11, stiffness: 95, mass: 0.9}, durationInFrames: 34});
  const angTampa = 24 + (102 - 24) * mola; // graus a partir da base
  // câmera: de 3/4 baixo para a frente e um pouco acima
  const cam = interpolate(frame, [0, 42], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const drift = interpolate(frame, [42, 80], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const yaw = -40 * (1 - cam);
  const elev = 4 + 15 * cam;
  const escala = 0.86 + 0.14 * cam + 0.015 * drift;
  const desloc = -40 * (1 - cam) + 8 * drift;
  const dx = 120 * (1 - cam);

  // tela: acende por desfoque enquanto a tampa abre
  const luz = interpolate(frame, [6, 30], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const assenta = interpolate(frame, [26, 40], [24, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const rolagem = interpolate(frame, [44, 66], [0, 64], {...clamp, easing: Easing.inOut(Easing.cubic)}) - assenta;
  const cursorK = interpolate(frame, [62, 84], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cursor: [number, number] = [620 - 150 * cursorK, 360 - 105 * cursorK];
  const clique = interpolate(frame, [86, 89, 96], [0, 1, 0], clamp);
  const cursorVis = interpolate(frame, [56, 62], [0, 1], clamp);

  // nome sobe por máscara com pequeno passo; depois a linha
  const nome = spring({frame: frame - 92, fps, config: {damping: 13, stiffness: 140}});
  const lin = spring({frame: frame - 104, fps, config: {damping: 16, stiffness: 140}});

  const prata = 'linear-gradient(180deg, #E9EAEC 0%, #CFD1D5 45%, #BFC2C7 100%)';

  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 70% at 50% 35%, #F5F5F7 0%, #EEEFF2 55%, #E4E6EA 100%)'}}>
      <div style={{position: 'absolute', left: (width - W * s) / 2, top: (height - H * s) / 2, width: W, height: H, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 1000, perspective: 2600, perspectiveOrigin: '50% 58%'}}>
          <div style={{position: 'absolute', left: W / 2 + dx, top: 830 + desloc, transformStyle: 'preserve-3d', transform: `scale(${escala}) rotateX(${-elev}deg) rotateY(${yaw}deg)`}}>
            {/* sombra de contato */}
            <div style={{position: 'absolute', left: -LW * 0.62, top: -LD * 0.6, width: LW * 1.24, height: LD * 1.2, transform: 'translateY(2px) rotateX(90deg)', background: 'radial-gradient(ellipse 50% 50% at 50% 52%, rgba(30,32,40,0.30) 0%, rgba(30,32,40,0.12) 45%, rgba(30,32,40,0) 72%)'}} />
            {/* base: topo */}
            <div style={{position: 'absolute', left: -LW / 2, top: -LD / 2, width: LW, height: LD, borderRadius: 26, transform: 'translateY(-16px) rotateX(90deg)', background: prata, boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.6)'}}>
              {/* teclado */}
              <div style={{position: 'absolute', left: 60, right: 60, top: 34, height: 215, borderRadius: 10, background: '#2A2C31', padding: 8, display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: 4}}>
                {Array.from({length: 14 * 5}, (_, i) => (
                  <div key={i} style={{background: '#16171A', borderRadius: 4, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)'}} />
                ))}
              </div>
              {/* trackpad */}
              <div style={{position: 'absolute', left: LW / 2 - 200, width: 400, top: 275, height: 250, borderRadius: 18, background: 'linear-gradient(180deg,#C2C5CA,#B3B6BC)', boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.10)'}} />
            </div>
            {/* base: frente (espessura) */}
            <div style={{position: 'absolute', left: -LW / 2, top: -16, width: LW, height: 18, borderRadius: '0 0 18px 18px', transform: `translateZ(${LD / 2}px)`, background: 'linear-gradient(180deg,#D9DBDE,#A7AAB0)'}} />
            {/* tampa (dobradiça no fundo da base) */}
            <div style={{position: 'absolute', left: -LW / 2, top: -16 - LH, width: LW, height: LH, transformStyle: 'preserve-3d', transformOrigin: '50% 100%', transform: `translateZ(${-LD / 2 + 8}px) rotateX(${angTampa - 90}deg)`}}>
              {/* frente: vidro preto + tela */}
              <div style={{position: 'absolute', inset: 0, borderRadius: 24, background: '#0B0C0E', backfaceVisibility: 'hidden', boxShadow: 'inset 0 0 0 3px #C5C8CD'}}>
                <div style={{position: 'absolute', left: 22, right: 22, top: 22, bottom: 30, borderRadius: 6, overflow: 'hidden', background: '#000'}}>
                  <div style={{position: 'absolute', inset: 0, opacity: luz, filter: `blur(${(1 - luz) * 14}px) brightness(${0.55 + 0.45 * luz})`, transform: `translateY(${assenta * 0.5}px)`}}>
                    <Pagina {...props} rolagem={rolagem} clique={clique} cursor={cursor} cursorVis={cursorVis} />
                  </div>
                  {/* reflexo suave no vidro */}
                  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(125deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 38%)'}} />
                </div>
              </div>
              {/* costas: alumínio */}
              <div style={{position: 'absolute', inset: 0, borderRadius: 24, transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', background: 'linear-gradient(160deg,#A9ACB2 0%,#8E9197 40%,#6F7277 100%)'}} />
            </div>
          </div>
        </div>
        {/* nome e linha */}
        <div style={{position: 'absolute', top: 1062, width: W, height: 130, overflow: 'hidden', textAlign: 'center'}}>
          <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 98, letterSpacing: -3.5, color: '#1D1D1F', transform: `translateY(${(1 - nome) * 130}px)`}}>{produto}</div>
        </div>
        <div style={{position: 'absolute', top: 1190, width: W, height: 50, overflow: 'hidden', textAlign: 'center'}}>
          <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 34, color: '#6E6E73', transform: `translateY(${(1 - lin) * 50}px)`}}>{linha}</div>
        </div>
      </div>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0, opacity: 0.05, mixBlendMode: 'multiply'}}>
        <filter id="g21"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" /></filter>
        <rect width="100%" height="100%" filter="url(#g21)" />
      </svg>
    </AbsoluteFill>
  );
};
