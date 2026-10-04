import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: "src/vite-dev-entry.html"
    }
  }
});
