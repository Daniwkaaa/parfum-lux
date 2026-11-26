import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build`         → regular multi-file build in dist/ (for Netlify etc.)
// `npm run build:single`  → one self-contained HTML file in dist-single/index.html
export default defineConfig(({ mode }) => {
  const single = mode === 'single'
  return {
    plugins: [react(), ...(single ? [viteSingleFile({ removeViteModuleLoader: true })] : [])],
    build: single
      ? { outDir: 'dist-single', assetsInlineLimit: 100_000_000, cssCodeSplit: false, chunkSizeWarningLimit: 5000 }
      : {
          chunkSizeWarningLimit: 1200,
          rollupOptions: { output: { manualChunks: { motion: ['framer-motion', 'gsap', 'lenis'] } } },
        },
  }
})
