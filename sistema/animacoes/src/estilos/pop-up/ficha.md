# Livro pop-up

**Tipo:** 3D leve
**Cara:** Um livro aberto na mesa onde cada página levanta camadas de papel recortado, com profundidade e sombra de verdade.
**Bom pra:** história contada, criança, explicação leve em etapas, fábula, curiosidade com cenário.

## Como é

- **Fundo:** mesa de madeira escura e o livro aberto embaixo (capa vermelha, bloco de páginas creme). A dobra fica a 60% da altura (`DOBRA`) e tudo se levanta dali.
- **Cores:** cartolina fosca: céu, mar, sol, nuvem, verde, terra e vermelho (`COR`). Cada recorte tem a borda branca do corte.
- **Forma:** recortes chapados (sem contorno de desenho), com grão de papel e sombra projetada na camada de trás (filtro `pop-up-papel`).
- **Profundidade:** 3 a 4 camadas por página, do fundo (`z` -300, o céu) à frente (`z` +60). O palco balança de leve.
- **Letra:** Fraunces 900, impressa numa plaquinha de papel (`Placa`).
- **Movimento:** as camadas se levantam em fila do fundo pra frente, com um pequeno passo além do ponto (elástico); dentro delas a coisa vive (sol gira, mar ondula, gota cai, planta cresce).
- **Transição:** `virar`: no fim da cena as camadas deitam da frente pro fundo e a página seguinte se ergue.
- **Legenda:** Fraunces 900, tinta escura com halo creme, palavra dita em vermelho, a 74% da altura (em cima das páginas).

## As peças

| Peça | O que faz |
|---|---|
| `Pagina` | o palco 3D do livro; tudo de uma cena vai dentro |
| `Camada` | uma folha de papel que se levanta da dobra (`z` = distância, `p` = 0 deitada, 1 em pé) |
| `Recorte` | uma forma de papel cortado com borda branca |
| `Placa` | texto numa plaquinha de papel |
| `virar(t, dur, i, n)` | o `p` de cada camada: levanta no começo, deita no fim (a transição) |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos em papel, molde pros novos |

## Pra desenhar coisa nova

Pense em quem monta um livro pop-up com tesoura: cada coisa é uma silhueta chapada de uma ou duas cores, e a
profundidade vem das camadas, não do desenho. Ponha o que é longe no fundo (`z` negativo) e o que é perto na frente.
Tudo que encosta no chão desce até a linha da dobra.

## Evite

- Mais de 5 camadas numa página: o papel vira bagunça.
- Detalhe fino (linha, contorno, texto pequeno): papel cortado é forma grande.
- Coisa abaixo da dobra: ali é a página deitada e a legenda.
- Camada com `z` maior que +120: chega perto demais e sai da tela.
