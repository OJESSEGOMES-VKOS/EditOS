// cena32 — Nota fiscal (3D edição: impressora e papel curvado em CSS 3D, sem Blender).
// O papel é uma cadeia de tiras articuladas (curva para trás); cada linha só aparece saindo da fenda.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/google-fonts/IBMPlexMono';

const {fontFamily: PLEX} = loadFont('normal', {weights: ['500', '600', '700'], subsets: ['latin']});

export type Item = {nome: string; valor: string};
export type Cena32Props = {
  loja?: string;
  data?: string;
  itens?: Item[]; // 4 (no máximo 5)
  total?: string;
  width?: number;
  height?: number;
  duracao?: number;
};

const PW = 420; // largura do papel
const SH = 24; // altura de cada tira
const LINHA = 50;

const Papel: React.FC<{L: number; conteudo: React.ReactNode; flex: number}> = ({L, conteudo, flex}) => {
  const n = Math.ceil(L / SH);
  // tiras irmãs: a posição de cada uma é acumulada aqui (sem aninhar contextos 3D)
  const tiras: React.ReactNode[] = [];
  let y = 0;
  let z = 0;
  let th = 0;
  for (let j = 0; j < n; j++) {
    th += j === 0 ? 0 : ((0.9 + (j / 25) * 1.4 + flex * (j / n) * 1.2) * Math.PI) / 180;
    const u0 = L - (j + 1) * SH;
    const luz = Math.min(1, 0.84 + j * 0.05);
    tiras.push(
      <div key={j} style={{position: 'absolute', left: -PW / 2, top: -SH, width: PW, height: SH + 1.6, overflow: 'hidden', transformOrigin: '50% 100%',
        transform: `translate3d(0, ${y}px, ${z}px) rotateX(${(th * 180) / Math.PI}deg)`}}>
        <div style={{position: 'absolute', left: 0, top: -u0, width: PW, height: L}}>{conteudo}</div>
        <div style={{position: 'absolute', inset: 0, background: `rgba(10,16,30,${1 - luz})`}} />
      </div>,
    );
    y -= SH * Math.cos(th);
    z -= SH * Math.sin(th);
  }
  return <>{tiras}</>;
};

export const Cena32: React.FC<Cena32Props> = ({
  loja = 'ESTÚDIO ALVO',
  data = '03 NOV 2026   14:22',
  itens = [
    {nome: 'Câmera', valor: 'R$ 2.400'},
    {nome: 'Lente', valor: 'R$ 1.200'},
    {nome: 'Luzes', valor: 'R$ 680'},
    {nome: 'Microfone', valor: 'R$ 250'},
  ],
  total = 'R$ 4.530',
  width = 1080,
  height = 1350,
  duracao = 150,
}) => {
  const k = Math.min(width / 1080, height / 1350);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 60% at 50% 45%, #11192B 0%, #0b1120 50%, #06090F 100%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 1080, height: 1350, marginLeft: -540, marginTop: -675, transform: `scale(${k})`}}>
        <Cena loja={loja} data={data} itens={itens} total={total} duracao={duracao} />
      </div>
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.06, mixBlendMode: 'overlay'}}>
        <filter id="g32"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter="url(#g32)" />
      </svg>
    </AbsoluteFill>
  );
};

const Cena: React.FC<Required<Omit<Cena32Props, 'width' | 'height'>>> = ({loja, data, itens, total, duracao}) => {
  const frame = useCurrentFrame();
  const s = duracao / 150;
  const its = itens.slice(0, 5);
  // posições no papel (de cima para baixo)
  const yItem0 = 168;
  const yDupla = yItem0 + its.length * LINHA + 8;
  const yTotal = yDupla + 22;
  const yBarra = yTotal + 92;
  const FIM = yBarra + 96;
  // avanço do papel: cabeçalho já impresso, uma linha por passo, total numa corrida mais longa, código de barras por último
  const passos: [number, number, number][] = [];
  its.forEach((_, i) => passos.push([(30 + i * 10) * s, 4, LINHA]));
  const tTotal = (30 + its.length * 10 + 2) * s;
  passos.push([tTotal, 9, yBarra - (yItem0 + its.length * LINHA) + 2]);
  passos.push([tTotal + 16 * s, 6, FIM - yBarra - 2]);
  let L = yItem0 + 2;
  let flex = 0;
  passos.forEach(([t0, dur, dl]) => {
    const p = interpolate(frame, [t0, t0 + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
    L += p * dl;
    const dt = frame - (t0 + dur);
    if (dt >= 0 && dt < 14) flex += Math.sin(dt * 0.9) * Math.exp(-dt * 0.32) * 3;
  });

  const lin = (y: number, ch: React.ReactNode) => <div style={{position: 'absolute', left: 34, right: 34, top: y}}>{ch}</div>;
  const conteudo = (
    <div style={{position: 'absolute', inset: 0, fontFamily: PLEX, color: '#1C1F25',
      background: 'linear-gradient(to bottom, #F6F8F7, #EEF1EF), #F3F5F4',
      clipPath: `polygon(${[...Array(22)].map((_, i) => `${(i / 21) * 100}% ${i % 2 ? 0 : 12}px`).join(',')}, 100% 100%, 0 100%)`}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0.018) 0 1px, transparent 1px 3px)'}} />
      {lin(40, <div style={{textAlign: 'center', fontWeight: 700, fontSize: 34, letterSpacing: 5}}>{loja}</div>)}
      {lin(90, <div style={{textAlign: 'center', fontWeight: 500, fontSize: 17, color: '#61666F', letterSpacing: 1, whiteSpace: 'pre'}}>{data}</div>)}
      {lin(130, <div style={{borderTop: '2px dashed #61666F', opacity: 0.7}} />)}
      {its.map((it, i) =>
        lin(yItem0 + i * LINHA, (
          <div key={i} style={{display: 'flex', justifyContent: 'space-between', fontSize: 27}}>
            <span style={{fontWeight: 500}}>{it.nome}</span><span style={{fontWeight: 600}}>{it.valor}</span>
          </div>
        )),
      )}
      {lin(yDupla, <div style={{borderTop: '2px solid #1C1F25', borderBottom: '2px solid #1C1F25', height: 5}} />)}
      {lin(yTotal, (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
          <span style={{fontWeight: 700, fontSize: 20, letterSpacing: 2}}>TOTAL</span>
          <span style={{fontWeight: 700, fontSize: 56, letterSpacing: -1}}>{total}</span>
        </div>
      ))}
      {lin(yBarra, (
        <div style={{height: 64, margin: '0 18px', background: `repeating-linear-gradient(to right, #1C1F25 0 3px, transparent 3px 5px, #1C1F25 5px 6px, transparent 6px 10px, #1C1F25 10px 14px, transparent 14px 16px, #1C1F25 16px 17px, transparent 17px 21px)`}} />
      ))}
    </div>
  );

  const ease = Easing.bezier(0.4, 0, 0.2, 1);
  const rotX = interpolate(frame, [0, 110 * s], [-30, -12], {extrapolateRight: 'clamp', easing: ease});
  const rotY = interpolate(frame, [0, 110 * s], [-28, -8], {extrapolateRight: 'clamp', easing: ease});
  const zoom = interpolate(frame, [0, 110 * s], [640, 700], {extrapolateRight: 'clamp', easing: ease});
  const desce = interpolate(frame, [0, 110 * s], [640, 820], {extrapolateRight: 'clamp', easing: ease});

  const BW = 620;
  const BH = 170;
  const BD = 420;
  const slotZ = 70; // fenda um pouco à frente do centro
  return (
    <div style={{position: 'absolute', inset: 0, perspective: 2300, perspectiveOrigin: '540px 560px'}}>
      <div style={{position: 'absolute', left: 540, top: 0, transformStyle: 'preserve-3d',
        transform: `translateY(${desce}px) translateZ(${zoom}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`}}>
        {/* sombra / reflexo no chão */}
        <div style={{position: 'absolute', left: -500, top: -400, width: 1000, height: 800, transform: `translateY(${BH}px) rotateX(90deg)`,
          background: 'radial-gradient(ellipse 45% 42% at 50% 50%, rgba(0,0,0,0.65), rgba(0,0,0,0) 70%)'}} />
        {/* corpo da impressora */}
        <div style={{position: 'absolute', left: -BW / 2, top: 0, width: BW, height: BH, borderRadius: '0 0 46px 46px', transform: `translateZ(${BD / 2}px)`,
          background: 'linear-gradient(to bottom, #4a505a 0%, #30353d 14%, #24282e 60%, #15181c 100%)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08)'}} />
        <div style={{position: 'absolute', left: -BD / 2, top: 0, width: BD, height: BH, borderRadius: '0 0 46px 46px', transform: `rotateY(90deg) translateZ(${BW / 2}px)`,
          background: 'linear-gradient(to bottom, #2c3038, #121418)'}} />
        <div style={{position: 'absolute', left: -BD / 2, top: 0, width: BD, height: BH, borderRadius: '0 0 46px 46px', transform: `rotateY(-90deg) translateZ(${BW / 2}px)`,
          background: 'linear-gradient(to bottom, #4a505a, #1c1f24)'}} />
        {/* tampo de vidro preto com borda macia */}
        <div style={{position: 'absolute', left: -BW / 2, top: -BD / 2, width: BW, height: BD, borderRadius: 46, transform: 'rotateX(90deg)', background: '#3a3f47', overflow: 'hidden'}}>
          <div style={{position: 'absolute', inset: 22, borderRadius: 28, background: 'linear-gradient(160deg, #0b0d11 0%, #050608 60%, #0d1016 100%)'}} />
          {/* reflexo leve do papel no vidro */}
          <div style={{position: 'absolute', left: BW / 2 - PW / 2, width: PW, top: 40, height: BD / 2 + slotZ - 45, background: 'linear-gradient(to bottom, rgba(220,228,240,0), rgba(220,228,240,0.10))'}} />
          {/* fenda + barra de corte de aço */}
          <div style={{position: 'absolute', left: BW / 2 - PW / 2 - 14, width: PW + 28, top: BD / 2 + slotZ - 5, height: 10, background: '#000', borderRadius: 4}} />
          <div style={{position: 'absolute', left: BW / 2 - PW / 2 - 18, width: PW + 36, top: BD / 2 + slotZ + 6, height: 7, borderRadius: 4, background: 'linear-gradient(to right, #6f7680, #e8ecf0 40%, #9aa1aa 70%, #5c626b)'}} />
        </div>
        {/* papel saindo da fenda, inclinado para trás */}
        <div style={{position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d', transform: `translateZ(${slotZ}px) rotateX(10deg)`}}>
          <Papel L={L} conteudo={conteudo} flex={flex} />
        </div>
      </div>
    </div>
  );
};
