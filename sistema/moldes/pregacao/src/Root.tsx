import React from 'react';
import {Composition} from 'remotion';
import {Corte, FPS, QUADROS} from './Corte';

export const Root: React.FC = () => (
	<Composition
		id="VitrinePregacao"
		component={Corte}
		durationInFrames={QUADROS}
		fps={FPS}
		width={1080}
		height={1920}
		defaultProps={{previas: false, nomesPrevias: ['interface-encenada', 'pagina-de-livro'] as [string, string], fundoCor: false, fundo: 'real' as const}}
	/>
);
