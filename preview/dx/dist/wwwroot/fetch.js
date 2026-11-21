// Byte fetching for the content store. A byte[] cannot cross the async interop boundary
// directly, so a fetch resolves into a JS-side stash keyed by URL; the managed side then
// copies it out synchronously into a buffer it already sized.

import { setLoadingProgress } from "./loading-progress.js";

const stash = new Map();

export let assetloadfailure = null;

function webpheader(bytes) {
    return bytes.length >= 20
        && bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70
        && bytes[8] === 87 && bytes[9] === 69 && bytes[10] === 66 && bytes[11] === 80
        && new DataView(bytes.buffer).getUint32(4, true) + 8 === bytes.length;
}

async function requestasset(url, webp, cache) {
    try {
        const response = await fetch(url, cache ? {cache} : undefined);
        if (!response.ok) {
            return {reason: "asset request failed", status: response.status};
        }
        const bytes = new Uint8Array(await response.arrayBuffer());
        if (bytes.length && (!webp || webpheader(bytes))) return {bytes};
        return {reason: "asset response invalid"};
    } catch {
        return {reason: "network fetch failed"};
    }
}

export async function fetchBytes(url) {
    const asset = url.match(/^\.\/content\/((?:images|fonts)\/[\w/-]+\.(?:webp|png|ttf|otf))$/i)?.[1];
    const webp = asset?.endsWith(".webp");
    const selected = globalThis.ctrdxquality?.url(url) ?? url;
    let result = await requestasset(selected, webp);
    if (!result.bytes && (!result.status || result.status === 408 || result.status >= 500)) {
        result = await requestasset(selected, webp, "reload");
    }
    if (webp && selected !== url && (result.status === 404 || result.status === 410 || result.reason === "asset response invalid")) {
        result = await requestasset(url, webp);
    }
    if (!result.bytes) {
        if (asset && !assetloadfailure) {
            const status = result.status ? "\nstatus: " + result.status : "";
            assetloadfailure = new Error(`Could not preload content '${asset}'.\nreason: ${result.reason}${status}`);
        }
        return -1;
    }

    stash.set(url, result.bytes);
    return result.bytes.length;
}

export function takeStashed(url, destination) {
    const bytes = stash.get(url);
    if (bytes === undefined) {
        return 0;
    }
    destination.set(bytes);
    stash.delete(url);
    return bytes.length;
}

export async function fetchText(url) {
    const response = await fetch(globalThis.ctrdxquality?.url(url) ?? url);
    return response.ok ? await response.text() : null;
}

export function reportContentProgress(type, loaded, total) {
    setLoadingProgress(type, loaded, total);
}
