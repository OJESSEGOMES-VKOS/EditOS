# Controle de qualidade: rubrica de estúdio

Três camadas, nesta ordem. Só entrega o que passa nas três.

## 1. O medidor (`qa.py`) em todo quadro de prova
Mede o PNG final (com AgX e look aplicados), sempre reduzido a 540 px de largura.

| Veredito | Limite | Correção típica |
|---|---|---|
| ESTOURADO | > 2% dos pixels no branco puro | baixar força/emissão/exposição |
| AFUNDADO | > 20% no preto puro (fora de low key) | preenchimento, mundo, look de menos contraste |
| LAVADO | contraste < 0,13 com piso p2 > 0,10 | afastar/escurecer o fundo, tirar preenchimento, look de mais contraste |
| ESCURO | média < 0,16 (fora de low key) | exposição +0,5 a +1 ou chave |
| ESCURO DEMAIS (low key) | ponto mais claro p98 < 0,6 | o herói precisa de um brilho de 0,8-0,95 |
| SEM COR | colorido < 12 | acento da paleta, quente x frio na luz |
| CHAPADO | detalhe < 0,0035 | contorno, chanfro, textura |

Calibração: os filmes antigos acusaram SEM COR, ESTOURADO, ESCURO e AFUNDADO, exatamente os
defeitos vistos no olho. Os mundos testados passam. Faixas boas observadas: contraste 0,20-0,30,
estourado < 1,5%, colorido 17-43.

## 2. O checklist "parece CG barato?" (olhe o PNG, item por item)
**Luz e cor**
1. Ponto mais claro do quadro é o herói?
2. Existe uma borda clara ou escura separando o herói do fundo?
3. A luz tem direção (um lado mais claro que o outro)?
4. Quente x frio, ou uma temperatura única e intencional?
5. Nada de preto absoluto em área grande nem branco estourado em área grande?
6. O fundo é mais escuro (ou mais claro) que o herói, nunca igual?
**Material**
7. Nenhuma aresta viva (todas pegam um fio de luz)?
8. A aspereza varia (o reflexo não é perfeito e igual)?
9. Vidro com contorno escuro e linha clara? Metal refletindo algo?
10. Escala crível (detalhes do tamanho do mundo real)?
11. Sombra de contato onde o objeto toca o chão?
12. Tela legível, com as cores da interface vivas?
**Composição**
13. Um herói só?
14. Fora do centro quando não é plano-herói/packshot, com espaço na direção do movimento?
15. Lente coerente com a ideia (longa pra produto, sem distorção)?
16. Nenhum enfeite flutuante sem função?
17. Fundo não é o estúdio cinza padrão por preguiça (é escolha do mundo)?
18. Texto dentro da zona segura e legível?
**Movimento (em quadros intermediários e no mp4)**
19. Nenhuma curva linear onde devia haver ease (e vice-versa)?
20. Nada para dentro do plano (exceto hold declarado)?
21. Stagger nos conjuntos (nada entra todo junto)?
22. Todo secundário tem causa?
23. Motion blur ligado e lendo na direção do movimento?
24. Câmera com um gesto só, motivado?
25. Direção conservada nos cortes?
26. Packshot longo, câmera ainda andando?
**Som e entrega**
27. Pico do whoosh no quadro de maior velocidade? Hit no reveal?
28. Sting no fim, no tom?
29. Volume certo no celular?
30. Formato, duração e CTA conforme o briefing?

## 3. A rubrica de diretor (nota 0 a 5 por área)
| Área | 1 (amador) | 3 (correto) | 5 (produtora) |
|---|---|---|---|
| Ideia | mostra o produto girando | mostra os recursos em ordem | uma metáfora que se entende sem texto |
| Composição | tudo centralizado e frontal | terços, ângulos variados | cada plano com intenção, as 3 opções descartaram o óbvio |
| Luz | chapada, lavada | direção e contorno | luz conta a história e muda com o arco |
| Material | plástico de CG | crível de longe | crível em close, imperfeição sutil |
| Movimento | curvas padrão, paradas | curvas pela intenção | stagger, causa e efeito, nada para |
| Câmera | gira à toa | um gesto por plano | transições de produtora, câmera com peso |
| Cor | sem identidade | paleta do mundo/marca | arco de cor (contido → explode) |
| Ritmo | energia plana | estrutura por batidas | curva de energia + recompensa |
| Som | sem som ou trilha solta | trilha no corte | SFX no pico, riser, hit, sting |
| Marca | logo jogado no fim | packshot limpo | assinatura memorável que senta 1 s |

**Nota mínima pra entregar: nenhuma área abaixo de 3, média ≥ 3,8.** Abaixo disso, volta pra
bancada com a lista do que subir. Diga ao dono a nota honesta e o que limitou.
