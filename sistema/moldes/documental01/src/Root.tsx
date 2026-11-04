import React from 'react';
import {Composition} from 'remotion';
import {DURACAO, Documental01, FPS} from './Reel';

export const Root: React.FC = () => (
	<Composition id="Documental01" component={Documental01} durationInFrames={Math.round(DURACAO * FPS)} fps={FPS} width={1080} height={1920} />
);
