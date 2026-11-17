// O começo vazio do vídeo novo (tools/novo-video.py põe este texto no lugar do bloco "O PLANO" de src/plano.ts).
// O vídeo nasce como a pessoa falando: a gravação com o fundo real, plano cheio, sem tela nenhuma do aprovado. Cada
// parte entra porque a fala NOVA pediu, com a linha "por quê" no plano.md (o nome da parte ou da tela, a palavra dita
// entre aspas e o porquê; tools/clone.py cobra). A skill .claude/skills/youtube-didatico/SKILL.md diz como escolher.
//
// Prender à fala: w(i, 'palavra') = início da palavra i de src/palavras.json (o script para se ela não for essa);
// em(t, i, 'palavra') = um tempo t ancorado na palavra i; fim(i, 'palavra') = o fim dela.
//
// A BASE (a maior parte do vídeo, G6): chaves da câmera [t, pose, transição (0 = corte seco), gira?]
//   POSE.cheio          o plano inteiro (o normal)
//   POSE.punch(z, fy)   zoom 1,12 a 1,2, só com motivo na fala: a frase-chave, a troca de ideia, esconder um corte
//   POSE.cartao         o rosto no cartão do canto, com o giro: [t, POSE.cartao, 0.38, true]; SÓ junto de uma tela de gelo
//                       (grade, conta, tela livre), do `de` ao `ate` dela
//   POSE.reel           o plano dentro da tela de reels (com REEL); POSE.baixo() a metade de baixo (com PREVIAS)
//
// AS PEÇAS DA CASA (cada uma desligada até o plano ligar; use só quando a fala nova tiver o porquê dela, seção 4 do
// youtube-didatico.md; no aprovado, a seção 12 diz o porquê de cada uma):
//   FRASES   frase de efeito grande na frente, sobre a camiseta (linha branca + palavra gigante amarela), junto do
//            punch-in. Só a frase de efeito do gancho ou da conclusão, cada palavra quando é dita:
//            FRASES = [{de: T.a, ate: T.b, top: 1215, linha1: [['palavra', T.x], ...], linha2: [['CHAVE', T.y]]}];
//   TITULOS  título de capítulo com o fio amarelo: a fala anuncia uma parte ("primeiro", "o segredo é"). Palavra dita,
//            nunca o nome do modelo: TITULOS = [{de, ate, top: 1150, linhas: ['palavra dita']}];
//   LISTA    a conta no gelo: a fala conta itens ("cada corte, cada legenda"), 1 a 5 palavras curtas como ditas, o rosto
//            no cartão: LISTA = {de, ate, itens: [['palavra', T.x], ...]};
//   GRADE/GRADES  a grade de vídeos reais: a fala aponta os vídeos prontos do próprio criador (só com os vídeos dele em
//            public/ex/<nome>.mp4); MONTAGEM: a fala lista exemplos curtos e há vídeos dele (public/ex/cheio_<nome>.mp4)
//   REEL     a tela de reels: a fala cita a página ou a rede ("se você está no Instagram agora"): REEL = {de, ate}
//   ESTE     contorno amarelo e rótulo no cartão: a fala aponta "este aqui" com a grade na tela
//   PREVIAS  prévias em cima: a fala diz "posso colocar duas prévias aqui" e há prévias do criador
//   CTA      o pedido: a fala pede comentário ("comenta X"): CTA = {de: T.comenta, top: 1268, antes: 'comenta',
//            chave: ['PALAVRA', T.palavra], depois: ['aqui embaixo', T.aqui]}  (o texto é o dito)
//   ATRAS    palavra atrás da pessoa: só com a prop fundo: 'recorte' e ordem do dono (G6)
//
// A TELA LIVRE (a tela de gelo que a fala pede e a casa não tem; o normal num tema novo): conceito novo (palavra e
// ícone), metáfora desenhada, processo com tracejado, comparação em dois lados, negação riscada em vermelho, número
// contando até o dito. O rosto vai para o cartão do canto no `de`:
//   LIVRES = [{comp: 'Nome', de: T.a, ate: T.b, em: {chave: T.x}, textos: {chave: 'texto dito'}, dados: {}}];
//   O desenho mora em src/telas/<Nome>.tsx, com o kit de src/ui.tsx, registrado em src/telas/index.ts.
//
// Somadas, as telas (grade, conta, livres, reels, montagem) ficam em até 1/3 do vídeo: a pessoa é a base. Texto na tela
// só o que é dito (G19), número como foi dito (G10), nunca o mesmo texto em dois lugares na mesma hora (G26).
// Depois: node scripts/checar.mjs até "sem problemas".
const T = {};

/* câmera: o vídeo nasce no plano cheio, a gravação original (G29) */
export const chaves = (_previas: boolean): Chave[] => [
	[0, POSE.cheio, 0],
];

/* as partes que este vídeo liga (nenhuma ainda: cada uma entra aqui embaixo, com a linha "por quê" no plano.md) */
void T;
