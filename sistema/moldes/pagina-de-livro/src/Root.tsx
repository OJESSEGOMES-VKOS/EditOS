import React from 'react';
import {Composition} from 'remotion';
import {DURACAO, FPS, VitrineStoryPodcast01} from './Reel';

export const Root: React.FC = () => (
	<Composition
		id="VitrineStoryPodcast01"
		component={VitrineStoryPodcast01}
		durationInFrames={Math.round(DURACAO * FPS)}
		fps={FPS}
		width={1080}
		height={1920}
		defaultProps={{previas: false, nomesPrevias: ['interface-encenada', 'rosto-telas'] as [string, string], musica: false, efeitoFundo: false, fundo: 'real' as const, pb: false}}
	/>
);
