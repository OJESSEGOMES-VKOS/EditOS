import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {FrostedGlass} from './FrostedGlass';

const Root: React.FC = () => (
  <Composition id="Demo" component={FrostedGlass} durationInFrames={150} fps={30} width={1080} height={1350} defaultProps={{
      placeholder: 'Pesquise ou pergunte qualquer coisa',
      busca: 'meus vídeos com cara premium',
      linhas: [
        {titulo: 'Cor de cinema', rotulo: 'Cor', icone: 'cor'},
        {titulo: 'Câmera lenta e suave', rotulo: 'Câmera', icone: 'camera'},
        {titulo: 'Títulos limpos e mínimos', rotulo: 'Tipografia', icone: 'texto'},
      ],
      escolhida: 1,
    }} />
);
registerRoot(Root);
