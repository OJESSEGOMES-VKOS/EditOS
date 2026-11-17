import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena36} from './Cena36';

const Demo: React.FC = () => <Cena36 meta={100000} inicio={72000} palavra="SEGUIDORES" width={1080} height={1350} />;

registerRoot(() => <Composition id="Demo" component={Demo} width={1080} height={1350} fps={30} durationInFrames={150} />);
