import type { APIRoute } from 'astro';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pastaDoItem, nomeSeguro, RAIZ } from '../../lib/fluxo';

import { ORIGENS } from '../../lib/origem';

export const prerender = false;

// abre a pasta do vídeo no explorador de arquivos do computador
export const POST: APIRoute = async ({ request }) => {
  const origem = request.headers.get('origin');
  if (origem && !ORIGENS.has(origem)) return new Response('origem não permitida', { status: 403 });
  let corpo: Record<string, unknown>;
  try { corpo = await request.json(); } catch { return new Response('corpo inválido', { status: 400 }); }
  const pasta = pastaDoItem(corpo.perfil, corpo.nome);
  if (!pasta) return new Response('item não encontrado', { status: 404 });
  // com "arquivo" (um vídeo da pasta), o Explorer já abre com ele selecionado
  const arq = typeof corpo.arquivo === 'string' && nomeSeguro(corpo.arquivo) && fs.existsSync(path.join(pasta, corpo.arquivo)) ? path.join(pasta, corpo.arquivo) : null;
  if (process.platform === 'win32') {
    // no Windows, um script abre o Explorer no lugar certo (caminho com espaço quebrava o /select e caía em Documentos)
    // e traz a janela pra frente (aberta pelo painel, ela nascia minimizada atrás do navegador)
    const script = path.join(RAIZ, 'sistema', 'painel', 'scripts', 'abrir-no-explorer.ps1');
    spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-WindowStyle', 'Hidden', '-File', script, '-Alvo', arq ?? pasta, ...(arq ? ['-Selecionar'] : [])],
      { stdio: 'ignore', windowsHide: true }); // sem "detached": destacado, o Windows encerra o script antes de abrir a janela
  } else {
    spawn(process.platform === 'darwin' ? 'open' : 'xdg-open', arq && process.platform === 'darwin' ? ['-R', arq] : [pasta], { detached: true, stdio: 'ignore' }).unref();
  }
  return new Response(null, { status: 204 });
};
