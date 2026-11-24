import {artwork, parse} from "/src/js/browser/renderer/data.js";
import {draw, framing} from "/src/js/browser/renderer/draw.js";
import {hintview} from "./hintview.js";
import {levelbackground} from "./levelbackground.js";

const pending = new WeakMap();

function element(tag, classname = "", text = "") {
    const node = document.createElement(tag);
    if (classname) node.className = classname;
    if (text) node.textContent = text;
    return node;
}

function limit(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

/*//////////////////////////////////////////////////////////////////////*/

function scene(map, art, image) {
    const bounds = framing(map);
    const scale = Math.min(2, 1800 / Math.max(bounds.width, bounds.height));
    const backing = document.createElement("canvas");
    const width = Math.round(bounds.width * scale);
    const height = Math.round(bounds.height * scale);
    draw(backing, map, art, image, width, height, 1, false, true);
    const projection = Math.min(width / bounds.width, height / bounds.height);
    const canvas = element("canvas", "pkglevelcanvas");
    canvas.width = Math.ceil(map.width * projection);
    canvas.height = Math.ceil(map.height * projection);
    canvas.getContext("2d").drawImage(backing, -bounds.x * projection, -bounds.y * projection,
        map.width * projection, map.height * projection, 0, 0, canvas.width, canvas.height);
    return canvas;
}

function levelcamera(viewport, stage) {
    const pointers = new Map();
    let x = 0;
    let y = 0;
    let scale = 1;

    function render() {
        stage.style.transform = `translate(${x}px,${y}px) scale(${scale})`;
    }

    function zoom(factor, clientx, clienty) {
        const bounds = viewport.getBoundingClientRect();
        const anchorx = clientx - bounds.left - bounds.width / 2;
        const anchory = clienty - bounds.top - bounds.height / 2;
        const next = limit(scale * factor, 0.25, 8);
        x = anchorx - (anchorx - x) * next / scale;
        y = anchory - (anchory - y) * next / scale;
        scale = next;
    }

    viewport.addEventListener("wheel", event => {
        event.preventDefault();
        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1;
        zoom(Math.exp(-limit(event.deltaY * unit, -300, 300) / 450), event.clientX, event.clientY);
        render();
    }, {passive: false});

    viewport.addEventListener("pointerdown", event => {
        if (event.defaultPrevented || event.button || pointers.size >= 2) return;
        pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
        viewport.setPointerCapture(event.pointerId);
        viewport.classList.add("levelpanning");
    });

    viewport.addEventListener("pointermove", event => {
        const previous = pointers.get(event.pointerId);
        if (!previous) return;
        const point = {x: event.clientX, y: event.clientY};
        const other = [...pointers.entries()].find(([id]) => id !== event.pointerId)?.[1];
        if (other) {
            const before = Math.hypot(previous.x - other.x, previous.y - other.y);
            const after = Math.hypot(point.x - other.x, point.y - other.y);
            if (before > 1 && after > 1) zoom(after / before, (previous.x + other.x) / 2, (previous.y + other.y) / 2);
        }
        const count = other ? 2 : 1;
        x += (point.x - previous.x) / count;
        y += (point.y - previous.y) / count;
        pointers.set(event.pointerId, point);
        render();
    });

    for (const name of ["pointerup", "pointercancel", "lostpointercapture"]) {
        viewport.addEventListener(name, event => {
            pointers.delete(event.pointerId);
            if (!pointers.size) viewport.classList.remove("levelpanning");
        });
    }

    viewport.addEventListener("dblclick", () => {
        x = y = 0;
        scale = 1;
        render();
    });
}

export function clearlevel(container) {
    pending.get(container)?.stophint?.();
    pending.delete(container);
    container.replaceChildren();
}

export async function renderlevel(container, {xml, box = 1, packageid, boxart, replays = []}) {
    clearlevel(container);
    const current = {};
    pending.set(container, current);
    const map = {...parse(xml), box};
    const backdrop = await levelbackground(map, box, packageid, boxart);
    try {
        const art = await artwork("normal");
        if (pending.get(container) !== current) return;
        const root = element("div", "pkglevelview");
        const holder = element("div", "pkglevelholder");
        const stage = element("div", "pkglevelstage");
        stage.style.setProperty("--levelratio", map.width / map.height);
        const canvas = scene(map, art, backdrop?.paint ?? backdrop);
        stage.append(canvas);
        holder.append(stage);
        root.append(holder);
        current.stophint = hintview(root, stage, canvas, map, replays);
        levelcamera(holder, stage);
        container.replaceChildren(root);
    } finally {
        backdrop?.close?.();
    }
}
