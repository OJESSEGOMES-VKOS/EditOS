import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {AppleOneTake} from './AppleOneTake';

const Root: React.FC = () => (
  <Composition id="Demo" component={AppleOneTake} durationInFrames={150} fps={30} width={1080} height={1350} defaultProps={{
      botao: 'Gravar',
      rotuloCartao: 'Gravando',
      tituloApp: 'Take 1',
      subtituloApp: 'sem cortes · agora',
      acoes: ['Clipe', 'Cortar', 'Enviar'],
      acaoFinal: 'Salvar take',
      rotuloQuadro: '4K · 0:04',
      frase: 'Outro take',
    }} />
);
registerRoot(Root);
