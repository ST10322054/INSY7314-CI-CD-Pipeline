import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

console.log('Vite is starting...');

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/cert.pem')),
    },
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': 'https://localhost:443',
    },
  },
});
