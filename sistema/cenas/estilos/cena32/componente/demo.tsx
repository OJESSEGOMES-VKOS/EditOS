import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena32} from './Cena32';

const Demo: React.FC = () => (
  <Cena32
    loja="ESTÚDIO ALVO"
    data="03 NOV 2026   14:22"
    itens={[
      {nome: 'Câmera', valor: 'R$ 2.400'},
      {nome: 'Lente', valor: 'R$ 1.200'},
      {nome: 'Luzes', valor: 'R$ 680'},
      {nome: 'Microfone', valor: 'R$ 250'},
    ]}
    total="R$ 4.530"
    width={1080}
    height={1350}
  />
);

registerRoot(() => <Composition id="Demo" component={Demo} width={1080} height={1350} fps={30} durationInFrames={150} />);
