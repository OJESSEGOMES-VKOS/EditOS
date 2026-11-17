// A fala do vídeo: o arquivo fala.json que a ferramenta de voz escreve.
// É ele que dá o tempo de tudo: cada cena começa e termina numa frase.

export type Palavra = {w: string; s: number; e: number};
export type Frase = {texto: string; s: number; e: number; palavras: Palavra[]};
export type Fala = {
  /** segundos do vídeo inteiro */
  duracao: number;
  /** caminho do áudio dentro de public/, ou null quando o vídeo não tem voz */
  audio: string | null;
  frases: Frase[];
};

/** Segundo em que a frase `i` começa (a primeira começa no 0, pra tela nunca abrir vazia). */
export const inicio = (fala: Fala, i: number) => (i <= 0 ? 0 : fala.frases[Math.min(i, fala.frases.length - 1)].s);

/** Segundo em que a frase `i` termina: o começo da próxima, ou o fim do vídeo. */
export const fim = (fala: Fala, i: number) => (i >= fala.frases.length - 1 ? fala.duracao : fala.frases[i + 1].s);

/** Segundo em que a palavra é dita (procura a partir da frase `de`). Devolve o começo da frase se não achar. */
export const quando = (fala: Fala, palavra: string, de = 0) => {
  const alvo = limpa(palavra);
  for (let i = de; i < fala.frases.length; i++) {
    const p = fala.frases[i].palavras.find((x) => limpa(x.w) === alvo);
    if (p) return p.s;
  }
  return inicio(fala, de);
};

export const limpa = (w: string) =>
  w
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
