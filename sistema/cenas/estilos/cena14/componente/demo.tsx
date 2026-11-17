import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena14} from './Cena14';

// a curva da demo (ilustração do tema da demo, não dado real)
const pontos = Array.from({length: 40}, (_, i) => {
  const x = i / 39;
  return 1 - (0.15 + 0.62 * (1 - Math.exp(-x * 9)) + Math.sin(x * 26) * 0.02);
});

const Root: React.FC = () => (
  <Composition id="Demo" component={Cena14} width={1080} height={1350} fps={30} durationInFrames={150} defaultProps={{
      width: 1080, height: 1350,
      figura: 'FIG. 2 · RETENÇÃO, PRIMEIROS 30 SEGUNDOS',
      tituloGrafico: ['A maioria decide nos', 'três primeiros segundos'],
      pontos,
      eixo: {topo: '100%', inicio: '0 s', fim: '30 s'},
      citacaoRotulo: 'DAS ANOTAÇÕES · P. 14',
      citacao: [
        [{t: 'Nos últimos vídeos, a maior'}],
        [{t: 'queda veio sempre cedo.'}],
        [{t: 'Quem passou do terceiro segundo', g: true}],
        [{t: 'quase sempre ficou até o fim.', g: true}],
        [{t: 'Depois disso, a linha ficou reta.'}],
      ],
      etiqueta: 'O GANCHO',
      nota: 'SAEM AQUI',
    }} />
);
registerRoot(Root);
