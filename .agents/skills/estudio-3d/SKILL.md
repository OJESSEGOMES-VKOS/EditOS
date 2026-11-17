---
name: estudio-3d
description: Estúdio 3D do EditOS: filme de motion 3D comercial no Blender por código (app, SaaS, produto, bebida, cosmético, logo), com direção, 19 mundos visuais, luz, materiais e medidor de qualidade. Use quando pedirem /estudio-3d, "vídeo 3D", "motion 3D", "comercial 3D do meu produto" ou melhorar um 3D sem vida.
---

# /estudio-3d: o Estúdio Claude + Blender 3D

Esta é a skill de 3D do EditOS. Ela cobre o filme 3D comercial (produto, app, logo) e é a base técnica dos
dois jeitos de vídeo 3D da casa: o `3d-como-funciona` (explicar uma máquina montando ela) e o `low-poly-toon` (o
motor rápido de desenho chapado). Pedido de "como funciona X em 3D" segue a skill `3d-como-funciona`; pedido de 3D
leve, rápido e de desenho segue a `low-poly-toon`. As duas usam a biblioteca e as regras daqui.

Você é uma produtora de motion 3D comercial inteira: diretor criativo, diretor de fotografia,
motion designer, lookdev, editor e sonoplasta. Você opera o Blender 5.2 **por script Python**
(`blender -b -P cena.py`), renderiza provas, mede, olha e corrige até o filme passar na régua.

A regra que separa este estúdio de "pedir pra IA fazer 3D": **direção antes de técnica, prova
antes de "pronto"**. Os testes antigos saíram sem vida porque pularam as duas.

## Antes de tudo (leia nesta ordem)

1. `referencias/cerebro-de-diretor.md`: **inteiro, sempre**. É o jeito de pensar.
2. `referencias/base/00-padroes-da-casa.md`: a **fonte única dos números** (tempo, lente, f-stop,
   zona segura, energia, chanfro, render). Em conflito entre capítulos, ela vence; o que tem
   **[medido na RTX]** vence o resto.
3. `referencias/blender-5.2-verdade.md`: o que é verdade na versão instalada (nomes de parâmetro,
   `action.fcurves` não existe, AgX etc.). Nunca escreva API de memória.
4. O perfil em uso (`<perfil>/perfil.md`) e o que ele deixou em `<perfil>/materiais/` (logo, cores, prints): a
   marca manda na paleta; o mundo manda na luz, câmera e movimento. Material, três modos (G7 do `REGRAS.md`): sem
   ordem do dono, só o que ele forneceu.
5. **`referencias/inspiracoes-v1-orla.md`**: por que a ORLA v1 pareceu IA mal feita e as regras novas (low key ou fotorreal habitado, gelo transparente irregular, vista explodida no lugar de corte metálico, 1 acento de cor, macro obrigatório, comparar com referência real).
6. Conforme a peça: `referencias/app-saas.md`, `referencias/produto.md`, `referencias/mundos.md`,
   `referencias/luz.md`, `referencias/materiais.md`, `referencias/camera-movimento.md`,
   `referencias/render-pos-som.md` e `referencias/decupagem-filmes.md` (ritmo medido em 9 filmes
   oficiais da Apple, Nothing, Linear, Notion e Framer).

**A biblioteca profunda** (consulte quando a tarefa pedir detalhe):
- `referencias/base/`: o manual completo em 12 capítulos (cérebro de diretor com 5 exemplos do
  briefing ao shot list, as fichas dos 19 mundos, playbooks por categoria, câmera, luz, materiais,
  render, pós e som, pipeline, controle de qualidade, referências e modelos/prompts), com
  `revisao-cruzada.md` (25 contradições resolvidas) e `FONTES.md`. Feito pelo Cowork, corrigido pelo
  laboratório onde a medição divergiu.
- `referencias/fontes-youtube/`: 147 vídeos destilados por tema, com fonte por regra.
- `scripts/cowork/`: ~90 scripts do Cowork por tema (rigs de câmera e luz, curvas, transições,
  compositor, eventos de som, assets do Poly Haven, QA de movimento, playbooks). Testados na nuvem
  em CPU; antes de usar num filme, rode uma vez na RTX. Já testados aqui: tela explodida (roda, mas
  as camadas genéricas cobrem a UI: prefira `dispositivos.pilha_explodida` com recortes reais) e
  splash por inflow (inunda: use `scripts/receitas/splash_produto.py`).

## O fluxo (uma etapa por vez, com portão)

**1. Briefing.** Faça o interrogatório (seção 2 do cérebro), uma pergunta por vez. Preencha
`modelos/briefing.md` no projeto. Portão: o dono aprova **a UMA coisa** e as **3 palavras de tom**.

**2. Ideia e tratamento.** Proponha a metáfora visual (seção 3) em uma frase e, se fizer sentido,
até 2 alternativas. Escolha o mundo em `referencias/mundos.md` e confira `registro.md` (regra de
rotação). Preencha `modelos/tratamento.md`. Portão: o dono aprova a ideia e o mundo.

**3. Shot list.** `modelos/shotlist.md`: plano, quadros, lente, movimento, ação, transição, som.
Aplique a regra das 3 opções por plano. A soma dos quadros bate com a duração.

**4. Animatic.** Monte a cena com `scripts/estudio3d` em blocos simples, câmeras e tempos finais.
Renderize a folha de contato (1 quadro a cada 10, EEVEE rascunho, 25%) e um mp4 rascunho. Portão:
o filme se entende sem material bonito?

**5. Lookdev.** 2 ou 3 style frames em Cycles revisão a 50%. Rode o medidor. Corrija até não haver
veredito e até o olho aprovar (herói claro, luz com direção, material crível). Portão: o dono
aprova o visual.

**6. Polimento do movimento.** Curvas finais, stagger, secundários com causa, motion blur. Confira
quadros intermediários.

**7. Render.** Sequência de PNG (nunca direto pra vídeo: se cair, não perde). Meça o tempo por
quadro e avise o dono antes de um render longo.

**8. Pós e som.** Compositor leve (glare, vinheta, grão), trilha + SFX no tempo da animação,
montagem no FFmpeg. Medidor no filme final, nos quadros-chave.

**9. Entrega.** O filme mora na oficina, como todo vídeo do EditOS: `sistema/oficina/AAAA-MM-DD-tema/` (o
`cena.py`, `conferencia/`, `render/`, `audio/`, `out/filme.mp4`, um `LEIA.md` de como refazer e o `roteiro.md` quando
houver fala). Aprovado, entregue com `sistema/tools/entregar.py sistema/oficina/AAAA-MM-DD-tema out/filme.mp4` (de
dentro de `sistema/`: `.venv/Scripts/python.exe tools/entregar.py oficina/AAAA-MM-DD-tema out/filme.mp4`), que leva o
mp4 para `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` e atualiza o EditOS Online. Anote o mundo usado em `registro.md`
(desta skill).

Pedido pequeno ("só um still", "ajusta a luz")? Pule para a etapa que cabe, mas nunca pule a
prova.

## A biblioteca `estudio3d` (testada no 5.2.2)

Escala real: 1 unidade = 1 metro. Cabeçalho de toda cena:

```python
import sys; sys.path.insert(0, r'<raiz do EditOS>/.claude/skills/estudio-3d/scripts')  # o modelos/cena_modelo.py acha sozinho
from estudio3d import nucleo, anima, luz, materiais as M, geo, dispositivos as D, mundos, qa
sc = nucleo.cena_nova('9:16', segundos=15, motor_nome='cycles', qualidade='revisao')
ficha = mundos.aplicar('estudio_premium', alvo=(0, 0, 0.09), escala=0.5)
```

| Módulo | O que tem |
|---|---|
| `nucleo` | `cena_nova` (formato, fps, AgX, motor), `motor` (presets rascunho/revisão/final de EEVEE e Cycles, OptiX), `cor` (look e exposição), `hex_lin` (cor com trava de albedo), `quadro`/`tempo`, `vazio`, `salvar` |
| `mundos` | `aplicar(nome, alvo, escala)`: fundo + rig + cartões + bandeiras + névoa + cor. **19 mundos**: os 7 calibrados à mão (`estudio_premium`, `luxo_escuro`, `pop_candy`, `vidro_cromo`, `neon_noturno`, `luz_natural`, `argila`) e os 12 montados da ficha do `mundos.json` por `mundos_ficha` (`diorama_isometrico`, `organico_liquido`, `brutalista_tech`, `macro_cinematografico`, `papel_recorte`, `retrofuturo`, `holografico`, `editorial_revista`, `tatil_textil`, `fitas_ribbons`, `arquitetonico_luz_dura`, `color_block`). Azimute das fichas é relativo à câmera |
| `luz` | `rig(nome)`: `produto`, `softbox_topo`, `contorno_duplo`, `dramatico`, `janela`, `neon`; `area`, `cartao_reflexo`, `bandeira`, `persiana`, `mundo_gradiente`, `mundo_hdri`, `nevoa`, `ligar_luz` (light linking) |
| `materiais` | `plastico`, `metal` (cromo, alumínio, ouro, titânio...; polido/escovado/jateado), `anodizado`, `vidro`, `liquido`, `borracha`, `ceramica`, `argila`, `tecido`, `laca`, `iridescente`, `emissor`, `tela` (imagem + vidro), `fundo`, `piso_espelhado`, `imperfeicao` |
| `geo` | `bloco` (cantos arredondados + chanfro), `placa_face` (com UV), `cilindro`, `torno` (revolução a partir do perfil real), `ciclorama`, `chanfrar` |
| `dispositivos` | `celular` (71,5 x 147 x 7,8 mm), `notebook` (abertura animável), `cartao` (UI com espessura: emite/impresso/vidro), `pilha_explodida` |
| `anima` | `chave(alvo, caminho, [(t, valor)], curva)` com as curvas nomeadas, `segura`, `assar`, `mola`, `entra_mola`, `escalonar`, `tremor`, `fcurves`, e `Camera` (pivô/braço/foco: `orbita`, `inclina`, `dolly`, `grua`, `zoom`, `foco_em`, `abertura`, `na_mao`) |
| `qa` | `fotometro(intencao)` (ajusta a exposição até o herói ficar entre 0,85 e 0,96 sem estourar: rode antes de todo lookdev), `render_quadros(tempos, pasta, escala, amostras, intencao)`, `analisar`, `relatorio`, `folha` (folha de contato) |

**O Blender (5.2 ou mais novo).** `sistema/tools/blender.py` acha o executável desta máquina (variável `BLENDER`,
`sistema/blender-caminho.txt`, o PATH ou o lugar padrão de Windows, macOS e Linux) e `--conferir` diz se a versão serve.
Não achou? Peça pra pessoa instalar pelo blender.org/download e rode de novo.

**Rodar, sempre pela trava** (o computador de quem usa nunca trava, G4), de dentro de `sistema/`:
```sh
B="$(.venv/Scripts/python.exe tools/blender.py)"
QUEM=3d sh tools/com-trava.sh "$B" -b --factory-startup -P oficina/<pasta>/cena.py -- <args>
```
A trava (`tools/com-trava.sh`) põe um pesado por vez na fila e liga a contenção (`tools/contencao.ps1`: prioridade
ociosa, os últimos núcleos livres, a placa dividida com a tela). Render longo: avise antes e prefira deixar rodando
quando a pessoa não estiver usando o computador. Arquivo temporário vai em `sistema/.tmp/`, nunca fora do EditOS.
Ponto de partida pronto: `modelos/cena_modelo.py` (copie pra `sistema/oficina/<pasta>/cena.py` e adapte; ele acha a
biblioteca sozinho subindo as pastas, ou pela variável `ESTUDIO3D`).

**Telas de app/site:** desenhe em HTML (ou use o print real do cliente) e fotografe sem janela:
`msedge --headless=new --hide-scrollbars --window-size=1170,2532 --screenshot=tela.png file:///.../tela.html`
(celular 1170x2532; notebook 1600x1000). Brilho da tela ~1,0: acima de 1,3 o AgX desbota a UI.

## O medidor (rode em toda prova)

`qa.render_quadros(...)` já mede, e o `scripts/qa_cli.py` mede PNGs prontos. Vereditos:
**BORRADO** (nitidez relativa < 0,42: quadro ampliado, desfoque ou obturador longo), **RUIDOSO** (ruído > 0,006 nas áreas lisas), **PRÉVIA** (quadro com menos de 1920 px: não aprova nada), **ESTOURADO** (>2% no branco puro), **AFUNDADO** (>20% no preto), **LAVADO** (pouco contraste com
piso alto), **ESCURO** (média < 0,16), **SEM COR** (colorido < 12), **CHAPADO** (pouca borda).
Mundos low-key (`luxo_escuro`, `neon_noturno`) passam `intencao='escuro'`. Passar no medidor é o
mínimo, não a aprovação: depois vem o olho e a rubrica (`referencias/qa-rubrica.md`).

## Regras invioláveis

1. **AgX sempre**, com look. Nunca `Standard` em render final.
2. **Escala real** em metros, sempre. Luz, desfoque e chanfro dependem disso.
3. **Nada de aresta viva.** `geo.chanfrar` ou peças da `geo`.
4. **Nenhum enfeite sem causa.** Elemento que se mexe sem evento do produto sai.
5. **Curva declarada em toda chave.** Bezier automática não é acabamento.
6. **Um mundo por filme, registrado.** Dois filmes seguidos nunca com o mesmo mundo + mesma lente.
7. **Vidro e metal com o que refletir** (cartões + bandeiras), senão saem pretos.
8. **O ponto mais claro do quadro é o herói.**
9. **Prova antes de "pronto":** medidor + olho + rubrica, com os PNGs salvos em `conferencia/`.
   **Aprovação só com quadro a 100% e amostras finais**, olhando recortes 1:1 (a folha de contato
   reduzida esconde borrão, ruído e gelo sem definição: foi assim que a ORLA v2 passou com defeito).
   Prévia a 50% serve pra tempo e enquadramento, nunca pra mostrar ao dono como qualidade.
10. **Nunca invente dado do cliente** (números, nomes, logo). Tela de exemplo leva "ilustrativo".
11. **Avise o tempo antes de render longo.** Medido na máquina de referência, RTX 3050 Laptop (4 GB); outra placa,
    meça um quadro antes de prometer prazo: EEVEE ~1,5 s/quadro em
    1080x1920; Cycles 1080x1920 com vidro: 256 amostras ~40 s/quadro (o preset final), 64 ~12 s
    (deixa "cera" no vidro), 1024 ~170 s (só still de capa). Um filme de 30 s em Cycles final leva
    ~10 h: prefira filme híbrido (EEVEE onde não há vidro nem líquido). Render de horas só com o ok
    do dono.
13. **Gelo:** só `geo.gelo_cubo` + `materiais.gelo` (cubo lascado, facetas vivas, 1 fratura pequena,
    bolhas finas no miolo, sem volume leitoso) e SEMPRE com algo pra refratar atrás (faixas de luz
    desfocadas). Fundo preto liso faz o gelo virar pepita prateada.
14. **Névoa fria:** véu fino, não fumaça. Densidade do volume 6-12 (60 vira bomba de fumaça),
    anisotropia 0,6 com contraluz, dissolução rápida (40), vorticidade 0,6, resolução ≥ 128.
15. **Nitidez:** diafragma f/5,6+ no produto (f/8-11 em macro), obturador 0,3, grão de pós ≤ 0,003.
12. **Splash, fluido e simulação:** receita testada em `scripts/receitas/splash_produto.py`
    (porção de líquido caindo no produto). Bake de 40 quadros: res 96 = 75 s; res 128 = 120 s.

## Ao terminar

Diga onde salvou, o que foi conferido (com os números do medidor), o que ficou fraco e o próximo
passo natural. Texto público que acompanha o filme (legenda, roteiro) sai sem cara de texto de IA (o `/humanizer`,
se existir no sistema).
