/**
 * O registro das telas livres DESTE vídeo: a tela que a fala nova pede e o aprovado não tem. O molde vem vazio de
 * propósito (o vídeo novo nasce sem as telas do aprovado). Para criar uma:
 *
 * 1. Escreva src/telas/<Nome>.tsx com as peças da casa (src/ui.tsx: Palco, Entra, Cartao, Frase, MarcaTexto, Chip,
 *    ItemCheck, Barra, Numero, Risco, Icone, Ondas, Bolinha) e as cores de src/tema.ts (C). Todo desenho mora dentro
 *    do <Palco modo={L.modo}> (a zona segura do modo). Os instantes vêm de `em` e o texto de `textos`, os dois do plano:
 *
 *      import React from 'react';
 *      import {LivreProps} from '../Livres';
 *      import {Palco, Entra, Cartao, Barra} from '../ui';
 *      export const Conta: React.FC<LivreProps> = ({L, em, textos}) => (
 *        <Palco modo={L.modo}>
 *          <Entra em={L.de + 0.1}><Cartao>{textos.valor}</Cartao></Entra>
 *          <Barra de={em.caiu} ate={em.caiu + 0.6} de0={1} para={0.5} />
 *        </Palco>
 *      );
 *
 * 2. Registre aqui: `import {Conta} from './Conta';` e `export const TELAS = {Conta};`
 * 3. No plano (scripts/gerar_tempos.py): livres=[dict(comp='Conta', modo='dividido', de=..., sai=..., em=dict(caiu=w('metade')),
 *    textos=dict(valor='R$ 300'))]. Texto só o que é dito (G19), número como foi dito (G10).
 */
export const TELAS = {};
