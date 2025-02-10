import { builtinModules } from "module";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: {
        main: resolve(__dirname, "src/main.ts"),
        preload: resolve(__dirname, "src/preload.ts"),
        github: resolve(__dirname, "src/services/github.ts"),
      },
      formats: ["cjs"],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    outDir: "dist-electron",
    emptyOutDir: true,
    rollupOptions: {
      external: [
        "electron",
        "electron-store",
        "@octokit/rest",
        ...builtinModules,
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["electron", "electron-store"],
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
});
