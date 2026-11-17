import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena43} from './Cena43';

const Root: React.FC = () => (
  <Composition id="Demo" component={Cena43} durationInFrames={150} fps={30} width={1080} height={1350}
    defaultProps={{anoInicial: 972280615, anoFinal: 1000000000, rotuloAno: 'Ano', frase: 'Um buraco negro errante alcança a estrela', width: 1080, height: 1350}} />
);
registerRoot(Root);
