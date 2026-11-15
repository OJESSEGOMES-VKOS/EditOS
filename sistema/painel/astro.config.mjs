import { defineConfig } from 'astro/config';

// Painel local do EditOS: só na máquina (localhost), porta 4700 (a 4600 é do VKOS STUDIO).
export default defineConfig({
  server: { host: 'localhost', port: 4700 },
  devToolbar: { enabled: false },
  vite: { cacheDir: '../.tmp/painel-vite' },
});
