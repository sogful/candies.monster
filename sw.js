const shellprefix = "cdm-shell-1-";
const statename = "cdm-offline-state-1";
const dxprefix = "cdm-dx-1-";
const legacyname = name => name.replace(/^cdm-/, "candies-");
const dxroot = "/preview/dx/dist/wwwroot/";
const dxindex = dxroot + "index.html";
const shellmanifest = "/assets/static/data/offline-shell.json";
const dxmanifest = dxroot + "offline.json";
const dxstate = "/offline/dx";
const dxoptional = "cdm-dx-extras-1";
const storageencoding = "X-CDM-Storage-Encoding";
const legacyencoding = "X-Candies-Storage-Encoding";
const qualities = ["high", "medium", "low"];
const offlinenavigation = new Set();
const games = new Map();
let currentshell;
let currentdx;
let stagingdx;
let manifestloading;
let warming;
let wantedquality;

/*//////////////////////////////////////////////////////////////////////*/

function json(data) {
    return new Response(JSON.stringify(data), {headers: {"Content-Type": "application/json", "Cache-Control": "no-store"}});
}

async function stored(path) {
    return await caches.match(path, {cacheName: statename}) || caches.match(path, {cacheName: legacyname(statename)});
}

async function save(path, data) {
    await (await caches.open(statename)).put(path, json(data));
}

function paths(entries, root = "/") {
    if (!Array.isArray(entries)) throw new Error("Invalid offline manifest");
    return [...new Set(entries.map(path => {
        const url = new URL(path, self.location.origin + root);
        if (url.origin !== self.location.origin || !url.pathname.startsWith(root) || url.search || url.hash
            || url.pathname.includes("/.") || !/\.[\w-]+$/.test(url.pathname)) throw new Error("Invalid offline path");
        return url.pathname;
    }))];
}

function packresponse(response, method) {
    const headers = new Headers(response.headers);
    headers.delete("Content-Encoding");
    headers.delete("Content-Length");
    const compress = method === "gzip";
    headers.delete(legacyencoding);
    if (compress) headers.set(storageencoding, "gzip");
    else headers.delete(storageencoding);
    const stream = compress ? new CompressionStream("gzip") : new DecompressionStream("gzip");
    return new Response(response.body.pipeThrough(stream), {status: response.status, statusText: response.statusText, headers});
}

function packed(response) {
    return (response?.headers.get(storageencoding) || response?.headers.get(legacyencoding)) === "gzip";
}

function unpack(response) {
    return packed(response) ? packresponse(response, "identity") : response;
}

async function fill(cache, entries, reuse, reload = false, compress) {
    const waiting = entries.values();
    const controller = new AbortController();
    const job = async () => {
        try {
            for (const path of waiting) {
                if (controller.signal.aborted) return;
                if (await cache.match(path)) continue;
                const response = await reuse?.(path) || await fetch(path, {
                    cache: reload ? "no-cache" : "default",
                    credentials: "same-origin",
                    signal: controller.signal,
                    priority: "low"
                });
                if (!response.ok || response.status !== 200 || response.redirected) throw new Error("Could not cache " + path);
                const encode = compress?.has(path) && typeof CompressionStream === "function" && typeof DecompressionStream === "function";
                await cache.put(path, encode && response.body && !packed(response) ? packresponse(response, "gzip") : response);
            }
        } catch (error) {
            controller.abort();
            throw error;
        }
    };
    const results = await Promise.allSettled(Array.from({length: 5}, job));
    const failed = results.find(result => result.status === "rejected");
    if (failed) throw failed.reason;
}

/*//////////////////////////////////////////////////////////////////////*/

async function prepareshell() {
    const response = await fetch(shellmanifest, {cache: "no-cache"});
    if (!response.ok) throw new Error("Offline site files unavailable");
    const data = await response.json();
    if (!/^[\da-f]{8,64}$/i.test(data.version)) throw new Error("Invalid offline site version");
    const entries = paths(Object.keys(data.files));
    if (!entries.includes("/index.html")) throw new Error("Offline site index missing");
    const previous = await readyshell();
    if (previous?.version === data.version) return;
    const name = shellprefix + data.version;
    const cache = await caches.open(name);
    const old = previous && await caches.open(previous.name);
    await fill(cache, entries, path => old && data.files[path] === previous.files[path] && old.match(path), Boolean(previous));
    const ready = {...data, name};
    await save(shellmanifest, ready);
    currentshell = Promise.resolve(ready);
    const obsolete = (await caches.keys()).filter(key => (key.startsWith(shellprefix) || key.startsWith(legacyname(shellprefix)))
        && key !== name && key !== previous?.name);
    await Promise.all(obsolete.map(key => caches.delete(key)));
}

function readyshell() {
    currentshell ||= stored(shellmanifest).then(response => response?.json()).catch(() => null);
    return currentshell;
}

function readygame() {
    currentdx ||= stored(dxstate).then(response => response?.json()).catch(() => null);
    return currentdx;
}

function verifiedextras(entries) {
    if (!entries || typeof entries !== "object" || Array.isArray(entries)) return {};
    const result = {};
    for (const path of paths(Object.keys(entries), dxroot)) {
        const hash = entries[path.slice(dxroot.length)];
        if (/^[\da-f]{8,64}$/i.test(hash || "")) result[path] = hash;
    }
    return result;
}

function extrakey(path, hash) {
    return `${path}?asset=${hash}`;
}

function gamemanifest() {
    manifestloading ||= fetch(dxmanifest, {cache: "no-cache"}).then(response => {
        if (!response.ok) throw new Error("Offline game files unavailable");
        return response.json();
    }).finally(() => {manifestloading = null});
    return manifestloading;
}

async function preparegame(quality) {
    const data = await gamemanifest();
    if (![data.version, data.versions?.common, data.versions?.[quality]].every(version => /^[\da-f]{8,64}$/i.test(version))) {
        throw new Error("Invalid offline game version");
    }
    const common = paths(data.common, dxroot);
    const pack = paths(data[quality], dxroot);
    if (!common.includes(dxindex)) throw new Error("Offline game index missing");
    const optional = verifiedextras(data.optional);
    const compress = new Set(paths(data.compress || [], dxroot));
    const compression = compress.size && typeof CompressionStream === "function" && typeof DecompressionStream === "function";
    const commoncache = dxprefix + (compression ? "common-gzip-" : "common-") + data.versions.common;
    const packcache = dxprefix + quality + "-" + data.versions[quality];
    const previous = await readygame();
    const ready = {
        common: previous?.common === legacyname(commoncache) ? previous.common : commoncache,
        pack: previous?.pack === legacyname(packcache) ? previous.pack : packcache,
        quality, optional, format: 2, version: data.version
    };
    if (previous?.version === ready.version && previous.quality === quality && previous.common === ready.common && previous.format === ready.format) {
        await sweepgames(ready);
        return;
    }
    const staged = {quality, optional};
    stagingdx = staged;
    try {
        if (previous?.common !== ready.common) {
            const old = previous && await caches.open(previous.common);
            const reuse = path => /\/_framework\/[^/]+\.[a-z\d]{10}\.[a-z\d]+$/.test(path) ? old?.match(path) : null;
            await fill(await caches.open(ready.common), common, reuse, Boolean(previous), compress);
        }
        if (previous?.pack !== ready.pack) await fill(await caches.open(ready.pack), pack, null, Boolean(previous));
        await save(dxstate, ready);
        currentdx = Promise.resolve(ready);
    } finally {if (stagingdx === staged) stagingdx = null}
    await sweepgames(ready);
}

async function sweepgames(ready) {
    const clients = await self.clients.matchAll({type: "window", includeUncontrolled: true});
    const active = new Set(clients.filter(client => new URL(client.url).pathname.startsWith(dxroot)).map(client => client.id));
    for (const id of games.keys()) if (!active.has(id)) games.delete(id);
    if (!active.size) {
        const names = await caches.keys();
        const obsolete = names.filter(key => (key.startsWith(dxprefix) || key.startsWith(legacyname(dxprefix)))
            && key !== ready.common && key !== ready.pack);
        await Promise.all(obsolete.map(key => caches.delete(key)));
        for (const name of [dxoptional, legacyname(dxoptional)].filter(name => names.includes(name))) {
            const extras = await caches.open(name);
            for (const request of await extras.keys()) {
                const url = new URL(request.url);
                if (ready.optional[url.pathname] !== url.searchParams.get("asset")) await extras.delete(request);
            }
        }
    }
}

async function prepare() {
    await prepareshell().catch(() => {});
    let quality;
    do {
        quality = wantedquality;
        await preparegame(quality).catch(() => {});
    } while (quality !== wantedquality);
}

/*//////////////////////////////////////////////////////////////////////*/

async function homeroute(event) {
    const id = event.resultingClientId || event.clientId;
    try {
        if (self.navigator.onLine === false) throw new Error("Offline");
        const response = await fetch(event.request);
        if (response.status >= 500) throw new Error("Site unavailable");
        offlinenavigation.delete(id);
        return response;
    } catch {
        const shell = await readyshell();
        const cached = shell && await caches.match("/index.html", {cacheName: shell.name});
        if (cached) {
            if (offlinenavigation.size >= 64) offlinenavigation.delete(offlinenavigation.values().next().value);
            offlinenavigation.add(id);
            return cached;
        }
        return new Response("Open the site online first to use it offline.", {status: 503, headers: {"Content-Type": "text/plain; charset=utf-8"}});
    }
}

async function gameroute(event, path, navigate) {
    const id = navigate ? event.resultingClientId || event.clientId : event.clientId;
    let ready = games.get(id) || await readygame() || stagingdx;
    if (!ready && navigate && self.navigator.onLine !== false && !offlinenavigation.has(event.clientId)) {
        const data = await gamemanifest().catch(() => null);
        if (data) ready = {quality: wantedquality || "medium", optional: verifiedextras(data.optional)};
    }
    if (ready) {
        if (navigate && id) {
            const url = new URL(event.request.url);
            const offline = url.searchParams.has("offlinequality") || offlinenavigation.has(event.clientId) || self.navigator.onLine === false;
            games.set(id, {...ready, offline});
        }
        const content = /^content\/(?:(?:low|medium)\/)?(?:images|sounds)\//.test(path.slice(dxroot.length));
        const name = content ? ready.pack : ready.common;
        const response = name && await caches.match(path, {cacheName: name}).catch(() => null);
        if (response) return unpack(response);
        if (ready.optional?.[path]) return extraasset(event.request, path, ready.optional[path]);
    }
    return fetch(event.request);
}

async function extraasset(request, path, hash) {
    const cache = await caches.open(dxoptional).catch(() => null);
    const key = extrakey(path, hash);
    const saved = await cache?.match(key).catch(() => null)
        || await caches.match(key, {cacheName: legacyname(dxoptional)}).catch(() => null);
    if (saved) return saved;
    const response = await fetch(request);
    if (cache && response.status === 200 && !response.redirected && response.body) {
        await cache.put(key, response.clone()).catch(() => {});
    }
    return response;
}

async function gameassets(event) {
    const client = await self.clients.get(event.clientId);
    const ready = games.get(event.clientId) || await readygame() || stagingdx;
    if (!client || !new URL(client.url).pathname.startsWith(dxroot) || !ready) {
        return json({offline: self.navigator.onLine === false, quality: "", files: []});
    }
    const assets = await Promise.all([dxoptional, legacyname(dxoptional)].map(async name => {
        const cache = await caches.has(name) && await caches.open(name);
        return cache ? cache.keys() : [];
    })).catch(() => []);
    const base = dxroot + "content/" + (ready.quality === "high" ? "" : ready.quality + "/");
    const files = new Set();
    for (const request of assets.flat()) {
        const url = new URL(request.url);
        const relative = url.pathname.slice(base.length);
        if (url.pathname.startsWith(base) && /^(images|sounds)\//.test(relative) && ready.optional?.[url.pathname] === url.searchParams.get("asset")) files.add(relative);
    }
    return json({offline: ready.offline === true || self.navigator.onLine === false, quality: ready.quality, files: [...files]});
}

async function shellasset(event, url) {
    const request = event.request;
    const path = url.pathname;
    const shell = await readyshell();
    if (!shell?.files[path]) return fetch(request);
    try {
        if (self.navigator.onLine === false || offlinenavigation.has(event.clientId)) throw new Error("Offline");
        const response = await fetch(request);
        if (response.status === 404 || response.status >= 500) throw new Error("Site file unavailable");
        return response;
    } catch (error) {
        const cached = await caches.match(path, {cacheName: shell.name});
        if (!cached) throw error;
        const range = request.headers.get("Range")?.match(/^bytes=(\d+)-(\d*)$/);
        if (!range) return cached;
        const bytes = await cached.arrayBuffer();
        const start = Number(range[1]);
        const end = Math.min(range[2] ? Number(range[2]) : bytes.byteLength - 1, bytes.byteLength - 1);
        if (start > end) return new Response(null, {status: 416, headers: {"Content-Range": "bytes */" + bytes.byteLength}});
        const headers = new Headers(cached.headers);
        headers.delete("Content-Encoding");
        headers.set("Content-Length", String(end - start + 1));
        headers.set("Content-Range", `bytes ${start}-${end}/${bytes.byteLength}`);
        return new Response(bytes.slice(start, end + 1), {status: 206, headers});
    }
}

/*//////////////////////////////////////////////////////////////////////*/

self.addEventListener("install", event => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", event => {
    const {request} = event;
    const url = new URL(request.url);
    if (request.method !== "GET" || url.origin !== self.location.origin || request.headers.has("Authorization")) return;
    if (url.pathname === "/offline/dx-assets") {
        event.respondWith(gameassets(event));
    } else if (url.pathname === "/offline/status") {
        event.respondWith(readygame().then(ready => json({
            offline: offlinenavigation.has(event.clientId),
            dx: ready?.quality || ""
        })));
    } else if (request.mode === "navigate" && ["/", "/index.html"].includes(url.pathname)) {
        event.respondWith(homeroute(event));
    } else if (url.pathname.startsWith(dxroot)) {
        const navigation = request.mode === "navigate";
        const path = navigation && url.pathname === dxroot ? dxindex : url.pathname;
        event.respondWith(gameroute(event, path, navigation));
    } else if (/^\/(?:src\/|assets\/|preview\/(?:src\/|editor\.html$|index\.css$|favicon\.png$))/.test(url.pathname) && !url.pathname.includes("/.")) {
        event.respondWith(shellasset(event, url));
    }
});

self.addEventListener("message", event => {
    const {source, data} = event;
    if (!source?.url || new URL(source.url).origin !== self.location.origin) return;
    if (data?.type === "online") {
        offlinenavigation.delete(source.id);
        return;
    }
    if (data?.type !== "cache-offline") return;
    wantedquality = qualities.includes(data.quality) ? data.quality : "medium";
    warming ||= prepare().finally(() => {warming = null});
    const type = data.reply === "cdm-offline" ? "cdm-offline" : legacyname("cdm-offline");
    event.waitUntil(warming.then(() => source.postMessage({type})));
});
