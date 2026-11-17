// A voz do vídeo. Lê a seção "## Fala" do roteiro.md (uma frase por linha) e
// escreve o fala.json, que dá o tempo de cada frase e de cada palavra. É esse
// arquivo que amarra as cenas e a legenda na narração.
//
//   node animacoes/ferramentas/voz.mjs <video>           sem narração (o padrão): o tempo sai do tempo de leitura
//   node animacoes/ferramentas/voz.mjs <video> --motor arquivo --audio minha-gravacao.m4a
//                                                        a pessoa gravou a própria voz
//   node animacoes/ferramentas/voz.mjs <video> --motor kie [--voz Puck] [--tom "..."]
//                                                        voz de IA paga da kie.ai (KIE_API_KEY em sistema/kit/.env)
// (rode de dentro de sistema/; <video> é a pasta da oficina, inteira ou um pedaço do nome)
import fs from 'node:fs';
import path from 'node:path';
import {PUBLICO, SISTEMA, acharVideo, duracaoDe, ffmpeg, npx, opcoes, parar, registrarVideos, tmp} from './comum.mjs';

const {soltos, op} = opcoes();
const video = acharVideo(soltos[0]);
const motor = op.motor || (op.audio ? 'arquivo' : 'sem');

// ---------- 1. as frases do roteiro ----------

const roteiro = path.join(video.dir, 'roteiro.md');
if (!fs.existsSync(roteiro)) parar(`Falta o roteiro.md em ${video.pasta}/.`);
const bloco = fs.readFileSync(roteiro, 'utf8').split(/^## Fala\s*$/m)[1];
if (!bloco) parar('O roteiro.md precisa de uma seção "## Fala", com uma frase por linha.');
const frases = bloco
  .split(/^## /m)[0]
  .split('\n')
  .map((l) => l.replace(/^\s*(?:[-*]|\d+[.)])\s+/, '').trim())
  .filter((l) => l && !l.startsWith('<!--') && !l.startsWith('>'));
if (frases.length < 2) parar('A seção "## Fala" precisa de pelo menos duas frases, uma por linha.');

const palavrasDe = (texto) => texto.split(/\s+/).filter(Boolean);
const peso = (w) => w.replace(/[^\p{L}\p{N}]/gu, '').length + 2; // toda palavra custa um pouco, mesmo curta

/** Espalha as palavras de uma frase entre `s` e `e`, na proporção do tamanho de cada uma. */
const espalhar = (texto, s, e) => {
  const ws = palavrasDe(texto);
  const total = ws.reduce((n, w) => n + peso(w), 0);
  let t = s;
  return ws.map((w) => {
    const d = ((e - s) * peso(w)) / total;
    const p = {w, s: +t.toFixed(3), e: +(t + d).toFixed(3)};
    t += d;
    return p;
  });
};

const pastaAudio = path.join(PUBLICO, 'videos', video.pasta);
fs.mkdirSync(pastaAudio, {recursive: true});
const caminhoPublico = (arquivo) => `videos/${video.pasta}/${arquivo}`;

// ---------- 2. os motores ----------

/** Sem narração: cada frase fica na tela o tempo de ler (1 s + 3 palavras por segundo). */
const motorSem = () => {
  let t = 0.4;
  const saida = frases.map((texto) => {
    const dur = Math.max(1.6, 1 + palavrasDe(texto).length / 3);
    const f = {texto, s: +t.toFixed(3), e: +(t + dur).toFixed(3), palavras: espalhar(texto, t, t + dur)};
    t += dur + 0.25;
    return f;
  });
  return {duracao: +(t + 0.6).toFixed(3), audio: null, frases: saida};
};

/** Acha os silêncios de um áudio: é neles que uma frase acaba e a outra começa. */
const silencios = (arquivo) => {
  const {saida} = npx(['remotion', 'ffmpeg', '-hide_banner', '-i', arquivo, '-af', 'silencedetect=noise=-32dB:d=0.22', '-f', 'null', '-'], {permitirErro: true});
  const ini = [...saida.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]);
  const fim = [...saida.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
  return ini.map((s, i) => ({s, e: fim[i] ?? s + 0.3})).filter((x) => x.e > x.s);
};

/**
 * Tempo das frases num áudio que já existe (a voz da pessoa, ou a voz paga):
 * estima onde cada frase acaba pelo tamanho do texto e ajusta pro silêncio mais perto.
 */
const alinharPorPausas = (arquivo) => {
  const total = duracaoDe(arquivo);
  const pausas = silencios(arquivo);
  const comeco = pausas[0] && pausas[0].s < 0.05 ? pausas[0].e : 0;
  const fimDaFala = pausas.length && pausas[pausas.length - 1].e > total - 0.05 ? pausas[pausas.length - 1].s : total;
  const pesos = frases.map((f) => palavrasDe(f).reduce((n, w) => n + peso(w), 0));
  const soma = pesos.reduce((a, b) => a + b, 0);
  const meio = pausas.filter((p) => p.s > comeco + 0.3 && p.e < fimDaFala - 0.3);
  const cortes = [];
  let acumulado = 0;
  for (let i = 0; i < frases.length - 1; i++) {
    acumulado += pesos[i];
    const previsto = comeco + ((fimDaFala - comeco) * acumulado) / soma;
    const anterior = cortes[i - 1]?.e ?? comeco;
    const perto = meio
      .filter((p) => p.s > anterior + 0.4 && Math.abs((p.s + p.e) / 2 - previsto) < 2.2)
      .sort((a, b) => Math.abs((a.s + a.e) / 2 - previsto) - Math.abs((b.s + b.e) / 2 - previsto))[0];
    cortes.push(perto ? {s: perto.s, e: perto.e} : {s: previsto, e: previsto + 0.05});
  }
  return frases.map((texto, i) => {
    const s = i === 0 ? comeco : cortes[i - 1].e;
    const e = i === frases.length - 1 ? fimDaFala : cortes[i].s;
    return {texto, s: +s.toFixed(3), e: +e.toFixed(3), palavras: espalhar(texto, s, e)};
  });
};

/** A pessoa gravou a própria voz lendo a seção "## Fala". */
const motorArquivo = () => {
  if (typeof op.audio !== 'string') parar('Diga qual gravação usar: --motor arquivo --audio <arquivo de áudio>');
  const origem = [op.audio, path.join(video.dir, op.audio), path.join(SISTEMA, op.audio)].find((p) => fs.existsSync(p));
  if (!origem) parar(`Não achei a gravação "${op.audio}". Coloque o arquivo dentro da pasta do vídeo (${video.pasta}/).`);
  const final = path.join(pastaAudio, 'voz.mp3');
  // só nivela o volume, sem mexer no timbre
  ffmpeg(['-i', origem, '-vn', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '44100', '-ac', '1', '-b:a', '128k', final]);
  return {duracao: +(duracaoDe(final) + 0.5).toFixed(3), audio: caminhoPublico('voz.mp3'), frases: alinharPorPausas(final)};
};

/** Voz paga da kie.ai (Gemini TTS). A chave KIE_API_KEY vem do ambiente ou do .env do estúdio (o mesmo das vozes do EditOS). */
const motorKie = async () => {
  const lerEnv = (arq) => (fs.existsSync(arq) ? (fs.readFileSync(arq, 'utf8').match(/^KIE_API_KEY\s*=\s*(.+)$/m) || [])[1]?.trim() : '');
  const chave = process.env.KIE_API_KEY || lerEnv(path.join(SISTEMA, 'kit', '.env')) || lerEnv(path.join(SISTEMA, '.env'));
  if (!chave) parar('Falta a chave da kie.ai. Ponha a linha KIE_API_KEY= seguida da sua chave no arquivo sistema/kit/.env (ele fica só no seu computador).');
  const API = 'https://api.kie.ai';
  const cab = {Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json'};
  const voz = typeof op.voz === 'string' ? op.voz : 'Puck';
  const tom = typeof op.tom === 'string' ? op.tom : 'Narração de vídeo curto em português do Brasil, natural, clara e animada, de quem conta uma história pra um amigo.';
  const pedido = await fetch(`${API}/api/v1/jobs/createTask`, {
    method: 'POST',
    headers: cab,
    body: JSON.stringify({
      model: 'google/gemini-3-8-flash-tts',
      input: {
        temperature: 1,
        speakers: [{speaker_id: 'Speaker 1', voice_name: voz}],
        dialogue_turns: [{speaker_id: 'Speaker 1', text: frases.join(' '), style: tom}],
      },
    }),
  }).then((r) => r.json());
  if (pedido.code !== 200) parar(`A kie.ai recusou o pedido: ${pedido.code} ${pedido.msg || ''}`);
  const t0 = Date.now();
  let url;
  while (Date.now() - t0 < 600000) {
    await new Promise((r) => setTimeout(r, 4000));
    const j = await fetch(`${API}/api/v1/jobs/recordInfo?taskId=${pedido.data.taskId}`, {headers: cab}).then((r) => r.json());
    const d = j.data || {};
    if (d.state === 'success') {
      url = JSON.parse(d.resultJson).resultUrls[0];
      console.log(`  créditos gastos na kie.ai: ${d.creditsConsumed ?? '?'}`);
      break;
    }
    if (d.state === 'fail') parar(`A voz falhou na kie.ai: ${d.failMsg || d.failCode}`);
  }
  if (!url) parar('A voz demorou mais de 10 minutos. Tente de novo.');
  const bruto = path.join(tmp(), 'voz-kie.wav');
  fs.writeFileSync(bruto, Buffer.from(await fetch(url).then((r) => r.arrayBuffer())));
  const final = path.join(pastaAudio, 'voz.mp3');
  ffmpeg(['-i', bruto, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '44100', '-ac', '1', '-b:a', '128k', final]);
  return {duracao: +(duracaoDe(final) + 0.7).toFixed(3), audio: caminhoPublico('voz.mp3'), frases: alinharPorPausas(final), voz};
};

// ---------- 3. grava o fala.json ----------

const motores = {sem: motorSem, arquivo: motorArquivo, kie: motorKie};
if (!motores[motor]) parar(`Motor de voz desconhecido: "${motor}". Use arquivo, kie ou sem.`);
console.log(`Voz de ${video.pasta} (${frases.length} frases, motor: ${motor})...`);
const fala = await motores[motor]();

// nenhuma frase pode começar antes da anterior acabar, e a primeira não começa colada no zero negativo
fala.frases.forEach((f, i) => {
  if (i > 0 && f.s < fala.frases[i - 1].e) f.s = fala.frases[i - 1].e;
  if (f.e < f.s + 0.3) f.e = +(f.s + 0.3).toFixed(3);
});

fs.writeFileSync(path.join(video.dir, 'fala.json'), JSON.stringify({motor, ...fala}, null, 1));
registrarVideos();

const palavras = fala.frases.reduce((n, f) => n + f.palavras.length, 0);
console.log(`✓ fala.json pronto: ${fala.duracao.toFixed(1)} s, ${palavras} palavras${fala.audio ? `, ${(palavras / fala.duracao).toFixed(1)} palavras por segundo` : ' (sem narração)'}.`);
fala.frases.forEach((f, i) => console.log(`  ${String(i).padStart(2)}  ${f.s.toFixed(2).padStart(6)} a ${f.e.toFixed(2).padStart(6)}  ${f.texto.slice(0, 70)}`));
