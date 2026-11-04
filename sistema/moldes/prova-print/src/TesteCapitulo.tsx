import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Capitulo} from './ui';

/** teste do capítulo (E4) para a folha de conferência: o texto aqui é de exemplo de componente, não de vídeo */
export const TesteCapitulo: React.FC = () => (
	<AbsoluteFill>
		<Capitulo de={0} rotulo="Ferramenta número" numero="1">
			<Img src={staticFile('prova-sobre.png')} style={{width: '100%'}} />
		</Capitulo>
	</AbsoluteFill>
);
