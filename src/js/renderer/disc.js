import {number, enabled} from "./data.js";

export function disc(context, sprite, item) {
    const size = Math.max(1, number(item.size, 80));
    const scale = size / 167;
    const sticker = Math.max(scale, 0.4);
    const handle = Math.max(scale, 0.75);
    const highlight = sprite.frames.dischighlight;
    if (!highlight) return;
    sprite("disc", item.x, item.y, 0, scale);
    const width = highlight.size[0] * scale;
    const height = highlight.size[1] * scale;
    sprite.region("dischighlight", item.x - width, item.y, width, height);
    sprite.region("dischighlight", item.x, item.y, width, height, true);
    context.save();
    context.translate(item.x, item.y);
    context.rotate(number(item.handleangle) * Math.PI / 180);
    const mark = sprite.frames.discsticker.size;
    sprite.region("discsticker", 1 / 3 - mark[0] * sticker, -mark[1] * sticker / 2, mark[0] * sticker, mark[1] * sticker);
    sprite.region("discsticker", -1 / 3, -mark[1] * sticker / 2, mark[0] * sticker, mark[1] * sticker, true);
    const offset = width - (67.5 - 0.09 * size) / 3 + (1 - handle) * sprite.frames.dischandle.size[0] / 2;
    if (!enabled(item.onehandle)) sprite("dischandle", -offset, 0, 90, handle);
    sprite("dischandle", offset, 0, -90, handle);
    context.restore();
    sprite("disccenter", item.x, item.y, 0, (1 + sticker) / 2);
}
