import {drawframe, quadparse} from "/assets/static/js/images/atlas.js";
import {readentry} from "./package.js";
import {previewtexture, replacetexture} from "./sprites.js";

const encoding = new TextDecoder();
const wideencoding = new TextDecoder("utf-16le");
const indexes = new WeakMap();
const nativeindexes = new WeakMap();
const quadindexes = new WeakMap();
const imagetype = /\.(?:raw(?:\.zst)?|jpe?g|png|webp)$/i;
const maxlibrary = 48 * 1024 * 1024;

function readliteral(bytes, from, width, limit) {
    let result = "";
    for (let offset = from; offset + width <= bytes.length && offset - from < limit; offset += width) {
        let code = bytes[offset];
        if (width >= 2) code += bytes[offset + 1] * 256;
        if (width === 4) code += bytes[offset + 2] * 65536 + bytes[offset + 3] * 16777216;
        if (!code) {
            if (width === 4) return result;
            return (width === 1 ? encoding : wideencoding).decode(bytes.subarray(from, offset));
        }
        if (width === 4 && code <= 0x10ffff) result += String.fromCodePoint(code);
        else if (width === 4) return "";
    }
    return "";
}

function compiledatlases(bytes, index) {
    const marker = "<info";
    for (const width of [1, 2, 4]) {
        for (let offset = 0; offset < bytes.length - marker.length * width; offset++) {
            if (bytes[offset] !== 60) continue;
            let matched = true;
            for (let char = 0; char < marker.length; char++) {
                const at = offset + char * width;
                if (bytes[at] !== marker.charCodeAt(char) || width >= 2 && bytes[at + 1] ||
                    width === 4 && (bytes[at + 2] || bytes[at + 3])) {
                    matched = false;
                    break;
                }
            }
            if (!matched) continue;
            let previous = offset - width;
            if (bytes[previous] !== 0) continue;
            while (previous >= offset - 4 * width && bytes[previous] === 0) previous -= width;
            const end = previous + width;
            while (previous >= 0 && end - previous <= 1024 && bytes[previous] >= 32 && bytes[previous] <= 126 &&
                (width === 1 || !bytes[previous + 1]) && (width !== 4 || !(bytes[previous + 2] || bytes[previous + 3]))) previous -= width;
            const name = readliteral(bytes, previous + width, width, 1024).replaceAll("\\", "/").toLowerCase();
            if (!/^[a-z0-9_./ -]+$/i.test(name) || !imagetype.test(name)) continue;
            const xml = readliteral(bytes, offset, width, 512 * 1024);
            if (!xml.includes("<quads>")) continue;
            const found = index.get(name) ?? new Set();
            found.add(xml);
            index.set(name, found);
        }
    }
}

function nativeindex(item) {
    if (!nativeindexes.has(item.entry)) {
        nativeindexes.set(item.entry, readentry(item.entry, "uint8array", maxlibrary).then(bytes => {
            const index = new Map();
            compiledatlases(bytes, index);
            return index;
        }).catch(() => new Map()));
    }
    return nativeindexes.get(item.entry);
}

async function atlasindex(entries, all = false) {
    const native = entries.filter(entry => entry.size <= maxlibrary &&
        (/^lib\/(?:x86(?:_64)?|arm64-v8a|armeabi(?:-v7a)?)\/lib(?:ctr[^/]*|timetravel)\.so$/i.test(entry.path) ||
            /^Payload\/([^/]+)\.app\/\1$/i.test(entry.path)));
    const index = new Map();
    for (const item of all ? native : native.slice(0, 4)) {
        const found = await nativeindex(item);
        if (!all && found.size) return found;
        for (const [path, descriptions] of found) {
            const layouts = index.get(path) ?? new Set();
            for (const xml of descriptions) layouts.add(xml);
            index.set(path, layouts);
        }
    }
    return index;
}

function parseframes(xml, image) {
    const frames = quadparse(xml);
    if (frames.some(({x, y, w, h}) => ![x, y, w, h].every(Number.isSafeInteger) ||
        x < 0 || y < 0 || w < 0 || h < 0 || x + w > image.width || y + h > image.height)) return [];
    const offsets = xml.match(/<offsets>\s*([^<]+)<\/offsets>/i)?.[1].split(/[\s,]+/).filter(Boolean).map(Number);
    if (offsets?.length === frames.length * 2 && offsets.every(Number.isSafeInteger)) {
        const sourcewidth = Number(xml.match(/<preCutWidth>\s*(\d+)\s*<\/preCutWidth>/i)?.[1]) || 0;
        const sourceheight = Number(xml.match(/<preCutHeight>\s*(\d+)\s*<\/preCutHeight>/i)?.[1]) || 0;
        for (const [index, frame] of frames.entries()) {
            frame.xoffset = offsets[index * 2];
            frame.yoffset = offsets[index * 2 + 1];
            frame.sourcewidth = sourcewidth;
            frame.sourceheight = sourceheight;
        }
    }
    return frames.filter(({w, h}) => w > 0 && h > 0);
}

function texturestem(path) {
    return path.replace(imagetype, "");
}

function atlaspath(path) {
    return path.toLowerCase().replace(/^assets\/|^payload\/[^/]+\.app\//, "").replace(/\.zst$/, "");
}

function atlaskeys(item, entries) {
    const path = atlaspath(item.path);
    const name = path.split("/").at(-1);
    const keys = new Set();
    if (entries.filter(entry => atlaspath(entry.path) === path).length === 1) {
        keys.add(path);
        keys.add(item.path.toLowerCase().replace(/^assets\/|^payload\/[^/]+\.app\//, ""));
    }
    if (entries.filter(entry => atlaspath(entry.path).split("/").at(-1) === name).length === 1) keys.add(name);
    return keys;
}

export async function binaryquads(entries, item) {
    if (!quadindexes.has(entries)) quadindexes.set(entries, atlasindex(entries, true));
    const index = await quadindexes.get(entries);
    const keys = item ? atlaskeys(item, entries) : index.keys();
    const files = [];
    const names = new Set();
    const selected = new Set();
    for (const key of keys) {
        const path = key.split("/").filter(part => part && part !== "." && part !== "..").join("/");
        if (!path) continue;
        let number = 1;
        for (const xml of index.get(key) ?? []) {
            if (item && selected.has(xml)) continue;
            selected.add(xml);
            let name = path + ".xml";
            while (names.has(name)) name = path + "-" + ++number + ".xml";
            names.add(name);
            files.push({name, xml});
        }
    }
    return files;
}

export async function exportquads(entries, item, filename, download) {
    const files = await binaryquads(entries, item);
    if (!files.length) throw new Error("No compiled quads were found.");
    if (item && files.length === 1) {
        const {name, xml} = files[0];
        download(new Blob([xml], {type: "application/xml"}), name.split("/").at(-1));
        return;
    }
    const zip = new globalThis.JSZip();
    for (const {name, xml} of files) zip.file(name, xml);
    download(await zip.generateAsync({type: "blob", compression: "DEFLATE"}), filename.replace(/\.[^.]+$/, "") + "-quads.zip");
}

/*//////////////////////////////////////////////////////////////////////*/

export async function findsplits(item, entries, replacements, atlasblob) {
    if (!item || !entries || !imagetype.test(item.path)) return [];
    const stem = texturestem(item.path);
    const sidecar = entries.find(entry => entry.scope === item.scope && entry.path.toLowerCase() === (stem + ".xml").toLowerCase());
    let descriptions = [];
    if (sidecar) {
        try {descriptions.push(await readentry(sidecar.entry, "string", 1024 * 1024))}
        catch {}
    }
    if (!descriptions.some(xml => quadparse(xml).length)) {
        const keys = atlaskeys(item, entries);
        if (!keys.size) return [];
        if (!indexes.has(entries)) indexes.set(entries, atlasindex(entries));
        const index = await indexes.get(entries);
        descriptions = [...new Set([...keys].flatMap(key => [...(index.get(key) ?? [])]))];
    }
    if (!descriptions.length) return [];
    let image;
    try {image = await createImageBitmap(atlasblob ?? await previewtexture(item, replacements))}
    catch {return []}
    const layouts = new Map();
    try {
        for (const xml of descriptions) {
            const frames = parseframes(xml, image);
            const needsalpha = /\bfileFormat\s*=\s*['"]3['"]/i.test(xml);
            if (frames.length) layouts.set(JSON.stringify(frames) + ":" + needsalpha, {frames, needsalpha});
        }
    } finally {
        image.close();
    }
    if (layouts.size !== 1) return [];
    const {frames, needsalpha} = layouts.values().next().value;
    const alphafile = needsalpha && entries.find(entry =>
        entry.scope === item.scope && entry.path.toLowerCase() === (stem + "_alpha.png").toLowerCase() && entry.size <= 20 * 1024 * 1024);
    if (alphafile) {
        const alpha = {...alphafile, parts: [alphafile]};
        for (const frame of frames) frame.alpha = alpha;
    }
    return frames;
}

function framecanvas(frame) {
    const canvas = new OffscreenCanvas(frame.w, frame.h);
    const context = canvas.getContext("2d", {willReadFrequently: true});
    return {canvas, context};
}

export async function rendersplit(atlasblob, frame, replacements) {
    const atlas = await createImageBitmap(atlasblob);
    try {
        const {canvas, context} = framecanvas(frame);
        drawframe(context, atlas, frame);
        if (frame.alpha) {
            const alpha = await createImageBitmap(await previewtexture(frame.alpha, replacements));
            try {
                if (atlas.width !== alpha.width || atlas.height !== alpha.height) throw new Error("Sprite alpha texture dimensions do not match.");
                const mask = framecanvas(frame).context;
                drawframe(mask, alpha, frame);
                const opacity = mask.getImageData(0, 0, frame.w, frame.h).data;
                const pixels = context.getImageData(0, 0, frame.w, frame.h);
                for (let i = 0; i < opacity.length; i += 4) pixels.data[i + 3] = opacity[i];
                context.putImageData(pixels, 0, 0);
            } finally {
                alpha.close();
            }
        }
        return canvas.convertToBlob({type:"image/png"});
    } finally {
        atlas.close();
    }
}

async function replaceonatlas(item, replacements, frame, sprite, mask) {
    const atlas = await createImageBitmap(await previewtexture(item, replacements));
    try {
        if (frame.x < 0 || frame.y < 0 || frame.x + frame.w > atlas.width || frame.y + frame.h > atlas.height) {
            throw new Error("This sprite is outside the texture.");
        }
        const canvas = new OffscreenCanvas(atlas.width, atlas.height);
        const context = canvas.getContext("2d");
        context.imageSmoothingEnabled = false;
        context.drawImage(atlas, 0, 0);
        context.clearRect(frame.x, frame.y, frame.w, frame.h);
        if (mask || frame.alpha) {
            const crop = framecanvas(frame).context;
            crop.drawImage(sprite, 0, 0, frame.w, frame.h);
            const maskpixels = crop.getImageData(0, 0, frame.w, frame.h);
            for (let i = 0; i < maskpixels.data.length; i += 4) {
                if (mask) maskpixels.data[i] = maskpixels.data[i + 1] = maskpixels.data[i + 2] = maskpixels.data[i + 3];
                maskpixels.data[i + 3] = 255;
            }
            context.putImageData(maskpixels, frame.x, frame.y);
        } else {
            context.drawImage(sprite, frame.x, frame.y, frame.w, frame.h);
        }
        return replacetexture(item, await canvas.convertToBlob({type:"image/png"}));
    } finally {
        atlas.close();
    }
}

export async function replacesplit(item, replacements, frame, file) {
    if (file.size > 20 * 1024 * 1024) throw new Error("Choose an image smaller than 20 MB.");
    const sprite = await createImageBitmap(file);
    try {
        const updated = await replaceonatlas(item, replacements, frame, sprite, false);
        if (frame.alpha) {
            const mask = await replaceonatlas(frame.alpha, replacements, frame, sprite, true);
            for (const [key, value] of mask) updated.set(key, value);
        }
        return updated;
    } finally {
        sprite.close();
    }
}
