import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena25} from './Cena25';

// números ilustrativos de demonstração, não são dado real
const Demo: React.FC = () => (
  <Cena25
    titulo={['De onde vêm os', 'novos clientes']}
    subtitulo="Fatia dos cadastros, 2021 a 2026"
    categorias={['Busca', 'Social', 'E-mail', 'Indicação', 'Vídeo', 'Podcast']}
    heroi={4}
    anos={[2021, 2022, 2023, 2024, 2025, 2026]}
    valores={[
      [34, 22, 18, 12, 8, 6],
      [32, 22, 16, 11, 13, 6],
      [30, 21, 14, 11, 17, 7],
      [25, 21, 13, 11, 23, 7],
      [22, 21, 12, 11, 27, 7],
      [18, 20, 11, 12, 31, 8],
    ]}
    legendaInicial={['começa', 'em 5º lugar']}
    legendaFinal={['Quase 1 em 3', 'novos cadastros']}
    width={1080}
    height={1350}
  />
);

registerRoot(() => <Composition id="Demo" component={Demo} width={1080} height={1350} fps={30} durationInFrames={150} />);
