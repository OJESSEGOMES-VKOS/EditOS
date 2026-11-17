import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena15} from './Cena15';

const Root: React.FC = () => (
  <Composition id="Demo" component={Cena15} width={1080} height={1350} fps={30} durationInFrames={150} defaultProps={{
      width: 1080, height: 1350,
      jornal: 'O Mensageiro Austral',
      dataLinha: 'QUARTA, 29 DE OUTUBRO DE 2026',
      edicao: 'EDIÇÃO DE NEGÓCIOS',
      menu: ['Mundo', 'Negócios', 'Mercado', 'Tecnologia', 'Opinião', 'Trabalho'],
      menuAtivo: 1,
      secao: 'NEGÓCIOS / TRABALHO',
      manchete: ['Uma loja regional passou o', 'atendimento para a IA.', 'Depois, a margem dobrou.'],
      autor: 'Por Helena Duarte',
      autorLinha: '28 out 2026 · 7 min de leitura',
      capitular: 'Q',
      corpo: [
        [{t: 'uando a Casa Ventura passou as ligações'}],
        [{t: 'dos clientes para um atendente automático,'}],
        [{t: 'a diretoria chamou de piloto. '}, {t: 'Em setembro,', g: true}],
        [{t: 'o custo do suporte tinha caído 58% enquanto', g: true}],
        [{t: 'uma equipe de onze dava conta do dobro.', g: true}, {t: ' Os'}],
        [{t: 'documentos internos mostram que o plano foi'}],
        [{t: 'aprovado no começo do ano, muito antes de a'}],
        [{t: 'equipe saber.'}],
      ],
      postNome: 'Clara Moura',
      postArroba: '@claramoura · 2 h',
      postTexto: ['Leia o primeiro parágrafo de novo.', 'Uma equipe de onze. Essa é a', 'história toda.'],
      postNumeros: ['1,2 mil', '4,8 mil', '21 mil'],
    }} />
);
registerRoot(Root);
