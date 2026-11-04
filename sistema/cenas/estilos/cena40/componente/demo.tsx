import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena40} from './Cena40';

const Root: React.FC = () => (
  <Composition id="Demo" component={Cena40} durationInFrames={150} fps={30} width={1080} height={1350}
    defaultProps={{ width: 1080, height: 1350}} />
);
registerRoot(Root);
