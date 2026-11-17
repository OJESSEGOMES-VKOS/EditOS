/**
 * O registro das telas livres DESTE vídeo: a prova que a fala nova pede e o aprovado não tem. O molde vem vazio de
 * propósito (o vídeo novo nasce sem as telas do aprovado). Para criar uma (skill prova-print, "A invenção"):
 *
 * 1. Junte a prova real: o print em public/ com uma linha em public/ORIGEM.md (página, data, o que mostra). Sem print
 *    real a tela não existe: a frase fica na pessoa e o número dito vai na legenda como palavra-chave (G7, G25).
 * 2. Escreva src/telas/<Nome>.tsx com o kit de src/ui.tsx: <Vitrine> (o card escuro na zona segura, x 80 a 960, y 250 a
 *    1140), <Prova> (o print, as vistas e o grifo na palavra dita), <ContadorDa> (o número dito, de contadores() no
 *    plano), <Capitulo> (lista que a fala enumera), <Palco> (só com fundo: 'recorte'). Os instantes vêm de w('palavra'):
 *
 *      import React from 'react';
 *      import {w} from '../tema';
 *      import type {Cena} from '../tema';
 *      import {ImgFundo, LARG_VITRINE, Prova, Vitrine} from '../ui';
 *      const P = {src: 'prova-site.png', larg: 1320};
 *      export const Site: React.FC<{c: Cena}> = ({c}) => (
 *        <Vitrine c={c} fundo={<ImgFundo src={P.src} />}>
 *          <Prova {...P} caixaW={LARG_VITRINE} vistas={[{at: 0, x: 40, y: 0, w: 1100}]} grifos={[{at: w('grátis'), x: 60, y: 300, w: 400, h: 64}]} />
 *        </Vitrine>
 *      );
 *
 * 3. Registre aqui: `import {Site} from './Site';` e `export const TELAS = {Site};`
 * 4. No plano (bloco O PLANO de src/tema.ts): [VITRINE, corte(w('palavra que abre')), 'Site'], com a linha no plano.md
 *    que diz a tela e a palavra dita entre aspas que pediu ela.
 */
export const TELAS = {};
