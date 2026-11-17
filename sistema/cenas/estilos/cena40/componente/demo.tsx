import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena40} from './Cena40';

const Root: React.FC = () => (
  <Composition id="Demo" component={Cena40} durationInFrames={150} fps={30} width={1080} height={1350}
    defaultProps={{
      rotuloPortao: {nome: 'PORTÃO', hora: '02:14'},
      rotuloVeiculo: {nome: 'CAMINHÃO 3', hora: ''},
      rotuloDestino: {nome: 'DOCA 2', hora: '02:16'},
      width: 1080,
      height: 1350,
    }} />
);
registerRoot(Root);
