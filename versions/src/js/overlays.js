const active = new Set();
const masked = new Map();
let frame = 0;

/*//////////////////////////////////////////////////////////////////////*/

function level(element) {
    for (let node = element; node instanceof Element; node = node.parentElement) {
        const value = getComputedStyle(node).zIndex;
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
    return {element, bounds, level: level(element), radius: parseFloat(style.borderTopLeftRadius) || 0};
}

function number(value) {
    return Math.round(value * 1000) / 1000;
}

function maskimage(target, covers) {
    const width = number(target.bounds.width + 32);
    const height = number(target.bounds.height + 32);
    const cutouts = covers.map(cover => {
        const x = number(cover.bounds.left - target.bounds.left + 16);
        const y = number(cover.bounds.top - target.bounds.top + 16);
        const radius = number(Math.min(cover.radius, cover.bounds.width / 2, cover.bounds.height / 2));
        return `<rect x="${x}" y="${y}" width="${number(cover.bounds.width)}" height="${number(cover.bounds.height)}" rx="${radius}"/>`;
    }).join("\n");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
        <defs>
            <mask id="cut" x="0" y="0" width="${width}" height="${height}" maskUnits="userSpaceOnUse" mask-type="luminance">
                <rect width="${width}" height="${height}" fill="#fff"/>
                <g fill="#000">${cutouts}</g>
            </mask>
        </defs>
        <rect width="${width}" height="${height}" fill="#fff" opacity="0.25"/>
        <rect width="${width}" height="${height}" fill="#fff" mask="url(#cut)"/>
    </svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
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
            if (covers.length) changes.set(element, maskimage(target, covers));
        }
    }
    for (const element of masked.keys()) {
        if (changes.has(element)) continue;
        element.classList.remove("overlaymasked");
        element.style.removeProperty("--overlaymask");
        masked.delete(element);
    }
    for (const [element, image] of changes) {
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

const observer = new ResizeObserver(schedule);

export function setoverlay(element, visible) {
    if (!element) return;
    if (visible) {
        active.add(element);
        observer.observe(element);
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
