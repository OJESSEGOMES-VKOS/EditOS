---
name: anim-teatro
description: Estilo de animação Teatrinho de papel do EditOS: palco de brinquedo com cortina vermelha e recortes de cartolina. Use quando pedirem vídeo animado "teatrinho", "teatro de papel", "palco" ou o tema for história pra criança ou fábula.
---

# Teatrinho de papel: estilo de animação do EditOS

**3D leve.** Um palco de brinquedo com cortina vermelha, onde tudo é recorte de cartolina em vareta, em camadas.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** história contada pra criança, fábula, explicação com começo, meio e fim, curiosidade leve.
- **Pedidos que chamam este estilo:** "teatrinho", "teatro de papel", "palco", ou um tema de história pra criança ou fábula.
- **Quando não:** Tema adulto sério, número preciso ou interface. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** plateia escura e quente, com as cabeças do público em sombra lá embaixo. O palco ocupa a parte de cima.
- **Palco:** moldura de madeira com filete dourado, bandô vermelho com franja, ribalta com lâmpadas que tremem.
- **Cenário:** céu pintado no fundo e recortes em camadas a distâncias diferentes; o palco vira um pouco, e as camadas
  andam uma contra a outra (é isso que dá a profundidade).
- **Cores:** cartolina viva e chapada (`COR`): amarelo, laranja, vermelho, azuis, verdes, branco. Todo recorte ganha
  borda branca de papel, grão e sombra no cenário de trás.
- **Letra:** Rye no cartaz (letra de cartaz de circo antigo), Alfa Slab One na legenda.
- **Movimento:** as coisas entram como num teatrinho de verdade: sobem do chão na vareta, entram de lado, caem do
  alto pendurado em fio. Depois balançam, giram ou boiam.
- **Transição:** a cortina abre no começo da cena e fecha no fim (`cortinaDe`).
- **Legenda:** Alfa Slab One, creme, palavra dita em amarelo, a 72% da altura, abaixo do palco.

**Por quê:** A cortina e as camadas de palco dizem "lá vem uma história": a pessoa se acomoda pra ouvir. Os recortes em vareta entram com charme de brinquedo.

## As peças
Em `sistema/animacoes/src/estilos/teatro/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/teatro'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Palco` | a boca de cena: recebe as camadas e desenha moldura, ribalta e cortina |
| `Camada` | uma camada do cenário numa distância (`z` negativo vai pro fundo) |
| `Ceu` | o céu pintado do fundo, sempre a primeira camada |
| `Recorte` | qualquer forma vira cartolina com borda branca e sombra; `vareta` põe a haste |
| `Cartaz` | o texto: placa que desce do alto em dois fios e balança |
| `cortinaDe` | a transição: quanto a cortina está fechada naquele segundo |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, que servem de molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense como quem recorta cartolina com tesoura: um contorno simples, uma ou duas cores por cima, e pronto. Ponha as
formas dentro de um `Recorte` (ele dá a borda e a sombra) e escolha a entrada: subir na vareta, entrar de lado ou
cair do alto. Coisa do fundo vai numa `Camada` de `z` negativo; o que é o assunto da cena fica na camada da frente.

**Exemplo trabalhado:** "Os três porquinhos e o material da casa": o palco com a casa de palha (recorte amarelo), a de madeira (marrom) e a de tijolo (vermelho) entrando em varetas, o lobo que sopra e as casas que caem uma a uma.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo teatro`, em `animacoes/estilos/fotos/teatro-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo teatro` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Degradê e detalhe fino dentro do recorte: papel é chapado.
- Mais de três camadas além do céu: o palco fica bagunçado.
- Pôr assunto fora da boca de cena: o que fica fora da moldura não aparece.
- Texto solto sem cartaz: no teatrinho, texto é placa pendurada.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
