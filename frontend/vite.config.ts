import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ esto es importante para que React Router funcione bien en producción
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  base: './'
});