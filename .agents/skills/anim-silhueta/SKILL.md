---
name: anim-silhueta
description: Estilo de animação Silhueta do EditOS: céu em degradê com formas recortadas em preto contra a luz. Use quando pedirem vídeo animado "silhueta", "contra a luz", "pôr do sol", "minimalista" ou o tema for reflexão ou história com clima.
---

# Silhueta: estilo de animação do EditOS

**2D.** Pôster minimalista: céu de duas cores em degradê, uma linha de horizonte e poucas formas recortadas em preto chapado contra a luz.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** reflexão, curiosidade calma, história com clima, frase de impacto, natureza e tempo.
- **Pedidos que chamam este estilo:** "silhueta", "contra a luz", "pôr do sol", "minimalista", ou um tema de reflexão ou história com clima.
- **Quando não:** Explicação com muitas partes ou que precisa de cor nos objetos. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** céu em degradê de duas cores sobre um chão escuro, com o horizonte a 60% da altura. Cada cena escolhe a sua hora do dia (`HORA`: madrugada, manhã, tarde, entardecer, crepúsculo, chuvoso) e pode passar de uma pra outra.
- **Cores:** o céu dá a cor; tudo que está na frente é preto chapado (`TINTA`). As únicas coisas claras são as que são luz: sol, reflexo, chuva, vapor.
- **Forma:** silhueta reconhecível pelo contorno, sem detalhe por dentro. Poucas coisas por cena (uma ou duas).
- **Movimento:** lento. A forma sobe do horizonte ou cresce da base; o céu muda de cor; o reflexo respira.
- **Letra:** Montserrat 300, grande e com respiro, no céu; Montserrat 600 em caixa alta bem espaçada pros rótulos curtos.
- **Transição:** a luz vai embora e a tela escurece (`Escurece`), no fim da cena.
- **Legenda:** Montserrat 700 em caixa alta, branca com sombra escura, palavra dita em âmbar, a 74% da altura (em cima do chão escuro).

**Por quê:** Poucas formas pretas contra o céu dão clima de cinema e deixam a frase pesar. A silhueta obriga a escolher o essencial.

## As peças
Em `sistema/animacoes/src/estilos/silhueta/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/silhueta'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Ceu` | o céu e o chão na hora do dia escolhida, e a passagem de uma hora pra outra |
| `Recorte` | põe uma forma preta no lugar; sobe do horizonte ou cresce da base (`cresce`) |
| `Letreiro` | texto de pôster, fino e espaçado, que sobe devagar |
| `Escurece` | a transição: a tela vai ao preto |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Desenhe o contorno em volta de (0,0), com o pé no zero e em unidades de tela de 1080, e ponha dentro de um
`Recorte`. Pense em como a coisa fica de perfil contra o pôr do sol: árvore é tronco e três bolas, casa é quadrado e
telhado, pessoa é cabeça redonda e corpo em trapézio. Coisa que brilha (lâmpada, fogo, estrela) não é recorte: é luz,
em cor clara.

**Exemplo trabalhado:** "A migração das andorinhas": o céu laranja e roxo, o horizonte com uma árvore recortada, as andorinhas de perfil em V que cruzam a tela, e a lua clara quando a fala chega na noite.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo silhueta`, em `animacoes/estilos/fotos/silhueta-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo silhueta` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Detalhe dentro da silhueta (olho, janela, textura): some no preto.
- Mais de duas ou três formas por cena: o estilo vive de vazio.
- Céu de cor forte demais atrás da legenda: ela fica no chão escuro, deixe ali livre.
- Texto pequeno: nada abaixo de 56, exceto o rótulo espaçado em caixa alta (40 no mínimo).
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
