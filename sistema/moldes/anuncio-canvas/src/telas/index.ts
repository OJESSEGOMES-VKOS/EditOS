// As telas novas do vídeo: a peça que a fala nova pede e a casa não tem (o normal num anúncio novo). Cada uma mora em
// src/telas/<Nome>.tsx desta pasta do vídeo, desenhada só com o kit (src/kit.tsx: paleta C, Sora, a entrada da casa,
// Palco, Cartao, IconeVidro, Pilula, Risco, MarcaTexto, Glitch, G), presa às palavras ditas por w('palavra') e
// registrada aqui. No plano (o bloco O PLANO de src/Canvas.tsx): <El k={frase} x={..} y={..}><Tela comp="Nome" /></El>.
// O molde vem vazio: as telas do aprovado são exemplos (CASA, em src/Canvas.tsx), não o catálogo do vídeo novo.
import type React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TELAS: Record<string, React.FC<any>> = {};
