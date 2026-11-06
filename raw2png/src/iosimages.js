import {concatenate, dimensions, inflate} from "./pixels.js";

function paeth(left, above, corner) {
    const predicted = left + above - corner;
    const first = Math.abs(predicted - left);
    const second = Math.abs(predicted - above);
    const third = Math.abs(predicted - corner);
    return first <= second && first <= third ? left : second <= third ? above : corner;
}

export function optimized(bytes) {
    return bytes.length > 16 && String.fromCharCode(...bytes.subarray(12, 16)) === "CgBI";
}

export async function decode(bytes) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let width = 0;
    let height = 0;
    let channels = 4;
    let interlace = 0;
    const parts = [];
    for (let offset = 8; offset + 12 <= bytes.length;) {
        const length = view.getUint32(offset);
        const type = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8));
        if (offset + length + 12 > bytes.length) throw new Error("Incomplete PNG chunk.");
        if (type === "IHDR") {
            width = view.getUint32(offset + 8);
            height = view.getUint32(offset + 12);
            channels = bytes[offset + 17] === 2 ? 3 : 4;
            interlace = bytes[offset + 20];
            if (length !== 13 || bytes[offset + 16] !== 8 || ![2, 6].includes(bytes[offset + 17]) || interlace > 1) {
                throw new Error("Unsupported optimized PNG pixel format.");
            }
        } else if (type === "IDAT") {
            parts.push(bytes.subarray(offset + 8, offset + 8 + length));
        }
        offset += length + 12;
    }
    dimensions(width, height);
    const passes = interlace ? [[0, 0, 8, 8], [4, 0, 8, 8], [0, 4, 4, 8], [2, 0, 4, 4], [0, 2, 2, 4], [1, 0, 2, 2], [0, 1, 1, 2]] : [[0, 0, 1, 1]];
    const sizes = passes.map(([left, top, horizontal, vertical]) => [Math.max(0, Math.ceil((width - left) / horizontal)), Math.max(0, Math.ceil((height - top) / vertical))]);
    const expected = sizes.reduce((total, [columns, rows]) => total + (columns ? (columns * channels + 1) * rows : 0), 0);
    const scanlines = await inflate(concatenate(parts), expected, "deflate-raw");
    const pixels = new Uint8Array(width * height * 4);
    let cursor = 0;
    for (let pass = 0; pass < passes.length; pass++) {
        const [left, top, horizontal, vertical] = passes[pass];
        const [columns, rows] = sizes[pass];
        if (!columns || !rows) continue;
        const stride = columns * channels;
        let previous = new Uint8Array(stride);
        for (let row = 0; row < rows; row++) {
            const filter = scanlines[cursor++];
            if (filter > 4) throw new Error("Invalid PNG row filter.");
            const samples = new Uint8Array(stride);
            for (let column = 0; column < stride; column++) {
                const before = column >= channels ? samples[column - channels] : 0;
                const above = previous[column];
                const corner = column >= channels ? previous[column - channels] : 0;
                const prediction = [0, before, above, Math.floor((before + above) / 2), paeth(before, above, corner)][filter];
                samples[column] = scanlines[cursor++] + prediction;
            }
            for (let column = 0; column < columns; column++) {
                const index = ((top + row * vertical) * width + left + column * horizontal) * 4;
                const source = column * channels;
                const alpha = channels === 4 ? samples[source + 3] : 255;
                pixels[index + 3] = alpha;
                for (let channel = 0; channel < 3; channel++) pixels[index + channel] = alpha ? Math.min(255, Math.floor((samples[source + 2 - channel] * 255 + (alpha >>> 1)) / alpha)) : 0;
            }
            previous = samples;
        }
    }
    return {width, height, pixels};
}
