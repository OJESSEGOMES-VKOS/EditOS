/* O kit da casa do vetor-minimo (vetor-minimo.md §4, .claude/skills/vetor-minimo): o que serve a qualquer fala.
 * O objeto que o personagem segura (a tela 9:16 da casa, em src/Reel.tsx, ou um objeto novo em src/telas/<Nome>.tsx)
 * desenha só com isto: a paleta do modelo, as curvas e o estado do objeto. Assim o objeto novo nasce com a cara do modelo:
 * cinza cru antes da ação, branco giz aceso depois dela, verde só na virada (ou na ação do "você"), apagado no "apenas um". */
import React from 'react';

/* identidade do modelo (vetor-minimo.md §4) */
export const COR = {giz: '#FCFCFC', c1: '#2C2C2C', c2: '#363636', c3: '#6A6A6A', c4: '#9B9B9B', verde: '#00FB10', verdeLuz: '#88FF8C', verdeEscuro: '#2F6B33', vermelho: '#FD0000', azul: '#08A1DF', azulLuz: '#37CAFB'};

export const c01 = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** sobe suave de 0 a 1 entre a e b */
export const suave = (t: number, a: number, b: number) => {
	const x = c01((t - a) / (b - a));
	return x * x * (3 - 2 * x);
};
/** chega rápido e freia (k = potência) */
export const saida = (x: number, k = 3) => 1 - Math.pow(1 - c01(x), k);
export const vaiVem = (x: number) => {
	const v = c01(x);
	return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
};
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
/** mistura duas cores #RRGGBB (k de 0 a 1) */
export const mistura = (a: string, b: string, k: number) => {
	const A = hex(a);
	const B = hex(b);
	return '#' + A.map((v, i) => Math.round(lerp(v, B[i], c01(k))).toString(16).padStart(2, '0')).join('');
};
export const DEG = Math.PI / 180;

/** o estado do objeto que o personagem segura, no tempo t:
 *  varre: o progresso da ação (0 antes, 1 depois; a ação dura 0,28 s, a varredura da casa)
 *  verde: 1 depois da virada (ou na ação do "você"); apaga: 1 quando outro é "o escolhido" (apenasUm)
 *  i: o índice da chegada (para variar sem sortear: random(`x${i}`)) */
export type EstadoTela = {m: number; varre: number; verde: number; apaga: number; t: number; i: number};
/** o que todo objeto recebe: um id único (para os clipPath do SVG) e o estado */
export type ObjetoProps = {id: string; e: EstadoTela};

/** as cores do objeto no estado dele: borda/linha, o aceso (texto, traço) e o cinza de fundo. Antes da ação: cinza cru;
 * depois: giz; na virada: verde; apagado: cinza */
export const coresDe = (e: EstadoTela) => ({
	borda: e.varre <= 0 ? '#555555' : mistura(mistura(COR.giz, COR.verde, e.verde), COR.c3, e.apaga),
	aceso: mistura(mistura(COR.giz, COR.verdeLuz, e.verde), COR.c3, e.apaga),
	fundo: mistura(mistura(COR.c3, COR.verdeEscuro, e.verde), COR.c2, e.apaga),
	cru: COR.c2,
	brilho: e.varre > 0 ? (e.verde > 0 ? 0.95 : 0.4 * (1 - e.apaga)) : 0,
});

/** a linha de luz que varre o objeto de cima a baixo na ação (y0 e y1 em coordenadas do objeto) */
export const Varredura: React.FC<{e: EstadoTela; largura: number; y0: number; y1: number}> = ({e, largura, y0, y1}) => {
	if (e.varre <= 0 || e.varre >= 1) return null;
	const y = lerp(y0, y1, e.varre);
	return (
		<g>
			<rect x={-largura / 2 - 6} y={y - 3} width={largura + 12} height={6} rx={3} fill={e.verde > 0 ? COR.verde : COR.giz} filter="url(#b6)" />
			<rect x={-largura / 2 - 2} y={y - 1.5} width={largura + 4} height={3} rx={1.5} fill={e.verde > 0 ? COR.verdeLuz : COR.giz} />
		</g>
	);
};

/** o palco do objeto: o objeto se desenha centrado em (0,0), acima da cabeça, dentro de uma caixa de até 140 x 190
 * (de 7 a 21% da largura, com muito vazio em volta). Os filtros b6 e b10 (desfoque para brilho) já existem no SVG. */
export const PALCO = {largura: 140, altura: 190};
