import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {AppleOneTake} from './AppleOneTake';

const Root: React.FC = () => (
  <Composition id="Demo" component={AppleOneTake} durationInFrames={150} fps={30} width={1080} height={1350} defaultProps={{}} />
);
registerRoot(Root);
