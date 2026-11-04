import type { APIRoute } from 'astro';
import path from 'node:path';
import { fluxo, lerFicha, escreverFicha, pastaDoItem, STATUS } from '../../lib/fluxo';

export const prerender = false;

export const GET: APIRoute = () =>
  new Response(JSON.stringify(fluxo()), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

// muda o status, o link ou o insight de um item (grava no ficha.md da pasta dele)
export const POST: APIRoute = async ({ request }) => {
  const origem = request.headers.get('origin');
  if (origem && origem !== 'http://127.0.0.1:4700') return new Response('origem não permitida', { status: 403 });
  let corpo: Record<string, unknown>;
  try { corpo = await request.json(); } catch { return new Response('corpo inválido', { status: 400 }); }
  const pasta = pastaDoItem(corpo.perfil, corpo.nome);
  if (!pasta) return new Response('item não encontrado', { status: 404 });
  const arquivo = path.join(pasta, 'ficha.md');
  const { campos, notas } = lerFicha(arquivo);
  if (corpo.status !== undefined) {
    if (!(STATUS as readonly unknown[]).includes(corpo.status)) return new Response('status inválido', { status: 400 });
    campos.status = corpo.status as string;
  }
  for (const k of ['link', 'insight'] as const) {
    if (corpo[k] === undefined) continue;
    if (typeof corpo[k] !== 'string' || (corpo[k] as string).length > 2000) return new Response(`${k} inválido`, { status: 400 });
    campos[k] = corpo[k] as string;
  }
  escreverFicha(arquivo, campos, notas);
  return new Response(null, { status: 204 });
};
