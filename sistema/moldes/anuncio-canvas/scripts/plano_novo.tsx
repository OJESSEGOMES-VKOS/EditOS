// O começo vazio do anúncio novo (tools/novo-video.py põe este texto no lugar do bloco "O PLANO" de src/Canvas.tsx).
// O vídeo nasce sem nenhuma peça do aprovado: só o fundo e a câmera passeando sobre a fala nova, uma frase por ponto
// final. Cada peça entra porque a fala NOVA pediu, com a linha "por quê" no plano.md (a peça, a palavra dita entre aspas
// e o porquê; tools/clone.py cobra). A skill .claude/skills/anuncio-canvas/SKILL.md diz como escolher e inventar.
//
// 1. FALA: o texto dito (já vem da transcrição). FRASES: troque o porPonto por uma lista [1ª palavra, última, tom],
//    índices de src/palavras.json, tom TOM.marca | TOM.dor | TOM.noite | TOM.claro (a cor do clima da frase). Frase de
//    menos de 1,5 s se junta à vizinha; frase longa em fala corrida se divide (cada metade com 1,5 s ou mais).
// 2. VIRADA: o índice da frase em que o produto aparece (entra por chicote), nem a primeira nem a última; null sem virada.
// 3. A Coreografia: um <El k={frase} x={..} y={..} z={..} rot={..}> por peça, até 4 ou 5 por frase, x de -300 a 320 e
//    y de -520 a 460 em volta do keyframe da frase. Cada linha escrita: <L de={segundos} txt="palavras como foram ditas"
//    tam={52..130} cor={B | T | FINO | SUB | FINOC | SUBC | C.v} peso={400 | 600 | 800} />. Tempos: w('palavra', n).
//    O fecho (a última frase) leva `fica` e o nome de quem anuncia (o logo real em public/ ou <Wordmark texto="nome" />).
//
// AS PEÇAS DA CASA (primitivas, servem a qualquer tema): Pilula (só o termo protagonista), Glitch (a palavra de dor, caixa
//   alta, só no tom dor), Risco (o que deu errado é riscado), MarcaTexto (o que dá certo, por baixo da palavra), Bolha e
//   Notif (só conversa ou aviso REAL de quem anuncia), IconeVidro com um G.* (o ícone de vidro da virada), Fone (o
//   celular com o print real; sem print, a tela genérica), Neon (um por público ou categoria dita), Pop (entra com mola).
// AS TELAS DO APROVADO (exemplos, src/Canvas.tsx CASA; só com o mesmo porquê na fala nova, e as de texto fixo só com
//   esse texto dito): Hora2347 (a hora da noite), Data15 (o cliente que não aparece), Relogio (hora parada), Campo (o
//   link que se digita), SinalPago, PainelImg (o painel real), Doze (número que conta), Botao (a oferta que destrava),
//   Marca (a marca do aprovado: nunca num anúncio de outra marca). Entram por <Tela comp="Nome" />.
// A TELA NOVA (o normal num anúncio novo): o objeto que a frase nomeia fazendo o verbo dela, no instante da palavra.
//   Desenhe em src/telas/<Nome>.tsx com o kit (src/kit.tsx: Palco, Cartao, IconeVidro, Pilula, Risco, MarcaTexto, a
//   paleta C), registre em src/telas/index.ts e ponha no plano: <El k={2} x={0} y={-150}><Tela comp="Nome" /></El>.
// Texto na tela só o que é dito (G19), número como foi dito (G10), nada de marca, preço, print ou nome inventado (G25).
// Rode node scripts/conferir.mjs até "0 erros" e ../../.venv/Scripts/python.exe ../../tools/clone.py <esta pasta>.
const FALA = FALA_DITA;
export const FRASES: [number, number, Tom][] = porPonto(TOM.marca);
export const VIRADA: number | null = null;
const Coreografia: React.FC = () => <></>;
