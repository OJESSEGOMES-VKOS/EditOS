import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena35} from './Cena35';

const Demo: React.FC = () => (
  <Cena35
    objetos={[
      {tipo: 'pessoa', nome: 'Pessoa', altura: '1,8 m', metros: 1.8},
      {tipo: 'onibus', nome: 'Ônibus', altura: '4 m', metros: 4.2},
      {tipo: 'casa', nome: 'Casa', altura: '10 m', metros: 10},
      {tipo: 'predio', nome: 'Prédio', altura: '60 m', metros: 60},
      {tipo: 'torre', nome: 'Torre', altura: '120 m', metros: 120},
    ]}
    width={1080}
    height={1350}
  />
);

registerRoot(() => <Composition id="Demo" component={Demo} width={1080} height={1350} fps={30} durationInFrames={150} />);
