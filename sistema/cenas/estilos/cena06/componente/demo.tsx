import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MagazineNote} from './MagazineNote';

const Root: React.FC = () => (
  <Composition id="Demo" component={MagazineNote} durationInFrames={150} fps={30} width={1080} height={1350} defaultProps={{}} />
);
registerRoot(Root);
