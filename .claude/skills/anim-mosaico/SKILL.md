---
name: anim-mosaico
description: Estilo de animação Mosaico do EditOS: painel de pedrinhas de vidro e ouro que viram em onda. Use quando pedirem vídeo animado "mosaico", "pastilha", "bizantino" ou o tema for curiosidade, história ou abertura marcante.
---

# Mosaico: estilo de animação do EditOS

**2D.** A tela inteira é um painel de pedrinhas de vidro e ouro sobre argamassa; na troca de cena, as pedras viram uma a uma em onda.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** curiosidade, história, abertura marcante, explicação de poucas etapas com imagem forte.
- **Pedidos que chamam este estilo:** "mosaico", "pastilha", "bizantino", ou um tema de curiosidade, história ou abertura marcante.
- **Quando não:** Explicação com muitos passos pequenos ou detalhe fino: menos de 3 pedras não aparece. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** argamassa cinza-quente com grão de cimento, que aparece só entre as pedras.
- **Cores:** vidro fosco em azuis, verdes, terra, marfim e cinza, mais o ouro (`COR`). Cada pedra varia um pouco o brilho; o ouro cintila numa faixa de luz que passa em diagonal.
- **Forma:** tudo é feito de pedras quadradas de 30 (numa tela de 1080), levemente tortas e desencontradas. Forma grande e chapada, com contorno de uma pedra de largura pra ler.
- **Letra:** Cinzel em caixa alta, marfim, numa faixa azul-noite com friso de ouro (`Letreiro`). Legenda em Marcellus.
- **Movimento:** dentro da cena as pedras trocam de cor pra animar (mar ondula, chuva desce, planta cresce, nuvem incha), sempre pedra por pedra, nunca liso.
- **Transição:** a virada: cada pedra gira sobre si e mostra a cor nova quando a onda que sai do centro passa por ela (`virada`, 1,2 s).
- **Legenda:** Marcellus, branca com sombra preta forte, palavra dita em ouro claro, a 72% da altura.

**Por quê:** Cada imagem é feita de pedras, então a troca de cena (as pedras virando em onda) é um espetáculo em si. A silhueta forte e o ouro dão solenidade.

## As peças
Em `sistema/animacoes/src/estilos/mosaico/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/mosaico'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Painel` | pinta a tela de pedras pelo campo; com `antes` e `p`, faz a virada |
| `Campo`, `empilha` | o desenho como função "cor da pedra no ponto"; empilhar é juntar desenhos |
| `tudo`, `disco`, `anel`, `abaixo`, `faixas`, `contorno` | os campos básicos |
| `Letreiro` | a inscrição em faixa escura com friso de ouro |
| `virada(t)` | o `p` da onda de pedras no começo da cena |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos como campos, molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense em quem assenta pedra: silhueta grande, duas ou três cores, contorno escuro. Monte com `disco`, `abaixo` e
`faixas` empilhados, e passe `contorno()` em volta do que precisa destacar do fundo. Movimento é a forma mudando
com `t` (as pedras é que trocam de cor). Coisa menor que 3 pedras não aparece.

**Exemplo trabalhado:** "A história da coroa": a silhueta de uma coroa em ouro sobre azul, o rei como figura de pedras de perfil, a joia vermelha que acende no centro, e a onda de pedras que vira a coroa num capacete na troca de assunto.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo mosaico`, em `animacoes/estilos/fotos/mosaico-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo mosaico` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Detalhe pequeno ou linha fina: não cabe em pedra.
- Texto solto na tela: escrita só no `Letreiro`.
- Degradê liso: céu em degradê é `faixas` de pedra.
- Cena com mais de 3 coisas: o mosaico precisa de uma imagem dominante.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
