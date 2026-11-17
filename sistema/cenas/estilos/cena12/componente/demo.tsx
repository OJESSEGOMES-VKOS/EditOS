import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena12} from './Cena12';

const Root: React.FC = () => (
  <Composition id="Demo" component={Cena12} width={1080} height={1350} fps={30} durationInFrames={150} defaultProps={{
      width: 1080, height: 1350,
      partes: [
        {nome: 'Teclas', spec: 'PBT · 1u × 21'},
        {nome: 'Chaves', spec: 'lineares · encaixe'},
        {nome: 'Placa', spec: 'alumínio de 1,5 mm'},
        {nome: 'Placa de circuito', spec: 'um chip, 21 teclas'},
        {nome: 'Colunas', spec: 'latão · M2 × 4'},
        {nome: 'Caixa', spec: 'bandeja com junta'},
      ],
      titulo: '21 teclas, aberto',
      specTitulo: 'VISTA EXPLODIDA · 6 CAMADAS · PASSO DE 19,05 MM',
    }} />
);
registerRoot(Root);
