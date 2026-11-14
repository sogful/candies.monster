import {repairxml} from "/assets/static/js/levels/repair.js";
import {bundled} from "./bundle.js";
const sources = new Map();
const originals = new Map();

async function download(file) {
    const response = await fetch(file);
    if (!response.ok) throw new Error("Level unavailable");
    const limit = 2 * 1024 * 1024;
    if (Number(response.headers.get("Content-Length")) > limit) throw new Error("Level too large");
    const reader = response.body.getReader();
    const chunks = [];
    let length = 0;
    try {
        while (true) {
            const {done, value} = await reader.read();
            if (done) break;
            length += value.length;
            if (length > limit) throw new Error("Level too large");
            chunks.push(value);
        }
    } catch (error) {
        await reader.cancel();
        throw error;
    } finally {reader.releaseLock()}
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.length;
    }
    return new TextDecoder().decode(bytes).trim();
}

async function read(file, local) {
    let text = await bundled(file);
    if (text === null) {
        if (local) throw new Error("Preview not available yet");
        text = await download(file);
    }
    text = text.trim();
    if (text.startsWith("{") || text.startsWith("[")) {
        await import("/assets/static/js/levels/conversion.js");
        text = window.ctrconversion.jsonleveltoxml(JSON.parse(text));
    }
    return text;
}

export function original(file, local = false) {
    const key = (local ? "local:" : "") + file;
    if (!originals.has(key)) {
        originals.set(key, read(file, local).catch(error => {originals.delete(key); throw error}));
        if (originals.size > 40) originals.delete(originals.keys().next().value);
    }
    return originals.get(key);
}

/*//////////////////////////////////////////////////////////////////////*/

export function source(file, local = false) {
    const key = (local ? "local:" : "") + file;
    if (!sources.has(key)) {
        sources.set(key, original(file, local).then(repairxml).then(text => {
            const parsed = new DOMParser().parseFromString(text, "application/xml");
            if (parsed.querySelector("parsererror") || parsed.documentElement.localName !== "map") throw new Error("Invalid level");
            return text;
        }).catch(error => {
            sources.delete(key);
            throw error;
        }));
        if (sources.size > 40) sources.delete(sources.keys().next().value);
    }
    return sources.get(key);
}
