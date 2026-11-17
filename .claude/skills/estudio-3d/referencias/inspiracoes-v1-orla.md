# Lições das 6 referências (2026-10-03) e por que a ORLA v1 pareceu "IA mal feita"

Referências estudadas (os vídeos não vêm junto; os nomes ficam pra você buscar):
The Blenderender (lata Superdrink, 18 s) · Matar Design (Souly, cosmético, 21 s) · Inverse Dynamics
(Dior Sauvage, 19 s) · Nako Baev (ponteiras AirPods, 5 s) · Aleksei Korobkov (iPhone desmontado, 15 s)
· Kinematiq (Flowdesk, SaaS 3D, 55 s).

## O diagnóstico da v1 (o que o dono viu e o medidor não pegou)
| Sintoma na v1 | O que as referências fazem |
|---|---|
| Gelo "bisonho": cubo arredondado, núcleo leitoso, cara de gel | Gelo **transparente e irregular**, quebrado, arestas vivas lascadas, lido pelos **fios de luz nas bordas** contra fundo escuro. Nada de núcleo branco de volume |
| Raio X feio: corte booleano mostrando inox escovado com listras | Interior mostrado por **vista explodida** limpa (iPhone) ou corte com face cortada **fosca e de cor própria**; nunca superfície metálica refletindo o nada |
| Textura interna esquisita | Interior de metal precisa de algo pra refletir; senão vira listra. Use acabamento fosco/jateado e luz dedicada |
| Cor e ambiência embarradas (rosa + laranja + verde + azul em tons médios) | **Paleta contida, 1 acento** (verde Flowdesk, azul AirPods, preto e prata Dior). Fundo neutro ou escuro, o produto é a cor |
| Tudo em tons médios, sem preto nem brilho | **Low key domina (5 de 6)**: fundo quase preto, produto desenhado por contraluz e régua, poça de luz no chão. O contraste mora entre o herói e o fundo |
| Cenário de "parede CG vazia" | Ou ambiente **fotorreal e habitado** (mesa, caneca, papel, sol de janela: Kinematiq), ou **estúdio abstrato** (degradê, piso que some). Nunca o meio-termo vazio |
| Pouca riqueza de superfície | Macro com **gotas na superfície** (Dior), relevo do logo pegando luz, frisos com linha especular |
| Ritmo lento, poucos eventos | 10 a 15 cortes em 15-20 s; giros rápidos com ease; produto em **multiplicação** (Souly: grade de frascos, círculo, fila); tipografia **dentro do 3D** (letras curvando no frasco) |

## Regras novas da casa (valem para todo filme)
1. **Escolha low key ou fotorreal habitado.** O "estúdio de gesso em tons médios" está proibido como mundo padrão.
2. **Gelo:** receita de gelo transparente irregular (malha lascada, sem volume leitoso, bolhas só como
   poucos pontos), sempre com contraluz e fundo escuro. Gelo arredondado é proibido.
3. **Interior e corte:** preferir vista explodida. Se cortar, face de corte com material de "seção"
   (fosco, cor da marca) e interior com luz própria; nada de metal escovado espelhando vazio.
4. **Paleta:** 1 cor de acento + neutros. Conferir antes do render se há mais de 2 matizes saturados no quadro.
5. **Detalhe de macro obrigatório** em pelo menos 1 plano (gotas, gravação, friso, textura de pintura).
6. **O medidor não basta:** além do `qa.py`, comparar o quadro lado a lado com uma referência real
   (folha de contato) antes do lookdev ser aprovado.
