import {number} from "./data.js";

export function conveyor(context, sprite, item) {
    const length = Math.max(20, Math.min(2000, number(item.length, 100)));
    const width = Math.max(10, Math.min(400, number(item.width, 20)));
    const cap = 6;
    const edge = 67 / 3;
    const endheight = 79 / 3;
    const region = sprite.region;
    context.save();
    context.translate(item.x, item.y);
    context.rotate(-item.angle * Math.PI / 180);
    context.translate(length / 2, 0);
    context.rotate(Math.PI / 2);
    region("beltmiddle", -(width - 10 / 3) / 2, -length / 2, width - 10 / 3, length);
    region("beltend", -width * 0.3, length / 2 + cap - endheight, width * 0.6, endheight);
    region("beltend", -width * 0.3, -length / 2 - cap, width * 0.6, endheight);
    region("beltside", -width / 2, -length / 2 + cap, edge, length - cap * 2, true);
    region("beltside", width / 2 - edge, -length / 2 + cap, edge, length - cap * 2);
    region("beltcorner", width / 2 - edge, length / 2 + cap - endheight, edge, endheight);
    region("beltcorner", -width / 2, length / 2 + cap - endheight, edge, endheight, true);
    region("beltcorner", -width / 2, -length / 2 - cap, edge, endheight, true, true);
    region("beltcorner", width / 2 - edge, -length / 2 - cap, edge, endheight, false, true);
    for (let offset = 0; offset < length; offset += 21) {
        const height = Math.min(21, length - offset);
        region("belt", -width * 0.4, -length / 2 + offset, width * 0.8, height);
    }
    region("belthighlight", -width * 0.4, length / 2 - 8, width * 0.8, 8);
    region("belthighlight", -width * 0.4, -length / 2, width * 0.8, 8, false, true);
    context.restore();
}
