import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena26} from './Cena26';

// pessoa, empresa, rede e números inventados para a demonstração
const Demo: React.FC = () => (
  <Cena26
    contexto={['Postado na terça.', 'Apagado na quinta.']}
    iniciais="DV"
    nome="Diana Valente"
    arroba="@dianavalente"
    cargo="CEO, Nortelo"
    textoAntes="Trocamos 40% do nosso suporte por agentes de IA."
    fraseChave="Ninguém vai notar."
    hora="9:14 · 12 mar."
    numeros={{respostas: 2400, reposts: 9600, curtidas: 83900, views: 12400000}}
    respostas={[
      {iniciais: 'PR', nome: 'Paula Ramos', arroba: '@paularamos', texto: 'Os clientes notaram.', curtidas: 6200, cor: '#1F7A72'},
      {iniciais: 'ME', nome: 'Mário Elias', arroba: '@marioelias', texto: 'Dia 1 tentando falar com um humano na Nortelo.', curtidas: 21400, cor: '#4A5568'},
    ]}
    width={1080}
    height={1350}
  />
);

registerRoot(() => <Composition id="Demo" component={Demo} width={1080} height={1350} fps={30} durationInFrames={150} />);
