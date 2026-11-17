---
name: anim-so-texto
description: Estilo de animação Só texto do EditOS: a frase é a peça: serifada fina no escuro, palavra por palavra. Use quando pedirem vídeo animado "só texto", "só a frase", "texto elegante" ou o tema for citação, reflexão ou frase de impacto.
---

# Só texto: estilo de animação do EditOS

**2D.** Nada de desenho: a frase é a peça. Serifada fina em itálico no centro de um fundo escuro e quente, as palavras saindo do desfoque no tempo em que são ditas, com um rótulo dourado e uma luz que respira atrás.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** citação, reflexão, frase de impacto, regra ou lista curta, vídeo solene sem narração ou com voz calma.
- **Pedidos que chamam este estilo:** "só texto", "só a frase", "texto elegante", ou um tema de citação, reflexão ou frase de impacto.
- **Quando não:** Explicação que precisa de imagem pra ser entendida, lista longa ou ritmo rápido de motion (isso é a `tipografia`). Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** quase preto quente (`#0b0907`) com vinheta. Atrás do texto, uma mancha de luz (`Luz`) que passeia devagar; o tom dela (`TOM`) muda com o clima da frase (brasa, mar, folha, noite). Nada de imagem.
- **Cores:** creme no texto, ouro velho no rótulo, no fio e em UMA ou duas palavras-chave da frase. Nenhuma outra cor.
- **Letra:** Cormorant Garamond itálico 500, grande (130 a 170 numa tela de 1080), no centro, em duas ou três linhas quebradas onde a frase respira. Cormorant SC (versalete), espaçado, no rótulo e no rodapé.
- **Movimento:** cada palavra sai do desfoque e sobe um pouco, no segundo em que é dita (`temposDaFrase`). O fio de ouro cresce do centro. A luz respira. Mais nada se mexe: a calma é a cara do estilo.
- **Transição:** o bloco sobe um pouco e apaga nos últimos 0,3 s (`Saida`); a cena seguinte nasce com corte, fusão 0.
- **Legenda:** **desligada** (`legenda={false}`). A frase já está escrita no centro; legenda embaixo seria a mesma frase duas vezes.

**Por quê:** Sem imagem pra disputar, a frase ganha o peso de uma citação: o desfoque que assenta no tempo da voz faz ler junto, e a luz que respira dá clima sem distrair.

## As peças
Em `sistema/animacoes/src/estilos/so-texto/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/so-texto'` (e o kit de `'../../animacoes/src/kit'`):

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

## A invenção (o que a fala nova pede e o exemplo não tem)
Aqui não se desenha: a invenção é de leitura. Para cada frase decida (1) onde ela quebra em linhas pra respirar
(nunca mais de 4 palavras por linha), (2) qual palavra é a chave e vai em ouro (a que a voz enfatiza, uma, no máximo
duas), (3) o tom da luz pelo sentido (perda e noite: `noite`; calor, raiva, fogo: `brasa`; vida e começo: `folha`)
e (4) o rótulo: o que situa a frase sem repeti-la ("Passo dois", "1998", "Lei de Newton"). Frase longa vira duas
cenas, não letra menor. Dado com fonte vai no `Rodape`.

**Exemplo trabalhado:** "Três frases que um avô repetia" (3 cenas): rótulo "Primeira", "Segunda", "Terceira"; luz `terra`, `brasa` e `folha` conforme o sentido; uma palavra em ouro em cada ("paciência", "palavra", "casa"); a fonte no rodapé quando houver. Nada de mar, sol ou chuva.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo so-texto`, em `animacoes/estilos/fotos/so-texto-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo so-texto` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Imagem, ícone ou desenho: o estilo é só texto. Precisa de imagem? Outro estilo (`maquina` põe um traço de ouro).
- Legenda ligada junto com a frase escrita.
- Mais de duas palavras em ouro, ou ouro em palavra fraca ("de", "que").
- Letra abaixo de 110 na frase, ou frase de mais de 16 palavras numa cena.
- Movimento forte (tremor, giro, zoom): a calma é o estilo. Pra texto com energia, `tipografia`.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
