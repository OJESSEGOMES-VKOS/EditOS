# Plano frase a frase (vitrine do documental01)

O plano que o vídeo lê é `src/plano.json`. A tabela frase → imagem → texto está em
`../../modelos/documental01/documental01.md` §10 (é o mesmo plano). Decisões que não estão lá:
- Os títulos são a frase-resumo com as palavras da fala; a pergunta da tela é a da voz, encurtada ("O mais *longo?*").
- Nenhum rótulo mostra número antes de ele ser falado (o "1.189" do crédito só entra no fecho, depois de dito).
- O contador para no início da palavra do número (a transcrição dá o número inteiro como um item só).
- "1" + ".189" que a transcrição partiu foi juntado em `src/palavras.json` (start do 1º, end do 2º).
- Fecho: depois da última palavra as barras voltam a encher a partir de Gênesis (2,3 s) enquanto a cama sobe, para a
  tela não ficar parada.
