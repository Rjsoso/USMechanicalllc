import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - more granular splitting
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          'animation': ['framer-motion', 'gsap'],
          'sanity': ['@sanity/client', '@sanity/image-url', '@portabletext/react'],
          'icons': ['react-icons', 'lucide-react'],
        }
      }
    },
    // More aggressive minification for production
    minify: 'esbuild',
    target: 'es2015',
    // Reduce chunk size further
    chunkSizeWarningLimit: 500,
    // Enable source maps for production debugging (optional)
    sourcemap: false,
    // Strip console statements in production
    esbuild: {
      drop: ['console', 'debugger'],
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
  },
})

