import {dimensions, inflate, rgba} from "./pixels.js";

export async function decode(bytes) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const width = view.getUint16(2, true);
    const height = view.getUint16(4, true);
    const format = bytes[6];
    dimensions(width, height);
    const size = [4, 2, 2, 2, 1][format];
    if (!size) throw new Error(`Unsupported pixel format: ${format}.`);
    const expected = width * height * size;
    let payload;
    if (view.getUint16(0, true) === 0x07bd) {
        if (bytes.length < 15) throw new Error("Incomplete compressed texture header.");
        const unpacked = view.getUint32(7, true);
        const packed = view.getUint32(11, true);
        if (unpacked !== expected) throw new Error("Texture dimensions and declared pixel size disagree.");
        if (bytes.length < packed + 15) throw new Error("Missing texture parts. Select the folder containing .raw, .raw1, .raw2 and later parts.");
        payload = await inflate(bytes.subarray(15, packed + 15), expected);
    } else {
        payload = bytes.subarray(7);
        if (payload.length < expected) throw new Error("Missing texture parts. Select the folder containing .raw, .raw1, .raw2 and later parts.");
        if (payload.length > expected + 1) throw new Error("Unexpected bytes after the texture pixels.");
    }
    return rgba(payload, width, height, format);
}
