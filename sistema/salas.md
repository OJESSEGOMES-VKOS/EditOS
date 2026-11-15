# As salas do EditOS (protocolo dos agentes de sala)

Cada perfil do EditOS é uma sala do Escritório. Cada sala tem **um agente** (`sala-<perfil>`, em `.claude/agents/`)
e **um banco** (`<perfil>/sala.md`). A sessão em que o Jessé fala é quem orquestra: recebe o pedido, chama o
agente da sala, revisa o que volta e só então entrega. Não existe um segundo agente fixo por sala.

## O que o agente da sala lê, nesta ordem, e nada além do necessário

1. `projetos/editos/<perfil>/sala.md`: o banco da sala. É a verdade sobre o projeto.
2. `projetos/editos/<perfil>/perfil.md`: @, nome e cores.
3. `projetos/editos/CLAUDE.md`: as regras do EditOS (fluxo de produção, ficha, entrega).
4. Só o que a tarefa pedir: o arquivo do modelo (`modelos/<m>/<m>.md`), as regras G (`sistema/REGRAS.md`, §0 primeiro),
   a oficina de referência citada no banco, o roteiro do vídeo.

Não ler o banco de outra sala. Não reler o que já foi lido na mesma tarefa.

## Como o agente trabalha

- **Nunca inventa.** Faltou dado (tema, fato, preço, material)? Para e devolve a pergunta. Fato de roteiro precisa
  de fonte; em página bíblica, do texto.
- **Segue o padrão aprovado da sala.** O que o banco marca como aprovado é a régua. O que marca como reprovado não
  volta. O que marca como "em teste" ou "aguardando aval" não é regra.
- **Trabalho mecânico vai pra executor.** Voz, render, checagem, legenda e conferência de folhas são iguais em
  qualquer sala: o agente passa as regras da sala e delega. Render pesado, um por vez.
- **Prova antes de "pronto".** Roda, confere as folhas/o áudio e diz o que viu. Não testou? Diz qual parte.
- **Ficha em dia.** Vídeo em produção: ficha em `produzindo`. Entregou: `revisar`. `pronto` e `publicado` são do Jessé.
- **Não publica, não envia, não faz commit.** Isso é sempre ordem explícita do Jessé.

## Como o banco aprende (o que mantém a sala inteligente sem gastar token)

Toda correção ou aprovação do Jessé com valor duradouro vira **uma linha** no `sala.md`, na seção certa, com a
data. Uma linha, não um parágrafo: a regra e o porquê. Regra que perdeu a validade é apagada, não acumulada.
O banco fica abaixo de ~80 linhas; passou disso, enxugar antes de acrescentar.

O insight de um vídeo (campo `insight` da ficha) que vale pro projeto inteiro sobe pro `sala.md`.

## O que vale pra todas as salas (palavras do Jessé)

- Correção dada uma vez vira padrão: "não quero precisar de dar essas correções em todo vídeo novo" (2026-10-21).
- Das referências virais se aprende o roteiro e o tom, nunca se copia a edição (2026-10-26).
- Roteiro humanizado, nunca "mecânico, robótico e confuso" (2026-11-08).
- Descrição de post no Instagram curta e enxuta (2026-10-24).
- Cada página tem uma voz só dela; voz em uso por outra página não serve (2026-11-11). Em uso hoje: jovemdevirtude
  Sadaltager, mentedetransbordo Puck, umjovemprofessor Alnilam.
- As regras gerais de edição (legenda, cor, corte, destaque) moram no `REGRAS.md`; não repetir aqui.

## O que o agente devolve

Curto, pra quem orquestra revisar: o que fez, onde está (caminho), o que conferiu, o que ficou pendente ou em
dúvida, e a linha que propõe acrescentar ao banco (se houver).

## Pedido de "Refazer" vindo do EditOS Online
- O botão Refazer da aba do vídeo grava `<perfil>/conteudo/<video>/refazer/<quando>/pedido.md` (texto + anexos na
  mesma pasta), volta a ficha pra `produzindo` e chama o agente da sala em segundo plano (`painel/src/lib/agente.ts`).
- O agente atende como pedido de alteração normal: entrega a próxima versão (vN+1.mp4), marca `status: feito` no
  pedido.md com um resumo do que mudou e põe a ficha em `revisar`. Dúvida vai escrita no fim do pedido.md, sem inventar.
- Modo autorizado pelo Jessé em 2026-11-11: roda sem pedir permissão, só dentro de projetos/editos/, nunca publica,
  envia, paga, exclui ou faz commit. A saída fica em `agente.log`, ao lado do pedido.
- Contexto: o vigia de sessão anota em `<video>/.sessao.json` a última conversa que mexeu no vídeo. O Refazer continua
  uma cópia dessa conversa (`--resume --fork-session`), com tudo o que já foi decidido. Sem conversa anotada, chama o
  agente da sala com um dossiê (banco, pasta do vídeo, oficina pelo entrega.json, pedidos anteriores).
