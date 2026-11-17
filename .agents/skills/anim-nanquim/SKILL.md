---
name: anim-nanquim
description: Estilo de animação Rabisco de nanquim do EditOS: pincel de tinta preta em papel creme, com aguada e carimbo vermelho. Use quando pedirem vídeo animado "nanquim", "pincel", "tinta preta" ou o tema for história contada, reflexão ou curiosidade.
---

# Rabisco de nanquim: estilo de animação do EditOS

**2D.** Papel creme com fibra; tudo é pincelado em tinta preta, com aguada cinza, hachura de pena e um carimbo vermelho.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** história contada, reflexão, curiosidade, explicação com personagem simples.
- **Pedidos que chamam este estilo:** "nanquim", "pincel", "tinta preta", ou um tema de história contada, reflexão ou curiosidade.
- **Quando não:** Tema muito colorido, tecnologia de interface ou criança pequena. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** papel creme com fibra comprida e os cantos escurecidos. Não muda de cor.
- **Cores:** tinta preta quase sempre. Aguada cinza ou azul bem clara pra preencher, vermelho só pra um ponto de destaque (sol, carimbo, palavra dita). Nada de cor viva chapada.
- **Traço:** pincelada de cerdas (`Pincel`): grossa no meio, fina nas pontas, com as cerdas de fora secando antes do fim. Sempre se desenha, nunca aparece pronta.
- **Cor por dentro:** aguada (`Aguada`), mancha de tinta diluída com borda mais escura, ou hachura de pena (`Hachura`) pra sombra.
- **Gente:** personagem-palito (`Palito`), cabeça redonda e corpo em quatro pinceladas, com braços e passo animáveis.
- **Letra:** Shippori Mincho, que chega borrada e assenta como tinta secando.
- **Movimento:** desenha, espera um instante e ganha vida (balança, sobe, chove). Câmera parada.
- **Transição:** uma folha nova de papel passa por cima, com borda de pincel (`FolhaNova`), no fim da cena.
- **Legenda:** Shippori Mincho 800 em tinta preta com halo de papel, palavra dita em vermelho, a 72% da altura.

**Por quê:** Poucos gestos largos de pincel dão elegância e foco: o olho vai direto pro essencial. O carimbo vermelho marca o ponto principal como uma assinatura.

## As peças
Em `sistema/animacoes/src/estilos/nanquim/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/nanquim'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Tinta` | a camada que dá a borda de tinta bebendo no papel; todo desenho vai dentro dela |
| `Pincel` | uma pincelada de cerdas que se desenha por uma lista de pontos |
| `Aguada` | mancha de tinta diluída que cresce, pra pintar por dentro |
| `Hachura` | riscos de pena dentro de uma forma (sombra); precisa de `id` único |
| `Respingo` | pingos de tinta, pra dar batida ou fechar um desenho |
| `Palito` | personagem-palito com braços (`bracos`) e passo (`passo`) |
| `Escrito` | texto que chega borrado e assenta |
| `Selo` | carimbo vermelho com uma ou duas letras, pra assinar um título |
| `FolhaNova` | a transição: folha nova passando por cima |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde dos novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense como quem pinta com um pincel só: poucos gestos largos. O contorno sai em uma ou duas `Pincel`, a cor entra
em `Aguada` por baixo, e a sombra (se precisar) em `Hachura`. Casa é um quadrado e um telhado de duas pinceladas;
árvore é um caule e três pinceladas de folha. Pessoa é sempre o `Palito`.

**Exemplo trabalhado:** "A origem do café": um pastor (o Palito) com cabras de duas pinceladas, o arbusto com frutos em aguada vermelha, as cabras pulando, o monge com a bebida fumegando e o carimbo vermelho no nome do lugar conferido.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo nanquim`, em `animacoes/estilos/fotos/nanquim-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo nanquim` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Muito detalhe: cinco ou seis pinceladas por objeto bastam. O vazio do papel faz parte da cara.
- Cor chapada ou forte: o vermelho aparece uma vez por cena, no máximo.
- Texto pequeno: nada abaixo de 56 de tamanho.
- Encher a folha: cada cena recebe uma folha nova.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
