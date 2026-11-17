/**
 * O registro das telas livres DESTE vídeo: a tela de gelo que a fala nova pede e o aprovado não tem. O molde vem vazio de
 * propósito (o vídeo novo nasce sem as telas do aprovado). Para criar uma:
 *
 * 1. Escreva src/telas/<Nome>.tsx com as peças da casa (src/ui.tsx: Palco, Entra, Cartao, Palavras, Rotulo, Ponto, Fio,
 *    Risco, Contorno, Tracejado, Numero, Icone) e as cores de COR. Todo desenho mora dentro do <Palco> (a área da grade,
 *    acima do cartão do rosto). Os instantes vêm de `em` e o texto de `textos`, os dois do plano:
 *
 *      import React from 'react';
 *      import {LivreProps} from '../Livres';
 *      import {Palco, Entra, Cartao, Icone, Risco, Palavras} from '../ui';
 *      export const SemOuvido: React.FC<LivreProps> = ({t, em, textos}) => (
 *        <Palco>
 *          <Entra t={t} em={em.ouvidos}><Risco t={t} em={em.nao}><Icone d="ouvido" tam={420} /></Risco></Entra>
 *          <Palavras t={t} ps={[[textos.palavra, em.ouvidos]]} />
 *        </Palco>
 *      );
 *
 * 2. Registre aqui: `import {SemOuvido} from './SemOuvido';` e `export const TELAS = {SemOuvido};`
 * 3. No bloco O PLANO de src/plano.ts: `LIVRES = [{comp: 'SemOuvido', de: T.x, ate: T.y, em: {nao: ..., ouvidos: ...},
 *    textos: {palavra: 'ouvidos'}}];` e a chave `[T.x, POSE.cartao, 0.38, true]` (o rosto no cartão até o `ate`).
 *    Texto só o que é dito (G19), número como foi dito (G10).
 */
export const TELAS = {};
