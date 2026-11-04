import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/google-fonts/InterTight';
import PRESENTES from './presentes.json';
import {
	BLOCOS, CORES_PLANO, DURACAO, ESTILOS, HEROI, ESTILO_PASSO, FIXO, FLASHES, FPS, IMGS, LEG_LH, LEG_PX, NEGATIVOS, ORIGEM, PALETA_PLANO,
	PICO_ALT, PICO_PX, PLANOS, PONTES, PS, ZONA, ZOOM, ZW, blocosEm, passoDe, subEm, entra, escrita, geometria, largLeg, largPico, paletaDe, planoEm,
	type Bloco, type CoresSoltas, type Paleta, type Plano, type Trat,
} from './modelo';

/**
 * Molde do superdopamina01 (../../modelos/superdopamina01/superdopamina01.md): a imagem troca a cada 1 a 3 palavras por
 * baixo de uma legenda pequena e fixa que acumula a frase; a cada ~6 s um pico tipográfico; um som por evento.
 * O plano do vídeo é src/plano.json (+ src/imagens.json, a lista palavra -> imagem); a lógica é src/modelo.ts.
 * A gravação entra como foi gravada (G33): estilos, duotone, negativo e grão só nas imagens e cartões.
 */
export {DURACAO, FPS};
const {fontFamily} = loadFont('normal', {weights: ['700', '900'], subsets: ['latin', 'latin-ext']});
const E = Easing.bezier(0.16, 1, 0.3, 1);
const tw = (t: number, a: number, b: number, v0: number, v1: number, e = E) =>
	interpolate(t, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const TEM = new Set(PRESENTES as string[]);
const temImg = (id?: string) => !!id && !!IMGS[id] && TEM.has(IMGS[id].arquivo);
const src = (id: string) => staticFile(IMGS[id].arquivo);

export type Props = {paleta?: string; cores?: CoresSoltas};

/* ---------------------------------------------------------------- filtros das imagens (nunca na pessoa) */
const FiltrosSvg: React.FC<{pal: Paleta}> = ({pal}) => {
	const hx = (h: string) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16) / 255);
	const [r, g, b] = hx(pal.destaque);
	const [pr, pg, pb] = hx(pal.preto);
	return (
		<svg width="0" height="0" style={{position: 'absolute'}}>
			{/* duotone: preto da paleta nas sombras, destaque nas luzes (E14: cada imagem com a sua cor) */}
			<filter id="duotone">
				<feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0" />
				<feComponentTransfer>
					<feFuncR type="table" tableValues={`${pr} ${r}`} />
					<feFuncG type="table" tableValues={`${pg} ${g}`} />
					<feFuncB type="table" tableValues={`${pb} ${b}`} />
				</feComponentTransfer>
			</filter>
		</svg>
	);
};
const filtro = (trat: Trat | undefined): string | undefined => {
	switch (trat) {
		case 'duotone': return 'url(#duotone) contrast(1.15)';
		case 'pb': return 'grayscale(1) contrast(1.45) brightness(0.95)';
		case 'negativo': return 'invert(1) hue-rotate(180deg)';
		case 'arquivo': return 'sepia(0.55) contrast(1.15) brightness(0.88) saturate(0.85)';
		default: return undefined;
	}
};

/* ---------------------------------------------------------------- grão e vinheta (só fora da pessoa) */
const Grao: React.FC<{f: number; forca?: number}> = ({f, forca = 0.12}) => (
	<AbsoluteFill style={{mixBlendMode: 'overlay', opacity: forca, pointerEvents: 'none'}}>
		<svg width="1080" height="1920">
			<filter id={`g${f % 3}`}>
				<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 7} />
				<feColorMatrix type="saturate" values="0" />
			</filter>
			<rect width="1080" height="1920" filter={`url(#g${f % 3})`} />
		</svg>
	</AbsoluteFill>
);
/** preto fundo e vinheta unificam imagens de cores diferentes (E14); a faixa de baixo escurece para a legenda ler */
const Vinheta: React.FC = () => (
	<>
		<AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 70% at 50% 42%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 48%, rgba(0,0,0,0.5) 62%, rgba(0,0,0,0.62) 78%, rgba(0,0,0,0.35) 100%)'}} />
	</>
);

/* ---------------------------------------------------------------- os mundos */
const Pessoa: React.FC<{p: Plano}> = ({p}) => (
	<AbsoluteFill style={{transform: `scale(${ZOOM[p.plano ?? 'aberto']})`, transformOrigin: `${ORIGEM.x}px ${ORIGEM.y}px`}}>
		<OffthreadVideo muted src={staticFile('fala.mp4')} style={{width: 1080, height: 1920}} />
	</AbsoluteFill>
);

/** a imagem nunca fica parada (E13): empurra, recua, gira ou desliza durante o plano */
const movimento = (mov: string | undefined, u: number) => {
	switch (mov) {
		case 'recua': return `scale(${1.1 - 0.08 * u})`;
		case 'gira': return `scale(${1.06 + 0.03 * u}) rotate(${-1.6 + 3.2 * u}deg)`;
		case 'desliza': return `scale(1.08) translateX(${-26 + 52 * u}px)`;
		default: return `scale(${1.0 + 0.08 * u})`;
	}
};
const Foto: React.FC<{id: string; u: number; mov?: string; trat?: Trat}> = ({id, u, mov, trat}) => (
	<AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
		<Img src={src(id)} style={{width: 1080, height: 1920, objectFit: 'cover', transform: movimento(mov, u), filter: filtro(trat)}} />
	</AbsoluteFill>
);

/** sem a imagem: o efeito tipográfico no lugar (o fundo troca preto/creme, a legenda continua por cima, ícones-pontuação) */
const Tipografico: React.FC<{p: Plano; t: number; pal: Paleta}> = ({p, t, pal}) => {
	const claro = p.k % 2 === 1;
	const formas = ['●', '■', '▲'];
	return (
		<AbsoluteFill style={{background: claro ? pal.creme : pal.preto}}>
			<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top: 820, display: 'flex', justifyContent: 'center', gap: 34}}>
				{formas.map((s, m) => (
					<span key={m} style={{fontFamily, fontSize: 70, color: m === 1 ? (claro ? pal.tinta : pal.texto) : pal.destaque, opacity: t >= p.t0 + 0.06 * m ? 1 : 0, transform: `scale(${tw(t, p.t0 + 0.06 * m, p.t0 + 0.06 * m + 0.12, 1.6, 1)})`}}>{s}</span>
				))}
			</div>
		</AbsoluteFill>
	);
};

const Mosaico: React.FC<{p: Plano; t: number; pal: Paleta}> = ({p, t, pal}) => {
	const ids = (p.imgs ?? []).filter(temImg);
	const n = ids.length;
	const col = 2, lin = Math.ceil(n / col);
	const tw_ = 1080 / col, th = 1920 / lin;
	const passo = p.passo ?? 0.17;
	const ordem = ids.map((_, m) => (m * 5 + 3) % n); // ordem fixa e espalhada, não da esquerda para a direita
	const visiveis = subEm(p, t) + 1;
	const zoom = 1.08 - 0.06 * tw(t, p.t0, p.t1, 0, 1, Easing.linear);
	return (
		<AbsoluteFill style={{background: pal.preto, transform: `scale(${zoom})`}}>
			{ordem.map((m, k) => {
				const t0 = p.t0 + k * passo;
				if (k >= visiveis) return null;
				const u = tw(t, t0, t0 + 0.14, 0, 1);
				return (
					<div key={m} style={{position: 'absolute', left: (m % col) * tw_ + 4, top: Math.floor(m / col) * th + 4, width: tw_ - 8, height: th - 8, overflow: 'hidden', transform: `scale(${1.12 - 0.12 * u})`}}>
						<Img src={src(ids[m])} style={{width: '100%', height: '100%', objectFit: 'cover', filter: k % 3 === 2 ? filtro('duotone') : undefined}} />
					</div>
				);
			})}
			{p.escuro ? <AbsoluteFill style={{background: `rgba(0,0,0,${p.escuro})`}} /> : null}
		</AbsoluteFill>
	);
};

const Paineis: React.FC<{p: Plano; t: number; pal: Paleta}> = ({p, t, pal}) => {
	const sobe = PLANOS.length && p.sobe ? Math.round(PS[p.sobe[0]].de * FPS) / FPS : Infinity;
	const dy = Number.isFinite(sobe) ? -70 * tw(t, sobe, sobe + 0.3, 0, 1) : 0;
	const w = 400, h = 711, y = 300;
	return (
		<AbsoluteFill style={{background: pal.preto}}>
			{[0, 1].map((m) => {
				const u = tw(t, p.t0 + m * 0.1, p.t0 + m * 0.1 + 0.2, 0, 1);
				return (
					<div key={m} style={{position: 'absolute', left: m ? 580 : 100, top: y + dy + (1 - u) * 60, width: w, height: h, overflow: 'hidden', borderRadius: 18, opacity: u, boxShadow: '0 20px 60px rgba(0,0,0,0.5)'}}>
						<Sequence from={Math.round(p.t0 * FPS)} layout="none">
							<OffthreadVideo muted src={staticFile('fala.mp4')} playbackRate={3} startFrom={m ? 300 : 0} style={{width: w, height: (w * 1920) / 1080, marginTop: -(w * 1920 / 1080 - h) / 2}} />
						</Sequence>
						<div style={{position: 'absolute', right: 14, top: 12, fontFamily, fontWeight: 900, fontSize: 30, color: pal.destaque}}>3×</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

const Card: React.FC<{p: Plano; t: number; f: number; pal: Paleta}> = ({p, t, f, pal}) => {
	const cor = p.fundo === 'creme' ? pal.creme : p.fundo === 'destaque' ? pal.destaque : pal.preto;
	const u = tw(t, p.t0, p.t1, 0, 1, Easing.linear);
	return (
		<AbsoluteFill style={{background: cor}}>
			{/* luz que anda devagar: o cartão nunca fica parado (E13) */}
			<AbsoluteFill style={{background: `radial-gradient(ellipse 70% 45% at ${40 + 20 * u}% ${45 - 6 * u}%, ${p.fundo === 'creme' ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.07)'} 0%, rgba(0,0,0,0) 100%)`}} />
			<Grao f={f} forca={p.fundo === 'creme' ? 0.1 : 0.16} />
		</AbsoluteFill>
	);
};

const Fundo: React.FC<{p: Plano; t: number; f: number; pal: Paleta}> = ({p, t, f, pal}) => {
	const u = tw(t, p.t0, p.t1, 0, 1, Easing.linear);
	if (p.tipo === 'pessoa') return <Pessoa p={p} />;
	if (p.tipo === 'card') return <Card p={p} t={t} f={f} pal={pal} />;
	if (p.tipo === 'paineis') return <Paineis p={p} t={t} pal={pal} />;
	if (p.tipo === 'mosaico') return (p.imgs ?? []).some(temImg) ? <><Mosaico p={p} t={t} pal={pal} /><Vinheta /><Grao f={f} /></> : <Tipografico p={p} t={t} pal={pal} />;
	if (p.tipo === 'rajada') {
		const ids = (p.imgs ?? []).filter(temImg);
		if (!ids.length) return <Tipografico p={p} t={t} pal={pal} />;
		const m = Math.min(ids.length - 1, subEm(p, t));
		const uu = tw(t, p.t0 + m * passoDe(p), p.t0 + (m + 1) * passoDe(p), 0, 1, Easing.linear);
		return <><Foto id={ids[m]} u={uu} mov={m % 2 ? 'recua' : 'empurra'} /><Vinheta /><Grao f={f} /></>;
	}
	if (!temImg(p.img)) return <Tipografico p={p} t={t} pal={pal} />;
	const trat = p.tipo === 'estilos' ? ESTILOS[subEm(p, t) % ESTILOS.length] : p.trat;
	return <><Foto id={p.img!} u={u} mov={p.mov} trat={trat} /><Vinheta /><Grao f={f} /></>;
};

/* ---------------------------------------------------------------- a ponte: o objeto que atravessa os cortes (E9) */
const Ponte: React.FC<{t: number}> = ({t}) => (
	<>
		{PONTES.filter((p) => t >= p.de && t < p.ate && temImg(p.img)).map((p, k) => {
			const d = p.ate - p.de;
			const ent = tw(t, p.de, p.de + Math.min(0.35, d * 0.3), 0, 1);
			const sai = tw(t, p.ate - 0.25, p.ate, 0, 1, Easing.in(Easing.cubic));
			const meio = [0.5, 0.36];
			const x = (p.de_xy[0] + (meio[0] - p.de_xy[0]) * ent + (p.ate_xy[0] - meio[0]) * sai) * 1080;
			const y = (p.de_xy[1] + (meio[1] - p.de_xy[1]) * ent + (p.ate_xy[1] - meio[1]) * sai) * 1920;
			const giro = -14 + 14 * ent + 6 * Math.sin((t - p.de) * 5) + 30 * sai;
			const larg = 520 * (0.75 + 0.25 * ent) * (1 - 0.3 * sai);
			return (
				<Img key={k} src={src(p.img)} style={{position: 'absolute', left: x - larg / 2, top: y - larg / 2, width: larg, transform: `rotate(${giro}deg)`, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.55))'}} />
			);
		})}
	</>
);

/* ---------------------------------------------------------------- o texto */
const SOMBRA = '0 6px 42px rgba(0,0,0,0.5)'; // larga e suave, nunca desenha a borda da letra (G37)
const APAGADA = 0.38;
const naTela = (t: number, i: number, gancho: boolean): React.CSSProperties => {
	const t0 = entra(i);
	if (t < t0) return {opacity: gancho ? APAGADA : 0};
	const u = tw(t, t0, t0 + 0.12, 0, 1);
	if (gancho) return {opacity: APAGADA + (1 - APAGADA) * u};
	return {opacity: u, transform: `translateY(${(1 - u) * 10}px)`, filter: u < 0.99 ? `blur(${(1 - u) * 8}px)` : undefined};
};
/** a cor do texto pelo fundo que está embaixo dele agora */
const corTexto = (t: number, pal: Paleta) => {
	const p = planoEm(t);
	const claro = (p.tipo === 'card' && p.fundo === 'creme') || (p.tipo !== 'pessoa' && p.tipo !== 'card' && p.tipo !== 'paineis' && !(p.img ? temImg(p.img) : (p.imgs ?? []).some(temImg)) && p.k % 2 === 1);
	return claro ? {cor: pal.tinta, sombra: undefined} : {cor: pal.texto, sombra: SOMBRA};
};

const LinhaLeg: React.FC<{ids: number[]; top: number; t: number; b: Bloco; pal: Paleta}> = ({ids, top, t, b, pal}) => {
	const {cor, sombra} = corTexto(t, pal);
	return (
		<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top, display: 'flex', justifyContent: 'center', fontFamily, fontWeight: 700, fontSize: LEG_PX, lineHeight: `${LEG_LH}px`, letterSpacing: '-0.01em', color: cor, textShadow: sombra, whiteSpace: 'nowrap'}}>
			{ids.map((i, m) => {
				const w = largLeg(escrita(i));
				if (b.estilo === 'tarja') {
					// E11: a palavra é uma tarja até ser dita, e a tarja se abre em texto (tela preta = respiro + suspense)
					const u = tw(t, entra(i), entra(i) + 0.16, 0, 1);
					return (
						<span key={i} style={{position: 'relative', display: 'inline-block', width: w, marginLeft: m ? largLeg(' ') : 0}}>
							<span style={{opacity: u}}>{escrita(i)}</span>
							<span style={{position: 'absolute', left: 0, top: LEG_LH * 0.2, height: LEG_LH * 0.62, width: w, background: cor, transform: `scaleX(${1 - u})`, transformOrigin: 'right center'}} />
						</span>
					);
				}
				return <span key={i} style={{display: 'inline-block', marginLeft: m ? largLeg(' ') : 0, ...naTela(t, i, b.gancho)}}>{escrita(i)}</span>;
			})}
		</div>
	);
};

/** número dito pula de ordem de grandeza até ele (E7): 100% = 1% → 10% → 100%, um salto a cada 0,17 s. Sempre o número dito (G8). */
export const saltos = (txt: string): string[] => {
	const m = txt.match(/^(\D*)([\d.,]+)(.*)$/);
	if (!m) return [txt];
	const alvo = m[2].replace(/[.,]/g, '');
	const out: string[] = [];
	for (let d = 1; d <= alvo.length; d++) out.push(`${m[1]}${Number(alvo.slice(0, d)).toLocaleString('pt-BR')}${m[3]}`);
	out[out.length - 1] = txt;
	return out;
};
const Pico: React.FC<{b: Bloco; top: number; t: number; pal: Paleta}> = ({b, top, t, pal}) => {
	const p = b.pico!;
	const txt = b.ids.filter((i) => i >= p.de && i <= p.ate).map(escrita).join(' ');
	const t0 = entra(p.de);
	const fundoClaro = corTexto(t, pal).cor === pal.tinta;
	const cor = fundoClaro ? pal.tinta : pal.destaque;
	let mostra = txt;
	let estilo: React.CSSProperties = {};
	if (t < t0) {
		if (!b.gancho) return null;
		estilo = {opacity: APAGADA, color: pal.texto};
	} else if (p.voz === 'conta') {
		const s = saltos(txt);
		mostra = s[Math.min(s.length - 1, Math.floor((t - t0) / 0.17))];
		estilo = {transform: `scale(${1 + 0.06 * Math.max(0, 1 - ((t - t0) % 0.17) / 0.1)})`};
	} else if (p.voz === 'digita') {
		const n = Math.floor((t - t0) / 0.04) + 1;
		mostra = txt.slice(0, n);
	} else {
		const u = tw(t, t0, t0 + 0.14, 0, 1);
		estilo = {opacity: Math.min(1, u * 3), transform: `scale(${1.35 - 0.35 * u + 0.04 * tw(t, t0 + 0.14, b.fixo ? DURACAO : b.t1, 0, 1, Easing.linear)})`, filter: u < 0.99 ? `blur(${(1 - u) * 14}px)` : undefined};
	}
	return (
		<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top, height: PICO_ALT, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
			<div style={{fontFamily, fontWeight: 900, fontSize: PICO_PX, lineHeight: 1, letterSpacing: '-0.04em', color: cor, whiteSpace: 'nowrap', textShadow: fundoClaro ? undefined : SOMBRA, fontVariantNumeric: 'tabular-nums', ...estilo}}>
				{mostra}
			</div>
		</div>
	);
};

/** o momento-herói (E12, um por vídeo): o bloco inteiro em letra enorme digitada, a câmera recua e o bloco assenta em 3D */
export const HEROI_PX = 124;
const Heroi: React.FC<{b: Bloco; t: number; pal: Paleta}> = ({b, t, pal}) => {
	const caixa = new Set(HEROI?.caixa ?? []);
	const lw = (i: number) => largPico(escrita(i), HEROI_PX);
	const esp = largPico(' ', HEROI_PX);
	const linhas: number[][] = [];
	for (const i of b.ids) {
		const l = linhas[linhas.length - 1];
		const w = l ? l.reduce((a, j) => a + lw(j) + esp, 0) + lw(i) : Infinity;
		if (!l || w > ZW * 0.98 || caixa.has(i) !== caixa.has(l[l.length - 1])) linhas.push([i]);
		else l.push(i);
	}
	const d = b.t1 - b.t0;
	const recua = tw(t, b.t0, b.t0 + d * 0.75, 0, 1, Easing.bezier(0.45, 0, 0.2, 1));
	const assenta = tw(t, b.t0 + d * 0.55, b.t1 - 0.1, 0, 1);
	const vel = Math.abs(tw(t + 1 / FPS, b.t0, b.t0 + d * 0.75, 0, 1, Easing.bezier(0.45, 0, 0.2, 1)) - recua) * FPS;
	const alt = linhas.length * HEROI_PX * 1.02;
	return (
		<div style={{position: 'absolute', left: ZONA.esq, width: ZW, top: 860 - alt / 2, height: alt, perspective: 1400}}>
			<div style={{transform: `scale(${1.55 - 0.55 * recua}) rotateY(${-18 + 18 * assenta}deg) rotateX(${9 - 9 * assenta}deg)`, transformOrigin: '20% 30%', filter: vel > 0.6 ? `blur(${Math.min(6, vel * 3)}px)` : undefined}}>
				{linhas.map((l, n) => {
					const inv = caixa.has(l[0]);
					const total = l.reduce((a, i) => a + escrita(i).length, 0);
					const feitas = l.reduce((a, i) => a + (t < entra(i) ? 0 : Math.min(escrita(i).length, Math.floor((t - entra(i)) / 0.035) + 1)), 0);
					const abre = total ? feitas / total : 0; // a caixa invertida cresce junto com a digitação
					return (
						<div key={n} style={{display: 'flex', justifyContent: 'center'}}>
							<div style={{position: 'relative', display: 'inline-flex', gap: esp, padding: inv ? `0 ${HEROI_PX * 0.12}px` : undefined, fontFamily, fontWeight: 900, fontSize: HEROI_PX, lineHeight: 1.02, letterSpacing: '-0.04em', color: inv ? pal.tinta : pal.texto, whiteSpace: 'nowrap'}}>
								{inv && abre > 0 ? <div style={{position: 'absolute', inset: 0, background: pal.creme, clipPath: `inset(0 ${(1 - abre) * 100}% 0 0)`}} /> : null}
								{l.map((i) => {
									const s = escrita(i);
									const n2 = t < entra(i) ? 0 : Math.min(s.length, Math.floor((t - entra(i)) / 0.035) + 1);
									return (
										<span key={i} style={{position: 'relative', zIndex: 1}}>
											<span>{s.slice(0, n2)}</span>
											<span style={{opacity: 0}}>{s.slice(n2)}</span>
										</span>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const Texto: React.FC<{t: number; pal: Paleta}> = ({t, pal}) => (
	<>
		{blocosEm(t).map((b) => {
			if (b.estilo === 'heroi') return <Heroi key={b.k} b={b} t={t} pal={pal} />;
			const g = geometria(b);
			return (
				<React.Fragment key={b.k}>
					{b.antes.map((l, n) => <LinhaLeg key={`a${n}`} ids={l.ids} top={g.antes[n]} t={t} b={b} pal={pal} />)}
					{b.pico ? <Pico b={b} top={g.pico} t={t} pal={pal} /> : null}
					{b.depois.map((l, n) => <LinhaLeg key={`d${n}`} ids={l.ids} top={g.depois[n]} t={t} b={b} pal={pal} />)}
				</React.Fragment>
			);
		})}
	</>
);

/* ---------------------------------------------------------------- flash e negativo (marcas de pico) */
const Flash: React.FC<{t: number}> = ({t}) => {
	const f = FLASHES.find((x) => t >= x && t < x + 0.2);
	if (f === undefined) return null;
	const u = (t - f) / 0.2;
	return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, rgba(255,255,255,${1 - u}) 0%, rgba(255,250,240,${(1 - u) * 0.85}) 55%, rgba(255,240,220,${(1 - u) * 0.5}) 100%)`}} />;
};

export const VitrineSuperDopamina01: React.FC<Props> = ({paleta, cores}) => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const p = planoEm(t);
	const pal = paletaDe(paleta || PALETA_PLANO, {...(CORES_PLANO ?? {}), ...(cores ?? {})});
	const neg = p.tipo !== 'pessoa' && NEGATIVOS.some((x) => t >= x && t < x + 0.1);
	const fim = tw(t, DURACAO - 0.5, DURACAO, 0, 1);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<FiltrosSvg pal={pal} />
			<AbsoluteFill style={{filter: neg ? 'invert(1)' : undefined}}>
				<Fundo p={p} t={t} f={f} pal={pal} />
			</AbsoluteFill>
			<Ponte t={t} />
			<Texto t={t} pal={pal} />
			<Flash t={t} />
			{fim > 0 ? <AbsoluteFill style={{background: '#000', opacity: fim}} /> : null}
		</AbsoluteFill>
	);
};
export {BLOCOS, FIXO};
