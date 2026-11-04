import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena38} from './Cena38';

const Root: React.FC = () => (
  <Composition id="Demo" component={Cena38} durationInFrames={150} fps={30} width={1080} height={1350}
    defaultProps={{rotulo: 'Núcleo da IA', width: 1080, height: 1350}} />
);
registerRoot(Root);
