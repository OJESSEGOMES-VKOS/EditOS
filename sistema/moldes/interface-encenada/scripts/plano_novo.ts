// O começo vazio do vídeo novo (tools/novo-video.py põe este texto no lugar do bloco "O PLANO" de src/tema.ts).
// O vídeo nasce como rosto cheio do começo ao fim: a gravação crua, o fundo real e a legenda no peito. Nenhuma tela do
// aprovado vem junto. Cada tela entra porque a fala NOVA pediu a interface, com a linha "por quê" no plano.md (o nome da
// tela, a palavra dita entre aspas e o porquê; tools/clone.py cobra). A skill .claude/skills/interface-encenada/SKILL.md
// diz como escolher. Comentário em linha própria (depois de um texto entre aspas, o clone.py lê o comentário como tela).
//
// Prender à fala: w('palavra', n) = início da n-ésima vez que ela é dita; corte(w('palavra')) = 2 quadros antes (o corte
// seco entre modos); iw('palavra', n) = o índice dela (para CHAVE, CAIXA_ALTA e SELECAO). Palavra que a fala não tem: o
// vídeo para ao carregar e o scripts/cobertura.mjs lista todas.
//
// O ROSTO (a base, G6; a maior parte do vídeo, o cobertura.mjs reprova abaixo de 50%):
//   rosto = [0, corte(w('...')), ...]   os inícios de cada trecho de rosto cheio (o primeiro é sempre 0: o gancho, G29)
//   perto = [corte(w('mas'))]           o punch-in de 1,2 na virada ("mas", "só que"), só com a virada na fala
//
// AS TELAS DA CASA (exemplos do aprovado; cada uma só entra quando a fala nova tem o mesmo porquê; a maioria escreve o
// texto daquele vídeo e pede as palavras dele, então num tema novo o normal é a tela livre):
//   comenta   a fala pede um comentário ("comenta X"): a folha de comentários sobe, a palavra é digitada e publicada.
//             comenta = {de: corte(w('comenta')), palavra: 'X' (a palavra dita, MAIÚSCULA), digita: w('x'),
//                        publica: w('próxima') + 0.06, coracao: w('...') + 0.15 (ou sem), dm: null (ou {chega: w(...),
//                        ponto: w('dm')} só se a fala promete mandar na DM), fixado: null (ou a frase dita)}
//   previas   a fala diz que vai mostrar prévias "aqui em cima" (dividido com dois vídeos da pessoa, prop previas)
//   gancho    a fala é sobre o próprio vídeo ("esse vídeo"): o Reel no celular com o selo "100%" (palavras do aprovado)
//   criado    a fala diz que o vídeo foi criado numa pasta: a janela do Claude Code criando os arquivos do aprovado
//   modelos   a fala lista os modelos da pessoa: as pastas com ✓ e a grade dos formatos (os nomes do aprovado)
//   instagram a fala diz "se você está no Instagram agora": o celular no Reels, toque e coração
//   nome      a fala aponta "um desses modelos": a vitrine com a caixa de seleção (o nome do modelo, nunca num vídeo novo)
//   outros    a fala convida a "ver outros modelos" e "usar": o catálogo e o prompt com o comando do aprovado
//   Cada uma liga numa linha `<id> = {de: corte(w('palavra que abre o trecho'))};` e só uma vez.
//
// A TELA LIVRE (a interface que a fala pede e a casa não tem; o normal num tema novo):
//   livres = [{comp: 'NomeDaTela', modo: 'palco' | 'dividido' | 'motion', de: corte(w('palavra')),
//              titulo: 'texto dito' (só no palco, 1 linha, até 14 letras), escuro: true (card escuro do app),
//              topo: true (motion com a legenda em cima), em: {chave: w('palavra')}, textos: {chave: 'texto dito'}, dados: {}}]
//   A tela vai até a cena seguinte começar: depois dela, um `rosto` (ou outra tela). De 2 a 5 s; o rosto é a base.
//   O desenho mora em src/telas/<NomeDaTela>.tsx, com o kit de src/ui.tsx, registrado em src/telas/index.ts.
//   Texto na tela só o que é dito (G19), número como foi dito (G10), nunca o texto que a legenda mostra na mesma hora (G26).
//
// A LEGENDA: CHAVE = [iw('termo')] (o termo protagonista em serifa itálica terracota: número, ferramenta, a palavra do
// pedido; poucos), CAIXA_ALTA = [iw('x')] e SELECAO = [iw('x')] (só a palavra que a pessoa vai comentar).
rosto = [0];
livres = [];
CHAVE = [];
CAIXA_ALTA = [];
SELECAO = [];
