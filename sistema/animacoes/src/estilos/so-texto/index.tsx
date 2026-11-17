// ESTILO: Só texto
// Nada de ilustração: a frase é a peça. Fundo escuro e quente, uma luz que
// respira devagar atrás do texto, serifada fina em itálico no centro, as
// palavras chegando do desfoque no tempo em que são ditas, um rótulo em
// versalete dourado em cima e um fio de ouro que cresce. Calmo e solene.
//
//   1. `tema`      cores, fundo e legenda (a legenda fica desligada: a frase já está na tela)
//   2. as peças    Luz, Rotulo, Fio, Frase, Rodape, Saida
//   3. os moldes   Quadro (rótulo + fio + frase + rodapé numa cena só)
//   4. `Exemplo`   o ciclo da água
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as carregarCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as carregarVersalete} from '@remotion/google-fonts/CormorantSC';
import type {Fala, PropsCena, Tema} from '../../kit';
import {FALA_EXEMPLO, Filme, balanco, cenasPorFrase, chega, ramp, useTela} from '../../kit';

const {fontFamily: SERIFA} = carregarCormorant('italic', {weights: ['500'], subsets: ['latin', 'latin-ext']});
const {fontFamily: VERSALETE} = carregarVersalete('normal', {weights: ['500'], subsets: ['latin', 'latin-ext']});

// ---------- 1. o tema ----------

/** Creme pro texto, ouro velho pro rótulo e o fio, e os tons de luz (um por clima). */
export const COR = {
  fundo: '#0b0907',
  creme: '#f3eadb',
  ouro: '#d9b878',
} as const;

/** Os tons da luz que respira atrás do texto. Escolha pelo clima da frase, nunca por enfeite. */
export const TOM = {
  quente: '#4a381c',
  brasa: '#4a2a1c',
  terra: '#36291e',
  mar: '#22303f',
  folha: '#263424',
  noite: '#1d2437',
} as const;
export type Tom = keyof typeof TOM;

/** O fundo: escuro quente com a vinheta. A luz de cada cena é a peça `Luz`. */
const Fundo: React.FC<{t: number}> = () => (
  <AbsoluteFill style={{background: COR.fundo}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(60,44,26,0.35) 0%, transparent 60%)'}} />
  </AbsoluteFill>
);

export const tema: Tema = {
  id: 'so-texto',
  nome: 'Só texto',
  fundo: COR.fundo,
  tinta: COR.creme,
  acento: COR.ouro,
  // a frase já está escrita no centro: o vídeo deste estilo sai com a legenda desligada (legenda={false})
  legenda: {
    fonte: SERIFA,
    peso: 500,
    tamanho: 64,
    cor: COR.creme,
    destaque: COR.ouro,
    sombra: '0 2px 12px #000',
    altura: 0.72,
  },
  Fundo,
};

// ---------- 2. as peças ----------

/** A luz que respira atrás do texto: uma mancha de cor que passeia devagar. `t` é o segundo da cena. */
export const Luz: React.FC<{t: number; tom?: Tom; forca?: number}> = ({t, tom = 'quente', forca = 1}) => {
  const {L, A, u} = useTela();
  const x = L / 2 + 160 * u * Math.sin(t / 2.3);
  const y = A * 0.47 + 120 * u * Math.cos(t / 3);
  return (
    <AbsoluteFill
      style={{
        opacity: forca * (0.85 + 0.15 * balanco(t, 0.4)),
        background: `radial-gradient(ellipse ${900 * u}px ${1100 * u}px at ${x}px ${y}px, ${TOM[tom]} 0%, transparent 70%)`,
      }}
    >
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)'}} />
    </AbsoluteFill>
  );
};

/** O rótulo em versalete dourado, bem espaçado: o capítulo, o passo, o lugar. Curto (até 4 palavras). */
export const Rotulo: React.FC<{children: string; p: number; tamanho?: number}> = ({children, p, tamanho = 50}) => {
  const {u} = useTela();
  return (
    <div style={{fontFamily: VERSALETE, fontSize: tamanho * u, letterSpacing: '0.32em', color: COR.ouro, opacity: p, textAlign: 'center', paddingLeft: '0.32em'}}>
      {children}
    </div>
  );
};

/** O fio de ouro que cresce do centro, entre o rótulo e a frase. */
export const Fio: React.FC<{p: number; largura?: number}> = ({p, largura = 280}) => {
  const {u} = useTela();
  return <div style={{width: largura * u * p, height: 2 * u, background: COR.ouro, opacity: 0.7, margin: '0 auto'}} />;
};

/**
 * A frase, palavra por palavra: cada uma sai do desfoque e sobe um pouco. `tempos` é o segundo (da cena) em que
 * cada palavra chega; sem ele, entram uma a cada 0,17 s a partir de `de`. `ouro` pinta uma ou duas palavras-chave.
 * Use `\n` pra quebrar a linha onde a frase respira.
 */
export const Frase: React.FC<{texto: string; t: number; de?: number; tempos?: number[]; tamanho?: number; ouro?: string[]}> = ({
  texto,
  t,
  de = 0.15,
  tempos,
  tamanho = 128,
  ouro = [],
}) => {
  const {L, u} = useTela();
  const chave = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  const dourar = new Set(ouro.map(chave));
  let i = 0;
  return (
    <div style={{fontFamily: SERIFA, fontStyle: 'italic', fontWeight: 500, fontSize: tamanho * u, lineHeight: 1.08, color: COR.creme, textAlign: 'center', width: L - 160 * u}}>
      {texto.split('\n').map((linha, li) => (
        <div key={li}>
          {linha.split(' ').filter(Boolean).map((w, wi) => {
            const ini = tempos?.[i] ?? de + i * 0.17;
            i++;
            const p = ramp(t, ini, ini + 0.55, chega);
            return (
              <span
                key={wi}
                style={{
                  display: 'inline-block',
                  margin: '0 0.12em',
                  opacity: p,
                  filter: `blur(${(1 - p) * 10 * u}px)`,
                  transform: `translateY(${(1 - p) * 18 * u}px)`,
                  color: dourar.has(chave(w)) ? COR.ouro : COR.creme,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** O rodapé: a fonte, o número, a referência. Versalete pequeno em ouro, entra depois da frase. */
export const Rodape: React.FC<{children: string; p: number}> = ({children, p}) => {
  const {u} = useTela();
  return <div style={{fontFamily: VERSALETE, fontSize: 38 * u, letterSpacing: '0.2em', color: COR.ouro, opacity: p * 0.9, textAlign: 'center'}}>{children}</div>;
};

/** A saída da cena: o bloco inteiro sobe um pouco e apaga nos últimos 0,3 s. Use `fusao` 0 entre as cenas. */
export const Saida: React.FC<{t: number; dur: number; children: React.ReactNode; ultima?: boolean}> = ({t, dur, children, ultima = false}) => {
  const {u} = useTela();
  const s = ultima ? 0 : ramp(t, dur - 0.3, dur);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: 1 - s, transform: `translateY(${-s * 20 * u}px)`}}>
      {children}
    </AbsoluteFill>
  );
};

/**
 * Quando cada palavra da frase `i` chega, em segundos da cena que começa em `inicio`. Acompanha a voz, mas adiantado
 * (`pressa` 0,6 = a frase inteira já está na tela aos 60% da fala), pra sobrar tempo de ler antes da cena sair.
 */
export const temposDaFrase = (fala: Fala, i: number, inicio: number, pressa = 0.6) => {
  const f = fala.frases[i];
  return f.palavras.map((p) => Math.max(0.05, f.s - inicio + (p.s - f.s) * pressa));
};

// ---------- 3. o molde: um quadro inteiro ----------

/** Rótulo, fio, frase e rodapé no centro, com a luz atrás. É o jeito normal de uma cena deste estilo. */
export const Quadro: React.FC<{
  t: number;
  dur: number;
  frase: string;
  rotulo?: string;
  rodape?: string;
  tom?: Tom;
  tempos?: number[];
  ouro?: string[];
  tamanho?: number;
  ultima?: boolean;
  /** a abertura do vídeo: tudo já escrito no quadro 0 (o vídeo nunca abre com tela vazia) */
  abre?: boolean;
}> = ({t, dur, frase, rotulo, rodape, tom = 'quente', tempos, ouro, tamanho, ultima, abre = false}) => {
  const {u} = useTela();
  const tt = abre ? t + 10 : t;
  const fimFrase = tempos?.length ? tempos[tempos.length - 1] + 0.4 : 0.15 + frase.split(/\s+/).length * 0.17 + 0.4;
  return (
    <>
      <Luz t={t} tom={tom} />
      <Saida t={t} dur={dur} ultima={ultima}>
        {rotulo && <Rotulo p={ramp(tt, 0, 0.35)}>{rotulo}</Rotulo>}
        {rotulo && <div style={{height: 44 * u}} />}
        <Fio p={ramp(tt, 0, 0.8, chega)} />
        <div style={{height: 60 * u}} />
        <Frase texto={frase} t={tt} tempos={tempos} ouro={ouro} tamanho={tamanho} />
        {rodape && <div style={{height: 56 * u}} />}
        {rodape && <Rodape p={ramp(t, fimFrase, fimFrase + 0.45)}>{rodape}</Rodape>}
      </Saida>
    </>
  );
};

// ---------- 4. o exemplo: o ciclo da água ----------

const F = FALA_EXEMPLO;
const cena = (i: number, extra: {rotulo?: string; rodape?: string; tom?: Tom; ouro?: string[]; quebra?: string; ultima?: boolean}) => {
  const C: React.FC<PropsCena> = ({t, dur}) => (
    <Quadro
      t={t}
      dur={dur}
      frase={extra.quebra ?? F.frases[i].texto}
      rotulo={extra.rotulo}
      rodape={extra.rodape}
      tom={extra.tom}
      ouro={extra.ouro}
      tempos={temposDaFrase(F, i, i === 0 ? 0 : F.frases[i].s)}
      tamanho={i === 0 ? 168 : 132}
      ultima={extra.ultima}
      abre={i === 0}
    />
  );
  return C;
};

export const Exemplo: React.FC = () => (
  <Filme
    tema={tema}
    fala={F}
    // a frase inteira é a imagem: legenda desligada no vídeo todo (nunca a mesma frase duas vezes na tela)
    legenda={false}
    cenas={cenasPorFrase(F, [
      [0, 0, cena(0, {rotulo: 'Uma volta', quebra: 'O ciclo\nda água', tom: 'mar'}), 0],
      [1, 1, cena(1, {rotulo: 'Passo um', tom: 'brasa', ouro: ['sol'], quebra: 'O sol esquenta\no mar.'}), 0],
      [2, 2, cena(2, {rotulo: 'Passo dois', tom: 'noite', ouro: ['nuvem'], quebra: 'O vapor sobe\ne vira nuvem.'}), 0],
      [3, 3, cena(3, {rotulo: 'Passo três', tom: 'mar', ouro: ['chuva'], quebra: 'A nuvem pesa\ne vira chuva.'}), 0],
      [4, 4, cena(4, {rotulo: 'E recomeça', tom: 'folha', ouro: ['planta'], quebra: 'E a chuva faz\na planta crescer.', ultima: true}), 0],
    ])}
  />
);
