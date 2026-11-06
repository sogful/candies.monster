export function dimensions(width, height) {
    if (!width || !height || width > 16384 || height > 16384 || width * height > 33554432) {
        throw new Error("Invalid or oversized texture dimensions.");
    }
}

export function rgba(payload, width, height, format) {
    dimensions(width, height);
    const sizes = [4, 2, 2, 2, 1];
    const size = sizes[format];
    if (!size) throw new Error(`Unsupported pixel format: ${format}.`);
    const expected = width * height * size;
    if (payload.length < expected) throw new Error(`Incomplete texture: expected ${expected} pixel bytes, found ${payload.length}.`);
    const pixels = new Uint8Array(width * height * 4);
    const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
    if (format === 0) pixels.set(payload.subarray(0, expected));
    for (let pixel = 0; pixel < width * height; pixel++) {
        const index = pixel * 4;
        if (format === 4) {
            pixels[index] = 255;
            pixels[index + 1] = 255;
            pixels[index + 2] = 255;
            pixels[index + 3] = payload[pixel];
        } else if (format !== 0) {
            const value = view.getUint16(pixel * 2, true);
            if (format === 1) {
                pixels[index] = Math.round((value >>> 11) * 255 / 31);
                pixels[index + 1] = Math.round((value >>> 5 & 63) * 255 / 63);
                pixels[index + 2] = Math.round((value & 31) * 255 / 31);
                pixels[index + 3] = 255;
            } else if (format === 2) {
                pixels[index] = (value >>> 12) * 17;
                pixels[index + 1] = (value >>> 8 & 15) * 17;
                pixels[index + 2] = (value >>> 4 & 15) * 17;
                pixels[index + 3] = (value & 15) * 17;
            } else {
                pixels[index] = Math.round((value >>> 11) * 255 / 31);
                pixels[index + 1] = Math.round((value >>> 6 & 31) * 255 / 31);
                pixels[index + 2] = Math.round((value >>> 1 & 31) * 255 / 31);
                pixels[index + 3] = (value & 1) * 255;
            }
        }
        if (format !== 1 && format !== 4) {
            const alpha = pixels[index + 3];
            for (let channel = 0; channel < 3; channel++) {
                pixels[index + channel] = alpha ? Math.min(255, Math.floor((pixels[index + channel] * 255 + (alpha >>> 1)) / alpha)) : 0;
            }
        }
    }
    return {width, height, pixels};
}

/*//////////////////////////////////////////////////////////////////////*/

export function concatenate(parts) {
    const result = new Uint8Array(parts.reduce((length, part) => length + part.length, 0));
    let offset = 0;
    for (const part of parts) {
        result.set(part, offset);
        offset += part.length;
    }
    return result;
}

export async function inflate(payload, expected, format = "deflate") {
    const reader = new Blob([payload]).stream().pipeThrough(new DecompressionStream(format)).getReader();
    const parts = [];
    let length = 0;
    try {
        while (true) {
            const {done, value} = await reader.read();
            if (done) break;
            length += value.length;
            if (length > expected) throw new Error("Decompressed data exceeds the texture size.");
            parts.push(value);
        }
    } finally {
        await reader.cancel();
    }
    if (length !== expected) throw new Error(`Incomplete decompressed texture: expected ${expected} bytes, found ${length}.`);
    return concatenate(parts);
}
