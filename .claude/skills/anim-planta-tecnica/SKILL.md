---
name: anim-planta-tecnica
description: Estilo de animação Planta técnica do EditOS: folha de projeto azul com grade, linha branca, cotas e carimbo. Use quando pedirem vídeo animado "blueprint", "planta técnica", "desenho técnico" ou o tema for "como funciona" ou engenharia.
---

# Planta técnica: estilo de animação do EditOS

**2D.** Folha de projeto azul com grade, onde tudo é desenhado a régua em linha branca, com cotas, rótulos de máquina e carimbo no canto.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** "como funciona", processo passo a passo, engenharia, medida e comparação de tamanho, invenção.
- **Pedidos que chamam este estilo:** "blueprint", "planta técnica", "desenho técnico", ou um tema de "como funciona" ou engenharia.
- **Quando não:** Tema emocional, história de pessoa ou conteúdo infantil. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** azul de cópia heliográfica, grade fina e grade grossa, grão leve, moldura dupla e o carimbo do projeto no canto de baixo. Não muda de cor.
- **Cores:** branco de linha em quase tudo, ciano pra água e fluxo, amarelo só pra medida e destaque (`COR`).
- **Traço:** linha firme que se desenha, com um segundo traço fino deslocado (o lápis da construção). Forma geométrica limpa, quina reta onde der. Por dentro, só um véu branco bem leve.
- **Letra:** Architects Daughter (letra de arquiteto) nos títulos e na legenda; IBM Plex Mono espaçada nos rótulos, cotas e "FIG.".
- **Movimento:** eixos tracejados aparecem, a forma se desenha, a cota abre e mostra o número. Depois a coisa funciona (gira, chove, cresce). Câmera parada.
- **Transição:** a varredura de scanner ciano desce e deixa a folha limpa (`Varredura`), no fim da cena.
- **Legenda:** Architects Daughter branca, palavra dita em amarelo, contorno azul-escuro, a 72% da altura.

**Por quê:** A planta técnica passa precisão e confiança: parece que o assunto foi medido. Cota e rótulo explicam sem precisar de cor.

## As peças
Em `sistema/animacoes/src/estilos/planta-tecnica/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/planta-tecnica'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Linha` | um caminho de pontos que se desenha em traço duplo; com `cheio`, ganha o véu por dentro |
| `Rotulo` | texto de máquina que se digita letra a letra (ou letra de arquiteto com `mao`) |
| `Cota` | linha de medida com setinhas e o valor numa caixinha |
| `Eixos` | as linhas de centro tracejadas que cruzam num ponto |
| `Figura` | o cabeçalho "FIG. N · NOME" da cena |
| `Varredura` | a transição: a barra de scanner que limpa a folha |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta`, `Seta` | desenhos prontos, molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Desenhe como um projetista: a forma em vista de frente ou em corte, feita de reta, círculo e arco, sem sombra nem
textura. Dê um nome de peça com `Rotulo` e, quando fizer sentido, uma `Cota` com a medida. Fluxo vira `Seta`
tracejada. Corte de material (chão, água) ganha hachura fina inclinada.

**Exemplo trabalhado:** "Como funciona uma descarga": a caixa-d’água em corte com hachura na água, a boia com Rotulo, a Cota da altura da água conferida, e a Seta tracejada da água descendo quando a fala diz "puxa".

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo planta-tecnica`, em `animacoes/estilos/fotos/planta-tecnica-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo planta-tecnica` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Cor chapada forte: a planta é linha branca sobre azul, o resto é acento.
- Número inventado na cota quando o assunto é fato: use medida real ou um rótulo sem número.
- Texto de rótulo abaixo de 26: rótulo é detalhe; o que precisa ser lido vai na legenda ou num `Rotulo` de 56 pra cima.
- Encher a folha de cotas: uma ou duas por cena.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
