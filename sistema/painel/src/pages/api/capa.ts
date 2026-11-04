import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { RAIZ, pastaDoItem, nomeSeguro } from '../../lib/fluxo';

export const prerender = false;

// miniatura de um vídeo (um quadro aos 1,5 s), feita uma vez e guardada em sistema/.tmp/painel-capas/
const FFMPEG = path.join(RAIZ, 'sistema', 'tools', '.cache', 'ffmpeg', process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');
const CACHE = path.join(RAIZ, 'sistema', '.tmp', 'painel-capas');
let rodando = 0;
const fila: (() => void)[] = [];
const vez = () => new Promise<void>((ok) => (rodando < 2 ? (rodando++, ok()) : fila.push(() => (rodando++, ok()))));
const solta = () => { rodando--; fila.shift()?.(); };

function gerar(origem: string, destino: string) {
  return new Promise<boolean>((ok) => {
    execFile(FFMPEG, ['-y', '-v', 'error', '-ss', '1.5', '-i', origem, '-frames:v', '1', '-vf', 'scale=240:-2', '-q:v', '5', destino],
      { timeout: 20000, windowsHide: true }, (erro) => ok(!erro && fs.existsSync(destino)));
  });
}

export const GET: APIRoute = async ({ url }) => {
  const perfil = url.searchParams.get('perfil'), nome = url.searchParams.get('nome'), arquivo = url.searchParams.get('arquivo') ?? '';
  const pasta = pastaDoItem(perfil, nome);
  if (!pasta || !nomeSeguro(arquivo) || !/\.mp4$/i.test(arquivo)) return new Response('não encontrado', { status: 404 });
  const origem = path.join(pasta, arquivo);
  if (!fs.existsSync(origem) || !fs.existsSync(FFMPEG)) return new Response('não encontrado', { status: 404 });
  const quando = Math.round(fs.statSync(origem).mtimeMs);
  const destino = path.join(CACHE, `${perfil}__${nome}__${arquivo}__${quando}.jpg`);
  if (!fs.existsSync(destino)) {
    fs.mkdirSync(CACHE, { recursive: true });
    await vez();
    try { if (!fs.existsSync(destino) && !(await gerar(origem, destino))) return new Response('falhou', { status: 500 }); } finally { solta(); }
  }
  return new Response(fs.readFileSync(destino), { headers: { 'content-type': 'image/jpeg', 'cache-control': 'max-age=86400' } });
};
