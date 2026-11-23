import {openplist, plisttext} from "./plist.js";

const keys = {
    package: "CFBundleIdentifier",
    title: "CFBundleDisplayName",
    version: "CFBundleShortVersionString",
    build: "CFBundleVersion",
    minimum: "MinimumOSVersion"
};
const primarypaths = [["CFBundleIcons", "CFBundlePrimaryIcon"], ["CFBundleIcons~ipad", "CFBundlePrimaryIcon"]];
const bitmap = /\.(?:png|jpe?g)$/i;
const bplist = /^bplist00/;
const mb = 1024 * 1024;

function members(zip, prefix) {
    return Object.keys(zip.files).filter(name => name.startsWith(prefix) && !zip.files[name].dir);
}

function basename(path) {
    return path.split("/").at(-1);
}

async function readbytes(zip, path, limit = 8 * mb) {
    const entry = zip.file(path);
    if (!entry || entry._data?.uncompressedSize > limit) throw new Error("The IPA contains an invalid or oversized metadata file.");
    const bytes = await entry.async("uint8array");
    if (bytes.length > limit) throw new Error("The IPA contains an oversized metadata file.");
    return bytes;
}

function iconstem(path) {
    return basename(path).replace(bitmap, "").replace(/(@\d+x|~i(?:pad|phone))+$/gi, "").toLowerCase();
}

function declaredicons(plist, path = []) {
    return [...plist.value([...path, "CFBundleIconFiles"], true), plist.value([...path, "CFBundleIconFile"])]
        .filter(Boolean);
}

function pngsize(bytes) {
    if (bytes.length < 24 || bytes[0] !== 0x89 || bytes[1] !== 0x50 || bytes[2] !== 0x4e || bytes[3] !== 0x47) return null;
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    for (let offset = 8; offset + 20 < bytes.length;) {
        const length = view.getUint32(offset);
        if (offset + 12 + length > bytes.length) break;
        if (view.getUint32(offset + 4) === 0x49484452 && length === 13) {
            return {width: view.getUint32(offset + 8), height: view.getUint32(offset + 12)};
        }
        offset += 12 + length;
    }
    return null;
}

async function iconsize(zip, path) {
    const bytes = await readbytes(zip, path, 16 * mb);
    const png = pngsize(bytes);
    const mime = /\.jpe?g$/i.test(path) ? "image/jpeg" : "image/png";
    if (png?.width && png?.height) return {path, ...png, mime: "image/png"};
    try {
        const image = await createImageBitmap(new Blob([bytes], {type: mime}));
        const {width, height} = image;
        image.close();
        return {path, width, height, mime};
    } catch {
        return null;
    }
}

async function findicons(zip, directory, plist) {
    const paths = [[], ...primarypaths];
    const declared = paths.map(path => declaredicons(plist, path).map(iconstem));
    const names = new Set(declared.flat());
    const files = members(zip, directory).filter(path => bitmap.test(path) && !path.slice(directory.length).includes("/"));
    const selected = files.filter(path => names.has(iconstem(path)) || !names.size && iconstem(path) === "icon");
    const icons = [];
    for (const path of selected) {
        const icon = await iconsize(zip, path);
        if (icon) icons.push(icon);
    }
    icons.sort((a, b) => b.width * b.height - a.width * a.height);
    const catalogpaths = paths.filter((path, index) => plist.value([...path, "CFBundleIconName"]) &&
        icons.some(icon => declared[index].includes(iconstem(icon.path))));
    const artwork = ["iTunesArtwork", "iTunesArtwork@2x"].find(path => zip.file(path));
    return {icons, catalogpaths, artwork};
}

/*//////////////////////////////////////////////////////////////////////*/

export async function readios(zip) {
    const paths = members(zip, "Payload/").filter(path => /^Payload\/[^/]+\.app\/Info\.plist$/i.test(path));
    if (paths.length !== 1) {
        throw new Error(paths.length ? "The IPA contains more than one main app." : "The IPA has no main app Info.plist.");
    }
    const [path] = paths;
    const directory = path.slice(0, -basename(path).length);
    const plist = openplist(await readbytes(zip, path));
    const fields = Object.fromEntries(Object.keys(keys).map(field => [field, true]));
    const metadata = Object.fromEntries(Object.entries(keys).map(([field, key]) => [field, plist.value([key])]));
    metadata.title ||= plist.value(["CFBundleName"]);
    metadata.version ||= metadata.build;
    const {icons, catalogpaths, artwork} = await findicons(zip, directory, plist);
    const iconpaths = icons.map(icon => icon.path);
    const name = plist.value(["CFBundleExecutable"]);
    const executable = name && name === basename(name) && zip.file(directory + name) ? directory + name : "";
    return {...metadata, fields, path, directory, executable, icons, iconpaths, catalogpaths, iconpath: iconpaths[0] || artwork || ""};
}

export async function readiosicon(zip, path) {
    if (!path || !zip.file(path)) return null;
    const bytes = await readbytes(zip, path, 16 * mb);
    const png = pngsize(bytes);
    if (png && String.fromCharCode(...bytes.subarray(12, 16)) === "CgBI") {
        const {decode} = await import("../../raw2png/src/iosimages.js");
        const {encode} = await import("../../raw2png/src/png.js");
        return new Blob([await encode(await decode(bytes))], {type: "image/png"});
    }
    if (!png && (bytes[0] !== 0xff || bytes[1] !== 0xd8)) return null;
    return new Blob([bytes], {type: png ? "image/png" : "image/jpeg"});
}

/*//////////////////////////////////////////////////////////////////////*/

function editfields(metadata, edits) {
    const changes = [];
    for (const [field, key] of Object.entries(keys)) {
        if (edits[field] === undefined || edits[field] === metadata[field]) continue;
        const text = String(edits[field]).trim();
        if (!text || text.length > 256 || /[\u0000-\u001f]/.test(text)) throw new Error("Enter valid app metadata.");
        if (field === "package" && !/^[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(text)) {
            throw new Error("Use a dot-separated iOS bundle identifier.");
        }
        if (["version", "minimum"].includes(field) && !/^\d+(?:\.\d+){0,2}$/.test(text)) {
            throw new Error("Use a numeric iOS version with up to three parts.");
        }
        if (field === "build" && !/^\d+(?:\.\d+){0,2}(?:(?:[dab]|fc)[1-9]\d{0,2})?$/.test(text)) {
            throw new Error("Use a numeric iOS build version.");
        }
        changes.push({path: [key], text});
    }
    return changes;
}

async function updatebundles(zip, metadata, bundle, files) {
    const fields = [["CFBundleIdentifier"], ["WKCompanionAppBundleIdentifier"],
        ["NSExtension", "NSExtensionAttributes", "WKAppBundleIdentifier"]];
    const paths = members(zip, metadata.directory).filter(path =>
        /^(?:PlugIns|Watch|AppClips)\/.+\.(?:app|appex)\/Info\.plist$/i.test(path.slice(metadata.directory.length)));
    for (const path of paths) {
        const plist = openplist(await readbytes(zip, path));
        const changes = [];
        for (const field of fields) {
            const value = plist.value(field);
            if (value === metadata.package || value.startsWith(metadata.package + ".")) {
                changes.push({path: field, text: bundle + value.slice(metadata.package.length)});
            }
        }
        if (changes.length) files.set(path, plist.update(changes));
    }
}

function encodedstrings(bytes, text) {
    if (bytes[0] === 0xff && bytes[1] === 0xfe || bytes[0] === 0xfe && bytes[1] === 0xff ||
        bytes[0] === 0 || bytes[1] === 0) {
        const little = bytes[0] === 0xff || bytes[1] === 0;
        const bom = bytes[0] === 0xff || bytes[0] === 0xfe;
        const result = new Uint8Array(text.length * 2 + (bom ? 2 : 0));
        if (bom) result.set(bytes.subarray(0, 2));
        const view = new DataView(result.buffer);
        for (let i = 0; i < text.length; i++) view.setUint16(i * 2 + (bom ? 2 : 0), text.charCodeAt(i), little);
        return result;
    }
    return new TextEncoder().encode(text);
}

async function localizedtitles(zip, metadata, title, files) {
    const paths = members(zip, metadata.directory).filter(path => /^[^/]+\.lproj\/InfoPlist\.strings$/i.test(path.slice(metadata.directory.length)));
    for (const path of paths) {
        const bytes = await readbytes(zip, path);
        if (!bytes.length) continue;
        const binary = bplist.test(String.fromCharCode(...bytes.subarray(0, 8)));
        const original = binary ? "" : plisttext(bytes);
        if (binary || original.trimStart().startsWith("<")) {
            const plist = openplist(bytes);
            const changes = [keys.title, "CFBundleName"].filter(key => plist.value([key]))
                .map(key => ({path: [key], text: title}));
            if (changes.length) files.set(path, plist.update(changes));
        } else {
            const replaced = original.replace(/\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|("(?:\\.|[^"\\])*"|[\w.$]+)(\s*=\s*)("(?:\\.|[^"\\])*")(\s*;)/g,
                (entry, key, separator, _value, after) => {
                    if (!key || ![keys.title, "CFBundleName"].includes(key.replace(/^"|"$/g, ""))) return entry;
                    return key + separator + JSON.stringify(title) + after;
                });
            if (replaced !== original) files.set(path, encodedstrings(bytes, replaced));
        }
    }
}

async function resizepng(blob, width, height, mime) {
    const image = await createImageBitmap(blob);
    try {
        const canvas = new OffscreenCanvas(width, height);
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Could not resize the icon.");
        const scale = Math.max(width / image.width, height / image.height);
        const wide = image.width * scale;
        const tall = image.height * scale;
        context.drawImage(image, (width - wide) / 2, (height - tall) / 2, wide, tall);
        return await canvas.convertToBlob({type: mime});
    } finally {
        image.close();
    }
}

/*//////////////////////////////////////////////////////////////////////*/

export async function writeios(zip, metadata, edits, icon, resizeicon = resizepng) {
    const changes = editfields(metadata, edits);
    const files = new Map();
    const title = changes.find(change => change.path[0] === keys.title)?.text;
    const bundle = changes.find(change => change.path[0] === keys.package)?.text;
    if (title) await localizedtitles(zip, metadata, title, files);
    if (bundle && metadata.package) await updatebundles(zip, metadata, bundle, files);
    if (icon) {
        if (!metadata.icons.length) throw new Error("This IPA has no standalone app icons to replace.");
        const scaled = new Map();
        for (const {path, width, height, mime} of metadata.icons) {
            if (width > 2048 || height > 2048) throw new Error("The original icon is larger than 2048 pixels.");
            const key = `${width}x${height}:${mime}`;
            if (!scaled.has(key)) {
                const converted = await resizeicon(icon, width, height, mime);
                if (!converted?.size || converted.type !== mime) throw new Error("Could not convert the replacement to the icon format.");
                scaled.set(key, await converted.arrayBuffer());
            }
            files.set(path, scaled.get(key));
        }
        for (const path of metadata.catalogpaths) changes.push({path: [...path, "CFBundleIconName"]});
    }
    if (changes.length) {
        const plist = openplist(await readbytes(zip, metadata.path));
        if (title && !plist.value(["CFBundleDisplayName"])) {
            changes.push({path: ["CFBundleName"], text: title});
        }
        files.set(metadata.path, plist.update(changes));
    }
    for (const [path, content] of files) zip.file(path, content);
    return zip;
}
