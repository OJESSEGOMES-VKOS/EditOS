import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena19} from './Cena19';

const Root: React.FC = () => (
  <Composition id="Demo" component={Cena19} width={1080} height={1350} fps={30} durationInFrames={150} defaultProps={{
      width: 1080,
      height: 1350,
      kicker: 'ATELIÊ NORTE · 2016 ATÉ HOJE',
      titulo: 'De uma garagem a ',
      tituloAzul: '31 países',
      anoInicial: 2016,
      anoFinal: 2025,
      pontos: [
        {ano: 2016, titulo: 'Uma luminária na garagem', linha: 'Protótipo feito com sobras de carvalho.', icone: 'luminaria'},
        {ano: 2018, titulo: 'Primeiros 500 pedidos', linha: 'Pré-venda esgotada em nove dias.', icone: 'caixa'},
        {ano: 2021, titulo: 'A luminária Arco vai ao mundo', linha: 'Agora com envio para 31 países.', icone: 'arco'},
        {ano: 2024, titulo: 'Abre o estúdio novo', linha: '48 pessoas, uma mesa longa.', icone: 'mesa'},
      ],
    }} />
);
registerRoot(Root);
