import React from 'react';
import {AbsoluteFill} from 'remotion';
import {LIVRES, Livre} from './plano';
import {COR, tw} from './ui';
import {TELAS} from './telas';

/**
 * As telas livres: a tela de gelo que a fala nova pede e o aprovado não tem (o plano diz `LIVRES = [...]` no bloco O
 * PLANO de src/plano.ts; o desenho mora em src/telas/ da pasta do vídeo, registrado em src/telas/index.ts). É o mesmo
 * lugar da grade e da conta: o gelo inteiro, o desenho dentro do <Palco> (x 55 a 1025, y 90 a 1248) e o rosto no cartão
 * do canto (a chave POSE.cartao, com o giro, no `de`). A tela aproxima até 104% até sair, como a grade.
 */
export type LivreProps = {t: number; L: Livre; em: Record<string, number>; textos: Record<string, string>; dados: Record<string, unknown>};

const tela = (L: Livre) => {
	const Comp = (TELAS as Record<string, React.FC<LivreProps>>)[L.comp];
	if (!Comp) throw new Error(`\n\n[youtube-didatico] a tela livre "${L.comp}" do plano não está registrada em src/telas/index.ts (skill youtube-didatico, "A invenção")\n`);
	return Comp;
};

export const Livres: React.FC<{t: number}> = ({t}) => (
	<>
		{LIVRES.map((L, k) => {
			if (t < L.de || t >= L.ate) return null;
			const Comp = tela(L);
			const z = tw(t, L.de + 0.6, L.ate, 1, 1.04);
			return (
				<AbsoluteFill key={k} style={{background: COR.gelo}}>
					<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 30%'}}>
						<Comp t={t} L={L} em={L.em ?? {}} textos={L.textos ?? {}} dados={L.dados ?? {}} />
					</AbsoluteFill>
				</AbsoluteFill>
			);
		})}
	</>
);
