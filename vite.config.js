import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import path, { resolve, dirname } from "path";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Helper to only include paths that exist
const getInputEntries = () => {
  const entries = {
    main: resolve(__dirname, "index.html"),
  };

  const templates = ["vanilla", "modular", "typescript"];

  templates.forEach((t) => {
    const path = resolve(__dirname, `templates/${t}/index.html`);
    if (fs.existsSync(path)) {
      entries[t] = path;
    }
  });

  return entries;
};

export default defineConfig({
  base: "",
  // If 'public' exists in the current folder (CLI mode), use it.
  // Otherwise, go up to the root 'public' (Lab mode).
  publicDir: fs.existsSync(path.resolve(__dirname, "public"))
    ? "public"
    : "../../public",
  build: {
    rollupOptions: {
      input: getInputEntries(),
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
