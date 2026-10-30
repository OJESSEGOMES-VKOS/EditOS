# EditOS

Você grava, o assistente edita. O EditOS traz 14 **modelos de edição** prontos: você escolhe um, entrega a sua
gravação e o Claude Code ou o Codex edita o vídeo no estilo daquele modelo, com legenda, telas, cortes e som.

Criado por **Jessé Gomes ([@OJESSEGOMES](https://instagram.com/ojessegomes))**.

## 1. Instalar (uma vez só)
Abra o Claude Code **ou o Codex** numa pasta vazia e cole (a mesma frase vale para os dois):

> Instale o EditOS seguindo https://github.com/OJESSEGOMES-VKOS/EditOS/blob/main/PREPARAR.md

O assistente cuida de tudo e pede a sua licença antes de instalar cada programa. Leva de 20 a 40 minutos e ocupa uns
10 GB no computador.

O Codex tem que ser o aplicativo ou a linha de comando, com a conta do ChatGPT; o ChatGPT no navegador não serve, porque
o assistente precisa rodar programas no seu computador.

## 2. Gravar
- Celular em pé, rosto de frente, boa luz e sem música ao fundo.
- Deixe 1 segundo de silêncio depois da última frase.
- Nos modelos sem pessoa na tela, basta a narração em áudio.

## 3. Começar: a sua pasta
Na primeira conversa digite `/comecar` (ou só diga "quero começar"). O assistente te faz três perguntas, uma de cada
vez: o seu nome, o seu @ e se você tem logo, cores ou prints pra usar. Com isso ele cria a sua pasta:

```
EditOS/
├── <Seu nome>/
│   ├── materiais/   ← o que é oficial seu: logo, paleta, prints de resultado e as gravações
│   └── conteudo/    ← os vídeos prontos: uma pasta por vídeo, só com as versões v1.mp4, v2.mp4...
└── sistema/         ← o motor (modelos, ferramentas). Quem mexe aqui é o assistente, não você
```

Tem outra página, outro cliente ou outra pessoa usando o mesmo EditOS? Digite `/novoperfil` e dê o nome que quiser
(ex.: "Ana2", "Loja da Ana"): nasce outra pasta igual, com os materiais e os vídeos dela separados. Para trocar de
perfil, diga "usar o perfil X".

## 4. Editar
Coloque a gravação em `<Seu nome>/materiais/` e peça ao assistente, por exemplo:

> Edite meu vídeo gravacao.mp4 no storypodcast01

Ele faz o resto e o vídeo pronto chega em `<Seu nome>/conteudo/<nome-do-video>-DD-MM-AA/v1.mp4`. Se quiser mudar algo,
é só pedir com as suas palavras: cada ajuste vira uma versão nova (`v2.mp4`, `v3.mp4`...) na mesma pasta. Editou 10
vezes o mesmo vídeo? Continua sendo uma pasta só, com as 10 versões dentro. O assistente usa o logo, as cores e os
prints da sua pasta `materiais/`, nunca os de outro perfil.

## 5. Deixar com a sua cara
Cada modelo tem um arquivo em `sistema/modelos/<modelo>/<modelo>.md`. No topo dele fica a seção **"Do seu jeito"**: escreva
ali o seu nome e @, a sua foto, a chamada do fim e o que você gosta ou não quer. O assistente lê isso antes de cada vídeo.
Quando você corrigir algo, ele oferece anotar ali para os próximos.

## Os modelos
Para ver como cada um fica, abra `sistema/modelos/<modelo>/referencia/original.mp4`.

| Com você na tela | Sem pessoa na tela |
|---|---|
| modelodinamico01, modelopadrao01, modelodinamico03, pregacaodinamica01, profissional01, storypodcast01, superpodcast01, youtubeedition01 | modelodinamico02, ilustrations01, sofistmotion01, anunciomotion01, anunciocanvas01, youtubedark01 |

O vídeo sai no estilo do modelo, não uma cópia do exemplo: as telas e os textos nascem da sua fala. Como a gravação é
outra, o resultado fica parecido com o exemplo, não idêntico.

## Para quem é técnico
O Claude Code segue o `CLAUDE.md` da raiz e o Codex o `AGENTS.md` (mesmo texto, gerado da mesma fonte); a skill do orquestrador fica em `.claude/skills/` e `.agents/skills/`; os dois seguem também o arquivo de cada modelo. O motor fica em `sistema/`: os moldes Remotion
em `sistema/moldes/` (`sistema/moldes/CONTRATO.md`), as ferramentas em `sistema/tools/` e os vídeos em trabalho em
`sistema/oficina/`; as regras gerais em `REGRAS.md`. Perfis: qualquer pasta da raiz com `perfil.md`; o ativo fica em
`sistema/perfil-ativo` (`sistema/tools/perfil.py`). A entrega de cada versão é feita por `sistema/tools/entregar.py`,
chamado no fim de cada molde (`SEM_ENTREGA=1` pula um rascunho). Tudo fica dentro da pasta:
ambiente Python, Remotion, modelos de IA, caches e temporários.

## Licença e créditos
Licença **Apache 2.0** (`LICENSE`). Você pode usar, modificar e redistribuir, inclusive comercialmente, **desde que
mantenha o `NOTICE` e o crédito "EditOS por Jessé Gomes (@OJESSEGOMES)"** (veja `NOTICE`).

Ferramentas de terceiros usadas (cada uma com a licença dela, instaladas pelo instalador, não incluídas aqui):
- **Remotion**: licença própria. Gratuita para pessoas físicas e empresas pequenas; empresas maiores precisam de uma
  licença da Remotion. Confira em remotion.dev/license antes de usar comercialmente.
- faster-whisper e os pesos do Whisper (MIT), OpenCV e o detector de rosto YuNet (Apache 2.0/MIT), LaMa (Apache 2.0),
  Robust Video Matting (GPL-3.0, baixado à parte e usado como arquivo de modelo), rembg (MIT).
- Fontes do Google Fonts (OFL), carregadas pelo `@remotion/google-fonts`.

Nenhum vídeo de terceiro vem aqui. A referência de cada modelo é o vídeo aprovado dele, feito pelo criador do estúdio
com a própria gravação.
