import React from 'react';
import {AbsoluteFill, Audio, getStaticFiles, staticFile} from 'remotion';
import {CENAS, Props, cenaEm, fundoPalco, useT} from './tema';
import type {Fundo} from './tema';
import {CENA_COMP, CenaPessoa} from './Cenas';
import {Legenda} from './Legenda';

/** voz: a voz no render; previas: as duas prévias do próprio criador na cena das prévias (public/previa1.mp4 e previa2.mp4);
 * fundo (G6): 'real' (padrão), 'desfoque' ou 'recorte' (src/tema.ts) */
export type PropsReel = {voz: boolean; previas: boolean; fundo?: Fundo};

/** prova-print: uma cena por vez, corte seco entre modos; a legenda por cima, em até 2 lugares (palco e o resto); a voz uma vez só */
export const ProvaFerramenta01: React.FC<PropsReel> = ({voz, previas = false, fundo = 'real'}) => {
	if (fundo !== 'recorte' && CENAS.some((x) => x.modo === 'palco'))
		throw new Error("o plano tem palco (cartão de câmera com a cabeça recortada), que é opção desligada (G6): troque essas cenas por 'pessoa' em base() (src/tema.ts) ou renderize com fundo: 'recorte' (só com pedido).");
	if (fundo !== 'real' && !getStaticFiles().some((x) => x.name === 'pessoa.webm'))
		throw new Error(`fundo: '${fundo}' precisa de public/pessoa.webm: QUEM=<nome> sh ../../tools/com-trava.sh ../../.venv/Scripts/python.exe scripts/recorte.py (ou fundo: 'real', o padrão).`);
	const {t} = useT();
	const c = cenaEm(t);
	const Cena = c.modo === 'pessoa' ? CenaPessoa : CENA_COMP[c.id];
	return (
		<Props.Provider value={{previas, fundo}}>
			<AbsoluteFill style={c.modo === 'palco' ? fundoPalco : {background: '#000'}}>
				<Cena c={c} />
				<Legenda />
				{voz && <Audio src={staticFile('voz.wav')} />}
			</AbsoluteFill>
		</Props.Provider>
	);
};
