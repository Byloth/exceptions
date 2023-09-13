import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Exceptions"
    },
    sourcemap: true
  },
  resolve: {
    alias: { "@": resolve(__dirname, "src") }
  }
});
