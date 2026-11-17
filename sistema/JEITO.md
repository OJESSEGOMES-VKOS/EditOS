# O jeito, não o clone: como cada modelo, estilo de cena e animação vira uma skill

Este é o método comum de todas as skills de criação do EditOS: os modelos de edição (`sistema/modelos/`), os estilos
de cena (`sistema/cenas/estilos/`) e os estilos de animação (`sistema/animacoes/`). Cada um tem uma skill em
`.claude/skills/<id>/SKILL.md` (na raiz do EditOS), e todas seguem este arquivo.

## 1. O problema que este método resolve

Quem comprava o EditOS e pedia "edita no modelo X" recebia o vídeo do dono com outra gravação dentro: as mesmas
telas, os mesmos textos, a mesma sequência. O mesmo acontecia com os estilos de cena (a demo inteira de novo, só com
outra frase) e com as animações. Três causas, todas consertadas aqui:

1. **O vídeo novo nascia com o plano do aprovado preenchido.** O assistente só trocava palavra por palavra. Agora o
   plano nasce vazio (só a gravação crua e a legenda) e cada tela entra porque a fala nova pediu.
2. **O repertório era só o que o aprovado tinha.** Se a fala nova falava de outra coisa, o único caminho era encaixar
   as telas do aprovado. Agora cada skill ensina a criar a tela que falta, no jeito da casa.
3. **Faltava a personalidade escrita.** Sem ela, o único jeito de "parecer o modelo" era copiar o vídeo. Agora cada
   skill diz o que faz um vídeo ser daquele modelo, com o porquê, e o que é só daquele vídeo de exemplo.

## 2. As três camadas de toda skill

| Camada | O que é | Exemplo (rosto-telas) |
|---|---|---|
| **A personalidade** | O que faz o vídeo ser reconhecível como daquele modelo, escrito como regra com porquê e com "quando sim / quando não". Cor, letra, ritmo, onde a legenda mora, como a tela entra e sai, como a câmera se comporta, o tom. Vale para qualquer fala. | Rosto cheio como base; painel marfim que entra já preenchido e sai no corte; legenda sem tarja com a palavra dita em menta; um objeto por tela que faz o que a frase diz. |
| **As peças** | O que já existe em código e serve a qualquer tema: fundo, legenda, transição, primitivas de tela, enquadramento. | Legenda, Rosto, painel dividido com a pílula, cartão de papel, marca-texto, chip, check, fecho de comentário. |
| **A invenção** | Como criar a tela, o objeto ou a cena que a fala nova pede e que o exemplo não tem, com as peças e na personalidade. | A fala diz "minha conta de luz caiu pela metade": uma conta em papel marfim, a barra do valor que encolhe até a metade, marca-texto menta no número. Nenhuma dessas telas existe no aprovado, e o vídeo é rosto-telas do mesmo jeito. |

O vídeo de exemplo (a `referencia/` do modelo, a `demo.mp4` do estilo, o exemplo do estilo de animação) é **uma
aplicação** da personalidade a uma fala. Ele mostra o jeito na prática. Ele nunca é o roteiro, a sequência ou o
catálogo de telas do vídeo novo.

## 3. O que é personalidade e o que é só do exemplo

Na hora de ler o exemplo, separe:

| É personalidade (herda sempre) | É só do exemplo (nunca herda sozinho) |
|---|---|
| paleta, fontes, pesos, tamanhos mínimos | os textos escritos na tela |
| onde e como a legenda mora | os objetos que aparecem (o editor do Claude, o celular, os cartões com nomes) |
| como a tela entra, fica e sai | a ordem das telas e o tempo de cada uma |
| o ritmo (cortes por minuto, quanto tempo de rosto) | a quantidade de telas |
| o vocabulário de movimento (cai com mola, risca, varre, fatia) | qual movimento caiu em qual palavra |
| o tom (sério, leve, solene) e a regra do fecho | o tema, a marca e o produto falados |

Um objeto do exemplo só volta num vídeo novo quando a fala nova diz a mesma coisa que fez ele existir lá (o celular
do Reel volta se a pessoa fala "se você está no Instagram agora"; não volta porque "o modelo tem celular").

## 4. O caminho de um vídeo em qualquer skill

1. **Ler a skill inteira e o arquivo que manda** (`<modelo>.md`, a ficha do estilo). A personalidade primeiro.
2. **Ler a fala nova** (a transcrição, o roteiro) antes de olhar o exemplo de novo.
3. **Plano de cenas a partir da fala.** Para cada trecho, decidir: rosto puro (o normal nos modelos com pessoa), uma
   peça da casa, uma tela nova inventada na personalidade, ou um estilo de cena. Cada tela leva uma linha "por quê"
   com a palavra da fala que pediu ela.
4. **Inventar o que falta**, com as peças e a personalidade da skill (camada 3). Tela nova mora na pasta do vídeo,
   nunca no molde.
5. **O teste do clone** (seção 5), antes do render.
6. **A prova de sempre** (checador do molde, `tools/decupar.py --conferir`, folha de quadros, -14 LUFS) e a entrega
   pelo `tools/entregar.py`, que leva o vídeo para `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` e atualiza o EditOS
   Online.

## 5. O teste do clone (obrigatório antes do render)

1. **Rode `tools/clone.py oficina/<pasta>`** (de dentro de `sistema/`). Ele acusa texto na tela que veio do exemplo e
   não está na fala nova, e plano que repete o do exemplo. Tem que sair `SEM CLONE`.
2. **Folha lado a lado com o exemplo.** Ponha a folha de quadros do vídeo novo ao lado da do exemplo e responda:
   - *É o mesmo modelo?* (cor, letra, legenda, ritmo, jeito de entrar e sair). Tem que ser **sim**.
   - *É o mesmo vídeo?* (mesmos objetos, mesmos textos, mesma ordem). Tem que ser **não**.
   Se alguém que viu o exemplo olhar o vídeo novo e disser "é aquele vídeo com outra pessoa", o vídeo volta.
3. **Toda tela tem dono na fala.** Tela sem a linha "por quê" ligada a uma palavra dita sai, ou vira rosto puro.

## 6. Como transformar mais um modelo, estilo ou animação em skill

1. **Leia o exemplo** com olho de diretor e escreva a personalidade (seção 3): cada regra com o porquê e com quando
   usar e quando não usar. Meça o que dá para medir (cor, tamanho, tempo); o resto, descreva.
2. **Separe as peças do que é do exemplo.** No código, peça é o que serve a qualquer tema. Tela que só existe por causa
   do assunto do exemplo continua no molde como exemplo, mas a skill diz que ela é exemplo.
3. **Garanta o começo vazio.** O vídeo novo nasce sem o plano do exemplo (`scripts/plano_novo.<ext>` no molde, aplicado
   pelo `tools/novo-video.py` entre as linhas `O PLANO` e `fim do plano` do script do plano) e o molde aceita tela nova
   escrita na pasta do vídeo (`src/telas/`, com um kit de peças da casa e um palco na zona segura). O
   `scripts/clone.json` do molde diz ao `tools/clone.py` quais são as telas da casa e o texto fixo de cada uma.
   Antes de escolher uma tela cheia com título, conte as páginas: fala rápida não cabe em título (piloto do rosto-telas).
4. **Escreva a skill** no formato de `.claude/skills/rosto-telas/SKILL.md` (a primeira, que serve de régua):
   quando usar, a personalidade, as peças, a invenção com dois exemplos de fala que o exemplo não tem, o teste do
   clone, o caminho e o "nunca".
5. **Prove com uma fala diferente da do exemplo** (a gravação de `teste-comum/` ou outra) e olhe a folha lado a lado.
6. **Mudou o local? Regere o aberto** (`tools/gerar-aberto.py`). O aberto nunca é editado à mão.

## 7. O que não muda

A organização das pastas (`<perfil>/materiais`, `<perfil>/conteudo`, `sistema/oficina`, `sistema/modelos`,
`sistema/moldes`, `sistema/cenas`), a ficha do vídeo e o EditOS Online seguem iguais. As regras G de `REGRAS.md` §0
continuam mandando acima de qualquer skill. As skills mudam a eficácia, não o lugar das coisas.
