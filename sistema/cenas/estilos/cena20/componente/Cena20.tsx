// cena20 — Globe arcs (Globo com arcos). 3D edição: globo de pontos desenhado em canvas,
// projeção ortográfica com rotação, arcos laranja em grande círculo, contador que sobe a cada pouso.
import React, {useEffect, useRef} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadInterTight} from '@remotion/google-fonts/InterTight';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

const {fontFamily: INTER} = loadInterTight('normal', {weights: ['500', '600'], subsets: ['latin', 'latin-ext']});
const {fontFamily: MONO} = loadMono('normal', {weights: ['500'], subsets: ['latin']});

export type Destino = {nome?: string; lon: number; lat: number};
export type Cena20Props = {
  rotulo: string; // rótulo mono em caixa alta
  unidade: string; // "países"
  valores: number[]; // um valor por pouso (o último é o número final)
  valorInicial: number;
  origem: {nome: string; lon: number; lat: number};
  destinos: Destino[]; // mesma quantidade de valores; só 2 com nome
  lonInicio?: number; // centro do globo no começo
  lonFim?: number; // centro no fim (~40° a leste)
  latCentro?: number;
  laranja?: string;
  width?: number;
  height?: number;
};

// Contornos simplificados à mão (lon, lat). Não é mapa baixado: é desenho grosseiro em código.
const LAND: [number, number][][] = [
  // África
  [[-17,21],[-16,28],[-10,30],[-6,36],[10,37],[11,33],[20,31],[32,31],[34,28],[39,16],[43,12],[51,12],[51,10],[44,2],[40,-3],[40,-15],[35,-24],[32,-29],[27,-34],[20,-35],[18,-30],[12,-17],[13,-6],[9,-1],[9,4],[5,6],[-4,5],[-8,4],[-13,8],[-17,14]],
  // Europa
  [[-10,36],[-9,43],[-2,44],[-5,48],[2,51],[8,54],[9,57],[11,58],[5,59],[6,62],[15,69],[28,71],[40,67],[60,68],[60,45],[50,45],[42,41],[36,41],[29,41],[26,40],[22,37],[19,41],[13,45],[17,40],[16,38],[12,38],[11,43],[8,44],[3,43],[0,39],[-6,36]],
  // Escandinávia / Báltico (preenche)
  [[12,56],[18,60],[22,65],[25,66],[28,70],[16,69],[10,63],[5,61],[8,58]],
  // Ilhas Britânicas
  [[-6,50],[1,51],[2,53],[-1,55],[-2,58],[-5,59],[-6,56],[-5,54],[-10,52]],
  // Ásia (com Arábia e Índia)
  [[26,40],[36,36],[35,32],[37,27],[43,13],[45,13],[53,17],[57,22],[60,25],[67,24],[72,21],[77,8],[80,15],[88,22],[92,22],[98,16],[100,8],[104,1],[103,10],[109,12],[106,21],[110,21],[121,30],[122,40],[127,39],[130,43],[140,50],[143,60],[160,62],[180,66],[180,72],[110,77],[70,73],[60,68],[60,45],[50,45],[48,38],[42,41]],
  // Madagascar
  [[44,-25],[47,-25],[50,-15],[49,-12],[44,-17]],
  // Sumatra, Bornéu, Java
  [[95,5],[106,-6],[104,-6],[95,3]],
  [[109,1],[118,7],[119,-1],[116,-4],[110,-3]],
  [[106,-6],[114,-8],[106,-7.5]],
  // Japão
  [[130,31],[135,34],[141,36],[142,43],[140,41],[136,36],[131,34]],
  // Austrália
  [[114,-22],[122,-18],[130,-12],[136,-12],[142,-11],[146,-19],[153,-27],[150,-37],[140,-38],[131,-31],[115,-34]],
  // América do Sul
  [[-35,-5],[-50,0],[-60,8],[-75,10],[-80,0],[-70,-18],[-72,-50],[-65,-55],[-58,-38],[-48,-26],[-40,-22],[-35,-8]],
  // Groenlândia
  [[-45,60],[-20,70],[-20,82],[-60,82],[-70,76],[-55,68]],
];

const dentro = (lon: number, lat: number, poly: [number, number][]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

// pontos de terra: grade com passo ~0,9°, deslocada linha a linha, força variando
const PONTOS: {v: [number, number, number]; a: number}[] = (() => {
  const out: {v: [number, number, number]; a: number}[] = [];
  const passo = 0.9;
  for (let lat = -60; lat <= 80; lat += passo) {
    const dl = passo / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
    for (let lon = -180 + ((lat / passo) % 2) * dl * 0.5; lon < 180; lon += dl) {
      if (!LAND.some((p) => dentro(lon, lat, p))) continue;
      const r = Math.sin(lon * 12.9898 + lat * 78.233) * 43758.5453;
      out.push({v: vec(lon, lat), a: 0.55 + 0.45 * (r - Math.floor(r))});
    }
  }
  return out;
})();

function vec(lon: number, lat: number): [number, number, number] {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
}
// gira o mundo para que (lon0, lat0) fique de frente
const girar = (v: [number, number, number], lon0: number, lat0: number): [number, number, number] => {
  const a = (-lon0 * Math.PI) / 180;
  const x1 = v[0] * Math.cos(a) + v[2] * Math.sin(a);
  const z1 = -v[0] * Math.sin(a) + v[2] * Math.cos(a);
  const b = (lat0 * Math.PI) / 180;
  const y2 = v[1] * Math.cos(b) - z1 * Math.sin(b);
  const z2 = v[1] * Math.sin(b) + z1 * Math.cos(b);
  return [x1, y2, z2];
};
const slerp = (a: number[], b: number[], t: number) => {
  const d = Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  if (d < 1e-6) return a;
  const s1 = Math.sin((1 - t) * d) / Math.sin(d);
  const s2 = Math.sin(t * d) / Math.sin(d);
  return [a[0] * s1 + b[0] * s2, a[1] * s1 + b[1] * s2, a[2] * s1 + b[2] * s2];
};
const angulo = (a: number[], b: number[]) => Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));

const W = 1080;
const H = 1350;

export const Cena20: React.FC<Cena20Props> = ({
  rotulo, unidade, valores, valorInicial, origem, destinos,
  lonInicio = 8, lonFim = 46, latCentro = 22, laranja = '#FF8A3D', width = W, height = H,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const s = Math.min(width / W, height / H);

  // tempos: um lançamento a cada ~1/3 s; voo maior = mais longo; último pousa ~4 s
  const voos = destinos.map((d, i) => {
    const ang = angulo(vec(origem.lon, origem.lat), vec(d.lon, d.lat));
    const dur = Math.round(8 + ang * 11);
    const ini = 2 + i * Math.round(fps / 4.2);
    return {...d, ini, fim: ini + dur, ang};
  });
  const ultimo = voos.length - 1;
  // garante que o último (o mais longo) pousa por volta de 4 s
  voos[ultimo].fim = Math.max(voos[ultimo].fim, Math.round(fps * 2.4));

  const giro = interpolate(frame, [0, fps * 3], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const lon0 = lonInicio + (lonFim - lonInicio) * giro;
  const zoom = 1 + 0.06 * giro;
  const R = 400 * zoom;
  const cx = W / 2;
  const cy = 790;

  const proj = (v: number[], alt = 0): [number, number, number] => {
    const g = girar(v as [number, number, number], lon0, latCentro);
    return [cx + g[0] * R * (1 + alt), cy - g[1] * R * (1 + alt), g[2]];
  };

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    ctx.clearRect(0, 0, W, H);
    // oceano: esfera navy escura com borda fina azul fria
    const og = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
    og.addColorStop(0, '#0F1D36');
    og.addColorStop(1, '#08111F');
    ctx.fillStyle = og;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = 'rgba(110,150,220,0.55)';
    ctx.stroke();
    ctx.lineWidth = 7;
    ctx.strokeStyle = 'rgba(90,130,210,0.10)';
    ctx.beginPath();
    ctx.arc(cx, cy, R + 3, 0, Math.PI * 2);
    ctx.stroke();

    // pontos de terra: elipses achatadas na direção do raio conforme a curva, apagando na borda
    for (const p of PONTOS) {
      const g = girar(p.v, lon0, latCentro);
      if (g[2] <= 0.02) continue;
      const x = cx + g[0] * R;
      const y = cy - g[1] * R;
      const rr = Math.hypot(g[0], g[1]);
      const ang = Math.atan2(-g[1], g[0]);
      const r0 = 1.55 * zoom;
      ctx.fillStyle = `rgba(201,214,238,${(p.a * (0.25 + 0.75 * Math.pow(g[2], 0.7))).toFixed(3)})`;
      ctx.beginPath();
      ctx.ellipse(x, y, Math.max(0.35, r0 * g[2]), r0, rr < 1e-3 ? 0 : ang, 0, Math.PI * 2);
      ctx.fill();
    }

    // arcos
    const vo = vec(origem.lon, origem.lat);
    for (const v of voos) {
      if (frame < v.ini) continue;
      const k = interpolate(frame, [v.ini, v.fim], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
      const vd = vec(v.lon, v.lat);
      const n = 60;
      const pts: [number, number, number][] = [];
      for (let i = 0; i <= n; i++) {
        const t = (i / n) * k;
        const alt = Math.sin(Math.PI * t) * (0.08 + v.ang * 0.3);
        pts.push(proj(slerp(vo, vd, t), alt));
      }
      // trecho por trás do globo não é desenhado
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0, z0] = pts[i - 1];
        const [x1, y1] = pts[i];
        const fora = Math.hypot(x0 - cx, y0 - cy) > R;
        if (z0 < 0 && !fora) continue;
        const ponta = k < 1 ? i / pts.length : 0;
        ctx.strokeStyle = ponta > 0.85 ? '#FFC49A' : laranja;
        ctx.lineWidth = 3.4 * zoom;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
      // pouso: uma onda fina + pino branco com aro escuro
      if (frame >= v.fim) {
        const [px, py] = proj(vd);
        const tt = (frame - v.fim) / fps;
        if (tt < 0.6) {
          ctx.strokeStyle = `rgba(255,170,110,${(1 - tt / 0.6) * 0.9})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(px, py, 6 + tt * 55, 0, Math.PI * 2);
          ctx.stroke();
        }
        const sp = interpolate(frame - v.fim, [0, 4, 7, 10], [0, 1.35, 0.92, 1], {extrapolateRight: 'clamp'});
        ctx.fillStyle = '#0A1426';
        ctx.beginPath();
        ctx.arc(px, py, 7.5 * sp, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(px, py, 4.6 * sp, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // pino da origem
    const [ox, oy] = proj(vo);
    ctx.fillStyle = '#0A1426';
    ctx.beginPath();
    ctx.arc(ox, oy, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ox, oy, 4.6, 0, Math.PI * 2);
    ctx.fill();
  });

  // rótulos de cidade (origem + destinos com nome)
  const rotulos = [{nome: origem.nome, lon: origem.lon, lat: origem.lat, vis: true, dx: -14, alinhar: 'right' as const}]
    .concat(
      voos
        .filter((v) => v.nome)
        .map((v) => ({nome: v.nome!, lon: v.lon, lat: v.lat, vis: frame >= v.fim, dx: 0, alinhar: 'center' as const})),
    );

  // valor atual + troca (o antigo sobe e desfoca, o novo sobe e assenta)
  let idx = -1;
  voos.forEach((v, i) => {
    if (frame >= v.fim) idx = i;
  });
  const atual = idx < 0 ? valorInicial : valores[idx];
  const anterior = idx <= 0 ? valorInicial : valores[idx - 1];
  const tTroca = idx < 0 ? 99 : frame - voos[idx].fim;
  const kT = interpolate(tTroca, [0, 6], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const sa = String(anterior);
  const sn = String(atual);
  const len = Math.max(sa.length, sn.length);
  const digitos = Array.from({length: len}, (_, i) => {
    const a = sa.padStart(len, ' ')[i];
    const n = sn.padStart(len, ' ')[i];
    const muda = a !== n && idx >= 0 && tTroca < 6;
    return {a, n, muda};
  });

  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 65% at 50% 52%, #0E1830 0%, #091022 55%, #05070C 100%)'}}>
      <div style={{position: 'absolute', left: (width - W * s) / 2, top: (height - H * s) / 2, width: W, height: H, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', top: 66, width: W, textAlign: 'center', fontFamily: MONO, fontWeight: 500, fontSize: 28, letterSpacing: 7, color: '#7D8DAD'}}>
          {rotulo}
        </div>
        <div style={{position: 'absolute', top: 92, width: W, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 22, fontFamily: INTER, color: '#F2F5FA'}}>
          <div style={{display: 'flex', fontSize: 200, fontWeight: 600, letterSpacing: 0, fontVariantNumeric: 'tabular-nums', lineHeight: 1.05, height: 210, overflow: 'visible'}}>
            {digitos.map((d, i) => (
              <div key={i} style={{position: 'relative', width: d.n === ' ' && d.a === ' ' ? 0 : '0.57em'}}>
                {d.muda ? (
                  <>
                    <span style={{position: 'absolute', left: 0, transform: `translateY(${-kT * 70}px)`, opacity: 1 - kT, filter: `blur(${kT * 10}px)`}}>{d.a}</span>
                    <span style={{position: 'absolute', left: 0, transform: `translateY(${(1 - kT) * 80}px)`, opacity: kT, filter: `blur(${(1 - kT) * 10}px)`}}>{d.n}</span>
                  </>
                ) : (
                  <span style={{position: 'absolute', left: 0}}>{d.n}</span>
                )}
              </div>
            ))}
          </div>
          <div style={{fontSize: 66, fontWeight: 500, color: '#B9C6DC', letterSpacing: -1}}>{unidade}</div>
        </div>
        <canvas ref={ref} width={W} height={H} style={{position: 'absolute', left: 0, top: 0}} />
        {rotulos.map((r) => {
          if (!r.vis) return null;
          const [x, y, z] = proj(vec(r.lon, r.lat));
          if (z < 0.05) return null;
          return (
            <div key={r.nome} style={{position: 'absolute', left: r.alinhar === 'right' ? x - 300 + r.dx : x - 150, top: r.alinhar === 'right' ? y - 18 : y + 18, width: 300, textAlign: r.alinhar, fontFamily: INTER, fontWeight: 500, fontSize: 26, color: '#E8EEF8'}}>
              {r.nome}
            </div>
          );
        })}
      </div>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0, opacity: 0.08, mixBlendMode: 'overlay'}}>
        <filter id="g20"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" /></filter>
        <rect width="100%" height="100%" filter="url(#g20)" />
      </svg>
    </AbsoluteFill>
  );
};
