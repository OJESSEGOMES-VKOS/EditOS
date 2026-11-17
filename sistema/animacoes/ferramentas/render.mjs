// Renderiza o vídeo inteiro e entrega no conteúdo do perfil, como todo vídeo do EditOS.
//
// Sempre de dentro de sistema/, pela trava (um render pesado por vez na máquina):
//   QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <video>
//       -> oficina/<pasta>/out/final.mp4, e o tools/entregar.py copia como
//          <perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4 (com o roteiro.md ao lado) e passa a ficha para "revisar"
//   SEM_ENTREGA=1 ... render.mjs <video>     rascunho: só o out/final.mp4, sem entregar
//   ... render.mjs <video> --nome <pasta-do-conteudo>   entrega numa pasta de roteiro que já existe no conteúdo
//   ... render.mjs --estilo giz              o exemplo de um estilo (vai pra animacoes/estilos/exemplos/, nunca entrega)
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {
  PUBLICO,
  RAIZ,
  SISTEMA,
  acharVideo,
  duracaoDe,
  folego,
  listarEstilos,
  navegador,
  opcoes,
  parar,
  python,
  registrarEstilos,
  registrarVideos,
  tmp,
} from './comum.mjs';

const {soltos, op} = opcoes();
registrarEstilos();
registrarVideos();

let id, destino, video;
if (op.estilo) {
  if (!listarEstilos().includes(op.estilo)) parar(`Não existe o estilo "${op.estilo}".`);
  id = `estilo-${op.estilo}`;
  const dir = path.join(RAIZ, 'estilos', 'exemplos');
  fs.mkdirSync(dir, {recursive: true});
  destino = path.join(dir, `${op.estilo}.mp4`);
} else {
  video = acharVideo(soltos[0]);
  if (!fs.existsSync(path.join(video.dir, 'video.tsx'))) parar(`O vídeo ${video.pasta} ainda não tem o video.tsx (as cenas).`);
  if (!fs.existsSync(path.join(video.dir, 'fala.json'))) parar(`O vídeo ${video.pasta} ainda não tem o fala.json: rode a voz antes.`);
  id = video.id;
  fs.mkdirSync(path.join(video.dir, 'out'), {recursive: true});
  destino = path.join(video.dir, 'out', 'final.mp4');
}

if (!fs.existsSync(path.join(SISTEMA, '.tmp', 'render.lock')))
  console.log('  (aviso: rode o render pela trava do estúdio: QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs ...)');

process.env.TEMP = process.env.TMP = process.env.TMPDIR = tmp();
fs.mkdirSync(PUBLICO, {recursive: true});
const sobra = path.join(tmp(), `pacote-render-${id}`);
const comum = {browserExecutable: navegador(), logLevel: 'error'};

console.log(`Renderizando ${id}...`);
let pacote;
try {
  pacote = await bundle({entryPoint: path.join(RAIZ, 'src', 'index.ts'), publicDir: PUBLICO, outDir: sobra});
} catch (e) {
  fs.rmSync(sobra, {recursive: true, force: true});
  parar(`O código do vídeo tem um erro e não montou:\n${String(e.message || e).split('\n').slice(0, 14).join('\n')}`);
}
try {
  const comp = await selectComposition({serveUrl: pacote, id, ...comum});
  let ultimo = -1;
  await renderMedia({
    composition: comp,
    serveUrl: pacote,
    codec: 'h264',
    outputLocation: destino,
    crf: 20,
    audioBitrate: '192k',
    imageFormat: 'jpeg',
    jpegQuality: 92,
    concurrency: folego(),
    overwrite: true,
    ...comum,
    onProgress: ({progress}) => {
      const p = Math.floor(progress * 10);
      if (p !== ultimo) {
        ultimo = p;
        console.log(`  ${p * 10}%`);
      }
    },
  });
} catch (e) {
  parar(`O render falhou: ${String(e.message || e).split('\n').slice(0, 8).join('\n')}`);
} finally {
  fs.rmSync(sobra, {recursive: true, force: true});
}

if (!fs.existsSync(destino)) parar('O render terminou, mas o arquivo não apareceu. Rode de novo.');
const mb = fs.statSync(destino).size / 1024 / 1024;
console.log(`\n✓ ${path.relative(SISTEMA, destino)}  (${duracaoDe(destino).toFixed(1)} s, ${mb.toFixed(1)} MB)`);

// a entrega: igual aos finais dos moldes. Exemplo de estilo e exemplo do motor não entregam.
if (video && video.naOficina) {
  const args = [path.join(SISTEMA, 'tools', 'entregar.py'), video.dir, destino];
  if (typeof op.nome === 'string') args.push('--nome', op.nome);
  if (typeof op.perfil === 'string') args.push('--perfil', op.perfil);
  // sem shell no meio: o caminho do estúdio tem espaço
  const r = spawnSync(python(), args, {cwd: SISTEMA, encoding: 'utf8', env: {...process.env, PYTHONIOENCODING: 'utf-8'}});
  console.log(`${r.stdout || ''}${r.stderr || ''}`.trim());
  if (r.status !== 0) parar('O vídeo ficou pronto em out/final.mp4, mas a entrega no perfil falhou (veja acima).');
}
