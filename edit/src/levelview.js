import {artwork, parse} from "/src/js/browser/renderer/data.js";
import {draw, framing} from "/src/js/browser/renderer/draw.js";
import {decode} from "/raw2png/src/textures.js";
import {levelbackground} from "./levelbackground.js";

const pending = new WeakMap();
const svgspace = "http://www.w3.org/2000/svg";

function element(tag, classname = "", text = "") {
    const node = document.createElement(tag);
    if (classname) node.className = classname;
    if (text) node.textContent = text;
    return node;
}

function shape(tag, attributes) {
    const node = document.createElementNS(svgspace, tag);
    for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
    return node;
}

function button(text, classname = "") {
    const node = element("button", ("buttonart " + classname).trim(), text);
    node.type = "button";
    return node;
}

function stepinput(name, step) {
    const label = element("label", "", name);
    const input = element("input", "hintvalue");
    input.type = "number";
    input.step = step;
    label.append(input);
    return {label, input};
}

function selectinput(name) {
    const label = element("label", "", name);
    const input = element("select", "hintselect");
    label.append(input);
    return {label, input};
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

    viewport.addEventListener("dblclick", event => {
        if (event.target.closest(".hintpoint,[data-adding]")) return;
        x = y = 0;
        scale = 1;
        render();
    });
}

async function firefly(bytes) {
    if (!bytes?.length) return "";
    const png = await decode(bytes);
    const image = await createImageBitmap(new Blob([png], {type: "image/png"}));
    try {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d", {willReadFrequently: true});
        context.drawImage(image, 0, 0);
        const {data} = context.getImageData(0, 0, canvas.width, canvas.height);
        const regions = [];
        let start;
        for (let y = 0; y <= image.height; y++) {
            let visible = false;
            for (let x = 0; x < image.width && y < image.height && !visible; x++) {
                visible = data[(y * image.width + x) * 4 + 3] >= 16;
            }
            if (visible && start === undefined) start = y;
            if (!visible && start !== undefined) {
                if (y - start >= image.width / 5) regions.push([start, y]);
                start = undefined;
            }
        }
        const region = regions[1] ?? regions[0];
        if (!region) return "";
        const [top, bottom] = region;
        let left = image.width;
        let right = 0;
        for (let y = top; y < bottom; y++) {
            for (let x = 0; x < image.width; x++) {
                if (data[(y * image.width + x) * 4 + 3] < 16) continue;
                left = Math.min(left, x);
                right = Math.max(right, x);
            }
        }
        canvas.width = right - left + 1;
        canvas.height = bottom - top;
        context.drawImage(image, left, top, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL();
    } finally {
        image.close();
    }
}

function replaypoints(replay) {
    if (!replay) return [];
    return replay.events.flatMap((event, index) => (event.touches ?? [event]).map(point => ({event, index, point})));
}

function strokes(points) {
    const paths = [];
    const current = new Map();
    for (const {point} of points) {
        if (point.phase === "down" || !current.has(point.pointer)) {
            const path = [];
            paths.push(path);
            current.set(point.pointer, path);
        }
        current.get(point.pointer).push(point);
        if (point.phase === "up") current.delete(point.pointer);
    }
    return paths;
}

/*//////////////////////////////////////////////////////////////////////*/

function hintsview(root, stage, map, hint, fairy, onchange) {
    const replays = structuredClone(hint?.replays ?? []);
    const toggle = button("Edit hints", "hinttoggle");
    const tools = element("div", "hintcontrols");
    const corner = element("div", "pkglevelhints");
    const replayselect = selectinput("Replay");
    const pointselect = selectinput("Point");
    const xpos = stepinput("X", "0.1");
    const ypos = stepinput("Y", "0.1");
    const time = stepinput("Time", "0.01");
    const add = button("Add point", "hintadd");
    const overlay = shape("svg", {class: "hintoverlay", viewBox: `0 0 ${map.width} ${map.height}`});
    const status = element("p", "hintstatus");
    status.setAttribute("role", "status");
    const paths = shape("g", {class: "hintpaths"});
    const handles = shape("g", {class: "hinthandles"});
    overlay.append(paths, handles);
    stage.append(overlay);
    tools.append(replayselect.label, pointselect.label, xpos.label, ypos.label, time.label, add);
    corner.append(toggle, tools, status);
    root.append(corner);

    let editing = false;
    let adding = false;
    let replayindex = 0;
    let selected;
    let drag;
    const generated = new WeakSet();

    function notify() {
        const report = structuredClone(replays);
        try {
            Promise.resolve(onchange(report, replayindex)).catch(error => {status.textContent = error.message});
        } catch (error) {
            status.textContent = error.message;
        }
    }

    function refreshfields(points) {
        const current = points.findIndex(entry => entry.point === selected);
        pointselect.input.replaceChildren(...points.map((_, index) => new Option(String(index + 1), String(index))));
        pointselect.input.value = String(current);
        pointselect.label.hidden = !points.length;
        replayselect.label.hidden = replays.length < 2;
        for (const field of [xpos, ypos, time]) field.label.hidden = current < 0;
        if (current < 0) return;
        xpos.input.value = Number(selected.x.toFixed(2));
        ypos.input.value = Number(selected.y.toFixed(2));
        time.input.value = Number(points[current].event.time.toFixed(3));
    }

    function drawpaths(points) {
        const lines = [];
        for (const stroke of strokes(points)) {
            const coordinates = stroke.map(point => point.x + "," + point.y).join(" ");
            lines.push(shape("polyline", {class: "hintshadow", points: coordinates}),
                shape("polyline", {class: "hintline", points: coordinates}));
            const last = stroke.at(-1);
            const size = 28;
            lines.push(fairy
                ? shape("image", {class: "hintfairy", href: fairy, x: last.x - size / 2, y: last.y - size, width: size, height: size})
                : shape("circle", {class: "hintend", cx: last.x, cy: last.y, r: 4}));
        }
        paths.replaceChildren(...lines);
    }

    function refresh(full = true) {
        const points = replaypoints(replays[replayindex]);
        tools.hidden = !editing;
        overlay.toggleAttribute("hidden", !editing);
        overlay.toggleAttribute("data-editing", editing);
        overlay.toggleAttribute("data-adding", adding);
        toggle.setAttribute("aria-expanded", String(editing));
        toggle.textContent = editing ? "Done editing hints" : "Edit hints";
        add.textContent = adding ? "Cancel point" : "Add point";
        status.textContent = adding ? "Click the level to place a point." : "";
        if (!editing) return;
        drawpaths(points);
        handles.replaceChildren(...points.map(({point}, index) => shape("circle", {
            class: point === selected ? "hintpoint hintselected" : "hintpoint",
            cx: point.x, cy: point.y, r: point === selected ? 5 : 3.5,
            "data-point": index
        })));
        if (full) {
            replayselect.input.replaceChildren(...replays.map((replay, index) => new Option(replay.label ?? String(index + 1), String(index))));
            replayselect.input.value = String(replayindex);
            refreshfields(points);
        }
    }

    function eventposition(event) {
        const bounds = overlay.getBoundingClientRect();
        return {
            x: limit((event.clientX - bounds.left) / bounds.width * map.width, 0, map.width),
            y: limit((event.clientY - bounds.top) / bounds.height * map.height, 0, map.height)
        };
    }

    function insert(position) {
        const replay = replays[replayindex] ?? {events: []};
        replays[replayindex] = replay;
        if (!replay.events.length) {
            const first = {time: 0, pointer: 0, phase: "down", ...position};
            const end = {time: 0.08, pointer: 0, phase: "up", ...position};
            replay.events.push(first, end);
            generated.add(end);
            selected = first;
        } else {
            const points = replaypoints(replay);
            const previous = points.find(entry => entry.point === selected) ?? points.at(-1);
            const index = previous.index + Number(previous.point.phase !== "up");
            const earliest = replay.events[index - 1]?.time ?? 0;
            const latest = replay.events[index]?.time ?? earliest + 0.08;
            const time = (earliest + latest) / 2;
            selected = {time, pointer: previous.point.pointer, phase: "move", ...position};
            const next = replay.events[index];
            if (next && generated.has(next)) Object.assign(next, position);
            replay.events.splice(index, 0, selected);
            if (replay.expected !== undefined) replay.expected++;
        }
        adding = false;
        refresh();
        notify();
    }

    function fieldchange(field, key, min, max) {
        field.input.addEventListener("change", () => {
            const value = field.input.valueAsNumber;
            if (!selected || !Number.isFinite(value)) return refresh();
            selected[key] = limit(value, min, max);
            refresh();
            notify();
        });
    }

    toggle.addEventListener("click", () => {
        editing = !editing;
        adding = false;
        if (editing && !selected) selected = replaypoints(replays[replayindex])[0]?.point;
        refresh();
    });
    add.addEventListener("click", () => {
        adding = !adding;
        refresh();
    });
    replayselect.input.addEventListener("change", () => {
        replayindex = Number(replayselect.input.value);
        selected = replaypoints(replays[replayindex])[0]?.point;
        adding = false;
        refresh();
    });
    pointselect.input.addEventListener("change", () => {
        selected = replaypoints(replays[replayindex])[Number(pointselect.input.value)]?.point;
        refresh();
    });
    fieldchange(xpos, "x", 0, map.width);
    fieldchange(ypos, "y", 0, map.height);
    time.input.addEventListener("change", () => {
        const replay = replays[replayindex];
        const point = replaypoints(replay).find(entry => entry.point === selected);
        if (!point || !Number.isFinite(time.input.valueAsNumber)) return refresh();
        point.event.time = limit(time.input.valueAsNumber, replay.events[point.index - 1]?.time ?? 0,
            replay.events[point.index + 1]?.time ?? 3600);
        refresh();
        notify();
    });
    overlay.addEventListener("pointerdown", event => {
        if (event.button || !editing || drag) return;
        if (adding) {
            event.preventDefault();
            insert(eventposition(event));
            return;
        }
        const index = event.target.dataset.point;
        if (index === undefined) return;
        event.preventDefault();
        selected = replaypoints(replays[replayindex])[Number(index)].point;
        drag = {id: event.pointerId, x: selected.x, y: selected.y};
        overlay.setPointerCapture(event.pointerId);
        refresh();
    });
    overlay.addEventListener("pointermove", event => {
        if (drag?.id !== event.pointerId) return;
        Object.assign(selected, eventposition(event));
        refresh(false);
    });
    overlay.addEventListener("pointerup", event => {
        if (drag?.id !== event.pointerId) return;
        const moved = selected.x !== drag.x || selected.y !== drag.y;
        drag = undefined;
        refresh();
        if (moved) notify();
    });
    overlay.addEventListener("pointercancel", event => {
        if (drag?.id !== event.pointerId) return;
        selected.x = drag.x;
        selected.y = drag.y;
        drag = undefined;
        refresh();
    });
    refresh();
}

export function clearlevel(container) {
    pending.delete(container);
    container.replaceChildren();
}

export async function renderlevel(container, {xml, box = 1, packageid, boxart, hint = null, fairy, onhintchange}) {
    clearlevel(container);
    const current = {};
    pending.set(container, current);
    const map = {...parse(xml), box};
    const backdrop = await levelbackground(map, box, packageid, boxart);
    try {
        const [art, sprite] = await Promise.all([artwork("normal"), onhintchange ? firefly(fairy).catch(() => "") : ""]);
        if (pending.get(container) !== current) return;
        const root = element("div", "pkglevelview");
        const holder = element("div", "pkglevelholder");
        const stage = element("div", "pkglevelstage");
        stage.style.setProperty("--levelratio", map.width / map.height);
        stage.append(scene(map, art, backdrop?.paint ?? backdrop));
        holder.append(stage);
        root.append(holder);
        if (onhintchange) hintsview(root, stage, map, hint, sprite, onhintchange);
        levelcamera(holder, stage);
        container.replaceChildren(root);
    } finally {
        backdrop?.close?.();
    }
}
