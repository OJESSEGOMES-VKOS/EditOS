# cena34: Text thread (Conversa em 3D)

- **Tipo:** 3D edição (feito no Remotion com perspectiva/CSS 3D ou three.js, sem Blender)
- **A cena que ele resolve:** história contada em mensagens.
- **Quando a fala pede:** "ele me mandou", "a conversa", "respondi".
- **Completa estes modelos:** personagem, pagina-de-livro, imagem-por-palavra.
- **Material e prova:** mensagens reais ou encenação assumida; dado pessoal nunca.
- **Referência visual:** `demo.mp4` (5 s, 4:5).
- **Componente:** `componente/` nasce no primeiro vídeo que usar o estilo e fica para os próximos (ver `../../METODO.md` §5).

Como ele entra num vídeo, o que manda sobre ele e o que nunca muda: `../../METODO.md`.

## A personalidade

Uma conversa de mensagens deitada num chão quadriculado claro, em 3D. Os balões saltam do chão um a um e ficam
flutuando com sombra macia, enquanto a câmera sobe e recua. A mensagem privada vira prova, sem celular nenhum.

- **O chão:** azul-acinzentado claro `#EDF1F7` com grade fina `#D2D9E5` e uma linha mais forte `#C3CCDB` a cada quatro,
  sumindo em quase branco `#F5F7FB` ao longe. Calmo de propósito: quem fala são as palavras.
- **Os balões:** os da outra pessoa à esquerda, brancos com um fio de borda e texto quase preto `#10141B`; os de quem
  conta à direita, num azul forte só (`#2B5FF7`) com texto branco. O mais antigo fica mais longe, o mais novo mais perto,
  como num chat. O "Lida" cinza `#8A93A3` sob a última resposta.
- **Letras:** Figtree. Mensagem em 500 e grande (68 num quadro de 1080). A mensagem-chave em 700 e uma vez e meia
  maior. Balão de duas a cinco palavras.
- **Profundidade:** câmera olhando o chão de cima, inclinada. Cada balão flutua um pouco acima do chão, com a sombra
  empurrada para baixo e para a direita pela altura. O balão mais distante fica levemente desfocado. Sem celular, sem
  barra de status, sem cara de aplicativo.

**Os movimentos (o vocabulário):**
- **Já começa perto:** o primeiro quadro é o primeiro balão, visto baixo e de lado, com a câmera andando.
- **O guindaste:** a câmera sobe, recua e gira um pouco numa curva longa só, até a conversa inteira caber; assenta
  perto do fim.
- **O salto do balão:** cada balão nasce do canto do rabinho com uns 10% de passo além e sobe do chão; a sombra se
  descola e amacia.
- **O "digitando" que cresce:** antes da mensagem-chave, um balão "..." salta com os pontinhos ondulando e depois
  cresce com mola até virar a frase grande, revelando as palavras enquanto alarga. É o golpe da cena.
- **O "Lida":** sobe embaixo da última resposta, e tudo para no último segundo.

## Como variar (o jeito, não a demo)

- **As mensagens são as que a fala conta,** com as palavras que a pessoa disse ou leu, de uma a cinco (`mensagens`).
  Uma história contada por uma pessoa só pode ter todos os balões do mesmo lado.
- **A chave é o momento da fala que pesa** (o número, a notícia, a resposta que mudou tudo): marque `chave: true` só
  nela, e só se existir. Sem chave, não tem "digitando".
- **Cada balão salta na palavra dele** (`tempos`, em quadros do `palavras.json`), não na cadência da demo.
- **Outro assunto, mesmo palco:** depoimento de cliente, conversa com fornecedor, pergunta de seguidor. O chão, a câmera
  que sobe e os balões ficam; a cor de "quem conta" pode virar o destaque da casa numa inserção pequena (`corMinha`).
- **Frase curta:** dois ou três balões, câmera mais curta. **Mais de cinco mensagens:** corte para as que a fala
  cita ou divida em duas cenas.
- **Formatos:** palco 4:5. Em 9:16 sobra chão em cima e embaixo (a conversa pode ficar maior); em 16:9 a conversa fica
  no centro e a névoa toma as laterais. A legenda da casa some se a fala é a própria mensagem (METODO §6).

## Nunca

- Moldura de celular, barra de status, nome, cor, ícone ou foto de aplicativo real.
- Mensagem longa (mais de cinco palavras) ou mais de cinco balões.
- Balão que esmaece ou desliza de lado: ele salta do canto.
- Grade escura, neon ou linha que brilha.
- Mensagem inventada: só o que a fala conta ou o print real mostra.
- Reaproveitar "viu os números??", "bateu 1 milhão" ou qualquer texto da demo (`componente/textos-demo.json`).
- Refazer a coreografia da demo batida a batida (cinco balões, chave no terceiro) quando a fala pede outra.
