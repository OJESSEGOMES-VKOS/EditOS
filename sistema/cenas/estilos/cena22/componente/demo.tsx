import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena22} from './Cena22';

const Demo: React.FC = () => (
  <Cena22
    titulo="Como o pedido chega até você"
    etapas={[
      {nome: 'Pedido', tempo: '2 min'},
      {nome: 'Embala', tempo: '1 h'},
      {nome: 'Entrega', tempo: 'Dia seguinte'},
    ]}
    width={1080}
    height={1350}
  />
);

registerRoot(() => <Composition id="Demo" component={Demo} width={1080} height={1350} fps={30} durationInFrames={150} />);
