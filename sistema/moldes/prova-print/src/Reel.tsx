import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {Props, cenaEm, fundoPalco, useT} from './tema';
import {CENA_COMP} from './Cenas';
import {Legenda} from './Legenda';

/** voz: a voz no render; previas: as duas prévias do próprio criador na cena das prévias (public/previa1.mp4 e previa2.mp4) */
export type PropsReel = {voz: boolean; previas: boolean};

/** prova-print: uma cena por vez, corte seco entre modos; a legenda por cima, em até 2 lugares (palco e o resto); a voz uma vez só */
export const ProvaFerramenta01: React.FC<PropsReel> = ({voz, previas = false}) => {
	const {t} = useT();
	const c = cenaEm(t);
	const Cena = CENA_COMP[c.id];
	return (
		<Props.Provider value={{previas}}>
			<AbsoluteFill style={c.modo === 'palco' ? fundoPalco : {background: '#000'}}>
				<Cena c={c} />
				<Legenda />
				{voz && <Audio src={staticFile('voz.wav')} />}
			</AbsoluteFill>
		</Props.Provider>
	);
};
