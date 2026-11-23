const androidns = "http://schemas.android.com/apk/res/android";
const none = 0xffffffff;
const decoder = new TextDecoder();
const encoder = new TextEncoder();
const bitmaptypes = new Map([["png", "image/png"], ["webp", "image/webp"], ["jpg", "image/jpeg"], ["jpeg", "image/jpeg"]]);

function view(bytes) {
    return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function merge(parts) {
    const output = new Uint8Array(parts.reduce((size, part) => size + part.length, 0));
    let offset = 0;
    for (const part of parts) {
        output.set(part, offset);
        offset += part.length;
    }
    return output;
}

function chunk(data, offset, end) {
    if (offset + 8 > end) throw new Error("Incomplete Android resource chunk.");
    const type = data.getUint16(offset, true);
    const header = data.getUint16(offset + 2, true);
    const size = data.getUint32(offset + 4, true);
    if (header < 8 || size < header || offset + size > end) throw new Error("Invalid Android resource chunk size.");
    return {type, header, size, offset};
}

function children(data, parent) {
    const children = [];
    const end = parent.offset + parent.size;
    for (let offset = parent.offset + parent.header; offset < end;) {
        const item = chunk(data, offset, end);
        children.push(item);
        offset += item.size;
    }
    return children;
}

/*//////////////////////////////////////////////////////////////////////*/

function stringpool(bytes) {
    const data = view(bytes);
    const header = data.getUint16(2, true);
    const count = data.getUint32(8, true);
    const styles = data.getUint32(12, true);
    const flags = data.getUint32(16, true);
    const start = data.getUint32(20, true);
    const stylestart = data.getUint32(24, true);
    const utf8 = Boolean(flags & 0x100);
    const end = stylestart || bytes.length;
    if (header < 28 || header + (count + styles) * 4 > start || start > end || end > bytes.length) {
        throw new Error("Invalid Android string pool.");
    }
    const original = new Map();
    const additions = new Map();
    function get(index) {
        if (index === none || index >= count) return "";
        if (original.has(index)) return original.get(index);
        let offset = start + data.getUint32(header + index * 4, true);
        if (offset >= end) throw new Error("Android string offset exceeds its pool.");
        let length;
        if (utf8) {
            offset += bytes[offset] & 0x80 ? 2 : 1;
            length = bytes[offset++];
            if (length & 0x80) length = ((length & 0x7f) << 8) | bytes[offset++];
        } else {
            length = data.getUint16(offset, true);
            offset += 2;
            if (length & 0x8000) {
                length = (length & 0x7fff) * 65536 + data.getUint16(offset, true);
                offset += 2;
            }
            length *= 2;
        }
        if (offset + length > end) throw new Error("Android string exceeds its pool.");
        const text = (utf8 ? decoder : new TextDecoder("utf-16le")).decode(bytes.subarray(offset, offset + length));
        original.set(index, text);
        return text;
    }

    function add(value) {
        if (!additions.has(value)) additions.set(value, count + additions.size);
        return additions.get(value);
    }

    function write() {
        if (!additions.size) return bytes;
        const parts = [bytes.subarray(start, end)];
        const offsets = [];
        let size = end - start;
        for (const text of additions.keys()) {
            let encoded;
            if (utf8) {
                const characters = encoder.encode(text);
                if (text.length > 0x7fff || characters.length > 0x7fff) throw new Error("Android string is too long.");
                const length = value => value < 128 ? [value] : [0x80 | value >> 8, value & 255];
                encoded = merge([Uint8Array.from([...length(text.length), ...length(characters.length)]), characters, Uint8Array.of(0)]);
            } else {
                encoded = new Uint8Array(4 + text.length * 2);
                const encodeddata = view(encoded);
                if (text.length > 0x7fff) throw new Error("Android string is too long.");
                encodeddata.setUint16(0, text.length, true);
                for (let i = 0; i < text.length; i++) encodeddata.setUint16(2 + i * 2, text.charCodeAt(i), true);
            }
            offsets.push(size);
            size += encoded.length;
            parts.push(encoded);
        }
        parts.push(new Uint8Array((4 - (size % 4)) % 4));
        const newindexes = new Uint8Array(offsets.length * 4);
        offsets.forEach((offset, index) => view(newindexes).setUint32(index * 4, offset, true));
        const prefix = merge([
            bytes.subarray(0, header + count * 4),
            newindexes,
            bytes.subarray(header + count * 4, start)
        ]);
        const strings = merge(parts);
        const result = merge([prefix, strings, bytes.subarray(end)]);
        const output = view(result);
        output.setUint32(4, result.length, true);
        output.setUint32(8, count + additions.size, true);
        output.setUint32(16, flags & ~1, true);
        output.setUint32(20, prefix.length, true);
        if (stylestart) output.setUint32(24, prefix.length + strings.length, true);
        return result;
    }

    return {get, add, write};
}

function buildcontainer(bytes, root, items) {
    const result = merge([bytes.subarray(0, root.header), ...items]);
    view(result).setUint32(4, result.length, true);
    return result;
}

/*//////////////////////////////////////////////////////////////////////*/

function manifest(bytes) {
    const data = view(bytes);
    const root = chunk(data, 0, bytes.length);
    if (root.type !== 3) throw new Error("AndroidManifest.xml is not compiled Android XML.");
    const items = children(data, root).map(item => ({...item, bytes: bytes.slice(item.offset, item.offset + item.size)}));
    const poolitem = items.find(item => item.type === 1);
    if (!poolitem) throw new Error("AndroidManifest.xml has no string pool.");
    const pool = stringpool(poolitem.bytes);
    const elements = [];
    const stack = [];
    for (const item of items) {
        const data = view(item.bytes);
        if (item.type === 0x103) {
            stack.pop();
            continue;
        }
        if (item.type !== 0x102) continue;
        const ext = item.header;
        if (item.size < ext + 20) throw new Error("Incomplete Android XML element.");
        const start = ext + data.getUint16(ext + 8, true);
        const size = data.getUint16(ext + 10, true);
        const count = data.getUint16(ext + 12, true);
        if (size < 20 || start < ext + 20 || start + size * count > item.size) throw new Error("Invalid Android XML attribute table.");
        const parent = stack.at(-1);
        const element = {name: pool.get(data.getUint32(ext + 4, true)), parent, children: [], attrs: []};
        for (let index = 0; index < count; index++) {
            const offset = start + index * size;
            const namespace = pool.get(data.getUint32(offset, true));
            const name = pool.get(data.getUint32(offset + 4, true));
            const raw = pool.get(data.getUint32(offset + 8, true));
            const type = data.getUint8(offset + 15);
            const value = data.getUint32(offset + 16, true);
            const text = type === 3 ? pool.get(value) : raw;
            element.attrs.push({namespace, name, text, type, value, data, offset});
        }
        parent?.children.push(element);
        stack.push(element);
        elements.push(element);
    }
    function write() {
        poolitem.bytes = pool.write();
        return buildcontainer(bytes, root, items.map(item => item.bytes));
    }
    return {elements, pool, write};
}

function attribute(element, name, namespace = androidns) {
    return element?.attrs.find(item => item.name === name && item.namespace === namespace);
}

function settext(pool, attr, text) {
    const index = pool.add(text);
    attr.data.setUint32(attr.offset + 8, index, true);
    attr.data.setUint8(attr.offset + 15, 3);
    attr.data.setUint32(attr.offset + 16, index, true);
}

function setnumber(attr, value, positive = true) {
    if (!/^\d+$/.test(String(value)) || Number(value) < Number(positive) || Number(value) > 0x7fffffff) {
        throw new Error("Enter a valid Android build or SDK number.");
    }
    attr.data.setUint32(attr.offset + 8, none, true);
    attr.data.setUint8(attr.offset + 15, 0x10);
    attr.data.setUint32(attr.offset + 16, Number(value), true);
}

function textvalue(attr, table) {
    if (!attr) return "";
    if (attr.type === 1) return table?.strings(attr.value)[0]?.path || "";
    if (attr.type === 0x10 || attr.type === 0x11) return String(attr.value);
    return attr.text;
}

/*//////////////////////////////////////////////////////////////////////*/

function resources(bytes) {
    const data = view(bytes);
    const root = chunk(data, 0, bytes.length);
    if (root.type !== 2) throw new Error("resources.arsc is not an Android resource table.");
    const items = children(data, root);
    const poolitem = items.find(item => item.type === 1);
    if (!poolitem) throw new Error("Android resource table has no global string pool.");
    const pool = stringpool(bytes.subarray(poolitem.offset, poolitem.offset + poolitem.size));
    const packages = items.filter(item => item.type === 0x200 && item.header >= 284).map(item => ({
        ...item,
        id: data.getUint32(item.offset + 8, true),
        typeoffset: item.header >= 288 ? data.getUint32(item.offset + 284, true) : 0,
        types: children(data, item).filter(child => child.type === 0x201 && child.header >= 24)
    }));

    function strings(id, seen = new Set(), depth = 0) {
        if (seen.has(id) || depth > 12 || seen.size >= 1024) return [];
        seen.add(id);
        const packageid = id >>> 24;
        const typeid = id >>> 16 & 255;
        const entryid = id & 65535;
        const results = [];
        for (const group of packages.filter(group => group.id === packageid)) {
            for (const type of group.types) {
                const base = type.offset;
                if (data.getUint8(base + 8) + group.typeoffset !== typeid) continue;
                const flags = data.getUint8(base + 9);
                const count = data.getUint32(base + 12, true);
                const entries = data.getUint32(base + 16, true);
                const start = base + type.header;
                const limit = base + type.size;
                if (entries > type.size || entries < type.header + count * ((flags & 1) || !(flags & 2) ? 4 : 2)) continue;
                let offset;
                if (flags & 1) {
                    let low = 0;
                    let high = count;
                    while (low < high) {
                        const middle = (low + high) >>> 1;
                        const index = data.getUint16(start + middle * 4, true);
                        if (index < entryid) low = middle + 1;
                        else high = middle;
                    }
                    if (low < count && data.getUint16(start + low * 4, true) === entryid) {
                        offset = data.getUint16(start + low * 4 + 2, true) * 4;
                    }
                } else if (entryid < count && flags & 2) {
                    const small = data.getUint16(start + entryid * 2, true);
                    if (small !== 65535) offset = small * 4;
                } else if (entryid < count) {
                    offset = data.getUint32(start + entryid * 4, true);
                }
                const entry = base + entries + offset;
                if (offset === undefined || offset === none || entry + 8 > limit) continue;
                const mode = data.getUint16(entry + 2, true);
                if (mode & 1) continue;
                const compact = Boolean(mode & 8);
                const value = compact ? entry : entry + data.getUint16(entry, true);
                if (value + 8 > limit || value < entry) continue;
                const datatype = compact ? mode >>> 8 : data.getUint8(value + 3);
                const index = data.getUint32(value + 4, true);
                const language = type.header >= 34 ? data.getUint16(base + 28, true) : 0;
                const density = type.header >= 36 ? data.getUint16(base + 34, true) : 0;
                if (datatype === 3) results.push({path: pool.get(index), offset: value + 4, language, density});
                if (datatype === 1) results.push(...strings(index, seen, depth + 1));
            }
        }
        return results.sort((one, two) => Number(Boolean(one.language)) - Number(Boolean(two.language)));
    }

    function rename(from, to) {
        for (const group of packages) {
            const start = group.offset + 12;
            const name = new TextDecoder("utf-16le").decode(bytes.subarray(start, start + 256)).split("\0")[0];
            if (name !== from) continue;
            bytes.fill(0, start, start + 256);
            for (let index = 0; index < to.length; index++) data.setUint16(start + index * 2, to.charCodeAt(index), true);
        }
    }

    function redirect(item, path) {
        data.setUint32(item.offset, pool.add(path), true);
    }

    function write() {
        return buildcontainer(bytes, root, items.map(item =>
            item === poolitem ? pool.write() : bytes.subarray(item.offset, item.offset + item.size)
        ));
    }
    return {strings, rename, redirect, write};
}

/*//////////////////////////////////////////////////////////////////////*/

function launchers(xml) {
    return xml.elements.filter(element => ["activity", "activity-alias"].includes(element.name)
        && element.parent?.name === "application"
        && element.children.some(child => child.name === "intent-filter"
            && child.children.some(action => action.name === "action" && attribute(action, "name")?.text === "android.intent.action.MAIN")
            && child.children.some(category => category.name === "category" &&
                ["android.intent.category.LAUNCHER", "android.intent.category.LEANBACK_LAUNCHER"].includes(attribute(category, "name")?.text))));
}

function launcherids(app, launch, shared) {
    const ids = new Set(shared);
    for (const element of [app, ...launch]) {
        for (const name of ["icon", "roundIcon"]) {
            const attr = attribute(element, name);
            if (attr?.type === 1) ids.add(attr.value);
        }
    }
    return [...ids];
}

function launchericons(zip, table, ids) {
    const paths = new Map();
    for (const id of ids) {
        for (const entry of table?.strings(id) || []) {
            if (!entry.path.startsWith("res/") || !zip.file(entry.path)) continue;
            const extension = entry.path.split(".").at(-1).toLowerCase();
            if (!bitmaptypes.has(extension) && extension !== "xml") continue;
            if (!paths.has(entry.path)) paths.set(entry.path, []);
            paths.get(entry.path).push(entry);
        }
    }
    return paths;
}

function prefericon(paths) {
    return [...paths].filter(([path]) => bitmaptypes.has(path.split(".").at(-1).toLowerCase())).sort(
        (left, right) => (right[1][0].density || 160) - (left[1][0].density || 160)
    )[0]?.[0] || "";
}

export async function readandroid(zip, sharedicons = []) {
    const manifestfile = zip.file("AndroidManifest.xml");
    if (!manifestfile) throw new Error("This APK has no AndroidManifest.xml.");
    if (manifestfile._data?.uncompressedSize > 16 * 1024 * 1024) throw new Error("The Android manifest exceeds 16 MB.");
    const xml = manifest(await manifestfile.async("uint8array"));
    const root = xml.elements.find(element => !element.parent && element.name === "manifest");
    if (!root) throw new Error("The Android package manifest is missing its root element.");
    const resourcefile = zip.file("resources.arsc");
    let table;
    try {
        if (resourcefile && (resourcefile._data?.uncompressedSize || 0) <= 128 * 1024 * 1024) {
            table = resources(await resourcefile.async("uint8array"));
        }
    } catch {
        // Some split APKs carry an incomplete table. Their manifest fields can still be read.
    }
    const app = root.children.find(element => element.name === "application");
    const sdk = root.children.find(element => element.name === "uses-sdk");
    const launch = launchers(xml);
    const attrs = {
        package: attribute(root, "package", ""),
        title: attribute(app, "label"),
        version: attribute(root, "versionName"),
        build: attribute(root, "versionCode"),
        minsdk: attribute(sdk, "minSdkVersion"),
        targetsdk: attribute(sdk, "targetSdkVersion")
    };
    const entries = Object.fromEntries(Object.entries(attrs).map(([key, attr]) => [key, textvalue(attr, table)]));
    if (!entries.package) throw new Error("The Android manifest does not identify a package.");
    const iconids = launcherids(app, launch, sharedicons);
    const icons = launchericons(zip, table, iconids);
    return {
        ...entries,
        split: attribute(root, "split", "")?.text || "",
        fields: Object.fromEntries(Object.entries(attrs).map(([key, attr]) => [key, Boolean(attr)])),
        iconids,
        iconpaths: [...icons.keys()],
        iconpath: prefericon(icons),
        internal: {xml, table, attrs, launch, icons}
    };
}

/*//////////////////////////////////////////////////////////////////////*/

const components = new Set(["application", "activity", "activity-alias", "service", "receiver", "provider", "instrumentation"]);
const ownpermissions = new Set(["permission", "permission-group", "permission-tree", "uses-permission", "uses-permission-sdk-23", "uses-permission-sdk-m"]);
const classattrs = new Set(["backupAgent", "appComponentFactory", "manageSpaceActivity", "parentActivityName", "targetActivity", "zygotePreloadName"]);
const packageattrs = new Set(["permission", "readPermission", "writePermission", "permissionGroup", "taskAffinity", "process", "targetPackage"]);

function renamepackage(xml, old, name) {
    for (const element of xml.elements) {
        for (const attr of element.attrs) {
            const original = attr.text;
            if (attr.namespace !== androidns || attr.type !== 3 || !original) continue;
            if ((components.has(element.name) && attr.name === "name") || classattrs.has(attr.name)) {
                if (original.startsWith(".")) settext(xml.pool, attr, old + original);
                else if (!original.includes(".")) settext(xml.pool, attr, old + "." + original);
            } else if (element.name === "provider" && attr.name === "authorities") {
                const changed = original.split(";").map(authority => authority === old || authority.startsWith(old + ".")
                    ? name + authority.slice(old.length) : authority).join(";");
                if (changed !== original) settext(xml.pool, attr, changed);
            } else if (packageattrs.has(attr.name) || ownpermissions.has(element.name) && attr.name === "name") {
                if (original === old || original.startsWith(old + ".")) settext(xml.pool, attr, name + original.slice(old.length));
            }
        }
    }
}

async function replaceicons(zip, table, entries, icon, resizeicon) {
    const conversions = new Map();
    for (const [path, references] of entries) {
        const extension = path.split(".").at(-1).toLowerCase();
        const redirect = extension === "xml" || path.endsWith(".9.png");
        const mime = redirect ? "image/png" : bitmaptypes.get(extension);
        let width;
        let height;
        if (!redirect) {
            try {
                const binary = await zip.file(path).async("uint8array");
                const image = await createImageBitmap(new Blob([binary], {type: mime}));
                width = image.width;
                height = image.height;
                image.close();
            } catch {
                // A bitmap may use an Android-only PNG encoding.
            }
        }
        const density = references[0].density;
        const fallback = density > 0 && density < 1000 ? Math.round(48 * density / 160) : 192;
        width ||= fallback;
        height ||= fallback;
        if (width > 1024 || height > 1024) throw new Error("The Android launcher icon exceeds 1024 pixels.");
        const key = [mime, width, height].join(":");
        if (!conversions.has(key)) conversions.set(key, await resizeicon(icon, width, height, mime));
        const binary = conversions.get(key);
        if (binary.type && binary.type !== mime) throw new Error("The browser could not create the required Android icon format.");
        let output = path;
        if (redirect) {
            output = path.replace(/(?:\.9)?\.[^/.]+$/, "_edited.png");
            while (zip.file(output)) output = output.replace(/\.png$/, "_icon.png");
            for (const reference of references) table.redirect(reference, output);
        }
        zip.file(output, await binary.arrayBuffer());
    }
}

export async function writeandroid(zip, metadata, edits, icon, resizeicon) {
    const {xml, table, attrs, launch, icons} = metadata.internal;
    const changes = Object.entries(edits || {}).filter(([key, value]) => value !== undefined && String(value) !== String(metadata[key]));
    if (!changes.length && !icon) return;
    for (const [key, value] of changes) {
        if (!Object.hasOwn(attrs, key) || !attrs[key]) throw new Error("This APK does not have an editable " + key + " field.");
        const text = String(value);
        if (key === "package") {
            if (text.length > 127 || !/^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+$/.test(text)) {
                throw new Error("Enter a valid Android package name with at least two segments.");
            }
            renamepackage(xml, metadata.package, text);
            table?.rename(metadata.package, text);
            settext(xml.pool, attrs.package, text);
        } else if (key === "build" || key === "minsdk" || key === "targetsdk") {
            setnumber(attrs[key], text, key !== "build");
        } else {
            if (!text.trim() || text.includes("\0")) throw new Error("Enter a value for " + key + ".");
            settext(xml.pool, attrs[key], text);
            if (key === "title") {
                for (const element of launch) {
                    const label = attribute(element, "label");
                    if (label) settext(xml.pool, label, text);
                }
            }
        }
    }
    if (icon) {
        if (!icons.size || !resizeicon) throw new Error("This APK does not contain a supported launcher icon resource.");
        await replaceicons(zip, table, icons, icon, resizeicon);
    }
    if (changes.length) zip.file("AndroidManifest.xml", xml.write());
    if (table && (icon || changes.some(([key]) => key === "package"))) {
        zip.file("resources.arsc", table.write(), {compression: "STORE"});
    }
}
