# 5 · Formatos e prévia

## Reel / Shorts (9:16, 1080×1920)
- Duração: o assunto decide; teto não é alvo. Vídeo curto que performa costuma ficar entre 20 e 60 s.
- Zona segura: texto entre x 60 e 940, y 250 e 1500 (fora do topo, do rodapé com legenda do app e da coluna de botões).
- Legenda sempre ligada, contando a história inteira, na altura do peito, no máximo 2 posições no vídeo todo.
- Gancho escrito grande desde o quadro 0; CTA dito e escrito, pelo menos 2 s na tela.

## YouTube (16:9, 1920×1080)
- A primeira janela de decisão é maior (uns 30 s): diga o tema logo e mostre que vai cumprir.
- Re-gancho a cada bloco; capítulo com tela própria; respiro de 1 a 3 s por capítulo.
- Versão vertical de um trecho é **re-layout nativo**, nunca corte do 16:9.

## Anúncio
- Marca e produto aparecem cedo (nos primeiros segundos), CTA explícito no fim e falado.
- Uma promessa, uma prova, uma ação.
- Siga as regras da plataforma e as do criador (o PERFIL diz o que nunca prometer).

## Carrossel animado (cada página um mini vídeo)

O que se sabe (com a confiança de cada coisa):
- **Até 20 itens** por carrossel no app; agendadores via API só publicam 10.
- **Vídeo de até 60 s por página** é o consenso (não há número oficial); mire em 4 a 10 s.
- **O primeiro item define o recorte de todos.** Use **1080×1350 (4:5)** e mantenha o essencial dentro da área 3:4
  central (1012×1350), porque o grade do perfil mostra a miniatura em 3:4.
- **A primeira página é a capa** (não existe capa personalizada). Se for vídeo, o quadro inicial já tem que ser a capa:
  o gancho escrito, legível parado.
- **A segunda página é a segunda chance:** quem não deslizou pode ver o carrossel de novo a partir dela. Ela também
  precisa ser um gancho.
- **Música do Instagram silencia o som dos vídeos.** Cada página funciona muda: texto conta tudo.
- Depois de publicado não dá pra reordenar, só apagar página. Confira a ordem antes.

A receita:
1. **Roteiro por página**, não por frase: cada página é uma tela com UMA função (gancho, problema, passo, prova,
   virada, CTA). Texto curto: o tempo da página é o tempo de leitura (1 s + 3 palavras/s) mais o movimento.
2. **Cada página é autoexplicativa:** quem cai direto nela entende sem ver a anterior.
3. **O movimento ilustra a ideia** (o código digita, a barra enche, o número conta), nunca enfeite girando.
4. **Loop limpo:** a página termina num quadro que segura parada (o Instagram repete o vídeo). O último quadro é
   tão legível quanto o primeiro.
5. **Mesmo mundo visual em todas as páginas** (cor, fonte, grade); a variação é de composição, não de identidade.
6. **Última página: o CTA**, uma ação, escrito grande.
7. Produção: um vídeo do estúdio com uma composição por página, todas em 1080×1350 a 30 fps, renderizadas uma por
   vez (`com-trava.sh`, `--concurrency=2`). Cada página sai como `pagina-01.mp4`, `pagina-02.mp4`...
8. Conferência por página: `tools/medir_entrega.py pagina-NN.mp4 --tamanho 1080x1350 --fps 30 --max-s 60` e a folha
   de quadros de cada uma. Página sem som passa (é proposital).

## A prévia (o loop rápido)
- **Depois de cada mudança**, confira só o trecho mexido:
  `python tools/folha.py <video.mp4> --ini <s> --fim <s> --fps 4` e olhe a folha. Ela mostra o que acontece entre
  dois quadros soltos: elemento cortado, texto passando por trás, salto, piscada, texto que some antes de ser lido.
- Render de prévia em resolução menor, só do trecho, quando o molde permitir (`--scale=0.5`, `--frames=ini-fim` no
  Remotion). Mire em menos de um minuto por ciclo.
- **Antes do render cheio:** mostre a folha do vídeo inteiro (blocos de uns 10 s) e a prévia com som. Só depois do
  "ok" vem o render final.
- Prévia nunca sobrescreve a anterior; versão aprovada nunca é sobrescrita.
