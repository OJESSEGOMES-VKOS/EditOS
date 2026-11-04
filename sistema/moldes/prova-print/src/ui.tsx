import React from 'react';
import {Freeze, Img, OffthreadVideo, staticFile} from 'remotion';
import {C, E, G, P, R, SANS, SERIF, SOMBRA, TITULO, mola, rostoX, tw, useT} from './tema';

/** o vídeo pode acabar antes da fala: daí em diante segura o penúltimo quadro de public/fala.mp4 */
const ULTIMO = R.quadros - 2;

/** a fala da pessoa (muda: o som entra uma vez só); recorte: a pessoa recortada (public/pessoa.webm, scripts/recorte.py) */
export const Fala: React.FC<{s?: number; x?: number; y?: number; recorte?: boolean}> = ({s = 1, x = 0, y = 0, recorte}) => {
	const {f} = useT();
	const v = recorte ? (
		<OffthreadVideo muted transparent src={staticFile('pessoa.webm')} style={{width: 1080, height: 1920}} />
	) : (
		<OffthreadVideo muted src={staticFile('fala.mp4')} style={{width: 1080, height: 1920}} />
	);
	return (
		<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `translate(${x}px, ${y}px) scale(${s})`}}>
			{f < ULTIMO ? v : <Freeze frame={ULTIMO}>{v}</Freeze>}
		</div>
	);
};
/** onde a gravação fica para os olhos caírem em (cx, oy) da caixa, seguindo o rosto pelo caminho alisado (PV7) e sem
 * nunca deixar borda da gravação aparecer dentro da caixa (larg x alt) */
export const enquadra = (t: number, s: number, cx: number, oy: number, larg: number, alt: number) => ({
	x: Math.min(0, Math.max(larg - 1080 * s, cx - s * rostoX(t))),
	y: Math.min(0, Math.max(alt - 1920 * s, oy - s * R.olhos)),
});
/** enquadra o vídeo: escala s, olhos em (cx, oy) da caixa (larg x alt, padrão o quadro) */
export const FalaEm: React.FC<{s: number; cx: number; oy: number; larg?: number; alt?: number; recorte?: boolean}> = ({s, cx, oy, larg = 1080, alt = 1920, recorte}) => {
	const {t} = useT();
	return <Fala s={s} {...enquadra(t, s, cx, oy, larg, alt)} recorte={recorte} />;
};

/** título-promessa (ref1 0,25 s; ref4 0,5 s): linha preta em sans + linha em serifa itálica branca na caixa azul que se abre
 * da esquerda. Só na cena do gancho e some com o corte dela (PV5). Cada palavra nasce apagada e acende quando é dita (o
 * mesmo "apagada que acende" da legenda): as palavras do título não vão para a legenda (PV4). */
export const Titulo: React.FC = () => {
	const {t} = useT();
	if (t < TITULO.de || t >= TITULO.ate) return null;
	const de = TITULO.de;
	const a = tw(t, de, de + 0.2, 0, 1);
	const caixa = tw(t, de + 0.08, de + 0.36, 0, 1);
	const letra = tw(t, de + 0.2, de + 0.42, 0, 1);
	const n1 = TITULO.linha1.split(' ').length;
	const palavra = (txt: string, k: number) => {
		const p = P.palavras[TITULO.ids[k]];
		return (
			<span key={k} style={{opacity: tw(t, p.de - 0.03, p.de + 0.1, 0.38, 1)}}>
				{k === 0 || k === n1 ? '' : ' '}
				{txt}
			</span>
		);
	};
	return (
		<>
			<div style={{position: 'absolute', left: 60, width: 880, top: G.titulo1, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 84, lineHeight: '96px', letterSpacing: '-0.03em', color: C.tinta, opacity: a, transform: `translateY(${(1 - a) * 18}px)`}}>
				{TITULO.linha1.split(' ').map((x, k) => palavra(x, k))}
			</div>
			<div style={{position: 'absolute', left: 60, width: 880, top: G.titulo2, display: 'flex', justifyContent: 'center'}}>
				<div style={{position: 'relative', background: C.azul, borderRadius: 10, padding: '4px 30px 14px', clipPath: `inset(0 ${(1 - caixa) * 100}% 0 0 round 10px)`}}>
					<span style={{fontFamily: SERIF, fontSize: 108, lineHeight: '110px', color: C.branco, opacity: letra}}>{TITULO.linha2.split(' ').map((x, k) => palavra(x, n1 + k))}</span>
				</div>
			</div>
		</>
	);
};

/** o card: cantos 26, contorno azul fino (ref1: borda #1781E2 de ~4 px), sombra macia. entra subindo com mola, ou de lado
 * com borrão quando vem de outra cena do mesmo modo (E12: deslize com borrão, nunca cortina) */
export const Card: React.FC<{caixa: {x: number; y: number; w: number; h: number}; de: number; deLado?: boolean; children: React.ReactNode; fundo?: string}> = ({caixa, de, deLado, children, fundo = C.branco}) => {
	// deriva: o conteúdo do card aproxima 1,2% por segundo, para a tela nunca ficar parada (refs: maior trecho parado 0,7 a 1,4 s)
	const deriva = 1 + 0.012 * Math.max(0, useT().t - de);
	const {t} = useT();
	const e = deLado ? tw(t, de, de + 0.26, 0, 1) : mola(t, de, {damping: 18});
	const transform = deLado ? `translateX(${(1 - e) * 280}px)` : `translateY(${(1 - e) * 70}px) scale(${0.96 + 0.04 * e})`;
	return (
		<div
			style={{
				position: 'absolute',
				left: caixa.x,
				top: caixa.y,
				width: caixa.w,
				height: caixa.h,
				borderRadius: 26,
				background: fundo,
				border: `4px solid ${C.borda}`,
				boxShadow: SOMBRA,
				overflow: 'hidden',
				opacity: Math.min(1, e * 1.6),
				transform,
				filter: deLado ? `blur(${(1 - e) * 14}px)` : undefined,
			}}
		>
			<div style={{position: 'absolute', inset: 0, transformOrigin: '50% 30%', transform: `scale(${deriva})`}}>{children}</div>
		</div>
	);
};

export type Vista = {at: number; x: number; y: number; w: number}; // a janela do print (px do print) que enche o card a partir de at
export type Grifo = {at: number; x: number; y: number; w: number; h: number}; // marca-texto (px do print), nasce em at
/** prova real: o print inteiro dentro do card, com câmera que só viaja entre vistas (sobe/aproxima devagar, 0,6 s) e o grifo
 * que se desenha da esquerda pra direita em 0,35 s no instante da palavra (E7) */
export const Prova: React.FC<{src: string; larg: number; caixaW: number; vistas: Vista[]; grifos?: Grifo[]}> = ({src, larg, caixaW, vistas, grifos = []}) => {
	const {t} = useT();
	let v = vistas[0];
	for (let i = 1; i < vistas.length; i++) {
		const a = vistas[i - 1], b = vistas[i];
		if (t >= b.at) {
			const k = tw(t, b.at, b.at + 0.6, 0, 1, E.inOut);
			v = {at: b.at, x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, w: a.w + (b.w - a.w) * k};
		}
	}
	const s = caixaW / v.w;
	return (
		<div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${-v.x * s}px, ${-v.y * s}px) scale(${s})`}}>
			<Img src={staticFile(src)} style={{width: larg, display: 'block'}} />
			{grifos.map((g, i) => {
				const k = tw(t, g.at, g.at + 0.35, 0, 1);
				return k > 0 ? <div key={i} style={{position: 'absolute', left: g.x, top: g.y, width: g.w * k, height: g.h, background: C.grifo, borderRadius: 6, mixBlendMode: 'multiply'}} /> : null;
			})}
		</div>
	);
};

/** contador sobre a prova (E8): pílula escura, o número sobe de 0 até EXATAMENTE o número dito (G8) e para. sem brilho na
 * letra (G37). formato: prefixo + número + sufixo, como foi falado ("100%", "3 vezes") */
export const Contador: React.FC<{de: number; ate: number; valor: number; sufixo?: string; rotulo?: string; y: number}> = ({de, ate, valor, sufixo = '', rotulo, y}) => {
	const {t} = useT();
	if (t < de || t >= ate) return null;
	const e = mola(t, de, {damping: 15});
	const n = Math.round(tw(t, de, de + 0.75, 0, valor, E.out));
	return (
		<div style={{position: 'absolute', left: 60, width: 880, top: y, display: 'flex', justifyContent: 'center', opacity: Math.min(1, e * 1.5), transform: `scale(${0.7 + 0.3 * e})`}}>
			<div style={{background: C.pilula, borderRadius: 40, padding: '18px 64px 26px', textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.35)'}}>
				<div style={{fontFamily: SANS, fontWeight: 800, fontSize: 168, lineHeight: '178px', letterSpacing: '-0.04em', color: C.chaveEscuro, fontVariantNumeric: 'tabular-nums'}}>
					{n}
					{sufixo}
				</div>
				{rotulo && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 46, lineHeight: '54px', color: C.branco, letterSpacing: '-0.02em'}}>{rotulo}</div>}
			</div>
		</div>
	);
};

/** fundo da vitrine (E3): o próprio conteúdo do card ampliado, borrado e escurecido; sem rosto */
export const FundoVitrine: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div style={{position: 'absolute', inset: 0, background: C.escuro, overflow: 'hidden'}}>
		<div style={{position: 'absolute', inset: -120, filter: 'blur(46px) brightness(0.32) saturate(1.2)'}}>{children}</div>
		<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)'}} />
	</div>
);

/** o cartão de câmera do palco (PV8, ref4 0 a 4 s): cartão quase da largura da tela, cantos arredondados, sem contorno,
 * sangrando pela base, com a gravação (e o fundo dela) dentro; por cima, a pessoa recortada, mostrada só acima da borda de
 * cima: a cabeça sai da moldura. A cabeça fica inteira (PV6: topo medido em src/rosto_med.json, conferido pelo checador) e
 * a câmera segue o rosto pelo caminho alisado (PV7). */
export const RostoPalco: React.FC = () => {
	const {t} = useT();
	const g = G.rostoPalco;
	// olhos em y g.olhos; o x segue o rosto pelo caminho alisado, sem a borda da gravação aparecer dentro do cartão
	const e = {y: g.olhos - g.s * R.olhos};
	const x = Math.min(g.x, Math.max(g.x + g.w - 1080 * g.s, 540 - g.s * rostoX(t)));
	return (
		<>
			<div style={{position: 'absolute', left: g.x, top: g.y, width: g.w, height: g.h + 60, borderRadius: g.raio, overflow: 'hidden', background: '#000'}}>
				<Fala s={g.s} x={x - g.x} y={e.y - g.y} />
			</div>
			{/* a pessoa recortada, só acima da borda do cartão (+2 px de costura) */}
			<div style={{position: 'absolute', inset: 0, clipPath: `inset(0 0 ${1920 - g.y - 2}px 0)`}}>
				<Fala s={g.s} x={x} y={e.y} recorte />
			</div>
		</>
	);
};

/** rosto fechado (E5): punch-in; caixa do rosto (YuNet) a ~32% da altura do quadro e centro a ~37% do topo (medido nas 5 refs:
 * 31 a 32% e 37 a 44%); só na frase de emoção e no fecho. Aproximação contínua de 3% em 3 s (herança §4). */
export const RostoFechado: React.FC<{de: number; fecho?: boolean}> = ({de, fecho}) => {
	const {t} = useT();
	const alvo = (0.32 * 1920) / (R.largura * 1.3); // altura da caixa do rosto ~1,3 x a largura medida
	const s = alvo * (1 + 0.03 * tw(t, de, de + 3, 0, 1, (x) => x));
	// no fecho os olhos sobem (y 560) para o comando caber entre o queixo e a legenda
	return (
		<>
			<FalaEm s={s} cx={540} oy={fecho ? 560 : 670} />
			{/* faixa escura na base (ref Joseph DejD: desfoque e escurecimento na base): a legenda e o comando ficam legíveis sobre as mãos
			    e o microfone no peito. É elemento de tela, não tratamento de cor da gravação (G33) */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 900, bottom: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.6) 100%)'}} />
		</>
	);
};

/** capítulo de lista (E4): "Ferramenta número" + o número dito na caixa azul + o card do item. O nome do item não ganha
 * bloco próprio: vem na legenda, no lugar de sempre, como palavra-chave (um lugar de legenda só, G15). Só entra quando a
 * fala enumera ("ferramenta número um"...); o texto é o dito. Nunca fica parado mais de 1,5 s sem o card entrar (E4). */
export const Capitulo: React.FC<{de: number; rotulo: string; numero: string; children?: React.ReactNode}> = ({de, rotulo, numero, children}) => {
	const {t} = useT();
	const a = tw(t, de, de + 0.2, 0, 1);
	const caixa = tw(t, de + 0.1, de + 0.36, 0, 1);
	return (
		<div style={{position: 'absolute', inset: 0, background: C.branco}}>
			<div style={{position: 'absolute', left: 60, width: 880, top: 250, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 92, lineHeight: '100px', letterSpacing: '-0.035em', color: C.tinta, opacity: a}}>{rotulo}</div>
			<div style={{position: 'absolute', left: 60, width: 880, top: 360, display: 'flex', justifyContent: 'center'}}>
				<div style={{background: C.azul, borderRadius: 12, padding: '4px 34px 14px', clipPath: `inset(0 ${(1 - caixa) * 100}% 0 0 round 12px)`}}>
					<span style={{fontFamily: SERIF, fontSize: 116, lineHeight: '118px', color: C.branco}}>{numero}</span>
				</div>
			</div>
			{children && (
				<Card caixa={{x: 110, y: 520, w: 820, h: 620}} de={de + 0.15}>
					{children}
				</Card>
			)}
		</div>
	);
};
