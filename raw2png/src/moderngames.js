import {dimensions, rgba} from "./pixels.js";
import {decompress, iszstd} from "./zstandard.js";

export async function decode(bytes) {
    if (bytes.length < 15) throw new Error("Incomplete compressed texture header.");
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const width = view.getUint16(2, true);
    const height = view.getUint16(4, true);
    const format = bytes[6];
    dimensions(width, height);
    const size = [4, 2, 2, 2, 1][format];
    if (!size) throw new Error(`Unsupported pixel format: ${format}.`);
    const expected = width * height * size;
    const packed = view.getUint32(11, true);
    if (view.getUint32(7, true) !== expected) throw new Error("Texture dimensions and declared pixel size disagree.");
    if (bytes.length < packed + 15) throw new Error("Missing texture parts. Select the folder containing all parts.");
    const payload = bytes.subarray(15, packed + 15);
    if (!iszstd(payload)) throw new Error("The texture header declares Zstandard data, but the compressed payload has no Zstandard frame.");
    return decodepixels(payload, width, height, format, expected);
}

/*//////////////////////////////////////////////////////////////////////*/

export function decodecompact(bytes) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const width = view.getUint16(2, true);
    const height = view.getUint16(4, true);
    dimensions(width, height);
    return decodepixels(bytes.subarray(6), width, height, 0, width * height * 4);
}

async function decodepixels(payload, width, height, format, expected) {
    const pixels = await decompress(payload, expected);
    if (pixels.length !== expected) throw new Error(`Incomplete decompressed texture: expected ${expected} bytes, found ${pixels.length}.`);
    return rgba(pixels, width, height, format);
}
