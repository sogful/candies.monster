const active = new Set();
const masked = new Map();
const shapes = new WeakMap();
let definitions = null;
let sequence = 0;
let frame = 0;

/*//////////////////////////////////////////////////////////////////////*/

function level(element, style) {
    for (let node = element; node instanceof Element; node = node.parentElement) {
        const value = (node === element ? style : getComputedStyle(node)).zIndex;
        if (value !== "auto") return Number(value) || 0;
    }
    return 0;
}

function measure(element) {
    if (!element.isConnected || !element.getClientRects().length) return null;
    const style = getComputedStyle(element);
    if (style.visibility === "hidden") return null;
    const bounds = element.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return null;
    return {element, bounds, level: level(element, style), radius: parseFloat(style.borderTopLeftRadius) || 0};
}

function number(value) {
    return Math.round(value * 1000) / 1000;
}

function svgnode(tag, attributes) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
    return node;
}

function maskimage(target, covers) {
    const width = number(target.bounds.width + 32);
    const height = number(target.bounds.height + 32);
    const cutouts = covers.map(cover => ({
        x: number(cover.bounds.left - target.bounds.left),
        y: number(cover.bounds.top - target.bounds.top),
        width: number(cover.bounds.width), height: number(cover.bounds.height),
        rx: number(Math.min(cover.radius, cover.bounds.width / 2, cover.bounds.height / 2))
    }));
    const key = JSON.stringify([width, height, cutouts]);
    let shape = shapes.get(target.element);
    if (shape?.key === key) return shape.url;
    if (!shape) {
        if (!definitions) {
            definitions = svgnode("svg", {class: "overlaydefinitions", "aria-hidden": "true", focusable: "false"});
            document.body.appendChild(definitions);
        }
        const suffix = ++sequence;
        const cut = svgnode("mask", {id: `overlaycut${suffix}`, maskUnits: "userSpaceOnUse", "mask-type": "luminance"});
        const mask = svgnode("mask", {id: `overlaymask${suffix}`, maskUnits: "userSpaceOnUse", "mask-type": "alpha"});
        const space = svgnode("rect", {fill: "#fff"});
        const holes = svgnode("g", {fill: "#000"});
        const base = svgnode("rect", {fill: "#fff", opacity: "0.25"});
        const outside = svgnode("rect", {fill: "#fff", mask: `url(#overlaycut${suffix})`});
        cut.append(space, holes);
        mask.append(base, outside);
        definitions.append(cut, mask);
        shape = {cut, mask, space, holes, base, outside, url: `url("#overlaymask${suffix}")`};
        shapes.set(target.element, shape);
    }
    for (const node of [shape.cut, shape.mask, shape.space, shape.base, shape.outside]) {
        for (const [name, value] of Object.entries({x: -16, y: -16, width, height})) node.setAttribute(name, value);
    }
    shape.holes.replaceChildren(...cutouts.map(attributes => svgnode("rect", attributes)));
    shape.key = key;
    return shape.url;
}

/*//////////////////////////////////////////////////////////////////////*/

function refresh() {
    cancelAnimationFrame(frame);
    frame = 0;
    const panels = [...active].map(measure).filter(Boolean);
    const targets = new Set([...document.querySelectorAll(".gamescreen,.versionscreen,.backbutton,.scrollnav,.infobutton"), ...active]);
    const changes = new Map();
    if (panels.length) {
        for (const element of targets) {
            const target = measure(element);
            if (!target) continue;
            const covers = panels.filter(panel => panel.element !== element && panel.level > target.level &&
                panel.bounds.left < target.bounds.right + 16 && panel.bounds.right > target.bounds.left - 16 &&
                panel.bounds.top < target.bounds.bottom + 16 && panel.bounds.bottom > target.bounds.top - 16);
            if (covers.length) changes.set(element, {target, covers});
        }
    }
    for (const element of masked.keys()) {
        if (changes.has(element)) continue;
        element.classList.remove("overlaymasked");
        element.style.removeProperty("--overlaymask");
        masked.delete(element);
    }
    for (const [element, {target, covers}] of changes) {
        const image = maskimage(target, covers);
        if (masked.get(element) === image) continue;
        element.style.setProperty("--overlaymask", image);
        element.classList.add("overlaymasked");
        masked.set(element, image);
    }
}

function schedule() {
    if (!active.size || frame) return;
    frame = requestAnimationFrame(refresh);
}

const observer = new ResizeObserver(refresh);

export function setoverlay(element, visible) {
    if (!element) return;
    if (visible) {
        if (!active.has(element)) {
            active.add(element);
            observer.observe(element);
        }
    } else {
        active.delete(element);
        observer.unobserve(element);
    }
    refresh();
}

/*//////////////////////////////////////////////////////////////////////*/

document.addEventListener("scroll", schedule, {capture: true, passive: true});
window.addEventListener("resize", schedule, {passive: true});
window.visualViewport?.addEventListener("resize", schedule, {passive: true});
window.visualViewport?.addEventListener("scroll", schedule, {passive: true});
window.addEventListener("hashchange", schedule);
