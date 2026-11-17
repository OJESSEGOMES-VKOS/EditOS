// O começo vazio do vídeo novo (tools/novo-video.py põe este texto no lugar do bloco "O PLANO" de src/tema.ts).
// O vídeo nasce como a PESSOA: a gravação crua, fundo real, legenda em y 1180. Nenhuma tela do aprovado vem junto (nem os
// prints do EditOS, nem o contador "3 vezes", nem o pedido "EDIÇÃO"). Cada tela entra porque a fala NOVA pediu, com a
// linha no plano.md (a tela, a palavra dita entre aspas e o porquê; tools/clone.py cobra). Skill: .claude/skills/prova-print/SKILL.md.
//
// Prender à fala: w('palavra', n) = início da n-ésima vez que ela é dita; iw('palavra', n) = o índice dela; corte(t) = 2
// quadros antes (o corte seco entra antes da palavra que abre a cena). Palavra que a fala não tem: o molde para e diz qual.
//
// UMA LINHA POR CENA em base(): [modo, início, tela?]. A 1ª começa em 0.
//   [PESSOA, t]              o vídeo normal (o padrão, G6): a maior parte do vídeo, gancho sempre (G29)
//   [ROSTO, t]               rosto fechado da emoção (dor, benefício, virada), 1 a 2 s; até 3 cenas de rosto e 20% do vídeo
//   [ROSTO, t, FECHO]        o fecho, só se a fala pede um comentário: rosto fechado + comando() abaixo
//   [VITRINE, t, 'Nome']     a PROVA: o print real que prova o que a frase afirma, com o grifo na palavra dita e o contador
//                            no número dito. 'Nome' é a tela livre em src/telas/Nome.tsx (a invenção; registre em
//                            src/telas/index.ts). Sem print real (public/ + public/ORIGEM.md), a vitrine não existe (G7, G25)
//   [CAPITULO, t, 'Nome']    a fala enumera ("ferramenta número um"): tela livre com o <Capitulo> do kit (rótulo e número ditos)
//   [PALCO, t, 'Nome']       só com a prop fundo: 'recorte' (pedido do dono, G6): o card da prova em cima e a cabeça saindo
//                            do cartão de câmera
//
// AS TELAS DA CASA (as do aprovado, presas aos prints do repositório do EditOS; modelos/prova-print/prova-print.md §10).
// Só ligam com a linha `<tela> = true` aqui dentro E o mesmo porquê na fala nova (a fala fala do próprio EditOS):
//   gancho    palco com o README ("Você grava. O assistente edita.") e o título-promessa
//   criado    vitrine com o About ("Estúdio 2D por Jessé Gomes"): quem criou
//   modelos   palco com a pasta sistema/modelos: a lista dos modelos
//   editar    vitrine com o About ("Modelos de edição de vídeo para o Claude Code"): editar vídeo com o Claude
//   vendo     vitrine com a pasta dos modelos: "um desses modelos"
//   previas   palco com as prévias do próprio criador (prop previas)
//   tres      vitrine com o README ou as prévias e o contador do número dito
//   outros    palco com a pasta dos modelos: "outros modelos"
//   aprender  vitrine com "Como funciona, em 4 passos"
//
// titulo()     o título-promessa do palco do gancho (só com fundo: 'recorte'); padrão null: o gancho vai na legenda
// contadores() [tela da cena, palavras do número como foram ditas, início, valor, sufixo, y]: o número DITO (G10)
// comando()    o pedido do fecho: {palavras: ['comenta', 'X'], chamada: 'comenta', pedido: '“X”'}, as duas ditas
// chave()      as palavras-chave da legenda (serifa itálica azul): o termo protagonista, poucas
const base = (): Linha[] => [
	[PESSOA, 0], // o vídeo todo na pessoa até a fala pedir a prova
];
const titulo = (): Titulo | null => null;
const contadores = (): ContadorPlano[] => [];
const comando = (): Comando | null => null;
const chave = (): number[] => [];
