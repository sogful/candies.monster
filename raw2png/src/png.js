import {concatenate, dimensions} from "./pixels.js";

const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
const table = new Uint32Array(256);
for (let index = 0; index < 256; index++) {
    let value = index;
    for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ value >>> 1 : value >>> 1;
    table[index] = value;
}

export function ispng(bytes) {
    return signature.every((value, index) => bytes[index] === value);
}

function chunk(type, bytes) {
    const result = new Uint8Array(bytes.length + 12);
    const view = new DataView(result.buffer);
    view.setUint32(0, bytes.length);
    result.set(new TextEncoder().encode(type), 4);
    result.set(bytes, 8);
    let checksum = 0xffffffff;
    for (const value of result.subarray(4, result.length - 4)) checksum = table[(checksum ^ value) & 255] ^ checksum >>> 8;
    view.setUint32(result.length - 4, (checksum ^ 0xffffffff) >>> 0);
    return result;
}

export async function encode({width, height, pixels}) {
    dimensions(width, height);
    const header = new Uint8Array(13);
    const view = new DataView(header.buffer);
    view.setUint32(0, width);
    view.setUint32(4, height);
    header.set([8, 6, 0, 0, 0], 8);
    const scanlines = new Uint8Array((width * 4 + 1) * height);
    for (let row = 0; row < height; row++) scanlines.set(pixels.subarray(row * width * 4, (row + 1) * width * 4), row * (width * 4 + 1) + 1);
    const compressed = new Uint8Array(await new Response(new Blob([scanlines]).stream().pipeThrough(new CompressionStream("deflate"))).arrayBuffer());
    return concatenate([signature, chunk("IHDR", header), chunk("IDAT", compressed), chunk("IEND", new Uint8Array())]);
}
