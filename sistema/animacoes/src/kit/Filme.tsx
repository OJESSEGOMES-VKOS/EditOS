// O Filme monta o vídeo: o fundo do estilo, as cenas na ordem (com fusão
// entre elas), a legenda e o áudio. Todo vídeo é um <Filme>.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Fala} from './fala';
import {fim, inicio} from './fala';
import {Legenda} from './Legenda';
import type {Tema} from './tema';
import {ramp} from './tempo';

/** O que toda cena recebe. */
export type PropsCena = {
  /** segundos desde que ESTA cena começou */
  t: number;
  /** quanto esta cena dura, em segundos */
  dur: number;
  /** segundos desde o começo do vídeo */
  tv: number;
  fala: Fala;
};

export type Cena = {
  /** segundo do vídeo em que a cena entra */
  de: number;
  /** segundo do vídeo em que a cena acaba */
  ate: number;
  C: React.FC<PropsCena>;
  /** segundos de fusão com a cena anterior (0 = corte seco) */
  fusao?: number;
};

/**
 * Monta as cenas pelas frases da fala, que é o jeito normal de trabalhar:
 * cenasPorFrase(fala, [[0, 1, Abertura], [2, 4, Meio], [5, 5, Fecho]])
 * A cena 1 cobre as frases 0 e 1, a cena 2 as frases 2 a 4, e assim por diante.
 * As cenas precisam cobrir todas as frases, em ordem, sem buraco.
 */
export const cenasPorFrase = (
  fala: Fala,
  lista: [number, number, React.FC<PropsCena>, number?][]
): Cena[] => lista.map(([a, b, C, fusao]) => ({de: inicio(fala, a), ate: fim(fala, b), C, fusao: fusao ?? 0.4}));

export const Filme: React.FC<{
  tema: Tema;
  fala: Fala;
  cenas: Cena[];
  /** trechos [de, até] em segundos sem legenda */
  semLegenda?: [number, number][];
  /** trilha de fundo dentro de public/ (opcional) e o volume dela, de 0 a 1 */
  trilha?: string;
  volumeTrilha?: number;
  /** desliga a legenda do vídeo inteiro */
  legenda?: boolean;
}> = ({tema, fala, cenas, semLegenda, trilha, volumeTrilha = 0.18, legenda = true}) => {
  const quadro = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = quadro / fps;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo, color: tema.tinta, overflow: 'hidden'}}>
      <tema.Fundo t={t} />
      {cenas.map((c, k) => {
        const fusaoDaProxima = cenas[k + 1]?.fusao ?? 0;
        // a cena continua viva enquanto a próxima entra por cima
        if (t < c.de || t >= c.ate + fusaoDaProxima) return null;
        const f = k === 0 ? 0 : (c.fusao ?? 0);
        return (
          <AbsoluteFill key={k} style={{opacity: f > 0 ? ramp(t, c.de, c.de + f) : 1}}>
            <c.C t={t - c.de} dur={c.ate - c.de} tv={t} fala={fala} />
          </AbsoluteFill>
        );
      })}
      {legenda && <Legenda fala={fala} t={t} estilo={tema.legenda} sem={semLegenda} />}
      {fala.audio && <Audio src={staticFile(fala.audio)} />}
      {trilha && (
        <Audio
          src={staticFile(trilha)}
          loop
          volume={(q) => volumeTrilha * Math.min(1, q / fps, (durationInFrames - q) / (fps * 1.5))}
        />
      )}
    </AbsoluteFill>
  );
};
