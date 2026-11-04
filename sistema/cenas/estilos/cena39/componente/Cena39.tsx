// cena39 · Flat Cartoon (Desenho plano)
// Escritório plano, personagem genérico de cabeça grande apresentando um gráfico que sobe, o quadro racha e cai,
// a linha despenca em zigue-zague vermelho e um cartão fecha a ideia. Tudo em SVG, cor chapada, sombra dura.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Montserrat';

const {fontFamily} = loadFont('normal', {weights: ['800'], subsets: ['latin', 'latin-ext']});

export type Cena39Props = {
  rotuloQuadro?: string;
  legenda?: string; // o único cartão
  corTerno?: [string, string, string]; // base, sombra, lapela
  corGravata?: string;
  width?: number;
  height?: number;
};

const W = 1080, H = 1350;
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sp = (f: number, s: number, c = {damping: 10, stiffness: 140, mass: 0.7}) => spring({frame: f - s, fps: 30, config: c});
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const NAVY = '#2B2452';

// pontos do gráfico (coordenadas do quadro)
const PTS = [[50, 330], [100, 300], [150, 312], [205, 255], [250, 215], [295, 175], [340, 128], [380, 92]];
const NOTES = [
  {c: '#F7D84A', x: 120, y: 120, tx: 330, ty: 1255, r: -14, d: 0},
  {c: '#F48FB1', x: 210, y: 110, tx: 560, ty: 1290, r: 9, d: 6},
  {c: '#5FD0C9', x: 300, y: 124, tx: 140, ty: 1300, r: 20, d: 12},
  {c: '#F7A54A', x: 390, y: 112, tx: 470, ty: 1225, r: -8, d: 18},
];

export const Cena39: React.FC<Cena39Props> = ({
  rotuloQuadro = 'VENDAS',
  legenda = 'SEMANA 2',
  corTerno = ['#4D4A91', '#352A6E', '#625EAC'],
  corGravata = '#DF1690',
  width = W,
  height = H,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const f = frame * (150 / durationInFrames);
  const [suit, suitSh, lapel] = corTerno;

  // gráfico subindo ponto a ponto
  const shown = interpolate(f, [0, 40], [2.2, PTS.length], cl);
  const crack = interpolate(f, [40, 45], [0, 1], cl);
  const drop = sp(f, 45, {damping: 5, stiffness: 60, mass: 1});
  const boardRot = drop * 10;
  const pinPop = sp(f, 45);
  const zig = interpolate(f, [46, 60], [0, 1], {...cl, easing: Easing.out(Easing.quad)});
  const panic = sp(f, 48, {damping: 9, stiffness: 160, mass: 0.6});
  const sweat = sp(f, 72);
  const card = sp(f, 68, {damping: 9, stiffness: 150, mass: 0.7});
  const talk = f < 46 ? (Math.sin(f * 0.9) > 0 ? 1 : 0) : 0;
  const point = f < 46 ? Math.sin(f / 5) * 6 : 0;
  const arms = f >= 48 && f < 115 ? Math.sin(f * 0.8) * 4 * (1 - interpolate(f, [90, 115], [0, 1], cl)) : 0;

  const lineD = (n: number) => {
    const full = Math.floor(n);
    const pts = PTS.slice(0, full).map((p) => [...p]);
    if (full < PTS.length) {
      const a = PTS[full - 1], b = PTS[full], t = n - full;
      pts.push([mix(a[0], b[0], t), mix(a[1], b[1], t)]);
    }
    return 'M' + pts.map((p) => p.join(' ')).join(' L');
  };

  // braços: ombro, cotovelo, mão (pose apontando -> pose pânico)
  const armL = {s: [662, 905], e: [mix(560, 610, panic), mix(900, 760, panic) + arms], h: [mix(450 , 560, panic), mix(840 + point, 600, panic) + arms]};
  const armR = {s: [918, 905], e: [mix(960, 980, panic), mix(1060, 760, panic) - arms], h: [mix(930, 1010, panic), mix(1180, 600, panic) - arms]};
  const armPath = (a: typeof armL) => `M${a.s[0]} ${a.s[1]} L${a.e[0]} ${a.e[1]} L${a.h[0]} ${a.h[1]}`;
  const Hand = ({x, y, open, flip}: {x: number; y: number; open: number; flip: number}) => (
    <g transform={`translate(${x} ${y}) scale(${flip} 1)`}>
      {open < 0.5 ? (
        <g>
          <ellipse cx="0" cy="0" rx="30" ry="26" fill="#F7B797" />
          <rect x="-62" y="-16" width="60" height="18" rx="9" fill="#F7B797" />
          <path d="M-6 -20 Q-14 -40 4 -36" stroke="#E59676" strokeWidth="4" fill="#F7B797" />
        </g>
      ) : (
        <g fill="#F7B797">
          <ellipse cx="0" cy="0" rx="30" ry="28" />
          {[-40, -15, 10, 35].map((a, i) => <rect key={i} x="-8" y="-62" width="16" height="40" rx="8" transform={`rotate(${a})`} />)}
          <rect x="-8" y="-50" width="16" height="34" rx="8" transform="rotate(-80)" />
        </g>
      )}
    </g>
  );

  const s = Math.max(width / W, height / H);
  return (
    <AbsoluteFill style={{background: '#E3EDF6', overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: W, height: H, left: (width - W * s) / 2, top: (height - H * s) / 2, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {/* parede e chão */}
          <rect width={W} height={H} fill="#E3EDF6" />
          <rect y="930" width={W} height="260" fill="#D3DFEC" />
          <rect y="1180" width={W} height="170" fill="#30ABD5" />
          <rect y="1180" width={W} height="12" fill="#2690B8" />
          {[[60, 1230, 260], [420, 1250, 340], [820, 1222, 220], [200, 1300, 300], [700, 1310, 260]].map(([x, y, w], i) => (
            <rect key={i} x={x} y={y} width={w} height="10" rx="5" fill="#55C0E2" />
          ))}

          {/* janela com cidade */}
          <g>
            <rect x="618" y="14" width="420" height="650" fill="#F6FAFD" />
            <rect x="642" y="38" width="372" height="602" fill="#A9DCF2" />
            <g fill="#F4FBFF"><ellipse cx="720" cy="110" rx="46" ry="18" /><ellipse cx="750" cy="96" rx="30" ry="20" /><ellipse cx="930" cy="200" rx="40" ry="14" /></g>
            <g>
              {[[650, 380, 70, '#C9C4EA'], [720, 330, 60, '#C9C4EA'], [790, 410, 80, '#C9C4EA'], [880, 300, 70, '#C9C4EA'], [950, 360, 60, '#C9C4EA']].map(([x, y, w, c], i) => (
                <rect key={i} x={x as number} y={y as number} width={w as number} height={640 - (y as number)} fill={c as string} />
              ))}
              {[[640, 470, 90], [740, 440, 70], [820, 500, 90], [920, 450, 100]].map(([x, y, w], i) => (
                <g key={i}>
                  <rect x={x} y={y} width={w} height={640 - y} fill="#8E86D6" />
                  {Array.from({length: 8}, (_, k) => (
                    <rect key={k} x={x + 12 + (k % 3) * 24} y={y + 20 + Math.floor(k / 3) * 34} width="14" height="20" fill="#6E64BF" />
                  ))}
                </g>
              ))}
              {[[680, 560, 120], [860, 540, 110]].map(([x, y, w], i) => (
                <g key={i}><rect x={x} y={y} width={w} height={640 - y} fill="#5C539F" />
                  {Array.from({length: 6}, (_, k) => <rect key={k} x={x + 14 + (k % 3) * 34} y={y + 18 + Math.floor(k / 3) * 34} width="18" height="18" fill="#3F3784" />)}
                </g>
              ))}
            </g>
            <rect x="822" y="38" width="12" height="602" fill="#F6FAFD" />
            <rect x="642" y="300" width="372" height="12" fill="#F6FAFD" />
            <rect x="606" y="660" width="444" height="22" fill="#F6FAFD" />
            <rect x="606" y="680" width="444" height="8" fill="#C9D7E6" />
          </g>

          {/* armário e planta */}
          <g>
            <rect x="70" y="1030" width="430" height="150" fill="#3C3A7C" />
            <rect x="70" y="1030" width="430" height="18" fill="#F6FAFD" />
            <rect x="268" y="1080" width="8" height="40" rx="4" fill="#E3EDF6" /><rect x="292" y="1080" width="8" height="40" rx="4" fill="#E3EDF6" />
            <rect x="500" y="1046" width="22" height="134" fill="#2A2862" />
            <rect x="330" y="1000" width="110" height="30" fill="#F6FAFD" /><rect x="340" y="990" width="90" height="12" fill="#DDE5EE" />
            <path d="M110 1030 L120 990 L190 990 L200 1030 Z" fill="#D63384" />
            {[-60, -35, -10, 15, 40, 62].map((a, i) => (
              <path key={i} d="M0 0 Q-14 -60 0 -110 Q14 -60 0 0 Z" fill={i % 2 ? '#E04B8F' : '#F06AA6'} transform={`translate(155 995) rotate(${a})`} />
            ))}
          </g>

          {/* bilhetes: presos na parede, depois voam pro chão */}
          {NOTES.map((n, i) => {
            const t = sp(f, 52 + n.d, {damping: 14, stiffness: 50, mass: 1.2});
            const x = mix(n.x, n.tx, t) + Math.sin(t * Math.PI * 3) * 40 * (1 - t);
            const y = mix(n.y, n.ty, t);
            const rot = mix(n.r * 0.4, n.r * 4 + 70, t) + Math.sin(t * 8) * 20 * (1 - t);
            const flat = mix(1, 0.32, t > 0.92 ? 1 : 0);
            return (
              <g key={i} transform={`translate(${x} ${y}) rotate(${t > 0.92 ? n.r : rot}) scale(1 ${flat})`}>
                <rect x="-36" y="-34" width="72" height="68" fill={n.c} />
                <rect x="-36" y="-34" width="72" height="14" fill="#000" opacity="0.08" />
                <path d="M-24 -4 Q-10 -10 4 -4 T26 -4 M-24 12 Q-6 6 10 12" stroke="#3a3a5a" strokeWidth="3" fill="none" opacity="0.6" />
              </g>
            );
          })}
          {/* papéis do armário */}
          {[0, 1].map((i) => {
            const t = sp(f, 60 + i * 10, {damping: 14, stiffness: 50, mass: 1.2});
            return (
              <g key={i} transform={`translate(${mix(385, 640 + i * 180, t)} ${mix(1000, 1265 + i * 30, t)}) rotate(${mix(0, 160 + i * 30, t)}) scale(1 ${t > 0.92 ? 0.35 : 1})`}>
                <rect x="-46" y="-56" width="92" height="112" fill="#FBFCFE" />
                {[0, 1, 2, 3].map((k) => <rect key={k} x="-30" y={-36 + k * 22} width="60" height="5" fill="#C9D3DF" />)}
              </g>
            );
          })}

          {/* quadro */}
          <g transform={`translate(98 260) rotate(${boardRot} 0 0)`}>
            <rect x="8" y="10" width="500" height="430" fill="#9FA9D9" />
            <rect x="0" y="0" width="500" height="430" fill="#D9D3F1" />
            <rect x="14" y="14" width="472" height="390" fill="#FBFBFF" />
            <rect x="14" y="404" width="472" height="20" fill="#3C3A7C" />
            <rect x="40" y="408" width="44" height="10" rx="4" fill="#F0384F" /><rect x="94" y="408" width="44" height="10" rx="4" fill="#30ABD5" />
            <text x="40" y="70" fontFamily={fontFamily} fontWeight={800} fontSize={38} fill={NAVY}>{rotuloQuadro}</text>
            <path d="M40 100 L40 360 L460 360" stroke="#B7B2DA" strokeWidth="4" fill="none" />
            {[100, 160, 220, 280].map((x) => <path key={x} d={`M${x} 360 l0 10`} stroke="#B7B2DA" strokeWidth="4" />)}
            {[150, 210, 270, 320].map((y) => <path key={y} d={`M40 ${y} L460 ${y}`} stroke="#ECEAF7" strokeWidth="3" />)}
            <path d={lineD(shown)} stroke="#E8407A" strokeWidth="7" fill="none" strokeLinejoin="round" strokeLinecap="round" />
            {PTS.slice(0, Math.floor(shown)).map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="10" fill="#E8407A" />)}
            {/* rachadura */}
            <path d="M210 380 L250 300 L232 260 L286 200 L270 160 L320 110 L345 70" stroke={NAVY} strokeWidth="4" fill="none" pathLength={1} strokeDasharray={`${crack} 1`} />
            <path d="M232 260 L200 240 M286 200 L320 214" stroke={NAVY} strokeWidth="3" fill="none" opacity={crack} />
            {/* zigue-zague vermelho caindo */}
            <g opacity={zig > 0 ? 1 : 0}>
              <path d="M380 92 L352 200 L392 216 L360 330" stroke="#F0384F" strokeWidth="22" fill="none" strokeLinejoin="miter" pathLength={1} strokeDasharray={`${zig * 0.92} 1`} />
              {zig > 0.9 && <path d="M326 316 L362 372 L392 314 Z" fill="#F0384F" />}
            </g>
            <circle cx="20" cy="20" r="9" fill={NAVY} />
          </g>
          {/* pino direito saltando */}
          <circle cx={98 + 480 + pinPop * 30} cy={280 - pinPop * 60 + pinPop * pinPop * 80} r="9" fill={NAVY} opacity={1 - interpolate(f, [60, 70], [0, 1], cl)} />

          {/* personagem */}
          <g>
            {/* braço de trás (direito) */}
            <path d={armPath(armR)} stroke={suitSh} strokeWidth="64" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Hand x={armR.h[0]} y={armR.h[1]} open={panic} flip={-1} />
            {/* corpo */}
            <path d="M640 900 Q790 860 940 900 L980 1350 L600 1350 Z" fill={suit} />
            <path d="M860 880 Q910 890 940 900 L980 1350 L870 1350 Z" fill={suitSh} />
            <path d="M745 880 L790 1010 L835 880 Z" fill="#FFFFFF" />
            <path d="M780 905 L800 905 L812 1040 L790 1070 L768 1040 Z" fill={corGravata} />
            <path d="M745 880 L700 900 L780 1060 L790 1010 Z" fill={lapel} />
            <path d="M835 880 L880 900 L800 1060 L790 1010 Z" fill={lapel} />
            <path d="M745 880 L780 1060 M835 880 L800 1060" stroke={suitSh} strokeWidth="3" />
            <circle cx="790" cy="1130" r="7" fill={suitSh} />
            {/* pescoço */}
            <rect x="755" y="830" width="70" height="70" fill="#E59676" />
            {/* cabeça */}
            <g transform={`translate(0 ${panic * -6})`}>
              <rect x="672" y="580" width="240" height="270" rx="60" fill="#F7B797" />
              <path d="M860 590 Q912 600 912 660 L912 790 Q912 850 860 850 Z" fill="#E59676" />
              {/* orelha */}
              <ellipse cx="895" cy="730" rx="28" ry="38" fill="#F7B797" />
              <path d="M890 715 Q905 730 890 748" stroke="#C97A5E" strokeWidth="4" fill="none" />
              {/* sardas */}
              {[[870, 790], [880, 805], [862, 812]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#E07C62" />)}
              {/* cabelo */}
              <path d="M660 700 Q640 560 760 540 Q880 520 920 600 L930 700 L898 700 Q900 640 870 625 Q800 640 700 630 Q680 660 684 710 Z" fill="#322664" />
              <path d="M880 560 Q930 600 930 700 L898 700 Q900 640 870 625 Z" fill="#251C4F" />
              <path d="M720 570 Q790 548 850 566" stroke="#4A3D8A" strokeWidth="12" strokeLinecap="round" fill="none" />
              {/* olhos */}
              {panic < 0.5 ? (
                <g fill="#2B2452">
                  <ellipse cx="730" cy="720" rx="9" ry="13" /><ellipse cx="800" cy="720" rx="9" ry="13" />
                  <path d="M712 690 L746 686 M784 686 L818 690" stroke="#322664" strokeWidth="7" strokeLinecap="round" />
                </g>
              ) : (
                <g transform={`translate(765 715) scale(${0.6 + panic * 0.4}) translate(-765 -715)`}>
                  <circle cx="730" cy="715" r="30" fill="#FFF" stroke={NAVY} strokeWidth="4" /><circle cx="802" cy="715" r="30" fill="#FFF" stroke={NAVY} strokeWidth="4" />
                  <circle cx="732" cy="718" r="9" fill={NAVY} /><circle cx="804" cy="718" r="9" fill={NAVY} />
                  <path d="M706 668 L748 674 M784 674 L826 668" stroke="#322664" strokeWidth="7" strokeLinecap="round" />
                </g>
              )}
              {/* nariz */}
              <path d="M762 735 Q752 760 768 764" stroke="#C97A5E" strokeWidth="4" fill="none" strokeLinecap="round" />
              {/* boca */}
              {panic < 0.5 ? (
                talk ? <path d="M740 790 Q765 815 790 790 Z" fill="#7A2B3A" /> : <path d="M742 795 Q765 806 788 795" stroke="#7A2B3A" strokeWidth="5" fill="none" strokeLinecap="round" />
              ) : (
                <g><ellipse cx="764" cy="800" rx={18 * panic} ry={30 * panic} fill="#6B2236" /><ellipse cx="764" cy="815" rx={11 * panic} ry={10 * panic} fill="#E95A6E" /></g>
              )}
              {/* gota de suor */}
              <path d="M0 -26 Q16 0 0 12 Q-16 0 0 -26 Z" fill="#7FD3F0" transform={`translate(905 630) scale(${sweat})`} />
            </g>
            {/* braço da frente (esquerdo) */}
            <path d={armPath(armL)} stroke={suit} strokeWidth="64" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d={`M${armL.e[0]} ${armL.e[1]} L${armL.h[0]} ${armL.h[1]}`} stroke={lapel} strokeWidth="10" fill="none" opacity="0.35" />
            <rect x={armL.h[0] - 4} y={armL.h[1] - 34} width="18" height="68" fill="#FFFFFF" transform={`rotate(${mix(20, -80, panic)} ${armL.h[0]} ${armL.h[1]})`} opacity="0" />
            <Hand x={armL.h[0]} y={armL.h[1]} open={panic} flip={1} />
          </g>

          {/* cartão único */}
          <g transform={`translate(540 140) scale(${card})`} opacity={card > 0.02 ? 1 : 0}>
            <rect x="-300" y="-82" width="600" height="168" rx="22" fill="#2F7DD0" transform="translate(0 14)" />
            <rect x="-300" y="-82" width="600" height="160" rx="22" fill="#FFFFFF" />
            <text x="0" y="30" textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={104} fill={NAVY}>{legenda}</text>
          </g>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
