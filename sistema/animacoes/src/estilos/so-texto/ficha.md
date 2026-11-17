# Só texto

**Tipo:** 2D
**Cara:** Nada de desenho: a frase é a peça. Serifada fina em itálico no centro de um fundo escuro e quente, as palavras saindo do desfoque no tempo em que são ditas, com um rótulo dourado e uma luz que respira atrás.
**Bom pra:** citação, reflexão, frase de impacto, regra ou lista curta, vídeo solene sem narração ou com voz calma.

## Como é

- **Fundo:** quase preto quente (`#0b0907`) com vinheta. Atrás do texto, uma mancha de luz (`Luz`) que passeia devagar; o tom dela (`TOM`) muda com o clima da frase (brasa, mar, folha, noite). Nada de imagem.
- **Cores:** creme no texto, ouro velho no rótulo, no fio e em UMA ou duas palavras-chave da frase. Nenhuma outra cor.
- **Letra:** Cormorant Garamond itálico 500, grande (130 a 170 numa tela de 1080), no centro, em duas ou três linhas quebradas onde a frase respira. Cormorant SC (versalete), espaçado, no rótulo e no rodapé.
- **Movimento:** cada palavra sai do desfoque e sobe um pouco, no segundo em que é dita (`temposDaFrase`). O fio de ouro cresce do centro. A luz respira. Mais nada se mexe: a calma é a cara do estilo.
- **Transição:** o bloco sobe um pouco e apaga nos últimos 0,3 s (`Saida`); a cena seguinte nasce com corte, fusão 0.
- **Legenda:** **desligada** (`legenda={false}`). A frase já está escrita no centro; legenda embaixo seria a mesma frase duas vezes.

## As peças

| Peça | O que faz |
|---|---|
| `Luz` | a mancha de luz que respira atrás do texto, no tom do clima (`TOM`) |
| `Rotulo` | o versalete dourado espaçado em cima (capítulo, passo, lugar), até 4 palavras |
| `Fio` | o fio de ouro que cresce do centro |
| `Frase` | a frase palavra por palavra, do desfoque pro nítido; `ouro` pinta as palavras-chave; `\n` quebra a linha |
| `Rodape` | a fonte, o número, a referência, em versalete pequeno, depois da frase |
| `Saida` | a saída da cena: sobe e apaga |
| `temposDaFrase` | os segundos de cada palavra dita, pra o texto acompanhar a voz |
| `Quadro` | o molde de uma cena inteira: luz, rótulo, fio, frase e rodapé |

## Pra fazer coisa nova

Aqui não se desenha: a invenção é de leitura. Para cada frase decida (1) onde ela quebra em linhas pra respirar
(nunca mais de 4 palavras por linha), (2) qual palavra é a chave e vai em ouro (a que a voz enfatiza, uma, no máximo
duas), (3) o tom da luz pelo sentido (perda e noite: `noite`; calor, raiva, fogo: `brasa`; vida e começo: `folha`)
e (4) o rótulo: o que situa a frase sem repeti-la ("Passo dois", "1998", "Lei de Newton"). Frase longa vira duas
cenas, não letra menor. Dado com fonte vai no `Rodape`.

## Evite

- Imagem, ícone ou desenho: o estilo é só texto. Precisa de imagem? Outro estilo (`maquina` põe um traço de ouro).
- Legenda ligada junto com a frase escrita.
- Mais de duas palavras em ouro, ou ouro em palavra fraca ("de", "que").
- Letra abaixo de 110 na frase, ou frase de mais de 16 palavras numa cena.
- Movimento forte (tremor, giro, zoom): a calma é o estilo. Pra texto com energia, `tipografia`.
