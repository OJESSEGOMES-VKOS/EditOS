import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena44} from './Cena44';

const Root: React.FC = () => (
  <Composition id="Demo" component={Cena44} durationInFrames={150} fps={30} width={1080} height={1350}
    defaultProps={{rotulo: 'PRAZO', horaAntes: ['21', '59'], horaDepois: ['22', '00'], width: 1080, height: 1350}} />
);
registerRoot(Root);
