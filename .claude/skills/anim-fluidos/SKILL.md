---
name: anim-fluidos
description: Estilo de animação Fumaça e água do EditOS: fumaça, fogo e água macios, sem contorno. Use quando pedirem vídeo animado "fumaça", "fluido", "aquarela em movimento" ou o tema for natureza, clima, física ou química.
---

# Fumaça e água: estilo de animação do EditOS

**2D.** Tudo é fluido e macio, sem contorno: fumaça que sobe enrolando, fogo que respira, água em faixas de luz.

Segue o `sistema/JEITO.md`: a personalidade do estilo vale pra qualquer fala; o exemplo do estilo (o ciclo da água)
mostra o jeito, nunca o roteiro do vídeo novo.

## Quando usar
- **Bom pra:** natureza, clima, física, química, tema calmo e contemplativo.
- **Pedidos que chamam este estilo:** "fumaça", "fluido", "aquarela em movimento", ou um tema de natureza, clima, física ou química.
- **Quando não:** Lista, número, interface, objeto que precisa ser reconhecido no detalhe. Sugira outro do `sistema/animacoes/estilos/INDICE.md`.

## A personalidade (herda sempre)
- **Fundo:** névoa escura azulada que se mexe devagar, com vinheta nas bordas.
- **Cores:** tons de fumaça e de natureza (`COR`): névoa, fogo e brasa, água e fundo d'água, céu, nuvem, verde e terra.
  O claro é sempre luz dentro da névoa, nunca cor chapada.
- **Traço:** não tem. As formas são manchas de densidade com borda de fumaça (o `fumo`), pintadas numa grade baixa
  que o navegador amacia.
- **Letra:** Cormorant Garamond 700 (serifada clássica), clara, subindo da névoa com desfoque (`Letreiro`).
- **Movimento:** tudo corre o tempo todo: a fumaça enrola, o fogo lambe, a água ondula. Coisa nova surge acendendo
  (`forca` de 0 a 1), nunca entra deslizando.
- **Transição:** a cena se desmancha em névoa (`apaga`) enquanto a próxima nasce por cima (fusão de 0,6 s).
- **Legenda:** Cormorant Garamond 700, creme, palavra dita em âmbar, a 74% da altura, com sombra larga escura.

**Por quê:** Nada tem borda: tudo flui como o fenômeno de verdade, e isso acalma e explica ao mesmo tempo. Coisa sólida entra só como silhueta, então o olho fica no movimento.

## As peças
Em `sistema/animacoes/src/estilos/fluidos/index.tsx`; da oficina, importe de `'../../animacoes/src/estilos/fluidos'` (e o kit de `'../../animacoes/src/kit'`):

| Peça | O que faz |
|---|---|
| `Fluido` | a tela de fumaça: pinta uma lista de camadas, ponto a ponto; `apaga` devolve tudo à névoa |
| `Camada` | o formato de toda camada: recebe a cor do ponto e devolve a nova |
| `fumo` | o ruído que enrola e anda; use em toda borda |
| `nevoa`, `ceu`, `Chao`, `Vapor` | camadas de base |
| `Sol`, `Nuvem`, `Chuva`, `Mar`, `Planta` | desenhos prontos, que servem de molde pros novos |
| `Letreiro` | o texto do estilo |

## A invenção (o que a fala nova pede e o exemplo não tem)
Uma coisa nova é uma camada: calcule a distância do ponto até a forma (círculo, oval, faixa), some um pouco de
`fumo` nessa distância pra a borda virar fumaça, e misture a cor com a densidade (`mistura`). Posição em fração da
tela (x e y de 0 a 1). Coisa sólida que precisa ser reconhecida (pessoa, bicho) entra como silhueta escura chapada
em SVG por cima do fluido.

**Exemplo trabalhado:** "Por que o café esfria": uma xícara em silhueta escura chapada; o vapor que sobe enrolando e afina com o tempo; o calor como uma mancha laranja que encolhe da borda pro centro; o ar frio como faixas azuis que entram pelos lados.

## O teste do clone (antes do render)
- Nenhuma cena do exemplo volta só porque "o estilo tem": sol, mar, nuvem, chuva e planta só entram se a fala nova
  falar deles. Cada objeto tem na tabela de cenas a palavra da fala que pediu ele.
- Ponha a folha do vídeo novo ao lado da do exemplo (`... fotos.mjs --estilo fluidos`, em `animacoes/estilos/fotos/fluidos-folha.jpg`): **mesmo estilo** (cor, traço, letra, legenda, transição) tem que ser sim; **mesmo vídeo** (mesmos
  objetos, textos e ordem) tem que ser não. Se parece o exemplo com outras palavras, o vídeo volta pra bancada.

## O caminho
Leia `sistema/animacoes/LEIA.md` (o caminho inteiro e as regras de fala e de cena). De dentro de `sistema/`:
1. `node animacoes/ferramentas/novo-video.mjs <nome> --estilo fluidos` e o roteiro (Ideia, Fala, Cenas com o porquê).
2. `node animacoes/ferramentas/voz.mjs <pasta>` (sem narração; `--motor arquivo --audio <a>` ou `--motor kie`).
3. `oficina/<pasta>/video.tsx`, depois `cd animacoes && npx tsc --noEmit -p .`.
4. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/fotos.mjs <pasta>`: abra a folha e olhe.
5. `QUEM=animacoes sh tools/com-trava.sh node animacoes/ferramentas/render.mjs <pasta>`: grava `out/final.mp4` e
   entrega em `<perfil>/conteudo/<tema>-DD-MM-AA/vN.mp4` (`SEM_ENTREGA=1` na frente pra rascunho).

## Nunca
- Forma de quina e detalhe fino: a grade é baixa de propósito, o miúdo some.
- Muitas camadas numa cena (mais de 6 pesa o render).
- Cor saturada chapada: o estilo é luz e névoa.
- Texto pequeno: nada abaixo de 56.
- Misturar com outro estilo no mesmo vídeo, ou trocar as cores do estilo sem o dono pedir.
- Personagem, marca ou pessoa real; fato, número ou data sem conferir.
