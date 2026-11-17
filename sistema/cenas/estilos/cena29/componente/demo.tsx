import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena29} from './Cena29';

const Demo: React.FC = () => (
  <Cena29
    nome="Eco Um"
    chamadas={[
      {valor: 'IP67', legenda: 'À PROVA D’ÁGUA', lado: 'esq', y: -280},
      {valor: '360°', legenda: 'SOM', lado: 'dir', y: -190},
      {valor: '40 h', legenda: 'BATERIA', lado: 'esq', y: -60},
      {valor: '480 g', legenda: 'PESO', lado: 'dir', y: 80},
    ]}
    width={1080}
    height={1350}
  />
);

registerRoot(() => <Composition id="Demo" component={Demo} width={1080} height={1350} fps={30} durationInFrames={150} />);
