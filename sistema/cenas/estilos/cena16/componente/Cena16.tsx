// cena16 — Stat Chart (Número com gráfico). Palco base 1080x1350, recomposto em qualquer formato.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont as loadTight} from '@remotion/google-fonts/InterTight';
import {loadFont as loadMono} from '@remotion/google-fonts/IBMPlexMono';

const {fontFamily: TIGHT} = loadTight('normal', {weights: ['500', '600', '800'], subsets: ['latin']});
const {fontFamily: MONO} = loadMono('normal', {weights: ['400', '500', '600'], subsets: ['latin']});

export type Cena16Props = {
  width?: number;
  height?: number;
  empresa?: string;
  letraMiuda?: string; // linha de cima à direita
  rotulo?: string; // rótulo acima do número
  prefixo?: string; // "R$"
  unidade?: string; // "bi"
  casas?: number;
  serie?: number[]; // um valor por mês, do primeiro mês do eixo
  anoInicial?: number;
  mesesEixo?: number; // total de meses do eixo (inclui os não informados)
  indiceEvento?: number;
  eventoData?: string;
  eventoTitulo?: string;
  eventoLinha?: string;
  delta?: string;
  deltaTexto?: string;
  fonte?: string;
  periodo?: string;
  meses?: string[];
  acento?: string;
  /** quadro em que a linha chega ao fim (a 30 fps) */
  fimLinha?: number;
};

const MESES_PT = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

const serieDemo = (() => {
  const v: number[] = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 81; i++) {
    let x: number;
    if (i <= 50) x = 0.3 + (i / 50) ** 1.35 * 0.7;
    else x = 1.0 + (1 - Math.exp(-(i - 50) / 13)) * 3.6;
    x += (rnd() - 0.5) * (i > 50 ? 0.32 : 0.04);
    v.push(Math.max(0.25, x));
  }
  v[80] = 4.2;
  return v;
})();

export const Cena16: React.FC<Cena16Props> = ({
  width = 1080,
  height = 1350,
  empresa = 'VERANA PAY',
  letraMiuda = 'VOLUME · MENSAL · ANUALIZADO · R$',
  rotulo = 'Volume anual de pagamentos',
  prefixo = 'R$',
  unidade = 'bi',
  casas = 1,
  serie = serieDemo,
  anoInicial = 2019,
  mesesEixo = 84,
  indiceEvento = 50,
  eventoData = 'MAR 2023',
  eventoTitulo = 'Cartão Verana chega',
  eventoLinha = 'O volume dobra em cinco meses',
  delta = '321%',
  deltaTexto = 'desde o lançamento do cartão',
  fonte = 'FONTE: DADOS ILUSTRATIVOS',
  periodo = 'JAN 2019 A SET 2025',
  meses = MESES_PT,
  acento = '#FF5B1F',
  fimLinha = 102,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = Math.min(width / 1080, height / 1350);
  const n = serie.length;
  const ev = indiceEvento;

  // posição da ponta (índice fracionário do mês): já se move no quadro 0, freia no evento, acelera a subida, assenta no fim
  const f = (fimLinha / 102);
  const tip = interpolate(
    frame,
    [0, 15, 30, 40, 46, 60, 75, 90, fimLinha].map((x, i) => (i === 0 || i === 8 ? x : x * f)),
    [3, 26, 45, ev, ev + 4, ev + 14, n - 6, n - 2, n - 1],
    {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)},
  );
  const valAt = (x: number) => {
    const i = Math.floor(x);
    const fr = x - i;
    const a = serie[Math.min(i, n - 1)];
    const b = serie[Math.min(i + 1, n - 1)];
    return a + (b - a) * fr;
  };
  const valor = valAt(tip);
  const final = serie[n - 1];
  const contouFim = tip >= n - 1.001;
  const mostrado = contouFim ? final : valor;
  const textoValor = mostrado.toFixed(casas).replace('.', ',');

  // geometria do gráfico (no palco)
  const X0 = 95, X1 = 975, Y0 = 680, Y1 = 1140;
  const maxV = 5;
  const yOf = (v: number) => Y1 - Math.sqrt(v / maxV) * (Y1 - Y0);
  const xOf = (i: number) => X0 + (i / (mesesEixo - 1)) * (X1 - X0);

  const pts: [number, number][] = [];
  for (let i = 0; i <= Math.floor(tip); i++) pts.push([xOf(i), yOf(serie[i])]);
  pts.push([xOf(tip), yOf(valor)]);
  const antes = pts.filter((_, i) => i <= ev || tip <= ev);
  const passouEvento = tip > ev;
  const depois = passouEvento ? pts.filter((p) => p[0] >= xOf(ev) - 0.01) : [];
  const toPath = (p: [number, number][]) => p.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' ');
  const area = `${toPath(pts)} L${pts[pts.length - 1][0]},${Y1} L${X0},${Y1} Z`;
  const tipX = xOf(tip), tipY = yOf(valor);

  // quadros dos eventos
  const fEv = (() => {
    for (let q = 0; q < 200; q++) {
      const t = interpolate(q, [0, 15, 30, 40].map((x, i) => (i === 0 ? 0 : x * f)), [3, 26, 45, ev], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
      if (t >= ev) return q;
    }
    return 56;
  })();
  const fFim = Math.round(fimLinha);
  const sp = (from: number, cfg = {damping: 12, stiffness: 180, mass: 0.6}) => spring({frame: frame - from, fps, config: cfg});
  const inchaPonto = passouEvento ? 1 + 0.6 * Math.max(0, 1 - (frame - fEv) / 8) : 1;
  const anel = sp(fEv);
  const lider = interpolate(frame, [fEv + 2, fEv + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const callY = 790;
  const linhaCall = (i: number) => {
    const s = sp(fEv + 8 + i * 3, {damping: 16, stiffness: 260, mass: 0.5});
    return {transform: `translateY(${(1 - s) * 26}px)`, clipPath: 'inset(0 0 0 0)', opacity: s > 0.02 ? 1 : 0};
  };
  const chip = sp(fFim + 2, {damping: 10, stiffness: 220, mass: 0.6});
  const ping = interpolate(frame, [fFim, fFim + 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tag = interpolate(frame, [fFim + 2, fFim + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

  const mesIdx = Math.min(n - 1, Math.round(tip));
  const dataViva = `${meses[mesIdx % 12]} ${anoInicial + Math.floor(mesIdx / 12)}`;
  const anos = Array.from({length: Math.ceil(mesesEixo / 12)}, (_, i) => anoInicial + i);

  const BRANCO = '#F4F5F6', CINZA = '#8B9098', ESCURO = '#4A4F57';
  return (
    <AbsoluteFill style={{background: '#0A0B0D', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: (width - 1080 * k) / 2, top: (height - 1350 * k) / 2, width: 1080, height: 1350, transform: `scale(${k})`, transformOrigin: '0 0', fontFamily: TIGHT, color: BRANCO}}>
        {/* cabeçalho */}
        <div style={{position: 'absolute', left: 95, right: 105, top: 112, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, letterSpacing: 2}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, fontWeight: 600, fontSize: 22, color: BRANCO}}>
            <svg width="24" height="18"><rect y="0" width="24" height="5" fill={BRANCO} /><rect y="7" width="17" height="5" fill={acento} /><rect y="14" width="10" height="4" fill={BRANCO} /></svg>
            {empresa}
          </div>
          <div style={{fontSize: 16, color: CINZA}}>{letraMiuda}</div>
        </div>
        <div style={{position: 'absolute', left: 95, right: 95, top: 160, height: 1, background: 'rgba(255,255,255,0.08)'}} />
        <div style={{position: 'absolute', left: 95, top: 215, fontSize: 32, fontWeight: 500, color: '#C9CDD2'}}>{rotulo}</div>
        {/* número herói */}
        <div style={{position: 'absolute', left: 88, top: 250, display: 'flex', alignItems: 'flex-start', fontWeight: 800, letterSpacing: -10, fontVariantNumeric: 'tabular-nums', lineHeight: 1}}>
          <span style={{fontSize: 110, marginTop: 32, letterSpacing: -2, marginRight: 14}}>{prefixo}</span>
          <span style={{fontSize: 300}}>{textoValor}</span>
          <span style={{fontSize: 150, alignSelf: 'flex-end', marginBottom: 18, marginLeft: 22, letterSpacing: -4}}>{unidade}</span>
        </div>
        {/* chip delta + data viva */}
        <div style={{position: 'absolute', left: 95, top: 580, display: 'flex', alignItems: 'center', gap: 22, transform: `scale(${chip})`, transformOrigin: 'left center', opacity: chip > 0.01 ? 1 : 0}}>
          <div style={{background: acento, color: '#0A0B0D', fontFamily: MONO, fontWeight: 600, fontSize: 24, padding: '6px 14px', borderRadius: 4}}>▲ {delta}</div>
          <div style={{fontSize: 26, color: '#C9CDD2', fontWeight: 500}}>{deltaTexto}</div>
        </div>
        <div style={{position: 'absolute', right: 105, top: 584, fontFamily: MONO, fontSize: 22, letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 12, color: BRANCO}}>
          <span style={{width: 10, height: 10, borderRadius: 5, background: acento}} />
          {dataViva}
        </div>
        {/* gráfico */}
        <svg width={1080} height={1350} style={{position: 'absolute', left: 0, top: 0}}>
          <defs>
            <linearGradient id="as16fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity={0.16} />
              <stop offset="1" stopColor="#fff" stopOpacity={0} />
            </linearGradient>
            <pattern id="as16hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
            </pattern>
          </defs>
          {[1, 2, 3, 5].map((v) => (
            <g key={v}>
              <line x1={X0} x2={X1} y1={yOf(v)} y2={yOf(v)} stroke="rgba(255,255,255,0.07)" />
              <text x={X1 + 18} y={yOf(v) + 6} fill={CINZA} fontFamily={MONO} fontSize={17}>{v}{unidade === 'bi' ? 'B' : ''}</text>
            </g>
          ))}
          {anos.map((a, i) => (
            <g key={a}>
              <line x1={xOf(i * 12)} x2={xOf(i * 12)} y1={Y0 - 20} y2={Y1} stroke="rgba(255,255,255,0.07)" />
              <text x={xOf(i * 12) + 4} y={Y1 + 34} fill={CINZA} fontFamily={MONO} fontSize={18}>{a}</text>
            </g>
          ))}
          <rect x={xOf(n - 1)} y={Y0 - 20} width={X1 - xOf(n - 1)} height={Y1 - Y0 + 20} fill="url(#as16hatch)" />
          <line x1={X0} x2={X1} y1={Y1} y2={Y1} stroke="rgba(255,255,255,0.18)" />
          <path d={area} fill="url(#as16fill)" />
          {/* cursor tracejado */}
          {!contouFim && <line x1={tipX} x2={tipX} y1={Y0 - 20} y2={Y1} stroke="rgba(255,255,255,0.18)" strokeDasharray="4 6" />}
          <path d={toPath(antes)} stroke="#E9EBEE" strokeWidth={3.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          {passouEvento && <path d={toPath(depois)} stroke={acento} strokeWidth={6} fill="none" strokeLinejoin="round" strokeLinecap="round" />}
          {/* marcador do evento + linha líder */}
          {passouEvento && (
            <>
              <line x1={xOf(ev)} x2={xOf(ev)} y1={yOf(serie[ev]) - 14} y2={yOf(serie[ev]) - 14 - lider * (yOf(serie[ev]) - 14 - callY - 70)} stroke="rgba(255,255,255,0.55)" strokeWidth={1.5} />
              <circle cx={xOf(ev)} cy={yOf(serie[ev])} r={11 * anel} fill="#0A0B0D" stroke="#F4F5F6" strokeWidth={3} />
            </>
          )}
          {/* ponta */}
          <circle cx={tipX} cy={tipY} r={8 * inchaPonto} fill={passouEvento ? acento : '#F4F5F6'} />
          {contouFim && ping < 1 && <circle cx={tipX} cy={tipY} r={8 + ping * 34} fill="none" stroke={acento} strokeWidth={3 * (1 - ping)} opacity={1 - ping} />}
        </svg>
        {/* etiqueta de valor saindo do eixo */}
        <div style={{position: 'absolute', left: X1 + 10, top: tipY - 17, clipPath: `inset(0 ${(1 - tag) * 100}% 0 0)`, background: acento, color: '#0A0B0D', fontFamily: MONO, fontWeight: 600, fontSize: 20, padding: '3px 8px', borderRadius: 3, visibility: contouFim ? 'visible' : 'hidden'}}>
          {final.toFixed(2).replace('.', ',')}
        </div>
        {/* chamada do evento */}
        {passouEvento && (
          <div style={{position: 'absolute', right: 1080 - xOf(ev) + 14, top: callY, textAlign: 'right'}}>
            <div style={{overflow: 'hidden'}}><div style={{...linhaCall(0), fontFamily: MONO, color: acento, fontSize: 20, fontWeight: 600, letterSpacing: 2}}>{eventoData}</div></div>
            <div style={{overflow: 'hidden'}}><div style={{...linhaCall(1), fontSize: 34, fontWeight: 600, color: BRANCO}}>{eventoTitulo}</div></div>
            <div style={{overflow: 'hidden'}}><div style={{...linhaCall(2), fontSize: 24, fontWeight: 500, color: CINZA}}>{eventoLinha}</div></div>
          </div>
        )}
        {/* rodapé */}
        <div style={{position: 'absolute', left: 95, right: 105, top: 1210, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 16, letterSpacing: 2, color: ESCURO}}>
          <span>{fonte}</span>
          <span>{periodo}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
