import {configuration} from "./service.js";
import {offline, markoffline} from "./offline.js";

const filepattern = /^\d{17,22}\/\d{17,22}$/;
const idpattern = /^\d{17,22}$/;
const maxfile = 2 * 1024 * 1024;
let opening;

function database() {
    if (!opening) opening = new Promise((resolve, reject) => {
        const request = indexedDB.open("candies-level-library", 1);
        request.onupgradeneeded = () => {
            request.result.createObjectStore("catalogues");
            request.result.createObjectStore("files");
        };
        request.onsuccess = () => {
            const connection = request.result;
            connection.onversionchange = () => {connection.close(); opening = null};
            resolve(connection);
        };
        request.onerror = () => reject(request.error);
    }).catch(error => {opening = null; throw error});
    return opening;
}

function get(store, key) {
    return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/*//////////////////////////////////////////////////////////////////////*/

function validate(update, saved) {
    if (!update || typeof update.cursor !== "string" || !update.cursor || typeof update.full !== "boolean"
        || (!update.full && !saved) || !Array.isArray(update.levels) || !Array.isArray(update.removed)
        || !update.files || typeof update.files !== "object" || Array.isArray(update.files)) throw new Error("Invalid level sync");
    if (update.levels.some(level => !idpattern.test(level?.id) || !Array.isArray(level.files))
        || update.removed.some(id => !idpattern.test(id))) throw new Error("Invalid level sync rows");
    if (update.removedfiles !== undefined && (!Array.isArray(update.removedfiles)
        || update.removedfiles.some(file => !filepattern.test(file)))) throw new Error("Invalid removed level files");
    for (const [key, text] of Object.entries(update.files)) {
        if (!filepattern.test(key) || typeof text !== "string" || !text || text.length > maxfile) throw new Error("Invalid level sync file");
    }
}

function merge(saved, update) {
    const levels = new Map((update.full ? [] : saved.levels).map(level => [level.id, level]));
    for (const id of update.removed) levels.delete(id);
    for (const level of update.levels) levels.set(level.id, level);
    return {cursor: update.cursor, updated: update.updated, tags: update.tags ?? saved?.tags ?? [], levels: Array.from(levels.values())};
}

async function save(connection, key, saved, update) {
    const transaction = connection.transaction(["catalogues", "files"], "readwrite");
    const done = new Promise((resolve, reject) => {
        transaction.oncomplete = resolve;
        transaction.onabort = () => reject(transaction.error || new Error("Level storage interrupted"));
    });
    const catalogues = transaction.objectStore("catalogues");
    const current = await get(catalogues, key);
    if (current?.cursor !== saved?.cursor) {await done; return current}
    if (!update.full && current?.cursor === update.cursor) {await done; return current}
    const next = merge(current, update);
    const files = transaction.objectStore("files");
    if (update.full) files.delete(IDBKeyRange.bound([key, ""], [key, "\uffff"]));
    else for (const file of update.removedfiles || []) files.delete([key, file]);
    for (const [file, text] of Object.entries(update.files)) files.put(text, [key, file]);
    catalogues.put(next, key);
    await done;
    return next;
}

/*//////////////////////////////////////////////////////////////////////*/

export async function synclibrary(base) {
    const key = new URL(base).origin;
    const connection = await database().catch(() => null);
    if (!connection) return null;
    const saved = await get(connection.transaction("catalogues").objectStore("catalogues"), key);
    if (offline()) return saved || null;
    const url = new URL("/levels/sync", key);
    if (saved?.cursor) url.searchParams.set("since", saved.cursor);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), saved ? 15000 : 60000);
    try {
        let response;
        try {response = await fetch(url, {credentials: "omit", signal: controller.signal})}
        catch {
            if (saved) markoffline();
            return saved || null;
        }
        if (!response.ok) return null;
        const update = await response.json();
        validate(update, saved);
        return await save(connection, key, saved, update);
    } catch {
        return saved || null;
    } finally {clearTimeout(timer)}
}

export async function storedlevel(file) {
    const url = new URL(file, location.href);
    const match = /^\/levels\/(\d{17,22})\/files\/(\d{17,22})$/.exec(url.pathname);
    if (!match) return null;
    const settings = await configuration;
    const key = new URL(settings.community || settings.endpoint).origin;
    if (key !== url.origin && new URL(settings.endpoint).origin !== url.origin) return null;
    const connection = await database();
    return await get(connection.transaction("files").objectStore("files"), [key, match[1] + "/" + match[2]]) ?? null;
}
