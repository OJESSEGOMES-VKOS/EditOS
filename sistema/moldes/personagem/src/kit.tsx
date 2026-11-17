import React from 'react';
import type {Pose} from './Boneco';
import {ALT_PE, EM_PE} from './Poses';
import {C, FPS} from './base';
import {Facho, Parede} from './Cenarios';

/**
 * O kit da cena livre do personagem: tudo o que uma cena nova precisa, num lugar só (personagem.md §4 e §9).
 * Uma cena nova mora em src/telas/<Nome>.tsx DA PASTA DO VÍDEO e desenha com estas peças, no jeito da casa:
 * fundo preto, parede com chão em linha (CHAO), luz dourada de cima (Luz), poeira no facho, o feijão creme (Boneco),
 * verde neon SÓ no objeto-chave da frase, vermelho só no risco da chamada. Câmera parada: o movimento é um pequeno
 * acontecimento preso a uma palavra (marca('nome') do plano).
 */
export type P = {f: number};
export const CHAO = 1140;
export const sec = (f: number) => f / FPS;
/** o personagem em pé no chão, em x, na escala s (1 = o tamanho da casa); extra muda braços, olhos, boca, olhar */
export const emPe = (x: number, s: number, extra: Partial<Pose> = {}): Pose => ({...EM_PE, x, y: CHAO - ALT_PE * s, s, ...extra}) as Pose;

/** a parede com o chão em linha (o cenário de quase toda cena) */
export const Fundo: React.FC<{id: string; topo?: string}> = ({id, topo = '#121318'}) => (
	<>
		<Parede chao={CHAO} id={id} topo={topo} base="#09090b" />
		<rect x={0} y={CHAO + 2} width={1080} height={1920 - CHAO} fill="#060607" />
	</>
);
/** o foco de luz dourada que desce do alto até o chão */
export const Luz: React.FC<{cx: number; w0?: number; w1?: number; base?: number; op?: number; id: string; cor?: string}> = ({cx, w0 = 90, w1 = 520, base = CHAO, op = 1, id, cor = C.ouroClaro}) => (
	<Facho cx={cx} topo={-20} base={base} w0={w0} w1={w1} op={op} cor={cor} id={id} />
);

export {Boneco, anima, mix} from './Boneco';
export type {Pose} from './Boneco';
export {ALT_PE, EM_PE, SENTADO, andar} from './Poses';
export {C, E, NEON_OURO, NEON_VERDE, lerp, marca, tw} from './base';
export {Cama, Coberta, CriadoMudo, Janela, Luminaria, Mesa, Notebook, Poeira, Svg, Travesseiro} from './Cenarios';
export {Avanco, Cadeira, Cartao, Icone} from './Objetos';
