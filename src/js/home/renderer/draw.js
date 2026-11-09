import {painter, object, rope} from "./objects.js";

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
    if (background) {
        const zoom = Math.max(width / background.width, height / background.height);
        context.drawImage(background, (width - background.width * zoom) / 2, (height - background.height * zoom) / 2, background.width * zoom, background.height * zoom);
    }
    const fit = detail ? Math.min(width / map.width, height / map.height) : Math.max(width / map.width, height / map.height);
    context.save();
    context.translate((width - map.width * fit) / 2, (height - map.height * fit) / 2);
    context.scale(fit, fit);
    const sprite = painter(context, art);
    for (const item of map.objects) if (["rotatedcircle", "transporter", "conveyorbelt"].includes(item.type)) object(context, sprite, item, map);
    for (const item of map.objects) if (item.type === "grab") rope(context, item, map);
    for (const item of map.objects) if (!["rotatedcircle", "transporter", "conveyorbelt"].includes(item.type)) object(context, sprite, item, map);
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
        context.fillStyle = "rgba(0,0,0,0.25)";
        context.fillRect(0, 0, width, height);
    }
}
