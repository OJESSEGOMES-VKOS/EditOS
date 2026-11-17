---
name: anim-degrade
description: Estilo de animação Degradê vivo do EditOS: manchas de cor que passeiam, palavra gigante e formas de vidro fosco. Use quando pedirem vídeo animado "degradê", "moderno", "clean", "cara de app" ou o tema for dica, conceito, lista, marca ou produto.
---

# Degradê vivo: estilo de animação do EditOS

**2D.** Manchas enormes de cor que passeiam devagar; na frente, uma palavra gigante que sobe da linha e formas de vidro fosco.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** dica rápida, conceito, lista, marca, produto, tom moderno e limpo.
- **Pedidos que chamam este estilo:** "degradê", "moderno", "clean", "cara de app", ou um tema de dica, conceito, lista, marca ou produto.
- **Quando não:** História com personagem, cena com muitos objetos ou tom rústico e afetivo. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** quatro manchas de cor (degradê) que se movem devagar, com grão fino por cima. Cada cena tem a sua
  paleta (`PALETA`: noite, calor, céu, mar, folha, lilás); a fusão entre cenas troca as cores.
- **Cores:** as da paleta da cena no fundo; na frente, só branco (texto) e vidro (branco translúcido com borda clara).
- **Traço:** não tem traço desenhado. Toda forma é vidro fosco: preenchimento branco em degradê, borda clara fina e
  sombra macia (`Vidro`). Formas geométricas e arredondadas.
- **Letra:** Inter Tight 800, gigante, apertada, alinhada à esquerda, uma palavra-chave por cena (`Palavra`), com um
  rótulo pequeno espaçado em cima quando precisa.
- **Movimento:** cada palavra sobe de trás de uma linha, uma depois da outra; as formas crescem do centro; o fundo
  nunca para.
- **Transição:** a palavra sai por cima e a paleta da próxima cena funde por cima da anterior (0,5 s).
- **Legenda:** Inter Tight 800, branca, palavra dita em amarelo-claro, a 74% da altura, com sombra escura.

**Por quê:** A palavra gigante resume o conceito e o vidro fosco mostra um ícone sem roubar a atenção. As manchas que passeiam dão movimento constante sem precisar de desenho complexo.

## As peças
Em `sistema/animacoes/src/estilos/degrade/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/degrade'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Manchas` | o degradê vivo; ponha no começo de toda cena com a paleta dela |
| `Vidro` | dá a cara de vidro fosco a qualquer forma SVG dentro dele; `p` faz crescer do centro; `forte` deixa mais opaco |
| `Palavra` | a palavra gigante que sobe; `some` faz sair |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, que servem de molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense em ícone: o objeto em uma a três formas simples (círculo, retângulo arredondado, elipse, um caminho curto),
cada uma dentro de um `Vidro`. Peça principal com `forte`, detalhe sem. A palavra da cena diz o conceito em uma
palavra (calor, vapor, chuva), sem repetir a frase da legenda.

**Exemplo trabalhado:** "3 jeitos de economizar na conta de luz": a palavra "LUZ" sobe gigante; um vidro com uma lâmpada (círculo e retângulo arredondado) que apaga; "BANHO" com um vidro de chuveiro; "TOMADA" com o plugue saindo. Uma palavra por cena, nunca a frase inteira da legenda.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo degrade`, em `animacoes/estilos/fotos/degrade-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo degrade` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Detalhe e textura dentro da forma: o vidro é liso.
- Mais de 3 palavras na `Palavra`, e qualquer texto abaixo de 56.
- Duas paletas fortes misturadas na mesma cena.
- Cor chapada na frente: na frente só existe branco e vidro.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
