// cena25 — Ranking bars (Corrida de barras). Seis barras mudam ano a ano, trocam de lugar com mola
// no instante em que se cruzam, uma barra herói (laranja) sobe até o 1º; o ano gigante rola só o dígito que muda.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/InterTight';

const {fontFamily: IT} = loadFont('normal', {weights: ['600', '700', '800'], subsets: ['latin', 'latin-ext']});

export type Cena25Props = {
  titulo: [string, string];
  subtitulo: string;
  categorias: string[]; // 6
  heroi: number; // índice da categoria herói
  anos: number[]; // ex.: 2021..2026
  valores: number[][]; // valores[ano][categoria] em %
  legendaInicial: [string, string]; // ex.: ['começa', 'em 5º lugar'] (o nome do herói entra na frente, em laranja)
  palavraPassa?: string; // "passa"
  legendaLideranca?: [string, string]; // ['assume', 'a liderança']
  legendaFinal: [string, string];
  chip1?: string; // "1º"
  passoQuadros?: number; // quadros por ano
  laranja?: string;
  width?: number;
  height?: number;
};

const W = 1080;
const H = 1350;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const MUTED = ['#7F93B5', '#9DB89E', '#84B5B1', '#A7AFBC', '#D3A8AE'];

export const Cena25: React.FC<Cena25Props> = ({
  titulo, subtitulo, categorias, heroi, anos, valores, legendaInicial, palavraPassa = 'passa',
  legendaLideranca = ['assume', 'a liderança'], legendaFinal, chip1 = '1º', passoQuadros = 20, laranja = '#FF5A36',
  width = W, height = H,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = Math.min(width / W, height / H);
  const n = categorias.length;
  const INI = 8;
  const DUR = passoQuadros - 1;

  // valor de cada categoria num quadro: cada passo começa rápido e pousa macio
  const valorEm = (f: number, c: number) => {
    let v = valores[0][c];
    for (let i = 1; i < anos.length; i++) {
      const t0 = INI + (i - 1) * passoQuadros;
      const k = interpolate(f, [t0, t0 + DUR], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
      v += (valores[i][c] - valores[i - 1][c]) * k;
    }
    return v;
  };
  const rankEm = (f: number) => {
    const vs = categorias.map((_, c) => valorEm(f, c));
    const ordem = categorias.map((_, c) => c).sort((a, b) => vs[b] - vs[a]);
    const r: number[] = [];
    ordem.forEach((c, i) => (r[c] = i));
    return r;
  };
  // histórico de trocas até o quadro atual
  const r0 = rankEm(0);
  const trocas: {f: number; c: number; de: number; para: number}[] = [];
  let ant = r0;
  for (let f = 1; f <= frame; f++) {
    const r = rankEm(f);
    categorias.forEach((_, c) => {
      if (r[c] !== ant[c]) trocas.push({f, c, de: ant[c], para: r[c]});
    });
    ant = r;
  }
  const posY = (c: number) => {
    let p = r0[c];
    for (const t of trocas) if (t.c === c) p += (t.para - t.de) * spring({frame: frame - t.f, fps, config: {damping: 9, stiffness: 160, mass: 0.8}});
    return p;
  };

  // legenda: o herói passa alguém
  type Leg = {f: number; l: [React.ReactNode, React.ReactNode]};
  const nomeH = <span style={{color: laranja}}>{categorias[heroi]}</span>;
  const legendas: Leg[] = [{f: -99, l: [<>{nomeH} {legendaInicial[0]}</>, legendaInicial[1]]}];
  trocas.filter((t) => t.c === heroi && t.para < t.de).forEach((t) => {
    const passado = trocas.find((x) => x.f === t.f && x.c !== heroi && x.para > x.de);
    legendas.push({f: t.f, l: t.para === 0 ? [<>{nomeH} {legendaLideranca[0]}</>, legendaLideranca[1]] : [<>{nomeH} {palavraPassa}</>, passado ? categorias[passado.c] : '']});
  });
  const fimCorrida = INI + (anos.length - 2) * passoQuadros + DUR;
  if (frame >= fimCorrida + 14) legendas.push({f: fimCorrida + 14, l: legendaFinal});
  const legAtual = legendas[legendas.length - 1];
  const legAnt = legendas.length > 1 ? legendas[legendas.length - 2] : null;
  const kLeg = legAnt ? spring({frame: frame - legAtual.f, fps, config: {damping: 13, stiffness: 160}}) : 1;

  // ano: troca no começo de cada passo; só o dígito que muda rola
  let iAno = 0;
  for (let i = 1; i < anos.length; i++) if (frame >= INI + (i - 1) * passoQuadros) iAno = i;
  const tAno = iAno > 0 ? frame - (INI + (iAno - 1) * passoQuadros) : 99;
  const kAno = spring({frame: tAno, fps, config: {damping: 15, stiffness: 170}});
  const sAno = String(anos[iAno]);
  const sAnt = String(anos[Math.max(0, iAno - 1)]);

  // herói chega ao 1º: chip e inchaço
  const tLider = trocas.find((t) => t.c === heroi && t.para === 0)?.f;
  const kChip = tLider !== undefined ? spring({frame: frame - tLider - 2, fps, config: {damping: 9, stiffness: 200}}) : 0;
  const incha = tLider !== undefined ? 1 + 0.06 * Math.sin(Math.min(1, (frame - tLider) / 10) * Math.PI) : 1;

  const X0 = 256;
  const PX = 17.2; // px por ponto percentual
  const TOP = 318;
  const PASSO = 128;
  const BH = 100;

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #FFFFFF 0%, #F4F6F9 100%)', fontFamily: IT}}>
      <div style={{position: 'absolute', left: (width - W * s) / 2, top: (height - H * s) / 2, width: W, height: H, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', left: 88, top: 50, fontWeight: 700, fontSize: 72, lineHeight: 1.0, letterSpacing: -2.4, color: '#111418'}}>
          {titulo[0]}<br />{titulo[1]}
        </div>
        <div style={{position: 'absolute', left: 90, top: 210, fontWeight: 600, fontSize: 26, color: '#7B8491'}}>{subtitulo}</div>
        {/* grade e eixo */}
        {[10, 20, 30, 40].map((g) => (
          <React.Fragment key={g}>
            <div style={{position: 'absolute', left: X0 + g * PX, top: TOP - 22, width: 2, height: PASSO * n + 10, background: '#E6E9EE'}} />
            <div style={{position: 'absolute', left: X0 + g * PX - 40, width: 80, top: TOP - 58, textAlign: 'center', fontWeight: 600, fontSize: 22, color: '#9AA2AE'}}>{g}%</div>
          </React.Fragment>
        ))}
        <div style={{position: 'absolute', left: X0, top: TOP - 22, width: 2, height: PASSO * n + 10, background: '#D5DAE1'}} />
        {/* ano gigante */}
        <div style={{position: 'absolute', right: 70, top: 1065, fontWeight: 800, fontSize: 250, letterSpacing: -6, color: '#DADFE6', fontVariantNumeric: 'tabular-nums', lineHeight: 1, display: 'flex', overflow: 'hidden', height: 250}}>
          {Array.from(sAno).map((d, i) => {
            const muda = d !== sAnt[i] && tAno < 40;
            return (
              <span key={i} style={{position: 'relative', display: 'inline-block'}}>
                <span style={{visibility: 'hidden'}}>{d}</span>
                {muda ? (
                  <>
                    <span style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${-Math.min(1, kAno) * 250}px)`}}>{sAnt[i]}</span>
                    <span style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${(1 - kAno) * 250}px)`}}>{d}</span>
                  </>
                ) : (
                  <span style={{position: 'absolute', left: 0, top: 0}}>{d}</span>
                )}
              </span>
            );
          })}
        </div>
        {/* legenda */}
        <div style={{position: 'absolute', left: 88, top: 1215, width: 420, height: 90, overflow: 'hidden', fontWeight: 700, fontSize: 36, lineHeight: 1.18, color: '#111418'}}>
          {legAnt && kLeg < 1 && (
            <div style={{position: 'absolute', transform: `translateY(${-Math.min(1, kLeg) * 100}px)`}}>{legAnt.l[0]}<br />{legAnt.l[1]}</div>
          )}
          <div style={{position: 'absolute', transform: `translateY(${(1 - kLeg) * 100}px)`}}>{legAtual.l[0]}<br />{legAtual.l[1]}</div>
        </div>
        {/* barras */}
        {categorias.map((nome, c) => {
          const v = valorEm(frame, c);
          const y = TOP + posY(c) * PASSO;
          const h = c === heroi;
          let ci = 0;
          const cor = h ? laranja : MUTED[(ci = c > heroi ? c - 1 : c) % 5];
          void ci;
          const passou = trocas.filter((t) => t.c === c && frame - t.f < 12);
          const subindo = passou.some((t) => t.para < t.de);
          const descendo = passou.some((t) => t.para > t.de);
          return (
            <div key={nome} style={{position: 'absolute', left: 0, top: y, width: W, height: BH, zIndex: subindo ? 10 : 1, opacity: descendo ? 0.55 : 1}}>
              <div style={{position: 'absolute', left: 88, top: 0, height: BH, display: 'flex', alignItems: 'center', fontWeight: h ? 800 : 600, fontSize: 32, color: h ? '#0B0D10' : '#2E3440'}}>{nome}</div>
              <div style={{position: 'absolute', left: X0, top: 0, height: BH, width: v * PX, background: cor, borderRadius: '0 20px 20px 0', transform: h ? `scaleY(${incha})` : undefined, boxShadow: subindo ? '0 10px 24px rgba(17,20,24,0.18)' : 'none'}}>
                {h && kChip > 0 && (
                  <div style={{position: 'absolute', left: 18, top: BH / 2 - 22, height: 44, padding: '0 16px', borderRadius: 22, background: '#fff', color: laranja, fontWeight: 800, fontSize: 24, display: 'flex', alignItems: 'center', transform: `scale(${kChip})`}}>{chip1}</div>
                )}
              </div>
              <div style={{position: 'absolute', left: X0 + v * PX + 16, top: 0, height: BH, display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 38, fontVariantNumeric: 'tabular-nums', color: h ? laranja : '#2E3440'}}>{Math.round(v)}%</div>
            </div>
          );
        })}
      </div>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0, opacity: 0.03, mixBlendMode: 'multiply', pointerEvents: 'none'}}>
        <filter id="g25"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="17" /></filter>
        <rect width="100%" height="100%" filter="url(#g25)" />
      </svg>
    </AbsoluteFill>
  );
};
