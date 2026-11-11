import {painter, object, rope} from "./objects.js";
import {camera, backdrop} from "./camera.js";

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
    load: 22,
    candyleft: 23,
    candyright: 23
};

export function draw(canvas, map, art, background, width, height, density, detail) {
    const scale = Math.min(density, Math.sqrt((detail ? 2400000 : 220000) / Math.max(1, width * height)));
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d", {alpha: false});
    if (!context) return;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.imageSmoothingEnabled = true;
    context.fillStyle = "#b77d35";
    context.fillRect(0, 0, width, height);
    const view = camera(map, width, height);
    context.save();
    context.scale(view.scale, view.scale);
    context.translate(-view.x, -view.y);
    backdrop(context, map, background, view);
    const sprite = painter(context, art);
    const objects = [...map.objects].sort((first, second) => (order[first.type] ?? 16) - (order[second.type] ?? 16));
    for (const item of objects) {
        if (item.type === "grab") rope(context, item, map);
        object(context, sprite, item, map);
    }
    if (map.water > 0) {
        context.fillStyle = "rgba(73,181,234,0.3)";
        context.fillRect(0, map.height - map.water, map.width, map.water);
        context.strokeStyle = "#b1f4ff";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(0, map.height - map.water);
        context.lineTo(map.width, map.height - map.water);
        context.stroke();
    }
    context.restore();
    if (map.night) {
        context.fillStyle = "rgba(5,16,40,0.3)";
        context.fillRect(0, 0, width, height);
    }
    if (detail) {
        context.fillStyle = "rgba(0,0,0,0.5)";
        context.fillRect(0, 0, width, height);
    }
}
