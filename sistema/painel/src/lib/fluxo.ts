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
  const cab = ['status', 'link', 'insight', 'origem'].filter((k) => k !== 'origem' || campos.origem).map((k) => `${k}: ${(campos[k] ?? '').replace(/\n/g, ' ')}`).join('\n');
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
  const mudou = Math.max(...arqs.map((a) => fs.statSync(path.join(pasta, a)).mtimeMs), fs.statSync(pasta).mtimeMs);
  return {
    perfil, nome, titulo: (m ? m[1] : nome).replace(/-/g, ' '), data: m ? `${m[2]}/${m[3]}/${m[4]}` : null,
    status, statusDaFicha: existe && !!campos.status, videos, roteiros,
    resumo: roteiros.length ? resumoDe(path.join(pasta, roteiros[roteiros.length - 1])) : '',
    link: campos.link ?? '', insight: campos.insight ?? '', notas, mudou,
  };
}

export function fluxo() {
  const lista = perfis();
  const itens: Item[] = [];
  for (const p of lista) {
    const c = path.join(RAIZ, p, 'conteudo');
    if (!ehPasta(c)) continue;
    for (const n of fs.readdirSync(c)) if (ehPasta(path.join(c, n))) itens.push(item(p, n));
  }
  itens.sort((a, b) => b.mudou - a.mudou);
  // o @ de cada perfil, lido do perfil.md ("- @: @nome")
  const arrobas = Object.fromEntries(lista.map((p) => {
    const t = fs.readFileSync(path.join(RAIZ, p, 'perfil.md'), 'utf-8');
    return [p, t.match(/^- @:\s*(@\S+)/m)?.[1] ?? ''];
  }));
  return { perfis: lista, arrobas, status: STATUS, itens };
}

// caminho de um item vindo de fora: só perfil e pasta que existem de verdade (nada de ../)
export function pastaDoItem(perfil: unknown, nome: unknown): string | null {
  if (typeof perfil !== 'string' || typeof nome !== 'string') return null;
  if (!perfis().includes(perfil) || !nomeSeguro(nome)) return null;
  const conteudo = path.join(RAIZ, perfil, 'conteudo');
  const p = path.join(conteudo, nome);
  return path.dirname(p) === conteudo && ehPasta(p) ? p : null;
}

// nome de arquivo ou pasta simples: começa com letra/número, sem barra e sem ".."
export function nomeSeguro(nome: string) {
  return /^\w[\w.-]*$/.test(nome) && !nome.includes('..');
}
