# EditOS: instruções para o assistente

Esta pasta é o EditOS, a máquina de conteúdo em vídeo: o Agente Orquestrador de Conteúdo (da ideia ao roteiro, à voz
e à direção), os Modelos de Edição e o Sistema de Edição com Claude. Pedido que começa numa ideia ou tema segue a skill
`orquestrador-conteudo`; pedido de modelo novo, fusão ou refino de modelo segue a skill `criar-modelo`; pedido que chega
com a gravação e o modelo segue o passo a passo abaixo. O `LEIA.md` tem o mapa.

Você edita vídeos em modelos de edição, com Remotion, dentro desta pasta.

## Onde fica cada coisa
- `<Perfil>/` (ex.: `Ana/`): a pasta de quem usa. `perfil.md` (nome e @), `materiais/` (logo, cores, prints de
  resultado, gravações: o material oficial que o vídeo pode usar) e `conteudo/` (os vídeos prontos: uma pasta por
  vídeo, `<nome-do-video>-DD-MM-AA/`, e dentro dela só as versões `v1.mp4`, `v2.mp4`...).
- `sistema/`: o motor (modelos, moldes, ferramentas, kit, ambiente). `sistema/oficina/` é onde cada vídeo é
  trabalhado, uma pasta por vídeo (`AAAA-MM-DD-tema/`).
- **Todo caminho escrito dentro de `sistema/` parte de `sistema/`** (é a raiz do estúdio): rode os comandos dos
  `<modelo>.md`, dos moldes e das ferramentas de dentro de `sistema/`. Nos arquivos desta raiz, caminho de arquivo vem
  com `sistema/` na frente e comando (`.venv/...`, `tools/...`) é rodado de dentro de `sistema/`, como nos `<modelo>.md`.

## Antes de tudo: o perfil
1. Rode `sistema/.venv/Scripts/python.exe sistema/tools/perfil.py`. Nenhum perfil? Siga a skill `comecar` (a
   entrevista de entrada) antes de qualquer vídeo. Mais de um e nenhum escolhido? Pergunte qual usar e rode
   `... perfil.py usar "<Nome>"`. O perfil ativo fica em `sistema/perfil-ativo`. Perfil novo ou troca de perfil: skill
   `novoperfil`.
2. Antes de editar, leia `<perfil>/perfil.md` e olhe `<perfil>/materiais/`: logo, cores e prints dali são os oficiais.
   Nunca use material de outro perfil.
   **Material, três modos (G24; o dono diz qual vale para o vídeo):** **só materiais** (o padrão, se ele não disse
   nada): somente o que ele forneceu, em geral na pasta de materiais indicada do vídeo; gerar imagem (kie.ai, Codex,
   qualquer IA) ou buscar foto, vídeo ou som online é proibido. **Livre** ("faz o que der com tudo"): os materiais mais
   busca, recorte e geração, API incluída. **Indicado** ("materiais e API só"): os materiais mais exatamente o que ele
   listou. Faltou? Efeito tipográfico, a pessoa ou reaproveitamento, e a falta vai para o `PEDIDO.md`, fora da peça. O
   modo vai no `cenas.json` e, nos modos livre e indicado, o recado final lista o que foi gerado ou buscado.
3. Cada versão final vai sozinha para `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4`: o final de cada molde
   (`scripts/mixar.sh`, `scripts/finalizar.sh`, `scripts/final.py`) chama `sistema/tools/entregar.py`, que copia o mp4
   oficial com o próximo número. Um arquivo por versão, nunca cópia leve. O roteiro vai junto, como
   `roteiro-vN.<ext>` ao lado do vídeo, sempre que mudou: por isso o roteiro de todo vídeo mora em `roteiro.md` na
   pasta da oficina (sem roteiro, o `plano.md`). Rascunho que ninguém vai ver: `SEM_ENTREGA=1`.
   Vídeo fora desse caminho automático (o 3D e os vídeos com motor próprio): rode
   `sistema/tools/entregar.py <pasta-do-video> <video.mp4>` quando a versão estiver aprovada.

## O fluxo de produção (EditOS online)
O dono acompanha tudo no painel (`/abrir-editos-online`, http://127.0.0.1:4700), que lê as pastas e se atualiza
sozinho. Cada vídeo é uma pasta `<perfil>/conteudo/<nome-do-video>-DD-MM-AA/`, com um `ficha.md`:
```
---
status: roteiro
link:
insight:
---
notas livres
```
- **status:** `roteiro` → `produzindo` → `revisar` → `pronto` → `publicado`. Sem ficha, o painel deduz: só roteiro é
  `roteiro`, com vídeo é `revisar`. `pronto` e `publicado` são decisão do dono.
- **Roteiro em lote:** cada roteiro nasce como pasta própria no `conteudo/` do perfil, com `roteiro-v1.md` e a ficha
  em `roteiro`. Ao produzir, a pasta da oficina aponta para ela (`tools/entregar.py ... --nome <a pasta>`, que grava
  o `entrega.json`) e a ficha vai para `produzindo`. A entrega do vídeo passa a ficha para `revisar` sozinha.
- **Operação Dark:** o painel busca o GitHub da `operacao-dark-nuvem` a cada minuto (todos os ramos, só leitura) e
  traz cada roteiro de `roteiros/<AAAA-MM-DD-tema>/` para a pasta do tema no perfil que o roteiro cita no começo
  (`origem: dark/<slug>` na ficha). Roteiro sem o nome da página no começo não entra.
- **insight:** o que o vídeo ensinou e pode virar regra do sistema; leia os insights antes de mexer num modelo.

## Fazer um vídeo
**Cada modelo tem um arquivo só que manda: `sistema/modelos/<modelo>/<modelo>.md`.** Ele traz a cara do modelo, os
números, as regras (já com as correções do dono e as regras gerais que valem para ele), as opções e o passo a passo do
vídeo novo. Quando o código, uma mensagem de erro ou outro arquivo citar `MODELO.md`, `LEIA.md` de molde,
`CORRECOES.md` ou `REGRAS.md`, a resposta está no `<modelo>.md`. O código do molde (`sistema/moldes/<modelo>/`) é o
vídeo aprovado em código; ele não é a regra.

**Nomes dos modelos (2026-11-03):** cada modelo tem o nome do que faz (`rosto-telas`, `youtube-didatico`, `prova-print`...; estilos de cena `cena01` a `cena46`). O nome antigo continua valendo como apelido (`sistema/tools/nomes-antigos.json`; os tools resolvem sozinhos): "edita no youtubeedition01" é o `youtube-didatico`.

**O vídeo é uma composição de cenas, não o modelo copiado (G40, `sistema/cenas/METODO.md`).** O modelo escolhido é a
casa: a identidade do vídeo inteiro (tratamento de cor, rosto, legenda, tipografia, cores, som, ritmo) vem do aprovado
dele e fica ligada do começo ao fim. O que a tela faz em cada cena se decide cena a cena: rosto puro, uma resposta da
casa, a resposta de outro modelo ou um estilo de cena (`cenaNN`, os 46 de `sistema/cenas/INDICE.md`). O
pedido do dono para uma cena ("cena 3 na cena07") manda nela. Só fica desligado de vez o que o `<modelo>.md`
diz que é opção desligada.
**3D Blender x 3D edição:** "3D Blender" é o `3d-como-funciona` e o `/estudio-3d` (modelagem e render). "3D edição" são
os estilos de cena com profundidade feitos no próprio Remotion, sem Blender (marcados no `INDICE.md`).

1. Leia `README.md` e o `sistema/modelos/<modelo>/<modelo>.md` inteiro antes de qualquer edição.
2. Estude o vídeo aprovado do modelo em `sistema/modelos/<modelo>/referencia/`: o `referencia.mp4` (com a voz), a
   `folha.jpg` (1 quadro por segundo) e o `mapa.json` (rosto, luz e cortes medidos a cada 0,25 s). Assista, tire os
   quadros que precisar e meça. O `original.mp4` é o mesmo vídeo em qualidade cheia. O vídeo tem que parecer o modelo,
   não o seu gosto; mas a referência mostra o jeito, não um roteiro para copiar: as telas, os textos e os cortes
   nascem da fala nova.
3. Um vídeo novo nasce, de dentro de `sistema/`, com
   `.venv/Scripts/python.exe tools/novo-video.py <modelo> <gravacao> <AAAA-MM-DD-tema>` (nome que a transcrição errar:
   `--trocar Errado=Certo`; achou o erro depois, `tools/trocar.py oficina/<pasta> Errado=Certo` corrige sem
   transcrever de novo) e vive em `sistema/oficina/`. A gravação deixada em `<perfil>/materiais/` vai junto para a
   pasta do vídeo (`entrada/`). Ele já adapta a gravação ao ponto de partida do modelo (`tools/adaptar.py`: rosto no
   tamanho e na altura, luz de partida); não pule esse passo. Depois siga a seção do vídeo novo do `<modelo>.md`, com
   um `plano.md` sobre `src/palavras.json` que abre com o **plano de cenas** e segue frase a frase. A demarcação já
   sai pronta no fim do `novo-video.py` (`tools/decupar.py`: cena até o ponto, subcena até a vírgula, reais ou
   imaginários; G41). **Dois modos** (`sistema/cenas/METODO.md` §6): no **semiautomático** ("semi", "me manda as
   cenas") você mostra a lista numerada e espera o dono responder cena a cena ("1 - cena04; 2 - tela da
   casa"); no **automático** (o padrão, "edita no <modelo>") você escolhe cada cena. "Legenda padrão em <modelo>" é a
   legenda do vídeo todo, menos na zona que mostra a fala como imagem (§6). As respostas vão para o `cenas.json`, e
   `tools/decupar.py <pasta> --plano` confere e grava a tabela antes do render. Entregue o vídeo com a lista de cenas,
   para ele trocar qualquer uma pelo número.
4. Confira com prova, nesta ordem (comandos de dentro de `sistema/`), e só chame de pronto quando tudo passar:
   - o checador do molde zerado;
   - `tools/parece.py <video.mp4> <modelo>`: luz, cor, enquadramento do rosto e ritmo contra o aprovado (vídeo curto é
     comparado com os trechos do mesmo tamanho do aprovado). Reprovou, o vídeo não sai: corrija o que ele aponta;
   - olhe a folha lado a lado que o `parece.py` grava (aprovado em cima, o seu embaixo). Se a diferença salta aos olhos,
     não está pronto, mesmo com os números dentro;
   - folha de 1 quadro por segundo, -14 LUFS.
5. Tudo confinado: use `.venv/`, `node_modules/`, `tools/`, `kit/` e `.tmp/` de `sistema/`; render com
   `QUEM=<nome> sh tools/com-trava.sh ...` e `--concurrency=2`. Nada fora da pasta.
   **O computador do dono nunca trava (G36).** Todo comando pesado (render do Remotion, ffmpeg longo, Blender, Whisper,
   montagem final) roda pelo `sistema/tools/com-trava.sh`, que liga a contenção (`sistema/tools/contencao.ps1`:
   prioridade ociosa e os últimos 6 núcleos sempre livres; na placa, prioridade ociosa e o Blender a 40% enquanto o
   dono usa o PC e no máximo 90% quando ele sai). Comando pesado fora da trava? Antes dele, solte o vigia:
   `powershell -NoProfile -ExecutionPolicy Bypass -File sistema/tools/contencao.ps1` (para sozinho 1 min depois do
   último processo pesado). Um pesado por vez; com menos de 2 GB de RAM livre, espere em vez de começar outro.
6. Nunca invente prova, número, fala, marca ou nome. Nome e @ na tela são os reais de quem fala (o `perfil.md`), ou
   nenhum. Interface, app ou aparelho na tela são recriados fiéis como um print, a partir de um print real com origem
   (G34, procedimento em `.claude/skills/criar-modelo/referencias/interface-fiel.md`); nunca o mockup genérico.
7. Correção do dono sobre um modelo entra no `<modelo>.md` daquele modelo, como regra (e, no EditOS local, também no
   `CORRECOES.md` dele, com data e as palavras do dono). Regra que vale para todos vai para `REGRAS.md` §0 e para o
   `<modelo>.md` de cada modelo em que se aplica. Mudou o vídeo aprovado de um modelo? Rode `tools/assinatura.py
   <modelo>` e, no EditOS local, `tools/referencia.py <modelo>` (de dentro de `sistema/`).
