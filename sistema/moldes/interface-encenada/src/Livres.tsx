import React from 'react';
import {LIVRES, Livre, useT} from './tema';
import {CardPalco, Dividido, RostoPalco, Titulo} from './ui';
import {TELAS} from './telas';

/**
 * As telas livres: a interface que a fala nova pede e o aprovado não tem (o plano diz `livres = [...]` no bloco "O PLANO"
 * de src/tema.ts; o desenho mora em src/telas/ da pasta do vídeo, registrado em src/telas/index.ts). O modo dá a moldura
 * da casa, a tela livre só desenha o miolo dentro do <Palco>:
 * - palco: o título de 1 linha no topo (o texto dito), o card no meio (papel ou `escuro`), o rosto no card de baixo;
 * - dividido: a interface em cima, o rosto embaixo, a legenda na etiqueta mono da divisa;
 * - motion: um visual grande sobre o creme, sem câmera (topo: true sobe a legenda para y 250).
 * A tela recebe os instantes do plano (`em`), os textos (`textos`) e o resto (`dados`).
 */
export type LivreProps = {t: number; L: Livre; em: Record<string, number>; textos: Record<string, string>; dados: Record<string, unknown>};

// confere ao carregar: toda tela livre do plano está registrada
for (const L of LIVRES)
	if (!(TELAS as Record<string, unknown>)[L.comp])
		throw new Error(`a tela livre "${L.comp}" do plano não está registrada em src/telas/index.ts (modelos/interface-encenada/interface-encenada.md, seção 9)`);

export const LivreCena: React.FC<{L: Livre; ate: number}> = ({L, ate}) => {
	const {t} = useT();
	const Comp = (TELAS as Record<string, React.FC<LivreProps>>)[L.comp];
	const props: LivreProps = {t, L, em: L.em ?? {}, textos: L.textos ?? {}, dados: L.dados ?? {}};
	if (L.modo === 'palco')
		return (
			<>
				{L.titulo ? <Titulo serif={L.titulo} de={L.de} ate={ate} /> : null}
				<CardPalco escuro={L.escuro} de={L.de}>
					<Comp {...props} />
				</CardPalco>
				<RostoPalco />
			</>
		);
	if (L.modo === 'dividido')
		return (
			<Dividido>
				<Comp {...props} />
			</Dividido>
		);
	return <Comp {...props} />;
};
