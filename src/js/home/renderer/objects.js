import {number, enabled} from "./data.js";

export function painter(context, art) {
    return function sprite(name, x, y, angle = 0, scale = 1) {
        const frame = art.frames[name];
        if (!frame) return;
        context.save();
        context.translate(x, y);
        context.rotate(angle * Math.PI / 180);
        context.scale(scale, scale);
        context.drawImage(art.image, ...frame.rect.map(value => value * art.ratio), ...frame.offset, ...frame.size);
        context.restore();
    };
}

function line(context, points, color, width, dashed = false) {
    context.save();
    context.strokeStyle = color;
    context.lineWidth = width;
    context.lineCap = "round";
    if (dashed) context.setLineDash([3, 4]);
    context.beginPath();
    context.moveTo(...points[0]);
    for (const point of points.slice(1)) context.lineTo(...point);
    context.stroke();
    context.restore();
}

export function rope(context, object, map) {
    if (enabled(object.invisible) || enabled(object.gun) || enabled(object.kicked)) return;
    const radius = number(object.radius, -1);
    if (radius > 0) {
        context.save();
        context.strokeStyle = "rgba(255,255,255,0.6)";
        context.lineWidth = 1;
        context.setLineDash([3, 4]);
        context.beginPath();
        context.arc(object.x, object.y, radius, 0, Math.PI * 2);
        context.stroke();
        context.restore();
        return;
    }
    const type = enabled(object.bindbulb) ? "lightbulb" : object.axenumber ? "axe" : "candy";
    const candidates = map.objects.filter(item => item.type === type || type === "candy" && ["candyleft", "candyright"].includes(item.type));
    const target = candidates.find(item => type === "axe" ? item.axenumber === object.axenumber : type === "lightbulb" ? item.bulbnumber === object.bulbnumber : object.candynumber ? item.candynumber === object.candynumber : map.split ? item.type === (object.part === "L" ? "candyleft" : "candyright") : true) || candidates[0];
    if (!target) return;
    const distance = Math.hypot(target.x - object.x, target.y - object.y);
    const slack = Math.min(60, Math.max(0, number(object.length) - distance) * 0.5);
    context.save();
    context.lineCap = "round";
    for (const [color, width] of [["#614024", 3], ["#e7b969", 1.5]]) {
        context.strokeStyle = color;
        context.lineWidth = width;
        context.beginPath();
        context.moveTo(object.x, object.y);
        context.quadraticCurveTo((object.x + target.x) / 2, (object.y + target.y) / 2 + slack, target.x, target.y);
        context.stroke();
    }
    context.restore();
}

/*//////////////////////////////////////////////////////////////////////*/

export function object(context, sprite, item, map) {
    const {type, x, y, angle} = item;
    if (type === "candy") {
        if (map.objects.some(value => value.type === "lantern" && enabled(value.candycaptured))) return;
        for (const name of ["candybase", "candy", "candytop"]) sprite(name, x, y, angle, 0.71);
        return;
    }
    if (type === "axe") {
        sprite("axe", x, y, angle);
        sprite("axepivot", x, y);
        return;
    }
    if (type.startsWith("spike")) {
        const size = Math.max(1, Math.min(4, Math.round(number(item.size, number(type.slice(-1), 1)))));
        sprite((item.toggled && item.toggled !== "false" ? "rotatespike" : "spike") + ["one", "two", "three", "four"][size - 1], x, y, angle);
        return;
    }
    if (type === "grab") {
        if (enabled(item.invisible)) return;
        const move = number(item.movelength, -1);
        if (move > 0) {
            const vertical = enabled(item.movevertical);
            line(context, [[x, y], [x + (vertical ? 0 : move), y + (vertical ? move : 0)]], "#a7acb3", 5);
        }
        if (enabled(item.gun)) {
            sprite("gunback", x, y, angle);
            sprite("gunfront", x, y, angle);
        } else if (enabled(item.wheel)) sprite("wheel", x, y);
        else sprite(number(item.radius, -1) > 0 ? "automatic" : "grab", x, y);
        if (enabled(item.spider)) sprite("spider", x, y + 12);
        if (enabled(item.helicopter)) {
            sprite("beewings", x, y);
            sprite("bee", x, y);
        }
        return;
    }
    if (type === "target") {
        sprite("support", x, y);
        sprite(number(item.targettype) === 11 ? "ancestor" : "target", x, y);
        return;
    }
    if (type === "rotatedcircle") {
        const radius = Math.max(10, number(item.size, 80));
        sprite("disc", x, y, number(item.handleangle), radius * 2 / (1066 / 3));
        const radians = number(item.handleangle) * Math.PI / 180;
        for (const side of enabled(item.onehandle) ? [-1] : [-1, 1]) sprite("dischandle", x + Math.cos(radians) * radius * side, y + Math.sin(radians) * radius * side);
        return;
    }
    if (type === "hand") {
        let last = [x, y];
        sprite("handbase", x, y);
        for (let index = 1; index <= Math.min(12, number(item.segmentscount, 1)); index++) {
            const rotation = number(item["segment" + index + "angle"]);
            const radians = rotation * Math.PI / 180;
            const length = Math.min(1000, number(item["segment" + index + "length"], 40));
            const next = [last[0] + Math.cos(radians) * length, last[1] + Math.sin(radians) * length];
            line(context, [last, next], "#60636a", 8);
            line(context, [last, next], "#c6cbd0", 4);
            sprite("handjoint", ...last);
            last = next;
            if (index === number(item.segmentscount, 1)) sprite("hand", ...last, rotation);
        }
        return;
    }
    if (type === "transporter" || type === "conveyorbelt") {
        const length = Math.max(20, Math.min(2000, number(item.length, 100)));
        context.save();
        context.translate(x, y);
        context.rotate(-angle * Math.PI / 180);
        line(context, [[0, 0], [length, 0]], "#504b42", Math.max(12, number(item.width, 20)));
        for (let position = 0; position < length; position += 65) sprite("belt", position, 0);
        sprite("beltend", 0, 0);
        sprite("beltend", length, 0, 180);
        context.restore();
        return;
    }
    if (type === "ghost") {
        sprite("ghost", x, y);
        sprite("ghostface", x, y);
        return;
    }
    if (type === "lightbulb") {
        sprite("light", x, y);
        sprite("lightbulb", x, y);
        sprite("bulbcap", x, y);
        return;
    }
    if (type === "steamtube") {
        sprite("steam", x, y, angle);
        sprite("valve", x, y, angle);
        return;
    }
    if (type === "rocket") {
        sprite("rocketbase", x, y, angle);
        sprite("rocket", x, y, angle);
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
