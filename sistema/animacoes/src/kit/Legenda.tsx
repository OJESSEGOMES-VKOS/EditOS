// A legenda do vídeo: blocos curtos, a palavra dita em destaque.
// Regras que valem em todo estilo:
// - no máximo 4 palavras por bloco, e um bloco nunca junta duas frases;
// - cada bloco fica na tela pelo menos o tempo de ler;
// - o centro fica a 70% da altura (o tema pode mudar), longe das bordas.
import React from 'react';
import {useVideoConfig} from 'remotion';
import type {Fala, Palavra} from './fala';
import type {EstiloLegenda} from './tema';

type Bloco = {palavras: Palavra[]; s: number; e: number};

const terminaIdeia = (w: string) => /[.!?…:;,]$/.test(w);

export const blocosDe = (fala: Fala, max = 4): Bloco[] => {
  const blocos: Bloco[] = [];
  for (const frase of fala.frases) {
    let atual: Palavra[] = [];
    const fecha = () => {
      if (atual.length) blocos.push({palavras: atual, s: atual[0].s, e: atual[atual.length - 1].e});
      atual = [];
    };
    frase.palavras.forEach((p, i) => {
      atual.push(p);
      const resto = frase.palavras.length - i - 1;
      // fecha na pontuação, no tamanho máximo, e nunca deixa uma palavra órfã pro bloco seguinte
      if (atual.length >= max || (terminaIdeia(p.w) && atual.length >= 2 && resto !== 1)) fecha();
    });
    fecha();
  }
  return blocos;
};

export const Legenda: React.FC<{
  fala: Fala;
  t: number;
  estilo: EstiloLegenda;
  /** trechos [de, até] em segundos sem legenda (quando a frase já está escrita na cena) */
  sem?: [number, number][];
}> = ({fala, t, estilo, sem = []}) => {
  const {width, height} = useVideoConfig();
  const blocos = React.useMemo(() => blocosDe(fala, estilo.palavras ?? 4), [fala, estilo.palavras]);
  if (sem.some(([a, b]) => t >= a && t < b)) return null;

  const i = blocos.findIndex((b, k) => {
    const proximo = blocos[k + 1]?.s ?? Infinity;
    // fica até o próximo bloco entrar, mas some se o silêncio passar de 0,9 s
    return t >= b.s - 0.08 && t < proximo - 0.08 && t < b.e + 0.9;
  });
  if (i < 0) return null;

  const u = Math.min(width, height * 0.75) / 1080;
  const bloco = blocos[i];
  return (
    <div
      style={{
        position: 'absolute',
        left: width * 0.07,
        right: width * 0.07,
        top: height * estilo.altura,
        transform: 'translateY(-50%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: estilo.tamanho * 0.28 * u,
        rowGap: estilo.tamanho * 0.08 * u,
        fontFamily: estilo.fonte,
        fontWeight: estilo.peso,
        fontSize: estilo.tamanho * u,
        lineHeight: 1.15,
        textAlign: 'center',
        textTransform: estilo.maiuscula ? 'uppercase' : 'none',
        textShadow: estilo.sombra,
      }}
    >
      {bloco.palavras.map((p, k) => (
        <span key={k} style={{color: t >= p.s - 0.04 && t < p.e + 0.06 ? estilo.destaque : estilo.cor}}>
          {p.w}
        </span>
      ))}
    </div>
  );
};
