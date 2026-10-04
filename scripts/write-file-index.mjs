import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const builtHtml = readFileSync("file-dist/src/dev.html", "utf8");

const rewrittenHtml = builtHtml
  .replace(/(?:\.\.\/|\.\/)assets\//g, "./file-dist/assets/")
  .replace(/<script type="module" crossorigin/g, "<script")
  .replaceAll(" crossorigin", "");

const scriptTags = [...rewrittenHtml.matchAll(/    <script src="[^"]+"><\/script>\n/g)].map(
  (match) => match[0]
);
const body = scriptTags.reduce((html, scriptTag) => html.replace(scriptTag, ""), rewrittenHtml);

const directHtml = body.replace(
  "</head>",
  `  <script>
    window.__MECCHA_DIRECT_FILE__ = true;
  </script>
</head>`
).replace(
  "    <div id=\"app\"></div>",
  `    <div id="app"></div>
${scriptTags.join("")}`
);

writeFileSync("index.html", directHtml);
writeFileSync("app.html", directHtml);
writeFileSync("dev.html", directHtml);

mkdirSync("file-dist", { recursive: true });
copyFileSync("index.html", join("file-dist", "launch.html"));

const readmePath = "README.md";
const readme = readFileSync(readmePath, "utf8");
const marker = "## Launch\n";
const launchSection = `${marker}
- Double-click \`index.html\` to launch the direct-file build.
- Double-click \`app.html\` also launches the direct-file build.
- Double-click \`dev.html\` also launches the direct-file build.
- Run \`npm run dev\` and open \`/src/dev.html\` for source development.
- Run \`npm run build:file\` after source changes to refresh the direct-file bundle.
`;

if (!readme.includes(marker)) {
  writeFileSync(readmePath, `${readme.trim()}\n\n${launchSection}`);
}

mkdirSync(dirname("file-dist/.gitkeep"), { recursive: true });
