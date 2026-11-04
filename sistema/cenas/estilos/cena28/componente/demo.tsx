import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena28} from './Cena28';

// números ilustrativos de demonstração
const Demo: React.FC = () => (
  <Cena28
    nomeA="ALUGAR"
    nomeB="COMPRAR"
    subtitulo="Em 10 anos, mesma cidade"
    linhas={[
      {rotulo: 'CUSTO POR MÊS', a: 2100, b: 2850, vence: 'a'},
      {rotulo: 'DINHEIRO NA ENTRADA', a: 4200, b: 68000, vence: 'a'},
      {rotulo: 'MUDAR QUANDO QUISER', a: 'Sim', b: 'Não', vence: 'a'},
      {rotulo: 'PATRIMÔNIO EM 10 ANOS', a: 0, b: 214000, vence: 'b'},
    ]}
    width={1080}
    height={1350}
  />
);

registerRoot(() => <Composition id="Demo" component={Demo} width={1080} height={1350} fps={30} durationInFrames={150} />);
