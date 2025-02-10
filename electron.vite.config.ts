import { builtinModules } from "module";
import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist-electron",
    emptyOutDir: true,
    lib: {
      entry: {
        main: resolve(__dirname, "src/main.ts"),
        preload: resolve(__dirname, "src/preload.ts"),
      },
      formats: ["cjs"],
    },
    rollupOptions: {
      external: [
        "electron",
        "electron-store",
        "@octokit/rest",
        ...builtinModules,
      ],
      output: {
        entryFileNames: "[name].js",
      }
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  base: "./",
  server: {
    port: 5173,
    strictPort: true
  }
});
