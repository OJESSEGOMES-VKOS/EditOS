import React from 'react';
import {Composition} from 'remotion';
import {ProvaFerramenta01} from './Reel';
import {TesteCapitulo} from './TesteCapitulo';
import {DURACAO, FPS} from './tema';

export const Root: React.FC = () => (
	<Composition
		id="ProvaFerramenta01"
		component={ProvaFerramenta01}
		durationInFrames={Math.round(DURACAO * FPS)}
		fps={FPS}
		width={1080}
		height={1920}
		defaultProps={{voz: true, previas: false}}
	/>
);
/** prova do componente de capítulo (a fala da vitrine não enumera): só still de conferência, nunca vai para vídeo */
export const RootCompleto: React.FC = () => (
	<>
		<Root />
		<Composition id="TesteCapitulo" component={TesteCapitulo} durationInFrames={90} fps={FPS} width={1080} height={1920} />
	</>
);
