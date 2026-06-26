import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    tailwindcss(),
    react(),
    ViteImageOptimizer({
      exclude: /\/(hero|avatars)\//,
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@apollo/client') || id.includes('/graphql/')) return 'apollo';
            if (id.includes('react-router') || id.includes('@remix-run/router')) return 'router';
            if (id.includes('react-dom') || id.includes('/react/')) return 'react-vendor';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/graphql': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true,
      },
    }
  }
})
