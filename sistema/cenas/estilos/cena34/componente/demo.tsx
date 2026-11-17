import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena34} from './Cena34';

const Demo: React.FC = () => (
  <Cena34
    mensagens={[
      {texto: 'viu os números??', minha: false},
      {texto: 'não, o que houve', minha: true},
      {texto: 'bateu 1 milhão', minha: false, chave: true},
      {texto: 'da noite pro dia', minha: false},
      {texto: 'não acredito', minha: true},
    ]}
    width={1080}
    height={1350}
  />
);

registerRoot(() => <Composition id="Demo" component={Demo} width={1080} height={1350} fps={30} durationInFrames={150} />);
