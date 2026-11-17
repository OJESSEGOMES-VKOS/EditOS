// O kit da tela nova do anuncio-neon: as peças da casa para desenhar, no jeito do modelo, a tela que a fala nova pede e o
// aprovado não tem. Uma tela nova mora em src/telas/<Nome>.tsx da pasta do vídeo, é registrada em src/telas/index.ts e
// entra no plano (scripts/plano.py) como livre(comp='<Nome>', ...). O texto não é da tela: ele vem dos blocos do plano
// (a legenda em y 1170). O objeto mora no Palco (y 250 a 1080, centro em x 500). Toda cor vem de C (src/tema.ts), que
// é a cor do anúncio: nunca escreva um hex de marca numa tela nova (o vermelho C.vermelho é só para o ruim).
import React from 'react';
import {mola, useT} from './tema';

export {C, CX, E, FPS, SANS, cena, marca, mola, rnd, tw, txt, useT} from './tema';
export {Aneis, Ecg, Fundo, G, Glitch, IconeVidro, MarcaTexto, Particulas, Risco, ab, brilho, brilhoCaixa, hexA} from './ui';
export {GL, Placa, Telinha, pop} from './cenas';

/** a cena do plano que toda tela nova recebe (em segundos) */
export type CenaNova = {id: string; de: number; ate: number; fundo: string};
export type TelaNova = React.FC<{c: CenaNova}>;

/** a zona do objeto (y 250 a 1080; centro em x 500, o meio da zona segura): dentro dele, (0, 0) é o canto de cima à
 * esquerda e o centro do objeto é (500, 415). O objeto flutua de leve e cresce um pouco: nada fica parado. */
export const Palco: React.FC<{c: CenaNova; children: React.ReactNode}> = ({c, children}) => {
	const {t} = useT();
	const p = (t - c.de) / Math.max(0.5, c.ate - c.de);
	return <div style={{position: 'absolute', left: 0, top: 250, width: 1080, height: 830, transformOrigin: '500px 415px', transform: `translateY(${Math.sin(t * 1.4) * 8}px) scale(${1 + 0.03 * p})`}}>{children}</div>;
};

/** um objeto que entra com mola (escala 0,55 → 1, do desfoque) na palavra `de` (segundos), a entrada da casa */
export const Entra: React.FC<{de: number; children: React.ReactNode; style?: React.CSSProperties}> = ({de, children, style}) => {
	const {t} = useT();
	if (t < de - 0.05) return null;
	const k = mola(t, de - 0.05, {damping: 13, stiffness: 190});
	return <div style={{position: 'absolute', inset: 0, opacity: Math.min(1, k * 2), transform: `scale(${0.55 + 0.45 * k})`, filter: k < 0.6 ? `blur(${(0.6 - k) * 20}px)` : undefined, ...style}}>{children}</div>;
};

/** pulso que decai depois do segundo `de` (para acender na palavra) */
export const pulso = (t: number, de: number, meia = 0.2) => (t >= de ? Math.exp(-(t - de) / meia) : 0);
