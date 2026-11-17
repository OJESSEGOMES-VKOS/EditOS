# Papel e sombras

**Tipo:** 2D
**Cara:** Palquinho de mesa: recortes de papel colorido em varetas, na frente de um pano aceso por uma lamparina, cada um jogando a sua sombra que dança com a chama.
**Bom pra:** conto, fábula, curiosidade da natureza, explicação com clima aconchegante.

## Como é

- **Fundo:** o palco. Pano cor de pergaminho aceso de baixo (mais claro embaixo, escurece nas bordas), com trama de tecido; cortinas vermelhas com pregas dos lados, bambinela em ondas no alto e o tablado de madeira embaixo, onde mora a legenda. A luz tremula sempre um pouco.
- **Cores:** papel de cartolina vivo (`COR`): amarelo, laranja, azuis, celeste, branco, verdes, terra. A sombra é marrom-escuro quente, nunca preto puro.
- **Recorte:** cada objeto é papel colorido com uma borda branca de tesoura e grão de papel (o filtro `pes-papel`), preso numa vareta que sai por baixo do palco.
- **A sombra (a marca do estilo):** todo recorte joga a sua sombra no pano. `prof` diz o quanto ele está longe do pano: perto da luz, a sombra fica maior, mais deslocada e mais borrada. Ela anda quando a chama tremula.
- **Movimento:** recorte entra subindo pela vareta com um tranco (`subida`), balança de leve, gira se for sol ou flor. Nada desliza liso demais: é mão de quem segura.
- **Letra:** Marcellus (letra de cartaz antigo), no letreiro de papel e na legenda.
- **Transição:** a cortina vermelha fecha no fim da cena e abre na próxima (`Cortina`).
- **Legenda:** Marcellus, creme com sombra escura, palavra dita em amarelo, a 74% da altura, em cima do tablado.

## Diferente dos vizinhos

- `papel-recortado`: papel deitado na mesa, em stop-motion, sem luz. Aqui o papel está em pé, de frente pra luz.
- `teatro-de-sombras`: só silhueta preta. Aqui o papel tem cor E sombra, as duas na tela.

## As peças

| Peça | O que faz |
|---|---|
| `Palco` | recorta a cena dentro do pano; tudo da cena vai dentro dele |
| `usePano` | onde fica o pano (x, y, largura, altura) pra posicionar as coisas |
| `Recorte` | um papel colorido com borda, vareta e sombra no pano |
| `subida`, `chama` | a entrada pela vareta e a tremulação da luz |
| `Letreiro` | letra de papel recortada que desce e balança, com sombra |
| `Cortina` | a transição |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos; `estrelaD`, `ondaD`, `NUVEM_D`, `GOTA_D`, `FOLHA_D`, `CHAO_D` são contornos |

## Pra desenhar coisa nova

Escreva o contorno como quem corta com tesoura, em volta do (0, 0), numa escala de uns 100: poucas curvas, forma
cheia, sem buraco no meio. Uma cor de papel por peça; objeto de duas cores vira dois recortes. Coisa grande e de fundo
(mar, terra) vai com `prof` baixo e sem vara; personagem e objeto principal com `prof` alto e vara.

## Evite

- Detalhe fino ou linha solta: papel recortado é forma cheia.
- Recorte encostado na borda do pano: o centro do palco é onde a luz está.
- Preto puro e cor neon: quebram o calor da lamparina.
- Texto pequeno: nada abaixo de 56 de tamanho.
