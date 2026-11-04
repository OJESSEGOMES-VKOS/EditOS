// cena03 — Apple One-Take (Plano-sequência Apple). Componente reutilizável (EditOS, cenas/estilos).
// Um objeto carrega o filme: ponto → botão → cartão → celular → recuo de câmera → o "O" da frase final.
// Desenho em espaço 1080x1350 (4:5) centralizado; o fundo liso preenche qualquer formato.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/InterTight';

const {fontFamily} = loadFont('normal', {weights: ['500', '600', '700'], subsets: ['latin', 'latin-ext']});

export type AppleOneTakeProps = {
  botao?: string; // palavra do botão
  rotuloCartao?: string;
  tituloApp?: string;
  subtituloApp?: string;
  acoes?: [string, string, string];
  acaoFinal?: string;
  frase?: string; // precisa começar com "O" (o celular vira o "O")
  largura?: number;
  altura?: number;
  cores?: {fundo: string; tinta: string; papel: string; acento: string};
};

const CORES = {fundo: '#EEEEEC', tinta: '#111113', papel: '#FBFBF9', acento: '#FF3B30'};
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const AppleOneTake: React.FC<AppleOneTakeProps> = ({
  botao = 'Gravar',
  rotuloCartao = 'Gravando',
  tituloApp = 'Take 1',
  subtituloApp = 'sem cortes · agora',
  acoes = ['Clipe', 'Cortar', 'Enviar'],
  acaoFinal = 'Salvar take',
  frase = 'Outro take',
  largura,
  altura,
  cores = CORES,
}) => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const W = largura ?? width;
  const H = altura ?? height;
  const s = Math.min(W / 1080, H / 1350);
  const sp = (d: number, damping = 11, stiffness = 120) => spring({frame: f - d, fps, config: {damping, stiffness}});

  const cx = 540;
  const cy = 690;

  // ---- fases do objeto portador ----
  const pPill = sp(4, 11, 130); // ponto → botão (~10% de passagem)
  const pCard = sp(30, 14, 110); // botão → cartão (~5%)
  const pQuad = sp(44, 14, 110); // cartão → quadrado
  const pFone = sp(54, 14, 110); // quadrado → celular
  const pRecuo = interpolate(f, [86, 102], [0, 1], {...cl, easing: Easing.out(Easing.exp)}); // recuo exponencial
  const pO = sp(98, 16, 140); // vira o "O"

  // tamanho da frase final
  const fs = 158;
  const linhaY = cy + 40; // linha de base
  const cw = 0.445; // largura média de caractere da Inter Tight 700 com -0.04em
  const x0 = 540 - 0.5 * fs * cw * (frase.length + 0.6); // começo da linha (centrada aproximada)
  const oW = fs * 0.78;
  const oH = fs * 0.76;
  const oCx = x0 + fs * 0.405;
  const oCy = linhaY - fs * 0.365;

  let w = interpolate(pPill, [0, 1], [44, 360]);
  let h = interpolate(pPill, [0, 1], [44, 128]);
  let r = h / 2;
  w = interpolate(pCard, [0, 1], [w, 860]);
  h = interpolate(pCard, [0, 1], [h, 540]);
  r = interpolate(pCard, [0, 1], [r, 40]);
  w = interpolate(pQuad, [0, 1], [w, 700]);
  h = interpolate(pQuad, [0, 1], [h, 690]);
  w = interpolate(pFone, [0, 1], [w, 576]);
  h = interpolate(pFone, [0, 1], [h, 1170]);
  r = interpolate(pFone, [0, 1], [r, 92]);
  let x = cx;
  let y = cy;
  // recuo de câmera: o celular encolhe e vira um anel oval
  const escRecuo = Math.pow(0.22, pRecuo);
  w = w * escRecuo;
  h = h * escRecuo;
  r = r * escRecuo;
  w = interpolate(pO, [0, 1], [w, oW]);
  h = interpolate(pO, [0, 1], [h, oH]);
  r = interpolate(pO, [0, 1], [r, oW / 2]);
  x = interpolate(pO, [0, 1], [x, oCx]);
  y = interpolate(pO, [0, 1], [y, oCy]);

  // a borda preta afina de dentro pra fora (preto vira branco por geometria)
  const borda = interpolate(pCard, [0, 0.55], [h / 2 + 2, 0], cl) + interpolate(pFone, [0.2, 1], [0, 14], cl) + interpolate(pO, [0, 1], [0, fs * 0.13 - 14], cl);
  const press = interpolate(f, [22, 24, 28], [1, 0.93, 1], cl);
  const sombra = interpolate(pO, [0, 0.6], [1, 0], cl) * Math.min(1, w / 300);
  const trocaTexto = f >= 106;

  // relógio
  const seg = Math.max(1, Math.min(9, Math.floor((f - 20) / 15)));
  const relogio = `0:0${seg}`;

  // ponteiro
  const pont = sp(12, 16, 120);
  const pontSai = interpolate(f, [30, 38], [0, 1], cl);

  // ponto vermelho: sobrevive a tudo e vira o ponto final
  const pontoVoo = sp(104, 13, 120);
  const fimTexto = x0 + fs * cw * frase.length;
  let px = cx;
  let py = cy;
  let pr = 22;
  if (f >= 4) { px = cx - w / 2 + 52 * Math.min(1, pPill * 1.2); }
  px = interpolate(pCard, [0, 1], [px, cx - 430 + 50], cl);
  py = interpolate(pCard, [0, 1], [py, cy - 270 + 54], cl);
  pr = interpolate(pCard, [0, 1], [22, 14], cl);
  px = interpolate(pFone, [0, 1], [px, cx + 105], cl);
  py = interpolate(pFone, [0, 1], [py, cy - 585 + 52], cl);
  pr = interpolate(pFone, [0, 1], [pr, 10], cl);
  px = interpolate(pRecuo, [0, 1], [px, cx + 40], cl);
  py = interpolate(pRecuo, [0, 1], [py, cy - 300], cl);
  px = interpolate(pontoVoo, [0, 1], [px, fimTexto + fs * 0.11], cl);
  py = interpolate(pontoVoo, [0, 1], [py, linhaY - fs * 0.07], cl);
  pr = interpolate(pontoVoo, [0, 1], [pr, fs * 0.065], cl);

  const restoEntra = sp(100, 15, 150);
  const velResto = Math.abs(sp(100, 15, 150) - sp(99, 15, 150));
  const blurResto = Math.min(18, velResto * 260);

  // conteúdo do cartão e do celular (segue o portador ~3 quadros atrás)
  const cartaoVis = interpolate(f, [33, 36], [0, 1], cl) * (1 - interpolate(f, [86, 90], [0, 1], cl));
  const conteudoFone = (d: number) => sp(d, 12, 140);
  const escConteudo = escRecuo;

  return (
    <AbsoluteFill style={{backgroundColor: cores.fundo, overflow: 'hidden'}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="mb03"><feGaussianBlur stdDeviation={`${blurResto} 0`} /></filter>
      </svg>
      <div style={{position: 'absolute', left: (W - 1080 * s) / 2, top: (H - 1350 * s) / 2, width: 1080, height: 1350, transform: `scale(${s})`, transformOrigin: '0 0', fontFamily, color: cores.tinta}}>
        {/* o portador */}
        {!trocaTexto && (
          <div
            style={{
              position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: r,
              background: cores.papel, boxSizing: 'border-box', border: `${Math.max(0, borda)}px solid ${cores.tinta}`,
              transform: `scale(${press})`, overflow: 'hidden',
              boxShadow: `0 ${2 * sombra}px ${4 * sombra}px rgba(0,0,0,${0.18 * sombra}), 0 ${18 * sombra}px ${40 * sombra}px rgba(0,0,0,${0.12 * sombra}), 0 ${40 * sombra}px ${90 * sombra}px rgba(0,0,0,${0.08 * sombra})`,
            }}
          >
            {/* cartão: rótulo + relógio */}
            <div style={{position: 'absolute', inset: 0, opacity: cartaoVis * (1 - pFone)}}>
              <div style={{position: 'absolute', left: 80, top: 40, fontSize: 30, fontWeight: 600, opacity: 0.6}}>{rotuloCartao}</div>
              <div style={{position: 'absolute', left: 60, top: h / 2 - 110, fontSize: 190, fontWeight: 700, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums'}}>{relogio}</div>
              <div style={{position: 'absolute', right: 50, top: h / 2 + 50, display: 'flex', gap: 7}}>
                {Array.from({length: 16}, (_, i) => (<div key={i} style={{width: 5, height: 4 + Math.abs(Math.sin(i * 1.7 + f / 3)) * 8, background: cores.tinta, opacity: 0.35, borderRadius: 2}} />))}
              </div>
            </div>
            {/* celular: interface pequena */}
            <div style={{position: 'absolute', left: 0, top: 0, width: 548, height: 1142, transform: `scale(${escConteudo})`, transformOrigin: '0 0', opacity: pFone > 0.5 && pRecuo < 0.8 ? 1 : 0}}>
              <div style={{position: 'absolute', left: 205, top: 22, width: 138, height: 40, borderRadius: 20, background: cores.tinta, transform: `scaleX(${conteudoFone(58)})`}} />
              <div style={{position: 'absolute', left: 40, top: 90, fontSize: 84, fontWeight: 700, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums'}}>{relogio}</div>
              <div style={{position: 'absolute', left: 40, top: 210, width: 468, height: 300, borderRadius: 26, background: 'linear-gradient(135deg, #b9d3f5 0%, #6f9be6 50%, #3b5fcc 100%)', transform: `scale(${conteudoFone(60)})`, boxShadow: '0 10px 30px rgba(40,70,160,0.25)'}}>
                <div style={{position: 'absolute', left: 204, top: 120, width: 62, height: 62, borderRadius: 31, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <div style={{width: 0, height: 0, borderLeft: '20px solid #111', borderTop: '12px solid transparent', borderBottom: '12px solid transparent', marginLeft: 6}} />
                </div>
                <div style={{position: 'absolute', left: 22, bottom: 18, color: '#fff', fontSize: 20, fontWeight: 600}}>4K · 0:04</div>
              </div>
              <div style={{position: 'absolute', left: 40, top: 540, transform: `translateY(${(1 - conteudoFone(64)) * 30}px)`, opacity: conteudoFone(64) > 0.05 ? 1 : 0}}>
                <div style={{fontSize: 40, fontWeight: 700}}>{tituloApp}</div>
                <div style={{fontSize: 24, opacity: 0.55, fontWeight: 500}}>{subtituloApp}</div>
              </div>
              <div style={{position: 'absolute', left: 40, top: 680, width: 468 * conteudoFone(66), height: 4, background: '#ddd', borderRadius: 2}}>
                <div style={{width: `${interpolate(f, [66, 86], [20, 60], cl)}%`, height: 4, background: cores.tinta, borderRadius: 2}} />
              </div>
              {acoes.map((a, i) => (
                <div key={a} style={{position: 'absolute', left: 40 + i * 162, top: 730, width: 144, height: 144, borderRadius: 22, background: '#ECECEA', transform: `scale(${conteudoFone(68 + i * 2)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 24, fontWeight: 600}}>
                  <div style={{width: 30, height: 30, borderRadius: 8, background: cores.tinta}} />{a}
                </div>
              ))}
              <div style={{position: 'absolute', left: 134, top: 930, width: 280, height: 84, borderRadius: 42, background: cores.tinta, color: cores.papel, fontSize: 32, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${conteudoFone(76)})`}}>{acaoFinal}</div>
            </div>
          </div>
        )}
        {/* rótulo do botão (fora do portador para não ficar sob a borda) */}
        {!trocaTexto && f < 26 && pPill > 0.3 && (
          <div style={{position: 'absolute', left: cx - w / 2 + 92, top: cy - 40, height: 80, display: 'flex', alignItems: 'center', color: cores.papel, fontWeight: 600, fontSize: 46, overflow: 'hidden', width: interpolate(sp(7, 14, 140), [0, 1], [0, 240]), whiteSpace: 'nowrap', transform: `scale(${press})`}}>{botao}</div>
        )}
        {/* frase final: o "O" é o portador; o resto desliza com borrão direcional */}
        {f >= 98 && (
          <div style={{position: 'absolute', left: x0, top: linhaY - fs * 0.93, fontSize: fs, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, whiteSpace: 'pre', display: 'flex'}}>
            <span style={{opacity: trocaTexto ? 1 : 0}}>{frase[0]}</span>
            <span style={{display: 'inline-block', transform: `translateX(${(1 - restoEntra) * 420}px)`, clipPath: 'inset(-50% -50% -50% 0)', filter: blurResto > 0.4 ? 'url(#mb03)' : undefined}}>{frase.slice(1)}</span>
          </div>
        )}
        {/* ponteiro */}
        {f >= 12 && pontSai < 1 && (
          <svg width={60} height={80} viewBox="0 0 24 32" style={{position: 'absolute', left: interpolate(pont, [0, 1], [cx + 330, cx + 120]) + pontSai * 120, top: interpolate(pont, [0, 1], [cy + 260, cy + 20]) + pontSai * 160, transform: `scale(${press})`}}>
            <path d="M2 2 L2 24 L8 18 L12 28 L16 26 L12 17 L20 17 Z" fill={cores.papel} stroke={cores.tinta} strokeWidth={2} strokeLinejoin="round" />
          </svg>
        )}
        {/* o ponto vermelho */}
        <div style={{position: 'absolute', left: px - pr, top: py - pr, width: pr * 2, height: pr * 2, borderRadius: '50%', background: cores.acento, transform: f < 4 ? `scale(${spring({frame: f + 6, fps, config: {damping: 10}})})` : undefined}} />
      </div>
    </AbsoluteFill>
  );
};
