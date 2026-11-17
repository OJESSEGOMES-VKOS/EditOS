---
name: anim-linha-do-tempo
description: Estilo de animação Linha do tempo do EditOS: fio dourado numa noite azul, de marco em marco. Use quando pedirem vídeo animado "linha do tempo", "em etapas", "a história de" ou o tema for evolução, história em datas ou "em N passos".
---

# Linha do tempo: estilo de animação do EditOS

**2D.** Um fio dourado atravessa uma noite azul-marinho e a câmera viaja por ele de marco em marco; cada marco acende com um ícone em traço de ouro, um nome e um rótulo.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** história em etapas, passo a passo, processo, evolução de algo, antes e depois, "em N passos".
- **Pedidos que chamam este estilo:** "linha do tempo", "em etapas", "a história de", ou um tema de evolução, história em datas ou "em N passos".
- **Quando não:** Tema sem ordem no tempo, ou com uma etapa só. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** noite azul-marinho com um véu de luz no meio e estrelas miúdas que andam mais devagar que a câmera (parece profundidade).
- **Cores:** ouro (`COR.ouro`, com tons claro e escuro), marfim pros nomes e névoa azul. Nada de outra cor: tudo que é desenho é ouro.
- **Traço:** linha de ouro com brilho, que se desenha (`Ouro`). Ícone simples, de placa de museu: contorno e um ou dois detalhes cheios.
- **Letra:** Cinzel nos nomes e no contador (maiúscula clássica), Lora itálica nos rótulos e na legenda.
- **Movimento:** a câmera viaja pelo fio de um marco ao próximo, com um leve recuo no meio da viagem; o marco acende quando ela chega. Os ícones respiram (raio gira, chuva cai, folha balança). Os marcos que já passaram ficam apagados.
- **Transição:** a própria viagem (`Percurso` com `viagem` de 0 a 1). Toda cena desenha a linha inteira, então o corte não aparece; use fusão 0 entre as cenas.
- **Legenda:** Lora itálica 600, marfim, palavra dita em ouro, a 72% da altura.

**Por quê:** A câmera viajando pelo fio dá a sensação de percurso: a pessoa sabe onde está e quanto falta. Cada marco acende, então a ordem fica gravada.

## As peças
Em `sistema/animacoes/src/estilos/linha-do-tempo/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/linha-do-tempo'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Ouro` | traço de ouro que se desenha; `cheio` pinta por dentro |
| `MarcoDados` | o que vai num marco: `nome` (até 3 palavras), `rotulo` (curto: data, número, palavra) e `Icone` |
| `Marco` | o nó, o ícone em cima e o nome e o rótulo embaixo |
| `Percurso` | a linha inteira vista pela câmera: `de`, `para` e `viagem` fazem a transição |
| `Contador` | "PASSO 2 DE 4" no alto |
| `useMedidas` | onde ficam o fio, o ícone, o nome e o rótulo, no vertical e no deitado |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta`, `Vapor` | ícones prontos, que servem de molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Todo ícone é um `Icone`: recebe centro, tamanho, `p` e `t`, e é feito de `Ouro` (listas de pontos, `circulo()` pras
redondas, `reto` pras quinas). Pense em placa de museu: o contorno e um detalhe. Um livro é um retângulo com uma
linha no meio; um carro é uma caixa com duas rodas. Data só se for conferida; se for aproximada, escreva "c." ou a
época, nunca invente o ano.

**Exemplo trabalhado:** "A evolução do telefone": marcos com ícones em ouro, o aparelho de manivela, o de disco, o celular de antena e o smartphone, cada um com o nome e a época conferida ("c. 1880" quando for aproximado). Nada de data inventada.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo linha-do-tempo`, em `animacoes/estilos/fotos/linha-do-tempo-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo linha-do-tempo` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Mais de 7 marcos num vídeo curto: cada um precisa de uns 2 segundos parado pra ser lido.
- Nome comprido: mais de 3 palavras não cabe; o detalhe vai na legenda.
- Rótulo repetindo a frase da legenda inteira.
- Cor fora do ouro e marfim, ou ícone cheio de detalhe.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
