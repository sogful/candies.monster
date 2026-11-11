import {number, enabled} from "./data.js";
import {centered} from "./compound.js";

function moving(item) {
    const path = (item.path || "").trim();
    if (!path || path.length > 4096) return false;
    if (/^R[CW][+-]?\d+$/.test(path)) return true;
    const coordinates = path.replace(/,$/, "").split(",");
    return coordinates.length >= 2 && coordinates.length <= 198 && coordinates.length % 2 === 0 && coordinates.every(value => value.trim() !== "" && Number.isFinite(Number(value)));
}

function rail(item) {
    return number(item.movelength) > 0 && !moving(item);
}

function chain(item) {
    return item.breakable !== undefined && !["true", "1"].includes(String(item.breakable).toLowerCase());
}

function circle(context, item) {
    const radius = Math.max(0, Math.min(8192, number(item.radius)));
    if (!radius) return;
    let count = Math.floor(Math.max(16, radius * 3) / 2);
    count += count % 2;
    count = Math.min(1024, count);
    const step = Math.PI * 2 / count;
    context.save();
    context.strokeStyle = "#3380e6";
    context.lineWidth = 5 / 3;
    context.lineCap = "butt";
    context.beginPath();
    for (let index = 0; index < count; index += 2) {
        context.moveTo(item.x + radius * Math.cos(index * step), item.y + radius * Math.sin(index * step));
        context.lineTo(item.x + radius * Math.cos((index + 1) * step), item.y + radius * Math.sin((index + 1) * step));
    }
    context.stroke();
    context.restore();
}

function track(context, sprite, item) {
    const left = sprite.frames.railleft;
    const middle = sprite.frames.railmiddle;
    const right = sprite.frames.railright;
    if (!left || !middle || !right) return;
    const length = Math.max(0, Math.min(2000, number(item.movelength)));
    const width = Math.trunc(length * 3 + 142) / 3;
    const offset = Math.max(-8192, Math.min(8192, number(item.moveoffset)));
    const height = Math.max(left.size[1], middle.size[1], right.size[1]);
    const top = -Math.floor(height * 1.5) / 3;
    const start = -74 / 3 - offset;
    const first = start + left.size[0];
    const last = start + width - right.size[0];
    context.save();
    context.translate(item.x, item.y);
    if (enabled(item.movevertical)) context.rotate(Math.PI / 2);
    sprite.region("railleft", start, top + (height - left.size[1]) / 2, ...left.size);
    sprite.region("railright", last, top + (height - right.size[1]) / 2, ...right.size);
    context.beginPath();
    context.rect(first, top, last - first, height);
    context.clip();
    for (let x = first; x < last; x += middle.size[0]) {
        sprite.region("railmiddle", x, top + (height - middle.size[1]) / 2, ...middle.size);
    }
    context.restore();
}

/*//////////////////////////////////////////////////////////////////////*/

export function grabback(context, sprite, item) {
    if (enabled(item.invisible) || enabled(item.gun)) return;
    if (rail(item)) track(context, sprite, item);
    else if (enabled(item.kickable)) sprite(enabled(item.kicked) ? "stickerdetachedback" : "stickerback", item.x, item.y);
    else if (number(item.radius) !== -1) sprite(chain(item) ? "chainautomaticback" : "automatic", item.x, item.y);
    else sprite(chain(item) ? "chainback" : "grab", item.x, item.y);
    if (number(item.radius) !== -1) circle(context, item);
}

export function grabmiddle(context, sprite, item, map) {
    if (enabled(item.invisible)) return;
    if (enabled(item.gun)) {
        sprite("gunback", item.x, item.y, item.angle);
        const candies = map.objects.filter(value => value.type === "candy" || value.type === "candyleft" || value.type === "candyright");
        const target = map.split ? candies.find(value => value.type === (item.part === "L" ? "candyleft" : "candyright")) || candies[0] : candies[0];
        const rotation = target ? Math.atan2(item.y - target.y, item.x - target.x) * 180 / Math.PI : 0;
        sprite("gunarrow", item.x, item.y, rotation + item.angle);
    } else if (enabled(item.wheel)) centered(context, sprite, "wheel", item.x, item.y, item.angle);
}

export function grabfront(context, sprite, item) {
    if (enabled(item.invisible)) return;
    if (enabled(item.gun)) sprite("gunfront", item.x, item.y, item.angle);
    if (rail(item)) centered(context, sprite, "railgrab", item.x, item.y, item.angle + (enabled(item.movevertical) ? 90 : 0));
    else if (!enabled(item.gun)) {
        if (enabled(item.kickable)) sprite(enabled(item.kicked) ? "stickerdetachedfront" : "stickerfront", item.x, item.y, item.angle);
        else if (number(item.radius) !== -1) centered(context, sprite, chain(item) ? "chainautomaticfront" : "automaticfront", item.x, item.y, item.angle);
        else centered(context, sprite, chain(item) ? "chainfront" : "grabfront", item.x, item.y, item.angle);
    }
    if (enabled(item.wheel) && !enabled(item.gun)) {
        centered(context, sprite, "wheelarm", item.x, item.y, item.angle);
        centered(context, sprite, "wheelindicator", item.x, item.y, item.angle);
    }
    if (moving(item)) {
        context.save();
        context.translate(item.x, item.y);
        context.rotate(item.angle * Math.PI / 180);
        sprite("bee", -5.5 * 0.77 / 3, -58.5 * 0.77 / 3, 0, 0.77);
        sprite("beewings", -5.5 * 0.77 / 3, -58.5 * 0.77 / 3, 0, 0.77);
        context.restore();
    }
}

export function graboverlay(context, sprite, item) {
    if (enabled(item.spider)) sprite("spider", item.x, item.y);
}
