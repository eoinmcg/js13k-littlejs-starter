import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        vanilla: resolve(__dirname, "templates/vanilla/index.html"),
        modular: resolve(__dirname, "templates/modular/index.html"),
        typescript: resolve(__dirname, "templates/typescript/index.html"),
      },
      output: {
        entryFileNames: "game.js",
        chunkFileNames: "game.js",
        assetFileNames: "game-[name].[ext]",
        manualChunks: undefined,
      },
    },
  },
  define: {
    BUILD_DATE: JSON.stringify(new Date().toISOString()),
  },
  resolve: {
    alias: {
      // '@engine' will always point to the littlejs folder
      "@engine": resolve(__dirname, "littlejs"),
    },
  },
});
