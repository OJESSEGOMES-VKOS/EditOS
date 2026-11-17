// cena07 — Blue Editorial (Editorial azul). Componente reutilizável (EditOS, cenas/estilos).
// Capa de revista em movimento: azul chapado, tipo branco em minúsculas, itálico enorme x grotesca pesada pequena.
// A capa se monta a partir das PARTES DA FRASE DITA (2 a 6), cada uma com o movimento que o lugar dela pede:
//   1ª pequena: nasce enorme letra a letra e encolhe para chapéu (com borrão) | 1ª enorme: sobe letra a letra e fica
//   enorme do meio: cortina inclinada com fio | pequena do meio: sai de baixo da régua curta (alterna direita/esquerda)
//   pequena colada na última: escorrega de baixo da enorme | última enorme: 4 fatias de lados alternados, fora de registro, trava
// A coreografia exata da demo mora em demo-coreografia.tsx (só para a demo; vídeo novo usa este arquivo).
// Desenho em espaço 1080x1350 (4:5) centralizado; o azul preenche qualquer formato.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont as loadSerif} from '@remotion/google-fonts/InstrumentSerif';
import {loadFont as loadGrot} from '@remotion/google-fonts/SchibstedGrotesk';

const {fontFamily: serif} = loadSerif('italic', {weights: ['400'], subsets: ['latin', 'latin-ext']});
const {fontFamily: grot} = loadGrot('normal', {weights: ['900'], subsets: ['latin', 'latin-ext']});

export type ParteEditorial = {texto: string; tipo?: 'pequena' | 'enorme'};
export type BlueEditorialProps = {
  // a frase dita, em minúsculas, partida onde a fala respira; 2 a 6 partes. Sem `tipo`: alterna pequena/enorme
  // começando pela pequena, e a última é enorme.
  partes: (string | ParteEditorial)[];
  tempos?: number[]; // quadro em que cada parte entra (ponha na palavra dita); padrão: 0, 31, 47, 63...
  largura?: number;
  altura?: number;
  cores?: {azul: string; branco: string};
  tamGrande?: number; // teto da enorme (encolhe sozinha para caber em ~900 px e na altura)
};

const CORES = {azul: '#2433F0', branco: '#F4F5FA'};
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const rapido = Easing.bezier(0.2, 0.9, 0.2, 1);
const L0 = 99; // margem esquerda
const R0 = 981; // margem direita
const PEQ = 82; // corpo da pequena
const larguraSerif = (t: string) => Math.max(1, Array.from(t).length) * 0.47; // Instrument Serif itálico + a sobra do itálico, em em
const larguraGrot = (t: string) => Math.max(1, Array.from(t).length) * 0.56; // Schibsted 900 apertada, em em

type Linha =
  | {k: 'chapeu'; i: number; topo: number; regra: number}
  | {k: 'enorme'; i: number; base: number; S: number; x: number; primeira: boolean; ultima: boolean}
  | {k: 'pequena'; i: number; topo: number; regra: number; direita: boolean}
  | {k: 'colada'; i: number; base: number};

export const BlueEditorial: React.FC<BlueEditorialProps> = ({partes: entrada, tempos, largura, altura, cores = CORES, tamGrande = 375}) => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const W = largura ?? width;
  const H = altura ?? height;
  const s = Math.min(W / 1080, H / 1350);
  const B = cores.branco;
  const sp = (d: number, damping = 10, stiffness = 170) => spring({frame: f - d, fps, config: {damping, stiffness}});
  const regraP = (d: number, dur = 7) => interpolate(f, [d, d + dur], [0, 1], {...cl, easing: rapido});
  const pequeno: React.CSSProperties = {fontFamily: grot, fontWeight: 900, letterSpacing: '-0.045em', lineHeight: 1, color: B, whiteSpace: 'pre'};
  const grande: React.CSSProperties = {fontFamily: serif, fontStyle: 'italic', letterSpacing: '-0.03em', lineHeight: 1, color: B, whiteSpace: 'pre'};

  const n = entrada.length;
  const partes = entrada.map((p, i): Required<ParteEditorial> => {
    const o = typeof p === 'string' ? {texto: p} : p;
    const tipo = o.tipo ?? (i === n - 1 && n > 1 ? 'enorme' : i % 2 === 0 ? 'pequena' : 'enorme');
    return {texto: o.texto.toLowerCase(), tipo};
  });
  const T = partes.map((_, i) => tempos?.[i] ?? (i === 0 ? 0 : 31 + (i - 1) * 16));
  // o chapéu precisa terminar de subir antes de encolher: letras mais juntas se a palavra é longa, e a 2ª parte espera
  const n0 = Array.from(partes[0]?.texto ?? '').length;
  const tEnc = n > 1 ? Math.max(12, T[1] - 10, Math.min(n0 * 1.6 + 14, 40)) : 9999; // o chapéu encolhe logo antes da 2ª parte
  const passo0 = n > 1 && partes[0].tipo === 'pequena' ? Math.max(1, Math.min(2.5, (tEnc - 12) / Math.max(1, n0))) : 2.5;
  if (n > 1 && partes[0].tipo === 'pequena') T[1] = Math.max(T[1], tEnc + 8);

  // ---- layout: a pilha da capa, de cima para baixo; se passar da altura, as enormes encolhem e refaz ----
  const montar = (k: number) => {
    const linhas: Linha[] = [];
    let y = 114;
    partes.forEach((p, i) => {
      const ultima = i === n - 1;
      const proxColada = i === n - 2 && p.tipo === 'pequena' && partes[n - 1].tipo === 'enorme' && i > 0;
      if (i === 0 && p.tipo === 'pequena') {
        linhas.push({k: 'chapeu', i, topo: y, regra: y + 132});
        y += 132;
      } else if (p.tipo === 'enorme') {
        const colada = linhas.find((l): l is Extract<Linha, {k: 'colada'}> => l.k === 'colada');
        const x = ultima && colada ? L0 + larguraGrot(partes[colada.i].texto) * PEQ + 34 : 82;
        const S = Math.min(tamGrande, (R0 - x) / larguraSerif(p.texto)) * k;
        const base = i === 0 ? y + 0.86 * S : y + (ultima ? 0.86 * S + 40 : 0.8 * S);
        linhas.push({k: 'enorme', i, base, S, x, primeira: i === 0, ultima});
        if (colada) colada.base = base;
        y = base + (ultima ? 112 : 0.12 * S);
      } else if (proxColada) {
        linhas.push({k: 'colada', i, base: 0});
      } else {
        const direita = linhas.filter((l) => l.k === 'pequena').length % 2 === 0;
        linhas.push({k: 'pequena', i, topo: y + 60, regra: y + 137, direita});
        y += 137 + (ultima ? 100 : 0);
      }
    });
    return {linhas, fim: y};
  };
  let {linhas, fim} = montar(1);
  if (fim > 1240) {
    const enormes = linhas.reduce((a, l) => a + (l.k === 'enorme' ? l.S : 0), 0);
    const k = Math.max(0.35, 1 - (fim - 1240) / Math.max(1, enormes * 0.98));
    ({linhas, fim} = montar(k));
  }

  const enc = interpolate(f, [tEnc, tEnc + 8], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
  const vel = interpolate(f, [tEnc, tEnc + 4, tEnc + 8], [0, 1, 0], cl);
  const ultimaE = linhas.find((l) => l.k === 'enorme' && l.ultima) as Extract<Linha, {k: 'enorme'}> | undefined;
  const tFat = ultimaE ? T[ultimaE.i] : 9999;
  const fat = [0, 1, 2, 3].map((j) => sp(tFat + j * 2, 13, 150));
  const trava = f >= tFat + 16;
  const tFecho = Math.max(...T) + 22;

  return (
    <AbsoluteFill style={{backgroundColor: cores.azul, overflow: 'hidden'}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="mb07" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation={`0 ${vel * 14}`} /></filter>
        <filter id="mbx07" x="-50%" y="-10%" width="200%" height="120%"><feGaussianBlur stdDeviation={`${trava ? 0 : 10 * (1 - Math.min(...fat))} 0`} /></filter>
      </svg>
      <div style={{position: 'absolute', left: (W - 1080 * s) / 2, top: (H - 1350 * s) / 2, width: 1080, height: 1350, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        {linhas.map((l) => {
          const p = partes[l.i];
          const t0 = T[l.i];
          if (l.k === 'chapeu') {
            // nasce enorme no meio, letra a letra pela máscara da base, e encolhe para o chapéu com borrão
            const grandeIni = Math.min(270, 880 / larguraGrot(p.texto));
            const tam = interpolate(enc, [0, 1], [grandeIni, 80]);
            const base = interpolate(enc, [0, 1], [830, l.topo + 80]);
            return (
              <React.Fragment key={l.i}>
                <div style={{position: 'absolute', left: L0, top: base - tam * 0.98, overflow: enc > 0 ? 'visible' : 'hidden', height: tam * 1.25, filter: vel > 0.05 ? 'url(#mb07)' : undefined}}>
                  <div style={{...pequeno, fontSize: tam}}>
                    {Array.from(p.texto).map((c, j) => (
                      <span key={j} style={{display: 'inline-block', transform: `translateY(${(1 - sp(t0 - 3 + j * passo0, 9, 180)) * 105}%)`}}>{c}</span>
                    ))}
                  </div>
                </div>
                <div style={{position: 'absolute', left: L0, top: l.regra, width: (R0 - L0) * regraP(tEnc + 6), height: 2, background: B, opacity: 0.55}} />
              </React.Fragment>
            );
          }
          if (l.k === 'enorme' && l.ultima && !l.primeira) {
            // 4 fatias horizontais de lados alternados, uma batida fora de registro, depois trava numa palavra
            return (
              <React.Fragment key={l.i}>
                {trava && <div style={{position: 'absolute', left: l.x, top: l.base - l.S * 0.86, ...grande, fontSize: l.S}}>{p.texto}</div>}
                {f >= t0 && !trava && [0, 1, 2, 3].map((j) => {
                  const lado = j % 2 === 0 ? -1 : 1;
                  const off = trava ? 0 : (1 - fat[j]) * 900 * lado + (f >= t0 + 10 ? lado * 14 * (j % 3 === 0 ? 1 : -0.6) : 0);
                  const topo = (j / 4) * 100;
                  return (
                    <div key={j} style={{position: 'absolute', left: l.x, top: l.base - l.S * 0.86, ...grande, fontSize: l.S, paddingBottom: '0.25em', clipPath: `inset(${topo}% -10% ${100 - topo - 25}% -10%)`, transform: `translateX(${off}px)`, filter: !trava && fat[j] < 0.9 ? 'url(#mbx07)' : undefined}}>{p.texto}</div>
                  );
                })}
              </React.Fragment>
            );
          }
          if (l.k === 'enorme' && l.primeira) {
            // abre a capa: letras sobem pela máscara da base
            return (
              <div key={l.i} style={{position: 'absolute', left: l.x, top: l.base - l.S * 0.98, height: l.S * 1.25, overflow: 'hidden'}}>
                <div style={{...grande, fontSize: l.S}}>
                  {Array.from(p.texto).map((c, j) => (
                    <span key={j} style={{display: 'inline-block', transform: `translateY(${(1 - sp(t0 - 3 + j * 2.5, 9, 180)) * 105}%)`}}>{c}</span>
                  ))}
                </div>
              </div>
            );
          }
          if (l.k === 'enorme') {
            // cortina inclinada no ângulo do itálico, com um fio branco na borda, que some ao sair
            const wipe = interpolate(f, [t0, t0 + 10], [0, 1], {...cl, easing: Easing.inOut(Easing.quad)});
            const incl = 0.36;
            const wx = -200 + wipe * 1400;
            return (
              <React.Fragment key={l.i}>
                {f >= t0 && <div style={{position: 'absolute', left: l.x, top: l.base - l.S * 0.86, ...grande, fontSize: l.S, clipPath: `polygon(-100px -200px, ${wx + 300 * incl}px -200px, ${wx - 600 * incl}px 700px, -100px 700px)`}}>{p.texto}</div>}
                {f >= t0 && wipe < 1 && <div style={{position: 'absolute', left: l.x + wx - 200 * incl, top: l.base - l.S * 0.95, width: 2, height: l.S * 1.25 * (1 - wipe * 0.7), background: B, transform: `skewX(${-Math.atan(incl) * 57.3}deg)`, transformOrigin: 'bottom'}} />}
              </React.Fragment>
            );
          }
          if (l.k === 'pequena') {
            // sai de baixo da régua curta; a régua corre até a margem do outro lado
            const lw = larguraGrot(p.texto) * PEQ;
            const curta = R0 - L0 - lw - 30;
            const cresce = interpolate(f, [t0 - 1, t0 + 5, t0 + 9, t0 + 16], [0, 0.45, 0.45, 1], {...cl, easing: rapido});
            return (
              <React.Fragment key={l.i}>
                <div style={{position: 'absolute', [l.direita ? 'right' : 'left']: L0, top: l.topo, height: 100, overflow: 'hidden'}}>
                  <div style={{...pequeno, fontSize: PEQ, transform: `translateY(${(1 - sp(t0, 12, 160)) * -100}%)`}}>{p.texto}</div>
                </div>
                {f >= t0 - 1 && <div style={{position: 'absolute', [l.direita ? 'right' : 'left']: L0 + lw + 30, top: l.regra, width: curta * cresce, height: 2, background: B, opacity: 0.55}} />}
              </React.Fragment>
            );
          }
          // colada: escorrega de baixo da enorme final, para a esquerda, na linha de base dela
          return (
            <div key={l.i} style={{position: 'absolute', left: L0, top: l.base - 73, width: larguraGrot(p.texto) * PEQ + 10, height: 90, overflow: 'hidden'}}>
              <div style={{...pequeno, fontSize: PEQ, transform: `translateX(${(1 - sp(Math.max(t0, tFat + 18), 13, 170)) * 120}%)`}}>{p.texto}</div>
            </div>
          );
        })}
        {/* régua de fecho */}
        <div style={{position: 'absolute', left: L0, top: Math.min(1240, fim), width: (R0 - L0 - 45) * regraP(tFecho), height: 2, background: B, opacity: 0.55}} />
      </div>
    </AbsoluteFill>
  );
};
