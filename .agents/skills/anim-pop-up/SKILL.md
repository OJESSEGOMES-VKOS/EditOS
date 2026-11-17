---
name: anim-pop-up
description: Estilo de animação Livro pop-up do EditOS: livro aberto onde cada página levanta camadas de papel recortado. Use quando pedirem vídeo animado "pop-up", "livro pop-up", "livro que abre" ou o tema for história contada, criança ou fábula.
---

# Livro pop-up: estilo de animação do EditOS

**3D leve.** Um livro aberto na mesa onde cada página levanta camadas de papel recortado, com profundidade e sombra de verdade.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** história contada, criança, explicação leve em etapas, fábula, curiosidade com cenário.
- **Pedidos que chamam este estilo:** "pop-up", "livro pop-up", "livro que abre", ou um tema de história contada, criança ou fábula.
- **Quando não:** Lista técnica, interface ou tema adulto pesado. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** mesa de madeira escura e o livro aberto embaixo (capa vermelha, bloco de páginas creme). A dobra fica a 60% da altura (`DOBRA`) e tudo se levanta dali.
- **Cores:** cartolina fosca: céu, mar, sol, nuvem, verde, terra e vermelho (`COR`). Cada recorte tem a borda branca do corte.
- **Forma:** recortes chapados (sem contorno de desenho), com grão de papel e sombra projetada na camada de trás (filtro `pop-up-papel`).
- **Profundidade:** 3 a 4 camadas por página, do fundo (`z` -300, o céu) à frente (`z` +60). O palco balança de leve.
- **Letra:** Fraunces 900, impressa numa plaquinha de papel (`Placa`).
- **Movimento:** as camadas se levantam em fila do fundo pra frente, com um pequeno passo além do ponto (elástico); dentro delas a coisa vive (sol gira, mar ondula, gota cai, planta cresce).
- **Transição:** `virar`: no fim da cena as camadas deitam da frente pro fundo e a página seguinte se ergue.
- **Legenda:** Fraunces 900, tinta escura com halo creme, palavra dita em vermelho, a 74% da altura (em cima das páginas).

**Por quê:** Cada página que abre é uma surpresa e dá profundidade de verdade. A dobra do livro organiza perto e longe, então a cena se lê na hora.

## As peças
Em `sistema/animacoes/src/estilos/pop-up/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/pop-up'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Pagina` | o palco 3D do livro; tudo de uma cena vai dentro |
| `Camada` | uma folha de papel que se levanta da dobra (`z` = distância, `p` = 0 deitada, 1 em pé) |
| `Recorte` | uma forma de papel cortado com borda branca |
| `Placa` | texto numa plaquinha de papel |
| `virar(t, dur, i, n)` | o `p` de cada camada: levanta no começo, deita no fim (a transição) |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos em papel, molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense em quem monta um livro pop-up com tesoura: cada coisa é uma silhueta chapada de uma ou duas cores, e a
profundidade vem das camadas, não do desenho. Ponha o que é longe no fundo (`z` negativo) e o que é perto na frente.
Tudo que encosta no chão desce até a linha da dobra.

**Exemplo trabalhado:** "A fábula da cigarra e da formiga": uma página com o campo de verão em camadas, a cigarra na frente com o violão de papel, a formiga carregando a folha; a página seguinte levanta a neve e a casinha da formiga.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo pop-up`, em `animacoes/estilos/fotos/pop-up-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo pop-up` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Mais de 5 camadas numa página: o papel vira bagunça.
- Detalhe fino (linha, contorno, texto pequeno): papel cortado é forma grande.
- Coisa abaixo da dobra: ali é a página deitada e a legenda.
- Camada com `z` maior que +120: chega perto demais e sai da tela.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
