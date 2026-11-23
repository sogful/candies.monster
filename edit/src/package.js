import {readandroid, writeandroid} from "./android.js";
import {readios, readiosicon, writeios} from "./ios.js";

const mb = 1024 * 1024;
const packagelimit = 512 * mb;
const entrylimit = 128 * mb;
const signatures = /^META-INF\/(?:MANIFEST\.MF|[^/]+\.(?:SF|RSA|DSA|EC))$/i;

function size(entry) {
    return entry._data?.uncompressedSize ?? 0;
}

function validate(zip) {
    const entries = Object.values(zip.files);
    if (entries.length > 50000 || entries.reduce((total, entry) => total + size(entry), 0) > 2 * packagelimit) {
        throw new Error("The archive is too large to edit in the browser.");
    }
    for (const entry of entries) {
        const original = entry.unsafeOriginalName || entry.name;
        if (/^[\\/]|^[a-z]:|(?:^|[\\/])\.\.(?:[\\/]|$)|\0/i.test(original)) {
            throw new Error("The archive contains an invalid file path.");
        }
    }
    return zip;
}

export async function readentry(entry, type = "uint8array", limit = entrylimit) {
    if (!entry || entry.dir) throw new Error("The selected file is missing from the package.");
    if (size(entry) > limit) throw new Error("The selected file is too large to open in the browser.");
    const value = await entry.async(type);
    if ((value.byteLength ?? value.size ?? value.length) > limit) throw new Error("The selected file exceeds the size limit.");
    return value;
}

async function openzip(data) {
    return validate(await globalThis.JSZip.loadAsync(data));
}

/*//////////////////////////////////////////////////////////////////////*/

function readpackage(file, progress) {
    if (!progress || typeof FileReader === "undefined") return file.arrayBuffer();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onprogress = event => {
            if (event.lengthComputable) progress(Math.round(event.loaded / event.total * 100) + "%");
        };
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error || new Error("Could not read this package."));
        reader.readAsArrayBuffer(file);
    });
}

export async function openpackage(file, progress) {
    const extension = file.name.match(/\.(apk|ipa|xapk|apks)$/i)?.[1].toLowerCase();
    if (!extension) throw new Error("Choose an APK, IPA, XAPK, or APKS file.");
    if (file.size > packagelimit) throw new Error("Choose a package smaller than 512 MB.");
    const bytes = await readpackage(file, progress);
    progress?.("Reading archive");
    const zip = await openzip(bytes);
    progress?.("Reading app info");
    if (extension === "ipa") {
        const metadata = await readios(zip);
        return {file, extension, zip, parts: [{zip, metadata}], base: zip, metadata};
    }
    if (extension === "apk") {
        const metadata = await readandroid(zip);
        return {file, extension, zip, parts: [{zip, metadata}], base: zip, metadata};
    }
    const apks = Object.values(zip.files).filter(entry => !entry.dir && /\.apk$/i.test(entry.name));
    if (!apks.length || apks.length > 64) throw new Error("The bundle does not contain a supported set of APKs.");
    const primary = apks.find(entry => /(?:^|\/)base(?:-master)?\.apk$/i.test(entry.name))
        || apks.find(entry => !/(?:^|\/)(?:config\.|split[_-])/i.test(entry.name));
    if (!primary) throw new Error("The bundle has no identifiable base APK.");
    if (apks.reduce((total, entry) => total + size(entry), 0) > packagelimit) {
        throw new Error("The APKs in this bundle exceed 512 MB in total.");
    }
    const parts = [];
    for (const entry of [primary, ...apks.filter(entry => entry !== primary)]) {
        progress?.("Reading APK " + (parts.length + 1) + " of " + apks.length);
        const archive = await openzip(await readentry(entry, "uint8array", packagelimit));
        const metadata = await readandroid(archive, parts[0]?.metadata.iconids);
        parts.push({name: entry.name, zip: archive, metadata});
    }
    const {zip: base, metadata} = parts[0];
    return {file, extension, zip, parts, base, metadata};
}

export function packageentries(pkg) {
    return pkg.parts.flatMap((part, scope) => Object.values(part.zip.files).filter(entry => !entry.dir).map(entry => ({
        scope, path: entry.name, label: part.name ? part.name + " / " + entry.name : entry.name,
        entry, size: size(entry)
    })));
}

export async function packageicon(pkg) {
    const source = pkg.parts.find(part => part.metadata.iconpath);
    const iconpath = source?.metadata.iconpath;
    if (!iconpath) return null;
    if (pkg.extension === "ipa") return readiosicon(pkg.base, iconpath);
    const mime = /\.webp$/i.test(iconpath) ? "image/webp" : /\.jpe?g$/i.test(iconpath) ? "image/jpeg" : "image/png";
    return new Blob([await readentry(source.zip.file(iconpath), "uint8array", 16 * mb)], {type: mime});
}

/*//////////////////////////////////////////////////////////////////////*/

export async function resizeicon(blob, width, height, mime = "image/png") {
    if (blob.size > 20 * mb) throw new Error("Choose an icon image smaller than 20 MB.");
    const image = await createImageBitmap(blob);
    try {
        if (!width || !height || width > 4096 || height > 4096) throw new Error("The package asks for unsupported icon dimensions.");
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        const scale = Math.max(width / image.width, height / image.height);
        const w = image.width * scale;
        const h = image.height * scale;
        context.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
        return await new Promise((resolve, reject) => canvas.toBlob(result => {
            if (!result || result.type !== mime) reject(new Error("This browser cannot encode the requested icon format."));
            else resolve(result);
        }, mime, 0.95));
    } finally {
        image.close();
    }
}

function clearsignatures(zip, ios) {
    for (const path of Object.keys(zip.files)) {
        if (ios ? /(?:^|\/)(?:_CodeSignature(?:\/|$)|CodeResources$)/.test(path) : signatures.test(path)) {
            zip.remove(path);
        }
    }
}

const compression = {compression: "DEFLATE", compressionOptions: {level: 3}};

async function updatebundle(zip, edits) {
    const entry = zip.file("manifest.json");
    if (!entry) return;
    const manifest = JSON.parse(await readentry(entry, "string", mb));
    for (const [key, value] of Object.entries({
        package_name: edits.package, name: edits.title, version_name: edits.version,
        version_code: edits.build, min_sdk_version: edits.minsdk, target_sdk_version: edits.targetsdk
    })) {
        if (value === undefined || !(key in manifest)) continue;
        manifest[key] = typeof manifest[key] === "number" ? Number(value) : value;
    }
    zip.file(entry.name, JSON.stringify(manifest));
}

export function replacementkey({scope, path}) {
    return scope === 0 ? path : scope + "\0" + path;
}

export async function exportpackage(file, edits, icon, replacements, progress) {
    const pkg = await openpackage(file);
    if (pkg.zip.file("toc.pb") && Object.keys(edits).length) {
        throw new Error("This APKS bundle has an installer index. Open its APKs separately to edit package metadata.");
    }
    for (const [key, data] of replacements) {
        const separator = key.indexOf("\0");
        const scope = separator < 0 ? 0 : Number(key.slice(0, separator));
        const path = key.slice(separator + 1);
        const archive = pkg.parts[scope]?.zip;
        if (!archive?.file(path)) throw new Error("A replaced file was not found in the original archive.");
        archive.file(path, data);
    }
    if (pkg.extension === "ipa") {
        await writeios(pkg.base, pkg.metadata, edits, icon, resizeicon);
        clearsignatures(pkg.base, true);
    } else {
        for (const [index, part] of pkg.parts.entries()) {
            const changes = index === 0 ? edits : Object.fromEntries(["package", "version", "build", "minsdk", "targetsdk"]
                .filter(key => edits[key] !== undefined && part.metadata.fields[key]).map(key => [key, edits[key]]));
            if (index !== 0 && ["package", "build"].some(key => edits[key] !== undefined && !part.metadata.fields[key])) {
                throw new Error("A split APK could not be updated to match the base package.");
            }
            await writeandroid(part.zip, part.metadata, changes, part.metadata.iconpaths?.length ? icon : null, resizeicon);
            clearsignatures(part.zip, false);
            for (const entry of Object.values(part.zip.files)) {
                if (entry.name === "resources.arsc" || /^lib\/[^/]+\/[^/]+\.so$/i.test(entry.name)) {
                    entry.options.compression = "STORE";
                }
            }
            if (part.name) {
                progress("Packing " + part.name);
                pkg.zip.file(part.name, await part.zip.generateAsync({type: "uint8array", ...compression}));
            }
        }
        if (pkg.parts[0].name) await updatebundle(pkg.zip, edits);
    }
    return pkg.zip.generateAsync({type: "blob", ...compression}, state => progress("Exporting " + Math.floor(state.percent) + "%"));
}
