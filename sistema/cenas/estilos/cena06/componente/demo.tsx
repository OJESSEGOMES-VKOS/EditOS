import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MagazineNote} from './MagazineNote';

const Root: React.FC = () => (
  <Composition id="Demo" component={MagazineNote} durationInFrames={150} fps={30} width={1080} height={1350} defaultProps={{
      titulo: ['Notas sobre', 'a luz lenta.'],
      numero: '(03)',
      corpo: ['Algumas tardes o mar', 'fica quieto antes do', 'céu. A gente ficou', 'até a cor ir embora', 'e guardou os últimos', 'dez minutos pra nós.'],
      legenda: 'Prancha 4. O mar, um minuto depois.',
      nota: ['leia isto', 'duas vezes.'],
    }} />
);
registerRoot(Root);
