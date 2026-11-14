import {artwork, level, background} from "./data.js";
import {draw} from "./draw.js";

const images = new Map();
let generation = 0;

function key(entry, width, height) {
    return [entry.file, entry.background, Math.round(width), Math.round(height)].join("|");
}

export function cached(entry, width, height) {
    return images.get(key(entry, width, height));
}

export function remember(entry, width, height, source) {
    const name = key(entry, width, height);
    const canvas = document.createElement("canvas");
    canvas.width = source.width;
    canvas.height = source.height;
    canvas.getContext("2d").drawImage(source, 0, 0);
    images.delete(name);
    images.set(name, canvas);
    while (images.size > 48) images.delete(images.keys().next().value);
}

/*//////////////////////////////////////////////////////////////////////*/

export function prefetch(entries, width, height) {
    const current = ++generation;
    const network = navigator.connection;
    if (!width || !height || network?.saveData || /(^|-)2g$/.test(network?.effectiveType || "")) return;
    const idle = callback => window.requestIdleCallback ? requestIdleCallback(callback) : setTimeout(callback, 200);
    const queue = entries.slice();
    async function next() {
        if (current !== generation || document.hidden || document.documentElement.matches(".levelopen,.gameopen,.gameloading,.previewopen")) return;
        const entry = queue.shift();
        if (!entry) return;
        if (!cached(entry, width, height)) {
            try {
                const [map, art] = await Promise.all([level(entry.file), artwork("low")]);
                const backdrop = entry.background ? await background(entry.background, map).catch(() => null) : null;
                if (current !== generation) return;
                const canvas = document.createElement("canvas");
                const pack = Number(entry.background?.match(/\/box(\d+)\.webp$/)?.[1]) || 1;
                draw(canvas, {...map, box: pack}, art, backdrop, width, height, 0.65, false);
                remember(entry, width, height, canvas);
            } catch {}
        }
        idle(next);
    }
    idle(next);
}
