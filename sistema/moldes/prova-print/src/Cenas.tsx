import React from 'react';
import {OffthreadVideo, staticFile} from 'remotion';
import {C, CASA, COMANDO, G, P, Props, SANS, SERIF, cenaEm, mola, useT, w} from './tema';
import type {Cena} from './tema';
import {ContadorDa, ImgFundo, Palco, Pessoa, Prova, RostoFechado, Vitrine} from './ui';
import {TELAS} from './telas';

/**
 * As telas do vídeo (prova-print.md §9). Cena 'pessoa' é o vídeo normal; 'rosto' é o rosto fechado (com FECHO, o comando
 * do pedido); as outras mostram uma TELA: uma tela livre (src/telas/, a prova que a fala nova pede, com o kit de src/ui.tsx)
 * ou uma tela da casa ligada no plano. As telas da casa abaixo são as do vídeo aprovado: exemplos com o porquê, presos aos
 * prints do repositório do EditOS (public/prova-*.png, origem em public/ORIGEM.md). Num vídeo novo elas só voltam com a
 * linha `<tela> = true` no plano e o mesmo porquê na fala; o normal é a tela livre com o print real do vídeo novo (G25).
 */
const PV = {
	readme: {src: 'prova-readme.png', larg: 1320},
	sobre: {src: 'prova-sobre.png', larg: 1320},
	modelos: {src: 'prova-modelos.png', larg: 1320},
	passos: {src: 'prova-passos.png', larg: 1320},
};

/* ---------------------------------------------------------------- as telas da casa (as do aprovado: exemplos com o porquê) */
/** gancho: o título-promessa diz a frase (as palavras dele saem da legenda, PV4); o card mostra a prova (o README real) com o
 * grifo na frase que diz o mesmo. Sem contador aqui: o número já está no título (PV4: um elemento por ideia) */
const Gancho: React.FC<{c: Cena}> = ({c}) => (
	<Palco c={c}>
		<Prova
			{...PV.readme}
			caixaW={G.cardPalcoTitulo.w - 8}
			vistas={[{at: 0, x: 84, y: 232, w: 1145}]}
			grifos={[
				{at: w('editado'), x: 356, y: 300, w: 408, h: 62},
				{at: w('claude'), x: 912, y: 492, w: 280, h: 60},
			]}
		/>
	</Palco>
);
const Criado: React.FC<{c: Cena}> = ({c}) => (
	<Vitrine c={c} fundo={<ImgFundo src={PV.sobre.src} />}>
		<Prova {...PV.sobre} caixaW={G.cardVitrine.w - 8} vistas={[{at: 0, x: 30, y: 0, w: 1090}]} grifos={[{at: w('criado'), x: 300, y: 512, w: 610, h: 66}]} />
	</Vitrine>
);
const Modelos: React.FC<{c: Cena}> = ({c}) => (
	<Palco c={c}>
		<Prova
			{...PV.modelos}
			caixaW={G.cardPalco.w - 8}
			vistas={[
				{at: 0, x: 10, y: 30, w: 820},
				{at: w('criei'), x: 10, y: 420, w: 820},
			]}
			grifos={[{at: w('modelos'), x: 455, y: 70, w: 200, h: 70}]}
		/>
	</Palco>
);
const Editar: React.FC<{c: Cena}> = ({c}) => (
	<Vitrine c={c} fundo={<ImgFundo src={PV.sobre.src} />}>
		<Prova
			{...PV.sobre}
			caixaW={G.cardVitrine.w - 8}
			vistas={[{at: 0, x: 30, y: 0, w: 1090}]}
			grifos={[
				{at: w('vídeo', 2), x: 44, y: 440, w: 610, h: 66},
				{at: w('claude', 2), x: 800, y: 440, w: 284, h: 66},
			]}
		/>
	</Vitrine>
);
/** "você está vendo apenas um desses modelos": a pasta real dos modelos, a câmera começa no meio da lista e sobe até o caminho
 * em "apenas", e o grifo nasce no "modelos" quando a palavra é dita (a vitrine fica sem rosto: a 1ª versão punha este vídeo no card e
 * duplicava a pessoa) */
const Vendo: React.FC<{c: Cena}> = ({c}) => (
	<Vitrine c={c} fundo={<ImgFundo src={PV.modelos.src} />}>
		<Prova
			{...PV.modelos}
			caixaW={G.cardVitrine.w - 8}
			vistas={[
				{at: 0, x: 10, y: 760, w: 900},
				{at: w('apenas'), x: 10, y: 30, w: 900},
			]}
			grifos={[{at: w('modelos', 2), x: 455, y: 70, w: 200, h: 70}]}
		/>
	</Vitrine>
);
/** as prévias: dois vídeos do próprio criador lado a lado (prop previas); sem elas, o card segura a prova do gancho */
const DuasPrevias: React.FC<{de1: number; de2: number; alt: number}> = ({de1, de2, alt}) => {
	const {t} = useT();
	const larg = (alt * 9) / 16;
	return (
		<div style={{position: 'absolute', inset: 0, background: '#0B0D12', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22}}>
			{[
				['previa1.mp4', de1],
				['previa2.mp4', de2],
			].map(([src, de], i) => {
				const e = mola(t, de as number, {damping: 17});
				return (
					<div key={i} style={{width: larg, height: alt, borderRadius: 18, overflow: 'hidden', opacity: Math.min(1, e * 1.6), transform: `translateY(${(1 - e) * 50}px)`}}>
						<OffthreadVideo muted src={staticFile(src as string)} style={{width: larg, height: alt, objectFit: 'cover'}} />
					</div>
				);
			})}
		</div>
	);
};
const Previas: React.FC<{c: Cena}> = ({c}) => {
	const {previas} = React.useContext(Props);
	return (
		<Palco c={c}>
			{previas ? (
				<DuasPrevias de1={c.de + 0.1} de2={c.de + 0.25} alt={G.cardPalco.h - 40} />
			) : (
				<Prova {...PV.readme} caixaW={G.cardPalco.w - 8} vistas={[{at: 0, x: 105, y: 0, w: 1100}]} grifos={[{at: w('colocar'), x: 96, y: 560, w: 725, h: 64}]} />
			)}
		</Palco>
	);
};
const Tres: React.FC<{c: Cena}> = ({c}) => {
	const {previas} = React.useContext(Props);
	return (
		<>
			<Vitrine c={c} fundo={previas ? <OffthreadVideo muted src={staticFile('previa1.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <ImgFundo src={PV.readme.src} />}>
				{previas ? <DuasPrevias de1={c.de} de2={c.de} alt={G.cardVitrine.h - 60} /> : <Prova {...PV.readme} caixaW={G.cardVitrine.w - 8} vistas={[{at: 0, x: 60, y: 0, w: 1100}]} />}
			</Vitrine>
			{/* "três vezes": o contador chega no 3 junto com a palavra (CONTADORES em src/tema.ts) */}
			<ContadorDa c={c} />
		</>
	);
};
const Outros: React.FC<{c: Cena}> = ({c}) => (
	<Palco c={c}>
		<Prova
			{...PV.modelos}
			caixaW={G.cardPalco.w - 8}
			vistas={[
				{at: 0, x: 10, y: 30, w: 820},
				{at: w('como'), x: 10, y: 900, w: 820},
			]}
			grifos={[{at: w('modelos', 3), x: 455, y: 70, w: 200, h: 70}]}
		/>
	</Palco>
);
const Aprender: React.FC<{c: Cena}> = ({c}) => (
	<Vitrine c={c} fundo={<ImgFundo src={PV.passos.src} />}>
		<div style={{position: 'absolute', inset: 0, background: C.branco}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 170}}>
				<Prova {...PV.passos} caixaW={G.cardVitrine.w - 8} vistas={[{at: 0, x: 80, y: 40, w: 1000}, {at: w('isso'), x: 70, y: 40, w: 975}]} grifos={[{at: w('como', 2), x: 96, y: 85, w: 520, h: 90}]} />
			</div>
		</div>
	</Vitrine>
);
/* ---------------------------------------------------------------- as cenas de rosto (servem a qualquer fala) */
/** rosto fechado da emoção (a dor, o benefício, a virada): só o punch-in */
const Emocao: React.FC<{c: Cena}> = ({c}) => <RostoFechado de={c.de} />;
/** fecho (E11): rosto fechado; a chamada pequena em serifa itálica e a palavra do pedido entre aspas, grande, amarela,
 * SEM brilho (G16), as duas ditas (comando() no plano). Fixo só o comando; o resto da fala segue na legenda. */
const Fecho: React.FC<{c: Cena}> = ({c}) => {
	const {t} = useT();
	if (!COMANDO) return <RostoFechado de={c.de} fecho />;
	const a = mola(t, P.palavras[COMANDO.ids[0]].de, {damping: 15});
	const b = mola(t, P.palavras[COMANDO.ids[COMANDO.ids.length - 1]].de, {damping: 13});
	return (
		<>
			<RostoFechado de={c.de} fecho />
			<div style={{position: 'absolute', left: 60, width: 880, top: 958, textAlign: 'center'}}>
				<div style={{fontFamily: SERIF, fontSize: 64, lineHeight: '60px', color: C.branco, opacity: Math.min(1, a * 1.5), transform: `translateY(${(1 - a) * 14}px)`, textShadow: '0 6px 48px rgba(0,0,0,0.5)'}}>{COMANDO.chamada}</div>
				<div style={{fontFamily: SANS, fontWeight: 800, fontSize: 100, lineHeight: '108px', letterSpacing: '-0.03em', color: C.amarelo, opacity: Math.min(1, b * 1.5), transform: `scale(${0.7 + 0.3 * b})`, textShadow: '0 6px 48px rgba(0,0,0,0.45)'}}>{COMANDO.pedido}</div>
			</div>
		</>
	);
};

/** a pessoa (G12): toda cena de modo 'pessoa' é o vídeo normal; a legenda vem por cima, no lugar de sempre */
export const CenaPessoa: React.FC<{c: Cena}> = () => <Pessoa />;

/** as telas da casa (as do aprovado), pelo nome. As de palco (gancho, modelos, previas, outros) só rodam com fundo: 'recorte' */
const DA_CASA: Record<string, React.FC<{c: Cena}>> = {
	gancho: Gancho,
	criado: Criado,
	modelos: Modelos,
	editar: Editar,
	vendo: Vendo,
	previas: Previas,
	tres: Tres,
	outros: Outros,
	aprender: Aprender,
};
/** o que desenha a cena: pessoa, rosto (emoção ou fecho), a tela livre registrada em src/telas/index.ts ou a tela da casa
 * ligada no plano (`<tela> = true`). Tela que não é nenhuma das duas para com o que fazer. */
export const telaDe = (c: Cena): React.FC<{c: Cena}> => {
	if (c.modo === 'pessoa') return CenaPessoa;
	if (c.modo === 'rosto') return c.fecho ? Fecho : Emocao;
	const livre = (TELAS as Record<string, React.FC<{c: Cena}>>)[c.tela ?? ''];
	if (livre) return livre;
	if (c.tela && DA_CASA[c.tela]) {
		if (!CASA[c.tela]) throw new Error(`a cena ${c.id} usa a tela da casa "${c.tela}" (do aprovado, com os prints do EditOS) sem ligar: ponha \`${c.tela} = true\` no plano (src/tema.ts) só se a fala nova tiver o mesmo porquê; o normal é uma tela livre em src/telas/ com o print real deste vídeo`);
		return DA_CASA[c.tela];
	}
	throw new Error(`a tela "${c.tela}" da cena ${c.id} não existe: escreva src/telas/${c.tela}.tsx e registre em src/telas/index.ts (skill prova-print, "A invenção")`);
};
export {cenaEm};
