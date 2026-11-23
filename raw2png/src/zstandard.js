import {concatenate} from "./pixels.js";

const maxwindow = 134217728 + 15;

export function iszstd(bytes) {
    return bytes[0] === 0x28 && bytes[1] === 0xb5 && bytes[2] === 0x2f && bytes[3] === 0xfd;
}

function checkframes(bytes, limit) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let offset = 0;
    let declared = 0;
    while (offset < bytes.length) {
        if (offset + 5 > bytes.length) throw new Error("Incomplete Zstandard frame header.");
        const marker = view.getUint32(offset, true);
        if ((marker & 0xfffffff0) === 0x184d2a50) {
            if (offset + 8 > bytes.length) throw new Error("Incomplete Zstandard skippable frame header.");
            offset += 8 + view.getUint32(offset + 4, true);
            if (offset > bytes.length) throw new Error("Incomplete Zstandard skippable frame.");
            continue;
        }
        if (marker !== 0xfd2fb528) throw new Error("Invalid Zstandard frame marker.");
        const descriptor = bytes[offset + 4];
        const single = Boolean(descriptor & 32);
        const window = bytes[offset + 5];
        const sizeflag = descriptor >>> 6;
        const sizebytes = sizeflag ? 2 ** sizeflag : Number(single);
        const dictbytes = [0, 1, 2, 4][descriptor & 3];
        const sizeoffset = offset + 5 + Number(!single) + dictbytes;
        offset = sizeoffset + sizebytes;
        if (offset > bytes.length) throw new Error("Incomplete Zstandard frame header.");
        let size = 0;
        for (let index = offset - 1; index >= sizeoffset; index--) size = size * 256 + bytes[index];
        if (sizebytes === 2) size += 256;
        declared += size;
        if (declared > limit) throw new Error(`Zstandard frames declare more than ${limit} decompressed bytes.`);
        const windowsize = single ? size : 2 ** (10 + (window >>> 3)) * (1 + (window & 7) / 8);
        if (windowsize > maxwindow) throw new Error("Zstandard frame requires more than 128 MB of decoder memory.");

        let last = false;
        while (!last) {
            if (offset + 3 > bytes.length) throw new Error("Incomplete Zstandard block header.");
            const block = bytes[offset] | bytes[offset + 1] << 8 | bytes[offset + 2] << 16;
            last = Boolean(block & 1);
            const type = block >>> 1 & 3;
            if (type === 3) throw new Error("Invalid Zstandard block type.");
            offset += 3 + (type === 1 ? 1 : block >>> 3);
        }
        if (descriptor & 4) offset += 4;
        if (offset > bytes.length) throw new Error("Incomplete Zstandard frame data.");
    }
}

export async function decompress(bytes, limit) {
    checkframes(bytes, limit);
    const {Decompress: decompressor} = await import("/assets/static/dependencies/fzstd.js");
    const parts = [];
    let length = 0;
    const stream = new decompressor(part => {
        length += part.length;
        if (length > limit) throw new Error(`Decompressed data exceeds the ${limit}-byte limit.`);
        parts.push(part.slice());
    });
    try {
        stream.push(bytes, true);
    } catch (error) {
        throw new Error(`Could not decompress Zstandard data: ${error.message || error}`, {cause: error});
    }
    return concatenate(parts);
}
