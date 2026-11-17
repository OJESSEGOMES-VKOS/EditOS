---
name: low-poly-toon
description: O motor 3D rápido do EditOS: low poly chapado com contorno, sombra em 3 degraus e céu em faixas, no EEVEE do Blender, 30 qps, ~0,5 s por quadro. Use quando pedirem "3D low poly", "3D de desenho", "3D mais rápido de renderizar", "no estilo do helicóptero" ou um lugar fixo pra uma página.
---

# low-poly-toon: o 3D chapado, rápido e reconhecível

Esta skill segue o método de `sistema/JEITO.md` (o jeito, não o clone). O código é `sistema/kit3d/` (porta neutra:
`lowpoly_kit.py`; o motor mora em `mentedetransbordo_kit.py`, a página onde ele nasceu, e as duas portas são o mesmo
módulo). Ele roda por cima do kit do modelo `3d-como-funciona` (`K`) e da biblioteca da skill `estudio-3d`. As
regras G de `REGRAS.md` §0 mandam acima desta skill; as regras de lógica física do `3d-como-funciona` valem aqui
inteiras.

## Quando usar

- Qualquer vídeo 3D em que o desenho conta mais que o realismo e o render precisa ser curto: o `3d-como-funciona`
  (é o motor padrão dele desde 2026-11-04), curiosidade, "se você estivesse...", história com personagem.
- Página que solta vídeo com frequência e quer **um lugar e uma pessoa fixos**, reconhecíveis vídeo após vídeo.
- Não é pra filme de produto (vidro, metal, líquido realista: `estudio-3d`), nem pra maquete clara de sombra macia
  (o `K.mundo_dia` do `3d-como-funciona`).

## A personalidade (com o porquê)

| Regra | Por quê | Quando sim / quando não |
|---|---|---|
| **Cor lisa e forte por peça, sem textura.** Toda cor sai de uma paleta (`PALETA`), nada de cor solta no código. | O desenho lê de longe e no celular; a paleta é o que faz dois vídeos parecerem da mesma página. | Sempre. Página nova ganha a própria paleta (ver a invenção). |
| **Sombra em 3 degraus:** sombra fria (roxa à tarde, azul à noite), meio-tom e luz quente. Sol de sombra dura. | Os degraus são o "toon": volume claro sem o custo de luz realista. | Sempre no modo `toon`. O modo `workbench` existe, mas saiu mais lento e mais apagado no teste. |
| **Contorno escuro por casco invertido**, mais grosso longe (`contorno(..., ref=, d0=)`) pra manter a mesma espessura na tela. | Separa o herói do fundo e dá cara de desenho. | Pessoa e objeto de perto: fino (0,006). Árvore e cenário: grosso. |
| **Facetas à vista:** modelo CC0 passa por `molde()` (decimate + sombreado chapado). A **pessoa não** passa pelo decimate. | A faceta é o estilo; decimar a mão quebra os dedos em cacos. | Cenário e objeto: decimate 0,3 a 0,6. Pessoa: 1,0. |
| **Céu em faixas e névoa pela distância.** | Profundidade sem custo, e o fundo fica quieto atrás do herói. | Clima `tarde` (mata) ou `noite` (casa). Clima novo: ver a invenção. |
| **Só a sombra de contato:** as copas não jogam manchas no chão; o que fica é a sombra embaixo da pessoa e dos objetos. | As manchas grandes viravam ruído em primeiro plano; a sombra de contato é o que põe o pé no chão. | Sempre. |
| **Todos os quadros, 30 qps fluido.** Sem motion blur, AO, raytracing, volume ou desfoque. | O dono escolheu o fluido ("é mais gostoso de assistir"); o resto encarece sem somar ao desenho. | "De dois em dois" só como efeito pedido de propósito. |
| **Um lugar fixo por página** (a região), montado por código e sempre igual (semente fixa), com pontos marcados que todo vídeo pode usar. | A página fica reconhecível e cada vídeo só cuida de poses, história e câmera. | O lugar é da página, não do motor: outra página tem outro lugar. |
| **Cartoon sem rosto, sem sangue, sem dor.** | O tom é curiosidade leve; o tombo é engraçado, não sofrido. | Sempre. Pessoa sem rosto: olho e sobrancelha na cor da pele (`_COR_PESSOA['eye'] = 'pele'`). |

Conta de referência (RTX 3050 Laptop): ~0,5 s por quadro, 90 s de vídeo em ~12 a 24 min de render, a cena monta em
menos de 2 s. Outra placa: meça um quadro antes de prometer prazo.

## As peças (`import lowpoly_kit as LP`, depois `LP.K = K`)

| Peça | O que faz |
|---|---|
| `estilo(sc, 'toon', clima)` | liga o motor e o look; chame antes de criar qualquer material |
| `mat(cor, unico=False)`, `mat_luz(cor, forca)`, `cor_em(m, [(t, cor)])` | cor chapada nos degraus; cor que brilha (fogo, janela à noite); cor que muda no tempo |
| `brilha(objs, cor, t0, t1)` | o "Esse é o [nome]" no toon: pisca 2 vezes em amarelo-claro, fica claro até t1 e volta (o `K.acende` não funciona no material chapado) |
| `molde(arquivo, tamanho, medida, razao, regra)` + `copia(malhas, nome, loc, rz, s)` | importa um CC0 uma vez, decima, pinta pela `regra` e espalha cópias leves |
| `contorno(objs, esp, ref, d0)`, `chapado(me)`, `juntar(objs)` | o contorno, o sombreado chapado, juntar peças numa malha |
| `pessoa_padrao(nome, loc, rot_z, mochila=)` | a pessoa CC0 na paleta, com esqueleto (anda com `K.anda`, troca ação com `K.troca_acao`) |
| `Pose`, `pose_em`, `senta`, `bracos`, `dedos`, `camada` | pose osso a osso em camadas por cima do Idle (sentar, alcançar, segurar) |
| `floresta(sc)`, `cozinha(sc)` | as duas regiões que já existem (a mata ao fim de tarde, a cozinha à noite): são exemplos de região |
| `celular`, `toco`, `relogio`, `panela`, `fogo` | objetos já no look (também exemplos) |
| `rodar(pasta, __file__, eventos)` | o portão: prévia no próprio look (4 amostras, 40%) e render só com checagem LIMPA; o selo cobre a cena, o kit3d e este motor |

Os modelos CC0 ficam em `sistema/kit3d-assets/` (origem e licença de cada um em `ORIGEM.md`). Faltando:
`.venv/Scripts/python.exe tools/baixar-assets-3d.py` (o essencial do motor) ou `--tudo`.

## A invenção (um lugar, um clima e um objeto que o motor ainda não tem)

O motor é o jeito; a mata e a cozinha são aplicações dele. Para uma página ou um assunto novo:

**Exemplo 1: uma praia ao meio-dia para uma página de curiosidades do mar.**
- Paleta: `LP.PALETA.update({'areia': '#F1D08A', 'mar': '#2FA7C8', 'mar2': '#1C7FA6', 'guarda_sol': '#E8553B'})`.
- Clima: `LP.CLIMAS['meiodia'] = {'degraus': ((0.42, 0.40, 0.62), (0.76, 0.74, 0.80), (1.10, 1.02, 0.92)),
  'nevoa': (40.0, 120.0, 0.4), 'amb': ('#8FB4D8', 0.40), 'sol': ((1.0, 0.97, 0.90), 3.6, (70, 0, -150)),
  'ceu': ['#BFE6F5', '#8FD0EE', '#5FB6E4', '#3D98D6', '#2C7CC4']}` e `LP.estilo(sc, 'toon', 'meiodia')` (sombra
  azulada, luz branca, sol alto: a sombra de contato fica curta e embaixo).
- Região: uma função `praia(sc)` no padrão da `floresta`: chão facetado de areia, faixa de mar como `K.sem_corpo`
  com ondas em forma (nunca plano liso), `molde('boat/...')` e pedras espalhados com `copia` por semente fixa, pontos
  marcados (o guarda-sol, o píer) em constantes. Contorno grosso no fundo, fino perto. Vai para o kit da página
  quando se repetir; até lá mora no `cena.py` do vídeo.

**Exemplo 2: um objeto que se explica (o freio de bicicleta).**
- Quadro, roda e pessoa: modelo pronto ou peça simples do K (`K.cilindro`, `K.bloco`) pintada com `LP.mat` e
  passada pelo `contorno`. A pinça, o cabo e a sapata são o mecanismo: feitos por código, com a forma real
  pesquisada, a sapata encostando de verdade no aro e a roda girando no sentido em que a bicicleta anda.
- O momento do nome técnico acende com `LP.brilha([sapata], PALETA['sapata'], t0, t1)` (o `K.acende` não serve
  no toon: ele mexe num nó que o material chapado não tem); a mudança de cor de calor na sapata é
  `LP.mat(..., unico=True)` + `LP.cor_em`.

Nos dois: cor nova entra na `PALETA` (nunca hex solto no meio da cena), o objeto pronto vem de CC0 e só o mecanismo
é código.

## O teste do clone

1. **Página nova não herda o lugar de outra página.** A mata ao fim de tarde, o aventureiro de mochila verde e a
   cozinha azul da noite são da página onde o motor nasceu: num perfil novo eles só aparecem se a fala pedir
   exatamente aquele lugar.
2. **Lado a lado com um vídeo do motor:** *é o mesmo motor?* (cor lisa, 3 degraus, contorno, céu em faixas, 30 qps)
   tem que ser **sim**. *É o mesmo vídeo?* (mesmo lugar, mesma pessoa, mesmos objetos, mesmos planos) tem que ser
   **não**, a não ser que seja a mesma página, onde o lugar fixo é a identidade e o resto muda.
3. Se o EditOS tiver `tools/clone.py`, rode `tools/clone.py oficina/<pasta>` e só siga com `SEM CLONE`.

## O caminho

1. Comece pela skill do formato (`3d-como-funciona` para explicar uma coisa): ela decide roteiro, voz e elos.
2. Cena: `cp moldes/3d-como-funciona/blender/cena_vazia.py oficina/<pasta>/cena.py` (já vem com `MOTOR = 'toon'`).
   Paleta, clima e região antes da primeira peça.
3. De dentro de `sistema/`: `B="$(.venv/Scripts/python.exe tools/blender.py)"` e
   `QUEM=3d sh tools/com-trava.sh "$B" -b --factory-startup -P oficina/<pasta>/cena.py -- previa 2 7 20`.
4. `-- checar` até LIMPA; cada junta mecânica de frente, de lado e de cima (≥ 480 px); prévias por elo em resolução
   cheia. Depois `-- eventos`, `-- render`, a montagem do formato e a entrega com `tools/entregar.py`.

## Pendências conhecidas do motor

- Os dedos não fecham em volta do objeto segurado (a mão lê "aberta segurando"): no close, prefira o objeto apoiado.
- A névoa laranja da tarde deixa as copas longe meio oliva.

## Nunca

- Nunca motion blur, AO, raytracing, volume ou desfoque nesse motor; nunca pular quadro sem pedido.
- Nunca decimate na pessoa.
- Nunca hex solto fora da `PALETA`; nunca material de outro motor misturado (a peça destoa dos degraus).
- Nunca boneco de primitivo no lugar de pessoa, bicho ou objeto que existe pronto em CC0.
- Nunca o lugar de outra página num perfil novo sem a fala pedir.
- Nunca render fora do `rodar` (sem checagem limpa) nem fora da trava.
