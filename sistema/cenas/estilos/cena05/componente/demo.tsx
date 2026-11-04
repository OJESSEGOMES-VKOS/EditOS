import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Oscilloscope} from './Oscilloscope';

const Root: React.FC = () => (
  <Composition id="Demo" component={Oscilloscope} durationInFrames={150} fps={30} width={1080} height={1350} defaultProps={{}} />
);
registerRoot(Root);
