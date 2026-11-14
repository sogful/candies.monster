function tiled(context, sprite, name, left, top, width, height) {
    const frame = sprite.frames[name];
    if (!frame || width <= 0 || height <= 0) return;
    const [tilewidth, tileheight] = frame.size;
    if (frame.gradient) {
        const gradient = context.createLinearGradient(0, top, 0, top + height);
        frame.gradient.forEach(([red, green, blue, alpha], index) => {
            gradient.addColorStop(index / (frame.gradient.length - 1), "rgba(" + red + "," + green + "," + blue + "," + alpha / 255 + ")");
        });
        context.fillStyle = gradient;
        context.fillRect(left, top, width, height);
        return;
    }
    context.save();
    context.beginPath();
    context.rect(left, top, width, height);
    context.clip();
    for (let y = top; y < top + height; y += tileheight) {
        for (let x = left; x < left + width; x += tilewidth) {
            sprite.region(name, x, y, tilewidth, tileheight);
        }
    }
    context.restore();
}

/*//////////////////////////////////////////////////////////////////////*/

export function water(context, sprite, map, view, front = false) {
    if (map.water <= 0 || !sprite.frames.waterfront) return;
    const left = Math.min(0, view.x);
    const right = Math.max(map.width, view.x + view.width);
    const bottom = Math.max(map.height, view.y + view.height);
    const top = map.height - map.water;
    const width = right - left;
    if (front) {
        tiled(context, sprite, "watershadow", left, top, width, sprite.frames.watershadow.size[1]);
        tiled(context, sprite, "waterfront", left, top, width, sprite.frames.waterfront.size[1]);
    } else {
        tiled(context, sprite, "waterbottom", left, bottom - sprite.frames.waterbottom.size[1], width, sprite.frames.waterbottom.size[1]);
        tiled(context, sprite, "waterback", left, top, width, sprite.frames.waterback.size[1]);
    }
}
