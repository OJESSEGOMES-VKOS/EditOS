import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena18} from './Cena18';

const Root: React.FC = () => (
  <Composition id="Demo" component={Cena18} width={1080} height={1350} fps={30} durationInFrames={150} defaultProps={{width: 1080, height: 1350}} />
);
registerRoot(Root);
