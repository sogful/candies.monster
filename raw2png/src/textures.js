import {concatenate, dimensions} from "./pixels.js";
import {ispng, encode as png} from "./png.js";

export function join(parts) {
    if (!parts.length) throw new Error("No texture files selected.");
    return concatenate(parts);
}

export async function decode(bytes) {
    if (ispng(bytes)) {
        const ios = await import("./iosimages.js");
        return ios.optimized(bytes) ? png(await ios.decode(bytes)) : bytes;
    }
    if (bytes.length < 7) throw new Error("Incomplete texture header.");
    const magic = bytes[0] | bytes[1] << 8;
    let decoder;
    if (magic === 0x07bc || magic === 0x07bd) decoder = await import("./oldgames.js");
    else if (magic === 0x08bd) decoder = await import("./moderngames.js");
    else throw new Error("Unrecognized texture format.");
    return png(await decoder.decode(bytes));
}

/*//////////////////////////////////////////////////////////////////////*/

export async function encode(bytes) {
    const ios = await import("./iosimages.js");
    let image;
    if (ios.optimized(bytes)) {
        image = await ios.decode(bytes);
    } else {
        const bitmap = await createImageBitmap(new Blob([bytes], {type: "image/png"}), {premultiplyAlpha: "none", colorSpaceConversion: "none"});
        dimensions(bitmap.width, bitmap.height);
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const context = canvas.getContext("2d", {willReadFrequently: true});
        context.drawImage(bitmap, 0, 0);
        image = {width: bitmap.width, height: bitmap.height, pixels: context.getImageData(0, 0, bitmap.width, bitmap.height).data};
        bitmap.close();
    }
    const {width, height, pixels} = image;
    const payload = new Uint8Array(pixels.length);
    for (let index = 0; index < pixels.length; index += 4) {
        const alpha = pixels[index + 3];
        for (let channel = 0; channel < 3; channel++) payload[index + channel] = Math.floor((pixels[index + channel] * alpha + 127) / 255);
        payload[index + 3] = alpha;
    }
    const packed = new Uint8Array(await new Response(new Blob([payload]).stream().pipeThrough(new CompressionStream("deflate"))).arrayBuffer());
    const result = new Uint8Array(packed.length + 15);
    const view = new DataView(result.buffer);
    view.setUint16(0, 0x07bd, true);
    view.setUint16(2, width, true);
    view.setUint16(4, height, true);
    view.setUint32(7, payload.length, true);
    view.setUint32(11, packed.length, true);
    result.set(packed, 15);
    return result;
}
