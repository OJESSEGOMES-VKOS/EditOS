import React from 'react';
import {Composition} from 'remotion';
import {DURACAO, FPS, VitrineSuperDopamina01} from './Reel';

// paleta "" = a do plano (src/plano.json) ou a padrão do modelo; cores = cores soltas por cima da paleta
export const Root: React.FC = () => (
	<Composition
		id="VitrineSuperDopamina01"
		component={VitrineSuperDopamina01}
		durationInFrames={Math.round(DURACAO * FPS)}
		fps={FPS}
		width={1080}
		height={1920}
		defaultProps={{paleta: '', cores: {}}}
	/>
);
