---
name: anim-cosmico
description: Estilo de animação Poeira cósmica do EditOS: milhares de pontos de luz que se juntam na forma e se espalham. Use quando pedirem vídeo animado "cósmico", "poeira cósmica", "de estrelas", "espacial" ou o tema for espaço, ciência ou origem das coisas.
---

# Poeira cósmica: estilo de animação do EditOS

**2D.** Céu fundo de nebulosa; tudo é feito de milhares de pontos de luz que se juntam na forma e se espalham no fim.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** ciência, espaço, origem das coisas, tema grandioso, abertura com impacto.
- **Pedidos que chamam este estilo:** "cósmico", "poeira cósmica", "de estrelas", "espacial", ou um tema de espaço, ciência ou origem das coisas.
- **Quando não:** Assunto do dia a dia, comida, dica prática ou texto com muito detalhe: os grãos não seguram detalhe fino. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** azul-noite com duas nuvens de nebulosa (roxa e azul-petróleo) derivando devagar, névoa e estrelas que piscam. Bordas escuras.
- **Cores:** só luz clara sobre o escuro: branco, âmbar, azul, ciano, verde, laranja e lilás (`COR`). Nada de cor escura nos desenhos.
- **Traço:** não tem traço. Toda forma é poeira: grãos de luz que se somam (mais grão = mais brilho).
- **Cor por dentro:** densidade. Miolo cheio de grão, borda solta.
- **Letra:** Josefin Sans, em caixa alta, que acende com o espaçamento se fechando e o desfoque sumindo (`Brilho`).
- **Movimento:** a poeira viaja pelo céu fazendo curva e chega na forma (`junta`); depois a forma respira, gira devagar e pisca.
- **Transição:** a poeira se espalha pra fora e apaga (`espalha`), no fim da cena. A cena seguinte junta de novo.
- **Legenda:** Josefin Sans 600, branca, palavra dita em ciano, a 76% da altura, com sombra escura em volta.

**Por quê:** Tudo nasce e se desfaz em poeira de luz: dá escala e grandeza ao assunto. A forma só existe enquanto os grãos estão juntos, então cada cena tem um começo e um fim naturais.

## As peças
Em `sistema/animacoes/src/estilos/cosmico/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/cosmico'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Poeira` | desenha uma lista de grãos; `junta` traz a poeira até a forma, `espalha` solta e apaga |
| `disco`, `mancha`, `trilha` | geram grãos: disco cheio, mancha oval de borda solta, poeira ao longo de um caminho |
| `Brilho` | texto que acende |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, que servem de molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense no objeto como uma constelação: a silhueta em duas ou três formas (`disco`, `mancha`, `trilha`), cada uma
numa cor, somadas numa lista de grãos e passadas pra uma `Poeira` com semente própria. Coisa que anda (pingo,
vapor, vento) é grão cuja posição sai de `t`. Entre 300 e 1500 grãos por desenho.

**Exemplo trabalhado:** "Como nasce uma estrela": uma nuvem de gás em grãos roxos que gira e se aperta; o miolo que esquenta e muda de cor pro laranja; a explosão de grãos quando a fala diz "acende"; os planetas como anéis de poeira em volta. Cada forma é uma Poeira com semente própria.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo cosmico`, em `animacoes/estilos/fotos/cosmico-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo cosmico` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Forma cheia de detalhe: poeira lê silhueta, não miúdo.
- Mais de uns 4000 grãos na tela: pesa e vira borrão.
- Texto pequeno: nada abaixo de 56. Texto sempre em caixa alta e curto.
- Desenho na faixa da legenda (62% a 82% da altura).
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
