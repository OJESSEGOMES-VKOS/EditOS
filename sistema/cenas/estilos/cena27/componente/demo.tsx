import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena27} from './Cena27';

// abril de 2026 começa numa quarta-feira (coluna 3) e tem 30 dias
const Demo: React.FC = () => (
  <Cena27 rotulo="POSTANDO TODO DIA" palavra="DIA" mes="ABRIL" dias={30} inicioSemana={3} width={1080} height={1350} />
);

registerRoot(() => <Composition id="Demo" component={Demo} width={1080} height={1350} fps={30} durationInFrames={150} />);
