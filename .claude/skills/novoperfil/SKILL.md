---
name: novoperfil
description: >
  Cria outro perfil no EditOS, com o nome que a pessoa quiser (ex.: "Ana2", "Loja da Ana"), na mesma estrutura do
  primeiro: <Nome>/conteudo/, <Nome>/materiais/ e <Nome>/perfil.md. Também troca o perfil em uso. Use quando a pessoa
  disser /novoperfil, "criar outro perfil", "novo perfil", "outra pessoa vai usar", "um perfil pra minha outra
  página", "trocar de perfil" ou "usar o perfil X".
---

# /novoperfil: outro perfil no mesmo EditOS

Cada perfil é uma pasta na raiz do EditOS, com os vídeos prontos (`conteudo/`) e os materiais (`materiais/`) daquela
pessoa ou página. O motor (`sistema/`) é um só para todos.

Os comandos abaixo rodam da pasta do EditOS (a que tem o `CLAUDE.md`). No Mac/Linux, troque
`sistema/.venv/Scripts/python.exe` por `sistema/.venv/bin/python`.

## Só trocar de perfil
Se a pessoa só quer usar outro perfil que já existe ("usa o perfil da Ana"), rode
`sistema/.venv/Scripts/python.exe sistema/tools/perfil.py usar "<Nome>"`, confirme em uma linha e pare aqui.
Não sabe os nomes? `sistema/.venv/Scripts/python.exe sistema/tools/perfil.py` lista todos.

## Criar um perfil novo (uma pergunta por vez)
1. **O nome.** "Qual o nome desse novo perfil? Ele vira o nome da pasta." Se já existir um perfil com esse nome,
   avise e peça outro.
2. **O @.** "Esse perfil tem um @? Se não tiver, é só dizer que não." Nunca invente.
   Crie: `sistema/.venv/Scripts/python.exe sistema/tools/perfil.py criar "<Nome>" --arroba "<@ ou vazio>"`
   (ele já passa a ser o perfil em uso).
3. **Os materiais.** "Tem logo, cores ou prints desse perfil pra eu usar? Coloque em `<Nome>/materiais/`, ou deixe
   pra depois." Cores ditas em texto vão na linha `Cores:` do `<Nome>/perfil.md`, com as palavras da pessoa.
4. **Qual usar agora.** "A partir de agora estou usando o perfil <Nome>. Quer continuar nele ou voltar pro
   <anterior>?" Se quiser voltar: `sistema/.venv/Scripts/python.exe sistema/tools/perfil.py usar "<anterior>"`.

## Fechar
Diga onde ficou a pasta, que os vídeos desse perfil chegam em `<Nome>/conteudo/<nome-do-video>-DD-MM-AA/vN.mp4`, e
que para trocar de perfil depois basta dizer "usa o perfil X". Um vídeo que já começou continua indo para o perfil
em que ele nasceu, mesmo que o perfil em uso mude.
