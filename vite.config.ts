import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          vendor: ['react', 'react-dom', 'zustand', 'lucide-react']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
