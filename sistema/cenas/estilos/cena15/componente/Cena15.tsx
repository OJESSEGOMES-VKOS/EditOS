// cena15 — Headline Highlight (Manchete grifada). Palco base 1080x1350, recomposto em qualquer formato.
// Jornal, pessoa e post são ilustração inventada; num vídeo real o artigo é o print real com ORIGEM.md.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont as loadNews} from '@remotion/google-fonts/Newsreader';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

const {fontFamily: NEWS} = loadNews('normal', {weights: ['400', '700', '800'], subsets: ['latin']});
const {fontFamily: INTER} = loadInter('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin']});

/** cada linha do corpo é uma lista de trechos; trecho com g=true é o que o marca-texto pega */
export type Trecho = {t: string; g?: boolean};

export type Cena15Props = {
  width?: number;
  height?: number;
  jornal?: string;
  dataLinha?: string;
  edicao?: string;
  menu?: string[];
  menuAtivo?: number;
  secao?: string;
  manchete?: string[];
  autor?: string;
  autorLinha?: string;
  capitular?: string;
  corpo?: Trecho[][];
  postNome?: string;
  postArroba?: string;
  postTexto?: string[];
  postNumeros?: string[];
  marcaTexto?: string;
  /** quadro em que o marca-texto começa */
  inicioGrifo?: number;
};

const corpoDemo: Trecho[][] = [
  [{t: 'uando a Casa Ventura passou as ligações'}],
  [{t: 'dos clientes para um atendente automático,'}],
  [{t: 'a diretoria chamou de piloto. '}, {t: 'Em setembro,', g: true}],
  [{t: 'o custo do suporte tinha caído 58% enquanto', g: true}],
  [{t: 'uma equipe de onze dava conta do dobro.', g: true}, {t: ' Os'}],
  [{t: 'documentos internos mostram que o plano foi'}],
  [{t: 'aprovado no começo do ano, muito antes de a'}],
  [{t: 'equipe saber.'}],
];

const RuidoFiltro: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <filter id="as15tinta" x="-5%" y="-30%" width="110%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04 0.35" numOctaves={2} seed={4} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={7} />
    </filter>
    <filter id="as15riscos">
      <feTurbulence type="fractalNoise" baseFrequency="0.005 0.6" numOctaves={1} seed={9} />
      <feColorMatrix values="0 0 0 0 0.62  0 0 0 0 0.82  0 0 0 0 0.05  0 0 0 0.55 -0.1" />
    </filter>
  </svg>
);

export const Cena15: React.FC<Cena15Props> = ({
  width = 1080,
  height = 1350,
  jornal = 'O Mensageiro Austral',
  dataLinha = 'QUARTA, 29 DE OUTUBRO DE 2026',
  edicao = 'EDIÇÃO DE NEGÓCIOS',
  menu = ['Mundo', 'Negócios', 'Mercado', 'Tecnologia', 'Opinião', 'Trabalho'],
  menuAtivo = 1,
  secao = 'NEGÓCIOS / TRABALHO',
  manchete = ['Uma loja regional passou o', 'atendimento para a IA.', 'Depois, a margem dobrou.'],
  autor = 'Por Helena Duarte',
  autorLinha = '28 out 2026 · 7 min de leitura',
  capitular = 'Q',
  corpo = corpoDemo,
  postNome = 'Clara Moura',
  postArroba = '@claramoura · 2 h',
  postTexto = ['Leia o primeiro parágrafo de novo.', 'Uma equipe de onze. Essa é a', 'história toda.'],
  postNumeros = ['1,2 mil', '4,8 mil', '21 mil'],
  marcaTexto = '#C9F52A',
  inicioGrifo = 48,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = Math.min(width / 1080, height / 1350);
  const kFundo = Math.max(width / 1080, height / 1350);

  // entrada do artigo: vem do canto de baixo, deitado para trás, numa mola pesada
  const voo = spring({frame, fps, config: {damping: 15, stiffness: 70, mass: 1.3}});
  const vooAnt = spring({frame: frame - 1, fps, config: {damping: 15, stiffness: 70, mass: 1.3}});
  const vel = Math.abs(voo - vooAnt);
  const balanco = spring({frame: frame - 12, fps, config: {damping: 7, stiffness: 45, mass: 1}});
  const inclX = interpolate(voo, [0, 1], [52, 9]) + (1 - balanco) * -5;
  const inclY = interpolate(voo, [0, 1], [-30, -9]);
  const rotZ = interpolate(voo, [0, 1], [-14, -2.2]);
  const tx = interpolate(voo, [0, 1], [-330, 0]);
  const ty = interpolate(voo, [0, 1], [760, 0]);
  const escVoo = interpolate(voo, [0, 1], [1.25, 1]) * 1.17;
  const desfoque = Math.min(14, vel * 260);

  // câmera: travelling até o parágrafo (começo lento, deslize longo, pouso suave)
  const cam = interpolate(frame, [26, 110], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.55, 0, 0.25, 1)});
  const camEsc = 1 + cam * 0.13;
  const camY = -cam * 30;

  // marca-texto: linha a linha, rápido no começo, solta no fim, pausa entre linhas
  const linhasG = corpo.map((l, i) => (l.some((s) => s.g) ? i : -1)).filter((i) => i >= 0);
  const durLinha = 9, pausa = 3;
  const progLinha = (ordem: number) => interpolate(frame, [inicioGrifo + ordem * (durLinha + pausa), inicioGrifo + ordem * (durLinha + pausa) + durLinha], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.3, 0.1, 0.3, 1)});
  const fimGrifo = inicioGrifo + linhasG.length * (durLinha + pausa);
  const postQ = fimGrifo + 12;
  const post = spring({frame: frame - postQ, fps, config: {damping: 10, stiffness: 160, mass: 0.7}});
  const postRot = spring({frame: frame - postQ - 4, fps, config: {damping: 9, stiffness: 120, mass: 0.7}});

  // parede de artigos desfocados ao fundo (deriva sempre, paralaxe menor que o artigo)
  const parede: React.ReactNode[] = [];
  for (let r = -1; r < 6; r++)
    for (let c = -1; c < 5; c++) {
      const x = c * 300 + (r % 2) * 120 - 60 + frame * 0.35;
      const y = r * 260 - 40 - frame * 0.2 + camY * 0.4;
      parede.push(
        <div key={`${r}-${c}`} style={{position: 'absolute', left: x, top: y, width: 250, height: 210, background: '#E9EAEC', opacity: 0.32, borderRadius: 4, padding: 18, boxSizing: 'border-box'}}>
          <div style={{height: 70, background: (r + c) % 3 === 0 ? '#7d7466' : '#5f6670', marginBottom: 14}} />
          {[0, 1, 2, 3].map((i) => <div key={i} style={{height: 10, background: '#6a6f76', marginBottom: 12, width: `${90 - i * 12}%`}} />)}
        </div>,
      );
    }

  const INK = '#16181B', BODY = '#26292D', GR = '#6A6F76', RULE = '#D9DBDE';
  const largura = 720;
  return (
    <AbsoluteFill style={{background: '#15181C', overflow: 'hidden'}}>
      <RuidoFiltro />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${kFundo * (1 + cam * 0.05)}) rotate(-4deg)`, transformOrigin: '50% 50%', filter: 'blur(9px)'}}>{parede}</div>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.7) 100%)'}} />
      <div style={{position: 'absolute', left: (width - 1080 * k) / 2, top: (height - 1350 * k) / 2, width: 1080, height: 1350, transform: `scale(${k})`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${camY}px) scale(${camEsc})`, transformOrigin: '50% 58%', perspective: 1600}}>
          {/* o artigo */}
          <div
            style={{
              position: 'absolute', left: 120, top: 120, width: largura, padding: '34px 44px 40px', boxSizing: 'border-box', background: '#FCFCFA',
              transform: `translate(${tx}px, ${ty}px) rotateX(${inclX}deg) rotateY(${inclY}deg) rotateZ(${rotZ}deg) scale(${escVoo})`,
              transformOrigin: '50% 60%', filter: desfoque > 0.3 ? `blur(${desfoque}px)` : undefined,
              boxShadow: '0 40px 80px rgba(0,0,0,0.55), 0 10px 24px rgba(0,0,0,0.35)', borderRadius: 3,
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: INTER, fontSize: 12, fontWeight: 600, letterSpacing: 1.2, color: GR}}>
              <span>{dataLinha}</span><span>{edicao}</span>
            </div>
            <div style={{fontFamily: NEWS, fontWeight: 800, fontSize: 56, letterSpacing: -1.5, color: INK, textAlign: 'center', marginTop: 6, lineHeight: 1.1, fontVariationSettings: '"opsz" 72'}}>{jornal}</div>
            <div style={{height: 2, background: INK, marginTop: 8}} />
            <div style={{display: 'flex', justifyContent: 'center', gap: 22, fontFamily: INTER, fontSize: 14, color: BODY, padding: '9px 0', borderBottom: `1px solid ${RULE}`}}>
              {menu.map((m, i) => <span key={m} style={{fontWeight: i === menuAtivo ? 700 : 500, borderBottom: i === menuAtivo ? `2px solid ${INK}` : 'none'}}>{m}</span>)}
            </div>
            <div style={{fontFamily: INTER, fontSize: 13, fontWeight: 700, letterSpacing: 1.4, color: '#C1272D', marginTop: 22}}>{secao}</div>
            <div style={{fontFamily: NEWS, fontWeight: 700, fontSize: 43, lineHeight: 1.08, letterSpacing: -0.8, color: INK, marginTop: 8}}>
              {manchete.map((l) => <div key={l}>{l}</div>)}
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, paddingBottom: 16, borderBottom: `1px solid ${RULE}`, fontFamily: INTER}}>
              <div style={{width: 34, height: 34, borderRadius: 17, background: 'linear-gradient(135deg,#b9a48f,#6d5b4c)'}} />
              <div style={{flex: 1}}>
                <div style={{fontSize: 14, fontWeight: 600, color: INK}}>{autor}</div>
                <div style={{fontSize: 12, color: GR}}>{autorLinha}</div>
              </div>
              <div style={{width: 26, height: 26, border: `1px solid ${RULE}`, borderRadius: 4}} />
              <div style={{width: 26, height: 26, border: `1px solid ${RULE}`, borderRadius: 4}} />
            </div>
            <div style={{position: 'relative', marginTop: 20, fontFamily: NEWS, fontSize: 25.5, lineHeight: '38px', color: BODY}}>
              <div style={{position: 'absolute', left: 0, top: 2, fontFamily: NEWS, fontWeight: 800, fontSize: 86, lineHeight: '74px', color: INK}}>{capitular}</div>
              {corpo.map((linha, i) => {
                const ordem = linhasG.indexOf(i);
                return (
                  <div key={i} style={{whiteSpace: 'nowrap', paddingLeft: i < 2 ? 64 : 0, color: i >= corpo.length - 2 ? '#9a9ea4' : BODY}}>
                    {linha.map((s, j) => {
                      if (!s.g) return <span key={j}>{s.t}</span>;
                      const p = progLinha(ordem);
                      return (
                        <span key={j} style={{position: 'relative', display: 'inline-block'}}>
                          {p > 0 && (
                            <span style={{position: 'absolute', left: -4, right: -6, top: 5, bottom: 1, clipPath: `polygon(0 0, ${p * 104}% 0, ${p * 104 - 3}% 100%, 0 100%)`, mixBlendMode: 'multiply'}}>
                              <span style={{position: 'absolute', inset: 0, background: marcaTexto, filter: 'url(#as15tinta)', borderRadius: '3px 6px 4px 7px'}} />
                              <span style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 16, background: '#B8E81A', filter: 'url(#as15tinta)', borderRadius: 6, opacity: 0.9}} />
                              <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}><rect width="100%" height="100%" filter="url(#as15riscos)" /></svg>
                            </span>
                          )}
                          <span style={{position: 'relative'}}>{s.t}</span>
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          {/* o post (recibo) */}
          {post > 0.01 && (
            <div style={{position: 'absolute', left: 590, top: 930, width: 440, padding: '20px 24px', background: '#fff', borderRadius: 16, fontFamily: INTER, color: INK, transform: `scale(${post}) rotate(${interpolate(postRot, [0, 1], [-6, 2.5])}deg)`, transformOrigin: '30% 30%', boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 8px 18px rgba(0,0,0,0.3)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                <div style={{width: 40, height: 40, borderRadius: 20, background: 'linear-gradient(135deg,#8c97a6,#3e4652)'}} />
                <div>
                  <div style={{fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6}}>
                    {postNome}
                    <svg width="17" height="17" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#2F7BF5" /><path d="M6 10.3l2.6 2.6L14.2 7.4" stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div style={{fontSize: 14, color: GR}}>{postArroba}</div>
                </div>
              </div>
              <div style={{fontSize: 19, lineHeight: 1.35, marginTop: 12}}>{postTexto.map((l) => <div key={l}>{l}</div>)}</div>
              <div style={{display: 'flex', gap: 26, fontSize: 14, color: GR, marginTop: 12}}>
                <span>↩ {postNumeros[0]}</span><span>⇄ {postNumeros[1]}</span><span>♡ {postNumeros[2]}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
