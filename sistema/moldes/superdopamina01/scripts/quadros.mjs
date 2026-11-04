// Fotos de conferência, um pacote só para todos os tempos.  node scripts/quadros.mjs [--paleta=creme-lima] 1 13.8 ...
// Saem em conferencia/q_<tempo>[_paleta].png. ESCALA=1 para tamanho cheio (padrão 0,5).
// Rodar com a trava: QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const args = process.argv.slice(2);
const paleta = (args.find((a) => a.startsWith('--paleta=')) ?? '').split('=')[1] ?? '';
const tempos = args.filter((a) => !a.startsWith('--')).map(Number);
fs.mkdirSync('conferencia', {recursive: true});
try {
	const serve = await bundle({entryPoint: path.resolve('src/index.ts')});
	const padrao = (await selectComposition({serveUrl: serve, id: 'VitrineSuperDopamina01'})).defaultProps;
	const props = {...padrao, paleta};
	const comp = await selectComposition({serveUrl: serve, id: 'VitrineSuperDopamina01', inputProps: props});
	for (const t of tempos) {
		const out = `conferencia/q_${t.toFixed(2)}${paleta ? '_' + paleta : ''}.png`;
		await renderStill({composition: comp, serveUrl: serve, output: out, frame: Math.min(comp.durationInFrames - 1, Math.round(t * 30)), inputProps: props, imageFormat: 'png', scale: process.env.ESCALA ? Number(process.env.ESCALA) : 0.5});
		console.log(out);
	}
} catch (e) {
	console.error(String(e?.message ?? e).split('\n').slice(0, 6).join('\n'));
	process.exit(1);
}
