---
name: anim-oficina-antiga
description: Estilo de animação Oficina antiga do EditOS: bancada de artesão com latão e luz quente, um teatro mecânico. Use quando pedirem vídeo animado "oficina", "steampunk", "mecanismo", "engrenagem" ou o tema for "como funciona", mecanismo ou invenção.
---

# Oficina antiga: estilo de animação do EditOS

**2D.** A bancada de um artesão à noite, com latão e luz quente; tudo vira um pequeno teatro mecânico em cima da mesa.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** "como funciona", mecanismo, invenção, história de objeto e explicação passo a passo.
- **Pedidos que chamam este estilo:** "oficina", "steampunk", "mecanismo", "engrenagem", ou um tema de "como funciona", mecanismo ou invenção.
- **Quando não:** Assunto sem mecanismo nem objeto, ou tema digital moderno. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** parede de tábuas escuras na metade de cima, tampo de madeira com veio na de baixo, a poça de luz da lâmpada e poeira dourada no ar. Não muda.
- **Cores:** madeira, latão (sempre com o gradiente `oficina-antiga-latao`), papel velho, ferro, azul de vidro pra água, verde de folha (`COR`).
- **Forma:** objeto de verdade feito de latão, lata e madeira, com sombra jogada na bancada. Nada flutua sem motivo: o que está no alto pende de um fio (`Fio`).
- **Letra:** Anton gravado em placa de latão nos títulos (`Placa`), Playfair 700 em etiqueta de papel nos rótulos e na legenda.
- **Movimento:** engrenagens girando sempre, peças descendo pelo fio, mar de cilindros com manivela, folhas que abrem como brinquedo de corda. A câmera chega devagar e deriva de lado.
- **Transição:** o diafragma de latão fecha no fim da cena e abre no começo da próxima (`Diafragma`, cenas sem fusão).
- **Legenda:** Playfair 700, papel velho, palavra dita em ouro, a 71% da altura, com sombra escura.

**Por quê:** Mostrar o mecanismo como brinquedo de latão em cima da mesa faz a pessoa ver como as partes se movem. A luz quente dá encanto de coisa antiga e bem feita.

## As peças
Em `sistema/animacoes/src/estilos/oficina-antiga/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/oficina-antiga'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Engrenagem` | engrenagem de latão que gira; a vida de toda cena |
| `Fio` | o fio que segura do teto o que está no alto |
| `Placa` | título gravado em placa de latão rebitada, que cai e assenta |
| `Etiqueta` | texto curto à pena numa etiqueta de papel |
| `Diafragma` | a transição: fecha e abre a cena |
| `pol` | ponto na volta de um círculo, em graus (pra dentes, raios, ponteiros) |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, que servem de molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pergunte como um artesão montaria aquilo na bancada com latão, lata e madeira: um corpo simples, um detalhe de
latão (rebite, aro, manivela) e uma parte que se mexe. Ponha a sombra (`filter="url(#oficina-antiga-sombra)"`), apoie
na bancada ou pendure num `Fio`. Se o assunto tem mecanismo, mostre as engrenagens girando.

**Exemplo trabalhado:** "Como funciona um relógio de corda": a caixa de latão na bancada, a manivela que dá corda, a mola em espiral que se aperta, as engrenagens que giram na palavra "giram", e o ponteiro pendurado num Fio que anda.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo oficina-antiga`, em `animacoes/estilos/fotos/oficina-antiga-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo oficina-antiga` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Coisa solta no ar sem fio, e desenho chapado sem sombra: aqui tudo é objeto.
- Mais de três engrenagens grandes na mesma cena.
- Cor fria dominando: a luz é sempre quente.
- Texto abaixo de 56 de tamanho.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
