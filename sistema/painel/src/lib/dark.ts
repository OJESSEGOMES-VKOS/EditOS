// Traz os roteiros da Operação Dark pro fluxo do EditOS. Eles nascem em projetos/operacao-dark-nuvem (no Git, muitas
// vezes num ramo que o Claude da nuvem empurrou e que não está aqui). Cada roteiro vira (ou atualiza) a pasta
// <perfil>/conteudo/<tema>-DD-MM-AA/roteiro-vN.md do EditOS, e o painel mostra como qualquer outro item.
// Só lê o repositório da nuvem (fetch + git show): nunca muda o que está lá.
import fs from 'node:fs';
import path from 'node:path';
import { execFile, execFileSync } from 'node:child_process';
import { RAIZ, perfis, lerFicha, escreverFicha } from './fluxo';

const DARK = path.resolve(RAIZ, '..', 'operacao-dark-nuvem');
const git = (...a: string[]) => execFileSync('git', ['-c', 'safe.directory=*', ...a], { cwd: DARK, encoding: 'utf-8', maxBuffer: 64 << 20, windowsHide: true });

type Roteiro = { slug: string; ler: () => string; quando: number };

// todos os roteiros: a pasta local e cada ramo do GitHub; fica o mais novo de cada slug
function roteiros(): Map<string, Roteiro> {
  const achados = new Map<string, Roteiro>();
  const guardar = (r: Roteiro) => { const j = achados.get(r.slug); if (!j || r.quando > j.quando) achados.set(r.slug, r); };
  for (const base of ['sistema/roteiros', 'roteiros']) {
    const dir = path.join(DARK, base);
    if (!fs.existsSync(dir)) continue;
    for (const slug of fs.readdirSync(dir)) {
      const arq = ['roteiro.md', 'roteiro.txt'].map((a) => path.join(dir, slug, a)).find((a) => fs.existsSync(a));
      if (arq) guardar({ slug, quando: fs.statSync(arq).mtimeMs, ler: () => fs.readFileSync(arq, 'utf-8') });
    }
  }
  let ramos: string[] = [];
  try { ramos = git('for-each-ref', '--format=%(refname:short)', 'refs/remotes').split('\n').filter((r) => r && !r.endsWith('/HEAD')); } catch { return achados; }
  for (const ramo of ramos) {
    let quando = 0;
    try { quando = Number(git('log', '-1', '--format=%ct', ramo).trim()) * 1000; } catch { continue; }
    let lista: string[] = [];
    try { lista = git('ls-tree', '-r', '--name-only', ramo, '--', 'roteiros', 'sistema/roteiros').split('\n'); } catch { continue; }
    const porSlug = new Map<string, string>();
    for (const f of lista) {
      const m = f.match(/^(?:sistema\/)?roteiros\/([^/]+)\/roteiro\.(md|txt)$/);
      if (m && (m[2] === 'md' || !porSlug.has(m[1]))) porSlug.set(m[1], f);
    }
    for (const [slug, f] of porSlug) guardar({ slug, quando, ler: () => git('show', `${ramo}:${f}`) });
  }
  return achados;
}

const ehPasta = (p: string) => { try { return fs.statSync(p).isDirectory(); } catch { return false; } };

// 2026-10-31-2d-codigo-de-barras -> codigo-de-barras-31-10-26
function pastaDe(slug: string) {
  const m = slug.match(/^(\d{4})-(\d{2})-(\d{2})-(?:[23]d-)?(.+)$/);
  return m ? { tema: m[4], nome: `${m[4]}-${m[3]}-${m[2]}-${m[1].slice(2)}` } : null;
}

export function sincronizar() {
  if (!fs.existsSync(DARK)) return;
  const lista = perfis();
  for (const [slug, r] of roteiros()) {
    const alvo = pastaDe(slug);
    if (!alvo) continue;
    let texto: string;
    try { texto = r.ler().replace(/\r\n/g, '\n'); } catch { continue; }
    const cabeca = texto.slice(0, 800).toLowerCase();
    const perfil = lista.find((p) => cabeca.includes(p.toLowerCase()));
    if (!perfil) continue; // sem página escrita no começo do roteiro: não dá pra saber onde mora
    const conteudo = path.join(RAIZ, perfil, 'conteudo');
    // o tema pode já ter pasta (de outra data, quando o vídeo saiu depois do roteiro)
    const existente = ehPasta(conteudo) ? fs.readdirSync(conteudo).find((n) => n.replace(/-\d{2}-\d{2}-\d{2}$/, '') === alvo.tema) : undefined;
    const pasta = path.join(conteudo, existente ?? alvo.nome);
    const ficha = path.join(pasta, 'ficha.md');
    const { campos, notas, existe } = lerFicha(ficha);
    const versoes = ehPasta(pasta) ? fs.readdirSync(pasta).filter((a) => /^roteiro-v\d+\.(md|txt)$/.test(a)) : [];
    // pasta que o EditOS já tinha com roteiro próprio: o dela manda, não mexe
    if (versoes.length && campos.origem !== `dark/${slug}`) continue;
    const ultima = versoes.map((a) => Number(a.match(/\d+/)![0])).sort((a, b) => b - a)[0] ?? 0;
    if (ultima && fs.readFileSync(path.join(pasta, versoes.find((a) => a.startsWith(`roteiro-v${ultima}.`))!), 'utf-8').replace(/\r\n/g, '\n') === texto) continue;
    fs.mkdirSync(pasta, { recursive: true });
    fs.writeFileSync(path.join(pasta, `roteiro-v${ultima + 1}.md`), texto, 'utf-8');
    campos.origem = `dark/${slug}`;
    if (!existe || !campos.status) campos.status = 'roteiro';
    escreverFicha(ficha, campos, notas);
  }
}

// busca o GitHub de tempos em tempos (em segundo plano) e sincroniza; a escrita nas pastas acorda o painel sozinha
let buscando = false;
export function vigiarDark(intervalo = 60000) {
  const rodada = () => {
    if (buscando || !fs.existsSync(DARK)) return;
    buscando = true;
    execFile('git', ['-c', 'safe.directory=*', 'fetch', '--all', '--prune', '-q'], { cwd: DARK, windowsHide: true, timeout: 60000 }, () => {
      buscando = false;
      try { sincronizar(); } catch { /* sem git: fica com o que já tem */ }
    });
  };
  rodada();
  return setInterval(rodada, intervalo);
}
