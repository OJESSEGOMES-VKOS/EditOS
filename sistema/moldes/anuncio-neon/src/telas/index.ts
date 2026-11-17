// As telas novas deste vídeo (as que a fala pede e a casa não tem). Cada uma mora em src/telas/<Nome>.tsx, desenhada
// com o kit de src/kit.tsx (cores só de C, a cor do anúncio), e entra aqui e no plano (scripts/plano.py) como
// livre(comp='<Nome>', ...). No molde fica vazio: as telas do aprovado (S1 a S10) moram em src/cenas.tsx.
import type {TelaNova} from '../kit';

export const TELAS: Record<string, TelaNova> = {};
