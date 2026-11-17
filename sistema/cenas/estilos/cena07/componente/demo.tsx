import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {BlueEditorialDemo} from './demo-coreografia';

const Root: React.FC = () => (
  <Composition id="Demo" component={BlueEditorialDemo} durationInFrames={150} fps={30} width={1080} height={1350} defaultProps={{partes: ['cada', 'quadro', 'conta', 'uma', 'ideia']}} />
);
registerRoot(Root);
