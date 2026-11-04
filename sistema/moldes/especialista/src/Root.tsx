import React from 'react';
import {Composition} from 'remotion';
import {DURACAO, FPS, Renomado01} from './Reel';

export const Root: React.FC = () => (
	<Composition id="Renomado01" component={Renomado01} durationInFrames={Math.round(DURACAO * FPS)} fps={FPS} width={1080} height={1920} defaultProps={{pb: true}} />
);
