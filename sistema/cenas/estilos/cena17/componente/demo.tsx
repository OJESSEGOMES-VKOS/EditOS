import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena17} from './Cena17';

const Root: React.FC = () => (
  <Composition id="Demo" component={Cena17} width={1080} height={1350} fps={30} durationInFrames={150} defaultProps={{
      width: 1080,
      height: 1350,
      hora: '8:30',
      saudacao: 'Bom dia',
      nome: 'Marina Alves',
      moeda: 'R$',
      abas: ['1S', '1M', '3M', '1A', 'Tudo'],
      tituloLista: 'Atividade recente',
      verTudo: 'Ver tudo',
      rotuloSaldo: 'Saldo total',
      saldoInicial: 19679.14,
      saldoFinal: 24860.42,
      delta: '+ 6,2%',
      deltaLinha: '+R$ 1.240 em 30 dias',
      linhas: [
        {nome: 'Estúdio Norte', sub: 'Salário · Hoje', valor: '+R$ 4.200,00', positivo: true},
        {nome: 'Mercado Verde', sub: 'Mercado · Ontem', valor: '−R$ 86,40'},
        {nome: 'Aluguel', sub: 'Moradia · 27 out', valor: '−R$ 1.850,00'},
      ],
      notifTitulo: 'Pagamento recebido',
      notifTexto: ['R$ 4.200 chegaram do Estúdio Norte.', 'R$ 420 foram para a reserva.'],
      statRotulo: 'Guardado no mês',
      statValor: 'R$ 1.240',
      statDelta: '+18% vs set',
      metaTitulo: 'Viagem a Lisboa',
      metaTexto: 'R$ 4.100 de R$ 5.000',
      metaPct: 82,
    }} />
);
registerRoot(Root);
