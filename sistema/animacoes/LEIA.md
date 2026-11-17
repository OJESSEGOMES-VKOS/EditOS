# Animações do EditOS

O motor de animação do EditOS: a pessoa conta uma ideia e sai um vídeo animado pronto, em 2D, 3D leve, 3D edição ou
3D Blender. O assistente escreve o roteiro, cuida da voz, desenha e anima as cenas em código (Remotion), confere e
entrega no perfil, como todo vídeo do EditOS.

São **45 estilos** (o catálogo está em `animacoes/estilos/INDICE.md`). Cada estilo tem uma skill própria,
`.claude/skills/anim-<id>/SKILL.md` na raiz do EditOS, que diz a personalidade dele, as peças, como desenhar coisa
nova e o que nunca fazer. **Leia a skill do estilo antes de qualquer cena.** Todas seguem o `sistema/JEITO.md`: o
exemplo de cada estilo (o ciclo da água) mostra o jeito, nunca é o roteiro do vídeo novo.

Aqui ele usa o `node_modules` de `sistema/`, a oficina, a trava e a entrega do EditOS.

**Todo comando abaixo roda de dentro de `sistema/`** (a raiz do estúdio). Tudo que é pesado (fotos e render) roda
pela trava: `QUEM=animacoes sh tools/com-trava.sh <comando>`, um pesado por vez.

## Onde fica cada coisa

```
animacoes/LEIA.md                  este arquivo: o caminho de um vídeo e as regras de trabalho
animacoes/estilos/INDICE.md        o catálogo dos estilos (refeito por ferramentas/estilos.mjs)
animacoes/src/kit/                 o kit de animação (tempo, cenas, legenda, desenho, câmera)
animacoes/src/estilos/<id>/        cada estilo: ficha.md (a cara) e index.tsx (as peças e o exemplo)
animacoes/exemplos/exemplo-ciclo-da-agua/   o vídeo de exemplo montado inteiro (roteiro, fala, video.tsx)
animacoes/ferramentas/             novo-video, voz, fotos, render, estilos
animacoes/ferramentas/skills/      gerar.py + dados.py: refazem as skills anim-<id> a partir das fichas (Python do .venv)
animacoes/blender/                 o 3D Blender (3D de bloquinho): GUIA.md, kit e exemplo
animacoes/public/videos/<pasta>/   o áudio de cada vídeo (voz e trilha)
oficina/<AAAA-MM-DD-tema>/         cada vídeo: roteiro.md, fala.json, video.tsx, fotos/, out/final.mp4
<perfil>/conteudo/<tema>-DD-MM-AA/ a entrega: v1.mp4, v2.mp4... com o roteiro ao lado (tools/entregar.py)
```

- Um vídeo de animação é uma pasta da oficina cujo `roteiro.md` tem a linha `- **Estilo:** <id>` (o
  `novo-video.mjs` escreve). É assim que as ferramentas acham ele; os outros vídeos da oficina não são tocados.
- Os arquivos `src/*.gerado.ts` são escritos pelas ferramentas. Não edite à mão.
- Estilo novo ou ajuste de estilo: o mesmo método do `novo-estilo` do animevocê (molde: o estilo `giz`; fonte do
  Google com `latin-ext`; ids SVG com o id do estilo na frente; nada baixado). Depois rode
  `node animacoes/ferramentas/estilos.mjs` e escreva a skill `anim-<id>` no formato das outras.
- Nunca apague vídeo, roteiro ou versão entregue sem o dono pedir.

## O caminho de um vídeo

Do pedido ao arquivo pronto são seis passos. Não pule nenhum e não peça aprovação a cada um.

### 0. O perfil
`.venv/Scripts/python.exe tools/perfil.py`: o vídeo é entregue no perfil ativo. Sem perfil, skill `comecar`. Leia o
`<perfil>/perfil.md` (nome e @ na tela só os reais, ou nenhum).

### 1. Entender o pedido (no máximo três perguntas, de uma vez)
Você precisa de: **o assunto**, **o estilo** e **a voz**. Pergunte só o que não foi dito.
- **Estilo:** se não escolheram, sugira dois ou três do `animacoes/estilos/INDICE.md` que combinam com o assunto,
  com a cara de cada um em uma frase. Na dúvida, escolha você e avise.
- **Voz:** sem narração, a voz da pessoa gravada, ou voz de IA (detalhe em "A voz"). Sem pedido: sem narração.
- **Formato:** vertical (Reels, Shorts, TikTok) é o padrão. Horizontal é pra YouTube.
- **Duração:** de 30 a 60 segundos é o padrão. Cada 10 segundos são umas 28 palavras de fala.

### 2. Roteiro
`node animacoes/ferramentas/novo-video.mjs <nome-curto> --estilo <id> [--formato horizontal]` cria
`oficina/<AAAA-MM-DD>-<nome>/roteiro.md`. Preencha as três seções:
- **Ideia:** o que quem assiste vai entender ou sentir no fim.
- **Fala:** uma frase por linha. Regras em "Como escrever a fala".
- **Cenas:** a tabela de quais frases cada cena cobre (contando do 0) e o que a tela mostra, com o porquê de cada
  tela (a palavra da fala que pediu ela).

Fato, número, data ou nome: **confira antes de escrever** (busque na internet quando puder) e nunca invente. Sem
como conferir, diga isso e escreva só o que é seguro. Mostre o roteiro em texto corrido e pergunte se pode seguir:
**é a única aprovação obrigatória antes do vídeo pronto.** O roteiro vai junto com cada versão entregue.

### 3. Voz
`node animacoes/ferramentas/voz.mjs <pasta>` (com o motor escolhido) escreve o `fala.json`: o tempo de cada frase e
de cada palavra. É ele que amarra as cenas e a legenda. Mudou a fala? Rode a voz de novo antes de mexer nas cenas.

### 4. Cenas
Escreva `oficina/<pasta>/video.tsx`. Leia antes, nesta ordem:
- a skill `anim-<id>` e `animacoes/src/estilos/<id>/ficha.md` (a cara do estilo e o que evitar);
- `animacoes/src/estilos/<id>/index.tsx` (as peças e como os desenhos prontos foram feitos);
- `animacoes/exemplos/exemplo-ciclo-da-agua/video.tsx`: a montagem inteira (como, nunca o quê).

O `video.tsx` exporta sempre três coisas: `fala` (o `fala.json`), `formato` e `Video` (um `<Filme>`). Da oficina, os
imports são `'../../animacoes/src/kit'` e `'../../animacoes/src/estilos/<id>'`. Desenho novo que o vídeo pede mora
no próprio `video.tsx`, nunca no estilo. Regras em "Como fazer as cenas".

### 5. Conferir (sempre, antes de renderizar)
1. `cd animacoes && npx tsc --noEmit -p .` sem erro (confere todos os vídeos de animação da oficina).
2. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>` tira uma folha com um quadro
   a cada 2 segundos em `oficina/<pasta>/fotos/video-folha.jpg` (`--cada 1` pra um por segundo; `... <pasta> 12.5 20`
   pra quadros em tamanho cheio). **Abra a imagem e olhe**, com a lista de "O que olhar nas fotos".
3. **O teste do clone** (`sistema/JEITO.md` §5): tire a folha do exemplo do estilo
   (`... fotos.mjs --estilo <id>`, sai em `animacoes/estilos/fotos/`) e ponha ao lado da sua. É o mesmo estilo?
   Tem que ser sim. É o mesmo vídeo (mesmos objetos, textos, ordem)? Tem que ser não.
4. Só renderize quando as fotos estiverem boas. Render é a parte demorada: não use ele pra testar.

### 6. Renderizar e entregar
`QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>` grava
`oficina/<pasta>/out/final.mp4` (2 processos, crf 20) e chama `tools/entregar.py`, que copia como
`<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (uma versão nunca apaga a outra), leva o roteiro junto e passa a ficha do
EditOS Online para `revisar`.
- Rascunho que ninguém vai ver: `SEM_ENTREGA=1` na frente (só o `out/final.mp4`).
- Roteiro que já nasceu como pasta no `conteudo/` do perfil (roteiro em lote): `... render.mjs <pasta> --nome <pasta-do-conteudo>`.
- Diga ao dono onde o vídeo está, em uma linha, e o que ele pode pedir agora: trocar uma cena, mudar a fala, pôr
  voz, tentar outro estilo.

**Pedido de ajuste:** mexa só no que foi pedido, tire as fotos do trecho, renderize e entregue a versão nova.

## Como escrever a fala

- **A primeira frase é o gancho.** Um fato concreto que surpreende ou uma pergunta que a pessoa quer ver respondida.
  Nada de "você sabia que", "hoje vamos falar sobre" ou cumprimento.
- **Fala de gente.** Frase que uma pessoa diria em voz alta contando pra um amigo. Cada frase puxa a próxima.
  Nada de frase solta de efeito, lista de adjetivos ou tom de manual.
- **Uma ideia por frase**, de 6 a 16 palavras. Frase maior que isso, quebre em duas linhas.
- **Concreto.** Nome, número, comparação com coisa do dia a dia. "Pesa o mesmo que três elefantes" diz mais que
  "é muito pesado".
- **Tudo que entra serve à ideia.** Dado curioso que não ajuda a entender o assunto sai.
- **O fim fecha.** A última frase responde o gancho ou devolve a pessoa pro começo. Não termine pedindo like.
- **Nunca prometa** resultado, dinheiro, cura ou fama, e nunca invente fato, número, fala ou fonte.

## Como fazer as cenas

O kit está em `animacoes/src/kit/`. O que você mais usa:

| Peça | Pra quê |
|---|---|
| `Filme`, `cenasPorFrase` | monta o vídeo: `cenasPorFrase(fala, [[0, 1, CenaA], [2, 2, CenaB]])` liga cada cena às frases que ela cobre |
| `PropsCena` | o que a cena recebe: `t` (segundos desde que ela começou), `dur`, `tv` (segundo do vídeo) e `fala` |
| `ramp(t, a, b)` | vai de 0 a 1 entre os segundos `a` e `b`: é a base de toda animação |
| `quando(fala, 'palavra', frase)` | o segundo do VÍDEO em que uma palavra é dita (na cena, subtraia o começo dela) |
| `Tela`, `useTela` | a tela de desenho (SVG) e o tamanho dela: `L`, `A`, `cx`, `cy` e a unidade `u` |
| `Traco`, `caminho`, `tremer`, `circulo`, `emFila` | o traço que se desenha e as formas |
| `Camera` | mover, aproximar e girar a cena |
| `Palco3D`, `Plano` | profundidade sem programa de 3D (camadas em perspectiva) |
| `balanco`, `acaso`, `chaves`, `janela` | vida (respiração, vento), acaso que se repete, valores por pontos no tempo |

Regras que valem em todo estilo:

1. **A tela mostra o que a frase diz.** Falou em chuva, chove. Se a pessoa assistir sem som, ela entende a história.
2. **A cena muda quando o assunto muda.** Uma cena não passa de uns 8 segundos sem acontecer algo novo nela.
3. **Sempre tem movimento.** Nada fica parado mais de 2 segundos: algo se desenha, cresce, anda ou respira.
   Coisa nova aparece na palavra que fala dela (use `quando`).
4. **O vídeo abre com imagem.** No segundo 0 já tem algo na tela. Nunca comece com tela vazia nem só com fundo.
5. **Tempo em segundos, sempre.** As cenas usam `t`, nunca número de quadro. Nada de `Math.random()` nem de
   `Date`: use `acaso(semente)`, senão cada quadro sai diferente e o vídeo pisca.
6. **Tamanho em proporção.** Posicione com `L`, `A` e `u` do `useTela()`, nunca com número solto de pixel, pra o
   mesmo vídeo funcionar em pé e deitado.
7. **Área segura.** Nada importante a menos de 6% das bordas. No vertical, a faixa de 62% a 82% da altura é da
   legenda: não ponha texto nem o assunto principal ali. O último quinto de baixo é coberto pelos botões das redes.
8. **Texto na tela:** curto (até 5 palavras), grande (nunca abaixo de 56 numa tela de 1080) e fica o tempo de ler:
   1 segundo mais 1 segundo a cada 3 palavras. Não repita na tela a frase inteira que a legenda já mostra; se a
   frase está escrita na cena, desligue a legenda naquele trecho (`semLegenda`).
9. **O estilo manda na cara.** Cor, traço, letra e transição vêm das peças e do `tema` do estilo. Não misture dois
   estilos no mesmo vídeo, e não troque as cores do estilo sem o dono pedir.
10. **Desenho novo segue o molde.** Objeto que o estilo não tem pronto você desenha do mesmo jeito que os desenhos
    prontos dele (leia como o `Sol` ou a `Nuvem` do estilo foram feitos). Simples e reconhecível vence detalhado.
11. **Nada de terceiros.** Não desenhe personagem, logotipo ou marca que já existe, nem pessoa real. Gente aparece
    como figura simples do estilo. Imagem, música ou vídeo só do `<perfil>/materiais/` ou com ordem do dono (os três
    modos de material do EditOS, G7).
12. **Trilha e efeito sonoro** só se o dono mandar o arquivo (ou pedir no modo livre): coloque em
    `animacoes/public/videos/<pasta>/` e passe no `trilha` do `Filme` (`'videos/<pasta>/trilha.mp3'`).
13. **O exemplo não é o roteiro.** Sol, mar, nuvem, chuva e planta do exemplo só voltam se a fala nova falar deles.
    Cada objeto novo nasce da palavra que o pediu.

## O que olhar nas fotos

- O primeiro quadro tem imagem, não tela vazia.
- Cada foto mostra o que a frase daquele momento diz. Duas fotos seguidas iguais são sinal de cena parada.
- Nada cortado na borda, nada em cima da legenda, nenhum texto atravessando outro.
- Todo texto dá pra ler na miniatura. Se não dá na miniatura, não dá no celular.
- A legenda aparece inteira, com contraste, e não cobre o assunto.
- As cores são as do estilo. Nada estourado de branco nem escuro demais.
- A última foto fecha a história (não acaba no meio de um movimento).
- Ao lado da folha do exemplo: mesmo estilo, outro vídeo.

## A voz

| Caminho | Como | Quando |
|---|---|---|
| **Sem narração** | `node animacoes/ferramentas/voz.mjs <pasta>` | o padrão. A legenda conta a história e o tempo sai do tempo de leitura |
| **A voz da pessoa** | `node animacoes/ferramentas/voz.mjs <pasta> --motor arquivo --audio <arquivo>` | ela grava no celular lendo a seção "Fala" e manda o áudio (ponha na pasta do vídeo ou passe o caminho) |
| **Voz de IA (kie.ai)** | `node animacoes/ferramentas/voz.mjs <pasta> --motor kie [--voz Puck] [--tom "..."]` | com a chave da kie.ai no `.env` do estúdio |

- **A voz da pessoa:** gravar num lugar silencioso, com o celular perto da boca, lendo as frases na ordem e fazendo
  **uma pausa curta entre uma frase e outra** (é pela pausa que a ferramenta acha onde cada frase começa). Qualquer
  formato de áudio serve. Confira na lista que a ferramenta imprime se o tempo de cada frase faz sentido; se uma
  frase ficou com tempo absurdo, peça uma gravação com as pausas mais marcadas.
- **Voz de IA:** a chave é a mesma das vozes do EditOS: `KIE_API_KEY` no `sistema/kit/.env` (ou no ambiente, ou num
  `sistema/.env`). Nunca vai pro repositório, nunca é pedida pela conversa nem escrita em outro arquivo. Cada geração
  gasta créditos: avise antes e gere uma vez só por versão da fala. O modelo é o Gemini TTS da kie.ai, como no
  `kit/voz_gemini.py`.
- Nunca diga que a voz é de uma pessoa real, e não imite a voz de ninguém.

## 2D, 3D leve, 3D edição e 3D Blender

- **2D:** desenho plano, feito no próprio motor.
- **3D leve** e **3D edição** (marcados no `INDICE.md`): profundidade feita no próprio motor, com `Palco3D`, `Plano`
  ou a projeção do estilo. Sem programa extra.
- **3D Blender** (o 3D de bloquinho, skill `anim-3d-bloquinho`): só com o Blender instalado. Passo a passo em
  `animacoes/blender/GUIA.md`; a cena mora em `oficina/<pasta>/cena3d.py` e roda pela trava. O "3D como funciona" e
  o low poly toon do EditOS são outros caminhos (`sistema/modelos/3d-como-funciona/` e `/estudio-3d`).

## Se der errado

| O que aconteceu | O que fazer |
|---|---|
| "Cannot find module" de `remotion` ou `@remotion/...` | falta o motor do estúdio: `npm install` dentro de `sistema/` (pela trava) |
| As fotos ou o render dizem que o código não montou | `cd animacoes && npx tsc --noEmit -p .`, corrija o erro que ele aponta e tente de novo |
| "Não achei o vídeo" | a pasta precisa estar em `oficina/` com o `roteiro.md` que tem a linha `- **Estilo:**` |
| O vídeo pisca ou muda sozinho de um quadro pro outro | tem `Math.random()`, `Date` ou estado no código: troque por `acaso()` e por valores calculados de `t` |
| A legenda está fora de hora | a fala mudou depois da voz: rode a voz de novo |
| Uma letra não aparece ou sai com outra cara | a fonte do estilo não carregou: confira a internet e tire a foto de novo |
| "trava ocupada, esperando..." | outro render está na fila; ele espera sozinho. Não rode pesado fora da trava |
| O render terminou mas a entrega falhou | o vídeo está em `out/final.mp4`; veja o perfil ativo (`tools/perfil.py`) e rode `tools/entregar.py oficina/<pasta> oficina/<pasta>/out/final.mp4` |

## Sobre o motor

O Remotion é gratuito pra pessoas e empresas de até 3 funcionários; empresas maiores precisam da licença deles
(remotion.dev/license). As fontes vêm do Google Fonts na hora do render: precisa de internet.
