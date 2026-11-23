import {concatenate, dimensions} from "./pixels.js";
import {ispng, encode as png} from "./png.js";
import {compress, decompress, iszstd} from "./zstandard.js";

export function join(parts) {
    if (!parts.length) throw new Error("No texture files selected.");
    return concatenate(parts);
}

export async function decode(bytes) {
    if (iszstd(bytes)) bytes = await decompress(bytes, 134217728 + 15);
    if (ispng(bytes)) {
        const ios = await import("./iosimages.js");
        return ios.optimized(bytes) ? png(await ios.decode(bytes)) : bytes;
    }
    if (bytes.length < 7) throw new Error("Incomplete texture header.");
    const magic = bytes[0] | bytes[1] << 8;
    if (magic === 0 && iszstd(bytes.subarray(6))) {
        const {decodecompact} = await import("./moderngames.js");
        return png(await decodecompact(bytes));
    }
    let decoder;
    if (magic === 0x07bc || magic === 0x07bd) decoder = await import("./oldgames.js");
    else if (magic === 0x08bd) decoder = await import("./moderngames.js");
    else throw new Error(`Unrecognized texture format: header 0x${magic.toString(16).padStart(4, "0")}. Expected a ZeptoLab RAW texture or PNG.`);
    return png(await decoder.decode(bytes));
}

/*//////////////////////////////////////////////////////////////////////*/

async function imagepixels(bytes) {
    const ios = await import("./iosimages.js");
    let image;
    if (ios.optimized(bytes)) {
        image = await ios.decode(bytes);
    } else {
        const bitmap = await createImageBitmap(new Blob([bytes], {type: "image/png"}), {premultiplyAlpha: "none", colorSpaceConversion: "none"});
        try {
            dimensions(bitmap.width, bitmap.height);
            const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
            const context = canvas.getContext("2d", {willReadFrequently: true});
            context.drawImage(bitmap, 0, 0);
            image = {width: bitmap.width, height: bitmap.height, pixels: context.getImageData(0, 0, bitmap.width, bitmap.height).data};
        } finally {
            bitmap.close();
        }
    }
    return image;
}

function packpixels({width, height, pixels}, format) {
    const size = [4, 2, 2, 2, 1][format];
    if (!size) throw new Error("Unsupported RAW pixel format.");
    const payload = new Uint8Array(width * height * size);
    const view = new DataView(payload.buffer);
    const scale = (value, max) => Math.round(value * max / 255);
    for (let pixel = 0; pixel < width * height; pixel++) {
        const index = pixel * 4;
        const alpha = pixels[index + 3];
        const opacity = format === 2 ? scale(alpha, 15) * 17 : format === 3 ? scale(alpha, 1) * 255 : alpha;
        const channel = offset => Math.round(pixels[index + offset] * opacity / 255);
        if (format === 0) {
            payload[index] = channel(0);
            payload[index + 1] = channel(1);
            payload[index + 2] = channel(2);
            payload[index + 3] = alpha;
        } else if (format === 1) {
            view.setUint16(pixel * 2, scale(pixels[index], 31) << 11 | scale(pixels[index + 1], 63) << 5 | scale(pixels[index + 2], 31), true);
        } else if (format === 2) {
            view.setUint16(pixel * 2, scale(channel(0), 15) << 12 | scale(channel(1), 15) << 8 | scale(channel(2), 15) << 4 | scale(alpha, 15), true);
        } else if (format === 3) {
            view.setUint16(pixel * 2, scale(channel(0), 31) << 11 | scale(channel(1), 31) << 6 | scale(channel(2), 31) << 1 | scale(alpha, 1), true);
        } else {
            payload[pixel] = alpha;
        }
    }
    return payload;
}

async function writeraw(image, magic, format) {
    const {width, height} = image;
    const payload = packpixels(image, format);
    let packed = payload;
    if (magic === 0 || magic === 0x08bd) packed = await compress(payload);
    if (magic === 0x07bd) {
        packed = new Uint8Array(await new Response(new Blob([payload]).stream().pipeThrough(new CompressionStream("deflate"))).arrayBuffer());
    }
    const header = new Uint8Array(magic === 0 ? 6 : magic === 0x07bc ? 7 : 15);
    const view = new DataView(header.buffer);
    view.setUint16(0, magic, true);
    view.setUint16(2, width, true);
    view.setUint16(4, height, true);
    if (header.length > 6) header[6] = format;
    if (header.length === 15) {
        view.setUint32(7, payload.length, true);
        view.setUint32(11, packed.length, true);
    }
    return concatenate([header, packed]);
}

export async function encode(bytes) {
    return writeraw(await imagepixels(bytes), 0x07bd, 0);
}

export async function encodelike(bytes, original) {
    const wrapped = iszstd(original);
    const source = wrapped ? await decompress(original, 134217728 + 15) : original;
    if (source.length < 7) throw new Error("Incomplete texture header.");
    const magic = source[0] | source[1] << 8;
    if (![0x07bc, 0x07bd, 0x08bd].includes(magic) && !(magic === 0 && iszstd(source.subarray(6)))) {
        throw new Error("Unrecognized RAW texture format.");
    }
    const result = await writeraw(await imagepixels(bytes), magic, magic === 0 ? 0 : source[6]);
    return wrapped ? compress(result) : result;
}
