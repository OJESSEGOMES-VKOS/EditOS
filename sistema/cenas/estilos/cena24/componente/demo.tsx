import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena24} from './Cena24';

const Demo: React.FC = () => (
  <Cena24
    manchete={['Mesma padaria', 'Site novo']}
    endereco="padariaroseira.com.br"
    antes={{
      saudacao: 'Bem-vindo à',
      nome: 'Padaria Roseira!!',
      selo: 'Pão quentinho!',
      menu: ['Início', 'Cardápio', 'Quem somos', 'Contato'],
      texto: 'Somos uma pequena padaria de família no coração do bairro. Toda manhã fazemos pães, bolos e doces fresquinhos, do jeito que fazemos desde 1987.',
      horario: 'Horário: seg. a sáb. 7h às 18h',
      semana: ['Esta semana:', 'Rosca de canela (seg.)', 'Pão de centeio (qua.)'],
      caixa: 'Encomende pelo telefone!',
      contador: '004127',
      rodape: 'Padaria Roseira. Todos os direitos reservados. Atualizado em 2009.',
    }}
    depois={{
      faixa: 'Entrega grátis acima de R$ 30',
      marca: 'Roseira',
      menu: ['Cardápio', 'Diário', 'Visite'],
      titulo: ['Pão que vale', 'levantar', 'cedo.'],
      sub: 'Fermentação lenta, assado antes do sol nascer.',
      botao: 'Encomende pra amanhã',
      selo: 'Saiu do forno às 6h02',
      produtos: [
        {nome: 'Levain', detalhe: 'Fermentação natural', preco: 'R$ 18'},
        {nome: 'Croissant', detalhe: '27 camadas', preco: 'R$ 9'},
        {nome: 'Centeio', detalhe: 'Escuro, com sementes', preco: 'R$ 16'},
      ],
    }}
    width={1080}
    height={1350}
  />
);

registerRoot(() => <Composition id="Demo" component={Demo} width={1080} height={1350} fps={30} durationInFrames={150} />);
