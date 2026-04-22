/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const siteUrl = process.env.VITE_SITE_URL || 'https://www.usmechanicalllc.com'

function siteUrlPlugin() {
  let outDir = 'dist'
  return {
    name: 'site-url-replace',
    configResolved(config) {
      outDir = join(config.root, config.build.outDir)
    },
    transformIndexHtml(html) {
      return html.replace(/__SITE_URL__/g, siteUrl)
    },
    closeBundle() {
      try {
        const robotsPath = join(outDir, 'robots.txt')
        const content = readFileSync(robotsPath, 'utf8')
        writeFileSync(robotsPath, content.replace(/__SITE_URL__/g, siteUrl), 'utf8')
      } catch {
        // robots.txt may not exist in dist yet in some build orders
      }

      // Create 404.html as a copy of index.html so Vercel serves the SPA
      // shell with HTTP 404 for any unmatched route.
      try {
        copyFileSync(join(outDir, 'index.html'), join(outDir, '404.html'))
      } catch (err) {
        console.warn('[site-url-replace] could not create 404.html:', err?.message)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), siteUrlPlugin()],
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
          'animation': ['framer-motion'],
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

