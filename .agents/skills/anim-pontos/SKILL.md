---
name: anim-pontos
description: Estilo de animação Retícula de gráfica do EditOS: retícula de gráfica: tudo em pontinhos de quatro tintas. Use quando pedirem vídeo animado "retícula", "estilo gibi", "pop art", "jornal antigo" ou o tema for curiosidade, notícia ou tom pop.
---

# Retícula de gráfica: estilo de animação do EditOS

**2D.** Página impressa vista de perto: tudo é feito de pontinhos de quatro tintas (ciano, magenta, amarelo e preto) sobre papel creme.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** curiosidade, notícia, explicação com cara de revista ou de gibi antigo, tom pop.
- **Pedidos que chamam este estilo:** "retícula", "estilo gibi", "pop art", "jornal antigo", ou um tema de curiosidade, notícia ou tom pop.
- **Quando não:** Detalhe fino, texto pequeno ou tema que pede delicadeza. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** papel creme com fibra, marcas de registro nos cantos e a barra das quatro tintas no topo. Não muda.
- **Cores:** só as quatro tintas (`TINTA`). A cena é pintada em cor normal e a `Reticula` separa em pontos; a mistura
  dos pontos faz as outras cores (verde = ciano + amarelo, laranja = magenta + amarelo).
- **Traço:** não tem linha. Toda forma é uma mancha de pontos em grade inclinada, um ângulo por tinta (15°, 75°, 0°,
  45°), com o registro tremendo um tiquinho, como na máquina.
- **Letra:** Space Grotesk 700 no texto grande, feito de pontinhos pretos, dentro de uma faixa de papel com borda
  preta; Space Mono 700 em magenta no rótulo (`Impresso`).
- **Movimento:** a cena chega numa onda de pressão que sai de um ponto e engorda os pontos na frente dela; depois as
  coisas andam (chuva, onda, raio do sol girando).
- **Transição:** os pontos encolhem até quase sumir (`apaga`) e a próxima cena chega na onda.
- **Legenda:** Space Grotesk 700, preta, palavra dita em magenta, a 73% da altura, com halo de papel em volta.

**Por quê:** A retícula dá cara de revista e gibi: o fato parece notícia de banca. Formas grandes e cores fortes são as únicas que sobrevivem, então tudo fica direto.

## As peças
Em `sistema/animacoes/src/estilos/pontos/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/pontos'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Reticula` | imprime a cena em pontos; `chega` passa a onda de pressão (a partir de `de`), `apaga` encolhe os pontos |
| `Pintor` | o formato de todo desenho: uma função que pinta em canvas comum, em cor chapada |
| `Impresso` | texto grande de pontinhos numa faixa de papel, revelado da esquerda pra direita |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta`, `Chao` | desenhos prontos (pintores), que servem de molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Escreva um pintor: pinte o objeto em canvas com formas grandes e cor forte e chapada (círculo, elipse, retângulo,
linha grossa). Nada de linha fina nem detalhe pequeno: o ponto da retícula tem uns 17 de tamanho, e o que for menor
que três pontos some. Cor muito clara vira quase nada; cor muito escura vira preto.

**Exemplo trabalhado:** "A invenção do chiclete": uma bola rosa gigante que cresce em pontos magenta, uma árvore de seiva em verde chapado, a caixinha amarela e o estouro em ciano na palavra "estoura".

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo pontos`, em `animacoes/estilos/fotos/pontos-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo pontos` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Linha fina, texto pintado dentro do pintor e detalhe miúdo.
- Branco puro como cor de objeto: no papel ele some.
- Mais de 4 ou 5 pintores na mesma cena.
- Texto pequeno: nada abaixo de 56.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
