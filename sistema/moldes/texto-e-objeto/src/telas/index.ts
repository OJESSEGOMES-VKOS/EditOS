/* As telas livres do vídeo (texto-e-objeto.md §5, .claude/skills/texto-e-objeto): o herói que a fala nova pede e a casa
 * não tem. Cada uma mora em src/telas/<Nome>.tsx, desenha com o kit (../kit) e entra aqui pelo nome; no plano,
 * heroi: <Heroi comp="Nome" />. No molde fica vazio: as telas livres são do vídeo, nunca do molde. */
import type React from 'react';
import type {HeroiProps} from '../kit';

export const TELAS: Record<string, React.FC<HeroiProps>> = {};
