import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena39} from './Cena39';

const Root: React.FC = () => (
  <Composition id="Demo" component={Cena39} durationInFrames={150} fps={30} width={1080} height={1350}
    defaultProps={{rotuloQuadro: 'VENDAS', legenda: 'SEMANA 2', width: 1080, height: 1350}} />
);
registerRoot(Root);
