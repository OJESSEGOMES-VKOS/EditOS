# cena38: Glow World (Mundo que brilha)

- **Tipo:** 2D
- **A cena que ele resolve:** ideia abstrata e invisível virando um lugar bonito (estilo explicativo de canal grande).
- **Quando a fala pede:** conceito abstrato: "a IA", "o dinheiro", "o cérebro".
- **Completa estes modelos:** personagem, motion-ouro, vetor-minimo, documental-dados.
- **Material e prova:** o sistema faz tudo.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Uma ideia que ninguém vê vira um lugar que dá vontade de visitar: um mundinho ilustrado, plano e brilhante, flutuando
no espaço. A luz vem de dentro das coisas, e a cena termina com o mundo "ligado".

- **Paleta:** espaço violeta fundo (`#140C40` em cima a `#2A1E78`), chão de grade violeta `#3C30A0` com linhas mais
  escuras `#2A1D8D` e pontinhos. O objeto herói numa cor quente e forte (o magenta `#FF5FB2` / `#E2369A` / `#6F1A7E`
  é só o da demo); o "dentro" vai de laranja `#F36A23` a amarelo `#FACB22` a branco. Petróleo `#3BE3C6` só como
  acento pequeno (energia, pontinho). Sombra puxa para o violeta, nunca para o cinza.
- **Formas:** cor chapada, cantos arredondados, sem contorno. Cada objeto tem dois ou três tons, um risco de luz no
  lado aceso e uma chuvinha de pontinhos de textura. Nada de brilho de plástico nem textura realista.
- **Luz:** o brilho macio é a assinatura: halo em volta do objeto, luz quente derramando no chão, raios suaves atrás.
- **Profundidade:** camadas em distâncias diferentes: estrelas e rochas longe, a ilha, o objeto, pedras e plantas
  escuras bem perto da lente. A câmera empurra e o perto corre mais que o longe.
- **Letra:** uma pílula só, Nunito 800, branca sobre violeta escuro com um ponto amarelo. É o nome da ideia.

**Os movimentos (o vocabulário):**
- **O mundo já existe:** o primeiro quadro é o lugar inteiro, com a câmera já entrando. Nada se monta do zero.
- **O sinal que chega:** pulsos de energia correm por cabos ou caminhos até o objeto. Mostra que algo alimenta a ideia.
- **A abertura:** uma costura de luz corre, o objeto treme, amassa um pouco e se abre com mola (racha, desdobra,
  levanta a tampa). Mostrar o de dentro é o "agora você entende".
- **O acender:** o núcleo explode em luz com um quique, traços se desenham para fora, órbitas se riscam e pontinhos
  correm nelas e param.
- **O nome:** a pílula salta com um pequeno passo além, na palavra que nomeia a ideia.
- **O mundo liga:** o anel da base troca de frio para quente e a força sai pelos cabos. Último segundo parado.

## Como variar (o jeito, não a demo)

- **Este estilo pede desenho novo a cada assunto.** O componente é a implementação de referência (o cristal da IA):
  dele se reaproveitam o céu, a ilha de grade, o pedestal, os cabos, as camadas e as funções de tempo; o objeto
  central se desenha de novo, com as regras de forma acima.
- **O objeto é a metáfora da fala:** "o seu dinheiro rende" vira um cofre que abre e mostra engrenagens douradas; "o
  cérebro guarda memória" vira uma semente que se abre em galhos de luz; "a vacina ensina o corpo" vira uma célula
  que se abre e mostra o escudo. A palavra-chave dita decide o que é o objeto e o que tem dentro.
- **Batidas pela frase:** frase curta, uma abertura só e o nome. Frase com causa e efeito ("chega o sinal, acende,
  liga tudo"), as três etapas, cada uma numa palavra. Duas ideias numa frase pedem duas cenas, não dois objetos.
- **O lugar pode mudar:** ilha de grade, recife, cidade de blocos, campo; o céu e a regra de luz ficam.
- **Cores:** troque o tom do objeto (`corCristal`) e do dentro (`corInterior`) pelo assunto, mantendo um quente forte
  contra o violeta. `rotulo` vazio tira a pílula.
- **Formatos:** o palco 4:5 cobre a tela; em 9:16 as laterais cortam (mantenha objeto e pílula no meio), em 16:9 corta
  em cima e embaixo (abaixe a pílula para dentro da faixa segura).

## Nunca

- Contorno, gradiente com cara de render 3D, reflexo brilhante, textura realista.
- Lens flare, explosão de partícula, neon. O brilho é macio e sai do objeto.
- Mais de uma pílula de texto, ou planeta com continentes.
- Personagem, pássaro, logo ou cena de canal conhecido: o estilo é a linguagem, não a arte de alguém.
- Reaproveitar o cristal, o "núcleo da IA" ou qualquer texto da demo (`componente/textos-demo.json`) quando a fala é
  outra.
- Refazer a coreografia da demo batida a batida (racha, acende, órbitas, liga) se a fala pede só uma ou duas etapas.
