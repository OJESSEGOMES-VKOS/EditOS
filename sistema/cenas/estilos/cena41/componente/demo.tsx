import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena41} from './Cena41';

const Root: React.FC = () => (
  <Composition id="Demo" component={Cena41} durationInFrames={150} fps={30} width={1080} height={1350}
    defaultProps={{
      origem: 'VALE',
      destino: 'PORTO',
      cartaoTitulo: 'TERRA DO SUL',
      cartaoData: 'ANO 300',
      width: 1080,
      height: 1350,
    }} />
);
registerRoot(Root);
