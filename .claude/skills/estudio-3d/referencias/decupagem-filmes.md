# Decupagem de filmes de referência (medida, não opinião)

Feita pelo Claude Code em 2026-10-02. Os 9 filmes oficiais foram baixados em 480p, os cortes
detectados por mudança de cena (ffmpeg, limiar 0,28; 0,1 a 0,2 nos filmes de interface) e cada plano
foi visto em 2 quadros (25% e 75% da duração). As folhas de contato ficaram no estúdio de origem
(não vêm junto: aqui ficam só os números medidos).

Atenção: dois "filmes de referência" da lista do Cowork eram **trailers de fã** ("Introducing iPhone
17 Pro", canal 4RMD; "Nothing Phone (3) Trailer", Technizo Concept), e outro era um evento de 30 min.
Foram trocados pelos oficiais. Regra: decupar só filme publicado pela marca.

## Os números

| Filme (oficial) | Duração | Planos | Média | Mediana | Menor / maior | Linguagem |
|---|---|---|---|---|---|---|
| Apple iPhone 17 Pro | 60 s | 23 | 2,6 s | 1,8 s | 0,3 / 9,5 s | 3D de produto no vazio preto + cartelas de texto + demonstração |
| Apple iPhone Air | 54 s | 14 | 3,8 s | 1,8 s | 0,7 / 14,4 s | mundo claro, planos-sequência longos com texto dentro |
| Apple AirPods Pro 3 | 48 s | 11 | 4,4 s | 4,6 s | 1,1 / 9,1 s | branco, silhuetas humanas + grafismo do recurso |
| Apple MacBook Pro | 60 s | 13 | 4,6 s | 2,4 s | 0,9 / 16,7 s | escuro, produto com contorno, tela em demonstração |
| Nothing Phone (3) | 30 s | 15 | 2,0 s | 1,4 s | 0,6 / 5,0 s | live action + macro do produto em intercalação |
| Nothing Headphone (1) | 54 s | 24 | 2,3 s | 2,0 s | 0,6 / 5,6 s | live action num "laboratório" conceitual |
| Linear Agent (SaaS) | 55 s | 5 | 11,0 s | 9,8 s | 4,5 / 18,7 s | UI escura em perspectiva 3D, deriva lenta |
| Notion 3.0 (SaaS) | 90 s | 21 | 4,3 s | 2,5 s | 0,2 / 23,6 s | UI plana, digitação em tela cheia, ilustração |
| Framer Enterprise (SaaS) | 48 s | 7 | 6,8 s | 7,6 s | 1,4 / 12,4 s | UI escura flutuando em 3D, arcos de luz verde |

**Leitura:** hardware de consumo corta com mediana de 1,4 a 2,5 s; filme de SaaS sustenta planos de 5
a 19 s porque a câmera não para e a interface muda dentro do plano. O plano mais longo do filme (9 a
17 s) é quase sempre um **plano-sequência com várias batidas dentro** (texto troca, produto gira),
não um plano parado.

## Os 12 dispositivos que se repetem (e como fazer no Blender)

1. **Recurso = cartela + prova.** Apple alterna uma cartela de uma linha (fundo preto ou branco, texto
   pequeno e centrado, 1,3 a 3 s) com um plano que prova o recurso (macro, demonstração). Nunca
   parágrafo; nunca texto em cima de imagem carregada. No Blender: cartela é um plano à parte (ou o
   próprio vazio do mundo) com texto 3D ou sobreposição na pós; a prova é o plano de produto.
2. **Escada rítmica (staccato).** Uma progressão mostrada em cortes de 0,2 a 0,3 s: as distâncias
   focais 13 → 24 → 28 → 35 → 48 → 100 → 200 mm do iPhone 17 Pro; a digitação letra a letra do Notion
   (cada tecla, um corte). Mostra "muito" em pouco tempo e dá energia. No Blender: animar o `lens`
   em degraus (`'degrau'`) com corte a cada 8-9 quadros, ou trocar de câmera por marcador.
3. **O recurso vira grafismo que age.** AirPods: o cancelamento de ruído vira anéis concêntricos
   iridescentes em volta de uma silhueta. Nothing: a matriz de LEDs vira o jogo da garrafa. É a
   "metáfora visual" do cérebro de diretor, na prática.
4. **Intercalação produto ↔ reação** (Nothing Phone 3): macro do recurso (1,0 a 1,2 s) cortando com o
   rosto de quem reage (0,6 a 1,4 s). Em 3D sem atores: produto ↔ consequência (a agenda que enche, o
   número que sobe).
5. **Um acento de cor no filme inteiro.** iPhone 17 Pro: o laranja do produto em tudo. Framer: verde
   em cada bloco. Notion: moldura azul. Em comercial de 3D, a cor da marca entra no herói e num único
   elemento por plano.
6. **Hero curto, fecho longo.** Herói de produto: 3 a 5 s. Fecho (logo ou packshot): 5 a 10 s, o
   plano mais longo junto com o plano-sequência. Muitos terminam em preto (4,6 a 5 s).
7. **Plano-sequência com batidas dentro.** iPhone Air e MacBook Pro: 14 a 17 s sem corte, com o
   texto mudando e o produto girando. Em 3D é barato e elegante: uma câmera, várias chaves de texto
   e de produto, nada de corte.
8. **UI em perspectiva no escuro** (Linear, Framer): a interface é uma superfície inclinada
   saindo da escuridão, mal iluminada, com a câmera derivando devagar e o texto sendo digitado. Low
   key total, foco raso, planos de 5 a 19 s. No Blender: `cartao` modo `emite` grande, mundo escuro
   (`vidro_cromo` ou `neon_noturno` sem as réguas), câmera com dolly linear lento e foco raso.
9. **Telas flutuando em profundidade** (Framer P3): várias páginas do produto espalhadas no espaço
   3D, a câmera passando entre elas. É a `pilha_explodida` aberta em leque.
10. **Tamanho comparado** (MacBook: 14" e 16" lado a lado; iPhone Air: o perfil fino sozinho no
    quadro). O produto de perfil ou lado a lado, sem fundo, para o tamanho virar argumento.
11. **Digitação como narrativa** (Linear, Notion): o pedido do usuário digitado aparece, depois a
    resposta. Em SaaS de IA, é o gancho mais claro. Ritmo: a digitação em si pode ser a escada
    rítmica.
12. **Texto pequeno.** Em todos os filmes da Apple a cartela usa fonte leve e pequena (≈ 3 a 4% da
    altura do quadro em 16:9) com muito espaço vazio. Texto grande só no Notion (digitação como
    imagem).

## O que isso muda nos padrões da casa

| Tema | Padrão da casa (Cowork) | Medido nos filmes | Ajuste |
|---|---|---|---|
| Planos em 30 s | 8 a 14 | Nothing Phone (3): 15 em 30 s | 30 s: 8 a 16 (até 16 em ritmo social de consumo) |
| Hold do herói | ≥ 24 q (0,8 s) | herói 3 a 5 s; prova 1,5 a 2 s; escada 0,2 a 0,3 s | ≥ 24 q vale para plano informativo; a escada rítmica é a exceção declarada |
| Hold do logo | 45 a 75 q | fecho de 4,6 a 10 s (138 a 300 q) | logo + respiro: 60 a 150 q; preto final opcional de 1 a 5 s |
| SaaS | (sem régua própria) | mediana 7,6 a 9,8 s (Linear, Framer); 2,5 s no Notion | SaaS premium: planos de 5 a 12 s com câmera em deriva; SaaS didático: 2 a 4 s |
