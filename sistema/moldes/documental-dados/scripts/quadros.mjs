// Fotos de conferência.  node scripts/quadros.mjs [--pasta=x] 1 13.8 ...  -> conferencia/q_1.00.png (ESCALA=1 para tamanho cheio)
// Rodar pela trava: QUEM=<nome> sh ../../tools/com-trava.sh node scripts/quadros.mjs 1 5 10
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const args = process.argv.slice(2);
const pasta = (args.find((a) => a.startsWith('--pasta=')) ?? '--pasta=conferencia').slice(8);
const tempos = args.filter((a) => !a.startsWith('--')).map(Number);
fs.mkdirSync(pasta, {recursive: true});
const serve = await bundle({entryPoint: path.resolve('src/index.ts')});
const comp = await selectComposition({serveUrl: serve, id: 'Documental01', inputProps: {}});
for (const t of tempos) {
	const out = `${pasta}/q_${t.toFixed(2)}.png`;
	await renderStill({composition: comp, serveUrl: serve, output: out, frame: Math.min(comp.durationInFrames - 1, Math.round(t * 30)), inputProps: {}, imageFormat: 'png', scale: process.env.ESCALA ? Number(process.env.ESCALA) : 0.5});
	console.log(out);
}
