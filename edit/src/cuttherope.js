import {readentry, replacementkey} from "./package.js";
import {decodehints, encodehints} from "./hints.js";

const filesizelimit = 16 * 1024 * 1024;
const levelname = /(?:^|\/)(?:\d+_\d+\.xml|(?:levels?|maps)\/.+\.(?:xml|json))$/i;
const hintname = /(?:^|\/)hints(?:[-_][\w-]+)?\.bin$/i;
const localizable = /(?:^|\/)(?:(?:[\w-]+\/)*(?:strings|gl_wp_strings|translations?|locali[sz]ation)\/.+|(?:[^/]+\.lproj\/)?(?:localizable|(?:menu|game|ui)[-_]?strings|strings(?:[-_][\w-]+)?))\.(?:xml|json|strings|stringsdict|plist|txt|csv)$/i;

export function packageassets(pkg, entries) {
    const gameid = /^(?:com\.zeptolab\.(?:ctr|cuttherope|timetravel)|com\.chillingo\.cuttherope)/i.test(pkg.metadata.package);
    const gamedata = entries.some(entry => hintname.test(entry.path) || /(?:^|\/)hint_p\d+_l\d+_/.test(entry.path))
        && entries.some(entry => levelname.test(entry.path));
    if (!gameid && !gamedata) return [];
    const result = [];
    for (const entry of entries) {
        if (entry.size > filesizelimit || !(pkg.extension === "ipa" || entry.path.startsWith("assets/"))) continue;
        let category;
        if (hintname.test(entry.path)) category = "hints";
        else if (/(?:^|\/)allmaps\.xml$/i.test(entry.path)) category = "levelorder";
        else if (localizable.test(entry.path) && !/(?:^|\/)InfoPlist\.strings$/i.test(entry.path)) category = "stringsgame";
        else if (levelname.test(entry.path) && !/(?:^|\/)(?:!|metadata|resolutions|maplist)/i.test(entry.path)) category = "levels";
        if (category) result.push({...entry, category});
    }
    return result;
}

function binaryhints(item) {
    return item.category === "hints" && /\.bin$/i.test(item.path);
}

function xmllevel(item) {
    return item.category === "levels" && /\.xml$/i.test(item.path);
}

function checktext(item, value) {
    if (/\.json$/i.test(item.path)) {
        try {JSON.parse(value)}
        catch {throw new Error("The file is not valid JSON.")}
        return;
    }
    const plist = /\.(?:plist|stringsdict|strings)$/i.test(item.path) && /^\s*<(?:\?xml|plist|!DOCTYPE)/i.test(value);
    if (!plist && !/\.xml$/i.test(item.path)) return;
    if (/<!ENTITY/i.test(value) || !plist && /<!DOCTYPE/i.test(value)) {
        throw new Error("Remove XML document type and entity definitions.");
    }
    const doc = new DOMParser().parseFromString(value, "text/xml");
    if (doc.querySelector("parsererror")) throw new Error("The file is not valid XML.");
    if (xmllevel(item) && /\d+_\d+\.xml$/i.test(item.path) && doc.documentElement.localName !== "map") {
        throw new Error("A level XML file needs a map element.");
    }
}

/*//////////////////////////////////////////////////////////////////////*/

function decodetext(bytes) {
    const encoding = bytes[0] === 255 && bytes[1] === 254 ? "utf-16le"
        : bytes[0] === 254 && bytes[1] === 255 ? "utf-16be" : "utf-8";
    if (encoding === "utf-8" && bytes.includes(0)) throw new Error("This game file uses an unsupported binary format.");
    let value;
    try {value = new TextDecoder(encoding, {fatal: true}).decode(bytes)}
    catch {throw new Error("This game file uses an unsupported text encoding.")}
    const bom = bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191;
    const newline = /\r\n/.test(value) && !/(?<!\r)\n/.test(value) ? "\r\n" : "\n";
    return {encoding, value, bom, newline};
}

function encodetext(value, {encoding, bom, newline}) {
    if (newline === "\r\n") value = value.replace(/\r?\n/g, newline);
    if (encoding === "utf-8") return new TextEncoder().encode((bom ? "\ufeff" : "") + value);
    const result = new Uint8Array(value.length * 2 + 2);
    const view = new DataView(result.buffer);
    const little = encoding === "utf-16le";
    view.setUint16(0, 0xfeff, little);
    for (let index = 0; index < value.length; index++) view.setUint16(2 + index * 2, value.charCodeAt(index), little);
    return result;
}

export async function assettext(item, replacements) {
    const bytes = replacements.get(replacementkey(item)) ?? await readentry(item.entry, "uint8array", filesizelimit);
    if (binaryhints(item)) return decodehints(bytes);
    const {value, ...format} = decodetext(bytes);
    item.textformat = format;
    return value;
}

export function editasset(item, value) {
    let bytes;
    if (binaryhints(item)) {
        bytes = encodehints(value);
    } else {
        checktext(item, value);
        if (!item.textformat) throw new Error("Open the game file before editing it.");
        bytes = encodetext(value, item.textformat);
    }
    if (bytes.length > filesizelimit) throw new Error("The edited file exceeds 16 MB.");
    return bytes;
}

export async function importasset(item, file) {
    if (file.size > filesizelimit) throw new Error("Choose a game file smaller than 16 MB.");
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (binaryhints(item) && /\.bin$/i.test(file.name)) return decodehints(bytes);
    return decodetext(bytes).value;
}

export function assetoutput(item, value) {
    const name = item.path.split("/").at(-1);
    if (binaryhints(item)) {
        editasset(item, value);
        return {name: name.replace(/\.bin$/i, ".json"), blob: new Blob([value], {type: "application/json"})};
    }
    const bytes = editasset(item, value);
    if (xmllevel(item)) {
        const xml = value.replace(/^(\s*<\?xml\b[^?]*?\bencoding\s*=\s*["'])[^"']+/i, "$1UTF-8");
        return {name, blob: new Blob([xml], {type: "application/xml"})};
    }
    return {name, blob: new Blob([bytes])};
}

export function unitypackage(entries) {
    return entries.some(({path}) =>
        /(?:^|\/)(?:libunity\.so|UnityFramework\.framework\/UnityFramework|UnityPlayer\.dll|Data\/globalgamemanagers|libil2cpp\.so)$/i.test(path)
        || /(?:^|\/)assets\/(?:bin\/Data|aa\/(?:Android|iOS))\//i.test(path));
}

export async function levelcatalog(assets) {
    const order = new Map();
    let rank = 0;
    for (const item of assets.filter(item => item.category === "levelorder")) {
        try {
            const list = new DOMParser().parseFromString(await assettext(item, new Map()), "application/xml");
            const directory = item.path.slice(0, item.path.lastIndexOf("/") + 1);
            for (const element of list.querySelectorAll("filelist > file[short]")) {
                order.set(replacementkey({...item, path: directory + element.getAttribute("short")}), rank++);
            }
        } catch {}
    }
    const levels = assets.filter(item => item.category === "levels" && /\.xml$/i.test(item.path)).map((item, index) => {
        const match = /(?:^|\/)(\d+)_(\d+)\.xml$/i.exec(item.path);
        return {item, index, box: match ? Number(match[1]) : null, level: match ? Number(match[2]) : null};
    }).filter(level => !order.size || level.box !== null || order.has(replacementkey(level.item)));
    levels.sort((a, b) => (order.get(replacementkey(a.item)) ?? Infinity) - (order.get(replacementkey(b.item)) ?? Infinity));
    const boxoffset = Number(levels.some(level => level.box === 0));
    const zerolevel = new Set(levels.filter(level => level.level === 0).map(level => level.box));
    let other = 0;
    for (const entry of levels) {
        if (entry.box === null) {
            entry.numbered = false;
            entry.level = ++other;
        } else {
            entry.numbered = true;
            entry.level += Number(zerolevel.has(entry.box));
            entry.box += boxoffset;
        }
    }
    return levels.sort((a, b) => (a.box ?? Infinity) - (b.box ?? Infinity) || a.level - b.level);
}
