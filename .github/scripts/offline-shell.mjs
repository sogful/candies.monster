import {createHash} from "node:crypto";
import {readdir, readFile, stat, writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";

const root = new URL("../../", import.meta.url);
const files = new Set(["index.html", "preview/editor.html", "preview/index.css", "preview/favicon.png"]);
const groups = [
    ["src", /\.(?:js|css)$/],
    ["preview/src", /\.js$/],
    ["assets/static/css", /\.css$/],
    ["assets/static/js", /\.js$/],
    ["assets/static/data/levels", /^(?!bundle\.json$).*\.json$/],
    ["assets/fonts", /\.(?:woff2?|ttf|otf)$/],
    ["assets/images/buttons", /\.(?:png|svg|webp)$/],
    ["assets/images/icons", /\.(?:png|svg|webp)$/],
    ["assets/images/objects", /\.(?:png|svg|webp)$/],
    ["assets/images/stars", /\.(?:png|svg|webp)$/],
    ["assets/images/level", /^(?!(?:objects\.webp|sources\.json)$).*\.(?:webp|json|svg)$/],
    ["assets/images/cursors", /\.cur$/]
];

async function collect(folder, pattern, deep) {
    const items = await readdir(new URL(folder + "/", root), {withFileTypes: true});
    for (const item of items) {
        const target = folder + "/" + item.name;
        if (item.isDirectory() && deep) await collect(target, pattern, true);
        if (item.isFile() && pattern.test(item.name)) files.add(target);
    }
}

for (const [folder, pattern] of groups) {
    await collect(folder, pattern, ["src", "preview/src", "assets/static/js", "assets/static/css"].includes(folder));
}
for (const path of [
    "assets/static/data/ads.json", "assets/static/data/backgrounds.json", "assets/static/data/candylist.json",
    "assets/static/data/credits.json", "assets/static/data/emojinames.json", "assets/images/branding/logo.svg",
    "assets/images/branding/logotiny.webp", "assets/images/preview/tile.webp", "assets/images/bgs/rainbowtiny.webp",
    "assets/images/bgs/cardboard.webp"
]) files.add(path);

/*//////////////////////////////////////////////////////////////////////*/

const pattern = /\/assets\/[\w./%()@+-]+?\.(?:js|css|json|woff2?|otf|ttf|jpg|jpeg|png|svg|webp|avif|gif|cur|mp3|ogg)(?=[?#"'\x60\s),\]]|$)/gi;
const optional = /\/(?:images\/(?:branding\/embeds\/|level\/high\/|preview\/(?:dx|h5dx|famobi)banner\.png))/;
for (const filename of files) {
    if (!/\.(?:html|css|js|json)$/.test(filename)) continue;
    const source = await readFile(new URL(filename, root), "utf8");
    for (const [reference] of source.matchAll(pattern)) {
        if (optional.test(reference)) continue;
        const url = new URL(reference.slice(1), root);
        const info = await stat(url).catch(() => null);
        if (info?.isFile()) files.add(reference.slice(1));
    }
}

const hashes = {};
let bytes = 0;
for (const path of [...files].sort()) {
    const url = new URL(path, root);
    const data = await readFile(url);
    bytes += data.length;
    hashes["/" + url.href.slice(root.href.length)] = createHash("sha256").update(data).digest("hex").slice(0, 16);
}
const version = createHash("sha256").update(JSON.stringify(hashes)).digest("hex").slice(0, 16);
const output = {version, files: hashes, bytes};
await writeFile(fileURLToPath(new URL("assets/static/data/offline-shell.json", root)), JSON.stringify(output, null, 2) + "\n");
