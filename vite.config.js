import { defineConfig } from 'vite'

export default defineConfig({
  base: '',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'game.js',
        chunkFileNames: 'game.js', // Forces chunks into main file
        assetFileNames: 'game-[name].[ext]',
        manualChunks: undefined // Prevents automatic chunking
      }
    }
  },
  define: {
    BUILD_DATE: JSON.stringify(new Date().toISOString()),
  },
})
