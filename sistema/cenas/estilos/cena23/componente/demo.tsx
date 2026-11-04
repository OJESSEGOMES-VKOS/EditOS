import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena23} from './Cena23';

const Demo: React.FC = () => (
  <Cena23
    data="Sexta, 14 de março"
    hora="9:41"
    app="Vitrine"
    hoje="Hoje"
    rotuloPedidos="pedidos"
    agora="agora"
    linhaPedido="Novo pedido"
    moeda="R$"
    totalInicial={4212}
    contagemInicial={39}
    pedidos={[
      {valor: 129, itens: 2}, {valor: 64, itens: 1}, {valor: 212, itens: 3}, {valor: 38, itens: 1},
      {valor: 186, itens: 2}, {valor: 95, itens: 1}, {valor: 241, itens: 4}, {valor: 72, itens: 2},
      {valor: 149, itens: 1}, {valor: 59, itens: 1}, {valor: 167, itens: 3}, {valor: 88, itens: 2},
    ]}
    chegadas={[0, 12, 21, 29, 36, 42, 47, 51, 55, 59, 63, 84]}
    quadroMais={72}
    maisTexto="+38 mais"
    width={1080}
    height={1350}
  />
);

registerRoot(() => <Composition id="Demo" component={Demo} width={1080} height={1350} fps={30} durationInFrames={150} />);
