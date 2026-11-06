import {dimensions, concatenate, rgba} from "./pixels.js";

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
    const {Decompress: decompressor} = await import("./dependencies/fzstd.js");
    const parts = [];
    let length = 0;
    const stream = new decompressor(part => {
        length += part.length;
        if (length > expected) throw new Error("Decompressed data exceeds the texture size.");
        parts.push(part.slice());
    });
    stream.push(bytes.subarray(15, packed + 15), true);
    if (length !== expected) throw new Error("Incomplete decompressed texture.");
    return rgba(concatenate(parts), width, height, format);
}
