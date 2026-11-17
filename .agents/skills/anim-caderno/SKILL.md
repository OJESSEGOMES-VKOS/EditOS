---
name: anim-caderno
description: Estilo de animação Rabisco de caderno do EditOS: caneta azul em folha pautada, com círculo vermelho no que importa. Use quando pedirem vídeo animado "no caderno", "rabisco de caderno", "anotação de aula" ou o tema for dica rápida ou estudo.
---

# Rabisco de caderno: estilo de animação do EditOS

**2D.** Caneta esferográfica azul numa folha pautada de caderno, com traço tremido que ferve e círculo de caneta vermelha no que importa.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** dica rápida, explicação leve, estudo, "anotação de aula", conteúdo descontraído.
- **Pedidos que chamam este estilo:** "no caderno", "rabisco de caderno", "anotação de aula", ou um tema de dica rápida ou estudo.
- **Quando não:** Tema solene, luxo, luto ou peça de marca sofisticada: o caderno puxa pro descontraído. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** folha de caderno creme, pauta azul clara, margem vermelha e os furos do fichário.
- **Cores:** azul de caneta em quase tudo. Vermelho pra destacar (círculo, seta), verde e laranja de caneta colorida só pra dar cor a uma coisa por cena.
- **Traço:** caneta em duas passadas, tremida, que "ferve" (o tremor muda 7,5 vezes por segundo, como desenho animado à mão). Sempre se desenha.
- **Cor por dentro:** rabisco em zigue-zague contínuo (`Rabisco`), como quem pinta com caneta.
- **Letra:** Caveat 700, letra de mão, um pouco torta, escrita da esquerda pra direita.
- **Movimento:** desenha, ferve sempre (nunca fica parado de verdade), balança. Câmera parada.
- **Transição:** cada cena chega numa folha nova que desce por cima (`Folha`).
- **Legenda:** Caveat 700 azul com halo de papel, palavra dita em vermelho, a 72% da altura.

**Por quê:** Parece a anotação de um colega que entendeu a matéria: informal, próxima e fácil de seguir. O círculo vermelho diz onde olhar, e o traço que ferve dá vida mesmo no desenho parado.

## As peças
Em `sistema/animacoes/src/estilos/caderno/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/caderno'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Folha` | a página da cena e a transição; tudo da cena vai dentro dela |
| `Caneta` | traço de caneta que se desenha e ferve (passe sempre o `t`) |
| `Rabisco` | zigue-zague que pinta dentro de uma forma; precisa de `id` único |
| `Escrito` | texto à mão que vai sendo escrito |
| `Circulado` | círculo de caneta vermelha em volta do que importa |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde dos novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Desenhe como um aluno na margem do caderno: contorno simples com `Caneta` (`fechado` pra forma fechada), uma cor em
`Rabisco` por dentro, e no fim um `Circulado` ou uma seta vermelha no ponto principal. Pessoa é bonequinho de palito
feito de `Caneta` (círculo e cinco riscos).

**Exemplo trabalhado:** "Como estudar pra prova em uma semana": um calendário de 7 quadradinhos à caneta, cada dia riscado na palavra "dia"; um bonequinho de palito com um livro; uma seta vermelha pro dia da revisão; o "PROVA" circulado em vermelho no fim. Cada objeto nasce de uma palavra da fala.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo caderno`, em `animacoes/estilos/fotos/caderno-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo caderno` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Pintar tudo: o rabisco é pra uma ou duas coisas por cena, o resto fica só no contorno.
- Muita cor: azul manda, vermelho destaca, verde e laranja aparecem pouco.
- Texto pequeno: nada abaixo de 56 de tamanho.
- Desenho na margem esquerda (antes da linha vermelha) ou embaixo, na faixa da legenda.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
