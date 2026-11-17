---
name: anim-vidro-3d
description: Estilo de animação Vidro 3D do EditOS: objetos de vidro fosco flutuando num fundo gelo com luzes coloridas. Use quando pedirem vídeo animado "vidro", "glassmorphism", "3D de app", "premium" ou o tema for tecnologia, produto, app ou número.
---

# Vidro 3D: estilo de animação do EditOS

**3D leve.** Objetos de vidro fosco e translúcido flutuando num fundo branco-gelo com luzes coloridas desfocadas, com cara de app premium.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** tecnologia, produto, app, dado e número, explicação moderna e limpa.
- **Pedidos que chamam este estilo:** "vidro", "glassmorphism", "3D de app", "premium", ou um tema de tecnologia, produto, app ou número.
- **Quando não:** Tema rústico, histórico, afetivo ou infantil. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** branco-gelo limpo, com quatro luzes coloridas grandes e desfocadas (azul, violeta, pêssego, ciano) passando devagar. Não muda de cor.
- **Vidro (a marca do estilo):** todo objeto é um `Vidro`. Por dentro ele mostra as mesmas luzes do fundo, mais borradas, ampliadas e deslocadas (a refração do vidro fosco); por cima, a tinta do objeto translúcida, um brilho que desce do alto à esquerda e um ponto de luz de estúdio. A borda é a espessura: acende em cima, ganha tinta escura embaixo, com um aro fino que pega luz.
- **Sombra:** o vidro joga uma sombra COLORIDA da própria tinta logo atrás e, se apoia em algo (`chao`), uma mancha colorida macia embaixo.
- **Cores:** tintas de vidro (`COR`): âmbar, laranja, azul, ciano, violeta, verde, rosa e gelo. A letra é azul-noite.
- **Movimento:** tudo flutua devagar (`flutua`), cada peça no seu ritmo; coisas novas crescem com um leve passar do ponto. Nada é brusco.
- **Letra:** Manrope 800 (letra de interface, firme e limpa), com espaçamento apertado.
- **Transição:** o foco. A cena sai desfocando e a próxima chega saindo do desfoque (`Foco`), como câmera trocando o foco.
- **Legenda:** Manrope 800, azul-noite com halo branco, palavra dita em azul-elétrico, a 73% da altura.

**Por quê:** O vidro fosco tem cara de produto premium e de app: o assunto parece moderno e confiável. As luzes que passam por dentro dão vida sem bagunça.

## As peças
Em `sistema/animacoes/src/estilos/vidro-3d/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/vidro-3d'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Vidro` | o objeto de vidro: refração das luzes, tinta, brilho, espessura, aro e sombra colorida |
| `Cartao` | o painel de vidro de cantos redondos (o cartão de app), pra pôr texto em cima |
| `Texto` | letra do estilo que sobe e aparece |
| `Foco` | a transição: envolve a cena inteira |
| `flutua` | o balanço lento de cada peça |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde dos novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Escreva o contorno do objeto como caminho SVG (ou pontos passados pro `caminho(pontos, true)`, como a nuvem) e passe
pro `Vidro` com o centro e o tamanho. Formas cheias e arredondadas, sem parte fina: o vidro precisa de área pra
mostrar a refração. Objeto de duas cores vira dois vidros; o de trás primeiro. Passe sempre o `tv` (segundo do vídeo)
como `t` do `Vidro`, pra o que aparece dentro dele bater com as luzes do fundo.

**Exemplo trabalhado:** "Como o cartão por aproximação funciona": um cartão de vidro com o chip, a maquininha de vidro, as ondas de aproximação como três arcos de vidro e o check verde que aparece dentro do vidro.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo vidro-3d`, em `animacoes/estilos/fotos/vidro-3d-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo vidro-3d` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Muito vidro pequeno ao mesmo tempo: mais de uns 15 pesa na foto e vira ruído.
- Vidro em cima de vidro da mesma tinta: some. Alterne gelo e cor.
- Fundo escuro ou cor chapada: o vidro precisa das luzes atrás pra existir.
- Texto pequeno: nada abaixo de 56 de tamanho.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
