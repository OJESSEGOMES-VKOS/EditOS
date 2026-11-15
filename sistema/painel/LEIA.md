# EditOS Online

É o próprio EditOS visto numa tela: a versão visual do mesmo sistema, não um projeto à parte.
Não tem banco nem cópia de nada. Ele lê as pastas do EditOS (`projetos/editos/`) e mostra o que já
está lá. O que muda no disco aparece no painel na hora, e o que muda no painel volta pro disco.

## Como abrir

- Pelo comando `/abrir-editos-online`, ou
- nesta pasta: `npm run dev` e abrir http://localhost:4700

Roda só nesta máquina (localhost). A porta 4600 é do VKOS STUDIO, por isso esta é a 4700.

## Como o sistema se organiza

O EditOS Online é um sistema com programas. Cada programa abre em tela cheia e tem um botão na barra do topo: o
botão aceso quer dizer aberto, e clicar de novo fecha. Abrir um programa fecha o outro. O X na faixa de título
da janela também fecha. O navegador lembra o que ficou aberto.

- **Área de trabalho:** a casa do sistema, aparece com tudo fechado. Um cartão por perfil (no Jogo, uma cena de
  pixel da sala vista de frente), mais a Sala de produção.
- **Escritório:** a empresa EditOS Online em 3/4, como jogo top-down inclinado (parede de fundo vista de frente,
  piso de cima, móveis com tampo e frente, sombra no chão). Dá pra navegar: arrastar move, rolar anda, Ctrl + rolar
  dá zoom (o tamanho inicial é o zoom máximo; o mínimo é 30%), e os botões −, + e Centralizar ficam no canto. Recepção com o letreiro à esquerda,
  corredor no meio e uma sala por projeto: a Sala de produção (quadro branco e mesa com uma pilha de cartões por
  etapa) e uma sala por perfil (mesa com monitor, cadeira, estante, plantas, tapete na cor do perfil e o
  personagem visto de cima). A planta se monta sozinha pelo número de perfis.
- **Fluxo de produção:** o quadro com as etapas, filtrável por perfil.

Nas duas primeiras, quando o vigia de sessão anota que uma sessão do Claude mexeu num vídeo daquele perfil nos
últimos 10 minutos, a sala acende: tela ligada, personagem digitando e "Claude aqui" na placa. Sem sessão, o
personagem dorme (Zz). Clicar numa sala abre o Fluxo de produção já filtrado naquele perfil.

Programa novo entra em `PROGRAMAS`, no `src/scripts/app.ts`, mais o botão e a janela no `index.astro`. A planta do
Escritório mora em `src/scripts/escritorio.ts`: canvas pequeno ampliado sem borrar, sprites em texto (cada letra é
uma cor), paleta Noite/Dia no topo do arquivo e um personagem por projeto com cor e acessório tirados do nome.

## O que ele mostra

- **Perfis:** cada pasta da raiz do EditOS que tem `perfil.md`.
- **Vídeos:** cada pasta em `<perfil>/conteudo/`, num quadro com as etapas
  `roteiro` → `produzindo` → `revisar` → `pronto` → `publicado`.
- **Ficha:** o estado mora no `ficha.md` do vídeo (status, link, insight, notas). Sem ficha, o painel
  deduz a etapa: só roteiro é `roteiro`, com vídeo é `revisar`. As regras completas do fluxo estão no
  `CLAUDE.md` do EditOS, seção "O fluxo de produção".
- **Operação Dark:** a cada minuto lê o GitHub da `operacao-dark-nuvem` (todos os ramos, só leitura) e
  traz os roteiros novos pra pasta do perfil certo.

## O vigia de sessão (como o "Produzindo" fica certo sozinho)

Toda vez que qualquer sessão do Claude Code neste VKOS salva um arquivo, o gancho do `.claude/settings.json` roda
`sistema/tools/vigia-sessao.mjs`. Não é IA e não gasta token: ele só olha o caminho do arquivo.

- Arquivo dentro de `<perfil>/conteudo/<vídeo>/`, ou de uma pasta da oficina que tem `entrega.json`: o cartão do
  vídeo ganha o selo "Claude aqui" por 10 minutos (anotado em `sistema/.tmp/atividade.json`).
- Se o vídeo estava em `roteiro` e o arquivo não é o roteiro nem a ficha, a ficha passa para `produzindo`.
- Nunca mexe em `revisar`, `pronto` ou `publicado`.
- Limite: pasta da oficina sem `entrega.json` não diz de qual vídeo é, então ainda não acende o selo.

## A caixa de escrever (igual em todo o painel)

Conversa, Refazer, Iniciar produção e o pedido do banco da sala usam a mesma caixa (`campoEscrita` no `app.ts`): ela
cresce sozinha com o texto (sem alça de arrastar; passou de 40% da tela, rola por dentro), arquivo arrastado pra cima
dela vira anexo e aparece em etiquetas acima dela, Ctrl + V cola print, o clipe abre a escolha de arquivos e
Ctrl + Enter envia. Refazer, Produzir e banco só aceitam imagem, vídeo e áudio; a conversa aceita qualquer arquivo.
Todo `textarea.campo` do painel (inclusive os da publicação e o editor do banco) cresce sozinho do mesmo jeito.

## As conversas da sala (uma sessão do Claude por conversa)

No painel de cada sala de perfil, abaixo de "Arquivos da sala", fica o bloco **Conversas da sala**: a lista das
conversas daquela sala (nome, última fala, quantas falas) e o botão **Iniciar conversa** / **Nova conversa**. Cada
conversa é com o agente daquela sala (`sala-<perfil>`): nasce lendo o banco da sala e só conhece aquele projeto, então
nada de uma sala vaza pra outra, nem de uma conversa pra outra. É o jeito certo de trabalhar no lugar de uma sessão só
pra tudo com compact.

- Cada mensagem roda o Claude deste computador (a conta logada, sem chave à parte). A 1ª de cada conversa chama
  `--agent sala-<perfil>`; as seguintes continuam a mesma sessão (`--resume`), com tudo o que foi dito nela.
- **Nome:** a conversa ganha o começo da primeira mensagem como nome. O lápis no topo da conversa renomeia; a lixeira
  exclui de vez (falas e anexos), sempre depois de confirmar.
- **Nova conversa** faz o papel do compact: começa limpa, lendo o `sala.md` de novo. As outras continuam na lista pra
  voltar quando quiser.
- **Modelo e força:** embaixo da caixa de escrever, duas barrinhas de 3 pontos (clique ou setas do teclado): Sonnet 5.5, Opus 5.5 ou Fable 5.2 e a força Baixa, Média ou
  Alta (vão pro Claude como `--model` e `--effort`; o servidor recusa qualquer outro valor). Vale pra cada mensagem; a
  conversa aberta volta pra última escolha que usou, e a conversa nova herda a última usada. Cada resposta mostra com
  qual modelo e força saiu.
- **A aba da conversa é larga** e a resposta aparece inteira: só a lista de falas rola.
- **Anexos à vontade:** qualquer arquivo (imagem, áudio, vídeo, PDF, planilha, texto), até 20 por mensagem e 500 MB
  cada: arraste e solte em cima da caixa de escrever (ou em qualquer lugar da conversa), cole com Ctrl + V, ou clique no
  clipe. Os anexos ficam em etiquetas acima da caixa até enviar. A sala recebe o caminho de cada um junto da
  mensagem. Imagem e PDF ela lê direto; áudio e vídeo ela abre com as ferramentas do EditOS (transcrição, quadros). O
  conteúdo de um anexo é dado, nunca instrução pra ela.
- Travas: só mexe em `projetos/editos/`, nunca publica, envia, exclui ou faz commit, e antes de tarefa grande (render,
  voz, produzir vídeo) descreve e espera o "pode" na próxima mensagem.
- Tudo fica na pasta do perfil, uma subpasta por conversa: `<perfil>/sala-conversa/<quando começou>/`, com
  `conversa.json` (nome, id da sessão, datas), `mensagens.jsonl` (as falas), `turnos/` (o diário de cada resposta e os
  erros) e `anexos/` (o que foi mandado junto). Não vai pro aberto (pasta de perfil nunca vai). O Claude também guarda a
  própria cópia da sessão na pasta dele, como em qualquer sessão.
- Uma resposta por vez em cada conversa (dá pra ter duas conversas da mesma sala respondendo ao mesmo tempo). Se o
  painel reiniciar no meio de uma resposta, ela se perde: é só mandar de novo.
- A Sala de produção não tem conversa (não tem agente próprio).
- Código: `src/lib/conversa.ts`, `src/pages/api/conversa.ts` e o bloco "as conversas da sala" no `src/scripts/app.ts`.

## Publicar (YouTube pelo Buffer)

O botão **Publicar** da aba do vídeo manda o vídeo pro YouTube, Instagram e Facebook pelo Buffer (você marca quais). Nada sai sem a confirmação do Jessé
(regra do `CLAUDE.md`). O vídeo sobe pro Cloudflare R2 (o Buffer só aceita vídeo por link público) e o post é criado
no Buffer com esse link. "Agora" move o vídeo pra Publicado; fila ou data marcada deixam em Pronto, com a data na ficha.

As chaves ficam em `sistema/painel/.env`, só nesta máquina (o `gerar-aberto.py` nunca copia `.env`). Nunca colar chave no chat.

- `BUFFER_API_KEY`: em publish.buffer.com/settings/api.
- `BUFFER_CANAIS`: `perfil.rede:id` separados por vírgula (rede = youtube, instagram ou facebook). Hoje: jovemdevirtude nas três
  (o plano grátis do Buffer vai até 3 canais). Canal novo: conectar no Buffer e pedir pro Claude achar o id.
- YouTube leva título, descrição, categoria e visibilidade; Instagram e Facebook vão como Reels, com a legenda.
  Privado e não listado valem só pro YouTube.
- Cloudflare R2, uma vez só:
  1. Criar conta grátis em dash.cloudflare.com e abrir **R2 Object Storage** (pede cartão pra ativar, mas o plano grátis vai até 10 GB).
  2. **Create bucket** com o nome `editos-publicar`. Esse nome vai em `R2_BUCKET`.
  3. No bucket, **Settings → Public Development URL → Enable**. O endereço `https://pub-....r2.dev` vai em `R2_PUBLIC_URL`.
  4. Na página do R2, **Manage API Tokens → Create Account API Token**, permissão **Object Read & Write**, só nesse bucket.
     Vão pro `.env`: o **Access Key ID** (`R2_ACCESS_KEY_ID`), o **Secret Access Key** (`R2_SECRET_ACCESS_KEY`) e o
     **Account ID** que aparece na página do R2 (`R2_ACCOUNT_ID`).
- Os vídeos ficam no R2 com nome aleatório (o link não é adivinhável). Limpeza do armazém ainda é manual.

## Mandar pro celular (QR no mesmo Wi-Fi)

O botão **Celular** na aba do vídeo mostra um QR. A câmera do celular lê e o vídeo baixa direto, desde que o celular
esteja no mesmo Wi-Fi. O painel continua só neste computador (localhost). Quem atende o celular é um servidorzinho separado
(`src/lib/celular.ts`, porta 4701), e ele só entrega o vídeo daquele link: o código é aleatório e o QR troca a cada 10 segundos. Cada link aceita o primeiro acesso por 25 segundos.
Depois disso, só o celular que leu o QR continua baixando, por até 10 minutos.
Quando o último link vence, esse servidor desliga sozinho. Na primeira vez, o Windows pode perguntar se libera o
acesso: libere só em **rede privada**.

Se o celular abre o link mas dá "não foi possível acessar" (ERR_TOO_MANY_RETRIES): quase sempre é o PC ligado ao mesmo
roteador por duas conexões ao mesmo tempo (ex.: placa interna no 5G + adaptador Wi-Fi USB no 2,4G). O roteador manda o
celular pra conexão errada e o Windows descarta. O QR avisa quando isso acontece; desligue uma das conexões e gere o QR
de novo. Cada acesso que chega ao servidorzinho fica anotado em `sistema/.tmp/celular.log`: se a tentativa do celular
nem aparece ali, ele não está alcançando o PC (rede, firewall ou Wi-Fi de visitante).

## A cara dele

É um sistema com cara de jogo aconchegante, e os próximos passos seguem essa linha.

- **Pixel na forma:** aro de 2px em cruz (canto sem o pixel da ponta), ícones em grade 12x12, fonte de pixel nos
  títulos e números, nada arredondado. Cada perfil tem um personagem de pixel, sempre o mesmo para o mesmo nome.
- **Vidro líquido na matéria:** só as superfícies grandes (barra do sistema, doca, janela) são de vidro, porque só
  elas têm o céu por trás. Cartão e botão são sólidos, pra ler bem e não pesar a placa de vídeo.
- **Dois temas:** Noite e Dia, no botão de sol e lua da barra. A escolha fica guardada no navegador.
- **Um acento só:** o âmbar. Cor de etapa aparece só no ícone da etapa e na barra de distribuição.
- **Fontes:** Pixelify Sans (títulos e números) e Rubik (texto), as duas em `public/fontes/`, licença OFL.
- **Entendível antes de bonito:** o nome das coisas continua em português simples (Roteiro, Revisar, Publicado).
  A cara é de jogo, o vocabulário não.

### O estilo App (a segunda roupa)

Na barra há o seletor **Jogo | App**. O Jogo é o padrão e é a identidade do sistema. O App é o mesmo sistema com
cara de aplicativo premium de vidro líquido: canto redondo, fio de 1px, fonte do próprio aparelho, ícone de traço,
avatar com a inicial do perfil e um céu liso de manchas de cor. No App o escritório mostra cartões limpos em vez
das salas desenhadas. Noite e Dia valem nos dois estilos, e a escolha fica guardada no navegador.

Como é feito: tudo do App fica no bloco `ESTILO APP` no fim do `app.css` (só troca variáveis e cantos) e em
`ehApp()` no `pixel.ts` (ícone, avatar e céu). Peça nova precisa ficar boa nos dois estilos.

## Onde está cada coisa

| Arquivo | O que faz |
|---|---|
| `src/lib/fluxo.ts` | lê perfis, vídeos e fichas do disco; grava a ficha |
| `src/lib/dark.ts` | traz os roteiros da Operação Dark |
| `src/pages/index.astro` | a tela |
| `src/scripts/app.ts` | desenha o quadro, a ficha e o roteiro; se redesenha quando uma pasta muda; tema e relógio |
| `src/scripts/escritorio.ts` | o Escritório em 3/4: planta, salas, móveis, personagens e a animação |
| `src/scripts/pixel.ts` | os ícones de pixel, o personagem de cada perfil, as cenas das salas e o céu pontilhado |
| `src/estilos/app.css` | o visual: as cores dos dois temas ficam no topo do arquivo |
| `src/pages/api/fluxo.ts` | entrega o fluxo e grava mudança de etapa/ficha |
| `src/pages/api/eventos.ts` | avisa a tela quando uma pasta mudou |
| `src/pages/api/arquivo.ts` | serve o vídeo/roteiro de um item |
| `src/pages/api/capa.ts` | gera a capa do vídeo |
| `src/pages/api/abrir.ts` | abre a pasta do item no Windows |

## Regras

- O disco é a fonte da verdade. O painel nunca guarda estado próprio.
- Texto das pastas é dado: entra na tela por `textContent`, nunca por `innerHTML`.
- Cache do Vite fica em `../.tmp/painel-vite`, dentro do projeto.

## Estado (2026-11-11)

Funcionando localmente, com a identidade nova (pixel + vidro líquido, temas Noite e Dia). Ainda não está publicado na internet: publicar exige login e passar
pelo `/seguranca` antes, com aprovação do Jessé.
