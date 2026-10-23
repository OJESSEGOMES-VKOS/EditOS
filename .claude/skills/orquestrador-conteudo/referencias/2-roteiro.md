# 2 · Roteiro em fala e tela

O roteiro é a partitura do vídeo: a fala de um lado, a tela do outro, uma linha por **frase com uma função só**. É
dele que nascem o tempo, a legenda, a escolha de tela e o som. Gosto se discute aqui, não depois do render.

## 1. A UMA coisa manda
Antes da primeira frase: o que a pessoa tem que sair sabendo, sentindo ou fazendo, em até 12 palavras. Toda frase
que não serve a ela é candidata a corte. Roteiro com três "conclusões" é três vídeos fracos num só.

## 2. As seis funções
Toda frase cai numa destas. Frase com duas funções vira duas linhas.

| Função | O que faz | A pergunta que responde |
|---|---|---|
| **F1 Gancho** | Cria tensão ou promessa que só o vídeo resolve. Sabor *tensão* (pede rosto e corte forte) ou *promessa* (pede mostrar o resultado) | "Por que eu fico?" |
| **F2 Problema** | Nomeia a dor ou o erro | "Isso é comigo?" |
| **F3 Prova** | Mostra que é verdade: número, documento, demonstração, comparação | "Por que eu acredito?" |
| **F4 Passo** | Ensina uma ação ou explica uma parte | "Como?" |
| **F5 Virada** | Muda o jeito de ver ("não é X, é Y") | "Ah, então é isso." |
| **F6 Fechamento/CTA** | Conclui e diz o que fazer agora | "E agora?" |

Re-gancho no meio do vídeo é uma F1 marcada `regancho`.

## 3. A função decide a tela
| Função | Pede | Evita |
|---|---|---|
| F1 tensão | rosto fechado, palavra grande, manchete | lista, gráfico, mapa (pedem leitura antes da pergunta existir) |
| F1 promessa | o resultado pronto primeiro, depois volta | capítulo, lista |
| F2 problema | rosto (empatia) ou o documento real da dor | número gigante sem fonte |
| F3 número | o número sozinho, grande, com a conta acontecendo enquanto é dita | imagem genérica competindo |
| F3 documento | o print real com o trecho marcado e a fonte pequena | título no lugar do documento |
| F3 demonstração | a tela do produto agindo, zoom que segue a ação | texto dizendo o que devia mostrar |
| F3 comparação | antes e depois com os mesmos elementos | listas soltas |
| F4 passo | organização visível (lista que se monta, tela real, quadro que se desenha) | manchete, tela preta |
| F5 virada | respiro e um foco: uma palavra, o rosto, silêncio curto antes | qualquer coisa que precise ser lida em detalhe |
| F6 | rosto olhando pra lente ou a marca, CTA **dito e escrito** | tela cheia de informação |

O `<modelo>.md` de cada modelo tem a gramática própria dele ("o que a tela faz em cada frase"). Ela vence esta tabela.

## 4. O formato do roteiro
Copie `modelos/roteiro.md`. Uma linha por frase funcional:

| # | Fala | F | Tela | Texto na tela | Som |
|---|---|---|---|---|---|

- **Fala** exatamente como vai ser dita, na fala do criador (ver PERFIL): corrida, natural, sem frase picada.
- **Tela** em uma ação concreta ("o print do comentário entra grande e devagar"), nunca "algo visual".
- **Texto na tela** é curto e não repete a fala inteira: no máximo uma ideia de apoio além da legenda.
- **Som** só onde há motivo (contato, mudança de bloco, silêncio antes da virada).
- No topo: a UMA coisa, formato, duração-alvo, CTA e as **suposições** (o que você assumiu sem confirmar).

## 5. O gancho
- **Ponto principal + emoção.** O fato concreto na frente e uma pergunta ou tensão que puxe pra pessoa ("você",
  "hoje"). Nunca entregar a conclusão de graça; nunca slogan de formato ("vem comigo", "você sabia que").
- **Escrito grande na tela desde o quadro 0.** Metade das pessoas está sem som; o gancho tem que funcionar mudo e com
  som. Nada de tela vazia ou texto pequeno crescendo nos primeiros segundos.
- **Os 3 primeiros segundos não podem servir pra outro vídeo.** Se servem, são genéricos.
- Entregue **gancho A e gancho B**, com o motivo de cada um.

## 6. Tempo e densidade
- **Tempo de leitura:** todo texto fica na tela pelo menos **1 s + 1 s a cada 3 palavras**. Título nunca atravessa
  corte.
- Palavras por segundo da fala: meça com a voz real do criador (a primeira gravação dá o número); não use tabela de
  outro idioma.
- **Uma ideia por tela, um foco de movimento por vez**, no máximo 3 elementos novos por tela contando a legenda.
- **Ritmo é parâmetro, não "quanto mais rápido melhor".** Vídeo curto que performa fica entre 1 corte a cada 2 e a
  cada 5 s; ritmo alto demais derruba a retenção. Acelere no gancho e em listas que a pessoa já entende; segure no
  passo novo, no número que precisa ser lido e depois da virada.
- Depois de um trecho rápido de mais de 6 s, segure pelo menos 3 s. O contraste é o que faz o rápido parecer rápido.
- Fechar amarrando com a abertura (a última frase completa a primeira) faz o vídeo recomeçar sem a pessoa perceber.
- Pense no vídeo pra ser **enviado**: utilidade concreta que alguém manda pra outra pessoa.

## 7. Material e voz (do roteiro pro PEDIDO)
Antes de gravar, cada linha do roteiro responde: **o que precisa existir pra essa tela acontecer?** Gravação de tela,
print, foto, objeto, depoimento real. Vire isso no `PEDIDO.md`:

| # | Frase | Precisa de | Quem consegue | Plano B |
|---|---|---|---|---|

O estúdio busca, recorta e gera o que dá (`kit/`: foto licenciada, recorte, imagem gerada). Só pede ao criador o que
só ele tem. Plano B nunca fabrica prova: sem o print real, a frase muda ou sai.

**Voz:** gravada pelo criador ou gerada (`kit/voz.py`). Com a voz pronta, transcreva e compare com o roteiro
aprovado, frase a frase. Palavra trocada, faltando ou pronúncia ruim: regrava a linha antes de montar qualquer cena.

## 8. Antes de mandar pra aprovação
- [ ] A UMA coisa cabe em 12 palavras e todo o resto serve a ela.
- [ ] Gancho escrito na tela desde o quadro 0, A e B.
- [ ] Toda prova é real e tem origem; nada de número, nome ou depoimento inventado.
- [ ] Tempo de leitura conferido nas linhas com texto.
- [ ] CTA dito e escrito, uma ação só.
- [ ] Passou no `/humanizer` (se existir no sistema): sem cara de texto de IA, na voz do criador.
