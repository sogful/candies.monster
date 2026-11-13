import {number, enabled} from "./data.js";

export function centered(context, sprite, name, x, y, angle = 0) {
    const frame = sprite.frames[name];
    if (!frame) return;
    const [width, height] = frame.size;
    context.save();
    context.translate(x, y);
    context.rotate(angle * Math.PI / 180);
    sprite.region(name, -Math.floor(width * 1.5) / 3, -Math.floor(height * 1.5) / 3, width, height);
    context.restore();
}

function arm(context, sprite, x, y, length, angle) {
    const frame = sprite.frames.handarm;
    if (!frame || length <= 0) return;
    const [width, height] = frame.size;
    if (width <= 0 || height <= 0) return;
    const top = -Math.floor(height * 1.5) / 3;
    context.save();
    context.translate(x, y);
    context.rotate(angle * Math.PI / 180);
    context.beginPath();
    context.rect(0, top, length, height);
    context.clip();
    for (let offset = 0; offset < length; offset += width) {
        sprite.region("handarm", offset, top, width, height);
    }
    context.restore();
}

function hand(context, sprite, item) {
    const count = Math.max(0, Math.min(12, Math.trunc(number(item.segmentscount))));
    if (!count) return;
    let x = item.x;
    let y = item.y;
    let previous = 0;
    centered(context, sprite, "handbase", x, y);
    for (let index = 1; index <= count; index++) {
        const angle = number(item["segment" + index + "angle"]) % 360;
        const length = Math.max(0, Math.min(1000, number(item["segment" + index + "length"])));
        arm(context, sprite, x, y, Math.trunc(length * 3) / 3, angle);
        centered(context, sprite, enabled(item["segment" + index + "rotatable"]) ? "handjoint" : "handfixed", x, y, previous);
        x += Math.cos(angle * Math.PI / 180) * length;
        y += Math.sin(angle * Math.PI / 180) * length;
        previous = angle;
    }
    sprite("hand", x, y, previous);
}

/*//////////////////////////////////////////////////////////////////////*/

export function compound(context, sprite, item) {
    if (item.type === "pipe") {
        sprite("pipe", item.x, item.y, 0, 0.9);
        sprite("pipeback", item.x, item.y, item.angle, 0.9);
        sprite("pipefront", item.x, item.y, item.angle, 0.9);
        return true;
    }
    if (item.type === "pauseswitcher") {
        centered(context, sprite, "pauseswitcher", item.x, item.y);
        return true;
    }
    if (item.type === "bomb") {
        centered(context, sprite, "bomb", item.x, item.y, item.angle);
        return true;
    }
    if (item.type === "hand") {
        hand(context, sprite, item);
        return true;
    }
    if (item.type === "axe") {
        for (const name of ["axebase", "axe", "axepivot"]) centered(context, sprite, name, item.x, item.y);
        return true;
    }
    if (item.type === "ghost") {
        centered(context, sprite, "ghost", item.x, item.y);
        centered(context, sprite, "ghostface", item.x, item.y);
        return true;
    }
    return false;
}
