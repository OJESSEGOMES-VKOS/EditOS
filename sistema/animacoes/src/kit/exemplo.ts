// O exemplo de todo estilo conta a MESMA história curta (o ciclo da água), pra
// dar pra comparar um estilo com o outro. Cada estilo desenha as cinco cenas
// do jeito dele.
import type {Fala} from './fala';

/** Monta uma fala sem narração: cada frase dura o tempo de ler (1 s + 3 palavras por segundo). */
export const falaSemVoz = (frases: string[], respiro = 0.25): Fala => {
  let t = 0.4;
  const saida = frases.map((texto) => {
    const ws = texto.split(/\s+/).filter(Boolean);
    const dur = Math.max(1.6, 1 + ws.length / 3);
    const peso = (w: string) => w.replace(/[^\p{L}\p{N}]/gu, '').length + 2;
    const total = ws.reduce((n, w) => n + peso(w), 0);
    let p = t;
    const palavras = ws.map((w) => {
      const d = (dur * peso(w)) / total;
      const item = {w, s: +p.toFixed(3), e: +(p + d).toFixed(3)};
      p += d;
      return item;
    });
    const f = {texto, s: +t.toFixed(3), e: +(t + dur).toFixed(3), palavras};
    t += dur + respiro;
    return f;
  });
  return {duracao: +(t + 0.6).toFixed(3), audio: null, frases: saida};
};

/**
 * As cinco cenas do exemplo:
 * 0 o título · 1 o sol esquenta o mar · 2 o vapor vira nuvem · 3 a chuva cai · 4 a planta cresce
 */
export const FALA_EXEMPLO = falaSemVoz([
  'O ciclo da água',
  'O sol esquenta o mar.',
  'O vapor sobe e vira nuvem.',
  'A nuvem pesa e vira chuva.',
  'E a chuva faz a planta crescer.',
]);
