/**
 * O registro das telas novas DESTE vídeo (o herói que a fala nova pede e o aprovado não tem). O molde vem vazio de
 * propósito: o vídeo novo nasce sem as telas do aprovado. Para criar uma (modelos/autoridade/autoridade.md §9):
 *
 * 1. Escreva src/telas/<Nome>.tsx com o kit da casa (src/ui.tsx: Palco, Em, Entra, Cartao, Painel, Texto, Pilula,
 *    Visto, Barra, Numero, Traco, Onda) e as cores de src/tema.ts (C). Tudo dentro do <Palco modo={modo}>. Os
 *    instantes vêm de `em` e o texto de `textos`, os dois do plano (src/Reel.tsx, bloco O PLANO):
 *
 *      import React from 'react';
 *      import {Heroi, Palco, Em, Entra, Cartao, Traco} from '../ui';
 *      export const Conta: Heroi = ({t, modo, fg, ac, em}) => (
 *        <Palco modo={modo}>
 *          <Em cx={440} w={300} y={20}><Entra t={t} em={em.conta}><Cartao w={300} fg={fg} /></Entra></Em>
 *          <Em x={290} y={300}><Traco t={t} em={em.metade} w={300} cor={ac} /></Em>
 *        </Palco>
 *      );
 *
 * 2. Registre aqui: `import {Conta} from './Conta';` e `export const TELAS_NOVAS = {Conta};`
 * 3. No plano: numa tela cheia, `heroi: 'Conta'` em TELAS; numa dividida, `PAINEIS = [{de: T.conta, heroi: 'Conta',
 *    em: {conta: de(12), metade: de(18)}}]` e o trecho [T.conta, M.painel]. Texto só o que é dito (G19), número como foi
 *    dito (G10): `textos: {valor: [i, 'trezentos reais']}` (i = índice da 1ª palavra; o molde confere com a fala).
 */
export const TELAS_NOVAS = {};
