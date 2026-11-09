import React from 'react';
import {Composition} from 'remotion';
import {VitrineAnuncioMotion01} from './Reel';
import {FPS, T} from './tema';

export const Root: React.FC = () => (
	<Composition
		id="VitrineAnuncioMotion01"
		component={VitrineAnuncioMotion01}
		durationInFrames={T.duracao_q}
		fps={FPS}
		width={1080}
		height={1920}
		defaultProps={{previas: false, nomesPrevias: ['autoridade', 'motion-ouro'] as [string, string], musica: false, efeitos: false}}
	/>
);
