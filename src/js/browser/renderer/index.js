import {fallback} from "../catalogue/metadata.js";
import {artwork, level, background} from "./data.js";
import {draw} from "./draw.js";
import {cached, remember, density} from "./cache.js";

const records = new Map();
const pending = new Set();
const root = document.documentElement;
let working = false;
let detail = null;
let resize;

function paused() {
    return document.hidden || root.classList.contains("gameloading") || root.classList.contains("gameopen") || root.classList.contains("documentdocumentation");
}

function queue(record) {
    if (record.static || !record.visible || !record.canvas.isConnected || paused()) return;
    pending.add(record);
    if (!working) void render();
}

async function render() {
    working = true;
    while (pending.size) {
        if (paused()) break;
        const record = pending.values().next().value;
        pending.delete(record);
        if (!record.visible || !record.canvas.isConnected) continue;
        const version = record.version;
        try {
            const box = record.canvas.getBoundingClientRect();
            if (box.width < 1 || box.height < 1) continue;
            const saved = !record.detail && cached(record.entry, box.width, box.height);
            if (saved) {
                record.canvas.width = saved.width;
                record.canvas.height = saved.height;
                record.canvas.getContext("2d").drawImage(saved, 0, 0);
                record.canvas.dataset.ready = "true";
                continue;
            }
            const [map, art, backdrop] = await resources(record);
            if (version !== record.version || !record.canvas.isConnected || !record.visible || paused()) continue;
            const pack = Number(record.entry.background?.match(/\/box(\d+)\.webp$/)?.[1]) || 1;
            draw(record.canvas, {...map, box: pack}, art, backdrop, box.width, box.height, record.detail ? 0.6 : density(), record.detail);
            if (!record.detail) remember(record.entry, box.width, box.height, record.canvas);
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
        record.intersecting = entry.isIntersecting;
        record.visible = record.intersecting || record.preload;
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
    const record = {canvas, entry, detail: expanded, visible: expanded || !observer, intersecting: !observer, version: 0};
    if (entry.engine) {
        record.static = true;
        records.set(canvas, record);
        const image = fallback(entry);
        canvas.dataset.ready = "true";
        canvas.style.backgroundImage = (expanded ? "linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5))," : "") + 'url("' + image + '")';
        if (expanded) {
            root.style.setProperty("--levelbackground", 'url("' + image + '")');
            document.body.prepend(canvas);
        }
        return record;
    }
    records.set(canvas, record);
    if (expanded) {
        const background = /^\/assets\/images\/level\/box\d+\.webp$/.test(entry.background || "") ? entry.background : "/assets/images/level/box1.webp";
        root.style.setProperty("--levelbackground", `url("${background}")`);
        canvas.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url("${background}")`;
        document.body.prepend(canvas);
    } else if (/^\/assets\/images\/level\/box\d+\.webp$/.test(entry.background || "")) canvas.style.backgroundImage = `url("${entry.background}")`;
    observer?.observe(canvas);
    sizes?.observe(canvas);
    if (record.visible) queue(record);
    if (!observer && !expanded) requestAnimationFrame(() => queue(record));
    return record;
}

function resources(record) {
    const {entry} = record;
    const map = entry.file ? level(entry.file, !record.detail && record.preload && !record.intersecting) : Promise.reject(new Error("Level file unavailable"));
    return Promise.all([map, artwork("low"), map.then(data => entry.background ? background(entry.background, data).catch(() => null) : null)]);
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

export function warmthumbnails(container) {
    for (const record of records.values()) {
        if (!container.contains(record.canvas)) continue;
        record.preload = record.visible = true;
        queue(record);
    }
}

export function clearthumbnails(container) {
    for (const record of records.values()) {
        if (!record.detail && (!container || container.contains(record.canvas))) remove(record);
    }
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
    if (!paused()) for (const record of records.values()) queue(record);
});

document.addEventListener("gameviewchange", () => {
    if (!paused()) for (const record of records.values()) queue(record);
});
