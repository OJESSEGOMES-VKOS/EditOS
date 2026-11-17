---
name: anim-papel-e-sombras
description: Estilo de animação Papel e sombras do EditOS: recortes de papel em varetas na frente de um pano aceso por lamparina. Use quando pedirem vídeo animado "papel e sombras", "palquinho", "lamparina" ou o tema for conto, fábula ou curiosidade da natureza.
---

# Papel e sombras: estilo de animação do EditOS

**2D.** Palquinho de mesa: recortes de papel colorido em varetas, na frente de um pano aceso por uma lamparina, cada um jogando a sua sombra que dança com a chama.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** conto, fábula, curiosidade da natureza, explicação com clima aconchegante.
- **Pedidos que chamam este estilo:** "papel e sombras", "palquinho", "lamparina", ou um tema de conto, fábula ou curiosidade da natureza.
- **Quando não:** Tema técnico com número, interface ou assunto urgente. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** o palco. Pano cor de pergaminho aceso de baixo (mais claro embaixo, escurece nas bordas), com trama de tecido; cortinas vermelhas com pregas dos lados, bambinela em ondas no alto e o tablado de madeira embaixo, onde mora a legenda. A luz tremula sempre um pouco.
- **Cores:** papel de cartolina vivo (`COR`): amarelo, laranja, azuis, celeste, branco, verdes, terra. A sombra é marrom-escuro quente, nunca preto puro.
- **Recorte:** cada objeto é papel colorido com uma borda branca de tesoura e grão de papel (o filtro `pes-papel`), preso numa vareta que sai por baixo do palco.
- **A sombra (a marca do estilo):** todo recorte joga a sua sombra no pano. `prof` diz o quanto ele está longe do pano: perto da luz, a sombra fica maior, mais deslocada e mais borrada. Ela anda quando a chama tremula.
- **Movimento:** recorte entra subindo pela vareta com um tranco (`subida`), balança de leve, gira se for sol ou flor. Nada desliza liso demais: é mão de quem segura.
- **Letra:** Marcellus (letra de cartaz antigo), no letreiro de papel e na legenda.
- **Transição:** a cortina vermelha fecha no fim da cena e abre na próxima (`Cortina`).
- **Legenda:** Marcellus, creme com sombra escura, palavra dita em amarelo, a 74% da altura, em cima do tablado.

**Por quê:** A sombra que dança com a chama dá vida e aconchego de história contada à noite. Cor do papel na frente e sombra atrás dão duas camadas de leitura.

## As peças
Em `sistema/animacoes/src/estilos/papel-e-sombras/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/papel-e-sombras'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Palco` | recorta a cena dentro do pano; tudo da cena vai dentro dele |
| `usePano` | onde fica o pano (x, y, largura, altura) pra posicionar as coisas |
| `Recorte` | um papel colorido com borda, vareta e sombra no pano |
| `subida`, `chama` | a entrada pela vareta e a tremulação da luz |
| `Letreiro` | letra de papel recortada que desce e balança, com sombra |
| `Cortina` | a transição |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos; `estrelaD`, `ondaD`, `NUVEM_D`, `GOTA_D`, `FOLHA_D`, `CHAO_D` são contornos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Escreva o contorno como quem corta com tesoura, em volta do (0, 0), numa escala de uns 100: poucas curvas, forma
cheia, sem buraco no meio. Uma cor de papel por peça; objeto de duas cores vira dois recortes. Coisa grande e de fundo
(mar, terra) vai com `prof` baixo e sem vara; personagem e objeto principal com `prof` alto e vara.

**Exemplo trabalhado:** "Como o vaga-lume acende": um vaga-lume de papel numa vareta, o rabinho de papel amarelo que brilha, a sombra dele crescendo no pano, e a mata de recortes verdes ao fundo com prof baixo.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo papel-e-sombras`, em `animacoes/estilos/fotos/papel-e-sombras-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo papel-e-sombras` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Detalhe fino ou linha solta: papel recortado é forma cheia.
- Recorte encostado na borda do pano: o centro do palco é onde a luz está.
- Preto puro e cor neon: quebram o calor da lamparina.
- Texto pequeno: nada abaixo de 56 de tamanho.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
