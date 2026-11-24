import {readentry, replacementkey} from "./package.js";
import {decode, encodelike, join} from "/raw2png/src/textures.js";
import {dimensions} from "/raw2png/src/pixels.js";

const rawpattern = /\.raw(\d*)(\.zst)?$/i;
const imagepattern = /\.(png|jpe?g|webp)$/i;
const limit = 128 * 1024 * 1024;
const mimetypes = {png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp"};

const sounds = {
    ogg: "audio/ogg", oga: "audio/ogg", opus: "audio/ogg", mp3: "audio/mpeg", wav: "audio/wav",
    aac: "audio/aac", m4a: "audio/mp4", caf: "audio/x-caf", aif: "audio/aiff", aiff: "audio/aiff",
    flac: "audio/flac", amr: "audio/amr", mid: "audio/midi", midi: "audio/midi", mka: "audio/x-matroska",
    wma: "audio/x-ms-wma", ac3: "audio/ac3", adts: "audio/aac"
};
const videos = {
    mp4: "video/mp4", m4v: "video/mp4", mov: "video/quicktime", webm: "video/webm",
    ogv: "video/ogg", "3gp": "video/3gpp", mkv: "video/x-matroska", avi: "video/x-msvideo",
    mpg: "video/mpeg", mpeg: "video/mpeg", wmv: "video/x-ms-wmv", flv: "video/x-flv",
    bik: "video/vnd.radgamettools.bink", bk2: "video/vnd.radgamettools.bink"
};

function avformat(entry) {
    const extension = /\.([a-z\d]+)$/i.exec(entry.path)?.[1].toLowerCase();
    const mimetype = Object.hasOwn(sounds, extension) ? sounds[extension]
        : Object.hasOwn(videos, extension) ? videos[extension] : "";
    return mimetype ? {kind: mimetype.split("/")[0], mimetype} : null;
}

export function mediaentries(entries, pkg, images = textures(entries, pkg)) {
    const result = images.map(item => ({...item, kind: "image"}));
    for (const entry of entries) {
        const format = avformat(entry);
        if (format) result.push({...entry, ...format, parts: [entry]});
    }
    return result;
}

export async function previewmedia(item, replacements) {
    if (item.kind === "image" || !item.kind) return previewtexture(item, replacements);
    return new Blob([await encoded(item, replacements)], {type: item.mimetype});
}

export function textures(entries, pkg) {
    const result = [];
    const groups = new Map();
    for (const entry of entries) {
        if (pkg.extension !== "ipa" && !/^assets\//i.test(entry.path)) continue;
        if (pkg.extension === "ipa" && !/^Payload\/[^/]+\.app\//i.test(entry.path)) continue;
        const raw = rawpattern.exec(entry.path);
        if (raw) {
            const path = entry.path.slice(0, raw.index) + ".raw" + (raw[2] ?? "");
            const key = replacementkey({...entry, path});
            const group = groups.get(key) ?? [];
            group.push({entry, index: Number(raw[1])});
            groups.set(key, group);
        } else if (imagepattern.test(entry.path) && !/(?:^|\/)(?:AppIcon\d*|Default(?:[-@][^/]*)?|iTunesArtwork)\./i.test(entry.path)) {
            result.push({...entry, parts: [entry]});
        }
    }
    for (const group of groups.values()) {
        group.sort((a, b) => a.index - b.index);
        if (group.some(({index}, position) => index !== position)) continue;
        const parts = group.map(({entry}) => entry);
        result.push({...parts[0], parts, raw: true});
    }
    return result.filter(item => item.parts.reduce((size, entry) => size + entry.size, 0) <= limit);
}

async function encoded(item, replacements) {
    const parts = [];
    for (const part of item.parts) {
        parts.push(replacements?.get(replacementkey(part)) ?? await readentry(part.entry, "uint8array", limit));
    }
    return parts.length === 1 ? parts[0] : join(parts);
}

export async function previewtexture(item, replacements) {
    const bytes = await encoded(item, replacements);
    if (item.raw || /\.png$/i.test(item.path)) return new Blob([await decode(bytes)], {type: "image/png"});
    return new Blob([bytes], {type: mimetypes[imagepattern.exec(item.path)[1].toLowerCase()]});
}

export function texturename(item) {
    const name = item.path.split("/").at(-1);
    return item.raw ? name.replace(rawpattern, ".png") : name;
}

export async function replacetexture(item, file) {
    if (file.size > 20 * 1024 * 1024) throw new Error("Choose an image smaller than 20 MB.");
    const original = await previewtexture(item);
    const image = await createImageBitmap(file);
    let pixels;
    try {
        const bitmap = await createImageBitmap(original);
        const {width, height} = bitmap;
        bitmap.close();
        dimensions(width, height);
        const canvas = new OffscreenCanvas(width, height);
        canvas.getContext("2d").drawImage(image, 0, 0, width, height);
        const blob = await canvas.convertToBlob({type: original.type});
        if (blob.type !== original.type) throw new Error("This browser cannot encode the original image format.");
        pixels = new Uint8Array(await blob.arrayBuffer());
    } finally {
        image.close();
    }
    if (item.raw) pixels = await encodelike(pixels, await encoded(item));
    if (pixels.length > limit || pixels.length < item.parts.length) throw new Error("The replacement texture size is invalid.");
    const replacements = new Map();
    let start = 0;
    let originalsize = 0;
    const total = item.parts.reduce((size, part) => size + part.size, 0);
    for (const [index, part] of item.parts.entries()) {
        originalsize += part.size;
        const remaining = item.parts.length - 1 - index;
        const end = remaining ? Math.min(pixels.length - remaining, Math.max(start + 1, Math.round(originalsize / total * pixels.length))) : pixels.length;
        replacements.set(replacementkey(part), pixels.subarray(start, end));
        start = end;
    }
    return replacements;
}
