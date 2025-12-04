import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'ES2020',
    outDir: 'dist',
  },
  publicDir: 'public',
});
