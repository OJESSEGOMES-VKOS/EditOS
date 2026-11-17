import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena37} from './Cena37';

const Demo: React.FC = () => (
  <Cena37
    titulo="Para onde vão R$ 100"
    contexto="Exemplo: uma cafeteria de bairro"
    prefixo="R$"
    rotuloCentro="das vendas"
    fatias={[
      {nome: 'Café e comida', valor: 31},
      {nome: 'Equipe', valor: 28},
      {nome: 'Aluguel', valor: 14},
      {nome: 'Taxas e outros', valor: 9},
      {nome: 'Marketing', valor: 8},
      {nome: 'Lucro', valor: 10},
    ]}
    width={1080}
    height={1350}
  />
);

registerRoot(() => <Composition id="Demo" component={Demo} width={1080} height={1350} fps={30} durationInFrames={150} />);
