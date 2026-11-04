import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena12} from './Cena12';

const Root: React.FC = () => (
  <Composition id="Demo" component={Cena12} width={1080} height={1350} fps={30} durationInFrames={150} defaultProps={{width: 1080, height: 1350}} />
);
registerRoot(Root);
