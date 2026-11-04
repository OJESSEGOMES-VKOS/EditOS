# A herança: o que todo modelo novo já nasce sabendo

Cada regra aqui veio de uma correção do dono num modelo específico (o código entre parênteses é o da `CORRECOES.md` de
origem) e se repetiu em outros. Por isso todo modelo novo nasce com elas ligadas. O `<modelo>.md` novo não precisa
copiá-las: declara "herda `heranca.md`" na seção de regras e lista **só o que sobrescreve**, com o motivo. Sobrescrever
é permitido quando a regra bate de frente com a forma de execução do modelo (ex.: o fala-escrita vive de corte seco, então
a regra de zoom suave não vale nele), nunca por gosto de quem edita. As regras gerais G1 a G33 do `REGRAS.md` continuam
acima de tudo isto.

## 0. Material
- **Material: três modos (G24, 2026-11-03); o dono diz qual vale para o vídeo.** **Só materiais** (o padrão se ele não disse nada): somente o que está na pasta de materiais indicada do vídeo (`<perfil>/materiais/`, `entrada/`); nada de gerar imagem (kie.ai, Codex ou qualquer IA) nem buscar foto, vídeo ou som online. **Livre:** os materiais mais tudo o que o sistema alcança (busca, recorte, geração, API). **Indicado:** os materiais mais exatamente o que ele listou ("materiais e API só"). Faltou material? O plano usa o efeito tipográfico, a pessoa ou reaproveita o que existe, e a falta vai para o `PEDIDO.md`, fora da peça. O modo fica em `cenas.json` (`material`, `material_permitido`).
- Vale também na vitrine e no teste do modelo: sem o dono declarar outro modo, a prova sai da gravação e dos arquivos dele, nunca de imagem gerada.

## 1. Legenda (a legenda conta a história)
- Todas as falas aparecem, em ordem, cada trecho uma vez só; o destaque não engole a fala seguinte (M3-1, M3-7, PR12).
- Tempo de leitura sempre: 1 s + 1 s a cada 3 palavras; nenhuma palavra solta por 2 quadros, nada pisca (M3-6, PR5, S2, PF4).
- Um bloco de legenda é um trecho só: nunca junta fim de uma frase com começo de outra; passou de ponto, vírgula, interrogação, exclamação ou dois-pontos, o bloco acaba e o próximo entra novo. **No máximo 2 linhas por bloco de legenda**; texto de tela, no máximo 3 (G35, PF12). O checador do molde acusa as duas coisas.
- No máximo 2 posições de legenda padrão no vídeo inteiro, na altura de leitura (peito), nunca "lá embaixo" (M3-10, M3-11, S3, PR17).
- Dentro das margens das redes no 9:16 (PR17); no 16:9 com protagonista focado, legenda em lugar fixo, não persegue o enquadramento (PR2).
- Surgimento suave e sutil; pedaços curtos entram juntos, lado a lado, mesmo tamanho e fonte (PR9, PR5).
- Legível sempre: nunca texto branco em fundo claro, cor que combina em contraste com o vídeo (PR13, P1).
- Tamanho da legenda é escolha por vídeo dentro da faixa do modelo (PR3); em gravação normal de pessoa, a referência de leitura é 72 px em 1080 de largura (PF16).

## 2. Destaque (só o protagonista)
- Tela ou palavra de destaque só para o termo protagonista da fala; nunca em palavra fraca (M3-8, PR14, S5).
- Destaque do mesmo tamanho dos outros, não encolhe pra caber (M3-12).
- A palavra a comentar vai entre aspas (M3-4).
- Número é contador (0 → valor) na fonte e no destaque, sem círculo em volta (M3-5).
- Tela de destaque não carrega texto comum junto (M3-13).
- Letreiro atrás mostra parte da frase sem repetir a palavra da legenda (PR8).
- Fecho: fixo só o comando ("comenta X"); o resto da fala segue na legenda (M3-9).
- **Um elemento por ideia na tela (G38, PV4):** a mesma informação nunca aparece em dois elementos ao mesmo tempo (título, selo, contador, comando, legenda). A palavra que um texto fixo já mostra sai da legenda enquanto ele está na tela; contador não leva rótulo que repete o título. O checador do molde acusa palavra repetida (número escrito ou falado conta igual) entre elementos simultâneos.

## 3. Tipografia
- 1 fonte principal e no máximo 2 alternativas; 1 variação de peso; tamanho varia pouco (PF10, S6).
- Entradas de texto suaves; palavras não "teleportam" (PF10, PF4).
- Texto sem contorno, sombra justa ou glow colado na letra (parece recortado); sobre fundo borrado ou chapado, limpo; sobre a gravação, no máximo uma sombra larga e bem suave que não desenha a borda da letra (G37).

## 4. Câmera e corte
- Sem corte seco de zoom toda hora: aproximação e afastamento leves, no máximo ~3 cortes de zoom no vídeo, só na ênfase; zoom contínuo bem lento (PF5, PF13).
- Poucos cortes de câmera no começo: nos primeiros 9 s, só o que abre e mais um (S4).
- Hook leve: abre com a pessoa, e só depois entra a edição; o gancho já escrito na tela desde o quadro 0 (P2, G23).
- Transições limpas; tela dividida sem "flick" de outra cena por trás; sem cortina aberta (PF3, PF18, G7).
- Outra câmera nunca se gera por IA: no lugar, outros cortes do mesmo vídeo ou B-roll do usuário (SP1).

## 5. Cor
- Nenhum tratamento de cor na gravação; o usuário faz à mão antes (G33, D2).
- Identidade de cor própria do modelo, tirada das referências; nunca a paleta do dono ou do cliente; paletas são opção do usuário (G11, Y3, A2, G33).
- Sem preto e branco (PF8, PR16). Fundo não se altera: é opção do usuário (PR11).
- Nada de efeito mirabolante no fundo; efeitos VHS/glitch desligados por padrão (PF2, M3-3).

## 6. Tela e composição
- Uma frase = uma cena: os elementos surgem na ordem da fala, na mesma cena (E1-5).
- Pouco texto por tela e bem enquadrado; tela simples demais vira tela dividida ou ganha ilustração (PF7, PF14).
- Tela dividida: B-roll ou ilustração em cima, o protagonista sempre embaixo e bem enquadrado (PF9, PF14).
- Telas criadas mantêm o texto da fala e ganham animação ou ilustração minimalista (PR4).
- Nenhum elemento fora do enquadramento; nada aparece ou some do nada (E1-6, E2-2).
- **Nada pendurado (G39, PV5):** selo, título ou texto de gancho sai quando a fala dele passa (até ~1 s depois) e não atravessa a cena; só o comando do fecho fica até o fim. O checador do molde acusa elemento que fica na tela além do seu trecho.
- Movimento fluido e suave, sem padrão mecânico de "sobe e desce" (E2-2, AC3).
- Tela de produto ou interface **fiel como um print**: proporção, fonte, ícones, cores, estados e aparelho reais, recriados em código a partir de um print real com origem; nunca o celular 3D ou o cartão genérico repetido de modelo em modelo (G34, A3). Procedimento em `interface-fiel.md`.

## 7. Material
- B-roll só com arquivo do usuário; sem ele, as telas da casa (PR10). O modelo pede ao usuário o que não consegue preencher, com plano B honesto; nunca fabrica prova (Y1, G24).
- Imagem e IA no lugar de câmera são escolha do usuário; não gastar crédito com vídeo gerado quando imagem resolve (SP1, G21, E3-4).
- Fotos reais nas bordas, tratadas, nunca protagonistas; créditos na tela final (E2-9, E2-6).

## 8. Som
- Efeitos sonoros sutis, que dão vida sem poluir; elemento que surge leva "popup" grave, não swoosh (D1-1, D1-3).
- Música é opcional e a gosto do usuário; sem música, só efeito (Y4, S7, D1-2).
- Som no instante físico do evento, do mesmo arquivo de tempo da imagem; mixagem contida, -14 LUFS (G-som, E1-4).

## 9. Identidade e honestidade
- Nunca o nome do modelo na tela nem o @ dele; nome/@ só os reais de quem fala (M3-13, PR15, SP4, Y5, G20, G31).
- A autenticidade do usuário entra pela seção "Do seu jeito" do `<modelo>.md` e pelas correções dele, sem corromper o modelo (Y2, G25).
- Variação nova só acrescenta; a base e os vídeos de cliente seguem o aprovado (PF17, G26).
- O modelo vale para vertical e horizontal quando a forma de execução permite; a versão aprovada é uma só (PR1, Y7).

## 10. O que todo `<modelo>.md` novo precisa ter
- A seção **"Com o que o vídeo tiver"**: tabela recurso da referência → o que o modelo faz só com a gravação da pessoa (G32, D1).
- A seção **"Do seu jeito"** vazia, pro usuário preencher (nome, @, foto, chamada do fim, gostos).
- Os números medidos (brilho, contraste, saturação, cortes/min, tamanho e posição de legenda) que o `parece.py` confere.
- A lista de opções: o que vem ligado porque está no aprovado e o que é escolha.
