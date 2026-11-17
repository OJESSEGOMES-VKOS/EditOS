---
name: anim-colagem
description: Estilo de animação Colagem do EditOS: recortes de jornal e retícula colados, letras de revista. Use quando pedirem vídeo animado "colagem", "recorte de revista", "fanzine" ou o tema for notícia, curiosidade ou cultura pop.
---

# Colagem: estilo de animação do EditOS

**2D.** Caderno de recortes: cada cena é uma folha colorida de borda rasgada que entra deslizando; em cima, recortes de jornal, retícula de gráfica e papel listrado colados um a um, tortos e com sombra, e letras de bilhete de sequestro.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** curiosidade, notícia, lista, opinião, cultura pop, assunto com tom de revista ou de fanzine.
- **Pedidos que chamam este estilo:** "colagem", "recorte de revista", "fanzine", ou um tema de notícia, curiosidade ou cultura pop.
- **Quando não:** Tema solene, luto, luxo ou assunto que pede precisão técnica. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** mesa de papel kraft com fibra e tiras de jornal coladas no alto. Cada cena traz a sua `Folha` de uma cor só, com a borda de cima rasgada.
- **Cores:** papel chapado (`COR`: creme, marinho, céu, pêssego, areia, vermelho, amarelo, verde...) e os papéis estampados (`PAPEL`): listrado azul, retícula amarela, verde e laranja, e jornal. Cada recorte é de um papel.
- **Forma:** todo recorte tem borda rasgada (`rasgar`), a margem branca de quem recortou com a mão, sombra de altura e um giro torto. Linha vira `Tira` de papel com ponta cortada, nunca traço fino.
- **Movimento:** o recorte chega maior e torto e assenta com mola, como mão colando; um a um, nunca tudo junto. O que é contínuo (gota, vapor, onda) anda em degraus, como papel mexido à mão.
- **Letra:** bilhete de sequestro (`Letras`): cada letra num quadradinho de papel, de uma fonte (Abril Fatface, Anton, Special Elite, Playfair Display 900), de uma cor e de um giro. `Etiqueta` vermelha em Anton caixa alta pra uma palavra.
- **Transição:** a cena inteira entra como folha nova deslizando da direita e assentando torta (`FolhaNova`, 0,35 s); fusão 0.
- **Legenda:** Anton em caixa alta, creme com contorno preto, palavra dita em amarelo, a 72% da altura.

**Por quê:** Papel recortado e colado à mão tem cara de opinião e de arquivo pessoal: o assunto parece garimpado, não gerado. Cada recorte entrando um a um dá ritmo sem precisar de animação fina.

## As peças
Em `sistema/animacoes/src/estilos/colagem/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/colagem'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Folha` | a folha de fundo da cena, uma cor, borda de cima rasgada |
| `FolhaNova` | a transição: embrulha a cena e faz ela entrar deslizando |
| `Recorte` | uma forma de papel (pontos) colada com mola; `papel` = estampa ou cor |
| `Tira` | uma tira de papel no lugar de linha (raio, caule, onda, seta) |
| `Letras` | bilhete de sequestro, letra por letra (título ou UMA palavra forte) |
| `Etiqueta` | palavra em etiqueta vermelha que se revela da esquerda |
| `Fita` | um pedaço de fita adesiva |
| `NoAlto` | põe texto no alto da tela, fora da faixa da legenda |
| `rasgar` | deixa qualquer contorno com borda de papel rasgado |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde dos novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense em quem recorta de revista com tesoura e cola: duas a cinco formas simples (círculo, retângulo, triângulo,
gota), cada uma de um papel diferente (o jornal pra o que é "notícia" ou neutro, a retícula pra o que tem cor viva,
o listrado pra água e tecido). Um prédio é um retângulo de jornal com janelas de retícula amarela; um celular é um
retângulo marinho com a tela de papel céu; uma pessoa é um círculo creme e um corpo de papel colorido. Cole na
ordem de quem monta: o maior primeiro, o detalhe por último.

**Exemplo trabalhado:** "Como o vinil voltou a vender" (4 cenas): folha marinho com um disco recortado em jornal e o centro em retícula laranja; uma vitrola de retângulos colados; uma seta de Tira subindo com a Etiqueta do ano conferido; e "VOLTOU" em Letras. Cada recorte nasce de uma palavra da fala.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo colagem`, em `animacoes/estilos/fotos/colagem-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo colagem` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Linha fina, degradê, brilho ou sombra macia de 3D: aqui tudo é papel.
- Movimento liso demais no que é contínuo: anda em degraus.
- `Letras` com a frase que a legenda está mostrando: use pra título (com a legenda desligada no trecho) ou uma palavra que a fala não diz naquele instante.
- Mais de 6 recortes chegando na mesma cena; mais de uma cor de folha por cena.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
