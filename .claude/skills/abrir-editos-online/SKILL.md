---
name: abrir-editos-online
description: Abre o EditOS online, o painel do fluxo de produção (todos os perfis, roteiros, status, vídeos, publicação e insights, atualizando sozinho), em sistema/painel/, e mostra o endereço. Use quando a pessoa disser /abrir-editos-online, "abrir o EditOS online", "abrir o painel do EditOS", "abre a interface do EditOS".
---

# Abrir o EditOS online

O painel é um site que roda **só neste computador** (http://127.0.0.1:4700), dentro de `sistema/painel/`. O EditOS
continua funcionando igual pelo assistente; o painel é uma janela a mais.

1. **Já está no ar?** Teste `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4700`. Respondeu 200: pule para o
   passo 4.
2. **Primeira vez (sem `sistema/painel/node_modules/`):** de dentro de `sistema/painel/`, com o cache confinado,
   `npm_config_cache=../.tmp/npm-cache npm install --no-audit --no-fund`.
3. **Ligar:** de dentro de `sistema/painel/`, rode `npm run dev > ../.tmp/painel-dev.log 2>&1`. O Astro 7 se solta
   sozinho e fica rodando depois que o comando termina. Espere o endereço responder 200 (tente por até 30 s).
4. **Abrir:** abra http://127.0.0.1:4700 no navegador (`start http://127.0.0.1:4700` no Windows) e diga à pessoa, numa
   linha, que o painel está aberto e o endereço.

Para desligar, a pessoa pode pedir "fechar o EditOS online": de dentro de `sistema/painel/`, `npx astro dev stop`.

Regras: porta 4700 sempre (a 4600 é do VKOS STUDIO); nada sai de `projetos/editos/`; o painel não altera modelos nem
vídeos sem a pessoa pedir.
