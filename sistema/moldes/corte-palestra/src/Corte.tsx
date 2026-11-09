import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadSans} from '@remotion/google-fonts/Montserrat';
import {loadFont as loadSerif} from '@remotion/google-fonts/PlayfairDisplay';
import PALAVRAS from './palavras.json'; // a fala do trecho recortado (scripts/recortar.py): [{text,start,end}]
import ROSTO from './rosto.json'; // [[t,cx,cy,h]] a cada 0,25 s, em fração do quadro, no tempo do corte
import EMENDAS from './emendas.json'; // instantes (s) em que o recorte junta dois pedaços da gravação

/**
 * Molde do corte-palestra (../../modelos/corte-palestra/corte-palestra.md): um pensamento inteiro recortado da
 * gravação longa, legenda pequena e quieta num lugar só, a palavra-resposta acendendo em serifa itálica (densa no
 * gancho, rara no corpo) e a última frase respirando. A gravação entra como veio: sem zoom, sem cor, sem recorte.
 */
export const FPS = 30;
const _ps = (PALAVRAS as {text: string; start: number; end: number}[]).map((p) => ({texto: p.text, de: p.start, ate: p.end}));
if (!_ps.length) throw new Error('src/palavras.json está vazio: rode scripts/ponto.py e scripts/recortar.py (corte-palestra.md, seção 9).');

/* ================================================================ O PLANO (num vídeo novo, refazer daqui até PEDACOS)
 * FOLGA: quanto a imagem segue depois da última palavra (a última frase respira 1 a 2 s; scripts/recortar.py lê daqui).
 * ESCURECE: true = a imagem escurece até o preto com a última página ainda na tela (ref1); false = segura a imagem (ref2).
 * GANCHO_ATE: onde acaba o gancho (s). Antes dele o destaque é denso; depois, raro (o checador conta).
 * COR: a cor do destaque colorido, escolhida CONTRA o fundo da gravação (scripts/cor.py mede e sugere).
 * REENQUADRA_EMENDAS: opção desligada; liga um corte de reenquadramento (1,0 ↔ 1,08) em cada emenda do recorte. */
const FOLGA = 1.6;
const ESCURECE = true;
const GANCHO_ATE = 9.0;
const COR = '#6D87C5'; // scripts/cor.py: fundo bege quase sem cor, camiseta preta atrás da legenda (contraste 4,6:1)
const REENQUADRA_EMENDAS = false;
/* PEDACOS: as páginas, na ordem da fala: [índice da 1ª palavra em src/palavras.json, 'texto', até (s)?].
 * O texto é o que foi DITO (a transcrição errou? escreva o certo e use tools/trocar.py). ' / ' quebra a linha.
 * Marcas (só onde o modelo pede destaque, corte-palestra.md seção 4):
 *   *palavra*  serifa itálica grande na COR (a palavra da pergunta, a resposta-chave da pergunta retórica)
 *   _palavra_  serifa itálica grande branca (a resposta em imperativo, a palavra de peso sobre fundo frio)
 * Página sem marca = legenda: no máximo 2 linhas, um trecho só (nunca atravessa . , ? ! :). Página com marca = bloco: até
 * 4 linhas (degraus), monta-se palavra por palavra com a voz e zera na próxima página. */
const PEDACOS: [number, string, number?][] = [
	// gancho (contradição): "é mais um vídeo editado pelo Claude Code… mas não é como os outros, todos iguais."
	[0, 'Esse é mais um daqueles / vídeos que você vê por aí / totalmente editados pelo / _Claude Code._'],
	[16, 'Mas talvez você esteja / estranhando'],
	[21, 'que ele não é / exatamente como os outros,'],
	[29, 'todos / *iguais.*'],
	// corpo: a resposta ("sistema próprio") e a sentença de peso ("editáveis") acendem; depois, só legenda até o fim
	[31, 'Isso porque eu criei / um sistema de edição / *próprio* / que reúne vários modelos'],
	[44, 'de edição que o Claude / usa e foge'],
	[52, 'do copia e cola que / todos mostram.'],
	[59, 'Mas o melhor disso tudo / é que todos eles são / *editáveis*'],
	[70, 'e você também pode criar / os seus próprios modelos.'],
	[79, 'você pode usar os modelos / ou criar modelos'],
	[87, 'para editar os vídeos / dos seus clientes'],
	[94, 'ou até mesmo os seus / próprios vídeos.'],
	// fecho: a palavra que resolve fica na legenda comum e respira
	[101, 'quem decide é você.'],
];

/* ================================================================ daqui para baixo, o modelo (não muda por vídeo) */
export const DURACAO = Number((_ps[_ps.length - 1].ate + FOLGA).toFixed(2));
export const QUADROS = Math.floor(DURACAO * FPS);
export const FIM_VIDEO = QUADROS / FPS;
export const FIM_FALA = _ps[_ps.length - 1].ate;
export const P = {duracao: DURACAO, palavras: _ps, folga: FOLGA, escurece: ESCURECE, ganchoAte: GANCHO_ATE};
export const EM = EMENDAS as number[];
export type Props = {soTexto?: boolean};

/* Zona segura 9:16 (regras da casa): nenhum texto nos 250 px de cima, nos 420 de baixo, nos 140 da direita nem nos 60 da
 * esquerda. O centro do texto é o da zona (x 500), não o do quadro. */
export const ZONA = {topo: 250, base: 1920 - 420, esq: 60, dir: 1080 - 140};
/* A altura de leitura medida (ref1: centro da legenda a 67% da altura, no peito/barriga, a mesma no vídeo inteiro).
 * Legenda e blocos centrados nela: uma posição só. */
export const Y_CENTRO = Math.round(1920 * 0.67);
export const TAM = {sans: 56, serif: 128}; // ref1: maiúscula 39 px → corpo ~56; serifa ~2,3x (115 px de altura medidos)
const LH = {sans: 1.15, serif: 0.98};

const sans = loadSans('normal', {weights: ['700'], subsets: ['latin']});
const serif = loadSerif('italic', {weights: ['700'], subsets: ['latin']});
const BRANCO = '#FFFFFF';
/* G16: sem contorno nem sombra justa. Só uma sombra larga e bem suave, que não desenha a borda da letra. */
const SOMBRA = '0 8px 64px rgba(0,0,0,0.34)';
const tw = (t: number, a: number, b: number, v0: number, v1: number, e = Easing.bezier(0.16, 1, 0.3, 1)) =>
	interpolate(t, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

type Pal = {texto: string; de: number; ate: number};
const PS: Pal[] = _ps;
export const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9%]/g, '');
const errPlano = (oque: string) =>
	new Error(`O plano de src/Corte.tsx não bate com a fala de src/palavras.json (${PS.length} palavras). Na lista PEDACOS: ${oque}. Refaça o plano para a fala nova (modelos/corte-palestra/corte-palestra.md, seção 9).`);
const c = (t: number) => t - 1 / FPS; // a página nasce 1 quadro antes da palavra (sincronia ±2 quadros)

type Tok = {txt: string; i: number; estilo: 'sans' | 'cor' | 'branca'};
export type Pagina = {linhas: Tok[][]; de: number; ate: number; is: number[]; tipo: 'legenda' | 'destaque'; altura: number};
export const PAGINAS: Pagina[] = PEDACOS.map(([i0, txt, ate], j) => {
	if (!PS[i0]) throw errPlano(`a página "${txt}" começa na palavra ${i0}, mas a fala só vai até a ${PS.length - 1}`);
	let i = i0;
	let aberto: Tok['estilo'] = 'sans';
	const linhas = txt.split(' / ').map((l) =>
		l.split(' ').map((bruto) => {
			let p = bruto;
			let estilo = aberto;
			if (p.startsWith('*')) (estilo = 'cor'), (p = p.slice(1));
			else if (p.startsWith('_')) (estilo = 'branca'), (p = p.slice(1));
			aberto = estilo;
			if (p.endsWith('*') || p.endsWith('_')) (p = p.slice(0, -1)), (aberto = 'sans');
			if (!PS[i]) throw errPlano(`a página "${txt}" passa da última palavra da fala ("${p}")`);
			return {txt: p, i: i++, estilo};
		})
	);
	const prox = PEDACOS[j + 1];
	const tipo = linhas.flat().some((x) => x.estilo !== 'sans') ? 'destaque' : 'legenda';
	const altura = linhas.reduce((s, l) => s + (l.some((x) => x.estilo !== 'sans') ? TAM.serif * LH.serif : TAM.sans * LH.sans), 0);
	if (prox && prox[0] !== i) throw errPlano(`a página "${txt}" acaba na palavra ${i - 1} ("${PS[i - 1].texto}") e a próxima começa na ${prox[0]}: toda palavra entra numa página, uma vez, em ordem`);
	if (!prox && i !== PS.length) throw errPlano(`a última página acaba na palavra ${i - 1}, mas a fala vai até a ${PS.length - 1}`);
	// sem "até", a página fica até a próxima começar; se uma emenda do recorte cai no meio, ela acaba na emenda (nada
	// atravessa um corte seco)
	const seguinte = prox ? c(PS[prox[0]].de) : FIM_VIDEO + 1;
	const emenda = EM.find((e) => e > PS[i - 1].de && e < seguinte);
	return {linhas, de: Math.max(0, c(PS[i0].de)), ate: ate ?? emenda ?? seguinte, is: linhas.flat().map((x) => x.i), tipo, altura};
});
// a fala escrita confere com a dita (sem acento, maiúscula nem pontuação)
PAGINAS.forEach((g) =>
	g.linhas.flat().forEach((x) => {
		if (norm(x.txt) !== norm(PS[x.i].texto))
			throw errPlano(`na página "${g.linhas.map((l) => l.map((y) => y.txt).join(' ')).join(' / ')}", "${x.txt}" não bate com a palavra ${x.i} da fala ("${PS[x.i].texto}"). Se a transcrição errou, corrija com tools/trocar.py`);
	})
);

/* ---------------------------------------------------------------- a gravação, como veio */
const Video: React.FC<{t: number}> = ({t}) => {
	const k = REENQUADRA_EMENDAS ? EM.filter((e) => t >= e).length : 0;
	return (
		<AbsoluteFill style={{transform: `scale(${k % 2 ? 1.08 : 1})`, transformOrigin: '540px 700px'}}>
			<OffthreadVideo muted src={staticFile('fala.mp4')} style={{width: 1080, height: 1920}} />
		</AbsoluteFill>
	);
};

/* ---------------------------------------------------------------- fecho: a última frase respira */
const Preto: React.FC<{t: number}> = ({t}) => {
	if (!ESCURECE || t < FIM_FALA + 0.4) return null;
	return <AbsoluteFill style={{background: '#000', opacity: tw(t, FIM_FALA + 0.4, FIM_FALA + 1.2, 0, 1, Easing.linear)}} />;
};

/* ---------------------------------------------------------------- a página da vez (legenda ou bloco) */
const Pag: React.FC<{t: number}> = ({t}) => {
	const pg = PAGINAS.find((g) => t >= g.de && t < g.ate);
	if (!pg) return null;
	const sai = tw(t, pg.ate - 0.08, pg.ate, 0, 1, Easing.linear);
	return (
		// a página é centrada na zona (x 500), mas dentro dela as linhas se alinham à esquerda: a linha que se monta palavra a
		// palavra cresce da margem, como escrita, em vez de nascer fora do centro (revisão de diretor da vitrine: "do" sozinho
		// no canto, à espera das palavras invisíveis da linha centrada)
		<div style={{position: 'absolute', left: (ZONA.esq + ZONA.dir) / 2, transform: 'translateX(-50%)', width: 'max-content', maxWidth: ZONA.dir - ZONA.esq, top: Y_CENTRO - pg.altura / 2, textAlign: 'left', opacity: 1 - sai}}>
			{pg.linhas.map((l, j) => {
				const grande = l.some((x) => x.estilo !== 'sans');
				return (
					<div key={j} style={{whiteSpace: 'nowrap', height: grande ? TAM.serif * LH.serif : TAM.sans * LH.sans, lineHeight: `${grande ? TAM.serif * LH.serif : TAM.sans * LH.sans}px`}}>
						{l.map((x, m) => {
							const ser = x.estilo !== 'sans';
							const e = tw(t, PS[x.i].de - 0.04, PS[x.i].de + (ser ? 0.16 : 0.1), 0, 1);
							return (
								<span
									key={m}
									style={{
										display: 'inline-block',
										marginLeft: m ? (ser ? 22 : 14) : 0,
										fontFamily: ser ? serif.fontFamily : sans.fontFamily,
										fontStyle: ser ? 'italic' : 'normal',
										fontWeight: 700,
										fontSize: ser ? TAM.serif : TAM.sans,
										letterSpacing: ser ? '-0.01em' : '-0.01em',
										color: x.estilo === 'cor' ? COR : BRANCO,
										textShadow: SOMBRA,
										verticalAlign: 'baseline',
										opacity: e,
										transform: `translateY(${(1 - e) * (ser ? 14 : 8)}px)`,
										filter: ser && e < 1 ? `blur(${(1 - e) * 8}px)` : undefined,
									}}
								>
									{x.txt}
								</span>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

/* ---------------------------------------------------------------- conferência (scripts/cobertura.mjs) */
/** queixo (px) mais baixo entre de e ate, medido em src/rosto.json (com o reenquadramento, se ligado) */
const RT = ROSTO as number[][];
const CY_MED = (() => { const v = RT.filter((r) => r[3] > 0).map((r) => r[2]).sort((a, b) => a - b); return v.length ? v[v.length >> 1] : 0; })();
export const queixoEntre = (de: number, ate: number) => {
	// um quadro em que o detector achou outro "rosto" (a mão, um reflexo) longe da mediana não conta
	let y = 0;
	for (const [tt, , cy, h] of RT) if (tt >= de - 0.25 && tt <= ate && h > 0 && Math.abs(cy - CY_MED) < 0.15) {
		const k = REENQUADRA_EMENDAS && EM.filter((e) => tt >= e).length % 2 ? 1.08 : 1;
		y = Math.max(y, 700 + ((cy + h / 2) * 1920 - 700) * k);
	}
	return y;
};
export const exibicoes = () =>
	PAGINAS.map((g) => ({
		nome: g.linhas.map((l) => l.map((x) => (x.estilo === 'cor' ? `*${x.txt}*` : x.estilo === 'branca' ? `_${x.txt}_` : x.txt)).join(' ')).join(' / '),
		tipo: g.tipo,
		is: g.is,
		de: g.de,
		ate: Math.min(g.ate, FIM_VIDEO),
		linhas: g.linhas.length,
		topo: Y_CENTRO - g.altura / 2,
		pe: Y_CENTRO + g.altura / 2,
		destaques: g.linhas.flat().filter((x) => x.estilo !== 'sans').map((x) => ({i: x.i, txt: x.txt})),
		texto: g.linhas.flat().map((x) => x.txt).join(' '),
	}));
export const palavrasNaTela = (t: number): number[] => {
	const pg = PAGINAS.find((g) => t >= g.de && t < g.ate);
	return pg ? pg.is.filter((i) => t >= PS[i].de - 0.02) : [];
};

export const Corte: React.FC<Props> = ({soTexto = false}) => {
	const t = useCurrentFrame() / FPS;
	return (
		<AbsoluteFill style={{background: soTexto ? 'transparent' : '#000'}}>
			{!soTexto && <Video t={t} />}
			{!soTexto && <Preto t={t} />}
			<Pag t={t} />
		</AbsoluteFill>
	);
};
