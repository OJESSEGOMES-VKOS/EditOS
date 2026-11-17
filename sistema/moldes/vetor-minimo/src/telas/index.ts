/* Os objetos novos do vídeo (vetor-minimo.md §4, .claude/skills/vetor-minimo): o que o personagem segura quando a fala
 * pede outra coisa que não a tela da casa. Cada um mora em src/telas/<Nome>.tsx, desenha com o kit (../kit) centrado em
 * (0,0) e entra aqui pelo nome; no plano (scripts/plano.py), chegada(comp='Nome', ...). No molde fica vazio. */
import type React from 'react';
import type {ObjetoProps} from '../kit';

export const TELAS: Record<string, React.FC<ObjetoProps>> = {};
