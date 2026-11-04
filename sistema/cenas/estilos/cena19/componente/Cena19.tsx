// cena19 — Timeline (Linha do tempo). Chão em perspectiva com câmera própria (projeção feita à mão).
// Palco base 1080x1350, recomposto em qualquer formato.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont as loadSchibsted} from '@remotion/google-fonts/SchibstedGrotesk';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

const {fontFamily: SG} = loadSchibsted('normal', {weights: ['500', '700', '800'], subsets: ['latin']});
const {fontFamily: MONO} = loadMono('normal', {weights: ['600'], subsets: ['latin']});

export type Marco = {ano: number; titulo: string; linha: string; icone?: 'luminaria' | 'caixa' | 'arco' | 'mesa'};

export type Cena19Props = {
  width?: number;
  height?: number;
  kicker?: string;
  titulo?: string;
  tituloAzul?: string;
  anoInicial?: number;
  anoFinal?: number; // último ano desenhado no chão
  pontos?: Marco[];
  seloAgora?: string;
  azul?: string;
};

const INK = '#0E1116', GRIS = '#6A717C', CLARO = '#B7BEC8';

const Icone: React.FC<{tipo?: Marco['icone']; cor: string}> = ({tipo = 'luminaria', cor}) => (
  <svg viewBox="0 0 40 40" width="100%" height="100%">
    {tipo === 'luminaria' && <g fill="none" stroke={cor} strokeWidth={2.2} strokeLinecap="round"><path d="M10 34h16M18 34V22l8-9" /><path d="M23 9l8 4-4 6z" fill={cor} /></g>}
    {tipo === 'caixa' && <g fill="none" stroke={cor} strokeWidth={2.2} strokeLinejoin="round"><path d="M8 14l12-6 12 6v13l-12 6-12-6z" /><path d="M8 14l12 6 12-6M20 20v13" /></g>}
    {tipo === 'arco' && <g fill="none" stroke={cor} strokeWidth={2.4} strokeLinecap="round"><path d="M12 34V16a8 8 0 0 1 16 0" /><path d="M24 18h8l-2 5h-4z" fill={cor} /><path d="M8 34h10" /></g>}
    {tipo === 'mesa' && <g fill={cor}><rect x="6" y="12" width="5" height="18" rx="1" /><rect x="13" y="12" width="5" height="18" rx="1" /><rect x="20" y="12" width="5" height="18" rx="1" /><rect x="27" y="12" width="5" height="18" rx="1" /><rect x="5" y="30" width="28" height="3" /></g>}
  </svg>
);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Cena19: React.FC<Cena19Props> = ({
  width = 1080,
  height = 1350,
  kicker = 'ATELIÊ NORTE · 2016 ATÉ HOJE',
  titulo = 'De uma garagem a ',
  tituloAzul = '31 países',
  anoInicial = 2016,
  anoFinal = 2025,
  pontos = [
    {ano: 2016, titulo: 'Uma luminária na garagem', linha: 'Protótipo feito com sobras de carvalho.', icone: 'luminaria'},
    {ano: 2018, titulo: 'Primeiros 500 pedidos', linha: 'Pré-venda esgotada em nove dias.', icone: 'caixa'},
    {ano: 2021, titulo: 'A luminária Arco vai ao mundo', linha: 'Agora com envio para 31 países.', icone: 'arco'},
    {ano: 2024, titulo: 'Abre o estúdio novo', linha: '48 pessoas, uma mesa longa.', icone: 'mesa'},
  ],
  seloAgora = 'HOJE',
  azul = '#2442F5',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = Math.min(width / 1080, height / 1350);
  const W = 1080, H = 1350;
  const D = 110; // unidades de mundo por ano
  const Z = (ano: number) => (ano - anoInicial) * D;
  const anoAgora = pontos[pontos.length - 1].ano;

  // agulha (playhead): já anda no quadro 0, acelera no meio, freia no "hoje"
  const fimAgulha = 90;
  const ph = interpolate(frame, [0, 15, 30, 45, 60, 75, fimAgulha], [anoInicial + 0.15, anoInicial + 1.05, anoInicial + 2.5, anoInicial + 4.3, anoInicial + 6.1, anoAgora - 0.35, anoAgora], {extrapolateRight: 'clamp'});

  // câmera: começa baixa e perto do começo, sobe, recua e endireita; pousa ~1 s depois da agulha
  const c = interpolate(frame, [0, 120], [0, 1], {extrapolateRight: 'clamp', easing: Easing.bezier(0.45, 0, 0.2, 1)});
  // parâmetros ajustados aos pontos medidos na referência (começo e pouso)
  const cam = {
    tz: lerp(-45, 513, c),
    tx: 0,
    dist: lerp(897, 1197, c),
    pitch: lerp(41.6, 56.6, c) * (Math.PI / 180),
    yaw: lerp(-2.5, -17.5, c) * (Math.PI / 180),
    ox: lerp(551, 360, c),
    oy: lerp(638, 812, c),
    f: 1250,
  };
  const C = [cam.tx + cam.dist * Math.cos(cam.pitch) * Math.sin(cam.yaw), cam.dist * Math.sin(cam.pitch), cam.tz + cam.dist * Math.cos(cam.pitch) * Math.cos(cam.yaw)];
  const T = [cam.tx, 0, cam.tz];
  const sub = (a: number[], b: number[]) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const norm = (a: number[]) => {const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l];};
  const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const fw = norm(sub(T, C));
  const rt = norm(cross(fw, [0, 1, 0]));
  const up = cross(rt, fw);
  const P = (x: number, y: number, z: number) => {
    const d = sub([x, y, z], C);
    const zc = dot(d, fw);
    const zz = Math.max(zc, 1);
    return {x: cam.ox + (cam.f * dot(d, rt)) / zz, y: cam.oy - (cam.f * dot(d, up)) / zz, s: cam.f / zz, z: zc};
  };
  // matriz afim local para "pintar" algo no chão (eixo x do texto = +X do mundo, eixo y = +Z)
  const chao = (x: number, z: number) => {
    const o = P(x, 0, z), a = P(x + 1, 0, z), b = P(x, 0, z + 1);
    return `matrix(${a.x - o.x},${a.y - o.y},${b.x - o.x},${b.y - o.y},${o.x},${o.y})`;
  };

  const PERTO = 60;
  const zcam = (x: number, z: number) => dot(sub([x, 0, z], C), fw);
  // segmento no chão recortado no plano de perto da câmera (nada atrás da lente)
  const seg = (x0: number, z0: number, x1: number, z1: number) => {
    const a = zcam(x0, z0), b = zcam(x1, z1);
    if (a < PERTO && b < PERTO) return null;
    if (a < PERTO) {const t = (PERTO - a) / (b - a); x0 = lerp(x0, x1, t); z0 = lerp(z0, z1, t);}
    if (b < PERTO) {const t = (PERTO - b) / (a - b); x1 = lerp(x1, x0, t); z1 = lerp(z1, z0, t);}
    return [P(x0, 0, z0), P(x1, 0, z1)];
  };
  const zFim = Z(anoFinal + 0.6);
  const quad = (z0: number, z1: number, w: number) => {
    let d = '';
    const passo = D / 4;
    for (let a = z0; a < z1; a += passo) {
      const b = Math.min(z1, a + passo + 1);
      if (zcam(0, a) < PERTO || zcam(0, b) < PERTO) continue;
      const p1 = P(-w, 0, a), p2 = P(w, 0, a), p3 = P(w, 0, b), p4 = P(-w, 0, b);
      d += `M${p1.x},${p1.y} L${p2.x},${p2.y} L${p3.x},${p3.y} L${p4.x},${p4.y} Z `;
    }
    return d;
  };
  const anos = [] as number[];
  for (let a = anoInicial; a <= anoFinal; a++) anos.push(a);
  const chave = new Set(pontos.map((m) => m.ano));

  // grade do chão
  const linhasGrade: React.ReactNode[] = [];
  for (let gx = -1400; gx <= 1800; gx += 220) {
    const r = seg(gx, -1500, gx, zFim + 900);
    if (r) linhasGrade.push(<line key={'x' + gx} x1={r[0].x} y1={r[0].y} x2={r[1].x} y2={r[1].y} />);
  }
  for (let gz = -1500; gz <= zFim + 900; gz += 220) {
    const r = seg(-1400, gz, 1800, gz);
    if (r) linhasGrade.push(<line key={'z' + gz} x1={r[0].x} y1={r[0].y} x2={r[1].x} y2={r[1].y} />);
  }

  const agulha = P(0, 0, Z(ph) + 0.001);
  const passou = (ano: number) => frame >= 0 && ph >= ano - 0.02;
  const quadroDoAno = (ano: number) => {
    for (let q = 0; q <= fimAgulha; q++) {
      const v = interpolate(q, [0, 15, 30, 45, 60, 75, fimAgulha], [anoInicial + 0.15, anoInicial + 1.05, anoInicial + 2.5, anoInicial + 4.3, anoInicial + 6.1, anoAgora - 0.35, anoAgora]);
      if (v >= ano - 0.02) return q;
    }
    return fimAgulha;
  };

  return (
    <AbsoluteFill style={{background: 'linear-gradient(#F5F6F8, #E3E6EB)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: (width - W * k) / 2, top: (height - H * k) / 2, width: W, height: H, transform: `scale(${k})`, transformOrigin: '0 0', fontFamily: SG}}>
        <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <defs>
            <linearGradient id="as19haze" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F5F6F8" stopOpacity={1} />
              <stop offset="0.35" stopColor="#F5F6F8" stopOpacity={0.6} />
              <stop offset="0.6" stopColor="#F5F6F8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <g stroke="#C9CED6" strokeWidth={1.2} opacity={0.55}>{linhasGrade}</g>
          <rect x={-600} y={-600} width={W + 1200} height={H * 0.9 + 600} fill="url(#as19haze)" />
          {/* trilho cinza (o que ainda vem) e o preenchimento azul */}
          <path d={quad(Z(anoInicial - 0.3), zFim, 5)} fill={CLARO} />
          <path d={quad(Z(anoInicial - 0.3), Z(ph), 7)} fill={azul} />
          {anos.map((a) => {
            const lado = 26;
            const p0 = P(-lado, 0, Z(a)), p1 = P(lado, 0, Z(a));
            if (p0.z < PERTO) return null;
            return <line key={a} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke={passou(a) ? azul : CLARO} strokeWidth={Math.max(1.5, 5 * p0.s)} />;
          })}
          {anos.map((a) => {
            const m = P(0, 0, Z(a + 0.5));
            if (m.z < PERTO) return null;
            const m0 = P(-12, 0, Z(a + 0.5)), m1 = P(12, 0, Z(a + 0.5));
            return <line key={'m' + a} x1={m0.x} y1={m0.y} x2={m1.x} y2={m1.y} stroke={passou(a + 0.5) ? azul : CLARO} strokeWidth={Math.max(1, 3 * m.s)} opacity={a < anoFinal ? 1 : 0} />;
          })}
          {/* agulha com anel */}
          <ellipse cx={agulha.x} cy={agulha.y} rx={34 * agulha.s} ry={34 * agulha.s * 0.55} fill={azul} fillOpacity={0.12} stroke={azul} strokeOpacity={0.35} strokeWidth={1.5} />
          <circle cx={agulha.x} cy={agulha.y} r={Math.max(7, 13 * agulha.s)} fill={azul} />
          {(() => {
            const q = quadroDoAno(anoAgora);
            const t = interpolate(frame, [q + 6, q + 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
            if (t <= 0 || t >= 1) return null;
            return <ellipse cx={agulha.x} cy={agulha.y} rx={(30 + 110 * t) * agulha.s} ry={(30 + 110 * t) * agulha.s * 0.55} fill="none" stroke={azul} strokeWidth={2.5} opacity={1 - t} />;
          })()}
        </svg>
        {/* anos pintados no chão */}
        {anos.map((a) => {
          const grande = chave.has(a);
          const cor = !passou(a) ? CLARO : grande ? INK : GRIS;
          if (P(0, 0, Z(a)).z < PERTO * 3) return null;
          return (
            <div key={a} style={{position: 'absolute', left: 0, top: 0, transform: chao(-46, Z(a)), transformOrigin: '0 0'}}>
              <div style={{position: 'absolute', right: 0, top: grande ? -48 : -28, fontWeight: 800, fontSize: grande ? 64 : 38, letterSpacing: -2, color: cor, whiteSpace: 'nowrap', lineHeight: 1}}>{a}</div>
            </div>
          );
        })}
        {/* pontos: ponto, haste e cartão que abre como livro pop-up */}
        {pontos.map((m, i) => {
          const agora = i === pontos.length - 1;
          const q0 = quadroDoAno(m.ano) + (agora ? 4 : 0);
          const base = P(0, 0, Z(m.ano));
          const hastesFinal = [90, 48, 45, 126];
          const hastePx = (i === 0 ? lerp(200, 90, c) : hastesFinal[Math.min(i, 3)]) * (agora ? 1 : 1);
          const topo = {x: base.x, y: base.y - hastePx};
          const pt = spring({frame: frame - q0, fps, config: {damping: 14, stiffness: 260, mass: 0.5}});
          const haste = interpolate(frame - q0, [2, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
          const abre = spring({frame: frame - q0 - 6, fps, config: agora ? {damping: 11, stiffness: 120, mass: 1.1} : {damping: 10, stiffness: 170, mass: 0.6}});
          const sel = spring({frame: frame - q0 - 14, fps, config: {damping: 12, stiffness: 260, mass: 0.5}});
          const esc = agora ? 1.12 : 1;
          const hx = lerp(base.x, topo.x, haste), hy = lerp(base.y, topo.y, haste);
          return (
            <React.Fragment key={m.ano}>
              <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}}>
                {haste > 0 && <line x1={base.x} y1={base.y} x2={hx} y2={hy} stroke={agora ? azul : INK} strokeWidth={2} />}
                <circle cx={base.x} cy={base.y} r={7 * pt * Math.max(0.6, base.s)} fill="#fff" stroke={azul} strokeWidth={3} />
              </svg>
              {haste >= 1 && (
                <div style={{position: 'absolute', left: topo.x - 22 + (agora ? -24 : 0), top: topo.y, transform: `scale(${esc})`, transformOrigin: '0 0', perspective: 800}}>
                  <div style={{position: 'absolute', left: 0, bottom: 0, width: 470, transform: `rotateX(${(1 - abre) * 88}deg)`, transformOrigin: 'bottom left', display: 'flex', gap: 18, padding: '18px 22px', borderRadius: 10, background: agora ? azul : '#fff', boxShadow: '0 2px 4px rgba(14,17,22,0.08), 0 14px 30px rgba(14,17,22,0.12)', color: agora ? '#fff' : INK}}>
                    <div style={{width: 92, height: 92, flexShrink: 0, borderRadius: 6, background: agora ? 'rgba(255,255,255,0.16)' : '#EEF0F3', padding: 12, boxSizing: 'border-box'}}>
                      <Icone tipo={m.icone} cor={agora ? '#fff' : '#3A3F47'} />
                    </div>
                    <div style={{minWidth: 0}}>
                      <div style={{fontFamily: MONO, fontWeight: 600, fontSize: 20, letterSpacing: 1, color: agora ? '#C9D0FF' : azul}}>{m.ano}</div>
                      <div style={{fontWeight: 700, fontSize: 34, lineHeight: 1.05, letterSpacing: -0.5, marginTop: 2}}>{m.titulo}</div>
                      <div style={{fontWeight: 500, fontSize: 23, lineHeight: 1.2, marginTop: 6, color: agora ? '#DCE1FF' : GRIS}}>{m.linha}</div>
                    </div>
                    {agora && (
                      <div style={{position: 'absolute', right: -14, top: -14, transform: `scale(${sel})`, background: INK, color: '#fff', fontFamily: MONO, fontWeight: 600, fontSize: 15, letterSpacing: 1.5, padding: '5px 10px', borderRadius: 20}}>● {seloAgora}</div>
                    )}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
        {/* bloco de título */}
        <div style={{position: 'absolute', left: 92, top: 50, right: 60}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: MONO, fontWeight: 600, fontSize: 22, letterSpacing: 2.5, color: INK}}>
            <span style={{width: 24, height: 24, borderRadius: 5, background: INK, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}><span style={{width: 10, height: 10, borderRadius: 2, background: '#F5F6F8'}} /></span>
            {kicker}
          </div>
          <div style={{marginTop: 14, fontWeight: 800, fontSize: 68, letterSpacing: -2.5, color: INK, lineHeight: 1.05}}>
            {titulo}<span style={{color: azul}}>{tituloAzul}</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
