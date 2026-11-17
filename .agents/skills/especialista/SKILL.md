---
name: especialista
description: >
  Modelo de edição especialista do EditOS: o especialista fala calmo, legenda pequena de livro (Playfair) no peito e
  poucos destaques de sentido fixo. Use quando pedirem "edita no especialista", "edita minha gravação no
  especialista" ou um vídeo sóbrio só com tipografia.
---

# especialista: o jeito, não o clone

Esta skill é a entrada do modelo. Ela ensina o **jeito** de editar no especialista, para qualquer fala. O arquivo
detalhado (números, posições, opções, comandos) é `sistema/modelos/especialista/especialista.md`; o método comum de
todas as skills é `sistema/JEITO.md`; as regras do dono (`REGRAS.md` §0, G1 a G35) mandam acima das duas.

O exemplo deste modelo é a vitrine do molde (a gravação comum, "100% editado pelo Claude"; ainda não há vídeo aprovado
nem `referencia/`). Ele mostra os modos funcionando numa fala; nunca é o roteiro, a sequência nem a lista de destaques
do vídeo novo. Quem grava sobre a clínica dele recebe um vídeo especialista sobre a clínica, não a vitrine com outra voz.

**Este modelo não tem tela livre, e de propósito.** O único grafismo é a letra: não há tela cheia, tela dividida,
B-roll, ícone nem interface (especialista.md §1 e §7). O que muda de um vídeo para outro é QUAL fala vira destaque e
de que tipo. Por isso o trabalho aqui é o começo vazio, a personalidade e o teste do clone; não existe `src/telas/`.

## Quando usar

- **Sim:** uma pessoa falando para a câmera numa tomada só, tom calmo e sóbrio (médico, advogado, professor, consultor,
  qualquer especialista), de 15 s a 90 s, quando a força está no que é dito e não em mostrar coisas.
- **Não:** fala que precisa mostrar algo para ser entendida (um app, um número com prova, um antes e depois): vá para o
  `rosto-telas`, o `prova-print` ou o `autoridade`. Fala agitada de Reels com muita troca: vá para um modelo dinâmico.

## A personalidade (vale para qualquer fala)

Cada regra: o que é, o porquê, quando sim, quando não.

1. **A base é a maior parte.** A gravação crua com o fundo real (G6), zoom 1,0, e a legenda pequena. *Por quê:* o
   encanto é a contenção; o destaque vale porque é raro. *Sim:* explicação, contexto, objeção respondida, a pausa de
   autoridade. *Não:* criar destaque para "ter ritmo" (no exemplo, ~70% de base; numa fala só explicativa, mais).
2. **Letra de livro no peito.** Playfair Display, uma família só (500 na legenda, 800 no gigante, 500 itálica na
   citação), na cor da cena (`C`, medida por gravação). Legenda de 58 px, até 2 linhas, logo abaixo do queixo, a página
   inteira de uma vez, uma página por subtrecho (até a vírgula). Sem tarja, contorno, sombra colada nem brilho (G16).
   *Por quê:* tipografia de livro dá autoridade sem dizer "sou autoridade".
3. **O efeito tem sentido fixo, e só três.** O espectador aprende o código sem perceber:
   - **GIGANTE** = peso (o paradoxo do gancho, a virada, a ordem, a tese, o aforismo do fim). Caixa alta, um tamanho
     só no vídeo, um grupo de 1 a 3 palavras por vez, começando no protagonista.
   - **Linha de cima + gigante** = a palavra de peso fecha uma fala curta: o começo da MESMA fala numa linha acima, na
     mesma tela (uma fala = uma tela). O **traço vermelho** sob a última palavra marca o alvo do tema, uma vez.
   - **CITAÇÃO** em itálico dourado entre aspas = a fala põe uma frase literal na boca de alguém. Sem fala citada, não
     existe. Nunca inventar uma frase para "caber" o modo.
4. **Duas transições, e só duas.** Corte seco com a aproximação 1,15 da mesma tomada na entrada do gigante; a fusão de
   0,3 s só entre trechos diferentes (a fala anterior fecha em ponto e começa outra ideia). Nada de clarão, chicote,
   flash ou som.
5. **Uma posição por tipo** (G13): legenda, citação e gigante sozinho no mesmo centro; o par no `Y_PAR`. O olho nunca
   procura o texto.
6. **Toda palavra dita aparece uma vez só** (G26), na legenda ou num destaque. Número como foi dito (G10).
7. **O fim** segura 1,16 s depois da última palavra, escurece e fica 1,2 s em preto. Só a voz (G6).
8. **Profissão regulamentada:** pesquisar as regras do conselho antes (especialista.md §7b). Na dúvida, base.

## As peças (o que já existe em código)

Do molde `sistema/moldes/especialista/` (`src/Reel.tsx`): a base (`Video`, a legenda automática `paginasAuto`), o
`gigante(i, grupos, {cima, traco})`, a `citacao([i, 'texto / 2a linha'], ...)`, as `TRANSICOES` (fusão), os
`REENQUADRES` (só com ordem), a cor `C` (`scripts/cor_da_cena.py`) e a posição medida da gravação (`Y_TEXTO`,
`Y_PAR`). O checador é `scripts/checar.mjs`.

## A escolha (a parte que muda de vídeo para vídeo)

Leia a fala e, trecho a trecho, pergunte qual função ele tem (especialista.md §1). Quase tudo é base. Para cada
destaque, ache a palavra que carrega o peso e escreva o porquê com ela entre aspas no plano.

**Exemplo 1 (fala que o exemplo não tem):** *"Todo mundo te diz: 'bebe dois litros de água por dia'. Só que a sua sede
já sabe a conta."* A 1ª frase tem fala citada: CITAÇÃO "bebe dois litros / de água por dia". A virada fecha a fala
curta com a palavra-alvo: `gigante(i, ['conta.'], {cima: 'a sua sede já sabe a', traco: true})`. Nada mais.

**Exemplo 2:** *"Eu atendo há doze anos. Em todo esse tempo, o erro que mais vejo é parar o remédio quando melhora.
Não pare."* Base na autoridade (a pausa depois de "anos" respira, não se corta). Base na explicação. O aforismo do fim
em gigante: `gigante(i, ['Não pare.'])`, que segura até o preto.


## O teste do clone (antes do render)

1. `.venv/Scripts/python.exe tools/clone.py oficina/<pasta>` (de dentro de `sistema/`) tem de sair `SEM CLONE`. Ele
   acusa legenda ou destaque escrito com texto da vitrine que a fala nova não diz e bloco do plano parecido com o dela.
2. **Todo destaque tem dono:** no `plano.md`, a linha da cena diz a peça (`GIGANTES`, `CITACOES`, `REENQUADRES`) e a
   palavra dita entre aspas que pediu ela, com o porquê. No gancho, escreva a resposta como "legenda em destaque sobre a
   gravação original": o gigante é a própria fala, não uma tela (G29).
3. **Folha lado a lado** com a vitrine do molde (quadros do molde em cima, os do vídeo novo embaixo): *mesmo modelo?*
   (letra, posição, cor da cena, contenção) **sim**; *mesmo vídeo?* (as mesmas palavras em gigante, na mesma ordem)
   **não**.

## O caminho (os comandos estão no `especialista.md` §9)

1. Ler esta skill e o `especialista.md`. 2. `tools/novo-video.py especialista <gravação> <AAAA-MM-DD-tema>
--sem-adaptar`: o plano nasce vazio (só a base, com a legenda automática). 3. Ler a fala (`src/palavras.json`) antes de
olhar a vitrine. 4. `scripts/cor_da_cena.py` (a cor `C`) e `scripts/maos.py`. 5. Plano de cenas (`cenas.json` →
`tools/decupar.py --plano`). 6. Ligar no bloco O PLANO de `src/Reel.tsx` só os destaques que a fala pede. 7.
`scripts/checar.mjs` até `APROVADO`, `tools/decupar.py --conferir`, `tools/clone.py` até `SEM CLONE`. 8. Quadros e
folha lado a lado. 9. Render, mixagem só com a voz, entrega.

## Nunca

- Começar do plano da vitrine ou copiar o bloco O PLANO de outro vídeo.
- Pôr em gigante as palavras da vitrine ("comenta", "100%", "Claude") porque "o modelo tem": só com o mesmo porquê.
- Citação sem fala citada; cursiva; segunda família de letra; tela cheia, dividida, ícone, B-roll.
- Escrever na tela o que não foi dito, ou a mesma palavra em dois lugares (G19, G26).
- Mais de um traço vermelho, ou traço fora da palavra-alvo.
- O nome do modelo na tela (G33).
