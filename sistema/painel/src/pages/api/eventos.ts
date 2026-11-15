import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ, perfis, ATIVIDADE } from '../../lib/fluxo';
import { vigiarDark } from '../../lib/dark';

export const prerender = false;

// uma vigia só da Operação Dark pro servidor inteiro (busca o GitHub a cada minuto)
const g = globalThis as { vigiaDark?: unknown };
g.vigiaDark ??= vigiarDark();

// avisa a página quando algo muda nas pastas dos perfis (a página então relê o fluxo). Sem refresh manual.
export const GET: APIRoute = ({ request }) => {
  const vigias: fs.FSWatcher[] = [];
  let espera: ReturnType<typeof setTimeout> | undefined;
  const corpo = new ReadableStream({
    start(ctrl) {
      const enviar = (t: string) => { try { ctrl.enqueue(new TextEncoder().encode(t)); } catch { /* fechou */ } };
      const avisar = () => { clearTimeout(espera); espera = setTimeout(() => enviar('data: mudou\n\n'), 300); };
      // o diário do agente (agente.jsonl/.log) e a conversa da sala são escritos a cada passo e não mudam o quadro
      const ruido = (f: string | null) => !!f && /(^|[\\/])(\.tmp[\\/]|sala-conversa([\\/]|$)|agente\.(jsonl|log)$)/.test(f);
      const vigiar = (p: string, recursivo: boolean) => { try { vigias.push(fs.watch(p, { recursive: recursivo }, (_, f) => { if (!ruido(f)) avisar(); })); } catch { /* sumiu */ } };
      vigiar(RAIZ, false); // perfil novo ou apagado
      for (const p of perfis()) vigiar(path.join(RAIZ, p), true);
      const salasPedidos = path.join(RAIZ, 'sistema', 'salas-pedidos'); // pedidos no banco da Sala de produção
      fs.mkdirSync(salasPedidos, { recursive: true });
      vigiar(salasPedidos, true);
      // o vigia de sessão grava aqui: vigio a pasta (o arquivo é regravado inteiro a cada anotação)
      fs.mkdirSync(path.dirname(ATIVIDADE), { recursive: true });
      try { vigias.push(fs.watch(path.dirname(ATIVIDADE), (_, f) => { if (f === path.basename(ATIVIDADE)) avisar(); })); } catch { /* sem vigia */ }
      const pulso = setInterval(() => enviar(': pulso\n\n'), 25000);
      enviar('data: pronto\n\n');
      request.signal.addEventListener('abort', () => {
        clearInterval(pulso); clearTimeout(espera); vigias.forEach((v) => v.close());
        try { ctrl.close(); } catch { /* já fechado */ }
      });
    },
  });
  return new Response(corpo, { headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive' } });
};
