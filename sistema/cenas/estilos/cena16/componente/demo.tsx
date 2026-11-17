import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Cena16} from './Cena16';

// série inventada só para a vitrine (DADOS ILUSTRATIVOS); vídeo real usa a série com fonte
const serieDemo = (() => {
  const v: number[] = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 81; i++) {
    let x: number;
    if (i <= 50) x = 0.3 + (i / 50) ** 1.35 * 0.7;
    else x = 1.0 + (1 - Math.exp(-(i - 50) / 13)) * 3.6;
    x += (rnd() - 0.5) * (i > 50 ? 0.32 : 0.04);
    v.push(Math.max(0.25, x));
  }
  v[80] = 4.2;
  return v;
})();

const Root: React.FC = () => (
  <Composition
    id="Demo"
    component={Cena16}
    width={1080}
    height={1350}
    fps={30}
    durationInFrames={150}
    defaultProps={{
      width: 1080,
      height: 1350,
      empresa: 'VERANA PAY',
      letraMiuda: 'VOLUME · MENSAL · ANUALIZADO · R$',
      rotulo: 'Volume anual de pagamentos',
      prefixo: 'R$',
      unidade: 'bi',
      casas: 1,
      serie: serieDemo,
      anoInicial: 2019,
      mesesEixo: 84,
      indiceEvento: 50,
      eventoData: 'MAR 2023',
      eventoTitulo: 'Cartão Verana chega',
      eventoLinha: 'O volume dobra em cinco meses',
      delta: '321%',
      deltaTexto: 'desde o lançamento do cartão',
      fonte: 'FONTE: DADOS ILUSTRATIVOS',
      periodo: 'JAN 2019 A SET 2025',
      teto: 5,
      marcas: [1, 2, 3, 5],
      sufixoEixo: 'B',
    }}
  />
);
registerRoot(Root);
