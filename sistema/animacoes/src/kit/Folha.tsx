// A folha de fotos que a ferramenta fotos.mjs monta: os quadros do vídeo lado
// a lado, cada um com o segundo dele. Não entra em vídeo nenhum.
import React from 'react';
import {AbsoluteFill, Img} from 'remotion';

export type PropsFolha = {fotos: {t: number; src: string}[]; colunas: number; largura: number; altura: number};

const MARGEM = 8;
const RODAPE = 26;

export const tamanhoDaFolha = (p: PropsFolha) => {
  const linhas = Math.max(1, Math.ceil(p.fotos.length / Math.max(1, p.colunas)));
  return {
    width: Math.max(2, p.colunas * (p.largura + MARGEM) + MARGEM),
    height: Math.max(2, linhas * (p.altura + RODAPE + MARGEM) + MARGEM),
  };
};

export const Folha: React.FC<PropsFolha> = ({fotos, largura, altura}) => (
  <AbsoluteFill style={{background: '#fff', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start', gap: MARGEM, padding: MARGEM}}>
    {fotos.map((f, i) => (
      <div key={i} style={{width: largura}}>
        <Img src={f.src} style={{width: largura, height: altura, display: 'block'}} />
        <div style={{height: RODAPE, font: '700 18px/26px system-ui, sans-serif', color: '#111', textAlign: 'center'}}>{f.t.toFixed(1)} s</div>
      </div>
    ))}
  </AbsoluteFill>
);
