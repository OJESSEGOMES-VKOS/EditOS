import { defineConfig } from 'astro/config';

// Painel local do EditOS: só na máquina (127.0.0.1), porta 4700 (a 4600 é do VKOS STUDIO).
export default defineConfig({
  server: { host: '127.0.0.1', port: 4700 },
  devToolbar: { enabled: false },
  vite: { cacheDir: '../.tmp/painel-vite' },
});
