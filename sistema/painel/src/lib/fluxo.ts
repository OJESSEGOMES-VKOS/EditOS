// Lê o fluxo de produção direto das pastas do EditOS. A fonte da verdade é o disco:
// perfil = pasta da raiz com perfil.md; item = pasta em <perfil>/conteudo/; o estado mora no ficha.md do item.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
export const STATUS = ['roteiro', 'produzindo', 'revisar', 'pronto', 'publicado'] as const;
export type Status = (typeof STATUS)[number];

export type Item = {
  perfil: string; nome: string; titulo: string; data: string | null; status: Status; statusDaFicha: boolean;
  videos: string[]; roteiros: string[]; resumo: string; link: string; insight: string; notas: string; mudou: number;
  agendado: string; // publicação marcada no Buffer (data ISO ou "fila do Buffer"); vazio = nada marcado
  etapas: string[]; // os últimos passos do agente no pedido pendente mais novo, em português (o mais novo por último)
  pedidos: number; // pedidos de Refazer ainda pendentes (refazer/*/pedido.md)
  sessao: number | null; // quando uma sessão do Claude mexeu nele pela última vez (vigia-sessao.mjs)
};

// a primeira frase de verdade do roteiro (pula título, marcação e linha vazia), pro cartão
function resumoDe(arquivo: string) {
  try {
    const linha = fs.readFileSync(arquivo, 'utf-8').split(/\r?\n/).map((l) => l.trim())
      .find((l) => l.replace(/[^\p{L}]/gu, '').length > 12 && !/^(#|---|>|\||```)/.test(l)
        && !/^\*\*[^*]+\*\*:?$/.test(l) && !/^[\p{L} ]{1,24}:/u.test(l.replace(/[*_]/g, '')));
    return (linha ?? '').replace(/[*_`]/g, '').replace(/^[-•]\s*/, '').slice(0, 140);
  } catch { return ''; }
}

const ehPasta = (p: string) => { try { return fs.statSync(p).isDirectory(); } catch { return false; } };

export function perfis(): string[] {
  return fs.readdirSync(RAIZ).filter((n) => !n.startsWith('.') && n !== 'sistema' && fs.existsSync(path.join(RAIZ, n, 'perfil.md'))).sort();
}

// ficha.md: cabeçalho "chave: valor" entre linhas ---, e o resto são notas livres
export function lerFicha(arquivo: string) {
  const campos: Record<string, string> = {};
  let notas = '';
  if (!fs.existsSync(arquivo)) return { campos, notas, existe: false };
  const t = fs.readFileSync(arquivo, 'utf-8').replace(/\r\n/g, '\n');
  const m = t.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (m) {
    for (const linha of m[1].split('\n')) {
      const i = linha.indexOf(':');
      if (i > 0) campos[linha.slice(0, i).trim()] = linha.slice(i + 1).trim();
    }
    notas = m[2].trim();
  } else notas = t.trim();
  return { campos, notas, existe: true };
}

export function escreverFicha(arquivo: string, campos: Record<string, string>, notas: string) {
  // os campos de sempre primeiro; os opcionais (origem, e os da publicação: buffer, agendado) só se existirem
  const cab = ['status', 'link', 'insight', 'origem', 'buffer', 'agendado'].filter((k) => ['status', 'link', 'insight'].includes(k) || campos[k]).map((k) => `${k}: ${(campos[k] ?? '').replace(/\n/g, ' ')}`).join('\n');
  fs.writeFileSync(arquivo, `---\n${cab}\n---\n${notas ? notas + '\n' : ''}`, 'utf-8');
}

const porVersao = (a: string, b: string) => Number(a.match(/v(\d+)/)?.[1] ?? 0) - Number(b.match(/v(\d+)/)?.[1] ?? 0);

function item(perfil: string, nome: string): Item {
  const pasta = path.join(RAIZ, perfil, 'conteudo', nome);
  const arqs = fs.readdirSync(pasta);
  const videos = arqs.filter((a) => /^v\d+.*\.mp4$/i.test(a)).sort(porVersao);
  const roteiros = arqs.filter((a) => /^roteiro-v\d+\.(md|txt)$/i.test(a)).sort(porVersao);
  const { campos, notas, existe } = lerFicha(path.join(pasta, 'ficha.md'));
  const doDisco: Status = videos.length ? 'revisar' : 'roteiro';
  const status = (STATUS as readonly string[]).includes(campos.status) ? (campos.status as Status) : doDisco;
  const m = nome.match(/^(.*)-(\d{2})-(\d{2})-(\d{2})$/);
  const rf = path.join(pasta, 'refazer');
  const pendentes = ehPasta(rf) ? fs.readdirSync(rf).filter((d) => { try { return /status:\s*pendente/.test(fs.readFileSync(path.join(rf, d, 'pedido.md'), 'utf-8')); } catch { return false; } }).sort() : [];
  const pedidos = pendentes.length;
  const etapas = pedidos ? etapasDoAgente(path.join(rf, pendentes[pedidos - 1], 'agente.jsonl')) : [];
  const mudou = Math.max(...arqs.map((a) => fs.statSync(path.join(pasta, a)).mtimeMs), fs.statSync(pasta).mtimeMs);
  return {
    perfil, nome, titulo: (m ? m[1] : nome).replace(/-/g, ' '), data: m ? `${m[2]}/${m[3]}/${m[4]}` : null,
    status, statusDaFicha: existe && !!campos.status, videos, roteiros,
    resumo: roteiros.length ? resumoDe(path.join(pasta, roteiros[roteiros.length - 1])) : '',
    link: campos.link ?? '', insight: campos.insight ?? '', agendado: campos.agendado ?? '', notas, mudou, pedidos, etapas, sessao: null,
  };
}

// traduz o registro do agente (stream-json do Claude Code) em passos curtos: "Lendo roteiro.md", "Rodando o render"...
const base = (p: unknown) => (typeof p === 'string' ? path.basename(p) : '');
function passo(c: { type?: string; name?: string; text?: string; input?: Record<string, unknown> }): string | null {
  if (c.type === 'text' && c.text?.trim()) { const t = c.text.trim().split(/\n/)[0].replace(/[*_`#]/g, ''); return t.length > 90 ? `${t.slice(0, 88)}…` : t; }
  if (c.type !== 'tool_use') return null;
  const i = c.input ?? {};
  switch (c.name) {
    case 'Read': return `Lendo ${base(i.file_path)}`;
    case 'Write': return `Criando ${base(i.file_path)}`;
    case 'Edit': case 'MultiEdit': return `Editando ${base(i.file_path)}`;
    case 'Glob': case 'Grep': return 'Procurando nos arquivos';
    case 'Bash': case 'PowerShell': { const d = typeof i.description === 'string' ? i.description : ''; return d ? d.slice(0, 80) : 'Rodando um comando'; }
    case 'Agent': case 'Task': return `Chamando ajudante${typeof i.description === 'string' ? `: ${i.description.slice(0, 60)}` : ''}`;
    case 'WebSearch': case 'WebFetch': return 'Pesquisando na internet';
    case 'TodoWrite': return 'Organizando as tarefas';
    default: return null;
  }
}
function etapasDoAgente(arquivo: string): string[] {
  let t = '';
  try { const fd = fs.openSync(arquivo, 'r'), tam = fs.fstatSync(fd).size, n = Math.min(tam, 200_000), b = Buffer.alloc(n); fs.readSync(fd, b, 0, n, tam - n); fs.closeSync(fd); t = b.toString('utf-8'); }
  catch { return ['Agente chamado, começando…']; }
  const saida: string[] = [];
  for (const linha of t.split(/\n/)) {
    let ev: { type?: string; subtype?: string; message?: { content?: unknown[] } };
    try { ev = JSON.parse(linha); } catch { continue; }
    if (ev.type === 'assistant' && Array.isArray(ev.message?.content)) for (const c of ev.message!.content) { const p = passo(c as never); if (p) saida.push(p); }
    if (ev.type === 'result') saida.push(ev.subtype === 'success' ? 'Terminou' : 'Parou com erro (ver agente.log)');
  }
  return saida.length ? saida.slice(-3) : ['Agente chamado, começando…'];
}

// o tema de uma pasta, sem data e sem palavrinha de ligação: "mortos-de-jerusalem-11-11-26" -> "mortos-jerusalem"
const LIGACAO = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'o', 'a', 'os', 'as', 'no', 'na']);
const partes = (nome: string) => nome.replace(/-\d{2}-\d{2}-\d{2}$/, '').toLowerCase().split('-').filter((p) => p && !LIGACAO.has(p));
const temaDe = (nome: string) => partes(nome).join('-');
// o roteiro pode vir com a sigla do perfil na frente ("jdv-", "mdt-"): vale com e sem ela
function temasPossiveis(nome: string) {
  const p = partes(nome);
  return p.length > 1 && p[0].length <= 4 ? [p.join('-'), p.slice(1).join('-')] : [p.join('-')];
}

// o vigia de sessão anota aqui quem mexeu em qual vídeo e quando
export const ATIVIDADE = path.join(RAIZ, 'sistema', '.tmp', 'atividade.json');
function atividade(): Record<string, { quando: number }> {
  try { return JSON.parse(fs.readFileSync(ATIVIDADE, 'utf-8')); } catch { return {}; }
}

export function fluxo() {
  const lista = perfis();
  const reg = atividade();
  const itens: Item[] = [];
  for (const p of lista) {
    const c = path.join(RAIZ, p, 'conteudo');
    if (!ehPasta(c)) continue;
    for (const n of fs.readdirSync(c)) if (ehPasta(path.join(c, n))) itens.push(item(p, n));
  }
  for (const i of itens) i.sessao = reg[`${i.perfil}/${i.nome}`]?.quando ?? null;
  // arquivados: roteiro sem vídeo cujo tema já tem vídeo em Pronto ou Publicado no mesmo perfil.
  // (os roteiros da Operação Dark chegam em pasta própria, "jdv-ezequiel-deitado", e o vídeo nasce em outra,
  // "ezequiel-deitado"). Nada é movido nem apagado: o painel só tira do fluxo e mostra em Arquivados.
  const feitos = new Set(itens.filter((i) => i.videos.length && (i.status === 'pronto' || i.status === 'publicado')).map((i) => `${i.perfil}/${temaDe(i.nome)}`));
  const arquivados = itens.filter((i) => !i.videos.length && i.status === 'roteiro' && temasPossiveis(i.nome).some((t) => feitos.has(`${i.perfil}/${t}`)));
  const ativos = itens.filter((i) => !arquivados.includes(i));
  itens.sort((a, b) => Math.max(b.mudou, b.sessao ?? 0) - Math.max(a.mudou, a.sessao ?? 0));
  // o @ de cada perfil, lido do perfil.md ("- @: @nome")
  const arrobas = Object.fromEntries(lista.map((p) => {
    const t = fs.readFileSync(path.join(RAIZ, p, 'perfil.md'), 'utf-8');
    return [p, t.match(/^- @:\s*(@\S+)/m)?.[1] ?? ''];
  }));
  // o agente mexendo no banco de uma sala (pedido do botão "Enviar alteração"): os passos viram notificação da sala
  const bancos: Record<string, string[]> = {};
  for (const [k, dir] of [...lista.map((p) => [p, path.join(RAIZ, p, 'sala-pedidos')]), ['todos', path.join(RAIZ, 'sistema', 'salas-pedidos')]]) {
    if (!ehPasta(dir)) continue;
    const pend = fs.readdirSync(dir).filter((d) => { try { return /status:\s*pendente/.test(fs.readFileSync(path.join(dir, d, 'pedido.md'), 'utf-8')); } catch { return false; } }).sort();
    if (pend.length) bancos[k] = etapasDoAgente(path.join(dir, pend[pend.length - 1], 'agente.jsonl'));
  }
  return { perfis: lista, arrobas, status: STATUS, itens: ativos, arquivados, bancos };
}

// caminho de um item vindo de fora: só perfil e pasta que existem de verdade (nada de ../)
export function pastaDoItem(perfil: unknown, nome: unknown): string | null {
  if (typeof perfil !== 'string' || typeof nome !== 'string') return null;
  if (!perfis().includes(perfil) || !nomeSeguro(nome)) return null;
  const conteudo = path.join(RAIZ, perfil, 'conteudo');
  const p = path.join(conteudo, nome);
  return path.dirname(p) === conteudo && ehPasta(p) ? p : null;
}

// nome de arquivo ou pasta simples: começa com letra, número ou # (as pastas "#03"), sem barra e sem ".."
export function nomeSeguro(nome: string) {
  return /^[\w#][\w.#-]*$/.test(nome) && !nome.includes('..');
}
