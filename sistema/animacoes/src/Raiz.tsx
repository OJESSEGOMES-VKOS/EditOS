// O que o motor enxerga: cada vídeo de animação da oficina (sistema/oficina/), o exemplo do motor e o exemplo de cada estilo.
// As duas listas são geradas pelas ferramentas; não precisa mexer aqui.
import React from 'react';
import {Composition} from 'remotion';
import {ESTILOS} from './estilos.gerado';
import {FALA_EXEMPLO} from './kit/exemplo';
import type {PropsFolha} from './kit/Folha';
import {Folha, tamanhoDaFolha} from './kit/Folha';
import type {Formato} from './kit/tempo';
import {FORMATOS, FPS} from './kit/tempo';
import {VIDEOS} from './videos.gerado';

const quadros = (segundos: number) => Math.max(1, Math.round(segundos * FPS));

export const Raiz: React.FC = () => (
  <>
    {VIDEOS.map((v) => {
      const f = FORMATOS[(v.formato as Formato) ?? 'vertical'] ?? FORMATOS.vertical;
      return (
        <Composition key={v.id} id={v.id} component={v.Video} durationInFrames={quadros(v.fala.duracao)} fps={FPS} width={f.largura} height={f.altura} />
      );
    })}
    <Composition
      id="folha"
      component={Folha}
      durationInFrames={1}
      fps={FPS}
      width={600}
      height={600}
      defaultProps={{fotos: [], colunas: 1, largura: 300, altura: 533} as PropsFolha}
      calculateMetadata={({props}) => tamanhoDaFolha(props)}
    />
    {ESTILOS.map((e) => (
      <Composition
        key={e.id}
        id={`estilo-${e.id}`}
        component={e.Exemplo}
        durationInFrames={quadros(FALA_EXEMPLO.duracao)}
        fps={FPS}
        width={FORMATOS.vertical.largura}
        height={FORMATOS.vertical.altura}
      />
    ))}
  </>
);
