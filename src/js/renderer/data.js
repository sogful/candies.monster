import {source} from "../source.js";

const levels = new Map();
const images = new Map();
const sprites = new Map();

export function number(value, fallback = 0) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

export function enabled(value) {
    return String(value).toLowerCase() === "true" || value === "1";
}

export function picture(url) {
    if (!images.has(url)) {
        images.set(url, new Promise((resolve, reject) => {
            const image = new Image();
            image.decoding = "async";
            image.onload = () => resolve(image);
            image.onerror = () => {images.delete(url); reject(new Error("Image unavailable"))};
            image.src = url;
        }));
        if (images.size > 32) images.delete(images.keys().next().value);
    }
    return images.get(url);
}

export function artwork(reduced = false) {
    const name = reduced ? "objectslow" : "objects";
    if (!sprites.has(name)) {
        sprites.set(name, Promise.all([
            picture("/assets/images/level/" + name + ".webp"),
            fetch("/assets/images/level/objects.json").then(response => {
                if (!response.ok) throw new Error("Sprites unavailable");
                return response.json();
            })
        ]).then(([image, frames]) => ({image, frames, ratio: reduced ? 0.5 : 1})).catch(error => {
            sprites.delete(name);
            throw error;
        }));
    }
    return sprites.get(name);
}

/*//////////////////////////////////////////////////////////////////////*/

export function parse(text) {
    const document = new DOMParser().parseFromString(text, "application/xml");
    if (document.querySelector("parsererror") || document.documentElement.localName !== "map") throw new Error("Invalid level XML");
    const settings = [...document.querySelectorAll("layer")].find(layer => layer.getAttribute("name")?.toLowerCase() === "settings");
    const dimensions = settings?.querySelector("map");
    const design = settings?.querySelector("gameDesign");
    const objects = [];
    for (const layer of document.querySelectorAll("layer")) {
        if (layer === settings || !["objects", ""].includes((layer.getAttribute("name") || "").toLowerCase())) continue;
        for (const node of layer.children) {
            if (!node.hasAttribute("x") || !node.hasAttribute("y")) continue;
            const object = {type: node.localName.toLowerCase()};
            if (object.type === "candyl") object.type = "candyleft";
            if (object.type === "candyr") object.type = "candyright";
            for (const attribute of node.attributes) {
                const name = attribute.name.toLowerCase();
                object[name === "type" ? "variant" : name] = attribute.value;
            }
            object.x = number(object.x);
            object.y = number(object.y);
            object.angle = number(object.angle);
            if (object.type === "star" && /^R[CW]\d+$/.test(object.path || "")) {
                object.x += Math.trunc(number(object.path.slice(2)));
            }
            objects.push(object);
            if (objects.length > 2000) throw new Error("Level object limit exceeded");
        }
    }
    return {
        width: Math.max(1, Math.min(8192, number(dimensions?.getAttribute("width"), 320))),
        height: Math.max(1, Math.min(8192, number(dimensions?.getAttribute("height"), 480))),
        water: number(design?.getAttribute("water")),
        night: enabled(design?.getAttribute("nightLevel")),
        split: enabled(design?.getAttribute("twoParts")),
        mobile: enabled(design?.getAttribute("useMobilePhysics")),
        objects
    };
}

export function level(file) {
    if (!levels.has(file)) {
        levels.set(file, source(file).then(parse).catch(error => {
            levels.delete(file);
            throw error;
        }));
        if (levels.size > 40) levels.delete(levels.keys().next().value);
    }
    return levels.get(file);
}
