const header = new TextEncoder().encode("bplist00");
const utf8 = new TextDecoder("utf-8", {fatal: true});
const utf16 = new TextDecoder("utf-16be", {fatal: true});

function sized(kind, count) {
    if (count < 15) return Uint8Array.of(kind << 4 | count);
    const width = intwidth(count);
    const bytes = new Uint8Array(width + 2);
    bytes.set([kind << 4 | 15, 0x10 | Math.log2(width)]);
    putint(bytes, 2, width, count);
    return bytes;
}

function intwidth(value) {
    if (value < 0x100) return 1;
    if (value < 0x10000) return 2;
    if (value <= 0xffffffff) return 4;
    return 8;
}

function putint(bytes, offset, width, value) {
    for (let i = offset + width - 1; i >= offset; i--) {
        bytes[i] = value % 256;
        value = Math.floor(value / 256);
    }
}

function getint(bytes, offset, width) {
    if (offset < 0 || width < 1 || width > 8 || offset + width > bytes.length) {
        throw new Error("Invalid binary plist integer range.");
    }
    let result = 0;
    for (let i = offset; i < offset + width; i++) result = result * 256 + bytes[i];
    if (!Number.isSafeInteger(result)) throw new Error("Binary plist integer exceeds the safe range.");
    return result;
}

function readsize(bytes) {
    const length = bytes[0] & 15;
    if (length < 15) return {start: 1, length};
    if (bytes[1] >> 4 !== 1) throw new Error("Invalid binary plist object length.");
    const width = 2 ** (bytes[1] & 15);
    return {start: 2 + width, length: getint(bytes, 2, width)};
}

function withbytes(prefix, length) {
    const bytes = new Uint8Array(prefix.length + length);
    bytes.set(prefix);
    return bytes;
}

function storestring(string) {
    if (/^[\x00-\x7f]*$/.test(string)) {
        const prefix = sized(5, string.length);
        const bytes = withbytes(prefix, string.length);
        bytes.set(new TextEncoder().encode(string), prefix.length);
        return bytes;
    }
    const prefix = sized(6, string.length);
    const bytes = withbytes(prefix, string.length * 2);
    const view = new DataView(bytes.buffer);
    for (let i = 0; i < string.length; i++) view.setUint16(prefix.length + i * 2, string.charCodeAt(i));
    return bytes;
}

function loadobjects(bytes) {
    if (bytes.length < 41 || header.some((byte, i) => bytes[i] !== byte)) {
        throw new Error("Invalid binary plist header.");
    }
    const trailer = bytes.length - 32;
    const width = bytes[trailer + 6];
    const references = bytes[trailer + 7];
    const count = getint(bytes, trailer + 8, 8);
    const root = getint(bytes, trailer + 16, 8);
    const table = getint(bytes, trailer + 24, 8);
    if (width < 1 || width > 8 || references < 1 || references > 8 ||
        !count || count > 100000 || root >= count || table < header.length || table + count * width > trailer) {
        throw new Error("Invalid binary plist offset table.");
    }
    const offsets = Array.from({length: count}, (_, id) => getint(bytes, table + width * id, width));
    const sorted = offsets.slice().sort((left, right) => left - right);
    const ends = new Map();
    for (let i = 0; i < count; i++) {
        const end = sorted[i + 1] ?? table;
        if (sorted[i] < header.length || sorted[i] >= end || end > table) {
            throw new Error("Invalid binary plist object offset.");
        }
        ends.set(sorted[i], end);
    }
    const records = offsets.map(offset => {
        const raw = bytes.subarray(offset, ends.get(offset));
        const kind = raw[0] >> 4;
        if (![10, 11, 12, 13].includes(kind)) return {kind, raw};
        const {start, length} = readsize(raw);
        const total = kind === 13 ? 2 * length : length;
        if (start + total * references > raw.length) throw new Error("Truncated binary plist object references.");
        const links = Array.from({length: total}, (_, i) => getint(raw, start + i * references, references));
        if (links.some(id => id >= count)) throw new Error("Invalid binary plist object reference.");
        return {kind, length, links};
    });
    return {records, root};
}

function writetable(records, root) {
    const pending = [root];
    const ids = new Map();
    while (pending.length) {
        const id = pending.pop();
        if (ids.has(id)) continue;
        ids.set(id, ids.size);
        for (const link of records[id].links || []) pending.push(link);
    }
    records = Array.from(ids.keys(), id => {
        const record = records[id];
        return record.links ? {...record, links: record.links.map(link => ids.get(link))} : record;
    });
    root = 0;
    const references = intwidth(records.length - 1);
    const objects = records.map(({kind, raw, length, links}) => {
        if (raw) return raw;
        const prefix = sized(kind, length);
        const bytes = withbytes(prefix, links.length * references);
        links.forEach((reference, i) => putint(bytes, prefix.length + i * references, references, reference));
        return bytes;
    });
    const table = objects.reduce((sum, bytes) => sum + bytes.length, header.length);
    const width = intwidth(table);
    const trailer = table + width * objects.length;
    const output = new Uint8Array(trailer + 32);
    output.set(header);
    let offset = header.length;
    objects.forEach((object, id) => {
        output.set(object, offset);
        putint(output, table + width * id, width, offset);
        offset += object.length;
    });
    output.set([width, references], trailer + 6);
    putint(output, trailer + 8, 8, objects.length);
    putint(output, trailer + 16, 8, root);
    putint(output, trailer + 24, 8, table);
    return output;
}

function recordtext(record) {
    const {kind, raw} = record;
    if (kind === 1) {
        const width = 2 ** (raw[0] & 15);
        return String(getint(raw, 1, width));
    }
    if (![5, 6, 7].includes(kind)) return "";
    const {start, length} = readsize(raw);
    const size = kind === 6 ? length * 2 : length;
    if (start + size > raw.length) throw new Error("Truncated binary plist string.");
    return (kind === 6 ? utf16 : utf8).decode(raw.subarray(start, start + size));
}

function binaryplist(bytes) {
    const {records, root} = loadobjects(bytes);
    if (records[root].kind !== 13) throw new Error("Expected a plist dictionary.");

    function search(table, id, key) {
        const record = table[id];
        if (record?.kind !== 13) return -1;
        return record.links.slice(0, record.length).findIndex(link => recordtext(table[link]) === key);
    }

    function value(path, list = false) {
        let id = root;
        for (const key of path) {
            const index = search(records, id, key);
            if (index < 0) return list ? [] : "";
            id = records[id].links[records[id].length + index];
        }
        const record = records[id];
        if (!list) return recordtext(record);
        return record.kind === 10 ? record.links.map(link => recordtext(records[link])).filter(Boolean) : [];
    }

    function update(changes) {
        const table = records.slice();
        let top = root;
        const append = record => table.push(record) - 1;
        const appendstring = text => {
            const raw = storestring(text);
            return append({kind: raw[0] >> 4, raw});
        };
        function replace(id, path, text) {
            if (!path.length) return appendstring(text);
            const record = table[id];
            if (record.kind !== 13) throw new Error("Expected a plist dictionary.");
            const [key, ...tail] = path;
            const index = search(table, id, key);
            const keys = record.links.slice(0, record.length);
            const values = record.links.slice(record.length);
            if (index < 0) {
                if (text === undefined) return id;
                if (tail.length) throw new Error("Plist dictionary is missing.");
                keys.push(appendstring(key));
                values.push(appendstring(text));
            } else if (text === undefined && !tail.length) {
                keys.splice(index, 1);
                values.splice(index, 1);
            } else {
                values[index] = replace(values[index], tail, text);
            }
            return append({kind: 13, length: keys.length, links: [...keys, ...values]});
        }
        for (const {path, text} of changes) top = replace(top, path, text);
        return writetable(table, top);
    }
    return {value, update};
}

/*//////////////////////////////////////////////////////////////////////*/

export function plisttext(bytes) {
    if (bytes[0] === 0xff && bytes[1] === 0xfe || bytes[1] === 0) {
        return new TextDecoder("utf-16le", {fatal: true}).decode(bytes);
    }
    if (bytes[0] === 0xfe && bytes[1] === 0xff || bytes[0] === 0) return utf16.decode(bytes);
    return utf8.decode(bytes);
}

function xmlplist(bytes) {
    const text = plisttext(bytes);
    if (/<!ENTITY|<!DOCTYPE[^>]*\[/i.test(text)) throw new Error("Unsupported plist document type.");
    const document = new DOMParser().parseFromString(text, "application/xml");
    const root = document.documentElement;
    if (root.localName !== "plist" || root.firstElementChild?.localName !== "dict" || root.children.length !== 1) {
        throw new Error("Expected a plist dictionary.");
    }
    const dict = root.firstElementChild;

    function entry(parent, name) {
        if (parent?.localName !== "dict") return null;
        return Array.from(parent.children).find(node => node.localName === "key" && node.textContent === name);
    }

    function get(path) {
        return path.reduce((parent, key) => entry(parent, key)?.nextElementSibling, dict);
    }

    function value(path, list = false) {
        const node = get(path);
        if (!list) return ["string", "integer", "real"].includes(node?.localName) ? node.textContent : "";
        return node?.localName === "array" ? Array.from(node.children)
            .filter(item => item.localName === "string").map(item => item.textContent) : [];
    }

    function update(changes) {
        for (const {path, text} of changes) {
            const parent = get(path.slice(0, -1));
            if (parent?.localName !== "dict") {
                if (text === undefined) continue;
                throw new Error("Plist dictionary is missing.");
            }
            const name = path.at(-1);
            const key = entry(parent, name);
            if (text === undefined) {
                key?.nextElementSibling?.remove();
                key?.remove();
                continue;
            }
            const value = document.createElement("string");
            value.textContent = text;
            if (key?.nextElementSibling) {
                key.nextElementSibling.replaceWith(value);
            } else {
                const added = document.createElement("key");
                added.textContent = name;
                parent.append(added, value);
            }
        }
        const serialized = new XMLSerializer().serializeToString(document).replace(/^<\?xml\b[^?]*\?>\s*/i, "");
        return '<?xml version="1.0" encoding="UTF-8"?>\n' + serialized;
    }
    return {value, update};
}

export function openplist(bytes) {
    if (bytes.length > 8 * 1024 * 1024) throw new Error("The plist is larger than 8 MB.");
    return header.every((byte, i) => bytes[i] === byte) ? binaryplist(bytes) : xmlplist(bytes);
}
