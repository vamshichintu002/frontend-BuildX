import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['@emotion/react', '@emotion/styled', '@mui/material']
  },
  build: {
    rollupOptions: {
      external: ['@mui/material', '@emotion/react', '@emotion/styled'],
      output: {
        globals: {
          '@mui/material': 'MaterialUI',
          '@emotion/react': 'emotionReact',
          '@emotion/styled': 'emotionStyled'
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    open: true
  }
});
