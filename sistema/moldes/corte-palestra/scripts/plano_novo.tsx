// O começo vazio do vídeo novo (tools/novo-video.py põe este texto no lugar do bloco "O PLANO" de src/Corte.tsx).
// O vídeo nasce só com a legenda padrão do modelo (legendaPadrao(): uma página por trecho, nenhum destaque). Nenhuma
// página nem destaque da vitrine vem junto. Cada destaque entra porque a fala NOVA pediu, com a linha "por quê" no
// plano.md (a palavra dita entre aspas e a função da frase: pergunta, resposta, contradição; tools/clone.py cobra).
// A skill .claude/skills/corte-palestra/SKILL.md diz como escolher.
//
// FOLGA: quanto a imagem segue depois da última palavra (a última frase respira 1 a 2 s; scripts/recortar.py lê daqui).
// ESCURECE: true = a imagem escurece até o preto com a última página ainda na tela (ref1); false = segura a imagem (ref2).
// GANCHO_ATE: onde acaba o gancho (s), na última palavra da última pergunta ou contradição do começo. Antes dele o
//   destaque é denso; depois, raro (no máx. 1 a cada 20 s, mínimo 2; o checador conta).
// COR: a cor do destaque colorido, escolhida CONTRA o fundo desta gravação: rode scripts/cor.py e escreva a sugestão
//   aqui, entre aspas simples. COR_PADRAO é só a da vitrine.
// REENQUADRA_EMENDAS: opção desligada; liga um corte de reenquadramento (1,0 ↔ 1,08) em cada emenda do recorte.
//
// PEDACOS: as páginas, na ordem da fala: [índice da 1ª palavra em src/palavras.json, 'texto', até (s)?]. Para pôr os
// destaques, troque legendaPadrao() pela lista escrita (rode o checador uma vez e copie as páginas que ele lista).
// O texto é o que foi DITO (a transcrição errou? tools/trocar.py). ' / ' quebra a linha. Marcas, só onde a fala pede
// (corte-palestra.md seção 1, a gramática fala → tela):
//   *palavra*  serifa itálica grande na COR (a palavra da pergunta, a resposta-chave da pergunta retórica)
//   _palavra_  serifa itálica grande branca (a resposta em imperativo, a palavra de peso sobre fundo frio)
// Página sem marca = legenda: no máximo 2 linhas, um trecho só (nunca atravessa . , ? ! :). Página com marca = bloco:
// até 4 linhas (degraus), monta-se palavra por palavra com a voz e zera na próxima página.
const FOLGA = 1.6;
const ESCURECE = true;
const GANCHO_ATE = 9.0;
const COR = COR_PADRAO;
const REENQUADRA_EMENDAS = false;
const PEDACOS: [number, string, number?][] = legendaPadrao();
