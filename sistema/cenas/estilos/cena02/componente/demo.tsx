import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {FrostedGlass} from './FrostedGlass';

const Root: React.FC = () => (
  <Composition id="Demo" component={FrostedGlass} durationInFrames={150} fps={30} width={1080} height={1350} defaultProps={{}} />
);
registerRoot(Root);
