// cena22 — Isometric flow (Fluxo isométrico). 3D edição: diorama em projeção ortográfica isométrica,
// desenhado em SVG (caixas com 3 faces, ordem do pintor). Prédios sobem com pulinho, etiquetas estouram,
// a faixa da estrada se desenha, caixas pulam na van, a van leva até a última etapa e o número vira check.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/InterTight';

const {fontFamily: INTER} = loadFont('normal', {weights: ['500', '700', '800'], subsets: ['latin', 'latin-ext']});

export type Etapa = {nome: string; tempo: string};
export type Cena22Props = {
  titulo: string;
  etapas: [Etapa, Etapa, Etapa];
  cores?: [string, string, string]; // menta, azul, coral
  width?: number;
  height?: number;
};

const W = 1080;
const H = 1350;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const sombra = (hex: string, f: number) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * f);
  const g = Math.round(((n >> 8) & 255) * f);
  const b = Math.round((n & 255) * f);
  return `rgb(${Math.min(255, r)},${Math.min(255, g)},${Math.min(255, b)})`;
};

type P3 = [number, number, number];

export const Cena22: React.FC<Cena22Props> = ({
  titulo, etapas, cores = ['#36C39A', '#3B6CF6', '#FF6A4D'], width = W, height = H,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = Math.min(width / W, height / H);

  // câmera: órbita de ~6° e recuo, em repouso por 4 s
  const cam = interpolate(frame, [0, 120], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const th = ((51 - 6 * cam) * Math.PI) / 180;
  const S = 1.08 * (1.08 - 0.08 * cam);
  const cx = W / 2;
  const cy = 790;
  const ct = Math.cos(th);
  const st = Math.sin(th);
  const iso = ([x, y, z]: P3): [number, number] => {
    const X = x * ct - y * st;
    const Y = x * st + y * ct;
    return [cx + X * S, cy + Y * S * 0.643 - z * S * 0.766];
  };
  const prof = (x: number, y: number) => x * st + y * ct;
  const pts = (a: P3[]) => a.map((p) => iso(p).map((v) => v.toFixed(1)).join(',')).join(' ');

  type Item = {d: number; el: React.ReactNode};
  const itens: Item[] = [];

  // caixa com 3 faces visíveis (+x, +y, topo)
  const caixa = (key: string, x: number, y: number, z: number, w: number, dd: number, h: number, cor: string, topo?: string, raio = 6) => {
    const x0 = x - w / 2, x1 = x + w / 2, y0 = y - dd / 2, y1 = y + dd / 2, z1 = z + h;
    return (
      <g key={key} strokeLinejoin="round" strokeWidth={raio}>
        <polygon points={pts([[x1, y0, z], [x1, y1, z], [x1, y1, z1], [x1, y0, z1]])} fill={sombra(cor, 0.82)} stroke={sombra(cor, 0.82)} />
        <polygon points={pts([[x0, y1, z], [x1, y1, z], [x1, y1, z1], [x0, y1, z1]])} fill={sombra(cor, 0.93)} stroke={sombra(cor, 0.93)} />
        <polygon points={pts([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]])} fill={topo ?? cor} stroke={topo ?? cor} />
      </g>
    );
  };
  // retângulo pintado numa face (janela/porta): face 'x' (+x) ou 'y' (+y)
  const naFace = (key: string, face: 'x' | 'y', x: number, y: number, a: number, b: number, z0: number, z1: number, cor: string) => {
    const q: P3[] = face === 'x' ? [[x, a, z0], [x, b, z0], [x, b, z1], [x, a, z1]] : [[a, y, z0], [b, y, z0], [b, y, z1], [a, y, z1]];
    return <polygon key={key} points={pts(q)} fill={cor} stroke={cor} strokeWidth={3} strokeLinejoin="round" />;
  };

  // caixa girada no chão (ang em radianos): desenha só as faces que olham para a câmera
  const caixaR = (key: string, x: number, y: number, z: number, w: number, dd: number, h: number, ang: number, cor: string, topo: string) => {
    const c = Math.cos(ang), sn = Math.sin(ang);
    const q = (a: number, b: number): [number, number] => [x + a * c - b * sn, y + a * sn + b * c];
    const cs = [q(-w / 2, -dd / 2), q(w / 2, -dd / 2), q(w / 2, dd / 2), q(-w / 2, dd / 2)];
    const faces: React.ReactNode[] = [];
    for (let i = 0; i < 4; i++) {
      const A = cs[i], B = cs[(i + 1) % 4];
      const nx = B[1] - A[1], ny = -(B[0] - A[0]);
      const vis = prof(nx, ny);
      if (vis <= 0) continue;
      const tom = sombra(cor, 0.8 + 0.15 * Math.abs(nx) / Math.hypot(nx, ny));
      faces.push(<polygon key={i} points={pts([[A[0], A[1], z], [B[0], B[1], z], [B[0], B[1], z + h], [A[0], A[1], z + h]])} fill={tom} stroke={tom} strokeWidth={3} strokeLinejoin="round" />);
    }
    return (
      <g key={key}>
        {faces}
        <polygon points={pts(cs.map(([a, b]) => [a, b, z + h] as P3))} fill={topo} stroke={topo} strokeWidth={3} strokeLinejoin="round" />
      </g>
    );
  };
  // pulinho: sobe rápido, passa um pouco da altura, pousa com leve achatamento
  const sobe = (ini: number) => interpolate(frame - ini, [0, 5, 8, 11], [0, 1.12, 0.96, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const tempos = [4, 14, 24];

  // ---- chão: laje, estrada, lago, sombras
  const L = 340;
  const esp = 46;
  const slab = (
    <g key="laje" strokeLinejoin="round">
      <polygon points={pts([[L, -L, 0], [L, L, 0], [L, L, -esp], [L, -L, -esp]])} fill="#DCE2EB" stroke="#DCE2EB" strokeWidth={60} />
      <polygon points={pts([[-L, L, 0], [L, L, 0], [L, L, -esp], [-L, L, -esp]])} fill="#E6EBF2" stroke="#E6EBF2" strokeWidth={60} />
      <polygon points={pts([[-L, -L, 0], [L, -L, 0], [L, L, 0], [-L, L, 0]])} fill="#F7F9FC" stroke="#F7F9FC" strokeWidth={60} />
    </g>
  );
  // estrada em zigue-zague, da etapa 1 à etapa 3
  // pontos de controle em (u = x - y, v = x + y): u corre na horizontal da tela; curva suave (Catmull-Rom)
  const uv = (u: number, v: number): P3 => [(u + v) / 2, (v - u) / 2, 0];
  const ctrl: [number, number][] = [[-330, 70], [-180, 110], [-40, 80], [60, 10], [170, 0], [240, 60], [300, 120], [400, 90], [450, 20]];
  const estrada: P3[] = [];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const p0 = ctrl[Math.max(0, i - 1)], p1 = ctrl[i], p2 = ctrl[i + 1], p3 = ctrl[Math.min(ctrl.length - 1, i + 2)];
    for (let k = 0; k < 10; k++) {
      const t = k / 10, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      estrada.push(uv(f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])));
    }
  }
  estrada.push(uv(...ctrl[ctrl.length - 1]));
  const estradaD = estrada.map((p, i) => `${i ? 'L' : 'M'}${iso(p).join(',')}`).join(' ');
  let compr = 0;
  const segs = estrada.slice(1).map((p, i) => {
    const a = estrada[i];
    const l = Math.hypot(p[0] - a[0], p[1] - a[1]);
    compr += l;
    return {a, b: p, l};
  });
  const ptEstrada = (d: number): {p: P3; dir: [number, number]} => {
    let r = d;
    for (const sg of segs) {
      if (r <= sg.l) {
        const k = r / sg.l;
        return {p: [sg.a[0] + (sg.b[0] - sg.a[0]) * k, sg.a[1] + (sg.b[1] - sg.a[1]) * k, 0], dir: [(sg.b[0] - sg.a[0]) / sg.l, (sg.b[1] - sg.a[1]) / sg.l]};
      }
      r -= sg.l;
    }
    const sl = segs[segs.length - 1];
    return {p: sl.b, dir: [(sl.b[0] - sl.a[0]) / sl.l, (sl.b[1] - sl.a[1]) / sl.l]};
  };
  // comprimento em tela, para a faixa se desenhar
  let comprTela = 0;
  for (let i = 1; i < estrada.length; i++) {
    const a = iso(estrada[i - 1]);
    const b = iso(estrada[i]);
    comprTela += Math.hypot(b[0] - a[0], b[1] - a[1]);
  }
  const faixa = interpolate(frame, [8, 52], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});

  // ---- prédios
  const [c1, c2, c3] = cores;
  const B1 = {x: -175, y: 155};
  const B2 = {x: -100, y: -160};
  const B3 = {x: 135, y: -195};
  const k1 = sobe(tempos[0]);
  const k2 = sobe(tempos[1]);
  const k3 = sobe(tempos[2]);

  const loja = (k: number) => {
    const h = 120 * k;
    if (k <= 0) return null;
    return (
      <g key="loja">
        {caixa('l-corpo', B1.x, B1.y, 0, 130, 120, h, c1)}
        {k > 0.6 && naFace('l-porta', 'y', 0, B1.y + 60, B1.x - 10, B1.x + 25, 0, h * 0.55, '#2B3445')}
        {k > 0.6 && naFace('l-vit', 'y', 0, B1.y + 60, B1.x - 52, B1.x - 22, h * 0.25, h * 0.6, '#FFFFFF')}
        {k > 0.6 && naFace('l-jan', 'x', B1.x + 65, 0, B1.y - 40, B1.y + 20, h * 0.35, h * 0.7, '#2B3445')}
        {caixa('l-teto', B1.x, B1.y, h, 148, 138, 16 * Math.min(1, k), '#FFFFFF', '#FFFFFF')}
      </g>
    );
  };
  const armazem = (k: number) => {
    const h = 100 * k;
    if (k <= 0) return null;
    return (
      <g key="armazem">
        {caixa('a-corpo', B2.x, B2.y, 0, 200, 150, h, c2)}
        {k > 0.6 && naFace('a-porta', 'y', 0, B2.y + 75, B2.x - 40, B2.x + 40, 0, h * 0.7, '#2B3445')}
        {/* telhado em arco: fatias brancas */}
        {[0, 1, 2, 3].map((i) => caixa(`a-t${i}`, B2.x, B2.y, h + i * 9 * k, 206, 156 - i * 34, 10 * k, '#FFFFFF', i % 2 ? '#F2F5FA' : '#FFFFFF', 8))}
      </g>
    );
  };
  const casa = (k: number) => {
    const h = 90 * k;
    if (k <= 0) return null;
    const x0 = B3.x - 60, x1 = B3.x + 60, y0 = B3.y - 55, y1 = B3.y + 55, r = h + 50 * k;
    return (
      <g key="casa" strokeLinejoin="round">
        {caixa('c-corpo', B3.x, B3.y, 0, 120, 110, h, c3)}
        {k > 0.6 && naFace('c-porta', 'y', 0, y1, B3.x - 15, B3.x + 15, 0, h * 0.6, '#2B3445')}
        {k > 0.6 && naFace('c-j1', 'x', x1, 0, B3.y - 35, B3.y - 10, h * 0.4, h * 0.75, '#2B3445')}
        {k > 0.6 && naFace('c-j2', 'x', x1, 0, B3.y + 10, B3.y + 35, h * 0.4, h * 0.75, '#2B3445')}
        <polygon points={pts([[x0 - 6, y0 - 6, h], [x1 + 6, y0 - 6, h], [x1 + 6, B3.y, r], [x0 - 6, B3.y, r]])} fill="#E9EDF3" stroke="#E9EDF3" strokeWidth={5} />
        <polygon points={pts([[x1, y0, h], [x1, y1, h], [x1, B3.y, r]])} fill={sombra(c3, 0.82)} stroke={sombra(c3, 0.82)} strokeWidth={4} />
        <polygon points={pts([[x0 - 6, y1 + 6, h], [x1 + 6, y1 + 6, h], [x1 + 6, B3.y, r], [x0 - 6, B3.y, r]])} fill="#FFFFFF" stroke="#FFFFFF" strokeWidth={5} />
      </g>
    );
  };
  const sombraChao = (key: string, x: number, y: number, w: number, d: number, k: number) => (
    <polygon key={key} points={pts([[x - w / 2 + 10, y - d / 2 + 10, 0], [x + w / 2 + 34, y - d / 2 + 10, 0], [x + w / 2 + 34, y + d / 2 + 34, 0], [x - w / 2 + 10, y + d / 2 + 34, 0]])} fill={`rgba(40,52,75,${0.16 * Math.min(1, k)})`} filter="url(#blur22)" />
  );

  // ---- árvores (fixas desde o quadro 1)
  const arvoresUV: [number, number, number][] = [
    [-480, -40, 1], [-230, -220, 1.1], [-130, -330, 0.9], [-20, -420, 1], [180, -420, 0.9], [300, -300, 1], [-60, -60, 0.9],
    [180, -130, 0.8], [-420, 230, 0.9], [-100, 280, 1.1], [60, 300, 0.9], [150, 240, 0.8], [300, 270, 1], [500, 150, 0.9],
    [-180, 40, 0.8], [100, 140, 0.9], [-300, 300, 0.8], [520, -60, 0.8],
  ];
  const arvores: [number, number, number][] = arvoresUV.map(([u, v, k]) => [(u + v) / 2, (v - u) / 2, k]);
  arvores.forEach(([x, y, k], i) => {
    const [bx, by] = iso([x, y, 0]);
    const [tx, ty] = iso([x, y, 30 * k]);
    const r = 24 * k * S;
    itens.push({
      d: prof(x, y),
      el: (
        <g key={`arv${i}`}>
          <ellipse cx={bx + 6} cy={by + 3} rx={r * 0.9} ry={r * 0.45} fill="rgba(40,52,75,0.12)" />
          <rect x={bx - 3} y={ty} width={6} height={by - ty} fill="#2B3445" rx={2} />
          <ellipse cx={tx} cy={ty - r * 0.6} rx={r} ry={r * 1.15} fill={i % 3 ? '#2FB58C' : '#27A27C'} />
          <ellipse cx={tx - r * 0.3} cy={ty - r * 1.0} rx={r * 0.45} ry={r * 0.5} fill="rgba(255,255,255,0.14)" />
        </g>
      ),
    });
  });

  itens.push({d: prof(B1.x, B1.y), el: loja(k1)});
  itens.push({d: prof(B2.x, B2.y), el: armazem(k2)});
  itens.push({d: prof(B3.x, B3.y), el: casa(k3)});

  // ---- esteira + caixas que pulam na van
  const vanIni = ptEstrada(compr * 0.42); // van parada na frente do armazém
  const viagem = interpolate(frame, [74, 114], [0, 1], {...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1)});
  const vanD = compr * 0.42 + (compr - 20 - compr * 0.42) * viagem;
  const van = ptEstrada(vanD);
  const pacotes = [36, 48, 60];
  let dipCarga = 0;
  pacotes.forEach((t0, i) => {
    const k = interpolate(frame, [t0, t0 + 10], [0, 1], clamp);
    if (frame >= t0 + 10) dipCarga += Math.max(0, 1 - (frame - t0 - 10) / 6) * Math.sin(((frame - t0 - 10) / 6) * Math.PI);
    if (k >= 1) return;
    const de: P3 = [B2.x + 20 + (i - 1) * 0, B2.y + 95, 6];
    const para: P3 = [vanIni.p[0], vanIni.p[1], 28];
    const sai = frame < t0 ? interpolate(frame, [t0 - 12, t0], [0, 1], clamp) : 1;
    const x = de[0] + (para[0] - de[0]) * k;
    const y = de[1] + (para[1] - de[1]) * k + (1 - sai) * -40;
    const z = de[2] + (para[2] - de[2]) * k + Math.sin(Math.PI * k) * 50;
    if (frame < t0 - 12) return;
    itens.push({d: prof(x, y) + 1, el: caixa(`p${i}`, x, y, z, 26, 26, 22, '#FF6A4D', '#FF8466', 3)});
  });
  // esteira saindo do armazém
  itens.push({d: prof(B2.x, B2.y + 110), el: k2 > 0.6 ? caixa('esteira', B2.x + 20, B2.y + 105, 0, 34, 70, 10, '#2B3445', '#3A4458', 3) : null});

  // van: corpo branco, cabine e rodas escuras; balança na carga e mergulha o nariz ao frear
  const freio = frame > 114 ? Math.exp(-(frame - 114) / 5) * Math.sin(((frame - 114) / 4) * Math.PI) : 0;
  const balanco = dipCarga * 4 + freio * 7;
  const [dx, dy] = van.dir;
  const vx = van.p[0], vy = van.p[1];
  const ang = Math.atan2(dy, dx);
  itens.push({
    d: prof(vx, vy) + 2,
    el: (
      <g key="van" transform={`translate(0 ${balanco.toFixed(2)})`}>
        <ellipse cx={iso([vx + 8, vy + 8, 0])[0]} cy={iso([vx + 8, vy + 8, 0])[1]} rx={42 * S} ry={20 * S} fill="rgba(40,52,75,0.18)" />
        {caixaR('van-roda', vx, vy, 0, 64, 34, 12, ang, '#2B3445', '#2B3445')}
        {caixaR('van-corpo', vx - dx * 6, vy - dy * 6, 10, 58, 40, 36, ang, '#FFFFFF', '#FFFFFF')}
        {caixaR('van-cab', vx + dx * 28, vy + dy * 28, 10, 16, 40, 26, ang, '#DDE3EC', '#E9EDF3')}
        {caixaR('van-faixa', vx - dx * 6, vy - dy * 6, 30, 59, 41, 5, ang, cores[1], '#FFFFFF')}
      </g>
    ),
  });

  itens.sort((a, b) => a.d - b.d);

  // ---- etiquetas
  const etq = [
    {e: etapas[0], p: iso([B1.x, B1.y, 150]), ini: tempos[0] + 6, dx: -60},
    {e: etapas[1], p: iso([B2.x, B2.y, 150]), ini: tempos[1] + 6, dx: 0},
    {e: etapas[2], p: iso([B3.x, B3.y, 150]), ini: tempos[2] + 6, dx: 40},
  ];
  const check = spring({frame: frame - 116, fps, config: {damping: 10, stiffness: 180}});

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #EEF2F7 0%, #E3E9F1 100%)'}}>
      <div style={{position: 'absolute', left: (width - W * s) / 2, top: (height - H * s) / 2, width: W, height: H, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', left: 92, top: 70, fontFamily: INTER, fontWeight: 800, fontSize: 64, letterSpacing: -2.4, color: '#2B3445'}}>{titulo}</div>
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          <defs>
            <filter id="blur22" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" /></filter>
            <filter id="blurL22" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22" /></filter>
            <mask id="m22">
              <path d={estradaD} stroke="#fff" strokeWidth={20} fill="none" strokeDasharray={comprTela} strokeDashoffset={comprTela * (1 - faixa)} strokeLinejoin="round" />
            </mask>
          </defs>
          {/* sombra macia da laje */}
          <polygon points={pts([[-L + 60, -L + 60, -esp - 30], [L + 60, -L + 60, -esp - 30], [L + 60, L + 60, -esp - 30], [-L + 60, L + 60, -esp - 30]])} fill="rgba(60,75,100,0.16)" filter="url(#blurL22)" />
          {slab}
          {/* lago */}
          <ellipse cx={iso(uv(-230, 230))[0]} cy={iso(uv(-230, 230))[1]} rx={55 * S} ry={26 * S} fill="#9DB4F2" opacity={0.75} />
          <path d={estradaD} stroke="#3A4458" strokeWidth={62 * S} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <g mask="url(#m22)">
            <path d={estradaD} stroke="#FFFFFF" strokeWidth={5} fill="none" strokeDasharray="16 14" strokeLinejoin="round" />
          </g>
          {sombraChao('s1', B1.x, B1.y, 130, 120, k1)}
          {sombraChao('s2', B2.x, B2.y, 200, 150, k2)}
          {sombraChao('s3', B3.x, B3.y, 120, 110, k3)}
          {itens.map((it) => it.el)}
        </svg>
        {etq.map(({e, p, ini, dx}, i) => {
          const k = spring({frame: frame - ini, fps, config: {damping: 11, stiffness: 200}});
          if (frame < ini) return null;
          const final = i === 2 && frame >= 116;
          return (
            <div key={e.nome} style={{position: 'absolute', left: p[0] + dx, top: p[1], transform: `translate(-50%, -100%) scale(${k})`, transformOrigin: '50% 100%', background: '#fff', borderRadius: 999, padding: '10px 26px 10px 12px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 6px 18px rgba(43,52,69,0.14)', fontFamily: INTER}}>
              <div style={{width: 54, height: 54, borderRadius: 27, background: final ? '#22B573' : '#3B6CF6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 24, transform: final ? `scale(${0.7 + 0.3 * check}) rotate(${(1 - check) * -40}deg)` : undefined}}>
                {final ? (
                  <svg width={24} height={24} viewBox="0 0 24 24"><path d="M5 12.5 L10 17 L19 7" stroke="#fff" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  i + 1
                )}
              </div>
              <div>
                <div style={{fontWeight: 700, fontSize: 36, color: '#2B3445', lineHeight: 1, whiteSpace: 'nowrap'}}>{e.nome}</div>
                <div style={{fontWeight: 500, fontSize: 24, color: '#8892A3', marginTop: 4, whiteSpace: 'nowrap'}}>{e.tempo}</div>
              </div>
            </div>
          );
        })}
      </div>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0, opacity: 0.05, mixBlendMode: 'multiply'}}>
        <filter id="g22"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" /></filter>
        <rect width="100%" height="100%" filter="url(#g22)" />
      </svg>
    </AbsoluteFill>
  );
};
