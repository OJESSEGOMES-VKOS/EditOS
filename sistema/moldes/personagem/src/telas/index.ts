/**
 * O registro das cenas novas DESTE vídeo: a ilustração que a frase nova pede e o aprovado não tem. O molde vem vazio de
 * propósito (o vídeo novo nasce sem as cenas do aprovado). Para criar uma:
 *
 * 1. Escreva src/telas/<Nome>.tsx com o kit da casa (src/kit.tsx: Fundo, Luz, Poeira, Boneco + emPe/SENTADO, Mesa, Cama,
 *    Janela, Luminaria, Cadeira, Cartao, Icone, Avanco, C, NEON_VERDE, NEON_OURO, marca, tw, E, lerp, Svg, CHAO).
 *    A cena é parada (câmera parada); o movimento é um acontecimento pequeno preso a uma palavra, marca('nome'):
 *
 *      import React from 'react';
 *      import {AbsoluteFill} from 'remotion';
 *      import {C, E, Fundo, Luz, Boneco, emPe, Svg, P, sec, marca, tw, NEON_VERDE} from '../kit';
 *      export const Conta: React.FC<P> = ({f}) => {
 *        const k = tw(f, marca('metade'), marca('metade') + 10, 1, 0.5, E.out); // a barra cai pela metade na palavra
 *        return (
 *          <AbsoluteFill style={{background: C.preto}}>
 *            <Svg>
 *              <Fundo id="conta" />
 *              <Luz cx={540} id="conta" />
 *              <rect x={600} y={700} width={300 * k} height={40} rx={20} fill={C.verde} style={{filter: NEON_VERDE}} />
 *              <Boneco p={emPe(380, 1.0, {olhos: 'aberto', olhar: [1, -0.3]})} t={sec(f)} id="conta" />
 *            </Svg>
 *          </AbsoluteFill>
 *        );
 *      };
 *
 * 2. Registre aqui: `import {Conta} from './Conta';` e `export const TELAS = {Conta};`
 * 3. No plano (scripts/plano.py, bloco O PLANO): cena(comp='Conta', de=w('palavra que abre a frase')) e, se a cena usa
 *    uma marca, MARCAS = dict(metade=m('metade')). Texto na cena só o que é dito (G19); de preferência nenhum (a legenda
 *    já conta).
 */
export const TELAS = {};
