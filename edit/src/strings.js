const limit = 100000;
const utf8 = new TextDecoder();
const utf16 = new TextDecoder("utf-16le");

function collect() {
    const values = new Set();
    let truncated = false;
    return {
        add(value) {
            if (!value || values.has(value)) return;
            if (values.size === limit) truncated = true;
            else values.add(value);
        },
        result() {return {values: [...values], truncated}}
    };
}

function number(bytes, offset) {
    let value = 0;
    for (let index = 0; index < 5 && offset < bytes.length; index++) {
        const next = bytes[offset++];
        value += (next & 127) * 2 ** (index * 7);
        if (!(next & 128)) return {value, offset};
    }
    throw new Error("The DEX string length is invalid.");
}

function dex(bytes, view, output) {
    if (bytes.length < 112 || view.getUint32(40, true) !== 0x12345678) throw new Error("The DEX header is invalid or unsupported.");
    const count = view.getUint32(56, true);
    const base = view.getUint32(60, true);
    if (base + count * 4 > bytes.length) throw new Error("The DEX string index is incomplete.");
    for (let index = 0; index < count; index++) {
        const entry = number(bytes, view.getUint32(base + index * 4, true));
        if (entry.value > 65536) continue;
        let offset = entry.offset;
        let text = "";
        while (offset < bytes.length && bytes[offset]) {
            const next = bytes[offset++];
            if (next < 128) text += String.fromCharCode(next);
            else {
                const second = bytes[offset++];
                if ((second & 192) !== 128) throw new Error("A DEX string is malformed.");
                if ((next & 224) === 192) text += String.fromCharCode((next & 31) << 6 | second & 63);
                else if ((next & 240) === 224) {
                    const third = bytes[offset++];
                    if ((third & 192) !== 128) throw new Error("A DEX string is malformed.");
                    text += String.fromCharCode((next & 15) << 12 | (second & 63) << 6 | third & 63);
                } else throw new Error("A DEX string uses an unsupported encoding.");
            }
            if (text.length > entry.value) throw new Error("A DEX string exceeds its declared length.");
        }
        if (offset >= bytes.length || text.length !== entry.value) throw new Error("A DEX string is incomplete.");
        output.add(text);
    }
}

/*//////////////////////////////////////////////////////////////////////*/

function pool(bytes, view, start, header, end, output) {
    if (header < 28) return;
    const count = view.getUint32(start + 8, true);
    const small = Boolean(view.getUint32(start + 16, true) & 256);
    const data = start + view.getUint32(start + 20, true);
    if (data > end || start + header + count * 4 > end) throw new Error("The Android string index is incomplete.");
    for (let index = 0; index < count; index++) {
        let offset = data + view.getUint32(start + header + index * 4, true);
        if (offset >= end) throw new Error("An Android string has an invalid offset.");
        let length;
        if (small) {
            offset += bytes[offset] & 128 ? 2 : 1;
            length = bytes[offset++];
            if (length & 128) length = (length & 127) * 256 + bytes[offset++];
        } else {
            if (offset + 2 > end) throw new Error("An Android string is incomplete.");
            length = view.getUint16(offset, true);
            offset += 2;
            if (length & 32768) {
                if (offset + 2 > end) throw new Error("An Android string is incomplete.");
                length = (length & 32767) * 65536 + view.getUint16(offset, true);
                offset += 2;
            }
            length *= 2;
        }
        if (length === undefined || offset + length > end) throw new Error("An Android string is incomplete.");
        output.add((small ? utf8 : utf16).decode(bytes.subarray(offset, offset + length)));
    }
}

function resources(bytes, view, start, end, output, depth = 0) {
    for (let offset = start; offset + 8 <= end;) {
        const type = view.getUint16(offset, true);
        const header = view.getUint16(offset + 2, true);
        const length = view.getUint32(offset + 4, true);
        if (header < 8 || length < header || offset + length > end) throw new Error("The Android resource table is incomplete.");
        if (type === 1) pool(bytes, view, offset, header, offset + length, output);
        if (depth < 3 && (type === 2 || type === 3 || type === 512)) {
            resources(bytes, view, offset + header, offset + length, output, depth + 1);
        }
        offset += length;
    }
}

/*//////////////////////////////////////////////////////////////////////*/

function scan(bytes, output, min, width = 1, position = 0, little = true) {
    let start = position;
    let length = 0;
    for (let offset = position; offset + width <= bytes.length; offset += width) {
        const high = width === 1 ? 0 : bytes[offset + Number(little)];
        const code = width === 1 ? bytes[offset] : bytes[offset + Number(!little)];
        if (!high && (code >= 32 && code <= 126 || code === 9) && length < 8192) {
            length++;
            continue;
        }
        if (length >= min) {
            const decoder = width === 1 ? utf8 : new TextDecoder(little ? "utf-16le" : "utf-16be");
            output.add(decoder.decode(bytes.subarray(start, offset)));
        }
        start = offset + width;
        length = 0;
    }
    if (length >= min) {
        const decoder = width === 1 ? utf8 : new TextDecoder(little ? "utf-16le" : "utf-16be");
        output.add(decoder.decode(bytes.subarray(start, start + length * width)));
    }
}

export function extractstrings(input, name, minimum = 4) {
    const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const output = collect();
    const add = {add: value => {if (value.length >= minimum) output.add(value)}};
    if (bytes.length >= 8 && utf8.decode(bytes.subarray(0, 4)) === "dex\n") {
        dex(bytes, view, add);
        return {...output.result(), format: "DEX string table"};
    }
    if (bytes.length >= 8 && /(?:resources\.arsc|\.xml)$/i.test(name) &&
        [2, 3].includes(view.getUint16(0, true))) {
        resources(bytes, view, 0, bytes.length, add);
        return {...output.result(), format: "Android string pool"};
    }
    if (/\.(?:txt|xml|json|strings|stringsdict|plist|csv|ini|properties|md|map|sym|cfg)$/i.test(name) &&
        (bytes[0] === 255 && bytes[1] === 254 || bytes[0] === 254 && bytes[1] === 255
        || !bytes.subarray(0, 8192).includes(0) && !name.endsWith(".arsc"))) {
        const encoding = bytes[0] === 255 && bytes[1] === 254 ? "utf-16le"
            : bytes[0] === 254 && bytes[1] === 255 ? "utf-16be" : "utf-8";
        for (const line of new TextDecoder(encoding).decode(bytes).split(/\r?\n/)) add.add(line);
        return {...output.result(), format: encoding.toUpperCase() + " text"};
    }
    scan(bytes, output, minimum);
    for (const position of [0, 1]) for (const little of [true, false]) scan(bytes, output, minimum, 2, position, little);
    return {...output.result(), format: "ASCII and UTF-16 strings"};
}
