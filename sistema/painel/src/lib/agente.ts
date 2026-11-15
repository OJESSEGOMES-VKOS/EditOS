import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { RAIZ } from './fluxo';

// chama o agente pra atender um pedido de "Refazer" do painel, em segundo plano.
// Autorizado pelo Jessé em 2026-11-11: roda livre (sem pedir permissão), mas só dentro do EditOS
// e nunca publica, envia, paga ou exclui. Os passos ficam em agente.jsonl e os erros em agente.log, ao lado do pedido.
//
// Contexto (pedido do Jessé: "não ser como iniciar uma sessão crua toda vez"):
//  1. Se uma conversa já trabalhou neste vídeo (o vigia anota em <video>/.sessao.json), o Refazer CONTINUA
//     uma cópia dela (--resume + --fork-session): tudo o que foi dito, decidido e reprovado vem junto,
//     e a conversa original fica intacta. O próprio Refazer também é anotado, então o seguinte continua dele.
//  2. Sem conversa anotada, o agente da sala nasce com o banco da sala e um dossiê do vídeo
//     (ficha, roteiro, versões, oficina, pedidos anteriores) já apontado no prompt.
const REPO = path.resolve(RAIZ, '..', '..');
const CLAUDE = [path.join(os.homedir(), '.local', 'bin', 'claude.exe'), path.join(os.homedir(), '.local', 'bin', 'claude')].find((c) => fs.existsSync(c));
const rel = (p: string) => path.relative(REPO, p).replace(/\\/g, '/');

function conversaDoVideo(video: string): { id: string; cwd: string } | null {
  try {
    const s = JSON.parse(fs.readFileSync(path.join(video, '.sessao.json'), 'utf-8'));
    if (typeof s.id !== 'string' || !/^[\w-]{8,80}$/.test(s.id) || !fs.existsSync(s.transcript)) return null;
    return { id: s.id, cwd: s.cwd && fs.existsSync(s.cwd) ? s.cwd : REPO };
  } catch { return null; }
}

function dossie(perfil: string, video: string, pedidoDir: string): string[] {
  const arqs = fs.readdirSync(video);
  const nome = path.basename(video);
  const oficinas = (() => {
    const of = path.join(RAIZ, 'sistema', 'oficina');
    try {
      return fs.readdirSync(of).filter((d) => {
        try { const e = JSON.parse(fs.readFileSync(path.join(of, d, 'entrega.json'), 'utf-8')); return e.perfil === perfil && e.pasta === nome; } catch { return false; }
      }).map((d) => rel(path.join(of, d)));
    } catch { return []; }
  })();
  const anteriores = (() => {
    const rf = path.join(video, 'refazer');
    try { return fs.readdirSync(rf).map((d) => path.join(rf, d)).filter((d) => d !== pedidoDir).map((d) => rel(path.join(d, 'pedido.md'))); } catch { return []; }
  })();
  return [
    `Contexto deste vídeo (leia antes de mexer): o banco da sala em projetos/editos/${perfil}/sala.md;`,
    `a pasta do vídeo ${rel(video)} (${arqs.filter((a) => !a.startsWith('.') && a !== 'refazer').join(', ')});`,
    oficinas.length ? `a oficina onde ele foi produzido: ${oficinas.join(', ')} (código, cenas, voz; continue dali, não recomece do zero);` : 'a oficina dele, se existir, está em projetos/editos/sistema/oficina/ (procure pelo nome do vídeo);',
    anteriores.length ? `pedidos de alteração anteriores (o que já foi pedido e feito): ${anteriores.join(', ')}.` : '',
  ];
}

export function chamarAgente(perfil: string, pedidoRel: string, tipo: 'refazer' | 'produzir' = 'refazer'): boolean {
  const agente = path.join(REPO, '.claude', 'agents', `sala-${perfil}.md`);
  if (!CLAUDE || !fs.existsSync(agente)) return false;
  const pedido = path.join(RAIZ, pedidoRel);
  const video = path.resolve(pedido, '..', '..');
  const conversa = conversaDoVideo(video);
  const tarefa = [
    ...(tipo === 'produzir' ? [
      `O Jessé aprovou o roteiro deste vídeo no EditOS Online e mandou iniciar a produção completa (pedido em ${rel(pedido)}/pedido.md, com observações e anexos se houver).`,
      'Produza o vídeo inteiro a partir do roteiro mais recente da pasta, seguindo o fluxo normal do EditOS e o banco da sala (modelo, voz, som, cenas, render, conferência),',
      'e entregue o vídeo pronto como v1.mp4 (ou a próxima versão, se já existir alguma) na pasta do vídeo. Não mude o roteiro aprovado sem necessidade; se mudar, explique no pedido.md.',
    ] : [
      `Pedido de alteração feito pelo Jessé no EditOS Online, em ${rel(pedido)}/pedido.md (anexos na mesma pasta).`,
      'Leia o pedido e os anexos e refaça o vídeo atendendo ao pedido, entregando a próxima versão (vN+1.mp4) na pasta do vídeo, como no fluxo normal.',
    ]),
    'Regras deste modo: mexa só dentro de projetos/editos/. Nunca publique, envie, pague, exclua, faça commit ou mexa em produção.',
    'Se faltar algo pra fazer bem, não invente: escreva a dúvida no fim do pedido.md e pare.',
    'Ao terminar, mude "status: pendente" para "status: feito" no pedido.md, acrescente um resumo curto do que mudou,',
    'e no ficha.md do vídeo coloque status: revisar.',
  ];
  const prompt = (conversa
    ? [`Esta conversa é a que trabalhou no vídeo ${rel(video)}; continue dela, com tudo o que já foi decidido aqui. Você agora atende como o responsável pela sala ${perfil} (banco em projetos/editos/${perfil}/sala.md).`, ...tarefa]
    : [...tarefa, ...dossie(perfil, video, pedido)]).filter(Boolean).join(' ');
  const args = conversa
    ? ['-p', prompt, '--resume', conversa.id, '--fork-session']
    : ['-p', prompt, '--agent', `sala-${perfil}`];
  rodar(args, conversa?.cwd ?? REPO, pedido, conversa ? `continuando a conversa ${conversa.id}` : `agente sala-${perfil} com dossiê`);
  return true;
}

// cada passo do agente sai como uma linha JSON em agente.jsonl: o painel lê dali as notificações da sala (sem gastar token)
function rodar(args: string[], cwd: string, pedido: string, como: string) {
  args.push('--dangerously-skip-permissions', '--output-format', 'stream-json', '--verbose');
  const passos = fs.openSync(path.join(pedido, 'agente.jsonl'), 'a'), log = fs.openSync(path.join(pedido, 'agente.log'), 'a');
  fs.appendFileSync(path.join(pedido, 'agente.log'), `${new Date().toISOString()} ${como}
`);
  const filho = spawn(CLAUDE!, args, { cwd, detached: true, stdio: ['ignore', passos, log], windowsHide: true });
  filho.on('error', (e) => fs.appendFileSync(path.join(pedido, 'agente.log'), `
falhou ao chamar: ${e.message}
`));
  filho.unref();
}

// pedido de alteração no banco da sala (o sala.md do perfil, ou o protocolo sistema/salas.md na Sala de produção)
export function chamarAgenteBanco(perfil: string, banco: string, pedido: string): boolean {
  const agente = path.join(REPO, '.claude', 'agents', `sala-${perfil}.md`);
  const comAgente = fs.existsSync(agente);
  if (!CLAUDE) return false;
  const prompt = [
    `Pedido do Jessé, feito no EditOS Online, pra atualizar o banco ${rel(banco)}: leia ${rel(pedido)}/pedido.md e os anexos da mesma pasta.`,
    'Edite só esse banco, seguindo o formato do protocolo projetos/editos/sistema/salas.md (uma regra por linha, com data de hoje, frase curta).',
    'Regra nova que contradiz uma antiga substitui a antiga, não convive com ela. Não invente nada além do que o pedido e os anexos dizem.',
    'Nunca publique, envie, pague, exclua arquivos, faça commit ou mexa fora de projetos/editos/.',
    'Se algo estiver ambíguo, escreva a dúvida no fim do pedido.md e pare.',
    'Ao terminar, mude "status: pendente" para "status: feito" no pedido.md e acrescente um resumo curto do que mudou no banco.',
  ].join(' ');
  rodar(['-p', prompt, ...(comAgente ? ['--agent', `sala-${perfil}`] : [])], REPO, pedido, `banco ${rel(banco)}`);
  return true;
}
