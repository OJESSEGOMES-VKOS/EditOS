import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena20} from './Cena20';

const Demo: React.FC = () => (
  <Cena20
    rotulo="PEDIDOS ENVIADOS"
    unidade="países"
    valorInicial={9}
    valores={[12, 15, 17, 21, 25, 29, 33, 35, 38]}
    origem={{nome: 'Lisboa', lon: -9.1, lat: 38.7}}
    destinos={[
      {lon: 3.4, lat: 6.5},
      {nome: 'Luanda', lon: 13.2, lat: -8.8},
      {lon: 31.2, lat: 30.0},
      {lon: 36.8, lat: -1.3},
      {lon: 28.0, lat: -26.2},
      {lon: 55.3, lat: 25.2},
      {lon: 72.9, lat: 19.1},
      {lon: 116.4, lat: 39.9},
      {nome: 'Singapura', lon: 103.8, lat: 1.35},
    ]}
    width={1080}
    height={1350}
  />
);

registerRoot(() => <Composition id="Demo" component={Demo} width={1080} height={1350} fps={30} durationInFrames={150} />);
