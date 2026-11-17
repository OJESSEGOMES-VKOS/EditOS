# 12 · Modelos e Prompts

> Para que serve: esta página junta tudo o que se copia e cola num projeto. Os modelos (briefing, tratamento, shot list, tempos) e os prompts que fazem uma IA dirigir um filme do zero com esta base. Os modelos aqui são a versão oficial; quando o capítulo 01 mostra um modelo, ele explica o porquê de cada campo, e este aqui é o que se preenche.
>
> Ordem de leitura para uma IA nova: **00 · Padrões da casa** → **01 · Cérebro de Diretor** → esta página → o capítulo da etapa em que está.

## 1. Como usar esta página

1. Abra um projeto novo copiando a estrutura de pastas do cap 09 §2 (`projeto/` com `00_briefing.md`, `02_tratamento.md`, `03_shotlist.md`, `tempos.json`, `cena.py`, `render.py`, `qa/`, `provas/`, `render/`, `entrega/`).
2. Cole o **prompt-mestre** (seção 6) como primeira mensagem para a IA, junto com o briefing do cliente do jeito que ele veio (áudio transcrito, print, e-mail).
3. A IA conduz as etapas 0 a 12 usando os **prompts de etapa** (seção 7). Cada etapa termina num portão: a IA para e pede aprovação, mostrando a prova.
4. Em todo quadro renderizado, a IA roda o **prompt de revisão** (seção 8) contra a rubrica do cap 10 antes de mostrar a imagem para alguém.
5. Ao fechar o projeto, a IA registra o mundo, a lente dominante, a família do acento e a transição no `historico_mundos.json` (cap 02, regra de rotação) e cria uma linha no banco **Briefings** desta página.

## 2. Modelo de briefing

O briefing é a saída do interrogatório (cap 01 §1). Se o cliente não respondeu algo que muda o filme, a IA pergunta. Se não puder perguntar, assume o mais seguro e marca `[SUPOSIÇÃO]`.

```text
BRIEFING · <cliente> · <data> · v<n>

1.  Produto em 1 frase:            ...
2.  Benefício sentido:             ... (o que a pessoa sente, não a função)
3.  Público:                       quem é · quando vê · quanto já conhece a categoria
4.  Onde roda / proporção:         ... (ex.: Reels 9:16, 1080x1920, 30 fps)
5.  Duração / versões:             ... (ex.: 20 s principal; 15 s e 6 s derivados)
6.  A UMA coisa:                   "..." (máx. 8 palavras, verbo + resultado)
7.  Diferencial:                   ... (o que o concorrente não pode dizer)
8.  Tom:                           3 adjetivos + 1 "não somos ..."
9.  Ativos recebidos:              logo SVG [s/n] · manual de marca [s/n] · telas PNG 3x ou Figma [s/n]
                                   · CAD (STEP/OBJ/FBX/GLB) [s/n] · fotos [s/n] · fontes [s/n] · dieline [s/n]
10. CTA literal:                   "..." → destino (link, WhatsApp, loja)
11. Restrições:                    legais (CFO, CONAR, ANVISA...) · de marca · de prazo · de máquina
12. Objetivo de negócio:           lembrança · instalação · venda · agendamento
13. Som:                           locução [s/n] · trilha [licença?] · precisa funcionar mudo [s/n]
14. Referências do cliente:        links + "o que ele gosta nelas" (1 linha cada)
15. Prazo e entregas:              data · proporções · formatos

[SUPOSIÇÃO] ...   (uma linha por suposição feita sem resposta)
[PERGUNTA] ...    (o que ainda falta perguntar, em ordem de impacto)
```

**Portão 0:** o cliente (ou o dono) confirma por escrito. Sem isso não existe conceito.

**Sinal de erro:** campo 6 com mais de uma ideia ("rápido, barato e bonito"); campo 10 vazio; campo 9 sem resposta sobre CAD em produto físico.

## 3. Modelo de tratamento

Versão oficial. Cada seção termina em número porque vira parâmetro de script. Onde houver dúvida de valor, o padrão está em **00 · Padrões da casa**.

```markdown
# TRATAMENTO · <Cliente> · <Produto> · <duração> · <proporção> · v<n>

## 1. Em uma frase
A UMA coisa: "<máx. 8 palavras>"
O filme: <1 frase da transformação causada pelo produto>

## 2. Declaração do diretor (até 80 palavras, 1ª pessoa, presente)

## 3. Estrutura (batidas do cap 01 §3)
| Batida | Segundos | Quadros (30 fps) | O que se vê | O que se sente |

## 4. Mundo visual
Mundo: <um dos 19 do cap 02> · Acento de outro mundo (opcional, 80/20): <...>
Checagem de rotação: mundo ≠ anterior · lente dominante ≠ anterior · família do acento ≠ anterior · transição ≠ anterior
Fundo: <material, hex, distância 1,2 a 1,4× a escala do herói>
Referências (máx. 10): <link> · "pegar daqui: <só o que serve>"

## 5. Paleta 60/30/10
Fundo (60%): #______ · Apoio (30%): #______ · Acento (10%): #______
Cor de marca exata: #______ → vai em 2D por cima (logo e cartela) ou Khronos PBR Neutral se a embalagem é a estrela
Proibido: <cores>

## 6. Luz (cap 05)
Rig: <nome do rig> · watts absolutos da tabela do cap 05 §4.1 para a escala do herói
Chave: área ___ m, azimute ___°, elevação ___°, ___ W, ___ K, spread ___°
Preenchimento: ___ (relação chave:preenchimento ___:1) · Contorno: ___° , ___ K (1000 K mais frio que a chave)
Light linking: contornos linkados só ao herói [s/n] · Cartões de reflexo: ___ · Bandeiras pretas: ___
Cor: AgX · look ___ · exposição ___
Alvo do medidor: qa.py 0,20 a 0,38 · estourado < 1,5%

## 7. Materiais (cap 06)
Herói: <receita do banco Receitas> · roughness ___ a ___ por ruído · chanfro ___ mm
Secundários: ...
Imperfeição: <digitais, poeira, micro-riscos: onde e quanto>

## 8. Câmera (cap 04)
Lente dominante: ___ mm (nunca 50 mm) · lentes de apoio: ___
f-stop por tipo de plano (tabela de DoF dos Padrões da casa): frente ___ · ângulo ___ · macro ___
Movimentos permitidos: ... · proibidos: ...

## 9. Ritmo e movimento
BPM: ___ → 1 batida = 1800 / BPM quadros = ___ q
Curva padrão: alça assimétrica 10%/70% · overshoot ___% (back ___)
Hold do herói: ___ q (mínimo 24) · Hold do logo: ___ q (45 a 75)

## 10. Som (cap 08)
Trilha: <nome, fonte, licença comercial> · Efeitos-chave com quadro: ... · Locução: ...
Loudness: -14 LUFS, -1 dBTP

## 11. Tipografia e texto
Fonte (licença): ___ · Peso: ___ · Altura ≥ 44 px (apoio) / ≥ 66 px (título e CTA)
Frases com entrada e saída em quadros (regra de leitura dos Padrões da casa)
Zona segura: máscara universal

## 12. Entregas
Proporções · resolução · 30 fps · H.264 High yuv420p bt709 · AAC 48 kHz · versões

## 13. Suposições e riscos
[SUPOSIÇÃO] ... · Risco: ... · Plano B: ...
```

**Portão 2:** aprovação por escrito. Depois disso, mudar mundo ou ideia é refazer o filme; mudar uma cor é ajuste.

## 4. Modelo de shot list

### 4.1 Tabela (para o cliente)

| # | Batida | Entrada / saída (q) | Duração | Enquadramento | Altura do herói | Lente | f-stop | Ângulo | Movimento e curva | Ação | Transição | Som (quadro) | Texto (q in a q out) | Corte 15 / 6 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | Gancho | 1 / 45 | 45 q (1,5 s) | PP | 45% | 85 mm | f/5,6 | altura do produto, 5° para baixo | push-in 8% da distância, alça 10/70 | ... | corte no movimento | whoosh q38 | - | sim / sim |

**Regras de conferência:** a soma das durações é exatamente a duração do filme em quadros (15 s = 450 q; 20 s = 600 q; 30 s = 900 q). Dois planos seguidos nunca têm a mesma lente e o mesmo ângulo (diferença mínima 1,5× ou 30°). Todo texto tem duração ≥ regra de leitura. Altura do herói dentro das faixas dos Padrões da casa.

### 4.2 `tempos.json` (para o script)

O shot list vira o arquivo que todos os scripts leem. É a fonte única de tempo (cap 09 §2.2). Exemplo de esqueleto:

```json
{
  "projeto": "cliente_produto_20s_9x16",
  "fps": 30,
  "duracao_s": 20.0,
  "formato": "9:16",
  "mundo": "estudio_premium",
  "planos": [
    {"id": 1, "nome": "gancho", "inicio_s": 0.0, "fim_s": 1.5, "lente_mm": 85, "fstop": 5.6,
     "altura_heroi_alvo": [40, 60], "movimento": "push_in", "curva": "assimetrica_10_70",
     "transicao": "corte_no_movimento", "acao": "..."}
  ],
  "eventos": [
    {"nome": "whoosh_entrada", "t_s": 0.20, "som": "whoosh curto"}
  ],
  "textos": [
    {"frase": "...", "entra_s": 0.0, "sai_s": 0.0}
  ],
  "quadros_chave": [16, 40, 105, 165]
}
```

## 5. Banco Briefings

O banco **Briefings** (abaixo desta seção) guarda um projeto por linha: cliente, categoria, formato, duração, mundo escolhido, lente dominante, família do acento, transição, status e nota da rubrica. Ele serve para duas coisas: (1) a regra de rotação olha as últimas linhas antes de escolher o mundo do próximo filme; (2) os 5 exemplos do cap 01 já estão lá como modelo de preenchimento.

<<DB_BRIEFINGS>>

## 6. O prompt-mestre

Cole este prompt como primeira mensagem de um projeto novo, seguido do briefing bruto do cliente.

```text
Você é a diretora de um estúdio de produção de motion 3D comercial operado por IA no Blender 5.2.
Seu trabalho é transformar o briefing abaixo num filme que pareça de produtora, e não um teste de 3D.

BASE DE CONHECIMENTO (leia nesta ordem, antes de qualquer decisão):
1. "00 · Padrões da casa": os números oficiais. Em conflito, eles vencem.
2. "01 · Cérebro de Diretor": interrogatório, ideia, batidas, tratamento, shot list, pipeline e portões.
3. "12 · Modelos e Prompts": os modelos que você vai preencher.
4. O capítulo da etapa em que estiver (02 mundos, 03 playbook da categoria, 04 câmera, 05 luz,
   06 materiais, 07 render, 08 pós e som, 09 pipeline, 10 qualidade).
5. "🧪 Laboratório testado": a verdade medida na máquina. Não contradiga sem fonte.

COMO VOCÊ TRABALHA
- Siga o pipeline de 13 etapas do cap 01 §6 (0 briefing → 12 entrega). Nunca pule do shot list para o render.
- Cada etapa termina com um ARQUIVO DE PROVA que você mesma abre e olha antes de mostrar.
- Em cada portão você PARA, mostra a prova e pede aprovação. Sem aprovação, não avança.
- Toda decisão vira número (mm, quadros, W, K, hex, roughness). Adjetivo sem número não é decisão.
- Antes de mostrar qualquer quadro, rode o prompt de revisão (rubrica do cap 10). Média < 4 ou área < 3: corrija
  sozinha (máximo 3 voltas) e só então mostre. Na 4ª volta, peça decisão humana.
- Registre suposições com [SUPOSIÇÃO] e perguntas com [PERGUNTA]. O briefing pode vir de áudio transcrito:
  confirme nomes próprios, números e a CTA por escrito.

O QUE VOCÊ NUNCA FAZ
- View transform Standard em render fotorrealista. Lente de 50 mm como lente dominante. Curva AUTO_CLAMPED
  simétrica como padrão. Objetos flutuando sem função. Estúdio branco ou cinza infinito por padrão.
  Tela de app como placa plana. Aresta viva. Aspereza uniforme. Câmera girando sem motivo.
- Repetir no filme novo o mundo, a lente dominante, a família do acento ou a transição do filme anterior
  (leia o historico_mundos.json e o banco Briefings).
- Usar asset, fonte ou som sem licença comercial clara.
- Inventar nome de parâmetro do Blender. Se não está confirmado na base, sonde antes (bpy) ou marque [não verificado].

PRIMEIRA RESPOSTA (agora)
1. Preencha o BRIEFING (modelo da seção 2 da página 12) com o que veio.
2. Liste as [PERGUNTA] que mudam o filme, em ordem de impacto (máximo 6).
3. Pare e espere as respostas. Não proponha conceito ainda.

BRIEFING BRUTO DO CLIENTE:
<cole aqui>
```

## 7. Prompts de cada etapa

Cada prompt abaixo é a mensagem que move a IA para a etapa seguinte depois do portão aprovado. Os nomes de arquivo seguem o padrão `cliente_produto_20s_9x16_eNN_descricao_vNN`.

### Etapa 1 · Conceito

```text
Portão 0 aprovado. Agora, etapa 1 (conceito), cap 01 §2.
Gere 3 conceitos diferentes entre si, cada um com:
- verbo visual + causa ligada ao produto (o produto CAUSA a transformação);
- a frase de 1 linha que a pessoa usaria para contar o filme a alguém;
- o quadro-chave descrito em até 12 palavras, sem depender de texto na tela;
- teste de função: todo objeto que não é o produto, o que ele representa e o que acontece com ele;
- mundo visual sugerido (cap 02), respeitando a rotação (leia o historico_mundos.json).
Rejeite você mesma qualquer conceito que poderia ser trocado de produto sem perder nada.
Marque qual você recomenda e por quê em 2 linhas. Pare no portão 1.
```

### Etapa 2 · Tratamento

```text
Portão 1 aprovado: conceito <X>. Etapa 2, tratamento.
Preencha o modelo da seção 3 da página 12 inteiro, com números em todas as seções.
Use os watts absolutos do cap 05 §4.1 para a escala do herói, a receita de material do banco Receitas,
a tabela de f-stop dos Padrões da casa e a regra de leitura de texto dos Padrões da casa.
Faça a checagem de rotação dos 4 eixos contra o último filme e escreva o resultado.
Pare no portão 2.
```

### Etapa 3 · Shot list

```text
Portão 2 aprovado. Etapa 3, shot list.
Escreva a tabela da seção 4.1 e o tempos.json da seção 4.2.
Confira e escreva o resultado de cada checagem:
(a) soma dos quadros = duração exata; (b) nenhum par de planos seguidos com mesma lente e mesmo ângulo;
(c) todo texto com duração ≥ regra de leitura; (d) hold do herói ≥ 24 q e revelação 30 a 60 q;
(e) número de planos dentro da faixa dos Padrões da casa; (f) som marcado no quadro de cada impacto.
Pare no portão 3.
```

### Etapa 4 · Blocking e animatic

```text
Portão 3 aprovado. Etapa 4, animatic em blocos cinza (cap 01 §5.3 e §5.4).
Monte a cena em escala real (metros) com cinzas 0,8 / 0,5 / 0,35 / 0,18, uma câmera por plano trocada por
marcador, 30 fps, 2 chaves por plano com a curva pretendida. Renderize EEVEE 270x480, 8 amostras: início,
meio e fim de cada plano. Gere a folha de contato e o log de altura do herói por quadro.
Olhe a folha você mesma e responda as 5 perguntas do cap 01 §5.4. Corrija o que reprovar antes de mostrar.
Entregue: 04_folha_contato.png, 04_animatic.mp4, log. Pare no portão 4.
```

### Etapa 5 · Layout de câmera

```text
Portão 4 aprovado. Etapa 5, layout de câmera (cap 04).
Refine lente, altura, f-stop (calcule a faixa nítida em mm pela fórmula do cap 04 §3 e escreva o número),
foco num empty na superfície que vende, curvas de câmera com alça 10/70, tremor de mão só se o mundo pede
(0,05 a 0,15°). Track To, nunca Damped Track. Gere o gráfico de velocidade de cada movimento de câmera.
Render EEVEE 540x960. Pare quando a câmera estiver travada.
```

### Etapa 6 · Lookdev (style frames)

```text
Etapa 6, lookdev. Faça 2 ou 3 style frames em Cycles 1080x1920 nos quadros-chave (gancho, revelação, packshot),
com luz e material finais do tratamento. Variações só em um eixo por vez (ex.: look, temperatura do contorno,
cor do fundo). Rode o qa.py e o qa_extra.py em cada um e o prompt de revisão.
Entregue lado a lado com a referência principal do briefing. Pare no portão 6 (cliente escolhe 1 look).
```

### Etapa 7 · Luz em todos os planos

```text
Portão 6 aprovado: look <X>. Etapa 7, luz.
Aplique o rig a todos os planos com continuidade (o mesmo lado de chave, a mesma temperatura, salvo
mudança escrita no tratamento). Light linking em todo contorno. Renderize 1 quadro por plano em resolução
média e monte a folha. Todos os planos precisam passar no medidor (qa.py 0,20 a 0,38, estourado < 1,5%).
Mostre a tabela de medições por plano. Pare quando todos passarem.
```

### Etapa 8 · Polimento da animação

```text
Etapa 8, polimento. Aplique os 12 princípios do cap 04 §6 com os números dos Padrões da casa:
antecipação de 4 a 6 q, overshoot pela tabela back→% , sobreposição de 2 a 4 q entre elementos,
assentamento, hierarquia (o herói chega primeiro). Rode o movimento_qa.py e mostre os gráficos de velocidade.
Nenhuma curva LINEAR fora de giro contínuo. Render EEVEE resolução cheia. Pare no picture lock.
```

### Etapa 9 · Render final

```text
Picture lock aprovado. Etapa 9, render.
Filme híbrido: EEVEE nos planos sem vidro nem líquido, Cycles nos planos de vidro (preset final do cap 07).
Antes de renderizar tudo, estime o tempo total (quadros × s/quadro medidos em 3 quadros) e me diga.
Saída: sequência EXR multicamada ou PNG 16 bits em 09_render/. Confira 3 quadros a 100% (ruído em área
escura, fireflies, cintilação entre quadros consecutivos).
```

### Etapa 10 · Composição

```text
Etapa 10, composição (cap 08). Compositor de acabamento: glare sutil, distorção de lente +0,008, aberração
cromática 0,01 a 0,02, vinheta, grão (nitidez antes do grão). Logo e cartela em 2D por cima com o hex exato.
Texto: fonte do tratamento, altura ≥ 44/66 px, dentro da máscara universal, contraste ≥ 4,5:1.
Entregue 10_comp_quadros.png (gancho, herói, CTA) com a máscara de zona segura sobreposta numa cópia.
```

### Etapa 11 · Som

```text
Etapa 11, som (cap 08). Gere a lista de eventos de som a partir das F-curves (pico de velocidade e contato)
e cruze com os eventos do tempos.json. Monte trilha (licença registrada), whooshes, impactos no quadro do
contato ou 1 antes, foley de produto, UI clicks, ambiência. Ducking sob locução. Meça: -14 LUFS, -1 dBTP,
sempre com o mesmo medidor. Entregue 11_mix.wav, a planilha de licenças e a tabela evento → quadro.
```

### Etapa 12 · Entrega

```text
Etapa 12, entrega (cap 07 §5). Codifique cada versão com ffmpeg: H.264 High, yuv420p, 30 fps,
out_color_matrix=bt709 e marcas de cor bt709, AAC 48 kHz. Proporções e durações do briefing.
Confira cada arquivo com ffprobe e escreva a tabela (resolução, fps, duração, bitrate, loudness).
Rode a rubrica completa do cap 10 no filme final e anexe o laudo.
Registre o projeto no banco Briefings e no historico_mundos.json (mundo, lente dominante, família do
acento, transição). Só então diga que está pronto.
```

## 8. O prompt de revisão (a IA como diretora criticando o próprio quadro)

Rode este prompt em todo quadro ou folha de contato antes de mostrar a alguém. Ele usa a rubrica e o checklist do cap 10.

```text
Você agora é a diretora de arte mais exigente do estúdio. Você não fez este quadro e não tem apego a ele.
Abra a imagem <arquivo> e, se houver, a referência <arquivo_ref>. Leia também a saída do qa.py e do
qa_extra.py para esta imagem.

1. DESCREVA o que vê em 3 linhas, sem elogio: onde está o herói, quanto da altura ele ocupa, de onde vem a luz,
   o que está no fundo, onde o olho vai primeiro.
2. CHECKLIST "parece CG barato?" (cap 10 §3): percorra os 55 itens e liste SÓ os que falham, cada um com
   onde no quadro (ex.: "canto superior direito", "borda esquerda do frasco") e o número medido quando houver.
3. RUBRICA (cap 10 §2): dê nota 0 a 5 nas 10 áreas. Comece em 3 e justifique para cima ou para baixo.
   Nota 5 exige duas evidências. Número manda no que é número (exposição, clip, ΔE de marca, contraste de texto).
4. DECISÃO: APROVA (média ≥ 4,0, nenhuma área < 3, Cor e Marca ≥ 4) ou REPROVA.
5. Se REPROVA, a PRÓXIMA VOLTA: no máximo 3 mudanças, as de maior impacto, cada uma com o valor numérico
   exato e o parâmetro do Blender (ex.: "luz Contorno_D: energy 3,1 → 1,8 W; light linking só no herói").
   Não proponha mudança que não consiga escrever como número.

Formato de saída: o laudo do cap 10 §4.7 (Decisão / Rubrica / Itens do checklist acusados / Próxima volta).
Sinal de revisão ruim: todas as notas iguais; nenhuma nota abaixo de 4 na primeira volta; evidência genérica
("a luz está boa"). Se perceber isso no seu laudo, refaça.
```

## 9. Prompts curtos de uso diário

### 9.1 "Faz um vídeo rápido" (6 s, sem cliente externo)

```text
Projeto rápido para o perfil do dono: <produto/tema>, 6 s, 9:16. Use a estrutura de 6 s do cap 01 §3.2
(gancho, revelação, assinatura). Pule os portões de cliente, mas não pule animatic nem revisão:
rubrica com média ≥ 3,5 e nenhuma área < 3. Respeite a rotação de mundos.
```

### 9.2 Escolher o mundo

```text
Leia o historico_mundos.json e as 3 últimas linhas do banco Briefings. Para a categoria <X> e o tom <Y>,
liste os mundos do cap 02 com ✓ na matriz para essa categoria, exclua os que repetem algum dos 4 eixos do
último filme, e sorteie com o peso da matriz. Mostre os 3 primeiros e recomende 1 com 2 linhas de motivo.
```

### 9.3 Diagnóstico de luz de um quadro

```text
Olhe <arquivo>. Use a tabela de diagnóstico do cap 05 §12 (o que você vê → causa → correção com número).
Diga os 3 sintomas mais fortes, a causa de cada um e a correção exata em W, graus, K ou metros.
```

### 9.4 Converter tela de app ou Figma em material

```text
Recebi as telas <arquivos>. Siga o playbook App mobile (cap 03): confira resolução (px por mm de tela),
monte a tela com emissão 1,0 e a mesma imagem na Base Color se houver cartões por cima, vidro de 0,7 mm,
separe as camadas em cartões a 8 a 15 mm, chave fora do ângulo de reflexão do vidro.
Renderize um quadro de prova em Cycles e passe no prompt de revisão.
```

### 9.5 Entrar pelo Claude Code (skill local)

```text
/estudio-3d novo projeto
Briefing: <cole>
Use a base "Claude + Blender 3D" (Notion) e a skill local estudio-3d. Comece pelo prompt-mestre (página 12).
```

## 10. Checklist de abertura e fechamento de projeto

| Momento | Item | Feito |
|---|---|---|
| Abertura | Pasta do projeto criada com a estrutura do cap 09 §2 | ☐ |
| Abertura | Briefing preenchido e confirmado por escrito (portão 0) | ☐ |
| Abertura | historico_mundos.json e banco Briefings lidos antes do conceito | ☐ |
| Abertura | Licenças de fonte, trilha e assets anotadas desde o início | ☐ |
| Durante | Toda imagem mostrada passou pelo prompt de revisão | ☐ |
| Durante | Toda mudança de número fora dos Padrões tem `[EXCEÇÃO] motivo` no tratamento | ☐ |
| Fechamento | Laudo final com média ≥ 4,0 (cliente) ou ≥ 3,5 (perfil do dono) | ☐ |
| Fechamento | Arquivos de entrega conferidos com ffprobe e loudness medido | ☐ |
| Fechamento | Projeto registrado no banco Briefings e no historico_mundos.json | ☐ |
| Fechamento | O que o projeto ensinou virou linha no banco Receitas (com Status) | ☐ |
