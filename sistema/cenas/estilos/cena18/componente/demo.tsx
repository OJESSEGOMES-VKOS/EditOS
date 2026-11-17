import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena18} from './Cena18';

const Root: React.FC = () => (
  <Composition id="Demo" component={Cena18} width={1080} height={1350} fps={30} durationInFrames={150} defaultProps={{
      width: 1080,
      height: 1350,
      projeto: 'Resumo do fim de semana v3',
      status: 'Salvo · 9:16 · 00:42',
      pessoas: ['MK', 'JR', '+2'],
      rotuloQualidade: 'Qualidade',
      compartilhar: 'Compartilhar',
      dialogo: 'Exportar',
      abas: ['Vídeo', 'GIF', 'Áudio'],
      campos: [['Formato', 'MP4 · H.264'], ['Resolução', '1080 × 1920'], ['Quadros', '30 fps']],
      qualidade: 'Alta',
      tamanhoRotulo: 'Tamanho estimado',
      tamanho: '148 MB · 0:42',
      cancelar: 'Cancelar',
      botao: 'Exportar',
      passoNumero: '3',
      passoTexto: 'Clique em Exportar',
      legendaPrevia: 'dia um.',
    }} />
);
registerRoot(Root);
