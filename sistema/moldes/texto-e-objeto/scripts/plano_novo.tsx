// O começo vazio do vídeo novo (tools/novo-video.py põe este texto no lugar do bloco "O PLANO" de src/Cenas.tsx).
// Nenhuma tela do aprovado vem junto. Cada tela entra porque a fala NOVA pediu, com a linha "por quê" no plano.md (o id
// da tela, o herói pelo nome, a palavra dita entre aspas e o porquê; tools/clone.py cobra). A skill
// .claude/skills/texto-e-objeto/SKILL.md diz como escolher; node scripts/cobertura.mjs reprova o plano vazio.
//
// UMA TELA: {id: 'curto', fundo: 'E' | 'L', topo, linhas: [{txt, tam, fonte?, acento?, efeito?}], heroi?, alinha?, iris?}
//   - as linhas são as palavras ditas, na ordem (o tempo vem da fala sozinho); '~palavra' é enfeite não dito.
//   - começa no escuro 'E' e o fundo alterna a cada tela; 1,5 a 2,5 s por tela, até 4 linhas, corte na pausa.
//   - tam: ligação 56 a 90 (Inter 700), palavra de peso 110 a 330 (Inter 900); só o assunto vira palavra grande.
//   - fonte: CURSIVA (Pinyon, palavra de efeito com rastro) ou SERIFA (Instrument itálica, palavra elegante).
//   - acento: true pinta a palavra de acento (laranja no escuro, creme no laranja).
//   - efeito: {'palavra': CORTA | SUBLINHA | MOLDURA | ANEL} (o verbo da palavra: cortar, sublinhar, enquadrar, destacar).
//   - alinha: ESQ para lista (o padrão é centrado); iris: true só na virada de assunto (2 ou 3 por vídeo).
//   - topo: com herói, em cima (220 a 300) e o herói embaixo; sem herói, no meio (700 a 800).
//
// O HERÓI (o objeto que faz o que a frase diz): heroi: <Heroi comp="Nome" />
//   A TELA LIVRE (o normal num tema novo): src/telas/<Nome>.tsx, com o kit de src/kit.tsx (cores(c.fundo), Palco, Faisca,
//   naTela, surge, cresce, mola, tw), registrada em src/telas/index.ts. Prenda cada movimento a uma palavra dita com
//   naTela(c, 'palavra'). Texto dentro do herói só o que é dito (G19).
//   OS HERÓIS DA CASA (exemplos do aprovado; só com o mesmo porquê na fala nova, texto-e-objeto.md §5):
//     Cem       a faísca cresce no nome dito "Claude"          (a fala nomeia o Claude)
//     Arquivo   o .mp4 viaja num feixe até a faísca           (a fala diz que gravou e mandou um arquivo)
//     Mira      cantos de gravação e REC                       (a fala diz "o que você está vendo aqui")
//     Converge  setas convergem na faísca em "decidiu"         (a fala diz que alguém decidiu)
//     Prompt    a caixa digita as palavras pedidas à IA        (a fala cita um pedido a uma IA; escreve "Claude")
//     Pastas    pilha numerada que sobe em "método"            (a fala apresenta um método)
//     Cento     a grade enche até o número dito                (a fala diz "analisando mais de 160 vídeos")
//     Frame     "frame" com quadros reais dentro das letras    (a fala diz "frame por frame")
//     Orbita    tópicos entram num arco                        (a fala lista os tópicos; os do aprovado são fixos)
//     Fichas    fichas ligadas a um centro                     (a fala cita regras; as do aprovado são fixas)
//     Guias     celular com guias de zona segura               (a fala diz que as regras estão aplicadas aqui)
//     Carimbo   carimbo "TESTE #01"                            (a fala diz "um teste")
//     Um        "01" gigante em contorno                       (a fala diz "primeiro")
//     Barra     barra que enche até 100%                       (a fala fala de desenvolvimento até o fim)
//     Dial      mostrador com ponteiro que oscila              (a fala diz "calibrando")
//     Assinatura  a foto num anel e o @ (props foto e arroba)  (a fala pede para seguir: "já me segue aqui")
//   Os que escrevem texto fixo (Prompt, Orbita, Fichas, Carimbo, Cento, Frame, Mira, Arquivo) só com essa fala.
export const CENAS: Cena[] = montar([]);
