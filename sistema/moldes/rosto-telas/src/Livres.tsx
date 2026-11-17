import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, LIVRES, Livre, fundoClaro, useT, vidaLivre} from './tema';
import {Painel} from './ui';
import {Titulo, paginasDe} from './Editor';
import {TELAS} from './telas';

/**
 * As telas livres: a tela que a fala nova pede e o aprovado não tem (o plano diz `livres=[...]` em
 * scripts/gerar_tempos.py; o desenho mora em src/telas/ da pasta do vídeo, registrado em src/telas/index.ts).
 * - dividido: o painel marfim de cima (entra já preenchido e sai no `sai`), o rosto embaixo, a legenda na pílula;
 * - cheia: tela marfim inteira; o título no topo é o texto dito (titulo = 1ª palavra e grupos); o rosto some, ou mora na
 *   moldura `rosto = {x, y, w}` (9:16, como a prévia do editor).
 * A tela recebe os instantes do plano (`em`), os textos (`textos`) e o resto (`dados`).
 */
export type LivreProps = {t: number; L: Livre; em: Record<string, number>; textos: Record<string, string>; dados: Record<string, unknown>};

const tela = (L: Livre) => {
	const Comp = (TELAS as Record<string, React.FC<LivreProps>>)[L.comp];
	if (!Comp) throw new Error(`a tela livre "${L.comp}" do plano não está registrada em src/telas/index.ts (modelos/rosto-telas/rosto-telas.md, seção 9)`);
	return Comp;
};

/** as páginas de título de cada tela livre cheia (o texto dito, como no editor) */
export const PAG_LIVRES = LIVRES.map((L) => ({L, pags: L.modo === 'cheia' && L.titulo ? paginasDe(L.titulo.i0, L.titulo.grupos) : []}));

/** embaixo do rosto: o marfim da tela cheia e o fundo escuro da moldura do rosto */
export const LivresFundo: React.FC = () => {
	const {t} = useT();
	return (
		<>
			{LIVRES.map((L, k) => {
				if (L.modo !== 'cheia') return null;
				const v = vidaLivre(t, L);
				if (v <= 0) return null;
				const r = L.rosto;
				return (
					<AbsoluteFill key={k} style={{...fundoClaro, opacity: Math.min(1, v * 1.4)}}>
						{r ? <div style={{position: 'absolute', left: r.x - 12, top: r.y - 12, width: r.w + 24, height: (1920 * r.w) / 1080 + 24, borderRadius: 34, background: C.papel, boxShadow: '0 24px 50px rgba(60,48,30,0.22)'}} /> : null}
					</AbsoluteFill>
				);
			})}
		</>
	);
};

/** em cima do rosto: o painel dividido ou a tela cheia com o título dito */
export const LivresFrente: React.FC = () => {
	const {t} = useT();
	return (
		<>
			{LIVRES.map((L, k) => {
				const Comp = tela(L);
				const props: LivreProps = {t, L, em: L.em ?? {}, textos: L.textos ?? {}, dados: L.dados ?? {}};
				if (L.modo === 'dividido') {
					// vem direto de outra tela livre (mesmo marfim): aparece no lugar em vez de descer
					const funde = LIVRES.some((o) => o !== L && Math.abs(o.sai - L.de) < 0.05);
					return (
						<Painel key={k} de={L.de} ate={L.sai} funde={funde}>
							<Comp {...props} />
						</Painel>
					);
				}
				const v = vidaLivre(t, L);
				if (v <= 0) return null;
				const pags = PAG_LIVRES[k].pags;
				return (
					<AbsoluteFill key={k} style={{opacity: v}}>
						{L.rosto ? null : <AbsoluteFill style={fundoClaro} />}
						<Titulo t={t} paginas={pags} />
						<Comp {...props} />
					</AbsoluteFill>
				);
			})}
		</>
	);
};
