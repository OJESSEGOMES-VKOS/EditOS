# Preparar o EditOS

**Para você, aluno:** abra o Claude Code **ou o Codex** numa pasta vazia (por exemplo `Documentos\estudio-claude`) e escreva:

> Instale o EditOS seguindo https://github.com/OJESSEGOMES-VKOS/EditOS/blob/main/PREPARAR.md

Quer a versão **cru**, sem os modelos prontos, para criar os seus? Escreva no fim da frase: *"na versão cru"*.

Não precisa baixar nem copiar nada. O assistente lê estas instruções e faz o resto, pedindo a sua licença antes de instalar
cada programa. Leva de 20 a 40 minutos, conforme a internet, e você só faz isso uma vez.

Precisa ser o Codex (o aplicativo ou a linha de comando, entrando com a conta do ChatGPT), não o ChatGPT no navegador: o
assistente precisa rodar programas no seu computador.

---

## Para o assistente (Claude Code ou Codex): o que fazer

Quem pediu isto não é programador. Fale em português simples, um passo por vez, e diga o que está fazendo antes de cada
passo. Peça licença antes de instalar qualquer programa no computador. Se algo falhar, explique em uma frase o que
houve e tente o caminho alternativo; não despeje erro técnico na pessoa.

### 1. Conferir o espaço
O estúdio ocupa uns 10 GB depois de pronto, já com o modelo de transcrição. Confira se o disco da
pasta atual tem pelo menos **15 GB livres**. Se não tiver, avise e pare.

### 2. Os programas de base
Confira se já existem: **Python 3.11 ou 3.12**, **Node.js 20 ou mais novo** e **ffmpeg** (com `ffprobe`). Para o que
faltar, com a licença da pessoa:
- **Windows:** `winget install -e --id Python.Python.3.12`, `winget install -e --id OpenJS.NodeJS.LTS`,
  `winget install -e --id Gyan.FFmpeg`. Precisa também do PowerShell 7: `winget install -e --id Microsoft.PowerShell`.
- **macOS:** com o Homebrew, `brew install python@3.12 node ffmpeg`.
- **Linux:** o gerenciador da distribuição (`apt install python3 python3-venv nodejs npm ffmpeg`).

Depois de instalar, o terminal atual pode não enxergar os programas novos. Se for o caso, peça para a pessoa fechar e
abrir o Claude Code ou o Codex de novo na mesma pasta e repetir o pedido; você continua de onde parou.

### 3. Baixar o estúdio
Há duas versões, iguais no motor:
- **Completo** (padrão): com os 14 modelos de edição prontos.
  `https://github.com/OJESSEGOMES-VKOS/EditOS/releases/latest/download/EditOS-completo.zip`
- **Cru**: sem nenhum modelo de edição, para quem quer criar os próprios (`/criar-modelo`).
  `https://github.com/OJESSEGOMES-VKOS/EditOS/releases/latest/download/EditOS-cru.zip`

Use o cru só se a pessoa pediu "cru" ou "sem modelos"; na dúvida, o completo. Baixe o zip e extraia nesta pasta, de
modo que o `CLAUDE.md` e o `AGENTS.md` do estúdio fiquem na pasta atual (não numa subpasta). O Claude Code lê o
`CLAUDE.md`, o Codex lê o `AGENTS.md`; têm o mesmo texto. Confira que os dois estão na pasta raiz. Não precisa de git nem de conta no
GitHub.

### 4. Instalar
- **Windows:** `pwsh -File instalar.ps1`.
- **macOS / Linux:** `sh instalar.sh`.

O instalador deixa tudo dentro da pasta: ambiente Python, Remotion, modelos de IA e caches. Nada se espalha pelo
computador. Ele descobre sozinho se há placa NVIDIA e já baixa o modelo de transcrição certo para a máquina (o
maior com placa, o médio sem). No fim, ele mesmo apaga o que só servia para instalar.

### 5. Conferir que funciona
Confira as três partes, sem precisar de vídeo:
- Python: `sistema/.venv/Scripts/python.exe -c "import faster_whisper, cv2, numpy"` (no macOS/Linux, `sistema/.venv/bin/python`);
- Remotion: `npx remotion versions` (de dentro de `sistema/`);
- ffmpeg: `ffmpeg -version`.

Se as três responderem sem erro, está pronto. O primeiro vídeo de verdade da pessoa é o teste completo.

### 6. Avisar a pessoa
Diga, em poucas linhas:
- que o estúdio está pronto e em que pasta;
- que, para editar, ela grava o vídeo (celular em pé, rosto de frente, boa luz, sem música ao fundo), na primeira
  conversa responde três perguntas (nome, @ e materiais) que criam a pasta dela, coloca a gravação em
  `<Nome>/materiais/` e escreve, por exemplo: *"Edite o meu vídeo `gravacao.mp4` no rosto-telas"*; o vídeo pronto
  chega em `<Nome>/conteudo/<nome-do-video>-DD-MM-AA/`;
- que os modelos disponíveis estão em `sistema/modelos/`, cada um com o vídeo de exemplo em `referencia/referencia.mp4`;
- que ela pode deixar o modelo mais com a cara dela preenchendo a seção "Do seu jeito", no topo do arquivo do modelo.
