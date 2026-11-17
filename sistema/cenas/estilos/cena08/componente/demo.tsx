import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Risograph} from './Risograph';

const Root: React.FC = () => (
  <Composition id="Demo" component={Risograph} durationInFrames={150} fps={30} width={1080} height={1350} defaultProps={{palavra1: 'TINTA', palavra2: 'EM', palavra3: 'MOVIMENTO'}} />
);
registerRoot(Root);
