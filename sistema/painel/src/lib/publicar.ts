import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// publicação pelo Buffer: o vídeo sobe pro Cloudflare R2 (link público) e o post é criado no Buffer com esse link.
// As chaves ficam em sistema/painel/.env (só nesta máquina; o gerar-aberto.py nunca copia .env). Nunca vão pro navegador.
const ENV = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.env');

export function env(): Record<string, string> {
  const r: Record<string, string> = {};
  try {
    for (const l of fs.readFileSync(ENV, 'utf-8').split(/\r?\n/)) {
      const m = l.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) r[m[1]] = m[2].trim();
    }
  } catch { /* sem .env */ }
  return r;
}

export const REDES = ['youtube', 'instagram', 'facebook'] as const;
export type Rede = (typeof REDES)[number];
// BUFFER_CANAIS=perfil.rede:id,perfil.rede:id
export function canaisDoPerfil(perfil: string): Partial<Record<Rede, string>> {
  const r: Partial<Record<Rede, string>> = {};
  for (const par of (env().BUFFER_CANAIS ?? '').split(',')) {
    const [chave, id] = par.split(':').map((x) => x.trim());
    const [p, rede] = (chave ?? '').split('.');
    if (p === perfil && (REDES as readonly string[]).includes(rede) && /^[a-f0-9]{24}$/.test(id ?? '')) r[rede as Rede] = id;
  }
  return r;
}

const R2 = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET', 'R2_PUBLIC_URL'];
// o que falta configurar, em português, pro painel avisar (sem nunca mostrar as chaves)
export function faltando(perfil: string): string[] {
  const e = env(), f: string[] = [];
  if (!e.BUFFER_API_KEY) f.push('a chave do Buffer');
  if (!Object.keys(canaisDoPerfil(perfil)).length) f.push('os canais do Buffer deste perfil');
  if (R2.some((k) => !e[k])) f.push('o armazém da Cloudflare (R2)');
  return f;
}

// ── Cloudflare R2 (API do S3), assinatura AWS v4 feita à mão: sem dependência nova ──
const sha = (d: string | Buffer) => crypto.createHash('sha256').update(d).digest('hex');
const hmac = (k: Buffer | string, d: string) => crypto.createHmac('sha256', k).update(d).digest();
async function r2(metodo: 'PUT' | 'DELETE', chave: string, corpo?: Buffer, tipo = 'video/mp4') {
  const e = env();
  const host = `${e.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const caminho = `/${encodeURIComponent(e.R2_BUCKET)}/${chave.split('/').map(encodeURIComponent).join('/')}`;
  const agora = new Date().toISOString().replace(/[:-]|\.\d{3}/g, ''), dia = agora.slice(0, 8);
  const hashCorpo = corpo ? sha(corpo) : sha('');
  const cab: Record<string, string> = { host, 'x-amz-content-sha256': hashCorpo, 'x-amz-date': agora, ...(corpo ? { 'content-type': tipo } : {}) };
  const nomes = Object.keys(cab).sort();
  const canonico = [metodo, caminho, '', ...nomes.map((n) => `${n}:${cab[n]}`), '', nomes.join(';'), hashCorpo].join('\n');
  const escopo = `${dia}/auto/s3/aws4_request`;
  const assinar = ['AWS4-HMAC-SHA256', agora, escopo, sha(canonico)].join('\n');
  const k = hmac(hmac(hmac(hmac(`AWS4${e.R2_SECRET_ACCESS_KEY}`, dia), 'auto'), 's3'), 'aws4_request');
  const assinatura = crypto.createHmac('sha256', k).update(assinar).digest('hex');
  const r = await fetch(`https://${host}${caminho}`, {
    method: metodo, body: corpo,
    headers: { ...cab, authorization: `AWS4-HMAC-SHA256 Credential=${e.R2_ACCESS_KEY_ID}/${escopo}, SignedHeaders=${nomes.join(';')}, Signature=${assinatura}` },
  });
  if (!r.ok && !(metodo === 'DELETE' && r.status === 404)) throw new Error(`R2 respondeu ${r.status}`);
}
// sobe o vídeo e devolve o link público (nome com sufixo aleatório: o link não é adivinhável)
export async function subirVideo(arquivo: string, perfil: string, nome: string): Promise<string> {
  const chave = `${perfil}/${nome}-${crypto.randomBytes(6).toString('hex')}.mp4`.replace(/[^\w./-]/g, '-');
  await r2('PUT', chave, fs.readFileSync(arquivo));
  return `${env().R2_PUBLIC_URL.replace(/\/+$/, '')}/${chave}`;
}

// apaga do armazém pelo link público (limpeza depois que o Buffer já postou)
export async function apagarVideo(link: string) {
  const base = `${env().R2_PUBLIC_URL.replace(/\/+$/, '')}/`;
  if (!link.startsWith(base)) throw new Error('link fora do armazém');
  await r2('DELETE', decodeURIComponent(link.slice(base.length)));
}

// ── Buffer (GraphQL) ──
async function buffer(query: string, variables: Record<string, unknown>) {
  const r = await fetch('https://api.buffer.com', {
    method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${env().BUFFER_API_KEY}` },
    body: JSON.stringify({ query, variables }),
  });
  if (r.status === 429) throw new Error('O Buffer pediu pra esperar um pouco (limite de uso). Tente de novo em alguns minutos.');
  const j = await r.json().catch(() => null);
  if (!r.ok || !j || j.errors?.length) throw new Error(`Buffer: ${j?.errors?.[0]?.message ?? `erro ${r.status}`}`);
  return j.data;
}

export type Publicacao = {
  url: string; quando: 'agora' | 'fila' | 'data'; dueAt?: string; feitoComIA: boolean;
  // YouTube
  titulo: string; descricao: string; privacidade: 'public' | 'unlisted' | 'private'; categoria: string; paraCriancas: boolean;
  // Instagram e Facebook (Reels)
  legenda: string;
};
// cria o post numa rede. YouTube leva título e descrição; Instagram e Facebook vão como Reels, com a legenda
export async function criarPost(rede: Rede, canal: string, p: Publicacao): Promise<{ id: string; dueAt: string | null }> {
  const metadata = rede === 'youtube'
    ? { youtube: { title: p.titulo, privacy: p.privacidade, categoryId: p.categoria, madeForKids: p.paraCriancas, isAiGenerated: p.feitoComIA } }
    : rede === 'instagram'
      ? { instagram: { type: 'reel', shouldShareToFeed: true, isAiGenerated: p.feitoComIA } }
      : { facebook: { type: 'reel' } };
  const d = await buffer(`mutation($input: CreatePostInput!) {
    createPost(input: $input) { ... on PostActionSuccess { post { id dueAt } } ... on MutationError { message } }
  }`, { input: {
    channelId: canal, text: rede === 'youtube' ? p.descricao : p.legenda, schedulingType: 'automatic',
    mode: p.quando === 'agora' ? 'shareNow' : p.quando === 'fila' ? 'addToQueue' : 'customScheduled',
    ...(p.quando === 'data' ? { dueAt: p.dueAt } : {}),
    assets: [{ video: { url: p.url } }], metadata,
  } });
  const c = d?.createPost;
  if (!c?.post) throw new Error(c?.message ?? 'sem resposta');
  return { id: c.post.id, dueAt: c.post.dueAt ?? null };
}
