import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const manifestpath = join(here, ".claude", "manifest.json");
const manifest = JSON.parse(readFileSync(manifestpath, "utf8"));
const manifestdir = dirname(manifestpath);

const iifeOpen = `(function (globalScope, host) {\n`;
const iifeClose =
  `})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this,` +
  ` typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);\n`;

function isPreIIFE(rel) {
  return rel.includes("polyfills");
}

const preChunks = [];
const innerChunks = [];
for (const rel of manifest.parts) {
  const abs = join(manifestdir, rel);
  let text = readFileSync(abs, "utf8");
  if (!text.endsWith("\n")) text += "\n";
  (isPreIIFE(rel) ? preChunks : innerChunks).push(text);
}

const out = join(manifestdir, manifest.output);
const body = preChunks.join("") + iifeOpen + innerChunks.join("") + iifeClose;
writeFileSync(out, body, "utf8");
console.log(`wrote ${out} (${body.length} bytes from ${preChunks.length + innerChunks.length} parts)`);
