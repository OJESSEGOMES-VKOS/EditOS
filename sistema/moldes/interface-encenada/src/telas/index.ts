/**
 * O registro das telas livres DESTE vídeo: a interface que a fala nova pede e o aprovado não tem. O molde vem vazio de
 * propósito (o vídeo novo nasce sem as telas do aprovado). Para criar uma:
 *
 * 1. Escreva src/telas/<Nome>.tsx com as peças da casa (src/ui.tsx: Palco, Entra, Janela, Linha, Pasta, Arq, Check,
 *    Digita, Enviar, Contador, Grifo, Cursor, Selecao, Troca, pop) e as cores de src/tema.ts (C). Todo desenho mora dentro
 *    do <Palco modo={L.modo} topo={L.topo}> (a zona segura do modo). Os instantes vêm de `em` e o texto de `textos`:
 *
 *      import React from 'react';
 *      import {LivreProps} from '../Livres';
 *      import {Palco, Janela, Linha, Check} from '../ui';
 *      export const Fornadas: React.FC<LivreProps> = ({L, em, textos}) => (
 *        <Palco modo={L.modo}>
 *          <Janela w={860} h={600} titulo={textos.app}>
 *            <Linha em={em.seis} y={40} icone="arq">{textos.seis}</Linha>
 *          </Janela>
 *        </Palco>
 *      );
 *
 * 2. Registre aqui: `import {Fornadas} from './Fornadas';` e `export const TELAS = {Fornadas};`
 * 3. No plano (bloco "O PLANO" de src/tema.ts): livres = [{comp: 'Fornadas', modo: 'dividido', de: corte(w('palavra')),
 *    em: {seis: w('seis')}, textos: {seis: 'seis'}}]. Texto só o que é dito (G19), número como foi dito (G10).
 */
export const TELAS = {};
