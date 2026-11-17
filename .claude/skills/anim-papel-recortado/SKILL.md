---
name: anim-papel-recortado
description: Estilo de animação Papel recortado do EditOS: recortes de papel colorido em stop-motion de mesa. Use quando pedirem vídeo animado "papel recortado", "recorte", "stop-motion" ou o tema for história infantil, explicação simples ou natureza.
---

# Papel recortado: estilo de animação do EditOS

**2D.** Recortes de papel colorido com borda de tesoura e sombra, animados aos trancos como stop-motion de mesa.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** história infantil, explicação simples, conto, curiosidade da natureza.
- **Pedidos que chamam este estilo:** "papel recortado", "recorte", "stop-motion", ou um tema de história infantil, explicação simples ou natureza.
- **Quando não:** Tema sério e solene, ou que pede movimento suave e contínuo. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** cada cena é uma folha de papel de uma cor só, cobrindo a mesa. A luz de luminária faz vinheta quente e oscila um pouco.
- **Cores:** papel de dobradura chapado (`COR`): creme, azul-noite, céu, quatro azuis de mar, laranja, amarelo, vermelho, três verdes, cinza. Sem degradê.
- **Forma:** toda peça tem borda de tesoura (cortes retos, levemente tortos), grão de fibra e sombra que mostra a altura sobre a mesa.
- **Movimento:** 12 poses por segundo (`passo`). As peças entram pulando ou deslizando da borda, passam um pouco e voltam, e tremem de leve a cada pose.
- **Letra:** DM Serif Display no papel rasgado; Archivo Black na etiqueta vermelha e na legenda.
- **Transição:** uma folha nova, de borda rasgada, sobe do pé da tela e cobre a cena (`FolhaNova`), já com a cor da cena seguinte.
- **Legenda:** Archivo Black creme, palavra dita em amarelo, sombra escura, a 72% da altura.

**Por quê:** O tranco do stop-motion e a borda de tesoura deixam claro que é feito à mão: simpático e fácil de seguir. Duas a cinco formas por objeto mantêm tudo legível.

## As peças
Em `sistema/animacoes/src/estilos/papel-recortado/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/papel-recortado'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `passo` | trava o tempo em 12 poses por segundo; toda cena passa o `t` por ele |
| `Mesa` | a folha de fundo da cena, os filtros do papel e a luz; tudo vai dentro dela |
| `Recorte` | uma ou várias formas coladas que entram (`de`: pula, baixo, cima, esquerda, direita) e tremem |
| `cortar`, `roda`, `estrela`, `caixa`, `morro` | as formas: contorno de tesoura, elipse, estrela, retângulo, faixa ondulada até o pé |
| `Etiqueta` | texto em papel rasgado, com etiqueta vermelha opcional |
| `FolhaNova` | a transição: folha rasgada que sobe e cobre |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, molde pros novos |

## A invenção (o que a fala nova pede e o exemplo não tem)
Pense no objeto como alguém recortaria com tesoura em um minuto: duas a cinco formas simples coladas (elipse,
retângulo, triângulo, estrela), cada uma de uma cor chapada. Peixe é uma elipse com um triângulo de rabo; casa é uma
caixa com um triângulo. Junte as formas num `Recorte` só quando elas se movem juntas.

**Exemplo trabalhado:** "Como a semente vira árvore": a semente marrom (elipse) num chão recortado, a raiz que desce em tiras, o broto verde, o tronco de retângulo e a copa de três círculos, cada um entrando aos trancos.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo papel-recortado`, em `animacoes/estilos/fotos/papel-recortado-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo papel-recortado` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Movimento liso: sem o `passo`, perde a cara de stop-motion.
- Detalhe fino (linha, texto pequeno): tesoura não faz.
- Mais de uma cor de fundo na mesma cena.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
