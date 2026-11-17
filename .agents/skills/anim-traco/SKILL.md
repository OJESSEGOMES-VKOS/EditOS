---
name: anim-traco
description: Estilo de animação Traço contínuo do EditOS: uma linha só que se desenha e vira o desenho seguinte. Use quando pedirem vídeo animado "traço contínuo", "uma linha só", "line art" ou o tema for como uma coisa vira outra.
---

# Traço contínuo: estilo de animação do EditOS

**2D.** Papel claro e uma linha azul-tinta só, que nunca sai do papel: ela se desenha e depois escorrega pra virar o desenho seguinte, com a ponta coral da caneta na frente.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** explicar como uma coisa vira outra: processo, ciclo, transformação, antes e depois, ideia que evolui.
- **Pedidos que chamam este estilo:** "traço contínuo", "uma linha só", "line art", ou um tema de como uma coisa vira outra.
- **Quando não:** Assunto com muitos objetos ao mesmo tempo ou que pede cor pra ser entendido. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** papel claro e liso, grão bem leve e uma margem fina. Não muda.
- **Cores:** três e só: azul-tinta na linha, azul-acinzentado nos riscos de detalhe e coral na ponta da caneta e nos destaques (`COR`). Nada de preenchimento.
- **Traço:** uma linha de espessura única, ponta redonda. O desenho principal de cada cena é UMA linha só, sem levantar a caneta.
- **Movimento:** na primeira cena a linha se desenha; dali pra frente ela não some, ela vira: escorrega da forma anterior até a nova, ondulando no meio do caminho. A ponta coral mostra onde a linha está trabalhando.
- **Letra:** Italiana nos títulos, fina e alta, com um fio coral por baixo (`Letra`).
- **Transição:** a própria virada da linha (`Fio` com `de`). Não tem corte nem cortina.
- **Legenda:** Spectral 700, azul-tinta com halo de papel, palavra dita em coral, a 74% da altura.

**Por quê:** A mesma linha que vira o desenho seguinte é a própria ideia de transformação: a pessoa vê uma coisa virando a outra. Uma cor só e papel limpo deixam o olho na linha.

## As peças
Em `sistema/animacoes/src/estilos/traco/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/traco'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `reta`, `arco`, `onda`, `forma` | montam uma forma de linha única com sempre o mesmo número de pontos |
| `Fio` | a linha: se desenha (`desenha`) ou vira de uma forma pra outra (`de`, `para`, `vira`) |
| `Detalhe` | riscos curtos e finos de apoio (brilho, gota, vapor) |
| `Letra` | título fino que se escreve com um fio coral por baixo |
| `sol`, `mar`, `nuvem`, `chuva`, `planta`, `pingos` | desenhos prontos, molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense como quem desenha sem tirar a caneta do papel: entre pela esquerda, contorne o objeto e saia pela direita, na
mesma altura. Emende os pedaços (`reta`, `arco`, `onda`, zigue-zague de pontos) e passe por `forma()`. Entrar e sair
pelos lados é o que faz uma forma virar a outra sem dar nó. Detalhe que não cabe na linha vai em `Detalhe`.

**Exemplo trabalhado:** "Como a abelha faz o mel": a linha desenha uma flor, vira uma abelha (corpo listrado, asas, ferrão), vira três cabeças de boca em boca, vira uma fileira de favos e termina com a tampa coral de cera e "virou mel".

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo traco`, em `animacoes/estilos/fotos/traco-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo traco` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Mais de uma linha principal na mesma cena: a graça é ser uma só (um segundo `Fio` menor, no máximo).
- Forma que começa e termina no meio do desenho: a virada vira um novelo.
- Preencher forma ou usar outra cor na linha.
- Texto pequeno: nada abaixo de 56.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
