import React from 'react';
import {Composition} from 'remotion';
import {Explicativo, Props} from './Explicativo';

export const Root: React.FC = () => (
	<Composition
		id="Explicativo"
		component={Explicativo}
		width={1080}
		height={1920}
		fps={30}
		durationInFrames={30}
		defaultProps={{} as Props}
		calculateMetadata={({props}) => {
			if (!props.duracao) throw new Error('Sem props: rode ferramentas/montar.py e passe --props=<pasta>/props.json --public-dir=<pasta>/public');
			return {durationInFrames: Math.ceil(props.duracao * props.fps), fps: props.fps};
		}}
	/>
);
