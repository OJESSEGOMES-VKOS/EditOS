// O contrato de um estilo. Cada estilo em src/estilos/<id>/ exporta um `tema`
// com este formato, as peças dele e um exemplo. O Filme lê o tema pra saber
// como é o fundo e como é a legenda.
import type React from 'react';
import type {Fala} from './fala';
import type {Formato} from './tempo';

export type EstiloLegenda = {
  fonte: string;
  peso: number;
  /** tamanho da letra numa tela de 1080 de largura */
  tamanho: number;
  cor: string;
  /** cor da palavra que está sendo dita */
  destaque: string;
  /** contorno ou sombra que garante leitura em cima de qualquer cena (CSS text-shadow) */
  sombra: string;
  /** altura do centro da legenda, de 0 (topo) a 1 (base). O padrão da casa é 0.7 */
  altura: number;
  /** caixa alta */
  maiuscula?: boolean;
  /** palavras por bloco (padrão 4; o estilo pode pedir menos, ex.: karaokê de 3) */
  palavras?: number;
};

export type Tema = {
  id: string;
  nome: string;
  /** cor de fundo usada por baixo de tudo (aparece nas fusões) */
  fundo: string;
  tinta: string;
  acento: string;
  legenda: EstiloLegenda;
  /** o fundo vivo do estilo (lousa, papel, céu...). Recebe o segundo do vídeo inteiro. */
  Fundo: React.FC<{t: number}>;
};

/** Um vídeo de animação (da oficina ou dos exemplos), do jeito que o motor enxerga. Todo video.tsx exporta Video, fala e formato. */
export type VideoRegistrado = {id: string; pasta: string; Video: React.FC; fala: Fala; formato?: Formato};
