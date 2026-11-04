import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {GlowOrb} from './GlowOrb';

const Root: React.FC = () => (
  <Composition id="Demo" component={GlowOrb} durationInFrames={150} fps={30} width={1080} height={1350} defaultProps={{frase: 'Esteja presente.'}} />
);
registerRoot(Root);
