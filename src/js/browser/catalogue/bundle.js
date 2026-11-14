let loading;
let fallback;

function inflate(bytes) {
    fallback ||= import("/assets/static/dependencies/fflate.js").then(() => window.fflate);
    return fallback.then(library => library.gunzipSync(bytes));
}

async function read() {
    const manifest = await fetch("/assets/static/data/levels/bundle.json");
    if (!manifest.ok) throw new Error("Level bundle unavailable");
    const data = await manifest.json();
    const url = new URL(data.url, location.origin);
    if (url.origin !== location.origin) throw new Error("Invalid level bundle");
    const response = await fetch(url);
    if (!response.ok) throw new Error("Level bundle unavailable");
    let bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes[0] === 31 && bytes[1] === 139) {
        if (typeof DecompressionStream === "function") {
            const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
            bytes = new Uint8Array(await new Response(stream).arrayBuffer());
        } else bytes = await inflate(bytes);
    }
    return JSON.parse(new TextDecoder().decode(bytes)).files;
}

/*//////////////////////////////////////////////////////////////////////*/

export async function bundled(file) {
    const url = new URL(file, location.href);
    const match = url.pathname.match(/^\/levels\/(\d+)\/files\/(\d+)$/);
    if (!match || url.hostname !== "levels.candies.monster") return null;
    loading ||= read().catch(() => ({}));
    return (await loading)[match[1] + "/" + match[2]] ?? null;
}
