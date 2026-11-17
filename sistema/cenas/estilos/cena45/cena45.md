# cena45: POV Doodle (Rabisco em primeira pessoa (POV))

- **Tipo:** 2D
- **A cena que ele resolve:** "sua vida como...", emoção exagerada em primeira pessoa.
- **Quando a fala pede:** "você quando", "POV", "sua vida como".
- **Completa estes modelos:** personagem, imagem-por-palavra, pagina-de-livro.
- **Material e prova:** o sistema faz tudo.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Um rabisco pintado em primeira pessoa: uma cabeça branca e redonda de frente para você, e as sobrancelhas fazem todo o
teatro. É o "sua vida como..." em que a situação vai piorando enquanto a pessoa tenta segurar a pose.

- **Traço:** um marcador marrom escuro `#33201C`, grosso e tremido, com a largura respirando ao longo do risco e bordas
  ásperas. Cerca de 13 px na cabeça e no corpo, 25 px nos braços de palito, 7 a 9 px nos objetos. Nunca fino, nunca preto.
- **Paleta:** apagada e chapada. Parede verde-acinzentada `#B2B392`, moletom teal `#5B8E86` com capuz `#4A776F`, mesa
  areia (`#CDBD95` em cima, `#B5A27A` na frente), cinza escuro `#4B4B4B` para eletrônico. Um só vermelho tijolo `#9A443C`
  para o que importa no fim (o número, a marca). Nada saturado, nada de fundo branco.
- **A pessoa:** cabeça grande, branca `#ECEBE7`, sem cabelo, olhos de ponto, sobrancelhas grossas que afinam na ponta,
  boca de uma linha. Quando dá errado: olhos viram argolas com pupila pequena, olheira, careta de dentes, gota azul de suor.
- **Textura:** grão de pincel seco sobre o quadro inteiro, em luz suave. Toda cor chapada parece pintada.
- **Letra:** uma frase manuscrita no topo em Mansalva, na mesma tinta marrom. Número de objeto na mesma mão.
- **Composição:** a pessoa de frente, no centro; um objeto que conta o tempo ou a quantidade de um lado; outro que
  acumula do outro; a mesa embaixo. Formas grandes, pouquíssimas palavras.

**Os movimentos (o vocabulário):**
- **A frase que se escreve:** o topo se escreve da esquerda para a direita no começo.
- **O acúmulo:** coisas chegam lançadas de fora e caem numa pilha com um amassadinho; a pilha balança a cada uma.
- **O contador que dispara:** folhas, notas, notificações saem uma a uma e depois numa corrida que acelera e freia.
- **A sobrancelha que muda:** de convencido para preocupado, devagar, enquanto o resto acontece.
- **O soco do número:** o valor final pousa com um soco e vira vermelho tijolo; os olhos arregalam, a boca vira careta.
- **O suor e o olhar:** duas gotas pulam, a pessoa para e olha para você.
- **A pausa:** o último segundo fica totalmente parado.

## Como variar (o jeito, não a demo)

- **A situação e os objetos são da fala.** "Sua vida de professor em semana de prova" pede uma pilha de provas e um
  relógio; "sua vida de mãe de três" pede brinquedos chegando e um contador de "mãe!". Copie o `Cena45.tsx` e troque o
  que acumula e o que conta, mantendo o traço, a paleta, a cabeça, as sobrancelhas e a textura. O calendário (`diaFinal`)
  e os copos (`copos`) só entram quando a fala fala de dias ou de café; os dois desligados é o normal.
- **As batidas seguem a frase.** Uma frase curta pede só a mudança de cara (convencido para careta) e a pausa. Uma frase
  com número dito usa o contador até aquele número (como foi dito, G10). Uma fala com três coisas dando errado pede três
  reações, não três copos.
- **Que movimento para que palavra:** número é o contador que dispara; "mais", "de novo", "todo dia" é o acúmulo;
  "e aí", "até que" é o soco do número e a careta; "você" é o olhar para a câmera.
- **A frase do topo** é a fala resumida ("Sua vida de..."). Sem ela, o topo fica vazio.
- **Formatos:** o palco 4:5 cobre a tela; em 9:16 corta as laterais, então aproxime o objeto que conta e o que acumula
  da pessoa; em 16:9 corta em cima e embaixo, então suba a frase e abra os objetos para os lados.

## Nunca

- Traço fino ou preto, vetor limpo, degradê, sombreado.
- Cor saturada ou fundo branco.
- Nariz, cabelo ou rosto detalhado na pessoa principal: as sobrancelhas atuam.
- Tremor ou movimento na pausa final.
- Copiar personagem, marca ou cena de canal existente.
- Reaproveitar o fundador, os copos, o calendário ou a frase da demo (`componente/textos-demo.json`) quando a fala não
  fala disso, ou repetir a coreografia da demo batida a batida.
