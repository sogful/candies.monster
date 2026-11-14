import {painter, object} from "./objects.js";
import {rope} from "./rope.js";
import {glow, bulb} from "./lighting.js";
import {grabback, grabmiddle, grabfront, graboverlay} from "./grab.js";
import {camera, backdrop} from "./camera.js";
import {water} from "./water.js";

const order = {
    gravityswitch: 1,
    target: 2,
    ants: 3,
    rotatedcircle: 4,
    transporter: 5,
    conveyorbelt: 5,
    bubble: 6,
    pump: 7,
    spike1: 8,
    spike2: 8,
    spike3: 8,
    spike4: 8,
    electro: 8,
    bouncer1: 9,
    bouncer2: 9,
    pauseswitcher: 8.5,
    pipe: 10,
    hand: 11,
    gap: 12,
    sock: 13,
    steamtube: 14,
    lantern: 15,
    ghost: 16,
    grab: 17,
    lightbulb: 18,
    star: 19,
    rocket: 20,
    candy: 21,
    axe: 21,
    bomb: 21,
    load: 22,
    candyleft: 23,
    candyright: 23
};

export function framing(map) {
    const width = Math.max(map.width, 2560 / 3);
    const height = Math.max(map.height, 480);
    return {width, height, x: (map.width - width) / 2, y: (map.height - height) / 2};
}

/*//////////////////////////////////////////////////////////////////////*/

export function draw(canvas, map, art, background, width, height, density, detail, full = false, budget = 4000000) {
    const scale = Math.min(density, Math.sqrt((full ? budget : detail ? 2400000 : 220000) / Math.max(1, width * height)));
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d", {alpha: false});
    if (!context) return;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.imageSmoothingEnabled = true;
    context.fillStyle = "#b77d35";
    context.fillRect(0, 0, width, height);
    const bounds = full ? framing(map) : null;
    const view = full ? {...bounds, scale: Math.min(width / bounds.width, height / bounds.height)} : camera(map, width, height);
    context.save();
    context.scale(view.scale, view.scale);
    context.translate(-view.x, -view.y);
    backdrop(context, map, background, view, full);
    const sprite = painter(context, art);
    water(context, sprite, map, view);
    const objects = [...map.objects].sort((first, second) => (order[first.type] ?? 16) - (order[second.type] ?? 16));
    const grabs = objects.filter(item => item.type === "grab");
    let hooks = false;
    for (const item of objects) {
        if (item.type === "grab") {
            if (!hooks) {
                for (const grab of grabs) grabback(context, sprite, grab);
                hooks = true;
            }
            grabmiddle(context, sprite, item, map);
            rope(context, item, map, sprite);
            grabfront(context, sprite, item);
            continue;
        }
        if (item.type === "lightbulb") {
            glow(context, sprite, item);
            continue;
        }
        object(context, sprite, item, map);
    }
    water(context, sprite, map, view, true);
    for (const item of objects) if (item.type === "lightbulb") bulb(context, sprite, item);
    for (const item of grabs) graboverlay(context, sprite, item);
    context.restore();
    if (detail && !full) {
        context.fillStyle = "rgba(0,0,0,0.5)";
        context.fillRect(0, 0, width, height);
    }
}
