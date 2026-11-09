import {artwork, level, picture} from "./data.js";
import {draw} from "./draw.js";

const records = new Map();
const pending = new Set();
const root = document.documentElement;
let working = false;
let detail = null;
let resize;

function queue(record) {
    if (!record.visible || !record.canvas.isConnected || document.hidden) return;
    pending.add(record);
    if (!working) void render();
}

async function render() {
    working = true;
    while (pending.size) {
        if (document.hidden) break;
        const record = pending.values().next().value;
        pending.delete(record);
        if (!record.visible || !record.canvas.isConnected) continue;
        const version = record.version;
        try {
            const [map, art, background] = await Promise.all([
                level(record.entry.file), artwork(true),
                record.entry.background ? picture(record.entry.background).catch(() => null) : null
            ]);
            if (version !== record.version || !record.canvas.isConnected || !record.visible) continue;
            const box = record.canvas.getBoundingClientRect();
            if (box.width < 1 || box.height < 1) continue;
            draw(record.canvas, map, art, background, box.width, box.height, 0.6, record.detail);
            record.canvas.dataset.ready = "true";
            delete record.canvas.dataset.error;
        } catch {
            record.canvas.dataset.error = "true";
        }
        await new Promise(resolve => setTimeout(resolve, 0));
    }
    working = false;
}

const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
    for (const entry of entries) {
        const record = records.get(entry.target);
        if (!record) continue;
        record.visible = entry.isIntersecting;
        if (record.visible && !record.canvas.dataset.ready) queue(record);
    }
}, {rootMargin: "100px"}) : null;

const sizes = "ResizeObserver" in window ? new ResizeObserver(entries => {
    for (const entry of entries) {
        const record = records.get(entry.target);
        if (record) queue(record);
    }
}) : null;

function create(entry, expanded) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    canvas.className = expanded ? "levelscene" : "levelbg levelcanvas";
    canvas.setAttribute("aria-hidden", "true");
    const record = {canvas, entry, detail: expanded, visible: expanded || !observer, version: 0};
    records.set(canvas, record);
    if (expanded) document.body.prepend(canvas);
    observer?.observe(canvas);
    sizes?.observe(canvas);
    if (record.visible) queue(record);
    if (!observer && !expanded) requestAnimationFrame(() => queue(record));
    return record;
}

function remove(record) {
    record.version++;
    pending.delete(record);
    observer?.unobserve(record.canvas);
    sizes?.unobserve(record.canvas);
    records.delete(record.canvas);
    record.canvas.width = record.canvas.height = 1;
    record.canvas.remove();
}

/*//////////////////////////////////////////////////////////////////////*/

export function thumbnail(entry) {
    return create(entry, false).canvas;
}

export function clearthumbnails() {
    for (const record of records.values()) if (!record.detail) remove(record);
}

export function scene(entry) {
    if (!entry) {
        if (detail) remove(detail);
        detail = null;
        return;
    }
    if (detail?.entry === entry) return;
    if (detail) remove(detail);
    detail = create(entry, true);
}

window.addEventListener("resize", () => {
    clearTimeout(resize);
    resize = setTimeout(() => {
        for (const record of records.values()) queue(record);
    }, 120);
}, {passive: true});

document.addEventListener("visibilitychange", () => {
    if (!document.hidden) for (const record of records.values()) queue(record);
});

document.addEventListener("homeviewchange", () => {
    if (root.classList.contains("documentopen")) scene(null);
});
