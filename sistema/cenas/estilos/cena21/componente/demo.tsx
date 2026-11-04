import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena21} from './Cena21';

const Demo: React.FC = () => (
  <Cena21
    produto="Semanário"
    linha="Lança na segunda"
    marca="Semanário"
    menu={['Produto', 'Preços', 'Equipes', 'Blog']}
    titulo={['Sua semana,', 'planejada em minutos.']}
    subtitulo="Arraste as tarefas para a semana. O Semanário faz o resto."
    botao="Começar grátis"
    width={1080}
    height={1350}
  />
);

registerRoot(() => <Composition id="Demo" component={Demo} width={1080} height={1350} fps={30} durationInFrames={150} />);
