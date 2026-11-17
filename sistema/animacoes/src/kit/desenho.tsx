// O desenho: a tela em SVG, o traço que se desenha sozinho, a câmera e as
// camadas com profundidade. Tudo que um estilo precisa pra pôr coisa na tela.
import React from 'react';
import {useVideoConfig} from 'remotion';
import {acaso, chaves, chega, ramp} from './tempo';

export type Ponto = [number, number];

/**
 * A tela de desenho. As coordenadas são sempre as do formato:
 * vertical 1080x1920, horizontal 1920x1080, quadrado 1080x1080.
 * Use `useTela()` pra saber o tamanho e desenhar em proporção.
 */
export const Tela: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => {
  const {width, height} = useVideoConfig();
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} style={{position: 'absolute', inset: 0, ...style}}>
      {children}
    </svg>
  );
};

/** Largura, altura, centro e a unidade `u` (1 numa tela de 1080 de largura no vertical). */
export const useTela = () => {
  const {width: L, height: A} = useVideoConfig();
  return {L, A, cx: L / 2, cy: A / 2, u: Math.min(L, A * 0.75) / 1080, deitado: L > A};
};

/** Transforma pontos em caminho SVG com curvas suaves (ou retas, com `reto`). */
export const caminho = (pontos: Ponto[], fechado = false, reto = false) => {
  if (pontos.length < 2) return '';
  if (reto) return `M${pontos.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L')}${fechado ? 'Z' : ''}`;
  const p = fechado ? [pontos[pontos.length - 1], ...pontos, pontos[0], pontos[1]] : [pontos[0], ...pontos, pontos[pontos.length - 1]];
  let d = `M${p[1][0].toFixed(1)} ${p[1][1].toFixed(1)}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [a, b, c, e] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    d += `C${(b[0] + (c[0] - a[0]) / 6).toFixed(1)} ${(b[1] + (c[1] - a[1]) / 6).toFixed(1)},${(c[0] - (e[0] - b[0]) / 6).toFixed(1)} ${(c[1] - (e[1] - b[1]) / 6).toFixed(1)},${c[0].toFixed(1)} ${c[1].toFixed(1)}`;
  }
  return d + (fechado ? 'Z' : '');
};

/** Dá ao traço o tremor de mão: desloca cada ponto um pouco, sempre igual pra mesma semente. */
export const tremer = (pontos: Ponto[], semente: string | number, forca = 4): Ponto[] =>
  pontos.map(([x, y], i) => [x + (acaso(`${semente}x${i}`) - 0.5) * 2 * forca, y + (acaso(`${semente}y${i}`) - 0.5) * 2 * forca]);

/** Pontos de um círculo (ou elipse), pra desenhar à mão com `tremer` e `caminho`. */
export const circulo = (cx: number, cy: number, rx: number, ry = rx, n = 14): Ponto[] =>
  Array.from({length: n}, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] as Ponto;
  });

/**
 * Um traço que se desenha sozinho. `p` vai de 0 (nada) a 1 (inteiro).
 * Passe qualquer atributo de <path>: stroke, strokeWidth, fill...
 */
export const Traco: React.FC<{d: string; p: number} & React.SVGProps<SVGPathElement>> = ({d, p, ...resto}) => {
  if (p <= 0) return null;
  return (
    <path
      d={d}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - Math.min(1, p)}
      {...resto}
    />
  );
};

/** O progresso (0 a 1) do traço `i` de `n`, desenhados em fila entre `ini` e `ini + dur`. */
export const emFila = (t: number, ini: number, dur: number, i: number, n: number, sobrepor = 0.5) => {
  const cada = dur / (n - (n - 1) * sobrepor);
  const a = ini + i * cada * (1 - sobrepor);
  return ramp(t, a, a + cada, chega);
};

export type Chave = {t: number; x?: number; y?: number; zoom?: number; giro?: number};

/**
 * A câmera: move, aproxima e gira tudo que está dentro.
 * x e y são o ponto da tela que vai pro centro; zoom 1 é o tamanho normal.
 * <Camera t={t} chaves={[{t: 0, zoom: 1}, {t: 2, x: 300, y: 800, zoom: 1.8}]}>...</Camera>
 */
export const Camera: React.FC<{t: number; chaves: Chave[]; children: React.ReactNode}> = ({t, chaves: ks, children}) => {
  const {L, A} = useTela();
  const v = (campo: 'x' | 'y' | 'zoom' | 'giro', padrao: number) =>
    ks.length > 1 ? chaves(t, ks.map((k) => [k.t, k[campo] ?? padrao])) : (ks[0]?.[campo] ?? padrao);
  const zoom = v('zoom', 1);
  const x = v('x', L / 2);
  const y = v('y', A / 2);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformOrigin: '0 0',
        transform: `translate(${L / 2}px, ${A / 2}px) rotate(${v('giro', 0)}deg) scale(${zoom}) translate(${-x}px, ${-y}px)`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Profundidade sem programa de 3D: um palco em perspectiva. Cada <Plano>
 * fica numa distância (`z` negativo é pra longe) e o palco pode virar.
 * <Palco3D viraY={balanco(t) * 8}><Plano z={-400}>fundo</Plano><Plano z={0}>frente</Plano></Palco3D>
 */
export const Palco3D: React.FC<{viraX?: number; viraY?: number; distancia?: number; children: React.ReactNode}> = ({
  viraX = 0,
  viraY = 0,
  distancia = 1400,
  children,
}) => (
  <div style={{position: 'absolute', inset: 0, perspective: distancia}}>
    <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(${viraX}deg) rotateY(${viraY}deg)`}}>
      {children}
    </div>
  </div>
);

export const Plano: React.FC<{z?: number; viraX?: number; viraY?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  z = 0,
  viraX = 0,
  viraY = 0,
  children,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      transformStyle: 'preserve-3d',
      transform: `translateZ(${z}px) rotateX(${viraX}deg) rotateY(${viraY}deg)`,
      ...style,
    }}
  >
    {children}
  </div>
);
