# cena39: Flat Cartoon (Desenho plano)

- **Tipo:** 2D
- **A cena que ele resolve:** história de personagem: o que aconteceu, encenado.
- **Quando a fala pede:** "ele abriu a empresa", "um cara que", história de alguém.
- **Completa estes modelos:** personagem, pagina-de-livro, minidocumentario.
- **Material e prova:** pessoa real nunca desenhada como se fosse ela sem dizer; personagem genérico.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Um desenho animado plano, de lado, com um personagem de cabeça grande vivendo o que a fala conta. O fato vira uma
cena com gente dentro, não um slide. É exagerado no gesto e quieto no traço.

- **Paleta:** parede azul-acinzentada clara `#E3EDF6` com uma faixa mais escura embaixo, chão ciano vivo `#30ABD5`
  com listras compridas mais claras. Roupa num tom firme com um lado em sombra chapada (o terno índigo `#4D4A91` /
  `#352A6E` e a gravata magenta `#DF1690` são só da demo). Pele pêssego `#F7B797` com uma faixa mais escura atrás do
  rosto `#E59676`. Vermelho `#F0384F` guardado para o desastre: é a única cor de alarme.
- **O personagem:** cabeça grande, olhos ovais pequenos e escuros, sobrancelha curta, nariz de um risco, boca simples,
  mão de luva com dedos curtos. Roupa chapada com um lado sombreado. Sem contorno no corpo. Genérico, nunca alguém real.
- **Detalhe:** linha fina escura só onde ajuda (a rachadura, a borda da lapela, a orelha, os rabiscos dos papéis).
- **Letra:** Montserrat 800 azul-marinho `#2B2452`: um rótulo pequeno dentro do cenário e um cartão branco de borda
  redonda com sombra azul dura. Um cartão, palavra curta e enorme.
- **Sombra:** dura, chapada, deslocada para um lado. Nunca borrada, nunca degradê.

**Os movimentos (o vocabulário):**
- **Já em ação:** o primeiro quadro pega o personagem no meio do gesto (falando, apontando, trabalhando).
- **A coisa que cresce:** algo sobe ou se monta passo a passo (pontos do gráfico, pilha, fila). É o "estava indo bem".
- **A quebra:** o objeto racha, solta de um pino e balança; o sinal despenca num zigue-zague vermelho grosso.
- **A reação:** olhos viram bolas brancas, boca cai aberta, braços sobem com os dedos abertos, gota de suor. O rosto
  conta a emoção sem texto.
- **As coisas caem:** papéis e bilhetes voam e pousam chapados no chão, um depois do outro. Mostra o tamanho do estrago.
- **O cartão:** a palavra que fecha a ideia salta com um pequeno passo além. Depois tudo para no último segundo.

## Como variar (o jeito, não a demo)

- **Este estilo pede cena desenhada a cada história.** O componente é a referência (o apresentador e o gráfico que
  cai): dele se reaproveitam o chão, a parede, a janela, o corpo do personagem com as poses (apontando, pânico), as
  mãos, os papéis que caem, o cartão e as funções de tempo. O lugar, o objeto e a ação saem da fala.
- **A ação é o verbo dito:** "abri a loja e ninguém entrou" vira o personagem atrás do balcão, o relógio girando e a
  porta parada; "a conta chegou" vira o envelope que abre e o queixo que cai; "deu certo" troca o pânico por braços
  para cima com alegria (a mesma pose, outro rosto). O vermelho só entra se a fala tem desastre.
- **Batidas pela frase:** frase curta, uma ação e o cartão. Frase com virada ("ia bem, até que..."), sobe, quebra,
  reação. Não ponha papel voando nem suor se a fala não pede susto.
- **Personagem:** troque roupa, cabelo e tom de pele pelo que a história diz (`corTerno`, `corGravata` e o desenho
  do cabelo); a construção (cabeça grande, luva, sombra chapada) fica.
- **Cartão:** a palavra dita que fecha a ideia (`legenda`), curta; o cartão cresce com ela. Sem palavra forte, sem cartão.
- **Formatos:** o palco 4:5 cobre a tela; em 9:16 corta as laterais (personagem e objeto perto do meio), em 16:9 corta
  em cima e embaixo (cartão desce para a faixa segura, ação ganha largura).

## Nunca

- Degradê, brilho, desfoque ou sombreado com cara de 3D. Toda cor é chapada.
- Contorno preto grosso em tudo.
- Mais de um cartão, ou frase longa no cartão.
- Personagem conhecido, mascote, pessoa real, logo de canal.
- Reaproveitar o apresentador, o gráfico de vendas ou qualquer texto da demo (`componente/textos-demo.json`) quando a
  história é outra.
- Refazer a coreografia da demo batida a batida (sobe, racha, pânico, papéis, cartão) se a fala conta outra coisa.
