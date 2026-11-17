// O ciclo da água, no estilo Quadro de giz.
// Este é o vídeo de exemplo do motor de animações do EditOS: mostra como um vídeo é
// montado. As cenas estão na ordem do roteiro.md (a tabela "## Cenas").
import React from 'react';
import type {Fala, Formato, Ponto, PropsCena} from '../../src/kit';
import {Filme, Tela, cenasPorFrase, circulo, quando, ramp, useTela} from '../../src/kit';
import {Apagador, Chuva, Escrito, Giz, Mar, Nuvem, Planta, Risco, Seta, Sol, tema} from '../../src/estilos/giz';
import falaJson from './fala.json';

export const fala = falaJson as Fala;
export const formato: Formato = 'vertical';

// Cena 1 (frases 0 e 1): o copo de água e a seta que dá a volta
const Copo: React.FC<PropsCena> = ({t, dur, fala: f}) => {
  const {L, A, u} = useTela();
  const cx = L / 2;
  const cy = A * 0.36;
  const copo: Ponto[] = [
    [cx - 120 * u, cy - 170 * u],
    [cx - 90 * u, cy + 170 * u],
    [cx + 90 * u, cy + 170 * u],
    [cx + 120 * u, cy - 170 * u],
  ];
  const agua: Ponto[] = [
    [cx - 108 * u, cy - 60 * u],
    [cx - 88 * u, cy + 160 * u],
    [cx + 88 * u, cy + 160 * u],
    [cx + 108 * u, cy - 60 * u],
  ];
  // a volta começa quando a segunda frase é dita
  const volta = ramp(t, f.frases[1].s, f.frases[1].s + 1.6);
  const arco = circulo(cx, cy, 300 * u, 300 * u, 22).slice(0, 20);
  return (
    <>
      <Tela>
        <Giz>
          <Risco id="copo" reto pontos={copo} p={ramp(t, 0, 0.9)} />
          <Risco id="agua" reto cheio pontos={agua} p={ramp(t, 0.6, 1.8)} cor="azul" />
          <Escrito x={cx} y={A * 0.13} p={ramp(t, 1.6, 2.6)} tamanho={76} cor="amarelo">
            mais velha que os dinossauros
          </Escrito>
          <Risco id="volta" pontos={arco} p={volta} cor="amarelo" grossura={10} />
          <Seta de={arco[18]} ate={arco[19]} p={ramp(volta, 0.85, 1)} cor="amarelo" />
        </Giz>
      </Tela>
      <Apagador p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

// Cena 2 (frase 2): o sol esquenta o mar e o vapor sobe
const SolEMar: React.FC<PropsCena> = ({t, dur, fala: f}) => {
  const {L, A, u} = useTela();
  const sobe = quando(f, 'sobe', 2) - f.frases[2].s; // o vapor sobe na palavra "sobe"
  return (
    <>
      <Tela>
        <Giz>
          <Sol x={L * 0.7} y={A * 0.2} tam={170 * u} p={ramp(t, 0, 1)} t={t} />
          <Mar y={A * 0.52} p={ramp(t, 0.4, 1.4)} t={t} />
          {[0.28, 0.46, 0.64].map((fx, i) => (
            <Seta key={i} de={[L * fx, A * 0.49]} ate={[L * fx + 30 * u, A * 0.33]} p={ramp(t, sobe + i * 0.25, sobe + 0.9 + i * 0.25)} curva={0.5} />
          ))}
        </Giz>
      </Tela>
      <Apagador p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

// Cena 3 (frase 3): o vapor se junta em gotinhas e nasce a nuvem
const NasceANuvem: React.FC<PropsCena> = ({t, dur, fala: f}) => {
  const {L, A, u} = useTela();
  const nasce = quando(f, 'nasce', 3) - f.frases[3].s;
  return (
    <>
      <Tela>
        <Giz>
          <Mar y={A * 0.58} p={1} t={t} />
          <Escrito x={L * 0.5} y={A * 0.5} p={ramp(t, 0.2, 1)} tamanho={60} cor="azul">
            lá em cima faz frio
          </Escrito>
          {/* as gotinhas se juntando antes da nuvem aparecer */}
          {Array.from({length: 9}, (_, i) => {
            const a = (i / 9) * Math.PI * 2;
            const junta = ramp(t, 1.2, nasce + 0.4);
            const r = (260 - junta * 190) * u;
            return (
              <Risco
                key={i}
                id={`gota${i}`}
                pontos={circulo(L * 0.5 + Math.cos(a) * r, A * 0.25 + Math.sin(a) * r * 0.6, 16 * u, 16 * u, 8)}
                p={ramp(t, 0.8 + i * 0.08, 1.4 + i * 0.08) * (1 - ramp(t, nasce + 0.3, nasce + 0.7))}
                cor="azul"
                grossura={6}
              />
            );
          })}
          <Nuvem x={L * 0.5} y={A * 0.25} tam={(380 + ramp(t, nasce, dur) * 120) * u} p={ramp(t, nasce, nasce + 1.1)} />
        </Giz>
      </Tela>
      <Apagador p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

// Cena 4 (frase 4): a nuvem fica pesada e a chuva cai
const CaiAChuva: React.FC<PropsCena> = ({t, dur, fala: f}) => {
  const {L, A, u} = useTela();
  const cai = quando(f, 'cai', 4) - f.frases[4].s;
  const peso = ramp(t, 0.4, cai) * 26 * u; // a nuvem desce um pouco, de pesada
  return (
    <>
      <Tela>
        <Giz>
          <Nuvem x={L * 0.5} y={A * 0.24 + peso} tam={520 * u} p={1} cor={t > cai - 0.3 ? 'azul' : 'branco'} />
          <Chuva x={L * 0.5} y={A * 0.31 + peso} largura={430 * u} altura={A * 0.3} t={t} forca={ramp(t, cai, cai + 1.2)} />
        </Giz>
      </Tela>
      <Apagador p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

// Cena 5 (frase 5): a chuva enche o rio, molha a terra e a planta cresce
const CresceAPlanta: React.FC<PropsCena> = ({t, dur, fala: f}) => {
  const {L, A, u} = useTela();
  const cresce = quando(f, 'planta', 5) - f.frases[5].s;
  return (
    <>
      <Tela>
        <Giz>
          <Nuvem x={L * 0.5} y={A * 0.2} tam={460 * u} p={1} cor="azul" />
          <Chuva x={L * 0.5} y={A * 0.27} largura={380 * u} altura={A * 0.26} t={t} pingos={12} />
          <Risco
            id="chao"
            pontos={[
              [L * 0.14, A * 0.62],
              [L * 0.5, A * 0.615],
              [L * 0.86, A * 0.62],
            ]}
            p={ramp(t, 0, 0.6)}
            cor="laranja"
          />
          <Planta x={L * 0.5} y={A * 0.615} tam={300 * u} p={ramp(t, cresce - 0.4, cresce + 1.8)} t={t} />
        </Giz>
      </Tela>
      <Apagador p={ramp(t, dur - 0.5, dur)} />
    </>
  );
};

// Cena 6 (frase 6): o rio volta pro mar e o círculo fecha
const VoltaProMar: React.FC<PropsCena> = ({t}) => {
  const {L, A, u} = useTela();
  const cx = L / 2;
  const cy = A * 0.36;
  const r = 250 * u;
  // os quatro pontos do ciclo, em volta de um círculo
  const lugar = (i: number): Ponto => [cx + Math.cos(-Math.PI / 2 + (i * Math.PI) / 2) * r, cy + Math.sin(-Math.PI / 2 + (i * Math.PI) / 2) * r];
  const nomes = ['nuvem', 'chuva', 'rio', 'mar'];
  return (
    <Tela>
      <Giz>
        {nomes.map((nome, i) => {
          const [x, y] = lugar(i);
          return (
            <React.Fragment key={nome}>
              <Escrito x={x} y={y + 22 * u} p={ramp(t, 0.2 + i * 0.5, 0.8 + i * 0.5)} tamanho={66} cor={i === 0 ? 'branco' : 'azul'}>
                {nome}
              </Escrito>
              <Seta
                de={[lugar(i)[0] + (lugar((i + 1) % 4)[0] - x) * 0.3, lugar(i)[1] + (lugar((i + 1) % 4)[1] - y) * 0.3]}
                ate={[lugar(i)[0] + (lugar((i + 1) % 4)[0] - x) * 0.7, lugar(i)[1] + (lugar((i + 1) % 4)[1] - y) * 0.7]}
                p={ramp(t, 0.6 + i * 0.5, 1.2 + i * 0.5)}
                cor="amarelo"
                curva={-0.5}
              />
            </React.Fragment>
          );
        })}
        <Escrito x={cx} y={cy + 30 * u} p={ramp(t, 2.6, 3.4)} tamanho={92} titulo cor="amarelo">
          de novo
        </Escrito>
      </Giz>
    </Tela>
  );
};

export const Video: React.FC = () => (
  <Filme
    tema={tema}
    fala={fala}
    cenas={cenasPorFrase(fala, [
      [0, 1, Copo, 0],
      [2, 2, SolEMar, 0],
      [3, 3, NasceANuvem, 0],
      [4, 4, CaiAChuva, 0],
      [5, 5, CresceAPlanta, 0],
      [6, 6, VoltaProMar, 0],
    ])}
  />
);
