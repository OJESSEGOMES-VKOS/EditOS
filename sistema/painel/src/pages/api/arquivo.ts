import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pastaDoItem, nomeSeguro } from '../../lib/fluxo';

export const prerender = false;

const TIPOS: Record<string, string> = { '.mp4': 'video/mp4', '.md': 'text/plain; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };

// entrega um vídeo ou roteiro de um item, só de dentro da pasta dele (o vídeo com Range, pra dar pra pular no player)
export const GET: APIRoute = ({ url, request }) => {
  const pasta = pastaDoItem(url.searchParams.get('perfil'), url.searchParams.get('nome'));
  const nome = url.searchParams.get('arquivo') ?? '';
  if (!pasta || !nomeSeguro(nome) ||!TIPOS[path.extname(nome).toLowerCase()]) return new Response('não encontrado', { status: 404 });
  const arq = path.join(pasta, nome);
  if (!fs.existsSync(arq)) return new Response('não encontrado', { status: 404 });
  const tipo = TIPOS[path.extname(nome).toLowerCase()];
  const total = fs.statSync(arq).size;
  const faixa = request.headers.get('range')?.match(/bytes=(\d*)-(\d*)/);
  if (faixa) {
    const ini = faixa[1] ? Number(faixa[1]) : 0;
    const fim = faixa[2] ? Math.min(Number(faixa[2]), total - 1) : total - 1;
    if (ini > fim || ini >= total) return new Response(null, { status: 416, headers: { 'content-range': `bytes */${total}` } });
    const s = Readable.toWeb(fs.createReadStream(arq, { start: ini, end: fim })) as ReadableStream;
    return new Response(s, { status: 206, headers: { 'content-type': tipo, 'content-length': String(fim - ini + 1), 'content-range': `bytes ${ini}-${fim}/${total}`, 'accept-ranges': 'bytes' } });
  }
  const s = Readable.toWeb(fs.createReadStream(arq)) as ReadableStream;
  return new Response(s, { headers: { 'content-type': tipo, 'content-length': String(total), 'accept-ranges': 'bytes' } });
};
