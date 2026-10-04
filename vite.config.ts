import { defineConfig } from "vite";
import { mkdirSync, writeFileSync } from "node:fs";

mkdirSync(".vite-entry", { recursive: true });
writeFileSync(
  ".vite-entry/index.html",
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Meccha Chameleon</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="../src/main.ts"></script>
  </body>
</html>
`
);

export default defineConfig({
  build: {
    rollupOptions: {
      input: ".vite-entry/index.html"
    }
  }
});
