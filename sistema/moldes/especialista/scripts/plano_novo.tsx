// O começo vazio do vídeo novo (tools/novo-video.py põe este texto no lugar do bloco O PLANO de src/Reel.tsx).
// O vídeo nasce só na BASE: a gravação crua com o fundo real (G6) e a legenda pequena de Playfair no peito, automática
// (trecho na pontuação, subtrecho na vírgula, até 2 linhas). Nenhum modo da vitrine vem junto. Cada modo entra porque a
// fala NOVA tem a função dele (especialista.md §1), com a linha por quê no plano.md: o nome da peça (GIGANTES,
// CITACOES, REENQUADRES), a palavra dita entre aspas e o porquê (tools/clone.py cobra). A skill
// .claude/skills/especialista/SKILL.md diz como escolher. Na dúvida, fica na base: o encanto do modelo é a contenção.
//
// Prender à fala: cada índice é a posição da palavra em src/palavras.json, com o texto ao lado; o molde para ao carregar
// e diz o que não bate. A barra quebra a linha.
//
// AS PEÇAS (ligue só a que a fala nova pede; sem a linha, a peça fica desligada):
//   GIGANTES     peso real: paradoxo do gancho, virada, ordem, tese, aforismo do fim. Um grupo de 1 a 3 palavras por vez,
//                um tamanho só no vídeo, o gigante começa no protagonista (a palavra fraca fica na base):
//                  GIGANTES = [gigante(i, [grupo, grupo]), ...];
//                com LINHA DE CIMA quando a palavra de peso fecha uma fala curta (uma fala = uma tela; a linha de cima
//                cabe em 1 linha de 66 px, uns 26 caracteres) e TRAÇO vermelho só na palavra-alvo do tema:
//                  gigante(i, [palavra], {cima: começo da mesma fala, traco: true})
//   CITACOES     só quando a fala põe uma frase literal na boca de alguém (o comum diz X). Sem fala citada, não existe:
//                  CITACOES = [citacao([i, texto / 2a linha], ...)];   (sem aspas: o molde abre e fecha)
//   TRANSICOES   a fusão de 0,3 s, só entre trechos diferentes (a fala anterior fecha em ponto e começa outra ideia):
//                  TRANSICOES = [[i, palavra que abre o trecho novo], ...];
//   REENQUADRES  troca de plano na base: desligada, só com ordem do dono (G6).
//   PEDACOS      a legenda da base escrita à mão, só se a automática quebrar mal: PEDACOS = [[i, texto / 2a linha], ...];
//   Y_TEXTO, Y_PAR  já vêm medidos desta gravação (logo abaixo do queixo); só mude olhando o quadro.
// Fora do bloco, a cor da cena (C) se mede com scripts/cor_da_cena.py.
//
// Texto na tela só o que é dito (G19), número como foi dito (G10), cada palavra uma vez só (G26). O modelo não tem tela
// cheia, tela dividida, B-roll nem ícone: a tipografia é o único grafismo (por isso não há tela livre neste modelo).
