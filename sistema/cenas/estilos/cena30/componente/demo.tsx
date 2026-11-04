import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena30} from './Cena30';

const Demo: React.FC = () => <Cena30 width={1080} height={1350} />;

registerRoot(() => <Composition id="Demo" component={Demo} width={1080} height={1350} fps={30} durationInFrames={150} />);
