---
name: comecar
description: >
  A entrada do EditOS. Na primeira vez, conhece a pessoa com três perguntas simples (o nome, o @ e se ela tem logo,
  cores ou prints pra usar) e monta a pasta dela: <Nome>/conteudo/ (onde os vídeos prontos chegam) e
  <Nome>/materiais/. Nas outras vezes, só confere qual perfil está em uso e segue. Use quando a pessoa disser
  /comecar, "começar", "primeira vez", "configurar o EditOS", "como eu começo", ou quando o EditOS abrir e ainda não
  houver nenhuma pasta de perfil.
---

# /comecar: a entrada do EditOS

Quem está do outro lado pode estar usando isto pela primeira vez. Fale simples, uma pergunta por vez, e espere a
resposta antes da próxima. Nada de termo técnico (pasta pode; "diretório", "script", "comando" não).

Os comandos abaixo rodam da pasta do EditOS (a que tem o `CLAUDE.md`). No Mac/Linux, troque
`sistema/.venv/Scripts/python.exe` por `sistema/.venv/bin/python`.

## 1. Já existe perfil?
Rode `sistema/.venv/Scripts/python.exe sistema/tools/perfil.py`.
- **Já tem perfil ativo:** diga em uma linha ("Tudo pronto, estou usando o perfil do Fulano.") e siga o pedido da
  pessoa. Não refaça a entrevista.
- **Mais de um perfil e nenhum escolhido:** pergunte qual usar, citando os nomes, e rode
  `sistema/.venv/Scripts/python.exe sistema/tools/perfil.py usar "<Nome>"`.
- **Nenhum perfil:** siga a entrevista.

## 2. A entrevista (três perguntas, uma por vez)
Abra com uma frase só: "Antes do primeiro vídeo, vou criar o seu espaço aqui dentro. São três perguntas rápidas."

1. **O nome.** "Como você quer que eu te chame? Esse nome vira o nome da sua pasta." Use o nome como a pessoa
   escreveu (com acento, se tiver).
2. **O @.** "Você tem um @ (Instagram, YouTube, TikTok)? Se não tiver, é só dizer que não." É opcional: nunca
   invente um @.
   Com as duas respostas, crie o perfil:
   `sistema/.venv/Scripts/python.exe sistema/tools/perfil.py criar "<Nome>" --arroba "<@ ou vazio>"`
3. **Os materiais.** "Você tem logo, cores da sua marca ou prints de resultado (seguidores, vendas, comentários) que
   quer que eu use nos vídeos? Se tiver, coloque na pasta `<Nome>/materiais/`, que acabei de criar. Se não tiver
   agora, tudo bem, dá pra colocar depois."
   - Se a pessoa disser as cores em texto (ex.: "preto e amarelo", "#111111"), anote na linha `Cores:` do
     `<Nome>/perfil.md`, com as palavras dela. Não escolha cor por ela.
   - Se ela colocar arquivos, olhe a pasta e confirme em uma linha o que chegou ("Recebi o logo e 3 prints.").

## 3. Fechar
Diga, em poucas linhas:
- onde fica a pasta dela (`<Nome>/`);
- que cada vídeo pronto chega sozinho em `<Nome>/conteudo/<nome-do-video>-DD-MM-AA/`, como `v1.mp4`, `v2.mp4`...
  (cada ajuste vira uma versão nova, nenhuma se perde);
- que a gravação nova pode ir para `<Nome>/materiais/` também: quando o vídeo começa, ela vai pra oficina junto com
  o resto do trabalho;
- o próximo passo: "Me manda a sua gravação e diga o que quer, ou me conte a ideia do vídeo que eu te ajudo a
  montar do zero."

## Regras
- Uma pergunta por vez. Nunca despeje as três de uma vez.
- Nunca invente nome, @, cor ou logo.
- A pessoa não precisa mexer em `sistema/`: ali fica o motor.
- Outra pessoa vai usar o mesmo EditOS? Isso é a skill `novoperfil`.
