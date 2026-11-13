import {number} from "./data.js";

export function glow(context, sprite, item) {
    const frame = sprite.frames.light;
    if (!frame) return;
    const size = Math.max(0, Math.min(8192, number(item.litradius))) * 3;
    if (!size) return;
    const scale = size / frame.size[0];
    context.save();
    context.globalCompositeOperation = "lighter";
    context.globalAlpha = 0.36;
    sprite.region("light", item.x - Math.floor(frame.size[0] * 1.5) / 3 * scale, item.y - Math.floor(frame.size[1] * 1.5) / 3 * scale, size, frame.size[1] * scale);
    context.restore();
}

export function bulb(context, sprite, item) {
    sprite("lightbulb", item.x, item.y);
    sprite("bulbcap", item.x, item.y);
    const frame = sprite.frames.firefly;
    if (frame) sprite.region("firefly", item.x - Math.floor(frame.size[0] * 1.5) / 3, item.y - Math.floor(frame.size[1] * 1.5) / 3, ...frame.size);
}

/*//////////////////////////////////////////////////////////////////////*/

export function star(context, sprite, item, map) {
    if (number(item.timeout) > 0) sprite("starclock", item.x, item.y);
    if (!map.night) {
        sprite("starglow", item.x, item.y);
        sprite("star", item.x, item.y);
        return;
    }
    context.save();
    context.globalAlpha = 0.3;
    sprite("nightglow", item.x, item.y);
    context.globalAlpha = 0.9;
    sprite("star", item.x, item.y);
    context.globalAlpha = 0.1;
    const frame = sprite.frames.nightstar;
    if (frame) sprite.region("nightstar", item.x - Math.floor(frame.size[0] * 1.5) / 3, item.y - Math.floor(frame.size[1] * 1.5) / 3, ...frame.size);
    context.restore();
}
