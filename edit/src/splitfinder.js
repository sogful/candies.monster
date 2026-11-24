import {findsplits} from "./spritesplits.js";
import {previewtexture} from "./sprites.js";

const maxpixels = 4 * 1024 * 1024;
const maxregions = 128;
const mingutter = 2;
const minside = 5;

function occupancy(pixels, width, height) {
    const stride = width + 1;
    const sums = new Uint32Array(stride * (height + 1));
    for (let y = 1; y <= height; y++) {
        let row = 0;
        for (let x = 1; x <= width; x++) {
            row += Number(pixels[((y - 1) * width + x - 1) * 4 + 3] > 0);
            sums[y * stride + x] = row + sums[(y - 1) * stride + x];
        }
    }
    return (x, y, right, bottom) => sums[bottom * stride + right] - sums[y * stride + right]
        - sums[bottom * stride + x] + sums[y * stride + x];
}

function sections(start, end, filled) {
    const result = [];
    let first = start;
    let last = start;
    for (let index = start; index < end; index++) {
        if (!filled(index)) continue;
        if (index - last >= mingutter && last > first) {
            result.push([first, last]);
            first = index;
        } else if (last === start) first = index;
        last = index + 1;
    }
    if (last > first) result.push([first, last]);
    return result;
}

/*//////////////////////////////////////////////////////////////////////*/

export function splitregions(pixels, width, height) {
    if (width * height > maxpixels) return [];
    const count = occupancy(pixels, width, height);
    const total = count(0, 0, width, height);
    if (!total || total === width * height) return [];
    const regions = [];
    const pending = [[0, 0, width, height]];
    while (pending.length) {
        const [x, y, right, bottom] = pending.pop();
        const rows = sections(y, bottom, line => count(x, line, right, line + 1));
        const columns = sections(x, right, line => count(line, y, line + 1, bottom));
        if (!rows.length || !columns.length) continue;
        if (rows.length > 1 || columns.length > 1) {
            if (rows.length >= columns.length) {
                for (const [start, end] of rows) pending.push([x, start, right, end]);
            } else {
                for (const [start, end] of columns) pending.push([start, y, end, bottom]);
            }
            if (pending.length + regions.length > maxregions) return [];
            continue;
        }
        const [left, edge] = columns[0];
        const [top, base] = rows[0];
        if (edge - left >= minside && base - top >= minside) {
            regions.push({x: left, y: top, w: edge - left, h: base - top, inferred: true});
        }
    }
    if (regions.length < 2) return [];
    regions.sort((a, b) => a.y - b.y || a.x - b.x);
    return regions.map((frame, index) => ({...frame, name: "Detected region " + (index + 1)}));
}

export async function findtextureframes(item, entries, replacements, atlasblob) {
    const exact = await findsplits(item, entries, replacements, atlasblob);
    if (exact.length || !/\.(?:png|webp|raw(?:\.zst)?)$/i.test(item.path) || /_alpha\.png$/i.test(item.path)) return exact;
    const bitmap = await createImageBitmap(atlasblob ?? await previewtexture(item, replacements));
    try {
        const {width, height} = bitmap;
        if (width * height > maxpixels) return [];
        const context = new OffscreenCanvas(width, height).getContext("2d", {willReadFrequently: true});
        context.drawImage(bitmap, 0, 0);
        return splitregions(context.getImageData(0, 0, width, height).data, width, height);
    } finally {
        bitmap.close();
    }
}
