import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena11} from './Cena11';

const Root: React.FC = () => (
  <Composition id="Demo" component={Cena11} width={1080} height={1350} fps={30} durationInFrames={150} defaultProps={{
      width: 1080, height: 1350,
      destino: 'O Estúdio',
      lugares: [
        {nome: 'Cidade Velha', x: 950, y: 690},
        {nome: 'Estação Central', x: 1430, y: 1330},
        {nome: 'Parque da Ribeira', x: 1330, y: 1700},
      ],
      minutosInicio: 14, minutos: 12, distancia: '4,2 km', rotaTexto: 'Rota mais rápida', botao: 'Ir',
    }} />
);
registerRoot(Root);
