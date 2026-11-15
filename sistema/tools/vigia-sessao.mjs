// Vigia de sessão do EditOS: roda sozinho (gancho do Claude Code) toda vez que uma sessão salva um arquivo.
// Não é IA e não fala nada pro Claude: lê o caminho do arquivo e, se ele for de um vídeo do EditOS,
//  1. anota "tem sessão mexendo neste vídeo agora" em sistema/.tmp/atividade.json (o painel mostra no cartão);
//  2. se o vídeo ainda estava em "roteiro" e o arquivo não é o roteiro, passa a ficha para "produzindo".
// Nunca mexe em revisar, pronto ou publicado. Qualquer erro é engolido: o vigia nunca atrapalha a sessão.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const EDITOS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ATIVIDADE = path.join(EDITOS, 'sistema', '.tmp', 'atividade.json');
const UMA_HORA = 60 * 60 * 1000;

function ler() {
  return new Promise((ok) => {
    let t = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (t += c));
    process.stdin.on('end', () => ok(t));
    setTimeout(() => ok(t), 2000);
  });
}

// de um arquivo salvo até o vídeo: { perfil, nome, ehRoteiro }
function videoDe(arquivo) {
  const rel = path.relative(EDITOS, path.resolve(arquivo)).split(path.sep);
  if (rel[0] === '..' || path.isAbsolute(rel.join('/'))) return null;
  // <perfil>/conteudo/<video>/<arquivo>
  if (rel[1] === 'conteudo' && rel.length >= 4 && fs.existsSync(path.join(EDITOS, rel[0], 'perfil.md'))) {
    return { perfil: rel[0], nome: rel[2], ehRoteiro: /^(roteiro-v\d+\.(md|txt)|ficha\.md)$/i.test(rel[rel.length - 1]) };
  }
  // sistema/oficina/<pasta>/...: o entrega.json da pasta diz de qual vídeo ela é
  if (rel[0] === 'sistema' && rel[1] === 'oficina' && rel.length >= 4) {
    try {
      const e = JSON.parse(fs.readFileSync(path.join(EDITOS, 'sistema', 'oficina', rel[2], 'entrega.json'), 'utf8'));
      if (e.perfil && e.pasta) return { perfil: e.perfil, nome: e.pasta, ehRoteiro: false };
    } catch { /* oficina sem entrega.json ainda: não dá pra saber o vídeo */ }
  }
  return null;
}

// mesma ficha que o painel lê: cabeçalho "chave: valor" entre linhas ---, o resto são notas
function promover(pasta) {
  const arq = path.join(pasta, 'ficha.md');
  const campos = {};
  let notas = '';
  if (fs.existsSync(arq)) {
    const t = fs.readFileSync(arq, 'utf8').replace(/\r\n/g, '\n');
    const m = t.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!m) return; // ficha fora do formato: não arrisco reescrever
    for (const l of m[1].split('\n')) { const i = l.indexOf(':'); if (i > 0) campos[l.slice(0, i).trim()] = l.slice(i + 1).trim(); }
    notas = m[2].trim();
  }
  const temVideo = fs.readdirSync(pasta).some((a) => /^v\d+.*\.mp4$/i.test(a));
  const atual = campos.status || (temVideo ? 'revisar' : 'roteiro');
  if (atual !== 'roteiro') return;
  campos.status = 'produzindo';
  const cab = ['status', 'link', 'insight', 'origem'].filter((k) => k !== 'origem' || campos.origem).map((k) => `${k}: ${campos[k] ?? ''}`).join('\n');
  fs.writeFileSync(arq, `---\n${cab}\n---\n${notas ? notas + '\n' : ''}`, 'utf8');
}

try {
  const entrada = JSON.parse(await ler());
  const ti = entrada.tool_input ?? {};
  const v = videoDe(ti.file_path ?? ti.notebook_path ?? '');
  if (v) {
    const pasta = path.join(EDITOS, v.perfil, 'conteudo', v.nome);
    if (fs.existsSync(pasta)) {
      let reg = {};
      try { reg = JSON.parse(fs.readFileSync(ATIVIDADE, 'utf8')); } catch { /* primeiro uso */ }
      const agora = Date.now();
      for (const k of Object.keys(reg)) if (agora - reg[k].quando > UMA_HORA) delete reg[k];
      reg[`${v.perfil}/${v.nome}`] = { quando: agora, sessao: String(entrada.session_id ?? '').slice(0, 8) };
      fs.mkdirSync(path.dirname(ATIVIDADE), { recursive: true });
      fs.writeFileSync(ATIVIDADE, JSON.stringify(reg), 'utf8');
      if (!v.ehRoteiro) promover(pasta);
      // 3. guarda na pasta do vídeo qual conversa mexeu nele por último: o Refazer do painel continua ESSA conversa,
      //    com todo o contexto, em vez de abrir uma sessão crua (painel/src/lib/agente.ts)
      if (entrada.session_id && entrada.transcript_path) {
        fs.writeFileSync(path.join(pasta, '.sessao.json'), JSON.stringify({ id: entrada.session_id, cwd: entrada.cwd ?? '', transcript: entrada.transcript_path, quando: agora }), 'utf8');
      }
    }
  }
} catch { /* nunca atrapalha a sessão */ }
process.exit(0);
