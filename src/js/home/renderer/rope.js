import {number, enabled} from "./data.js";

function matches(first, second) {
    return first != null && second != null && String(first).trim().toLowerCase() === String(second).trim().toLowerCase();
}

function endpoint(item, map) {
    const candies = map.objects.filter(object => ["candy", "candyleft", "candyright"].includes(object.type));
    const primary = candies[0];
    const fallback = map.split ? candies.find(object => object.type === (item.part === "L" ? "candyleft" : "candyright")) || primary : primary;
    let target;
    if (enabled(item.bindbulb)) {
        target = map.objects.find(object => object.type === "lightbulb" && matches(object.bulbnumber ?? "", item.bulbnumber ?? ""));
    } else {
        const bomb = item.bombnumber ?? (enabled(item.bombed) ? item.candynumber : null);
        const axe = item.axenumber ?? (enabled(item.axed) ? item.candynumber : null);
        if (enabled(item.bombed)) target = map.objects.find(object => object.type === "bomb" && matches(object.bombnumber ?? "", bomb));
        target ||= map.objects.find(object => object.type === "axe" && matches(object.axenumber ?? "", axe));
        target ||= candies.find(object => matches(object.candynumber, item.candynumber));
    }
    target ||= fallback;
    if (target === primary && map.objects.some(object => object.type === "lantern" && enabled(object.candycaptured))) return null;
    return target;
}

/*//////////////////////////////////////////////////////////////////////*/

function geometry(item, target, map) {
    const rest = map.mobile ? 30 : 35;
    const length = Math.max(0, Math.trunc(number(item.length)));
    const segments = Math.min(256, Math.ceil(length / rest) + 1);
    const divisor = Math.floor(length / rest + 2);
    const ratio = segments / divisor;
    const dx = target.x - item.x;
    const dy = target.y - item.y;
    return {
        rest,
        segments,
        distance: Math.hypot(dx, dy),
        angle: Math.atan2(dy, dx),
        step: Math.hypot(dx, dy) / divisor,
        position: amount => ratio * amount + (1 - ratio) * amount ** segments
    };
}

function color(channels, alpha = 1) {
    return "rgba(" + channels.map(value => Math.max(0, Math.min(255, Math.round(value * 255)))).join(",") + "," + alpha + ")";
}

function bungee(context, item, shape, map) {
    if (shape.segments < 2 || shape.distance === 0) return;
    const samples = shape.segments * (map.mobile ? 3 : 4);
    const palettes = [[0.6755555555555556, 0.44, 0.27555555555555555], [0.475, 0.305, 0.185]];
    const shades = palettes.map((palette, index) => palette.map(value => value * (index ? 0.4 : 0.45)));
    if (shape.step > shape.rest + (map.mobile ? 7 : 7 / 3)) {
        for (const shade of shades) shade[0] *= shape.step / shape.rest * 2;
    }
    context.save();
    context.translate(item.x, item.y);
    context.rotate(shape.angle);
    for (let index = 0; index < samples; index += 3) {
        const stripe = Math.floor(index / 3) % 2;
        const shade = shades[stripe].map((value, channel) => value + (palettes[stripe][channel] - value) * index / (samples - 1));
        const bright = shade.map(value => value + 0.15);
        const gradient = context.createLinearGradient(0, -5 / 3, 0, 5 / 3);
        gradient.addColorStop(0, color(bright, 0));
        gradient.addColorStop(0.1, color(bright));
        gradient.addColorStop(0.5, color(shade));
        gradient.addColorStop(0.9, color(bright));
        gradient.addColorStop(1, color(bright, 0));
        const start = shape.position(index / samples) * shape.distance;
        const end = shape.position(Math.min(samples, index + 3) / samples) * shape.distance;
        context.fillStyle = gradient;
        context.fillRect(start, -5 / 3, end - start, 10 / 3);
    }
    context.restore();
}

function chain(sprite, item, shape) {
    const samples = shape.segments * 2;
    const angle = shape.angle * 180 / Math.PI - 90;
    const cosine = Math.cos(shape.angle);
    const sine = Math.sin(shape.angle);
    for (let index = 0; index < samples; index++) {
        const distance = shape.position(index / samples) * shape.distance;
        sprite("chainpoint", item.x + cosine * distance, item.y + sine * distance, index ? angle : 0);
    }
    for (let index = 0; index < samples - 1; index++) {
        const distance = (shape.position(index / samples) + shape.position((index + 1) / samples)) * shape.distance / 2;
        sprite("chainmiddle", item.x + cosine * distance, item.y + sine * distance, angle);
    }
}

/*//////////////////////////////////////////////////////////////////////*/

export function rope(context, item, map, sprite) {
    if (enabled(item.invisible) || enabled(item.gun)) return;
    const radius = number(item.radius);
    if (radius !== -1) return;
    const target = endpoint(item, map);
    if (!target) return;
    const shape = geometry(item, target, map);
    if (item.breakable != null && !enabled(item.breakable) && sprite) chain(sprite, item, shape);
    else bungee(context, item, shape, map);
}
