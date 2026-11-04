import type { APIRoute } from 'astro';
import { spawn } from 'node:child_process';
import { pastaDoItem } from '../../lib/fluxo';

export const prerender = false;

// abre a pasta do vídeo no explorador de arquivos do computador
export const POST: APIRoute = async ({ request }) => {
  const origem = request.headers.get('origin');
  if (origem && origem !== 'http://127.0.0.1:4700') return new Response('origem não permitida', { status: 403 });
  let corpo: Record<string, unknown>;
  try { corpo = await request.json(); } catch { return new Response('corpo inválido', { status: 400 }); }
  const pasta = pastaDoItem(corpo.perfil, corpo.nome);
  if (!pasta) return new Response('item não encontrado', { status: 404 });
  const programa = process.platform === 'win32' ? 'explorer.exe' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  spawn(programa, [pasta], { detached: true, stdio: 'ignore' }).unref();
  return new Response(null, { status: 204 });
};
