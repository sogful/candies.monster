import {number, enabled} from "./data.js";
import {conveyor} from "./conveyor.js";
import {compound} from "./compound.js";
import {star} from "./lighting.js";
import {disc} from "./disc.js";

const characters = [
    "targetoriginalflash", "targethalloween", "targetxmas",
    "targetsuperpowers", "targetviking", "targetpainter",
    "targetpirate", "targetpharaon", "targetcaesar",
    "targetprehistoric", "targetdisco", "targetsherif",
    "targetemperor", "targetinventor", "targetcyborg"
];

/*//////////////////////////////////////////////////////////////////////*/

export function painter(context, art) {
    function sprite(name, x, y, angle = 0, scale = 1) {
        const frame = art.frames[name];
        if (!frame) return;
        context.save();
        context.translate(x, y);
        context.rotate(angle * Math.PI / 180);
        context.scale(scale, scale);
        context.drawImage(art.image, ...frame.rect.map(value => value * art.ratio), ...frame.offset, ...frame.size);
        context.restore();
    }
    sprite.region = (name, x, y, width, height, horizontal = false, vertical = false) => {
        const frame = art.frames[name];
        if (!frame) return;
        context.save();
        context.translate(x + (horizontal ? width : 0), y + (vertical ? height : 0));
        context.scale(horizontal ? -1 : 1, vertical ? -1 : 1);
        context.drawImage(art.image, ...frame.rect.map(value => value * art.ratio), 0, 0, width, height);
        context.restore();
    };
    sprite.frames = art.frames;
    return sprite;
}

/*//////////////////////////////////////////////////////////////////////*/

export function object(context, sprite, item, map) {
    if (compound(context, sprite, item)) return;
    const {type, x, y, angle} = item;
    if (type === "star") {
        star(context, sprite, item, map);
        return;
    }
    if (type === "bubble") {
        sprite("bubblebody", x, y);
        sprite("bubble", x, y);
        return;
    }
    if (type === "sock") {
        sprite(Math.max(0, Math.trunc(number(item.group))) % 2 ? "sockgreen" : "sock", x, y, angle + 90, 0.7);
        return;
    }
    if (type === "candy") {
        if (map.objects.some(value => value.type === "lantern" && enabled(value.candycaptured))) return;
        for (const name of ["candybase", "candy", "candytop"]) sprite(name, x, y, angle, 0.71);
        if (enabled(item.isdriven)) {
            sprite("candywings", x, y, angle, 0.8);
            sprite("candywingroot", x, y, angle, 0.8);
        }
        return;
    }
    if (type.startsWith("spike")) {
        const size = Math.max(1, Math.min(4, Math.round(number(item.size, number(type.slice(-1), 1)))));
        sprite((item.toggled && item.toggled !== "false" ? "rotatespike" : "spike") + ["one", "two", "three", "four"][size - 1], x, y, angle);
        const button = ["one", "two"][Math.floor(number(item.toggled)) - 1];
        if (button) sprite("spikebutton" + button, x, y, angle);
        return;
    }
    if (type === "target") {
        const names = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen"];
        sprite("support" + (names[(map.box || 1) - 1] || "one"), x, y);
        sprite(characters[number(item.targettype) - 2] || "target", x, y);
        return;
    }
    if (type === "rotatedcircle") {
        disc(context, sprite, item);
        return;
    }
    if (type === "transporter" || type === "conveyorbelt") {
        conveyor(context, sprite, item);
        return;
    }
    if (type === "steamtube") {
        sprite("steam", x, y, angle);
        sprite("valve", x, y, angle);
        return;
    }
    if (type === "rocket") {
        if (enabled(item.isrotatable)) sprite("rocketbase", x, y);
        sprite("rocket", x, y, angle - 180, map.timetravel ? 0.71 : 0.7);
        return;
    }
    if (type === "load") {
        sprite("snail", x, y, angle);
        sprite("snaileyes", x, y, angle);
        return;
    }
    const names = {gravityswitch: "gravity", bouncer1: "bouncerone", bouncer2: "bouncertwo", gap: "mouse", ants: "ant"};
    if (["candy", "candyleft", "candyright"].includes(type) && map.objects.some(value => value.type === "lantern" && enabled(value.candycaptured))) return;
    sprite(names[type] || type, x, y, type === "pump" ? angle + 90 : angle, ["candyleft", "candyright"].includes(type) ? 0.71 : 1);
}
