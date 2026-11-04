# EditOS

**Você grava. O assistente edita.**

Você grava um vídeo no celular, escolhe um dos 19 modelos de edição e pede. O assistente (Claude Code ou Codex) entrega o vídeo pronto, com legenda, cortes, telas animadas e som. Você não precisa saber editar.

Criado por **Jessé Gomes ([@OJESSEGOMES](https://instagram.com/ojessegomes))**.

---

## Como funciona, em 4 passos

### 1. Instale (só na primeira vez)
O EditOS vem em duas versões. O motor é o mesmo; muda só se vem com os modelos de edição prontos:

| | 🎬 **Completo** | 🧱 **Cru** |
|---|---|---|
| O que vem | o sistema + os 19 modelos prontos + os 46 estilos de cena | o sistema + os 46 estilos de cena, sem nenhum modelo |
| Para quem | quer editar já, nos estilos prontos | quer criar os próprios estilos do zero (`/criar-modelo`) |

Abra o **Claude Code** ou o **Codex** numa pasta vazia do seu computador e cole a frase da versão que você quer:

**Completo:**
> Instale o EditOS seguindo https://github.com/OJESSEGOMES-VKOS/EditOS/blob/main/PREPARAR.md

**Cru:**
> Instale o EditOS na versão cru seguindo https://github.com/OJESSEGOMES-VKOS/EditOS/blob/main/PREPARAR.md

Prefere baixar na mão? Os dois estão em [Releases](https://github.com/OJESSEGOMES-VKOS/EditOS/releases/latest): `EditOS-completo.zip` e `EditOS-cru.zip`.

Pronto. O assistente instala tudo sozinho e pede a sua permissão antes de cada programa.
⏱️ Leva de 20 a 40 minutos · 💾 ocupa uns 10 GB

> Precisa ser o aplicativo ou a linha de comando (o ChatGPT no navegador não serve, porque ele não consegue rodar nada no seu computador).

### 2. Apresente-se
Na primeira conversa, digite **`/comecar`**. O assistente faz três perguntas rápidas: seu nome, seu @ e se você tem logo ou cores. Aí ele cria a **sua pasta**.

### 3. Grave
- Celular em pé, rosto de frente, boa luz.
- Sem música de fundo.
- No final, fique 1 segundo em silêncio.

Coloque o vídeo na pasta **`materiais`**, dentro da sua pasta.

### 4. Peça
Escreva do seu jeito, por exemplo:

> Edite meu vídeo gravacao.mp4 no pagina-de-livro

O vídeo pronto aparece na pasta **`conteudo`**. Não gostou de algo? Peça com as suas palavras ("deixa a legenda maior", "tira essa parte"). Cada ajuste vira uma nova versão (`v1`, `v2`, `v3`...), todas guardadas juntas.

---

## Onde fica cada coisa

```
EditOS/
├── Seu Nome/
│   ├── materiais/   📥 você coloca aqui: gravações, logo, cores, prints
│   └── conteudo/    📤 o vídeo pronto chega aqui
└── sistema/         ⚙️ o motor. Não precisa mexer
```

Você só usa as duas pastas com o seu nome. O resto é com o assistente.

**Tem mais de uma página ou cliente?** Digite **`/novoperfil`** e cada um ganha a própria pasta, com os materiais separados. Para trocar, diga "usar o perfil Fulano".

---

## Os 19 modelos (versão completa)

| 🙋 Com você aparecendo | 🎨 Sem ninguém na tela (só voz) | 📣 Anúncio |
|---|---|---|
| rosto-telas · youtube-didatico · autoridade · interface-encenada · trailer · prova-print · especialista · pregacao · pagina-de-livro · minidocumentario · imagem-por-palavra · corte-palestra | texto-e-objeto · motion-ouro · vetor-minimo · personagem · documental-dados | anuncio-canvas · anuncio-neon |

Os modelos `especialista`, `imagem-por-palavra`, `corte-palestra` e `documental-dados` ainda estão em prova: funcionam, mas seguem sendo refinados.

## Os 46 estilos de cena

Além do modelo, que é a cara do vídeo inteiro, cada trecho pode ganhar um estilo de cena (`cena01` a `cena46`): orbe de luz, manchete grifada, rota no mapa 3D, número com gráfico e outros. A lista está em `sistema/cenas/INDICE.md`, e cada um tem uma demo de 5 segundos. Peça, por exemplo: *"na frase 2, usa a cena15"*.

**Quer ver como cada um fica?** Peça: *"me mostra o exemplo do pagina-de-livro"*.

O seu vídeo sai **no estilo** do modelo, não uma cópia do exemplo. Telas e textos nascem do que você fala.

---

## Deixe com a sua cara

Corrigiu algo de que não gostou? O assistente pergunta se pode anotar, e a correção vale para os próximos vídeos. Seu nome, @, foto e a chamada do final também ficam salvos. Com o tempo, ele aprende o seu jeito.

---

## Dúvidas comuns

**Preciso saber programar?** Não. Você conversa em português normal.

**Preciso pagar o EditOS?** Não, ele é gratuito. Você só precisa de uma assinatura do Claude ou do ChatGPT para usar o assistente.

**Meu computador aguenta?** Precisa de uns 10 GB livres. Um computador mais fraco funciona também, só demora mais para gerar o vídeo.

**Deu erro, e agora?** Conte ao assistente o que aconteceu, com as suas palavras. Ele resolve.

---

<details>
<summary><b>Para quem é técnico</b></summary>

O Claude Code segue o `CLAUDE.md` da raiz e o Codex segue o `AGENTS.md` (mesmo texto, gerado da mesma fonte). A skill do orquestrador fica em `.claude/skills/` e em `.agents/skills/`. Os dois também seguem o arquivo de cada modelo, em `sistema/modelos/<modelo>/<modelo>.md`.

- Moldes Remotion: `sistema/moldes/` (veja `sistema/moldes/CONTRATO.md`)
- Ferramentas: `sistema/tools/`
- Vídeos em trabalho: `sistema/oficina/`
- Regras gerais: `REGRAS.md`
- Perfis: qualquer pasta da raiz com `perfil.md`. O ativo fica em `sistema/perfil-ativo` (`sistema/tools/perfil.py`).
- Entrega: `sistema/tools/entregar.py`, chamado no fim de cada molde. `SEM_ENTREGA=1` pula um rascunho.

Tudo fica dentro da pasta: ambiente Python, Remotion, modelos de IA, caches e arquivos temporários.
</details>

## Licença e créditos
Licença **Apache 2.0** (`LICENSE`). Você pode usar, modificar e redistribuir, inclusive comercialmente, **desde que mantenha o `NOTICE` e o crédito "EditOS por Jessé Gomes (@OJESSEGOMES)"** (veja `NOTICE`).

Ferramentas de terceiros, cada uma com a sua licença. O instalador baixa todas; nenhuma vem incluída aqui:
- **Remotion**: licença própria. É gratuita para pessoas físicas e empresas pequenas; empresas maiores precisam de uma licença da Remotion. Confira em remotion.dev/license antes de usar comercialmente.
- faster-whisper e os pesos do Whisper (MIT), OpenCV e o detector de rosto YuNet (Apache 2.0/MIT), LaMa (Apache 2.0), Robust Video Matting (GPL-3.0, baixado à parte e usado como arquivo de modelo), rembg (MIT).
- Fontes do Google Fonts (OFL), carregadas pelo `@remotion/google-fonts`.

Nenhum vídeo de terceiro vem aqui. A referência de cada modelo é o vídeo aprovado dele, feito pelo criador do estúdio com a própria gravação.
