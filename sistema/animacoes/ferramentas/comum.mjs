// O que as ferramentas das animações dividem: os caminhos, como rodar um programa
// e como achar o vídeo que a pessoa pediu.
//
// No EditOS o motor mora em sistema/animacoes/ e usa o node_modules de sistema/.
// Cada vídeo é trabalhado em sistema/oficina/<AAAA-MM-DD-tema>/ (como todo vídeo do EditOS);
// o exemplo do ciclo da água fica em sistema/animacoes/exemplos/.
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'); // sistema/animacoes
export const SISTEMA = path.resolve(RAIZ, '..'); // sistema/
export const OFICINA = path.join(SISTEMA, 'oficina');
export const EXEMPLOS = path.join(RAIZ, 'exemplos');
export const PUBLICO = path.join(RAIZ, 'public');

/** Para com uma mensagem simples, sem despejar erro técnico. */
export const parar = (msg) => {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
};

/** Os temporários ficam no .tmp do estúdio (sistema/.tmp), nunca espalhados pelo computador. */
export const tmp = () => {
  const d = path.join(SISTEMA, '.tmp');
  fs.mkdirSync(d, {recursive: true});
  return d;
};

/** Roda um programa e devolve o que ele escreveu. `herdar` mostra a saída ao vivo. */
export const rodar = (cmd, args, {herdar = false, cwd = RAIZ, permitirErro = false} = {}) => {
  const r = spawnSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    stdio: herdar ? 'inherit' : 'pipe',
    maxBuffer: 64 * 1024 * 1024,
    env: {...process.env, TEMP: tmp(), TMP: tmp(), TMPDIR: tmp()},
  });
  if (r.status !== 0 && !permitirErro) {
    parar(`"${cmd} ${args.slice(0, 3).join(' ')}" falhou.\n${(r.stderr || r.stdout || '').trim().split('\n').slice(-12).join('\n')}`);
  }
  return {ok: r.status === 0, saida: `${r.stdout || ''}${r.stderr || ''}`};
};

// No Windows o npx é um arquivo .cmd, e o cmd parte o argumento em espaço, =, vírgula e ponto e vírgula.
// Com aspas ele chega inteiro. Nos outros sistemas não tem shell no meio, então vai como está.
const aspas = (s) => (process.platform === 'win32' && /[\s=,;&|<>^()@]/.test(s) ? `"${s}"` : s);
// o npx roda de sistema/, onde está o node_modules do estúdio
export const npx = (args, opcoes) => rodar('npx', args.map(aspas), {cwd: SISTEMA, ...opcoes});
export const ffmpeg = (args, opcoes) => npx(['remotion', 'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', ...args], opcoes);

/** Quantos segundos tem um áudio ou vídeo. */
export const duracaoDe = (arquivo) => {
  const {saida} = npx(['remotion', 'ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', arquivo]);
  const n = parseFloat(saida.trim().split('\n').pop());
  if (!Number.isFinite(n)) parar(`Não consegui medir a duração de ${path.basename(arquivo)}.`);
  return n;
};

const pastas = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((d) => fs.statSync(path.join(dir, d)).isDirectory()) : []);

/** Um vídeo de animação: a pasta tem o roteiro.md com a linha do estilo (escrita pelo novo-video.mjs). */
const ehAnimacao = (dir) => {
  const r = path.join(dir, 'roteiro.md');
  return fs.existsSync(r) && /^- \*\*Estilo:\*\*/m.test(fs.readFileSync(r, 'utf8'));
};

/** Todas as pastas de animação: as da oficina e os exemplos. */
const todasAsAnimacoes = () => [
  ...pastas(OFICINA).filter((p) => ehAnimacao(path.join(OFICINA, p))).map((p) => ({pasta: p, dir: path.join(OFICINA, p)})),
  ...pastas(EXEMPLOS).map((p) => ({pasta: p, dir: path.join(EXEMPLOS, p)})),
];

/** Acha a pasta do vídeo pelo nome inteiro ou por um pedaço dele (oficina/ ou exemplos/). */
export const acharVideo = (nome) => {
  if (!nome) parar('Diga qual vídeo. Ex.: node animacoes/ferramentas/voz.mjs como-a-abelha-faz-o-mel');
  const todos = todasAsAnimacoes();
  const limpo = path.basename(nome.replace(/[\\/]+$/, ''));
  const exato = todos.find((v) => v.pasta === limpo);
  const achados = exato ? [exato] : todos.filter((v) => v.pasta.includes(limpo));
  if (achados.length === 0)
    parar(`Não achei o vídeo "${nome}". Crie com: node animacoes/ferramentas/novo-video.mjs <nome> --estilo <id>. Os que existem: ${todos.map((v) => v.pasta).join(', ') || 'nenhum'}.`);
  if (achados.length > 1) parar(`"${nome}" serve pra mais de um vídeo: ${achados.map((v) => v.pasta).join(', ')}. Diga o nome inteiro.`);
  const v = achados[0];
  return {...v, id: idDe(v.pasta), naOficina: v.dir.startsWith(OFICINA)};
};

/** O nome da composição no Remotion: só letras, números e hífen. */
export const idDe = (pasta) => pasta.replace(/[^a-zA-Z0-9-]/g, '-');

/** Lê as opções da linha de comando: --chave valor ou --chave. */
export const opcoes = (argv = process.argv.slice(2)) => {
  const soltos = [];
  const op = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const k = argv[i].slice(2);
      const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      op[k] = v;
    } else soltos.push(argv[i]);
  }
  return {soltos, op};
};

/** Quantos processos o render usa: 2, a regra do estúdio (a máquina é dividida com outros renders). */
export const folego = () => 2;

/** O Chrome do render, se a máquina mandar um (CHROME_PATH); senão o Remotion usa o dele. */
export const navegador = () => (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH) ? process.env.CHROME_PATH : undefined);

/** Os estilos instalados: cada pasta de src/estilos/ com um index.tsx. */
export const listarEstilos = () => {
  const dir = path.join(RAIZ, 'src', 'estilos');
  return fs
    .readdirSync(dir)
    .filter((d) => fs.existsSync(path.join(dir, d, 'index.tsx')))
    .sort();
};

/** Refaz a lista de estilos que o motor enxerga (src/estilos.gerado.ts). */
export const registrarEstilos = () => {
  const ids = listarEstilos();
  const nome = (id) => `e_${id.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const linhas = [
    '// Arquivo gerado por ferramentas (não edite à mão): a lista dos estilos de src/estilos/.',
    ...ids.map((id) => `import * as ${nome(id)} from './estilos/${id}';`),
    '',
    'export const ESTILOS = [',
    ...ids.map((id) => `  {id: '${id}', tema: ${nome(id)}.tema, Exemplo: ${nome(id)}.Exemplo},`),
    '];',
    '',
  ];
  fs.writeFileSync(path.join(RAIZ, 'src', 'estilos.gerado.ts'), linhas.join('\n'));
  return ids;
};

/** Refaz a lista de vídeos que o motor enxerga (src/videos.gerado.ts): os de animação da oficina e os exemplos. */
export const registrarVideos = () => {
  const prontos = todasAsAnimacoes().filter((v) => fs.existsSync(path.join(v.dir, 'video.tsx')) && fs.existsSync(path.join(v.dir, 'fala.json')));
  const rel = (dir) => path.relative(path.join(RAIZ, 'src'), path.join(dir, 'video')).split(path.sep).join('/');
  const linhas = [
    '// Arquivo gerado por ferramentas (não edite à mão): os vídeos de animação da oficina e os exemplos.',
    ...prontos.map((v, i) => `import * as v${i} from '${rel(v.dir)}';`),
    "import type {VideoRegistrado} from './kit';",
    '',
    'export const VIDEOS: VideoRegistrado[] = [',
    ...prontos.map((v, i) => `  {id: '${idDe(v.pasta)}', pasta: '${v.pasta}', ...v${i}},`),
    '];',
    '',
  ];
  fs.writeFileSync(path.join(RAIZ, 'src', 'videos.gerado.ts'), linhas.join('\n'));
  return prontos.map((v) => v.pasta);
};

/** O Python do estúdio (o .venv de sistema/), pra chamar o tools/entregar.py. */
export const python = () =>
  [path.join(SISTEMA, '.venv', 'Scripts', 'python.exe'), path.join(SISTEMA, '.venv', 'bin', 'python')].find((p) => fs.existsSync(p)) ||
  (process.platform === 'win32' ? 'python' : 'python3');
