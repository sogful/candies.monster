import {level, artwork, background, picture} from "./data.js";
import {draw, framing} from "./draw.js";

let extras;
let fullart;
let sections;

function highart() {
    fullart ||= Promise.all([
        picture("/assets/images/level/high/objects.webp"),
        fetch("/assets/images/level/high/objects.json").then(response => {if (!response.ok) throw new Error("Sprites unavailable"); return response.json()})
    ]).then(([image, frames]) => ({image, frames, ratio: 1})).catch(() => artwork("normal"));
    return fullart;
}

async function resources(entry) {
    extras ||= fetch("/assets/images/level/high/assets.json").then(response => response.ok ? response.json() : {}).catch(() => ({}));
    const [map, art, high] = await Promise.all([level(entry.file), highart(), extras]);
    const key = entry.background?.match(/\/(box\d+)\.webp$/)?.[1] || "box1";
    const backdrop = high[key] ? await picture(high[key]).catch(() => null) : null;
    if (backdrop && map.height > 480) {
        sections ||= fetch("/assets/static/data/backgrounds.json").then(response => response.json());
        backdrop.section = (await sections)[key];
        if (backdrop.section) backdrop.seam = await picture(high[key].replace(/\.webp$/, "seam.webp")).catch(() => null);
    }
    return {map, art, backdrop: backdrop || await background(entry.background || "/assets/images/level/box1.webp", map)};
}

export async function renderlevel(entry, canvas, size = 2560) {
    const {map, art, backdrop} = await resources(entry);
    const bounds = framing(map);
    const scale = Math.min(size / Math.max(bounds.width, bounds.height), Math.sqrt(12000000 / (bounds.width * bounds.height)));
    draw(canvas, map, art, backdrop, Math.round(bounds.width * scale), Math.round(bounds.height * scale), 1, false, true, 12000000);
    return canvas;
}
